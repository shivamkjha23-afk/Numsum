# Known Issues

| Issue | Severity | Affected files/routes | Suggested next action |
|---|---|---|---|
| Community/discussion code still exists but is hidden from primary navigation. | Medium | `/community`, linked discussion components | Stabilize or remove in a dedicated Community rebuild. |
| Organization and public team directory routes remain future/hidden. | Medium | `/organizations`, `/team`, `/teams` | Define public-safe data model before exposing again. |
| Some legacy admin panel tabs are still implemented behind the admin dashboard but are not promoted in navigation. | Low | `components/admin-panel.tsx` | Split into route-specific admin pages over time. |
| Historical shared documents may still contain migrated sensitive fields if real data is introduced before migration. | Low now / High before launch | `scripts/migrate-sensitive-fields.ts`, content collections | Current data is mostly blank/test/junk, so migration is optional now; revisit backup/migration policy before public launch with real user data. |
| Repository types include old and new naming for challenges/problem statements and research posts/items. | Medium | `lib/types.ts`, `lib/repositories/firestore.ts` | Plan a non-risky type alias cleanup and database migration separately. |
| `npm run lint` invokes deprecated interactive `next lint` setup because no ESLint configuration is committed. | Low | `package.json`, project lint config | Migrate to ESLint CLI/config in a follow-up. |

## Prompt 8B remaining issues

### Historical sensitive fields in shared documents

- **Severity:** Low for the current blank/test/junk project state; High before any public launch with real user data.
- **Risk:** A controlled dry-run/apply migration script exists and remains available, but current data does not need recovery.
- **Next action:** Prefer a clean dev/staging data reset now. Before real launch, revisit backup/export and migration policy, run `npm run migrate:sensitive-fields:dry-run`, review findings, and only then consider `npm run migrate:sensitive-fields:apply`.

### Legacy type aliases

- **Severity:** Medium.
- **Risk:** `Challenge` remains a compatibility alias for `ProblemStatement` while public labels continue to say “MSME Challenge.” This avoids a risky migration but can still confuse new contributors.
- **Next action:** Keep `ProblemStatement` as the canonical domain type and only use `Challenge` at legacy route/UI boundaries until aliases are retired.

### Firestore rules tests

- **Severity:** Low / partially resolved.
- **Risk:** Emulator tests cover public, incomplete-profile, completed-member, submitter, team, assigned internal, admin, and super-admin access. They still require dependency installation and Java/Firebase Emulator availability in CI.
- **Next action:** Keep `npm run test:rules` in the QA security workflow and update cases when rules change.

### Development data reset

- **Severity:** Low when limited to dev/staging/test.
- **Risk:** Reset tooling is destructive if pointed at the wrong project.
- **Next action:** Use `docs/dev-data-reset.md`; never run reset tooling against production or real user data.

### Profile completion enforcement

- **Severity:** Resolved in Firestore rules for practical member create paths.
- **Risk:** Client-side AuthGate alone was insufficient.
- **Next action:** Maintain `isProfileCompleteUser()` checks and emulator denial tests for incomplete users.
