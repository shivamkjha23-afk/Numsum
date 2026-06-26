# Route Map

Current route inventory for the NumSum Labs website stabilization pass.

| Route | Module | Access | Status | In navigation | Known issue |
|---|---|---|---|---|---|
| /admin/competitions/[id] | Admin | admin | active | yes |  |
| /admin/competitions | Admin | admin | active | yes |  |
| /admin/contributions/[id] | Admin | admin | active | yes |  |
| /admin/contributions | Admin | admin | active | yes |  |
| /admin/contributions/review-cycles | Admin | admin | active | yes |  |
| /admin/contributions/score-rules | Admin | admin | active | yes |  |
| /admin/execution | Admin | admin | active | yes |  |
| /admin/governance/amendments/new | Admin | admin | active | yes |  |
| /admin/governance/amendments | Admin | admin | active | yes |  |
| /admin/governance/documents/[id] | Admin | admin | active | yes |  |
| /admin/governance/documents | Admin | admin | active | yes |  |
| /admin/governance | Admin | admin | active | yes |  |
| /admin/knowledge | Admin | admin | active | yes |  |
| /admin/meetings/[id] | Admin | admin | active | yes |  |
| /admin/meetings | Admin | admin | active | yes |  |
| /admin/objectives/[id] | Admin | admin | active | yes |  |
| /admin/objectives | Admin | admin | active | yes |  |
| /admin | Admin | admin | active | yes |  |
| /admin/pilots | Admin | admin | active | yes |  |
| /admin/problems | Admin | admin | active | yes |  |
| /admin/questionnaires | Admin | admin | active | yes |  |
| /admin/research | Admin | admin | active | yes |  |
| /admin/research/watch | Admin | admin | active | yes |  |
| /admin/sops | Admin | admin | active | yes |  |
| /admin/system-health | Admin | admin | active | yes |  |
| /auth-required | Public | public | active | no |  |
| /careers | Public | public | active | no |  |
| /challenges | Public | public | deprecated | no | Legacy/demo alias; keep out of primary navigation. |
| /community/[id] | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |
| /community/new | Public | member | future/hidden | no | Hidden until module is intentionally stabilized. |
| /community | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |
| /competitions/[id]/join | Public | public | active | no |  |
| /competitions/[id] | Public | public | active | no |  |
| /competitions/manufacturing-sprint/join | Public | public | deprecated | no | Legacy/demo alias; keep out of primary navigation. |
| /competitions | Public | public | active | yes |  |
| /dashboard/competitions | Member | member | active | yes |  |
| /dashboard/competitions/submissions | Member | member | active | yes |  |
| /dashboard/competitions/teams | Member | member | active | yes |  |
| /dashboard/contributions | Member | member | active | yes |  |
| /dashboard | Member | member | active | yes |  |
| /join | Public | public | active | no |  |
| /knowledge/[id] | Public | public | active | no |  |
| /knowledge | Public | public | active | no |  |
| /msme-intelligence | Public | public | active | yes |  |
| /notifications | Member | member | future/hidden | no | Hidden until module is intentionally stabilized. |
| /organizations/[id] | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |
| /organizations/dashboard | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |
| /organizations | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |
| / | Public | public | active | yes |  |
| /pilots/[id] | Public | public | active | no |  |
| /pilots | Public | public | active | yes |  |
| /problem-statements/[id] | Public | public | active | no |  |
| /problem-statements/my | Public | member | active | yes |  |
| /problem-statements | Public | public | active | yes |  |
| /profile/complete | Public | public | active | no |  |
| /profile | Member | member | active | yes |  |
| /research | Public | public | active | yes |  |
| /research/upload | Public | member | active | yes |  |
| /settings | Member | member | active | no |  |
| /sign-in | Public | public | active | no |  |
| /sops | Public | public | active | no |  |
| /submit-challenge | Public | public | deprecated | no | Legacy/demo alias; keep out of primary navigation. |
| /submit-problem | Public | public | active | yes |  |
| /team | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |
| /teams/create | Public | public | active | no |  |
| /teams | Public | public | future/hidden | no | Hidden until module is intentionally stabilized. |

## Prompt 8B hidden/future route handling

| Route / area | Status | Prompt 8B handling |
| --- | --- | --- |
| `/community` and discussion creation | Active | Public-safe listing shows only public/open moderated threads; posting requires completed member profile. |
| `/organizations` | Hidden/future/admin-managed | Public organization directory is not enabled; Firestore organization reads remain admin-only. |
| Public team directory / team members | Hidden/future | Firestore `team_members` reads remain admin-only until a public team directory is reviewed for privacy. |
| `/notifications` | Member utility/future polish | Keep behind authenticated user-specific reads; do not expose in public navigation. |
| Old challenge aliases | Legacy | `ProblemStatement` is canonical; public label may remain “MSME Challenge”; Firestore `/challenges` legacy collection is admin-only. |
| Manufacturing sprint/demo routes | Demo/future | Keep out of primary navigation unless explicitly converted to production routes. |
| Upload/demo routes | Limited utility | Research upload stays authenticated and review-gated; no public file upload surface is enabled. |

