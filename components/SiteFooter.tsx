import { site } from "@/lib/site";

const links = [
  { label: "Email", href: `mailto:${site.email}`, text: site.email },
  { label: "Phone", href: site.phoneHref, text: site.phone },
  { label: "GitHub", href: site.github, text: "github.com/harshitsingh281125-stack" },
  { label: "LinkedIn", href: site.linkedin, text: "linkedin.com/in/harshit-singh-8900691a8" },
  { label: "LeetCode", href: site.leetcode, text: "leetcode.com/u/gbXitzr3rZ" },
];

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-edge">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h2 className="text-meta font-mono uppercase tracking-wide text-content-faint">
          Contact
        </h2>
        <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2">
          {links.map((l) => (
            <li key={l.label} className="text-ui">
              <span className="sr-only">{l.label}: </span>
              <a href={l.href} className="text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content">
                {l.text}
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-8 text-meta font-mono text-content-faint">
          {site.location}
        </p>
      </div>
    </footer>
  );
}
