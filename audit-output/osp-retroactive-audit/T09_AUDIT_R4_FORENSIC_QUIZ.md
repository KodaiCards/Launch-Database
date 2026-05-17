# T09 AUDIT R4 — FORENSIC INCIDENT + PEDAGOGY + QUIZ/FLASHCARD DEPTH + POST-2026 COMPLETENESS
**Constraint acknowledgement: READ-ONLY audit. Write-path allowlist: THIS FILE ONLY. No lesson edits, no canonicals, no CLAUDE.md edits, no fix applications, no follow-up round dispatch, no orchestrator impersonation. Report only.**

**Framing:** Forensic incident investigator + field crew member learner + quiz-accuracy verifier + post-2026 regulatory-currency sweep

---

## 1. Stack Snapshot (≤80 words)

Full read of L03, L04, L06, L09, L11, L12. Forensic-scenario sweep across all 12 lessons. Confirmed: L07/L08/L09/L10/L11 ALL use broken `term`/`definition` Flashcard props (5 lessons total — extends R-2/R-3's count of 4). Identified one new HIGH (quiz answer with stale citation that teaches wrong FR number as fact without qualifier). New LOW: L09 "2022 update" Presidential Memorandum imprecise. R-1/R-2/R-3 HIGH findings confirmed correct. Vite build PASSES (6.22s).

---

## 2. Forensic Scenario Coverage Table

| # | Scenario | T09 Coverage | Location | Verdict |
|---|----------|-------------|----------|---------|
| 1 | NWP threshold exceeded → individual permit required | **Present-Adequate** | L05 (extensive: 0.1 acre threshold, IP definition, timeline 6–12 months) | ✓ |
| 2 | Indian Reservation — tribal §106 + BIA easement process | **Present-Adequate** | L09 (THPO framework, BIA identification process) | ✓ |
| 3 | Migratory Bird Treaty Act (MBTA) incidental take | **Absent** | Not covered in any T09 lesson | NEW FINDING — see R4-N01 |
| 4 | Section 408 USACE alteration permit (federal levee/flood control) | **Absent** | No mention across all 12 lessons | NEW FINDING — see R4-N02 |
| 5 | State EPA wetlands post-Sackett (CA/OR/WA/VT) | **Present-Inadequate** | L05 covers Sackett + post-Sackett proposed rule; state programs mentioned generally but no state-specific guidance | LOW gap (curriculum scope) |
| 6 | Section 6409(a) eligible facilities request 60-day shot clock | **Absent** | R-3 flagged as R3-N05; confirmed absent | CONFIRMED R3-N05 |
| 7 | Federal land — BLM/USFS/NPS different easement processes | **Absent** | T09 covers all private, state, and municipal ROW. Federal land easements (BLM right-of-way grant, USFS special use permit, NPS special use permit) not covered anywhere | NEW FINDING — see R4-N03 |
| 8 | DOT railroad crossing — FRA Class I vs. short-line | **Absent** | No railroad crossing permits, no FRA, no state railroad commission mention | NEW FINDING — see R4-N04 |
| 9 | PSE&G easement abandonment vs. new utility easement | **Absent** | Easement abandonment not covered in L07; lesson covers acquisition but not release/abandonment | LOW gap — niche scenario |
| 10 | FCC ASR registration for high-mountain microwave repeater | **Absent** | No FAA 7460-1, no FCC Form 854, no antenna structure registration | OUT OF SCOPE for fiber OSP course; microwave repeater is not OSP fiber |
| 11 | Environmental Justice EO 14096 (DAC engagement) | **Present-Inadequate** | L11 lists EJ as extraordinary circumstance (correct), but EO 14096 revocation status not addressed | LOW — EO 14096 was revoked January 2025; [verify current EJ framework] marker appropriate |
| 12 | State preemption of municipal franchise fees per state PUC | **Present-Adequate** | L08 covers 47 USC §253 preemption + BDAC context + state ROW access statutes; R-3 escalated to R3-N04 (active FCC proceeding) | R3-N04 confirmed adequate |

---

## 3. Pedagogy / Field-Crew-Learner Check

Read L03, L04, L06, L09 from field-crew-member perspective (no legal training, knows field operations).

**Positive findings (not flagged as findings — documented for completeness):**
- L03 acronym table (NHPA, SHPO, APE, ACHP, MOA) is excellent; every term defined before use
- L04 IPaC workflow is step-by-step and actionable; a field scheduler can run this
- L06 "Book vs. Field" callouts are the highest-quality pedagogy in T09
- L09 "Book vs. Field: Timeline Reality" explicitly warns against invoking expired tribal clock — exactly the lesson an OSP engineer needs

**Issues found:**
- **L09 no acronym table:** L01-L06 each have an explicit "Acronyms in this lesson" table. L09 (and L07, L08, L10, L11) omit this. New acronyms introduced in L09: THPO, NHO, NHO, BIA, NATHPO, ACHP Tribal Handbook — none defined in a table. Learner with no legal background must hunt through prose for first-occurrence definitions. LOW finding — see R4-N05.
- **L09 "2022 update" to Presidential Memorandum:** L09 references "Presidential Memorandum on Tribal Consultation, November 2009, and the 2022 update." The 2022 update is imprecise — the Biden Administration issued a *January 26, 2021* tribal consultation memorandum (EO 13175 reinforcement), not a 2022 document. LOW finding — see R4-N06.
- **L11 opening paragraph:** "7 CFR Part 1970 — now [Reserved]" is the R-1/R-2/R-3 HIGH finding. From a field learner's perspective, learning a regulation that's been removed is actively harmful — a learner who memorizes "7 CFR 1970.14" will fail on a real project. Severity already captured in R3-N01 (HIGH).

---

## 4. Quiz/Flashcard Depth Audit

### Flashcard Pattern Sweep — ALL T09 Lessons

| Lesson | Flashcard Pattern | Issue |
|--------|------------------|-------|
| L01 | `<Flashcard deckId="T09-L01" cards={[...]} />` | ✓ CORRECT |
| L02 | `<Flashcard deckId="T09-L02" cards={[...]} />` | ✓ CORRECT |
| L03 | `<Flashcard deckId="T09-L03" cards={[...]} />` | ✓ CORRECT |
| L04 | `<Flashcard deckId="T09-L04" cards={[...]} />` | ✓ CORRECT |
| L05 | `<Flashcard deckId="T09-L05" cards={[...]} />` | ✓ CORRECT |
| L06 | `<Flashcard deckId="T09-L06" cards={[...]} />` | ✓ CORRECT |
| L07 | `meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))` | ✗ BROKEN — L07:138-139 |
| L08 | `meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))` | ✗ BROKEN — L08:135-136 |
| L09 | `meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))` | ✗ BROKEN — L09:120-121 |
| L10 | `meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))` | ✗ BROKEN — L10:122-123 |
| L11 | `meta.key_terms.map(({ term, definition }) => (<Flashcard key={term} term={term} definition={definition} />))` | ✗ BROKEN — L11:100-101 |
| L12 | No flashcards (capstone quiz — correct by design) | ✓ CORRECT |

**NEW FINDING:** R-2/R-3 reported 4 broken lessons (L07, L08, L09, L11). **R-4 confirms L10 ALSO uses the broken pattern** — making 5 broken lessons total (L07, L08, L09, L10, L11). R-3-N09 documented L09; but R-2/R-3 did not explicitly list L10. This is a net-new extent finding.

**Flashcard component signature confirmed:** `function Flashcard({ deckId, cards })` — does NOT accept `term` or `definition` props. The broken `map` pattern silently produces no card output at runtime (props are ignored).

### Quiz Answer Verification — L03, L04, L06, L09, L11, L12

**L03 Quiz:**
- Q1 (When does 30-day clock start?): Answer B = "Not yet — clock starts on adequate package" ✓ CORRECT per 36 CFR §800.4(b)(2)
- Q2 (Adverse-effect resolution options): Answer C = MOA/PA/project modification ✓ CORRECT
- Q3 (APE for aerial fiber): Answer B = 0.5–1 mile buffer ✓ CORRECT per 36 CFR §800.16(d)
- Q4 (Consulting parties): Answer C = broad definition including SHPO/THPOs/local govts ✓ CORRECT

**L04 Quiz:**
- Q1 (NLEB tree clearing April 15): Answer B = delay to November ✓ CORRECT concept
  - **BUT citation in explanation**: "88 FR 6358, Jan. 30, 2023" — R-2/R-3 confirmed this is WRONG FR volume. Correct citation is 87 FR 73488 (Nov. 30, 2022). L04 teaches the wrong FR cite as fact in the quiz explanation text (L04:437). The lesson body also cites it at L04:54 and L04:368. R-2 flagged this as HIGH (R2-N03); R-3 confirmed. **This is an existing R2/R3 HIGH finding, NOT a new R-4 finding — already in canonical.**
- Q2 (IPaC standard avoidance measures): Answer B = informal consultation + NLA letter ✓ CORRECT
- Q3 (2022 vs 2023 listing re-verify): Answer B = reverify current status ✓ CORRECT
- Q4 (IPaC is the tool): Answer B = ipac.ecosphere.fws.gov ✓ CORRECT

**L06 Quiz:**
- Q1 (PE stamp required, designer not PE): Answer B = engage licensed PE ✓ CORRECT
- Q2 (36 inch bore vs 42 inch minimum): Answer B = stop and get variance ✓ CORRECT
- Q3 (Most complete DOT packet): Answer B = application + PE-stamped drawings + TCP + surety bond + insurance ✓ CORRECT
- Q4 (Purpose of as-built): Answer B = actual location + depth ✓ CORRECT

**L09 Quiz:**
- Q1 (THPO replaces SHPO on tribal land): Answer B = THPO is primary ✓ CORRECT per 54 USC §302702/§302706
- Q2 (Why tribal consultation takes longer): Answer B = sovereign nations + protocols ✓ CORRECT
- Q3 (Alabama tribe in Georgia APE): Answer C = additional consulting party ✓ CORRECT
- Q4 (NHO on continental US): Answer C = applies when documented Native Hawaiian sites present ✓ CORRECT

**L11 Quiz:**
- Q1 (NLEB + tree clearing + CE): Answer B = extraordinary circumstance triggered ✓ CORRECT concept
  - **Issue:** Explanation cites "7 CFR 1970.14" as the extraordinary circumstances list. That regulation was removed April 2026. This is the R-2/R-3 HIGH finding (R2-N01, R3-N01). Already in canonical.
- Q2 (EIM vs full EA): Answer B = EIM is intermediate tier ✓ CORRECT
- Q3 (Dual-funded project needs two determinations): Answer B = coordinate for joint review ✓ CORRECT
- Q4 (Form 307 is post-construction closeout): Answer B = after construction ✓ CORRECT

**L12 Capstone Quiz:**
- Q05 (October 15 tree clearing for NLEB): answerIndex=1, explanation says "October 15 falls within the April–October avoidance window" ✓ CORRECT
- Q06 (NWP 57 "2021 reissuance"): The explanation cites "2021 USACE reissuance" without noting that the 2026 reissuance (effective March 15, 2026) is now operative. R-3 flagged as R3-N08. **Confirmed; no new R-4 finding.**
- Q13 (Critical path math): DOT = Day 90, Section 106 = Day 45, PCN = Day 55, MRO = Day 45. Construction = Day 90 + 7 = Day 97. answerIndex=1 ✓ CORRECT math.
- Q14 (RUS EIM for prime farmland in existing disturbed corridor): Answer B = EIM tier ✓ CORRECT

---

## 5. Post-2026 Completeness Sweep — NEW Citations Sampled

Citations previously unsampled by R-1/R-2/R-3 (focusing on lessons R-3 did not fully cover):

| Citation | Lesson:Line | Claim | R-4 Verification | Status |
|----------|------------|-------|-----------------|--------|
| 54 USC §302702/§302706 (THPO designation) | L09:128 | THPO authority under NHPA | CONFIRMED CURRENT — statutory provision unchanged | ✓ |
| 36 CFR §800.2(c)(2)(ii) (NHO consulting party) | L09:171 | NHO defined as consulting party | CONFIRMED CURRENT — regulation unchanged | ✓ |
| EO 13007 (Indian Sacred Sites) | L09 (referenced by implication in sacred sites definition) | Sacred sites federal accommodation | CONFIRMED CURRENT — EO 13007 (1996) still in effect | ✓ |
| 36 CFR §800.4(b)(2) (30-day clock) | L03:459 | Clock starts on adequate package | CONFIRMED CURRENT — unchanged | ✓ |
| 36 CFR §800.5/§800.6 (adverse effect/resolution) | L03:474 | Adverse effect resolution process | CONFIRMED CURRENT — unchanged | ✓ |
| 33 USC §1344 (CWA §404) | L05:487 | USACE 404 authority | CONFIRMED CURRENT — unchanged | ✓ |
| L11 references to "7 CFR 1970.14" | L11:136 | Extraordinary circumstances list | STALE — Part 1970 [Reserved] since April 2026; replacement is 7 CFR Part 1b | CONFIRMED R3-N01 (already HIGH) |
| "40 CFR Part 1500–1508" in L01 Q1 citation | L01:439 | CEQ NEPA implementing regulations | STALE — removed Jan 8, 2026 | CONFIRMED R3-N06/R1-F01 (already flagged) |
| "Presidential Memorandum on Tribal Consultation, November 2009, and the 2022 update" | L09:213-214 | Current tribal consultation policy | IMPRECISE — Biden EO was Jan. 26, 2021 memo; no distinct "2022 update" identifiable | NEW FINDING R4-N06 |
| 54 USC §306108 (NHPA §106) | Multiple lessons | Section 106 authority | CONFIRMED CURRENT — unchanged | ✓ |

---

## 6. R-1/R-2/R-3 Reconciliation (≤120 words)

R-4 independently confirms all R-1/R-2/R-3 HIGH/MED findings. No prior-round finding is overturned. R-4 extends the Flashcard count: R-2/R-3 documented L07/L08/L09/L11 broken — R-4 adds L10, making 5 broken lessons total. R-4 adds 3 new non-trivial findings (federal land easements absent R4-N03, MBTA absent R4-N01, Section 408 absent R4-N02), 2 LOW findings (L09 missing acronym table R4-N05, Presidential Memorandum date imprecise R4-N06), and 1 editorial scope note (railroad crossing absent R4-N04). The L04 "88 FR 6358" quiz-cite error is already in R-2/R-3 canonical — R-4 confirms.

---

## 7. Structured New Findings Table

| ID | Severity | Category | Lesson:Line | Issue (1 line) | Fix shape (1 line) | Source | Confidence |
|----|----------|----------|------------|----------------|-------------------|--------|------------|
| R4-N01 | **MED** | Coverage gap | L04 / T09 generally | Migratory Bird Treaty Act (16 USC §703) and Bald/Golden Eagle Protection Act (16 USC §668) not covered anywhere in T09 — tree-clearing fiber work can constitute MBTA/BGEPA incidental take separate from ESA §7 | Add L04 Advanced note: MBTA/BGEPA applies independently of ESA §7; fiber construction involving tree clearing in active nesting season (spring) triggers MBTA incidental take exposure; BEAD/RUS programs typically address via programmatic consultation, but learner should know it exists | 16 USC §703 (MBTA); 16 USC §668 (BGEPA) | HIGH |
| R4-N02 | **MED** | Coverage gap | L01/L05 | USACE Section 408 (33 USC §408) permit for alterations to federal flood control/navigation projects not mentioned — fiber routes crossing federal levees or USACE projects require a Section 408 alteration permit, separate from CWA §404 | Add Section 408 to L01 jurisdictional trigger table as "Crossing federal flood control infrastructure" → AHJ = USACE; add brief mention in L05 Advanced that NWP 57 does not substitute for §408 | 33 USC §408; USACE §408 regulations | HIGH |
| R4-N03 | **MED** | Coverage gap | L01/L07 | Projects crossing federal land (BLM, USFS, NPS, BIA land) require different instruments than private/state/municipal ROW — BLM ROW grants, USFS special use permits, NPS special use permits — none are mentioned in T09 | Add federal land row to L01 jurisdictional trigger table (Layer 1 federal = not just NEPA/§106, but also the physical ROW grant from the federal land agency); add brief L07 Advanced section noting BLM/USFS/NPS ROW grant process differs from recorded easement | 43 CFR Part 2800 (BLM ROW); 36 CFR Part 251 (USFS special use); 36 CFR Part 13/14 (NPS) | HIGH |
| R4-N04 | **LOW** | Coverage gap | L06 | Railroad crossings — whether FRA Class I railroad or short-line — require separate crossing agreements + state railroad commission approval in some states; not mentioned in L06 DOT lesson | Add L06 Advanced note: railroad ROW crossings require a crossing license with the railroad (not a DOT encroachment permit); federal agencies include FRA for safety compliance; state railroad commissions may have separate authority | FRA crossing safety regulations; state railroad commission statutes | MED |
| R4-N05 | **LOW** | Pedagogy | L09 (no line for absence) | L09 lacks the "Acronyms in this lesson" table present in L01–L06 — introduces THPO, NHO, BIA, NATHPO, ACHP without a field-crew-friendly glossary table | Add acronym table to L09 foundations section covering: THPO, NHO, BIA, NATHPO, ACHP Tribal Handbook — matching L01-L06 pattern | L01-L06 pattern (internal consistency) | HIGH |
| R4-N06 | **LOW** | Factual imprecision | L09:213-214 | "Presidential Memorandum on Tribal Consultation, November 2009, and the 2022 update" — no distinct "2022 update" memo exists; Biden tribal consultation memo was January 26, 2021 (not 2022) | Correct to "November 2009 memo (EO 13175 supplementation) and the January 26, 2021 Biden Administration tribal consultation memorandum; verify current federal tribal consultation guidance at time of project" | Biden Executive Memorandum, Jan. 26, 2021 (86 FR 7667) | HIGH |
| R4-N07 | **LOW** | Flashcard count extension | L10:122-123 | R-2/R-3 documented broken `term`/`definition` Flashcard pattern in L07/L08/L09/L11 (4 lessons); R-4 confirms L10 ALSO uses broken pattern — making 5 broken lessons total | Convert L10 to `deckId`/`cards` pattern matching L01-L06 | Flashcard.jsx component signature (deckId, cards props only) | CONFIRMED |

---

## 8. Cross-Topic DAG Sample

| Pointer | From | Target lesson_id | Verification |
|---------|------|-----------------|-------------|
| `T09.L04` vocab_assumed `CE C-8` → T09.L02 | L04:80 | T09.L02 | ✓ VALID — T09.L02 introduces CE C-8 in vocabulary_introduced |
| `T09.L04` vocab_assumed `vegetation observation` → T04.L01 | L04:82 | T04.L01 | PLAUSIBLE — T04.L01 introduces site walk/field documentation |
| `T09.L06` vocab_assumed `KMZ / shapefile deliverables` → T04.L06 | L06:77 | T04.L06 | UNVERIFIED — T04.L06 existence and vocab_introduced not confirmed in this round |
| `T09.L09` vocab_assumed `federal nexus` → T09.L01 | L09:39 | T09.L01 | ✓ VALID — T09.L01 vocabulary_introduced includes 'federal nexus' |
| `T09.L11` vocab_assumed `RUS program context` → T09.L01 | L11:39 | T09.L01 | ✗ BROKEN (confirmed R-3/R2-N08/R3-N10) — 'RUS program context' NOT in T09.L01 vocabulary_introduced |

New DAG concern: `T09.L06:77` vocab_assumed includes `KMZ / shapefile deliverables` pointing to `T04.L06`. If T04.L06 does not exist or does not introduce that term, this is a broken pointer. Flagged as NEEDS HAIKU GROUND-TRUTH VERIFICATION — not resolved in R-4.

---

## 9. Vite Build Result

```
✓ built in 6.22s — PASS
```
All 12 T09 lesson files compile without error. No import graph failures.

---

## 10. Saturation Verdict — HIGH Curve Analysis

| Round | New HIGH | New MED | New LOW | Notes |
|-------|----------|---------|---------|-------|
| R-1 | 2 | 1 | 2 | CEQ removal (2 HIGHs same root cause) |
| R-2 | 2 | 4 | 2 | Part 1970 removed + NLEB FR wrong + Flashcard defect extensions |
| R-3 | 2 | 3 | 5 | Part 1b replacement citation + NTIA CE C-8 label inaccuracy |
| R-4 | 0 | 3 | 4 | Coverage gaps (MBTA, §408, federal land) + 4 LOWs |

**R-4 assessment: HIGH curve is SATURATED.** R-4 finds zero new HIGH findings. The HIGH cluster (CEQ removal, Part 1970 removal, Flashcard runtime failure, NLEB FR citation) was exhausted by R-1/R-2/R-3. R-4's new findings are exclusively MED (coverage gaps) and LOW (pedagogy/precision). This is the expected saturation signal: R-4 required genuinely different framings (forensic scenario + pedagogy) to surface its MEDs; no further HIGH exists.

**MED findings still emerging** from new framings — R-3's MEDs were legal/regulatory; R-4's MEDs are coverage gaps (absent topics). A hypothetical R-5 with a "standards completeness" or "RUS borrower exam preparation" framing might find 1-2 more MEDs in L11 (which is now substantively stale due to Part 1970 removal).

**Saturation call: YELLOW — HIGH saturated, MED/LOW extending.** Fix wave for R-1/R-2/R-3 HIGHs is the priority. R-4 MEDs are coverage-expansion items, not accuracy-correction items; they can be addressed in a separate polish stage.

---

## 11. Saturation Hint for R-5 (if needed)

If dispatched, R-5 should focus on:
1. **L11 substantive accuracy post-fix** — after the Part 1970 → Part 1b replacement is applied, does the lesson's EIM framework still hold under Part 1b? Do quiz answers in L11 need updating to cite Part 1b?
2. **L04 NLEB FR citation post-fix** — after 87 FR 73488 correction is applied, verify the explanation is accurate throughout
3. **Post-fix scope validation** — confirm all 5 broken Flashcard lessons (L07/L08/L09/L10/L11) are correctly converted after fix wave

---

## Git/Commit Closeout

```
git diff --stat origin/main..HEAD
 audit-output/osp-retroactive-audit/T09_AUDIT_R4_FORENSIC_QUIZ.md | [new file]

git log -3 --oneline
[populated after push — see next line]
```

=== T09 AUDIT R4 FORENSIC QUIZ END ===
