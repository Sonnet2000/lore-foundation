"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FolderKanban, Layers, Users, Quote, LogOut, ExternalLink,
  Megaphone, Calendar, Mail, HandHeart, CreditCard,
  LayoutDashboard, ChevronRight, AlertTriangle, CheckCircle2,
  Settings,
} from "lucide-react";
import PortfolioPanel       from "./PortfolioPanel";
import ServicesPanel        from "./ServicesPanel";
import TeamPanel            from "./TeamPanel";
import TestimonialsPanel    from "./TestimonialsPanel";
import AnnouncementsPanel   from "./AnnouncementsPanel";
import SeminarsPanel        from "./SeminarsPanel";
import SubscribersPanel     from "./SubscribersPanel";
import SponsorsPanel        from "./SponsorsPanel";
import PaymentsPanel        from "./PaymentsPanel";
import PaymentMethodsPanel  from "./PaymentMethodsPanel";

const TABS = [
  { id: "portfolio",     label: "Réalisations",  icon: FolderKanban,   group: "Contenu" },
  { id: "services",      label: "Programmes",    icon: Layers,         group: "Contenu" },
  { id: "team",          label: "Équipe",        icon: Users,          group: "Contenu" },
  { id: "testimonials",  label: "Témoignages",   icon: Quote,          group: "Contenu" },
  { id: "announcements", label: "Annonces",      icon: Megaphone,      group: "Contenu" },
  { id: "seminars",      label: "Séminaires",    icon: Calendar,       group: "Contenu" },
  { id: "sponsors",        label: "Partenaires",   icon: HandHeart,   group: "Engagement" },
  { id: "payments",        label: "Contributions", icon: CreditCard,  group: "Engagement" },
  { id: "payment-methods", label: "Méthodes paiem",icon: Settings,    group: "Engagement" },
  { id: "subscribers",     label: "Abonnés",       icon: Mail,        group: "Engagement" },
] as const;

type TabId = (typeof TABS)[number]["id"];

const TAB_META: Record<TabId, { desc: string }> = {
  portfolio:     { desc: "Gérez les actions et réalisations de la fondation" },
  services:      { desc: "Gérez les programmes et initiatives" },
  team:          { desc: "Bénévoles, formateurs et coordinateurs" },
  testimonials:  { desc: "Histoires d'impact et témoignages" },
  announcements: { desc: "Annonces visibles en haut du site" },
  seminars:      { desc: "Séminaires et formations à venir" },
  sponsors:          { desc: "Partenaires, sponsors et organisations collaboratrices" },
  payments:          { desc: "Contributions et soutiens financiers reçus" },
  "payment-methods": { desc: "Configurez MonCash, NatCash, Sogebank et autres méthodes" },
  subscribers:       { desc: "Personnes inscrites à la newsletter" },
};

