"use client";

import Link from "next/link";
import { limit } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import {
  COLLECTIONS,
  getAdminAuditLogs,
  getAdminChallenges,
  getAdminProblemStatements,
  getPublicImpactMetrics,
  getUsers,
  listCollection,
} from "@/lib/repositories/firestore";
import type {
  AdminAuditLog,
  ChallengeEvaluation,
  ChallengeSubmission,
  ChallengeTeamInvite,
  Competition,
  DateLike,
  ProblemMeetingNote,
  ProblemPublicReview,
  ProblemStatement,
  UserProfile,
} from "@/lib/types";

function asDate(value?: DateLike) {
  if (!value) return null;
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate();
  const date = new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? null : date;
}
function dateLabel(value?: DateLike) {
  const date = asDate(value);
  return date ? date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "Not recorded";
}

type DashboardData = {
  users: UserProfile[];
  problems: ProblemStatement[];
  reviews: ProblemPublicReview[];
  challenges: Competition[];
  submissions: ChallengeSubmission[];
  evaluations: ChallengeEvaluation[];
  invites: ChallengeTeamInvite[];
  meetingNotes: ProblemMeetingNote[];
  caseStudies: unknown[];
  moderationItems: unknown[];
  auditLogs: AdminAuditLog[];
  publicMetrics: Awaited<ReturnType<typeof getPublicImpactMetrics>>;
};

const quickActions: Array<[string, string]> = [
  ["View MSME Owners", "/admin/msme-owners"],
  ["Review Problems", "/admin/problems"],
  ["Create Questionnaire", "/admin/questionnaires/new"],
  ["Create Challenge", "/admin/challenges/new"],
  ["Moderate Reviews", "/admin/reviews"],
];

