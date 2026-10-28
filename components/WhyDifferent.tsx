import { Check, X } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";

// Chak liy = yon bagay ki reyèlman nan plateforme a (kou/devwa an liy, app mobil,
// notifikasyon, sètifika, enskripsyon an liy). Pa mete isit la anyen ou pa ka kenbe.
const ROWS = [
  "Inscription et paiement en ligne",
  "Devoirs remis et corrigés en ligne",
  "Application mobile : notes et horaire, même hors ligne",
  "Rappel avant chaque cours par notification",
  "Formateurs qui pratiquent le métier au quotidien",
  "Certificat de fin de formation",
];

export default function WhyDifferent() {
  return (
    <section
      id="difference"
      className="relative bg-white px-5 py-20 dark:bg-lore-night-card sm:px-8 sm:py-28 lg:px-12"
    >
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="La différence"
            title="Pourquoi apprendre à Loré School plutôt que seul(e) devant des vidéos"
            description="Regarder des tutos, c'est bien. Être suivi, corrigé et certifié, c'est ce qui fait avancer."
          />
        </AnimatedSection>

        <AnimatedSection delay={0.1} className="mt-12">
          <div className="overflow-hidden rounded-3xl border border-lore-dark/5 bg-lore-cream shadow-card dark:border-white/5 dark:bg-lore-night-surface dark:shadow-card-dark">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-lore-dark/5 bg-lore-dark px-5 py-4 text-xs font-bold uppercase tracking-wider text-white sm:gap-x-8 sm:px-8 sm:text-sm">
              <span>Ce qui compte</span>
              <span className="w-20 text-center text-lore-gold sm:w-28">Loré School</span>
              <span className="w-20 text-center text-white/60 sm:w-28">Apprendre seul</span>
            </div>
            <ul>
              {ROWS.map((row) => (
                <li
                  key={row}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-x-4 border-b border-lore-dark/5 px-5 py-4 last:border-b-0 dark:border-white/5 sm:gap-x-8 sm:px-8"
                >
                  <span className="text-sm font-medium text-lore-ink dark:text-white sm:text-base">{row}</span>
                  <span className="flex w-20 justify-center sm:w-28">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-lore-emerald/15 text-lore-emerald dark:text-lore-emerald-light">
                      <Check className="h-4 w-4" strokeWidth={3} aria-label="Oui" />
                    </span>
                  </span>
                  <span className="flex w-20 justify-center sm:w-28">
                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/10 text-red-500">
                      <X className="h-4 w-4" strokeWidth={3} aria-label="Non" />
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
