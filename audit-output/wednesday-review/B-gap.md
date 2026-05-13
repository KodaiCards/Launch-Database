# Wednesday Review — Auditor B: Gap Analysis
> Framing: of the queued canonical items from Friday's plan, what's done, partial, open?
> Date: 2026-05-13 | Branch: claude/debug-previous-issues-MoN9D | HEAD: dbba70e (+ 4 unlabelled commits)

---

## Commits since checkpoint (317e3c5)

| SHA | Summary | Relevance |
|---|---|---|
| `e493200` | "x" — 19 files, Wave 1.5 ungated endpoints + token-from-body + logout invalidation | Wave 1.5 |
| `cafa438` | Hotfix: jobs.js missing requireAuth destructure (boot crash regression from e493200) | Wave 1.5 |
| `c323f54` | "c" — ai.js: advance_permit_stage project-type guard + actor binding | Wave 2 BE-AI |
| `2c3e0e9` | "c" — ai.js: log_time_entries MAX_ENTRIES=100 cap | Wave 2 BE-AI |
| `05fe2ba` | "c" — admin.html: skip-nav, undo bar aria-live, nav-tab role/aria-selected, aria-hidden on icons | Wave 3 A11y |
| `dbba70e` | Wave 2 BE-AI v3: bulk-delete txn, injection markers, upload user binding, MAX_ITERATIONS warning, log_time_entries cap | Wave 2 BE-AI |

Also: `migrations/0030_perf_indexes.sql` present — all 9 P0 indexes landed (undated commit not in log above, pre-dates this window or was squashed in).

---

## Wave 1.5 — 38 items + 1 bonus

### Tier 1: Ungated endpoints

| Item | Status | Evidence |
|---|---|---|
| `PUT /api/projects/:id/ongoing` | ADDRESSED | `routes/design_pipeline.js:34` — `requireAuth(['admin','design_manager','permitting_manager'])` |
| `POST /api/potential-permits` | ADDRESSED | `routes/potential_permits.js` — `requireAuth(roles)` added in e493200 |
| `PUT /api/potential-permits/:id` | ADDRESSED | Same commit |
| `DELETE /api/potential-permits/:id` | ADDRESSED | Same commit |
| `GET /api/reports/hours` | ADDRESSED | `routes/reports.js` — gated admin+managers in e493200 |
| `GET /api/reports/billing` | ADDRESSED | Same commit |
| `GET /api/inspection` | ADDRESSED | `routes/inspection.js` — gated in e493200 |
| `GET /api/projects/:id/detail` | ADDRESSED | `routes/project_detail.js` — `requireAuth()` in e493200 |
| Bonus: `GET /api/design` | ADDRESSED | `routes/design_pipeline.js:14` — `requireAuth(roles)` |

### Tier 2: Too-permissive auth

| Item | Status | Evidence |
|---|---|---|
| `PUT /api/projects/:id` | ADDRESSED | `routes/projects.js:328` — `requireAuth()` |
| `POST /api/splice/projects` | ADDRESSED | (unchanged from Wave 1 fix; was already gated) |
| Splice SSE no heartbeat re-validation | OPEN | `routes/splice.js:3480` — pingTimer writes `: ping` but never re-checks JWT `iat` vs `tokens_invalid_after`. A logout while a splice SSE is open will not invalidate the stream. |

### Tier 3: Body-actor sweep

| Item | Status | Evidence |
|---|---|---|
| `portal_module.js:actorOf` fallback to `req.body?.proposed_by` | OPEN | Line 416 still reads `req.body?.proposed_by` as fallback when `req.user` is absent. Auth-required routes always have `req.user`, but defensive fallback creates confusion and could fire on mis-routed requests. |
| Approve/reject `reviewed_by` from body | ADDRESSED | `routes/potential_permits.js` — `reviewed_by` now `req.user.full_name` |
| `admin.js` adopt-orphan `uploaded_by` | PARTIAL | Not found in e493200 diff; needs independent check in `routes/admin.js`. |
| `ai.js` `advance_permit_stage` `updated_by` | ADDRESSED | `c323f54` — actor now `actor.username` from `req.user`; fallback still `toolInput.updated_by \|\| 'AI'` but server-derived takes precedence. |
| `projects.js` + `portal_module.js` `permit_manager` | OPEN | `portal_module.js:837,961` — `permit_manager` still from `req.body`, stored as `updated_by` in `permit_stages`. Any authenticated user can spoof the permit manager attribution. |
| `splice.js:2470` `created_by_staff_id` semantic mismatch | OPEN | Not touched in any commit since checkpoint. |

