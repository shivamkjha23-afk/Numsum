import { collection, doc, getCountFromServer, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InitializationStatus, PlatformInitializationResult, PlatformModuleKey } from "@/lib/types";

export const PLATFORM_MODULES: PlatformModuleKey[] = ["core", "organizations", "competitions", "knowledge_hub", "msme_intelligence"];
const COLLECTIONS = { systemDocuments: "system_documents", settings: "settings", questionnaireTemplates: "questionnaire_templates", roleDefinitions: "role_definitions", systemStats: "system_stats", users: "users", organizations: "organizations", problemStatements: "problem_statements", researchPosts: "research_posts", competitions: "competitions", knowledgeAssets: "knowledge_assets" } as const;
const INIT_VERSION = 1;
const INIT_STATUS_ID = "platform_initialization";
const systemDocs = {
  platform: { name: "Numsum Platform", status: "active", modules: PLATFORM_MODULES },
  navigation: { primary: ["organizations", "competitions", "knowledge", "msme-intelligence"], admin: ["initialization", "system_stats"] },
};
const settingsDocs = {
  platform: { allowPublicBrowsing: true, requireAuthForSubmissions: true, defaultVisibility: "member_only" },
  organizations: { enabled: true, allowSelfRegistration: true },
  competitions: { enabled: true, defaultStatus: "draft" },
  knowledge_hub: { enabled: true, defaultVisibility: "public" },
  msme_intelligence: { enabled: true, defaultRegion: "India" },
};
const roleDefinitions = {
  visitor: { label: "Visitor", permissions: ["read_public"] },
  member: { label: "Member", permissions: ["read_public", "submit_problem", "join_competition"] },
  pending_admin: { label: "Pending Admin", permissions: ["read_public", "submit_problem"] },
  admin: { label: "Admin", permissions: ["admin_dashboard", "moderate_content", "manage_competitions"] },
  super_admin: { label: "Super Admin", permissions: ["admin_dashboard", "moderate_content", "manage_competitions", "manage_platform"] },
};
const questionnaireTemplates = {
  manufacturing: { category: "Manufacturing", name: "Manufacturing Problem Intake", questions: [{ id: "process", label: "Which process is affected?", type: "textarea", required: true }, { id: "impact", label: "What is the business impact?", type: "textarea", required: true }, { id: "constraints", label: "Known constraints", type: "textarea" }] },
  quality: { category: "Quality", name: "Quality Challenge Intake", questions: [{ id: "defect", label: "Describe the defect or variation", type: "textarea", required: true }, { id: "frequency", label: "How often does it occur?", type: "text" }, { id: "measurement", label: "How is quality measured today?", type: "textarea" }] },
  digital_transformation: { category: "Digital Transformation", name: "Digital Transformation Intake", questions: [{ id: "current_tools", label: "Current tools or systems", type: "textarea" }, { id: "desired_outcome", label: "Desired digital outcome", type: "textarea", required: true }, { id: "data_sources", label: "Available data sources", type: "textarea" }] },
};

let initializationPromise: Promise<PlatformInitializationResult> | null = null;

type Patch = Record<string, unknown>;
async function createOrPatchMissing(collectionName: string, id: string, defaults: Patch): Promise<"created" | "patched" | "unchanged"> {
  const ref = doc(db, collectionName, id);
  const snap = await getDoc(ref);
  if (!snap.exists()) { await setDoc(ref, { ...defaults, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); return "created"; }
  const data = snap.data();
  const patch = Object.fromEntries(Object.entries(defaults).filter(([key]) => data[key] === undefined));
  if (Object.keys(patch).length) { await setDoc(ref, { ...patch, updatedAt: serverTimestamp() }, { merge: true }); return "patched"; }
  return "unchanged";
}

async function ensureStatisticsDocument(): Promise<"created" | "patched" | "unchanged"> {
  const ref = doc(db, COLLECTIONS.systemStats, "platform");
  const snap = await getDoc(ref);
  const defaults = snap.exists() ? {} : {
    memberCount: (await getCountFromServer(collection(db, COLLECTIONS.users))).data().count,
    organizationCount: (await getCountFromServer(collection(db, COLLECTIONS.organizations))).data().count,
    problemStatementCount: (await getCountFromServer(collection(db, COLLECTIONS.problemStatements))).data().count,
    challengeCount: (await getCountFromServer(collection(db, COLLECTIONS.problemStatements))).data().count,
    researchCount: (await getCountFromServer(collection(db, COLLECTIONS.researchPosts))).data().count,
    competitionCount: (await getCountFromServer(collection(db, COLLECTIONS.competitions))).data().count,
    knowledgeCount: (await getCountFromServer(collection(db, COLLECTIONS.knowledgeAssets))).data().count,
    communityCount: 0,
  };
  return createOrPatchMissing(COLLECTIONS.systemStats, "platform", defaults);
}

export async function getInitializationStatus(): Promise<InitializationStatus> {
  const status = await getDoc(doc(db, COLLECTIONS.systemDocuments, INIT_STATUS_ID));
  const details = status.exists() ? status.data() : {};
  const checks = await Promise.all([
    getDoc(doc(db, COLLECTIONS.systemDocuments, "platform")),
    getDoc(doc(db, COLLECTIONS.settings, "platform")),
    getDoc(doc(db, COLLECTIONS.questionnaireTemplates, "manufacturing")),
    getDoc(doc(db, COLLECTIONS.roleDefinitions, "admin")),
    getDoc(doc(db, COLLECTIONS.systemStats, "platform")),
  ]);
  const missing = ["system/platform", "settings/platform", "questionnaire_templates/manufacturing", "role_definitions/admin", "system_stats/platform"].filter((_, index) => !checks[index].exists());
  return { id: INIT_STATUS_ID, initialized: missing.length === 0 && Boolean(details.initialized), version: Number(details.version || 0), modules: PLATFORM_MODULES, missingRecords: missing, lastRunAt: details.lastRunAt as InitializationStatus["lastRunAt"], updatedAt: details.updatedAt as InitializationStatus["updatedAt"] };
}

export function initializePlatform(): Promise<PlatformInitializationResult> {
  if (initializationPromise) return initializationPromise;
  initializationPromise = (async () => {
    const changes: PlatformInitializationResult["changes"] = [];
    for (const [id, defaults] of Object.entries(systemDocs)) changes.push({ collection: COLLECTIONS.systemDocuments, id, status: await createOrPatchMissing(COLLECTIONS.systemDocuments, id, defaults) });
    for (const [id, defaults] of Object.entries(settingsDocs)) changes.push({ collection: COLLECTIONS.settings, id, status: await createOrPatchMissing(COLLECTIONS.settings, id, defaults) });
    for (const [id, defaults] of Object.entries(questionnaireTemplates)) changes.push({ collection: COLLECTIONS.questionnaireTemplates, id, status: await createOrPatchMissing(COLLECTIONS.questionnaireTemplates, id, defaults) });
    for (const [id, defaults] of Object.entries(roleDefinitions)) changes.push({ collection: COLLECTIONS.roleDefinitions, id, status: await createOrPatchMissing(COLLECTIONS.roleDefinitions, id, defaults) });
    changes.push({ collection: COLLECTIONS.systemStats, id: "platform", status: await ensureStatisticsDocument() });
    await setDoc(doc(db, COLLECTIONS.systemDocuments, INIT_STATUS_ID), { initialized: true, version: INIT_VERSION, modules: PLATFORM_MODULES, lastRunAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    return { initialized: true, version: INIT_VERSION, changes };
  })();
  return initializationPromise;
}
