import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Play, Plus } from "lucide-react";
import { Button } from "@/components/Button";
import { RailSpy } from "@/components/Reveal";
import { d } from "@/lib/motion";

/**
 * The case-study template (PLAN.md §1.3).
 *
 * One column of 66ch prose. Above 1024px it gains a decision rail on the left
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
    <nav aria-label="Decisions" className="hidden lg:block" data-rail>
      <RailSpy ids={items.map((i) => i.id)} />
      <div className="sticky top-28">
        <p className="text-meta font-medium text-content-faint">Decisions</p>
        <ul className="mt-4 flex flex-col border-l-2 border-edge">
          {items.map((i) => (
            <li key={i.id}>
              <a
                href={`#${i.id}`}
                className="-ml-[2px] block border-l-2 border-transparent py-1.5 pl-4 text-[14px] text-content-muted transition-colors duration-300 hover:text-content"
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
 * and three cells that are the whole page in miniature. PLAN.md §7 promised
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
      <div className="rise mt-8 flex flex-wrap gap-3" style={d(240)}>
        {links.demo ? (
          <Button href={links.demo} external variant="primary">
            Live demo <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
          </Button>
        ) : null}
        <Button href={links.repo} external>
          Code <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
        </Button>
        {links.tour ? (
          <Button href={links.tour}>
            <Play size={14} strokeWidth={2} aria-hidden="true" /> Illustrated walkthrough
          </Button>
        ) : null}
      </div>
      {access ? <p className="mt-4 max-w-prose text-meta text-content-faint">{access}</p> : null}

      <section
        aria-label="At a glance"
        data-reveal
        style={d(320)}
        className="mt-12 grid overflow-hidden rounded-card bg-panel shadow-card md:grid-cols-[1.2fr_1.2fr_0.8fr]"
      >
        <div className="p-6">
          <p className="text-meta font-medium text-content-faint">What I built</p>
          <p className="mt-2 text-ui text-content">{built}</p>
        </div>
        <div className="border-t border-edge p-6 md:border-l md:border-t-0">
          <p className="text-meta font-medium text-content-faint">Hardest part</p>
          <p className="mt-2 text-ui text-content">{hardest}</p>
        </div>
        <div className="border-t border-edge p-6 md:border-l md:border-t-0">
          <p className="text-meta font-medium text-content-faint">Stack</p>
          <ul className="tag-list mt-3">
            {stack.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
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
    <div className="page-width py-16 sm:py-24">
      <div className="grid gap-10 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-16">
        <DecisionRail items={rail} />

        <article className="min-w-0">
          <Link
            href="/#work"
            className="rise inline-flex min-h-11 items-center gap-1.5 text-[14px] text-content-muted transition-colors hover:text-content sm:min-h-0"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Projects
          </Link>
          <h1 style={d(60)} className="rise mt-4 text-display-sm font-semibold text-content sm:text-[4rem] sm:leading-[1] sm:tracking-[-0.055em]">
            {title}
          </h1>
          <p style={d(150)} className="rise mt-6 max-w-[38em] text-[1.1875rem] leading-[1.6] text-content-muted">{standfirst}</p>
          <AtAGlance glance={glance} />
          {children}
        </article>
      </div>
    </div>
  );
}

/** A section of the argument. 66ch prose, nothing animated. */
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
    <section aria-labelledby={id} className="mt-16" data-reveal>
      <h2 id={id} className="text-h2 font-semibold text-content">
        {heading}
      </h2>
      <div className="mt-4 max-w-prose">{children}</div>
    </section>
  );
}

/** Body paragraph. The only prose style on the site. */
export function P({ children }: { children: ReactNode }) {
  return <p className="prose-body mt-4 text-content-muted first:mt-0 [&_strong]:font-medium [&_strong]:text-content">{children}</p>;
}

/** Inline evidence: a path, a constant, a number that came from a file. */
export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded-[5px] bg-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-content [overflow-wrap:anywhere]">
      {children}
    </code>
  );
}

/** A folded figure: the diagram is there for the engineer who asks for it. */
export function Disclosure({ label, children }: { label: string; children: ReactNode }) {
  return (
    <details className="mt-6 overflow-hidden rounded-card bg-panel shadow-card">
      <summary className="flex min-h-14 cursor-pointer items-center justify-between gap-4 px-5 text-ui font-medium text-content">
        {label}
        <Plus size={18} aria-hidden="true" className="disclosure-icon shrink-0 text-content-faint" />
      </summary>
      <div className="border-t border-edge px-5 pb-5">{children}</div>
    </details>
  );
}

/** The two illustrated tours for a project, as a pair of controls. */
export function WalkthroughLinks({ links }: { links: { href: string; label: string }[] }) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {links.map((l) => (
        <Button key={l.href} href={l.href}>
          <Play size={14} strokeWidth={2} aria-hidden="true" /> {l.label}
        </Button>
      ))}
    </div>
  );
}
