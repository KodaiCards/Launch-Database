# T08 Make-Ready & Pole Attachment — R-1 Retroactive Audit
## Framing: Primary-Source-Skeptical / High-Precision

**Auditor role:** Senior OSP engineer + utility joint-use coordinator + NESC pole-loading specialist  
**Wave:** OSP Retroactive Audit (T08 was closed under older RT-pair-only pipeline; saturation rule not yet locked)  
**Scope:** All 12 lessons — L01 through L12 — in `osp-training/src/lessons/T08/`  
**Known carry-forward (not re-flagged):** P5 — T08 L07 contingency range partial harmonization

---

## Stack Snapshot (≤80 words)

T08 is substantively sound — OTMR/multi-party framework, cost causation, FCC 15-day clock, and CPM float are all correctly taught. Math (MRE arithmetic, cost-split, float calculations) checks out across all lessons and capstone. The dominant structural defect is a schema deviation in L07–L11: `vocabulary_introduced` / `vocabulary_assumed` / `key_terms` are exported as top-level module exports rather than inside the `meta` object, which breaks DAG tracking if LessonLayout reads from `meta.*`. Two regulatory citation markers need tightening.

---

## Structured Findings

| ID | Severity | Category | Lesson:Line | Issue | Fix Shape | Source | Confidence |
|----|----------|----------|-------------|-------|-----------|--------|------------|
| F1 | HIGH | Schema/DAG | L07–L11 (all five) | `vocabulary_introduced` exported as top-level `const` object (dict), `key_terms` derived via `Object.entries()` mapping, `vocabulary_assumed` as separate top-level export — NONE of these are inside the `meta` object. Standard schema (L01–L06, T02, T03, T05) places all three inside `meta`. If LessonLayout or DAG tooling reads `meta.vocabulary_introduced` / `meta.vocabulary_assumed` / `meta.key_terms`, these five lessons are invisible to the DAG and progress tracking. | Move all three fields inside the `meta` export on L07–L11, matching the L01–L06 pattern: `meta = { ..., vocabulary_introduced: [...], key_terms: [...], vocabulary_assumed: [...] }`. Derived top-level exports may stay for backward compat but `meta` must be the source of truth. | Verified by reading L07 top-level exports vs L01 meta object; cross-checked against T02.L01 and T05.L01 schema pattern | HIGH |
| F2 | MED | Citation format | L01:line ~95, L05:line ~88, L10:line ~95 | "NESC §23" used as shorthand for power conductor clearance rules. The NESC C2-2023 is structured by Parts and Rules (e.g., Rule 230, Rule 232, Rule 235), not § sections. "§23" appears to intend the Rule 23x series (Part 2, Section 23). This is imprecise and inconsistent with how NESC is cited elsewhere in T08 (e.g., "NESC C2-2023 §232" correctly used in L04, L06). | Replace "NESC §23" with "NESC Rule 230-series" or the specific rule (e.g., Rule 232 for vertical clearance, Rule 235 for clearance between conductors) as context warrants. | NESC C2-2023 organization: Parts with numbered Rules, not § sections. Rule 232 = Vertical clearance; Rule 235 = Clearance between conductors on same structure. | HIGH |
| F3 | MED | Citation/verify | L02:multiple, L03, L04, L06 | "47 CFR §1.1413 [confirm section]" cited as the cost-recovery rule for self-help make-ready expenses. The [confirm] marker is correctly applied. Primary-source check: FCC One-Touch Make-Ready order (FCC 18-111) implements make-ready under 47 CFR §1.1411 as the main pole attachment rule; cost-recovery provisions may reside in §1.1411(i) or a sub-provision, not a separate §1.1413. The section citation needs independent CFR verification before the [confirm] marker can be removed. | Run a primary-source lookup in the current CFR Title 47 Part 1 Subpart J to identify the exact subsection for self-help cost recovery; update citation or leave [confirm] until verified. | 47 CFR Part 1 Subpart J (Pole Attachments); FCC 18-111 Order (One-Touch Make-Ready) | MED |
| F4 | MED | Citation/missing marker | L03:line ~135 | "47 CFR §1.1414" cited as the dispute resolution procedure (informal negotiation → FCC complaint) WITHOUT a [confirm section] marker. Every other unverified CFR sub-citation in T08 (§1.1413 in L02/L04) carries a [confirm section] marker. This inconsistency means L03's §1.1414 citation appears verified when it may not be. Primary-source: FCC 18-111 dispute/complaint procedures are in the Part 1 Subpart J framework; §1.1414 may or may not be the correct sub-citation. | Add [confirm section] marker to §1.1414 in L03, consistent with how §1.1413 is flagged throughout T08. | Consistency audit across T08 CFR citations; FCC 18-111 order text | HIGH |
| F5 | LOW | Clearance value | L04:line ~110 | "15 ft 6 in" (15.5 ft) stated as NESC minimum vertical clearance for communications conductors crossing roads in Light loading district. NESC §232 Table 1 values depend on voltage class, facility type, and road classification. Communications-space wires (low voltage) have different clearance requirements than supply conductors. The value is plausible but the lesson does not specify road classification (urban vs. rural, limited access vs. other). | Add "(for [road class] — verify NESC §232 Table 1 for specific road classification)" qualifier, or cite the table row explicitly. The clearance value may be correct for one road class but not universal. | NESC C2-2023 §232 Table 1 (vertical clearance by voltage class and road type) | MED |
| F6 | LOW | Content precision | L08:line ~70 | Annual pole rental range "$10 to $30 per pole per year" with [confirm year] marker. The FCC OTMR Order (FCC 18-111) cites historical telecom pole attachment rates averaging ~$5–$12/pole/year; the $10–$30 range skews toward the high end and may reflect electric utility attachment rates or more recent proceedings. The [confirm year] marker is appropriate but the range deserves a note that it applies specifically to ILEC/cable/fiber attacher context, not one-size-fits-all. | Tighten range with a context note ("$10–$30 for electric-space attachments; telecom-space attachments may be lower — confirm with FCC current rate benchmarks") and retain [confirm year]. | FCC Pole Attachment Rate proceeding; FCC 18-111; 47 U.S.C. §224(d) rate formula | LOW |