### Tier 4: Error sweep

| Item | Status | Evidence |
|---|---|---|
| 6 PUBLIC catch blocks leaking `e.message` | PARTIAL | `routes/splice.js:2781` area — hydrate at line 2802 `res.status(500).json({ error: e.message })` still present. `routes/potential_permits.js` raw error fixed. `projects.js:82,101` — still `res.status(500).json({ error: e.message })`. |
| ~107 authed catches with same pattern | OPEN | No sweep committed. |
| `permits.js:19-39`, `projects.js:28-82,85-101` GETs unauthenticated + raw errors | PARTIAL | GET /api/projects and GET /api/projects/:id now gated; raw `e.message` in those same handlers NOT fixed. |

### Tier 5: Frontend token + CSRF

| Item | Status | Evidence |
|---|---|---|
| Logout doesn't bump `tokens_invalid_after` | ADDRESSED | `auth.js` — `UPDATE users SET tokens_invalid_after = NOW()` in logout handler (e493200) |
| Login returns token in body | ADDRESSED | `auth.js:346-361` — token removed from login response (e493200) |
| Change-password returns new token in body | ADDRESSED | `auth.js:474` — `res.json({ ok: true })` without token (e493200) |
| Bearer skips CSRF / cookie-only inconsistency | OPEN | Not addressed in any commit. |

### Tier 6: Cascade + Puppeteer SSRF

| Item | Status | Evidence |
|---|---|---|
| `portal_module.js:281` client-delete no cascade pre-check | OPEN | Not touched. |
| `routes/clients.js:63` incomplete cascade preview | OPEN | Not touched. |
| `schema.sql:81 vs 261` parent_id FK contradiction | OPEN | Not touched. |
| `projects.client_id` RESTRICT | OPEN | Not touched. |
| Puppeteer SSRF in `invoice_template_engine.js:467-501` | OPEN | `setContent` still used with `waitUntil: 'load'` which fetches external resources. No `page.setRequestInterception()` or Content-Security-Policy blocking. |
| `sanitizeTemplateHtml` not exported | OPEN | `module.exports` at end of file — `sanitizeTemplateHtml` not in exports list. |

### Tier 7: Default-deny middleware

| Item | Status | Evidence |
|---|---|---|
| No-op fallback in `design_pipeline.js:10`, `permits.js:17`, `concentrators.js:13` | OPEN | Pattern `(mw && mw.requireAuth) \|\| (() => (req, res, next) => next())` still present verbatim. Routes appear to always receive `mw` but the no-op safety-valve means a bad invocation would silently skip auth. |
| B+C hybrid default-deny proposal | OPEN | Architectural change, not yet implemented. |

### Tier 8: Schema drift

| Item | Status | Evidence |
|---|---|---|
| `is_billable` in schema.sql + migration 0029 | OPEN | Both still define it. Not harmful at runtime (IF NOT EXISTS) but drift remains. |
| `users` table in bootstrapAuthSchema not in schema.sql | OPEN | Not reconciled. |
| Dual `uploaded_by` VARCHAR + `uploaded_by_user_id` UUID | OPEN | `schema.sql:185` `uploaded_by VARCHAR(100)` + `routes/splice.js:3193` `uploaded_by_user_id` both present. |

### Tier 9: JWT

