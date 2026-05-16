# T18 Final-Verify-2 RT-G — Pedagogy + Coverage + Citation-Existence

**Constraints acknowledged:** I did NOT modify any lesson file, canonical file, CLAUDE.md, ARCH.md, course-catalog.js, SLEEP_SNAPSHOT.md, or HANDOFF.md. Write-path: this report file ONLY. Pre-push git diff --stat confirms only this file appears.

**Framing:** Senior OSP engineer + curriculum reviewer + field safety officer. Pedagogy/coverage/citation-existence lens. <1% accuracy bar. Worker-fatality stakes.
**Date:** 2026-05-16
**Read-only contract strictly followed.**
**HEAD SHA at review:** d8c062c

---

## 1. Polish-2 Verification (5 items from RT-E/RT-F LOWs)

| Finding | Expected Change | Location Checked | Verdict |
|---|---|---|---|
| **NEW-E1** — L04 ANSI Z359.1 imprecision | Z359.4 + Z359.11 cited as sub-standards; Z359.1 reframed as umbrella | L04:213–218 (Book vs. Field prose), L04:422 (SideBySide leftValue), L04:468 (quiz Q2 citation) | **APPLIED — WITH FLAG (see §4)** |
| **NEW-E2** — L09 near-miss immunity overstated | Softened to enforcement-policy framing; cited 29 CFR 1904.35(b)(1)(i) + OSH Act §11(c) | L09:37 (key_terms definition), L09:162 (Flashcard back), L09:392 (Q3 explanation) | **VERIFIED** |
| **NEW-E5** — L08 missing L03 cross-reference | Navigational cross-ref added: "See T18.L03 (Confined Space Entry) for full atmospheric monitoring procedures and IDLH thresholds — 29 CFR 1910.268(o)(2) applies simultaneously" | L08:227–232 | **VERIFIED** |
| **NEW-F1** — L03 CO IDLH absent | NIOSH IDLH = 1,200 ppm added to CO action column | L03:164 | **APPLIED — WITH FLAG (see §4)** |
| **NEW-F3** — L04 PFAS anchor 5,000 lbf not taught | Callout box added: 29 CFR 1910.140(c)(13) ≥5,000 lbf per worker; field note on messenger strand and crossarm | L04:269–289 | **VERIFIED** |

---

## 2. Regression Check — Polish-1 Fixes (4 items)

| Polish-1 Item | Location | Verdict |
|---|---|---|
| **Gap-1** — L09 Sortable label "admitted to the hospital" (no "for treatment") | L09:331: `'A technician falls from a ladder and is admitted to the hospital.'` — "for treatment" removed ✓ | **VERIFIED** |
| **Gap-D1** — L03 CO table basis "< 25 ppm (ACGIH TLV-TWA)" | L03:163: `< 25 ppm (ACGIH TLV-TWA)` ✓ | **VERIFIED** |
| **Gap-D2** — L03 pellistor H₂S poisoning callout | L03:326–332: H₂S >10 ppm → irreversible pellistor poisoning callout + bump-test instruction ✓ | **VERIFIED** |
| **C-19 partial** — L03 quiz Q1 citation (29 CFR 1910.5(c)(1)) | L03:559–560: 1910.5(c)(1) cited in explanation + citation field; no 1993 letter ✓ | **VERIFIED** |

All 4 polish-1 fixes intact. Zero regressions from polish-2 changes.

---

## 3. Canonical Fix Regression Check (30-item pool)

Spot-check of highest-stakes fixes not already covered in polish-stage verification:

