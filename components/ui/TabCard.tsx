import { ReactNode } from "react";

type TabCardProps = {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "light" | "dark" | "emerald";
  accent?: boolean;
  noPadding?: boolean;
};

const sizeClass: Record<NonNullable<TabCardProps["size"]>, string> = {
  sm: "tab-corner-sm",
  md: "tab-corner",
  lg: "tab-corner-lg",
};

const variantClass: Record<NonNullable<TabCardProps["variant"]>, string> = {
  light:
    "bg-white shadow-card border border-lore-dark/6 dark:border-0 dark:bg-lore-night-card dark:shadow-card-dark dark:ring-1 dark:ring-white/6",
  dark: "bg-lore-dark text-white shadow-soft",
  emerald: "bg-lore-emerald text-white shadow-soft",
};

export default function TabCard({
  children,
  className = "",
  size = "md",
  variant = "light",
  accent = true,
  noPadding = false,
}: TabCardProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Gold tab accent */}
      {accent && (
        <span
          className="absolute -right-2 -top-2 h-9 w-9 rotate-45 rounded-sm sm:h-11 sm:w-11"
          style={{ background: "linear-gradient(135deg, #f2d272, #d4af37)" }}
          aria-hidden="true"
        />
      )}
      {/* Inner highlight line at top */}
      {accent && variant === "light" && (
        <span
          className="absolute left-4 right-12 top-0 h-px rounded-full opacity-60"
          style={{ background: "linear-gradient(90deg, transparent, #d4af37, transparent)" }}
          aria-hidden="true"
        />
      )}
      <div
        className={`relative h-full w-full transition-all duration-300 ${
          noPadding ? "p-0" : "p-6 sm:p-8"
        } ${sizeClass[size]} ${variantClass[variant]}`}
      >
        {children}
      </div>
    </div>
  );
}
