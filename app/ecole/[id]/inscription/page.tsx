import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPublishedCourseById } from "@/lib/school";
import InscriptionClient from "./InscriptionClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Enskripsyon — École Loré Foundation",
  robots: { index: false, follow: false },
};

export default async function InscriptionPage({ params }: { params: { id: string } }) {
  const course = await getPublishedCourseById(params.id);
  if (!course) redirect("/ecole");

  return <InscriptionClient course={course} />;
}
