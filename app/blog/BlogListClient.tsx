"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Clock, Eye, Tag, ArrowRight, BookOpen, Search } from "lucide-react";
import type { BlogPost, BlogCategory } from "@/app/admin/_components/types";

const CATEGORIES: { id: BlogCategory | "all"; label: string; emoji: string }[] = [
  { id: "all",           label: "Tout",            emoji: "✨" },
  { id: "actualites",    label: "Actualités",       emoji: "📢" },
  { id: "technologie",   label: "Technologie",      emoji: "💻" },
  { id: "education",     label: "Éducation",        emoji: "📚" },
  { id: "ia",            label: "Intelligence IA",  emoji: "🤖" },
  { id: "entrepreneuriat",label: "Entrepreneuriat", emoji: "🚀" },
  { id: "leadership",    label: "Leadership",       emoji: "🌟" },
  { id: "activites",     label: "Activités LF",     emoji: "🇭🇹" },
];

const CAT_COLORS: Record<string, string> = {
  technologie:    "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  education:      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  ia:             "bg-purple-500/15 text-purple-600 dark:text-purple-300",
  entrepreneuriat:"bg-amber-500/15 text-amber-600 dark:text-amber-300",
  activites:      "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  actualites:     "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  leadership:     "bg-orange-500/15 text-orange-600 dark:text-orange-300",
};

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
}

