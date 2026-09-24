/**
 * One place for everything the site says about its owner, and the flags that
 * decide what it is allowed to claim. PLAN.md §6.
 */

export const site = {
  name: "Harshit Singh",
  role: "Frontend engineer · React & React Native",
  /** The short form, for the home page's first line. */
  title: "Frontend engineer",
  /** From the résumé summary: frontend since June 2023. */
  experience: "3+ years shipping React and React Native",
  location: "Bengaluru, India",
  email: "harshit.singh281125@gmail.com",
  phone: "+91 78392 48591",
  phoneHref: "tel:+917839248591",
  github: "https://github.com/harshitsingh281125-stack",
  linkedin: "https://www.linkedin.com/in/harshit-singh-8900691a8/",
  leetcode: "https://leetcode.com/u/gbXitzr3rZ/",
  resume: "/Harshit_Resume_2026.pdf",
} as const;

/**
 * The site's own origin, used for metadataBase, canonical URLs, the sitemap and
 * OG images. Resolves PLAN.md O1 without guessing a hostname: Vercel sets
 * VERCEL_PROJECT_PRODUCTION_URL on every build (preview builds included) to the
 * project's production domain, bare, with no scheme. So the first deploy
 * produces correct absolute URLs under whatever name the project ends up with,
 * and a later custom domain only means changing the domain on the Vercel
 * project and redeploying. SITE_URL overrides both, for any other host.
 */
export const siteUrl = new URL(
  process.env.SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "http://localhost:3002"),
);

export const repos = {
  prep: "https://github.com/harshitsingh281125-stack/Prep",
  devlinks: "https://github.com/harshitsingh281125-stack/DevLinks",
} as const;

/**
 * Flags, not constants. This site's whole argument is that it does not make a
 * claim it cannot back, and a dead link is a claim that failed. Anything that
 * depends on an artefact outside this repo — a deploy, a PDF, a tour that is
 * not built yet — stays off until the artefact is verified to exist.
 */
export const demos = {
  prep: { url: "https://prep-seven-theta.vercel.app", enabled: true },
  /**
   * Blank page fixed 2026-09-20: Vercel was serving index.html for /assets/*.js.
   *
   * publicEntry resolves O2 without a demo login. The seeded collections are
   * published, and the public read path is anonymous — verified 2026-09-20 by
   * querying the live REST API as an anon key: slug react-debugging returns
   * is_public true with 8 bookmarks. A reviewer sees real rows without meeting
   * a signup wall, and there is no shared password to leak or QA account for a
   * stranger to mutate.
   */
  devlinks: {
    url: "https://dev-links-rouge.vercel.app",
    publicEntry: "/public/collections/react-debugging",
    enabled: true,
  },
} as const;

/** Phase 4 built all four and /tour/[slug] prerenders each one. */
export const tours = { enabled: true } as const;

/**
 * Routes that do not exist yet. Same rule as the demo flag: the site does not
 * hand anyone a link that 404s, not even while it is being built. Phase 3
 * flipped devlinks; Phase 5 flipped notes.
 */
export const routes = { notes: true } as const;
export const caseStudy: Record<string, boolean> = { prep: true, devlinks: true };

/** Landed 2026-09-20 at public/Harshit_Resume_2026.pdf. */
export const resume = { href: site.resume, enabled: true } as const;

/**
 * Read-only demo logins, printed so a reviewer never meets a signup wall.
 * These are throwaway QA accounts on the project's own Supabase — they are
 * meant to be public, and nothing in them is private.
 */
export const demoLogins = {
  prep: { email: "qa-a@prep.com", password: "QA!Password" },
} as const;

/** Source links for provenance badges. Blob paths resolve to real files. */
export function blob(repo: keyof typeof repos, path: string, lines?: string) {
  const branch = repo === "prep" ? "main" : "main";
  return `${repos[repo]}/blob/${branch}/${path}${lines ? `#${lines}` : ""}`;
}
