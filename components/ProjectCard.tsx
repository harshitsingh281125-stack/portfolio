import Link from "next/link";
import { Button } from "@/components/Button";
import { Claim } from "@/components/Provenance";
import { caseStudy, tours } from "@/lib/site";
import type { Project } from "@/lib/projects";

/**
 * A project card states the argument, not the feature list (PLAN.md §3.1).
 * Three decision headlines is the whole pitch: a reviewer who reads only the
 * cards should already know whether the case study is worth opening.
 *
 * The picture comes first because it is read first — a still from the
 * project's own tour, so a recruiter sees a product before a paragraph. It
 * links to that tour. The card is otherwise ink on panel; the colour in the
 * picture is the product's, and the one piece of the card's own colour is the
 * provenance badge on its number, which is the rule the site runs on (§1.1).
 */
export function ProjectCard({ project }: { project: Project }) {
  const { name, slug, summary, decisions, repo, demo, login, entry, stat, stack, thumb } = project;
  const tourHref = `/tour/${slug}-in-motion`;

  const picture = (
    <picture>
      <source srcSet={thumb.dark} media="(prefers-color-scheme: dark)" />
      {/* eslint-disable-next-line @next/next/no-img-element -- two static
          stills with a light/dark <source>; next/image has no media switch */}
      <img
        src={thumb.light}
        width={thumb.width}
        height={thumb.height}
        alt={thumb.alt}
        decoding="async"
        /* Below the fold on a phone, and never the LCP: the serif headline is.
           Eager, the two stills took bandwidth from the preloaded serif and
           cost the home page its LCP. */
        loading="lazy"
        fetchPriority="low"
        className="aspect-[2/1] h-auto w-full object-cover object-top"
      />
    </picture>
  );

  return (
    <article className="flex flex-col overflow-hidden rounded-lg border border-edge bg-panel">
      <div className="border-b border-edge">
        {tours.enabled ? (
          <Link href={tourHref} className="block hover:opacity-90">
            <span className="sr-only">Watch the {name} tour: </span>
            {picture}
          </Link>
        ) : (
          picture
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <h3 className="text-h3 font-semibold text-content">
          {caseStudy[slug] ? (
            <Link href={`/work/${slug}`} className="text-content no-underline hover:underline">
              {name}
            </Link>
          ) : (
            name
          )}
        </h3>

        <p className="mt-2 text-ui text-content-muted">{summary}</p>

        <p className="mt-3 font-mono text-meta text-content-faint">
          <span className="sr-only">Stack: </span>
          {stack.join(" · ")}
        </p>

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
          {caseStudy[slug] ? <Button href={`/work/${slug}`}>Case study</Button> : null}
          {demo.enabled ? (
            <Button href={demo.url} external>
              Live demo
            </Button>
          ) : null}
          <Button href={repo} external>
            Code
          </Button>
          {tours.enabled ? (
            <Button href={tourHref}>
              <span aria-hidden="true">&#9654;</span> Tour
            </Button>
          ) : null}
        </div>

        {/* How a reviewer gets past the front door. A printed login where the
            product has no anonymous path; a real public URL where it does, which
            is strictly better — nothing to leak, nothing to mutate. */}
        {demo.enabled && entry ? (
          <p className="mt-3 font-mono text-meta text-content-faint">
            <a
              href={entry.href}
              className="text-content-faint underline underline-offset-2 decoration-edge-strong hover:decoration-content"
              target="_blank"
              rel="noreferrer"
            >
              {entry.label}
            </a>
          </p>
        ) : null}

        {demo.enabled && login ? (
          <p className="mt-3 font-mono text-meta text-content-faint">
            demo login · {login.email} · {login.password}
          </p>
        ) : null}
      </div>
    </article>
  );
}
