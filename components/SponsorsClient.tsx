"use client";

import { useState } from "react";
import Image from "next/image";
import { HandHeart, Globe, ChevronDown, ChevronUp, CheckCircle2, Loader2 } from "lucide-react";

type PublicSponsor = {
  id: string;
  name: string;
  organization: string;
  tier: "bronze" | "silver" | "gold";
  logo_url: string | null;
  website_url: string | null;
};

const TIERS = [
  {
    id: "gold" as const,
    label: "Gold",
    emoji: "🥇",
    price: "25 000 HTG / mois",
    color: "from-yellow-400/20 to-amber-300/10 border-yellow-400/30",
    badge: "bg-yellow-400/20 text-yellow-600 dark:text-yellow-300",
    perks: [
      "Logo sur le site + réseaux sociaux de la fondation",
      "Mention d'honneur dans tous nos séminaires et événements",
      "Lien vers votre site ou organisation",
      "Certificat de partenariat officiel Loré Foundation",
      "Co-branding sur nos publications mensuelles",
    ],
  },
  {
    id: "silver" as const,
    label: "Silver",
    emoji: "🥈",
    price: "12 500 HTG / mois",
    color: "from-slate-400/20 to-slate-300/10 border-slate-400/30",
    badge: "bg-slate-400/20 text-slate-600 dark:text-slate-300",
    perks: [
      "Logo sur le site de la fondation",
      "Mention dans nos séminaires et formations",
      "Lien vers votre site ou organisation",
      "Certificat de partenariat officiel",
    ],
  },
  {
    id: "bronze" as const,
    label: "Bronze",
    emoji: "🥉",
    price: "5 000 HTG / mois",
    color: "from-orange-400/20 to-orange-300/10 border-orange-400/30",
    badge: "bg-orange-400/20 text-orange-600 dark:text-orange-300",
    perks: [
      "Nom visible sur le site de la fondation",
      "Mention dans nos publications digitales",
      "Certificat de partenariat officiel",
    ],
  },
];

const emptyForm = {
  name: "", organization: "", email: "", phone: "",
  tier: "bronze" as "bronze" | "silver" | "gold", message: "", website_url: "",
};

