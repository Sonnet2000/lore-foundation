import type { LucideIcon } from "lucide-react";
import Sparkle from "@/components/ui/Sparkle";

type ServiceIllustrationProps = {
  icon: LucideIcon;
  satelliteIcons: [LucideIcon, LucideIcon];
};

/**
 * Branded illustration banner shown at the top of the "En savoir plus"
 * panels: a glowing badge for the main service icon, two smaller satellite
 * icons representing related capabilities, and a few twinkling sparkles —
 * all drawn from the existing Loré Foundation visual language so no external
 * image assets are required.
 */
export default function ServiceIllustration({
  icon: MainIcon,
  satelliteIcons,
}: ServiceIllustrationProps) {
  const [SatelliteOne, SatelliteTwo] = satelliteIcons;

  return (
    <div className="relative flex h-44 items-center justify-center overflow-hidden rounded-t-4xl bg-lore-gradient sm:h-52 dark:bg-lore-gradient-dark">
      <Sparkle className="absolute left-[14%] top-7" size={18} />
      <Sparkle className="absolute right-[16%] top-9 hidden sm:block" size={14} />
      <Sparkle className="absolute bottom-9 left-[22%] hidden sm:block" size={12} />

      {/* Satellite icon — top right */}
      <div className="absolute right-7 top-7 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lore-emerald-light ring-1 ring-white/15 backdrop-blur-sm sm:right-10 sm:top-9 sm:h-14 sm:w-14">
        <SatelliteOne className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
      </div>

      {/* Satellite icon — bottom left */}
      <div className="absolute bottom-8 left-9 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-lore-gold ring-1 ring-white/15 backdrop-blur-sm sm:bottom-10 sm:left-12 sm:h-14 sm:w-14">
        <SatelliteTwo className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.75} />
      </div>

      {/* Main icon badge */}
      <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl bg-white/10 text-white shadow-soft ring-1 ring-white/20 backdrop-blur-sm sm:h-24 sm:w-24">
        <MainIcon className="h-10 w-10 sm:h-12 sm:w-12" strokeWidth={1.5} />
      </div>
    </div>
  );
}
