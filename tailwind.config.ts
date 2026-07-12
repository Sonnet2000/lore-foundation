import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "lore-dark": "#0A3D62",
        "lore-darker": "#052238",
        "lore-deepest": "#030d18",
        "lore-emerald": "#0EA472",
        "lore-emerald-light": "#4ADE94",
        "lore-emerald-dark": "#076B4A",
        "lore-blue": "#0F98FF",
        "lore-blue-light": "#5AC8FF",
        "lore-gold": "#D4AF37",
        "lore-gold-light": "#F2D272",
        "lore-gold-dark": "#9C7A1F",
        "lore-cream": "#f5f7fa",
        "lore-ink": "#0B1F33",
        "lore-night": "#080f1a",
        "lore-night-surface": "#111e30",
        "lore-night-card": "#0e1a2b",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
        serif: ["'Instrument Serif'", "Georgia", "serif"],
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      boxShadow: {
        soft: "0 20px 60px -15px rgba(10, 61, 98, 0.25)",
        card: "0 10px 40px -10px rgba(10, 61, 98, 0.15)",
        gold: "0 12px 32px -8px rgba(212, 175, 55, 0.5)",
        "gold-lg": "0 18px 45px -10px rgba(212, 175, 55, 0.55)",
        "card-dark": "0 10px 40px -10px rgba(0,0,0,0.4)",
        "premium": "0 32px 80px -20px rgba(10, 61, 98, 0.3)",
        "inner-gold": "inset 0 1px 0 rgba(212,175,55,0.25)",
      },
      backgroundImage: {
        "lore-gradient":
          "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.12) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(15,152,255,0.15) 0%, transparent 40%), linear-gradient(135deg, #052238 0%, #0A3D62 45%, #0c5a96 100%)",
        "lore-gradient-dark":
          "radial-gradient(ellipse at 20% 50%, rgba(212,175,55,0.1) 0%, transparent 50%), radial-gradient(ellipse at 80% 20%, rgba(15,152,255,0.12) 0%, transparent 40%), linear-gradient(135deg, #030d18 0%, #06213a 45%, #091e38 100%)",
        "lore-gold-gradient":
          "linear-gradient(135deg, #F2D272 0%, #D4AF37 55%, #B8860B 100%)",
        "lore-gold-gradient-h":
          "linear-gradient(90deg, #F2D272 0%, #D4AF37 50%, #B8860B 100%)",
        "lore-section-light":
          "radial-gradient(ellipse at 50% 0%, rgba(15,152,255,0.06) 0%, transparent 60%)",
      },
      animation: {
        "spin-slow": "spin 14s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 1.5s infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        "fade-up": "fadeUp 0.6s ease-out both",
        "gold-line": "goldLine 1.5s ease-out both",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3", transform: "scale(0.85) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.1) rotate(20deg)" },
        },
        fadeUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        goldLine: {
          from: { transform: "scaleX(0)", opacity: "0" },
          to: { transform: "scaleX(1)", opacity: "1" },
        },
      },
      letterSpacing: {
        tightest: "-0.04em",
        tighter: "-0.02em",
      },
    },
  },
  plugins: [],
};

export default config;
