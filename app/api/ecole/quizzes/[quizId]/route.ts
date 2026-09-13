import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/ecole-portail/server";
import { requireAdmin } from "@/lib/ecole-portail/guards";

export async function GET(_request: NextRequest, { params }: { params: { quizId: string } }) {
  const supabase = createClient();

  const { data: quiz, error } = await supabase
    .from("quiz_exams")
    .select("id, title, description, is_published, seconds_per_question")
    .eq("id", params.quizId)
    .single();

  if (error || !quiz) return NextResponse.json({ error: "Kiz la pa jwenn oswa pa aksesib." }, { status: 404 });

  const { data: questions } = await supabase
    .from("quiz_questions")
    .select("id, question_text, options, correct_index, points, order_index")
    .eq("quiz_id", params.quizId)
    .order("order_index");

  return NextResponse.json({ quiz, questions: questions ?? [] });
}

export async function PATCH(request: NextRequest, { params }: { params: { quizId: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { is_published } = await request.json();
  const supabase = createClient();
  const { data, error: dbError } = await supabase
    .from("quiz_exams")
    .update({ is_published })
    .eq("id", params.quizId)
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ quiz: data });
}
