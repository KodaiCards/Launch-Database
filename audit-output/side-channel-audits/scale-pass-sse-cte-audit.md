# Side-channel audit: claude/scale-pass-sse-cte

Audited 2026-05-15. Branch is 3 commits ahead of main. All SHAs verified via `git log` and `git show`. Diffs read directly against main for each affected file.

## Stack snapshot (≤80 words)

Three independent, surgical changes targeting two separate scaling hazards and one dead-weight polling burden. Commit 1 (SSE memory leak) is the highest-value item — Railway's proxy can silently drop TCP without FIN, causing res objects to accumulate per tab reload. Commit 2 (CTE depth guard) eliminates a Postgres runaway risk on malformed parent_id cycles. Commit 3 (poll tune) reduces redundant re-renders from 7/min to 1/min per tab.

## Per-commit audit (3 rows)

| SHA | Title | Files | Real fix? | Risk if merged | Recommendation |
|---|---|---|---|---|---|
| `ebe1b23` | SSE: fix memory leak — purge dead connections eagerly on write failure | `routes/_sse.js` (+62 −13), `tests/sse_leak.test.js` (new, +73) | **YES.** Adds `_resChanMap` reverse index, purges on `write()===false` in `broadcast()`, and purges on failed heartbeat write. Closes the Railway-proxy FIN-drop hole. `req.on('close')` retained as primary path. Test opens N real HTTP connections, aborts them, asserts `_subscriberCount()===0`. | Low. Purge is idempotent; Set.delete on a missing entry is a no-op. Snapshot-before-iterate (`[...subs]`) prevents iterator invalidation during purge-in-loop. Heartbeat clearInterval before purge prevents double-fire. No API shape change. | MERGE_NOW |
| `f82873` | Poll: 8s → 60s recovery heartbeat now that SSE covers most writes | `public/admin.html` (+6 −16 comment + value), `tests/browser/projects_tree_state.spec.js` (+22 −24) | **YES.** SSE landed in prior commits covers loadProjects/loadHours/loadBilling/loadRevenue/loadDashboard paths. 8s poll was firing 7 redundant re-renders/min/tab — OOM suspect. Poll retained at 60s for SSE reconnect gap coverage and for views not yet SSE-wired (pipeline, permits, etc.). Browser spec rewritten: drops `waitForTimeout(9000)`, uses synthetic `CustomEvent('sse:project_updated')` instead — test runs faster AND exercises the real SSE code path. | Low-medium. Stale-data window for non-SSE views increases from ~10s to ~65s (worst case: SSE drop + reconnect gap + 60s poll). Acceptable given the views listed (pipeline, permits, design) are lower-frequency read surfaces. Admin users on SSE-wired views see no change. | MERGE_NOW |
| `48d67e7` | CTE: add depth < 10 guard to all unbounded recursive tree queries | `routes/projects.js` (+2 −2), `routes/dashboard.js` (+2 −2), `routes/project_detail.js` (+8 −8) | **YES.** Three files had unbounded `UNION ALL` recursive CTEs. Commit adds `0 AS depth` to anchor, `t.depth + 1` in recursive arm, `WHERE t.depth < 10` guard. `depth` is NOT projected in any outer SELECT — verified by reading each CTE's outer query. The commit correctly identified already-bounded files (`inspection.js`, `hours_csv.js`, `admin.js`) and left them untouched — confirmed by grep. No behavior change for well-formed data (tree depth ≤10 nodes). | Very low. Depth limit of 10 is consistent with the existing cap in `invoice_generator.js`, `inspection.js`, `admin.js`. Project trees deeper than 10 levels would silently truncate revenue rollup — but no such structure exists in the data model (3-level max: client→service_area→job). No test coverage for the guard itself (no negative test seeding a cycle), but the risk surface is internal/admin-only Postgres queries, not user-writable paths. | MERGE_NOW |

## Final recommendation

**MERGE_NOW** — all three commits are real, surgical fixes for real production risks. No regressions introduced. Two of three have test coverage; the CTE guard has no negative-cycle test but the risk surface is internal-only and the pattern is already established in 5 other files.

## Findings

### F1 — SSE heartbeat: clearInterval called before _purge (minor sequencing note)

In `attach()`, the heartbeat interval callback does `clearInterval(heartbeat); _purge(res)`. This is correct — clearing the interval first prevents a second heartbeat firing between the clear and the purge. The original `req.on('close')` path calls `cleanup()` which also does `clearInterval(heartbeat); _purge(res)`. Since `_purge()` is idempotent (guards on `_resChanMap.has(res)`), double-call is harmless. No action needed.

### F2 — Poll commit: non-SSE view staleness window not documented in UI

The 60s poll covers views like pipeline, permits, design — but there's no visible "last updated" indicator or toast for these views. If SSE drops silently and the 60s recovery hasn't fired, users may see stale data without knowing it. This is a pre-existing gap (the 8s poll had the same blind spot, just a shorter window). **Not a blocker for merge** — flag for a future UI-freshness indicator wave.

### F3 — CTE depth: no automated test for the cycle/runaway guard

`tests/sse_leak.test.js` is new and clean. The CTE depth guard has no regression test seeding a parent_id cycle and asserting the query terminates. The guard is consistent with 5 existing depth-guarded files and the production data model has no trees deeper than 3 levels. **Not a blocker for merge** — flag as a test-coverage gap for the schema/migration test wave.

### Confirmed clean (negative findings)

- `_resChanMap` reverse index: correctly initialized in `_subscribe()`, correctly cleared in `_purge()`, never accessed outside `_sse.js`. No global state leak.
- `broadcast()` set snapshot (`[...subs]`) before iterating: prevents Set iterator invalidation when `_purge()` deletes from the set mid-loop. Pattern is correct.
- `depth` column in all 3 CTE changes: not present in any outer `SELECT` column list. Result shape unchanged. Verified by reading the surrounding 20+ lines of each CTE.
- Already-bounded files (`inspection.js` ×2 CTEs, `admin.js` ×4 CTEs): confirmed `WHERE lc.depth < 10` / `WHERE ... depth < 10` present on main before this branch. Commit correctly left them alone.
- Browser spec rewrite: `waitForTimeout(9000)` dropped in favor of synthetic `CustomEvent` + `waitForTimeout(2600)`. The 2.6s covers 500ms debounce + ~2s API round-trip. Not brittle — the assertion is on DOM visibility after re-render, not on timing.

=== SSE-CTE BRANCH AUDIT END ===
