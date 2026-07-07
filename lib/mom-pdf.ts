import type { ProblemMeetingNote, ProblemStatement, UserProfile } from "@/lib/types";

function safe(value: unknown) {
  return String(value || "—").replace(/[&<>"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char] || char));
}
function date(value: unknown) {
  if (!value) return "—";
  if (value instanceof Date) return value.toLocaleDateString();
  if (typeof value === "object" && "toDate" in value && typeof value.toDate === "function") return value.toDate().toLocaleDateString();
  return new Date(String(value)).toLocaleDateString();
}
function list(items?: string[]) { return items?.length ? `<ul>${items.map((item) => `<li>${safe(item)}</li>`).join("")}</ul>` : "<p>—</p>"; }

export function buildMomPdfFileName(problem: ProblemStatement, note: ProblemMeetingNote) {
  const base = `${problem.title || "problem"}-${note.meetingTitle || note.title || "meeting"}`.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
  return `${base || "numsum-mom"}.pdf`;
}

export function buildMomPdfHtml(problem: ProblemStatement, note: ProblemMeetingNote, owner?: UserProfile | null) {
  return `<!doctype html><html><head><meta charset="utf-8"><title>${safe(note.meetingTitle || note.title || "MOM")}</title><style>body{font-family:Inter,Arial,sans-serif;margin:40px;color:#101828}h1{color:#0b1b3a}section{margin-top:22px}dt{font-weight:700;color:#475467}dd{margin:4px 0 12px}.brand{border-bottom:3px solid #2563eb;padding-bottom:16px}.grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}.box{border:1px solid #d0d5dd;border-radius:12px;padding:14px}li{margin:6px 0}@media print{button{display:none}}</style></head><body><div class="brand"><h1>NumSum Labs — Minutes of Meeting</h1><p>MSME problem workflow document</p></div><section class="grid"><div class="box"><dl><dt>MSME / Client</dt><dd>${safe(owner?.organizationName || problem.organizationName || owner?.fullName || problem.memberName)}</dd><dt>Membership ID</dt><dd>${safe(owner?.membershipId || problem.membershipId)}</dd><dt>Sector</dt><dd>${safe(problem.sector || problem.industrySegment || problem.category)}</dd></dl></div><div class="box"><dl><dt>Problem title</dt><dd>${safe(problem.title)}</dd><dt>Meeting title</dt><dd>${safe(note.meetingTitle || note.title)}</dd><dt>Meeting date</dt><dd>${safe(date(note.meetingDate))}</dd><dt>Visibility</dt><dd>${note.visibleToMember ? "Visible to member" : "Admin only"}</dd></dl></div></section><section><h2>Attendees</h2>${list(note.attendees)}</section><section><h2>Questions / Answers</h2>${note.questionsAnswers?.length ? note.questionsAnswers.map((qa) => `<div class="box"><b>${safe(qa.question)}</b><p>${safe(qa.answer)}</p></div>`).join("") : "<p>—</p>"}</section><section><h2>Notes</h2><p>${safe(note.notes)}</p></section><section><h2>Decisions</h2>${list(note.decisions)}</section><section><h2>Action Items</h2>${list(note.actionItems)}</section><section><h2>Next Steps</h2><p>${safe(note.nextSteps)}</p></section><section><h2>Admin</h2><p>${safe(note.adminName)}</p></section></body></html>`;
}