| Item | Status | Evidence |
|---|---|---|
| `JWT_AUDIENCE` defaults to `'lfs'`, no `issuer` set | OPEN | `auth.js:45` — audience now set and checked (`JWT_AUDIENCE` env var, default `'lfs'`), but `issuer` option still absent from both `sign` and `verify`. |

**Wave 1.5 Totals:** 9 ADDRESSED, 1 PARTIAL→nearly-done, ~20 OPEN (incl. many error-sweep + cascade + SSRF + schema-drift)

---

## Wave 2 BE-AI — 18 items

| Item | Status | Evidence |
|---|---|---|
| `update_engineering_contract` missing from `DESTRUCTIVE_AI_TOOLS` | ADDRESSED | `routes/ai.js:1984` — added in dbba70e comment block |
| `update_engineering_contract` missing from `MODIFYING_TOOLS` | OPEN | `routes/ai.js:2404-2414` — list does NOT include `update_engineering_contract`. Also missing: `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import`. |
| `userWantsAction()` third regex unanchored | OPEN | `routes/ai.js:79` — `\b(create\|add\|...)\b` fires anywhere in message. Not anchored to start. |
| AI tool actor strings (`advance_permit_stage` `updated_by`) AI-supplied | ADDRESSED | `c323f54` — actor from `req.user`; fallback is `toolInput.updated_by \|\| 'AI'` (safe: server-derived takes priority) |
| `bulk_create_projects` writes `billing_type='hourly'`, `billing_rate=0` for rollups | ADDRESSED | (per dbba70e commit message: "bulk_create_projects rollup billing shipped at 5e22c27") |
| `bulk_create_projects` no transaction | ADDRESSED | `routes/ai.js:1169` — `txClient.query('BEGIN')` present |
| `delete_project`/`bulk_delete_projects` no transactions | ADDRESSED | dbba70e — bulk_delete wrapped in BEGIN/COMMIT/ROLLBACK |
| DB context includes `projects.notes` (stored injection) | ADDRESSED | dbba70e — injection markers `[user-supplied]...[/user-supplied]` wrapping |
| Tool-output reflection unsanitized | OPEN | No sanitization of tool outputs before reflection into AI context. |
| `MAX_ITERATIONS=15` silent exit | ADDRESSED | `2c3e0e9` + dbba70e — user-visible warning appended to finalText |
| `log_time_entries` no entry-count cap | ADDRESSED | `2c3e0e9` + dbba70e — MAX_ENTRIES=100, clear error with split recommendation |
| Client-controlled conversation history no validation | OPEN | No structural validation of incoming `messages` array. |
| Approval user-binding double-null bypass | OPEN | `routes/ai.js:2227` — `if (pending.user_id && req.user &&...)` skips check when `user_id` is null. |
| `uploadStore` no user binding | ADDRESSED | dbba70e — `owner_id` captured; GET + tool calls check `actor.id === owner_id` (403 otherwise) |
| `advance_permit_stage` no project-type check | ADDRESSED | `c323f54` — type guard added, returns clear error if not `'permitting'` |
| Non-CSV upload raw_text 50KB unsanitized | OPEN | No size/content validation for raw_text uploads. |
| `query_database` can SELECT `users.password_hash` | OPEN | `routes/ai.js:1553-1585` — READ ONLY txn blocks writes; no column-level deny for `password_hash` / `tokens_invalid_after`. |
| query→write_sql chain UX (informational) | OPEN | No change. |
| `MODIFYING_TOOLS` list incomplete | OPEN | As noted above: `update_engineering_contract`, `bulk_create_projects`, `bulk_delete_projects`, `csv_smart_import` missing. |

**Wave 2 BE-AI Totals:** 9 ADDRESSED, 9 OPEN

---

## Wave 2 FE-Crit — 27 items

