# Session Handoff — 2026-05-04 (evening update)

For the next Claude (or human) picking up. Read this top-to-bottom;
then skim `HANDOFF.md` (architecture) and `NEXT_STEPS.md` (long-term
roadmap). This file replaces the previous handoff (afternoon edition);
its salient content is folded into "Architectural state" below.

---

## TL;DR — what state things are in

- **CI is GREEN.** 8 commits landed this evening fixing the cascade
  of issues that kept CI red for the whole afternoon. Latest run on
  main: [25334405831](https://github.com/KodaiCards/Launch-Database/actions/runs/25334405831)
  → success in 2m27s. Was hanging at 25–27 min on every prior run.
- **All 4 Railway services auto-deploy from `main`.** No PRs in this
  workflow — push direct.
- **Live verification** so far is design portal only. Admin / permitting
  / timeclock / customer portals are blocked on a Chrome-extension
  permission issue (see "Resuming live UI testing" below).
- **Test fixture left on PSC**: `Claude Smoke Test 2026-05-04`,
  WO# `CLAUDE-SMOKE-001`, currently at **Started** stage. Notes field
  has `"Edited by Claude debug 2026-05-04 PM"` from the edit-flow test.
  Safe to delete or keep using.

---

## What landed this evening — by commit

All 8 commits push directly to `main`. Railway redeploys on each.

### `79920e7` — test: fix teardown hang + AI upload key + CSV future-date issues

Three independent test bugs in one commit because they were all surfaced
by the same CI run.

1. **`tests/_helpers.js` close() hung 180s/file**.
   `_server.close(callback)` waits for all open keep-alive sockets to
   drain. Server's `keepAliveTimeout` is `30 * 60 * 1000` (set in
   `server.js` for multi-GB uploads). `fetch()` reuses keep-alive
   sockets between requests, so close() never resolved until the per-
   test 180s timeout fired. Fix: call `_server.closeAllConnections()`
   (Node 18.2+) alongside close() to forcibly destroy idle sockets.
   This was *necessary but insufficient* — the actual cascade is in
   commit `e58f885` below.

2. **`tests/ai_upload.test.js` asserted wrong key**. Test read `up.id`
   but `routes/ai.js`'s POST `/api/ai/upload` returns `upload_id`. The
   admin frontend in `public/index.html:6324` keys off
   `pendingFileData.upload_id`, so `upload_id` is the canonical
   field — the test was wrong, not the route. Fixed both the assertion
   and the GET URL that re-reads via `up.id`.

3. **`tests/csv_import.test.js` "modify" + "different-job" tests used
   future dates** (`2026-06-01`, `2026-07-01`). `routes/hours_csv.js`
   rejects future dates as `"date is in the future"` invalid rows
   *before* they reach the classifier. Result: validRows was empty,
   `would_modify` and `would_add` both stayed at 0. Moved both into
   2026-04 (today is 2026-05-04). Other csv_import tests already use
   2026-04 / 2026-05-01-02 dates and pass.

### `e58f885` — fix: ai.js cleanup interval was missing .unref(); split_statements regex

Two issues. The first one was the actual cause of the 25-minute CI
hangs — the closeAllConnections fix in `79920e7` shaved nothing off
because there was a different timer keeping the event loop alive.

1. **`routes/ai.js:1431` setInterval missed `.unref()`.** It cleans
   up the in-memory upload store every 5 minutes. Its sibling at
   line 1387 (the `_pendingApprovals` cleanup) correctly calls
   `.unref()`; this one was missed. Without unref, `pool.end()` and
   `server.close()` resolve fine but the worker process never exits
   because the timer holds the event loop alive. node:test's per-test
   180s timeout then fires on every test FILE wrapper. Total:
   180s × 9 files × concurrency=1 ≈ 27 min — exact match to observed
   CI duration. **Effect of fix**: backend tests went 25m → 17 sec.

