import Image from "next/image";
import { ArrowUpRight, Megaphone } from "lucide-react";
import { listActiveAds } from "@/lib/ads";

export default async function AdsBanner() {
  const ads = await listActiveAds();
  if (ads.length === 0) return null;

  return (
    <section className="relative px-5 py-14 sm:px-8 lg:px-12 bg-white dark:bg-lore-night overflow-hidden">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-lore-gold-dark dark:text-lore-gold-light" />
          <span className="text-xs font-bold uppercase tracking-[0.25em] text-lore-ink/40 dark:text-white/40">
            Espace Publicitaire
          </span>
        </div>

        <div className="flex gap-5 overflow-x-auto pb-2 snap-x snap-mandatory [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {ads.map((ad) => {
            // Toujou fè kat la klikab: si pa gen link_url ki defini nan panel admin
            // la, voye moun nan sou paj "Soutenir/Sponsors" pou yo ka kontakte nou.
            const href = ad.link_url || "/#sponsors";
            const isExternal = href.startsWith("http");
            const ctaLabel = ad.cta_label || "En savoir plus";

            return (
              <a
                key={ad.id}
                href={href}
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer sponsored" } : {})}
                className="card-lift group relative flex h-full w-[300px] shrink-0 snap-start cursor-pointer flex-col overflow-hidden rounded-3xl border border-lore-dark/5 bg-lore-cream dark:border-white/5 dark:bg-lore-night-card sm:w-[340px]"
              >
                <div className="relative h-44 w-full bg-lore-dark/5 dark:bg-white/5">
                  <Image src={ad.image_url} alt={ad.title} fill className="object-cover transition-transform duration-500 group-hover:scale-105" unoptimized />
                  <span className="absolute right-3 top-3 rounded-full bg-black/50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                    Sponsorisé
                  </span>
                </div>
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display text-base font-bold text-lore-ink dark:text-white">{ad.title}</h3>
                  {ad.description && (
                    <p className="line-clamp-2 text-sm text-lore-ink/60 dark:text-white/60">{ad.description}</p>
                  )}
                  <span className="mt-auto inline-flex w-fit items-center gap-1.5 pt-2 text-sm font-semibold text-lore-gold-dark transition-transform group-hover:translate-x-0.5 dark:text-lore-gold-light">
                    {ctaLabel}
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
