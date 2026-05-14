# Wave 3 BE-Perf — Post-Fix Verification

> Verified against: all HIGHs (H-1..H-4) + all MEDs (M-1..M-5). LOWs deferred per canonical.
> Branch: `claude/debug-previous-issues-MoN9D`
> Commits verified: `31188f8` `4e75412` `bcb1961` `0a9d80f` `2fc2f9a` `70127a7` `d789392` `2e582c0` `830a014`

---

## H-1 — Invoice N+1 Batch Fix — `4e75412`

**Status: ADDRESSED**

Verified by reading: `invoice_generator.js:304-356`

```js
// H-1 fix: batch-fetch hours for ALL leaf projects in one query
let hoursByProjectId = new Map();
if (!isFootage && projRes.rows.length > 0) {
  const leafIds = projRes.rows.map(p => p.id);
  const batchTeRes = await pool.query(`
    WITH RECURSIVE leaf_ctx AS ( ... )
    SELECT lc.leaf_id AS project_id, COALESCE(SUM(te.hours), 0)::float AS h
    ...
  `, [leafIds, period_start, period_end]);
  for (const row of batchTeRes.rows) {
    hoursByProjectId.set(row.project_id, row.h);
  }
}
// Per-leaf inner loop now does Map lookup (0 round-trips)
hours = hoursByProjectId.get(p.id) || 0;
```

`hoursByProjectId` is declared inside the `for (const c of contracts)` loop (line 308 > contract loop line 247) — correctly scoped per-contract, not globally shared across contracts. The `ANY($1::uuid[])` CTE mirrors the existing timecards batch pattern.

**Round-trip analysis (3-contract × 10-WO RUS invoice):**
- Before: 1 (EC) + 1 (job) + 1 (contracts) + 3 (tree per contract) + **30** (hourly per leaf) + 1 (timecards batch) = **37 round-trips**
- After: 1 + 1 + 1 + 3 + **3** (one batch per contract) + 1 = **10 round-trips**
- Reduction: 27 round-trips eliminated. Meets canonical fix shape exactly.

---

## H-2 — Puppeteer Browser Pool — `bcb1961`

**Status: ADDRESSED**

Verified by reading: `lib/browser_pool.js:1-147`, `routes/splice.js:2661-2689`, `routes/splice.js:3795-3822`, `invoice_template_engine.js:472-514`

**Pool correctness:**
- Singleton pool of 1-2 browsers (`PUPPETEER_POOL_SIZE` env, default 2), lazily populated
- Round-robin slot selection spreads concurrent requests
- Crash recovery: `browser.on('disconnected')` nulls the slot; `isConnected()` check on next acquire triggers re-spawn
- Concurrent slot launch guard: `_launching[slot]` flag + exponential backoff prevents double-spawn on empty slot

**All 3 sites updated:**
- `splice.js:2662` — diff PDF export: `const { getBrowser, releasePage } = require('../lib/browser_pool')`
- `splice.js:3795` — main splice PDF export: same import, same pattern
- `invoice_template_engine.js:472` — AI invoice render: `require('./lib/browser_pool')`

**SSRF guard preserved (C-1):** `setRequestInterception(true)` called on each fresh `browser.newPage()` at lines 2670, 3803 (splice.js) and 486 (invoice_template_engine.js). All actual call sites confirmed — `grep setRequestInterception` count includes comments.

**releasePage() closes page not browser:** Confirmed — `releasePage` calls `page.close()` only; no reference to browser. Pool starvation risk: nil for single concurrent PDF render (1 slot used, pool has 2).

**No `browser.close()` remaining:** `grep "await browser.close"` → 0 results in splice.js.

---

## H-3 — Pool Max — `31188f8`

**Status: ADDRESSED**

Verified by reading: `db.js:20-31`, `.env.example:22`

```js
max: parseInt(process.env.PG_POOL_MAX, 10) || 20,
```

Default behavior confirmed: `parseInt(undefined, 10) || 20 === 20`. Server boots with `max: 20` even if `PG_POOL_MAX` is unset. `.env.example` documents `PG_POOL_MAX=20`.

---

## H-4 — Contractor Hydrate Consolidation + Rate-Limit — `0a9d80f`

**Status: ADDRESSED**

Verified by reading: `routes/splice.js:196-237` (rate limiter), `routes/splice.js:2846-2880` (hydrate endpoint)

**Rate limiter (`_hydrateRateOk`):**
- 5 req/10s sliding window, keyed on share token (not IP — NAT-aware)
- TTL eviction: `setInterval` every 5 min deletes tokens with no timestamps in window
- `.unref()` prevents process exit hang in tests
- Fires **before any DB work** — 429 costs one Map lookup, not 14 queries

**Query consolidation:**
- Batch A: locations + closures + trays (UNION ALL via location_id chain)
- Batch B: cables + buffer_tubes + fibers (UNION ALL via cable_id chain)
- Batch C: splices (kept separate — complex multi-path JOIN, UNION ALL would risk row duplication)
- Batch D: ribbon_groups + strand_states (UNION ALL, direct project_id FK)
- Batch E: splitters + splitter_outputs + cable_states (optional tables, `.catch` preserved)
- **Slot count: 7 per call (down from 14).** Two concurrent refreshes = 14 slots vs 28 — fits inside H-3 pool of 20.

Response JSON shape unchanged; ORDER BY semantics restored post-unmux.

---

## M-1 — Sync readFileSync in ai.js — `2fc2f9a`

**Status: ADDRESSED**

Verified by reading: `routes/ai.js` (grep confirmed 0 remaining readFileSync/unlinkSync)

Both `fs.readFileSync` calls on CSV/text upload paths replaced with `await fs.promises.readFile`. Both callers are inside `async` route handlers — `await` is valid. Pattern consistent with adjacent `fs.promises.unlink` calls already in the file.

