import type { Config } from "tailwindcss";

/**
 * Colours are declared once in app/globals.css and consumed here by name.
 * Nothing in a component should ever hard-code a hex value — that is what
 * makes light/dark a single source of truth rather than two.
 */
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        surface: "var(--surface)",
        panel: "var(--panel)",
        edge: "var(--border)",
        "edge-strong": "var(--border-strong)",
        content: "var(--content)",
        "content-muted": "var(--content-muted)",
        "content-faint": "var(--content-faint)",
        verified: "var(--verified)",
        "verified-soft": "var(--verified-soft)",
        unverified: "var(--unverified)",
        "unverified-soft": "var(--unverified-soft)",
        behind: "var(--behind)",
        "behind-soft": "var(--behind-soft)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // PLAN.md §1.2. rem throughout so the browser's font-size setting works.
        meta: ["0.8125rem", { lineHeight: "1.45", letterSpacing: "0.02em" }],
        ui: ["0.9375rem", { lineHeight: "1.5" }],
        prose: ["1.0625rem", { lineHeight: "1.65" }],
        h3: ["1.25rem", { lineHeight: "1.35" }],
        h2: ["1.6875rem", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        display: ["2.5rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        // Below 640px. At 2.5rem the home headline ran eight lines and filled a
        // 390px phone's whole first screen before a single project appeared.
        "display-sm": ["1.875rem", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
      },
      maxWidth: {
        prose: "68ch",
      },
    },
  },
  plugins: [],
};

export default config;
