import Link from "next/link";
import { ArrowRight, ArrowUpRight, Check, Play, Plus } from "lucide-react";
import { buttonClass } from "@/components/Button";
import { ScreenSwitcher } from "@/components/ScreenSwitcher";
import { caseStudy, tours } from "@/lib/site";
import type { Project } from "@/lib/projects";
import { d } from "@/lib/motion";

export function ProjectCard({ project, delay = 0 }: { project: Project; delay?: number }) {
  const { name, slug, summary, contribution, decisions, repo, demo, login, entry, stack, screens } = project;
  const tourHref = `/tour/${slug}-in-motion`;
  return (
    // The reveal sits on a wrapper so its transition never slows the card's own hover.
    <div className="project-cell" data-reveal style={d(delay)}>
    <article className="project-card shadow-card" aria-labelledby={`project-${slug}`}>
      <ScreenSwitcher name={name} screens={screens} />

      <div className="project-body">
        <h3 id={`project-${slug}`}>
          {caseStudy[slug] ? <Link href={`/work/${slug}`}>{name}</Link> : name}
        </h3>
        <p className="project-summary">{summary}</p>
        <p className="project-contribution">{contribution}</p>
        <ul className="project-decisions" aria-label="Design decisions">
          {decisions.map((decision) => (
            <li key={decision}>
              <Check size={15} strokeWidth={2} aria-hidden="true" />
              <span>{decision}</span>
            </li>
          ))}
        </ul>
        <ul className="tag-list" aria-label={`${name} technology stack`}>
          {stack.map((item) => <li key={item}>{item}</li>)}
        </ul>

        <div className="project-actions">
          {caseStudy[slug] ? (
            <Link href={`/work/${slug}`} className={buttonClass("primary", "sm")}>
              Case study <ArrowRight size={15} strokeWidth={2} aria-hidden="true" />
            </Link>
          ) : null}
          {demo.enabled ? (
            <a href={entry?.href ?? demo.url} target="_blank" rel="noreferrer" className="inline-action">
              {entry?.label ?? "Live demo"} <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          ) : null}
          {tours.enabled ? (
            <Link href={tourHref} className="inline-action">
              <Play size={14} aria-hidden="true" /> Product tour
            </Link>
          ) : null}
          <a href={repo} target="_blank" rel="noreferrer" className="inline-action">
            GitHub <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        </div>

        {entry ? <p className="demo-access">No account needed to open the roadmap.</p> : null}
        {demo.enabled && login ? (
          <details className="demo-access">
            <summary>
              <Plus size={14} className="disclosure-icon" aria-hidden="true" /> Demo account
            </summary>
            <div>
              <span className="mono-meta">{login.email}<br />{login.password}</span>
              <p className="mt-2">The shared account may have no saved roadmaps. The case study includes a walkthrough.</p>
            </div>
          </details>
        ) : null}
      </div>
    </article>
    </div>
  );
}
