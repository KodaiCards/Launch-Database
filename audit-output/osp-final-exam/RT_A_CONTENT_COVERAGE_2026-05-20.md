# RT-A Content Coverage & Question Quality Audit — OSP Final Exam (C05.L01)

**File:** `osp-training/src/lessons/C05/L01.osp-final-exam.jsx` (commit `bf42544`)
**Date:** 2026-05-20
**Framing:** Senior OSP engineer + BICSI/FOA exam blueprint reviewer — content coverage, question validity, distractor quality, answer-pattern bias, primary-source correctness
**Write-path constraints acknowledged:** only `audit-output/osp-final-exam/RT_A_CONTENT_COVERAGE_2026-05-20.md` written.

---

## Executive Summary

The 60-question exam is well-grounded in OSP lesson content, and the majority of questions test genuine field-applicable knowledge at an appropriate mastery level. However, five material issues were identified: one HIGH citation error embedded in a question stem (wrong NESC rule number that will teach the incorrect standard), one HIGH structural coverage gap confirmed by RT-B (T19 = 0 questions in the delivered exam), one HIGH answer-distribution bias that allows test-wise guessing to score ~75% without content knowledge, and two MED issues (a citation typo and an ambiguous question design). 

**Overall verdict: YELLOW — three findings must be fixed before this exam can serve its stated mastery-validation purpose.**

---

## 1. Coverage Proportionality

### Per-topic distribution in the delivered 60-Q exam (F01–F60 via `slice(0,60)`):

| Topic | Lesson count | Questions in exam | Q/lesson ratio | Comment |
|-------|-------------|-------------------|----------------|---------|
| T01 Fundamentals | ~10 L | 4 | 0.4 | Appropriate |
| T02 Fiber Physics | 12 L | 5 | 0.42 | Appropriate; 12 lessons well served |
| T03 Cable Selection | 12 L | 3 | 0.25 | Slightly underweighted |
| T04 Route Survey | 10 L | 3 | 0.3 | Acceptable |
| T05 NESC/Aerial Design | 15+ L | 5 | 0.33 | Appropriate for depth |
| T06 UG Design | 9 L | 4 | 0.44 | Solid |
| T07 Staking | 10 L | 2 | 0.2 | Underweighted for practical importance |
| T08 Make-Ready | 12 L | 4 | 0.33 | Good |
| T09 Permitting/Env | 11 L | 4 | 0.36 | Good |
| T10 Construction | 12 L | 3 | 0.25 | Slightly underweighted |
| T11 Splicing | 15 L | 4 | 0.27 | Acceptable |
| T12 Testing | 13 L | 4 | 0.31 | Appropriate |
| T13 Inspection/QA | 9 L | 3 | 0.33 | Acceptable |
| T14 Bonding/Grounding | 12 L | 4 | 0.33 | Good |
| T15 Restoration | 10 L | 2 | 0.2 | Underweighted for incident-response importance |
| T16 As-Built/GIS | 10 L | 2 | 0.2 | Acceptable given narrow scope |
| T17 Estimation | 10 L | 2 | 0.2 | Acceptable |
| T18 Safety/OSHA | ~10 L | **2** | **0.2** | **Underweighted — life-safety topic** |
| T19 Headend/CO | 9 L | **0** | **0.0** | **ABSENT — 0 questions** |

**Key proportionality gaps:**
- T18 (Safety & OSHA, life-safety critical, 10 lessons): only 2 questions due to slice bug. T18 earned 4 in the authored bank but F61/F62 were cut.
- T19 (Headend/CO + Rack-Side Hardware): zero questions in the delivered exam — a closed, authored 9-lesson topic with zero representation.
- T07 (Staking) and T15 (Restoration) are underweighted relative to their field importance but not at failure level.

---

## 2. Catalog and Meta Check

