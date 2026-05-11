# Claude Resume 2 — 2026-05-11 (mid-Monday demo day)

> **Read this top-to-bottom before doing anything.** This is the second mid-operation handoff. The first (`CLAUDE_RESUME.md`) captured the orchestrator's pause at the multi-wave fix dispatch point. This one captures **what happened next**: PR #37 merged the orchestrator's branch state to main last night, the migration smoke test was broken, Wave 1.5 shipped but introduced new bugs, and Wave 2 BE-AI dispatches keep failing.

## TL;DR — current state

- Production was in a boot loop earlier today. Now booted, but **the user reports new bugs**: failing smoke checks, broken Add-New-Project flow, broken tree behavior. **These are almost certainly downstream of Wave 1.5.**
- Three things shipped today: migration 0023 hotfix (PR #38), Wave 1.5 security hardening + jobs.js boot-loop hotfix (PR #40), UI-A logo + Training tile (direct-to-main 166b6ec).
- Wave 2 BE-AI has been dispatched **twice** and both agents went off the rails trying to modify `.claude/settings.json` permissions instead of editing `routes/ai.js`. **DO NOT redispatch with the same prompt — the agents are getting stuck in a permission-prompt loop, not a code-understanding loop.**

## What landed on main today

| SHA | What | PR | Status |
|---|---|---|---|
| `ffc3847` → merged at `6dab042` | Migration 0023 `MIN(uuid)` → `(array_agg(...))[1]` — unblocks RUS-Fix EC-linkage backfill | #38 | ✓ deployed |
| `e493200` | Wave 1.5 security hardening: ~20 ungated endpoints get `requireAuth()` + role gates; login/change-password drop body token (cookie-only); logout bumps `tokens_invalid_after`; `submitted_by`/`reviewed_by` from `req.user`; error-message sanitization on 7 route files; schema.sql drift cleanup. **Commit message is "x" — author got the diff right but botched the message.** | #40 | ✓ deployed |
| `cafa438` | Hotfix: `routes/jobs.js` was calling `requireAuth(...)` without destructuring it from `mw`. Crashed Railway in a boot loop. Added the missing `const requireAuth = (mw && mw.requireAuth) \|\| (() => (req, res, next) => next());` line. | #40 | ✓ deployed |
| `166b6ec` | UI-A: new logo file (user-supplied no-BG PNG copied over launch-fiber-logo-transparent.png), login logo 60→96px, launcher topbar 68→84px, topbar logo 44→60px with brightness/invert filter for the blue bar, OSP Training tile added to `PORTAL_DEFS`, `public/training.html` placeholder. | (direct) | ✓ deployed |

Branch `claude/debug-previous-issues-MoN9D` was the orchestrator's working branch and merged into main via PR #37 (`d080fd5`) and PR #40 (`5e227be`). It is now stale — work from here goes directly to `main` per PROJECT_NORTH_STAR §2.

## What is broken right now (USER-REPORTED, 2026-05-11)

> "Half entire program doesn't work. It's failing smoke checks and its so buggy when adding new projects and the tree. It's just so buggy. ... it wasnt like this before the other claude started this plan"

### Almost certainly Wave 1.5 fallout — investigation order

1. **Add-New-Project flow broken.** Likely cause: Wave 1.5 tightened role gates on POST/PUT routes. If the frontend was calling `POST /api/projects` from the admin SPA with a user whose role doesn't match the new gate, it's 403/401 silently. Check:
   - `routes/projects.js` — what role gate did Wave 1.5 add to POST/PUT/DELETE? Run `git show e493200 -- routes/projects.js`.
   - `routes/jobs.js` — `GET /api/jobs` was gated to `['admin','design_manager','permitting_manager','design_engineer','permitting_engineer']`. If the project-create modal loads the jobs picker as a different role (e.g., during onboarding flows or impersonation), it'll be empty.
   - The body-actor sweep — if any frontend code was sending `created_by` / `submitted_by` in the body and the backend now drops it, downstream code expecting the column populated could choke.
2. **Tree behavior broken.** Likely cause: `GET /api/projects` or `/api/projects/:id` got a role gate. Frontend tree relies on these. Check what gate landed.
3. **Smoke checks failing.** The user-said "smoke checks" probably refers to either (a) `node --test` in CI failing, or (b) the migration 0023 still not applying cleanly. Re-check CI: `gh run list --branch main --limit 5`.
4. **Other Wave 1.5 traps to look for:**
   - **More files like `routes/jobs.js`** that call `requireAuth(...)` without destructuring it. The hotfix only fixed jobs.js. Re-grep: `grep -L "const.*requireAuth" routes/*.js | xargs grep -l "requireAuth("` (find files that call requireAuth but don't destructure).
   - **Sessions kicked by `tokens_invalid_after`.** If the column was added but the JWT iat-comparison logic was already busted (the W1.1 hotfix at 6d2efc6 fixed an `iat regression` — confirm it actually works), users could be logged out mid-session.
   - **Frontend still expects body token.** `login.html`'s old code read `data.token` and stashed it in `sessionStorage.lfs_token`. Wave 1.5 removed the body token. If `api.js`'s Bearer-header fallback uses `sessionStorage.lfs_token`, every API call from a fresh tab gets `Bearer undefined` until the cookie is read instead. **VERIFY: does `public/js/api.js` correctly fall back to the cookie when sessionStorage is empty?**

### Suggested triage path

1. Roll forward, not back. **Do not revert PR #40 wholesale** — most of the security work is good; we just need to find the over-restrictive gates and the missed `requireAuth` destructures.
2. Dispatch (or write inline) a focused triage agent: read every file in PR #40's diff, build a list of "endpoints that previously had no auth and now have auth", then test each one against the admin role to find any that 401 when they shouldn't.
3. For the project-create + tree bugs specifically: open the admin SPA in a browser (or via the `Claude_in_Chrome` MCP if it's authed), click Add Project, watch Network tab for 401/403/500s, fix them one by one.

## Wave queue — status

| Wave | Status | Notes |
|---|---|---|
| Smoke fix (mig 0023) | ✓ shipped | PR #38 |
| Wave 1 (CRIT+HIGH+MED) | ✓ shipped | already in prior PRs (55d8e44, f2f9349, 1cbe639) |
| Wave 1.1 hotfix | ✓ shipped | 6d2efc6 (SSE iat + DDL regex) |
| RUS-Fix | ✓ shipped | 87cff55 + 1ac63ef + 6f90161 |
| **Wave 1.5** | ✓ shipped, **but causing new bugs** | PR #40 — see "what is broken" above |
| **Wave 2 BE-AI** | ⚠ **DISPATCH FAILING TWICE** | Both agents got stuck asking permission to modify `.claude/settings.json`. They did zero code work. See "Wave 2 BE-AI dispatch problem" below for the fix. |
| Wave 2 FE-Crit | 📋 queued | 27 items: tree-cascade fix, stale `launchfiber-splicematrix.xyz` URL in design.html:354 + admin.html:637-639, state-mgmt try/catch, double-submit guards, actor pre-fill, permit/design SSE hooks, invoice-history-tree state separation, `persistFilter` re-trigger |
| Wave 3 BE-Perf | 📋 queued | 22 items: 9 indexes (`time_entries(project_id, entry_date)`, `time_entries(staff_id, entry_date)`, `projects.parent_id`, `projects.status`, `projects.client_id`, `contracts.engineering_contract_id`, `invoice_items.project_id`, `invoice_items.invoice_id`, `permit_stages` partial), dashboard `ytd_revenue` materialization, N+1 in billing.js and invoice_generator.js, `updateProjectHours` batch, `collectProjectTree` recursive CTE, LIMIT on `/api/time-entries` + `/api/projects`, Puppeteer browser pool, async `fs` in admin endpoints |
| Wave 3 FE-A11y | 📋 queued | 25 items: 47+ modals need `role="dialog"` + `aria-modal` + focus trap + focus return + 29 close-button `aria-label`, form labels, nav-tab ARIA, undo-bar live region, login-error live region, focus rings, skip-nav, `<main>` landmark, `form-hint` sr-only, calendar keyboard, color contrast bumps |
| UI-A | ✓ shipped | 166b6ec — Training tile + logo polish |
| OSP-Merge | 📋 queued | Strategy A from CLAUDE_RESUME.md: apply 12 OSP red-team FIXes in `kodaicards/osp-design-training` first; Vite build; copy `dist/` into `public/training/`; add Express static-serve route behind `requireAuth()`; inject `window.__USER__` shim |
| Wave 1.6 follow-ups | 📋 queued | (a) Splice SSE per-event session re-validation (logout doesn't kill in-flight splice subscription), (b) `DELETE /api/projects/:id` add `?dry_run=1` preview + `{confirm:true}` guard, (c) `routes/splice.js` and `routes/admin.js` still leak `e.message` in catch blocks (~98 instances in splice alone) |
| Cleanup | 📋 queued | Apply `CLEANUP_CANDIDATES.md` deletions |

## Wave 2 BE-AI dispatch problem (READ THIS)

Two Sonnet agents in a row interpreted permission-denied prompts (for things like `Bash(git -c commit.gpgsign=false commit ...)` with heredoc form, or `cd "C:/..." && git ...` compound forms) as "I should write `.claude/settings.json` to grant myself more permissions." Both spent their entire run asking the user to approve settings-file edits. **Zero code work landed.**

The fix is one of:

1. **Pre-allow the patterns the agents need.** Add to `.claude/settings.local.json`:
   - `Bash(git -c commit.gpgsign=false commit -m *)` (single-line -m form)
   - `Bash(git pull --ff-only)`
   - `Bash(git push origin main)`
   - `Bash(git add routes/ai.js)`
   - `Bash(git add routes/*.js)`
   - `Bash(node --check routes/*.js)` (syntax check)
2. **Or: have the manager do W2-BE inline.** It's 18 items in mostly one file (`routes/ai.js`). The manager (you) can edit, smoke-check, commit, push without the sub-agent permission dance. Cost: ~30-60 min of focused work. Benefit: no more dispatch failures.
3. **Or: redispatch with even stricter prompt.** Explicit "DO NOT modify .claude/settings.json under any circumstances. If a command is blocked, try a different syntax. Do not propose settings changes. Use single-line `-m "msg"` for commits, not heredocs." (The v2 dispatch said this — agent still tried to modify settings.json.) **This has now failed twice. Don't try a third time without first either (1) pre-allowing patterns or (2) doing it inline.**

**Recommendation: Option 2 (inline) for Wave 2 BE-AI.** Then once permission patterns are sorted, dispatch Wave 2 FE-Crit and onward as sub-agents.

## Important operating rules (carryover from CLAUDE_RESUME.md)

- **Push policy:** Direct-to-main is the canonical workflow (PROJECT_NORTH_STAR §2). Railway auto-deploys. The branch dance during Wave 1.5 was an artifact of the orchestrator's branch — drop it.
- **Unsigned commits:** `git -c commit.gpgsign=false commit -m "..."`. No `--no-verify`, no `--no-gpg-sign` flag.
- **No `--force`, no `--amend`** without explicit permission. Force-push to main never.
- **NO WORKTREES** per user feedback (memory: `feedback_no_worktrees.md`).
- **No emojis** in code or commits unless explicitly requested.

## User context (compressed, from prior handoff)

- Solo operator. Today (2026-05-11) is the Monday demo to his boss. He's stressed and the program is partially broken in front of him.
- Communication: casual, direct, profanity OK. He'll spot-check; if something's wrong he'll say so.
- Quality bar: "polished... scales and works well." Cost real but not existential — Sonnet for sub-agents, Opus for orchestrator.
- Demo priority (in this order): RUS-Fix (✓ shipped), security hardening (✓ shipped via W1.5 but introduced bugs), visible UI bugs (W2 FE-Crit, ALSO needed to fix the project-create + tree bugs), UI polish (✓ UI-A shipped). Wave 3 perf/a11y can land later.
- **Right now, the most important thing is getting the program working again for the demo.** That means: fix the project-create + tree bugs first, then resume waves. The user explicitly said "half the entire program doesn't work."

## Files referenced

- `CLAUDE.md` (this repo, 57KB) — consolidated planning context from the orchestrator.
- `CLAUDE_RESUME.md` (this repo) — the orchestrator's original handoff.
- `CLEANUP_CANDIDATES.md` (this repo) — deletion list for the final Cleanup task.
- `HANDOFF_NEXT_PM.md` (this repo) — earlier PM handoff with operating-agreement rules. Some are superseded (the branch workflow), some still apply (review pattern, dashboard format).
- `PROJECT_NORTH_STAR.md` (this repo) — domain primer + conventions. Authoritative.
- `/home/user/manager-notes.md` — the orchestrator's per-wave canonical lists. **Not in this environment.** Wave summaries above are reconstructed from `CLAUDE_RESUME.md`'s push-chain notes.

## Final note to the next Claude (or to me, post-context-compaction)

The user's frustration is real and earned — two agents botched their dispatches, one commit message got mangled to "x", a hotfix was needed within 30 minutes of merging Wave 1.5, and now the project-create + tree are broken. Be honest with them about what we know vs. what we're guessing. Lead with fixing what's broken; the wave queue can wait.

When you fix the new bugs, *write a proper commit message* — the "x" commit cost us debugging time and trust.
