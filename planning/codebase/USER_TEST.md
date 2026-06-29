# Live USER-TEST (deep dive) — drive every screen, cross-ref the map, find what's real

> Owned by Planning. **Goal (Carter):** the missing leg of the map — drive the LIVE app screen-by-screen as a real user, reconcile vs the code map (`codebase/00-SYNTHESIS.md` + `01–20`), and capture **what's broken/janky · what's wired-but-unreachable · the real UI state (for the redesign) · O34 perm-flash/leak per screen.** Runs as a **self-waking chunked loop** (like the codebase marathon) — every chunk writes findings to docs + commits, so **compaction/new-session loses NOTHING.** Last updated 2026-06-29.

## ▶ Resume protocol (after compaction / new session) — READ THIS FIRST
`PLANNING.md` → this file → continue the next ⬜ in the checklist. Each chunk: (1) ensure preview running + admin session (below); (2) drive the next 1–3 screens; (3) write findings → `open_items.md` (O-series) + the per-screen notes here; (4) mark the checklist; (5) `git add planning/ → commit → pull --rebase → push`; (6) `ScheduleWakeup` 60s with the same continuation prompt. **Do not stop until all screens done, then CLEAN UP test users + final report.**

## Test harness (reuse across wakes)
- **Preview:** `preview_start` (name "app"). If a fetch fails with "Failed to fetch", the tab isn't on the origin → `preview_eval window.location.href='http://localhost:3000/login.html'` first.
- **Throwaway test users** (prod DB; password `verifypass123`): **admin = `dd_admin_1782774511075`** (promoted to admin via DB), **trainee = `dd_trainee_1782774511075`**. Re-login via `POST /api/auth/login`. If they were cleaned up / missing, recreate: register via the browser (proper hashing) → `UPDATE users SET role='admin' WHERE username='<the admin>'` via node+pg (NODE_PATH=<repo>/node_modules).
- **Cost:** prefer `preview_snapshot` (text) over `preview_screenshot` (image); screenshot only when the visual matters (redesign input / a real glitch).
- **Method per screen:** as ADMIN → navigate → snapshot/screenshot → note UI-vs-map + broken/janky + wired-but-unreachable. Then the **O34 check** → as TRAINEE (or via API probe) confirm the page/data isn't leaking to a restricted role.
- **⚠ CLEAN UP at the very end:** delete `dd_admin_*` + `dd_trainee_*` (+ their training rows) via the scratch cleanup pattern. Leave prod clean.

## Screen checklist (operations cluster + portals + legacy)  ⬜ todo · 🔄 · ✅ done
| # | Screen / page | Route | Status |
|---|---|---|---|
| U0 | **O34 authz sweep** (which APIs/pages leak to a trainee) | API probes | ✅ → O34 (clients/projects/contracts/EC/pricing leak to trainee; pages serve 200) |
| U1 | Operations home / launcher | `/` `/launcher.html` | ✅ admin=all tiles; O33 (light default, sun/moon) |
| U2 | Dashboard | `/dashboard.html` | ✅ keystone overview; **dup inline nav (jank→I10)**; O33 |
| U3 | Projects (keystone SA list) | `/service-areas.html` | ✅ clean hub; header Admin→legacy (O30) |
| U4 | Service-area detail / workspace | `/area.html` | ✅ rich (Leaflet map/plan-link, cost tiles+client-vis, materials, jobs&hours) |
| U5 | Pipelines | `/pipeline.html` | ✅ keystone kanban; stages≠legacy (O18) |
| U6 | Job board | `/job-board.html` | ✅ all-jobs status board, read-only |
| U7 | Billing (legacy) | `/billing.html` | ✅ = invoice LIST (`/api/billing/invoices`); O19 dead/unused |
| U8 | Billing keystone | `/billing-keystone.html` | ✅ canonical ledger (Worklist/Invoices/Report+close) |
| U9 | Money | `/money.html` | ✅ margin/aging/revenue/program/projections/reporting |
| U10 | Hours | `/hours.html` | ✅ keystone-only (O23 live: timeclock hrs invisible); unattributed bucket |
| U11 | Import hours | `/hours-import.html` | ✅ keystone importer (O24 no-dedup applies) |
| U12 | Clients | `/clients.html` | ✅ mgmt; O16 facet (billed $0 vs money $3,650) |
| U13 | Invoices | `/invoices.html` | ⬜ |
| U14 | People | `/people.html` | ⬜ |
| U15 | Settings | `/settings.html` (O30 stub) | ⬜ |
| U16 | Audit log | `/audit.html` | ⬜ |
| U17 | Training admin + Lesson visibility | `/training-admin.html` | ⬜ |
| U18 | Training SPA (trainee view) | `/training/` | ⬜ |
| U19 | Customer portal | `/customer.html` | ⬜ |
| U20 | Client portal (v1 + v2) | `/client-portal.html` `/client/` | ⬜ |
| U21 | Splice tool | `/splice.html` | ⬜ |
| U22 | Map (FRM) | `/map/fiber_route_manager_v33.html` | ⬜ |
| U23 | Legacy admin (cutover source) | `/admin.html` | ⬜ |

