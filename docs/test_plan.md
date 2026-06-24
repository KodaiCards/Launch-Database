# Test Plan — DB-backed and E2E tests

> Owned by Claude 4 (quality track). Tests in `test/` that run with `node --test`
> and no DB are already written (Batch 1). This document covers what needs the
> dev-DB, Playwright, or small source exports before it can be automated.

---

## 1. Pure-function tests already passing (no DB, no deps)

### Batch 1 (merged ✓)

| File | Suites | Assertions | Notes |
|------|--------|------------|-------|
| `tests/csv_guard.test.js` | 4 | 17 | Inline copy of `csvCell` from `routes/hours_summary.js` / `routes/money_view.js` |
| `tests/aging_buckets.test.js` | 3 | 13 | Inline replica of bucket logic from `routes/money_view.js` |
| `tests/week_window.test.js` | 6 | 21 | Inline replica of week-window math from `routes/my_work.js` |

Run command: `node --test tests/csv_guard.test.js tests/aging_buckets.test.js tests/week_window.test.js`

### Batch 2 (branch `claude-4/quality` — 65 tests, all green)

| File | Suites | Assertions | Notes |
|------|--------|------------|-------|
| `tests/progress_math.test.js` | 4 | 17 | Inline replica of `calcProgress` from `routes/customer_portal.js` (SA card + dashboard progress) |
| `tests/revenue_group.test.js` | 5 | 16 | Inline reducer + label-format assertions for `/api/money/revenue` from `routes/money_view.js` |
| `tests/margin_variance.test.js` | 2 | 14 | Inline replica of variance calc + totals reducer from `routes/money_view.js` margin endpoint |
| `tests/contractor_guard.test.js` | 2 | 18 | Inline ownership predicate + money-stripping shaper from `routes/service_areas.js` |

Run command: `node --test tests/progress_math.test.js tests/revenue_group.test.js tests/margin_variance.test.js tests/contractor_guard.test.js`

Run all Batch 1 + 2 together: `node --test tests/csv_guard.test.js tests/aging_buckets.test.js tests/week_window.test.js tests/progress_math.test.js tests/revenue_group.test.js tests/margin_variance.test.js tests/contractor_guard.test.js`

---

## 2. Source changes that would improve direct testability

These are suggestions only — do **not** make the edits without CEO sign-off.

| File | Suggested change | Benefit |
|------|-----------------|---------|
| `routes/hours_summary.js` | Already exports `module.exports._helpers = { csvCell }`. If a future shared `lib/csv.js` is extracted, tests can `require('../lib/csv')` directly instead of inlining. | Eliminates inline copy drift |
| `routes/money_view.js` | Already exports `module.exports._helpers = { csvCell }`. Same as above. | Eliminates inline copy drift |
| `routes/money_view.js` | Extract the bucket-assignment loop into a named `ageBuckets(rows)` function and export it via `_helpers`. Currently the logic is inlined inside two separate `app.get` handlers (`/api/money/aging` and `/api/money/statement`). | Tests bind to real code; duplication eliminated |
| `routes/my_work.js` | Extract the week-window calculation into a named `currentWeekWindow(now)` function and export it via `module.exports._helpers`. | Tests bind to real code |
| `routes/customer_portal.js` | Extract `calcProgress(jobs)` (the SA card progress math, lines ~249–253) as a named export via `module.exports._helpers`. Currently inlined inside the `GET /api/customer/service-areas` handler. | Tests bind to real code; avoids inline copy drift |
| `routes/money_view.js` | Export `addVariance(rows)` and `calcTotals(rows)` via `_helpers`. Currently inlined in the `/api/money/margin` handler. | Tests for margin endpoint bind directly; the grand-variance computation path is verified in place |
| `routes/money_view.js` | Export `grandTotal(rows)` reducer via `_helpers`. Currently a one-liner inside both the margin and revenue handlers. | Shared tests for the reducer; prevents silent divergence if handlers are split |
| `routes/service_areas.js` | `nextStatus` / `prevStatus` are already exported via `module.exports._internal`. Add `ownsJob(job, caller)` predicate and the contractor `shapeJobResponse` shaper as named exports via `_internal`. Currently inlined in the time-entry POST handler. | Tests bind directly to production predicates |

---

## 3. DB-backed unit / integration tests (CI-run, require `DATABASE_URL`)

These should run against the Railway dev-DB (or a local pg instance after `npm run migrate`). Tag them `// CI-run` so they're skipped when `DATABASE_URL` is absent.

### 3.1 Auth / scope guards — every new endpoint

For each endpoint below, assert:
- `401` when no JWT cookie is present.
- `403` when the caller's role is insufficient (e.g. a `customer` hitting a `requireManagerOrAdmin` endpoint).
- `200` with correct scoping when the caller is authenticated with the minimum required role.

Endpoints to cover:

