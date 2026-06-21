"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, Clock, Eye, Calendar, Tag,
  Share2, Heart, ArrowRight, BookOpen,
} from "lucide-react";
import type { BlogPost } from "@/app/admin/_components/types";

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

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost]       = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked]     = useState(false);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/blog/${slug}`)
      .then(r => r.json())
      .then(d => { setPost(d.item ?? null); setLoading(false); })
      .catch(() => setLoading(false));
  }, [slug]);

  function share() {
    if (navigator.share) {
      navigator.share({ title: post?.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  }

  if (loading) return (
    <div className="flex min-h-screen items-center justify-center bg-lore-cream dark:bg-lore-night">
      <div className="h-10 w-10 rounded-full border-2 border-lore-blue/30 border-t-lore-blue animate-spin" />
    </div>
  );

  if (!post) return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-5 bg-lore-cream dark:bg-lore-night px-5 text-center">
      <BookOpen className="h-16 w-16 text-lore-ink/20 dark:text-white/20" />
      <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">Article non trouvé</h1>
      <Link href="/blog" className="rounded-full bg-lore-blue px-6 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
        Retour au blog
      </Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">

      {/* Header sticky */}
      <div className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-md dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-5 py-4">
          <Link href="/blog" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="flex-1 font-display font-bold text-sm text-lore-ink dark:text-white truncate">{post.title}</p>
          <button type="button" onClick={share}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-lore-dark/10 text-lore-ink/50 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/50 transition-colors">
            <Share2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Cover image */}
      {post.cover_url && (
        <div className="relative h-64 md:h-96 w-full overflow-hidden">
          <Image src={post.cover_url} alt={post.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-t from-lore-cream dark:from-lore-night via-transparent to-transparent" />
        </div>
      )}

      <div className="mx-auto max-w-4xl px-5 py-8 md:py-12">

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${CAT_COLORS[post.category] ?? "bg-lore-blue/15 text-lore-blue"}`}>
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-lore-ink/40 dark:text-white/40">
            <Calendar className="h-3.5 w-3.5" /> {formatDate(post.published_at)}
          </span>
          <span className="flex items-center gap-1 text-xs text-lore-ink/40 dark:text-white/40">
            <Clock className="h-3.5 w-3.5" /> {post.read_time_minutes} min de lecture
          </span>
          <span className="flex items-center gap-1 text-xs text-lore-ink/40 dark:text-white/40">
            <Eye className="h-3.5 w-3.5" /> {post.views} vues
          </span>
        </div>

        {/* Titre */}
        <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-extrabold text-lore-ink dark:text-white leading-tight mb-5">
          {post.title}
        </h1>

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-lore-ink/70 dark:text-white/70 leading-relaxed mb-8 font-medium border-l-4 border-lore-blue pl-5">
            {post.excerpt}
          </p>
        )}

        {/* Auteur */}
        <div className="flex items-center gap-3 mb-10 pb-8 border-b border-lore-dark/8 dark:border-white/8">
          {post.author_photo
            ? <Image src={post.author_photo} alt={post.author_name} width={44} height={44} className="rounded-full object-cover h-11 w-11" />
            : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lore-blue text-white font-bold text-sm">
                {post.author_name.charAt(0)}
              </div>
          }
          <div>
            <p className="font-semibold text-sm text-lore-ink dark:text-white">{post.author_name}</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>

        {/* Contenu article — rich text rendu en HTML */}
        <div
          className="prose prose-lg dark:prose-invert max-w-none
            prose-headings:font-display prose-headings:font-bold
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4
            prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3
            prose-p:text-lore-ink/80 dark:prose-p:text-white/75 prose-p:leading-relaxed
            prose-a:text-lore-blue prose-a:no-underline hover:prose-a:underline
            prose-strong:text-lore-ink dark:prose-strong:text-white
            prose-blockquote:border-lore-blue prose-blockquote:bg-lore-blue/5 prose-blockquote:rounded-r-xl prose-blockquote:py-1
            prose-img:rounded-2xl prose-img:shadow-lg
            prose-ul:text-lore-ink/80 dark:prose-ul:text-white/75
            prose-li:marker:text-lore-blue"
          dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, "<br/>") }}
        />

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 pt-8 border-t border-lore-dark/8 dark:border-white/8">
            <span className="text-xs font-semibold text-lore-ink/40 dark:text-white/40 flex items-center gap-1">
              <Tag className="h-3.5 w-3.5" /> Tags :
            </span>
            {post.tags.map(tag => (
              <span key={tag} className="rounded-full bg-lore-dark/5 dark:bg-white/5 px-3 py-1 text-xs font-medium text-lore-ink/60 dark:text-white/60">
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="mt-8 flex items-center gap-3">
          <button type="button" onClick={() => setLiked(!liked)}
            className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-semibold transition-colors ${
              liked
                ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
                : "border-lore-dark/10 text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/60"
            }`}>
            <Heart className={`h-4 w-4 ${liked ? "fill-rose-500" : ""}`} />
            {liked ? "J'aime !" : "J'aime"}
          </button>
          <button type="button" onClick={share}
            className="flex items-center gap-2 rounded-full border border-lore-dark/10 px-5 py-2.5 text-sm font-semibold text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/60 transition-colors">
            <Share2 className="h-4 w-4" />
            Partager
          </button>
        </div>

        {/* CTA retour blog */}
        <div className="mt-12 rounded-3xl border border-lore-blue/15 bg-lore-blue/5 dark:border-lore-blue/20 dark:bg-lore-blue/10 p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Lire d&apos;autres articles</p>
            <p className="text-sm text-lore-ink/60 dark:text-white/60 mt-1">
              Découvrez plus de contenus sur la technologie, l&apos;éducation et nos activités.
            </p>
          </div>
          <Link href="/blog"
            className="flex items-center gap-2 rounded-full bg-lore-blue px-6 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors whitespace-nowrap">
            Retour au blog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
}
