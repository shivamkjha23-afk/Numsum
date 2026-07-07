import { problemStatuses } from "@/lib/problem-flow";
import type { ProblemStatementStatus } from "@/lib/types";

export function ProblemStatusTimeline({ status = "draft" }: { status?: ProblemStatementStatus | string }) {
  const current = Math.max(0, problemStatuses.findIndex((stage) => stage.value === status));
  return <div className="grid gap-3 md:grid-cols-4 xl:grid-cols-8">{problemStatuses.map((stage, index) => { const done = index < current; const active = index === current; return <div key={stage.value} className={`rounded-2xl border p-3 ${active ? "border-blue-300 bg-blue-400/15" : done ? "border-emerald-300/30 bg-emerald-400/10" : "border-white/10 bg-white/[0.03]"}`}><p className={`text-sm font-semibold ${active ? "text-blue-100" : done ? "text-emerald-100" : "text-white/55"}`}>{stage.label}</p><p className="mt-2 text-xs text-white/45">{stage.description}</p></div>; })}</div>;
}
