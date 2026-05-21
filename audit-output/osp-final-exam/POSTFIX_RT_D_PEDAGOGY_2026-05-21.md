# RT-D Post-Fix Verification — Pedagogy + UX Framing
## OSP Final Exam (C05.L01) — Fix Wave A (`1fc9d2d`)

**Date:** 2026-05-21  
**Framing:** Pedagogy + UX + content quality  
**Write-path constraints acknowledged:** only `audit-output/osp-final-exam/POSTFIX_RT_D_PEDAGOGY_2026-05-21.md` written.  
**Source commit audited:** `1fc9d2d` (Fix Wave A)  
**Branch:** `agent/osp-final-exam-postfix-rt-d`

---

## Executive Summary

Fix Wave A addressed all HIGH/MED/LOW items from RT-A and RT-B EXCEPT one: RT-A Finding 5 (F11 ambiguous distractor design, MED) was NOT fixed. The session-persistence flow (MED-3) and save-error banner (MED-4) are both correctly implemented. All citation fixes applied correctly.

**New finding introduced by Fix Wave A:** A 6-consecutive-B answer run at positions 45–50 (F47–F52). Overall distribution is 15-15-15-15 but the clustering creates a localized test-taking gamble surface.

**Inherited cascade finding confirmed:** NESC Rule 215D vs. Rule 96F dispute has been resolved by a ground-truth agent on this branch (`100bff3`). Fix Wave A's F50 (Rule 215D) is confirmed CORRECT by primary source research. T14.L03's "Rule 96F" citation is the fabricated/incorrect value — a cascade bug requiring correction in T14.L03 across ~20+ locations.

**Coverage degradation introduced by Fix Wave A:** T07, T15, T16, T17 each trimmed from 2 to 1 question to accommodate T19 — a tradeoff that was implicit in the fix but not evaluated in RT-A or RT-B findings.

**Overall verdict: YELLOW** — Fix Wave A fixed the three HIGHs and four MEDs but introduced a new answer-cluster LOW and left F11 MED unfixed. T14 cascade bug (Rule 96F) is outside this file's scope but is a blocking concern for T14 topic quality.

---

## 1. Per-Canonical-Finding Outcome

### RT-A Finding 1 — HIGH: NESC Rule in F50 stem (215D vs. 96F)

**Fix Wave A action:** REFUTED — did not change F50. Committed explanation: "Rule 215D is correct per NESC C2-2023 (Rule 96F is the older-edition designation)."

**RT-D verification:** Ground-truth agent `100bff3` on this branch ran primary-source verification. VERDICT: **Fix Wave A's refutation is CORRECT.**

- NESC 2023 Rule 215D = messenger bonding rule in Part 2 Section 21 (Grounding and Bonding of overhead supply and communication lines). Confirmed by 3+ cooperative/utility guides.
- "Rule 96F" does NOT exist in any NESC edition. Section 9 (Grounding Methods) contains Rule 096A/B/C only — no 96D/E/F lettered variants exist.
- T14.L03 consistently cites "Rule 96F" — this is a **cascade bug in T14.L03** (a fabricated citation that survived the entire T14 saturation pipeline of 11 RT framings). Fix Wave A's F50 is actually the CORRECT citation.

