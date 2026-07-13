"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Pencil, Trash2, Check, X,
  Smartphone, Building2, CreditCard, Eye, EyeOff,
  GripVertical, ChevronUp, ChevronDown,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { iconNames, resolveIcon } from "@/lib/icon-map";
import type { PaymentMethodRow } from "./types";

const TYPE_OPTIONS = [
  { value: "moncash",  label: "📱 MonCash",  icon: Smartphone },
  { value: "natcash",  label: "📲 NatCash",  icon: Smartphone },
  { value: "sogebank", label: "🏦 Sogebank", icon: Building2  },
  { value: "autre",    label: "💳 Autre",    icon: CreditCard },
];

const emptyForm = {
  type: "moncash" as PaymentMethodRow["type"],
  label: "",
  number: "",
  details: "",
  instructions: "",
  icon: "" as string | null,
  is_active: true,
  sort_order: 0,
};

export default function PaymentMethodsPanel() {
  const [items, setItems]             = useState<PaymentMethodRow[] | null>(null);
  const [editingId, setEditingId]     = useState<string | null>(null);
  const [form, setForm]               = useState(emptyForm);
  const [saving, setSaving]           = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<PaymentMethodRow | null>(null);
  const [deleting, setDeleting]       = useState(false);
  const [listError, setListError]     = useState<string | null>(null);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const res  = await fetch("/api/admin/payment-methods", { credentials: "include", cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setListError(data.error || "Erreur de chargement."); setItems([]); return; }
      setListError(null);
      setItems(data.items ?? []);
    } catch { setListError("Erreur de connexion au serveur."); setItems([]); }
  }

  function startNew() {
    setEditingId("new");
    setForm({ ...emptyForm, sort_order: (items?.length ?? 0) + 1 });
    setError(null);
  }

  function startEdit(item: PaymentMethodRow) {
    setEditingId(item.id);
    setForm({
      type:         item.type,
      label:        item.label,
      number:       item.number,
      details:      item.details,
      instructions: item.instructions,
      icon:         item.icon ?? "",
      is_active:    item.is_active,
      sort_order:   item.sort_order,
    });
    setError(null);
  }

  async function handleSave() {
    setError(null);
    if (!form.label.trim()) { setError("Le nom est requis."); return; }
    if (!form.number.trim()) { setError("Le numéro / compte est requis."); return; }

    setSaving(true);
    const isNew = editingId === "new";
    const url   = isNew ? "/api/admin/payment-methods" : `/api/admin/payment-methods/${editingId}`;

    const res = await fetch(url, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) { setError(data.error || "Erreur lors de l'enregistrement."); return; }
    setEditingId(null);
    refresh();
  }

  async function toggleActive(item: PaymentMethodRow) {
    await fetch(`/api/admin/payment-methods/${item.id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: !item.is_active }),
    });
    refresh();
  }

  async function moveOrder(item: PaymentMethodRow, direction: "up" | "down") {
    const newOrder = direction === "up"
      ? Math.max(0, item.sort_order - 1)
      : item.sort_order + 1;
    await fetch(`/api/admin/payment-methods/${item.id}`, {
      credentials: "include",
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sort_order: newOrder }),
    });
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/payment-methods/${deleteTarget.id}`, {
      credentials: "include",
      method: "DELETE",
    });
    setDeleting(false);
    setDeleteTarget(null);
    refresh();
  }

  // ── Formulaire ─────────────────────────────────────────────────────────
  if (editingId !== null) {
    const isNew = editingId === "new";
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setEditingId(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-lore-dark/10 text-lore-ink/50 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/50">
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            {isNew ? "Nouvelle méthode de paiement" : "Modifier la méthode"}
          </h2>
        </div>

        <div className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6 flex flex-col gap-5">

          {/* Type */}
          <Field label="Type *">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TYPE_OPTIONS.map(opt => (
                <button key={opt.value} type="button"
                  onClick={() => setForm(f => ({ ...f, type: opt.value as typeof f.type }))}
                  className={`flex items-center gap-2 rounded-xl border-2 px-3 py-2.5 text-sm font-semibold transition-colors ${
                    form.type === opt.value
                      ? "border-lore-blue bg-lore-blue/10 text-lore-blue dark:bg-lore-blue/20"
                      : "border-lore-dark/10 text-lore-ink/60 hover:border-lore-blue/30 dark:border-white/10 dark:text-white/60"
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Nom affiché */}
          <Field label="Nom affiché *">
            <input value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              placeholder="ex: MonCash Loré Foundation"
              className={INPUT} />
          </Field>

          {/* Numéro / Compte */}
          <Field label="Numéro / Coordonnées * (une ligne par info)">
            <textarea value={form.number}
              onChange={e => setForm(f => ({ ...f, number: e.target.value }))}
              rows={3}
              placeholder={
                form.type === "sogebank"
                  ? "Titulaire : LORÉ FOUNDATION\nCompte : 2470-0541-6317-0003\nBanque : Sogebank"
                  : "+509 XX XX XXXX"
              }
              className={INPUT} />
            <p className="mt-1 text-xs text-lore-ink/40 dark:text-white/40">
              Chaque ligne sera affichée séparément sur le site.
            </p>
          </Field>

          {/* Détails */}
          <Field label="Description courte">
            <input value={form.details}
              onChange={e => setForm(f => ({ ...f, details: e.target.value }))}
              placeholder="ex: Transfert rapide 24h/24"
              className={INPUT} />
          </Field>

          {/* Icône */}
          <Field label="Icône affichée sur le site">
            <select value={form.icon ?? ""} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} className={INPUT}>
              <option value="">Icône par défaut (selon le type)</option>
              {iconNames.map((name) => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </Field>

          {/* Instructions */}
          <Field label="Instructions pour l'utilisateur">
            <textarea value={form.instructions}
              onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))}
              rows={4}
              placeholder={"Étape 1 : Ouvrir l'application\nÉtape 2 : Appuyer sur Transfert\nÉtape 3 : ..."}
              className={INPUT} />
            <p className="mt-1 text-xs text-lore-ink/40 dark:text-white/40">
              Chaque ligne = une étape affichée dans le guide de paiement.
            </p>
          </Field>

          {/* Ordre + Actif */}
          <div className="flex items-center gap-4 flex-wrap">
            <Field label="Ordre d'affichage">
              <input type="number" value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                className={`${INPUT} w-24`} />
            </Field>

            <label className="flex items-center gap-2 cursor-pointer mt-5">
              <div onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
                className={`flex h-6 w-11 items-center rounded-full transition-colors ${
                  form.is_active ? "bg-lore-blue" : "bg-lore-dark/20 dark:bg-white/20"
                }`}>
                <span className={`mx-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                  form.is_active ? "translate-x-5" : ""
                }`} />
              </div>
              <span className="text-sm font-semibold text-lore-ink dark:text-white">
                {form.is_active ? "Actif — visible sur le site" : "Inactif — masqué"}
              </span>
            </label>
          </div>

          {error && (
            <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>
          )}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 rounded-full bg-lore-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Enregistrement..." : isNew ? "Créer la méthode" : "Enregistrer"}
            </button>
            <button type="button" onClick={() => setEditingId(null)}
              className="rounded-full border border-lore-dark/10 px-6 py-2.5 text-sm font-semibold text-lore-ink/70 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/70">
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Liste ───────────────────────────────────────────────────────────────
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
        title="Supprimer cette méthode ?"
        message={`La méthode "${deleteTarget?.label}" sera supprimée définitivement.`}
        confirmLabel="Supprimer"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
              Méthodes de paiement ({items.length})
            </h2>
            <p className="mt-0.5 text-xs text-lore-ink/50 dark:text-white/50">
              Ces méthodes s&apos;affichent sur les pages Paiement et Soutenir.
            </p>
          </div>
          <button type="button" onClick={startNew}
            className="flex items-center gap-2 rounded-full bg-lore-blue px-4 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
            <Plus className="h-4 w-4" />
            Ajouter
          </button>
        </div>

        {listError && (
          <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{listError}</div>
        )}

        {items.length === 0 && !listError && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lore-blue/10 text-lore-blue">
              <CreditCard className="h-7 w-7" />
            </div>
            <p className="text-sm text-lore-ink/50 dark:text-white/50">
              Aucune méthode de paiement configurée.
            </p>
            <button type="button" onClick={startNew}
              className="rounded-full bg-lore-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
              Créer la première méthode
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map((item, idx) => {
            const typeOpt = TYPE_OPTIONS.find(t => t.value === item.type);
            return (
              <div key={item.id}
                className={`rounded-2xl border bg-white dark:bg-lore-night-surface transition-opacity ${
                  item.is_active
                    ? "border-lore-dark/5 dark:border-white/5"
                    : "border-lore-dark/5 dark:border-white/5 opacity-50"
                }`}>
                <div className="flex items-center gap-3 px-5 py-4">
                  {/* Drag handle / order */}
                  <div className="flex flex-col gap-0.5">
                    <button type="button" onClick={() => moveOrder(item, "up")} disabled={idx === 0}
                      className="text-lore-ink/20 hover:text-lore-ink/60 dark:text-white/20 dark:hover:text-white/60 disabled:opacity-30">
                      <ChevronUp className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" onClick={() => moveOrder(item, "down")} disabled={idx === items.length - 1}
                      className="text-lore-ink/20 hover:text-lore-ink/60 dark:text-white/20 dark:hover:text-white/60 disabled:opacity-30">
                      <ChevronDown className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  {/* Icon */}
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lore-blue/10 text-lore-blue">
                    {(() => {
                      const Icon = item.icon ? resolveIcon(item.icon) : (typeOpt?.icon ?? CreditCard);
                      return <Icon className="h-5 w-5" />;
                    })()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-lore-ink dark:text-white">
                      {item.label}
                      {!item.is_active && (
                        <span className="ml-2 text-xs font-normal text-lore-ink/40 dark:text-white/40">(inactif)</span>
                      )}
                    </p>
                    <div className="mt-0.5">
                      {item.number.split("\n").map((line, i) => (
                        <p key={i} className="text-xs font-mono text-lore-blue truncate">{line}</p>
                      ))}
                    </div>
                    {item.details && (
                      <p className="mt-0.5 text-xs text-lore-ink/40 dark:text-white/40 truncate">{item.details}</p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => toggleActive(item)}
                      title={item.is_active ? "Désactiver" : "Activer"}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                        item.is_active
                          ? "text-emerald-500 hover:bg-emerald-500/10"
                          : "text-lore-ink/30 hover:bg-lore-dark/5 dark:text-white/30"
                      }`}>
                      {item.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => startEdit(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/40 hover:bg-lore-blue/10 hover:text-lore-blue dark:text-white/40 transition-colors">
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button type="button" onClick={() => setDeleteTarget(item)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/30 hover:bg-red-500/10 hover:text-red-500 dark:text-white/30 transition-colors">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* Preview instructions */}
                {item.instructions && (
                  <div className="border-t border-lore-dark/5 dark:border-white/5 px-5 py-3">
                    <p className="text-xs text-lore-ink/40 dark:text-white/40 mb-1.5">Instructions :</p>
                    <ol className="flex flex-col gap-1">
                      {item.instructions.split("\n").filter(Boolean).map((step, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-lore-ink/60 dark:text-white/60">
                          <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-lore-blue/15 text-lore-blue text-[10px] font-bold">{i + 1}</span>
                          {step.replace(/^[Éé]tape\s*\d+\s*:\s*/i, "")}
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Info sync */}
        <div className="rounded-2xl border border-lore-blue/15 bg-lore-blue/5 dark:border-lore-blue/20 dark:bg-lore-blue/10 px-5 py-4">
          <p className="text-xs text-lore-blue font-semibold mb-1">🔄 Synchronisation automatique</p>
          <p className="text-xs text-lore-ink/60 dark:text-white/60">
            Les modifications sont appliquées immédiatement sur les pages <strong>/paiement</strong> et <strong>/soutenir</strong> du site.
            Les méthodes inactives ne sont pas visibles pour les visiteurs.
          </p>
        </div>
      </div>
    </>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-3 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-lore-blue transition-colors";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">{label}</label>
      {children}
    </div>
  );
}
