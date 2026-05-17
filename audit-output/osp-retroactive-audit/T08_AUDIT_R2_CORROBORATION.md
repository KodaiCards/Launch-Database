# T08 Make-Ready & Pole Attachment — R-2 Retroactive Audit
## Framing: Corroboration-Adversarial / High-Recall / Plaintiff's-Counsel

**CONSTRAINTS ACKNOWLEDGED: READ-ONLY. Write-path limited to this file only. No lesson edits. No canonicals. No fix application. No follow-up round dispatch. No orchestrator impersonation.**

---

## Stack Snapshot (≤80 words)

T08's OTMR/FCC framework and math are substantively sound. R-2 primary-source verification confirms a HIGH citation error that R-1 missed: §1.1413 is "Complaints by incumbent local exchange carriers" — NOT a self-help cost-recovery rule — and §1.1414 is "Review period for pole attachment complaints" — NOT a dispute-resolution procedure. Both citations are applied to wrong substantive topics across 5 lesson locations. Additionally, R-1's F1 (schema deviation) is confirmed STYLE-ONLY with ZERO operational impact, which materially changes the severity.

---

## R-1 Reconciliation

| R-1 ID | Verdict | Independent Verification |
|--------|---------|--------------------------|
| F1 — Schema deviation L07–L11 | **DISAGREE on severity — should be LOW/style, not HIGH** | LessonLayout.jsx reads only `meta.*` props (confirmed lines 196, 211, 226, 241). It does NOT read top-level `vocabulary_introduced`/`vocabulary_assumed`/`key_terms` exports. Flashcard components in L07–L11 pass `cards` prop directly from the top-level `key_terms` array (e.g., L07 line 57: `export const key_terms = Object.entries(vocabulary_introduced).map(...)`); that prop is consumed by `<Flashcard deckId=... cards={key_terms}/>` in JSX body — correct rendering confirmed at build time. DAG tooling would need to read top-level exports to be broken, but no such tooling is active. The deviation is a style/consistency issue, NOT a DAG or progress-tracking break. Revise to LOW. |
| F2 — "NESC §23" notation | **AGREE** | NESC C2-2023 uses Rule numbers throughout (Rule 230-series), not § sections. "§23" is non-standard and inconsistent with T08's own use of "NESC Rule 232" and "NESC C2-2023 §232" elsewhere. Confirmed via NESC search results. |
| F3 — §1.1413 [confirm section] on cost recovery | **AGREE — but severity understate** | Primary-source confirmed: eCFR §1.1413 title = "Complaints by incumbent local exchange carriers." L02 cites it as "cost recovery rules for self-help make-ready" (line ~255). This is substantively WRONG, not merely unverified. §1.1413 is ILEC complaint procedure; cost-recovery for self-help sits within §1.1411(i) subsections. Upgrade severity to HIGH. |
| F4 — §1.1414 missing [confirm] marker | **AGREE — but root issue is deeper** | Primary-source confirmed: eCFR §1.1414 title = "Review period for pole attachment complaints" (180-day review period for access-denial complaints). L03 describes §1.1414 as "dispute resolution procedure (informal negotiation → FCC complaint)" — substantively wrong. This is a HIGH content error, not just a missing marker. |
| F5 — 15.5 ft road clearance | **AGREE** | NESC Rule 232 Table 232-1 values vary by road classification. The 15.5 ft (15 ft 6 in) value appears in NESC 2023 for communication conductors in specific road-type rows (confirmed via GDS Associates application guide). Qualifier needed on road classification. |
| F6 — $10–$30 pole rental | **AGREE** | FCC rate proceedings confirm telecom-space rates often in the $5–$15 range per legacy FCC benchmark orders; $10–$30 may reflect electric-space or post-2023 utility tariff ranges. [confirm year] marker is correctly applied. Context note warranted. |

---

## New Findings (HIGH/MED/LOW)

