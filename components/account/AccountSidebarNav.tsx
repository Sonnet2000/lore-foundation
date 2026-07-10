"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UserRound, GraduationCap } from "lucide-react";
import LogoutButton from "./LogoutButton";

const links = [
  { href: "/compte/tableau-de-bord", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/compte/kou", label: "Mes cours", icon: GraduationCap },
  { href: "/compte/profil", label: "Mon profil", icon: UserRound },
];

export default function AccountSidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1">
      {links.map((link) => {
        const active = pathname === link.href;
        const Icon = link.icon;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`focus-ring flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
              active
                ? "bg-lore-gold/12 text-lore-gold-light ring-1 ring-lore-gold/20"
                : "text-white/60 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon className="h-4 w-4" />
            {link.label}
          </Link>
        );
      })}
      <div className="mt-2 border-t border-white/10 pt-2">
        <LogoutButton />
      </div>
    </nav>
  );
}
