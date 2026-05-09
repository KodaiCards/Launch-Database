# Claude Resume State — 2026-05-09

> **Read me first.** This is a mid-operation checkpoint. The orchestrator
> Claude paused here because the user's usage cap was about to hit. Pick
> up at the **"Resume from here"** section below.
>
> Source-of-truth detail lives in `/home/user/manager-notes.md` and
> `/home/user/CLAUDE.md` (local, not in this repo). Read those first.

---

## What's shipped on this branch

`claude/debug-previous-issues-MoN9D` — current HEAD: `6f90161`

| SHA       | Tier      | Title                                                              |
|-----------|-----------|--------------------------------------------------------------------|
| `46f29e9` | —         | Logo: high-res 630×219 transparent PNG                             |
| `af6486b` | —         | Consolidate planning context into CLAUDE.md + cleanup candidates   |
| `55d8e44` | CRITICAL  | Wave 1: auth gates, timing-safe comparisons, IDOR (15 files)       |
| `f2f9349` | HIGH      | Wave 1: bypass-token timing, AI write_sql, SSE channel pinning     |
| `1cbe639` | MEDIUM    | Wave 1: dashboard active-list auth gate                            |
| `6d2efc6` | HOTFIX    | Wave 1.1: SSE iat regression + DDL regex bypasses                  |
| `87cff55` | CRITICAL  | RUS-Fix: EC-Linkage architectural fix (migration 0023, EC FK propagation) |
| `1ac63ef` | HIGH      | RUS-Fix: correctness + audit-trail integrity (`is_billable` filter, EC delete pre-check, undo recalc, AI mass-DELETE block) |
| `6f90161` | MEDIUM    | RUS-Fix: cleanup + hardening (`recalc-hours` auth, `pickProject` rollup skip, schema dedup, frontend filter UX) |

Wave 1 addressed 25/29 canonical items from the verified Wave 1 audit list.
4 items deferred to Wave 1.5 (frontend token + cascade preview + Puppeteer
SSRF + splice error sweep). Wave 1.1 hotfixed two regressions found by the
Wave 1 Post-Fix Verification.

---

## What's been audited and verified (ALL DONE)

24 audit reports + 6 verification reports complete. Canonical fix lists
are nailed down for every wave. Every audit had multiple framings (fresh-
eyes / adversarial / high-precision); cross-auditor convergence is the
verification signal. The verification red-teams confirmed each finding by
opening the cited file:line and checking the diff hunk.

| Wave              | Audit framings | Verification | Canonical items   |
|-------------------|----------------|--------------|-------------------|
| RUS-Fix           | 3              | ✓ done       | 16 (3 CRIT, 6 HIGH, 4 MED, 3 LOW) |
| Wave 1.5          | 6              | ✓ done       | 38 + 1 bonus (ungated `GET /api/design`) |
| Wave 2 BE-AI      | 3              | ✓ done       | 18 (3 HIGH-conv, 5 HIGH single, 9 MED, 1 LOW; 2 hallucinations rejected) |
| Wave 2 FE-Crit    | 3              | ✓ done       | 27 (no hallucinations, 3 scope clarifications) |
| Wave 3 BE-Perf    | 3              | ✓ done       | 22 (no hallucinations) |
| Wave 3 FE-A11y    | 3              | ✓ done       | 25 (no hallucinations, 1 partial mitigation) |
| UI-A discovery    | 1              | n/a          | Training tile = 1-line `PORTAL_DEFS` add + new `public/training.html` |
| OSP-Merge disc.   | 1              | n/a          | Strategy A: serve Vite build as static behind `requireAuth()` |

Every wave's canonical fix list is in the orchestrator's session context
and was passed verbatim into the (now-pending) Fix Agent prompts. Re-read
`/home/user/manager-notes.md` for the per-item summary if needed.

---

## Resume from here

### What's in flight when you arrive

Nothing. RUS-Fix Fix Agent landed (3 commits) before the pause completed.
All 16 RUS-Fix canonical items addressed, zero deferrals. The next
dispatch is Wave 1.5 Fix Agent.

### Sequential push chain (push contention forces serial)

Five remaining waves need fix-agent dispatches one at a time, each
pushing to the same branch before the next can start:

