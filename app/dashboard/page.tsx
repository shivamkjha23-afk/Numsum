"use client";
import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card, Button } from "@/components/ui";
import { getCommunityPostsByCreator, getMyChallengeParticipations, getPendingChallengeInvitesForMember, getMyKnowledgeAssets, getProblemReviewsForMember, getProblemStatementsByCreator, getResearchByCreator } from "@/lib/repositories/firestore";
import type { ProblemStatement, ResearchPost, KnowledgeAsset } from "@/lib/types";
import { MemberExecutionSections } from "@/components/execution-admin-client";

function MiniCard({ title, href, count, empty }: { title: string; href: string; count: string | number; empty: string }) {
  return <Card className="min-w-0"><div className="flex h-full flex-col justify-between gap-4"><div><p className="text-sm uppercase tracking-[.22em] text-blue-300">{title}</p><p className="mt-3 text-3xl text-white">{count}</p><p className="mt-2 text-sm text-white/60">{empty}</p></div><Button href={href}>Open</Button></div></Card>;
}

function DashboardContent() {
  const { user, profile } = useAuth();
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  const [research, setResearch] = useState<ResearchPost[]>([]);
  const [knowledge, setKnowledge] = useState<KnowledgeAsset[]>([]); const [challengeCount, setChallengeCount] = useState(0); const [inviteCount, setInviteCount] = useState(0); const [reviewCount, setReviewCount] = useState(0); const [communityCount, setCommunityCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    if (!user) return;
    let mounted = true;
    setLoading(true);
    Promise.all([getProblemStatementsByCreator(user.uid), getResearchByCreator(user.uid), getMyKnowledgeAssets(user.uid), getMyChallengeParticipations(user.uid), getPendingChallengeInvitesForMember(user.uid), getProblemReviewsForMember(user.uid), getCommunityPostsByCreator(user.uid)])
      .then(([p, r, k, ch, inv, rev, comm]) => { if (mounted) { setProblems(p); setResearch(r); setKnowledge(k); setChallengeCount(ch.length); setInviteCount(inv.length); setReviewCount(rev.length); setCommunityCount(comm.length); setError(""); } })
      .catch((err) => { if (mounted) setError(err instanceof Error ? err.message : "Unable to load dashboard data."); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, [user]);
  const groups = useMemo(() => ({
    Drafts: problems.filter((p) => p.status === "draft"),
    Submitted: problems.filter((p) => ["submitted", "under_review", "needs_information", "needs_more_info", "member_only"].includes(p.status || "")),
    Published: problems.filter((p) => p.status === "public" || p.status === "published" || p.visibility === "public"),
  }), [problems]);
  return <main className="min-h-screen overflow-x-hidden bg-navy px-4 py-8 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><h1 className="font-display text-4xl sm:text-5xl">Member Dashboard</h1><p className="mt-3 max-w-3xl text-white/60">Welcome back, {profile?.name || user?.displayName || user?.email}. This dashboard shows only your member-safe work, submissions, and contribution records.</p>{error && <Card className="mt-6 border-red-300/20 bg-red-500/10 text-red-100">{error}</Card>}{loading && <Card className="mt-6 text-white/70">Loading your member workspace…</Card>}<section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"><MiniCard title="My Profile" href="/profile" count={profile?.profileComplete ? "Complete" : "Needs setup"} empty="Review your onboarding profile and account details." /><MiniCard title="My Problems" href="/dashboard/problems" count={problems.length} empty="Submitted MSME challenges and status updates appear here." /><MiniCard title="My Challenges" href="/dashboard/challenges" count={challengeCount} empty={`${inviteCount} pending team invite(s).`} /><MiniCard title="My Reviews" href="/dashboard/problems" count={reviewCount} empty="Feedback linked to solved problems." /><MiniCard title="My Community Posts" href="/community" count={communityCount} empty="Questions, collaboration posts, and discussions." /><MiniCard title="My Knowledge / Research" href="/knowledge" count={knowledge.length + research.length} empty="Your submitted knowledge and research contributions." /></section><Card className="mt-8"><h2 className="font-display text-2xl">Quick actions</h2><div className="mt-4 flex flex-wrap gap-3"><Button href="/submit-problem">Submit Problem</Button><Button href="/challenges" variant="secondary">Browse Challenges</Button><Button href="/community/new" variant="secondary">Write Community Post</Button><Button href="/dashboard/problems" variant="secondary">View My Problems</Button><Button href="/dashboard/challenges" variant="secondary">View Challenge Dashboard</Button></div></Card><section className="mt-8"><Card><div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-display text-2xl">My Problem Statements</h2><p className="mt-1 text-sm text-white/60">Clear statuses and next steps for challenges you submitted.</p></div><Button href="/submit-problem">Submit Your Problem</Button></div><div className="mt-5 grid gap-4 md:grid-cols-3">{Object.entries(groups).map(([label, rows]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><h3 className="font-semibold text-blue-200">{label}</h3><p className="mt-2 text-sm text-white/55">{rows.length} problem statements</p>{rows.slice(0, 3).map((problem) => <a key={problem.id} href={`/problem-statements/${problem.id}`} className="mt-3 block break-words text-sm text-white hover:text-blue-100">{problem.title}</a>)}{!rows.length && <p className="mt-3 text-sm text-white/45">No {label.toLowerCase()} problems yet.</p>}</div>)}</div></Card></section><section className="mt-8 grid gap-4 lg:grid-cols-2"><Card><h2 className="font-display text-2xl">My Knowledge / Research</h2><p className="mt-3 text-white/60">{knowledge.length} knowledge assets · {research.length} research items. Approved public records appear on the public library pages after review.</p>{[...knowledge.slice(0, 3), ...research.slice(0, 3)].length ? [...knowledge.slice(0, 3), ...research.slice(0, 3)].map((item) => <p key={item.id} className="mt-2 break-words text-blue-200">{item.title}</p>) : <p className="mt-3 text-sm text-white/45">No knowledge or research contributions yet.</p>}</Card><Card><h2 className="font-display text-2xl">My Recognition</h2><p className="mt-3 text-white/60">Contribution scores are recognition signals for work performed; they are not equity, ownership, or compensation entitlements.</p><Button href="/dashboard/contributions">Open contributions</Button></Card></section><div className="mt-8"><MemberExecutionSections /></div></div></main>;
}
export default function Dashboard() { return <AuthGate><DashboardContent /></AuthGate>; }
