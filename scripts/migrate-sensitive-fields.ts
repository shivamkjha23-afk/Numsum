/* Historical sensitive-field migration for NumSum Labs Firestore documents. */

type CollectionReference = { limit: (n: number) => { get: () => Promise<QuerySnapshot> }; get: () => Promise<QuerySnapshot>; doc: (id: string) => DocumentReference };
type FirestoreDb = {
  collection: (name: string) => CollectionReference;
};
type QuerySnapshot = { docs: QueryDocumentSnapshot[]; size: number };
type QueryDocumentSnapshot = { id: string; data: () => Record<string, unknown>; ref: DocumentReference };
type DocumentReference = { set: (data: Record<string, unknown>, options?: { merge: boolean }) => Promise<void>; update: (data: Record<string, unknown>) => Promise<void> };
type WriteBatch = { set: (ref: DocumentReference, data: Record<string, unknown>, options?: { merge: boolean }) => WriteBatch; update: (ref: DocumentReference, data: Record<string, unknown>) => WriteBatch; commit: () => Promise<void> };

type CollectionMapping = {
  sourceCollection: string;
  targetCollection?: string;
  fields: string[];
  sourceType?: string;
  skipReason?: string;
};

const ADMIN_BLOCKED_FIELDS = [
  "adminNotes",
  "internalNotes",
  "adminInternalNotes",
  "reviewNotes",
  "reviewerNotes",
  "decisionNotes",
  "privateFeedback",
  "adminOnlySummary",
  "reviewerComments",
];

const EXTRA_SENSITIVE_FIELDS = [
  "evaluatorNotes",
  "scoringNotes",
  "evaluationScores",
  "evaluatorScores",
  "rank",
  "winnerReason",
  "reviewerOnlyComments",
  "recognitionNotes",
];

const MAPPINGS: CollectionMapping[] = [
  { sourceCollection: "problem_statements", targetCollection: "problem_admin_metadata", fields: ["adminNotes", "reviewNotes", "internalNotes"] },
  { sourceCollection: "problem_onboarding_sessions", targetCollection: "onboarding_admin_metadata", fields: ["internalNotes", "adminNotes", "reviewNotes"], sourceType: "onboarding_session" },
  { sourceCollection: "onboarding_sessions", targetCollection: "onboarding_admin_metadata", fields: ["internalNotes", "adminNotes", "reviewNotes"], sourceType: "onboarding_session" },
  { sourceCollection: "questionnaire_responses", targetCollection: "onboarding_admin_metadata", fields: ["internalNotes", "adminNotes", "reviewNotes"], sourceType: "questionnaire_response" },
  { sourceCollection: "meeting_logs", targetCollection: "onboarding_admin_metadata", fields: ["internalNotes", "adminNotes", "decisionNotes"], sourceType: "meeting_log" },
  { sourceCollection: "pilot_tracks", targetCollection: "pilot_admin_metadata", fields: ["adminInternalNotes", "internalNotes", "adminNotes", "reviewNotes"] },
  { sourceCollection: "competition_submissions", targetCollection: "competition_submission_admin_metadata", fields: ["adminNotes", "reviewNotes", "evaluatorNotes", "scoringNotes", "evaluationScores", "evaluatorScores", "rank", "winnerReason"] },
  { sourceCollection: "contribution_records", targetCollection: "contribution_review_metadata", fields: ["reviewNotes", "recognitionNotes", "privateFeedback"] },
  { sourceCollection: "decision_records", fields: ["privateFeedback", "internalNotes", "decisionNotes"], skipReason: "decision_records are admin-only in firestore.rules; no shared-document migration is required." },
  { sourceCollection: "governance_documents", fields: ["internalNotes", "adminNotes", "decisionNotes"], skipReason: "governance_documents are admin-only in firestore.rules; no public/member exposure migration is required." },
];

const DELETE_FIELD = Symbol("deleteField");

