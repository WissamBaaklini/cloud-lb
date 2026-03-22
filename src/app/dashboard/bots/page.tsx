import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { CreateBotForm } from "@/components/dashboard/create-bot-form";

export default async function BotsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: memberships } = await supabase
    .from("organization_members")
    .select("organization_id")
    .eq("user_id", user!.id);

  const orgIds = (memberships ?? []).map((m) => m.organization_id);
  const primaryOrg = orgIds[0];

  const { data: bots } =
    orgIds.length > 0
      ? await supabase
          .from("bots")
          .select("id, name, created_at, organization_id")
          .in("organization_id", orgIds)
          .order("created_at", { ascending: false })
      : { data: [] as { id: string; name: string; created_at: string; organization_id: string }[] };

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Chatbots</h1>
      <p className="mt-2 text-slate-600">
        Create bots for your organization, then upload knowledge in settings.
      </p>

      {primaryOrg && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-slate-900">New chatbot</h2>
          <CreateBotForm organizationId={primaryOrg} />
        </div>
      )}

      <ul className="mt-10 space-y-3">
        {(bots ?? []).map((b) => (
          <li
            key={b.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm"
          >
            <div>
              <p className="font-medium text-slate-900">{b.name}</p>
              <p className="text-xs text-slate-500">
                {new Date(b.created_at).toLocaleString()}
              </p>
            </div>
            <Link
              href={`/dashboard/bots/${b.id}`}
              className="text-sm font-semibold text-teal-700 hover:underline"
            >
              Open
            </Link>
          </li>
        ))}
      </ul>

      {(!bots || bots.length === 0) && (
        <p className="mt-8 text-sm text-slate-500">
          No bots yet — create one above after your Supabase project is
          connected.
        </p>
      )}
    </div>
  );
}