### Catalog Registration: WIRED CORRECTLY (from RT-B confirmation)
`course-catalog.js:735` registers `'C05.L01': '../lessons/C05/L01.osp-final-exam.jsx'`. `LessonRouter` uses `import.meta.glob` which picks up the C05 subdirectory. Routing is correct.

### Component Check: NO SEPARATE FinalExam COMPONENT
The exam is self-contained within the lesson file (LandingView, ExamView, ResultsView, ScoreBar components). No import of a missing `<FinalExam>` primitive. Import list at line 10 is clean.

---

## 3. Findings

---

### FINDING 1 — HIGH: NESC Rule cited in F50 question stem is WRONG (215D vs 96F)

**Question:** F50 (T14, Bonding/Grounding)
**File:** `L01.osp-final-exam.jsx:968-977`
**Verified by reading:** L01.osp-final-exam.jsx lines 966-977, T14/L03.messenger-bonding-rules.jsx throughout.

**Problem:** The question STEM states: *"NESC Rule 215D requires messenger strand bonding at pole attachment points."*

```js
// L01.osp-final-exam.jsx:968-969
prompt:
  'NESC Rule 215D requires messenger strand bonding at pole attachment points.
   For a 500-foot aerial span, how many bonding points does the NESC minimum require?',
```

The source lesson (T14.L03, cited as the source in the question comment) teaches **NESC Rule 96F** as the authoritative messenger bonding rule — not Rule 215D:

```js
// T14/L03.messenger-bonding-rules.jsx:21
'NESC Rule 96F',

// T14/L03.messenger-bonding-rules.jsx:42-44
term: 'NESC Rule 96F',
definition: 'The NESC rule that requires the communication messenger to be bonded
to the supply system MGN at every splice closure (or at equivalent intervals).
Rule 96F is the primary authority for messenger bonding intervals on joint-use
aerial plant. (Source: NESC C2-2023 Rule 96F.)',
```

The explanation also correctly cites NESC Rule 215D but this rule governs supply-side conductors and wiring methods — not communications messenger bonding. A student who memorizes this exam question will recall "NESC Rule 215D = messenger bonding" and will cite the wrong rule on a BICSI exam or in field engineering practice.

**The correct statement:** "NESC Rule 96F requires messenger strand bonding..."

**Impact:** This is the only question whose STEM contains a false premise (wrong rule number). The pedagogical damage is high: the question is designed to test bonding interval knowledge, but it misstates the governing rule and will plant incorrect knowledge in learners.

**Proposed fix:** Change prompt from "NESC Rule 215D requires..." to "NESC Rule 96F requires..." in both the prompt and the explanation's citation line.

---

### FINDING 2 — HIGH: T19 completely absent from the 60-Q exam (confirmed, independent verification)

**File:** `L01.osp-final-exam.jsx:1244-1245`
**Verified by reading:** lines 1244-1245 and counting F01-F64 question topics.

```js
const TOTAL_QUESTIONS = QUESTIONS.length; // 64 authored, slice to 60 below
const EXAM_QUESTIONS  = QUESTIONS.slice(0, 60); // 60-question exam
```

The distribution comment at lines 46-48 documents "T18×4, T19×2 = 64 written → trim T07, T15, T16, T17 by 1 each = 60." But the actual `slice(0, 60)` mechanism cuts the LAST 4 positions in the array, which happen to be:
- F61 (T18) — T18 Q3 of 4 (excluded)
- F62 (T18) — T18 Q4 of 4 (excluded)
- F63 (T19) — T19 Q1 of 2 (excluded)
- F64 (T19) — T19 Q2 of 2 (excluded)

The comment's claimed trim targets (T07, T15, T16, T17 by 1 each) ARE NOT CUT. All 2 questions from each of those topics remain. T18 is halved (4→2). T19 is completely removed.

