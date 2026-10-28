import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { BRAND, REGISTER_URL } from "@/lib/brand";
import { getHeroImages } from "@/lib/hero-media";

export default async function Hero() {
  const images = await getHeroImages();
  const photo = images[0];

  return (
    <section id="accueil" aria-labelledby="hero-title" className="bg-notebook relative overflow-hidden pt-16">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-24">
        <div className="sm:pl-10 lg:pl-12">
          <p className="lore-rise inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-1.5 text-sm font-semibold text-royal-700">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-gold" />
            {BRAND.descriptor}
          </p>
          <h1
            id="hero-title"
            className="lore-rise lore-rise-2 mt-6 max-w-3xl font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-navy sm:text-6xl lg:text-7xl"
          >
            Le savoir aujourd’hui.
            <br />
            L’excellence pour demain.
          </h1>
          <p className="lore-rise lore-rise-3 mt-6 max-w-xl text-lg leading-relaxed text-navy/75 sm:text-xl">
            Découvrez Loré Fondation, un espace de formation, d’innovation et de développement des compétences au
            service de l’avenir.
          </p>
          <div className="lore-rise lore-rise-3 mt-9 flex flex-col gap-3 sm:flex-row">
            <a
              href="/#formations"
              className="btn-royal focus-royal inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
            >
              Découvrir nos formations
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </a>
            <a
              href={REGISTER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-navy focus-royal inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold"
            >
              S’inscrire maintenant
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
            </a>
          </div>
        </div>

        <div className="lore-rise lore-rise-2 relative mx-auto w-full max-w-md lg:max-w-none">
          <span aria-hidden="true" className="absolute -left-3 -top-3 h-24 w-24 border-l-4 border-t-4 border-gold" />
          {photo ? (
            <div className="relative aspect-[4/5] overflow-hidden rounded-br-[4rem] bg-sky-100">
              <Image
                src={photo.url}
                alt="Photographie de la communauté Loré Fondation"
                fill
                priority
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="relative flex aspect-[4/5] flex-col justify-between overflow-hidden rounded-br-[4rem] bg-navy p-8 text-white sm:p-10">
              <div aria-hidden="true" className="bg-grid-sky absolute inset-0 opacity-[0.12]" />
              <span aria-hidden="true" className="absolute -right-16 -top-16 h-56 w-56 rounded-full border-[28px] border-royal/60" />
              <div className="relative">
                <span className="relative block h-20 w-20 overflow-hidden rounded-full bg-white">
                  <Image src="/logo.png" alt="Logo de Loré Fondation" fill sizes="80px" className="object-contain p-2" priority />
                </span>
              </div>
              <div className="relative">
                <p className="font-display text-3xl font-semibold italic leading-tight sm:text-4xl">{BRAND.mottos[0]}</p>
                <span aria-hidden="true" className="mt-5 block h-0.5 w-16 bg-gold" />
                <p className="mt-5 text-lg text-white/85">{BRAND.mottos[1]}</p>
                <p className="mt-8 text-sm font-medium text-white/60">{BRAND.tagline}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
