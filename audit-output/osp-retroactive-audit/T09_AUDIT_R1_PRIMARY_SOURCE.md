# T09 AUDIT R1 — PRIMARY SOURCE SKEPTICAL / HIGH-PRECISION
**Framing:** Primary-source-first, high-precision, skeptical — OSP permitting/environmental compliance specialist
**Lessons audited:** L01–L12 (12 lessons total)
**Time spent:** ~55 minutes
**Primary sources sampled:** Cornell LII (CFR), ACHP.gov, USACE NWP 57 official docs, NTIA BroadbandUSA, FWS.gov, Federal Register

---

## CONSTRAINT ACKNOWLEDGEMENT
READ-ONLY audit. Write-path: this file ONLY. No edits to lesson files, no canonicals, no CLAUDE.md edits, no follow-up dispatch. All bugs are REPORTS, not fixes.

---

## 1. Stack Snapshot

12 lessons audited, L01–L12. Full read on L01–L06, L09, L11; spot-check on L07, L08, L10, L12. Primary-source checks: 36 CFR 800.4 (§106 timing), NWP 57 2021/2026 reissuances, NLEB 88 FR 6358, BEAD CE C-8 NTIA designation, CEQ 40 CFR 1508 status, BEAD $42.45B amount. Vite build: PASS (✓ built in 5.89s).

URLs sampled:
- ACHP.gov – 30-Day Review Timeframes guidance
- saw.usace.army.mil – NWP 57 2021 text
- poa.usace.army.mil – NWP 57 2026 reissuance
- broadbandusa.ntia.gov – NEPA CE overview / FAQs
- FWS – 88 FR 6358 (NLEB Endangered reclassification)
- FederalRegister.gov – 2026 NWP reissuance (2026-00121)
- FederalRegister.gov – CEQ NEPA regulation removal (2025/2026)

---

## 2. Structured Findings

