"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let cached: SupabaseClient | null = null;

/**
 * Browser-side Supabase client, used exclusively to upload files directly
 * to Storage via short-lived signed upload tokens (see
 * /api/admin/upload-url). It is NOT used to read/write any database table —
 * Row Level Security blocks the anon key from every table since no
 * policies are defined for it (see supabase/schema.sql).
 *
 * This exists so large files (especially videos) never have to pass
 * through a Vercel Serverless Function, which has a hard 4.5 MB request
 * body limit.
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (cached) return cached;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL et NEXT_PUBLIC_SUPABASE_ANON_KEY doivent être configurées."
    );
  }

  cached = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  return cached;
}