| Item | Status | Evidence |
|---|---|---|
| Tree-cascade bug `tree_state.js:107-119` | OPEN | `public/js/tree_state.js` Set collapse logic unchanged |
| Stale `launchfiber-splicematrix.xyz` URL in `design.html:354` | OPEN | `public/design.html:354` — URL still present |
| Stale `launchfiber-splicematrix.xyz` URL in `admin.html:637-639` | OPEN | `public/admin.html:639` — URL still present |
| Missing try/catch `saveTimeEntry`/`deleteTimeEntry` | OPEN | `public/js/hours_tab.js:496,519` — no try/catch; throws silently on network error |
| Missing try/catch `loadHours`/`loadDashboard`/`loadRevenue` | OPEN | Not verified individually but same pattern in JS modules |
| `uploaded_by`/`proposed_by` not pre-filled | OPEN | Not addressed |
| Native `confirm()`/`alert()`/`prompt()` inconsistent | OPEN | `saveTimeEntry` calls `alert()` line 501; `deleteTimeEntry` calls `confirm()` line 520 |
| No double-submit guards | OPEN | Not addressed |
| `htreeToggle` Set mutation in iteration | OPEN | Not addressed |
| Invoice History tree pollutes `hoursTreeState` | OPEN | Not addressed |
| `persistFilter` `proj-search` not re-applied | OPEN | Not addressed |
| Permitting poll-tick wipes search | OPEN | Not addressed |
| `loadPermitDocs` fetches ALL permits | OPEN | Not addressed |
| PDF export no loading feedback | OPEN | Not addressed |
| Field-markup no upload progress | OPEN | Not addressed |
| Clear-filter button icon-only | OPEN | Not addressed |
| Splice viewer hides sidebar at <900px | OPEN | Not addressed |
| Launcher dark-mode logo inversion missing | OPEN | `public/launcher.html:434` — theme detection present but no logo `filter:invert` for dark mode |
| Design pipeline emits no SSE | OPEN | Not addressed |
| No "Scoped to X Team" indicator | OPEN | Not addressed |
| `showClearFilterBtns` shows on empty string | OPEN | Not addressed |
| Hardcoded `#f0f0f0` border | OPEN | Not addressed |
| No `:focus-visible` | OPEN | Not addressed (admin.html CSS check) |
| `loadRevenue` 6 concurrent requests | OPEN | Not addressed |
| `clearAllPersistedUiState` uses native alert | OPEN | Not addressed |

**Wave 2 FE-Crit Totals:** 0 ADDRESSED, 25 OPEN (stale URL × 2, try/catch × multiple, all UI items)

---

## Wave 3 BE-Perf — 22 items

### P0: Indexes

| Item | Status | Evidence |
|---|---|---|
| `time_entries(project_id, entry_date)` | ADDRESSED | `migrations/0030_perf_indexes.sql:14` |
| `time_entries(staff_id, entry_date)` | ADDRESSED | `migrations/0030_perf_indexes.sql:20` |
| `projects.parent_id` | ADDRESSED | `migrations/0030_perf_indexes.sql:25` |
| `projects.status` | ADDRESSED | `migrations/0030_perf_indexes.sql:31` |
| `projects.client_id` | ADDRESSED | `migrations/0030_perf_indexes.sql:37` |
| `contracts.engineering_contract_id` | ADDRESSED | `migrations/0023_ec_rollup_linkage.sql:13` (from RUS-Fix) |
| `invoice_items.project_id` | ADDRESSED | `migrations/0030_perf_indexes.sql:48` |
| `invoice_items.invoice_id` | ADDRESSED | `migrations/0030_perf_indexes.sql:53` |
| `permit_stages` partial | ADDRESSED | `migrations/0030_perf_indexes.sql:66` — partial on `completed_at IS NULL` |

### P1: Dashboard + N+1

| Item | Status | Evidence |
|---|---|---|
| Dashboard `ytd_revenue` correlated CTE per row | PARTIAL | `routes/dashboard.js:14-50` — 1-hour in-memory cache added; correlated subquery still runs on cache miss. Not fully eliminated. |
| N+1 in `billing.js:confirm-batch` | ADDRESSED | `routes/billing.js:397` — batch-fetch all project names + cadences in ONE query |
| N+1 in `billing.js:bill-multiple` | ADDRESSED | `routes/billing.js:164` — batch-insert via single multi-row INSERT |
| N+1 in `invoice_generator.buildInvoiceData` | OPEN | Not confirmed fixed; no matching commit found |

