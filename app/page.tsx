import { Button } from "@/components/Button";
import { ProjectCard } from "@/components/ProjectCard";
import { Experience } from "@/components/Experience";
import { projects } from "@/lib/projects";
import { resume, site } from "@/lib/site";

/**
 * Home — PLAN.md §3.1.
 *
 * The first line says who, what and how long; the headline says how he
 * thinks; the buttons say how to reach him. A recruiter who reads nothing
 * else has all three. The proof sits on the project cards directly below —
 * the hero used to repeat the cards' numbers as chips, which pushed the
 * projects off a phone's first screen to say something twice.
 *
 * Reading order is DOM order and there is no motion anywhere on this page:
 * the one orchestrated moment on the site is the tour stage (§1.5).
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-20">
      <p className="font-mono text-meta text-content-muted">
        <span className="font-medium text-content">{site.name}</span> &middot; {site.title}{" "}
        &middot; {site.experience} &middot; {site.location}
      </p>

      <h1 className="mt-4 max-w-3xl font-serif text-display-sm font-semibold text-content sm:text-display">
        I build the unglamorous parts of AI products: the gateway, the cap, the
        fallback, and the citation that can&rsquo;t be faked.
      </h1>

      <p className="mt-6 max-w-prose prose-serif text-content-muted">
        Two of them are below, both running, both open. Every number on this
        site links to the file it came from.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <Button href={`mailto:${site.email}`} variant="primary">
          Email me
        </Button>
        {resume.enabled ? <Button href={resume.href}>Résumé (PDF)</Button> : null}
        <Button href={site.github} external>
          GitHub
        </Button>
        <Button href={site.linkedin} external>
          LinkedIn
        </Button>
      </div>

      <section aria-labelledby="work" className="mt-14 sm:mt-20">
        <h2
          id="work"
          className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint"
        >
          Work
        </h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </section>

      <Experience />
    </div>
  );
}
