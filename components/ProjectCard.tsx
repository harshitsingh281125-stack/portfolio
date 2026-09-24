import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play } from "lucide-react";
import { caseStudy, tours } from "@/lib/site";
import type { Project } from "@/lib/projects";

export function ProjectCard({ project, index = 0 }: { project: Project; index?: number }) {
  const { name, slug, summary, decisions, repo, demo, login, entry, stat, stack, thumb } = project;
  const tourHref = `/tour/${slug}-in-motion`;
  const image = (
    // eslint-disable-next-line @next/next/no-img-element -- existing static product screenshots
    <img src={thumb.light} width={thumb.width} height={thumb.height} alt={thumb.alt} loading="lazy" decoding="async" />
  );

  return (
    <article className={`project-card${index % 2 ? " project-reversed" : ""}`} aria-labelledby={`project-${slug}`}>
      <div className="project-copy">
        <p className="eyebrow project-number">{String(index + 1).padStart(2, "0")} &middot; Personal project</p>
        <h3 id={`project-${slug}`}>{caseStudy[slug] ? <Link href={`/work/${slug}`}>{name}</Link> : name}</h3>
        <p className="project-summary">{summary}</p>
        <ul className="project-decisions">{decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul>
        <ul className="stack-tags" aria-label={`${name} technology stack`}>{stack.map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="project-links">
          {demo.enabled ? <a href={demo.url} target="_blank" rel="noreferrer">Live demo <ArrowUpRight size={17} aria-hidden="true" /></a> : null}
          <a href={repo} target="_blank" rel="noreferrer">Source on GitHub <ArrowUpRight size={17} aria-hidden="true" /></a>
          {caseStudy[slug] ? <Link href={`/work/${slug}`}>Case study <ArrowRight size={17} aria-hidden="true" /></Link> : null}
        </div>
        {demo.enabled && entry ? <a className="project-access" href={entry.href} target="_blank" rel="noreferrer">{entry.label} <ArrowUpRight size={14} aria-hidden="true" /></a> : null}
        {demo.enabled && login ? <details className="demo-access"><summary>Demo login</summary><p>{login.email}<br />{login.password}</p></details> : null}
      </div>
      <div className={`project-visual visual-${slug}`}>
        <div className="preview-topline"><span>{name}</span><span className="eyebrow">Product preview</span></div>
        {tours.enabled ? <Link href={tourHref} className="project-image" aria-label={`Watch the ${name} tour`}>{image}</Link> : <div className="project-image">{image}</div>}
        {tours.enabled ? <Link className="tour-link" href={tourHref}><Play size={15} aria-hidden="true" /> Watch the product tour <ArrowRight size={17} aria-hidden="true" /></Link> : null}
        <div className="project-evidence">
          <span className="evidence-number">{stat.value}</span>
          <div><p>{stat.label}</p><a href={stat.href} target="_blank" rel="noreferrer">{stat.source} <ArrowUpRight size={14} aria-hidden="true" /></a></div>
        </div>
      </div>
    </article>
  );
}
