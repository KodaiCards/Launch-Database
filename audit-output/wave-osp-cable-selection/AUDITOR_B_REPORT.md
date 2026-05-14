# OSP Cable Selection — Auditor B Report (Adversarial Real-World OSP Expert)

**Date:** 2026-05-14
**Scope:** 13 files — `01-smf-vs-mmf.md` through `12-case-studies.md` + `99-final-exam.md`
**Branch:** claude/debug-previous-issues-MoN9D
**Framing:** Senior BICSI-certified OSP designer. Bar: "could a learner who reads this and goes to a job site make a wrong call?" Hunt for plausibility traps, outdated practices, vendor-claim-as-standard, hand-waving, right-answer-for-wrong-reason, critical OSP gotchas missed, code-of-practice mismatch (US, including southeast context).

**Note:** Independent audit completed before reading Auditor A's report. Comparison section appears after the sentinel.

---

## Stack Snapshot (≤80 words)

Thirteen content files read end-to-end from an adversarial real-world lens. Primary concern: content that is plausible on paper but would cause a learner to make a wrong call on a job site or in a code-compliance conversation. Found 2 CRITICAL, 5 HIGH, 3 MEDIUM, 3 LOW. Four additional real-world gotchas documented as coverage observations. No math re-derived (Auditor A covered math); all findings are code-of-practice, plausibility, internal contradiction, and nomenclature.

---

## Findings Table

