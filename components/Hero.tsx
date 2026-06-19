"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowRight, Heart, Users, Globe } from "lucide-react";
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

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-2 lg:gap-10 lg:px-12">
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

          {/* CTAs */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:flex-wrap">
            <a
              href="#contact"
              className="btn-gold focus-ring group inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform duration-200 hover:scale-105"
            >
              Rejoindre notre mission
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#sponsors"
              className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25"
            >
              <Heart className="h-4 w-4" />
              Devenir partenaire
            </a>
            <a
              href="/paiement"
              className="focus-ring group inline-flex items-center justify-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-7 py-3.5 text-sm font-semibold text-blue-200 backdrop-blur-sm transition-all hover:bg-blue-400/20"
            >
              <Globe className="h-4 w-4" />
              Soutenir nos projets
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

        {/* Colonne droite — photo équipe */}
        <motion.div
          initial={{ opacity: 0, scale: 0.93 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto w-full max-w-md lg:max-w-none"
        >
          <div className="absolute inset-0 -m-3 rounded-3xl border border-blue-300/15 pointer-events-none" />
          <div className="absolute inset-0 -m-6 rounded-3xl border border-blue-300/7 pointer-events-none" />

          <div className="relative aspect-[4/5] w-full">
            <div className="relative h-full w-full overflow-hidden tab-corner-alt rounded-2xl border border-white/10 shadow-premium">
              <Image
                src="/hero-portrait.jpg"
                alt="Équipe Loré Foundation"
                fill
                priority
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#031a4a]/40 via-transparent to-transparent" />
            </div>

            {/* Badge flottant — haut gauche */}
            <motion.div
              className="absolute -left-4 top-8 hidden rounded-2xl bg-white/95 px-4 py-3 shadow-gold sm:flex sm:items-center sm:gap-3 md:-left-8 dark:bg-lore-night-surface dark:ring-1 dark:ring-blue-400/20"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
                <Users className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-lore-ink dark:text-white">
                  500+ jeunes formés
                </p>
                <p className="text-xs text-lore-ink/50 dark:text-white/50">depuis notre création</p>
              </div>
            </motion.div>

            {/* Badge flottant — bas droite */}
            <motion.div
              className="absolute -right-4 bottom-10 hidden rounded-2xl bg-lore-dark/95 px-4 py-3 shadow-premium ring-1 ring-blue-400/20 sm:flex sm:items-center sm:gap-3 md:-right-8"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500/15 text-blue-300">
                <Heart className="h-5 w-5" />
              </span>
              <div>
                <p className="font-display text-sm font-bold text-white">
                  Impact communautaire
                </p>
                <p className="text-xs text-white/50">Cap-Haïtien & au-delà</p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      <CurveDivider className="absolute bottom-0 left-0" />
    </section>
  );
}
