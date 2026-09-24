import { education, experience } from "@/lib/experience";

const EYEBROW = "font-mono text-meta font-medium uppercase tracking-wide text-content-faint";

export function Experience() {
  const { role, company, context, location, period, bullets, stack } = experience;

  return (
    <>
      <section aria-labelledby="experience" className="mt-20">
        <h2 id="experience" className={EYEBROW}>
          Experience
        </h2>

        <div className="mt-5 max-w-prose rounded-lg border border-edge bg-panel p-5 sm:p-6">
          <h3 className="text-h3 font-semibold text-content">
            {role} <span className="font-normal text-content-muted">at</span> {company}
          </h3>
          <p className="mt-1 text-ui text-content-muted">
            {context} &middot; {location}
          </p>
          <p className="mt-1 font-mono text-meta text-content-faint">{period}</p>

          <ul className="mt-5 flex flex-col gap-3">
            {bullets.map((b) => (
              <li key={b} className="grid grid-cols-[1.25rem_1fr] text-ui text-content">
                <span aria-hidden="true" className="font-mono text-meta text-content-faint">
                  &rsaquo;
                </span>
                <span>{b}</span>
              </li>
            ))}
          </ul>

          <p className="mt-5 font-mono text-meta text-content-faint">
            <span className="sr-only">Stack: </span>
            {stack.join(" · ")}
          </p>
        </div>
      </section>

      <section aria-labelledby="education" className="mt-12">
        <h2 id="education" className={EYEBROW}>
          Education
        </h2>
        <p className="mt-4 text-ui text-content">
          <span className="font-medium">{education.degree}</span>
          <span className="text-content-muted"> &middot; {education.school}</span>
        </p>
        <p className="mt-1 font-mono text-meta text-content-faint">{education.period}</p>
      </section>
    </>
  );
}
