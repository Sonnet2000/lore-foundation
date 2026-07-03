"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Modal from "@/components/ui/Modal";
import type { SeminarMediaItem } from "@/lib/data";

type SeminarGalleryProps = {
  title: string | null;
  media: SeminarMediaItem[];
  onClose: () => void;
};

export default function SeminarGallery({ title, media, onClose }: SeminarGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [title]);

  const goTo = (next: number) => {
    if (media.length === 0) return;
    setActiveIndex((next + media.length) % media.length);
  };

  const current = media[activeIndex];

  return (
    <Modal open={title !== null} onClose={onClose}>
      {title !== null && (
        <div>
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-4xl bg-gradient-to-br from-lore-emerald/15 via-lore-cream to-lore-dark/10 dark:from-lore-emerald/10 dark:via-lore-night-surface dark:to-lore-dark/20">
            {current ? (
              current.type === "video" ? (
                <video
                  src={current.url}
                  controls
                  playsInline
                  className="h-full w-full object-contain"
                />
              ) : (
                <Image
                  src={current.url}
                  alt={`${title} — image ${activeIndex + 1}`}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover"
                />
              )
            ) : (
              <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-lore-dark/30 dark:text-white/25">
                <ImageOff className="h-12 w-12" strokeWidth={1.5} />
                <p className="text-sm font-medium">Photos à venir</p>
              </div>
            )}

            {media.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex - 1)}
                  aria-label="Précédent"
                  className="focus-ring absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lore-ink shadow-card transition-colors hover:bg-white dark:bg-lore-night/80 dark:text-white"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => goTo(activeIndex + 1)}
                  aria-label="Suivant"
                  className="focus-ring absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-lore-ink shadow-card transition-colors hover:bg-white dark:bg-lore-night/80 dark:text-white"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </>
            )}
          </div>

          <div className="p-6 sm:p-8">
            <h3 className="font-display text-xl font-bold text-lore-ink sm:text-2xl dark:text-white">
              {title}
            </h3>

            {media.length > 1 && (
              <div className="mt-5 grid grid-cols-4 gap-2 sm:grid-cols-6">
                {media.map((item, i) => (
                  <button
                    key={item.url + i}
                    type="button"
                    onClick={() => setActiveIndex(i)}
                    aria-label={`Voir l'élément ${i + 1}`}
                    className={`focus-ring relative aspect-square overflow-hidden rounded-xl ring-2 transition-all ${
                      i === activeIndex
                        ? "ring-lore-gold"
                        : "ring-transparent hover:ring-lore-emerald/50"
                    }`}
                  >
                    {item.type === "video" ? (
                      <video src={item.url} muted playsInline className="h-full w-full object-cover" />
                    ) : (
                      <Image src={item.url} alt="" fill sizes="80px" className="object-cover" />
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
