"use client";

import { useState } from "react";

type BotRow = {
  id: string;
  name: string;
  organization_id: string;
  settings: Record<string, unknown> | null;
  created_at: string;
};

export function AdminBotsTable({ initialBots }: { initialBots: BotRow[] }) {
  const [bots, setBots] = useState(initialBots);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this bot? Documents and messages will cascade.")) return;
    setBusy(id);
    const res = await fetch(`/api/admin/bots?id=${encodeURIComponent(id)}`, {
      method: "DELETE",
    });
    setBusy(null);
    if (res.ok) {
      setBots((b) => b.filter((x) => x.id !== id));
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
        <thead className="bg-slate-900/80 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Organization</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Settings</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {bots.map((b) => (
            <tr key={b.id} className="text-slate-300">
              <td className="px-4 py-3 font-medium text-white">{b.name}</td>
              <td className="px-4 py-3 text-xs text-slate-500">{b.organization_id}</td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(b.created_at).toLocaleString()}
              </td>
              <td className="max-w-xs truncate px-4 py-3 text-xs text-slate-500">
                {JSON.stringify(b.settings ?? {})}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={busy === b.id}
                  onClick={() => remove(b.id)}
                  className="rounded-full border border-red-900 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-950 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
