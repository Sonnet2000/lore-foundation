import type { ReactNode } from "react";
import EcoleNav from "@/components/EcoleNav";

const theme = { navy: "#0B1F3B", royal: "#1E4FD8", sky: "#EAF1FF" };

export default function EcoleLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: theme.sky, color: theme.navy }}>
      <EcoleNav />
      {children}
    </div>
  );
}
