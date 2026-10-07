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
        sunken: "var(--sunken)",
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
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        // PLAN.md §1.2. rem throughout so the browser's font-size setting works.
        meta: ["0.8125rem", { lineHeight: "1.45" }],
        ui: ["0.9375rem", { lineHeight: "1.5" }],
        prose: ["1.0625rem", { lineHeight: "1.7" }],
        h3: ["1.125rem", { lineHeight: "1.4", letterSpacing: "-0.01em" }],
        h2: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.025em" }],
        display: ["3rem", { lineHeight: "1.05", letterSpacing: "-0.045em" }],
        // Below 640px, so a long note title does not fill a phone's first screen.
        "display-sm": ["2.125rem", { lineHeight: "1.1", letterSpacing: "-0.04em" }],
      },
      maxWidth: {
        prose: "66ch",
      },
      borderRadius: {
        // The one shape rule (PLAN.md §1.3): controls are pills, containers
        // are 12px, and an image inside a container is 8px.
        card: "12px",
        image: "8px",
      },
      boxShadow: {
        // Stacked small offsets plus a hairline ring, never one heavy drop.
        card: "0 0 0 1px var(--border), 0 1px 2px var(--shadow), 0 4px 12px -4px var(--shadow)",
        lift: "0 0 0 1px var(--border), 0 2px 4px var(--shadow), 0 12px 24px -8px var(--shadow)",
      },
    },
  },
  plugins: [],
};

export default config;
