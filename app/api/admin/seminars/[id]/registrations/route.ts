import { NextResponse } from "next/server";
import { validateId } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const invalid = validateId(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const { data, error } = await supabase
    .from("seminar_registrations")
    .select("*")
    .eq("seminar_id", params.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ items: data });
}
