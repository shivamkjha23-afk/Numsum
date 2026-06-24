"use client";
import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { getProblemStatementsByCreator } from "@/lib/repositories/firestore";
import type { ProblemStatement } from "@/lib/types";

function DashboardContent() {
  const { user } = useAuth();
  const [problems, setProblems] = useState<ProblemStatement[]>([]);
  useEffect(() => { if (!user) return; let mounted = true; getProblemStatementsByCreator(user.uid).then((rows) => { if (mounted) setProblems(rows); }); return () => { mounted = false; }; }, [user]);
  const groups = useMemo(() => ({ Drafts: problems.filter((p) => p.status === "draft"), Submitted: problems.filter((p) => ["submitted", "under_review", "needs_information", "member_only"].includes(p.status || "")), Published: problems.filter((p) => p.status === "public" || p.visibility === "public"), Archived: problems.filter((p) => p.status === "archived") }), [problems]);
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Dashboard</h1><p className="mt-3 text-white/60">Welcome back, {user?.displayName || user?.email}. Your live Firebase-backed workspace is ready.</p><div className="mt-8 grid gap-4 md:grid-cols-4">{Object.entries(groups).map(([label, rows]) => <Card key={label}><h2 className="font-display text-2xl">{label}</h2><p className="mt-3 text-white/60">{rows.length} problem statements</p>{rows.slice(0, 3).map((problem) => <a key={problem.id} href={`/problem-statements/${problem.id}`} className="mt-3 block text-sm text-blue-200 hover:text-blue-100">{problem.title}</a>)}</Card>)}</div><div className="mt-8"><Card><h2 className="font-display text-2xl">My Problem Statements</h2>{problems.length ? <div className="mt-4 grid gap-3">{problems.map((problem) => <a key={problem.id} href={`/problem-statements/${problem.id}`} className="rounded-xl border border-white/10 bg-black/20 p-3 hover:border-blue-300"><span className="text-blue-300">{[problem.category, problem.status].filter(Boolean).join(" · ")}</span><strong className="mt-1 block">{problem.title}</strong></a>)}</div> : <p className="mt-3 text-white/60">Submitted problem statements will appear here.</p>}</Card></div></main>;
}
export default function Dashboard() { return <AuthGate><DashboardContent /></AuthGate>; }
