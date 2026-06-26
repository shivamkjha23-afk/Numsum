# Vercel Deployment

Recommended path: deploy the Next.js app on Vercel and use Firebase for Auth/Firestore.

## Project import

Import the GitHub repository into Vercel. Framework preset should auto-detect Next.js.

## Build settings

- Install command: `npm install --no-audit --no-fund`
- Build command: `npm run build`
- Output framework: Next.js / Vercel default
- Node version: 22.x to match CI
- Production branch: `main`

## Environment variables

Configure all required `NEXT_PUBLIC_FIREBASE_*` variables from `.env.example` for Preview and Production. Do not add Firebase Admin private keys to Vercel unless a server-only operational function explicitly requires them; current admin scripts are manual and should use local operator credentials instead.

## Preview deployments

Preview deployments may use staging Firebase config. Add approved preview domains to Firebase Auth authorized domains if login is required.

## Production deployment

Deploy after typecheck, lint, build, rules tests, Firestore rules deployment, and Firestore indexes deployment pass.

## Custom domain

Add the custom domain in Vercel, update DNS, then add the domain to Firebase Authentication authorized domains.

## Common errors

- Missing `NEXT_PUBLIC_FIREBASE_*`: app builds with placeholders but runtime auth/data will not work.
- Auth domain not authorized: login popups/redirects fail until the deployment domain is added in Firebase Auth settings.
- Firestore `FAILED_PRECONDITION`: deploy missing indexes.
- Firestore `permission-denied`: verify rules, profile completion, and user role.
