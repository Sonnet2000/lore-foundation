"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Star } from "lucide-react";
import Sparkle from "@/components/ui/Sparkle";
import CurveDivider from "@/components/ui/CurveDivider";
import { stats, siteInfo } from "@/lib/data";

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden pb-24 pt-32 sm:pb-28 sm:pt-40 lg:pb-36"
      style={{
        background:
          "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(15,152,255,0.15) 0%, transparent 40%), linear-gradient(135deg, #052238 0%, #0A3D62 45%, #0c5a96 100%)",
      }}
    >
      {/* Circuit grid overlay */}
      <div className="hero-grid absolute inset-0 pointer-events-none" />

      {/* Ambient glow blobs */}
      <div className="absolute -left-32 top-1/3 h-96 w-96 rounded-full bg-lore-gold/8 blur-3xl pointer-events-none" />
      <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-lore-emerald/10 blur-3xl pointer-events-none" />

      <Sparkle className="absolute left-[8%] top-28 hidden sm:block" size={28} />
      <Sparkle className="absolute right-[12%] top-44 hidden sm:block" size={20} />
      <Sparkle className="absolute left-[42%] top-16 hidden lg:block" size={16} />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12">
        {/* Left column */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-start gap-6 text-left"
        >
          {/* Rating badge */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="glass-card flex items-center gap-3 rounded-full px-4 py-2"
          >
            <span className="glow-dot" />
            <div className="flex items-center gap-1 text-lore-gold-light">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-current" />
              ))}
            </div>
            <span className="text-xs font-medium text-white/80 sm:text-sm">
              Noté 5.0 par nos clients en Haïti
            </span>
          </motion.div>

          {/* Eyebrow */}
          <span className="font-display text-xs font-bold uppercase tracking-[0.35em] text-lore-gold-light/90">
            {siteInfo.slogan}
          </span>

          {/* H1 */}
          <h1 className="font-display text-[2.6rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-white sm:text-5xl md:text-6xl lg:text-[3.5rem] xl:text-[4rem]">
            Transformez vos idées en{" "}
            <span className="text-gradient-gold">solutions numériques</span>
          </h1>

          {/* Description */}
          <p className="max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
            Loré Foundation accompagne entreprises, créateurs et institutions
            en Haïti avec des services digitaux complets — votre partenaire
            en innovation numérique.
          </p>

          {/* CTAs */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#contact"
              className="btn-gold focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105"
            >
              Démarrer un projet
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
            >
              Découvrir nos services
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
                <stat.icon className="mb-2 h-4 w-4 text-lore-gold-light" strokeWidth={2} />
                <p className="font-display text-xl font-bold text-white sm:text-2xl">
                  {stat.value}
                </p>
                <p className="text-xs text-white/50 sm:text-sm">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          {/* Golden ring frame */}
          <div className="absolute inset-0 -m-3 rounded-3xl border border-lore-gold/15 pointer-events-none" />
          <div className="absolute inset-0 -m-6 rounded-3xl border border-lore-gold/7 pointer-events-none" />

          <div className="relative aspect-[4/5] w-full">
            <div className="relative h-full w-full overflow-hidden tab-corner-alt rounded-2xl border border-white/10 shadow-premium">
              <Image
                src="/hero-portrait.jpg"
                alt="Membre de l'équipe Loré Foundation au travail"
                fill
                priority
                className="object-cover"
              />
              {/* Image overlay for premium feel */}
              <div className="absolute inset-0 bg-gradient-to-t from-lore-darker/30 via-transparent to-transparent" />
            </div>

            {/* Floating badge — top left */}
            <motion.div
              className="absolute -left-4 top-8 hidden rounded-2xl bg-white/95 px-4 py-3 shadow-gold sm:flex sm:items-center sm:gap-3 md:-left-8 dark:bg-lore-night-surface dark:ring-1 dark:ring-lore-gold/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lore-gold/15 text-lore-gold">
                <Star className="h-5 w-5 fill-current" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-lore-ink dark:text-white">
                  98% de satisfaction
                </p>
                <p className="text-xs text-lore-ink/50 dark:text-white/50">Sur 500+ projets</p>
              </div>
            </motion.div>

            {/* Floating badge — bottom right */}
            <motion.div
              className="absolute -right-4 bottom-10 hidden rounded-2xl bg-lore-dark/95 px-4 py-3 shadow-premium ring-1 ring-lore-emerald/20 sm:flex sm:items-center sm:gap-3 md:-right-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lore-emerald/15 text-lore-emerald-light">
                <Sparkle size={18} />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">
                  Innovation continue
                </p>
                <p className="text-xs text-white/50">Mise à jour chaque mois</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <CurveDivider className="absolute bottom-0 left-0" />
    </section>
  );
}
