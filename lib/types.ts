export type Role = "visitor" | "member" | "organization" | "admin";
export type ChallengeStatus = "open" | "in_review" | "active" | "completed";
export type ChallengeType = "Manufacturing Problem" | "Quality Problem" | "Reliability Problem" | "Maintenance Problem" | "Energy Problem" | "Automation Problem" | "Product Development Problem" | "Supply Chain Problem" | "Export Problem" | "Digital Transformation Problem" | "Business Growth Problem" | "Custom Problem";
export interface Challenge { id: string; title: string; category: string; industry: string; participants: number; status: ChallengeStatus; difficulty: "Emerging" | "Advanced" | "Expert"; timeline: string; reward?: string; location: string; }
export interface QuestionnaireField { id: string; label: string; type: "text" | "textarea" | "number" | "select" | "file"; required: boolean; options?: string[]; }
export interface Questionnaire { challengeType: ChallengeType; fields: QuestionnaireField[]; configurable: boolean; }

export interface LabelItem { id: string; label: string; sortOrder: number; description?: string; }
export interface IndustrySector extends LabelItem { slug?: string; icon?: string; }
export interface PlatformStats { communityMembers: number; organizations: number; challenges: number; knowledgeAssets: number; }
export interface CommunityStats { members: number; researchers: number; engineers: number; professionals: number; organizations: number; }
