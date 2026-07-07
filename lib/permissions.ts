import type { Role, UserProfile } from "@/lib/types";

export type Capability =
  | "browse:public" | "problem:create" | "problem:review" | "problem:publish" | "challenge:create" | "challenge:review" | "challenge:publish" | "discussion:create" | "research:submit" | "knowledge:publish"
  | "competition:join" | "competition:manage" | "community:participate" | "case_study:interact" | "users:manage" | "system:manage";

export const defaultRole: Role = "member";
export const roles = ["member", "admin", "super_admin"] as const satisfies readonly Role[];
export const elevatedRoles: Role[] = ["admin", "super_admin"];

export const roleCapabilities: Record<Role, Capability[] | ["*"]> = {
  member: ["browse:public", "problem:create", "challenge:create", "discussion:create", "community:participate", "case_study:interact", "research:submit", "competition:join"],
  admin: ["browse:public", "problem:create", "problem:review", "problem:publish", "challenge:create", "challenge:review", "challenge:publish", "discussion:create", "community:participate", "case_study:interact", "research:submit", "knowledge:publish", "competition:join", "competition:manage", "system:manage"],
  super_admin: ["*"],
};

function profileRole(value?: Pick<UserProfile, "role"> | Role | null): Role {
  if (typeof value === "string") return roles.includes(value as Role) ? value as Role : defaultRole;
  return value?.role && roles.includes(value.role) ? value.role : defaultRole;
}
export function isSignedIn(user?: unknown | null) { return Boolean(user); }
export function isProfileComplete(profile?: Pick<UserProfile, "profileComplete"> | null) { return profile?.profileComplete === true; }
export function hasRole(profile: Pick<UserProfile, "role"> | null | undefined, allowedRoles: Role | Role[]) { const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]; return Boolean(profile?.role && allowed.includes(profile.role)); }
export function isAdmin(profile?: Pick<UserProfile, "role"> | null) { return hasRole(profile, ["admin", "super_admin"]); }
export function isSuperAdmin(profile?: Pick<UserProfile, "role"> | null) { return hasRole(profile, "super_admin"); }
export function canParticipateInCommunity(profile?: Pick<UserProfile, "role" | "profileComplete"> | null) { return isAdmin(profile) || (hasRole(profile, "member") && isProfileComplete(profile)); }
export function canSubmitProblem(profile?: Pick<UserProfile, "role" | "profileComplete"> | null) { return isAdmin(profile) || (hasRole(profile, "member") && isProfileComplete(profile)); }
export function canJoinCompetition(profile?: Pick<UserProfile, "role" | "profileComplete"> | null) { return isAdmin(profile) || (hasRole(profile, "member") && isProfileComplete(profile)); }
export function canManageCompetitions(profile?: Pick<UserProfile, "role"> | null) { return isAdmin(profile); }
export function canApproveRoleRequests(profile?: Pick<UserProfile, "role"> | null) { return isSuperAdmin(profile); }
export function isRole(value: unknown): value is Role { return typeof value === "string" && roles.includes(value as Role); }
export function can(roleOrProfile: Pick<UserProfile, "role"> | Role | null | undefined = defaultRole, capability: Capability) { const role = profileRole(roleOrProfile); const caps = roleCapabilities[role] || roleCapabilities.member; return (caps as readonly string[]).includes("*") || (caps as readonly string[]).includes(capability); }
export function requireCapability(roleOrProfile: Pick<UserProfile, "role"> | Role, capability: Capability) { if (!can(roleOrProfile, capability)) throw new Error(`Missing capability: ${capability}`); return true; }