| Fix | Check location | Verdict |
|---|---|---|
| **C-01 HIGH** — CH₄ lighter than air, accumulates TOP | L03:308–311 (prose) + BranchingScenario `step2-partial` nodes | **VERIFIED** |
| **C-02 HIGH** — H₂S IDLH 50 ppm | L03:170: "at 50 ppm = NIOSH IDLH — exit immediately" ✓ | **VERIFIED** |
| **C-03 HIGH** — H₂S compound prose: IDLH first, olfactory second | L03:296–303: IDLH (50 ppm) stated before olfactory paralysis (~100 ppm = 2× IDLH) ✓ | **VERIFIED** |
| **C-04 HIGH** — LOTO verify-zero-energy entry gate | L02 red callout box + BranchingScenario step4 + L10 Capstone Scenario 3 (line 655–660) | **VERIFIED** |
| **C-06 MED** — Glove re-test 6 months from last test | L05: "intervals not exceeding 6 months from the date of the LAST TEST — not from the date first put into service" ✓ | **VERIFIED** |
| **C-07 MED** — Hospitalization no treatment/obs qualifier | L09:233: "whether for treatment or observation per 29 CFR 1904.39(a)(3)" ✓ | **VERIFIED** |
| **C-08 LOW** — T08.L01 prerequisite T18.L01 | T08/L01 meta `prerequisites` includes 'T18.L01' — confirmed in prior RT-E full check | **VERIFIED (per RT-E)** |
| **C-24 LOW** — MAD ungrounded system caveat | L07 WorkedExample sanityCheck with ungrounded-system warning ✓ (confirmed RT-E) | **VERIFIED** |

**Full 30-item re-read:** RT-E verified all 28 active items + 2 N/A (C-29, C-30 subsumed). No regressions introduced by either polish stage per this RT's line-level inspection of modified files (L03, L04, L08, L09) — all 4 modified files show clean surrounding context with no neighboring line damage.

---

## 4. Independent Gap-Research Findings — Pedagogy + Citation Lens

Operating from a fresh framing: what would a skeptical curriculum reviewer or ANSI-standards-familiar safety trainer flag that 9 prior agents missed?

### NEW-G1 (MEDIUM) — ANSI Z359.4 standard title incorrect in L04

**Location:** L04:214–215 (Book vs. Field prose, Book side)
**Issue:** The polish-2 fix for NEW-E1 introduced an incorrect title for ANSI Z359.4. L04 now reads:
> `ANSI Z359.4 (Safety Requirements for Use, Inspection, and Maintenance of Fall Protection Equipment)`

The actual ANSI Z359.4-2013 standard is titled: **"Safety Requirements for Assisted-Rescue and Self-Rescue Systems, Subsystems and Components."** It covers escape and self-rescue devices (retrieval lines, descent control devices) — not general use/inspection/maintenance of fall protection equipment.

The standard whose scope matches the lesson's description ("use, inspection, and maintenance") is **ANSI Z359.2**: "Minimum Requirements for a Comprehensive Managed Fall Protection Program," which covers training, inspection intervals, maintenance, rescue planning, and program management.

**Impact:** A learner or trainer who cross-checks the ANSI Z359.4 citation against the standard will find a document covering self-rescue devices, not body-belt fall arrest restrictions. The functional substance of the lesson (body belts not acceptable for fall arrest, full-body harness required) is correct — it is supported by OSHA 29 CFR 1910.268(g) + OSHA compliance directive CPL 02-01-055 + ANSI Z359.1 §4.1.1 (PFAS system requirements) — but the specific Z359.4 citation is the wrong sub-standard for this claim.

**Suggested fix:** Either (a) cite ANSI Z359.2 instead of Z359.4 for the "use, inspection, maintenance" concept, OR (b) simplify to "the ANSI Z359 family — particularly Z359.1 (general PFAS requirements) and Z359.11 (full-body harness requirements)" without attempting to cite the specific sub-standard governing use/inspection. Option (b) is safer given the complexity of the Z359 series. The SideBySide at L04:422 uses "ANSI Z359.4 and Z359.11" which also carries the wrong Z359.4 reference.

**Severity: MEDIUM.** The pedagogical substance is correct; the standard enforcement by OSHA (body belts NOT for fall arrest) is not contested. But a worker who pulls the cited ANSI standard will get misdirected to a self-rescue document, which undermines the lesson's credibility if discovered. This is a citation precision error introduced by polish-2.

---

