"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Trash2, Check, Save, ChevronUp, ChevronDown, Phone } from "lucide-react";
import { FieldLabel, TextInput, SelectInput, PrimaryButton } from "./ui";
import { PLATFORM_META, type ContactInfo, type SocialLink, type SocialPlatform } from "@/lib/site-info";

const PLATFORM_OPTIONS = Object.entries(PLATFORM_META) as [SocialPlatform, (typeof PLATFORM_META)[SocialPlatform]][];

function emptyLink(): SocialLink {
  return { id: `link-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, platform: "facebook", label: "", url: "" };
}

export default function SiteInfoPanel() {
  const [data, setData] = useState<ContactInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    refresh();
  }, []);

  async function refresh() {
    try {
      const res = await fetch("/api/admin/site-info", { credentials: "include" });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Erè pandan chajman kowòdone yo.");
        return;
      }
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
  }

  async function save() {
    if (!data) return;
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/admin/site-info", {
        credentials: "include",
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error || "Erè pandan anrejistreman an.");
        return;
      }
      setError(null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  if (error && !data) {
    return (
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-4 text-sm text-red-500">
        {error}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center py-16 text-lore-ink/40 dark:text-white/40">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  function updatePhone(index: number, value: string) {
    if (!data) return;
    const phones = [...data.phones];
    phones[index] = value;
    setData({ ...data, phones });
  }

  function addPhone() {
    if (!data) return;
    setData({ ...data, phones: [...data.phones, ""] });
  }

  function removePhone(index: number) {
    if (!data) return;
    setData({ ...data, phones: data.phones.filter((_, i) => i !== index) });
  }

  function updateLink(index: number, patch: Partial<SocialLink>) {
    if (!data) return;
    const socialLinks = [...data.socialLinks];
    socialLinks[index] = { ...socialLinks[index], ...patch };
    setData({ ...data, socialLinks });
  }

  function addLink() {
    if (!data) return;
    setData({ ...data, socialLinks: [...data.socialLinks, emptyLink()] });
  }

  function removeLink(index: number) {
    if (!data) return;
    setData({ ...data, socialLinks: data.socialLinks.filter((_, i) => i !== index) });
  }

  function moveLink(index: number, dir: -1 | 1) {
    if (!data) return;
    const target = index + dir;
    if (target < 0 || target >= data.socialLinks.length) return;
    const socialLinks = [...data.socialLinks];
    [socialLinks[index], socialLinks[target]] = [socialLinks[target], socialLinks[index]];
    setData({ ...data, socialLinks });
  }

  return (
    <div className="flex flex-col gap-8">
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 px-5 py-3 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Téléphones */}
      <section className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
        <h3 className="mb-1 font-display text-sm font-bold text-lore-ink dark:text-white">Nimewo telefòn</h3>
        <p className="mb-4 text-xs text-lore-ink/50 dark:text-white/50">
          Yo parèt nan footer, paj kontak, ak kòm plasholder fòm nan.
        </p>
        <div className="flex flex-col gap-2">
          {data.phones.map((phone, i) => (
            <div key={i} className="flex items-center gap-2">
              <Phone className="h-4 w-4 shrink-0 text-lore-ink/30 dark:text-white/30" />
              <TextInput
                value={phone}
                onChange={(e) => updatePhone(i, e.target.value)}
                placeholder="+509 XX XX XXXX"
              />
              <button
                type="button"
                onClick={() => removePhone(i)}
                aria-label="Retire nimewo sa a"
                className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lore-ink/40 hover:bg-red-500/10 hover:text-red-500 dark:text-white/40"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addPhone}
            className="focus-ring mt-1 flex w-fit items-center gap-1.5 rounded-full border border-dashed border-lore-dark/20 px-4 py-2 text-xs font-semibold text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5"
          >
            <Plus className="h-3.5 w-3.5" /> Ajoute yon nimewo
          </button>
        </div>
      </section>

      {/* Email, adresse, WhatsApp */}
      <section className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
        <h3 className="mb-4 font-display text-sm font-bold text-lore-ink dark:text-white">Lòt kowòdone</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <FieldLabel>Imèl</FieldLabel>
            <TextInput
              type="email"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Adrès</FieldLabel>
            <TextInput
              value={data.address}
              onChange={(e) => setData({ ...data, address: e.target.value })}
            />
          </div>
          <div>
            <FieldLabel>Nimewo WhatsApp (mesaj otomatik nan fòm kontak la)</FieldLabel>
            <TextInput
              value={data.whatsappNumber}
              onChange={(e) => setData({ ...data, whatsappNumber: e.target.value.replace(/[^\d]/g, "") })}
              placeholder="50941559094"
            />
            <p className="mt-1 text-xs text-lore-ink/40 dark:text-white/40">
              Sèlman chif — kòd peyi a anndan (egz. 509 pou Ayiti), san + ni espas.
            </p>
          </div>
        </div>
      </section>

      {/* Réseaux sociaux */}
      <section className="rounded-2xl border border-lore-dark/5 bg-white p-5 dark:border-white/5 dark:bg-lore-night-surface">
        <h3 className="mb-1 font-display text-sm font-bold text-lore-ink dark:text-white">Rezo sosyal</h3>
        <p className="mb-4 text-xs text-lore-ink/50 dark:text-white/50">
          Ajoute otan lyen ou vle — Facebook, Instagram, TikTok, YouTube, Telegram, Chanèl WhatsApp, elt.
        </p>
        <div className="flex flex-col gap-2">
          {data.socialLinks.map((link, i) => {
            const meta = PLATFORM_META[link.platform];
            const Icon = meta.Icon;
            return (
              <div
                key={link.id}
                className="flex flex-col gap-2 rounded-2xl border border-lore-dark/5 p-3 dark:border-white/5 sm:flex-row sm:items-center"
              >
                <div className="flex shrink-0 items-center gap-1 text-lore-ink/30 dark:text-white/30">
                  <button type="button" onClick={() => moveLink(i, -1)} disabled={i === 0} aria-label="Monte" className="disabled:opacity-20">
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button type="button" onClick={() => moveLink(i, 1)} disabled={i === data.socialLinks.length - 1} aria-label="Desann" className="disabled:opacity-20">
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:text-lore-emerald-light">
                  <Icon className="h-4 w-4" />
                </div>

                <SelectInput
                  value={link.platform}
                  onChange={(e) => updateLink(i, { platform: e.target.value as SocialPlatform })}
                  className="sm:w-44"
                >
                  {PLATFORM_OPTIONS.map(([key, m]) => (
                    <option key={key} value={key}>{m.label}</option>
                  ))}
                </SelectInput>

                {link.platform === "other" && (
                  <TextInput
                    value={link.label}
                    onChange={(e) => updateLink(i, { label: e.target.value })}
                    placeholder="Non rezo a"
                    className="sm:w-36"
                  />
                )}

                <TextInput
                  value={link.url}
                  onChange={(e) => updateLink(i, { url: e.target.value })}
                  placeholder={meta.placeholder}
                  className="flex-1"
                />

                <button
                  type="button"
                  onClick={() => removeLink(i)}
                  aria-label="Retire lyen sa a"
                  className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-full text-lore-ink/40 hover:bg-red-500/10 hover:text-red-500 dark:text-white/40 sm:self-auto"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}

          {data.socialLinks.length === 0 && (
            <p className="py-6 text-center text-sm text-lore-ink/40 dark:text-white/40">
              Poko gen lyen rezo sosyal. Ajoute premye a anba a.
            </p>
          )}

          <button
            type="button"
            onClick={addLink}
            className="focus-ring mt-1 flex w-fit items-center gap-1.5 rounded-full border border-dashed border-lore-dark/20 px-4 py-2 text-xs font-semibold text-lore-ink/60 hover:bg-lore-dark/5 dark:border-white/20 dark:text-white/60 dark:hover:bg-white/5"
          >
            <Plus className="h-3.5 w-3.5" /> Ajoute yon rezo sosyal
          </button>
        </div>
      </section>

      <div className="flex items-center gap-3">
        <PrimaryButton type="button" onClick={save} disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Anrejistre chanjman yo
        </PrimaryButton>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-semibold text-lore-emerald dark:text-lore-emerald-light">
            <Check className="h-4 w-4" /> Anrejistre !
          </span>
        )}
      </div>
    </div>
  );
}
