"use client";

import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, XCircle, Clock3, FileText } from "lucide-react";
import { FieldLabel, TextInput, TextArea, PrimaryButton } from "./ui";
import ImageUploadField from "./ImageUploadField";
import type { PaymentRequestRow } from "./types";

type PaymentSettings = {
  binanceEnabled: boolean;
  binancePayId: string;
  binanceWalletAddress: string;
  binanceQrUrl: string;
  instructions: string;
};

const emptySettings: PaymentSettings = {
  binanceEnabled: false, binancePayId: "", binanceWalletAddress: "", binanceQrUrl: "", instructions: "",
};

const STATUS_LABEL: Record<string, string> = { pending: "An atant", confirmed: "Konfime", rejected: "Rejte" };

export default function PaymentsPanel() {
  const [settings, setSettings] = useState<PaymentSettings>(emptySettings);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [savingSettings, setSavingSettings] = useState(false);
  const [settingsSaved, setSettingsSaved] = useState(false);

  const [requests, setRequests] = useState<PaymentRequestRow[] | null>(null);
  const [filter, setFilter] = useState<"pending" | "confirmed" | "rejected" | "all">("pending");
  const [settingsError, setSettingsError] = useState<string | null>(null);

  useEffect(() => {
    refreshSettings();
    refreshRequests();
  }, []);

  async function refreshSettings() {
    setLoadingSettings(true);
    try {
      const res = await fetch("/api/admin/payment-settings", { credentials: "include", cache: "no-store" });
      const d = await res.json().catch(() => ({}));
      if (!res.ok) { setSettingsError(d.error || "Erreur de chargement."); return; }
      setSettingsError(null);
      setSettings({ ...emptySettings, ...d });
    } catch {
      setSettingsError("Erreur de connexion au serveur.");
    } finally {
      setLoadingSettings(false);
    }
  }

  async function refreshRequests() {
    const res = await fetch("/api/admin/payments", { credentials: "include" });
    const data = await res.json().catch(() => ({}));
    setRequests(res.ok ? data.items ?? [] : []);
  }

  async function saveSettings() {
    setSavingSettings(true);
    setSettingsError(null);
    try {
      const res = await fetch("/api/admin/payment-settings", {
        credentials: "include", method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) { setSettingsError(data.error || "Echèk anrejistreman."); return; }
      // Reconfirme sa ki reyèlman anrejistre nan baz done a (evite yon fo "sove" lokal).
      await refreshSettings();
      setSettingsSaved(true);
      setTimeout(() => setSettingsSaved(false), 2000);
    } catch {
      setSettingsError("Erreur de connexion au serveur.");
    } finally {
      setSavingSettings(false);
    }
  }

  async function decide(id: string, status: "confirmed" | "rejected") {
    setRequests((prev) => prev?.map((r) => (r.id === id ? { ...r, status } : r)) ?? null);
    await fetch(`/api/admin/payments/${id}`, {
      credentials: "include", method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
  }

  const filtered = (requests ?? []).filter((r) => filter === "all" || r.status === filter);

  return (
    <div className="flex flex-col gap-10">
      {/* ── Paramètres Binance ─────────────────────────────────────────── */}
      <div>
        <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white mb-1">Konfigirasyon Binance</h2>
        <p className="mb-4 text-sm text-lore-ink/50 dark:text-white/50">
          Sa a se yon peman ki verifye manyèlman — pa gen API ki konekte otomatikman ak kont Binance ou a.
          Moun voye lajan sou Pay ID/adrès la, yo soumèt referans/kapti ekran, epi ou konfime li isit la.
        </p>

        {settingsError && (
          <div className="mb-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{settingsError}</div>
        )}

        {loadingSettings ? (
          <Loader2 className="h-5 w-5 animate-spin text-lore-ink/40" />
        ) : (
          <div className="rounded-3xl border border-lore-dark/5 bg-lore-cream/60 p-5 dark:border-white/5 dark:bg-white/[0.03]">
            <label className="flex items-center gap-2 text-sm font-medium text-lore-ink/70 dark:text-white/70">
              <input
                type="checkbox"
                checked={settings.binanceEnabled}
                onChange={(e) => setSettings({ ...settings, binanceEnabled: e.target.checked })}
                className="h-4 w-4 rounded accent-lore-emerald"
              />
              Aktive Binance kòm metòd peman sou sit la
            </label>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel>Binance Pay ID</FieldLabel>
                <TextInput value={settings.binancePayId} onChange={(e) => setSettings({ ...settings, binancePayId: e.target.value })} placeholder="Ex: 123456789" />
              </div>
              <div>
                <FieldLabel>Adrès wallet (opsyonèl)</FieldLabel>
                <TextInput value={settings.binanceWalletAddress} onChange={(e) => setSettings({ ...settings, binanceWalletAddress: e.target.value })} placeholder="Ex: adrès USDT (TRC20)..." />
              </div>
            </div>

            <div className="mt-4">
              <ImageUploadField label="QR kòd Binance (opsyonèl)" value={settings.binanceQrUrl || null} onChange={(url) => setSettings({ ...settings, binanceQrUrl: url ?? "" })} folder="payments" />
            </div>

            <div className="mt-4">
              <FieldLabel>Enstriksyon pou moun k ap peye</FieldLabel>
              <TextArea rows={3} value={settings.instructions} onChange={(e) => setSettings({ ...settings, instructions: e.target.value })} />
            </div>

            <div className="mt-5 flex items-center gap-3">
              <PrimaryButton onClick={saveSettings} disabled={savingSettings}>
                {savingSettings && <Loader2 className="h-4 w-4 animate-spin" />}Anrejistre
              </PrimaryButton>
              {settingsSaved && <span className="text-sm font-semibold text-lore-emerald">✓ Anrejistre</span>}
            </div>
          </div>
        )}
      </div>

      {/* ── Demand peman sèvis ─────────────────────────────────────────── */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white">
            Demand peman ({filtered.length})
          </h2>
          <div className="flex gap-1 rounded-full bg-lore-dark/5 p-1 dark:bg-white/5">
            {(["pending", "confirmed", "rejected", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  filter === f ? "bg-white text-lore-ink shadow-sm dark:bg-lore-night-surface dark:text-white" : "text-lore-ink/50 dark:text-white/50"
                }`}
              >
                {f === "all" ? "Tout" : STATUS_LABEL[f]}
              </button>
            ))}
          </div>
        </div>

        {requests === null ? (
          <Loader2 className="h-5 w-5 animate-spin text-lore-ink/40" />
        ) : filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-lore-ink/40 dark:text-white/40">Pa gen demand isit la.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map((r) => (
              <div key={r.id} className="rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-lore-ink dark:text-white">{r.full_name} — {r.subject}</p>
                    <p className="text-xs text-lore-ink/50 dark:text-white/50">{r.email}{r.phone ? ` · ${r.phone}` : ""}{r.amount ? ` · ${r.amount}` : ""}</p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    r.status === "confirmed" ? "bg-lore-emerald/10 text-lore-emerald" :
                    r.status === "rejected" ? "bg-red-500/10 text-red-500" : "bg-amber-500/10 text-amber-600"
                  }`}>
                    {r.status === "confirmed" ? <CheckCircle2 className="h-3 w-3" /> : r.status === "rejected" ? <XCircle className="h-3 w-3" /> : <Clock3 className="h-3 w-3" />}
                    {STATUS_LABEL[r.status]}
                  </span>
                </div>

                {r.reference && <p className="mt-2 text-xs text-lore-ink/60 dark:text-white/60">Referans: <span className="font-mono">{r.reference}</span></p>}
                {r.proof_url && (
                  <a href={r.proof_url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-lore-blue hover:underline">
                    <FileText className="h-3.5 w-3.5" />Gade prèv la
                  </a>
                )}

                {r.status === "pending" && (
                  <div className="mt-3 flex gap-2">
                    <button onClick={() => decide(r.id, "confirmed")} className="focus-ring rounded-full bg-lore-emerald/10 px-3 py-1.5 text-xs font-semibold text-lore-emerald hover:bg-lore-emerald/20">Konfime</button>
                    <button onClick={() => decide(r.id, "rejected")} className="focus-ring rounded-full bg-red-500/10 px-3 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-500/20">Rejte</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
