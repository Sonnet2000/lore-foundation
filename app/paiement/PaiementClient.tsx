"use client";

import { useState, useRef } from "react";
import { Smartphone, Building2, CreditCard, Upload, CheckCircle2, Loader2, X, ArrowLeft } from "lucide-react";
import Link from "next/link";

// ─── Enfòmasyon paiement yo ───────────────────────────────────────────────
const PAYMENT_METHODS = [
  {
    id: "moncash" as const,
    name: "MonCash",
    icon: Smartphone,
    color: "from-yellow-400/20 to-amber-300/10 border-yellow-400/40",
    iconBg: "bg-yellow-400/20 text-yellow-600 dark:text-yellow-300",
    number: "+509 34 83 3501",
    instructions: [
      "Ouvri aplikasyon MonCash ou a",
      'Klike sou "Transfert" oswa "Paiement"',
      "Antre nimewo a: +509 34 83 3501",
      "Mete montan an epi konfime",
      "Konsève referans tranzaksyon an (8 chif)",
      "Ranpli fòm anba a avèk referans la",
    ],
  },
  {
    id: "natcash" as const,
    name: "NatCash",
    icon: Smartphone,
    color: "from-blue-400/20 to-blue-300/10 border-blue-400/40",
    iconBg: "bg-blue-400/20 text-blue-600 dark:text-blue-300",
    number: "+509 41 55 9094",
    instructions: [
      "Ouvri aplikasyon NatCash ou a",
      'Chwazi "Transfert Lajan"',
      "Antre nimewo a: +509 41 55 9094",
      "Antre montan an epi valide",
      "Kopye kòd konfirmasyon an",
      "Ranpli fòm anba a avèk kòd la",
    ],
  },
  {
    id: "sogebank" as const,
    name: "Sogebank",
    icon: Building2,
    color: "from-emerald-400/20 to-emerald-300/10 border-emerald-400/40",
    iconBg: "bg-emerald-400/20 text-emerald-600 dark:text-emerald-300",
    number: "Kont #: XXXX-XXXX-XXXX",  // ← Chanje ak vrè nimewo kont ou a
    instructions: [
      "Ale nan nenpòt branch Sogebank",
      'Oswa itilize aplikasyon "Sogexpress"',
      "Fè yon vèsman nan kont: XXXX-XXXX-XXXX",
      "Non kont: LORÉ FOUNDATION",
      "Konsève resi oswa nimewo tranzaksyon an",
      "Ranpli fòm anba a avèk enfòmasyon yo",
    ],
  },
];

const PURPOSES = [
  { value: "sponsor",  label: "Sponsoring Loré Foundation" },
  { value: "service",  label: "Sèvis (Design, Dépannage, etc.)" },
  { value: "seminar",  label: "Séminaire / Fòmasyon" },
  { value: "autre",    label: "Lòt" },
];

const emptyForm = {
  sender_name: "",
  sender_phone: "",
  purpose: "service" as const,
  amount: "",
  currency: "HTG" as "HTG" | "USD",
  reference: "",
  note: "",
};

