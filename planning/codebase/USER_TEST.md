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
| U1 | Operations home / launcher | `/` `/launcher.html` | ⬜ |
| U2 | Dashboard | `/dashboard.html` | ⬜ |
| U3 | Projects (keystone SA list) | `/service-areas.html` | ⬜ |
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
