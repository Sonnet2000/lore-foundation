import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";

/** Route de diagnostic — accessible seulement si déjà authentifié (middleware protège) */
export async function GET(request: NextRequest) {
  const hasCookie = !!request.cookies.get(SESSION_COOKIE)?.value;
  const cookieValue = request.cookies.get(SESSION_COOKIE)?.value?.slice(0, 20) + "...";

  const envCheck = {
    ADMIN_PASSWORD:          !!process.env.ADMIN_PASSWORD,
    SESSION_SECRET:          !!process.env.SESSION_SECRET,
    SUPABASE_URL:            !!process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    RESEND_API_KEY:          !!process.env.RESEND_API_KEY,
    NODE_ENV:                process.env.NODE_ENV,
  };

  // Test Supabase connection
  let supabaseOk = false;
  let supabaseError = "";
  try {
    const { getSupabase } = await import("@/lib/supabase");
    const supabase = getSupabase();
    const { error } = await supabase.from("announcements").select("id").limit(1);
    supabaseOk = !error;
    supabaseError = error?.message ?? "";
  } catch (e) {
    supabaseError = e instanceof Error ? e.message : String(e);
  }

  return NextResponse.json({
    ok: true,
    auth: { hasCookie, cookiePreview: hasCookie ? cookieValue : null },
    env: envCheck,
    supabase: { connected: supabaseOk, error: supabaseError || null },
    timestamp: new Date().toISOString(),
  });
}
