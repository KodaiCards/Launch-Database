# Wave 3 BE-Perf Remainder — Verification Red-Team

> Standard wave. 14 canonical items (4 HIGH + 5 MED + 5 LOW).
> Verified by reading cited line ranges directly. No code modifications.

---

## H-1 — Invoice N+1 Hourly Query

**Status: VERIFIED**

Verified by reading: `invoice_generator.js:247-344`, `:395-433`

```js
// Outer loop — one iteration per contract
for (const c of contracts) {
  // One batched query per contract to get leaf projects (OK)
  const projRes = await pool.query(`WITH RECURSIVE tree AS ...`, [c.id, job_id]);

  for (const p of projRes.rows) {  // inner loop — one per leaf project
    ...
    // HOURLY PATH: one pool.query PER LEAF — the N+1
    const teRes = await pool.query(`WITH RECURSIVE leaf_ctx AS ...`, [p.id, period_start, period_end]);
    hours = teRes.rows[0].h;
  }
}
```

On a 3-contract × 10-WO invoice: outer loop fires 3× (contract tree queries). Inner hourly loop fires once per leaf = **30 sequential round-trips** for hourly invoices. The batched pattern at line 395 (`WHERE p.id = ANY($1::uuid[])`) is the correct fix shape — it returns all leaf hours in one query. The downstream aggregation walks `contractScopes.flatMap(cs => cs.wos.map(w => w.project_id))` (line 388) which is exactly what the batched query needs. Fix is straightforward: collect all leaf `p.id`s before the inner loop, fire one batched CTE query, build a Map, then look up per leaf.

**Round-trip count on 3-contract × 10-WO path:**
- 1 (EC query) + 1 (job query) + 1 (contracts query) + 3 (tree per contract) + **30** (hourly per leaf) + 1 (timecards batch) = **37 round-trips**. Batching the hourly loop drops to 7. HIGH severity confirmed.

---

## H-2 — Puppeteer Cold-Start ×3

**Status: VERIFIED**

Verified by reading: `routes/splice.js:2623-2627`, `routes/splice.js:3674-3678`, `invoice_template_engine.js:477-480`

```js
// splice.js:2624 (diff PDF endpoint)
const browser = await puppeteer.launch({
  headless: 'new',
  args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
});

// splice.js:3675 (main PDF export)
const browser = await puppeteer.launch({ headless: 'new', args: [...] });

// invoice_template_engine.js:477 (AI invoice template render)
const browser = await puppeteer.launch({ headless: 'new', args: [...] });
```

No shared browser pool exists anywhere in the codebase. `_puppet()` is a lazy `require('puppeteer')` singleton — it caches the *module*, not a browser instance. Each of the 3 sites spawns a new Chrome process per request. No `getBrowser()` abstraction, no LRU pool.

**Regression caveats for fix-agent (browser pool):**
- The SSRF `setRequestInterception` guard runs per-page — it will continue to work correctly if the browser is shared and only pages are closed/reopened.
- Per-page cookies: these endpoints don't use cookies for rendering; HTML is passed as string via `page.setContent()`. No session bleed risk between PDF renders.
- Viewport/locale: none of the 3 sites sets non-default viewport or locale. Safe to share.
- Railway memory ceiling: a pool of 2 browsers idle at ~50 MB each is far better than 3 concurrent cold-starts at ~150 MB each. Recommend pool size 1-2 with idle timeout.

---

## H-3 — Pool `max` Unset

**Status: VERIFIED**

