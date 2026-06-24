import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, increment, limit, orderBy, query, serverTimestamp, setDoc, updateDoc, where, type DocumentData, type QueryConstraint, type WithFieldValue } from "firebase/firestore";
import { cache } from "react";
import { db } from "@/lib/firebase";
import type { AdminApplication, AuditLog, Challenge, ChallengeReview, CommunityPost, Competition, InternalThread, KnowledgeAsset, Notification, Organization, QuestionnaireTemplate, ResearchPost, SearchResult, SystemStats, UserProfile } from "@/lib/types";

export const COLLECTIONS = {
  users: "users", organizations: "organizations", challenges: "challenges", questionnaireTemplates: "questionnaire_templates", challengeReviews: "challenge_reviews", internalThreads: "internal_threads", communityPosts: "community_posts", researchPosts: "research_posts", knowledgeAssets: "knowledge_assets", competitions: "competitions", notifications: "notifications", adminApplications: "admin_applications", systemStats: "system_stats", auditLogs: "audit_logs",
} as const;
export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

function withId<T>(snapshot: { id: string; data: () => DocumentData }): T { return { id: snapshot.id, ...snapshot.data() } as T; }
function ref(name: CollectionName) { return collection(db, name); }
function queryFor(name: CollectionName, constraints: QueryConstraint[] = []) { return constraints.length ? query(ref(name), ...constraints) : ref(name); }
export const listCollection = cache(async <T>(name: CollectionName, constraints: QueryConstraint[] = []) => (await getDocs(queryFor(name, constraints))).docs.map((item) => withId<T>(item)));
export async function getRecord<T>(name: CollectionName, id: string) { const snap = await getDoc(doc(db, name, id)); return snap.exists() ? withId<T>(snap) : null; }
export async function createRecord<T extends object>(name: CollectionName, data: WithFieldValue<Omit<T, "id">>) { return addDoc(ref(name), data); }
export async function updateRecord(name: CollectionName, id: string, data: Record<string, unknown>) { return updateDoc(doc(db, name, id), { ...data, updatedAt: serverTimestamp() }); }
export async function upsertRecord(name: CollectionName, id: string, data: Record<string, unknown>) { return setDoc(doc(db, name, id), data, { merge: true }); }
export async function deleteRecord(name: CollectionName, id: string) { return deleteDoc(doc(db, name, id)); }

export async function logAudit(data: Omit<AuditLog, "id" | "createdAt">) { return createRecord<AuditLog>(COLLECTIONS.auditLogs, { ...data, createdAt: serverTimestamp() } as WithFieldValue<Omit<AuditLog, "id">>); }
export async function bumpStats(field: keyof Omit<SystemStats, "id" | "lastUpdated">, by = 1) { return upsertRecord(COLLECTIONS.systemStats, "platform", { [field]: increment(by), lastUpdated: serverTimestamp() }); }

export const getChallenges = cache(async (maxItems = 12, publicOnly = true): Promise<Challenge[]> => listCollection<Challenge>(COLLECTIONS.challenges, [...(publicOnly ? [where("visibility", "==", "public")] : []), orderBy("createdAt", "desc"), limit(maxItems)]).catch(() => listCollection<Challenge>(COLLECTIONS.challenges, [orderBy("createdAt", "desc"), limit(maxItems)])));
export const getAllChallenges = cache(async (maxItems = 100): Promise<Challenge[]> => listCollection<Challenge>(COLLECTIONS.challenges, [orderBy("createdAt", "desc"), limit(maxItems)]));
export const getSubmittedChallenges = cache(async () => listCollection<Challenge>(COLLECTIONS.challenges, [where("status", "in", ["submitted", "under_review", "researching"]), limit(100)]));
export const getChallengesByOrganization = cache(async (organizationId: string, admin = false) => listCollection<Challenge>(COLLECTIONS.challenges, [where("organizationId", "==", organizationId), ...(admin ? [] : [where("visibility", "==", "public")]), limit(100)]));
export const getOrganizations = cache(async (maxItems = 50): Promise<Organization[]> => listCollection<Organization>(COLLECTIONS.organizations, [orderBy("name", "asc"), limit(maxItems)]));
export const getUsers = cache(async (maxItems = 100): Promise<UserProfile[]> => listCollection<UserProfile>(COLLECTIONS.users, [limit(maxItems)]));
export const getPlatformStats = cache(async (): Promise<SystemStats | null> => getRecord<SystemStats>(COLLECTIONS.systemStats, "platform"));
export const getQuestionnaireTemplates = cache(async () => listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [orderBy("category", "asc")]));
export async function getQuestionnaireByType(category: string) { const rows = await listCollection<QuestionnaireTemplate>(COLLECTIONS.questionnaireTemplates, [where("category", "==", category), limit(1)]); return rows[0] || null; }
export const getAdminApplications = cache(async () => listCollection<AdminApplication>(COLLECTIONS.adminApplications, [orderBy("createdAt", "desc"), limit(100)]));
export const getNotificationsForUser = cache(async (userId: string) => listCollection<Notification>(COLLECTIONS.notifications, [where("userId", "==", userId), orderBy("createdAt", "desc"), limit(50)]));
export const getResearchPosts = cache(async () => listCollection<ResearchPost>(COLLECTIONS.researchPosts, [orderBy("createdAt", "desc"), limit(100)]));
export const getKnowledgeAssets = cache(async () => listCollection<KnowledgeAsset>(COLLECTIONS.knowledgeAssets, [orderBy("createdAt", "desc"), limit(100)]));
export const getCommunityPosts = cache(async () => listCollection<CommunityPost>(COLLECTIONS.communityPosts, [orderBy("createdAt", "desc"), limit(100)]));
export const getCompetitions = cache(async () => listCollection<Competition>(COLLECTIONS.competitions, [orderBy("createdAt", "desc"), limit(100)]));
export const getInternalThreads = cache(async () => listCollection<InternalThread>(COLLECTIONS.internalThreads, [orderBy("createdAt", "desc"), limit(100)]));

