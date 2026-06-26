# Firestore Indexes

`firestore.indexes.json` contains composite indexes for repository queries that combine equality filters, `in`, `array-contains`, and sort clauses across the major production modules.

## How indexes were identified

The audit searched repository query builders for `where(...)`, `orderBy(...)`, `array-contains`, `in`, and common dashboard count patterns. Composite indexes were added for public visibility/status queries, per-user lists ordered by creation date, linked entity lookups, governance/version history, execution/action ownership, competitions, and contribution records.

## Deploy

```bash
firebase deploy --only firestore:indexes
```

Deploy indexes before production smoke testing. Some indexes may take several minutes to build.

## Known index errors

Firestore errors usually include a direct Console link to create the missing index. If a query fails with `FAILED_PRECONDITION: The query requires an index`, either add the suggested index to `firestore.indexes.json` and redeploy or create it in the console and export it back into the file.

## Adding new indexes

1. Reproduce the failing query in staging.
2. Open the Firebase Console link from the error.
3. Verify the collection, fields, and sort directions.
4. Add the index to `firestore.indexes.json`.
5. Run `firebase deploy --only firestore:indexes`.
6. Document any new module-specific query pattern here.
