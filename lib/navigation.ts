type NavLink = readonly [string, string];
type NavGroup = { label: string; links: readonly NavLink[] };
export const navGroups: readonly NavGroup[] = [
  {
    label: "Explore",
    links: [
      ["Home", "/"],
      ["Problem Statements", "/problem-statements"],
      ["Research", "/research"],
      ["Competitions", "/competitions"],
      ["Knowledge Hub", "/knowledge"],
      ["MSME Intelligence", "/msme-intelligence"],
    ],
  },
  {
    label: "Community",
    links: [
      ["Community Portal", "/community"],
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
    links: [
      ["Admin Dashboard", "/admin"],
      ["System Health", "/admin/system-health"],
    ],
  },
];
export const navLinks: NavLink[] = navGroups.flatMap((group) => group.links);
