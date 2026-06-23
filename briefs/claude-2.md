# Claude 2 — Contractor timeclock (Phase 5)

**Status:** MERGED to main 2026-06-23 (CEO reviewed). Works today for staff-role field users.
**Branch:** `claude-2/contractor-timeclock`
**Read first:** `CLAUDE.md`, `ROADMAP.md` (Phase 5), `briefs/README.md`.

> **CEO follow-ups (gated on Phase 3 — contractor accounts, NOT this brief):** the reused
> `POST /api/service-area-jobs/:id/time-entries` is `requireAuth(STAFF_ROLES)` and authorizes by
> *role*, not job-ownership. When contractors get real accounts, two changes land together:
> (1) admit the `contractor` role to that endpoint, and (2) add a job-assignment/ownership check so
> a contractor can only log against jobs assigned to them (IDOR guard). Both are CEO/core scope.
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
