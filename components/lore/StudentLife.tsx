import { Compass, Laptop, Landmark, Lightbulb, PenTool } from "lucide-react";
import SectionIntro from "./SectionIntro";
import Reveal from "./Reveal";

/** Thèmes éditoriaux (intentions pédagogiques) — pas des affirmations sur des installations ou activités. */
const THEMES = [
  { icon: PenTool, title: "Apprendre par la pratique", text: "Une notion se comprend vraiment quand on l’utilise : on apprend en faisant, en essayant, en corrigeant." },
  { icon: Laptop, title: "Développer ses compétences numériques", text: "Les outils numériques ouvrent des portes. Les maîtriser, c’est gagner en autonomie." },
  { icon: Compass, title: "Cultiver la discipline et l’excellence", text: "La régularité et l’exigence envers soi-même font la différence sur la durée." },
  { icon: Lightbulb, title: "Innover pour construire l’avenir", text: "Poser les bonnes questions, imaginer des solutions, oser les mettre en œuvre." },
  { icon: Landmark, title: "Servir sa communauté et son pays", text: "Le savoir prend tout son sens lorsqu’il est mis au service d’Haïti avec dignité." },
];

export default function StudentLife() {
  return (
    <section id="vie-academique" aria-labelledby="vie-title" className="bg-sky-50 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <SectionIntro
              id="vie-title"
              label="Vie académique"
              title="Une communauté qui apprend, s’exerce et s’engage"
              description="Cinq repères qui guident l’esprit de l’apprentissage à Loré Fondation."
            />
          </Reveal>
        </div>
        <ol className="border-t border-royal/20">
          {THEMES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-b border-royal/20">
              <Reveal>
                <div className="grid grid-cols-[auto_1fr] gap-x-5 py-7 sm:gap-x-7 sm:py-9">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-royal ring-1 ring-royal/20">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-2xl font-bold leading-snug text-navy sm:text-[1.7rem]">{title}</h3>
                    <p className="mt-2 max-w-lg text-base leading-relaxed text-navy/70">{text}</p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
