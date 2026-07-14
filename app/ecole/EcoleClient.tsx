"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, GraduationCap, Clock3, Sparkles, PlayCircle, ClipboardCheck, ShieldCheck } from "lucide-react";
import type { CourseRow } from "@/lib/school";

const FADE_UP = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0 },
};

export default function EcoleClient({ courses }: { courses: CourseRow[] }) {
  const enrollHref = (courseId: string) => `/ecole/${courseId}/inscription`;

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      {/* ── Header sticky ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">École</p>
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
          <motion.div initial="hidden" animate="show" variants={FADE_UP} transition={{ duration: 0.7 }} className="flex flex-col items-center gap-5">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold text-lore-gold-light ring-1 ring-white/15">
              <GraduationCap className="h-3.5 w-3.5" />
              Formations professionnelles
            </span>
            <h1 className="font-display text-3xl font-bold text-white sm:text-5xl">
              Aprann yon metye, transfòme lavi w
            </h1>
            <p className="max-w-2xl text-sm text-white/70 sm:text-base">
              Loré Foundation ofri fòmasyon pratik nan devlopman web, sekirite enfòmatik, design
              grafik ak plis ankò, dirèkteman isit nan Cap-Haïtien. Enskri epi swiv devwa ou yo
              tou dwat sou platfòm nan.
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Pourquoi l'École Loré ──────────────────────────────────────── */}
      <div className="border-y border-lore-dark/5 bg-lore-cream/60 py-12 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="mx-auto grid max-w-5xl gap-8 px-5 sm:grid-cols-3">
          {[
            {
              icon: PlayCircle,
              title: "Leçons vidyo pa etap",
              text: "Chak kou gen leson vidyo ak resous ekri, disponib depi w apwouve.",
            },
            {
              icon: ClipboardCheck,
              title: "Devwa ak koreksyon",
              text: "Soumèt devwa w epi resevwa nòt ak kòmantè pèsonalize nan men fòmatè a.",
            },
            {
              icon: ShieldCheck,
              title: "Enskripsyon verifye",
              text: "Chak demand enskripsyon pase nan men ekip Loré Foundation anvan aksè louvri.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lore-blue/10 text-lore-blue dark:bg-lore-blue/15">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-display text-sm font-bold text-lore-ink dark:text-white">{title}</h3>
              <p className="text-xs text-lore-ink/60 dark:text-white/60">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Catalogue ───────────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 py-16">
        {courses.length === 0 ? (
          <p className="rounded-2xl border border-lore-dark/5 bg-white p-10 text-center text-sm text-lore-ink/50 dark:border-white/5 dark:bg-white/[0.03] dark:text-white/50">
            Pa gen kou disponib kounye a. Tounen pita — n ap ajoute nouvo fòmasyon regilyèman.
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, i) => (
              <Link key={course.id} href={enrollHref(course.id)} className="group block">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.05 }}
                  className="flex h-full flex-col overflow-hidden rounded-2xl border border-lore-dark/5 bg-white transition-shadow group-hover:shadow-lg dark:border-white/5 dark:bg-lore-night-surface"
                >
                  <div className="relative h-40 w-full bg-lore-dark/5 dark:bg-white/5">
                    {course.cover_url ? (
                      <Image src={course.cover_url} alt={course.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lore-ink/20 dark:text-white/20">
                        <GraduationCap className="h-10 w-10" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col gap-3 p-5">
                    {course.format !== "in_person" && (
                      <span className="w-fit rounded-full bg-lore-emerald/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-lore-emerald">
                        {course.format === "online" ? "100% en ligne" : "Hybride"}
                      </span>
                    )}
                    <h3 className="font-display text-lg font-bold text-lore-ink dark:text-white">{course.title}</h3>
                    <p className="flex items-center gap-1.5 text-xs text-lore-ink/50 dark:text-white/50">
                      <Clock3 className="h-3.5 w-3.5" />
                      {course.duration || "Dire pa presize"}
                      {course.price ? ` · ${course.price}` : ""}
                    </p>
                    {course.description && (
                      <p className="line-clamp-3 text-sm text-lore-ink/60 dark:text-white/60">{course.description}</p>
                    )}
                    <span className="focus-ring mt-auto inline-flex w-fit items-center gap-1.5 rounded-full bg-lore-gold px-4 py-2 text-xs font-bold text-lore-dark transition-transform group-hover:scale-[1.02]">
                      Enskri <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* ── Autres services ─────────────────────────────────────────── */}
      <div className="border-t border-lore-dark/5 bg-white py-16 dark:border-white/5 dark:bg-lore-night-surface">
        <div className="mx-auto max-w-3xl px-5 text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-lore-blue/10 px-4 py-1.5 text-xs font-semibold text-lore-blue">
            <Sparkles className="h-3.5 w-3.5" />
            Plis pase fòmasyon
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-lore-ink dark:text-white">
            Loré Foundation ofri plis lòt sèvis tou
          </h2>
          <p className="mt-3 text-sm text-lore-ink/60 dark:text-white/60">
            Devlopman lojisyèl, design grafik, enpresyon, dépannage enfòmatik ak plis ankò —
            gade tout pwogram nou yo.
          </p>
          <Link
            href="/#services"
            className="focus-ring mt-6 inline-flex items-center gap-1.5 rounded-full border border-lore-blue/30 px-5 py-2.5 text-sm font-semibold text-lore-blue transition-colors hover:bg-lore-blue/10"
          >
            Gade tout sèvis yo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
