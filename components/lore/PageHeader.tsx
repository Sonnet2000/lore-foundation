import type { ReactNode } from "react";

/** Bandeau d'ouverture des pages intérieures (cahier + titre serif). */
export default function PageHeader({ label, title, children }: { label: string; title: string; children?: ReactNode }) {
  return (
    <section className="bg-notebook border-b border-royal/10 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:px-12">
      <div className="mx-auto max-w-7xl sm:pl-10 lg:pl-12">
        <p className="text-sm font-semibold text-royal">{label}</p>
        <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl">{title}</h1>
        {children && <div className="mt-4 max-w-xl text-lg leading-relaxed text-navy/75">{children}</div>}
      </div>
    </section>
  );
}
