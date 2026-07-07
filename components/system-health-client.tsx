"use client";

import { limit } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/auth-provider";
import { ErrorState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import {
  COLLECTIONS,
  getAdminAuditLogs,
  getAdminChallenges,
  getAdminProblemStatements,
  getQuestionnaireTemplates,
  getUsers,
  listCollection,
} from "@/lib/repositories/firestore";
import type { ChallengeSubmission, ProblemMeetingNote, ProblemPublicReview } from "@/lib/types";

type HealthData = {
  users: number | null;
  problems: number | null;
  meetingNotes: number | null;
  reviews: number | null;
  questionnaires: number | null;
  challenges: number | null;
  challengeSubmissions: number | null;
  auditLogs?: number | null;
};

function CheckCard({ label, value, detail }: { label: string; value: string | number | null | undefined; detail?: string }) {
  return <Card className="p-5"><p className="text-xs uppercase tracking-[.22em] text-blue-200">{label}</p><p className="mt-3 text-2xl font-semibold text-white">{value ?? "permission denied"}</p>{detail && <p className="mt-2 text-sm text-white/55">{detail}</p>}</Card>;
}

export function SystemHealthClient() {
  const { user, profile, role } = useAuth();
  const [data, setData] = useState<HealthData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;
    Promise.all([
      getUsers(500).then((rows) => rows.length).catch(() => null),
      getAdminProblemStatements(500).then((rows) => rows.length).catch(() => null),
      listCollection<ProblemMeetingNote>(COLLECTIONS.problemMeetingNotes, [limit(500)]).then((rows) => rows.length).catch(() => null),
      listCollection<ProblemPublicReview>(COLLECTIONS.problemPublicReviews, [limit(500)]).then((rows) => rows.length).catch(() => null),
      getQuestionnaireTemplates().then((rows) => rows.length).catch(() => null),
      getAdminChallenges().then((rows) => rows.length).catch(() => null),
      listCollection<ChallengeSubmission>(COLLECTIONS.challengeSubmissions, [limit(500)]).then((rows) => rows.length).catch(() => null),
      profile?.role === "super_admin" ? getAdminAuditLogs().then((rows) => rows.length).catch(() => null) : Promise.resolve(undefined),
    ])
      .then(([users, problems, meetingNotes, reviews, questionnaires, challenges, challengeSubmissions, auditLogs]) => {
        if (mounted) setData({ users, problems, meetingNotes, reviews, questionnaires, challenges, challengeSubmissions, auditLogs });
      })
      .catch((err) => mounted && setError(err instanceof Error ? err.message : "Unable to load system health."));
    return () => { mounted = false; };
  }, [profile?.role]);

  if (error) return <ErrorState retryHref="/admin/system-health" message={error} />;
  if (!data) return <LoadingState label="Checking Firestore" />;

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl">Auth and profile access</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <CheckCard label="Current account" value={user?.email || user?.uid || "unknown"} />
          <CheckCard label="Current role" value={role || profile?.role || "unloaded"} />
          <CheckCard label="Profile document" value={profile?.membershipId || profile?.uid || "not loaded"} detail={profile?.profileComplete ? "Profile complete" : "Profile incomplete or admin bootstrap"} />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">Firestore operational reads</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CheckCard label="problem_statements" value={data.problems} />
          <CheckCard label="problem_meeting_notes" value={data.meetingNotes} />
          <CheckCard label="problem_reviews_public" value={data.reviews} />
          <CheckCard label="questionnaire_templates" value={data.questionnaires} />
          <CheckCard label="challenges" value={data.challenges} detail="Backed by the current challenge/competition collection." />
          <CheckCard label="challenge_submissions" value={data.challengeSubmissions} />
          <CheckCard label="users" value={data.users} />
          {profile?.role === "super_admin" && <CheckCard label="admin_audit_logs" value={data.auditLogs} />}
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl">MOM/PDF status</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <CheckCard label="Structured notes" value={data.meetingNotes} detail="problem_meeting_notes is the source of truth." />
          <CheckCard label="Web MOM rendering" value="available" detail="Admins and members view MOMs as system pages." />
          <CheckCard label="PDF/download" value="print on demand" detail="Use browser Print / Save as PDF from the MOM page." />
          <CheckCard label="Permanent file storage" value="not configured by design" detail="Storage not configured by design — PDFs are generated on demand." />
        </div>
      </section>
    </div>
  );
}
