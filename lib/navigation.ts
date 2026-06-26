type NavLink = readonly [string, string];
type NavGroup = { label: string; links: readonly NavLink[]; adminOnly?: boolean };
export const homeLink: NavLink = ["Home", "/"];
export const navGroups: readonly NavGroup[] = [
  { label: "Public", links: [["Submit MSME Challenge", "/submit-problem"], ["MSME Challenges", "/problem-statements"], ["MSME Intelligence", "/msme-intelligence"], ["Knowledge & Research", "/research"], ["Competitions", "/competitions"], ["Community", "/community"], ["Impact / Pilots", "/pilots"], ["About", "/about"]] },
  { label: "Admin", adminOnly: true, links: [["Admin Dashboard", "/admin"], ["Problem Review", "/admin/problems"], ["Questionnaire Templates", "/admin/questionnaires"], ["Knowledge Assets", "/admin/knowledge"], ["SOP Library", "/admin/sops"], ["Research Repository", "/admin/research"], ["Technology Watch", "/admin/research/watch"], ["Pilot Tracker", "/admin/pilots"], ["Competitions", "/admin/competitions"], ["Governance", "/admin/governance"], ["Governance Documents", "/admin/governance/documents"], ["Amendments", "/admin/governance/amendments"], ["Objective Targets", "/admin/objectives"], ["Execution OS", "/admin/execution"], ["Meetings", "/admin/meetings"], ["Contributions", "/admin/contributions"], ["Community Moderation", "/admin/community"], ["Contribution Reviews", "/admin/contributions/review-cycles"], ["Score Rules", "/admin/contributions/score-rules"], ["System Health", "/admin/system-health"]] },
];
export function getVisibleNavLinks(isAdmin: boolean): NavLink[] { return [homeLink, ...navGroups.filter((group) => !group.adminOnly || isAdmin).flatMap((group) => group.links)]; }
export const navLinks: NavLink[] = getVisibleNavLinks(true);
