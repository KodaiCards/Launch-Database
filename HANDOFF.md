# HANDOFF.md — Feature work resumption

Read this first. The owner ("Kodai" / "Carter") is shipping a batch of
features and bug fixes through you. The previous Claude just finished a
major refactor — this doc gets you up to speed without making you dig.

Last updated: 2026-05-03 (after `2d11712`). HEAD is `main`.

---

## What just happened (the cleanup sprint)

Two days of work split into three threads:

1. **Track 0 — Smoke tests + CI** (`b73f66e`). Built a `node --test` backend
   suite + a Playwright browser test against a Postgres 16 service container.
   `.github/workflows/test.yml` runs them on every PR + push to `main`.
2. **Track 1.2 — Frontend split (partial)**. Three modules extracted from the
   9650-line `public/index.html`:
   - `public/js/api.js` — `api()` fetch wrapper
   - `public/js/undo_bar.js` — undo bar (showUndoBar / hideUndoBar / lfsUndoClick)
   - `public/js/tree_state.js` — `makeTreeState(name)` primitive replacing
     the bespoke `expandedRollups` / `expandedHrsKeys` Sets across 21 call
     sites. Singletons: `projectsTreeState` (Projects + Dashboard + Revenue
     tabs) and `hoursTreeState` (Hours tab).
3. **Track 1.3 — Backend split (mostly done)**. 25 route modules extracted
   from the 7373-line `server.js`. **Result: server.js → 3195 lines (–57%).**

Two bugs caught + fixed while doing this:
- `7bb016e` — missed `require('./routes/potential_permits')` in server.js
  after extraction. /api/potential-permits was 404. Fixed.
- `2d11712` — pre-existing HTML parser bug in `design.html` and
  `permitting.html`: orphan `<tbody>` as a direct child of `<div>` is invalid
  HTML; Chrome silently drops it. `getElementById('dpb')` returned null,
  which crashed `loadProjects`'s catch block. Wrapped in `<table>`. Fixed.

---

## File layout after cleanup

### Backend

```
server.js                ~3195 lines — top-level wiring + 3 still-inline blocks:
                                       (1) AI tools (~1200 lines)
                                       (2) hours CSV import (~755 lines, multer)
                                       (3) v3 schema bootstrap (~300 lines)
                                       Plus auth/cors/csrf init, multer setup,
                                       /login route, SPA fallback, start().

routes/_helpers.js       updateProjectHours, saveUndoBucket, popUndoBucket,
                         collectProjectTree, calcProjectFinancials,
                         UNDO_TTL_SECONDS

routes/admin.js          /api/_admin/{migrate-nesting, orphan-files,
                         adopt-orphan, adopt-orphans-bulk,
                         hours-backfill-preview, hours-backfill}
routes/billing.js        /api/billing/{bill-multiple, batches, batches/:id,
                         batches/:id/confirm, report}
routes/budgets.js        /api/budgets/*, /api/budget-codes/*,
                         /api/budgets/:id/by-area
routes/clients.js        /api/clients/*
routes/concentrators.js  /api/concentrators
routes/contracts.js      /api/contracts/* (incl. cascade delete + undo)
routes/dashboard.js      /api/dashboard, /api/dashboard/active-list
routes/design_pipeline.js /api/design, /api/design/:id/{advance,regress},
                          /api/projects/:id/ongoing
routes/engineering_contracts.js /api/engineering-contracts/*
routes/inspection.js     /api/inspection (PSC RUS scope view)
routes/invoices.js       /api/invoices, /api/invoices/generate-pdf*,
                         /api/invoices/preview-makeup
routes/jobs.js           /api/jobs/*, /api/_debug/jobs
routes/permits.js        /api/permits/* + advance/regress + documents (multer)
routes/potential_permits.js /api/potential-permits/*
routes/pricing.js        /api/pricing, /api/pricing/lookup, /api/pricing/gaps
routes/project_billing.js /api/projects/:id/{unbill, mark-billed, bill-and-clone}
routes/project_detail.js /api/projects/:id/detail (240-line subtree drill-down)
routes/project_documents.js /api/projects/:id/documents (multer),
                            /api/_debug/uploads
routes/project_types.js  /api/project-types/*
routes/projects.js       /api/projects/* CRUD + recalc + with-tree, with-hours
routes/reports.js        /api/reports/{hours, billing}
routes/revenue.js        /api/revenue/{monthly-summary, by-client, details,
                         projected-total, unbilled}
routes/staff.js          /api/staff
routes/time_entries.js   /api/time-entries/* + bulk delete by-staff (with undo)
routes/undo.js           /api/undo/:token replay
```

