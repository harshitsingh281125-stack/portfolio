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
const PAGES = (process.env.QA_PAGES ?? "/,/work/prep").split(",");
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
