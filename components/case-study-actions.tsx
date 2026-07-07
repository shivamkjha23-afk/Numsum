"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Card } from "@/components/ui";
import { createCaseStudyComment, getApprovedCaseStudyComments, getCaseStudyUpvote, getMemberPendingCaseStudyComments, toggleCaseStudyUpvote } from "@/lib/repositories/firestore";
import type { CaseStudyComment } from "@/lib/types";

export function CaseStudyActions({ caseStudyId, title }: { caseStudyId: string; title: string }) {
  const { user, profile, profileComplete, requestAuth } = useAuth();
  const router = useRouter();
  const [comments, setComments] = useState<CaseStudyComment[]>([]);
  const [upvoted, setUpvoted] = useState(false);
  const [body, setBody] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => {
    let active = true;
    Promise.all([
      getApprovedCaseStudyComments(caseStudyId),
      user ? getMemberPendingCaseStudyComments(caseStudyId, user.uid) : Promise.resolve([]),
    ]).then(([approved, pending]) => { if (active) setComments([...pending, ...approved]); });
    if (user) getCaseStudyUpvote(caseStudyId, user.uid).then((v) => { if (active) setUpvoted(Boolean(v)); });
    return () => { active = false; };
  }, [caseStudyId, user]);
  function requireMemberAction(action: string) { if (!user) { requestAuth({ message: `Sign in to ${action} this case study.`, returnTo: window.location.pathname }); return false; } if (!profileComplete) { router.push(`/profile/complete?returnTo=${encodeURIComponent(window.location.pathname)}`); return false; } return true; }
  async function vote() { if (!requireMemberAction("upvote")) return; const next = await toggleCaseStudyUpvote(caseStudyId, user!.uid, profile?.membershipId); setUpvoted(next); setMessage(next ? `Thanks for upvoting “${title}”.` : "Upvote removed."); }
  async function comment() { if (!requireMemberAction("comment on")) return; if (body.trim().length < 4) return setMessage("Add a short comment first."); const saved = await createCaseStudyComment({ caseStudyId, memberId: user!.uid, membershipId: profile?.membershipId, memberName: profile?.fullName || profile?.name || user?.email || "Member", profileType: profile?.profileType, body: body.trim() }); setComments((rows) => [saved, ...rows]); setBody(""); setMessage("Comment saved for moderation."); }
  return <div className="grid gap-5"><Card><h2 className="font-display text-2xl">Member actions</h2><p className="mt-2 text-sm text-white/60">{user ? "Upvote or share whether this approach could work for your business." : "Sign in to comment or upvote."}</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={vote} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">{upvoted ? "Remove upvote" : "Upvote as helpful"}</button></div><div className="mt-5 grid gap-3"><textarea value={body} onChange={(e) => setBody(e.target.value)} className="min-h-24 rounded-xl border border-white/10 bg-black/30 p-3" placeholder="Did this approach work for your business? Share your experience." /><button onClick={comment} className="rounded-full border border-white/10 px-5 py-3 text-white">Comment</button></div>{message && <p className="mt-3 text-sm text-blue-100">{message}</p>}</Card><Card><h2 className="font-display text-3xl">Comments</h2><div className="mt-4 grid gap-3">{comments.length ? comments.map((c) => <div key={c.id} className="rounded-2xl bg-white/[0.03] p-3"><p className="text-sm text-blue-100">{c.memberName || "Member"} · {c.status || "pending"}</p><p className="mt-2 text-white/70">{c.body}</p></div>) : <p className="text-white/60">No comments yet. Be the first member to share a practical experience.</p>}</div></Card></div>;
}
