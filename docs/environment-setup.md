# Environment Setup

This project uses the Firebase Web SDK in the Next.js app and the Firebase Admin SDK only for explicit local/operational scripts. Production secrets must be configured in the deployment platform, not committed.

## Required browser-safe variables

The app reads these variables in `lib/firebase.ts`. They must use the `NEXT_PUBLIC_` prefix because the Firebase client SDK runs in the browser.

| Variable | Required | Public? | Purpose |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Yes | Safe as public | Firebase Web API key for the selected project. Restrict it in Google Cloud where practical. |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Yes | Safe as public | Firebase Auth domain, usually `<project-id>.firebaseapp.com`. |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Yes | Safe as public | Firebase project used by Firestore/Auth. |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Yes | Safe as public | Firebase app sender ID. |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Yes | Safe as public | Firebase Web app ID. |

`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` and `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` are optional and should be configured only when Storage or Analytics is intentionally enabled.

## Server-only variables

Never expose these with `NEXT_PUBLIC_` and never commit real values:

| Variable | Required | Purpose |
| --- | --- | --- |
| `GOOGLE_APPLICATION_CREDENTIALS` | Required for admin scripts against real Firebase projects | Absolute path to an uncommitted Firebase Admin service-account JSON file. |
| `GOOGLE_CLOUD_PROJECT` / `GCLOUD_PROJECT` | Required for some Admin SDK/emulator flows | Project ID used by Firebase Admin and emulator tooling. |
| `FIRESTORE_EMULATOR_HOST` | Optional local/testing | Directs Admin SDK and tests to the local Firestore emulator. |
| `FIREBASE_AUTH_EMULATOR_HOST` | Optional local/testing | Directs Auth SDK/Admin tests to the local Auth emulator if used. |

## Local development

1. Copy `.env.example` to `.env.local`.
2. Create/select a Firebase development project.
3. Register a Web app in Firebase Console and copy its config into `.env.local`.
4. Enable Authentication providers needed for local testing.
5. Run `npm install --no-audit --no-fund`.
6. Run `npm run dev`.
7. For rules tests, ensure Java is installed and run `npm run test:rules`.

## Staging setup

Use a separate Firebase project from production. Configure the same `NEXT_PUBLIC_FIREBASE_*` variables in the staging deployment environment. Use a staging-only service account for admin scripts and store it outside the repository.

## Production setup

1. Create/select the production Firebase project.
2. Register the production Web app and configure production `NEXT_PUBLIC_FIREBASE_*` values in the deployment platform.
3. Configure Auth authorized domains for the production URL and any preview domains that should support login.
4. Store Admin SDK credentials only as a secure operator secret or local uncommitted file for manual scripts.
5. Deploy Firestore rules and indexes before launch.

## Admin script safety

Admin scripts must be run manually. They require explicit flags and Firebase Admin credentials. Prefer testing against staging or the Firestore emulator before production. Do not store service-account JSON files in the repo and do not add Firebase private keys to `NEXT_PUBLIC_*` variables.
