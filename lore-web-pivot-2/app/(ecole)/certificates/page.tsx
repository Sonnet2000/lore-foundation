"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const KIND_OPTIONS = [
  { value: "completion", label: "Konplete kou" },
  { value: "enrollment", label: "Enskripsyon" },
  { value: "honor", label: "Onè" },
];

export default function CertificatesPage() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState<{ id: string; full_name: string; matricule: string | null }[]>([]);
  const [courses, setCourses] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({ student_id: "", kind: "completion", course_id: "", note: "" });
  const [issuing, setIssuing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const [myHistory, setMyHistory] = useState<any[]>([]);
  const [staffHistory, setStaffHistory] = useState<any[]>([]);

  async function loadHistory(userId: string, isStaffOrAdmin: boolean) {
    if (isStaffOrAdmin) {
      const { data } = await supabase
        .from("certificate_issuances")
        .select("id, kind, cert_no, note, issued_at, courses ( name ), profiles:student_id ( full_name )")
        .order("issued_at", { ascending: false })
        .limit(50);
      setStaffHistory(data ?? []);
    } else {
      const { data } = await supabase
        .from("certificate_issuances")
        .select("id, kind, cert_no, note, issued_at, courses ( name )")
        .eq("student_id", userId)
        .order("issued_at", { ascending: false });
      setMyHistory(data ?? []);
    }
  }

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      const r = profile?.role ?? null;
      setRole(r);

      const isStaffOrAdmin = r === "staff" || r === "admin";
      if (isStaffOrAdmin) {
        const [{ data: studentProfiles }, coursesRes] = await Promise.all([
          supabase.from("profiles").select("id, full_name, matricule").eq("role", "student").order("full_name"),
          fetch("/api/ecole/courses"),
        ]);
        setStudents(studentProfiles ?? []);
        const coursesData = await coursesRes.json();
        setCourses(coursesData.courses ?? []);
      }

      await loadHistory(user.id, isStaffOrAdmin);
      setLoading(false);
    })();
  }, []);

  async function issue(e: React.FormEvent) {
    e.preventDefault();
    if (!form.student_id) return;
    setIssuing(true);
    setMessage(null);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("certificate_issuances").insert({
      student_id: form.student_id,
      kind: form.kind,
      course_id: form.course_id || null,
      note: form.note || null,
      issued_by: user!.id,
    });

    setIssuing(false);
    if (error) {
      setMessage("Erè: " + error.message);
      return;
    }
    setMessage("Sètifika anrejistre.");
    setForm({ student_id: "", kind: "completion", course_id: "", note: "" });
    loadHistory(user!.id, true);
  }

  if (loading) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;

  const isStaffOrAdmin = role === "staff" || role === "admin";

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#0B1F3B]">Sètifika</h1>

      {isStaffOrAdmin && (
        <form onSubmit={issue} className="mb-8 space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#0B1F3B]">Anrejistre yon sètifika</h2>
          <select
            value={form.student_id}
            onChange={(e) => setForm({ ...form, student_id: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">Chwazi yon etidyan</option>
            {students.map((s) => <option key={s.id} value={s.id}>{s.full_name} {s.matricule ? `(${s.matricule})` : ""}</option>)}
          </select>
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            {KIND_OPTIONS.map((k) => <option key={k.value} value={k.value}>{k.label}</option>)}
          </select>
          <select
            value={form.course_id}
            onChange={(e) => setForm({ ...form, course_id: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="">(San kou espesifik)</option>
            {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <input
            placeholder="Nòt (opsyonèl)"
            value={form.note}
            onChange={(e) => setForm({ ...form, note: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          {message && <p className="text-sm text-slate-600">{message}</p>}
          <button disabled={issuing} className="rounded-lg bg-[#1E4FD8] px-4 py-2 text-sm font-medium text-white hover:bg-[#173da8] disabled:opacity-60">
            {issuing ? "..." : "Anrejistre"}
          </button>
        </form>
      )}

      <div className="overflow-hidden rounded-xl bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-slate-500">
            <tr>
              {isStaffOrAdmin && <th className="px-4 py-3">Etidyan</th>}
              <th className="px-4 py-3">Kalite</th>
              <th className="px-4 py-3">Kou</th>
              <th className="px-4 py-3">Dat</th>
            </tr>
          </thead>
          <tbody>
            {(isStaffOrAdmin ? staffHistory : myHistory).length === 0 && (
              <tr><td colSpan={4} className="px-4 py-6 text-center text-slate-400">Pa gen sètifika.</td></tr>
            )}
            {(isStaffOrAdmin ? staffHistory : myHistory).map((c: any) => (
              <tr key={c.id} className="border-t border-slate-100">
                {isStaffOrAdmin && <td className="px-4 py-3">{c.profiles?.full_name ?? "—"}</td>}
                <td className="px-4 py-3">{KIND_OPTIONS.find((k) => k.value === c.kind)?.label ?? c.kind}</td>
                <td className="px-4 py-3">{c.courses?.name ?? "—"}</td>
                <td className="px-4 py-3">{new Date(c.issued_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
