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
    }, 6500);
    return () => clearInterval(id);
  }, [testimonials.length]);

  if (testimonials.length === 0) return null;

  const goTo = (next: number) => setIndex((next + testimonials.length) % testimonials.length);
  const current = testimonials[index];

  return (
    <section
      className="relative overflow-hidden px-5 py-20 sm:px-8 sm:py-28 lg:px-12"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(15,152,255,0.15) 0%, transparent 40%), linear-gradient(135deg, #052238 0%, #0A3D62 45%, #0c5a96 100%)",
      }}
    >
      {/* Ambient decorations */}
      <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-lore-gold/6 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-lore-emerald/8 blur-3xl pointer-events-none" />

      {/* Dot grid pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="mx-auto max-w-4xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Témoignages"
            title="Ce que nos clients disent de nous"
            light
          />
        </AnimatedSection>

        <div className="mt-14 sm:mt-18">
          {/* Card */}
          <div className="relative rounded-3xl border border-white/10 p-8 sm:p-12 overflow-hidden"
            style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(16px)" }}
          >
            {/* Top gold accent line */}
            <div
              className="absolute top-0 left-12 right-12 h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(212,175,55,0.5), transparent)" }}
            />

            {/* Large quote icon */}
            <div
              className="absolute right-8 top-8 h-16 w-16 flex items-center justify-center rounded-2xl sm:right-12 sm:top-12"
              style={{ background: "rgba(212,175,55,0.08)" }}
            >
              <Quote className="h-7 w-7 text-lore-gold/60" strokeWidth={1.5} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={current.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="flex flex-col gap-7"
              >
                {/* Quote text */}
                <p className="max-w-2xl text-lg leading-relaxed text-white/90 sm:text-xl font-medium">
                  « {current.quote} »
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <span
                    className="flex h-13 w-13 h-12 w-12 items-center justify-center rounded-full font-display text-sm font-bold text-lore-darker ring-2 ring-lore-gold/40"
                    style={{ background: "linear-gradient(135deg, #f2d272, #d4af37)" }}
                  >
                    {current.initials}
                  </span>
                  <div>
                    <p className="font-display text-base font-bold text-white">{current.name}</p>
                    <p className="text-sm text-white/55">{current.role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-8 flex items-center justify-center gap-5">
            <button
              type="button"
              onClick={() => goTo(index - 1)}
              aria-label="Témoignage précédent"
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:bg-white/10 hover:border-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-2.5">
              {testimonials.map((t, i) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Aller au témoignage ${i + 1}`}
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: i === index ? "2rem" : "0.5rem",
                    background: i === index
                      ? "linear-gradient(90deg, #f2d272, #d4af37)"
                      : "rgba(255,255,255,0.2)",
                  }}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(index + 1)}
              aria-label="Témoignage suivant"
              className="focus-ring flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-white transition-all hover:bg-white/10 hover:border-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
