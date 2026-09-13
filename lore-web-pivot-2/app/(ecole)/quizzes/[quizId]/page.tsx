"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_index: number;
  points: number;
}

export default function TakeQuizPage({ params }: { params: { quizId: string } }) {
  const supabase = createClient();
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; correct: number; total_q: number } | null>(null);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [newQuestion, setNewQuestion] = useState({ question_text: "", optionsText: "", correct_index: 0, points: 10 });

  useEffect(() => {
    fetch(`/api/ecole/quizzes/${params.quizId}`)
      .then((r) => r.json())
      .then((d) => {
        setQuiz(d.quiz ?? null);
        setQuestions(d.questions ?? []);
      })
      .finally(() => setLoading(false));

    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(profile?.role ?? null);
    })();
  }, [params.quizId]);

  async function reloadQuestions() {
    const res = await fetch(`/api/ecole/quizzes/${params.quizId}`);
    const d = await res.json();
    setQuiz(d.quiz ?? null);
    setQuestions(d.questions ?? []);
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    const options = newQuestion.optionsText.split(",").map((o) => o.trim()).filter(Boolean);
    await fetch(`/api/ecole/quizzes/${params.quizId}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_text: newQuestion.question_text,
        options,
        correct_index: newQuestion.correct_index,
        points: newQuestion.points,
      }),
    });
    setNewQuestion({ question_text: "", optionsText: "", correct_index: 0, points: 10 });
    reloadQuestions();
  }

  async function togglePublish() {
    await fetch(`/api/ecole/quizzes/${params.quizId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !quiz.is_published }),
    });
    reloadQuestions();
  }

  async function loadLeaderboard() {
    const { data } = await supabase
      .from("quiz_attempts")
      .select("id, user_id, score, total_points, duration_seconds, profiles:user_id(full_name)")
      .eq("quiz_id", params.quizId)
      .eq("status", "completed")
      .order("score", { ascending: false })
      .order("duration_seconds", { ascending: true })
      .limit(20);
    setLeaderboard(data ?? []);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;

    const startedAt = Date.now();

    // Menm sekans ak app mobil la (lib/quizData.ts) : kòmanse yon
    // tantativ, anrejistre chak repons, epi fèmen tantativ la ak rezime a.
    const { data: attempt, error: attemptError } = await supabase
      .from("quiz_attempts")
      .insert({ quiz_id: params.quizId, user_id: user.id, status: "in_progress" })
      .select()
      .single();

    if (attemptError || !attempt) {
      setSubmitting(false);
      alert("Erè pandan kòmanse tantativ la.");
      return;
    }

    let earned = 0;
    let totalPoints = 0;
    let correctCount = 0;

    for (const q of questions) {
      const selected = answers[q.id];
      const isCorrect = selected === q.correct_index;
      totalPoints += q.points;
      if (isCorrect) {
        earned += q.points;
        correctCount++;
      }

      await supabase.from("quiz_answers").insert({
        attempt_id: attempt.id,
        question_id: q.id,
        selected_index: selected ?? null,
        is_correct: isCorrect,
        time_taken_seconds: 0,
      });
    }

    await supabase
      .from("quiz_attempts")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        score: earned,
        total_points: totalPoints,
        correct_count: correctCount,
        total_questions: questions.length,
        duration_seconds: Math.round((Date.now() - startedAt) / 1000),
      })
      .eq("id", attempt.id);

    setSubmitting(false);
    setResult({ score: earned, total: totalPoints, correct: correctCount, total_q: questions.length });
    loadLeaderboard();
  }

  if (loading) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;
  if (!quiz) return <p className="p-10 text-sm text-red-600">Kiz la pa jwenn oswa pa aksesib.</p>;

  if (result) {
    return (
      <main className="mx-auto max-w-md px-6 py-16 text-center">
        <p className="text-sm text-slate-500">Rezilta ou</p>
        <p className="mt-2 text-4xl font-semibold text-[#0B1F3B]">{result.score}/{result.total}</p>
        <p className="mt-1 text-sm text-slate-500">{result.correct}/{result.total_q} bòn repons</p>

        {leaderboard.length > 0 && (
          <div className="mt-8 rounded-xl bg-white p-4 text-left shadow-sm">
            <p className="mb-2 text-sm font-medium text-slate-600">Palmarès</p>
            <ol className="space-y-1 text-sm">
              {leaderboard.map((l, i) => (
                <li key={l.id} className="flex justify-between">
                  <span>{i + 1}. {l.profiles?.full_name ?? "—"}</span>
                  <span className="text-slate-500">{l.score}/{l.total_points}</span>
                </li>
              ))}
            </ol>
          </div>
        )}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#0B1F3B]">{quiz.title}</h1>
        {role === "admin" && (
          <button
            onClick={togglePublish}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
              quiz.is_published ? "bg-slate-100 text-slate-700" : "bg-[#1E4FD8] text-white hover:bg-[#173da8]"
            }`}
          >
            {quiz.is_published ? "Retire piblikasyon" : "Pibliye"}
          </button>
        )}
      </div>

      {role === "admin" && (
        <form onSubmit={addQuestion} className="mb-8 space-y-2 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-1 font-semibold text-[#0B1F3B]">Ajoute yon kesyon</h2>
          <textarea
            placeholder="Tèks kesyon an"
            value={newQuestion.question_text}
            onChange={(e) => setNewQuestion({ ...newQuestion, question_text: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <input
            placeholder="Opsyon separe pa vigil (ex: Wouj, Vèt, Ble, Jòn)"
            value={newQuestion.optionsText}
            onChange={(e) => setNewQuestion({ ...newQuestion, optionsText: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="Endèks bòn repons (0, 1, 2...)"
              value={newQuestion.correct_index}
              onChange={(e) => setNewQuestion({ ...newQuestion, correct_index: Number(e.target.value) })}
              className="w-56 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              min={1}
              value={newQuestion.points}
              onChange={(e) => setNewQuestion({ ...newQuestion, points: Number(e.target.value) })}
              className="w-24 rounded-lg border border-slate-300 px-3 py-2 text-sm"
            />
          </div>
          <button className="rounded-lg bg-[#1E4FD8] px-4 py-2 text-sm font-medium text-white hover:bg-[#173da8]">
            Ajoute kesyon
          </button>
        </form>
      )}

      {role !== "admin" && (
        <form onSubmit={handleSubmit} className="space-y-5">
          {questions.map((q, i) => (
            <div key={q.id} className="rounded-xl bg-white p-4 shadow-sm">
              <p className="mb-2 text-sm font-medium text-slate-700">{i + 1}. {q.question_text}</p>
              {q.options.map((opt, idx) => (
                <label key={idx} className="mb-1 flex items-center gap-2 text-sm text-slate-600">
                  <input type="radio" name={q.id} onChange={() => setAnswers({ ...answers, [q.id]: idx })} required />
                  {opt}
                </label>
              ))}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-[#1E4FD8] py-2.5 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-60"
          >
            {submitting ? "Ap soumèt..." : "Soumèt"}
          </button>
        </form>
      )}
    </main>
  );
}
