import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@/lib/supabase/server";
import { chatBodySchema } from "@/lib/validations";

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = chatBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { botId, message } = parsed.data;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: bot, error: botErr } = await supabase
    .from("bots")
    .select("id, organization_id, name")
    .eq("id", botId)
    .single();

  if (botErr || !bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const { data: member } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", bot.organization_id)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: docs } = await supabase
    .from("documents")
    .select("content")
    .eq("bot_id", botId)
    .limit(20);

  const context = (docs ?? [])
    .map((d) => d.content)
    .join("\n---\n")
    .slice(0, 12_000);

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    const fallback =
      "OpenAI is not configured (set OPENAI_API_KEY). Here is a stub response based on your message.";
    await supabase.from("messages").insert({
      bot_id: botId,
      user_message: message,
      bot_response: fallback,
    });
    return NextResponse.json({ reply: fallback });
  }

  const openai = new OpenAI({ apiKey });
  const system = `You are a helpful assistant for a dental clinic. Use the following knowledge when relevant. If something is not in the knowledge, say you are not sure and suggest contacting the clinic.\n\nKnowledge:\n${context || "(no documents yet)"}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: system },
      { role: "user", content: message },
    ],
    temperature: 0.4,
  });

  const reply =
    completion.choices[0]?.message?.content?.trim() ??
    "Sorry, I could not generate a reply.";

  await supabase.from("messages").insert({
    bot_id: botId,
    user_message: message,
    bot_response: reply,
  });

  return NextResponse.json({ reply });
}
