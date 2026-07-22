import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cookie, BarChart3, Megaphone, ShieldCheck, UserCircle, Database, Trash2, Mail } from "lucide-react";
import ManageCookiesButton from "@/components/ManageCookiesButton";

export const metadata: Metadata = {
  title: "Politique de confidentialité — Loré Foundation",
  description: "Comment Loré Foundation et l'application Loré School utilisent et protègent vos données personnelles.",
  alternates: { canonical: "/politique-de-confidentialite" },
};

const SECTIONS = [
  {
    icon: Cookie,
    title: "Qu'est-ce qu'un cookie ?",
    body: "Un cookie est un petit fichier déposé sur votre appareil (téléphone, ordinateur) lorsque vous visitez un site. Il permet de mémoriser certaines informations, comme vos préférences ou des statistiques de visite anonymes.",
  },
  {
    icon: BarChart3,
    title: "Statistiques de visite",
    body: "Avec votre accord, nous utilisons Google Analytics ainsi qu'un compteur interne pour comprendre quelles pages sont les plus consultées. Ces données sont anonymisées et ne permettent pas de vous identifier personnellement.",
  },
  {
    icon: Megaphone,
    title: "Publicités",
    body: "Notre site peut afficher des publicités via Google AdSense, dont les revenus contribuent au financement de nos actions communautaires. Google peut utiliser des cookies pour adapter les annonces affichées.",
  },
  {
    icon: ShieldCheck,
    title: "Vos choix",
    body: "Vous pouvez accepter ou refuser les cookies de mesure d'audience à tout moment via la bannière affichée lors de votre première visite, ou en revenant sur cette page. Refuser n'empêche pas la navigation sur le site.",
  },
];

const APP_SECTIONS = [
  {
    icon: UserCircle,
    title: "Connexion avec Google",
    body: "Lorsque vous vous connectez à l'application Loré School avec votre compte Google, nous recevons uniquement votre nom, votre adresse e-mail et votre photo de profil. Ces informations servent à créer et identifier votre compte dans l'application — nous ne recevons jamais votre mot de passe Google.",
  },
  {
    icon: Database,
    title: "Où sont stockées vos données",
    body: "Les données de votre compte et de l'application (profil, résultats scolaires, informations de l'établissement) sont hébergées de façon sécurisée par Supabase, notre fournisseur de base de données, et ne sont jamais vendues ni partagées avec des tiers à des fins publicitaires.",
  },
  {
    icon: Trash2,
    title: "Suppression de vos données",
    body: "Vous pouvez demander la suppression complète de votre compte et des données associées à tout moment en nous contactant. Nous traitons chaque demande dans un délai raisonnable.",
  },
  {
    icon: Mail,
    title: "Nous contacter",
    body: "Pour toute question concernant vos données personnelles, l'utilisation de l'application Loré School, ou pour exercer vos droits, écrivez-nous à l'adresse indiquée en bas de cette page.",
  },
];

export default function PolitiqueConfidentialitePage() {
  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Politique de confidentialité</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>
      </div>

      <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-14">
        <div>
          <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white md:text-4xl">
            Politique de confidentialité
          </h1>
          <p className="mt-3 text-lore-ink/60 dark:text-white/60">
            Cette page explique quelles données Loré Foundation et l&apos;application mobile Loré School collectent, comment elles sont utilisées, et comment vous pouvez les gérer.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">
            Votre compte et l&apos;application Loré School
          </h2>
          <div className="mt-5 flex flex-col gap-6">
            {APP_SECTIONS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lore-gold/10 text-lore-gold-dark dark:text-lore-gold">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-lore-ink dark:text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-lore-ink/60 dark:text-white/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">
            Cookies du site web
          </h2>
          <div className="mt-5 flex flex-col gap-6">
            {SECTIONS.map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:text-lore-emerald-light">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-display text-base font-bold text-lore-ink dark:text-white">{title}</h3>
                  <p className="mt-1.5 text-sm text-lore-ink/60 dark:text-white/60">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-lore-dark/15 p-5 dark:border-white/15">
          <p className="text-sm text-lore-ink/60 dark:text-white/60">
            Vous avez déjà fait un choix et souhaitez le modifier ?
          </p>
          <ManageCookiesButton />
        </div>

        <p className="text-xs text-lore-ink/40 dark:text-white/40">
          Pour toute question sur vos données, contactez-nous via la page{" "}
          <Link href="/a-propos" className="underline underline-offset-2">contact</Link> du site.
        </p>
      </div>
    </div>
  );
}