export function AdminDashboardClient() {
  const { profile } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getUsers(500).catch(() => []),
      getAdminProblemStatements(500).catch(() => []),
      listCollection<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, [limit(500)]).catch(() => []),
      getAdminChallenges().catch(() => []),
      listCollection<ChallengeSubmission>(COLLECTIONS.challengeSubmissions, [limit(500)]).catch(() => []),
      listCollection<ChallengeEvaluation>(COLLECTIONS.challengeEvaluations, [limit(500)]).catch(() => []),
      listCollection<ChallengeTeamInvite>(COLLECTIONS.challengeTeamInvites, [limit(500)]).catch(() => []),
      listCollection<ProblemMeetingNote>(COLLECTIONS.problemMeetingNotes, [limit(50)]).catch(() => []),
      listCollection(COLLECTIONS.msmeCases, [limit(200)]).catch(() => []),
      listCollection(COLLECTIONS.discussionReports, [limit(100)]).catch(() => []),
      profile?.role === "super_admin" ? getAdminAuditLogs().catch(() => []) : Promise.resolve([]),
      getPublicImpactMetrics().catch(() => ({ totalProblemsSubmitted: 0, totalProblemsSolved: 0, totalChallengesLaunched: 0, totalChallengeParticipants: 0, totalCaseStudiesPublished: 0, totalCommunityPosts: 0, totalMonetarySavings: "0", totalTimeSaved: "0", totalWasteReduction: "0", totalProductivityGain: "0", totalClientsGained: 0, totalPublicReviews: 0 })),
    ])
      .then(([users, problems, reviews, challenges, submissions, evaluations, invites, meetingNotes, caseStudies, moderationItems, auditLogs, publicMetrics]) => {
        if (mounted) setData({ users, problems, reviews, challenges, submissions, evaluations, invites, meetingNotes, caseStudies, moderationItems, auditLogs, publicMetrics });
      })
      .catch((err) => mounted && setError(err instanceof Error ? err.message : "Unable to load admin dashboard."));
    return () => { mounted = false; };
  }, [profile?.role]);

  const metrics = useMemo(() => {
    if (!data) return [];
    const ownerCount = data.users.filter((user) => user.profileType === "msme_owner" || Boolean(user.organizationName)).length;
    const finalSubmissions = data.submissions.filter((submission) => submission.status === "submitted" || submission.locked);
    const evaluatedIds = new Set(data.evaluations.filter((evaluation) => evaluation.status === "evaluated").map((evaluation) => evaluation.submissionId));
    return [
      ["MSME owners", ownerCount],
      ["Submitted problems", data.problems.length],
      ["Under review", data.problems.filter((problem) => problem.status === "under_review" || problem.status === "submitted").length],
      ["Onboarding active", data.problems.filter((problem) => problem.status === "onboarding_active").length],
      ["Solved problems", data.problems.filter((problem) => problem.status === "solved").length],
      ["Pending reviews", data.reviews.filter((review) => review.consentForPublicDisplay && !review.approvedForPublic && review.moderationStatus !== "rejected" && review.moderationStatus !== "hidden").length],
      ["Active challenges", data.challenges.filter((challenge) => ["published", "open", "evaluation"].includes(challenge.status || "")).length],
      ["Pending evaluations", finalSubmissions.filter((submission) => !evaluatedIds.has(submission.id)).length],
      ["Pending team invites", data.invites.filter((invite) => invite.status === "pending").length],
      ["Published case studies", data.caseStudies.length],
      ["Community moderation", data.moderationItems.length],
      ["Public clients gained", data.publicMetrics.totalClientsGained || 0],
    ];
  }, [data]);

  if (error) return <main className="px-4 py-8 md:px-8"><ErrorState retryHref="/admin" message={error} /></main>;
  if (!data) return <main className="px-4 py-8 md:px-8"><LoadingState label="Loading admin dashboard" /></main>;

  const recentProblems = [...data.problems].sort((a, b) => (asDate(b.createdAt)?.getTime() || 0) - (asDate(a.createdAt)?.getTime() || 0)).slice(0, 5);
  const recentNotes = [...data.meetingNotes].sort((a, b) => (asDate(b.createdAt)?.getTime() || 0) - (asDate(a.createdAt)?.getTime() || 0)).slice(0, 4);
  const recentReviews = [...data.reviews].sort((a, b) => (asDate(b.createdAt)?.getTime() || 0) - (asDate(a.createdAt)?.getTime() || 0)).slice(0, 4);
  const recentSubmissions = [...data.submissions].sort((a, b) => (asDate(b.submittedAt || b.updatedAt)?.getTime() || 0) - (asDate(a.submittedAt || a.updatedAt)?.getTime() || 0)).slice(0, 4);

  return (
    <main className="px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[.28em] text-blue-300">Internal workspace</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Admin Dashboard</h1>
          <p className="mt-3 max-w-3xl text-white/65">Operational overview for MSME intake, onboarding, reviews, challenges, community moderation, and public impact.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(profile?.role === "super_admin" ? [...quickActions, ["Manage Users", "/admin/users"] as [string, string]] : quickActions).map(([label, href]) => (
            <Link key={href} href={href} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/80 hover:bg-white/10 hover:text-white">{label}</Link>
          ))}
        </div>
      </div>

      <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(([label, value]) => (
          <Card key={label} className="p-5">
            <p className="text-xs uppercase tracking-[.22em] text-blue-200">{label}</p>
            <p className="mt-3 text-3xl font-semibold text-white">{value}</p>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-2">
        <Card>
          <h2 className="font-display text-2xl">Recent submitted problems</h2>
          <div className="mt-4 space-y-3">{recentProblems.length ? recentProblems.map((problem) => <Link key={problem.id} href={`/admin/problems/${problem.id}`} className="block rounded-2xl border border-white/10 p-3 hover:bg-white/5"><p className="font-semibold text-white">{problem.title}</p><p className="text-sm text-white/55">{problem.sector || problem.industrySegment || "Sector pending"} · {problem.status || "submitted"} · {dateLabel(problem.createdAt || problem.submittedAt)}</p></Link>) : <EmptyState title="No problems yet" message="New MSME submissions will appear here." />}</div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl">Recent challenge submissions</h2>
          <div className="mt-4 space-y-3">{recentSubmissions.length ? recentSubmissions.map((submission) => <div key={submission.id} className="rounded-2xl border border-white/10 p-3"><p className="font-semibold text-white">{submission.solutionTitle}</p><p className="text-sm text-white/55">{submission.evaluationStatus || "pending evaluation"} · {dateLabel(submission.submittedAt || submission.updatedAt)}</p></div>) : <EmptyState title="No challenge submissions" message="Final submissions will appear as members participate in challenges." />}</div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl">Recent meeting notes</h2>
          <div className="mt-4 space-y-3">{recentNotes.length ? recentNotes.map((note) => <Link key={note.id} href={`/admin/problems/${note.problemId}`} className="block rounded-2xl border border-white/10 p-3 hover:bg-white/5"><p className="font-semibold text-white">{note.meetingTitle || note.title || "Meeting note"}</p><p className="text-sm text-white/55">{note.visibleToMember ? "Shared with member" : "Admin only"} · {dateLabel(note.createdAt || note.meetingDate)}</p></Link>) : <EmptyState title="No meeting notes" message="MOM and onboarding notes will appear after admins add them to problems." />}</div>
        </Card>
        <Card>
          <h2 className="font-display text-2xl">Recent reviews</h2>
          <div className="mt-4 space-y-3">{recentReviews.length ? recentReviews.map((review) => <Link key={review.id} href="/admin/reviews" className="block rounded-2xl border border-white/10 p-3 hover:bg-white/5"><p className="font-semibold text-white">{review.rating}/5 · {review.memberName || review.membershipId || "Member"}</p><p className="line-clamp-2 text-sm text-white/55">{review.reviewText}</p></Link>) : <EmptyState title="No reviews" message="Solved problem reviews awaiting moderation will appear here." />}</div>
        </Card>
        {profile?.role === "super_admin" && (
          <Card className="xl:col-span-2">
            <h2 className="font-display text-2xl">Recent audit logs</h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">{data.auditLogs.length ? data.auditLogs.slice(0, 6).map((log) => <div key={log.id} className="rounded-2xl border border-white/10 p-3"><p className="font-semibold text-white">{log.actionType}</p><p className="text-sm text-white/55">{log.targetEmail || log.targetMembershipId || log.targetUserId} · {dateLabel(log.createdAt)}</p></div>) : <EmptyState title="No audit logs" message="Role and status changes will be recorded here." />}</div>
          </Card>
        )}
      </section>
    </main>
  );
}
