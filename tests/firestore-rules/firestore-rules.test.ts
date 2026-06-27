import { readFileSync } from "node:fs";
import assert from "node:assert/strict";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment
} from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where } from "firebase/firestore";

const projectId = `numsum-rules-${Date.now()}`;

type AuthUser = { uid: string; email?: string };

const USERS = {
  incomplete: { uid: "incomplete-user", email: "incomplete@example.com" },
  member: { uid: "member-user", email: "member@example.com" },
  submitter: { uid: "submitter-user", email: "submitter@example.com" },
  teamMember: { uid: "team-user", email: "team@example.com" },
  assigned: { uid: "assigned-user", email: "assigned@example.com" },
  legacy: { uid: "legacy-user", email: "legacy@example.com" },
  admin: { uid: "admin-user", email: "admin@example.com" },
  superAdmin: { uid: "super-admin-user", email: "super@example.com" },
};

function authed(env: any, user: AuthUser) {
  return env.authenticatedContext(user.uid, { email: user.email }).firestore();
}

async function seed(env: any) {
  await env.withSecurityRulesDisabled(async (context: any) => {
    const db = context.firestore();
    await Promise.all([
      setDoc(doc(db, "users", USERS.incomplete.uid), { uid: USERS.incomplete.uid, role: "member", profileComplete: false }),
      setDoc(doc(db, "users", USERS.member.uid), { uid: USERS.member.uid, role: "member", profileComplete: true }),
      setDoc(doc(db, "users", USERS.submitter.uid), { uid: USERS.submitter.uid, role: "member", profileComplete: true }),
      setDoc(doc(db, "users", USERS.teamMember.uid), { uid: USERS.teamMember.uid, role: "member", profileComplete: true }),
      setDoc(doc(db, "users", USERS.assigned.uid), { uid: USERS.assigned.uid, role: "member", profileComplete: true }),
      setDoc(doc(db, "users", USERS.legacy.uid), { email: USERS.legacy.email, profileComplete: false }),
      setDoc(doc(db, "users", USERS.admin.uid), { uid: USERS.admin.uid, role: "admin", profileComplete: true }),
      setDoc(doc(db, "users", USERS.superAdmin.uid), { uid: USERS.superAdmin.uid, role: "super_admin", profileComplete: true }),
      setDoc(doc(db, "problem_statements", "public-problem"), { visibility: "public", status: "published", title: "Published" }),
      setDoc(doc(db, "problem_statements", "private-problem"), { visibility: "submitter_only", status: "submitted", createdBy: USERS.submitter.uid, submittedByUserId: USERS.submitter.uid, assignedAdminId: USERS.admin.uid }),
      setDoc(doc(db, "problem_admin_metadata", "private-problem"), { adminNotes: "secret" }),
      setDoc(doc(db, "knowledge_assets", "public-knowledge"), { visibility: "public", status: "approved", createdBy: USERS.admin.uid }),
      setDoc(doc(db, "competitions", "open-competition"), { visibility: "public", status: "open", title: "Open" }),
      setDoc(doc(db, "competitions", "draft-competition"), { visibility: "public", status: "draft", title: "Draft" }),
      setDoc(doc(db, "competition_teams", "own-team"), { members: [USERS.teamMember.uid], leader: USERS.teamMember.uid }),
      setDoc(doc(db, "competition_submissions", "own-submission"), { members: [USERS.teamMember.uid], createdBy: USERS.teamMember.uid, status: "submitted" }),
      setDoc(doc(db, "competition_submissions", "other-submission"), { members: ["other-user"], createdBy: "other-user", status: "submitted" }),
      setDoc(doc(db, "competition_evaluations", "evaluation"), { submissionId: "own-submission", score: 10 }),
      setDoc(doc(db, "competition_submission_admin_metadata", "own-submission"), { evaluatorNotes: "secret" }),
      setDoc(doc(db, "governance_documents", "governance"), { status: "approved" }),
      setDoc(doc(db, "execution_work_items", "assigned-work"), { ownerIds: [USERS.assigned.uid], status: "open", restrictedBudget: 100 }),
      setDoc(doc(db, "execution_work_items", "unassigned-work"), { ownerIds: ["other-user"], status: "open" }),
      setDoc(doc(db, "execution_reviews", "review"), { status: "draft" }),
      setDoc(doc(db, "contribution_records", "member-contribution"), { contributorUserId: USERS.member.uid, reviewStatus: "pending" }),
    ]);
  });
}

