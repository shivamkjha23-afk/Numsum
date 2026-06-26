# QA Checklist — Prompt 8D Prelaunch Review

Status markers: **Pass**, **Fail**, **Needs Manual Smoke Test**, **Blocked by Environment**, **Not Applicable**.

## Automated/static checks completed in this pass

| Check | Status | Evidence / notes |
|---|---|---|
| Public homepage keeps primary CTA as Submit MSME Challenge. | Pass | Static route/navigation review; primary public nav and footer point to `/submit-problem`. |
| Public navigation excludes Community, Organizations, Team Directory, Notifications, broad team pages, demo routes, and `/admin?tab=` links. | Pass | `lib/navigation.ts` contains only public product routes plus admin-only nav. |
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
