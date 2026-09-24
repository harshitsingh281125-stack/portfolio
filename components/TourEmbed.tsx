import Link from "next/link";
import type { CSSProperties } from "react";
import type { Tour } from "@/lib/tours";
import { Button } from "@/components/Button";
import { LazyTourFrame } from "@/components/LazyTourFrame";

/**
 * The tour stage (PLAN.md §1.5) — the one orchestrated moment on the site.
 *
 * The tour is a standalone document in an iframe; see lib/tours.ts for why.
 * The height is fixed per tour rather than measured at runtime, because a
 * stage that resized itself as its scenes changed would move the prose
 * underneath it while somebody was reading — motion as a side effect, which
 * §1.5 rules out as firmly as it rules out scroll-triggered fades. Both
 * heights came from stepping through every scene and reading the wrapper's
 * bottom edge, after the first, estimated pair clipped the pause button off.
 *
 * Under prefers-reduced-motion an embedded tour is not shown at all. The
 * reduced-motion layout stacks every scene settled, which runs to three or
 * four thousand pixels, and a fixed frame around that hands the reader a
 * nested scrollbar in the middle of an argument — a worse page for the people
 * who asked for the calmer one. They get a link to the full-bleed route
 * instead, where the document can be its own height. Trying to fit it inline
 * was four more magic numbers that were wrong at every width I had not
 * measured.
 *
 * loading="lazy" matters on the case-study pages: the stage sits well below
 * the fold and the tour carries its own webfont, so an eager iframe would
 * compete with the LCP paragraph the serif already gates.
 */
export function TourEmbed({
  tour,
  full = false,
}: {
  tour: Tour;
  /** The dedicated /tour/[slug] page, where the stage is the whole point. */
  full?: boolean;
}) {
  const heights = {
    "--tour-h": `${tour.height}px`,
    "--tour-mh": `${tour.mobileHeight}px`,
    "--tour-rh": `${tour.reducedHeight}px`,
    "--tour-rmh": `${tour.reducedMobileHeight}px`,
  } as CSSProperties;

  const src = `/tour/${tour.slug}.html`;

  /* On its own route the stage is the page, so it is fetched immediately.
     Embedded in a case study it waits until it is nearly on screen — see
     LazyTourFrame for what that costs when it does not. */
  const frame = full ? (
    <iframe src={src} title={tour.frameTitle} loading="eager" className="h-full w-full border-0" />
  ) : (
    <LazyTourFrame src={src} title={tour.frameTitle} />
  );

  /* On its own page the tour is the content, so it is always rendered — the
     reduced-motion height is generous and any residual scroll is inside a
     page holding nothing else to lose your place in. */
  if (full) {
    return (
      <figure className="mt-8">
        <div
          style={heights}
          className={
            "overflow-hidden rounded-lg border border-edge bg-panel " +
            "h-[var(--tour-mh)] min-[821px]:h-[var(--tour-h)] " +
            "motion-reduce:h-[var(--tour-rmh)] motion-reduce:min-[821px]:h-[var(--tour-rh)]"
          }
        >
          {frame}
        </div>
        <figcaption className="mt-3 max-w-prose text-ui text-content-muted">
          {tour.blurb}
        </figcaption>
      </figure>
    );
  }

  return (
    <figure className="mt-8">
      <div
        style={heights}
        className={
          "overflow-hidden rounded-lg border border-edge bg-panel motion-reduce:hidden " +
          "h-[var(--tour-mh)] min-[821px]:h-[var(--tour-h)]"
        }
      >
        {frame}
      </div>

      {/* Shown only when the tour is not. */}
      <div className="hidden rounded-lg border border-edge bg-panel p-5 motion-reduce:block sm:p-6">
        <p className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          Tour
        </p>
        <p className="prose-serif mt-2 text-content">{tour.title}</p>
        <p className="mt-2 max-w-prose text-ui text-content-muted">
          {tour.blurb} Your system asks for reduced motion, so it is not played
          here &mdash; it opens as {tour.slug.includes("trace") ? "steps" : "scenes"}{" "}
          you scroll at your own pace.
        </p>
        <p className="mt-4">
          <Button href={`/tour/${tour.slug}`}>Open the tour</Button>
        </p>
      </div>

      <figcaption className="mt-3 max-w-prose text-ui text-content-muted motion-reduce:hidden">
        {tour.blurb}{" "}
        <Link
          href={`/tour/${tour.slug}`}
          className="text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content"
        >
          Open it full-bleed
        </Link>
        .
      </figcaption>
    </figure>
  );
}
