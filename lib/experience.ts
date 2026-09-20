/**
 * PLAN.md §3.1. Sourced from Harshit_Resume_2026.pdf, four bullets of six —
 * the ones that show ownership across a boundary rather than feature counts.
 * The employer stays unnamed by the owner's call.
 *
 * Every bullet here describes private work, so none of it can be checked from
 * the outside, and each one therefore carries an UNVERIFIED badge. That badge
 * is not an apology. The site's rule is that a claim is either linked to the
 * file that proves it or openly marked as uncheckable, and applying that rule
 * to the owner's own résumé is the point at which the rule becomes credible.
 */

export const experience = {
  role: "Frontend Engineer",
  context: "healthcare & marketplace products",
  location: "Bengaluru",
  period: "June 2023 — present",
  bullets: [
    "Architected a config-driven React Native platform that launches four marketplace verticals from shared configuration, theming, and navigation instead of four separate screen trees — and owned the React Native 0.74, Android API-level, and Gradle upgrades underneath it.",
    "Owned the real-time layer of a production telehealth messaging platform: resilient WebSocket connectivity, pagination, unread state, threaded channel and DM navigation, Twilio video visits, and role-aware clinical forms.",
    "Fixed a stored-XSS vulnerability in a large inherited application, then removed 841 dead files — roughly 60,000 lines — migrated hardcoded UI values to theme tokens, replaced hardcoded secrets with signed-URL uploads, and added a force-update mechanism.",
    "Extended ownership past the frontend: designed a PostgreSQL schema and migration for patient clinical data, built a FastAPI global-search API with its frontend integration, and implemented the functional tools an LLM-powered clinical agent calls.",
  ],
  note: "Private employer work. Nothing here is publicly checkable, and the site says so rather than implying otherwise.",
} as const;
