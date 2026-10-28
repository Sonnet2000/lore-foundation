import Link from "next/link";
import { ArrowRight, ChevronDown, MessageCircle } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { siteInfo } from "@/lib/data";

// Modifye tèks la isit la sèlman — li sèvi pou paj la ak pou done estriktire Google (FAQPage).
export const FAQ_ITEMS: { q: string; a: string }[] = [
  {
    q: "Quelles formations proposez-vous ?",
    a: "Développement web et logiciel, design graphique et création visuelle, ateliers de bureautique et d'outils numériques professionnels. La liste des cours disponibles est sur la page École.",
  },
  {
    q: "Comment m'inscrire à un cours ?",
    a: "Rendez-vous sur la page École, choisissez votre cours puis remplissez le formulaire d'inscription en ligne. Si vous avez besoin d'aide, écrivez-nous depuis la section Contact ou sur WhatsApp.",
  },
  {
    q: "Quels moyens de paiement sont acceptés ?",
    a: "Les moyens de paiement disponibles sont indiqués sur la page de paiement, au moment de votre inscription. En cas de doute, contactez-nous avant de payer.",
  },
  {
    q: "Existe-t-il une application mobile ?",
    a: "Oui. L'application Loré School permet de consulter vos notes et votre horaire, même sans connexion, et de recevoir un rappel avant chaque cours. Elle se télécharge depuis la section Application de cette page.",
  },
  {
    q: "Reçoit-on un certificat à la fin de la formation ?",
    a: "Oui, un certificat de fin de formation est délivré à l'issue des cours.",
  },
  {
    q: "Mes données personnelles sont-elles protégées ?",
    a: "Nous ne vendons pas vos données. Vous pouvez les télécharger ou supprimer votre compte directement depuis l'application. Tous les détails sont dans notre politique de confidentialité (disponible en français, kreyòl et anglais).",
  },
];

export default function FaqSection() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  };

  return (
    <section
      id="faq"
      className="relative bg-lore-cream px-5 py-20 dark:bg-lore-night sm:px-8 sm:py-28 lg:px-12"
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-3xl">
        <AnimatedSection>
          <SectionHeading eyebrow="FAQ" title="Questions fréquentes" />
        </AnimatedSection>

        <div className="mt-12 flex flex-col gap-3">
          {FAQ_ITEMS.map(({ q, a }, i) => (
            <AnimatedSection key={q} delay={i * 0.05}>
              <details className="group rounded-2xl border border-lore-dark/5 bg-white shadow-card open:shadow-soft dark:border-white/5 dark:bg-lore-night-surface dark:shadow-card-dark">
                <summary className="focus-ring flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 font-display text-base font-bold text-lore-ink dark:text-white [&::-webkit-details-marker]:hidden">
                  {q}
                  <ChevronDown className="h-5 w-5 shrink-0 text-lore-gold transition-transform group-open:rotate-180" />
                </summary>
                <p className="px-5 pb-5 text-sm leading-relaxed text-lore-ink/65 dark:text-white/65">
                  {a}{" "}
                  {q.startsWith("Mes données") && (
                    <Link
                      href="/politique-de-confidentialite"
                      className="font-semibold text-lore-emerald underline underline-offset-2 dark:text-lore-emerald-light"
                    >
                      Lire la politique
                    </Link>
                  )}
                </p>
              </details>
            </AnimatedSection>
          ))}
        </div>

        {/* Dènye apèl a aksyon */}
        <AnimatedSection delay={0.1} className="mt-14">
          <div className="rounded-4xl bg-lore-gradient px-6 py-10 text-center text-white shadow-premium sm:px-12 sm:py-14">
            <h3 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
              Prêt(e) à passer à l&apos;action ?
            </h3>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
              Choisissez votre formation dès aujourd&apos;hui, ou posez-nous vos questions : nous vous répondons.
            </p>
            <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/ecole"
                className="btn-gold focus-ring group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105 sm:w-auto"
              >
                Voir les formations
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href={siteInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-bold text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                <MessageCircle className="h-4 w-4" />
                Nous écrire sur WhatsApp
              </a>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
