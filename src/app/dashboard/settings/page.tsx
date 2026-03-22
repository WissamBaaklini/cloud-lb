import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role, created_at")
    .eq("id", user!.id)
    .single();

  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user!.id);

  const orgIds = (memberships ?? []).map((m) => m.organization_id);

  const { data: orgRows } =
    orgIds.length > 0
      ? await supabase
          .from("organizations")
          .select("id, name")
          .in("id", orgIds)
      : { data: [] as { id: string; name: string }[] };

  const { data: subRows } =
    orgIds.length > 0
      ? await supabase
          .from("subscriptions")
          .select("organization_id, plan, status")
          .in("organization_id", orgIds)
      : { data: [] as { organization_id: string; plan: string; status: string }[] };

  const subByOrg = new Map(
    (subRows ?? []).map((s) => [s.organization_id, s] as const),
  );

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      <p className="mt-2 text-slate-600">Account and subscription overview.</p>

      <div className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div>
          <h2 className="text-sm font-medium text-slate-500">Email</h2>
          <p className="mt-1 text-slate-900">{user!.email}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-slate-500">Name</h2>
          <p className="mt-1 text-slate-900">{profile?.full_name || "—"}</p>
        </div>
        <div>
          <h2 className="text-sm font-medium text-slate-500">Role</h2>
          <p className="mt-1 capitalize text-slate-900">{profile?.role ?? "user"}</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-lg font-semibold text-slate-900">Organizations</h2>
        <ul className="mt-4 space-y-3">
          {(orgRows ?? []).map((org) => {
            const sub = subByOrg.get(org.id);
            return (
              <li
                key={org.id}
                className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
              >
                <p className="font-medium text-slate-900">{org.name}</p>
                <p className="text-sm text-slate-600">
                  Plan: {sub?.plan ?? "—"} · Status: {sub?.status ?? "—"}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
