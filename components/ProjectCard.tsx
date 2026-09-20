import Link from "next/link";
import { Claim } from "@/components/Provenance";
import { routes, tours } from "@/lib/site";
import type { Project } from "@/lib/projects";

/**
 * A project card states the argument, not the feature list (PLAN.md §3.1).
 * Three decision headlines is the whole pitch: a reviewer who reads only the
 * cards should already know whether the case study is worth opening.
 *
 * The card is ink on panel. The single piece of colour is the provenance
 * badge on its one number — which is the rule the site runs on (§1.1).
 */

function Action({
  href,
  children,
  external,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-flex items-center gap-1.5 rounded-md border border-edge-strong px-3 py-1.5 " +
    "text-ui font-medium text-content no-underline hover:bg-surface";

  if (external) {
    return (
      <a href={href} className={className} target="_blank" rel="noreferrer">
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export function ProjectCard({ project }: { project: Project }) {
  const { name, slug, summary, decisions, repo, demo, login, stat } = project;

  return (
    <article className="flex flex-col rounded-lg border border-edge bg-panel p-5 sm:p-6">
      <h3 className="text-h3 font-semibold text-content">
        {routes.caseStudies ? (
          <Link href={`/work/${slug}`} className="text-content no-underline hover:underline">
            {name}
          </Link>
        ) : (
          name
        )}
      </h3>

      <p className="mt-2 text-ui text-content-muted">{summary}</p>

      <ul className="mt-5 flex flex-col gap-3">
        {decisions.map((d) => (
          <li key={d} className="grid grid-cols-[1.25rem_1fr] text-ui text-content">
            <span aria-hidden="true" className="font-mono text-meta text-content-faint">
              &rsaquo;
            </span>
            <span>{d}</span>
          </li>
        ))}
      </ul>

      {/* Pushes the actions to the bottom so two cards of unequal text still
          line their buttons up. */}
      <div className="mt-6 flex-1" />

      <div className="border-t border-edge pt-5">
        <Claim
          value={stat.value}
          label={stat.label}
          status="verified"
          href={stat.href}
          source={stat.source}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        {routes.caseStudies ? (
          <Action href={`/work/${slug}`}>Case study</Action>
        ) : null}
        {demo.enabled ? (
          <Action href={demo.url} external>
            Live demo
          </Action>
        ) : null}
        <Action href={repo} external>
          Code
        </Action>
        {tours.enabled ? (
          <Action href={`/tour/${slug}-in-motion`}>
            <span aria-hidden="true">&#9654;</span> Tour
          </Action>
        ) : null}
      </div>

      {demo.enabled && login ? (
        <p className="mt-3 font-mono text-meta text-content-faint">
          demo login · {login.email} · {login.password}
        </p>
      ) : null}
    </article>
  );
}
