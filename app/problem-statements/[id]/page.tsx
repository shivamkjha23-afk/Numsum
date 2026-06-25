"use client";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth, useIsAdmin } from "@/components/auth-provider";
import { EmptyState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getProblemStatementById, getLinkedProblemResources, updateProblemStatement } from "@/lib/repositories/firestore";
import type { ProblemStatement } from "@/lib/types";
const statuses = ["submitted", "under_review", "needs_more_info", "onboarded", "structured", "pilot_shortlisted", "competition_candidate", "published", "archived", "rejected"];
const visibilities = ["admin_only", "submitter_only", "member_only", "public"];
function value(value: unknown) { return typeof value === "string" && value.trim() ? value : "—"; }
function ProblemDetailContent() {
  const params = useParams<{ id: string }>();
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [linked, setLinked] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const id = params.id;
  async function load() {
    setLoading(true);
    const loaded = await getProblemStatementById(id);
    setProblem(loaded);
    if (loaded && (isAdmin || loaded.submittedByUserId === user?.uid || loaded.createdBy === user?.uid || (loaded.visibility === "public" && loaded.status === "published"))) {
      getLinkedProblemResources(id).then((data) => setLinked(data as unknown as Record<string, unknown>)).catch(() => setLinked(null));
    }
    setLoading(false);
  }
  useEffect(() => { load().catch(() => setLoading(false)); }, [id, isAdmin, user?.uid]);
  const allowed = useMemo(() => Boolean(problem && (isAdmin || problem.submittedByUserId === user?.uid || problem.createdBy === user?.uid || (problem.visibility === "public" && problem.status === "published"))), [isAdmin, problem, user?.uid]);
  async function saveAdmin(formData: FormData) {
    if (!user || !problem) return;
    await updateProblemStatement(problem.id, { status: String(formData.get("status")) as ProblemStatement["status"], adminReviewStatus: String(formData.get("status")) as ProblemStatement["status"], visibility: String(formData.get("visibility")) as ProblemStatement["visibility"], priority: String(formData.get("priority") || "medium"), assignedAdminId: String(formData.get("assignedAdminId") || ""), adminNotes: String(formData.get("adminNotes") || ""), submitterVisibleNotes: String(formData.get("submitterVisibleNotes") || ""), onboardingRequired: formData.get("onboardingRequired") === "on" }, user.uid);
    setMessage("Problem review updated.");
    await load();
  }
  if (loading) return <LoadingState label="Loading problem statement" />;
  if (!problem || !allowed) return <main className="min-h-screen bg-navy px-6 py-10"><EmptyState title="Problem unavailable" message="This problem is private, unpublished, or does not exist." /></main>;
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-6xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Problem Statement</p><h1 className="mt-3 font-display text-5xl">{problem.title}</h1><p className="mt-3 text-white/60">{[problem.category, problem.status, problem.visibility, problem.urgency].filter(Boolean).join(" · ")}</p>{message && <p className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3 text-white/70">{message}</p>}<div className="mt-8 grid gap-5 lg:grid-cols-[1fr_360px]"><section className="grid gap-5"><Card><h2 className="font-display text-2xl">Submitted Problem</h2><p className="mt-3 whitespace-pre-wrap text-white/75">{problem.detailedDescription || problem.problemDescription || problem.description || problem.summary}</p></Card><Card><h2 className="font-display text-2xl">Context</h2><dl className="mt-4 grid gap-3 text-sm text-white/70 md:grid-cols-2"><div><dt className="text-white/35">Organization</dt><dd>{value(problem.organizationName)}</dd></div><div><dt className="text-white/35">Industry</dt><dd>{value(problem.industrySegment)}</dd></div><div><dt className="text-white/35">Focus</dt><dd>{value(problem.manufacturingOrServiceFocus)}</dd></div><div><dt className="text-white/35">Location</dt><dd>{[problem.locationCity, problem.locationState, problem.locationCountry].filter(Boolean).join(", ") || "—"}</dd></div><div><dt className="text-white/35">Affected process</dt><dd>{value(problem.affectedProcess)}</dd></div><div><dt className="text-white/35">Frequency</dt><dd>{value(problem.problemFrequency)}</dd></div><div><dt className="text-white/35">Impact</dt><dd>{value(problem.estimatedImpact)}</dd></div><div><dt className="text-white/35">Expected outcome</dt><dd>{value(problem.expectedOutcome)}</dd></div></dl></Card><Card><h2 className="font-display text-2xl">Data and Links</h2>{problem.attachmentsOrDriveLinks?.length ? <ul className="mt-3 grid gap-2 text-blue-200">{problem.attachmentsOrDriveLinks.map((link) => <li key={link}><a href={link} target="_blank" rel="noreferrer">{link}</a></li>)}</ul> : <p className="mt-3 text-white/60">No links provided.</p>}<p className="mt-4 whitespace-pre-wrap text-white/65">{problem.availableData || "No available data described."}</p></Card>{problem.submitterVisibleNotes && <Card><h2 className="font-display text-2xl">Admin Note</h2><p className="mt-3 whitespace-pre-wrap text-blue-100">{problem.submitterVisibleNotes}</p></Card>}<Card><h2 className="font-display text-2xl">Linked Resources</h2><pre className="mt-3 max-h-80 overflow-auto rounded-xl bg-black/30 p-4 text-xs text-white/65">{JSON.stringify(linked || { message: "Linked SOP, knowledge, research, meeting, pilot, competition, and discussion resources will appear here as admins attach them." }, null, 2)}</pre></Card></section><aside className="grid gap-5 content-start"><Card><h2 className="font-display text-2xl">Workflow</h2><dl className="mt-4 grid gap-3 text-sm text-white/70"><div><dt className="text-white/35">Status</dt><dd>{problem.status}</dd></div><div><dt className="text-white/35">Visibility</dt><dd>{problem.visibility}</dd></div><div><dt className="text-white/35">Priority</dt><dd>{problem.priority || "medium"}</dd></div><div><dt className="text-white/35">Assigned admin</dt><dd>{problem.assignedAdminId || "Unassigned"}</dd></div><div><dt className="text-white/35">Submitter</dt><dd>{problem.submittedByName || problem.submittedByEmail || problem.submittedByUserId}</dd></div></dl></Card>{isAdmin && <Card><h2 className="font-display text-2xl">Admin Controls</h2><form action={saveAdmin} className="mt-4 grid gap-3"><select name="status" defaultValue={problem.status || "submitted"} className="rounded-xl border border-white/10 bg-black/30 p-3">{statuses.map((item) => <option key={item}>{item}</option>)}</select><select name="visibility" defaultValue={problem.visibility || "submitter_only"} className="rounded-xl border border-white/10 bg-black/30 p-3">{visibilities.map((item) => <option key={item}>{item}</option>)}</select><input name="priority" defaultValue={problem.priority || "medium"} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Priority" /><input name="assignedAdminId" defaultValue={problem.assignedAdminId || ""} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Assigned admin UID" /><textarea name="adminNotes" defaultValue={problem.adminNotes || ""} className="min-h-24 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Internal notes" /><textarea name="submitterVisibleNotes" defaultValue={problem.submitterVisibleNotes || ""} className="min-h-24 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Submitter-visible notes" /><label className="text-sm text-white/70"><input type="checkbox" name="onboardingRequired" defaultChecked={problem.onboardingRequired} /> Onboarding required</label><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Save controls</button></form></Card>}</aside></div></div></main>;
}
export default function ProblemStatementDetail() { return <ProblemDetailContent />; }
