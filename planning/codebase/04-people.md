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
