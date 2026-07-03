"use client";

import { Cookie } from "lucide-react";
import { resetConsent } from "@/lib/cookie-consent";

export default function ManageCookiesButton() {
  return (
    <button
      type="button"
      onClick={resetConsent}
      className="focus-ring inline-flex items-center gap-2 rounded-full bg-lore-emerald px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-lore-emerald/90"
    >
      <Cookie className="h-4 w-4" />
      Gérer mes préférences de cookies
    </button>
  );
}
