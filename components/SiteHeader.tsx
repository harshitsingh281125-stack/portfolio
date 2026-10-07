import Link from "next/link";
import { ArrowDown } from "lucide-react";
import { buttonClass } from "@/components/Button";
import { resume, routes, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="page-width header-inner">
        <Link href="/" className="site-brand" aria-label={`${site.name}, home`}>
          {site.name}
        </Link>
        <nav aria-label="Primary" className="primary-nav">
          <Link href="/#company">Experience</Link>
          <Link href="/#work">Projects</Link>
          {routes.notes ? <Link href="/notes">Notes</Link> : null}
          <Link href="/#contact">Contact</Link>
        </nav>
        {resume.enabled ? (
          <a href={resume.href} className={`header-cta ${buttonClass("primary", "sm")}`} download>
            Résumé <ArrowDown size={14} strokeWidth={2} aria-hidden="true" />
          </a>
        ) : null}
      </div>
    </header>
  );
}
