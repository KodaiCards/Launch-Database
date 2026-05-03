# CLEANUP_PLAN.md

Living plan for the next Claude (or human) picking up the cleanup sprint
the owner asked for after the May 2026 feature push (engineering contracts,
PSC RUS PDF, Settings CRUD, undo bar, dashboard refocus).

The owner asked: "Is my current process the most effective way to achieve
my goals?" Answer: no. The system works but is fragile in ways that surface
as recurring bugs (`clientsCache` typo broke contract assignment for days,
`loadContracts` typo silently no-op'd, `.modal-content` had no background,
`friendly_label` was silently dropped server-side, hours bulk delete returned
0 in YTD mode, Hours-tab rollups collapsed every poll). Each came from the
same class of problem: related code lives too far apart in two giant files
(`public/index.html` 557KB, `server.js` 345KB), there's no test layer to
catch regressions, and several cache/state primitives were re-invented per
tab instead of shared.

The owner agreed to all four cleanup tracks (Code, Data, Billing, UX) but
wants them done in payoff order without stopping feature work entirely.
This file is the work plan.

---

## Memory you should respect

Pulled from `~/.claude/projects/.../memory/MEMORY.md`:

- **NO worktrees.** Work directly on `main` in the existing checkout. The
  owner finds GitHub Desktop confusion outweighs the isolation benefit.
- **Update `NEXT_STEPS.md`** when work lands.
- **Don't reuse the PSC RUS invoice template** for non-PSC clients —
  they need their own templates (currently TBD).
- **Future work — don't start on these yet:** customer self-service portal,
  client progress view, project-level completion view (deferred until the
  customer portal exists), inspection revenue projection refinements.

---

## Order of operations (highest payoff first)

Do these tracks in this order. Each track unlocks the safety/clarity needed
for the next one. Inside a track, items are listed in the order to do them.

1. **Track 0 — Smoke tests** (1-2 days). Cheapest, unblocks everything else.
2. **Track 1 — Code split** (3-5 days). Must come before Tracks 2/3/4
   because the file size makes everything else risky.
3. **Track 2 — Data integrity** (2-3 days). Audit + fix root causes. Makes
   billing work cleanly because dropdowns stop having duplicate rows.
4. **Track 3 — Billing consolidation** (3-4 days). Collapse the 5 entry
   points into one canonical flow.
5. **Track 4 — UX polish** (2-3 days). Cleanup that becomes safe only after
   the above. Settings split, alert→toast, command palette, mobile pass.

Total estimate: ~3 weeks of focused work. The owner's tradeoff acceptance
was "this is fine because every week after is faster."

---

## Track 0 — Smoke tests **[COMPLETE 2026-05-03]**

**Goal:** A CI-runnable test suite that catches the recurring class of bugs
(typos in cache names, missing CSS rules, server endpoints that silently
drop fields, polling re-renders that lose state).

**Why first:** Without these, every refactor in Tracks 1-4 is "ship and
watch for the bug report" — exactly the loop we're trying to escape.

### Steps

1. **[x] DONE** — Pick a runner. Recommend `node --test` (built-in, no deps) for backend
   and Playwright for browser. Both work cleanly on Railway. Skip Jest —
   too much config for this repo.
2. **[x] DONE** — Smoke test #1 — bulk hours delete + undo.
   - POST a known time entry, DELETE via `/api/time-entries/by-staff`, assert
     `deleted >= 1` and `undo_token` returned, POST `/api/undo/:token`,
     assert the entry is back with the original UUID.
   - File: `tests/hours_bulk_delete.test.js`
3. **[x] DONE** — Smoke test #2 — project tree delete + undo.
   - Create a parent project with one child + one time entry on the child.
     DELETE `/api/projects/:id/with-tree`, assert tree is gone, POST undo,
     assert tree restored. Tests both undo restoration order (parents first)
     and the descendant collection logic in `collectProjectTree()`.
   - File: `tests/project_tree_delete.test.js`
4. **[x] DONE** — Smoke test #3 — generate a PSC RUS PDF.
   - Seed an EC + contract + permitting project + footage. Hit
     `/api/invoices/generate-pdf-from-projects`. Assert response is
     `application/pdf`, status 200, byte length > 5KB. Optionally pdf-parse
     for "Permitting Summary" string check.
   - File: `tests/psc_rus_pdf.test.js`
