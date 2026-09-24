import Link from "next/link";
import { Download } from "lucide-react";
import { resume, routes, site } from "@/lib/site";

export function SiteHeader() {
  return (
    <header className="site-header section-border">
      <div className="page-width header-inner">
        <Link href="/" className="site-brand" aria-label={`${site.name}, home`}>
          <span className="brand-monogram" aria-hidden="true">H</span><span>Harshit Singh</span>
        </Link>
        <nav aria-label="Primary" className="primary-nav">
          <Link href="/#work">Projects</Link>
          <Link href="/#company">Current work</Link>
          <Link href="/#resume">Résumé</Link>
          {routes.notes ? <Link href="/notes">Notes</Link> : null}
          <Link href="/#contact">Contact</Link>
        </nav>
        {resume.enabled ? (
          <a href={resume.href} className="pill-button header-download" download>
            <Download size={16} aria-hidden="true" /><span>Download résumé</span>
          </a>
        ) : null}
      </div>
    </header>
  );
}
