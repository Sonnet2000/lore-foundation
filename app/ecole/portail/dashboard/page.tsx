"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/ecole-portail/client";

const roleLabels: Record<string, string> = {
  admin: "Administratè",
  staff: "Anplwaye",
  student: "Etidyan",
};

const DAY_LABELS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"]; // 1..7

// JS Date.getDay() : 0=Dimanch...6=Samdi → schema class_schedule : 1=Lendi...7=Dimanch
function jsToSchemaDay(jsDay: number) {
  return jsDay === 0 ? 7 : jsDay;
}

export default function DashboardPage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        window.location.href = "/ecole/portail/login";
        return;
      }
      const { data } = await supabase
        .from("profiles")
        .select("id, full_name, role, staff_role, matricule")
        .eq("id", user.id)
        .single();
      setProfile(data);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p className="p-10 text-sm text-lore-ink/40 dark:text-white/40">Chajman...</p>;

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <p className="text-sm text-lore-ink/50 dark:text-white/50">
        {roleLabels[profile?.role] ?? "Kont"}
        {profile?.staff_role ? ` · ${profile.staff_role}` : ""}
      </p>
      <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">
        Byenveni, {profile?.full_name ?? ""}
      </h1>
      {profile?.matricule && (
        <p className="mt-1 text-sm text-lore-ink/40 dark:text-white/40">Matrikil : {profile.matricule}</p>
      )}

      {profile?.role === "student" && <StudentHome studentId={profile.id} />}
      {(profile?.role === "staff" || profile?.role === "admin") && <StaffHome />}
    </main>
  );
}

