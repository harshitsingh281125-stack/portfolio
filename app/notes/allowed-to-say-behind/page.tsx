import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { NoteLayout, Output } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("allowed-to-say-behind")!;

export const metadata: Metadata = pageMeta({
  title: note.title,
  description: note.dek,
  path: `/notes/${note.slug}`,
  type: "article",
  publishedTime: note.date,
});

export default function AllowedToSayBehindNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>
        Study apps tend to lead with a streak. A streak only measures whether you
        opened the app today, and it cannot tell you that you are three weeks
        into a six-week plan with a week&rsquo;s worth of hours missing. Prep has
        a numbered rule against that: no vanity metrics as the headline. The
        headline is pace against plan, and that includes a red{" "}
        <Code>BEHIND PACE</Code> banner.
      </P>
      <P>
        A screen that can deliver bad news has a higher bar than one that only
        encourages. If it is ever wrong, it is wrong about someone who did the
        work, and they stop trusting it. Everything below is about earning the
        right to show that banner.
      </P>
      <p className="mt-4">
        <ProvenanceBadge
          status="verified"
          href={blob("prep", "Rules.md?plain=1", "L74-L79")}
          source="Rules.md · rules 17 and 19"
        />
      </p>

      <Section id="derived" heading="Status is derived on read, never stored">
        <P>
          The schema has a <Code>roadmaps.status</Code> column. Nothing reads it.
          A stored status is only accurate at the moment it is written. A roadmap
          you abandoned would only change to &ldquo;stalled&rdquo; the next time
          you <em>touched</em> it, which is backwards, because the whole point is
          that it went quiet while you were away. Keeping it honest would take a
          cron job or a trigger. So <Code>deriveStatus()</Code> computes it from
          sessions and topics every time a screen renders, as a pure function
          with nothing to go stale.
        </P>
        <P>
          The order of its checks matters: done, then fresh, then stalled, then
          behind, then on track. &ldquo;Fresh&rdquo; is the subtle one. A roadmap
          with nothing logged is only fresh while nothing is <em>expected</em>{" "}
          yet. Once hours are owed and none have been logged, it is behind. An
          untouched two-week-old roadmap is failing, not new.
        </P>
        <P>
          The Library and Roadmap screens stopped reading the old columns in the
          same change. Otherwise they would have kept showing &ldquo;fresh&rdquo;
          and 0 hours forever while Progress showed the real status, with two
          screens disagreeing about the same roadmap. A manual test case covers
          this by writing <Code>status = &apos;done&apos;</Code> and{" "}
          <Code>hours_logged = 999</Code> directly into the table and checking
          that all three screens ignore them.
        </P>
      </Section>

      <Section id="weeks" heading="Pace is measured in whole weeks">
        <P>
          To know whether you are behind, the dashboard needs a denominator: the
          hours you should have logged by now. It uses whole weeks elapsed since
          the roadmap was created, capped at the plan&rsquo;s length, multiplied
          by the plan&rsquo;s weekly hours.
        </P>
        <P>
          Whole weeks, because the plan is written in week-sized blocks with
          week-sized goals. You can be a week behind, but being 0.42 weeks behind
          means nothing. Prorating by the hour would also say you were behind a
          few hours after you created the roadmap. With whole weeks, a new
          roadmap expects zero hours for its first seven days and cannot be
          behind on day one.
        </P>
        <P>
          Capped, because past the final week the expectation is the whole plan,
          not a number that keeps growing. An abandoned five-week roadmap is
          &ldquo;19 hours short&rdquo;, not &ldquo;500 hours short&rdquo;.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "lib/progress/compute.ts", "L69-L94")}
            source="lib/progress/compute.ts · weeksElapsed"
          />
        </p>
      </Section>

      <Section id="float" heading="The bug that told an on-target user they were behind">
        <P>
          A user counts as behind if they have logged less than 80% of the hours
          expected so far. One unit test checks the exact boundary: 9.6 hours
          logged against 12 expected should be on track. It failed.
        </P>
        <Output label="node, outside the test harness">
{`> 12 * 0.8
9.600000000000001`}
        </Output>
        <P>
          The logged hours were rounded to one decimal place, but the threshold
          they were compared against was not. So <Code>9.6 &lt; 9.600000000000001</Code>{" "}
          was true, and someone who did exactly what they planned would have seen
          a red <Code>BEHIND PACE</Code> banner, behind by 1.8&times;10
          <sup>&minus;15</sup> hours.
        </P>
        <P>
          The fix rounds the threshold to the same precision before comparing.
          An epsilon would have been the quicker patch, but it only moves the
          arbitrary line somewhere harder to see. Two regression tests pin the
          fix: the exact boundary is on track, and a hair below it is still
          behind, which proves the fix did not just loosen the threshold.
        </P>
        <p className="mt-4 flex flex-col items-start gap-2">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "lib/progress/compute.ts", "L184-L214")}
            source="lib/progress/compute.ts · deriveStatus"
          />
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "tests/unit/progress.test.ts", "L184-L203")}
            source="tests/unit/progress.test.ts"
          />
        </p>
      </Section>

      <Section id="grading" heading="Why grading was never handed to a model">
        <P>
          The same principle covers recall. The original spec suggested an
          optional cheap-model check on free-text recall answers. I did not
          build it.
        </P>
        <P>
          Part of the reason is that there is nothing for it to grade. Prep asks
          you to grade yourself with two buttons, <em>Got it</em> and{" "}
          <em>Missed</em>, so there is no free text. The bigger reason is
          another numbered rule: &ldquo;close enough&rdquo; counts as a miss.
          That rule is about being honest with yourself. A language model asked
          whether an answer is right is inclined to be generous, and handing it
          that call would weaken the one thing the recall loop exists to enforce.
        </P>
        <p className="mt-4">
          <ProvenanceBadge
            status="verified"
            href={blob("prep", "Architecture.md?plain=1", "L87-L92")}
            source="Architecture.md · grading stayed non-AI"
          />
        </p>
      </Section>

      <Section id="earned" heading="The permission is earned">
        <P>
          A dashboard is allowed to tell you that you are behind only if it is
          right about it on day one, after two weeks of silence, and when your
          total is a rounding error away from the target. None of that shows up
          in a screenshot, which is why each case has a test.
        </P>
      </Section>
    </NoteLayout>
  );
}
