import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { botBodySchema } from "@/lib/validations";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user.id);

  const orgIds = (memberships ?? []).map((m) => m.organization_id);
  if (!orgIds.length) {
    return NextResponse.json({ bots: [] });
  }

  const { data: bots, error } = await supabase
    .from("bots")
    .select("id, name, organization_id, created_at")
    .in("organization_id", orgIds)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bots: bots ?? [] });
}

export async function POST(request: Request) {
  const json = await request.json().catch(() => null);
  const parsed = botBodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { organizationId, name, settings } = parsed.data;

  const { data: member } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", organizationId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!member) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { data: bot, error } = await supabase
    .from("bots")
    .insert({
      organization_id: organizationId,
      name,
      settings: settings ?? {},
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: bot.id });
}
