# Wednesday Review — Auditor C (Daily Use)

Audit date: 2026-05-13. Branch: `claude/debug-previous-issues-MoN9D`. HEAD: `6b77dba`.
Framing: "if the user demoed this product to their boss **again** tomorrow, what would visibly break or look broken?"

---

## What actually failed the Monday demo (root-cause summary)

Three cascading failures on Monday, May 11, all during or just after the demo:

**1. Wave 1.5 broke every portal's auth (commit `e493200` ~11:31 AM)**
The wave removed `token` from the login response body as a security hardening step. That broke:
- Every portal's `api.js` Bearer-header fallback (reads `sessionStorage.lfs_token`).
- All backend smoke tests (which call `/api/auth/login` and expect `data.token`).
- Result: silent HTTP 401 on every API call after login — portals loaded but rendered nothing.

Fixed by hotfix `4c751c5` (15:35 the same day): token restored to body, hardening deferred. But the window between `e493200` (11:31) and `4c751c5` (15:35) was 4 hours during demo day where the system was effectively broken for every logged-in user.

**2. `jobs.js` missing `requireAuth` destructure caused Railway boot crash (`cafa438`)**
The same `e493200` wave added `requireAuth()` calls to `routes/jobs.js` without adding the destructure. Railway crashed at boot with `ReferenceError: requireAuth is not defined`. Fixed within the same hour by `cafa438`.

**3. Migration 0023 RAISE format error (`ffc3847`)**
Migration 0023 used `%%` (literal percent) in RAISE NOTICE strings. After the `MIN(uuid)` fix unblocked execution, the migration failed with "too many parameters specified for RAISE" on every startup. Fixed by `ffc3847`. This would have prevented the app from starting if the migration hadn't previously run.

**Net result for demo day:** The app was in a broken boot loop for part of the morning, recovered, then broke again at the auth layer for ~4 hours. Anyone who tried the demo between 11:31 and 15:35 saw blank screens everywhere.

---

## Demo-blocker class (would fail the next demo)

### 1. Revenue tab — no error handling on `loadRevenue` (HIGH VISIBILITY)
- **Role:** Admin
- **Flow:** Admin portal → Revenue tab
- **File/line:** `public/js/revenue_tab.js:134` — `Promise.all([...6 API calls...])` with no `try/catch` wrapper
- **What user sees:** If any one of the 6 revenue API endpoints returns a non-200 (DB timeout, migration drift, any transient error), `loadRevenue()` throws an unhandled rejection. The Revenue tab goes blank and stays blank. No error message, no "reload" button. The tab just looks empty.
- **Fix shape:** Wrap `loadRevenue`'s body in `try { ... } catch (e) { container.innerHTML = errorHtml(e); }`. Four other dashboard functions already do this. Revenue was missed.

### 2. Dashboard `loadDashboard` — same issue (HIGH VISIBILITY)
- **Role:** Admin, all roles
- **Flow:** Admin portal → Dashboard (first tab on load)
- **File/line:** `public/js/dashboard_views.js:395` — `await api('/api/dashboard?...')` with no surrounding try/catch
- **What user sees:** If the dashboard API call fails (DB hiccup, Railway restart latency), the entire dashboard goes blank. Dashboard is the first tab the boss sees. No spinner, no error, no retry.
- **Fix shape:** Wrap `loadDashboard`'s main API call in try/catch. Same pattern as the three sub-loaders already use (`loadNeedsAttention`, etc.).

### 3. "UNDER CONSTRUCTION" tiles visible on the dashboard
- **Role:** Admin
- **Flow:** Admin → Dashboard
- **File/line:** `public/admin.html:705` (90-day projection tile), `admin.html:771` (inspection card), `admin.html:6350,6372` (per-project Revenue and Remaining tiles)
- **What user sees:** Four cards labeled with a wrench icon and "UNDER CONSTRUCTION" in white-on-blue header bands and gray stat cards. These are prominent on the most visible screen. To a boss this reads as "the software is not done."
- **Fix shape:** Either hide these tiles from the DOM entirely until the feature is revived, or replace the wrench+text with a subtle `—` stat and a tooltip. The `loadInspectionProjection` function is already a no-op; the HTML tile is still there.

