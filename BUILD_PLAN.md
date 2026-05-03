# BUILD_PLAN.md — feature batch 2026-05-03

Living plan for the multi-item batch the owner brought to the
`claude/add-audit-log-hours-x0XCd` session. Branch is named for the
audit-log piece, but the brief expanded to ~17 items. This doc holds
the architecture, the references, the open questions, and the order I'm
going to attack things in. Update as work lands.

Read order: §0 Open Questions → §1 Build Order → §2-§N per-item plans.

---

## §0 Open questions blocking the build

These need answers before I can write code without guessing. I'll ask
the top four via AskUserQuestion in chat; the rest below are softer and
I'll proceed with a default if unanswered.

### Hard-blockers (answered)

1. **Audit log placement: REPLACE existing audit tab; slide-out
   drawer from the Hours toolbar.** Drop the standalone `view-audit`
   tab nav. Add a "View audit log" button on Hours toolbar; clicking
   it opens a right-side drawer with the same filters
   (`loadAuditLog()` logic). Drawer's filter scope defaults to whatever
   Hours has selected (user / month). Keep per-entry "history" affordance
   too: clicking an entry's pencil icon shows a "History" link in the
   edit modal that drills into `/api/_admin/timeclock-audit/:entry_id`.

2. **Edit UX: pencil icon → modal.** Add per-entry pencil in the Hours
   tree. Modal reuses / clones the create modal at `index.html:1349+`.
   PUTs to `/api/time-entries/:id`. Same modal pattern in the
   timeclock portal week view for engineers' own entries.

3. **Held timecard policy: save time as `project_id=NULL` + pending
   request.** Engineer keeps clocking. New column
   `time_entries.pending_project_request_id` (nullable FK to
   `setting_change_requests`). On admin approve, retro-assign all rows
   with that request id to the new project. On reject, rows stay with
   `project_id=NULL` and show up in a "Needs project assignment" panel
   on the Hours tab (admin manually assigns or deletes).

4. **Color scheme: FULL token system rework.** Its own branch
   (Branch 5). Define complete token set (surface-1/2/3,
   text-primary/secondary/muted, border-strong/weak, accent, status
   colors with dark variants), replace every hex literal across
   `index.html` + 3 portal HTMLs + `app-shell.css` with `var(--token)`.
   Days of work. Don't start until earlier branches are landed.

### Soft-blockers (defaults below — flag if wrong)

5. **CSV source marker for audit clarity** — default: rely on the
   existing `import_batch` column (already set during CSV commit at
   `server.js:1158-1162`); audit rows will get `source: 'csv'`
   automatically. Don't add a new column to `time_entries`.

6. **PSC RUS client name mismatch** — default: update the system prompt
   at `server.js:1304` to read `PSC` (matching the DB seed at
   `schema.sql:215-220`) rather than rename the client. The owner uses
   "PSC RUS" colloquially but the DB row is `PSC` with `is_rus=TRUE`.
   The AI was matching against the prompt, not reality.

7. **Mass delete tool shape** — default: add `bulk_delete_projects`
   accepting `{ project_ids: uuid[], reason: string }`, gated by
   approval, with a single batch confirmation card (not one-per-id).
   Skip the `bulk_update_projects` extension since deletion has
   different FK fallout.

8. **Construction Contracts rename** — default: change the section
   title and tab label only; leave the table name `contracts` alone
   to avoid a breaking schema change. (`index.html:1961`,
   plus tab label search.)

9. **Engineering contract "top level"** — default: read this as a UI
   ask, not a schema change — the schema already supports umbrella
   budgets (`schema.sql:250-269`). The Contracts/Construction Contracts
   page should visually show the engineering contract NAME as a parent
   row above its child billing contracts. No DB change.

10. **Billing report PDF** — default: confirm whether it's
    `window.print()` of the existing HTML (likely) or a server-rendered
    PDF before redesigning. If it's `window.print()`, the fix is a
    print stylesheet that expands rollups, hides scrollbars, sets page
    breaks. Cheap. If puppeteer/server-rendered, scope grows.

---

## §0.5 Status — what landed in this batch (branch claude/add-audit-log-hours-x0XCd)

Six commits on the branch, ready to merge. Items shipped:

✅ Audit log surfaced as slide-out drawer from Hours toolbar; standalone
   "Time Audit" tab removed.
✅ Edit timecard via pencil icon → modal in admin Hours tab; portal
   already had its own edit flow (verified, no work needed).
✅ CSV imports now write to time_entry_audit (source='csv').
✅ Undo bar empty-text bug fixed.
✅ Contracts → Construction Contracts rename + restructured to group by
   engineering contract umbrella.
