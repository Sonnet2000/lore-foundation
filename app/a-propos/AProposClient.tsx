"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft, BookOpen, Laptop, Users, Globe,
  Star, Heart, Lightbulb, Zap, Target,
  ArrowRight, HandHeart,
} from "lucide-react";

// ─── Données ──────────────────────────────────────────────────────────────

const DOMAINES = [
  {
    icon: BookOpen,
    title: "Éducation",
    color: "from-blue-500/15 to-blue-400/5 border-blue-400/20",
    iconBg: "bg-blue-500/15 text-blue-500 dark:text-blue-300",
    description:
      "Nous soutenons les initiatives éducatives qui favorisent l'accès au savoir et l'amélioration des conditions d'apprentissage.",
  },
  {
    icon: Laptop,
    title: "Formation numérique",
    color: "from-purple-500/15 to-purple-400/5 border-purple-400/20",
    iconBg: "bg-purple-500/15 text-purple-500 dark:text-purple-300",
    description:
      "Nous développons les compétences numériques des jeunes, des enseignants et des professionnels afin de les préparer aux défis du monde moderne.",
  },
  {
    icon: Users,
    title: "Développement de la jeunesse",
    color: "from-emerald-500/15 to-emerald-400/5 border-emerald-400/20",
    iconBg: "bg-emerald-500/15 text-emerald-500 dark:text-emerald-300",
    description:
      "Nous encourageons le leadership, l'innovation et l'esprit d'initiative chez les jeunes générations.",
  },
  {
    icon: Globe,
    title: "Engagement communautaire",
    color: "from-amber-500/15 to-amber-400/5 border-amber-400/20",
    iconBg: "bg-amber-500/15 text-amber-500 dark:text-amber-300",
    description:
      "Nous mettons en œuvre des actions qui renforcent la solidarité, l'autonomie et le développement durable des communautés.",
  },
];

