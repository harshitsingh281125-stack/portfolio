# Portfolio — plan

**Status:** Phases 0–6 complete (Phase 6 on 2026-09-21), plus a recruiter-facing design pass (6b, §4.2) the same day and the chip removal (6c, §4.3) on 2026-09-23 — both in `f331865`. **Phase 7 is live** at `portfolio-nine-delta-zngdfg4251.vercel.app` (2026-09-24, §4.4). What remains of it is manual: M4, M5's PDF correction, M8, and a real-browser pass.
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
claims. Every number on it carries the file it came from.

That is not a metaphor. It is the literal design system:

| On the site | Means |
|---|---|
| `364 tests` over `tests/unit + tests/e2e`, linked | The count is `grep`-able in the repo the link opens |
| `~60K lines removed`, with no path under it | Private employer work. It cites nothing because it can cite nothing |

**Revised 2026-09-23 (§4.3): the VERIFIED / UNVERIFIED chips are gone.** The rule survives them —
a number either shows the path it came from or shows nothing — but it is now carried by the
citation instead of by a coloured stamp beside it.

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

The signal colours are no longer printed as chips (§4.3). They survive inside the two product
diagrams, where `verified` / `unverified` are states **in Prep**, not judgements on this site — and
there each state is labelled in words as well as coloured (`color.md › Best practices`: *"Avoid
relying solely on color to differentiate…"*). With the chips gone, the page is ink on paper plus
those two diagrams.

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

**How the three faces load** (settled in Phase 2, by measurement, and not to be "tidied" back).
Source Serif 4 is the **variable** cut — one file covering 400 and 600 — and it is the **only**
preloaded face; IBM Plex Sans and Mono carry `preload: false`. Five preloaded font files were
arriving as one bandwidth-bound clump, the serif landed last, and since the serif sets the body
prose it took LCP with it: the Prep page opened at Lighthouse **90** with **83% of LCP spent in
render delay**. Preloading only the serif and taking its variable cut moved that page to **96** and
halved total blocking time. The cost is real and accepted: nav, buttons and badges show a fallback
for a beat longer, and the home page paid 3 points (98 → 95) because its mono evidence chips now
swap later. Both pages clear the ≥95 gate.

**Revised in 6b: the serif is self-hosted and cut to size.** `app/fonts/SourceSerif4-opsz20.woff2`
is Source Serif 4's opsz build instanced with fonttools at `opsz=20` (the font's default) and
`wght=400:600`, the only weights the site sets: **32KB**, against 51KB for the file next/font/google
served. Still the only preloaded face. Measured against a same-day rebuild of the pre-6b commit,
`/work/prep` went from 88–91 to 98–99. OFL 1.1 with no Reserved Font Name; the licence ships beside
it, and the recipe is in `app/layout.tsx`.

*A wrong turn worth recording.* The review first reported loose serif spacing ("A PI", "W hy") and
blamed the font file. It was **headless Chromium's default full hinting**, which snaps each glyph
advance to whole pixels — `r` drawn 9px wide against a true 7.19px. With
`--font-render-hinting=none` every cut, including the original, renders tight. Screenshot-based QA
on this machine should pass that flag, or it will keep finding this.

`display` drops to **30px** (`display-sm`) below 640px: at 40px the home headline ran eight lines
on a 390px phone and filled the first screen before any project appeared. Headings use
`text-wrap: balance`.

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
│ supabase/migrations/0007_resources.sql          │
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

1. **The citation rule** — every number shows the file it came from, and a number that cannot show
   one says so by staying bare — is derived from Prep's own provenance system. A site about a
   different product has no reason to invent it. (Until §4.3 this was a colour rule too: saturated
   colour only on evidence-bearing elements. The colour went; the rule did not.)
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

*Revised in 6b (§4.2) for the reader who gives the page ten seconds.*

- **Identity line** above the hero, in mono: name · AI product engineer · 3+ years shipping React
  and React Native · Bengaluru. Who, what and how long, before anything clever.
- **Hero:** the thesis sentence, first person, no "passionate developer", no emoji, no "Hi 👋".
- **Contact buttons** directly under it: `[Email me]` (the one filled button) `[Résumé (PDF)]
  [GitHub] [LinkedIn]`, then "Open to full-time roles." behind `site.openToRoles` — a claim like
  any other, turned off the day it stops being true.