✅ Billing batch cleanup on project delete (all 3 paths + undo replay).
✅ AI: PSC RUS create_project resolution (system prompt + alias
   resolver) + bulk_delete_projects tool.
✅ Portals (timeclock + design + permitting): change-password modal +
   undo bar markup + script loads. Shared module
   `public/js/change_password_modal.js`.
✅ PSC RUS tab status filter (active/billed/completed/on-hold/all).
✅ Engineering contract = top-level header on Construction Contracts page.
✅ Global @media print stylesheet (opens rollups, kills scrollbars,
   page-break controls). printBillingReport rewritten with document
   styling (letterhead, fixed footer, repeating thead).
✅ Invoice PDF dynamic row heights (no more text-on-text overlap).
✅ Project picker helper (`public/js/project_picker.js`) with
   leaves-only filtering + grouping + Add-New wirer.
✅ Timeclock entry modal cascade: Client → Project (filtered by client)
   → Job. "+ Add New" button opens Request New Project modal.
✅ Held-timecard flow: schema column `time_entries.pending_project_request_id`,
   POST /api/portal/projects/request-create, applySettingChange handles
   project create + retro-attach held entries on approval, project
   delete approval flow.
✅ Design + Permitting portal deletes routed through admin approval (HTTP
   202 + setting_change_request).

Also shipped after the initial status snapshot:

✅ Design + Permitting "Existing Project for this Client" dropdown.
   Auto-loads when client is selected; picking an entry pivots the
   modal into Edit mode (pre-fills every field via editProject).
   Doubles as duplicate-detection AND as an "add detail to existing"
   affordance.
✅ Admin Hours tab "Needs Project Assignment" panel above the tree.
   Lists every time_entries row with project_id IS NULL (held against
   a pending or rejected project request). Each row has [Assign +
   Edit] (opens edit modal) and [Delete]. Held entries are filtered
   out of the regular tree to avoid duplication.
