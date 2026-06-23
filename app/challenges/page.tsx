import { Suspense } from "react";
import { ChallengeBrowser } from "@/components/challenge-browser";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { getChallenges } from "@/lib/repositories/firestore";

async function ChallengeDirectory() {
  try {
    const challenges = await getChallenges(100);
    return challenges.length === 0 ? <EmptyState message="Be among the first contributors" /> : <ChallengeBrowser challenges={challenges} />;
  } catch (error) {
    return <ErrorState retryHref="/challenges" message={error instanceof Error ? error.message : "Unable to load challenges from Firestore."} />;
  }
}

export default function Challenges() {
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Challenge Marketplace</h1><p className="mt-3 text-white/60">Browse real challenges published from Firestore.</p><div className="mt-8"><Suspense fallback={<LoadingState label="Loading challenges" />}><ChallengeDirectory /></Suspense></div></main>;
}
