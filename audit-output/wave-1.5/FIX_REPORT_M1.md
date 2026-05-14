# Wave 1.5 M-1 Fix Report

**Item:** M-1 — `routes/jobs.js` missing `requireAuth` in mw object passed from `server.js`

**Severity upgrade:** MEDIUM → HIGH (confirmed actively exploitable — `GET /api/jobs` and `GET /api/jobs/:id` both call `requireAuth(...)` which silently no-ops to `next()` because `requireAuth` was absent from the mw object at `server.js:525`).

**Fix applied:** Added `requireAuth` to the mw object at `server.js:525`:
```js
require('./routes/jobs')(app, pool, { requireAdmin, requireManagerOrAdmin, requireAuth });
```

Both `GET /api/jobs` and `GET /api/jobs/:id` now correctly enforce role-based authentication (`admin`, `design_manager`, `permitting_manager`, `design_engineer`, `permitting_engineer`). Syntax checks on `server.js` and `routes/jobs.js` pass clean. No other routes/files affected.

=== WAVE 1.5 M-1 FIX REPORT END ===
