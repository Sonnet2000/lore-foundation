"use client";

import { useState } from "react";
import Image from "next/image";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import PortfolioGallery from "@/components/ui/PortfolioGallery";
import { ArrowUpRight, FolderKanban, Play } from "lucide-react";
import { type PortfolioItem, type MediaItem } from "@/lib/data";

export default function PortfolioClient({ items: portfolio }: { items: PortfolioItem[] }) {
  const [activeItem, setActiveItem] = useState<PortfolioItem | null>(null);

  return (
    <section id="portfolio" className="bg-white px-5 py-16 sm:px-8 sm:py-24 lg:px-12 dark:bg-lore-night">
      <div className="mx-auto max-w-7xl">
        <AnimatedSection>
          <SectionHeading
            eyebrow="Nos Actions & Réalisations"
            title="Ce que nous avons accompli ensemble"
            description="Chaque projet, chaque formation, chaque séminaire est une histoire de transformation. Voici quelques-unes des actions concrètes menées par Loré Foundation sur le terrain."
          />
        </AnimatedSection>

        <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3">
          {portfolio.map((item, i) => {
            // Rezoud média cover: prefere media[], sinon images[]
            const mediaList: MediaItem[] =
              Array.isArray(item.media) && item.media.length > 0
                ? item.media
                : (item.images ?? []).map((url) => ({ url, type: "image" as const }));
            const cover = mediaList[0];

            return (
              <AnimatedSection key={item.title} delay={(i % 3) * 0.08}>
                <button
                  type="button"
                  id={`portfolio-${item.id}`}
                  onClick={() => setActiveItem(item)}
                  className="focus-ring group relative block w-full scroll-mt-28 overflow-hidden rounded-2xl text-left"
                  style={{ aspectRatio: "16/10" }}
                >
                  {/* Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-lore-dark/80 via-lore-night-surface to-lore-darker" />

                  {/* Subtle border */}
                  <div className="absolute inset-0 rounded-2xl ring-1 ring-white/8" />

                  {cover ? (
                    cover.type === "video" ? (
                      <>
                        <video
                          src={cover.url}
                          muted
                          playsInline
                          loop
                          autoPlay
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {/* Badge vidéo */}
                        <div className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-black/60 px-2 py-1">
                          <Play className="h-3 w-3 fill-white text-white" />
                          <span className="text-[10px] font-semibold text-white">Vidéo</span>
                        </div>
                      </>
                    ) : (
                      <Image
                        src={cover.url}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <FolderKanban
                        className="h-8 w-8 text-white/15 transition-transform duration-500 group-hover:scale-90"
                        strokeWidth={1.25}
                      />
                    </div>
                  )}

                  {/* Always-visible title bar */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lore-darker/95 via-lore-darker/60 to-transparent px-4 pb-3.5 pt-8">
                    <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-lore-gold/80">
                      {item.category}
                    </p>
                    <div className="mt-0.5 flex items-center justify-between gap-2">
                      <h3 className="font-display text-sm font-bold leading-tight text-white">
                        {item.title}
                      </h3>
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-lore-gold text-lore-darker opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <ArrowUpRight className="h-3 w-3" />
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
