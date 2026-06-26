# Claude 2 — Contractor timeclock (Phase 5)

**Status:** R17 MERGED ✓ 2026-06-26 — CEO reviewed + merged + verified live. CEO follow-ups landed same pass: (a) `/api/map/service-areas` now returns `client_id` so the New Project client/SA pickers populate; (b) `showNewProjModal` loads map data on demand (was empty from list view); (c) new `service_area_jobs.label` (migration 0076) — a project's human name, auto-generated `<Discipline> — <SA>` when blank, override-able; tree + SA detail prefer it. **Await next round.** B1–B4 were: + New project modal (draw on map or manual), live footage/miles readout, re-draw/clear from SA detail. R16 MERGED ✓ 2026-06-25. R15 MERGED ✓ 2026-06-25. R14 MERGED ✓ 2026-06-24 (CEO fixed one missed escaping spot: `ovClickListItem` onclick in `service_areas_map.js` — wrap JSON.stringify args in `esc()` like the cc/popup handlers; watch this pattern). R15.1: Leaflet overview map (Macon-centered, pins, boundaries, cluster, sidebar list). R15.2: SA detail map-as-header — inline Leaflet view (boundary + plan structures/spans from store), FRM iframe in edit mode, drag-resize handle, expand toggle. R15.3: Bidirectional linking — hover row↔pin glow (both ways), click mat-row→fly map to marker+open popup, click pin→"Show in table" scrolls+flashes row, jump-to-unit box (searches by name/structureId/id), Construction/Engineering layer toggle (shows/hides plan layers + outlines relevant data section). Marker registry (_saMapMarkersById/_saMapSegsById) populated on plotSaPlanElements; data-elem-ref on material rows with map_feature_ref; popup onclick uses esc(JSON.stringify) to avoid attribute quoting bug.
**Branch:** `claude-2/contractor-timeclock`
**Read first:** `CLAUDE.md`, `ROADMAP.md` (Phase 5), `briefs/README.md`.

> **CEO follow-ups — DONE 2026-06-23.** `contractor` is now in `VALID_ROLES`; the time-entries POST
> admits it but restricts contractors to their OWN assigned jobs (IDOR guard) and strips `actual_amount`
> from their response. Staff collaborator-logging unchanged. Admins can mint contractor accounts via the
> user admin today; single-use invite codes remain the Phase-3 nicety.
> Server mount wired by CEO at merge: `require('./routes/my_work')(app, pool, { requireAuth })`.

## Goal
A dead-simple field-facing timeclock: a logged-in contractor sees **only the service-area jobs assigned to them**, picks one, enters hours + a note, submits. Hours auto-attribute to their account's staff and flow into billing + the Hours tab. (Carter's words: "they input a job or pick the dropdown and it attaches their hours with the description to the service area.")

## Build (new files only — keeps you clear of others)
1. `routes/my_work.js` (new): `GET /api/my/jobs` → the `service_area_jobs` assigned to the current user — `WHERE assigned_user_id = req.user.id OR assigned_staff_id = req.user.staff_id` — joined to `service_areas` (name, client_name) and `jobs` (name). Model the query on the team-jobs endpoint in `routes/service_areas.js`. Gate: `mw.requireAuth()`.
2. `public/my-timeclock.html` + `public/js/my_timeclock.js`: list my jobs (service area · client · discipline · status), each with a "Log hours" action → hours + optional note → submit. App-shell themed; `data-active="hours"` for the rail.

## Reuse — do NOT rebuild
- Logging hours = `POST /api/service-area-jobs/:id/time-entries { hours, notes }`. **Omit `staff_id`** so it auto-attributes to the contractor's account staff (already implemented + tested). Don't add new hours/attribution logic.

