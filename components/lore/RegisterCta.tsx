import { ArrowUpRight } from "lucide-react";
import { BRAND, REGISTER_URL } from "@/lib/brand";

export default function RegisterCta() {
  return (
    <section aria-label="Inscription" className="bg-navy px-5 py-16 sm:px-8 lg:px-12">
      <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 border-l-4 border-gold pl-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-3xl font-bold text-white sm:text-4xl">Rejoignez {BRAND.name}</p>
          <p className="mt-2 max-w-lg text-white/75">{BRAND.descriptor}. {BRAND.tagline}.</p>
        </div>
        <a
          href={REGISTER_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="focus-royal inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-navy transition-colors hover:bg-gold-300"
        >
          S’inscrire en ligne
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
        </a>
      </div>
    </section>
  );
}
