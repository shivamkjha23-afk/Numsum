import { collection, doc, getCountFromServer, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { InitializationStatus, PlatformInitializationResult, PlatformModuleKey } from "@/lib/types";

export const PLATFORM_MODULES: PlatformModuleKey[] = ["core", "organizations", "competitions", "knowledge_hub", "msme_intelligence", "community", "teams", "admin_governance"];
const COLLECTIONS = { systemDocuments: "system_documents", settings: "settings", questionnaireTemplates: "questionnaire_templates", roleDefinitions: "role_definitions", systemStats: "system_stats", users: "users", organizations: "organizations", problemStatements: "problem_statements", researchPosts: "research_posts", competitions: "competitions", knowledgeAssets: "knowledge_assets", communityPosts: "community_posts", notifications: "notifications", adminInbox: "admin_inbox", teamMembers: "team_members", privateCollaborationGroups: "private_collaboration_groups", bookmarks: "bookmarks", auditLogs: "audit_logs", msmeCases: "msme_cases" } as const;
const INIT_VERSION = 2;
const INIT_STATUS_ID = "platform_initialization";
const systemDocs = {
  platform: { name: "Numsum Platform", status: "active", modules: PLATFORM_MODULES },
  navigation: { primary: ["problem-statements", "research", "knowledge", "competitions", "msme-intelligence"], admin: ["dashboard", "inbox", "forms", "users", "system-health"] },
  community: { enabled: true, features: ["comments", "replies", "likes", "bookmarks", "reports"] },
  relationships: { enabled: true, supported: ["problem_statement", "research", "competition", "knowledge_asset", "organization"] },
};
const settingsDocs = {
  platform: { allowPublicBrowsing: true, requireAuthForSubmissions: true, defaultVisibility: "member_only" },
  organizations: { enabled: true, allowSelfRegistration: true },
  competitions: { enabled: true, defaultStatus: "draft" },
  knowledge_hub: { enabled: true, defaultVisibility: "public" },
  msme_intelligence: { enabled: true, defaultRegion: "India" },
  notifications: { enabled: true, unreadCount: true },
  teams: { enabled: true, allowEmailInvites: true },
};
const roleDefinitions = {
  default: { label: "Default", permissions: ["read_public"] },
  visitor: { label: "Visitor", permissions: ["read_public"] },
  member: { label: "Member", permissions: ["read_public", "submit_problem", "join_competition"] },
  reviewer: { label: "Reviewer", permissions: ["read_public", "review_assigned"] },
  moderator: { label: "Moderator", permissions: ["read_public", "moderate_content"] },
  organization: { label: "Organization", permissions: ["read_public", "submit_problem", "manage_organization_profile"] },
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
function missingTopLevelFields(existing: Record<string, unknown>, defaults: Patch) { return Object.fromEntries(Object.entries(defaults).filter(([key]) => existing[key] === undefined)); }
async function createOrPatchMissing(collectionName: string, id: string, defaults: Patch): Promise<"created" | "patched" | "unchanged"> {
  const ref = doc(db, collectionName, id);
  console.info("[INIT] Checking platform document", { collectionName, id });
  const snap = await getDoc(ref);
  if (!snap.exists()) { console.info("[INIT] Creating missing platform document", { collectionName, id }); await setDoc(ref, { ...defaults, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); return "created"; }
  const data = snap.data();
  const patch = missingTopLevelFields(data, defaults);
  if (Object.keys(patch).length) { console.info("[INIT] Patching missing platform fields", { collectionName, id, fields: Object.keys(patch) }); await setDoc(ref, { ...patch, updatedAt: serverTimestamp() }, { merge: true }); return "patched"; }
  console.info("[INIT] Platform document unchanged", { collectionName, id });
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
    communityCount: (await getCountFromServer(collection(db, COLLECTIONS.communityPosts))).data().count,
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
    getDoc(doc(db, COLLECTIONS.roleDefinitions, "default")),
    getDoc(doc(db, COLLECTIONS.systemStats, "platform")),
  ]);
  const missing = ["system/platform", "settings/platform", "questionnaire_templates/manufacturing", "role_definitions/default", "system_stats/platform"].filter((_, index) => !checks[index].exists());
  return { id: INIT_STATUS_ID, initialized: missing.length === 0 && Boolean(details.initialized), version: Number(details.version || 0), modules: PLATFORM_MODULES, missingRecords: missing, lastRunAt: details.lastRunAt as InitializationStatus["lastRunAt"], updatedAt: details.updatedAt as InitializationStatus["updatedAt"] };
}

const collectionSentinels: Array<[string, string, Patch]> = [
  [COLLECTIONS.users, "__schema", { schema: "users", preserved: true }],
  [COLLECTIONS.organizations, "__schema", { schema: "organizations", verificationStatus: "unverified" }],
  [COLLECTIONS.problemStatements, "__schema", { schema: "problem_statements", visibility: "private" }],
  [COLLECTIONS.researchPosts, "__schema", { schema: "research_posts", visibility: "private" }],
  [COLLECTIONS.knowledgeAssets, "__schema", { schema: "knowledge_assets", visibility: "private" }],
  [COLLECTIONS.competitions, "__schema", { schema: "competitions", status: "draft" }],
  [COLLECTIONS.communityPosts, "__schema", { schema: "community_posts", visibility: "private" }],
  [COLLECTIONS.notifications, "__schema", { schema: "notifications" }],
  [COLLECTIONS.adminInbox, "__schema", { schema: "admin_inbox", status: "resolved" }],
  [COLLECTIONS.teamMembers, "__schema", { schema: "team_members" }],
  [COLLECTIONS.privateCollaborationGroups, "__schema", { schema: "private_collaboration_groups", visibility: "private" }],
  [COLLECTIONS.bookmarks, "__schema", { schema: "bookmarks" }],
  [COLLECTIONS.auditLogs, "__schema", { schema: "audit_logs" }],
  [COLLECTIONS.msmeCases, "__schema", { schema: "msme_cases", searchable: true }],
];

export function initializePlatform(): Promise<PlatformInitializationResult> {
  if (initializationPromise) return initializationPromise;
  initializationPromise = (async () => {
    console.info("[INIT] Starting platform initialization");
    const changes: PlatformInitializationResult["changes"] = [];
    for (const [id, defaults] of Object.entries(systemDocs)) changes.push({ collection: COLLECTIONS.systemDocuments, id, status: await createOrPatchMissing(COLLECTIONS.systemDocuments, id, defaults) });
    for (const [id, defaults] of Object.entries(settingsDocs)) changes.push({ collection: COLLECTIONS.settings, id, status: await createOrPatchMissing(COLLECTIONS.settings, id, defaults) });
    for (const [id, defaults] of Object.entries(questionnaireTemplates)) changes.push({ collection: COLLECTIONS.questionnaireTemplates, id, status: await createOrPatchMissing(COLLECTIONS.questionnaireTemplates, id, defaults) });
    for (const [id, defaults] of Object.entries(roleDefinitions)) changes.push({ collection: COLLECTIONS.roleDefinitions, id, status: await createOrPatchMissing(COLLECTIONS.roleDefinitions, id, defaults) });
    changes.push({ collection: COLLECTIONS.systemStats, id: "platform", status: await ensureStatisticsDocument() });
    for (const [collectionName, id, defaults] of collectionSentinels) changes.push({ collection: collectionName, id, status: await createOrPatchMissing(collectionName, id, defaults) });
    await setDoc(doc(db, COLLECTIONS.systemDocuments, INIT_STATUS_ID), { initialized: true, version: INIT_VERSION, modules: PLATFORM_MODULES, lastRunAt: serverTimestamp(), updatedAt: serverTimestamp() }, { merge: true });
    console.info("[INIT] Platform initialization complete", { changes });
    return { initialized: true, version: INIT_VERSION, changes };
  })();
  return initializationPromise;
}
