# T06 Polish-B Notes — 2026-05-17

Commit: `4036fb4`

## Fixes Applied

**L1 — L09 Q6 hedge (DONE)**
- Answer choice B: added `[confirm current edition]` qualifier on 6-inch value
- Explanation: added `[per NESC C2-2023 Rule 354 — confirm current edition value]` qualifier
- Now matches key_terms hedge exactly

**L2 — H-20/HS-20 naming precision (DONE)**
- L05 key_terms: corrected to "2-axle AASHO H-series truck at 40,000 lb GVW / 32,000 lb rear axle"; added parenthetical explaining HS-20 is a separate 3-axle semi-trailer combination; H-20 is correct access-structure designation
- L05 quiz rationale line 166: removed "AASHTO HS-20 design vehicle" language
- L08 body line 320: updated to "2-axle highway loading class, 40,000 lb / 20-ton GVW, 32,000 lb rear axle"
- L08 quiz choice and explanation: same update, no more HS-20 conflation

**L3 — DAG pointer cascade (DONE)**
Fixed 12 broken pointers across 8 lessons:
- L02: conduit T04.L01→T01.L02; AHJ T06.L01→T01.L08
- L05: conduit T06.L03→T01.L02
- L06: conduit T06.L03→T01.L02
- L07: conduit T06.L03→T01.L02; HDPE T06.L03→T01.L08
- L08: conduit T06.L03→T01.L02; HDPE T06.L03→T01.L08
- L09: conduit T06.L03→T01.L02; AHJ T06.L02→T01.L08
- L10: HDPE T06.L03→T01.L08
- L12: HDPE T06.L03→T01.L08

## DAG Registry Stats
- BEFORE: 152 broken pointers total
- AFTER: 140 broken pointers total (-12)

## Remaining T06-related broken pointers (OUT OF SCOPE)
- `conduit fill` in L10/L11/L12 → T06.L04: term-string mismatch (L04 introduces "40% fill rule" not "conduit fill" verbatim); requires adding "conduit fill" to L04.vocabulary_introduced — cross-topic addition, separate wave
- `APWA color codes` in L12 → T06.L06: term-string mismatch (L06 uses "APWA Uniform Color Code" not "APWA color codes"); fix is renaming either the assumed or introduced entry
- T07.L07 HDD→T06.L04 and open-cut→T06.L03: T07 lessons outside write-path
- T19.L01 conduit→T06.L01 and T19.L09 feeder cable→T06.L01: T19 lessons outside write-path

## Neighborhood Scan Findings (report only — do NOT fix)
1. T07.L07 `HDD` → T06.L04 should be T06.L01 (HDD introduced in T06.L01, not T06.L04)
2. T07.L07 `open-cut` → T06.L03 but "open-cut" term string not in any vocabulary_introduced (closest is "open-cut trench" in T06.L01) — term-string mismatch
3. T19.L01 `conduit` → T06.L01 should be T01.L02
4. T19.L09 `feeder cable` → T06.L01 should be T03.L08
5. T06.L04 `vocabulary_introduced` should probably include "conduit fill" as a synonym/alias for "40% fill rule" to resolve L10/L11/L12 broken pointers without having to change every assumed entry

## Validation
- 12/12 PASS (validate-lesson-schema.js T06)
- Vite build: ✓ built in 5.88s
