# Open Items — questions, pending decisions, parked recommendations (re-raise log)

> Owned by Planning. So nothing gets dropped and everything gets **re-raised at the right moment** — a stopping point, the relevant work area, or when Carter asks something related. Status: OPEN / ANSWERED / DONE / DROPPED. Carter (2026-06-28): *"we need lots of logs for the organizational pieces to actually work."* Last updated 2026-06-28.

| # | Item | Type | Re-raise when | Status |
|---|---|---|---|---|
| O1 | **Planning does a first-hand live user-test** of the app, cross-referenced vs `INVENTORY` (verify built-vs-documented firsthand; trust own eyes over agent reports) | recommendation | right after the People fix deploys (verify it + everything in one pass) | PROPOSED 2026-06-28 |
| O2 | **Feature deep-dive** (post-training roadmap; Job Board first) | parked thread | once Carter user-tests the People foundation on live | PARKED |
| O3 | **Job Board unit:** does "Service Area" fit small non-RUS permits, or a lighter Project/Permit unit? (+ at-a-glance fields, + billing-status states) | open question | when the Job Board deep-dive resumes | OPEN |
| O4 | **Billing submission samples** (RUS inspection / RUS design / non-RUS permitting) + the RUS code list | input from Carter | when billing (System A) starts | OPEN |
| O5 | **Does Workforce export CSV?** (+ a sample) | input from Carter | when hours (System D) starts | OPEN |
| O6 | **Map version** timing (boss-dependent) | input from Carter | when map integration (System C) starts | OPEN |
| O7 | **Cockpit alert thresholds** (fixed-fee %, RUS cap %, utilization) | input from Carter | when cockpit (System E) starts | OPEN |
| O14 | **VERIFY (data-loss): SA hard-delete + FK cascade.** `DELETE /api/service-areas/:id` is a hard delete, no undo bucket. If migration 0064 FKs are ON DELETE CASCADE, deleting an SA destroys its jobs + logged hours. Needs a guard/undo given "nothing can break" + hours-are-sacred. | VERIFY/risk (chunk 03) | at migrations chunk (18) / before relying on delete | OPEN |
| O15 | **Three billing paths coexist** — SA `:id/bill` (simple) vs legacy `billing.js` vs `billing_keystone.js` (ledger). Which is canonical? Reconcile to avoid divergent money logic. | architecture (chunk 03) | at billing chunk (07) | OPEN |
| O13 | **VERIFY: do migrations auto-run on Railway boot?** `server.js start()` calls `runMigrations(pool)` every boot (line ~2191) — contradicts the handoff/memory "startCommand skips auto-migrate, apply manually." If confirmed auto-running, correct that guidance. | VERIFY (Planning found, chunk 01) | when convenient / before next migration | OPEN |
| O9 | **Regression / QA safety net** (live E2E over the operations cluster) — "nothing can break" needs more than manual per-change user-tests | recommendation (Planning) | after the codebase map (it informs what to cover) | OPEN |
| O10 | **Staging-before-live** — `main` auto-deploys straight to prod; add a pre-prod check so nothing broken reaches the team | recommendation (Planning) | when we discuss deploy safety | OPEN |
| O11 | **Automated data backups** — verify they exist / establish them (real revenue + government data) | recommendation (Planning) | soon — it's a standing risk | OPEN |
| O12 | **Auditor role not yet stood up** — defined but no instance/doc ready for when content gating produces audit targets | recommendation (Planning) | before the first content audit (T01) | OPEN |
| O8 | **16 non-`agent` stale branches** — keep/delete each (`claude-2/*`, `claude-4/*`, `claude-5/*`, `claude/*` randoms, `feature/*`, `orchestrator-*`, `worktree-*`); **KEEP `claude/ceo-onboarding-planner-rfg0rc`** (active CEO) | hygiene | at a cleanup stopping point | OPEN |
