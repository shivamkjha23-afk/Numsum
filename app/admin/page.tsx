import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { Button, Card } from "@/components/ui";
import { getAdminProblemWorkspaceMetrics, getSubmittedProblemStatements } from "@/lib/repositories/firestore";

export default async function Admin() {
  const allProblems = await getSubmittedProblemStatements().catch(() => []);
  const metrics = await getAdminProblemWorkspaceMetrics().catch(() => null);
  const fallback = {
    totalProblems: allProblems.length,
    submittedProblems: allProblems.filter((p) => p.status === "submitted").length,
    underReview: allProblems.filter((p) => p.status === "under_review").length,
    needsMoreInfo: allProblems.filter((p) => p.status === "needs_more_info" || p.status === "needs_information").length,
    onboarded: allProblems.filter((p) => p.status === "onboarded").length,
    published: allProblems.filter((p) => p.status === "published").length,
    onboardingSessions: allProblems.reduce((sum, p) => sum + (p.onboardingSessionIds?.length || 0), 0),
    questionnaireResponses: allProblems.reduce((sum, p) => sum + (p.questionnaireResponseIds?.length || 0), 0),
    meetingLogs: allProblems.reduce((sum, p) => sum + (p.meetingLogIds?.length || 0), 0),
    fileLinks: 0,
    timelineEvents: 0,
    knowledgeAssets: 0,
    knowledgeUnderReview: 0,
    knowledgePublished: 0,
    sopDocuments: 0,
    sopDraftReview: 0,
    sopApprovedPublished: 0,
    researchItems: 0,
    researchUnderReview: 0,
    researchPublished: 0,
    technologyWatchItems: 0,
    highPriorityWatchItems: 0,
    caseStudies: 0,
    linkedResearchItems: 0,
    unlinkedResearchItems: 0,
    totalPilots: 0, proposedPilots: 0, approvedPlannedPilots: 0, activePilots: 0, pausedPilots: 0, completedPilots: 0, failedCancelledPilots: 0, publicSuccessStories: 0,
  };
  const m = metrics || fallback;
  const cards = [
    ["Total problems", m.totalProblems], ["Submitted", m.submittedProblems], ["Under review", m.underReview], ["Needs more info", m.needsMoreInfo], ["Onboarded", m.onboarded], ["Published", m.published], ["Knowledge assets", m.knowledgeAssets], ["Knowledge under review", m.knowledgeUnderReview], ["Knowledge published", m.knowledgePublished], ["SOPs", m.sopDocuments], ["SOP draft/review", m.sopDraftReview], ["SOP approved/published", m.sopApprovedPublished], ["Onboarding sessions", m.onboardingSessions], ["Questionnaire responses", m.questionnaireResponses], ["Meeting logs", m.meetingLogs], ["File links", m.fileLinks], ["Timeline events", m.timelineEvents], ["Research items", m.researchItems], ["Research under review", m.researchUnderReview], ["Published research", m.researchPublished], ["Technology watch", m.technologyWatchItems], ["High-priority watch", m.highPriorityWatchItems], ["Case studies", m.caseStudies], ["Linked research", m.linkedResearchItems], ["General research", m.unlinkedResearchItems], ["Total pilots", m.totalPilots], ["Proposed pilots", m.proposedPilots], ["Approved/planned pilots", m.approvedPlannedPilots], ["Active pilots", m.activePilots], ["Paused pilots", m.pausedPilots], ["Completed pilots", m.completedPilots], ["Failed/cancelled pilots", m.failedCancelledPilots], ["Public success stories", m.publicSuccessStories],
  ];
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Dashboard</h1><p className="mt-3 text-white/60">Moderate problem statements, workspace activity, inbox items, applications, research, knowledge, competitions, organizations, users, team members and platform statistics.</p><div className="mt-6 grid gap-4 md:grid-cols-[360px_1fr]"><Card><p className="text-sm uppercase tracking-[.25em] text-blue-300">Problem Workspace Metrics</p><p className="mt-3 text-3xl text-white">{m.totalProblems}</p><p className="mt-2 text-sm text-white/60">Central operating counts for problem workspaces and linked activity.</p><div className="mt-5"><Button href="/admin/problems">Open Problem Review</Button></div><dl className="mt-5 grid grid-cols-2 gap-2 text-sm text-white/65">{cards.slice(1).map(([label, count]) => <div key={label} className="rounded-xl bg-white/[0.03] p-3"><dt>{label}</dt><dd className="text-lg text-white">{count}</dd></div>)}</dl></Card><div><AdminDashboardClient /></div></div></main>;
}
