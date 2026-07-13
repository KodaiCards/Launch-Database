---
name: premerge
description: Running and interpreting the merge floor — npm run premerge (build, lint, Playwright lesson walk, tests) and the L-015 disposable-Postgres regression harness. Registrar-focused; use before every merge and whenever premerge output needs a verdict.
---

# premerge — the merge floor (GATES step: red = no merge, no exceptions)

## Run it
```bash
npm run premerge   # from the repo root, on the Registrar's machine
```
Stages, in order — it stops at the first failure:
1. **Build** (`build:osp`): the training SPA compiles. ⚠ FIRST `rm -rf public/training/assets` — build does NOT empty outDir; skipping this doubles committed assets (it happened: 260→521 files).
2. **Lint** (content lint): greps trainee-visible content for defect classes. Exit 1 with findings = RED.
3. **Playwright lesson walk**: every published lesson renders, 0 console errors. Use the local server it boots; `domcontentloaded`, never `networkidle` (SSE keeps the connection open — networkidle hangs forever).
4. **Tests** (`npm test`): ⛔ ONLY on the L-015 harness (below). NEVER against the shared DATABASE_URL — that polluted prod for months (#62).

## Interpret the lint
- Finding classes: internal-note leaks · verification-basis framing · gameable option ordering · draw-count sanity · visible internal IDs (T0x/L0x) · native-control usage.
- **The count must be ≤ the count on current main.** New findings introduced by the branch = RED, name the file+line in the merge refusal. Pre-existing findings tracked on an open issue are not the merging package's problem (anti-ratchet — a gate evaluates only its own dimension) — but they never justify adding more.
- A NEW defect class you spot manually → add the grep to the lint in the same merge (lint patterns never collide with content branches).

## L-015 regression harness (tests)
- Disposable LOCAL Postgres, Registrar-only, port 5433, recreated FRESH per run, dropped after. The shared/prod DATABASE_URL is never the test target under any circumstances.
- Point the suite at it via a run-scoped env override; the registrar admin password seeds from local `.env` `REGISTRAR_PASSWORD` (gitignored — never in repo/board/commits).
- **Known-not-green baseline:** audit_log failures (11) belong to the kill-listed audit feature (die with PLAN 2.2); billing tests have inter-file coupling; schema_sync expects a fresh DB. Compare against the SAME failures on main — a merge is blocked by NEW failures, not by the pre-existing baseline (remediation is its own scoped package).
- The harness answers "is the CODE logic right"; the post-deploy live smoke on launchfiber.app answers "is PROD right." Different tools, different questions — passing one never waives the other.

## After green
Merge → rebuild assets (the `rm -rf` note above) → docs rows → post-deploy live smoke (YOU, locally: Playwright against launchfiber.app, authenticated as `registrar`, logged-out check for public pages). There is NO CI — GitHub runs nothing for this repo, ever.
