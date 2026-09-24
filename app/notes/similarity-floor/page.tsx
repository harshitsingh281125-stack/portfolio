import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout, Output } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("similarity-floor")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>Prep retrieves study resources from a curated corpus before asking a model to select documents by index. Retrieval needs to return nothing when the corpus does not cover a topic; otherwise even an unrelated query gets a list of real but unhelpful links.</P>
      <Section id="intuition" heading="Testing the initial threshold">
        <P>I initially chose a cosine-similarity threshold of <Code>0.55</Code>. A probe against the original 48-document frontend corpus showed why that was too low.</P>
        <Output label="Recorded probe output · 13 August 2026 · 48-document corpus">
{`in-domain   "Reconciliation & keys"            0.761 … 0.642
            "Event loop & microtasks"          0.749 … 0.688
off-domain  "Postgres query planner internals" 0.568 … 0.562
            "Kafka consumer group rebalancing" 0.560 … 0.544
            "Kubernetes pod autoscaling"       0.555 … 0.534`}
        </Output>
        <P>The Postgres query would have passed despite matching frontend documentation. I raised the threshold to <Code>0.62</Code>, above the off-topic scores observed in this probe and below the relevant matches shown here.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "memory.md?plain=1", "L1006-L1035")} source="Development log · original retrieval probe" /></p>
      </Section>
      <Section id="margin" heading="Rechecking after the corpus expanded">
        <P>At 202 documents, an off-topic query reached <Code>0.616</Code>: SwiftUI view lifecycle matched React documentation about effect lifecycles. I increased the threshold to <Code>0.64</Code>.</P>
        <P>In the recorded calibration run over 189 roadmap topics, 182 retained at least two retrieved documents, six retained one, and one had none. This measured retrieval coverage on that sample; it was not a human evaluation of relevance or generated-answer accuracy.</P>
        <P>The development log also records missing and thin coverage as roadmaps expanded into backend and DSA topics. Coverage depends on the sampled topics and the corpus version, so I would rerun both retrieval and coverage probes before using these historical counts to describe the current application.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "memory.md?plain=1", "L108-L144")} source="Development log · calibration and coverage" /></p>
      </Section>
      <Section id="probe" heading="Fixing the measurement harness">
        <P>After adding database documentation, the probe treated a good Postgres match as a failure: Postgres was still in its off-topic fixtures. I updated those fixtures to reflect the expanded corpus.</P>
        <P>Another run hit provider rate limits. All embeddings failed, but the accumulators retained their initial values and the script reported a pass. It now requires measurements on both sides before reporting a result.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "scripts/probe-retrieval.ts")} source="Retrieval probe and measurement checks" /></p>
      </Section>
      <Section id="takeaway" heading="What I would measure next">
        <P>The threshold is a configuration choice for this embedding setup and corpus. A broader evaluation should include labeled relevant and irrelevant document pairs, held-out topics, and a separate check of whether the generated answer is supported by its sources.</P>
      </Section>
    </NoteLayout>
  );
}
