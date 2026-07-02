"use client";
import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createDiscussionComment, createDiscussionThread, reportThread } from "@/lib/repositories/firestore";
import type { DiscussionCategory, DiscussionScopeType, DiscussionThread, DiscussionVisibility } from "@/lib/types";

const input = "rounded-xl border border-white/10 bg-black/30 p-3 text-white placeholder:text-white/45";

type ScopeOption = { type: DiscussionScopeType; id: string; label: string };

export function NewDiscussionForm({ scopeOptions = [], onDone }: { scopeOptions?: ScopeOption[]; onDone?: () => void }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
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
    try {
      await createDiscussionThread({
        title,
        body,
        summary: body.slice(0, 180),
        scopeType: selectedScopeType,
        scopeId: String(formData.get("scopeId") || "") || undefined,
        visibility,
        category: String(formData.get("category") || "question") as DiscussionCategory,
        tags: String(formData.get("tags") || "").split(",").map((x)=>x.trim()).filter(Boolean),
        authorId: user.uid,
        authorName: profile.name || profile.displayName || user.email || "Member",
        authorRoleLabel: profile.role,
      });
      setMessage(visibility === "public" ? "Saved to Firestore and sent to Community Moderation." : "Saved to Firestore and listed for eligible members.");
      startTransition(() => router.refresh());
      if (visibility === "public") {
        window.setTimeout(() => onDone?.(), 1200);
      } else {
        window.setTimeout(() => router.push("/community"), 500);
        window.setTimeout(() => onDone?.(), 700);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save discussion. Please try again.");
    }
  }
  return <form action={submit} className="grid gap-4">
    <div className="rounded-2xl border border-blue-300/20 bg-blue-500/10 p-4 text-sm text-blue-100">Create with only a title and context. Public posts are saved immediately as moderation items; approved posts become visible in the community list.</div>
    <input name="title" required minLength={6} maxLength={140} placeholder="What do you want to discuss?" className={input}/>
    <textarea name="body" required minLength={20} placeholder="Share context, question, or field observation. Avoid confidential MSME data, contact numbers, private drawings, financials, or proprietary process details." className={`${input} h-40`}/>
    <div className="grid gap-3 md:grid-cols-2"><select name="category" defaultValue="question" className={input}>{[["question","Question"],["field_observation","Field observation"],["technical_discussion","Technical discussion"],["msme_need","MSME need"],["announcement","Announcement"]].map(([value,label])=><option key={value} value={value}>{label}</option>)}</select><select name="visibility" defaultValue="public" className={input}><option value="public">Public after admin approval</option><option value="members">Members only</option></select></div>
    <button type="button" onClick={() => setShowAdvanced((value) => !value)} className="justify-self-start rounded-full border border-white/10 px-4 py-2 text-sm text-white/70">{showAdvanced ? "Hide" : "Show"} optional linking</button>
    {showAdvanced && <div className="grid gap-3 rounded-2xl border border-white/10 p-4 md:grid-cols-2"><select name="scopeType" value={scopeType} onChange={(event) => setScopeType(event.target.value as DiscussionScopeType)} className={input}>{["general","problem","competition","team","knowledge","research","sop","pilot"].map((s)=><option key={s}>{s}</option>)}</select><select name="scopeId" className={input} disabled={scopeType === "general" && filteredScopeOptions.length === 0}><option value="">{scopeType === "general" ? "General discussion" : `Choose ${scopeType} from data`}</option>{filteredScopeOptions.map((option)=><option key={`${option.type}-${option.id}`} value={option.id}>{option.label}</option>)}</select><input name="tags" placeholder="Tags (comma-separated)" className={`${input} md:col-span-2`}/></div>}
    <button disabled={isPending} className="rounded-full bg-white px-5 py-3 font-semibold text-black disabled:opacity-60">{isPending ? "Saving…" : "Submit discussion"}</button>
    {message && <p className="rounded-2xl border border-green-300/20 bg-green-400/10 p-3 text-sm text-green-100">{message}</p>}
    {error && <p className="rounded-2xl border border-red-300/20 bg-red-400/10 p-3 text-sm text-red-100">{error}</p>}
  </form>;
}

export function CommentAndReport({ thread }: { thread: DiscussionThread }) {
  const { user, profile, requestAuth } = useAuth();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  async function comment(formData: FormData) { setError(""); if (!user) return requestAuth({ message: "Sign in to comment." }); if (!profile?.profileComplete) { setError("Complete your profile before commenting."); return; } const body = String(formData.get("body") || "").trim(); if (body.length < 2) { setError("Write a reply before posting."); return; } await createDiscussionComment({ threadId: thread.id, body, authorId: user.uid, authorName: profile.name || profile.displayName || user.email || "Member", visibility: thread.visibility }); setMessage("Comment saved to Firestore."); }
  async function report(formData: FormData) { if (!user) return requestAuth({ message: "Sign in to report." }); if (!profile?.profileComplete) { setError("Complete your profile before reporting."); return; } await reportThread(thread.id, user.uid, String(formData.get("reason") || "other") as never, String(formData.get("details") || "")); setMessage("Report submitted for moderation."); }
  const locked = ["locked", "archived", "hidden", "under_review"].includes(thread.status);
  return <div className="grid gap-4"><form action={comment} className="grid gap-3"><textarea name="body" disabled={locked} placeholder={locked ? "This discussion is locked or under moderation." : "Add a practical, respectful reply."} className={`${input} h-28`}/><button disabled={locked} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy disabled:opacity-50">Reply</button></form><form action={report} className="grid gap-3 rounded-2xl border border-white/10 p-4"><p className="text-sm text-white/60">Report inappropriate or confidential content.</p><select name="reason" className={input}>{["spam","abuse","confidential_information","misleading_claim","irrelevant","other"].map((r)=><option key={r}>{r}</option>)}</select><input name="details" placeholder="Optional details" className={input}/><button className="rounded-full bg-white/10 px-5 py-3">Report thread</button></form>{message && <p className="text-sm text-green-100">{message}</p>}{error && <p className="text-sm text-red-100">{error}</p>}</div>;
}
