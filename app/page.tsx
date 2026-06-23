import { EmptyState, ErrorState } from "@/components/data-states";
import { NetworkHero } from "@/components/network-hero";
import { Button, Card } from "@/components/ui";
import { getChallenges, getOrganizationStats } from "@/lib/repositories/firestore";
import type { Challenge, OrganizationStats } from "@/lib/types";

function ChallengeBoard({ challenges }: { challenges: Challenge[] }) {
  if (challenges.length === 0) {
    return <EmptyState message="No public challenges are available yet. When organizations publish challenges, they will appear here." />;
  }

  return <div className="mt-8 grid gap-5 md:grid-cols-3">{challenges.map((challenge) => <a href={`/challenges/${challenge.id}`} key={challenge.id}><Card className="h-full hover:border-blue-300"><div className="text-sm text-blue-300">{[challenge.category, challenge.status].filter(Boolean).join(" · ") || "Challenge"}</div><h3 className="mt-3 font-display text-2xl">{challenge.title}</h3><p className="mt-5 text-white/60">{[typeof challenge.participants === "number" ? `${challenge.participants} participants` : undefined, challenge.difficulty, challenge.timeline].filter(Boolean).join(" · ") || "Details will be published by the organization."}</p>{challenge.reward && <p className="mt-3 text-white">{challenge.reward}</p>}</Card></a>)}</div>;
}

function OrganizationStatsPanel({ stats }: { stats: OrganizationStats }) {
  if (stats.organizations === 0 && stats.challenges === 0) {
    return <EmptyState message="Organization statistics will appear after the first organization or challenge record is published in Firestore." />;
  }

  return <Card className="grid gap-8 md:grid-cols-2">{[[stats.organizations, "Organizations"], [stats.challenges, "Challenges"]].map(([value, label]) => <div key={label}><div className="font-display text-4xl text-blue-300">{value}</div><div className="text-white/60">{label}</div></div>)}</Card>;
}

export default async function Home() {
  let challenges: Challenge[] = [];
  let stats: OrganizationStats | null = null;
  let errorMessage: string | null = null;

  try {
    [challenges, stats] = await Promise.all([getChallenges(3), getOrganizationStats()]);
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Unable to load Firestore data.";
  }

  return <main className="overflow-hidden bg-[radial-gradient(circle_at_top,#0b3b78_0,#02050a_42%)]"><nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6"><div className="font-display text-2xl font-bold">NumSum</div><div className="hidden gap-6 text-sm text-white/70 md:flex"><a href="/">Home</a><a href="/challenges">Challenges</a><a href="/msme-intelligence">MSME Intelligence</a><a href="/research">Research</a><a href="/community">Community</a><a href="/competitions">Competitions</a><a href="/organizations">Organizations</a><a href="/knowledge">Knowledge Hub</a></div></nav><section className="mx-auto grid min-h-[86vh] max-w-7xl items-center gap-10 px-6 py-16 lg:grid-cols-[1fr_.95fr]"><div><p className="mb-5 text-sm uppercase tracking-[.35em] text-blue-300">Futuristic Industrial Intelligence</p><h1 className="font-display text-6xl font-bold tracking-tight md:text-8xl">Solving Problems That Matter</h1><p className="mt-6 max-w-2xl text-xl text-white/70">Connecting industry challenges with talent, innovation and practical solutions.</p><div className="mt-9 flex flex-wrap gap-3"><Button href="/submit-challenge">Submit Challenge</Button><Button href="/community" variant="secondary">Join Community</Button><Button href="/challenges" variant="secondary">Explore Challenges</Button><Button href="/msme-intelligence" variant="secondary">MSME Intelligence</Button><Button href="#how" variant="secondary">Watch How It Works</Button></div></div><NetworkHero /></section><section className="mx-auto max-w-7xl px-6 py-20"><div className="grid gap-5 md:grid-cols-3"><Card><h2 className="font-display text-2xl">Organizations face problems.</h2><p className="mt-3 text-white/65">NumSum converts ambiguous industrial needs into structured, validated challenges.</p></Card><Card><h2 className="font-display text-2xl">Talent seeks opportunities.</h2><p className="mt-3 text-white/65">Researchers, engineers and innovators collaborate in challenge workspaces.</p></Card><Card><h2 className="font-display text-2xl">Innovation needs direction.</h2><p className="mt-3 text-white/65">A governed ecosystem turns research and execution into measurable impact.</p></Card></div></section><section id="how" className="mx-auto max-w-7xl px-6 py-20"><h2 className="font-display text-4xl">How it works</h2><div className="mt-8 grid gap-3 md:grid-cols-7">{["Problem", "Challenge", "Research", "Collaboration", "Solution", "Validation", "Impact"].map((item, index) => <Card key={item} className="text-center"><div className="text-blue-300">0{index + 1}</div><div className="mt-2 font-semibold">{item}</div></Card>)}</div></section><section className="mx-auto max-w-7xl px-6 py-20"><h2 className="font-display text-4xl">Live Challenge Board</h2>{errorMessage ? <div className="mt-8"><ErrorState message={errorMessage} /></div> : <ChallengeBoard challenges={challenges} />}</section><section className="mx-auto max-w-7xl px-6 py-20"><h2 className="font-display text-4xl">Organization Statistics</h2><div className="mt-8">{errorMessage ? <ErrorState message="Organization statistics could not be loaded from Firestore." /> : stats && <OrganizationStatsPanel stats={stats} />}</div></section></main>;
}
