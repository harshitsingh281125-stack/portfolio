/**
 * The four tours (PLAN.md §3.4).
 *
 * Each is a standalone HTML document under public/tour/, not a React
 * component, and that is deliberate. They carry ~70KB of bespoke keyframe CSS
 * and a hand-written rAF driver that already handles reduced motion and the
 * keyboard; porting that to JSX would risk the one orchestrated moment on the
 * site (§1.5) for nothing a visitor could see. Their scene markup also uses
 * flat class names — .card, .chip, .step — which would collide with the rest
 * of the site the moment they shared a document. An iframe gives them a real
 * style boundary rather than a naming convention.
 */

export type Tour = {
  slug: string;
  /** Which case study embeds it, and whose card links to it. */
  project: "prep" | "devlinks";
  title: string;
  /** One line, used under the embed and as the page description. */
  blurb: string;
  /** Accessible name for the iframe. Screen readers announce this. */
  frameTitle: string;
  /**
   * Measured, not guessed: the tallest scene of that tour at each width,
   * found by stepping through every scene and reading the wrapper's bottom
   * edge. The first pass on these was estimated from the stage height and
   * clipped the pause button off the bottom of the embed — a fixed-height
   * iframe fails silently, so the number has to come from the page.
   * Rounded up, because an iframe that is slightly too tall shows a little
   * blank panel and one that is slightly too short eats a control.
   */
  height: number;
  mobileHeight: number;
  /**
   * Under prefers-reduced-motion the tour renders every scene stacked and
   * settled (§1.5), which runs two to five times taller. These apply only on
   * the tour's own route — a case-study page drops the embed entirely and
   * links here instead, rather than putting a 6000px document inside a frame.
   *
   * Measured at the narrowest supported width (320px viewport, 286px frame),
   * because the stacked layout gets taller as it gets narrower and the first
   * pass, measured at 380px, was short by up to 454px. Too tall costs a strip
   * of empty panel; too short silently hides the end of the tour.
   */
  reducedHeight: number;
  reducedMobileHeight: number;
};

export const tours: Tour[] = [
  {
    slug: "prep-in-motion",
    project: "prep",
    title: "Prep in motion",
    blurb:
      "Six scenes, about fifty seconds: the problem, the roadmap, how a topic is marked mastered, the recall ladder, the honest dashboard, and what is underneath.",
    frameTitle: "Prep in motion — a six-scene guided tour of the product",
    height: 850,
    mobileHeight: 975,
    reducedHeight: 2560,
    reducedMobileHeight: 4980,
  },
  {
    slug: "prep-under-the-hood",
    project: "prep",
    title: "Prep under the hood",
    blurb:
      "The same product as a request trace: sign-in, roadmap generation, grounded content, and revision — client on the left, server call stack on the right.",
    frameTitle: "Prep under the hood — a four-step request trace",
    height: 1070,
    mobileHeight: 1375,
    reducedHeight: 3320,
    reducedMobileHeight: 6600,
  },
  {
    slug: "devlinks-in-motion",
    project: "devlinks",
    title: "DevLinks in motion",
    blurb:
      "Paste a URL and watch what is derived from it: the parsed preview, the rule-inferred tags, the duplicate the database catches, and the collection anyone can read.",
    frameTitle: "DevLinks in motion — a five-scene guided tour of the product",
    height: 850,
    mobileHeight: 940,
    reducedHeight: 2200,
    reducedMobileHeight: 3940,
  },
  {
    slug: "devlinks-trace",
    project: "devlinks",
    title: "DevLinks — the request trace",
    blurb:
      "What happens to a URL a stranger typed: the scheme allowlist, DNS resolved and judged, a private range refused, a redirect hop re-validated, and the unique constraint answering the duplicate.",
    frameTitle:
      "DevLinks request trace — five steps from POST to the database conflict",
    height: 1010,
    mobileHeight: 1100,
    reducedHeight: 2390,
    reducedMobileHeight: 4330,
  },
];

export function tourBySlug(slug: string) {
  return tours.find((t) => t.slug === slug);
}

export function toursFor(project: Tour["project"]) {
  return tours.filter((t) => t.project === project);
}
