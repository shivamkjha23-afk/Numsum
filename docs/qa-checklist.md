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
