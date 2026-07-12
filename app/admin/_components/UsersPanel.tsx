"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Loader2,
  Search,
  Ban,
  ShieldCheck,
  Trash2,
  Mail,
  Phone,
  Gift,
  CreditCard,
  CalendarCheck,
  ChevronDown,
  ChevronUp,
  Download,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { StatCard } from "./ui";
import type { UserRow } from "./types";

function formatMoney(amount: number) {
  return `${amount.toLocaleString("fr-FR")} HTG`;
}

function csvEscape(value: string | number) {
  const s = String(value ?? "");
  if (/[",\n;]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function exportCsv(rows: UserRow[]) {
  const headers = [
    "Non", "Imèl", "Telefòn", "Dat enskripsyon", "Dènye koneksyon", "Bloke",
    "Kantite kontribisyon", "Total kontribisyon (HTG)", "Kantite peman", "Total peman (HTG)", "Enskripsyon seminè",
  ];
  const lines = rows.map((u) =>
    [
      u.full_name,
      u.email,
      u.phone,
      new Date(u.created_at).toLocaleDateString("fr-FR"),
      u.last_sign_in_at ? new Date(u.last_sign_in_at).toLocaleDateString("fr-FR") : "",
      u.banned ? "Wi" : "Non",
      u.donationsCount,
      u.donationsTotal,
      u.paymentsCount,
      u.paymentsTotal,
      u.seminarsCount,
    ]
      .map(csvEscape)
      .join(",")
  );
  const csv = "\uFEFF" + [headers.map(csvEscape).join(","), ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `itilizate-lore-foundation-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

type Segment = "all" | "donors" | "banned";

function initials(name: string, email: string) {
  const source = name.trim() || email;
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");
}

export default function UsersPanel() {
  const [items, setItems] = useState<UserRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [segment, setSegment] = useState<Segment>("all");
  const [expanded, setExpanded] = useState<string | null>(null);

  const [banTarget, setBanTarget] = useState<UserRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/users", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Erè pandan chajman itilizatè yo.");
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setItems([]);
    }
  }

  async function toggleBan() {
    if (!banTarget) return;
    setBusy(true);
    await fetch(`/api/admin/users/${banTarget.id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ banned: !banTarget.banned }),
    });
    setBusy(false);
    setBanTarget(null);
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setBusy(true);
    await fetch(`/api/admin/users/${deleteTarget.id}`, {
      credentials: "include",
      method: "DELETE",
    });
    setBusy(false);
    setDeleteTarget(null);
    refresh();
  }

  const filtered = useMemo(() => {
    if (!items) return [];
    let list = items;
    if (segment === "donors") {
      list = list.filter((u) => u.donationsCount > 0 || u.paymentsCount > 0);
    } else if (segment === "banned") {
      list = list.filter((u) => u.banned);
    }
    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (u) =>
        u.email.toLowerCase().includes(q) ||
        u.full_name.toLowerCase().includes(q) ||
        u.phone.toLowerCase().includes(q)
    );
  }, [items, query, segment]);

  if (error) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (items === null) {
    return (
      <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const totalDonations = items.reduce((sum, u) => sum + u.donationsTotal + u.paymentsTotal, 0);
  const donorsCount = items.filter((u) => u.donationsCount > 0 || u.paymentsCount > 0).length;
  const activeThisMonth = items.filter((u) => {
    if (!u.last_sign_in_at) return false;
    const d = new Date(u.last_sign_in_at);
    const now = new Date();
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
  }).length;

  return (
    <>
      <ConfirmModal
        open={!!banTarget}
        title={banTarget?.banned ? "Debloke kont sa a ?" : "Bloke kont sa a ?"}
        message={
          banTarget?.banned
            ? `${banTarget?.email} ap ka konekte ankò.`
            : `${banTarget?.email} p ap ka konekte ankò sou espas manm nan jiskaske ou debloke l.`
        }
        confirmLabel={banTarget?.banned ? "Debloke" : "Bloke"}
        danger={!banTarget?.banned}
        loading={busy}
        onConfirm={toggleBan}
        onCancel={() => setBanTarget(null)}
      />
      <ConfirmModal
        open={!!deleteTarget}
        title="Efase kont sa a definitivman ?"
        message={`Kont ${deleteTarget?.email} ap efase pou tout tan. Istorik kontribisyon/peman li yo ap rete (san kont ki lye ak yo), men li p ap ka konekte ankò.`}
        confirmLabel="Efase kont lan"
        danger
        loading={busy}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <StatCard label="Kont enskri" value={items.length} icon={ShieldCheck} />
          <StatCard label="Aktif mwa sa a" value={activeThisMonth} icon={CalendarCheck} />
          <StatCard label="Moun ki kontribye" value={donorsCount} icon={Gift} />
          <StatCard label="Total kontribisyon" value={formatMoney(totalDonations)} icon={CreditCard} />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1.5">
            {(
              [
                { id: "all", label: `Tout moun (${items.length})` },
                { id: "donors", label: `Moun ki kontribye (${donorsCount})` },
                { id: "banned", label: `Bloke (${items.filter((u) => u.banned).length})` },
              ] as { id: Segment; label: string }[]
            ).map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setSegment(s.id)}
                className={`focus-ring rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  segment === s.id
                    ? "bg-lore-emerald text-white"
                    : "border border-lore-dark/10 text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/60 dark:hover:bg-white/5"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => exportCsv(filtered)}
            disabled={filtered.length === 0}
            className="focus-ring flex items-center justify-center gap-1.5 rounded-full border border-lore-dark/10 px-4 py-2 text-xs font-semibold text-lore-ink/70 transition-colors hover:bg-lore-cream disabled:opacity-40 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
          >
            <Download className="h-3.5 w-3.5" />
            Ekspòte CSV ({filtered.length})
          </button>
        </div>

        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-lore-ink/30 dark:text-white/30" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chèche pa non, imèl oswa telefòn..."
            className="w-full rounded-full border border-lore-dark/10 bg-white py-2.5 pl-10 pr-4 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white"
          />
        </div>

        <div className="flex flex-col gap-2">
          {filtered.map((u) => {
            const isOpen = expanded === u.id;
            return (
              <div
                key={u.id}
                className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface"
              >
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : u.id)}
                  className="flex w-full items-center gap-3 p-3 text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-sm font-bold text-lore-emerald dark:text-lore-emerald-light">
                    {initials(u.full_name, u.email)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-lore-ink dark:text-white">
                      {u.full_name || "(San non)"}
                      {u.banned && (
                        <span className="ml-2 rounded-full bg-red-500/10 px-2 py-0.5 text-[10px] font-bold uppercase text-red-500">
                          Bloke
                        </span>
                      )}
                    </p>
                    <p className="truncate text-xs text-lore-ink/50 dark:text-white/50">{u.email}</p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-lore-ink/40 dark:text-white/40 sm:block">
                    Enskri {new Date(u.created_at).toLocaleDateString("fr-FR")}
                  </span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-lore-ink/40 dark:text-white/40" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-lore-ink/40 dark:text-white/40" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-lore-dark/5 p-4 dark:border-white/5">
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      <div className="flex items-center gap-2 text-lore-ink/70 dark:text-white/70">
                        <Mail className="h-3.5 w-3.5 shrink-0" /> {u.email}
                      </div>
                      <div className="flex items-center gap-2 text-lore-ink/70 dark:text-white/70">
                        <Phone className="h-3.5 w-3.5 shrink-0" /> {u.phone || "—"}
                      </div>
                      <div className="flex items-center gap-2 text-lore-ink/70 dark:text-white/70">
                        <Gift className="h-3.5 w-3.5 shrink-0" />
                        {u.donationsCount} kontribisyon · {formatMoney(u.donationsTotal)}
                      </div>
                      <div className="flex items-center gap-2 text-lore-ink/70 dark:text-white/70">
                        <CreditCard className="h-3.5 w-3.5 shrink-0" />
                        {u.paymentsCount} peman · {formatMoney(u.paymentsTotal)}
                      </div>
                      <div className="flex items-center gap-2 text-lore-ink/70 dark:text-white/70">
                        <CalendarCheck className="h-3.5 w-3.5 shrink-0" />
                        {u.seminarsCount} enskripsyon seminè
                      </div>
                      <div className="text-lore-ink/50 dark:text-white/50">
                        Dènye koneksyon :{" "}
                        {u.last_sign_in_at
                          ? new Date(u.last_sign_in_at).toLocaleDateString("fr-FR")
                          : "Jamè"}{" "}
                        · {u.provider}
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <button
                        type="button"
                        onClick={() => setBanTarget(u)}
                        className={`focus-ring flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
                          u.banned
                            ? "border-lore-emerald/30 text-lore-emerald hover:bg-lore-emerald/10 dark:text-lore-emerald-light"
                            : "border-lore-dark/10 text-lore-ink/70 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
                        }`}
                      >
                        {u.banned ? <ShieldCheck className="h-3.5 w-3.5" /> : <Ban className="h-3.5 w-3.5" />}
                        {u.banned ? "Debloke" : "Bloke kont"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(u)}
                        className="focus-ring flex items-center gap-1.5 rounded-full border border-red-500/20 px-4 py-2 text-xs font-semibold text-red-500 transition-colors hover:bg-red-500/10"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Efase kont
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
              {items.length === 0 ? "Poko gen kont itilizatè enskri." : "Pa gen rezilta pou rechèch la."}
            </p>
          )}
        </div>
      </div>
    </>
  );
}
