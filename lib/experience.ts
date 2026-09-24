/** Professional scope and outcomes from public/Harshit_Resume_2026.pdf. */
export const experience = {
  role: "Frontend Engineer",
  company: "Kindtech Pvt Ltd",
  location: "Bengaluru",
  period: "June 2023 — present",
  work: [
    {
      category: "Healthcare",
      name: "Telehealth & clinical workflows",
      summary: "Owned major parts of a production messaging platform for clinical care.",
      details: "Built WebSocket connectivity, paginated conversations, unread state, mentions, and threaded navigation. Integrated Twilio video visits and role-aware clinical forms.",
      extension: "Also designed a patient-data schema in PostgreSQL, built a FastAPI search endpoint and its UI, and implemented tools for an LLM-powered clinical agent.",
    },
    {
      category: "Mobile & multi-tenant products",
      name: "One platform, four verticals",
      summary: "Architected a React Native platform that launches marketplace verticals from shared configuration, themes, and navigation.",
      details: "Built white-label and multi-tenant infrastructure: brand assets, theme tokens, workspace switching, and enterprise-specific filtering.",
      extension: "Owned React Native 0.74, Android API-level, and Gradle upgrades, alongside review and release work across the team.",
    },
  ],
  maintenance: "Fixed stored XSS in an inherited application, replaced hardcoded secrets with signed-URL uploads, and removed 841 unused files while migrating UI values to theme tokens.",
  collaboration: "Reviewed and merged 88 pull requests from 10 engineers and handled 29 staging-to-main release integrations.",
} as const;

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "Presidency University, Bengaluru",
  period: "2019 — 2023",
} as const;
