/**
 * What happens to a URL a stranger typed — the one diagram on the DevLinks page.
 *
 * Same rules as the Prep diagram: hand-rolled SVG, no charting dependency,
 * structure drawn in ink, and saturated colour only on the two outcomes, which
 * are exactly the two things the endpoint actually reports back.
 *
 * The shape of the drawing is the argument. The validator is not a step near
 * the top of a pipeline — it is a loop the request re-enters on every redirect
 * hop, which is the whole reason the left-hand edge exists. A diagram that drew
 * validation once, at the entrance, would be drawing the bug.
 */

const BOX = "fill-[var(--panel)] stroke-[var(--border-strong)]";
const LINE = "stroke-[var(--border-strong)]";
const LABEL = "fill-[var(--content)] font-mono text-[13px]";
const SUB = "fill-[var(--content-faint)] font-mono text-[11px]";
const EDGE_LABEL = "fill-[var(--content-muted)] font-mono text-[11px]";

function Step({
  x,
  y,
  w = 310,
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

/** A test, not a step. Dashed, because the request may not come out the bottom. */
function Gate({ x, y, w = 310, label }: { x: number; y: number; w?: number; label: string }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={46}
        rx="7"
        className={BOX}
        strokeWidth="1"
        strokeDasharray="4 3"
      />
      <text x={x + 14} y={y + 28} className={LABEL}>
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      className={LINE}
      strokeWidth="1"
      markerEnd="url(#trace-arrow)"
    />
  );
}

export function MetadataTraceDiagram() {
  return (
    <figure className="mt-8">
      {/*
        A 720-unit drawing scaled into a 288px phone puts its 13px labels at
        about 5px, which is not a diagram any more. So below the width where it
        stays readable the figure scrolls sideways instead of shrinking further.

        The scroller is focusable on purpose: a region that only scrolls by
        drag is unreachable by keyboard, which axe reports as "scrollable
        region must have keyboard access". tabindex plus a name and a role
        makes it a real stop in the tab order that arrow keys can pan.
      */}
      <div
        tabIndex={0}
        role="group"
        aria-labelledby="trace-title"
        className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0"
      >
        <svg
          viewBox="0 0 720 630"
          role="img"
          aria-labelledby="trace-title trace-desc"
          className="h-auto w-full min-w-[34rem]"
        >
          <title id="trace-title">
            What the DevLinks metadata endpoint does to a URL before it fetches it
          </title>
          <desc id="trace-desc">
            A POST to the metadata endpoint carries a url string a stranger typed.
            The server parses it and rejects any scheme that is not http or https,
            then rejects localhost and any hostname ending in .local or .internal.
            It then resolves the hostname in DNS and inspects every A and AAAA
            record returned, not just the first. If any of those addresses is
            loopback, link-local, or inside a private range, the request ends with
            a 403 and a fetchStatus of blocked, and no outbound request is ever
            made. Only then does it fetch, with redirect handling set to manual so
            the runtime never follows a hop on its own. Every 3xx response sends
            the location header back into the same validator before the next
            request is made, so a public URL that redirects to an internal address
            is blocked on the hop rather than on the entrance. A response that is
            not a redirect is parsed for its title, description and image, tagged
            by the 84 deterministic rules, and returned as a 200.
          </desc>

          <defs>
            <marker
              id="trace-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" className="fill-[var(--border-strong)]" />
            </marker>
          </defs>

          <Step
            x={115}
            y={10}
            label="POST /api/metadata"
            sub="body.url — a string a stranger typed"
          />
          <Arrow x1={270} y1={66} x2={270} y2={96} />

          <Step
            x={115}
            y={100}
            label="new URL() · scheme allowlist"
            sub="http: and https: only"
          />
          <Arrow x1={270} y1={156} x2={270} y2={186} />

          <Step
            x={115}
            y={190}
            label="hostname denylist"
            sub="localhost &#183; *.local &#183; *.internal"
          />
          <Arrow x1={270} y1={246} x2={270} y2={276} />

          {/* The step the whole design turns on: resolve first, judge the answer. */}
          <Step
            x={115}
            y={280}
            label="dns.lookup(host, { all: true })"
            sub="every A and AAAA record, not just one"
          />
          <Arrow x1={270} y1={336} x2={270} y2={366} />

          <Gate x={115} y={370} label="any address private or loopback?" />

          {/* Refused. Nothing leaves the network. */}
          <Arrow x1={425} y1={393} x2={466} y2={393} />
          <text x={429} y={384} className={EDGE_LABEL}>
            yes
          </text>
          <g>
            <rect
              x={470}
              y={366}
              width={230}
              height={54}
              rx="7"
              className="fill-[var(--behind-soft)] stroke-[var(--behind)]"
              strokeWidth="1"
            />
            <text x={484} y={390} className="fill-[var(--behind)] font-mono text-[12px] font-medium">
              403 &#183; no request made
            </text>
            <text x={484} y={408} className="fill-[var(--behind)] font-mono text-[11px]">
              fetchStatus: &apos;blocked&apos;
            </text>
          </g>

          <Arrow x1={270} y1={416} x2={270} y2={456} />
          <text x={278} y={442} className={EDGE_LABEL}>
            no
          </text>

          <Step
            x={115}
            y={460}
            label="fetch(url, { redirect: 'manual' })"
            sub="the runtime never follows a hop by itself"
          />
          <Arrow x1={270} y1={516} x2={270} y2={546} />

          <Gate x={115} y={550} label="3xx? &#8594; back through the validator" />

          {/* The loop. A redirect is not a detail of the fetch; it is a new URL,
              and a new URL is an unvalidated one. */}
          <path
            d="M 115 573 L 70 573 L 70 308 L 111 308"
            fill="none"
            className={LINE}
            strokeWidth="1"
            markerEnd="url(#trace-arrow)"
          />
          <text x={24} y={434} className={EDGE_LABEL}>
            every hop
          </text>

          {/* Admitted. */}
          <Arrow x1={425} y1={573} x2={466} y2={573} />
          <text x={429} y={564} className={EDGE_LABEL}>
            no
          </text>
          <g>
            <rect
              x={470}
              y={546}
              width={230}
              height={54}
              rx="7"
              className="fill-[var(--verified-soft)] stroke-[var(--verified)]"
              strokeWidth="1"
            />
            <text
              x={484}
              y={570}
              className="fill-[var(--verified)] font-mono text-[12px] font-medium"
            >
              200 &#183; parse &#183; 84 tag rules
            </text>
            <text x={484} y={588} className="fill-[var(--verified)] font-mono text-[11px]">
              og:title, description, image
            </text>
          </g>
        </svg>
      </div>

      <figcaption className="mt-3 font-mono text-meta text-content-faint">
        The left-hand edge is the point: the validator is a loop, not an
        entrance. A hop is a URL nobody has checked yet.
      </figcaption>
    </figure>
  );
}
