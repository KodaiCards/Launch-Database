# T07 Final-Verify-2 RT-γ — Pedagogy / Saturation

**Role:** Read-only verifier (pedagogy + saturation framing)
**Write-path:** `audit-output/osp-retroactive-audit/T07_FINAL_VERIFY_2_RT_G_PEDAGOGY.md` ONLY
**Wave context:** Post Polish-A (`07e16f7`). Checking 3 Polish-A fixes + cumulative regression + cross-T05 consistency + L09/L10 sample.

---

## 1. Registry Consultations

**Citation registry** (`audit-output/citation-registry.md`, lines 32, 36):
- NESC Rule 232 entry: "Minimum vertical clearances for overhead supply and communication conductors and equipment" — IEEE C2-2023 §232. Last verified 2026-05-16. Within 90-day window. Used as ground-truth.

**DAG validator** (live run `node osp-training/scripts/build-dag-registry.js`):
- T07 broken pointers: **0 / 81 total** ✓
- Global broken: **121** (consistent with Polish-A notes 133→121)

**Schema validator** (`node osp-training/scripts/validate-lesson-schema.js T07`):
- All 10 lessons: **PASS** — no failing or warning items

**Cascade-pattern scan:** No known cascade patterns (OM5 28000, H₂S IDLH, Z359.4) apply to T07 content domain (staking, NESC clearances, OSHA climbing).

---

## 2. Polish-A Fix Verification

### H-NEW-1 — L04 18 ft → 15.5 ft (supply vs. comms distinction)

Independently verified in L04 (`L04-measuring-existing-attachments.jsx`):

| Location | Value | Status |
|---|---|---|
| `Clr_min` WorkedExample variable | `value: 15.5` | ✓ CORRECT |
| Step 4 explanation | "15.5 ft … Supply conductors require 18 ft" | ✓ CORRECT |
| `sanityCheck` | "7 feet above the 15.5-foot communications-cable road clearance minimum … (18 ft applies to supply conductors)" | ✓ CORRECT |
| Q3 prompt/answer | "15.5 feet" / "13.2 ft" | ✓ CORRECT |
| Q5 scenario | "15.5 ft minimum" / "14.5 ft would be below 15.5-ft minimum" | ✓ CORRECT |
| Acronym table | "different rows apply to supply conductors (power) vs. communications cables (fiber)" | ✓ CORRECT |
| Prose callout box | `supply conductors = 18 ft` / `communications cables = 15.5 ft` | ✓ CORRECT |

H-NEW-1 fix confirmed complete and correct in L04.

**🔴 NEW FINDING — MED: L05 still teaches 18 ft as NESC Rule 232 minimum for fiber scenario**

L05 (`L05-staking-notes-rus-form-740.jsx`) WorkedExample Step 3:

```
formula: 'clearance = H_new_actual vs. NESC Rule 232 minimum 18.0 ft',
substitution: 'clearance = 22.5 ft vs. 18.0 ft minimum',
result: '22.5 ft > 18.0 ft — clearance OK',
explanation: '22.5 feet above the road surface is 4.5 feet above the 18-foot NESC Rule 232 minimum.'
```

Also in prose callout (line ~268): `"road clearance 22.5 ft > 18 ft NESC min — OK"` and `sanityCheck` (line ~447): `"clearance check result (22.5 ft > 18 ft — OK)"`.

The scenario context is a **comm wire** / new **fiber** span — exactly the comms-cable context where L04 now correctly teaches 15.5 ft. L05 escaped the Polish-A fix scope (only L04 was updated). Teaching 18 ft as the fiber road-clearance minimum in L05 directly contradicts L04 and propagates the same pre-fix error into the worked example stakers will use as their staking note template.

Fix needed: L05 Step 3 formula/substitution/result/explanation + prose callout + sanityCheck → replace `18 ft`/`18.0 ft` with `15.5 ft` for the comm-cable/fiber scenario, add brief supply-vs-comms distinction note matching L04 style.

### NB-1 — `'NESC Rule 232'` → `'Rule 232'` DAG string fix (L04)

Verified in L04 `vocabulary_assumed` line 33: `{ term: 'Rule 232', source_lesson_id: 'T05.L01' }`. String match is exact. DAG validator confirms 0 broken T07 pointers. ✓ CORRECT.

### M-NEW-1 — 12 DAG pointer fixes

DAG validator: 0 broken T07 pointers out of 81 total. From Polish-A notes, 12 broken compound-term mismatches were corrected. Registry confirms 0 remaining broken. ✓ COMPLETE.

---

## 3. Cumulative Regression — Fix Wave A 17 Items

Spot-checked key Fix Wave A items:

- **H-1 (Rule 232→235 supply-to-comm):** L04 line 409 — `Sep_min` correctly labeled "NESC Rule 235, comm-to-comm", value 1.0 ft. L04 line 218: "set by NESC Rule 235 (between circuits) and Rule 232 (above ground)." ✓ INTACT
- **H-2 (contour introduction):** L02 vocabulary_introduced line 31 includes `'contour'`; L02 key_terms entry with definition and Flashcard confirmed. ✓ INTACT
- **H-3 (OSHA 4 ft climbing trigger):** L04 line 485: "OSHA 1910.268(g)(1) requires a positioning system or personal fall arrest system for any pole work above 4 feet; laser measurement from the ground sidesteps that trigger completely." ✓ INTACT
- **L09 DAG pointers (Fix Wave A M-1..M-6 / Polish-A M-NEW-1):** All 6 L09 vocabulary_assumed pointers verified (staker→T07.L01, RUS Form 740→T07.L05, make-ready flag→T07.L06, photo-attach→T07.L08, attachment height measurement→T07.L04, staking sheet→T07.L05). ✓ ALL VERIFIED

No regressions detected in Fix Wave A items.

---

## 4. T05 vs T07 Consistency Check — 15.5 ft / 18 ft

**T05.L02** (`L02-vertical-clearance-rule-232.jsx`): teaches `≈ 15.5 ft` for comm cables over traffic lanes. Quiz correct-answer: `'15.5 ft'` (answerIndex: 2). Distractor `18.0 ft` present — appropriate (learners must distinguish supply from comms). No supply-vs-comms 18 ft callout in T05.L02 prose (it only teaches the comms row). Consistent with T07.L04.

**T05.L10, T05.L15:** both reference `15.5 ft` for NESC Rule 232 comm-cable clearance. ✓

**T07.L04:** 15.5 ft corrected, supply-vs-comms distinction added. ✓ Consistent with T05.

**T07.L05:** 18.0 ft still present — **INCONSISTENT with both T07.L04 and T05.L02**. This is the MED finding above.

---

## 5. L09 / L10 Sample (Under-Audited)

**L09** (`L09-staking-qa-what-the-engineer-reviews.jsx`): 5 vocabulary_assumed pointers all DAG-verified. 5 key_terms with Flashcards, all matching prose definitions. BranchingScenario present. Quiz with 5 questions. No clearance values in L09 content (appropriate — QA lesson doesn't need to re-state clearance numbers). Learning objectives pedagogically sound (measurable, learner-action verbs). No issues found.

**L10 capstone** (`L10-t07-capstone-quiz.jsx`): Clearance checks use NESC Rule 235 comm-to-comm values (1.0 ft) throughout — correct for a staking-comm-cable context. BranchingScenario includes multi-step clearance decision tree with supply/comms distinction correctly handled. No 18 ft values used as comm-cable road-clearance (Rule 232 is referenced only for traffic clearance in the bore pit section where 18 ft does not appear). No issues found.

---

## 6. Vite Build + Validator

- **Vite build:** `✓ built in 5.81s` — zero errors
- **Schema validator:** T07 10/10 PASS — zero FAIL or WARN

---

## 7. Saturation Verdict

**Not saturated.** New MED finding discovered (L05 18.0 ft → needs 15.5 ft for fiber road-clearance scenario). This is a genuine regression from H-NEW-1 scope being limited to L04 — same factual error exists in L05's WorkedExample and prose callout.

All Fix Wave A items: INTACT. All Polish-A structural fixes (NB-1, M-NEW-1): VERIFIED. T05↔T07 cross-topic consistency: BROKEN at L05 (MED). L09/L10: CLEAN.

---

## 8. Findings Summary

| # | Severity | Lesson | Issue |
|---|---|---|---|
| G-1 | MED | T07.L05 | WorkedExample Step 3 + prose callout + sanityCheck teach 18.0 ft as NESC Rule 232 minimum for comm/fiber scenario. Correct value = 15.5 ft. Contradicts L04 (H-NEW-1 fix) and T05.L02. |

**Confirmed clean:** L04 H-NEW-1 (all 7 locations ✓), NB-1, M-NEW-1 (all 12 pointers ✓), Fix Wave A H-1/H-2/H-3 (all intact), L09 (clean), L10 (clean), Vite build (clean), schema validator (10/10 PASS).

## Verdict: 🟡 YELLOW — 1 MED finding

G-1 (L05 18.0 ft clearance teaching wrong value for fiber) requires a surgical fix before declaring T07 saturated. Fix is 3-5 line replacement in L05 Step 3 + prose + sanityCheck — mirroring the L04 pattern.

=== T07 FINAL VERIFY 2 RT G PEDAGOGY END ===