---

## Negative Findings (Confirmed Clean)

**Regulatory framework:** 47 U.S.C. §224 (Pole Attachment Act) and §224(c) (state-certified programs) correctly cited throughout. "Roughly 22 states have certified programs" is approximately accurate (actual count fluctuates 18–24 states). FCC Order 18-111 number consistently correct. OTMR vs. multi-party distinction correctly and consistently taught across L01–L05.

**Math — all verified independently:**
- L06 cost-split: 80% existing + 12% fiber = 92% total; 80/92 = 86.96%, 12/92 = 13.04% ✓
- L07 MRE Q1: $1,200 + $2,340 + $890 = $4,430; × 1.15 = $5,094.50; answerIndex 2 ✓
- L08 Q1: 240 × $19 = $4,560; answerIndex 1 ✓
- L11 float Q2: back-end = 3+1+1 = 5 weeks; Week 18−5 = Week 13; expected Week 12; float = 1 week ✓
- L12 capstone MRE: $1,200 + $4,200 + $2,000 = $7,400; ×0.15 = $1,110; total $8,510 (stated $8,500 with rounding) ✓
- L12 Cap Q06 cost-split: 88/102 = 86.3%, 14/102 = 13.7%; "approximately 86/14" ✓
- L12 Cap Q09: 1 × $120 × 20 = $2,400 ✓
- L12 Cap Q15 float: back-end = 2+1+1 = 4 weeks; Week 14−4 = Week 10; expected Week 9; float = 1 week ✓

**FCC 15-day clock (L02):** Correctly describes OTMR 15-business-day notice, 3-business-day advance self-help notice, tolling provisions (AHJ permit delay, unsafe weather, incomplete application, safety hold). All consistent with FCC 18-111.

**Transfer mechanics (L04):** Steps (survey → bracket install → relocation → verify clearance → remove old bracket → sign-off) correctly sequenced. Multi-span cascade analysis (Poles 11-12-13) correctly traces cost causation to fiber applicant as root cause.

**NESC structural citations (L06):** §24 for structural requirements, §25 for loading districts, correctly used. "Macon, GA = Light loading district" consistent with project context.

