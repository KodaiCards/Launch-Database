# Claude 2 — Contractor timeclock (Phase 5)

**Status:** MERGED to main 2026-06-23 (CEO reviewed). Works today for staff-role field users.
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
