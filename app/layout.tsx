import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { site, siteUrl } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { RevealObserver } from "@/components/Reveal";
import "./globals.css";

/**
 * Two faces, one job each (PLAN.md §1.2): Geist for everything a person reads,
 * Geist Mono for what came out of a file. Geist is variable, so one preloaded
 * file covers every weight the site sets and it alone gates LCP; the mono face
 * only sets paths and tags and can arrive after it.
 *
 * Screenshot QA on this machine should pass --font-render-hinting=none:
 * headless Chromium's default full hinting snaps glyph advances to whole
 * pixels and makes any face look loosely spaced.
 */
const sans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  ...pageMeta({
    description:
      "Software engineer with 3+ years building web and mobile products, frontend first, with backend and AWS work across healthcare and marketplace apps. Work, independent projects, and engineering notes by Harshit Singh.",
    path: "/",
  }),
  title: {
    default: `${site.name}, ${site.title}`,
    template: `%s | ${site.name}`,
  },
  metadataBase: siteUrl,
  authors: [{ name: site.name, url: site.github }],
};

export const viewport: Viewport = {
  themeColor: "#F5F1EC",
  colorScheme: "light",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: the script below adds data-motion to <html>
    // before React hydrates, deliberately.
    <html lang="en" className={`${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Opt in to reveal animations before first paint, and only where they
            can finish: see components/Reveal.tsx. */}
        <script
          dangerouslySetInnerHTML={{
            __html: "if('IntersectionObserver' in window)document.documentElement.dataset.motion='on'",
          }}
        />
      </head>
      <body className="min-h-[100dvh] bg-surface text-content antialiased">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <RevealObserver />
      </body>
    </html>
  );
}
