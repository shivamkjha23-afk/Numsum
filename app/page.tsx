import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState, LoadingState } from "@/components/data-states";
import { NetworkHero } from "@/components/network-hero";
import { HomeTypewriter } from "@/components/home-typewriter";
import { ProtectedLink } from "@/components/protected-link";
import { PersonaSwitcher } from "@/components/persona-switcher";
import { Button, Card } from "@/components/ui";
import { getProblemStatements, getPublicCompetitions, getPublicKnowledgeAssets, getPublicPilotTracks, getPublicResearchItems, getPublicSOPDocuments } from "@/lib/repositories/firestore";

export const metadata: Metadata = {
  title: "NumSum Labs — MSME Industrial Innovation & Problem Solving Ecosystem",
  description: "NumSum Labs helps MSMEs identify, structure, and solve industrial challenges through engineering collaboration, research, SOPs, innovation challenges, and pilot validation.",
  openGraph: { title: "NumSum Labs — MSME Industrial Innovation & Problem Solving Ecosystem", description: "Problem-first MSME industrial innovation through research, SOPs, challenges, pilots, and measurable impact." },
};

const whatWeDo = [
  ["Discover MSME Problems", "Help MSMEs submit real operational challenges without exposing private details.", "/submit-problem"],
  ["Structure Problem Statements", "Convert raw issues into clear public-safe problem statements after review.", "/problem-statements"],
  ["Conduct Admin Onboarding", "Use guided onboarding to understand process context, constraints, and expected outcomes.", "/submit-problem"],
  ["Build Knowledge & SOPs", "Publish approved knowledge assets and procedures that can support practical implementation.", "/knowledge"],
  ["Track Research & Technology", "Connect research insights and technology intelligence to MSME needs.", "/research"],
  ["Run Innovation Challenges", "Invite engineers, students, startups, and researchers to solve well-scoped problems.", "/competitions"],
  ["Execute Pilots", "Validate selected solutions through controlled pilots and implementation learning.", "/pilots"],
  ["Capture Success Stories", "Publish approved impact stories only after validation and MSME approval.", "/pilots"],
] as const;
const workflow = ["MSME Challenge Submitted", "Admin Review & Onboarding", "Structured Problem Statement", "Knowledge / SOP / Research Mapping", "Competition or Pilot", "Measurable Results", "Success Story"];
const focusAreas = ["Productivity Improvement", "Quality & Inspection", "Reliability & Maintenance", "Energy Efficiency", "Digital Transformation", "Automation & Data Capture", "Process Optimization", "Safety & Compliance", "Market / Export Readiness", "Product Development"];

