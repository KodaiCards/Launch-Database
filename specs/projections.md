# SPEC — Projections UI + the monthly owner report (PLAN 2.8, System B)

> ✔ **RATIFIED** — Carter, 2026-07-13 (succession-sprint batch). Ruling: **page + PDF export** for the owner report.
> Backend largely exists (contract_allocations per-mile, computeEstimate, budget burn — I6); this is UI + the report.

## Scope
- **The projections page** (cockpit-adjacent, `money.view`-gated): per client/contract/SA — **$ billable now · $ across construction · $ at close-out**, honest ranges not point estimates, with a **pace slider** (work-pace assumption → dates/dollars shift live).
- **The monthly owner report**: a page that always shows the current month's picture (the three $ figures per client/contract, deltas vs last month, projected next 3 months) + **one-click branded PDF export** (existing Puppeteer pipeline). The send stays manual — Carter reviews before anything leaves.
- Projections parity port from legacy `automation.js` (sparklines/forecast) happens at cutover step 4 (specs/cutover.md) — this page consumes the ported engine, never re-implements math.

## Done-when
- Page renders the three figures per contract from live keystone data; slider moves projections coherently; PDF export matches the page; a `money.view`-less user gets no route (wire-checked).
