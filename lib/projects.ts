import { blob, demoLogins, demos, repos } from "./site";

/**
 * The two cards on the home page, and later the spine of the two case
 * studies. Every number here was produced by a command, not remembered:
 *
 *   Prep      npx vitest run            -> 283 passed
 *             npx playwright test --list -> Total: 81 tests in 11 files
 *             grep -c 'https\?://' supabase/migrations/*.sql -> 202
 *   DevLinks  npx vitest run            -> 596 passed
 *             grep -c 'pattern:' src/server/taggingRules.ts -> 85, of which
 *               one is the TagRule type on L189 -> 84 rules, L191-L297
 *
 * If one of these ever stops matching its command, the number is wrong and
 * the badge beside it is a lie. That is the entire point of the site.
 */

export type Project = {
  slug: string;
  name: string;
  /** One line. What it is, not why it is good. */
  summary: string;
  /** Three decision headlines — the argument, not the feature list. */
  decisions: string[];
  repo: string;
  demo: { url: string; enabled: boolean };
  login?: { email: string; password: string };
  /**
   * A path into the live app that needs no account. Preferred over a printed
   * login wherever the product has a genuine anonymous read path: there is no
   * shared password to leak and no QA row a stranger can mutate.
   */
  entry?: { href: string; label: string };
  stat: { value: string; label: string; href: string; source: string };
  /** What it is built with. Recruiters search for these words; say them once, plainly. */
  stack: string[];
  /**
   * A still cut from the project's own tour (scripts/thumbs.mjs), light and
   * dark. Alt describes what the picture shows, not what it proves.
   */
  thumb: { light: string; dark: string; width: number; height: number; alt: string };
};

export const projects: Project[] = [
  {
    slug: "prep",
    name: "Prep",
    summary:
      "An AI-native learning OS: it generates a study roadmap, schedules recall, and grades nothing it cannot cite.",
    decisions: [
      "A hallucinated citation is unrepresentable — the model cites by index, the server resolves the index to a real row",
      "Progress is derived on read, never stored, so it cannot go stale while you are away",
      "The similarity floor is 0.64 because at 0.55 an off-domain topic scored 0.568",
    ],
    repo: repos.prep,
    demo: demos.prep,
    login: demoLogins.prep,
    stat: {
      value: "364",
      label: "automated tests — 283 unit, 81 end-to-end",
      href: `${repos.prep}/tree/main/tests`,
      source: "tests/unit + tests/e2e",
    },
    stack: ["Next.js", "TypeScript", "Supabase", "Postgres + RLS", "pgvector", "Playwright"],
    thumb: {
      light: "/work/prep-light.jpg",
      dark: "/work/prep-dark.jpg",
      width: 1073,
      height: 519,
      alt: "Prep's progress dashboard: a behind-pace warning, 41 of 56 hours logged, 78% recall accuracy, and charts of hours and accuracy over time.",
    },
  },
  {
    slug: "devlinks",
    name: "DevLinks",
    summary:
      "A bookmark manager whose hard part is the server: it fetches URLs a stranger typed.",
    decisions: [
      "A server that fetches user-supplied URLs is an SSRF engine pointed at your own network — DNS is resolved and private ranges rejected on every redirect hop",
      "Normalization lives in the database — an immutable SQL function on a trigger writes the column the unique constraint covers, so no client can disagree with it",
      "84 tagging rules run on the server, with no model call in the path",
    ],
    repo: repos.devlinks,
    demo: demos.devlinks,
    entry: {
      href: `${demos.devlinks.url}${demos.devlinks.publicEntry}`,
      label: "a published collection · no login",
    },
    stat: {
      value: "84",
      label: "deterministic tagging rules, no inference in the hot path",
      href: blob("devlinks", "src/server/taggingRules.ts", "L191-L297"),
      source: "src/server/taggingRules.ts",
    },
    stack: ["React", "TypeScript", "Redux Toolkit", "Supabase", "Postgres + RLS"],
    thumb: {
      light: "/work/devlinks-light.jpg",
      dark: "/work/devlinks-dark.jpg",
      width: 1073,
      height: 514,
      alt: "A public DevLinks collection, React Debugging, listing three saved bookmarks with their source domains.",
    },
  },
];

export function projectBySlug(slug: string): Project {
  const p = projects.find((x) => x.slug === slug);
  if (!p) throw new Error(`No project registered for slug "${slug}" in lib/projects.ts`);
  return p;
}
