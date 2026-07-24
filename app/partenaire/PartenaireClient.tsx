"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft, CheckCircle2, Loader2, Globe, Users, BookOpen,
  Megaphone, Award, Heart, Handshake, Building2, GraduationCap,
  ChevronDown, ChevronUp,
} from "lucide-react";

// ─── Types de partenariat ─────────────────────────────────────────────────
const PARTNER_TYPES = [
  {
    id: "organisation",
    icon: Building2,
    label: "Organisation / Institution",
    color: "from-blue-500/20 to-blue-400/10 border-blue-400/30",
    iconBg: "bg-blue-500/15 text-blue-400",
    description: "ONG, institutions éducatives, organisations communautaires qui souhaitent collaborer sur des projets communs.",
  },
  {
    id: "entreprise",
    icon: Handshake,
    label: "Entreprise / Client",
    color: "from-amber-500/20 to-amber-400/10 border-amber-400/30",
    iconBg: "bg-amber-500/15 text-amber-400",
    description: "Entreprises qui souhaitent digitaliser leurs activités ou collaborer avec nous sur un projet.",
  },
  {
    id: "individu",
    icon: Heart,
    label: "Formateur / Freelance",
    color: "from-emerald-500/20 to-emerald-400/10 border-emerald-400/30",
    iconBg: "bg-emerald-500/15 text-emerald-400",
    description: "Professionnels, experts ou passionnés qui souhaitent collaborer avec nous ou donner des formations.",
  },
];

// ─── Façons de contribuer ─────────────────────────────────────────────────
const CONTRIBUTION_WAYS = [
  {
    icon: BookOpen,
    title: "Partager vos compétences",
    description: "Donnez des formations, des ateliers ou des conférences dans votre domaine d'expertise.",
  },
  {
    icon: Users,
    title: "Mobiliser votre réseau",
    description: "Parlez de Loré Foundation autour de vous et aidez-nous à toucher plus de jeunes et de communautés.",
  },
  {
    icon: Globe,
    title: "Collaborer sur des projets",
    description: "Co-créez des programmes éducatifs, des événements ou des initiatives communautaires avec nous.",
  },
  {
    icon: Megaphone,
    title: "Représenter la fondation",
    description: "Devenez ambassadeur et portez la voix de Loré Foundation dans votre région ou institution.",
  },
  {
    icon: GraduationCap,
    title: "Contribuer aux formations",
    description: "Offrez du matériel pédagogique, des équipements ou des ressources pour nos programmes.",
  },
  {
    icon: Heart,
    title: "Confier-nous un projet",
    description: "Faites développer votre site, votre logiciel de gestion ou votre identité visuelle par notre équipe.",
  },
];

// ─── Bénéfices partenariat ────────────────────────────────────────────────
const BENEFITS = [
  {
    icon: Award,
    title: "Certificat de partenariat officiel",
    description: "Recevez un certificat officiel Loré Foundation reconnaissant votre engagement.",
  },
  {
    icon: Megaphone,
    title: "Visibilité & communication",
    description: "Votre nom, logo ou organisation mis en avant sur notre site, réseaux sociaux et événements.",
  },
  {
    icon: Users,
    title: "Accès à notre réseau",
    description: "Intégrez un réseau de partenaires, clients et professionnels engagés pour Haïti.",
  },
  {
    icon: Globe,
    title: "Co-branding sur nos projets",
    description: "Associez votre image aux projets et réalisations de Loré Foundation.",
  },
  {
    icon: BookOpen,
    title: "Invitations aux événements",
    description: "Accédez en priorité à nos séminaires, formations et rencontres communautaires.",
  },
  {
    icon: Heart,
    title: "Impact mesurable & rapports",
    description: "Recevez des rapports réguliers sur l'impact concret généré grâce à votre soutien.",
  },
];

// ─── FAQ ──────────────────────────────────────────────────────────────────
const FAQ = [
  {
    q: "Faut-il être une grande organisation pour devenir partenaire ?",
    a: "Non. Nous accueillons des partenaires de toutes tailles — individus, petites associations, entreprises locales ou grandes institutions. Ce qui compte, c'est l'engagement partagé pour le développement humain en Haïti.",
  },
  {
    q: "Le partenariat est-il obligatoirement financier ?",
    a: "Pas du tout. Vous pouvez contribuer en temps, en compétences, en matériel, en visibilité ou en réseau. Nous valorisons toutes les formes d'engagement.",
  },
  {
    q: "Combien de temps faut-il s'engager ?",
    a: "Il n'y a pas de durée minimale imposée. Certains partenaires s'engagent sur un projet précis, d'autres sur le long terme. Nous adaptons le partenariat à votre disponibilité.",
  },
  {
    q: "Comment se déroule le processus après ma soumission ?",
    a: "Notre équipe examine votre demande et vous contacte dans les 48 heures pour un échange. Ensemble, nous définissons les modalités du partenariat.",
  },
];

