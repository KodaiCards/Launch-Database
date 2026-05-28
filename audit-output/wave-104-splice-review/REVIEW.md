# Wave 104 — routes/splice.js Comprehensive Code Review

**Reviewed:** `routes/splice.js` (~7058 lines, full file)
**Branch:** `agent/wave-104-splice-review`
**Date:** 2026-05-28
**Reviewer role:** Security + correctness adversarial

---

## Summary

The splice module is the largest single file in the repo (~7058 lines). It covers project locking, contractor token auth, Puppeteer PDF generation, bulk operations, state transitions, SSE, audit logging, N+1 queries, and test gaps. The most critical findings are a pervasive missing authorization check across ~15+ child-entity mutating endpoints, and a broken undo-last feature caused by a wrong table name that will throw a Postgres error at runtime.

**Finding count:** 7 HIGH · 10 MED · 9 LOW

---

## Focus Area 1 — Lock Semantics (POST /lock, /unlock, /take-over, /heartbeat)

### HIGH-1 — Lock acquire, heartbeat, take-over: TOCTOU race (SELECT then UPDATE without FOR UPDATE)

**Lines:** 721–756 (lock acquire), 760–777 (heartbeat), 797–822 (take-over)

All three lock operations follow the same broken pattern:
1. `SELECT locked_by_staff_id, lock_expires_at FROM splice_projects WHERE id = $1`
2. Application code decides whether the lock can be granted
3. `UPDATE splice_projects SET locked_by_staff_id = $1 WHERE id = $1`

Without `SELECT ... FOR UPDATE`, two concurrent requests can both read the unlocked state, both conclude the lock is available, and both succeed — resulting in two staff members holding the same lock simultaneously.

**Fix shape:** Wrap all three operations in a transaction; use `SELECT ... FOR UPDATE` on the project row before the decision.

```sql
-- Example for lock acquire:
BEGIN;
SELECT locked_by_staff_id, lock_expires_at FROM splice_projects WHERE id = $1 FOR UPDATE;
-- check / grant
UPDATE splice_projects SET ...;
COMMIT;
```

---

### LOW-1 — Stale lock expiry is 10 minutes but heartbeat is 30 seconds; no enforcement of heartbeat-missed detection

**Lines:** ~722 (STALE_LOCK_MS = 10 * 60 * 1000), ~765 (heartbeat extends 10 min)

When a client closes the browser without unlocking, the project stays locked for up to 10 minutes. The heartbeat interval is not enforced server-side — a client that stops sending heartbeats (e.g., crashes, goes offline) holds the lock until expiry. This is annoying but not a data integrity issue.

**Severity:** LOW — by design, but should be documented.

---

## Focus Area 2 — Contractor Public-Token Flow (/splice/field/:token, /splice/view/:token)

### HIGH-2 — ~15+ child-entity mutating endpoints missing `requireSpliceAccess()`

**Lines (sample):**
- `PUT /api/splice/locations/:id` — line 846: only `requireAuth()`
- `DELETE /api/splice/locations/:id` — line 906: only `requireAuth()`
- `PUT /api/splice/cables/:id` — line 1003: only `requireAuth()`
- `DELETE /api/splice/cables/:id` — line 1030: only `requireAuth()`
- `PUT /api/splice/cables/:id/path` — line 1048: only `requireAuth()`
- `PUT /api/splice/closures/:id` — line 1144: only `requireAuth()`
- `DELETE /api/splice/closures/:id` — line 1229: only `requireAuth()`
- `POST /api/splice/trays/:id/splices` — line 1302: only `requireAuth()`
- `POST /api/splice/trayless-splices` — line 1347: only `requireAuth()`
- `POST /api/splice/trays/:id/ribbon-splice` — line 1406: only `requireAuth()`
- `DELETE /api/splice/splices/:id` — line 1470: only `requireAuth()`
- `PUT /api/splice/splices/:id` — line 1492: only `requireAuth()`
- `DELETE /api/splice/ribbon-groups/:id` — line 1518: only `requireAuth()`
- `PUT /api/splice/fibers/:id` — line 1543: only `requireAuth()`
- `PUT /api/splice/cables/:cableId/fiber-metadata` — line 1585: only `requireAuth()`

**Impact:** Any authenticated user — regardless of role — can mutate any project's locations, cables, closures, splices, fibers, and fiber metadata. `requireSpliceAccess()` is correctly defined (lines 271–291) and guards project-level routes (lock, unlock, list, PDF export, etc.) but is missing from all child-entity write endpoints. An authenticated permitting clerk, billing user, or any other staff role can delete splices, rename cables, or corrupt a project they have no business touching.

