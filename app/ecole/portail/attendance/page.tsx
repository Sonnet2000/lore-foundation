"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/ecole-portail/client";

const STATUS_OPTIONS = [
  { value: "present", label: "Prezan", color: "bg-emerald-100 text-emerald-700" },
  { value: "absent", label: "Absan", color: "bg-red-100 text-red-700" },
  { value: "late", label: "An reta", color: "bg-amber-100 text-amber-700" },
];

export default function AttendancePage() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Staff/admin
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [courseId, setCourseId] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [cutoff, setCutoff] = useState("08:00");
  const [roster, setRoster] = useState<{ student_id: string; full_name: string; status: string | null }[]>([]);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Student
  const [myHistory, setMyHistory] = useState<any[]>([]);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(profile?.role ?? null);

      if (profile?.role === "staff" || profile?.role === "admin") {
        const res = await fetch("/api/ecole/courses");
        const data = await res.json();
        setCourses(data.courses ?? []);
      } else {
        const { data } = await supabase
          .from("attendance")
          .select("date, status, courses ( name )")
          .eq("student_id", user.id)
          .order("date", { ascending: false });
        setMyHistory(data ?? []);
      }
      setLoading(false);
    })();
  }, []);

  async function loadRoster() {
    if (!courseId || !date) return;
    const res = await fetch(`/api/ecole/courses/${courseId}/attendance?date=${date}`);
    const data = await res.json();
    setCutoff(data.cutoff_time ?? "08:00");
    setRoster(data.roster ?? []);
    const initial: Record<string, string> = {};
    for (const r of data.roster ?? []) initial[r.student_id] = r.status ?? "present";
    setMarks(initial);
  }

  async function submit() {
    setSaving(true);
    setMessage(null);
    const records = Object.entries(marks).map(([student_id, status]) => ({ student_id, status }));
    const res = await fetch(`/api/ecole/courses/${courseId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, cutoff_time: cutoff, records }),
    });
    setSaving(false);
    setMessage(res.ok ? "Prezans anrejistre." : "Erè pandan anrejistreman an.");
  }

  if (loading) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;

  if (role === "student") {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="mb-6 text-2xl font-semibold text-[#0B1F3B]">Pwòp prezans mwen</h1>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-left text-slate-500">
              <tr><th className="px-4 py-3">Dat</th><th className="px-4 py-3">Kou</th><th className="px-4 py-3">Estati</th></tr>
            </thead>
            <tbody>
              {myHistory.length === 0 && <tr><td colSpan={3} className="px-4 py-6 text-center text-slate-400">Pa gen prezans anrejistre.</td></tr>}
              {myHistory.map((r, i) => (
                <tr key={i} className="border-t border-slate-100">
                  <td className="px-4 py-3">{r.date}</td>
                  <td className="px-4 py-3">{r.courses?.name ?? "—"}</td>
                  <td className="px-4 py-3">{STATUS_OPTIONS.find((s) => s.value === r.status)?.label ?? r.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#0B1F3B]">Pran prezans</h1>

      <div className="mb-6 flex flex-wrap items-end gap-3 rounded-xl bg-white p-5 shadow-sm">
        <div>
          <label className="block text-xs font-medium text-slate-600">Kou</label>
          <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm">
            <option value="">Chwazi yon kou</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Dat</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600">Lè limit</label>
          <input type="time" value={cutoff} onChange={(e) => setCutoff(e.target.value)} className="mt-1 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
        </div>
        <button onClick={loadRoster} disabled={!courseId} className="rounded-lg bg-[#1E4FD8] px-4 py-2 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-60">
          Chaje wonm
        </button>
      </div>

      {roster.length > 0 && (
        <div className="space-y-2">
          {roster.map((r) => (
            <div key={r.student_id} className="flex items-center justify-between rounded-xl bg-white p-3 shadow-sm">
              <p className="text-sm font-medium text-slate-700">{r.full_name}</p>
              <div className="flex gap-1">
                {STATUS_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setMarks({ ...marks, [r.student_id]: opt.value })}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${marks[r.student_id] === opt.value ? opt.color : "bg-slate-50 text-slate-400"}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          ))}

          {message && <p className="text-sm text-slate-600">{message}</p>}
          <button onClick={submit} disabled={saving} className="mt-3 w-full rounded-lg bg-[#1E4FD8] py-2.5 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-60">
            {saving ? "Ap anrejistre..." : "Anrejistre prezans"}
          </button>
        </div>
      )}
    </main>
  );
}
