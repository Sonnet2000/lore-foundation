import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

const SETTING_KEY = "hero";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("site_settings")
      .select("value")
      .eq("key", SETTING_KEY)
      .maybeSingle();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const value = data?.value ?? { media: [] };
    return NextResponse.json(value);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg, media: [] }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json();

    const media = Array.isArray(body.media) ? body.media : [];

    const { error } = await supabase
      .from("site_settings")
      .upsert(
        { key: SETTING_KEY, value: { media } },
        { onConflict: "key" }
      );

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    return NextResponse.json({ ok: true, media });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
