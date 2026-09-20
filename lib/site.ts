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
  resume: "/resume.pdf",
} as const;

export const repos = {
  prep: "https://github.com/harshitsingh281125-stack/Prep",
  devlinks: "https://github.com/harshitsingh281125-stack/DevLinks",
} as const;

/**
 * Live-demo links are flags, not constants. A portfolio that advertises a
 * broken demo is worse than one that advertises none: the DevLinks deploy is
 * known-broken, so its button stays off until the deploy is verified.
 */
export const demos = {
  prep: { url: "https://prep-seven-theta.vercel.app", enabled: true },
  devlinks: { url: "", enabled: false },
} as const;

/** Source links for provenance badges. Blob paths resolve to real files. */
export function blob(repo: keyof typeof repos, path: string, lines?: string) {
  const branch = repo === "prep" ? "main" : "main";
  return `${repos[repo]}/blob/${branch}/${path}${lines ? `#${lines}` : ""}`;
}
