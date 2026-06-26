# Firestore Rules Test Plan

Automated emulator tests now live in `tests/firestore-rules/firestore-rules.test.ts`.

## How to run

Install dependencies, ensure Java is available for Firebase Emulator Suite, then run:

```bash
npm run test:rules
```

The script uses `firebase emulators:exec --only firestore` and loads `firestore.rules` directly.

## Required setup

- `npm install` must be able to install `@firebase/rules-unit-testing`, `firebase-tools`, and `firebase-admin`.
- Java must be installed for the Firestore emulator.
- No production credentials are required for rules tests.

## Test personas

- Public visitor
- Incomplete profile user
- Completed member
- Problem submitter
- Competition team member
- Assigned internal member
- Admin
- Super-admin

## Collections covered

`problem_statements`, `problem_admin_metadata`, `knowledge_assets`, `competitions`, `competition_teams`, `competition_submissions`, `competition_evaluations`, `competition_submission_admin_metadata`, `governance_documents`, `execution_work_items`, `execution_reviews`, `contribution_records`, and `contribution_claims`.

## Cases automated

- Public can read public published problem, public approved knowledge, and public open competition.
- Public cannot read private problem, admin metadata, competition submissions/evaluations, governance, execution, or contribution records.
- Incomplete users cannot create submitter-only problems, competition registrations, competition teams, competition submissions, knowledge/research submissions, or contribution claims.
- Members can create owned submitter-only problems and contribution claims, but cannot read another user's private problem or publish public knowledge.
- Submitters can read their own problem and cannot read companion metadata.
- Team members can read their own team/submission, not other teams' submissions or evaluations, and cannot declare results.
- Assigned internal members can read assigned work and update only allowed fields, not restricted fields or unassigned work.
- Admins can read/write companion metadata and admin modules and can publish/approve where rules allow.
- Super-admin can read at least the admin-level resources and use the fallback for unmatched collections.

## Cases still manual

- Query shape/index behavior for complex production list pages.
- End-to-end UI route gating.
- Production IAM/service-account separation for migration execution.

## Limitations

Rules tests validate Firestore authorization only. They do not prove repository functions stripped sensitive fields; that remains covered by typecheck/lint/build and migration dry-run review.

## Current status

`profileComplete` is enforced in Firestore rules with `isProfileCompleteUser()` for member-created problem statements, competition registrations, competition teams, competition submissions, knowledge/research submissions, and contribution claims. Admin and super-admin permissions remain controlled by admin helper checks.

The QA security workflow at `.github/workflows/qa-security.yml` installs dependencies, sets up Java, and runs typecheck, lint, build, and `npm run test:rules`. CI does not run migration apply or dev reset apply scripts.

Development reset guidance is documented in `docs/dev-data-reset.md`; clean reset is acceptable for the current blank/test/junk data state.

## Environment blocker observed in this workspace

During the 2026-06-26 verification pass, `npm run test:rules` started the Firebase CLI and attempted to start the Firestore emulator, but the emulator artifact download failed: `cloud-firestore-emulator-v1.19.8.jar` returned HTTP 403. Treat this as a local environment/artifact-access blocker and rerun the rules suite in CI or another environment with emulator download access.

## Production deployment commands

Deploy rules only after tests pass:

```bash
firebase deploy --only firestore:rules
```

Deploy indexes separately:

```bash
firebase deploy --only firestore:indexes
```

Local emulator blockers such as missing Java or occupied ports should be documented as local environment issues. CI installs Java and runs the rules suite through `firebase emulators:exec`.
