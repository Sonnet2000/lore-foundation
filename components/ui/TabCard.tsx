import { ReactNode } from "react";

type TabCardProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "emerald";
  accent?: boolean;
  noPadding?: boolean;
  /** Padding plis sere sou mobil (pou grid 2 kolòn) — retounen nòmal apre sm: */
  compact?: boolean;
};

const variantClass: Record<NonNullable<TabCardProps["variant"]>, string> = {
  light:
    "bg-white border border-lore-ink/10 shadow-card dark:border-white/10 dark:bg-lore-night-card dark:shadow-card-dark",
  dark: "bg-lore-ink text-white shadow-soft",
  emerald: "bg-lore-emerald text-white shadow-soft",
};

/**
 * Kat plat ak kwen won (ranplase ansyen kat "kwen koupe" ak etikèt dore a).
 * Nou kenbe menm pwopriyete yo (size/accent) pou pa kase fichye ki deja itilize l.
 */
export default function TabCard({
  children,
  className = "",
  variant = "light",
  noPadding = false,
  compact = false,
}: TabCardProps) {
  return (
    <div className={`relative ${className}`}>
      <div
        className={`relative h-full w-full rounded-3xl transition-shadow duration-300 ${
          noPadding ? "p-0" : compact ? "p-4 sm:p-8" : "p-6 sm:p-8"
        } ${variantClass[variant]}`}
      >
        {children}
      </div>
    </div>
  );
}