## Findings so far
- **U0 / O34 (verified live):** trainee reads `/api/clients`, `/api/engineering-contracts`, `/api/projects`, `/api/contracts`, `/api/pricing` (rates) — 200 with real data (any-auth leak). Restricted pages serve 200 HTML to anyone (client-gated flash). `/api/jobs`, `/api/staff/all`, `/api/service-areas` correctly 403. Fix = exclude trainee/customer (not lock-to-admin — portals need these). → open_items O34.

## Per-screen notes
*(appended as each screen is driven — facts + UI-vs-map + jank + leaks)*

**U1 — Launcher (`/launcher.html`, admin) ✅.** All 12 tiles shown (Admin Portal, Operations, Splice Matrix, Design, Permitting, Time Clock, Launch Training, Client Portal, Offline DWG Sync, Workspace, Downloads, File Activity) — admin ungated, correct. Topbar = app-shell (logo, theme toggle, user menu). **I10/O33 redesign input:** default theme = LIGHT (O33 wants dark default); toggle = sun/moon icon (O33 wants "Light/Dark Mode" text). Trainee gets the training-only single tile (TRAINING_ONLY_LOCKDOWN, verified earlier) — launcher itself isn't an O34 leak (server-filters tiles by role). Matches map (PORTAL_DEFS, chunk 01).

**U2 — Dashboard (`/dashboard.html`, admin) ✅.** The KEYSTONE dashboard (`/api/dashboard/overview`, service_areas-based): tiles ACTIVE AREAS (4: 2 RUS/2 non-RUS), JOBS IN FLIGHT (9), EST. PIPELINE ($22,500 sum of job estimates), UNBILLED ($0), AR OUTSTANDING ($0); "Needs attention" (ready-to-bill/in-revision/stale/overdue/areas-with-no-jobs); Revenue/Ready-to-bill/Hours/Pipeline tabs; program pipeline (RUS $15k / non-RUS $7.5k / actual billed $7.3k); by-client; AR aging buckets. Real demo data, clean. ⚠ **JANK (real): dashboard.html ships a DUPLICATE inline nav** alongside the shared `app_nav` rail — two different navs (top rail = Projects/Billing(KS)/Job board/Import hours/People/Training/Audit/Settings/Admin; inline = "Service areas"/"Admin (legacy)"/a "Theme" text button). Inconsistent + confusing → **I10 redesign should kill the inline nav (use only app_nav).** Theme toggles also inconsistent (topbar sun/moon vs the inline "Theme" text button) → O33. Data server-gated (`/api/dashboard` 403 for trainee); page shell still 200 (O34a flash). NOTE: this is the keystone dashboard — the LEGACY `/api/dashboard` (chunk 05) is the other one; confirm which the legacy admin.html uses (U23).

