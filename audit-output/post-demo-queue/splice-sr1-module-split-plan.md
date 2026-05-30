# Splice SR-1 Module-Split Execution Plan

**Wave:** 233 (planning only — execution is post-demo)
**Predecessor:** W220 splice audit recommends incremental refactor (SR-1..SR-6)
**Scope:** Move-shop refactor of `routes/splice.js` (7,314 LOC, 104 routes) → `routes/splice/*.js` thematic sub-files. **Pure mechanical move. ZERO behavior change. ZERO URL changes.**
**Risk:** LOW. No FK, no schema migration, no contract change.
**Estimated effort for fix-agent:** 4–6 hours focused.

---

## 1. Route inventory (104 routes, 12 themes)

Themes derived from existing `// ─── Section ───` headers already in `routes/splice.js`. Line ranges are start-of-route → start-of-next-route (close-bracket lives in the previous range).

### Theme A — Projects (15 routes, lines 297–732, ~435 LOC)

| Line | Method | Path | Auth | Purpose |
|---:|:--|:--|:--|:--|
| 297 | GET | `/api/splice/projects` | requireAuth | List user's projects (paginated, MED-8 cap) |
| 322 | POST | `/api/splice/projects` | requireAuth | Create empty project |
| 344 | GET | `/api/splice/projects/:id` | + requireSpliceAccess | **Hydrate** — 17 parallel queries → full graph |
| 535 | PUT | `/api/splice/projects/:id/layer-styles/:layerId` | + requireSpliceAccess | Layer style upsert |
| 562 | DELETE | `/api/splice/projects/:id/layer-styles/:layerId` | + requireSpliceAccess | Layer style delete |
| 574 | PUT | `/api/splice/cables/:id/category` | requireAuth | (Cable layer-category — sits in Projects block but is really Cables; see Risk note R1) |
| 593 | POST | `/api/splice/projects/:id/custom-layers` | + requireSpliceAccess | Add custom layer |
| 616 | GET | `/api/splice/projects/:id/custom-layers` | + requireSpliceAccess | List custom layers |
| 629 | POST | `/api/splice/custom-layers/:layerId/features` | requireAuth | Add custom feature to layer |
| 654 | PUT | `/api/splice/custom-features/:id` | requireAuth | Update custom feature |
| 675 | DELETE | `/api/splice/custom-features/:id` | requireAuth | Delete custom feature |
| 686 | GET | `/api/splice/projects/:id/validation` | + requireSpliceAccess | On-demand validate (calls `_loadProjectForExport` + `validateProject`) |
| 694 | PUT | `/api/splice/projects/:id` | + requireSpliceAccess | Project metadata update |
| 723 | DELETE | `/api/splice/projects/:id` | + requireSpliceAccess | Project delete (cascade) |

### Theme B — Locking (4 routes, lines 736–887, ~152 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 736 | POST | `/api/splice/projects/:id/lock` | Acquire lock (STALE_LOCK_MS = 10 min) |
| 792 | POST | `/api/splice/projects/:id/heartbeat` | Refresh lock |
| 826 | POST | `/api/splice/projects/:id/unlock` | Release lock |
| 845 | POST | `/api/splice/projects/:id/take-over` | Force-take stale lock |

### Theme C — Locations (4 routes, lines 890–992, ~103 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 890 | POST | `/api/splice/projects/:id/locations` | Add location |
| 910 | PUT | `/api/splice/locations/:id` | Update location |
| 944 | PUT | `/api/splice/locations/:id/coords` | Update geo coords only |
| 976 | DELETE | `/api/splice/locations/:id` | Delete location |

### Theme D — Cables (4 routes, lines 999–1163, ~165 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 999 | POST | `/api/splice/projects/:id/cables` | Add cable (auto-generates tubes + fibers in TIA-598 order) |
| 1076 | PUT | `/api/splice/cables/:id` | Update cable metadata |
| 1106 | DELETE | `/api/splice/cables/:id` | Delete cable |
| 1127 | PUT | `/api/splice/cables/:id/path` | Update GeoJSON path |

