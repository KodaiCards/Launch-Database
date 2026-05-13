# Wave Projection — Post-Fix Verification

## Stack snapshot (≤80 words)

HEAD `83f50d3`. Four fix-agent commits landed across math (`529c476`), arch (`96a4a54`, `2e6d152`), med/low (`2f111f5`, `634cd9b`, `995a0a2`, `00e04d0`, `e900fc0`), and frontend (`d0bc210`). Files verified: `automation.js`, `routes/inspection.js`, `routes/revenue.js`, `migrations/0033_projected_revenue_footage_trigger.sql`, `public/admin.html`, `public/js/dashboard_views.js`. All files pass `node --check`. No new HIGH/CRITICAL regressions found.

---

## Per-canonical-item status

| # | Status | Commit SHA | Verification snippet | Notes |
|---|---|---|---|---|
| H-1 | ADDRESSED | `529c476` | `CASE WHEN p.manual_invoice_amount IS NOT NULL THEN p.manual_invoice_amount::float ELSE COALESCE(bh.hours_done, 0) * COALESCE(p.billing_rate, 0)::float END AS earned` (`automation.js:1042-1046`) | Live `billable_hours` CTE replaces `actual_hours`; `manual_invoice_amount` honored via CASE. |
| H-2 | ADDRESSED | `529c476` | `AND COALESCE(is_billable, TRUE) = TRUE` (`automation.js:293, 335, 780`) | Filter applied in `buildPscRusProjection` lookback, MTD, and `buildInspectionRevenueProjection` recent_hours CTE. |
| H-3 | ADDRESSED | `529c476` | `AND p.status IN ('active')` (`automation.js:253`) | Changed from `('active','billed')`. Permitting bucket uses per-project `Math.max(0, expected - billed - wip)` (`automation.js:497`). |
| H-4 | ADDRESSED | `529c476` | `if ((weighted_rate \|\| 0) <= 0) return { ...zeroed, rate_missing: true };` (`automation.js:870`) | Eliminates `Infinity` budgetHours / garbage projected hours on zero-rate rows. |
| H-5 | ADDRESSED | `529c476` | Rate loop: `if ((p.billing_rate \|\| 0) > 0) { totalLookbackHrs += h; weightedRateNumerator += p.billing_rate * h; }` (`automation.js:517-520`). Zero-rate bucket: `bucketNoRate = true` + `bucketProjection = 0` (`automation.js:546`). | Rate-zero projects excluded from weighting; entire-bucket-no-rate flagged. |
| H-6 | ADDRESSED | `529c476` | `effectiveLookback = Math.min(lookbackWeeks, Math.max(1, Math.ceil(weeksSinceFirst)));` (`automation.js:527`). `const divisorWeeks = projectsWithHours > 0 ? totalEffectiveLookback / projectsWithHours : lookbackWeeks;` (`automation.js:552-554`) | Per-project first-entry query added; average effective lookback used as divisor. |
| H-7 | ADDRESSED | `529c476` | `WHERE entry_date >= ((NOW() AT TIME ZONE 'America/Chicago')::date - ...)` (`automation.js:291`); `dateInBusinessTz` exported and used in `routes/inspection.js:67`. Zero `CURRENT_DATE` references remain in any projection file. | Full grep confirms 0 `CURRENT_DATE` occurrences in `automation.js`, `routes/inspection.js`, `routes/revenue.js`. |
| H-8 | ADDRESSED | `529c476` | `const paceHrs = hours_recent_unweighted != null ? hours_recent_unweighted : hours_recent;` (`automation.js:875-877`). `hours_recent_unweighted` added to CTE SELECT and aggregated in all callers (`automation.js:768, 919-920`). | Unweighted count now drives pace divisor, eliminating ~40% systematic understatement. |
| ARC-1 | ADDRESSED | `96a4a54` | Output per umbrella: `{ billed, wip, projected_new, total, sparkline_weekly, breakdown }` (`automation.js:640-653`). WIP uses last-invoice-date boundary (`automation.js:306-325`). Budget cap: `Math.max(0, budgetAllocated - umbrellaBilled - umbrellaWip)` (`automation.js:617`). Legacy `projected_remaining_revenue` alias preserved (`automation.js:604, 651`). | Three-way split present at bucket and umbrella level. Double-count eliminated. |
| ARC-2 | ADDRESSED | `96a4a54` | `const burnRatio = (bucketBudget > 0 && bucketBilled > 0) ? bucketBilled / bucketBudget : 0; const effectiveHorizon = (bucketBudget > 0 && burnRatio >= CLOSE_OUT_THRESHOLD) ? CLOSE_OUT_HORIZON_WEEKS : horizonWeeks;` (`automation.js:570-575`) | Close-out heuristic applied at bucket and project level. No `eta_date` column added. |
| ARC-3 | ADDRESSED | `2e6d152` + `96a4a54` | Trigger fires `BEFORE UPDATE ON projects` (`migration 0033:36`): `IF NEW.billing_type = 'footage' AND (OLD.expected_revenue IS DISTINCT FROM NEW.expected_revenue ...) THEN NEW.projected_revenue := NEW.expected_revenue;` — sets NEW, not recursive. Hourly: `COALESCE(p.expected_hours, 0) * COALESCE(p.billing_rate, 0)` at read time in `routes/revenue.js:308`. | Trigger only fires on footage; no UPDATE inside trigger (BEFORE not recursive). |
| M-1 | ADDRESSED | `96a4a54` | `await client.query('BEGIN READ ONLY')` wraps all 5 queries (`automation.js:280`). `client.release()` in `finally` block (`automation.js:382`). | All lookback/WIP/first-entry/MTD/billed queries in single read-only snapshot. |
| M-2 | ADDRESSED | `e900fc0` | BE-1 List 2 (`null_expected_revenue`) returns permitting projects with NULL expected_revenue (`automation.js:1627-1647`). No projection math changed. | Surfaced in data-quality panel per spec. |
| M-3 | ADDRESSED | `2f111f5` | Comment block at `routes/revenue.js:331-336`: explains open-pipeline intent. `coverage_note` field added to response (`routes/revenue.js:389`). | Comment + coverage_note both present. |
| M-4 | ADDRESSED | `634cd9b` | `(i.billing_period_start = $1 AND i.billing_period_end = $2) OR (i.billing_period_start IS NULL AND EXTRACT(YEAR FROM i.invoice_date) = ... AND EXTRACT(MONTH ...))` (`automation.js:1143-1150`) | Two-branch match mirrors revenue.js monthly CTE. Legacy NULL-period invoices will now block duplicate billing. |
| M-5 | ADDRESSED | `2f111f5` | `<div class="stat-label" ...>RUS Next 13 Weeks</div>` (`admin.html:711`). `#s-90d-mtd-label` element present (`admin.html:724`). `horizonWeeks` default = 13 (`automation.js:219`). | Tile label + MTD sub-label element confirmed. |
| M-6 | ADDRESSED | `995a0a2` | `const stale = p.is_ongoing && hours === 0;` (`inspection.js:274`). `if ((p.status === 'active' \|\| p.is_ongoing) && !p.stale) acc.active_projects++;` (`inspection.js:293`). | Stale flag set; stale projects excluded from active_projects count. |
| L-1 | ADDRESSED | `529c476` | `will_exhaust_budget: budget_allocated > 0 && paceHours > budgetHours,` (`automation.js:894`) | Changed from `>=` to `>`. Comment confirms intent. |
| L-2 | ADDRESSED | `00e04d0` | `@deprecated` JSDoc above function (`automation.js:677`). `_inspectionProjectionWarnedOnce` guard + `console.warn` on first call (`automation.js:720-728`). | Deprecation wired. `/api/automation/inspection-projection` route aliases `buildPscRusProjection` (not the deprecated function). |
| L-3 | DEFERRED-OK | `00e04d0` | Comment at `routes/revenue.js:432-438` documents the query and UPDATE statement. `billing_cadence IS NULL` rows safely routed to one-time queue (`routes/revenue.js:440`). | No DB credentials in agent environment. Behavior is already safe (NULL → one-time queue). Count verification is a manual step. |
| L-4 | ADDRESSED | `529c476` | `COALESCE(p.expected_revenue, 0)::float - COALESCE(pb.already_billed, 0) AS unbilled_amount` for footage branch (`automation.js:1074`). `project_billed` CTE shared between hourly and footage (`automation.js:1017-1021`). | Prior partial invoices now deducted from footage branch. |
| BE-1 | ADDRESSED | `e900fc0` | 5-query endpoint at `automation.js:1599`. Returns `{ as_of, lists: { null_or_zero_rate, null_expected_revenue, stale_footage_revenue, sparse_history, ec_no_budget }, summary }` (`automation.js:1756-1766`). Admin-gated (`requireAdmin`). | All 5 lists present. Response schema matches CANONICAL spec. |
| BE-3 | ADDRESSED | `96a4a54` | `GET /api/automation/project-projection/:projectId` (`automation.js:1508`). Returns `{ actual_billed, wip, projected_remaining, total_at_completion, budget_allocated, burn_bar, horizon_reason, rate_missing, methodology_note }` (`automation.js:1354-1376`). | UUID format guard present. Admin-gated. Shape matches CANONICAL spec. |
| FE-1 | ADDRESSED | `d0bc210` | `_loadRusProjectionTile()` in `admin.html:7940`. Headline reads `data.total_billed + data.total_wip + data.total_projected_new`. Sub-rows `#s-90d-billed`, `#s-90d-wip`, `#s-90d-projected-new` populated. Sparkline SVG filled via `_rusSparklineSvg()`. DQ chip fetches BE-1 and toggles green/amber. | Empty state for no-RUS-data case handled at `admin.html:7965`. |
| FE-2 | ADDRESSED | `d0bc210` | Old `#psc-rus-projection-card` block deleted; replaced by comment at `admin.html:807`. New `#rus-proj-expand` card with bucket table built by `_renderRusBucketTable()` (`admin.html:8023`). `rusToggleExpand()` shows/hides on tile click. | Columns: Billed/WIP/Projected New/Total/Pace/wk/Budget Rem./Horizon — all present. |
| FE-3 | ADDRESSED | `d0bc210` | `loadProjectProjection(projectId)` called after `renderProjectDetail()` (`admin.html:6265`). `#pd-proj-inner` spinner placeholder rendered inline in stat-card HTML (`admin.html:6408, 6430`). Burn bar segments computed from `bb.billed_pct/wip_pct/projected_pct/overage_pct`. | Both one-time and monthly tile sets have the stat-card. |
| FE-4 | ADDRESSED | `d0bc210` | `#proj-dq-section` hidden by default (`admin.html:2705`). `openSettings()` shows + loads for `currentUser.role === 'admin'` (`admin.html:6791`). `loadProjectionDQ()` fetches BE-1 and renders 5 collapsible `<details>` sections (`admin.html:8171-8256`). All-clear state when `total_issues === 0`. | Admin gate double-layered: FE role check + BE `requireAdmin`. |
| FE-5 | ADDRESSED | `d0bc210` | Tile 1: `title="Based on 8-week billable-hours pace × billing rate..."` (`admin.html:714`). Tile 2: `title="Per bucket. Horizon shrinks to 3 weeks..."` (`admin.html:744`). Tile 3: `title="Single-project completion forecast. Bar segments:..."` (`admin.html:6408`). | All three tiles have `cursor:help` tooltip spans. |

