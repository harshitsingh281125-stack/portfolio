/**
 * PLAN.md §3.1. The employer is unnamed by the owner's call.
 *
 * Every bullet here describes private work, so none of it can be checked from
 * the outside — and each one therefore carries an UNVERIFIED badge. That badge
 * is not an apology. The site's rule is that a claim is either linked to the
 * file that proves it or openly marked as uncheckable, and applying that rule
 * to the owner's own résumé is the point at which the rule becomes credible.
 */

export const experience = {
  role: "Frontend Engineer",
  context: "healthcare & marketplace products",
  location: "Bengaluru",
  period: "June 2023 — present",
  /**
   * Sourced from the résumé, not invented here. Three more of the owner's
   * highest-signal bullets belong in this array; they are pending the résumé
   * file (M5). An empty slot is better than a plausible sentence nobody wrote.
   */
  bullets: [
    "Removed roughly 60,000 lines of dead and duplicated code from a production frontend.",
  ],
  note: "Private employer work. Nothing below is publicly checkable, and the site says so rather than implying otherwise.",
} as const;
