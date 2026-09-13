"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export default function NotificationsPage() {
  const supabase = createClient();
  const [role, setRole] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ title: "", body: "", target: "role", role: "student" });

  async function load() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return;
    setUserId(user.id);

    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    setRole(profile?.role ?? null);

    const { data: notifs } = await supabase
      .from("notifications")
      .select("id, title, body, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    setNotifications(notifs ?? []);

    const { data: reads } = await supabase.from("notification_reads").select("notification_id").eq("user_id", user.id);
    setReadIds(new Set((reads ?? []).map((r) => r.notification_id)));
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function markRead(id: string) {
    if (!userId || readIds.has(id)) return;
    setReadIds((prev) => new Set(prev).add(id));
    await supabase.from("notification_reads").insert({ notification_id: id, user_id: userId });
  }

  async function compose(e: React.FormEvent) {
    e.preventDefault();
    const payload: any = { title: form.title, body: form.body || null };
    if (form.target === "role") payload.target_role = form.role;
    else payload.target_user_id = form.target;

    await supabase.from("notifications").insert(payload);
    setForm({ title: "", body: "", target: "role", role: "student" });
    load();
  }

  if (loading) return <p className="p-10 text-sm text-slate-400">Chajman...</p>;

  const isStaffOrAdmin = role === "staff" || role === "admin";

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="mb-6 text-2xl font-semibold text-[#0B1F3B]">Notifikasyon</h1>

      {isStaffOrAdmin && (
        <form onSubmit={compose} className="mb-8 space-y-3 rounded-xl bg-white p-5 shadow-sm">
          <h2 className="font-semibold text-[#0B1F3B]">Voye yon notifikasyon</h2>
          <input
            placeholder="Tit"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <textarea
            placeholder="Kontni (opsyonèl)"
            value={form.body}
            onChange={(e) => setForm({ ...form, body: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="student">Tout etidyan</option>
            <option value="staff">Tout anplwaye</option>
          </select>
          <button className="rounded-lg bg-[#1E4FD8] px-4 py-2 text-sm font-medium text-white hover:bg-[#173da8]">
            Voye
          </button>
        </form>
      )}

      <div className="space-y-2">
        {notifications.length === 0 && <p className="text-sm text-slate-400">Ou pa gen notifikasyon.</p>}
        {notifications.map((n) => {
          const isRead = readIds.has(n.id);
          return (
            <div
              key={n.id}
              onClick={() => markRead(n.id)}
              className={`cursor-pointer rounded-xl p-4 shadow-sm ${isRead ? "bg-white" : "bg-blue-50"}`}
            >
              <div className="flex items-center justify-between">
                <p className={`text-sm font-medium ${isRead ? "text-slate-700" : "text-[#0B1F3B]"}`}>{n.title}</p>
                {!isRead && <span className="h-2 w-2 rounded-full bg-[#1E4FD8]" />}
              </div>
              {n.body && <p className="mt-1 text-sm text-slate-500">{n.body}</p>}
              <p className="mt-1 text-xs text-slate-400">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}
