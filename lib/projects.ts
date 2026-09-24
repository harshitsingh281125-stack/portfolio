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
  thumb: { src: string; width: number; height: number; alt: string; caption: string };
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
    thumb: {
      src: "/work/prep-app.png",
      width: 1280,
      height: 720,
      alt: "Prep's roadmap setup screen with example role, timeline, study hours, and weak-area selections.",
      caption: "Roadmap setup · example input in the live app",
    },
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
      label: "Open collection",
    },
    stack: ["React", "TypeScript", "RTK Query", "Supabase"],
    thumb: {
      src: "/work/devlinks-app.png",
      width: 1280,
      height: 900,
      alt: "The live React Debugging collection in DevLinks, with an author profile and cards for saved developer resources.",
      caption: "Public collection · live application",
    },
  },
];

export function projectBySlug(slug: string): Project {
  const project = projects.find((item) => item.slug === slug);
  if (!project) throw new Error(`No project registered for slug "${slug}"`);
  return project;
}
