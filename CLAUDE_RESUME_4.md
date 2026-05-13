# Claude Resume 4 — 2026-05-11 (late afternoon / evening)

> Fourth handoff today. Read CLAUDE_RESUME.md → CLAUDE_RESUME_2.md → CLAUDE_RESUME_3.md → this for full continuity. This doc captures the evening state + the two feature plans the user explicitly asked to track.

## Standing operating rules (don't violate — they cost real time today)

1. **Manager never writes code.** Per `memory/feedback_manager_never_codes.md`. Even one-line fixes go through a Sonnet sub-agent. Manager only: reads diffs, dispatches agents, verifies, commits + pushes (non-code git ops are allowed manager work).
2. **Agents edit + report. Manager commits + pushes.** Avoids the permission wall that blocked agents three times today.
3. **Direct-to-main pushes** per PROJECT_NORTH_STAR §2. Unsigned commits via `git -c commit.gpgsign=false commit -m "..."`. No `--no-verify`, `--force`, `--amend`.
4. **No commit messages of "x" / "c"** — every commit needs a real description.
5. **Smoke-check every agent's diff before committing.** Agents have hallucinated work (the jobs.js boot-loop) and gotten scope wrong (settings.json edits). Verify by reading the diff.
6. **Settings.local.json allowlist is expanded** as of today — broad `Bash(*)`, `Bash(git *)`, `Bash(gh *)`, `Bash(npm *)`, `Bash(npx *)`, `PowerShell(*)`, etc. Sub-agents should now have shell access without prompts. If they still get blocked, check the allowlist hasn't been reset.

## What shipped today (chronological, since CLAUDE_RESUME_2.md)

| SHA | What |
|---|---|
| `4c751c5` | Hotfix: 0023 RAISE format (`%%`→`%`); restored body token on login/change-password (Wave 1.5 over-corrected) |
| `6b87ff5` | Test: project_tree_delete sends `{confirm:true}` after cascade-preview gate |
| `ab4136c` | Delete-fix: removed dry-run-by-default gate from single-row project DELETEs; `/with-tree` keeps its gate |
| `e7c0d1e` | CI-Fix: Playwright install runs unconditionally; cache no longer gates correctness |
| `8402283` | Wave 2 FE-Crit (13 items): stale URLs, SSE on permits + design + potential, billing-history tree state separation, double-submit guards (Save Project, Advance Permit, Advance Design, Submit Potential Permit), actor pre-fill, persistFilter change-dispatch, cascade-preview UI on delete, overlay escape-key, try/catch around loadPermits + loadDesign |
| `bde0e28` | Project-Modal-Fix: BAU/Other no longer shows Construction Contract (clients.show_contract bleed-through); newly-created EC live-refreshes into modal dropdown via SSE |
| `951d245` | CLAUDE_RESUME_3 doc |
| `7f3b6cb` | **EC WO# + Service Areas feature**: migration 0031, 8 endpoints in routes/engineering_contracts.js, Settings UI in public/js/engineering_contracts.js, project-modal scoping in public/admin.html |
| `20560fe` | **Wave 3 BE-Perf**: migration 0030 with 9 indexes; YTD revenue cache in dashboard.js; N+1 fixes in billing.js; collectProjectTree recursive CTE in _helpers.js; LIMITs on /api/time-entries + /api/projects; async fs in admin.js |
| `1ea79db` | **Wave 2 BE-AI v3**: bulk_delete_projects transaction (BEGIN/COMMIT/ROLLBACK); injection markers around user-supplied content; uploadStore owner_id binding; MAX_ITERATIONS warning surfaced; log_time_entries caps at 100 |

## In-flight when this doc was written

