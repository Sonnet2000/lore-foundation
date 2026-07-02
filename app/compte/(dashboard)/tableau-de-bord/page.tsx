import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile, getAccountOverview } from "@/lib/account";
import DashboardView from "./DashboardView";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Tableau de bord",
  robots: { index: false, follow: false },
};

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // La mise en page parente redirige déjà si non connecté ; ceci est une
  // garde de sécurité supplémentaire pour TypeScript et pour la robustesse.
  if (!user) return null;

  const [profile, overview] = await Promise.all([
    getOrCreateProfile(user.id),
    getAccountOverview(user.id, user.email ?? ""),
  ]);

  return (
    <DashboardView
      displayName={profile.full_name || user.email?.split("@")[0] || "Membre"}
      email={user.email ?? ""}
      memberSince={profile.created_at}
      overview={overview}
    />
  );
}
