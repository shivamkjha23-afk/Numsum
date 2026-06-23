export type Role = "visitor"|"community_member"|"organization_user"|"reviewer"|"moderator"|"administrator";
export type ChallengeStatus = "open"|"in_review"|"active"|"completed";
export type ChallengeType = "Manufacturing Problem"|"Quality Problem"|"Reliability Problem"|"Maintenance Problem"|"Energy Problem"|"Automation Problem"|"Product Development Problem"|"Supply Chain Problem"|"Export Problem"|"Digital Transformation Problem"|"Business Growth Problem"|"Custom Problem";
export interface Challenge { id:string; title:string; category:string; industry:string; participants:number; status:ChallengeStatus; difficulty:"Emerging"|"Advanced"|"Expert"; timeline:string; reward?:string; location:string; }
export interface QuestionnaireField { id:string; label:string; type:"text"|"textarea"|"number"|"select"|"file"; required:boolean; options?:string[]; }
export interface Questionnaire { challengeType:ChallengeType; fields:QuestionnaireField[]; configurable:boolean; }