### 4. Native `confirm()` dialogs throughout (POLISH / PROFESSIONALISM)
- **Role:** Admin, Designer, Permitter
- **Flow:** Any destructive action: bulk status change, break batch, reject submission, delete budget, deactivate user, regress a permit, request deletion
- **Files/lines:** `public/admin.html:2828,3920,4739,5228,5294,7148`; `public/design.html:1252,1266`; `public/permitting.html:1222,1236,1303`; `public/js/api.js:39`
- **What user sees:** Browser-native "are you sure?" modal with default OS chrome. Completely different visual from the polished app UI. In a demo this is jarring.
- **Fix shape:** Replace with the existing in-app `openOverlayModal()` / `confirmDialog()` pattern already used elsewhere. The splice tool migration was done in Phase 5.E; admin and portal HTMLs were not done.

### 5. Clients tab in admin — visible "under construction" placeholder
- **Role:** Admin
- **Flow:** Admin → Clients nav tab
- **File/line:** `public/admin.html:1204,1214`
- **What user sees:** A nav tab labeled "Clients" with a handshake icon that navigates to an "under construction" section. The data backend (`/api/admin/client-progress`) is live; the UI is intentionally disabled. If the boss clicks through every tab, this looks unfinished.
- **Fix shape:** Either wire up the UI (one-line uncomment + UI build) or remove the Clients nav tab entirely until it's ready.

### 6. Design portal SSE does not subscribe to design-pipeline events
- **Role:** Designer
- **Flow:** Design Portal → Design Pipeline tab; another user advances a project
- **File/line:** `public/design.html:1773-1785` — SSE subscribes to `time_entry_*`, `project_*`, `staff_*` but NOT to `design_pipeline_updated` or `permit_updated`
- **What user sees:** If two people are in the design portal simultaneously and one advances a project through the pipeline, the other's view stays stale until the 60s recovery poll or manual refresh. In a demo with a live second window this looks broken.
- **Note:** The admin portal's `design_potential_tabs.js` correctly subscribes; the standalone `design.html` portal does not.
- **Fix shape:** Add `design_updated`, `permit_updated` listeners to design.html's SSE block. The permitting.html equivalent is correct and can be used as a template.

### 7. Permitting portal SSE — `loadPermits` is never defined
- **Role:** Permitter
- **Flow:** Permitting Portal — SSE fires a `permit_updated` event
- **File/line:** `public/permitting.html:1785` calls `callIfExists('loadPermits')`; no `function loadPermits` exists in `permitting.html` (the only load functions are `loadPipeline`, `loadProjects`, `loadPotential`, etc.)
- **What user sees:** SSE event fires correctly but is silently dropped because `loadPermits` is undefined. Live updates don't work for the permitting portal — stale data after any permit change.
- **Fix shape:** Rename the SSE call to `callIfExists('loadPipeline')` (the correct function name in permitting.html) or add a `loadPermits` alias.

---

## Per-role flow assessment