**U4 — Area detail / SA workspace (`/area.html?id=…`, admin) ✅.** The richest keystone page, healthy. Breadcrumb (Service Areas / client / SA). Sections: **embedded Leaflet boundary map** ("No plan linked — draw on the map to link a plan" + View-mode Overall/Construction/Engineering + Edit boundary / Edit / Expand) → this is where map↔SA plan-linking happens (ties chunk 12 map / I6 / O27 map-storage). **Finalize build / Mark final** (lifecycle, chunk 03). **Cost tiles** PROGRESS / ENGINEERING ($3,650 labor+overhead) / CONSTRUCTION ($0 labor+materials — $0 because no map plan linked → no construction estimate, consistent w/ computeEstimate) / TOTAL ($3,650), **each with a "Show to client" checkbox** (per-tile customer-portal visibility, ties chunk 10). **Materials** table (Item/Unit/Cost/Expected/Completed/Remaining/Progress; empty + Add manually; ties O27 map-materials-sync). **Jobs & Hours** table. ⚠ Another scattered theme toggle (O33 pattern). Matches map (chunk 03/05/12). NB: the Leaflet boundary map here ≠ the standalone FRM tool (chunk 12) — this links a `map_plan_id`, FRM draws the detailed plan.

**U5 — Pipelines (`/pipeline.html`, admin) ✅.** KEYSTONE per-team kanban. Title "Permitting pipeline" + Permitting/Design tabs. Columns = keystone stages **Potential/Started/Submitted/Approved/Issued/Revision** (1/1/0/1/0/0) with real jobs (Concentrator 14 RUS potential, Concentrator 7 started, Macon BAU approved). ⚠ keystone stages **differ from legacy `permit_stages`** (potential→started→submitted→approved→checklist, chunk 08) — confirms the O18 dual pipeline (this is the keystone one; permits.html is legacy). Recurring inline-header pattern (Service Areas/Admin links + a theme button) duplicating the rail → I10. Data gated (403 trainee).

**U6 — Job board (`/job-board.html`, admin) ✅.** Keystone all-jobs board, "All service-area jobs grouped by status. Read-only." Filters: search + team (Permitting/Design/Construction/Inspection) + program + Status/Team/Client grouping. Status columns **Not started/In progress/Revision/Done/Billed/On hold** (0/0/1/0/4/0) — real (1 Staking in revision, 4 billed). The "Job Board" product pillar. Same inline-header pattern (logo+theme+Admin). NB: job STATUS model here (not_started/in_progress/revision/done/billed/on_hold) vs the pipeline's STAGE model (U5) — two views of job state. Clean. Data gated.

**U7 — Billing (`/billing.html`, admin) ✅.** Surprise: it's an **invoice LIST** (calls `GET /api/billing/invoices` — confirmed via network), NOT the legacy bill-multiple/batches bulk UI. Lists draft invoices (Live Loop $3,650 ×2 [keystone `/run` `INV-<ts>-0` format], PSC $0 ×2). So the rail "Billing" = invoice list; "Billing (KS)" = the ledger. ⚠ **O19 refined:** nothing calls `/api/billing/report` (billing.html uses `/invoices`; billing-keystone uses the keystone report) → the shadowed legacy `/report` is **dead/unused code, not a user-facing break** (downgrade O19 to low). The legacy `billing.js` bill-multiple/batches engine may have NO live UI at all (verify) — possibly already orphaned.

**U8 — Billing keystone (`/billing-keystone.html`, admin) ✅.** The canonical **earned−billed ledger** UI. Tabs **Worklist / Invoices / Report** + period selector (Jun 2026 back to Jan 2025) + **Close month** (informational period-close, chunk 07a) + Refresh. Worklist = "Nothing billable for this period — all jobs up to date" (correct: billable = earned−billed = 0 since demo jobs billed). Matches chunk 05/07a exactly — this is THE billing engine. ⚠ **Two billing rail entries** ("Billing" list + "Billing (KS)" ledger, which has its own Invoices tab) are redundant → cutover/I10 should merge to one. Theme toggle inline (O33).

