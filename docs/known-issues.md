# Known Issues

| Issue | Severity | Affected files/routes | Suggested next action |
|---|---|---|---|
| Community/discussion code still exists but is hidden from primary navigation. | Medium | `/community`, linked discussion components | Stabilize or remove in a dedicated Community rebuild. |
| Organization and public team directory routes remain future/hidden. | Medium | `/organizations`, `/team`, `/teams` | Define public-safe data model before exposing again. |
| Some legacy admin panel tabs are still implemented behind the admin dashboard but are not promoted in navigation. | Low | `components/admin-panel.tsx` | Split into route-specific admin pages over time. |
| Firestore cannot hide individual internal note fields after document read is allowed. | High | `firestore.rules`, content collections | Move admin/internal notes to admin-only metadata documents/subcollections before broad publication. |
| Repository types include old and new naming for challenges/problem statements and research posts/items. | Medium | `lib/types.ts`, `lib/repositories/firestore.ts` | Plan a non-risky type alias cleanup and database migration separately. |
| `npm run lint` invokes deprecated interactive `next lint` setup because no ESLint configuration is committed. | Low | `package.json`, project lint config | Migrate to ESLint CLI/config in a follow-up. |