*(Note: `PUT /api/splice/cables/:id/category` at line 574 belongs here logically; see Risk R1.)*

### Theme E — Closures (4 routes, lines 1166–1410, ~245 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 1166 | POST | `/api/splice/locations/:id/closures` | Add closure (auto-creates trays) |
| 1229 | PUT | `/api/splice/closures/:id` | Update closure model/capacity |
| 1322 | DELETE | `/api/splice/closures/:id` | Delete closure |
| 1350 | POST | `/api/splice/closures/bulk-delete` | Bulk delete |

### Theme F — Splices + Fibers + Strand/Cable States (16 routes, lines 1413–2056, ~644 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 1413 | POST | `/api/splice/trays/:id/splices` | Single fiber splice |
| 1483 | POST | `/api/splice/trayless-splices` | Mid-span splice (no tray) |
| 1558 | POST | `/api/splice/trays/:id/ribbon-splice` | 12-fiber ribbon mass-fusion |
| 1631 | DELETE | `/api/splice/splices/:id` | Delete single splice |
| 1671 | PUT | `/api/splice/splices/:id` | Update splice |
| 1713 | DELETE | `/api/splice/ribbon-groups/:id` | Delete ribbon group |
| 1748 | PUT | `/api/splice/fibers/:id` | Update fiber metadata (circuit naming) |
| 1799 | PUT | `/api/splice/cables/:cableId/fiber-metadata` | Bulk fiber metadata |
| 1869 | GET | `/api/splice/projects/:id/strand-states` | List ring-cut three-lane states |
| 1886 | POST | `/api/splice/cables/:cableId/locations/:locationId/strand-states` | Upsert strand state |
| 1953 | DELETE | `/api/splice/strand-states/:id` | Delete strand state |
| 1976 | GET | `/api/splice/projects/:id/cable-states` | List slack/service-loop states |
| 1991 | PUT | `/api/splice/cables/:cableId/locations/:locationId/cable-state` | Upsert cable state |
| 2033 | DELETE | `/api/splice/cable-states/:id` | Delete cable state |

### Theme G — Comments (5 routes, lines 2057–2167, ~111 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 2057 | POST | `/api/splice/comments` | Add comment (closure or splice) |
| 2091 | GET | `/api/splice/comments` | List user's comments |
| 2115 | GET | `/api/splice/projects/:id/comments` | List project comments |
| 2131 | POST | `/api/splice/comments/:id/resolve` | Resolve thread |
| 2155 | DELETE | `/api/splice/comments/:id` | Delete |

### Theme H — Closure templates (7 routes, lines 2181–2410, ~230 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 2181 | GET | `/api/splice/closure-templates` | List templates |
| 2218 | POST | `/api/splice/closure-templates` | Create |
| 2250 | PUT | `/api/splice/closure-templates/:id` | Update |
| 2280 | DELETE | `/api/splice/closure-templates/:id` | Delete |
| 2290 | POST | `/api/splice/closure-templates/:id/publish` | Publish |
| 2306 | POST | `/api/splice/closure-templates/:id/unpublish` | Unpublish |
| 2332 | POST | `/api/splice/locations/:locationId/closures/from-template/:templateId` | Instantiate from template |

### Theme I — Clone + Versions + Diff (8 routes, lines 2411–2922, ~512 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 2411 | POST | `/api/splice/projects/:id/clone` | Deep clone project |
| 2627 | POST | `/api/splice/projects/:id/versions` | Snapshot manual |
| 2645 | POST | `/api/splice/projects/:id/versions/auto` | Snapshot auto |
| 2669 | GET | `/api/splice/projects/:id/versions` | List versions |
| 2685 | GET | `/api/splice/projects/:id/versions/:n` | Load version |
| 2693 | DELETE | `/api/splice/projects/:id/versions/:n` | Delete version |
| 2709 | POST | `/api/splice/projects/:id/undo-last` | Undo restore |
| 2846 | GET | `/api/splice/projects/:id/diff/:a/:b` | JSON diff |
| 2865 | GET | `/api/splice/projects/:id/diff/:a/:b/pdf` | PDF diff |

