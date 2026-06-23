import type { Timestamp } from "firebase/firestore";

export type Role = "visitor" | "member" | "organization" | "admin";
export type ChallengeStatus = "open" | "in_review" | "active" | "completed" | "closed" | "archived" | string;

export interface FirestoreEntity { id: string; }
export interface Challenge extends FirestoreEntity {
  title: string;
  description?: string;
  category?: string;
  status?: ChallengeStatus;
  createdAt?: Timestamp | Date | string | number | null;
  updatedAt?: Timestamp | Date | string | number | null;
  organizationId?: string;
  submittedBy?: string;
  questionnaire?: Record<string, unknown>;
}
export interface Organization extends FirestoreEntity {
  name: string;
  industry?: string;
  city?: string;
  description?: string;
  website?: string;
  status?: string;
}
export interface UserProfile extends FirestoreEntity {
  displayName?: string;
  email?: string;
  role?: Role;
  status?: string;
  createdAt?: Timestamp | Date | string | number | null;
}
export interface SystemStats extends FirestoreEntity {
  memberCount?: number;
  organizationCount?: number;
  challengeCount?: number;
  researchCount?: number;
  competitionCount?: number;
  lastUpdated?: Timestamp | Date | string | number | null;
}
export interface OrganizationStats { organizations: number; challenges: number; }
export interface LabelItem { id: string; label: string; sortOrder?: number; description?: string; }
export interface IndustrySector extends LabelItem { slug?: string; icon?: string; }
export interface CommunityStats { members: number; researchers: number; engineers: number; professionals: number; organizations: number; }
export type ChallengeType = string;
export interface QuestionnaireField { id: string; label: string; type: "text" | "textarea" | "number" | "select" | "file"; required: boolean; options?: string[]; }
export interface Questionnaire { id?: string; challengeType?: ChallengeType; challengeTypeId?: string; fields: QuestionnaireField[]; configurable?: boolean; }
