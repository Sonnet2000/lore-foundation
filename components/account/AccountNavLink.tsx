"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { UserRound } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Session = {
  displayName: string;
  avatarUrl: string | null;
} | null;

export default function AccountNavLink({ variant = "desktop" }: { variant?: "desktop" | "mobile" }) {
  const [session, setSession] = useState<Session>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();

    supabase.auth.getUser().then(({ data }) => {
      const user = data.user;
      setSession(
        user
          ? {
              displayName:
                (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "Membre",
              avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
            }
          : null
      );
      setReady(true);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, sessionState) => {
      const user = sessionState?.user;
      setSession(
        user
          ? {
              displayName:
                (user.user_metadata?.full_name as string | undefined) || user.email?.split("@")[0] || "Membre",
              avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
            }
          : null
      );
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  if (!ready) return null;

  if (variant === "mobile") {
    return session ? (
      <Link
        href="/compte/tableau-de-bord"
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-white/10 py-4 text-base font-bold text-white"
      >
        <UserRound className="h-4 w-4" />
        Mon compte
      </Link>
    ) : (
      <Link
        href="/compte/connexion"
        className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-white/10 py-4 text-base font-bold text-white"
      >
        <UserRound className="h-4 w-4" />
        Connexion
      </Link>
    );
  }

  if (session) {
    return (
      <Link
        href="/compte/tableau-de-bord"
        className="focus-ring flex items-center gap-2 rounded-full p-1 pr-3 ring-1 ring-white/10 transition-colors hover:ring-white/25"
        aria-label="Mon compte"
      >
        {session.avatarUrl ? (
          <div className="relative h-7 w-7 overflow-hidden rounded-full">
            <Image src={session.avatarUrl} alt={session.displayName} fill className="object-cover" />
          </div>
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-lore-gold-gradient text-[11px] font-bold text-lore-dark">
            {session.displayName.slice(0, 1).toUpperCase()}
          </div>
        )}
        <span className="max-w-[9rem] truncate text-sm font-medium text-white/85">{session.displayName}</span>
      </Link>
    );
  }

  return (
    <Link
      href="/compte/connexion"
      className="focus-ring inline-flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-white/75 ring-1 ring-white/10 transition-colors hover:text-white hover:ring-white/25"
    >
      <UserRound className="h-4 w-4" />
      Connexion
    </Link>
  );
}
