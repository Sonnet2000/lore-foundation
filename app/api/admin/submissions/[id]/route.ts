import { NextResponse } from "next/server";
import { validateUUID } from "@/lib/validate-id";
import { getSupabase } from "@/lib/supabase";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const invalid = validateUUID(params.id);
  if (invalid) return invalid;

  const supabase = getSupabase();
  const body = await request.json().catch(() => ({}));

  const updates: Record<string, unknown> = { status: "graded", graded_at: new Date().toISOString() };
  if (typeof body.grade === "string") updates.grade = body.grade.slice(0, 20);
  if (typeof body.feedback === "string") updates.feedback = body.feedback.slice(0, 2000);

  const { data, error } = await supabase
    .from("assignment_submissions")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ item: data });
}
