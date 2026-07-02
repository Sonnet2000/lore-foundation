"use client";

import type { ReactNode } from "react";
import { GripVertical, Pencil, Trash2, ChevronUp, ChevronDown } from "lucide-react";

export function FieldLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-1.5 block text-sm font-medium text-lore-ink/70 dark:text-white/70">
      {children}
    </span>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full rounded-xl border border-lore-dark/10 bg-white px-3.5 py-2.5 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white ${
        props.className ?? ""
      }`}
    />
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-xl border border-lore-dark/10 bg-white px-3.5 py-2.5 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white ${
        props.className ?? ""
      }`}
    />
  );
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`w-full rounded-xl border border-lore-dark/10 bg-white px-3.5 py-2.5 text-sm text-lore-ink outline-none transition-colors focus:border-lore-emerald dark:border-white/10 dark:bg-white/5 dark:text-white ${
        props.className ?? ""
      }`}
    />
  );
}

export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full bg-lore-gold px-5 py-2.5 text-sm font-bold text-lore-dark transition-transform hover:scale-[1.02] disabled:opacity-50 ${
        props.className ?? ""
      }`}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`focus-ring inline-flex items-center justify-center gap-2 rounded-full border border-lore-dark/10 px-5 py-2.5 text-sm font-semibold text-lore-ink/70 transition-colors hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5 ${
        props.className ?? ""
      }`}
    />
  );
}

type RowCardProps = {
  title: string;
  subtitle?: string;
  thumbnail?: ReactNode;
  extraAction?: ReactNode;
  onEdit: () => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
};

export function RowCard({
  title,
  subtitle,
  thumbnail,
  extraAction,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown,
}: RowCardProps) {
  return (
    <div className="flex items-center gap-3 rounded-2xl border border-lore-dark/5 bg-white p-3 dark:border-white/5 dark:bg-lore-night-surface">
      {(onMoveUp || onMoveDown) && (
        <div className="flex flex-col text-lore-ink/30 dark:text-white/30">
          <button
            type="button"
            onClick={onMoveUp}
            disabled={!onMoveUp}
            aria-label="Monter"
            className="disabled:opacity-20"
          >
            <ChevronUp className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={!onMoveDown}
            aria-label="Descendre"
            className="disabled:opacity-20"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        </div>
      )}

      {thumbnail}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-lore-ink dark:text-white">{title}</p>
        {subtitle && (
          <p className="truncate text-xs text-lore-ink/50 dark:text-white/50">{subtitle}</p>
        )}
      </div>

      {extraAction}

      <button
        type="button"
        onClick={onEdit}
        aria-label="Modifier"
        className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lore-ink/50 hover:bg-lore-dark/5 hover:text-lore-emerald dark:text-white/50 dark:hover:bg-white/5"
      >
        <Pencil className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onDelete}
        aria-label="Supprimer"
        className="focus-ring flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lore-ink/50 hover:bg-red-500/10 hover:text-red-500 dark:text-white/50"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}

export function DragHint() {
  return <GripVertical className="h-4 w-4 shrink-0 text-lore-ink/20 dark:text-white/20" />;
}

type StatCardProps = {
  label: string;
  value: string | number;
  icon: React.ComponentType<{ className?: string }>;
  hint?: string;
};

export function StatCard({ label, value, icon: Icon, hint }: StatCardProps) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-lore-dark/5 bg-white p-4 dark:border-white/5 dark:bg-lore-night-surface">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-lore-ink/40 dark:text-white/40">
          {label}
        </span>
        <Icon className="h-4 w-4 text-lore-emerald dark:text-lore-emerald-light" />
      </div>
      <p className="font-display text-2xl font-bold text-lore-ink dark:text-white">{value}</p>
      {hint && <p className="text-xs text-lore-ink/40 dark:text-white/40">{hint}</p>}
    </div>
  );
}