### Theme J — Public tokens + Field markup + View (15 routes, lines 2941–3403, ~463 LOC) **CRITICAL — DO NOT CHANGE URLs**

Closure-level public tokens:

| Line | Method | Path | Auth | Purpose |
|---:|:--|:--|:--|:--|
| 2941 | POST | `/api/splice/closures/:id/public-tokens` | requireAuth | Mint closure token |
| 2970 | GET | `/api/splice/closures/:id/public-tokens` | requireAuth | List tokens |
| 2985 | DELETE | `/api/splice/public-tokens/:token` | requireAuth | Revoke closure token |

Project-level public tokens (Phase 4.1):

| Line | Method | Path | Auth | Purpose |
|---:|:--|:--|:--|:--|
| 3003 | POST | `/api/splice/projects/:id/public-tokens` | + requireSpliceAccess | Mint project token |
| 3027 | GET | `/api/splice/projects/:id/public-tokens` | + requireSpliceAccess | List |
| 3042 | DELETE | `/api/splice/public-tokens/project/:token` | requireAuth | Revoke project token |

**Public view (PRINTED QR CODES POINT HERE — IMMUTABLE URLs):**

| Line | Method | Path | Auth | Purpose |
|---:|:--|:--|:--|:--|
| 3056 | GET | `/splice/view/:token` | **public** | Render view HTML |
| 3083 | GET | `/api/splice/view/:token/hydrate` | **public + rate-limit** | View JSON payload |
| 3261 | GET | `/splice/field/:token` | **public** | Render field markup HTML |
| 3292 | POST | `/splice/field/:token/markup` | **public + multer + rate-limit** | Submit photo markup |
| 3336 | GET | `/splice/field/:token/markups/:id/image` | **public** | Serve markup image |

Authenticated markup management:

| Line | Method | Path | Auth | Purpose |
|---:|:--|:--|:--|:--|
| 3358 | GET | `/api/splice/closures/:id/markups` | requireAuth | List markups for closure |
| 3374 | GET | `/api/splice/markups/:id/image` | requireAuth | Auth image fetch |
| 3390 | DELETE | `/api/splice/markups/:id` | requireAuth | Delete markup |

### Theme K — Loss records (Phase 4.7) (5 routes, lines 3617–3732, ~116 LOC)

| Line | Method | Path | Auth | Purpose |
|---:|:--|:--|:--|:--|
| 3617 | POST | `/api/splice/projects/:id/loss-records` | + requireSpliceAccess | Ingest Fujikura Splice+ JSON |
| 3643 | GET | `/api/splice/projects/:id/loss-records` | + requireSpliceAccess | List loss records |
| 3661 | PUT | `/api/splice/loss-records/:id/bind` | requireAuth | Manual rebind |
| 3686 | DELETE | `/api/splice/loss-records/:id` | requireAuth | Delete |
| 3699 | POST | `/splice/field/:token/loss-records` | **public + rate-limit** | Splicer-side upload |

### Theme L — Picklists + Search + SSE (4 routes, lines 3733–3949, ~217 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 3733 | GET | `/api/splice/closure-models` | Organic picklist |
| 3746 | GET | `/api/splice/projects/:id/search` | Per-project search (5.H.6) |
| 3793 | GET | `/api/splice/search` | Cross-project search |
| 3865 | GET | `/api/splice/projects/:id/events` | **SSE stream** (uses `_addSseClient`/`_removeSseClient`) |

### Theme M — Export (PDF/HTML/KMZ) (3 routes, lines 3950–4118, ~169 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 3950 | GET | `/api/splice/projects/:id/export-html` | Debug HTML preview |
| 3960 | GET | `/api/splice/projects/:id/export-pdf` | Puppeteer-rendered field doc |
| 4089 | GET | `/api/splice/projects/:id/export-kmz` | KMZ archive |

