# Test-suite remediation — make `npm test` / premerge reliably green (Partner: scope into PLAN)

**Raised by:** Registrar, 2026-07-03 (Carter chose "raise to Partner as a scoped item"). Not a drive-by `bug` — it's a test-infra project.

**What:** The DB-backed `npm test` suite has pre-existing failures + structural fragility. Uncovered the moment the local premerge Postgres made it runnable (CI has been dead for months, so nobody had run the full suite locally). **Independent of the #59/#48 merges** — those touch `timeclock_module.js` + a pure-fn test + `scripts/` tooling, not billing/audit_log routes.

**The specific findings (all reproduced on a pristine local PG 16.6, port 5433):**
- `audit_log.test.js` — **11/32 fail reproducibly, even alone.** audit_log is on the PLAN **2.2 cutover kill list**, so these are plausibly stale tests for a doomed feature, not a live regression. Triage before "fixing."
- `billing.test.js` — **0/39 alone (before-hook throws) but only 2/39 in the full suite** → the file is **not self-contained**; it leans on state/seed data created by earlier-running files. Order-dependence runs through the suite.
- `schema_sync.test.js` — errors "already exists" (42P07/42723) unless the DB is dropped/recreated pristine per run.
- Whole suite is **slow (~40+ min)** — every one of ~60 files boots `server.js` and re-runs the full 630-statement schema bootstrap; many files hang on teardown (open handles), so single-file `node --test` doesn't self-exit.

**Why it matters:** GATES §4 makes "`premerge` green" a merge gate, but full premerge/`npm test` **cannot be reliably green today** in any environment. Tonight's merges rested on the correct sub-floor (pure-fn unit test + premerge lint + post-deploy live smoke) — but that shouldn't be the permanent answer for money/schema packages.

**What it touches:** `tests/_helpers.js` (per-file DB isolation or documented fresh-DB-per-run + faster boot/teardown), `tests/audit_log.test.js` + `tests/billing.test.js` (self-containment; retire/fix audit_log tests per the 2.2 kill decision), possibly a `premerge` doc on the fresh-DB step. Registrar env now has the local PG to validate any fix.

**Status:** awaiting Partner scoping into PLAN (likely a Track-2 item, coordinate with 2.2 cutover which removes audit_log). Reference: registrar memory `reference_test_suite_fragility` + `reference_premerge_local_postgres`.
