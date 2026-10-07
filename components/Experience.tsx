import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDown, ArrowRight, Plus } from "lucide-react";
import { buttonClass } from "@/components/Button";
import { education, experience, skills } from "@/lib/experience";
import { resume } from "@/lib/site";
import { d } from "@/lib/motion";

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

/**
 * The two products sit side by side without card chrome, split by a hairline.
 * Without a card edge there is no pair of boxes to keep level, so an open
 * disclosure simply makes its own column longer.
 */
export function Experience() {
  return (
    <section id="company" className="section" aria-labelledby="company-heading">
      <div className="page-width">
        <h2 id="company-heading" className="section-title" data-reveal>Production work</h2>
        <p className="company-head" data-reveal style={d(60)}>
          <strong>{experience.role}, {experience.company}</strong>
          <span>{experience.period}</span>
        </p>
        <p className="section-lede" data-reveal style={d(120)}>
          I own web and mobile features across healthcare and marketplace products, with backend
          and infrastructure work where the feature needs it.
        </p>

        <div className="work-grid">
          {experience.work.map((product, i) => (
            <article key={product.name} className="work-item" data-reveal style={d(i * 120)}>
              <p className="work-category">{product.category}</p>
              <h3>{product.name}</h3>
              <p className="work-summary">{product.summary}</p>
              {product.stack ? (
                <ul className="tag-list" aria-label={`${product.name} technology stack`}>
                  {product.stack.map((item) => <li key={item}>{item}</li>)}
                </ul>
              ) : null}
              <details className="work-details">
                <summary>
                  Scope and contributions
                  <Plus size={18} className="disclosure-icon" aria-hidden="true" />
                </summary>
                <div className="work-body">
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
                      {group.link ? (
                        <Link href={group.link.href} className="work-link">
                          {group.link.label} <ArrowRight size={14} aria-hidden="true" />
                        </Link>
                      ) : null}
                    </div>
                  ))}
                </div>
              </details>
            </article>
          ))}
        </div>

        <div className="maintenance" data-reveal>
          <h3>Maintaining existing systems</h3>
          <p>{experience.maintenance}</p>
        </div>
      </div>
    </section>
  );
}

export function Resume() {
  return (
    <section id="resume" className="section" aria-labelledby="resume-heading">
      <div className="page-width resume">
        <div className="resume-intro" data-reveal>
          <h2 id="resume-heading" className="section-title">Résumé</h2>
          <p>Experience, technical skills, and education.</p>
          {resume.enabled ? (
            <a href={resume.href} className={buttonClass("primary")} download>
              Résumé <ArrowDown size={16} strokeWidth={2} aria-hidden="true" />
            </a>
          ) : null}
        </div>

        <div className="resume-blocks">
          <div data-reveal>
            <h3 className="resume-label">Experience</h3>
            <div className="resume-row">
              <p className="resume-text tabular-nums">{experience.period}</p>
              <div>
                <h4>{experience.role}, {experience.company}</h4>
                <p className="resume-text">{experience.location}</p>
                <p className="resume-text">{experience.summary}</p>
              </div>
            </div>
          </div>
          <div data-reveal>
            <h3 className="resume-label">Reviews and releases</h3>
            <p className="resume-text">{experience.collaboration}</p>
            <Link href={experience.collaborationLink.href} className="work-link">
              {experience.collaborationLink.label} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div data-reveal>
            <h3 className="resume-label">Skills</h3>
            <div className="skills-grid">
              {skills.map((group) => (
                <div key={group.label}>
                  <h4>{group.label}</h4>
                  <p className="resume-text">{group.items.join(", ")}</p>
                </div>
              ))}
            </div>
          </div>
          <div data-reveal>
            <h3 className="resume-label">Education</h3>
            <div className="resume-row">
              <p className="resume-text tabular-nums">{education.period}</p>
              <div>
                <h4>{education.degree}</h4>
                <p className="resume-text">{education.school}</p>
                <p className="resume-text">{education.cgpa}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
