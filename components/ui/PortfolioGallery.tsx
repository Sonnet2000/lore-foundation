"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff, Play } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { PortfolioItem, MediaItem } from "@/lib/data";

type PortfolioGalleryProps = {
  item: PortfolioItem | null;
  onClose: () => void;
};

export default function PortfolioGallery({ item, onClose }: PortfolioGalleryProps) {
  // Konsolide media: prefere media[], sinon konvèti images[] an MediaItem[]
  const mediaList: MediaItem[] =
    Array.isArray(item?.media) && item!.media!.length > 0
      ? item!.media!
      : (item?.images ?? []).map((url) => ({ url, type: "image" as const }));

  const [activeIndex, setActiveIndex] = useState(0);

  // Reset chak fwa yon nouvo pwojè louvri
  useEffect(() => {
    setActiveIndex(0);
  }, [item]);

  const goTo = (next: number) => {
    if (mediaList.length === 0) return;
    setActiveIndex((next + mediaList.length) % mediaList.length);
  };

  const current = mediaList[activeIndex];

  return (
    <Modal open={item !== null} onClose={onClose}>
      {item && (
        <div>
          {/* ── Zone média principale ── */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-4xl bg-gradient-to-br from-lore-emerald/15 via-lore-cream to-lore-dark/10 dark:from-lore-emerald/10 dark:via-lore-night-surface dark:to-lore-dark/20">
            {mediaList.length > 0 ? (
              current.type === "video" ? (
                <video
                  key={current.url}
                  src={current.url}
                  controls
                  autoPlay
                  playsInline
                  className="h-full w-full object-contain bg-black"
                />
              ) : (
                <Image
                  src={current.url}
                  alt={`${item.title} — média ${activeIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-lore-dark/30 dark:text-white/25">
                <ImageOff className="h-12 w-12" strokeWidth={1.5} />
                <p className="text-sm font-medium">Médias à venir</p>
              </div>
            )}

            {/* Bouton navigasyon */}
            {mediaList.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Média précédent"
                  className="focus-ring absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lore-ink shadow-card transition-colors hover:bg-white dark:bg-lore-night/80 dark:text-white dark:hover:bg-lore-night"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Média suivant"
                  className="focus-ring absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lore-ink shadow-card transition-colors hover:bg-white dark:bg-lore-night/80 dark:text-white dark:hover:bg-lore-night"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                {/* Pon navigasyon anba */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {mediaList.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Voir le média ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === activeIndex ? "w-6 bg-lore-gold" : "w-2 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

          {/* ── Infòmasyon pwojè ── */}
          <div className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-lore-emerald dark:text-lore-emerald-light">
              {item.category}
            </p>
            <h3 className="mt-1 font-display text-2xl font-bold text-lore-ink sm:text-3xl dark:text-white">
              {item.title}
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-lore-ink/70 sm:text-base dark:text-white/70">
              {item.description}
            </p>

            {/* ── Miniati yo ── */}
            {mediaList.length > 1 && (
              <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {mediaList.map((m, i) => (
                  <button
                    key={m.url + i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Miniature ${i + 1}`}
                    className={`focus-ring relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                      i === activeIndex
                        ? "ring-lore-gold"
                        : "ring-transparent hover:ring-lore-emerald/50"
                    }`}
                  >
                    {m.type === "video" ? (
                      <>
                        <video
                          src={m.url}
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                          <Play className="h-4 w-4 fill-white text-white" />
                        </div>
                      </>
                    ) : (
                      <Image src={m.url} alt="" fill sizes="80px" className="object-cover" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}
