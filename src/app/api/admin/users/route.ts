import { NextResponse } from "next/server";
import { getAdminClient } from "@/lib/admin-auth";

export async function GET() {
  const auth = await getAdminClient();
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id, full_name, role, disabled, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ users: profiles ?? [] });
}

export async function PATCH(request: Request) {
  const auth = await getAdminClient();
  if ("response" in auth) return auth.response;
  const { supabase } = auth;

  const json = await request.json().catch(() => null);
  const userId = json?.userId as string | undefined;
  const disabled = json?.disabled as boolean | undefined;
  const role = json?.role as "user" | "admin" | undefined;

  if (!userId || typeof userId !== "string") {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const updates: Record<string, unknown> = {};
  if (typeof disabled === "boolean") updates.disabled = disabled;
  if (role === "user" || role === "admin") updates.role = role;

  if (!Object.keys(updates).length) {
    return NextResponse.json({ error: "No updates" }, { status: 400 });
  }

  const { error } = await supabase.from("profiles").update(updates).eq("id", userId);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