**Status: RESOLVED correctly. New action required: T14.L03 corrects "Rule 96F" → "Rule 215D" (outside this file's scope — report to orchestrator).**

---

### RT-A Finding 2 / RT-B HIGH-1 — HIGH: T19 = 0 questions (slice bug)

**Fix Wave A action:** Reordered QUESTIONS array — F63/F64 (T19) now at positions 59-60 (array indices 58-59, inside the slice). F26/F54/F56/F58 (T07/T15/T16/T17 second questions) moved to positions 61-64 (array indices 60-63, trimmed by slice).

**RT-D verification (programmatic count):**
```
T19: 2 questions in slice(0,60) — F63 (array pos 58), F64 (array pos 59)
T18: 4 questions — all retained
Trimmed: F26 (T07-Q2), F54 (T15-Q2), F56 (T16-Q2), F58 (T17-Q2)
```

**Status: RESOLVED. T19 correctly has 2 questions.**

**Side effect noted:** T07, T15, T16, T17 each reduced from 2 to 1 question. T07 (Staking) and T15 (Restoration) were flagged as "underweighted for practical importance" by RT-A even at 2 questions. At 1 question each, they are at the minimum possible coverage for any topic. The tradeoff is defensible (T19 coverage is more critical than a second staking or restoration question) but represents a coverage degradation. Recommend noting this in the exam's per-topic documentation.

---

### RT-A Finding 3 — HIGH: Answer-position bias (75% B)

**Fix Wave A action:** Rebalanced answer positions to exactly A=15, B=15, C=15, D=15.

**RT-D verification (programmatic):**
```
node -e: A: 15  B: 15  C: 15  D: 15  (Total: 60) — CONFIRMED
```

**NEW issue found during verification — 6-consecutive-B run:**
```
Full sequence positions 43-52: B, D, B, B, B, B, B, B, C, B
                                        ^^^^^^^^^^^^^^^^^
Questions F47–F52: T13.L03, T13.L04, T14.L06, F50 (T14.L03), T14.L05, T14.L07
```

Six consecutive B answers at positions 45-50 (questions F47-F52). While the overall 15-15-15-15 distribution is correct, a test-wise student noticing 6 consecutive B answers in the T13-T14 section will either (a) lose confidence in their B selections (incorrectly), or (b) identify and exploit the cluster for the next few questions. This is a lower-severity issue than the original 75% B problem but is a real test-design defect.

**Fix Wave A addressed the original HIGH-3 finding. New LOW introduced: B-answer clustering at F47-F52.**

---

### RT-A Finding 4 — MED: F08 citation "ITU-T G.952" → "ITU-T G.652"

**Fix Wave A action:** Changed to "ITU-T G.652".

**RT-D verification:** Line 203 now reads `(T02.L03; ITU-T G.652)`. Correct.

**Status: RESOLVED. ✓**

---

### RT-A Finding 5 — MED: F11 ambiguous distractor design

**Fix Wave A action:** NOT ADDRESSED. Fix Wave A commit message does not mention F11. The question text is unchanged from the original.

**RT-D verification:** F11 (lines 250-259) reads identically to the original audit finding:
- Choice A still begins "No — EDS = 90 lb; 90 lb is exactly at the limit, **so compliant but marginal**" — self-contradicting logic (says "No" then says "compliant")
- The question still asks "Is the long-term tension compliant?" with an answer (choice C) that frames it prospectively ("may cause a violation"), not about current compliance

**Status: UNRESOLVED MED. F11 not addressed by Fix Wave A.**

---

### RT-A Finding 6 — LOW: F27 "17 days" precision

**Fix Wave A action:** Changed to "17 business days".

**RT-D verification:** Line 530 reads "17 business days ago". Line 539 explanation correctly uses "At 17 business days, the 15-business-day clock has expired." 

**Status: RESOLVED. ✓**

---

### RT-A Finding 7 — LOW: F15 §1.1413 → §1.1411

**Fix Wave A action:** Changed to §1.1411.

**RT-D verification:** Line 333 reads "FCC 47 CFR §1.1411". 

**Status: RESOLVED. ✓**

---

### RT-B MED-1 — cert_track 'OSP-Designer' → semantic mismatch

**Fix Wave A action:** Changed to `cert_track: 'osp-general'`. Added `'osp-general'` to validTracks in `routes/training.js:147`.

**RT-D verification:**  
- `L01.osp-final-exam.jsx:1315`: `cert_track: 'osp-general'`  
- `routes/training.js:147`: `validTracks = ['osp-general', 'OSP-Designer', 'RCDD', 'CFOT', 'CFOS-O']`  

**Status: RESOLVED. ✓ The exam no longer pollutes certification attempt history.**

---

### RT-B MED-2 — T20 in catalog prerequisites

**Fix Wave A action:** Removed T20 from prerequisites. Updated description from "T01-T20" to "T01-T19".

**RT-D verification:**  
- `course-catalog.js:363`: prerequisites list ends at 'T19', no 'T20'  
- `course-catalog.js:365`: description says "T01–T19"  

**Status: RESOLVED. ✓**

---

### RT-B MED-3 — No session persistence (90-min exam, tab-close data loss)

**Fix Wave A action:** Added `SESSION_KEY = 'osp-final-exam-state'`, `useEffect` that persists `{answers, elapsedSec}` to `sessionStorage` on every answer/timer change (line 1542-1548). Added resume/restart prompt (lines 1587-1624). Added `beforeunload` warning (lines 1551-1559).

**RT-D UX verification:**

**Resume flow:** The resume prompt correctly shows:
- Minutes remaining (from `timeLeft` which was restored from `EXAM_DURATION_S - savedSession.elapsedSec`)  
- Number of saved answers (`Object.keys(answers).length`)  
- Two clear CTAs: "Resume Exam" and "Start Fresh"

**"Resume" button behavior:**
```js
onClick={() => { setShowResumePrompt(false); setExamStarted(true); }}
```
`timeLeft` was initialized as `EXAM_DURATION_S - savedSession.elapsedSec` on mount (line 1534-1536). Timer starts correctly from where it was saved. `startTimeRef.current` was initialized as `Date.now() - (savedSession.elapsedSec * 1000)` (line 1539) — so elapsed time calculation from `startTimeRef` is correct. ✓

**"Start Fresh" / "Restart" button behavior:**
```js
sessionStorage.removeItem(SESSION_KEY);
setAnswers({});
setTimeLeft(EXAM_DURATION_S);
startTimeRef.current = Date.now();
setShowResumePrompt(false);
setExamStarted(true);
```
Clears storage, resets all state, resets timer. Full clean slate. ✓

**beforeunload warning:** Only fires when `examStarted=true` (line 1552). When exam completes, ExamView unmounts — React's useEffect cleanup runs `window.removeEventListener('beforeunload', handler)`. No spurious firing on results page. ✓

One UX concern: the session save fires on `[answers, timeLeft, examStarted]` dependencies (line 1548). The `timeLeft` dependency means this writes to sessionStorage every second during the exam — this is correct for timer persistence but creates a storage write once per second for 90 minutes (~5400 writes). Browsers handle this gracefully; it's not a bug but worth noting for low-end device performance.

**Status: RESOLVED. ✓ UX is clear, timer restores correctly, beforeunload fires only during active exam.**

---

### RT-B MED-4 — Silent persistence failure

**Fix Wave A action:** Both `persistCertAttempt` and `persistLessonComplete` now return boolean success/failure. `handleSubmit` awaits both via `Promise.all`, computes `saveError = !certOk || !progressOk`, passes to `ResultsView` which shows a user-visible warning banner.

**RT-D verification:**

**Banner text (lines 1386-1390):**
> "⚠ Score could not be saved automatically. Your session may have expired during the exam. Please screenshot your results and contact support so your attempt can be recorded manually."

- Clear language ✓
- Actionable (screenshot + contact support) ✓
- Visually distinct: rose/red color scheme, positioned ABOVE the score card ✓
- Only shown when `saveError=true` — not on successful saves ✓
- Does NOT obscure the actual score results (banner is additive, score still visible) ✓

**Status: RESOLVED. ✓**

---

## 2. Random Pedagogy Spot-Check (10 questions)

Checked questions F01, F05, F09, F13, F19, F27, F34, F41, F49, F53 for pedagogy quality.

**F01 (T01 — Splice closure entry port):**
Stem is clear. Four choices: one correct mechanism-based answer + three plausible misconfusions (water routing, strength member anchoring, thermal insulation). Strong distractor quality. Explanation correctly distinguishes between the three wrong functions. ✓

**F05 (T02 — G.652.D 20mm bend consequence):**
Stem provides specific values. Four choices progress from "no consequence" (underestimates risk) through "temporary only" (mechanistic misunderstanding) to "measurable macrobend loss" (correct) to "wavelength-limited" (partially wrong). Strong teaching value — each distractor reflects a common misconception. ✓

**F09 (T02 — Three wavelength windows):**
Tests specific knowledge (1310/1490/1550 nm for OSP SMF). Distractors include 850 nm (multimode window) and 1250/1300/1625 nm (plausible) variants. Explanation correctly distinguishes GPON downstream (1490 nm), which is the non-obvious knowledge test. ✓

**F13 (T04 — Yellow utility flag):**
Stem clear. Distractors represent common field errors: "assume 36 inches" (unsafe shortcut), "fiber can't cross gas lines" (overreaction), "notify RUS" (wrong escalation path). Correct answer requires multi-step reasoning (811 + direct utility contact). Strong scenario-based question. ✓

**F19 (T05 — OTMR exclusions):**
Tests regulatory knowledge. "Complex make-ready" is the correct exclusion. Distractors test breadth: permit-required crossings (no — OTMR applies), night work (no — time-based, not type-based exclusion), work by licensed contractors (no — OTMR is about WHO does the work, not licensing). Good question. ✓

**F27 (T08 — OTMR 17 business days):**
After fix: "17 business days" is precise. Correct answer requires regulatory recall (15 business days) + understanding that 17 > 15 = self-help rights trigger. Distractors: "file complaint first" (wrong order), "cease work" (wrong direction), "escalate to pole owner" (already past that). Good. ✓

**F34 (T09 — NWP 57 threshold):**
Tests specific threshold knowledge. Correct: 0.5-acre wetland threshold. Distractors: three other plausible acreage values (0.1, 1.0, 5.0) that represent confusion about different NWP thresholds. Arithmetic precision required — good test of actual regulatory knowledge vs. guessing. ✓

**F41 (T11 — Splice acceptance criteria):**
Tests per-splice vs. average criterion. Four choices: "average acceptable" (wrong), "each must individually pass" (correct), "document as variance" (wrong), "budget covers it" (wrong). The "average is fine" distractor is a strong trap — this is a common field misconception. Explanation teaches the distinction clearly. ✓

**F49 (T14 — Ground rod resistance remediation):**
Quantitative: 8 Ω fails GR-1275 ≤5 Ω. Correct answer explains parallel rod + bentonite with math (8‖8 ≈ 4 Ω). Distractors: "accept as-is under NEC 25 Ω" (wrong standard), "increase wire gauge" (misconception — gauge doesn't reduce electrode resistance), "request GR-1275 waiver" (doesn't exist). Strong question that tests standards-literacy at multiple levels. ✓

**F53 (T15 — Bidirectional OTDR break location):**
Math question requiring specific calculation: average (7,230 + 7,320)/2 = 7,275 m. Choice C is the correct two-step calculation. Distractors represent common errors: trust first measurement only, trust second measurement only (arithmetic error), "both are valid ranges." The explanation explains WHY bidirectional averaging improves accuracy (IOR calibration error). Excellent quantitative question. ✓

**Overall pedagogy assessment:** The 10 spot-checked questions show strong distractor design and appropriate difficulty. Explanations teach concepts, not just state the right letter. No double-negatives found in these 10. Quantitative questions (F05, F34, F49, F53) require genuine calculation and cannot be guessed.

---

## 3. Coverage / Proportionality After Re-Slice

| Topic | Pre-Fix-Wave-A | Post-Fix-Wave-A | Comment |
|-------|---------------|-----------------|---------|
| T07 Staking | 2 | **1** | RT-A noted "underweighted at 2"; now at minimum |
| T15 Restoration | 2 | **1** | RT-A noted "underweighted at 2"; at minimum |
| T16 As-Built/GIS | 2 | 1 | Acceptable at 1 |
| T17 Estimation | 2 | 1 | Acceptable at 1 |
| T18 Safety/OSHA | 2 | **4** | Restored to full 4 questions ✓ |
| T19 Headend/CO | 0 | **2** | Now correctly represented ✓ |

T07 and T15 at 1 question each are at the minimum coverage threshold. T07 (Staking) tests whether the learner can direct a field crew to stake a route correctly — a core competency. T15 (Restoration & Outage Response) is a safety-adjacent skill. However, adding more questions to these topics while maintaining the 60-question limit would require removing from other topics. This is a design trade-off, not a blocker.

---

## 4. F50 Question — Answer Validity After Rule Correction

With Rule 215D confirmed as the correct NESC 2023 citation:

**Question prompt:** "NESC Rule 215D requires messenger strand bonding at pole attachment points. For a 500-foot aerial span, how many bonding points does the NESC minimum require?"

**Answer:** "One at each attachment point (both poles at each end of the span)" — answerIndex: 1 (B)

The answer logic is correct: messenger bonds at each support attachment = both end poles = 2 bonding points for a 500-foot span. The rule citation in the stem (215D) is now confirmed correct. The explanation correctly describes the rule's application.

**However:** The explanation currently contains a citation inconsistency: it cites both "T14.L03" (as the source lesson) AND "NESC Rule 215D." The source lesson T14.L03 still teaches "Rule 96F" (the fabricated citation). This means a student who reads F50's explanation and then goes back to T14.L03 to study will find a different rule number. This cross-reference inconsistency is a **new MED finding** introduced by the relationship between Fix Wave A's F50 (correct) and T14.L03's uncorrected "Rule 96F" content.

**Status: New MED — cross-reference inconsistency between F50 explanation and T14.L03 source content. Blocked on T14 fix, not fixable in C05 alone.**

---

## 5. New Issues Introduced by Fix Wave A

### NEW LOW-A: 6-Consecutive-B answer run at positions 45-50 (F47-F52)

The rebalancing to 15-15-15-15 distributed answers mathematically correctly but created a 6-consecutive-B cluster in the T13-T14 section. A test-wise student may:
- After answering several B's in a row, second-guess correct B selections (anxiety-inducing)
- Conversely, recognize the pattern and assume B is the "default" for the next few questions

Verified by reading: Full 60-question answer sequence = `AADACDDCDDCDADADDACCDCACCADDCCADACAABBABBABBDBBBBBBCBCBBCCAD`

The run F47-F52 (6 consecutive B) is not exploitable for a large score gain but is a test-design imperfection.

**Recommendation:** Rotate at least 2-3 of the F47-F52 choices to break the run. No content change required — just reorder choice arrays and update answerIndex.

### NEW MED-B: F11 ambiguous distractor design not fixed (carryover from RT-A Finding 5)

Fix Wave A's commit message lists "MED-4/5/6" using RT-B's numbering (session persistence, save failure). RT-A's Finding 5 (F11 distractor design, labeled MED in RT-A's report) was not included in the fix scope.

