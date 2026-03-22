import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin-auth";

export async function GET() {
  const auth = await getAdminClient();
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  const { data: bots, error } = await supabase
    .from("bots")
    .select("id, name, organization_id, settings, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bots: bots ?? [] });
}

export async function DELETE(request: Request) {
  const auth = await getAdminClient();
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const { error } = await supabase.from("bots").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
