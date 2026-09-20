import type { ReactNode } from "react";

/**
 * The site's central idea, as a component (PLAN.md §0).
 *
 * Prep refuses to let a model invent a URL: it cites a document by index and
 * the server resolves that index to a real row. This site applies the same
 * rule to its own claims. A claim is either linked to the file that proves it,
 * or it is explicitly marked as not publicly checkable.
 *
 * Colour is never the only carrier: each badge has a filled dot AND the word.
 * (color.md > Best practices: "Avoid relying solely on color to differentiate
 * between objects, indicate interactivity, or communicate essential
 * information.")
 */

type Status = "verified" | "unverified";

const STYLES: Record<Status, { label: string; className: string }> = {
  verified: {
    label: "VERIFIED",
    className: "text-verified bg-verified-soft",
  },
  unverified: {
    label: "UNVERIFIED",
    className: "text-unverified bg-unverified-soft",
  },
};

export function ProvenanceBadge({
  status,
  href,
  source,
  title,
}: {
  status: Status;
  /** Omitted for unverified claims — there is nothing honest to link to. */
  href?: string;
  /** e.g. "tests/unit + tests/e2e" */
  source?: string;
  /** Why an unverified claim cannot be checked. */
  title?: string;
}) {
  const s = STYLES[status];

  const badge = (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded px-1.5 py-0.5 font-mono text-meta font-medium ${s.className}`}
    >
      <span aria-hidden="true" className="text-[0.6em] leading-none">
        ●
      </span>
      {s.label}
    </span>
  );

  if (status === "unverified" || !href) {
    return (
      <span className="inline-flex flex-wrap items-center gap-x-2 gap-y-1" title={title}>
        {badge}
        {source ? (
          <span className="font-mono text-meta text-content-faint [overflow-wrap:anywhere]">{source}</span>
        ) : null}
      </span>
    );
  }

  return (
    <a
      href={href}
      className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 no-underline"
      target="_blank"
      rel="noreferrer"
    >
      {badge}
      {source ? (
        <span className="font-mono text-meta text-content-faint underline underline-offset-2 decoration-edge-strong [overflow-wrap:anywhere]">
          {source}
        </span>
      ) : null}
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
  status: Status;
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
  chose,
  over,
  because,
  rule,
  href,
  source,
  children,
}: {
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
    <aside className="my-8 rounded-lg border border-edge bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-edge pb-3">
        <h3 className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          The decision worth defending
        </h3>
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

      {children ? <div className="mt-4 prose-serif text-content-muted">{children}</div> : null}

      {href || source ? (
        <div className="mt-5 border-t border-edge pt-3">
          <ProvenanceBadge status="verified" href={href} source={source} />
        </div>
      ) : null}
    </aside>
  );
}
