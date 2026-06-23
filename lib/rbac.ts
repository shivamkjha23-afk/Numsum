import type { Role } from "./types";

export const defaultRole: Role = "visitor";

export const roles = ["visitor", "member", "organization", "admin"] as const satisfies readonly Role[];

const permissions = {
  visitor: ["read:public"],
  member: ["read:public", "create:team", "join:competition", "create:discussion", "comment", "upload:research"],
  organization: ["read:public", "create:team", "join:competition", "create:discussion", "comment", "upload:research", "submit:challenge", "manage:organization"],
  admin: ["*"],
} satisfies Record<Role, string[]>;

export function isRole(value: string | undefined): value is Role {
  return roles.includes(value as Role);
}

export function can(role: Role = defaultRole, permission: string) {
  return permissions[role].includes("*") || permissions[role].includes(permission);
}
