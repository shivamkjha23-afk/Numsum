import { collection, getCountFromServer, getDocs, limit, orderBy, query, where, type QueryConstraint } from "firebase/firestore";
import { db } from "@/lib/firebase";
import type { Challenge, CommunityStats, IndustrySector, LabelItem, PlatformStats, Questionnaire } from "@/lib/types";

function withId<T>(doc: { id: string; data: () => unknown }): T { return { id: doc.id, ...(doc.data() as Omit<T, "id">) } as T; }
async function countCollection(name: string, constraints: QueryConstraint[] = []) { const ref = collection(db, name); const snap = await getCountFromServer(constraints.length ? query(ref, ...constraints) : ref); return snap.data().count; }

export async function getChallenges(maxItems = 12): Promise<Challenge[]> {
  const snap = await getDocs(query(collection(db, "challenges"), orderBy("createdAt", "desc"), limit(maxItems)));
  return snap.docs.map(doc => withId<Challenge>(doc));
}

export async function getIndustrySectors(): Promise<IndustrySector[]> {
  const snap = await getDocs(query(collection(db, "industry_sectors"), orderBy("sortOrder", "asc")));
  return snap.docs.map(doc => withId<IndustrySector>(doc));
}

export async function getChallengeTypes(): Promise<LabelItem[]> {
  const snap = await getDocs(query(collection(db, "challenge_types"), orderBy("sortOrder", "asc")));
  return snap.docs.map(doc => withId<LabelItem>(doc));
}

export async function getQuestionnaireByType(challengeTypeId: string): Promise<Questionnaire | null> {
  const snap = await getDocs(query(collection(db, "questionnaires"), where("challengeTypeId", "==", challengeTypeId), limit(1)));
  return snap.empty ? null : withId<Questionnaire>(snap.docs[0]);
}

export async function getPlatformStats(): Promise<PlatformStats> {
  const [communityMembers, organizations, challenges, knowledgeAssets] = await Promise.all([
    countCollection("users"),
    countCollection("organizations"),
    countCollection("challenges"),
    countCollection("knowledge_assets"),
  ]);
  return { communityMembers, organizations, challenges, knowledgeAssets };
}

export async function getCommunityStats(): Promise<CommunityStats> {
  const [members, researchers, engineers, professionals, organizations] = await Promise.all([
    countCollection("users"),
    countCollection("users", [where("persona", "==", "researcher")]),
    countCollection("users", [where("persona", "==", "engineer")]),
    countCollection("users", [where("persona", "==", "professional")]),
    countCollection("organizations"),
  ]);
  return { members, researchers, engineers, professionals, organizations };
}

export async function getLabelItems(collectionName: string): Promise<LabelItem[]> {
  const snap = await getDocs(query(collection(db, collectionName), orderBy("sortOrder", "asc")));
  return snap.docs.map(doc => withId<LabelItem>(doc));
}