## Public positioning routes
- `/` — Public landing page for NumSum Labs with problem-first MSME positioning, public-safe metrics, public highlights, and CTAs.
- `/about` — Public NumSum Labs positioning and institutional mission page.
- `/problem-statements` — Public approved MSME challenges.
- `/submit-problem` — Auth/profile-complete protected MSME challenge intake.
- `/research`, `/knowledge`, `/sops` — Public approved knowledge, research, and SOP resources.
- `/competitions` — Public MSME innovation challenges.
- `/pilots` — Public approved pilot and impact records.

## Prompt 8D route sweep notes

- No production links should use old `/admin?tab=...` destinations; admin dashboard cards point to route-based admin pages.
- Public navigation remains limited to `/`, `/submit-problem`, `/problem-statements`, `/msme-intelligence`, `/research`, `/competitions`, `/pilots`, and `/about`.
- Public footer remains limited to public-safe routes and excludes admin/member-only pages.
- Organizations, Notifications, broad team-directory routes, and demo challenge aliases remain hidden/future or deprecated and are not deployment-readiness blockers while unlinked from primary navigation.
- `/dashboard` is the canonical member hub; competition team/submission and contribution pages stay authenticated member routes.

## Final soft-launch route notes

- `/admin` and the listed admin module routes must be verified with the real founder admin account before soft launch.
- Public/incognito users and logged-in non-admin users must be blocked from `/admin`.
- Hidden/future routes for Organizations, Notifications, and public team directory remain outside the public launch path.
- After Step 7B, next enhancements can deepen private discussion integrations without adding notifications or social-feed features.

## User lifecycle and role assignment update

See [User Lifecycle and Role Management](./user-lifecycle-and-role-management.md) for the canonical signup profile creation flow, profile completion redirect behavior, `user_role_requests` review queue, `/admin/users` role assignment page, and super-admin safety rules.

## Step 7B Community / Discussions Routes
- `/community` — public-safe community listing for public/open threads only.
- `/community/[id]` — public thread detail by slug; restricted/private states show a blocked page without leaking content.
- `/community/new` — completed-member discussion creation flow.
- `/dashboard/discussions` — member discussion dashboard and empty state.
- `/admin/community` — admin community moderation dashboard.

## 2026-06-26 route behavior updates
- `/profile/complete` is the mandatory redirect target for newly signed-in users whose `users/{uid}.profileComplete` is false. Completed users are not repeatedly redirected.
- `/community` now separates visitor, incomplete-user, complete-member, and admin moderation states from the auth/profile source of truth.
- `/competitions` remains public and uses public-safe competition reads only. Admin competition management remains under `/admin/competitions`.
- Admin navigation is grouped into Platform, MSME Problem Pipeline, Knowledge & Research, Pilots & Impact, Competitions, Governance & Objectives, Operations, and People & Access.
- Home hero uses the restored rotating title phrases and preserves the Submit MSME Challenge, Explore MSME Challenges, and Explore Knowledge & Research CTAs.

## 2026-06-26 verification pass — route/navigation status

| Route/navigation area | Status | Notes |
|---|---|---|
| `/profile/complete` first-login redirect target | fixed; needs manual verification | Route exists and is documented as mandatory for incomplete profiles; verify in browser with a new user. |
| `/dashboard` or intended-route return after completion | needs manual verification | Requires authenticated browser flow. |
| `/community` | fixed; needs manual verification | Public route builds and is documented as public-safe; verify public/incomplete/member/admin states with seeded discussion data. |
| `/admin/community` | fixed; needs manual verification | Route builds as admin module; verify moderation UI with admin account. |
| `/competitions` | fixed; needs manual verification | Public route builds separately from admin management and should use public-safe records; verify public/member/admin no-permission-error cases. |
| `/admin/competitions` and `/admin/competitions/[id]` | fixed; needs manual verification | Build output includes both admin management routes; verify admin click-through and data loading. |
| `/admin/users` role request management | fixed; needs manual verification | Build output includes the route; approve/reject workflows need admin browser QA. |
| Admin navigation grouping | fixed; needs manual verification | Group names remain Platform, MSME Problem Pipeline, Knowledge & Research, Pilots & Impact, Competitions, Governance & Objectives, Operations, and People & Access; verify mobile menu interactions. |
| Home hero CTAs | fixed; needs manual verification | Expected CTAs remain Submit MSME Challenge, Explore MSME Challenges, and Explore Knowledge & Research; verify click-through and readability in browser. |
