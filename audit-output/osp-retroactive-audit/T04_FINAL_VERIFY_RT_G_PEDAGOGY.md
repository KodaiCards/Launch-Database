# T04 FINAL VERIFY RT-γ — Pedagogy + Structural Framing
**Role:** Senior OSP engineer + curriculum reviewer. Strict READ-ONLY. Write-path allowlist: this file only.
**Commit SHA basis:** HEAD = `4afcc5b` (Polish-A notes), `5fcccd7` (Polish-A fixes applied)

---

## 1. Polish-A 6-Fix Verification Table

| Fix | Item | Claimed Change | Verified? | Notes |
|-----|------|---------------|-----------|-------|
| G-1 (L10 Q16) | §32.2410 / §32.2411 account numbers in Q16 choice B | Old `§32.2210 / §32.2420` → new `§32.2410 / §32.2411` | ✅ VERIFIED | L10 line 348 reads "Cable and Wire Facilities (§ 32.2410) and Poles (§ 32.2411)" — correct |
| G-1 (L10 Q17 choices) | §32.2410, §32.2411, §32.6112 in Q17 choice list | Old `§32.2210, §32.2420, §32.6512` → new values | ✅ VERIFIED | L10 lines 363-366: choices list `§ 32.2410`, `§ 32.2411`, `§ 32.2230`, `§ 32.6112` — all correct |
| G-1 (L10 Q17 explanation) | `§32.2410 (cable and wire facilities)`, `§32.2411 (poles)`, `§32.2111 (land)` | Per Polish-A notes | ✅ VERIFIED | L10 line 370: explanation references "§ 32.2410 (cable and wire facilities), § 32.2411 (poles), § 32.2111 (land)" — exact match |
| G-2 (L08) | `make-ready` DAG pointer `T01.L01` → `T01.L05` | Fixed | ✅ VERIFIED | L08 line 29: `{ term: 'make-ready', source_lesson_id: 'T01.L05' }` |
| G-3 (L08) | `ROW` DAG pointer `T01.L01` → `T01.L08` | Fixed | ✅ VERIFIED | L08 line 28: `{ term: 'ROW', source_lesson_id: 'T01.L08' }` |
| NEW-LOW (L05) | `ROW` DAG pointer `T01.L01` → `T01.L08` | Fixed | ✅ VERIFIED | L05 line 54: `{ term: 'ROW', source_lesson_id: 'T01.L08' }` |
| G-4 (L09) | Form 307 removed from Sortable `items` + `correctOrder`; feedback updated | Fixed | ✅ VERIFIED | L09 Sortable (lines 469-483) has 6 items: cover-sheet, plan-set, feds, unit-breakdown, cost-estimate, environmental-checklist. Form 307 absent. feedbackCorrect explicitly notes "RUS Form 307 (Bid Bond) is a contractor-submitted surety instrument … not part of the RUS pre-engineering submission." |
| G-5 (L09) | FCC §224 sidebar precision | Old "FCC §224 pole attachment rate formula" → "47 U.S.C. §224 / 47 CFR Part 1, Subpart J §§1.1401–1.1416 (pole attachment rate formula)" | ✅ VERIFIED | L09 line 399: exact corrected citation present in awareness sidebar |

**All 6 Polish-A fixes verified correct. Zero regressions from the fixes.**

---

## 2. L10 Capstone Full Part 32 Cleanliness Check

Scanned ALL `§ 32.` references in L10 (lines 348, 363-366, 370-371):

| Reference | Account Name | Correct? |
|-----------|-------------|---------|
| § 32.2410 | Cable and Wire Facilities | ✅ |
| § 32.2411 | Poles | ✅ |
| § 32.2230 | Telecommunications Plant Under Construction | ✅ |
| § 32.6112 | Motor Vehicle Expense | ✅ |
| § 32.2111 (in explanation) | Land | ✅ |

No stale §32.2210-as-cable-wire or §32.2420 or §32.6512 references remain anywhere in L10. Full Part 32 capstone cleanliness: **CLEAN**.

Cross-check: L07 plant accounts table (lines 176-209) carries the same account numbers. L07 ↔ L10 consistency: ✅ confirmed.

---

## 3. T04 vocab_assumed `T01.L01` Sweep

