import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google";
import localFont from "next/font/local";
import { site, siteUrl } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

/**
 * Only the serif is preloaded. It sets the body prose, which is the LCP element
 * on every case study, and five preloaded font files were arriving as one
 * bandwidth-bound clump: the serif landed late and took LCP with it (83% render
 * delay, measured). The interface and evidence faces load a beat later, which
 * costs a brief fallback on nav and labels and buys the prose its paint.
 */
const sans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

/**
 * Self-hosted, and cut down to exactly what the site sets: Source Serif 4's
 * opsz build instanced at opsz 20 (the font's own default) with weight kept
 * variable over 400-600. 32KB, against 51KB for the file next/font/google
 * served. This face gates LCP on every page, so the bytes are the point: with
 * it, /work/prep measured 98-99 where the same-day baseline was 88-91.
 *
 *   fonttools varLib.instancer <opsz-latin>.woff2 opsz=20 wght=400:600
 *
 * Not a rendering fix. Screenshots once showed loose spacing ("A PI", "r ead")
 * that looked like a font fault; it was headless Chromium's default full
 * hinting, which snaps advances to whole pixels (r drawn 9px against a true
 * 7.19px). With --font-render-hinting=none every cut renders tight. Screenshot
 * QA should pass that flag.
 *
 * OFL 1.1, no Reserved Font Name; the licence ships beside it (app/fonts/OFL.txt).
 */
const serif = localFont({
  src: "./fonts/SourceSerif4-opsz20.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-serif",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

export const metadata: Metadata = {
  ...pageMeta({
    description:
      "I build the unglamorous parts of AI products: the gateway, the cap, the fallback, and the citation that can't be faked.",
    path: "/",
  }),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  metadataBase: siteUrl,
  authors: [{ name: site.name, url: site.github }],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${serif.variable}`}>
      <body className="min-h-screen bg-surface text-content antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