async function PublicMetrics() {
  const [problems, knowledge, research, sops, competitions, pilots] = await Promise.all([
    getProblemStatements(100).catch(() => []), getPublicKnowledgeAssets().catch(() => []), getPublicResearchItems().catch(() => []), getPublicSOPDocuments().catch(() => []), getPublicCompetitions().catch(() => []), getPublicPilotTracks().catch(() => []),
  ]);
  const metrics = [[problems.length, "Public MSME Challenges", "Building our MSME problem intelligence base"], [knowledge.length, "Public Knowledge Assets", "Creating structured knowledge for industrial upgradation"], [research.length, "Public Research Items", "Connecting research insights to MSME priorities"], [sops.length, "Public SOPs", "Developing research-backed SOPs"], [competitions.length, "Public Competitions", "Preparing innovation challenges from structured problems"], [pilots.length, "Public Pilots / Impact Stories", "Preparing pilot-ready problem statements"]] as const;
  return <div className="grid gap-4 md:grid-cols-3">{metrics.map(([count, label, empty]) => <Card key={label} className="editorial-card"><p className="font-display text-4xl text-amber-100">{count > 0 ? count : "Founding stage"}</p><p className="mt-2 font-semibold uppercase tracking-[.12em]">{label}</p><p className="mt-2 text-sm text-white/60">{count > 0 ? "Public, approved records only." : empty}</p></Card>)}</div>;
}
async function Highlights() {
  const [problems, knowledge, research, competitions, pilots] = await Promise.all([getProblemStatements(3).catch(() => []), getPublicKnowledgeAssets().catch(() => []), getPublicResearchItems().catch(() => []), getPublicCompetitions().catch(() => []), getPublicPilotTracks().catch(() => [])]);
  return <div className="space-y-12">
    <section><h2 className="font-display text-4xl">Highlighted Success Stories / Impact</h2>{pilots.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{pilots.slice(0,3).map((p)=><Card key={p.id}><p className="text-sm text-blue-200">{p.industrySegment || "Pilot"}</p><h3 className="mt-2 text-2xl font-semibold">{p.title}</h3><p className="mt-3 text-white/65">{p.publicSummary || p.problemSummary}</p><p className="mt-3 text-sm text-white/55">Impact: {p.finalResults || p.expectedImpact || "Validation details published after approval."}</p></Card>)}</div> : <EmptyState message="Impact stories will be published after validated pilots and MSME approvals." />}</section>
    <section><h2 className="font-display text-4xl">Knowledge & Research Highlights</h2>{knowledge.length || research.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{[...knowledge.slice(0,2), ...research.slice(0,2)].slice(0,3).map((item) => <Card key={item.id}><p className="text-sm text-blue-200">{("researchType" in item ? item.researchType : item.category) || "Public resource"}</p><h3 className="mt-2 text-2xl font-semibold">{item.title}</h3><p className="mt-3 text-white/65">{("practicalRelevance" in item && item.practicalRelevance) || ("shortDescription" in item && item.shortDescription) || item.summary || "Approved public resource."}</p></Card>)}</div> : <EmptyState message="Public knowledge and research highlights will appear after approval." />}</section>
    <section><h2 className="font-display text-4xl">Competitions / Innovation Challenges</h2>{competitions.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{competitions.slice(0,3).map((c)=><Card key={c.id}><p className="text-sm text-blue-200">{[c.theme, c.industrySegment, c.status].filter(Boolean).join(" · ")}</p><h3 className="mt-2 text-2xl font-semibold">{c.title}</h3><p className="mt-3 text-white/65">{c.shortDescription || c.description}</p><div className="mt-4"><Button href={`/competitions/${c.slug || c.id}`}>View Challenge</Button></div></Card>)}</div> : <EmptyState message="Upcoming MSME innovation challenges will appear here." />}</section>
    <section><h2 className="font-display text-4xl">Explore MSME Challenges</h2>{problems.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{problems.map((p)=><Card key={p.id}><p className="text-sm text-blue-200">{[p.industrySegment, p.category].filter(Boolean).join(" · ")}</p><h3 className="mt-2 text-2xl font-semibold">{p.title}</h3><p className="mt-3 text-white/65">{p.shortDescription || p.summary || p.description}</p></Card>)}</div> : <EmptyState message="Public MSME challenges will appear after admin review and approval." />}</section>
  </div>;
}
export default function Home() {
  return <main className="overflow-hidden bg-[#060504] text-[#fff8ea]">
    <section className="relative mx-auto flex min-h-[78vh] max-w-7xl flex-col items-center gap-12 px-6 py-16 text-center md:py-24">
      <div className="hero-orb hero-orb-a" />
      <div className="hero-orb hero-orb-b" />
      <div className="relative z-10 max-w-6xl">
        <p className="mb-5 text-sm uppercase tracking-[.55em] text-amber-200/80">(MSME-first industrial innovation)</p>
        <h1 className="min-h-[8rem] font-display text-4xl font-bold uppercase leading-[.92] tracking-[-.05em] sm:min-h-[7rem] md:text-8xl"><HomeTypewriter /></h1>
        <p className="mx-auto mt-7 max-w-3xl text-xl leading-8 text-white/72">NumSum Labs helps MSMEs document real operational problems, connect them with engineering knowledge, research, SOPs, innovation challenges, and pilot-based validation.</p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[.35em] text-amber-100/80">Problem-first · MSME-first · Built for industrial upgradation</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ProtectedLink href="/submit-problem" className="rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-black transition hover:bg-white">Submit MSME Challenge</ProtectedLink>
          <Button href="/problem-statements" variant="secondary">Explore MSME Challenges</Button>
          <Button href="/knowledge" variant="secondary">Knowledge library</Button>
        </div>
      </div>
      <div className="relative z-10 w-full pt-2"><NetworkHero /></div>
    </section>
    <section className="border-y border-white/10 bg-white/[0.03] py-5">
      <div className="marquee-track text-sm font-semibold uppercase tracking-[.35em] text-white/55"><span>Trusted problem-to-impact workflows</span><span>Research-backed SOPs</span><span>Pilot-ready innovation challenges</span><span>Public-safe MSME knowledge</span></div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm uppercase tracking-[.4em] text-amber-200/70">(Services)</p>
      <h2 className="mt-3 font-display text-5xl uppercase tracking-[-.04em]">What NumSum Labs Does</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">{whatWeDo.map(([title, text, href], index) => <a href={href} key={title}><Card className="editorial-card h-full hover:border-amber-200"><p className="mb-5 text-sm text-amber-100/70">0{index + 1}.</p><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm text-white/62">{text}</p></Card></a>)}</div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm uppercase tracking-[.4em] text-amber-200/70">(Workflow)</p>
      <h2 className="mt-3 font-display text-5xl uppercase tracking-[-.04em]">MSME Problem-to-Impact Workflow</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-7" aria-label="MSME problem-to-impact steps">{workflow.map((step,i)=><div className="relative border border-white/10 bg-[#11100d] p-4 shadow-[0_20px_60px_rgba(0,0,0,.22)]" key={step}>{i < workflow.length - 1 && <span aria-hidden="true" className="absolute left-full top-8 hidden h-px w-4 bg-amber-200/40 md:block" />}<p className="font-mono text-xs text-amber-200">STEP {String(i+1).padStart(2,"0")}</p><p className="mt-2 font-semibold">{step}</p></div>)}</div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm uppercase tracking-[.4em] text-amber-200/70">(Focus)</p>
      <h2 className="mt-3 font-display text-5xl uppercase tracking-[-.04em]">Key Focus Areas</h2>
      <div className="mt-8 flex flex-wrap gap-3">{focusAreas.map((f)=><span key={f} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-white/75 transition hover:border-amber-200/60 hover:text-amber-50">{f}</span>)}</div>
    </section>
    <PersonaSwitcher />
    <section className="mx-auto max-w-7xl px-6 py-16"><Card className="border-amber-200/30 bg-[#11100d]"><p className="text-sm uppercase tracking-[.35em] text-amber-200/70">(Founding stage)</p><h2 className="mt-3 font-display text-4xl uppercase tracking-[-.03em]">Public knowledge base is launching with approved records only.</h2><p className="mt-4 max-w-3xl text-white/65">Instead of showing hollow counters, NumSum publishes challenges, knowledge, SOPs, competitions, and pilots only after review. Be part of the founding cohort by submitting the first real MSME challenge or joining as a contributor.</p><div className="mt-6 flex flex-wrap gap-3"><ProtectedLink href="/submit-problem" className="rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-black transition hover:bg-white">Submit MSME Challenge</ProtectedLink><Button href="/join" variant="secondary">Join as contributor</Button></div><div className="mt-8"><Suspense fallback={<LoadingState label="Loading public launch data" />}><PublicMetrics /></Suspense></div></Card></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><Suspense fallback={<LoadingState label="Loading public highlights" />}><Highlights /></Suspense></section>
    <section className="mx-auto max-w-7xl px-6 py-20"><Card className="text-center"><h2 className="font-display text-4xl">Ready to structure a real MSME challenge?</h2><p className="mx-auto mt-4 max-w-2xl text-white/65">Start with a private challenge submission. NumSum Labs will keep review data private and publish only approved public-safe outputs.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><ProtectedLink href="/submit-problem" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Submit MSME Challenge</ProtectedLink><Button href="/join" variant="secondary">Create Profile / Join as Member</Button></div></Card></section>
  </main>;
}
