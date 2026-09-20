# Portfolio — plan

**Status:** Phase 0 and Phase 1 complete (2026-09-20). Phase 2 is next.
**Owner:** Harshit Singh · **Built by:** phases, one at a time, each with a QA gate (mirrors `Prep/phases.md`).

---

## 0. What this site is

A case-study site for an **AI product engineer who ships frontend**, aimed at hiring managers and
senior engineers at late-stage startups and FAANG-tier companies. It exists to do one thing:

> Convince a skeptical engineer, in under two minutes, that the person who built Prep and DevLinks
> makes decisions the way a senior engineer makes decisions — and then hand them a live app to
> prove it.

### The thesis

**A portfolio that cites its own sources.**

Prep's defining idea is that a hallucinated URL is *unrepresentable* — the model cites a document
by index and the server resolves it against a real row. This site applies the same rule to its own
claims. Every number on it is either linked to the file that proves it, or marked as unverifiable.

That is not a metaphor. It is the literal design system:

| On the site | Means |
|---|---|
| `364 tests` with a green **VERIFIED** dot | Links to `tests/unit` + `tests/e2e`; the count is `grep`-able |
| `~60K lines removed` with an amber **UNVERIFIED** dot | True, from private employer work, not publicly checkable — and the site says so |

Nobody else's portfolio does this, because nobody else's *products* are about provenance. It is
the one idea here that could not be transplanted to a different engineer's site.

---

## 1. Design system

Produced with the `apple-design` skill (Apple HIG, 123 reference pages) in Design improvement mode.
Web gets HIG's **foundations** — accessibility, color, typography, layout, writing, motion — not
its platform conventions (no tab bars, no menu bar). Stated as a scope limit, not skipped.

### 1.1 Color

One rule, and it is the whole identity:

> **Saturated color appears only on elements that carry evidence.** Everything else is ink on paper.

