"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, ImageOff, Loader2 } from "lucide-react";
import {
  FieldLabel,
  TextInput,
  TextArea,
  PrimaryButton,
  GhostButton,
  RowCard,
} from "./ui";
import ImageListField from "./ImageListField";
import ConfirmModal from "./ConfirmModal";
import type { PortfolioRow } from "./types";

const emptyForm = { title: "", category: "", description: "", images: [] as string[] };

export default function PortfolioPanel() {
  const [items, setItems] = useState<PortfolioRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PortfolioRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const res = await fetch("/api/admin/portfolio");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  function startNew() {
    setForm(emptyForm);
    setEditingId("new");
    setError(null);
  }

  function startEdit(item: PortfolioRow) {
    setForm({
      title: item.title,
      category: item.category,
      description: item.description,
      images: item.images ?? [],
    });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSave() {
    if (!form.title.trim()) {
      setError("Le titre est requis.");
      return;
    }
    setSaving(true);
    setError(null);

    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/admin/portfolio" : `/api/admin/portfolio/${editingId}`, {
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Échec de l'enregistrement.");
      return;
    }

    setEditingId(null);
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/portfolio/${deleteTarget.id}`, { method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    refresh();
  }`, { method: "DELETE" });
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
        title="Supprimer ce projet ?"
        message="Ce projet sera supprimé du portfolio définitivement."
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
          Portfolio ({items.length})
        </h2>
        {editingId === null && (
          <PrimaryButton onClick={startNew}>
            <Plus className="h-4 w-4" />
            Nouveau projet
          </PrimaryButton>
        )}
      </div>

      {editingId !== null && (
        <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Titre du projet</FieldLabel>
              <TextInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Loré Store Enligne"
              />
            </div>
            <div>
              <FieldLabel>Catégorie</FieldLabel>
              <TextInput
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="E-commerce"
              />
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel>Description</FieldLabel>
            <TextArea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="Une courte description du projet, visible quand un client clique sur la carte."
            />
          </div>

          <div className="mt-4">
            <ImageListField
              label="Photos du projet"
              values={form.images}
              onChange={(images) => setForm({ ...form, images })}
              folder="portfolio"
            />
          </div>

          {error && <p className="mt-3 text-sm text-red-500">{error}</p>}

          <div className="mt-5 flex items-center gap-3">
            <PrimaryButton onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              Enregistrer
            </PrimaryButton>
            <GhostButton onClick={() => setEditingId(null)} disabled={saving}>
              Annuler
            </GhostButton>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <RowCard
            key={item.id}
            title={item.title}
            subtitle={`${item.category} · ${item.images?.length ?? 0} photo(s)`}
            thumbnail={
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-lore-dark/5 dark:bg-white/5">
                {item.images?.[0] ? (
                  <Image src={item.images[0]} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lore-ink/20 dark:text-white/20">
                    <ImageOff className="h-5 w-5" />
                  </div>
                )}
              </div>
            }
            onEdit={() => startEdit(item)}
            onDelete={() => setDeleteTarget(item)}
          />
        ))}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
            Aucun projet pour le moment.
          </p>
        )}
      </div>
    </div>
    </>
  );
}
