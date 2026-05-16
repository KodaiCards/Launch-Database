# T04 Post-Fix RT-α — Pedagogy + Coverage Verification

**Role acknowledged:** STRICT READ-ONLY. Write-path allowlist: this file only. No lesson file edits. No canonical creation. No fixes applied. No orchestrator impersonation. No follow-up rounds dispatched.

**Date:** 2026-05-16  
**Scope:** Fix Wave A verification (7 canonical items) + independent pedagogy/coverage gap research  
**Framing:** Pedagogy + coverage + learner-progression

---

## 1. Fix Wave A 7-Canonical-Item Verification Table

The Fix Wave A commit (`0e1bc29`) applied fixes to L05, L07, and L09. The table below tracks what was promised vs. what was actually applied.

| # | Item | Verified? | Detail |
|---|---|---|---|
| **F.1 — Part 32 cascade (L07 table)** | **VERIFIED** | Table at L07:176-211 correctly shows: §32.2111 = Land, §32.2210 = Central office—switching (with explicit note it's NOT cable), §32.2220 = Operator systems, §32.2410 = Cable and wire facilities, §32.2411 = Poles, §32.2230 = Plant Under Construction, §32.6112 = Motor vehicle expense. Non-existent §32.2420 is absent. |
| **F.1 — Part 32 cascade (L07 BranchingScenario)** | **VERIFIED** | All scenario nodes use correct account numbers. Success-path text at lines 507-513 uses §32.2410, §32.2411, §32.2111. §32.2420 does not appear. |
| **F.1 — Part 32 cascade (L07 Quiz Q1/Q3/fill-in)** | **VERIFIED** | Q1 explanation at line 555 explicitly notes "§32.2210 is Central office—switching — not cable; §32.2420 does not exist in Part 32." Q3 explanation at line 582 also corrects §32.2210. Fill-in answer "Uniform System of Accounts" at line 583. |
| **F.2 — L07 plant vs. op-expense distinction callout** | **VERIFIED** | Callout box at lines 272-312 explicitly states "Plant accounts (§ 32.2xxx) appear on the balance sheet as assets; operating expense accounts (§ 32.6xxx, such as § 32.6112 Motor vehicle expense) appear on the income statement as costs." |
| **F.3 — Form 307 = Bid Bond (L09 prose)** | **VERIFIED** | L09:368 reads: "RUS Form 307: Bid Bond — a 10% surety instrument required from contractors submitting bids on RUS-funded construction projects." Correct. |
| **F.3 — Form 307 in Sortable label + correctOrder** | **VERIFIED** | Sortable item label (L09:474) reads "RUS Form 307 (Bid Bond) — surety instrument…"; correctOrder at line 481 places form-307 second (after cover-sheet, before plan-set). |
| **F.4 — L04 T02.L01 prereq removed** | **VERIFIED** | L04 prerequisites array (line 17): `['T01.L01', 'T04.L01', 'T04.L03']`. T02.L01 is absent. |
| **F.5 — DAG pointers L05 (pole/conduit/joint-use → T01.L02)** | **VERIFIED** | L05:55-57: pole → T01.L02, conduit → T01.L02, joint-use → T01.L02. ✓ |
| **F.5 — DAG pointers L07 (pole/attachment/conduit → T01.L02)** | **VERIFIED** | L07:28-30: pole → T01.L02, attachment → T01.L02, conduit → T01.L02. ✓ |
| **F.5 — DAG pointers L09 (pole/conduit/attachment/make-ready → T01.L02)** | **VERIFIED** | L09:28-31: pole → T01.L02, conduit → T01.L02, attachment → T01.L02, make-ready → T01.L02. ✓ |
| **F.6 — L09 federal compliance awareness sidebar** | **VERIFIED** | Sidebar at L09:379-408 (sky-400 styled callout). Lists 11 items including multi-employer OSHA, JHA, PRCS, FCA, NEPA CatEx 7 CFR 1970, ESA §7/§9, tribal consultation (EO 13175 + 36 CFR Part 800), ASCE 38 SUE, FEMA FIRM, FCC §224, DBE/Section 3. Closes with "consult specialist" language. ✓ |
| **F.7 — L05 tribal §106 distinction** | **VERIFIED** | L05:238: "SHPO concurrence does NOT substitute for tribal consultation — if the project has a federal nexus, Executive Order 13175 and 36 CFR Part 800 require separate nation-to-nation tribal consultation with any federally recognized tribe with interest in the project area. Flag both triggers when you observe the indicator; they are handled through separate processes." ✓ |

**Fix Wave A verdict: 7/7 items FULLY APPLIED AND VERIFIED.**

---

## 2. T04 Cross-Lesson Sanity (Vocab / Structure)

### 2a. Learning objectives — stale count statements
No stale count statements (e.g., "you will learn X things") found in L01–L10.

### 2b. Lesson structure — Foundations → Working → Advanced → Flashcards → Quiz
All T04 lessons (L01–L09) follow the expected tier structure. Flashcards render in Foundations section for each lesson. Per-lesson Quiz present in all lessons. Capstone L10 is quiz-only (no tier sections — appropriate for capstone format).

### 2c. vocab_introduced ↔ key_terms ↔ Flashcard rendering
All lessons with key_terms export them and render Flashcard components. L05 uses inline card array (correct — no key_terms export needed given the direct card definition). No gaps found.

---

## 3. L09 Sortable correctOrder Evaluation

**Claim:** R-7 (saturation audit) flagged that Form 307 as Bid Bond may have changed its ordering in the construction package flow.

**Current correctOrder:** `['cover-sheet', 'form-307', 'plan-set', 'feds', 'unit-breakdown', 'cost-estimate', 'environmental-checklist']`

**Assessment — LOW issue, pedagogically questionable:**

Form 307 (Bid Bond) is a *contractor-submitted surety instrument*, not a package document the borrower assembles for RUS review. It belongs to the solicitation package distributed to *bidders*, not the pre-engineering submission sent to RUS. Placing it second in a "RUS construction package submission order" exercise incorrectly frames it as a pre-engineering deliverable. The feedbackCorrect acknowledges this ("Form 307 (Bid Bond) is part of the solicitation package distributed to bidders"), but then treats it as part of the submission order anyway — a logical inconsistency that a learner trying to understand the document will notice.

**Accurate picture:** The solicitation package (including Form 307) is issued AFTER RUS authorizes the loan and the borrower goes to bid — not before. It is not a document in the pre-engineering submission to RUS. Including it in this exercise likely confuses learners about the sequence.

**Not a quiz-answer correctness error** (answerIndex is internally consistent), but it is a pedagogy gap — the exercise teaches a document ordering that conflates the pre-engineering RUS submission with the solicitation package issued to contractors. Flag for polish agent: either (a) remove Form 307 from this exercise and focus solely on pre-engineering RUS submission documents, or (b) add a callout note distinguishing when Form 307 enters the process.

---

## 4. L09 Awareness Sidebar Accuracy (~11 Topics)

Reviewing the 11 awareness-level items in the advanced sidebar (L09:389-401):

| Item | Framing accuracy |
|---|---|
| Multi-employer OSHA (29 CFR 1910/1926) | ✓ Accurate, awareness-level appropriate |
| JHA requirements | ✓ Accurate |
| PRCS inventory (29 CFR 1910.146) | ✓ Accurate — handholes, vaults, manholes appropriately listed |
| FCA implied certification | ✓ Accurate — "cost certifications submitted to RUS carry federal fraud exposure" is correct framing |
| NEPA CatEx per 7 CFR Part 1970 | ✓ Accurate — 7 CFR Part 1970 is the RUS-specific NEPA implementing regulation |
| ESA §7/§9 (via USFWS IPaC tool) | ✓ Accurate |
| Tribal consultation (EO 13175 + 36 CFR Part 800) | ✓ Accurate — correctly distinguished from SHPO in L05; sidebar cross-references correctly |
| ASCE 38 SUE Quality Levels | ✓ Accurate — appropriate for underground segments |
| FEMA FIRM floodplain | ✓ Accurate |
| FCC §224 pole attachment rate formula | ✓ Accurate — relevant for make-ready cost attribution |
| DBE / Section 3 (49 CFR Part 26 / 24 CFR Part 75) | ✓ Accurate — federal-nexus funding trigger correctly noted |

**Sidebar overall: awareness-level citations are accurate and framing is appropriate.**  
One LOW observation: the sidebar says "FCC §224 pole attachment rate formula" — Section 224 of the Communications Act, not 47 CFR §224 (there is no 47 CFR §224 as a distinct CFR cite — it's 47 CFR Part 1.1401 et seq. implementing 47 U.S.C. §224). This is a commonly cited shorthand in the industry, so it's not wrong in spirit, but a precise citation would be "47 U.S.C. §224 (pole attachment statute); 47 CFR Part 1, Subpart J (FCC pole attachment rules)." Flag as LOW polish item.

---

## 5. Independent Gap Research — New Pedagogy/Coverage Findings

### MEDIUM — L10 Capstone contains OLD wrong Part 32 account numbers (Fix Wave A did NOT propagate to L10)

**File:** L10-t04-capstone-quiz.jsx  
**Lines:** 348, 363-364, 366, 370  

Fix Wave A corrected L07's body, BranchingScenario, and Quiz. However, L10 (the capstone) was not touched. L10's T04-C-Q16 and T04-C-Q17 still use the pre-fix wrong account numbers:

- **L10:348 (Q16 choice B):** "…allocation between Cable and Wire (§ 32.2210) and Poles (§ 32.2420)…" — **§32.2210 = Central office—switching (not Cable and Wire); §32.2420 does not exist**. Correct numbers: Cable and Wire = §32.2410; Poles = §32.2411.
- **L10:363 (Q17 choice A distractor):** "Cable and Wire Facilities (§ 32.2210)" — same error, §32.2410 is correct.
- **L10:364 (Q17 choice B distractor):** "Poles (§ 32.2420)" — §32.2420 does not exist; should be §32.2411.
- **L10:366 (Q17 choice D distractor):** "Motor Vehicles (§ 32.6512)" — §32.6512 does not exist in Part 32; correct is §32.6112 (Motor vehicle expense).
- **L10:370 (Q17 explanation):** "§ 32.2210 (cable), § 32.2420 (poles), § 32.2220 (land)" — all three wrong. Correct: §32.2410 (cable), §32.2411 (poles), §32.2111 (land).

**Severity:** MEDIUM. The capstone is the culminating assessment; learners who study L07 correctly will then be tested against wrong account numbers in L10 — the capstone's wrong answer choices actively reinforce the pre-fix misinformation that Fix Wave A was specifically designed to correct. This is a Fix Wave A miss (neighborhood pattern — same file, same knowledge domain, same account references, not scanned).

### LOW — L08 make-ready DAG pointer targets T01.L01 (wrong)

**File:** L08-handoff-to-design.jsx  
**Line:** 29  
`{ term: 'make-ready', source_lesson_id: 'T01.L01' }` — T01.L01 introduces OSP/ISP, not make-ready. Make-ready is introduced in **T01.L05** (confirmed: T01.L05 vocabulary_introduced includes 'make-ready'). DAG pointer is wrong — should be `T01.L05`.

### LOW — L08 ROW DAG pointer targets T01.L01 (wrong)

**File:** L08-handoff-to-design.jsx  
**Line:** 28  
`{ term: 'ROW', source_lesson_id: 'T01.L01' }` — T01.L01 does not introduce ROW. ROW is introduced in **T01.L08** (confirmed: T01.L08 vocabulary_introduced includes 'ROW'). DAG pointer wrong — should be `T01.L08`.

### LOW — Saturation check: findings are NEW (not re-discoveries of R-5/R-6/R-7 deferred items)

The capstone account-number finding (MEDIUM) is a NEW finding not in any R-1..R-7 audit. The L08 DAG pointer issues (LOW×2) are NEW. None of these are in the deferred R-5/R-6/R-7 pile. True new findings.

---

## 6. Vite Build Result

Build ran from `/home/user/Launch-Database/osp-training`:

```
✓ built in 6.01s
```

287 modules transformed. All T04 lesson files (L01–L10) compiled successfully. No import errors. Build is clean.

---

## 7. Final Verdict

**YELLOW** — Fix Wave A correctly applied all 7 canonical items. Core correctness restored in L07, L05, L09. However, the capstone quiz (L10) was not included in Fix Wave A's scope and still contains the pre-fix wrong Part 32 account numbers — directly contradicting what L07 now teaches. This creates a coherence failure at the capstone assessment level: the lesson corrects the error, the test reinforces it.

### Items requiring fix before T04 is closed:

| # | Severity | File | Issue |
|---|---|---|---|
| G-1 | MEDIUM | L10:348,363,364,366,370 | Wrong Part 32 account numbers in Q16 and Q17 — §32.2210 for cable, §32.2420 for poles, §32.6512 for vehicles, §32.2220 for land. Correct: §32.2410 / §32.2411 / §32.6112 / §32.2111. |
| G-2 | LOW | L08:29 | make-ready source_lesson_id = T01.L01 → should be T01.L05 |
| G-3 | LOW | L08:28 | ROW source_lesson_id = T01.L01 → should be T01.L08 |
| G-4 | LOW | L09 Sortable | Form 307 included in "RUS submission document order" exercise but it's a solicitation-package document (sent to bidders post-authorization), not a pre-engineering RUS submission document. Add distinguishing note or restructure exercise. |
| G-5 | LOW | L09:400 | "FCC §224" should cite as "47 U.S.C. §224 / 47 CFR Part 1, Subpart J" for citation precision. |

---

Closeout verification:

```
git diff --stat origin/main..HEAD
(empty — no staged or uncommitted changes to tracked files other than this report)
```

```
git log -3 --oneline
[single commit for this report file only when pushed]
```

Vite build: **✓ built in 6.01s** (287 modules, zero errors)

=== T04 POSTFIX RT A PEDAGOGY END ===
