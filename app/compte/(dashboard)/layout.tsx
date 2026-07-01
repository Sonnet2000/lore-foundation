import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/account";
import AccountSidebarNav from "@/components/account/AccountSidebarNav";

export default async function AccountDashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/compte/connexion");
  }

  const profile = await getOrCreateProfile(user.id);
  const displayName = profile.full_name || user.email?.split("@")[0] || "Membre";
  const initials = displayName
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="min-h-screen bg-lore-gradient-dark">
      <header className="sticky top-0 z-30 border-b border-white/10 bg-lore-night/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/10">
              <Image src="/logo.png" alt="Loré Foundation" fill className="object-contain p-1" />
            </span>
            <span className="hidden font-display text-base font-bold text-white sm:inline">Loré Foundation</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <span className="hidden text-sm text-white/60 sm:inline">{displayName}</span>
            {profile.avatar_url ? (
              <div className="relative h-8 w-8 overflow-hidden rounded-full ring-1 ring-white/15">
                <Image src={profile.avatar_url} alt={displayName} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lore-gold-gradient text-xs font-bold text-lore-dark">
                {initials || "?"}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:px-8 lg:flex-row lg:gap-10 lg:py-12">
        <aside className="lg:w-56 lg:shrink-0">
          <div className="lg:sticky lg:top-24 lg:rounded-2xl lg:bg-white/[0.03] lg:p-3 lg:ring-1 lg:ring-white/10">
            <AccountSidebarNav />
          </div>
        </aside>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