| ID | Severity | Category | Lesson:Line | Issue | Fix shape | Source | Confidence |
|----|----------|----------|-------------|-------|-----------|--------|------------|
| F-01 | HIGH | Citation accuracy / regulatory staleness | L02:348–349 (Advanced); also L02:507 (Quiz Q4) | Lesson cites "40 CFR §1508.27" as the active CEQ definition of "significantly" (context + intensity). CEQ removed all of 40 CFR Parts 1500–1508 effective January 8, 2026. Section 1508.27 no longer exists as binding regulation. Citing it as current authority is materially wrong. | Replace reference with a note that CEQ withdrew its NEPA implementing regulations in 2025/2026; significance determination now governed by each agency's own procedures (RUS: 7 CFR 1970; NTIA: NTIA-specific CE procedures). Add [confirm current CEQ regulatory status] marker. | FR 2026-00178 (removal effective Jan. 8, 2026); FederalRegister.gov 2025-03014 | HIGH |
| F-02 | HIGH | Citation accuracy / regulatory staleness | L01:352 (Advanced source note); L02:507 (Quiz explanation) | Lesson cites "40 CFR §1501.7" for lead and cooperating agencies. That specific section was in the 2020 revised CEQ rules (which renumbered from the 1978 version), now also removed. Citation format is correct for the 2020 version but that version is also no longer binding per the January 2026 removal rule. | Same fix shape as F-01: acknowledge CEQ rule removal; cite agency-specific NEPA procedures; add [confirm] marker. Coordination between federal agencies on multi-agency projects is still required by NEPA statute (42 USC §4332), even absent the CEQ rule. | FR 2026-00178 | HIGH |
| F-03 | MED | Citation accuracy | L05:457 (Quiz L05-Q1 citation) | Lesson cites "87 FR 57298 (2022)" for NWP 57 2021 reissuance. The 2021 NWP reissuance Federal Register citation is actually 86 FR 2744 (January 13, 2021). 87 FR 57298 is from 2022 — this is the wrong FR citation for the 2021 NWP reissuance. The 2026 reissuance citation is 2026-00121 (FR Jan. 8, 2026). | Correct citation to "86 FR 2744 (Jan. 13, 2021)" for 2021 NWP reissuance. Note that the 2026 reissuance (March 15, 2026) is now the current NWP 57 — update lesson note accordingly. | FederalRegister.gov 2021 NWP reissuance (86 FR 2744) | HIGH |
| F-04 | MED | Factual accuracy / citation | L04:54 (key_terms definition) and L04:364–371 (source note) | Lesson states the NLEB rule was published at "88 FR 6358, Jan. 30, 2023." Verification: 88 FR 6358 was published November 30, 2022 (the final rule publication date). USFWS later extended the effective date from January 30, 2023 to March 31, 2023 via a separate delay notice (88 FR 5528, Jan. 26, 2023). The lesson's "88 FR 6358" citation is correct for the final rule, but "Jan. 30, 2023" is the original intended effective date (before the delay) not the actual publication date. The actual effective date is March 31, 2023. | Clarify: "88 FR 6358 (published Nov. 30, 2022; effective March 31, 2023, per 88 FR 5528 delay notice)." Remove "Jan. 30, 2023" date — it is technically the originally proposed effective date, not the publication date nor the final effective date. | FWS press release; Mayer Brown / Pierce Atwood analysis; 88 FR 5528 | MED |
| F-05 | MED | Factual/pedagogy | L02:220–228 + BranchingScenario | Lesson identifies CE C-8 as the applicable NTIA categorical exclusion for aerial fiber in existing ROW, with a [confirm] marker. Research confirms NTIA did establish CEs including one for aerial/buried fiber in existing ROW. However the "C-8" designation appears to be a specific CE numbering from the NTIA's internal CE procedures (adopted 2024 — see NTIA Fed Register notice, 2024). The lesson correctly qualifies it with "[confirm current CE designation against NTIA and 7 CFR 1970.54]" — that qualifier saves this from being wrong, but the actual lesson framing states CE C-8 as the designation without strong sourcing. Moderate risk that learners carry "CE C-8" as a hard fact. | The [confirm] marker is already present (appropriate). Add a brief note that NTIA expanded to 47 CEs in 2025-2026; C-8 numbering should be verified against the current NTIA CE procedures at time of project. Not a fix — just flag for polish stage. | NTIA BroadbandUSA NEPA CE overview; FR NTIA CE notice 2024 | LOW-MED |
| F-06 | LOW | DAG pointer accuracy | L05:86 | vocabulary_assumed includes "route survey wetland flags" with source_lesson_id T04.L01. The T04 curriculum covers route survey; "wetland flags" as a specific term should be verified against T04.L01's vocabulary_introduced to ensure DAG pointer is exact. Minor risk — T04.L01 teaches site walk/route survey and likely discusses wetland flags, but the exact term "route survey wetland flags" may not be in T04.L01's vocab_introduced list. | Verify T04.L01 vocabulary_introduced contains this exact term. If not, either introduce it in T04.L01 or adjust the pointer to the correct lesson. | T04.L01 vocabulary_introduced list | MED (needs Haiku ground-truth) |
| F-07 | LOW | DAG pointer accuracy | L06:78 | vocabulary_assumed includes "KMZ / shapefile deliverables" with source_lesson_id T04.L06. Needs verification that T04.L06 introduces this exact term (not T04.L03 or T04.L05). | Haiku ground-truth check on T04.L06 vocabulary_introduced. | T04.L06 vocabulary_introduced | LOW |
| F-08 | LOW | Flashcard rendering | L11:99–102 | L11 uses a map-based Flashcard render pattern: `{meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))}` — this uses `term` and `definition` props rather than the standard `deckId` and `cards` array props used in L01–L05. This may work if Flashcard accepts both prop signatures, but it differs from the standard pattern across other T09 lessons. Risk: if Flashcard requires `deckId` + `cards` structure, L11 flashcards render silently broken. | Verify Flashcard component prop signature. If deckId/cards is required, refactor L11 to match the standard pattern used in L01–L05. | Flashcard.jsx component | MED (needs component check) |
| F-09 | LOW | Coverage gap | All | No lesson in T09 covers railroad crossing permits (AAR/AREMA standards, longitudinal vs. perpendicular crossing requirements, railroad flagman requirements). Railroad crossings are a real permitting pathway for rural fiber routes (particularly in RUS-program areas). Coverage gap relative to T09 Brief scope claim. | Add railroad crossing coverage — could be a new sub-lesson or expand L06 (DOT encroachment) to include railroad crossings as a parallel permitting track. Flag for curriculum architect. | T09 Brief §2 (L06 scope); AAR/AREMA field practice | MED (scope gap) |

---

## 3. Negative Findings — What Was Checked and Confirmed Clean

