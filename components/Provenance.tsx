import type { ReactNode } from "react";

/**
 * A claim on this site cites the file it came from (PLAN.md §0). The citation
 * is the link itself — a mono file path under the number it proves.
 *
 * The VERIFIED / UNVERIFIED chips this component used to print were removed on
 * the owner's call: the amber one read, at a skim, as a warning about his own
 * résumé, and once that one was gone a green chip on everything else was
 * decoration rather than a distinction. What proves a number is the path, and
 * the path is still here. Work that cannot be linked now simply says nothing.
 */

type Status = "verified" | "unverified";

export function ProvenanceBadge({
  href,
  source,
}: {
  status?: Status;
  /** Omitted where there is nothing honest to link to; then nothing renders. */
  href?: string;
  /** e.g. "tests/unit + tests/e2e" */
  source?: string;
  /** Kept for callers that explain an unlinkable claim; unused since the chips went. */
  title?: string;
}) {
  if (!source) return null;

  const text = (
    <span className="font-mono text-meta text-content-faint [overflow-wrap:anywhere]">
      {source}
    </span>
  );

  if (!href) {
    return (
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1">{text}</span>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-meta text-content-faint underline underline-offset-2 decoration-edge-strong hover:decoration-content"
      target="_blank"
      rel="noreferrer"
    >
      {source}
    </a>
  );
}

/** A number in the page that carries its own proof. */
export function Claim({
  value,
  label,
  status,
  href,
  source,
  title,
}: {
  value: string;
  label: string;
  status?: Status;
  href?: string;
  source?: string;
  title?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-ui text-content">
        <span className="font-mono font-semibold">{value}</span>{" "}
        <span className="text-content-muted">{label}</span>
      </p>
      <ProvenanceBadge
        status={status}
        href={href}
        source={source}
        title={title}
      />
    </div>
  );
}

/**
 * The signature element (PLAN.md §1.4). Three mono labels in a fixed column,
 * a serif consequence, a provenance footer. Used 4x on Prep, 3x on DevLinks,
 * and nowhere else — the boldness is spent in one place.
 */
export function Decision({
  id,
  name,
  chose,
  over,
  because,
  rule,
  href,
  source,
  children,
}: {
  /** Anchor target for the decision rail. */
  id?: string;
  /** Short name, for the rail and for screen readers. Never rendered as a
      heading: the visible label is identical on every block by design, and
      four identical headings would be four useless landmarks. */
  name?: string;
  chose: string;
  over: string;
  because: ReactNode;
  /** e.g. "RULE 9" — links back to the repo's own numbered Rules.md */
  rule?: string;
  href?: string;
  source?: string;
  children?: ReactNode;
}) {
  return (
    <aside
      id={id}
      aria-label={name ? `Decision: ${name}` : "The decision worth defending"}
      className="my-8 scroll-mt-8 rounded-lg border border-edge bg-panel p-5 sm:p-6"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge pb-3">
        <p className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          The decision worth defending
        </p>
        {rule ? (
          <span className="font-mono text-meta font-medium text-accent">{rule}</span>
        ) : null}
      </div>

      <dl className="mt-4 grid grid-cols-[4.5rem_1fr] gap-x-4 gap-y-3 sm:grid-cols-[5.5rem_1fr]">
        <dt className="font-mono text-meta uppercase tracking-wide text-content-faint">
          Chose
        </dt>
        <dd className="font-mono text-ui text-content">{chose}</dd>

        <dt className="font-mono text-meta uppercase tracking-wide text-content-faint">
          Over
        </dt>
        <dd className="font-mono text-ui text-content-muted">{over}</dd>

        <dt className="font-mono text-meta uppercase tracking-wide text-content-faint">
          Because
        </dt>
        <dd className="prose-serif text-content">{because}</dd>
      </dl>

      {/* Chose / Over / Because is the decision; this is the argument for it.
          Folded, so a skimmer reads four decisions in the time one used to
          take, and an engineer is one click from all of it. Find-in-page
          still reaches folded text: Chrome opens a <details> on a match. */}
      {children ? (
        <details className="group mt-4">
          <summary className="inline-flex min-h-11 cursor-pointer list-none items-center gap-2 text-ui font-medium text-content sm:min-h-0 [&::-webkit-details-marker]:hidden">
            <span
              aria-hidden="true"
              className="font-mono text-meta text-content-faint transition-transform group-open:rotate-90"
            >
              &rsaquo;
            </span>
            <span className="underline decoration-edge-strong underline-offset-2 hover:decoration-content">
              <span className="group-open:hidden">The full reasoning</span>
              <span className="hidden group-open:inline">Hide the reasoning</span>
            </span>
          </summary>
          <div className="mt-2 prose-serif text-content-muted">{children}</div>
        </details>
      ) : null}

      {href || source ? (
        <div className="mt-5 border-t border-edge pt-3">
          <ProvenanceBadge status="verified" href={href} source={source} />
        </div>
      ) : null}
    </aside>
  );
}
