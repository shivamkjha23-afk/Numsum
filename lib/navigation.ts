type NavLink = readonly [string, string];
type NavGroup = { label: string; links: readonly NavLink[]; adminOnly?: boolean };
export const homeLink: NavLink = ["Home", "/"];
export const navGroups: readonly NavGroup[] = [
  { label: "Explore", links: [["MSME Challenges / Problem Statements", "/problem-statements"], ["Research Repository", "/research"], ["Knowledge Hub", "/knowledge"], ["Competitions", "/competitions"], ["MSME Intelligence", "/msme-intelligence"]] },
  { label: "Community", links: [["Discussions", "/community"], ["Organizations", "/organizations"], ["Team Directory", "/team"]] },
  { label: "Workspace", links: [["My Dashboard", "/dashboard"], ["My Problems", "/problem-statements/my"], ["Submit MSME Challenge", "/submit-problem"], ["My Teams", "/teams"], ["My Research", "/research/upload"], ["Notifications", "/notifications"]] },
  { label: "Admin", adminOnly: true, links: [["Dashboard", "/admin"], ["Problem Review", "/admin/problems"], ["Inbox", "/admin?tab=admin_inbox"], ["Forms", "/admin?tab=questionnaire_templates"], ["Users", "/admin?tab=users"], ["Competitions", "/admin?tab=competitions"], ["Research", "/admin?tab=research_posts"], ["Knowledge", "/admin?tab=knowledge_assets"], ["System Health", "/admin/system-health"]] },
];
export function getVisibleNavLinks(isAdmin: boolean): NavLink[] { return [homeLink, ...navGroups.filter((group) => !group.adminOnly || isAdmin).flatMap((group) => group.links)]; }
export const navLinks: NavLink[] = getVisibleNavLinks(true);
