import type { ReactNode } from "react";
import { Button } from "@/components/Button";

/**
 * The case-study template (PLAN.md §1.3).
 *
 * One column of 68ch prose. Above 1024px it gains a decision rail on the left
 * that sticks while the argument scrolls past it — the rail exists because the
 * four Decision blocks ARE the case study, and a reader who lands halfway down
 * should be able to see what else is being argued without scrolling to find out.
 *
 * Below 1024px the rail is gone rather than collapsed into an accordion: on a
 * phone the page is short enough to scroll, and an accordion would be a control
 * that exists to have a control.
 */

export type RailItem = { id: string; name: string };

export function DecisionRail({ items }: { items: RailItem[] }) {
  return (
    <nav aria-label="Decisions" className="hidden lg:block">
      <div className="sticky top-10">
        <p className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          Decisions
        </p>
        <ul className="mt-4 flex flex-col gap-3 border-l border-edge">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className="-ml-px block border-l border-transparent pl-3 text-ui text-content-muted no-underline hover:border-content-faint hover:text-content"
              >
                {i.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/**
 * The top of a case study, for the reader who will not scroll: how to try it,
 * and three rows that are the whole page in miniature. PLAN.md §7 promised
 * "a scannable summary up top" for recruiters who skim; the first build shipped
 * 1,200 words with the demo link in a Links section at the very bottom.
 */
export type Glance = {
  built: ReactNode;
  hardest: ReactNode;
  stack: string[];
  links: { demo?: string; repo: string; tour?: string };
  /** How to get past the front door: a demo login, or a public path. */
  access?: ReactNode;
};

function AtAGlance({ glance }: { glance: Glance }) {
  const { built, hardest, stack, links, access } = glance;
  return (
    <>
      <div className="mt-7 flex flex-wrap gap-2">
        {links.demo ? (
          <Button href={links.demo} external variant="primary">
            Live demo
          </Button>
        ) : null}
        <Button href={links.repo} external>
          Code
        </Button>
        {links.tour ? (
          <Button href={links.tour}>
            <span aria-hidden="true">&#9654;</span> Tour
          </Button>
        ) : null}
      </div>
      {access ? <p className="mt-3 font-mono text-meta text-content-faint">{access}</p> : null}

      <section
        aria-label="At a glance"
        className="mt-8 max-w-prose rounded-lg border border-edge bg-panel p-5 sm:p-6"
      >
        <p className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          At a glance
        </p>
        <dl className="mt-4 grid gap-x-4 gap-y-3 sm:grid-cols-[7rem_1fr]">
          <dt className="font-mono text-meta uppercase tracking-wide text-content-faint sm:pt-0.5">
            Built
          </dt>
          <dd className="text-ui text-content">{built}</dd>
          <dt className="mt-2 font-mono text-meta uppercase tracking-wide text-content-faint sm:mt-0 sm:pt-0.5">
            Hardest part
          </dt>
          <dd className="text-ui text-content">{hardest}</dd>
          <dt className="mt-2 font-mono text-meta uppercase tracking-wide text-content-faint sm:mt-0 sm:pt-0.5">
            Stack
          </dt>
          <dd className="font-mono text-meta text-content-muted sm:pt-0.5">{stack.join(" · ")}</dd>
        </dl>
      </section>
    </>
  );
}

export function CaseStudy({
  title,
  standfirst,
  glance,
  rail,
  children,
}: {
  title: string;
  /** The one sentence that says why this page is worth reading. */
  standfirst: string;
  glance: Glance;
  rail: RailItem[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <DecisionRail items={rail} />

        <article className="min-w-0">
          <h1 className="max-w-prose font-serif text-display-sm sm:text-display font-semibold text-content">
            {title}
          </h1>
          <p className="mt-5 max-w-prose prose-serif text-content-muted">{standfirst}</p>
          <AtAGlance glance={glance} />
          {children}
        </article>
      </div>
    </div>
  );
}

/** A section of the argument. Serif prose, 68ch, nothing animated. */
export function Section({
  id,
  heading,
  children,
}: {
  id: string;
  heading: string;
  children: ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="mt-14 scroll-mt-8">
      <h2 id={id} className="font-serif text-h2 font-semibold text-content">
        {heading}
      </h2>
      <div className="mt-4 max-w-prose">{children}</div>
    </section>
  );
}

/** Body paragraph. The only prose style on the site. */
export function P({ children }: { children: ReactNode }) {
  return <p className="prose-serif mt-4 text-content first:mt-0">{children}</p>;
}

/** Inline evidence: a path, a constant, a number that came from a file. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="font-mono text-[0.9em] text-content [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}
