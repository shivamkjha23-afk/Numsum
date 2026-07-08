"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createDiscussionComment, createDiscussionThread, reportThread } from "@/lib/repositories/firestore";
import type { DiscussionCategory, DiscussionScopeType, DiscussionThread, DiscussionVisibility } from "@/lib/types";

const input = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/45";
const postTypes = [
  ["msme_need", "MSME problem suggestion request"],
  ["research_discussion", "Research collaboration"],
  ["question", "Student project interest"],
  ["research_discussion", "Patent / technology showcase"],
  ["field_observation", "Product / service offering"],
  ["competition_discussion", "Challenge discussion"],
  ["technical_discussion", "Case study discussion"],
  ["question", "General question"],
] as const;
const sectors = ["Manufacturing", "Textile", "Food processing", "Auto components", "Electronics", "Chemical", "Packaging", "Logistics", "Services", "Other"];
const tagChips = ["quality", "automation", "waste", "maintenance", "research", "student-project", "pilot", "case-study"];
const linkedEntityTypes = [
  ["general", "Sector / topic only"],
  ["problem", "Problem"],
  ["competition", "Challenge"],
  ["knowledge", "Case study"],
  ["research", "Research item"],
] as const;

type ScopeOption = { type: DiscussionScopeType; id: string; label: string };

