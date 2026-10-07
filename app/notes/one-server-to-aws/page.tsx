import type { Metadata } from "next";
import { Code, P, Section } from "@/components/CaseStudy";
import { List, NoteLayout } from "@/components/Note";
import { noteBySlug } from "@/lib/notes";
import { pageMeta } from "@/lib/meta";

const note = noteBySlug("one-server-to-aws")!;
export const metadata: Metadata = pageMeta({
  title: note.title, description: note.dek, path: `/notes/${note.slug}`,
  type: "article", publishedTime: note.date,
});

export default function EngineeringNote() {
  return (
    <NoteLayout slug={note.slug}>
      <P>This is from my work at Kindtech on a care-coordination platform for dementia care. The product is under NDA, so I describe it without naming it.</P>

      <Section id="start" heading="Where it started">
        <P>Everything ran on one virtual machine. nginx served the React build from disk and forwarded requests to the backend: the API, a chat server written in C (HTTP plus WebSocket), a chat bot, and a worker that processes uploaded documents. Postgres and Redis ran in Docker on the same machine and were reached over <Code>localhost</Code>. Postgres was even still exposed on port <Code>3306</Code>, left over from an older MySQL setup, with a default password.</P>
        <P>That is fine for a staging server. In production it meant <strong>one disk failure would take out patient records, chat and the website at the same time</strong>. It also meant database traffic had never been encrypted, because it never had to leave the machine.</P>
      </Section>

      <Section id="decision" heading="The decision">
        <P>We had very few users, so this was an <strong>availability problem, not a scaling problem</strong>. Read replicas and auto-scaling would not have helped. What we needed was:</P>
        <List items={[
          "a live standby copy of the data,",
          "services that come back on their own without someone logging into the server,",
          "a login page that still loads while the backend restarts.",
        ]} />
        <P>I compared three options: <strong>ECS Fargate</strong> (Amazon Elastic Container Service, where AWS runs the containers for you), plain processes on two EC2 servers (Elastic Compute Cloud), and our existing nginx setup copied onto two EC2 servers. I picked Fargate: there are no server images to patch, and ECS replaces a crashed container by itself.</P>
        <P>One point I kept having to correct during planning: <strong>a load balancer does not create redundancy</strong>. It only spreads traffic across copies you are already running.</P>
      </Section>

      <Section id="built" heading="What I built">
        <List items={[
          <><strong>The website.</strong> The React build is served from S3 (Simple Storage Service) through CloudFront, Amazon&rsquo;s CDN (content delivery network). HTTPS and security headers (Content Security Policy and HTTP Strict Transport Security) are set there. The UI no longer depends on any app server being up.</>,
          <><strong>The services.</strong> They run on ECS Fargate across two AZs (Availability Zones, which are separate data centres). The API, chat HTTP and WebSocket services run two copies each behind an ALB (Application Load Balancer). The bot and the document worker run one copy each with no public port. The worker picks up jobs from SQS (Simple Queue Service) when a file lands in S3. I raised the load balancer&rsquo;s idle timeout so long-lived chat connections are not cut off.</>,
          <><strong>The data.</strong> Postgres moved to RDS (Relational Database Service) in Multi-AZ mode, with a primary and a standby. Redis moved to ElastiCache with a primary and a replica. Both sit on private subnets with no public IP, with automated backups and snapshots on. I treated Redis as a database, not a cache, because the chat server keeps live state in it.</>,
          <><strong>One image, five services.</strong> I packaged the binaries and Python environments into a single container image. Each ECS service runs that image with its own start command.</>,
        ]} />
      </Section>

      <Section id="code" heading="The part that wasn’t clicking through the console">
        <P>Simply pointing the services at the new hostnames would have either broken production or quietly sent data unencrypted:</P>
        <List items={[
          <><strong>Database encryption.</strong> Neither the Python ORM nor the C Postgres client set <Code>sslmode</Code>, so the connection fell back to plain text without any warning. I set <Code>verify-full</Code> with the RDS certificate bundle in both. Now a wrong certificate stops the service at startup.</>,
          <><strong>Redis.</strong> The C Redis client connected with only a host and port. I added password authentication and TLS (Transport Layer Security) so it could talk to an encrypted ElastiCache cluster.</>,
          <><strong>Secrets.</strong> I removed hardcoded fallback passwords, so a missing secret crashes the service on boot instead of connecting with a default.</>,
          <><strong>Frontend config.</strong> The React app used to get its runtime settings from a shell script in the container, which S3 cannot run. I moved that step into the deploy pipeline and limited it to an allowlist, so a wrongly set variable cannot leak a secret into the browser bundle.</>,
        ]} />
      </Section>

      <Section id="verified" heading="How I checked it">
        <List items={[
          <>Postgres&rsquo;s <Code>pg_stat_ssl</Code> view reports an encrypted connection for every service.</>,
          "Killed an API container in the middle of a request: the load balancer stopped sending it traffic and ECS started a replacement.",
          "Forced an RDS failover: a short burst of errors, then the same database address worked again.",
          "Restored a point-in-time backup to a scratch database and compared row counts.",
        ]} />
      </Section>

      <Section id="takeaway" heading="What I’d tell another team">
        <List items={[
          "A load balancer in front of a single container is not high availability.",
          "Don’t run two copies of a stateful bot unless it was built to share a login.",
          "Database encryption has to be enforced in your own client code. The cloud provider can’t switch it on for you.",
          "None of this replaces a BAA (Business Associate Agreement, the HIPAA contract) with your cloud vendor.",
        ]} />
      </Section>
    </NoteLayout>
  );
}
