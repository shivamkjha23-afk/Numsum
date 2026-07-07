import type { Competition } from "@/lib/types";

export const publicChallengeStatuses = ["published", "open", "registration_closed", "submission_closed", "evaluation", "results_declared"] as const;
export const challengeStatusOptions = ["draft", ...publicChallengeStatuses, "archived"] as const;
export type PublicChallengeStatus = typeof publicChallengeStatuses[number];

export const challengeTypes = ["Problem solving", "Prototype", "Research", "Design sprint", "Pilot", "Ideation"];
export const challengeModes = ["online", "offline", "hybrid"];
export const challengeDifficulties = ["beginner", "intermediate", "advanced", "expert"];

export const demoChallenges: Competition[] = [
  { id: "demo-packaging-seal", title: "Reduce Packaging Seal Failures for Food MSMEs", slug: "reduce-packaging-seal-failures", shortDescription: "Design a practical inspection and process-control approach to reduce pouch seal rejection and dispatch returns.", detailedDescription: "A food processing MSME is facing recurring pouch seal failures during dispatch. Participants should propose a low-cost, measurable solution that can be piloted on the shop floor.", description: "Reduce pouch seal failures with process, inspection, and packaging improvements.", industrySegment: "Food processing", theme: "Packaging quality", problemCategory: "Quality", competitionType: "problem_challenge", eligibility: "Students, researchers, engineers, and technology providers", rules: "Teams of 1-4. Use public-safe assumptions and avoid confidential client data.", expectedOutputs: "Root-cause hypothesis, solution approach, pilot plan, evidence/data needed, and expected impact.", evaluationCriteria: "Practicality, MSME affordability, measurable impact, implementation clarity, and evidence quality.", prizesOrRecognition: "Certificate, public recognition, and pilot consideration", status: "open", visibility: "public", maxTeamSize: 4, minTeamSize: 1, participationMode: "both", mode: "online", tags: ["food processing", "packaging", "quality"] } as unknown as Competition,
  { id: "demo-textile-defects", title: "Textile Defect Pattern Reduction Challenge", slug: "textile-defect-pattern-reduction", shortDescription: "Analyze recurring textile defects and propose a production-ready method for reducing rejection.", detailedDescription: "A textile unit needs help structuring defect patterns across dyeing, inspection, inventory, and delivery processes.", description: "Reduce textile rejection through practical process and data improvements.", industrySegment: "Textile", theme: "Quality improvement", competitionType: "problem_challenge", eligibility: "Students, researchers, engineers, consultants", expectedOutputs: "Defect taxonomy, data collection plan, root-cause approach, implementation plan.", evaluationCriteria: "Field practicality, clarity, cost, measurable waste reduction, and scalability.", prizesOrRecognition: "Mentor review and case-study consideration", status: "published", visibility: "public", maxTeamSize: 3, minTeamSize: 1, participationMode: "both", mode: "hybrid", tags: ["textile", "quality", "waste"] } as unknown as Competition,
  { id: "demo-logistics-delay", title: "MSME Dispatch Delay Optimization", slug: "msme-dispatch-delay-optimization", shortDescription: "Build a simple planning solution for reducing dispatch delays in small manufacturing units.", detailedDescription: "Participants should propose a workflow, planning board, or lightweight digital solution to reduce delivery delays.", description: "Reduce dispatch delays for MSMEs with simple planning interventions.", industrySegment: "Logistics", theme: "Operations", competitionType: "other", eligibility: "Members with operations, software, or industrial engineering interest", expectedOutputs: "Workflow map, prototype/mockup, implementation plan, expected impact.", evaluationCriteria: "Ease of adoption, measurable time savings, usability, and implementation plan.", prizesOrRecognition: "Featured solution and pilot discussion", status: "open", visibility: "public", maxTeamSize: 5, minTeamSize: 1, participationMode: "both", mode: "online", tags: ["logistics", "planning", "operations"] } as unknown as Competition,
];

export function challengeSlug(challenge: Competition) { return challenge.slug || challenge.id; }
export function challengeStatusLabel(status?: string) { return (status || "published").replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase()); }
export function fmtDate(value: unknown) { if (!value) return "Not announced"; if (typeof value === "object" && value && "toDate" in value) return (value as { toDate: () => Date }).toDate().toLocaleDateString(); const d = new Date(value as string); return Number.isNaN(d.getTime()) ? "Not announced" : d.toLocaleDateString(); }
export function toDate(value: unknown) { if (!value) return null; if (typeof value === "object" && value && "toDate" in value) return (value as { toDate: () => Date }).toDate(); const d = new Date(value as string); return Number.isNaN(d.getTime()) ? null : d; }
export function deadlinePassed(value: unknown) { const d = toDate(value); return d ? d.getTime() < Date.now() : false; }
export function challengeClosed(challenge: Competition) { return ["archived", "closed", "results_declared"].includes(challenge.status || ""); }
export function actionBlockReason(challenge: Competition, action: "register" | "team" | "submit") {
  if (challengeClosed(challenge)) return "This challenge is closed or results have been declared.";
  if (action === "register" && deadlinePassed(challenge.registrationDeadline)) return "Registration deadline has passed.";
  if (action === "team" && deadlinePassed(challenge.startDate)) return "Team formation deadline has passed.";
  if (action === "submit" && deadlinePassed(challenge.submissionDeadline || challenge.deadline || challenge.endDate)) return "Submission deadline has passed.";
  if (action === "register" && ["registration_closed", "submission_closed", "evaluation"].includes(challenge.status || "")) return "Registration is closed for this challenge.";
  if (action === "submit" && ["submission_closed", "evaluation"].includes(challenge.status || "")) return "Solution submissions are closed for this challenge.";
  return "";
}
export function maxTeamSize(challenge: Competition) { return Math.max(1, Number(challenge.maxTeamSize || 1)); }
