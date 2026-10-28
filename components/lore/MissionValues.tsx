import { Award, HandHeart, Cpu, ShieldCheck } from "lucide-react";
import { siteInfo } from "@/lib/data";
import SectionIntro from "./SectionIntro";
import Reveal from "./Reveal";

const VALUES = [
  { icon: Award, title: "Excellence", text: "Viser le meilleur niveau dans ce que nous enseignons et dans la façon de le faire." },
  { icon: ShieldCheck, title: "Discipline", text: "Travailler avec rigueur, régularité et professionnalisme." },
  { icon: Cpu, title: "Innovation", text: "Mettre la technologie au service de l’apprentissage." },
  { icon: HandHeart, title: "Service", text: "Servir la communauté et Haïti avec dignité." },
];

export default function MissionValues() {
  return (
    <section id="mission" aria-labelledby="mission-title" className="bg-ivory px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionIntro id="mission-title" label="Mission et valeurs" title="Ce qui nous guide" description={siteInfo.mission} />
        </Reveal>
        <ul className="mt-12 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map(({ icon: Icon, title, text }) => (
            <li key={title} className="border-t-2 border-royal pt-5">
              <Reveal>
                <Icon className="h-6 w-6 text-royal" aria-hidden="true" />
                <h3 className="mt-4 font-display text-2xl font-bold text-navy">{title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-navy/70">{text}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
