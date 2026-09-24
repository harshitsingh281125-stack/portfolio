import { Download } from "lucide-react";
import { education, experience } from "@/lib/experience";
import { resume } from "@/lib/site";

const products = [
  {
    name: "Telehealth & clinical care",
    category: "Healthcare",
    description: "Real-time care, from the web client to the services behind it.",
    bullets: [experience.bullets[1], experience.bullets[3]],
    stack: ["React", "WebSockets", "Twilio", "FastAPI", "PostgreSQL"],
  },
  {
    name: "A four-vertical marketplace",
    category: "Marketplace",
    description: "A shared React Native platform, with ownership through to release.",
    bullets: [experience.bullets[0], experience.bullets[4]],
    stack: ["React Native", "TypeScript", "Redux Toolkit", "Android"],
  },
];

export function Experience() {
  return (
    <>
      <section id="company" className="company-section" aria-labelledby="company-heading">
        <div className="page-width">
          <div className="company-intro">
            <div>
              <p className="eyebrow">Currently &middot; {experience.role} at {experience.company}</p>
              <h2 id="company-heading">From the client<br />to what powers it.</h2>
            </div>
            <p>I work across healthcare and marketplace products: real-time interfaces, shared mobile architecture, backend integrations, and the releases that get them into people&rsquo;s hands.</p>
          </div>
          <div className="company-products">
            {products.map((product) => (
              <article key={product.category} className="company-card">
                <p className="eyebrow">{product.category}</p>
                <h3>{product.name}</h3>
                <p className="company-description">{product.description}</p>
                <ul className="company-bullets">{product.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
                <ul className="stack-tags" aria-label={`${product.category} technology stack`}>{product.stack.map((item) => <li key={item}>{item}</li>)}</ul>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section id="resume" className="resume-section page-width" aria-labelledby="resume-heading">
        <div className="resume-intro">
          <h2 id="resume-heading">Résumé</h2>
          <p>The short version is here.<br />The full story is in the PDF.</p>
          {resume.enabled ? <a href={resume.href} className="pill-button accent-button" download><Download size={18} aria-hidden="true" /> Download résumé (PDF)</a> : null}
        </div>
        <div className="resume-details">
          <div>
            <h3 className="resume-label">Experience</h3>
            <div className="resume-job">
              <p className="eyebrow">{experience.period}</p>
              <div>
                <h4>{experience.role} &middot; {experience.company}</h4>
                <p>Healthcare and marketplace products &middot; {experience.location}</p>
                <p>{experience.bullets[2]}</p>
              </div>
            </div>
          </div>
          <div className="resume-skills">
            <div><h3 className="resume-label">Frontend</h3><p>TypeScript, React, React Native, Redux Toolkit, Next.js, WebSockets</p></div>
            <div><h3 className="resume-label">Platform &amp; backend</h3><p>FastAPI, PostgreSQL, Supabase, pgvector, Twilio, Playwright</p></div>
          </div>
          <div>
            <h3 className="resume-label">Education</h3>
            <p>{education.degree}<br />{education.school} &middot; {education.period}</p>
          </div>
        </div>
      </section>
    </>
  );
}