1. ✓ **RUS-Fix** SHIPPED (`87cff55` + `1ac63ef` + `6f90161`)
2. **Wave 1.5** — 8 ungated endpoints + Puppeteer SSRF + body-actor sweep
   + token-from-body removal + logout `tokens_invalid_after` + splice SSE
   re-validation + role-gate tightening + error sweep + cascade preview +
   schema drift cleanup
3. **Wave 2 BE-AI** — `update_engineering_contract` approval gate +
   `bulk_create_projects` rollup billing + transactions on bulk delete +
   actor binding + injection markers + `uploadStore` user binding +
   `advance_permit_stage` project-type check + MAX_ITERATIONS warning +
   `log_time_entries` cap
4. **Wave 2 FE-Crit** — tree-cascade fix + stale `launchfiber-splicematrix.xyz`
   URL (in BOTH `design.html:354` AND `admin.html:637-639`) + state-mgmt
   try/catch + double-submit guards + actor pre-fill + permit/design SSE
   hooks + invoice-history-tree state separation + `persistFilter`
   re-trigger
5. **Wave 3 BE-Perf** — P0 indexes (`time_entries(project_id, entry_date)`,
   `time_entries(staff_id, entry_date)`, `projects.parent_id`,
   `projects.status`, `projects.client_id`, `contracts.engineering_contract_id`,
   `invoice_items.project_id`, `invoice_items.invoice_id`,
   `permit_stages` partial) + dashboard `ytd_revenue` materialization +
   N+1 fixes in `billing.js` + `invoice_generator.js` nested CTEs
   + `updateProjectHours` batch + `collectProjectTree` recursive CTE +
   LIMIT on `/api/time-entries` and `/api/projects` + Puppeteer browser
   pool + async `fs` in admin endpoints
6. **Wave 3 FE-A11y** — modal a11y (47+ instances need `role="dialog"`
   + `aria-modal` + focus trap + focus return) + form labels + nav-tab
   ARIA + 29 close-button `aria-label` + undo bar live region + login
   error live region + focus rings + skip-nav + `<main>` landmark +
   `form-hint` sr-only + calendar keyboard + color contrast bumps

### Then UI-A and OSP-Merge

7. **UI-A** — add Training tile to `PORTAL_DEFS` in `server.js`; create
   `public/training.html` (placeholder for OSP); launcher polish
   (logo size, single-square layout, dark-mode logo inversion fix)
8. **OSP-Merge** — apply 12 OSP red-team FIXes in `kodaicards/osp-design-training`
   first (separate repo); Vite build; copy `dist/` into `public/training/`
   in this repo; add Express static-serve route behind `requireAuth()`;
   inject `window.__USER__` shim from server before serving index

### Then cleanup

9. **Cleanup** — apply `CLEANUP_CANDIDATES.md` deletions

---

## Operating mode reminders

- **Push policy:** repo's signing wrapper returns 400; unsigned commits
  are the working norm (per user, `/home/user/CLAUDE.md`). Use
  `git -c commit.gpgsign=false commit ...` per commit.
- **No `--no-verify`, no `--no-gpg-sign`.** Per-command disable only,
  no config changes.
- **All Fix Agents on Sonnet** (`model: "sonnet"` in Agent dispatch).
  Orchestrator stays on Opus.
- **Push contention:** serialize all branch-touching agents. Multiple
  read-only audits/verifications in parallel is fine.
- **No scope creep.** Implement only the canonical items; surface
  adjacent observations as notes, not commits.

---

## User's standing context (compressed)

- Solo operator. Monday demo to boss (~2026-05-11). Office tool, not SaaS.
- Quality bar: "polished... scales and works well... million-dollar program."
  Cost is real but not existential — sonnet for agents, opus for orchestrator.
- Communication: casual, direct, profanity OK. No filler. Personality fine.
- Explicit autonomy grant: drive multiple waves to completion without
  check-ins; pause only for genuinely-ambiguous-or-irreversible decisions.
- Demo priority: hours-visible-to-managers (RUS-Fix), security hardening
  (W1.5), visible UI bugs (W2-FE-Crit), Training tile (UI-A). Wave 3
  perf/a11y can land Sunday/Monday-morning if needed.

Detailed user profile, project context, and the full canonical lists per
wave live in `/home/user/manager-notes.md`. Read it first when resuming.
