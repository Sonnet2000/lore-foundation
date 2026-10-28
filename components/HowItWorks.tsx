import Link from "next/link";
import { ArrowRight, Search, FileText, Smartphone, Award } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

const STEPS = [
  {
    icon: Search,
    title: "Choisissez votre formation",
    description:
      "Développement web, design graphique, bureautique et outils numériques : parcourez les cours de l'école et trouvez celui qui correspond à votre objectif.",
  },
  {
    icon: FileText,
    title: "Inscrivez-vous en ligne",
    description:
      "Remplissez le formulaire d'inscription depuis votre téléphone ou votre ordinateur, puis réglez avec l'un des moyens de paiement proposés.",
  },
  {
    icon: Smartphone,
    title: "Suivez vos cours",
    description:
      "Cours, devoirs corrigés en ligne, notes et horaire : tout se suit dans l'application Loré School, avec un rappel avant chaque cours.",
  },
  {
    icon: Award,
    title: "Obtenez votre certificat",
    description:
      "À la fin de la formation, vous recevez un certificat que vous pouvez ajouter à votre CV et montrer à vos futurs employeurs ou clients.",
  },
];

export default function HowItWorks() {
  return (
    <section
      id="methode"
      className="relative bg-white px-5 py-20 dark:bg-lore-night sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="La méthode"
            title="Comment ça marche ? En 4 étapes, tout est clair"
            description="Pas de parcours compliqué : vous choisissez, vous vous inscrivez, vous apprenez avec un suivi concret, puis vous repartez avec une preuve de vos compétences."
          />
        </AnimatedSection>

        <ol className="mt-12 grid gap-5 sm:mt-16 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((step, i) => (
            <li key={step.title}>
              <AnimatedSection delay={i * 0.1} className="h-full">
                <div className="card-lift relative h-full rounded-3xl border border-lore-dark/5 bg-lore-cream p-6 dark:border-white/5 dark:bg-lore-night-surface">
                  <span className="absolute right-5 top-4 font-display text-5xl font-extrabold leading-none text-lore-gold/20">
                    {i + 1}
                  </span>
                  <span className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lore-emerald/10 text-lore-emerald ring-1 ring-lore-emerald/15 dark:text-lore-emerald-light">
                    <step.icon className="h-6 w-6" strokeWidth={1.75} />
                  </span>
                  <h3 className="font-display text-lg font-bold leading-snug text-lore-ink dark:text-white">
                    {step.title}
                  </h3>
                  <p className="mt-2.5 text-sm leading-relaxed text-lore-ink/60 dark:text-white/60">
                    {step.description}
                  </p>
                </div>
              </AnimatedSection>
            </li>
          ))}
        </ol>

        <AnimatedSection delay={0.2} className="mt-10 flex justify-center">
          <Link
            href="/ecole"
            className="btn-gold focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105"
          >
            Voir les formations
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </AnimatedSection>
      </div>
    </section>
  );
}
