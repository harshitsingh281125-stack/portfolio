import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("saving-the-same-link")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>It&rsquo;s easy to forget that you&rsquo;ve already saved a link, especially if it&rsquo;s in a different collection. I wanted the save dialog in DevLinks to tell you where it was and let you edit it.</P>
      <Section id="database" heading="Let the insert settle it">
        <P>A lookup before saving would catch most duplicates, but two tabs could both check before either one inserts. I put a unique constraint on <Code>(user_id, normalized_url)</Code> so the database makes that decision.</P>
        <P>The constraint is per user, across collections. Saving a link to a second collection still counts as a duplicate. That follows the current data model: each bookmark belongs to one collection.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "supabase/migrations/20260413_000001_initial_schema.sql")} source="Bookmark schema and unique constraint" /></p>
      </Section>
      <Section id="recovery" heading="Show the bookmark that already exists">
        <P>When the insert returns Postgres error <Code>23505</Code>, the mutation looks up the existing bookmark and returns <Code>kind: &quot;duplicate&quot;</Code>. The dialog shows its title and collection, with an option to edit it.</P>
        <P>I keep that separate from a successful save. No row was added, so this path doesn&rsquo;t invalidate the bookmark list. If the lookup itself fails, the app says the URL is already saved but the existing bookmark couldn&rsquo;t be loaded.</P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge href={blob("devlinks", "src/features/bookmarks/bookmarksApi.ts")} source="Insert, duplicate lookup, and cache invalidation" />
          <ProvenanceBadge href={blob("devlinks", "src/components/dashboard/SaveBookmarkModal.tsx")} source="Duplicate warning and edit action" />
        </p>
      </Section>
      <Section id="normalization" heading="The URL rule is still too broad">
        <P>The normalization function removes the protocol, a leading www, query strings, fragments, and trailing slashes. It also lowercases the whole URL. That catches variations of the same link, but it can also merge links that should stay separate.</P>
        <P>For example, <Code>example.com/watch?v=one</Code> and <Code>example.com/watch?v=two</Code> both become <Code>example.com/watch</Code>. The constraint can enforce the rule perfectly while the rule itself is wrong for those URLs.</P>
        <P>I&rsquo;d narrow that rule before calling duplicate detection finished. I&rsquo;d also move the conflict lookup into a database function. Right now the client mirrors the SQL normalization, which leaves two implementations to keep in sync.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "supabase/migrations/20260413_000002_helpers_and_indexes.sql")} source="URL normalization and bookmark trigger" /></p>
      </Section>
    </NoteLayout>
  );
}
