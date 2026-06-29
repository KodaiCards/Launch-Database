# 09 — Hours / time (the trust-critical area) — 🔄 (09a: write-path + matching core)

> Mapped 2026-06-29. ⭐ Carter: **"I don't trust the hours part yet"** + **"hours are sacred / NO ROUNDING EVER."** So this is mapped with extra care; every fragility flagged. **09a = time_entries.js (legacy CRUD), _hours_match.js (keystone matcher), _csv_stage.js (staging).** Two trust-relevant findings surfaced immediately (O22 rounding, O23 split-brain). Pending → 09b: hours_csv.js (1413, the legacy importer) + hours_import.js (231, the keystone importer). 09c: timeclock_module.js (857).

## ⭐⭐ O22 — `snapHoursToQuarter` ROUNDS TO NEAREST 0.25 on every write (reconcile vs "NO ROUNDING EVER")
`_helpers.js:214` → **`snapHoursToQuarter(n) = Math.round(n * 4) / 4`**. Applied on EVERY time-entry write path (POST, /bulk, PUT — time_entries.js:177,264,394).
- `1.0→1.0`, `1.25→1.25` (grid values: no-op ✅). But `1.1→1.0` (**loses 0.1 hr**), `1.13→1.25` (**gains 0.12 hr**), `1.37→1.25`, `1.4→1.5`. Silent, both directions.
- **The tension:** Carter stated BOTH "snap to 0.25 grid" AND "NO ROUNDING EVER" (memory `_helpers`/`feature_hours_attribution`). Reconciliation = he treats **0.25 as the canonical unit of work** (you bill in quarter-hours), so snapping isn't "rounding" in his mind. That holds IFF all source data is already on the 0.25 grid.
- **The risk:** any non-grid input — a CSV with `1.1`, a timeclock free-text `1.3`, an AI tool — is **silently changed ±0.125 hr.** For RUS (government) billing, rounding UP = over-billing/compliance risk; rounding DOWN = lost billable time. Direction is data-dependent (nearest), so it can do either.
- **Recommendation / question for Carter:** if 0.25 is mandatory, **reject non-grid input** (400 "hours must be in 0.25 increments") rather than silently snapping — that honors "NO ROUNDING EVER" literally (never change what was logged) while still enforcing the grid. Today it silently rewrites. → O22. **This is exactly the kind of detail behind "I don't trust hours."**

## ⭐⭐ O23 — HOURS SPLIT-BRAIN: legacy `project_id` vs keystone `service_area_job_id` (likely THE root of the distrust)
`time_entries` has BOTH columns; a row is attached to ONE world:
| | LEGACY world | KEYSTONE world |
|---|---|---|
| Write path | `time_entries.js` POST/bulk/PUT → `time_entries.project_id` | `service_areas.js` `:id/jobs/:jobId/time` → `time_entries.service_area_job_id` (chunk 03) |
| Importer | `hours_csv.js` (→ projects rollup; the "hours land on WO rollup" problem, chunk 08) | `hours_import.js` + `_hours_match.js` (→ one `service_area_job`) |
| Read views | legacy `/api/time-entries` (joins `projects`), `/api/inspection` (projects), `_helpers.updateProjectHours` rollup | keystone `/api/hours/summary` (`te.service_area_job_id IS NOT NULL` — chunk 05), `service_areas` workspace, billing_keystone earned |
- **Consequence:** an entry created in one world is INVISIBLE in the other's views. Log hours on a keystone SA job → they don't appear in `/api/time-entries` or the Inspection tab. Import via the legacy CSV → they don't appear in `/api/hours/summary` or feed the keystone billing ledger. **Depending on which screen Carter opens, he sees different totals for the same person** — that is almost certainly why "hours feel janky / I don't trust them."
- This is the hours facet of O18 (parallel legacy/keystone) and ties O16 (keystone billing reads `service_area_job_id`; legacy reads `project_id`). **The cutover must pick ONE column and migrate; until then, no single screen shows all hours.** → O23 (highest-value hours finding).