Other backend files (NOT touched by the refactor):

```
auth.js                  JWT auth, requireAuth/requireAdmin/requireManagerOrAdmin
automation.js            scheduler + digest + stale permits + budget burn
db.js                    pg pool + initSchema()
invoice_generator.js     PSC RUS PDF builder (footage + hourly templates)
portal_module.js         portal-mode routes + ensureRollupChain +
                         isDuplicateProject + setting-change-requests flow
timeclock_module.js      /api/timeclock/* + audit logger
```

### Frontend

```
public/index.html        ~9580 lines — admin app, mostly inline JS.
                         Splits done: api.js, undo_bar.js, tree_state.js
                         loaded via <script src> just before the inline
                         <script> block. Inline bits cover dashboard,
                         projects, hours, settings, psc_rus, billing,
                         design pipeline, etc.
public/design.html       Design portal (own inline JS, own api() impl)
public/permitting.html   Permitting portal (own inline JS, own api() impl)
public/timeclock.html    Time clock portal (own inline JS, own api() impl)
public/login.html        Shared login page

public/js/api.js         admin's api() — bearer + cookie auth, 401 redirects
public/js/undo_bar.js    bottom-of-viewport undo bar (15s countdown)
public/js/tree_state.js  makeTreeState(name) primitive +
                         projectsTreeState + hoursTreeState singletons

public/toast.js          LFS.toast.{success,info,warn,error} + monkey-patches
                         window.alert + global unhandledrejection handler
                         (this last bit is why ANY unhandled async error in
                         the admin or portals shows up as a popup toast)
public/keyboard.js       /, Cmd-K, n, Esc, ? shortcuts
public/app-shell.css     shared styles
```

### Tests

```
tests/_helpers.js                    bootTestServer, adminLogin, request/
                                     requestJson, fixture seeders, cleanup
tests/_sanity.test.js                login + auth/me roundtrip
tests/hours_bulk_delete.test.js      bulk delete + undo (regression for 35d22e6)
tests/project_tree_delete.test.js    tree delete + undo (parent + child)
tests/psc_rus_pdf.test.js            PDF render + 422 conflicts on non-RUS
tests/contract_friendly_label.test.js POST/PUT roundtrip + appears in invoice
                                       preview-data (regression for 1319d37)

tests/browser/_db.js                 direct-DB seed for Playwright
tests/browser/psc_rus_tab.spec.js    admin login + click PSC RUS tab,
                                     assert no pageerror events
tests/browser/projects_tree_state.spec.js seed parent + child, expand,
                                          wait 9s past one POLL_MS,
                                          assert child STILL visible

playwright.config.js                 webServer boots node server.js on 3007
.github/workflows/test.yml           PG 16 service container, runs both
                                     suites on PR + push to main
```

---

## How to add a new backend route

If the resource already has a module:

```js
// routes/projects.js (e.g. adding a new project endpoint)
app.post('/api/projects/:id/your-new-thing', requireAdmin, async (req, res) => {
  // ...
});
```

That's it — the route module is already wired.

If the resource is brand new (no existing module):

```js
// routes/your_resource.js
module.exports = function installYourResourceRoutes(app, pool, mw) {
  const { requireAdmin } = mw;  // destructure what you actually need

  app.get('/api/your-resource', async (req, res) => {
    try {
      const { rows } = await pool.query('SELECT ...');
      res.json(rows);
    } catch (e) { res.status(500).json({ error: e.message }); }
  });
};
```

Then in `server.js`, find the chunk of `require('./routes/X')(app, pool, ...)`
calls (around line 380-1700) and add yours. Convention is one require line
with a short comment. Pass any extra deps via the `mw` bag.

If your route uses a shared helper, import from `routes/_helpers.js`:

```js
const { updateProjectHours, saveUndoBucket } = require('./_helpers');
```

If you need multer for file upload:

```js
// In server.js the require call passes upload through:
require('./routes/your_resource')(app, pool, { upload, requireAdmin });

// In your route module:
const { upload, requireAdmin } = mw;
app.post('/api/.../upload', upload.single('file'), async (req, res) => { ... });
```

---

## How to add a new frontend module (admin app)

```html
<!-- in public/index.html, near the existing extracted-module loads
     (~line 2049, BEFORE the big inline <script> block) -->
<script src="/js/your_module.js"></script>
```

In `public/js/your_module.js`, define functions/state at top level:

```js
// Non-module scripts share globals across all <script> tags. The inline
// block can call your functions directly; you can read its vars too.
function yourFunction() { ... }
const yourState = { ... };
```

This is intentionally simple — no bundler, no modules, no transpilation.
Owner deploys via Railway nixpacks; build steps add risk.

