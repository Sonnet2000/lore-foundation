"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { PortfolioItem } from "@/lib/data";

type PortfolioGalleryProps = {
  item: PortfolioItem | null;
  onClose: () => void;
};

export default function PortfolioGallery({ item, onClose }: PortfolioGalleryProps) {
  const images = item?.images ?? [];
  const [activeIndex, setActiveIndex] = useState(0);

  // Reset to the first image whenever a new project is opened.
  useEffect(() => {
    setActiveIndex(0);
  }, [item]);

  const goTo = (next: number) => {
    if (images.length === 0) return;
    setActiveIndex((next + images.length) % images.length);
  };

  return (
    <Modal open={item !== null} onClose={onClose}>
      {item && (
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-4xl bg-gradient-to-br from-lore-emerald/15 via-lore-cream to-lore-dark/10 dark:from-lore-emerald/10 dark:via-lore-night-surface dark:to-lore-dark/20">
            {images.length > 0 ? (
              <Image
                src={images[activeIndex]}
                alt={`${item.title} — image ${activeIndex + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-lore-dark/30 dark:text-white/25">
                <ImageOff className="h-12 w-12" strokeWidth={1.5} />
                <p className="text-sm font-medium">Photos à venir</p>
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Image précédente"
                  className="focus-ring absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lore-ink shadow-card transition-colors hover:bg-white dark:bg-lore-night/80 dark:text-white dark:hover:bg-lore-night"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Image suivante"
                  className="focus-ring absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lore-ink shadow-card transition-colors hover:bg-white dark:bg-lore-night/80 dark:text-white dark:hover:bg-lore-night"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      aria-label={`Voir l'image ${i + 1}`}
                      className={`h-2 rounded-full transition-all ${
                        i === activeIndex ? "w-6 bg-lore-gold" : "w-2 bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

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

            {images.length > 1 && (
              <div className="mt-6 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {images.map((src, i) => (
                  <button
                    key={src + i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Miniature ${i + 1}`}
                    className={`focus-ring relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                      i === activeIndex
                        ? "ring-lore-gold"
                        : "ring-transparent hover:ring-lore-emerald/50"
                    }`}
                  >
                    <Image src={src} alt="" fill className="object-cover" unoptimized />
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