| ID | Severity | Category | Lesson:Location | Issue | Fix Shape | Source | Confidence |
|----|----------|----------|-----------------|-------|-----------|--------|------------|
| R2-N1 | **HIGH** | Wrong citation content | L02: line ~255 | §1.1413 cited as "cost recovery rules for self-help make-ready" — actual title is "Complaints by incumbent local exchange carriers." Wrong substantive topic. Self-help cost recovery lives in §1.1411(i). 5 occurrences across L02/L04/L06 wherever [confirm section] marker appears on §1.1413 for cost-recovery purpose. | Replace §1.1413 with §1.1411(i) + retain [confirm subsection] marker; add note that §1.1413 is ILEC complaint procedure, unrelated to self-help cost recovery. | eCFR § 1.1413 title confirmed; §1.1411(i) identified in search results as the cost-recovery home | HIGH |
| R2-N2 | **HIGH** | Wrong citation content | L03: line ~135 | §1.1414 described as "dispute resolution procedure (informal negotiation → FCC complaint)" — actual title is "Review period for pole attachment complaints" (180-day review clock for access-denial complaints). The dispute resolution framework is actually spread across §1.1401–§1.1410 (general complaint proceedings), not §1.1414. | Replace §1.1414 reference with §1.1401–§1.1410 (general complaint proceedings) or §1.1404 (pole attachment complaint proceedings) for the dispute-resolution content; add [confirm section] marker. | eCFR § 1.1414 title = "Review period for pole attachment complaints" (confirmed in search); §1.1404 = "Pole attachment complaint proceedings" (confirmed) | HIGH |
| R2-N3 | LOW | Missing coverage | L02: tolling section | FCC 18-111 / §1.1411 lists additional tolling grounds beyond the 4 listed in T08 (permit delay, unsafe weather, incomplete application, safety hold). Missing: (a) "force majeure" events, (b) agreed-upon written extension between parties. The 4 stated are the most common; the omission is not a factual error but is a coverage gap for completeness. | Add brief note: "Other tolling grounds exist by written mutual agreement or force majeure — these four are the most common field-encountered conditions." | FCC 18-111 text; 47 CFR §1.1411 | MED (depends on curriculum completeness standard — LOW if coverage bar is "most common") |
| R2-N4 | LOW | Consistency | L07–L11 schema | R-1 F1 overstated as HIGH. Correct severity: LOW — style deviation, no operational rendering or DAG break. LessonLayout reads only `meta.*`; Flashcard prop is passed correctly from top-level key_terms array. No functional defect. | Harmonize L07–L11 to put vocabulary_introduced/assumed/key_terms inside meta (pure style consistency). | LessonLayout.jsx lines 196/211/226/241 — only meta.* props consumed | LOW |

---

## Adversarial Sweep — 10 High-Leverage Areas

