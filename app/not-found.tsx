import type { Metadata } from "next";
import Link from "next/link";
import { caseStudy, routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

const LINK =
  "text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content";

/**
 * The site's rule is that it never hands anyone a dead link. This page is for
 * links it did not hand out: a mistyped URL, or an old one. It says what
 * happened in one sentence and offers the pages that exist, drawn from the
 * same flags as the nav.
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <p className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
        404
      </p>
      <h1 className="mt-3 max-w-prose font-serif text-display font-semibold text-content">
        There is nothing at this address.
      </h1>
      <p className="mt-5 max-w-prose prose-serif text-content-muted">
        Nothing on this site links here, so the address was probably mistyped or
        is out of date. These pages do exist:
      </p>
      <ul className="mt-8 flex flex-col gap-3 text-ui">
        <li>
          <Link href="/" className={LINK}>
            Home
          </Link>
        </li>
        {caseStudy.prep ? (
          <li>
            <Link href="/work/prep" className={LINK}>
              Prep, the case study
            </Link>
          </li>
        ) : null}
        {caseStudy.devlinks ? (
          <li>
            <Link href="/work/devlinks" className={LINK}>
              DevLinks, the case study
            </Link>
          </li>
        ) : null}
        {routes.notes ? (
          <li>
            <Link href="/notes" className={LINK}>
              Notes
            </Link>
          </li>
        ) : null}
      </ul>
    </div>
  );
}
