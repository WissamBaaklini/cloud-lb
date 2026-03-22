"use client";

import { useState } from "react";

export function ChatPanel({ botId }: { botId: string }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ botId, message: text }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      if (!res.ok) {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: data.error ?? "Something went wrong." },
        ]);
      } else {
        setMessages((m) => [
          ...m,
          { role: "assistant", text: data.reply ?? "" },
        ]);
      }
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", text: "Network error." },
      ]);
    }
    setLoading(false);
  }

  return (
    <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex h-64 flex-col gap-3 overflow-y-auto rounded-lg bg-slate-50 p-3 text-sm">
        {messages.length === 0 && (
          <p className="text-slate-500">Ask a question to test retrieval + AI.</p>
        )}
        {messages.map((msg, i) => (
          <div
            key={i}
            className={
              msg.role === "user"
                ? "ml-auto max-w-[85%] rounded-lg bg-teal-600 px-3 py-2 text-white"
                : "max-w-[85%] rounded-lg bg-white px-3 py-2 text-slate-800 shadow-sm"
            }
          >
            {msg.text}
          </div>
        ))}
        {loading && <p className="text-xs text-slate-500">Thinking…</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder="e.g. What are your opening hours?"
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-slate-900"
        />
        <button
          type="button"
          onClick={send}
          disabled={loading}
          className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          Send
        </button>
      </div>
    </div>
  );
}
