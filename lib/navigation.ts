export const homeLink = ["Home", "/"] as const;
export type NavGroup = { label: string; adminOnly?: boolean; links?: readonly (readonly [string, string])[]; sections?: readonly { label: string; links: readonly (readonly [string, string])[] }[] };

export const phaseOnePublicLinks = [
  ["For MSMEs", "/for-msmes"],
  ["Challenges", "/challenges"],
  ["Case Studies", "/case-studies"],
  ["Community", "/community"],
  ["About", "/about"],
] as const;

export const secondaryPublicLinks = [
  ["Research & Knowledge", "/research"],
  ["Impact Metrics", "/pilots"],
] as const;

export const navGroups: NavGroup[] = [
  { label: "Explore", links: phaseOnePublicLinks },
  { label: "Resources", links: secondaryPublicLinks },
  { label: "Admin", adminOnly: true, sections: [
    { label: "Phase 2", links: [["Admin Dashboard", "/admin"], ["System Health", "/admin/system-health"], ["Users", "/admin/users"], ["MSME Owners", "/admin/msme-owners"], ["Problems", "/admin/problems"], ["Questionnaires", "/admin/questionnaires"], ["Challenges", "/admin/challenges"], ["Community Moderation", "/admin/community"]] },
  ] },
];
export function getVisibleNavLinks(isAdmin: boolean) {
  return [[homeLink[0], homeLink[1]] as const, ...navGroups.filter((group) => !group.adminOnly || isAdmin).flatMap((group) => group.sections ? group.sections.flatMap((section) => section.links) : (group.links || []))];
}
