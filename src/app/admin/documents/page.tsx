import { createClient } from "@/lib/supabase/server";
import { AdminDocumentsTable } from "@/components/admin/admin-documents-table";

export default async function AdminDocumentsPage() {
  const supabase = await createClient();
  const { data: docs } = await supabase
    .from("documents")
    .select("id, bot_id, content, file_url, created_at")
    .order("created_at", { ascending: false })
    .limit(200);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-white">Documents</h1>
      <p className="mt-2 text-slate-400">
        Inspect uploaded knowledge — delete corrupted rows safely.
      </p>
      <div className="mt-8">
        <AdminDocumentsTable initialDocs={docs ?? []} />
      </div>
    </div>
  );
}
