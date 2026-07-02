import type { Metadata } from "next";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/account";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Mon profil",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const profile = await getOrCreateProfile(user.id);
  const hasPasswordProvider = (user.app_metadata?.providers as string[] | undefined)?.includes("email") ?? true;

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Mon profil</h1>
        <p className="mt-1 text-sm text-white/50">Gérez vos informations personnelles</p>
      </div>

      <ProfileForm
        email={user.email ?? ""}
        fullName={profile.full_name}
        phone={profile.phone}
        avatarUrl={profile.avatar_url}
        showPasswordSection={hasPasswordProvider}
      />
    </div>
  );
}
