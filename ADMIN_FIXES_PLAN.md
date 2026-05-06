# ADMIN_FIXES_PLAN.md — owner-flagged 2026-05-06

> Eight issues raised by owner during the splice-matrix branch session.
> Captured here so we don't lose the list mid-fix and so the next session
> can pick up cleanly. Splice-matrix RESUME HERE marker stays in
> SPLICE_BUILD_PLAN.md untouched.
>
> Working branch: `claude/splice-matrix-railway-setup-IIG3Q` (per the
> session brief — admin fixes piggyback on the same branch).

---

## Order of attack

Low-risk first, high-risk last. Each item is its own commit so reverts
are surgical.

| # | Issue | Risk | Status |
|---|---|---|---|
| 1 | Project edit modal doesn't pre-fill existing values | Low | pending |
| 5 | Hours must always be 0.25-aligned, NO rounding ever | Low | pending |
| 8 | Invoice print: infer job from batched projects (no UI to set today) | Low | pending |
| 2 | CSV importer doesn't assign Inspection job to Inspection projects | Med | pending |
| 4 | AI-created Inspection tree drops service area + WO# from children | Med | pending |
| 7 | Logo: AI stripping Launch logo from invoice templates; needs stored asset | Med | pending |
| 3 | Manual `is_rollup` flag — UI + AI tool support | High | pending |
| 6 | Rename Inspection team → Construction (rename + data + paths) | High | pending |

---

## Per-issue notes

### 1. Project edit modal pre-fill

**Symptom:** owner builds a tree with the AI, opens a project, the modal
clears the name and resets the fields.

**Likely culprit:** `openProjectModal()` or `editProject()` in
`public/index.html`. Pre-fill might key off the wrong project id, or
the field-gating cascade (program/contract/SA/job) might fire AFTER
the fields are pre-filled and clobber them with default state.

**Don't touch:** the program-vs-client gating logic; it's load-bearing
post-Path B.

### 5. Hours .25-increment

**Symptom:** "NO ROUNDING EVER!" — values must be 0.25-aligned but
without lossy `Math.round` coercions.

**Suspect locations:**
- `server.js#calcPermittingHours` uses `Math.round(totalHours*4)/4` —
  that's snap-to-0.25 which IS what we want for permitting because
  the engine multiplies miles × hr/mile. Keep.
- `routes/hours_csv.js` parsing — likely place that strips precision
  during CSV ingest.
- `routes/time_entries.js` validation on POST/PUT.
- Frontend display formatters in `public/js/hours_tab.js`.

**Rule for fix:** stored hours must be exactly representable on a
0.25 grid. If input isn't aligned, round HALF-UP to nearest 0.25
(don't truncate, don't floor — the owner means "no LOSSY rounding,"
not "no snap"). Display values always show what was stored.

### 8. Invoice print no-job

**Symptom:** "no job attached to the project" on invoice print, but no
UI to add a job. Owner says "I will never bill 2 different project
jobs together."

**Plan:** when invoice generation needs a job, pull it from the
projects in the batch. If the batch has projects with different
job_ids, that's an error; return a clear message. Otherwise infer
from the (single) job_id.

**File:** `routes/invoices.js`, `invoice_generator.js`,
`routes/billing.js`.

### 2. CSV importer assigns wrong job

**Symptom:** Hours tab shows "Other" for entries the CSV importer
brought in, but the timecard shows "Inspection". AI assigns correctly
through the `log_hours` tool path; CSV doesn't.

**File:** `routes/hours_csv.js#csv-commit`. The committer is likely
defaulting `job_title` to the CSV field rather than reading the
project's `job_id`. The frontend Hours tab probably groups by
`job_title` text whereas the timecard shows the linked job.

**Fix:** at commit time, if the project has a `job_id`, the time entry
should adopt the job — set `job_id` on the row, plus `job_title` to
the matching job's name for display consistency.

### 4. AI Inspection tree drops SA + WO#

