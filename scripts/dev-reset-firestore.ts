export {};
/* Safe development Firestore reset helper for NumSum Labs. */

type FirestoreDb = {
  collection: (name: string) => unknown;
  recursiveDelete: (ref: unknown) => Promise<void>;
};

const COLLECTIONS = [
  "users",
  "organizations",
  "problem_statements",
  "problem_admin_metadata",
  "problem_reviews",
  "problem_onboarding_sessions",
  "onboarding_sessions",
  "onboarding_admin_metadata",
  "questionnaire_templates",
  "questionnaire_responses",
  "meeting_logs",
  "linked_resources",
  "timeline_events",
  "file_links",
  "research_posts",
  "knowledge_assets",
  "sop_documents",
  "pilot_tracks",
  "pilot_milestones",
  "pilot_updates",
  "pilot_metrics",
  "pilot_admin_metadata",
  "competitions",
  "competition_teams",
  "competition_participations",
  "competition_submissions",
  "competition_evaluations",
  "competition_results",
  "competition_submission_admin_metadata",
  "governance_documents",
  "governance_document_versions",
  "governance_amendments",
  "constitution_documents",
  "objective_target_documents",
  "objective_targets",
  "governance_audit_events",
  "execution_work_items",
  "action_items",
  "meeting_records",
  "execution_reviews",
  "decision_records",
  "evidence_records",
  "contribution_records",
  "contribution_claims",
  "contribution_review_metadata",
  "contribution_score_rules",
  "contribution_review_cycles",
  "contributor_review_summaries",
  "recognition_records",
  "notifications",
  "admin_inbox",
  "admin_applications",
  "audit_logs",
  "system_documents",
  "settings",
  "role_definitions",
  "system_stats",
  "bootstrap_admins",
  "community_posts",
  "comments",
  "replies",
  "community_analytics",
  "collaboration_requests",
  "private_collaboration_groups",
  "bookmarks",
  "success_stories",
  "testimonial_ratings",
  "msme_cases",
  "career_openings",
  "career_applications",
];

function valueFor(flag: string) {
  const prefix = `${flag}=`;
  const inline = process.argv.find((arg) => arg.startsWith(prefix));
  if (inline) return inline.slice(prefix.length);
  const index = process.argv.indexOf(flag);
  return index >= 0 ? process.argv[index + 1] : undefined;
}

function parseArgs() {
  const args = process.argv.slice(2);
  const dryRun = args.includes("--dry-run") || !args.includes("--apply");
  const apply = args.includes("--apply");
  const confirmed = args.includes("--confirm-dev-reset");
  const emulator = args.includes("--emulator");
  const projectId = valueFor("--project-id") || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT;
  if (apply && dryRun) throw new Error("Choose exactly one mode: --dry-run or --apply.");
  if (process.env.NODE_ENV === "production") throw new Error("Refusing to run with NODE_ENV=production.");
  if (!emulator && !projectId) throw new Error("Provide --project-id=<dev-project-id> or --emulator.");
  if (apply && !confirmed) throw new Error("Apply mode requires --confirm-dev-reset.");
  return { apply, dryRun, emulator, projectId };
}

async function loadFirestore(projectId?: string, emulator?: boolean) {
  const app = await import("firebase-admin/app");
  const firestore = await import("firebase-admin/firestore");
  if (emulator && !process.env.FIRESTORE_EMULATOR_HOST) process.env.FIRESTORE_EMULATOR_HOST = "127.0.0.1:8080";
  if (!app.getApps().length) app.initializeApp({ projectId, credential: app.applicationDefault() });
  return firestore.getFirestore() as unknown as FirestoreDb;
}

async function main() {
  const { apply, dryRun, emulator, projectId } = parseArgs();
  console.log(`Dev Firestore reset mode: ${dryRun ? "dry-run" : "apply"}`);
  console.log(`Target: ${emulator ? `emulator (${process.env.FIRESTORE_EMULATOR_HOST || "127.0.0.1:8080"})` : projectId}`);
  console.log("Collections that would be deleted:");
  for (const collection of COLLECTIONS) console.log(`- ${collection}`);
  if (dryRun) {
    console.log("Dry run only. Re-run with --apply --confirm-dev-reset to delete these collections.");
    return;
  }
  const db = await loadFirestore(projectId, emulator);
  for (const collection of COLLECTIONS) {
    console.log(`Deleting ${collection}...`);
    await db.recursiveDelete(db.collection(collection));
  }
  console.log("Development Firestore reset completed.");
}

main().catch((error) => {
  console.error("Development Firestore reset failed safely.");
  console.error(error);
  process.exitCode = 1;
});
