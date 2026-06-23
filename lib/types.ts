export type Role = "visitor"|"community_member"|"organization_user"|"reviewer"|"moderator"|"administrator";
export type ChallengeStatus = "open"|"in_review"|"active"|"completed"|string;
export interface Challenge { id:string; title:string; category:string; industry:string; participants:number; status:ChallengeStatus; difficulty:string; timeline:string; reward?:string; location:string; }
export interface IndustrySector { id:string; name:string; description?:string; icon?:string; sortOrder?:number; }
export interface PlatformStats { communityMembers:number; organizations:number; challenges:number; knowledgeAssets:number; impactScore?:number; }
export interface CommunityStats { members:number; researchers:number; engineers:number; professionals:number; organizations:number; }
export interface ChallengeType { id:string; name:string; description?:string; sortOrder?:number; }
export interface QuestionnaireField { id:string; label:string; type:"text"|"textarea"|"number"|"select"|"file"; required:boolean; options?:string[]; placeholder?:string; sortOrder?:number; }
export interface Questionnaire { id:string; challengeTypeId:string; fields:QuestionnaireField[]; configurable:boolean; }

export interface LabelItem { id:string; name:string; description?:string; sortOrder?:number; }
