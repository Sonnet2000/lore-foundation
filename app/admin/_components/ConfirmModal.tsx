"use client";

import { useEffect, useRef } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";

interface ConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  danger = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmModalProps) {
  const confirmRef = useRef<HTMLButtonElement>(null);

  // Auto-focus the confirm button when modal opens
  useEffect(() => {
    if (open) {
      setTimeout(() => confirmRef.current?.focus(), 50);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl dark:bg-lore-night-surface">
        {/* Icon */}
        <div
          className={`mx-auto flex h-12 w-12 items-center justify-center rounded-2xl ${
            danger
              ? "bg-red-500/10 text-red-500"
              : "bg-lore-emerald/10 text-lore-emerald dark:bg-lore-emerald/15 dark:text-lore-emerald-light"
          }`}
        >
          <AlertTriangle className="h-6 w-6" />
        </div>

        {/* Text */}
        <h2
          id="confirm-modal-title"
          className="mt-4 text-center font-display text-base font-bold text-lore-ink dark:text-white"
        >
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-lore-ink/60 dark:text-white/60">
          {message}
        </p>

        {/* Actions */}
        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="focus-ring flex-1 rounded-full border border-lore-dark/10 px-4 py-2.5 text-sm font-semibold text-lore-ink/70 transition-colors hover:bg-lore-dark/5 disabled:opacity-50 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
          >
            Annuler
          </button>
          <button
            ref={confirmRef}
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`focus-ring flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-bold transition-colors disabled:opacity-50 ${
              danger
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-lore-gold text-lore-dark hover:bg-lore-gold/90"
            }`}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
