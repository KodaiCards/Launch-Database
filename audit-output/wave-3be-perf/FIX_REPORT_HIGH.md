# Wave 3 BE-Perf HIGH Fix Report

> Fix agent: Wave 3 BE-Perf HIGH (H-1..H-4)
> Branch: `claude/debug-previous-issues-MoN9D`
> Canonical source: `audit-output/wave-3be-perf/CANONICAL.md`

---

## Commit log

| SHA | Item(s) | Title |
|---|---|---|
| `31188f8` | H-3 | H-3: set PG pool max to 20 (env-configurable) |
| `4e75412` | H-1 | H-1: batch hourly-hours query in invoice_generator (N+1 fix) |
| `bcb1961` | H-2 | H-2: shared Puppeteer browser pool (lib/browser_pool.js) |
| `0a9d80f` | H-4 | H-4: consolidate hydrate burst (12→5 queries) + per-token rate-limit |

---

## Item status

| # | Status | Notes |
|---|---|---|
| **H-1** | ADDRESSED | `invoice_generator.js:304-344` — replaced per-leaf `pool.query` loop with single `ANY($1::uuid[])` batched CTE. Collects all leaf IDs before the inner loop, fires one query returning `{project_id, hours}` rows for the contract, builds `Map<projectId, hours>`, looks up per leaf. Output shape identical to previous `teRes.rows[0].h`. Drops from 30 sequential round-trips to 1 per contract on a 3×10 RUS invoice. |
| **H-2** | ADDRESSED | New file `lib/browser_pool.js` — singleton pool of 1-2 browsers (PUPPETEER_POOL_SIZE env, default 2). `getBrowser()` returns a pooled Browser; callers create their own Page; `releasePage(page)` closes the page, not the browser. Round-robin slot selection. Crash recovery via `browser.on('disconnected')` + `isConnected()` check on next acquire. All 3 sites updated: `routes/splice.js:2624` (diff PDF), `routes/splice.js:3675` (main PDF), `invoice_template_engine.js:477` (AI invoice render). C-1 SSRF `setRequestInterception` guard preserved at each call site — it is per-page, not per-browser, so sharing is safe. |
| **H-3** | ADDRESSED | `db.js:20` — added `max: parseInt(process.env.PG_POOL_MAX, 10) \|\| 20`. `.env.example` updated with `PG_POOL_MAX=20` and note re Railway shared-plan ceiling (~20-25). Verified: `pool.options.max === 20` in runtime check. |
| **H-4** | ADDRESSED | `routes/splice.js:2813` (hydrate endpoint) — two-part fix: (a) per-token rate limiter `_hydrateRateOk()` added (5 req/10s, keyed on share token string, 5-min sweep, `.unref()`); fires before ANY DB work. (b) 12 parallel queries consolidated into 5 batched queries via UNION ALL grouped by natural join chain (locations+closures+trays; cables+tubes+fibers; splices separate due to multi-path join; ribbon_groups+strand_states; splitters+outputs+cable_states). Response JSON shape identical. ORDER BY restored post-unmux. Slot count: 7 per call (down from 14). Two concurrent refreshes: 14 slots (down from 28) — fits inside H-3 pool of 20. |

---

## Verification checks performed

- `node -c` on all modified files: `db.js`, `invoice_generator.js`, `routes/splice.js`, `invoice_template_engine.js`, `lib/browser_pool.js` — all passed.
- `node -e` runtime check: `pool.options.max === 20` confirmed.
- `node -e` runtime check: `browser_pool.js` exports `getBrowser` and `releasePage` as functions; `POOL_SIZE` defaults to 2.
- Response JSON key names in hydrate endpoint verified unchanged: `locations`, `cables`, `buffer_tubes`, `fibers`, `closures`, `trays`, `splices`, `ribbon_groups`, `strand_states`, `splitters`, `splitter_outputs`, `cable_states`.

---

## Scope compliance

No MEDs or LOWs touched. No adjacent scope added. Four adjacent observations noted (not committed):

1. The `_fieldMarkupRate` Map (L-5) still has no hard size cap — only timestamp-based eviction. Deferred to MED/LOW wave.
2. `invoice_generator.js` has a per-contract tree query that fires once per contract (not per-leaf) — this is intentional and correct; it is not an N+1.
3. `lib/` directory did not exist; created for `browser_pool.js`. No other files added.
4. H-3 pool max at 20 is safe for Railway shared plans; if plan is upgraded, operator should raise `PG_POOL_MAX` after confirming `max_connections` via `SELECT current_setting('max_connections')`.

=== WAVE 3 BE-PERF HIGH FIX REPORT END ===