export default function SponsorsClient({ sponsors }: { sponsors: PublicSponsor[] }) {
  const [formOpen, setFormOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const gold   = sponsors.filter(s => s.tier === "gold");
  const silver = sponsors.filter(s => s.tier === "silver");
  const bronze = sponsors.filter(s => s.tier === "bronze");

  async function handleSubmit() {
    setError(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nom et email sont requis.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/sponsor-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Erreur. Réessayez."); return; }
    setSuccess(true);
    setForm(emptyForm);
  }

  return (
    <section id="sponsors" className="py-20 bg-lore-cream dark:bg-lore-night">
      <div className="mx-auto max-w-6xl px-5">

        {/* En-tête */}
        <div className="mb-12 text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-lore-blue/20 bg-lore-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-lore-blue dark:border-lore-blue/30 dark:bg-lore-blue/10">
            <HandHeart className="h-3.5 w-3.5" /> Partenaires & Sponsors
          </span>
          <h2 className="font-display text-3xl font-bold text-lore-ink dark:text-white md:text-4xl">
            Ensemble, nous amplifions l&apos;impact
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lore-ink/60 dark:text-white/60">
            Nos partenaires, sponsors et organisations collaboratrices jouent un rôle essentiel dans notre mission.
            Grâce à leur soutien, nous pouvons toucher plus de communautés, former plus de jeunes et créer un
            changement durable à travers Haïti. Rejoignez ce réseau de solidarité.
          </p>
        </div>

        {/* Tiers */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 mb-14">
          {TIERS.map((tier) => (
            <div key={tier.id}
              className={`relative rounded-3xl border bg-gradient-to-br ${tier.color} p-6 flex flex-col gap-4`}>
              <div className="flex items-center justify-between">
                <span className="text-2xl">{tier.emoji}</span>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${tier.badge}`}>
                  {tier.label}
                </span>
              </div>
              <div>
                <p className="font-display text-xl font-bold text-lore-ink dark:text-white">{tier.label} Sponsor</p>
                <p className="mt-1 text-sm font-semibold text-lore-blue">{tier.price}</p>
              </div>
              <ul className="flex flex-col gap-2">
                {tier.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-lore-ink/70 dark:text-white/70">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-lore-blue" />
                    {p}
                  </li>
                ))}
              </ul>
              <button type="button"
                onClick={() => { setForm(f => ({ ...f, tier: tier.id })); setFormOpen(true); }}
                className="mt-auto rounded-full bg-lore-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-lore-blue/90 transition-colors">
                Aplike — {tier.label}
              </button>
            </div>
          ))}
        </div>

        {/* Sponsors aktyèl */}
        {sponsors.length > 0 && (
          <div className="mb-14">
            <h3 className="mb-6 text-center font-display text-xl font-bold text-lore-ink dark:text-white">
              Sponsors Aktyèl Nou Yo
            </h3>
            {gold.length > 0 && <SponsorRow label="🥇 Gold" items={gold} />}
            {silver.length > 0 && <SponsorRow label="🥈 Silver" items={silver} />}
            {bronze.length > 0 && <SponsorRow label="🥉 Bronze" items={bronze} />}
          </div>
        )}

        {/* Fòm aplikasyon */}
        <div className="rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface overflow-hidden">
          <button type="button"
            onClick={() => setFormOpen(!formOpen)}
            className="flex w-full items-center justify-between px-8 py-6 text-left">
            <div>
              <p className="font-display text-lg font-bold text-lore-ink dark:text-white">
                Devenir Partenaire ou Sponsor
              </p>
              <p className="text-sm text-lore-ink/50 dark:text-white/50 mt-0.5">
                Remplissez ce formulaire et nous prendrons contact avec vous sous 48h
              </p>
            </div>
            {formOpen
              ? <ChevronUp className="h-5 w-5 text-lore-ink/40 dark:text-white/40" />
              : <ChevronDown className="h-5 w-5 text-lore-ink/40 dark:text-white/40" />}
          </button>

          {formOpen && (
            <div className="border-t border-lore-dark/5 dark:border-white/5 px-8 py-6">
              {success ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                  <p className="font-display text-lg font-bold text-lore-ink dark:text-white">
                    Demande reçue !
                  </p>
                  <p className="text-sm text-lore-ink/60 dark:text-white/60">
                    Merci pour votre intérêt à soutenir Loré Foundation. Notre équipe vous contactera dans les 48 heures pour discuter de votre partenariat.
                  </p>
                  <button type="button" onClick={() => setSuccess(false)}
                    className="rounded-full border border-lore-dark/10 px-5 py-2 text-sm dark:border-white/10">
                    Soumèt yon lòt
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Non konplè *">
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="Jean Pierre" className={INPUT} />
                    </Field>
                    <Field label="Òganizasyon / Biznis">
                      <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                        placeholder="Mon entreprise" className={INPUT} />
                    </Field>
                    <Field label="Email *">
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="jean@exemple.com" className={INPUT} />
                    </Field>
                    <Field label="Telefòn">
                      <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        placeholder="+509 3X XX XXXX" className={INPUT} />
                    </Field>
                    <Field label="Nivo Sponsor">
                      <select value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value as typeof form.tier }))}
                        className={INPUT}>
                        <option value="bronze">🥉 Bronze — 5 000 HTG/mois</option>
                        <option value="silver">🥈 Silver — 12 500 HTG/mois</option>
                        <option value="gold">🥇 Gold — 25 000 HTG/mois</option>
                      </select>
                    </Field>
                    <Field label="Site web">
                      <input value={form.website_url} onChange={e => setForm(f => ({ ...f, website_url: e.target.value }))}
                        placeholder="https://monsiteweb.com" className={INPUT} />
                    </Field>
                  </div>
                  <Field label="Mesaj (opsyonèl)">
                    <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={3} placeholder="Poukisa ou vle vin sponsor Loré Foundation?" className={INPUT} />
                  </Field>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <button type="button" onClick={handleSubmit} disabled={saving}
                    className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-8 py-3 font-semibold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors">
                    {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                    {saving ? "Voye..." : "Soumèt Aplikasyon"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function SponsorRow({ label, items }: { label: string; items: PublicSponsor[] }) {
  return (
    <div className="mb-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-lore-ink/40 dark:text-white/40">{label}</p>
      <div className="flex flex-wrap gap-3">
        {items.map(s => (
          <div key={s.id}
            className="flex items-center gap-3 rounded-2xl border border-lore-dark/5 bg-white px-5 py-3 dark:border-white/5 dark:bg-lore-night-surface">
            {s.logo_url
              ? <Image src={s.logo_url} alt={s.name} width={32} height={32} sizes="32px" className="h-8 w-8 rounded-full object-cover" />
              : <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lore-blue/10 text-sm font-bold text-lore-blue">
                  {s.name.charAt(0)}
                </div>}
            <div>
              <p className="font-semibold text-sm text-lore-ink dark:text-white">{s.name}</p>
              {s.organization && <p className="text-xs text-lore-ink/50 dark:text-white/50">{s.organization}</p>}
            </div>
            {s.website_url && (
              <a href={s.website_url} target="_blank" rel="noopener noreferrer"
                className="text-lore-blue/50 hover:text-lore-blue">
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-2.5 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-lore-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-lore-ink/60 dark:text-white/60">{label}</label>
      {children}
    </div>
  );
}