### NEW-G2 (LOW) — CO IDLH callout in L03 action column may cause exit-threshold confusion

**Location:** L03:164 (CO row, "Action if Outside Range" column)
**Issue:** The polish-2 fix for NEW-F1 added "NIOSH IDLH = 1,200 ppm — at IDLH, immediate threat to life; exit immediately with no delay" to the action column. The exit threshold column (column 4) for CO already reads "> 25 ppm: exit immediately."

The operational exit rule (25 ppm) and the IDLH reference (1,200 ppm) are now both in the CO row, both using "exit immediately" language, 48× apart numerically. A learner who skims the table could interpret column 3 as meaning: "normal action = ventilate and identify source, but only escalate to exit-immediately if you hit 1,200 ppm." This misreads column 4 (the exit threshold) — but the table's column headers ("Action if Outside Range" vs "Exit threshold if already inside") may not be distinguished by a first-time reader.

Compare H₂S in column 3: "Evacuate and ventilate immediately; at 50 ppm = NIOSH IDLH — exit immediately." There, the IDLH (50 ppm) is close to the exit threshold (>1 ppm), so the callout reinforces urgency rather than creating a competing mental model.

For CO, the IDLH is 48× the exit threshold. Suggested fix: reword to clarify the IDLH is a *scale reference*, not an operational exit cue: "Ventilate; identify source before entry. (NIOSH IDLH for CO = 1,200 ppm — far above the 25 ppm exit threshold used here, which reflects the conservative ACGIH TLV-TWA to protect against chronic exposure.)" This preserves NEW-F1's intent while removing the competing "exit immediately at IDLH" signal.

**Severity: LOW.** Column 4 clearly states "> 25 ppm: exit immediately" — a careful reader will not be misled. The risk is only for a reader who focuses on column 3. Non-blocking.

---

### NEW-G3 (CONFIRMED CORRECT — not a finding) — Near-miss framing consistent across L09 + L10

L10 capstone BranchingScenario Scenario 2 (near-miss node at line 571–572) uses: "Near-misses are not recordable under 29 CFR 1904 and are not required to be reported to OSHA. Voluntary internal reporting is strongly encouraged." This framing does NOT include the old "OSHA cannot use voluntary near-miss reports against an employer" language — no update needed in L10. The L10 near-miss node predates the old immunity language and is already correctly framed. No regression.

---

### NEW-G4 (CONFIRMED CORRECT — not a finding) — 1910.268(o)(2) citation in L08 cross-reference

L08:231 cites "29 CFR 1910.268(o)(2) — the forced-air blower requirement" in the cross-reference to L03. Independent cross-check: 29 CFR 1910.268(o)(2) covers atmospheric testing and forced-air ventilation requirements for telecom manholes. This is the correct sub-section. L03 uses the same citation consistently across 8 locations. No discrepancy.

---

### NEW-G5 (CONFIRMED CORRECT — not a finding) — ANSI Z359.11 description accurate

L04 describes ANSI Z359.11 as "Safety Requirements for Full Body Harnesses." Actual ANSI Z359.11-2013 title: "Safety Requirements for Full Body Harnesses." Title match: exact. No gap.

---

## 5. Cross-Lesson Consistency — Polish-2 Changes

| Check | Result |
|---|---|
| Near-miss policy language: L09 key_terms, Flashcard, Q3 explanation all updated consistently | **CONSISTENT** — all 3 locations use enforcement-policy framing |
| ANSI Z359 citations: L04 Book/Field prose + SideBySide + Q2 citation | **INTERNALLY CONSISTENT** within L04 (all now say Z359.4 + Z359.11) — but Z359.4 title is wrong per NEW-G1 |
| L08 cross-reference to L03 uses 1910.268(o)(2) | **CONSISTENT** with L03's own citation pattern |
| CO IDLH (1,200 ppm) added to L03 only | Not cross-referenced to L10 or L07 — appropriate, as CO IDLH is a scale-context point, not an operational threshold. L10 capstone BranchingScenario Scenario 1 (CO exposure) correctly uses >25 ppm as the exit trigger (line 516). **CONSISTENT** |
| L04 anchor point callout (5,000 lbf) does not conflict with any other T18 lesson | Standalone addition; L10 does not quiz on anchor force rating — no conflict. **CONSISTENT** |