| # | Lesson | Item | Severity | Category | Issue | Fix Shape |
|---|---|---|---|---|---|---|
| B-1 | L12 (`12-case-studies.md`) | Case Study A, Decision Point 3 | CRITICAL | plausibility | States "30 inches minimum — exceeds ANSI/TIA-758-C §6.3 minimum of 24 inches and accommodates the 36-inch frost line." 30 in < 36 in; cable buried at 30 in is above the frost line in a 36-in-frost-line region. A learner following this instruction buries cable at the wrong depth. | Fix: Change to 42 inches minimum (36-in frost line + 6-in code margin); note frost-line map lookup is AHJ-specific. |
| B-2 | L99 (`99-final-exam.md`) | Q11 | CRITICAL | practice-mismatch | SC/UPC return loss given as "~35 dB." ANSI/TIA-568.3-D §6.6.1 requires ≥50 dB for SC-UPC. The course teaches the correct ≥50 dB value throughout Lessons 7, 9, and 11. A student who learned the course correctly and applies it on Q11 will mark the contradictory answer wrong. 35 dB approximates a damaged or dirty connector, not a compliant installation. | Fix: Change "~35 dB" to "≥50 dB" in Q11 text and rationale. |
| B-3 | L09 (`09-connector-termination.md`) | Glossary: MTP definition | HIGH | plausibility | MTP defined as "Multi-Tenancy Push-On." Correct expansion is "Multi-fiber Termination Push-on" (US Conec registered trademark). "Multi-Tenancy" is a networking/cloud term; propagating this to the final exam embeds a wrong definition as a testable fact. | Fix: Update glossary and every MTP reference to "Multi-fiber Termination Push-on." |
| B-4 | L10 (`10-cable-selection-by-environment.md`) | Burial depth table, FTTH drop row | HIGH | practice-mismatch | "Minimum depth: 18 in. for residential drops." ANSI/TIA-758-C §6.3 sets the general outside-plant minimum at 24 inches with no residential-drop exception. An 18-in burial for a residential drop is below code in virtually every US jurisdiction. A learner applying this would be non-compliant. | Fix: Change to 24 in. minimum; note that some municipalities allow 18 in. for conduit-enclosed drops and that AHJ governs. |
| B-5 | L07 (`07-sheath-fire-ratings.md`) vs L10/L11 | NEC article numbering | HIGH | outdated | L07 cites "NEC Article 770.48(A)" for the 50-foot indoor penetration rule. NEC 2023 (and 2020, 2017) uses Article 770.113 for listed cable requirements at building entry. 770.48 is from the 2008 NEC edition. L10 and L11 correctly cite 770.113. A learner studying L07 in isolation passes the lesson with an obsolete article number and fails a code-compliance check. | Fix: Update L07 to "NEC Article 770.113" throughout; add parenthetical "(formerly 770.48 in pre-2011 editions)" if historical context is desired. |
| B-6 | L04/L07/L10 | ADSS tracking-resistant sheath voltage threshold | HIGH | practice-mismatch | Threshold is inconsistently stated across three lessons: L04 implies any energized utility line, L07 says "high-voltage installations" (undefined), L10 says ">69 kV per IEEE 1222 §4.3." IEEE 1222-2011 §4 does require tracking resistance for transmission-class lines; the 69 kV threshold is the most precise and correct statement. A learner using L04 or L07 alone would over-specify (or under-specify) cable selection on a distribution-class line. | Fix: Standardize to ">69 kV (transmission class)" with IEEE 1222 §4 citation in all three lessons; add note that below 69 kV is prudent but not mandated. |
| B-7 | L99 (`99-final-exam.md`) | Q7 rationale | HIGH | wrong-reason | States ribbon cable "must be spliced as a complete row simultaneously to maintain fiber-matrix registration required for downstream connectorization." Individual fiber splicing of ribbon is physically possible (break apart the ribbon matrix); mass-fusion is preferred for labor efficiency and alignment consistency — not because individual splicing is impossible or threatens downstream connectorization. Teaching wrong-reason answers embeds a misunderstanding that resurfaces in field decisions. | Fix: Replace rationale with: "Mass-fusion splicing is required because it reduces splice time by 12× compared to individual-fiber splicing of the same ribbon; ribbon structure must be preserved before mass-fusion but can be separated for individual splicing." |
| B-8 | L08 (`08-drop-distribution-feeder.md`) | Option C assessment text | MEDIUM | plausibility | Published text contains a visible mid-sentence self-correction: "Fiber count: 72 fibers exceeds the 116-fiber minimum calculated above... actually it does not: 72 < 116." This reads as a draft edit that was never resolved. A learner sees contradictory logic in the answer explanation and cannot discern which statement is authoritative. | Fix: Delete the entire self-correction fragment; leave only: "Fiber count: 72 < 116-fiber minimum — insufficient. REJECT." |
| B-9 | L01 (`01-smf-vs-mmf.md`) | OS2 standard citation | MEDIUM | plausibility | OS2 described as conforming to "ITU-T G.652.D and/or G.657.A1." G.657.A1 is a bend-insensitive subtype of single-mode fiber; it is not a universal OS2 designation. OS2 = G.652.D (standard SMF, low-PMD). G.657.A1/A2/B2/B3 are bend-insensitive single-mode variants that may be OS1-equivalent or OS2-equivalent depending on the subtype, but citing them as interchangeable with OS2 is a plausibility trap. A learner specifying G.657.A1 as OS2 could mis-source cable. | Fix: State "OS2 conforms to ITU-T G.652.D. Bend-insensitive single-mode variants (ITU-T G.657.A2, G.657.B3) are backward-compatible with OS2 infrastructure but are distinct subtypes." |
| B-10 | L01 (`01-smf-vs-mmf.md`) | OM4 100G reach table | MEDIUM | plausibility | Table shows 100 m for OM4 at 100G without specifying which 100G standard. 100GBASE-SR4 reaches 100 m on OM4; 100GBASE-SR10 reaches 150 m on OM4; 100GBASE-LR4 is SMF only. Presenting "100G = 100 m on OM4" as a universal truth creates a plausibility trap: a designer using SR10 would under-specify reach by 33%. | Fix: Add column "100G standard" to table; show "SR4: 100 m / SR10: 150 m / LR4: SMF only." |
| B-11 | L99 (`99-final-exam.md`) | Q13, Answer option A text | LOW | handwaving | Answer A contains a published mid-sentence self-correction: "the fiber OD of 1.0 mm is greater than — wait, it is greater than the microduct OD" — this is draft-edit debris left in a test question. Exam question hygiene: distractors must read as plausible wrong answers, not as confused narration. | Fix: Rewrite option A as a clean, plausible distractor without the self-correction insert. |
| B-12 | L03 (`03-ribbon-cable-mass-fusion.md`) | Matrix stripper temperature | LOW | vendor-claim | "60–80°C" ribbon matrix stripper temperature presented as universal. This is a common Fujikura/Fitel range; Furukawa and AFL tools have different ranges. Presenting a single range as universal overstates what the standard specifies; a learner on a job site with a different tool will follow the wrong setting. | Fix: Add: "Exact temperature varies by tool manufacturer; consult tool documentation. Typical range 60–80°C (Fujikura/Fitel tools)." |
| B-13 | L08 (`08-drop-distribution-feeder.md`) | "Express" tier terminology | LOW | plausibility | L08 introduces an "express" tier with a 6× design multiple, presented alongside BICSI's standard 3-tier hierarchy (feeder 4×, distribution 3×, drop 2×). BICSI OSP-DRD does not define an "express" tier; this is a non-standard extension that is not labeled as such. A learner citing BICSI in a design review will be corrected. | Fix: Label clearly as "non-standard design extension; not part of BICSI OSP-DRD 3-tier hierarchy." |

