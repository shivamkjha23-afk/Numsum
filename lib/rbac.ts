import type { Role } from "./types";
const permissions = { visitor:["read:public"], community_member:["read:public","create:post","join:team","submit:solution"], organization_user:["read:public","create:challenge","manage:organization"], reviewer:["read:public","score:submission"], moderator:["read:public","moderate:community"], administrator:["*"] } satisfies Record<Role,string[]>;
export function can(role: Role, permission: string) { return permissions[role].includes("*") || permissions[role].includes(permission); }
