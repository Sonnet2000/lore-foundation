"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// Three.js sèlman ka roule nan navigatè a (li bezwen `window`),
// kidonk nou chaje `Globe3DScene` san SSR pou evite kraze bild sèvè a.
const Globe3DScene = dynamic(() => import("./Globe3DScene"), {
  ssr: false,
  loading: () => null,
});

export default function Globe3D({ className = "" }: { className?: string }) {
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setMounted(true);
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none select-none opacity-0 animate-[fadeUp_1.4s_ease-out_0.3s_forwards] ${className}`}
    >
      <Globe3DScene reducedMotion={reducedMotion} />
    </div>
  );
}