### Permitter
**Works:** Opening Permit Pipeline (`loadPipeline` correct, auth-gated, data renders). Advance/regress permit (functions exist, `requireAuth` gates added in Wave 1.5). Upload permit doc (auth gate added). Propose new project via Settings (portal change-request flow intact).
**Breaks:** SSE live updates silently broken (`loadPermits` undefined — finding #7). Native `confirm()` on regress/delete-request — unprofessional. Double-submit guard added by Wave 2 FE-Crit but relies on button disable; no visual spinner on advance.

### Designer
**Works:** Design Portal opens, pipeline renders. Submit potential permit works. Splice Matrix link now goes to `/splice.html` (stale URL fixed in `8402283`).
**Breaks:** Design portal SSE doesn't fire on pipeline events — stale data (#6). Native `confirm()` on regress/delete. No `design_updated` subscription.

### Manager (Admin Hours view)
**Works:** Hours tab loads. Filter by staff_id works. Team-tree view renders per employee. RUS tab has program-gated data.
**Gaps:** No role-scoped hours view per manager type (design_manager sees all teams in Hours tab — this is pre-existing, not a regression). Approvals badge tab works.

### Admin (Dashboard → Projects → Billing → Invoice → Revenue)
**Dashboard:** Loads but has no error handling — any API hiccup blanks it. Three "UNDER CONSTRUCTION" tiles visible on load.
**Projects:** Tree renders correctly. Cascade-collapse fixed (tree_state.js). LocalStorage filter persistence works (with clear button). 
**Billing:** `loadBilling` and `loadBatches` have try/catch. Build-a-batch works. Invoice generation (PSC RUS PDF) gated correctly on `program='rus'`.
**Revenue:** No error handling on `loadRevenue` — blank on any API error (#1). Otherwise renders correctly when data is present.

### Contractor (public token flow)
**Works:** `/splice/field/:token` route exists and is public. `/splice/view/:token` serves the read-only HTML. `SPLICE_PUBLIC_URL` defaults to `https://portal.launchfiber.com` (correct post-consolidation). Field photo upload endpoint is ungated. Loss-record ingest endpoint exists.
**Risk:** If `SPLICE_PUBLIC_URL` is not set on Railway, QR codes in PDFs will encode `https://portal.launchfiber.com` by default — correct for production but would be wrong in staging. Verify the env var is set.

---

## Visible technical debt (hacks the boss would see)

1. **Native `confirm()` dialogs in at least 11 places** across admin, design, and permitting portals (see §Demo-blockers #4). The splice tool migrated to `confirmDialog()` in Phase 5.E; the other portals were not touched.

2. **"UNDER CONSTRUCTION" labels on production UI.** Four tiles on the Admin Dashboard show a wrench icon and "UNDER CONSTRUCTION" text. These look unfinished regardless of the justification.

3. **Clients tab in admin nav** — visible to the boss, navigates to a placeholder. Either ship it or hide the tab.

4. **Commit messages "x", "c", "c", "c", "c"** (`e493200`, `c323f54`, `2c3e0e9`, `05fe2ba`, `8933a99`) in the visible git history. If the boss or a technical reviewer looks at the commit log (e.g., in the GitHub UI), these look like sloppy emergency patches. They are real fixes but appear amateurish.

5. **Training tile in launcher serves a React SPA with no auth integration.** The `/training/` route is auth-gated at the Express level (`requireAuth()`) but the React app inside has no `window.__USER__` shim, so if the SPA ever needs to show user-specific content it will fail silently. For a pure read-only training doc this is fine, but the SPA title is "OSP / ISP Master Training" with no back-to-launcher link visible in the pre-built `index.html`.

6. **`deleteProjectDoc` in `api.js:39`** uses `confirm()` — this is in a shared module, so it affects every portal that can delete a document.

---

## Side-branch findings

### `claude/splice-matrix-railway-setup-IIG3Q`
Already merged to main (PR #29, #30, #31). Contains the SSE reconnect fix, 60s recovery poll, CTE depth guard, and the stale-tab SSE hook race fix. All of this is now in the dev branch via the `ca92036` merge. No unmerged work remains here.

### `claude/scale-pass-sse-cte`
Branch HEAD is `48d67e7` (CTE depth guard). The dev branch includes all commits from this branch via the main merge. The 5 scale follow-ups (S-1 through S-5) were noted as queued but NOT implemented in this branch — they remain open:
- N+1 in monthly invoice builder (`routes/billing.js`)
- N+1 in `findLeafFor()` rollup loop
- Unbounded `SELECT *` in billing route
- Dashboard `ytd_revenue` scalar subquery per row (partially addressed by `Wave 3 BE-Perf`)
- SSE reconnect timer stack guard

The `Wave 3 BE-Perf` commit (`20560fe`) addressed the `ytd_revenue` caching and several indexes. The N+1s in billing are still present.

### `claude/add-audit-log-hours-x0XCd`
Already merged. Audit drawer, pencil-edit modal, unbilled hours, color token system, etc. are all in main/dev. The `SESSION_HANDOFF.md` and `NEXT_STEPS.md` in this branch are stale planning artifacts; they do not represent unshipped work.

---

## Coverage gaps

Did not deep-read: `routes/splice.js` (306 KB — beyond time budget); `invoice_generator.js` PDF output rendering; the timeclock portal flow; the customer portal (confirmed UC placeholder). Splice contractor flow was assessed via route inspection only, not live test.

=== REVIEW-C END ===
