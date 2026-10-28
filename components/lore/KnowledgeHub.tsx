import Link from "next/link";
import { ArrowRight, Bot, Compass, Cpu, Flag, GraduationCap, Newspaper, Rocket, type LucideIcon } from "lucide-react";
import { BLOG_CATEGORIES } from "@/lib/blog-categories";
import type { ArticleLite } from "@/lib/knowledge";
import SectionIntro from "./SectionIntro";
import Reveal from "./Reveal";

const ICONS: Record<string, LucideIcon> = {
  technologie: Cpu,
  education: GraduationCap,
  ia: Bot,
  entrepreneuriat: Rocket,
  activites: Flag,
  actualites: Newspaper,
  leadership: Compass,
};

/** « Parcourir par thème » : catégories du blog avec leurs derniers articles publiés. */
export default function KnowledgeHub({ articles }: { articles: ArticleLite[] }) {
  const groups = BLOG_CATEGORIES.map((c) => ({
    ...c,
    posts: articles.filter((a) => a.category === c.id),
  })).filter((g) => g.posts.length > 0);

  if (groups.length === 0) return null;

  return (
    <section id="savoirs" aria-labelledby="savoirs-title" className="bg-ivory-200 px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionIntro
            id="savoirs-title"
            label="Centre de savoir"
            title="Parcourir par thème"
            description="Les articles publiés par Loré Fondation, classés par catégorie."
          />
        </Reveal>
        <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map(({ id, label, posts }) => {
            const Icon = ICONS[id] ?? Newspaper;
            return (
              <li key={id}>
                <Reveal className="h-full">
                  <section
                    aria-labelledby={`cat-${id}`}
                    className="flex h-full flex-col rounded-2xl border border-royal/15 bg-white p-6 transition-[border-color,box-shadow] duration-300 hover:border-royal/40 hover:shadow-[0_20px_40px_-26px_rgba(27,70,194,0.5)] focus-within:border-royal"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <h3 id={`cat-${id}`} className="font-display text-2xl font-bold text-navy">
                        {label}
                      </h3>
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-100 text-royal">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-navy/65">
                      {posts.length} article{posts.length > 1 ? "s" : ""}
                    </p>
                    <ul className="mt-4 flex-1 space-y-2.5 border-t border-royal/10 pt-4">
                      {posts.slice(0, 4).map((p) => (
                        <li key={p.id}>
                          <Link
                            href={`/blog/${p.slug}`}
                            className="focus-royal line-clamp-2 rounded text-[0.95rem] leading-snug text-navy/85 underline-offset-4 hover:text-royal hover:underline"
                          >
                            {p.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/blog?categorie=${id}`}
                      className="focus-royal group mt-5 inline-flex items-center gap-2 self-start rounded text-[0.95rem] font-semibold text-royal"
                    >
                      Voir les {posts.length} article{posts.length > 1 ? "s" : ""}
                      <span className="sr-only"> : {label}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                    </Link>
                  </section>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