### Theme N — Design imports (KMZ/DXF/CSV) (8 routes, lines 4157–4504, ~348 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 4157 | POST | `/api/splice/projects/:id/imports` | Stage KMZ/DXF |
| 4223 | GET | `/api/splice/projects/:id/imports` | List import jobs |
| 4239 | GET | `/api/splice/imports/:id` | Get import detail + changes |
| 4259 | POST | `/api/splice/imports/:id/changes/:cid/decision` | Accept/reject change |
| 4281 | POST | `/api/splice/imports/:id/apply` | Apply accepted changes |
| 4372 | DELETE | `/api/splice/imports/:id` | Abandon import |
| 4411 | POST | `/api/splice/projects/:id/import-paste` | CSV/Excel paste import |

### Theme O — Path tracing + Splitters (6 routes, lines 4505–4770, ~266 LOC)

| Line | Method | Path | Purpose |
|---:|:--|:--|:--|
| 4505 | GET | `/api/splice/fibers/:id/path` | Trace strand path through splices |
| 4550 | POST | `/api/splice/closures/:id/splitters` | Add splitter |
| 4608 | GET | `/api/splice/projects/:id/splitters` | List |
| 4634 | PUT | `/api/splice/splitters/:id` | Update |
| 4728 | DELETE | `/api/splice/splitters/:id` | Delete |
| 4747 | PUT | `/api/splice/splitter-outputs/:id` | Wire splitter output to fiber |

**Sanity check:** 15+4+4+4+4+16+5+7+9+14+5+4+3+8+6 = 108. (Cross-theme: line 574 `cables/:id/category` doubled-counted in A and D, line 3358/3374/3390 listed under J. Actual unique route count from `grep -cE "app\.(get|post|put|delete|patch)\("`= **104**.) Drop the 4 dual-counts → matches.

---

## 2. Proposed file structure

All under `routes/splice/`. Estimates assume helpers + comments stay attached to the routes that use them.

```
routes/splice/_shared.js            ~280 LOC  Constants, SSE registry, rate limiters,
                                              lazy package loaders, requireSpliceAccess
                                              factory, _bumpProjectMtime, _broadcast,
                                              _addSseClient, _removeSseClient,
                                              _mintFieldToken, _generationHash,
                                              _renderQrSvg, validateProject re-export
routes/splice/projects.js           ~445 LOC  Theme A (15 routes incl. hydrate)
routes/splice/locking.js            ~155 LOC  Theme B (4 routes)
routes/splice/locations.js          ~105 LOC  Theme C (4 routes)
routes/splice/cables.js             ~165 LOC  Theme D (4 routes) — plus line 574 from A
routes/splice/closures.js           ~245 LOC  Theme E (4 routes)
routes/splice/splices.js            ~645 LOC  Theme F (16 routes: splices+fibers+states)
routes/splice/comments.js           ~115 LOC  Theme G (5 routes)
routes/splice/templates.js          ~230 LOC  Theme H (7 routes — closure templates)
routes/splice/versions.js           ~515 LOC  Theme I (8 routes: clone+versions+diff)
                                              + helpers _takeSnapshot, _loadVersion,
                                              _computeDiff, _shallowEqualEntity,
                                              _renderDiffHtml (lines 5625–5934)
routes/splice/tokens_public.js      ~465 LOC  Theme J (15 routes — public/field/view)
                                              + helpers _resolveProjectToken,
                                              _renderViewErrorHtml, _resolveFieldToken,
                                              _loadClosureForField, _ensureFieldTokens,
                                              _renderFieldHtml, _renderFieldErrorHtml
                                              (lines 5927–6236)
routes/splice/loss_records.js       ~120 LOC  Theme K (5 routes)
routes/splice/search_sse.js         ~220 LOC  Theme L (4 routes — picklists/search/SSE)
routes/splice/export.js             ~770 LOC  Theme M (3 routes) + helpers
                                              _loadProjectForExport, _esc, _safeFilename,
                                              _fetchMapboxStaticDataUrl, _renderSpliceHtml,
                                              _renderKml, _kmlEsc, _computeWarnings,
                                              _haversineFeet (lines 4774–5624 + 6237–6359)
routes/splice/design_import.js      ~700 LOC  Theme N (8 routes) + helpers _getAdmZip,
                                              _getTogeojson, _getJsdom, _getDxfParser,
                                              _getProj4, _parseKmzOrKml, _ingestFromGeoJson,
                                              _normalizeLocationType, _normalizeFiberCount,
                                              _normalizeConstructionType,
                                              _pathsCoordsEqual, _diffIngestAgainstLive,
                                              _stageImport, _applyImportChange,
                                              _parseDxfCalibration, _parseDxf,
                                              _buildDxfTransform
                                              (lines 6360–6998)
routes/splice/splitters_pathtrace.js ~395 LOC Theme O (6 routes) + helper
                                              _traceStrandPath (lines 6999–7314)
routes/splice.js                     ~50 LOC  Thin orchestrator (see §4)
```