**U9 — Money (`/money.html`, admin) ✅.** Keystone money view (manager). Tabs **Margin / AR Aging / Revenue / Program / Projections / Reporting**. Margin = "Estimate vs Billed by Service Area" table (Live Loop 2 jobs $0 est/$3,650 billed/+3,650; PSC Conc14 RUS $7,500/$0/−7,500; Conc7 RUS −7,500; Macon BAU −7,500; **TOTAL $22,500 est / $3,650 billed / −18,850 var**) + client/program filters + Print. Has a **Projections tab** (ties I1/I11). NB: per-SA billed IS surfaced here (relevant to O16 — the program-level invoice attribution is the deeper gap, check Program tab later). Manager-gated (`/api/money/*` 403 for trainee). Clean. matches chunk 05 money_view.

**U10 — Hours (`/hours.html`, admin) ✅.** Keystone "Hours by Person" — `/api/hours/summary`, "Labor hours per staff member and job. No billing figures." Period (week/month/all) + FROM/TO + group-by Person/Client/Service-area + Total + Export CSV + By client/By area. ⭐ **LIVE O23 confirmation:** the 10.0 demo hrs show under **"— Unattributed —"** (null staff) on a Design job (job name "—") — this view reads ONLY keystone `service_area_job_id` hours, so **timeclock-logged hours (legacy `project_id`, chunk 09) would NOT appear here** = the split-brain Carter distrusts. Also: unattributed hours are a real signal (the new dashboard I11 should flag attribution). Manager/admin gated.

**U11 — Import hours (`/hours-import.html`, admin) ✅.** Keystone CSV importer UI: drag-drop/choose (.csv/.xlsx/.xls; "Expects employee, date, WO#, hours") → **Validate file** → (staged matched/review preview → commit). Lands on `service_area_job_id` via `_hours_match` (chunk 09b). ⚠ **O24 applies here:** this importer has NO dedup / NO billed-period guard (code finding) → re-uploading the same timecard DOUBLES hours. Live dup-upload test deferred (needs a crafted CSV; flag for a targeted hours-integrity test). The LEGACY importer (hours_csv, → project_id, has dedup) has no obvious cluster UI — the cluster only exposes the keystone one. Manager/admin gated.

**U12 — Clients (`/clients.html`, admin) ✅.** Client management: All Clients table (Client / Service Areas / Total Billed / Outstanding / Edit) + New Client + search; rows expand for EC management (chunk 06). DEMO—Live Loop (1 SA), DEMO—PSC (3 SAs). Clean, matches map. ⚠ **O16 facet (different numbers on different screens):** "Total Billed" = **$0** here for Live Loop, but Money/Margin (U9) showed **$3,650 billed** for it — "billed" is defined differently (this likely counts sent/non-draft; money counted the DRAFT invoice). A real inconsistency Carter would distrust. → note under O16. O34: client names leak via `/api/clients` (logged).

**RECURRING UI PATTERN (for I10):** every cluster page = the shared `app_nav` rail PLUS a page-specific inline header that repeats logo / a theme toggle / an "Admin" link (sometimes "Service Areas"). The theme toggle appears in BOTH the topbar (sun/moon) AND inline headers (sometimes a "Theme" text button) → O33 inconsistency. `dashboard.html` is the worst (a FULL duplicate nav). The redesign should collapse to ONE nav + ONE theme control.

**U3 — Service areas / "Projects" (`/service-areas.html`, admin) ✅.** Keystone hub: left rail = "+ Service Area", search, program filter (All/RUS/BAU/GFR/Other); SA list grouped by client (DEMO—Live Loop: Demo Concentrator 2 jobs $0 BAU · DEMO—PSC: Macon BAU Area 3 jobs $7.5k, Concentrator 7 2 jobs $7.5k RUS, Concentrator 14 2 jobs $7.5k RUS). Header: New project + List/Map toggle + Admin link + (?). Main = "Select a service area, or create one" (empty until selected). Undo bar present. Clean, matches map (chunk 05). Single shared nav (no dup here — the dup is dashboard.html-specific). ⚠ Header **"Admin" link → legacy `admin.html`** → confirms O30 (cluster still depends on legacy admin for config). List/Map toggle ties the map pillar (I6/chunk 12). Data gated (403 trainee); page 200 (O34a).