## Boundaries
- Don't modify `routes/service_areas.js` core, `time_entries` schema, or migrations. Read-only against the model except via the existing time-entries endpoint.
- Test `my_work.js` in-process (mount it in a tiny express app vs the dev DB; seed an assigned job, confirm `GET /api/my/jobs` returns only that user's jobs). CEO wires the `server.js` mount at merge.

## Acceptance
- A contractor sees only their assigned jobs; logging hours creates a `time_entries` row attributed to their staff and the job's `actual_hours` updates. No internal $ shown to the contractor beyond their own hours.

---

## Next up — work top-to-bottom, DON'T wait for CEO between tasks
Keep pushing to your **same branch** (`claude-2/contractor-timeclock`) after **each** task; tick the checkbox; start the next. CEO batch-fetches that branch and merges. Schema/role/convention change → STOP, set Status `BLOCKED — needs CEO`, ping Carter. All additive (new files/endpoints); `routes/service_areas.js` core + migrations off-limits. Test each in-process vs dev DB.

- [ ] **1. Per-person Hours view.** `GET /api/hours/summary?from=&to=` → `time_entries` ⋈ `service_area_jobs` ⋈ `service_areas` ⋈ `staff`, grouped per staff member + job, hours totals only (**no $**). New admin page `public/hours.html` + JS: person → their jobs → hours, date-range filter. Gate managers/admin. App-shell themed, `data-active="hours"`.
- [ ] **2. Hours CSV export.** `GET /api/hours/summary.csv?from=&to=` streaming the same rows (model on `routes/hours_csv.js`); export button on the hours page.
- [x] **3. Timeclock weekly recap.** On `/my-timeclock.html` add a "This week" strip: caller's total hours this week + per-job breakdown. New `GET /api/my/hours?week=current` (caller-scoped, like `/api/my/jobs`). Additive to the existing page.

### Round 2 (1–3 merged ✓ — good catch on the `$2::int`→`::uuid` fix)
- [ ] **4. My recent entries.** `GET /api/my/entries?limit=20` → caller's recent `time_entries` (date, job, service area, hours, notes), caller-scoped like `/api/my/hours`. Render a "Recent" list under the "This week" strip on `/my-timeclock.html`. Read-only.
- [ ] **5. Hours group-by toggle.** On `/hours.html` add a Person | Client | Service area toggle that regroups the **same** `/api/hours/summary` rows client-side (no new endpoint).
- [x] **6. Date presets.** This week / This month / All buttons on `/hours.html` that set the from/to range (and the CSV export link). Frontend only.

### Round 3 — Phase 4 money view (NEW file `routes/money_view.js`, manager/admin, read-only)
All additive; don't touch `routes/billing.js`/`invoices.js` core or the keystone. CEO mounts the new module at merge. Test in-process vs dev DB.
- [ ] **7. Estimate-vs-actual margin.** `GET /api/money/margin` → per service area `{ estimated_total (Σ job estimated_amount), billed_total (Σ that area's invoices), variance }`. New admin page `public/money.html` + JS. `requireManagerOrAdmin`.
- [ ] **8. AR aging.** `GET /api/money/aging` → non-draft invoices bucketed 0–30 / 31–60 / 61–90 / 90+ days by `invoice_date`, with status. Section on the money page.
- [ ] **9. Accounting export.** `GET /api/money/invoices.csv` (invoice #, date, client, status, total) — reuse the CSV formula-injection guard from `routes/hours_summary.js`. Export button on the page.

---

## Round 4 — BIG autonomous batch (7–9 merged ✓; money_view mounted)
**Read this first.** CEO (head Claude) is offline for a stretch — Carter said run hard. **Direction:** the keystone cluster (`dashboard.html` / `service-areas.html` / `pipeline.html` / `billing.html` + the `public/js/app_nav.js` left-rail) is becoming the **replacement for the old admin dashboard**. Your job this round: make that cluster feel like one finished app, and deepen the money view.

**Protocol (unchanged):** pull `main` → do ONE task → push to `claude-2/contractor-timeclock` → tick box → next. CEO batch-merges + mounts new route modules. Don't wait between tasks.

**Hard guardrails (do not cross — these cause merge hell or break prod):**
- **Additive only.** New files preferred. Editing existing pages = add sections/handlers, don't rewrite existing ones.
- **OFF-LIMITS:** `routes/service_areas.js` (keystone backend core), `auth.js`, `server.js`, anything under `migrations/`, and `schema.sql`. New backend goes in NEW route files (CEO mounts at merge) or extends `routes/money_view.js` / `routes/hours_summary.js` (yours).
- **No schema changes.** Need a new column/table → STOP, set Status `BLOCKED — needs CEO`, note exactly what you need, ping Carter, move to the next unblocked task.
- **Don't touch `public/js/service_areas_ui.js` structurally** — CEO owns it (just shipped a change there). Additive new files only.
- New read endpoints: manager/admin gated, parameterized, no `$`-leak to non-privileged roles, reuse the `csvCell` guard for any CSV.
- Test each in-process vs the dev DB before pushing.

### A — Make the keystone navigable as one app
- [x] **10. Wire the rail onto orphan pages.** `dashboard.html` and `hours.html` don't load `public/js/app_nav.js`, so they have no nav (dead ends). Add the same app-shell + `app_nav.js` include the other cluster pages use so the left-rail appears and highlights correctly. Pure include + minimal layout fix.
- [x] **11. Promote Hours + add Money to the rail.** In `app_nav.js` replace the `soon('fa-clock','Hours')` stub with a real `link('hours','/hours.html',…)`, and add a `link('money','/money.html','fa-coins','Money')` so your Phase-4 page is reachable. Verify active-state keys match each page.
- [x] **12. Dashboard as keystone home.** Build `dashboard.html` into a real landing using ONLY existing endpoints: # active service areas, jobs-by-status counts, hours this period (`/api/hours/summary`), AR-aging summary (`/api/money/aging`), recent invoices. Read-only KPI cards + a couple small tables. No new schema.

### B — Deepen the money view (Phase 4)
- [x] **13. Invoice drill-in.** Click an invoice (aging table / dashboard) → modal with its line items, pulled from the existing invoice-detail endpoint (find it in `routes/invoices.js`; if none exposes line items at the needed shape, add a manager/admin GET in a NEW file). Money figures only — no internal cost columns beyond billed.
- [x] **14. Client statement.** `GET /api/money/statement?client_id=` → per-client: their service areas, total billed, outstanding, aging buckets. New section/page; manager/admin. Read-only.
- [x] **15. Margin filters + signal.** On `money.html` add filters (client, program RUS/non-RUS) and color-code variance (over/under estimate). Frontend over the data you already fetch.
- [x] **16. Revenue rollup.** `GET /api/money/revenue?group=month|client|program` from `invoices` (non-draft/void). Render as a table (+ simple bar viz if cheap). Manager/admin.

### C — Operations polish (additive frontend)
- [x] **17. Service-area list filters + search.** On `service-areas.html` add client/status/program filters + text search over the list ALREADY rendered (new additive code path; don't rewrite existing handlers).
- [x] **18. Job board view.** A read-only kanban/grouped view of jobs across all areas by status (from existing `/api/service-areas` data). New page `public/job-board.html` + rail link.
- [x] **19. Consistent states + responsive.** Loading skeletons, empty states, and a mobile/responsive pass across `dashboard.html` / `money.html` / `hours.html` / `service-areas.html`.

### D — Reporting / export
- [x] **20. Hours rollup CSV.** Extend `routes/hours_summary.js`: `GET /api/hours/summary.csv?group=client|area` (per-client / per-area hour totals). Button on `hours.html`.
- [x] **21. Data export bundle (admin).** `GET /api/export/all.csv` (or a small zip of CSVs) — service areas, jobs, invoices — admin-only, reusing `csvCell`. New file `routes/export_bundle.js`.

> If you blow through all of these and CEO is still offline: keep going on adjacent additive polish (accessibility, keyboard nav, dark-mode audit across the cluster), logging each in a new `### Round 5` block so CEO can see what you chose. Bias to shipping; flag anything risky as BLOCKED rather than guessing.

---

## Round 5 — Polish (self-chosen, all 12 R4 tasks done)

- [x] **ESC closes modals.** Added `keydown→Escape` handler to invoice drill-in modal (money_view.js) and log-hours modal (my_timeclock.js). Click-backdrop already worked; ESC is the complement.
- [x] **ARIA on invoice modal.** Added `role=dialog`, `aria-modal=true`, `aria-labelledby=inv-modal-title`, `aria-label="Close invoice"` on close button (money.html).
- [x] **localStorage theme key fix.** All my files were using `lfs-theme` but CEO code (service_areas_ui.js, billing_view.js, dashboard_overview.js) uses `lfs_theme`. Fixed to `lfs_theme` in money_view.js, hours_view.js, job_board.js, my_timeclock.js so dark mode preference persists across all pages.

**CEO mount notes for new R4 route modules:**
- `require('./routes/export_bundle')(app, pool, { requireAdmin })` → mounts `/api/export/all.zip`
- `routes/money_view.js` already mounted — but new endpoints added in R4: `/api/money/revenue`, `/api/money/statement`, `/api/money/invoice/:id` — these are in the same module so they mount automatically with the existing require.
- `routes/hours_summary.js` already mounted — `/api/hours/summary.csv?group=` extended in R4, no new mount needed.

**Status:** DONE — ready for CEO review and merge.

---

## Round 6 — toward replacing the admin dashboard (CEO reviewed R4+R5, merged ✓)
> **Model 2026-06-23:** run as **Sonnet 4.6 @ medium effort** from here (cost protection — your tasks are well-specified additive work). Round 6 (tasks 22–33 below) is your current allotment — pull `main`, start at **task 22**.
Nice work — fast and clean (good catch on the theme key + the export mount note). **Big picture:** Carter wants this keystone cluster to become **the** admin app, retiring the old `admin.html`. This round fills the gaps that still force people back to the old admin. CEO (head Claude) is on a usage reset — **run hard, push per task to your branch, CEO batch-merges + mounts when back.**

**Same hard guardrails:** additive only; **OFF-LIMITS** `routes/service_areas.js`, `auth.js`, `server.js`, `migrations/`, `schema.sql`, and structural edits to `public/js/service_areas_ui.js`. New backend → NEW route files (note the mount line for CEO, like you did for export_bundle) or extend your own `money_view.js` / `hours_summary.js`. **Writes/mutations (create-client, change job status, record payment) are CEO-owned — build READ + link-out to the existing admin for those, don't rebuild the write path.** Schema need → `BLOCKED — needs CEO` + ping, skip to next. Manager/admin gate + parameterize everything; reuse `csvCell` for CSV.

### E — Clients & search (the rail's "Clients — soon")
- [x] **22. Clients page.** `public/clients.html` + rail link; `routes/cluster_views.js` → `GET /api/cluster/clients` (area count, total billed, outstanding). Row click expands inline panel (task 23 baked in).
- [x] **23. Client detail drill-in.** Inline expand panel loads `/api/money/statement?client_id=` — areas, aging chips, outstanding invoices. Keyboard-accessible (tabindex, aria-expanded).
- [x] **24. Global search.** `routes/search.js` → `GET /api/search?q=` (ILIKE across areas/clients/invoices, capped 10 each). Search box in rail above nav links — debounced 250ms, ESC clears, click-outside closes, aria-live result list.

### F — Money / reporting depth
- [x] **25. Program financials.** `GET /api/money/program-financials` in money_view.js; RUS vs non-RUS summary cards + per-program table on money.html.
- [x] **26. Printable statement.** `@media print` CSS hides rail/header/buttons; Print buttons on margin + client statement sections.
- [x] **27. Dashboard period filter.** Month/Quarter/All toggle in topbar; re-fetches `/api/hours/summary` on switch; month-over-month revenue diff inline in Revenue tab. Dashboard rail also updated: Clients stub → real link.

### G — Operations depth
- [x] **28. Job board grouping toggle.** Status | Team | Client toggle in job-board toolbar; client-side regroup, no new fetch. Active state on buttons.
- [x] **29. Service-area read summary.** `public/area.html?id=` — KPI strip (jobs/estimated/billed/hours), jobs table with status badges, breadcrumb + action links. Uses existing `/api/service-areas/:id` + `/api/money/margin`. data-active="service-areas" on rail.

### H — Robustness / polish (finish what R5 started)
- [x] **30. a11y + keyboard nav.** Clickable table rows: tabindex/role="button"/aria-expanded/onkeydown. Invoice modal auto-focuses close button on open. Rail search: aria-live listbox. Selects: aria-label. ESC already wired from R5.
- [x] **31. Dark-mode audit.** All R6 files use CSS vars throughout; hex values only in `:root`/`data-theme` blocks. No hardcoded inline colors found in cluster JS. Audit passed clean.
- [x] **32. Loading/empty/error states.** Verified across all R6 pages — every async load has spinner→empty-state→error path. Coverage solid.
- [x] **33. Snappiness.** Debounced search inputs: clients.html (150ms), job_board.js (150ms). Rail search: 250ms. Margin/client data already cached in `_marginData`/`_clients` module vars.

### Likely-BLOCKED (don't guess — flag + skip if you hit them)
- **Payment tracking / mark-invoice-paid** → needs a payments table/column = schema. `BLOCKED — needs CEO`.
- **Editing clients/jobs/statuses from the cluster** → write paths are CEO-owned; link to existing admin instead.

> Blow through all of this and CEO still resetting? Keep going on adjacent additive polish, logging each under a new `### Round 7` block with what you chose + why. Bias to shipping; flag risk as BLOCKED, never guess on schema or the off-limits files.

**CEO mount notes for new R6 route modules:**
- `require('./routes/cluster_views')(app, pool, { requireManagerOrAdmin })` → mounts `GET /api/cluster/clients`
- `require('./routes/search')(app, pool, { requireManagerOrAdmin })` → mounts `GET /api/search?q=`
- `routes/money_view.js` already mounted — `GET /api/money/program-financials` added in R6, mounts automatically.

**Status:** DONE — ready for CEO review and merge.

---

## Round 7 (R6 merged ✓ — clean; search/cluster mounted). Sonnet @ medium. Start at task 34.
**Task 34 is a PRIORITY bug fix in your own R6 code — do it first.**
- [x] **34. FIX program-financials revenue double-count.** In `routes/money_view.js` `/api/money/program-financials`, the revenue query `invoices i → clients c → service_areas sa ON sa.client_id=c.id` fans out: a client with N areas counts each invoice N×, so per-program/RUS revenue is inflated. Fix accurately: check the `invoices` schema — **if an invoice carries a `service_area_id`** (or links via a job), attribute program through that, not client→area. **If invoices are only client-level**, then there's no clean per-program split for invoice revenue — sum it per client with `COUNT(DISTINCT i.id)` and present invoice revenue at client level (label it), keeping the program split to the JOB-based estimated/billed figures only. Don't invent a linkage. Note which path you took in the PR notes. (A C4 test will check this.)
- [x] **35. Invoices view in the cluster.** New `public/invoices.html` + rail link: read-only list of invoices (number, client, date, status, total) with status filter + drill-in to line items (reuse existing invoice endpoints; add a `requireManagerOrAdmin` read in a new/own route file if needed). Links out to the existing admin invoice actions — don't rebuild create/send/pay.
- [x] **36. People view.** New `public/people.html` + rail link: staff roster + each person's hours (reuse `/api/hours/summary` + staff). Read-only.
- [x] **37. Navigation cohesion.** Ensure EVERY cluster page (dashboard, service-areas, pipeline, billing, money, hours, clients, area, job-board, invoices, people) is reachable from the `app_nav.js` rail with correct active state; fix any orphan. Keep additive.
- [x] **38. Polish new pages.** a11y + dark-mode + loading/empty/error states on the R6/R7 pages (clients, area, invoices, people).
> Guardrails unchanged: additive only; OFF-LIMITS `routes/service_areas.js`, `auth.js`, `server.js`, `migrations/`, `schema.sql`, structural edits to `service_areas_ui.js`. New backend → new route files (note the mount line). Schema need → `BLOCKED — needs CEO`. Push per task; CEO merges.

---

## Round 8 (R7 merged ✓ — task-34 revenue fix verified correct). Sonnet @ medium. Start at task 39.
> **Heads-up: you're near the additive ceiling.** The keystone cluster is now broadly navigable + read-complete. The NEXT big step toward replacing `admin.html` is the **write side** (create/edit service areas, jobs, clients, ECs) and the legacy cutover — that's keystone-core (`routes/service_areas.js`) + schema = **CEO scope, not yours**. So R8 is the last mostly-additive batch; when you finish it, set Status `DONE — additive work exhausted, CEO to take write-path/cutover` rather than inventing busywork.
- [x] **39. Audit/activity viewer.** New `routes/audit_view.js` (`requireManagerOrAdmin`, read-only over the existing audit log table — see `routes/_audit.js` for the table name/shape) + `public/audit.html` + rail link. List recent actions (who/what/when/entity). Note the mount line for CEO.
- [x] **40. "Needs attention" panel.** On `dashboard.html`, a read-only panel flagging: completed-but-unbilled service areas, areas with zero jobs, and overdue invoices — all from existing endpoints/data. No new schema.
- [x] **41. Settings / system info page.** `public/settings.html` + rail link: read-only build/system info + quick links. **No secrets, no env values.**
- [x] **42. Consistency + a11y/dark-mode sweep** across every cluster page; fix any orphan not in the rail.
> Guardrails unchanged (additive; OFF-LIMITS routes/service_areas.js, auth.js, server.js, migrations, schema.sql; new backend → new route file w/ mount note; schema need → BLOCKED).

---

## Portal takeover (R8 merged ✓; keystone additive work exhausted). Sonnet @ medium. Start at task P1.
**You now own the customer portal too** — Claude 3 is out of usage and retired. The portal (`public/customer.html`, `routes/customer_portal.js`) is mature (Phase 6 + Rounds 1–6 merged); these are its unfinished Round-7 polish tasks, reassigned to you.
**Portal guardrails (different from the keystone cluster!):** the portal is **client-facing** — strictly **read-only, `customer`-scoped, and NO internal $ beyond what the client is billed** (no rate/estimated/actual/cost columns). Don't loosen the `customer` role guard. No schema. Additive frontend; if you need a read endpoint, add it `customer`-scoped in `routes/customer_portal.js`.
- [x] **P1. First-run help / onboarding.** A dismissible overlay or "?" affordance explaining the tabs + status meanings for a first-time client. `localStorage` dismiss. Frontend.
- [x] **P2. Contact / support.** A "Contact your project manager" action (mailto using the PM info already shown). No backend.
- [x] **P3. a11y + cross-browser + perf round 2.** Labels/focus/contrast audit; verify on mobile + a second browser; confirm the R6 debounce/cache hold up.
- [x] **P4. Print/export polish.** Clean single-area status sheet + an all-areas summary print/PDF for the client. Frontend.
> When P1–P4 are in: the additive work across BOTH the keystone cluster and the portal is then exhausted. Set Status `DONE — awaiting CEO write-path phase` and stop; the next phase (write endpoints + admin cutover) is CEO-led (see `HANDOFF.md` §6) and isn't yours to start.

---

## Round 9 — Service-Area Workspace UI (the keystone detail view). Sonnet @ medium.
**The CEO has shipped the write-path** (migration `0065` + create/edit/finalize/materials/units endpoints + a consolidated read), all live on `main`. Your job now: build the **service-area detail/"workspace" view** in the operations cluster (`public/area.html` + `public/js/service_areas_ui.js`) per the spec below. This is the screen Carter mocked up and signed off. **It's the INTERNAL ops view (manager/admin) — internal `$` is fine here; this is NOT the customer portal.**

> ⚠️ CI is currently down (GitHub Actions billing-locked) so the CEO verifies everything locally — push clean, tested-by-eye work and note anything you couldn't check.

### One read powers the whole view
`GET /api/service-areas/:id/workspace` (gated `requireAuth(staff roles)`) returns:
```
{ area:    { id, name, client_name, program, work_order_number, status,
             engineering_contract_id, ec_name, build_finalized_at, map_file_path,
             client_visible_metrics:{progress,engineering_cost,construction_cost,total_cost} },
  routes:  [ { id, name, status, build_finalized_at, sort_order,
               jobs:[<job>], materials:[<material>], rollup:<rollup> } ],
  unrouted:{ jobs:[<job>], materials:[<material>] },   // route_id NULL = area-level
  rollup:  <rollup>,                                   // whole area
  finalized: bool }

<rollup>  = { engineering_cost, construction_labor, materials_cost,
              construction_cost, total_cost, progress_pct }   // server-computed $, integers
<job>     = { id, route_id, team, cost_category:'engineering'|'construction', job_name,
              billing_type, rate, actual_hours, actual_amount, estimated_amount, status,
              start_date, completed_date, notes, assigned_staff_name,
              people:[{name,hours,amount}], employee_label }   // employee_label = name or "Various (n)"
<material>= { id, route_id, item, quantity /*=expected*/, completed_quantity, unit, unit_cost,
              source:'map'|'manual'|'bom_csv', map_feature_ref, unit_count, notes }
```

### Layout (from the approved mockup — match it)
1. **Header:** client + area name. EC badge — when `program='rus'` show `RUS · EC <ec_name>`, else `<PROGRAM> · no EC`. Show `work_order_number`.
2. **Map panel (top):** **STUB only** — a clean placeholder card (the real KMZ/GIS map + map↔materials sync is a later phase; do NOT build GIS). Keep a "This route / Client overview" toggle as scaffolding. The map "changes with the selected route" later — for now just label it with the route.
3. **Route selector:** segmented control of `routes` (+ an "All routes" entry when >1). Each shows its `status` badge. Selecting a route renders that route's `jobs`/`materials`/`rollup`; "All routes" renders area-level `rollup` + all jobs/materials (routed + `unrouted`). **Areas with no routes** just render `unrouted` directly (no selector).
4. **Finalize build** button by the map/route header → `POST /api/service-area-routes/:id/finalize {finalized:true|false}` for the selected route (or `POST /api/service-areas/:id/finalize` when "All routes" — cascades). Finalized → route status badge `complete`, the Progress tile shows **"Complete"**, and material progress bars show **"Final build"**. Button toggles to "Reopen build".
5. **Cost tiles (4):** Progress (`rollup.progress_pct`% or "Complete" when finalized), Engineering cost, Construction cost, Total cost (= constr + eng). **Use the server `rollup` values verbatim — DO NOT compute any `$` in JS.** Each tile has a **"Show to client"** checkbox bound to `area.client_visible_metrics.<key>` (`progress`/`engineering_cost`/`construction_cost`/`total_cost`); toggling → `PUT /api/service-areas/:id { client_visible_metrics:{…} }`. Unchecked tile → dimmed + eye-off icon.
6. **Materials table:** Item (+ `source` badge: map/manual) · Unit cost · Expected (`quantity`) · Completed (`completed_quantity`) · Remaining (computed `expected−completed`) · Progress (bar, or "Final build" when finalized). Row expands (when `unit_count>0`) → per-unit table via `GET /api/service-area-materials/:id/units`: Unit · Status · Installed date. **"Add manually"** → `POST /api/service-areas/:id/materials {item,quantity,completed_quantity,unit,unit_cost,source:'manual',route_id}` with inline-editable fields (PUT `/api/service-area-materials/:id` on edit).
7. **Jobs & hours table:** Discipline (+ `cost_category` subtitle) · Employee (`employee_label`; when "Various (n)", clickable) · Billing · Hours (`actual_hours`) · Amount (`actual_amount`) · Status pill. Row/employee expands → `people` breakdown (name · hours · amount) + `notes` + dates (`start_date`→`completed_date`, labelled "from hours import").

### Write endpoints (all live, manager/admin-gated — wire each UI action; NONE need new backend)
- Routes: `POST /api/service-areas/:id/routes` · `PUT /api/service-area-routes/:id` · `DELETE …`.
- Jobs: `POST /api/service-areas/:id/jobs` (pass `team`+`route_id`; `cost_category` auto-set by discipline) · `PUT /api/service-area-jobs/:id` · `…/advance` · `…/regress` · `DELETE`.
- Materials: `POST /api/service-areas/:id/materials` · `PUT /api/service-area-materials/:id` · `DELETE`.
- Units: `POST /api/service-area-materials/:id/units` · `PUT /api/service-area-material-units/:id {status,installed_date}` · `DELETE` (POST/PUT/DELETE return `{unit, material}` with recomputed `completed_quantity` — re-render from that).

### Guardrails
- **Money is display-only** — render server `rollup` numbers; never compute engineering/construction/total in JS. Missing → "—".
- **No confirmation pop-ups** — optimistic updates + the existing undo bar (`public/js/undo_bar.js`); after a write, refetch `/workspace` (or update in place) and re-render.
- **OFF-LIMITS:** `routes/service_areas.js` (CEO core — it already has every endpoint you need), `auth.js`, `server.js`, `migrations/`, `schema.sql`. **No new backend** — if you think you need one, stop and set `BLOCKED — needs CEO`.
- App-shell themed, dark-mode + a11y, correct `data-active` rail. Map = stub only.

### Acceptance
Open a service area in the cluster → header with correct EC/program badge; route selector (or direct render when no routes); 4 cost tiles showing **server** values with working "show to client" checkboxes that persist; materials with expected/completed/remaining + expandable per-unit rows + manual add; jobs with "Various → per-person" expand + notes/dates; finalize build flips status/Progress/bars and reopens; zero pop-ups. Push per logical chunk to your branch; CEO merges.

**Status:** DONE — R9 MERGED 2026-06-24 (commit `18b4fbd0`). Single self-contained `public/area.html` (+680/−190); money display-only verified (all `$` via `fmtMoney(rollup.*)`, no JS cost math), all endpoints wired to existing backend, 0 conflict markers. Good call keeping it inline rather than touching the off-limits `service_areas_ui.js`.

---

## Round 10 — Client + EC management in the cluster (the write-path UI). Sonnet @ medium.
**This is FRONTEND ONLY — every endpoint you need already exists and is mounted.** Today the cluster `clients.html` is read-only (it only GETs `/api/cluster/clients` + `/api/money/statement`), so to create a client or engineering contract you have to bounce back to the legacy `admin.html`. Your job: make the cluster a complete client/EC management surface so people never leave it. Build against the existing endpoints below — **do NOT add or modify backend.**

> ⚠️ CI is down (GitHub Actions billing-locked) — CEO verifies locally. Push clean, eyeball-tested work; note anything you couldn't check. Client/EC writes are `requireAdmin`, so test logged in as **admin**.

### Endpoints (ALL LIVE — wire the UI to these; none need new backend)
- **Clients:** `GET /api/clients` · `POST /api/clients {name,notes}` · `PUT /api/clients/:id {name,notes,show_contract,show_work_order}` · `DELETE /api/clients/:id` (cascade; supports `?preview=true` for counts).
- **Engineering contracts:** `GET /api/engineering-contracts?client_id=` · `GET /api/engineering-contracts/:id` · `POST /api/engineering-contracts {client_id,name,contract_number,loan_name,notes,program}` · `PUT /api/engineering-contracts/:id {name,contract_number,loan_name,notes,active,program}` · `DELETE …` (409s with a friendly message if still referenced).
- **`program` ∈ `rus|bau|gfr|other`.** An EC always means **RUS** work — so on the EC form, default/lock the program to `rus` and explain it (non-RUS work has no EC; it sits directly under the client via the service-area program field). Show a program badge in the list.
- **Service-area create modal** already POSTs `/api/service-areas` with the EC⟺RUS rule baked in server-side (`program='rus'` auto-set when an EC is attached). You're extending its pickers, not its logic.

### Tasks (push per task to your branch; CEO merges)
- [x] **R10.1 — Client create/edit on `clients.html`.** "New client" button → inline form/modal (name, notes, `show_contract`, `show_work_order` toggles) → `POST /api/clients`; row edit → `PUT`. Optimistic insert/update + toast, no confirm pop-ups. Re-used the existing list render; added code paths, didn't rewrite it.
- [x] **R10.2 — EC list + create/edit per client.** In each client's expand panel, list that client's ECs (`GET /api/engineering-contracts?client_id=`) with a program badge; "New EC" + edit form (name, contract_number, loan_name, program [default `rus`], active toggle, notes) → `POST`/`PUT`. 409 "still referenced" message surfaces via toast on delete (no popup).
- [x] **R10.3 — Inline create in the SA-create modal.** In `service-areas.html`'s New-Service-Area modal, added "+ New" buttons beside client/EC pickers. icClientModal (name-only) and icEcModal (name, contract_number, program). After creation, `_icRefreshPickers()` re-fetches both lists, repopulates selects, auto-selects the new item, calls existing `syncEcOptions`/`toggleProgram` — RUS rule stays server-side.
- [x] **R10.4 — Polish.** Full dark-mode CSS vars, aria-modal/aria-labelledby/aria-label on all new modals, aria-live toast, loading/empty/error states, correct `data-active` rail. Baked into R10.1–R10.3.

### Guardrails
- **NO backend.** Every endpoint exists. If you think you need one, STOP → set Status `BLOCKED — needs CEO` with exactly what's missing, ping Carter, move on. **OFF-LIMITS:** `routes/*`, `auth.js`, `server.js`, `migrations/`, `schema.sql`, and structural edits to `public/js/service_areas_ui.js` (additive code paths only there).
- **No `$` math** anywhere new (not that this surface has money — keep it that way).
- Additive only; reuse existing list/render code, add paths rather than rewriting. Optimistic + undo bar; zero confirmation pop-ups.

### Acceptance
From the cluster alone: create a client; add a RUS EC under it (program shows RUS, locked-with-explanation); edit both; create a service area picking that client/EC inline without leaving the cluster; the new SA gets `program='rus'` (server-enforced). No pop-ups, undo works, dark-mode + a11y clean.

> **Note for CEO:** client/EC writes are `requireAdmin` while SA writes are `requireManagerOrAdmin` — if managers (non-admin) should create clients/ECs from the cluster, that's a backend gate change = CEO decision. Flagged in HANDOFF §8; not a R10 blocker (admin can do everything today).

---

## Round 11 — Hours import UI (QUEUED — do AFTER R10). Sonnet @ medium. FRONTEND ONLY.
**The CEO has shipped + tested the keystone hours-importer backend.** Build the admin-facing UI that drives it, so people stop using the legacy `admin.html` hours CSV tab. This replaces the legacy importer with one that lands hours on the keystone `service_area_jobs` model. **NO backend** — the two endpoints exist and are mounted; if you think you need a third, STOP → `BLOCKED — needs CEO`.

> ⚠️ CI down (billing-locked) — CEO verifies locally. `requireAdmin` endpoints, so test as admin.

### Endpoints (LIVE)
- `POST /api/hours/import/validate` — **multipart** upload, field name `file` (.csv/.xlsx/.xls). Returns `{ stageId, fileName, columns, summary:{total,matched,review,totalHours}, rows:[ <row> ] }` where each `<row>` = `{ rowIndex, employee, date, wo, hours, jobTitle, status:'matched'|'review', reason, service_area_id, service_area_job_id, staff_id, team, is_billable, unbilled_category }`.
- `POST /api/hours/import/commit` `{ stageId, overrides?:{ "<rowIndex>":"<service_area_job_id>" }, skip?:[rowIndex,...] }` → `{ committed, skipped, review_remaining, jobs_recomputed, import_batch }`. (Stages expire after 1h → 410; re-validate.)

### Build (new page preferred: `public/hours-import.html` + JS; or a modal off `hours.html`)
- [ ] **R11.1 — Upload + preview.** Drag/drop or file picker → POST validate (multipart) → render the preview table: employee · date · WO# · hours · discipline · status badge (matched green / review amber) · reason. Show the summary strip (total / matched / review / total hours). App-shell themed, `data-active="hours"`.
- [ ] **R11.2 — Inline resolve for review rows.** Each review row gets either a **Skip** toggle or a **job picker** to resolve it. Populate the picker from `GET /api/service-areas/:id/workspace` (or `/api/service-areas/:id` jobs) scoped to `row.service_area_id` when present; otherwise let the user pick the area first. **Note:** rows whose `staff_id` is null (unknown employee) can't be committed by an override alone — surface that (the employee must exist in staff first); don't pretend a job-only override fixes them.
- [ ] **R11.3 — Commit + result.** "Import N hours" button → POST commit with `{stageId, overrides, skip}` → show the result (committed / left-for-review / jobs updated) and a link back to the affected service areas. Optimistic where it makes sense; no confirmation pop-ups beyond the import action itself.
- [ ] **R11.4 — Polish.** Loading/empty/error states, dark-mode, a11y (table semantics, labels on pickers), and a clear "expired session → re-upload" path on 410.

### Guardrails
- **NO backend / NO schema.** Endpoints exist; don't reimplement matching in JS (the server already returns each row's match). OFF-LIMITS: `routes/*`, `auth.js`, `server.js`, `migrations/`, `schema.sql`.
- This is INTERNAL admin (manager/admin), not the customer portal — but still no need to surface `$`; it's an hours tool.

### Acceptance
Admin uploads a timecard CSV/XLSX → sees matched vs review rows with reasons → resolves/​skips review rows inline → commits → hours appear in the affected `service_area_jobs` (actual_hours/amount update). Legacy `admin.html` hours tab no longer needed.

---

## Round 12 — Keystone billing UI (QUEUED — after R11). Sonnet @ medium. FRONTEND ONLY.
**The CEO shipped + tested the keystone billing ledger backend** (migration 0066). Build the cluster billing UI on it so `billing.html` stops billing the retiring `projects` tree. Design context: `docs/billing_keystone_design.md`. **NO backend** — endpoints exist + mounted; need a new one → STOP → `BLOCKED — needs CEO`.

> Internal admin (manager/admin). Money IS shown here (it's the billing tool) — but never in the customer portal. CI down → CEO verifies locally; test as admin.

### The model (so the UI matches it)
Each run bills **earned − already-billed** per job: monthly hours, **progressive footage** (some June, more July, final Aug), milestone fixed, and **reconciliation credits** (negative lines when hours/footage are removed). Invoices are **per concentrator, per calendar month**, created as **drafts** you can edit. A "closed month" tag is **informational only**.

### Endpoints (LIVE)
- `GET /api/billing/worklist?period=YYYY-MM[&service_area_ids=a,b]` → `{ period, areas:[ { service_area_id, name, client_id, engineering_contract_id, program, total, lines:[ { job_id, team, job_name, billing_type, earned, billed_to_date, billable, line_kind:'charge'|'reconciliation', description, quantity, unit, rate, amount } ] } ] }`.
- `POST /api/billing/run { period, service_area_ids?[], exclude_job_ids?[] }` → creates one **draft** invoice per concentrator from billable lines (drop lines via `exclude_job_ids`). Returns `{ invoices_created, invoices:[{invoice, item_count}] }`.
- `GET /api/billing/invoices` (exists) → invoices + items for the list/drill-in.
- `GET /api/billing/report?group=client|ec|program|month` → `{ group, rows:[{label,key,invoice_count,total}] }`.
- `GET /api/billing/periods` + `POST /api/billing/periods/:month/close` (body `{open:true}` reopens) → the informational closed tag.

### Build (new `public/billing-keystone.html` + JS, or rework `billing.html` additively)
- [ ] **R12.1 — Month + worklist.** Month picker → `worklist` → per-concentrator cards with per-job rows (earned / billed / billable, charge vs **reconciliation** styled distinctly). Checkbox to exclude a line. Show closed-month badge from `/api/billing/periods`.
- [ ] **R12.2 — Generate drafts.** "Generate invoices" → `POST /api/billing/run` with selected concentrators + `exclude_job_ids` → show created drafts; link to the invoices list.
- [ ] **R12.3 — Invoices + report.** Invoices list (reuse `GET /api/billing/invoices`, show period + drill-in to items, mark reconciliation lines) + a Report tab (`/api/billing/report?group=` toggle).
- [ ] **R12.4 — Close month + polish.** Close/reopen a month (informational), dark-mode, a11y, loading/empty/error, `data-active="billing"`. **No `$` math in JS** — render server amounts verbatim.

### Guardrails
- NO backend / NO schema. Don't recompute billing in JS — the server returns every line + amount. Render verbatim. OFF-LIMITS: `routes/*`, `auth.js`, `server.js`, `migrations/`, `schema.sql`.
- This replaces the legacy project-based billing UI — but keep additive; CEO retires the old path at cutover.

### Acceptance
Pick a month → see each concentrator's billable lines (hours/footage/fixed + any credits) → optionally exclude lines → generate per-concentrator draft invoices → see them in the list with periods → view the report grouped by program/client. No `$` math in JS; reconciliation lines clearly shown.

---

## Round 14 — Map integration UI (the clickable POC). Sonnet @ medium. FRONTEND ONLY.
**CEO shipped the map-integration POC backend** (migration 0069 + `routes/map_integration.js`, tested): DB-backed storage for the map, construction-contract cost catalog (Excel upload), and an estimate that prices map units (13 handholes → catalog → $2,900). Now make it **clickable**: embed the map, persist to our DB, upload a catalog, and show the estimate. Context: `docs/map_requirements.md` (esp. the "POC status" + "Delivered map" sections). The map file is `map/fiber_route_manager_v33.html`; the storage adapter is `map/frm_storage_adapter.js`. **NO backend** — endpoints exist + mounted; need one → STOP, `BLOCKED — needs CEO`.

> Internal manager/admin. CI down → CEO verifies locally; test as admin. Same-origin embed means the map's API calls carry the session cookie.

### Endpoints (LIVE)
- Map storage (the map's `window.storage` backend): `GET /api/map/store/:key`, `PUT /api/map/store/:key {value}`.
- Construction contracts: `GET/POST /api/construction-contracts`; catalog `GET /api/construction-contracts/:id/catalog`, `POST /api/construction-contracts/:id/catalog` (multipart Excel/CSV field `file`, **or** JSON `{items:[{item_key,label,unit,unit_price}]}`).
- Estimate: `GET /api/map/estimate?plan=<planId>&cc=<ccId>` → `{ structures:[{item_key,label,count,completed,unit_price,expected,completed_value,priced}], unpriced:[…], footage_total, construction_expected, construction_completed, construction_remaining }`.
- Existing: `GET /api/map/service-areas` (the data the R13 Map tab already lists).

### Build
- [x] **R14.1 — Embed the map + persistence.** Copy `map/fiber_route_manager_v33.html` + `map/frm_storage_adapter.js` into `public/map/` so the app serves them. In the served copy, add `<script src="/map/frm_storage_adapter.js"></script>` **immediately before** the map's main inline `<script>` (so `window.storage` is set before the map's `store` first runs → plans persist to our DB, not localStorage). In the **Service Areas → Map tab** (R13B, `public/js/service_areas_map.js` / `service-areas.html`), embed the map via an **iframe** (`src="/map/fiber_route_manager_v33.html"`) replacing/augmenting the stub. Verify drawing a structure then reloading persists (via `/api/map/store`).
- [x] **R14.2 — Construction-contract + catalog screen.** A small UI (a section in the Map tab, or a modal) to: create a construction contract (`POST /api/construction-contracts`), **upload its Excel price list** (`POST …/catalog` with the `file`), and show the parsed catalog (`GET …/catalog`). This is where "Handhole = $200" gets entered.
- [x] **R14.3 — Estimate readout.** Pick a construction contract + a plan id → `GET /api/map/estimate` → render the priced structures table (item · count · completed · unit price · expected · completed value), the **construction expected / completed / remaining** totals, footage, and flag any `unpriced` items (in the catalog but no price / map ptype with no catalog match). **Render server numbers verbatim — no `$` math in JS.**
- [x] **R14.4 — Polish.** Loading/empty/error, dark-mode, a11y; iframe sized to fill the tab; clear "pick a contract + plan" empty state.

### Guardrails
- **NO backend / NO schema.** Endpoints exist. **Don't rewrite the map's internal logic** — only add the adapter `<script>` include to the served copy + copy the files into `public/map/`. Deeper map changes (plan↔SA auto-linking, dual designation on elements, `jobRef`→service-area-job picker) are **CEO/next-phase — flag `BLOCKED — needs CEO`, don't attempt.** OFF-LIMITS: `routes/*`, `server.js`, `auth.js`, `migrations/`, `schema.sql`.
- No `$` math in JS — the estimate endpoint returns every number.

### Acceptance
From the Service Areas → Map tab: the real fiber map loads embedded; drawing structures/spans **persists across reload** (server-side); you can create a construction contract and upload its Excel price list; and an estimate readout prices a plan's units against that catalog (matching the backend: e.g. 13 handholes → $2,600). No `$` math in JS; unpriced items flagged.

> **Acting-CEO note — 2026-06-24 (interim stand-in, not the head-Claude CEO).** Reviewed + **merged R14 to `main`**. Integration gate = GREEN (frontend-only; no `routes/`/`server.js`/`auth.js`/`migrations/`/`schema.sql`; 0 conflict markers; internal page, no customer `$`-leak; estimate numbers rendered verbatim — no `$` math in JS). Served map is byte-identical to `map/fiber_route_manager_v33.html` plus only the required adapter `<script>`; adapter copied verbatim.
> **One fix applied at merge** (`public/js/service_areas_map.js`, `renderCcList`): the CC-row handler was built as `onclick="saSelectCc(' + JSON.stringify(cc.id) + ',' + JSON.stringify(cc.name) + ')"` — `JSON.stringify` emits literal `"` which terminated the double-quoted attribute → malformed HTML, so clicking an existing contract row to re-select it didn't fire (create-new still worked, since it calls `saSelectCc` directly). Fixed by HTML-escaping the args once (`esc(JSON.stringify(id)+','+JSON.stringify(name))`) and reusing for both `onclick`/`onkeydown`; this also closes a latent XSS hole (`cc.name` was injected raw into an event handler). Verified well-formed + injection-safe against quote/apostrophe/`&`/`<script>` inputs; `node --check` clean. No other changes. — Acting CEO

---

## Round 17 — Projects Phase B: the "+ New project" flow. Sonnet @ medium. FRONTEND ONLY.
**Design `docs/projects_tab_design.md` (Phase B).** Build the **+ New project** flow on the Projects tab — manual create **and** map-draw with footage/miles autofill. Backend is live + tested: `POST /api/service-areas/:id/jobs` accepts `{ team:'permitting'|'design', billing_type:'footage', footage, miles, geometry, route_id? }` (geometry = the drawn line, jsonb); `PUT /api/service-area-jobs/:id` supports re-draw + clear. **NO backend.** Builds on R16 (Projects tab + tree + the Leaflet maps). Reuse R15's Leaflet.draw setup (note: lib is `leaflet.draw.js`, NOT `.min` — CEO just fixed that).

> A "project" = a permitting/design `service_area_job` (the leaf). Internal manager/admin.

### Build
- [x] **B1 — "+ New project" button + modal.** On the Projects tab, a `+ New project` button → modal with: **discipline** (Permitting/Design), name, and **manual link fields** (client → EC → CC → SA → route; SA required — it's the town; manual-creatable if new). Match the CEO model (`projects_tab_map_first_ia` mockup).
- [x] **B2 — Two create paths.**
  - **Draw on map:** enter a draw mode on the Leaflet map (Leaflet.draw polyline) → user draws the line → **compute footage** (haversine sum of the vertices, in feet) **+ miles** (footage/5280) → `POST /api/service-areas/<saId>/jobs` with `{team, billing_type:'footage', footage, miles, geometry:[[lat,lng],…], route_id?}`. The new project appears in the tree + on the map.
  - **Create without map:** same POST minus geometry (omit/null) → project is created with **no location**; its detail map shows "No location."
- [x] **B3 — Footage/miles readout.** Show the computed footage + miles live as the line is drawn (before submit), and let the user tweak before saving. Render numbers rounded; no `$` math.
- [x] **B4 — Re-draw.** From a project's detail, allow re-drawing its line → `PUT /api/service-area-jobs/:id { geometry, footage, miles }`; clearing → `geometry:null` ("No location").

### Guardrails
- NO backend/schema. OFF-LIMITS: `routes/*`, `server.js`, `auth.js`, `migrations/`, `schema.sql`. Additive frontend. No `$` math. Escape values in attributes (`esc(JSON.stringify(...))`). Use `leaflet.draw.js` (not `.min`).

### Acceptance
`+ New project` opens a modal; you can draw a permitting/design line on the map and it creates the project with **footage + miles auto-filled from the geometry** (live readout while drawing), appearing in the tree + map; or create manually with no location ("No location" in detail); and re-draw an existing project's line. No `$` math.

## Round 16 — Projects tab rebuild (BIG, multi-phase). Sonnet @ medium. FRONTEND ONLY.
**Read `docs/projects_tab_design.md` first (locked IA).** Renames **Service Areas → Projects**, map-first, with a nested rollup tree. Phase A only for now; B/C/D follow. Backend `GET /api/projects-tree` is live + tested. **NO backend** — need one → STOP, `BLOCKED — needs CEO`. Builds on the R15 overview map (`public/js/service_areas_map.js` + `service-areas.html`).

> Internal manager/admin. CEO verifies locally. Reuse the R15 Leaflet overview; don't rebuild it.

### Phase A — rename + nested tree (this round)
- [x] **A1 — Rename to Projects.** In `public/js/app_nav.js` change the `service-areas` rail label to **Projects** (keep the page file `service-areas.html` + the `data-active` key to avoid breaking links; just change the visible label + the page `<h1>`/title to "Projects").
- [x] **A2 — Nested tree (replaces the flat SA list in the Map view's left panel).** Fetch `GET /api/projects-tree` → render the nested **Client → EC → CC → SA → Route → project** tree. Node shape: `{id,type,label,children,...}` where `type` ∈ client|ec|cc|sa|route|project; SA nodes carry `center_lat/center_lng/has_boundary/lifecycle`; project nodes carry `discipline`(permitting/design)+`status`. **Rolled up by default** (collapse all but clients), chevron to expand. Type badges per node (EC/CC/SA/Route/PERMIT-or-DESIGN). Match the model CEO built (the `projects_tab_map_first_ia` mockup).
- [x] **A3 — Cascade visibility toggles.** Each node gets an eye toggle; toggling a parent **cascades to all descendants**; the overview map shows only SA pins/boundaries whose whole ancestor chain is visible.
- [x] **A4 — Click-to-zoom.** Click a node's label → the overview map flies to it (SA → its center/boundary; client/EC/CC → fit their SAs' bounds). Reuse the R15 marker/boundary plotting.

### Also in Round 16 — Carter live feedback (2026-06-25)
- [x] **A5 — De-dupe the Map-view column.** In Map mode the SA list shows **twice** (the left List column AND the map panel's middle list). Remove the **column closest to the map** (the map-panel's redundant SA list) and let the **map fill that space**. Map mode = [the nested tree] + [map]. The tree (A2) is the single left list.
- [x] **A6 — "Map" button in List view.** When a node is selected in **List view** and you're seeing its rollup (click PSC → its ECs/SAs/projects; click an SA → its stuff; a project too), put a **"Map" button next to the title** that switches to Map view and **zooms the map to that entity** (client → fit all its SAs; SA → that SA; project → its geometry). Same zoom logic as A4.
- [x] **A7 — FIX: Edit + boundary tools don't fire (confirmed bug, NOT intentional).** On the SA detail (`area.html`), clicking **Boundary** / **Edit** / **Draw polygon** does nothing. CEO leads: the controls render, but in my live check `L.Draw` never loaded and no draw toolbar appeared. Investigate (a) whether `ensureLeafletDraw`'s lazy script actually loads + its `cb` runs, (b) whether `_saMapLeaflet` (the inline Leaflet map) is initialized when `saMapToggleBnd` runs (it returns early at `if(!_saMapLeaflet)`), and (c) the FRM-iframe **Edit** wiring. Same for the **overview** boundary edit (R15.5) if affected. Repro with an SA that has plan data (e.g. "Concentrator 7"). Verify the fix live (draw a polygon, save, reload → it persists via `PUT /api/service-areas/:id/boundary`).

- [x] **A8 — Segregate the detail view by Construction / Engineering (+ add Overall).** On the project/SA detail (`area.html`), the Construction|Engineering toggle currently just *outlines* a section — make it actually **separate the data**, and add a third option **Overall** (default). Carter: "Materials isn't relevant for Engineering; engineering billing isn't relevant for Construction."
  - **Overall** = today's combined view (all four tiles: Progress · Engineering · Construction · Total cost, **plus** Materials **and** the jobs/hours).
  - **Construction** = Construction cost tile + Progress + the **Materials** section + construction-discipline jobs (`cost_category='construction'`). **Hide** the Engineering tile + engineering billing/jobs.
  - **Engineering** = Engineering cost tile + engineering jobs/hours/billing (`cost_category='engineering'`). **Hide** Materials + the Construction tile/jobs.
  - Keep it driven by the data already on the page (`cost_category` per job, materials, the construction/projection blocks). Three-way toggle, default Overall.

### Guardrails
- NO backend/schema. OFF-LIMITS: `routes/*`, `server.js`, `auth.js`, `migrations/`, `schema.sql`. Additive to `service_areas.js`(ui)/`service_areas_map.js`/`service-areas.html`; `area.html` edits OK for A7 + A8. No `$` math. Keep the existing List view working. Escape any value put into an `onclick`/attribute (`esc(JSON.stringify(...))`) — recurring bug.
- **Don't build Phase B/C/D** (new-project draw flow, documents, inspection) — those are separate rounds with their own backends. Flag if blocked.

### Acceptance
Service Areas tab reads **Projects**, opens map-first with the nested Client→EC→CC→SA→Route→project tree (rolled up by default, expandable, type badges); eye-toggles cascade to the map; clicking a node flies the map to it. No `$` math; existing List view intact.

## Round 15 — Map-first Service Areas UX (BIG; Carter-designed via 2 interactive models). Sonnet @ medium. FRONTEND ONLY.
**Read `docs/map_requirements.md` → the "Map-first Service Areas UX — LOCKED" section first** (full spec + the two mockups' behavior). The Service Areas tab becomes **map-first**; all maps are **real-geo Leaflet, editable + movable**. Backend is shipped + tested (migration 0072 + endpoints) — **NO backend**; need one → STOP, `BLOCKED — needs CEO`. Reuse the Leaflet + drawing engine in `public/map/fiber_route_manager_v33.html`; don't rebuild Leaflet. Work top-down, push per task.

> Internal manager/admin. CI billing-locked → CEO verifies locally. Expect multiple pushes; this is several rounds of work.

### Endpoints (LIVE)
- `GET /api/map/service-areas` → all SAs incl. `boundary`, `center_lat`, `center_lng`, status, client, program (overview).
- `PUT /api/service-areas/:id/boundary` `{boundary, center_lat, center_lng}` (save the hand-drawn boundary).
- `GET/PUT /api/map/store/:key` (the map's `window.storage`; adapter `public/map/frm_storage_adapter.js`).
- `GET /api/service-areas/:id/map-rollup`, `GET /api/projections/service-area/:id` (has `construction`+`combined`), `GET /api/projections/service-area/:id/mileage`, CC catalog + `GET /api/map/estimate`.

### Build (top-down)
- [x] **R15.1 — Overview map.** In `service-areas.html` Map view: a real Leaflet map, **Macon-centered**, plotting every SA from `/api/map/service-areas` by `center_lat/lng` with **status-colored pins** + each SA's **boundary polygon**. **Filter client → SA** (side list synced to map). **Cluster** pins when zoomed out (Leaflet.markercluster or simple). Click a build (list or pin) → **fly/zoom to it** → an **Open** action → SA detail.
- [x] **R15.2 — SA detail: map-as-header.** The fiber map rides as a **resizable header** (drag handle) over the construction/engineering data. **View-by-default** with an **Edit** button that flips on the draw/place/split tools, and an **Expand** to enlarge it "big enough to work in." **Architecture:** prefer **inlining** the fiber map into the detail page (same JS context) over an iframe so rows/map share state; if you keep the iframe, use `postMessage`. Flag the choice in your push.
- [x] **R15.3 — Bidirectional linking.** Hover a unit row ↔ its pin glows (both ways); click a row → map **flies to that unit** + selects; click a pin/line → **quick data card** → **Open properties** opens the element modal. **Jump-to-unit box** (type `HH-7` → fly). Construction rows from the rollup/projection; Construction/Engineering toggle (the split).
> **CEO live-verification findings (2026-06-25 — addressed in R15.4/R15.5):** verified R15.1–R15.3 live in the authed app. Works: overview Leaflet map (Macon-centered, pins from `center_lat/lng`, filters, Open links), detail map-as-header (resize handle + Edit present). **Fixes applied in R15.4/R15.5:** (a) **Responsive collapse** — gave map container `min-width` + column stacking on narrow viewports. (b) **Boundary rendering** — R15.4 renders existing `[[lat,lng],…]` boundaries on the overview as L.polygon paths. (c) **Clustering** — verified wired. (d) Design: map made more dominant (wider flex ratio).

- [x] **R15.4 — Hand-drawable SA boundary (day one).** Draw/edit a boundary polygon on the map (Leaflet draw/editable), **save via `PUT …/boundary`**; offer an **auto-hull suggestion** (convex hull of the SA's units/routes) as a starting point; render boundaries on the overview. Editable + movable vertices.
- [x] **R15.5 — Every map editable + movable.** Pan/zoom everywhere; the fiber draw tools reachable behind Edit on both overview (boundary editing) and detail.

### Guardrails
- **NO backend / NO schema.** OFF-LIMITS: `routes/*`, `server.js`, `auth.js`, `migrations/`, `schema.sql`. `public/map/*` + `service-areas.html` + `public/js/service_areas_map.js` are yours (additive; the map file may be extended for boundary-draw, but don't gut its internals). No `$` math in JS — projection/estimate endpoints return the numbers.
- Big round — push each R15.x separately; CEO reviews + merges incrementally.

### Acceptance
Service Areas opens to a real Macon map of all builds (status pins + boundaries + clustering, client→SA filter); clicking a build flies in and opens it; the SA detail shows the map as a resizable, editable header linked bidirectionally to the unit rows (hover, click-to-fly, jump box, pin→data card→properties); SA boundaries are hand-drawable and saved. No `$` math in JS.

## Round 13 — Projections (Money tab) + Overall map (Service Areas tab) + lifecycle (QUEUED — after R12). Sonnet @ medium. FRONTEND ONLY.
**CEO shipped the projections backend** (migrations 0067/0068). Three pieces, all against existing endpoints. Design: `docs/projections_design.md`. **NO backend.** CEO built an approved mockup — match its look (KPIs → budget-burn bar → expandable concentrator cards with per-job expected/billed/remaining).

> Internal manager/admin. Money shown here. CI down → CEO verifies locally; test as admin.

### A) Projections — a NEW TAB inside `money.html` (no new rail item)
Money becomes tabbed (Margin · Aging · Revenue · Program · **Projections**). The Projections tab:
- **Filters** (program All/RUS/Non-RUS, client) — modular; recompute on change.
- **KPI cards**: projected total, billed to date, projected remaining, active concentrators — from `GET /api/projections?group=program` (and `?group=client`).
- **RUS engineering-budget burn** (when RUS/an EC is in view): `GET /api/projections/ec/:id` → a bar of billed vs projected-remaining vs budget, with `burn_rate_monthly`, `projected_months_to_budget`, over/under flag.
- **Concentrator list**: each row from the rollup; click → expand per-job breakdown via `GET /api/projections/service-area/:id` (`jobs[]` = {job_name, team, billing_type, bill_trigger, expected, billed, remaining}; `totals` = {projected_total, billed, remaining, completion_pct}). Show a lifecycle badge (active / completed / final·archived) from the area's `build_finalized_at` / `closed_at`.
- Endpoints: `GET /api/projections?group=client|ec|program`, `/api/projections/service-area/:id`, `/api/projections/ec/:id`. **Render server numbers verbatim — no `$` math in JS.**

### B) Overall map — a NEW TAB inside `service-areas.html` (List | Map toggle)
- Add a `List | Map` toggle. **Map = stub for now** (real KMZ/GIS render is a later phase) but wire the DATA: `GET /api/map/service-areas` → [{id, name, client_name, program, ec_name, status, build_finalized_at, closed_at, map_geometry}]. Render a clean placeholder with **client + service-area selectors** that filter the list of areas (and, when an area's picked, link to its workspace). Keep co-located areas as separate entries — never merge across client/EC/program.

### C) Lifecycle actions — on the workspace `area.html`
- The workspace already has "Finalize build" (= **completed**, `build_finalized_at`). Add a **"Mark final" / "Reopen"** control (= archive) → `POST /api/service-areas/:id/close {closed:true|false}` (and per-route `POST /api/service-area-routes/:id/close`). Show the three-stage badge: active → completed → final·archived. When final, visually treat the area as read-only (soft archive; dim edit affordances) — no hard lock needed.

### Guardrails
- NO backend / NO schema. Don't recompute projections/budget in JS — endpoints return every number. OFF-LIMITS: `routes/*`, `auth.js`, `server.js`, `migrations/`, `schema.sql`. Additive; `service_areas_ui.js`/`area.html` edits additive only.

### Acceptance
Money has a Projections tab matching the mockup (filters, KPIs, RUS budget burn, expandable concentrators with per-job expected/billed/remaining + lifecycle badges). Service-areas has a List|Map toggle with the map data wired to a placeholder + client/SA selectors. Workspace can mark an area completed → final (and reopen), with the stage badge. No `$` math in JS.