---

## Regression sweep

| Surface | Status | Diff hunk reference | Notes |
|---|---|---|---|
| `/api/revenue/projected-total` backward compat | CLEAN | `routes/revenue.js:382-390` | Response still includes legacy `total`, `projects`, `with_projected`, `without_projected`, `by_client` fields. New `coverage_note` field is additive. Existing dashboard tile consumers unaffected. |
| `buildPscRusProjection` legacy alias | CLEAN | `automation.js:604, 651` | `projected_remaining_revenue` alias present at both bucket and umbrella output levels. Existing FE code reading `projected_remaining_revenue` continues to function. |
| `buildBillNowPreview` callers | CLEAN | `automation.js:1434` | Only one HTTP route (`/api/automation/bill-now-preview`) calls this. H-1/L-4 changes add a `project_billed` CTE and rewrite earned logic but the output shape (`rows`, `by_client`, `total`) is unchanged. |
| `buildInspectionRevenueProjection` legacy callable | CLEAN | `automation.js:1460-1468` | `/api/automation/inspection-projection` route aliases `buildPscRusProjection` (NOT the deprecated function). The deprecated function is still exported and callable but `console.warn` fires once. No 404 or shape break. |
| Migration 0033 trigger recursion | CLEAN | `migrations/0033:23-29` | Trigger is `BEFORE UPDATE`, sets `NEW.projected_revenue := NEW.expected_revenue`. Setting `NEW` in a BEFORE trigger does not issue a second UPDATE — PostgreSQL applies it to the row being inserted. No recursion possible. |
| Migration 0033 scope | CLEAN | `migrations/0033:23` | `IF NEW.billing_type = 'footage'` — only fires on footage projects. Hourly projects untouched. |
| H-7 CURRENT_DATE sweep | CLEAN | `automation.js`, `inspection.js`, `revenue.js` | `grep -nE 'CURRENT_DATE'` returns zero results across all three files. All boundaries use `(NOW() AT TIME ZONE 'America/Chicago')::date`. |
| H-2 is_billable in both functions | CLEAN | `automation.js:293, 335, 780, 1028, 1259, 1273, 1280` | Filter present in `buildPscRusProjection` lookback, MTD, WIP, first-entry; `buildInspectionRevenueProjection` recent_hours CTE; `buildBillNowPreview` billable_hours CTE; `buildProjectProjection` lookback and WIP. |
| FE Tile 1 — API shape consumption | CLEAN | `admin.html:7956-7962` | Reads `data.total_billed`, `data.total_wip`, `data.total_projected_new` with `data.grand_total` fallback. Reads `data.rows` with `data.umbrellas` fallback. All three top-level fields present in BE response. |
| FE Tile 2 — old display:none block deleted | CLEAN | `admin.html:807` | Old `#psc-rus-projection-card` block fully removed; only a comment remains. No residual `display:none` HTML from the old tile. |
| FE Settings DQ chip click | CLEAN | `admin.html:8012` | `dqChip.onclick = (e) => { e.stopPropagation(); openSettings(); };` — `stopPropagation()` prevents tile click from also toggling expand. Correct. |

---

## New findings

| # | Severity | File:line | Issue |
|---|---|---|---|
| NF-1 | LOW | `public/admin.html:8026` | FE `BUCKET_LABELS` map uses key `misc` but BE `buildPscRusProjection` emits `job_bucket: 'other'`. Lookup `BUCKET_LABELS['other']` returns `undefined`; fallback renders the raw string "other" in the bucket table. Cosmetic only — no data loss, no crash. |
| NF-2 | LOW | `public/admin.html:7906` | `_rusExpanded` module-level flag is not reset when `loadDashboard()` re-renders. If an SSE update triggers a re-render while the expansion is open, the expand card is re-hidden in DOM but `_rusExpanded` remains `true`, so the next click collapses rather than opens. Low-traffic edge case, cosmetic. |

---

## Coverage gaps

Verified all 25 canonical items (H-1..H-8, ARC-1..ARC-3, M-1..M-6, L-1..L-4, BE-1, BE-3, FE-1..FE-5) and the regression sweep surfaces. Not verified: L-3 live DB count (no credentials available; deferred per fix agent — safe by code path analysis). No tests run (DATABASE_URL not set; pre-existing condition per FIX_REPORT_FE).

=== WAVE PROJECTION POST-FIX VERIFICATION END ===
