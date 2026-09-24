import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("public-collection-permissions")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>I wanted to send someone a collection link and have it open without a sign-in screen. That meant letting visitors read published bookmarks while keeping the rest of the library private.</P>
      <Section id="reading" heading="Publish one collection">
        <P>Collections start with <Code>is_public</Code> set to false. The public page looks up a collection by its slug and explicitly asks for a published row.</P>
        <P>The database has its own read policies. A visitor can read a public collection, and the bookmark policy checks that each bookmark belongs to that collection and its owner. Publishing one collection doesn&rsquo;t make the owner&rsquo;s other collections public.</P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge href={blob("devlinks", "src/features/public/publicApi.ts")} source="Public collection and bookmark queries" />
          <ProvenanceBadge href={blob("devlinks", "supabase/migrations/20260413_000003_rls_policies.sql")} source="Collection and bookmark access policies" />
        </p>
      </Section>
      <Section id="writing" heading="Read access doesn’t grant edit access">
        <P>The insert, update, and delete policies are separate from the public read policy. They require an authenticated owner. Bookmark inserts and updates also check that the destination collection belongs to that user.</P>
        <P>The public page has no editing controls, but those controls aren&rsquo;t what enforce ownership. The policies apply to database requests as well.</P>
      </Section>
      <Section id="author" heading="The author profile needs a rule too">
        <P>The collection page includes the author&rsquo;s profile. I added a read policy that allows a profile to be read when its owner has at least one public collection. Without that, the collection could be readable while its author details were unavailable to a visitor.</P>
        <P>That policy exposes a profile row, not just the fields selected by the current page. If I add private account fields later, they need separate storage or narrower access. Leaving a field out of the page query wouldn&rsquo;t make it private.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "supabase/migrations/20260503_000001_profile_fields_and_storage.sql")} source="Public author profile policy" /></p>
        <P>Making a collection private again changes what later database reads allow. It can&rsquo;t take back bookmarks someone already copied while the collection was public.</P>
      </Section>
    </NoteLayout>
  );
}
