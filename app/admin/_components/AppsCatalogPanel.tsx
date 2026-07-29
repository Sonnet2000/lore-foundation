"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Loader2, Monitor, Smartphone, AppWindow } from "lucide-react";
import { FieldLabel, TextInput, TextArea, PrimaryButton, GhostButton, RowCard } from "./ui";
import ConfirmModal from "./ConfirmModal";
import ImageUploadField from "./ImageUploadField";
import FileUploadField from "./FileUploadField";
import type { AppCatalogRow } from "./types";

type AppForm = {
  name: string;
  description: string;
  category: string;
  icon_url: string | null;
  exe_url: string | null;
  exe_version: string;
  exe_size_mb: number;
  apk_url: string | null;
  apk_version: string;
  apk_size_mb: number;
  playstore_url: string;
  website_url: string;
  is_published: boolean;
  is_featured: boolean;
};

const emptyForm: AppForm = {
  name: "", description: "", category: "", icon_url: null,
  exe_url: null, exe_version: "1.0.0", exe_size_mb: 0,
  apk_url: null, apk_version: "1.0.0", apk_size_mb: 0,
  playstore_url: "", website_url: "",
  is_published: true, is_featured: false,
};

export default function AppsCatalogPanel() {
  const [items, setItems] = useState<AppCatalogRow[] | null>(null);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<AppForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppCatalogRow | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    const res = await fetch("/api/admin/apps", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setItems(res.ok ? data.items ?? [] : []);
  }

  function startNew() { setForm(emptyForm); setEditingId("new"); setError(null); }

  function startEdit(a: AppCatalogRow) {
    setForm({
      name: a.name, description: a.description, category: a.category, icon_url: a.icon_url,
      exe_url: a.exe_url, exe_version: a.exe_version, exe_size_mb: a.exe_size_mb,
      apk_url: a.apk_url, apk_version: a.apk_version, apk_size_mb: a.apk_size_mb,
      playstore_url: a.playstore_url ?? "", website_url: a.website_url ?? "",
      is_published: a.is_published, is_featured: a.is_featured,
    });
    setEditingId(a.id);
    setError(null);
  }

  async function save() {
    if (!form.name.trim()) { setError("Non app la obligatwa."); return; }
    setSaving(true); setError(null);
    const isNew = editingId === "new";
    const res = await fetch(isNew ? "/api/admin/apps" : `/api/admin/apps/${editingId}`, {
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
    await fetch(`/api/admin/apps/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
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
        title="Efase app sa a ?"
        message={`« ${deleteTarget?.name} » ap efase pou tout tan, ansanm ak lyen .exe/.apk li yo.`}
        confirmLabel="Efase"
        danger
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">Applications ({items.length})</h2>
          {editingId === null && (
            <PrimaryButton onClick={startNew}><Plus className="h-4 w-4" />Nouvo app</PrimaryButton>
          )}
        </div>

        <p className="text-sm text-lore-ink/50 dark:text-white/50">
          Chak app parèt nan seksyon &laquo;&nbsp;Nos Applications&nbsp;&raquo; sou paj akèy la, ak pwòp imaj li.
          Sit la detekte otomatikman aparèy vizitè a: sou òdinatè li ofri fichye <strong>.exe</strong> a,
          sou telefòn li ofri fichye <strong>.apk</strong> a.
        </p>

        {editingId !== null && (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Non app la</FieldLabel>
                <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="École Loré" />
              </div>
              <div>
                <FieldLabel>Catégorie (optionnel)</FieldLabel>
                <TextInput value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Gestion scolaire" />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploadField
                label="Icône / image de l'application"
                value={form.icon_url}
                onChange={(url) => setForm({ ...form, icon_url: url })}
                folder="apps-catalog"
              />
            </div>

            <div className="mt-4">
              <FieldLabel>Description</FieldLabel>
              <TextArea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </div>

            {/* ── Windows (.exe) ────────────────────────────────────── */}
            <div className="mt-5 rounded-2xl border border-lore-blue/15 bg-lore-blue/[0.04] p-4 dark:border-lore-blue/20">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-lore-ink dark:text-white">
                <Monitor className="h-4 w-4 text-lore-blue" />
                Version Windows (.exe)
              </div>
              <FileUploadField
                label="Fichye .exe"
                value={form.exe_url}
                onChange={(url) => setForm({ ...form, exe_url: url })}
                folder="apps-catalog"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Vèsyon</FieldLabel>
                  <TextInput value={form.exe_version} onChange={(e) => setForm({ ...form, exe_version: e.target.value })} placeholder="1.0.0" />
                </div>
                <div>
                  <FieldLabel>Gwosè (Mo)</FieldLabel>
                  <TextInput type="number" min={0} value={form.exe_size_mb} onChange={(e) => setForm({ ...form, exe_size_mb: Number(e.target.value) || 0 })} />
                </div>
              </div>
            </div>

            {/* ── Android (.apk) ────────────────────────────────────── */}
            <div className="mt-4 rounded-2xl border border-lore-emerald/15 bg-lore-emerald/[0.04] p-4 dark:border-lore-emerald/20">
              <div className="mb-3 flex items-center gap-2 text-sm font-bold text-lore-ink dark:text-white">
                <Smartphone className="h-4 w-4 text-lore-emerald" />
                Version Android (.apk)
              </div>
              <FileUploadField
                label="Fichye .apk"
                value={form.apk_url}
                onChange={(url) => setForm({ ...form, apk_url: url })}
                folder="apps-catalog"
              />
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div>
                  <FieldLabel>Vèsyon</FieldLabel>
                  <TextInput value={form.apk_version} onChange={(e) => setForm({ ...form, apk_version: e.target.value })} placeholder="1.0.0" />
                </div>
                <div>
                  <FieldLabel>Gwosè (Mo)</FieldLabel>
                  <TextInput type="number" min={0} value={form.apk_size_mb} onChange={(e) => setForm({ ...form, apk_size_mb: Number(e.target.value) || 0 })} />
                </div>
              </div>
              <div className="mt-3">
                <FieldLabel>Lyen Google Play Store (optionnel)</FieldLabel>
                <TextInput value={form.playstore_url} onChange={(e) => setForm({ ...form, playstore_url: e.target.value })} placeholder="https://play.google.com/store/apps/details?id=..." />
              </div>
            </div>

            <div className="mt-4">
              <FieldLabel>Site web / page de l&apos;app (optionnel)</FieldLabel>
              <TextInput value={form.website_url} onChange={(e) => setForm({ ...form, website_url: e.target.value })} placeholder="https://..." />
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
          {items.map((a) => (
            <RowCard
              key={a.id}
              title={a.name}
              subtitle={`${a.category || "Sans catégorie"}${a.is_published ? "" : " · Non publié"}${a.is_featured ? " · Mis en avant" : ""} · ${a.exe_url ? "Windows ✓" : "Windows —"} · ${a.apk_url ? "Android ✓" : "Android —"}`}
              thumbnail={
                a.icon_url ? (
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-lore-gold/10">
                    <Image src={a.icon_url} alt="" fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-lore-gold/10 text-lore-gold-dark">
                    <AppWindow className="h-5 w-5" />
                  </div>
                )
              }
              onEdit={() => startEdit(a)}
              onDelete={() => setDeleteTarget(a)}
            />
          ))}

          {items.length === 0 && (
            <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Pa gen app kounye a.</p>
          )}
        </div>
      </div>
    </>
  );
}
