import { exportOpportunities, governmentSchemes, industryClusters, industryReports, marketInsights, msmeSectors, technologyTrends } from "../lib/msme-intelligence-data";

const collections = ["users", "organizations", "challenges", "challenge_categories", "questionnaires", "questionnaire_fields", "teams", "team_members", "submissions", "events", "event_registrations", "knowledge_assets", "research_papers", "community_posts", "comments", "reviews", "review_scores", "contribution_logs", "badges", "notifications", "messages", "admin_settings", "industry_clusters", "msme_sectors", "government_schemes", "export_opportunities", "industry_reports", "market_insights", "technology_trends"];

console.log(JSON.stringify({ collections, industry_clusters: industryClusters, msme_sectors: msmeSectors, government_schemes: governmentSchemes, export_opportunities: exportOpportunities, industry_reports: industryReports, market_insights: marketInsights, technology_trends: technologyTrends }, null, 2));
