import { Download } from "lucide-react";
import { education, experience } from "@/lib/experience";
import { resume } from "@/lib/site";

export function Experience() {
  return (
    <section id="company" className="company-section" aria-labelledby="company-heading">
      <div className="page-width">
        <div className="company-intro">
          <div>
            <p className="eyebrow">{experience.company} &middot; {experience.period}</p>
            <h2 id="company-heading">Production work</h2>
          </div>
          <p>As a frontend engineer, I own web and mobile features across healthcare and marketplace products, with backend work where the feature needs it.</p>
        </div>
        <div className="company-products">
          {experience.work.map((product) => (
            <article key={product.name} className="company-card">
              <p className="eyebrow">{product.category}</p>
              <h3>{product.name}</h3>
              <p className="company-description">{product.summary}</p>
              <details className="work-details">
                <summary>Scope &amp; contributions</summary>
                <p>{product.details}</p>
                <p>{product.extension}</p>
              </details>
            </article>
          ))}
        </div>
        <p className="company-maintenance"><strong>Maintaining existing systems.</strong> {experience.maintenance}</p>
      </div>
    </section>
  );
}

export function Resume() {
  return (
    <section id="resume" className="resume-section page-width" aria-labelledby="resume-heading">
      <div className="resume-intro">
        <h2 id="resume-heading">Résumé</h2>
        <p>Experience, technical skills, and education.</p>
        {resume.enabled ? <a href={resume.href} className="pill-button accent-button" download><Download size={18} aria-hidden="true" /> Download résumé (PDF)</a> : null}
      </div>
      <div className="resume-details">
        <div>
          <h3 className="resume-label">Reviews &amp; releases</h3>
          <p>{experience.collaboration}</p>
        </div>
        <div className="resume-skills">
          <div><h3 className="resume-label">Frontend</h3><p>TypeScript, React, React Native, Next.js, Redux Toolkit, WebSockets</p></div>
          <div><h3 className="resume-label">Backend &amp; testing</h3><p>FastAPI, PostgreSQL, Supabase, pgvector, Jest, Playwright</p></div>
        </div>
        <div>
          <h3 className="resume-label">Education</h3>
          <p>{education.degree}<br />{education.school} &middot; {education.period}</p>
        </div>
      </div>
    </section>
  );
}