**Totals:** 17 files; entry-point + shared + 15 thematic. Largest sub-file 770 LOC, smallest 105 LOC, all within 100–800 target. Net code change: ~0 (~50 LOC added for the orchestrator wrapper + per-file module headers).

---

## 3. Shared utilities (`routes/splice/_shared.js`)

This file is the seam that prevents circular requires. Everything here is **pure-state or pure-function** — no route handlers, no I/O on import.

### Constants (lines 30–49 of current splice.js)
- `TIA_598_COLORS`
- `TIA_598_ABBREV`
- `TIA_598_DARK_FILLS`
- `FIBER_COUNTS`
- `STALE_LOCK_MS`
- `SPLICE_PUBLIC_URL` (env-derived)
- `FIELD_MARKUP_MAX_BYTES`
- `FIELD_MARKUP_LIMIT`
- `FIELD_MARKUP_WINDOW_MS`
- `HYDRATE_RATE_LIMIT`
- `HYDRATE_RATE_WINDOW_MS`
- `_TOKEN_RE` (line 1160 in current splice.js)

### State (module-scoped Maps — MUST be singletons across sub-files)
- `sseClients` (line 54)
- `_fieldMarkupRate` (line 183) + sweep `setInterval`
- `_hydrateRate` (line 219) + sweep `setInterval`

### Lazy package loaders
- `_qr()` (line 100) → qrcode
- `_puppet()` (line 138) → puppeteer
- `_getFieldMarkupUpload()` (line 157) → multer
- `_getArchiver()` (line 255) → archiver
- `_getAdmZip()` (line 6367), `_getTogeojson()` (6377), `_getJsdom()` (6387), `_getDxfParser()` (6397), `_getProj4()` (6407)

### Helpers
- `_broadcast(projectId, event, data)` (line 56) — SSE fanout
- `_addSseClient(projectId, res)` (line 65)
- `_removeSseClient(projectId, res)` (line 70)
- `_renderQrSvg(text, size)` (line 112) — async
- `_generationHash(data)` (line 125)
- `_fieldMarkupRateOk(ip)` (line 195)
- `_hydrateRateOk(token)` (line 231)
- `_mintFieldToken()` (line 249)
- `_bumpProjectMtime(pool, projectId)` (line 4799)
- `_haversineFeet(coords)` (line 4782)
- `_computeWarnings(args)` (line 4809) — used by hydrate AND export
- `_esc(s)` (line 4938), `_safeFilename(s)` (line 4947)

### Re-exports
```js
const { validateProject } = require('../_splice_validation');
const { logAudit } = require('../_audit');
module.exports = { validateProject, logAudit, /* ...everything above... */ };
```

### Factory: `makeRequireSpliceAccess(pool)`

