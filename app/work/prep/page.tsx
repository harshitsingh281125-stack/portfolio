import type { Metadata } from "next";
import Link from "next/link";
import { CaseStudy, P, Section } from "@/components/CaseStudy";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Decision, ProvenanceBadge } from "@/components/Provenance";
import { blob, demoLogins, demos, repos } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { projectBySlug } from "@/lib/projects";

export const metadata: Metadata = pageMeta({
  title: "Prep",
  description: "Building an interview study planner with resource retrieval, provider fallback, and deterministic recall scheduling.",
  path: "/work/prep",
  type: "article",
});

const rail = [
  { id: "d-citation", name: "Resource retrieval" },
  { id: "d-tiers", name: "Provider fallback" },
  { id: "d-derived", name: "Progress tracking" },
  { id: "d-ladder", name: "Recall scheduling" },
  { id: "differently", name: "Testing & limitations" },
];
const LINK = "text-content underline underline-offset-2 decoration-edge-strong hover:decoration-content";

export default function PrepCaseStudy() {
  return (
    <CaseStudy
      title="Prep"
      standfirst="An interview study planner that turns a target role and available study time into a roadmap, then schedules recall and tracks progress."
      glance={{
        built: <>Personal project. I built the Next.js interface, authenticated API routes, Postgres schema and row-level policies, AI gateway, and tests.</>,
        hardest: <>Keeping resource links traceable while supporting topics outside the curated corpus and handling provider failures.</>,
        stack: projectBySlug("prep").stack,
        links: { demo: demos.prep.url, repo: repos.prep, tour: "/tour/prep-in-motion" },
        access: <>Demo account: {demoLogins.prep.email} / {demoLogins.prep.password}. Shared data may be empty; the illustrated walkthrough shows the study flow.</>,
      }}
      rail={rail}
    >
      <Section id="problem" heading="The study flow">
        <P>A learner chooses a role, timeline, weekly hours, and weak areas. Prep generates a weekly plan with exercises and completion criteria. Topics can have study resources and recall cards; the learner records study time and assesses their own recall.</P>
        <P>I implemented the full flow, including loading and fallback states, server-side roadmap limits, and a printable plan. Progress and print views share the same calculation functions.</P>
      </Section>

      <Decision
        id="d-citation"
        name="Keep resource URLs in the database"
        chose="document references resolved by the server"
        over="model-generated resource URLs"
        because={<>In the grounded path, the model selects numbered documents from retrieval results. The server checks each reference and reads its title and URL from the stored record.</>}
        href={blob("prep", "lib/ai/validate.ts")}
        source="Grounded resource validation"
      >
        <P>This prevents the model from inventing a resource URL in that path. It does not establish that a document supports every generated statement, or that its external URL will remain available.</P>
        <P>When retrieval cannot supply suitable documents, Prep can fall back to model-suggested titles. These are labeled unverified and open a web search for the title. A seeded fallback is available if generation also fails.</P>
        <P>I calibrated the retrieval threshold against relevant and off-topic queries, then rechecked it after expanding the corpus. <Link href="/notes/similarity-floor" className={LINK}>The retrieval note</Link> includes the recorded results and their limits.</P>
      </Decision>

      <Decision
        id="d-tiers"
        name="Separate features from AI providers"
        chose="capability tiers and provider adapters"
        over="model names in individual feature routes"
        because={<>Roadmap and recall generation have different cost and quality requirements. Central configuration lets me change their models without editing every call site.</>}
        href={blob("prep", "lib/ai/config.ts")}
        source="AI tier and provider configuration"
      >
        <P>The gateway accounts for usage and checks the daily cap before dispatch. A provider failover uses the same attempt budget as a retry. Completion failover does not cover embeddings: if embeddings are unavailable, retrieval can degrade to the unverified path.</P>
      </Decision>

      <Decision
        id="d-derived"
        name="Calculate progress when it is read"
        chose="status derived from study records and elapsed time"
        over="a stored status updated only by user actions"
        because={<>A plan can fall behind while its owner is away. Calculating status on read lets the dashboard reflect that without waiting for another study event.</>}
        href={blob("prep", "lib/progress/compute.ts")}
        source="Progress calculations"
      >
        <P>Pace uses whole elapsed weeks to match the weekly plan. Expected hours start at zero and stop growing at the plan total. A boundary test caught a floating-point comparison that marked an on-target learner as behind; the comparison now rounds to the same precision as logged hours.</P>
      </Decision>

      <Decision
        id="d-ladder"
        name="Use a predictable recall schedule"
        chose="a 1 / 4 / 14 / 30-day ladder, adjusted by ease"
        over="the standard SM-2 interval calculation"
        because={<>The interface presents those review intervals and uses two self-assessment choices: Got it and Missed. I adapted the scheduler to those inputs.</>}
        href={blob("prep", "lib/recall/scheduler.ts")}
        source="Recall scheduler"
      >
        <P>A miss resets the card while retaining its ease penalty. After the final rung, intervals grow multiplicatively. This is an adaptation of spaced-repetition ideas; I have not measured a learning advantage over other schedulers.</P>
      </Decision>

      <Section id="architecture" heading="Retrieval and fallback">
        <details className="mt-4 rounded-lg border border-edge p-4">
          <summary className="cursor-pointer text-ui text-content">View the request-flow diagram</summary>
          <ArchitectureDiagram />
        </details>
        <P><Link href="/tour/prep-under-the-hood" className={LINK}>Illustrated request walkthrough</Link> &middot; <Link href="/tour/prep-in-motion" className={LINK}>Illustrated product walkthrough</Link></P>
      </Section>

      <Section id="differently" heading="Testing and current limitations">
        <P>The unit suite covers scheduling, progress calculations, validation, and gateway behavior. Browser tests cover authentication, cross-user access, quotas, and the study flows with a mock AI provider.</P>
        <P>An early E2E run reused my development server and made 26 real API calls despite passing its assertions. I gave the suite a dedicated port, disabled server reuse, and added a provider check before generation tests. <Link href="/notes/e2e-suite-spent-real-calls" className={LINK}>Read the debugging note.</Link></P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "tests/e2e/helpers.ts")} source="Test provider guard" /></p>
        <P>Resource coverage depends on the topic and corpus; I do not have a general answer-quality or learning-outcome benchmark. Daily usage checks also need concurrency testing before I would rely on them under load. The schema still contains unused stored progress columns that should be removed.</P>
      </Section>
    </CaseStudy>
  );
}
