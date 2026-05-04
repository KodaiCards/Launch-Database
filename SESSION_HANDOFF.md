# Session Handoff — 2026-05-04

For the next Claude (or human) picking up this project. Read this first; then `HANDOFF.md` for architecture and `NEXT_STEPS.md` for the longer-term roadmap.

---

## TL;DR — what state things are in

- **PR #8 merged into main** as commit `39f6bf9` after CI hung past its 10-min timeout. 17 commits landed. Owner authorized the merge despite `mergeable_state: unstable` because:
  - Local syntax checks pass on every touched file
  - 10/10 unit tests pass on the new AI classifier
  - The CI failure that was blocking yesterday (schema bootstrap forward-reference) is fixed in this same PR
  - The hung CI step was Playwright (`npx playwright install --with-deps chromium`) — slow, not a code-quality signal
- **Railway redeploy from main is the next gate.** The hung CI run can be cancelled from the Actions UI to stop burning minutes; cosmetic, not functional.
- **Untested in browser:** see "What's not verified" below. Owner agreed to spot-check the new features.

---

## Branch state

- All work on `claude/add-audit-log-hours-x0XCd` (worktrees disabled per owner; `feedback_no_worktrees.md` memory file)
- Branch tip = main tip after merge: `39f6bf9`
- Working tree clean
- New CI run should be firing on main from the merge commit; check status before next push

---

## What landed in this session (PR #8)

### Owner punch-list fixes
1. **CI schema bootstrap** — `schema.sql:144` forward-referenced `setting_change_requests(id)` which is created ~600 lines later. `pool.query(schema)` runs DDL sequentially → FK aborted init → no base tables created → cascade failure across v3/auth/timeclock bootstraps → auth middleware 401'd every request. Fix: dropped inline FK; the column is added by `server.js:702` ALTER block which runs after both tables exist.
2. **AI silent skip ("says it'll do something then doesn't")** — root cause: with `tool_choice='auto'`, Claude can choose not to emit a tool_use. Belt-and-suspenders fix:
   - **Suspenders:** `userWantsAction(messages)` in `routes/ai.js` classifies user intent; when it matches a confirmation phrase ("yes", "go ahead", "looks good", anchored to start) or an action verb ("create", "log", "update"…) anywhere in the message, the chat handler sends `tool_choice='any'` on the next API call. Pure function, exported, 10 unit tests in `tests/ai_user_wants_action.test.js`.
   - **Belt:** Hallucination guard regex expanded to catch past-tense / future-tense / progressive claims; surfaces a red warning when the AI claims action but no successful modifying tool ran.
3. **DWG upload cap** 500 MB → 2 GB (client-side guards in `design_docs.js`, `permits_tab.js`; error message in `routes/project_documents.js`).
4. **Staff dropdown for new user creation** — was empty for new deployments. Added inline `quickAddStaff` panel matching the existing `quickAddClient`/`quickAddContract` pattern; pre-fills with the user's full-name field.
5. **Permit docs delete** — design_docs already had per-file delete; permits didn't. Same backend route, optimistic DOM removal (no full `/api/permits` refetch on success).
6. **Hours tab tile drilldown** — clicking an Inspection / RE / Permitting / Design / Other tile opens a modal grouping that period's entries by staff with edit/delete on each row. Reads from `_hoursEntriesById` map (no extra fetch).
7. **AI clean 503** when `ANTHROPIC_API_KEY` missing — was bubbling a generic SDK error; now an actionable message.

### Architectural cleanup (from /simplify code review)
- **Tree-toggle factory** — `ptreeToggle` (Projects), `dtreeToggle` (Dashboard), `rtreeToggle` (Revenue) were three near-identical 38-line functions operating on the same `projectsTreeState`. Consolidated into `makeTreeToggle({state, chevIdPrefix, groupKeyPrefix, rowClassPrefix})` in `tree_state.js`. Each module now has 6 lines of config.
- **Overlay-modal helper** — `openOverlayModal({id, titleHTML, bodyHTML, footerHTML, maxWidth, bodyStyle, onClose})` + `closeOverlayModal(id)` in new `public/js/overlay_modal.js`. Consolidates 4 dynamic-overlay callers (calendar-day detail, hours-tile drilldown, bulk-bill modal, account modal).
- **deleteProjectDoc helper** — `deletePermitDoc` and `deleteDesignDoc` were near-byte-identical. Shared helper in `api.js`; both modules pass a reload callback.
- **Track 1.2 (23/n)** — last tab-loader extraction (`projects_tab.js`). Brings public/index.html down to 6747 lines from 7042.

