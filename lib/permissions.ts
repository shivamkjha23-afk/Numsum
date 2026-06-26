import type { Role, UserProfile } from "@/lib/types";

export type Capability =
  | "browse:public" | "problem:create" | "problem:review" | "problem:publish" | "challenge:create" | "challenge:review" | "challenge:publish" | "discussion:create" | "research:submit" | "knowledge:publish"
  | "competition:join" | "competition:manage" | "admin:apply" | "admin:review" | "organization:manage" | "internal:discuss" | "users:manage" | "system:manage";

export const defaultRole: Role = "member";
export const elevatedRoles: Role[] = ["submitter", "contributor", "researcher", "msme_representative", "internal_member", "admin", "super_admin"];
export const roles = ["visitor", "member", "submitter", "contributor", "researcher", "msme_representative", "internal_member", "reviewer", "moderator", "organization", "pending_admin", "admin", "super_admin"] as const satisfies readonly Role[];

export const roleCapabilities: Record<Role, Capability[] | ["*"]> = {
  visitor: ["browse:public"],
  member: ["browse:public", "problem:create", "challenge:create", "discussion:create", "research:submit", "competition:join", "admin:apply"],
  submitter: ["browse:public", "problem:create", "challenge:create", "discussion:create", "competition:join"],
  contributor: ["browse:public", "discussion:create", "research:submit", "competition:join"],
  researcher: ["browse:public", "discussion:create", "research:submit", "competition:join"],
  msme_representative: ["browse:public", "problem:create", "discussion:create", "competition:join"],
  internal_member: ["browse:public", "discussion:create", "competition:join", "internal:discuss"],
  reviewer: ["browse:public", "problem:create", "challenge:create", "discussion:create", "research:submit", "competition:join", "problem:review"],
  moderator: ["browse:public", "problem:create", "challenge:create", "discussion:create", "research:submit", "competition:join", "problem:review", "internal:discuss"],
  organization: ["browse:public", "problem:create", "challenge:create", "discussion:create", "research:submit", "competition:join", "organization:manage"],
  pending_admin: ["browse:public", "problem:create", "challenge:create", "discussion:create", "research:submit", "competition:join", "admin:apply"],
  admin: ["browse:public", "problem:create", "problem:review", "problem:publish", "challenge:create", "challenge:review", "challenge:publish", "discussion:create", "research:submit", "knowledge:publish", "competition:join", "competition:manage", "admin:review", "organization:manage", "internal:discuss", "users:manage", "system:manage"],
  super_admin: ["*"],
};

function profileRole(value?: Pick<UserProfile, "role"> | Role | null): Role { return typeof value === "string" ? value : value?.role || defaultRole; }
export function isSignedIn(user?: unknown | null) { return Boolean(user); }
export function isProfileComplete(profile?: Pick<UserProfile, "profileComplete"> | null) { return profile?.profileComplete === true; }
export function hasRole(profile: Pick<UserProfile, "role"> | null | undefined, allowedRoles: Role | Role[]) { const allowed = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]; return Boolean(profile?.role && allowed.includes(profile.role)); }
export function isAdmin(profile?: Pick<UserProfile, "role"> | null) { return hasRole(profile, ["admin", "super_admin"]); }
export function isSuperAdmin(profile?: Pick<UserProfile, "role"> | null) { return hasRole(profile, "super_admin"); }
export function canParticipateInCommunity(profile?: Pick<UserProfile, "role" | "profileComplete"> | null) { return isAdmin(profile) || (hasRole(profile, ["member", "submitter", "contributor", "researcher", "msme_representative", "internal_member"]) && isProfileComplete(profile)); }
export function canSubmitProblem(profile?: Pick<UserProfile, "role" | "profileComplete"> | null) { return isAdmin(profile) || (hasRole(profile, ["member", "submitter", "msme_representative"]) && isProfileComplete(profile)); }
export function canJoinCompetition(profile?: Pick<UserProfile, "role" | "profileComplete"> | null) { return isAdmin(profile) || (hasRole(profile, ["member", "submitter", "contributor", "researcher", "msme_representative"]) && isProfileComplete(profile)); }
export function canManageCompetitions(profile?: Pick<UserProfile, "role"> | null) { return isAdmin(profile); }
export function canApproveRoleRequests(profile?: Pick<UserProfile, "role"> | null) { return isAdmin(profile); }
export function isRole(value: unknown): value is Role { return typeof value === "string" && roles.includes(value as Role); }
export function can(roleOrProfile: Pick<UserProfile, "role"> | Role | null | undefined = defaultRole, capability: Capability) { const role = profileRole(roleOrProfile); const caps = roleCapabilities[role] || roleCapabilities.visitor; return (caps as readonly string[]).includes("*") || (caps as readonly string[]).includes(capability); }
export function requireCapability(roleOrProfile: Pick<UserProfile, "role"> | Role, capability: Capability) { if (!can(roleOrProfile, capability)) throw new Error(`Missing capability: ${capability}`); return true; }
