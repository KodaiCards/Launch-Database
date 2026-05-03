# NEXT_STEPS

Living handoff doc for the next Claude (or human) picking up where we left off.
Update this file as work lands or new ideas surface. Last updated 2026-05-02.

## Currently deployed
All commits land directly on `main` (worktrees disabled — see memory).
Railway auto-deploys all 4 services from `main`. Recent commits:

1. `5dbda8f` — Initial security pass (JWT, RBAC, CSRF, schema RESTRICTs)
2. `586c64e` — Dropdown re-render flicker fix + redundant text removed
3. `287dc62` — Quick-clock, keyboard shortcuts, Needs Attention, bulk actions
4. `d959e3e` — Autosave, fuzzy search, alert→toast, mobile timeclock, Hours group-by
5. `04de98d` — Inspection revenue projection + per-user dashboard layout
6. `cb32f48` — Bill-now preview + Hours calendar grid
7. `bac9e39` — NEXT_STEPS handoff doc (initial)
8. `14a4438` — **Engineering Contracts: umbrella above billing contracts**
   - new `engineering_contracts` table; `contracts.engineering_contract_id`;
     `budgets.engineering_contract_id` with CHECK exactly-one-of project/umbrella
   - inspection projection rolls up by umbrella when budget is at that level;
     UI shows "$X left of $Y total / $Z billed" per umbrella row
   - Settings → Engineering Contracts CRUD UI
9. `99fba96` — **AI: expanded tools + approval-gate**
   - new tools: create_engineering_contract, update_contract_umbrella,
     bulk_update_projects, write_sql, create_user, deactivate_user
   - DESTRUCTIVE_AI_TOOLS list; staged-then-approved flow with bundled diff
     in chat; admin clicks "Apply selected" / "Reject all" before any mutation

## Required Railway env vars (must be set before deploy)
- `JWT_SECRET` — production refuses to boot without it
- `ADMIN_PASSWORD` — 10+ chars; admin user is seeded from this
- `ALLOWED_ORIGINS` — comma-separated, no trailing slashes:
  `https://launchfiberadminportal.xyz,https://launchfiberdesignportal.xyz,https://launchfiberpermittingportal.xyz,https://launchfibertimeclock.xyz`
- `BUSINESS_TZ` = `America/New_York`
- `ANTHROPIC_API_KEY` — for the AI chat
- `DATABASE_URL` — Railway auto-injects
- `UPLOAD_DIR` — set to volume mount on the admin service only

---

## Open work, prioritized

### Blocked on input
- **PSC invoice PDF generator** — biggest unrealized goal in CLAUDE.md
  ("PSC has a specific format requirement"). Owner is gathering Excel
  samples. Drop them into `docs/invoice-samples/` (one per job format,
  named `{job-name-kebab}-invoice-sample.xlsx`). When samples exist,
  build a deterministic generator that:
  - Reads the matching sample at invoice time (xlsx skill is available)
  - Uses the existing `/api/automation/billing-draft/monthly` data as
    input
  - Outputs a PDF (use puppeteer or pdfkit — adds one dep, justified by
    being the make-or-break feature)
  - Wires into the existing /api/billing/bill-multiple as a "Generate
    PDF & download" action after invoice creation
  - Per-job format selection driven by `jobs.billing_code` or `jobs.name`

### High-leverage, ready to build
- **Customer self-service portal** (memory file:
  `feature_customer_portal.md`). Owner has confirmed long-term goal but
  not for immediate build. Likely scope: PORTAL_MODE='customer', new
  `customer` role in VALID_ROLES, per-client login. Ask owner before
  starting — open questions in the memory file.
- **Client progress view (admin)** (memory file:
  `feature_client_progress_view.md`). Build this BEFORE the customer
  portal — it's the internal version of the same data. Group projects
  by client, show completion %, hours used vs expected, days since last
  activity, current pipeline stage. Probably a tab on the existing
  client detail or a `/clients/:id/progress` route.
- **Daily/weekly digest email** — endpoints exist (`/api/automation/digest`
  + the scheduler logs it). Adding nodemailer + a SMTP env (SendGrid or
  Mailgun) gets you "Monday morning summary in inbox." CLAUDE.md says
  no new external services without a clear reason — email service IS
  arguably justified by the automation goal.
- **CSV import "would modify" preview**. The current `csv-validate`
  returns row-level data and a summary count. To show "would add 12,
  modify 3, conflict with 1" requires deduplication logic — pick a
  policy (match on staff+project+date? +job?) and check
  `time_entries` for existing rows pre-commit. Scope: ~half day. Spec
  the dedup policy with the owner first.
- **Mass alert→toast finish**. Track D's monkey-patch of `window.alert`
  catches all 110 admin sites at once. Optional next pass: convert the
  most prominent ones to typed `LFS.toast.success/error` calls with
  proper coloring instead of relying on the heuristic. Low urgency.

