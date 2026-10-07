import type { ReactNode } from "react";
import { ArrowUpRight, Check, FileCode2, Plus, X } from "lucide-react";

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

  if (!href) {
    return (
      <span className="inline-flex items-center gap-1.5 font-mono text-[12.5px] text-content-faint [overflow-wrap:anywhere]">
        <FileCode2 size={14} aria-hidden="true" className="shrink-0" />
        {source}
      </span>
    );
  }

  // The accent is spent here and almost nowhere else (§1.1): it marks the
  // one kind of link that proves something.
  return (
    <a
      href={href}
      className="group inline-flex items-center gap-1.5 font-mono text-[12.5px] text-accent [overflow-wrap:anywhere]"
      target="_blank"
      rel="noreferrer"
    >
      <FileCode2 size={14} aria-hidden="true" className="shrink-0" />
      <span className="underline decoration-transparent underline-offset-[3px] transition-[text-decoration-color] group-hover:decoration-current">
        {source}
      </span>
      <ArrowUpRight size={13} aria-hidden="true" className="shrink-0" />
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
 * The signature element (PLAN.md §1.4). What was chosen beside what it beat,
 * the consequence under them, a provenance footer. Used 4x on Prep, 5x on DevLinks,
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
      aria-label={name ? `Decision: ${name}` : "Engineering decision"}
      data-reveal
      className="my-10 overflow-hidden rounded-card bg-panel shadow-card"
    >
      <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-5 sm:px-6 sm:pt-6">
        <h3 className="text-h3 font-semibold text-content">
          {name ?? "Engineering decision"}
        </h3>
        {rule ? (
          <span className="rounded-full bg-accent-soft px-2.5 py-0.5 font-mono text-[12px] font-medium text-accent">{rule}</span>
        ) : null}
      </div>

      <dl className="mx-5 mt-5 grid overflow-hidden rounded-image border border-edge sm:mx-6 sm:grid-cols-2">
        <div className="p-4">
          <dt className="flex items-center gap-1.5 text-meta font-medium text-content">
            <Check size={14} strokeWidth={2.25} aria-hidden="true" /> Chose
          </dt>
          <dd className="mt-1.5 text-ui text-content">{chose}</dd>
        </div>
        <div className="border-t border-edge bg-sunken p-4 sm:border-l sm:border-t-0">
          <dt className="flex items-center gap-1.5 text-meta font-medium text-content-faint">
            <X size={14} strokeWidth={2.25} aria-hidden="true" /> Over
          </dt>
          <dd className="mt-1.5 text-ui text-content-muted">{over}</dd>
        </div>
      </dl>

      <div className="px-5 pt-5 sm:px-6">
        <p className="text-meta font-medium text-content-faint">Because</p>
        <p className="prose-body mt-1.5 text-content">{because}</p>

        {/* Chose / Over / Because is the decision; this is the argument for it.
            Folded, so a skimmer reads four decisions in the time one used to
            take, and an engineer is one click from all of it. Find-in-page
            still reaches folded text: Chrome opens a <details> on a match. */}
        {children ? (
          <details className="group mt-4">
            <summary className="inline-flex min-h-11 cursor-pointer items-center gap-2 text-ui font-medium text-content sm:min-h-9">
              <Plus size={16} aria-hidden="true" className="disclosure-icon text-content-faint" />
              <span className="group-open:hidden">The full reasoning</span>
              <span className="hidden group-open:inline">Hide the reasoning</span>
            </summary>
            <div className="pb-2 pt-1">{children}</div>
          </details>
        ) : null}
      </div>

      {href || source ? (
        <div className="mt-5 border-t border-edge bg-sunken px-5 py-3.5 sm:px-6">
          <ProvenanceBadge status="verified" href={href} source={source} />
        </div>
      ) : (
        <div className="h-5" />
      )}
    </aside>
  );
}
