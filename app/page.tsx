import type { Metadata } from "next";
import { Suspense } from "react";
import { EmptyState, LoadingState } from "@/components/data-states";
import { HeroShowcase } from "@/components/hero-showcase";
import { HomeSplash } from "@/components/home-splash";
import { ProtectedLink } from "@/components/protected-link";
import { Button, Card } from "@/components/ui";
import { PublicImpactMetricCards } from "@/components/public-impact-metrics";
import { PublicReviewCarousel } from "@/components/public-review-carousel";
import { getPublicCaseStudies } from "@/lib/case-studies";
import { getPublicChallenges } from "@/lib/repositories/firestore";

export const metadata: Metadata = {
  title: "NumSum Labs — MSME Industrial Innovation & Problem Solving Ecosystem",
  description: "NumSum Labs helps MSMEs identify, structure, and solve industrial challenges through engineering collaboration, research, SOPs, innovation challenges, and pilot validation.",
};

const personas = [
  ["MSME Owner", "Structure a real problem and find a practical solution path.", "Submit Problem", "/submit-problem"],
  ["Student", "Solve industry-backed challenges and build proof of work.", "Explore Challenges", "/challenges"],
  ["Researcher", "Connect evidence and applied research to MSME priorities.", "Join Community", "/community"],
  ["Industry Expert", "Guide diagnostics, reviews, SOPs, and implementation choices.", "See Challenges", "/challenges"],
  ["Startup / Solution Provider", "Validate technology against approved industrial needs.", "View Case Studies", "/case-studies"],
] as const;
const steps = ["Submit problem", "Structure with NumSum", "Launch challenge / solution path", "Track impact"] as const;

