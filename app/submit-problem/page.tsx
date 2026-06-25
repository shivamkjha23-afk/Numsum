"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createProblemStatement } from "@/lib/repositories/firestore";

const inputClass = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/35";
const labelClass = "grid gap-2 text-sm text-white/65";
const categories = ["Manufacturing", "Reliability", "Quality", "Energy", "Digital Transformation", "Supply Chain", "Export", "Finance", "Product Development", "Other"];
const urgencyOptions = ["low", "medium", "high", "critical"];
function splitList(value: string) { return value.split(/\n|,/).map((item) => item.trim()).filter(Boolean); }

function SubmitProblemForm() {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  async function submit(formData: FormData) {
    if (!user || !profile?.profileComplete) return;
    setSaving(true);
    setMessage("Submitting your private MSME problem...");
    try {
      const created = await createProblemStatement({
        title: String(formData.get("title") || ""),
        shortDescription: String(formData.get("shortDescription") || ""),
        detailedDescription: String(formData.get("detailedDescription") || ""),
        submittedByUserId: user.uid,
        submittedByName: profile.fullName || profile.name || user.displayName || "",
        submittedByEmail: profile.email || user.email || "",
        submittedByProfileType: profile.profileType,
        organizationName: String(formData.get("organizationName") || profile.organizationName || ""),
        industrySegment: String(formData.get("industrySegment") || profile.industrySegment || ""),
        manufacturingOrServiceFocus: String(formData.get("manufacturingOrServiceFocus") || profile.manufacturingOrServiceFocus || ""),
        locationCity: String(formData.get("locationCity") || profile.city || ""),
        locationState: String(formData.get("locationState") || profile.state || ""),
        locationCountry: String(formData.get("locationCountry") || profile.country || ""),
        category: String(formData.get("category") || "Other"),
        subCategory: String(formData.get("subCategory") || ""),
        affectedProcess: String(formData.get("affectedProcess") || ""),
        problemFrequency: String(formData.get("problemFrequency") || ""),
        urgency: String(formData.get("urgency") || "medium"),
        estimatedImpact: String(formData.get("estimatedImpact") || ""),
        currentWorkaround: String(formData.get("currentWorkaround") || ""),
        expectedOutcome: String(formData.get("expectedOutcome") || ""),
        availableData: String(formData.get("availableData") || ""),
        attachmentsOrDriveLinks: splitList(String(formData.get("attachmentsOrDriveLinks") || "")),
        tags: splitList(String(formData.get("tags") || "")),
        contactConsent: formData.get("contactConsent") === "on",
        createdBy: user.uid,
        submittedBy: user.uid,
        submitterId: user.uid,
      });
      setMessage("Your problem has been submitted. It is currently visible only to you and the NumSum Labs admin team. Our team may contact you for a detailed onboarding session.");
      window.setTimeout(() => router.push(`/problem-statements/${created.id}`), 1200);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to submit problem.");
    } finally {
      setSaving(false);
    }
  }
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-5xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Private MSME challenge intake</p><h1 className="mt-3 font-display text-5xl">Submit MSME Problem</h1><p className="mt-3 max-w-3xl text-white/60">Completed-profile members can submit problems for private admin review. Submissions are not public until an admin publishes them.</p><form action={submit} className="mt-8 grid gap-6"><Card><h2 className="font-display text-2xl">A. Basic Problem</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className={labelClass}>Problem title *<input name="title" required className={inputClass} placeholder="e.g. CNC spindle downtime during peak production" /></label><label className={labelClass}>Category *<select name="category" required className={inputClass}>{categories.map((item) => <option key={item}>{item}</option>)}</select></label><label className={labelClass}>Sub-category<input name="subCategory" className={inputClass} placeholder="Maintenance, inspection, energy, export readiness..." /></label><label className={labelClass}>Affected process<input name="affectedProcess" className={inputClass} placeholder="Production line, QA, dispatch, procurement..." /></label><label className={`${labelClass} md:col-span-2`}>Short description *<textarea name="shortDescription" required className={`${inputClass} min-h-24`} /></label><label className={`${labelClass} md:col-span-2`}>Detailed description *<textarea name="detailedDescription" required className={`${inputClass} min-h-36`} /></label></div></Card><Card><h2 className="font-display text-2xl">B. Industry / MSME Context</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className={labelClass}>Organization<input name="organizationName" defaultValue={profile?.organizationName || ""} className={inputClass} /></label><label className={labelClass}>Industry segment<input name="industrySegment" defaultValue={profile?.industrySegment || ""} className={inputClass} /></label><label className={labelClass}>Manufacturing / service focus<input name="manufacturingOrServiceFocus" defaultValue={profile?.manufacturingOrServiceFocus || ""} className={inputClass} /></label><label className={labelClass}>City<input name="locationCity" defaultValue={profile?.city || ""} className={inputClass} /></label><label className={labelClass}>State<input name="locationState" defaultValue={profile?.state || ""} className={inputClass} /></label><label className={labelClass}>Country<input name="locationCountry" defaultValue={profile?.country || ""} className={inputClass} /></label></div></Card><Card><h2 className="font-display text-2xl">C. Impact and Urgency</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className={labelClass}>Problem frequency<input name="problemFrequency" className={inputClass} placeholder="Daily, weekly, seasonal, one-time..." /></label><label className={labelClass}>Urgency<select name="urgency" className={inputClass}>{urgencyOptions.map((item) => <option key={item} value={item}>{item}</option>)}</select></label><label className={`${labelClass} md:col-span-2`}>Estimated impact<textarea name="estimatedImpact" className={`${inputClass} min-h-24`} placeholder="Downtime, scrap, cost, quality, safety, customer delay..." /></label></div></Card><Card><h2 className="font-display text-2xl">D. Current Workaround and Expected Outcome</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className={labelClass}>Current workaround<textarea name="currentWorkaround" className={`${inputClass} min-h-28`} /></label><label className={labelClass}>Expected outcome<textarea name="expectedOutcome" className={`${inputClass} min-h-28`} /></label></div></Card><Card><h2 className="font-display text-2xl">E. Data / Attachments / Links</h2><div className="mt-5 grid gap-4"><label className={labelClass}>Available data<textarea name="availableData" className={`${inputClass} min-h-24`} placeholder="Machine logs, photos, quality reports, invoices, export docs..." /></label><label className={labelClass}>Drive links / attachments<textarea name="attachmentsOrDriveLinks" className={`${inputClass} min-h-24`} placeholder="Paste one link per line or comma separated" /></label><label className={labelClass}>Tags<input name="tags" className={inputClass} placeholder="Comma-separated tags" /></label></div></Card><Card><h2 className="font-display text-2xl">F. Consent and Contact Permission</h2><label className="flex items-start gap-3 text-sm text-white/70"><input name="contactConsent" type="checkbox" required className="mt-1" /> I confirm this submission can be reviewed privately by NumSum Labs admins, and the team may contact me for onboarding or clarification.</label></Card><div className="flex flex-wrap gap-3"><button disabled={saving} className="rounded-full bg-blue-400 px-6 py-3 font-semibold text-navy disabled:opacity-50">Submit private problem</button><a href="/problem-statements/my" className="rounded-full border border-white/10 px-6 py-3 text-white">View my problems</a></div>{message && <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-white/75">{message}</p>}</form></div></main>;
}
export default function SubmitProblem() { return <AuthGate><SubmitProblemForm /></AuthGate>; }
