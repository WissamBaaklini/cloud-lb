import { createClient } from "@supabase/supabase-js";
import { getSupabasePublicConfig } from "@/lib/supabase/env";

/** Server-only client with elevated privileges — use only in trusted API routes (e.g. public widget). */
export function createServiceClient() {
  const pub = getSupabasePublicConfig();
  const url = pub?.url ?? process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    return null;
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
