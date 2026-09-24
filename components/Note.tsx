import type { ReactNode } from "react";
import Link from "next/link";
import { formatDate, noteBySlug, notes } from "@/lib/notes";

/**
 * The note template. One column of 68ch prose and nothing else: no rail,
 * because a note argues one thing and has nothing to index; no Decision block,
 * because §1.4 spends that element on the case studies (see lib/notes.ts).
 *
 * Body copy reuses P, Section and Code from CaseStudy, so a note and a case
 * study are the same typography, not two styles that happen to look alike.
 */

const LINK =
  "text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content";

export function NoteLayout({ slug, children }: { slug: string; children: ReactNode }) {
  const note = noteBySlug(slug);
  if (!note) throw new Error(`No note registered for slug "${slug}" in lib/notes.ts`);
  const others = notes.filter((n) => n.slug !== slug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <article className="min-w-0">
        <p className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          <Link href="/notes" className="no-underline hover:text-content hover:underline">
            Notes
          </Link>{" "}
          &middot; <time dateTime={note.date}>{formatDate(note.date)}</time>
        </p>
        <h1 className="mt-3 max-w-prose font-serif text-display-sm sm:text-display font-semibold text-content">
          {note.title}
        </h1>
        <p className="mt-5 max-w-prose prose-serif text-content-muted">{note.dek}</p>

        <div className="mt-10 max-w-prose">{children}</div>

        <p className="mt-12 max-w-prose border-t border-edge pt-6 text-ui text-content-muted">
          The short version, with the decision it belongs to:{" "}
          <Link href={note.related.href} className={LINK}>
            {note.related.label}
          </Link>
          .
        </p>
      </article>

      <nav aria-label="Other notes" className="mt-12 max-w-prose">
        <h2 className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint">
          Other notes
        </h2>
        <ul className="mt-4 flex flex-col gap-3">
          {others.map((n) => (
            <li key={n.slug} className="text-ui">
              <Link href={`/notes/${n.slug}`} className={LINK}>
                {n.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
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
        className="overflow-x-auto rounded-lg border border-edge bg-panel p-4 font-mono text-meta text-content"
      >
        {children}
      </pre>
      <figcaption className="mt-2 font-mono text-meta text-content-faint">{label}</figcaption>
    </figure>
  );
}
