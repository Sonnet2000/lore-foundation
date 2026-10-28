import { ArrowUpRight } from "lucide-react";
import { PLATFORMS } from "@/lib/brand";
import SectionIntro from "./SectionIntro";
import Reveal from "./Reveal";

/** Les quatre plateformes officielles. Chaque carte pointe vers la vraie plateforme externe. */
export default function DigitalHub() {
  return (
    <section id="plateformes" aria-labelledby="hub-title" className="bg-navy px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionIntro
            id="hub-title"
            tone="dark"
            label="Plateformes numériques"
            title="Votre espace numérique d’apprentissage"
            description="Quatre plateformes officielles, un seul point d’entrée. Chaque lien vous mène directement au service concerné."
          />
        </Reveal>

        <div className="mt-12 overflow-hidden rounded-2xl border border-white/15 bg-navy-900">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3" aria-hidden="true">
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-white/25" />
            <span className="h-2.5 w-2.5 rounded-full bg-gold" />
            <span className="ml-3 truncate rounded-md bg-white/10 px-3 py-1 text-xs text-white/70">lorefondation.com</span>
          </div>
          <ul className="grid gap-px bg-white/10 sm:grid-cols-2 xl:grid-cols-4">
            {PLATFORMS.map(({ id, title, description, cta, href, icon: Icon }) => (
              <li key={id} className="bg-navy-900">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full flex-col p-6 transition-colors hover:bg-royal-700 focus-visible:bg-royal-700 focus-visible:outline focus-visible:outline-[3px] focus-visible:-outline-offset-[3px] focus-visible:outline-gold sm:p-7"
                >
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-royal text-white transition-colors group-hover:bg-white group-hover:text-royal">
                    <Icon className="h-6 w-6" aria-hidden="true" />
                  </span>
                  <h3 className="mt-6 font-display text-2xl font-bold text-white">{title}</h3>
                  <p className="mt-2 flex-1 text-[0.95rem] leading-relaxed text-white/75">{description}</p>
                  <p className="mt-3 break-all text-xs text-white/55">{href.replace("https://", "")}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-gold-300">
                    {cta}
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                    <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
