import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => ({}));
  const id = typeof body?.id === "string" ? body.id : null;

  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) {
    return NextResponse.json({ error: "Identifiant invalide." }, { status: 400 });
  }

  const supabase = getSupabase();
  const { error } = await supabase.from("subscribers").delete().eq("id", id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
