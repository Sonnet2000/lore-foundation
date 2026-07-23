import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_APP_DOWNLOAD, mergeAppDownloadSettings, type AppDownloadSettings } from "@/lib/site-info";

export const dynamic = "force-dynamic";

const APP_DOWNLOAD_KEY = "app_download";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", APP_DOWNLOAD_KEY)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(mergeAppDownloadSettings(data?.value));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function sanitize(body: unknown): AppDownloadSettings | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  return {
    apkUrl: typeof b.apkUrl === "string" && b.apkUrl.trim() ? b.apkUrl.trim().slice(0, 500) : null,
    version: typeof b.version === "string" && b.version.trim() ? b.version.trim().slice(0, 30) : DEFAULT_APP_DOWNLOAD.version,
    approxSizeMb: typeof b.approxSizeMb === "number" && b.approxSizeMb > 0 ? b.approxSizeMb : DEFAULT_APP_DOWNLOAD.approxSizeMb,
    playStoreUrl: typeof b.playStoreUrl === "string" && b.playStoreUrl.trim() ? b.playStoreUrl.trim().slice(0, 500) : null,
  };
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const value = sanitize(body);
    if (!value) return NextResponse.json({ error: "Done envalid." }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: APP_DOWNLOAD_KEY, value }, { onConflict: "key" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, ...value });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
