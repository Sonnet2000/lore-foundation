"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Megaphone, Check, Send } from "lucide-react";
import { FieldLabel, TextInput, TextArea, PrimaryButton, GhostButton, RowCard } from "./ui";
import ConfirmModal from "./ConfirmModal";
import type { AnnouncementRow } from "./types";

const emptyForm = { message: "", link_url: "", link_label: "", is_active: true };

export default function AnnouncementsPanel() {
  const [items, setItems] = useState<AnnouncementRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifyResult, setNotifyResult] = useState<{ id: string; text: string } | null>(null);

  // Confirm modal state
  const [deleteTarget, setDeleteTarget] = useState<AnnouncementRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<AnnouncementRow | null>(null);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/announcements", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("AnnouncementsPanel GET error:", res.status, data.error);
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
    } catch (e) {
      console.error("AnnouncementsPanel fetch failed:", e);
      setItems([]);
    }
  }

  function startNew() { setForm(emptyForm); setEditingId("new"); setError(null); }

  function startEdit(item: AnnouncementRow) {
    setForm({ message: item.message, link_url: item.link_url ?? "", link_label: item.link_label ?? "", is_active: item.is_active });
    setEditingId(item.id); setError(null);
  }

  async function handleSave() {
    if (!form.message.trim()) { setError("Le message est requis."); return; }
    setSaving(true); setError(null);
    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/admin/announcements" : `/api/admin/announcements/${editingId}`, { credentials: "include", 
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Échec de l'enregistrement."); return; }
    setEditingId(null); refresh();
  }

  async function toggleActive(item: AnnouncementRow) {
    await fetch(`/api/admin/announcements/${item.id}`, { credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !item.is_active }),
    });
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/announcements/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setDeleting(false); setDeleteTarget(null); refresh();
  }

  async function confirmNotify() {
    if (!notifyTarget) return;
    const id = notifyTarget.id;
    setNotifyTarget(null); setNotifyingId(id); setNotifyResult(null);
    const res = await fetch(`/api/admin/announcements/${id}/notify`, { credentials: "include", method: "POST" });
    const data = await res.json();
    setNotifyingId(null);
    setNotifyResult({ id, text: res.ok ? `Envoyé à ${data.sent} abonné(e)${data.sent === 1 ? "" : "s"} !` : data.error || "Échec de l'envoi." });
    if (res.ok) refresh();
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
        title="Supprimer cette annonce ?"
        message="Cette annonce sera supprimée définitivement."
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!notifyTarget}
        title="Notifier les abonnés ?"
        message="Un email sera envoyé à tous les abonnés pour cette annonce."
        confirmLabel="Envoyer"
        onConfirm={confirmNotify}
        onCancel={() => setNotifyTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            Annonces ({items.length})
          </h2>
          {editingId === null && (
            <PrimaryButton onClick={startNew}><Plus className="h-4 w-4" />Nouvelle annonce</PrimaryButton>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          L&apos;annonce active la plus récente s&apos;affiche dans une bannière en haut du site.
          Une seule annonce active s&apos;affiche à la fois.
        </p>

        {editingId !== null && (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <FieldLabel>Message</FieldLabel>
            <TextArea rows={2} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="🎉 Inscriptions ouvertes pour notre prochain séminaire !" />
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Lien (optionnel)</FieldLabel>
                <TextInput value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="#seminaires" />
              </div>
              <div>
                <FieldLabel>Texte du lien</FieldLabel>
                <TextInput value={form.link_label} onChange={(e) => setForm({ ...form, link_label: e.target.value })} placeholder="En savoir plus" />
              </div>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
              Annonce active (visible sur le site)
            </label>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <div className="mt-5 flex items-center gap-3">
              <PrimaryButton onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}Enregistrer
              </PrimaryButton>
              <GhostButton onClick={() => setEditingId(null)} disabled={saving}>Annuler</GhostButton>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-1.5">
              <RowCard
                title={item.message}
                subtitle={item.is_active ? (item.notified_at ? `Active · Notifiée le ${new Date(item.notified_at).toLocaleDateString("fr-FR")}` : "Active") : "Inactive"}
                thumbnail={
                  <button type="button" onClick={() => toggleActive(item)} aria-label={item.is_active ? "Désactiver" : "Activer"}
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-colors ${item.is_active ? "bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light" : "bg-lore-dark/5 text-lore-ink/30 dark:bg-white/5 dark:text-white/30"}`}
                  >
                    {item.is_active ? <Check className="h-5 w-5" /> : <Megaphone className="h-5 w-5" />}
                  </button>
                }
                extraAction={
                  item.is_active && (
                    <button type="button" onClick={() => setNotifyTarget(item)} disabled={notifyingId === item.id}
                      aria-label="Notifier les abonnés" title="Notifier les abonnés"
                      className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lore-ink/50 hover:bg-lore-dark/5 hover:text-lore-gold-dark disabled:opacity-50 dark:text-white/50 dark:hover:bg-white/5 dark:hover:text-lore-gold-light"
                    >
                      {notifyingId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </button>
                  )
                }
                onEdit={() => startEdit(item)}
                onDelete={() => setDeleteTarget(item)}
              />
              {notifyResult?.id === item.id && (
                <p className="pl-2 text-xs font-medium text-lore-ink/60 dark:text-white/60">{notifyResult.text}</p>
              )}
            </div>
          ))}
          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Aucune annonce pour le moment.</p>
          )}
        </div>
      </div>
    </>
  );
}
