"use client";

import Link from "next/link";
import type { ProblemMeetingNote, ProblemStatement, UserProfile } from "@/lib/types";

function dateLabel(value: unknown) {
  if (!value) return "—";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toLocaleDateString();
  const date = new Date(String(value));
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}
function TextBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="break-inside-avoid rounded-3xl border border-slate-200 bg-white p-5 text-slate-900 print:border-slate-300 print:shadow-none"><h2 className="text-sm font-bold uppercase tracking-[.18em] text-slate-500">{title}</h2><div className="mt-3 text-sm leading-7 text-slate-700">{children}</div></section>;
}
function list(items?: string[]) { return items?.length ? <ul className="list-disc space-y-1 pl-5">{items.map((item) => <li key={item}>{item}</li>)}</ul> : <p>—</p>; }

export function MomWebView({ problem, note, owner, backHref, audience }: { problem: ProblemStatement; note: ProblemMeetingNote; owner?: UserProfile | null; backHref: string; audience: "admin" | "member" }) {
  const clientName = owner?.fullName || problem.memberName || problem.submittedByName || owner?.email || problem.memberEmail || "MSME member";
  const organization = owner?.organizationName || owner?.startupOrCompanyName || problem.organizationName || "—";
  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-950 print:bg-white print:px-0 print:py-0">
      <style jsx global>{`@media print { .no-print { display: none !important; } @page { size: A4; margin: 16mm; } body { background: white !important; } section { break-inside: avoid; } }`}</style>
      <div className="mx-auto max-w-4xl">
        <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
          <Link href={backHref} className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">← Back</Link>
          <button onClick={() => window.print()} className="rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white">Print / Save as PDF</button>
        </div>
        <article className="rounded-[2rem] bg-white p-6 shadow-xl print:rounded-none print:p-0 print:shadow-none">
          <header className="border-b-4 border-blue-600 pb-6">
            <p className="text-xs font-bold uppercase tracking-[.28em] text-blue-700">NumSum Labs</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950">Minutes of Meeting</h1>
            <p className="mt-2 text-sm text-slate-600">Generated/viewed on {new Date().toLocaleDateString()} · {audience === "admin" ? "Admin view" : "Member shared view"}</p>
          </header>

          <section className="mt-6 grid gap-4 md:grid-cols-2 print:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">Client</p>
              <dl className="mt-3 space-y-3 text-sm"><div><dt className="font-semibold text-slate-500">MSME / member</dt><dd>{clientName}</dd></div><div><dt className="font-semibold text-slate-500">Membership ID</dt><dd>{owner?.membershipId || problem.membershipId || note.membershipId || "—"}</dd></div><div><dt className="font-semibold text-slate-500">Organization</dt><dd>{organization}</dd></div></dl>
            </div>
            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">Problem</p>
              <dl className="mt-3 space-y-3 text-sm"><div><dt className="font-semibold text-slate-500">Title</dt><dd>{problem.title}</dd></div><div><dt className="font-semibold text-slate-500">Sector</dt><dd>{problem.sector || problem.industrySegment || problem.category || "—"}</dd></div><div><dt className="font-semibold text-slate-500">Visibility</dt><dd>{note.visibleToMember ? "Visible to member" : "Admin only"}</dd></div></dl>
            </div>
          </section>

          <section className="mt-6 rounded-3xl border border-slate-200 p-5">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">Meeting</p>
            <dl className="mt-3 grid gap-4 text-sm md:grid-cols-3 print:grid-cols-3"><div><dt className="font-semibold text-slate-500">Meeting title</dt><dd>{note.meetingTitle || note.title || "MOM"}</dd></div><div><dt className="font-semibold text-slate-500">Meeting date</dt><dd>{dateLabel(note.meetingDate)}</dd></div><div><dt className="font-semibold text-slate-500">Admin</dt><dd>{note.adminName || "NumSum admin"}</dd></div></dl>
          </section>

          <div className="mt-6 grid gap-4">
            <TextBlock title="Attendees">{list(note.attendees)}</TextBlock>
            <TextBlock title="Questions / Answers">{note.questionsAnswers?.length ? <div className="space-y-3">{note.questionsAnswers.map((qa, index) => <div key={`${qa.question}-${index}`} className="rounded-2xl border border-slate-200 p-3"><p className="font-semibold text-slate-900">{qa.question || `Question ${index + 1}`}</p><p className="mt-1">{qa.answer || "—"}</p></div>)}</div> : <p>—</p>}</TextBlock>
            <TextBlock title="Notes"><p>{note.notes || "—"}</p></TextBlock>
            <TextBlock title="Decisions">{list(note.decisions)}</TextBlock>
            <TextBlock title="Action Items">{list(note.actionItems)}</TextBlock>
            <TextBlock title="Next Steps"><p>{note.nextSteps || "—"}</p></TextBlock>
          </div>
        </article>
      </div>
    </main>
  );
}
