import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { site } from "@/lib/site";

/**
 * One renderer for every route's Open Graph image (PLAN.md §4, Phase 6).
 *
 * The card is the site in miniature: a mono kicker, the serif title, the
 * sans description, and — only where the page itself backs one — a claim with
 * the file path that proves it. A card never states a number the page
 * it links to does not prove; pages with no headline number get none.
 *
 * Light theme only. An OG image is shown by someone else's app on someone
 * else's background, so there is no prefers-color-scheme to follow; the light
 * tokens are the ones with contrast ratios recorded in globals.css.
 *
 * Fonts are vendored as woff under assets/og/ (fontsource, OFL). Satori reads
 * ttf/otf/woff but not the woff2 that next/font downloads, and fetching fonts
 * over the network at build time would make the build depend on a CDN.
 */

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const C = {
  surface: "#F3EFE6",
  border: "#DDD6C6",
  content: "#17150F",
  muted: "#3D392F",
  faint: "#5B5648",
};

async function font(file: string) {
  return readFile(join(process.cwd(), "assets/og", file));
}

export type OgCard = {
  kicker: string;
  title: string;
  description: string;
  /** A number the linked page proves, with the file it comes from. */
  claim?: { value: string; label: string; source: string };
};

export async function ogImage({ kicker, title, description, claim }: OgCard) {
  const [serif, mono, sans] = await Promise.all([
    font("source-serif-4-latin-600-normal.woff"),
    font("ibm-plex-mono-latin-500-normal.woff"),
    font("ibm-plex-sans-latin-400-normal.woff"),
  ]);

  // Step the title down as it lengthens so long note titles stay at two lines.
  const titleSize = title.length > 60 ? 52 : title.length > 36 ? 60 : 72;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: C.surface,
          padding: "64px 72px",
          fontFamily: "Plex Sans",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Plex Mono",
            fontSize: 22,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: C.faint,
          }}
        >
          {`${site.name} · ${kicker}`}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontFamily: "Source Serif",
            fontSize: titleSize,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            color: C.content,
          }}
        >
          {title}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 28,
            fontSize: 28,
            lineHeight: 1.45,
            color: C.muted,
          }}
        >
          {description}
        </div>

        <div style={{ display: "flex", flexGrow: 1 }} />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            borderTop: `1px solid ${C.border}`,
            paddingTop: 28,
            fontFamily: "Plex Mono",
            fontSize: 22,
          }}
        >
          {claim ? (
            <>
              {/* Margins, not gap: Satori does not apply gap across a fragment. */}
              <div style={{ display: "flex", color: C.content }}>
                {`${claim.value} ${claim.label}`}
              </div>
              <div style={{ display: "flex", marginLeft: 16, color: C.faint }}>
                {claim.source}
              </div>
            </>
          ) : (
            <div style={{ display: "flex", color: C.faint }}>
              {site.location} · React · React Native
            </div>
          )}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Source Serif", data: serif, weight: 600, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 500, style: "normal" },
        { name: "Plex Sans", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
