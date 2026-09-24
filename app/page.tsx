import { ProjectCard } from "@/components/ProjectCard";
import { Experience, Resume } from "@/components/Experience";
import { projects } from "@/lib/projects";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <>
      <section id="top" className="portfolio-hero page-width" aria-labelledby="intro-heading">
        <div className="hero-copy">
          <p className="eyebrow">React &middot; React Native &middot; 3+ years</p>
          <h1 id="intro-heading">Frontend engineer building <em>web &amp; mobile products.</em></h1>
          <p className="hero-description">
            I build healthcare and marketplace applications at Kindtech.
            My independent projects explore AI-assisted learning and tools
            for organizing developer resources.
          </p>
        </div>
        <div className="hero-aside">
          <p><span className="status-dot" />Frontend engineer at Kindtech</p>
          <p><span className="status-dot muted" />{site.location}</p>
        </div>
      </section>
      <Experience />
      <section id="work" className="projects-section section-border" aria-labelledby="work-heading">
        <div className="page-width">
          <div className="section-heading">
            <h2 id="work-heading">Independent projects</h2>
            <span className="eyebrow">Built end to end</span>
          </div>
          <div className="project-list">
            {projects.map((project, index) => <ProjectCard key={project.slug} project={project} index={index} />)}
          </div>
        </div>
      </section>
      <Resume />
    </>
  );
}
