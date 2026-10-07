import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("tags-from-the-url")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>When I save a bookmark, I don&rsquo;t want to type every tag from scratch. DevLinks already fetches the page title and description for the preview, so I use those fields, along with the hostname and path, to suggest a few tags.</P>
      <Section id="matching" heading="Use the text already in the preview">
        <P>The tagger replaces slashes and hyphens in the path with spaces, then checks the combined text against a table of patterns. A path such as <Code>/react/hooks</Code> can contribute a React tag even if the title doesn&rsquo;t mention React.</P>
        <P>Some patterns map different spellings to the same tag: Postgres and PostgreSQL both produce <Code>postgresql</Code>, for example. Matches go into a set so a topic mentioned in the URL, title, and description still appears once.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "src/server/taggingRules.ts")} source="Tag patterns and inferSuggestedTags()" /></p>
      </Section>
      <Section id="save" heading="Leave the suggestions editable">
        <P>The metadata endpoint runs these rules while building the preview. There&rsquo;s no separate model request to wait for or pay for on each save.</P>
        <P>The save dialog copies the suggested tags into editable state. You can remove a bad suggestion or add a missing topic before saving. That matters because the rules only match words; they don&rsquo;t read the article.</P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge href={blob("devlinks", "src/server/metadata.ts")} source="Suggestions included in the metadata preview" />
          <ProvenanceBadge href={blob("devlinks", "src/components/dashboard/SaveBookmarkModal.tsx")} source="Editable tags in the save dialog" />
        </p>
      </Section>
      <Section id="limits" heading="Where this stops helping">
        <P>A topic that isn&rsquo;t in the table won&rsquo;t get a tag. A familiar word used in the wrong context can get one it shouldn&rsquo;t. The result also depends on what the page puts in its title and description.</P>
        <P>I can test a specific title or URL and see exactly which pattern matched. That makes this version easy to adjust. The tradeoff is that every new topic needs a rule, and adding more rules won&rsquo;t fix every ambiguous match.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "src/server/taggingRules.test.ts")} source="Classification and tag suggestion tests" /></p>
      </Section>
      <Section id="update" heading="Update, 1 October 2026: read the page first">
        <P>The limit above showed up fast. A dev.to article on HTTP cookies got no tags at all, even though the page lists its own: <Code>webdev</Code>, <Code>javascript</Code>, <Code>programming</Code>, <Code>beginners</Code>. Most platforms publish tags in machine-readable places, and the rule table ignored all of them.</P>
        <P>Suggestions now come in two stages. First, the tags the page declares: <Code>article:tag</Code> meta, JSON-LD keywords, dev.to&rsquo;s &ldquo;Tagged with&rdquo; line, GitHub repository topics, and, only when nothing better exists, <Code>rel=&quot;tag&quot;</Code> links, which also turn up in &ldquo;related posts&rdquo; sidebars. The site-wide keyword list is read last and filtered, because sites put their own pitch there. Then the rules, now 127 of them, fill in for pages that declare nothing. Everything is normalized to one vocabulary, so <Code>React.js</Code> and <Code>reactjs</Code> both become <Code>react</Code>.</P>
        <P>The cookies article now gets six tags: its own four, plus <Code>http</Code> and <Code>cookies</Code> from the rules. It&rsquo;s still deterministic and still editable. It still can&rsquo;t help a site that blocks the fetch.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "src/server/pageTags.ts")} source="Page-declared tags, normalization, and merging" /></p>
      </Section>
    </NoteLayout>
  );
}
