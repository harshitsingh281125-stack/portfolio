import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { splitKicker } from "@/components/Note";
import { formatDate, notes } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { d } from "@/lib/motion";

export const metadata: Metadata = pageMeta({
  title: "Notes",
  description:
    "Debugging and implementation notes from building Prep and DevLinks.",
  path: "/notes",
});

/** Nine notes read better as two short lists, one per project, than as one long one. */
const groups = ["Prep", "DevLinks"].map((project) => ({
  project,
  href: `/work/${project.toLowerCase()}`,
  items: notes.filter((n) => splitKicker(n.kicker)[0] === project),
}));

export default function NotesIndex() {
  return (
    <div className="page-width py-16 sm:py-24">
      <h1 className="rise text-display-sm font-semibold text-content sm:text-[4rem] sm:leading-[1] sm:tracking-[-0.055em]">
        Notes
      </h1>
      <p style={d(100)} className="rise mt-6 max-w-[38em] text-[1.1875rem] leading-[1.6] text-content-muted">
        Debugging and implementation notes from building Prep and DevLinks, with source links
        and recorded observations.
      </p>

      <div className="mt-16 grid gap-16 lg:grid-cols-2 lg:gap-10">
        {groups.map((g, gi) => (
          <section key={g.project} aria-labelledby={`notes-${g.project}`} data-reveal style={d(gi * 120)}>
            <div className="flex items-baseline justify-between gap-4 border-b border-content pb-3">
              <h2 id={`notes-${g.project}`} className="text-h2 font-semibold text-content">
                {g.project}
              </h2>
              <Link href={g.href} className="inline-flex min-h-11 items-center gap-1 text-[14px] text-content-muted transition-colors hover:text-content sm:min-h-0">
                Case study <ArrowUpRight size={14} aria-hidden="true" />
              </Link>
            </div>
            <ul className="mt-4 flex flex-col gap-3">
              {g.items.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/notes/${n.slug}`}
                    className="group block rounded-card bg-panel p-5 shadow-card transition-shadow hover:shadow-lift sm:p-6"
                  >
                    <span className="flex justify-between gap-4 text-meta text-content-faint">
                      <span>{splitKicker(n.kicker)[1]}</span>
                      <time dateTime={n.date} className="shrink-0 tabular-nums">{formatDate(n.date)}</time>
                    </span>
                    <span className="mt-2 block text-[1.125rem] font-semibold leading-snug tracking-[-0.02em] text-content group-hover:underline group-hover:decoration-edge-strong group-hover:underline-offset-4">
                      {n.title}
                    </span>
                    <span className="mt-2 block text-ui text-content-muted">{n.dek}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
