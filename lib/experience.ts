/**
 * PLAN.md §3.1. Sourced from Harshit_Resume_2026.pdf, five bullets of six —
 * the ones that show ownership across a boundary rather than feature counts.
 *
 * The employer is named. It was left out at first, but the résumé linked from
 * the nav names it, so the omission bought no privacy and cost the recruiter
 * the one thing they match on.
 *
 * Every bullet describes private work, so none of it can be linked. It used to
 * carry an UNVERIFIED badge saying so; that came off with the rest of the chips
 * (components/Provenance.tsx). The two projects below carry file paths, which
 * is where the distinction now lives.
 */

export const experience = {
  role: "Frontend Engineer",
  company: "Kindtech Pvt Ltd",
  context: "healthcare & marketplace products",
  location: "Bengaluru",
  period: "June 2023 — present",
  bullets: [
    "Architected a config-driven React Native platform that launches four marketplace verticals from shared configuration, theming, and navigation instead of four separate screen trees — and owned the React Native 0.74, Android API-level, and Gradle upgrades underneath it.",
    "Owned the real-time layer of a production telehealth messaging platform: resilient WebSocket connectivity, pagination, unread state, threaded channel and DM navigation, Twilio video visits, and role-aware clinical forms.",
    "Fixed a stored-XSS vulnerability in a large inherited application, then removed 841 dead files — roughly 60,000 lines — migrated hardcoded UI values to theme tokens, replaced hardcoded secrets with signed-URL uploads, and added a force-update mechanism.",
    "Extended ownership past the frontend: designed a PostgreSQL schema and migration for patient clinical data, built a FastAPI global-search API with its frontend integration, and implemented the functional tools an LLM-powered clinical agent calls.",
    "Reviewed and merged 88 pull requests from 10 engineers and handled 29 staging-to-main release integrations.",
  ],
  stack: ["TypeScript", "React", "React Native", "Redux Toolkit", "WebSockets", "Twilio", "FastAPI", "PostgreSQL"],
} as const;

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "Presidency University, Bengaluru",
  period: "2019 — 2023",
} as const;
