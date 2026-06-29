# 17 — automation.js (scheduler + legacy projections) + portal_module.js (rollup engine) — ✅ COMPLETE

> Mapped 2026-06-29. Two backbone modules: (A) `automation.js` (1951) = the in-process scheduler + a stack of LEGACY projection/billing-preview engines; (B) `portal_module.js` (1195) = `ensureRollupChain`/`isDuplicateProject` (the heart of the legacy projects tree) + per-portal extensions.

## A) automation.js — the scheduler (what runs on a timer)
**`startScheduler(pool)`** = a single `setInterval` ticking **hourly** (`SCHEDULER_TICK_MS`), `.unref()` (never holds the process open), fires once at boot (`setImmediate`). Each task tracks its own last-run timestamp. **5 tasks:**
| Task | Cadence | Action | Mutates? |
|---|---|---|---|
| **Daily digest** | daily (+boot) | `buildDigest` → **console.log** yesterday's hours/entries/projects/billed/permits/flagged-sessions | no (LOG only — "future cron/email" noted; no email yet) |
| **Stale permits** | every 4h (+boot) | `findStalePermits` (submitted >N days) → log top 5 | no |
| **Budget burn** | every 4h (+boot) | `findBudgetBurn` (codes over threshold) → log | no |
| **Audit prune** | daily (skips boot) | `runAuditCleanup`: DELETE `time_entry_audit` meaningful=FALSE >14d (`AUDIT_RETENTION_DAYS_LOW`) + ALL >18 months, then `VACUUM` (non-FULL) | **YES (DELETE)** |
| **File prune** | daily (skips boot, if uploadDir) | `adminModule.pruneOrphanFiles`: delete orphan files (on disk, not in DB) >7 days old | **YES (delete files)** |
- The two mutating tasks are **disk hygiene**, well-guarded (skip boot to keep redeploys light; conservative thresholds; file-prune's 7d > the 60s undo TTL). Both born from real prod incidents (audit table ate ~1GB; orphan files accumulated).
- **⚠ Multi-instance gotcha:** in-process `setInterval` (no Redis/queue) → if ever scaled to >1 instance, every instance ticks → digest logged N×, prune races. Fine single-instance (same caveat as `_csv_stage` chunk 09). Note for scaling.
- **⚠ O31 (low): two audit systems, DIFFERENT retention.** `time_entry_audit` (timeclock hours audit, chunk 09) is **hard-DELETED at 18mo / 14d** by this job; but the general `audit_log` (`_audit.js`, chunk 14) is **append-only, never deleted, 3yr+ archival** (DELETE-prevention trigger). So the **hours** audit trail is LESS durable than the general one — for RUS/government (RUS retention ~3yr) 18 months may be short. Reconcile retention if hours audit needs to match RUS. → open_items O31 (low).
- **`dateInBusinessTz` DUP confirmed:** defined here (exported, used by inspection.js) AND re-implemented in `timeclock_module.js` (chunk 09). Two copies → dedup target (minor).

## A2) automation.js — LEGACY projection/billing engines (O18 += projections)
Big builders (projects-based): `buildPscRusProjection` (215-718 — huge), `buildInspectionRevenueProjection` (721, = memory `feature_inspection_revenue_projection`), `buildBillNowPreview` (1009), `buildMonthlyBillingDraft` (1113), `buildProjectProjection` (1215). Feature-rich: **sparkline forecasting** (`buildSparkline` — avg weekly hrs × rate over a horizon vs budget remaining), **weighted rates**, monthly billing drafts, per-job buckets.
- **⭐ O18 += projections:** these are the LEGACY (projects-tree) projection engines, **parallel to the keystone `projections.js`** (chunk 07c). The legacy ones are RICHER (sparklines, monthly billing draft, weighted-rate forecasting) than the keystone projections.js I mapped. So like the hours importer (O24), the projection cutover has a **parity gap** — porting to keystone must carry over sparkline/forecast/monthly-draft, not just the expected−billed math. Ties O18 + I1 (scheduling/monthly-projection: the forecasting Carter wants partly EXISTS here, legacy). → reapproach 07c.
- `installAutomationRoutes` (1380) mounts the admin-facing endpoints for these (the projection/digest/bill-now tiles).

## B) portal_module.js — ensureRollupChain (the legacy-tree heart) + portal extensions
**`ensureRollupChain(pool, {client_id, concentrator_id, service_area_label, job_id, engineering_contract_id, contract_id, job_team})`** builds/【finds】the legacy rollup folder chain via `findOrCreateRollup` at each level, returning the deepest folder id (the leaf nests under it). **The chain + `rollup_level` enum:**
1. `client` (rollup_key = client_id)
2. `engineering_contract` (rollup_key = engineering_contract_id) — when EC provided
3. `contract` (construction contract; rollup_key = contract_id) — between EC and SA, when contract_id provided
4. `service_area` (rollup_key = `concentrator_id` UUID, OR a free-text `service_area_label` key)
5. `category` (rollup_key = `sa_key + '|' + job_team`) — per-team folder below SA
- **`findOrCreateRollup`**: SELECT existing (`is_rollup=TRUE AND rollup_level AND rollup_key AND parent_id`) else INSERT; race-safe (re-select on conflict); prefixes name `[level] name` on collision.
- **`isDuplicateProject(name, parentId, excludeId)`**: same-name-under-same-parent guard.
- **`installPortalExtensions(app, pool, PORTAL_MODE, authHelpers)`**: sets `app.locals.ensureRollupChain` + `app.locals.isDuplicateProject` (the wrappers projects.js [chunk06] + resolve-or-create + hours_csv [chunk09] call), `stripMoneyFromProject` (customer $-redaction), + more project-INSERT paths (lines 380/995 = per-portal project creation for the single-tenant `PORTAL_MODE` instances, chunk 01). 
- This module is the ENGINE behind the legacy `projects` tree (chunk 06) — confirms the exact rollup structure. Retires WITH the projects tree at cutover.

## Findings
- **Scheduler = 5 hourly tasks** (3 log-only, 2 guarded disk-hygiene DELETEs). No email/alerting yet (digest just logs) → I1/cockpit could turn these into real alerts (the detectors `findStalePermits`/`findBudgetBurn` already exist — surface them). Multi-instance would double-run.
- **⭐ O18 += legacy projections** (automation.js) parallel to keystone projections.js, with a **parity gap** (sparklines/monthly-draft/weighted-rate only in legacy). Cutover must port them. Ties I1 (the forecasting partly exists).
- **O31 (low): hours audit (`time_entry_audit`) hard-deleted at 18mo/14d** vs general audit_log append-only 3yr+ — reconcile for RUS retention.
- `dateInBusinessTz` duplicated (automation + timeclock) — minor dedup.
- **ensureRollupChain fully mapped** — the legacy tree's exact build rules (5 rollup_levels). The keystone (service_areas) replaces this; it retires together.
- **The alert detectors exist** (`findStalePermits`, `findBudgetBurn`, `findPermitsAwaitingInvoice`) but only log — wiring them to the cockpit/early-warning (memory `project_product_plan` director cockpit) is "surface existing detectors," not build. → ties I1.

## Reapproach-if
- Chunk 07c reapproach: projections exist in BOTH automation.js (legacy, rich) + projections.js (keystone) — the cutover parity gap (sparklines/forecast/monthly-draft). The director-cockpit/early-warning (product plan System E) can reuse findStalePermits/findBudgetBurn + the projection builders.
- Chunk 06 reapproach: ensureRollupChain rules now fully documented (5 rollup_levels) — completes the legacy-tree picture.
- Chunk 28/O28: file-prune (orphan files >7d) is the disk-hygiene side; the real risk is still the UPLOAD_DIR volume mount (O28).
- Chunk 18 (migrations next): verify rollup_level enum values + projects.is_rollup/rollup_key columns + time_entry_audit vs audit_log retention mechanics.