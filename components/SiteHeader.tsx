import Link from "next/link";
import { resume, routes, site } from "@/lib/site";

/**
 * Nav renders only what exists. A portfolio that ships a 404 in its own header
 * has already lost the argument the rest of the site is making (PLAN.md §6.3,
 * the same reasoning that kept the DevLinks demo button off until its deploy
 * was verified).
 */
export function SiteHeader() {
  const links = [
    routes.caseStudies ? { href: "/work/prep", label: "Work", external: false } : null,
    routes.notes ? { href: "/notes", label: "Notes", external: false } : null,
    resume.enabled ? { href: resume.href, label: "Résumé", external: true } : null,
  ].filter((l): l is { href: string; label: string; external: boolean } => l !== null);

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
        {links.length > 0 ? (
          <ul className="flex items-center gap-5 text-ui text-content-muted">
            {links.map((l) => (
              <li key={l.href}>
                {l.external ? (
                  <a href={l.href} className="no-underline hover:text-content hover:underline">
                    {l.label}
                  </a>
                ) : (
                  <Link href={l.href} className="no-underline hover:text-content hover:underline">
                    {l.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        ) : null}
      </nav>
    </header>
  );
}