5. **[x] DONE** — Smoke test #4 — contract create → project assign → bill.
   - End-to-end: create contract with `friendly_label` (regression test for
     the silently-dropped field bug from commit `1319d37`), assign to a new
     project, generate an invoice, assert the contract's friendly_label
     appears in the invoice data.
6. **[x] DONE** — Wire to GitHub Actions. `.github/workflows/test.yml` runs on PR.
   Block merges if smoke tests fail.
7. **[x] DONE** — Browser smoke test (Playwright). Open the app, log in, click the
   PSC RUS tab, assert the projection card renders without console errors.
   Catches the `clientsCache`-class of frontend bugs that don't throw HTTP
   errors but break the UI silently.

**Done when:** 4 backend tests + 1 browser test all green in CI. ~80% of
the recurring bug categories are now caught automatically.

**Risks:** Tests need a DB. Either spin up a Postgres in CI (works fine
on Railway/Actions) or use `pg-mem` (faster but not 100% compatible with
the migrations). Recommend real Postgres for accuracy — the silent
data-coercion bugs only show up against a real engine.

---

## Track 1 — Code split

**Goal:** Break `public/index.html` (557KB) and `server.js` (345KB) into
per-feature files. Most recurring bugs are "I edited this part and forgot
the matching part 6,000 lines away."

**Why first after Track 0:** Every other cleanup gets safer once files are
the size a human (or a Claude context window) can hold in mind.

### Step 1.1 — Inventory current monolith

Before splitting, document what's in each file. Run:

```bash
grep -nE '^(async function |function |const |let )' public/index.html | head -200
grep -nE '^app\.(get|post|put|delete)\(' server.js | head -200
```

Group by feature area. There will be ~12-15 distinct feature blocks in
each. Examples already known:

`public/index.html`:
- Lines ~440-790:   Nav + Dashboard view + section headers
- Lines ~790-1090:  Hours tab UI
- Lines ~1090-1340: Project modal
- Lines ~1700-2030: Settings modal
- Lines ~2484-2700: Client/contract/concentrator loaders
- Lines ~3446-3603: PSC RUS projection card render
- Lines ~3605-3800: Dashboard load + tree render
- Lines ~3982-4180: Projects table render
- Lines ~4106-4327: Project edit modal logic + autosave
- Lines ~4551-4660: Project delete flow
- Lines ~5519-5910: Inspection (now PSC RUS) tab + Hours tab loaders
- Lines ~7409-8030: Settings panel render functions

`server.js`:
- Lines ~140-220:   Auth middleware setup
- Lines ~430-540:   Clients + Contracts CRUD
- Lines ~540-700:   Engineering Contracts CRUD
- Lines ~1318-1620: Projects + Time entries CRUD + Undo
- Lines ~3490-3625: /api/inspection (PSC RUS scope)
- Lines ~4208-4470: Invoices + PDF generation
- Lines ~4421-4530: Project tree-delete with undo
- Lines ~6717-6960: Schema bootstrap migrations

### Step 1.2 — Frontend split  **[PARTIAL 2026-05-03]**

Create `public/js/` directory. One module per feature area. Use plain
`<script>` tags loaded in order from a thin `index.html` shell — don't
introduce a bundler. Owner has Railway auto-deploy; build steps add risk.

**Done:** public/js/api.js (api() wrapper), public/js/undo_bar.js
(showUndoBar/hideUndoBar/lfsUndoClick). Loaded synchronously right
before the main inline `<script>` so globals stay available to it.

**Deferred:** tree_state.js — that's a refactor (not a relocation), needs
UI verification across every consumer. Pending.

Order of extraction (do one at a time, commit after each, run smoke tests):

1. `public/js/api.js` — the `api()` function + auth header injection.
   This is foundational; everything else uses it.
2. `public/js/stores.js` — ONE source of truth for cached data: `clients`,
   `jobs`, `contracts`, `engineeringContracts`, `projectTypes`,
   `concentrators`. Provides `loadXxx()` and `getXxx()` accessors. **Kills
   the `clients` vs `clientsCache` confusion** — every consumer reads
   `stores.clients()` and there's only one place to add a value.
3. `public/js/tree_state.js` — generic collapsible-tree state primitive.
   `makeTreeState(name)` returns `{toggle, restore, isExpanded, clear}`.
   Replaces both `expandedRollups` (Projects) and `expandedHrsKeys`
   (Hours) and the bespoke logic on the dashboard.
4. `public/js/undo_bar.js` — `showUndoBar`, `hideUndoBar`, `lfsUndoClick`.
   Already self-contained in current code; move as-is.
