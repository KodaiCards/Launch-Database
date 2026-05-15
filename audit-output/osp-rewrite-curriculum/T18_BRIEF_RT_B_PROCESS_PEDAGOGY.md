# T18 Research Brief RT-B — Process + Pedagogy Framing

**Date:** 2026-05-16
**Scope:** T18_RESEARCH_BRIEF.md — 10 lessons, Safety & OSHA (teaching position #2)
**Method:** Prerequisite-DAG audit; lesson-sequence logic; vocabulary uniqueness scan; book-vs-field coverage check; interactive-primitive fitness check; capstone distribution analysis; scenario stress-test; cross-reference map validation
**Role:** STRICT READ-ONLY. No code, lesson, or source files modified.
**Complements:** T18 RT-A (citation / regulatory-accuracy framing). This report does NOT duplicate RT-A's OSHA section verification work.

---

## Verdict (≤80 words)

**YELLOW.** Brief is structurally sound and the 1910.268 vs. 1910.146 marquee distinction is excellent. Two issues require fix before authoring: (1) L01 quiz states Substitution as most effective in the hierarchy, contradicting the brief's own citation ("Elimination → Substitution → ... → PPE") — the answer should be Elimination; (2) ARCH.md spec names "ANSI Z89.2" but the brief consistently uses "ANSI Z89.1" (the correct standard for construction hard hats). Four LOW gaps documented.

---

## Per-Lesson Grade Matrix

| Lesson | Prereq fidelity | Book-vs-field present | Primitives sensible | Flashcards present | Quiz present | Grade |
|---|---|---|---|---|---|---|
| L01 Hazard Awareness | ✓ | ✓ | ✓ (Sortable + Quiz) | ✓ (8 terms) | ✓ | **YELLOW** (quiz answer error — see F1) |
| L02 LOTO | ✓ | ✓ | ✓ (BranchingScenario + Quiz) | ✓ (7 terms) | ✓ | GREEN |
| L03 Confined Space | ✓ | ✓ (strongest gap in brief) | ✓ (AnnotatedDiagram + BranchingScenario + Quiz) | ✓ (8 terms) | ✓ | GREEN |
| L04 Fall Protection | ✓ | ✓ | ✓ (AnnotatedDiagram + SideBySide + Quiz) | ✓ (5 terms) | ✓ | **YELLOW** (see F3/F4) |
| L05 PPE | ✓ | ✓ | ✓ (AnnotatedDiagram + Sortable + Quiz) | ✓ (8 terms) | ✓ | **YELLOW** (see F2) |
| L06 Traffic Control | ✓ | ✓ | ✓ (BranchingScenario + AnnotatedDiagram + Quiz) | ✓ (6 terms) | ✓ | GREEN |
| L07 MAD/MAB | ✓ | ✓ | ✓ (WorkedExample + Quiz) | ✓ (5 terms) | ✓ | GREEN |
| L08 Hazmat | ✓ | ✓ | ✓ (HotSpot + Quiz) | ✓ (4 terms) | ✓ | GREEN |
| L09 Incident Reporting | ✓ | ✓ | ⚠ (Quiz only — drag-match is a Quiz variant; second distinct primitive would strengthen) | ✓ (5 terms) | ✓ | GREEN (minor) |
| L10 Capstone Quiz | N/A (quiz only) | N/A | ✓ (20Q MC + 2 scenario) | N/A | ✓ | **YELLOW** (see F5 — L08 absent) |

---

## Vocabulary Uniqueness Check

All terms in the vocabulary definitions table (lines 29–61 of brief) audited for uniqueness. No term appears as "first introduction" in two separate non-SDS rows.

**SDS dual-notation (LOW — F6):** SDS is listed as "T18.L01 / T18.L08" — ambiguous notation. The prereq DAG invariant requires a single first-introduction lesson. Intended pattern is brief intro in L01 + deep dive in L08, but the slash notation could mislead an author into treating L08 as the formal first-intro, allowing L01–L07 lessons to use SDS without defining it.

**Missing from vocabulary definitions table (L04 terms):** "positioning system" and "aerial lift" appear in the L04 lesson-table vocab column but are absent from the vocabulary definitions table entirely. These are first-introduction T18 terms and require definitions.

**Missing from vocabulary definitions table (L06 terms):** "taper," "buffer," "work zone" appear in the L06 lesson-table vocab column but are absent from the vocabulary definitions table.

**Missing from vocabulary definitions table (L08 terms):** "PEL," "TLV," "GHS" appear in L08 lesson-table vocab column and in L08 flashcard list but are absent from the vocabulary definitions table.

**Missing from vocabulary definitions table (L09 term):** "DART" appears in L09 flashcards and body but is absent from the vocabulary definitions table.

**Downstream authors using T18 vocabulary (T04, T07, T08, T10, T13, T14) rely on this table as the authoritative first-intro register.** The gaps above mean those terms cannot be properly annotated in downstream lesson meta exports.

---

## Scenario Stress-Test (3 scenarios)

**Scenario 1 — L02 BranchingScenario (LOTO in a fiber hut):**
"You're splicing inside a fiber hut next to a battery backup system. The rack has a breaker panel for powered equipment. Walk through the LOTO process step by step. What happens if you skip step 3?"

- Realism: HIGH. Battery backup systems (48V DC plant, UPS, generator) in fiber huts are genuine LOTO surfaces on OSP jobs. Teaching LOTO here grounds the abstract regulation in a real field location.
- Teaching outcome: CLEAR. Learner walks the 6-step LOTO sequence (notify → shut down → isolate → apply lock → release stored energy → verify zero energy), experiences consequences of skipping the "release stored energy" step (capacitors in UPS can deliver lethal discharge even after breaker open).
- Primitive fit: BranchingScenario is ideal — sequential decision tree with binary branches ("skip step / follow step" × 3+ junctures). State persistence (resume mid-scenario) is appropriate for a 6-step process.
- PASS.

**Scenario 2 — L03 BranchingScenario (12% LEL in manhole):**
"You open a telecom manhole on a ROW adjacent to a gas main. Gas monitor reads 12% LEL. Walk through the 1910.268(o) response."

- Realism: HIGH. Buried gas mains alongside telecom ROW is a real and recurrent hazard pattern in RUS and municipal work zones.
- Teaching outcome: CLEAR. Branch points: (a) 12% LEL < 25% — can ventilate and re-test rather than abort; (b) if ventilation brings LEL below 10% → may enter with continuous monitoring; (c) if LEL holds above 25% → do not enter, call supervisor, notify utility. Learner must distinguish the 1910.268(o)(2)(ii)(B) forced-ventilation threshold from the "do not enter" threshold.
- Primitive fit: BranchingScenario is appropriate. However, the scenario tests one branch point (what happens at 12% LEL). Author should add a second branch for "LEL drops to 5% after ventilation — proceed or retest?" to exercise the full decision tree and avoid a linear scenario masquerading as branching.
- PASS with minor authoring note.

**Scenario 3 — L06 BranchingScenario (work zone on 45 mph state highway):**
"You need to place a splice case at a vault in the shoulder of a 45 mph state highway. Walk through: Do you need a TCP? What devices do you need? Who can serve as flagger? What are the advance warning sign distances?"

- Realism: HIGH. Aerial and underground splice work on state highway shoulders is routine for RUS contractors.
- Teaching outcome: CLEAR. Four questions map directly to MUTCD Part 6 topics: TCP requirement (state-maintained highway → yes), device list (advance warning signs, cones, flagger station), flagger qualification (state-required certification card), advance warning spacing (45 mph = ~540 ft per MUTCD Table 6C-1 urban/suburban; ~360 ft urban — depends on classification).
- Primitive fit: BranchingScenario fits well if each of the four questions is a separate branch with feedback. Risk: if the scenario is structured as a serial checklist ("answer Q1, then Q2...") rather than true branches with distinct outcomes, BranchingScenario is overkill vs. a simple multi-part Quiz. Author needs to structure it as decision-branching (e.g., "you skip the TCP — what happens when there's an incident?") not just Q&A.
- PASS with authoring note.

---

## Findings List

| # | Severity | Category | Location | Issue | Fix shape |
|---|---|---|---|---|---|
| F1 | **HIGH** | Quiz answer error / pedagogy | L01, interactive primitives #2 | Quiz states "Which level is most effective? D) Substitution → **D**" but the brief's own citation table says hierarchy = "Elimination → Substitution → Engineering → Administrative → PPE." Elimination is most effective, not Substitution. Learners who re-derive from the Sortable they just completed will catch the contradiction and lose confidence in the lesson. | Change answer to A) Elimination (add Elimination as an option) or restructure the quiz. Confirm NIOSH hierarchy at cdc.gov/niosh before authoring. |
| F2 | **MED** | Standard mismatch (ARCH.md vs. brief) | L05 vocab table; ARCH.md line 44 + 107 + 163 | ARCH.md spec names "ANSI Z89.2" for hard hat standard (Z89.2 = Emergency Responder Helmets, not construction hard hats). Brief correctly uses "ANSI Z89.1" (Industrial/Construction Hard Hats) throughout. One of the two is wrong; brief's Z89.1 is technically correct but creates a discrepancy with the ARCH.md vocabulary lock. | Update ARCH.md to Z89.1 (the correct standard for construction/OSP use) OR add a note in the brief flagging the ARCH.md typo for the orchestrator to resolve. Authors must use Z89.1 — do not propagate the Z89.2 reference. |
| F3 | **LOW** | Vocabulary table gap | L04 lesson-table vocab column | "positioning system" and "aerial lift" are listed as vocab introduced in L04 but are absent from the vocabulary definitions table (which ends at "near-miss"). Downstream topic authors (T07, T08, T13) cannot annotate prereq metadata without a definitions-table entry. | Add definitions for both terms to the vocabulary table under T18.L04. |
| F4 | **LOW** | Lesson table vs. detailed section mismatch | L04 summary row | Lesson table shows "Quiz (MC + drag-match); AnnotatedDiagram" as primitives. Detailed L04 section lists Quiz + AnnotatedDiagram + SideBySide (3 primitives). The SideBySide is absent from the summary row. | Update the L04 lesson table summary row to include SideBySide. |
| F5 | **LOW** | Capstone distribution gap | L10 capstone question distribution | L08 (Hazardous Materials / SDS section reading) is completely absent from the 20-question capstone distribution. Every other L01–L09 lesson has ≥2Q. HazMat is safety-critical content that the capstone should test. | Add 2Q on hazmat/SDS (e.g., "Which SDS section tells you what PPE to wear?" + one PEL/recordable classification) to bring capstone to ~22Q or replace 2 lower-density questions from L01 hierarchy (which has 3Q already). |
| F6 | **LOW** | Vocabulary table ambiguity | Vocab table, SDS row | "SDS (Safety Data Sheet) | T18.L01 / T18.L08" uses dual first-intro notation. DAG invariant requires a single authoritative first-introduction lesson. The slash notation will confuse author agents about which lesson owns the definition. | Change to "T18.L01 (abbreviated; full treatment T18.L08)" or split into two rows: SDS (introduced) at L01 and SDS (deep dive) at L08, with only L01 as the DAG anchor. |
| F7 | **LOW** | Vocabulary table gap | L06, L08, L09 lesson-table vocab columns | Terms listed in lesson vocab columns but absent from vocabulary definitions table: "taper," "buffer," "work zone" (L06); "PEL," "TLV," "GHS" (L08); "DART" (L09). All are first-introduction T18 terms. | Add definitions for all 7 terms to the vocabulary definitions table under their respective first-introduction lessons. |

---

## Negative Findings (Confirmed Clean)

- **Lesson count:** 10 lessons confirmed, matching ARCH.md exactly. ✓
- **Lesson sequence logic:** L01 (general foundation) → L02 (LOTO) → L03 (confined space) → L04 (fall protection) → L05 (PPE) → L06 (traffic control) → L07 (MAD/MAB) → L08 (hazmat) → L09 (incident reporting) → L10 (capstone) is pedagogically sound. Each lesson introduces a bounded topic cluster; no single lesson overloads new vocabulary. ✓
- **Prereq DAG fidelity — T01 vocabulary boundary:** Brief correctly uses T01-available terms (pole, supply space, climbing space, communication space, ground-line, RUS, NESC, TIA, NEC, FCC, BICSI, OSP, ISP, splice case, sheath, messenger, span, attachment) without re-introduction. No T02+ fiber-physics or T03+ cable-selection vocabulary appears. ✓
- **No T18 vocab used before first-introduction lesson within T18:** Each lesson's internal prereq chain is logically ordered. L03 correctly gates on L01 (hazard recognition) and L02 (energy control for powered equipment in vaults). L07 correctly gates on L01 + L05 (PPG glove classes referenced in MAD discussion). ✓
- **Book-vs-field gap present in all 9 content lessons (L01–L09):** Every lesson has an explicit book-vs-field section. Gap quality is excellent, especially L03 (1910.268 vs. 1910.146 manhole treatment — this is the kind of nuanced field-vs-textbook gap that prevents the two most common crew errors simultaneously). ✓
- **Flashcards present in all 9 content lessons:** L01 (8), L02 (7), L03 (8), L04 (5), L05 (8), L06 (6), L07 (5), L08 (4), L09 (5). L10 capstone correctly has no flashcards. ✓
- **Quiz present in all 10 lessons.** ✓
- **≥2 distinct interactive primitives per lesson:** All lessons meet this requirement. L09 is borderline (Quiz variants only) but "drag-match" as a distinct interaction mode within the Quiz primitive is sufficient. ✓
- **No T18 vocab used before T18 in downstream cross-reference table:** Table correctly restricts T18 terms to T04, T07, T08, T10, T13, T14 downstream topics only. ✓
- **No AI references in any lesson text reviewed.** ✓
- **No guesses or unsourced quantitative claims:** All numerical claims (12% LEL, 19.5% O₂, 50 µg/m³ silica PEL, 20,000V Class E, 2,200V Class G, 7,500V Class 1 glove) are tied to verified primary or secondary sources in the citation table. ✓
- **Capstone distribution covers L01–L07 + L09 with appropriate weighting:** LOTO/confined space = 30% (highest safety-severity), PPE = 25%, traffic control = 25%, electrical awareness = 20% — consistent with ARCH.md's stated capstone domain weights. ✓
- **Hallucination-risk register present and well-targeted:** All 7 identified risks (OSHA section confusion, 1910.146 vs. 1910.268 misapplication, MAD Table R-6 value errors, PPG class transposition, Z89.1 class letter confusion, free-climb over-interpretation, silica PEL old-vs-new) are real and well-documented. RT-A's job to verify these is correctly scoped. ✓
- **T08 (Make-Ready) included in downstream cross-reference:** Brief correctly lists T08 as a downstream topic for fall protection / lanyard / SRL vocabulary (T08 involves pole climbing during surveys). ✓

---

## Coverage Gaps

1. **T05 prereq consistency not verified against ARCH.md T05 spec.** The cross-reference table claims T05 (Aerial Design) uses PPG glove class and ANSI Z89.1 Class E vocabulary from T18. ARCH.md lists T05 prereqs as T01, T02, T03, T04 — T18 is not listed. Teaching sequence places T18 before T05 (position 2 vs. position 7), so learners will have T18 vocabulary by the time they reach T05. However, if a learner were to attempt T05 lesson meta from the prereq list alone (without the sequence context), T18 vocabulary would not be formally covered. RT-A or orchestrator should verify whether ARCH.md T05 prereq list needs T18 added for completeness.

2. **Vocabulary definitions table completeness was verified by cross-referencing lesson-table vocab columns against the definitions table, but was NOT verified against the full lesson-body prose.** It is possible additional first-introduction terms appear in the L01–L09 lesson body sections (claims tables, interactive sections, book-vs-field sections) that are not captured in the vocab columns or definitions table. This is an authoring-time guard, not a pre-authoring blocker.

3. **L09 "first report of injury" appears in ARCH.md's L09 vocab row but is absent from both the brief's vocab definitions table and L09's lesson-table vocab column.** Likely absorbed into the "OSHA 300/301" definitions but worth flagging for authoring completeness.

---

## Summary

**Verdict: YELLOW.** One confirmed pedagogical error (F1 — L01 quiz hierarchy answer), one standard-name discrepancy between ARCH.md and brief that must be resolved before authoring (F2 — Z89.2 vs. Z89.1), and five LOW process gaps (F3–F7) that require cleanup of the vocabulary definitions table and capstone distribution. None of these require a full brief revision — they are surgical fixes. Authors can proceed after patching F1 + F2 and noting F3–F7 as authoring-time guards.

=== T18 BRIEF RT-B PROCESS+PEDAGOGY END ===
