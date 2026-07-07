"use client";

import Link from "next/link";
import { limit } from "firebase/firestore";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, ErrorState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { COLLECTIONS, listCollection, moderateProblemPublicReview } from "@/lib/repositories/firestore";
import type { DateLike, ProblemPublicReview } from "@/lib/types";

function dateLabel(value?: DateLike) {
  if (!value) return "Not recorded";
  const date = typeof value === "object" && "toDate" in value && typeof value.toDate === "function" ? value.toDate() : new Date(value as string | number | Date);
  return Number.isNaN(date.getTime()) ? "Not recorded" : date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}
function statusFor(review: ProblemPublicReview) {
  if (review.moderationStatus) return review.moderationStatus;
  if (review.approvedForPublic) return "approved";
  return review.consentForPublicDisplay ? "pending" : "hidden";
}

export default function AdminReviewsPage() {
  const { profile } = useAuth();
  const [reviews, setReviews] = useState<ProblemPublicReview[]>([]);
  const [filter, setFilter] = useState("pending");
  const [tagsById, setTagsById] = useState<Record<string, string>>({});
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setError("");
    listCollection<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, [limit(500)])
      .then(setReviews)
      .catch((err) => setError(err instanceof Error ? err.message : "Unable to load problem reviews."));
  };
  useEffect(load, []);

  const filtered = useMemo(() => reviews.filter((review) => filter === "all" || statusFor(review) === filter), [filter, reviews]);
  async function moderate(review: ProblemPublicReview, moderationStatus: "approved" | "rejected" | "hidden") {
    setBusyId(review.id);
    const tags = (tagsById[review.id] || review.adminTags?.join(",") || "").split(",").map((tag) => tag.trim()).filter(Boolean);
    try {
      await moderateProblemPublicReview(review.id, { approvedForPublic: moderationStatus === "approved", moderationStatus, adminTags: tags, reviewedBy: profile?.uid || profile?.id });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to moderate review.");
    } finally {
      setBusyId("");
    }
  }

  if (error) return <main className="px-4 py-8 md:px-8"><ErrorState retryHref="/admin/reviews" message={error} /></main>;
  if (!reviews.length) return <main className="px-4 py-8 md:px-8"><EmptyState title="No problem reviews yet" message="Solved-problem feedback will appear here once members submit it." /></main>;

  return (
    <main className="px-4 py-8 md:px-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[.28em] text-blue-300">Review moderation</p>
          <h1 className="mt-2 font-display text-4xl md:text-5xl">Problem Reviews</h1>
          <p className="mt-3 max-w-3xl text-white/65">Approve public testimonials, hide unsuitable reviews, and tag feedback without changing the member's original text.</p>
        </div>
        <select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-sm text-white">
          {['all','pending','approved','rejected','hidden'].map((item) => <option key={item} value={item}>{item.replace('_',' ')}</option>)}
        </select>
      </div>

      <div className="mt-8 grid gap-4">
        {filtered.length ? filtered.map((review) => (
          <Card key={review.id}>
            <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-white/55">
                  <span className="rounded-full border border-white/15 px-3 py-1 text-white">{review.rating}/5</span>
                  <span>{statusFor(review)}</span>
                  <span>·</span>
                  <span>{dateLabel(review.createdAt)}</span>
                  <span>·</span>
                  <span>{review.sector || "Sector pending"}</span>
                </div>
                <p className="mt-4 text-lg text-white">“{review.reviewText}”</p>
                <p className="mt-3 text-sm text-white/60">{review.memberName || "Member"} · {review.membershipId || "No membership ID"} · {review.organizationName || "Organization not shared"}</p><p className="mt-1 text-sm text-white/50">Problem: {review.problemTitle || review.problemId || "Not linked"} · Public consent: {review.consentForPublicDisplay ? "yes" : "no"}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-blue-100/80">{(review.adminTags || []).map((tag) => <span key={tag} className="rounded-full bg-blue-400/10 px-3 py-1">#{tag}</span>)}</div>
              </div>
              <div className="rounded-2xl border border-white/10 p-4">
                <label className="text-xs uppercase tracking-[.2em] text-blue-200">Admin tags</label>
                <input value={tagsById[review.id] ?? review.adminTags?.join(", ") ?? ""} onChange={(event) => setTagsById((current) => ({ ...current, [review.id]: event.target.value }))} placeholder="impact, textile, savings" className="mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white" />
                <div className="mt-4 grid gap-2">
                  <button disabled={busyId === review.id} onClick={() => moderate(review, "approved")} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black disabled:opacity-50">Approve public</button>
                  <button disabled={busyId === review.id} onClick={() => moderate(review, "rejected")} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Reject</button>
                  <button disabled={busyId === review.id} onClick={() => moderate(review, "hidden")} className="rounded-full border border-white/15 px-4 py-2 text-sm font-semibold text-white/70 disabled:opacity-50">Hide</button>
                  {review.problemId && <Link href={`/admin/problems/${review.problemId}`} className="text-center text-sm text-blue-200 hover:text-white">Open linked problem</Link>}
                </div>
              </div>
            </div>
          </Card>
        )) : <EmptyState title="No reviews in this status" message="Switch filters to see the rest of the review queue." />}
      </div>
    </main>
  );
}
