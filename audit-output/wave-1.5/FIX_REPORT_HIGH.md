# Wave 1.5 HIGH Fix Report — H-1, H-2, H-3

> Fix agent scope: H-1 (auth bypass: pricing.js + full route audit),
> H-2 (schema drift: missing migration tables on fresh deploy),
> H-3 (schema drift: missing users columns on fresh deploy).
> H-4 and H-5 were hand-applied by orchestrator at `0cedaed` (pre-scope).

---

## Per-item status

| # | Item | Status | Commit | Notes |
|---|---|---|---|---|
| **H-1** | Auth bypass — pricing + 8 other routes | **ADDRESSED** | `e639e98` | All 9 affected mounts fixed; see route audit below |
| **H-2** | Schema drift — missing tables (0012-0034) | **ADDRESSED** | `eefd72b` | 7 tables + trigger + FK-fix appended to schema.sql |
| **H-3** | Schema drift — missing users columns | **ADDRESSED** | `fc6998c` | users CREATE TABLE added inline with all 4 columns |

---

## H-1 — Route audit (full `|| (() => next())` fallback sweep)

**Scope:** All 22 route files in `routes/` that declare  
`const requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next())`.

For each: checked whether `server.js` was passing `requireAuth` in the mw object AND whether the route actually uses `requireAuth()` internally.

| Route file | server.js mount (before) | Uses requireAuth? | Action |
|---|---|---|---|
| `clients.js` | `{ requireAdmin }` | Yes — GET /api/clients | **Added requireAuth** |
| `contracts.js` | `{ requireAdmin }` | Yes — GET /api/contracts | **Added requireAuth** |
| `engineering_contracts.js` | `{ requireAdmin }` | Yes — GET /api/engineering-contracts{/:id} | **Added requireAuth** |
| `pricing.js` | `{ requireManagerOrAdmin }` | Yes — GET /api/pricing{/lookup,/gaps} | **Added requireAuth** (canonical H-1 target) |
| `project_detail.js` | `{}` | Yes — GET /api/projects/:id/detail | **Added requireAuth** |
| `budgets.js` | `{ requireManagerOrAdmin }` | Yes — GET /api/budgets{/:id/summary,/:id/by-area}, /api/budget-codes | **Added requireAuth** |
| `concentrators.js` | `{ requireAdmin }` | Yes — GET /api/concentrators | **Added requireAuth** |
| `staff.js` | `{ requireAdmin }` | Yes — GET /api/staff | **Added requireAuth** |
| `reports.js` | `{}` | Yes — GET /api/reports/{hours,billing} (manager-role sensitive) | **Added requireAuth** |
| `project_types.js` | `{}` | Yes (declares it) but CANONICAL.md false-positive: "returns hardcoded enum, no sensitive data; benign" | **Skipped** (FP per canonical) |
| `jobs.js` | `{ requireAdmin, requireManagerOrAdmin }` | Yes (declares it) but deferred to M-1 (MED tier) — per canonical H-1 prompt "jobs.js is a known time-bomb but covered by M-1" | **Skipped** (out of H-1 scope) |
| `design_pipeline.js` | `{ requireAuth }` | Yes — already receives it | No change needed |
| `dashboard.js` | `{ requireAuth }` | Yes — already receives it | No change needed |
| `inspection.js` | `{ requireAuth }` | Yes — fixed by C-3 | No change needed |
| `potential_permits.js` | `{ requireAuth }` | Yes — fixed by C-2 | No change needed |
| `permits.js` | `{ upload, requireAuth }` | Yes — already receives it | No change needed |
| `project_documents.js` | `{ upload, uploadDir, requireAuth, requireAdmin }` | Yes — already receives it | No change needed |
| `undo.js` | `{ requireAuth }` | Yes — already receives it | No change needed |
| `time_entries.js` | `{ requireAuth, ... }` | Yes — already receives it | No change needed |
| `hours_csv.js` | `{ requireAuth, ... }` | Yes — already receives it | No change needed |
| `splice.js` | `{ requireAuth }` | Yes — already receives it | No change needed |

**Verified by reading:** `server.js:509-691` (all route mounts), plus individual route files at lines 15-38 (requireAuth destructure/fallback pattern).

**Net result:** 9 routes were missing `requireAuth` in their mw object, causing the no-op stub to fire at bind time. All 9 fixed in commit `e639e98`. `node -c server.js` passes; boot smoke produces expected DB-connection errors (no Railway env), no code crash.

---

## H-2 — Schema drift: appended tables

**File:** `schema.sql` — appended at end after "End of v3 additions" sentinel.

**Header:** `-- ─── Wave 1.5 H-2: Append migrations 0012-0034 schema for fresh-deploy parity ───`

Tables/objects appended (all `CREATE TABLE IF NOT EXISTS` / `CREATE INDEX IF NOT EXISTS`):

