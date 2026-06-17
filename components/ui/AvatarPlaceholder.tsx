import { ImageIcon, type LucideIcon } from "lucide-react";

type AvatarPlaceholderProps = {
  className?: string;
  label?: string;
  icon?: LucideIcon;
  rounded?: "full" | "tab";
};

/**
 * Stand-in for a real photo. Swap the contents of this component for an
 * <Image /> (next/image) once real assets are available — the wrapper
 * className controls size & shape from the parent.
 */
export default function AvatarPlaceholder({
  className = "",
  label,
  icon: Icon = ImageIcon,
  rounded = "full",
}: AvatarPlaceholderProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed border-white/30 bg-gradient-to-br from-lore-emerald/40 via-lore-dark/60 to-lore-darker text-white/70 ${
        rounded === "full" ? "rounded-full" : "tab-corner-alt rounded-2xl"
      } ${className}`}
    >
      <Icon className="h-1/4 w-1/4 min-h-6 min-w-6 opacity-70" strokeWidth={1.5} />
      {label && (
        <span className="px-2 text-center text-[11px] font-medium uppercase tracking-wider opacity-70">
          {label}
        </span>
      )}
    </div>
  );
}