export function NewDiscussionForm({ scopeOptions = [], onDone }: { scopeOptions?: ScopeOption[]; onDone?: () => void }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [scopeType, setScopeType] = useState<DiscussionScopeType>("general");
  const [isPending, startTransition] = useTransition();
  const filteredScopeOptions = useMemo(() => scopeOptions.filter((option) => option.type === scopeType), [scopeOptions, scopeType]);
  async function submit(formData: FormData) {
    setError("");
    setMessage("");
    if (!user || !profile?.profileComplete) { setError("Complete your profile before posting."); return; }
    const title = String(formData.get("title") || "").trim();
    const body = String(formData.get("body") || "").trim();
    if (title.length < 6) { setError("Add a short, clear title so moderators and members understand the topic."); return; }
    if (body.length < 20) { setError("Add a little more context so people can reply usefully."); return; }
    const visibility = String(formData.get("visibility") || "public") as DiscussionVisibility;
    const selectedScopeType = String(formData.get("scopeType") || "general") as DiscussionThread["scopeType"];
    const sector = String(formData.get("sector") || "").trim();
    const tags = [...formData.getAll("tagChip").map(String), ...String(formData.get("tags") || "").split(",").map((x)=>x.trim()).filter(Boolean), sector].filter(Boolean);
    try {
      await createDiscussionThread({
        title,
        body,
        summary: body.slice(0, 180),
        scopeType: selectedScopeType,
        scopeId: String(formData.get("scopeId") || "") || undefined,
        visibility,
        category: String(formData.get("category") || "question") as DiscussionCategory,
        tags,
        authorId: user.uid,
        authorName: profile.name || profile.displayName || user.email || "Member",
        authorRoleLabel: profile.profileType || profile.role,
      });
      setMessage(visibility === "public" ? "Saved and queued for Community Moderation." : "Saved and listed for eligible members.");
      startTransition(() => router.refresh());
      window.setTimeout(() => onDone?.(), 900);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save discussion. Please try again.");
    }
  }
  return <form action={submit} className="grid gap-4">
    <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm text-blue-100">Autofilled from your profile: {profile?.fullName || profile?.name || user?.email || "Member"} · {profile?.membershipId || "membership pending"} · {profile?.profileType || "member"}. Choose a post type first, then optionally link it to a problem, challenge, case study, research item, or sector/topic.</div>
    <div className="grid gap-3 md:grid-cols-2"><select name="category" defaultValue="msme_need" className={input}>{postTypes.map(([value,label], index)=><option key={`${value}-${index}`} value={value}>{label}</option>)}</select><select name="visibility" defaultValue="public" className={input}><option value="public">Public after admin approval</option><option value="members">Members only</option></select></div>
    <input name="title" required minLength={6} maxLength={140} placeholder="What do you want to discuss?" className={input}/>
    <textarea name="body" required minLength={20} placeholder="Share context, question, collaboration need, technology note, or field observation. Avoid confidential MSME data, contact numbers, private drawings, financials, or proprietary process details." className={`${input} h-40`}/>
    <div className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-2"><select name="scopeType" value={scopeType} onChange={(event) => setScopeType(event.target.value as DiscussionScopeType)} className={input}>{linkedEntityTypes.map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><input name="scopeId" placeholder={scopeType === "general" ? "Optional sector/topic link" : `Paste ${scopeType} ID or slug`} className={input} list="linked-scope-options"/><datalist id="linked-scope-options">{filteredScopeOptions.map((option)=><option key={`${option.type}-${option.id}`} value={option.id}>{option.label}</option>)}</datalist><select name="sector" defaultValue={profile?.industrySegment || ""} className={input}><option value="">Select sector/topic</option>{sectors.map((sector)=><option key={sector}>{sector}</option>)}</select><input name="tags" placeholder="Custom tags (comma-separated)" className={input}/><div className="md:col-span-2 flex flex-wrap gap-2">{tagChips.map((tag)=><label key={tag} className="rounded-full bg-white/10 px-3 py-1 text-xs"><input type="checkbox" name="tagChip" value={tag} className="mr-1" />#{tag}</label>)}</div></div>
    <button disabled={isPending} className="rounded-full bg-white px-5 py-3 font-semibold text-black disabled:opacity-60">{isPending ? "Saving…" : "Submit discussion"}</button>
    {message && <p className="rounded-2xl border border-green-300/20 bg-green-400/10 p-3 text-sm text-green-100">{message}</p>}
    {error && <p className="rounded-2xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}
  </form>;
}

export function CommentAndReport({ thread }: { thread: DiscussionThread }) {
  const { user, profile, requestAuth } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function comment(formData: FormData) { setError(""); setMessage(""); if (!user) return requestAuth({ message: "Sign in to comment." }); if (!profile?.profileComplete) { setError("Complete your profile before commenting."); return; } const body = String(formData.get("body") || "").trim(); if (body.length < 2) { setError("Write a reply before posting."); return; } await createDiscussionComment({ threadId: thread.id, body, authorId: user.uid, authorName: profile.name || profile.displayName || user.email || "Member", visibility: thread.visibility }); setMessage("Comment saved. Refreshing comments…"); window.location.hash = "comments"; window.location.reload(); }
  async function report(formData: FormData) { if (!user) return requestAuth({ message: "Sign in to report." }); if (!profile?.profileComplete) { setError("Complete your profile before reporting."); return; } await reportThread(thread.id, user.uid, String(formData.get("reason") || "other") as never, String(formData.get("details") || "")); setMessage("Report submitted for moderation."); }
  const locked = ["locked", "archived", "hidden", "under_review"].includes(thread.status);
  return <div className="grid gap-4"><form action={comment} className="grid gap-3"><textarea name="body" disabled={locked} placeholder={locked ? "This discussion is locked or under moderation." : "Quick comment: add a practical, respectful reply."} className={`${input} h-28`}/><button disabled={locked} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy disabled:opacity-50">Post quick comment</button></form><form action={report} className="grid gap-3 rounded-2xl border border-white/10 p-4"><p className="text-sm text-white/60">Report inappropriate or confidential content.</p><select name="reason" className={input}>{["spam","abuse","confidential_information","misleading_claim","irrelevant","other"].map((r)=><option key={r}>{r}</option>)}</select><input name="details" placeholder="Optional details" className={input}/><button className="rounded-full bg-white/10 px-5 py-3">Report thread</button></form>{message && <p className="text-sm text-green-100">{message}</p>}{error && <p className="text-sm text-red-100">{error}</p>}</div>;
}
