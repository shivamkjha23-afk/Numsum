"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth-provider";
import { Button, Card } from "@/components/ui";
import { archiveThread, createModerationAction, hideThread, lockThread, reviewDiscussionReport, updateDiscussionThread } from "@/lib/repositories/firestore";
import type { DiscussionReport, DiscussionThread, UserProfile } from "@/lib/types";

const input = "rounded-xl border border-white/10 bg-black/30 p-3 text-white";

function SelectUser({ users, value, onChange }: { users: UserProfile[]; value?: string; onChange: (userId: string) => void }) {
  return (
    <select className={input} defaultValue={value || ""} onChange={(event) => onChange(event.target.value)}>
      <option value="">Choose moderator</option>
      {users.map((user) => (
        <option key={user.id} value={user.id}>
          {user.name || user.displayName || user.email || user.id}
        </option>
      ))}
    </select>
  );
}

export function AdminCommunityClient({ threads, reports, users }: { threads: DiscussionThread[]; reports: DiscussionReport[]; users: UserProfile[] }) {
  const { user, profile } = useAuth();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const adminId = user?.uid || profile?.id || "admin";
  const moderators = users.filter((userProfile) => ["admin", "super_admin", "moderator", "reviewer"].includes(userProfile.role || "member"));
  const pendingThreads = threads.filter((thread) => thread.status === "under_review" || thread.visibility === "public");

  async function run(label: string, action: () => Promise<unknown>) {
    setMessage(`${label}...`);
    await action();
    setMessage(`${label} saved.`);
    router.refresh();
  }

  async function moderateThread(thread: DiscussionThread, status: DiscussionThread["status"], reason: string) {
    await updateDiscussionThread(thread.id, { status, moderationStatus: status === "open" ? "reviewed" : "action_taken" });
    await createModerationAction({ targetType: "thread", targetId: thread.id, threadId: thread.id, action: status === "open" ? "unlock" : status === "hidden" ? "hide" : status === "locked" ? "lock" : status === "archived" ? "archive" : "dismiss_report", reason, actorId: adminId, actorRole: profile?.role || "admin" });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-4xl">Community Moderation</h1>
          <p className="mt-2 text-white/60">Approve public posts, resolve reports, and keep discussion records linked from request to listing.</p>
        </div>
        <Button href="/community/new" variant="secondary">Create linked discussion</Button>
      </div>
      {message && <Card className="border-blue-300/20 bg-blue-500/10 text-sm text-blue-100">{message}</Card>}
      <div className="grid gap-4 md:grid-cols-4">
        <Card><p className="text-sm text-white/50">Open reports</p><p className="mt-2 text-3xl text-blue-200">{reports.length}</p></Card>
        <Card><p className="text-sm text-white/50">Awaiting approval</p><p className="mt-2 text-3xl text-blue-200">{threads.filter((t) => t.status === "under_review").length}</p></Card>
        <Card><p className="text-sm text-white/50">Visible public</p><p className="mt-2 text-3xl text-blue-200">{threads.filter((t) => t.visibility === "public" && t.status === "open").length}</p></Card>
        <Card><p className="text-sm text-white/50">All threads</p><p className="mt-2 text-3xl text-blue-200">{threads.length}</p></Card>
      </div>
      <Card>
        <h2 className="font-display text-2xl">Posting approval queue</h2>
        <p className="mt-2 text-sm text-white/50">Public submissions land here first; approving moves them to the public community list.</p>
        <div className="mt-5 space-y-4">
          {pendingThreads.length ? pendingThreads.map((thread) => (
            <article key={thread.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[.2em] text-blue-300"><span>{thread.visibility}</span><span>{thread.status}</span><span>{thread.moderationStatus}</span><span>{thread.category}</span></div>
              <h3 className="mt-2 font-display text-2xl">{thread.title}</h3>
              <p className="mt-2 line-clamp-3 text-white/70">{thread.summary || thread.body}</p>
              <p className="mt-3 text-xs text-white/45">Author: {thread.authorName} · Scope: {thread.scopeType}{thread.scopeId ? ` / ${thread.scopeId}` : ""} · ID: {thread.id}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button className="rounded-full bg-green-400 px-4 py-2 text-sm font-semibold text-navy" onClick={() => run("Approve discussion", () => moderateThread(thread, "open", "Approved for public/community listing"))}>Approve & list</button>
                <button className="rounded-full bg-yellow-400/20 px-4 py-2 text-sm text-yellow-100" onClick={() => run("Lock discussion", () => lockThread(thread.id, adminId))}>Lock</button>
                <button className="rounded-full bg-red-400/20 px-4 py-2 text-sm text-red-100" onClick={() => run("Hide discussion", () => hideThread(thread.id, adminId))}>Hide</button>
                <button className="rounded-full bg-white/10 px-4 py-2 text-sm" onClick={() => run("Archive discussion", () => archiveThread(thread.id))}>Archive</button>
              </div>
            </article>
          )) : <p className="text-white/50">No posts are awaiting moderation.</p>}
        </div>
      </Card>
      <Card>
        <h2 className="font-display text-2xl">Open reports</h2>
        <div className="mt-5 space-y-4">{reports.length ? reports.map((report) => (
          <article key={report.id} className="rounded-3xl border border-white/10 bg-black/20 p-4">
            <p className="font-semibold text-white">{report.reason.replaceAll("_", " ")}</p>
            <p className="mt-2 text-sm text-white/60">{report.details || "No details provided."}</p>
            <p className="mt-2 text-xs text-white/40">{report.targetType} {report.targetId} · thread {report.threadId} · by {report.reportedBy}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button className="rounded-full bg-blue-400 px-4 py-2 text-sm font-semibold text-navy" onClick={() => run("Mark report reviewed", () => reviewDiscussionReport(report.id, "reviewed", adminId))}>Mark reviewed</button>
              <button className="rounded-full bg-green-400/20 px-4 py-2 text-sm text-green-100" onClick={() => run("Dismiss report", () => reviewDiscussionReport(report.id, "dismissed", adminId))}>Dismiss</button>
              <button className="rounded-full bg-red-400/20 px-4 py-2 text-sm text-red-100" onClick={() => run("Action report", () => reviewDiscussionReport(report.id, "action_taken", adminId))}>Action taken</button>
            </div>
          </article>
        )) : <p className="text-white/50">No reports or moderation items are pending.</p>}</div>
      </Card>
      <Card>
        <h2 className="font-display text-2xl">Moderator assignment helper</h2>
        <p className="mt-2 text-sm text-white/60">Use names from user data instead of memorising IDs when copying an owner/reviewer into linked workflows.</p>
        <div className="mt-4 max-w-xl"><SelectUser users={moderators} onChange={(userId) => setMessage(userId ? `Selected moderator id: ${userId}` : "No moderator selected.")} /></div>
      </Card>
    </div>
  );
}