- ~~Two evidence chips~~ — **cut in 6b.** They repeated the cards' own numbers (364 appeared twice
  above the fold) and pushed the projects off a phone's first screen. The proof now lives once, on
  each card.
- **Project cards:** a still from the project's own tour (light and dark, cut by
  `scripts/thumbs.mjs`, linking to the tour), name, one-line what-it-is, a mono stack line, three
  decision headlines, the verified number, `[case study] [live demo] [code] [▶ tour]`.
- **Experience:** **Kindtech Pvt Ltd, named** — the résumé linked from the nav already names it
  (M5), so leaving it off bought no privacy and cost the recruiter the thing they match on. Five
  bullets (the 88 PRs / 29 releases one added) and a stack line. 6b cut four amber UNVERIFIED
  badges down to one; §4.3 removed that one as well, along with its sentence.
- **Education:** B.Tech CSE, Presidency University, 2019 — 2023, with the CGPA the PDF carries.
- **Résumé section:** the job entry (role, employer, location, dates, one line on the two
  products), the reviews-and-releases line, five skill rows and education, above the PDF download.
  The redesign in `4e75e0a` had dropped the job entry and left the section promising an experience
  block it no longer rendered, with `.resume-job` styling nothing and `experience.role` /
  `experience.location` unread by any component. Skills moved out of the JSX into
  `lib/experience.ts` at the same time: two hand-typed rows had drifted to twelve items and named
  neither Python nor any of the AI work, which is half of what the section above them describes.
- **Contact:** footer, unchanged.

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

**As built, 2026-09-21.** Three Decision blocks, per §1.4:

