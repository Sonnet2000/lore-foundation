"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import PortfolioGallery from "@/components/ui/PortfolioGallery";
import { ArrowUpRight, FolderKanban } from "lucide-react";
import { type PortfolioItem } from "@/lib/data";

export default function PortfolioClient({ items: portfolio }: { items: PortfolioItem[] }) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  return (
    <section id="portfolio" className="bg-white px-5 py-20 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Portfolio"
            title="Quelques-unes de nos réalisations"
            description="Un aperçu des plateformes et applications conçues sur mesure pour nos clients à travers différents secteurs."
          />
        </AnimatedSection>

        <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {portfolio.map((item, i) => {
            const cover = item.images?.[0];

            return (
              <AnimatedSection key={item.title} delay={(i % 3) * 0.08}>
                <button
                  type="button"
                  id={`portfolio-${item.id}`}
                  onClick={() => setActiveItem(item)}
                  className="focus-ring group relative block aspect-[4/3] w-full scroll-mt-28 overflow-hidden rounded-3xl border-2 border-dashed border-lore-dark/15 bg-gradient-to-br from-lore-emerald/15 via-lore-cream to-lore-dark/10 text-left dark:border-white/10 dark:from-lore-emerald/10 dark:via-lore-night-surface dark:to-lore-dark/20"
                >
                  {cover ? (
                    <Image
                      src={cover}
                      alt={item.title}
                      fill
                      unoptimized
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FolderKanban
                        className="h-12 w-12 text-lore-dark/20 transition-transform duration-500 group-hover:scale-90 dark:text-white/20"
                        strokeWidth={1.5}
                      />
                    </div>
                  )}

                  <div className="absolute inset-x-0 bottom-0 translate-y-2 bg-lore-dark/0 p-5 transition-all duration-300 group-hover:translate-y-0 group-hover:bg-gradient-to-t group-hover:from-lore-dark/85 group-hover:via-lore-dark/40 group-hover:to-transparent">
                    <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lore-gold opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      {item.category}
                    </p>
                    <div className="mt-1 flex items-center justify-between">
                      <h3 className="font-display text-lg font-bold text-lore-ink transition-colors duration-300 group-hover:text-white dark:text-white">
                        {item.title}
                      </h3>
                      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-lore-gold text-lore-dark opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </button>
              </AnimatedSection>
            );
          })}
        </div>
      </div>

      <PortfolioGallery item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
}