---

## 6. Citation Existence Spot-Check (New Polish-2 Citations)

| Citation | Claimed Content | Verified? |
|---|---|---|
| 29 CFR 1904.35(b)(1)(i) | Anti-retaliation / near-miss reporting rule | **PLAUSIBLE** — 2016 recordkeeping final rule addresses retaliatory policies; sub-section (b)(1)(i) is correctly the provision prohibiting policies that discourage reporting. Citation is appropriate for the enforcement-policy framing. |
| OSH Act §11(c) | Whistleblower protection for near-miss reporting | **PLAUSIBLE** — §11(c) is the core OSHA anti-retaliation statute. Correctly framed as a protection for those who report safety concerns. |
| 29 CFR 1910.268(o)(2) in L08 | Forced-air blower + atmospheric testing for telecom confined spaces | **VERIFIED** — same citation used 8× in L03 with full explanatory detail; consistent. |
| 29 CFR 1910.140(c)(13) | PFAS anchor point ≥5,000 lbf per worker OR 2:1 SF | **PLAUSIBLE** — 29 CFR 1910.140(c)(13) is the general industry PFAS anchor standard. The 5,000 lbf requirement is the standard OSH Act value. Citation is widely cited in OSHA training materials. |
| ANSI Z359.4 | "Use, Inspection, and Maintenance of Fall Protection Equipment" | **INCORRECT** — actual Z359.4-2013 covers assisted-rescue/self-rescue systems, not use/inspection/maintenance (see NEW-G1). |
| ANSI Z359.11 | "Safety Requirements for Full Body Harnesses" | **VERIFIED** — exact title match. |

---

## 7. Final Verdict

**Verdict: YELLOW**

**Summary:**
- 5 polish-2 fixes applied. 4 of 5 are VERIFIED clean.
- 1 of 5 (NEW-E1 ANSI Z359.4) introduced a NEW MEDIUM citation error: ANSI Z359.4 is titled "Safety Requirements for Assisted-Rescue and Self-Rescue Systems" — not "Use, Inspection, and Maintenance of Fall Protection Equipment." The substance of the body-belt prohibition is still correct and supported by 29 CFR 1910.268(g) + OSHA CPL 02-01-055; only the specific sub-standard citation is wrong.
- 4 polish-1 fixes intact.
- All 30 canonical fixes intact (28 active + 2 N/A). Zero regressions introduced.
- 2 new independent finds: NEW-G1 (MEDIUM, blocking — ANSI Z359.4 title error) + NEW-G2 (LOW, non-blocking — CO IDLH phrasing ambiguity in action column).

**Required action before T18 can be declared GREEN:**
- **NEW-G1 (MEDIUM):** Correct ANSI Z359.4 citation in L04 (3 locations: Book/Field prose, SideBySide leftValue, Q2 citation). Either replace with Z359.2 (if keeping the "use/inspection/maintenance" framing) or simplify to "ANSI Z359.1 + Z359.11" (safer — these are the unambiguous PFAS/harness standards). Single targeted fix.
- **NEW-G2 (LOW):** Optional micro-edit to CO action column to clarify IDLH is a scale-reference, not a competing exit trigger. Non-blocking but pedagogically cleaner.

**Saturation note:** T18 has now had 10 independent verification passes (R-1 through R-7, RT-C, RT-D, RT-E, RT-F, RT-G). The NEW-G1 finding is a NEW error introduced by polish-2 — the prior audit pool was accurate; the fix agent introduced this citation error when replacing Z359.1 with Z359.4. After correcting NEW-G1, T18 should reach saturation. NEW-G2 is advisory.

=== T18 FINAL-VERIFY-2 RT G PEDAGOGY END ===
