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

        {/* Panno fonse — menm siyati ak "Nos Programmes" */}
        <AnimatedSection delay={0.1}>
          <div
            className="relative mt-10 overflow-hidden rounded-[28px] px-4 py-8 sm:mt-16 sm:rounded-[36px] sm:px-8 sm:py-14"
            style={{ background: "linear-gradient(160deg, #031a4a 0%, #052a6e 55%, #043C9E 100%)" }}
          >
            <div className="hero-grid absolute inset-0 pointer-events-none opacity-40" aria-hidden="true" />

            <div className="relative grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3">
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
                      className="focus-ring group relative block w-full scroll-mt-28 text-left transition-transform duration-300 hover:-translate-y-1.5"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl shadow-lg sm:aspect-[16/10] sm:rounded-3xl">
                        {/* Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-lore-dark/80 via-lore-night-surface to-lore-darker" />

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
                              <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-black/60 px-1.5 py-0.5 sm:left-3 sm:top-3 sm:px-2 sm:py-1">
                                <Play className="h-2.5 w-2.5 fill-white text-white sm:h-3 sm:w-3" />
                                <span className="text-[8px] font-semibold text-white sm:text-[10px]">Vidéo</span>
                              </div>
                            </>
                          ) : (
                            <Image
                              src={cover.url}
                              alt={item.title}
                              fill
                              sizes="(min-width: 1024px) 33vw, 50vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <FolderKanban
                              className="h-5 w-5 text-white/15 transition-transform duration-500 group-hover:scale-90 sm:h-8 sm:w-8"
                              strokeWidth={1.25}
                            />
                          </div>
                        )}

                        {/* Always-visible title bar */}
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-lore-darker/95 via-lore-darker/60 to-transparent px-2.5 pb-2.5 pt-6 sm:px-4 sm:pb-3.5 sm:pt-8">
                          <p className="font-mono text-[7px] font-bold uppercase tracking-[0.15em] text-lore-gold/80 sm:text-[9px] sm:tracking-[0.2em]">
                            {item.category}
                          </p>
                          <h3 className="mt-0.5 font-display text-[11px] font-bold leading-tight text-white sm:text-sm">
                            {item.title}
                          </h3>
                        </div>
                      </div>

                      {/* Bouton flèch won — chevouche kwen ba-dwat, menm fòm ak Nos Programmes */}
                      <span className="absolute -bottom-3.5 -right-2.5 flex h-9 w-9 items-center justify-center rounded-full bg-lore-gold text-lore-darker shadow-lg ring-4 ring-[#031a4a] transition-transform duration-300 group-hover:scale-110 sm:-bottom-5 sm:-right-3 sm:h-12 sm:w-12 sm:ring-[6px]">
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

      <PortfolioGallery item={activeItem} onClose={() => setActiveItem(null)} />
    </section>
  );
}
