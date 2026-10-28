import { ChevronDown } from "lucide-react";
import SectionIntro from "./SectionIntro";

const FAQ = [
  { q: "Comment m’inscrire ?", a: "Rendez-vous sur la plateforme d’inscription en ligne : inscription.lorefondation.com. Vous pouvez aussi nous écrire depuis la section Contact." },
  { q: "Où passer mes examens ?", a: "Les examens se passent sur la plateforme d’examens en ligne : examen.lorefondation.com." },
  { q: "Où trouver des ressources de lecture et d’étude ?", a: "La bibliothèque numérique est disponible à l’adresse library.lorefondation.com." },
  { q: "Où accéder à l’espace étudiant ?", a: "L’application étudiante est accessible à l’adresse app.lorefondation.com." },
];

/** FAQ en <details> natif : accessible au clavier, sans JavaScript. */
export default function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-sky-50 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionIntro id="faq-title" label="Questions fréquentes" title="Vos questions, nos réponses" />
        <div className="border-t border-royal/20">
          {FAQ.map(({ q, a }) => (
            <details key={q} className="group border-b border-royal/20">
              <summary className="focus-royal flex min-h-[3.5rem] cursor-pointer list-none items-center justify-between gap-4 py-4 font-display text-xl font-semibold text-navy [&::-webkit-details-marker]:hidden">
                {q}
                <ChevronDown className="h-5 w-5 shrink-0 text-royal transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <p className="pb-5 pr-8 text-base leading-relaxed text-navy/75">{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
