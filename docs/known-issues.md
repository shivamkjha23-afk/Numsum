# Known Issues

## Critical before deployment

No unresolved critical deployment blockers are known after the final soft-launch readiness pass if typecheck, lint, build, founder-admin verification, and public/private smoke tests pass. Typecheck, lint, and build pass locally. Firestore rules tests are blocked in this container because the `firebase` CLI executable is unavailable, while CI remains configured to install dependencies, set up Java, and run `npm run test:rules`. Re-open this section immediately if a security/privacy regression, build failure, broken public route, or broken admin auth issue is found during seeded browser QA.

## Important before launch

| Issue | Affected files/routes | Suggested next action |
|---|---|---|
| Manual real-account QA is still required for founder, public/incognito, and non-admin privacy checks; seeded fake users are not part of the current launch path. | Public/member/admin routes | Create seeded public/private records and accounts for public, incomplete member, completed member, submitter, competition team member, assigned internal member, admin, and super-admin. |
| Firestore composite indexes may be required by production data shape. | Firestore queries in repository helpers | Capture Firebase index prompts during seeded QA and commit/index deploy definitions before launch. |
| CI rules tests depend on Firebase emulator/Java availability. | `.github/workflows/qa-security.yml`, `tests/firestore-rules` | Keep workflow configured and monitor CI environment availability. |
| Production environment setup remains operator-owned. | Firebase project, environment variables, hosting | Verify production Firebase config, auth providers, domains, backups, security rules, and deploy target. |
| Historical sensitive-field migration must be reviewed before real data launch. | `scripts/migrate-sensitive-fields.ts` | Run dry-run with backup/export policy before considering apply; do not run apply during routine QA. |
| CI dependency installs are not deterministic until a lockfile is committed. | `.github/workflows/qa-security.yml`, `package.json` | Commit `package-lock.json` in a dedicated dependency-maintenance change and switch CI to deterministic install. |
| Repository types include old and new naming for challenges/problem statements and research posts/items. | `lib/types.ts`, `lib/repositories/firestore.ts` | Plan a non-risky alias cleanup later; keep current compatibility for launch. |

## Later

| Issue / future module | Notes |
|---|---|
| Community/Discussions | Code exists but remains hidden from primary navigation; do not expose until intentionally rebuilt and privacy-reviewed. |
| Organizations | Public organization directory remains hidden/future. |
| Notifications | Member utility remains hidden/future. |
| Public team directory | Keep hidden until a public-safe data model is reviewed. |
| Testimonial submission workflow | Display only approved/public stories until a moderated submission flow is built. |
| Emulator test expansion | Add more seeded rule cases as modules stabilize. |
| Historical migration for future real data | Revisit when real user data exists or before production launch. |

## Production readiness notes

- Production Firebase rules and indexes must be deployed manually; CI validates rules but does not deploy.
- The baseline seed script is manual-only and flag-gated. It must not be run as part of CI.
- Public pages are expected to show founding-stage empty states until real approved data exists; do not publish fake impact metrics or success stories.

## Final soft-launch notes

- Homepage hero layout has been corrected so hero copy appears above the network visual. Recheck in the deployed site on desktop and mobile.
- Founder-admin verification and final deployment smoke testing are now explicit launch gates.
- First real data should be created manually from the admin UI; fake seeded users, fake MSME data, fake testimonials, fake success stories, and fake metrics remain prohibited.
- Full multi-persona QA is deferred until broader onboarding, after soft-launch access boundaries are verified.
