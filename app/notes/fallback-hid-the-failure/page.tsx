import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("fallback-hid-the-failure")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>On a real run of Prep, every resource came back as unverified, even for frontend topics covered by the reference library. The page loaded and generation completed. Both test suites were green.</P>
      <Section id="trace" heading="Retrieval was working">
        <P>I traced the request through retrieval and validation. The retrieved documents were relevant. The response even pointed at valid references. What failed was the short explanation attached to each resource.</P>
        <P>I had capped that field at 90 characters. The live response contained explanations of 223, 212, and 206 characters. The validator rejected them, the retry hit the same limit, and the route fell back to generation without vetted references.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "memory.md?plain=1", "L962-L1004")} source="Development log · caption validation failure" /></p>
      </Section>
      <Section id="fixtures" heading="My fixtures agreed with my assumption">
        <P>The mock response used &ldquo;the primary reference&rdquo; as its explanation. My unit fixtures were similarly short. None of them exercised the length of text the real provider returned.</P>
        <P>The fallback kept the flow usable, but a completed request didn&rsquo;t mean grounding had worked. The unverified label on the resource was the clue that sent me looking.</P>
      </Section>
      <Section id="fix" heading="Keep the link, shorten the caption">
        <P>I separated the acceptance limit from the display limit. The validator now allows explanations up to 400 characters; <Code>condenseWhy()</Code> shortens long captions at a word boundary for display. An out-of-range reference still fails validation because it cannot resolve to a supplied document.</P>
        <P>I also changed the mock provider to return longer explanations and added regression cases using the text from the live response. Raising the limit alone would have left the tests with the same blind spot.</P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge href={blob("prep", "lib/ai/validate.ts")} source="Grounded response validation and caption formatting" />
          <ProvenanceBadge href={blob("prep", "tests/unit/rag.test.ts")} source="Caption validation regression tests" />
        </p>
        <P>A successful fallback is useful, but I still need to know when I&rsquo;m using it. Otherwise a feature can stop working while the rest of the app looks fine.</P>
      </Section>
    </NoteLayout>
  );
}
