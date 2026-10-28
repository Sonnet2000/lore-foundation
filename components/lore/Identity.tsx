import Image from "next/image";
import { BRAND, FLAG } from "@/lib/brand";
import SectionIntro from "./SectionIntro";
import Reveal from "./Reveal";

/**
 * Identité institutionnelle. Le drapeau officiel est affiché UNIQUEMENT s'il a été fourni
 * (FLAG.available) et jamais déformé : ratio d'origine conservé avec `width`/`height` réels.
 */
export default function Identity() {
  return (
    <section id="identite" aria-labelledby="identite-title" className="bg-ivory-200 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          {FLAG.available ? (
            <figure className="mx-auto max-w-sm">
              <div className="border-b-4 border-gold bg-white p-3 shadow-[0_24px_50px_-30px_rgba(11,31,75,0.5)] sm:p-4">
                <Image
                  src={FLAG.src}
                  alt={FLAG.alt}
                  width={FLAG.width}
                  height={FLAG.height}
                  sizes="(min-width: 1024px) 560px, 90vw"
                  className="h-auto w-full"
                />
              </div>
              <figcaption className="mt-3 text-sm text-navy/60">Le drapeau officiel de {BRAND.name}.</figcaption>
            </figure>
          ) : (
            <div className="mx-auto flex max-w-xl flex-col items-center border-b-4 border-gold bg-white px-8 py-14 text-center shadow-[0_24px_50px_-30px_rgba(11,31,75,0.5)]">
              <span className="relative block h-28 w-28">
                <Image src="/logo.png" alt={`Emblème de ${BRAND.name}`} fill sizes="112px" className="object-contain" />
              </span>
              <p className="mt-6 font-display text-3xl font-bold text-navy">{BRAND.name}</p>
              <p className="mt-1 text-navy/60">{BRAND.tagline}</p>
            </div>
          )}
        </Reveal>

        <Reveal>
          <SectionIntro id="identite-title" label="Notre identité" title={`${BRAND.tagline}.`} />
          <blockquote className="mt-8 border-l-4 border-gold pl-6">
            <p className="font-display text-3xl font-semibold italic text-royal-700 sm:text-4xl">{BRAND.mottos[0]}</p>
            <p className="mt-3 text-lg text-navy/80">{BRAND.mottos[1]}</p>
          </blockquote>
        </Reveal>
      </div>
    </section>
  );
}
