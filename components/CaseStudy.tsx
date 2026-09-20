import type { ReactNode } from "react";

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

export function CaseStudy({
  title,
  standfirst,
  rail,
  children,
}: {
  title: string;
  /** The one sentence that says why this page is worth reading. */
  standfirst: string;
  rail: RailItem[];
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <div className="grid gap-10 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-14">
        <DecisionRail items={rail} />

        <article className="min-w-0">
          <h1 className="max-w-prose font-serif text-display font-semibold text-content">
            {title}
          </h1>
          <p className="mt-5 max-w-prose prose-serif text-content-muted">{standfirst}</p>
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
