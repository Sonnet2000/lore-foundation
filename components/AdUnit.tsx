"use client";

import { useEffect, useRef } from "react";

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
 */
export default function AdUnit({ slot, format = "auto", fullWidthResponsive = true, className = "" }: AdUnitProps) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    pushed.current = true;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // AdSense pa ka chaje (ex: bloke pa yon adblocker) — pa gen anyen pou fè.
    }
  }, []);

  return (
    <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>
      <p className="mb-2 text-center text-[10px] font-semibold uppercase tracking-[0.25em] text-lore-ink/30 dark:text-white/30">
        Publicité
      </p>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </div>
  );
}
