"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function CreateBotForm({ organizationId }: { organizationId: string }) {
  const router = useRouter();
  const [name, setName] = useState("Reception bot");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("bots")
      .insert({
        organization_id: organizationId,
        name: name.trim() || "Untitled bot",
        settings: {},
      })
      .select("id")
      .single();
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    if (data?.id) {
      router.push(`/dashboard/bots/${data.id}`);
      router.refresh();
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label htmlFor="botName" className="text-sm font-medium text-slate-700">
          Name
        </label>
        <input
          id="botName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create"}
      </button>
      {error && (
        <p className="w-full text-sm text-red-600 sm:col-span-full" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
