import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = createClient();

  // Pa gen bezwen filtre manyèlman selon wòl la — RLS deja fè sa:
  // admin/staff wè tout, yon etidyan wè sèlman kou li enskri ladan yo.
  const { data, error } = await supabase
    .from("courses")
    .select("id, name, code, description, teacher_id, is_published")
    .order("name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ courses: data });
}