async function FeaturedChallenges() {
  const challenges = await getPublicChallenges().catch(() => []);
  return <section id="featured-challenges" className="mx-auto max-w-7xl px-6 py-14"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="section-eyebrow">Featured challenges</p><h2 className="section-title">Open problems, cleanly scoped.</h2></div><Button href="/challenges" variant="secondary">View all challenges</Button></div>{challenges.length ? <div className="mt-8 grid gap-5 md:grid-cols-3">{challenges.slice(0,3).map((c)=><Card key={c.id} className="premium-card h-full"><p className="text-sm text-blue-200">{[c.theme, c.industrySegment, c.status].filter(Boolean).join(" · ")}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.03em]">{c.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{c.shortDescription || c.description}</p><div className="mt-5"><Button href={`/challenges/${c.slug || c.id}`}>View Challenge</Button></div></Card>)}</div> : <div className="mt-8"><EmptyState message="Upcoming MSME innovation challenges will appear here after review." /></div>}</section>;
}

async function CaseStudiesPreview() {
  const cases = await getPublicCaseStudies().catch(() => []);
  return <section className="mx-auto max-w-7xl px-6 py-14"><div className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="section-eyebrow">Case studies</p><h2 className="section-title">Evidence before scale.</h2></div><Button href="/case-studies" variant="secondary">View case studies</Button></div>{cases.length ? <div className="mt-8 grid gap-5 md:grid-cols-3">{cases.slice(0,3).map((item) => <Card key={item.id} className="premium-card h-full"><p className="text-sm text-blue-200">{item.sector} · {item.problemType}</p><h3 className="mt-3 text-2xl font-semibold tracking-[-.03em]">{item.title}</h3><p className="mt-3 text-sm leading-6 text-white/65">{item.problem}</p><p className="mt-4 text-sm font-semibold text-amber-100">{item.impactMetric}</p><div className="mt-5"><Button href={`/case-studies/${item.slug}`}>Read case study</Button></div></Card>)}</div> : <div className="mt-8"><EmptyState message="Approved case studies will appear here after validation." /></div>}</section>;
}

export default function Home() {
  return <main className="overflow-hidden bg-[#060504] text-[#fff8ea]">
    <HomeSplash />
    <section className="relative mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 px-6 py-12 md:grid-cols-[1.02fr_.98fr] md:py-16 lg:py-20">
      <div className="hero-orb hero-orb-a" /><div className="hero-orb hero-orb-b" />
      <div className="relative z-10 max-w-3xl">
        <p className="mb-5 inline-flex rounded-full border border-amber-200/20 bg-amber-200/10 px-4 py-2 text-xs font-semibold uppercase tracking-[.22em] text-amber-100/85">MSME-first industrial innovation</p>
        <h1 className="font-display text-4xl font-bold leading-[1.02] tracking-[-.055em] sm:text-5xl lg:text-6xl">Turn industrial problems into solved challenges.</h1>
        <p className="mt-6 max-w-2xl text-base leading-7 text-white/70 md:text-lg md:leading-8">NumSum Labs helps MSMEs structure real business problems, connect with experts, run innovation challenges, and track measurable impact.</p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap"><ProtectedLink href="/submit-problem" className="rounded-full bg-amber-100 px-5 py-3 text-center text-sm font-semibold text-black shadow-[0_18px_60px_rgba(245,158,11,.22)] transition hover:bg-white">Submit Problem</ProtectedLink><Button href="/challenges" variant="secondary">Explore Challenges</Button><Button href="#how-it-works" variant="secondary">See How It Works</Button><Button href="/case-studies" variant="secondary">View Case Studies</Button></div>
      </div>
      <div className="relative z-10"><HeroShowcase /></div>
    </section>

    <section className="mx-auto max-w-7xl px-6 py-14"><p className="section-eyebrow">What brings you to NumSum?</p><h2 className="section-title">Choose your path.</h2><div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{personas.map(([title, benefit, cta, href]) => <Card key={title} className="premium-card flex h-full flex-col"><h3 className="text-xl font-semibold">{title}</h3><p className="mt-3 flex-1 text-sm leading-6 text-white/65">{benefit}</p><Button href={href} variant="secondary" className="mt-5">{cta}</Button></Card>)}</div></section>

    <section id="how-it-works" className="mx-auto max-w-7xl px-6 py-14"><p className="section-eyebrow">How NumSum works</p><h2 className="section-title">A disciplined route from issue to outcome.</h2><div className="mt-8 grid gap-4 md:grid-cols-4">{steps.map((step, index) => <Card key={step} className="premium-card relative"><p className="text-sm font-semibold text-amber-100/80">0{index + 1}</p><h3 className="mt-6 text-xl font-semibold">{step}</h3><p className="mt-3 text-sm leading-6 text-white/60">{index === 0 ? "Private intake starts the journey." : index === 1 ? "Review turns noise into scope." : index === 2 ? "The right contributors engage." : "Approved metrics become learning."}</p></Card>)}</div></section>

    <section className="mx-auto max-w-7xl px-6 py-14"><p className="section-eyebrow">Impact metrics</p><h2 className="section-title">Public, approved progress signals.</h2><div className="mt-8"><Suspense fallback={<LoadingState label="Loading public metrics" />}><PublicImpactMetricCards /></Suspense></div></section>
    <Suspense fallback={<section className="mx-auto max-w-7xl px-6 py-14"><LoadingState label="Loading challenges" /></section>}><FeaturedChallenges /></Suspense>
    <Suspense fallback={<section className="mx-auto max-w-7xl px-6 py-14"><LoadingState label="Loading case studies" /></section>}><CaseStudiesPreview /></Suspense>
    <section className="mx-auto max-w-7xl px-6 py-14"><p className="section-eyebrow">Reviews</p><h2 className="section-title">Compact feedback from the ecosystem.</h2><div className="mt-8"><Suspense fallback={<LoadingState label="Loading reviews" />}><PublicReviewCarousel /></Suspense></div></section>
    <section className="mx-auto max-w-7xl px-6 py-20"><Card className="premium-card text-center"><h2 className="font-display text-3xl font-semibold tracking-[-.04em] md:text-5xl">Ready to solve your industrial problem?</h2><p className="mx-auto mt-4 max-w-2xl text-white/65">Start with a private submission or join the member network to participate in practical MSME innovation.</p><div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"><ProtectedLink href="/submit-problem" className="rounded-full bg-amber-100 px-5 py-3 text-sm font-semibold text-black">Submit Problem</ProtectedLink><Button href="/join" variant="secondary">Join as Member</Button></div></Card></section>
  </main>;
}
