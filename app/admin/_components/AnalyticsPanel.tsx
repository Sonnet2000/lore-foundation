"use client";

import { useEffect, useState } from "react";
import { Loader2, Eye, Users2, TrendingUp, Globe2 } from "lucide-react";
import { StatCard } from "./ui";
import type { AnalyticsSummary } from "./types";

const WEEKDAY = ["Dim", "Lun", "Mar", "Mèk", "Jed", "Van", "Sam"];

export default function AnalyticsPanel() {
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/analytics", { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Erè pandan chajman estatistik yo.");
        return;
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const maxViews = Math.max(1, ...data.daily.map((d) => d.views));

  return (
    <div className="flex flex-col gap-6">
      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Vizit — jodi a" value={data.viewsToday} icon={Eye} hint={`${data.visitorsToday} vizitè inik`} />
        <StatCard label="Vizit — 7 jou" value={data.views7d} icon={TrendingUp} hint={`${data.visitors7d} vizitè inik`} />
        <StatCard label="Vizit — 30 jou" value={data.views30d} icon={Globe2} hint={`${data.visitors30d} vizitè inik`} />
        <StatCard label="Total depi kòmansman" value={data.totalViews} icon={Users2} />
      </div>

      {/* Bar chart 30 derniers jours */}
      <div className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
        <h3 className="mb-4 font-display text-sm font-bold text-lore-ink dark:text-white">
          Vizit — 30 dènye jou
        </h3>
        <div className="flex h-32 items-end gap-[3px]">
          {data.daily.map((d) => {
            const h = Math.max(2, Math.round((d.views / maxViews) * 100));
            const date = new Date(d.date + "T00:00:00");
            return (
              <div key={d.date} className="group relative flex-1">
                <div
                  className="w-full rounded-t-sm bg-lore-emerald/70 transition-colors group-hover:bg-lore-emerald dark:bg-lore-emerald-light/60 dark:group-hover:bg-lore-emerald-light"
                  style={{ height: `${h}%` }}
                />
                <div className="pointer-events-none absolute bottom-full left-1/2 mb-1.5 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-lore-ink px-2 py-1 text-[10px] font-semibold text-white group-hover:block dark:bg-white dark:text-lore-ink">
                  {date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })} · {d.views} vizit
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-2 flex justify-between text-[10px] text-lore-ink/30 dark:text-white/30">
          <span>{WEEKDAY[new Date(data.daily[0]?.date + "T00:00:00").getDay()]} {data.daily[0]?.date.slice(5)}</span>
          <span>Jodi a</span>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Top pages */}
        <div className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
          <h3 className="mb-3 font-display text-sm font-bold text-lore-ink dark:text-white">
            Paj ki pi vizite (30 jou)
          </h3>
          <div className="flex flex-col gap-2">
            {data.topPages.length === 0 && (
              <p className="text-sm text-lore-ink/40 dark:text-white/40">Poko gen done.</p>
            )}
            {data.topPages.map((p) => (
              <div key={p.path} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-lore-ink dark:text-white">{p.path}</span>
                <span className="ml-3 shrink-0 rounded-full bg-lore-emerald/10 px-2.5 py-0.5 text-xs font-semibold text-lore-emerald dark:text-lore-emerald-light">
                  {p.views}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top referrers */}
        <div className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
          <h3 className="mb-3 font-display text-sm font-bold text-lore-ink dark:text-white">
            Kote vizitè yo soti
          </h3>
          <div className="flex flex-col gap-2">
            {data.topReferrers.length === 0 && (
              <p className="text-sm text-lore-ink/40 dark:text-white/40">
                Sitou aksè dirèk (moun ki tape lyen an dirèkteman).
              </p>
            )}
            {data.topReferrers.map((r) => (
              <div key={r.referrer} className="flex items-center justify-between text-sm">
                <span className="truncate font-medium text-lore-ink dark:text-white">{r.referrer}</span>
                <span className="ml-3 shrink-0 rounded-full bg-lore-emerald/10 px-2.5 py-0.5 text-xs font-semibold text-lore-emerald dark:text-lore-emerald-light">
                  {r.views}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
