# Claude 2 — Contractor timeclock (Phase 5)

**Status:** DONE — additive work exhausted, CEO to take write-path/cutover. R8 tasks 39–42 complete 2026-06-24.
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
