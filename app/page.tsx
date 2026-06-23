import { Suspense } from "react";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { HeroTypewriter } from "@/components/hero-typewriter";
import { NetworkHero } from "@/components/network-hero";
import { Button, Card } from "@/components/ui";
import { getChallenges, getPlatformStats } from "@/lib/repositories/firestore";

async function HomeStats() {
  try {
    const stats = await getPlatformStats();
    if (Object.values(stats).every((value) => value === 0)) return <EmptyState message="Be among the first contributors" />;
    return <Card className="grid gap-8 md:grid-cols-4">{[[stats.organizations, "Total Organizations"], [stats.challenges, "Total Challenges"], [stats.openChallenges, "Open Challenges"], [stats.communityMembers, "Community Members"]].map(([value, label]) => <div key={label}><div className="font-display text-4xl text-blue-300">{value}</div><div className="text-white/60">{label}</div></div>)}</Card>;
  } catch (error) { return <ErrorState retryHref="/" message={error instanceof Error ? error.message : "Unable to load Firestore statistics."} />; }
}

async function ChallengeBoard() {
  try {
    const challenges = await getChallenges(3);
    if (challenges.length === 0) return <EmptyState message="Be among the first contributors" />;
    return <div className="mt-8 grid gap-5 md:grid-cols-3">{challenges.map((challenge) => <a href={`/challenges/${challenge.id}`} key={challenge.id}><Card className="h-full hover:border-blue-300"><div className="text-sm text-blue-300">{[challenge.category, challenge.status].filter(Boolean).join(" · ") || "Challenge"}</div><h3 className="mt-3 font-display text-2xl">{challenge.title}</h3><p className="mt-5 text-white/60">{challenge.description || "Details will be published by the organization."}</p></Card></a>)}</div>;
  } catch (error) { return <div className="mt-8"><ErrorState retryHref="/" message={error instanceof Error ? error.message : "Unable to load challenges from Firestore."} /></div>; }
}

export default function Home() {
  return <main className="overflow-hidden bg-[radial-gradient(circle_at_top,#0b3b78_0,#02050a_42%)]"><section className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_.95fr]"><div><p className="mb-5 text-sm uppercase tracking-[.35em] text-blue-300">Futuristic Industrial Intelligence</p><HeroTypewriter /><p className="mt-6 max-w-2xl text-xl text-white/70">Connecting industry challenges with talent, innovation and practical solutions.</p><div className="mt-9 flex flex-wrap gap-3"><Button href="/submit-challenge">Submit Problem</Button><Button href="/community" variant="secondary">Join Community</Button><Button href="/challenges" variant="secondary">Explore Challenges</Button><Button href="/msme-intelligence" variant="secondary">MSME Intelligence</Button></div></div><NetworkHero /></section><section className="mx-auto max-w-7xl px-6 py-20"><h2 className="font-display text-4xl">Live Challenge Board</h2><Suspense fallback={<LoadingState label="Loading challenges" />}><ChallengeBoard /></Suspense></section><section className="mx-auto max-w-7xl px-6 py-20"><h2 className="font-display text-4xl">Platform Statistics</h2><div className="mt-8"><Suspense fallback={<LoadingState label="Loading statistics" />}><HomeStats /></Suspense></div></section></main>;
}
