import { ReactNode } from "react";

type TabCardProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "emerald";
  accent?: boolean;
};

const sizeClass: Record<NonNullable<TabCardProps["size"]>, string> = {
  sm: "tab-corner-sm",
  md: "tab-corner",
  lg: "tab-corner-lg",
};

const variantClass: Record<NonNullable<TabCardProps["variant"]>, string> = {
  light:
    "bg-white shadow-card border border-lore-dark/5 dark:border-0 dark:bg-lore-night-surface dark:shadow-none dark:ring-1 dark:ring-white/5",
  dark: "bg-lore-dark text-white shadow-soft",
  emerald: "bg-lore-emerald text-white shadow-soft",
};

/**
 * Signature shape language for Loré Foundation: a card with a clipped
 * top-right corner and a small gold "tab" peeking through it, evoking a
 * digital folder / project tab — fitting for a digital services brand.
 */
export default function TabCard({
  children,
  className = "",
  size = "md",
  variant = "light",
  accent = true,
}: TabCardProps) {
  return (
    <div className={`relative ${className}`}>
      {accent && (
        <span
          className="absolute -right-2 -top-2 h-9 w-9 rotate-45 rounded-sm bg-lore-gold sm:h-11 sm:w-11"
          aria-hidden="true"
        />
      )}
      <div
        className={`relative h-full w-full p-6 transition-transform duration-300 sm:p-8 ${sizeClass[size]} ${variantClass[variant]}`}
      >
        {children}
      </div>
    </div>
  );
}