const VALEURS = [
  {
    icon: Star,
    title: "Excellence",
    description: "Nous recherchons la qualité et l'amélioration continue dans chacune de nos actions.",
    color: "text-yellow-500",
    bg: "bg-yellow-500/10",
  },
  {
    icon: Heart,
    title: "Intégrité",
    description: "Nous agissons avec transparence, responsabilité et respect.",
    color: "text-rose-500",
    bg: "bg-rose-500/10",
  },
  {
    icon: HandHeart,
    title: "Solidarité",
    description: "Nous croyons au pouvoir de l'entraide et de la collaboration.",
    color: "text-lore-blue",
    bg: "bg-lore-blue/10",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "Nous utilisons la créativité et la technologie pour proposer des solutions durables.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: Target,
    title: "Impact",
    description: "Nous concentrons nos efforts sur des actions concrètes capables de produire un changement réel et mesurable.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

// ─── Page ─────────────────────────────────────────────────────────────────

export default function AProposClient() {
  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* ── Header sticky ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">À propos</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>
      </div>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden py-20 md:py-28"
        style={{
          background:
            "radial-gradient(ellipse at 20% 50%, rgba(4,60,158,0.18) 0%, transparent 50%), linear-gradient(135deg, #031a4a 0%, #043C9E 60%, #0a5bc4 100%)",
        }}
      >
        <div className="hero-grid absolute inset-0 pointer-events-none opacity-30" />
        <div className="mx-auto max-w-5xl px-5 text-center relative z-10">
          <motion.div
            initial="hidden" animate="show" variants={FADE_UP}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-center gap-5"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/80 backdrop-blur-sm">
              🇭🇹 Notre histoire
            </span>
            <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl lg:text-6xl leading-tight">
              À propos de<br />
              <span className="text-gradient-gold">Loré Foundation</span>
            </h1>
            <p className="max-w-2xl text-lg text-white/70 leading-relaxed">
              L&apos;excellence au cœur de l&apos;impact.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-16 flex flex-col gap-20">

        {/* ── Notre histoire ──────────────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={FADE_UP} transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2 lg:items-center">
            <div className="flex flex-col gap-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-lore-blue">Notre histoire</span>
                <h2 className="mt-2 font-display text-3xl font-extrabold text-lore-ink dark:text-white leading-tight">
                  Née d&apos;une conviction profonde
                </h2>
              </div>
              <p className="text-lore-ink/70 dark:text-white/70 leading-relaxed">
                Loré Foundation est née d&apos;une conviction profonde : personne ne devrait être privé
                d&apos;opportunités simplement parce qu&apos;il manque de soutien, de ressources ou
                d&apos;accompagnement.
              </p>
              <p className="text-lore-ink/70 dark:text-white/70 leading-relaxed">
                Son fondateur a lui-même connu les défis auxquels font face de nombreuses personnes
                déterminées à avancer malgré les obstacles. Cette expérience a inspiré la création
                d&apos;une organisation dédiée à ceux qui possèdent le potentiel, la volonté et les
                ambitions nécessaires pour réussir, mais qui ne trouvent pas toujours l&apos;aide dont
                ils ont besoin au bon moment.
              </p>
              <p className="text-lore-ink/70 dark:text-white/70 leading-relaxed">
                Aujourd&apos;hui, Loré Foundation transforme cette expérience en action concrète en
                créant des initiatives qui favorisent l&apos;éducation, le développement des compétences,
                l&apos;inclusion numérique et l&apos;autonomisation des communautés.
              </p>
            </div>

            {/* Photo / visual */}
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-lore-dark/5 dark:border-white/5 shadow-xl">
              <Image
                src="/hero-portrait.jpg"
                alt="Équipe Loré Foundation"
                fill
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-lore-blue/30 via-transparent to-transparent" />
              {/* Badge */}
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/95 dark:bg-lore-night-surface/95 px-5 py-3 backdrop-blur-sm">
                <p className="font-display font-bold text-lore-ink dark:text-white text-sm">
                  🇭🇹 Former. Inspirer. Transformer.
                </p>
                <p className="mt-0.5 text-xs text-lore-ink/50 dark:text-white/50">
                  Cap-Haïtien, Nord, Haïti
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* ── Mission & Vision ────────────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={FADE_UP} transition={{ duration: 0.6 }}
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {/* Mission */}
            <div className="rounded-3xl border border-lore-blue/20 bg-gradient-to-br from-lore-blue/10 to-blue-400/5 p-8 dark:border-lore-blue/20 dark:from-lore-blue/15 dark:to-blue-400/5">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-lore-blue/20 text-lore-blue">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-lore-ink dark:text-white mb-3">
                Notre mission
              </h3>
              <p className="text-lore-ink/70 dark:text-white/70 leading-relaxed text-sm md:text-base">
                Accompagner les individus, en particulier les jeunes et les éducateurs, en leur
                offrant des opportunités d&apos;apprentissage, de développement personnel et professionnel
                afin qu&apos;ils puissent révéler leur plein potentiel et contribuer positivement à leur
                communauté.
              </p>
            </div>

            {/* Vision */}
            <div className="rounded-3xl border border-amber-400/20 bg-gradient-to-br from-amber-400/10 to-yellow-300/5 p-8 dark:border-amber-400/20 dark:from-amber-400/15 dark:to-yellow-300/5">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-300">
                <Target className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-extrabold text-lore-ink dark:text-white mb-3">
                Notre vision
              </h3>
              <p className="text-lore-ink/70 dark:text-white/70 leading-relaxed text-sm md:text-base">
                Construire une société où chaque personne motivée a accès aux connaissances, aux
                compétences et aux opportunités nécessaires pour réussir, indépendamment de son
                origine ou de sa situation.
              </p>
            </div>
          </div>
        </motion.section>

        {/* ── Domaines d'action ───────────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={FADE_UP} transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-lore-blue">Ce que nous faisons</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-lore-ink dark:text-white">
              Nos domaines d&apos;action
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {DOMAINES.map((d, i) => (
              <motion.div
                key={d.title}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={FADE_UP} transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`rounded-3xl border bg-gradient-to-br ${d.color} p-6 flex flex-col gap-4`}
              >
                <div className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${d.iconBg}`}>
                  <d.icon className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lore-ink dark:text-white text-lg">{d.title}</h3>
                  <p className="mt-2 text-sm text-lore-ink/65 dark:text-white/65 leading-relaxed">{d.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Nos valeurs ─────────────────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={FADE_UP} transition={{ duration: 0.6 }}
        >
          <div className="mb-8 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-lore-blue">Ce en quoi nous croyons</span>
            <h2 className="mt-2 font-display text-3xl font-extrabold text-lore-ink dark:text-white">
              Nos valeurs
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALEURS.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden" whileInView="show" viewport={{ once: true }}
                variants={FADE_UP} transition={{ duration: 0.5, delay: i * 0.08 }}
                className="flex items-start gap-4 rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface"
              >
                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${v.bg}`}>
                  <v.icon className={`h-5 w-5 ${v.color}`} />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lore-ink dark:text-white">{v.title}</h3>
                  <p className="mt-1 text-sm text-lore-ink/60 dark:text-white/60 leading-relaxed">{v.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* ── Notre engagement ────────────────────────────────────────── */}
        <motion.section
          initial="hidden" whileInView="show" viewport={{ once: true }}
          variants={FADE_UP} transition={{ duration: 0.6 }}
        >
          <div className="rounded-3xl overflow-hidden relative"
            style={{
              background: "linear-gradient(135deg, #031a4a 0%, #043C9E 60%, #0a5bc4 100%)",
            }}>
            <div className="hero-grid absolute inset-0 pointer-events-none opacity-20" />
            <div className="relative z-10 px-8 py-12 md:px-12 text-center flex flex-col items-center gap-6">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-200/80">
                Notre engagement
              </span>
              <h2 className="font-display text-2xl md:text-3xl font-extrabold text-white leading-tight max-w-2xl">
                Chaque individu mérite une chance de réussir
              </h2>
              <p className="max-w-2xl text-white/70 leading-relaxed">
                Chez Loré Foundation, nous travaillons chaque jour pour transformer les obstacles en
                opportunités, les ambitions en réalisations et les rêves en projets porteurs d&apos;avenir.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-2">
                <Link href="/partenaire"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-lore-blue hover:bg-white/90 transition-colors">
                  Devenir partenaire
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link href="/soutenir"
                  className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white hover:bg-white/20 transition-colors backdrop-blur-sm">
                  <Heart className="h-4 w-4" />
                  Soutenir nos projets
                </Link>
              </div>
              <p className="mt-4 font-display text-sm font-semibold text-white/50 italic">
                « Loré Foundation — L&apos;excellence au cœur de l&apos;impact. »
              </p>
            </div>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
