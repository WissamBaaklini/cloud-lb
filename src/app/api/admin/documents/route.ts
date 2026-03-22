import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin-auth";

export async function GET() {
  const auth = await getAdminClient();
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  const { data: docs, error } = await supabase
    .from("documents")
    .select("id, bot_id, content, file_url, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ documents: docs ?? [] });
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

  const { error } = await supabase.from("documents").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
