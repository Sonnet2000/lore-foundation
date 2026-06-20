"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, X, ExternalLink, ChevronDown, ChevronUp, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import type { PaymentRow, PaymentStatus, PaymentMethod, PaymentPurpose } from "./types";

const METHOD_LABEL: Record<PaymentMethod, string> = {
  moncash:  "📱 MonCash",
  natcash:  "📲 NatCash",
  sogebank: "🏦 Sogebank",
  autre:    "💳 Autre",
};
const PURPOSE_LABEL: Record<PaymentPurpose, string> = {
  sponsor:  "Sponsoring",
  service:  "Service",
  seminar:  "Séminaire",
  autre:    "Autre",
};
const STATUS_LABEL: Record<PaymentStatus, { label: string; color: string }> = {
  pending:   { label: "En attente",  color: "text-amber-500" },
  confirmed: { label: "Confirmé",    color: "text-emerald-500" },
  rejected:  { label: "Rejeté",      color: "text-red-500" },
};

export default function PaymentsPanel() {
  const [items, setItems] = useState<PaymentRow[] | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PaymentRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/payments", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("PaymentsPanel GET error:", res.status, data.error);
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
    } catch (e) {
      console.error("PaymentsPanel fetch failed:", e);
      setItems([]);
    }
  }

  async function updateStatus(id: string, status: PaymentStatus) {
    await fetch(`/api/admin/payments/${id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/payments/${deleteTarget.id}`, {
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

  const pending   = items.filter(i => i.status === "pending");
  const confirmed = items.filter(i => i.status === "confirmed");
  const rejected  = items.filter(i => i.status === "rejected");

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer ce paiement ?"
        message="Ce paiement sera supprimé définitivement."
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            Paiements ({items.length})
          </h2>
          <div className="flex gap-3 text-xs">
            <span className="text-amber-500 font-semibold">{pending.length} en attente</span>
            <span className="text-emerald-500 font-semibold">{confirmed.length} confirmés</span>
          </div>
        </div>

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
            Aucun paiement soumis pour le moment.
          </p>
        )}

        {[...pending, ...confirmed, ...rejected].map((item) => {
          const st = STATUS_LABEL[item.status];
          const isOpen = expanded === item.id;
          return (
            <div key={item.id}
              className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface">
              <button type="button"
                onClick={() => setExpanded(isOpen ? null : item.id)}
                className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="shrink-0 text-xl">{METHOD_LABEL[item.method].split(" ")[0]}</div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-sm text-lore-ink dark:text-white">
                      {item.sender_name}
                      <span className="ml-2 font-bold text-lore-blue">
                        {Number(item.amount).toLocaleString("fr-FR")} {item.currency}
                      </span>
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-lore-ink/50 dark:text-white/50">
                        {METHOD_LABEL[item.method].split(" ").slice(1).join(" ")} · {PURPOSE_LABEL[item.purpose]}
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

              {isOpen && (
                <div className="border-t border-lore-dark/5 dark:border-white/5 px-5 py-4 flex flex-col gap-4">
                  <div className="grid grid-cols-1 gap-2 text-sm">
                    {item.sender_phone && <Row label="Téléphone" value={item.sender_phone} />}
                    {item.reference && <Row label="Référence" value={item.reference} />}
                    {item.note && <Row label="Note" value={item.note} />}
                    <Row label="Date" value={new Date(item.created_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} />
                    {item.proof_url && (
                      <div className="flex items-center gap-2">
                        <span className="w-24 shrink-0 text-lore-ink/40 dark:text-white/40">Preuve</span>
                        <a href={item.proof_url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-lore-blue hover:underline text-sm">
                          Voir le reçu <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {item.status !== "confirmed" && (
                      <button type="button" onClick={() => updateStatus(item.id, "confirmed")}
                        className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/20 dark:text-emerald-400">
                        <Check className="h-3.5 w-3.5" /> Confirmer
                      </button>
                    )}
                    {item.status !== "rejected" && (
                      <button type="button" onClick={() => updateStatus(item.id, "rejected")}
                        className="flex items-center gap-1.5 rounded-full bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-500/20">
                        <X className="h-3.5 w-3.5" /> Rejeter
                      </button>
                    )}
                    {item.status !== "pending" && (
                      <button type="button" onClick={() => updateStatus(item.id, "pending")}
                        className="flex items-center gap-1.5 rounded-full bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-600 hover:bg-amber-500/20">
                        Remettre en attente
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
