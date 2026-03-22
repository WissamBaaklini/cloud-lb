export default function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold text-white">System</h1>
      <p className="mt-2 text-slate-400">
        Feature flags, API limits, and error monitoring — hook these to your
        config store or env when you operationalize.
      </p>

      <ul className="mt-10 space-y-4 text-sm text-slate-300">
        <li className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <span className="font-medium text-white">Public widget</span>
          <span className="mt-1 block text-slate-500">
            Requires{" "}
            <code className="text-teal-300">SUPABASE_SERVICE_ROLE_KEY</code> on
            the server for /api/widget/chat.
          </span>
        </li>
        <li className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <span className="font-medium text-white">AI</span>
          <span className="mt-1 block text-slate-500">
            Set <code className="text-teal-300">OPENAI_API_KEY</code> for live
            completions.
          </span>
        </li>
        <li className="rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3">
          <span className="font-medium text-white">Payments</span>
          <span className="mt-1 block text-slate-500">
            WhatsApp onboarding today — Stripe replaces this flow later.
          </span>
        </li>
      </ul>
    </div>
  );
}
