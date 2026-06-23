import { challenges, questionnaires } from "../lib/data";
const collections = ["users","organizations","challenges","challenge_categories","questionnaires","questionnaire_fields","teams","team_members","submissions","events","event_registrations","knowledge_assets","research_papers","community_posts","comments","reviews","review_scores","contribution_logs","badges","leaderboards","notifications","messages","admin_settings"];
console.log(JSON.stringify({ collections, challenges, questionnaires }, null, 2));
