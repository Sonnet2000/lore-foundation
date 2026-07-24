import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, UserCheck, ShieldAlert, Scale, Mail } from "lucide-react";
import SiteChrome from "@/components/SiteChrome";

export const metadata: Metadata = {
  title: "Conditions d'utilisation — Loré Foundation",
  description: "Les règles d'utilisation du site Loré Foundation et de l'application mobile Loré School.",
  alternates: { canonical: "/conditions-utilisation" },
};

const SECTIONS = [
  {
    icon: FileText,
    title: "Objet",
    body: "Ces conditions régissent l'utilisation du site lorefondation.com ainsi que de l'application mobile Loré School, éditée par Loré Foundation. En créant un compte ou en utilisant nos services, vous acceptez ces conditions.",
  },
  {
    icon: UserCheck,
    title: "Votre compte",
    body: "Vous êtes responsable de la confidentialité de vos identifiants de connexion et de l'exactitude des informations fournies lors de la création de votre compte, y compris lorsque vous vous connectez via Google. Chaque compte est personnel et ne doit pas être partagé.",
  },
  {
    icon: ShieldAlert,
    title: "Utilisation autorisée",
    body: "Vous vous engagez à utiliser le site et l'application uniquement à des fins légales, sans porter atteinte aux droits d'autrui, et sans tenter de perturber le fonctionnement de nos services (piratage, surcharge des serveurs, extraction non autorisée de données, etc.).",
  },
  {
    icon: Scale,
    title: "Propriété et responsabilité",
    body: "Les contenus du site et de l'application (textes, logo, design) appartiennent à Loré Foundation, sauf mention contraire. Nous mettons tout en œuvre pour assurer la fiabilité de nos services, mais ne garantissons pas une disponibilité continue et ne pouvons être tenus responsables des dommages indirects liés à leur utilisation.",
  },
  {
    icon: Mail,
    title: "Modifications et contact",
    body: "Ces conditions peuvent être mises à jour périodiquement ; la date de dernière modification est indiquée ci-dessous. Pour toute question, contactez-nous via la page contact du site.",
  },
];

export default function ConditionsUtilisationPage() {
  return (
    <SiteChrome>
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      <div className="relative z-10 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Conditions d&apos;utilisation</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-14">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white md:text-4xl">
            Conditions d&apos;utilisation
          </h1>
          <p className="mt-3 text-lore-ink/60 dark:text-white/60">
            Les règles simples qui encadrent l&apos;utilisation du site lorefondation.com et de l&apos;application Loré School.
          </p>
        </div>

        <div className="flex flex-col gap-6">
          {SECTIONS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:text-lore-emerald-light">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-display text-base font-bold text-lore-ink dark:text-white">{title}</h2>
                <p className="mt-1.5 text-sm text-lore-ink/60 dark:text-white/60">{body}</p>
              </div>
            </div>
          ))}
        </div>

        <p className="text-xs text-lore-ink/40 dark:text-white/40">
          Dernière mise à jour : juillet 2026. Pour toute question sur ces conditions, contactez-nous via la page{" "}
          <Link href="/a-propos" className="underline underline-offset-2">contact</Link> du site. Voir aussi notre{" "}
          <Link href="/politique-de-confidentialite" className="underline underline-offset-2">politique de confidentialité</Link>.
        </p>
      </div>
    </div>
    </SiteChrome>
  );
}
