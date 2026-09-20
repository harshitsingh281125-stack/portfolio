/**
 * One place for everything the site says about its owner, and the flags that
 * decide what it is allowed to claim. PLAN.md §6.
 */

export const site = {
  name: "Harshit Singh",
  role: "AI product engineer who ships frontend",
  location: "Bengaluru, India",
  email: "harshit.singh281125@gmail.com",
  phone: "+91 78392 48591",
  phoneHref: "tel:+917839248591",
  github: "https://github.com/harshitsingh281125-stack",
  linkedin: "https://www.linkedin.com/in/harshit-singh-8900691a8/",
  leetcode: "https://leetcode.com/u/gbXitzr3rZ/",
  resume: "/Harshit_Resume_2026.pdf",
} as const;

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
  /** Blank page fixed 2026-09-20: Vercel was serving index.html for /assets/*.js. */
  devlinks: { url: "https://dev-links-rouge.vercel.app", enabled: true },
} as const;

/** Tours are Phase 4. The buttons appear when the routes do. */
export const tours = { enabled: false } as const;

/**
 * Routes that do not exist yet. Same rule as the demo flag: the site does not
 * hand anyone a link that 404s, not even while it is being built. Phase 3
 * flips devlinks, Phase 5 flips notes.
 */
export const routes = { notes: false } as const;
export const caseStudy: Record<string, boolean> = { prep: true, devlinks: false };

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
