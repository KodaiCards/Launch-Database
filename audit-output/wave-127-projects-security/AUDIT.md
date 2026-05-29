# Wave 127 — Security Audit: routes/projects.js

**Framing:** IDOR + mass-assignment + auth fence + race conditions + SQL injection + state machine + audit log + info-disclosure  
**Auditor:** Read-only audit agent  
**Date:** 2026-05-29  
**File audited:** `routes/projects.js` (1407 lines)  
**Write-path constraints acknowledged:** only `audit-output/wave-127-projects-security/AUDIT.md` written.

---

## Stack snapshot (≤80 words)

routes/projects.js exports a single install function wiring 11 endpoints. Auth is layered — `requireAuth()` gates reads; `requireProjectCreate` (async capability check) gates creates/updates; `requireAdmin` gates deletes and recalc-all. The file imports `canCreateProjects` from `auth.js`. SQL is fully parameterized. The `resolve-or-create` endpoint has cross-client validation through EC membership checks. Audit logging is present on most mutating operations. The main risk surface is the PUT's unconditional write-through on undefined fields and missing-before-state in audit logs.

---

## Findings

### Finding 1 — HIGH: PUT `/api/projects/:id` overwrites `name` and `client_id` with `undefined` when omitted from payload

**Severity:** HIGH  
**Category:** Mass assignment / state corruption  
**Verified by reading:** `routes/projects.js:637-664`

```js
const updateParams = [
  name, client_id, contract_id || null,   // $1, $2, $3 — always written
  project_type, ...
  status, ...
```

```sql
UPDATE projects SET
  name=$1, client_id=$2, contract_id=$3,   -- unconditional writes
  project_type=COALESCE($4, project_type), program=COALESCE($5, program),
  status=$7, ...
WHERE id=$24 RETURNING *
```

**Issue:** `name` ($1) and `client_id` ($2) are unconditional `SET` targets. When the caller sends a partial update (e.g. only changing `status`), both `name` and `client_id` come from `req.body` destructuring as `undefined`. Node-postgres serializes `undefined` as `NULL`, so the project's name and client_id are silently cleared. `contract_id`, `status`, `billing_type`, `billing_rate`, `footage`, `notes`, `parent_id`, `budget_code_id` share the same unconditional write-through exposure — any field absent from the payload becomes NULL in the database. This is not a COALESCE-guarded field like `project_type` or `program`. A portal-level user (granted `can_create_projects`) sending only `{ status: 'completed' }` would null out the project name and client linkage.

**Fix shape:** Wrap unconditional fields in `COALESCE($1, name)` / `COALESCE($2, client_id)` pattern (matching what `project_type` already does on line 654), OR reject the request with 400 when a required field is explicitly absent. The `is_rollup=COALESCE($25, is_rollup)` pattern on line 662 shows the correct existing idiom.

**Confidence:** HIGH — the SQL is unambiguous.

---

### Finding 2 — HIGH: IDOR on GET `/api/projects/:id` and all `:id`-parameterized endpoints — no ownership or role-scoped filter

**Severity:** HIGH  
**Category:** IDOR  
**Verified by reading:** `routes/projects.js:182-202`

```js
app.get('/api/projects/:id', requireAuth(), async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, cl.name as client_name, ...
    FROM projects p
    ...
    WHERE p.id = $1
  `, [req.params.id]);
  if (!rows.length) return res.status(404).json({ error: 'Not found' });
  res.json(rows[0]);
