import { createClient } from "@/lib/supabase/server";
import { AdminUsersTable } from "@/components/admin/admin-users-table";

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const { data: users } = await supabase
    .from("profiles")
    .select("id, full_name, role, disabled, created_at")
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold text-white">Users</h1>
      <p className="mt-2 text-slate-400">Search, disable accounts, assign roles.</p>
      <div className="mt-8">
        <AdminUsersTable initialUsers={users ?? []} />
      </div>
    </div>
  );
}
