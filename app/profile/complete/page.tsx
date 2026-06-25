"use client";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { isProfileComplete, updateUserProfile } from "@/lib/repositories/firestore";
import type { UserProfile, UserProfileType } from "@/lib/types";

const profileTypes: Array<{ value: UserProfileType; label: string; group: "organization" | "academic" | "professional" | "startup" | "other" }> = [
  { value: "msme_owner", label: "MSME Owner", group: "organization" },
  { value: "msme_representative", label: "MSME Representative", group: "organization" },
  { value: "industrialist", label: "Industrialist", group: "organization" },
  { value: "researcher", label: "Researcher", group: "academic" },
  { value: "student", label: "Student", group: "academic" },
  { value: "engineer_professional", label: "Engineer / Professional", group: "professional" },
  { value: "consultant", label: "Consultant", group: "professional" },
  { value: "startup_founder", label: "Startup Founder", group: "startup" },
  { value: "academic_institution_representative", label: "Academic Institution Representative", group: "organization" },
  { value: "technology_provider", label: "Technology Provider", group: "startup" },
  { value: "government_incubator_association", label: "Government / Incubator / Association", group: "organization" },
  { value: "investor", label: "Investor", group: "other" },
  { value: "other", label: "Other", group: "other" },
];

type FormState = Partial<UserProfile> & { skillsText?: string };
const inputClass = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/35";
const labelClass = "grid gap-2 text-sm text-white/65";
function splitList(value?: string) { return (value || "").split(",").map((item) => item.trim()).filter(Boolean); }
function selectedGroup(profileType?: UserProfileType) { return profileTypes.find((item) => item.value === profileType)?.group || "other"; }
function valueOf(value: unknown) { return Array.isArray(value) ? value.join(", ") : String(value || ""); }

