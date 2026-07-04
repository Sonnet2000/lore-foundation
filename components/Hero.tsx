"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Heart, Users, Star, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import Sparkle from "@/components/ui/Sparkle";
import CurveDivider from "@/components/ui/CurveDivider";
import Globe3D from "@/components/ui/Globe3D";
import { stats, siteInfo, testimonials } from "@/lib/data";

type MediaItem = { url: string; type: "image" | "video" };

// Média statik pou fallback si pa gen done nan DB
const FALLBACK: MediaItem = { url: "/hero-portrait.jpg", type: "image" };

const heroQuote = testimonials[0];

export default function Hero() {
  const [heroMedia, setHeroMedia] = useState<MediaItem>(FALLBACK);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((data) => {
        const first: MediaItem | undefined = data?.media?.[0];
        if (first?.url) setHeroMedia(first);
      })
      .catch(() => {/* garde fallback */});
  }, []);

  return (
    <section
      id="accueil"
      className="relative overflow-hidden pb-24 pt-32 sm:pb-28 sm:pt-40 lg:pb-36"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(4,60,158,0.18) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(24,166,255,0.15) 0%, transparent 40%), linear-gradient(135deg, #031a4a 0%, #043C9E 50%, #0a5bc4 100%)",
      }}
    >
      {/* Circuit grid overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Ambient glow */}
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-blue-400/8 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-sky-400/10 blur-3xl pointer-events-none" />

      <Sparkle className="absolute left-[8%] top-28 hidden sm:block" size={28} />
      <Sparkle className="absolute right-[12%] top-44 hidden sm:block" size={20} />
      <Sparkle className="absolute left-[42%] top-16 hidden lg:block" size={16} />

      {/* Glòb 3D — reprezante enpak global Loré Foundation, an background dous */}
      <Globe3D className="absolute -right-[18%] top-1/2 hidden h-[130%] w-[70%] -translate-y-1/2 md:block lg:-right-[10%] lg:h-[150%] lg:w-[60%]" />

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12">
        {/* Colonne gauche */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-6 text-left"
        >
          {/* Badge mission */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card flex items-center gap-3 rounded-full px-4 py-2"
          >
            <span className="glow-dot" />
            <span className="text-xs font-medium text-white/80 sm:text-sm">
              🇭🇹 Ensemble, bâtissons un avenir meilleur pour Haïti
            </span>
          </motion.div>

          {/* Accroche */}
          <span className="font-display text-xs font-bold uppercase tracking-[0.35em] text-blue-200/90">
            {siteInfo.slogan}
          </span>

          {/* H1 */}
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem]">
            Former.{" "}
            <span className="text-gradient-gold">Inspirer.</span>{" "}
            Transformer.
          </h1>

          {/* Description */}
          <p className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            Loré Foundation est une organisation engagée dans le développement
            de l&apos;éducation, de la technologie et du leadership pour
            construire un avenir meilleur pour Haïti.
          </p>

          {/* CTAs — grouper an pil pou yon lè plis konpak */}
          <div className="relative flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            {/* Ti flèch dekoratif ki pwente sou bouton prensipal la */}
            <svg
              className="pointer-events-none absolute -left-8 -top-9 hidden h-10 w-14 text-lore-gold/70 sm:block"
              viewBox="0 0 60 40"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M4 4C18 6 34 10 44 22C48 27 50 31 51 35"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="1 7"
              />
              <path d="M45 30L52 36L56 28" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <a
              href="/partenaire"
              className="btn-gold focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105"
            >
              Rejoindre notre mission
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="/partenaire"
              className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
            >
              <Heart className="h-4 w-4" />
              Devenir partenaire
            </a>
            <a
              href="/don"
              className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-7 py-3.5 text-sm font-semibold text-blue-200 backdrop-blur-sm transition-all hover:bg-blue-400/20"
            >
              <Heart className="h-4 w-4" />
              Faire un don
            </a>
          </div>

          {/* Stats */}
          <div className="mt-4 grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                className="glass-card rounded-2xl p-4 card-lift"
              >
                <stat.icon className="mb-2 h-4 w-4 text-blue-200" strokeWidth={2} />
                <p className="font-display text-xl font-bold text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Colonne droite — photo dan yon blòk koulè, ak kat ki flote */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* Gwo sèk koulè lò dèyè foto a — echo idantite mak la */}
          <div
            className="absolute left-1/2 top-1/2 h-[92%] w-[92%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-90"
            style={{ background: "radial-gradient(circle at 35% 30%, #f2d272, #d4af37 60%, #b8892a 100%)" }}
            aria-hidden="true"
          />
          <div
            className="absolute -bottom-4 -right-2 h-24 w-24 rounded-full opacity-40 blur-sm sm:h-32 sm:w-32"
            style={{ background: "radial-gradient(circle, #18A6FF, transparent 70%)" }}
            aria-hidden="true"
          />

          <div className="relative mx-auto aspect-square w-[86%]">
            <div className="relative h-full w-full overflow-hidden rounded-full border-4 border-white/20 shadow-premium">
              {heroMedia.type === "video" ? (
                <video
                  src={heroMedia.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover object-top"
                />
              ) : (
                <Image
                  src={heroMedia.url}
                  alt="Équipe Loré Foundation"
                  fill
                  priority
                  className="object-cover object-top"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#031a4a]/30 via-transparent to-transparent" />
            </div>

            {/* Kat sitasyon k ap flote — anwo agoch */}
            <motion.div
              className="absolute -left-6 top-2 hidden max-w-[190px] rounded-2xl bg-white/95 p-3.5 shadow-gold sm:block md:-left-12 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex gap-0.5 text-lore-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-current" />
                ))}
              </div>
              <p className="mt-1.5 line-clamp-2 text-[11px] leading-snug text-lore-ink/70 dark:text-white/70">
                &ldquo;{heroQuote.quote}&rdquo;
              </p>
              <p className="mt-1.5 font-display text-[11px] font-bold text-lore-ink dark:text-white">
                {heroQuote.name}
              </p>
            </motion.div>

            {/* Badge flottant — ba agoch, estatistik prensipal */}
            <motion.div
              className="absolute -bottom-2 -left-4 hidden rounded-2xl bg-lore-dark/95 px-4 py-3 shadow-premium ring-1 ring-blue-400/20 sm:flex sm:items-center sm:gap-3 md:-left-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">500+ jeunes formés</p>
                <p className="text-xs text-white/50">depuis notre création</p>
              </div>
            </motion.div>

            {/* Badge flottant — anwo adwat, kominote a */}
            <motion.div
              className="absolute -right-4 bottom-16 hidden rounded-2xl bg-white/95 px-4 py-3 shadow-gold sm:flex sm:items-center sm:gap-3 md:-right-10 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-lore-ink dark:text-white">
                  Impact communautaire
                </p>
                <p className="text-xs text-lore-ink/50 dark:text-white/50">Cap-Haïtien & au-delà</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <CurveDivider className="absolute bottom-0 left-0" />
    </section>
  );
}
