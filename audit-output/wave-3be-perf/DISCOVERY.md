# Wave 3 BE-Perf Discovery

**Stack snapshot:** Express + pg-pool + Puppeteer + Railway Linux container. ~50K LOC.
Temp Claude's `20560fe` landed 9 indexes, N+1 fixes in several routes, recursive CTE, YTD
cache, LIMITs, and async fs conversions in `admin.js`. Key open items: Puppeteer is still
per-request in 3 call sites, one sync `fs` block remains in a debug route, and
`invoice_generator.js` has a genuine per-project N+1 for hourly jobs.

---

## Per-item status

| # | Item | Status | File:Line | Notes |
|---|---|---|---|---|
| 1 | **Puppeteer browser pool** | STILL-OPEN | `routes/splice.js:2624`, `routes/splice.js:3653`, `invoice_template_engine.js:477` | All 3 call `puppeteer.launch()` per request. No `browserPool` / `getBrowser` / shared instance exists anywhere in the codebase. Each PDF render cold-starts Chrome (~1-2 s overhead) and risks OOM under concurrent requests on Railway's constrained container. |
| 2 | **Sync `fs.*` in admin.js paths** | PARTIALLY-SHIPPED | `routes/admin.js:1085` | `fs.statfsSync()` is the one remaining sync call. Comment at line 1079 correctly notes "statfsSync has no async equivalent in Node.js and is fast (kernel call, no I/O)." This is a true kernel stat — no disk I/O — so it is acceptable as-is. All other `admin.js` fs calls were converted to `fs.promises` by `20560fe`. **ALREADY-SHIPPED** for the blocking calls; `statfsSync` is intentionally kept. |
| 3 | **Sync `fs.*` outside admin.js (new findings)** | STILL-OPEN | `routes/ai.js:2114`, `routes/ai.js:2125`, `routes/hours_csv.js:231`, `routes/hours_csv.js:236`, `routes/hours_csv.js:240`, `routes/invoice_templates.js:88`, `routes/invoice_templates.js:163-228`, `routes/project_documents.js:61`, `routes/project_documents.js:72`, `routes/project_documents.js:87`, `routes/splice.js:2798` | These were NOT touched by `20560fe` (scope was `admin.js` only). All are on hot request paths — file uploads, PDF render, debug endpoint. `routes/project_documents.js:72` uses `readdirSync` + `statSync` in a loop inside a debug route (admin-gated, lower urgency). `routes/splice.js:2798` (`readFileSync` on `splice_view.html`) fires on every public share-link hit — highest urgency of this group. `routes/ai.js` and `hours_csv.js` calls are upload-handler paths (medium urgency). |
| 4 | **`invoice_generator.js` nested CTE perf** | NEEDS-DEEPER-DIVE | `invoice_generator.js:255-395` | The outer loop iterates over contracts (`for const c of contracts`, line 247). Inside, for **each hourly project leaf** it fires a separate `pool.query` with a `WITH RECURSIVE leaf_ctx` CTE (line 323) to sum `time_entries.hours`. This is a classic N+1: 1 query per project leaf, multiplied by contracts. A typical RUS invoice with 3 contracts × 10 WOs = 30 sequential DB round-trips just for hours. Fix shape: lift all leaf IDs for this job+period upfront, run a single `WITH RECURSIVE leaf_ctx WHERE p.id = ANY($1::uuid[])` across all leaves, aggregate by leaf_id, then join in JS. The timecards query at line 395 already does this correctly (passes all project IDs as `$1::uuid[]`) — the per-project hourly loop (line 304) has not been updated to match. |
| 5 | **`collectProjectTree` perf** | ALREADY-SHIPPED | `routes/_helpers.js:83-98` | Uses a single `WITH RECURSIVE tree` CTE — no N+1, no loop. One DB round-trip per call. Call sites (contracts.js:134, ai.js:1012, projects.js:702) pass a single root ID. This is correct and efficient. No work needed. |
| 6 | **`GET /api/projects` unbounded** | ALREADY-SHIPPED | `routes/projects.js:29-112` | Wave 3 comment at line 39 confirms: default LIMIT 1000, max 5000, `?limit=all` escape hatch for tree-view. The query also has a correlated subquery YTD revenue CTE per row — expensive but bounded. Already addressed. |

---

## Top 5 highest-impact fixes

1. **Puppeteer browser pool** (`routes/splice.js`, `invoice_template_engine.js`) — 3 cold-start Chrome launches per concurrent PDF request. Under load this is the single biggest perf and OOM risk. A shared `browser` instance with `browser.newPage()` per request (and periodic reconnect on crash) would cut PDF latency by 1-2 s and reduce memory spikes. Medium complexity; high payoff.

2. **`invoice_generator.js` per-project N+1 hourly hours query** (`invoice_generator.js:304-350`) — 30+ sequential DB round-trips for a typical multi-contract RUS invoice. Lift to a single batched query (same pattern as the timecards query at line 395). Medium complexity; eliminates the main slowdown on invoice generation.

3. **`routes/splice.js:2798` `readFileSync` on every share-link hit** — `splice_view.html` is loaded synchronously on every public `/splice/view/:token` request. Cache the file contents at startup or switch to `fs.promises.readFile`. Low complexity, high frequency route.

4. **`routes/ai.js:2114,2125` `readFileSync` on upload paths** — AI file upload handler reads uploaded files synchronously. Switch to `fs.promises.readFile`. Low complexity.

5. **`routes/hours_csv.js:231,236,240` `readFileSync` + `unlinkSync` on CSV upload** — CSV import reads file synchronously. Switch to `fs.promises.readFile` + `fs.promises.unlink`. Low complexity.

---

## Coverage gaps

Checked: all `puppeteer.launch` call sites, sync `fs.*` in `admin.js` / `routes/*.js` / `ai.js` / `splice.js`, `invoice_generator.js` CTE and loop patterns, `collectProjectTree` implementation, `GET /api/projects` handler, `project_documents.js` debug route. Did not deeply audit: `routes/billing.js`, `routes/invoices.js`, `routes/revenue.js` for additional N+1 patterns (separate revenue/billing wave scope); `db_migrations.js:39` `readdirSync` (startup only, not a request-path concern); Puppeteer reconnect/crash-recovery strategy for the proposed pool.

=== WAVE 3 BE-PERF DISCOVERY END ===
