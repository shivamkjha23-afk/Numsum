import { notFound } from "next/navigation";
import { CaseStudyActions } from "@/components/case-study-actions";
import { Card } from "@/components/ui";
import { getPublicCaseStudyBySlug } from "@/lib/case-studies";

export default async function CaseStudyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = await getPublicCaseStudyBySlug(slug);
  if (!item) notFound();
  return <main className="min-h-screen bg-navy px-6 py-16 text-white"><article className="mx-auto max-w-4xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">{item.sector} · {item.problemType}</p><h1 className="mt-4 font-display text-5xl">{item.title}</h1><div className="mt-5 flex flex-wrap gap-3 text-sm text-white/55"><span>{item.readTime}</span><span>Impact: {item.impactMetric}</span><span>↑ {item.upvotes}</span><span>{item.comments} comments</span></div><div className="mt-5 flex flex-wrap gap-2">{item.tags.map((tag) => <span key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs">#{tag}</span>)}</div><div className="mt-10 grid gap-6"><Section title="Problem" body={item.problem} /><Section title="Context" body={item.context} /><Section title="Solution approach" body={item.solutionApproach} /><Section title="Impact" body={item.impact} /><Card><h2 className="font-display text-3xl">Lessons learned</h2><ul className="mt-4 list-disc space-y-2 pl-5 text-white/70">{item.lessonsLearned.map((lesson) => <li key={lesson}>{lesson}</li>)}</ul></Card><CaseStudyActions caseStudyId={item.id} title={item.title} /></div></article></main>;
}
function Section({ title, body }: { title: string; body: string }) { return <Card><h2 className="font-display text-3xl">{title}</h2><p className="mt-4 leading-8 text-white/72">{body}</p></Card>; }
