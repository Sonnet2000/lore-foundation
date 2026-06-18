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
        "lore-emerald": "#0F98FF",
        "lore-emerald-light": "#5AC8FF",
        "lore-gold": "#D4AF37",
        "lore-gold-light": "#F2D272",
        "lore-gold-dark": "#9C7A1F",
        "lore-cream": "#F5F8FC",
        "lore-ink": "#0B1F33",
        "lore-night": "#0B1B2E",
        "lore-night-surface": "#142C46",
      },
      fontFamily: {
        display: ["var(--font-bricolage)", "sans-serif"],
        body: ["var(--font-jakarta)", "sans-serif"],
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
      },
      backgroundImage: {
        "lore-gradient":
          "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.18), transparent 55%), linear-gradient(135deg, #0A3D62 0%, #0E5C99 50%, #0F98FF 100%)",
        "lore-gradient-dark":
          "radial-gradient(circle at 30% 20%, rgba(212,175,55,0.18), transparent 55%), linear-gradient(135deg, #051a2b 0%, #0a3554 50%, #0c6cc4 100%)",
        "lore-gold-gradient":
          "linear-gradient(135deg, #F2D272 0%, #D4AF37 55%, #B8860B 100%)",
      },
      animation: {
        "spin-slow": "spin 14s linear infinite",
        float: "float 6s ease-in-out infinite",
        "float-delayed": "float 7s ease-in-out 1.5s infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
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
      },
    },
  },
  plugins: [],
};

export default config;
