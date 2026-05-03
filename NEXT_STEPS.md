# NEXT_STEPS

Living handoff doc for the next Claude (or human) picking up where we left off.
Update this file as work lands or new ideas surface. Last updated 2026-05-02.

## Currently deployed
Branch `claude/blissful-khorana-4b200c` contains all the work below. Merging
to `main` redeploys all 4 Railway services from the same repo. Latest commits
(in order of landing):

1. `5dbda8f` — Initial security pass (JWT, RBAC, CSRF, schema RESTRICTs, etc)
2. `586c64e` — Dropdown re-render flicker fix + redundant text removed
3. `287dc62` — Quick-clock buttons, keyboard shortcuts, Needs Attention, bulk actions
4. `d959e3e` — Autosave, fuzzy search, alert→toast, mobile timeclock, Hours group-by
5. `04de98d` — Inspection revenue projection + per-user dashboard layout
6. `cb32f48` — Bill-now preview + Hours calendar grid

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
- **Inspection projection accuracy**. The current projection uses an
  8-week lookback × 26-week horizon, capped by remaining budget. Could
  improve with: weighted-recency (last week counts more), seasonality,
  per-staff pace (some inspectors faster than others). Talk to owner
  about whether the simple version is good enough first.
- **Calendar grid → Click a day to see entries**. Currently the
  calendar cells are read-only. Click should open a modal with the
  entries for that day, with edit/delete. ~30 min addition.
- **Per-user dashboard layout: order, not just hide.** Current implementation
  only does hide/show. Add drag-to-reorder using stable widget IDs.

### Long-term items captured in memory
- Customer self-service portal — `feature_customer_portal.md`
- Client progress view (admin) — `feature_client_progress_view.md`
- Inspection revenue projection — `feature_inspection_revenue_projection.md`
  (already shipped basic version; memory describes math + future tweaks)
- Invoice samples convention — `reference_invoice_samples.md`

---

## Architectural notes / gotchas

### Worktree workflow
- Sessions run in a worktree at
  `.claude/worktrees/<name>/`. Branch name matches the worktree.
- Push the branch from terminal (`git push -u origin <branch>`); GitHub
  Desktop on the main folder can't switch to it (worktree lock).
- The `.claude/` directory is in `.gitignore` and should stay there.

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
- `csvStage` and `uploadStore` are in-memory `Map`s in `server.js` —
  break under multi-instance scaling and lose state on restart. Move
  to a `pending_imports` Postgres table when scaling beyond 1 instance.
- `_dashCustomizeClick` in index.html attaches one listener per
  customize-toggle. The remove path uses the same function reference
  so it does clean up, but there's a subtle leak risk if the function
  identity changes — keep the handler as a stable named function.

