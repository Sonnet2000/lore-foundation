"use client";

import Image from "next/image";

type MarqueeSponsor = {
  id: string;
  name: string;
  logo_url: string | null;
  website_url: string | null;
};

export default function SponsorsMarquee({ sponsors }: { sponsors: MarqueeSponsor[] }) {
  const withLogo = sponsors.filter((s) => s.logo_url);
  if (withLogo.length === 0) return null;

  // Doubled list so the CSS animation (-50%) loops seamlessly, san koupi.
  const loop = [...withLogo, ...withLogo];

  return (
    <div className="group relative mb-14 overflow-hidden rounded-3xl border border-lore-dark/5 bg-white py-8 dark:border-white/5 dark:bg-lore-night-surface">
      {/* Fondu sur les bords pour un effet de défilement propre */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent dark:from-lore-night-surface sm:w-28" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent dark:from-lore-night-surface sm:w-28" />

      <div className="flex w-max animate-sponsors-marquee items-center gap-14 group-hover:[animation-play-state:paused] sm:gap-20">
        {loop.map((s, i) => {
          const logo = (
            <Image
              src={s.logo_url as string}
              alt={s.name}
              width={140}
              height={56}
              sizes="140px"
              className="h-10 w-auto object-contain opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0 sm:h-14"
            />
          );

          return (
            <div key={`${s.id}-${i}`} className="flex shrink-0 items-center" title={s.name}>
              {s.website_url ? (
                <a href={s.website_url} target="_blank" rel="noopener noreferrer" aria-label={s.name}>
                  {logo}
                </a>
              ) : (
                logo
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
