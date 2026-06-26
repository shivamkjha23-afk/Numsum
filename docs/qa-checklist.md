# QA Checklist — Prompt 8D Prelaunch Review

Status markers: **Pass**, **Fail**, **Needs Manual Smoke Test**, **Blocked by Environment**, **Not Applicable**.

## Automated/static checks completed in this pass

| Check | Status | Evidence / notes |
|---|---|---|
| Public homepage keeps primary CTA as Submit MSME Challenge. | Pass | Static route/navigation review; primary public nav and footer point to `/submit-problem`. |
| Public navigation includes Community and excludes Organizations, Team Directory, Notifications, broad team pages, demo routes, and `/admin?tab=` links. | Pass | `lib/navigation.ts` contains only public product routes plus admin-only nav. |
| Footer excludes admin/member-only links. | Pass | Footer lists only public-safe pages and Submit MSME Challenge. |
| Public routes `/`, `/about`, `/submit-problem`, `/problem-statements`, `/knowledge`, `/sops`, `/research`, `/competitions`, `/pilots`, `/msme-intelligence` remain public-positioned. | Pass | Static route sweep; hidden/future modules are not linked from primary nav/footer. |
| Admin dashboard cards link to route-based admin pages instead of old `/admin?tab=...` links. | Pass | Static sweep found no `/admin?tab=` links in app/components/lib/docs except checklist history text. |
| Member dashboard has clear sections and no community/social feed widgets. | Pass | Dashboard now emphasizes profile, problems, competitions, teams, submissions, knowledge/research, contributions, recognition, and assigned work. |
| Incomplete-profile users are routed to profile completion before member actions. | Pass | `AuthGate` redirects non-admin incomplete users to `/profile/complete`. Firestore rules coverage remains documented. |
| Admin data is not loaded before AuthGate admin confirmation on `/admin`. | Pass | Admin dashboard data loader is rendered inside `AuthGate adminOnly`. |
| Governance is absent from public navigation and remains admin-only. | Pass | Static navigation and route-gating review. |
| Execution is absent from public navigation and remains admin/assigned-member oriented. | Pass | Static navigation and route-gating review. |
| Contributions are absent from public navigation and remain admin/contributor oriented. | Pass | Static navigation and route-gating review. |
| Mobile overflow risk for dashboards is reduced. | Pass | Dashboard containers/cards use wrapping grids, `min-w-0`, break-word text, and existing admin tables use horizontal scrolling. |
| Typecheck. | Pass | `npm run typecheck` passed. |
| Lint. | Pass | `npm run lint` passed with existing warnings only. |
| Build. | Pass | `npm run build` passed. |
| Rules tests. | Blocked by Environment | `npm run test:rules` could start the Firebase CLI, but the Firestore emulator JAR download failed with HTTP 403 in this environment. CI remains configured in `.github/workflows/qa-security.yml`. |

## Persona route QA

| Persona | Test | Status | Notes |
|---|---|---|---|
| Public visitor | Can access public landing and public libraries. | Pass | Static route review and build success. |
| Public visitor | Cannot access admin routes. | Needs Manual Smoke Test | Required current launch smoke test; client gate and rules are in place. |
| Public visitor | Cannot access member dashboard. | Needs Manual Smoke Test | Requires browser/Auth Firebase session smoke test; client gate is in place. |
| Public visitor | Sees only public-safe data. | Needs Manual Smoke Test | Required privacy smoke test with real or clearly marked draft records; do not seed fake MSME claims. |
| Incomplete profile user | Cannot perform member actions; redirected to profile completion. | Needs Manual Smoke Test | AuthGate/rules implementation reviewed; recommended later with a real test account before broader onboarding. |
| Completed member | Can access `/dashboard`. | Needs Manual Smoke Test | Required current launch smoke test with the founder/member flow or a real member account. |
| Completed member | Cannot access `/admin`. | Needs Manual Smoke Test | Required current launch smoke test with any real non-admin member account; do not seed fake personas. |
| Submitter | Can view own problem workspace. | Needs Manual Smoke Test | Required current launch smoke test using a real founder/member submission or clearly marked draft. |
| Submitter | Cannot view another user's private problem. | Needs Manual Smoke Test | Recommended later before broader public onboarding; keep privacy rule checks documented. |
| Competition team member | Can view own team/submission only. | Needs Manual Smoke Test | Recommended later before broader public onboarding. |
| Assigned internal member | Can view assigned execution items only. | Needs Manual Smoke Test | Recommended later before broader public onboarding. |
| Admin | Can access admin modules and route links. | Needs Manual Smoke Test | Required current launch smoke test with the bootstrapped founder admin account. |
| Super-admin | Can access admin modules and super-admin fallback where supported. | Needs Manual Smoke Test | Recommended later unless the founder is bootstrapped as super-admin; no separate public super-admin module was added. |

## Module QA checklist

