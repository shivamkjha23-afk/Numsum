import type { Role } from "@/lib/types";

export type Capability =
  | "browse:public" | "challenge:create" | "challenge:review" | "challenge:publish" | "discussion:create" | "research:submit" | "knowledge:publish"
  | "competition:join" | "competition:manage" | "admin:apply" | "admin:review" | "organization:manage" | "internal:discuss" | "users:manage" | "system:manage";

export const defaultRole: Role = "visitor";
export const roles = ["visitor", "member", "admin", "super_admin"] as const satisfies readonly Role[];

export const roleCapabilities: Record<Role, Capability[] | ["*"]> = {
  visitor: ["browse:public"],
  member: ["browse:public", "challenge:create", "discussion:create", "research:submit", "competition:join", "admin:apply"],
  admin: ["browse:public", "challenge:create", "challenge:review", "challenge:publish", "discussion:create", "research:submit", "knowledge:publish", "competition:join", "competition:manage", "admin:review", "organization:manage", "internal:discuss"],
  super_admin: ["*"],
};

export function isRole(value: string | undefined): value is Role { return roles.includes(value as Role); }
export function can(role: Role = defaultRole, capability: Capability) { const caps = roleCapabilities[role] || roleCapabilities.visitor; return (caps as readonly string[]).includes("*") || (caps as readonly string[]).includes(capability); }
export function requireCapability(role: Role, capability: Capability) { if (!can(role, capability)) throw new Error(`Missing capability: ${capability}`); }
