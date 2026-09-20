import { Claim } from "@/components/Provenance";
import { ProjectCard } from "@/components/ProjectCard";
import { Experience } from "@/components/Experience";
import { projects } from "@/lib/projects";
import { repos } from "@/lib/site";

/**
 * Home — PLAN.md §3.1.
 *
 * Reading order is DOM order and there is no motion anywhere on this page:
 * the one orchestrated moment on the site is the tour stage (§1.5).
 */
export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="max-w-3xl font-serif text-display font-semibold text-content">
        I build the unglamorous parts of AI products: the gateway, the cap, the
        fallback, and the citation that can&rsquo;t be faked.
      </h1>

      <p className="mt-6 max-w-prose prose-serif text-content-muted">
        Two of them are below, both running, both open. Every number on this
        site links to the file that proves it &mdash; or says out loud that it
        can&rsquo;t be checked.
      </p>

      {/* The two evidence chips. Both link to source (§3.1). */}
      <div className="mt-10 flex flex-wrap gap-x-12 gap-y-6">
        <Claim
          value="364"
          label="automated tests in Prep — 283 unit, 81 end-to-end"
          status="verified"
          href={`${repos.prep}/tree/main/tests`}
          source="tests/unit + tests/e2e"
        />
        <Claim
          value="202"
          label="hand-vetted documents in the RAG corpus"
          status="verified"
          href={`${repos.prep}/tree/main/supabase/migrations`}
          source="supabase/migrations"
        />
      </div>

      <section aria-labelledby="work" className="mt-20">
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
