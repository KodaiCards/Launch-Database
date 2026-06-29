# 04 — People roster (`routes/people.js`, 81 ln)

> Mapped 2026-06-29 (full read). The just-shipped fix for the stranded-user-mgmt gap (CEO built, I reviewed). The "first slice of System F / staff = one concept" — as a merged VIEW, not a table merge.

## What it is
A single read-only, admin-only `GET /api/people` that `UNION ALL`s:
1. **every `users` row** (every login incl. brand-new trainee self-signups) LEFT JOIN its linked `staff` record (`users.staff_id`), tagged `kind='user'`; PLUS
2. **every `staff` row with no linked user** (legacy billing-only people), tagged `kind='staff'`.
Sorts active-first, then display_name. Returns user_id, staff_id, username, role, team, extra_teams, display_name, email, active, last_login, staff_name.

## Why it exists (the gap it closed)
`staff` and `users` were two disconnected UIs: the operations People page read `/api/staff/all` (the `staff` table only), but `POST /api/auth/register` writes to `users` only (no staff row) — so **self-signups were invisible** where Carter works, and account delete was stranded in legacy `admin.html`. This endpoint is the merged source so nobody is invisible regardless of table. (Confirms the chunk-01/02 finding; resolves the user-mgmt foundation Carter demanded.)

## Wiring
- **Read-only, no auth logic of its own** — `requireAdmin` only. 
- **Mutations reuse existing admin-gated CRUD** (no new write surface): create/edit/delete login → `/api/users` (auth.js, chunk 02); create staff → `/api/staff` (chunk TBD); link → `PUT /api/users/:id {staff_id}`. The People UI (`people.html`, chunk 05/15) composes these.
- The "Add person" convenience (create login + optional staff in one step) lives in the frontend, calling those endpoints in sequence.

## Notes / flags
- This is the **unified-layer approach (P2 decision)** — the two tables stay separate, linked by `staff_id`; this endpoint + the UI present them as one "person." Genuine System F groundwork without a risky schema merge.
- No pagination — fine at ~12–50 people; revisit only at real scale.
- `staff`-only rows have no role/login; to grant access, admin creates a user + links `staff_id`.
- Clean, minimal, correct. No issues found.

## Reapproach-if
- Chunk for `routes/staff.js`: confirm the `staff` table shape + `/api/staff` CRUD that this leans on.
- Chunk 05/15 (people.html): confirm the UI's add/edit/delete flows call `/api/users` + `/api/staff` as documented (verify user-facing — the live test already passed 5/5 per the CEO).

---
## `routes/staff.js` (169 ln) — the `staff` table backend
- **`staff` is intentionally LEAN: id, name, active, created_at. NO rate** — rate lives on the job/project (one employee bills at different rates by work category). So `staff` = just a billable-name entity; `users` carries identity/login/role.
- `GET /api/staff` (auth, active-only — feeds time-entry dropdowns everywhere) · `GET /api/staff/all` (admin, incl inactive) · `POST` (admin; `ON CONFLICT (name) DO UPDATE active=true` — name unique) · `PUT /:id` (admin; rename/toggle active) · **`DELETE /:id`** soft default; `?hard=1` ONLY if zero time_entries (**refuses 409 if referenced — protects the billing audit trail**); `?preview=1` returns the time-entry count. Broadcasts SSE `staff_added/updated/deleted` to admin + team channels.
- → **Contrast with O14:** staff hard-delete *protects* hours; the SA hard-delete does NOT. Reinforces the O14 fix.

## `public/people.html` (526 ln) — the LIVE operations People page
Self-contained HTML + inline vanilla JS (project pattern) + `app_nav.js` rail (`data-active="people"`). Loads `/api/people` (merged roster) + `/api/hours/summary` (per-staff hours). Table: Name (+@username or "no login" pill) · Role · Team(s) · Status · Hours · Edit / training-link.
- **Add/Edit modal = the unified surface:** full name, username (immutable once set), role (8 roles), email, password (min 10), team checkboxes (design/permitting/construction), "Track hours" toggle (creates a `staff` row), Active toggle.
- **Mutations compose existing endpoints (as designed):** ADD → `POST /api/users` → optional `POST /api/staff` → `PUT /api/users/:id {staff_id}` link. EDIT → `PUT /api/users/:id`. DELETE → `DELETE /api/users/:id` (soft if active; `?hard=1` if already inactive — "delete again to remove permanently"). Staff-only rows → "Add login for <staff>" links the existing staff_id. Training link → `/training-admin.html?user=<id>`.
- **⚠ Flags:** (1) **delete uses `confirm()` pop-ups — against Carter's no-pop-up / optimistic+undo principle** (minor UX fix; the rest of the app uses the undo bar). (2) **Role list is HARD-CODED in JS** (`ROLES` array) duplicating `auth.VALID_ROLES` — two places to maintain (DRY/D013). (3) password hint "min 10" matches `/api/users` but `/api/auth/register` allows 8 (chunk-02 inconsistency surfaces in UI copy too).
- Otherwise clean, matches the design + the CEO's 5/5 live test. **Chunk 04 = ✅** (people.js + staff.js + people.html). admin_users.js (legacy admin modal, superseded by this) → map in chunk 16 with admin.html.
