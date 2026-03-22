"use client";

import { useState } from "react";

type DocRow = {
  id: string;
  bot_id: string;
  content: string;
  file_url: string | null;
  created_at: string;
};

export function AdminDocumentsTable({ initialDocs }: { initialDocs: DocRow[] }) {
  const [docs, setDocs] = useState(initialDocs);
  const [busy, setBusy] = useState<string | null>(null);

  async function remove(id: string) {
    if (!confirm("Delete this document row?")) return;
    setBusy(id);
    const res = await fetch(
      `/api/admin/documents?id=${encodeURIComponent(id)}`,
      { method: "DELETE" },
    );
    setBusy(null);
    if (res.ok) {
      setDocs((d) => d.filter((x) => x.id !== id));
    }
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800">
      <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
        <thead className="bg-slate-900/80 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Bot</th>
            <th className="px-4 py-3">Preview</th>
            <th className="px-4 py-3">Created</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800">
          {docs.map((d) => (
            <tr key={d.id} className="text-slate-300">
              <td className="px-4 py-3 text-xs text-slate-500">{d.bot_id}</td>
              <td className="max-w-md px-4 py-3 text-xs">
                <span className="line-clamp-3 text-slate-400">
                  {d.content.slice(0, 400)}
                  {d.content.length > 400 ? "…" : ""}
                </span>
                {d.file_url && (
                  <span className="mt-1 block text-teal-400">{d.file_url}</span>
                )}
              </td>
              <td className="px-4 py-3 text-slate-500">
                {new Date(d.created_at).toLocaleString()}
              </td>
              <td className="px-4 py-3">
                <button
                  type="button"
                  disabled={busy === d.id}
                  onClick={() => remove(d.id)}
                  className="rounded-full border border-red-900 px-3 py-1 text-xs font-medium text-red-300 hover:bg-red-950 disabled:opacity-50"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {docs.length === 0 && (
        <p className="p-6 text-center text-sm text-slate-500">No documents yet.</p>
      )}
    </div>
  );
}
