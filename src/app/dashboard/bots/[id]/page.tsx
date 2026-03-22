import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatPanel } from "@/components/dashboard/chat-panel";
import { UploadForm } from "@/components/dashboard/upload-form";
import { createClient } from "@/lib/supabase/server";

export default async function BotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bot, error } = await supabase
    .from("bots")
    .select("id, name, organization_id")
    .eq("id", id)
    .single();

  if (error || !bot) {
    notFound();
  }

  const { data: member } = await supabase
    .from("organization_members")
    .select("user_id")
    .eq("organization_id", bot.organization_id)
    .eq("user_id", user!.id)
    .maybeSingle();

  if (!member) {
    notFound();
  }

  const { data: docs } = await supabase
    .from("documents")
    .select("id, file_url, created_at, content")
    .eq("bot_id", id)
    .order("created_at", { ascending: false });

  return (
    <div className="mx-auto max-w-3xl">
      <Link
        href="/dashboard/bots"
        className="text-sm font-medium text-teal-700 hover:underline"
      >
        ← All chatbots
      </Link>
      <h1 className="mt-4 text-2xl font-bold text-slate-900">{bot.name}</h1>
      <p className="mt-1 text-slate-600">Test chat and manage knowledge.</p>

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-slate-900">Try the bot</h2>
        <ChatPanel botId={id} />
      </section>

      <section className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">Knowledge upload</h2>
        <p className="mt-1 text-sm text-slate-600">
          Paste text for now — file storage can be enabled via Supabase Storage.
        </p>
        <UploadForm botId={id} />
        <ul className="mt-6 space-y-2">
          {(docs ?? []).map((d) => (
            <li
              key={d.id}
              className="rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-sm text-slate-700"
            >
              <span className="line-clamp-2">
                {d.content.slice(0, 120)}
                {d.content.length > 120 ? "…" : ""}
              </span>
              <span className="mt-1 block text-xs text-slate-400">
                {new Date(d.created_at).toLocaleString()}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
