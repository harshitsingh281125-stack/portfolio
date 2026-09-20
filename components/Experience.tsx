import { ProvenanceBadge } from "@/components/Provenance";
import { experience } from "@/lib/experience";

export function Experience() {
  const { role, context, location, period, bullets, note } = experience;

  return (
    <section aria-labelledby="experience" className="mt-20">
      <h2
        id="experience"
        className="font-mono text-meta font-medium uppercase tracking-wide text-content-faint"
      >
        Experience
      </h2>

      <p className="mt-4 text-ui text-content">
        <span className="font-medium">{role}</span>
        <span className="text-content-muted">
          {" "}
          &middot; {context} &middot; {location}
        </span>
      </p>
      <p className="mt-1 font-mono text-meta text-content-faint">{period}</p>

      <ul className="mt-6 flex max-w-prose flex-col gap-5">
        {bullets.map((b) => (
          <li key={b}>
            <p className="text-ui text-content">{b}</p>
            <p className="mt-1.5">
              <ProvenanceBadge status="unverified" title={note} />
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}
