# T20 Final-Verify RT-B (Haiku) — 2026-05-18 evening

**Write-path constraints acknowledged:** only `audit-output/osp-retroactive-audit/T20_FINALVERIFY_RTB_HAIKU.md` written.

## Verdict

**RED** — Post-cleanup state contains **1 high-priority pointer regression introduced by cleanup wave** + 6 pre-existing unfixed DAG violations. Cleanup partially addressed RT-D's findings but introduced FTTH pointer to wrong lesson. Schema/build/AI-scrub PASS. **Topic cannot close until FTTH pointer corrected + remaining 6 DAG violations resolved.**

## L01 Pointer Status — Fiber and FTTH (Cleanup Outcome Verification)

**Cleanup Wave Intent (per RT-D 7453cd1):**
- Fix `fiber`: T01.L02 → T01.L03
- Fix `FTTH`: T01.L01 → T01.L08

**Cleanup Wave Actual (per a374b43 diff):**
- Applied `fiber`: T01.L02 → T01.L03 ✓ **CORRECT** (T01.L03 vocabulary_introduced includes 'fiber')
- Applied `FTTH`: T01.L01 → T07.L01 ✗ **REGRESSION** (T01.L08 was the correct target; T07.L01 does NOT introduce FTTH)

**Primary-Source Verification:**
- T01.L03 (parts-of-a-cable.jsx): vocabulary_introduced = ['sheath', 'buffer tube', 'ripcord', 'armor', 'messenger', **'fiber'**, ...] ✓ Verified via file read
- T01.L08 (key-acronyms-field-reference.jsx): vocabulary_introduced contains **'FTTH'** ✓ Verified via file read (Flashcard: "Fiber to the Home")
- T07.L01 (what-a-staker-does.jsx): vocabulary_introduced = ['staker', 'stake', 'call-out', 'field verification', 'measurement tolerance'] — NO 'FTTH' ✗ Verified via file read

**Impact:** Learner reading T20.L01 has undefined-term reference at line 45 ("Most FTTH or fiber-to-rural-business builds..."). Prerequisite invariant violated: FTTH used but not introduced in any referenced source.

## Build + Schema

- **Vite build:** ✓ PASS (9.10s, zero errors, all 249 lessons compile)
- **Schema validation:** ✓ PASS (`node osp-training/scripts/validate-lesson-schema.js T20` = 9/9 lessons PASS)
  - All lessons render `<Flashcard>` with per-term definitions
  - No missing `vocabulary_introduced` → `key_terms` pairing
  - No orphaned imports or schema violations
- **Cross-topic DAG ingestion:** ✓ CLEAN (zero lessons downstream reference T20 vocabulary; T20 is pedagogically terminal)

## Pre-Existing DAG Violations (RT-A Audit + This RT-B Cross-Check)

Per RT-A final-verify report a2fca83, 7 lessons still carry broken pointers:

| Lesson | Term | Claimed | Truth | Notes |
|---|---|---|---|---|
| L03 | construction | T10.L01 | T01.L05 (lifecycle roles) | Pre-existing, not addressed by cleanup |
| L04 | cost | T04.L01 | NOT introduced anywhere | Pre-existing gap; "cost" appears in L01/L02 prose but never formally introduced |
| L06 | NEPA | T09.L01 | T01.L08 (key acronyms) or T09.L02 | Pre-existing, ambiguous ownership |
| L06 | permitting | T09.L01 | NOT introduced anywhere | Pre-existing gap; "permitting" used extensively but never introduced in T09 vocabulary_introduced |
| L07 | TIA-607 | T14.L01 | NOT introduced anywhere | Pre-existing; TIA-607 is inside-plant standard, may belong in ISP course instead |
| L09 | contractor | T10.L01 | NOT introduced anywhere | Pre-existing gap; "contractor" used in L03/L09 prose but no formal introduction |

**Root Cause:** RT-D's cleanup wave was scoped to "fix the 2 pointer errors RT-A flagged" but did not address the full 7-item DAG violation list that RT-A's audit uncovered. This is expected (RT-D's scope was narrow), but the subsequent cleanup commit should have addressed either (a) all 7 violations, or (b) flagged the remaining 6 as deferred for a follow-up wave.

## Findings Summary

| Severity | Count | Examples |
|---|---|---|
| HIGH | 1 | FTTH pointer to T07.L01 instead of T01.L08 (NEW regression from cleanup) |
| MEDIUM | 6 | Pre-existing DAG violations: construction, cost, NEPA, permitting, TIA-607, contractor |
| LOW | 0 | |

**Cascade Risk:** If T20 closes with FTTH → T07.L01, any downstream course referencing T20.L01 assumptions will inherit the broken pointer. No downstream courses currently reference T20 (T20 is terminal), so risk is isolated to future courses (ISP, internals curriculum).

## Closeout

**Blocking Issues (must fix before T20 closes):**
1. **Correct L01 FTTH pointer:** change line 31 from `{ term: 'FTTH', source_lesson_id: 'T07.L01' }` to `{ term: 'FTTH', source_lesson_id: 'T01.L08' }`
2. **Dispatch a T20 cleanup-fix wave** addressing the 6 pre-existing violations OR explicitly defer them to a future retroactive-audit wave with documented justification

**Recommended Sequencing:**
- Single surgical fix-agent push: L01 FTTH pointer T07.L01 → T01.L08
- Dispatch T20 DAG cleanup RT pair (different framings) to verify the 6 remaining violations and propose source lesson re-assignments OR confirm they belong in future ISP course scope
- Declare T20 CLOSED only after both stages complete

**Secondary Verification (if cleanup is applied):**
- Re-run `node osp-training/scripts/build-dag-registry.js` post-fix to confirm FTTH error disappears + no new violations introduced
- Fresh RT pair (NOT RT-A, NOT RT-B for scope variety) to verify the fix and catch any cascade from the correction

**Vite Build:** ✓ Currently CLEAN; will remain clean after pointer fix (no JSX syntax change)

=== T20 FINALVERIFY RT-B HAIKU END ===
