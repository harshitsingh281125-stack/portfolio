import type { Metadata } from "next";
import { IBM_Plex_Sans, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
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
 * The variable cut, not two static weights: one file covers 400 and 600, so the
 * face that sets the LCP paragraph arrives in a single request.
 */
const serif = Source_Serif_4({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
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
