import Link from "next/link";
import { WhatsAppCta } from "@/components/whatsapp-cta";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: orgs } = await supabase
    .from("organization_members")
    .select("organization_id, organizations(name)")
    .eq("user_id", user!.id);

  const orgIds = (orgs ?? []).map((o) => o.organization_id);
  let botCount = 0;
  if (orgIds.length) {
    const { count } = await supabase
      .from("bots")
      .select("id", { count: "exact", head: true })
      .in("organization_id", orgIds);
    botCount = count ?? 0;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
      <p className="mt-2 text-slate-600">
        Manage your clinic workspace, bots, and knowledge base.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Organizations</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {orgs?.length ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">Chatbots</p>
          <p className="mt-1 text-3xl font-bold text-slate-900">
            {botCount ?? 0}
          </p>
        </div>
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 p-6">
        <h2 className="font-semibold text-slate-900">Need help onboarding?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Message us on WhatsApp to connect billing and launch support.
        </p>
        <div className="mt-4">
          <WhatsAppCta />
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link
          href="/dashboard/bots"
          className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white hover:bg-slate-800"
        >
          Manage chatbots
        </Link>
        <Link
          href="/dashboard/settings"
          className="rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:bg-slate-50"
        >
          Settings
        </Link>
      </div>

      <section className="mt-12">
        <h2 className="text-lg font-semibold text-slate-900">Embed widget</h2>
        <p className="mt-2 text-sm text-slate-600">
          Add this script to your website (replace the domain with your deployed
          URL):
        </p>
        <pre className="mt-4 overflow-x-auto rounded-xl bg-slate-900 p-4 text-xs text-teal-100">
          {`<script src="${process.env.NEXT_PUBLIC_APP_URL ?? "https://cloud-lb.com"}/widget.js" async></script>`}
        </pre>
      </section>
    </div>
  );
}
