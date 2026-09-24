/** Professional scope and outcomes from public/Harshit_Resume_2026.pdf. */

export type WorkItem = {
  category: string;
  name: string;
  summary: string;
  /** What was built, its shape and the scale of the work. Under NDA, so the
      product is described, never named. */
  product?: string;
  /** Grouped contributions, for work detailed enough to need headings. */
  groups?: { title: string; points: string[] }[];
  /** Same treatment as the personal projects: what it is built with. */
  stack?: string[];
  /** The shorter form: two paragraphs, where groups would be overkill. */
  details?: string;
  extension?: string;
};

export const experience: {
  role: string;
  company: string;
  location: string;
  period: string;
  /** One line for the résumé entry, where the work cards are too long. */
  summary: string;
  work: WorkItem[];
  maintenance: string;
  collaboration: string;
} = {
  role: "Frontend Engineer",
  company: "Kindtech Pvt Ltd",
  location: "Bengaluru",
  period: "June 2023 — present",
  summary:
    "Two products: a clinical care platform on the web, where I am the primary author of the client, and a React Native app that ships six marketplace verticals from one codebase.",
  work: [
    {
      category: "Healthcare",
      name: "Telehealth & clinical workflows",
      summary: "Owned major parts of a production messaging platform for clinical care.",
      product:
        "A care-coordination platform built for **Medicare's GUIDE dementia-care model** (unnamed under NDA). Two codebases: a React SPA, and a Python backend running a FastAPI service alongside a long-lived chat agent. **~295 commits over 19 months**, and I'm the **primary author of the web client**.",
      stack: [
        "TypeScript",
        "React",
        "WebSockets",
        "msgpack",
        "Twilio",
        "SurveyJS",
        "FastAPI",
        "PostgreSQL",
        "LLM tooling",
      ],
      groups: [
        {
          title: "Real-time clinical messaging",
          points: [
            "**Built the chat client the rest of the product sits on** — authentication, WebSocket transport over msgpack, message pagination, unread-horizon tracking, reactions, pins, mentions, DMs and channels.",
            "Co-authored the **TypeScript client library** the frontend talks to the backend through. I wrote the **WebSocket transport and event decoding**, plus the channel, task, tag and user API bindings.",
            "Added a **reconnect layer** and fixed the event-decoding failures that were **silently dropping live message and membership updates**.",
            "**Twilio video visits**: in-call messaging, gallery view, rejoining a missed call, and a call widget that floats over the chat.",
          ],
        },
        {
          title: "Clinical forms & patient onboarding",
          points: [
            "**Built the dynamic form system end to end**, across client and bot — SurveyJS rendering, multi-step and read-only modes, role-gated visibility, prefill from existing records, and form launchers in the message composer.",
            "Implemented **GUIDE-model patient onboarding**: eligibility schema, caregiver capture, document upload with LLM extraction, and a staged review task so **a human confirms extracted fields before anyone is provisioned as a patient**.",
            "**Migrated patient clinical data off Aidbox/FHIR onto PostgreSQL** — designed the schema, wrote the backfill, then removed the legacy write paths.",
          ],
        },
        {
          title: "AI",
          points: [
            "Shipped **tool modules for the platform's LLM clinical agent** — pharmacy, allergies, care plan — and extended **around eighteen more** covering insurance, care team, patient stage and clinical summary.",
            "Made document extraction **document-aware, so the model's field inferences are grounded in the uploaded source** rather than guessed. Also wrote the algorithm that derives a patient's care stage from their collected clinical data, and the CMS alignment-letter generator.",
            "Used Cursor's agent mode to ship **recurring task scheduling across both repos in a single day** — bot-side ticker, REST endpoints, test suite and the repeats UI, ~2,800 lines.",
          ],
        },
        {
          title: "Platform",
          points: [
            "**Global message search, both halves**: the FastAPI endpoint and the client-side query UI, result navigation and message-context fetch.",
            "**Multi-enterprise tenancy and white-label branding** — per-brand configuration, an asset pipeline, enterprise switcher and active-workspace state. Migrated **142 files** off hardcoded colors onto theme tokens.",
            "**The clinical task system**: creating and editing tasks in chat, patient-linked tasks, consent-assessment and initial-visit workflows, and recurring schedules backed by tests.",
          ],
        },
        {
          title: "Maintaining what I inherited",
          points: [
            "**Fixed a stored XSS** in the message composer and rich-text rendering by introducing DOMPurify sanitization.",
            "**Deleted 841 dead files and roughly 60,000 lines** left over from the platform's previous incarnation, shrinking it to the application that actually ships.",
          ],
        },
      ],
    },
    {
      category: "Mobile & multi-tenant products",
      name: "One codebase, six verticals",
      summary:
        "A React Native app for iOS and Android, shipping six marketplace products to organisation and campus communities.",
      product:
        "One codebase serving **six marketplace verticals** to organisation and campus communities. Two years on it: **589 commits, 713 files**, and **88 pull requests reviewed and merged from 10 engineers**.",
      stack: [
        "TypeScript",
        "React Native",
        "Redux Toolkit",
        "React Navigation",
        "WebSockets",
        "Gradle",
      ],
      groups: [
        {
          title: "One platform, six verticals",
          points: [
            "Architected a React Native platform that launches marketplace verticals from shared configuration, themes, and navigation — **a new vertical is a config entry and a theme, not a forked screen tree**.",
            "Rebuilt tabs, headers, and modals as config-driven components, so **one component tree renders six different products**.",
          ],
        },
        {
          title: "Features, end to end",
          points: [
            "**Built four verticals from empty folder to shipped**: home feed, search and filters, post and edit forms, detail views, activity dashboards, and the flow that turns a listing into a conversation.",
            "Originated **18 of the app's 59 screen modules**, the largest share of any contributor.",
          ],
        },
        {
          title: "Real-time chat",
          points: [
            "Built **socket-driven chat used by every vertical** — live list updates, pending-message states, read receipts, unread indicators, and listing cards rendered inline in conversations.",
            "Later migrated it onto a new backend API **while keeping the legacy path running, so nothing broke mid-rollout**.",
          ],
        },
        {
          title: "Platform and reliability",
          points: [
            "Ran the **React Native 0.74 migration** along with Android API level and Gradle upgrades. Set up staging and production build configs, replaced hardcoded secrets with signed-URL uploads, and added a **force-update gate** to cut off old builds.",
            "Added pagination and debounced search across every feed, fixed timezone correctness for cross-region users, and **refactored onboarding onto Redux Toolkit after cross-account data leaked between sessions**.",
          ],
        },
      ],
    },
  ],
  maintenance:
    "Fixed stored XSS in an inherited application, replaced hardcoded secrets with signed-URL uploads, and removed 841 unused files while migrating UI values to theme tokens.",
  collaboration:
    "Reviewed and merged 88 pull requests from 10 engineers and handled 29 staging-to-main release integrations. I also wrote the rules behind the team's AI-assisted workflow — how a change gets planned, what the codebase expects of it, and how it is checked against the API contract.",
};

