"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, User } from "lucide-react";
import { FieldLabel, TextInput, PrimaryButton, GhostButton, RowCard } from "./ui";
import ImageUploadField from "./ImageUploadField";
import type { TeamRow } from "./types";

const emptyForm = { name: "", role: "", initials: "", photo_url: null as string | null, show_social: false };

export default function TeamPanel() {
  const [items, setItems] = useState<TeamRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const res = await fetch("/api/admin/team");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  function startNew() {
    setForm(emptyForm);
    setEditingId("new");
    setError(null);
  }

  function startEdit(item: TeamRow) {
    setForm({
      name: item.name,
      role: item.role,
      initials: item.initials,
      photo_url: item.photo_url,
      show_social: item.show_social,
    });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSave() {
    if (!form.name.trim()) {
      setError("Le nom est requis.");
      return;
    }
    setSaving(true);
    setError(null);

    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/admin/team" : `/api/admin/team/${editingId}`, {
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

  async function handleDelete(id: string) {
    if (!confirm("Retirer ce membre de l'équipe ?")) return;
    await fetch(`/api/admin/team/${id}`, { method: "DELETE" });
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
          Équipe ({items.length})
        </h2>
        {editingId === null && (
          <PrimaryButton onClick={startNew}>
            <Plus className="h-4 w-4" />
            Ajouter un membre
          </PrimaryButton>
        )}
      </div>

      {editingId !== null && (
        <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Nom complet</FieldLabel>
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Lovedine Laguerre"
              />
            </div>
            <div>
              <FieldLabel>Rôle</FieldLabel>
              <TextInput
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="CEO"
              />
            </div>
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Initiales (badge)</FieldLabel>
              <TextInput
                value={form.initials}
                onChange={(e) => setForm({ ...form, initials: e.target.value.slice(0, 2).toUpperCase() })}
                placeholder="LL"
                maxLength={2}
              />
            </div>
            <label className="flex items-center gap-2 pt-7 text-sm font-medium text-lore-ink/70 dark:text-white/70">
              <input
                type="checkbox"
                checked={form.show_social}
                onChange={(e) => setForm({ ...form, show_social: e.target.checked })}
                className="h-4 w-4 rounded accent-lore-emerald"
              />
              Afficher les réseaux sociaux
            </label>
          </div>

          <div className="mt-4">
            <ImageUploadField
              label="Photo"
              value={form.photo_url}
              onChange={(url) => setForm({ ...form, photo_url: url })}
              folder="team"
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
            title={item.name}
            subtitle={item.role}
            thumbnail={
              <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-lore-dark/5 dark:bg-white/5">
                {item.photo_url ? (
                  <Image src={item.photo_url} alt="" fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-lore-ink/20 dark:text-white/20">
                    <User className="h-5 w-5" />
                  </div>
                )}
              </div>
            }
            onEdit={() => startEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
            Aucun membre pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
