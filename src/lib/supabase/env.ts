/**
 * Public Supabase credentials (safe to expose to the browser via NEXT_PUBLIC_*).
 * Supports both legacy anon JWT and newer "publishable" keys from the dashboard.
 */
export function getSupabasePublicConfig():
  | { url: string; anonKey: string }
  | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const anonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim();

  if (!url || !anonKey) {
    return null;
  }
  return { url, anonKey };
}

export function requireSupabasePublicConfig(): { url: string; anonKey: string } {
  const c = getSupabasePublicConfig();
  if (!c) {
    throw new Error(
      "Supabase URL and anon/publishable key are missing. " +
        "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local (restart npm run dev), " +
        "or add the same variables in your host (e.g. Vercel → Settings → Environment Variables) and redeploy. " +
        "Find values at: https://supabase.com/dashboard/project/_/settings/api",
    );
  }
  return c;
}
