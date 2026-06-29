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
        base: "#09090B",
        surface: "#18181B",
        border: "#27272A",
        muted: "#71717A",
        body: "#D4D4D8",
        heading: "#FAFAFA",
        accent: {
          green: "#22C55E",
          blue: "#3B82F6",
        },
        danger: "#EF4444",
        warning: "#EAB308",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "JetBrains Mono", "monospace"],
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "pop": {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
          "100%": { transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        pop: "pop 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
