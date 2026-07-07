"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { getProblemReviewForMember, upsertProblemPublicReview } from "@/lib/repositories/firestore";
import type { ProblemPublicReview, ProblemStatement } from "@/lib/types";
const input = "rounded-xl border border-white/10 bg-black/30 p-3";
export function ProblemReviewForm({ problem }: { problem: ProblemStatement }) {
  const { user, profile } = useAuth();
  const [review, setReview] = useState<ProblemPublicReview | null>(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [consent, setConsent] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => { if (user) getProblemReviewForMember(problem.id, user.uid).then((r) => { if (r) { setReview(r); setRating(r.rating); setText(r.reviewText); setConsent(Boolean(r.consentForPublicDisplay)); } }); }, [problem.id, user]);
  async function submit() {
    if (!user || !profile) return;
    if (review?.approvedForPublic) return setMessage("This review is already approved publicly and can no longer be edited by members.");
    if (text.trim().length < 8) return setMessage("Please add a short review before submitting.");
    const saved = await upsertProblemPublicReview({ id: review?.id, problemId: problem.id, memberId: user.uid, membershipId: profile.membershipId, memberName: profile.fullName || profile.name || user.displayName || user.email || "Member", organizationName: problem.organizationName || profile.organizationName || profile.startupOrCompanyName, sector: problem.sector || problem.industrySegment || problem.category, problemTitle: problem.title, rating, reviewText: text.trim(), consentForPublicDisplay: consent });
    setReview(saved); setMessage("Review saved. Public display requires admin approval.");
  }
  return <div className="grid gap-3"><div className="rounded-2xl bg-white/[0.03] p-3 text-sm text-white/60">Autofilled: {profile?.fullName || profile?.name || user?.email} · {profile?.membershipId || "membership pending"} · {problem.title}</div><select className={input} value={rating} onChange={(e) => setRating(Number(e.target.value))}>{[5,4,3,2,1].map((n) => <option key={n} value={n}>{n} - {n === 5 ? "Excellent" : n === 4 ? "Good" : n === 3 ? "Average" : n === 2 ? "Needs improvement" : "Poor"}</option>)}</select><textarea className={`${input} min-h-24`} value={text} onChange={(e) => setText(e.target.value)} placeholder="Briefly share what changed after NumSum helped solve this problem." /><label className="flex gap-3 text-sm text-white/65"><input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} /> Allow NumSum to display this review publicly after admin approval.</label><button type="button" onClick={submit} className="rounded-full bg-blue-400 px-5 py-3 font-semibold text-navy">{review ? "Update feedback" : "Submit feedback"}</button>{message && <p className="text-sm text-blue-100">{message}</p>}</div>;
}
