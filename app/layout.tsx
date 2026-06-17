import type { Metadata } from "next";
import { Bricolage_Grotesque, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";

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
  metadataBase: new URL("https://lorefoundation.com"),
  title: {
    default: "Loré Foundation — L'excellence au cœur de l'impact",
    template: "%s | Loré Foundation",
  },
  description:
    "Loré Foundation accompagne les entreprises et créateurs en Haïti avec des solutions numériques sur mesure : développement web, applications mobiles, design graphique, intelligence artificielle et bien plus. Basée à Cap-Haïtien.",
  keywords: [
    "Loré Foundation",
    "développement web Haïti",
    "applications mobiles",
    "design graphique",
    "intelligence artificielle",
    "agence digitale Cap-Haïtien",
    "sérigraphie",
    "salon de beauté",
  ],
  authors: [{ name: "Loré Foundation" }],
  icons: {
    icon: "/logo.png",
  },
  openGraph: {
    title: "Loré Foundation — L'excellence au cœur de l'impact",
    description:
      "Des solutions numériques modernes et sur mesure : web, mobile, design, IA et accompagnement digital complet.",
    url: "https://lorefoundation.com",
    siteName: "Loré Foundation",
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Loré Foundation — L'excellence au cœur de l'impact",
    description:
      "Transformez vos idées en solutions numériques avec Loré Foundation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${jakarta.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-lore-cream font-body text-lore-ink antialiased transition-colors duration-300 dark:bg-lore-night dark:text-white">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
