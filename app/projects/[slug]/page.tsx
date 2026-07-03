"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, MapPin, Users, Calendar, Target, Heart,
  Play, ChevronLeft, ChevronRight, CheckCircle2,
  Loader2, EyeOff, X, Upload, Shield,
} from "lucide-react";
import type { Project } from "@/app/admin/_components/types";

const METHODS = [
  { id: "moncash",  label: "📱 MonCash",  number: "+509 34 83 3501" },
  { id: "natcash",  label: "📲 NatCash",  number: "+509 41 55 9094" },
  { id: "sogebank", label: "🏦 Sogebank", number: "Kont: 2470-0541-6317-0003" },
  { id: "stripe",   label: "💳 Carte",    number: "" },
  { id: "autre",    label: "🌐 Autre",    number: "" },
];

const AMOUNTS_HTG = [1000, 2500, 5000, 10000, 25000];
const AMOUNTS_USD = [10, 25, 50, 100, 250];

function pct(raised: number, goal: number) {
  if (!goal) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export default function ProjetPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaIdx, setMediaIdx] = useState(0);
  const [showDon, setShowDon] = useState(false);
  const [success, setSuccess] = useState(false);
  const [donForm, setDonForm] = useState({
    donor_name: "", donor_email: "", amount: "", currency: "HTG",
    method: "moncash", message: "", is_anonymous: false, reference: "",
  });
  const [sending, setSending] = useState(false);
  const [donError, setDonError] = useState<string | null>(null);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/projects/${slug}`)
      .then(r => r.json())
      .then(d => { setProject(d.item ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const media = project?.media ?? [];
  const prog  = project ? pct(project.raised_amount, project.goal_amount) : 0;
  const amounts = donForm.currency === "USD" ? AMOUNTS_USD : AMOUNTS_HTG;
  const currentMethod = METHODS.find(m => m.id === donForm.method);

  async function handleDon() {
    setDonError(null);
    if (!donForm.amount || Number(donForm.amount) < 1) {
      setDonError("Veuillez entrer un montant valide."); return;
    }
    if (!donForm.is_anonymous && !donForm.donor_name.trim()) {
      setDonError("Votre nom est requis ou cochez 'Rester anonyme'."); return;
    }
    setSending(true);

    let proof_url = null;
    if (proofFile) {
      try {
        const sign = await fetch("/api/admin/upload-url", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: proofFile.name, folder: "payments" }),
        });
        if (sign.ok) {
          const sd = await sign.json();
          await fetch(sd.signedUrl, { method: "PUT", body: proofFile, headers: { "Content-Type": proofFile.type } });
          proof_url = sd.publicUrl;
        }
      } catch { /* continue */ }
    }

    const res = await fetch(`/api/projects/${slug}/donate`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...donForm, amount: Number(donForm.amount), proof_url }),
    });
    const data = await res.json().catch(() => ({}));
    setSending(false);
    if (!res.ok) { setDonError(data.error || "Erreur. Réessayez."); return; }
    setSuccess(true);
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-lore-cream dark:bg-lore-night">
      <div className="h-10 w-10 rounded-full border-2 border-lore-blue/30 border-t-lore-blue animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lore-cream dark:bg-lore-night px-5 text-center">
      <Target className="h-16 w-16 text-lore-ink/20 dark:text-white/20" />
      <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">Projet non trouvé</h1>
      <Link href="/projects" className="rounded-full bg-lore-blue px-6 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
        Voir tous les projets
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link href="/projects" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="flex-1 font-display font-bold text-sm text-lore-ink dark:text-white truncate">{project.title}</p>
          <button type="button" onClick={() => setShowDon(true)}
            className="flex items-center gap-2 rounded-full bg-lore-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
            <Heart className="h-4 w-4" /> Financer
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 flex flex-col gap-8">

        {/* Galerie médias */}
        {media.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl aspect-video bg-lore-dark">
            {media[mediaIdx].type === "video"
              ? <video src={media[mediaIdx].url} controls className="h-full w-full object-contain" />
              : <Image src={media[mediaIdx].url} alt={project.title} fill className="object-cover" priority />
            }
            {media.length > 1 && (
              <>
                <button type="button" onClick={() => setMediaIdx(i => (i - 1 + media.length) % media.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => setMediaIdx(i => (i + 1) % media.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {media.map((m, i) => (
                    <button key={i} type="button" onClick={() => setMediaIdx(i)}
                      className={`h-2 w-2 rounded-full transition-colors ${i === mediaIdx ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
            {media[mediaIdx].type === "video" && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                <Play className="h-3 w-3" /> Vidéo
              </div>
            )}
          </div>
        )}

        {/* Miniatures */}
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {media.map((m, i) => (
              <button key={i} type="button" onClick={() => setMediaIdx(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === mediaIdx ? "border-lore-blue" : "border-transparent"}`}>
                {m.type === "video"
                  ? <div className="h-full w-full bg-lore-dark flex items-center justify-center"><Play className="h-5 w-5 text-white" /></div>
                  : <Image src={m.url} alt="" fill className="object-cover" />
                }
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Description */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white leading-tight mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-xs text-lore-ink/50 dark:text-white/50">
                {project.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.location}</span>}
                {project.beneficiaries > 0 && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{project.beneficiaries} bénéficiaires</span>}
                {project.start_date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Début : {new Date(project.start_date).toLocaleDateString("fr-FR")}</span>}
                {project.end_date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Fin : {new Date(project.end_date).toLocaleDateString("fr-FR")}</span>}
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none
              prose-headings:font-display prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6
              prose-p:text-lore-ink/75 dark:prose-p:text-white/70 prose-p:leading-relaxed
              prose-a:text-lore-blue prose-ul:text-lore-ink/75 dark:prose-ul:text-white/70
              prose-li:marker:text-lore-blue prose-strong:text-lore-ink dark:prose-strong:text-white
              prose-blockquote:border-lore-blue prose-blockquote:bg-lore-blue/5 prose-blockquote:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, "<br/>") }} />
          </div>

          {/* Sidebar financement */}
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6 flex flex-col gap-5">

              {/* Progression */}
              {project.goal_amount > 0 && (
                <div>
                  <div className="flex items-end justify-between mb-2">
                    <div>
                      <p className="font-display text-2xl font-extrabold text-lore-ink dark:text-white">
                        {project.raised_amount.toLocaleString("fr-FR")}
                        <span className="text-sm font-normal text-lore-ink/50 dark:text-white/50 ml-1">{project.currency}</span>
                      </p>
                      <p className="text-xs text-lore-ink/50 dark:text-white/50">
                        collectés sur {project.goal_amount.toLocaleString("fr-FR")} {project.currency}
                      </p>
                    </div>
                    <span className="font-display text-2xl font-extrabold text-lore-blue">{prog}%</span>
                  </div>
                  <div className="h-3 w-full rounded-full bg-lore-dark/10 dark:bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-lore-blue to-blue-400 transition-all"
                      style={{ width: `${prog}%` }} />
                  </div>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {project.beneficiaries > 0 && (
                  <div className="rounded-2xl bg-lore-cream dark:bg-white/5 p-4 text-center">
                    <p className="font-display text-xl font-bold text-lore-ink dark:text-white">{project.beneficiaries}</p>
                    <p className="text-xs text-lore-ink/50 dark:text-white/50">bénéficiaires</p>
                  </div>
                )}
                {project.media?.length > 0 && (
                  <div className="rounded-2xl bg-lore-cream dark:bg-white/5 p-4 text-center">
                    <p className="font-display text-xl font-bold text-lore-ink dark:text-white">{project.media.length}</p>
                    <p className="text-xs text-lore-ink/50 dark:text-white/50">médias</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <button type="button" onClick={() => setShowDon(true)}
                className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-6 py-4 font-bold text-white hover:bg-lore-blue/90 transition-all hover:scale-[1.02] shadow-lg">
                <Heart className="h-5 w-5" /> Financer ce projet
              </button>
              <p className="text-center text-xs text-lore-ink/40 dark:text-white/40 flex items-center justify-center gap-1">
                <Shield className="h-3.5 w-3.5" /> Contribution sécurisée · Anonymat respecté
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal don */}
      {showDon && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center px-0 sm:px-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDon(false)} />
          <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-white dark:bg-lore-night-surface shadow-2xl">
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-lore-dark/5 dark:border-white/5 px-6 py-5">
              <div>
                <p className="font-display font-bold text-lore-ink dark:text-white">Financer ce projet</p>
                <p className="text-xs text-lore-ink/50 dark:text-white/50 mt-0.5 truncate max-w-xs">{project.title}</p>
              </div>
              <button type="button" onClick={() => setShowDon(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full border border-lore-dark/10 dark:border-white/10 text-lore-ink/50 dark:text-white/50">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-5">
              {success ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                  <h3 className="font-display text-xl font-bold text-lore-ink dark:text-white">Merci pour votre soutien ! 🙏</h3>
                  <p className="text-sm text-lore-ink/60 dark:text-white/60 max-w-sm">
                    Votre contribution a été enregistrée. Notre équipe la vérifiera dans les 24 heures.
                    Ensemble, nous transformons Haïti !
                  </p>
                  <button type="button" onClick={() => { setShowDon(false); setSuccess(false); }}
                    className="rounded-full bg-lore-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
                    Fermer
                  </button>
                </div>
              ) : (
                <>
                  {/* Méthode */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Méthode de paiement</label>
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                      {METHODS.map(m => (
                        <button key={m.id} type="button"
                          onClick={() => setDonForm(f => ({ ...f, method: m.id, currency: m.id === "stripe" ? "USD" : "HTG" }))}
                          className={`rounded-xl border-2 px-3 py-2.5 text-xs font-semibold text-left transition-colors ${
                            donForm.method === m.id ? "border-lore-blue bg-lore-blue/10 text-lore-blue" : "border-lore-dark/10 text-lore-ink/60 dark:border-white/10 dark:text-white/60"
                          }`}>
                          {m.label}
                          {m.number && <p className="font-mono text-[10px] mt-0.5 opacity-70 truncate">{m.number}</p>}
                        </button>
                      ))}
                    </div>
                    {currentMethod?.number && (
                      <div className="rounded-xl bg-lore-blue/5 border border-lore-blue/15 px-4 py-3 mt-1">
                        <p className="text-xs text-lore-ink/60 dark:text-white/60">Effectuez votre transfert à :</p>
                        <p className="font-mono font-bold text-lore-ink dark:text-white text-sm mt-0.5">{currentMethod.number}</p>
                        <p className="text-[11px] text-lore-ink/40 dark:text-white/40 mt-1">Puis remplissez le formulaire ci-dessous.</p>
                      </div>
                    )}
                  </div>

                  {/* Montant */}
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Montant ({donForm.currency})</label>
                    <div className="flex flex-wrap gap-2">
                      {amounts.map(a => (
                        <button key={a} type="button"
                          onClick={() => setDonForm(f => ({ ...f, amount: String(a) }))}
                          className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-colors ${
                            donForm.amount === String(a) ? "border-lore-blue bg-lore-blue text-white" : "border-lore-dark/10 bg-white text-lore-ink dark:border-white/10 dark:bg-lore-night dark:text-white"
                          }`}>
                          {a.toLocaleString("fr-FR")} {donForm.currency}
                        </button>
                      ))}
                    </div>
                    <input type="text" inputMode="numeric"
                      value={donForm.amount}
                      onChange={e => setDonForm(f => ({ ...f, amount: e.target.value.replace(/[^0-9.]/g, "") }))}
                      placeholder={`Autre montant en ${donForm.currency}`}
                      className={INPUT} />
                  </div>

                  {/* Anonyme */}
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setDonForm(f => ({ ...f, is_anonymous: !f.is_anonymous }))}
                      className={`flex h-6 w-11 items-center rounded-full transition-colors ${donForm.is_anonymous ? "bg-lore-blue" : "bg-lore-dark/20 dark:bg-white/20"}`}>
                      <span className={`mx-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${donForm.is_anonymous ? "translate-x-5" : ""}`} />
                    </div>
                    <span className="text-sm font-semibold text-lore-ink dark:text-white flex items-center gap-1.5">
                      <EyeOff className="h-4 w-4 text-lore-ink/40 dark:text-white/40" /> Rester anonyme
                    </span>
                  </label>

                  {!donForm.is_anonymous && (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Votre nom</label>
                        <input value={donForm.donor_name} onChange={e => setDonForm(f => ({ ...f, donor_name: e.target.value }))}
                          placeholder="Jean Pierre" className={INPUT} />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Email (optionnel)</label>
                        <input type="email" value={donForm.donor_email} onChange={e => setDonForm(f => ({ ...f, donor_email: e.target.value }))}
                          placeholder="jean@exemple.com" className={INPUT} />
                      </div>
                    </div>
                  )}

                  {/* Référence */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Référence / Code transaction</label>
                    <input value={donForm.reference} onChange={e => setDonForm(f => ({ ...f, reference: e.target.value }))}
                      placeholder="Code MonCash / NatCash / Numéro reçu..." className={INPUT} />
                  </div>

                  {/* Message */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Message (optionnel)</label>
                    <textarea value={donForm.message} onChange={e => setDonForm(f => ({ ...f, message: e.target.value }))}
                      rows={2} placeholder="Un mot d'encouragement pour l'équipe..." className={INPUT} />
                  </div>

                  {/* Preuve */}
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Capture / Reçu (optionnel)</label>
                    <div onClick={() => fileRef.current?.click()}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-lore-dark/10 px-5 py-3 hover:border-lore-blue transition-colors dark:border-white/10">
                      <Upload className="h-4 w-4 text-lore-ink/40 dark:text-white/40" />
                      <p className="text-sm text-lore-ink/40 dark:text-white/40">
                        {proofFile ? proofFile.name : "Joindre capture d'écran du paiement"}
                      </p>
                    </div>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                      onChange={e => setProofFile(e.target.files?.[0] ?? null)} />
                  </div>

                  {donError && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{donError}</div>}

                  <button type="button" onClick={handleDon} disabled={sending}
                    className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-8 py-4 font-bold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-all">
                    {sending && <Loader2 className="h-4 w-4 animate-spin" />}
                    {sending ? "Envoi en cours..." : "Confirmer ma contribution →"}
                  </button>
                  <p className="text-center text-xs text-lore-ink/40 dark:text-white/40 flex items-center justify-center gap-1">
                    <Shield className="h-3.5 w-3.5" /> Sécurisé · Anonymat respecté
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-2.5 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white transition-colors";
