# Fresh audit: claude/scale-pass-sse-cte against current main
# Conducted 2026-05-20 — agent/scale-pass-fresh-audit

Write-path constraints acknowledged: only `audit-output/side-channel-audits/scale-pass-fresh-audit-2026-05-20.md` written.

## Purpose

The original 2026-05-15 audit (`scale-pass-sse-cte-audit.md`) returned MERGE_NOW for all three commits.
Since then main diverged significantly (Wave 1.6 SSE channel-pinning security fix at f2f9349,
Wave 3 BE-Perf at 20560fe, etc.). A cherry-pick of ebe1b23 against current main HEAD produces
CONFLICTS in `routes/_sse.js` and `tests/sse_leak.test.js`.

This re-audit determines whether each commit's underlying problem is still present on main, or
already resolved — and if the cherry-pick conflict is because the code was already integrated.

---

## Investigation findings

### Step 1 — git log on _sse.js since May 15 reference point

```
git log --all --oneline --follow -- routes/_sse.js
c22a507 T15 Polish-A: 6-finding fix wave (HIGH physics error + structural + DAG)
f2f9349 fix(security): HIGH tier — bypass token timing, AI write_sql, SSE channel pinning
ebe1b23 SSE: fix memory leak — purge dead connections eagerly on write failure
223dc63 SSE: shared broadcast module + /api/events/stream endpoint
```

Main commit f2f9349 (2026-05-09) **explicitly built on top of ebe1b23's code**. The ancestry path
shows that ebe1b23 was already merged into main before f2f9349 ran:

```
git show 2b6eea0 --stat (truncated):
commit 2b6eea0f0c9a8902814b9289775b9fdf775debf6
Merge: 437c8eb 48d67e7
  "Merge scale-pass-sse-cte: SSE leak fix + 60s polling + CTE bounds"
  # Conflicts resolved:
  #       tests/browser/projects_tree_state.spec.js
  routes/_sse.js           | 62 changes
  routes/dashboard.js      |  4 changes
  routes/project_detail.js | 14 changes
  routes/projects.js       |  4 changes
  tests/sse_leak.test.js   | 73 added
```

**All three commits were merged into main at 2b6eea0 on 2026-05-08**, before the May 15 audit
even ran. The May 15 audit assessed the branch as-if unmerged; the branch was already in main.

The cherry-pick conflict arises because f2f9349 (May 9) further modified `_sse.js` on top of
ebe1b23 (adding `_resMeta`, session re-validation, pool parameter). Cherry-picking ebe1b23 onto
HEAD conflicts because HEAD already contains ebe1b23's content PLUS the additional session-
revalidation layer — git cannot auto-apply ebe1b23's additions without conflicting with the
already-present lines.

---

### Step 2 — Commit ebe1b23 (SSE memory leak): ALREADY_RESOLVED

**Problem:** broadcast() caught write errors but left dead `res` objects in the Set, relying solely
on `req.on('close')`. Railway's proxy drops TCP without FIN, so 'close' sometimes never fires.

**Current main `routes/_sse.js` status:**

All three elements of the branch's SSE fix are present on main:

1. `_resChanMap` reverse index (line 39): PRESENT
   ```javascript
   const _resChanMap = new Map(); // res -> Set<channel>
   ```

2. `_purge(res)` function with O(1) cleanup (lines 55-66): PRESENT
   ```javascript
   function _purge(res) {
     const chans = _resChanMap.get(res);
     if (!chans) return;
     for (const channel of chans) { ... set.delete(res); }
     _resChanMap.delete(res);
     _resMeta.delete(res);  // extra: session metadata cleanup added by f2f9349
   }
   ```

3. `broadcast()` write-return-check with eager purge (lines 83-87): PRESENT
   ```javascript
   for (const res of [...subs]) {
     let ok;
     try { ok = res.write(data); } catch { ok = false; }
     if (ok === false) _purge(res);
   }
   ```

4. Heartbeat write-return-check with clearInterval+purge (lines 205-210): PRESENT
   ```javascript
   let ok;
   try { ok = res.write(`: ping\n\n`); } catch { ok = false; }
   if (ok === false) {
     clearInterval(heartbeat);
     _purge(res);
   }
   ```

5. `_subscriberCount()` exported for testing (line 91-94): PRESENT

6. `tests/sse_leak.test.js` (66 lines, refined at 8984f52): PRESENT
   — AbortController abort replaced with `reader.cancel()` to fix unhandledRejection in test teardown.
   — Test asserts `_subscriberCount() === 0` after N connections closed.

Main's `_sse.js` is a strict SUPERSET of the branch's fix — it additionally adds `_resMeta` for
session re-validation (f2f9349 Item 15 security fix) on top of ebe1b23's base memory-leak fix.

**Verdict: ALREADY_RESOLVED** — merged at 2b6eea0, further extended by f2f9349.
**No fix needed. No cherry-pick needed. Branch can be deleted.**

---

### Step 3 — Commit f828738 (poll tune 8s → 60s): ALREADY_RESOLVED

**Problem:** admin.html POLL_MS was 8000 (8s), firing 7 redundant re-renders/minute/tab —
OOM suspect now that SSE covers most write paths.

**Current main `public/admin.html` status:**

```javascript
// Line 8353
const POLL_MS = 60000;
```

POLL_MS is already 60000 on main. Value confirmed by grep.

The browser spec `tests/browser/projects_tree_state.spec.js` was also updated at the merge:
— Comment at line 6: "With POLL_MS now 60s, SSE is the primary refresh path"
— Test uses `CustomEvent('sse:project_updated')` rather than `waitForTimeout(9000)`

**Verdict: ALREADY_RESOLVED** — merged at 2b6eea0.
**No fix needed. No cherry-pick needed.**

