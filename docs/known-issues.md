# Known Issues

| Issue | Severity | Affected files/routes | Suggested next action |
|---|---|---|---|
| Community/discussion code still exists but is hidden from primary navigation. | Medium | `/community`, linked discussion components | Stabilize or remove in a dedicated Community rebuild. |
| Organization and public team directory routes remain future/hidden. | Medium | `/organizations`, `/team`, `/teams` | Define public-safe data model before exposing again. |
| Some legacy admin panel tabs are still implemented behind the admin dashboard but are not promoted in navigation. | Low | `components/admin-panel.tsx` | Split into route-specific admin pages over time. |
| Historical shared documents may still contain migrated sensitive fields until production migration is executed. | Medium | `scripts/migrate-sensitive-fields.ts`, content collections | Dry-run review and Firestore backup/export are required before apply; run apply in production after approval. |
| Repository types include old and new naming for challenges/problem statements and research posts/items. | Medium | `lib/types.ts`, `lib/repositories/firestore.ts` | Plan a non-risky type alias cleanup and database migration separately. |
| `npm run lint` invokes deprecated interactive `next lint` setup because no ESLint configuration is committed. | Low | `package.json`, project lint config | Migrate to ESLint CLI/config in a follow-up. |

## Prompt 8B remaining issues

### Historical sensitive fields in shared documents

- **Severity:** Medium / partially resolved.
- **Risk:** A controlled dry-run/apply migration script now exists, but production Firestore has not been migrated from this repository session. Historical data may remain until operations runs the approved migration.
- **Next action:** Take a Firestore backup/export, run `npm run migrate:sensitive-fields:dry-run`, review all findings, then run `npm run migrate:sensitive-fields:apply` only after approval.

### Legacy type aliases

- **Severity:** Medium.
- **Risk:** `Challenge` remains a compatibility alias for `ProblemStatement` while public labels continue to say “MSME Challenge.” This avoids a risky migration but can still confuse new contributors.
- **Next action:** Keep `ProblemStatement` as the canonical domain type and only use `Challenge` at legacy route/UI boundaries until aliases are retired.

### Firestore rules tests

- **Severity:** Low / partially resolved.
- **Risk:** Emulator tests have been added, but they still require dependency installation and Java/Firebase Emulator availability in CI.
- **Next action:** Run `npm run test:rules` in CI after dependencies are installable.
