"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Camera, CheckCircle2, Lock } from "lucide-react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function ProfileForm({
  email,
  fullName: initialFullName,
  phone: initialPhone,
  avatarUrl: initialAvatarUrl,
  showPasswordSection,
}: {
  email: string;
  fullName: string;
  phone: string;
  avatarUrl: string | null;
  showPasswordSection: boolean;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [fullName, setFullName] = useState(initialFullName);
  const [phone, setPhone] = useState(initialPhone);
  const [avatarUrl, setAvatarUrl] = useState(initialAvatarUrl);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState<string | null>(null);

  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState<string | null>(null);

  const initials = (fullName || email)
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  async function handleAvatarChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarError(null);
    setAvatarUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/account/avatar", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        setAvatarError(data.error || "Envoi impossible.");
      } else {
        setAvatarUrl(data.url);
      }
    } catch {
      setAvatarError("Erreur réseau. Réessayez.");
    } finally {
      setAvatarUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleSaveProfile(e: FormEvent) {
    e.preventDefault();
    setProfileError(null);
    setSaved(false);
    setSaving(true);

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, phone }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error || "Mise à jour impossible.");
      } else {
        setSaved(true);
        router.refresh();
        setTimeout(() => setSaved(false), 2500);
      }
    } catch {
      setProfileError("Erreur réseau. Réessayez.");
    } finally {
      setSaving(false);
    }
  }

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSaved(false);

    if (newPassword.length < 8) {
      setPwError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }

    setPwSaving(true);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setPwSaving(false);

    if (error) {
      setPwError("Impossible de mettre à jour le mot de passe.");
      return;
    }

    setPwSaved(true);
    setNewPassword("");
    setTimeout(() => setPwSaved(false), 2500);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Avatar */}
      <div className="flex items-center gap-5 rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10">
        <div className="relative h-16 w-16 shrink-0">
          {avatarUrl ? (
            <div className="relative h-16 w-16 overflow-hidden rounded-full ring-1 ring-white/15">
              <Image src={avatarUrl} alt={fullName || email} fill className="object-cover" />
            </div>
          ) : (
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lore-gold-gradient text-lg font-bold text-lore-dark">
              {initials || "?"}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={avatarUploading}
            className="focus-ring absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-lore-night-surface text-white ring-2 ring-lore-night hover:bg-white/10"
            aria-label="Changer la photo de profil"
          >
            {avatarUploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarChange}
          />
        </div>
        <div>
          <p className="font-semibold text-white">{fullName || "Sans nom"}</p>
          <p className="text-sm text-white/45">{email}</p>
          {avatarError && <p className="mt-1 text-xs text-red-400">{avatarError}</p>}
        </div>
      </div>

      {/* Infos personnelles */}
      <form
        onSubmit={handleSaveProfile}
        className="flex flex-col gap-4 rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10"
      >
        <h2 className="text-sm font-bold uppercase tracking-wide text-white/40">Informations personnelles</h2>

        <div>
          <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-white/70">
            Nom complet
          </label>
          <input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition-colors focus:border-lore-emerald"
          />
        </div>

        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-white/70">
            Téléphone
          </label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+509 00 00 0000"
            className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition-colors focus:border-lore-emerald"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-white/70">Adresse email</label>
          <input
            type="email"
            value={email}
            disabled
            className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2.5 text-white/40 outline-none"
          />
        </div>

        {profileError && <p className="text-sm text-red-400">{profileError}</p>}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || !fullName}
            className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-6 py-2.5 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              Enregistré
            </span>
          )}
        </div>
      </form>

      {/* Sécurité */}
      {showPasswordSection && (
        <form
          onSubmit={handleChangePassword}
          className="flex flex-col gap-4 rounded-2xl bg-white/[0.03] p-5 ring-1 ring-white/10"
        >
          <h2 className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-white/40">
            <Lock className="h-3.5 w-3.5" />
            Mot de passe
          </h2>

          <div>
            <label htmlFor="newPassword" className="mb-1.5 block text-sm font-medium text-white/70">
              Nouveau mot de passe
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="8 caractères minimum"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-white outline-none transition-colors focus:border-lore-emerald"
            />
          </div>

          {pwError && <p className="text-sm text-red-400">{pwError}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pwSaving || !newPassword}
              className="focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-white/10 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-white/15 disabled:opacity-50"
            >
              {pwSaving && <Loader2 className="h-4 w-4 animate-spin" />}
              Mettre à jour
            </button>
            {pwSaved && (
              <span className="inline-flex items-center gap-1.5 text-sm text-green-400">
                <CheckCircle2 className="h-4 w-4" />
                Mot de passe mis à jour
              </span>
            )}
          </div>
        </form>
      )}
    </div>
  );
}
