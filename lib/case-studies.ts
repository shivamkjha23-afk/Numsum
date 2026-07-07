import { getPublicAdminCaseStudies, getPublicKnowledgeAssets, getPublicPilotTracks } from "@/lib/repositories/firestore";
import type { CaseStudy } from "@/lib/types";

export type PublicCaseStudy = {
  id: string;
  slug: string;
  title: string;
  sector: string;
  problemType: string;
  impactMetric: string;
  tags: string[];
  readTime: string;
  upvotes: number;
  comments: number;
  problem: string;
  context: string;
  solutionApproach: string;
  impact: string;
  lessonsLearned: string[];
};

export const demoCaseStudies: PublicCaseStudy[] = [
  {
    id: "demo-downtime-reduction",
    slug: "downtime-reduction-auto-components",
    title: "Reducing unplanned downtime in an auto-components MSME",
    sector: "Auto components",
    problemType: "Machine reliability",
    impactMetric: "18% downtime reduction target",
    tags: ["maintenance", "quality", "production"],
    readTime: "6 min read",
    upvotes: 24,
    comments: 6,
    problem: "A machining line was losing production hours because stoppages were tracked informally and root causes were not visible across shifts.",
    context: "The MSME needed a low-cost way to structure downtime evidence before selecting sensors, automation, or process changes.",
    solutionApproach: "NumSum would structure the problem, capture onboarding questions, run a challenge for practical diagnostics, and evaluate a simple downtime classification workflow before recommending tools.",
    impact: "Expected impact includes fewer repeat stoppages, better shift handover, and a measurable downtime-reduction baseline for future pilots.",
    lessonsLearned: ["Start with problem evidence before buying tools.", "Shift-level categories make root-cause discussion easier.", "Impact metrics should be approved before public publication."],
  },
  {
    id: "demo-packaging-waste",
    slug: "packaging-waste-food-processing",
    title: "Packaging wastage reduction for a food-processing unit",
    sector: "Food processing",
    problemType: "Wastage and shelf-life",
    impactMetric: "12% material waste reduction target",
    tags: ["food processing", "packaging", "waste"],
    readTime: "5 min read",
    upvotes: 18,
    comments: 4,
    problem: "A small food-processing unit had recurring packaging defects that increased rework, wastage, and customer complaints.",
    context: "The team needed to separate hygiene, sealing, storage, and supplier-quality factors before defining a solution path.",
    solutionApproach: "A sector questionnaire captured hygiene, shelf-life, packaging, and wastage details; the public challenge brief would expose only non-confidential patterns.",
    impact: "Expected impact includes lower packaging waste, clearer inspection checkpoints, and better supplier conversations.",
    lessonsLearned: ["Food-sector questions must include hygiene and shelf-life.", "Public case studies should avoid client-identifying data unless approved.", "Simple checkpoints can create measurable savings."],
  },
];

function slugify(value: string) { return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80); }
function lines(value?: string) { return (value || "Lessons will be updated after validation.").split("\n").map((v) => v.trim()).filter(Boolean); }
function fromAdminCaseStudy(c: CaseStudy): PublicCaseStudy { return { id: c.id, slug: c.slug || slugify(c.title || c.id), title: c.title, sector: c.sector || "MSME", problemType: c.linkedProblemId ? "Linked MSME problem" : c.linkedChallengeId ? "Linked challenge" : "Industrial case study", impactMetric: c.featuredMetric || "Impact approved for publication", tags: c.tags || [], readTime: c.readTime || "5 min read", upvotes: c.upvoteCount || 0, comments: c.commentCount || 0, problem: c.problemSection || c.summary || "Problem summary pending.", context: c.contextSection || c.summary || "Context pending.", solutionApproach: c.solutionSection || "Solution approach pending.", impact: c.impactSection || c.featuredMetric || "Impact pending.", lessonsLearned: lines(c.lessonsLearnedSection) }; }

export async function getPublicCaseStudies(): Promise<PublicCaseStudy[]> {
  const adminCases = await getPublicAdminCaseStudies().catch(() => []);
  if (adminCases.length) return adminCases.map(fromAdminCaseStudy);
  const [knowledge, pilots] = await Promise.all([getPublicKnowledgeAssets().catch(() => []), getPublicPilotTracks().catch(() => [])]);
  const live: PublicCaseStudy[] = [
    ...pilots.map((p) => ({ id: p.id, slug: slugify(p.title || p.id), title: p.title, sector: p.industrySegment || "MSME", problemType: p.interventionType || "Implementation pilot", impactMetric: String(p.finalResults || p.expectedImpact || "Impact pending approval"), tags: [p.industrySegment, p.interventionType].filter(Boolean) as string[], readTime: "6 min read", upvotes: 0, comments: 0, problem: p.problemSummary || p.publicSummary || "Problem summary will be published after approval.", context: p.partnerOrganization ? `Context from ${p.partnerOrganization} has been public-safe summarized.` : "Client context is summarized without confidential details.", solutionApproach: p.proposedSolution || p.pilotObjective || "Solution approach will be updated from approved pilot notes.", impact: String(p.finalResults || p.expectedImpact || "Impact metrics pending approval."), lessonsLearned: [p.lessonsLearned || "Lessons learned will be added after validation."], })),
    ...knowledge.filter((k) => String(k.category || "").toLowerCase().includes("case")).map((k) => ({ id: k.id, slug: slugify(k.title || k.id), title: k.title, sector: k.industrySegment || "Case study", problemType: k.problemCategory || String(k.category || "Industrial learning"), impactMetric: k.keyTakeaways?.[0] || "Public learning asset", tags: k.tags || [], readTime: "5 min read", upvotes: 0, comments: 0, problem: k.shortDescription || k.summary || "Problem summary pending.", context: k.description || k.detailedContent || "Context pending.", solutionApproach: k.relevanceToProblem || k.content || "Solution approach pending.", impact: k.keyTakeaways?.join(", ") || "Impact pending.", lessonsLearned: k.keyTakeaways?.length ? k.keyTakeaways : ["Lessons will be updated from approved admin publishing workflow."], })),
  ];
  return live.length ? live : demoCaseStudies;
}

export async function getPublicCaseStudyBySlug(slug: string) {
  return (await getPublicCaseStudies()).find((item) => item.slug === slug || item.id === slug) || null;
}
