"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, BookOpen, Clock, Eye } from "lucide-react";

type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  cover_url: string | null;
  category: string;
  read_time_minutes: number;
  views: number;
  published_at: string | null;
};

const CAT_COLORS: Record<string, string> = {
  technologie:    "bg-blue-500/20 text-blue-400",
  education:      "bg-emerald-500/20 text-emerald-400",
  ia:             "bg-purple-500/20 text-purple-400",
  entrepreneuriat:"bg-amber-500/20 text-amber-400",
  activites:      "bg-rose-500/20 text-rose-400",
  actualites:     "bg-sky-500/20 text-sky-400",
  leadership:     "bg-orange-500/20 text-orange-400",
};

const CAT_EMOJI: Record<string, string> = {
  technologie: "💻", education: "📚", ia: "🤖",
  entrepreneuriat: "🚀", activites: "🇭🇹", actualites: "📢", leadership: "🌟",
};

export default function BlogBanner() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/blog?limit=3&featured=0")
      .then(r => r.json())
      .then(d => { setPosts(d.items ?? []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  // Si pa gen atik — pa afiche seksyon an
  if (!loading && posts.length === 0) return null;

  return (
    <section className="py-20 bg-lore-dark dark:bg-[#051a2b]">
      <div className="mx-auto max-w-6xl px-5">

        {/* En-tête */}
        <div className="mb-10 flex items-end justify-between gap-4 flex-wrap">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-lore-blue/80 mb-2 block">
              Blog & Actualités
            </span>
            <h2 className="font-display text-3xl font-extrabold text-white md:text-4xl">
              Derniers articles
            </h2>
            <p className="mt-2 text-white/50 text-sm max-w-md">
              Technologie, éducation, IA et actualités de Loré Foundation — du contenu
              qui inspire et informe la communauté haïtienne.
            </p>
          </div>
          <Link href="/blog"
            className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors whitespace-nowrap">
            Voir tous les articles
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Skeleton loading */}
        {loading && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-3xl bg-white/5 animate-pulse h-64" />
            ))}
          </div>
        )}

        {/* Grille articles */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, idx) => (
              <Link key={post.id} href={`/blog/${post.slug}`}
                className={`group flex flex-col overflow-hidden rounded-3xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/15 transition-all ${idx === 0 ? "sm:col-span-2 lg:col-span-1" : ""}`}>

                {/* Cover */}
                <div className="relative overflow-hidden"
                  style={{ aspectRatio: idx === 0 ? "16/7" : "16/9" }}>
                  {post.cover_url
                    ? <Image src={post.cover_url} alt={post.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" />
                    : <div className="h-full w-full bg-gradient-to-br from-lore-blue/20 to-blue-400/10 flex items-center justify-center">
                        <span className="text-5xl opacity-40">
                          {CAT_EMOJI[post.category] ?? "📝"}
                        </span>
                      </div>
                  }
                  {/* Catégorie badge */}
                  <div className="absolute top-3 left-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold backdrop-blur-sm ${CAT_COLORS[post.category] ?? "bg-lore-blue/20 text-blue-300"}`}>
                      {CAT_EMOJI[post.category]} {post.category}
                    </span>
                  </div>
                </div>

                {/* Contenu */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h3 className="font-display font-bold text-white line-clamp-2 leading-tight group-hover:text-lore-blue transition-colors">
                    {post.title}
                  </h3>
                  <p className="text-sm text-white/50 line-clamp-2 leading-relaxed flex-1">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs text-white/30 mt-2 pt-3 border-t border-white/5">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {post.read_time_minutes} min
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" /> {post.views}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-lore-blue/80 font-semibold group-hover:text-lore-blue transition-colors">
                      Lire <ArrowRight className="h-3 w-3 group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* CTA bas */}
        <div className="mt-10 flex justify-center">
          <Link href="/blog"
            className="group flex items-center gap-3 rounded-full bg-lore-blue px-8 py-3.5 font-bold text-white hover:bg-lore-blue/90 transition-all hover:scale-105 shadow-lg">
            <BookOpen className="h-5 w-5" />
            Explorer tout le blog
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
