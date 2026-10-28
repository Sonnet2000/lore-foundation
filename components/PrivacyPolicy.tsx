"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Database,
  Share2,
  Clock,
  UserCheck,
  Lock,
  Baby,
  Mail,
  Cookie,
  BarChart3,
  Megaphone,
  ShieldCheck,
  Fingerprint,
} from "lucide-react";
import ManageCookiesButton from "@/components/ManageCookiesButton";

type Lang = "fr" | "ht" | "en";

const LANGS: { code: Lang; label: string }[] = [
  { code: "fr", label: "Français" },
  { code: "ht", label: "Kreyòl" },
  { code: "en", label: "English" },
];

// Koordone yo ofisyèl yo — pran tèlman jan yo ye nan privacy.html la.
const OPERATOR_PHONES = "(+509) 4155-9094 / 3993-4029";
const OPERATOR_EMAIL = "foundationlore09@gmail.com";

type Row = { category: string; examples: string; purpose: string };
type Item = { title: string; body: string };

type Content = {
  htmlLang: string;
  h1: string;
  updated: string;
  intro: string;
  appTitle: string;
  collectTitle: string;
  collectHead: [string, string, string];
  rows: Row[];
  biometrics: string;
  google: string;
  shareTitle: string;
  share: string;
  keepTitle: string;
  keep: string;
  rightsTitle: string;
  rights: Item[];
  rightsPhone: string;
  securityTitle: string;
  security: string;
  childrenTitle: string;
  children: string;
  contactTitle: string;
  contact: string;
  cookiesTitle: string;
  cookies: Item[];
  cookiesChange: string;
  cookiesLinkNote: string;
};

