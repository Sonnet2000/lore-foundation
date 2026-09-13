"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/ecole-portail/client";

export default function EcoleNav() {
  const supabase = createClient();
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setReady(true);
        return;
      }
      const { data } = await supabase.from("profiles").select("role").eq("id", user.id).single();
      setRole(data?.role ?? null);
      setReady(true);
    })();
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/ecole/portail/login");
    router.refresh();
  }

  if (!ready || !role || pathname === "/ecole/portail/login") return null;

  const links = [
    { href: "/ecole/portail/dashboard", label: "Tablo bò" },
    { href: "/ecole/portail/courses", label: "Kou" },
    { href: "/ecole/portail/attendance", label: "Prezans" },
    { href: "/ecole/portail/certificates", label: "Sètifika" },
    { href: "/ecole/portail/notifications", label: "Notifikasyon" },
    ...(role === "staff" || role === "admin"
      ? [{ href: "/ecole/portail/admin/create-account", label: "Kreye kont" }]
      : []),
    ...(role === "admin" ? [{ href: "/ecole/portail/admin/settings", label: "Paramèt" }] : []),
  ];

  return (
    <nav className="sticky top-0 z-20 border-b border-white/5 bg-lore-ink dark:bg-lore-night">
      <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-6 py-3">
        <div className="flex items-center gap-1 overflow-x-auto">
          <Image src="/app/lore-school-icon.png" alt="" width={28} height={28} className="mr-2 shrink-0 rounded-lg" />
          {links.map((l) => {
            const active = pathname === l.href;
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  active ? "bg-lore-gold-gradient text-lore-ink" : "text-white/60 hover:text-white"
                }`}
              >
                {l.label}
              </Link>
            );
          })}
        </div>
        <button onClick={handleLogout} className="shrink-0 text-xs font-semibold text-white/50 hover:text-red-300">
          Dekonekte
        </button>
      </div>
    </nav>
  );
}