---

### Step 4 — Commit 48d67e7 (CTE depth guard): ALREADY_RESOLVED

**Problem:** routes/projects.js, routes/dashboard.js, routes/project_detail.js had unbounded
UNION ALL recursive CTEs — a Postgres runaway risk on parent_id cycles or malformed deep trees.

**Current main status — all three files:**

`routes/projects.js` (line 107-110):
```sql
WITH RECURSIVE tree AS (
  SELECT p.id AS tid, 0 AS depth
  UNION ALL
  SELECT c.id, t.depth + 1 FROM projects c JOIN tree t ON c.parent_id = t.tid WHERE t.depth < 10
```
DEPTH GUARD PRESENT.

`routes/dashboard.js` (lines 177-180):
```sql
WITH RECURSIVE tree AS (
  SELECT p.id AS tid, 0 AS depth
  UNION ALL
  SELECT c.id, t.depth + 1 FROM projects c JOIN tree t ON c.parent_id = t.tid WHERE t.depth < 10
```
DEPTH GUARD PRESENT.

`routes/project_detail.js` — three CTEs:
- `subtree` (lines 46-50): `WHERE s.depth < 10` — PRESENT
- `child_tree` (lines 109-112): `WHERE ct.depth < 10` — PRESENT
- `descendants` (lines 127-130): `WHERE d.depth < 10` — PRESENT

**Bonus check — no new unbounded CTEs introduced since the merge:**

Searched all files in routes/ for `WITH RECURSIVE` without `depth < ` on the UNION ALL arm:

```
routes/_helpers.js:93   WHERE t.__depth < 30  ← present (different cap, still bounded)
routes/admin.js:554     WHERE la.depth < 10   ← present
routes/admin.js:615     WHERE la.depth < 10   ← present
routes/admin.js:803     WHERE d.depth < 10    ← present
routes/hours_csv.js:338 WHERE w.depth < 10    ← present
routes/inspection.js:175 WHERE lc.depth < 10  ← present
routes/inspection.js:317 WHERE lc.depth < 10  ← present
```

Zero unbounded recursive CTEs found on current main.

**Verdict: ALREADY_RESOLVED** — merged at 2b6eea0.
**No fix needed. No cherry-pick needed.**

---

## Why the cherry-pick conflicts (root cause explanation)

The three branch commits landed in main at merge commit 2b6eea0 (2026-05-08 18:11 UTC). One day
later, f2f9349 (2026-05-09 05:39 UTC) modified `routes/_sse.js` further for the Item 15 security
fix (session re-validation, `_resMeta` map, pool parameter). An additional commit c22a507 (T15
Polish-A) recreated `_sse.js` as a new file (likely after a delete/recreate during OSP training
branch merge work) — but its content matches the post-f2f9349 state exactly.

Cherry-picking ebe1b23 onto HEAD conflicts because:
1. HEAD's `_sse.js` already contains everything ebe1b23 adds PLUS the f2f9349 additions.
   Git cannot cleanly apply ebe1b23's hunks — they are already present in a different context.
2. HEAD's `tests/sse_leak.test.js` is a refined version of ebe1b23's new file (8984f52 changed
   AbortController to reader.cancel()). Cherry-picking ebe1b23 tries to add the file again — add/add conflict.

The conflict is a false alarm — it indicates the fix is already present, not that it needs to be applied.

---

## Final verdict matrix

| Commit | Title | Verdict | Rationale | Fix shape if needed |
|---|---|---|---|---|
| `ebe1b23` | SSE memory leak — purge dead connections eagerly on write failure | **ALREADY_RESOLVED** | All 3 functional elements (`_resChanMap`, `_purge()` with eager-purge-on-write-fail in `broadcast()`, heartbeat write-check) are present on current main. Main additionally has `_resMeta` + session re-validation from f2f9349. `tests/sse_leak.test.js` present and refined. | N/A — do not cherry-pick |
| `f828738` | Poll: 8s → 60s recovery heartbeat | **ALREADY_RESOLVED** | `POLL_MS = 60000` confirmed on line 8353 of `public/admin.html`. Browser spec updated to SSE-driven test. Merged at 2b6eea0. | N/A — do not cherry-pick |
| `48d67e7` | CTE: depth < 10 guard on unbounded recursive queries | **ALREADY_RESOLVED** | All 5 target CTE sites (projects.js ×1, dashboard.js ×1, project_detail.js ×3) have `WHERE depth < 10` guards. Zero unbounded recursive CTEs exist anywhere in routes/ on current main. Merged at 2b6eea0. | N/A — do not cherry-pick |

**Branch disposition: SAFE TO DELETE.** All three fixes are fully integrated into main. The
`claude/scale-pass-sse-cte` remote branch can be deleted without losing any code.

---

## Negative findings (confirmed clean on main)

- No unbounded recursive CTEs anywhere in routes/ — complete scan performed.
- SSE broadcast() purge-on-write-fail: correctly uses Set snapshot (`[...subs]`) before iterating
  to prevent iterator invalidation. Correct.
- SSE _purge() is idempotent (guards on `_resChanMap.has(res)`). Double-call safe.
- Heartbeat does `clearInterval(heartbeat)` before `_purge(res)` — prevents re-entry. Correct.
- `_subscriberCount()` exposed in module.exports for test use.
- SSE leak test uses `reader.cancel()` (not AbortController abort) — no unhandledRejection leakage.

## Coverage gaps

- Did not re-audit Splice Matrix's separate SSE in `routes/splice.js` — that is explicitly out of
  scope per the branch's own commit message ("intentionally separate").
- Did not verify Railway CI run on HEAD — no DATABASE_URL in this env; structural check only.

=== SCALE-PASS-FRESH-AUDIT REPORT END ===
