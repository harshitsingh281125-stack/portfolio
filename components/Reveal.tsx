"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Fades each `[data-reveal]` element up once, the first time it scrolls into
 * view (PLAN.md §1.5). One observer for the whole page, re-armed on every
 * client navigation because the layout, and so this component, persists.
 *
 * Nothing is hidden unless the inline script in the layout has set
 * `data-motion` on <html>, which it does only when IntersectionObserver
 * exists. Under reduced motion the CSS never hides anything either, so a
 * failure here can cost the animation but never the content.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-shown])"));
    if (!els.length || !("IntersectionObserver" in window)) {
      els.forEach((el) => el.setAttribute("data-shown", ""));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.setAttribute("data-shown", "");
          io.unobserve(e.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.01 },
    );
    for (const el of els) {
      // Already scrolled past (a deep link, or hydration after a fast scroll):
      // show it now rather than leave it hidden until the reader scrolls back.
      if (el.getBoundingClientRect().bottom < 0) el.setAttribute("data-shown", "");
      else io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);

  return null;
}

/**
 * Marks the decision the reader is on in the case-study rail. State, not
 * decoration: it answers "where am I in the argument".
 */
export function RailSpy({ ids }: { ids: string[] }) {
  useEffect(() => {
    const links = new Map(
      ids.map((id) => [id, document.querySelector<HTMLAnchorElement>(`[data-rail] a[href="#${id}"]`)]),
    );
    const targets = ids.map((id) => document.getElementById(id)).filter((el): el is HTMLElement => !!el);
    if (!targets.length) return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        const current = ids.find((id) => visible.has(id));
        if (!current) return;
        links.forEach((a, id) => {
          if (!a) return;
          if (id === current) a.setAttribute("aria-current", "location");
          else a.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-20% 0px -55% 0px" },
    );
    targets.forEach((t) => io.observe(t));
    return () => io.disconnect();
  }, [ids]);

  return null;
}
