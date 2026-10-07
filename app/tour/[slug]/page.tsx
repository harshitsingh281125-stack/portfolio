import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Play } from "lucide-react";
import { Button } from "@/components/Button";
import { TourEmbed } from "@/components/TourEmbed";
import { tourBySlug, tours } from "@/lib/tours";
import { caseStudy } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

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
  return pageMeta({ title: tour.title, description: tour.blurb, path: `/tour/${tour.slug}` });
}


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
    <div className="page-width py-12 sm:py-20">
      {caseStudy[tour.project] ? (
        <Link
          href={`/work/${tour.project}`}
          className="inline-flex min-h-11 items-center gap-1.5 text-[14px] text-content-muted transition-colors hover:text-content sm:min-h-0"
        >
          <ArrowLeft size={15} aria-hidden="true" /> {project}
        </Link>
      ) : null}
      <h1 className="mt-4 max-w-[20em] text-display-sm font-semibold text-content sm:text-display">
        {tour.title}
      </h1>
      <p className="mt-5 max-w-prose text-[1.0625rem] leading-[1.6] text-content-muted">
        An illustrated walkthrough with sample data. These scenes explain the
        product flow; they are not a recording of a live session.
      </p>

      <TourEmbed tour={tour} full />

      <nav
        aria-label="Related"
        className="mt-12 flex flex-wrap gap-3"
      >
        {caseStudy[tour.project] ? (
          <Button href={`/work/${tour.project}`}>The {project} case study</Button>
        ) : null}
        {sibling ? (
          <Button href={`/tour/${sibling.slug}`}>
            <Play size={14} strokeWidth={2} aria-hidden="true" /> {sibling.title}
          </Button>
        ) : null}
        <Button href="/">Everything else</Button>
      </nav>
    </div>
  );
}
