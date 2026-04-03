/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,jsx,ts,tsx}",
    "./src/components/**/*.{js,jsx,ts,tsx}",
    "./src/app/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "2rem", screens: { "2xl": "1400px" } },
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        sans: ["'DM Sans'", "sans-serif"],
        mono: ["'DM Mono'", "monospace"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: { DEFAULT: "hsl(var(--primary))", foreground: "hsl(var(--primary-foreground))" },
        secondary: { DEFAULT: "hsl(var(--secondary))", foreground: "hsl(var(--secondary-foreground))" },
        destructive: { DEFAULT: "hsl(var(--destructive))", foreground: "hsl(var(--destructive-foreground))" },
        muted: { DEFAULT: "hsl(var(--muted))", foreground: "hsl(var(--muted-foreground))" },
        accent: { DEFAULT: "hsl(var(--accent))", foreground: "hsl(var(--accent-foreground))" },
        card: { DEFAULT: "hsl(var(--card))", foreground: "hsl(var(--card-foreground))" },
        popover: { DEFAULT: "hsl(var(--popover))", foreground: "hsl(var(--popover-foreground))" },
        // Finance semantic
        income:  { DEFAULT: "#059669", light: "#d1fae5", dark: "#047857" },
        expense: { DEFAULT: "#dc2626", light: "#fee2e2", dark: "#b91c1c" },
        savings: { DEFAULT: "#2563eb", light: "#dbeafe", dark: "#1d4ed8" },
        surface: { 0: "#ffffff", 50: "#f8fafc", 100: "#f1f5f9", 200: "#e2e8f0", 900: "#0f172a" },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        "card-hover": "0 4px 12px 0 rgb(0 0 0 / 0.08)",
        modal: "0 20px 60px -10px rgb(0 0 0 / 0.2)",
      },
      keyframes: {
        "fade-up":   { from: { opacity: "0", transform: "translateY(12px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "fade-in":   { from: { opacity: "0" }, to: { opacity: "1" } },
        "scale-in":  { from: { opacity: "0", transform: "scale(0.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        "slide-right": { from: { transform: "translateX(-100%)" }, to: { transform: "translateX(0)" } },
        shimmer:     { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },
      animation: {
        "fade-up":     "fade-up 0.4s ease both",
        "fade-in":     "fade-in 0.3s ease both",
        "scale-in":    "scale-in 0.2s ease both",
        "slide-right": "slide-right 0.35s ease both",
        shimmer:       "shimmer 1.5s linear infinite",
        "fade-up-1": "fade-up 0.4s ease 0.05s both",
        "fade-up-2": "fade-up 0.4s ease 0.10s both",
        "fade-up-3": "fade-up 0.4s ease 0.15s both",
        "fade-up-4": "fade-up 0.4s ease 0.20s both",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