T19 (Headend/CO + Rack-Side Hardware) is an authored, closed 9-lesson topic covering the critical OSP-to-ISP handoff interface knowledge. Zero questions means a learner can pass the final exam with zero knowledge of headend/CO hardware, GPON splitter ratios, ODF interconnect/cross-connect, or GPR bonding at the building entry.

**Note:** RT-B independently confirmed this as HIGH-1. Framing confirmed from both RT-A content coverage and RT-B structural perspectives.

**Proposed fix:** Reorder the QUESTIONS array so F63/F64 (T19) appear before positions 60-63 in the array (e.g., interleave them at positions ~30-31). Then move two of the four T18 questions to positions >60 to retain T18×2, or expand the bank to 62 questions and adjust the slice to preserve all T18 questions.

---

### FINDING 3 — HIGH: Severe answer-position bias (75% of questions have choice B correct)

**File:** `L01.osp-final-exam.jsx` — entire QUESTIONS array
**Verified by reading:** counting `answerIndex:` values for all 60 exam questions.

**Distribution of correct answers in the 60-Q exam (F01–F60):**

| Choice | Count | Percentage |
|--------|-------|-----------|
| A (index 0) | 2 | 3.3% |
| B (index 1) | **45** | **75%** |
| C (index 2) | 12 | 20% |
| D (index 3) | 1 | 1.7% |

A test-wise student who selects choice B for every single question would score **45/60 = 75%** — just 3 questions short of the 80% passing threshold. Any student with modest content knowledge who picks B and identifies even 3 additional correct answers from content clues would pass regardless of OSP mastery. 

This is a textbook answer-pattern validity failure. A well-calibrated 60-question exam should have roughly 15 correct answers per position (25% each, ±5%). The current distribution is 75% in one position.

**Why this happened:** Many questions are structured with distractors in positions A, C, D that are obviously wrong to any test-taker with minimal background, making B the "default sophisticated answer" by process of elimination. This is a systematic drafting pattern where "the most complete, nuanced answer" was consistently placed second.

**Impact on exam validity:** The pass threshold (80%) provides only a 5-question buffer above pure B-selection. The exam cannot reliably distinguish OSP knowledge from test-taking strategy. This undermines the stated purpose of confirming mastery.

**Proposed fix:** Randomize correct answer positions across questions so no more than ~25% fall in any one position. In the JSX format, this requires re-ordering `choices[]` and updating `answerIndex` to match for each affected question. Target distribution: 14-16 correct answers per choice position.

---

### FINDING 4 — MED: Citation typo in F08 explanation — "ITU-T G.952" should be "ITU-T G.652"

**Question:** F08 (T02, Fiber Physics)
**File:** `L01.osp-final-exam.jsx:197`
**Verified by reading:** line 197.

```js
// Line 197 explanation ends with:
'(T02.L03; ITU-T G.952)',
```

The question discusses chromatic dispersion on G.652.D fiber. ITU-T G.952 is not a recognized ITU-T fiber standards document (it does not exist in the G-series fiber standards; ITU-T G.95x covers WDM networking protocols). The correct citation is **ITU-T G.652** — the fiber type being discussed. 

**Verification:** The question prompt correctly names the fiber "G.652.D" and the dispersion coefficient (17 ps/nm·km) is the G.652.D value per ITU-T G.652.D §3.3. The "952" in the explanation is a typo for "652."

**Impact:** MED — the question answer and math are correct; the citation in the explanation is wrong. Students who look up the citation find nothing.

**Proposed fix:** Change `ITU-T G.952` to `ITU-T G.652` in the explanation for F08.

---

### FINDING 5 — MED: F11 has two internally contradictory distractors (ambiguous question design)

**Question:** F11 (T03, Cable Selection)
**File:** `L01.osp-final-exam.jsx:244-253`
**Verified by reading:** lines 236-254.

The question asks: "A drop cable settles to 90 lb long-term tension. Is the long-term tension compliant?" where EDS = 15% × 600 lb = 90 lb.