### Tests
- `tests/ai_user_wants_action.test.js` — 10 cases for the AI intent classifier (pure function, no DB).
- `tests/schema_shape.test.js` — 7 cases asserting that schema bootstrap produced the tables and columns the rest of the app expects. If schema init regresses again, this test fails LOUDLY instead of cascading 401s through every other test.

### Docs
- `HANDOFF.md` refreshed: marked AI/CSV extraction done, frontend split done, bare-`requireAuth` bug fixed (was already fixed; doc was stale). Added "AI behavior notes" subsection.
- `NEXT_STEPS.md` refreshed: struck the email-digest entry (owner-killed in commit cff591c), the calendar-day-click entry (already shipped), refreshed verify-in-browser checklist.

---

## What's NOT verified — owner needs to spot-check

The Playwright step in CI is what was supposed to catch UI-level bugs. It hung; never ran. Owner agreed to verify in browser:

1. **Projects / Dashboard / Revenue tabs** — click a chevron, wait one polling tick (~1.5s), verify the tree row stays expanded. Three trees now share `makeTreeToggle`; a wrong prefix would show a chevron rotation but rows wouldn't appear.
2. **Hours tab tile click** (Inspection/RE/Permitting/Design/Other) — modal opens with entries grouped by staff.
3. **Hours tab calendar grid** — click a populated day → detail modal opens; click an empty past weekday → create modal pre-filled with the date.
4. **Permits tab → paperclip icon → trash an attached file** — row removed immediately, no full reload.
5. **Settings → Users → New** — click "+ New staff" → inline panel (not `prompt()`); type a name → Add → staff dropdown auto-selects it.
6. **DWG upload over 500 MB** — should succeed (server allowed 3 GB; client cap was the blocker).
7. **AI assistant** — type "create a project Foo for PSC" → expect a create_project approval card, not just text.
8. **Account dropdown (top-right user icon)** — should still open. I converted it to the new overlay helper.

If any are broken, the browser console (F12) will name the missing function. Each module exports via `window.X` at the bottom — that's the first place to check.

---

## Quick map — where things live

```
public/index.html              # ~6750 lines — only inline blocks left:
                               #   project create/edit modal + autosave + quickAdd panels
                               #   Print PDF + PSC RUS PDF + Saved Batches (billing pdf cluster)
                               #   showProjectDetail popup (~370 lines)
                               #   bulk bill-selection state machinery
                               #   Settings modal handlers
                               #   AI chat panel (frontend; backend in routes/ai.js)
                               #   CSV import wizard

public/js/api.js               # api() + deleteProjectDoc()
public/js/undo_bar.js          # showUndoBar / hideUndoBar / lfsUndoClick
public/js/tree_state.js        # makeTreeState + makeTreeToggle + projectsTreeState + hoursTreeState
public/js/overlay_modal.js     # openOverlayModal + closeOverlayModal
public/js/project_picker.js    # populateProjectPicker (leaf-only dropdown)
public/js/audit_drawer.js      # openAuditDrawer / viewAuditDetail
public/js/bulk_bill_modal.js   # openBulkBillModal + confirmBulkBill
public/js/held_timecards.js    # renderHeldTimecardsPanel
public/js/dashboard_layout.js  # widget show/hide config
public/js/engineering_contracts.js
public/js/invoice_templates.js
public/js/construction_contracts.js
public/js/project_types.js
public/js/jobs_settings.js
public/js/pricing_settings.js
public/js/migration_tools.js
public/js/clients_settings.js
public/js/inspection_tab.js
public/js/design_potential_tabs.js
public/js/permits_tab.js
public/js/design_docs.js
public/js/dashboard_views.js
public/js/billing_tab.js
public/js/revenue_tab.js
public/js/hours_tab.js
public/js/projects_tab.js

routes/ai.js                   # Claude tool-using assistant (~1750 lines, biggest route)
                               #   exports module.exports.userWantsAction for tests
routes/hours_csv.js            # CSV import flow
routes/_csv_stage.js           # shared in-memory csvStage Map (used by ai.js + hours_csv.js)
routes/_helpers.js             # updateProjectHours, calcProjectFinancials, undo helpers, etc.
routes/clients.js              # clients CRUD
routes/contracts.js            # billing contracts CRUD
routes/engineering_contracts.js
routes/projects.js
routes/project_documents.js    # generic doc upload + DELETE (used by both permit + design docs)
routes/permits.js
routes/time_entries.js
routes/invoices.js
routes/staff.js                # /api/staff GET + POST (POST has ON CONFLICT DO UPDATE active=true)
routes/undo.js
routes/customer_portal.js      # under construction — owner deferred
routes/admin.js
routes/invoice_templates.js
routes/billing_batches.js

server.js                      # ~990 lines (down from 3471)
                               #   bootstrapV3Schema is still inline (~300 lines of ALTER soup)
                               #   that's the next code-shape cleanup if owner wants it

schema.sql                     # base schema (canonical-ish; v3 ALTERs in server.js still authoritative for the
                               #   columns added at boot — see HANDOFF.md "Schema bootstrap inline")
auth.js                        # JWT + role middleware + bootstrapAuthSchema

tests/_helpers.js              # bootTestServer, adminLogin, requestJson, fixture seeders
tests/_sanity.test.js          # boot + login smoke
tests/schema_shape.test.js     # schema bootstrap shape assertions
tests/ai_user_wants_action.test.js  # AI classifier unit tests
tests/ai_upload.test.js        # AI file upload smoke
tests/csv_import.test.js
tests/contract_friendly_label.test.js
tests/hours_bulk_delete.test.js
tests/project_tree_delete.test.js
tests/psc_rus_pdf.test.js
tests/browser/                 # Playwright smoke (the hanging step in CI)
```

