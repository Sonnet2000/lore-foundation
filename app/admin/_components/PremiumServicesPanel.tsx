"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, X } from "lucide-react";
import { FieldLabel, TextInput, TextArea, SelectInput, PrimaryButton, GhostButton, RowCard } from "./ui";
import ConfirmModal from "./ConfirmModal";
import ImageUploadField from "./ImageUploadField";
import { iconNames, resolveIcon } from "@/lib/icon-map";
import type { PremiumServiceRow } from "./types";

type ServiceForm = {
  title: string;
  description: string;
  price: string;
  image_url: string | null;
  icon: string;
  features: string[];
  is_published: boolean;
  is_featured: boolean;
};

const emptyForm: ServiceForm = {
  title: "", description: "", price: "", image_url: null, icon: "Sparkles", features: [], is_published: true, is_featured: false,
};

export default function PremiumServicesPanel() {
  const [items, setItems] = useState<PremiumServiceRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<ServiceForm>(emptyForm);
  const [featureDraft, setFeatureDraft] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PremiumServiceRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const res = await fetch("/api/admin/premium-services", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setItems(res.ok ? data.items ?? [] : []);
  }

  function startNew() { setForm(emptyForm); setFeatureDraft(""); setEditingId("new"); setError(null); }

  function startEdit(s: PremiumServiceRow) {
    setForm({
      title: s.title, description: s.description, price: s.price, image_url: s.image_url ?? null, icon: s.icon,
      features: s.features ?? [], is_published: s.is_published, is_featured: s.is_featured,
    });
    setFeatureDraft("");
    setEditingId(s.id);
    setError(null);
  }

  function addFeature() {
    const v = featureDraft.trim();
    if (!v) return;
    setForm((f) => ({ ...f, features: [...f.features, v] }));
    setFeatureDraft("");
  }

  function removeFeature(i: number) {
    setForm((f) => ({ ...f, features: f.features.filter((_, idx) => idx !== i) }));
  }

  async function save() {
    if (!form.title.trim()) { setError("Tit la obligatwa."); return; }
    setSaving(true); setError(null);
    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/admin/premium-services" : `/api/admin/premium-services/${editingId}`, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
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
    await fetch(`/api/admin/premium-services/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
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
        title="Efase sèvis sa a ?"
        message={`« ${deleteTarget?.title} » ap efase pou tout tan.`}
        confirmLabel="Efase"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Services Premium ({items.length})</h2>
          {editingId === null && (
            <PrimaryButton onClick={startNew}><Plus className="h-4 w-4" />Nouvo sèvis</PrimaryButton>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          Sèvis ki parèt nan seksyon &laquo; Services Premium &raquo; sou paj akèy la, ak yon pri ak bouton
          &laquo; Commander &raquo; ki mennen dirèkteman sou paj peman Binance lan.
        </p>

        {editingId !== null && (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Titre</FieldLabel>
                <TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Carte Virtuelle" />
              </div>
              <div>
                <FieldLabel>Prix affiché</FieldLabel>
                <TextInput value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} placeholder="À partir de 1 500 HTG" />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploadField
                label="Photo du service"
                value={form.image_url}
                onChange={(url) => setForm({ ...form, image_url: url })}
                folder="premium-services"
              />
            </div>

            <div className="mt-4">
              <FieldLabel>Description</FieldLabel>
              <TextArea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            <div className="mt-4">
              <FieldLabel>Icône</FieldLabel>
              <SelectInput value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
                {iconNames.map((name) => (
                  <option key={name} value={name}>{name}</option>
                ))}
              </SelectInput>
            </div>

            <div className="mt-4">
              <FieldLabel>Caractéristiques (liste à cocher)</FieldLabel>
              <div className="flex flex-col gap-2">
                {form.features.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm dark:bg-lore-night-surface">
                    <span className="flex-1 text-lore-ink dark:text-white">{f}</span>
                    <button type="button" onClick={() => removeFeature(i)} className="focus-ring text-lore-ink/40 hover:text-red-500">
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <TextInput
                    value={featureDraft}
                    onChange={(e) => setFeatureDraft(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addFeature(); } }}
                    placeholder="Ex: Activation rapide"
                  />
                  <GhostButton onClick={addFeature}>Ajouter</GhostButton>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                <input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} className="h-4 w-4 rounded accent-lore-emerald" />
                Publié (visible sur le site)
              </label>
              <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
                <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="h-4 w-4 rounded accent-lore-gold" />
                Mis en avant (badge &laquo; Populaire &raquo;)
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
          {items.map((s) => {
            const Icon = resolveIcon(s.icon);
            return (
              <RowCard
                key={s.id}
                title={s.title}
                subtitle={`${s.price || "Prix non défini"}${s.is_published ? "" : " · Non publié"}${s.is_featured ? " · Mis en avant" : ""}`}
                thumbnail={
                  s.image_url ? (
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-lore-gold/10">
                      <Image src={s.image_url} alt="" fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lore-gold/10 text-lore-gold-dark">
                      <Icon className="h-5 w-5" />
                    </div>
                  )
                }
                onEdit={() => startEdit(s)}
                onDelete={() => setDeleteTarget(s)}
              />
            );
          })}

          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Pa gen sèvis kounye a.</p>
          )}
        </div>
      </div>
    </>
  );
}
