import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("payment_methods")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) return NextResponse.json({ error: error.message, items: [] }, { status: 500 });
    return NextResponse.json({ items: data ?? [] });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e), items: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabase();
    const body = await request.json().catch(() => ({}));

    const type = body.type;
    const label = (body.label ?? "").trim();
    if (!label) return NextResponse.json({ error: "Label requis." }, { status: 400 });
    if (!["moncash","natcash","sogebank","autre"].includes(type))
      return NextResponse.json({ error: "Type invalide." }, { status: 400 });

    const { data, error } = await supabase
      .from("payment_methods")
      .insert({
        type,
        label,
        number:       (body.number ?? "").trim(),
        details:      (body.details ?? "").trim(),
        instructions: (body.instructions ?? "").trim(),
        is_active:    body.is_active !== false,
        sort_order:   Number(body.sort_order) || 0,
      })
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ item: data }, { status: 201 });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }
}