5. `public/js/dashboard.js` — `loadDashboard`, projection render, tile
   updates.
6. `public/js/projects.js` — projects list + tree render + bulk actions
   + project modal.
7. `public/js/hours.js` — Hours tab + grouping + bulk hours delete.
8. `public/js/billing.js` — Billing tab + Print PDF modal + bill flows.
9. `public/js/settings.js` — Settings modal + every renderXxx for it.
10. `public/js/psc_rus.js` — the PSC RUS tab (formerly Inspection).
11. `public/js/permits.js` + `public/js/design.js` — those tabs.

After all extraction: `public/index.html` should be < 50KB (just markup,
modal shells, header, nav).

**Verification at each step:** Smoke tests pass + manually click through
the affected tab + check browser console for ReferenceErrors.

### Step 1.3 — Backend split  **[PARTIAL 2026-05-03]**

Create `routes/` directory. One Express router per domain.

**Done:** routes/_helpers.js (shared utilities), clients, contracts,
engineering_contracts, projects (core + tree-delete), time_entries,
invoices, undo. server.js: 7373 → 5927 lines.

**Still pending:** project sub-endpoints (documents/detail/ongoing/unbill/
mark-billed/bill-and-clone), billing/bill-multiple, dashboard endpoints,
AI tools, scheduler routes.

Order:
1. `routes/clients.js`
2. `routes/contracts.js` + `routes/engineering_contracts.js`
3. `routes/projects.js` (includes the tree-delete + with-hours endpoints)
4. `routes/time_entries.js` (includes the bulk delete + undo path)
5. `routes/invoices.js`
6. `routes/undo.js` (the `/api/undo/:token` handler currently embedded
   between time-entries section comments at server.js:1366)
7. `routes/inspection.js` (rename to `routes/psc_rus.js` since the tab is
   PSC RUS now)
8. `routes/admin.js` (everything `/api/_admin/*`)

Pattern:
```js
// routes/contracts.js
module.exports = function(app, pool, mw) {
  app.get('/api/contracts', async (req, res) => { ... });
  app.post('/api/contracts', async (req, res) => { ... });
  app.put('/api/contracts/:id', mw.requireAdmin, async (req, res) => { ... });
  app.delete('/api/contracts/:id', mw.requireAdmin, async (req, res) => { ... });
};

// server.js (post-split, becomes wiring only)
require('./routes/contracts')(app, pool, { requireAuth, requireAdmin });
```

After extraction: `server.js` should be < 50KB (auth wiring, schema
bootstrap, server startup only).

### Step 1.4 — Move bootstrap migrations into versioned files

Currently `server.js:6717-6960` has `bootstrapV3Schema()` running ~50
`ALTER TABLE … ADD COLUMN IF NOT EXISTS` statements at boot. Two problems:

1. `schema.sql` claims to be the canonical schema but it isn't — half the
   columns get added by `server.js` migrations. Two sources of truth.
2. New developers/Claudes can't see the actual current schema without
   reading both files.

Fix:
1. Create `migrations/` directory. Each migration is `NNN_description.sql`
   (e.g. `001_init.sql` ≈ current `schema.sql`, `002_engineering_contracts.sql`,
   `003_friendly_label.sql`, etc.). Numbered, ordered, no IF NOT EXISTS
   in body — they run exactly once.
2. Add a `schema_migrations(version INT PRIMARY KEY, applied_at TIMESTAMPTZ)`
   table. At boot, find migrations with version > MAX(applied), apply in
   order, INSERT into schema_migrations.
3. Delete `bootstrapV3Schema()`.
4. Add a `npm run schema:dump` script that runs `pg_dump --schema-only` and
   writes `schema.sql`. CI fails if `schema.sql` is stale relative to
   migrations. Now `schema.sql` is a generated artifact, not a source.

### Step 1.5 — Pull magic constants into `config.js`

Hardcoded numbers scattered across the codebase:

- `PERMITTING_HOURS_PER_MILE = 27.5` — appears in `public/index.html:4276`
  + `invoice_generator.js` (derivation comment)
- `PERMITTING_MIN_HOURS = 25` — same
- `DEFAULT_HOURLY_RATE = 90` — appears in `server.js:3582` (inspection
  fallback) + multiple inferRate() callers in index.html
- `DEFAULT_RE_RATE = 100` — appears in `inferRate()` at index.html:3667
- `UNDO_TTL_SECONDS = 60` — already a constant at server.js, good

