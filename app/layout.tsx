import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import VisitorTracker from "@/components/VisitorTracker";
import CookieConsent from "@/components/CookieConsent";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const ADS_CLIENT = "ca-pub-7566847755875100";
const GTM_ID = "GTM-KP8K4NL5";

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
  metadataBase: new URL("https://www.lorefondation.com"),
  title: {
    default: "Loré Foundation — Formation professionnelle & services numériques",
    template: "%s | Loré Foundation",
  },
  description:
    "Loré Foundation propose des formations professionnelles (développement web, design graphique) et des services numériques pour entreprises à Cap-Haïtien : développement de sites web, logiciels de gestion, design et support technique.",
  keywords: [
    "Loré Foundation",
    "formation développement web Haïti",
    "école informatique Cap-Haïtien",
    "développement web Haïti",
    "design graphique Haïti",
    "services numériques Haïti",
    "logiciel de gestion Haïti",
    "Cap-Haïtien",
    "formation professionnelle Haïti",
    "dépannage informatique Cap-Haïtien",
  ],
  authors: [{ name: "Loré Foundation" }],
  icons: { icon: "/logo.png" },
  openGraph: {
    title: "Loré Foundation — Former. Créer. Réussir.",
    description:
      "Formations professionnelles et services numériques (développement web, design graphique, support technique) pour particuliers et entreprises à Cap-Haïtien.",
    url: "https://www.lorefondation.com",
    siteName: "Loré Foundation",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loré Foundation — Former. Créer. Réussir.",
    description: "Formation professionnelle et services numériques à Cap-Haïtien.",
  },
  robots: { index: true, follow: true },
  verification: {
    google: "LjdaACLQJzEUYSODPbR_Hx7OhGEWw7sC7RuzypyVYbk",
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
          Google Tag Manager — chaje osi rapid ke posib nan <head>.
          strategy="afterInteractive" pèmèt Next.js jere l apre hydration,
          san l pa bloke premye rendering paj la.
        */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
            (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
            new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');
          `}
        </Script>
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
        {/* Google Tag Manager (noscript) — fallback pou navigatè san JS */}
        <noscript>
          <iframe
            src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

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