async function run() {
  const env = await initializeTestEnvironment({ projectId, firestore: { rules: readFileSync("firestore.rules", "utf8") } });
  try {
    await seed(env);
    const publicDb = env.unauthenticatedContext().firestore();
    const incompleteDb = authed(env, USERS.incomplete);
    const memberDb = authed(env, USERS.member);
    const newSignupDb = authed(env, { uid: "new-signup-user", email: "new-signup@example.com" });
    const submitterDb = authed(env, USERS.submitter);
    const teamDb = authed(env, USERS.teamMember);
    const assignedDb = authed(env, USERS.assigned);
    const legacyDb = authed(env, USERS.legacy);
    const adminDb = authed(env, USERS.admin);
    const superAdminDb = authed(env, USERS.superAdmin);

    await assertSucceeds(getDoc(doc(publicDb, "problem_statements", "public-problem")));
    await assertFails(getDoc(doc(publicDb, "problem_statements", "private-problem")));
    await assertSucceeds(getDoc(doc(publicDb, "knowledge_assets", "public-knowledge")));
    await assertFails(getDoc(doc(publicDb, "problem_admin_metadata", "private-problem")));
    await assertSucceeds(getDoc(doc(publicDb, "competitions", "open-competition")));
    await assertFails(getDoc(doc(publicDb, "competitions", "draft-competition")));
    await assertFails(getDocs(query(collection(publicDb, "competitions"), where("visibility", "==", "public"))));
    await assertSucceeds(getDocs(query(collection(publicDb, "competitions"), where("visibility", "==", "public"), where("status", "in", ["published", "upcoming", "open", "closed", "results_declared"]))));
    await assertFails(getDoc(doc(publicDb, "competition_submissions", "own-submission")));
    await assertFails(getDoc(doc(publicDb, "competition_evaluations", "evaluation")));
    await assertFails(getDoc(doc(publicDb, "governance_documents", "governance")));
    await assertFails(getDoc(doc(publicDb, "execution_work_items", "assigned-work")));
    await assertFails(getDoc(doc(publicDb, "contribution_records", "member-contribution")));

    await assertFails(setDoc(doc(incompleteDb, "problem_statements", "incomplete-problem"), { createdBy: USERS.incomplete.uid, submittedByUserId: USERS.incomplete.uid, visibility: "submitter_only", status: "submitted" }));
    await assertFails(setDoc(doc(incompleteDb, "competition_participations", "blocked-registration"), { participantUserId: USERS.incomplete.uid, competitionId: "open-competition", status: "registered" }));
    await assertFails(setDoc(doc(incompleteDb, "competition_teams", "blocked-team"), { members: [USERS.incomplete.uid], leader: USERS.incomplete.uid, competitionId: "open-competition" }));
    await assertFails(setDoc(doc(incompleteDb, "competition_submissions", "blocked"), { createdBy: USERS.incomplete.uid, members: [USERS.incomplete.uid], visibility: "team_only", status: "draft" }));
    await assertFails(setDoc(doc(incompleteDb, "knowledge_assets", "blocked-knowledge"), { createdBy: USERS.incomplete.uid, visibility: "admin_only", status: "under_review", problemStatementId: "public-problem" }));
    await assertFails(setDoc(doc(incompleteDb, "research_posts", "blocked-research"), { createdBy: USERS.incomplete.uid, visibility: "admin_only", status: "under_review" }));
    await assertFails(setDoc(doc(incompleteDb, "contribution_claims", "blocked-claim"), { contributorUserId: USERS.incomplete.uid, status: "submitted" }));

    await assertSucceeds(setDoc(doc(newSignupDb, "users", "new-signup-user"), { uid: "new-signup-user", email: "new-signup@example.com", role: "member", status: "active", profileComplete: false, provider: "password" }, { merge: true }));
    await assertSucceeds(setDoc(doc(newSignupDb, "user_role_requests", "new-signup-user"), { userId: "new-signup-user", email: "new-signup@example.com", requestedRole: "member", currentRole: "member", status: "pending_review", reason: "New user signup", provider: "password" }, { merge: true }));
    await assertSucceeds(setDoc(doc(newSignupDb, "user_role_requests", "new-signup-elevated"), { userId: "new-signup-user", email: "new-signup@example.com", requestedRole: "contributor", currentRole: "member", status: "pending", reason: "Need contribution access" }));
    await assertFails(setDoc(doc(newSignupDb, "system_stats", "platform"), { memberCount: 1 }, { merge: true }));

    await assertSucceeds(setDoc(doc(memberDb, "problem_statements", "member-problem"), { createdBy: USERS.member.uid, submittedByUserId: USERS.member.uid, visibility: "submitter_only", status: "submitted" }));
    await assertSucceeds(setDoc(doc(memberDb, "competition_participations", "member-registration"), { participantUserId: USERS.member.uid, competitionId: "open-competition", status: "registered" }));
    await assertSucceeds(setDoc(doc(memberDb, "competition_teams", "member-team"), { members: [USERS.member.uid], leader: USERS.member.uid, competitionId: "open-competition" }));
    await assertSucceeds(setDoc(doc(memberDb, "competition_submissions", "member-submission"), { createdBy: USERS.member.uid, members: [USERS.member.uid], visibility: "team_only", status: "draft" }));
    await assertFails(getDoc(doc(memberDb, "problem_statements", "private-problem")));
    await assertFails(updateDoc(doc(memberDb, "problem_statements", "public-problem"), { status: "published" }));
    await assertFails(setDoc(doc(memberDb, "knowledge_assets", "member-public"), { createdBy: USERS.member.uid, visibility: "public", status: "published", problemStatementId: "public-problem" }));
    await assertSucceeds(setDoc(doc(memberDb, "contribution_claims", "member-claim"), { contributorUserId: USERS.member.uid, status: "submitted" }));

    await assertSucceeds(getDoc(doc(submitterDb, "problem_statements", "private-problem")));
    await assertFails(getDoc(doc(submitterDb, "problem_admin_metadata", "private-problem")));

    await assertSucceeds(getDoc(doc(teamDb, "competition_teams", "own-team")));
    await assertSucceeds(getDoc(doc(teamDb, "competition_submissions", "own-submission")));
    await assertFails(getDoc(doc(teamDb, "competition_submissions", "other-submission")));
    await assertFails(getDoc(doc(teamDb, "competition_evaluations", "evaluation")));
    await assertFails(updateDoc(doc(teamDb, "competition_results", "result"), { status: "published" }));

    await assertSucceeds(getDoc(doc(assignedDb, "execution_work_items", "assigned-work")));
    await assertSucceeds(updateDoc(doc(assignedDb, "execution_work_items", "assigned-work"), { status: "in_progress", updatedAt: "now" }));
    await assertFails(updateDoc(doc(assignedDb, "execution_work_items", "assigned-work"), { restrictedBudget: 200 }));
    await assertFails(getDoc(doc(assignedDb, "execution_work_items", "unassigned-work")));

    await assertSucceeds(setDoc(doc(adminDb, "problem_admin_metadata", "new"), { adminNotes: "secret" }));
    await assertSucceeds(getDoc(doc(adminDb, "governance_documents", "governance")));
    await assertSucceeds(setDoc(doc(adminDb, "competition_evaluations", "admin-eval"), { score: 100 }));
    await assertSucceeds(updateDoc(doc(adminDb, "problem_statements", "private-problem"), { status: "published", visibility: "public" }));

    await assertSucceeds(getDoc(doc(superAdminDb, "problem_admin_metadata", "private-problem")));
    const result = await getDoc(doc(superAdminDb, "unmatched_collection", "anything"));
    assert.equal(result.exists(), false);
    console.log("Firestore rules emulator tests passed.");
  } finally {
    await env.cleanup();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
