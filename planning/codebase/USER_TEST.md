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
| U4 | Service-area detail / workspace | `/area.html` | ⬜ |
| U5 | Pipelines | `/pipeline.html` | ⬜ |
| U6 | Job board | `/job-board.html` | ⬜ |
| U7 | Billing (legacy) | `/billing.html` | ⬜ |
| U8 | Billing keystone | `/billing-keystone.html` | ⬜ |
| U9 | Money | `/money.html` | ⬜ |
| U10 | Hours | `/hours.html` | ⬜ |
| U11 | Import hours | `/hours-import.html` | ⬜ |
| U12 | Clients | `/clients.html` | ⬜ |
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

**U3 — Service areas / "Projects" (`/service-areas.html`, admin) ✅.** Keystone hub: left rail = "+ Service Area", search, program filter (All/RUS/BAU/GFR/Other); SA list grouped by client (DEMO—Live Loop: Demo Concentrator 2 jobs $0 BAU · DEMO—PSC: Macon BAU Area 3 jobs $7.5k, Concentrator 7 2 jobs $7.5k RUS, Concentrator 14 2 jobs $7.5k RUS). Header: New project + List/Map toggle + Admin link + (?). Main = "Select a service area, or create one" (empty until selected). Undo bar present. Clean, matches map (chunk 05). Single shared nav (no dup here — the dup is dashboard.html-specific). ⚠ Header **"Admin" link → legacy `admin.html`** → confirms O30 (cluster still depends on legacy admin for config). List/Map toggle ties the map pillar (I6/chunk 12). Data gated (403 trainee); page 200 (O34a).
