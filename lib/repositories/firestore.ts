import { addDoc, collection, deleteDoc, doc, getCountFromServer, getDocs, limit, orderBy, query, updateDoc, where, type DocumentData, type QueryConstraint, type WithFieldValue } from "firebase/firestore";
import { cache } from "react";
import { db } from "@/lib/firebase";
import type { Challenge, Organization, PlatformStats, Questionnaire, UserProfile } from "@/lib/types";

export const COLLECTIONS = { users: "users", organizations: "organizations", challenges: "challenges" } as const;

type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];

function withId<T>(snapshot: { id: string; data: () => DocumentData }): T { return { id: snapshot.id, ...snapshot.data() } as T; }
function ref(name: CollectionName) { return collection(db, name); }
function queryFor(name: CollectionName, constraints: QueryConstraint[] = []) { return constraints.length ? query(ref(name), ...constraints) : ref(name); }

export const countCollection = cache(async (name: CollectionName, constraints: QueryConstraint[] = []) => {
  const snap = await getCountFromServer(queryFor(name, constraints));
  return snap.data().count;
});

export const listCollection = cache(async <T>(name: CollectionName, constraints: QueryConstraint[] = []) => {
  const snap = await getDocs(queryFor(name, constraints));
  return snap.docs.map((item) => withId<T>(item));
});

export async function createRecord<T extends object>(name: CollectionName, data: WithFieldValue<T>) { return addDoc(ref(name), data); }
export async function updateRecord(name: CollectionName, id: string, data: Record<string, unknown>) { return updateDoc(doc(db, name, id), data); }
export async function deleteRecord(name: CollectionName, id: string) { return deleteDoc(doc(db, name, id)); }

export const getChallenges = cache(async (maxItems = 12): Promise<Challenge[]> => listCollection<Challenge>(COLLECTIONS.challenges, [orderBy("createdAt", "desc"), limit(maxItems)]));
export const getOrganizations = cache(async (maxItems = 50): Promise<Organization[]> => listCollection<Organization>(COLLECTIONS.organizations, [orderBy("name", "asc"), limit(maxItems)]));
export const getUsers = cache(async (maxItems = 100): Promise<UserProfile[]> => listCollection<UserProfile>(COLLECTIONS.users, [limit(maxItems)]));

export const getPlatformStats = cache(async (): Promise<PlatformStats> => {
  const [communityMembers, organizations, challenges, openChallenges] = await Promise.all([
    countCollection(COLLECTIONS.users),
    countCollection(COLLECTIONS.organizations),
    countCollection(COLLECTIONS.challenges),
    countCollection(COLLECTIONS.challenges, [where("status", "==", "open")]),
  ]);
  return { communityMembers, organizations, challenges, openChallenges };
});

export const getOrganizationStats = cache(async () => {
  const [organizations, challenges] = await Promise.all([countCollection(COLLECTIONS.organizations), countCollection(COLLECTIONS.challenges)]);
  return { organizations, challenges };
});

export async function getQuestionnaireByType(_challengeTypeId: string): Promise<Questionnaire | null> { return null; }
