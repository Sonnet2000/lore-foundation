"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/ecole-portail/client";

interface ModuleRow {
  id: string;
  month_number: number;
  title: string;
  description: string | null;
}
interface DocRow {
  id: string;
  title: string;
  file_path: string;
}
interface AssignmentRow {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  max_score: number;
}
interface RosterRow {
  id: string;
  full_name: string;
  matricule: string | null;
}
interface GradeRow {
  assignment_id: string;
  student_id?: string;
  score: number | null;
  feedback: string | null;
}

export default function CourseDetailPage({ params }: { params: { courseId: string } }) {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [documents, setDocuments] = useState<DocRow[]>([]);
  const [assignments, setAssignments] = useState<AssignmentRow[]>([]);
  const [grades, setGrades] = useState<GradeRow[]>([]);
  const [roster, setRoster] = useState<RosterRow[]>([]);
  const [quizzes, setQuizzes] = useState<{ id: string; title: string; is_published: boolean }[]>([]);
  const [newQuizTitle, setNewQuizTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [gradeInputs, setGradeInputs] = useState<Record<string, string>>({});

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let currentRole: string | null = null;
    if (user) {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      currentRole = profile?.role ?? null;
      setRole(currentRole);
    }

    const res = await fetch(`/api/ecole/courses/${params.courseId}`);
    const data = await res.json();
    setCourse(data.course ?? null);
    setModules(data.modules ?? []);
    setDocuments(data.documents ?? []);
    setAssignments(data.assignments ?? []);
    setGrades(data.grades ?? []);

    if (currentRole === "staff" || currentRole === "admin") {
      const rosterRes = await fetch(`/api/ecole/courses/${params.courseId}/roster`);
      const rosterData = await rosterRes.json();
      setRoster(rosterData.roster ?? []);
    }

    const quizRes = await fetch(`/api/ecole/courses/${params.courseId}/quizzes`);
    const quizData = await quizRes.json();
    setQuizzes(quizData.quizzes ?? []);

    setLoading(false);
  }

  useEffect(() => {
    load();
  }, [params.courseId]);

  async function submitGrade(assignmentId: string, studentId: string) {
    const score = Number(gradeInputs[`${assignmentId}:${studentId}`] ?? "");
    if (Number.isNaN(score)) return;

    await fetch(`/api/ecole/courses/${params.courseId}/assignments/${assignmentId}/grade`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_id: studentId, score }),
    });
    load();
  }

  async function uploadDocument(file: File) {
    const path = `${params.courseId}/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage.from("course-documents").upload(path, file);
    if (error) {
      alert("Echèk telechajman: " + error.message);
      return;
    }
    await fetch(`/api/ecole/courses/${params.courseId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: file.name, file_path: path, file_size: file.size }),
    });
    load();
  }

  function publicUrl(path: string) {
    return `${process.env.NEXT_PUBLIC_ECOLE_SUPABASE_URL}/storage/v1/object/public/course-documents/${path}`;
  }

  async function createQuiz(e: React.FormEvent) {
    e.preventDefault();
    if (!newQuizTitle.trim()) return;
    await fetch(`/api/ecole/courses/${params.courseId}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: newQuizTitle }),
    });
    setNewQuizTitle("");
    load();
  }

  if (loading) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;
  if (!course) return <p className="p-10 text-sm text-red-600">Kou a pa jwenn oswa pa aksesib.</p>;

  const isStaffOrAdmin = role === "staff" || role === "admin";

  const modulesByMonth = modules.reduce<Record<number, ModuleRow[]>>((acc, m) => {
    (acc[m.month_number] ??= []).push(m);
    return acc;
  }, {});

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-2xl font-semibold text-[#0B1F3B]">{course.name} {course.code ? `(${course.code})` : ""}</h1>
      {course.description && <p className="mt-1 text-sm text-slate-500">{course.description}</p>}

      {/* Modil pa mwa */}
      {Object.keys(modulesByMonth).length > 0 && (
        <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="mb-3 font-semibold text-[#0B1F3B]">Pwogram pa mwa</h2>
          {Object.entries(modulesByMonth).map(([month, mods]) => (
            <div key={month} className="mb-3">
              <p className="text-sm font-medium text-slate-600">Mwa {month}</p>
              <ul className="ml-4 list-disc text-sm text-slate-700">
                {mods.map((m) => (
                  <li key={m.id}>{m.title}{m.description ? ` — ${m.description}` : ""}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Dokiman */}
      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-[#0B1F3B]">Dokiman</h2>
        <ul className="space-y-1">
          {documents.map((d) => (
            <li key={d.id}>
              <a href={publicUrl(d.file_path)} target="_blank" className="text-sm text-[#1E4FD8] underline">
                📎 {d.title}
              </a>
            </li>
          ))}
          {documents.length === 0 && <li className="text-sm text-slate-400">Pa gen dokiman.</li>}
        </ul>
        {isStaffOrAdmin && (
          <label className="mt-3 inline-block cursor-pointer text-sm font-medium text-[#1E4FD8]">
            + Ajoute yon dokiman
            <input
              type="file"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) uploadDocument(f);
                e.target.value = "";
              }}
            />
          </label>
        )}
      </div>

      {/* Devwa ak nòt */}
      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-[#0B1F3B]">Devwa</h2>
        <ul className="space-y-3">
          {assignments.map((a) => {
            const myGrade = grades.find((g) => g.assignment_id === a.id);
            return (
              <li key={a.id} className="rounded-lg border border-slate-100 p-3">
                <p className="text-sm font-medium text-slate-700">{a.title}</p>
                {a.due_date && <p className="text-xs text-slate-400">Delè : {new Date(a.due_date).toLocaleDateString()}</p>}

                {!isStaffOrAdmin && (
                  <p className="mt-1 text-sm text-slate-600">
                    Nòt : {myGrade?.score !== undefined && myGrade?.score !== null ? `${myGrade.score}/${a.max_score}` : "poko note"}
                  </p>
                )}

                {isStaffOrAdmin && roster.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {roster.map((s) => {
                      const g = grades.find((gr) => gr.assignment_id === a.id && gr.student_id === s.id);
                      const key = `${a.id}:${s.id}`;
                      return (
                        <li key={s.id} className="flex items-center justify-between gap-2">
                          <span className="text-sm text-slate-600">{s.full_name}</span>
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              placeholder={g?.score !== undefined && g?.score !== null ? String(g.score) : "—"}
                              value={gradeInputs[key] ?? ""}
                              onChange={(e) => setGradeInputs({ ...gradeInputs, [key]: e.target.value })}
                              className="w-16 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                            />
                            <span className="text-xs text-slate-400">/{a.max_score}</span>
                            <button
                              onClick={() => submitGrade(a.id, s.id)}
                              className="rounded-lg bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200"
                            >
                              Anrejistre
                            </button>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </li>
            );
          })}
          {assignments.length === 0 && <li className="text-sm text-slate-400">Pa gen devwa.</li>}
        </ul>
      </div>

      {/* Kiz */}
      <div className="mt-6 rounded-xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold text-[#0B1F3B]">Kiz</h2>
        <ul className="space-y-1">
          {quizzes.map((q) => (
            <li key={q.id} className="flex items-center justify-between">
              <a href={`/ecole/portail/quizzes/${q.id}`} className="text-sm text-[#1E4FD8] underline">📝 {q.title}</a>
              {!q.is_published && <span className="text-xs text-slate-400">bouyon</span>}
            </li>
          ))}
          {quizzes.length === 0 && <li className="text-sm text-slate-400">Pa gen kiz.</li>}
        </ul>

        {role === "admin" && (
          <form onSubmit={createQuiz} className="mt-3 flex gap-2">
            <input
              placeholder="Tit nouvo kiz la"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              className="flex-1 rounded-lg border border-slate-300 px-3 py-1.5 text-sm"
            />
            <button className="rounded-lg bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-200">
              Ajoute kiz
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
