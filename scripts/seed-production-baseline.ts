export {};

type DocumentReference = { get: () => Promise<{ exists: boolean }>; set: (data: Record<string, unknown>, options?: { merge: boolean }) => Promise<void> };

type SeedRecord = { collection: string; id: string; data: Record<string, unknown> };

const records: SeedRecord[] = [
  { collection: "governance_documents", id: "constitution-placeholder", data: { title: "NumSum Labs Constitution Placeholder", documentType: "constitution", status: "draft", visibility: "admin", summary: "Replace with the approved constitution before public launch.", public: false } },
  { collection: "objective_targets", id: "founding-readiness-objective", data: { title: "Production readiness baseline", status: "frozen", visibility: "admin", targetType: "operational", summary: "Founding-stage objective for launch readiness only." } },
  { collection: "questionnaire_templates", id: "default-msme-onboarding", data: { title: "Default MSME onboarding questionnaire", category: "msme_onboarding", status: "active", version: 1, questions: [] } },
  { collection: "contribution_score_rules", id: "default-non-equity-rules", data: { title: "Default non-equity contribution score rules", active: true, equityDisclaimer: "Contribution scores are operational recognition signals and do not represent equity, ownership, or compensation." } },
  { collection: "knowledge_assets", id: "founding-stage-platform-note", data: { title: "NumSum Labs founding-stage knowledge note", status: "published", visibility: "public", summary: "NumSum Labs is preparing its operating knowledge base and will publish validated resources as they become available." } },
  { collection: "competitions", id: "draft-launch-sample", data: { title: "Draft launch sample challenge", status: "draft", visibility: "admin", summary: "Admin-only draft used to verify challenge operations. Do not publish as real activity." } },
];

function has(flag: string) { return process.argv.includes(flag); }

async function main() {
  if (process.env.CI) throw new Error("Refusing to run seed in CI.");
  if (!has("--confirm-baseline-seed")) throw new Error("Missing --confirm-baseline-seed.");
  if (process.env.NODE_ENV === "production" && !has("--confirm-production-seed")) throw new Error("NODE_ENV=production requires --confirm-production-seed.");
  if (!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.FIRESTORE_EMULATOR_HOST) throw new Error("Firebase Admin credentials are required. Set GOOGLE_APPLICATION_CREDENTIALS, or use FIRESTORE_EMULATOR_HOST for emulator rehearsal.");
  const overwrite = has("--overwrite");

  const admin = (await (Function("moduleName", "return import(moduleName)"))("firebase-admin")) as any;
  if (!admin.apps.length) admin.initializeApp({ credential: admin.credential.applicationDefault() });
  const db = admin.firestore();

  for (const record of records) {
    const ref = db.collection(record.collection).doc(record.id) as DocumentReference;
    const existing = await ref.get();
    if (existing.exists && !overwrite) {
      console.log(`SKIP ${record.collection}/${record.id}`);
      continue;
    }
    await ref.set({ ...record.data, seededAt: admin.firestore.FieldValue.serverTimestamp(), seededBy: "scripts/seed-production-baseline.ts" }, { merge: true });
    console.log(`${existing.exists ? "UPDATED" : "CREATED"} ${record.collection}/${record.id}`);
  }
}

main().catch((error) => {
  console.error("Baseline seed failed safely.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