Move to `config.js` (server) + `public/js/config.js` (client). Single
source. Now changing the rate is one edit, not three.

**Done when:** `public/index.html` < 50KB, `server.js` < 50KB, every
recurring bug class has a smoke test that would have caught it.

---

## Track 2 — Data integrity

**Goal:** Stop drift at the source. Today the codebase has dedup logic
in dropdowns (`clientChanged()` in index.html:2613-2621) which means
contracts are getting duplicated somewhere — that's a band-aid hiding
the real bug.

### Step 2.1 — Build a "Data Health" panel in Settings

New section in Settings (or its own admin tab): runs a set of audit
queries and shows results with one-click fixes. Each query:

| Audit | SQL | Fix |
|---|---|---|
| Duplicate contracts per client | `SELECT client_id, contract_number, COUNT(*) FROM contracts GROUP BY 1,2 HAVING COUNT(*) > 1` | Show duplicates → admin picks the canonical one → others get merged (projects re-pointed, then deleted) |
| Orphan time_entries | `SELECT * FROM time_entries te WHERE NOT EXISTS (SELECT 1 FROM projects p WHERE p.id = te.project_id)` | Should be impossible (FK RESTRICT) but check anyway. Delete + alert |
| Hours mismatch | `SELECT p.id, p.actual_hours, SUM(te.hours) AS computed FROM projects p LEFT JOIN time_entries te ON te.project_id = p.id GROUP BY p.id HAVING p.actual_hours != COALESCE(SUM(te.hours), 0)` | Run `recalc-all` on affected projects |
| Mis-placed rollup parents | `SELECT * FROM projects WHERE parent_id IS NOT NULL AND parent_id NOT IN (SELECT id FROM projects)` | Set `parent_id = NULL` |
| `is_rus` ↔ `show_contract` drift | `SELECT * FROM clients WHERE is_rus = TRUE AND show_contract IS NOT TRUE` | Sync show_contract = is_rus (or make derived) |
| Contracts with no engineering_contract on PSC RUS | `SELECT c.* FROM contracts c JOIN clients cl ON cl.id = c.client_id WHERE cl.is_rus = TRUE AND c.engineering_contract_id IS NULL` | List for admin to attach |

File this as `routes/admin.js` → `GET /api/_admin/data-health`. UI in
`public/js/settings_data_health.js`.

### Step 2.2 — Add the missing constraints

These would have prevented the duplicates from being created in the first
place. Add as migrations (Step 1.4 framework):

```sql
-- Prevent duplicate contracts per client
ALTER TABLE contracts ADD CONSTRAINT contracts_client_number_unique UNIQUE (client_id, contract_number);

-- Catch negative money / footage from UI bugs
ALTER TABLE projects ADD CONSTRAINT projects_billing_rate_nonneg CHECK (billing_rate IS NULL OR billing_rate >= 0);
ALTER TABLE projects ADD CONSTRAINT projects_footage_nonneg CHECK (footage IS NULL OR footage >= 0);
ALTER TABLE projects ADD CONSTRAINT projects_expected_revenue_nonneg CHECK (expected_revenue IS NULL OR expected_revenue >= 0);
ALTER TABLE time_entries ADD CONSTRAINT time_entries_hours_nonneg CHECK (hours >= 0);
```

WARNING: run Step 2.1 cleanup BEFORE adding the constraints — existing
violations would block the migration.

### Step 2.3 — Drop `actual_hours` denormalized cache

Currently `projects.actual_hours` is a denormalized sum kept in sync by
`updateProjectHours()`. Every place that touches time_entries calls it.
This is exactly the kind of cache that drifts (see audit query above).

Replace with a SQL view:
```sql
CREATE VIEW project_actual_hours AS
SELECT project_id, COALESCE(SUM(hours), 0) AS actual_hours
FROM time_entries GROUP BY project_id;
```

Update queries that read `projects.actual_hours` to LEFT JOIN this view.
Delete `updateProjectHours()` and every call site.

PostgreSQL handles a `SUM` aggregation at this scale (100K rows) in
single-digit ms. The cache buys you nothing but bugs.

### Step 2.4 — Drop legacy `project_type` string column

`projects.project_type` is a VARCHAR enum (`'inspection'|'re'|'permitting'|...`)
that gets re-derived from `job.name` in `saveProject` at index.html:4351-4360.
Two sources of truth. The correct source is `job_id` → `jobs.team` (or
`jobs.is_permitting`).