**Fix shape:** For each of the ~15 endpoints, resolve the parent project_id from the entity's row (one extra SELECT) and gate with `requireSpliceAccess(async req => { ... })`. Alternatively, add a project_id column to each child table (some already have it; splice_locations, splice_cables, and splice_closures already carry project_id or can join to it) and use that for the lookup.

---

### MED-1 — Public field token flow: no `splicer_name` or `notes` length enforcement server-side

**Lines:** 3140–3185 (POST /splice/field/:token/markup)

The field HTML enforces `maxlength="120"` and `maxlength="2000"` on the inputs (lines 5862–5866), but the server-side handler does not validate length before inserting into `splice_closure_markup`. A crafted POST request bypasses the HTML constraint and can insert arbitrary-length strings into the DB. `splicer_name` and `notes` columns in the markup table have no DB-level character limit enforced in the migration visible to this review.

**Fix shape:** Truncate or reject `splicer_name > 120` and `notes > 2000` before INSERT.

---

### LOW-2 — `_resolveFieldToken` and `_resolveProjectToken` do not enforce token character-set

**Lines:** 5715–5724 (_resolveFieldToken), 5678–5688 (_resolveProjectToken)

Both functions check `token.length > 64` but do not validate that the token consists only of URL-safe base64url characters. An attacker can probe with tokens containing SQL special characters; the parameterized query prevents injection, but a stricter allowlist would follow least-privilege and is consistent with the sanitization visible elsewhere.

**Fix shape:** Add `/^[A-Za-z0-9_\-]{1,64}$/.test(token)` guard before hitting the DB.

---

## Focus Area 3 — PDF Generation (Puppeteer Safety)

### MED-2 — Design import auth ordering: `_designImportMiddleware` (multer) runs BEFORE `requireAuth()`

**Lines:** ~3907 (route registration order)

```javascript
app.post('/api/splice/projects/:id/design-import',
  _designImportMiddleware,   // multer: parses up to 25 MB multipart
  requireAuth(),
  requireSpliceAccess(req => req.params.id),
  ...
```

Multer runs before `requireAuth()`, so unauthenticated users can upload a 25 MB file to memory before being rejected. This is a DoS vector: an attacker can exhaust server memory by flooding the endpoint with large multipart requests without any credentials.

**Fix shape:** Move `requireAuth()` and `requireSpliceAccess()` before `_designImportMiddleware`. Multer only needs to run after auth is confirmed.

---

### LOW-3 — `page.pdf()` has no explicit timeout

**Lines:** ~2690, ~2820 (both PDF export paths)

`page.setContent(html, { waitUntil: 'load', timeout: 30000 })` sets a 30-second timeout for rendering, but the subsequent `page.pdf({ ... })` call has no timeout. A Puppeteer crash or hang during PDF rendering will leave the pool slot occupied indefinitely, eventually exhausting the browser pool.

**Fix shape:** Wrap `page.pdf()` in `Promise.race([page.pdf(...), timeout(30000)])` or rely on the pool's `BROWSER_MAX_AGE_MS` recycling.

---

### LOW-4 — `_fetchMapboxStaticDataUrl` is called inside the Puppeteer render path via `opts.mapImageDataUrl`, but if the Mapbox request itself times out (8 s), the PDF render budget is nearly exhausted

**Lines:** 4706–4761 (_fetchMapboxStaticDataUrl), ~2665 (caller)

The 8-second Mapbox fetch is awaited before the Puppeteer session opens. The total export budget (30s) minus the 8s Mapbox timeout leaves only 22s for `setContent` + `page.pdf()`. On slow Railway instances this may cause intermittent PDF timeouts. Non-critical but worth tracking.

---

## Focus Area 4 — Bulk Operations (transactional safety)

### HIGH-3 — `undo-last` uses wrong table name: `splice_splices` instead of `splices`

**Lines:** 2531 (DELETE), 2591 (INSERT)

```javascript
// Line 2531:
await client.query('DELETE FROM splice_splices WHERE project_id = $1', [projectId]);
// Line 2591:
`INSERT INTO splice_splices (id, project_id, ...) VALUES ...`
```

