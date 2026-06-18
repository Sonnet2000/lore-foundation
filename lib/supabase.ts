import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "@/lib/supabase-bucket";

export { MEDIA_BUCKET };

let cached: SupabaseClient | null = null;

/**
 * Server-only Supabase client authenticated with the service-role key.
 * This bypasses Row Level Security, so it must only ever be used in:
 *  - Server Components (no "use client" directive)
 *  - Route Handlers (app/api/**\/route.ts)
 *
 * It must never be imported into a Client Component or otherwise reach
 * the browser bundle.
 */
export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set (see .env.local.example)."
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
