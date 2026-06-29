# 09 — Hours / time (the trust-critical area) — ✅ COMPLETE (09a write-path · 09b importers · 09c timeclock)

> **Bottom line for Carter's "I don't trust the hours": 3 concrete, fixable causes — O23 (split-brain: legacy `project_id` vs keystone `service_area_job_id`, so different screens show different totals), O22 (inconsistent silent rounding: timeclock 2-decimal vs manual/CSV snap-to-0.25, edits silently snap), O24 (keystone CSV importer lacks dedup → re-upload doubles hours).** The design INTENT honors "hours sacred" (dedicated audit trail, no-silent-loss, tz-correct); the failures are dual-model + inconsistent policy, all addressable in the cutover.

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

---
## 09b — the two CSV importers (hours_csv.js legacy + hours_import.js keystone) — mapped 2026-06-29

**Shared parse layer, divergent match+write layers.** Both upload→parse using the SAME pure helpers (`detectColumns`, `parseDateCell`, `findHeaderRow`, `arrayToObjects`, `inferJobTitle`) exported from hours_csv.js `_helpers`; hours_import.js imports them. Both snap hours via `snapHoursToQuarter` (O22 confirmed in BOTH paths, multiple sites).

### `hours_import.js` (231) — KEYSTONE importer (lean, match-only) → `service_area_job_id`
- `POST /api/hours/import/validate` (upload→parse→`buildMatchContext` [areasByWO from `service_areas.work_order_number`, jobsByArea from `service_area_jobs`, staffByName] →`matchRow` per row→staged preview in `csvStage`) → `POST /commit` (insert matched/inline-overridden rows → `recomputeJob`). Writes `time_entries.service_area_job_id`. **Confirms O23 keystone side.**
- Review rows resolved INLINE at commit via `overrides` map (no persistent queue — deliberate "one screen, migration deferred").
- **MATCH-ONLY:** requires the SA + job to already exist (won't create anything). Unknown WO/employee → review.

### `hours_csv.js` (1413) — LEGACY importer (elaborate) → `project_id`
- Endpoints: `/csv-validate`, `/csv-edit-row`, `/csv-commit`, `/csv-queue-unmatched`, `/csv-review-queue` (GET), `/csv-review-queue/:id/match`, `/:id/discard`, `/pending-count`. Writes `time_entries.project_id`. **Confirms O23 legacy side.**
- **Auto-creates projects for unknown WOs** via `app.locals.ensureRollupChain` (line 1022-1050) → **THIS is the "hours land on a WO rollup" source** (chunk 08 inspection's 4-tier ancestor-attribution exists precisely to undo this). 
- **Has data-integrity guards the keystone importer LACKS** (see O24): (1) **dedup** — builds match keys `staff_id|project_id|date|jobKey` and queries existing entries to skip already-imported rows; (2) **billed-period guard** — looks up `invoice_items` periods and refuses to re-import into an already-billed month; (3) **persistent review queue** (`csv_review_queue` table) with match/discard/pending-count, surviving across sessions; (4) separate unbilled-row handling (`project_id NULL`, `is_billable=FALSE`, `UNB:<category>` key).

### ⭐⭐ O24 (NEW — "nothing can break" risk): the KEYSTONE importer has NO dedup + NO billed-period guard
The keystone `hours_import.js` commit (lines 204-215) INSERTs every `toCommit` row with **no dedup check and no billed-period check.** ⇒ **re-uploading the same CSV via the keystone path DOUBLES the hours** (and can import into an already-billed month). The legacy `hours_csv.js` protects against both. This is a **feature-parity regression** that must close BEFORE the keystone importer is trusted/canonical — directly violates "hours are sacred / nothing can break." Also a candidate explanation if Carter has seen inflated hours. → open_items O24.

## Findings (09b)
- **O23 fully confirmed:** legacy hours_csv→`project_id` (+auto-creates projects=WO-rollup source); keystone hours_import→`service_area_job_id` (match-only). Same parse code, different worlds.
- **O22 confirmed in both importers** (snap at validate + every commit site).
- **O24 (new):** keystone importer lacks dedup + billed-period guard → re-import doubles hours. The cutover is a feature-parity project, not a reroute: keystone must regain dedup, billed-guard, persistent review queue, and (maybe) auto-create before it can replace hours_csv.
- The legacy importer is genuinely sophisticated (dedup, billed-guard, review queue, auto-create) — don't underestimate the port. Preserve these behaviors.

---
## 09c — timeclock_module.js (857) — the Time Clock portal backend → **09 COMPLETE**

Punch-clock/timer hybrid: clock-in opens a `time_clock_sessions` row (one active per user, enforced by partial unique index), clock-out closes it AND inserts a `time_entries` row; switch = atomic clock-out+clock-in. Field employees' daily hours flow through here.
- **⭐ Writes the LEGACY world (`project_id`):** clock-out/switch `INSERT INTO time_entries (project_id, …)` (lines 550, 643); sessions + picker-data use the legacy `projects` rollup (`is_rollup`, `rollup_type='service_area'`). **So the daily field timeclock lands hours on `project_id`** → confirms O23 and pins a key consequence: timeclock hours are legacy-side, invisible to `/api/hours/summary` + the keystone billing ledger.
- **⭐⭐ O22 EXPANDED — rounding is INCONSISTENT across entry paths:** timeclock clock-out computes `hours = Math.round(rawHours*100)/100` (**2 decimals, NOT 0.25-snapped** — the code comment explicitly defers grid-snapping to "a settings flag in a later round") via its OWN direct INSERT (bypasses `snapHoursToQuarter`, which only lives in time_entries.js POST/PUT). So **timeclock hours are 2-decimal (3.47); manual/CSV hours are 0.25-snapped.** Same person, different granularity by method. Worse: **editing a timeclock entry via the Hours tab (PUT) silently snaps it** (3.47→3.5). Neither a single coherent policy nor "NO ROUNDING EVER." → fix = ONE rounding policy at ONE chokepoint (recommend: store raw/2-decimal everywhere + reject-or-display-snap, never silently rewrite on edit). This inconsistency is itself a strong "janky/untrustworthy" signal.
- **Trust POSITIVES (real strengths here):** (1) **dedicated `time_entry_audit`** — every time_entry INSERT/UPDATE/DELETE (from ANY source: timeclock/admin/CSV/api) writes before/after JSONB + actor + `meaningful` flag (hours/project/job changes) + 64KB cap; admin viewer `/api/_admin/timeclock-audit`. Full per-hour traceability — Carter can see exactly who changed any entry. (2) **No silent hour loss** — the old 24h HARD cap that "silently destroyed wages" is replaced by 12h soft-flag (`forgot_clock_out` + review badge) + 36h refuse-and-fix-manually. (3) **tz-correct** `entry_date` (start day, America/Chicago `BUSINESS_TZ`, DST-safe Intl). (4) atomic switch; week view in business tz with string-date math (no UTC drift).
- **Notes for later chunks:** timeclock has its OWN `bootstrapTimeClockSchema` (runs every startup — ANOTHER schema layer beyond migrations/initSchema/bootstrapV3Schema → chunk 14/18) and its OWN `dateInBusinessTz` copy (duplicated with automation.js → chunk 17). `makeAuditLogger` is built once in server.js and injected into time_entries.js as `auditTimeEntry`.

## Findings (09c) — area 09 COMPLETE
- **O23: timeclock = legacy (project_id).** The daily field-hours path is legacy-side; another concrete split-brain consequence (field hours don't reach keystone reporting/billing).
- **O22 expanded: rounding inconsistency** (timeclock 2-dp vs manual/CSV 0.25-snap; edit silently snaps). Bigger trust issue than rounding alone — updated O22.
- **Trust isn't all bad:** dedicated hours audit trail + no-silent-loss + tz-correctness are genuinely strong. The DESIGN intent honors "hours sacred"; the FAILURES are the dual model (O23), inconsistent rounding (O22), and the importer parity gap (O24). All three are fixable and concentrated.
- Net for Carter's distrust: **3 concrete causes — O23 (split-brain, different totals per screen), O22 (inconsistent silent rounding), O24 (keystone re-import doubles hours).** These together explain "janky / don't trust." None are deep design rot; all are cutover/consolidation work.

## Reapproach-if
- Chunk 18 (migrations): is there a constraint forcing `project_id` XOR `service_area_job_id` on time_entries? (informs the O23 unification migration). Also check the timeclock bootstrap DDL vs migrations (schema-layer overlap).
- Chunk 17 (automation.js): dedup the two `dateInBusinessTz` copies; confirm automation's daily schedulers don't touch hours.
- **Surface O22 + O23 + O24 to Carter directly** — they ARE the answer to "why don't I trust the hours," and all three are addressable in the hours/billing cutover.