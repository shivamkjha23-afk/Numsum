import { EmptyState, ErrorState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getChallenges } from "@/lib/repositories/firestore";
import type { Challenge } from "@/lib/types";

function ChallengeGrid({ challenges }: { challenges: Challenge[] }) {
  if (challenges.length === 0) {
    return <EmptyState message="No challenges have been published yet. Please check back once organizations add their first challenge." />;
  }

  return <div className="grid gap-4 md:grid-cols-2">{challenges.map((challenge) => <Card key={challenge.id}><p className="text-blue-300">{[challenge.category, challenge.industry].filter(Boolean).join(" · ") || "Challenge"}</p><h2 className="mt-2 font-display text-2xl">{challenge.title}</h2><p className="mt-4 text-white/60">{[typeof challenge.participants === "number" ? `${challenge.participants} participants` : undefined, challenge.status, challenge.difficulty, challenge.location].filter(Boolean).join(" · ") || "Additional details will be published soon."}</p></Card>)}</div>;
}

export default async function Challenges() {
  let challenges: Challenge[] = [];
  let errorMessage: string | null = null;

  try {
    challenges = await getChallenges();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load challenges from Firestore.";
  }

  const industries = Array.from(new Set(challenges.map((challenge) => challenge.industry).filter(Boolean)));

  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Challenge Marketplace</h1><p className="mt-3 text-white/60">Searchable, filter-ready exchange for industrial problems and solution teams.</p><div className="mt-8 grid gap-4 md:grid-cols-[280px_1fr]"><Card><h2 className="font-semibold">Advanced filters</h2>{["Status", "Difficulty", "Industry", "Location", "Reward"].map((filter) => <input key={filter} placeholder={filter} className="mt-3 w-full rounded-xl border border-white/10 bg-black/30 p-3" />)}<div className="mt-4 flex flex-wrap gap-2">{industries.length > 0 ? industries.map((industry) => <span className="rounded-full bg-white/10 px-3 py-1 text-xs" key={industry}>{industry}</span>) : <p className="text-sm text-white/50">Industry filters appear after Firestore challenge records are published.</p>}</div></Card>{errorMessage ? <ErrorState message={errorMessage} /> : <ChallengeGrid challenges={challenges} />}</div></main>;
}