Audit current usage of `project_type` (likely 50+ call sites). Replace each
with the equivalent JOIN through `jobs`. Keep the column for one release
behind a feature flag in case some report still reads it. Then drop.

**Done when:** Data Health panel returns 0 violations, all constraints in
place, `actual_hours` and `project_type` columns gone.

---

## Track 3 — Billing consolidation

**Goal:** ONE billing flow. Today there are at least 5 entry points and
they do subtly different things — that's how `friendly_label` was silently
dropped on contract create + update (server.js POST/PUT before commit
`1319d37`).

### Current entry points to collapse

1. Dashboard "If I Billed Today" preview → `/api/automation/bill-now-preview`
2. Monthly billing draft → `/api/automation/billing-draft/monthly` →
   admin reviews → POSTs to `/api/billing/bill-multiple`
3. Bulk action bar "Bill Selected" → `openBillSelectedModal()` →
   `/api/billing/bill-multiple`
4. Print PDF → "Confirm Billed" → reuses Bill Selected modal
5. Print PDF → "Save as Batch" → `/api/billing/batches` → later admin
   opens batch and bills it

### Step 3.1 — Define ONE canonical endpoint

```
POST /api/billing/run
Body: {
  project_ids: UUID[],
  period_year: int,
  period_month: int,
  invoice_date: 'YYYY-MM-DD',
  invoice_number: string?,         // optional, generated if omitted
  notes: string?,
  source: 'manual' | 'monthly_draft' | 'pdf_confirm' | 'batch'
}
Returns: { invoice_id, invoice_number, items: [...], total }
```

All current entry points call this. The OLD endpoints stay alive for one
release as thin aliases that translate to the new shape, then get deleted.

### Step 3.2 — Idempotency

Add unique constraints to `invoice_items`:
```sql
-- Hourly: one invoice item per (project, year, month)
CREATE UNIQUE INDEX invoice_items_hourly_unique
  ON invoice_items (project_id, period_year, period_month)
  WHERE period_year IS NOT NULL;

-- Footage: one invoice item per project (project bills once when complete)
CREATE UNIQUE INDEX invoice_items_footage_unique
  ON invoice_items (project_id)
  WHERE period_year IS NULL;
```

`POST /api/billing/run` does `ON CONFLICT DO NOTHING`. Re-running for the
same period returns the existing invoice instead of creating duplicates.
Eliminates the "I clicked Bill twice and got charged twice" risk.

### Step 3.3 — Invoice numbering

Add a Postgres sequence + trigger:
```sql
CREATE SEQUENCE invoice_seq START 1;
-- Trigger sets invoice_number = TO_CHAR(NOW(),'YYYY-MM') || '-' || LPAD(nextval('invoice_seq')::text, 4, '0')
-- Format: 2026-05-0042
```

Currently invoice numbers are free-form. This makes audits trivial and
prevents collisions.

### Step 3.4 — Multi-template support

New table:
```sql
CREATE TABLE invoice_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) UNIQUE NOT NULL,    -- 'psc_rus', 'cox_default', etc.
  description TEXT,
  active BOOLEAN DEFAULT TRUE
);
ALTER TABLE clients ADD COLUMN invoice_template_id UUID REFERENCES invoice_templates(id);
```

`invoice_generator.js` exports a `RENDERERS` map: `{ psc_rus: renderPscRus, cox_default: renderCox, ... }`. The PDF endpoint looks up the client's template, dispatches.

Non-PSC clients (currently no template) get a stub renderer that returns
HTTP 422 with body `{ error: "Invoice template 'cox_default' not yet built — see CLEANUP_PLAN.md Track 3" }`. Makes the gap visible and trackable
instead of silently breaking when an admin tries to bill a non-PSC client.

### Step 3.5 — `wasBilled(projectId, year, month)` helper

Replace ad-hoc `billed_date IS NOT NULL` style checks with one helper.
Easier to reason about. Lives in `routes/billing.js` and gets exported to
`automation.js` for the projection logic.

**Done when:** ONE billing endpoint, idempotent, numbered, multi-template.
The 4 old entry points are aliases or deleted. Admin can attempt to bill
a non-PSC client and gets a clear "template not built" error instead of a
malformed PDF.

---

## Track 4 — UX polish

**Goal:** Reduce admin clicks per task, eliminate visual surprises.

### Step 4.1 — Split Settings into a left-rail navigation

