import type { MetadataRoute } from "next";
import { notes } from "@/lib/notes";
import { caseStudy, routes, siteUrl } from "@/lib/site";
import { tours } from "@/lib/tours";

/**
 * Built from the same flags the nav reads, so the sitemap cannot list a route
 * the header would refuse to link to. lastModified is set only where a real
 * date exists (the notes); for the rest it is left out rather than stamped with
 * the build time, which would claim every page changed on every deploy.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => new URL(path, siteUrl).toString();

  return [
    { url: url("/") },
    ...Object.entries(caseStudy)
      .filter(([, on]) => on)
      .map(([slug]) => ({ url: url(`/work/${slug}`) })),
    ...(routes.notes
      ? [
          { url: url("/notes") },
          ...notes.map((n) => ({ url: url(`/notes/${n.slug}`), lastModified: n.date })),
        ]
      : []),
    ...tours.map((t) => ({ url: url(`/tour/${t.slug}`) })),
  ];
}
