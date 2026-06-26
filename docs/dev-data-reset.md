# Development Firestore Data Reset

Use this guidance only for local emulator, development, staging, and disposable test Firebase projects. Never reset a production project or any project that contains real user data.

The current NumSum Labs Firestore data is mostly blank/test/junk, so a clean reset is acceptable for development readiness. Before a real public launch with real user data, revisit backup, retention, migration, and deletion policies.

## Recommended approach: Firebase Console manual deletion

1. Confirm the Firebase project is dev/staging/test and does not contain real user data.
2. Confirm no production credentials or production project id are selected.
3. In Firebase Console, open Firestore Database.
4. Delete only NumSum Labs application collections listed below.
5. Re-seed required admin, governance, questionnaire, profile, and sample problem records.
6. Run `npm run test:rules` locally or in CI to validate authorization behavior.

Manual deletion is preferred because it forces visible confirmation of the target project and deleted collections.

## Optional CLI/scripted reset

A guarded helper is available for dev projects:

```bash
npm run dev:reset-firestore:dry-run -- --project-id=<dev-project-id>
npm run dev:reset-firestore:apply -- --project-id=<dev-project-id>
```

For the local emulator:

```bash
npm run dev:reset-firestore:dry-run -- --emulator
npm run dev:reset-firestore:apply -- --emulator
```

Safety behavior:

- apply mode requires `--confirm-dev-reset` through the npm script
- a project id or `--emulator` is required
- `NODE_ENV=production` is refused
- the script prints every collection before deleting
- dry run is the default and performs no writes/deletes

You may also use Firebase CLI deletion commands against a verified dev/staging/test project, but avoid production credentials and prefer console/manual deletion when unsure.

## NumSum Labs collections

- Core/admin: `users`, `organizations`, `admin_inbox`, `admin_applications`, `audit_logs`, `system_documents`, `settings`, `role_definitions`, `system_stats`, `bootstrap_admins`
- Problems/onboarding/workspace: `problem_statements`, `problem_admin_metadata`, `problem_reviews`, `problem_onboarding_sessions`, `onboarding_sessions`, `onboarding_admin_metadata`, `questionnaire_templates`, `questionnaire_responses`, `meeting_logs`, `linked_resources`, `timeline_events`, `file_links`
- Knowledge/research/SOP/pilots: `research_posts`, `knowledge_assets`, `sop_documents`, `pilot_tracks`, `pilot_milestones`, `pilot_updates`, `pilot_metrics`, `pilot_admin_metadata`
- Competitions: `competitions`, `competition_teams`, `competition_participations`, `competition_submissions`, `competition_evaluations`, `competition_results`, `competition_submission_admin_metadata`
- Governance/execution: `governance_documents`, `governance_document_versions`, `governance_amendments`, `constitution_documents`, `objective_target_documents`, `objective_targets`, `governance_audit_events`, `execution_work_items`, `action_items`, `meeting_records`, `execution_reviews`, `decision_records`, `evidence_records`
- Contributions/recognition: `contribution_records`, `contribution_claims`, `contribution_review_metadata`, `contribution_score_rules`, `contribution_review_cycles`, `contributor_review_summaries`, `recognition_records`
- Community/public extras: `community_posts`, `comments`, `replies`, `community_analytics`, `collaboration_requests`, `private_collaboration_groups`, `bookmarks`, `success_stories`, `testimonial_ratings`, `msme_cases`, `career_openings`, `career_applications`, `notifications`

## Post-reset checklist

- [ ] Create an admin user.
- [ ] Seed governance documents.
- [ ] Seed questionnaire template.
- [ ] Create a completed test member profile.
- [ ] Create one private submitted test problem.
- [ ] Verify admin dashboard access and admin-only collections.
- [ ] Run `npm run typecheck`, `npm run lint`, `npm run build`, and `npm run test:rules`.
