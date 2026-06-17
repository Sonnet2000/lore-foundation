"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FolderKanban, Layers, Users, Quote, LogOut, ExternalLink } from "lucide-react";
import PortfolioPanel from "./PortfolioPanel";
import ServicesPanel from "./ServicesPanel";
import TeamPanel from "./TeamPanel";
import TestimonialsPanel from "./TestimonialsPanel";

const tabs = [
  { id: "portfolio", label: "Portfolio", icon: FolderKanban },
  { id: "services", label: "Services", icon: Layers },
  { id: "team", label: "Équipe", icon: Users },
  { id: "testimonials", label: "Témoignages", icon: Quote },
] as const;

type TabId = (typeof tabs)[number]["id"];

export default function Dashboard() {
  const router = useRouter();
  const [active, setActive] = useState<TabId>("portfolio");

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      <header className="sticky top-0 z-20 border-b border-lore-dark/5 bg-white/90 backdrop-blur-sm dark:border-white/5 dark:bg-lore-night/90">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <div>
            <p className="font-display text-base font-bold text-lore-ink dark:text-white">
              Loré Foundation
            </p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Panneau d&apos;administration</p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="focus-ring inline-flex items-center gap-1.5 rounded-full border border-lore-dark/10 px-4 py-2 text-xs font-semibold text-lore-ink/70 transition-colors hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
            >
              Voir le site
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <button
              type="button"
              onClick={handleLogout}
              className="focus-ring inline-flex items-center gap-1.5 rounded-full bg-lore-dark/5 px-4 py-2 text-xs font-semibold text-lore-ink/70 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:bg-white/5 dark:text-white/70"
            >
              <LogOut className="h-3.5 w-3.5" />
              Déconnexion
            </button>
          </div>
        </div>

        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-5 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActive(tab.id)}
              className={`focus-ring flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                active === tab.id
                  ? "bg-lore-emerald text-white"
                  : "text-lore-ink/60 hover:bg-lore-dark/5 dark:text-white/60 dark:hover:bg-white/5"
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-5 py-8">
        {active === "portfolio" && <PortfolioPanel />}
        {active === "services" && <ServicesPanel />}
        {active === "team" && <TeamPanel />}
        {active === "testimonials" && <TestimonialsPanel />}
      </main>
    </div>
  );
}
