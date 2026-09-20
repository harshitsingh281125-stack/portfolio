import Link from "next/link";
import { site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="border-b border-edge">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-4 sm:px-6"
      >
        <Link
          href="/"
          className="text-ui font-medium text-content no-underline hover:underline"
        >
          {site.name}
        </Link>
        <ul className="flex items-center gap-5 text-ui text-content-muted">
          <li>
            <Link href="/work/prep" className="no-underline hover:text-content hover:underline">
              Work
            </Link>
          </li>
          <li>
            <Link href="/notes" className="no-underline hover:text-content hover:underline">
              Notes
            </Link>
          </li>
          <li>
            <a
              href={site.resume}
              className="no-underline hover:text-content hover:underline"
            >
              Résumé
            </a>
          </li>
        </ul>
      </nav>
    </header>
  );
}
