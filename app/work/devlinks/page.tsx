import type { Metadata } from "next";
import { CaseStudy, Code, Disclosure, P, Section, WalkthroughLinks } from "@/components/CaseStudy";
import { MetadataTraceDiagram } from "@/components/MetadataTraceDiagram";
import { Decision, ProvenanceBadge } from "@/components/Provenance";
import { blob, demos, repos } from "@/lib/site";
import { pageMeta } from "@/lib/meta";
import { projectBySlug } from "@/lib/projects";

export const metadata: Metadata = pageMeta({
  title: "DevLinks",
  description: "Building a developer bookmark manager with searchable collections, database-enforced deduplication, and public sharing.",
  path: "/work/devlinks",
  type: "article",
});
const rail = [
  { id: "d-search", name: "Search & navigation" },
  { id: "d-normalize", name: "Duplicate saves" },
  { id: "d-rules", name: "Tag suggestions" },
  { id: "d-order", name: "Roadmap order" },
  { id: "d-ssrf", name: "Metadata fetching" },
  { id: "differently", name: "Current limitations" },
];

export default function DevLinksCaseStudy() {
  return (
    <CaseStudy
      title="DevLinks"
      standfirst="A developer bookmark manager for saving docs, articles, repositories, and videos into searchable collections that can be shared publicly."
      glance={{
        built: <>Personal project. I built the React interface, GitHub sign-in, metadata endpoint, Postgres schema and policies, public collections and roadmaps, and bookmark export.</>,
        hardest: <>Coordinating the save flow across metadata fetching, duplicate detection, and cached collection data while keeping errors useful to the user.</>,
        stack: projectBySlug("devlinks").stack,
        links: { demo: `${demos.devlinks.url}${demos.devlinks.publicEntry}`, repo: repos.devlinks, tour: "/tour/devlinks-in-motion" },
        access: <>The demo opens a published roadmap without a login. Saving, editing and reordering require an account.</>,
      }}
      rail={rail}
    >
      <Section id="problem" heading="From a saved URL to a useful collection">
        <P>Paste a link, review its metadata and suggested tags, then save it to a collection. Search combines text, collection, tag, and resource-type filters. Collections are private by default; publishing one exposes a read-only page with the author profile, and every published collection appears in a public feed.</P>
        <P>A collection can also be a roadmap: the author orders its links into numbered steps, and readers work through them, ticking steps off as they go.</P>
        <P>I used RTK Query for the data layer and Supabase for authentication and storage. Database policies control private and public reads. Bookmarks can also be exported as JSON or Markdown.</P>
      </Section>

      <Decision
        id="d-search"
        name="Preserve search state in the URL"
        chose="URL parameters for the query and filters"
        over="component state that disappears on reload"
        because={<>A filtered collection should be recoverable after a reload. Switching collections adds a history entry; refining the search replaces the current entry.</>}
        href={blob("devlinks", "src/features/bookmarks/useSearchFilters.ts")}
        source="Search and navigation state"
      >
        <P>Postgres performs full-text search over a field derived from the bookmark content. Clearing search filters retains the selected collection, so the user can broaden a search without leaving it.</P>
      </Decision>

      <Decision
        id="d-normalize"
        name="Make duplicate saves recoverable"
        chose="a database-generated normalized URL and unique constraint"
        over="a client-only check before inserting"
        because={<>Two requests can both pass a client check. The database enforces uniqueness per user, and the app handles the conflict by retrieving the existing bookmark.</>}
        href={blob("devlinks", "src/features/bookmarks/bookmarksApi.ts")}
        source="Bookmark creation and duplicate handling"
      >
        <P>The mutation catches Postgres error <Code>23505</Code> and returns a distinct duplicate result. Since that path creates nothing, it does not invalidate the bookmark list. The client currently mirrors normalization to look up the existing row; moving that lookup into a database function would remove the duplicated rule.</P>
      </Decision>

      <Decision
        id="d-rules"
        name="Suggest tags without an extra service call"
        chose="the tags the page declares, then text-matching rules"
        over="an AI request on every save"
        because={<>Most platforms already publish tags in machine-readable places: <Code>article:tag</Code>, JSON-LD keywords, GitHub topics. Reading them first uses the author&rsquo;s own words; rules fill in for pages that declare nothing. Users can edit the result before saving.</>}
        href={blob("devlinks", "src/server/pageTags.ts")}
        source="Page-declared tags, normalization, and merging"
      >
        <P>Both stages run alongside metadata parsing and give repeatable suggestions, independent of model availability and inference cost. Tags are normalized to one vocabulary, so <Code>React.js</Code> and <Code>reactjs</Code> become <Code>react</Code>. A dev.to article that used to get no tags now gets six. The tradeoff: sites that block bots return nothing to read, and a page that declares no tags and falls outside the rule table may still get none.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "src/server/taggingRules.ts")} source="Keyword rules and resource-type inference" /></p>
      </Decision>

      <Decision
        id="d-order"
        name="Keep roadmap order consistent"
        chose="integer positions rewritten in one database call"
        over="updating rows one at a time from the client"
        because={<>A reorder sends the whole new order to a Postgres function that rewrites it in a single statement, so nobody sees a half-applied order. It rejects any list that isn&rsquo;t exactly the caller&rsquo;s links in that collection, so a stale tab can&rsquo;t leave gaps or duplicates.</>}
        href={blob("devlinks", "supabase/migrations/20260930_000001_roadmap_order.sql")}
        source="Positions, append trigger, and reorder function"
      >
        <P>The function runs with the caller&rsquo;s privileges, so row-level security still decides what may change; a trigger appends new and moved-in links at the end. In the editor, steps reorder by drag, by arrow keys on a focused grip, or by buttons, with each move announced to screen readers. The save is optimistic and rolls back on failure. Reader progress stays in the reader&rsquo;s browser and is never sent to the server.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "src/components/dashboard/RoadmapEditor.tsx")} source="Reorder by drag, keyboard, or buttons" /></p>
      </Decision>

      <Decision
        id="d-ssrf"
        name="Check each metadata redirect"
        chose="manual redirects with repeated URL and DNS checks"
        over="validating only the initial URL"
        because={<>A public URL can redirect to a private address. The fetcher checks the destination on each hop and reports blocked requests separately from timeouts and other failures.</>}
        href={blob("devlinks", "src/server/metadata.ts")}
        source="Metadata fetcher"
      >
        <P>These checks reduce exposure to private-network requests, but do not make the endpoint production-hardened. DNS is resolved again at connection time, so the checked address is not pinned. Authentication and rate limiting are also still missing.</P>
      </Decision>

      <Section id="architecture" heading="The save flow">
        <Disclosure label="View the metadata validation flow">
          <MetadataTraceDiagram />
        </Disclosure>
        <WalkthroughLinks links={[
          { href: "/tour/devlinks-in-motion", label: "Product walkthrough" },
          { href: "/tour/devlinks-trace", label: "Request walkthrough" },
        ]} />
      </Section>

      <Section id="differently" heading="Before broader use">
        <P>My first changes would be requiring a session and rate limiting on the metadata endpoint, then pinning outbound connections to the validated IP to close the DNS-rebinding gap. These are outstanding implementation tasks.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "api/metadata.ts")} source="Current endpoint handler" /></p>
        <P>The bookmark list also fetches and renders all matching rows, and the public feed loads every published collection in one query. I would add pagination before supporting large collections, then measure whether rendering needs virtualization. I have not established a production-scale performance benchmark.</P>
        <P>Duplicate detection also has a known gap: it drops the query string, so every YouTube video URL normalizes to the same key and a second video is reported as already saved. The fix is a per-host list of meaningful parameters, changed in the database function and its client mirror together.</P>
      </Section>
    </CaseStudy>
  );
}