| Area | Status | Notes |
|---|---|---|
| Admin Dashboard | Pass | Grouped route cards, loading/error fallback, founding-stage empty states, and route links reviewed. |
| Admin Module Pages | Needs Manual Smoke Test | Routes are admin-gated; founder-admin/manual data needed to verify edit/detail/destructive workflows end-to-end. |
| Member Dashboard | Pass | Community/social widgets removed from the dashboard; sections and empty states clarified. |
| Problem Workspace | Needs Manual Smoke Test | Static review confirms safe tabs/empty states; founder-admin/public/member smoke cases required for final data visibility QA. |
| Public Pages | Pass | Navigation/footer/static copy reviewed; public-safe repository functions remain in use. |
| Competitions | Needs Manual Smoke Test | Full public/member/admin competition QA is recommended later with real or clearly marked draft states. |
| Governance | Needs Manual Smoke Test | Static route gate reviewed; document/amendment edit flows need founder-admin browser QA. |
| Execution | Needs Manual Smoke Test | Assigned member/admin navigation is recommended later with real work items. |
| Contributions | Needs Manual Smoke Test | Score warning reviewed; claim/review/evidence links are recommended later with real contributor/admin records. |
| Mobile / Responsive | Needs Manual Smoke Test | Static layout improvements applied; visual browser testing at mobile/tablet/desktop should be repeated with real or clearly marked draft content. |

## Commands run

- Pass — `npm run typecheck`
- Pass — `npm run lint` (existing warnings only; no lint errors)
- Pass — `npm run build`
- Blocked by Environment — `npm run test:rules` (Firestore emulator JAR download failed with HTTP 403)

## Production deployment readiness

- [ ] Confirm `.env.example` matches all variables used by the app and admin scripts.
- [ ] Confirm Firestore rules tests pass in CI or document the local emulator blocker.
- [ ] Confirm Firestore indexes are deployed before smoke testing production.
- [ ] Confirm public pages render useful empty states with no fake metrics or success stories.
- [ ] Confirm admin bootstrap and optional baseline seed scripts are not run automatically.

## Current launch QA approach

- Founder admin verification is required.
- Public visitor smoke testing is required.
- Founder/member flow smoke testing is required.
- Full multi-persona QA is recommended later before broader public onboarding; do not seed fake users or fake personas for the current launch path.
- Privacy checks remain required: public users cannot access admin routes, logged-in non-admin users cannot access admin routes, private records are not public, and admin metadata is not public.

## Final soft-launch QA additions

- [ ] Verify homepage hero text is visible and the network visual appears below it on desktop.
- [ ] Verify homepage hero text and network visual stack cleanly on mobile with no horizontal overflow.
- [ ] Run the founder admin checklist in `docs/founder-admin-verification.md`.
- [ ] Run the final deployment smoke test in `docs/final-deployment-smoke-test.md`.
- [ ] Confirm no fake seeded users, fake MSME records, fake success stories, fake testimonials, or fake metrics are used in the current launch path.
- [ ] Confirm public content follows `docs/public-content-standard.md`.

## User lifecycle and role assignment update

See [User Lifecycle and Role Management](./user-lifecycle-and-role-management.md) for the canonical signup profile creation flow, profile completion redirect behavior, `user_role_requests` review queue, `/admin/users` role assignment page, and super-admin safety rules.

## Step 7B Community / Discussions QA
- Public can open `/community`, sees only public/open threads, cannot comment without login, and cannot access `/admin/community`.
- Incomplete users are redirected to `/profile/complete` before creating or commenting.
- Completed members can create allowed member discussions and comment on readable open threads.
- Private problem discussions are limited to submitter/assigned/admin users.
- Private team discussions are limited to team members/admin users.
- Admin can access moderation, view reports, and hide/lock/archive/review content.
- Firestore denies public reads of reports, moderation actions, private discussions, and user lists.

## 2026-06-26 manual checks to run before release
1. New Google/email signup creates `users/{uid}`.
2. New user gets roles/default role `member`.
3. New incomplete user redirects to `/profile/complete`.
4. Completed user is not repeatedly redirected.
5. Existing admin keeps `admin` / `super_admin` role.
6. Completed logged-in user at `/community` does not see sign-in CTA.
7. Completed logged-in user at `/community` does not see complete-profile CTA.
8. Public `/competitions` has no permission error.
9. Member `/competitions` has no permission error.
10. Admin `/competitions` has no permission error.
11. Admin competition management remains under `/admin/competitions`.
12. User can create role request.
13. Admin can approve/reject role request.
14. Approved role request updates `UserProfile.role`.
15. Pending role request does not grant access.
16. Admin navigation is grouped and usable.
17. Home hero title/typewriter works on desktop and mobile.

## 2026-06-26 verification pass — auth, roles, competitions, community, navigation

Status markers for this pass: **fixed**, **needs manual verification**, **still broken**, **blocked by environment**.

