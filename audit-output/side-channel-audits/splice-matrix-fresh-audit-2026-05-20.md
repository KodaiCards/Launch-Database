# Splice-Matrix Branch Fresh Audit
**Branch:** `claude/splice-matrix-railway-setup-IIG3Q`
**Date:** 2026-05-20
**Agent:** `agent/splice-matrix-fresh-audit`
**Write-path constraint acknowledged:** `audit-output/side-channel-audits/splice-matrix-fresh-audit-2026-05-20.md` only — no code files modified.

---

## Audit Scope

The branch sits 9 commits ahead of where main diverged from it. Three of those
commits (ebe1b23, f828738, 48d67e7) were confirmed already merged into main in
a prior audit session. This report focuses on the 6 remaining unique commits:

| SHA | Title | Verdict |
|---|---|---|
| `1a29a97` | Fix: unbilled-row dedup + audit-table retention | ALREADY_RESOLVED |
| `0490dd5` | Feature: track billed vs unbilled hours from timeclock CSVs | ALREADY_RESOLVED |
| `8984f52` | Test: replace AbortController abort with reader.cancel in SSE leak test | ALREADY_RESOLVED |
| `9c1bcca` | Fix: stale-tab SSE hooks never fired due to showView load-order race | ALREADY_RESOLVED |
| `437c8eb` | Plan: queue 5 scale follow-ups surfaced during SSE/CTE pass | SCRAP (data preserved on main) |
| `8c15796` | Plan: commit to full SSE coverage for live views | SCRAP (data preserved on main) |

**Summary: every unique commit is either already on main or doc-only data already captured in `PORTAL_LAUNCHER_PLAN.md`. The branch can be safely deleted.**

---

## Detailed Findings Per Commit

### 1a29a97 — Fix: unbilled-row dedup + audit-table retention

**Problem the commit solved:**
(a) Re-importing a timeclock CSV created duplicate unbilled rows because the
dedup match key used `project_id` (NULL for unbilled rows), so every pass
classified them as new. The fix introduced `UNB:<category>` standing in for
`project_id` in the match key and a separate `WHERE project_id IS NULL AND
is_billable = FALSE` lookup query.

(b) `time_entry_audit` grew unbounded. The fix adds `runAuditCleanup()` in
`automation.js` (drops `meaningful=FALSE` rows >90 days, ANY rows >18 months,
then VACUUM), wires it into the daily scheduler, and adds two admin endpoints:
`GET /api/_admin/db-sizes` and `POST /api/_admin/audit-cleanup`.

**Status on main:**