| Migration | Object | FK dependencies (all in schema.sql or prior migration) |
|---|---|---|
| 0012 | `splice_closure_public_tokens` | `splice_closures`, `splice_projects` (migration 0001), `staff` |
| 0012 | `splice_field_markups` | `splice_closures`, `splice_projects`, `splice_closure_public_tokens` |
| 0021 | `splice_comments` | `splice_projects` (0001), `users` (H-3 — now in schema.sql) |
| 0031 | `ec_service_areas` | `engineering_contracts` (schema.sql) |
| 0031 | `ec_work_orders` | `engineering_contracts`, `ec_service_areas` |
| 0032 | `job_assignments` | `jobs`, `clients`, `engineering_contracts` (all schema.sql) |
| 0032 | `job_assignments_unique_pin` index | expression index with COALESCE — correct form per 0032 lessons (not inline UNIQUE) |
| 0033 | `sync_projected_revenue_footage()` trigger | `projects` (schema.sql) |
| 0034 | `projects.parent_id` FK RESTRICT correction | DO $$ block, idempotent guard |

**Note on 0034:** migration 0034 landed on the branch during this session's pull-rebase. Included in H-2 append since it is now part of the migration history and schema.sql needs it for fresh-deploy parity.

**FK note for splice tables:** `splice_closure_public_tokens`, `splice_field_markups`, `splice_comments` FK to `splice_closures` and `splice_projects` which are created in migration 0001. These FKs succeed on fresh deploys only after migration 0001 runs. The Railway migration runner runs all migrations in order (0001 before 0012/0021), so this is safe in practice. Documented in a comment block in schema.sql.

**Verified by reading:** `migrations/0012_splice_field_markup.sql:26-77`, `migrations/0021_splice_comments.sql:7-24`, `migrations/0031_ec_wo_service_areas.sql:18-49`, `migrations/0032_job_assignments.sql:25-57`, `migrations/0033_projected_revenue_footage_trigger.sql:16-45`, `migrations/0034_fix_parent_id_cascade_to_restrict.sql:16-54`.

---

## H-3 — Schema drift: users table + 4 columns

**File:** `schema.sql` — `CREATE TABLE IF NOT EXISTS users (...)` inserted at line ~87 (after `staff`, before `projects`).

**Why before projects:** `billing_batches` (line ~362 after H-3 insert) FKs to `users(id)`. Placing users before all dependent tables ensures FK ordering is correct on a clean schema.sql run.

**4 columns added inline:**

| Column | Type | Purpose |
|---|---|---|
| `tokens_invalid_after` | `TIMESTAMPTZ` | Bumped on logout/password-change; `authMiddleware` checks JWT `iat` against this. Without it: session revocation silently breaks on fresh deploys — the entire logout-invalidation security mechanism is inoperative. |
| `theme` | `VARCHAR(10)` | User color-scheme preference (`'light'` / `'dark'` / NULL = system) |
| `extra_teams` | `TEXT[] DEFAULT '{}'` | Cross-team visibility memberships beyond primary `team` column |
| `dashboard_layout` | `JSONB DEFAULT '{}'::jsonb` | Per-user dashboard tile arrangement |

**auth.js coexistence:** `bootstrapAuthSchema()` in `auth.js` still runs its `ALTER TABLE users ADD COLUMN IF NOT EXISTS` statements — these become harmless no-ops when schema.sql is applied first. If auth.js runs first (e.g. Railway auto-migration before schema seed), `CREATE TABLE IF NOT EXISTS` is a no-op. Both paths idempotent.

**Verified by reading:** `auth.js:144-166` (CREATE TABLE + ALTER TABLE block); `schema.sql:87-116` (post-edit); `schema.sql:362-372` (billing_batches FK to users confirmed correct ordering).

---

## Negative findings (confirmed clean during H-1 route audit)

- `routes/projects.js`, `routes/undo.js`, `routes/time_entries.js`, `routes/permits.js`, `routes/project_documents.js`, `routes/dashboard.js`, `routes/inspection.js`, `routes/design_pipeline.js`, `routes/splice.js`, `routes/ai.js`, `routes/billing.js`, `routes/invoices.js`, `routes/revenue.js`, `routes/hours_csv.js` — all confirmed receiving `requireAuth` or `requireAdmin` (which implies auth) from server.js. No stub-firing gaps.
- `routes/admin.js`, `routes/customer_portal.js`, `routes/project_billing.js` — confirmed receiving `requireAdmin` or `requireAuth`. No gaps.

## Coverage gaps

- H-1 did not audit internal route logic for mis-gating (e.g. requireAuth(['admin']) on an endpoint that should be requireAuth() only). Only checked whether requireAuth was passed in the mw object vs. stub firing.
- H-2 did not pull full splice base table DDL from migration 0001 into schema.sql — that would complete schema parity for the entire splice subsystem but is beyond H-2 scope (estimated ~300 lines of additional DDL across 0001-0011).
- No Postgres available in CI to smoke-test schema.sql execution end-to-end. Manual inspection for syntax errors (no inline UNIQUE with expressions, correct $$ quoting in trigger, DO $$ guard). All patterns verified against known-working migration files.

=== WAVE 1.5 HIGH FIX REPORT END ===
