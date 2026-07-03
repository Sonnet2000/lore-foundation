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
    <section className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-lore-cream dark:bg-lore-night overflow-hidden">
      {/* Subtle radial glow top-center */}
      <div
        className="absolute left-1/2 top-0 -translate-x-1/2 h-72 w-[600px] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(15,152,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Notre Impact"
            title="Les piliers de notre engagement"
            description="Loré Foundation agit sur trois fronts essentiels pour transformer durablement les communautés haïtiennes et préparer la prochaine génération de leaders."
          />
        </AnimatedSection>

        <div className="mt-10 grid grid-cols-2 gap-3.5 sm:mt-18 sm:gap-7 lg:grid-cols-3 lg:gap-9">
          {whyChooseUs.map((card, i) => (
            <AnimatedSection key={card.title} delay={i * 0.12}>
              <TabCard compact className="h-full card-lift">
                {/* Icon with ring */}
                <span className="mb-2.5 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-lore-emerald/8 text-lore-emerald ring-1 ring-lore-emerald/15 dark:bg-lore-emerald/10 dark:text-lore-emerald-light dark:ring-lore-emerald/20 sm:mb-5 sm:h-14 sm:w-14">
                  <card.icon className="h-5 w-5 sm:h-7 sm:w-7" strokeWidth={1.75} />
                </span>

                {/* Number accent */}
                <span className="mb-1.5 block font-display text-[9px] font-bold uppercase tracking-[0.2em] text-lore-gold/70 sm:mb-3 sm:text-xs sm:tracking-[0.25em]">
                  0{i + 1}
                </span>

                <h3 className="font-display text-sm font-bold text-lore-ink dark:text-white sm:text-xl">
                  {card.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-lore-ink/55 dark:text-white/55 sm:mt-3 sm:line-clamp-none sm:text-sm">
                  {card.description}
                </p>

                <button
                  type="button"
                  onClick={() => setOpenIndex(i)}
                  className="focus-ring group mt-3 inline-flex items-center gap-1.5 rounded text-[11px] font-semibold text-lore-emerald transition-colors hover:text-lore-dark dark:text-lore-emerald-light dark:hover:text-white sm:mt-6 sm:text-sm"
                >
                  Découvrir
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1 sm:h-4 sm:w-4" />
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