**Cost causation principle:** Consistently and correctly applied across L03, L04, L06. Three-category FCC table (simple, complex-telecom, complex-power) in L03 correctly structured.

**Flashcard mandate:** L01–L11 all contain `<Flashcard deckId="T08-LXX" cards={[...]}/>` with substantive content. L12 capstone correctly omits Flashcard (appropriate for quiz-only lesson).

**CPM/PM content (L11):** Float calculation methodology correct. Four contingency levers correctly sequenced by escalating relationship cost. Critical path dependency chain accurately described.

**DAG cross-topic pointers (L01–L06, L12):** T05.L01-L05, T07.L01, T07.L02, T07.L06, T18.L01 referenced as vocabulary_assumed sources — consistent with T05 and T07 content per prior audits. L01→L11 internal chain intact.

**RUS 1751F-630 §8:** Cited in L01 and L10 for coordination and PE certification requirements — citation format consistent with RUS bulletin references elsewhere in curriculum.

---

## Coverage Gaps

**No material content gaps identified.** T08 covers the full make-ready lifecycle from application through as-built documentation. The 12-lesson structure (OTMR framework → 15-day clock → simple/complex → transfer → reframe → pole replacement → MRE reading → fees → application path → as-built → PM problem → capstone) is logically sequenced with no prerequisite violations observed.

**Minor gap:** L08 does not address the FCC's "just and reasonable" rate complaint mechanism (47 U.S.C. §224(b)(1)) — a mechanism an OSP engineer might invoke if the pole owner's annual rental rate is challenged. This is adjacent to the lesson content and would add completeness, but is not a factual error.

---

## Cross-Topic DAG Sanity

**T08 → T05 pointers:** vocabulary_assumed in L01 (T05.L01 "pole loading"), L04 (T05.L04 "clearance"), L06 (T05.L02 "loading districts"), L09 (T05.L05 "clearance calculation") — all appear traceable to T05 authored content per prior T05 audit.

**T08 → T07 pointers:** vocabulary_assumed in L01 (T07.L01 "attachment point"), L04 (T07.L02 "transfer"), L11 (T07.L06 "make-ready float") — T07 was audited and closed; these appear consistent.

**T08 → T18 pointers:** vocabulary_assumed in L01 (T18.L01 "OSHA/safety") — T18 was closed with HIGH safety fixes; these pointers appear sound.

**Schema deviation impact on DAG (F1):** If the DAG tooling reads `meta.vocabulary_introduced`, lessons L07–L11 introduce terms (make-ready estimate, attachment fee, NECA, NARUC, critical path, float) that downstream lessons may assume — but since these aren't in `meta`, they won't be registered in the DAG. This is the primary DAG integrity risk in T08.

---

## Flashcard Prop Pattern Check

**L01–L06:** Standard `<Flashcard deckId="T08-L0X" cards={[{front:"...",back:"..."},...]}/>` — correct.  
**L07–L11:** Flashcard props reference the separately-exported `key_terms` array derived from `vocabulary_introduced`. The Flashcard components render correctly IF `key_terms` is passed properly, but the disconnect between top-level exports and `meta` means the schema contract is violated even if the UI renders.  
**L12:** No Flashcard — correct for capstone.

---

## Vite Build Result

(To be populated at commit time — build command: `cd osp-training && npm run build`)

---

## Saturation Hint for R-2

R-2 framing should focus on:
1. **Field-practice accuracy:** Does the OTMR self-help remedy work as described in practice? Are the tolling provisions complete (FCC 18-111 lists specific tolling events — verify all are covered)?
2. **Regulatory completeness:** Does L08 adequately cover the FCC rate formula (capitalized cost methodology) vs. the lesson's simplified "per-pole annual rental" framing?
3. **Schema deviation downstream effects:** Verify whether LessonLayout actually reads from `meta.vocabulary_introduced` or from a top-level export — this determines whether F1 is a real DAG break or only a style violation.
4. **47 CFR citation verification:** Use a web search against the current CFR to verify §1.1413 and §1.1414 against the actual Part 1 Subpart J text.

---

`=== T08 AUDIT R1 PRIMARY SOURCE END ===`
