"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Megaphone, ArrowUpRight } from "lucide-react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

const ADS_CLIENT = "ca-pub-7566847755875100";

type AdUnitProps = {
  /** data-ad-slot ID a soti nan Google AdSense (ex: "6310810361") */
  slot: string;
  /** Fòma anons lan — "auto" pou responsive (default), oswa "fluid", "rectangle", etc. */
  format?: string;
  /** Si anons lan dwe adapte lajè ekran an (recommande pou "auto") */
  fullWidthResponsive?: boolean;
  className?: string;
};

/**
 * Yon inite anons Google AdSense manyèl (pa konfonn ak "Auto ads" ki deja
 * aktive globalman nan app/layout.tsx). Reyitilizab: <AdUnit slot="123..." />
 *
 * Kad la toujou stilize ak marque a (bòdi, background, etikèt "Publicité"),
 * kit anons Google an ranpli espas la kit li pa ranpli l. Si Google pa voye
 * okenn anons (blocked, pa gen inventaire, elatriye), yo montre yon "kat rezèv"
 * ki klikab e ki envite moun vin sponsor — jan sa a espas la pa janm rete blan.
 */
export default function AdUnit({ slot, format = "auto", fullWidthResponsive = true, className = "" }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);
  const [filled, setFilled] = useState<boolean | null>(null);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      setFilled(false);
    }

    const timer = window.setTimeout(() => {
      const height = insRef.current?.offsetHeight ?? 0;
      setFilled(height > 10);
    }, 1800);

    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div className={`mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12 ${className}`}>
      <div className="relative overflow-hidden rounded-4xl border border-lore-dark/5 bg-lore-cream/60 p-6 shadow-card dark:border-white/5 dark:bg-lore-night-surface sm:p-8">
        {/* Decorative glow accents to match the brand's gradient language */}
        <div className="pointer-events-none absolute -left-10 -top-16 h-40 w-40 rounded-full bg-lore-blue/10 blur-3xl dark:bg-lore-blue/10" />
        <div className="pointer-events-none absolute -bottom-16 -right-10 h-40 w-40 rounded-full bg-lore-gold/15 blur-3xl" />

        <div className="relative mb-5 flex items-center justify-center gap-2">
          <Megaphone className="h-3.5 w-3.5 text-lore-gold-dark dark:text-lore-gold-light" />
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-lore-ink/40 dark:text-white/40">
            Publicité
          </span>
        </div>

        <div className="relative min-h-[100px]">
          <ins
            ref={insRef}
            className="adsbygoogle"
            style={{ display: "block" }}
            data-ad-client={ADS_CLIENT}
            data-ad-slot={slot}
            data-ad-format={format}
            data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
          />

          {filled === false && (
            <Link
              href="/#sponsors"
              className="card-lift group flex flex-col items-center gap-3 rounded-3xl border border-dashed border-lore-gold-dark/30 bg-white/70 px-6 py-10 text-center dark:border-lore-gold-light/20 dark:bg-white/[0.03]"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-lore-gold-gradient text-lore-dark shadow-gold">
                <Megaphone className="h-5 w-5" />
              </span>
              <p className="font-display text-base font-bold text-lore-ink dark:text-white">
                Cet espace publicitaire est disponible
              </p>
              <p className="max-w-md text-sm text-lore-ink/60 dark:text-white/60">
                Faites connaître votre entreprise ou vos services auprès de nos étudiants, clients et partenaires à travers Haïti.
              </p>
              <span className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-lore-gold-dark transition-transform group-hover:translate-x-0.5 dark:text-lore-gold-light">
                Réserver cet espace
                <ArrowUpRight className="h-3.5 w-3.5" />
              </span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
