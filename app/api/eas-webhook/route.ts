import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { getSupabase } from "@/lib/supabase";
import { DEFAULT_APP_DOWNLOAD, mergeAppDownloadSettings, type AppDownloadSettings } from "@/lib/site-info";

export const dynamic = "force-dynamic";

const APP_DOWNLOAD_KEY = "app_download";

/**
 * Chèche premye valè ki koresponn ak youn nan kle yo (san respekte moun/piti),
 * kèlkeswa pwofondè li nan objè a. Sa fè entegrasyon an pa kraze si Expo
 * chanje ti detay nan estrikti payload la (buildUrl, build.artifacts.buildUrl, elatriye).
 */
function findValue(obj: unknown, keys: string[], depth = 0): string | undefined {
  if (depth > 6 || obj === null || typeof obj !== "object") return undefined;
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    if (keys.includes(k.toLowerCase()) && typeof v === "string" && v) return v;
  }
  for (const v of Object.values(obj as Record<string, unknown>)) {
    if (v && typeof v === "object") {
      const found = findValue(v, keys, depth + 1);
      if (found) return found;
    }
  }
  return undefined;
}

function verifySignature(rawBody: string, signatureHeader: string | null, secret: string): boolean {
  if (!signatureHeader) return false;
  const hmac = crypto.createHmac("sha1", secret);
  hmac.update(rawBody);
  const expected = `sha1=${hmac.digest("hex")}`;
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signatureHeader));
  } catch {
    return false;
  }
}

export async function POST(request: Request) {
  const secret = process.env.EAS_WEBHOOK_SECRET;
  const rawBody = await request.text();

  if (secret) {
    const signature = request.headers.get("expo-signature");
    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: "Siyati envalid." }, { status: 401 });
    }
  }

  let payload: unknown;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "JSON envalid." }, { status: 400 });
  }

  const status = findValue(payload, ["status"])?.toLowerCase();
  const platform = findValue(payload, ["platform"])?.toLowerCase();
  const buildUrl = findValue(payload, ["buildurl"]);
  const appVersion = findValue(payload, ["appversion", "version"]);

  // Nou sèlman enterese nan build android ki reyisi (fini san erè).
  if (status && status !== "finished") {
    return NextResponse.json({ ok: true, skipped: "status" });
  }
  if (platform && platform !== "android") {
    return NextResponse.json({ ok: true, skipped: "platform" });
  }
  if (!buildUrl) {
    return NextResponse.json({ ok: false, error: "Pa jwenn buildUrl nan payload la." }, { status: 200 });
  }

  try {
    const supabase = getSupabase();
    const { data: existing } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", APP_DOWNLOAD_KEY)
      .maybeSingle();

    const current = mergeAppDownloadSettings(existing?.value as Partial<AppDownloadSettings> | undefined);
    const updated: AppDownloadSettings = {
      ...current,
      apkUrl: buildUrl,
      version: appVersion || current.version || DEFAULT_APP_DOWNLOAD.version,
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: APP_DOWNLOAD_KEY, value: updated }, { onConflict: "key" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, apkUrl: buildUrl, version: updated.version });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
