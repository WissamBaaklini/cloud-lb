"use client";

import { useMemo, useState } from "react";

type UserRow = {
  id: string;
  full_name: string;
  role: string;
  disabled: boolean;
  created_at: string;
};

export function AdminUsersTable({ initialUsers }: { initialUsers: UserRow[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [q, setQ] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return users;
    return users.filter(
      (u) =>
        u.full_name.toLowerCase().includes(s) ||
        u.id.toLowerCase().includes(s),
    );
  }, [users, q]);

  async function patch(userId: string, body: Record<string, unknown>) {
    setBusy(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, ...body }),
    });
    setBusy(null);
    if (!res.ok) return;
    const json = await res.json().catch(() => null);
    if (json?.ok) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === userId
            ? {
                ...u,
                ...(typeof body.disabled === "boolean"
                  ? { disabled: body.disabled }
                  : {}),
                ...(body.role === "user" || body.role === "admin"
                  ? { role: body.role }
                  : {}),
              }
            : u,
        ),
      );
    }
  }

  return (
    <div>
      <input
        type="search"
        placeholder="Search name or id…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="w-full max-w-md rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-white placeholder:text-slate-500"
      />
      <div className="mt-6 overflow-x-auto rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-xs uppercase text-slate-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Created</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {filtered.map((u) => (
              <tr key={u.id} className="text-slate-300">
                <td className="px-4 py-3">
                  <div className="font-medium text-white">{u.full_name || "—"}</div>
                  <div className="text-xs text-slate-500">{u.id}</div>
                </td>
                <td className="px-4 py-3 capitalize">{u.role}</td>
                <td className="px-4 py-3">{u.disabled ? "Disabled" : "Active"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {new Date(u.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={busy === u.id}
                      onClick={() => patch(u.id, { disabled: !u.disabled })}
                      className="rounded-full border border-slate-600 px-3 py-1 text-xs font-medium hover:bg-slate-800 disabled:opacity-50"
                    >
                      {u.disabled ? "Enable" : "Disable"}
                    </button>
                    <button
                      type="button"
                      disabled={busy === u.id || u.role === "admin"}
                      onClick={() =>
                        patch(u.id, { role: u.role === "admin" ? "user" : "admin" })
                      }
                      className="rounded-full border border-teal-700 px-3 py-1 text-xs font-medium text-teal-300 hover:bg-teal-950 disabled:opacity-50"
                    >
                      {u.role === "admin" ? "Make user" : "Make admin"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