export default function BlogListClient() {
  const [posts, setPosts]         = useState<BlogPost[]>([]);
  const [loading, setLoading]     = useState(true);
  const [category, setCategory]   = useState<string>("all");
  const [search, setSearch]       = useState("");

  useEffect(() => {
    setLoading(true);
    const url = category === "all"
      ? "/api/blog?limit=50"
      : `/api/blog?category=${category}&limit=50`;
    fetch(url)
      .then(r => r.json())
      .then(d => { setPosts(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, [category]);

  const featured   = posts.filter(p => p.is_featured).slice(0, 1)[0];
  const filtered   = posts.filter(p =>
    !search ||
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt.toLowerCase().includes(search.toLowerCase())
  );
  const regularPosts = filtered.filter(p => p.id !== featured?.id);

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* Header */}
      <div className="relative z-10 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-6xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <p className="font-display font-bold text-lore-ink dark:text-white">Blog</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation · Articles & Actualités</p>
          </div>
          {/* Search */}
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lore-ink/30 dark:text-white/30" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="rounded-full border border-lore-dark/10 bg-lore-cream pl-9 pr-4 py-2 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white w-48" />
          </div>
        </div>
      </div>

      {/* Hero */}
      <div className="relative overflow-hidden py-16 md:py-20"
        style={{ background: "linear-gradient(135deg, #031a4a 0%, #043C9E 60%, #0a5bc4 100%)" }}>
        <div className="hero-grid absolute inset-0 pointer-events-none opacity-20" />
        <div className="mx-auto max-w-6xl px-5 text-center relative z-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/80 mb-4">
            <BookOpen className="h-3.5 w-3.5" /> Savoir · Inspirer · Transformer
          </div>
          <h1 className="font-display text-4xl font-extrabold text-white md:text-5xl">
            Blog Loré Foundation
          </h1>
          <p className="mt-3 text-white/60 max-w-xl mx-auto">
            Technologie, éducation, IA, entrepreneuriat et actualités de la fondation —
            du contenu qui inspire et informe.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10 flex flex-col gap-10">

        {/* Filtres catégories */}
        <div className="overflow-x-auto pb-2">
          <div className="flex gap-2 min-w-max">
            {CATEGORIES.map(cat => (
              <button key={cat.id} type="button"
                onClick={() => setCategory(cat.id)}
                className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap transition-colors ${
                  category === cat.id
                    ? "bg-lore-blue text-white shadow-md"
                    : "border border-lore-dark/10 bg-white text-lore-ink/70 hover:border-lore-blue/30 dark:border-white/10 dark:bg-lore-night-surface dark:text-white/70"
                }`}>
                <span>{cat.emoji}</span> {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Search mobile */}
        <div className="relative sm:hidden">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-lore-ink/30 dark:text-white/30" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un article..."
            className="w-full rounded-2xl border border-lore-dark/10 bg-white pl-9 pr-4 py-3 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-lore-night-surface dark:text-white" />
        </div>

        {loading && (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 rounded-full border-2 border-lore-blue/30 border-t-lore-blue animate-spin" />
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <BookOpen className="h-12 w-12 text-lore-ink/20 dark:text-white/20" />
            <p className="font-display font-bold text-lore-ink dark:text-white">Aucun article pour le moment</p>
            <p className="text-sm text-lore-ink/50 dark:text-white/50">Revenez bientôt — de nouveaux contenus arrivent régulièrement.</p>
          </div>
        )}

        {/* Article featured */}
        {!loading && featured && category === "all" && !search && (
          <Link href={`/blog/${featured.slug}`}
            className="group relative overflow-hidden rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface block hover:shadow-xl transition-shadow">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[320px]">
                {featured.cover_url
                  ? <Image src={featured.cover_url} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="h-full w-full bg-gradient-to-br from-lore-blue/20 to-blue-400/10 flex items-center justify-center">
                      <BookOpen className="h-16 w-16 text-lore-blue/30" />
                    </div>
                }
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                <span className="absolute top-4 left-4 rounded-full bg-lore-blue px-3 py-1 text-xs font-bold text-white">
                  ⭐ À la une
                </span>
              </div>
              <div className="p-8 flex flex-col justify-center gap-4">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${CAT_COLORS[featured.category] ?? ""}`}>
                    {CATEGORIES.find(c => c.id === featured.category)?.emoji} {featured.category}
                  </span>
                </div>
                <h2 className="font-display text-2xl font-extrabold text-lore-ink dark:text-white leading-tight group-hover:text-lore-blue transition-colors">
                  {featured.title}
                </h2>
                <p className="text-lore-ink/60 dark:text-white/60 line-clamp-3 leading-relaxed">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-lore-ink/40 dark:text-white/40">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.read_time_minutes} min</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {featured.views} vues</span>
                  <span>{formatDate(featured.published_at)}</span>
                </div>
                <div className="flex items-center gap-2 text-lore-blue font-semibold text-sm">
                  Lire l&apos;article <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </Link>
        )}

        {/* Grille articles */}
        {!loading && regularPosts.length > 0 && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface hover:shadow-lg transition-shadow">

                {/* Cover */}
                <div className="relative aspect-[16/9] overflow-hidden">
                  {post.cover_url
                    ? <Image src={post.cover_url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="h-full w-full bg-gradient-to-br from-lore-blue/10 to-blue-400/5 flex items-center justify-center">
                        <span className="text-4xl">{CATEGORIES.find(c => c.id === post.category)?.emoji ?? "📝"}</span>
                      </div>
                  }
                  <div className="absolute top-3 left-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${CAT_COLORS[post.category] ?? "bg-lore-blue/15 text-lore-blue"}`}>
                      {CATEGORIES.find(c => c.id === post.category)?.label ?? post.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col gap-3 p-5">
                  <h3 className="font-display font-bold text-lore-ink dark:text-white line-clamp-2 leading-tight group-hover:text-lore-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-lore-ink/60 dark:text-white/60 line-clamp-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>

                  {/* Tags */}
                  {post.tags?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="flex items-center gap-1 rounded-full bg-lore-dark/5 dark:bg-white/5 px-2 py-0.5 text-[10px] text-lore-ink/50 dark:text-white/50">
                          <Tag className="h-2.5 w-2.5" />{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Meta */}
                  <div className="flex items-center justify-between text-xs text-lore-ink/40 dark:text-white/40 pt-2 border-t border-lore-dark/5 dark:border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.read_time_minutes} min</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {post.views}</span>
                    </div>
                    <span>{formatDate(post.published_at)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
