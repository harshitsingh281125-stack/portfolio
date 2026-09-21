/**
 * The three notes (PLAN.md §3.5).
 *
 * Each note is its own route under app/notes/, written as JSX rather than MDX:
 * three posts do not justify a content pipeline, and JSX lets a note use the
 * same Code and ProvenanceBadge primitives as the case studies, so a citation
 * in a note is checked by the same rules as a citation anywhere else.
 *
 * This file holds only what the index and the note chrome need.
 */

export type Note = {
  slug: string;
  title: string;
  /** One sentence. The index shows it, and it is the page description. */
  dek: string;
  /** ISO date the note was written. */
  date: string;
  /**
   * The decision on the case study that this note is the long version of.
   * Notes do not carry a Decision block of their own: §1.4 spends that
   * element on the case studies and nowhere else, and two of these three
   * decisions already have one there. The note links back instead.
   */
  related: { href: string; label: string };
};

export const notes: Note[] = [
  {
    slug: "similarity-floor",
    title: "The similarity floor is 0.64, and I measured it",
    dek: "0.55 sounds strict for a cosine similarity. Against Gemini embeddings it would have grounded a Postgres topic on React documentation and badged every link verified.",
    date: "2026-09-21",
    related: { href: "/work/prep#d-citation", label: "Citation by index, on the Prep case study" },
  },
  {
    slug: "e2e-suite-spent-real-calls",
    title: "My E2E suite spent 26 real API calls and reported green",
    dek: "The mock provider was configured correctly and never applied. Nothing failed, because a real model answers a test at least as well as a fake one.",
    date: "2026-09-21",
    related: { href: "/work/prep#differently", label: "What I’d do differently, on the Prep case study" },
  },
  {
    slug: "allowed-to-say-behind",
    title: "Why the dashboard is allowed to say you’re behind",
    dek: "A progress screen that can deliver bad news has to be right about it: derived on read, measured in whole weeks, and never graded by a model.",
    date: "2026-09-21",
    related: { href: "/work/prep#d-derived", label: "Derived on read, on the Prep case study" },
  },
];

export function noteBySlug(slug: string): Note | undefined {
  return notes.find((n) => n.slug === slug);
}

/** "2026-09-21" -> "21 September 2026". Fixed locale so the build is deterministic. */
export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
