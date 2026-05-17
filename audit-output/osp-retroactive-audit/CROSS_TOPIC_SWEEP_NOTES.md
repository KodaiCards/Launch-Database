# Cross-Topic Curriculum-Wide Sweep — Fix Notes

Write-path constraints acknowledged: only lesson files in allowlist and this notes file written.

**Agent:** Fix-agent (cross-topic sweep)
**Date:** 2026-05-17
**DAG broken pointers BEFORE:** 105
**DAG broken pointers AFTER:** 85 (net −20)

---

## Category A — Vocab pointer adds (T03 lessons)

**T03.L01:** Added `FOA` (T01.L08) + `RUS` (T01.L01) to vocabulary_assumed. Prose uses both terms extensively (5 FOA refs, 4 RUS refs) without prior vocab_assumed declarations.

**T03.L04:** Added `NESC` (T01.L02) + `RUS` (T01.L01) to vocabulary_assumed (prose has 8 NESC refs, 5 RUS refs). Also received Category C-1 edits (see below).

**T03.L07:** Added `NESC` (T01.L02) to vocabulary_assumed (3 NESC refs in prose). Also received Category C-2 edit.

**T03.L11:** Added `FOA` (T01.L08) + `RUS` (T01.L01) + `ICEA` (T01.L09) to vocabulary_assumed (4 FOA, 13 RUS, bare ICEA usage).

**T03.L12:** Added `FOA` (T01.L08) + `RUS` (T01.L01) + `ITU-T` (T01.L09) + `NESC` (T01.L02) to vocabulary_assumed (1 FOA, 20 RUS, 4 ITU-T, 7 NESC refs in capstone quiz content).

**TIA:** No bare "TIA" (without suffix like -598-D) found in any T03 lesson prose. TIA-specific subterms (TIA-598-D, TIA-526) already properly handled via vocabulary_introduced. No bare TIA pointer needed.

---

## Category B — DAG pointer fixes

**B-1/B-2 (T07.L07):** Verified current state — T07.L07 already correctly has `HDD` → T06.L01 and `open-cut trench` → T06.L01. No change needed. Fix Wave T07 had already corrected these.

**B-3 (T19.L01 conduit):** Fixed `conduit` pointer from T06.L01 → T01.L02 (where conduit is actually introduced in T01.L02 "Parts of a Pole"). Additionally corrected all other broken pointers in T19.L01:
- `OLT` (T01.L08 → T01.L01), `ONT` (T01.L08 → T01.L01): OLT and ONT introduced in T01.L01
- `FDH` (T01.L08 → T01.L07): FDH introduced in T01.L07
- `feeder` (T01.L08 → T01.L07): feeder introduced in T01.L07
- `aerial cable` (T05.L01): removed — term not formally introduced in any lesson's vocabulary_introduced; T05.L01 only introduces NESC rule numbers

**B-4 (T19.L09 feeder cable):** Fixed `feeder cable` pointer from T06.L01 → T03.L08 (where feeder cable is actually introduced). T06.L01 only introduces `HDD`, `open-cut trench`, `plowing`, etc.

**B-5 (T06.L04 conduit fill alias):** Added `conduit fill` to vocabulary_introduced in T06.L04. T06.L04 teaches conduit fill calculation (40% fill rule) but the term `conduit fill` wasn't in vocabulary_introduced, causing broken pointers in T06.L10/L11/L12 which assumed it.

**Additional T19 fixes (cascade from B-3/B-4):**
- T19.L02: Fixed `OLT` → T01.L01, `ONT` → T01.L01, `feeder` → T01.L07, `splitter` → T01.L07 (GPON → T01.L08 already correct)
- T19.L06: Fixed `messenger` (T05.L01 → T01.L03) and `armor` (T03.L01 → T01.L03). Both messenger and armor are introduced in T01.L03 "Parts of a Cable."
- T19.L08: Fixed `feeder` (T01.L08 → T01.L07) and `FDH` (T01.L08 → T01.L07)