Links are ink with an underline. Buttons are ink. There is no decorative blue, no gradient, no
brand wash. The page is monochrome until a claim shows its provenance — then, and only then, green
or amber. Color means exactly what it means inside Prep (`color.md › Best practices`: *"Avoid using
the same color to mean different things."*).

All values computed with a WCAG contrast script, not estimated. Body text targets **4.5:1**, large
and bold text **3:1** (`accessibility.md › Color contrast`).

**Light** — surface `#F7F8F8`, panel `#FFFFFF`, border `#DCE0E1`

| Token | Hex | On surface | On panel |
|---|---|---|---|
| `--content` — prose, headlines | `#1A1F22` | 15.63:1 | 16.63:1 |
| `--content-muted` — captions, 14px | `#5B6569` | 5.62:1 | 5.98:1 |
| `--content-faint` — 13px mono meta | `#667175` | 4.72:1 | 5.02:1 |
| `--signal-verified` | `#0F6B3D` | 6.19:1 | — |
| `--signal-unverified` | `#8A5A00` | 5.57:1 | — |
| `--signal-behind` | `#A8201A` | 6.84:1 | — |
| `--accent` — used ~3×/page, not for links | `#1B4FD8` | 6.25:1 | — |

**Dark** — surface `#101416`, panel `#181D20`, border `#262C30`

| Token | Hex | On surface | On panel |
|---|---|---|---|
| `--content` | `#E8ECEE` | 15.58:1 | 14.30:1 |
| `--content-muted` | `#9BA5AA` | 7.37:1 | 6.76:1 |
| `--content-faint` | `#8A9499` | 5.98:1 | — |
| `--signal-verified` | `#4CC98A` | 8.85:1 | — |
| `--signal-unverified` | `#E5A93C` | 8.88:1 | — |
| `--signal-behind` | `#F0736A` | 6.50:1 | — |
| `--accent` | `#8AB0F5` | 8.48:1 | — |

Every pair passes. The first draft's faint-meta grey (`#6D787C`) came in at **4.26:1** and was
darkened to `#667175` before it reached this document.

Badges never rely on color alone — each carries a filled dot **and** the word VERIFIED / UNVERIFIED
(`color.md › Best practices`: *"Avoid relying solely on color to differentiate…"*).

### 1.2 Type

Three faces, one job each. A face with no job gets cut.

| Role | Face | Why it, and not the default |
|---|---|---|
| **Prose** — case-study body, notes | **Source Serif 4** (variable, open) | Case studies are 1,200+ word reads. A screen-optimised text serif is a functional choice for long-form, and it separates the site from every Inter-everything dev portfolio. Not a display serif, not a fashion choice. |
| **Interface** — nav, buttons, labels, cards | **IBM Plex Sans** | Already the face of both existing tours. Reusing it is what makes the restyled tours feel native rather than embedded. |
| **Evidence** — numbers, file paths, badges, verbs | **IBM Plex Mono** | His own vernacular: `POST`, `GATE`, `RLS`, `RULE 5`, `vector(1536)`. Data that came from a file should look like it came from a file. |

Scale (rem, 16px root). Body prose sits at **17px/1.65** — above the 13px desktop minimum with room
to spare (`typography.md › Specifications`).

```
display   40 / 1.1   Source Serif 4  600   -0.02em    page titles
h2        27 / 1.25  Source Serif 4  600   -0.01em    case-study sections
h3        20 / 1.35  IBM Plex Sans   600              sub-sections
prose     17 / 1.65  Source Serif 4  400              body
ui        15 / 1.5   IBM Plex Sans   400/500          nav, buttons, cards
meta      13 / 1.45  IBM Plex Mono   500   0.02em     badges, paths, counts
```

Everything scales with the browser's font-size setting (rem throughout, no `px` on text). Layouts
must survive 200% zoom with hierarchy intact.

### 1.3 Layout

One column, `max-width: 68ch` for prose, widening to a 2-column grid only above 1024px where the
case study gains a sticky decision-index rail. Reading order is the DOM order.

```
DESKTOP  ≥1024px                          MOBILE  ≤640px
┌──────────────────────────────────────┐  ┌────────────────────┐
│ Harshit Singh            work notes  │  │ HS        work ··· │
├──────────────────────────────────────┤  ├────────────────────┤
│                                      │  │                    │
│  I build the unglamorous parts of    │  │ I build the        │
│  AI products: the gateway, the cap,  │  │ unglamorous parts  │
│  the fallback, and the citation      │  │ of AI products...  │
│  that can't be faked.                │  │                    │
│                                      │  │ ● 362 tests  VERIF │
│  ● 362 tests   ● 202-doc corpus      │  │ ● 202-doc corpus   │
│                                      │  │                    │
├──────────────────────────────────────┤  ├────────────────────┤
│ ┌────────────────┐┌────────────────┐ │  │ ┌────────────────┐ │
│ │ PREP           ││ DEVLINKS       │ │  │ │ PREP           │ │
│ │ AI-native      ││ Developer      │ │  │ │ ▶ tour         │ │
│ │ learning OS    ││ bookmarks      │ │  │ │ [live] [code]  │ │
│ │ ▶ tour         ││ ▶ tour         │ │  │ └────────────────┘ │
│ │ [live] [code]  ││ [live] [code]  │ │  │ ┌────────────────┐ │
│ └────────────────┘└────────────────┘ │  │ │ DEVLINKS       │ │
├──────────────────────────────────────┤  │ └────────────────┘ │
│ EXPERIENCE                           │  ├────────────────────┤
│ Frontend Engineer · healthcare &     │  │ EXPERIENCE         │
│ marketplace products · 2023—now      │  │ ...                │
└──────────────────────────────────────┘  └────────────────────┘

CASE STUDY  ≥1024px
┌──────────────┬───────────────────────────────────────┐
│ DECISIONS    │  Prep                                 │
│ ─────────    │  An AI-native learning OS             │
│ ▸ Not SM-2   │                                       │
│ ▸ Derived    │  ┌─────────────────────────────────┐  │
│   on read    │  │   ▶  the tour stage             │  │
│ ▸ Tiers not  │  │   full-bleed · autoplays · dark │  │
│   models     │  └─────────────────────────────────┘  │
│ ▸ Floor=0.64 │                                       │
│  (sticky)    │  prose, 68ch, Source Serif 4 …        │
└──────────────┴───────────────────────────────────────┘
```

### 1.4 The signature element

**The Decision block.** Lifted verbatim from the structure of his own READMEs ("The decision worth
defending"), rendered as the one piece of custom typography on the site:

```
┌─────────────────────────────────────────────────┐
│ THE DECISION WORTH DEFENDING          RULE 9  ● │
│                                                 │
│ CHOSE     vector(1536)                          │
│ OVER      the model's native 3072                │
│ BECAUSE   pgvector cannot index a vector        │
│           wider than 2000 dimensions.           │
│                                                 │
│ ● VERIFIED  supabase/migrations/0007_resources.sql │
└─────────────────────────────────────────────────┘
```

Three mono labels in a fixed column, a serif consequence, a provenance footer linking to the actual
file on GitHub. It repeats 4× on the Prep page and 3× on DevLinks, and **nowhere else** — the
boldness is spent in one place (`branding.md`: *"Ensure branding always defers to content."*).

### 1.5 Motion

**One orchestrated moment: the tour stage.** No scroll-triggered fades, no reveal-on-scroll, no
parallax, no typewriter hero. Everything outside the tour is static.

`motion.md › Best practices`: *"Don't add motion for the sake of adding motion."* A portfolio whose
every section fades in as you scroll is motion as decoration, which Apple's own Delight principle
warns against explicitly.

The tours autoplay, but carry a visible **pause / restart** control and a scene counter — *"Let
people cancel motion… don't make people wait for an animation to complete"*
(`motion.md › Providing feedback`). Under `prefers-reduced-motion: reduce` the stage renders every
scene stacked and settled, with no timers — the existing HTML already does this and it will be kept.

### 1.6 Self-critique — would I have produced this for a different engineer?

Required by the skill's improvement mode, and the honest answer is **partly yes**.

*Serif prose + mono data + quiet neutral surface* is a defensible editorial shell that I could hand
to any senior engineer. On its own it is a competent default, not a point of view.

What makes it this person's and not a template:

1. **The color rule** — saturated color exclusively on evidence-bearing elements — is derived from
   Prep's VERIFIED / UNVERIFIED provenance system. A site about a different product has no reason
   to invent it.
2. **The Decision block** copies the rhetorical structure he already writes in (`chose / over /
   because`), so the site sounds like the repos it is describing.
3. **Rule tags** (`RULE 9`) come from his own numbered `Rules.md`, and link to it.
4. **IBM Plex** is not an aesthetic pick — it is the face his two tours are already built in, which
   is what lets them be restyled instead of rebuilt.

Checked against the skill's named template traps, and clear of all three: not warm-cream +
high-contrast serif + terracotta; not near-black + acid accent; not a hairline broadsheet. There
are no `01 / 02 / 03` markers, and no big-number-over-small-label hero.

**Remove one accessory.** The candidate is the **theme toggle**. Apple's position is a single
system-driven appearance with no app-level switch; `prefers-color-scheme` alone is one less control,
one less piece of state, one less thing to get wrong. Counter-argument: on the web a toggle is a
30-second craft signal a reviewer may look for. **Open decision — see §6.**

---

## 2. Information architecture

```
/                       hero · two project cards · experience · contact
/work/prep              case study  (lead)
/work/devlinks          case study
/tour/prep-in-motion            full-bleed, also embedded in /work/prep
/tour/prep-under-the-hood       "
/tour/devlinks-in-motion        new
/tour/devlinks-trace            new
/notes                  index
/notes/[slug]           3 posts
/resume.pdf             static asset
```

No `/about` page. The bio lives in the hero and the experience section; a separate About page on a
5-page site is a page that exists to have a page.

---

## 3. Content plan

### 3.1 Home

- **Hero:** the thesis sentence, first person, no "passionate developer", no emoji, no "Hi 👋".
- **Two evidence chips** under it, both linking to source.
- **Project cards:** name, one-line what-it-is, three decision headlines, `[live demo] [code] [▶ tour]`.
- **Experience:** employer unnamed per your call — "Frontend Engineer · healthcare & marketplace
  products · Bengaluru · June 2023 — present" — carrying the four highest-signal bullets, each
  marked UNVERIFIED because private work cannot be checked. That badge is not an apology; it is
  the site being consistent with its own rule, and a reviewer will notice.
- **Contact:** email, LinkedIn, GitHub, LeetCode, resume. No availability statement.

### 3.2 `/work/prep` — the lead case study

Structure: the problem → the tour, embedded → four Decision blocks → architecture diagram →
"what I'd do differently" → links.

The four decisions, all already written and defensible:

1. **Not textbook SM-2.** The UI promises +1/+4/+14/+30; SM-2's intervals contradict it, and a
   binary Got it / Missed collapses SM-2's 0–5 quality input. Ease persists through a miss.
2. **Progress derived on read, never stored.** `roadmaps.status` and `hours_logged` exist and are
   never read or written — a stored status only decays when you *touch* the row, which is backwards.
3. **Tiers, not model names.** One file names a model. The pricey tier sits on the *rare* call
   (~3 roadmap generations per user, ever) and the cheap tier on the frequent one. Cost follows
   call volume, not perceived importance.
4. **A hallucinated URL is unrepresentable.** The model cites by 1-based index; the validator
   resolves that index to our own row. Plus the two measurements: the similarity floor is **0.64**
   because at 0.55 an off-domain topic scored **0.568** and would have been badged VERIFIED, and
   the column is **`vector(1536)`** because pgvector cannot index past 2000 dims.

**"What I'd do differently"** is not optional. A case study with no regrets reads as marketing. The
E2E suite that silently spent 26 real Gemini calls while reporting green is the best story you own —
it is a testing-infrastructure failure you found, diagnosed and fixed, and senior interviewers weigh
that more than a feature.

### 3.3 `/work/devlinks` — framed to defeat its own weakness

Your `PORTFOLIO_REVIEW.md` is right: "bookmark manager" is the CRUD tutorial of 2024, and the page
must not open on the concept. It opens on the **hardest thing in it**:

> *A server that fetches arbitrary user-supplied URLs is an SSRF engine pointed at your own network.*

Then: DNS resolution and private-range rejection **across redirect hops**
([metadata.ts:119-167](../PP/src/server/metadata.ts#L119-L167)), URL canonicalization →
`(user_id, normalized_url)` uniqueness → the conflict-resolution flow, and RTK Query cache
invalidation with optimistic deletes.

**Deliberately not led with:** export to JSON/Markdown, analytics, avatar upload, the 487 unit tests
(most are lookup-table assertions on the 84 tagging rules, and your own review says so). The
**84-rule classifier** is stated as a number, once, without being called impressive.

Two open weaknesses your review names — no rate limit on `/api/metadata`, no list virtualization —
go in "what I'd do differently", stated plainly. Naming your own gap before the interviewer does is
worth more than the fix.

### 3.4 Tours

| Route | Source | Work |
|---|---|---|
| `prep-in-motion` | exists, 32KB, 6 scenes, ~50s | retoken to portfolio palette, add pause/restart + scene counter |
| `prep-under-the-hood` | exists, 35KB, request trace | same |
| `devlinks-in-motion` | new | save a link → metadata preview → tags inferred → duplicate caught → published collection |
| `devlinks-trace` | new | `POST /api/metadata` → URL validated → DNS resolved → **private range rejected** → redirect hop re-checked → parse → canonicalize → unique-constraint conflict → dedupe flow |

`devlinks-trace` is the one that makes the bookmark manager look like engineering. It is the
highest-value new asset in the whole build.

### 3.5 Notes — 3 posts, mined from `memory.md` and `Rules.md`

1. **"The similarity floor is 0.64, and I measured it"** — why 0.55 felt right and was wrong, what
   0.568 on an off-domain topic would have shipped, and why Gemini embeddings aren't zero-centred.
2. **"My E2E suite spent 26 real API calls and reported green"** — the failure, the diagnosis, and
   the mock provider on its own port that refuses to run against a real one.
3. **"Why the dashboard is allowed to say you're behind"** — derived-on-read progress, pace in whole
   elapsed weeks, and why grading was never handed to a model (it is structurally inclined to be
   generous, which dismantles the only thing recall is for).

Each ~600–900 words, one Decision block, links to the code. **Confirm or swap these in §6.**

---

## 4. Phases

Each phase ends at a **QA gate**: `npm run build` clean, Lighthouse ≥95 on all four, axe with zero
violations, and a manual pass at 320px / 200% zoom / reduced-motion / keyboard-only.

| # | Phase | Output | Depends on |
|---|---|---|---|
| **0** | Scaffold | Next 15 + TS + Tailwind, token layer, three fonts self-hosted, base layout, nav, footer, a11y floor, deployed skeleton | — |
| **1** | Home | Hero, evidence chips, two project cards, experience, contact | 0 · inputs §6 |
| **2** | Case-study template + Prep | Decision block, provenance badge, sticky decision rail, architecture diagram, full Prep page | 1 |
| **3** | DevLinks case study | Second page on the same template | 2 |
| **4** | Tours | Retoken 2 existing, build `devlinks-in-motion` + `devlinks-trace`, embed all four | 2 |
| **5** | Notes | Index + 3 posts | 2 |
| **6** | Polish | OG images per route, metadata, sitemap, 404, prefers-reduced-motion audit, Lighthouse, axe | all |
| **7** | Ship | Custom domain, DNS, final cross-browser + mobile pass | 6 · manual §5 |

**Parallel track (yours, can start now):** demo accounts + seeding + DevLinks deploy — §5.

---

## 5. Manual steps — things only you can do

Ordered by when they block me.

| # | Step | Blocks | Notes |
|---|---|---|---|
| M1 | **Make both repos public** | Phase 1 | Every "view code" link and every provenance badge on the site resolves to GitHub. If the repos stay private the entire thesis collapses. Check for secrets in history first — `Prep/.env.local` and `PP/.env.local` exist locally; confirm they were never committed. |
| M2 | **Confirm Prep's deploy is live** and its Supabase project isn't paused | Phase 1 | Free-tier Supabase pauses after ~7 days idle. A recruiter hitting a paused DB sees a broken app. |
| M3 | **Deploy DevLinks** | Phase 3 | Your README lists production deploy as unverified. Vercel + the three `VITE_*` env vars. |
| M4 | **Create the two demo accounts** | Phase 2 | I write the seed scripts; you run them against your Supabase projects and hand me the credentials to print on the site. Prep's demo should land mid-plan: week 3, reviews due, BEHIND PACE showing. |
| M5 | **Resume PDF onto disk** | Phase 1 | I have it as a chat attachment, not a file. Drop it at `Portfolio/public/resume.pdf`. I recommend a **phone-free variant** for the public web copy. |
| M6 | **Domain** | Phase 7 | Buy + point DNS at Vercel, or say the word and we ship on `*.vercel.app`. |
| M7 | *(optional)* **Record a 30s fallback video** per app | Phase 6 | Insurance for when a deploy is cold or the AI key is exhausted. |
| M8 | *(optional)* **Tidy both repo landing pages** | Phase 7 | GitHub description, topics, and — per your own review — delete `PP/INTERVIEW_PREP.md` from the public repo. A reviewer who clicks through lands on the README, so it is part of the site. |

---

## 6. Inputs — RESOLVED 2026-09-20

| # | Answer |
|---|---|
| 1 | LinkedIn `linkedin.com/in/harshit-singh-8900691a8` · GitHub `github.com/harshitsingh281125-stack` · LeetCode `leetcode.com/u/gbXitzr3rZ` |
| 2 | **Both repos are public.** Provenance badges can link to real files. |
| 3 | ~~DevLinks is deployed but the link is broken~~ → **fixed 2026-09-20**: the deployed `vercel.json` used legacy `routes`, which disables Vercel's filesystem step, so `/assets/*.js` was served `index.html`. Live at `dev-links-rouge.vercel.app`; the demo flag is on. |
| 4 | Prep is live at `prep-seven-theta.vercel.app`, Supabase awake. |
| 5 | Show **email and phone**: `harshit.singh281125@gmail.com`, `+91 78392 48591` (rendered as a `tel:` link). Public exposure of the number was raised and accepted. |
| 6 | Ship on `*.vercel.app`. No custom domain for now. |
| 7 | **No photo** (my call, delegated). The layout is type-led; a portrait here would be an accessory with no job, and LinkedIn already carries the face. Reversible — it would live in the contact block. |
| 8 | Screenshots: capture locally with Playwright against both apps' existing `.env.local`. |
| 9 | Notes topics confirmed as written in §3.5. |
| 10 | **Theme toggle cut.** `prefers-color-scheme` only, per `dark-mode.md` and the "remove one accessory" pass in §1.6. |

Everything is first person throughout, so no pronouns for the owner appear anywhere on the site.

## 7. Risks

| Risk | Mitigation |
|---|---|
| **A third Next + Tailwind + Supabase-adjacent repo reads as samey** | The design layer is where this is won — the provenance system, the Decision block and the four tours are things a template cannot produce. |
| **Case studies are long; recruiters skim** | Your chosen "full depth behind a read more": scannable summary up top, decision log expandable underneath. A recruiter gets 30 seconds of signal, an engineer gets everything. |
| **A demo is down when someone clicks it** | M2 + M4, and optionally M7's video. |
| **The site over-claims and a reviewer checks** | Already addressed: every resume number was verified against the repos before this plan was written, and **re-measured from the runners at Phase 1**: Prep is **364** (`vitest run` -> 283, `playwright test --list` -> 81 — the suite grew past the 79 recorded here); 202 = 48 + 35 + 35 + 84, confirmed by `grep -c 'https\?://' supabase/migrations/*.sql`; 84 `TAG_RULES`; 10 tables. DevLinks' unit suite is **596**, not the 487 in `PORTFOLIO_REVIEW.md`. Anything unverifiable gets the amber badge. |
| **Scope creep into a sixth and seventh section** | The phase table is the contract. New ideas go to a backlog section, not into a phase. |
