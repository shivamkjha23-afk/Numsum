# Deployment

1. Create a Firebase project with Authentication and Firestore enabled.
2. Copy `.env.example` to `.env.local` and fill all public Firebase web app variables.
3. Run `npm install`.
4. Run `npm run typecheck` and `npm run build`.
5. Seed development data with `npm run seed` if desired.
6. Deploy to Firebase Hosting using the Firebase CLI and the Next.js hosting integration.

The application is designed for RBAC and multi-organization growth through `tenantId`, role mappings and collection-level security rules.