const CONTENT: Record<Lang, Content> = {
  fr: {
    htmlLang: "fr",
    h1: "Politique de confidentialité",
    updated: "Dernière mise à jour : octobre 2026",
    intro:
      "Cette politique explique quelles données l'application Loré School collecte, pourquoi, combien de temps elles sont conservées et comment exercer vos droits. L'application est exploitée par Loré Fondation, Vaudreuil, Route Nationale #1, Carrefour Zabitan, Institution EDEN (Haïti) — tél. " +
      OPERATOR_PHONES +
      " — www.lorefondation.com.",
    appTitle: "Application Loré School",
    collectTitle: "1. Données collectées",
    collectHead: ["Catégorie", "Exemples", "Finalité"],
    rows: [
      {
        category: "Identité et contact",
        examples: "nom, adresse e-mail, téléphone, photo de profil, date de naissance, genre, commune",
        purpose: "Gérer votre compte, vos inscriptions et vous contacter",
      },
      {
        category: "Pièces d'identité (si fournies)",
        examples: "copie de pièce d'identité, photos d'identité",
        purpose: "Vérification d'inscription",
      },
      {
        category: "Données scolaires",
        examples: "inscriptions, présences, notes, examens, certificats, contrats d'inscription et signature",
        purpose: "Fournir la formation et délivrer des documents officiels",
      },
      {
        category: "Données financières",
        examples: "paiements, échéanciers, reçus",
        purpose: "Comptabilité de l'école et obligations légales",
      },
      {
        category: "Données techniques",
        examples: "jeton de notification (push), type d'appareil, journal d'actions administratives, rapports d'erreurs",
        purpose: "Notifications, sécurité, correction de bogues",
      },
    ],
    biometrics:
      "La biométrie (empreinte / visage) n'est jamais envoyée à nos serveurs : elle est gérée par votre téléphone ; l'application ne reçoit qu'une confirmation « réussi / échoué ».",
    google:
      "Si vous vous connectez avec votre compte Google, nous recevons uniquement votre nom, votre adresse e-mail et votre photo de profil. Nous ne recevons jamais votre mot de passe Google.",
    shareTitle: "2. Partage",
    share:
      "Nous ne vendons pas vos données. Elles sont traitées par nos prestataires techniques (hébergement et base de données Supabase, notifications Expo, rapports d'erreurs Sentry) uniquement pour faire fonctionner l'application. Le personnel de l'école accède uniquement aux données nécessaires à sa fonction.",
    keepTitle: "3. Conservation",
    keep:
      "Les données du compte sont conservées tant que le compte est actif. Les dossiers financiers et académiques (paiements, notes, présences, certificats) sont conservés par l'école pour la comptabilité et la loi, y compris après suppression du compte, sous forme anonymisée.",
    rightsTitle: "4. Vos droits",
    rights: [
      {
        title: "Accès / portabilité",
        body: "Profil → « Confidentialité & mes données » → « Télécharger mes données » (fichier JSON).",
      },
      {
        title: "Suppression",
        body: "Profil → « Supprimer mon compte ». Votre nom, photo, téléphone, documents, appareils et notifications sont effacés ; l'historique financier et académique est anonymisé ; l'accès est fermé définitivement.",
      },
      {
        title: "Rectification",
        body: "Modifiez vos informations dans Profil, ou contactez l'école.",
      },
    ],
    rightsPhone:
      "Si vous ne pouvez pas utiliser l'application, vous pouvez demander la suppression par téléphone au " +
      OPERATOR_PHONES +
      ".",
    securityTitle: "5. Sécurité",
    security:
      "Connexions chiffrées (HTTPS), contrôle d'accès par rôle, authentification à deux facteurs disponible, verrouillage de l'application par code ou biométrie sur l'appareil.",
    childrenTitle: "6. Enfants",
    children:
      "L'application s'adresse à des adultes en formation professionnelle. Elle n'est pas destinée aux enfants de moins de 13 ans.",
    contactTitle: "7. Contact",
    contact: "Questions :",
    cookiesTitle: "Site web — cookies et publicité",
    cookies: [
      {
        title: "Qu'est-ce qu'un cookie ?",
        body: "Un cookie est un petit fichier déposé sur votre appareil (téléphone, ordinateur) lorsque vous visitez un site. Il permet de mémoriser certaines informations, comme vos préférences ou des statistiques de visite anonymes.",
      },
      {
        title: "Statistiques de visite",
        body: "Avec votre accord, nous utilisons Google Analytics ainsi qu'un compteur interne pour comprendre quelles pages sont les plus consultées. Ces données sont anonymisées et ne permettent pas de vous identifier personnellement.",
      },
      {
        title: "Publicités",
        body: "Notre site peut afficher des publicités via Google AdSense, dont les revenus contribuent au financement de nos actions communautaires. Google peut utiliser des cookies pour adapter les annonces affichées.",
      },
      {
        title: "Vos choix",
        body: "Vous pouvez accepter ou refuser les cookies de mesure d'audience à tout moment via la bannière affichée lors de votre première visite, ou en revenant sur cette page. Refuser n'empêche pas la navigation sur le site.",
      },
    ],
    cookiesChange: "Vous avez déjà fait un choix et souhaitez le modifier ?",
    cookiesLinkNote: "Voir aussi nos",
  },

  ht: {
    htmlLang: "ht",
    h1: "Politik konfidansyalite",
    updated: "Dènye mizajou : oktòb 2026",
    intro:
      "Politik sa a di ki done aplikasyon Loré School kolekte, poukisa, konbyen tan nou kenbe yo, ak ki jan ou ka egzèse dwa ou. Loré Fondation ap jere aplikasyon an : Vaudreuil, Route Nationale #1, Carrefour Zabitan, Institution EDEN (Ayiti) — tel. " +
      OPERATOR_PHONES +
      " — www.lorefondation.com.",
    appTitle: "Aplikasyon Loré School",
    collectTitle: "1. Done nou kolekte",
    collectHead: ["Kategori", "Egzanp", "Rezon"],
    rows: [
      {
        category: "Idantite ak kontak",
        examples: "non, imèl, telefòn, foto pwofil, dat nesans, sèks, komin",
        purpose: "Jere kont ou, enskripsyon ou yo epi kontakte w",
      },
      {
        category: "Pyès idantite (si ou bay yo)",
        examples: "kopi pyès idantite, foto idantite",
        purpose: "Verifye enskripsyon",
      },
      {
        category: "Done lekòl",
        examples: "enskripsyon, prezans, nòt, egzamen, sètifika, kontra enskripsyon ak siyati",
        purpose: "Bay fòmasyon an epi delivre dokiman ofisyèl",
      },
      {
        category: "Done finansye",
        examples: "peman, tranch, resi",
        purpose: "Kontablite lekòl la ak obligasyon legal",
      },
      {
        category: "Done teknik",
        examples: "token notifikasyon (push), tip aparèy, jounal aksyon admin, rapò erè",
        purpose: "Notifikasyon, sekirite, korije bòg",
      },
    ],
    biometrics:
      "Byometri (anprent/vizaj) pa janm voye sou sèvè nou yo : telefòn ou jere l. Aplikasyon an resevwa sèlman yon konfimasyon « siksè / echwe ».",
    google:
      "Si ou konekte ak kont Google ou, nou resevwa sèlman non ou, imèl ou ak foto pwofil ou. Nou pa janm resevwa modpas Google ou.",
    shareTitle: "2. Pataj",
    share:
      "Nou pa vann done ou. Sèvis teknik nou yo (ebèjman ak baz done Supabase, notifikasyon Expo, rapò erè Sentry) trete yo sèlman pou fè aplikasyon an mache. Pèsonèl lekòl la jwenn aksè sèlman ak done ki nesesè pou travay li.",
    keepTitle: "3. Konsèvasyon",
    keep:
      "Done kont ou rete toutotan kont lan aktif. Dosye finansye ak akademik (peman, nòt, prezans, sètifika) rete nan lekòl la pou kontablite ak lalwa, menm apre w fin efase kont lan, men yo anonim.",
    rightsTitle: "4. Dwa ou",
    rights: [
      {
        title: "Aksè / telechaje",
        body: "Pwofil → « Konfidansyalite & done mwen » → « Telechaje done mwen » (fichye JSON).",
      },
      {
        title: "Efase kont ou",
        body: "Pwofil → « Efase kont mwen ». Non, foto, telefòn, dokiman, aparèy ak notifikasyon ou efase ; istwa finansye ak akademik (peman, nòt, prezans, sètifika) rete nan lekòl la men li anonim ; aksè a fèmen pou tout tan.",
      },
      {
        title: "Korije enfòmasyon",
        body: "Modifye enfòmasyon ou nan Pwofil, oswa kontakte lekòl la.",
      },
    ],
    rightsPhone:
      "Si ou pa ka itilize aplikasyon an, rele " + OPERATOR_PHONES + " pou mande efasman an.",
    securityTitle: "5. Sekirite",
    security:
      "Koneksyon chifre (HTTPS), kontwòl aksè selon wòl, otantifikasyon de faktè disponib, ak vèwouyaj aplikasyon an ak yon kòd oswa byometri sou aparèy la.",
    childrenTitle: "6. Timoun",
    children:
      "Aplikasyon an se pou granmoun k ap fè fòmasyon pwofesyonèl ; li pa pou timoun ki gen mwens pase 13 an.",
    contactTitle: "7. Kontak",
    contact: "Kesyon :",
    cookiesTitle: "Sit entènèt — cookies ak piblisite",
    cookies: [
      {
        title: "Kisa yon cookie ye ?",
        body: "Yon cookie se yon ti fichye ki mete sou aparèy ou (telefòn, òdinatè) lè ou vizite yon sit. Li pèmèt sonje kèk enfòmasyon, tankou preferans ou oswa estatistik vizit anonim.",
      },
      {
        title: "Estatistik vizit",
        body: "Avèk dakò ou, nou itilize Google Analytics ak yon konte entèn pou konprann ki paj yo pi vizite. Done sa yo anonim e yo pa pèmèt nou idantifye w pèsonèlman.",
      },
      {
        title: "Piblisite",
        body: "Sit nou an ka montre piblisite atravè Google AdSense, ki revni yo ede finanse aksyon kominotè nou yo. Google ka itilize cookies pou adapte piblisite yo.",
      },
      {
        title: "Chwa ou",
        body: "Ou ka aksepte oswa refize cookies mezi odyans yo nenpòt ki lè atravè bannyè ki parèt premye fwa ou vizite a, oswa lè w tounen sou paj sa a. Refize pa anpeche w navige sou sit la.",
      },
    ],
    cookiesChange: "Ou te fè yon chwa deja e ou vle chanje l ?",
    cookiesLinkNote: "Gade tou",
  },

  en: {
    htmlLang: "en",
    h1: "Privacy policy",
    updated: "Last updated: October 2026",
    intro:
      "This policy explains what data the Loré School app collects, why, how long it is kept and how to exercise your rights. The app is operated by Loré Fondation, Vaudreuil, Route Nationale #1, Carrefour Zabitan, EDEN Institution (Haiti) — tel. " +
      OPERATOR_PHONES +
      " — www.lorefondation.com.",
    appTitle: "Loré School app",
    collectTitle: "1. Data we collect",
    collectHead: ["Category", "Examples", "Purpose"],
    rows: [
      {
        category: "Identity and contact",
        examples: "name, email, phone, profile photo, date of birth, gender, commune",
        purpose: "Manage your account and enrollments, and contact you",
      },
      {
        category: "ID documents (if provided)",
        examples: "copy of ID, ID photos",
        purpose: "Verify enrollment",
      },
      {
        category: "School records",
        examples: "enrollments, attendance, grades, exams, certificates, enrollment contracts and signature",
        purpose: "Deliver the training and issue official documents",
      },
      {
        category: "Financial records",
        examples: "payments, installments, receipts",
        purpose: "School accounting and legal obligations",
      },
      {
        category: "Technical data",
        examples: "push token, device type, admin action log, crash reports",
        purpose: "Notifications, security, bug fixing",
      },
    ],
    biometrics:
      "Biometrics (fingerprint/face) never leave your phone: your device handles them, and the app only receives a “success / failure” confirmation.",
    google:
      "If you sign in with your Google account, we only receive your name, email address and profile photo. We never receive your Google password.",
    shareTitle: "2. Sharing",
    share:
      "We do not sell your data. Our technical providers (Supabase hosting and database, Expo notifications, Sentry crash reports) process it only to run the app. School staff only access the data needed for their role.",
    keepTitle: "3. Retention",
    keep:
      "Account data is kept while the account is active. Financial and academic records (payments, grades, attendance, certificates) are kept by the school for accounting and legal reasons, including after account deletion, in anonymized form.",
    rightsTitle: "4. Your rights",
    rights: [
      {
        title: "Access / portability",
        body: "Profile → “Privacy & my data” → “Download my data” (JSON file).",
      },
      {
        title: "Deletion",
        body: "Profile → “Delete my account”. Your name, photo, phone, documents, devices and notifications are erased; financial and academic history is anonymized; access is closed permanently.",
      },
      {
        title: "Correction",
        body: "Edit your information in Profile, or contact the school.",
      },
    ],
    rightsPhone:
      "If you cannot use the app, you can request deletion by phone at " + OPERATOR_PHONES + ".",
    securityTitle: "5. Security",
    security:
      "Encrypted connections (HTTPS), role-based access control, two-factor authentication available, and app lock with a passcode or biometrics on your device.",
    childrenTitle: "6. Children",
    children:
      "The app is intended for adults in professional training and is not directed to children under 13.",
    contactTitle: "7. Contact",
    contact: "Questions:",
    cookiesTitle: "Website — cookies and advertising",
    cookies: [
      {
        title: "What is a cookie?",
        body: "A cookie is a small file stored on your device (phone, computer) when you visit a website. It remembers certain information, such as your preferences or anonymous visit statistics.",
      },
      {
        title: "Visit statistics",
        body: "With your consent, we use Google Analytics and an internal counter to understand which pages are most viewed. This data is anonymized and cannot identify you personally.",
      },
      {
        title: "Advertising",
        body: "Our website may display ads through Google AdSense, whose revenue helps fund our community work. Google may use cookies to tailor the ads shown.",
      },
      {
        title: "Your choices",
        body: "You can accept or refuse audience-measurement cookies at any time through the banner shown on your first visit, or by returning to this page. Refusing does not prevent you from browsing the site.",
      },
    ],
    cookiesChange: "Already made a choice and want to change it?",
    cookiesLinkNote: "See also our",
  },
};

