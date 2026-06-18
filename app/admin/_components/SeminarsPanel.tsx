"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Calendar, Users, ChevronDown, Send } from "lucide-react";
import {
  FieldLabel,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  RowCard,
} from "./ui";
import MediaListField, { type MediaItem } from "./MediaListField";
import ConfirmModal from "./ConfirmModal";
import type { SeminarRow, RegistrationRow } from "./types";

type FormState = {
  title: string;
  description: string;
  starts_at: string;
  location: string;
  registration_open: boolean;
  is_published: boolean;
  media: MediaItem[];
};

const emptyForm: FormState = {
  title: "",
  description: "",
  starts_at: "",
  location: "",
  registration_open: true,
  is_published: true,
  media: [],
};

function isoToLocalInput(iso: string | null): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function localInputToIso(value: string): string | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function formatDate(iso: string | null) {
  if (!iso) return "Date à venir";
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" });
}

export default function SeminarsPanel() {
  const [items, setItems] = useState<SeminarRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [registrationsFor, setRegistrationsFor] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<RegistrationRow[] | null>(null);
  const [notifyingId, setNotifyingId] = useState<string | null>(null);
  const [notifyResult, setNotifyResult] = useState<{ id: string; text: string } | null>(null);

  // Confirm modals
  const [deleteTarget, setDeleteTarget] = useState<SeminarRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notifyTarget, setNotifyTarget] = useState<SeminarRow | null>(null);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const res = await fetch("/api/admin/seminars");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  function startNew() { setForm(emptyForm); setEditingId("new"); setError(null); }

  function startEdit(item: SeminarRow) {
    setForm({
      title: item.title,
      description: item.description,
      starts_at: isoToLocalInput(item.starts_at),
      location: item.location,
      registration_open: item.registration_open,
      is_published: item.is_published,
      media: item.media ?? [],
    });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim()) { setError("Le titre est requis."); return; }
    setSaving(true); setError(null);
    const isNew = editingId === "new";
    const payload = { ...form, starts_at: localInputToIso(form.starts_at) };
    const res = await fetch(isNew ? "/api/admin/seminars" : `/api/admin/seminars/${editingId}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setError(data.error || "Échec de l'enregistrement."); return; }
    setEditingId(null);
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/seminars/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    if (registrationsFor === deleteTarget.id) setRegistrationsFor(null);
    refresh();
  }

  async function toggleRegistrations(id: string) {
    if (registrationsFor === id) { setRegistrationsFor(null); return; }
    setRegistrationsFor(id); setRegistrations(null);
    const res = await fetch(`/api/admin/seminars/${id}/registrations`);
    const data = await res.json();
    setRegistrations(data.items ?? []);
  }

  async function confirmNotify() {
    if (!notifyTarget) return;
    const id = notifyTarget.id;
    setNotifyTarget(null);
    setNotifyingId(id); setNotifyResult(null);
    const res = await fetch(`/api/admin/seminars/${id}/notify`, { method: "POST" });
    const data = await res.json();
    setNotifyingId(null);
    setNotifyResult({
      id,
      text: res.ok
        ? `Envoyé à ${data.sent} abonné(e)${data.sent === 1 ? "" : "s"} !`
        : data.error || "Échec de l'envoi.",
    });
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
        title="Supprimer ce séminaire ?"
        message={`« ${deleteTarget?.title} » et toutes ses inscriptions seront supprimés définitivement.`}
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmModal
        open={!!notifyTarget}
        title="Notifier les abonnés ?"
        message={`Un email sera envoyé à tous les abonnés pour le séminaire « ${notifyTarget?.title} ».`}
        confirmLabel="Envoyer"
        onConfirm={confirmNotify}
        onCancel={() => setNotifyTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            Séminaires ({items.length})
          </h2>
          {editingId === null && (
            <PrimaryButton onClick={startNew}>
              <Plus className="h-4 w-4" />
              Nouveau séminaire
            </PrimaryButton>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          Un séminaire n&apos;apparaît sur le site que s&apos;il est « publié ». Désactivez
          « Inscriptions ouvertes » une fois les places comblées sans masquer la page.
        </p>

        {editingId !== null && (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Titre du séminaire</FieldLabel>
                <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Séminaire : Réussir sa transition digitale" />
              </div>
              <div>
                <FieldLabel>Date et heure</FieldLabel>
                <TextInput type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
              </div>
            </div>
            <div className="mt-4">
              <FieldLabel>Lieu</FieldLabel>
              <TextInput value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Cap-Haïtien, Nord, Haïti — ou un lien Zoom/Meet" />
            </div>
            <div className="mt-4">
              <FieldLabel>Description</FieldLabel>
              <TextArea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Présentez le séminaire..." />
            </div>
            <div className="mt-4">
              <MediaListField label="Photos / vidéos du séminaire" values={form.media} onChange={(media) => setForm({ ...form, media })} folder="seminars" />
            </div>
            <div className="mt-4 flex flex-wrap gap-5">
              <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                Publié (visible sur le site)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                <input type="checkbox" checked={form.registration_open} onChange={(e) => setForm({ ...form, registration_open: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                Inscriptions ouvertes
              </label>
            </div>
            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}
            <div className="mt-5 flex items-center gap-3">
              <PrimaryButton onClick={handleSave} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                Enregistrer
              </PrimaryButton>
              <GhostButton onClick={() => setEditingId(null)} disabled={saving}>Annuler</GhostButton>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-2">
              <RowCard
                title={item.title}
                subtitle={`${formatDate(item.starts_at)}${item.is_published ? "" : " · Non publié"}${item.registration_open ? "" : " · Inscriptions fermées"}${item.notified_at ? ` · Notifié le ${new Date(item.notified_at).toLocaleDateString("fr-FR")}` : ""}`}
                thumbnail={
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light">
                    <Calendar className="h-5 w-5" />
                  </div>
                }
                extraAction={
                  item.is_published && (
                    <button
                      type="button"
                      onClick={() => setNotifyTarget(item)}
                      disabled={notifyingId === item.id}
                      aria-label="Notifier les abonnés"
                      title="Notifier les abonnés"
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
                <p className="ml-[60px] text-xs font-medium text-lore-ink/60 dark:text-white/60">{notifyResult.text}</p>
              )}

              <button
                type="button"
                onClick={() => toggleRegistrations(item.id)}
                className="focus-ring ml-[60px] flex items-center gap-1.5 self-start text-xs font-semibold text-lore-emerald hover:text-lore-dark dark:text-lore-emerald-light"
              >
                <Users className="h-3.5 w-3.5" />
                Voir les inscriptions
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${registrationsFor === item.id ? "rotate-180" : ""}`} />
              </button>

              {registrationsFor === item.id && (
                <div className="ml-[60px] rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
                  {registrations === null ? (
                    <Loader2 className="h-4 w-4 animate-spin text-lore-ink/40 dark:text-white/40" />
                  ) : registrations.length === 0 ? (
                    <p className="text-sm text-lore-ink/40 dark:text-white/40">Aucune inscription pour le moment.</p>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs font-semibold text-lore-ink/50 dark:text-white/50">{registrations.length} inscrit(e)s</p>
                      {registrations.map((r) => (
                        <div key={r.id} className="flex flex-col gap-0.5 border-b border-lore-dark/5 pb-2 text-sm last:border-0 dark:border-white/5">
                          <span className="font-semibold text-lore-ink dark:text-white">{r.name}</span>
                          <span className="text-lore-ink/60 dark:text-white/60">{r.email}{r.phone ? ` · ${r.phone}` : ""}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Aucun séminaire pour le moment.</p>
          )}
        </div>
      </div>
    </>
  );
}