```

**Issue:** Any authenticated user (including `design_engineer`, `permitting_engineer`) can fetch any project by UUID — including projects belonging to other clients or inaccessible programs. No `WHERE client_id = req.user.client_id` or role-based scope filter is applied. The same pattern applies to:
- `GET /api/projects/:id/monthly-hours-breakdown` (line 1270) — exposes billing_rate × hours data
- `POST /api/projects/:id/recalc-hours` (line 716) — any auth'd user can trigger compute on any project
- `DELETE /api/projects/:id` — guarded by `requireAdmin`, so downgraded risk, but the pattern is consistent

In this internal tool the risk is attenuated (all users are trusted employees), but a compromised non-admin account can enumerate and read project financial data across all clients.

**Fix shape:** For read endpoints, add an optional role-scoped filter or at minimum document the intentional open-read policy. The `GET /api/projects` list endpoint similarly has no user-scoped filter but is documented as intentional for admin tree views — the same note should clarify `:id` fetch.

**Confidence:** HIGH — confirmed no scope filter in the WHERE clause.

---

### Finding 3 — MEDIUM: DELETE `/api/projects/:id/with-hours` has no `logAudit` call

**Severity:** MEDIUM  
**Category:** Audit log gap  
**Verified by reading:** `routes/projects.js:766-813`

```js
app.delete('/api/projects/:id/with-hours', requireAdmin, async (req, res) => {
  ...
  await pool.query('DELETE FROM time_entries WHERE project_id=$1', [req.params.id]);
  await pool.query('DELETE FROM invoice_items WHERE project_id=$1', [req.params.id]);
  await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [req.params.id]);
  await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
  // <-- no broadcast, no logAudit
  broadcast('admin', 'project_deleted', { id: req.params.id });
  res.json({ ok: true });
```

**Issue:** The destructive multi-table delete (project + all time_entries + invoice_items) fires no `logAudit` call. The regular `DELETE /api/projects/:id` on line 704 DOES call `logAudit`. The `/with-tree` endpoint on line 1245 also calls `logAudit`. The `/with-hours` path is the only delete that leaves no audit trail, despite deleting revenue-affecting `invoice_items`. For a system tracking government billing, this is an unacceptable gap.

**Fix shape:** Add `logAudit(pool, { req, action: 'delete', entity_type: 'project', entity_id: req.params.id, before: { id: proj.rows[0].name }, meta: { deleted_time_entries: teCount.rows[0].cnt }, source: 'admin_ui' })` after the delete sequence (the project name is already fetched for the dry-run preview on line 777).

**Confidence:** HIGH — grep confirms zero `logAudit` in the with-hours handler.

---

### Finding 4 — MEDIUM: PUT audit log captures no `before` state for updates

**Severity:** MEDIUM  
**Category:** Audit log completeness  
**Verified by reading:** `routes/projects.js:666-668`

```js
logAudit(pool, { req, action: 'update', entity_type: 'project', entity_id: rows[0].id,
  after: { id: rows[0].id, name: rows[0].name, status: rows[0].status, program: rows[0].program },
  source: 'admin_ui' });
```

**Issue:** The `before` field is not supplied — it defaults to `null` in `_audit.js`. An audit log row for an update with no `before` state makes it impossible to determine what value changed from. The DELETE endpoint on line 705 correctly supplies `before: { id, name }`. The UPDATE should at minimum capture the pre-update name, client_id, and status for forensic use. The `existing` row is already fetched on line 535 for cadence preservation and could be used here.

**Fix shape:** Before the UPDATE, query `SELECT name, client_id, status, program FROM projects WHERE id=$1` and pass as `before:` in the logAudit call. Alternatively, surface the pre-update row from the already-fetched `existing` result.

**Confidence:** HIGH — the `before` key is absent from the logAudit call.

---

### Finding 5 — MEDIUM: `status` field in POST and PUT accepts arbitrary strings — no enum validation

**Severity:** MEDIUM  
**Category:** State machine / input validation  
**Verified by reading:** `routes/projects.js:214`, `routes/projects.js:655`

```js
// POST destructure:
status = 'active', billing_type, billing_rate,
// later inserted directly:
status, insertBillingType, insertBillingRate,
```

```sql
-- PUT:
status=$7, billing_type=$8, billing_rate=$9,
```

**Issue:** `status` is destructured from `req.body` with a default of `'active'` for POST, but no allowlist check occurs before it reaches the parameterized query. An authenticated user with `can_create_projects` can create a project with `status: 'billed'` or `status: 'foobar'`, bypassing the normal billing lifecycle. Similarly `billing_type` (which should be `'hourly'` or `'footage'`) and `billing_cadence` (should be `'monthly'` or `'one_time'`) accept arbitrary strings. For `billing_cadence`, the `is_ongoing` invariant enforces `'monthly'` when `is_ongoing=true`, but a project can be set to `billing_cadence='quarterly'` or any other value without error. The schema may have CHECK constraints protecting this, but the application layer provides no validation feedback.

**Fix shape:** Add explicit allowlist checks: `const VALID_STATUS = ['active','completed','billed']; if (status && !VALID_STATUS.includes(status)) return 400`. Same for `billing_type: ['hourly','footage']` and `billing_cadence: ['monthly','one_time']`. Mirror the existing `program` enum validation pattern on lines 235-243.

**Confidence:** HIGH — no allowlist check present. Schema-level CHECK constraint may catch it at DB layer but no 400 is returned to caller.

---

### Finding 6 — MEDIUM: `GET /api/projects` leaks financial data (ytd_revenue, billing_rate) to all authenticated roles without scope filter

**Severity:** MEDIUM  
**Category:** Information disclosure / authorization  
**Verified by reading:** `routes/projects.js:122-179`

```sql
SELECT p.*,    -- includes billing_rate, billing_cadence, manual_invoice_amount, projected_revenue
  ...
  COALESCE((... SUM(CASE WHEN leaf.billing_type...) ...), 0) as ytd_revenue
FROM projects p
...
WHERE <optional filters, none user-scoped>
```

**Issue:** `p.*` includes sensitive financial fields: `billing_rate`, `manual_invoice_amount`, `projected_revenue`, `expected_revenue`, and the computed `ytd_revenue`. Any authenticated employee can call `GET /api/projects` (with `requireAuth()` — any role) and receive full financial details for all projects across all clients. `design_engineer` and `permitting_engineer` roles have no business need for `manual_invoice_amount` or `ytd_revenue`.

**Fix shape:** Either (a) restrict the SELECT to non-financial fields for non-manager roles, or (b) document this as an explicit policy decision (internal tool, all users are employees who may see financials). Given the government billing exposure, (a) is preferred.

**Confidence:** HIGH — `p.*` is unambiguous; no role filter applied.

---

### Finding 7 — LOW: `DELETE /api/projects/:id` (single-row) has no transactional wrapper — partial failure risk

**Severity:** LOW  
**Category:** Race condition / atomicity  
**Verified by reading:** `routes/projects.js:678-711`

```js
await pool.query('DELETE FROM billing_batch_items WHERE project_id=$1', [req.params.id]);
await pool.query('DELETE FROM projects WHERE id=$1', [req.params.id]);
broadcast('admin', 'project_deleted', ...);
logAudit(...);
```

**Issue:** The two DELETE statements are sequential pool queries without a BEGIN/COMMIT wrapper. If the second query fails (e.g., a FK RESTRICT from a table not yet handled), the `billing_batch_items` row is already gone but the project row survives in a partially cleaned state. The `/with-hours` and `/with-tree` endpoints both use proper transactions. For a single-row delete this is low risk because there are few FK dependencies, but it is inconsistent with the project's own patterns.

**Fix shape:** Wrap both deletes in a `client.query('BEGIN') / COMMIT / ROLLBACK` block matching the `/with-hours` pattern.

**Confidence:** MEDIUM — the risk is real but the single FK case makes catastrophic failure unlikely in practice.

---

### Finding 8 — LOW: `req.params.id` is not validated as a UUID format before DB queries on several endpoints

**Severity:** LOW  
**Category:** Input validation / defensive coding  
**Verified by reading:** `routes/projects.js:182-202`, `routes/projects.js:716-725`

```js
app.get('/api/projects/:id', requireAuth(), async (req, res) => {
  const { rows } = await pool.query(`... WHERE p.id = $1`, [req.params.id]);
```

**Issue:** `resolve-or-create` validates `client_id` and `service_area_id` as UUIDs with regex (lines 850, 924). `GET /api/projects/:id`, `PUT /api/projects/:id`, all DELETE variants, and `recalc-hours` pass `req.params.id` directly to parameterized SQL without UUID format validation. While Postgres's UUID column type rejects non-UUID strings at the DB layer (returning a 500 error), the application returns a generic "Failed to load project" 500 instead of the correct 400. This causes misleading error codes for malformed requests.

**Fix shape:** Add `if (!req.params.id.match(/^[0-9a-f-]{36}$/i)) return res.status(400).json({ error: 'Invalid project ID format' })` as a shared helper, matching the UUID check pattern already used in `resolve-or-create`.

**Confidence:** HIGH — the check is absent; Postgres will throw on non-UUID strings.

---

### Finding 9 — LOW: `resolve-or-create` silently swallows the job-lookup exception (line 879)

**Severity:** LOW  
**Category:** Error handling / defensive coding  
**Verified by reading:** `routes/projects.js:867-879`

```js
try {
  const jobRow = await pool.query(
    `SELECT team, is_permitting, default_billing_type, default_rate FROM jobs WHERE ...`,
    [normalizedJobName]
  );
  ...
} catch (_) {}  // ← silent swallow
```

**Issue:** The job-lookup catch block discards the exception with `catch (_) {}`. If the pool is exhausted or the `jobs` table has a transient error, the fallback (no job metadata) silently produces a project with `billing_type='hourly'`, `billing_rate=null`, `project_type='other'` — which may be financially wrong for permitting jobs. The error is not logged, so the admin has no visibility.

**Fix shape:** Replace `catch (_) {}` with `catch (e) { console.error('[projects:resolve-or-create:job-lookup]', e && e.message); }` to surface transient failures without blocking the creation flow.

**Confidence:** HIGH — the catch is explicit.

---

### Finding 10 — LOW: `POST /api/projects/:id/generate-monthly-invoice` does not verify the project is `is_ongoing=true` before generating

**Severity:** LOW  
**Category:** State machine enforcement  
**Verified by reading:** `routes/projects.js:1296-1405`

```js
app.post('/api/projects/:id/generate-monthly-invoice', requireManagerOrAdmin, async (req, res) => {
  ...
  const proj = await pool.query(
    `SELECT id, name, client_id, billing_rate, is_ongoing FROM projects WHERE id = $1`,
    [projectId]
  );
  if (!proj.rows.length) return res.status(404).json({ error: 'Project not found.' });
  const p = proj.rows[0];
  // <-- p.is_ongoing is fetched but never checked before proceeding
```

**Issue:** `is_ongoing` is selected but never checked. A manager can trigger monthly invoice generation for any project (including one-time-billed projects that have already been billed). The endpoint is idempotent against duplicate period invoices (via the existing invoice check), but allows managers to generate invoices against non-recurring projects without warning. For government billing compliance this is a soft risk.

**Fix shape:** Add `if (!p.is_ongoing) return res.status(400).json({ error: 'Monthly invoice generation is only valid for ongoing projects.' })` after the project fetch.

**Confidence:** HIGH — the field is fetched but the guard is absent.

---

## VERIFIED CLEAN

| Area | Check | Result |
|---|---|---|
| SQL injection | All query inputs use `$N` parameterized form throughout all 11 endpoints | CLEAN — zero string interpolation in SQL |
| Auth on POST / PUT | `requireAuth()` + `requireProjectCreate` gate both create and update | CLEAN — Wave 1.5 fix confirmed present |
| Auth on DELETE variants | `requireAdmin` on all 3 delete endpoints | CLEAN |
| Auth on recalc-all | `requireAdmin` on `/recalc-all` | CLEAN |
| Auth on recalc-hours | `requireAuth()` | CLEAN |
| Auth on monthly-hours-breakdown | `requireAuth()` | CLEAN |
| Auth on generate-monthly-invoice | `requireManagerOrAdmin` | CLEAN |
| Auth on resolve-or-create | `requireAuth()` + `requireProjectCreate` | CLEAN |
| Race condition on leaf create | 23505 conflict → re-SELECT winner (lines 1004-1019, 1110-1125) | CLEAN |
| Race condition on tree delete | Full BEGIN/COMMIT/ROLLBACK transaction (lines 1199-1228) | CLEAN |
| parent_id cross-client check (POST) | DB existence check on line 258 prevents ghost parent | CLEAN — present |
| parent_id cross-client check (PUT) | DB existence check on line 499 | CLEAN — present |
| Customer role blocked from create | `canCreateProjects` → explicit `if (user.role === 'customer') return false` (auth.js:152) | CLEAN |
| EC membership verified in resolve-or-create | SA verified against `engineering_contract_id` on lines 942-950 | CLEAN |
| cross-client EC scoping | `engineering_contracts WHERE client_id=$1 AND program=$2` on line 933 | CLEAN |
| program enum validation | Allowlist `['rus','bau','gfr','other']` on POST (line 237) and PUT (line 487) | CLEAN |
| service_area_label length cap | 200-char check on lines 248, 1045 | CLEAN |
| Error messages contain no stack traces | All 500 responses return fixed strings, e.message only to console | CLEAN |
| collectProjectTree depth guard | 30-level depth cap in recursive CTE (_helpers.js:93) | CLEAN |
| Invoice idempotency | ON CONFLICT on invoice_number + existing period check (lines 1318-1328) | CLEAN |
| logAudit on create | POST (line 440), resolve-or-create MODE 1 (line 1036) and MODE 2 (line 1142) | CLEAN |
| logAudit on tree delete | Line 1245 — present with metadata including undo_token | CLEAN |

---

## COVERAGE GAPS

- Did not audit `_helpers.js:ensureRollupChain` (separate module; IDOR if rollup_key collision possible cross-client)
- Did not audit `portal_module.js` (sets `app.locals.ensureRollupChain` and `app.locals.isDuplicateProject`)
- Did not audit `routes/invoice_templates.js` or `routes/billing.js` for financial-data access patterns
- Did not verify whether the schema has CHECK constraints on `status`, `billing_type`, or `billing_cadence` columns (would determine whether Finding 5 is exploitable at DB layer)
- Did not audit the undo-bucket replay path (`saveUndoBucket` / undo restore endpoint) — potential for privilege escalation if undo can restore admin-only deleted records via non-admin trigger

---

## VERDICT

**YELLOW** — 2 HIGH, 3 MEDIUM, 4 LOW findings. No SQL injection. No auth bypass. Critical risks are the PUT unconditional-NULL-overwrite (Finding 1, which can corrupt project ownership and naming), the missing audit trail on with-hours delete (Finding 3), and broad financial data exposure (Finding 6). The file's auth layering is generally sound; most gaps are audit/validation completeness issues rather than exploitable auth bypasses.

| Severity | Count |
|---|---|
| HIGH | 2 (F1 PUT null-overwrite, F2 IDOR read) |
| MEDIUM | 3 (F3 audit gap, F4 before-state missing, F5 status enum, F6 financial disclosure) |
| LOW | 4 (F7 txn, F8 UUID validation, F9 silent catch, F10 ongoing guard) |

=== WAVE-127-PROJECTS-SECURITY AUDIT END ===
