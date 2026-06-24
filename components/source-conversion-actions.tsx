"use client";
import { useState } from "react";
import { useAuth, useIsAdmin } from "@/components/auth-provider";
import { convertProblemToCompetition, convertResearchToCompetition } from "@/lib/repositories/firestore";
import type { ProblemStatement, ResearchPost } from "@/lib/types";

export function ConvertProblemAction({ problem }: { problem: ProblemStatement }) {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [message, setMessage] = useState("");
  if (!isAdmin) return null;
  return <div className="mt-4"><button className="rounded-full bg-purple-500/20 px-4 py-2 text-purple-100" onClick={async () => { if (!user) return; await convertProblemToCompetition(problem, user.uid); setMessage("Linked competition draft created."); }}>Convert To Competition</button>{message && <p className="mt-2 text-sm text-white/60">{message}</p>}</div>;
}

export function ConvertResearchAction({ research }: { research: ResearchPost }) {
  const { user } = useAuth();
  const isAdmin = useIsAdmin();
  const [message, setMessage] = useState("");
  if (!isAdmin) return null;
  return <div className="mt-4"><button className="rounded-full bg-purple-500/20 px-4 py-2 text-purple-100" onClick={async () => { if (!user) return; await convertResearchToCompetition(research, user.uid); setMessage("Research competition draft created."); }}>Create Competition From Research</button>{message && <p className="mt-2 text-sm text-white/60">{message}</p>}</div>;
}