1. **Validate every hop** — `redirect: 'manual'` plus re-entering the *same* `validateUrlString` on
   each 3xx, and `dns.lookup(host, { all: true })` so the judgement lands on the resolved addresses
   rather than on the string. ([metadata.ts:204-226](../PP/src/server/metadata.ts#L204-L226) —
   the range in the original draft above, `119-167`, was wrong; every citation on the page was
   re-checked against the committed blob and then fetched live on GitHub.)
2. **Normalize in the database** — the sharper version of the draft's "canonicalize, then let a
   unique constraint catch it". `normalize_bookmark_url()` is an `immutable` SQL function on a
   `before insert or update` trigger, so the key is computed by the engine that enforces it and no
   client can disagree; the `23505` path then returns `{ kind: 'duplicate', existing }` as a
   *success* shape and skips list invalidation, because nothing was created.
3. **Regexes, not a model** — the same instinct as Prep's tier split pointed the other way: the
   frequent call gets no inference at all.

Four regrets, not two. The review's rate limit and virtualization are there, and two more found
while reading the code for this page: the endpoint is **unauthenticated** as well as unthrottled,
and there is a **DNS-rebinding gap** between `dns.lookup()` and `fetch()`, which each resolve
independently — so the guard is good against the ordinary case and beatable by someone who owns a
nameserver. The page says so rather than letting the diagram imply otherwise. The fourth is the
normalization rule existing twice, in SQL and in a hand-translated `canonicalizeUrl()`.

**The 596 is disclosed, not quoted.** `vitest run` gives 596, and 259 of those assert the 84-rule
tag table — so the page states both numbers in the same breath. Quoting the 596 alone is exactly
the move this site exists to refuse.

**Diagram at 320px.** `MetadataTraceDiagram` is a 720-unit drawing; scaled into a 288px phone its
13px labels land near 5px. Below `34rem` the figure scrolls sideways instead of shrinking further,
in a `tabindex={0}` `role="group"` container so the region is keyboard-pannable (axe: *"scrollable
region must have keyboard access"*). **The Prep page's `ArchitectureDiagram` has the same geometry
and has not had this treatment** — noted as B1 rather than fixed, since it is Phase 2 work.

### 3.4 Tours

| Route | Source | Work |
|---|---|---|
| `prep-in-motion` | exists, 32KB, 6 scenes, ~50s | retoken to portfolio palette, add pause/restart + scene counter |
| `prep-under-the-hood` | exists, 35KB, request trace | same |
| `devlinks-in-motion` | new | save a link → metadata preview → tags inferred → duplicate caught → published collection |
| `devlinks-trace` | new | `POST /api/metadata` → URL validated → DNS resolved → **private range rejected** → redirect hop re-checked → parse → canonicalize → unique-constraint conflict → dedupe flow |

`devlinks-trace` is the one that makes the bookmark manager look like engineering. It is the
highest-value new asset in the whole build.

**As built, 2026-09-21.**

*Architecture.* The tours stay standalone HTML documents under `public/tour/`, embedded in
iframes, rather than being ported to React. Two reasons, and the second is the real one: they
carry ~70KB of bespoke keyframe CSS plus a hand-written rAF driver that already handles reduced
motion and the keyboard, and their scene markup uses flat names — `.card`, `.chip`, `.step` —
that would collide with the site the moment they shared a document. An iframe is a style boundary
rather than a naming convention. `/tour/[slug]` prerenders all four from `lib/tours.ts`.

*Shared shell.* `public/tour/tour.css` + `tour.js` now hold the tokens, stage, rail, controls and
driver for all four. The **retokening** is an aliasing job, not a rewrite: the portfolio's values
from §1.1 are bound to the names the Prep tours already use (`--text-faint`, `--green`), so 67KB
of scene CSS kept working untouched. `oklch(1 0 0)` — pure white on `--accent` — became
`--on-accent`, because the dark accent is a *light* blue and white on it fails contrast.

*The driver gained the scene counter §1.5 asked for*, plus arrow-key navigation on the rail and a
pause when the stage scrolls out of view. Captions moved out of a JS array and into the markup as
`.scene-caption`, so they exist without JS and cannot drift from the scene they describe.

*Numbers that had drifted* were corrected in the tours: `prep-in-motion` claimed **329** tests in
its caption and **248 unit + 81 E2E** on screen; both now read 364 / 283 + 81.

*What the gate caught*, and would have missed:

- **axe does not cross an iframe boundary.** All seven routes reported 0 while the tours inside
  them were serving violations. Auditing each tour document directly found a missing `lang` on
  all four files and three scrollable regions with no keyboard access. `scripts/qa.mjs` now audits
  the tour documents as a separate pass — this is the part of the gate most likely to rot.
- **Contrast must be measured on settled text.** Auditing 300ms into a fade-in reports colours no
  reader ever sees; the gate now finishes the animations first, which turned 5 "violations" into 0.
- **A fixed-height iframe fails silently.** The first heights were estimated from the stage and
  clipped the pause button off every embed. They are now measured by stepping through every scene
  at the narrowest supported width, because the stacked layout gets taller as it gets narrower and
  a pass measured at 380px was short by up to 454px.
- **Reduced motion does not fit in a frame.** Stacked, a tour runs 2,200–6,600px. Rather than put
  that inside a fixed box and hand the reduced-motion reader a nested scrollbar in the middle of an
  argument, the case-study pages **drop the embed entirely** under `prefers-reduced-motion` and
  show a link to the full-bleed route. Four magic numbers deleted, and a better page for the people
  who asked for the calmer one.
- **Lighthouse's legible-font audit was right.** Sub-12px body text in the new tours and in
  `prep-under-the-hood`'s `.t-note` was bumped to 12px; only the tiny uppercase pane labels stay
  below, being signposts rather than prose.

### 3.5 Notes — 3 posts, mined from `memory.md` and `Rules.md`

1. **"The similarity floor is 0.64, and I measured it"** — why 0.55 felt right and was wrong, what
   0.568 on an off-domain topic would have shipped, and why Gemini embeddings aren't zero-centred.
2. **"My E2E suite spent 26 real API calls and reported green"** — the failure, the diagnosis, and
   the mock provider on its own port that refuses to run against a real one.
3. **"Why the dashboard is allowed to say you're behind"** — derived-on-read progress, pace in whole
   elapsed weeks, and why grading was never handed to a model (it is structurally inclined to be
   generous, which dismantles the only thing recall is for).

Each ~600–900 words, one Decision block, links to the code. **Confirm or swap these in §6.**

**As built, 2026-09-21.** Routes: `/notes/similarity-floor`, `/notes/e2e-suite-spent-real-calls`,
`/notes/allowed-to-say-behind`, plus the `/notes` index. Nav entry on (`routes.notes`), and the Prep
case study's Links section points at the index.

*No Decision block in the notes.* §3.5 asked for one each; §1.4 says the block appears on the case
studies "and nowhere else". §1.4 wins: it is the design system, and two of the three decisions
(`d-citation`, `d-derived`) already have a block on `/work/prep`. Repeating them would spend the
signature element twice on the same claim. Each note instead ends with a link back to the
decision it is the long version of, and cites with `ProvenanceBadge`.

*JSX, not MDX.* Three posts do not justify a content pipeline, and JSX lets a note use the same
`Code` / `ProvenanceBadge` primitives as the case studies. `lib/notes.ts` holds the metadata;
`components/Note.tsx` is the template plus `Output`, a focusable scroller for verbatim program
output (the probe table, `12 * 0.8`).

*The notes go further than the case study, or they would be duplicates.* The floor note adds round
two (corpus 48 → 202, best off-domain 0.568 → 0.616, margin 0.004, raised to 0.64) with its measured
cost (182 / 6 / 1 of 189 topics), plus the two times the probe itself went wrong. The E2E note adds
why each of the three fixes is needed and the pattern: three wrong-server bugs with one cause. The
pace note adds the `9.600000000000001` boundary bug and why grading never went to a model.

*Citations.* Every line range was checked against **pushed** `main`, not the local checkout: local
`origin/main` was stale, and after a fetch every cited file matched except `PRD.md`, so the grading
rationale cites `Architecture.md` L87-92 instead. Markdown files are linked with `?plain=1` so the
line anchor works.

---

## 4. Phases

Each phase ends at a **QA gate**: `npm run build` clean, Lighthouse ≥95 on all four, axe with zero
violations, and a manual pass at 320px / 200% zoom / reduced-motion / keyboard-only.

| # | Phase | Output | Depends on | Status |
|---|---|---|---|---|
| **0** | Scaffold | Next 15 + TS + Tailwind, token layer, three fonts self-hosted, base layout, nav, footer, a11y floor, ~~deployed skeleton~~ | — | **Done** 2026-09-20 · `93730c8`. The deploy did not happen — see O1 below. |
| **1** | Home | Hero, evidence chips, two project cards, experience, contact | 0 · inputs §6 | **Done** 2026-09-20 · `53c9f5a`. Gate: axe 0, Lighthouse 95/100/100/100. |
| **2** | Case-study template + Prep | Decision block, provenance badge, sticky decision rail, architecture diagram, full Prep page | 1 | **Done** 2026-09-20 · `5664727`. Gate: axe 0, Lighthouse 96/100/100/100. |
| **3** | DevLinks case study | Second page on the same template | 2 | **Done** 2026-09-21 · `64d0d8f`. Gate: axe 0, Lighthouse 96/100/100/100. |
| **4** | Tours | Retoken 2 existing, build `devlinks-in-motion` + `devlinks-trace`, embed all four | 2 | **Done** 2026-09-21. `fb4d057`. Gate: axe 0 on 7 routes **and inside all 4 tour documents**, Lighthouse 95–99 / 100 / 100 / 100. |
| **5** | Notes | Index + 3 posts | 2 | **Done** 2026-09-21 · `f1baa69`. Gate: axe 0 on 11 routes and inside all 4 tour documents, Lighthouse 97–98 / 100 / 100 / 100 on the four notes routes. Link check: every GitHub citation 200 (7 returned 429 in the batch and 200 when retried with spacing); LeetCode 403 and LinkedIn 999/429 block automated requests, as they did before this phase. |
| **6** | Polish | OG images per route, metadata, sitemap, 404, prefers-reduced-motion audit, Lighthouse, axe | all | **Done** 2026-09-21 · `df5585b`. See §4.1. Gate: axe 0 on 10 routes (incl. the 404) and inside all 4 tour documents; reduced-motion stillness 0 everywhere after one fix; Lighthouse 97 / 95–98 / 96 / 98 / 97 / 99 perf on home, Prep, DevLinks, notes, a note, a tour, 100 on the other three categories throughout. |
| **6c** | Chips removed | VERIFIED / UNVERIFIED chips dropped site-wide (incl. OG cards), availability line dropped, standfirst reworded | 6b | **Done** 2026-09-23 · `f331865`. See §4.3. Gate: build + lint clean, axe 0 on home, Prep, DevLinks and notes. |
| **6b** | Recruiter pass | Identity line + contact buttons, chips cut, card stills + stack lines, named employer with one badge, education, case-study "at a glance" + top CTAs, folded decision reasoning, 44px touch targets, note-index kickers, serif cut to 32KB | 6 | **Done** 2026-09-21 · `f331865` (committed with 6c). See §4.2. Gate: axe 0 on home, Prep, DevLinks, notes and `prep-in-motion` (and on all 11 routes + 4 tours before the final font change); reduced-motion stillness 0; Lighthouse perf home 97–100, Prep 98–99, 100 on the other three categories. Every GitHub citation 200 (8 returned 429 in the batch, 200 retried with spacing); LeetCode 403 / LinkedIn 999 as before. |
| **7** | Ship | ~~Custom domain, DNS~~ (§6.6: shipping on `*.vercel.app`), deploy, production gate, final cross-browser + mobile pass | 6 · manual §5 | **Deployed** 2026-09-24 · `b2d5f8e`. See §4.4. Gate, run against production: axe 0 on all 11 routes and inside all 4 tour documents, across light, dark, 320px, 200% zoom and reduced-motion; no horizontal scroll; reduced-motion stillness 0; all 40 external links 200 (10 GitHub 429s cleared on a spaced retry; LeetCode 403 and LinkedIn 999 block bots as always); Lighthouse 100 on accessibility, best practices and SEO everywhere, performance 97 home / 99 notes / 97 DevLinks / 90–95 Prep. **Open:** the cross-browser and mobile pass needs a real Safari and Firefox, which no tool here has. |

The gate is run by [`scripts/qa.mjs`](./scripts/qa.mjs) — axe across light, dark, 320px, 200% zoom
and reduced-motion, a horizontal-scroll check, and a fetch of every external link on the page.
Lighthouse is a separate command, documented in that file's header.

**Parallel track (yours):** ~~DevLinks deploy~~ done · demo accounts half done — see M4.

### 4.1 Phase 6, as built

- **O1 unblocked in code, not by guessing a host.** `siteUrl` in `lib/site.ts` reads
  `VERCEL_PROJECT_PRODUCTION_URL`, which Vercel sets on every build to the project's production
  domain, and falls back to `localhost:3002`; `SITE_URL` overrides both. Proved by building with
  the variable set to a dummy host: canonical, `og:url`, `og:image`, the sitemap and robots all
  carried it. The hard-coded `harshit.vercel.app` guess is gone.
- **Metadata** goes through one helper, `lib/meta.ts` → `pageMeta()`. Next merges metadata
  shallowly, so a page that sets `openGraph` at all replaces the layout's; routing every page
  through one shape is what stops half the site sharing the home page's `og:title`. Canonical,
  OG (`article` + `published_time` for notes and case studies), Twitter `summary_large_image`.
- **OG images**, 11 of them, one `opengraph-image.tsx` per route over a shared renderer in
  `lib/og.tsx`: the site in miniature, light theme only. A card shows a claim **only where
  the page it links to proves that number** (364 tests on home and Prep, 84 rules on DevLinks);
  notes and tours get none. Fonts are vendored as woff in `assets/og/` (fontsource, OFL) because
  Satori cannot read the woff2 `next/font` downloads, and a CDN fetch would make the build depend
  on the network. Satori ignores `gap` across a fragment; the claim row uses margins.
- **Sitemap and robots** are built from the same flags as the nav, so neither can list a route
  the header would refuse to link. `lastModified` is set only for the notes, which have real
  dates, rather than stamping every page with the build time.
- **404** in the site's voice, serving a real 404 status, `noindex`, linking only routes that exist.
- **B1 closed**: `ArchitectureDiagram` got `MetadataTraceDiagram`'s focusable sideways scroller.
- **Reduced-motion audit, now permanent in `scripts/qa.mjs`.** axe does not test motion, so the
  gate's reduced-motion passes only ever proved accessibility, not stillness. The new pass loads
  every page and every tour document under `reduce`, and fails on any animation still running with
  a real duration, or on markup that changes over two seconds (a script still driving). It found
  one: the caret in `devlinks-in-motion` blinked forever, reduced motion or not. That was also a
  WCAG 2.2.2 failure for everyone, because the tour's pause does not reach a CSS animation. Now
  four blinks, then steady; none under reduced motion.
- **Lighthouse variance is real.** `/work/prep` scored 94 once and 95, 96, 98 on reruns (LCP
  2.3–2.7s, CLS 0). Report the spread, not the best run.

### 4.2 Phase 6b, the recruiter pass, as built

An apple-design review of the shipped site against the reader §0 names: a recruiter or hiring
manager who skims before an engineer reads. Nothing in the thesis changed; what changed is how fast
it reaches someone who will not scroll.

- **Home** — see §3.1. Shared `Button` component (`components/Button.tsx`): ink outline, or filled
  ink for the one primary action per view; `min-h-11` (44px) below 640px, where the old buttons
  measured 35px against HIG's 44pt default (`accessibility.md`).
- **Case studies open with the short version.** Under the standfirst: `[Live demo] [Code] [▶ Tour]`
  and the demo login or public path, then an **At a glance** panel — Built / Hardest part / Stack.
  §7's risk row promised "a scannable summary up top"; the first build put the demo link in a Links
  section at the very bottom of 1,200 words.
- **Decision blocks fold their long argument.** Chose / Over / Because stays open — that *is* the
  decision — and the elaboration sits in a `<details>` ("The full reasoning"). Chrome's
  find-in-page still opens a folded block on a match, and the rail's anchors still land.
- **Notes index** shows a topic kicker ("Prep · RAG grounding") instead of the date. All three were
  written on 2026-09-21, and three identical dates stacked read as a bulk upload. Each note page
  still carries its true date; nothing was back-dated.
- **Serif** — self-hosted and cut to 32KB, see §1.2. The spacing "bug" that started it was a
  headless-rendering artifact, also recorded there.
- **Card stills are lazy and low priority.** Eager, the two JPEGs took bandwidth from the preloaded
  serif and cost home ~3 points; they are below the fold on a phone and never the LCP.
- **Lighthouse on this machine drifted.** Rebuilding the pre-6b commit gave Prep 88–91 (recorded
  96 at Phase 6), so 6b was measured against that same-day baseline, not the old numbers. Against
  it, the layout changes were neutral and the smaller serif is what lifted Prep to 98–99.

### 4.3 The chips removed, 2026-09-23

Owner's call, after seeing 6b: **drop the VERIFIED / UNVERIFIED chips everywhere**, and the
availability line with them.

- `ProvenanceBadge` now renders the source path alone — a mono link, no dot, no word, no colour.
  Where there is no path, it renders nothing at all.
- The experience block lost its badge and the sentence beside it. The job now stands on the work
  described; what separates it from the projects is that the projects carry paths and it does not.
- The OG cards lost their chip; the claim and its path remain.
- Home's standfirst no longer promises what the page stopped doing: "Every number on this site
  links to the file it came from", with the "or says out loud that it can't be checked" clause cut.
- **What this costs, recorded plainly.** The chips were the visible half of §0's thesis: they said
  *this one is checkable, that one is not*, in a form a skimming reader could not miss. Without
  them a reader has to notice that some numbers carry a path and others do not. The claim-level
  honesty is intact — nothing unlinkable is dressed as linked — but it is quieter, and the amber
  case now reads as absence rather than as a statement.
- The signal colours stay in `globals.css` for the two product diagrams, which show Prep's own
  verified / unverified link states.

### 4.4 Phase 7, as deployed

- **O1 closed without a code change.** `VERCEL_PROJECT_PRODUCTION_URL` resolved to the real host on
  the first build, exactly as §4.1 predicted: every canonical, `og:url`, `og:image`, the sitemap and
  robots.txt carry `portfolio-nine-delta-zngdfg4251.vercel.app`. No environment variable was set.
- **The gate was re-run against production, not localhost** — `QA_BASE` pointed at the deploy. Same
  result as local: axe 0 everywhere, reduced-motion still, no horizontal scroll. Checked by hand:
  the OG card renders (46KB PNG, no chip on it since 6c), the résumé PDF serves, `/nope` 404s, both
  card stills load from the CDN, and the embedded tour plays in dark mode with its Pause control.
- **One real regression, found only on production.** `/work/prep` scored 83–93 with total blocking
  time 250–660ms where every other route sat at 97–99. `loading="lazy"` does not hold an iframe
  back on a slow connection: Chrome's distance-from-viewport threshold grows with the network, so a
  stage ~2,500px down was fetched during the initial load and its CSS, webfont and rAF driver ran
  while the page was still settling. `components/LazyTourFrame.tsx` mounts the frame from an
  IntersectionObserver with a 400px margin instead. Verified at 390px: nothing under `/tour/` is
  requested until the stage is approached. TBT fell to 190–360ms, Prep to 90–95.
- **Prep still sits under the ≥95 gate on some runs**, and it is honest to say so. What is left is
  style/layout and React hydration on a 330-element page, not a deferred asset. Four production
  runs: 90, 95, 94, and 97 for DevLinks. §4.1's rule applies — report the spread, not the best run.
- **Not covered by anything here:** Safari, iOS and Firefox. Every measurement in this document
  came from headless Chromium, and §1.2 records what that renderer once made this review believe.

### Open items the phases depend on

| # | Item | Why it matters |
|---|---|---|
| ~~**O1**~~ | ~~**The site itself is not deployed anywhere.**~~ **Resolved 2026-09-24.** Vercel project created by the owner; production is `https://portfolio-nine-delta-zngdfg4251.vercel.app`. The env-var approach held: canonical, `og:url`, `og:image`, the sitemap and robots all carry the real host with nothing configured. Original note follows. **The site itself is not deployed anywhere.** *No longer blocks Phase 6 — see §4.1: absolute URLs now come from Vercel's build env, so they will be right on the first deploy. The deploy itself is still the first step of Phase 7.* Source is at `github.com/harshitsingh281125-stack/portfolio` (public); there is no Vercel project yet. | Phase 0 listed a deployed skeleton as output and it was never done. Phase 6 cannot write correct OG or canonical URLs without the real host: `app/layout.tsx` currently sets `metadataBase` to `https://harshit.vercel.app`, which is a **guess**, and every absolute URL in the site's metadata inherits it. |
| ~~**O2**~~ | ~~DevLinks has no printed demo login~~ | **Resolved 2026-09-21, without a login.** The seeded collections are published and the public read path is anonymous — verified against the live REST API with the anon key: `react-debugging` returns `is_public: true` with 8 bookmarks, and the same holds for `css-layout` and `api-auth`. The card and the case study now link straight to `/public/collections/react-debugging`. This is strictly better than a printed password: nothing to leak, and no shared row a stranger can mutate — which is the objection standing against Prep's `qa-a@prep.com` in M4. |

---

## 5. Manual steps — things only you can do

Ordered by when they block me.

| # | Step | Blocks | Notes |
|---|---|---|---|
| ~~M1~~ | ~~**Make both repos public**~~ | Phase 1 | **Done.** Both return 200 anonymously, and every provenance link on the site was fetched at its exact line range before shipping. |
| ~~M2~~ | ~~**Confirm Prep's deploy is live**~~ | Phase 1 | **Done** 2026-09-20: `prep-seven-theta.vercel.app` redirects to `/login` and serves 200. Free-tier Supabase still pauses after ~7 days idle, so this needs re-checking before anyone is sent the link. |
| ~~M3~~ | ~~**Deploy DevLinks**~~ | Phase 3 | **Done** 2026-09-20. It was deployed but blank: the legacy `routes` config in `vercel.json` disables Vercel's filesystem step, so `/assets/*.js` was served `index.html` and Firefox rejected the module script as `NS_ERROR_CORRUPTED_CONTENT`. Fixed by reverting to `rewrites`. Live at `dev-links-rouge.vercel.app`. |
| M4 | **Create the two demo accounts** — *half done* | Phase 2 | **Prep: done.** `qa-a@prep.com` is printed on the home card and the case study. Two caveats: it is a QA account on the live Supabase, so anyone who reads the page can mutate its rows; and its data is whatever QA left behind, not the mid-plan state this row asks for (week 3, reviews due, BEHIND PACE showing) — which is the state that makes the dashboard's honesty visible. **DevLinks: not done** (O2). |
| ~~M5~~ | ~~**Resume PDF onto disk**~~ | Phase 1 | **Done:** `public/Harshit_Resume_2026.pdf`, linked from nav and footer, committed to the public repo. Two things it changes: it says **362 tests** where the site now says 364 (the suite grew — the PDF is the one to correct), and it **names the employer**, which §3.1 deliberately does not. The omission now costs credibility without buying privacy. The phone-free variant was not taken. |
| ~~M6~~ | ~~**Domain**~~ | Phase 7 | **Decided** (§6.6): shipping on `*.vercel.app`, no custom domain. Superseded by O1 — there is still no Vercel project. |
| M7 | *(optional)* **Record a 30s fallback video** per app | Phase 6 | Insurance for when a deploy is cold or the AI key is exhausted. |
| M8 | *(optional)* **Tidy both repo landing pages** | Phase 7 | GitHub description and topics. The `INTERVIEW_PREP.md` worry is moot — it is **untracked** in DevLinks and was never pushed, along with `PORTFOLIO_REVIEW.md` and `.codex`. A reviewer who clicks through lands on the README, so it is part of the site. |

---

## 6. Inputs — RESOLVED 2026-09-20

| # | Answer |
|---|---|
| 1 | LinkedIn `linkedin.com/in/harshit-singh-8900691a8` · GitHub `github.com/harshitsingh281125-stack` · LeetCode `leetcode.com/u/gbXitzr3rZ` |
| 2 | **Both repos are public.** Every citation can link to a real file. |
| 3 | ~~DevLinks is deployed but the link is broken~~ → **fixed 2026-09-20**: the deployed `vercel.json` used legacy `routes`, which disables Vercel's filesystem step, so `/assets/*.js` was served `index.html`. Live at `dev-links-rouge.vercel.app`; the demo flag is on. |
| 4 | Prep is live at `prep-seven-theta.vercel.app`, Supabase awake. |
| 5 | Show **email and phone**: `harshit.singh281125@gmail.com`, `+91 78392 48591` (rendered as a `tel:` link). Public exposure of the number was raised and accepted. |
| 6 | Ship on `*.vercel.app`. No custom domain for now. |
| 7 | **No photo** (my call, delegated). The layout is type-led; a portrait here would be an accessory with no job, and LinkedIn already carries the face. Reversible — it would live in the contact block. |
| 8 | Screenshots: capture locally with Playwright against both apps' existing `.env.local`. |
| 9 | Notes topics confirmed as written in §3.5. |
| 10 | **Theme toggle cut.** `prefers-color-scheme` only, per `dark-mode.md` and the "remove one accessory" pass in §1.6. |

Everything is first person throughout, so no pronouns for the owner appear anywhere on the site.

## 6b. Backlog

Not phases. Things found while building a phase that are real but out of its scope (§7:
*"New ideas go to a backlog section, not into a phase."*).

| # | Item | Found |
|---|---|---|
| ~~**B1**~~ | **Closed in Phase 6.** `ArchitectureDiagram` on `/work/prep` is a 700-unit SVG scaled into a 288px phone, putting its labels near 5px. `MetadataTraceDiagram` got a focusable horizontal scroller in Phase 3; Prep's did not. Same fix, one component. | Phase 3 |
| **B2** | `PP/src/server/metadata.ts` has two uncommitted stray comments in the working tree (lines ~234 and ~240). They are below every range this site cites, so no provenance link is affected, but the repo should be clean before anyone browses it. | Phase 3 |
| **B3** | The tour iframe heights are four measured constants per tour. They are correct today and will be wrong the first time a scene's text changes, and nothing fails loudly when they are — the symptom is a quietly clipped control. A build-time check that renders each tour and asserts the constant still fits would close it. | Phase 4 |

## 7. Risks

| Risk | Mitigation |
|---|---|
| **A third Next + Tailwind + Supabase-adjacent repo reads as samey** | The design layer is where this is won — the provenance system, the Decision block and the four tours are things a template cannot produce. |
| **Case studies are long; recruiters skim** | Your chosen "full depth behind a read more": scannable summary up top, decision log expandable underneath. A recruiter gets 30 seconds of signal, an engineer gets everything. **Built in 6b** (§4.2) — it had not been in the first build. |
| **A demo is down when someone clicks it** | M2 + M4, and optionally M7's video. |
| **The site over-claims and a reviewer checks** | Already addressed: every resume number was verified against the repos before this plan was written, and **re-measured from the runners at Phase 1**: Prep is **364** (`vitest run` -> 283, `playwright test --list` -> 81 — the suite grew past the 79 recorded here); 202 = 48 + 35 + 35 + 84, confirmed by `grep -c 'https\?://' supabase/migrations/*.sql`; 84 `TAG_RULES`; 10 tables. DevLinks' unit suite is **596**, not the 487 in `PORTFOLIO_REVIEW.md`. Anything unverifiable carries no citation, and since §4.3 no badge either — so it must not be stated as if it were checkable. |
| **Scope creep into a sixth and seventh section** | The phase table is the contract. New ideas go to a backlog section, not into a phase. |
