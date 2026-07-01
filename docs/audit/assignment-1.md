# Assignment 1 — whole-platform baseline audit (implementation vs documented intent)

> Auditor working report. Detail lives here (per D018); the Planning↔Auditor thread carries only short severity-ranked summaries + a pointer to this file.
> Method: code-vs-intent verification (targeted reads/greps against source + `schema.sql`). Live user-facing pass (Chunk 4) is blocked in this env — see bottom. Last updated 2026-07-01.

## Headline
Across Chunks 1–3, the build **matches Planning's documented picture** (`codebase/00-SYNTHESIS` + `open_items`). **No "claimed-done-but-isn't"** in anything checked. Divergences found are minor and listed below.

---

## CHUNK 1 — shipped WP wave + HIGH blockers

### CLOSED/DONE items — all REAL, match spec
| Item | Verdict | Evidence |
|---|---|---|
| O34(a) requireStaff data-leak fix | ✅ real | `auth.js:120-121` `STAFF_ROLES = VALID_ROLES − {trainee,customer}` (data-derived, D013-clean); exported `auth.js:857`; applied across the 9 named route files, 27 call-sites. No regression — portal cascade pickers stay reachable to staff roles incl. contractor; only trainee+customer excluded. |
| O35 audit-log 500 | ✅ real | `routes/audit_view.js:35` `SELECT id, at AS created_at … ORDER BY at DESC` — alias preserves the frontend contract. |
| O36 training-visibility rebuild | ✅ real | `routes/training.js:826 loadUserVisibility` → admin `{all:true}` else `resolveVisibleLessons(default,published,overrides)` = `(default ∪ SHOW − HIDE) ∩ published`; `/my-content` returns **503 on error, never `all:true`** (l848-853); `osp-training/src/hooks/useMyContent.js` does NOT fail open (skeleton until ready). Migration `0080` singleton pins `__published__`/`__default__`, adopts legacy `Published` preset (T01 curation preserved). |
| O37(p1) real-time visibility | ✅ real | `routes/_sse.js` `training` (all-authed) + `user:<id>` channels; SPA subscribes via EventSource. Phase 2/3 correctly still OPEN. |
| O38 UI redesign / sun-moon purge | ✅ real | `public/js/app_nav.js:142` mounts `AppShell.mountTopbar`; hamburger+push-reflow; CSS purge `#themeToggle,#dm-toggle,.theme-toggle{display:none!important}` (l80). No stray toggle survives in `public/*.html`/`*.js`. |
| O39 free usernames on inactive | ✅ real | `auth.js:139 tombstoneUsername()` → `<name>__inactive_<hex>` on deactivate/soft-delete (l783,l836), VARCHAR(60)-clamped, idempotent regex guard; migration `0081` backfills, idempotent. |

### HIGH blockers — independently re-confirmed still live (correctly OPEN)
- **O20** RUS PDF legacy-only: `invoice_generator.js` has **0** `service_area_job_id` refs, **22** legacy `project_id`/`concentrator` refs → keystone-billed invoice has no submittable PDF.
- **O23** hours split-brain: `time_entries` carries both `project_id` + `service_area_job_id` (both indexed); **no XOR CHECK** on the table (the `budget_scope_exactly_one` CHECK is on `budgets`, not `time_entries`).
- **O24** keystone importer no dedup/billed-guard: `routes/hours_import.js` has zero dedup/match-key/billed-period/ON-CONFLICT → re-upload doubles hours.
- **O30** no config UI in cluster: `public/settings.html` (222 lines) has no pricing/jobs/templates/staff controls → admin.html remains the only config surface.

### NEW divergence (low) → parked by Planning as O41
`routes/_sse.js:12,139,151-152` handle `construction_manager`/`construction_engineer`/`team:construction`, but `auth.js:100 VALID_ROLES` has no construction roles → dead branches today.

---

## CHUNK 2 — billing-path sprawl (O15/O16/O18/O19)

- **O19** double-registered `GET /api/billing/report` — CONFIRMED, LOW. `billing.js:622` + `billing_keystone.js:163`; `server.js` mounts keystone (l761) before legacy (l921) → keystone served, legacy dead. Cleanup-only.
- **O18** invoice-creation paths — CONFIRMED with corrections. Documented as 5; actually **6**:
  1. `POST /api/billing/bill-multiple` — `billing.js:34`
  2. `POST /api/projects/:id/generate-monthly-invoice` — **`projects.js:1411`** (O18 implied `billing.js`)
  3. `POST /api/projects/:id/bill-and-clone` — `project_billing.js:129`
  4. `POST /api/service-areas/:id/bill` — `service_areas.js:904` (orphan path)
  5. `POST /api/billing/run` — `billing_keystone.js:112` (keystone, canonical)
  6. `POST /api/billing/batches` `billing.js:343` + `/batches/:id/confirm` `billing.js:481` — **batch flow not in O18's list**; recommend the reconciliation map enumerate it.
- **O16** orphan invoices — CONFIRMED and slightly WORSE. `service_areas.js :id/bill`: invoice header INSERT sets only `(client_id, invoice_number, invoice_date, total_amount, status, notes)` → no `service_area_id`/`engineering_contract_id`; `invoice_items` INSERT sets `project_id = NULL` and omits `service_area_job_id`. Both header AND items unlinked → invisible to keystone-column-join reporting. (`invoice_items` does carry both link cols — `project_id` `schema.sql:587`, `service_area_job_id` :596 — this path just populates neither.) Fix = retire/delegate to `billing_keystone /run`.
- **O15** canonical = billing_keystone — CONSISTENT. `/run` + `/periods/:month/close` are the coherent engine; the four legacy creators are the retire-set.

---

## CHUNK 3 — portal/identity sprawl (O25) — CONFIRMED exactly

Three portal API modules: `customer_portal.js`, `client_portal.js`, `client_portal_v2.js` (+ `portal_access.js` = admin link mgmt). Two identity models: `customer_portal.js` scopes on the `customer` role via `customer_clients`; `client_portal_v2.js` uses separate token identity (`client_tokens`→`client_users`→`client_organizations`, l99-101). Only `customer_portal.js` references keystone `/service-areas`. Matches O25's consolidation recommendation verbatim; no new divergence.

---

## CHUNK 4 — live user-facing pass — BLOCKED in this env
Carter injected a live Railway `DATABASE_URL`, but this environment's network policy allows only HTTPS via the agent proxy — raw Postgres TCP to the Railway host:44516 **times out** (verified with `psql`; app boot would hit the same wall). `node_modules` also absent (no `pg`). It's the shared/prod DB (O40) → any access must be strictly read-only. Unblock via: (a) allow outbound DB TCP in this env's policy, or (b) run the live pass in Planning's proven preview env (recommended), or (c) accept code+schema auditing as the ceiling here. Prod credential is now in the session transcript → rotate after use.
