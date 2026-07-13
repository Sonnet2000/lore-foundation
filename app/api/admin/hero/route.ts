import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const SETTING_KEY = "hero";

const DEFAULT_VALUE = {
  media: [] as { url: string; type: "image" | "video" }[],
  badgeText: "🇭🇹 Formation professionnelle & services numériques à Cap-Haïtien",
  headlineBefore: "Former.",
  headlineHighlight: "Créer.",
  headlineAfter: "Réussir.",
  description:
    "Loré Foundation forme les talents de demain et accompagne les entreprises haïtiennes avec des services numériques professionnels — développement web, design graphique et bien plus.",
  mobileBadgeText: "500+ jeunes formés · 80+ projets livrés",
  floatingBadge1Title: "500+ jeunes formés",
  floatingBadge1Subtitle: "depuis notre création",
  floatingBadge2Title: "Formation & services pro",
  floatingBadge2Subtitle: "Cap-Haïtien & au-delà",
};

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const value = { ...DEFAULT_VALUE, ...(data?.value ?? {}) };
    return NextResponse.json(value);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, ...DEFAULT_VALUE }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const media = Array.isArray(body.media) ? body.media : [];
    const str = (v: unknown, fallback: string) => (typeof v === "string" ? v : fallback);

    const value = {
      media,
      badgeText: str(body.badgeText, DEFAULT_VALUE.badgeText),
      headlineBefore: str(body.headlineBefore, DEFAULT_VALUE.headlineBefore),
      headlineHighlight: str(body.headlineHighlight, DEFAULT_VALUE.headlineHighlight),
      headlineAfter: str(body.headlineAfter, DEFAULT_VALUE.headlineAfter),
      description: str(body.description, DEFAULT_VALUE.description),
      mobileBadgeText: str(body.mobileBadgeText, DEFAULT_VALUE.mobileBadgeText),
      floatingBadge1Title: str(body.floatingBadge1Title, DEFAULT_VALUE.floatingBadge1Title),
      floatingBadge1Subtitle: str(body.floatingBadge1Subtitle, DEFAULT_VALUE.floatingBadge1Subtitle),
      floatingBadge2Title: str(body.floatingBadge2Title, DEFAULT_VALUE.floatingBadge2Title),
      floatingBadge2Subtitle: str(body.floatingBadge2Subtitle, DEFAULT_VALUE.floatingBadge2Subtitle),
    };

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: SETTING_KEY, value },
        { onConflict: "key" }
      );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, ...value });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
