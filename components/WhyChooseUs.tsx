"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowRight, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import Modal from "@/components/ui/Modal";
import ServiceIllustration from "@/components/ui/ServiceIllustration";
import { whyChooseUs } from "@/lib/data";

export default function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? whyChooseUs[openIndex] : null;

  return (
    <section className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-white dark:bg-lore-night overflow-hidden">
      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Notre Impact"
            title="Les piliers de notre engagement"
            description="Loré Foundation agit sur trois fronts essentiels pour transformer durablement les communautés haïtiennes et préparer la prochaine génération de leaders."
          />
        </AnimatedSection>

        {/* Panno fonse — menm siyati ak Nos Programmes ak Portfolio */}
        <AnimatedSection delay={0.1}>
          <div
            className="relative mt-10 overflow-hidden rounded-[28px] px-4 py-8 sm:mt-16 sm:rounded-[36px] sm:px-8 sm:py-14"
            style={{ background: "linear-gradient(160deg, #031a4a 0%, #052a6e 55%, #043C9E 100%)" }}
          >
            <div className="hero-grid absolute inset-0 pointer-events-none opacity-40" aria-hidden="true" />

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
              {whyChooseUs.map((card, i) => {
                const highlighted = i === 1;
                return (
                  <AnimatedSection key={card.title} delay={i * 0.12}>
                    <button
                      type="button"
                      onClick={() => setOpenIndex(i)}
                      className="focus-ring group relative block h-full w-full text-left"
                    >
                      <div
                        className={`relative flex h-full flex-col rounded-2xl p-3.5 pb-8 shadow-lg transition-transform duration-300 group-hover:-translate-y-1.5 sm:rounded-3xl sm:p-6 sm:pb-11 ${
                          highlighted ? "bg-lore-gold" : "bg-white dark:bg-lore-night-surface"
                        }`}
                      >
                        <span
                          className={`mb-2.5 inline-flex h-9 w-9 items-center justify-center rounded-xl sm:mb-4 sm:h-12 sm:w-12 ${
                            highlighted
                              ? "bg-lore-darker/10 text-lore-darker"
                              : "bg-lore-emerald/8 text-lore-emerald ring-1 ring-lore-emerald/15 dark:bg-lore-emerald/10 dark:text-lore-emerald-light dark:ring-lore-emerald/20"
                          }`}
                        >
                          <card.icon className="h-4.5 w-4.5 sm:h-6 sm:w-6" strokeWidth={1.75} />
                        </span>

                        <span
                          className={`mb-1 block font-display text-[9px] font-bold uppercase tracking-[0.2em] sm:mb-2 sm:text-xs ${
                            highlighted ? "text-lore-darker/60" : "text-lore-gold/70"
                          }`}
                        >
                          0{i + 1}
                        </span>

                        <h3
                          className={`font-display text-xs font-bold sm:text-lg ${
                            highlighted ? "text-lore-darker" : "text-lore-ink dark:text-white"
                          }`}
                        >
                          {card.title}
                        </h3>
                        <p
                          className={`mt-1 line-clamp-3 text-[10px] leading-snug sm:mt-2 sm:line-clamp-none sm:text-sm ${
                            highlighted ? "text-lore-darker/70" : "text-lore-ink/55 dark:text-white/55"
                          }`}
                        >
                          {card.description}
                        </p>
                      </div>

                      {/* Bouton flèch won — chevouche kwen ba-dwat, menm fòm ak lòt seksyon yo */}
                      <span
                        className={`absolute -bottom-3.5 -right-2.5 flex h-9 w-9 items-center justify-center rounded-full shadow-lg ring-4 transition-transform duration-300 group-hover:scale-110 sm:-bottom-5 sm:-right-3 sm:h-12 sm:w-12 sm:ring-[6px] ${
                          highlighted
                            ? "bg-lore-darker text-lore-gold ring-lore-gold"
                            : "bg-lore-gold text-lore-darker ring-[#031a4a]"
                        }`}
                      >
                        <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5" />
                      </span>
                    </button>
                  </AnimatedSection>
                );
              })}
            </div>
          </div>
        </AnimatedSection>
      </div>

      <Modal open={active !== null} onClose={() => setOpenIndex(null)}>
        {active && (
          <div>
            <ServiceIllustration icon={active.icon} satelliteIcons={active.satelliteIcons} />
            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold text-lore-ink sm:text-3xl dark:text-white">
                {active.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-lore-ink/65 sm:text-base dark:text-white/65">
                {active.extendedDescription}
              </p>
              <ul className="mt-6 flex flex-col gap-3">
                {active.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lore-emerald dark:text-lore-emerald-light" />
                    <span className="text-sm leading-relaxed text-lore-ink/75 sm:text-base dark:text-white/75">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <a
                href="#contact"
                onClick={() => setOpenIndex(null)}
                className="btn-gold focus-ring group mt-8 inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105"
              >
                Démarrer un projet
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
