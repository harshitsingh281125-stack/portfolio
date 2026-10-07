import { ArrowDown, ArrowRight } from "lucide-react";
import { ProjectCard } from "@/components/ProjectCard";
import { Experience, Resume } from "@/components/Experience";
import { buttonClass } from "@/components/Button";
import { experience } from "@/lib/experience";
import { projects } from "@/lib/projects";
import { resume, site } from "@/lib/site";
import { d } from "@/lib/motion";

export default function Home() {
  return (
    <>
      <section id="top" className="hero page-width" aria-labelledby="intro-heading">
        <h1 id="intro-heading">
          <span className="rise">Frontend engineer building</span>{" "}
          <span className="rise" style={d(90)}>web and mobile products.</span>
        </h1>
        <p className="hero-lede rise" style={d(200)}>
          I build healthcare and marketplace applications at Kindtech. My independent projects
          explore AI-assisted learning and tools for developer resources.
        </p>
        <div className="hero-actions rise" style={d(300)}>
          <a href="#work" className={buttonClass("primary")}>
            View projects <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
          </a>
          {resume.enabled ? (
            <a href={resume.href} className={buttonClass()} download>
              Résumé <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
        </div>
      </section>

      <div className="facts rise" style={d(420)}>
        <dl className="page-width">
          <div><dt>Currently</dt><dd>{experience.role}, Kindtech</dd></div>
          <div><dt>Experience</dt><dd>3+ years, since 2023</dd></div>
          <div><dt>Works in</dt><dd>React, React Native, TypeScript</dd></div>
          <div><dt>Based in</dt><dd>{site.location}</dd></div>
        </dl>
      </div>

      <Experience />

      <section id="work" className="section" aria-labelledby="work-heading">
        <div className="page-width">
          <h2 id="work-heading" className="section-title" data-reveal>Independent projects</h2>
          <p className="section-lede" data-reveal style={d(80)}>
            Two applications I built end to end, from the interface to the database policies.
            Both are live.
          </p>
          <div className="project-grid">
            {projects.map((project, i) => <ProjectCard key={project.slug} project={project} delay={i * 120} />)}
          </div>
        </div>
      </section>

      <Resume />
    </>
  );
}
