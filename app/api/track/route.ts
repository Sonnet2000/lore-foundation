import { NextResponse } from "next/server";
import { tryGetSupabase } from "@/lib/supabase";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

// Chemen nou pa janm bezwen konte (admin, compte, api, fichye statik).
function isIgnoredPath(path: string): boolean {
  return (
    path.startsWith("/admin") ||
    path.startsWith("/compte") ||
    path.startsWith("/api") ||
    path.startsWith("/_next") ||
    path === "/favicon.ico"
  );
}

export async function POST(request: Request) {
  try {
    // Anpeche abi: max 60 "hit" pou menm IP chak minit.
    const ip = getClientIp(request);
    const { allowed } = rateLimit({ key: `track:${ip}`, limit: 60, windowSeconds: 60 });
    if (!allowed) return NextResponse.json({ ok: false }, { status: 429 });

    const body = await request.json().catch(() => ({}));
    const path = typeof body?.path === "string" ? body.path.slice(0, 300) : null;
    const visitorId = typeof body?.visitorId === "string" ? body.visitorId.slice(0, 100) : null;
    const referrer = typeof body?.referrer === "string" ? body.referrer.slice(0, 300) : null;

    if (!path || !visitorId || isIgnoredPath(path)) {
      return NextResponse.json({ ok: true }); // pa yon erè — nou senpleman pa konte l
    }

    const supabase = tryGetSupabase();
    if (!supabase) return NextResponse.json({ ok: true });

    const userAgent = request.headers.get("user-agent")?.slice(0, 300) ?? null;

    await supabase.from("page_views").insert({
      path,
      visitor_id: visitorId,
      referrer,
      user_agent: userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch {
    // Pa janm kraze eksperyans itilizatè a pou yon erè trasabilite.
    return NextResponse.json({ ok: true });
  }
}