---

## Conventions

### Workflow
- **Push directly to `main`.** Railway auto-deploys all four services (admin
  + 3 portals) in 1-2 min. No PR workflow.
- **NO worktrees.** Owner explicitly opted out (memory:
  `feedback_no_worktrees.md`). Work in the main checkout.
- **Update `NEXT_STEPS.md`** when work lands.
- **Update `CLEANUP_PLAN.md`** if you finish or modify a Track step.

### Commit messages
- One subject line + optional body.
- Why-focused. The diff shows the what.
- Reference commit hashes / tracks where useful.
- Co-author trailer:
  ```
  Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
  ```

### Tests
- Add a regression test when:
  - A class of bug recurred (typos silently dropping data, polling state
    loss, unguarded innerHTML)
  - You shipped a load-bearing endpoint (PSC RUS PDF, billing flows)
  - Test fits in <30 lines
- Don't add a test for every CRUD update.

### Local dev
- **There is no local Node on this Windows box.** You can't run
  `npm test` / `node server.js` locally. CI runs them on push.
- Verification path: code review against the route + push to Railway +
  click around in the live app.

### Live preview panel
- When you edit `public/*.html` or `public/js/*`, the user's "Launch
  preview panel" loads them in a live browser. Mention it in your reply
  ("X is visible in the preview panel") so they can eyeball.

---

## What's verified working (don't waste time re-testing these)

- Bulk hours delete + undo (smoke test)
- Project tree delete + undo (smoke test)
- PSC RUS PDF render — footage path + non-RUS rejection (smoke test)
- Contract `friendly_label` POST/PUT round-trip + invoice preview-data
  (smoke test, regression for `1319d37`)
- Login flow + `/api/auth/me` + bearer token (sanity test)
- Projects tab tree expand state survives 8s polling rebuild (Playwright)
- Routes wired up correctly (verified after `7bb016e` fix)
- Portal HTML compat shims (verified after `2d11712` fix)

## What's NOT covered by tests (proceed carefully)

- Hours / Dashboard / Revenue tabs tree-state behavior (only Projects has
  the Playwright test)
- Settings modal CRUD operations (Jobs, Project Types, Clients, Contracts)
- AI chat tool calls + approval flow
- CSV import flow (validate → edit-row → commit)
- File upload (permits + project documents, both multer)
- Time clock portal (clock in/out, switching projects, week views)
- Mobile UI on the admin app

---

## Known open items / latent risks

### Code-shape items
- **AI tools + hours CSV inline in server.js** (~2000 lines combined). They
  share an in-memory `csvStage` Map. To extract: either move them together
  or refactor the Map into `routes/_csv_stage.js` first.
- **Schema bootstrap inline** (~300 lines in `server.js`'s
  `bootstrapV3Schema()` — ALTER soup). Track 1.4 in `CLEANUP_PLAN.md`
  plans `migrations/NNN_*.sql` + a `schema_migrations` table. Important:
  `schema.sql` claims to be the canonical schema but it isn't — half the
  columns get ALTERed in at boot. Two sources of truth, one to fix.
- **Frontend admin not yet split**. Dashboard, projects, hours, settings,
  psc_rus tabs still inline. Heavy cross-tab dependencies; do under
  preview-panel observation.

### Latent bugs to be aware of
- **bare `requireAuth` (factory) used as middleware** at `/api/undo/:token`
  and `/api/time-entries/by-staff/:staffId`. The function signature is
  `requireAuth(roles)` returning a middleware — passing it without parens
  means Express receives the factory, calls it as middleware with
  `(req, res, next)`, and the inner middleware never runs. Looks like
  these endpoints have been silently auth-bypassed for weeks without
  complaint. Can't tell whether to fix without owner sign-off (fixing
  might break tests that assumed no auth check).
- **toast.js global `unhandledrejection` handler** turns ANY unhandled
  async error into a popup. If a user reports a confusing error toast,
  the actual stack is in the browser console (F12) — not the toast text.
