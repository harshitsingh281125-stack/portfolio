// The phase QA gate (PLAN.md §4): axe across light, dark, 320px, 200% zoom and
// reduced-motion, no horizontal scroll, and every external link resolving —
// because a site that cites its sources has to check that the citations load.
//
// Not wired into package.json on purpose: it needs a browser and axe, which is
// ~300MB this repo does not otherwise carry. Run it against a production build:
//
//   npm run build && npx next start -p 3010 &
//   npm i --no-save @playwright/test axe-core && npx playwright install chromium
//   node scripts/qa.mjs
//
// Lighthouse, the fourth part of the gate, is a separate run. Point CHROME_PATH
// at the chromium Playwright just installed, then:
//   npx lighthouse@12 http://localhost:3010/work/prep --chrome-flags="--headless=new"
//     --only-categories=performance,accessibility,best-practices,seo

import { chromium } from "@playwright/test";
import fs from "node:fs";
const AXE = fs.readFileSync("node_modules/axe-core/axe.min.js", "utf8");
const BASE = process.env.QA_BASE ?? "http://localhost:3010";
const PAGES = (process.env.QA_PAGES ?? "/,/work/prep,/work/devlinks,/notes,/notes/similarity-floor,/notes/e2e-suite-spent-real-calls,/notes/allowed-to-say-behind").split(",");
// The tours are standalone documents inside iframes, and axe does not cross an
// iframe boundary — the pages above report 0 while the tour inside them is
// serving violations. So each tour document is also audited directly. Phase 4
// found four that way: a missing lang on all four files, and three scrollable
// regions with no keyboard access.
const TOURS = (process.env.QA_TOURS ??
  "prep-in-motion,prep-under-the-hood,devlinks-in-motion,devlinks-trace").split(",");
const browser = await chromium.launch();
let failures = 0;

for (const path of PAGES) {
  console.log(`\n═══ ${path} ═══`);
  for (const [label, opts] of [
    ["desktop light", { viewport: { width: 1280, height: 900 }, colorScheme: "light" }],
    ["desktop dark", { viewport: { width: 1280, height: 900 }, colorScheme: "dark" }],
    ["mobile 320", { viewport: { width: 320, height: 640 }, colorScheme: "light" }],
    ["200% zoom", { viewport: { width: 640, height: 900 }, colorScheme: "light" }],
    ["reduced motion", { viewport: { width: 1280, height: 900 }, colorScheme: "dark", reducedMotion: "reduce" }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () =>
      await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }));
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1);
    failures += res.violations.length + (overflow ? 1 : 0);
    console.log(`  ${label.padEnd(15)} axe: ${res.violations.length}  h-scroll: ${overflow ? "FAIL" : "ok"}`);
    for (const v of res.violations) {
      console.log(`     ✗ [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 2)) console.log(`         ${n.target.join(" ")}`);
    }
    await ctx.close();
  }
}

// ---- The tour documents, audited inside their own frame ----
for (const slug of TOURS) {
  console.log(`\n═══ tour: ${slug} ═══`);
  for (const [label, opts] of [
    ["light", { viewport: { width: 1100, height: 900 }, colorScheme: "light" }],
    ["dark", { viewport: { width: 1100, height: 900 }, colorScheme: "dark" }],
    ["mobile 320", { viewport: { width: 320, height: 700 }, colorScheme: "light" }],
    ["reduced motion", { viewport: { width: 1100, height: 900 }, reducedMotion: "reduce" }],
  ]) {
    const ctx = await browser.newContext(opts);
    const page = await ctx.newPage();
    await page.goto(`${BASE}/tour/${slug}.html`, { waitUntil: "networkidle" });
    // Settle the entrance animations first. Contrast is a property of text as
    // presented; auditing 300ms into a fade-in measures the fade, not the text,
    // and reports colours no reader ever sees.
    await page.waitForTimeout(400);
    await page.evaluate(() => document.getElementById("playBtn")?.click());
    await page.evaluate(() => document.querySelectorAll(".scene *").forEach((el) =>
      el.getAnimations().forEach((a) => { try { a.finish(); } catch {} })));
    await page.waitForTimeout(150);
    await page.addScriptTag({ content: AXE });
    const res = await page.evaluate(async () =>
      await window.axe.run(document, { runOnly: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"] }));
    const overflow = await page.evaluate(() =>
      document.documentElement.scrollWidth > window.innerWidth + 1);
    failures += res.violations.length + (overflow ? 1 : 0);
    console.log(`  ${label.padEnd(15)} axe: ${res.violations.length}  h-scroll: ${overflow ? "FAIL" : "ok"}`);
    for (const v of res.violations) {
      console.log(`     ✗ [${v.impact}] ${v.id}: ${v.help}`);
      for (const n of v.nodes.slice(0, 2)) console.log(`         ${n.target.join(" ")}`);
    }
    await ctx.close();
  }
}

// ---- Reduced motion: once settled, nothing may still be moving ----
// axe does not test motion at all, so the reduced-motion passes above prove
// only that the page is accessible, not that it is still. Two checks per page
// and per tour document: no CSS/WAAPI animation still running with a real
// duration, and no script still rewriting the DOM (the tours' rAF driver would
// show up here as markup that differs two seconds apart).
console.log(`\n═══ reduced motion: still after settling ═══`);
{
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  const targets = [...PAGES.map((p) => [p, BASE + p]), ...TOURS.map((t) => [`tour: ${t}`, `${BASE}/tour/${t}.html`])];
  for (const [label, url] of targets) {
    await page.goto(url, { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const running = await page.evaluate(() => document.getAnimations().filter((a) =>
      a.playState === "running" && Number(a.effect?.getComputedTiming().duration ?? 0) > 1).length);
    const before = await page.evaluate(() => document.body.innerHTML);
    await page.waitForTimeout(2000);
    const changed = (await page.evaluate(() => document.body.innerHTML)) !== before;
    failures += running + (changed ? 1 : 0);
    console.log(`  ${label.padEnd(40)} running: ${running}  dom: ${changed ? "CHANGING" : "still"}`);
  }
  await ctx.close();
}

// Every provenance link on both pages must resolve.
const ctx = await browser.newContext();
const page = await ctx.newPage();
const seen = new Set();
for (const path of PAGES) {
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  for (const h of await page.$$eval("a[href^='http']", (as) => as.map((a) => a.href))) seen.add(h);
}
console.log(`\n═══ ${seen.size} external links ═══`);
for (const h of [...seen].sort()) {
  const r = await page.request.get(h, { maxRedirects: 5 }).catch(() => null);
  const code = r ? r.status() : "ERR";
  if (code !== 200) failures++;
  console.log(`  ${code}  ${h.replace("https://github.com/harshitsingh281125-stack/", "gh:")}`);
}
await ctx.close();
await browser.close();
console.log(`\nTOTAL FAILURES: ${failures}`);
process.exit(failures ? 1 : 0);
