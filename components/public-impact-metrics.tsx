import { Card } from "@/components/ui";
import { getPublicImpactMetrics } from "@/lib/repositories/firestore";

export async function PublicImpactMetricCards() {
  const m = await getPublicImpactMetrics().catch(() => null);
  const metrics = m ? [[m.totalProblemsSubmitted, "MSME problems submitted"], [m.totalProblemsSolved, "Problems solved"], [m.totalChallengesLaunched, "Challenges launched"], [m.totalChallengeParticipants, "Challenge participants"], [m.totalCaseStudiesPublished, "Case studies published"], [m.totalCommunityPosts, "Community posts"], [m.totalMonetarySavings, "Monetary savings"], [m.totalTimeSaved, "Time saved"], [m.totalWasteReduction, "Waste reduction"], [m.totalProductivityGain, "Productivity gain"], [m.totalClientsGained, "Clients gained"], [m.totalPublicReviews, "Public reviews"]] : [];
  return <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-4">{metrics.map(([value, label]) => <Card key={label} className="editorial-card"><p className="font-display text-4xl text-amber-100">{value}</p><p className="mt-2 text-sm uppercase tracking-[.16em] text-white/60">{label}</p></Card>)}</div>;
}
