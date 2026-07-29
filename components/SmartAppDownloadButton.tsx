"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Download, Monitor, Smartphone, ExternalLink } from "lucide-react";

type Platform = "android" | "ios" | "desktop" | "unknown";

type Props = {
  exeUrl: string | null;
  exeVersion: string;
  exeSizeMb: number;
  apkUrl: string | null;
  apkVersion: string;
  apkSizeMb: number;
  playstoreUrl: string | null;
  websiteUrl: string | null;
};

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent || "";
  if (/android/i.test(ua)) return "android";
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/win|mac os|linux/i.test(ua)) return "desktop";
  return "unknown";
}

export default function SmartAppDownloadButton({
  exeUrl, exeVersion, exeSizeMb,
  apkUrl, apkVersion, apkSizeMb,
  playstoreUrl, websiteUrl,
}: Props) {
  const [platform, setPlatform] = useState<Platform>("unknown");

  useEffect(() => {
    setPlatform(detectPlatform());
  }, []);

  const isMobile = platform === "android" || platform === "ios";
  const showApkFirst = isMobile && !!apkUrl;
  const showExeFirst = !isMobile && !!exeUrl;

  // Aucun fichier disponible du tout
  if (!exeUrl && !apkUrl) {
    return (
      <span className="inline-flex items-center gap-2.5 rounded-full border border-current/15 px-6 py-3.5 text-sm font-semibold opacity-50">
        <Download className="h-4 w-4" />
        Téléchargement bientôt disponible
      </span>
    );
  }

  // iOS n'a ni .exe ni .apk utilisable — on oriente vers le site/Play Store si dispo
  if (platform === "ios" && !showApkFirst) {
    return (
      <div className="flex flex-wrap items-center gap-3">
        <span className="inline-flex items-center gap-2.5 rounded-full border border-current/15 px-6 py-3.5 text-sm font-semibold opacity-60">
          <Smartphone className="h-4 w-4" />
          Bientôt disponible sur iOS
        </span>
        {websiteUrl && (
          <Link href={websiteUrl} className="inline-flex items-center gap-1.5 text-sm font-semibold underline underline-offset-4">
            <ExternalLink className="h-3.5 w-3.5" />
            En savoir plus
          </Link>
        )}
      </div>
    );
  }

  const primary = showApkFirst
    ? { href: apkUrl!, label: "Télécharger pour Android", icon: Smartphone, meta: `.apk · v${apkVersion} · ~${apkSizeMb} Mo` }
    : showExeFirst
      ? { href: exeUrl!, label: "Télécharger pour Windows", icon: Monitor, meta: `.exe · v${exeVersion} · ~${exeSizeMb} Mo` }
      : apkUrl
        ? { href: apkUrl, label: "Télécharger pour Android", icon: Smartphone, meta: `.apk · v${apkVersion} · ~${apkSizeMb} Mo` }
        : { href: exeUrl!, label: "Télécharger pour Windows", icon: Monitor, meta: `.exe · v${exeVersion} · ~${exeSizeMb} Mo` };

  const secondary = showApkFirst
    ? (exeUrl ? { href: exeUrl, label: "Version Windows (.exe)", icon: Monitor } : null)
    : (apkUrl ? { href: apkUrl, label: "Version Android (.apk)", icon: Smartphone } : null);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-4">
        <a
          href={primary.href}
          download
          className="btn-gold focus-ring inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-sm font-bold text-lore-ink transition-transform hover:scale-[1.02]"
        >
          <Download className="h-4 w-4" />
          {primary.label}
        </a>

        {secondary && (
          <a
            href={secondary.href}
            download
            className="focus-ring inline-flex items-center gap-2 rounded-full border border-current/15 px-5 py-3 text-xs font-semibold opacity-80 transition-colors hover:opacity-100"
          >
            <secondary.icon className="h-3.5 w-3.5" />
            {secondary.label}
          </a>
        )}

        {playstoreUrl && (
          <Link
            href={playstoreUrl}
            className="focus-ring inline-flex items-center gap-2 text-xs font-semibold opacity-70 underline underline-offset-4 hover:opacity-100"
          >
            Google Play
          </Link>
        )}
      </div>
      <p className="text-xs opacity-50">{primary.meta}</p>
    </div>
  );
}