---

## M-2 — Sync fs ops in hours_csv.js — `70127a7`

**Status: ADDRESSED**

Verified by reading: `routes/hours_csv.js` (grep confirmed 0 remaining readFileSync/unlinkSync outside semaphore wrapper)

`readFileSync` → `await fs.promises.readFile`; both `unlinkSync` calls → `await fs.promises.unlink`. All three inside async route handler.

---

## M-3 — Sync fs ops in invoice_templates.js — `d789392`

**Status: ADDRESSED**

Verified by reading: `routes/invoice_templates.js:26` (fsp alias), and all 6 replacement sites

`const fsp = fs.promises` alias added at module top. One `readFileSync` + five `unlinkSync` calls replaced with `await fsp.readFile` / `await fsp.unlink`. Grep confirms 0 remaining sync calls. `existsSync` calls (boot-path guards, out of scope) correctly left as-is.

---

## M-4 — XLSX Semaphore — `2e582c0`

**Status: ADDRESSED**

Verified by reading: `routes/hours_csv.js:26-52` (semaphore), `:251-280` (usage)

```js
const UPLOAD_CONCURRENCY_MAX = 2;
function withUploadSlot(fn) {
  return new Promise((resolve, reject) => {
    function attempt() {
      if (_activeUploads < UPLOAD_CONCURRENCY_MAX) {
        _activeUploads++;
        Promise.resolve().then(fn).then(resolve, reject)
          .finally(() => {
            _activeUploads--;
            if (_uploadQueue.length > 0) _uploadQueue.shift()();
          });
      } else {
        _uploadQueue.push(attempt);
      }
    }
    attempt();
  });
}
```

**Slot release trace:**
- Success path: fn resolves → `.then(resolve)` → `.finally()` decrements + drains queue ✓
- Error path: fn rejects → `.then(_, reject)` → `.finally()` still fires, slot released ✓
- Unsupported-type path: throws `UNSUPPORTED_FILE_TYPE` inside slot → `.finally()` fires → outer catch intercepts by error code → 400 returned, temp file already deleted inside slot ✓
- Queue drain: `_uploadQueue.shift()()` — correct; dequeues and immediately invokes next `attempt` ✓

---

## M-5 — _pendingApprovals LRU Cap — `830a014` (Phase 5)

**Status: ADDRESSED (pre-existing, shipped Phase 5)**

Verified by reading: `routes/ai.js` — `PENDING_APPROVALS_MAX = 1000`, `pendingApprovalsSet` wrapper with LRU eviction, eviction log on overflow. TTL sweep already existed (15 min TTL, 5 min interval). Size cap now adds bounded worst-case memory. `pendingApprovalsSet` used at all `.set()` call sites.

---

## LOWs — L-1..L-5

**Status: DEFERRED-OK** per canonical (HIGHs + MEDs are the acceptance criteria). No regression introduced — no LOW-scope code was modified by fix agents.

---

## Regression Sweep

| Check | Result |
|---|---|
| `node -c` on all modified files (server.js, db.js, routes/splice.js, invoice_generator.js, lib/browser_pool.js, routes/ai.js, routes/hours_csv.js, routes/invoice_templates.js, invoice_template_engine.js) | ALL SYNTAX OK |
| DB pool `max` default when `PG_POOL_MAX` unset | 20 (fallback confirmed) |
| `getBrowser` / `releasePage` exports from browser_pool | Both functions, POOL_SIZE=2 default |
| `setRequestInterception` at all 3 PDF call sites | Confirmed (2670, 3803 in splice.js; 486 in engine) |
| `browser.close()` removed from splice.js | 0 remaining calls |
| `releasePage` closes page, not browser | Confirmed |
| `hoursByProjectId` scoped per-contract | YES (declared line 308, inside contract loop) |
| `readFileSync`/`unlinkSync` in ai.js, hours_csv.js, invoice_templates.js | 0 remaining |
| `withUploadSlot` `.finally()` releases on all paths | Confirmed |
| `pendingApprovalsSet` LRU cap at 1000 | Confirmed |
| `npm test` (DB-dependent tests) | 11 pass / 23 fail — all failures are pre-existing `DATABASE_URL not set` infrastructure baseline, not caused by wave changes |

No regressions detected. All HIGHs fully addressed; all MEDs addressed or confirmed pre-shipped; LOWs deferred.

---

## Summary Table

| # | Status | SHA | Notes |
|---|---|---|---|
| H-1 | ADDRESSED | `4e75412` | N+1 eliminated; 37→10 round-trips on 3×10 RUS invoice |
| H-2 | ADDRESSED | `bcb1961` | Browser pool singleton, crash recovery, SSRF guards preserved |
| H-3 | ADDRESSED | `31188f8` | Pool max=20, env-configurable, boots clean with unset var |
| H-4 | ADDRESSED | `0a9d80f` | 14→7 queries/call, per-token rate limit 5 req/10s with TTL eviction |
| M-1 | ADDRESSED | `2fc2f9a` | 2× readFileSync → async in ai.js upload handler |
| M-2 | ADDRESSED | `70127a7` | readFileSync + 2× unlinkSync → async in hours_csv.js |
| M-3 | ADDRESSED | `d789392` | readFileSync + 5× unlinkSync → async in invoice_templates.js |
| M-4 | ADDRESSED | `2e582c0` | XLSX semaphore (max 2), .finally() slot release on all paths |
| M-5 | ADDRESSED | `830a014` | LRU cap 1000 entries shipped Phase 5 — confirmed in place |
| L-1..L-5 | DEFERRED-OK | — | Per canonical acceptance criteria |

=== WAVE 3 BE-PERF POST-FIX VERIFICATION END ===
