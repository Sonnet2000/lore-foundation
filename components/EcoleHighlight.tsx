import Link from "next/link";
import Image from "next/image";
import { GraduationCap, Clock3, ArrowRight } from "lucide-react";
import AnimatedSection from "@/components/ui/AnimatedSection";
import SectionHeading from "@/components/ui/SectionHeading";
import { listPublishedCourses } from "@/lib/school";

export default async function EcoleHighlight() {
  const courses = (await listPublishedCourses()).slice(0, 3);

  return (
    <section
      id="ecole"
      className="relative px-5 py-20 sm:px-8 sm:py-28 lg:px-12 bg-lore-cream dark:bg-lore-night-surface overflow-hidden"
    >
      <div
        className="absolute left-0 top-0 h-[420px] w-[420px] pointer-events-none opacity-40"
        style={{
          background: "radial-gradient(ellipse at 0% 0%, rgba(14,164,114,0.12) 0%, transparent 60%)",
        }}
      />

      <div className="mx-auto max-w-7xl relative">
        <AnimatedSection>
          <SectionHeading
            eyebrow="École Loré"
            title="Des formations qui mènent quelque part"
            description="Développement web, design graphique et compétences numériques — des cours pratiques, avec devoirs et suivi en ligne."
          />
        </AnimatedSection>

        <div className="mt-14 grid gap-6 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <div className="sm:col-span-2 lg:col-span-3 rounded-3xl border border-lore-dark/5 bg-white p-10 text-center text-sm text-lore-ink/50 dark:border-white/5 dark:bg-lore-night-card dark:text-white/50">
              De nouvelles formations arrivent bientôt.
            </div>
          ) : (
            courses.map((course) => (
              <div
                key={course.id}
                className="card-lift flex flex-col overflow-hidden rounded-3xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-card"
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
                <div className="flex flex-1 flex-col gap-3 p-6">
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
                    <p className="line-clamp-2 text-sm text-lore-ink/60 dark:text-white/60">{course.description}</p>
                  )}
                  <Link
                    href="/ecole"
                    className="focus-ring mt-auto inline-flex w-fit items-center gap-1.5 text-sm font-semibold text-lore-emerald hover:text-lore-emerald-dark dark:text-lore-emerald-light"
                  >
                    En savoir plus <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/ecole"
            className="btn-gold focus-ring inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-bold transition-transform hover:scale-[1.02]"
          >
            Voir toutes les formations
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
