import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { blob } from "@/lib/site";

const note = noteBySlug("e2e-suite-spent-real-calls")!;

export const metadata: Metadata = { title: note.title, description: note.dek };

export default function E2ESpendNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>
        Prep&rsquo;s end-to-end suite runs against a mock AI provider, on
        purpose. A suite that depends on a third party&rsquo;s uptime goes red
        for reasons that teach you nothing. A full run generates enough roadmaps
        and cards to use up a real user&rsquo;s daily cap partway through. And
        once billing is on, every run costs money. The mock still goes through
        the whole gateway, including the cap, validation, retry and metering, so
        everything under test is our code.
      </P>
      <P>
        For a while, the suite was not actually using it.
      </P>

      <Section id="how" heading="How the mock was never applied">
        <P>
          <Code>playwright.config.ts</Code> set <Code>AI_PROVIDER=mock</Code> in
          the environment of the server it starts. That part was correct. It
          also set <Code>reuseExistingServer: true</Code>, and its port defaulted
          to 3001, which is the dev port.
        </P>
        <P>
          Those two settings together mean that if something is already
          listening on 3001, Playwright uses it instead of starting its own
          server. Most of the time something was: my own{" "}
          <Code>npm run dev</Code>, holding the real Gemini key. Next.js reads
          its environment only at startup, so the mock setting in the config
          never reached a process that could read it.
        </P>
      </Section>

      <Section id="green" heading="Why nothing failed">
        <P>
          Every test asserts something like &ldquo;a roadmap was generated and
          has the right shape&rdquo;. A real model satisfies that at least as
          well as a mock does. The suite was, if anything, <em>more</em> green
          for being misconfigured. There was no error and no red test, and
          nothing in the output pointed at the problem.
        </P>
        <P>
          I found it because I noticed the token usage. Grouping Prep&rsquo;s own{" "}
          <Code>ai_usage</Code> table by model for the day of the first run
          showed 24 calls to <Code>gemini-3.5-flash</Code> and 2 to{" "}
          <Code>gemini-3.5-flash-lite</Code>. The suite had spent 26 real calls,
          and the run that spent them was green.
        </P>
      </Section>

      <Section id="fix" heading="Three fixes, because one was not enough">
        <P>
          Each fix closes a different way back to the same failure.
        </P>
        <P>
          <strong className="font-semibold">A dedicated port, 3101.</strong> The
          test server can no longer be the dev server, and the two can run side
          by side.
        </P>
        <P>
          <strong className="font-semibold">
            <Code>reuseExistingServer: false</Code>.
          </strong>{" "}
          Reusing a server saves a few seconds of startup. In exchange you lose
          the guarantee that the server under test has the environment the
          config file specifies. The same setting had already cost me a
          debugging cycle that week, when a stale server ignored two config
          changes in a row.
        </P>
        <P>
          <strong className="font-semibold">
            A guard that refuses to run.
          </strong>{" "}
          Every spec that generates anything calls{" "}
          <Code>assertMockProvider()</Code> before its first test. It asks the
          running server, through <Code>/api/usage</Code>, which provider it is
          actually using, and throws if the answer is not <Code>mock</Code>. The
          first two fixes are configuration, and configuration can regress. The
          guard checks what the server reports, not what the config intended.
        </P>
        <P>
          After the fix, a full run makes 43 mock calls and zero to Gemini.
        </P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "playwright.config.ts", "L9-L17")}
            source="playwright.config.ts · the port"
          />
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "tests/e2e/helpers.ts", "L5-L31")}
            source="tests/e2e/helpers.ts · assertMockProvider"
          />
        </p>
      </Section>

      <Section id="pattern" heading="The third time, not the first">
        <P>
          A day later, with no dev server running, a security test failed with{" "}
          <Code>ECONNREFUSED</Code>. QT-06 checks that an anonymous request
          cannot create a roadmap. It had built its own URL from{" "}
          <Code>PW_PORT ?? &quot;3001&quot;</Code>, so for two phases it had been
          sending that anonymous request to my dev server rather than the server
          under test. It passed that whole time without testing the right thing.
        </P>
        <P>
          That made three instances of the same bug in one project. In the
          first, <Code>request.newContext()</Code> silently inherited a logged-in
          session, so the &ldquo;anonymous&rdquo; request in that same test was
          authenticated. That one looked like a security hole in the app until a
          plain <Code>curl</Code> with no cookies was correctly redirected to the
          login page. The second was the 26 calls. The third was the port.
        </P>
        <P>
          All three have the same cause: the test harness rebuilt something the
          test runner already had, such as a URL, a port or a session. The fix
          each time was to use the runner&rsquo;s value instead. QT-06 now takes
          its URL from Playwright&rsquo;s <Code>baseURL</Code> fixture.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "tests/e2e/quota.spec.ts", "L73-L88")}
            source="tests/e2e/quota.spec.ts · QT-06"
          />
        </p>
      </Section>

      <Section id="lesson" heading="What I took from it">
        <P>
          A correct result is not evidence of a correct setup. A misconfigured
          test that costs money will not fail on its assertions, because the
          expensive path answers them perfectly well. So it has to fail loudly
          on the misconfiguration itself, and something has to check the setup
          directly rather than infer it from a passing result.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "memory.md?plain=1", "L1110-L1130")}
            source="memory.md · 2026-08-12"
          />
        </p>
      </Section>
    </NoteLayout>
  );
}
