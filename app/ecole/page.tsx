import type { Metadata } from "next";
import { listPublishedCourses } from "@/lib/school";
import EcoleClient from "./EcoleClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "École — Loré Foundation",
  description:
    "Découvrez les formations professionnelles offertes par Loré Foundation à Cap-Haïtien : développement web, design graphique, cybersécurité et plus. Inscrivez-vous en ligne.",
  alternates: { canonical: "/ecole" },
};

export default async function EcolePage() {
  const courses = await listPublishedCourses();
  return <EcoleClient courses={courses} />;
}
