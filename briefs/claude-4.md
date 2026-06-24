# Claude 4 — Quality & coverage (head-Claude's own Sonnet worker)

**Status:** Batch 1 in progress.
**Run as:** Sonnet 4.6 @ medium effort (cost protection).
**Branch:** `claude-4/quality` (push here; CEO merges to main).
**Operator:** orchestrated by head Claude (CEO), not a human — same rules as Claude 2/3.

## Mandate
Harden what Claude 2 (keystone cluster + money view) and Claude 3 (customer portal) shipped, **without touching their files.** You own **new files only**, under:
- `test/**` — backend unit tests (Node built-in `node --test`).
- `docs/route_index.md` — additive sections for the new routes.
- `docs/test_plan.md` — the plan for DB/E2E tests that need the dev DB or Playwright.

## Hard guardrails
- **NEW FILES ONLY.** Do not edit existing source (`server.js`, `auth.js`, `routes/service_areas.js`, the keystone pages, `public/customer.html`, `routes/customer_portal.js`, etc.). If a test needs a code change to be testable, **note it in `docs/test_plan.md`** — don't make the change.
- **No schema, no migrations, no `npm install`** (keeps the disk clean; the box has no `node_modules` and may have no `DATABASE_URL`). Write tests that run with **`node --test`** and **no external deps / no DB** wherever possible; for anything needing the DB or Playwright, write the spec/plan and mark it "CI-run."
- Branch off `main`, commit per task, push `claude-4/quality` when the batch is done, then leave the working tree back on `main` (clean). CEO reviews + merges.

## Batch 1
- [ ] **1. CSV-guard unit tests.** Test the `csvCell` formula-injection/RFC-4180 guard exported as `_helpers` from `routes/hours_summary.js` and `routes/money_view.js`: leading `= + - @` get prefixed with `'`; values with `" , \n` are quoted + inner quotes doubled; null/undefined → empty. `test/csv_guard.test.js`.
- [ ] **2. AR-aging bucket logic.** Cover the 0–30 / 31–60 / 61–90 / 90+ boundaries (exactly 30, 31, 60, 61, 90, 91) and totals. If the bucketing isn't exported as a pure fn, replicate the small logic in the test and assert the boundaries (and note in `test_plan.md` that exporting it would let the test bind to real code). `test/aging_buckets.test.js`.
- [ ] **3. Weekly-window date math.** Cover the Monday-start week window used by `/api/my/hours` in `routes/my_work.js` (Mon 00:00 → next Mon, and `(getDay()+6)%7` Monday index across all 7 weekdays incl. Sunday). `test/week_window.test.js`.
- [ ] **4. Route index docs.** Add/refresh sections in `docs/route_index.md` for the new endpoints: `/api/my/*` (jobs, hours, entries), `/api/hours/summary(.csv)`, `/api/money/{margin,aging,revenue,statement,invoice/:id,invoices.csv}`, `/api/export/all.zip`, and the `/api/customer/*` portal additions (service-areas, invoices, service-areas/:id/map). One line each: method, path, gate, what it returns. Read the route files to get this right.
- [ ] **5. Test plan.** `docs/test_plan.md`: list the DB-backed + Playwright E2E tests to add next (per-endpoint auth/scope/no-$-leak assertions, customer-isolation, contractor IDOR guard, billing recompute), and any small `_helpers` exports that would make current logic directly testable.

> Keep it tight and correct. If `node --test` can't import a module because its top-level `require`s pull deps, test the pure function in isolation (copy the small fn into the test) and note it. Report exactly what you ran and what passed.