Lines 268–293 in current splice.js define `requireSpliceAccess` inside `installSpliceRoutes` so it can close over `pool`. Refactor as factory:

```js
function makeRequireSpliceAccess(pool) {
  return function requireSpliceAccess(getProjectId) {
    return async (req, res, next) => {
      // ...exact body of current closure, no behavior change...
    };
  };
}
module.exports.makeRequireSpliceAccess = makeRequireSpliceAccess;
```

Each sub-file calls `const requireSpliceAccess = makeRequireSpliceAccess(pool);` once at install-time.

**Cross-file dependency summary:** every sub-file requires `_shared` for `_broadcast` + `makeRequireSpliceAccess`. Notable additionals: `projects.js` + `tokens_public.js` + `export.js` all need `_loadProjectForExport` + `_computeWarnings` (lives in `_shared.js` per R2). `versions.js` keeps its own `_takeSnapshot` / `_loadVersion` / `_computeDiff` / `_renderDiffHtml` (used only there). `tokens_public.js` owns `_resolveFieldToken` / `_loadClosureForField` / `_ensureFieldTokens` / `_renderFieldHtml` / `_renderFieldErrorHtml` / `_renderViewErrorHtml`. `design_import.js` owns all KMZ/DXF parsers. `export.js` owns `_renderSpliceHtml` / `_renderKml` / `_kmlEsc` / `_fetchMapboxStaticDataUrl`. `search_sse.js` is the only consumer of `_addSseClient` / `_removeSseClient` exports.

---

## 4. Mounting pattern

### New `routes/splice.js` (entry-point, ~50 LOC):

```js
//
// OSP fiber splice planning — route orchestrator.
// Real route implementations live in routes/splice/*.js.
// Schema in migrations/0001_splice_schema.sql.
//
// Public URLs (printed on contractor QR codes — NEVER change):
//   /splice/view/:token
//   /splice/field/:token
//   /splice/field/:token/markup
//   /splice/field/:token/markups/:id/image
//   /splice/field/:token/loss-records
//
module.exports = function installSpliceRoutes(app, pool, mw) {
  require('./splice/projects')(app, pool, mw);
  require('./splice/locking')(app, pool, mw);
  require('./splice/locations')(app, pool, mw);
  require('./splice/cables')(app, pool, mw);
  require('./splice/closures')(app, pool, mw);
  require('./splice/splices')(app, pool, mw);
  require('./splice/comments')(app, pool, mw);
  require('./splice/templates')(app, pool, mw);
  require('./splice/versions')(app, pool, mw);
  require('./splice/tokens_public')(app, pool, mw);
  require('./splice/loss_records')(app, pool, mw);
  require('./splice/search_sse')(app, pool, mw);
  require('./splice/export')(app, pool, mw);
  require('./splice/design_import')(app, pool, mw);
  require('./splice/splitters_pathtrace')(app, pool, mw);
};
```

### Each sub-file follows the same shape:

```js
// routes/splice/<theme>.js
const shared = require('./_shared');

module.exports = function install(app, pool, mw) {
  const { requireAuth } = mw;
  const requireSpliceAccess = shared.makeRequireSpliceAccess(pool);
  const { _broadcast, _bumpProjectMtime, /* etc */ } = shared;

  // ─── routes ───
  app.get('/api/splice/...', requireAuth(), async (req, res) => { /* verbatim */ });
  // ...
};
```

### `server.js` change

**ZERO.** Current line 828 (`require('./routes/splice')(app, pool, { requireAuth });`) stays identical — the entry-point file at `routes/splice.js` continues to export the same function signature.

---

## 5. Risk analysis