---

## Category C — T03 editorial cleanup

**C-1 (T03.L04 ADSS + messenger dupe):** Removed `ADSS` and `messenger` from vocabulary_introduced (both were duplicating earlier introductions). Added `messenger` to vocabulary_assumed pointing T01.L03 (where messenger is introduced). `ADSS` already existed in vocabulary_assumed pointing T01.L08 (correct). Cascade: all downstream lessons pointing T03.L04 for ADSS/messenger needed fixing:
- T03.L07, L08, L09, L12: ADSS pointer T03.L04 → T01.L08
- T03.L12: messenger pointer T03.L04 → T01.L03
- T05.L03, L05, L06, L07, L08, L10, L11, L12: messenger pointer T03.L04 → T01.L03
- T05.L10, L11, L12, L15: ADSS pointer T03.L04 → T01.L08
- EDS and RTS in T05 lessons remain pointing to T03.L04 (correct — those ARE introduced in T03.L04)

**C-2 (T03.L07 learning objective):** Harmonized learning_objective wording to match body prose. BEFORE: "Correctly interpret NEC §770.179(B) as covering cable type designation and marking, not separate armor-permission rules". AFTER: "Correctly interpret NEC §770.179(B) as listing the permitted armor configurations for indoor fiber cable in riser applications, enabling UL-listed CST-armored cables to be installed in building riser shafts". Body correctly teaches NEC §770.179(B) as the standard for permitted armor in indoor riser applications.

---

## Category D — T05 cross-topic

**D-1 (T05.L06 radial ice thickness):** Removed `radial ice thickness` from vocabulary_introduced and added to vocabulary_assumed pointing T03.L09 (where it's introduced first — T03.L09 is "ADSS Span/Wind/Ice Loading"). The key_terms entry (Flashcard) for radial ice thickness is retained in T05.L06 since it reinforces the concept in context. DAG deduplication: T03.L09 is the single authoritative introduction.

---

## Category E — T08.L07 P5 polish remnant

**P5 (T08.L07 contingency range):** Reviewed current state. T08 Final Verify RT-Z confirmed this is NOT a conflict: body correctly uses "10-15% for straightforward projects" as the normal sub-range and "10-20%" as the full range. No edit needed. Additionally fixed pre-existing broken pointers:
- `make-ready` pointer T08.L01 → T01.L05 (T08.L01 doesn't introduce bare "make-ready"; T01.L05 does)
- Removed `cost estimation` pointer to T01.L01 (term not formally introduced in any lesson)

---

## Items NOT applied

- **TIA bare pointers in T03**: no bare "TIA" usage found in T03 lessons (only TIA-subterms like TIA-598-D which are handled via vocabulary_introduced). No pointers added.
- **T05.L01/T05.L02 RUS/TIA broken pointers**: these are T05-internal pre-existing broken pointers (Rule 232 claimed T05.L02, pole claimed T01.L02). Outside canonical scope.
- **EDS (Everyday Stress) / RTS (Rated Tensile Strength) long-form broken pointers** in T05: these use long-form term strings that don't exactly match T03.L04's vocabulary_introduced short forms ("EDS" vs "EDS (Everyday Stress)"). Outside this wave's scope — string normalization pass needed.
- **T08.L08/L09/L11 make-ready estimate**: T08.L07 vocabulary_introduced has `MRE (make-ready estimate)` but downstream lessons reference `make-ready estimate` (different string). Same string normalization issue. Outside scope.
- **T19 learning_objectives missing**: pre-existing schema validation failures, not introduced by this wave.

---

## Validation results

- Schema validator: T03 12/12 PASS, T05 15/15 PASS, T06 12/12 PASS, T08 12/12 PASS, T19 9 FAIL (pre-existing, not introduced by this wave)
- Vite build: ✓ built in 6.18s (zero errors)
- DAG broken pointers: 105 → 85 (−20 fixed)

=== CROSS_TOPIC_SWEEP NOTES END ===