export default function Dashboard() {
  const router = useRouter();
  const [active, setActive] = useState<TabId>("portfolio");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/admin/logout", { credentials: "include", method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  const contentTabs   = TABS.filter(t => t.group === "Contenu");
  const engageTabs    = TABS.filter(t => t.group === "Engagement");
  const activeTab     = TABS.find(t => t.id === active)!;

  return (
    <div className="flex min-h-screen bg-[#f0f2f7] dark:bg-[#0a0f1a]">

      {/* ── Sidebar desktop ────────────────────────────────────────── */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-black/5 bg-white dark:border-white/5 dark:bg-[#0f1623]">
        {/* Logo */}
        <div className="flex items-center gap-3 border-b border-black/5 dark:border-white/5 px-6 py-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-lore-blue text-white text-sm font-bold">LF</div>
          <div>
            <p className="font-display font-bold text-sm text-lore-ink dark:text-white">Loré Foundation</p>
            <p className="text-[10px] text-lore-ink/40 dark:text-white/40">Administration</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
          <SideGroup label="Contenu du site" tabs={contentTabs} active={active} onSelect={setActive} />
          <SideGroup label="Engagement & Finance" tabs={engageTabs} active={active} onSelect={setActive} />
        </nav>

        {/* Footer */}
        <div className="border-t border-black/5 dark:border-white/5 px-3 py-4 flex flex-col gap-2">
          <a href="/" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-lore-ink/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5 transition-colors">
            <ExternalLink className="h-4 w-4" />
            Voir le site
          </a>
          <button type="button" onClick={handleLogout}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-lore-ink/60 hover:bg-red-500/10 hover:text-red-500 dark:text-white/60 transition-colors">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* ── Mobile overlay sidebar ──────────────────────────────────── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white dark:bg-[#0f1623] flex flex-col">
            <div className="flex items-center justify-between border-b border-black/5 dark:border-white/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-lore-blue text-white text-xs font-bold">LF</div>
                <p className="font-display font-bold text-sm text-lore-ink dark:text-white">Loré Foundation</p>
              </div>
              <button type="button" onClick={() => setSidebarOpen(false)} className="text-lore-ink/40 dark:text-white/40 text-xl">✕</button>
            </div>
            <nav className="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-6">
              <SideGroup label="Contenu du site" tabs={contentTabs} active={active} onSelect={(id) => { setActive(id); setSidebarOpen(false); }} />
              <SideGroup label="Engagement & Finance" tabs={engageTabs} active={active} onSelect={(id) => { setActive(id); setSidebarOpen(false); }} />
            </nav>
            <div className="border-t border-black/5 dark:border-white/5 px-3 py-4 flex flex-col gap-2">
              <a href="/" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-lore-ink/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5">
                <ExternalLink className="h-4 w-4" /> Voir le site
              </a>
              <button type="button" onClick={handleLogout}
                className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-lore-ink/60 hover:bg-red-500/10 hover:text-red-500 dark:text-white/60">
                <LogOut className="h-4 w-4" /> Déconnexion
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ── Main content ────────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col min-w-0">

        {/* Topbar */}
        <header className="sticky top-0 z-20 flex items-center gap-4 border-b border-black/5 bg-white/95 backdrop-blur-md dark:border-white/5 dark:bg-[#0f1623]/95 px-5 py-3">
          {/* Burger mobile */}
          <button type="button" onClick={() => setSidebarOpen(true)}
            className="lg:hidden flex flex-col gap-1.5 p-1.5">
            <span className="block h-0.5 w-5 bg-lore-ink dark:bg-white" />
            <span className="block h-0.5 w-5 bg-lore-ink dark:bg-white" />
            <span className="block h-0.5 w-3 bg-lore-ink dark:bg-white" />
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm min-w-0">
            <LayoutDashboard className="h-4 w-4 shrink-0 text-lore-ink/30 dark:text-white/30" />
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-lore-ink/20 dark:text-white/20" />
            <span className="font-semibold text-lore-ink dark:text-white truncate">{activeTab.label}</span>
          </div>

          {/* Actions topbar desktop */}
          <div className="ml-auto hidden sm:flex items-center gap-2">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-lore-ink/70 hover:bg-black/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5 transition-colors">
              <ExternalLink className="h-3.5 w-3.5" /> Voir le site
            </a>
            <button type="button" onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-lore-ink/70 hover:bg-red-500/10 hover:text-red-500 dark:border-white/10 dark:text-white/70 transition-colors">
              <LogOut className="h-3.5 w-3.5" /> Déconnexion
            </button>
          </div>
        </header>

        {/* Mobile tabs scroll */}
        <div className="lg:hidden overflow-x-auto border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#0f1623]">
          <div className="flex gap-1 px-4 py-2 min-w-max">
            {TABS.map(tab => (
              <button key={tab.id} type="button" onClick={() => setActive(tab.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-2 text-xs font-semibold transition-colors ${
                  active === tab.id
                    ? "bg-lore-blue text-white"
                    : "text-lore-ink/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
                }`}>
                <tab.icon className="h-3.5 w-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Page header */}
        <div className="border-b border-black/5 dark:border-white/5 bg-white dark:bg-[#0f1623] px-6 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-lore-blue/10 text-lore-blue dark:bg-lore-blue/15">
              <activeTab.icon className="h-5 w-5" />
            </div>
            <div>
              <h1 className="font-display font-bold text-lore-ink dark:text-white">{activeTab.label}</h1>
              <p className="text-xs text-lore-ink/50 dark:text-white/50">{TAB_META[active].desc}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 px-5 py-6 sm:px-8">
          <AdminStatusBanner />
          {active === "portfolio"     && <PortfolioPanel />}
          {active === "services"      && <ServicesPanel />}
          {active === "team"          && <TeamPanel />}
          {active === "testimonials"  && <TestimonialsPanel />}
          {active === "announcements" && <AnnouncementsPanel />}
          {active === "seminars"      && <SeminarsPanel />}
          {active === "sponsors"         && <SponsorsPanel />}
          {active === "payments"         && <PaymentsPanel />}
          {active === "payment-methods"  && <PaymentMethodsPanel />}
          {active === "subscribers"      && <SubscribersPanel />}
        </main>
      </div>
    </div>
  );
}

function SideGroup({
  label, tabs, active, onSelect,
}: {
  label: string;
  tabs: readonly (typeof TABS)[number][];
  active: TabId;
  onSelect: (id: TabId) => void;
}) {
  return (
    <div>
      <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-lore-ink/30 dark:text-white/30">
        {label}
      </p>
      <div className="flex flex-col gap-0.5">
        {tabs.map(tab => (
          <button key={tab.id} type="button" onClick={() => onSelect(tab.id)}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors text-left ${
              active === tab.id
                ? "bg-lore-blue/10 text-lore-blue dark:bg-lore-blue/20 dark:text-blue-300 font-semibold"
                : "text-lore-ink/60 hover:bg-black/5 dark:text-white/60 dark:hover:bg-white/5"
            }`}>
            <tab.icon className="h-4 w-4 shrink-0" />
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── Bannière de statut système ─────────────────────────────────────────────
function AdminStatusBanner() {
  const [status, setStatus] = useState<{
    ok: boolean;
    env: Record<string, boolean | string>;
    supabase: { connected: boolean; error: string | null };
  } | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    fetch("/api/admin/debug", { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        setStatus(d);
        // Montre bannye sèlman si gen yon pwoblèm
        const hasIssue = !d.supabase?.connected
          || !d.env?.SUPABASE_URL
          || !d.env?.SUPABASE_SERVICE_ROLE_KEY
          || !d.env?.ADMIN_PASSWORD
          || !d.env?.SESSION_SECRET;
        setVisible(hasIssue);
      })
      .catch(() => setVisible(false));
  }, []);

  if (!visible || !status) return null;

  const missing = Object.entries(status.env)
    .filter(([k, v]) => v === false && k !== "RESEND_API_KEY")
    .map(([k]) => k);

  return (
    <div className="mb-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 px-5 py-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm text-amber-700 dark:text-amber-300">
            Problème de configuration détecté
          </p>
          {missing.length > 0 && (
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">
              Variables manquantes sur Vercel : <strong>{missing.join(", ")}</strong>
            </p>
          )}
          {!status.supabase.connected && (
            <p className="mt-1 text-xs text-amber-600/80 dark:text-amber-400/80">
              Supabase : {status.supabase.error || "non connecté"}
            </p>
          )}
          <p className="mt-2 text-xs text-amber-600/70 dark:text-amber-400/70">
            → Allez dans <strong>Vercel → Settings → Environment Variables</strong> et vérifiez ces clés.
          </p>
        </div>
        <button type="button" onClick={() => setVisible(false)}
          className="text-amber-500/50 hover:text-amber-500 text-lg leading-none">✕</button>
      </div>
    </div>
  );
}
