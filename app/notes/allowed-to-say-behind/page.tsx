import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout, Output } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("allowed-to-say-behind")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>Prep compares logged study hours with a weekly plan. I wanted its pace status to remain useful after inactivity and at exact numeric boundaries. Three cases shaped the implementation.</P>
      <Section id="derived" heading="A plan can change status without a write">
        <P>A roadmap can fall behind while its owner is away. Updating a stored status only when the user acts would leave it stale, so <Code>deriveStatus()</Code> computes status from study sessions, topic completion, and elapsed time when it is read.</P>
        <P>The checks run in order: done, fresh, stalled, behind, then on track. A roadmap with no activity is fresh only while no hours are expected. The Library, Roadmap, and Progress screens use the same calculation.</P>
        <P>The old stored status and hours columns remain in the schema, though the screens no longer read them. Removing them is still a cleanup task.</P>
      </Section>
      <Section id="weeks" heading="Match the weekly plan">
        <P>Expected hours use whole elapsed weeks. A newly created roadmap expects zero hours in its first week, avoiding an immediate behind-pace warning. The expectation is capped at the total planned hours so an overdue plan does not accumulate an unlimited deficit.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "lib/progress/compute.ts")} source="Elapsed weeks and status calculations" /></p>
      </Section>
      <Section id="float" heading="The exact boundary failed a test">
        <P>The behind-pace threshold is 80% of expected hours. A test with 9.6 logged hours against 12 expected hours should be on track, but JavaScript produced:</P>
        <Output label="JavaScript floating-point result">{`> 12 * 0.8
9.600000000000001`}</Output>
        <P>Logged hours were rounded to one decimal place; the threshold was not. The comparison therefore treated 9.6 as below the boundary. I rounded the threshold to the same precision and kept tests for both the exact boundary and a value below it.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "tests/unit/progress.test.ts")} source="Progress regression tests" /></p>
      </Section>
      <Section id="grading" heading="What progress does not measure">
        <P>Hours and completed topics describe activity against the plan. Recall uses the learner&rsquo;s own Got it or Missed response; there is no AI grading of a free-text answer. These signals help organize study, but they are not an independent assessment of interview readiness.</P>
      </Section>
    </NoteLayout>
  );
}
