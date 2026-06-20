import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { MEDIA_BUCKET } from "@/lib/supabase-bucket";

export { MEDIA_BUCKET };

let cached: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error(
      "Variables d'environnement Supabase manquantes. Vérifiez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY dans les paramètres Vercel."
    );
  }

  cached = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}

/** Retourne null si les variables sont manquantes */
export function tryGetSupabase(): SupabaseClient | null {
  try { return getSupabase(); }
  catch { return null; }
}