---

## Critical owner preferences (auto-loaded from `~/.claude/projects/.../memory/`)

- **NO worktrees** (`feedback_no_worktrees.md`) — all work on the feature branch.
- **NO email digest** — owner explicitly killed in commit `cff591c`. Don't re-suggest.
- **PSC invoice template ≠ non-RUS template** — `reference_invoice_non_rus_formats.md`. Each non-PSC client needs its own.
- **Deferred (don't start without explicit OK):**
  - Customer self-service portal — `feature_customer_portal.md` (schema/role/routes wired; HTML body is UC placeholder)
  - Client progress view — `feature_client_progress_view.md` (endpoint + loader exist; deferred)
  - Inspection revenue projection refinements — `feature_inspection_revenue_projection.md`
- **Update `NEXT_STEPS.md` when work lands**

---

## Open work — prioritized for the next session

### Probable owner punch-list (queued items)
- **CSV import "would modify" preview** — current `csv-validate` shows row-level data + summary count. To show "would add 12, modify 3, conflict with 1" needs dedup policy. Spec with owner first (match on staff+project+date? +job?).
- **Bulk-action `openBulkBillModal()` review modal polish** — works but minimal; owner has notes.
- **Inspection projection accuracy** — current is 8-week lookback × 26-week horizon, capped by remaining umbrella budget. Could improve with weighted-recency, seasonality, per-staff pace. Owner discussion needed.

### Code-shape backlog (do unprompted only if no other work)
- **Schema bootstrap inline** — `bootstrapV3Schema()` in server.js is ~300 lines of ALTER soup. CLEANUP_PLAN.md Track 1.4 plans `migrations/NNN_*.sql` + `schema_migrations` table. Two sources of truth (schema.sql + ALTERs); one to fix. Watch for forward-references like the FK that broke 2026-05-04 CI.
- **AI chat-loop integration test** — flagged as "queued for follow-up" because it needs an Anthropic SDK mock. With the new exported `userWantsAction` + tool_choice='any' logic, this test would catch loop regressions.

### What I'd avoid extracting further
The remaining inline blocks in `public/index.html` (project create/edit modal, bulk bill-selection, Print PDF cluster, showProjectDetail) are **deeply interconnected**. Splitting them creates more cross-file plumbing than it removes. Leave inline unless a feature specifically touches one.

---

## How to start the next session

```bash
# 1. Sync
git fetch origin main
git checkout claude/add-audit-log-hours-x0XCd
git rebase origin/main           # should be a no-op since this branch was just merged

# 2. Verify state
npm test                          # all tests including new ai_user_wants_action + schema_shape should pass
node -c public/js/*.js            # syntax sanity
wc -l public/index.html           # should be ~6747

# 3. Read the punch list / wait for owner
```

Owner's communication style: drops bullet lists of issues, says "go", expects autonomy. They've been clear that:
- Bug fixes first
- Don't extend cleanup unprompted (server.js is already 71% smaller; dividend collected)
- They'll spot-check; if something's wrong they'll say so
- "Take breaks to check yourself, keep good notes for yourself"

Don't take "go with whatever" as permission for refactor-for-refactor. Pick something concrete from the open work list, scope it, ship it.