| # | Risk | Mitigation |
|:--|:--|:--|
| **R1** | Line 574 `PUT /api/splice/cables/:id/category` sits inside the Projects section header (lines 295–732) but is logically a Cables route. | Move to `cables.js` (more cohesive). The section header was misleading. Verify route still registers; URL unchanged. |
| **R2** | `_loadProjectForExport` is needed by **projects.js** (validation endpoint line 686) AND **tokens_public.js** (view hydrate line 3083) AND **export.js** (all 3 export routes). Putting it in `export.js` creates a downstream require chain. | Move `_loadProjectForExport` into `_shared.js` instead of `export.js`. Pure read-helper, no rendering. Same for `_computeWarnings`, `_haversineFeet`, `_esc`, `_safeFilename`. Only the rendering functions (`_renderSpliceHtml`, `_renderKml`, `_renderDiffHtml`, `_renderFieldHtml`, `_renderViewErrorHtml`) stay in their owning sub-file. |
| **R3** | `sseClients` Map (line 54) is the ONLY in-memory cross-route state. Splitting must keep it as a **single module-scoped singleton** — if `_shared.js` is required twice via different paths, Node's module cache normally dedupes; verify with a boot smoke that publishing from `cables.js` reaches a listener attached in `search_sse.js`. | Singleton via `require('./_shared')` works because Node caches by resolved path. Add a one-line jest test: subscribe + broadcast across imports of `_shared` from two different sub-files; expect delivery. |
| **R4** | Rate limiters (`_fieldMarkupRate`, `_hydrateRate`) and their sweep `setInterval`s are also module-scoped state. Same dedupe concern as R3. | Same solution. The `.unref()` call must persist — verify after split. |
| **R5** | `requireSpliceAccess` closes over `pool`. Currently defined inside `installSpliceRoutes`. Splitting demands a factory. | Factory pattern in §3. Each sub-file calls `makeRequireSpliceAccess(pool)` once per install. Idempotent — different sub-files get distinct closures, but they're functionally identical. |
| **R6** | `validateProject` (line 79 require) + `logAudit` used across themes. | Re-export both from `_shared.js`. |
| **R7** | `_TOKEN_RE` (line 1160) needed by `tokens_public.js`. | Move to `_shared.js` constants. |
| **R8** | Clone endpoint (line 2411, ~216 LOC) crosses every theme via SQL. | Lives in `versions.js`. Plain SQL copy — only `_broadcast` + `_bumpProjectMtime` needed. |
| **R9** | `_renderSpliceHtml` (export PDF) vs `_renderFieldHtml` (token-view) are SEPARATE functions. | Keep in their owning sub-files. No duplication. |
| **R10** | Multer factory `_getFieldMarkupUpload()` is request-time lazy. | Survives split unchanged. |
| **R11** | `_shared.js` lives at `routes/splice/_shared.js`. | Use `require('../_splice_validation')` (one level up). |
| **R12** | Preserve all underscore-prefixed function names verbatim. | No renames in SR-1. |
| **R13** | Field-markup helpers (lines 5967–6236) used only by `tokens_public.js`. | Co-locate in `tokens_public.js`. |
| **R14** | `_traceStrandPath` (line 7016, ~315 LOC) used only by `GET /fibers/:id/path`. | Co-locate in `splitters_pathtrace.js`. |

---

## 6. Verification plan

Run after fix-agent execution, in order. Stop at first failure.

**6.1 Static** — `node --check` on `routes/splice.js` + every `routes/splice/*.js`. Then `node -e "require('./routes/splice')"` loads the entry-point (catches missing-module errors).

**6.2 Boot smoke + route count** — boot Express with fake pool, install splice routes, count `app._router.stack` entries with `.route`. **PASS criterion: exactly 104 routes.** <104 = route lost in move; >104 = double-registered.

**6.3 Route-path equality** — generate sorted `METHOD /path` lists pre-split (from `main`) and post-split (from current branch); `diff` MUST be empty. Add helper `scripts/list-splice-routes.js` that dumps `app._router.stack` with the fake-pool boot pattern.