### Medium polish
- **Bulk-action `openBulkBillModal()`** stub. The bulkBill flow
  (Projects tab) currently calls `openBulkBillModal` if it exists,
  otherwise falls back to a confirm + direct `/api/billing/bill-multiple`
  POST. Build a proper review modal so admin can pick invoice number,
  billing period, and split-by-WO before committing.
- **Inspection projection accuracy**. Current projection uses an 8-week
  lookback × 26-week horizon, capped by remaining umbrella budget (or
  per-project budget if no umbrella). For umbrellas with mixed-rate
  children, uses hours-weighted average rate. Could improve with:
  weighted-recency (last week counts more), seasonality, per-staff pace
  (some inspectors faster than others). Talk to owner about whether the
  simple version is good enough first.
- **Calendar grid → Click a day to see entries**. Currently the
  calendar cells are read-only. Click should open a modal with the
  entries for that day, with edit/delete. ~30 min addition.
- **Per-user dashboard layout: order, not just hide.** Current implementation
  only does hide/show. Add drag-to-reorder using stable widget IDs.

### Long-term items captured in memory
- Customer self-service portal — `feature_customer_portal.md`
- Client progress view (admin) — `feature_client_progress_view.md`
- Client portal completion + revenue projection — `feature_client_portal_completion_view.md`
- Inspection revenue projection — `feature_inspection_revenue_projection.md`
  (basic version shipped + umbrella version shipped 2026-05-02; memory describes
  math + future tweaks like weighted-recency, per-staff pace, seasonality)
- Invoice samples convention — `reference_invoice_samples.md`
- No worktrees — `feedback_no_worktrees.md`

### Next conversation queued (pending discussion with owner)
The user wants to discuss these next session — DON'T start work without
asking first which they want first:
1. **Invoice printer** — needs invoice format samples in
   `docs/invoice-samples/` first (see reference_invoice_samples.md memory).
   Owner is gathering them.
2. **Data simplification** — owner has thoughts on what to consolidate or
   remove. Bring it up; let them describe.
3. **QOL improvements** — open-ended catch-all. Likely small fixes the
   owner has noticed using the system.

---

## Architectural notes / gotchas

### Branch workflow (worktrees DISABLED)
- The user has explicitly opted out of worktrees — see
  `feedback_no_worktrees.md` in memory. Work directly in the main repo
  folder (`C:/Users/Carter Trantham/Desktop/Launch Database/`).
- Default flow: commit straight to `main` and push. Railway auto-deploys
  all 4 services from `main`. Use feature branches only for risky changes
  the user wants to review separately.
- The `.claude/` directory is in `.gitignore` and should stay there
  (Claude Code metadata + leftover worktree pointers).

### Frontend re-render
- Polling rebuilds tables every 8s. Use `setHtmlIfChanged(el, html)` in
  `index.html` for any new tbody write — it caches the last HTML by
  element ID and skips the DOM write if identical, which prevents flicker
  and keeps open `<select>` dropdowns alive.
- Same pattern for the timeclock card: `_clockCardShape()` hashes the
  meaningful state and bails early. If you add new fields to the card,
  include them in `_clockCardShape()` or the card won't re-render when
  they change.

### Auth & RBAC
- Three middlewares from `auth.js`: `requireAuth([roles])`,
  `requireAdmin`, `requireManagerOrAdmin`. Apply per-route, NOT globally.
- Anything financial (invoices, revenue, billing, AI tools, bulk imports)
  goes through `requireAdmin` or `requireManagerOrAdmin`. Engineers are
  scoped to their own time entries by `req.user.role` checks inside
  individual handlers.
- The CSRF middleware in `server.js` rejects state-changing requests
  whose Origin doesn't match `ALLOWED_ORIGINS` or the request's own host.
  If you add a new domain, update `ALLOWED_ORIGINS` on every service.

### Time + dates
- `BUSINESS_TZ` env var controls every day-boundary decision. Default
  `America/Chicago`, override per-deploy. Owner is `America/New_York`.
- Use `dateInBusinessTz(d)` from `timeclock_module.js` for any new
  feature that needs a "today's date" or session-attribution date.
- `addDaysToDateString()` for week grids — pure string math, no JS Date
  timezone roundtrips.

### Schema migrations
- Every schema change goes in TWO places: `schema.sql` (for fresh deploys)
  AND the v3 bootstrap in `server.js` (`bootstrapV3Schema`) as
  `ALTER TABLE ... IF NOT EXISTS` for existing deploys. Both are
  idempotent.
- FK ON DELETE was changed CASCADE→RESTRICT on `projects.parent_id` and
  `time_entries.project_id` — billing audit trail must not be cascadable.

