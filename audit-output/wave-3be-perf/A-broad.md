# Wave 3 BE-Perf — Auditor A (Broad Fresh-Eyes)

**Stack snapshot:** Express + pg-pool + Puppeteer + Railway Linux. Audit scope: `invoice_generator.js`, `automation.js`, `portal_module.js`, `routes/splice.js` (perf sections), `routes/ai.js`, `routes/projects.js`, `routes/permits.js`, `routes/hours_csv.js`, `routes/invoice_templates.js`, `routes/project_documents.js`, `db.js`, `server.js`, `invoice_template_engine.js`. DISCOVERY items 1–6 used for orientation only; findings are independent reads.

---

## Findings

| # | Severity | Category | File:line | Issue | Fix shape | Confidence |
|---|---|---|---|---|---|---|
| 1 | HIGH | Puppeteer cold-start × 3 | `routes/splice.js:2624`, `routes/splice.js:3675`, `invoice_template_engine.js:477` | Each PDF render calls `puppeteer.launch()` — spawns a full Chrome process (~1–2 s overhead, ~100 MB RAM). Under concurrent requests this stacks OOM and queue latency. No shared browser or pool exists anywhere in the codebase. | Module-level singleton: `let _browser = null; async function getBrowser() { if (!_browser || !_browser.isConnected()) _browser = await puppeteer.launch(...); return _browser; }` — replace all three `puppeteer.launch()` calls with `await getBrowser()`. `browser.close()` removed from request handlers; reconnect on crash. | HIGH |
| 2 | HIGH | N+1 hourly-hours query | `invoice_generator.js:323-344` | Inside the outer `for (const p of projRes.rows)` loop (line 304), each hourly project fires an individual `pool.query` with a `WITH RECURSIVE leaf_ctx` CTE to sum `time_entries.hours`. For a 3-contract × 10 WO RUS invoice this is 30 sequential round-trips. Line-395 timecards query uses `$1::uuid[]` batch pattern — this loop does not. | Collect all leaf IDs before the loop. Run one batched `WITH RECURSIVE leaf_ctx WHERE p.id = ANY($1::uuid[])` query that returns `(leaf_id, SUM(hours))`. Join result in JS. Mirror the `tcRes` pattern at line 395–445. | HIGH |
| 3 | MEDIUM | Sync `readFileSync` on admin upload path | `routes/ai.js:2124`, `routes/ai.js:2135` | `POST /api/ai/upload` (admin-gated) reads the uploaded file synchronously via `fs.readFileSync`. Blocks the event loop for the duration of the read. On large uploaded CSVs this can stall other concurrent requests during the block. | Replace with `const content = await fs.promises.readFile(req.file.path, 'utf8')` in both branches (lines 2124 and 2135). | HIGH |
| 4 | MEDIUM | Sync `readFileSync` + `unlinkSync` on CSV validate route | `routes/hours_csv.js:231`, `routes/hours_csv.js:236`, `routes/hours_csv.js:240` | `POST /api/hours/csv-validate` (admin-gated) reads uploaded CSV with `fs.readFileSync` (line 231) and deletes with `fs.unlinkSync` (lines 236 and 240). Blocks event loop for file I/O on each upload. | Switch to `await fs.promises.readFile(...)` and `await fs.promises.unlink(...)` in all three sites. | HIGH |
| 5 | MEDIUM | Sync `readFileSync` in template analysis | `routes/invoice_templates.js:88` | `runAnalysisAndPersist()` reads a stored PDF with `fs.readFileSync(pdfPath)` before passing to Anthropic. Runs on the event loop during async AI analysis pipeline. File can be multi-MB. | Replace with `const buf = await fs.promises.readFile(pdfPath)`. Function is already async so `await` is valid here. | HIGH |
| 6 | MEDIUM | Sync `unlinkSync` × 5 on upload error paths | `routes/invoice_templates.js:163,168,185,228,290` | Every upload error/replace path in `invoice_templates.js` deletes old PDF files with synchronous `fs.unlinkSync`. These are error-path cleanup calls — low frequency but still block the loop. | Replace all five with `fs.promises.unlink(...).catch(() => {})` (fire-and-forget async, same best-effort semantics). | HIGH |
| 7 | MEDIUM | Sync `readdirSync` + `statSync` loop in debug route | `routes/project_documents.js:72`, `routes/project_documents.js:87` | `GET /api/_debug/uploads` (admin-gated) runs `fs.readdirSync(uploadDir)` then iterates with `fs.statSync()` per file to compute total size. On a large upload volume this is O(N) synchronous I/O. | Replace `readdirSync` with `await fs.promises.readdir(...)` and `statSync` with `await fs.promises.stat(...)` inside an async `reduce`. | MEDIUM |
| 8 | MEDIUM | Sync `readFileSync` in portal HTML route | `server.js:780` | `GET /` in PORTAL_MODE reads the portal HTML file synchronously on every request with `fs.readFileSync`. This is a public entry-point — any concurrent portal loads contend on this sync I/O. | Cache the injected HTML string in a module-level variable at startup (read once with `fs.readFileSync` at startup, not per-request) OR switch to `await fs.promises.readFile`. | MEDIUM |
| 9 | MEDIUM | Unbounded staff + project queries in CSV import context | `routes/ai.js:1687`, `routes/ai.js:1688-1695` | `csv_smart_import` tool case fetches `SELECT id, name FROM staff` (no LIMIT) and all projects where `work_order_number IS NOT NULL AND != ''` (no LIMIT) in `Promise.all`. At scale these grow without bound. | Add `LIMIT 2000` to staff query (internal tool, bounded set). For projects query, restrict by `job_id` or `contract_id` passed in the import context, or add `LIMIT 5000` safety cap with warning. | MEDIUM |
| 10 | LOW | Sync `mkdirSync` at module registration time | `routes/invoice_templates.js:35` | `fs.mkdirSync(TEMPLATE_DIR, { recursive: true })` runs synchronously during module load / route registration. This is startup-only — no request-path impact — but blocks the boot thread on a filesystem call. | Replace with `fs.promises.mkdir(TEMPLATE_DIR, { recursive: true }).catch(() => {})` called in an async startup hook, or accept as acceptable (one-time boot cost). | LOW |
| 11 | LOW | `collectProjectTree` called per-ID in a sequential loop | `routes/ai.js:1272-1284` | `bulk_delete_projects` walks `collectProjectTree(id)` for each root ID in a sequential `for` loop. Each call is a recursive CTE round-trip. If the AI passes many IDs this serializes unnecessary round-trips. | Gather all root IDs into one `collectProjectTree` call that accepts `id = ANY($1::uuid[])` as the root filter — one CTE pass for the whole batch. | LOW |
| 12 | LOW | N-query delete in transaction — per-project row delete | `routes/projects.js:755-757`, `routes/ai.js:1319-1321` | After collecting `byDepth` (all tree nodes sorted deepest-first), projects are deleted one `DELETE ... WHERE id=$1` per node inside a transaction. For a 50-node tree this is 50 serial round-trips. | Batch delete: collect node IDs at each depth level, run `DELETE FROM projects WHERE id = ANY($ids_at_depth)` per depth level — far fewer round-trips, still respects FK ordering. | LOW |

