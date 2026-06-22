"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Target, MapPin, Users, Clock, ArrowRight, Heart } from "lucide-react";
import type { Project, ProjectCategory } from "@/app/admin/_components/types";

const CATS: { id: ProjectCategory | "all"; label: string; emoji: string }[] = [
  { id: "all",        label: "Tous",         emoji: "✨" },
  { id: "education",  label: "Éducation",    emoji: "📚" },
  { id: "numerique",  label: "Numérique",    emoji: "💻" },
  { id: "leadership", label: "Leadership",   emoji: "🌟" },
  { id: "communaute", label: "Communauté",   emoji: "🤝" },
  { id: "sante",      label: "Santé",        emoji: "❤️" },
  { id: "autre",      label: "Autre",        emoji: "🎯" },
];

const CAT_COLORS: Record<string, string> = {
  education:  "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  numerique:  "bg-purple-500/15 text-purple-600 dark:text-purple-300",
  leadership: "bg-amber-500/15 text-amber-600 dark:text-amber-300",
  communaute: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  sante:      "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  autre:      "bg-slate-500/15 text-slate-500",
};

function pct(raised: number, goal: number) {
  if (!goal) return 0;
  return Math.min(100, Math.round((raised / goal) * 100));
}

export default function ProjetsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading]   = useState(true);
  const [cat, setCat]           = useState<string>("all");

  useEffect(() => {
    fetch("/api/projects?limit=50")
      .then(r => r.json())
      .then(d => { setProjects(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filtered = cat === "all" ? projects : projects.filter(p => p.category === cat);
  const featured = filtered.filter(p => p.is_featured);
  const regular  = filtered.filter(p => !p.is_featured);

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <p className="font-display font-bold text-lore-ink dark:text-white">Nos Projets</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation · Financer l&apos;avenir d&apos;Haïti</p>
          </div>
          <Link href="/don" className="flex items-center gap-2 rounded-full bg-lore-blue px-4 py-2 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
            <Heart className="h-4 w-4" /> Faire un don
          </Link>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden py-16 md:py-24"
        style={{ background: "linear-gradient(135deg,#031a4a 0%,#043C9E 60%,#0a5bc4 100%)" }}>
        <div className="hero-grid absolute inset-0 opacity-20 pointer-events-none" />
        <div className="mx-auto max-w-6xl px-5 text-center relative z-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 mb-4">
            <Target className="h-3.5 w-3.5" /> {projects.length} projet{projects.length !== 1 ? "s" : ""} à financer
          </span>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            Investissez dans <span className="text-gradient-gold">l&apos;avenir d&apos;Haïti</span>
          </h1>
          <p className="mt-4 text-white/60 max-w-xl mx-auto">
            Chaque contribution, grande ou petite, aide Loré Foundation à transformer des vies
            à travers l&apos;éducation, la technologie et l&apos;engagement communautaire.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col gap-10">

        {/* Filtres */}
        <div className="overflow-x-auto pb-1">
          <div className="flex gap-2 min-w-max">
            {CATS.map(c => (
              <button key={c.id} type="button" onClick={() => setCat(c.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  cat === c.id ? "bg-lore-blue text-white shadow-md"
                    : "border border-lore-dark/10 bg-white text-lore-ink/70 hover:border-lore-blue/30 dark:border-white/10 dark:bg-lore-night-surface dark:text-white/70"
                }`}>
                {c.emoji} {c.label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-lore-blue/30 border-t-lore-blue animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Target className="h-12 w-12 text-lore-ink/20 dark:text-white/20" />
            <p className="font-display font-bold text-lore-ink dark:text-white">Aucun projet pour le moment</p>
            <p className="text-sm text-lore-ink/50 dark:text-white/50">De nouveaux projets arrivent bientôt.</p>
          </div>
        )}

        {/* Projets vedettes */}
        {featured.length > 0 && (
          <div className="flex flex-col gap-5">
            <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">⭐ Projets prioritaires</h2>
            {featured.map(p => <ProjectCard key={p.id} project={p} featured />)}
          </div>
        )}

        {/* Autres projets */}
        {regular.length > 0 && (
          <div className="flex flex-col gap-4">
            {featured.length > 0 && (
              <h2 className="font-display text-xl font-bold text-lore-ink dark:text-white">Tous les projets</h2>
            )}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {regular.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project: p, featured }: { project: Project; featured?: boolean }) {
  const cat   = p.category;
  const prog  = pct(p.raised_amount, p.goal_amount);
  const daysLeft = p.end_date
    ? Math.max(0, Math.ceil((new Date(p.end_date).getTime() - Date.now()) / 86400000))
    : null;

  return (
    <Link href={`/projets/${p.slug}`}
      className={`group flex flex-col overflow-hidden rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface hover:shadow-xl transition-shadow ${
        featured ? "sm:flex-row" : ""
      }`}>

      {/* Cover */}
      <div className={`relative overflow-hidden ${featured ? "sm:w-1/2 aspect-[4/3] sm:aspect-auto" : "aspect-video"}`}>
        {p.cover_url
          ? <Image src={p.cover_url} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
          : <div className="h-full w-full bg-gradient-to-br from-lore-blue/15 to-blue-400/5 flex items-center justify-center">
              <Target className="h-12 w-12 text-lore-blue/30" />
            </div>
        }
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${CAT_COLORS[cat] ?? ""}`}>
            {cat}
          </span>
          {(p.status as string) === "termine" && (
            <span className="rounded-full bg-emerald-500/20 px-2.5 py-1 text-[11px] font-bold text-emerald-600 backdrop-blur-sm">✅ Terminé</span>
          )}
        </div>
        {p.media?.length > 1 && (
          <span className="absolute bottom-2 right-2 rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
            +{p.media.length} médias
          </span>
        )}
      </div>

      {/* Contenu */}
      <div className={`flex flex-1 flex-col gap-3 p-5 ${featured ? "justify-center" : ""}`}>
        <h3 className="font-display font-bold text-lore-ink dark:text-white leading-tight group-hover:text-lore-blue transition-colors line-clamp-2">
          {p.title}
        </h3>
        <p className="text-sm text-lore-ink/60 dark:text-white/60 line-clamp-2 leading-relaxed">{p.short_desc}</p>

        {/* Méta */}
        <div className="flex items-center gap-3 text-xs text-lore-ink/40 dark:text-white/40 flex-wrap">
          {p.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{p.location}</span>}
          {p.beneficiaries > 0 && <span className="flex items-center gap-1"><Users className="h-3 w-3" />{p.beneficiaries} bénéficiaires</span>}
          {daysLeft !== null && daysLeft > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{daysLeft}j restants</span>}
        </div>

        {/* Progression */}
        {p.goal_amount > 0 && (
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-lore-ink dark:text-white">
                {p.raised_amount.toLocaleString("fr-FR")} {p.currency}
              </span>
              <span className="text-lore-blue font-bold">{prog}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-lore-dark/10 dark:bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-lore-blue to-blue-400 transition-all" style={{ width: `${prog}%` }} />
            </div>
            <p className="mt-1 text-[11px] text-lore-ink/40 dark:text-white/40">
              Objectif : {p.goal_amount.toLocaleString("fr-FR")} {p.currency}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-2">
          <span className="text-xs font-semibold text-lore-blue flex items-center gap-1 group-hover:gap-2 transition-all">
            Voir & financer <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="rounded-full bg-lore-blue/10 px-3 py-1 text-xs font-bold text-lore-blue">
            Financer →
          </span>
        </div>
      </div>
    </Link>
  );
}