const emptyForm = {
  name: "", organization: "", email: "", phone: "",
  type: "" as "" | "organisation" | "entreprise" | "individu",
  expertise: "", contribution: "", message: "",
};

export default function PartenaireClient() {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  async function handleSubmit() {
    setError(null);
    if (!form.name.trim() || !form.email.trim()) {
      setError("Nom et email sont requis.");
      return;
    }
    if (!form.type) {
      setError("Veuillez choisir un type de partenariat.");
      return;
    }
    setSaving(true);
    const res = await fetch("/api/sponsor-apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        organization: form.organization,
        email: form.email,
        phone: form.phone,
        tier: "bronze",
        message: [
          form.type ? `Type: ${form.type}` : "",
          form.expertise ? `Expertise: ${form.expertise}` : "",
          form.contribution ? `Contribution souhaitée: ${form.contribution}` : "",
          form.message ? `Message: ${form.message}` : "",
        ].filter(Boolean).join(" | "),
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
      <div className="relative z-10 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Devenir Partenaire</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-12 flex flex-col gap-16">

        {/* ── Hero intro ─────────────────────────────────────────────── */}
        <div className="text-center flex flex-col items-center gap-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-lore-blue/20 bg-lore-blue/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-lore-blue dark:border-lore-blue/30 dark:bg-lore-blue/10">
            <Handshake className="h-3.5 w-3.5" /> Partenariat
          </div>
          <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white md:text-4xl lg:text-5xl">
            Construisons l&apos;avenir <span className="text-lore-blue">ensemble</span>
          </h1>
          <p className="max-w-2xl text-lore-ink/60 dark:text-white/60 text-base md:text-lg leading-relaxed">
            En devenant partenaire de Loré Foundation, vous rejoignez un mouvement qui transforme
            concrètement des vies à travers l&apos;éducation, la formation et l&apos;engagement communautaire en Haïti.
            Chaque forme de soutien compte et amplifie notre impact collectif.
          </p>
        </div>

        {/* ── Types de partenariat ────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-2xl font-bold text-lore-ink dark:text-white mb-2">
            Quel type de partenaire êtes-vous ?
          </h2>
          <p className="text-sm text-lore-ink/50 dark:text-white/50 mb-8">
            Chaque profil est le bienvenu. Choisissez celui qui vous correspond.
          </p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {PARTNER_TYPES.map((t) => (
              <div key={t.id}
                className={`rounded-3xl border bg-gradient-to-br ${t.color} p-6 flex flex-col gap-4`}>
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${t.iconBg}`}>
                  <t.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lore-ink dark:text-white">{t.label}</h3>
                  <p className="mt-2 text-sm text-lore-ink/60 dark:text-white/60 leading-relaxed">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Façons de contribuer ────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-2xl font-bold text-lore-ink dark:text-white mb-2">
            Comment pouvez-vous contribuer ?
          </h2>
          <p className="text-sm text-lore-ink/50 dark:text-white/50 mb-8">
            Il existe plusieurs façons de collaborer avec Loré Foundation — choisissez ce qui vous correspond.
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {CONTRIBUTION_WAYS.map((way) => (
              <div key={way.title}
                className="flex items-start gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lore-blue/10 text-lore-blue dark:bg-lore-blue/15 dark:text-blue-300">
                  <way.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-lore-ink dark:text-white">{way.title}</h3>
                  <p className="mt-1 text-xs text-lore-ink/55 dark:text-white/55 leading-relaxed">{way.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Bénéfices ───────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-lore-blue/15 bg-gradient-to-br from-lore-blue/5 to-blue-400/5 p-8 dark:border-lore-blue/20 dark:from-lore-blue/10 dark:to-blue-400/10">
          <h2 className="font-display text-2xl font-bold text-lore-ink dark:text-white mb-2">
            Ce que vous gagnez en tant que partenaire
          </h2>
          <p className="text-sm text-lore-ink/50 dark:text-white/50 mb-8">
            Un partenariat avec Loré Foundation, c&apos;est aussi une reconnaissance concrète de votre engagement.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lore-blue" />
                <div>
                  <p className="font-semibold text-sm text-lore-ink dark:text-white">{b.title}</p>
                  <p className="mt-1 text-xs text-lore-ink/55 dark:text-white/55 leading-relaxed">{b.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Formulaire ──────────────────────────────────────────────── */}
        <div className="rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface overflow-hidden">
          <div className="border-b border-lore-dark/5 dark:border-white/5 px-8 py-6">
            <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">
              Soumettre ma candidature
            </h2>
            <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">
              Notre équipe vous contacte dans les 48 heures pour discuter de votre partenariat.
            </p>
          </div>

          <div className="px-8 py-8">
            {success ? (
              <div className="flex flex-col items-center gap-5 py-10 text-center">
                <CheckCircle2 className="h-14 w-14 text-emerald-500" />
                <h3 className="font-display text-xl font-bold text-lore-ink dark:text-white">
                  Candidature reçue !
                </h3>
                <p className="max-w-sm text-sm text-lore-ink/60 dark:text-white/60">
                  Merci pour votre intérêt à rejoindre Loré Foundation. Notre équipe examinera
                  votre demande et vous contactera très prochainement.
                </p>
                <div className="flex gap-3">
                  <button type="button" onClick={() => { setSuccess(false); setForm(emptyForm); }}
                    className="rounded-full border border-lore-dark/10 px-5 py-2.5 text-sm font-semibold text-lore-ink dark:border-white/10 dark:text-white hover:bg-lore-dark/5 dark:hover:bg-white/5 transition-colors">
                    Nouvelle demande
                  </button>
                  <Link href="/"
                    className="rounded-full bg-lore-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-lore-blue/90 transition-colors">
                    Retour à l&apos;accueil
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <Field label="Nom complet *">
                    <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      placeholder="Jean Pierre" className={INPUT} />
                  </Field>
                  <Field label="Organisation / Entreprise">
                    <input value={form.organization} onChange={e => setForm(f => ({ ...f, organization: e.target.value }))}
                      placeholder="Mon organisation" className={INPUT} />
                  </Field>
                  <Field label="Email *">
                    <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                      placeholder="jean@exemple.com" className={INPUT} />
                  </Field>
                  <Field label="Téléphone">
                    <input value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                      placeholder="+509 3X XX XXXX" className={INPUT} />
                  </Field>
                </div>

                <Field label="Type de partenariat *">
                  <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value as typeof form.type }))}
                    className={INPUT}>
                    <option value="">Choisir un type</option>
                    <option value="organisation">🏛️ Organisation / Institution</option>
                    <option value="entreprise">🤝 Entreprise / Sponsor</option>
                    <option value="individu">💙 Bénévole / Formateur individuel</option>
                  </select>
                </Field>

                <Field label="Domaine d'expertise ou secteur">
                  <input value={form.expertise} onChange={e => setForm(f => ({ ...f, expertise: e.target.value }))}
                    placeholder="ex: Éducation, Informatique, Droit, Santé, Communication..." className={INPUT} />
                </Field>

                <Field label="Comment souhaitez-vous contribuer ?">
                  <select value={form.contribution} onChange={e => setForm(f => ({ ...f, contribution: e.target.value }))}
                    className={INPUT}>
                    <option value="">Choisir une option</option>
                    <option value="Partager mes compétences / formations">📚 Partager mes compétences / formations</option>
                    <option value="Mobiliser mon réseau">🌐 Mobiliser mon réseau</option>
                    <option value="Collaborer sur des projets">🤝 Collaborer sur des projets</option>
                    <option value="Devenir ambassadeur">📣 Devenir ambassadeur</option>
                    <option value="Soutien matériel / équipement">🖥️ Soutien matériel / équipement</option>
                    <option value="Soutien financier">💳 Soutien financier</option>
                    <option value="Plusieurs formes de contribution">✨ Plusieurs formes de contribution</option>
                  </select>
                </Field>

                <Field label="Message (optionnel)">
                  <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    rows={4}
                    placeholder="Parlez-nous de votre motivation, vos disponibilités, vos idées de collaboration..."
                    className={INPUT} />
                </Field>

                {error && (
                  <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
                )}

                <button type="button" onClick={handleSubmit} disabled={saving}
                  className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-8 py-4 font-bold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors text-sm">
                  {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                  {saving ? "Envoi en cours..." : "Soumettre ma candidature →"}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <div>
          <h2 className="font-display text-2xl font-bold text-lore-ink dark:text-white mb-8">
            Questions fréquentes
          </h2>
          <div className="flex flex-col gap-3">
            {FAQ.map((item, i) => (
              <div key={i}
                className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface overflow-hidden">
                <button type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left">
                  <p className="font-semibold text-sm text-lore-ink dark:text-white">{item.q}</p>
                  {openFaq === i
                    ? <ChevronUp className="h-4 w-4 shrink-0 text-lore-ink/30 dark:text-white/30" />
                    : <ChevronDown className="h-4 w-4 shrink-0 text-lore-ink/30 dark:text-white/30" />}
                </button>
                {openFaq === i && (
                  <div className="border-t border-lore-dark/5 dark:border-white/5 px-6 py-4">
                    <p className="text-sm text-lore-ink/60 dark:text-white/60 leading-relaxed">{item.a}</p>
                  </div>
                )}
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
