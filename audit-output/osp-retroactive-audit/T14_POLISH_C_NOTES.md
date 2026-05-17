# T14 Polish-C Notes — DAG Pointer Fixes

**Wave:** T14 Polish-C
**Commit:** `66ab8b2`
**Date:** 2026-05-17

## Write-path constraints acknowledged
Only `osp-training/src/lessons/T14/*.jsx` and `audit-output/osp-retroactive-audit/T14_POLISH_C_NOTES.md` written.

## Canonical items addressed

### DAG-1 MED — GES and IBT source pointers
BEFORE → AFTER per lesson:

| Lesson | Term | Before | After |
|---|---|---|---|
| L04 | GES | T14.L01 | T01.L08 |
| L06 | GES | T14.L05 | T01.L08 |
| L06 | IBT | T14.L05 | T01.L08 |
| L07 | GES | T14.L05 | T01.L08 |
| L07 | IBT | T14.L05 | T01.L08 |
| L09 | GES | T14.L05 | T01.L08 |
| L10 | GES | T14.L05 | T01.L08 |

**Note on L05:** L05's `IBT` and `GES` entries already correctly pointed to `T01.L08` (not `T14.L05`). No change needed there — Polish-A did apply these two correctly.

### DAG-2 MED — MGN source pointers
BEFORE → AFTER:

| Lesson | Term | Before | After |
|---|---|---|---|
| L03 | MGN | T14.L02 | T01.L08 |
| L11 | MGN | T14.L02 | T01.L08 |

**Note on L02:** L02's own `MGN` entry in vocabulary_assumed already pointed to `T01.L08` correctly (it uses MGN as assumed from T01.L08 while introducing `neutral wire`, `grounds per mile`, `neutral-to-ground bond`). No change needed.

### DAG-3 MED — NEC source pointers
BEFORE → AFTER:

| Lesson | Term | Before | After |
|---|---|---|---|
| L01 | NEC | T01.L01 | T01.L08 |
| L04 | NEC | T01.L01 | T01.L08 |
| L05 | NEC | T01.L01 | T01.L08 |
| L06 | NEC | T01.L01 | T01.L08 |
| L07 | NEC | T01.L01 | T01.L08 |
| L08 | NEC | T01.L01 | T01.L08 |
| L10 | NEC | T01.L01 | T01.L08 |

**Verification:** T01.L08 vocabulary_introduced confirmed to include 'MGN', 'IBT', 'GES', 'NEC' at lines 22-25 of T01/L08.

### LOW-1 — L11 slider default 1320 ft clarification
BEFORE: `default: 1320`
AFTER: `default: 1320, ..., note: '1320 ft is an example value — verify the applicable interval from NESC §9 and your project\'s RUS bulletin before design.'`

## Validation results
- `validate-lesson-schema.js T14`: 12/12 PASS, 0 FAIL, 0 WARN
- `build-dag-registry.js`: T14 broken pointers = 4 (all pre-existing, unrelated to this canonical: `pole→T01.L02` in L01, and `pedestal/burial depth/duct→T06.Lxx` in L09 cathodic protection)
- `npm run build`: ✓ built in 6.53s, zero errors

## Pre-existing broken pointers (not in scope)
- T14.L01 → "pole" (T01.L02) — T01.L02 doesn't introduce "pole" per DAG registry
- T14.L09 → "pedestal" (T06.L05) — T06.L05 doesn't introduce "pedestal" per registry
- T14.L09 → "burial depth" (T06.L02) — T06.L02 doesn't introduce this exact term
- T14.L09 → "duct" (T06.L02) — T06.L02 doesn't introduce "duct" per registry
These are from the cathodic protection lesson's cross-topic dependencies and pre-date this canonical.

=== T14 POLISH-C NOTES END ===
