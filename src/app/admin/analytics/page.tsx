import { createClient } from "@/lib/supabase/server";

export default async function AdminAnalyticsPage() {
  const supabase = await createClient();
  const { count: messages7d } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .gte(
      "created_at",
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    );

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Analytics</h1>
      <p className="mt-2 text-slate-400">
        Usage overview — extend with charts and funnels as you scale.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <p className="text-xs font-medium uppercase text-slate-500">
            Messages (7 days)
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {messages7d ?? 0}
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-6">
          <p className="text-sm text-slate-400">
            Connect product analytics (PostHog, etc.) when you are ready — this
            page is wired for growth.
          </p>
        </div>
      </div>
    </div>
  );
}
