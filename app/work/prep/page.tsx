import type { Metadata } from "next";
import { CaseStudy, Code, P, Section } from "@/components/CaseStudy";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Claim, Decision, ProvenanceBadge } from "@/components/Provenance";
import { TourEmbed } from "@/components/TourEmbed";
import Link from "next/link";
import { toursFor } from "@/lib/tours";
import { blob, demoLogins, demos, repos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Prep",
  description:
    "An AI-native learning OS where a hallucinated citation is not rejected — it is unrepresentable.",
};

const [inMotion, underTheHood] = toursFor("prep");

const rail = [
  { id: "d-ladder", name: "Not textbook SM-2" },
  { id: "d-derived", name: "Derived on read" },
  { id: "d-tiers", name: "Tiers, not models" },
  { id: "d-citation", name: "Citation by index" },
];

const LINK =
  "text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content";

export default function PrepCaseStudy() {
  return (
    <CaseStudy
      title="Prep"
      standfirst="An AI-native learning OS that generates a study roadmap, schedules recall, and will not show you a link it cannot trace back to a document it already had."
      rail={rail}
    >
      <Section id="problem" heading="The problem">
        <P>
          Ask a model for study resources and some fraction of the URLs it hands
          back will not exist. That is the best-known failure of using an LLM as
          a study tool, and for this particular product it is fatal: a person
          working through a roadmap clicks the links. A dead link is not a
          cosmetic bug. It is the moment the tool stops being worth opening.
        </P>
        <P>
          So Prep is built around removing that failure rather than catching it.
          The model is never asked for a URL. It is given our own documents,
          numbered, and asked which ones to rank and why &mdash; and the schema
          it answers in has no field a URL could go in. The rest of the product
          follows the same instinct: prefer the design where the bad outcome
          cannot be expressed over the design where it has to be caught.
        </P>
        <P>
          It is a real application, not a demo: ten Postgres tables behind
          row-level security, seven auth-gated API routes, ten screens, a
          provider-agnostic AI gateway with failover, and a hand-written
          spaced-repetition scheduler.
        </P>
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          <Claim
            value="364"
            label="automated tests — 283 unit, 81 end-to-end"
            status="verified"
            href={`${repos.prep}/tree/main/tests`}
            source="tests/unit + tests/e2e"
          />
          <Claim
            value="202"
            label="hand-vetted documents across 26 topic areas"
            status="verified"
            href={`${repos.prep}/tree/main/supabase/migrations`}
            source="supabase/migrations"
          />
        </div>
      </Section>

      <Section id="tour" heading="The product, in about fifty seconds">
        <P>
          Before the argument: what the thing actually is. The stage below
          autoplays and can be paused at any point &mdash; and if your system
          asks for reduced motion, it renders every scene stacked and settled
          with no timers at all.
        </P>
        <TourEmbed tour={inMotion} />
      </Section>

      <Section id="decisions" heading="The decisions">
        <P>
          Four choices carry this product. Each one links to the file where it
          lives, because a decision you cannot check is a decision you are being
          asked to take on faith.
        </P>
      </Section>

      <Decision
        id="d-ladder"
        name="Not textbook SM-2"
        rule="RULE 14"
        chose="a fixed 1 / 4 / 14 / 30-day ladder, with ease nudging each rung"
        over="textbook SM-2's ease-derived 1 / 6 / 15 / 38"
        because={
          <>
            The Recall screen advertises +1, +4, +14, +30. SM&#8209;2&rsquo;s
            intervals contradict the promise on screen, and Prep&rsquo;s binary{" "}
            <em>Got it / Missed</em> collapses SM&#8209;2&rsquo;s 0&ndash;5
            quality input to two cases anyway.
          </>
        }
        href={blob("prep", "lib/recall/scheduler.ts", "L25-L35")}
        source="lib/recall/scheduler.ts"
      >
        <P>
          What survives from SM&#8209;2 is the part that makes it work:{" "}
          <Code>ease</Code> still moves &plusmn;0.1 per grade and the penalty for
          a miss <em>persists</em> through the reset, so a card that keeps being
          hard for you climbs the same ladder more slowly the next time round.
          Past the top rung there is no ladder left and it switches to
          multiplicative growth. Calling it SM&#8209;2 would have been easier and
          would have been a lie.
        </P>
      </Decision>

      <Decision
        id="d-derived"
        name="Derived on read"
        rule="RULE 19"
        chose="deriveStatus(), computed from rows on every read"
        over="the roadmaps.status column that already exists"
        because={
          <>
            A stored status is a lie the moment time passes without a write. A
            roadmap would only decay into <Code>stalled</Code> when you touched
            it, which is precisely backwards &mdash; the whole point is that it
            went quiet while you were not there.
          </>
        }
        href={blob("prep", "lib/progress/compute.ts", "L179-L184")}
        source="lib/progress/compute.ts"
      >
        <P>
          Pace is measured in <em>whole elapsed weeks</em>, not a continuous
          fraction. The plan is authored in week-sized blocks, so a person is a
          week behind, never 0.42 weeks behind &mdash; and prorating by the hour
          would declare you behind pace a few hours after creating a roadmap,
          which is both useless and demoralising. A fresh roadmap expects zero
          hours and therefore cannot be behind on day one.
        </P>
      </Decision>

      <Decision
        id="d-tiers"
        name="Tiers, not models"
        rule="RULE 8"
        chose="tier: 'reasoning' at every call site, one file that names a model"
        over="model ids scattered through product code"
        because={
          <>
            The counterintuitive part is which way round they go: the
            pricier-per-token model sits on the <em>rare</em> call and the cheap
            one on the frequent call. Cost follows call volume, not perceived
            importance.
          </>
        }
        href={blob("prep", "lib/ai/config.ts", "L13-L24")}
        source="lib/ai/config.ts"
      >
        <P>
          Roadmap generation is capped at three per user and is the output the
          whole product is judged on, so it gets the better model. Recall-card
          generation runs for every topic of every roadmap, so it gets the cheap
          one. Because no feature code names a model, adding a second provider
          for failover was an adapter and a map, not a refactor &mdash; if a
          model string appears anywhere outside that one file, it is a bug.
        </P>
      </Decision>

      <Decision
        id="d-citation"
        name="Citation by index"
        rule="RULE 9"
        chose="ref: a 1-based index into the documents we supplied"
        over="asking the model for a title and a URL, then validating them"
        because={
          <>
            The model is never asked for a source &mdash; only for which of{" "}
            <em>our</em> documents to rank, and why. A hallucinated citation is
            not rejected by validation. It is not expressible. The only thing
            left to check is that an integer is in range.
          </>
        }
        href={blob("prep", "lib/ai/validate.ts", "L293-L311")}
        source="lib/ai/validate.ts"
      >
        <P>
          Two numbers underneath it were measured rather than chosen. The
          similarity floor is <Code>0.64</Code> because at 0.55 an off-domain
          probe &mdash; &ldquo;Postgres query planner internals&rdquo; against a
          frontend corpus &mdash; scored <Code>0.568</Code> and would have been
          served as a grounded, badged result. Gemini embeddings are not
          zero-centred, so &ldquo;cosine similarity above a half&rdquo; means
          nothing here.
        </P>
        <P>
          And the column is <Code>vector(1536)</Code>, not the model&rsquo;s
          native 3072, because pgvector cannot build an HNSW or IVFFlat index on
          a vector wider than 2000 dimensions. At 3072 the corpus search would
          have been a sequential scan forever. 1536 is a Matryoshka truncation of
          the same embedding, so the leading dimensions still carry the signal.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "supabase/migrations/0007_resources.sql", "L16-L29")}
            source="0007_resources.sql"
          />
        </p>
      </Decision>

      <Section id="architecture" heading="How a grounded answer is assembled">
        <P>
          The floor is the interesting part of this diagram. A plain top-k search
          always returns k rows however irrelevant they are, so the floor is what
          makes &ldquo;we have nothing for this topic&rdquo; expressible &mdash;
          and therefore what makes the fallback reachable at all. When it is not
          cleared, the answer degrades in public: the response carries{" "}
          <Code>source: &apos;ai&apos;</Code>, the resources are flagged{" "}
          <Code>unverified</Code>, and the screen says so.
        </P>
        <ArchitectureDiagram />
        <TourEmbed tour={underTheHood} />
      </Section>

      <Section id="differently" heading="What I&rsquo;d do differently">
        <P>
          My end-to-end suite spent 26 real Gemini calls and reported green.
        </P>
        <P>
          <Code>playwright.config.ts</Code> set <Code>AI_PROVIDER=mock</Code> on
          its <Code>webServer.env</Code> &mdash; but it also had{" "}
          <Code>reuseExistingServer: true</Code> and defaulted to port 3001, the
          dev port. So whenever I already had <Code>npm run dev</Code> running,
          which is most of the time, Playwright quietly reused <em>that</em>{" "}
          server, the one holding the real API key, and the mock environment was
          never applied. Nothing failed. The suite was <em>more</em> green for
          being misconfigured, because a real provider answers a prompt at least
          as well as a fake one does.
        </P>
        <P>
          I found it because I noticed the token spend, then confirmed it by
          grouping <Code>ai_usage</Code> by model: 24{" "}
          <Code>gemini-3.5-flash</Code> and 2{" "}
          <Code>gemini-3.5-flash-lite</Code> on the day of the first run. The fix
          is three things, because one was not enough &mdash; a dedicated port
          (3101) so the test server can never be the dev server,{" "}
          <Code>reuseExistingServer: false</Code>, and an{" "}
          <Code>assertMockProvider()</Code> guard in the setup of every spec that
          generates, which reads <Code>/api/usage</Code> and refuses to run if
          the provider is not the mock. A full run is now 43 mock dispatches and
          zero Gemini.
        </P>
        <P>
          The lesson is the part worth keeping: correctness of the result is not
          evidence of correctness of the setup. A test that costs money when it
          is misconfigured has to fail loudly on the misconfiguration, because it
          will not fail on the assertion.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "playwright.config.ts", "L11-L17")}
            source="playwright.config.ts"
          />
        </p>
        <P>
          Second, smaller, and still true today: <Code>roadmaps.status</Code> and{" "}
          <Code>roadmaps.hours_logged</Code> are still in the schema, sitting at
          their defaults, read by nothing. Deriving on read was right; leaving
          the columns behind was laziness about writing one more migration, and
          the next person to read that schema will reasonably assume they mean
          something.
        </P>
      </Section>

      <Section id="links" heading="Links">
        <ul className="mt-4 flex flex-col gap-2 text-ui">
          <li>
            <a href={repos.prep} className={LINK} target="_blank" rel="noreferrer">
              Source on GitHub
            </a>
          </li>
          <li>
            <a href={demos.prep.url} className={LINK} target="_blank" rel="noreferrer">
              Live app
            </a>
            <span className="ml-2 font-mono text-meta text-content-faint [overflow-wrap:anywhere]">
              demo login &middot; {demoLogins.prep.email} &middot;{" "}
              {demoLogins.prep.password}
            </span>
          </li>
          <li>
            <a href={`${repos.prep}/blob/main/Rules.md`} className={LINK} target="_blank" rel="noreferrer">
              The numbered rules the RULE tags point at
            </a>
          </li>
          <li>
            <Link href="/notes" className={LINK}>
              Three notes: the similarity floor, the 26 calls, and the pace model
            </Link>
          </li>
          <li>
            <a href={`${repos.prep}/blob/main/Architecture.md`} className={LINK} target="_blank" rel="noreferrer">
              Architecture, in full
            </a>
          </li>
        </ul>
      </Section>
    </CaseStudy>
  );
}
