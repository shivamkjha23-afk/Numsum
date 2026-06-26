# QA Checklist

- [ ] Public homepage loads and primary CTA is Submit MSME Challenge.
- [ ] Public navigation excludes Community, Organizations, Team Directory, Notifications, broad team pages, demo routes, and `/admin?tab=` links.
- [ ] Public routes `/problem-statements`, `/research`, `/knowledge`, `/sops`, `/competitions`, `/pilots`, and `/msme-intelligence` show only public-safe data.
- [ ] Logged-in incomplete-profile user is redirected to profile completion before member actions.
- [ ] Completed member can open `/dashboard` and sees simplified sections/empty states.
- [ ] Submitter can view own private problem and cannot view another submitter private problem.
- [ ] Competition team member can view only own team and submissions.
- [ ] Public cannot view private competition submissions or evaluations.
- [ ] Public/member user opening any `/admin/...` route sees admin-access-required only.
- [ ] Admin user can open all admin navigation links after auth.
- [ ] Firestore rules simulator verifies problem statement public/member/submitter/admin cases.
- [ ] Dashboard links resolve to real routes.
- [ ] Mobile header/menu, wide tables, tabs, and cards do not overflow.
- [ ] Build/typecheck/lint run and blockers are documented.

## Prompt 8B route and access smoke checklist

### Passed by static review / build verification

- Public pages use public-safe repository functions constrained by visibility/status for problems, competitions, research, knowledge/SOP, and pilots.
- Admin/governance/execution/contribution review routes remain behind admin or assigned-member gates.
- Competition evaluations and new competition submission review metadata are admin-only.
- Hidden/future modules remain documented rather than promoted as completed product areas.

### Needs manual verification with seeded accounts

1. Public visitor: home, problem statements, knowledge, SOPs, research, competitions, pilots, success stories, MSME intelligence.
2. Incomplete logged-in user: dashboard/profile completion gates and submit-problem denial.
3. Completed member: dashboard, my problems, my competitions, my teams, my submissions, my knowledge/research, my contributions.
4. Submitter: own problem workspace visible; admin metadata not readable.
5. Competition team member: own team/submission visible; evaluations and admin metadata denied.
6. Assigned internal member: assigned execution items visible; unassigned execution/governance denied.
7. Admin: admin dashboards and review workflows available.
8. Super-admin: super-admin-only fallback and destructive controls validated separately.

### Prompt 8B status

- **Pass:** Static rule review found no broad public reads for governance, execution reviews, competition evaluations, contribution review cycles, or companion metadata collections.
- **Pass:** Build/typecheck/lint status is recorded in this PR summary.
- **Needs manual verification:** Persona route smoke tests require Firebase Auth/Firestore seeded accounts and should follow `docs/firestore-rules-test-plan.md`.
