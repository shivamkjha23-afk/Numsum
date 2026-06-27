"use client";
import { useEffect, useMemo, useState } from "react";
import { AuthGate } from "@/components/auth-gate";
import { useAuth } from "@/components/auth-provider";
import { Button, Card } from "@/components/ui";
function Badge({ children }: { children: React.ReactNode }) { return <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-blue-100">{children}</span>; }
import { getUserRoleRequests, getUsersForRoleManagement, updateUserRoleAndStatus } from "@/lib/repositories/firestore";
import type { Role, UserProfile } from "@/lib/types";

const roles: Role[] = ["member", "admin", "super_admin"];
function fmt(value: unknown) { return (value as { toDate?: () => Date })?.toDate?.()?.toLocaleString() || (value ? String(value) : "—"); }

export default function AdminUsersPage() {
  const { profile } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [requests, setRequests] = useState<Record<string, any>>({});
  const [message, setMessage] = useState("");
  const isSuperAdmin = profile?.role === "super_admin";
  async function load() {
    const [userRows, requestRows] = await Promise.all([getUsersForRoleManagement(), getUserRoleRequests().catch(() => [])]);
    setUsers(userRows);
    setRequests(Object.fromEntries(requestRows.map((row: any) => [row.userId || row.id, row])));
  }
  useEffect(() => { load().catch((error) => setMessage(error instanceof Error ? error.message : "Unable to load users.")); }, []);
  const activeSuperAdmins = useMemo(() => users.filter((user) => user.role === "super_admin" && user.status !== "inactive").length, [users]);
  async function save(user: UserProfile, patch: { role?: Role; status?: string }) {
    if (!profile) return;
    setMessage("Saving user governance change...");
    try { await updateUserRoleAndStatus(user.uid || user.id, patch, profile); await load(); setMessage("User governance change saved and audited."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to update user."); }
  }
  return <AuthGate adminOnly><main className="min-h-screen bg-navy px-6 py-10"><div className="flex flex-wrap items-center justify-between gap-3"><div><p className="text-sm uppercase tracking-[.3em] text-blue-300">Admin</p><h1 className="font-display text-5xl">Users & Roles</h1><p className="mt-3 text-white/60">Assign roles, review new member signups, and manage active/inactive access without allowing self-promotion.</p></div><Button href="/admin">Admin dashboard</Button></div>{message && <Card className="mt-6 text-white/70">{message}</Card>}<Card className="mt-6 overflow-x-auto"><table className="w-full min-w-[1100px] text-left text-sm text-white/70"><thead><tr className="border-b border-white/10 text-xs uppercase tracking-[.18em] text-blue-200"><th className="py-3">Name</th><th>Email</th><th>Role</th><th>Status</th><th>Complete</th><th>Provider</th><th>Review</th><th>Created</th><th>Updated</th><th>Actions</th></tr></thead><tbody>{users.map((user) => { const request = requests[user.uid || user.id]; const self = (user.uid || user.id) === profile?.uid; const lastSuperAdmin = user.role === "super_admin" && activeSuperAdmins <= 1; return <tr key={user.uid || user.id} className="border-b border-white/10 align-top"><td className="py-3 text-white">{user.fullName || user.name || user.displayName || "Unnamed"}<div className="text-xs text-white/40">{user.uid || user.id}</div></td><td>{user.email || "—"}</td><td><Badge>{user.role || "member"}</Badge></td><td>{user.status || "active"}</td><td>{user.profileComplete ? "Yes" : "No"}</td><td>{user.provider || "unknown"}</td><td>{request?.status || "—"}</td><td>{fmt(user.createdAt)}</td><td>{fmt(user.updatedAt)}</td><td><div className="grid min-w-52 gap-2"><select disabled={self} value={user.role || "member"} onChange={(event) => save(user, { role: event.target.value as Role })} className="rounded-xl border border-white/10 bg-black/30 p-2 text-white">{roles.map((role) => <option key={role} value={role} disabled={(role === "super_admin" && !isSuperAdmin) || (lastSuperAdmin && role !== "super_admin")}>{role}</option>)}</select><button disabled={self} onClick={() => save(user, { status: user.status === "inactive" ? "active" : "inactive" })} className="rounded-full bg-white/10 px-3 py-2 disabled:opacity-40">{user.status === "inactive" ? "Activate" : "Deactivate"}</button><a className="text-blue-200" href={`/profile?user=${encodeURIComponent(user.uid || user.id)}`}>View profile details</a></div></td></tr>; })}</tbody></table>{!users.length && <p className="py-8 text-white/50">No users found.</p>}</Card></main></AuthGate>;
}
