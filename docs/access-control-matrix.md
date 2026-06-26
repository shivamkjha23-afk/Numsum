# Access Control Matrix

Roles: public visitor, logged-in incomplete profile, completed member, submitter, competition team member, assigned internal member, admin, super-admin.

| Module | Public visitor | Incomplete profile | Completed member | Submitter | Competition team member | Assigned internal member | Admin | Super-admin |
|---|---|---|---|---|---|---|---|
| Submit MSME challenge | Sign-in required | Complete profile first | Create private submission | Create/read own submissions | Same as member | Same as member | Read/write all | Read/write all |
| View own problem | No | Own after sign-in/profile | Own records | Own private submitted records | Own linked records only | Assigned records only | All | All |
| View public problem | Published public only | Published public only | Published/member-visible safe statuses | Published plus own | Published plus linked team context | Published plus assigned context | All | All |
| Admin problem review | No | No | No | No | No | No | Yes | Yes |
| Onboarding/questionnaire | No | No | Assigned/own visible only | Own linked onboarding if visible | No unless linked | Assigned | All | All |
| Problem Workspace | Public safe linked records only | No private workspace | Member-visible safe records | Own linked visible records | Team-linked records only | Assigned work only | All | All |
| Knowledge/SOP/research | Public safe statuses only | Public only | Member-visible safe statuses | Own/linked allowed records | Team-linked allowed records | Assigned records | All | All |
| Pilots | Public completed/scaled stories only | Public only | Member-visible safe pilots | Own linked visible pilots | Team-linked if allowed | Assigned | All | All |
| Competitions | Public competitions/results only | Public only | Register/own data | Own competition data | Own team/submission data | Assigned if relevant | All including evaluations/results | All |
| Teams/submissions/evaluations | Public results only | No private data | Own only | Own only | Own team/submissions | Assigned only | All | All |
| Governance | No | No | No | No | No | No | Yes | Yes |
| Objectives | No | No | No | No | No | No | Yes | Yes |
| Execution | No | No | No | No | No | Assigned work items | All | All |
| Contributions | No | No | Own claims/records | Own records | Own records | Own/assigned records | All | All |

## Prompt 8B field-safety addendum

| Area | Public | Member | Owner / submitter / team | Assigned internal | Admin |
| --- | --- | --- | --- | --- | --- |
| Admin companion metadata | Denied | Denied | Denied | Denied | Read/write |
| Problem admin notes | Denied via `problem_admin_metadata` | Denied | Denied | Denied | Read/write |
| Onboarding/questionnaire/meeting internal notes | Denied via `onboarding_admin_metadata` | Denied | Denied | Denied | Read/write |
| Pilot internal notes | Denied via `pilot_admin_metadata` | Denied | Denied | Denied | Read/write |
| Competition submission admin/review notes | Denied via `competition_submission_admin_metadata` | Denied | Denied | Denied | Read/write |
| Competition evaluations | Denied | Denied | Denied | Denied | Read/write |
| Governance | Denied | Denied | Denied | Denied unless admin | Read/write |
| Execution work/action/meeting | Denied | Denied unless assigned | Denied unless assigned | Read/limited update when assigned | Read/write |


## Historical sensitive-field migration status

Prompt 8B-2 adds a controlled migration path for historical sensitive fields. Companion metadata remains admin-only. Production data is only partially resolved until operators review `npm run migrate:sensitive-fields:dry-run`, take a backup/export, and run `npm run migrate:sensitive-fields:apply` against the intended Firebase project.

## Current enforcement notes

- Firestore rules now use `isProfileCompleteUser()` for member-owned create operations that require onboarding completion: private submitted problems, competition registrations, competition teams, competition submissions, knowledge/research submissions, and contribution claims.
- Incomplete-profile users may read public-safe records but cannot create those member workflow records until their `users/{uid}.profileComplete` value is `true`.
- Admin and super-admin access remains available through admin helpers and is not dependent on member profile-completion gates.
- Historical sensitive-field migration remains available but optional for current blank/test/junk data. Use clean dev reset guidance in `docs/dev-data-reset.md` until real user data requires backup/migration policy review.

## Prompt 8D QA access-control status

| Requirement | Status | Notes |
|---|---|---|
| Public cannot access admin routes | Needs Manual Seeded Data | Client AuthGate and Firestore rules are in place; verify with unauthenticated browser session. |
| Public cannot access member dashboard | Needs Manual Seeded Data | Client AuthGate is in place; verify unauthenticated browser session. |
| Incomplete user cannot perform member actions | Needs Manual Seeded Data | Client redirect and rules are in place; verify with seeded incomplete profile. |
| Completed member can access dashboard | Needs Manual Seeded Data | Requires seeded completed profile. |
| Member cannot access admin | Needs Manual Seeded Data | Requires seeded non-admin member. |
| Member cannot view another user's private problem | Needs Manual Seeded Data | Requires two seeded submitters and private problem records. |
| Submitter can view own problem | Needs Manual Seeded Data | Requires seeded submitter-owned problem. |
| Team member can view own team/submission only | Needs Manual Seeded Data | Requires seeded competition/team/submission records. |
| Admin can access admin modules | Needs Manual Seeded Data | Requires seeded admin account. |
| Public pages show only public-safe data | Needs Manual Seeded Data | Requires public/private seeded records to verify filters. |
| Governance remains admin-only | Pass by static review; Needs Manual Seeded Data for browser QA | No public nav exposure; admin gates remain. |
| Execution remains admin/assigned-member only | Pass by static review; Needs Manual Seeded Data for browser QA | No public nav exposure; assigned-member paths require seeded assignments. |
| Contributions remain admin/contributor only | Pass by static review; Needs Manual Seeded Data for browser QA | Public nav excludes contribution routes; member dashboard links only own contribution page. |

## User lifecycle and role assignment update

See [User Lifecycle and Role Management](./user-lifecycle-and-role-management.md) for the canonical signup profile creation flow, profile completion redirect behavior, `user_role_requests` review queue, `/admin/users` role assignment page, and super-admin safety rules.

## Community Discussions Access Matrix
| Resource | Public | Incomplete user | Completed member | Problem submitter/assigned | Team member | Admin/Super-admin |
| --- | --- | --- | --- | --- | --- | --- |
| Public open threads | Read | Read | Read/comment | Read/comment | Read/comment | Manage |
| Member threads | No | No | Read/comment | Read/comment | Read/comment | Manage |
| Private problem threads | No | No | No unless authorized | Read/comment | No unless authorized | Manage |
| Private team threads | No | No | No unless team member | No unless team member | Read/comment | Manage |
| Reports | No | No | Create/read own | Create/read own | Create/read own | Manage all |
| Moderation actions | No | No | No | No | No | Manage all |
