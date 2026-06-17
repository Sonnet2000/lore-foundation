"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { type Testimonial } from "@/lib/data";

export default function TestimonialsClient({ items: testimonials }: { items: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (testimonials.length === 0) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const goTo = (next: number) => {
    setIndex((next + testimonials.length) % testimonials.length);
  };

  const current = testimonials[index];

  return (
    <section className="relative overflow-hidden bg-lore-gradient px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-gradient-dark">
      <div className="mx-auto max-w-4xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ce que nos clients disent de nous"
            light
          />
        </AnimatedSection>

        <div className="mt-12 sm:mt-16">
          <div className="relative min-h-[260px] rounded-4xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm sm:min-h-[240px] sm:p-12">
            <Quote
              className="absolute right-6 top-6 h-10 w-10 text-lore-gold/30 sm:right-10 sm:top-10"
              strokeWidth={1.5}
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={current.name}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-6"
              >
                <p className="max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl">
                  « {current.quote} »
                </p>
                <div className="flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-lore-gold font-display text-sm font-bold text-lore-dark">
                    {current.initials}
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-white">
                      {current.name}
                    </p>
                    <p className="text-sm text-white/60">{current.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Témoignage précédent"
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  className={`h-2 rounded-full transition-all ${
                    i === index ? "w-8 bg-lore-gold" : "w-2 bg-white/25"
                  }`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Témoignage suivant"
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-colors hover:bg-white/10"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
