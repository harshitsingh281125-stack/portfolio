import type { Metadata } from "next";
import { CaseStudy, Code, P, Section } from "@/components/CaseStudy";
import { MetadataTraceDiagram } from "@/components/MetadataTraceDiagram";
import { Claim, Decision, ProvenanceBadge } from "@/components/Provenance";
import { TourEmbed } from "@/components/TourEmbed";
import { toursFor } from "@/lib/tours";
import { blob, demos, repos } from "@/lib/site";
import { pageMeta } from "@/lib/meta";

export const metadata: Metadata = pageMeta({
  title: "DevLinks",
  description:
    "A bookmark manager whose hard part is the server: it fetches URLs a stranger typed, which makes it an SSRF engine pointed at your own network.",
  path: "/work/devlinks",
  type: "article",
});

const [inMotion, trace] = toursFor("devlinks");

const rail = [
  { id: "d-ssrf", name: "Validate every hop" },
  { id: "d-normalize", name: "Normalize in the database" },
  { id: "d-rules", name: "Regexes, not a model" },
];

const LINK =
  "text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content";

export default function DevLinksCaseStudy() {
  return (
    <CaseStudy
      title="DevLinks"
      standfirst="A bookmark manager is a CRUD tutorial until you notice what the save button does: it hands a URL a stranger typed to a server on your own network, and asks it to go fetch."
      rail={rail}
    >
      <Section id="problem" heading="The problem">
        <P>
          The feature is one line of a product spec. Paste a link, get back a
          title, a description, an image and some tags, so the saved bookmark is
          something you can recognise later instead of a bare URL.
        </P>
        <P>
          The implementation is a server-side request forgery engine with a text
          input on the front of it. My server is inside a network. It can reach
          things the person typing cannot: the cloud metadata service on a
          link-local address, anything bound to loopback, anything on a private
          range. A URL is an instruction to go make a request, and the endpoint
          takes that instruction from anyone.
        </P>
        <P>
          So the interesting part of this project is not the bookmarks. It is the
          forty lines that decide whether the fetch is allowed to happen at all,
          and the one structural choice inside them that most implementations get
          wrong.
        </P>
        <div className="mt-8 flex flex-wrap gap-x-12 gap-y-6">
          <Claim
            value="84"
            label="deterministic tagging rules — no model call in the path"
            status="verified"
            href={blob("devlinks", "src/server/taggingRules.ts", "L191-L297")}
            source="src/server/taggingRules.ts"
          />
          <Claim
            value="596"
            label="unit tests — 259 of them assert the tag table"
            status="verified"
            href={`${repos.devlinks}/tree/main/src`}
            source="vitest run"
          />
        </div>
        <P>
          That second number is stated the way it is on purpose. 596 tests looks
          like diligence until you ask what they cover, and the honest answer is
          that 259 of them are table assertions over the 84 tagging rules &mdash;
          a lookup table with a lot of cases, not a hard problem. Quoting the
          596 and stopping would be the kind of claim this site exists to refuse.
        </P>
      </Section>

      <Section id="tour" heading="Saving a link, end to end">
        <P>
          The product first, briefly, so the rest of this page has something to
          be about. It autoplays, it pauses, and under reduced motion it renders
          as five stacked panels with no clock running.
        </P>
        <TourEmbed tour={inMotion} />
      </Section>

      <Section id="decisions" heading="The decisions">
        <P>
          Three choices carry this product. Each one links to the file where it
          lives, because a decision you cannot check is a decision you are being
          asked to take on faith.
        </P>
      </Section>

      <Decision
        id="d-ssrf"
        name="Validate every hop"
        chose="re-enter the same validator on every redirect, with redirect: 'manual'"
        over="validating the URL once and letting fetch follow the chain"
        because={
          <>
            The address a user hands you is not the address you end up
            requesting. A hostname that resolves publicly can answer{" "}
            <Code>302 Location: http://169.254.169.254/</Code>, and a fetch left
            on its default <Code>follow</Code> will take that hop without asking
            anyone. The check has to sit on every request, not on the input.
          </>
        }
        href={blob("devlinks", "src/server/metadata.ts", "L204-L226")}
        source="src/server/metadata.ts"
      >
        <P>
          The other half is what &ldquo;validate&rdquo; means. A string check
          against <Code>localhost</Code> and a private-range regex over the
          hostname is theatre &mdash; the attacker controls DNS, so{" "}
          <Code>a.example.com</Code> can simply resolve to <Code>10.0.0.1</Code>.
          So the hostname is resolved first and the <em>answer</em> is what gets
          judged, with <Code>{`{ all: true }`}</Code> so every A and AAAA record
          is inspected rather than whichever one the resolver happened to put
          first. A host with one public address and one private one does not get
          through on a coin flip.
        </P>
        <P>
          The redirect loop then calls that same function, rather than a cheaper
          copy of it &mdash; which is the part I would defend hardest. Two
          validators that are supposed to agree are two validators that will
          eventually disagree, and the one on the quieter path is the one that
          will be missing a case.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("devlinks", "src/server/metadata.ts", "L140-L183")}
            source="validateUrlString"
          />
        </p>
      </Decision>

      <Decision
        id="d-normalize"
        name="Normalize in the database"
        chose="an immutable SQL function on a trigger, writing the column the unique constraint covers"
        over="canonicalizing in the client and trusting what it sends"
        because={
          <>
            The key a constraint is enforced on should be computed by the engine
            that enforces it. If the client owns normalization, then every
            client &mdash; the app, a script, a future mobile build, a{" "}
            <Code>psql</Code> session &mdash; owns a chance to disagree, and
            uniqueness quietly becomes a suggestion.
          </>
        }
        href={blob("devlinks", "supabase/migrations/20260413_000002_helpers_and_indexes.sql", "L11-L32")}
        source="normalize_bookmark_url()"
      >
        <P>
          <Code>normalize_bookmark_url()</Code> lowercases, drops the scheme,
          drops a <Code>www</Code> prefix, drops the query and fragment, drops
          trailing slashes. A <Code>before insert or update</Code> trigger writes
          the result into <Code>normalized_url</Code> on every write, and{" "}
          <Code>unique (user_id, normalized_url)</Code> does the rest. The row
          cannot be inserted with a normalization the database did not compute,
          because the trigger overwrites whatever was sent.
        </P>
        <P>
          Which leaves the question of what the user sees. A unique violation
          arrives as Postgres error <Code>23505</Code>, and the naive handling is
          to surface it as &ldquo;could not save&rdquo; &mdash; technically true
          and useless, because the person saving a link they already have wants
          to be shown the one they already have. So the mutation catches{" "}
          <Code>23505</Code> specifically, re-queries on the same normalized key,
          and returns <Code>{`{ kind: 'duplicate', existing }`}</Code> as a
          success shape rather than an error. The list is not invalidated on that
          path, because nothing was created.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("devlinks", "src/features/bookmarks/bookmarksApi.ts", "L186-L217")}
            source="bookmarksApi.ts — the 23505 path"
          />
        </p>
      </Decision>

      <Decision
        id="d-rules"
        name="Regexes, not a model"
        chose="84 regexes and a hostname table, run in the same request as the fetch"
        over="asking a model to tag the page"
        because={
          <>
            Tagging runs on every save, which is the frequent call. A model here
            would add a second network round trip and a per-save cost to a
            feature whose job is to be invisible, and would make the same URL
            taggable differently on two different days.
          </>
        }
        href={blob("devlinks", "src/server/taggingRules.ts", "L299-L318")}
        source="inferSuggestedTags()"
      >
        <P>
          It is the same instinct as Prep&rsquo;s tier split, pointed the other
          way: put the expensive machinery on the rare call, and keep the
          frequent one boring. Here the frequent call is every save, so it gets
          no inference at all. The rules are pure functions of hostname,
          pathname, title and description, which is why 259 tests could be
          written over them cheaply &mdash; and why they run in the same request
          as the metadata parse instead of a job queue.
        </P>
        <P>
          The honest limit: 84 regexes is a vocabulary, not an understanding.
          They match what I put in them and nothing else, so a link about a
          framework invented next year is tagged by its hostname or not at all.
          That is an acceptable failure for a suggestion the user can edit, and
          it would not be acceptable for anything the user could not.
        </P>
      </Decision>

      <Section id="architecture" heading="What happens before the fetch">
        <P>
          The shape is the argument. Drawn as a pipeline &mdash; validate, then
          fetch, then parse &mdash; the diagram would show the bug rather than
          the design, because it would put the check at the entrance. The check
          is a loop, and the left-hand edge is where a redirect hop goes back
          through it.
        </P>
        <MetadataTraceDiagram />
        <TourEmbed tour={trace} />
        <P>
          The blocked outcome matters as much as the allowed one: a rejection
          happens before any outbound request exists, and it comes back as{" "}
          <Code>403</Code> with <Code>fetchStatus: &apos;blocked&apos;</Code>, a
          distinct value from <Code>error</Code> and <Code>timeout</Code>. The UI
          can tell someone their link was refused on purpose rather than failing
          vaguely.
        </P>
      </Section>

      <Section id="differently" heading="What I&rsquo;d do differently">
        <P>
          The endpoint I just spent a page defending is unauthenticated and
          unthrottled.
        </P>
        <P>
          <Code>POST /api/metadata</Code> takes a URL from anyone who can reach
          it, with no session check and no rate limit, and makes an outbound
          request on my infrastructure and my bill. The SSRF work stops it being
          pointed at my network; it does nothing about it being pointed at
          someone else&rsquo;s, in volume, from my IP. Both fixes are small
          &mdash; require the Supabase session the rest of the app already has,
          and put a token bucket keyed on user id in front of it &mdash; and
          neither is written. Naming it is not a substitute for doing it, but
          defending the endpoint while omitting this would be the more
          embarrassing version of the same page.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("devlinks", "api/metadata.ts", "L15-L17")}
            source="api/metadata.ts — the whole handler"
          />
        </p>
        <P>
          Second, there is a gap between the check and the fetch that the design
          does not close. <Code>dns.lookup()</Code> resolves the hostname,
          and then <Code>fetch()</Code> resolves it again independently, so a
          resolver that answers with a public address and then a private one on
          the next query &mdash; DNS rebinding, on a short TTL &mdash; passes the
          gate and connects somewhere else. Closing it properly means pinning the
          connection to the address that was actually validated, which in Node
          means a custom agent or a socket-level hook, and on a serverless
          function is awkward enough that I left it. The SSRF guard is good
          against the ordinary case and beatable by someone who owns a
          nameserver, and I would rather write that sentence than let the diagram
          imply otherwise.
        </P>
        <P>
          Third, and least excusable, the normalization rule exists twice.{" "}
          <Code>canonicalizeUrl()</Code> in the client is a hand-translation of
          the SQL function, kept only so the app can re-query for the conflicting
          row after a <Code>23505</Code>. The comment above it says it mirrors the
          Postgres version, which is exactly the kind of comment that stops being
          true. The database already returns the row it rejected; the client
          should be reading the normalized value off the response instead of
          re-deriving it in a second language.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("devlinks", "src/features/bookmarks/bookmarksApi.ts", "L29-L41")}
            source="the duplicated rule"
          />
        </p>
        <P>
          Fourth: <Code>BookmarkList</Code> maps over every bookmark and renders
          all of them. At the sizes this has been used it is genuinely fine, and
          I am not going to claim a virtualized list I have not measured a need
          for &mdash; but the ceiling is real and it has no pagination underneath
          it either, so the failure mode is a slow page rather than a graceful
          one.
        </P>
      </Section>

      <Section id="links" heading="Links">
        <ul className="mt-4 flex flex-col gap-2 text-ui">
          <li>
            <a href={repos.devlinks} className={LINK} target="_blank" rel="noreferrer">
              Source on GitHub
            </a>
          </li>
          <li>
            <a
              href={`${demos.devlinks.url}${demos.devlinks.publicEntry}`}
              className={LINK}
              target="_blank"
              rel="noreferrer"
            >
              A published collection
            </a>
            <span className="ml-2 font-mono text-meta text-content-faint">
              no login &middot; public read path
            </span>
          </li>
          <li>
            <a href={demos.devlinks.url} className={LINK} target="_blank" rel="noreferrer">
              Live app
            </a>
            <span className="ml-2 font-mono text-meta text-content-faint">
              saving a link needs an account
            </span>
          </li>
          <li>
            <a
              href={`${repos.devlinks}/blob/main/README.md`}
              className={LINK}
              target="_blank"
              rel="noreferrer"
            >
              README, including the schema
            </a>
          </li>
        </ul>
      </Section>
    </CaseStudy>
  );
}