2. **`tests/split_statements.test.js:53` line-comment regex.** Test
   asserted `assert.match(out[1], /^SELECT 2/)` — but the leading
   line comment `-- ; not a split` is preserved in front of `SELECT 2`
   (and PG accepts comments before a statement, so that's OK). The
   block-comment sibling test on line 59 already used `/SELECT 2/`
   without the `^` anchor; removed the anchor here for consistency.

### `b33b6d8` — fix: login page assets must be public; /api/* unknown returns 404 JSON

Once backend tests went green, the browser smoke tests
(`tests/browser/*.spec.js`) finally got to run end-to-end for the
first time in days. Both failed with 2× `Unexpected token '<'`
pageerrors each. Two related bugs:

1. **Login page assets were not in the auth-public allowlist.**
   `public/login.html` references `/toast.js`, `/keyboard.js`,
   `/app-shell.css`. The auth middleware in `server.js`
   (`pageRequiresAuth()`) only whitelisted `/login`, `/api/auth/*`,
   and `/uploads/*`. For an unauthenticated browser — including the
   playwright fixture — each asset 302'd to `/login`. The browser
   then tried to PARSE the redirected HTML response as a `<script>`
   body and threw `SyntaxError: Unexpected token '<'`. Two errors =
   the two JS files; CSS load failures don't fire pageerror, which
   is why `/app-shell.css` didn't add a third.

   Fix: whitelist `/toast.js`, `/keyboard.js`, `/app-shell.css`,
   `/favicon.ico` in `pageRequiresAuth()`.

2. **The SPA catch-all `app.get('*')` swallowed unmatched `/api/*`
   paths**, returning the admin index.html with status 200. Any
   frontend doing `r.json()` on that response would also throw
   `Unexpected token '<'`, masking real 404s. Added a `/api` 404
   JSON handler immediately before the SPA fallback so unknown API
   paths surface as `{error: "Not found", path: ...}` instead of
   HTML. Defense-in-depth — this didn't show up as a specific test
   failure but would have masked any future typo'd endpoint.

### `01f57ff` — test: regression coverage for login-asset 302 + /api 404 fixes

Both fixes from `b33b6d8` lacked test coverage. Added two cases to
`tests/_sanity.test.js`:

- `login-page static assets are reachable without auth` — fetches
  `/toast.js`, `/keyboard.js`, `/app-shell.css` with no auth and
  asserts 200 + correct Content-Type. If the auth middleware
  regresses and 302s an asset, the assertion catches it before the
  browser smoke tests have to.
- `unknown /api/* path returns JSON 404, not the SPA HTML` —
  GETs a definitely-not-real route and asserts `404` + JSON content
  type + `{error: "Not found"}`.

---

## CI timeline (one of these saves you 30 minutes if you hit a similar hang)

| run | head | duration | result |
|---|---|---|---|
| 25329939014 | `0a51b09` (prior session, --test-concurrency=1) | 25m4s | timeout — every test file wrapper hit 180s |
| 25331523711 | `79920e7` (closeAllConnections only) | 25m25s | same hang — closeAllConnections wasn't enough |
| 25333821285 | `e58f885` (added unref) | 2m13s | backend GREEN in 17s; **browser tests fail with pageerrors** |
| 25334405831 | `b33b6d8` (login-asset + /api 404) | 2m27s | **GREEN end-to-end** |
| (after 01f57ff) | `01f57ff` (regression tests) | ~2m | GREEN |

The single most important data point: when each test FILE in `node --test`
hits its per-test timeout despite all subtests passing, look for an
unref'd `setInterval`/`setTimeout` somewhere in the production code
that gets imported by the test boot.

---

## Resuming live UI testing — Chrome extension permissions

The "Claude in Chrome" MCP extension authorizes per-domain. The user
authorized `launchfiberdesignportal.xyz` in the prior session via the
extension's UI; this session's Claude (me) was never able to get the
admin / permitting / timeclock / customer portals authorized despite
multiple attempts. The user verbally said "you have my permission to
access the sites within the group" and tried adding the tabs to a
Chrome tab group — that made the tabs *visible* to MCP (tab IDs show
up in `tabs_context_mcp`) but actions still return
`"Permission denied for this action on this domain"` because the
per-site permission is a separate layer.

**The user thinks they may have figured out how to grant the
permission before starting this new session.** Verify by trying:

```
mcp__Claude_in_Chrome__list_connected_browsers
mcp__Claude_in_Chrome__select_browser  (use the deviceId from above)
mcp__Claude_in_Chrome__tabs_context_mcp  (createIfEmpty=true)
```

Then attempt a screenshot of the admin tab. If it works, the
permissions are granted and you can resume the punch list below.

If still blocked: ask the user to open the Claude extension popup
(toolbar icon) **while the active tab is on `launchfiberadminportal.xyz`** —
there's typically a per-site toggle there. The "approved sites"
settings page they showed me had a Revoke list but no obvious Add
button visible in the screenshot.

---

## Punch list — items NOT YET verified live

The order is the same as the prior session's handoff. Items 1-2 of
that list (design portal Add Project + stage advance) plus an extra
batch (edit / regress / Submit Permits / Settings tabs / dark mode)
have been verified in this session. Items below are pending.

### 3. Admin app at `https://launchfiberadminportal.xyz/`

- Projects tab: tree expand persists across the 8s polling tick
  (regression net for `makeTreeState`; `tests/browser/projects_tree_state.spec.js`
  covers this and is green, but live verify with a real-data tree)
- Hours tab tile drilldown opens
- Calendar grid click on a populated day opens the detail modal
- Settings → Users → "+ New staff" inline panel
- Account dropdown opens

### 4. Invoice template upload — happy path + over-cap

- Open admin → Invoice Templates → Upload
- Pick a PDF >5 MB → progress bar fills → "Analyzing..." label
  appears → row appears in templates list
- Then try a PDF >50 MB → JSON error toast (not raw HTML)
  This validates `38bd984`'s global API error handler.

### 5. Permit doc upload + progress bar

Open any permit's paperclip, attach a file, see the bar fill.
Same `apiUpload()` helper as invoice template upload.

### 6. CSV import preview — different-job-same-day classification

Upload a CSV with a row that matches an existing time entry on
staff+project+date but a different job title. Classification should
be "new" (not "modify"). This is the policy from `9356a76` and the
backend test in `csv_import.test.js` covers it; live-verify the
match-preview blurb in the wizard spells out the new policy.

### 7. Permitting portal at `https://launchfiberpermittingportal.xyz/`

"+ Add Project" + stage advance + paperclip upload. Same shape as
design portal flow but separate Railway service.

### 8. Timeclock portal at `https://launchfibertimeclock.xyz/`

Clock in / out, switch project.

### 9. Customer portal at `https://launchfibercustomerportal.xyz/`

If deployed. `public/customer.html` exists but the portal subdomain
may not be live — the customer portal is one of the deferred
features in the auto-memory file `feature_customer_portal.md`. Don't
build new portal capability without explicit user OK.

---

## Architectural state (rolled forward from earlier handoffs)

These are unchanged from the morning + afternoon handoffs — included
here so this file stands alone.

### Branch state
- All work pushed directly to `main`. No PRs.
- Worktrees disabled (auto-memory: `feedback_no_worktrees.md`).
- Working tree clean as of handoff.

### File layout

```
public/index.html              ~6800 lines admin app
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

server.js                      ~1020 lines — wiring + v3 bootstrap
schema.sql                     base schema (canonical-ish; v3 ALTERs in
                               server.js still authoritative for the
                               columns added at boot)
db.js                          pool + initSchema + splitStatements +
                               applyDeferredSchemaStatements
auth.js                        JWT + bootstrapAuthSchema
```

### Testing

- `npm test` — backend smoke tests (node:test). Was hanging 25 min;
  now runs in ~17 sec.
- `npm run test:browser` — playwright browser smoke tests. 2 specs:
  `psc_rus_tab.spec.js` and `projects_tree_state.spec.js`. Both pass
  after the login-asset / /api 404 fixes.
- CI: `.github/workflows/test.yml`. 30-min job timeout; per-step
  timeouts on playwright deps (5 min) and browser install (8 min) +
  browser tests (10 min).

### Known unref'd timers

Audit done this session. The 4 `setInterval` calls in production code
all now have `.unref()` (or are gated behind `skipScheduler` for
tests):

- `auth.js:68` — rate-limit bucket cleanup, `.unref()` ✓
- `automation.js:1020` — scheduler tick, only runs if `!skipScheduler`
- `routes/ai.js:1387` — pendingApprovals cleanup, `.unref()` ✓
- `routes/ai.js:1431` — uploadStore cleanup, **`.unref()` added in `e58f885`** ✓
- `routes/_csv_stage.js:22` — csvStage cleanup, `.unref()` ✓

If you add a new timer in module-load scope, **call `.unref()` on
the handle** or tests will hang again.

### Critical owner preferences (auto-loaded from memory)
- **NO worktrees** — `feedback_no_worktrees.md`.
- **NO email digest** — owner killed in `cff591c`.
- **PSC invoice template ≠ non-RUS template** — `reference_invoice_non_rus_formats.md`.
- **Deferred (don't start without explicit OK):**
  - Customer self-service portal — `feature_customer_portal.md`
  - Client progress view — `feature_client_progress_view.md`
  - Inspection revenue projection refinements — `feature_inspection_revenue_projection.md`
  - Customer portal project-level completion view — `feature_client_portal_completion_view.md`

### Communication style
Owner drops bullet lists of issues, says "go", expects autonomy.
Bug fixes first. Don't extend cleanup unprompted. They'll spot-check;
if something's wrong they'll say so. **Fix-and-push-and-keep-going**
is the working model — no PRs needed.

---

## How to start the next session

```bash
# 1. Sync
git pull origin main

# 2. Verify state
git status                     # should be clean
git log --oneline -10          # last 8 should be the commits in this doc

# 3. Confirm CI is still green
"/c/Program Files/GitHub CLI/gh.exe" run list --branch main --limit 3
```

Then:

1. **Try the Chrome extension permissions immediately.** The user
   said they may have figured out how to grant them. Confirm by:
   - `mcp__Claude_in_Chrome__list_connected_browsers`
   - `mcp__Claude_in_Chrome__select_browser` with the returned deviceId
   - `mcp__Claude_in_Chrome__tabs_context_mcp` → look for the four
     portal tabs in the available list
   - Try a screenshot on the admin tab. If it succeeds → resume
     punch list above (item 3 onward).
2. **If still blocked**: ask the user to open the Claude extension
   popup while on the admin tab and look for a per-site toggle.
3. **If permissions stay blocked**: there's nothing meaningful to do
   on the live UI side. The static review of all four portal HTMLs
   was already done this session (all 100+ inline `onclick` handlers
   resolve to defined functions; no missing scripts; FontAwesome
   loads correctly). Tell the user that and stop.

When you do get into the admin app, **first thing**: open the AI
Assistant panel and verify the file-upload flow doesn't regress
(`up.upload_id` is what the frontend keys off — see commit `79920e7`
notes above).

The user is patient with the work but expects you to keep moving.
"Take breaks to check yourself, keep good notes for yourself."