- **BEAD $42.45 billion amount (L01):** Verified correct — multiple primary sources (NTIA, National Law Review, U.S. Chamber) confirm $42.45B figure.
- **NHPA §106 cite (54 USC §306108):** Correct statutory cite across L03 and other lessons.
- **36 CFR Part 800 SHPO 30-day clock (L03):** "Clock starts on receipt of an adequate package, not submission date" is CORRECT per ACHP guidance ("SHPO has 30 days following receipt of adequate information to respond"). Lesson is accurate on this point.
- **CWA §404 cite (33 USC §1344):** Correct.
- **RHA §10 cite (33 USC §403):** Correct.
- **ESA §7 cite (16 USC §1536), ESA §9 take prohibition (16 USC §1538):** Correct.
- **NLEB tree-clearing window (April 1–October 31):** Confirmed against USFWS guidance — this avoidance window is correct for NLEB and Tricolored Bat as stated in multiple primary-source-adjacent documents. The lesson correctly adds [confirm with IPaC at time of project] qualifier.
- **NWP 57 covering telecom post-2021 (NWP 12 oil/gas only):** Verified correct — 2021 reissuance (86 FR 2744) and 2026 reissuance (FR 2026-00121) both confirm NWP 57 = telecom utility lines; NWP 12 = oil/gas.
- **NWP 57 PCN acreage threshold (0.1 acre / 1/10 acre):** Verified correct across 2021 and 2026 reissuances.
- **NWP 57 Section 10 navigable waterway = standalone PCN trigger:** Verified — search results from 2021 and 2026 confirm Section 10 waterway crossing triggers PCN regardless of acreage. L05 is correct on this point.
- **NHPA §106 three findings of effect (no historic properties / no adverse effect / adverse effect):** Correct per 36 CFR Part 800.
- **MOA / Programmatic Agreement as adverse-effect resolution mechanisms:** Correct per 36 CFR §§800.5–800.6.
- **7 CFR Part 1970 effective date 2016 (81 FR 11024):** Verified correct.
- **NEPA three tiers (CE → EA/FONSI → EIS) order:** Correct.
- **ESA §7 informal vs. formal consultation distinction:** Correct — informal leads to concurrence letter (NLA); formal leads to Biological Opinion.
- **IPaC tool URL (ipac.ecosphere.fws.gov):** Verified as the active USFWS tool URL.
- **All quiz answer indices checked (L01–L05):** All answerIndex values correspond to the correct answer in the choices array. No wrong-answer bugs found.
- **Flashcard presence (L01–L06, L09):** All key_terms have corresponding Flashcard entries. L07, L08, L10 not checked in detail.
- **vocabulary_assumed DAG pointers (L01–L05):** T09.L01→T01.L01 (ROW, OSP), T09.L01→T04.L01 (route survey terms) appear reasonable. No broken prereq pointers confirmed on these lessons.

---

## 4. Coverage Gaps — What Wasn't Reached

- **L07 (easements), L08 (municipal ROW), L10 (permit tracking), L12 (capstone quiz):** Spot-checked structure and Flashcard presence only. Full quiz-answer verification and citation checking not completed due to token budget.
- **Railroad crossing permits:** Not covered in any lesson — flagged as F-09 (scope gap).
- **FCC Form 854 / antenna structure registration:** Not verified — not covered in T09 (may be in-scope gap for wireless fiber poles; unclear if in T09 brief scope).
- **Section 6409(a) eligible facilities request:** Not found in lessons; may be out of scope for T09 (wireless-focused). No finding.
- **L11 full content depth:** Read foundations + flashcard pattern only. Working and Advanced tiers not deeply verified.

---

## 5. Cross-Topic DAG Sanity (T09 → T01..T08)

- L01 → T01.L01 (OSP, ROW): Plausible — T01 introduces foundational terms.
- L01 → T04.L01 (route alternatives, site walk): Plausible — T04 is Site Survey & Pre-Engineering.
- L01 → T04.L03 (GIS): Plausible.
- L04 → T09.L02 (CE C-8, extraordinary circumstances): Internal T09 pointer; correct.
- L04 → T04.L01 (site walk, vegetation observation): Plausible.
- L05 → T04.L01 (route survey wetland flags): UNCERTAIN — exact term "route survey wetland flags" needs Haiku ground-truth against T04.L01 vocabulary_introduced. Flagged as F-06.
- L06 → T04.L06 (KMZ/shapefile deliverables): UNCERTAIN — needs Haiku ground-truth. Flagged as F-07.
- L09 → T09.L03 (NHPA §106, SHPO, APE, etc.): Internal T09 pointer; correct.

No broken T01–T08 pointers identified with HIGH confidence. Two DAG pointers need ground-truth checks (F-06, F-07).

---

## 6. Vite Build Result

**✓ Built in 5.89s — PASS.** All 131+ modules compiled without error. No import graph failures in T09 lesson files.

---

## 7. Saturation Hint for R-2

**Recommended R-2 framing:** Technical/field-practice + independent gap research. Focus on:
1. **L02 CE process:** What happens to the NEPA CE framework under NTIA post-2026 CEQ rule removal? The NTIA established its own CE procedures (2024 Fed Register) — does the lesson correctly characterize the current state?
2. **L05 NWP 57 2026 reissuance:** The 2021 NWP 57 expired March 14, 2026; the 2026 reissuance took effect March 15, 2026. Lessons reference "2021 reissuance" throughout. Are the conditions materially the same, or did the 2026 reissuance change any thresholds that matter for fiber?
3. **L11 Flashcard prop pattern:** Verify Flashcard.jsx accepts `term` + `definition` props as used in L11 (vs. `deckId` + `cards` array pattern in L01–L05).
4. **Railroad crossings:** Confirm whether T09 Brief explicitly scoped this out or if it's an authoring gap.
5. **L07, L08, L10 quiz answer verification** — not reached in R-1.

---

=== T09 AUDIT R1 PRIMARY SOURCE END ===
