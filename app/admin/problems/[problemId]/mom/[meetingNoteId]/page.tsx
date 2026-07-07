"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { EmptyState, LoadingState } from "@/components/data-states";
import { MomWebView } from "@/components/mom-web-view";
import { COLLECTIONS, getProblemMeetingNotesAdmin, getProblemStatementById, getRecord } from "@/lib/repositories/firestore";
import type { ProblemMeetingNote, ProblemStatement, UserProfile } from "@/lib/types";

function AdminMomContent() {
  const { problemId, meetingNoteId } = useParams<{ problemId: string; meetingNoteId: string }>();
  const [problem, setProblem] = useState<ProblemStatement | null>(null);
  const [note, setNote] = useState<ProblemMeetingNote | null>(null);
  const [owner, setOwner] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const loadedProblem = await getProblemStatementById(problemId);
      if (!loadedProblem) return;
      const notes = await getProblemMeetingNotesAdmin(problemId);
      const loadedNote = notes.find((item) => item.id === meetingNoteId) || null;
      const ownerId = loadedProblem.memberId || loadedProblem.submittedByUserId || loadedProblem.createdBy || loadedProblem.submitterId || "";
      const loadedOwner = ownerId ? await getRecord<UserProfile>(COLLECTIONS.users, ownerId).catch(() => null) : null;
      if (mounted) { setProblem(loadedProblem); setNote(loadedNote); setOwner(loadedOwner); }
    })().finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [problemId, meetingNoteId]);

  if (loading) return <LoadingState label="Loading MOM" />;
  if (!problem || !note) return <main className="px-4 py-8 md:px-8"><EmptyState title="MOM not found" message="This meeting note could not be found for the selected problem." /></main>;
  return <MomWebView problem={problem} note={note} owner={owner} backHref={`/admin/problems/${problemId}`} audience="admin" />;
}

export default function AdminMomPage() {
  return <AuthGate adminOnly requireComplete={false}><AdminMomContent /></AuthGate>;
}
