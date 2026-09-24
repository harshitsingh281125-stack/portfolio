import { ProjectCard } from "@/components/ProjectCard";
import { Experience } from "@/components/Experience";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section id="top" className="portfolio-hero page-width" aria-labelledby="intro-heading">
        <div className="hero-copy">
          <p className="eyebrow">{site.title} &middot; React &middot; 3+ years</p>
          <h1 id="intro-heading">I build the unglamorous parts of <em>AI products.</em></h1>
          <p className="hero-description">
            The gateway, the cap, the fallback, and the citation that can&rsquo;t
            be faked. Two of my products are below, both running, both open.
            Every number links to the file it came from.
          </p>
        </div>
        <div className="hero-aside">
          <p><span className="status-dot" />Frontend engineer at Kindtech</p>
          <p><span className="status-dot muted" />{site.location}</p>
        </div>
      </section>
      <section id="work" className="projects-section section-border" aria-labelledby="work-heading">
        <div className="page-width">
          <div className="section-heading">
            <h2 id="work-heading">Selected projects</h2>
            <span className="eyebrow">01 &ndash; {String(projects.length).padStart(2, "0")}</span>
          </div>
          <div className="project-list">
            {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
          </div>
        </div>
      </section>
      <Experience />
    </>
  );
}