```js
choices: [
  'No — EDS limits long-term tension to 15% of 600 lb = 90 lb; 90 lb is exactly at the
   limit, so compliant but marginal',           // choice A: says "No" then says "compliant"
  'Yes — 90 lb is comfortably below the 600 lb breaking strength',  // choice B
  'No — EDS = 15% of 600 lb = 90 lb; 90 lb equals the limit exactly; any
   temperature-induced tension increase may cause a violation',      // choice C (correct)
  'Cannot determine without knowing ambient temperature and ice loading', // choice D
],
```

**Problem 1:** Choice A is self-contradicting: it begins "No — EDS = 90 lb; 90 lb is exactly at the limit, so **compliant but marginal**." A choice that starts with "No" and then says "compliant" is logically incoherent. A student who understands EDS (at the limit = not exceeding = technically compliant) would select A as the closest-to-correct answer.

**Problem 2:** The correct engineering interpretation of "at exactly the limit" is that the cable IS compliant (not exceeding the limit). Choice C's framing ("any temperature-induced tension increase MAY cause a violation") is prospective — it predicts future non-compliance, not present non-compliance. The question asks about current compliance, not future risk.

**Problem 3:** The pedagogical lesson being tested (don't sag to exactly EDS — leave thermal margin) is valid, but the question is the wrong vehicle. The question asks "Is the long-term tension compliant?" but the correct teaching point is "is exactly at EDS a good design practice?" These are different questions.

**Impact:** MED — the question has a defensible intended answer (C), but the logic of choice A is self-defeating, and a well-informed student could reasonably disagree with the "No" verdict on a cable exactly AT the EDS limit. This invites disputes.

**Proposed fix:** Reframe the question to directly ask about design practice: "A drop cable settles to exactly the EDS limit. Why is this tension problematic despite being at-spec?" Then restructure choices to test the thermal-margin concept without the compliance ambiguity.

---

### FINDING 6 — LOW: F27 uses "17 days" ambiguously — should specify business days

**Question:** F27 (T08, Make-Ready)
**File:** `L01.osp-final-exam.jsx:543-551`
**Verified by reading:** lines 539-551 and T08/L02-the-15-day-clock.jsx.

The question states: "a complete OTMR application was submitted to a pole owner **17 days** ago." The FCC rule specifies **15 business days**. If "17 days" means calendar days, that is only ~12-13 business days (17 calendar days includes 2 weekends = 4 non-business days). The 15-business-day clock would NOT have expired at 17 calendar days. The explanation asserts "the clock has expired" but this is only true if 17 means business days.

The source lesson (T08.L02) correctly states "15 business days" throughout.

**Impact:** LOW — the intended answer is clear from context, but test-sophisticated students familiar with "business days" terminology may hesitate on this question.

**Proposed fix:** Change "17 days" to "17 business days" in the question prompt for precision.

---

### FINDING 7 — LOW: F15 cites §1.1413; source lesson cites §1.1411

**Question:** F15 (T04, Route Survey)
**File:** `L01.osp-final-exam.jsx:327`
**Verified by reading:** line 327 vs T04/L04-pole-audit-attachment-measurement.jsx line 130.

F15's explanation cites "FCC 47 CFR §1.1413" for the make-ready process. The source lesson (T04.L04) and all T08 make-ready lessons cite "47 CFR §1.1411" as the OTMR rule. §1.1413 may govern related provisions, but the primary OTMR reference throughout the curriculum is §1.1411. This creates an inconsistency between the exam and the lesson content.

**Impact:** LOW — citation precision only; the answer and explanation logic are correct.

**Proposed fix:** Change `47 CFR §1.1413` to `47 CFR §1.1411` in F15 explanation to match the curriculum's consistently cited section.

---

## 4. Difficulty Calibration Assessment

**Positive:** Questions generally require application-level knowledge, not pure recall. Most questions present plausible distractors that a confused student would actually consider:
- F06 (link budget): four numerically close values requiring correct calculation
- F18 (thermal sag): tests whether students understand hot-day vs worst-case sag
- F32 (NLEB ESA): tests nuanced understanding of CE extraordinary circumstances
- F49 (parallel ground rods): requires basic circuit knowledge, not just memorization
- F38 (fusion splice "gainer"): scenario-based, tests instrument interpretation skill

**Concern:** Several questions (F07, F12, F28, F40, F45) have "obviously wrong" distractors alongside one clearly-superior answer. A student with general technical literacy — but not necessarily OSP-specific knowledge — could eliminate 2-3 choices and select the correct answer. Combined with the 75% B-selection bias, these questions contribute to the test-wisdom path to passing.

**Recommended:** At least 15-20 questions should require numerical calculation or quantitative reasoning where guessing is harder. Currently: F06, F08, F11, F16 (sag addition), F22 (fill%), F49 (parallel rod), F53 (bidirectional OTDR), F57 (EVM), F58 (CPHP) = 9 quantitative questions. Acceptable minimum for a field-proficiency exam; adding 5-8 more would strengthen validity.

---

## 5. Primary Source Correctness Spot-Check

| Claim | Verified? | Notes |
|-------|-----------|-------|
| H₂S IDLH = 100 ppm (F59) | ✓ CORRECT | Matches known-cascade-patterns.md P2 resolution (NIOSH = 100 ppm) |
| G.657.A2 min bend radius = 7.5 mm (F12) | ✓ CORRECT | Confirmed in T03.L05 lines 121, 182, 340; ITU-T G.657 A2 operational min |
| Link budget math F06: 6.55 dB | ✓ CORRECT | Arithmetic verified |
| Chromatic dispersion F08: 136 ps | ✓ CORRECT | 17 × 0.1 × 80 = 136 ps |
| F08 citation "ITU-T G.952" | ✗ WRONG | Should be G.652 (typo — see Finding 4) |
| NESC Rule 215D = messenger bonding (F50) | ✗ WRONG | Rule is 96F per T14.L03 (see Finding 1) |
| OTMR 15 business days (F27 explanation) | ✓ CORRECT | Matches 47 CFR §1.1411 |
| TIA-598-D position 5 = Slate (F03) | ✓ CORRECT | Standard color sequence: Bl/Or/Gr/Br/Sl/Wh/R/Bk/Y/V/Rs/Aq |
| NWP 57 threshold = 0.5 acres (F33) | ✓ CORRECT | Per 33 CFR Part 330 NWP 57 conditions |
| GR-1275 §5 ≤5 Ω FDH requirement (F49) | ✓ CORRECT | Matches T14.L06 lesson content |
| OSHA 1910.67(c)(2)(ii) bucket truck (F60) | ✓ CORRECT | Continuous fall protection required |
| Bidirectional OTDR average = 7,275 m (F53) | ✓ CORRECT | (7,230 + 7,320)/2 = 7,275 m |
| EVM: projected cost = $1,120,000 (F57) | ✓ CORRECT | CPI = 0.893, EAC = 1M/0.893 ≈ $1.12M |
| CPHP = $500/home (F58) | ✓ CORRECT | $450,000 ÷ 900 = $500 |
| Parallel ground rod ≈ 4 Ω (F49 explanation) | ✓ CORRECT | 8×8/(8+8) = 4 Ω |

---

## 6. Confirmed Clean (Negative Findings)

1. **T01-T17 question sourcing:** every question in F01-F58 cites a source lesson in its JSX comment, and spot-checked questions map accurately to the cited lesson content.
2. **Math in quantitative questions:** all math independently verified (F06, F08, F16, F22, F49, F53, F57, F58 all correct).
3. **Safety-critical values:** H₂S IDLH (100 ppm, F59), OSHA 1910.67 continuous fall protection (F60), OSHA 1910.146(d)(5) 4-gas minimum (F59) — all correct and confirmed against cascade-pattern registry.
4. **Standard citation alignment (T08 OTMR questions):** F27, F28, F29 consistently and correctly cite 47 CFR §1.1411 and FCC 18-111.
5. **G.652.D 30mm mandrel spec (F05):** the lesson context for G.652.D bend limits is consistent between the exam and T02.L04.
6. **IEC 61300-3-35 Zone A = 0-25 µm (F43):** correct per the standard. Zone A is the critical core region; Zone B is cladding.
7. **NWP 57 scope includes fiber (F33):** correct — NWP 57 (Utility Line Activities) covers telecommunications including fiber OSP.
8. **NESC loading districts — Macon, GA = Light (F20):** correct per CLAUDE.md §1 and NESC Figure 250-1.
9. **No free-text/open-ended questions:** all 60 questions are MC with fixed answer keys, compliant with Carter's directive (no "write your response" items).
10. **Distractor quality (general):** the majority of distractors are plausible — they represent common field errors, reasonable-sounding but wrong alternatives, and common misconceptions. F06 (close numeric values), F32 (NLEB nuances), F44 (gainer vs real gain), F38 (prediction vs actual splice loss) show strong distractor quality.

---

## 7. Coverage Gaps — Critical Concepts Not Tested

Topics with notable gaps vs. their lesson depth:

| Topic | Gap |
|-------|-----|
| T02 Fiber Physics | No OTDR-reading question (wavelength windows tested but no trace interpretation) |
| T05 NESC | No actual sag formula calculation (F18 tests conceptual understanding, not arithmetic; F16 tests addition only) |
| T11 Splicing | No OTDR-to-splice-matrix workflow question |
| T13 Inspection | No inspector kick-back documentation workflow question |
| T19 Headend/CO | ZERO questions (entire topic absent — highest severity gap) |
| T20 RUS Program | ZERO questions (T20 authored, listed in catalog prerequisites, not tested) |

---

## 8. Closeout

### Commit log confirmation:
```
git log --oneline main..agent/osp-final-exam-rt-a-content
```
(will paste after push)

### Diff confirmation:
```
git diff --stat main..agent/osp-final-exam-rt-a-content
```
(will paste after push)

---

## Finding Summary

| # | Severity | Area | Description | Fix |
|---|----------|------|-------------|-----|
| 1 | HIGH | F50 question stem | Wrong NESC rule: "215D" should be "96F" — embedded factual error in the stem | Change prompt + explanation |
| 2 | HIGH | Structural/slice | T19 has 0 questions in 60-Q exam due to slice(0,60) cutting wrong topics | Reorder array or expand bank |
| 3 | HIGH | Answer bias | 75% (45/60) correct answers are choice B — passes by B-selection requires only 3 more right | Randomize correct answer positions |
| 4 | MED | F08 explanation | "ITU-T G.952" should be "ITU-T G.652" (typo in citation) | Fix typo |
| 5 | MED | F11 design | Two self-contradicting distractors; ambiguous "is at-limit compliant?" framing | Reframe question |
| 6 | LOW | F27 wording | "17 days" should be "17 business days" for FCC §1.1411 precision | Add "business" qualifier |
| 7 | LOW | F15 citation | §1.1413 → §1.1411 to match curriculum-wide citation convention | Fix citation |

---

## Verdict: YELLOW

Three HIGH findings must be resolved before release:
- Finding 1 (wrong NESC rule in stem) teaches incorrect knowledge
- Finding 2 (T19 absent) violates stated scope — "Headend/CO Hardware" is a stated exam domain
- Finding 3 (75% B-selection) renders the pass threshold gameable by test-wise strategy alone

Two MED findings should also be addressed:
- Finding 4 (G.952 typo) — any student who looks up the citation finds nothing
- Finding 5 (F11 ambiguous design) — invites student disputes on a fair exam question

=== RT-A CONTENT COVERAGE REPORT END ===
