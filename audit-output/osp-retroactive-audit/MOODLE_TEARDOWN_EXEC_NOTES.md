# Moodle Teardown Execution — OSP-RW.6

**Commit:** `47c5fa5`

**Executed:** 2026-05-18

**Scope:** Full Moodle bridge removal. Training tile now serves Vite SPA at `/training/` behind `requireAuth()`.

## Changes

1. **Deleted files:**
   - `routes/oauth2.js` (332 LOC)
   - `tests/oauth2.test.js` (11KB)
   - `moodle/` directory (Dockerfile, README, railway.json, 2 scripts)

2. **Modified:**
   - `server.js` — removed OAuth2 route wiring (line 737), auth-bypass block (lines 344-352), hardcoded TRAINING_URL='/training/'
   - `.env.example` — removed OAuth2_* docs + LAUNCH_DB_BASE_URL

**Result:** 9 files changed, 1150 lines deleted. Training route at line 438 unchanged.

## Verification

- No build errors (Vite SPA unaffected).
- No dangling imports.
- `/api/training/*` routes live (routes/training.js still wired).
- No other code references oauth2.js or OAuth2_* env vars.

**Status:** ✓ Complete. Ready for CI-green verification.