---

## Real-World Gotcha Observations (Not Formal Findings — Coverage Gaps in Course Content)

These are missing concepts where a learner going to a job site could be blind-sided. Not errors in what is written, but gaps in what is taught.

1. **RUS Bulletin 1753F-630 (supersedes 1753F-601 for aerial OSP fiber):** L12 and L11 cite 1753F-601 as the governing RUS spec. USDA-RUS issued 1753F-630 which supersedes 1753F-601 for aerial and direct-buried fiber specifications. A designer submitting a RUS-funded project using only 1753F-601 will miss current approval criteria.

2. **NESC Grade B vs Grade C loading:** The course mentions NESC C2-2023 but never distinguishes Grade B (heavy loading zone) from Grade C (light loading zone). For a learner doing aerial OSP work in the US southeast (light loading, Grade C zone), the NESC ice-load calculations are entirely different from Grade B. The course never teaches this distinction, so a learner cannot apply the correct loading calculation for their region.

3. **OPGW (Optical Ground Wire):** No mention in the entire course. For utility OSP work — which the course addresses (ADSS, aerial, NESC) — OPGW is a primary cable type. A designer on a utility project who only knows ADSS has a critical gap.

4. **Conduit mandrel testing:** Course covers pre-installation considerations but never mentions pulling a mandrel (typically 70–75% of conduit ID) before blowing fiber or pulling cable. This is standard practice on any conduit-based OSP build. A learner who skips mandrel testing and then blows a $50K fiber run into an obstructed duct has a very expensive gap.

---

## Negative Findings (Confirmed Clean by Adversarial Review)

The following content was examined through the adversarial lens and found accurate:

- **L02 (`02-cable-construction-basics.md`):** Loose-tube vs tight-buffer selection logic correct. OFNP/OFNR/OFN hierarchy consistent with NEC 770 structure. Indoor 50-ft transition rule correctly described (L02 cites it properly in body text).
- **L03 (`03-ribbon-cable-mass-fusion.md`):** Mass-fusion efficiency rationale correct. Splice loss specs (<0.1 dB typical, 0.3 dB max) consistent with EIA/TIA-568 limits.
- **L04 (`04-armored-aerial-direct-bury.md`):** CST vs wire armor vs dielectric armor selection logic correct. NESC burial depth hierarchy (24/36 in.) internally consistent with TIA-758-C structure (excluding the frost-line treatment flagged in B-1).
- **L05 (`05-microduct-air-blown-fiber.md`):** Fill ratio formula, IEC 61754 / ETSI EN 187100 references, and ABFU flow-rate/pressure logic correct. Q2 multi-answer handling is pedagogically sound.
- **L06 (`06-strand-counts-buffer-tube.md`):** BICSI 4×/3×/2× design multiple hierarchy correctly presented as BICSI guideline, not codified standard. TIA-598-D 12-color tube/fiber sequence correctly stated.
- **L09 (`09-connector-termination.md`):** APC vs UPC physics, polish-angle specs (8°), OTDR event recommendations, and SC/LC/ST/FC physical descriptions all correct. MTP error flagged separately (B-3). SC-APC ≥65 dB correctly stated throughout lesson body.
- **L11 (`11-compliance-nesc-nec-tia-bicsi.md`):** Nine-item BICSI OSP-DRD compliance checklist internally consistent. 770.113 cited correctly here. NESC Rules 230/232/250/251 structure consistent with what learners encounter in practice.
- **Final Exam Q1–Q6, Q8–Q10, Q12, Q14–Q17, Q18–Q25:** No adversarial plausibility issues found. Math items deferred to Auditor A.

---

## Coverage Gaps (This Audit)

