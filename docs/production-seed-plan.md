# Production Seed Plan

Production should start clean. Seed only safe baseline operating records, never fake traction, impact, or MSME success claims. Founder-admin manual setup is acceptable for the current launch path: the founder can bootstrap their own account and create the remaining real starter content manually from the website admin interface.

## Current recommendation

- Bootstrap the founder account as `super_admin` first.
- Use the admin UI to create real starter content manually.
- Keep the baseline seed script available, but treat it as optional.
- Do not seed multiple test users or fake personas for the current launch path.

## Allowed starter data

- Governance constitution placeholder or approved current constitution.
- One frozen founding objective target.
- Default MSME onboarding questionnaire template.
- Default contribution score rules clearly labeled non-equity and operational only.
- Optional founding-stage knowledge asset that explains the platform is in launch stage.
- Optional draft/admin-only sample competition, not public.
- Admin-only draft starter content only when it is clearly marked draft and not presented as real activity.

## Disallowed starter data

- Fake impact metrics.
- Fake success stories.
- Fake MSME testimonials or claims.
- Fake MSME records or fake MSME problem statements.
- Fake public success or traction records.
- Public draft/admin-only records.

## Optional scripted baseline seed

Run only after configuring Firebase Admin credentials and only if the founder chooses scripted starter records instead of fully manual setup:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json GOOGLE_CLOUD_PROJECT=<project-id> npm run seed:baseline -- --confirm-baseline-seed
```

For `NODE_ENV=production`, add `--confirm-production-seed`. The script is idempotent and skips existing records unless `--overwrite` is supplied. Do not run production seed apply unless explicitly approved for the target Firebase project.