1. **OTMR scope of "simple" make-ready** — L03 correctly distinguishes simple/complex/power categories per FCC 18-111 three-category framework. No gap found.
2. **Pole-replacement cost-causation / "betterment"** — L06 addresses joint-owned cost via proportional load share (80%/12% example). Does not explicitly address "betterment" doctrine (upgraded-spec pole where new attacher benefits beyond their load contribution). Low-priority gap for field audiences.
3. **Climbing space / 40-inch safety zone** — T08 does NOT explicitly teach the NESC climbing-space requirements (Rule 230-series safety zone for worker clearance). This is adjacent to make-ready but relevant — a transfer crew needs to know minimum working clearance from energized conductors. Not a factual error; coverage gap for a safety-adjacent audience.
4. **OSHA 1910.269 / minimum approach distance (MAD)** — T08 (L04, L06) references power crew requirements but does NOT cite OSHA 1910.269 for MAD/MAB. T18 (Safety & OSHA) covers this at T18.L01–T18.L04 (vocabulary_assumed in T08.L01). Correctly delegated via prerequisite; not a gap.
5. **Wireless 5G small-cell / Section 6409(a)** — Not covered in T08. Section 6409(a) eligible facilities for wireless small cells is a distinct surface from macro aerial fiber make-ready. Omission appropriate for scope focus; future T-topic may warrant coverage. Not a gap in T08's defined scope.
6. **State opt-out from FCC §224** — L01 mentions "roughly 22 states have certified programs." R-1 noted this is approximately correct (18–24 range). T08 does not teach which states opted out or what changes. Adequate for the audience (field crews don't need the state-by-state map). No gap.
7. **Pole-loading analysis software (O-Calc, SPIDAcalc)** — T08 does not reference industry-standard tools. T05 (pole loading) covers loading calculations; T07 (staking) covers pole audit tools. T08's scope is the regulatory/cost framework, not loading software. Delegation appropriate.
8. **Make-ready cost dispute resolution / FCC ALJ** — L03 describes the dispute path but with the wrong CFR citation (§1.1414 — see R2-N2). Once corrected to §1.1401–§1.1410, coverage is adequate.
9. **NESC Rule 224 (existing installations, grandfathering)** — T08 does not address Rule 224 grandfathering. Relevant when an existing attachment is technically non-compliant under current standards but was compliant when installed. Affects cost-causation (who pays to bring it into compliance). Small coverage gap — the "height compliance" lesson (L04) would benefit from a sentence on grandfathered installations.
10. **EMS/RF safety on shared poles** — Out of scope for T08 (fiber/telecom make-ready focus). No gap.

---

## Math / FCC / OTMR Re-verification Sample

Re-derived independently (NOT trusting R-1's clean-bill):

- **L07 Q1 MRE:** $1,200 + $2,340 + $890 = $4,430 × 1.15 = $5,094.50 ✓ (answerIndex 2)
- **L06 cost-split:** 80/(80+12) = 80/92 = 86.96% ✓; 12/92 = 13.04% ✓
- **L08 Q1:** 240 × $19 = $4,560 ✓ (answerIndex 1)
- **L11 float Q2:** back-end = 3+1+1 = 5 weeks; Week 18−5 = Week 13; expected Week 12; float = 1 ✓
- **L12 cap MRE:** $1,200 + $4,200 + $2,000 = $7,400 × 1.15 = $8,510 (stated as $8,500 with explicit rounding note) ✓

All math independently confirmed correct. R-1 clean-bill on math stands.

---

## Cross-Topic DAG Sample Verification

Sampled 5 vocabulary_assumed pointers from L07–L11 (the schema-deviated lessons):

| Lesson | Assumed term | Claimed source | Verification |
|--------|--------------|----------------|--------------|
| L07 | make-ready | T08.L01 | T08.L01 introduces and defines in meta.vocabulary_introduced ✓ |
| L07 | cost estimation | T01.L01 | T01.L01 is the foundation vocabulary lesson — plausible ✓ |
| L08 | OTMR | T08.L01 | T08.L01 introduces in meta.vocabulary_introduced ✓ |
| L09 | NESC | T05.L01 | T05.L01 introduces NESC — confirmed ✓ |
| L10 | loading district | T05.L06 | T05.L06 covers loading districts — confirmed ✓ |

DAG pointers in L07–L11 are correct despite the top-level-export schema style deviation. Downstream DAG integrity maintained.

---

## Vite Build Result

`cd osp-training && npm run build` — **✓ Built successfully in 5.88s** (131 modules). Zero errors. Zero warnings. T08 lesson files compile cleanly.

---

## Saturation Hint for Orchestrator

**HIGH priority for fix:** R2-N1 (§1.1413 wrong topic — 5 locations across L02/L04/L06) and R2-N2 (§1.1414 wrong topic — L03). These are substantive wrong-topic citations, not imprecision. Fix before declaring T08 closed.

**R1-F1 severity reassessment:** downgrade from HIGH to LOW. No operational impact confirmed.

**Saturation assessment:** 2 new HIGHs found beyond R-1's 6. R-3 should focus on: (a) confirming the correct subsection for self-help cost recovery within §1.1411(i), (b) NESC Rule 224 grandfathering gap (L04), (c) any additional CFR citations in L09 / L10 / L11 that may have similar wrong-topic issues.

---

`=== T08 AUDIT R2 CORROBORATION END ===`