### Engineering contracts (umbrella above billing contracts)
- New top-level entity: `engineering_contracts` table. Used when one
  agreement (e.g. "RUS 217 Engineering Contract GA 1706 -A72") spans
  multiple billing contracts (e.g. 515-3, 515-4, 515-5).
- `contracts.engineering_contract_id` — billing contracts can opt into
  belonging to an umbrella. NULL means standalone.
- `budgets.engineering_contract_id` — a budget can scope to either a
  single project (existing) OR an umbrella (new). CHECK constraint
  enforces exactly-one-of so budget math stays unambiguous. To attach a
  budget at the umbrella level via the API, pass
  `engineering_contract_id` instead of `project_id` to POST /api/budgets.
- The inspection projection groups projects by their umbrella whenever
  the umbrella has a budget. UI shows "$X left of $Y total / $Z billed"
  per umbrella row with child project names listed underneath. Projects
  without an umbrella budget keep flat per-project rows.
- `weighted_rate` (in `buildInspectionRevenueProjection`) handles
  umbrellas where children have different `billing_rate` values
  (Inspection $90 vs RE $100). Weighted by recent hours so the rate
  reflects what's actually being billed.

### AI tools + approval gate
- All mutating AI tools are listed in `DESTRUCTIVE_AI_TOOLS` (server.js).
  When Claude proposes any tool in that set, the chat handler STAGES the
  whole batch (saves state to `_pendingApprovals` Map, 15-min TTL) and
  returns `{kind:'pending_approval', approval_id, proposed_actions}`.
- Frontend `renderApprovalCard()` shows one row per proposed action with
  a checkbox + summary + raw-input <details>. Admin clicks "Apply
  selected" or "Reject all"; the card POSTs `{approval_id, decisions}`
  back to the same `/api/ai/chat` endpoint.
- Approved tools execute, rejected tools synthesize a
  `{user_declined: true}` tool_result so Claude can react in the next
  turn. The loop resumes and may produce more text, more tool calls, or
  another approval round (recursive — handled by `submitApproval`).
- Read-only tools (`query_database` SELECT-only with READ ONLY tx,
  `get_upload_data`) execute immediately, no approval needed.
- `write_sql` is the escape hatch for non-SELECT SQL — gated by the
  approval flow so admin sees the exact statement before it runs. Single
  statement only as defense in depth.
- To add a new mutating tool: define in `AI_TOOLS`, implement the case
  in `executeTool`, add the name to `DESTRUCTIVE_AI_TOOLS`, and write a
  human summary in `summarizeToolCall()` so the approval card reads
  cleanly.

### Automation module
- `automation.js` has both pure data functions (`buildDigest`,
  `findStalePermits`, etc) and the route installer
  (`installAutomationRoutes`). Reuse the pure functions for new
  endpoints or scheduled jobs — don't duplicate the SQL.
- The in-process scheduler in `startScheduler` ticks hourly. To add a
  new periodic check, follow the pattern: track a `lastX` timestamp in
  `state`, compare `now - state.lastX >= INTERVAL` before running.

### Toast & keyboard
- `public/toast.js` defines `LFS.toast.{success,info,warn,error}` and
  monkey-patches `window.alert`. Disable per-page with
  `window.LFS_REPLACE_ALERT = false` BEFORE the script loads.
- `public/keyboard.js` adds `/`, `Cmd/Ctrl+K`, `n`, `Esc`, `?` shortcuts.
  Bails silently when no matching elements are present, so safe on every
  page.

### Memory location
- This Claude project's memory lives at
  `C:/Users/Carter Trantham/.claude/projects/C--Users-Carter-Trantham-Desktop-Launch-Database/memory/`.
- `MEMORY.md` is the index; individual memory files have YAML
  frontmatter. Never delete entries without first verifying the
  underlying issue is resolved.

---

## Known minor issues (low urgency)
- Username uniqueness is functional via `LOWER(username)` index but the
  raw column UNIQUE is case-sensitive — possible duplicate "Admin"
  vs "admin" if anyone bypasses the API. Normalize on insert in a
  future pass.
- `csvStage`, `uploadStore`, and `_pendingApprovals` are all in-memory
  `Map`s in `server.js` — they break under multi-instance scaling and
  lose state on restart. Move to a `pending_imports` Postgres table when
  scaling beyond 1 instance. The AI approval flow specifically: a server
  restart between Claude proposing actions and the admin clicking Apply
  loses the staged batch (admin sees "Approval expired or not found");
  acceptable trade-off for now.
- `_dashCustomizeClick` in index.html attaches one listener per
  customize-toggle. The remove path uses the same function reference
  so it does clean up, but there's a subtle leak risk if the function
  identity changes — keep the handler as a stable named function.