// ─────────────────────────────────────────────────────────────────
// ETIDYAN — enspire pa yon layout "Kou jodi a" + orè semèn + tenmlin,
// men ak koulè/idantite Loré (gold/navy) olye yon pale jenerik.
// ─────────────────────────────────────────────────────────────────
function StudentHome({ studentId }: { studentId: string }) {
  const supabase = createClient();
  const [weekSchedule, setWeekSchedule] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState(jsToSchemaDay(new Date().getDay()));
  const [stats, setStats] = useState<{ attendance: number | null; quizAvg: number | null; coursesCount: number }>({
    attendance: null,
    quizAvg: null,
    coursesCount: 0,
  });

  useEffect(() => {
    (async () => {
      const { data: schedule } = await supabase
        .from("class_schedule")
        .select("id, day_of_week, start_time, end_time, room, courses ( id, name, code )")
        .order("start_time");
      setWeekSchedule(schedule ?? []);

      const { data: attendanceRows } = await supabase.from("attendance").select("status").eq("student_id", studentId);
      const total = attendanceRows?.length ?? 0;
      const present = attendanceRows?.filter((r) => r.status === "present" || r.status === "late").length ?? 0;

      const { data: attempts } = await supabase
        .from("quiz_attempts")
        .select("score, total_points")
        .eq("user_id", studentId)
        .eq("status", "completed");
      const avg =
        attempts && attempts.length > 0
          ? Math.round(
              (attempts.reduce((s, a) => s + (a.total_points ? a.score / a.total_points : 0), 0) / attempts.length) * 100
            )
          : null;

      const { count } = await supabase
        .from("enrollments")
        .select("id", { count: "exact", head: true })
        .eq("student_id", studentId);

      setStats({ attendance: total > 0 ? Math.round((present / total) * 100) : null, quizAvg: avg, coursesCount: count ?? 0 });
    })();
  }, [studentId]);

  const todaySchema = jsToSchemaDay(new Date().getDay());
  const todayClasses = weekSchedule.filter((s) => s.day_of_week === todaySchema);
  const nextClass = todayClasses[0];
  const selectedDayClasses = weekSchedule.filter((s) => s.day_of_week === selectedDay);

  return (
    <div className="mt-6 space-y-6">
      {/* Hero "Kou jodi a" */}
      <div className="relative overflow-hidden rounded-3xl bg-lore-gradient p-6 text-white shadow-premium">
        <p className="text-xs font-medium uppercase tracking-wide text-lore-gold-light">Kou jodi a</p>
        {nextClass ? (
          <>
            <p className="mt-2 font-display text-2xl font-bold">{nextClass.courses?.name}</p>
            <p className="mt-1 text-sm text-white/70">
              {nextClass.start_time?.slice(0, 5)} – {nextClass.end_time?.slice(0, 5)}
              {nextClass.room ? ` · Sal ${nextClass.room}` : ""}
            </p>
          </>
        ) : (
          <p className="mt-2 text-sm text-white/70">Ou pa gen kou pwograme jodi a.</p>
        )}
        <Link
          href="/ecole/portail/courses"
          className="btn-gold focus-ring mt-5 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-xs font-bold"
        >
          Gade tout kou yo →
        </Link>
      </div>

      {/* Estatistik rapid */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Kou" value={stats.coursesCount} />
        <StatCard label="To prezans" value={stats.attendance !== null ? `${stats.attendance}%` : "—"} />
        <StatCard label="Mwayèn kiz" value={stats.quizAvg !== null ? `${stats.quizAvg}%` : "—"} />
      </div>

      {/* Orè semèn nan */}
      <div className="rounded-2xl bg-white p-5 shadow-sm dark:bg-lore-night-surface">
        <p className="mb-3 text-sm font-semibold text-lore-ink dark:text-white">Orè semèn nan</p>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DAY_LABELS.map((label, i) => {
            const day = i + 1;
            const isToday = day === todaySchema;
            const isSelected = day === selectedDay;
            const hasClass = weekSchedule.some((s) => s.day_of_week === day);
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`flex min-w-[52px] flex-col items-center rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                  isSelected
                    ? "bg-lore-gold-gradient text-lore-ink shadow-sm"
                    : "bg-lore-cream text-lore-ink/60 dark:bg-white/5 dark:text-white/50"
                }`}
              >
                <span className="text-[11px] font-medium opacity-70">{label}</span>
                <span>{isToday ? "•" : hasClass ? "◦" : ""}</span>
              </button>
            );
          })}
        </div>

        {/* Tenmlin jou seleksyone a */}
        <div className="mt-4 space-y-2">
          {selectedDayClasses.length === 0 && (
            <p className="text-sm text-lore-ink/40 dark:text-white/40">Pa gen kou jou sa a.</p>
          )}
          {selectedDayClasses.map((s) => (
            <div key={s.id} className="flex items-center gap-3 rounded-xl border border-lore-ink/5 p-3 dark:border-white/5">
              <div className="w-14 shrink-0 text-xs font-semibold text-lore-gold-dark dark:text-lore-gold-light">
                {s.start_time?.slice(0, 5)}
              </div>
              <div>
                <p className="text-sm font-medium text-lore-ink dark:text-white">{s.courses?.name}</p>
                {s.room && <p className="text-xs text-lore-ink/40 dark:text-white/40">Sal {s.room}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-white p-4 text-center shadow-sm dark:bg-lore-night-surface">
      <p className="font-display text-xl font-bold text-lore-ink dark:text-white">{value}</p>
      <p className="mt-0.5 text-xs text-lore-ink/50 dark:text-white/50">{label}</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STAFF/ADMIN — kat rapid vè lòt seksyon yo
// ─────────────────────────────────────────────────────────────────
function StaffHome() {
  const links = [
    { href: "/ecole/portail/courses", label: "Kou", desc: "Jere kou, modil ak resous" },
    { href: "/ecole/portail/attendance", label: "Prezans", desc: "Pran prezans pa klas/dat" },
    { href: "/ecole/portail/certificates", label: "Sètifika", desc: "Anrejistre/wè istwa" },
    { href: "/ecole/portail/notifications", label: "Notifikasyon", desc: "Voye enfòmasyon" },
    { href: "/ecole/portail/admin/create-account", label: "Kreye kont", desc: "Etidyan/anplwaye" },
  ];

  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2">
      {links.map((l) => (
        <Link
          key={l.href}
          href={l.href}
          className="rounded-2xl bg-white p-5 shadow-sm transition hover:shadow-md dark:bg-lore-night-surface"
        >
          <p className="font-semibold text-lore-ink dark:text-white">{l.label}</p>
          <p className="mt-1 text-sm text-lore-ink/50 dark:text-white/50">{l.desc}</p>
        </Link>
      ))}
    </div>
  );
}
