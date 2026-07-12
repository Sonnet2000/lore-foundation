"use client";

import { useEffect, useState } from "react";
import {
  Plus, Loader2, GraduationCap, Users, ChevronDown, ClipboardList,
  CheckCircle2, XCircle, Clock, FileText, Link as LinkIcon, Award, PlayCircle, Wallet,
} from "lucide-react";
import {
  FieldLabel, TextInput, TextArea, SelectInput, PrimaryButton, GhostButton, RowCard,
} from "./ui";
import ImageUploadField from "./ImageUploadField";
import FileUploadField from "./FileUploadField";
import ConfirmModal from "./ConfirmModal";
import type { CourseRow, EnrollmentRow, AssignmentRow, SubmissionRow, LessonRow, CourseFormat } from "./types";

type CourseForm = {
  title: string;
  slug: string;
  description: string;
  cover_url: string | null;
  price: string;
  duration: string;
  format: CourseFormat;
  is_published: boolean;
};

const emptyCourseForm: CourseForm = {
  title: "", slug: "", description: "", cover_url: null, price: "", duration: "", format: "in_person", is_published: true,
};

type LessonForm = {
  title: string;
  description: string;
  video_url: string;
  content: string;
  is_published: boolean;
};

const emptyLessonForm: LessonForm = {
  title: "", description: "", video_url: "", content: "", is_published: true,
};

type AssignmentForm = {
  title: string;
  description: string;
  attachment_url: string | null;
  due_at: string;
  is_published: boolean;
};

const emptyAssignmentForm: AssignmentForm = {
  title: "", description: "", attachment_url: null, due_at: "", is_published: true,
};

function isoToLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

const STATUS_LABEL: Record<string, string> = { pending: "An atant", approved: "Apwouve", rejected: "Rejte" };

