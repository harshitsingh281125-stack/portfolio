import type { ReactNode } from "react";
import { Download } from "lucide-react";
import { education, experience, skills } from "@/lib/experience";
import { resume } from "@/lib/site";

/**
 * **Emphasis** in the experience copy, so a skimmer reads the claim and not the
 * scaffolding around it. Deliberately the whole of the markup this file
 * understands: the alternative was HTML in a data file.
 */
function emphasise(text: string): ReactNode[] {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part,
  );
}

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
              {product.stack ? (
                <p className="company-stack" aria-label={`${product.name} technology stack`}>
                  {product.stack.join(" · ")}
                </p>
              ) : null}
              <details className="work-details">
                <summary>Scope &amp; contributions</summary>
                {product.product ? <p className="work-product">{emphasise(product.product)}</p> : null}
                {product.details ? <p>{product.details}</p> : null}
                {product.extension ? <p>{product.extension}</p> : null}
                {product.groups?.map((group) => (
                  <div key={group.title} className="work-group">
                    <h4>{group.title}</h4>
                    <ul>
                      {group.points.map((point) => (
                        <li key={point}>{emphasise(point)}</li>
                      ))}
                    </ul>
                  </div>
                ))}
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
          <h3 className="resume-label">Experience</h3>
          <div className="resume-job">
            <p className="eyebrow">{experience.period}</p>
            <div>
              <h4>{experience.role} &middot; {experience.company}</h4>
              <p>{experience.location}</p>
              <p>{experience.summary}</p>
            </div>
          </div>
        </div>
        <div>
          <h3 className="resume-label">Reviews &amp; releases</h3>
          <p>{experience.collaboration}</p>
        </div>
        <div className="resume-skills">
          {skills.map((group) => (
            <div key={group.label}>
              <h3 className="resume-label">{group.label}</h3>
              <p>{group.items.join(", ")}</p>
            </div>
          ))}
        </div>
        <div>
          <h3 className="resume-label">Education</h3>
          <p>{education.degree}<br />{education.school} &middot; {education.period}<br />{education.cgpa}</p>
        </div>
      </div>
    </section>
  );
}
