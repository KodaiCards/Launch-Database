# Session Handoff — 2026-05-04 (afternoon update)

For the next Claude (or human) picking up. Read this first; then
`HANDOFF.md` for architecture and `NEXT_STEPS.md` for the long-term
roadmap. The PR-#9 handoff at the top of this file got rewritten —
its contents are still relevant but are now folded into the
"Architectural state" section below.

---

## TL;DR — what state things are in

- **5 commits landed on `main` this afternoon** (e604698, 38bd984,
  9356a76, 74374f4, 0a51b09). All push directly to main; Railway
  auto-deploys all four services.
- **CI is still broken** but in a different way than before. Latest
  in-progress run is `25329939014`. The schema-init fix (74374f4)
  works — server boots, 3 sanity tests pass — but `npm test` then
  hangs for 29 minutes until the 30-min job timeout. The concurrency
  fix (0a51b09) is in flight; if it doesn't pass, the next step is
  isolating WHICH test hangs. See "CI hang — diagnosed but not
  fixed" below.
- **Live design portal works**. Logged in as admin, clicked
  "+ Add Project" (the button that was throwing the SyntaxError
  before this session), filled the modal, saved a project. Pipeline
  rendered the new row. Stage-advance worked too. **Test data
  left behind: "Claude Smoke Test 2026-05-04" project (PSC client,
  WO# CLAUDE-SMOKE-001), currently at Started stage.** Delete it
  before doing anything else, OR continue using it as a test fixture.

---

## What landed in this session — by commit

### `e604698` — Fix portal SyntaxError + CI Playwright hang

Two unrelated fixes bundled because the user reported them together:

1. **Portal SyntaxError**: `public/design.html` had a parse-time
   bug. Commit `e1bf633` (Portal add-project cascade, last week)
   accidentally deleted the `function jobChanged(){` declaration
   line but left the function body behind. The orphan `return;` at
   top-level made the entire `<script>` block fail to parse, which
   meant **every** function in that block was undefined
   (openProjectModal, loadPipeline, startPolling, …). Symptom: the
   design portal looked stuck on "Loading…", and clicking
   "+ Add Project" toasted "openProjectModal is not defined".
   Restored the declaration at design.html:951.
   permitting.html / timeclock.html / customer.html were all clean.
2. **CI workflow hardening**: `npx playwright install --with-deps`
   was hanging because apt-get prompted for tzdata config with no
   noninteractive stdin. Set `DEBIAN_FRONTEND: noninteractive`,
   split the install into `install-deps` + `install` so the
   browser tarball can be cached separately, added per-step
   `timeout-minutes` (5 / 8 / 10), reverted job timeout from 2460
   min (the user's emergency workaround) to 30. Cached chromium
   via `actions/cache@v4` keyed on Playwright version.

### `38bd984` — Invoice upload error + bigger cap + upload progress + brighter tabs

Three separate user reports:

1. **Invoice template upload "Unexpected token '<'"** — a 5 MB
   reference PDF tripped multer's local cap (5 MB on this route);
   without a JSON error handler Express returned the default HTML
   500 page; frontend `await r.json()` exploded. Two fixes:
   a. Bumped the per-route cap to 50 MB
      ([routes/invoice_templates.js:49](routes/invoice_templates.js#L49)).
   b. Added a global API error handler at
      `app.use('/api', err => json)` in
      [server.js](server.js) — converts multer / route errors on
      every /api endpoint to `{error}` JSON. LIMIT_FILE_SIZE gets
      a friendly message naming the actual cap. **This is the
      safety net for every multer endpoint** (permits, design docs,
      AI upload, hours CSV — all had the same latent HTML-error
      ambush).
2. **Tab text contrast** — bumped `.nav-tab` color from
   `rgba(255,255,255,.92)` → `#fff` and strengthened text-shadow
   from .18 → .35. Applied to admin index.html + design.html +
   permitting.html. timeclock + customer don't have a blue strip.
3. **Upload progress** — new `apiUpload(url, formData, { onProgress
   })` helper in [public/js/api.js](public/js/api.js). Wraps
   XMLHttpRequest because fetch can't surface upload progress.
   Wired to invoice template upload, permit doc upload, design doc
   upload. Each modal got a progress bar element. On 100% the bar
   stays full and the label switches to "Saving on server…" or
   "Analyzing… (15-30s)" so the user knows we're past upload but
   server's still working.

### `9356a76` — CSV match key includes job

Owner-confirmed policy: CSV import's "would modify" preview now
matches on **staff + project + entry_date + job_title** (normalized
trim + collapse-whitespace + lowercase). Two entries with different
jobs on the same day for the same staff/project are now treated as
distinct entries, not a "modify". Added one new smoke test for the
different-job-same-day case in
[tests/csv_import.test.js](tests/csv_import.test.js). Updated the
in-app match-preview blurb in the CSV wizard to spell out the new
policy.

### `74374f4` — Resilient initSchema (split + per-statement + post-auth retry)

Diagnosed CI hang root cause from the previous run (25321945720):
schema bootstrap failed early with `relation "jobs" does not
exist`. `pool.query(schema_sql)` runs the entire file as a single
implicit transaction; PG aborts on first error. **schema.sql has
real forward-FK references** that it relied on production already
having the tables for — a fresh DB hits the abort. Specifically:

- Line 292: `billing_batches.job_id REFERENCES jobs(id)` — jobs is
  CREATEd at line 392 in the same file.
- Line 297: `billing_batches.created_by_user_id REFERENCES users(id)`
  — users is CREATEd by `bootstrapAuthSchema` in auth.js, which
  runs AFTER initSchema.
- Line 857 / 867: invoice_templates has both refs.
- Line 884: customer_clients has the users(id) ref.

Fix: rewrite `initSchema` in [db.js](db.js) to split into
individual statements and run each in its own try/catch.

- New `splitStatements()` handles single-quoted strings
  (PG-doubled-apostrophe escape), double-quoted identifiers, line
  comments, block comments, and dollar-quoted blocks (`$$` and
  `$tag$`). Exported for testing.
- Two passes over schema.sql resolve forward refs WITHIN the file
  (jobs CREATE happens in pass 1; billing_batches succeeds in
  pass 2 once jobs exists).
- Statements still failing after pass 2 (the user-FK ones) get
  stashed on `pool._deferredStatements`. server.js calls a new
  `applyDeferredSchemaStatements()` AFTER `bootstrapAuthSchema` so
  the three user-FK tables finally apply.

New test: [tests/split_statements.test.js](tests/split_statements.test.js)
— 12 cases for the splitter including a sanity pass over the real
schema.sql to verify no CREATE TABLE statements get joined.

**Confirmed working in CI run 25325341821**: server boot logs show
"82/88 statements ok; 6 deferred to post-auth bootstrap" then
"6/6 deferred statements applied". Schema is fully bootstrapped.

### `0a51b09` — Test files run serially + 3-min per-test timeout

After the schema fix landed, the next CI run booted cleanly and
passed 3 _sanity tests in 0.4s — then went silent for 29 minutes
until the 30-min job timeout cancelled it.

Hypothesis: by default `node --test` runs each test FILE in its
own worker process and runs files in parallel
(`os.availableParallelism()`). With every file's `bootTestServer()`
re-running initSchema + bootstrapV3Schema + bootstrapAuthSchema +
bootstrapTimeClockSchema in parallel, eight workers all pile
ALTER TABLE statements onto the same eight tables. ACCESS
EXCLUSIVE locks serialize them, and the per-statement queries in
the new initSchema multiply that. `--test-concurrency=1` removes
parallelism as a variable.

Also added `--test-timeout=180000` (3 min per test) so a single
hung test bails out instead of eating the whole 30-min job
budget — gives a useful error pointing at the offending test
instead of the silent timeout we had.

**Status of run 25329939014 at handoff time: still in_progress at
22m48s**. If it passes, we're done. If it times out again at
30m, the hang is in a single test — the per-test timeout will
print its name. See "CI hang — diagnosed but not fixed" below for
debugging steps.

---

## CI hang — diagnosed but not fixed

Symptom: `_sanity.test.js` 3 tests pass in 0.4s, then dead silence
until the job-level 30-min timeout. Pattern is consistent across
multiple runs. Schema bootstrap is NOT the cause (verified — the
"Launch Fiber Services running on port" message means start()
returned).

Hypotheses ranked by likelihood:

1. **Parallel boot lock contention** — multiple test workers all
   running ALTER TABLE in parallel deadlock or serialize so badly
   that bootstrap takes minutes. Tested in 0a51b09 by forcing
   concurrency=1. **If 0a51b09 makes it green, this was it.**
2. **A specific test hangs on an unmocked Anthropic call** —
   `tests/ai_upload.test.js` uses `bootTestServer` which boots
   the AI route; if the chat handler somehow runs and waits on
   the SDK without an API key set, it could hang forever. (CI
   doesn't set ANTHROPIC_API_KEY — see env block in
   .github/workflows/test.yml.) The `--test-timeout=180000` flag
   in 0a51b09 should bail this out and print the test name so we
   can localize.
3. **`pool.end()` hangs** — the new `applyDeferredSchemaStatements`
   added a third schema-bootstrap stage between auth and
   timeclock; if any pool client got into a stuck state during
   those, `await pool.end()` in `close()` could deadlock. Less
   likely but worth checking if (1) and (2) don't pan out.

Next debugging step if 0a51b09 still hangs:

```
# Get the latest run ID
gh run list --branch main --limit 1 --json databaseId --jq '.[0].databaseId'
# Pull the log
gh run view --log --job=$(gh run list --branch main --limit 1 --json jobs --jq '.[0].jobs[0].databaseId') | grep -E "Subtest:|ok |not ok |timeout"
```

The per-test timeout should now print which test is the culprit.
Then look at that test file directly. If you're stuck, comment
out tests files one at a time (rename `.test.js` → `.test.js.skip`
in package.json glob) until it passes — bisection.

---

## Live verification — what's been confirmed working

These were tested via Claude in Chrome on the LIVE Railway deploy
during this session:

- **Design portal / Sign in** with `admin / American1Supporter`
  → lands on `https://launchfiberdesignportal.xyz/` with an empty
  Design Pipeline.
- **"+ Add Project" button** → modal opens. Console clean. The
  SyntaxError fix is live.
- **Cascading dropdowns**: pick PSC → Contract dropdown
  populates with 515-3 / 515-4 / 515-5; Project Type appears with
  BAU / GF(R) / Other / RUS; Work Order Number field appears.
- **Save Project** → "Claude Smoke Test 2026-05-04" appears in
  the pipeline. Counters update (Potential 0→1, then Started 0→1
  after advance).
- **Stage advance** (rightmost double-arrow) → moves from
  Potential to Started. Pipeline visualization updates.

**Test artifacts to clean up or reuse:**
- Project: "Claude Smoke Test 2026-05-04"
  (client=PSC, WO=CLAUDE-SMOKE-001, stage=Started)
- The `CLAUDE-SMOKE-001` WO# probably also created a Service Area
  rollup parent on PSC (the auto-nesting behavior). Check
  Settings or the project tree before deleting.

---

## Live verification — NOT covered yet (was working through this list)

The user gave carte blanche ("change data as needed there's
nothing here other than tests") and authorized:

- gh CLI: authenticated as KodaiCards (`gh auth status` → Logged in,
  gist+read:org+repo scopes).
- Claude in Chrome extension: connected (Browser 1, deviceId
  `8de96e27-d193-49cf-89df-fb78f6018119`). Site permissions granted
  for all 4 portal domains (or at least design — others were not
  yet exercised).
- Admin login: `admin / American1Supporter`.

Punch list, in the order I was working through it:

1. ~~Design portal — Add Project flow~~ — DONE.
2. ~~Design portal — stage advance~~ — DONE.
3. **Design portal — edit project, delete project, regress stage,
   submit permit (the "Submit Permits" tab loader).**
4. **Admin app** at `https://launchfiberadminportal.xyz/` —
   verify: Projects tab tree expand persists across polling tick,
   Hours tab tile drilldown opens, calendar grid click on populated
   day opens detail modal, Settings → Users → "+ New staff" inline
   panel, Account dropdown opens.
5. **Invoice template upload** — pick a PDF >5 MB and verify the
   progress bar fills, then "Analyzing…" label appears, then the
   row appears in the templates list. Then try a >50 MB PDF and
   verify the JSON error message comes back as a toast (no raw
   HTML).
6. **Permit doc upload + progress bar** — open any permit's
   paperclip, attach a file, see the bar fill.
7. **CSV import preview** — upload a CSV with a row that matches
   an existing time entry on staff+project+date but a different
   job title; classification should be "new" not "modify".
8. **Permitting portal** at `https://launchfiberpermittingportal.xyz/`
   — "+ Add Project" + stage advance + paperclip upload.
9. **Timeclock portal** at `https://launchfibertimeclock.xyz/`
   — clock in / out, switch project.
10. **Customer portal** at `https://launchfibercustomerportal.xyz/`
    (if it exists — it was a future feature in NEXT_STEPS;
    public/customer.html exists but the portal subdomain may not
    be deployed).

---

## Architectural state (rolled forward from earlier handoff)

These are unchanged from the morning handoff — included here so
this file stands alone.

### Branch state
- All work pushed directly to `main`. No PRs.
- worktrees disabled (memory: `feedback_no_worktrees.md`).
- Working tree clean as of handoff.

### File layout

```
public/index.html              ~6750 lines admin app
public/design.html             design portal
public/permitting.html         permitting portal
public/timeclock.html          time clock portal
public/customer.html           customer portal (UC placeholder)
public/login.html              shared login

public/js/api.js               api() + apiUpload() + deleteProjectDoc
public/js/overlay_modal.js     openOverlayModal / closeOverlayModal
public/js/tree_state.js        makeTreeState + makeTreeToggle
public/js/* (~25 modules)      one per tab loader

routes/ai.js                   ~1772 lines, biggest route module
routes/hours_csv.js            CSV import (validate + commit)
routes/_csv_stage.js           shared csvStage Map
routes/_helpers.js             updateProjectHours, undo, financials
routes/* (~28 modules)         the rest of the API surface

server.js                      ~1010 lines — wiring + v3 bootstrap
schema.sql                     base schema (canonical-ish; v3 ALTERs in
                               server.js still authoritative for the
                               columns added at boot)
db.js                          pool + initSchema + splitStatements +
                               applyDeferredSchemaStatements (NEW)
auth.js                        JWT + bootstrapAuthSchema
```

### Critical owner preferences (auto-loaded from memory)
- **NO worktrees** — `feedback_no_worktrees.md`.
- **NO email digest** — owner killed in `cff591c`.
- **PSC invoice template ≠ non-RUS template** —
  `reference_invoice_non_rus_formats.md`.
- **Deferred (don't start without explicit OK):**
  - Customer self-service portal — `feature_customer_portal.md`
  - Client progress view — `feature_client_progress_view.md`
  - Inspection revenue projection refinements —
    `feature_inspection_revenue_projection.md`

### Communication style
Owner drops bullet lists of issues, says "go", expects autonomy.
Bug fixes first. Don't extend cleanup unprompted. They'll
spot-check; if something's wrong they'll say so. "Take breaks to
check yourself, keep good notes for yourself."

---

## How to start the next session

```bash
# 1. Sync
git pull origin main

# 2. Verify state
git status                     # should be clean
git log --oneline -8           # last 5 should match the commits in this doc

# 3. Check the in-flight CI run
"/c/Program Files/GitHub CLI/gh.exe" run list --branch main --limit 3

# 4. If CI is green, RESUME the live verification list above.
#    If CI is red, see "CI hang — diagnosed but not fixed" above.
```

The user is patient with the work but expects you to keep moving.
If a test verification reveals a bug, fix-and-push-and-keep-going.
The `Claude Smoke Test 2026-05-04` project on PSC is your
expendable test fixture — feel free to advance it through stages,
attach docs to it, then delete it when you're done. The user knows
it's there.

If you hit a permission_required error from the Chrome extension,
the user knows what to do — they'll re-authorize.