export default function CoursesPanel() {
  const [courses, setCourses] = useState<CourseRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<CourseForm>(emptyCourseForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CourseRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [expanded, setExpanded] = useState<{ courseId: string; view: "enrollments" | "assignments" | "lessons" } | null>(null);
  const [enrollments, setEnrollments] = useState<EnrollmentRow[] | null>(null);
  const [assignments, setAssignments] = useState<AssignmentRow[] | null>(null);
  const [lessons, setLessons] = useState<LessonRow[] | null>(null);

  const [assignmentEditingId, setAssignmentEditingId] = useState<string | "new" | null>(null);
  const [assignmentForm, setAssignmentForm] = useState<AssignmentForm>(emptyAssignmentForm);
  const [assignmentSaving, setAssignmentSaving] = useState(false);
  const [assignmentDeleteTarget, setAssignmentDeleteTarget] = useState<AssignmentRow | null>(null);

  const [lessonEditingId, setLessonEditingId] = useState<string | "new" | null>(null);
  const [lessonForm, setLessonForm] = useState<LessonForm>(emptyLessonForm);
  const [lessonSaving, setLessonSaving] = useState(false);
  const [lessonDeleteTarget, setLessonDeleteTarget] = useState<LessonRow | null>(null);

  const [expandedAssignmentId, setExpandedAssignmentId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionRow[] | null>(null);

  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeForm, setGradeForm] = useState<{ grade: string; feedback: string }>({ grade: "", feedback: "" });

  useEffect(() => { refreshCourses(); }, []);

  async function refreshCourses() {
    const res = await fetch("/api/admin/courses", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setCourses(res.ok ? data.items ?? [] : []);
  }

  function startNewCourse() { setForm(emptyCourseForm); setEditingId("new"); setError(null); }

  function startEditCourse(c: CourseRow) {
    setForm({
      title: c.title, slug: c.slug, description: c.description, cover_url: c.cover_url,
      price: c.price, duration: c.duration, format: c.format, is_published: c.is_published,
    });
    setEditingId(c.id);
    setError(null);
  }

  async function saveCourse() {
    if (!form.title.trim()) { setError("Tit la obligatwa."); return; }
    setSaving(true); setError(null);
    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/admin/courses" : `/api/admin/courses/${editingId}`, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(data.error || "Echèk anrejistreman."); return; }
    setEditingId(null);
    refreshCourses();
  }

  async function confirmDeleteCourse() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/courses/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    if (expanded?.courseId === deleteTarget.id) setExpanded(null);
    refreshCourses();
  }

  async function toggleView(courseId: string, view: "enrollments" | "assignments" | "lessons") {
    if (expanded?.courseId === courseId && expanded.view === view) { setExpanded(null); return; }
    setExpanded({ courseId, view });
    setExpandedAssignmentId(null);
    if (view === "enrollments") {
      setEnrollments(null);
      const res = await fetch(`/api/admin/courses/${courseId}/enrollments`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setEnrollments(data.items ?? []);
    } else if (view === "assignments") {
      setAssignments(null);
      const res = await fetch(`/api/admin/assignments?course_id=${courseId}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setAssignments(data.items ?? []);
    } else {
      setLessons(null);
      const res = await fetch(`/api/admin/lessons?course_id=${courseId}`, { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setLessons(data.items ?? []);
    }
  }

  async function decideEnrollment(id: string, status: "approved" | "rejected") {
    setEnrollments((prev) => prev?.map((e) => (e.id === id ? { ...e, status } : e)) ?? null);
    await fetch(`/api/admin/enrollments/${id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  function startNewAssignment() { setAssignmentForm(emptyAssignmentForm); setAssignmentEditingId("new"); }

  function startEditAssignment(a: AssignmentRow) {
    setAssignmentForm({
      title: a.title, description: a.description, attachment_url: a.attachment_url,
      due_at: isoToLocalInput(a.due_at), is_published: a.is_published,
    });
    setAssignmentEditingId(a.id);
  }

  async function saveAssignment() {
    if (!expanded || !assignmentForm.title.trim()) return;
    setAssignmentSaving(true);
    const isNew = assignmentEditingId === "new";
    const payload = { ...assignmentForm, due_at: localInputToIso(assignmentForm.due_at), course_id: expanded.courseId };
    const res = await fetch(isNew ? "/api/admin/assignments" : `/api/admin/assignments/${assignmentEditingId}`, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setAssignmentSaving(false);
    if (!res.ok) return;
    setAssignmentEditingId(null);
    toggleAssignmentsRefresh();
  }

  async function toggleAssignmentsRefresh() {
    if (!expanded) return;
    const res = await fetch(`/api/admin/assignments?course_id=${expanded.courseId}`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setAssignments(data.items ?? []);
  }

  async function confirmDeleteAssignment() {
    if (!assignmentDeleteTarget) return;
    await fetch(`/api/admin/assignments/${assignmentDeleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setAssignmentDeleteTarget(null);
    if (expandedAssignmentId === assignmentDeleteTarget.id) setExpandedAssignmentId(null);
    toggleAssignmentsRefresh();
  }

  function startNewLesson() { setLessonForm(emptyLessonForm); setLessonEditingId("new"); }

  function startEditLesson(l: LessonRow) {
    setLessonForm({
      title: l.title, description: l.description, video_url: l.video_url ?? "",
      content: l.content, is_published: l.is_published,
    });
    setLessonEditingId(l.id);
  }

  async function refreshLessons() {
    if (!expanded) return;
    const res = await fetch(`/api/admin/lessons?course_id=${expanded.courseId}`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setLessons(data.items ?? []);
  }

  async function saveLesson() {
    if (!expanded || !lessonForm.title.trim()) return;
    setLessonSaving(true);
    const isNew = lessonEditingId === "new";
    const payload = { ...lessonForm, course_id: expanded.courseId };
    const res = await fetch(isNew ? "/api/admin/lessons" : `/api/admin/lessons/${lessonEditingId}`, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLessonSaving(false);
    if (!res.ok) return;
    setLessonEditingId(null);
    refreshLessons();
  }

  async function confirmDeleteLesson() {
    if (!lessonDeleteTarget) return;
    await fetch(`/api/admin/lessons/${lessonDeleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setLessonDeleteTarget(null);
    refreshLessons();
  }

  async function toggleSubmissions(assignmentId: string) {
    if (expandedAssignmentId === assignmentId) { setExpandedAssignmentId(null); return; }
    setExpandedAssignmentId(assignmentId);
    setSubmissions(null);
    const res = await fetch(`/api/admin/assignments/${assignmentId}/submissions`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setSubmissions(data.items ?? []);
  }

  function startGrading(s: SubmissionRow) {
    setGradingId(s.id);
    setGradeForm({ grade: s.grade ?? "", feedback: s.feedback ?? "" });
  }

  async function saveGrade(assignmentId: string) {
    if (!gradingId) return;
    await fetch(`/api/admin/submissions/${gradingId}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(gradeForm),
    });
    setGradingId(null);
    const res = await fetch(`/api/admin/assignments/${assignmentId}/submissions`, { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setSubmissions(data.items ?? []);
  }

  if (courses === null) {
    return (
      <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Efase kou sa a ?"
        message={`« ${deleteTarget?.title} », tout enskripsyon ak devwa li yo ap efase pou tout tan.`}
        confirmLabel="Efase"
        danger
        loading={deleting}
        onConfirm={confirmDeleteCourse}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!assignmentDeleteTarget}
        title="Efase devwa sa a ?"
        message={`« ${assignmentDeleteTarget?.title} » ak tout soumisyon li yo ap efase pou tout tan.`}
        confirmLabel="Efase"
        danger
        onConfirm={confirmDeleteAssignment}
        onCancel={() => setAssignmentDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!lessonDeleteTarget}
        title="Efase leson sa a ?"
        message={`« ${lessonDeleteTarget?.title} » ap efase pou tout tan.`}
        confirmLabel="Efase"
        danger
        onConfirm={confirmDeleteLesson}
        onCancel={() => setLessonDeleteTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Kou yo ({courses.length})</h2>
          {editingId === null && (
            <PrimaryButton onClick={startNewCourse}><Plus className="h-4 w-4" />Nouvo kou</PrimaryButton>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          Yon el&egrave;v ki mande pou l enskri rete &laquo; an atant &raquo; jiskaske ou apwouve li isit la. Se apre sa li ka wè devwa yo.
        </p>

        {editingId !== null && (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Tit kou a</FieldLabel>
                <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Devlopman Web Fondamantal" />
              </div>
              <div>
                <FieldLabel>Dire (opsyonèl)</FieldLabel>
                <TextInput value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="8 semenn" />
              </div>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Slug (URL)</FieldLabel>
                <TextInput value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="devlopman-web (kite vid pou otomatik)" />
              </div>
              <div>
                <FieldLabel>Pri (opsyonèl)</FieldLabel>
                <TextInput value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="Gratis, oswa 2 500 HTG" />
              </div>
            </div>
            <div className="mt-4">
              <FieldLabel>Fòma</FieldLabel>
              <SelectInput value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value as CourseFormat })}>
                <option value="in_person">En présentiel</option>
                <option value="online">100% en ligne</option>
                <option value="hybrid">Hybride</option>
              </SelectInput>
            </div>
            <div className="mt-4">
              <FieldLabel>Deskripsyon</FieldLabel>
              <TextArea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Prezante kou a..." />
            </div>
            <div className="mt-4">
              <ImageUploadField label="Foto kouvèti" value={form.cover_url} onChange={(url) => setForm({ ...form, cover_url: url })} folder="courses" />
            </div>
            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                Publye (vizib sou espas manm nan)
              </label>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <div className="mt-5 flex items-center gap-3">
              <PrimaryButton onClick={saveCourse} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}Anrejistre
              </PrimaryButton>
              <GhostButton onClick={() => setEditingId(null)} disabled={saving}>Anile</GhostButton>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {courses.map((c) => (
            <div key={c.id} className="flex flex-col gap-2">
              <RowCard
                title={c.title}
                subtitle={`${c.duration || "Dire pa presize"}${c.is_published ? "" : " · Pa publye"}`}
                thumbnail={
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lore-blue/10 text-lore-blue dark:bg-lore-blue/15">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                }
                onEdit={() => startEditCourse(c)}
                onDelete={() => setDeleteTarget(c)}
              />
              <div className="ml-[60px] flex flex-wrap gap-4">
                <button type="button" onClick={() => toggleView(c.id, "enrollments")}
                  className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-lore-emerald hover:text-lore-dark dark:text-lore-emerald-light">
                  <Users className="h-3.5 w-3.5" />Enskripsyon
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded?.courseId === c.id && expanded.view === "enrollments" ? "rotate-180" : ""}`} />
                </button>
                <button type="button" onClick={() => toggleView(c.id, "assignments")}
                  className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-lore-blue hover:text-lore-dark dark:text-blue-300">
                  <ClipboardList className="h-3.5 w-3.5" />Devwa
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded?.courseId === c.id && expanded.view === "assignments" ? "rotate-180" : ""}`} />
                </button>
                <button type="button" onClick={() => toggleView(c.id, "lessons")}
                  className="focus-ring flex items-center gap-1.5 text-xs font-semibold text-lore-gold-dark hover:text-lore-dark dark:text-lore-gold-light">
                  <PlayCircle className="h-3.5 w-3.5" />Leçons
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded?.courseId === c.id && expanded.view === "lessons" ? "rotate-180" : ""}`} />
                </button>
              </div>

              {expanded?.courseId === c.id && expanded.view === "enrollments" && (
                <div className="ml-[60px] rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
                  {enrollments === null ? (
                    <Loader2 className="h-4 w-4 animate-spin text-lore-ink/40 dark:text-white/40" />
                  ) : enrollments.length === 0 ? (
                    <p className="text-sm text-lore-ink/40 dark:text-white/40">Pa gen demand enskripsyon.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {enrollments.map((e) => (
                        <div key={e.id} className="flex flex-col gap-2 border-b border-lore-dark/5 pb-3 last:border-0 dark:border-white/5 sm:flex-row sm:items-center sm:justify-between">
                          <div>
                            <p className="text-sm font-semibold text-lore-ink dark:text-white">{e.full_name || e.email}</p>
                            <p className="text-xs text-lore-ink/50 dark:text-white/50">{e.email}{e.phone ? ` · ${e.phone}` : ""}</p>
                            {(e.payment_reference || e.payment_proof_url) && (
                              <p className="mt-1 flex items-center gap-2 text-xs text-lore-gold-dark dark:text-lore-gold-light">
                                <Wallet className="h-3 w-3" />
                                {e.payment_reference && <span className="font-mono">{e.payment_reference}</span>}
                                {e.payment_proof_url && (
                                  <a href={e.payment_proof_url} target="_blank" rel="noopener noreferrer" className="underline">Gade prèv</a>
                                )}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                              e.status === "approved" ? "bg-lore-emerald/10 text-lore-emerald" :
                              e.status === "rejected" ? "bg-red-500/10 text-red-500" :
                              "bg-amber-500/10 text-amber-600"
                            }`}>
                              {e.status === "approved" ? <CheckCircle2 className="h-3 w-3" /> : e.status === "rejected" ? <XCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                              {STATUS_LABEL[e.status]}
                            </span>
                            {e.status !== "approved" && (
                              <button onClick={() => decideEnrollment(e.id, "approved")} className="focus-ring rounded-full bg-lore-emerald/10 px-3 py-1.5 text-xs font-semibold text-lore-emerald hover:bg-lore-emerald/20">Apwouve</button>
                            )}
                            {e.status !== "rejected" && (
                              <button onClick={() => decideEnrollment(e.id, "rejected")} className="focus-ring rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20">Rejte</button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {expanded?.courseId === c.id && expanded.view === "assignments" && (
                <div className="ml-[60px] flex flex-col gap-3 rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-lore-ink/50 dark:text-white/50">Devwa pou kou sa a</p>
                    {assignmentEditingId === null && (
                      <button onClick={startNewAssignment} className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-lore-blue/10 px-3 py-1.5 text-xs font-semibold text-lore-blue hover:bg-lore-blue/20 dark:text-blue-300">
                        <Plus className="h-3.5 w-3.5" />Nouvo devwa
                      </button>
                    )}
                  </div>

                  {assignmentEditingId !== null && (
                    <div className="rounded-2xl border border-lore-dark/5 bg-lore-cream/60 p-4 dark:border-white/5 dark:bg-white/[0.04]">
                      <FieldLabel>Tit devwa a</FieldLabel>
                      <TextInput value={assignmentForm.title} onChange={(e) => setAssignmentForm({ ...assignmentForm, title: e.target.value })} placeholder="Devwa 1 : Kreye yon paj HTML" />
                      <div className="mt-3">
                        <FieldLabel>Deskripsyon / enstriksyon</FieldLabel>
                        <TextArea rows={3} value={assignmentForm.description} onChange={(e) => setAssignmentForm({ ...assignmentForm, description: e.target.value })} />
                      </div>
                      <div className="mt-3">
                        <FieldLabel>Dat limit (opsyonèl)</FieldLabel>
                        <TextInput type="datetime-local" value={assignmentForm.due_at} onChange={(e) => setAssignmentForm({ ...assignmentForm, due_at: e.target.value })} />
                      </div>
                      <div className="mt-3">
                        <FileUploadField label="Fichye/dokiman ki mache ak devwa a" value={assignmentForm.attachment_url} onChange={(url) => setAssignmentForm({ ...assignmentForm, attachment_url: url })} folder="assignments" />
                      </div>
                      <div className="mt-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                          <input type="checkbox" checked={assignmentForm.is_published} onChange={(e) => setAssignmentForm({ ...assignmentForm, is_published: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                          Publye (vizib pou elèv apwouve yo)
                        </label>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <PrimaryButton onClick={saveAssignment} disabled={assignmentSaving}>
                          {assignmentSaving && <Loader2 className="h-4 w-4 animate-spin" />}Anrejistre
                        </PrimaryButton>
                        <GhostButton onClick={() => setAssignmentEditingId(null)}>Anile</GhostButton>
                      </div>
                    </div>
                  )}

                  {assignments === null ? (
                    <Loader2 className="h-4 w-4 animate-spin text-lore-ink/40 dark:text-white/40" />
                  ) : assignments.length === 0 ? (
                    <p className="text-sm text-lore-ink/40 dark:text-white/40">Pa gen devwa pou kounye a.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {assignments.map((a) => (
                        <div key={a.id} className="flex flex-col gap-2">
                          <div className="flex items-center justify-between rounded-xl border border-lore-dark/5 p-3 dark:border-white/5">
                            <div>
                              <p className="text-sm font-semibold text-lore-ink dark:text-white">{a.title}</p>
                              <p className="text-xs text-lore-ink/50 dark:text-white/50">
                                {formatDate(a.due_at) ? `Delè : ${formatDate(a.due_at)}` : "Pa gen delè"}{a.is_published ? "" : " · Pa publye"}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => startEditAssignment(a)} className="focus-ring text-xs font-semibold text-lore-ink/50 hover:text-lore-blue dark:text-white/50">Modifye</button>
                              <button onClick={() => setAssignmentDeleteTarget(a)} className="focus-ring text-xs font-semibold text-lore-ink/50 hover:text-red-500 dark:text-white/50">Efase</button>
                              <button onClick={() => toggleSubmissions(a.id)} className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-lore-emerald hover:text-lore-dark dark:text-lore-emerald-light">
                                Soumisyon
                                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${expandedAssignmentId === a.id ? "rotate-180" : ""}`} />
                              </button>
                            </div>
                          </div>

                          {expandedAssignmentId === a.id && (
                            <div className="ml-4 rounded-xl border border-lore-dark/5 bg-lore-cream/40 p-3 dark:border-white/5 dark:bg-white/[0.02]">
                              {submissions === null ? (
                                <Loader2 className="h-4 w-4 animate-spin text-lore-ink/40 dark:text-white/40" />
                              ) : submissions.length === 0 ? (
                                <p className="text-sm text-lore-ink/40 dark:text-white/40">Pa gen soumisyon pou kounye a.</p>
                              ) : (
                                <div className="flex flex-col gap-3">
                                  {submissions.map((s) => (
                                    <div key={s.id} className="flex flex-col gap-2 border-b border-lore-dark/10 pb-3 last:border-0 dark:border-white/5">
                                      <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-lore-ink dark:text-white">{s.full_name || s.email}</p>
                                        <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${s.status === "graded" ? "bg-lore-emerald/10 text-lore-emerald" : "bg-amber-500/10 text-amber-600"}`}>
                                          {s.status === "graded" ? `Kòrije${s.grade ? ` · ${s.grade}` : ""}` : "Poko kòrije"}
                                        </span>
                                      </div>
                                      {s.text_response && <p className="whitespace-pre-wrap text-xs text-lore-ink/70 dark:text-white/70">{s.text_response}</p>}
                                      <div className="flex flex-wrap gap-3">
                                        {s.link_url && (
                                          <a href={s.link_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-lore-blue hover:underline">
                                            <LinkIcon className="h-3 w-3" />Lyen
                                          </a>
                                        )}
                                        {s.file_url && (
                                          <a href={s.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-lore-blue hover:underline">
                                            <FileText className="h-3 w-3" />Fichye
                                          </a>
                                        )}
                                      </div>

                                      {gradingId === s.id ? (
                                        <div className="mt-1 flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-lore-night-surface">
                                          <TextInput placeholder="Nòt (ex: 18/20, oswa A)" value={gradeForm.grade} onChange={(e) => setGradeForm({ ...gradeForm, grade: e.target.value })} />
                                          <TextArea rows={2} placeholder="Kòmantè pou elèv la..." value={gradeForm.feedback} onChange={(e) => setGradeForm({ ...gradeForm, feedback: e.target.value })} />
                                          <div className="flex gap-2">
                                            <PrimaryButton onClick={() => saveGrade(a.id)} className="!px-4 !py-1.5 !text-xs"><Award className="h-3.5 w-3.5" />Anrejistre nòt</PrimaryButton>
                                            <GhostButton onClick={() => setGradingId(null)} className="!px-4 !py-1.5 !text-xs">Anile</GhostButton>
                                          </div>
                                        </div>
                                      ) : (
                                        <button onClick={() => startGrading(s)} className="focus-ring self-start text-xs font-semibold text-lore-emerald hover:text-lore-dark dark:text-lore-emerald-light">
                                          {s.status === "graded" ? "Modifye nòt la" : "Bay nòt"}
                                        </button>
                                      )}
                                      {s.feedback && gradingId !== s.id && (
                                        <p className="text-xs italic text-lore-ink/50 dark:text-white/50">« {s.feedback} »</p>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {expanded?.courseId === c.id && expanded.view === "lessons" && (
                <div className="ml-[60px] flex flex-col gap-3 rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold text-lore-ink/50 dark:text-white/50">Leçons pou kou sa a</p>
                    {lessonEditingId === null && (
                      <button onClick={startNewLesson} className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-lore-gold/10 px-3 py-1.5 text-xs font-semibold text-lore-gold-dark hover:bg-lore-gold/20 dark:text-lore-gold-light">
                        <Plus className="h-3.5 w-3.5" />Nouvo leson
                      </button>
                    )}
                  </div>

                  {lessonEditingId !== null && (
                    <div className="rounded-2xl border border-lore-dark/5 bg-lore-cream/60 p-4 dark:border-white/5 dark:bg-white/[0.04]">
                      <FieldLabel>Tit leson an</FieldLabel>
                      <TextInput value={lessonForm.title} onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })} placeholder="Leson 1 : Entwodiksyon" />
                      <div className="mt-3">
                        <FieldLabel>Lyen videyo (YouTube, Vimeo, oswa lyen dirèk .mp4)</FieldLabel>
                        <TextInput value={lessonForm.video_url} onChange={(e) => setLessonForm({ ...lessonForm, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=..." />
                      </div>
                      <div className="mt-3">
                        <FieldLabel>Deskripsyon kout</FieldLabel>
                        <TextArea rows={2} value={lessonForm.description} onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })} />
                      </div>
                      <div className="mt-3">
                        <FieldLabel>Nòt/kontni siplemantè (opsyonèl)</FieldLabel>
                        <TextArea rows={3} value={lessonForm.content} onChange={(e) => setLessonForm({ ...lessonForm, content: e.target.value })} />
                      </div>
                      <div className="mt-3">
                        <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                          <input type="checkbox" checked={lessonForm.is_published} onChange={(e) => setLessonForm({ ...lessonForm, is_published: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                          Publye (vizib pou elèv apwouve yo)
                        </label>
                      </div>
                      <div className="mt-4 flex items-center gap-3">
                        <PrimaryButton onClick={saveLesson} disabled={lessonSaving}>
                          {lessonSaving && <Loader2 className="h-4 w-4 animate-spin" />}Anrejistre
                        </PrimaryButton>
                        <GhostButton onClick={() => setLessonEditingId(null)}>Anile</GhostButton>
                      </div>
                    </div>
                  )}

                  {lessons === null ? (
                    <Loader2 className="h-4 w-4 animate-spin text-lore-ink/40 dark:text-white/40" />
                  ) : lessons.length === 0 ? (
                    <p className="text-sm text-lore-ink/40 dark:text-white/40">Pa gen leson pou kounye a.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      {lessons.map((l) => (
                        <div key={l.id} className="flex items-center justify-between rounded-xl border border-lore-dark/5 p-3 dark:border-white/5">
                          <div className="flex items-center gap-2">
                            <PlayCircle className="h-4 w-4 text-lore-gold-dark dark:text-lore-gold-light" />
                            <div>
                              <p className="text-sm font-semibold text-lore-ink dark:text-white">{l.title}</p>
                              <p className="text-xs text-lore-ink/50 dark:text-white/50">{l.is_published ? "Publye" : "Pa publye"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <button onClick={() => startEditLesson(l)} className="focus-ring text-xs font-semibold text-lore-ink/50 hover:text-lore-blue dark:text-white/50">Modifye</button>
                            <button onClick={() => setLessonDeleteTarget(l)} className="focus-ring text-xs font-semibold text-lore-ink/50 hover:text-red-500 dark:text-white/50">Efase</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {courses.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Pa gen kou kounye a.</p>
          )}
        </div>
      </div>
    </>
  );
}
