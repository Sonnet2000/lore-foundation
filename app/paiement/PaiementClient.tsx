"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Copy, Check, Upload, Loader2, FileText, CheckCircle2, AlertCircle,
  Smartphone, Building2, CreditCard, ExternalLink,
} from "lucide-react";

type Settings = {
  binanceEnabled: boolean;
  binancePayId: string;
  binanceWalletAddress: string;
  binanceQrUrl: string;
  instructions: string;
};

type LocalMethod = {
  id: string;
  type: "moncash" | "natcash" | "sogebank" | "autre";
  label: string;
  number: string;
  details: string;
  instructions: string;
  sort_order: number;
};

const TYPE_META: Record<LocalMethod["type"], { icon: typeof Smartphone; fallbackLabel: string }> = {
  moncash: { icon: Smartphone, fallbackLabel: "MonCash" },
  natcash: { icon: Smartphone, fallbackLabel: "NatCash" },
  sogebank: { icon: Building2, fallbackLabel: "Sogebank" },
  autre: { icon: CreditCard, fallbackLabel: "Autre" },
};

function CopyRow({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  if (!value) return null;
  return (
    <div className="flex items-center justify-between gap-3 rounded-xl bg-white/5 px-4 py-3">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-white/40">{label}</p>
        <p className="truncate font-mono text-sm text-white">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => { navigator.clipboard.writeText(value); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
        className="focus-ring shrink-0 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
      >
        {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
        {copied ? "Copié" : "Copier"}
      </button>
    </div>
  );
}

export default function PaiementClient({ settings }: { settings: Settings }) {
  const searchParams = useSearchParams();

  const [localMethods, setLocalMethods] = useState<LocalMethod[] | null>(null);
  const [selected, setSelected] = useState<string | null>(null); // "binance" | localMethod.id | "card"

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState(searchParams.get("subject") ?? "");
  const [amount, setAmount] = useState(searchParams.get("amount") ?? "");
  const [reference, setReference] = useState("");
  const [proofUrl, setProofUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  // Kat Visa/Mastercard (Stripe)
  const [cardAmount, setCardAmount] = useState("");
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/payment-methods")
      .then((r) => r.json())
      .then((data) => setLocalMethods(Array.isArray(data.items) ? data.items : []))
      .catch(() => setLocalMethods([]));
  }, []);

  // Chwazi premye opsyon disponib la otomatikman
  useEffect(() => {
    if (selected !== null || localMethods === null) return;
    if (settings.binanceEnabled) { setSelected("binance"); return; }
    if (localMethods.length > 0) { setSelected(localMethods[0].id); return; }
    setSelected("card");
  }, [localMethods, settings.binanceEnabled, selected]);

  const activeLocalMethod = localMethods?.find((m) => m.id === selected) ?? null;
  const isCard = selected === "card";
  const isBinance = selected === "binance";
  const isManual = !isCard; // binance oswa lokal — menm fòm manyèl la

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const signRes = await fetch("/api/payments/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename: file.name, size: file.size }),
      });
      const signData = await signRes.json();
      if (!signRes.ok) throw new Error(signData.error || "Echèk upload.");

      const uploadRes = await fetch(signData.signedUrl, {
        method: "PUT",
        headers: { "Content-Type": signData.contentType },
        body: file,
      });
      if (!uploadRes.ok) throw new Error("Echèk upload.");

      setProofUrl(signData.publicUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Echèk upload fichye a.");
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit() {
    setError(null);
    if (!fullName.trim() || !email.trim() || !subject.trim()) {
      setError("Ranpli non, imèl ak pou ki sa peman an ye.");
      return;
    }
    if (!reference.trim() && !proofUrl) {
      setError("Ajoute referans tranzaksyon an oswa yon kapti ekran.");
      return;
    }
    setSubmitting(true);
    try {
      const method = isBinance ? "binance" : (activeLocalMethod?.type ?? "autre");
      const res = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName, email, phone, subject, amount,
          reference, proof_url: proofUrl ?? "", method,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Echèk soumèt demand lan.");
      setDone(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erè sèvè.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleCardPay() {
    setCardError(null);
    if (!fullName.trim() || !email.trim() || !subject.trim()) {
      setCardError("Ranpli non, imèl ak pou ki sa peman an ye.");
      return;
    }
    if (!cardAmount.trim() || Number(cardAmount) <= 0) {
      setCardError("Antre yon montan valab an USD.");
      return;
    }
    setCardLoading(true);
    try {
      const res = await fetch("/api/stripe/service-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cardAmount, subject, full_name: fullName, email }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.url) throw new Error(data.error || "Peman pa kat pa disponib kounye a.");
      window.location.href = data.url;
    } catch (e) {
      setCardError(e instanceof Error ? e.message : "Erè sèvè.");
      setCardLoading(false);
    }
  }

  const hasAnyMethod = settings.binanceEnabled || (localMethods && localMethods.length > 0) || true; // kat toujou disponib potansyèlman

  return (
    <div className="min-h-screen bg-lore-night">
      <div className="sticky top-0 z-20 border-b border-white/10 bg-lore-night/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-2xl items-center gap-4 px-5 py-4">
          <Link href="/" className="text-white/50 hover:text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <p className="font-display font-bold text-white">Paiement</p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-5 py-12">
        {!hasAnyMethod ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <AlertCircle className="h-10 w-10 text-white/30" />
            <p className="text-white/60">
              Le paiement en ligne n&apos;est pas encore activé. Contactez-nous directement pour organiser le paiement.
            </p>
            <Link href="/#contact" className="rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark">
              Nous contacter
            </Link>
          </div>
        ) : done ? (
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-lore-emerald/20 bg-lore-emerald/10 p-10 text-center">
            <CheckCircle2 className="h-12 w-12 text-lore-emerald-light" />
            <h1 className="font-display text-xl font-bold text-white">Demande envoyée !</h1>
            <p className="text-white/60">
              Notre équipe va vérifier votre paiement et vous contactera très bientôt pour confirmer.
            </p>
            <Link href="/" className="rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark">
              Retour à l&apos;accueil
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <div>
              <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">Payer</h1>
              <p className="mt-2 text-sm text-white/60">
                Choisissez votre méthode de paiement préférée ci-dessous.
              </p>
            </div>

            {/* Sélecteur de méthode */}
            <div className="flex flex-wrap gap-2">
              {settings.binanceEnabled && (
                <button type="button" onClick={() => setSelected("binance")}
                  className={`focus-ring rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                    isBinance ? "bg-lore-gold text-lore-dark" : "bg-white/5 text-white/60 hover:bg-white/10"
                  }`}>
                  Binance Pay
                </button>
              )}
              {localMethods?.map((m) => {
                const Icon = TYPE_META[m.type]?.icon ?? CreditCard;
                return (
                  <button key={m.id} type="button" onClick={() => setSelected(m.id)}
                    className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                      selected === m.id ? "bg-lore-gold text-lore-dark" : "bg-white/5 text-white/60 hover:bg-white/10"
                    }`}>
                    <Icon className="h-3.5 w-3.5" />
                    {m.label || TYPE_META[m.type]?.fallbackLabel}
                  </button>
                );
              })}
              <button type="button" onClick={() => setSelected("card")}
                className={`focus-ring inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-colors ${
                  isCard ? "bg-lore-gold text-lore-dark" : "bg-white/5 text-white/60 hover:bg-white/10"
                }`}>
                <CreditCard className="h-3.5 w-3.5" />
                Carte Visa / Mastercard
              </button>
            </div>

            {/* Infos méthode sélectionnée */}
            {isBinance && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-4">
                {settings.binanceQrUrl && (
                  <div className="relative mx-auto h-48 w-48 overflow-hidden rounded-2xl bg-white">
                    <Image src={settings.binanceQrUrl} alt="QR Binance Pay" fill className="object-contain p-2" unoptimized />
                  </div>
                )}
                <CopyRow label="Binance Pay ID" value={settings.binancePayId} />
                <CopyRow label="Adresse wallet" value={settings.binanceWalletAddress} />
                <p className="text-sm text-white/50">{settings.instructions}</p>
              </div>
            )}

            {activeLocalMethod && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-4">
                <CopyRow label={activeLocalMethod.label || "Numéro"} value={activeLocalMethod.number} />
                {activeLocalMethod.details && <p className="text-sm text-white/70">{activeLocalMethod.details}</p>}
                {activeLocalMethod.instructions && (
                  <p className="text-sm text-white/50">{activeLocalMethod.instructions}</p>
                )}
              </div>
            )}

            {isCard && (
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 flex flex-col gap-4">
                <p className="text-sm text-white/60">
                  Paiement 100% sécurisé par carte Visa ou Mastercard. Vous serez redirigé vers une page
                  de paiement sécurisée pour entrer les détails de votre carte.
                </p>
                <input
                  value={cardAmount}
                  onChange={(e) => setCardAmount(e.target.value)}
                  type="number"
                  min={1}
                  placeholder="Montant à payer (USD)"
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold"
                />
              </div>
            )}

            {/* Formulaire */}
            <div className="flex flex-col gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nom complet"
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold" />
                <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="Email"
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Téléphone (optionnel)"
                  className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold" />
                {isManual && (
                  <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="Montant envoyé (ex: 1 500 HTG)"
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold" />
                )}
              </div>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="Pour quel service ? (ex: Développement site web)"
                className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold" />

              {isManual && (
                <>
                  <input value={reference} onChange={(e) => setReference(e.target.value)} placeholder="Référence / ID de transaction"
                    className="rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-sm text-white outline-none focus:border-lore-gold" />

                  <div className="flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => inputRef.current?.click()}
                      disabled={uploading}
                      className="focus-ring inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-white/70 hover:bg-white/5 disabled:opacity-50"
                    >
                      {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                      {proofUrl ? "Remplacer la capture" : "Ajouter une capture d'écran"}
                    </button>
                    {proofUrl && (
                      <a href={proofUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-lore-gold-light hover:text-white">
                        <FileText className="h-3.5 w-3.5" />Voir le fichier
                      </a>
                    )}
                    <input ref={inputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
                  </div>

                  {error && <p className="text-sm text-red-400">{error}</p>}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="focus-ring self-start rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {submitting ? "Envoi..." : "Confirmer mon paiement"}
                  </button>
                </>
              )}

              {isCard && (
                <>
                  {cardError && <p className="text-sm text-red-400">{cardError}</p>}
                  <button
                    type="button"
                    onClick={handleCardPay}
                    disabled={cardLoading}
                    className="focus-ring inline-flex self-start items-center gap-2 rounded-full bg-lore-gold px-6 py-3 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50"
                  >
                    {cardLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                    {cardLoading ? "Redirection..." : "Payer en ligne par carte"}
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
