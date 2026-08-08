"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Heart, Users, Star, GraduationCap } from "lucide-react";
import { useEffect, useState } from "react";
import CurveDivider from "@/components/ui/CurveDivider";
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
      className="relative flex min-h-[600px] items-center overflow-hidden pb-20 pt-32 sm:min-h-[680px] sm:pb-24 sm:pt-40 lg:min-h-[780px] lg:pb-28"
    >
      {/* Média an background, sou tout lajè seksyon an — menm apwòch ak Pixabay */}
      <div className="absolute inset-0">
        {heroMedia.type === "video" ? (
          <video
            src={heroMedia.url}
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover object-[center_30%] sm:object-center"
          />
        ) : (
          <Image
            src={heroMedia.url}
            alt="Équipe Loré Foundation"
            fill
            priority
            className="object-cover object-[center_30%] sm:object-center"
          />
        )}
        {/* Vwal mobil — tenn inifòm ki fè tèks la lizib kèlkeswa imaj/videyo a */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#031a4a]/92 via-[#031a4a]/80 to-[#031a4a]/92 sm:hidden" />
        {/* Vwal koulè mak la sou desktop/laptop, pou tèks la rete lizib sou nenpòt imaj/videyo */}
        <div
          className="absolute inset-0 hidden sm:block"
          style={{
            background:
              "linear-gradient(100deg, rgba(3,26,74,0.96) 0%, rgba(3,26,74,0.86) 30%, rgba(4,60,158,0.55) 58%, rgba(4,60,158,0.25) 78%, rgba(4,60,158,0.15) 100%)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#031a4a]/90 via-transparent to-[#031a4a]/10" />
        <div className="hero-grid absolute inset-0 pointer-events-none opacity-40" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex max-w-2xl flex-col items-start gap-6 text-left"
        >
          {/* Badge mission */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card flex items-center gap-3 rounded-2xl px-4 py-2.5 sm:rounded-full sm:py-2"
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
          <p className="max-w-lg text-base leading-relaxed text-white/80 sm:text-lg">
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

          {/* Kat rezime — vèsyon mobil, ranplase kat/badj ki flote sou desktop yo */}
          <div className="flex flex-col gap-3 rounded-2xl bg-white/10 p-4 backdrop-blur-md ring-1 ring-white/15 sm:hidden">
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lore-gold/20 text-lore-gold-light">
                <GraduationCap className="h-4.5 w-4.5" />
              </span>
              <p className="text-xs font-semibold leading-snug text-white">
                {content.mobileBadgeText}
              </p>
            </div>
            <div className="flex items-start gap-2 border-t border-white/10 pt-3">
              <div className="mt-0.5 flex shrink-0 gap-0.5 text-lore-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-2.5 w-2.5 fill-current" />
                ))}
              </div>
              <p className="line-clamp-2 text-[11px] leading-snug text-white/70">
                &ldquo;{heroQuote.quote}&rdquo; <span className="font-semibold text-white/90">— {heroQuote.name}</span>
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Kat sitasyon k ap flote — anwo adwat, sou imaj/videyo a */}
      <motion.div
        className="absolute right-6 top-28 z-10 hidden max-w-[190px] rounded-2xl bg-white/95 p-3.5 shadow-gold sm:block lg:right-12 lg:top-36 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
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

      {/* Badj flottant — anba adwat, sou imaj/videyo a */}
      <motion.div
        className="absolute bottom-24 right-6 z-10 hidden rounded-2xl bg-lore-dark/95 px-4 py-3 shadow-premium ring-1 ring-blue-400/20 sm:flex sm:items-center sm:gap-3 lg:right-12"
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

      {/* Badj flottant — anba pi lwen adwat, kominote a */}
      <motion.div
        className="absolute bottom-8 right-6 z-10 hidden rounded-2xl bg-white/95 px-4 py-3 shadow-gold sm:flex sm:items-center sm:gap-3 lg:right-12 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
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

      <CurveDivider className="absolute bottom-0 left-0 z-10" />
    </section>
  );
}
