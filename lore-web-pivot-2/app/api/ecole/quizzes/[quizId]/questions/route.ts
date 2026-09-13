import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/supabase/guards";

export async function POST(request: NextRequest, { params }: { params: { quizId: string } }) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { question_text, options, correct_index, points } = await request.json();
  if (!question_text || !Array.isArray(options) || options.length < 2 || correct_index === undefined) {
    return NextResponse.json({ error: "question_text, options (min 2) ak correct_index obligatwa." }, { status: 400 });
  }

  const supabase = createClient();
  const { count } = await supabase
    .from("quiz_questions")
    .select("id", { count: "exact", head: true })
    .eq("quiz_id", params.quizId);

  const { data, error: dbError } = await supabase
    .from("quiz_questions")
    .insert({
      quiz_id: params.quizId,
      question_text,
      options,
      correct_index,
      points: points ?? 10,
      order_index: count ?? 0,
    })
    .select()
    .single();

  if (dbError) return NextResponse.json({ error: dbError.message }, { status: 500 });
  return NextResponse.json({ question: data });
}
