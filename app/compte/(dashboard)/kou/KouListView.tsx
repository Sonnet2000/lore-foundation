"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  GraduationCap, Clock3, CheckCircle2, XCircle, ArrowRight, Loader2,
  Upload, FileText, Wallet, Video, Users,
} from "lucide-react";
import type { CourseRow, EnrollmentRow } from "@/lib/school";

type Item = { course: CourseRow; enrollment: EnrollmentRow | null };

type PaymentSettings = {
  binanceEnabled: boolean;
  binancePayId: string;
  binanceWalletAddress: string;
  binanceQrUrl: string;
  instructions: string;
};

function isFreeCourse(price: string) {
  const p = price.trim().toLowerCase();
  return !p || /gratis|gratuit|free|0 htg|0\$/.test(p);
}

function StatusBadge({ status }: { status: EnrollmentRow["status"] }) {
  const map = {
    approved: { label: "Apwouve", icon: CheckCircle2, cls: "bg-green-500/10 text-green-400 ring-green-500/20" },
    pending: { label: "An atant", icon: Clock3, cls: "bg-yellow-500/10 text-yellow-400 ring-yellow-500/20" },
    rejected: { label: "Rejte", icon: XCircle, cls: "bg-red-500/10 text-red-400 ring-red-500/20" },
  } as const;
  const { label, icon: Icon, cls } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${cls}`}>
      <Icon className="h-3 w-3" />
      {label}
    </span>
  );
}

function FormatBadge({ format }: { format: CourseRow["format"] }) {
  if (format === "online") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-lore-emerald/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lore-emerald-light">
        <Video className="h-2.5 w-2.5" />100% en ligne
      </span>
    );
  }
  if (format === "hybrid") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-lore-gold/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lore-gold-light">
        Hybride
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white/50">
      <Users className="h-2.5 w-2.5" />En présentiel
    </span>
  );
}

function PaymentStep({
  courseId,
  onDone,
}: {
  courseId: string;
  onDone: (enrollment: EnrollmentRow) => void;
}) {
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [reference, setReference] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/payment-settings").then((r) => r.json()).then(setSettings);
  }, []);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const signRes = await fetch("/api/account/upload-url", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, size: file.size }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error);

      const up = await fetch(signData.signedUrl, { method: "PUT", headers: { "Content-Type": signData.contentType }, body: file });
      if (!up.ok) throw new Error("Echèk upload.");
      setProofUrl(signData.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Echèk upload.");
    } finally {
      setUploading(false);
    }
  }

  async function submit() {
    if (!reference.trim() && !proofUrl) {
      setError("Ajoute referans tranzaksyon an oswa yon kapti ekran.");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(`/api/account/courses/${courseId}/enroll`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_method: "binance", payment_reference: reference, payment_proof_url: proofUrl ?? "" }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Echèk soumèt demand lan.");
      onDone(data.enrollment);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erè sèvè.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!settings) return <Loader2 className="h-4 w-4 animate-spin text-white/40" />;

  if (!settings.binanceEnabled) {
    return <p className="text-xs text-white/50">Peman anliy pa aktive kounye a. Kontakte nou dirèkteman.</p>;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-black/20 p-3">
      <p className="flex items-center gap-1.5 text-xs font-semibold text-lore-gold-light">
        <Wallet className="h-3.5 w-3.5" />Peye ak Binance Pay ID: <span className="font-mono">{settings.binancePayId}</span>
      </p>
      <input
        value={reference}
        onChange={(e) => setReference(e.target.value)}
        placeholder="Referans tranzaksyon an"
        className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-lore-gold"
      />
      <div className="flex items-center gap-2">
        <label className="focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold text-white/70 hover:bg-white/5">
          {uploading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Upload className="h-3 w-3" />}
          {proofUrl ? "Ranplase kapti a" : "Ajoute kapti ekran"}
          <input type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
        </label>
        {proofUrl && <FileText className="h-3.5 w-3.5 text-lore-gold-light" />}
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={submitting}
        className="focus-ring self-start rounded-full bg-lore-gold px-4 py-1.5 text-xs font-bold text-lore-dark disabled:opacity-50"
      >
        {submitting ? "..." : "Envoyer la demande"}
      </button>
    </div>
  );
}

export default function KouListView({ items }: { items: Item[] }) {
  const [pendingIds, setPendingIds] = useState<Set<string>>(new Set());
  const [statuses, setStatuses] = useState<Map<string, EnrollmentRow | null>>(
    new Map(items.map((i) => [i.course.id, i.enrollment]))
  );
  const [payingCourseId, setPayingCourseId] = useState<string | null>(null);

  async function enrollFree(courseId: string) {
    setPendingIds((prev) => new Set(prev).add(courseId));
    try {
      const res = await fetch(`/api/account/courses/${courseId}/enroll`, { method: "POST", credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setStatuses((prev) => new Map(prev).set(courseId, data.enrollment));
    } finally {
      setPendingIds((prev) => { const next = new Set(prev); next.delete(courseId); return next; });
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-white/50">
        Pa gen kou disponib kounye a. Tounen pita.
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ course }) => {
        const enrollment = statuses.get(course.id) ?? null;
        const isPending = pendingIds.has(course.id);
        const free = isFreeCourse(course.price);

        return (
          <div key={course.id} className="flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="relative h-32 w-full bg-white/5">
              {course.cover_url ? (
                <Image src={course.cover_url} alt={course.title} fill className="object-cover" unoptimized />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-white/20">
                  <GraduationCap className="h-10 w-10" />
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <FormatBadge format={course.format} />
              </div>
              <div>
                <h3 className="font-display text-base font-bold text-white">{course.title}</h3>
                <p className="mt-1 text-xs text-white/50">
                  {course.duration || "Dire pa presize"}{course.price ? ` · ${course.price}` : ""}
                </p>
              </div>
              {course.description && (
                <p className="line-clamp-3 text-sm text-white/60">{course.description}</p>
              )}

              {!enrollment && payingCourseId === course.id ? (
                <PaymentStep
                  courseId={course.id}
                  onDone={(e) => { setStatuses((prev) => new Map(prev).set(course.id, e)); setPayingCourseId(null); }}
                />
              ) : (
                <div className="mt-auto flex items-center justify-between pt-2">
                  {enrollment ? (
                    <StatusBadge status={enrollment.status} />
                  ) : free ? (
                    <button
                      type="button"
                      onClick={() => enrollFree(course.id)}
                      disabled={isPending}
                      className="focus-ring rounded-full bg-lore-gold px-4 py-2 text-xs font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
                    >
                      {isPending ? "..." : "Mande enskripsyon"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPayingCourseId(course.id)}
                      className="focus-ring rounded-full bg-lore-gold px-4 py-2 text-xs font-bold text-lore-dark transition-transform hover:scale-[1.02]"
                    >
                      Payer & s&apos;inscrire
                    </button>
                  )}

                  {enrollment?.status === "approved" && (
                    <Link
                      href={`/compte/kou/${course.id}`}
                      className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-lore-gold-light hover:text-white"
                    >
                      Antre <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
