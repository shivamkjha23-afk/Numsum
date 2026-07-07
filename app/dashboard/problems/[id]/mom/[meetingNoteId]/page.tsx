"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { EmptyState, LoadingState } from "@/components/data-states";
import { MomWebView } from "@/components/mom-web-view";
import { getMemberVisibleProblemMeetingNotes, getProblemStatementById } from "@/lib/repositories/firestore";
import type { ProblemMeetingNote, ProblemStatement, UserProfile } from "@/lib/types";

function owns(problem: ProblemStatement, uid?: string) { return Boolean(uid && [problem.memberId, problem.submittedByUserId, problem.createdBy, problem.submitterId].includes(uid)); }

function MemberMomContent() {
  const { id, meetingNoteId } = useParams<{ id: string; meetingNoteId: string }>();
  const { user, profile } = useAuth();
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [note, setNote] = useState<ProblemMeetingNote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    let mounted = true;
    (async () => {
      const loadedProblem = await getProblemStatementById(id);
      if (!loadedProblem || !owns(loadedProblem, user.uid)) return;
      const notes = await getMemberVisibleProblemMeetingNotes(id);
      const loadedNote = notes.find((item) => item.id === meetingNoteId && item.visibleToMember) || null;
      if (mounted) { setProblem(loadedProblem); setNote(loadedNote); }
    })().finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [id, meetingNoteId, user]);

  if (loading) return <LoadingState label="Loading shared MOM" />;
  if (!problem || !note) return <main className="px-4 py-8 md:px-8"><EmptyState title="MOM unavailable" message="This MOM is either not shared with your account or does not belong to your problem." /></main>;
  return <MomWebView problem={problem} note={note} owner={profile as UserProfile | null} backHref={`/dashboard/problems/${id}`} audience="member" />;
}

export default function MemberMomPage() {
  return <AuthGate requireComplete><MemberMomContent /></AuthGate>;
}