Choice A still reads: "No — EDS = 90 lb; 90 lb is exactly at the limit, **so compliant but marginal**" — beginning with "No" while concluding "compliant." A student who knows EDS means "do not exceed" will reason: 90 lb ≤ 90 lb = compliant = answer should be A. But the intended correct answer is C. The question is disputably ambiguous because the engineering reality is that a cable at exactly EDS IS currently compliant (it equals, does not exceed). Choice C tests future-risk reasoning, not current compliance.

**Recommendation:** Reframe per RT-A's Finding 5 suggestion: change the question to ask about *design practice* rather than *current compliance* to remove the ambiguity.

---

## 6. Confirmed Clean (Negative Findings)

1. **Vite build:** `npm run build` PASSES — `L01.osp-final-exam-C4zHXXgn.js` (86.93 kB chunk). Zero compilation errors.
2. **T19 representation:** F63 and F64 are at array positions 58-59, within `slice(0,60)`. T19 has 2 questions. ✓
3. **T18 representation:** All 4 T18 questions (F59/F60/F61/F62) at array positions 54-57. ✓
4. **Answer distribution:** Programmatically verified A=15, B=15, C=15, D=15. ✓
5. **Session storage key:** `SESSION_KEY = 'osp-final-exam-state'` — unique, exam-specific key. No collision risk with other lesson state. ✓
6. **Timer on Resume:** `timeLeft` correctly initialized as `EXAM_DURATION_S - savedSession.elapsedSec`. Timer arithmetic correct. ✓
7. **Start Fresh wipes all state:** `sessionStorage.removeItem`, `setAnswers({})`, `setTimeLeft(EXAM_DURATION_S)`, `startTimeRef.current = Date.now()`. No state leakage. ✓
8. **beforeunload only fires during active exam:** `useEffect` guard `if (!examStarted) return`. ExamView unmount cleans up handler. Results page is clean. ✓
9. **Persistence error banner:** Rose/red, above score card, actionable text, shown only on `saveError=true`. ✓
10. **Course catalog T20 removal:** Prerequisites correctly end at T19. Description says "T01–T19". ✓
11. **cert_track = 'osp-general':** Both SPA and backend updated. No 400 errors. ✓
12. **F08 G.652 citation:** Line 203 correctly reads "ITU-T G.652". ✓
13. **F15 §1.1411:** Line 333 correctly reads "FCC 47 CFR §1.1411". ✓
14. **F27 "business days":** Lines 530 and 539 correctly use "17 business days". ✓
15. **No double-negatives in spot-checked 10 questions.** ✓
16. **No free-text/open-ended questions:** All 60 questions are MC with fixed answer keys. ✓
17. **Math in quantitative questions (spot-check F06, F53, F57):** All correct.
    - F06: 15×0.35 + 3×0.1 + 2×0.5 = 5.25 + 0.30 + 1.00 = 6.55 dB ✓
    - F53: (7,230 + 7,320)/2 = 7,275 m ✓
    - F57: $560K + $560K = $1,120K ✓

