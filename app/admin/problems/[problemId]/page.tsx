"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { COLLECTIONS, createProblemMeetingNote, createProblemQuestionnaireResponse, getActiveQuestionnaireTemplates, getProblemMeetingNotesAdmin, getProblemQuestionnaireResponsesAdmin, getProblemReviewForMember, getProblemStatementById, getRecord, moderateProblemPublicReview, updateProblemImpactMetrics, updateRecord } from "@/lib/repositories/firestore";
import type { ProblemImpactMetrics, ProblemMeetingNote, ProblemPublicReview, ProblemQuestionnaireResponse, ProblemStatement, ProblemStatementStatus, QuestionnaireTemplate, UserProfile } from "@/lib/types";

const statusOptions: ProblemStatementStatus[] = ["submitted", "under_review", "onboarding_pending", "onboarding_active", "solution_path_created", "solved", "closed"];
const metricFields: Array<[keyof ProblemImpactMetrics, string, string]> = [["monetarySaving", "Monetary saving", "₹ value or range"], ["timeSaved", "Time saved", "Hours / month"], ["wasteReduction", "Waste reduction", "% or kg"], ["productivityGain", "Productivity gain", "% uplift"], ["clientsGained", "Clients gained", "Number"], ["revenueImpact", "Revenue impact", "₹ value or note"]];

function textDate(value: unknown) {
  if (!value) return "—";
  if (typeof value === "string" || typeof value === "number") return new Date(value).toLocaleDateString();
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toLocaleDateString();
  return "—";
}
function splitLines(value: FormDataEntryValue | null) { return String(value || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean); }
function Field({ label, value }: { label: string; value?: unknown }) { return <div><dt className="text-xs uppercase tracking-[.2em] text-white/35">{label}</dt><dd className="mt-1 text-white/75">{String(value || "—")}</dd></div>; }
function SectionTitle({ eyebrow, title, copy }: { eyebrow?: string; title: string; copy?: string }) { return <div><p className="text-xs uppercase tracking-[.28em] text-blue-300">{eyebrow || "Admin"}</p><h2 className="mt-2 font-display text-2xl text-white">{title}</h2>{copy && <p className="mt-2 text-sm text-white/60">{copy}</p>}</div>; }

