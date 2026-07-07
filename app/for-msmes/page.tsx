import { ProtectedLink } from "@/components/protected-link";
import { Button, Card } from "@/components/ui";
import { PublicImpactMetricCards } from "@/components/public-impact-metrics";
import { PublicReviewCarousel } from "@/components/public-review-carousel";

const steps = [
  ["Submit industrial problem", "Share the operational issue privately with sector, process, current workaround, evidence, and consent."],
  ["NumSum structures the problem", "The raw issue is converted into a clearer problem statement while confidential data remains protected."],
  ["Admin onboarding happens later", "Admins can follow up with questionnaires, calls, meeting notes, and MOM records in Phase 2 workflows."],
  ["Solution/challenge path is created", "The problem can become a challenge, solution sprint, research task, pilot, or internal improvement track."],
  ["Impact is tracked", "Savings, time saved, waste reduction, productivity gain, clients gained, and reviews can be captured after validation."],
];

export default function ForMSMEsPage() {
  return <main className="min-h-screen bg-navy px-6 py-16 text-white"><div className="mx-auto max-w-6xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">For MSMEs</p><h1 className="mt-4 font-display text-5xl">Turn operational problems into structured solution pathways.</h1><p className="mt-4 max-w-3xl text-white/65">NumSum Labs helps MSME owners submit real industrial problems, complete onboarding, receive practical collaboration, and publish only approved public-safe outcomes.</p><div className="mt-8 flex flex-wrap gap-3"><ProtectedLink href="/submit-problem" className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Submit Your Problem</ProtectedLink><ProtectedLink href="/dashboard/problems" className="rounded-full border border-white/10 px-5 py-3 text-white">View My Problems</ProtectedLink><Button href="/challenges" variant="secondary">Explore Challenges</Button></div><div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-5">{steps.map(([title, text], index) => <Card key={title}><p className="text-blue-200">Step {index + 1}</p><h2 className="mt-3 text-xl font-semibold">{title}</h2><p className="mt-3 text-sm text-white/60">{text}</p></Card>)}</div><section className="mt-12"><h2 className="font-display text-3xl">Public impact metrics</h2><div className="mt-5"><PublicImpactMetricCards /></div></section><section className="mt-12"><PublicReviewCarousel /></section></div></main>;
}