### P2: Structural

| Item | Status | Evidence |
|---|---|---|
| `updateProjectHours` recursion blocking | OPEN | Not addressed |
| `collectProjectTree` BFS-per-node | OPEN | Not addressed |
| `GET /api/time-entries` unbounded | ADDRESSED | `routes/time_entries.js:83` — LIMIT+OFFSET added |
| `GET /api/projects` unbounded | ADDRESSED | `routes/projects.js:38` — default LIMIT 1000 |
| Puppeteer no pool | OPEN | `invoice_template_engine.js:474` — browser launched per call, closed in finally |
| SSE per-heartbeat DB query | OPEN | Not addressed |
| Sync `fs.*` in admin | OPEN | `routes/invoice_templates.js:88,265,318` — `readFileSync`/`existsSync` in request handlers |
| Sync `fs.readFileSync` in CSV/AI | OPEN | `routes/hours_csv.js:231`, `routes/ai.js:2114,2125` |

### P3

| Item | Status | Evidence |
|---|---|---|
| contracts no index on EC/client | PARTIAL | EC index present (0023); client index unknown |
| pg pool max=10 | OPEN | Not confirmed changed |
| long billing transaction | OPEN | Not addressed |
| no ANALYZE on high-churn tables | OPEN | Not addressed |
| `revenue/projected-total` 3 queries | OPEN | Not addressed |

**Wave 3 BE-Perf Totals:** 9 P0 ADDRESSED, 3 P1 ADDRESSED (1 PARTIAL), ~10 OPEN

---

## Wave 3 FE-A11y — 25 items

| Item | Status | Evidence |
|---|---|---|
| Modal `role="dialog"`, `aria-modal`, focus trap, focus return (47+ instances) | OPEN | Zero `role="dialog"` in admin.html as of HEAD |
| Form labels not `for=`-associated | OPEN | Not addressed |
| 29+ close buttons no `aria-label` | PARTIAL | One dismiss button in undo bar got `aria-label="Dismiss"` (05fe2ba) — 28+ remain |
| Nav-tabs no `role="tab"`/`aria-selected` | ADDRESSED | `05fe2ba` — `role="tab"` + `aria-selected` added to all admin.html nav tabs |
| Undo bar no `role="alert"`/`aria-live` | ADDRESSED | `05fe2ba` — `role="status" aria-live="polite" aria-atomic="true"` added |
| No `:focus-visible` | OPEN | Not addressed |
| No skip-nav | ADDRESSED | `05fe2ba` — skip-nav link added to admin.html |
| No `<main>` landmark | ADDRESSED | `05fe2ba` — `<main class="main" id="main-content">` added |
| Login error no `role="alert"` | OPEN | Not addressed |
| `form-hint` `display:none !important` | OPEN | Not addressed |
| Hours calendar cells no keyboard | OPEN | Not addressed |
| Calendar legend color-only | OPEN | Not addressed |
| Clickable `<div>` widgets no keyboard | OPEN | Not addressed |
| Pipeline stage strip color-only | OPEN | Not addressed |
| Notification badges no aria-label | OPEN | Not addressed |
| User-pill `<div>` with onclick | OPEN | Not addressed |
| `--text-muted` contrast 4.48:1 | OPEN | Not addressed |
| `.badge-hold` contrast 4.09:1 | OPEN | Not addressed |
| Portals dropdown no `aria-expanded` | OPEN | Not addressed |
| AI thinking animation no reduced-motion | OPEN | Not addressed |
| Audit drawer no focus management | OPEN | Not addressed |
| Settings-dot color-only | OPEN | Not addressed |
| Launcher `body{overflow:hidden}` blocks 200% zoom | OPEN | Not addressed |
| Splice viewer off-canvas at <900px | OPEN | Not addressed |
| Splice canvas no keyboard alternative | OPEN | Not addressed |
| Stale splicematrix URL in design.html | OPEN | `public/design.html:354` still present |

