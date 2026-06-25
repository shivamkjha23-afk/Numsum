"use client";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, LoadingState } from "@/components/data-states";
import { Button, Card } from "@/components/ui";
import { getMyProblemStatements } from "@/lib/repositories/firestore";
import type { ProblemStatement } from "@/lib/types";
function fmt(value: unknown) { return value && typeof value === "object" && "toDate" in value ? (value as { toDate: () => Date }).toDate().toLocaleDateString() : value ? new Date(value as string).toLocaleDateString() : "—"; }
function MyProblemsContent() {
  const { user } = useAuth();
  const [rows, setRows] = useState<ProblemStatement[] | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { if (!user) return; getMyProblemStatements(user.uid).then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Unable to load problems.")); }, [user]);
  if (error) return <main className="min-h-screen bg-navy px-6 py-10"><EmptyState title="Unable to load problems" message={error} /></main>;
  if (!rows) return <LoadingState label="Loading your problems" />;
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-6xl"><div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-sm uppercase tracking-[.35em] text-blue-300">Member workspace</p><h1 className="mt-3 font-display text-5xl">My Problems</h1><p className="mt-3 text-white/60">Private submissions visible to you and NumSum Labs admins.</p></div><Button href="/submit-problem">Submit MSME Challenge</Button></div>{rows.length ? <div className="mt-8 grid gap-4">{rows.map((problem) => <Card key={problem.id}><div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"><div><p className="text-xs uppercase tracking-[.25em] text-blue-300">{[problem.category, problem.urgency].filter(Boolean).join(" · ") || "MSME Problem"}</p><a href={`/problem-statements/${problem.id}`} className="mt-2 block font-display text-2xl hover:text-blue-200">{problem.title}</a><p className="mt-2 line-clamp-2 text-white/65">{problem.shortDescription || problem.summary || problem.detailedDescription || problem.problemDescription}</p>{problem.submitterVisibleNotes && <p className="mt-3 rounded-xl border border-blue-300/20 bg-blue-500/10 p-3 text-sm text-blue-100">Admin note: {problem.submitterVisibleNotes}</p>}</div><dl className="grid min-w-60 gap-2 text-sm text-white/65"><div><dt className="text-white/35">Status</dt><dd>{problem.status || "submitted"}</dd></div><div><dt className="text-white/35">Visibility</dt><dd>{problem.visibility || "submitter_only"}</dd></div><div><dt className="text-white/35">Submitted</dt><dd>{fmt(problem.createdAt)}</dd></div><div><dt className="text-white/35">Updated</dt><dd>{fmt(problem.updatedAt)}</dd></div><a href={`/problem-statements/${problem.id}`} className="mt-2 rounded-full border border-white/10 px-4 py-2 text-center text-white hover:border-blue-300">View details</a>{["submitted", "needs_more_info"].includes(problem.status || "") && <a href={`/submit-problem?edit=${problem.id}`} className="rounded-full border border-white/10 px-4 py-2 text-center text-white/70">Edit allowed soon</a>}</dl></div></Card>)}</div> : <div className="mt-8"><EmptyState title="No submitted problems yet" message="Submit your first MSME problem for private admin review." /></div>}</div></main>;
}
export default function MyProblemsPage() { return <AuthGate><MyProblemsContent /></AuthGate>; }
