import { ArrowUpRight } from "lucide-react";
import { resume, site } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer id="contact" className="site-footer">
      <div className="page-width">
        <div className="footer-main" data-reveal>
          <div className="min-w-0">
            <h2>Let&rsquo;s talk.</h2>
            <a className="contact-email" href={`mailto:${site.email}`}>{site.email}</a>
          </div>
          <nav aria-label="Social and résumé links" className="footer-links">
            <a href={site.github} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a href={site.linkedin} target="_blank" rel="noreferrer">LinkedIn <ArrowUpRight size={15} aria-hidden="true" /></a>
            <a href={site.leetcode} target="_blank" rel="noreferrer">LeetCode <ArrowUpRight size={15} aria-hidden="true" /></a>
            {resume.enabled ? <a href={resume.href}>Résumé <ArrowUpRight size={15} aria-hidden="true" /></a> : null}
          </nav>
        </div>
        <div className="footer-meta">
          <span>{site.name}, {site.location}</span>
          <a href={site.phoneHref}>{site.phone}</a>
        </div>
      </div>
    </footer>
  );
}
