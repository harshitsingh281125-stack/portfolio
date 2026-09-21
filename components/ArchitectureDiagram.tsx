/**
 * How a grounded answer is assembled — the one diagram on the Prep page.
 *
 * Hand-rolled SVG, no charting dependency (which is also Prep's own Rule 22).
 * It draws the path as built, not an idealised one: the floor is a gate with a
 * real number on it, and the two fallback rungs are drawn because they are
 * reachable — `source` comes back as 'rag' | 'ai' | 'seed' and the UI labels
 * which one answered.
 *
 * Colour follows the site rule: the structure is ink, and the only saturated
 * marks are the three outcomes, which are exactly the provenance the app itself
 * reports. Everything is currentColor or a token, so it inverts with the theme.
 */

const BOX = "fill-[var(--panel)] stroke-[var(--border-strong)]";
const LINE = "stroke-[var(--border-strong)]";
const LABEL = "fill-[var(--content)] font-mono text-[13px]";
const SUB = "fill-[var(--content-faint)] font-mono text-[11px]";
const EDGE_LABEL = "fill-[var(--content-muted)] font-mono text-[11px]";

function Step({
  x,
  y,
  w = 300,
  h = 56,
  label,
  sub,
}: {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sub?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="7" className={BOX} strokeWidth="1" />
      <text x={x + 14} y={y + (sub ? 24 : 33)} className={LABEL}>
        {label}
      </text>
      {sub ? (
        <text x={x + 14} y={y + 42} className={SUB}>
          {sub}
        </text>
      ) : null}
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} className={LINE} strokeWidth="1" markerEnd="url(#arrow)" />;
}

export function ArchitectureDiagram() {
  return (
    <figure className="mt-8">
      {/* Scrolls sideways below 34rem instead of shrinking its labels to ~5px;
          focusable so a keyboard can pan it. Same treatment, and the same
          reasoning, as MetadataTraceDiagram (PLAN.md §6b, B1). */}
      <div
        tabIndex={0}
        role="group"
        aria-labelledby="arch-title"
        className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        <svg
          viewBox="0 0 700 600"
          role="img"
          aria-labelledby="arch-title arch-desc"
          className="h-auto w-full min-w-[34rem]"
        >
          <title id="arch-title">
            How a grounded topic answer is assembled in Prep
          </title>
          <desc id="arch-desc">
            The topic name and its week title become a query string, which the AI
            gateway embeds as a 1536-dimension vector. A Postgres function,
            match_resources, runs a cosine search over the 202-document corpus and
            keeps only rows scoring at or above 0.64. On a hit, the reasoning tier
            is given those documents numbered, and its schema can return only a
            1-based reference and a reason — never a URL. The validator resolves
            that reference back to the original row, so the rendered link is
            always one of ours, labelled rag. On a miss, the answer falls back to
            ungrounded generation labelled ai and flagged unverified, and if that
            fails twice, to a seeded template labelled seed.
          </desc>

          <defs>
            <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-[var(--border-strong)]" />
            </marker>
          </defs>

          <Step x={20} y={10} w={320} label="topic name + week title" sub="lib/rag/query.ts — pure, unit-tested" />
          <Arrow x1={180} y1={66} x2={180} y2={96} />

          <Step x={20} y={100} w={320} label="gateway.embed({ purpose: 'query' })" sub="1536-d vector · metered like any call" />
          <Arrow x1={180} y1={156} x2={180} y2={186} />

          <Step x={20} y={190} w={320} label="match_resources()" sub="cosine top-k over 202 vetted documents" />
          <Arrow x1={180} y1={246} x2={180} y2={276} />

          {/* The gate. The floor is what makes "we have nothing" expressible. */}
          <g>
            <rect x={20} y={280} width={320} height={46} rx="7" className={BOX} strokeWidth="1" strokeDasharray="4 3" />
            <text x={34} y={308} className={LABEL}>
              similarity &#8805; 0.64 ?
            </text>
          </g>

          <Arrow x1={180} y1={326} x2={180} y2={366} />
          <text x={188} y={352} className={EDGE_LABEL}>hit</text>

          {/* Miss path, to the right. */}
          <Arrow x1={340} y1={303} x2={392} y2={303} />
          <text x={344} y={294} className={EDGE_LABEL}>no hit</text>

          <Step x={396} y={276} w={284} label="ungrounded generation" sub="unverified: true" />
          <Arrow x1={538} y1={332} x2={538} y2={370} />
          <text x={546} y={357} className={EDGE_LABEL}>fails twice</text>
          <Step x={396} y={374} w={284} label="seeded template" sub="the last rung — always answers" />

          <Step x={20} y={370} w={320} label="complete({ tier: 'reasoning' })" sub="schema returns { ref, why } — no url field" />
          <Arrow x1={180} y1={426} x2={180} y2={456} />

          <Step x={20} y={460} w={320} label="validateGroundedDetail()" sub="resolves ref &#8594; our own row" />
          <Arrow x1={180} y1={516} x2={180} y2={546} />

          {/* The three outcomes, in the app's own provenance colours. */}
          <g>
            <rect x={20} y={550} width={320} height={34} rx="7" className="fill-[var(--verified-soft)] stroke-[var(--verified)]" strokeWidth="1" />
            <text x={34} y={572} className="fill-[var(--verified)] font-mono text-[12px] font-medium">
              source: &apos;rag&apos; &#183; link is one of ours
            </text>
          </g>
          <g>
            <rect x={396} y={466} width={284} height={34} rx="7" className="fill-[var(--unverified-soft)] stroke-[var(--unverified)]" strokeWidth="1" />
            <text x={410} y={488} className="fill-[var(--unverified)] font-mono text-[12px] font-medium">
              source: &apos;ai&apos; | &apos;seed&apos; &#183; flagged
            </text>
          </g>
          <Arrow x1={538} y1={430} x2={538} y2={462} />

        </svg>
      </div>

      <figcaption className="mt-3 font-mono text-meta text-content-faint">
        The path as built. Three rungs, each labelled in the response — the UI
        says which one answered.
      </figcaption>
    </figure>
  );
}