---

## Negative findings (checked + confirmed clean)

- **`routes/splice.js:2798`** (`splice/view/:token`): Discovery flagged this as `readFileSync`. **Confirmed SHIPPED** — line 2798 comment documents the fix, uses `fsp.readFile` (async). Clean.
- **`invoice_template_engine.js:41`** (`_logoUri()`): `readFileSync` is behind a lazy-init guard (`if (_logoDataUri !== null) return`). Called once per process lifetime, not per request. Acceptable.
- **`invoice_generator.js`**: No `readFileSync` / blocking sync calls. `fs.existsSync(LOGO_PATH)` at lines 541 and 806 — `existsSync` is a metadata check with no disk I/O; acceptable.
- **`db.js:184`** (`readFileSync(schema.sql)`): Boot-time only. Acceptable.
- **`automation.js`** for-loops (lines 409, 825, 903, 952): All are pure JS grouping/math loops with no DB calls inside. No N+1.
- **`routes/permits.js`**: All queries are single-row UPDATE/SELECT operations per request. No loops with embedded queries. Clean.
- **`routes/projects.js` `GET /api/projects`**: Confirmed SHIPPED — Wave 3 comment at line 39 confirms LIMIT 1000 default, max 5000. Clean.
- **`routes/_helpers.js` `collectProjectTree`**: Confirmed SHIPPED — single `WITH RECURSIVE tree` CTE. No N+1. Clean.
- **`portal_module.js`**: Sequential lookups (client→team→area folder chain) are bounded at 3 queries per call. Not a hot-path N+1.
- **`getDBContext()` in `routes/ai.js:114-166`**: 7 parallel queries via `Promise.all`, all bounded (projects LIMIT 50, concentrators active filter, staff active filter). AI chat context load. Acceptable shape.

---

## Coverage gaps

Reached: all puppeteer call sites, all sync `fs.*` in all scoped files, `invoice_generator.js` full N+1 analysis, `routes/projects.js` loop pattern, `routes/ai.js` tool handler loops, `getDBContext` query shapes, `automation.js` projection math loops, `portal_module.js` rollup chain. Did not reach: `routes/billing.js`, `routes/invoices.js`, `routes/revenue.js` (outside wave scope per DISCOVERY), `routes/design_pipeline.js`, `routes/potential_permits.js`, `timeclock_module.js`. Puppeteer crash-recovery / reconnect strategy for the proposed singleton not deeply analyzed — that design detail is in scope for the fix agent.

=== WAVE 3 BE-PERF AUDITOR A REPORT END ===
