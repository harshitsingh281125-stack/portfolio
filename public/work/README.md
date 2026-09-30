# Product screenshots

The homepage uses actual application screenshots:

- `prep-app.png` — https://prep-seven-theta.vercel.app/onboarding after Prep's 2026-09-28 redesign (PR #9), dark theme, 1280 × 800 — taller than the first capture's 720 because the redesigned page header pushed the Generate button below a 720px fold. Captured 30 September 2026 with the published demo account. Example form selections: SDE-2 Frontend, late-stage startup, 5 weeks, 12 hours, React internals. Generation was not submitted, and the generate request was blocked in the browser as a guard; no roadmap or study progress was created.
- The first `prep-app.png` (24 September 2026, 1280 × 720) showed the pre-redesign UI and is in git history.
- `devlinks-app.png` — captured 24 September 2026 from https://dev-links-rouge.vercel.app/public/collections/react-debugging, 1280 × 900. Anonymous view of the seeded public collection.

Both screenshots can be enlarged from the project cards. When refreshing them, wait for fonts and data to load and keep the image dimensions and descriptions in `lib/projects.ts` in sync.

The older `*-light.jpg` and `*-dark.jpg` images are stills from authored HTML walkthroughs, not live application captures. `scripts/thumbs.mjs` only regenerates those legacy files.