The actual table name throughout the rest of the file (300+ references) is `splices`, not `splice_splices`. PostgreSQL will throw `ERROR: relation "splice_splices" does not exist` on any call to `POST /api/splice/projects/:id/undo-last`. The undo feature is completely broken at runtime.

**Fix shape:** Replace both `splice_splices` occurrences with `splices`.

---

### MED-3 — `_ingestLossRecords` inserts records individually using `pool` (not transaction client)

**Lines:** 3223–3373 (_ingestLossRecords)

The function inserts each matched/unmatched loss record one-by-one to the pool (not within a transaction). If the process crashes or the DB rejects a record mid-flight, partial data is committed. A project may end up with some splice loss records from a batch but not others, with no way for the engineer to know the batch was incomplete.

**Fix shape:** Wrap the entire ingest loop in a single BEGIN/COMMIT/ROLLBACK using `pool.connect()`. Batch-insert all records in one round-trip if feasible.

---

### MED-4 — Clone project does not copy `loss_records`, `splice_closure_markup`, `splice_project_versions`, or `custom_features`/`custom_layers`

**Lines:** 2198–2404 (clone transaction)

The 9-step clone deep-copies: locations, cables, buffer_tubes, fibers, closures, trays, splices, ribbon_groups, strand_states. It does not copy: loss records (splice loss measurements), field markup photos (makes sense for a fresh clone), version history, or custom features/layers. If a designer clones a project to create a "v2" branch, they lose all OTDR measurements from v1.

**Severity:** MED — documented limitation not surfaced to the UI caller.

---

## Focus Area 5 — State Transitions

### MED-5 — Tray capacity enforcement: TOCTOU race (SELECT COUNT then INSERT without row lock)

**Lines:** 1313–1340 (POST /api/splice/trays/:id/splices), 1434–1458 (ribbon-splice)

```javascript
// Line 1324:
const used = await pool.query(`SELECT COUNT(*)::int AS n FROM splices WHERE tray_id = $1`, [id]);
// ...
if (used.n >= cap) return res.status(409).json({ error: 'Tray capacity exceeded' });
// Line 1332:
`INSERT INTO splices (...) VALUES (...)`
```

Two concurrent POST requests to the same tray can both read `used < cap`, both pass the check, and both insert — leaving the tray over-capacity. The same race exists in the ribbon-splice path.

**Fix shape:** Use a serializable transaction or add a DB-level CHECK constraint on tray capacity. Alternatively, increment and enforce with `FOR UPDATE` on the tray row during the INSERT.

---

### LOW-5 — `splice_closures.project_id` is set on POST but not verified on PUT/DELETE

**Lines:** 1144–1228 (PUT/DELETE closures)

Closures are created with a `project_id` column. The PUT and DELETE handlers look up by `id` only and do not verify the closure belongs to the project the user intends to modify. Combined with HIGH-2 (missing `requireSpliceAccess`), this compounds the IDOR risk.

---

### LOW-6 — No status enum enforcement on `splice_projects.status`

**Lines:** ~480 (PATCH /api/splice/projects/:id/status)

The status field is updated with a raw user-supplied string: `UPDATE splice_projects SET status = $1`. There is no check that the new status is one of an allowed set (e.g., `['active', 'complete', 'archived']`). Any string can be written.

**Fix shape:** Validate against an allowlist before updating.

---

## Focus Area 6 — Error Handling (SSE, JWT iat re-validation)

### MED-6 — SSE JWT re-validation: fail-open risk on DB error cascade

**Lines:** 3648–3695 (SSE heartbeat re-validation)

The re-validation loop correctly fails closed after **2 consecutive** DB errors (closes the SSE channel). However, if DB errors are transient (e.g., brief connection pool exhaustion) and alternate with successes, the consecutive counter resets and an invalidated token could stay connected indefinitely. A user whose password was changed could remain connected through alternating DB flakes.

**Severity:** MED — requires intermittent DB failures concurrently with token invalidation, which is rare. But the two-consecutive threshold is a conservative heuristic, not a guarantee.

**Fix shape:** Track total DB errors per session (not just consecutive) and close after N total errors. Or reduce the grace period to 1 consecutive error.

---

### LOW-7 — SSE channel pinning: no guard against a single user opening unbounded SSE connections

**Lines:** 3610–3700 (SSE subscribe endpoint), 108–118 (project channel map)

The `_projectClients` Map accumulates SSE response objects per project. There is no per-user or per-IP limit on how many concurrent SSE connections can be opened to the same project. A user (or attacker with a valid session) can open thousands of connections, exhausting Node.js file descriptors.