- **Portal HTML files** had orphan `<tbody>` inside `<div>` (invalid HTML,
  Chrome's parser dropped them). Fixed in `2d11712`. **Don't regress this:**
  if you add a hidden compatibility shim for table rows, wrap the
  `<tbody>` in a `<table>`.
- **`requireAuth(['admin', 'design_manager', 'permitting_manager'])`** is
  the correct usage at `/api/dashboard` — pass the call result (the
  middleware), not the factory.

### Endpoints by role gate
- `requireAdmin`: clients delete, contracts PUT/DELETE, engineering_contracts
  POST/PUT/DELETE, projects DELETE/recalc-all, /api/_admin/*
- `requireManagerOrAdmin`: invoices, billing/*, project_billing, revenue/*
- `requireAuth(['admin','design_manager','permitting_manager'])`:
  /api/dashboard
- bare `requireAuth` (suspect bug): /api/undo/:token,
  /api/time-entries/by-staff/:staffId

---

## Critical user preferences (auto-loaded from memory)

These are in `~/.claude/projects/.../memory/MEMORY.md` so a new Claude
session in this project will see them automatically. Repeated here for
quick reference:

- **NO worktrees** (`feedback_no_worktrees.md`)
- Update `NEXT_STEPS.md` when work lands
- Don't reuse PSC RUS invoice template for non-PSC clients — they need
  their own templates (`reference_invoice_non_rus_formats.md`)
- Don't start these (deferred features):
  - Customer self-service portal (`feature_customer_portal.md`)
  - Client progress view (`feature_client_progress_view.md`)
  - Project-level completion view (`feature_client_portal_completion_view.md`)
  - Inspection revenue projection refinements
    (`feature_inspection_revenue_projection.md`)

---

## Mission for THIS session

The owner is bringing you a batch of **features + bug fixes**. Stay
disciplined:

1. **Bug fixes first** — never block a bug on an unrelated cleanup.
2. **Don't extend the cleanup tracks unprompted.** Server.js is already
   57% smaller; the dividend has been collected. More cleanup before
   features ship is paying interest with no return.
3. **If a feature touches an unextracted block** (AI tools, hours CSV,
   admin frontend tabs), flag it to the owner before you start. Decide
   together: edit in-place vs extract first.
4. **If a feature touches an extracted module**, just edit `routes/X.js`
   or `public/js/X.js`. Low-risk.

When the feature batch is done, return to the cleanup plan
(`CLEANUP_PLAN.md`) starting with whatever's still inline in `server.js`.

---

## Quick reference

```bash
# Run backend tests (CI / Linux only — no Node on owner's Windows machine)
npm test

# Run browser tests (Playwright)
npm run test:browser

# Inspect what's still inline in server.js
grep -E "^app\.(get|post|put|delete)\(" server.js

# See what's in routes/
ls routes/ && wc -l routes/*.js

# Recent commits
git log --oneline -25

# Where every API endpoint lives
grep -rE "^\s*app\.(get|post|put|delete)\(['\"]/api/" routes/ server.js
```

---

## Recent commit chronology (most recent first)

```
2d11712 Fix: portal compat shim — wrap orphan <tbody> in <table>
7bb016e Fix: missing routes/potential_permits wire-up in server.js
3574f94 Doc: update handoff with Track 1.3 progress (server.js down 57%)
ff39dbe Track 1.3 (15/n): extract project_detail drill-down
7de66ac Track 1.3 (14/n): extract permits + project_documents + uploads-debug
999c2f2 Track 1.3 (13/n): extract dashboard + design pipeline + inspection
8e90ae4 Track 1.3 (12/n): extract admin migration / cleanup endpoints
9ab7c62 Track 1.3 (11/n): extract project_billing + billing route modules
f5c1e8a Track 1.3 (10/n): extract revenue + reports route modules
2895c77 Track 1.3 (9/n): extract pricing + budgets + potential_permits modules
92350ed Doc: handoff notes for evening 2026-05-03 — tree-state verification list
7d8956e Track 1.3 (8/n): extract concentrators route module
7a3bae0 Track 1.3 (7/n): extract project_types + staff route modules
8f125cb Track 1.3 (6/n): extract jobs route module
6bc34db Track 1.2.3 (2/n): makeTreeState() + rewrite all expandedRollups/HrsKeys callers
41afd2e Track 1.2.3 (1/n): Playwright regression test for tree expand state
e492386 Doc: mark Track 1.2 + 1.3 partial-done; record commit list
eaf9f6a Track 1.3 (5/n): extract invoice routes (PDF generator + CRUD)
c5c068a Track 1.3 (4/n): extract undo replay handler
fd4b728 Track 1.3 (3/n): extract time_entries routes
389c768 Track 1.3 (2/n): extract projects core CRUD + recalc + tree/with-hours
fb93c40 Track 1.3 (1/n): extract clients + contracts + engineering_contracts
fba9606 Track 1.2: extract api.js + undo_bar.js into public/js/
b73f66e Track 0: smoke tests + CI (catches the recurring class of bugs)
7085176 Add CLEANUP_PLAN.md — handoff for cleanup sprint (Code/Data/Billing/UX)
```

That's everything. `CLEANUP_PLAN.md` has the broader strategy if you need
context for a structural decision; this doc has the day-to-day operational
state. Good luck.
