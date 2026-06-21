"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CreditCard, Smartphone, DollarSign,
  Heart, CheckCircle2, Loader2, EyeOff, X,
  Zap, Shield, Globe,
} from "lucide-react";

// ─── Projets ─────────────────────────────────────────────────────────────
const PROJECTS = [
  { id: "general",   label: "❤️ Où le besoin est le plus grand",        sub: "Fonds général" },
  { id: "formation", label: "💻 Formation numérique pour enseignants",   sub: "Objectif: 150 000 HTG" },
  { id: "seminaire", label: "🎤 Séminaire de leadership jeunesse",       sub: "Objectif: 80 000 HTG" },
  { id: "bourses",   label: "🎓 Bourses scolaires pour jeunes",          sub: "Objectif: 200 000 HTG" },
  { id: "materiel",  label: "🖥️ Matériel informatique communautaire",    sub: "Objectif: 300 000 HTG" },
];

// ─── Montants prédéfinis (USD pour Stripe / Zelle, HTG pour MonCash) ────
const AMOUNTS_USD = [5, 10, 25, 50, 100, 250];
const AMOUNTS_HTG = [500, 1000, 2500, 5000, 10000];

// ─── Méthodes ─────────────────────────────────────────────────────────────
const METHODS = [
  {
    id: "stripe",
    label: "Carte Visa / Mastercard",
    sublabel: "Paiement sécurisé via Stripe",
    emoji: "💳",
    color: "from-violet-500/15 to-purple-400/10 border-violet-400/30",
    badge: "Recommandé",
    badgeColor: "bg-violet-500/15 text-violet-600 dark:text-violet-300",
    currency: "USD",
    amounts: AMOUNTS_USD,
    instantRedirect: true,
  },
  {
    id: "zelle",
    label: "Zelle / Cash App",
    sublabel: "Pour la diaspora haïtienne",
    emoji: "🇺🇸",
    color: "from-blue-500/15 to-blue-400/10 border-blue-400/30",
    badge: "Diaspora",
    badgeColor: "bg-blue-500/15 text-blue-600 dark:text-blue-300",
    currency: "USD",
    amounts: AMOUNTS_USD,
    instantRedirect: false,
    info: {
      zelle:   "lorefoundation@gmail.com",
      cashapp: "$LoréFoundation",
    },
  },
  {
    id: "moncash",
    label: "MonCash",
    sublabel: "Transfert direct depuis Haïti",
    emoji: "📱",
    color: "from-yellow-500/15 to-amber-400/10 border-yellow-400/30",
    badge: "Haïti",
    badgeColor: "bg-yellow-500/15 text-yellow-600 dark:text-yellow-300",
    currency: "HTG",
    amounts: AMOUNTS_HTG,
    instantRedirect: false,
    info: { number: "+509 34 83 3501" },
  },
  {
    id: "natcash",
    label: "NatCash",
    sublabel: "Transfert direct depuis Haïti",
    emoji: "📲",
    color: "from-blue-400/15 to-cyan-400/10 border-blue-300/30",
    badge: "Haïti",
    badgeColor: "bg-blue-400/15 text-blue-600 dark:text-blue-300",
    currency: "HTG",
    amounts: AMOUNTS_HTG,
    instantRedirect: false,
    info: { number: "+509 41 55 9094" },
  },
];

const emptyForm = {
  project:    "general",
  amount:     "" as string,
  customAmt:  "",
  donor_name: "",
  email:      "",
  anonymous:  false,
  message:    "",
};

