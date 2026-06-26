"use client";
import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { ErrorState, LoadingState } from "@/components/data-states";
import { Card } from "@/components/ui";
import { getAdminKnowledgeAssets, getAdminSOPDocuments } from "@/lib/repositories/firestore";
import type { KnowledgeAsset, SOPDocument } from "@/lib/types";

const input = "rounded-xl border border-white/10 bg-black/30 p-3";

function AdminKnowledgeContent() {
  const [rows, setRows] = useState<KnowledgeAsset[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getAdminKnowledgeAssets().then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Unable to load knowledge assets.")); }, []);
  const shown = useMemo(() => (rows || []).filter((a) => !q || a.title.toLowerCase().includes(q.toLowerCase()) || a.tags?.some((t) => t.toLowerCase().includes(q.toLowerCase()))), [rows, q]);
  if (error) return <ErrorState message={error} retryHref="/admin/knowledge" />;
  if (!rows) return <LoadingState label="Loading knowledge assets" />;
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin Knowledge Assets</h1><p className="mt-3 text-white/60">Review, publish, and trace every asset back to its problem workspace.</p><div className="mt-6 grid gap-3 md:grid-cols-6"><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title/tags" className={`${input} md:col-span-2`}/></div><Card className="mt-6 overflow-x-auto"><table className="min-w-full text-sm"><thead className="text-left text-white/45"><tr><th className="p-3">Title</th><th>Status</th><th>Visibility</th><th>Category</th><th>Problem</th></tr></thead><tbody>{shown.map((a)=><tr key={a.id} className="border-t border-white/10"><td className="p-3">{a.title}<p className="text-xs text-white/45">{a.tags?.join(", ")}</p></td><td>{a.status}</td><td>{a.visibility}</td><td>{a.category}</td><td>{a.problemStatementId ? <a className="text-blue-200" href={`/problem-statements/${a.problemStatementId}`}>Workspace</a> : "—"}</td></tr>)}</tbody></table>{!shown.length && <p className="p-3 text-white/60">No knowledge assets match the current filter.</p>}</Card></main>;
}

function AdminSOPContent() {
  const [rows, setRows] = useState<SOPDocument[] | null>(null);
  const [q, setQ] = useState("");
  const [error, setError] = useState("");
  useEffect(() => { getAdminSOPDocuments().then(setRows).catch((err) => setError(err instanceof Error ? err.message : "Unable to load SOP documents.")); }, []);
  const shown = useMemo(() => (rows || []).filter((s) => !q || s.title.toLowerCase().includes(q.toLowerCase()) || s.tags?.some((t) => t.toLowerCase().includes(q.toLowerCase()))), [rows, q]);
  if (error) return <ErrorState message={error} retryHref="/admin/sops" />;
  if (!rows) return <LoadingState label="Loading SOP documents" />;
  return <main className="min-h-screen bg-navy px-6 py-10"><h1 className="font-display text-5xl">Admin SOP Library</h1><p className="mt-3 text-white/60">Official procedures linked to problem statements.</p><div className="mt-6 grid gap-3 md:grid-cols-6"><input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search title/tags" className={`${input} md:col-span-2`}/></div><Card className="mt-6 overflow-x-auto"><table className="min-w-full text-sm"><thead className="text-left text-white/45"><tr><th className="p-3">Title</th><th>Status</th><th>Visibility</th><th>Process</th><th>Version</th><th>Problem</th></tr></thead><tbody>{shown.map((s)=><tr key={s.id} className="border-t border-white/10"><td className="p-3">{s.title}<p className="text-xs text-white/45">{s.tags?.join(", ")}</p></td><td>{s.status}</td><td>{s.visibility}</td><td>{s.processArea}</td><td>{s.version}</td><td>{s.problemStatementId ? <a className="text-blue-200" href={`/problem-statements/${s.problemStatementId}`}>Workspace</a> : "—"}</td></tr>)}</tbody></table>{!shown.length && <p className="p-3 text-white/60">No SOP documents match the current filter.</p>}</Card></main>;
}

export function AdminKnowledgeClient(){ return <AuthGate adminOnly label="Admin access requires authentication."><AdminKnowledgeContent /></AuthGate>; }
export function AdminSOPClient(){ return <AuthGate adminOnly label="Admin access requires authentication."><AdminSOPContent /></AuthGate>; }
