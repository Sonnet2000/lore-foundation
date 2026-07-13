"use client";

import { useEffect, useState, useRef } from "react";
import {
  Loader2, Plus, Pencil, Trash2, Eye, EyeOff, X,
  Star, StarOff, Target, MapPin, Users, Calendar,
  Upload, Play, Image as ImageIcon, CheckCircle2,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import FileUploadField from "./FileUploadField";
import { useFileUpload } from "./useFileUpload";
import type { Project, ProjectCategory, ProjectMedia } from "./types";

const CATEGORIES: { id: ProjectCategory; label: string; emoji: string; color: string }[] = [
  { id: "education",    label: "Éducation",       emoji: "📚", color: "bg-blue-500/15 text-blue-500" },
  { id: "numerique",    label: "Numérique",        emoji: "💻", color: "bg-purple-500/15 text-purple-500" },
  { id: "leadership",   label: "Leadership",       emoji: "🌟", color: "bg-amber-500/15 text-amber-600" },
  { id: "communaute",   label: "Communauté",       emoji: "🤝", color: "bg-emerald-500/15 text-emerald-600" },
  { id: "sante",        label: "Santé",            emoji: "❤️", color: "bg-rose-500/15 text-rose-500" },
  { id: "autre",        label: "Autre",            emoji: "✨", color: "bg-slate-500/15 text-slate-500" },
];

const STATUS_OPTIONS = [
  { id: "actif",     label: "🟢 Actif",    },
  { id: "termine",   label: "✅ Terminé",  },
  { id: "suspendu",  label: "⏸️ Suspendu", },
];

const emptyForm = {
  title: "", short_desc: "", description: "",
  category: "education" as ProjectCategory,
  goal_amount: "", currency: "HTG",
  location: "Cap-Haïtien, Haïti",
  beneficiaries: "",
  start_date: "", end_date: "",
  is_published: false, is_featured: false,
  status: "actif" as Project["status"],
  sort_order: 0,
  cover_url: "",
  pdf_url: "" as string | null,
  media: [] as ProjectMedia[],
};

export default function ProjectsPanel() {
  const [items, setItems]         = useState<Project[] | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting]   = useState(false);
  const { upload, uploading, error: upErr, uploadMany } = useFileUpload("portfolio");
  const mediaRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const res  = await fetch("/api/admin/projects", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setItems([]); return; }
      setItems(data.items ?? []);
    } catch { setItems([]); }
  }

  function startNew() {
    setEditingId("new");
    setForm({ ...emptyForm, sort_order: (items?.length ?? 0) + 1 });
    setError(null);
  }

  function startEdit(item: Project) {
    setEditingId(item.id);
    setForm({
      title: item.title, short_desc: item.short_desc,
      description: item.description, category: item.category,
      goal_amount: String(item.goal_amount), currency: item.currency,
      location: item.location, beneficiaries: String(item.beneficiaries),
      start_date: item.start_date ?? "", end_date: item.end_date ?? "",
      is_published: item.is_published, is_featured: item.is_featured,
      status: item.status, sort_order: item.sort_order,
      cover_url: item.cover_url ?? "",
      pdf_url: item.pdf_url ?? "",
      media: item.media ?? [],
    });
    setError(null);
  }

  async function handleCover(files: FileList | null) {
    if (!files?.[0]) return;
    const url = await upload(files[0]);
    if (url) setForm(f => ({ ...f, cover_url: url }));
  }

  async function handleMedia(files: FileList | null) {
    if (!files?.length) return;
    const arr = Array.from(files);
    const urls = await uploadMany(arr);
    const newMedia: ProjectMedia[] = urls.map((url, i) => ({
      url, type: arr[i]?.type.startsWith("video/") ? "video" : "image",
    }));
    setForm(f => ({ ...f, media: [...f.media, ...newMedia] }));
  }

  function removeMedia(idx: number) {
    setForm(f => ({ ...f, media: f.media.filter((_, i) => i !== idx) }));
  }

  async function handleSave() {
    setError(null);
    if (!form.title.trim()) { setError("Titre requis."); return; }
    if (!form.short_desc.trim()) { setError("Description courte requise."); return; }
    setSaving(true);
    const isNew = editingId === "new";
    const url   = isNew ? "/api/admin/projects" : `/api/admin/projects/${editingId}`;
    const res   = await fetch(url, {
      credentials: "include",
      method: isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        goal_amount:  Number(form.goal_amount) || 0,
        beneficiaries: Number(form.beneficiaries) || 0,
        cover_url: form.cover_url || null,
        start_date: form.start_date || null,
        end_date: form.end_date || null,
      }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(data.error || "Erreur lors de l'enregistrement."); return; }
    setEditingId(null);
    refresh();
  }

  async function togglePublish(item: Project) {
    await fetch(`/api/admin/projects/${item.id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !item.is_published }),
    });
    refresh();
  }

  async function toggleFeatured(item: Project) {
    await fetch(`/api/admin/projects/${item.id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !item.is_featured }),
    });
    refresh();
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/projects/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    refresh();
  }

  // ── FORMULAIRE ────────────────────────────────────────────────────────
  if (editingId !== null) {
    const isNew = editingId === "new";
    return (
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => setEditingId(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-lore-dark/10 text-lore-ink/50 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/50">
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white flex-1">
            {isNew ? "Nouveau projet" : "Modifier le projet"}
          </h2>
        </div>

        <div className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6 flex flex-col gap-5">

          {/* Titre */}
          <Field label="Titre du projet *">
            <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="ex: Formation numérique pour 200 enseignants" className={INPUT} />
          </Field>

          {/* Description courte */}
          <Field label="Description courte * (affichée dans la liste)">
            <textarea value={form.short_desc} onChange={e => setForm(f => ({ ...f, short_desc: e.target.value }))}
              rows={2} maxLength={200} placeholder="Résumé accrocheur du projet en 1-2 phrases..." className={INPUT} />
            <p className="text-right text-[10px] text-lore-ink/30">{form.short_desc.length}/200</p>
          </Field>

          {/* Description complète */}
          <Field label="Description complète *">
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={10} placeholder={`## Contexte\n\nDécrivez le projet en détail...\n\n## Objectifs\n\n- Objectif 1\n- Objectif 2\n\n## Impact attendu\n\nDécrivez l'impact...`}
              className={`${INPUT} font-mono text-sm`} />
          </Field>

          {/* Catégorie */}
          <Field label="Catégorie *">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(cat => (
                <button key={cat.id} type="button"
                  onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                    form.category === cat.id
                      ? "border-lore-blue bg-lore-blue/10 text-lore-blue"
                      : "border-lore-dark/10 text-lore-ink/60 dark:border-white/10 dark:text-white/60 hover:border-lore-blue/30"
                  }`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </Field>

          {/* Objectif financier */}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Objectif financier">
              <div className="flex gap-2">
                <input type="text" inputMode="numeric" value={form.goal_amount}
                  onChange={e => setForm(f => ({ ...f, goal_amount: e.target.value.replace(/[^0-9.]/g, "") }))}
                  placeholder="150000" className={`${INPUT} flex-1`} />
                <select value={form.currency} onChange={e => setForm(f => ({ ...f, currency: e.target.value }))}
                  className={`${INPUT} w-20`}>
                  <option value="HTG">HTG</option>
                  <option value="USD">USD</option>
                </select>
              </div>
            </Field>
            <Field label="Bénéficiaires attendus">
              <input type="text" inputMode="numeric" value={form.beneficiaries}
                onChange={e => setForm(f => ({ ...f, beneficiaries: e.target.value.replace(/[^0-9]/g, "") }))}
                placeholder="200" className={INPUT} />
            </Field>
          </div>

          {/* Localisation & dates */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Field label="Localisation">
              <input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                placeholder="Cap-Haïtien, Nord" className={INPUT} />
            </Field>
            <Field label="Date début">
              <input type="date" value={form.start_date}
                onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} className={INPUT} />
            </Field>
            <Field label="Date fin">
              <input type="date" value={form.end_date}
                onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} className={INPUT} />
            </Field>
          </div>

          {/* Image couverture */}
          <Field label="Image de couverture">
            <div className="flex items-center gap-3 flex-wrap">
              {form.cover_url && (
                <img src={form.cover_url} alt="" className="h-16 w-24 rounded-xl object-cover border border-lore-dark/10 dark:border-white/10" />
              )}
              <label className="flex cursor-pointer items-center gap-2 rounded-full border border-lore-dark/10 px-4 py-2 text-xs font-semibold text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/60 transition-colors">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ImageIcon className="h-4 w-4" />}
                {form.cover_url ? "Changer" : "Ajouter couverture"}
                <input ref={coverRef} type="file" accept="image/*" className="hidden" onChange={e => handleCover(e.target.files)} />
              </label>
              {form.cover_url && (
                <button type="button" onClick={() => setForm(f => ({ ...f, cover_url: "" }))} className="text-xs text-red-500 hover:underline">Retirer</button>
              )}
            </div>
          </Field>

          {/* PDF (budget, proposition, etc.) */}
          <Field label="Document PDF (optionnel)">
            <FileUploadField
              label=""
              value={form.pdf_url || null}
              onChange={(url) => setForm(f => ({ ...f, pdf_url: url }))}
              folder="projects"
            />
          </Field>

          {/* Médias (photos + vidéos) */}
          <Field label="Photos & vidéos du projet">
            <p className="text-xs text-lore-ink/40 dark:text-white/40 mb-2">
              Ajoutez plusieurs photos ou courtes vidéos (JPG, PNG, WEBP, MP4 — max 80Mo par vidéo)
            </p>
            {form.media.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mb-3">
                {form.media.map((m, idx) => (
                  <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-lore-dark/10 dark:border-white/10">
                    {m.type === "video"
                      ? <div className="h-full w-full bg-lore-dark/20 flex items-center justify-center">
                          <Play className="h-6 w-6 text-white" />
                        </div>
                      : <img src={m.url} alt="" className="h-full w-full object-cover" />
                    }
                    <button type="button" onClick={() => removeMedia(idx)}
                      className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 left-1 rounded-full bg-black/50 px-1.5 py-0.5 text-[9px] text-white">
                      {m.type === "video" ? "🎥" : "📷"}
                    </span>
                  </div>
                ))}
              </div>
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-full border-2 border-dashed border-lore-dark/10 px-5 py-3 text-sm text-lore-ink/50 hover:border-lore-blue/40 dark:border-white/10 dark:text-white/50 transition-colors">
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
              Ajouter photos / vidéos
              <input ref={mediaRef} type="file" multiple accept="image/*,video/mp4,video/webm,video/quicktime" className="hidden"
                onChange={e => handleMedia(e.target.files)} />
            </label>
            {upErr && <p className="text-xs text-red-500 mt-1">{upErr}</p>}
          </Field>

          {/* Statut & options */}
          <div className="flex flex-wrap gap-4">
            <Field label="Statut">
              <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as Project["status"] }))}
                className={`${INPUT} w-40`}>
                {STATUS_OPTIONS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </Field>
            <Field label="Ordre">
              <input type="number" value={form.sort_order}
                onChange={e => setForm(f => ({ ...f, sort_order: Number(e.target.value) }))}
                className={`${INPUT} w-20`} />
            </Field>
          </div>

          <div className="flex flex-wrap gap-4 pt-1">
            <Toggle label={form.is_published ? "✅ Publié — visible sur le site" : "📝 Brouillon"}
              value={form.is_published} onChange={v => setForm(f => ({ ...f, is_published: v }))} color="blue" />
            <Toggle label={form.is_featured ? "⭐ Mis en avant" : "Projet normal"}
              value={form.is_featured} onChange={v => setForm(f => ({ ...f, is_featured: v }))} color="amber" />
          </div>

          {error && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={handleSave} disabled={saving}
              className="flex items-center gap-2 rounded-full bg-lore-blue px-7 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors">
              {saving && <Loader2 className="h-4 w-4 animate-spin" />}
              {saving ? "Enregistrement..." : isNew ? "Créer le projet" : "Enregistrer"}
            </button>
            <button type="button" onClick={() => setEditingId(null)}
              className="rounded-full border border-lore-dark/10 px-7 py-3 text-sm font-semibold text-lore-ink/70 dark:border-white/10 dark:text-white/70 hover:bg-lore-dark/5 transition-colors">
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── LISTE ─────────────────────────────────────────────────────────────
  if (items === null) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-lore-blue" />
    </div>
  );

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer ce projet ?"
        message={`"${deleteTarget?.title}" et toutes ses contributions liées seront supprimés définitivement.`}
        confirmLabel="Supprimer" danger loading={deleting}
        onConfirm={confirmDelete} onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
              Projets ({items.length})
            </h2>
            <p className="text-xs text-lore-ink/50 dark:text-white/50 mt-0.5">
              <span className="text-emerald-500 font-semibold">{items.filter(i => i.is_published).length} publiés</span>
              {" · "}
              <span className="text-amber-500 font-semibold">{items.filter(i => !i.is_published).length} brouillons</span>
            </p>
          </div>
          <button type="button" onClick={startNew}
            className="flex items-center gap-2 rounded-full bg-lore-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
            <Plus className="h-4 w-4" /> Nouveau projet
          </button>
        </div>

        {items.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-lore-blue/10 text-lore-blue">
              <Target className="h-8 w-8" />
            </div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Aucun projet pour le moment</p>
            <p className="text-sm text-lore-ink/50 dark:text-white/50 max-w-xs">
              Créez votre premier projet à financer pour mobiliser la communauté.
            </p>
            <button type="button" onClick={startNew}
              className="rounded-full bg-lore-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
              Créer le premier projet
            </button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {items.map(item => {
            const cat = CATEGORIES.find(c => c.id === item.category);
            const pct = item.goal_amount > 0
              ? Math.min(100, Math.round((item.raised_amount / item.goal_amount) * 100))
              : 0;
            return (
              <div key={item.id}
                className={`rounded-2xl border bg-white dark:bg-lore-night-surface transition-opacity ${
                  item.is_published ? "border-lore-dark/5 dark:border-white/5" : "border-dashed border-lore-dark/10 dark:border-white/10 opacity-70"
                }`}>
                <div className="flex items-start gap-4 px-5 py-4">
                  {/* Cover */}
                  {item.cover_url
                    ? <img src={item.cover_url} alt="" className="h-16 w-20 shrink-0 rounded-xl object-cover" />
                    : <div className="flex h-16 w-20 shrink-0 items-center justify-center rounded-xl bg-lore-blue/10 text-2xl">{cat?.emoji ?? "🎯"}</div>
                  }

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${cat?.color ?? ""}`}>
                        {cat?.emoji} {cat?.label}
                      </span>
                      {item.is_featured && <span className="text-amber-500 text-xs">⭐ Mis en avant</span>}
                      {!item.is_published && <span className="text-amber-500 text-xs font-semibold">📝 Brouillon</span>}
                      <span className="text-xs text-lore-ink/40 dark:text-white/40">{STATUS_OPTIONS.find(s => s.id === item.status)?.label}</span>
                    </div>
                    <p className="font-semibold text-sm text-lore-ink dark:text-white truncate">{item.title}</p>

                    {/* Barre progression */}
                    {item.goal_amount > 0 && (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-[11px] text-lore-ink/50 dark:text-white/50 mb-1">
                          <span>{item.raised_amount.toLocaleString("fr-FR")} / {item.goal_amount.toLocaleString("fr-FR")} {item.currency}</span>
                          <span className="font-bold text-lore-blue">{pct}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-lore-dark/10 dark:bg-white/10">
                          <div className="h-full rounded-full bg-lore-blue transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-lore-ink/40 dark:text-white/40">
                      {item.location && <span className="flex items-center gap-0.5"><MapPin className="h-3 w-3" />{item.location}</span>}
                      {item.beneficiaries > 0 && <span className="flex items-center gap-0.5"><Users className="h-3 w-3" />{item.beneficiaries}</span>}
                      {item.media?.length > 0 && <span>{item.media.length} média(s)</span>}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button type="button" onClick={() => toggleFeatured(item)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${item.is_featured ? "text-amber-500 hover:bg-amber-500/10" : "text-lore-ink/20 hover:bg-lore-dark/5 dark:text-white/20"}`}>
                      {item.is_featured ? <Star className="h-4 w-4 fill-amber-500" /> : <StarOff className="h-4 w-4" />}
                    </button>
                    <button type="button" onClick={() => togglePublish(item)}
                      className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${item.is_published ? "text-emerald-500 hover:bg-emerald-500/10" : "text-lore-ink/30 hover:bg-lore-dark/5 dark:text-white/30"}`}>
                      {item.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
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
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

function Toggle({ label, value, onChange, color }: { label: string; value: boolean; onChange: (v: boolean) => void; color: string }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer">
      <div onClick={() => onChange(!value)}
        className={`flex h-6 w-11 items-center rounded-full transition-colors ${value ? (color === "blue" ? "bg-lore-blue" : "bg-amber-500") : "bg-lore-dark/20 dark:bg-white/20"}`}>
        <span className={`mx-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${value ? "translate-x-5" : ""}`} />
      </div>
      <span className="text-sm font-semibold text-lore-ink dark:text-white">{label}</span>
    </label>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-3 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white transition-colors";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold uppercase tracking-wide text-lore-ink/60 dark:text-white/60">{label}</label>
      {children}
    </div>
  );
}
