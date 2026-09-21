import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, notes } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "Notes",
  description:
    "Three things I measured while building Prep, at more length than a case study has room for.",
  path: "/notes",
});

export default function NotesIndex() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-20">
      <h1 className="font-serif text-display font-semibold text-content">Notes</h1>
      <p className="mt-5 max-w-prose prose-serif text-content-muted">
        Three things I measured while building Prep, at more length than a case
        study has room for. Each one links to the code and the log entry it came
        from.
      </p>

      <ul className="mt-12 flex max-w-prose flex-col divide-y divide-edge border-y border-edge">
        {notes.map((n) => (
          <li key={n.slug} className="py-6">
            <p className="font-mono text-meta text-content-faint">
              <time dateTime={n.date}>{formatDate(n.date)}</time>
            </p>
            <h2 className="mt-2 font-serif text-h3 font-semibold text-content">
              <Link
                href={`/notes/${n.slug}`}
                className="underline decoration-edge-strong underline-offset-2 hover:decoration-content"
              >
                {n.title}
              </Link>
            </h2>
            <p className="mt-2 prose-serif text-content-muted">{n.dek}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
