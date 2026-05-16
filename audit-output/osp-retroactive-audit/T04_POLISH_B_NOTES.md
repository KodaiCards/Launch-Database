# T04 POLISH-B NOTES

**SHA:** e31415d0ab12fa2d04d5826d9b61fbe92a74df87
**Commit:** T04 Polish-B: fix 5 DAG pointer errors (ROW→T01.L08, make-ready→T01.L05)

## Fixes applied

| # | File | Line | Term | BEFORE | AFTER |
|---|---|---|---|---|---|
| 1 | L01-site-walk-hazard-recon.jsx | 52 | ROW | T01.L01 | T01.L08 |
| 2 | L02-drone-lidar-aerial-survey.jsx | 66 | ROW | T01.L01 | T01.L08 |
| 3 | L03-gis-landbase-coordinate-systems.jsx | 66 | ROW | T01.L01 | T01.L08 |
| 4 | L06-kmz-shapefile-pdf-deliverables.jsx | 29 | ROW | T01.L01 | T01.L08 |
| 5 | L09-rus-pre-engineering.jsx | 31 | make-ready | T01.L02 | T01.L05 |

Verified via Haiku T01 ground-truth (ac03cd0): ROW first introduced T01.L08; make-ready first introduced T01.L05.

## Vite build

✓ built in 5.86s — 131 modules, no errors

## Neighborhood scan — remaining T01.L01 / T01.L02 pointers (DO NOT fix, out of scope)

These remaining T01.L01 and T01.L02 pointers in the changed files appear CORRECT:

- `OSP` → T01.L01 — OSP introduced in L01 (foundational term), correct
- `RUS` → T01.L01 — RUS introduced in L01, correct
- `pole` → T01.L02 — pole introduced in T01.L02, correct
- `conduit` → T01.L02 — conduit introduced in T01.L02, correct
- `attachment` → T01.L02 — attachment introduced in T01.L02, correct
- `joint-use` → T01.L02 — joint-use introduced in T01.L02, correct
- `clearance` → T01.L02 — clearance introduced in T01.L02, correct

No additional erroneous pointers found in ±20-line neighborhoods of changed arrays.
