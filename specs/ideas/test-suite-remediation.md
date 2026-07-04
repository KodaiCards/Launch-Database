# Test-suite remediation — how do we verify DB-backed code at all? (Partner: scope into PLAN)

**Raised by:** Registrar, 2026-07-03 (Carter chose "raise to Partner as a scoped item"). Not a drive-by `bug` — it's a test-infra + verification-method project.

**⚠ Constraint from law `e8c62e0e` (Registrar ACCESS, 2026-07-03):** "NEVER create accounts, databases, or services; **a private/local Postgres verifies NOTHING (one shared DB, dev=prod)**." So the answer here **cannot** be "spin up a local test DB" — that path is now closed by law. That is precisely what makes this a real problem worth Partner scoping, not a quick fix.

**What:** The DB-backed `npm test` suite has pre-existing failures + structural fragility, and there is **no law-compliant environment to run it in**. Discovered 2026-07-03 (CI dead for months → nobody had run the full suite). **Independent of #59/#48/#60** — those touch `timeclock_module.js` / `service_areas.js` / `ai.js` + a pure-fn test + `scripts/` tooling.

**The tension:**
- The full suite boots `server.js` per file → runs migrations. Against the **shared prod DB** (`.env` DATABASE_URL) that's slow (first test hit the 180s timeout → whole suite wedged with "pool after end") AND unsafe (schema churn on prod; dev=prod).
- A separate/local DB is now **forbidden by law** (verifies nothing; dev=prod is the reality).
- So today the only law-compliant verification for DB-backed logic is: **pure-function unit tests** (DB-free, e.g. `hours_quarter_snap.test.js` ran 11/11) + **premerge lint** + **VO trace/lens review** + **post-deploy live smoke against the real app**. That worked for #59/#60 but doesn't scale to full-suite regression coverage.

**Pre-existing suite failures observed (surfaced during the one exploratory run):**
- `audit_log.test.js` — ~11/32 fail (audit_log is on the PLAN **2.2 cutover kill list** → plausibly stale tests for a doomed feature).
- `billing.test.js` — not self-contained; depends on state seeded by earlier files (fails in isolation, mostly passes mid-suite).
- `schema_sync.test.js` — expects a pristine DB.

**Why it matters:** GATES §4 makes "`premerge` green" a merge gate, but full premerge/`npm test` **cannot currently run in any law-compliant way**. Either (a) GATES needs an explicit "how DB-backed tests are verified given dev=prod" answer, or (b) the suite needs a sanctioned ephemeral-DB exception, or (c) tests get restructured toward pure-fn + a thin sanctioned integration layer. **This is a Partner/Carter decision, not a Registrar one.**

**What it touches:** `tests/_helpers.js`, `tests/audit_log.test.js` + `tests/billing.test.js`, GATES (verification-method clarification), law `e8c62e0e` (if an ephemeral-DB exception is wanted). Reference: registrar memory `reference_test_suite_fragility`.

**Status:** awaiting Partner scoping into PLAN (coordinate with 2.2 cutover, which removes audit_log).
