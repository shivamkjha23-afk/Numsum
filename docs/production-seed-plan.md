# Production Seed Plan

Production should start clean. Seed only safe baseline operating records, never fake traction, impact, or MSME success claims.

## Allowed starter data

- Governance constitution placeholder or approved current constitution.
- One frozen founding objective target.
- Default MSME onboarding questionnaire template.
- Default contribution score rules clearly labeled non-equity and operational only.
- Optional founding-stage knowledge asset that explains the platform is in launch stage.
- Optional draft/admin-only sample competition, not public.

## Disallowed starter data

- Fake impact metrics.
- Fake success stories.
- Fake MSME testimonials or claims.
- Public draft/admin-only records.

## Scripted baseline seed

Run only after configuring Firebase Admin credentials:

```bash
GOOGLE_APPLICATION_CREDENTIALS=/secure/path/service-account.json GOOGLE_CLOUD_PROJECT=<project-id> npm run seed:baseline -- --confirm-baseline-seed
```

For `NODE_ENV=production`, add `--confirm-production-seed`. The script is idempotent and skips existing records unless `--overwrite` is supplied.