- `routes/hours_csv.js` — unbilled dedup logic (`unbilledMatchKeys`, `UNB:<category>` match key) confirmed present at lines 561-630.
  - **IMPORTANT REGRESSION NOTE:** The branch version uses `fs.unlinkSync` (sync) and lacks the upload concurrency semaphore. Main is strictly better: uses `fs.promises.unlink` (async), has `withUploadSlot()` concurrency semaphore (UPLOAD_CONCURRENCY_MAX=2), and a rollup-safety guard (`return candidates.find(c => !c.is_rollup) || null` instead of branch's `return candidates[0]`). Do NOT cherry-pick hours_csv.js from the branch.
- `automation.js` — `runAuditCleanup()` confirmed at line 1793; wired into scheduler at line 1893; exported at line 1943.
- `routes/admin.js` — `GET /api/_admin/db-sizes` at line 403; `POST /api/_admin/audit-cleanup` at line 452. Both confirmed present.
- `tests/csv_import.test.js` — dedup test at line 366 (`would_skip_duplicate: 3`) confirmed present.
- `tests/audit_cleanup.test.js` — file exists in main's tests/ directory.
- `auth.js` — **branch version is weaker than main.** Branch introduced `if (process.env.NODE_ENV === 'test') return true` (single-flag bypass). Main's security fix (Item 13) requires BOTH `NODE_ENV=test` AND `LFS_DISABLE_RATELIMIT_FOR_TESTS=1`. Do NOT cherry-pick auth.js from the branch — doing so would regress a security control.

**Verdict:** ALREADY_RESOLVED — all functional changes on main, and main is strictly better in hours_csv.js and auth.js.

**Recommended action:** SCRAP — do not cherry-pick. The functional fix is on main in a better form.

---

### 0490dd5 — Feature: track billed vs unbilled hours from timeclock CSVs

**Problem the commit solved:** Timeclock rows with placeholder customer labels
(Miscellaneous, Permitting, bare WO#) were silently dropped. This feature
persists them as `project_id=NULL`, `is_billable=FALSE`, `unbilled_category`
in time_entries, adds a per-category Hours tab panel, and adds a
`/api/revenue/hours-utilization` endpoint.

**Status on main:**

- `migrations/0029_time_entries_billable.sql` — exists in migrations/.
- `routes/hours_csv.js` — `classifyUnbilled()` at line 108, `detectColumns()` at line 73, `is_billable`/`unbilled_category` flow confirmed at lines 447-511.
- `routes/revenue.js` — `/api/revenue/hours-utilization` endpoint confirmed at line 241 with `billed_hours`, `unbilled_hours`, per-category breakdown.
- `routes/time_entries.js` — `?billable=billed|unbilled|all` filter confirmed.
- `public/js/unbilled_hours_panel.js` — file exists in public/js/.
- `public/admin.html` — referenced in the page.

**Verdict:** ALREADY_RESOLVED — entire feature is on main.

**Recommended action:** SCRAP — nothing to cherry-pick.

---

### 8984f52 — Test: replace AbortController abort with reader.cancel in SSE leak test

**Problem the commit solved:** `ac.abort()` leaked an AbortError past test end
as an unhandledRejection from undici. `reader.cancel()` terminates cleanly.

**Status on main:**

`git diff main origin/claude/splice-matrix-railway-setup-IIG3Q -- tests/sse_leak.test.js` returned **empty diff**. The test file is byte-for-byte identical on both branches. This fix is on main.

Verified by reading: `tests/sse_leak.test.js:56-59`:
```js
// Close from the client side via reader.cancel(). This terminates the
...
await Promise.all(readers.map(r => r.cancel().catch(() => {})));
```

**Verdict:** ALREADY_RESOLVED — identical on both branches.

**Recommended action:** SCRAP.

---

### 9c1bcca — Fix: stale-tab SSE hooks never fired due to showView load-order race

**Problem the commit solved:** Tab modules loaded synchronously before admin.html's
inline `<script>` block, so `window.showView` was undefined at IIFE execution time.
All six `_prevShowView*` wrap closures captured `undefined` and the
`if (typeof _prevShowView === 'function')` guard silently skipped hook bodies.

The fix replaced the wrap pattern with a push onto `window._showViewHooks`
(lazy-init via `||= []`) and added a `forEach` walk at the end of `showView`.

**Status on main:**

- `public/admin.html` lines 3101 and 3125:
  ```js
  window._showViewHooks = window._showViewHooks || [];
  ...
  window._showViewHooks.forEach(fn => fn(view));
  ```
- All 6 tab modules use `_showViewHooks` on main:
  - `billing_tab.js` line 362
  - `dashboard_views.js` line 437
  - `hours_tab.js` line 719
  - `inspection_tab.js` line 324
  - `projects_tab.js` line 366
  - `revenue_tab.js` line 309

Zero uses of `_prevShowView` anywhere in main's codebase.

**Verdict:** ALREADY_RESOLVED — fix is fully on main.

**Recommended action:** SCRAP.

---

### 437c8eb — Plan: queue 5 scale follow-ups surfaced during SSE/CTE pass

**Content:** Doc-only commit to `PORTAL_LAUNCHER_PLAN.md` capturing 5 N+1/unbounded-query scale follow-ups (S-1 through S-5).

**Status on main:**

`PORTAL_LAUNCHER_PLAN.md` lines 601-673 contain the identical "Scale follow-ups (queued)" section with all 5 items.

**Current fix state of each item on main:**

| Item | Description | Status on main |
|---|---|---|
| S-1 | N+1 in monthly invoice builder (`billing.js:83-91`) | **STILL_PRESENT** — each monthly project fires a separate `SELECT SUM(hours)` per period. Real at 50+ monthly projects. |
| S-2 | N+1 in `findLeafFor()` rollup reattribution (`admin.js:789-817`) | **STILL_PRESENT** — `targetCache` reduces repeat calls but first-touch per `(rollup_id, job_name)` combo is a CTE. Low urgency (runs on admin action, not per-request). |
| S-3 | Unbounded `SELECT * FROM projects WHERE id = ANY(...)` in `billing.js:44` | **STILL_PRESENT** — no LIMIT, no column projection. Low risk given caller scoping. |
| S-4 | `dashboard.js` ytd_revenue scalar subquery per row | **MITIGATED** — `getYtdRevenue()` function added with 1-hour in-memory cache (`YTD_CACHE_TTL_MS`, line 23). Not structurally fixed but impact dramatically reduced. |
| S-5 | SSE reconnect `setTimeout` can stack on bursty proxy errors | **STILL_PRESENT** — `admin.html:8475-8480` sets `_sseSource = null` then `setTimeout(startSse, 5000)` with no `_reconnectTimer` guard. Edge case only; requires concurrent error events before `close()` completes. |

**Verdict:** SCRAP (the planning document data is preserved on main). The 5 unfixed items (S-1, S-2, S-3, S-5 remain; S-4 mitigated) are actionable scope for a future performance wave but are NOT blockers.

**Recommended action:** Close the branch. Open a focused N+1 perf wave against main when S-1 or S-2 start biting in production (500+ monthly projects or busy admin reattribution sessions).

---

### 8c15796 — Plan: commit to full SSE coverage for live views

**Content:** Doc-only commit to `PORTAL_LAUNCHER_PLAN.md` listing outstanding admin-portal views still polling-only.

**Status on main:**

`PORTAL_LAUNCHER_PLAN.md` lines 552-577 contain the identical "Coverage commitment" section. The outstanding views listed (loadPipeline, loadPotential, loadDesign, loadPermits, refreshProjectDetail, refreshApprovalsBadge) are partially addressed:

| Handler | SSE Coverage on main |
|---|---|
| `loadDesign` | **COVERED** — `design_potential_tabs.js:255` subscribes to `project_*` + `time_entry_*` events |
| `loadPotentialPermits` | **COVERED** — `design_potential_tabs.js:258` subscribes to `project_*` events |
| `loadPermits` | **COVERED** — `permits_tab.js:279-290` has `_permitDebounce` with SSE subscription |
| `loadPipeline` | **NOT COVERED** — `permitting.html` function, no SSE listener wired in admin context |
| `refreshProjectDetail` | **NOT COVERED** — no SSE listener for project detail popup |
| `refreshApprovalsBadge` | **NOT COVERED** — uses `setInterval(30000)` at `admin.html:7005` |

3 of 6 outstanding views now have SSE coverage; 3 remain polling-only.

**Verdict:** SCRAP (planning data is on main). Open a targeted SSE completion wave for the 3 remaining polling-only handlers if stale-data complaints arise.

---

## Confirmed Clean on Main (What's Checked, No Issues Found)

- CTE depth guard (`depth < 10`) present in `routes/admin.js:554,615,803` and `routes/projects.js:110`.
- SSE memory leak purge pattern fully implemented in `routes/_sse.js:55-217`.
- 60s poll interval confirmed at `public/admin.html:8353` (`POLL_MS = 60000`).
- `_showViewHooks` pattern working correctly on all 6 tab modules.
- `reader.cancel()` pattern in SSE leak test identical to branch fix.
- Unbilled dedup match key with `UNB:<category>` confirmed in `routes/hours_csv.js`.
- `runAuditCleanup()` daily scheduler wiring at `automation.js:1893`.
- Admin diagnostic endpoints at `routes/admin.js:403` and `routes/admin.js:452`.

## Coverage Gaps (What I Did Not Reach)

- Did not audit the branch's full history (commits before ebe1b23) — those were confirmed resolved in a prior audit session and are out of scope.
- Did not verify Playwright / browser smoke tests between branch and main.
- Did not assess `HANDOFF_NEXT_PM.md` (branch-only file) for any decisions not already captured in CLAUDE.md or PORTAL_LAUNCHER_PLAN.md — that file was a temp handoff to the next session's PM and has no persistent value.

---

## Recommended Next Actions

1. **Delete the branch** — `git push origin --delete claude/splice-matrix-railway-setup-IIG3Q`. All functional work is on main in equal or better form.
2. **Do NOT cherry-pick `auth.js` from the branch** — it regresses the dual-flag rate-limiter security control.
3. **Do NOT cherry-pick `routes/hours_csv.js` from the branch** — main's version is strictly better (async file ops, upload concurrency semaphore, rollup-safety guard in `pickProject`).
4. **Open a perf wave when scale issues bite** — S-1 (billing N+1) is the most likely to surface first in production. Fix shape is in `PORTAL_LAUNCHER_PLAN.md:608-619`.
5. **Open SSE completion wave for 3 remaining polling-only handlers** when stale-data UX issues surface: `loadPipeline`, `refreshProjectDetail`, `refreshApprovalsBadge`.

---

=== SPLICE-MATRIX BRANCH FRESH AUDIT REPORT END ===
