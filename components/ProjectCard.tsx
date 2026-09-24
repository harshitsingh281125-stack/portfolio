import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { caseStudy, tours } from "@/lib/site";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { name, slug, summary, contribution, decisions, repo, demo, login, entry, stack, thumb } = project;
  const tourHref = `/tour/${slug}-in-motion`;
  return (
    <article className="project-card" aria-labelledby={`project-${slug}`}>
      <div className="project-copy">
        <p className="eyebrow project-number">{String(index + 1).padStart(2, "0")} &middot; Personal project</p>
        <h3 id={`project-${slug}`}><Link href={`/work/${slug}`}>{name}</Link></h3>
        <p className="project-summary">{summary}</p>
        <p className="project-contribution">{contribution}</p>
        <ul className="project-decisions">{decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul>
        <p className="project-stack" aria-label={`${name} technology stack`}>{stack.join(" · ")}</p>
        <div className="project-links">
          {demo.enabled ? <a href={entry?.href ?? demo.url} target="_blank" rel="noreferrer">{entry?.label ?? "Live demo"} <ArrowUpRight size={17} aria-hidden="true" /></a> : null}
          {tours.enabled ? <Link href={tourHref}><Play size={16} aria-hidden="true" /> Watch the product tour</Link> : null}
          {caseStudy[slug] ? <Link href={`/work/${slug}`}>Case study <ArrowRight size={17} aria-hidden="true" /></Link> : null}
          <a href={repo} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={17} aria-hidden="true" /></a>
        </div>
        {entry ? <p className="project-access">No account needed</p> : null}
        {demo.enabled && login ? <details className="demo-access"><summary>Demo account</summary><p>{login.email}<br />{login.password}</p><p>The shared account may have no saved roadmaps. The case study includes a walkthrough.</p></details> : null}
      </div>
      <figure className={`project-visual visual-${slug}`}>
        <a href={thumb.src} target="_blank" rel="noreferrer" className="project-image" aria-label={`Enlarge ${name} screenshot`}>
          {/* eslint-disable-next-line @next/next/no-img-element -- local, pre-sized application screenshot */}
          <img src={thumb.src} width={thumb.width} height={thumb.height} alt={thumb.alt} loading="lazy" decoding="async" />
        </a>
        <figcaption>{thumb.caption}<span>Click to enlarge <ArrowUpRight size={13} aria-hidden="true" /></span></figcaption>
      </figure>
    </article>
  );
}