function ProfileCompletionForm() {
  const { user, profile, refreshProfile } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/dashboard";
  const [form, setForm] = useState<FormState>(() => ({
    fullName: profile?.fullName || profile?.name || profile?.displayName || user?.displayName || "",
    email: profile?.email || user?.email || "",
    phoneNumber: profile?.phoneNumber || "",
    profileType: profile?.profileType,
    city: profile?.city || "",
    state: profile?.state || "",
    country: profile?.country || "India",
    shortBio: profile?.shortBio || profile?.professionalSummary || "",
    organizationName: profile?.organizationName || "",
    organizationType: profile?.organizationType || "",
    industrySegment: profile?.industrySegment || "",
    manufacturingOrServiceFocus: profile?.manufacturingOrServiceFocus || "",
    productsOrServices: profile?.productsOrServices || "",
    companySize: profile?.companySize || "",
    website: profile?.website || "",
    gstOrUdyam: profile?.gstOrUdyam || "",
    majorChallenges: profile?.majorChallenges || "",
    institutionName: profile?.institutionName || "",
    departmentOrDiscipline: profile?.departmentOrDiscipline || "",
    researchInterests: profile?.researchInterests || "",
    currentRole: profile?.currentRole || "",
    portfolioOrLinkedIn: profile?.portfolioOrLinkedIn || "",
    domainExpertise: profile?.domainExpertise || "",
    yearsOfExperience: profile?.yearsOfExperience || "",
    industriesWorkedWith: profile?.industriesWorkedWith || "",
    startupOrCompanyName: profile?.startupOrCompanyName || "",
    solutionArea: profile?.solutionArea || "",
    targetIndustries: profile?.targetIndustries || "",
    productStage: profile?.productStage || "",
    skillsText: valueOf(profile?.skills),
  }));
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);
  const group = selectedGroup(form.profileType);
  const completionPreview = useMemo(() => isProfileComplete({ ...profile, ...form, skills: splitList(form.skillsText) }), [form, profile]);
  function patch(key: keyof FormState, value: string) { setForm((current) => ({ ...current, [key]: value })); }
  async function save(progressOnly = false) {
    if (!user) return;
    setSaving(true);
    setMessage(progressOnly ? "Saving progress..." : "Validating and saving profile...");
    try {
      const payload: Partial<UserProfile> = {
        ...form,
        name: form.fullName,
        displayName: form.fullName,
        email: form.email || user.email || "",
        shortBio: form.shortBio,
        professionalSummary: form.shortBio,
        skills: splitList(form.skillsText),
      };
      delete (payload as FormState).skillsText;
      const saved = await updateUserProfile(user.uid, payload);
      await refreshProfile();
      const complete = isProfileComplete(saved);
      if (!progressOnly && complete) {
        setMessage("Profile complete. Redirecting...");
        router.replace(returnTo);
        return;
      }
      setMessage(complete ? "Profile complete. You can continue when ready." : "Progress saved. Complete all required fields to unlock member actions.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save profile.");
    } finally {
      setSaving(false);
    }
  }
  return <main className="min-h-screen bg-navy px-6 py-10"><div className="mx-auto max-w-5xl"><p className="text-sm uppercase tracking-[.35em] text-blue-300">Required member onboarding</p><h1 className="mt-3 font-display text-5xl">Complete your profile</h1><p className="mt-3 max-w-3xl text-white/60">Public browsing stays open, but member actions need this profile so admins and collaborators understand your MSME, research, professional, startup, or institutional context.</p><div className="mt-6 rounded-3xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70"><strong className={completionPreview ? "text-emerald-200" : "text-amber-200"}>{completionPreview ? "Ready to submit" : "Incomplete"}</strong><span className="ml-2">Required fields are marked with * and can be updated later from My Profile.</span></div><div className="mt-8 grid gap-6"><Card><h2 className="font-display text-2xl">1. Basic information</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><label className={labelClass}>Full name *<input className={inputClass} value={form.fullName || ""} onChange={(e) => patch("fullName", e.target.value)} /></label><label className={labelClass}>Email *<input type="email" className={inputClass} value={form.email || ""} onChange={(e) => patch("email", e.target.value)} /></label><label className={labelClass}>Phone number *<input className={inputClass} value={form.phoneNumber || ""} onChange={(e) => patch("phoneNumber", e.target.value)} /></label><label className={labelClass}>Profile type *<select className={inputClass} value={form.profileType || ""} onChange={(e) => patch("profileType", e.target.value)}><option value="">Select profile type</option>{profileTypes.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label><label className={labelClass}>City *<input className={inputClass} value={form.city || ""} onChange={(e) => patch("city", e.target.value)} /></label><label className={labelClass}>State *<input className={inputClass} value={form.state || ""} onChange={(e) => patch("state", e.target.value)} /></label><label className={labelClass}>Country *<input className={inputClass} value={form.country || ""} onChange={(e) => patch("country", e.target.value)} /></label><label className={`${labelClass} md:col-span-2`}>Short bio / professional summary *<textarea className={`${inputClass} min-h-28`} value={form.shortBio || ""} onChange={(e) => patch("shortBio", e.target.value)} /></label></div></Card>{group === "organization" && <Card><h2 className="font-display text-2xl">2. Organization / MSME details</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Field form={form} patch={patch} name="organizationName" label="Organization name *" /><Field form={form} patch={patch} name="organizationType" label="Organization type *" /><Field form={form} patch={patch} name="industrySegment" label="Industry segment *" /><Field form={form} patch={patch} name="manufacturingOrServiceFocus" label="Manufacturing or service focus *" /><Field form={form} patch={patch} name="productsOrServices" label="Products or services *" /><Field form={form} patch={patch} name="companySize" label="Company size *" /><Field form={form} patch={patch} name="website" label="Website *" /><Field form={form} patch={patch} name="gstOrUdyam" label="GST / Udyam (optional)" /><label className={`${labelClass} md:col-span-2`}>Major challenges (optional)<textarea className={`${inputClass} min-h-24`} value={form.majorChallenges || ""} onChange={(e) => patch("majorChallenges", e.target.value)} /></label></div></Card>}{group === "academic" && <Card><h2 className="font-display text-2xl">2. Research / academic details</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Field form={form} patch={patch} name="institutionName" label="Institution name *" /><Field form={form} patch={patch} name="departmentOrDiscipline" label="Department or discipline *" /><Field form={form} patch={patch} name="researchInterests" label="Research interests *" /><Field form={form} patch={patch} name="currentRole" label="Current role *" /><Field form={form} patch={patch} name="skillsText" label="Skills (comma-separated) *" /><Field form={form} patch={patch} name="portfolioOrLinkedIn" label="Portfolio / LinkedIn (optional)" /></div></Card>}{group === "professional" && <Card><h2 className="font-display text-2xl">2. Professional details</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Field form={form} patch={patch} name="domainExpertise" label="Domain expertise *" /><Field form={form} patch={patch} name="yearsOfExperience" label="Years of experience *" /><Field form={form} patch={patch} name="skillsText" label="Skills (comma-separated) *" /><Field form={form} patch={patch} name="industriesWorkedWith" label="Industries worked with *" /><Field form={form} patch={patch} name="portfolioOrLinkedIn" label="Portfolio / LinkedIn (optional)" /></div></Card>}{group === "startup" && <Card><h2 className="font-display text-2xl">2. Startup / technology provider details</h2><div className="mt-5 grid gap-4 md:grid-cols-2"><Field form={form} patch={patch} name="startupOrCompanyName" label="Startup or company name *" /><Field form={form} patch={patch} name="solutionArea" label="Solution area *" /><Field form={form} patch={patch} name="targetIndustries" label="Target industries *" /><Field form={form} patch={patch} name="productStage" label="Product stage *" /><Field form={form} patch={patch} name="website" label="Website (optional)" /></div></Card>}<div className="flex flex-wrap gap-3"><button disabled={saving} onClick={() => save(true)} className="rounded-full border border-white/10 px-5 py-3 text-white disabled:opacity-50">Save progress</button><button disabled={saving || !completionPreview} onClick={() => save(false)} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy disabled:cursor-not-allowed disabled:opacity-50">Complete profile</button></div>{message && <p className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 text-sm text-white/70">{message}</p>}</div></div></main>;
}
function Field({ form, patch, name, label }: { form: FormState; patch: (key: keyof FormState, value: string) => void; name: keyof FormState; label: string }) { return <label className={labelClass}>{label}<input className={inputClass} value={valueOf(form[name])} onChange={(e) => patch(name, e.target.value)} /></label>; }
export default function CompleteProfilePage() { return <AuthGate requireComplete={false}><ProfileCompletionForm /></AuthGate>; }
