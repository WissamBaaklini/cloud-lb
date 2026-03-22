import { NextResponse } from "next/server";
import OpenAI from "openai";
import { createServiceClient } from "@/lib/supabase/service";
import { chatBodySchema } from "@/lib/validations";

/**
 * Public widget endpoint — uses service role to write messages (never expose this key to the client).
 * Set SUPABASE_SERVICE_ROLE_KEY on the server for production widgets.
 */
export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = chatBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = createServiceClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Widget backend not configured (SUPABASE_SERVICE_ROLE_KEY)." },
      { status: 503 },
    );
  }

  const { botId, message } = parsed.data;

  const { data: bot, error: botErr } = await supabase
    .from("bots")
    .select("id, name")
    .eq("id", botId)
    .single();

  if (botErr || !bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
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
      "OpenAI is not configured on the server. Add OPENAI_API_KEY to enable AI replies.";
    await supabase.from("messages").insert({
      bot_id: botId,
      user_message: message,
      bot_response: fallback,
    });
    return NextResponse.json({ reply: fallback });
  }

  const openai = new OpenAI({ apiKey });
  const system = `You are a helpful assistant for a dental clinic. Use the following knowledge when relevant.\n\nKnowledge:\n${context || "(no documents yet)"}`;

  try {
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
  } catch (e) {
    const msg = e instanceof Error ? e.message : "OpenAI error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
