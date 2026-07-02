import "server-only";
import { getSupabase } from "@/lib/supabase";

export type DailyStat = { date: string; views: number; visitors: number };
export type TopPage = { path: string; views: number };

export type AnalyticsSummary = {
  totalViews: number;
  totalVisitors: number;
  viewsToday: number;
  visitorsToday: number;
  views7d: number;
  visitors7d: number;
  views30d: number;
  visitors30d: number;
  daily: DailyStat[]; // 30 jou pase yo, pi ansyen an premye
  topPages: TopPage[]; // top 8 paj pi popilè yo (30 jou pase)
  topReferrers: { referrer: string; views: number }[];
};

function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const supabase = getSupabase();

  const now = new Date();
  const since30 = new Date(now);
  since30.setDate(since30.getDate() - 30);

  // Total views depi konmansman (rapid, san chaje tout liy yo).
  const { count: totalViews } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true });

  // Dènye 30 jou yo — sa sèvi pou tout lòt kalkil (jounalye, top paj, visitè).
  const { data: rows } = await supabase
    .from("page_views")
    .select("path, visitor_id, referrer, created_at")
    .gte("created_at", since30.toISOString())
    .order("created_at", { ascending: true })
    .limit(20000);

  const list = rows ?? [];

  const todayKey = dayKey(startOfDay(now));
  const since7 = new Date(now);
  since7.setDate(since7.getDate() - 7);

  const dailyMap = new Map<string, { views: number; visitors: Set<string> }>();
  const pageMap = new Map<string, number>();
  const referrerMap = new Map<string, number>();
  const visitors30 = new Set<string>();
  const visitors7 = new Set<string>();
  const visitorsToday = new Set<string>();

  for (const row of list) {
    const createdAt = new Date(row.created_at as string);
    const key = dayKey(startOfDay(createdAt));
    const visitorId = (row.visitor_id as string) ?? "?";

    if (!dailyMap.has(key)) dailyMap.set(key, { views: 0, visitors: new Set() });
    const bucket = dailyMap.get(key)!;
    bucket.views += 1;
    bucket.visitors.add(visitorId);

    visitors30.add(visitorId);
    if (createdAt >= since7) visitors7.add(visitorId);
    if (key === todayKey) visitorsToday.add(visitorId);

    const path = (row.path as string) || "/";
    pageMap.set(path, (pageMap.get(path) ?? 0) + 1);

    const ref = (row.referrer as string) || "";
    if (ref) {
      try {
        const host = new URL(ref).hostname.replace(/^www\./, "");
        referrerMap.set(host, (referrerMap.get(host) ?? 0) + 1);
      } catch {
        // referrer envalid — ignore
      }
    }
  }

  // Konstwi seri jounalye konplè pou 30 jou yo (menm si gen jou san vizit).
  const daily: DailyStat[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = dayKey(startOfDay(d));
    const bucket = dailyMap.get(key);
    daily.push({ date: key, views: bucket?.views ?? 0, visitors: bucket?.visitors.size ?? 0 });
  }

  const views7d = daily.slice(-7).reduce((sum, d) => sum + d.views, 0);
  const views30d = list.length;
  const viewsToday = daily[daily.length - 1]?.views ?? 0;

  const topPages: TopPage[] = [...pageMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([path, views]) => ({ path, views }));

  const topReferrers = [...referrerMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([referrer, views]) => ({ referrer, views }));

  return {
    totalViews: totalViews ?? 0,
    totalVisitors: visitors30.size, // estimasyon: visitè inik sou 30 dènye jou
    viewsToday,
    visitorsToday: visitorsToday.size,
    views7d,
    visitors7d: visitors7.size,
    views30d,
    visitors30d: visitors30.size,
    daily,
    topPages,
    topReferrers,
  };
}