| Flow | Status | Verification notes |
|---|---|---|
| First-login user document creation | needs manual verification | Static review confirms the documented source of truth remains `users/{uid}` and build/typecheck pass. Browser QA with a new Firebase Auth user is still required to observe the document creation event. |
| Default `member` role assignment | needs manual verification | Firestore rules allow self-created profiles only with safe roles and role requests are not required for member access. Confirm with a new real/staging user. |
| `profileComplete: false` redirects to `/profile/complete` | fixed; needs manual verification | `AuthGate`/route docs and Firestore `isProfileCompleteUser()` gates are aligned. Confirm redirect in browser with an incomplete user. |
| Completed profile returns to dashboard or intended route | needs manual verification | No static regression found; requires browser session and intended-route redirect smoke test. |
| Existing admin role is preserved | fixed; needs manual verification | Self-profile updates cannot change `role`; admin role changes remain admin/super-admin controlled in rules. Confirm with bootstrapped founder admin. |
| Public community visitor state | fixed; needs manual verification | Public/open thread access and sign-in CTA behavior are documented; browser QA with public discussion data is still required. |
| Incomplete community CTA | fixed; needs manual verification | Posting/commenting require completed profile in rules; confirm complete-profile CTA in browser. |
| Completed member community participation | needs manual verification | Rule path supports completed members; needs browser create/comment smoke test. |
| Admin community moderation | needs manual verification | `/admin/community` is included in the built route list and rules protect reports/moderation actions; verify with admin account and moderation records. |
| Community stale auth/profile state | needs manual verification | No type/build regression found; stale-state behavior requires repeated sign-in/sign-out browser QA. |
| Public `/competitions` | fixed; needs manual verification | Public route builds and repository/rules review confirms public-safe competition reads only. Confirm no permission error in browser. |
| Member `/competitions` | fixed; needs manual verification | Member-visible competition reads are allowed by rules. Confirm no permission error with completed member account. |
| Admin `/competitions` | fixed; needs manual verification | Admin route `/admin/competitions` builds and admin reads are rule-authorized. Confirm no permission error with founder admin. |
| Public competition data minimization | fixed | Static/rules review confirms public competition reads do not grant submissions, evaluations, or admin metadata. |
| Admin competition management route | fixed | Build output includes `/admin/competitions` and `/admin/competitions/[id]`; public `/competitions` remains separate. |
| Basic member approval not required | fixed; needs manual verification | Role request creation is limited to elevated roles; confirm no basic-member request is created during signup. |
| RoleRequest only elevated roles | fixed | Firestore rules require `elevatedUserRole(requestedRole)` for role request creation. |
| Pending role request grants no permission | fixed | `UserProfile.role` remains the permission source of truth; request documents are workflow records only. |
| Approval updates `UserProfile.role` | needs manual verification | Requires admin UI smoke test with a request record. |
| Rejection leaves `UserProfile.role` unchanged | needs manual verification | Requires admin UI smoke test with a request record. |
| User can see own request status | fixed; needs manual verification | Rules allow request reads by owner; confirm UI status display with a seeded/real request. |
| Admin can manage all role requests | fixed; needs manual verification | Rules allow platform admins to read/update/delete role requests; confirm in `/admin/users`. |
| Grouped admin navigation | fixed; needs manual verification | Route map documents grouped admin navigation. Verify desktop and mobile menus in browser. |
| No broken admin links | fixed; needs manual verification | `npm run build` generated all admin routes successfully; click-through browser QA remains recommended. |
| Non-admin cannot see admin nav | fixed; needs manual verification | Admin navigation is auth/role gated in implementation and rules; confirm with non-admin account. |
| Mobile admin navigation | needs manual verification | Static docs/build pass; requires viewport/device smoke test. |
| Home hero title/typewriter | fixed; needs manual verification | Home route builds; visual rotation requires browser QA. |
| Home CTA buttons | fixed; needs manual verification | Route map confirms CTAs. Click-through browser QA still required. |
| Menu/dropdown over hero readability | needs manual verification | Admin navigation grouping reduces risk; visual browser QA remains required. |

### Security review status from this pass

| Area | Status | Notes |
|---|---|---|
| Public pages use public-safe queries | fixed | Static review of route intent, Firestore rules, and build output found no public grants for private/admin collections. |
| Member pages do not expose private records | fixed; needs manual verification | Rules limit private reads to owners/assigned/team/admin; browser QA with cross-user seeded data remains required. |
| Admin metadata remains admin-only | fixed | `problem_admin_metadata`, `onboarding_admin_metadata`, `pilot_admin_metadata`, `competition_submission_admin_metadata`, and contribution review metadata are admin-only in rules. |
| `role_requests` protected | fixed | Owner reads and admin management are allowed; creation requires elevated requested role and current role match. |
| Competition submissions/evaluations protected | fixed | Public cannot read submissions or evaluations; evaluations are admin-only. |

### Commands run in this pass

- Pass — `npm run typecheck`
- Pass — `npm run lint` (12 existing warnings, 0 errors)
- Pass — `npm run build` (build completed; same lint warnings surfaced during build)
- Blocked by Environment — `npm run test:rules` (Firestore emulator JAR download failed with HTTP 403 after emulator startup)
