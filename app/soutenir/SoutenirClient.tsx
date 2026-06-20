"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, Heart, Smartphone, Building2, BookOpen,
  Users, Globe, Megaphone, CheckCircle2, Loader2,
  Upload, X, EyeOff, ChevronRight, Handshake,
} from "lucide-react";

// ─── Façons de soutenir ───────────────────────────────────────────────────
const SUPPORT_WAYS = [
  {
    id: "moncash",
    icon: Smartphone,
    emoji: "📱",
    label: "MonCash",
    type: "financier",
    color: "from-yellow-400/15 to-amber-300/10 border-yellow-400/30",
    iconBg: "bg-yellow-400/15 text-yellow-600 dark:text-yellow-300",
    highlight: true,
    description: "Envoyez directement via MonCash depuis votre téléphone.",
    detail: "Transfert rapide et sécurisé. Disponible 24h/24.",
    number: "+509 34 83 3501",
    action: "Payer via MonCash",
    actionHref: "/paiement",
  },
  {
    id: "natcash",
    icon: Smartphone,
    emoji: "📲",
    label: "NatCash",
    type: "financier",
    color: "from-blue-400/15 to-blue-300/10 border-blue-400/30",
    iconBg: "bg-blue-400/15 text-blue-600 dark:text-blue-300",
    highlight: true,
    description: "Transfert instantané via l'application NatCash.",
    detail: "Simple, rapide, sans frais supplémentaires.",
    number: "+509 41 55 9094",
    action: "Payer via NatCash",
    actionHref: "/paiement",
  },
  {
    id: "sogebank",
    icon: Building2,
    emoji: "🏦",
    label: "Sogebank",
    type: "financier",
    color: "from-emerald-400/15 to-emerald-300/10 border-emerald-400/30",
    iconBg: "bg-emerald-400/15 text-emerald-600 dark:text-emerald-300",
    highlight: true,
    description: "Virement bancaire via Sogebank ou Sogexpress.",
    detail: "Idéal pour les montants plus importants.",
    number: "Kont: XXXX-XXXX-XXXX",
    action: "Payer via Sogebank",
    actionHref: "/paiement",
  },
  {
    id: "materiel",
    icon: BookOpen,
    emoji: "🖥️",
    label: "Don de matériel",
    type: "nature",
    color: "from-purple-400/15 to-purple-300/10 border-purple-400/30",
    iconBg: "bg-purple-400/15 text-purple-600 dark:text-purple-300",
    highlight: false,
    description: "Ordinateurs, tablettes, fournitures scolaires, équipements de formation.",
    detail: "Tout matériel en bon état est le bienvenu pour nos programmes.",
    number: null,
    action: "Nous contacter",
    actionHref: "#contact-form",
  },
  {
    id: "competences",
    icon: Users,
    emoji: "🎓",
    label: "Don de compétences",
    type: "benevole",
    color: "from-orange-400/15 to-orange-300/10 border-orange-400/30",
    iconBg: "bg-orange-400/15 text-orange-600 dark:text-orange-300",
    highlight: false,
    description: "Partagez votre expertise en donnant des formations ou des ateliers.",
    detail: "Quelques heures de votre temps peuvent changer une vie.",
    number: null,
    action: "Devenir formateur",
    actionHref: "/partenaire",
  },
  {
    id: "visibilite",
    icon: Megaphone,
    emoji: "📣",
    label: "Partager & diffuser",
    type: "benevole",
    color: "from-pink-400/15 to-pink-300/10 border-pink-400/30",
    iconBg: "bg-pink-400/15 text-pink-600 dark:text-pink-300",
    highlight: false,
    description: "Parlez de Loré Foundation autour de vous, sur vos réseaux sociaux.",
    detail: "La visibilité est un soutien précieux — chaque partage compte.",
    number: null,
    action: "Suivre sur réseaux",
    actionHref: "https://www.instagram.com/lore_foundation",
  },
  {
    id: "partenariat",
    icon: Handshake,
    emoji: "🤝",
    label: "Partenariat institutionnel",
    type: "partenaire",
    color: "from-lore-blue/15 to-blue-400/10 border-lore-blue/30",
    iconBg: "bg-lore-blue/15 text-lore-blue dark:text-blue-300",
    highlight: false,
    description: "Votre organisation souhaite collaborer sur des projets communs.",
    detail: "Ensemble, nous pouvons créer un impact bien plus grand.",
    number: null,
    action: "Proposer un partenariat",
    actionHref: "/partenaire",
  },
  {
    id: "programme",
    icon: Globe,
    emoji: "🌍",
    label: "Financer un programme",
    type: "financier",
    color: "from-teal-400/15 to-teal-300/10 border-teal-400/30",
    iconBg: "bg-teal-400/15 text-teal-600 dark:text-teal-300",
    highlight: false,
    description: "Sponsorisez directement un programme — formation, séminaire ou campagne communautaire.",
    detail: "Visibilité garantie sur toute la durée du programme financé.",
    number: null,
    action: "Choisir un programme",
    actionHref: "#contact-form",
  },
];

