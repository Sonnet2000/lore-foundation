"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, Clock3, CheckCircle2, XCircle, FileText,
  Upload, Loader2, Award, Paperclip, PlayCircle,
} from "lucide-react";
import type { CourseRow, EnrollmentRow, AssignmentRow, SubmissionRow, LessonRow } from "@/lib/school";

type Data = {
  course: CourseRow;
  enrollment: EnrollmentRow | null;
  assignments: (AssignmentRow & { submission: SubmissionRow | null })[];
  lessons: LessonRow[];
};

function formatDate(iso: string | null) {
  if (!iso) return null;
  return new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(iso));
}

async function uploadHomeworkFile(file: File): Promise<string | null> {
  const signRes = await fetch("/api/account/upload-url", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ filename: file.name, size: file.size }),
  });
  if (!signRes.ok) return null;
  const signData = await signRes.json();

  const uploadRes = await fetch(signData.signedUrl, {
    method: "PUT",
    headers: { "Content-Type": signData.contentType },
    body: file,
  });
  if (!uploadRes.ok) return null;

  return signData.publicUrl as string;
}

function AssignmentCard({ item }: { item: Data["assignments"][number] }) {
  const [textResponse, setTextResponse] = useState(item.submission?.text_response ?? "");
  const [linkUrl, setLinkUrl] = useState(item.submission?.link_url ?? "");
  const [fileUrl, setFileUrl] = useState<string | null>(item.submission?.file_url ?? null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submission, setSubmission] = useState(item.submission);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    const url = await uploadHomeworkFile(file);
    setUploading(false);
    if (!url) { setError("Echèk voye fichye a."); return; }
    setFileUrl(url);
  }

  async function handleSubmit() {
    setSaving(true);
    setError(null);
    const res = await fetch(`/api/account/assignments/${item.id}/submit`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text_response: textResponse, link_url: linkUrl, file_url: fileUrl ?? "" }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(data.error || "Echèk soumèt devwa a."); return; }
    setSubmission(data.submission);
  }

  const overdue = item.due_at ? new Date(item.due_at).getTime() < Date.now() : false;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-bold text-white">{item.title}</h3>
          {item.due_at && (
            <p className={`mt-0.5 text-xs ${overdue && submission?.status !== "graded" ? "text-red-400" : "text-white/50"}`}>
              Delè : {formatDate(item.due_at)}
            </p>
          )}
        </div>
        {submission && (
          <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${
            submission.status === "graded"
              ? "bg-green-500/10 text-green-400 ring-green-500/20"
              : "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20"
          }`}>
            {submission.status === "graded" ? <Award className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
            {submission.status === "graded" ? `Kòrije${submission.grade ? ` · ${submission.grade}` : ""}` : "Soumèt"}
          </span>
        )}
      </div>

      {item.description && <p className="mt-3 whitespace-pre-wrap text-sm text-white/70">{item.description}</p>}

      {item.attachment_url && (
        <a href={item.attachment_url} target="_blank" rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-lore-gold-light hover:text-white">
          <Paperclip className="h-3.5 w-3.5" />Fichye devwa a
        </a>
      )}

      {submission?.status === "graded" && submission.feedback && (
        <div className="mt-3 rounded-xl bg-white/5 p-3 text-sm text-white/70">
          <p className="text-xs font-semibold uppercase tracking-wide text-white/40">Kòmantè fòmatè</p>
          <p className="mt-1">{submission.feedback}</p>
        </div>
      )}

      <div className="mt-4 flex flex-col gap-3 border-t border-white/10 pt-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-white/40">
          {submission ? "Modifye soumisyon w lan" : "Soumèt devwa w"}
        </p>
        <textarea
          rows={3}
          value={textResponse}
          onChange={(e) => setTextResponse(e.target.value)}
          placeholder="Ekri repons ou..."
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold"
        />
        <input
          type="url"
          value={linkUrl}
          onChange={(e) => setLinkUrl(e.target.value)}
          placeholder="Lyen (Google Drive, GitHub, elt.)"
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
            {fileUrl ? "Ranplase fichye a" : "Ajoute yon fichye"}
          </button>
          {fileUrl && (
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-lore-gold-light hover:text-white">
              <FileText className="h-3.5 w-3.5" />Gade fichye a
            </a>
          )}
          <input ref={inputRef} type="file" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>

        {error && <p className="text-xs text-red-400">{error}</p>}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={saving}
          className="focus-ring self-start rounded-full bg-lore-gold px-5 py-2.5 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
        >
          {saving ? "Ap voye..." : submission ? "Re-soumèt" : "Soumèt devwa a"}
        </button>
      </div>
    </div>
  );
}

function isVideoEmbeddable(url: string) {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

function toEmbedUrl(url: string) {
  const yt = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function LessonCard({ lesson }: { lesson: LessonRow }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="focus-ring flex w-full items-center gap-3 p-4 text-left"
      >
        <PlayCircle className="h-5 w-5 shrink-0 text-lore-emerald-light" />
        <span className="flex-1 text-sm font-semibold text-white">{lesson.title}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 flex flex-col gap-3">
          {lesson.video_url && (
            isVideoEmbeddable(lesson.video_url) ? (
              <div className="relative aspect-video overflow-hidden rounded-xl bg-black">
                <iframe
                  src={toEmbedUrl(lesson.video_url)}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video src={lesson.video_url} controls className="w-full rounded-xl bg-black" />
            )
          )}
          {lesson.description && <p className="text-sm text-white/70 whitespace-pre-wrap">{lesson.description}</p>}
          {lesson.content && <p className="text-sm text-white/60 whitespace-pre-wrap">{lesson.content}</p>}
        </div>
      )}
    </div>
  );
}

export default function KouDetailView({ data }: { data: Data }) {
  const { course, enrollment, assignments, lessons } = data;

  return (
    <div className="flex flex-col gap-6">
      <Link href="/compte/kou" className="focus-ring inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-white/50 hover:text-white">
        <ArrowLeft className="h-3.5 w-3.5" />Tounen nan kou yo
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">{course.title}</h1>
        {course.description && <p className="mt-2 text-sm text-white/60">{course.description}</p>}
      </div>

      {!enrollment && (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-sm text-white/60">
          Ou pa enskri nan kou sa a. Tounen nan lis kou yo pou mande enskripsyon.
        </div>
      )}

      {enrollment?.status === "pending" && (
        <div className="flex items-center gap-2 rounded-2xl border border-yellow-500/20 bg-yellow-500/10 p-5 text-sm text-yellow-300">
          <Clock3 className="h-4 w-4 shrink-0" />
          Demand enskripsyon w lan an atant apwobasyon admin.
        </div>
      )}

      {enrollment?.status === "rejected" && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-500/20 bg-red-500/10 p-5 text-sm text-red-300">
          <XCircle className="h-4 w-4 shrink-0" />
          Demand enskripsyon w lan pa t apwouve.
        </div>
      )}

      {enrollment?.status === "approved" && (
        <>
          <div className="flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 p-4 text-sm text-green-300">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            Ou apwouve nan kou sa a.
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-white">Leçons ({lessons.length})</h2>
            {lessons.length === 0 ? (
              <p className="text-sm text-white/40">Pa gen leson pou kounye a.</p>
            ) : (
              lessons.map((l) => <LessonCard key={l.id} lesson={l} />)
            )}
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="font-display text-lg font-bold text-white">Devwa ({assignments.length})</h2>
            {assignments.length === 0 ? (
              <p className="text-sm text-white/40">Pa gen devwa pou kounye a.</p>
            ) : (
              assignments.map((a) => <AssignmentCard key={a.id} item={a} />)
            )}
          </div>
        </>
      )}
    </div>
  );
}