| Agent | Status | Files |
|---|---|---|
| **OSP-Merge v3** | running | User pointed at `C:\Users\Carter Trantham\Desktop\OSP Design Training\` (Desktop sibling, NOT inside this repo). Vite project. Agent is doing `npm install` → `npm run build` → copying `dist/` into `public/training/` → adding auth-gated static middleware in `server.js` → updating PORTAL_DEFS Training URL `/training.html` → `/training/`. Will report back. |
| **Wave 3 FE-A11y** | running | Editing `public/admin.html` + probably the portal HTMLs. 25 items: 47+ modals need `role="dialog"` + `aria-modal` + focus trap + focus return; 29 close-button `aria-label`; form labels; nav-tab ARIA; live regions; focus rings; skip-nav; `<main>` landmark; calendar keyboard; contrast bumps. |

Both have already returned partial work in the working tree. When they report, commit + push each separately. They don't overlap on files except that OSP-Merge will touch `server.js` and W3-A11y won't.

## Open user-flagged items + feature plans

### Feature 1 — Manual job-assignment to clients / ECs / teams

User asked 2026-05-11 PM. Decision: **override semantics** (explicit assignments win; fallback to heuristic when no assignment). Memory file: `memory/feature_manual_job_assignment.md`.

**Why:** Today's `routes/jobs.js` GET filter is heuristic — walks `program_scope` + `for_psc_client` / `for_generic_client` + the client's EC program mix. The user finds it unpredictable. The "County Permitting" surprise from demo prep is the canonical case (it shows up for RUS clients because `for_psc_client=TRUE`, doesn't show for BAU even when BAU jobs should include it).

**Schema sketch:**
```sql
CREATE TABLE IF NOT EXISTS job_assignments (
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  engineering_contract_id uuid REFERENCES engineering_contracts(id) ON DELETE CASCADE,
  team text,
  PRIMARY KEY (job_id, COALESCE(client_id, '00000000-0000-0000-0000-000000000000'),
                       COALESCE(engineering_contract_id, '00000000-0000-0000-0000-000000000000'),
                       COALESCE(team, ''))
);
CREATE INDEX idx_job_assignments_client ON job_assignments(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_job_assignments_ec     ON job_assignments(engineering_contract_id) WHERE engineering_contract_id IS NOT NULL;
CREATE INDEX idx_job_assignments_team   ON job_assignments(team) WHERE team IS NOT NULL;
```

Nullable columns let an assignment be scoped to any combo: just-client, just-EC, just-team, or any tuple.

**Filter precedence in `GET /api/jobs`:**
1. Resolve the request scope (client_id and/or ec_id and/or team).
2. Query `job_assignments`: are there any rows matching this scope (any of the scoping params nullable-match)?
3. **If yes** → return only the jobs in those rows. Heuristic completely bypassed.
4. **If no** → fall through to the existing `program_scope` + `for_*_client` heuristic.

**UI:** Settings → Jobs → per-job page grows three multi-select pickers: "Pin to Clients", "Pin to Engineering Contracts", "Pin to Teams". Empty = unpinned (heuristic applies). Any selection = override mode for that scope.

**Backend endpoints needed:**
- `GET /api/jobs/:id/assignments` → list of pin rows
- `POST /api/jobs/:id/assignments` → add `{client_id?, engineering_contract_id?, team?}`
- `DELETE /api/job-assignments/:id` → remove

**Migration:** numbered next free slot (0032 at time of writing — confirm by `ls migrations/`). Idempotent (`IF NOT EXISTS`).

**Status: SPECCED. Not started.** Post-demo per user's pacing.

**Open questions before building:**
1. Should existing for_psc_client / for_generic_client booleans be migrated INTO `job_assignments` (auto-creating client-pinned rows for every PSC/non-PSC client), or kept as the heuristic fallback?
2. Should pinning a job to an EC also "fan out" to all that EC's contracts (so picking a contract under the EC inherits the pin)?
3. Should the user see *why* a job appears for a given scope (pinned vs heuristic) in the picker?

Default if user doesn't answer: don't migrate (heuristic stays as fallback); pinning to EC implies all contracts; no "why" indicator in v1.

### Feature 2 — EC WO# + Service Areas, mirror to portals

**Already shipped in admin** (commit `7f3b6cb`). Two new tables (`ec_service_areas`, `ec_work_orders`), 8 endpoints, Settings panel in EC edit modal, project-modal scoping when an EC is selected.

**What's still pending:**

- **Mirror to `public/design.html` and `public/permitting.html`.** Those portals have their own `applyPortalProjectModalFieldGating()` copy that the EC-WOSA agent only wired up in `admin.html`. Engineers using the design/permitting portals to create projects don't yet see the EC-scoped WO/SA pickers — they fall back to the legacy free-text + concentrators flow.

  **Plan:** copy the `populateEcScopedWoSaForModal()` function + the `ecChanged()` extension from `public/admin.html` into the two portal HTMLs. Same fetch logic, same fallback-when-empty behavior. Should be ~40 lines per portal.

- **Optional: seed `ec_service_areas` from existing `concentrators`.** If you want the WO/SA dropdowns to populate immediately for ECs that already have concentrators, run a one-time data migration. The agent left this as an open question. Recommendation: write a migration (e.g., 0033) that inserts an `ec_service_areas` row for every distinct (engineering_contract_id, service_area_name) pair derivable from existing concentrator rows. **Idempotent** via `ON CONFLICT DO NOTHING`.

- **Optional: project save path could store `ec_work_order_id`** instead of free-text `work_order_number`. Right now the agent's project modal mirrors the picker's value back into the free-text field so `saveProject()` is untouched. Cleaner long-term: add `projects.ec_work_order_id uuid REFERENCES ec_work_orders(id)` column, update save + display to prefer it. Not blocking, can defer.

## What's left in the wave queue

| Item | Why it matters | Effort |
|---|---|---|
| **Wave 3 FE-A11y** (in-flight) | Polish; keyboard + screen-reader users can navigate the SPA cleanly | Medium agent |
| **OSP-Merge** (in-flight) | Training tile lights up with real content | Medium agent |
| **Mirror EC WO/SA to design.html + permitting.html** | Engineers in those portals get the same scoped pickers as admin | Small agent |
| **Wave 1.6**: splice SSE per-event session re-validation + splice/admin error sweep (~98 `e.message` leaks in routes/splice.js) | Security polish; logout doesn't kill in-flight splice subscription | Medium agent |
| **`bulk_create_projects` transaction** | Partial failure mid-loop currently leaves orphan rows; W2-BE-AI v3 deferred this with notes | Small-medium agent |
| **Manual job-assignment feature** (Feature 1 above) | User explicitly requested. Post-demo. | Medium agent + UI work |
| **Cleanup** — apply `CLEANUP_CANDIDATES.md` deletions | Repo hygiene | Small agent |

## OSP source location (for next Claude — was the blocker)

The user manually placed the OSP Vite project at:

```
C:\Users\Carter Trantham\Desktop\OSP Design Training\
```

(Desktop level, NOT inside Launch Database; has space in name; contains `package.json`, `vite.config.js`, `tailwind.config.js`, `src/`, `index.html`.)

The GitHub repo `KodaiCards/OSP-Design-Training` is empty (just `.gitattributes`). **Do not clone it expecting source.** The local folder is the canonical source. If the OSP project needs to be tracked in version control going forward, that's a separate setup (push the local folder up, or use a build artifact in this repo).

## User context (compressed, for cold-start)

- Solo operator. Monday demo day (2026-05-11) — likely still active by the time the next Claude starts. Demo is to his boss.
- Casual, direct, profanity OK.
- Quality bar: "polished... scales and works well... million-dollar program." Real cost vs. existential cost is a real trade — Sonnet for sub-agents, Opus for manager.
- The user has explicit autonomy grant: drive waves to completion without check-ins; pause only for genuinely-ambiguous decisions.
- **Demo priority order**: visible UI bugs (mostly fixed today), security hardening (Wave 1.5 + 1.6 partial), Training tile lit up (OSP-Merge in flight), perf indexes (shipped). a11y can land later. The remaining queue items are polish.

## Final notes to the next Claude

You're picking up an ACTIVE session. Both running agents (OSP-Merge v3 and W3-A11y) are likely to report back soon. When they do:
1. `git pull --ff-only` and `git status`.
2. Read each agent's reported diff against `git diff --stat`. Don't trust the summary alone.
3. `git add <their files>` + `git -c commit.gpgsign=false commit -m "Wave X / OSP-Merge: ..." ...` + `git push origin main`.
4. Update this doc with the new SHAs.

**Don't inline-edit code, no matter how small.** The user enforced this rule explicitly on 2026-05-11. See `memory/feedback_manager_never_codes.md` for the verbatim rule.

If the user asks for something new mid-session, capture it in a memory file under `~/.claude/projects/.../memory/` and update `MEMORY.md`'s index. Future Claudes (and current you after context-compaction) read those.
