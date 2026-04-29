import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-dark": "#0A1628",
        "bg-card-dark": "#13233B",
        "bg-light": "#F8FAFC",
        "bg-card-light": "#FFFFFF",
        "accent-gold": "#D4A545",
        "accent-navy": "#1E3A5F",
        success: "#10B981",
        danger: "#DC2626",
        warning: "#F59E0B",
        "text-primary-dark": "#F1F5F9",
        "text-secondary-dark": "#94A3B8",
        "text-primary-light": "#0F172A",
        "text-secondary-light": "#475569",
        "border-dark": "#1E2A3F",
        "border-light": "#E2E8F0",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