function parseArgs() {
  const args = process.argv.slice(2);
  const apply = args.includes("--apply");
  const dryRun = args.includes("--dry-run") || !apply;
  const limitArg = args.find((arg) => arg.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : undefined;
  if (apply && args.includes("--dry-run")) throw new Error("Choose exactly one mode: --dry-run or --apply.");
  if (limit !== undefined && (!Number.isInteger(limit) || limit < 1)) throw new Error("--limit must be a positive integer.");
  return { apply, dryRun, limit };
}

function detectFields(data: Record<string, unknown>, mapping: CollectionMapping) {
  const candidateFields = Array.from(new Set([...mapping.fields, ...ADMIN_BLOCKED_FIELDS, ...EXTRA_SENSITIVE_FIELDS]));
  return candidateFields.filter((field) => Object.prototype.hasOwnProperty.call(data, field));
}

function metadataDocId(doc: QueryDocumentSnapshot, mapping: CollectionMapping) {
  return mapping.sourceType ? `${mapping.sourceType}_${doc.id}` : doc.id;
}

function metadataPayload(doc: QueryDocumentSnapshot, mapping: CollectionMapping, fields: string[]) {
  const data = doc.data();
  const values = Object.fromEntries(fields.map((field) => [field, data[field]]));
  return {
    ...values,
    ...(mapping.sourceType ? { sourceType: mapping.sourceType } : {}),
    sourceCollection: mapping.sourceCollection,
    sourceDocId: doc.id,
    migratedFields: fields,
    migratedAt: new Date().toISOString(),
    migratedByScript: "scripts/migrate-sensitive-fields.ts",
  };
}

async function loadFirestore() {
  try {
    const app = await import("firebase-admin/app");
    const firestore = await import("firebase-admin/firestore");
    if (!app.getApps().length) app.initializeApp({ credential: app.applicationDefault() });
    return { db: firestore.getFirestore() as FirestoreDb, deleteField: firestore.FieldValue.delete() };
  } catch (error) {
    console.error("Firebase Admin SDK is not configured or not installed.");
    console.error("Setup: npm install, then authenticate with GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json or gcloud application-default login.");
    console.error("For emulator testing, set FIRESTORE_EMULATOR_HOST and GOOGLE_CLOUD_PROJECT.");
    throw error;
  }
}

async function main() {
  const { apply, dryRun, limit } = parseArgs();
  const { db, deleteField } = await loadFirestore();
  let scanned = 0;
  let matched = 0;
  let migrated = 0;
  let skipped = 0;

  console.log(`Sensitive field migration mode: ${dryRun ? "dry-run" : "apply"}${limit ? `, limit=${limit}` : ""}`);

  for (const mapping of MAPPINGS) {
    if (mapping.skipReason) console.log(`SKIP policy: ${mapping.sourceCollection}: ${mapping.skipReason}`);
    const collectionRef = db.collection(mapping.sourceCollection);
    const snapshot = await (limit ? (collectionRef.limit(limit) as { get: () => Promise<QuerySnapshot> }).get() : collectionRef.get());
    scanned += snapshot.size;

    for (const doc of snapshot.docs) {
      const fields = detectFields(doc.data(), mapping);
      if (!fields.length) continue;
      matched += 1;
      if (!mapping.targetCollection) {
        skipped += 1;
        console.log(`SKIP ${mapping.sourceCollection}/${doc.id}: fields=[${fields.join(", ")}]; ${mapping.skipReason}`);
        continue;
      }
      const targetId = metadataDocId(doc, mapping);
      console.log(`${dryRun ? "DRY-RUN" : "APPLY"} ${mapping.sourceCollection}/${doc.id} -> ${mapping.targetCollection}/${targetId}; fields=[${fields.join(", ")}]`);
      if (apply) {
        const targetRef = db.collection(mapping.targetCollection).doc(targetId);
        await targetRef.set(metadataPayload(doc, mapping, fields), { merge: true });
        const removals = Object.fromEntries(fields.map((field) => [field, deleteField ?? DELETE_FIELD]));
        await doc.ref.update(removals);
        migrated += 1;
      }
    }
  }

  console.log("Migration summary");
  console.log(JSON.stringify({ scanned, matched, migrated, skipped, mode: dryRun ? "dry-run" : "apply" }, null, 2));
}

main().catch((error) => {
  console.error("Sensitive field migration failed safely. No shared fields are removed unless their metadata write has already succeeded.");
  console.error(error);
  process.exitCode = 1;
});