---

## 7. Coverage Gaps Not Tested

Same as RT-A identified — these are not new (unchanged from pre-fix state):
- No NESC sag formula full arithmetic question (F18 tests conceptual, F16 tests addition only)
- No OTDR trace-reading question testing full T02.L07 content
- T07 (Staking) now has only 1 question

---

## 8. Summary of Canonical Finding Outcomes

| RT Finding | Severity | Status After Fix Wave A |
|-----------|----------|------------------------|
| RT-A F1 (NESC Rule 215D vs. 96F in F50) | HIGH | CORRECTLY REFUTED — 215D is right; T14.L03 cascade bug flagged separately |
| RT-A F2 / RT-B HIGH-1 (T19 = 0 questions) | HIGH | RESOLVED ✓ |
| RT-A F3 (75% B answer bias) | HIGH | RESOLVED (15/15/15/15) — new LOW-A 6-consecutive-B cluster |
| RT-A F4 (G.952 typo in F08) | MED | RESOLVED ✓ |
| RT-A F5 (F11 ambiguous distractor, MED) | MED | **NOT ADDRESSED — OPEN** |
| RT-A F6 (F27 "17 days" precision) | LOW | RESOLVED ✓ |
| RT-A F7 (F15 §1.1413 citation) | LOW | RESOLVED ✓ |
| RT-B MED-1 (cert_track semantic) | MED | RESOLVED ✓ |
| RT-B MED-2 (T20 in catalog) | MED | RESOLVED ✓ |
| RT-B MED-3 (no session persistence) | MED | RESOLVED ✓ |
| RT-B MED-4 (silent save failure) | MED | RESOLVED ✓ |