const COOKIE_ICONS = [Cookie, BarChart3, Megaphone, ShieldCheck];

function isLang(v: string): v is Lang {
  return v === "fr" || v === "ht" || v === "en";
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
      {children}
    </div>
  );
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Database; children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lore-gold/10 text-lore-gold-dark dark:text-lore-gold">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="font-display text-lg font-bold text-lore-ink dark:text-white">{children}</h3>
    </div>
  );
}

export default function PrivacyPolicy() {
  const [lang, setLang] = useState<Lang>("fr");

  // Ouvri dirèkteman nan bon lang si URL la gen #ht oswa #en (ankò #fr).
  useEffect(() => {
    const h = window.location.hash.replace("#", "");
    if (isLang(h)) setLang(h);
  }, []);

  const choose = (l: Lang) => {
    setLang(l);
    window.history.replaceState(null, "", `#${l}`);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-10 px-5 py-14">
      {/* Chwa lang */}
      <div
        role="tablist"
        aria-label="Language / Langue / Lang"
        className="flex flex-wrap gap-2"
      >
        {LANGS.map(({ code, label }) => (
          <button
            key={code}
            type="button"
            role="tab"
            aria-selected={lang === code}
            onClick={() => choose(code)}
            className={`focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              lang === code
                ? "border-lore-emerald bg-lore-emerald text-white"
                : "border-lore-dark/10 bg-white text-lore-ink/70 hover:border-lore-emerald/40 dark:border-white/10 dark:bg-lore-night-surface dark:text-white/70"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Nou rann twa lang yo nan HTML la (pou Google ka li yo tout) — nou kache sèlman sa ki pa aktif. */}
      {LANGS.map(({ code }) => {
        const c = CONTENT[code];
        return (
          <article
            key={code}
            id={code}
            lang={c.htmlLang}
            hidden={lang !== code}
            className="flex flex-col gap-10"
          >
            <header>
              <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white md:text-4xl">
                {c.h1}
              </h1>
              <p className="mt-1 text-sm font-semibold text-lore-gold-dark dark:text-lore-gold">
                {c.updated}
              </p>
              <p className="mt-4 text-lore-ink/60 dark:text-white/60">{c.intro}</p>
            </header>

            <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">{c.appTitle}</h2>

            {/* 1. Done kolekte */}
            <section className="-mt-6 flex flex-col gap-4">
              <SectionTitle icon={Database}>{c.collectTitle}</SectionTitle>
              <div className="overflow-x-auto rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface">
                <table className="w-full min-w-[560px] text-left text-sm">
                  <thead>
                    <tr className="bg-lore-cream text-lore-ink dark:bg-white/5 dark:text-white">
                      {c.collectHead.map((h) => (
                        <th key={h} className="px-4 py-3 font-display font-bold">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="text-lore-ink/70 dark:text-white/70">
                    {c.rows.map((r) => (
                      <tr key={r.category} className="border-t border-lore-dark/5 align-top dark:border-white/5">
                        <td className="px-4 py-3 font-semibold text-lore-ink dark:text-white">{r.category}</td>
                        <td className="px-4 py-3">{r.examples}</td>
                        <td className="px-4 py-3">{r.purpose}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Card>
                <div className="flex gap-3">
                  <Fingerprint className="mt-0.5 h-5 w-5 shrink-0 text-lore-emerald dark:text-lore-emerald-light" />
                  <p className="text-sm text-lore-ink/70 dark:text-white/70">{c.biometrics}</p>
                </div>
              </Card>
              <Card>
                <p className="text-sm text-lore-ink/70 dark:text-white/70">{c.google}</p>
              </Card>
            </section>

            {/* 2. Pataj */}
            <section className="flex flex-col gap-3">
              <SectionTitle icon={Share2}>{c.shareTitle}</SectionTitle>
              <p className="text-sm leading-relaxed text-lore-ink/70 dark:text-white/70">{c.share}</p>
            </section>

            {/* 3. Konsèvasyon */}
            <section className="flex flex-col gap-3">
              <SectionTitle icon={Clock}>{c.keepTitle}</SectionTitle>
              <p className="text-sm leading-relaxed text-lore-ink/70 dark:text-white/70">{c.keep}</p>
            </section>

            {/* 4. Dwa */}
            <section className="flex flex-col gap-4">
              <SectionTitle icon={UserCheck}>{c.rightsTitle}</SectionTitle>
              <div className="flex flex-col gap-3">
                {c.rights.map((r) => (
                  <Card key={r.title}>
                    <h4 className="font-display text-base font-bold text-lore-ink dark:text-white">{r.title}</h4>
                    <p className="mt-1.5 text-sm text-lore-ink/70 dark:text-white/70">{r.body}</p>
                  </Card>
                ))}
              </div>
              <p className="text-sm text-lore-ink/70 dark:text-white/70">{c.rightsPhone}</p>
            </section>

            {/* 5. Sekirite */}
            <section className="flex flex-col gap-3">
              <SectionTitle icon={Lock}>{c.securityTitle}</SectionTitle>
              <p className="text-sm leading-relaxed text-lore-ink/70 dark:text-white/70">{c.security}</p>
            </section>

            {/* 6. Timoun */}
            <section className="flex flex-col gap-3">
              <SectionTitle icon={Baby}>{c.childrenTitle}</SectionTitle>
              <p className="text-sm leading-relaxed text-lore-ink/70 dark:text-white/70">{c.children}</p>
            </section>

            {/* 7. Kontak */}
            <section className="flex flex-col gap-3">
              <SectionTitle icon={Mail}>{c.contactTitle}</SectionTitle>
              <p className="rounded-xl border border-lore-gold/30 bg-lore-gold/10 px-4 py-3 text-sm text-lore-ink dark:text-white">
                {c.contact} {OPERATOR_PHONES} —{" "}
                <a
                  href={`mailto:${OPERATOR_EMAIL}`}
                  className="font-bold underline underline-offset-2"
                >
                  {OPERATOR_EMAIL}
                </a>
              </p>
            </section>

            {/* Cookies sit entènèt la */}
            <section className="flex flex-col gap-4 border-t border-lore-dark/10 pt-10 dark:border-white/10">
              <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">{c.cookiesTitle}</h2>
              <div className="flex flex-col gap-4">
                {c.cookies.map((item, i) => {
                  const Icon = COOKIE_ICONS[i] ?? Cookie;
                  return (
                    <div
                      key={item.title}
                      className="flex gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:text-lore-emerald-light">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-display text-base font-bold text-lore-ink dark:text-white">{item.title}</h3>
                        <p className="mt-1.5 text-sm text-lore-ink/60 dark:text-white/60">{item.body}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-lore-dark/15 p-5 dark:border-white/15">
                <p className="text-sm text-lore-ink/60 dark:text-white/60">{c.cookiesChange}</p>
                <ManageCookiesButton />
              </div>
              <p className="text-xs text-lore-ink/40 dark:text-white/40">
                {c.cookiesLinkNote}{" "}
                <Link href="/conditions-utilisation" className="underline underline-offset-2">
                  {code === "fr" ? "conditions d'utilisation" : code === "ht" ? "kondisyon itilizasyon" : "terms of use"}
                </Link>
                .
              </p>
            </section>
          </article>
        );
      })}
    </div>
  );
}
