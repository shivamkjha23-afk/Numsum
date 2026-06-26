# CI/CD

The repository uses `.github/workflows/qa-security.yml` for pull requests and pushes to `main`.

## Workflow coverage

1. Checkout repository.
2. Setup Node 22.
3. Setup Java 17 for Firebase Emulator.
4. Install dependencies with `npm install --no-audit --no-fund`.
5. Run `npm run typecheck`.
6. Run `npm run lint`.
7. Run `npm run build`.
8. Run `npm run test:rules`.

The workflow does not run production migrations, Firestore dev reset apply, admin bootstrap, or baseline seed scripts.

## Required dependencies

Node 22, npm, Java 17, Firebase CLI, and the Firestore emulator are required for full CI parity.

## Known warnings/blockers

Local rules tests may fail if Java or emulator ports are unavailable. CI installs Java and should run the emulator through `firebase emulators:exec`.

## Reading failures

- TypeScript failures indicate invalid app or script types.
- Lint failures indicate style or Next.js/React issues.
- Build failures often indicate missing environment handling or route/runtime errors.
- Rules test failures indicate a security regression and must be fixed before merge.

## Merge requirement

Before merge, typecheck, lint, build, and rules tests should pass in CI. Production-destructive scripts must remain manual-only and flag-gated.