Today `Settings` is a single scrolling modal containing: Engineering
Contracts, Contracts, Jobs, Project Types, Pricing, Clients, Migration
Tools, Data Health (after Track 2), Approvals, Users, Theme. ~1500 lines
of HTML in one modal.

Convert to: Settings sidebar (left), content area (right). Each section
becomes its own route hash (`#settings/clients`, `#settings/contracts`,
etc.) so deep links work. Render only the active section.

File: extract Settings into `public/js/settings.js` (already in Track 1.2
plan). Reorganize as a sub-router.

### Step 4.2 — Search-and-destroy `alert()`

```bash
grep -nE "alert\(" public/index.html | wc -l
```

Currently ~100+ alert() calls. Each is a blocking modal that can't be
styled or dismissed by clicking outside. Replace every one with
`window.LFS.toast.error(...)` or `.success()` or `.info()`.

The toast module already exists at `public/toast.js` — use it. Keep
`confirm()` for destructive actions where blocking is intentional.

### Step 4.3 — Cmd-K command palette

New module `public/js/command_palette.js`. Cmd-K (Ctrl-K on Windows) opens
a fuzzy-search input. Indexes:
- Every project (jump to detail)
- Every client (jump to projects filtered)
- Every contract (jump to settings)
- Every saved batch
- Common actions: "New Project", "Generate PSC RUS PDF", "Open Hours"

Algorithm: simple prefix + substring match, top 8 results. No Levenshtein
or fancy ranking initially.

Owner currently navigates by clicking through 2-3 tabs to find a project.
Cmd-K → type → enter cuts that to <2s.

### Step 4.4 — Standardize button colors

Audit every button. Apply:
- **Red bg or red border** = destructive (delete, void, remove)
- **Blue bg** = primary save/confirm action (one per modal)
- **Gray** = secondary / cancel
- **Green** = success / completion (mark billed, mark complete)

Today the visual weight of "Delete" and "Save" is sometimes the same. Easy
to misclick. Add a `.btn-danger` class that's used consistently.

### Step 4.5 — Mobile audit on the admin app

Open admin app on phone. Note every place where:
- Tap targets < 44px
- Horizontal scroll appears
- Modal exceeds viewport
- Sidebar stays open over content

Fix in priority order: Hours tab (most-used on mobile), Project detail,
Bill Selected modal. Settings can stay desktop-only for now.

The Timeclock portal already works mobile because it was built mobile-first.
The admin app needs ONE focused pass to match.

**Done when:** Settings is sub-routed, zero `alert()` calls in user-facing
code, Cmd-K shipped, button colors consistent, mobile works for the 3
most-used tabs.

---

## What's already done (don't redo)

These were fixed in the May 2026 session and are in `main`. Smoke tests
in Track 0 should cover them so they don't regress.

- Commit `1319d37` — `clientsCache` typo (was breaking Edit Project's
  contract dropdown), `loadContracts` typo in poll tick, `friendly_label`
  silently dropped by POST/PUT `/api/contracts`, openAddContractForm race
  with renderContractsList.
- Commit `60d2a6a` — PSC RUS PDF redesign (centered logo, smaller title,
  removed metadata block, billing-month picker, Hours+$/hr for permitting,
  contract DELETE endpoint).
- Commit `ffa703d` — Dashboard refocus: PSC RUS umbrella projection
  endpoint, 90-day tile, removed Active Projects card from dashboard,
  renamed Inspection tab to PSC RUS.
- Commit `35d22e6` — Cascading deletes + 15s undo bar:
  `/api/projects/:id/with-tree`, `/api/contracts/:id?cascade=1`, undo
  buckets table, hours bulk delete YTD fix, Hours tab rollup state
  preservation.
- Commit `6aabe21` — 6-col permitting layout (Footage column), Total row.

---

## How to use this plan

When picking up a track:

1. Read the track section + the "What's already done" list.
2. Pick the next unfinished step (they're numbered).
3. Make the change directly on `main` (no worktree per memory).
4. Run smoke tests (after Track 0 lands).
5. Commit with a message that references the track + step number, e.g.
   "Track 1.2 step 3: extract tree_state primitive".
6. Update this file: mark the step as `[x] DONE` inline.
7. Update `NEXT_STEPS.md` with a one-liner of what landed.

When you're done with a whole track, move it to a "Completed tracks"
section at the bottom of this file and start the next one.

If you discover something this plan didn't anticipate, add it as a new
step in the relevant track (or a new track if it doesn't fit) — don't
silently work around it.
