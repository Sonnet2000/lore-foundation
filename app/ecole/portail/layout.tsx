import type { ReactNode } from "react";
import EcoleNav from "@/components/ecole-portail/EcoleNav";

export default function EcoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-lore-cream text-lore-ink dark:bg-lore-night dark:text-white">
      <EcoleNav />
      {children}
    </div>
  );
}
