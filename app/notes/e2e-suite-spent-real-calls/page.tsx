import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("e2e-suite-spent-real-calls")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>Prep&rsquo;s browser tests use a mock AI provider so I can exercise generation, retries, validation, and usage limits without depending on a live model. An early run passed while making 26 real Gemini calls.</P>
      <Section id="how" heading="The configuration never reached the server">
        <P>Playwright set <Code>AI_PROVIDER=mock</Code> in its server environment. It also used <Code>reuseExistingServer: true</Code> and port 3001, the same port as my development server.</P>
        <P>With the dev server already running, Playwright reused it. That process had started with the real provider configuration, so the test-server environment was never applied.</P>
      </Section>
      <Section id="green" heading="Passing assertions hid the setup problem">
        <P>The real provider returned responses that satisfied the test assertions. Those assertions checked application behavior, not which provider had served the request.</P>
        <P>I noticed token usage and grouped the application&rsquo;s <Code>ai_usage</Code> records by model. The first run had made 24 calls to the reasoning model and two to the cheaper generation model.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "memory.md?plain=1", "L1110-L1130")} source="Development log · 12 August 2026" /></p>
      </Section>
      <Section id="fix" heading="Check the running configuration">
        <P>I moved the test server to port 3101 and set <Code>reuseExistingServer: false</Code>. Generation specs now call <Code>assertMockProvider()</Code> before their tests.</P>
        <P>The guard asks <Code>/api/usage</Code> which provider the server is using and throws unless it reports <Code>mock</Code>. It checks the running process, so a future configuration change cannot silently switch these tests back to a paid provider.</P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge href={blob("prep", "playwright.config.ts")} source="Dedicated test-server configuration" />
          <ProvenanceBadge href={blob("prep", "tests/e2e/helpers.ts")} source="assertMockProvider()" />
        </p>
      </Section>
      <Section id="pattern" heading="Another test still used the dev port">
        <P>After the port change, an anonymous-request test failed when the dev server was stopped. It built its own URL with a 3001 fallback rather than using Playwright&rsquo;s configured server. I changed it to read the runner&rsquo;s <Code>baseURL</Code> fixture.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("prep", "tests/e2e/quota.spec.ts")} source="Quota and anonymous-request tests" /></p>
        <P>I now treat the provider, target URL, and authentication state as test preconditions. Passing application assertions alone does not verify those preconditions.</P>
      </Section>
    </NoteLayout>
  );
}