**Wave 3 FE-A11y Totals:** 4 ADDRESSED, 1 PARTIAL, 21 OPEN

---

## UI-A (Training tile + launcher polish)

| Item | Status | Evidence |
|---|---|---|
| Training tile in `PORTAL_DEFS` in `server.js` | OPEN | `server.js:192-253` — no Training entry in PORTAL_DEFS |
| `public/training.html` created | OPEN | No such file |
| Logo size + single-square layout polish | OPEN | Not addressed |
| Dark-mode logo inversion fix | OPEN | `public/launcher.html:434` theme detection exists; no `filter:invert` for logo in dark mode |

**UI-A Totals:** 0 of 4 ADDRESSED

---

## OSP-Merge

| Item | Status | Evidence |
|---|---|---|
| 12 OSP red-team FIXes in `kodaicards/osp-design-training` | OPEN | Branch `claude/debug-previous-issues-MoN9D` does not exist in osp-design-training; only `main` and `claude/field-vs-textbook-research-Jbeii` present |
| Vite build | OPEN | Prerequisite to above |
| Copy `dist/` to `public/training/` | OPEN | No `public/training/` directory |
| Static-serve behind `requireAuth()` | OPEN | No route in server.js |
| User-context shim | OPEN | Not addressed |

**OSP-Merge Totals:** 0 of 5 ADDRESSED

---

## Cleanup

| Item | Status | Evidence |
|---|---|---|
| Archive redundant planning docs | OPEN | All 8 docs still at repo root |
| Orphan source files | OBSOLETE | None exist (confirmed in CLEANUP_CANDIDATES.md) |
| Research corpus archival | OPEN | All research/ files still present |

**Cleanup Totals:** 0 ADDRESSED, items are low-priority

---

## Grand Totals

| Wave | Total Items | ADDRESSED | PARTIAL | OPEN |
|---|---|---|---|---|
| Wave 1.5 | 39 | ~16 | ~3 | ~20 |
| Wave 2 BE-AI | 18 | 9 | 0 | 9 |
| Wave 2 FE-Crit | 27 | 0 | 0 | 27 |
| Wave 3 BE-Perf | 22 | 12 | 1 | 9 |
| Wave 3 FE-A11y | 25 | 4 | 1 | 20 |
| UI-A | 4 | 0 | 0 | 4 |
| OSP-Merge | 5 | 0 | 0 | 5 |
| Cleanup | ~5 | 0 | 1 | ~4 |
| **TOTAL** | **~145** | **~41** | **~5** | **~99** |

Approximately **41 of ~145 items addressed** (~28%). The remaining ~99 items span all 6 waves.

---

## Priority Order for Resume

1. **Wave 1.5 Fix Agent (remaining 20 items)** — highest risk: SSRF still open, raw `e.message` leaks still broad, splice SSE iat re-validation OPEN, body-actor `permit_manager` OPEN. Security debt. Dispatch first.
2. **Wave 2 BE-AI Fix Agent (remaining 9)** — `query_database` can read `password_hash`, unanchored regex, MODIFYING_TOOLS gap, approval double-null bypass. All security-relevant.
3. **Wave 2 FE-Crit Fix Agent (all 27)** — stale URLs, missing try/catch, double-submit, tree-cascade. UX correctness + data integrity.
4. **UI-A** — Training tile (prerequisite for OSP-Merge). Small but blocking.
5. **OSP-Merge** — requires osp-design-training branch + Vite build first. Cannot start until UI-A clears.
6. **Wave 3 FE-A11y (21 remaining)** — 47+ modal dialog instances, color-only indicators, keyboard gaps.
7. **Wave 3 BE-Perf (9 remaining)** — Puppeteer pool, sync fs, N+1 in invoice_generator, collectProjectTree.
8. **Cleanup** — lowest priority; do last.

=== REVIEW-B END ===