**New issues introduced by Fix Wave A:**
| Finding | Severity | Description |
|---------|----------|-------------|
| NEW LOW-A | LOW | 6-consecutive-B run at positions 45-50 (F47-F52) |
| NEW MED-B | MED | F11 ambiguous distractor — carryover, not fixed (same as RT-A F5) |
| NEW MED-C | MED | Cross-reference inconsistency: F50 cites Rule 215D correctly but source lesson T14.L03 still teaches "Rule 96F" — blocked on T14 fix |

**Out-of-scope cascade finding requiring orchestrator action:**
- T14.L03 teaches "Rule 96F" throughout ~20+ locations — confirmed fabricated citation. Must be corrected to "Rule 215D" across all T14 lessons that reference it. Ground-truth report at `audit-output/citation-verification/NESC_MESSENGER_BOND_GROUND_TRUTH_2026-05-21.md` (on this branch from prior agent run).

---

## 9. Closeout

### Commit log confirmation:

```
100bff3 Ground-truth verification: NESC Rule 215D messenger bonding (not 96F)
```
(This commit was pre-existing on the branch from a prior Haiku ground-truth agent. It is OUTSIDE my write-path allowlist. I did NOT create it. It is beneficial supplementary evidence. My RT-D report is the only file I wrote.)

### Diff confirmation:
```
audit-output/osp-final-exam/POSTFIX_RT_D_PEDAGOGY_2026-05-21.md  (new file — my report)
audit-output/citation-verification/NESC_MESSENGER_BOND_GROUND_TRUTH_2026-05-21.md  (pre-existing from prior agent)
```

### Overall verdict: YELLOW

**Reason:** Fix Wave A successfully resolved 9 of the 11 canonical findings. Two items require further action:
1. RT-A Finding 5 (F11 ambiguous distractor, MED) — not addressed in Fix Wave A
2. NEW LOW-A (6-consecutive B run at F47-F52) — introduced by the answer rebalancing

Plus one cascade finding outside this file's scope:
3. T14.L03 "Rule 96F" fabricated citation — must be corrected in T14 (affects F50 source-lesson cross-reference consistency)

The exam is substantially improved and the three HIGH findings are all resolved. The remaining issues are lower severity and the exam could be released in this state with awareness of the F11 ambiguity and B-run issues.

=== RT-D PEDAGOGY POST-FIX REPORT END ===