| Endpoint | Min role |
|----------|----------|
| `GET /api/my/jobs` | any authenticated |
| `GET /api/my/hours` | any authenticated |
| `GET /api/my/entries` | any authenticated |
| `GET /api/hours/summary` | manager or admin |
| `GET /api/hours/summary.csv` | manager or admin |
| `GET /api/money/margin` | manager or admin |
| `GET /api/money/aging` | manager or admin |
| `GET /api/money/revenue` | manager or admin |
| `GET /api/money/statement` | manager or admin |
| `GET /api/money/invoice/:id` | manager or admin |
| `GET /api/money/invoices.csv` | manager or admin |
| `GET /api/export/all.zip` | admin only |
| `GET /api/customer/service-areas` | customer role |
| `GET /api/customer/service-areas/:id/map` | customer role |
| `GET /api/customer/invoices` | customer role |
| `GET /api/customer/invoices/:id` | customer role |

### 3.2 Customer isolation — no cross-client data leak

Critical: a `customer` user linked to client A must never see data for client B.

Tests:
- Create two clients (A, B) and one customer user linked only to A.
- `GET /api/customer/service-areas` — response contains only client-A areas.
- `GET /api/customer/invoices` — response contains only client-A invoices.
- `GET /api/customer/projects` — response contains only client-A projects.
- `GET /api/customer/invoices/:id` with a client-B invoice id → 404.
- `GET /api/customer/projects/:id` with a client-B project id → 404.
- `GET /api/customer/service-areas/:id/map` with a client-B area id → 404.

### 3.3 Contractor IDOR guard for `/api/my/*`

- User A calls `GET /api/my/jobs` — response must not include jobs assigned to user B.
- User A calls `GET /api/my/hours` — response must not include hours for user B.
- User A calls `GET /api/my/entries` — response must not include entries for user B.

### 3.4 No-dollar leak in customer service-areas endpoint

- `GET /api/customer/service-areas` response must not contain any of these keys: `rate`, `estimated_amount`, `actual_amount`, `billing_type`, `billed_date`, `notes` (service area internal field), `assigned_staff_id`, `assigned_user_id`.
- This guards against the "if you extend the job object below, do NOT add a money column" note in customer_portal.js.

### 3.5 No-dollar leak in `/api/my/*` endpoints

- `GET /api/my/jobs` and `GET /api/my/hours` responses must not expose `rate`, `estimated_amount`, or `actual_amount` fields.

### 3.6 AR aging bucket totals match grand total (DB-round-trip)

- Populate the dev-DB with a few test invoices at known ages (e.g. 0, 30, 31, 60, 61, 90, 91 days old).
- `GET /api/money/aging` — assert that `grand_total === sum of bucket totals` and that individual invoices land in the correct bucket.

### 3.7 Billing recompute — `/api/money/margin` reflects billed status changes

- Create a service area with two jobs: one `status='active'`, one `status='billed'`.
- `GET /api/money/margin` — assert `billed_total` equals only the billed job's `actual_amount`.
- Flip first job to `billed`.
- Re-fetch — assert `billed_total` now includes both jobs.

### 3.8 `GET /api/money/statement` requires `client_id` param

- Call without `?client_id=` → 400.
- Call with a non-existent client_id → 404.
- Call with a valid client_id → 200 with correct structure.

### 3.9 CSV guard survives round-trip through the DB

- Insert a service-area job whose name starts with `=` (formula injection string).
- `GET /api/hours/summary.csv` — assert the value in the CSV is prefixed with `'`.
- `GET /api/money/invoices.csv` — assert a client named `+foo` appears as `'+foo` in the CSV.

---

## 4. Playwright E2E tests (CI-run, require live server + browser)

File: `tests/e2e/customer_portal.spec.js` (Playwright).

### 4.1 Customer portal — service areas page loads

- Log in as a customer user.
- Navigate to the customer portal.
- Assert the service-areas tab renders job status pills.
- Assert no dollar amounts are visible anywhere on the page.

### 4.2 Customer portal — map download

- For a service area with `has_map = true` and `client_visible = true`, clicking the map icon triggers a file download (Content-Disposition: attachment).

### 4.3 Customer portal — invoice list excludes drafts

- Create a draft invoice for a client.
- Log in as a customer linked to that client.
- Assert the invoice list page does NOT show the draft invoice.

### 4.4 Contractor my-hours strip

- Log in as a contractor with time entries this week.
- Navigate to the timeclock portal (or `GET /api/my/hours`).
- Assert the "this week" total is correct and the per-job breakdown is shown.

---

## 5. Notes on running CI tests

- All DB-backed tests should read `process.env.DATABASE_URL` and skip with `it.skip` if absent.
- Playwright tests should skip if `PLAYWRIGHT_BASE_URL` is unset.
- Suggested file layout: `test/db/` for integration tests, `test/e2e/` for Playwright.
- When `module.exports._helpers` is used (hours_summary, money_view, export_bundle), import via `require('../routes/hours_summary')._helpers.csvCell` — this still pulls in the pg dependency, so those tests remain DB-infrastructure-required unless the fn is extracted to `lib/csv.js`.
