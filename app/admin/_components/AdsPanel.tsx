"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Megaphone, ExternalLink } from "lucide-react";
import { FieldLabel, TextInput, TextArea, PrimaryButton, GhostButton, RowCard } from "./ui";
import ImageUploadField from "./ImageUploadField";
import ConfirmModal from "./ConfirmModal";
import type { AdRow } from "./types";

type AdForm = {
  title: string;
  description: string;
  image_url: string | null;
  link_url: string;
  cta_label: string;
  is_published: boolean;
  starts_at: string;
  ends_at: string;
};

const emptyForm: AdForm = {
  title: "", description: "", image_url: null, link_url: "", cta_label: "En savoir plus",
  is_published: true, starts_at: "", ends_at: "",
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

export default function AdsPanel() {
  const [items, setItems] = useState<AdRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<AdForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const res = await fetch("/api/admin/ads", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setItems(res.ok ? data.items ?? [] : []);
  }

  function startNew() { setForm(emptyForm); setEditingId("new"); setError(null); }

  function startEdit(ad: AdRow) {
    setForm({
      title: ad.title,
      description: ad.description,
      image_url: ad.image_url,
      link_url: ad.link_url ?? "",
      cta_label: ad.cta_label,
      is_published: ad.is_published,
      starts_at: isoToLocalInput(ad.starts_at),
      ends_at: isoToLocalInput(ad.ends_at),
    });
    setEditingId(ad.id);
    setError(null);
  }

  async function save() {
    if (!form.title.trim()) { setError("Tit la obligatwa."); return; }
    if (!form.image_url) { setError("Yon foto obligatwa."); return; }
    setSaving(true); setError(null);
    const isNew = editingId === "new";
    const payload = {
      ...form,
      starts_at: localInputToIso(form.starts_at),
      ends_at: localInputToIso(form.ends_at),
    };
    const res = await fetch(isNew ? "/api/admin/ads" : `/api/admin/ads/${editingId}`, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(data.error || "Echèk anrejistreman."); return; }
    setEditingId(null);
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/ads/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    refresh();
  }

  async function togglePublish(ad: AdRow) {
    setItems((prev) => prev?.map((a) => (a.id === ad.id ? { ...a, is_published: !a.is_published } : a)) ?? null);
    await fetch(`/api/admin/ads/${ad.id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !ad.is_published }),
    });
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
        title="Efase piblisite sa a ?"
        message={`« ${deleteTarget?.title} » ap efase pou tout tan.`}
        confirmLabel="Efase"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Piblisite ({items.length})</h2>
          {editingId === null && (
            <PrimaryButton onClick={startNew}><Plus className="h-4 w-4" />Nouvo piblisite</PrimaryButton>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          Chak piblisite gen yon foto, yon deskripsyon ak yon lyen. Yo parèt nan seksyon &laquo; Espace
          Publicitaire &raquo; sou paj akèy la, nan lòd &laquo; sort_order &raquo; la. Ou ka mete yon dat
          kòmansman/fen si se yon kanpay tanporè.
        </p>

        {editingId !== null && (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <FieldLabel>Titre</FieldLabel>
            <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Promo -20% ce mois-ci" />

            <div className="mt-4">
              <FieldLabel>Description</FieldLabel>
              <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Décrivez l'offre ou le message..." />
            </div>

            <div className="mt-4">
              <ImageUploadField label="Photo / bannière" value={form.image_url} onChange={(url) => setForm({ ...form, image_url: url })} folder="ads" />
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Lien (URL)</FieldLabel>
                <TextInput value={form.link_url} onChange={(e) => setForm({ ...form, link_url: e.target.value })} placeholder="https://... ou /ecole" />
              </div>
              <div>
                <FieldLabel>Texte du bouton</FieldLabel>
                <TextInput value={form.cta_label} onChange={(e) => setForm({ ...form, cta_label: e.target.value })} placeholder="En savoir plus" />
              </div>
            </div>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Début (optionnel)</FieldLabel>
                <TextInput type="datetime-local" value={form.starts_at} onChange={(e) => setForm({ ...form, starts_at: e.target.value })} />
              </div>
              <div>
                <FieldLabel>Fin (optionnel)</FieldLabel>
                <TextInput type="datetime-local" value={form.ends_at} onChange={(e) => setForm({ ...form, ends_at: e.target.value })} />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                Publié (visible sur le site)
              </label>
            </div>

            {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

            <div className="mt-5 flex items-center gap-3">
              <PrimaryButton onClick={save} disabled={saving}>
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}Anrejistre
              </PrimaryButton>
              <GhostButton onClick={() => setEditingId(null)} disabled={saving}>Anile</GhostButton>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-2">
          {items.map((ad) => (
            <div key={ad.id} className="flex flex-col gap-2">
              <RowCard
                title={ad.title}
                subtitle={`${ad.is_published ? "Publié" : "Non publié"}${ad.link_url ? ` · ${ad.link_url}` : ""}`}
                thumbnail={
                  ad.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ad.image_url} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lore-gold/10 text-lore-gold-dark">
                      <Megaphone className="h-5 w-5" />
                    </div>
                  )
                }
                onEdit={() => startEdit(ad)}
                onDelete={() => setDeleteTarget(ad)}
              />
              <div className="ml-[60px] flex items-center gap-4">
                <button type="button" onClick={() => togglePublish(ad)}
                  className="focus-ring text-xs font-semibold text-lore-ink/50 hover:text-lore-emerald dark:text-white/50">
                  {ad.is_published ? "Dépublier" : "Publier"}
                </button>
                {ad.link_url && (
                  <a href={ad.link_url} target="_blank" rel="noopener noreferrer"
                    className="focus-ring inline-flex items-center gap-1 text-xs font-semibold text-lore-blue hover:text-lore-dark">
                    <ExternalLink className="h-3 w-3" />Tester lyen an
                  </a>
                )}
              </div>
            </div>
          ))}

          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Pa gen piblisite kounye a.</p>
          )}
        </div>
      </div>
    </>
  );
}