Verified by reading: `db.js:20-60`

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: ...,
  connectionTimeoutMillis: 10000,
  statement_timeout: ...,
  query_timeout: ...,
  // NO max: field — defaults to pg-pool default of 10
});
```

No `max` is set. pg-pool's documented default is **10 connections**. The H-4 hydrate burst alone (12 parallel queries) plus 2 concurrent SSE connections could saturate all 10 slots simultaneously.

**Railway Postgres connection ceiling:** Railway's Postgres shared plans cap at 20–25 connections by default (Postgres `max_connections` setting); dedicated plans are higher. Setting `max: 20` is safe on shared plans; fix-agent should document `PG_POOL_MAX` in `.env.example` and note that values > 20 require verifying the Railway plan's `max_connections`.

---

## H-4 — Contractor Hydrate Burst

**Status: VERIFIED**

Verified by reading: `routes/splice.js:2812-2884`

```js
app.get('/api/splice/view/:token/hydrate', async (req, res) => {
  // 1 serial query to resolve project ID from token
  const tok = await _resolveProjectToken(pool, req.params.token);
  const proj = await pool.query(`SELECT p.*, s.name ...`, [projectId]);  // serial

  // 12 parallel queries via Promise.all
  const [locations, cables, tubes, fibers, closures, trays, splices,
         ribbonGroups, strandStates, splittersRes, splitterOutputsRes, cableStatesRes] =
    await Promise.all([
      pool.query(`SELECT * FROM splice_locations ...`, [projectId]),
      pool.query(`SELECT * FROM splice_cables ...`, [projectId]),
      // ... 10 more
    ]);
```

Actual pattern: **1 token resolve + 1 project SELECT + 12 parallel** = 14 total queries per hydrate call. Two concurrent contractor refreshes = 28 connection slots needed vs 10-default pool. The endpoint is mounted without `requireAuth()` — confirmed public at `server.js:332` (`if (reqPath.startsWith('/api/splice/view/')) return false` bypasses auth middleware). No rate-limit on this public route beyond `_fieldMarkupRate` which only covers the upload sub-paths, not hydrate.

**Fix shape confirmed:** Consolidating the 12 parallel queries into fewer (JOIN/UNION) is the right direction. Per-token rate limit (e.g., 5 req/10s) would also help. H-3 pool max increase is a prerequisite.

---

## M-1 — Sync readFileSync in ai.js Upload

**Status: VERIFIED**

Verified by reading: `routes/ai.js:2142, 2153`

```js
} else if (ext === '.csv' || ext === '.tsv') {
  const content = fs.readFileSync(req.file.path, 'utf8');  // line 2142 — blocks event loop
  ...
} else {
  const content = fs.readFileSync(req.file.path, 'utf8');  // line 2153 — blocks event loop
```

Both are inside an async route handler on a per-request path (POST to AI upload endpoint). XLSX path uses `XLSX.readFile` (sync) at line 2122 — also blocking but no async API available in this version (M-4 covers this). The CSV/text paths are straightforward `fs.promises.readFile` replacements.

---

## M-2 — Sync fs ops in hours_csv.js

**Status: VERIFIED**

Verified by reading: `routes/hours_csv.js:227, 231, 236, 240`

```js
const wb = XLSX.readFile(req.file.path);    // line 227 — XLSX sync (M-4 scope)
const content = fs.readFileSync(req.file.path, 'utf8');  // line 231 — blocks
fs.unlinkSync(req.file.path);               // line 236 — blocks
fs.unlinkSync(req.file.path);               // line 240 — blocks
```

All 4 are on a per-request admin CSV validate route. The `readFileSync` (line 231) and both `unlinkSync` calls (lines 236, 240) are straightforward async replacements. XLSX.readFile (line 227) is M-4 scope (no async API).

---

## M-3 — Sync fs ops in invoice_templates.js

**Status: VERIFIED**

Verified by reading: `routes/invoice_templates.js:88, 163, 168, 185, 228, 290`

```js
const buf = fs.readFileSync(pdfPath);           // line 88 — inside runAnalysisAndPersist
try { fs.unlinkSync(req.file.path); } catch {}  // line 163 — error path
try { fs.unlinkSync(req.file.path); } catch {}  // line 168 — error path
...                                              // lines 185, 228, 290 — similar
```

Line 88 is inside `runAnalysisAndPersist`, called from request handlers. All sites are on request paths (admin-gated — `requireManagerOrAdmin`). Low concurrent traffic expected on this path but still blocks. `fs.promises.readFile` + `fsp.unlink` replacements are clean.

---

## M-4 — XLSX Sync Parse

**Status: VERIFIED (with nuance)**

Verified by reading: `routes/ai.js:2122`, `routes/hours_csv.js:227`

`XLSX.readFile()` is sync-only in the `xlsx` package (version in use has no async API). The canonical mitigation is a concurrency semaphore (max 2 concurrent uploads) rather than an async replacement. Confirmed correct fix shape. LOW to MEDIUM traffic on admin routes limits real-world impact.

---

## M-5 — _pendingApprovals Unbounded Map

**Status: OVERSTATED (TTL eviction already exists — size cap still missing)**

Verified by reading: `routes/ai.js:2055-2062`

```js
const _pendingApprovals = new Map();
const APPROVAL_TTL_MS = 15 * 60 * 1000;   // 15-minute TTL
setInterval(() => {
  const now = Date.now();
  for (const [k, v] of _pendingApprovals) {
    if (v.expires_at < now) _pendingApprovals.delete(k);
  }
}, 5 * 60 * 1000).unref();                 // runs every 5 min
```

TTL-based eviction IS present (15-min TTL, 5-min sweep). The CANONICAL said "no size cap" — that's technically accurate (no `max 1000` guard), but with 15-min TTL and single-instance deploy, the practical ceiling is: concurrent users × conversation rate. Not a real memory concern for this internal tool's load profile. Severity should be LOW, not MEDIUM. LRU cap is nice-to-have.

---

## L-1 — readdirSync/statSync in project_documents.js

**Status: VERIFIED**

Verified by reading: `routes/project_documents.js:72, 87`

```js
app.get('/api/_debug/uploads', requireAdmin, async (req, res) => {
  const onDisk = fs.readdirSync(uploadDir);   // line 72
  ...
  try { return s + fs.statSync(path.join(uploadDir, f)).size; } catch { return s; }  // line 87
```

Admin-gated debug route. Correct severity: LOW. Async replacement is trivial but low priority.

---

## L-2 — readFileSync per Request in server.js PORTAL_MODE

**Status: OVERSTATED (dead path in production)**

Verified by reading: `server.js:760-791`

The `fs.readFileSync` at line 780 is inside `if (PORTAL_MODE) { ... }`. Per CLAUDE.md, production does NOT set `PORTAL_MODE` — it was removed when the launcher consolidation shipped. This code path is inert in production. Severity should be INFORMATIONAL / deferred. If PORTAL_MODE is ever re-enabled (rollback scenario), the fix is a boot-time cache.

---

## L-3 — Boot-time mkdirSync in invoice_templates.js

**Status: FALSE-POSITIVE (canonical already notes: leave as-is)**

Verified by reading CANONICAL.md note: "Acceptable (one-shot at startup); leave as is OR convert." The canonical itself deferred this. No action needed.

---

## L-4 — Per-node DELETE Loops

**Status: VERIFIED (correctly identified, low urgency)**

Verified by reading: `routes/projects.js:754-756`, `routes/ai.js:1319-1320`

```js
// projects.js:754-756
const byDepth = [...projects].sort((a, b) => (b.__depth || 0) - (a.__depth || 0));
for (const p of byDepth) {
  await client.query('DELETE FROM projects WHERE id = $1', [p.id]);
}
// ai.js:1319-1320 — identical pattern
```

Both are inside transactions. For small trees (typical: 5-20 nodes) sequential individual deletes are acceptable. At >100 nodes, `DELETE WHERE id IN ($1::uuid[])` would be meaningfully faster. Fix is low-risk and low-urgency.

---

## L-5 — _fieldMarkupRate Map Leak

**Status: VERIFIED (self-evicting window, no hard cap)**

Verified by reading: `routes/splice.js:182-196`

```js
const _fieldMarkupRate = new Map(); // ip → array<timestamp ms>
const FIELD_MARKUP_WINDOW_MS = 60 * 1000;
function _fieldMarkupRateOk(ip) {
  const arr = (_fieldMarkupRate.get(ip) || []).filter(t => t > cutoff);  // rolling window prune
  ...
}
```

The `filter(t => t > cutoff)` call prunes old timestamps from each entry on every access. However, the Map itself never evicts IPs that stop calling — a unique-IP DDoS could grow the Map indefinitely. Cap + TTL eviction is the correct fix.

---

## Confirmed-Clean Spot Check (5 pool.connect sites)

**Status: VERIFIED — B's negative finding holds**

Verified by reading pool.connect/release counts:
- `splice.js`: 14 `pool.connect()`, 14 `client.release()` — balanced
- `billing.js`: 3 connects, 3 releases — balanced
- `projects.js`: 1 connect, 1 release — balanced
- `time_entries.js`: 1 connect, 2 `client.release()` (one release in try, one in finally) — balanced
- `ai.js`: 4 connects (2 plain + 2 txClient), 4 releases (2 plain + 2 txClient) — balanced

All sampled sites release in `finally` blocks. No pool client leaks found. B's negative finding confirmed.

---

## Summary Table

| # | Verdict | Notes |
|---|---|---|
| H-1 | VERIFIED | 30 sequential round-trips on hourly path; batched pattern at :395 is the mirror fix |
| H-2 | VERIFIED | 3 cold-start sites confirmed; no pool exists; browser pool safe (no per-tab cookies/locale) |
| H-3 | VERIFIED | No `max` set; default=10; Railway ceiling ~20-25 on shared plans |
| H-4 | VERIFIED | 14 queries (1+1+12); public route confirmed; no hydrate rate-limit |
| M-1 | VERIFIED | Two readFileSync on CSV/text upload request path |
| M-2 | VERIFIED | readFileSync + 2× unlinkSync on admin CSV validate request path |
| M-3 | VERIFIED | readFileSync + 5× unlinkSync across invoice_templates request paths |
| M-4 | VERIFIED | XLSX.readFile sync-only; semaphore mitigation is correct fix |
| M-5 | OVERSTATED | TTL eviction present (15 min sweep); size cap missing but low practical risk |
| L-1 | VERIFIED | Admin debug route; correct LOW severity |
| L-2 | OVERSTATED | Dead in production (PORTAL_MODE unset); rollback scenario only |
| L-3 | FALSE-POSITIVE | Canonical already deferred; boot-time is fine |
| L-4 | VERIFIED | Per-node deletes in txn; low urgency for typical tree sizes |
| L-5 | VERIFIED | Rolling window prunes timestamps but Map never evicts stale IPs |

---

## Fix-Agent Directives

**H-1:** Collect `projRes.rows.map(p => p.id)` before inner loop → one batched CTE with `ANY($1::uuid[])` → build `Map<projectId, hours>` → look up per leaf. Output shape is identical to current `teRes.rows[0].h`.

**H-2:** Create `lib/browser-pool.js` singleton returning a `getBrowser()` helper. Pool of 1-2 Chrome instances, idle-close after 60s inactivity. All 3 call sites import and use `getBrowser()`; close pages not browsers. The SSRF `setRequestInterception` guard stays on each page — no behavioral change.

**H-3:** `max: parseInt(process.env.PG_POOL_MAX, 10) || 20`. Add `PG_POOL_MAX=20` with comment to `.env.example` noting Railway shared plan ceiling.

**H-4:** Consolidate the 12 Promise.all queries into a set of 3-4 JOINed queries (locations+closures+trays in one CTE; cables+tubes+fibers in one CTE; splices+ribbonGroups+strandStates in one; splitters+outputs+cableStates in one). Add per-token rate-limit middleware (5 req/10s, keyed on `req.params.token`).

**M-1/M-2/M-3:** Standard `fs.promises.readFile` + `await fsp.unlink(...)` replacements. For unlinkSync in catch blocks: `fsp.unlink(...).catch(() => {})`.

=== WAVE 3 BE-PERF VERIFICATION END ===
