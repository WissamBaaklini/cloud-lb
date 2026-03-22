import { createClient } from "@/lib/supabase/server";
import { AdminBotsTable } from "@/components/admin/admin-bots-table";

export default async function AdminBotsPage() {
  const supabase = await createClient();
  const { data: bots } = await supabase
    .from("bots")
    .select("id, name, organization_id, settings, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-white">Bots</h1>
      <p className="mt-2 text-slate-400">Inspect, edit settings, or remove bots.</p>
      <div className="mt-8">
        <AdminBotsTable initialBots={bots ?? []} />
      </div>
    </div>
  );
}