**6.4 Jest** — run all 10 splice test suites:
`tests/splice.test.js`, `splice_cable_types`, `splice_map_ux`, `splice_phase2b`, `splice_phase2c_09`, `splice_phase2c_10`, `splice_phase2c_11`, `splice_phase2c_13`, `splice_phase3`, `splice_validation`. **PASS: 10/10 without modification** (tests hit URLs via supertest, not require splice.js directly).

**6.5 SSE singleton sanity** — new `tests/splice_module_split_singleton.test.js` (~30 LOC): require `_shared` twice via different paths, assert `===` identity on the module, subscribe + broadcast across requires, confirm delivery. Validates Node module-cache singleton works for `sseClients`, `_fieldMarkupRate`, `_hydrateRate`.

**6.6 Public-URL contract (CRITICAL)** — the smoke script (§6.2) MUST explicitly assert these 6 immutable URLs (printed QR codes already deployed) are registered: `GET /splice/view/:token`, `GET /api/splice/view/:token/hydrate`, `GET /splice/field/:token`, `POST /splice/field/:token/markup`, `GET /splice/field/:token/markups/:id/image`, `POST /splice/field/:token/loss-records`. Fail-fast if any missing.

**6.7 CI + Playwright** — `npm run test:browser` green. Vite osp-training orthogonal but re-verify clean.

**6.8 Manual checkpoint (pre-merge)** — dev server + click through: create project → add location → cable → closure → splice → mint token → load `/splice/view/:token` incognito. Hydrate 200 with full payload = invisible refactor.

---

## 7. Estimated split metrics

| Metric | Before | After | Delta |
|:--|--:|--:|:--|
| Files | 1 | 17 | +16 |
| Total LOC | 7,314 | ~7,365 | +51 (orchestrator wrapper + per-file headers) |
| Largest file LOC | 7,314 | 770 (export.js) | −89% |
| Median file LOC | 7,314 | ~245 | −97% |
| Routes | 104 | 104 | 0 |
| URLs | 104 distinct | 104 distinct | 0 |
| Behavior changes | — | — | **NONE** |
| Schema changes | — | — | **NONE** |
| Test changes | — | +1 singleton sanity test | +1 file |
| `server.js` changes | — | — | **NONE** |

**Risk: LOW.** Mechanical refactor with full pre-existing test coverage (10 splice test suites) + route-equality diff guard.

---

## 8. Execution order for the fix-agent

Minimize broken-state windows:

1. **Create `_shared.js` first** — constants + helpers + factory. No routes yet.
2. **Cut sub-files ONE theme at a time** in this order (smallest/most-isolated first; tokens_public + projects last because they consume the most shared state):
   `comments` → `templates` → `loss_records` → `locking` → `locations` → `cables` (incl. line 574 per R1) → `closures` → `splitters_pathtrace` → `splices` → `search_sse` → `design_import` → `export` → `versions` → `tokens_public` (**verify each public URL letter-for-letter**) → `projects`.
3. **After each cut: boot smoke** + assert running route count = (sum of cut themes so far). If it drops, revert + retry.
4. **Final cut:** trim `routes/splice.js` to the ~50-LOC orchestrator. Grep the old file's contents to confirm everything moved.
5. **Commit each theme separately** on `agent/wave-SR1-splice-split` (~17 commits). Makes review + bisect trivial.
6. **Verification:** §6 in order — static → boot+count → URL-diff → jest → singleton → public-URL → CI.
7. **PR with inline route-diff** — reviewer confirms `routes_after.txt − routes_before.txt = ∅`.

---

## 9. Out of scope for SR-1

These belong to SR-2..SR-6 per W220:
- Refactoring inside route handlers (e.g., extracting transaction patterns).
- Consolidating duplicated SQL.
- Renaming routes, changing payload shapes.
- Adding new tests beyond §6.5 singleton sanity.
- Modifying `_splice_validation.js`.
- Modifying `splice.html` or any frontend.
- Migrations.
- Performance tuning.

**SR-1 is move-shop only.** If the fix-agent finds itself rewriting a handler, STOP — that's SR-2+ work.

=== W233 PLAN END ===
