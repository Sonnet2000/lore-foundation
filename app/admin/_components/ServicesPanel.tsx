"use client";

import { useEffect, useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import {
  FieldLabel,
  TextInput,
  TextArea,
  SelectInput,
  PrimaryButton,
  GhostButton,
  RowCard,
} from "./ui";
import { iconNames, resolveIcon } from "@/lib/icon-map";
import ConfirmModal from "./ConfirmModal";
import type { ServiceRow, PortfolioRow } from "./types";

const emptyForm = { title: "", icon: "Sparkles", description: "", related_portfolio_id: "" };

export default function ServicesPanel() {
  const [items, setItems] = useState<ServiceRow[] | null>(null);
  const [portfolioOptions, setPortfolioOptions] = useState<PortfolioRow[]>([]);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ServiceRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    refresh();
    fetch("/api/admin/portfolio", { credentials: "include" })
      .then((r) => r.json())
      .then((data) => setPortfolioOptions(data.items ?? []));
  }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/services", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        console.error("ServicesPanel GET error:", res.status, data.error);
        setItems([]);
        return;
      }
      setItems(data.items ?? []);
    } catch (e) {
      console.error("ServicesPanel fetch failed:", e);
      setItems([]);
    }
  }

  function startNew() {
    setForm(emptyForm);
    setEditingId("new");
    setError(null);
  }

  function startEdit(item: ServiceRow) {
    setForm({
      title: item.title,
      icon: item.icon,
      description: item.description,
      related_portfolio_id: item.related_portfolio_id ?? "",
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
    const res = await fetch(isNew ? "/api/admin/services" : `/api/admin/services/${editingId}`, { credentials: "include", 
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
    await fetch(`/api/admin/services/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
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
        title="Supprimer ce service ?"
        message="Ce service sera supprimé définitivement."
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
          Services ({items.length})
        </h2>
        {editingId === null && (
          <PrimaryButton onClick={startNew}>
            <Plus className="h-4 w-4" />
            Nouveau service
          </PrimaryButton>
        )}
      </div>

      {editingId !== null && (
        <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Titre du service</FieldLabel>
              <TextInput
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Développement Web"
              />
            </div>
            <div>
              <FieldLabel>Icône</FieldLabel>
              <SelectInput
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              >
                {iconNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </SelectInput>
            </div>
          </div>

          <div className="mt-4">
            <FieldLabel>Description</FieldLabel>
            <TextArea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div className="mt-4">
            <FieldLabel>Projet associé (lien « Voir un projet »)</FieldLabel>
            <SelectInput
              value={form.related_portfolio_id}
              onChange={(e) => setForm({ ...form, related_portfolio_id: e.target.value })}
            >
              <option value="">— Aucun —</option>
              {portfolioOptions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </SelectInput>
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
        {items.map((item) => {
          const Icon = resolveIcon(item.icon);
          return (
            <RowCard
              key={item.id}
              title={item.title}
              subtitle={item.description}
              thumbnail={
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light">
                  <Icon className="h-5 w-5" />
                </div>
              }
              onEdit={() => startEdit(item)}
              onDelete={() => setDeleteTarget(item)}
            />
          );
        })}

        {items.length === 0 && (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">
            Aucun service pour le moment.
          </p>
        )}
      </div>
    </div>
    </>
  );
}