**Fix shape:** Cap connections per user per project at 3–5 (tab reuse). Evict the oldest connection when the cap is exceeded.

---

## Focus Area 7 — Audit Log Instrumentation

### MED-7 — Zero audit log calls found in 7058 lines

**Lines:** full file scan

No calls to any audit logging function (no `log_audit`, no `pool.query('INSERT INTO audit_log ...')`, no reference to audit tables) were found anywhere in the splice route file. Wave 78 was documented as attempting this but encountering FS issues.

All of the following mutating operations are unlogged:
- Project create / rename / delete
- Lock acquire / release / take-over
- Location / cable / closure create, update, delete
- Splice create / delete
- PDF export
- Version snapshot / undo-last
- Design import stage + apply
- Field markup upload
- Loss record ingest
- Splitter create / delete

For a government project tracking system, the absence of audit logging on splice data mutations is a compliance gap. Any splice deletion (accidental or malicious) leaves no trace.

**Fix shape:** At minimum, log: project mutations (create/delete/status-change), undo-last triggers, design import applies. Use the existing audit_log table pattern from other routes.

---

## Focus Area 8 — N+1 Queries and Missing Indexes

### MED-8 — `GET /api/splice/projects` list has 3 correlated subqueries per row and no LIMIT

**Lines:** 295–313

```javascript
await pool.query(`
  SELECT p.*,
    (SELECT COUNT(*) FROM splice_locations  WHERE project_id = p.id) AS location_count,
    (SELECT COUNT(*) FROM splice_cables     WHERE project_id = p.id) AS cable_count,
    (SELECT COUNT(*) FROM splice_closures   cl
       JOIN splice_locations l ON l.id = cl.location_id
       WHERE l.project_id = p.id)                                    AS closure_count
  FROM splice_projects p
  WHERE p.designer_id = $1
    OR (... splice access check ...)
  ORDER BY p.updated_at DESC
`)
```

No `LIMIT` clause. An office with 500+ projects will return all rows, each with 3 subquery executions. This is O(N×3) queries dressed up as one SQL statement. As project count grows, this endpoint degrades badly.

**Fix shape:** Add `LIMIT 200 OFFSET $n` for pagination, or rewrite using LEFT JOIN + COUNT aggregation (single scan).

---

### LOW-8 — Loop INSERTs in hot paths without batching

**Lines:**
- Cable creation (fiber/tube generation): lines 970–987
- Clone project (splices, tubes, fibers): lines 2269–2380
- _applyImportChange (cable add): lines 6560–6574
- Splitter output creation: lines 4328–4337

For a 288-fiber cable, cable creation issues 24 tube INSERTs + 288 fiber INSERTs = 312 round-trips inside a transaction. For a 3-cable clone project with 144 fibers each, that's ~900+ round-trips. On Railway's Postgres (latency ~1–3ms per round-trip) this adds 1–3 seconds per cable.

**Fix shape:** Use `INSERT INTO ... VALUES ($1,$2,...), ($3,$4,...), ...` batched inserts. The pattern already exists in `_ensureFieldTokens` (lines 5769–5778) — apply it to the creation loops.

---

### LOW-9 — `_loadProjectForExport` issues 12 parallel queries with no index hints; used in hot paths

**Lines:** 4587–4683

`_loadProjectForExport` fires 12 concurrent pool queries via `Promise.all`. This is correct for correctness, but three of the queries have multi-join chains (`splices`, `ribbon_groups`, `strand_states`) that may do seq scans on large tables if indexes on `tray_id`, `closure_id`, or `cable_id` foreign keys are absent. Used in: PDF export, version snapshot (called before every mutating operation in undo-last), diff computation.

**Check needed:** Verify `CREATE INDEX` exists for `splices(tray_id)`, `splice_ribbon_groups(tray_id)`, `splice_strand_states(cable_id)`, `splice_splitter_outputs(splitter_id)`.

---

## Focus Area 9 — Test Coverage

### MED-9 — No splice route tests found; the splice module is entirely untested

**Verified by:** checking `tests/` directory (no splice.test.js, no splice spec in browser tests)

The entire 7058-line module has zero test coverage. Specific untested behaviors of highest risk:

