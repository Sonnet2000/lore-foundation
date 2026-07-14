"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Loader2, Mail, Lock, User, Eye, EyeOff, Wallet, Upload,
  FileText, CheckCircle2, Clock3, GraduationCap, MailCheck,
} from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import GoogleButton from "@/components/account/GoogleButton";
import type { CourseRow, EnrollmentRow } from "@/lib/school";

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

type Step = "loading" | "account" | "awaiting-confirmation" | "payment" | "status";

export default function InscriptionClient({ course }: { course: CourseRow }) {
  const next = `/ecole/${course.id}/inscription`;
  const free = isFreeCourse(course.price);

  const [step, setStep] = useState<Step>("loading");
  const [enrollment, setEnrollment] = useState<EnrollmentRow | null>(null);

  // Compte (si pa konekte)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Peman
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [reference, setReference] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await fetch(`/api/account/courses/${course.id}`, { credentials: "include" });
      if (cancelled) return;
      if (res.status === 401) {
        setStep("account");
        return;
      }
      const data = await res.json().catch(() => ({}));
      const e: EnrollmentRow | null = data.enrollment ?? null;
      setEnrollment(e);
      if (!e || e.status === "rejected") {
        setStep("payment");
      } else {
        setStep("status");
      }
    })();
    return () => { cancelled = true; };
  }, [course.id]);

  useEffect(() => {
    if (!free && (step === "payment")) {
      fetch("/api/payment-settings").then((r) => r.json()).then(setSettings).catch(() => setSettings(null));
    }
  }, [free, step]);

  async function handleAccountSubmit() {
    setError(null);
    if (!fullName.trim() || !email.trim()) { setError("Ranpli non ak imel ou."); return; }
    if (password.length < 8) { setError("Mo pas la dwe gen omwen 8 karaktè."); return; }

    setSubmitting(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      if (authError) {
        setError(
          authError.message.includes("already registered") || authError.message.includes("User already")
            ? "Yon kont deja egziste ak imel sa a. Konekte pou kontinye."
            : "Enskripsyon kont lan echwe. Eseye ankò."
        );
        return;
      }

      if (data.session) {
        setStep("payment");
      } else {
        setStep("awaiting-confirmation");
      }
    } catch {
      setError("Erè rezo. Eseye ankò.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUploadProof(file: File | undefined) {
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
      if (!signRes.ok) throw new Error(signData.error || "Echèk upload.");

      const up = await fetch(signData.signedUrl, { method: "PUT", headers: { "Content-Type": signData.contentType }, body: file });
      if (!up.ok) throw new Error("Echèk upload.");
      setProofUrl(signData.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Echèk upload.");
    } finally {
      setUploading(false);
    }
  }

  async function handleEnrollSubmit() {
    setError(null);
    if (!free && !reference.trim() && !proofUrl) {
      setError("Ajoute referans tranzaksyon an oswa yon kapti ekran.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/account/courses/${course.id}/enroll`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          free ? {} : { payment_method: "binance", payment_reference: reference, payment_proof_url: proofUrl ?? "" }
        ),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Echèk soumèt demand lan.");
      setEnrollment(data.enrollment);
      setStep("status");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erè sèvè.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/ecole" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Enskripsyon</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">{course.title}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-10">
        {/* Rezime kou a */}
        <div className="mb-6 flex items-center gap-4 rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-lore-dark/5 dark:bg-white/5">
            {course.cover_url ? (
              <Image src={course.cover_url} alt={course.title} fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lore-ink/20 dark:text-white/20">
                <GraduationCap className="h-6 w-6" />
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-base font-bold text-lore-ink dark:text-white">{course.title}</h1>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">
              {course.duration || "Dire pa presize"}{course.price ? ` · ${course.price}` : " · Gratis"}
            </p>
          </div>
        </div>

        {step === "loading" && (
          <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        )}

        {step === "account" && (
          <div className="rounded-2xl border border-lore-dark/5 bg-white p-6 dark:border-white/5 dark:bg-lore-night-surface">
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Kreye kont ou</h2>
            <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">
              Ou pa gen kont sou platfòm nan ankò? Ranpli enfo yo pou n ka kreye l epi kontinye enskripsyon w nan menm etap la.
            </p>

            <div className="mt-5">
              <GoogleButton label="S'inscrire avec Google" next={next} />
            </div>
            <div className="my-5 flex items-center gap-3">
              <div className="h-px flex-1 bg-lore-dark/10 dark:bg-white/10" />
              <span className="text-xs font-medium uppercase tracking-wide text-lore-ink/35 dark:text-white/35">ou</span>
              <div className="h-px flex-1 bg-lore-dark/10 dark:bg-white/10" />
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-lore-ink/70 dark:text-white/70">Non konplè</label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lore-ink/30 dark:text-white/30" />
                  <input
                    type="text" value={fullName} onChange={(e) => setFullName(e.target.value)}
                    placeholder="Jean Baptiste"
                    className="w-full rounded-xl border border-lore-dark/10 bg-lore-cream/40 py-2.5 pl-10 pr-4 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-lore-ink/70 dark:text-white/70">Imel</label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lore-ink/30 dark:text-white/30" />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="ou@egzanp.com"
                    className="w-full rounded-xl border border-lore-dark/10 bg-lore-cream/40 py-2.5 pl-10 pr-4 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-lore-ink/70 dark:text-white/70">Mo pas</label>
                <div className="relative">
                  <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lore-ink/30 dark:text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)}
                    placeholder="8 karaktè minimòm"
                    className="w-full rounded-xl border border-lore-dark/10 bg-lore-cream/40 py-2.5 pl-10 pr-10 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white"
                  />
                  <button type="button" onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-lore-ink/30 hover:text-lore-ink/60 dark:text-white/30 dark:hover:text-white/60">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button type="button" onClick={handleAccountSubmit} disabled={submitting}
                className="focus-ring mt-1 inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50">
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Kreye kont ak kontinye
              </button>

              <p className="text-center text-xs text-lore-ink/40 dark:text-white/40">
                Ou gen tan gen yon kont?{" "}
                <Link href={`/compte/connexion?next=${encodeURIComponent(next)}`} className="font-semibold text-lore-blue hover:underline">
                  Konekte
                </Link>
              </p>
            </div>
          </div>
        )}

        {step === "awaiting-confirmation" && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-lore-dark/5 bg-white p-8 text-center dark:border-white/5 dark:bg-lore-night-surface">
            <MailCheck className="h-10 w-10 text-lore-emerald" />
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Konfime imel ou</h2>
            <p className="max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
              Nou voye yon lyen konfimasyon bay <span className="font-semibold">{email}</span>. Klike sou li,
              epi tounen sou paj sa a pou konplete demand enskripsyon w lan.
            </p>
          </div>
        )}

        {step === "payment" && (
          <div className="rounded-2xl border border-lore-dark/5 bg-white p-6 dark:border-white/5 dark:bg-lore-night-surface">
            {enrollment?.status === "rejected" && (
              <p className="mb-4 rounded-xl bg-red-500/10 p-3 text-sm text-red-500">
                Demand anvan w lan pa t apwouve. Ou ka soumèt yon nouvo demand.
              </p>
            )}
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
              {free ? "Konfime enskripsyon ou" : "Peye pou konfime enskripsyon ou"}
            </h2>

            {free ? (
              <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">
                Kou sa a gratis. Klike anba a pou soumèt demand enskripsyon w — yon admin ap apwouve l anvan w ka aksede kontni an.
              </p>
            ) : (
              <>
                <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">
                  Peye pri kou a ({course.price}), epi ajoute referans tranzaksyon an oswa yon kapti ekran anba a.
                </p>
                {!settings ? (
                  <div className="mt-4"><Loader2 className="h-4 w-4 animate-spin text-lore-ink/40 dark:text-white/40" /></div>
                ) : !settings.binanceEnabled ? (
                  <p className="mt-4 text-xs text-lore-ink/50 dark:text-white/50">Peman anliy pa aktive kounye a. Kontakte nou dirèkteman.</p>
                ) : (
                  <div className="mt-4 flex flex-col gap-3 rounded-xl bg-lore-cream/60 p-4 dark:bg-white/5">
                    <p className="flex flex-wrap items-center gap-1.5 text-xs font-semibold text-lore-gold-dark dark:text-lore-gold-light">
                      <Wallet className="h-3.5 w-3.5" />Peye ak Binance Pay ID: <span className="font-mono">{settings.binancePayId}</span>
                    </p>
                    <input
                      value={reference} onChange={(e) => setReference(e.target.value)}
                      placeholder="Referans tranzaksyon an"
                      className="rounded-lg border border-lore-dark/10 bg-white px-3 py-2 text-sm text-lore-ink outline-none focus:border-lore-gold dark:border-white/10 dark:bg-white/5 dark:text-white"
                    />
                    <div className="flex items-center gap-2">
                      <label className="focus-ring inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-lore-dark/15 px-3 py-1.5 text-xs font-semibold text-lore-ink/70 hover:bg-lore-dark/5 dark:border-white/15 dark:text-white/70 dark:hover:bg-white/5">
                        {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                        {proofUrl ? "Ranplase kapti a" : "Ajoute kapti ekran"}
                        <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleUploadProof(e.target.files?.[0])} />
                      </label>
                      {proofUrl && <FileText className="h-3.5 w-3.5 text-lore-gold-dark dark:text-lore-gold-light" />}
                    </div>
                  </div>
                )}
              </>
            )}

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            <button type="button" onClick={handleEnrollSubmit} disabled={submitting}
              className="focus-ring mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50">
              {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {free ? "Mande enskripsyon" : "Voye demand enskripsyon an"}
            </button>
          </div>
        )}

        {step === "status" && enrollment && (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-lore-dark/5 bg-white p-8 text-center dark:border-white/5 dark:bg-lore-night-surface">
            {enrollment.status === "approved" ? (
              <>
                <CheckCircle2 className="h-10 w-10 text-lore-emerald" />
                <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Ou apwouve nan kou sa a</h2>
                <p className="max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
                  Ou ka kounye a aksede leçons ak devwa yo depi tablo bò w la.
                </p>
                <Link href={`/compte/kou/${course.id}`}
                  className="focus-ring mt-2 inline-flex items-center gap-1.5 rounded-full bg-lore-gold px-5 py-2.5 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02]">
                  Antre nan kou a
                </Link>
              </>
            ) : (
              <>
                <Clock3 className="h-10 w-10 text-amber-500" />
                <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Demand ou an atant</h2>
                <p className="max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
                  Yon admin Loré Foundation ap verifye demand ou an talè. Ou ap resevwa aksè depi li apwouve.
                </p>
                <Link href="/compte/kou" className="focus-ring mt-2 text-sm font-semibold text-lore-blue hover:underline">
                  Gade estati kou m yo
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
