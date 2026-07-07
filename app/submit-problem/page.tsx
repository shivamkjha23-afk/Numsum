"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { problemSectors, sectorQuestionnaires, type ProblemSector } from "@/lib/problem-flow";
import { createMemberProblemStatement, getActiveQuestionnaireForSector, getProblemStatementById, updateMemberDraftProblemStatement } from "@/lib/repositories/firestore";
import type { ProblemImpactEstimate, ProblemStatement, QuestionnaireTemplate } from "@/lib/types";

const inputClass = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/35";
const labelClass = "grid gap-2 text-sm text-white/65";
const urgencyOptions = ["low", "medium", "high", "critical"];
const steps = ["Basic problem", "Business context", "Sector questionnaire", "Impact", "Workaround & evidence", "Review & submit"];

type FormState = {
  title: string; summary: string; sector: ProblemSector; subSector: string; problemType: string; urgency: string; location: string;
  organizationName: string; companySize: string; currentProcess: string; affectedDepartment: string; affectedProducts: string;
  questionnaireAnswers: Record<string, string>;
  impactEstimate: ProblemImpactEstimate;
  currentWorkaround: string; previousAttempts: string; evidenceLinksText: string; dataAvailability: string; consentAccepted: boolean;
};
function splitLinks(value: string) { return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean); }
function fieldId(question: string) { return question.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, ""); }
function SubmitProblemForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draft");
  const [step, setStep] = useState(0);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<QuestionnaireTemplate | null>(null);
  const [form, setForm] = useState<FormState>(() => ({
    title: "", summary: "", sector: "Manufacturing", subSector: "", problemType: "", urgency: "medium", location: [profile?.city, profile?.state, profile?.country].filter(Boolean).join(", "),
    organizationName: profile?.organizationName || profile?.startupOrCompanyName || "", companySize: profile?.companySize || "", currentProcess: "", affectedDepartment: "", affectedProducts: profile?.productsOrServices || "",
    questionnaireAnswers: {}, impactEstimate: {}, currentWorkaround: "", previousAttempts: "", evidenceLinksText: "", dataAvailability: "", consentAccepted: false,
  }));
  useEffect(() => {
    if (!draftId || !user) return;
    getProblemStatementById(draftId).then((draft) => {
      if (!draft || draft.status !== "draft" || ![draft.memberId, draft.submittedByUserId, draft.createdBy, draft.submitterId].includes(user.uid)) return;
      setForm({
        title: draft.title || "", summary: draft.summary || draft.shortDescription || "", sector: (draft.sector || draft.industrySegment || "Manufacturing") as ProblemSector, subSector: draft.subSector || draft.subCategory || "", problemType: draft.problemType || "", urgency: String(draft.urgency || "medium"), location: draft.location || [draft.locationCity, draft.locationState, draft.locationCountry].filter(Boolean).join(", "),
        organizationName: draft.organizationName || "", companySize: draft.companySize || "", currentProcess: draft.currentProcess || "", affectedDepartment: draft.affectedDepartment || draft.affectedProcess || "", affectedProducts: draft.affectedProducts || "",
        questionnaireAnswers: Object.fromEntries(Object.entries(draft.questionnaireAnswers || draft.questionnaireResponses || {}).map(([k, v]) => [k, String(v || "")])), impactEstimate: draft.impactEstimate || {}, currentWorkaround: draft.currentWorkaround || "", previousAttempts: draft.previousAttempts || "", evidenceLinksText: (draft.evidenceLinks || draft.attachmentsOrDriveLinks || []).join("\n"), dataAvailability: draft.dataAvailability || draft.availableData || "", consentAccepted: Boolean(draft.consentAccepted || draft.contactConsent),
      });
    }).catch(console.error);
  }, [draftId, user]);
  useEffect(() => { getActiveQuestionnaireForSector(form.sector, "problem_submission").then(setActiveTemplate).catch(() => setActiveTemplate(null)); }, [form.sector]);
  const questions = activeTemplate?.questions?.filter((q) => !q.adminOnly).map((q) => q.label) || sectorQuestionnaires[form.sector] || sectorQuestionnaires.Other;
  const requiredReady = Boolean(form.title.trim() && form.summary.trim() && form.sector && form.problemType.trim() && form.consentAccepted);
  const impactSummary = [form.impactEstimate.monthlyMonetaryLoss, form.impactEstimate.timeLost, form.impactEstimate.wasteOrRejection, form.impactEstimate.productionDelay].filter(Boolean).join(" · ") || "Impact details pending";
  function patch<K extends keyof FormState>(key: K, value: FormState[K]) { setForm((current) => ({ ...current, [key]: value })); }
  function patchImpact(key: keyof ProblemImpactEstimate, value: string) { setForm((current) => ({ ...current, impactEstimate: { ...current.impactEstimate, [key]: value } })); }
  function patchAnswer(question: string, value: string) { const id = fieldId(question); setForm((current) => ({ ...current, questionnaireAnswers: { ...current.questionnaireAnswers, [id]: value } })); }
  function validateFinal() { if (!requiredReady) return "Complete title, summary, sector, problem type, and consent before final submission."; return ""; }
  async function save(status: "draft" | "submitted") {
    if (!user || !profile?.profileComplete) return;
    const validation = status === "submitted" ? validateFinal() : "";
    if (validation) { setMessage(validation); return; }
    setSaving(true);
    setMessage(status === "draft" ? "Saving draft..." : "Submitting your MSME problem...");
    try {
      const memberName = profile.fullName || profile.name || user.displayName || "Member";
      const evidenceLinks = splitLinks(form.evidenceLinksText);
      const data: Omit<ProblemStatement, "id" | "createdAt" | "updatedAt"> & { status: "draft" | "submitted" } = {
        title: form.title.trim() || "Untitled MSME problem draft",
        summary: form.summary.trim(), shortDescription: form.summary.trim(), detailedDescription: form.summary.trim(),
        sector: form.sector, industrySegment: form.sector, category: form.sector, subSector: form.subSector, subCategory: form.subSector, problemType: form.problemType,
        urgency: form.urgency, location: form.location, organizationName: form.organizationName, companySize: form.companySize, currentProcess: form.currentProcess,
        affectedDepartment: form.affectedDepartment, affectedProcess: form.affectedDepartment, affectedProducts: form.affectedProducts,
        questionnaireTemplateId: activeTemplate?.id, questionnaireAnswers: form.questionnaireAnswers, impactEstimate: form.impactEstimate, estimatedImpact: impactSummary, expectedOutcome: form.impactEstimate.expectedOutcome,
        currentWorkaround: form.currentWorkaround, previousAttempts: form.previousAttempts, evidenceLinks, attachmentsOrDriveLinks: evidenceLinks, dataAvailability: form.dataAvailability, availableData: form.dataAvailability,
        consentAccepted: form.consentAccepted, contactConsent: form.consentAccepted, status, visibility: "submitter_only", memberId: user.uid, membershipId: profile.membershipId || "", memberName, memberEmail: profile.email || user.email || "", profileType: profile.profileType,
        submittedByUserId: user.uid, submittedByName: memberName, submittedByEmail: profile.email || user.email || "", submittedByProfileType: profile.profileType, createdBy: user.uid, submittedBy: user.uid, submitterId: user.uid,
        adminVisibilityFlags: { meetingNotesVisibleToMemberDefault: false }, impactMetrics: { isPublic: false },
      };
      const created = draftId ? (await updateMemberDraftProblemStatement(draftId, data, user.uid), { id: draftId }) : await createMemberProblemStatement(data);
      setMessage(status === "draft" ? "Draft saved. You can continue it from My Problems." : "Problem submitted for private NumSum Labs review.");
      window.setTimeout(() => router.push(status === "draft" ? `/dashboard/problems/${created.id}` : "/dashboard/problems"), 900);
    } catch (error) { setMessage(error instanceof Error ? error.message : "Unable to save problem."); } finally { setSaving(false); }
  }
  const reviewRows = useMemo(() => [["Title", form.title], ["Sector", `${form.sector}${form.subSector ? ` / ${form.subSector}` : ""}`], ["Problem type", form.problemType], ["Urgency", form.urgency], ["Organization", form.organizationName], ["Impact", impactSummary], ["Evidence links", splitLinks(form.evidenceLinksText).length ? `${splitLinks(form.evidenceLinksText).length} link(s)` : "None added"]], [form, impactSummary]);
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-6xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Private MSME problem intake</p><h1 className="mt-3 font-display text-5xl">{draftId ? "Continue MSME Problem Draft" : "Submit Your MSME Problem"}</h1><p className="mt-3 max-w-3xl text-white/60">Save a draft anytime, then submit a final private problem for NumSum Labs review when the summary and consent are ready.</p><div className="mt-8 grid gap-3 md:grid-cols-6">{steps.map((label, index) => <button key={label} type="button" onClick={() => setStep(index)} className={`rounded-2xl border p-3 text-left text-sm ${step === index ? "border-blue-300 bg-blue-400/15 text-blue-100" : "border-white/10 bg-white/[0.03] text-white/55"}`}><span className="text-xs">Step {index + 1}</span><br />{label}</button>)}</div><Card className="mt-6"><form onSubmit={(event) => event.preventDefault()}>{step === 0 && <Step title="Step 1 — Basic problem"><div className="grid gap-4 md:grid-cols-2"><Field label="Problem title *"><input value={form.title} onChange={(e) => patch("title", e.target.value)} className={inputClass} placeholder="e.g. Packaging seal failures during dispatch" /></Field><Field label="Sector *"><select value={form.sector} onChange={(e) => patch("sector", e.target.value as ProblemSector)} className={inputClass}>{problemSectors.map((sector) => <option key={sector}>{sector}</option>)}</select></Field><Field label="Sub-sector"><input value={form.subSector} onChange={(e) => patch("subSector", e.target.value)} className={inputClass} /></Field><Field label="Problem type *"><input value={form.problemType} onChange={(e) => patch("problemType", e.target.value)} className={inputClass} placeholder="Downtime, quality, energy, inventory..." /></Field><Field label="Urgency"><select value={form.urgency} onChange={(e) => patch("urgency", e.target.value)} className={inputClass}>{urgencyOptions.map((u) => <option key={u}>{u}</option>)}</select></Field><Field label="Location"><input value={form.location} onChange={(e) => patch("location", e.target.value)} className={inputClass} /></Field><Field label="Short summary *" wide><textarea value={form.summary} onChange={(e) => patch("summary", e.target.value)} className={`${inputClass} min-h-28`} /></Field></div></Step>}{step === 1 && <Step title="Step 2 — Business context"><div className="grid gap-4 md:grid-cols-2"><Field label="Organization/company name"><input value={form.organizationName} onChange={(e) => patch("organizationName", e.target.value)} className={inputClass} /></Field><Field label="Company size"><input value={form.companySize} onChange={(e) => patch("companySize", e.target.value)} className={inputClass} placeholder="Micro, small, medium, 25 employees..." /></Field><Field label="Current process" wide><textarea value={form.currentProcess} onChange={(e) => patch("currentProcess", e.target.value)} className={`${inputClass} min-h-24`} /></Field><Field label="Affected department/process"><input value={form.affectedDepartment} onChange={(e) => patch("affectedDepartment", e.target.value)} className={inputClass} /></Field><Field label="Products/services affected"><input value={form.affectedProducts} onChange={(e) => patch("affectedProducts", e.target.value)} className={inputClass} /></Field></div></Step>}{step === 2 && <Step title={`Step 3 — ${activeTemplate?.title || form.sector + " questionnaire"}`}><div className="grid gap-4 md:grid-cols-2">{questions.map((question) => <Field key={question} label={question}><textarea value={form.questionnaireAnswers[fieldId(question)] || ""} onChange={(e) => patchAnswer(question, e.target.value)} className={`${inputClass} min-h-24`} /></Field>)}</div></Step>}{step === 3 && <Step title="Step 4 — Impact"><div className="grid gap-4 md:grid-cols-2">{[["monthlyMonetaryLoss", "Estimated monthly monetary loss"], ["timeLost", "Time lost"], ["wasteOrRejection", "Waste/rejection"], ["productionDelay", "Production delay"], ["customersAffected", "Customers/orders affected"], ["safetyComplianceImpact", "Safety/compliance impact"], ["expectedOutcome", "Expected outcome after solving"]].map(([key, label]) => <Field key={key} label={label} wide={key === "expectedOutcome"}><textarea value={String(form.impactEstimate[key as keyof ProblemImpactEstimate] || "")} onChange={(e) => patchImpact(key as keyof ProblemImpactEstimate, e.target.value)} className={`${inputClass} min-h-24`} /></Field>)}</div></Step>}{step === 4 && <Step title="Step 5 — Current workaround and evidence"><div className="grid gap-4 md:grid-cols-2"><Field label="Current workaround"><textarea value={form.currentWorkaround} onChange={(e) => patch("currentWorkaround", e.target.value)} className={`${inputClass} min-h-24`} /></Field><Field label="Previous attempts"><textarea value={form.previousAttempts} onChange={(e) => patch("previousAttempts", e.target.value)} className={`${inputClass} min-h-24`} /></Field><Field label="Links/files/evidence" wide><textarea value={form.evidenceLinksText} onChange={(e) => patch("evidenceLinksText", e.target.value)} className={`${inputClass} min-h-24`} placeholder="Paste one link per line" /></Field><Field label="Data availability" wide><textarea value={form.dataAvailability} onChange={(e) => patch("dataAvailability", e.target.value)} className={`${inputClass} min-h-24`} /></Field><label className="flex items-start gap-3 text-sm text-white/70 md:col-span-2"><input checked={form.consentAccepted} onChange={(e) => patch("consentAccepted", e.target.checked)} type="checkbox" className="mt-1" /> I confirm this submission can be privately reviewed by NumSum Labs, and the team may contact me for onboarding or clarification.</label></div></Step>}{step === 5 && <Step title="Step 6 — Review and submit"><div className="grid gap-4 md:grid-cols-2">{reviewRows.map(([label, value]) => <div key={label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"><p className="text-xs uppercase tracking-[.2em] text-white/40">{label}</p><p className="mt-2 text-white/80">{value || "—"}</p></div>)}<div className="md:col-span-2"><h3 className="font-semibold text-blue-100">Questionnaire answers</h3><div className="mt-3 grid gap-3">{questions.map((question) => <p key={question} className="rounded-xl bg-white/[0.03] p-3 text-sm text-white/65"><b>{question}</b><br />{form.questionnaireAnswers[fieldId(question)] || "—"}</p>)}</div></div></div></Step>}<div className="mt-8 flex flex-wrap justify-between gap-3"><div className="flex gap-3"><button type="button" disabled={step === 0} onClick={() => setStep((value) => Math.max(0, value - 1))} className="rounded-full border border-white/10 px-5 py-3 text-white disabled:opacity-40">Back</button><button type="button" disabled={step === steps.length - 1} onClick={() => setStep((value) => Math.min(steps.length - 1, value + 1))} className="rounded-full border border-white/10 px-5 py-3 text-white disabled:opacity-40">Next</button></div><div className="flex gap-3"><button type="button" disabled={saving} onClick={() => save("draft")} className="rounded-full border border-blue-300/30 px-5 py-3 text-blue-100 disabled:opacity-50">Save as draft</button><button type="button" disabled={saving} onClick={() => save("submitted")} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy disabled:opacity-50">Submit final</button></div></div>{message && <p className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white/75">{message}</p>}</form></Card></div></main>;
}
function Step({ title, children }: { title: string; children: React.ReactNode }) { return <section><h2 className="font-display text-3xl">{title}</h2><div className="mt-5">{children}</div></section>; }
function Field({ label, children, wide = false }: { label: string; children: React.ReactNode; wide?: boolean }) { return <label className={`${labelClass} ${wide ? "md:col-span-2" : ""}`}>{label}{children}</label>; }
export default function SubmitProblem() { return <AuthGate><SubmitProblemForm /></AuthGate>; }
