import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState, LoadingState } from "@/components/data-states";
import { NetworkHero } from "@/components/network-hero";
import { ProtectedLink } from "@/components/protected-link";
import { Button, Card } from "@/components/ui";
import { PublicImpactMetricCards } from "@/components/public-impact-metrics";
import { PublicReviewCarousel } from "@/components/public-review-carousel";
import { getPublicCaseStudies } from "@/lib/case-studies";
import { getProblemStatements, getPublicChallenges, getPublicKnowledgeAssets, getPublicPilotTracks, getPublicResearchItems, getPublicSOPDocuments, listPublicDiscussionThreads } from "@/lib/repositories/firestore";

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
  ["Run Innovation Challenges", "Invite engineers, students, startups, and researchers to solve well-scoped problems.", "/challenges"],
  ["Execute Pilots", "Validate selected solutions through controlled pilots and implementation learning.", "/pilots"],
  ["Capture Success Stories", "Publish approved impact stories only after validation and MSME approval.", "/pilots"],
] as const;
const workflow = ["MSME submits problem", "Admin reviews and onboards", "Questions and meeting notes are recorded", "Challenge or solution path is created", "Members participate", "Admin evaluates solution", "Result, case study, and impact metrics are published"];
const focusAreas = ["Productivity Improvement", "Quality & Inspection", "Reliability & Maintenance", "Energy Efficiency", "Digital Transformation", "Automation & Data Capture", "Process Optimization", "Safety & Compliance", "Market / Export Readiness", "Product Development"];
const stakeholders = [
  ["MSMEs", "Submit real industrial challenges, receive structured onboarding, and track practical outcomes."],
  ["Students", "Join challenges, form teams, and submit solutions for real industry problems."],
  ["Researchers", "Connect research evidence, patents, and collaboration interests with industrial needs."],
  ["Engineers / Professionals", "Translate structured problems into feasible technical solutions and implementation plans."],
  ["Startups / Technology Providers", "Validate products and services against MSME needs before scaling."],
  ["Consultants / Industry Experts", "Support diagnostics, implementation planning, and SOP development."],
];
const personas = [
  ["I am an MSME owner", "Submit an industrial problem, complete onboarding, and review outcomes.", "Start by submitting your MSME problem", "Problem intake · Meeting notes · Reviews"],
  ["I am a student", "Browse challenges, join teams, and build solutions for real MSMEs.", "Explore open challenges", "Challenges · Teams · Community"],
  ["I am a researcher", "Share evidence, technology ideas, patents, and collaboration needs.", "Join community discussions", "Research · Case studies · Collaboration"],
  ["I am an engineer / professional", "Contribute field knowledge and solution approaches to practical problems.", "Explore challenges", "Challenges · Community · Case studies"],
  ["I am a startup / technology provider", "Map products to validated MSME needs and discover pilot opportunities.", "View case studies", "Case studies · Community · Challenges"],
] as const;
const reviews = [
  ["The onboarding clarified our production bottleneck before any solution was proposed.", "5", "Manufacturing quality issue", "feedback given 14 days ago", "Auto components"],
  ["The challenge format helped us receive practical ideas from students and professionals.", "4.5", "Packaging wastage", "feedback given 21 days ago", "Packaging"],
  ["Meeting notes and action items made it easy to track what changed on the shop floor.", "5", "Downtime reduction", "feedback given 32 days ago", "Food processing"],
] as const;

async function PublicMetrics() {
  const [problems, knowledge, research, sops, challenges, pilots] = await Promise.all([
    getProblemStatements(100).catch(() => []), getPublicKnowledgeAssets().catch(() => []), getPublicResearchItems().catch(() => []), getPublicSOPDocuments().catch(() => []), getPublicChallenges().catch(() => []), getPublicPilotTracks().catch(() => []),
  ]);
  const metrics = [[problems.length, "Public MSME Challenges", "Building our MSME problem intelligence base"], [knowledge.length, "Public Knowledge Assets", "Creating structured knowledge for industrial upgradation"], [research.length, "Public Research Items", "Connecting research insights to MSME priorities"], [sops.length, "Public SOPs", "Developing research-backed SOPs"], [challenges.length, "Public Challenges", "Preparing innovation challenges from structured problems"], [pilots.length, "Public Pilots / Impact Stories", "Preparing pilot-ready problem statements"]] as const;
  return <div className="grid gap-4 md:grid-cols-3">{metrics.map(([count, label, empty]) => <Card key={label} className="editorial-card"><p className="font-display text-4xl text-amber-100">{count > 0 ? count : "Founding stage"}</p><p className="mt-2 font-semibold uppercase tracking-[.12em]">{label}</p><p className="mt-2 text-sm text-white/60">{count > 0 ? "Public, approved records only." : empty}</p></Card>)}</div>;
}

