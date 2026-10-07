import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { formatDate, noteBySlug, notes } from "@/lib/notes";
import { d } from "@/lib/motion";

/**
 * The note template. One column of 66ch prose and nothing else: no rail,
 * because a note argues one thing and has nothing to index; no Decision block,
 * because §1.4 spends that element on the case studies (see lib/notes.ts).
 *
 * Body copy reuses P, Section and Code from CaseStudy, so a note and a case
 * study are the same typography, not two styles that happen to look alike.
 */

/** "Prep · Response validation" → ["Prep", "Response validation"]. */
export function splitKicker(kicker: string): [string, string] {
  const [project, ...topic] = kicker.split(" · ");
  return [project, topic.join(" · ")];
}

export function NoteLayout({ slug, children }: { slug: string; children: ReactNode }) {
  const note = noteBySlug(slug);
  if (!note) throw new Error(`No note registered for slug "${slug}" in lib/notes.ts`);
  const [project, topic] = splitKicker(note.kicker);
  const others = notes.filter((n) => n.slug !== slug && n.kicker.startsWith(project)).slice(0, 4);

  return (
    <div className="page-width py-16 sm:py-24">
      <article className="mx-auto min-w-0 max-w-[46rem]">
        <p className="rise flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-content-faint">
          <Link
            href="/notes"
            className="inline-flex min-h-11 items-center gap-1.5 text-content-muted transition-colors hover:text-content sm:min-h-0"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Notes
          </Link>
          <span aria-hidden="true" className="text-edge-strong">/</span>
          <span>{project}: {topic}</span>
          <span aria-hidden="true" className="text-edge-strong">/</span>
          <time dateTime={note.date} className="tabular-nums">{formatDate(note.date)}</time>
        </p>
        <h1 style={d(60)} className="rise mt-6 text-display-sm font-semibold text-content sm:text-display">
          {note.title}
        </h1>
        <p style={d(150)} className="rise mt-6 text-[1.1875rem] leading-[1.6] text-content-muted">{note.dek}</p>

        <div className="mt-12 border-t border-edge pt-10">{children}</div>

        <Link
          href={note.related.href}
          className="group mt-16 flex items-center justify-between gap-4 rounded-card bg-panel p-5 shadow-card transition-shadow hover:shadow-lift sm:p-6"
        >
          <span>
            <span className="block text-meta text-content-faint">From the case study</span>
            <span className="mt-1 block text-ui font-medium text-content">{note.related.label}</span>
          </span>
          <ArrowRight size={18} aria-hidden="true" className="shrink-0 text-content-faint transition-transform group-hover:translate-x-0.5" />
        </Link>
      </article>

      {others.length ? (
        <nav aria-label="Other notes" data-reveal className="mx-auto mt-20 max-w-[46rem] border-t border-edge pt-10">
          <h2 className="text-h3 font-semibold text-content">More notes on {project}</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {others.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/notes/${n.slug}`}
                  className="flex h-full flex-col rounded-card bg-panel p-5 shadow-card transition-shadow hover:shadow-lift"
                >
                  <span className="text-meta text-content-faint">{splitKicker(n.kicker)[1]}</span>
                  <span className="mt-1.5 text-ui font-medium text-content">{n.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

/**
 * Verbatim program output. It is evidence, so it is set in mono and kept at
 * its real width: at 320px the block scrolls sideways rather than wrapping a
 * table into nonsense, and the scroller is focusable so a keyboard can pan it
 * (axe: "scrollable region must have keyboard access").
 */
export function Output({ label, children }: { label: string; children: string }) {
  return (
    <figure className="mt-6">
      <pre
        tabIndex={0}
        role="region"
        aria-label={label}
        className="overflow-x-auto rounded-card bg-sunken p-5 font-mono text-[12.5px] leading-[1.7] text-content"
      >
        {children}
      </pre>
      <figcaption className="mt-2 text-meta text-content-faint">{label}</figcaption>
    </figure>
  );
}