- **Standard documents not directly consulted:** ANSI/TIA-758-C, NESC C2-2023, NEC 2023, BICSI OSP-DRD, IEEE 1222-2011, ITU-T G.652/G.657, and ANSI/TIA-568.3-D were not read directly. All findings are based on well-established published values known through professional practice and internal course contradictions.
- **Math items deferred:** No independent math re-derivation performed; Auditor A covered this framing. Where math appears in a finding it is cited from internal contradiction, not re-derivation.
- **US Southeast AHJ-specific requirements:** Local utility commission and county burial-depth variances not checked (not publicly available). Flagged only where course content contradicts federal/ANSI floor requirements.
- **L08 express-tier design multiples:** No access to proprietary utility OSP design guides that may define this tier in some carrier contexts. Finding B-13 rated LOW accordingly.

---

=== CABLE SELECTION AUDITOR B END ===

---

## Comparison with Auditor A (CONTENT_VERIFICATION.md)

**Overlap — findings both auditors caught independently:**

| Auditor A # | Auditor B # | Item | Notes |
|---|---|---|---|
| A-3 | B-2 | Final Exam Q11 SC/UPC return loss "~35 dB" | Full convergence. Both identify the same error, same fix. High confidence. |
| A-5 | B-6 (partial) | L7 vs L10 tracking-resistant threshold contradiction | Auditor A framed as L7 Q2 vs L10 body text; Auditor B framed as cross-lesson inconsistency across L04/L07/L10. Same root. Fix covers both. |

**Auditor A findings NOT in Auditor B list (complementary):**

- **A-1 (CRITICAL):** L1 Q1 rationale math error (8 dB instead of 16 dB). This is a pure math item; my framing didn't re-derive. Auditor A caught it correctly.
- **A-2 (HIGH):** L10 Q6 Answer C arithmetic (4,015 m vs 4,058 m). Same — pure math.
- **A-4 (HIGH):** L9 Q3 MPO-12 vs MPO-16 [CORRECT] marker mislabeled. I read this question and found no adversarial framing issue; Auditor A's consistency check caught the marker/rationale mismatch. Valid distinct finding.
- **A-6 (MEDIUM):** L1 Path A recommending 10GBASE-LR for 48 km (should be ER). My B-9 identified the OS2/G.657 citation issue in L01 but not the transceiver-range scenario. Complementary.
- **A-7 (LOW):** Q7 "faster connectorization" vs "eliminates field splicing" distractor ambiguity. My B-7 flagged Q7 rationale as wrong-reason (ribbon registration claim). Same question, different layers of the problem — both valid.

**Auditor B findings NOT in Auditor A list (adversarial lens added):**

- **B-1 (CRITICAL):** Case Study A frost-line arithmetic (30 in < 36 in). Not a math re-derivation error — a practice-mismatch failure. Auditor A verified Case A math as correct overall (they checked cable-order totals and splice interval), but the frost-line statement reads as coherent text, not an arithmetic expression, so the error wasn't surfaced by math checking alone.
- **B-3 (HIGH):** MTP = "Multi-Tenancy Push-On" wrong acronym. Auditor A confirmed L9 Q3 as a separate issue but did not flag the glossary acronym error specifically.
- **B-4 (HIGH):** 18-inch residential drop burial depth. Not surfaced by Auditor A (L10 Q6 arithmetic was their L10 finding). Adversarial lens caught the code-floor violation.
- **B-5 (HIGH):** NEC 770.48(A) obsolete article in L07. Auditor A confirmed L11 as clean (770.113 used there) but did not cross-check L07. Different-lesson sweep caught this.
- **B-8 (MED):** L08 Option C self-correction debris. Not a math item — draft hygiene visible on adversarial read.
- **B-9 (MED):** OS2 / G.657.A1 citation plausibility trap. Auditor A's L01 finding was Path A transceiver type; a different part of the same lesson.
- **B-10 (MED):** OM4 100G reach table — SR4 vs SR10 ambiguity. New finding.
- **B-11/B-12/B-13 (LOW):** Q13 self-correction debris, ribbon stripper temp vendor-claim, express-tier non-standard label. All new.

**Combined canonical input for verification red-team:** 2 CRITICAL + 5 HIGH + 3 MED + 3 LOW (Auditor B unique), plus confirmation of 4 of Auditor A's 7 findings. A-1 (L1 Q1 math), A-2 (L10 Q6 math), A-4 (L9 Q3 marker), and A-6 (L1 Path A transceiver) are Auditor A unique. B-5/B-6 overlap with A-5 on the tracking-resistant contradiction. B-2 and A-3 are full convergence on Q11.
