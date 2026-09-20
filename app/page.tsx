import { Claim } from "@/components/Provenance";
import { blob } from "@/lib/site";

export default function Home() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="max-w-3xl font-serif text-display font-semibold text-content">
        I build the unglamorous parts of AI products: the gateway, the cap, the
        fallback, and the citation that can&rsquo;t be faked.
      </h1>

      <div className="mt-10 flex flex-wrap gap-x-10 gap-y-6">
        <Claim
          value="362"
          label="automated tests in Prep — 283 unit, 79 end-to-end"
          status="verified"
          href={blob("prep", "tests")}
          source="tests/unit + tests/e2e"
        />
        <Claim
          value="202"
          label="hand-vetted documents in the RAG corpus"
          status="verified"
          href={blob("prep", "supabase/migrations")}
          source="supabase/migrations"
        />
      </div>

      <p className="mt-16 font-mono text-meta text-content-faint">
        Phase 0 scaffold. Home page lands in Phase 1.
      </p>
    </div>
  );
}
