import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { List, NoteLayout, Output } from "@/components/Note";
import { ProvenanceBadge } from "@/components/Provenance";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";
import { blob } from "@/lib/site";

const note = noteBySlug("ai-workflow-with-gates")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>I use AI tools every day: <strong>Cursor</strong> at work and <strong>Claude Code</strong> on my own projects. This note covers the setup I wrote so that an agent works the way our codebase expects, instead of guessing.</P>

      <Section id="problem" heading="The problem: agents guess">
        <P>Our marketplace app is one React Native codebase that serves several products, each with its own theme, tabs and data. Out of the box, an AI agent writing code for it would:</P>
        <List items={[
          "invent API field names based on what the frontend variables are called,",
          "hard-code a colour that is right for one product and wrong for the others,",
          "write plans that mention files that don’t exist.",
        ]} />
        <P>A better prompt each time doesn’t fix this. The agent needs the same context a new engineer gets, and a person needs to check its work at the right moments.</P>
      </Section>

      <Section id="setup" heading="What I set up in Cursor">
        <P>Over about four weeks I added 17 instruction files (around 2,200 lines) to the repo, so everyone on the team gets the same behaviour:</P>
        <List items={[
          <><strong>Six rule files</strong> that Cursor loads automatically: the architecture (how one app serves several products, navigation, Redux Toolkit layout), React Native conventions, a review checklist, keeping docs in sync, a planning gate, and backend contracts.</>,
          <><strong>Seven slash commands</strong> for the steps of shipping a feature: <Code>/new-feature</Code>, <Code>/review</Code>, <Code>/create-pr</Code>, <Code>/update-pr</Code>, <Code>/debug</Code>, <Code>/qa</Code>, and <Code>/ship</Code>, which chains all of them.</>,
          <><strong>49 docs pages</strong> about the app (API endpoints, navigation, shared components) that the commands tell the agent to read first.</>,
        ]} />
      </Section>

      <Section id="flow" heading="How a feature goes through it">
        <P>A developer types <Code>/new-feature</Code> with a one-line description and, optionally, a Figma link:</P>
        <Output label="The end-to-end flow, simplified">
          {`/new-feature  read ~20 docs pages, the rules and the Redux store
              read the Figma frame, map every colour and size to an existing theme token
              write a plan: PRD, architecture, tasks, design, checklist
              STOP: a person approves the plan
              build one task at a time, pausing between tasks
/review       read-only review of the diff, findings by severity, one verdict
/create-pr    group the changes into commits, write the PR from the plan
              STOP: a person approves the commits and the PR text, then it pushes`}
        </Output>
        <P>The plan is committed next to the code, so reviewers can see what was asked for and what was decided. If a Figma value has no matching theme token, the agent marks it as missing and asks, instead of hard-coding it.</P>
        <P>A few lines from the commands that shaped how it behaves:</P>
        <List items={[
          <>&ldquo;Read these before doing anything else, so the plan cites real paths instead of inventions.&rdquo;</>,
          <>&ldquo;Do NOT fabricate or guess a UI.&rdquo; This is for when the Figma file can&rsquo;t be opened.</>,
          <>&ldquo;Never batch multiple tasks without the developer confirming between them.&rdquo;</>,
          <>&ldquo;Never use <Code>--no-verify</Code>&rdquo; and &ldquo;never <Code>git add .</Code>&rdquo;, so the agent can&rsquo;t skip the lint hooks or commit stray files.</>,
        ]} />
      </Section>

      <Section id="contracts" heading="The rule I had to fix">
        <P>My first version of the review command told the agent that API responses get converted to camelCase. That was wrong: the conversion only happens on one screen, and everywhere else the keys stay in snake_case. An agent following my rule would read fields that are always undefined, so the UI shows blanks and nothing throws an error.</P>
        <P>I corrected it and added a <strong>backend contracts</strong> rule: before trusting any API field, the agent opens the real backend code (the URL, the view and the serializer) and compares every key. A key the serializer doesn&rsquo;t send is a blocking finding, not a nitpick. If the backend repo isn&rsquo;t open in the workspace, the agent has to say so rather than guess.</P>
        <P>The lesson for me: <strong>rules for an agent are code, and they can have bugs too</strong>. A wrong rule is worse than no rule, because the agent follows it every time.</P>
      </Section>

      <Section id="claude" heading="Claude Code on my own projects">
        <P>I built <strong>Prep</strong>, one of the projects on this site, with Claude Code using the same approach. 26 of its 31 commits are co-authored by Claude.</P>
        <List items={[
          <><strong>A <Code>CLAUDE.md</Code></strong> that every session loads: the stack, the rules that must never break, and which doc to read for what.</>,
          <><strong>A <Code>/phase</Code> command</strong> that builds one phase of the roadmap end to end: read the spec, write the database migration, build, typecheck, add unit and end-to-end tests, pass a QA gate, then commit. It stops and asks me when a decision is still open.</>,
          <><strong>A decisions log</strong> (<Code>memory.md</Code>) that the agent reads so it doesn&rsquo;t re-open settled decisions, and adds to as bugs are found.</>,
        ]} />
        <p className="mt-4 flex flex-wrap gap-3">
          <ProvenanceBadge href={blob("prep", "CLAUDE.md")} source="Prep · CLAUDE.md" />
          <ProvenanceBadge href={blob("prep", ".claude/commands/phase.md")} source="Prep · /phase command" />
        </p>
        <P>For <strong>DevLinks</strong> I wrote a smaller context pack: five short files that give a session the project state and point it at one targeted file, so it doesn&rsquo;t scan the whole repo every time.</P>
        <p className="mt-4"><ProvenanceBadge href={blob("devlinks", "claude-context/README.md")} source="DevLinks · Claude context pack" /></p>
      </Section>


      <Section id="takeaway" heading="What I’d tell another team">
        <List items={[
          "Write down what a new engineer would need to know, and make the agent read it before it plans.",
          "Put a person at the points that are expensive to undo: the plan, the commits, the push.",
          "Check the agent against the real source of truth, like the backend code, not against your own assumptions.",
          "Review your rules the way you review code. Mine had a bug.",
        ]} />
      </Section>
    </NoteLayout>
  );
}
