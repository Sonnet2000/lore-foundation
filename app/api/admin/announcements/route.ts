import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function GET() {
  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}

export async function POST(request: Request) {
  const supabase = getSupabase();
  const body = await request.json();

  const message = (body.message ?? "").trim();
  if (!message) {
    return NextResponse.json({ error: "Le message est requis." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("announcements")
    .insert({
      message,
      link_url: body.link_url || null,
      link_label: body.link_label || null,
      is_active: body.is_active ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data }, { status: 201 });
}
