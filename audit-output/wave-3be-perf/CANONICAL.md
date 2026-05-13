# Wave 3 BE-Perf Remainder — Canonical Fix List

> Built from Auditor A (broad, 12 findings) + Auditor B (adversarial/load, 9 findings). STANDARD wave.

---

## Scope summary

Backend performance + concurrency hotspots. Key surfaces: invoice generation, Puppeteer PDF rendering, sync fs on upload + admin paths, DB pool sizing, public contractor endpoints, AI conversation memory.

---

## HIGH (4 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **H-1** | A + B (2/2 — full convergence) | `invoice_generator.js:323-344` | **N+1 hourly-hours query.** Per-leaf hourly query inside per-contract loop. 30-45 sequential DB round-trips on a typical RUS invoice. The timecards query at line 395 already uses the correct batched `ANY($1::uuid[])` pattern — mirror it here. | Replace per-leaf loop with one batched query using `ANY($1::uuid[])` returning hours-per-project map, then look up in Map. |
| **H-2** | A + B (2/2 — full convergence) | `routes/splice.js:2624` + `:3675` + `invoice_template_engine.js:477` | **Puppeteer cold-start ×3 per request.** 3 PDF endpoints `puppeteer.launch()` per request. ~1-2s overhead, ~100-150MB RAM per spawn. 3 concurrent PDF exports → Railway container OOM. | Introduce a shared browser pool (singleton or LRU pool of 2-3 browsers). All 3 sites use the same getBrowser() helper; close pages, not browsers. |
| **H-3** | B (1/2) | `db.js:20-25` | **Pool `max` unset.** `new Pool({...})` defaults to 10 connections. Root cause for cascade failures under concurrent load (SSE revalidate × N clients + contractor hydrate burst + dashboard refresh = pool exhausted). | `max: parseInt(process.env.PG_POOL_MAX,10) \|\| 20` (or higher for prod). Document in `.env.example`. |
| **H-4** | B (1/2) | `routes/splice.js:2828-2885` | **Contractor hydrate burst — 13 queries/call on public route.** `/api/splice/view/:token/hydrate` does 1 serial + 12 in `Promise.all`. Two concurrent contractor refreshes need 26 connections vs 10-default pool. No rate-limiting on this endpoint. | (a) Consolidate the 12 parallel queries into fewer (e.g., one big SQL with JOIN/UNION); (b) add per-token rate-limit (e.g., 5 req / 10s); (c) ensure H-3 lands too. |

## MEDIUM (5 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **M-1** | A (1/2) | `routes/ai.js:2124, 2135` | Sync `readFileSync` on admin CSV/text upload path — blocks event loop per upload | Replace with `fs.promises.readFile`. |
| **M-2** | A (1/2) | `routes/hours_csv.js:231, 236, 240` | Sync `readFileSync`/`unlinkSync` on admin CSV validate route | Replace with async equivalents. |
| **M-3** | A (1/2) | `routes/invoice_templates.js:88, 163, 168, 185, 228, 290` | `readFileSync` on multi-MB PDF (async function context) + 5× `unlinkSync` on template error paths | Replace with async + `await fsp.unlink`. |
| **M-4** | B (1/2) + A overlap on sync XLSX | `routes/hours_csv.js` (XLSX.readFile) + others | XLSX/CSV sync parse blocks event loop under concurrent uploads | XLSX has no async API in this version; mitigate by adding upload concurrency limit (e.g., semaphore of 2). |
| **M-5** | B (1/2) | `routes/ai.js` `_pendingApprovals` Map | **Unbounded.** Holds 15-turn conversation histories for 15 min with no size cap | Cap Map size with LRU eviction (e.g., max 1000 entries). |

## LOW (5 items)

| # | Source | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **L-1** | A | `routes/project_documents.js:72, 87` | `readdirSync`+`statSync` in admin-gated debug route | Replace with async (low priority — admin route, low traffic). |
| **L-2** | A | `server.js:780` | `readFileSync` portal HTML per request in PORTAL_MODE | Cache result at boot; serve from memory. |
| **L-3** | A | `invoice_templates.js:35` | Boot-time `mkdirSync` | Acceptable (one-shot at startup); leave as is OR convert. |
| **L-4** | A | `routes/projects.js:755` + `routes/ai.js:1319` | Per-node DELETE loops in transactions | Batch via `DELETE WHERE id IN ($1::uuid[])`. |
| **L-5** | B | `routes/splice.js` `_fieldMarkupRate` Map | Leaks entries for IPs that don't revisit | Cap Map size + TTL eviction. |

## Confirmed clean (negative findings)

- **All 35 `pool.connect()` sites have `finally { client.release() }`** — no pool client leaks (B verified)
- `splice.js:2798` async fix already shipped (34076f2)
- `collectProjectTree` single recursive CTE — already clean
- `GET /api/projects` LIMIT 1000 default — already clean
- SSE client cleanup correct

## Verification tier guide

**Full convergence (light verify):** H-1 (N+1), H-2 (Puppeteer cold-start)

**1-auditor (full verify):** H-3 (pool max), H-4 (hydrate burst), all MEDs + LOWs

## Acceptance criteria for fix-agents

1. All HIGHs + at least 3 MEDs addressed; LOWs deferred OK.
2. `node server.js` boots clean.
3. `npm test` 155/155 passes.
4. Suggested split:
   - **Fix-agent A (HIGHs):** H-1 (N+1 batch) + H-2 (browser pool) + H-3 (pool max) + H-4 (contractor hydrate consolidation + rate-limit)
   - **Fix-agent B (MEDs):** M-1..M-3 (sync fs sweep)
   - **Fix-agent C (cleanup):** M-4 + M-5 + L-1..L-5

5. Per-commit pull-rebase + push.

=== WAVE 3 BE-PERF CANONICAL END ===
