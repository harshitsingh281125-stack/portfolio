import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TourEmbed } from "@/components/TourEmbed";
import { tourBySlug, tours } from "@/lib/tours";
import { caseStudy } from "@/lib/site";

/** Four routes, known at build time, so they prerender like everything else. */
export function generateStaticParams() {
  return tours.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tour = tourBySlug(slug);
  if (!tour) return {};
  return { title: tour.title, description: tour.blurb };
}

const LINK =
  "text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content";

export default async function TourPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tour = tourBySlug(slug);
  if (!tour) notFound();

  const sibling = tours.find(
    (t) => t.project === tour.project && t.slug !== tour.slug,
  );
  const project = tour.project === "prep" ? "Prep" : "DevLinks";

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h1 className="max-w-prose font-serif text-display font-semibold text-content">
        {tour.title}
      </h1>

      <TourEmbed tour={tour} full />

      <nav
        aria-label="Related"
        className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-edge pt-6 text-ui"
      >
        {caseStudy[tour.project] ? (
          <Link href={`/work/${tour.project}`} className={LINK}>
            The {project} case study
          </Link>
        ) : null}
        {sibling ? (
          <Link href={`/tour/${sibling.slug}`} className={LINK}>
            {sibling.title}
          </Link>
        ) : null}
        <Link href="/" className={LINK}>
          Everything else
        </Link>
      </nav>
    </div>
  );
}
