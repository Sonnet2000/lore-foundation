"use client";

import { useEffect, useState } from "react";
import {
  Loader2, Plus, Pencil, Trash2, Eye, EyeOff,
  Star, StarOff, Clock, Tag, X, BookOpen, Globe, Bell, Sparkles,
} from "lucide-react";
import ConfirmModal from "./ConfirmModal";
import { useFileUpload } from "./useFileUpload";
import type { BlogPost, BlogCategory } from "./types";

const CATEGORIES: { id: BlogCategory; label: string; emoji: string }[] = [
  { id: "actualites",    label: "Actualités",       emoji: "📢" },
  { id: "technologie",   label: "Technologie",      emoji: "💻" },
  { id: "education",     label: "Éducation",        emoji: "📚" },
  { id: "ia",            label: "Intelligence IA",  emoji: "🤖" },
  { id: "entrepreneuriat",label: "Entrepreneuriat", emoji: "🚀" },
  { id: "leadership",    label: "Leadership",       emoji: "🌟" },
  { id: "activites",     label: "Activités LF",     emoji: "🇭🇹" },
];

const CAT_COLORS: Record<string, string> = {
  technologie:    "bg-blue-500/15 text-blue-600 dark:text-blue-300",
  education:      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-300",
  ia:             "bg-purple-500/15 text-purple-600 dark:text-purple-300",
  entrepreneuriat:"bg-amber-500/15 text-amber-600 dark:text-amber-300",
  activites:      "bg-rose-500/15 text-rose-600 dark:text-rose-300",
  actualites:     "bg-sky-500/15 text-sky-600 dark:text-sky-300",
  leadership:     "bg-orange-500/15 text-orange-600 dark:text-orange-300",
};

const emptyForm = {
  title:              "",
  excerpt:            "",
  content:            "",
  cover_url:          "",
  category:           "actualites" as BlogCategory,
  tags:               [] as string[],
  author_name:        "Loré Foundation",
  author_photo:       "",
  is_published:       false,
  is_featured:        false,
  read_time_minutes:  5,
};

