type NavLink = readonly [string, string];
type NavGroup = { label: string; links: readonly NavLink[]; adminOnly?: boolean };
export const navGroups: readonly NavGroup[] = [
  {
    label: "Explore",
    links: [
      ["Home", "/"],
      ["Explore", "/problem-statements"],
      ["Research", "/research"],
      ["Competitions", "/competitions"],
      ["Knowledge Hub", "/knowledge"],
      ["MSME Intelligence", "/msme-intelligence"],
    ],
  },
  {
    label: "Community",
    links: [
      ["Community", "/community"],
      ["Organizations", "/organizations"],
      ["Create Discussion", "/community/new"],
      ["Team", "/team"],
      ["Careers", "/careers"],
    ],
  },
  {
    label: "Workspace",
    links: [
      ["Dashboard", "/dashboard"],
      ["Profile", "/profile"],
      ["Settings", "/settings"],
      ["Submit Problem", "/submit-problem"],
      ["Submit Research", "/research/upload"],
    ],
  },
  {
    label: "Admin",
    adminOnly: true,
    links: [
      ["Dashboard", "/admin"],
      ["Inbox", "/admin?tab=admin_inbox"],
      ["Forms", "/admin?tab=questionnaire_templates"],
      ["Team", "/admin?tab=team_members"],
      ["Users", "/admin?tab=users"],
      ["System Health", "/admin/system-health"],
    ],
  },
];
export const navLinks: NavLink[] = navGroups.flatMap((group) => group.links);