**Symptom:** AI made a nested tree: Contract → WO → Inspection
(child). Children all show "Inspection" name with no service area /
WO# attached.

**File:** `routes/ai.js#executeTool` `create_project` /
`bulk_create_projects` cases. Likely the children's
`work_order_number` and concentrator inheritance isn't kicking in
when the parent is a rollup container. Path B established that
program is auto-derived from the EC; service_area / WO# inheritance
should follow the same pattern.

**Fix:** in bulk_create_projects's `parent_local_id` resolver,
inherit `concentrator_id` and `work_order_number` from parent when
the child doesn't set its own. Also: when creating an Inspection
child, the AI's tool input should set the work_order_number the
parent has, OR we inherit it server-side from the parent project.

Server-side inheritance is safer.

### 7. Launch logo as stored asset

**Symptom:** AI invoice template upload removed the Launch logo and
replaced with text "Launch Fiber Services".

**File:** `invoice_template_engine.js`, `routes/invoice_templates.js`.

**Plan:**
- Store a canonical `public/img/launch_logo.png` (probably already
  exists — owner's brand).
- Teach the AI tool that processes invoice templates: when the
  uploaded reference PDF contains a "Launch Fiber Services" logo
  (text-recognized via Anthropic vision), the rendered HTML
  template should reference `<img src="/img/launch_logo.png">`,
  NOT inline text.
- This is mostly a system-prompt and a template-post-processing
  guard.

### 3. Manual `is_rollup` flag

**Symptom:** owner wants to mark a project as a rollup (organize-only,
no traits). AI also struggles when a rollup is named after a job
(picks the job by name instead of the rollup container).

**Schema:** `projects.is_rollup BOOLEAN` already exists per the
PROJECT_NORTH_STAR Path B notes ("filters out is_rollup=TRUE
containers"). The flag is set today by `ensureRollupChain()` in
`portal_module.js` when a parent is implied. We need to:
- Expose the flag in the UI: project edit modal gets an "Organize-only
  (rollup)" checkbox.
- Teach AI: `create_project` and `bulk_create_projects` accept an
  `is_rollup` boolean. System prompt explicitly explains the
  difference between a rollup container and a real job-bearing
  project.
- When `is_rollup=TRUE`: blank out / ignore job_id, billing_rate,
  footage, expected_revenue. Validation refuses time entries
  against a rollup.

### 6. Inspection team → Construction

**Risk:** highest. Rename touches:
- `jobs.team` enum values: 'inspection' → 'construction'
- `staff.role` values: 'inspection_manager' / 'inspection_engineer' →
  'construction_manager' / 'construction_engineer' (if those exist)
- Server-side role gating in `server.js` portal-mode enforcement
- Client-side role labels in admin + portal HTMLs
- `routes/inspection.js` route name (the file name itself can stay;
  it's documented as "RUS-program scope view," not team-bound)
- The "Time Audit" / "Inspection" labels in the admin index.html
- Migration for the data update

**Approach:**
- Migration `0009_rename_inspection_to_construction.sql` updating
  jobs.team + staff.role values.
- Search-replace on UI labels carefully (don't touch the
  routes/inspection.js filename or the program='rus' invoice gate;
  those are misleadingly named but load-bearing).
- Add a compat shim: during the rollover, accept both
  'inspection' and 'construction' as the same team in role-checks
  so a stale JWT still works until next login.

---

## Things NOT to touch during admin fixes

- Splice matrix files (`routes/splice.js`, `public/splice.html`,
  `routes/_splice_validation.js`, `migrations/0007_*`,
  `migrations/0008_*`, `tests/splice*.test.js`,
  `SPLICE_BUILD_PLAN.md`).
- The PSC RUS PDF gate's program='rus' filter (load-bearing per Path B).
- `is_rus` column references — already removed in migration 0003;
  if re-adding for any reason, that's regressing.
- The existing rollup filter in count/list queries (filters
  `is_rollup=TRUE` out of "Active Projects" tile counts).

---

*Last updated 2026-05-06 — admin fixes block opened mid-session.*