export default function BlogPanel() {
  const [posts, setPosts]           = useState<BlogPost[] | null>(null);
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [form, setForm]             = useState(emptyForm);
  const [tagInput, setTagInput]     = useState("");
  const [saving, setSaving]         = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [deleting, setDeleting]     = useState(false);
  const [preview, setPreview]       = useState(false);
  const [notifying, setNotifying]   = useState<string | null>(null);
  const [notifMsg, setNotifMsg]     = useState<string | null>(null);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiTopic, setAiTopic]       = useState("");
  const [aiCategory, setAiCategory] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiError, setAiError]       = useState<string | null>(null);
  const { upload, uploading, error: uploadError } = useFileUpload("portfolio");

  useEffect(() => { refresh(); }, []);

  async function refresh() {
    try {
      const res  = await fetch("/api/admin/blog", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      setPosts(data.items ?? []);
    } catch { setPosts([]); }
  }

  function startNew() {
    setEditingId("new");
    setForm(emptyForm);
    setTagInput("");
    setError(null);
    setPreview(false);
  }

  function startEdit(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title:             post.title,
      excerpt:           post.excerpt,
      content:           post.content,
      cover_url:         post.cover_url ?? "",
      category:          post.category,
      tags:              post.tags ?? [],
      author_name:       post.author_name,
      author_photo:      post.author_photo ?? "",
      is_published:      post.is_published,
      is_featured:       post.is_featured,
      read_time_minutes: post.read_time_minutes,
    });
    setTagInput("");
    setError(null);
    setPreview(false);
  }

  function addTag() {
    const t = tagInput.trim().toLowerCase();
    if (t && !form.tags.includes(t) && form.tags.length < 8) {
      setForm(f => ({ ...f, tags: [...f.tags, t] }));
    }
    setTagInput("");
  }

  async function handleCoverUpload(files: FileList | null) {
    if (!files?.[0]) return;
    const url = await upload(files[0]);
    if (url) setForm(f => ({ ...f, cover_url: url }));
  }

  async function handleSave() {
    setError(null);
    if (!form.title.trim()) { setError("Le titre est requis."); return; }
    if (!form.excerpt.trim()) { setError("Le résumé (excerpt) est requis."); return; }
    if (!form.content.trim()) { setError("Le contenu est requis."); return; }

    setSaving(true);
    const isNew = editingId === "new";
    const url   = isNew ? "/api/admin/blog" : `/api/admin/blog/${editingId}`;
    const res   = await fetch(url, {
      credentials: "include",
      method:  isNew ? "POST" : "PATCH",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ ...form, cover_url: form.cover_url || null, author_photo: form.author_photo || null }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(false);
    if (!res.ok) { setError(data.error || "Erreur lors de l'enregistrement."); return; }
    setEditingId(null);
    refresh();
  }

  async function togglePublish(post: BlogPost) {
    await fetch(`/api/admin/blog/${post.id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_published: !post.is_published }),
    });
    refresh();
  }

  async function toggleFeatured(post: BlogPost) {
    await fetch(`/api/admin/blog/${post.id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_featured: !post.is_featured }),
    });
    refresh();
  }

  async function notifySubscribers(post: BlogPost) {
    if (!post.is_published) {
      setNotifMsg("⚠️ Publiez l'article d'abord avant d'envoyer la notification.");
      setTimeout(() => setNotifMsg(null), 4000);
      return;
    }
    setNotifying(post.id);
    const res  = await fetch("/api/admin/blog/notify", {
      credentials: "include", method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ post_id: post.id }),
    });
    const data = await res.json().catch(() => ({}));
    setNotifying(null);
    if (res.ok) {
      setNotifMsg(`✅ Notification envoyée à ${data.sent ?? 0} abonné(s) !`);
    } else {
      setNotifMsg(`❌ ${data.error || "Erreur lors de l'envoi."}`);
    }
    setTimeout(() => setNotifMsg(null), 5000);
  }

  async function generateWithAI() {
    setAiError(null);
    setAiGenerating(true);
    try {
      const res = await fetch("/api/admin/blog/generate", {
        credentials: "include", method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: aiTopic.trim(), category: aiCategory }),
      });
      const data = await res.json().catch(() => ({}));
      setAiGenerating(false);
      if (!res.ok || !data.item) {
        setAiError(data.error || "Erreur lors de la génération.");
        return;
      }
      // Préremplir le formulaire avec le contenu généré — en mode preview/édition
      setEditingId("new");
      setForm({
        ...emptyForm,
        title:             data.item.title,
        excerpt:           data.item.excerpt,
        content:           data.item.content,
        category:          data.item.category,
        tags:              data.item.tags,
        read_time_minutes: data.item.read_time_minutes,
        is_published:      false, // toujours brouillon — l'utilisateur valide
      });
      setAiModalOpen(false);
      setAiTopic("");
      setAiCategory("");
      setPreview(true); // ouvre directement en aperçu
    } catch (e) {
      setAiGenerating(false);
      setAiError(e instanceof Error ? e.message : "Erreur réseau.");
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    await fetch(`/api/admin/blog/${deleteTarget.id}`, { credentials: "include", method: "DELETE" });
    setDeleting(false);
    setDeleteTarget(null);
    refresh();
  }

  // ── ÉDITEUR ───────────────────────────────────────────────────────────
  if (editingId !== null) {
    const isNew = editingId === "new";
    return (
      <div className="flex flex-col gap-6">
        {/* Topbar éditeur */}
        <div className="flex items-center gap-3 flex-wrap">
          <button type="button" onClick={() => setEditingId(null)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-lore-dark/10 text-lore-ink/50 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/50">
            <X className="h-4 w-4" />
          </button>
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white flex-1">
            {isNew ? "Nouvel article" : "Modifier l'article"}
          </h2>
          <button type="button" onClick={() => setPreview(!preview)}
            className={`flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold transition-colors ${
              preview ? "border-lore-blue bg-lore-blue/10 text-lore-blue" : "border-lore-dark/10 text-lore-ink/60 dark:border-white/10 dark:text-white/60"
            }`}>
            <Globe className="h-3.5 w-3.5" />
            {preview ? "Éditeur" : "Aperçu"}
          </button>
        </div>

        {/* Preview mode */}
        {preview ? (
          <div className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6 md:p-10">
            {form.cover_url && (
              <img src={form.cover_url} alt={form.title} className="w-full rounded-2xl object-cover mb-6 max-h-64" />
            )}
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${CAT_COLORS[form.category]}`}>
              {CATEGORIES.find(c => c.id === form.category)?.emoji} {form.category}
            </span>
            <h1 className="font-display text-3xl font-extrabold text-lore-ink dark:text-white mt-4 mb-3 leading-tight">{form.title || "Titre de l'article"}</h1>
            {form.excerpt && <p className="text-lore-ink/70 dark:text-white/70 border-l-4 border-lore-blue pl-4 mb-6 font-medium">{form.excerpt}</p>}
            <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: form.content.replace(/\n/g, "<br/>") }} />
            {form.tags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {form.tags.map(t => <span key={t} className="rounded-full bg-lore-dark/5 dark:bg-white/5 px-3 py-1 text-xs text-lore-ink/60 dark:text-white/60">#{t}</span>)}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6 flex flex-col gap-5">

            {/* Titre */}
            <Field label="Titre *">
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                placeholder="Titre accrocheur de l'article..." className={`${INPUT} text-lg font-bold`} />
            </Field>

            {/* Résumé */}
            <Field label="Résumé (excerpt) * — affiché dans la liste">
              <textarea value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))}
                rows={3} maxLength={300}
                placeholder="Un résumé court et accrocheur qui donne envie de lire l'article complet..."
                className={INPUT} />
              <p className="text-right text-[10px] text-lore-ink/30 dark:text-white/30">{form.excerpt.length}/300</p>
            </Field>

            {/* Contenu */}
            <Field label="Contenu de l'article * (Markdown / HTML supporté)">
              <textarea value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={18}
                placeholder={`## Introduction\n\nÉcrivez votre article ici...\n\n## Section 1\n\nVotre contenu...\n\n**Texte en gras**, *italique*, [lien](https://url.com)\n\n> Citation importante\n\n- Point 1\n- Point 2`}
                className={`${INPUT} font-mono text-sm leading-relaxed`} />
              <p className="text-xs text-lore-ink/40 dark:text-white/40">
                Astuce : utilisez <code>**gras**</code>, <code>*italique*</code>, <code>## Titre</code>, <code>- liste</code>
              </p>
            </Field>

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Catégorie */}
              <Field label="Catégorie *">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(cat => (
                    <button key={cat.id} type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat.id }))}
                      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        form.category === cat.id
                          ? "border-lore-blue bg-lore-blue/10 text-lore-blue"
                          : "border-lore-dark/10 text-lore-ink/60 hover:border-lore-blue/30 dark:border-white/10 dark:text-white/60"
                      }`}>
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
              </Field>

              {/* Temps lecture */}
              <Field label="Temps de lecture (minutes)">
                <input type="number" min={1} max={60} value={form.read_time_minutes}
                  onChange={e => setForm(f => ({ ...f, read_time_minutes: Number(e.target.value) }))}
                  className={`${INPUT} w-24`} />
              </Field>
            </div>

            {/* Cover image */}
            <Field label="Image de couverture">
              <div className="flex items-center gap-3">
                {form.cover_url && (
                  <img src={form.cover_url} alt="" className="h-16 w-24 rounded-xl object-cover border border-lore-dark/10 dark:border-white/10" />
                )}
                <label className="flex cursor-pointer items-center gap-2 rounded-full border border-lore-dark/10 px-4 py-2 text-xs font-semibold text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/60 transition-colors">
                  {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  {form.cover_url ? "Changer" : "Ajouter une image"}
                  <input type="file" accept="image/*" className="hidden" onChange={e => handleCoverUpload(e.target.files)} />
                </label>
                {form.cover_url && (
                  <button type="button" onClick={() => setForm(f => ({ ...f, cover_url: "" }))}
                    className="text-xs text-red-500 hover:underline">Retirer</button>
                )}
              </div>
              {uploadError && <p className="text-xs text-red-500 mt-1">{uploadError}</p>}
            </Field>

            {/* Auteur */}
            <Field label="Nom de l'auteur">
              <input value={form.author_name} onChange={e => setForm(f => ({ ...f, author_name: e.target.value }))}
                placeholder="Loré Foundation" className={INPUT} />
            </Field>

            {/* Tags */}
            <Field label="Tags (appuyez Entrée pour ajouter)">
              <div className="flex gap-2">
                <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                  placeholder="technologie, ia, formation..."
                  className={`${INPUT} flex-1`} />
                <button type="button" onClick={addTag}
                  className="rounded-xl border border-lore-dark/10 px-3 py-2 text-xs font-semibold text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/60">
                  + Ajouter
                </button>
              </div>
              {form.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {form.tags.map(tag => (
                    <span key={tag} className="flex items-center gap-1.5 rounded-full bg-lore-dark/5 dark:bg-white/5 px-3 py-1 text-xs font-medium text-lore-ink/70 dark:text-white/70">
                      <Tag className="h-2.5 w-2.5" /> {tag}
                      <button type="button" onClick={() => setForm(f => ({ ...f, tags: f.tags.filter(t => t !== tag) }))}
                        className="text-lore-ink/30 hover:text-red-500 ml-0.5">×</button>
                    </span>
                  ))}
                </div>
              )}
            </Field>

            {/* Options publication */}
            <div className="flex flex-wrap gap-4 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setForm(f => ({ ...f, is_published: !f.is_published }))}
                  className={`flex h-6 w-11 items-center rounded-full transition-colors ${form.is_published ? "bg-lore-blue" : "bg-lore-dark/20 dark:bg-white/20"}`}>
                  <span className={`mx-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_published ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm font-semibold text-lore-ink dark:text-white">
                  {form.is_published ? "✅ Publié — visible sur le site" : "📝 Brouillon"}
                </span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <div onClick={() => setForm(f => ({ ...f, is_featured: !f.is_featured }))}
                  className={`flex h-6 w-11 items-center rounded-full transition-colors ${form.is_featured ? "bg-amber-500" : "bg-lore-dark/20 dark:bg-white/20"}`}>
                  <span className={`mx-1 h-4 w-4 rounded-full bg-white shadow transition-transform ${form.is_featured ? "translate-x-5" : ""}`} />
                </div>
                <span className="text-sm font-semibold text-lore-ink dark:text-white">
                  {form.is_featured ? "⭐ À la une" : "Article normal"}
                </span>
              </label>
            </div>

            {error && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</div>}

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={handleSave} disabled={saving}
                className="flex items-center gap-2 rounded-full bg-lore-blue px-7 py-3 text-sm font-bold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />}
                {saving ? "Enregistrement..." : isNew ? "Créer l'article" : "Enregistrer les modifications"}
              </button>
              <button type="button" onClick={() => setEditingId(null)}
                className="rounded-full border border-lore-dark/10 px-7 py-3 text-sm font-semibold text-lore-ink/70 hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/70">
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── LISTE ─────────────────────────────────────────────────────────────
  if (posts === null) return (
    <div className="flex items-center justify-center py-16">
      <Loader2 className="h-6 w-6 animate-spin text-lore-blue" />
    </div>
  );

  const published = posts.filter(p => p.is_published).length;
  const drafts    = posts.filter(p => !p.is_published).length;

  return (
    <>
      <ConfirmModal
        open={!!deleteTarget}
        title="Supprimer cet article ?"
        message={`"${deleteTarget?.title}" sera supprimé définitivement.`}
        confirmLabel="Supprimer"
        danger loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
              Articles ({posts.length})
            </h2>
            <p className="text-xs text-lore-ink/50 dark:text-white/50 mt-0.5">
              <span className="text-emerald-500 font-semibold">{published} publiés</span>
              {drafts > 0 && <span className="ml-2 text-amber-500 font-semibold">{drafts} brouillons</span>}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => setAiModalOpen(true)}
              className="flex items-center gap-2 rounded-full border-2 border-purple-400/30 bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-5 py-2.5 text-sm font-bold text-purple-600 dark:text-purple-300 hover:from-purple-500/20 hover:to-blue-500/20 transition-colors">
              <Sparkles className="h-4 w-4" /> Générer avec IA
            </button>
            <button type="button" onClick={startNew}
              className="flex items-center gap-2 rounded-full bg-lore-blue px-5 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
              <Plus className="h-4 w-4" /> Nouvel article
            </button>
          </div>
        </div>

        {posts.length === 0 && (
          <div className="flex flex-col items-center gap-4 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-lore-blue/10 text-lore-blue">
              <BookOpen className="h-8 w-8" />
            </div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Aucun article pour le moment</p>
            <p className="text-sm text-lore-ink/50 dark:text-white/50 max-w-xs">
              Créez votre premier article pour alimenter le blog de Loré Foundation.
            </p>
            <button type="button" onClick={startNew}
              className="rounded-full bg-lore-blue px-6 py-2.5 text-sm font-bold text-white hover:bg-lore-blue/90 transition-colors">
              Écrire le premier article
            </button>
          </div>
        )}

        {notifMsg && (
          <div className={`rounded-2xl px-5 py-3 text-sm font-semibold ${
            notifMsg.startsWith("✅") ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            : notifMsg.startsWith("⚠️") ? "bg-amber-500/10 text-amber-600 dark:text-amber-400"
            : "bg-red-500/10 text-red-500"
          }`}>
            {notifMsg}
          </div>
        )}

        <div className="flex flex-col gap-3">
          {posts.map(post => (
            <div key={post.id}
              className={`rounded-2xl border bg-white dark:bg-lore-night-surface transition-opacity ${
                post.is_published ? "border-lore-dark/5 dark:border-white/5" : "border-dashed border-lore-dark/10 dark:border-white/10 opacity-70"
              }`}>
              <div className="flex items-center gap-4 px-5 py-4">
                {/* Cover miniature */}
                {post.cover_url
                  ? <img src={post.cover_url} alt="" className="h-14 w-20 shrink-0 rounded-xl object-cover" />
                  : <div className="flex h-14 w-20 shrink-0 items-center justify-center rounded-xl bg-lore-blue/10 text-2xl">
                      {CATEGORIES.find(c => c.id === post.category)?.emoji ?? "📝"}
                    </div>
                }

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${CAT_COLORS[post.category] ?? ""}`}>
                      {post.category}
                    </span>
                    {post.is_featured && <span className="text-amber-500 text-xs">⭐ À la une</span>}
                    {!post.is_published && <span className="text-amber-500 text-xs font-semibold">📝 Brouillon</span>}
                  </div>
                  <p className="font-semibold text-sm text-lore-ink dark:text-white truncate mt-1">{post.title}</p>
                  <div className="flex items-center gap-3 mt-0.5 text-[11px] text-lore-ink/40 dark:text-white/40">
                    <span className="flex items-center gap-0.5"><Clock className="h-3 w-3" /> {post.read_time_minutes}min</span>
                    <span className="flex items-center gap-0.5"><Eye className="h-3 w-3" /> {post.views}</span>
                    {post.published_at && <span>{new Date(post.published_at).toLocaleDateString("fr-FR")}</span>}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button type="button" onClick={() => toggleFeatured(post)} title={post.is_featured ? "Retirer de la une" : "Mettre à la une"}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      post.is_featured ? "text-amber-500 hover:bg-amber-500/10" : "text-lore-ink/20 hover:bg-lore-dark/5 dark:text-white/20"
                    }`}>
                    {post.is_featured ? <Star className="h-4 w-4 fill-amber-500" /> : <StarOff className="h-4 w-4" />}
                  </button>
                  <button type="button" onClick={() => togglePublish(post)} title={post.is_published ? "Dépublier" : "Publier"}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                      post.is_published ? "text-emerald-500 hover:bg-emerald-500/10" : "text-lore-ink/30 hover:bg-lore-dark/5 dark:text-white/30"
                    }`}>
                    {post.is_published ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <button type="button" onClick={() => notifySubscribers(post)}
                    disabled={notifying === post.id}
                    title="Notifier les abonnés par email"
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/30 hover:bg-lore-blue/10 hover:text-lore-blue dark:text-white/30 transition-colors disabled:opacity-50">
                    {notifying === post.id
                      ? <Loader2 className="h-4 w-4 animate-spin" />
                      : <Bell className="h-4 w-4" />}
                  </button>
                  <button type="button" onClick={() => startEdit(post)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/40 hover:bg-lore-blue/10 hover:text-lore-blue dark:text-white/40 transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => setDeleteTarget(post)}
                    className="flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/30 hover:bg-red-500/10 hover:text-red-500 dark:text-white/30 transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal génération IA */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !aiGenerating && setAiModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-lore-night-surface shadow-2xl overflow-hidden">

            <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 px-6 py-5 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display font-bold text-lore-ink dark:text-white">Générer un article avec IA</p>
                <p className="text-xs text-lore-ink/50 dark:text-white/50">L&apos;article sera créé en brouillon — vous le validez avant publication</p>
              </div>
              {!aiGenerating && (
                <button type="button" onClick={() => setAiModalOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-lore-ink/40 hover:bg-lore-dark/5 dark:text-white/40">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="p-6 flex flex-col gap-4">
              {aiGenerating ? (
                <div className="flex flex-col items-center gap-4 py-8 text-center">
                  <div className="relative">
                    <Loader2 className="h-12 w-12 animate-spin text-purple-500" />
                    <Sparkles className="absolute inset-0 m-auto h-5 w-5 text-blue-500" />
                  </div>
                  <p className="font-semibold text-sm text-lore-ink dark:text-white">L&apos;IA rédige votre article...</p>
                  <p className="text-xs text-lore-ink/50 dark:text-white/50">Cela peut prendre 15-30 secondes</p>
                </div>
              ) : (
                <>
                  <Field label="Sujet de l'article (optionnel)">
                    <textarea value={aiTopic} onChange={e => setAiTopic(e.target.value)}
                      rows={3}
                      placeholder="ex: L'importance de l'IA dans l'éducation en Haïti — ou laissez vide pour que l'IA choisisse un sujet pertinent"
                      className={INPUT} />
                  </Field>

                  <Field label="Catégorie suggérée (optionnel)">
                    <select value={aiCategory} onChange={e => setAiCategory(e.target.value)} className={INPUT}>
                      <option value="">Laisser l'IA décider</option>
                      {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                    </select>
                  </Field>

                  {aiError && <div className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{aiError}</div>}

                  <div className="rounded-xl bg-blue-500/5 border border-blue-500/15 px-4 py-3 text-xs text-lore-ink/60 dark:text-white/60">
                    💡 L&apos;IA écrira un article complet en lien avec la mission de Loré Foundation
                    (éducation, technologie, leadership, jeunesse haïtienne). Vous pourrez le modifier
                    avant de le publier.
                  </div>

                  <button type="button" onClick={generateWithAI}
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 px-7 py-3.5 text-sm font-bold text-white hover:opacity-90 transition-opacity">
                    <Sparkles className="h-4 w-4" /> Générer l&apos;article
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
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
