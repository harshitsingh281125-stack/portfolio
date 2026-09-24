import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("optimistic-bookmark-delete")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>Once I confirm a bookmark deletion, I want the row to disappear without waiting for the server. In DevLinks, I update the cached list as the request starts and keep the patch so I can undo it if the request fails.</P>
      <Section id="cache" heading="Update the list being viewed">
        <P>The bookmark query is keyed by the user and the current filters. The delete mutation receives those same values, finds the matching cached list, and removes the row by its ID.</P>
        <P>That detail matters when search or a collection filter is active. Updating some other cached list wouldn&rsquo;t change the rows on screen.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "src/features/bookmarks/bookmarksApi.ts")} source="deleteBookmark and its optimistic cache patch" /></p>
      </Section>
      <Section id="failure" heading="Keep a way back">
        <P>RTK Query returns a patch from <Code>updateQueryData()</Code>. I wait for <Code>queryFulfilled</Code> and call <Code>patch.undo()</Code> if it rejects. The dashboard also reports the request error, so the row doesn&rsquo;t just reappear without an explanation.</P>
        <P>This rollback handles a failed request. It isn&rsquo;t an Undo button for a completed deletion: once the server has deleted the bookmark, this flow doesn&rsquo;t restore it. The confirmation dialog makes that clear before the request starts.</P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge href={blob("devlinks", "src/routes/DashboardPage.tsx")} source="Delete confirmation handler and error reporting" />
          <ProvenanceBadge href={blob("devlinks", "src/components/dashboard/DeleteBookmarkDialog.tsx")} source="Confirmation before deletion" />
        </p>
      </Section>
      <Section id="refresh" heading="Fetch the server state afterward">
        <P>The mutation also invalidates the bookmark and list cache tags. Active queries can then fetch the server state again. The optimistic patch makes the interaction immediate; the refresh updates the subscribed lists after the request settles.</P>
        <P>I only patch the current list directly. Keeping every possible filtered view in sync by hand would add more cache logic to a small interaction. The other subscribed views get their update through invalidation.</P>
      </Section>
    </NoteLayout>
  );
}