const TYPE_FILTERS = [
  { id: "all",       label: "Tout voir" },
  { id: "financier", label: "💳 Financier" },
  { id: "nature",    label: "📦 En nature" },
  { id: "benevole",  label: "💙 Bénévolat" },
  { id: "partenaire",label: "🤝 Partenariat" },
];

const PROJECTS = [
  { id: "formation", label: "Formation numérique pour enseignants", goal: "150 000 HTG", icon: "💻" },
  { id: "seminaire", label: "Séminaire de leadership jeunesse",    goal: "80 000 HTG",  icon: "🎤" },
  { id: "bourses",   label: "Bourses scolaires pour jeunes",       goal: "200 000 HTG", icon: "🎓" },
  { id: "materiel",  label: "Matériel informatique communautaire", goal: "300 000 HTG", icon: "🖥️" },
  { id: "autre",     label: "Où le besoin est le plus grand",      goal: null,          icon: "❤️" },
];

const emptyForm = {
  sender_name: "",
  sender_phone: "",
  email: "",
  amount: "",
  currency: "HTG" as "HTG" | "USD",
  project: "",
  message: "",
  anonymous: false,
};

export default function SoutenirClient() {
  const [filter, setFilter] = useState("all");
  const [selectedWay, setSelectedWay] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const filtered = SUPPORT_WAYS.filter(w => filter === "all" || w.type === filter);
  const way = SUPPORT_WAYS.find(w => w.id === selectedWay);
  const isFinancial = way?.type === "financier";

  async function handleSubmit() {
    setError(null);
    if (isFinancial && !form.anonymous && !form.sender_name.trim()) {
      setError("Veuillez entrer votre nom ou cocher 'Rester anonyme'.");
      return;
    }
    if (!form.project) {
      setError("Veuillez choisir un projet à soutenir.");
      return;
    }

    setSaving(true);

    // Upload preuve si genyen
    let proof_url: string | null = null;
    if (proofFile) {
      try {
        const signRes = await fetch("/api/admin/upload-url", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ filename: proofFile.name, folder: "payments" }),
        });
        if (signRes.ok) {
          const { uploadUrl, publicUrl } = await signRes.json();
          await fetch(uploadUrl, { method: "PUT", body: proofFile, headers: { "Content-Type": proofFile.type } });
          proof_url = publicUrl;
        }
      } catch { /* continue sans upload */ }
    }

    const project = PROJECTS.find(p => p.id === form.project);

    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sender_name: form.anonymous ? "Anonyme" : (form.sender_name || "Anonyme"),
        sender_phone: form.anonymous ? "" : form.sender_phone,
        purpose: "autre",
        amount: Number(form.amount) || 0,
        currency: form.currency,
        method: selectedWay && ["moncash","natcash","sogebank"].includes(selectedWay)
          ? selectedWay : "autre",
        reference: "",
        note: [
          project ? `Projet: ${project.label}` : "",
          form.message,
          form.anonymous ? "[ANONYME]" : "",
        ].filter(Boolean).join(" | "),
        proof_url,
      }),
    });

    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Erreur. Réessayez."); return; }
    setSuccess(true);
  }

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Soutenir nos projets</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-12 flex flex-col gap-14">

        {/* ── Intro ──────────────────────────────────────────────────── */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-lore-blue/20 bg-lore-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-lore-blue dark:border-lore-blue/30 dark:bg-lore-blue/10">
            <Heart className="h-3.5 w-3.5" /> Soutenir
          </div>
          <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white md:text-4xl lg:text-5xl">
            Chaque geste compte
          </h1>
          <p className="max-w-2xl text-lore-ink/60 dark:text-white/60 text-base md:text-lg leading-relaxed">
            Que ce soit 500 HTG ou votre temps, votre contribution aide Loré Foundation à former
            des jeunes, renforcer des communautés et construire un avenir meilleur pour Haïti.
            <strong className="block mt-2 text-lore-ink dark:text-white">
              Les contributions anonymes sont acceptées et respectées.
            </strong>
          </p>
        </div>

        {/* ── Tableau des façons de soutenir ─────────────────────────── */}
        <div id="ways">
          <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
            <h2 className="font-display text-2xl font-bold text-lore-ink dark:text-white">
              Comment soutenir ?
            </h2>
            {/* Filtres */}
            <div className="flex gap-2 flex-wrap">
              {TYPE_FILTERS.map(f => (
                <button key={f.id} type="button"
                  onClick={() => setFilter(f.id)}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                    filter === f.id
                      ? "bg-lore-blue text-white"
                      : "border border-lore-dark/10 text-lore-ink/60 hover:border-lore-blue/30 dark:border-white/10 dark:text-white/60"
                  }`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((w) => (
              <button key={w.id} type="button"
                onClick={() => {
                  if (w.type !== "financier" && !["materiel","programme"].includes(w.id)) {
                    window.location.href = w.actionHref;
                  } else {
                    setSelectedWay(w.id);
                    setTimeout(() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" }), 100);
                  }
                }}
                className={`text-left rounded-3xl border-2 bg-gradient-to-br ${w.color} p-6 flex flex-col gap-3 transition-all hover:scale-[1.02] hover:shadow-lg ${
                  selectedWay === w.id ? "ring-2 ring-lore-blue ring-offset-2 dark:ring-offset-lore-night" : ""
                }`}>
                <div className="flex items-center justify-between">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl ${w.iconBg}`}>
                    {w.emoji}
                  </div>
                  {w.highlight && (
                    <span className="rounded-full bg-lore-blue/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-lore-blue dark:bg-lore-blue/25">
                      Rapide
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-display font-bold text-lore-ink dark:text-white">{w.label}</p>
                  <p className="mt-1 text-sm text-lore-ink/60 dark:text-white/60 leading-relaxed">{w.description}</p>
                  {w.number && (
                    <p className="mt-2 font-mono text-xs font-semibold text-lore-blue">{w.number}</p>
                  )}
                  <p className="mt-1 text-xs text-lore-ink/40 dark:text-white/40">{w.detail}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 text-xs font-semibold text-lore-blue">
                  {w.action} <ChevronRight className="h-3.5 w-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* ── Formulaire contribution ─────────────────────────────────── */}
        <div id="contact-form" className="rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface overflow-hidden">
          <div className="border-b border-lore-dark/5 dark:border-white/5 px-8 py-6">
            <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">
              {selectedWay && isFinancial
                ? `Confirmer ma contribution — ${way?.label}`
                : "Signaler ma contribution"}
            </h2>
            <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">
              {isFinancial
                ? "Choisissez votre projet, effectuez le transfert, puis soumettez ce formulaire."
                : "Dites-nous comment vous souhaitez soutenir nos projets."}
            </p>
          </div>

          <div className="px-8 py-8">
            {success ? (
              <div className="flex flex-col items-center gap-5 py-10 text-center">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <h3 className="font-display text-xl font-bold text-lore-ink dark:text-white">
                  Merci pour votre soutien !
                </h3>
                <p className="max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
                  Votre contribution a été enregistrée. Notre équipe la traitera dans les
                  24 heures. Ensemble, nous faisons la différence pour Haïti.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setSuccess(false); setForm(emptyForm); setSelectedWay(null); setProofFile(null); }}
                    className="rounded-full border border-lore-dark/10 px-5 py-2.5 text-sm font-semibold text-lore-ink dark:border-white/10 dark:text-white hover:bg-lore-dark/5 dark:hover:bg-white/5 transition-colors">
                    Faire un autre don
                  </button>
                  <Link href="/"
                    className="rounded-full bg-lore-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-lore-blue/90 transition-colors">
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">

                {/* Option méthode si pas encore choisie */}
                {!selectedWay && (
                  <div className="rounded-xl bg-lore-blue/5 border border-lore-blue/15 px-5 py-4 text-sm text-lore-blue dark:bg-lore-blue/10 dark:border-lore-blue/20">
                    💡 Choisissez une façon de soutenir dans le tableau ci-dessus, ou remplissez directement le formulaire ci-dessous.
                  </div>
                )}

                {/* Anonymat */}
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border-2 transition-colors ${
                      form.anonymous
                        ? "bg-lore-blue border-lore-blue"
                        : "border-lore-dark/20 dark:border-white/20"
                    }`}>
                    {form.anonymous && <X className="h-3.5 w-3.5 text-white" style={{ strokeWidth: 3 }} />}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-lore-ink dark:text-white flex items-center gap-2">
                      <EyeOff className="h-4 w-4 text-lore-ink/40 dark:text-white/40" />
                      Rester anonyme
                    </p>
                    <p className="text-xs text-lore-ink/50 dark:text-white/50">
                      Votre nom ne sera pas visible. Votre contribution sera tout aussi précieuse.
                    </p>
                  </div>
                </label>

                {/* Nom & contact — masqué si anonyme */}
                {!form.anonymous && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Votre nom">
                      <input value={form.sender_name}
                        onChange={e => setForm(f => ({ ...f, sender_name: e.target.value }))}
                        placeholder="Jean Pierre" className={INPUT} />
                    </Field>
                    <Field label="Téléphone (optionnel)">
                      <input value={form.sender_phone}
                        onChange={e => setForm(f => ({ ...f, sender_phone: e.target.value }))}
                        placeholder="+509 3X XX XXXX" className={INPUT} />
                    </Field>
                  </div>
                )}

                {/* Projet */}
                <Field label="Projet à soutenir *">
                  <select value={form.project}
                    onChange={e => setForm(f => ({ ...f, project: e.target.value }))}
                    className={INPUT}>
                    <option value="">Choisir un projet</option>
                    {PROJECTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.icon} {p.label}{p.goal ? ` — Objectif: ${p.goal}` : ""}
                      </option>
                    ))}
                  </select>
                </Field>

                {/* Montant si financier */}
                {(isFinancial || !selectedWay) && (
                  <Field label="Montant (optionnel)">
                    <div className="flex gap-2">
                      <input type="number" value={form.amount}
                        onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                        placeholder="5000" className={`${INPUT} flex-1`} />
                      <select value={form.currency}
                        onChange={e => setForm(f => ({ ...f, currency: e.target.value as "HTG" | "USD" }))}
                        className={`${INPUT} w-24`}>
                        <option value="HTG">HTG</option>
                        <option value="USD">USD</option>
                      </select>
                    </div>
                  </Field>
                )}

                {/* Message */}
                <Field label="Message (optionnel)">
                  <textarea value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={3}
                    placeholder="Partagez votre motivation, des détails sur votre contribution..."
                    className={INPUT} />
                </Field>

                {/* Upload preuve si financier */}
                {isFinancial && (
                  <Field label="Capture d'écran / Reçu (optionnel)">
                    <div onClick={() => fileRef.current?.click()}
                      className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-lore-dark/10 px-5 py-4 transition-colors hover:border-lore-blue dark:border-white/10">
                      <Upload className="h-5 w-5 text-lore-ink/40 dark:text-white/40 shrink-0" />
                      <div className="flex-1 min-w-0">
                        {proofFile
                          ? <p className="truncate text-sm font-medium text-lore-ink dark:text-white">{proofFile.name}</p>
                          : <p className="text-sm text-lore-ink/40 dark:text-white/40">Joindre le reçu de votre transfert</p>}
                      </div>
                      {proofFile && (
                        <button type="button" onClick={e => { e.stopPropagation(); setProofFile(null); }}
                          className="text-lore-ink/30 hover:text-red-500 transition-colors">
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                      onChange={e => setProofFile(e.target.files?.[0] ?? null)} />
                  </Field>
                )}

                {error && (
                  <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
                )}

                <button type="button" onClick={handleSubmit} disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-8 py-4 font-bold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors text-sm">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Envoi en cours..." : "Confirmer ma contribution →"}
                </button>

                <p className="text-center text-xs text-lore-ink/40 dark:text-white/40">
                  🔒 Vos données sont traitées avec confidentialité. Les contributions anonymes sont pleinement respectées.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── Impact box ─────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-lore-blue/15 bg-gradient-to-br from-lore-blue/5 to-blue-400/5 p-8 dark:border-lore-blue/20 dark:from-lore-blue/10 dark:to-blue-400/10 text-center">
          <p className="font-display text-xl font-bold text-lore-ink dark:text-white mb-2">
            Chaque contribution génère un impact réel
          </p>
          <div className="grid grid-cols-1 gap-4 mt-6 sm:grid-cols-3">
            {[
              { amount: "2 500 HTG", impact: "Offre 1 journée de formation à un jeune" },
              { amount: "10 000 HTG", impact: "Finance 1 atelier communautaire complet" },
              { amount: "50 000 HTG", impact: "Permet d'équiper 1 salle de formation" },
            ].map(item => (
              <div key={item.amount} className="rounded-2xl bg-white/60 dark:bg-white/5 p-5">
                <p className="font-display text-2xl font-extrabold text-lore-blue">{item.amount}</p>
                <p className="mt-1 text-sm text-lore-ink/60 dark:text-white/60">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-3 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-lore-blue transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">{label}</label>
      {children}
    </div>
  );
}