async function CaseStudiesPreview() {
  const cases = await getPublicCaseStudies().catch(() => []);
  return <section><h2 className="font-display text-4xl">Case Studies Preview</h2><p className="mt-3 max-w-3xl text-white/60">Public-safe stories show sector, problem type, solution approach, and measurable impact after approval.</p><div className="mt-6 grid gap-5 md:grid-cols-3">{cases.slice(0,3).map((item) => <Card key={item.id}><p className="text-sm text-blue-200">{item.sector} · {item.problemType}</p><h3 className="mt-2 text-2xl font-semibold">{item.title}</h3><p className="mt-3 text-white/65">{item.problem}</p><p className="mt-3 text-sm text-amber-100">{item.impactMetric}</p><div className="mt-4"><Button href={`/case-studies/${item.slug}`}>Read case study</Button></div></Card>)}</div></section>;
}
async function CommunityPreview() {
  const posts = await listPublicDiscussionThreads().catch(() => []);
  const examples = posts.length ? posts.slice(0,3) : [{ id: "example-msme", slug: "community", title: "Example: textile inventory improvement discussion", summary: "Public community posts let MSMEs, students, researchers, engineers, and startups discuss non-confidential problem-solving ideas.", category: "msme_need", tags: ["textile", "inventory"] }, { id: "example-research", slug: "community", title: "Example: research collaboration for visual inspection", summary: "Members can seek collaborators and link posts to research items, challenges, case studies, or sectors.", category: "research_discussion", tags: ["quality", "research"] }];
  return <section><h2 className="font-display text-4xl">Community Preview</h2><p className="mt-3 max-w-3xl text-white/60">Public visitors can read selected posts. Full posting, commenting, and collaboration require a complete member profile.</p><div className="mt-6 grid gap-5 md:grid-cols-3">{examples.map((post) => <Card key={post.id}><p className="text-sm text-blue-200">{String(post.category).replaceAll("_", " ")}</p><h3 className="mt-2 text-2xl font-semibold">{post.title}</h3><p className="mt-3 text-white/65">{post.summary}</p><p className="mt-3 text-sm text-white/45">{(post.tags || []).join(", ")}</p><div className="mt-4"><Button href="/community" variant="secondary">Open community</Button></div></Card>)}</div></section>;
}
async function Highlights() {
  const [problems, knowledge, research, challenges, pilots] = await Promise.all([getProblemStatements(3).catch(() => []), getPublicKnowledgeAssets().catch(() => []), getPublicResearchItems().catch(() => []), getPublicChallenges().catch(() => []), getPublicPilotTracks().catch(() => [])]);
  return <div className="space-y-12">
    <section><h2 className="font-display text-4xl">Highlighted Success Stories / Impact</h2>{pilots.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{pilots.slice(0,3).map((p)=><Card key={p.id}><p className="text-sm text-blue-200">{p.industrySegment || "Pilot"}</p><h3 className="mt-2 text-2xl font-semibold">{p.title}</h3><p className="mt-3 text-white/65">{p.publicSummary || p.problemSummary}</p><p className="mt-3 text-sm text-white/55">Impact: {p.finalResults || p.expectedImpact || "Validation details published after approval."}</p></Card>)}</div> : <EmptyState message="Impact stories will be published after validated pilots and MSME approvals." />}</section>
    <section><h2 className="font-display text-4xl">Knowledge & Research Highlights</h2>{knowledge.length || research.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{[...knowledge.slice(0,2), ...research.slice(0,2)].slice(0,3).map((item) => <Card key={item.id}><p className="text-sm text-blue-200">{("researchType" in item ? item.researchType : item.category) || "Public resource"}</p><h3 className="mt-2 text-2xl font-semibold">{item.title}</h3><p className="mt-3 text-white/65">{("practicalRelevance" in item && item.practicalRelevance) || ("shortDescription" in item && item.shortDescription) || item.summary || "Approved public resource."}</p></Card>)}</div> : <EmptyState message="Public knowledge and research highlights will appear after approval." />}</section>
    <section><h2 className="font-display text-4xl">Featured Challenges</h2>{challenges.length ? <div className="mt-6 grid gap-5 md:grid-cols-3">{challenges.slice(0,3).map((c)=><Card key={c.id}><p className="text-sm text-blue-200">{[c.theme, c.industrySegment, c.status].filter(Boolean).join(" · ")}</p><h3 className="mt-2 text-2xl font-semibold">{c.title}</h3><p className="mt-3 text-white/65">{c.shortDescription || c.description}</p><div className="mt-4"><Button href={`/challenges/${c.slug || c.id}`}>View Challenge</Button></div></Card>)}</div> : <EmptyState message="Upcoming MSME innovation challenges will appear here." />}</section>
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
        <h1 className="font-display text-4xl font-bold uppercase leading-[.92] tracking-[-.05em] md:text-7xl">NumSum Labs helps MSMEs turn real industrial problems into solved challenges.</h1>
        <p className="mx-auto mt-7 max-w-3xl text-xl leading-8 text-white/72">Submit problems, connect with experts, run innovation challenges, track outcomes, and build practical industrial knowledge.</p>
        <p className="mt-5 text-sm font-semibold uppercase tracking-[.35em] text-amber-100/80">Problem-first · MSME-first · Built for industrial upgradation</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <ProtectedLink href="/submit-problem" className="rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-black transition hover:bg-white">Submit Your MSME Problem</ProtectedLink>
          <Button href="/challenges" variant="secondary">Explore Challenges</Button>
          <Button href="/join" variant="secondary">Join as Member</Button>
          <Button href="/case-studies" variant="secondary">View Case Studies</Button>
        </div>
      </div>
      <div className="relative z-10 w-full pt-2"><NetworkHero /></div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-12">
      <p className="text-sm uppercase tracking-[.4em] text-amber-200/70">(Find your path)</p>
      <h2 className="mt-3 font-display text-5xl uppercase tracking-[-.04em]">What can you do here?</h2>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{personas.map(([title, canDo, action, modules]) => <Card key={title} className="editorial-card"><h3 className="text-lg font-semibold">{title}</h3><p className="mt-3 text-sm text-white/65">{canDo}</p><p className="mt-4 text-sm font-semibold text-amber-100">{action}</p><p className="mt-2 text-xs uppercase tracking-[.16em] text-blue-200">{modules}</p></Card>)}</div>
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
      <div className="mt-8 grid gap-3 md:grid-cols-7">{workflow.map((step,i)=><div className="rounded-[2rem] border border-white/10 bg-[#11100d] p-4 shadow-[0_20px_60px_rgba(0,0,0,.22)]" key={step}><p className="text-xs text-blue-200">Step {i+1}</p><p className="mt-2 font-semibold">{step}</p></div>)}</div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16">
      <p className="text-sm uppercase tracking-[.4em] text-amber-200/70">(Focus)</p>
      <h2 className="mt-3 font-display text-5xl uppercase tracking-[-.04em]">Key Focus Areas</h2>
      <div className="mt-8 flex flex-wrap gap-3">{focusAreas.map((f)=><span key={f} className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-3 text-white/75 transition hover:border-amber-200/60 hover:text-amber-50">{f}</span>)}</div>
    </section>
    <section className="mx-auto max-w-7xl px-6 py-16"><h2 className="font-display text-4xl">Platform Modules</h2><p className="mt-3 max-w-3xl text-white/62">Public pages expose only approved challenges, knowledge, research, SOPs, challenges, and impact records. Review, governance, execution, and contribution operations remain internal.</p></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><h2 className="font-display text-4xl">Public Metrics</h2><div className="mt-8"><Suspense fallback={<LoadingState label="Loading public metrics" />}><PublicImpactMetricCards /></Suspense></div></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><Suspense fallback={<LoadingState label="Loading reviews" />}><PublicReviewCarousel /></Suspense></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><Suspense fallback={<LoadingState label="Loading public highlights" />}><Highlights /></Suspense></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><Suspense fallback={<LoadingState label="Loading case studies" />}><CaseStudiesPreview /></Suspense></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><Suspense fallback={<LoadingState label="Loading community preview" />}><CommunityPreview /></Suspense></section>
    <section className="mx-auto max-w-7xl px-6 py-16"><h2 className="font-display text-4xl">Who Can Participate</h2><div className="mt-8 grid gap-4 md:grid-cols-3">{stakeholders.map(([title,text])=><Card key={title}><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 text-sm text-white/62">{text}</p></Card>)}</div></section>
    <section className="mx-auto max-w-7xl px-6 py-20"><Card className="text-center"><h2 className="font-display text-4xl">Ready to structure a real MSME challenge?</h2><p className="mx-auto mt-4 max-w-2xl text-white/65">Start with a private challenge submission. NumSum Labs will keep review data private and publish only approved public-safe outputs.</p><div className="mt-8 flex flex-wrap justify-center gap-3"><ProtectedLink href="/submit-problem" className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-black">Submit Your MSME Problem</ProtectedLink><Button href="/join" variant="secondary">Create Profile / Join as Member</Button><Button href="/research" variant="secondary">Explore Knowledge & Research</Button><Button href="/challenges" variant="secondary">Explore Challenges</Button></div></Card></section>
  </main>;
}
