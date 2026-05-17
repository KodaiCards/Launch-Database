# T02 POLISH-A — Agent Notes

**Commit:** aa150b3  
**Files touched:** T02/L07, T02/L08, T05/L12 only (within allowlist)  
**Vite build:** ✓ clean

## Fixes Applied

### Fix 1 — T02.L07 GPON DAG pointer
- **Location:** L07.wavelength-windows.jsx line 42
- **BEFORE:** `{ term: 'GPON', source_lesson_id: 'T01.L01' }`
- **AFTER:** `{ term: 'GPON', source_lesson_id: 'T01.L08' }`
- **Verified:** T01.L08 `vocabulary_introduced` array includes 'GPON' at line 40

### Fix 2 — T02.L08 G.655 Flashcard missing
- **Location:** L08.smf-vs-mmf-choosing.jsx Flashcard deck (foundations section)
- **BEFORE:** Flashcard deck ended at `T02-L08-fc-laseropt`
- **AFTER:** Added `T02-L08-fc-g655` card with back text verbatim from key_terms G.655 definition
- **Verified:** `vocabulary_introduced` already contained `'G.655 (NZ-DSF)'` and `key_terms` had the definition; only the rendered Flashcard card was missing

### Fix 3 — T05.L12 G.652.D DAG pointer
- **Location:** L12-pon-ftth-aerial-topology.jsx vocabulary_assumed
- **BEFORE:** `{ term: 'G.652.D', source_lesson_id: 'T02.L08' }`
- **AFTER:** `{ term: 'G.652.D', source_lesson_id: 'T02.L01' }`
- **Verified:** T02.L01 `vocabulary_introduced` contains 'G.652.D' at line 17

## Neighborhood Scan (±20 lines, same-pattern bugs — NOT fixed, reporting only)

- T02.L07 line 37: `{ term: 'OLT', source_lesson_id: 'T01.L01' }` and `{ term: 'ONT', source_lesson_id: 'T01.L01' }` — worth verifying OLT/ONT are actually introduced in T01.L01 vs T01.L08 (T01.L08 introduces GPON so ONT/OLT may also live there). Out of scope for this wave.
- T05.L12 lines 37-49 vocabulary_assumed: `span` points to `T01.L02`. Not verified in this wave. No change made.

## Diff stat
```
T02/L07.wavelength-windows.jsx        | 4 ++--
T02/L08.smf-vs-mmf-choosing.jsx       | 1 +
T05/L12-pon-ftth-aerial-topology.jsx  | 2 +-
3 files changed, 4 insertions(+), 3 deletions(-)
```
=== T02-POLISH-A NOTES END ===
