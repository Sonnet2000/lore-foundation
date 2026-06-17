"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2, Quote } from "lucide-react";
import { FieldLabel, TextInput, TextArea, PrimaryButton, GhostButton, RowCard } from "./ui";
import type { TestimonialRow } from "./types";

const emptyForm = { name: "", role: "", quote: "", initials: "" };

export default function TestimonialsPanel() {
  const [items, setItems] = useState<TestimonialRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    const res = await fetch("/api/admin/testimonials");
    const data = await res.json();
    setItems(data.items ?? []);
  }

  function startNew() {
    setForm(emptyForm);
    setEditingId("new");
    setError(null);
  }

  function startEdit(item: TestimonialRow) {
    setForm({ name: item.name, role: item.role, quote: item.quote, initials: item.initials });
    setEditingId(item.id);
    setError(null);
  }

  async function handleSave() {
    if (!form.name.trim() || !form.quote.trim()) {
      setError("Le nom et le témoignage sont requis.");
      return;
    }
    setSaving(true);
    setError(null);

    const isNew = editingId === "new";
    const res = await fetch(
      isNew ? "/api/admin/testimonials" : `/api/admin/testimonials/${editingId}`,
      {
        method: isNew ? "POST" : "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      }
    );

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
    if (!confirm("Supprimer ce témoignage ?")) return;
    await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
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
          Témoignages ({items.length})
        </h2>
        {editingId === null && (
          <PrimaryButton onClick={startNew}>
            <Plus className="h-4 w-4" />
            Nouveau témoignage
          </PrimaryButton>
        )}
      </div>

      {editingId !== null && (
        <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Nom du client</FieldLabel>
              <TextInput
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Carline Mésidor"
              />
            </div>
            <div>
              <FieldLabel>Rôle / Entreprise</FieldLabel>
              <TextInput
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                placeholder="Fondatrice, Salon Belle Étoile"
              />
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel>Témoignage</FieldLabel>
            <TextArea
              rows={4}
              value={form.quote}
              onChange={(e) => setForm({ ...form, quote: e.target.value })}
            />
          </div>

          <div className="mt-4 max-w-[160px]">
            <FieldLabel>Initiales (badge)</FieldLabel>
            <TextInput
              value={form.initials}
              onChange={(e) => setForm({ ...form, initials: e.target.value.slice(0, 2).toUpperCase() })}
              placeholder="CM"
              maxLength={2}
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
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-lore-gold/15 text-lore-gold">
                <Quote className="h-5 w-5" />
              </div>
            }
            onEdit={() => startEdit(item)}
            onDelete={() => handleDelete(item.id)}
          />
        ))}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
            Aucun témoignage pour le moment.
          </p>
        )}
      </div>
    </div>
  );
}
