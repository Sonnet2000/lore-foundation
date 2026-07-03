"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";
import { getStoredConsent, setStoredConsent, onConsentChange } from "@/lib/cookie-consent";

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
    return onConsentChange((status) => setVisible(status === null));
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-[100] px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="relative mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-lore-dark/10 bg-white p-5 shadow-2xl dark:border-white/10 dark:bg-lore-night-surface sm:flex-row sm:items-center">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lore-emerald/10 text-lore-emerald dark:text-lore-emerald-light">
          <Cookie className="h-5 w-5" />
        </div>
        <p className="flex-1 text-sm text-lore-ink/70 dark:text-white/70">
          Nous utilisons des cookies pour mesurer notre audience (Google Analytics) et afficher des
          publicités (Google AdSense) qui financent nos actions. Vous pouvez accepter ou refuser.{" "}
          <Link href="/politique-de-confidentialite" className="font-semibold text-lore-emerald underline underline-offset-2 dark:text-lore-emerald-light">
            En savoir plus
          </Link>
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => setStoredConsent("rejected")}
            className="focus-ring rounded-full border border-lore-dark/10 px-4 py-2.5 text-sm font-semibold text-lore-ink/70 transition-colors hover:bg-lore-dark/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/5"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => setStoredConsent("accepted")}
            className="focus-ring rounded-full bg-lore-emerald px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-lore-emerald/90"
          >
            Accepter
          </button>
        </div>
        <button
          type="button"
          onClick={() => setStoredConsent("rejected")}
          aria-label="Fermer et refuser les cookies non essentiels"
          className="focus-ring absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full text-lore-ink/30 hover:bg-lore-dark/5 dark:text-white/30 dark:hover:bg-white/5 sm:hidden"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
