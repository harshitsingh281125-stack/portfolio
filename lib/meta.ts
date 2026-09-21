import type { Metadata } from "next";
import { site } from "@/lib/site";

/**
 * Per-page metadata in one shape. Next merges metadata shallowly, so a page
 * that sets `openGraph` at all replaces the layout's whole object. Every page
 * therefore builds its own through here, rather than half the pages
 * inheriting a site-wide og:title that names the wrong page.
 *
 * The og:image is not set here: each route has an opengraph-image.tsx beside
 * it, and Next adds the image tags from that file.
 */
export function pageMeta({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: {
  /** Page title without the site suffix. Omit for the home page. */
  title?: string;
  description: string;
  /** Absolute path, e.g. "/work/prep". Resolved against metadataBase. */
  path: string;
  type?: "website" | "article";
  /** ISO date, for articles. */
  publishedTime?: string;
}): Metadata {
  const full = title ? `${title} — ${site.name}` : `${site.name} — ${site.role}`;
  return {
    ...(title ? { title } : {}),
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      siteName: site.name,
      locale: "en_GB",
      title: full,
      description,
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title: full, description },
  };
}