export async function createChallengeFromProblem(data: Omit<Challenge, "id" | "createdAt" | "updatedAt" | "status" | "visibility">) {
  const created = await createRecord<Challenge>(COLLECTIONS.challenges, { ...data, createdBy: data.createdBy || data.submittedBy, status: "submitted", visibility: "private", createdAt: serverTimestamp(), updatedAt: serverTimestamp() } as WithFieldValue<Omit<Challenge, "id">>);
  await bumpStats("challengeCount");
  return created;
}
export async function createAdminApplication(data: Omit<AdminApplication, "id" | "createdAt" | "status">) { return createRecord<AdminApplication>(COLLECTIONS.adminApplications, { ...data, status: "pending", createdAt: serverTimestamp() } as WithFieldValue<Omit<AdminApplication, "id">>); }
export async function reviewAdminApplication(application: AdminApplication, reviewerId: string, status: "approved" | "rejected") { await updateRecord(COLLECTIONS.adminApplications, application.id, { status, reviewedBy: reviewerId, reviewedAt: serverTimestamp() }); if (status === "approved") await updateRecord(COLLECTIONS.users, application.userId, { role: "admin" }); return logAudit({ actorId: reviewerId, action: `admin_application_${status}`, collectionName: COLLECTIONS.adminApplications, documentId: application.id }); }
export async function addChallengeReview(data: Omit<ChallengeReview, "id" | "createdAt">) { const review = await createRecord<ChallengeReview>(COLLECTIONS.challengeReviews, { ...data, createdAt: serverTimestamp() } as WithFieldValue<Omit<ChallengeReview, "id">>); if (data.statusTo) await updateRecord(COLLECTIONS.challenges, data.challengeId, data.statusTo === "public" ? { status: data.statusTo, visibility: "public" } : { status: data.statusTo }); return review; }
export async function globalSearch(term: string): Promise<SearchResult[]> { const needle = term.toLowerCase(); const [challenges, orgs, research, knowledge, community, competitions] = await Promise.all([getChallenges(50), getOrganizations(50), getResearchPosts(), getKnowledgeAssets(), getCommunityPosts(), getCompetitions()]); return [ ...challenges.map((x) => ({ id: x.id, type: "Challenge", title: x.title, description: x.description, href: `/challenges/${x.id}`, tags: [x.category || ""] })), ...orgs.map((x) => ({ id: x.id, type: "Organization", title: x.name, description: x.description, href: `/organizations/${x.id}`, tags: [x.industry || ""] })), ...research.map((x) => ({ id: x.id, type: "Research", title: x.title, description: x.summary, href: "/research", tags: x.tags })), ...knowledge.map((x) => ({ id: x.id, type: "Knowledge", title: x.title, description: x.description, href: "/knowledge", tags: x.tags })), ...community.map((x) => ({ id: x.id, type: "Community", title: x.title, description: x.content, href: "/community", tags: x.tags })), ...competitions.map((x) => ({ id: x.id, type: "Competition", title: x.title, description: x.description, href: "/competitions", tags: [x.theme || ""] })) ].filter((x) => [x.title, x.description, ...(x.tags || [])].join(" ").toLowerCase().includes(needle)); }