export const education = {
  degree: "B.Tech, Computer Science and Engineering",
  school: "Presidency University, Bengaluru",
  period: "2019 — 2023",
  cgpa: "CGPA 8.2 / 10",
} as const;

/**
 * The résumé's skills block, which until now was two rows typed into the JSX.
 * Kept here because the PDF is the source and the two drifted: the site listed
 * twelve things where the PDF lists five categories, and named neither Python
 * nor anything about the AI work, which is half of what the experience section
 * above it describes.
 *
 * "Data Structures and Algorithms" is on the PDF and deliberately not here. It
 * is a subject, not something this site can show you evidence of.
 */
export const skills: { label: string; items: string[] }[] = [
  {
    label: "Languages",
    items: ["TypeScript", "JavaScript", "Python", "SQL", "HTML", "CSS"],
  },
  {
    label: "Frontend",
    items: [
      "React",
      "React Native",
      "Next.js",
      "Redux Toolkit (RTK Query)",
      "React Navigation",
      "Material UI",
      "WebSockets",
    ],
  },
  {
    label: "Backend & data",
    items: [
      "FastAPI",
      "PostgreSQL",
      "Supabase",
      "REST APIs",
      "Row-level security",
    ],
  },
  {
    label: "AI & LLM",
    items: [
      "LLM APIs",
      "RAG",
      "Embeddings",
      "pgvector",
      "Structured outputs",
      "Prompt caching",
      "Model tiering",
    ],
  },
  {
    label: "Testing & platform",
    items: [
      "Jest",
      "Playwright",
      "AWS Cognito",
      "Firebase / FCM",
      "Twilio",
      "Git",
      "CI release workflows",
    ],
  },
];