export default function AdminProblemDetailPage() {
  const params = useParams<{ problemId: string }>();
  const problemId = params.problemId;
  const { user, profile } = useAuth();
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [notes, setNotes] = useState<ProblemMeetingNote[]>([]);
  const [templates, setTemplates] = useState<QuestionnaireTemplate[]>([]);
  const [responses, setResponses] = useState<ProblemQuestionnaireResponse[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState("");
  const [review, setReview] = useState<ProblemPublicReview | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const ownerId = useMemo(() => problem?.memberId || problem?.submittedByUserId || problem?.createdBy || problem?.submitterId || "", [problem]);
  const adminName = profile?.fullName || profile?.name || profile?.displayName || user?.email || "NumSum admin";

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const loaded = await getProblemStatementById(problemId);
      if (!loaded) throw new Error("Problem not found.");
      setProblem(loaded);
      const memberId = loaded.memberId || loaded.submittedByUserId || loaded.createdBy || loaded.submitterId || "";
      const [loadedOwner, loadedNotes, loadedReview, loadedTemplates, loadedResponses] = await Promise.all([
        memberId ? getRecord<UserProfile>(COLLECTIONS.users, memberId).catch(() => null) : Promise.resolve(null),
        getProblemMeetingNotesAdmin(loaded.id),
        memberId ? getProblemReviewForMember(loaded.id, memberId).catch(() => null) : Promise.resolve(null),
        getActiveQuestionnaireTemplates().catch(() => []),
        getProblemQuestionnaireResponsesAdmin(loaded.id),
      ]);
      setOwner(loadedOwner);
      setNotes(loadedNotes);
      setReview(loadedReview);
      setTemplates(loadedTemplates);
      setResponses(loadedResponses);
      setSelectedTemplateId((current) => current || loadedTemplates[0]?.id || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load problem.");
    } finally {
      setLoading(false);
    }
  }, [problemId]);

  useEffect(() => { void load(); }, [load]);

  async function saveStatus(formData: FormData) {
    if (!problem || !user) return;
    const status = String(formData.get("status")) as ProblemStatementStatus;
    await updateRecord(COLLECTIONS.problemStatements, problem.id, { status, adminReviewStatus: status, adminNotes: String(formData.get("adminNotes") || ""), submitterVisibleNotes: String(formData.get("submitterVisibleNotes") || ""), reviewedBy: user.uid });
    setMessage("Problem status and notes updated.");
    await load();
  }

  async function saveMetrics(formData: FormData) {
    if (!problem || !user) return;
    const impactMetrics = Object.fromEntries(metricFields.map(([key]) => [key, String(formData.get(String(key)) || "")])) as ProblemImpactMetrics;
    impactMetrics.isPublic = formData.get("isPublic") === "on";
    await updateProblemImpactMetrics(problem.id, impactMetrics, user.uid);
    setMessage("Impact metrics updated.");
    await load();
  }

  async function addMeetingNote(formData: FormData) {
    if (!problem || !user) return;
    const questionsAnswers = [1, 2, 3].map((index) => ({ question: String(formData.get(`question${index}`) || "").trim(), answer: String(formData.get(`answer${index}`) || "").trim() })).filter((item) => item.question || item.answer);
    await createProblemMeetingNote({
      problemId: problem.id,
      memberId: ownerId,
      membershipId: problem.membershipId || owner?.membershipId,
      meetingTitle: String(formData.get("meetingTitle") || `${problem.title} meeting`),
      meetingDate: String(formData.get("meetingDate") || new Date().toISOString().slice(0, 10)),
      attendees: splitLines(formData.get("attendees")),
      questionsAnswers,
      notes: String(formData.get("notes") || ""),
      decisions: splitLines(formData.get("decisions")),
      actionItems: splitLines(formData.get("actionItems")),
      nextSteps: String(formData.get("nextSteps") || ""),
      adminId: user.uid,
      adminName,
      visibleToMember: formData.get("visibleToMember") === "on",
      createdByAdminId: user.uid,
    });
    setMessage("Meeting note created.");
    await load();
  }


  async function saveQuestionnaireResponse(formData: FormData) {
    if (!problem || !user) return;
    const template = templates.find((item) => item.id === String(formData.get("questionnaireId")));
    if (!template) { setMessage("Choose a questionnaire template first."); return; }
    const answers = Object.fromEntries((template.questions || []).filter((q) => !q.adminOnly).map((q) => [q.id, String(formData.get(q.id) || "")]));
    await createProblemQuestionnaireResponse({ problemId: problem.id, memberId: ownerId, membershipId: problem.membershipId || owner?.membershipId, questionnaireId: template.id, questionnaireTitle: template.title || template.name, usageType: template.usageType, sector: template.sector || String(template.category || problem.sector || ""), answers, createdByAdminId: user.uid, createdByAdminName: adminName, visibleToMember: formData.get("visibleToMember") === "on" });
    setMessage("Questionnaire response saved.");
    await load();
  }

  async function toggleMeetingNoteVisibility(note: ProblemMeetingNote, visibleToMember: boolean) {
    await updateRecord(COLLECTIONS.problemMeetingNotes, note.id, { visibleToMember });
    setMessage(visibleToMember ? "MOM shared with member." : "MOM hidden from member.");
    await load();
  }

  async function moderateReview(formData: FormData) {
    if (!review || !user) return;
    await moderateProblemPublicReview(review.id, { approvedForPublic: formData.get("approvedForPublic") === "on", adminTags: splitLines(formData.get("adminTags")), reviewedBy: user.uid });
    setMessage("Review moderation updated.");
    await load();
  }

  if (loading) return <LoadingState label="Loading admin problem detail" />;
  if (error) return <main className="px-4 py-8 md:px-8"><EmptyState title="Problem unavailable" message={error} /></main>;
  if (!problem) return <main className="px-4 py-8 md:px-8"><EmptyState title="Problem not found" /></main>;

  const questionnaireEntries = Object.entries(problem.questionnaireAnswers || problem.questionnaireResponses || problem.questionnaire || {});
  const evidenceLinks = Array.isArray(problem.evidenceLinks) ? problem.evidenceLinks : Array.isArray(problem.attachmentsOrDriveLinks) ? problem.attachmentsOrDriveLinks : [];

  return <main className="px-4 py-8 text-white md:px-8"><div className="mx-auto max-w-7xl"><Link href="/admin/problems" className="text-sm font-semibold text-blue-200 hover:text-blue-100">← Back to problem queue</Link><div className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]"><section className="space-y-6"><Card><p className="text-xs uppercase tracking-[.28em] text-blue-300">MSME problem</p><h1 className="mt-3 font-display text-4xl text-white md:text-5xl">{problem.title}</h1><p className="mt-3 text-white/65">{problem.summary || problem.shortDescription || problem.description || "No summary provided."}</p><div className="mt-5 flex flex-wrap gap-2 text-xs font-semibold"><span className="rounded-full bg-blue-400/15 px-3 py-1 text-blue-100">{problem.status || "submitted"}</span><span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{problem.sector || problem.industrySegment || "Sector not set"}</span><span className="rounded-full bg-white/10 px-3 py-1 text-white/70">{problem.urgency || "Urgency not set"}</span></div></Card>{message && <p className="rounded-2xl border border-emerald-300/20 bg-emerald-300/10 p-3 text-sm text-emerald-100">{message}</p>}<Card><SectionTitle title="Submitted problem details" copy="Full member intake data without raw JSON." /><dl className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Problem type" value={problem.problemType || problem.category} /><Field label="Sub-sector" value={problem.subSector} /><Field label="Location" value={problem.location} /><Field label="Company size" value={problem.companySize} /><Field label="Current process" value={problem.currentProcess} /><Field label="Affected department" value={problem.affectedDepartment} /><Field label="Affected products/services" value={problem.affectedProducts} /><Field label="Submitted" value={textDate(problem.submittedAt || problem.createdAt)} /></dl></Card><Card><SectionTitle title="Questionnaire answers" copy="Sector-specific responses submitted by the member." />{questionnaireEntries.length ? <div className="mt-5 grid gap-3">{questionnaireEntries.map(([question, answer]) => <div key={question} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-sm font-semibold text-blue-100">{question}</p><p className="mt-1 text-sm text-white/70">{Array.isArray(answer) ? answer.join(", ") : String(answer || "—")}</p></div>)}</div> : <EmptyState title="No questionnaire answers" message="Answers from sector questionnaires will appear here." />}</Card><Card><SectionTitle title="Impact estimate and evidence" /><dl className="mt-5 grid gap-4 md:grid-cols-2"><Field label="Monthly monetary loss" value={problem.impactEstimate?.monthlyMonetaryLoss} /><Field label="Time lost" value={problem.impactEstimate?.timeLost} /><Field label="Waste/rejection" value={problem.impactEstimate?.wasteOrRejection} /><Field label="Production delay" value={problem.impactEstimate?.productionDelay} /><Field label="Customers/orders affected" value={problem.impactEstimate?.customersAffected} /><Field label="Safety/compliance" value={problem.impactEstimate?.safetyComplianceImpact} /><Field label="Expected outcome" value={problem.impactEstimate?.expectedOutcome} /><Field label="Current workaround" value={problem.currentWorkaround} /><Field label="Previous attempts" value={problem.previousAttempts} /><Field label="Data availability" value={problem.dataAvailability} /></dl>{evidenceLinks.length ? <div className="mt-5"><p className="text-sm font-semibold text-white/80">Evidence links</p><div className="mt-2 grid gap-2">{evidenceLinks.map((link) => <a key={String(link)} href={String(link)} className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-blue-100 hover:bg-white/10">{String(link)}</a>)}</div></div> : null}</Card><Card><SectionTitle title="Meeting notes" copy="Create MOM-ready notes. Member visibility is controlled per note." />{notes.length ? <div className="mt-5 grid gap-3">{notes.map((note) => <article key={note.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-semibold text-white">{note.meetingTitle || note.title}</h3><span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/60">{note.visibleToMember ? "Visible to member" : "Admin only"}</span></div><p className="mt-1 text-sm text-white/50">{textDate(note.meetingDate)} · {note.adminName || "Admin"}</p><p className="mt-3 text-sm text-white/70">{note.notes || "No notes added."}</p>{note.actionItems?.length ? <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-white/65">{note.actionItems.map((item) => <li key={item}>{item}</li>)}</ul> : null}<div className="mt-3 flex flex-wrap gap-2"><Link href={`/admin/problems/${problem.id}/mom/${note.id}`} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">View MOM</Link><Link href={`/admin/problems/${problem.id}/mom/${note.id}`} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Download / Print PDF</Link><button type="button" onClick={() => toggleMeetingNoteVisibility(note, true)} className="rounded-full bg-blue-400 px-3 py-2 text-xs font-semibold text-navy">Share with Member</button><button type="button" onClick={() => toggleMeetingNoteVisibility(note, false)} className="rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white">Hide from Member</button></div></article>)}</div> : <div className="mt-5"><EmptyState title="No meeting notes yet" message="Add the first onboarding or follow-up note below." /></div>}<form action={addMeetingNote} className="mt-6 grid gap-3 rounded-3xl border border-white/10 bg-black/20 p-4"><div className="grid gap-3 md:grid-cols-2"><input name="meetingTitle" defaultValue={`${problem.title} meeting`} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Meeting title" /><input name="meetingDate" type="date" defaultValue={new Date().toISOString().slice(0, 10)} className="rounded-xl border border-white/10 bg-black/30 p-3" /></div><input name="attendees" defaultValue={[adminName, owner?.fullName || problem.memberName || problem.submittedByName, problem.organizationName].filter(Boolean).join(", ")} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Attendees, comma separated" /><div className="grid gap-3 md:grid-cols-2">{[1, 2, 3].map((index) => <div key={index} className="grid gap-2"><input name={`question${index}`} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder={`Question ${index}`} /><input name={`answer${index}`} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder={`Answer ${index}`} /></div>)}</div><textarea name="notes" className="min-h-24 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Meeting notes" /><textarea name="decisions" className="min-h-20 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Decisions, one per line" /><textarea name="actionItems" className="min-h-20 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Action items, one per line" /><textarea name="nextSteps" className="min-h-20 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Next steps" /><label className="text-sm text-white/70"><input type="checkbox" name="visibleToMember" className="mr-2" /> Share this note with the member</label><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Create meeting note</button></form></Card><Card><SectionTitle title="Onboarding / follow-up questionnaire" copy="Select an active template, answer generated fields, and optionally share the response with the member." />{templates.length ? <form action={saveQuestionnaireResponse} className="mt-5 grid gap-3"><select name="questionnaireId" value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)} className="rounded-xl border border-white/10 bg-black/30 p-3">{templates.map((template) => <option key={template.id} value={template.id}>{template.title || template.name} · {(template.usageType || "onboarding_meeting").replaceAll("_", " ")}</option>)}</select>{(templates.find((template) => template.id === selectedTemplateId)?.questions || []).filter((q) => !q.adminOnly).map((q) => <label key={q.id} className="grid gap-1 text-sm text-white/65"><span>{q.label}{q.required ? " *" : ""}</span>{q.helpText && <span className="text-xs text-white/40">{q.helpText}</span>}<textarea name={q.id} required={Boolean(q.required)} className="min-h-20 rounded-xl border border-white/10 bg-black/30 p-3" placeholder={q.placeholder || "Answer"} /></label>)}<label className="text-sm text-white/70"><input type="checkbox" name="visibleToMember" className="mr-2" /> Share this questionnaire response with the member</label><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Save response</button></form> : <div className="mt-5"><EmptyState title="No active templates" message="Create an active questionnaire template before saving onboarding responses." /></div>}{responses.length ? <div className="mt-5 grid gap-3">{responses.map((response) => <article key={response.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="font-semibold text-blue-100">{response.questionnaireTitle}</p><p className="text-xs text-white/45">{response.visibleToMember ? "Visible to member" : "Admin only"}</p><div className="mt-2 grid gap-2 text-sm text-white/65">{Object.entries(response.answers || {}).map(([key, value]) => <p key={key}><b>{key.replaceAll("-", " ").replaceAll("_", " ")}</b>: {value || "—"}</p>)}</div></article>)}</div> : null}</Card></section><aside className="space-y-6"><Card><SectionTitle title="Status controls" copy="Members cannot change these lifecycle fields." /><form action={saveStatus} className="mt-5 grid gap-3"><select name="status" defaultValue={problem.status || "submitted"} className="rounded-xl border border-white/10 bg-black/30 p-3">{statusOptions.map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}</select><textarea name="adminNotes" defaultValue={problem.adminNotes || ""} className="min-h-24 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Internal admin notes" /><textarea name="submitterVisibleNotes" defaultValue={problem.submitterVisibleNotes || ""} className="min-h-20 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Member-visible note" /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Save status</button></form></Card><Card><SectionTitle title="Member snapshot" /><dl className="mt-5 grid gap-4"><Field label="Name" value={owner?.fullName || problem.memberName || problem.submittedByName} /><Field label="Email" value={owner?.email || problem.memberEmail || problem.submittedByEmail} /><Field label="Membership ID" value={owner?.membershipId || problem.membershipId} /><Field label="Profile type" value={owner?.profileType || problem.profileType || problem.submittedByProfileType} /><Field label="Organization" value={owner?.organizationName || problem.organizationName} /><Field label="Sector" value={owner?.industrySegment || problem.sector || problem.industrySegment} /><Field label="Location" value={[owner?.city, owner?.state, owner?.country].filter(Boolean).join(", ") || problem.location} /></dl>{ownerId && <Link href={`/admin/msme-owners/${ownerId}`} className="mt-5 inline-flex rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">Open owner profile</Link>}</Card><Card><SectionTitle title="Impact metrics" copy="Public metrics count these only when marked public." /><form action={saveMetrics} className="mt-5 grid gap-3">{metricFields.map(([key, label, placeholder]) => <label key={String(key)} className="grid gap-1 text-sm text-white/65"><span>{label}</span><input name={String(key)} defaultValue={String(problem.impactMetrics?.[key] || "")} className="rounded-xl border border-white/10 bg-black/30 p-3 text-white" placeholder={placeholder} /></label>)}<label className="text-sm text-white/70"><input type="checkbox" name="isPublic" defaultChecked={Boolean(problem.impactMetrics?.isPublic)} className="mr-2" /> Approved for public impact metrics</label><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Save metrics</button></form></Card><Card><SectionTitle title="Public review moderation" />{review ? <form action={moderateReview} className="mt-5 grid gap-3"><div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-sm text-amber-100">{"★".repeat(review.rating)}<span className="text-white/30">{"★".repeat(Math.max(0, 5 - review.rating))}</span></p><p className="mt-2 text-sm text-white/70">{review.reviewText}</p><p className="mt-2 text-xs text-white/45">Consent for public display: {review.consentForPublicDisplay ? "Yes" : "No"}</p></div><label className="text-sm text-white/70"><input type="checkbox" name="approvedForPublic" defaultChecked={Boolean(review.approvedForPublic)} className="mr-2" /> Approve for public display</label><input name="adminTags" defaultValue={(review.adminTags || []).join(", ")} className="rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Admin tags, comma separated" /><button className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">Save moderation</button></form> : <div className="mt-5"><EmptyState title="No review yet" message="When a solved problem receives feedback, moderation controls appear here." /></div>}</Card></aside></div></div></main>;
}
