import {
  Code2,
  Smartphone,
  Palette,
  Clapperboard,
  Megaphone,
  BrainCircuit,
  Server,
  Shirt,
  Sparkles,
  Rocket,
  Users,
  HeadphonesIcon,
  Layers,
  Bot,
  Globe,
  ShoppingCart,
  Camera,
  PenTool,
  LineChart,
  Shield,
  Wrench,
  CreditCard,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

/**
 * Every icon a service can use, keyed by the string name stored in the
 * `services.icon` column. Add new entries here to make them selectable in
 * the admin "Services" panel.
 */
export const iconMap: Record<string, LucideIcon> = {
  Code2,
  Smartphone,
  Palette,
  Clapperboard,
  Megaphone,
  BrainCircuit,
  Server,
  Shirt,
  Sparkles,
  Rocket,
  Users,
  HeadphonesIcon,
  Layers,
  Bot,
  Globe,
  ShoppingCart,
  Camera,
  PenTool,
  LineChart,
  Shield,
  Wrench,
  CreditCard,
  TrendingUp,
};

export const iconNames = Object.keys(iconMap);

/** Falls back to Sparkles if the stored name doesn't match a known icon. */
export function resolveIcon(name: string | null | undefined): LucideIcon {
  return (name && iconMap[name]) || Sparkles;
}
