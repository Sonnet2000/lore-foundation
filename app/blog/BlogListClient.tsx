"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Clock, Search, BookOpen } from "lucide-react";
import type { BlogPost } from "@/app/admin/_components/types";
import { BLOG_CATEGORIES, categoryLabel, normalize } from "@/lib/blog-categories";

function formatDate(d: string | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });
}

type Props = { initialPosts?: BlogPost[]; initialCategory?: string };

export default function BlogListClient({ initialPosts = [], initialCategory = "all" }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState<string>(initialCategory);
  const [search, setSearch] = useState("");
  const isFirstRun = useRef(true);

  useEffect(() => {
    // Le premier rendu reçoit déjà les articles du serveur pour la catégorie demandée.
    if (isFirstRun.current) {
      isFirstRun.current = false;
      if (category === initialCategory) return;
    }
    setLoading(true);
    const url = category === "all" ? "/api/blog?limit=50" : `/api/blog?category=${encodeURIComponent(category)}&limit=50`;
    fetch(url)
      .then((r) => r.json())
      .then((d) => setPosts(d.items ?? []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const filtered = useMemo(() => {
    const terms = normalize(search).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return posts;
    return posts.filter((p) => {
      const hay = normalize(`${p.title} ${p.excerpt ?? ""} ${(p.tags ?? []).join(" ")}`);
      return terms.every((t) => hay.includes(t));
    });
  }, [posts, search]);

  const chip = (active: boolean) =>
    `focus-royal rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
      active ? "border-royal bg-royal text-white" : "border-royal/25 bg-white text-navy hover:border-royal hover:text-royal"
    }`;

  return (
    <div className="bg-ivory">
      <section className="bg-notebook border-b border-royal/10 px-5 pb-14 pt-12 sm:px-8 sm:pt-16 lg:px-12">
        <div className="mx-auto max-w-7xl sm:pl-10 lg:pl-12">
          <p className="text-sm font-semibold text-royal">Blog et actualités</p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-bold leading-tight tracking-tight text-navy sm:text-5xl">
            Apprendre, comprendre, s’informer
          </h1>
          <p className="mt-4 max-w-xl text-lg text-navy/75">
            Les articles de Loré Fondation sur l’éducation, la technologie et l’engagement pour Haïti.
          </p>
          <form role="search" onSubmit={(e) => e.preventDefault()} className="relative mt-8 max-w-xl">
            <label htmlFor="blog-search" className="sr-only">Rechercher un article</label>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-royal" aria-hidden="true" />
            <input
              id="blog-search"
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un article…"
              className="h-14 w-full rounded-xl border border-royal/25 bg-white pl-12 pr-4 text-base text-navy placeholder:text-navy/50 focus:border-royal focus:outline-none focus:ring-4 focus:ring-gold/40"
            />
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div role="group" aria-label="Filtrer par thème" className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={category === "all"} onClick={() => setCategory("all")} className={chip(category === "all")}>
            Tous les thèmes
          </button>
          {BLOG_CATEGORIES.map((c) => (
            <button key={c.id} type="button" aria-pressed={category === c.id} onClick={() => setCategory(c.id)} className={chip(category === c.id)}>
              {c.label}
            </button>
          ))}
        </div>

        <p role="status" aria-live="polite" className="mt-6 text-sm text-navy/70">
          {loading ? "Chargement…" : `${filtered.length} article${filtered.length > 1 ? "s" : ""}`}
        </p>

        {!loading && filtered.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-royal/15 bg-sky-50 p-10 text-center">
            <BookOpen className="mx-auto h-8 w-8 text-royal" aria-hidden="true" />
            <p className="mt-3 text-navy/80">
              Aucun article ne correspond. Changez de thème ou effacez votre recherche.
            </p>
          </div>
        ) : (
          <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <li key={p.id}>
                <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-royal/15 bg-white transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-royal/40 hover:shadow-[0_22px_40px_-26px_rgba(27,70,194,0.5)] focus-within:border-royal motion-reduce:transform-none">
                  <div className="relative aspect-[16/9] bg-sky-100">
                    {p.cover_url ? (
                      <Image src={p.cover_url} alt="" fill sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="object-cover" />
                    ) : (
                      <div className="bg-grid-sky grid h-full w-full place-items-center text-royal">
                        <BookOpen className="h-9 w-9" aria-hidden="true" />
                      </div>
                    )}
                    <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-gold" />
                  </div>
                  <div className="flex flex-1 flex-col p-6">
                    <p className="text-sm font-semibold text-royal">{categoryLabel(p.category)}</p>
                    <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-navy">
                      <Link href={`/blog/${p.slug}`} className="focus-royal rounded after:absolute after:inset-0 hover:text-royal">
                        {p.title}
                      </Link>
                    </h2>
                    {p.excerpt && <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-navy/70">{p.excerpt}</p>}
                    <p className="mt-auto flex items-center gap-3 pt-5 text-sm text-navy/65">
                      {p.published_at && <time dateTime={p.published_at}>{formatDate(p.published_at)}</time>}
                      {p.read_time_minutes > 0 && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {p.read_time_minutes} min
                        </span>
                      )}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
