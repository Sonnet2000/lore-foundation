"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, Copy, Check, Trash2 } from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import type { SubscriberRow } from "./types";

export default function SubscribersPanel() {
  const [items, setItems] = useState<SubscriberRow[] | null>(null);
  const [copied, setCopied] = useState(false);

  // Delete confirm state
  const [deleteTarget, setDeleteTarget] = useState<SubscriberRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/subscribers", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("SubscribersPanel GET error:", res.status, data.error);
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
    } catch (e) {
      console.error("SubscribersPanel fetch failed:", e);
      setItems([]);
    }
  }

  async function copyAll() {
    if (!items || items.length === 0) return;
    await navigator.clipboard.writeText(items.map((s) => s.email).join(", "));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch("/api/admin/subscribers", {
      credentials: "include",
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: deleteTarget.id }),
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

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer cet abonné ?"
        message={`${deleteTarget?.email} sera retiré(e) définitivement de la liste.`}
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            Abonnés ({items.length})
          </h2>
          {items.length > 0 && (
            <button
              type="button"
              onClick={copyAll}
              className="focus-ring flex items-center gap-1.5 rounded-full border border-lore-dark/10 px-4 py-2 text-sm font-semibold text-lore-ink transition-colors hover:bg-lore-cream dark:border-white/10 dark:text-white dark:hover:bg-white/5"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? "Copié !" : "Copier tous les emails"}
            </button>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          Ce sont les personnes qui ont choisi de s&apos;abonner. Utilisez le bouton ✈️
          dans les onglets Annonces et Séminaires pour leur envoyer un email, ou
          « Copier tous les emails » pour les contacter vous-même via votre client mail.
        </p>

        <div className="flex flex-col gap-1.5">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-2xl border border-lore-dark/5 bg-white px-4 py-3 text-sm dark:border-white/5 dark:bg-lore-night-surface"
            >
              <span className="flex items-center gap-2 font-medium text-lore-ink dark:text-white">
                <Mail className="h-4 w-4 shrink-0 text-lore-emerald dark:text-lore-emerald-light" />
                {item.email}
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs text-lore-ink/40 dark:text-white/40">
                  {new Date(item.created_at).toLocaleDateString("fr-FR")}
                </span>
                <button
                  type="button"
                  onClick={() => setDeleteTarget(item)}
                  aria-label={`Supprimer ${item.email}`}
                  className="focus-ring flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/30 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-white/30"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
              Aucun abonné pour le moment.
            </p>
          )}
        </div>
      </div>
    </>
  );
}
