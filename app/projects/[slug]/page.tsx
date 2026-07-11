"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, MapPin, Users, Calendar, Target,
  Play, ChevronLeft, ChevronRight, MessageCircle,
} from "lucide-react";
import type { Project } from "@/app/admin/_components/types";
import { siteInfo } from "@/lib/data";

export default function ProjetPage() {
  const { slug } = useParams<{ slug: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [mediaIdx, setMediaIdx] = useState(0);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/projects/${slug}`)
      .then(r => r.json())
      .then(d => { setProject(d.item ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  const media = project?.media ?? [];

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-lore-cream dark:bg-lore-night">
      <div className="h-10 w-10 rounded-full border-2 border-lore-blue/30 border-t-lore-blue animate-spin" />
    </div>
  );

  if (!project) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lore-cream dark:bg-lore-night px-5 text-center">
      <Target className="h-16 w-16 text-lore-ink/20 dark:text-white/20" />
      <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">Projet non trouvé</h1>
      <Link href="/projects" className="rounded-full bg-lore-blue px-6 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
        Voir tous les projets
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* Header */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center gap-4 px-5 py-4">
          <Link href="/projects" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="flex-1 font-display font-bold text-sm text-lore-ink dark:text-white truncate">{project.title}</p>
          <a
            href={siteInfo.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full bg-lore-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors"
          >
            <MessageCircle className="h-4 w-4" /> Un projet similaire ?
          </a>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-5 py-8 flex flex-col gap-8">

        {/* Galerie médias */}
        {media.length > 0 && (
          <div className="relative overflow-hidden rounded-3xl aspect-video bg-lore-dark">
            {media[mediaIdx].type === "video"
              ? <video src={media[mediaIdx].url} controls className="h-full w-full object-contain" />
              : <Image src={media[mediaIdx].url} alt={project.title} fill className="object-cover" priority />
            }
            {media.length > 1 && (
              <>
                <button type="button" onClick={() => setMediaIdx(i => (i - 1 + media.length) % media.length)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" onClick={() => setMediaIdx(i => (i + 1) % media.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {media.map((m, i) => (
                    <button key={i} type="button" onClick={() => setMediaIdx(i)}
                      className={`h-2 w-2 rounded-full transition-colors ${i === mediaIdx ? "bg-white" : "bg-white/40"}`} />
                  ))}
                </div>
              </>
            )}
            {media[mediaIdx].type === "video" && (
              <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
                <Play className="h-3 w-3" /> Vidéo
              </div>
            )}
          </div>
        )}

        {/* Miniatures */}
        {media.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-1">
            {media.map((m, i) => (
              <button key={i} type="button" onClick={() => setMediaIdx(i)}
                className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${i === mediaIdx ? "border-lore-blue" : "border-transparent"}`}>
                {m.type === "video"
                  ? <div className="h-full w-full bg-lore-dark flex items-center justify-center"><Play className="h-5 w-5 text-white" /></div>
                  : <Image src={m.url} alt="" fill className="object-cover" />
                }
              </button>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

          {/* Description */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div>
              <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white leading-tight mb-4">
                {project.title}
              </h1>
              <div className="flex flex-wrap gap-3 text-xs text-lore-ink/50 dark:text-white/50">
                {project.location && <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{project.location}</span>}
                {project.beneficiaries > 0 && <span className="flex items-center gap-1"><Users className="h-3.5 w-3.5" />{project.beneficiaries} personnes impactées</span>}
                {project.start_date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Début : {new Date(project.start_date).toLocaleDateString("fr-FR")}</span>}
                {project.end_date && <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" />Fin : {new Date(project.end_date).toLocaleDateString("fr-FR")}</span>}
              </div>
            </div>

            <div className="prose prose-sm dark:prose-invert max-w-none
              prose-headings:font-display prose-h2:text-xl prose-h2:font-bold prose-h2:mt-6
              prose-p:text-lore-ink/75 dark:prose-p:text-white/70 prose-p:leading-relaxed
              prose-a:text-lore-blue prose-ul:text-lore-ink/75 dark:prose-ul:text-white/70
              prose-li:marker:text-lore-blue prose-strong:text-lore-ink dark:prose-strong:text-white
              prose-blockquote:border-lore-blue prose-blockquote:bg-lore-blue/5 prose-blockquote:rounded-r-xl"
              dangerouslySetInnerHTML={{ __html: project.description.replace(/\n/g, "<br/>") }} />
          </div>

          {/* Sidebar */}
          <div className="flex flex-col gap-5">
            <div className="rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6 flex flex-col gap-5">

              {/* Stats */}
              <div className="grid grid-cols-2 gap-3">
                {project.beneficiaries > 0 && (
                  <div className="rounded-2xl bg-lore-cream dark:bg-white/5 p-4 text-center">
                    <p className="font-display text-xl font-bold text-lore-ink dark:text-white">{project.beneficiaries}</p>
                    <p className="text-xs text-lore-ink/50 dark:text-white/50">personnes impactées</p>
                  </div>
                )}
                {project.media?.length > 0 && (
                  <div className="rounded-2xl bg-lore-cream dark:bg-white/5 p-4 text-center">
                    <p className="font-display text-xl font-bold text-lore-ink dark:text-white">{project.media.length}</p>
                    <p className="text-xs text-lore-ink/50 dark:text-white/50">médias</p>
                  </div>
                )}
              </div>

              {/* CTA */}
              <a
                href={siteInfo.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-6 py-4 font-bold text-white hover:bg-lore-blue/90 transition-all hover:scale-[1.02] shadow-lg"
              >
                <MessageCircle className="h-5 w-5" /> Discuter d&apos;un projet
              </a>
              <p className="text-center text-xs text-lore-ink/40 dark:text-white/40">
                Réponse rapide via WhatsApp
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
