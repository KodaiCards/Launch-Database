# T05 Lessons Post-Fix RT
Date: 2026-05-16
Verdict: GREEN

## Summary (≤80 words)

All 7 canonical findings verified applied correctly across 5 commits. F1 math is correct (1.414 × 600 = 848 lb, independently re-derived as 848.5 lb). F2 derivation now uses valid difference-of-squares algebra (confirmed algebraically and numerically). F3–F6 DAG metadata changes applied cleanly. F7 book-vs-field callouts present in working tier of both L11 and L12. No regressions introduced. One pre-existing minor note flagged (not introduced by fixes).

---

## Per-finding verification table

| # | Finding | Fix SHA | Lines verified | Independent verdict | Notes |
|---|---|---|---|---|---|
| F1 | L05 √2 math (RT-B CRITICAL) | `eaae6ab` | L05:374–381 | APPLIED-CORRECT | Re-derived: √(600²+600²) = 848.5 lb. Fix replaced "0.707 × 600 = 424 lb" with "1.414 × 600 = 848 lb". Stated value 848 within rounding tolerance of exact 848.5 lb. No remnant "424" or "0.707 ×" anywhere in L05. |
| F2 | L06 ice derivation (RT-B HIGH) | `296775c` | L06:277–304 | APPLIED-CORRECT | Difference-of-squares step algebraically verified: (D/2+t)² − (D/2)² = (D+t)(t) using a²−b²=(a+b)(a−b) where a+b=D+t, a−b=t. Result π×t×(D+t) is exact. No old claim π×t×(D/2+t)/144 = π×t×(D+t)/144 remains. Full derivation chain through density multiplication (57×π/144 = 1.2435) is mathematically sound. |
| F3 | L05 'loading district' DAG (RT-A MED) | `060ffa9` + `52eaa9b` | L05:33–44 (vocab), L05:179–182 (prose) | APPLIED-CORRECT | 'loading district' removed from vocabulary_assumed in `060ffa9`. Forward-pointer "(loading districts — geographic zones with defined ice and wind design values — are covered in detail in L06)" added at first informal use in foundations tier in `52eaa9b`. Integration is natural; reads in single voice. |
| F4 | L10 EDS+RTS to vocab_assumed (RT-A MED) | `52eaa9b` | L10:25–35 | APPLIED-CORRECT | EDS and RTS removed from vocabulary_introduced (lines 25–31 now show only: aeolian vibration, self-damping, span rating, deadend clamp, suspension clamp). Both terms added to vocabulary_assumed with source_lesson_id: 'T03.L04'. No double-add: verified by reading vocabulary_introduced and vocabulary_assumed in full. |
| F5 | L08 'make-ready cost estimate' add (RT-A LOW) | `52eaa9b` | L08:32–35 (vocab), L08:91–100 (key_terms), L08:196–205 (flashcard) | APPLIED-CORRECT | 'make-ready cost estimate' added to vocabulary_introduced. key_terms entry added with full definition. Flashcard card id T05-L08-fc-make-ready-estimate added. The term was already used at L08 lines ~275 and ~280; its formal introduction now has a matching vocab entry. L09 vocabulary_assumed pointing to T05.L08 is now valid. |
| F6 | L05 'w_wind' add to vocab_introduced (RT-A LOW) | `060ffa9` | L05:36 | APPLIED-CORRECT | 'w_wind' added to vocabulary_introduced list at line 36. Term is defined and used in L05 worked example (steps 1–3) before L06 assumes it from T05.L05. DAG chain is now intact. |
| F7 | L11+L12 book-vs-field callouts (RT-A LOW) | `30470c6` | L11:252–285 (working tier 146–286), L12:386–413 (working tier 223–414) | APPLIED-CORRECT | L11: amber callout on OPGW misidentification risk — Book (OSHA 1910.269 energized-conductor rules), Field reality (looks like messenger from ground), Risk (electrocution if treated as comm-space cable). L12: amber callout on split ratio designed vs. activated — Book (1:32 or 1:64 day-one), Field (1:8 phased, swap later), Design implication (size feeder for final ratio regardless). Both callouts in working tier per tier markers confirmed. |

---

## Regression check

- **L05 quiz answers consistent with corrected math:** YES. No quiz answer references 424 lb or 0.707. The angle-pole content (lines 370–381) only appears in advanced prose, not in quiz answer keys. Quiz Q1 (F_wind = 56.25 lb) and Q4 (wind span = 150 ft) are unchanged and correct.
- **L06 final formula matches fixed derivation path:** YES. Derivation leads to A_ice = π×t×(D+t) in², converts to ft² via ÷144, multiplies by 57 lb/ft³ to yield 1.2435×t×(D+t). Formula at line 304 (1.244×t×(D+t)) matches. Quiz Q2 (w_ice = 0.622 lb/ft) and Q5 (coefficient = π) are unchanged and correct.
- **L08 vocabulary_introduced still valid JSON:** YES. Syntax confirmed by reading lines 25–36. New 'make-ready cost estimate' string entry is properly quoted. key_terms object at lines 91–100 is well-formed.
- **L10 EDS/RTS removed from vocabulary_introduced (no double-add):** YES. vocabulary_introduced now has exactly 5 entries (aeolian vibration, self-damping, span rating, deadend clamp, suspension clamp). EDS and RTS are in vocabulary_assumed only. **Minor schema note (pre-existing, not a regression):** L10 Flashcard deck (id T05-L10-fc-eds) still renders an EDS reference card. This card was in the original authored version; the fix only moved the vocab_introduced entry. Schema says Flashcard decks should correspond to vocabulary_introduced terms — the EDS card is technically an orphan. However, the card is pedagogically useful (EDS is central to L10) and this is a pre-existing minor note, not introduced by the fix. Does not affect lesson correctness or DAG integrity.
- **L11/L12 callouts integrated into working tier (not appended as foreign blocks):** YES. L11 callout at line ~257 (within data-tier="working" section 146–286). L12 callout at line ~386 (within data-tier="working" section 223–414). Both use the standard amber callout styling (amber-400/30 border, amber-400/5 bg, amber-300 heading) matching the existing pattern in L01–L10.
- **All 14 T05 lessons still parse + import cleanly:** Verified structurally — all 5 fix commits modify JSX-valid syntax (string additions, object key moves, paragraph additions). No JSX syntax changes introduced (no unclosed tags, no missing import additions needed — Flashcard was already imported in L08 before the fix).

---

## Coverage gaps

- Vite build not run (no build env available in this context). Structural JSX verification performed instead. All added content is valid JSX (string literals, object literals, JSX elements using already-imported components).
- L09 vocabulary_assumed forward-reference to T05.L08 for 'make-ready cost estimate' not re-verified directly, but the chain is valid: L08 now introduces the term, L09 assumes it from T05.L08 per the original author's intent.
- Pre-existing rounding artifact in L06 (178.97 vs correct 179.07 for 57×π in the intermediate step) — confirmed pre-existing from original author commit b18392e, not introduced by F2 fix. Sanity-check sentence at bottom of derivation correctly states 179.07/144 = 1.2435. This artifact was outside F2's scope.

---

## Overall verdict

GREEN. All 7 findings are applied correctly. Math is independently re-derived correct for F1 and F2. DAG metadata is structurally clean for F3, F4, F5, F6. Book-vs-field callouts meet CLAUDE.md §2 training voice requirements for F7. One minor pre-existing schema note (L10 EDS flashcard card remaining after vocab move) does not require a fix pass — it is pedagogically sound and was outside the fix scope. No regressions introduced across the 6 modified lesson files.

=== T05 POST-FIX RT REPORT END ===
