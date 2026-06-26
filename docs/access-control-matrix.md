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
