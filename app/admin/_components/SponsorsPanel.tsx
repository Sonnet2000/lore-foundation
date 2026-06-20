"use client";

import { useEffect, useState } from "react";
import { Loader2, Globe, Check, X, Eye, EyeOff, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import type { SponsorRow, SponsorTier, SponsorStatus } from "./types";

const TIER_LABEL: Record<SponsorTier, string> = {
  bronze: "🥉 Bronze",
  silver: "🥈 Silver",
  gold:   "🥇 Gold",
};
const STATUS_LABEL: Record<SponsorStatus, { label: string; color: string }> = {
  pending:  { label: "En attente", color: "text-amber-500" },
  approved: { label: "Approuvé",   color: "text-emerald-500" },
  rejected: { label: "Rejeté",     color: "text-red-500" },
};

export default function SponsorsPanel() {
  const [items, setItems] = useState<SponsorRow[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SponsorRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/sponsors", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("SponsorsPanel GET error:", res.status, data.error);
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
    } catch (e) {
      console.error("SponsorsPanel fetch failed:", e);
      setItems([]);
    }
  }

  async function updateStatus(id: string, status: SponsorStatus) {
    await fetch(`/api/admin/sponsors/${id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function togglePublic(item: SponsorRow) {
    await fetch(`/api/admin/sponsors/${item.id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_public: !item.is_public }),
    });
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/sponsors/${deleteTarget.id}`, {
      credentials: "include",
      method: "DELETE",
    });
    setDeleting(false);
    setDeleteTarget(null);
    refresh();
  }

  if (items === null) {
    return (
      <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  const pending  = items.filter(i => i.status === "pending");
  const approved = items.filter(i => i.status === "approved");
  const rejected = items.filter(i => i.status === "rejected");

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer ce sponsor ?"
        message={`La demande de ${deleteTarget?.name} sera supprimée définitivement.`}
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            Sponsors ({items.length})
          </h2>
          <div className="flex gap-3 text-xs text-lore-ink/50 dark:text-white/50">
            <span className="text-amber-500 font-semibold">{pending.length} en attente</span>
            <span className="text-emerald-500 font-semibold">{approved.length} approuvés</span>
          </div>
        </div>

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
            Aucune demande de sponsoring pour le moment.
          </p>
        )}

        {[...pending, ...approved, ...rejected].map((item) => {
          const st = STATUS_LABEL[item.status];
          const isOpen = expanded === item.id;
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface"
            >
              {/* Header */}
              <button
                type="button"
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lore-blue/10 text-sm font-bold text-lore-blue dark:bg-lore-blue/20">
                    {item.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sm text-lore-ink dark:text-white">
                      {item.name}
                      {item.organization && (
                        <span className="ml-1 font-normal text-lore-ink/50 dark:text-white/50">
                          — {item.organization}
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-lore-ink/50 dark:text-white/50">
                        {TIER_LABEL[item.tier]}
                      </span>
                      <span className={`text-xs font-semibold ${st.color}`}>• {st.label}</span>
                    </div>
                  </div>
                </div>
                {isOpen ? (
                  <ChevronUp className="h-4 w-4 shrink-0 text-lore-ink/30 dark:text-white/30" />
                ) : (
                  <ChevronDown className="h-4 w-4 shrink-0 text-lore-ink/30 dark:text-white/30" />
                )}
              </button>

              {/* Détails */}
              {isOpen && (
                <div className="border-t border-lore-dark/5 dark:border-white/5 px-5 py-4 flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    <Row label="Email" value={item.email} />
                    {item.phone && <Row label="Téléphone" value={item.phone} />}
                    {item.website_url && (
                      <div className="flex items-center gap-2">
                        <span className="w-24 shrink-0 text-lore-ink/40 dark:text-white/40">Site web</span>
                        <a href={item.website_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-lore-blue hover:underline truncate">
                          <Globe className="h-3.5 w-3.5" />
                          {item.website_url}
                        </a>
                      </div>
                    )}
                    {item.message && (
                      <div className="flex flex-col gap-1">
                        <span className="text-lore-ink/40 dark:text-white/40">Message</span>
                        <p className="rounded-xl bg-lore-cream dark:bg-white/5 px-4 py-3 text-lore-ink dark:text-white leading-relaxed">
                          {item.message}
                        </p>
                      </div>
                    )}
                    <Row label="Date" value={new Date(item.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" })} />
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.status !== "approved" && (
                      <button type="button" onClick={() => updateStatus(item.id, "approved")}
                        className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> Approuver
                      </button>
                    )}
                    {item.status !== "rejected" && (
                      <button type="button" onClick={() => updateStatus(item.id, "rejected")}
                        className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20">
                        <X className="h-3.5 w-3.5" /> Rejeter
                      </button>
                    )}
                    {item.status === "approved" && (
                      <button type="button" onClick={() => togglePublic(item)}
                        className="flex items-center gap-1.5 rounded-full bg-lore-blue/10 px-4 py-2 text-xs font-semibold text-lore-blue hover:bg-lore-blue/20">
                        {item.is_public ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        {item.is_public ? "Masquer du site" : "Afficher sur le site"}
                      </button>
                    )}
                    <button type="button" onClick={() => setDeleteTarget(item)}
                      className="flex items-center gap-1.5 rounded-full bg-lore-dark/5 px-4 py-2 text-xs font-semibold text-lore-ink/50 hover:bg-red-500/10 hover:text-red-500 dark:bg-white/5 dark:text-white/50">
                      <Trash2 className="h-3.5 w-3.5" /> Supprimer
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <span className="w-24 shrink-0 text-lore-ink/40 dark:text-white/40">{label}</span>
      <span className="text-lore-ink dark:text-white break-all">{value}</span>
    </div>
  );
}