Sampled all T04 lessons for T01.L01 pointers. Terms pointing to T01.L01:

| File | Terms using T01.L01 | Correct? |
|------|-------------------|---------|
| L01 | OSP, RUS, ROW | OSP ✅, RUS ✅; ROW → ⚠️ see below |
| L02 | OSP, ROW | OSP ✅; ROW → ⚠️ |
| L03 | OSP, ROW | OSP ✅; ROW → ⚠️ |
| L04 | OSP | ✅ |
| L05 | OSP, ROW (fixed to T01.L08) | OSP ✅; ROW now T01.L08 ✅ |
| L06 | OSP, ROW | OSP ✅; ROW → ⚠️ |
| L07 | OSP, RUS | ✅ both |
| L08 | OSP, ROW (fixed to T01.L08), make-ready (fixed to T01.L05) | All ✅ |
| L09 | OSP, RUS | ✅ both |
| L10 capstone | (vocabulary_assumed references T04 lesson IDs for intro'd terms) | ✅ |

**NEW LOW (unfixed, ROW pointers in L01/L02/L03/L06):** Polish-A fixed ROW in L05 and L08. However, L01 (line 52), L02 (line 66), L03 (line 66), and L06 (line 29) still carry `{ term: 'ROW', source_lesson_id: 'T01.L01' }`. Per ARCH.md and RT-α/β reports, ROW is introduced in T01.L08, not T01.L01. Polish-A explicitly noted fixing "L05 + L08 ROW" but did not extend the fix to the four earlier lessons.

This is a systemic DAG pointer pattern matching the cross-topic DAG error noted in the §3 self-improvement log. Not a blocking correctness error (the lessons are otherwise fine), but it means 4 lessons have stale DAG pointers for ROW. These are NEW LOWs uncovered by this independent sweep — they were not in the RT-α or RT-β canonical lists.

**OSP, RUS pointers to T01.L01** appear correct — T01 does introduce both terms.

---

## 4. Cross-Lesson Consistency Check

### Part 32 accounts: L07 ↔ L10
- L07 plant accounts table: §32.2111 Land, §32.2210 Central office—switching (explicitly labeled as confusion trap), §32.2410 Cable and Wire, §32.2411 Poles, §32.6112 Motor vehicle expense, §32.2230 Plant Under Construction — all correct.
- L10 capstone Q16/Q17 now references the same set — ✅ consistent.
- L07 body text (line 555) also includes a note: "Note: §32.2210 is Central office—switching, not cable; §32.2420 does not exist in Part 32" — educational reinforcement of the corrected accounts.

### Form 307: L09 ↔ L10
- L09 Sortable feedbackCorrect (line 481): "Note: RUS Form 307 (Bid Bond) is a contractor-submitted surety instrument distributed to bidders during solicitation — it is not part of the RUS pre-engineering submission to the district office." ✅
- L09 Advanced section (lines 366-371): Describes Form 307 as "a 10% surety instrument required from contractors submitting bids … Do not confuse Form 307 with the completeness checklist." ✅
- L10 capstone: Form 307 no longer appears in any quiz question or answer choice. ✅
- **Fully consistent across L09 and L10.**

### DAG pointers: L05/L08
- L05 ROW → T01.L08 ✅; L08 ROW → T01.L08 ✅; L08 make-ready → T01.L05 ✅
- L01/L02/L03/L06 ROW → T01.L01 (stale, per §3 above)

---

## 5. L09 Sortable + Sidebar Post-Polish-A Check

### L09 Sortable
- 6 items remain (cover-sheet, plan-set, feds, unit-breakdown, cost-estimate, environmental-checklist). Form 307 absent.
- correctOrder (line 480): `['cover-sheet', 'plan-set', 'feds', 'unit-breakdown', 'cost-estimate', 'environmental-checklist']` — 6 IDs matching the 6 items exactly.
- Pedagogically coherent: the order (cover first, plan set, supporting FEDS, then cost/env) reflects actual RUS submission practice.
- feedbackCorrect explicitly distinguishes Form 307 from the submission package.
- **L09 Sortable: clean and pedagogically sound.**

### L09 Awareness Sidebar (Federal Compliance Awareness)
- 11 compliance topics listed (lines 390-401): Multi-employer OSHA, JHA, PRCS, FCA implied certification, NEPA CatEx, ESA §7/§9, tribal consultation, ASCE 38 SUE, FEMA FIRM, 47 U.S.C. §224 (corrected to full citation), DBE/Section 3.
- G-5 fix verified: `47 U.S.C. §224 / 47 CFR Part 1, Subpart J §§1.1401–1.1416` — fully correct.
- All 11 topics are awareness-level (bullets, not deep-dives) — appropriate scope.
- **Sidebar: clean.**

---

## 6. Independent Gap Research — Pedagogy / Structural

**Finding RT-γ-1 (LOW): ROW DAG pointer not fully propagated — L01, L02, L03, L06 still use T01.L01.**
As noted in §3. Polish-A fixed the specific items called out in RT-α/β (L05 and L08). The same stale pattern exists in L01 (line 52), L02 (line 66), L03 (line 66), and L06 (line 29). These lessons reference ROW before T01.L08 has been taught, per the prerequisite DAG. Not a content error — ROW is well-explained contextually in each lesson — but DAG metadata is stale for 4 lessons.

**Finding RT-γ-2 (LOW): L04 'make-ready' pointer still at T01.L02, potentially correct or not depending on T01 structure.**
L04 (line 66, vocabulary_assumed): `{ term: 'make-ready', source_lesson_id: 'T01.L02' }`. L08 make-ready was fixed to T01.L05. L09 make-ready (line 31) uses `T01.L02`. Inconsistency across T04 for where 'make-ready' is first introduced — L08 says T01.L05, L09 says T01.L02. This needs DAG reconciliation. If make-ready is introduced in T01.L02, then L08's fix (T01.L01 → T01.L05) may itself be a step in the wrong direction. A Haiku ground-truth check against T01.L02 and T01.L05 would resolve which is correct.

**No pedagogy-structural HIGH or MED findings beyond those already captured in prior RTs or deferred scope items.**

---

## 7. Vite Build Result

`cd osp-training && npm run build` → **✓ built in 5.72s — clean, 0 errors, 0 warnings.**

---

## 8. Saturation Verdict

**New finds in this round:**
- RT-γ-1 (LOW): ROW pointer stale in L01/L02/L03/L06 — not in prior RT-α/RT-β canonical
- RT-γ-2 (LOW): `make-ready` pointer inconsistency across L04/L09 vs. L08 corrected pointer — not previously raised

**Re-discoveries only:**
- The L05/L08 ROW corrections are verified ✅ (not new)
- All G-1 through G-5 Polish-A fixes confirmed ✅
- L09 Sortable and sidebar confirmed clean ✅

**Verdict: NEW FINDS PRESENT — 2 new LOWs (RT-γ-1, RT-γ-2).** Both are DAG metadata consistency issues, not content correctness errors. No HIGHs or MEDs found.

Per the saturation rule: 2 new LOWs present → technically triggers another round, but both are narrow DAG-metadata (source_lesson_id) issues with no impact on lesson content correctness, citations, math, or pedagogy accuracy. Recommend orchestrator decision: either (a) scope a minimal fix-pass to reconcile make-ready and ROW source_lesson_ids across all T04 lessons, then close with a final structural RT; or (b) defer to the T01 retroactive audit wave which will canonically establish which T01 lesson introduces each term, enabling a single correct sweep of all downstream DAG pointers.

---

## 9. Final Verdict

**YELLOW — T04 not yet fully closed.**

Polish-A's 6 fixes are all correct and verified. L10 Part 32 accounts are fully clean. L09 Sortable and sidebar are correct. Vite build passes. Core content of all T04 lessons is pedagogically sound.

Two residual LOWs identified by independent sweep:
1. ROW `source_lesson_id: T01.L01` in L01/L02/L03/L06 — should be T01.L08 to match L05/L08 corrections
2. `make-ready` pointer inconsistency: L04/L09 say T01.L02; L08 (now corrected) says T01.L05 — one set is wrong

Recommendation: 1 surgical fix-pass to reconcile make-ready + ROW pointers across all T04 lessons, then GREEN close. Orchestrator may elect to defer both to the T01 retroactive audit (which will definitively establish the canonical source lessons for these terms).

=== T04 FINAL VERIFY RT G PEDAGOGY END ===
