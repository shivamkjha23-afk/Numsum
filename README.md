# NumSum

NumSum is a Next.js/Firebase platform for collecting MSME problem statements, publishing public-safe challenges, coordinating member participation, moderating community knowledge, and giving admins a structured operating workspace.

## Role model

NumSum uses only these platform roles:

- **Public**: unauthenticated visitors. Can browse public pages, challenges, case studies, and community content.
- **Member**: signed-in users with a profile. Completed members can submit problems, participate in challenges, submit solutions, post/comment/upvote where allowed, and view their dashboard.
- **Admin**: operational staff. Can manage MSME owners, problems, questionnaires, challenges, reviews, case studies, community moderation, and system health.
- **Super admin**: trusted operator. Has all admin permissions and can assign or remove `admin` / `super_admin` roles from `/admin/users`.

Profile/persona types are profile metadata, not auth roles. There is no public role-request flow, admin-application flow, member self-promotion, or active UI path for requesting elevated permissions.

## Phase 1 features

Public/member features include:

- Public homepage, MSME positioning, about page, challenge listing/detail pages, case studies, and community browsing.
- Member profile completion and dashboard.
- Problem submission and member problem tracking.
- Challenge participation, team setup, invitations, and solution submission.
- Community posting/commenting/upvoting for completed members.
- MOM viewing for visible meeting notes; users print the web page with **Print / Save as PDF**.

## Phase 2 features

Admin/super-admin features include:

- Admin dashboard and system health.
- MSME owner and problem review workspaces.
- Questionnaire template management.
- Challenge lifecycle management, submissions, evaluation, and result declaration.
- Review moderation, case study management, and community moderation.
- Super-admin user and role assignment by membership ID.

## Route map

### Public

- `/`
- `/for-msmes`
- `/about`
- `/challenges`
- `/case-studies`
- `/community`

### Member

- `/dashboard`
- `/profile`
- `/profile/complete`
- `/submit-problem`
- `/dashboard/problems`
- `/dashboard/challenges`

### Admin

- `/admin`
- `/admin/msme-owners`
- `/admin/problems`
- `/admin/questionnaires`
- `/admin/challenges`
- `/admin/reviews`
- `/admin/case-studies`
- `/admin/community`
- `/admin/system-health`

### Super admin

- `/admin/users`

### Compatibility redirects

- `/competitions` redirects to `/challenges`.
- `/admin/competitions` redirects to `/admin/challenges`.
- Existing detail/join competition aliases redirect to the matching challenge routes and should not be linked from active UX.

## Local setup

```bash
npm install
cp .env.example .env.local
# Fill in Firebase Web config values in .env.local.
npm run dev
```

Recommended validation before handoff/deploy:

```bash
npm run lint
npm run typecheck
npm run build
```

Run these commands sequentially. `npm run typecheck` includes generated `.next/types`; running it concurrently with `next build` can produce transient missing `.next/types` errors while Next regenerates that directory.

## Environment variables

Required client variables:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Optional client variable:

- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` for Analytics only.

Server/operator variables for Firebase Admin scripts:

- `GOOGLE_APPLICATION_CREDENTIALS`
- `GOOGLE_CLOUD_PROJECT` / `GCLOUD_PROJECT` / `FIREBASE_PROJECT_ID`
- `FIRESTORE_EMULATOR_HOST` and `FIREBASE_AUTH_EMULATOR_HOST` for local emulator rehearsal.

NumSum does **not** require Firebase Storage for MOM/PDF. Meeting notes are stored as structured Firestore data, viewed as web pages, and converted by the browser using Print / Save as PDF. No permanent PDF file storage is used.

## Firebase readiness

This repository includes deployment-ready Firestore config:

- `firebase.json` points to `firestore.rules` and `firestore.indexes.json`.
- `firestore.rules` enforces public/member/admin/super-admin access and disables deprecated role-request/admin-application writes.
- `firestore.indexes.json` contains composite indexes for current public, member, admin, challenge, community, governance, execution, and contribution queries.

Deploy Firestore rules/indexes:

```bash
firebase deploy --only firestore:rules,firestore:indexes --project <project-id>
```

Optional local rules rehearsal:

```bash
npm run test:rules
```

## Admin bootstrap and role assignment

There is no public role request flow and no member self-promotion. To create or confirm the first super admin, use a Firebase Admin credential outside the repo and run:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json \
GOOGLE_CLOUD_PROJECT=<project-id> \
npm run admin:bootstrap -- --email "founder@example.com" --role super_admin --confirm-admin-bootstrap
```

You can also target an existing Firebase Auth UID:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json \
GOOGLE_CLOUD_PROJECT=<project-id> \
npm run admin:bootstrap -- --uid "firebase-auth-uid" --role super_admin --confirm-admin-bootstrap
```

After the first `super_admin` exists, sign in and use `/admin/users` to find users by membership ID, make/remove admins, deactivate/reactivate accounts, or confirm another super admin.

## Vercel deployment notes

1. Create a Vercel project connected to this repository.
2. Add the required `NEXT_PUBLIC_FIREBASE_*` variables for Preview and Production.
3. Do not add Firebase Admin private keys to Vercel unless a future server-only function explicitly requires them; current admin scripts are manual operator tasks.
4. Deploy Firestore rules/indexes before demoing data writes.
5. Run `npm run build` locally or in CI before promoting production.

## Seed/demo data

- `npm run seed:baseline -- --confirm-baseline-seed` creates safe baseline records only; it does not create unsafe roles.
- Use staging or the Firestore emulator before any production seed.
- Demo/fallback content is public-safe and should not be treated as real MSME activity unless explicitly replaced with approved records.

## Known non-blocking warnings

Current validation can report existing low-risk warnings:

- React hook dependency warnings in several dense legacy client components.
- One conditional-hook lint warning in an internal execution admin component.
- One `@next/next/no-img-element` suggestion in `components/team-manager.tsx`.
- One PostCSS anonymous default export warning.

These warnings do not block the production build, but should be cleaned in a future refactor pass.
