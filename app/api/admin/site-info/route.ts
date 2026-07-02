import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { PLATFORM_META, mergeContactInfo, type ContactInfo, type SocialLink } from "@/lib/site-info";

const SETTING_KEY = "contact";
const VALID_PLATFORMS = new Set(Object.keys(PLATFORM_META));

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(mergeContactInfo(data?.value));
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

function sanitize(body: unknown): ContactInfo | null {
  if (typeof body !== "object" || body === null) return null;
  const b = body as Record<string, unknown>;

  const phones = Array.isArray(b.phones)
    ? b.phones.filter((p): p is string => typeof p === "string" && p.trim() !== "").map((p) => p.trim().slice(0, 40))
    : [];

  const email = typeof b.email === "string" ? b.email.trim().slice(0, 200) : "";
  const address = typeof b.address === "string" ? b.address.trim().slice(0, 200) : "";
  const whatsappNumber = typeof b.whatsappNumber === "string"
    ? b.whatsappNumber.replace(/[^\d]/g, "").slice(0, 20)
    : "";

  const socialLinks: SocialLink[] = Array.isArray(b.socialLinks)
    ? b.socialLinks
        .filter((s): s is Record<string, unknown> => typeof s === "object" && s !== null)
        .map((s, i) => {
          const platform = typeof s.platform === "string" && VALID_PLATFORMS.has(s.platform) ? s.platform : "other";
          return {
            id: typeof s.id === "string" && s.id ? s.id : `link-${Date.now()}-${i}`,
            platform: platform as SocialLink["platform"],
            label: typeof s.label === "string" ? s.label.trim().slice(0, 40) : "",
            url: typeof s.url === "string" ? s.url.trim().slice(0, 500) : "",
          };
        })
        .filter((s) => s.url !== "")
    : [];

  return { phones, email, address, whatsappNumber, socialLinks };
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    const value = sanitize(body);
    if (!value) return NextResponse.json({ error: "Done envalid." }, { status: 400 });

    const supabase = getSupabase();
    const { error } = await supabase
      .from("site_settings")
      .upsert({ key: SETTING_KEY, value }, { onConflict: "key" });

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, ...value });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