## `time_entries.js` (622) — legacy time-entry CRUD (project_id world)
- `GET /api/time-entries` (role-scoped: engineers see own [staff_id else user_id], managers see their team's projects via `jobs.team`, admin all). Filters: project/staff/month/year/billable. Capped LIMIT 1000 (≤5000). Joins `projects`/`jobs`/`staff`/`clients`.
- `POST` + `/bulk` + `PUT` — all snap hours (O22). Safeguards (genuinely hardened): **entry_date guard** (not future, not >365d past — anti-backdating for billing manipulation), **engineer staff_id coercion** (can't log as another employee; mismatch→403), **manager team-scope**, **audit on every mutation isolated** (audit failure never 500s → prevents double-insert-on-retry), **HELD timecards** (`pending_project_request_id` when logging against a not-yet-approved project; validated still-pending).
- `DELETE` (+ `/by-staff/:staffId` bulk) — snapshot → delete → **undo bucket** (15s) → rollup. The `user_id` (creator) vs `staff_id` (whose hours) distinction is important: admin CSV-importing an engineer's hours sets `user_id=admin`, `staff_id=engineer` → engineer sees them via staff_id link (memory `feature_hours_attribution`).
- **⚠ History (supports the distrust):** the by-staff bulk-delete was **"silently auth-bypassed for weeks"** (requireAuth factory passed bare, never ran) — fixed, but shows this area has shipped real auth bugs. Plus a documented YTD-delete regression (commit 35d22e6). The area's track record is itself a reason for caution.

## `_hours_match.js` (142) — the KEYSTONE hours matcher (pure, unit-testable — good)
Dependency-free matching core (the buggy part isolated for `node --test`). `matchRow(row, ctx)`: a timecard row → ONE `service_area_job`. Requires: **known staff** (`normalizeName`), **WO# resolves to exactly one SA** (`normalizeWO` strips WO/0-pad), **discipline resolves to exactly one job** in that SA (exact job-name match distinguishes Inspector $90 vs RE $100 even though both team='inspection'; staff-assignment breaks ties). Anything ambiguous → `review` with a human reason (for the review queue). `TEAM_RULES` regex maps titles→teams (RE/inspect→inspection, permit→permitting, design/survey→design, splice/foreman/crew→construction), overridable in preview. `classifyUnbilled` buckets misc/permitting/WO-only customers as unbilled. **This is the modern importer's brain; the legacy hours_csv.js is what it replaces.**

## `_csv_stage.js` (28) — in-memory CSV staging (validate→edit→commit)
A `Map<stageId,{validRows,expiresAt}>`, 30-min TTL, 5-min sweep. Shared by the CSV import endpoints AND the AI `csv_smart_import` tool. **⚠ In-memory only** — a multi-instance deploy (or a process restart between validate and commit) loses staged rows. Fine single-instance; a scaling gotcha to remember (same pattern as uploadStore/_pendingApprovals).

## Findings (09a)
- **O22 (rounding):** nearest-0.25 snap on every write silently rewrites non-grid input ±0.125 — reconcile with "NO ROUNDING EVER" (recommend reject-not-snap). Trust-critical.
- **O23 (split-brain):** two hours worlds (project_id vs service_area_job_id), two importers, two view sets — no single screen shows all hours. Likely THE reason Carter distrusts hours. Cutover must unify.
- Positive: the write path is well-guarded (anti-backdate, engineer/manager scoping, isolated audit, undo buckets); `_hours_match` is clean + testable. The DESIGN is sound; the DEBT is the dual model + silent rounding.
- The legacy importer (hours_csv.js) is the "hours on WO rollup" source (chunk 08 inspection's ancestor-attribution exists to undo this) → confirm in 09b.

## Reapproach-if
- 09b (hours_csv 1413 = legacy importer → projects; hours_import 231 = keystone importer → _hours_match): confirm which world each writes; map the validate→stage→commit flow; look for MORE rounding sites + the WO-rollup attachment.
- 09c (timeclock_module 857): the timeclock portal backend + `makeAuditLogger` (used by time_entries.js) — which world does the timeclock write to?
- Chunk 18 (migrations): is there a UNIQUE/exactly-one-of constraint forcing project_id XOR service_area_job_id? (informs the O23 migration).
- Surface O22 + O23 to Carter directly — they're the concrete answers to "why don't I trust the hours."