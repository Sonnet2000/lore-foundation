"use client";

import { useId, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, LayoutGrid, Search, X } from "lucide-react";
import { categoryLabel, normalize } from "@/lib/blog-categories";
import type { KnowledgeItem } from "@/lib/knowledge";

type Stat = { value: number; label: string };

const KIND = {
  formation: { label: "Formation", Icon: GraduationCap },
  article: { label: "Article", Icon: BookOpen },
  plateforme: { label: "Plateforme", Icon: LayoutGrid },
} as const;

export default function KnowledgeSearch({ items, stats }: { items: KnowledgeItem[]; stats: Stat[] }) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const statusId = useId();

  const results = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (query.trim().length < 2) return [];
    return items
      .filter((it) => {
        const hay = normalize(
          `${it.title} ${it.excerpt ?? ""} ${it.category ? categoryLabel(it.category) : ""}`
        );
        return terms.every((t) => hay.includes(t));
      })
      .slice(0, 8);
  }, [items, query]);

  const searching = query.trim().length >= 2;

  return (
    <section aria-label="Recherche" className="relative z-10 -mt-10 px-5 sm:-mt-12 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl rounded-2xl border border-royal/15 bg-white shadow-[0_30px_60px_-30px_rgba(11,31,75,0.45)]">
        <form role="search" onSubmit={(e) => e.preventDefault()} className="p-4 sm:p-6">
          <label htmlFor={inputId} className="font-display text-xl font-semibold text-navy sm:text-2xl">
            Que souhaitez-vous apprendre ?
          </label>
          <div className="relative mt-3">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-royal" aria-hidden="true" />
            <input
              id={inputId}
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && setQuery("")}
              placeholder="Une formation, un article, une plateforme…"
              autoComplete="off"
              aria-describedby={statusId}
              className="h-14 w-full rounded-xl border border-royal/25 bg-sky-50 pl-12 pr-12 text-base text-navy placeholder:text-navy/50 focus:border-royal focus:outline-none focus:ring-4 focus:ring-gold/40"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                className="focus-royal absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-navy/70 hover:bg-royal/10"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            )}
          </div>
          <p id={statusId} role="status" aria-live="polite" className="sr-only">
            {searching ? `${results.length} résultat${results.length > 1 ? "s" : ""}` : ""}
          </p>

          {searching && (
            <ul className="mt-4 divide-y divide-royal/10 overflow-hidden rounded-xl border border-royal/15">
              {results.length === 0 ? (
                <li className="p-4 text-[0.95rem] text-navy/75">
                  Aucun résultat pour « {query.trim()} ». Essayez un autre mot, ou{" "}
                  <Link href="/#contact" className="font-semibold text-royal underline underline-offset-4">
                    contactez-nous
                  </Link>
                  .
                </li>
              ) : (
                results.map((it) => {
                  const { label, Icon } = KIND[it.kind];
                  const inner = (
                    <>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-royal">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-navy">{it.title}</span>
                        <span className="block text-sm text-navy/65">
                          {label}
                          {it.category ? ` · ${categoryLabel(it.category)}` : ""}
                        </span>
                      </span>
                      {it.external && <ArrowUpRight className="h-4 w-4 shrink-0 text-royal" aria-hidden="true" />}
                    </>
                  );
                  const cls =
                    "focus-royal flex items-center gap-3 p-3 transition-colors hover:bg-sky-50 focus-visible:bg-sky-50";
                  return (
                    <li key={it.id}>
                      {it.external ? (
                        <a href={it.href} target="_blank" rel="noopener noreferrer" className={cls}>
                          {inner}
                          <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
                        </a>
                      ) : (
                        <Link href={it.href} className={cls}>
                          {inner}
                        </Link>
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          )}
        </form>

        {stats.length > 0 && (
          <dl className="grid grid-cols-2 divide-x divide-royal/10 border-t border-royal/10 sm:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
            {stats.map((s) => (
              <div key={s.label} className="px-4 py-4 text-center sm:px-6">
                <dd className="font-display text-3xl font-bold text-royal">{s.value.toLocaleString("fr-FR")}</dd>
                <dt className="text-sm text-navy/70">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  );
}
