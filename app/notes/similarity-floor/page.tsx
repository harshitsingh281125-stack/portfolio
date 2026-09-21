import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout, Output } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("similarity-floor")!;

export const metadata: Metadata = pageMeta({
  title: note.title,
  description: note.dek,
  path: `/notes/${note.slug}`,
  type: "article",
  publishedTime: note.date,
});

export default function SimilarityFloorNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>
        Prep grounds its study resources in a corpus of 202 documents I vetted
        by hand. For each topic in a roadmap it embeds the topic, pulls the
        nearest documents from pgvector, and asks the model to rank them. The
        model never supplies a URL; it points at one of ours by index.
      </P>
      <P>
        That only works if retrieval can come back empty. A plain top-k search
        always returns k rows, however unrelated they are, so a topic the corpus
        knows nothing about would still get five links. The similarity floor is
        what makes &ldquo;we have nothing for this&rdquo; possible, and an empty
        result is what sends a niche topic to the fallback, which says on screen
        that its links are unverified. The floor is the most important number
        in the pipeline, and I first picked it without measuring anything.
      </P>

      <Section id="intuition" heading="The number that sounded right">
        <P>
          I started at <Code>0.55</Code>. It sounds strict for a cosine
          similarity, and it is the value most tutorials use. Before trusting it
          I wrote a probe that embeds real queries with the real model and
          prints what each one would retrieve. The queries that mattered were the
          ones that <em>should</em> retrieve nothing:
        </P>
        <Output label="scripts/probe-retrieval.ts, 13 August, 48-document corpus">
{`in-domain   "Reconciliation & keys"            0.761 … 0.642
            "Event loop & microtasks"          0.749 … 0.688
OFF-domain  "Postgres query planner internals" 0.568 … 0.562   ← above 0.55
            "Kafka consumer group rebalancing" 0.560 … 0.544
            "Kubernetes pod autoscaling"       0.555 … 0.534`}
        </Output>
        <P>
          Gemini&rsquo;s embeddings are not zero-centred. Two texts with nothing
          in common still score around 0.55, so &ldquo;similarity above a
          half&rdquo; carries no information with this model. At 0.55, a
          Postgres topic would have retrieved five frontend documents, grounded
          on them, and shown every one with a green VERIFIED chip. That is the
          failure the feature exists to remove, and it would have come back with
          the badge that says it was fixed. The links would all have been real,
          so nothing would have errored and no test would have gone red. They
          just would have had nothing to do with the topic.
        </P>
        <P>
          I raised the floor to <Code>0.62</Code>, above every off-domain score
          observed and below every relevant one, a margin of 0.052. The probe
          became a checked-in script that exits non-zero if any off-domain query
          clears the floor. Measuring only the queries you expect to pass tells
          you nothing about where the line goes.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "memory.md?plain=1", "L1006-L1035")}
            source="memory.md · 2026-08-13"
          />
        </p>
      </Section>

      <Section id="margin" heading="The margin shrank when the corpus grew">
        <P>
          Over the next day, in three migrations, the corpus grew from 48
          frontend documents to 202 across 26 areas: security, TypeScript,
          testing, databases, algorithms, distributed systems. I re-ran the probe. The best off-domain score had
          risen from 0.568 to <Code>0.616</Code>, leaving 0.62 with a margin of
          0.004.
        </P>
        <P>
          The query that got closest was &ldquo;SwiftUI view lifecycle&rdquo;,
          matched against react.dev&rsquo;s &ldquo;Lifecycle of Reactive
          Effects&rdquo;. That match is not absurd, and that is why it matters:
          the more a corpus covers, the more of the world sits genuinely next to
          something in it. I raised the floor to <Code>0.64</Code>, a margin of
          0.024.
        </P>
        <P>
          A higher floor removes good matches as well as bad ones, so I measured
          that cost rather than assuming it. Across 189 real roadmap topics, 182
          still ground on two or more documents, 6 drop to one, and 1 drops to
          none. The matches it removed were fifth-place tails, like
          &ldquo;debounce / throttle&rdquo; matching AWS&rsquo;s article on
          backoff with jitter at 0.630. Those are exactly the weak links that
          would otherwise show a VERIFIED chip they had not earned.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "lib/ai/config.ts", "L106-L150")}
            source="lib/ai/config.ts"
          />
        </p>
      </Section>

      <Section id="probe" heading="The probe went stale too">
        <P>
          The probe failed twice in ways worth recording, and the floor was fine
          both times.
        </P>
        <P>
          First, after the corpus widened, it reported{" "}
          <Code>FLOOR IS TOO LOW: raise it above 0.744</Code>. The 0.744 was
          &ldquo;Postgres query planner internals&rdquo; matching PostgreSQL&rsquo;s
          own page on <Code>EXPLAIN</Code>, which is a perfect result. Postgres
          had been off-domain for a frontend corpus, and I had just brought it
          in scope on purpose. The fixture was wrong, not the floor. I replaced
          the off-domain list with topics from neighbouring disciplines the
          corpus has no reason to cover, such as Rust lifetimes, Unity shaders
          and embedded interrupt handlers, so the next expansion is unlikely to
          invalidate them. A calibration harness encodes an assumption about
          scope, so it is part of the thing being changed. When a system&rsquo;s
          coverage widens, the tests that assert what it does <em>not</em> cover
          are the first to go stale.
        </P>
        <P>
          Second, on a run where the provider was rate-limiting, every embedding
          failed, and the probe printed{" "}
          <Code>Floor 0.64 separates them. Margin: 0.640.</Code> and exited 0.
          Both accumulators had kept their starting values. The numbers came from
          a measurement that never ran. The script now refuses to report a pass
          unless it measured both sides.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "scripts/probe-retrieval.ts", "L171-L195")}
            source="scripts/probe-retrieval.ts"
          />
        </p>
      </Section>

      <Section id="takeaway" heading="What the number actually is">
        <P>
          A threshold on embedding similarity is not a property of the model. It
          is a property of the model and the corpus together, so it moves when
          either one moves. That is why it lives in a script that fails instead
          of in a comment: any change to the corpus is also a change to the
          floor, and it needs a re-run to prove the floor still holds.
        </P>
      </Section>
    </NoteLayout>
  );
}
