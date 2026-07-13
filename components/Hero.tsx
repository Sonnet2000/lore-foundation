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

type HeroContent = {
  badgeText: string;
  headlineBefore: string;
  headlineHighlight: string;
  headlineAfter: string;
  description: string;
  mobileBadgeText: string;
  floatingBadge1Title: string;
  floatingBadge1Subtitle: string;
  floatingBadge2Title: string;
  floatingBadge2Subtitle: string;
};

// Kontni ki deja la a — sèvi kòm fallback si admin pa ko modifye anyen nan panel la
const DEFAULT_CONTENT: HeroContent = {
  badgeText: "🇭🇹 Formation professionnelle & services numériques à Cap-Haïtien",
  headlineBefore: "Former.",
  headlineHighlight: "Créer.",
  headlineAfter: "Réussir.",
  description:
    "Loré Foundation forme les talents de demain et accompagne les entreprises haïtiennes avec des services numériques professionnels — développement web, design graphique et bien plus.",
  mobileBadgeText: "500+ jeunes formés · 80+ projets livrés",
  floatingBadge1Title: "500+ jeunes formés",
  floatingBadge1Subtitle: "depuis notre création",
  floatingBadge2Title: "Formation & services pro",
  floatingBadge2Subtitle: "Cap-Haïtien & au-delà",
};

export default function Hero() {
  const [heroMedia, setHeroMedia] = useState<MediaItem>(FALLBACK);
  const [content, setContent] = useState<HeroContent>(DEFAULT_CONTENT);

  useEffect(() => {
    fetch("/api/admin/hero")
      .then((r) => r.json())
      .then((data) => {
        const first: MediaItem | undefined = data?.media?.[0];
        if (first?.url) setHeroMedia(first);

        setContent((prev) => ({
          badgeText: data?.badgeText || prev.badgeText,
          headlineBefore: data?.headlineBefore || prev.headlineBefore,
          headlineHighlight: data?.headlineHighlight || prev.headlineHighlight,
          headlineAfter: data?.headlineAfter || prev.headlineAfter,
          description: data?.description || prev.description,
          mobileBadgeText: data?.mobileBadgeText || prev.mobileBadgeText,
          floatingBadge1Title: data?.floatingBadge1Title || prev.floatingBadge1Title,
          floatingBadge1Subtitle: data?.floatingBadge1Subtitle || prev.floatingBadge1Subtitle,
          floatingBadge2Title: data?.floatingBadge2Title || prev.floatingBadge2Title,
          floatingBadge2Subtitle: data?.floatingBadge2Subtitle || prev.floatingBadge2Subtitle,
        }));
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

      <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12">
        {/* Colonne gauche */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="order-2 flex flex-col items-start gap-6 text-left lg:order-none"
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
              {content.badgeText}
            </span>
          </motion.div>

          {/* Accroche */}
          <span className="font-display text-xs font-bold uppercase tracking-[0.35em] text-blue-200/90">
            {siteInfo.slogan}
          </span>

          {/* H1 */}
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem]">
            {content.headlineBefore}{" "}
            <span className="text-gradient-gold">{content.headlineHighlight}</span>{" "}
            {content.headlineAfter}
          </h1>

          {/* Description */}
          <p className="max-w-lg text-base leading-relaxed text-white/70 sm:text-lg">
            {content.description}
          </p>

          {/* CTAs — yon aksyon prensipal byen mete an valè, 2 segondè kòt kòt */}
          <div className="relative flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center">
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
              href="/ecole"
              className="btn-gold focus-ring group inline-flex w-full items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105 sm:w-auto"
            >
              Découvrir l&apos;École
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <div className="grid w-full grid-cols-2 gap-3 sm:contents">
              <a
                href="/#services"
                className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 sm:px-7 sm:py-3.5"
              >
                Nos services
              </a>
              <a
                href="/partenaire"
                className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-5 py-3 text-sm font-semibold text-blue-200 backdrop-blur-sm transition-all hover:bg-blue-400/20 sm:px-7 sm:py-3.5"
              >
                <Heart className="h-4 w-4 shrink-0" />
                <span className="truncate">Devenir partenaire</span>
              </a>
            </div>
          </div>

          {/* Séparateur + etikèt — bay chif yo yon kontèks */}
          <div className="mt-3 flex w-full items-center gap-3">
            <span className="h-px flex-1 bg-gradient-to-r from-lore-gold/50 to-transparent" />
            <span className="font-display text-[10px] font-bold uppercase tracking-[0.25em] text-white/40">
              Notre impact
            </span>
          </div>

          {/* Stats */}
          <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 + i * 0.08 }}
                className="gold-border-top glass-card overflow-hidden rounded-2xl p-4 card-lift"
              >
                <stat.icon className="mb-2 h-4 w-4 text-lore-gold-light" strokeWidth={2} />
                <p className="font-display text-xl font-bold text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Colonne droite — photo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="order-1 relative mx-auto w-full max-w-sm lg:order-none lg:max-w-none"
        >
          {/* Ti triyang lò — menm siyati "ledger" ak rès sit la */}
          <span
            className="absolute -right-2 -top-2 h-11 w-11 rotate-45 rounded-sm sm:h-14 sm:w-14"
            style={{
              background: "linear-gradient(135deg, #f2d272, #d4af37)",
              boxShadow: "-3px 3px 10px -2px rgba(0,0,0,0.4), inset 1px 1px 0 rgba(255,255,255,0.4)",
            }}
            aria-hidden="true"
          />

          <div className="relative aspect-[4/5] w-full">
            <div className="tab-corner relative h-full w-full overflow-hidden shadow-premium">
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
              <div className="absolute inset-0 bg-gradient-to-t from-[#031a4a]/70 via-[#031a4a]/5 to-transparent" />

              {/* Badge kontni — vèsyon mobile, rete anndan foto a pou l pa deborde ekran an */}
              <div className="absolute inset-x-3 bottom-3 flex items-center gap-2.5 rounded-2xl bg-white/10 px-3.5 py-2.5 backdrop-blur-md ring-1 ring-white/15 sm:hidden">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lore-gold/20 text-lore-gold-light">
                  <GraduationCap className="h-4 w-4" />
                </span>
                <p className="text-xs font-semibold leading-snug text-white">
                  {content.mobileBadgeText}
                </p>
              </div>
            </div>

            {/* Kat sitasyon k ap flote — anwo agoch */}
            <motion.div
              className="absolute -left-6 top-8 hidden max-w-[190px] rounded-2xl bg-white/95 p-3.5 shadow-gold sm:block md:-left-12 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
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
              className="absolute -bottom-4 -left-4 hidden rounded-2xl bg-lore-dark/95 px-4 py-3 shadow-premium ring-1 ring-blue-400/20 sm:flex sm:items-center sm:gap-3 md:-left-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                <GraduationCap className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">{content.floatingBadge1Title}</p>
                <p className="text-xs text-white/50">{content.floatingBadge1Subtitle}</p>
              </div>
            </motion.div>

            {/* Badge flottant — anwo adwat, kominote a */}
            <motion.div
              className="absolute -right-4 top-10 hidden rounded-2xl bg-white/95 px-4 py-3 shadow-gold sm:flex sm:items-center sm:gap-3 md:-right-10 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-lore-ink dark:text-white">
                  {content.floatingBadge2Title}
                </p>
                <p className="text-xs text-lore-ink/50 dark:text-white/50">{content.floatingBadge2Subtitle}</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <CurveDivider className="absolute bottom-0 left-0" />
    </section>
  );
}
