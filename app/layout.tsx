import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import VisitorTracker from "@/components/VisitorTracker";

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

const GA_ID = "G-7DDF3Q1R44";

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
      </head>
      <body className="bg-lore-cream font-body text-lore-ink antialiased transition-colors duration-300 dark:bg-lore-night dark:text-white">
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}', {
              page_path: window.location.pathname,
              anonymize_ip: true,
            });
          `}
        </Script>

        <ThemeProvider>
          <VisitorTracker />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
