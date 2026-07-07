import type { ProblemStatementStatus } from "@/lib/types";

export const problemSectors = ["Manufacturing", "Textile", "Food processing", "Auto components", "Electronics", "Chemical", "Packaging", "Logistics", "Services", "Other"] as const;
export type ProblemSector = typeof problemSectors[number];

export const problemStatuses: Array<{ value: ProblemStatementStatus; label: string; description: string }> = [
  { value: "draft", label: "Draft", description: "Problem is saved but not submitted." },
  { value: "submitted", label: "Submitted", description: "Problem has been submitted to NumSum Labs." },
  { value: "under_review", label: "Under Review", description: "Team is reviewing scope and completeness." },
  { value: "onboarding_pending", label: "Onboarding Pending", description: "Admin onboarding will be scheduled." },
  { value: "onboarding_active", label: "Onboarding Active", description: "Questionnaires or meetings are in progress." },
  { value: "solution_path_created", label: "Solution Path Created", description: "Challenge, pilot, or solution path has been created." },
  { value: "solved", label: "Solved", description: "Solution outcome has been validated." },
  { value: "closed", label: "Closed", description: "Problem has been closed." },
];

export const sectorQuestionnaires: Record<ProblemSector, string[]> = {
  Manufacturing: ["Which machine/process is affected?", "How often does the issue occur?", "Is this causing downtime?", "Is there a quality rejection issue?", "What data or measurements are available?", "Which shift/team sees this most?", "What maintenance or process checks are currently done?"],
  Textile: ["Is the issue related to production, dyeing, quality, inventory, or delivery?", "What defect/rejection pattern is observed?", "Which fabric/yarn/process is affected?", "Is export readiness or buyer compliance impacted?", "How much rework or inventory ageing occurs?", "What inspection records or photos are available?"],
  "Food processing": ["Is the problem related to shelf life, hygiene, packaging, wastage, or compliance?", "What is the current wastage percentage?", "Are there temperature/storage constraints?", "Which product or batch type is affected?", "Are there packaging seal/leakage issues?", "Which regulatory or audit requirement is affected?"],
  "Auto components": ["Which component, line, or operation is affected?", "What tolerance, rejection, or rework pattern is observed?", "Is downtime or tool wear involved?", "Which customer/order requirement is impacted?", "What inspection or SPC data is available?", "Are supplier inputs contributing to the issue?"],
  Electronics: ["Which assembly, test, or failure mode is affected?", "Is the issue design, component, soldering, testing, or reliability related?", "What failure rate is observed?", "Which instruments/logs are available?", "Are ESD, thermal, or calibration constraints involved?", "Which certification/customer requirement is impacted?"],
  Chemical: ["Which reaction, formulation, mixing, or handling step is affected?", "Is the issue yield, purity, safety, compliance, or storage related?", "What batch data or lab measurements are available?", "Are temperature, pressure, or humidity constraints involved?", "What safety or regulatory risks exist?", "What disposal or waste issues occur?"],
  Packaging: ["Which packaging material or machine is affected?", "Is the issue sealing, printing, strength, leakage, or wastage related?", "What rejection percentage is observed?", "Which customer/shipping condition is impacted?", "What material specs or supplier data is available?", "Are storage or handling practices contributing?"],
  Logistics: ["Which logistics step is affected?", "Is the issue delay, damage, routing, inventory, or cost related?", "How often does it occur?", "Which customers/orders are impacted?", "What tracking or ERP data is available?", "Are vendor or transport constraints involved?"],
  Services: ["Which service process is affected?", "Is the issue turnaround time, quality, staffing, customer experience, or cost related?", "How is performance currently measured?", "Which customers or segments are impacted?", "What digital records are available?", "What workaround is used today?"],
  Other: ["What process or function is affected?", "How frequently does the issue occur?", "What measurable impact is visible?", "What data, photos, or documents are available?", "Who is affected by the problem?", "What result would count as success?"],
};

export function statusLabel(status?: string) {
  return problemStatuses.find((item) => item.value === status)?.label || status || "Draft";
}
