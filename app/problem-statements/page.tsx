import { Suspense } from "react";
import { ChallengeBrowser } from "@/components/challenge-browser";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { getProblemStatements } from "@/lib/repositories/firestore";

async function ProblemStatementDirectory() {
  try {
    const problemStatements = await getProblemStatements(100);
    return problemStatements.length === 0 ? <EmptyState message="Be among the first contributors" /> : <ChallengeBrowser challenges={problemStatements} />;
  } catch (error) {
    return <ErrorState retryHref="/problem-statements" message={error instanceof Error ? error.message : "Unable to load problem statements from Firestore."} />;
  }
}

export default function ProblemStatements() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Problem Statements</h1><p className="mt-3 text-white/60">Browse real public problem statements published from Firestore.</p><div className="mt-8"><Suspense fallback={<LoadingState label="Loading problem statements" />}><ProblemStatementDirectory /></Suspense></div></main>;
}
