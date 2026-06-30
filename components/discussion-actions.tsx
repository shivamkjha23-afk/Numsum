"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { createDiscussionComment, createDiscussionThread, reportThread } from "@/lib/repositories/firestore";
import type { DiscussionCategory, DiscussionScopeType, DiscussionThread, DiscussionVisibility } from "@/lib/types";

const input = "rounded-xl border border-white/10 bg-black/30 p-3";

type ScopeOption = { type: DiscussionScopeType; id: string; label: string };

export function NewDiscussionForm({ scopeOptions = [] }: { scopeOptions?: ScopeOption[] }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [scopeType, setScopeType] = useState<DiscussionScopeType>("general");
  const filteredScopeOptions = useMemo(() => scopeOptions.filter((option) => option.type === scopeType), [scopeOptions, scopeType]);
  async function submit(formData: FormData) {
    if (!user || !profile?.profileComplete) { setMessage("Complete your profile before posting."); return; }
    const visibility = String(formData.get("visibility") || "members") as DiscussionVisibility;
    await createDiscussionThread({ title: String(formData.get("title") || ""), body: String(formData.get("body") || ""), summary: String(formData.get("body") || "").slice(0, 180), scopeType: String(formData.get("scopeType") || "general") as DiscussionThread["scopeType"], scopeId: String(formData.get("scopeId") || "") || undefined, visibility, category: String(formData.get("category") || "question") as DiscussionCategory, tags: String(formData.get("tags") || "").split(",").map((x)=>x.trim()).filter(Boolean), authorId: user.uid, authorName: profile.name || profile.displayName || user.email || "Member", authorRoleLabel: profile.role });
    setMessage(visibility === "public" ? "Discussion submitted for public moderation review. Admins can approve it from Community Moderation." : "Discussion created and listed for eligible members.");
    if (visibility !== "public") router.push("/community");
  }
  return <form action={submit} className="grid gap-3"><input name="title" required placeholder="Discussion title" className={input}/><textarea name="body" required placeholder="Share practical context, questions, or field observations. Do not include confidential MSME data." className={`${input} h-36`}/><div className="grid gap-3 md:grid-cols-2"><select name="category" className={input}>{["question","field_observation","technical_discussion","research_discussion","competition_discussion","team_coordination","msme_need","announcement"].map((c)=><option key={c} value={c}>{c.replaceAll("_"," ")}</option>)}</select><select name="visibility" defaultValue="members" className={input}><option value="members">Members</option><option value="public">Public (moderated)</option><option value="private_problem">Private problem</option><option value="private_team">Private team</option></select></div><div className="grid gap-3 md:grid-cols-2"><select name="scopeType" value={scopeType} onChange={(event) => setScopeType(event.target.value as DiscussionScopeType)} className={input}>{["general","problem","competition","team","knowledge","research","sop","pilot"].map((s)=><option key={s}>{s}</option>)}</select><select name="scopeId" className={input} disabled={scopeType === "general" && filteredScopeOptions.length === 0}><option value="">{scopeType === "general" ? "General discussion" : `Choose ${scopeType} from data`}</option>{filteredScopeOptions.map((option)=><option key={`${option.type}-${option.id}`} value={option.id}>{option.label}</option>)}</select></div><input name="tags" placeholder="Tags (comma-separated)" className={input}/><button className="rounded-full bg-white px-5 py-3 font-semibold text-black">Submit discussion</button>{message && <p className="text-sm text-white/60">{message}</p>}</form>;
}

export function CommentAndReport({ thread }: { thread: DiscussionThread }) {
  const { user, profile, requestAuth } = useAuth();
  const [message, setMessage] = useState("");
  async function comment(formData: FormData) { if (!user) return requestAuth({ message: "Sign in to comment." }); if (!profile?.profileComplete) { setMessage("Complete your profile before commenting."); return; } await createDiscussionComment({ threadId: thread.id, body: String(formData.get("body") || ""), authorId: user.uid, authorName: profile.name || profile.displayName || user.email || "Member", visibility: thread.visibility }); setMessage("Comment posted."); }
  async function report(formData: FormData) { if (!user) return requestAuth({ message: "Sign in to report." }); if (!profile?.profileComplete) { setMessage("Complete your profile before reporting."); return; } await reportThread(thread.id, user.uid, String(formData.get("reason") || "other") as never, String(formData.get("details") || "")); setMessage("Report submitted for moderation."); }
  const locked = ["locked", "archived", "hidden", "under_review"].includes(thread.status);
  return <div className="grid gap-4"><form action={comment} className="grid gap-3"><textarea name="body" disabled={locked} placeholder={locked ? "This discussion is locked or under moderation." : "Add a practical, respectful reply."} className={`${input} h-28`}/><button disabled={locked} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy disabled:opacity-50">Reply</button></form><form action={report} className="grid gap-3 rounded-2xl border border-white/10 p-4"><p className="text-sm text-white/60">Report inappropriate or confidential content.</p><select name="reason" className={input}>{["spam","abuse","confidential_information","misleading_claim","irrelevant","other"].map((r)=><option key={r}>{r}</option>)}</select><input name="details" placeholder="Optional details" className={input}/><button className="rounded-full bg-white/10 px-5 py-3">Report thread</button></form>{message && <p className="text-sm text-white/60">{message}</p>}</div>;
}
