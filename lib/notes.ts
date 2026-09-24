/** Note summaries for the index, page metadata, and related reading. */

export type Note = {
  slug: string;
  title: string;
  /** One sentence. The index shows it, and it is the page description. */
  dek: string;
  /** ISO date the note was written. Shown on the note itself, not the index. */
  date: string;
  /** Topic shown above the title on the index. */
  kicker: string;
  /** The case-study decision expanded on by this note. */
  related: { href: string; label: string };
};

export const notes: Note[] = [
  {
    slug: "fallback-hid-the-failure",
    title: "The fallback worked. The feature didn’t.",
    dek: "A caption-length check rejected real model responses while my short test fixtures passed.",
    date: "2026-09-24",
    kicker: "Prep · Response validation",
    related: { href: "/work/prep#differently", label: "Testing and current limitations, on the Prep case study" },
  },
  {
    slug: "wrong-template-fallback",
    title: "A backend study plan fell back to frontend material",
    dek: "The fallback catalog has a scope. The roadmap needs to say when the requested role falls outside it.",
    date: "2026-09-24",
    kicker: "Prep · Fallback content",
    related: { href: "/work/prep#architecture", label: "Retrieval and fallback, on the Prep case study" },
  },
  {
    slug: "optimistic-bookmark-delete",
    title: "Delete now, put it back if the request fails",
    dek: "How DevLinks removes a bookmark immediately and restores it when the delete request fails.",
    date: "2026-09-24",
    kicker: "DevLinks · UI updates",
    related: { href: "/work/devlinks#problem", label: "The collection workflow, on the DevLinks case study" },
  },
  {
    slug: "public-collection-permissions",
    title: "Sharing a collection without sharing the account",
    dek: "Public collections allow anonymous reads. Their database policies still restrict changes to the owner.",
    date: "2026-09-24",
    kicker: "DevLinks · Public collections",
    related: { href: "/work/devlinks#problem", label: "Public collections, on the DevLinks case study" },
  },
  {
    slug: "saving-the-same-link",
    title: "Saving the same link twice in DevLinks",
    dek: "The database catches the duplicate. The save dialog still needs to do something useful with it.",
    date: "2026-09-24",
    kicker: "DevLinks · Duplicate saves",
    related: { href: "/work/devlinks#d-normalize", label: "Duplicate saves, on the DevLinks case study" },
  },
  {
    slug: "tags-from-the-url",
    title: "Getting useful tags from a URL and a title",
    dek: "DevLinks suggests tags with a small rule table. It works for familiar topics and misses what it doesn’t know.",
    date: "2026-09-24",
    kicker: "DevLinks · Tag suggestions",
    related: { href: "/work/devlinks#d-rules", label: "Tag suggestions, on the DevLinks case study" },
  },
  {
    slug: "similarity-floor",
    title: "Calibrating Prep’s retrieval threshold",
    dek: "How off-topic queries exposed weak matches, and why expanding the corpus required another calibration.",
    date: "2026-09-21",
    kicker: "Prep · RAG grounding",
    related: { href: "/work/prep#d-citation", label: "Citation by index, on the Prep case study" },
  },
  {
    slug: "e2e-suite-spent-real-calls",
    title: "My E2E suite spent 26 real API calls and reported green",
    dek: "Playwright reused my development server, bypassing the mock-provider configuration. I added an explicit provider check.",
    date: "2026-09-21",
    kicker: "Prep · Testing",
    related: { href: "/work/prep#differently", label: "What I’d do differently, on the Prep case study" },
  },
  {
    slug: "allowed-to-say-behind",
    title: "Calculating study progress at the boundaries",
    dek: "Elapsed weeks, inactive roadmaps, and a floating-point error at the on-track boundary.",
    date: "2026-09-21",
    kicker: "Prep · Progress calculations",
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