export default function PaiementClient() {
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const method = PAYMENT_METHODS.find(m => m.id === selectedMethod);

  async function uploadProof(): Promise<string | null> {
    if (!proofFile) return null;
    setUploading(true);
    try {
      const signRes = await fetch("/api/admin/upload-url", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: proofFile.name, folder: "payments" }),
      });
      // Si upload-url echwe (pa konekte), essaye soumèt san prèv
      if (!signRes.ok) return null;
      const { uploadUrl, publicUrl } = await signRes.json();
      await fetch(uploadUrl, { method: "PUT", body: proofFile, headers: { "Content-Type": proofFile.type } });
      return publicUrl;
    } catch {
      return null;
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    if (!selectedMethod) { setError("Chwazi yon metòd paiement."); return; }
    if (!form.sender_name.trim()) { setError("Non obligatwa."); return; }
    if (!form.reference.trim()) { setError("Referans / kòd tranzaksyon obligatwa."); return; }

    setSaving(true);
    const proof_url = await uploadProof();

    const res = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amount: Number(form.amount) || 0,
        method: selectedMethod,
        proof_url,
      }),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) { setError(data.error || "Erè. Eseye ankò."); return; }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-lore-cream dark:bg-lore-night px-5">
        <div className="max-w-md text-center flex flex-col items-center gap-5">
          <CheckCircle2 className="h-16 w-16 text-emerald-500" />
          <h1 className="font-display text-2xl font-bold text-lore-ink dark:text-white">
            Paiement Resevwa!
          </h1>
          <p className="text-lore-ink/60 dark:text-white/60">
            Nou resevwa prèv paiement ou a. Nou ap verifye li epi konfime nan 24 èdtan. Mèsi!
          </p>
          <Link href="/"
            className="rounded-full bg-lore-blue px-8 py-3 font-semibold text-white hover:bg-lore-blue/90 transition-colors">
            Retounen sou site a
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-lore-cream dark:bg-lore-night">
      {/* Header */}
      <div className="border-b border-lore-dark/5 bg-white/80 backdrop-blur-sm dark:border-white/5 dark:bg-lore-night/80 sticky top-0 z-10">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-lore-ink/50 hover:text-lore-ink dark:text-white/50 dark:hover:text-white">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <p className="font-display font-bold text-lore-ink dark:text-white">Paiement</p>
            <p className="text-xs text-lore-ink/50 dark:text-white/50">Loré Foundation</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 flex flex-col gap-8">

        {/* Etap 1 — Chwazi metòd */}
        <div>
          <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white mb-4">
            1. Chwazi Metòd Paiement
          </h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PAYMENT_METHODS.map((m) => (
              <button key={m.id} type="button"
                onClick={() => setSelectedMethod(m.id)}
                className={`rounded-2xl border-2 bg-gradient-to-br ${m.color} p-5 text-left transition-all ${
                  selectedMethod === m.id
                    ? "ring-2 ring-lore-blue ring-offset-2 dark:ring-offset-lore-night"
                    : "opacity-70 hover:opacity-100"
                }`}>
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl ${m.iconBg}`}>
                  <m.icon className="h-5 w-5" />
                </div>
                <p className="font-display font-bold text-lore-ink dark:text-white">{m.name}</p>
                <p className="mt-1 text-xs font-mono text-lore-ink/60 dark:text-white/60">{m.number}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Etap 2 — Enstriksyon */}
        {method && (
          <div className={`rounded-2xl border bg-gradient-to-br ${method.color} p-6`}>
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white mb-4">
              2. Fè Paieman via {method.name}
            </h2>
            <div className="mb-4 rounded-xl bg-white/60 dark:bg-black/20 px-5 py-3">
              <p className="text-xs text-lore-ink/50 dark:text-white/50">Nimewo / Kont</p>
              <p className="font-mono font-bold text-lore-ink dark:text-white text-lg">{method.number}</p>
            </div>
            <ol className="flex flex-col gap-2">
              {method.instructions.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-lore-ink/80 dark:text-white/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lore-blue text-white text-xs font-bold">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        )}

        {/* Etap 3 — Soumèt prèv */}
        {selectedMethod && (
          <div className="rounded-2xl border border-lore-dark/5 bg-white dark:border-white/5 dark:bg-lore-night-surface p-6">
            <h2 className="font-display text-lg font-bold text-lore-ink dark:text-white mb-5">
              3. Soumèt Prèv Paieman
            </h2>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Field label="Non ou *">
                  <input value={form.sender_name}
                    onChange={e => setForm(f => ({ ...f, sender_name: e.target.value }))}
                    placeholder="Jean Pierre" className={INPUT} />
                </Field>
                <Field label="Telefòn">
                  <input value={form.sender_phone}
                    onChange={e => setForm(f => ({ ...f, sender_phone: e.target.value }))}
                    placeholder="+509 3X XX XXXX" className={INPUT} />
                </Field>
                <Field label="Bi Paieman *">
                  <select value={form.purpose}
                    onChange={e => setForm(f => ({ ...f, purpose: e.target.value as typeof form.purpose }))}
                    className={INPUT}>
                    {PURPOSES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                  </select>
                </Field>
                <Field label="Montan">
                  <div className="flex gap-2">
                    <input type="number" value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      placeholder="5000" className={`${INPUT} flex-1`} />
                    <select value={form.currency}
                      onChange={e => setForm(f => ({ ...f, currency: e.target.value as "HTG"|"USD" }))}
                      className={`${INPUT} w-20`}>
                      <option value="HTG">HTG</option>
                      <option value="USD">USD</option>
                    </select>
                  </div>
                </Field>
              </div>

              <Field label="Referans / Kòd Tranzaksyon *">
                <input value={form.reference}
                  onChange={e => setForm(f => ({ ...f, reference: e.target.value }))}
                  placeholder="ex: 12345678 (kòd MonCash/NatCash ou nimewo resi Sogebank)"
                  className={INPUT} />
              </Field>

              <Field label="Nòt (opsyonèl)">
                <textarea value={form.note}
                  onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                  rows={2} placeholder="Ajoute nenpòt enfòmasyon siplemantè..."
                  className={INPUT} />
              </Field>

              {/* Upload prèv */}
              <Field label="Screenshot / Resi (opsyonèl)">
                <div
                  onClick={() => fileRef.current?.click()}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border-2 border-dashed border-lore-dark/10 px-5 py-4 transition-colors hover:border-lore-blue dark:border-white/10">
                  <Upload className="h-5 w-5 text-lore-ink/40 dark:text-white/40" />
                  <div className="flex-1 min-w-0">
                    {proofFile
                      ? <p className="truncate text-sm font-medium text-lore-ink dark:text-white">{proofFile.name}</p>
                      : <p className="text-sm text-lore-ink/40 dark:text-white/40">Klike pou ajoute screenshot resi ou a</p>}
                  </div>
                  {proofFile && (
                    <button type="button" onClick={e => { e.stopPropagation(); setProofFile(null); }}
                      className="text-lore-ink/30 hover:text-red-500">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*,.pdf" className="hidden"
                  onChange={e => setProofFile(e.target.files?.[0] ?? null)} />
              </Field>

              {error && <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-500">{error}</p>}

              <button type="button" onClick={handleSubmit}
                disabled={saving || uploading}
                className="flex items-center justify-center gap-2 rounded-full bg-lore-blue px-8 py-3.5 font-semibold text-white hover:bg-lore-blue/90 disabled:opacity-50 transition-colors">
                {(saving || uploading) && <Loader2 className="h-4 w-4 animate-spin" />}
                {uploading ? "Upload prèv..." : saving ? "Voye..." : "Konfime Paieman Mwen"}
              </button>
            </div>
          </div>
        )}

        {!selectedMethod && (
          <p className="text-center text-sm text-lore-ink/40 dark:text-white/40">
            Chwazi yon metòd paiement pi wo pou kontinye.
          </p>
        )}
      </div>
    </div>
  );
}

const INPUT = "w-full rounded-xl border border-lore-dark/10 bg-lore-cream px-4 py-2.5 text-sm text-lore-ink outline-none focus:border-lore-blue dark:border-white/10 dark:bg-white/5 dark:text-white dark:focus:border-lore-blue";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-lore-ink/60 dark:text-white/60">{label}</label>
      {children}
    </div>
  );
}
