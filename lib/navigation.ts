export const homeLink = ["Home", "/"] as const;
export type NavGroup = { label: string; adminOnly?: boolean; links?: readonly (readonly [string, string])[]; sections?: readonly { label: string; links: readonly (readonly [string, string])[] }[] };
export const navGroups: NavGroup[] = [
  { label: "Public", links: [["Submit MSME Challenge", "/submit-problem"], ["MSME Challenges", "/problem-statements"], ["MSME Intelligence", "/msme-intelligence"], ["Knowledge & Research", "/research"], ["Competitions", "/competitions"], ["Community", "/community"], ["Impact / Pilots", "/pilots"], ["About", "/about"]] },
  { label: "Admin", adminOnly: true, sections: [
    { label: "Platform", links: [["Admin Dashboard", "/admin"], ["System Health", "/admin/system-health"], ["Initialization", "/admin#initialization"]] },
    { label: "MSME Problem Pipeline", links: [["Problem Review", "/admin/problems"], ["Questionnaire Templates", "/admin/questionnaires"], ["Problem Workspace", "/admin/problems"]] },
    { label: "Knowledge & Research", links: [["Knowledge Assets", "/admin/knowledge"], ["SOP Library", "/admin/sops"], ["Research Repository", "/admin/research"], ["Technology Watch", "/admin/research/watch"]] },
    { label: "Pilots & Impact", links: [["Pilot Tracker", "/admin/pilots"]] },
    { label: "Competitions", links: [["Competitions", "/admin/competitions"]] },
    { label: "Governance & Objectives", links: [["Governance", "/admin/governance"], ["Governance Documents", "/admin/governance/documents"], ["Amendments", "/admin/governance/amendments"], ["Objective Targets", "/admin/objectives"]] },
    { label: "Operations", links: [["Execution OS", "/admin/execution"], ["Meetings", "/admin/meetings"], ["Contributions", "/admin/contributions"], ["Contribution Reviews", "/admin/contributions/review-cycles"]] },
    { label: "People & Access", links: [["Users & Roles", "/admin/users"], ["Community Moderation", "/admin/community"]] },
  ] },
];
export function getVisibleNavLinks(isAdmin: boolean) {
  return navGroups.filter((group) => !group.adminOnly || isAdmin).flatMap((group) => group.sections ? group.sections.flatMap((section) => section.links) : (group.links || []));
}
