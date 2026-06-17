"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import TabCard from "@/components/ui/TabCard";
import Modal from "@/components/ui/Modal";
import ServiceIllustration from "@/components/ui/ServiceIllustration";
import { whyChooseUs } from "@/lib/data";

export default function WhyChooseUs() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const active = openIndex !== null ? whyChooseUs[openIndex] : null;

  return (
    <section className="bg-lore-cream px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Pourquoi nous choisir"
            title="Trois raisons de nous faire confiance"
            description="Une équipe locale, des outils modernes et un accompagnement pensé pour la réalité des entreprises et créateurs en Haïti."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {whyChooseUs.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 0.1}>
              <TabCard className="h-full transition-transform duration-300 hover:-translate-y-1.5">
                <span className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light">
                  <card.icon className="h-7 w-7" strokeWidth={1.75} />
                </span>
                <h3 className="font-display text-xl font-bold text-lore-ink dark:text-white">
                  {card.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-lore-ink/60 dark:text-white/60">
                  {card.description}
                </p>
                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="focus-ring mt-5 inline-flex items-center gap-1.5 rounded text-sm font-semibold text-lore-emerald transition-colors hover:text-lore-dark dark:text-lore-emerald-light dark:hover:text-white"
                >
                  En savoir plus
                  <span aria-hidden="true">→</span>
                </button>
              </TabCard>
            </AnimatedSection>
          ))}
        </div>
      </div>

      <Modal open={active !== null} onClose={() => setOpenIndex(null)}>
        {active && (
          <div>
            <ServiceIllustration icon={active.icon} satelliteIcons={active.satelliteIcons} />

            <div className="p-6 sm:p-8">
              <h3 className="font-display text-2xl font-bold text-lore-ink sm:text-3xl dark:text-white">
                {active.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-lore-ink/70 sm:text-base dark:text-white/70">
                {active.extendedDescription}
              </p>

              <ul className="mt-6 flex flex-col gap-3">
                {active.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-lore-emerald dark:text-lore-emerald-light" />
                    <span className="text-sm leading-relaxed text-lore-ink/80 sm:text-base dark:text-white/80">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                onClick={() => setOpenIndex(null)}
                className="focus-ring group mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-7 py-3.5 text-sm font-bold text-lore-dark shadow-gold transition-transform duration-200 hover:scale-105"
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
