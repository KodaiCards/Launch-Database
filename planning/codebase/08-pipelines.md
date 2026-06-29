# 08 — Pipelines (permitting / design / inspection / potential-permits) — ✅ COMPLETE

> Mapped 2026-06-29. The per-team stage workflows + the RUS rollup view. **Headline: the pipelines are ALL legacy (projects + permit_stages/design_stages on project_id); the keystone pipeline is the separate `/api/service-area-jobs` advance/regress (chunk 05) → another O18 parallel.** Also: a likely GAP — the RUS *daily field paperwork* (the time-sensitive RUS-exclusive deliverable per `project_business_reality`) is NOT in this area; inspection.js is only a read rollup.

## The two pipeline systems (O18 facet)
| | Legacy | Keystone |
|---|---|---|
| Permitting | `permits.js` → `/api/permits`, `permit_stages` table on `project_id`, `projects.project_type='permitting'` | `pipeline.html`/`job-board.html` → `/api/service-area-jobs` advance/regress on `service_area_jobs.status` (chunk 05) |
| Design | `design_pipeline.js` → `/api/design`, `design_stages` table on `project_id` | same keystone `service_area_jobs` (team='design') |
| Construction | none (no module) | `service_area_jobs` (team='construction') — status only, no stage ladder |
Both run today. The legacy pipelines drive the legacy admin permitting/design portals; the keystone job-board drives the operations cluster. Cutover must retire the legacy stage tables in favor of `service_area_jobs.status`.

## `permits.js` (241) — legacy permitting pipeline
- `GET /api/permits` (admin + permitting roles): all `project_type='permitting'` projects + their `permit_stages` (json_agg) + `permit_documents`. Current stage = the one `permit_stages` row with `completed_at IS NULL` (LATERAL).
- **Stages (HARD-CODED array `PERMIT_STAGES`):** `potential → started → submitted → approved → checklist` (5).
- `PUT /:projectId/advance` — **transaction-safe** (BEGIN + `FOR UPDATE` on current stage row → completes it, inserts next; ON CONFLICT DO NOTHING). Prevents concurrent duplicate-stage races (Wave 154 P-3). Validates `project_type='permitting'` (opaque 404). `regress` mirrors it (delete current, re-open prev). Actor forced from `req.user` (never body). SSE to admin + `team:permitting`.
- `POST /:projectId/documents` — multer upload → `permit_documents` (doc_type, file, revision_number, uploaded_by from session). Orphan-file cleanup on 404.

## `design_pipeline.js` (237) — legacy design pipeline
- `GET /api/design` (admin + design roles): `project_type='design'` + current `design_stages` stage.
- **Stages (HARD-CODED `DESIGN_STAGES`):** `potential → started → review_process → completed` (4). Different ladder than permitting (per-team stages).
- `advance` (transaction-safe, same pattern) — on reaching `completed`, also sets `projects.status='completed'`+`completed_date`. `regress` un-completes. 
- `PUT /api/projects/:id/ongoing` — toggles `is_ongoing` (monthly-recurring flag); restricted to design+permitting project types (other types have no monthly-invoice workflow). Audit-logged.

## `potential_permits.js` (110) — the design→permitting intake handoff
`potential_permits` table = "design team spotted a place that probably needs a permit; permitting team review it." Design submits (`sr_hwy, county, route, notes`); permitting reviews → on approve, `project_id` is set (becomes a real permitting project). Statuses: `pending/approved/rejected/withdrawn`. SSE notifies `team:permitting` on submit (no polling). Actor always from session (anti-spoof). Legacy (project_id-linked). A clean little cross-team workflow.

## `inspection.js` (367) — the RUS-program ROLLUP VIEW (read-only) — NOT daily paperwork
`GET /api/inspection` (admin + managers): every active **leaf** project whose program (or its EC's program) = `'rus'`, with hours + revenue rolled up for a period (ytd|month). Covers the whole RUS umbrella (Inspection, RE, Permitting, …) — scopes by `engineering_contracts.program='rus'` NOT `clients.is_rus` (PSC has both RUS + BAU; surgical). Non-RUS ECs excluded.
- **Sophisticated ancestor-aware hours attribution** (4-tier priority CTE, `DISTINCT ON (entry_id)` anti-double-count): direct-on-leaf → exact `job_title` match → **sole-leaf fallback** (rollup has exactly one job-bearing leaf → attribute all its entries) → substring near-miss. Born from the real problem: CSV imports attach hours to a **WO rollup** (leaf had no WO#), so hours must be walked back down to the right leaf. This is hard-won legacy logic — relevant to any hours/billing rework (don't lose these rules).
- Display name "Area (WO#) - Job" (owner-flagged). `stale` flag = is_ongoing but 0 hours in period.
- Rate: `billing_rate || job_rate || 90` (consults job_rate first; **90 is a final hardcoded fallback** — I4-adjacent, milder than the CASE copies).
- Timezone-correct (`dateInBusinessTz` from automation.js — Chicago tz, so 6-11PM entries don't fall outside YTD).

## Findings
- **O18 += pipelines:** legacy `permit_stages`/`design_stages` (project_id) ⟂ keystone `service_area_jobs.status`. Add to the parallel-tables cutover map. The legacy stage ladders are HARD-CODED arrays in the route files.
- **⭐ O21 (GAP/question — important + time-sensitive): where is the RUS DAILY FIELD PAPERWORK?** `project_business_reality` says the daily paperwork is THE RUS-exclusive deliverable and a core pain. inspection.js is only a *reporting rollup* (hours/revenue) — it does NOT generate daily inspection reports/field forms. So either (a) the daily-paperwork tool isn't built, (b) it's in the desktop/offline app (chunk 19), or (c) it's done outside the platform. Needs Carter input — if it's a gap, it's a high-value RUS feature. → open_items O21.
- **D013 note (minor): pipeline stages are config-as-code** — `PERMIT_STAGES`/`DESIGN_STAGES` hard-coded arrays. A fully-configurable platform would make per-team stage ladders data-driven (a `pipeline_stages` table per team/program). Low priority vs I4, but same ethos; note for the keystone pipeline design (service_area_jobs.status could carry a configurable stage set).
- **Positive:** advance/regress are transaction-safe (FOR UPDATE) + audited + SSE-pushed + actor-from-session + opaque-404 type gates. The legacy pipeline code is actually hardened (many Wave-154/159 security fixes). Good model for the keystone equivalent.

## Reapproach-if
- Chunk 09 (hours): inspection.js's ancestor-attribution + `job_title` matching ties directly to the CSV hours import (`_csv_stage.js` seen in routes/ — map there). The "hours land on WO rollup" problem is a hours-import artifact.
- Chunk 03 reapproach: is there a KEYSTONE inspection/RUS-rollup view, or is inspection.js the only one? (product plan says "RUS-only inspection" is keystone — may be unbuilt). 
- Chunk 19 (desktop): check if the RUS daily field paperwork (O21) lives in the Electron/offline app.
- Cutover: retire permit_stages/design_stages → service_area_jobs.status; preserve the inspection hours-attribution rules.