export default function DonClient() {
  const [method, setMethod]   = useState<string>("stripe");
  const [form, setForm]       = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false); // pour méthodes manuelles

  const currentMethod = METHODS.find(m => m.id === method)!;
  const finalAmount   = form.customAmt ? parseFloat(form.customAmt) : parseFloat(form.amount);

  // ── Stripe → redirection Checkout ──────────────────────────────────────
  async function handleStripe() {
    setError(null);
    if (!finalAmount || finalAmount < 1) {
      setError("Veuillez choisir ou saisir un montant (minimum 1 USD).");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount:     finalAmount,
          project:    form.project,
          donor_name: form.anonymous ? "Anonyme" : form.donor_name,
          email:      form.anonymous ? "" : form.email,
          anonymous:  form.anonymous,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Erreur lors de la création du paiement.");
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Erreur réseau. Vérifiez votre connexion.");
      setLoading(false);
    }
  }

  // ── Méthodes manuelles (Zelle / MonCash / NatCash) ────────────────────
  async function handleManual() {
    setError(null);
    if (!finalAmount || finalAmount < 1) {
      setError("Veuillez choisir un montant.");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_name:  form.anonymous ? "Anonyme" : (form.donor_name || "Anonyme"),
          sender_phone: "",
          purpose:      "sponsor",
          amount:       finalAmount,
          currency:     currentMethod.currency,
          method:       method === "zelle" ? "autre" : method,
          reference:    "",
          note:         `Don via ${currentMethod.label} · ${PROJECTS.find(p => p.id === form.project)?.label ?? ""} · ${form.message}`,
          proof_url:    null,
        }),
      });
      setSubmitted(true);
    } catch {
      setError("Erreur réseau. Réessayez.");
    }
    setLoading(false);
  }

  // ── Succès manuel ──────────────────────────────────────────────────────
  if (submitted) {
    return <SuccessManual method={currentMethod} onReset={() => { setSubmitted(false); setForm(emptyForm); }} />;
  }

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <p className="font-display font-bold text-lore-ink dark:text-white">Faire un don</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation · En moins de 2 minutes</p>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <Shield className="h-3.5 w-3.5" /> Sécurisé
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 flex flex-col gap-8">

        {/* ── Intro ────────────────────────────────────────────────── */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-lore-blue/20 bg-lore-blue/5 px-4 py-1.5 text-xs font-semibold text-lore-blue mb-3">
            <Heart className="h-3.5 w-3.5" /> Chaque don compte
          </div>
          <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white">
            Soutenez notre mission
          </h1>
          <p className="mt-3 text-lore-ink/60 dark:text-white/60 max-w-md mx-auto">
            Votre don aide Loré Foundation à former des jeunes, renforcer des communautés
            et construire un avenir meilleur pour Haïti.
          </p>
        </div>

        {/* ── Étape 1 — Choisir le projet ──────────────────────────── */}
        <Step number={1} label="Choisir un projet à soutenir">
          <div className="flex flex-col gap-2">
            {PROJECTS.map(p => (
              <label key={p.id}
                className={`flex items-center gap-3 rounded-2xl border-2 cursor-pointer px-4 py-3 transition-all ${
                  form.project === p.id
                    ? "border-lore-blue bg-lore-blue/5 dark:bg-lore-blue/10"
                    : "border-lore-dark/8 bg-white hover:border-lore-blue/30 dark:border-white/8 dark:bg-lore-night-surface"
                }`}>
                <input type="radio" name="project" value={p.id} checked={form.project === p.id}
                  onChange={() => setForm(f => ({ ...f, project: p.id }))} className="sr-only" />
                <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                  form.project === p.id ? "border-lore-blue bg-lore-blue" : "border-lore-dark/20 dark:border-white/20"
                }`}>
                  {form.project === p.id && <span className="h-2 w-2 rounded-full bg-white" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-lore-ink dark:text-white">{p.label}</p>
                  <p className="text-xs text-lore-ink/50 dark:text-white/50">{p.sub}</p>
                </div>
              </label>
            ))}
          </div>
        </Step>

        {/* ── Étape 2 — Méthode de paiement ───────────────────────── */}
        <Step number={2} label="Choisir la méthode de paiement">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {METHODS.map(m => (
              <button key={m.id} type="button" onClick={() => { setMethod(m.id); setForm(f => ({ ...f, amount: "", customAmt: "" })); }}
                className={`relative rounded-2xl border-2 bg-gradient-to-br ${m.color} p-4 text-left transition-all ${
                  method === m.id ? "ring-2 ring-lore-blue ring-offset-2 dark:ring-offset-lore-night" : "opacity-70 hover:opacity-100"
                }`}>
                {m.badge && (
                  <span className={`absolute -top-2 right-2 rounded-full px-2 py-0.5 text-[10px] font-bold ${m.badgeColor}`}>
                    {m.badge}
                  </span>
                )}
                <p className="text-2xl mb-2">{m.emoji}</p>
                <p className="font-display font-bold text-xs text-lore-ink dark:text-white leading-tight">{m.label}</p>
                <p className="mt-0.5 text-[10px] text-lore-ink/50 dark:text-white/50">{m.sublabel}</p>
              </button>
            ))}
          </div>
        </Step>

        {/* ── Étape 3 — Montant ───────────────────────────────────── */}
        <Step number={3} label={`Montant (${currentMethod.currency})`}>
          <div className="flex flex-wrap gap-2">
            {currentMethod.amounts.map(a => (
              <button key={a} type="button"
                onClick={() => setForm(f => ({ ...f, amount: String(a), customAmt: "" }))}
                className={`rounded-full border-2 px-5 py-2.5 text-sm font-bold transition-colors ${
                  form.amount === String(a) && !form.customAmt
                    ? "border-lore-blue bg-lore-blue text-white"
                    : "border-lore-dark/10 bg-white text-lore-ink hover:border-lore-blue dark:border-white/10 dark:bg-lore-night-surface dark:text-white"
                }`}>
                {a.toLocaleString("fr-FR")} {currentMethod.currency}
              </button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-lore-ink/50 dark:text-white/50">Autre :</span>
            <div className="relative flex-1 max-w-xs">
              <input
                type="text" inputMode="numeric"
                value={form.customAmt}
                onChange={e => {
                  const v = e.target.value.replace(/[^0-9.]/g, "");
                  setForm(f => ({ ...f, customAmt: v, amount: "" }));
                }}
                placeholder={`Montant en ${currentMethod.currency}`}
                className="w-full rounded-xl border border-lore-dark/10 bg-white px-4 py-2.5 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-lore-night-surface dark:text-white pr-16"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-lore-ink/40 dark:text-white/40">
                {currentMethod.currency}
              </span>
            </div>
          </div>
          {finalAmount >= 1 && (
            <p className="mt-2 text-xs text-lore-blue font-semibold">
              ✓ Montant : {finalAmount.toLocaleString("fr-FR")} {currentMethod.currency}
            </p>
          )}
        </Step>

        {/* ── Infos méthode manuelle ───────────────────────────────── */}
        {!currentMethod.instantRedirect && currentMethod.info && (
          <div className={`rounded-3xl border bg-gradient-to-br ${currentMethod.color} p-6`}>
            <p className="font-display font-bold text-lore-ink dark:text-white mb-3">
              {currentMethod.emoji} Instructions — {currentMethod.label}
            </p>
            {"number" in currentMethod.info && (
              <div className="rounded-xl bg-white/60 dark:bg-black/20 px-4 py-3 mb-3">
                <p className="text-xs text-lore-ink/50 dark:text-white/50">Numéro</p>
                <p className="font-mono font-bold text-lore-ink dark:text-white">{currentMethod.info.number}</p>
              </div>
            )}
            {"zelle" in currentMethod.info && (
              <div className="flex flex-col gap-2">
                <div className="rounded-xl bg-white/60 dark:bg-black/20 px-4 py-3">
                  <p className="text-xs text-lore-ink/50 dark:text-white/50">Zelle</p>
                  <p className="font-mono font-bold text-lore-ink dark:text-white">{currentMethod.info.zelle}</p>
                </div>
                <div className="rounded-xl bg-white/60 dark:bg-black/20 px-4 py-3">
                  <p className="text-xs text-lore-ink/50 dark:text-white/50">Cash App</p>
                  <p className="font-mono font-bold text-lore-ink dark:text-white">{currentMethod.info.cashapp}</p>
                </div>
              </div>
            )}
            <p className="mt-3 text-xs text-lore-ink/60 dark:text-white/60">
              Après votre transfert, remplissez le formulaire ci-dessous pour nous en informer.
            </p>
          </div>
        )}

        {/* ── Étape 4 — Identité (optionnel) ──────────────────────── */}
        <Step number={4} label="Vos informations (optionnel)">
          {/* Anonyme toggle */}
          <label className="flex items-center gap-3 cursor-pointer mb-4">
            <div onClick={() => setForm(f => ({ ...f, anonymous: !f.anonymous }))}
              className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                form.anonymous ? "bg-lore-blue" : "bg-lore-dark/20 dark:bg-white/20"
              }`}>
              <span className={`mx-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                form.anonymous ? "translate-x-5" : ""
              }`} />
            </div>
            <div>
              <p className="font-semibold text-sm text-lore-ink dark:text-white flex items-center gap-1.5">
                <EyeOff className="h-4 w-4 text-lore-ink/40 dark:text-white/40" />
                Rester anonyme
              </p>
              <p className="text-xs text-lore-ink/50 dark:text-white/50">Votre don sera tout aussi précieux.</p>
            </div>
          </label>

          {!form.anonymous && (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Votre nom</label>
                <input value={form.donor_name}
                  onChange={e => setForm(f => ({ ...f, donor_name: e.target.value }))}
                  placeholder="Jean Pierre" className={INPUT} />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Email (reçu)</label>
                <input type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="jean@exemple.com" className={INPUT} />
              </div>
            </div>
          )}

          <div className="flex flex-col gap-1.5 mt-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">Message (optionnel)</label>
            <textarea value={form.message}
              onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
              rows={2} placeholder="Un message d'encouragement pour l'équipe..."
              className={INPUT} />
          </div>
        </Step>

        {error && (
          <div className="flex items-center gap-3 rounded-2xl bg-red-500/10 border border-red-500/20 px-5 py-4">
            <X className="h-5 w-5 shrink-0 text-red-500" />
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {/* ── Bouton CTA ───────────────────────────────────────────── */}
        <button type="button"
          onClick={currentMethod.instantRedirect ? handleStripe : handleManual}
          disabled={loading}
          className="flex items-center justify-center gap-3 rounded-full bg-lore-blue px-8 py-4 font-bold text-white text-base hover:bg-lore-blue/90 disabled:opacity-50 transition-all hover:scale-[1.02] shadow-lg">
          {loading
            ? <><Loader2 className="h-5 w-5 animate-spin" /> Traitement...</>
            : currentMethod.instantRedirect
              ? <><CreditCard className="h-5 w-5" /> Payer {finalAmount >= 1 ? `${finalAmount} USD` : ""} — Sécurisé par Stripe</>
              : <><Heart className="h-5 w-5" /> Confirmer mon don de {finalAmount >= 1 ? `${finalAmount.toLocaleString()} ${currentMethod.currency}` : "..."}</>
          }
        </button>

        {/* Garanties */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-lore-ink/40 dark:text-white/40">
          <span className="flex items-center gap-1"><Shield className="h-3.5 w-3.5" /> Paiement 100% sécurisé</span>
          <span className="flex items-center gap-1"><Zap className="h-3.5 w-3.5" /> Moins de 2 minutes</span>
          <span className="flex items-center gap-1"><Globe className="h-3.5 w-3.5" /> Disponible partout</span>
          <span className="flex items-center gap-1"><EyeOff className="h-3.5 w-3.5" /> Anonymat respecté</span>
        </div>

        {/* Impact rapide */}
        <div className="rounded-3xl border border-lore-blue/15 bg-lore-blue/5 dark:border-lore-blue/20 dark:bg-lore-blue/10 p-6">
          <p className="font-display font-bold text-lore-ink dark:text-white text-center mb-4">
            Ce que votre don permet
          </p>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { amount: "5 USD", impact: "Fournitures pour 1 élève" },
              { amount: "25 USD", impact: "1 journée de formation" },
              { amount: "100 USD", impact: "1 atelier communautaire" },
            ].map(item => (
              <div key={item.amount} className="flex flex-col gap-1">
                <p className="font-display font-extrabold text-lore-blue text-lg">{item.amount}</p>
                <p className="text-xs text-lore-ink/60 dark:text-white/60 leading-tight">{item.impact}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Succès méthodes manuelles ────────────────────────────────────────────
function SuccessManual({ method, onReset }: { method: typeof METHODS[0]; onReset: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-lore-cream dark:bg-lore-night px-5">
      <div className="max-w-md text-center flex flex-col items-center gap-5">
        <CheckCircle2 className="h-16 w-16 text-emerald-500" />
        <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">
          Merci pour votre don ! 🙏
        </h1>
        <p className="text-lore-ink/60 dark:text-white/60">
          Nous avons bien enregistré votre intention de don via <strong>{method.label}</strong>.
          Effectuez le transfert si ce n&apos;est pas encore fait, et notre équipe confirmera
          votre contribution dans les 24 heures.
        </p>
        <div className="flex gap-3 flex-wrap justify-center">
          <button type="button" onClick={onReset}
            className="rounded-full border border-lore-dark/10 px-5 py-2.5 text-sm font-semibold dark:border-white/10 dark:text-white hover:bg-lore-dark/5 dark:hover:bg-white/5 transition-colors">
            Faire un autre don
          </button>
          <Link href="/"
            className="rounded-full bg-lore-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-lore-blue/90 transition-colors">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Page succès Stripe ───────────────────────────────────────────────────
function Step({ number, label, children }: { number: number; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-lore-blue text-white text-xs font-bold">
          {number}
        </div>
        <h2 className="font-display font-bold text-lore-ink dark:text-white">{label}</h2>
      </div>
      <div className="ml-10">{children}</div>
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-white px-4 py-3 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-lore-night-surface dark:text-white transition-colors";
