import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/Button";
import { caseStudy, routes } from "@/lib/site";

export const metadata: Metadata = {
  title: "Not found",
  robots: { index: false },
};

/**
 * The site's rule is that it never hands anyone a dead link. This page is for
 * links it did not hand out: a mistyped URL, or an old one. It says what
 * happened in one sentence and offers the pages that exist, drawn from the
 * same flags as the nav.
 */
export default function NotFound() {
  return (
    <div className="page-width py-20 sm:py-32">
      <p className="font-mono text-meta text-content-faint">404</p>
      <h1 className="mt-4 max-w-[16em] text-display-sm font-semibold text-content sm:text-display">
        There is nothing at this address.
      </h1>
      <p className="mt-6 max-w-prose text-[1.0625rem] leading-[1.6] text-content-muted">
        Nothing on this site links here, so the address was probably mistyped or
        is out of date. These pages do exist:
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button href="/" variant="primary">
          Home <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
        {caseStudy.prep ? <Button href="/work/prep">Prep case study</Button> : null}
        {caseStudy.devlinks ? <Button href="/work/devlinks">DevLinks case study</Button> : null}
        {routes.notes ? <Button href="/notes">Notes</Button> : null}
      </div>
    </div>
  );
}