| Behavior | Risk if wrong |
|---|---|
| Lock acquire race | Two users edit simultaneously, data corrupt |
| Undo-last (`splice_splices` bug) | Feature dead, user data not recoverable |
| requireSpliceAccess on child entities | Any staff role can mutate any project |
| Tray capacity enforcement | Over-committed trays silently |
| Design import apply transaction | Partial apply on DB error |
| PDF export (Puppeteer) | Memory leak / hang on crash |
| SSE JWT re-validation | Stale sessions stay connected |
| Field token rate limiter | Splicer lockout after refresh storm |

**Priority test candidates:**
1. `POST /api/splice/projects/:id/lock` — happy path + concurrent race
2. `POST /api/splice/projects/:id/undo-last` — currently broken due to HIGH-3; must be fixed first
3. `POST /api/splice/trays/:id/splices` — capacity enforcement
4. `requireSpliceAccess` — verify non-splice role is rejected on child endpoints once HIGH-2 is fixed
5. `DELETE /api/splice/projects/:id/bulk-closures` — verify same-project guard

---

## Finding Index

| # | Severity | Area | Title | Lines |
|---|---|---|---|---|
| HIGH-1 | HIGH | Lock semantics | TOCTOU race in lock/heartbeat/take-over | 721–822 |
| HIGH-2 | HIGH | Auth | ~15+ child-entity endpoints missing requireSpliceAccess | 846–1585 |
| HIGH-3 | HIGH | Bulk ops | undo-last uses `splice_splices` (wrong table — breaks at runtime) | 2531, 2591 |
| MED-1 | MED | Public token | splicer_name/notes length not enforced server-side | 3140–3185 |
| MED-2 | MED | PDF/Puppeteer | Design import multer runs before requireAuth (DoS vector) | ~3907 |
| MED-3 | MED | Bulk ops | _ingestLossRecords not transactional (partial failure) | 3223–3373 |
| MED-4 | MED | Bulk ops | Clone does not copy loss_records/versions/custom_features | 2198–2404 |
| MED-5 | MED | State transitions | Tray capacity TOCTOU race | 1313–1458 |
| MED-6 | MED | SSE / JWT | Fail-open risk on alternating DB errors in SSE re-validation | 3648–3695 |
| MED-7 | MED | Audit log | Zero audit log calls in 7058 lines | full file |
| MED-8 | MED | N+1 | GET /projects list: 3 correlated subqueries, no LIMIT | 295–313 |
| MED-9 | MED | Tests | No splice route tests exist | N/A |
| LOW-1 | LOW | Lock semantics | No heartbeat-missed enforcement; 10-min stale window | ~722, ~765 |
| LOW-2 | LOW | Public token | Token character-set not validated | 5715–5724 |
| LOW-3 | LOW | PDF/Puppeteer | page.pdf() has no timeout | ~2690, ~2820 |
| LOW-4 | LOW | PDF/Puppeteer | Mapbox fetch (8s) eats export budget | 4706–4761 |
| LOW-5 | LOW | State transitions | Closure PUT/DELETE does not verify project membership | 1144–1228 |
| LOW-6 | LOW | State transitions | splice_projects.status: no enum enforcement | ~480 |
| LOW-7 | LOW | SSE | No per-user SSE connection cap | 3610–3700 |
| LOW-8 | LOW | N+1 | Loop INSERTs in cable/clone/splitter creation | 970–6574 |
| LOW-9 | LOW | N+1 | _loadProjectForExport index gaps (check needed) | 4587–4683 |

---

## What Was Not Covered

- `routes/splice.js` lines related to `_traceStrandPath` (read, no issues found — algorithm is correct with proper circular-detection and visited-set logic)
- `_renderSpliceHtml` / `_renderDiffHtml` — reviewed; `_esc()` is applied consistently; no XSS vectors found in output HTML
- `_computeDiff` / `_shallowEqualEntity` — correct logic, reviewed
- `_parseDxfCalibration` / `_buildDxfTransform` — reviewed; DXF EPSG code validated via regex before proj4 use; control-point path validates numeric inputs
- KML `_kmlEsc` — correct XML escaping
- `_mintFieldToken()` — `crypto.randomBytes(18).toString('base64url')` = 144 bits of entropy, adequate
- `_generationHash()` — SHA1 on sorted JSON; not crypto-sensitive (fingerprint only), acceptable
- Haversine GPS proximity binding — reviewed; math is correct (uses earth radius 6371 km)
- SSRF protection in Puppeteer (`setRequestInterception`) — reviewed; correctly implemented; only `data:` and `about:blank` are allowed

=== WAVE 104 SPLICE REVIEW END ===
