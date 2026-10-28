import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock3, GraduationCap, Laptop } from "lucide-react";
import { listPublishedCourses } from "@/lib/school";
import { isFreeCoursePrice } from "@/lib/course-fees";
import { REGISTER_URL } from "@/lib/brand";
import SectionIntro from "./SectionIntro";
import Reveal from "./Reveal";

const FORMAT_LABEL = { online: "100 % en ligne", in_person: "En présentiel", hybrid: "Hybride" } as const;

/**
 * Formations = uniquement les cours PUBLIÉS dans l'administration (table `courses`).
 * Aucune formation n'est inventée ici ; durée et prix n'apparaissent que s'ils sont renseignés.
 */
export default async function Programs() {
  let courses: Awaited<ReturnType<typeof listPublishedCourses>> = [];
  try {
    courses = await listPublishedCourses();
  } catch {
    courses = [];
  }

  return (
    <section id="formations" aria-labelledby="formations-title" className="bg-ivory px-5 py-20 sm:px-8 sm:py-28 lg:px-12">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <SectionIntro
            id="formations-title"
            label="Formations"
            title="Des formations pour construire des compétences solides"
            description="Chaque formation publiée par Loré Fondation apparaît ici, avec ses informations vérifiées."
          />
        </Reveal>

        {courses.length === 0 ? (
          <Reveal className="mt-12">
            <div className="flex flex-col items-start gap-5 rounded-2xl border border-royal/15 bg-sky-50 p-8 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white text-royal ring-1 ring-royal/15">
                  <GraduationCap className="h-6 w-6" aria-hidden="true" />
                </span>
                <p className="max-w-md text-base leading-relaxed text-navy/80">
                  Les formations ouvertes seront présentées ici dès leur publication. Pour toute question, passez par
                  l’inscription en ligne ou contactez-nous.
                </p>
              </div>
              <a
                href={REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-royal focus-royal shrink-0 rounded-full px-6 py-3 text-sm font-semibold"
              >
                Aller à l’inscription
                <span className="sr-only"> (s’ouvre dans un nouvel onglet)</span>
              </a>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const price = course.price && !isFreeCoursePrice(course.price) ? course.price : null;
              return (
                <li key={course.id}>
                  <Reveal className="h-full">
                    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-royal/15 bg-white transition-[box-shadow,transform,border-color] duration-300 hover:-translate-y-1 hover:border-royal/40 hover:shadow-[0_22px_40px_-24px_rgba(27,70,194,0.45)] focus-within:border-royal motion-reduce:transform-none">
                      <div className="relative aspect-[16/9] bg-sky-100">
                        {course.cover_url ? (
                          <Image
                            src={course.cover_url}
                            alt=""
                            fill
                            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <div className="bg-grid-sky grid h-full w-full place-items-center text-royal">
                            <Laptop className="h-10 w-10" aria-hidden="true" />
                          </div>
                        )}
                        <span aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1 bg-gold" />
                      </div>
                      <div className="flex flex-1 flex-col p-6">
                        <p className="text-sm font-semibold text-royal">{FORMAT_LABEL[course.format] ?? "Formation"}</p>
                        <h3 className="mt-2 font-display text-2xl font-bold leading-snug text-navy">{course.title}</h3>
                        {course.description && (
                          <p className="mt-3 line-clamp-3 text-[0.95rem] leading-relaxed text-navy/70">{course.description}</p>
                        )}
                        {(course.duration || price) && (
                          <dl className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm text-navy/80">
                            {course.duration && (
                              <div className="flex items-center gap-1.5">
                                <dt className="sr-only">Durée</dt>
                                <Clock3 className="h-4 w-4 text-royal" aria-hidden="true" />
                                <dd>{course.duration}</dd>
                              </div>
                            )}
                            {price && (
                              <div>
                                <dt className="sr-only">Tarif</dt>
                                <dd className="font-semibold">{price}</dd>
                              </div>
                            )}
                          </dl>
                        )}
                        <Link
                          href={`/ecole/${course.id}/inscription`}
                          className="focus-royal mt-6 inline-flex items-center gap-2 self-start rounded-full text-[0.95rem] font-semibold text-royal underline-offset-4 hover:underline"
                        >
                          Découvrir la formation
                          <span className="sr-only"> : {course.title}</span>
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" aria-hidden="true" />
                        </Link>
                      </div>
                    </article>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
