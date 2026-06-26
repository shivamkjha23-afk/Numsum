# Known Issues

| Issue | Severity | Affected files/routes | Suggested next action |
|---|---|---|---|
| Community/discussion code still exists but is hidden from primary navigation. | Medium | `/community`, linked discussion components | Stabilize or remove in a dedicated Community rebuild. |
| Organization and public team directory routes remain future/hidden. | Medium | `/organizations`, `/team`, `/teams` | Define public-safe data model before exposing again. |
| Some legacy admin panel tabs are still implemented behind the admin dashboard but are not promoted in navigation. | Low | `components/admin-panel.tsx` | Split into route-specific admin pages over time. |
| Firestore cannot hide individual internal note fields after document read is allowed. | High | `firestore.rules`, content collections | Move admin/internal notes to admin-only metadata documents/subcollections before broad publication. |
| Repository types include old and new naming for challenges/problem statements and research posts/items. | Medium | `lib/types.ts`, `lib/repositories/firestore.ts` | Plan a non-risky type alias cleanup and database migration separately. |
| `npm run lint` invokes deprecated interactive `next lint` setup because no ESLint configuration is committed. | Low | `package.json`, project lint config | Migrate to ESLint CLI/config in a follow-up. |

## Prompt 8B remaining issues

### Historical sensitive fields in shared documents

- **Severity:** High until migration is completed.
- **Risk:** Prompt 8B prevents new high-risk notes from being written to shared documents through hardened repository functions and Firestore rules, but historical Firestore documents may still contain `adminNotes`, `internalNotes`, `adminInternalNotes`, or `reviewNotes` in collections that have submitter/member/public read paths.
- **Next action:** Run a backed-up admin migration to move historical sensitive fields into `problem_admin_metadata`, `onboarding_admin_metadata`, `pilot_admin_metadata`, `competition_submission_admin_metadata`, and `contribution_review_metadata`, then delete the fields from the shared documents.

### Legacy type aliases

- **Severity:** Medium.
- **Risk:** `Challenge` remains a compatibility alias for `ProblemStatement` while public labels continue to say “MSME Challenge.” This avoids a risky migration but can still confuse new contributors.
- **Next action:** Keep `ProblemStatement` as the canonical domain type and only use `Challenge` at legacy route/UI boundaries until aliases are retired.

### Firestore rules tests

- **Severity:** Medium.
- **Risk:** No automated Firestore emulator rules test suite exists yet.
- **Next action:** Convert `docs/firestore-rules-test-plan.md` into emulator tests with seeded public/member/submitter/team/admin personas.
