import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getCourseForStudent } from "@/lib/school";
import KouDetailView from "./KouDetailView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Detay kou",
  robots: { index: false, follow: false },
};

export default async function KouDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const result = await getCourseForStudent(params.id, user.id);
  if (!result) redirect("/compte/kou");

  return <KouDetailView data={result} />;
}
