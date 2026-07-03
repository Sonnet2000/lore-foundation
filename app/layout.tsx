import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const ADS_CLIENT = "ca-pub-7566847755875100";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://lore-foundation.vercel.app"),
  title: {
    default: "Loré Foundation — L'excellence au cœur de l'impact",
    template: "%s | Loré Foundation",
  },
  description:
    "Loré Foundation accompagne les jeunes et les communautés en Haïti à travers l'éducation, la formation numérique, le leadership et l'engagement communautaire. Basée à Cap-Haïtien.",
  keywords: [
    "Loré Foundation",
    "éducation Haïti",
    "formation numérique Haïti",
    "leadership jeunesse",
    "développement communautaire",
    "Cap-Haïtien",
    "fondation Haïti",
    "ONG Haïti",
    "jeunesse haïtienne",
    "formation informatique",
  ],
  authors: [{ name: "Loré Foundation" }],
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Loré Foundation — Former. Inspirer. Transformer.",
    description:
      "Une organisation engagée dans le développement de l'éducation, la technologie et le leadership pour construire un avenir meilleur pour Haïti.",
    url: "https://lore-foundation.vercel.app",
    siteName: "Loré Foundation",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loré Foundation — Former. Inspirer. Transformer.",
    description: "Éducation, formation numérique et leadership pour la jeunesse haïtienne.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "G-7DDF3Q1R44",
  },
  other: {
    // AdSense verification — visible dans le HTML statique pour le robot Google
    "google-adsense-account": `${ADS_CLIENT}`,
  },
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/*
          AdSense — strategy="beforeInteractive" force Next.js a injecte
          le script directement dans le HTML rendu côté serveur,
          ce qui le rend visible pour le robot Google AdSense.
        */}
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
        {/*
          Auto ads — san sa a, Google chaje script la (sa fè kont lan "aktive")
          men li pa janm mande pou l mete okenn anons sou paj yo. "push" la
          antre nan yon file dat li trete kèlkeswa lè script anwo a fini chaje.
        */}
        <Script id="adsense-auto-ads" strategy="beforeInteractive">
          {`
            (window.adsbygoogle = window.adsbygoogle || []).push({
              google_ad_client: "${ADS_CLIENT}",
              enable_page_level_ads: true
            });
          `}
        </Script>
      </head>
      <body className="bg-lore-cream font-body text-lore-ink antialiased transition-colors duration-300 dark:bg-lore-night dark:text-white">
        {/* Google Analytics — chaje sèlman apre moun aksepte cookies yo */}
        <GoogleAnalytics />

        <ThemeProvider>
          <VisitorTracker />
          {children}
          <CookieConsent />
        </ThemeProvider>
      </body>
    </html>
  );
}
