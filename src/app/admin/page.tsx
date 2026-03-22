import { createClient } from "@/lib/supabase/server";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [{ count: userCount }, { count: botCount }, { count: msgCount }] =
    await Promise.all([
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("bots").select("id", { count: "exact", head: true }),
      supabase.from("messages").select("id", { count: "exact", head: true }),
    ]);

  const { count: activeUsers } = await supabase
    .from("profiles")
    .select("id", { count: "exact", head: true })
    .eq("disabled", false);

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-bold text-white">Control center</h1>
      <p className="mt-2 text-slate-400">
        High-level metrics — revenue stays manual until Stripe is connected.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total users", value: userCount ?? 0 },
          { label: "Active users", value: activeUsers ?? 0 },
          { label: "Bots", value: botCount ?? 0 },
          { label: "Messages", value: msgCount ?? 0 },
        ].map((c) => (
          <div
            key={c.label}
            className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5 shadow-lg"
          >
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              {c.label}
            </p>
            <p className="mt-2 text-3xl font-semibold text-white">{c.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-6">
        <h2 className="font-semibold text-white">Revenue</h2>
        <p className="mt-2 text-sm text-slate-400">
          Track MRR manually for now — Stripe billing will land here next.
        </p>
      </div>
    </div>
  );
}
