# SPEC — Mini-jobs: the employee job board, checklists, and the per-job clock

> ✔ **RATIFIED** — Carter, 2026-07-13 (Partner spec session, *22). Sequencing per Carter: **behind wave-2 start** (T09 authors first; training stays top priority) and **revealed with desktop D2** (built as ops-cluster web pages — the desktop main window wraps them; the CAD-close prompt bolts on at D2).
> Raw material: `specs/ideas/desktop-offline-mobile.md` (mini-jobs, low-key time, leaderboard rulings).

## Carter's model (verbatim, the design's source)
> "Jobs are basically like a board that you pick from, you start the job and inherit all the mini jobs but mini jobs are still abled to be picked up from other employees. Maybe a job board page would be helpful? or when you click an existing or add a new project you pick your job and it populates in a place where others can pick a different job and someone else can do mini jobs. The whole time each persons time on that job is tracked, meaning the clock on and off from that job. There needs to be a way we prevent that be being gamed though and also how people who work on multiple tasks can be tracked properly"

## The model
1. **The Job Board page** — open jobs (grouped county-first, law §7) sit claimable. **Visible to ALL staff (Carter 2026-07-13): no team scoping — design and permitting float between each other freely.** An employee **picks up a job** → becomes its owner, inherits all its mini-jobs onto **My Work**. Jobs can also be picked at creation (add project → pick your job).
2. **Mini-jobs stay individually claimable** — a teammate can grab a mini-job inside someone else's job (its checkoff + time credit go to whoever did it). The job owner sees who's on what.
3. **Checklists from templates** — each job type auto-carries its template steps (design → prelim draw → final → BOM; inspection its own set). **Admin settings UI** (Carter's pick): add/edit/reorder steps per job type — data, not code. Admin can add one-off mini-jobs to any job.
4. **The per-job clock** — you clock ON to a job when you start working it, OFF when you stop. Time segments attribute to that job (and the person) automatically — L-004 attribution made live. Checking the LAST open mini-job suggests (never auto-flips) marking the job complete; completed job → ready-to-bill signal (feeds the billing-status glance).

## Anti-gaming + multi-task tracking (Carter's two named risks)
- **Manager overrides (Carter 2026-07-13):** managers can void/change their direct reports' time segments (hours.edit_subordinates); admins anyone's (hours.edit_all) — change-logged + the owner is notified (see specs/roles-capabilities.md). Adding mini-jobs = minijobs.add: managers by default, individually grantable to anyone.
- **One active clock per person.** Clocking onto job B automatically clocks you off job A — time can never accrue twice. Switching jobs all day just produces segments; segments sum per job.
- **Quarter-hour grain** (L-014) — segments snap; no seconds theater.
- **Day-end draft-and-confirm** (the standing low-key ruling): the day's segments render as a draft split ("4.25h SA-12, 2.5h SA-9 — adjust?"); the employee corrects and confirms. Manual correction is first-class (forgot to switch ≠ lost truth). Confirmed day = the hours record.
- **Forgotten-clock guards:** auto-clock-off at a configurable daily boundary + an "still on SA-12 — 6h?" nudge; sessions over a threshold (config) flag to admin, like the training >45-min flag.
- **Cross-signal sanity (flags, never verdicts):** long clock time with zero checkoffs/file activity → anomaly flag; checkoffs with near-zero time → flag. Both feed the 2.6 confirm-loop anomaly queue, admin-visible only.
- **Privacy + Goodhart lines hold:** individual days visible to self + admin/director only; checkoffs/time feed the admin-only leaderboard (2.9) and that feed stays unannounced; nothing is peer-visible.

## Schema (keystone, under jobs)
- `mini_jobs`: id · job_id (FK service_area_jobs) · title · sort · status(open/complete) · claimed_by (nullable — defaults to job owner) · completed_by/completed_at · template_step_id (nullable, provenance) .
- `mini_job_templates`: id · job_type/discipline · title · sort · active.
- `job_claims`: job_id · user_id · claimed_at (owner history).
- `job_time_segments`: id · user_id · job_id · start_ts · end_ts (nullable while running) · source(clock/manual) · confirmed_day (nullable). ONE running segment per user (partial unique index on end_ts IS NULL).
- Templates instantiate at job creation; template edits don't retro-edit existing jobs.

## Scope fence
- **IN:** the Job Board page + My Work page (ops cluster, app-shell design system, both themes) · claim/checkoff flows · clock on/off + segments + day-end draft-confirm · admin template settings UI · anomaly flags (queue only) · ready-to-bill signal on all-steps-complete.
- **OUT:** the CAD-close prompt (D2 bolts it on) · time-per-mini-job drafting refinements + Workforce CSV + 1099 daily card (2.6 — this spec's clock is the ENGINEER in-tool flow; 2.6's spec session must reconcile with these segments as an input, not a rebuild) · leaderboard UI (2.9 consumes) · pay/cost math (none here — hard rule 8 untouched; segments are hours, never $).

## Decomposition guidance (Registrar)
Sequence: **after wave-2's first topic package starts** (Carter's priority call) — then M1 → M2:
- **M1 (schema + board):** migrations · Job Board + My Work pages · claim/checkoff · template settings UI.
- **M2 (clock):** segments + one-active-clock rule · day-end draft-confirm · guards + anomaly flags.
- Reveal: pages ship dark in the cluster nav until D2's desktop reveal OR Carter flips earlier — his call at merge (visibility = Carter, always).

## VO lenses
Claim races (two employees pick the same job/mini-job — earliest wins, loser sees a clean message) · one-running-segment invariant under concurrency · segments never editable except via the owner's confirm flow or admin (change-logged) · no $ anywhere in these surfaces · templates are data (no hardcoded step lists) · county-first grouping on the board.
