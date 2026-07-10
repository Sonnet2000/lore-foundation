import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { listCoursesForStudent } from "@/lib/school";
import KouListView from "./KouListView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mes cours",
  robots: { index: false, follow: false },
};

export default async function KouPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const items = await listCoursesForStudent(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Kou yo</h1>
        <p className="mt-1 text-sm text-white/50">
          Enskri nan yon kou epi tann admin apwouve ou anvan ou ka wè devwa yo.
        </p>
      </div>

      <KouListView items={items} />
    </div>
  );
}
