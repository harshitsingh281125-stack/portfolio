// Card thumbnails for the home page (PLAN.md §3.1), cut from the tours' own
// scenes so the picture on a card is the product as the tour shows it, not a
// mock drawn for the card. Rerun whenever a tour scene changes:
//
//   npm run build && npx next start -p 3010 &
//   npm i --no-save @playwright/test && npx playwright install chromium
//   node scripts/thumbs.mjs
//
// Reduced motion renders every scene stacked and settled, so each one can be
// shot as a still element without racing the tour's clock.

import { chromium } from "@playwright/test";

const BASE = process.env.QA_BASE ?? "http://localhost:3010";
const SHOTS = [
  { out: "prep", tour: "prep-in-motion", scene: "PROGRESS" },
  { out: "devlinks", tour: "devlinks-in-motion", scene: "PUBLISH" },
];

// Headless Chromium defaults to full hinting, which snaps glyph advances to
// whole pixels and bakes uneven letter spacing into the still.
const browser = await chromium.launch({ args: ["--font-render-hinting=none"] });
for (const { out, tour, scene } of SHOTS) {
  for (const scheme of ["light", "dark"]) {
    const ctx = await browser.newContext({
      viewport: { width: 900, height: 1200 },
      deviceScaleFactor: 1.25, // ~1070px: 2x for a ~430px card, and no more
      colorScheme: scheme,
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    await page.goto(`${BASE}/tour/${tour}.html`, { waitUntil: "networkidle" });
    const el = page.locator(`.scene[data-label="${scene}"]`);
    // The caption sits under each scene in static mode; the card has its own words.
    await page.addStyleTag({ content: ".scene-caption{display:none!important}" });
    // Both scenes were picked for being ~2:1 at this width (PROGRESS 2.06,
    // PUBLISH 2.08), the frame ProjectCard shows them in. Clipped to the
    // scene's own box, so a short scene never spills into the next one.
    const box = await el.boundingBox();
    await page.screenshot({
      path: `public/work/${out}-${scheme}.jpg`,
      type: "jpeg",
      fullPage: true,
      quality: 82,
      clip: { x: box.x, y: box.y, width: box.width, height: Math.min(box.height, Math.round(box.width / 2)) },
    });
    console.log(`public/work/${out}-${scheme}.jpg`);
    await ctx.close();
  }
}
await browser.close();