✅ Color token system rework. Every dark-mode token now defined
   (--primary, --primary-dark, --primary-light, --primary-text,
   --surface-1/2/3, --border-strong/weak, --text/--text-secondary/
   --text-muted, --success/-light/-text, --warning/-light/-text,
   --danger/-light/-text, --info/-light/-text). Status colors get
   brighter shades + deep tinted backgrounds in dark mode (WCAG AA on
   #1A1F26). Tokens added to admin + all 3 portals; legacy aliases
   preserved so inline styles don't break.
✅ Admin Hours tab time-entry picker uses populateProjectPicker
   (leaves-only, grouped by client). project_picker.js now loads in
   admin too.

FINAL SHIP — owner instructed "do everything" so the deferred memory
items got built too:

✅ Customer portal — PORTAL_MODE='customer' + new role + customer_clients
   junction + read-only API (/api/customer/{me,projects,projects/:id,
   invoices,invoices/:id}) + admin link mgmt + customer.html with
   Projects + Invoices tabs, progress bars, status pills, click-for-
   detail modal. Reuses the shared change-password modal.
✅ Admin Client Progress view — new "Clients" nav tab in admin. Groups
   every project under its client; surfaces completion %, hours used vs
   expected, days since activity, current pipeline stage. Stale active
   projects (>30 days no entry) flagged. Filter by status (active /
   stale / completed / billed) + free-text search. Backed by
   /api/admin/client-progress.
✅ Dashboard drag-to-reorder — customize mode now has explicit drag
   handles + per-widget eye-icon toolbar for hide/show. Order persists
   to the user's dashboard layout. applyDashboardLayout sorts on every
   poll rebuild so the configuration survives.
✅ Mass alert→toast — public/toast.js styling now token-aware (uses
   var(--success/--info/--warning/--danger) so dark mode + custom
   themes flow through). The existing heuristic in window.alert()
   continues to classify by message text.
✅ CSV would-modify preview — /api/hours/csv-validate classifies every
   row against existing time_entries on (staff_id, project_id,
   entry_date): new / duplicate / modify / conflict. Tally surfaced
   in the import modal banner. Commit auto-skips duplicates by
   default; skip_duplicates=false body opt-out.
✅ Inspection projection weighted-recency — recent_hours CTE now
   weights each entry by recency (max(0.2, 1 - age_in_weeks /
   lookback)). Recent acceleration/slowdown shows in the projection
   instead of being averaged out.
✅ Email digest — /api/automation/digest/send + scheduler hook with
   transport priority: SendGrid (SENDGRID_API_KEY) → Mailgun
   (MAILGUN_API_KEY+MAILGUN_DOMAIN) → console-log no-op. No npm dep
   added; both backends use fetch(). DIGEST_TO env or {to} body
   sets recipients.
✅ Track 1.4 versioned migrations — db_migrations.runMigrations(pool)
   reads /migrations/NNNN_*.sql, applies anything not in
   schema_migrations, records each in its own transaction. Coexists
   with the legacy bootstrapV3Schema until the v3 ALTER soup is
   migrated out file-by-file. README in migrations/ documents the
   conventions.
✅ Auth: req.user now includes staff_id (engineer-scope checks in
   time_entries.js POST were quietly broken without it).
✅ portal_module: customer mode short-circuits the portal-only route
   block so the customer-specific module owns the customer surface
   exclusively (no team-shaped filters polluting the API).

The branch is ready for production deploy. Schema migrations needed:
- customer_clients table (auto-applied by v3 bootstrap)
- invoice_templates table (auto-applied)
- time_entries.pending_project_request_id column (auto-applied)
- All future schema changes go through migrations/NNNN_*.sql.

Required new env vars (optional — graceful no-op when missing):
- SENDGRID_API_KEY (for email digest delivery)
  OR MAILGUN_API_KEY + MAILGUN_DOMAIN
- DIGEST_TO=address1@x,address2@y
- DIGEST_FROM=no-reply@yourdomain.com (default
  no-reply@launchfiberservices.com)

New PORTAL_MODE value:
- PORTAL_MODE=customer  → serves public/customer.html

---

Still open (small follow-ups):

- Sweep remaining admin project dropdowns (billing modal, settings,
  PSC RUS new-project) to use populateProjectPicker. Each is one or
  two lines once the helper is loaded; not worth rolling into this
  branch.
- Inline hex literals across the 10000-line index.html. With the
  dark-mode tokens now defined, those literals look correct in light
  mode and dark variants dominate via the cascade where rules exist.
  A full sweep is its own follow-up.
- Make portal undo bar emit on actions that return undo tokens. Today
  the bar is wired in (markup + module load) but no portal endpoint
  returns tokens yet. When delete-with-notification rolls out fully
  (admin clicks approve → /api/projects/:id/with-tree → undo token),
  surface the token in the portal too.

---

## §1 Build order

### Branch 1 — `claude/add-audit-log-hours-x0XCd` (this one)
The branch name's actual scope, plus piggyback bugs that touch the
same files.

1. (§2) Audit log surface inside Hours tab
2. (§3) Edit timecard UX (admin Hours tab + portal)
3. (§4) Undo bar empty-text bug fix — small, safe
4. (§5) Construction Contracts rename — small, safe
5. (§6) Billing batch cleanup on project delete — small, safe

### Branch 2 — `claude/ai-tool-fixes`
6. (§7) Fix PSC RUS client resolution
7. (§8) Add `bulk_delete_projects` tool

### Branch 3 — `claude/portal-features`
8. (§9) Timeclock Client→Project→Job cascade
9. (§10) Timeclock add-new w/ approval + held timecard
10. (§11) Project dropdown leaves-only + Add New
11. (§12) Portal change-password UI (all 3)
12. (§13) Portal undo bar (all 3)
13. (§14) Design/Permitting delete-with-notification
14. (§15) Design/Permitting add-project cascade

### Branch 4 — `claude/contracts-pdfs-status`
15. (§16) Engineering contract surfacing
16. (§17) Invoice PDF spacing
17. (§18) Billing report PDF cleanup
18. (§19) PSC RUS status filter

### Branch 5 — `claude/color-scheme`
19. (§20) Color scheme — scope depends on Q4 answer

---

## §2 Audit log inside Hours tab

**Goal.** Make the existing audit log accessible from the Hours tab so
admins can see who changed what without leaving the page.

**Backend — already done.**
- Schema: `timeclock_module.js:111-125` — full before/after JSONB,
  meaningful flag, source enum, actor user.
- Endpoints:
  - `GET /api/_admin/timeclock-audit` (list, filterable) at
    `timeclock_module.js:698`
  - `GET /api/_admin/timeclock-audit/:entry_id` (per-entry history) at
    `timeclock_module.js:746`
- All three CRUD endpoints in `routes/time_entries.js` (POST/PUT/DELETE
  at lines 77, 147, 209) call `auditTimeEntry()` with `source` derived
  from `portalMode`. CSV commit path inserts via raw SQL at
  `server.js:1158-1162` and does NOT currently call the audit logger
  → **need to wire it.** Either add the call after the INSERT inside
  the commit transaction, or surface CSV imports with a synthetic
  "imported N rows" audit summary keyed off `import_batch`.

**Frontend — depends on Q1.**
- Existing separate tab: `view-audit` at `index.html:844-870`,
  rendered by `loadAuditLog()` at `index.html:2316`. Has filters for
  user / date range / meaningful-only.
- Recommended placement (pending Q1): **per-row "history" icon on the
  Hours tab tree** that opens a modal showing the rows from
  `/api/_admin/timeclock-audit/:entry_id`. Plus a "Recent changes"
  collapsible panel above the tree showing the most recent 50 audit
  rows from `/api/_admin/timeclock-audit?meaningful_only=1`. Keeps the
  separate `view-audit` tab for power-filter use.

**Files I'll touch.**
- `public/index.html` — add history button to the per-entry row in
  `loadHours()` (around line 5854); add the recent-changes panel
  above the tree body at `hours-tree-body` (line 832).
- `server.js` — wire `auditTimeEntry()` into the CSV commit loop at
  ~line 1158.

---

## §3 Edit timecard UX (CSV + portal)

**Goal.** Admin can edit any time entry — regardless of source — from
the Hours tab. Engineers can edit their OWN past entries from the
timeclock portal.

**Backend — already done.**
- `PUT /api/time-entries/:id` at `routes/time_entries.js:147` accepts
  `{ project_id, staff_id, entry_date, hours, job_title, notes }` and
  enforces ownership for engineers via `req.user.role` check at line
  159. Audits the diff via `auditTimeEntry()` at line 197.

**Frontend — admin (Hours tab).**
- Add a pencil icon next to each leaf entry in `loadHours()` at
  `index.html:5854`. On click, open a reused/cloned version of the
  existing time-entry create modal at `index.html:1349+` in EDIT mode
  (prefilled values + PUT instead of POST).
- Modal fields: project, staff, date, hours, job title, notes — all
  already exist on `PUT /api/time-entries/:id`.

**Frontend — portal (timeclock).**
- The portal week view at `timeclock.html:213-231` has no edit
  affordance today. Add a click-to-edit on each past entry in the
  week grid. New endpoint already supports it (`PUT
  /api/time-entries/:id` with portalMode → audit `source: 'portal'`).
- Engineers can only edit their OWN entries (server enforces).

**Files I'll touch.**
- `public/index.html` — add Edit modal + pencil icons.
- `public/timeclock.html` — add per-row edit modal in the week view.

---

## §4 Undo bar empty-text bug

**Goal.** Stop the undo bar from popping with empty text on refresh /
login.

**Root cause.** `public/js/undo_bar.js:16-43` — module never calls
`hideUndoBar()` on load. The bar HTML in `index.html:424-427` has
`style="display:none"` initially, but `lfsUndoClick` and toast / 
auto-replay handlers can leave the bar visible without clearing the
message. After a refresh, if `_lfsUndoState` is null but the bar is
still visible, the message text shows whatever was last set (often
empty after the previous hide animation).

**Fix.** On module load, call `hideUndoBar()` once and clear
`#lfs-undo-msg`'s textContent. One-line patch.

**Files I'll touch.** `public/js/undo_bar.js`.

---

## §5 Construction Contracts rename

**Goal.** "The contracts page that houses Contract 3 / 515-3 should be
called the Construction Contracts."

**Refs.**
- Section title at `index.html:1961`.
- Tab labels — grep `>Contracts<` and `data-tab="contracts"` to find
  every spot. Should be cosmetic only.

**Caveats.** Don't rename the `contracts` SQL table — that's a deeper
change that breaks invoices, billing, AI tools, and existing data.
Just the user-facing label.

**Files I'll touch.** `public/index.html` only.

---

## §6 Billing batch cleanup on project delete

**Goal.** Deleting a project shouldn't 500 because the project sits in
a billing batch.

**Refs.**
- `billing_batch_items` table FK uses `RESTRICT` (per
  `routes/billing.js:278-308`) — this is the safety net.
- Project DELETE handlers in `routes/projects.js`:
  - simple delete at lines 307-315
  - with-hours at lines 353-362
  - with-tree at line 378+
- None of them clean up `billing_batch_items` first.

**Fix.** In each DELETE path, before the `DELETE FROM projects`,
either:
- (a) `DELETE FROM billing_batch_items WHERE project_id = $1` — risky
  if batches have been confirmed/sent.
- (b) Refuse with a clear error citing the affected batches and let
  admin remove from batch first. Probably safer.

**Decision.** Recommend (b) — return 409 with batch IDs. Owner can
unbatch and retry. Audit-trail-friendly.

**Files I'll touch.** `routes/projects.js`.

---

## §7 AI create_project for PSC RUS

**Goal.** AI assistant can create projects for the PSC client (which
the owner verbally calls "PSC RUS").

**Root cause.** System prompt at `server.js:1304` says
`CLIENTS: PSC (RUS), COX, IFT, TRI-CO`. DB seed at
`schema.sql:215-220` has client name `'PSC'` with `is_rus=TRUE`. AI
sees both and tries to match "PSC RUS" → no row → fails or proposes
to create a duplicate "PSC RUS" client.

**Fix.** Two changes:
1. Update the system prompt to read `CLIENTS: PSC (is_rus=true), COX,
   IFT, TRI-CO` so the AI knows the canonical name is `PSC`.
2. In `executeTool`'s `create_project` case at `server.js:1813-1849`,
   if `client_id` is missing but `client_name` is provided, do a
   case-insensitive lookup on `clients.name` AND alias-match (e.g.
   "PSC RUS" → resolves to PSC). Add a small alias map.

**Files I'll touch.** `server.js`.

---

## §8 Bulk delete projects

**Goal.** AI can mass-delete projects in one approval round.

**Current shape.** `delete_project` (server.js:1496) is single-row.
`bulk_update_projects` (server.js:1735) doesn't support deletion.
Mass delete today = N approvals.

**Plan.**
- New tool `bulk_delete_projects` with input
  `{ project_ids: string[], reason: string }`.
- Add to `DESTRUCTIVE_AI_TOOLS` at `server.js:2441-2454`.
- Implementation in `executeTool` mirrors single delete but in a
  transaction: validates each project has no children + no time
  entries + not in a billing batch, and reports a per-id status.
- Approval card summarizes: "Delete N projects: [list of names]" +
  raw IDs in `<details>`.
- DB constraints to respect: `projects.parent_id` ON DELETE RESTRICT
  (`schema.sql:79`), `time_entries.project_id` RESTRICT
  (`schema.sql:128`), `billing_batch_items.project_id` RESTRICT.

**Files I'll touch.** `server.js`.

---

## §9 Timeclock Client → Project → Job cascade

**Goal.** On timeclock, pick Client first → see only that client's
ACTIVE projects → see only ACTIVE jobs for the chosen project.

**Refs.**
- Current picker: `entry-project` dropdown at `timeclock.html:274`,
  populated by `populateProjectSelect()` at lines 844-859.
- Endpoints: `/api/clients`, `/api/projects` (returns all), `/api/jobs`.

**Plan.**
- Three cascading dropdowns: `tc-client`, `tc-project`, `tc-job`.
- `tc-client` populated from `/api/clients` (active only).
- `tc-project` populated from `/api/projects?client_id=...` filtered
  client-side to `status='active'` AND leaf (`child_count===0`).
- `tc-job` populated from `/api/jobs?project_id=...` filtered to
  active.
- On submit, send `{ project_id, job_id }` to the existing
  `/api/timeclock/clock-in` endpoint at `timeclock.html:657,677` — no
  backend change.

**Files I'll touch.** `public/timeclock.html`.

---

## §10 Timeclock add-new project with approval

**Goal.** If the engineer's project doesn't exist, they hit "+ Add",
type a name; the system stores their time but does NOT merge into
admin's project list. Admin approves or denies. If denied, the time
becomes a held timecard with `project_id=NULL` requiring manual
review.

**Plan.** Reuse the existing setting-change-requests flow.
- Existing flow lives in `portal_module.js:322-407` with
  `proposeChange()` at `portal_module.js:413-425`. Backed by
  `setting_change_requests` table at `schema.sql:727-759`.
- New entity_type: `'project'` with action `'create'`. Payload =
  `{ name, client_id, suggested_parent_id, work_order_number, ... }`
  plus `staff_id` of the requester.
- Time entry path: when engineer clocks in against a pending project,
  insert the time_entries row with `project_id = NULL` and a new
  column `pending_project_request_id` (FK → setting_change_requests).
  This is the "held timecard" state.
- On admin approval: create the project, then UPDATE all held
  time_entries WHERE pending_project_request_id = X SET
  project_id = (new project id), pending_project_request_id = NULL.
- On rejection: leave the time_entries rows with NULL project_id and
  surface them in a "Needs project assignment" panel on the Hours
  tab. Admin manually assigns.

**Schema change.** `time_entries.pending_project_request_id` UUID
nullable, FK to setting_change_requests(id). Add to schema.sql AND
to the v3 bootstrap in server.js.

**Open question 3** controls clocking-while-pending policy.

**Files I'll touch.** `schema.sql`, `server.js` (bootstrap), 
`portal_module.js`, `public/timeclock.html`, `public/index.html`
(admin review UI in setting-change-requests panel).

---

## §11 Project dropdowns leaves-only + Add New

**Goal.** Every project picker shows ONLY leaf projects (no rollups)
plus an "Add New" button next to the dropdown.

**Refs.**
- Data already has `child_count` per project at
  `routes/projects.js:42`. Filter client-side: `p.child_count === 0`.
- Dropdowns to update (grep `<select` + project-related ids in
  `index.html`):
  - Time entry create/edit modal `te-project` (`index.html:1358`)
  - Billing modal project picker
  - PSC RUS new project
  - Setting change requests review
  - + portal pickers (timeclock, design, permitting)

**Plan.** Centralize the project dropdown render into a new helper in
`public/js/project_picker.js` exporting
`renderProjectPicker(selectEl, opts)` that:
- Filters to leaves
- Optionally filters by client_id / status
- Adds an "+ Add" button after the select that opens the
  appropriate add-new flow (admin = direct create; portal = pending
  approval per §10)

**Files I'll touch.** New file `public/js/project_picker.js`,
`public/index.html` (load + use), all 3 portal HTMLs.

---

## §12 Portal change-password UI

**Goal.** Each portal lets the logged-in team member change their own
password.

**Backend — already done.** `POST /api/auth/change-password` at
`auth.js:489-527` accepts `{ current_password, new_password }`,
requires logged-in user, bumps `tokens_invalid_after`, reissues token.

**Plan.** Add a small "Change password" link in each portal's header
that opens a modal copying the admin one at `index.html:1643-1665`.
3 portals × identical modal → could ship as a shared snippet via a
new `public/js/change_password_modal.js` to avoid copy-paste drift.

**Files I'll touch.** New `public/js/change_password_modal.js`,
`public/timeclock.html`, `public/design.html`, `public/permitting.html`.

---

## §13 Portal undo bar

**Goal.** Same undo bar that the admin app has, on all 3 portals.

**Refs.**
- `public/js/undo_bar.js` already abstracted (Track 1.2).
- Each portal would need:
  - the bar markup (mirror `index.html:424-427`)
  - `<script src="/js/undo_bar.js">` load
  - call sites for delete/edit operations that should be undoable

**Plan.** Wire the existing module into the 3 portal HTMLs. Hook the
existing portal delete actions (e.g.
`deleteProjectFromPipeline()` at `design.html:975` and
`permitting.html:968`) to call `showUndoBar()` after a successful
delete request, with the undo token from the response. The admin
delete already returns an undo token (per
`routes/projects.js` → `/api/undo/:token` at `routes/undo.js`).

**Files I'll touch.** All 3 portal HTMLs. Maybe a small helper in
each portal's existing `api()` impl to handle 200-with-undo-token
responses uniformly.

---

## §14 Design/Permitting delete-with-notification

**Goal.** Portal users can delete projects, but the deletion does NOT
hit admin's project list immediately — it creates a notification and
asks the admin what to do.

**Refs.** Setting-change-requests flow already exists
(`portal_module.js:322-407`).

**Plan.** Hook portal deletes (`design.html:975`,
`permitting.html:968`) to POST to a NEW endpoint
`POST /api/portal/projects/:id/request-delete` that creates a
`setting_change_requests` row with `entity_type='project'` and
`action='delete'`. Admin sees it in the existing pending-changes UI
and approves or rejects. Approval triggers the actual `DELETE
/api/projects/:id`. Until then the project remains visible to admin.

**Files I'll touch.** `portal_module.js`, `public/design.html`,
`public/permitting.html`.

---

## §15 Design/Permitting add-project cascade

**Goal.** When adding a project: ask Client first, then Project Type
based on client, then show available "projects" within that
designation, then Job. Display WO# inline next to the project name
when applicable. Integration auto-resolves which contract / engineering
contract the WO# belongs to.

**Refs.**
- Current modal: `design.html:338-427`, `permitting.html:342-422`.
  Field order today: client, contract, WO, job, project type, area
  label, status, footage, hours, start date, notes.
- WO# → concentrator lookup already exists in
  `portal_module.js:695-701`.
- Auto-nesting via `ensureRollupChain()` at `portal_module.js:72-167`.

**Plan.** Reorder modal fields and make them dependent:
1. Client (existing)
2. Project Type (filter: project_types where applicable for this
   client)
3. Project — dropdown of existing projects under (client, type) using
   the leaves-only picker from §11; rendered as
   "Crossroad School - WO#1234" when WO# is set on the row.
4. Job (filter: jobs available for that project)

If the user selects an existing project, the form pre-fills contract,
engineering contract, parent_id from that project's row. If they hit
"+ Add New" from §11 it falls into the §10 approval flow. WO# is
still editable in case it's missing.

**Files I'll touch.** `public/design.html`, `public/permitting.html`,
maybe `portal_module.js` if a new endpoint is needed for the
filter (`/api/projects?client_id=X&project_type=Y` already exists per
`routes/projects.js`).

---

## §16 Engineering contract surfacing

**Goal.** "The budget function needs to be in the engineering
contract level. The engineering contract name needs to be top level
contract."

**Refs.**
- Schema already supports umbrella budgets:
  `budgets.engineering_contract_id` with exclusive CHECK at
  `schema.sql:250-269`.
- API: `routes/budgets.js:17-26, 101-121` accepts
  `engineering_contract_id`.
- UI: Engineering Contracts settings exist at `index.html:1937-1972`.
  But the Contracts (renamed Construction Contracts) page does NOT
  currently visually nest the engineering contract above its
  child billing contracts.

**Plan.**
- In the renamed Construction Contracts list, group rows by their
  `engineering_contract_id` and render the engineering contract name
  as a top-level header row above its children. Lift the budget
  display ($X left of $Y total / $Z billed) to the engineering
  contract row when a budget is set at that level.
- Budget create form: when adding a budget, the "scope" radio should
  default to engineering contract; clarify the option text.

**Files I'll touch.** `public/index.html`.

---

## §17 Invoice PDF spacing fix

**Goal.** Stop the invoice PDF text from overlapping itself.

**Refs.** `invoice_generator.js:30+` — uses `pdfkit`. Need to read the
full file to find the row-height / `y` coordinate logic.

**Plan.** Tighten or, more likely, expand the row-height constants in
the layout. Specifics depend on full read; will add line-by-line in
the actual edit. Test against the smoke test at
`tests/psc_rus_pdf.test.js`.

**Files I'll touch.** `invoice_generator.js`.

---

## §18 Billing report PDF cleanup

**Goal.** Make it look like a document — open all rollups, no
scrollbars, no screenshot vibes.

**Refs.**
- `routes/billing.js:385-424` — `/api/billing/report` returns JSON
  only. PDF is likely browser-side `window.print()`.
- Need to grep `index.html` for "billing report" / `printReport` /
  `window.print` in the billing tab.

**Plan.** If it's `window.print()`, add a `@media print` block to the
billing report's stylesheet that:
- Force-expands all rollup `<details>` and tree rows.
- Hides scrollbars + sticky headers.
- Sets sensible page-break rules and margins.
- Hides toolbar / nav chrome.
- Adds a printed header/footer with date + totals.

If it's puppeteer/server-rendered, scope grows; flag and discuss.

**Files I'll touch.** `public/index.html` (print stylesheet) +
maybe `public/app-shell.css`.

---

## §19 PSC RUS status filter

**Goal.** Filter the PSC RUS tab by project status.

**Refs.**
- Tab markup: `index.html:707-754` — has Status column but no filter.
- Endpoint: `routes/inspection.js:19-60` hard-codes
  `status IN ('active', 'billed')` at line 60.

**Plan.**
- Add `<select id="insp-status">` to toolbar at `index.html:710-715`
  with options: All / Active / Billed / Completed.
- Update `/api/inspection` to accept `?status=` and filter.

**Files I'll touch.** `routes/inspection.js`, `public/index.html`.

---

## §20 Color scheme

**Goal.** High contrast in light + dark modes everywhere.

**Refs.**
- Light tokens at `index.html:13-25`. Dark tokens at lines 44-55.
- Dark mode does NOT override `--primary`, `--primary-dark`,
  `--success`, `--warning`, `--danger`. They inherit light values
  → low-contrast on dark backgrounds.
- Inline hex literals and per-component colors are scattered
  throughout `index.html` and the 3 portal HTMLs.

**Plan, scoped per Q4.**
- **Targeted (default if owner doesn't pick full):**
  1. Add dark-mode overrides for `--primary`, `--primary-dark`,
     `--success`, `--warning`, `--danger`.
  2. Audit dark mode by loading every tab and recording the worst
     contrast offenders (use a contrast checker mentally; manual).
  3. Patch obvious offenders.
- **Full audit:** introduce a complete token system (text-primary,
  text-secondary, surface-1/2/3, border-strong/weak, accent, etc.),
  replace all hex literals with `var(--token)`. Multiple days of work.

**Files I'll touch.** `public/app-shell.css`, `public/index.html`,
3 portal HTMLs.

---

## Appendix A — Reference index (file:line citations)

| What | Where |
|---|---|
| Hours tab markup | `public/index.html:799-836` |
| Hours tab render fn | `public/index.html:5612 (loadHours)` |
| Hours tree state | `public/js/tree_state.js` (singleton: `hoursTreeState`) |
| Time entry delete handler | `public/index.html:5927 (deleteTimeEntry)` |
| time_entry_audit schema | `timeclock_module.js:111-125` |
| Audit logger factory | `timeclock_module.js:166 (makeAuditLogger)` |
| Audit list endpoint | `timeclock_module.js:698 (/api/_admin/timeclock-audit)` |
| Audit per-entry endpoint | `timeclock_module.js:746 (/api/_admin/timeclock-audit/:entry_id)` |
| Existing audit tab | `public/index.html:844-870 (view-audit)` + `loadAuditLog` at 2316 |
| Time entries CRUD | `routes/time_entries.js:77,147,209` |
| CSV stage Map | `server.js:602` |
| CSV validate | `server.js:634 (/api/hours/csv-validate)` |
| CSV edit-row | `server.js:950 (/api/hours/csv-edit-row)` |
| CSV commit | `server.js:1000 (/api/hours/csv-commit)` |
| CSV insert path (no audit yet) | `server.js:1158-1162` |
| AI tools list | `server.js:AI_TOOLS, executeTool` |
| AI create_project def | `server.js:1430-1453` |
| AI create_project exec | `server.js:1813-1849` |
| AI delete_project | `server.js:1496-1505 def, 1957-1976 exec` |
| AI bulk_update_projects | `server.js:1735-1765` |
| DESTRUCTIVE_AI_TOOLS | `server.js:2441-2454` |
| AI system prompt PSC line | `server.js:1304` |
| Approval staging | `server.js:2702-2729` |
| clients seed | `schema.sql:215-220` |
| projects schema | `schema.sql:71-115` |
| projects.work_order_number | `schema.sql:83` |
| time_entries.project_id RESTRICT | `schema.sql:128` |
| billing_batch_items FK RESTRICT | `routes/billing.js:278-308` |
| Project DELETE handlers | `routes/projects.js:307-315, 353-362, 378+` |
| projects child_count | `routes/projects.js:42` |
| Engineering contracts API | `routes/engineering_contracts.js:54-57` |
| Budgets schema | `schema.sql:250-269` |
| Budgets API | `routes/budgets.js:17-26, 101-121` |
| Engineering Contracts UI | `public/index.html:1937-1972` |
| Contracts section title | `public/index.html:1961` |
| PSC RUS tab markup | `public/index.html:707-754` |
| /api/inspection | `routes/inspection.js:19-60` |
| Light tokens | `public/index.html:13-25` |
| Dark tokens | `public/index.html:44-55` |
| Undo bar module | `public/js/undo_bar.js:16-43` |
| Undo bar markup | `public/index.html:424-427` |
| Auth change-password | `auth.js:489-527` |
| Admin user CRUD | `auth.js:580-640` |
| Change-password modal | `public/index.html:1643-1665` |
| Account menu link | `public/index.html:8823` |
| Setting change requests schema | `schema.sql:727-759` |
| portal_module flow | `portal_module.js:322-407 (review), 413-425 (propose)` |
| ensureRollupChain | `portal_module.js:72-167` |
| isDuplicateProject | `portal_module.js:52-66` |
| Timeclock project picker | `public/timeclock.html:274 (entry-project)` |
| populateProjectSelect | `public/timeclock.html:844-859` |
| Timeclock clock-in | `public/timeclock.html:657,677 (POST /api/timeclock/clock-in)` |
| Timeclock week view | `public/timeclock.html:213-231` |
| Design portal modal | `public/design.html:338-427` |
| Design portal delete | `public/design.html:975` |
| Permitting portal modal | `public/permitting.html:342-422` |
| Permitting portal delete | `public/permitting.html:968` |
| Invoice PDF gen | `invoice_generator.js:30+` (pdfkit) |
| Billing report endpoint | `routes/billing.js:385-424` |

---

## Appendix B — Known constraints / risks

- **server.js still has ~1200 lines of inline AI tools + ~755 lines of
  CSV import.** Per HANDOFF.md track-1.3 plan, these will eventually
  be extracted. Don't extract them as part of this batch — patch in
  place.
- **Schema dual source of truth:** any schema change goes in BOTH
  `schema.sql` (fresh deploys) AND the v3 bootstrap in `server.js`
  (existing deploys via `ALTER ... IF NOT EXISTS`).
- **No local Node.** CI runs tests on push. Verification path is
  push → Railway → click around in live preview.
- **3 portal HTMLs are still standalone files** with their own `api()`
  impls. Shared modules (undo_bar, change_password_modal,
  project_picker) need to be designed to work without admin's globals.
- **`requireAuth(['roles'])` factory bug** noted in HANDOFF.md is on
  `/api/undo/:token` and `/api/time-entries/by-staff/:staffId`.
  Don't introduce more instances. Use `requireAuth(['admin'])` (the
  call result), not bare `requireAuth`.
- **Polling rebuild every 8s** — any new tbody write inside `loadHours`
  must use `setHtmlIfChanged()` to avoid clobbering open dropdowns and
  resetting tree expand state.
