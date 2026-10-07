import { demoLogins, demos, repos } from "./site";

export type Project = {
  slug: string;
  name: string;
  summary: string;
  contribution: string;
  decisions: string[];
  repo: string;
  demo: { url: string; enabled: boolean };
  login?: { email: string; password: string };
  entry?: { href: string; label: string };
  stack: string[];
  /** Application captures, first one shown by default. Provenance: public/work/README.md. */
  screens: Screen[];
};

export type Screen = {
  /** Short tab label. */
  label: string;
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export const projects: Project[] = [
  {
    slug: "prep",
    name: "Prep",
    summary: "An interview study planner with personalized roadmaps, scheduled recall, and progress tracking.",
    contribution: "I built the application end to end, from the study interface to resource retrieval and AI-provider fallback.",
    decisions: [
      "Grounded resource links come from stored documents; fallback suggestions are labeled unverified.",
      "Recall scheduling and progress calculations use deterministic rules, with self-assessed recall.",
    ],
    repo: repos.prep,
    demo: demos.prep,
    login: demoLogins.prep,
    stack: ["Next.js", "TypeScript", "Supabase", "pgvector"],
    screens: [
      {
        label: "Roadmap setup",
        src: "/work/prep-app.png",
        width: 1280,
        height: 800,
        alt: "Prep's roadmap setup screen with example role, timeline, study hours, and weak-area selections.",
        caption: "Roadmap setup · example input in the live app",
      },
      {
        label: "AI usage",
        src: "/work/prep-usage.png",
        width: 1280,
        height: 800,
        alt: "Prep's AI usage screen: the daily call cap, cost per roadmap, cache hit-rate, token counts, fallback rate, and a paid-tier cost projection.",
        caption: "AI usage · live app, demo account",
      },
    ],
  },
  {
    slug: "devlinks",
    name: "DevLinks",
    summary: "A developer bookmark manager for saving, finding, and sharing technical resources.",
    contribution: "I built the React interface, metadata endpoint, and database rules for private and public collections.",
    decisions: [
      "Search filters live in the URL so a filtered view survives a reload.",
      "Duplicate saves return the existing bookmark; published collections open without an account.",
    ],
    repo: repos.devlinks,
    demo: demos.devlinks,
    entry: {
      href: `${demos.devlinks.url}${demos.devlinks.publicEntry}`,
      label: "Open roadmap",
    },
    stack: ["React", "TypeScript", "RTK Query", "Supabase"],
    screens: [
      {
        label: "Roadmap",
        src: "/work/devlinks-app.png",
        width: 1280,
        height: 900,
        alt: "The live React Debugging collection in DevLinks shown as a roadmap: eight numbered study steps, a progress panel, and the first step marked next up.",
        caption: "Public roadmap · live application",
      },
      {
        label: "Landing",
        src: "/work/devlinks-home.png",
        width: 1280,
        height: 800,
        alt: "The DevLinks landing page with a live demo that shows how a pasted link is matched for duplicates, typed, and tagged.",
        caption: "Landing page · live application",
      },
    ],
  },
];

export function projectBySlug(slug: string): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`No project registered for slug "${slug}"`);
  return project;
}
