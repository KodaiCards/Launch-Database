# OSP Cable Selection — Canonical Findings List

**Date:** 2026-05-14
**Branch:** claude/debug-previous-issues-MoN9D
**Pipeline step:** Red Team Verification (Step 4)
**Inputs:** CONTENT_VERIFICATION.md (Auditor A), AUDITOR_B_REPORT.md (Auditor B), PEER_REVIEW.md (Peer Cross-Check)

---

## Stack Snapshot (≤80 words)

All 18 peer-review findings independently verified against source files. Three CRITICALs all confirmed — frost-line arithmetic (30 < 36 inches), Q11 UPC return loss (~35 dB vs. ≥50 dB), and L1 Q1 span-loss math (8 dB vs. 16 dB). B-5 NEC 770.48(A) vs. 770.113 cross-lesson inconsistency confirmed with 7 L7 occurrences of 770.48(A) vs. 10+ correct L11 occurrences of 770.113. All 6 LOW items verified as written. Two peer-review downgrades (B-9, B-10) confirmed as appropriate. Zero false-positives found.

---

## Canonical Findings Table

| # | Source | Severity (FINAL) | Category | Lesson | Location | Issue | Red Team Status | Red Team Note |
|---|---|---|---|---|---|---|---|---|
| 1 | B-1 | CRITICAL | practice-mismatch / math | L12 | Case Study A, Decision Point 3 (line 102) | "30 inches minimum — accommodates the 36-inch frost line": 30 < 36; cable buried above frost line | VERIFIED | Confirmed at L12 line 102: "30 inches minimum — this exceeds the ANSI/TIA-758-C §6.3 minimum of 24 inches (general soil) and accommodates the 36-inch frost line." 30 < 36 is unambiguous. Iowa frost-line context verified at line 98. Fix requires 42-inch minimum (36 + 6 margin). Also check: county highway crossing depth in same Decision Point says 36 inches — this is internally consistent but the general burial depth (30 in.) is wrong. |
| 2 | A-3 / B-2 | CRITICAL | consistency | Final Exam | Q11 rationale (line 200–206) | "~35 dB for UPC" contradicts ≥50 dB specification in L9 body, L9 Key Terms, and L11 | VERIFIED | Confirmed at 99-final-exam.md line 200–206: "APC connectors have ~60 dB return loss vs. ~35 dB for UPC." L9 body text explicitly states "Return loss (UPC): ≥50 dB" at line 54. L9 Key Terms flashcard "UPC: Return loss ≥50 dB" at line 185. 35 dB is well below spec; would describe a damaged connector. Full 2-auditor convergence confirmed. |
| 3 | A-1 | CRITICAL | math | L1 | Q1 rationale (line 241) | "~8 dB span loss at 0.4 dB/km × 40 km" — 0.4 × 40 = 16 dB, not 8 dB; 16 dB > 12.6 dB LR budget | VERIFIED | Confirmed at 01-smf-vs-mmf.md line 241: "covering the ~8 dB span loss at 0.4 dB/km × 40 km including splice losses." 0.4 × 40 = 16 dB arithmetic is independently derivable. Pulse 1 at bottom of L1 (line 328) correctly states "10GBASE-LR covers 10 km max; 10GBASE-ER covers 40 km" — which contradicts the Q1 rationale's use of LR for 40 km. Correct transceiver for 40 km is ER; the rationale invokes the wrong IEEE 802.3ae transceiver. CRITICAL confirmed. |
| 4 | B-3 | HIGH | plausibility | L9 | Key Terms / Glossary (line 190–191) | MTP defined as "Multi-Tenancy Push-On" — correct expansion is "Multi-fiber Termination Push-on" | VERIFIED | Confirmed at 09-connector-termination.md line 190–191: "MPO/MTP (Multi-Fiber Push-On / Multi-Tenancy Push-On)." "Multi-Tenancy" is a cloud/IT term unrelated to fiber connectors. L9 body text line 124 correctly identifies US Conec as the trademark holder without expanding the acronym — only the Key Terms block is wrong. Fix must update Key Terms line to "Multi-fiber Termination Push-on." |
| 5 | A-4 | HIGH | consistency | L9 | Q3 [CORRECT] marker and rationale (lines 271–279) | [CORRECT] on MPO-12 but rationale describes QSFP-DD 400G SR8 using MPO-16 with 16 fibers | VERIFIED | Confirmed at 09-connector-termination.md lines 271–279: answer B "[CORRECT]" is marked on MPO-12 option; rationale says "QSFP-DD 400G SR8 uses 8 active fibers + 8 active fibers = 16 fibers total in an MPO-16." L9 body at line 134 says "QSFP-DD 400G SR8 uses 16 fibers in an MPO-16 interface." The [CORRECT] marker and the rationale are on different answers. Fix: move [CORRECT] to MPO-16 option. |
| 6 | A-2 | HIGH | math | L10 | Q6 Answer C label (lines 362–370) | Answer C labeled 4,015 m [CORRECT] but 3,865 × 1.05 = 4,058 m; designer note claiming 4,015 m is non-derivable | VERIFIED | Confirmed at 10-cable-selection-by-environment.md lines 362–370. Step-by-step calculation: 3,800 + 50 + 15 = 3,865; 3,865 × 1.05 = 4,058.25 m. The answer label "4,015 m" has no valid mathematical derivation. The designer note at line 367–368 claims "without rounding the contingency upward" produces 4,015 — this is arithmetically false. Fix: change label to 4,058 m (or 4,060 rounded), remove designer note. |
| 7 | B-4 | HIGH | practice-mismatch | L10 | Direct-bury matrix, FTTH drop row (line 94) | "Minimum depth: 18 in. for residential drops" — TIA-758-C §6.3 sets 24-inch general minimum with no residential exception | VERIFIED | Confirmed at 10-cable-selection-by-environment.md line 94: "Vibratory plow installation; minimum depth 18 in. for residential drops." All other burial depth references in L10 and L4 use 24-inch general minimum correctly (L4 line 76, L10 lines 89–93, L10 Option B line 180). 18 inches has no TIA-758-C or NESC basis as a general residential floor. Fix: change to 24 in., add conduit-enclosed exception note per B-4 suggestion. |
| 8 | B-5 | HIGH | outdated | L7 | Body text and Key Terms (lines 53, 71, 95, 97, 154, 160, 279) | L7 cites "NEC Article 770.48(A)" throughout; NEC 2023 uses 770.113; pre-2011 editions used 770.48 | VERIFIED | Confirmed. L7 has 7+ occurrences of "NEC Article 770.48(A)" — body text lines 53, 71, 95, 97; Key Terms line 154, 160; Pulse 1 line 279. L10 body text line 120 correctly cites "NEC Article 770.113." L11 uses 770.113 throughout (10+ occurrences confirmed). L7 is the sole lesson with the obsolete article number. A learner citing 770.48(A) in a code check will be corrected. Fix: update all L7 770.48(A) references to 770.113. |
| 9 | B-6 / A-5 | HIGH | practice-mismatch / consistency | L4, L7, L10 | Multiple locations | Tracking-resistant threshold: L4 implies any voltage (0–69 kV range), L7 vague ("high-voltage"), L10 correctly states >69 kV per IEEE 1222 §4.3 | VERIFIED | Confirmed. L4 line 107: "The pole line already carries electrical distribution (0–69 kV range)" as an ADSS selection criterion — implies tracking resistance applies throughout this range. L7 Q2 rationale says tracking-resistant sheath "required for energized utility lines" without voltage qualifier. L10 body text line 62 and Key Terms "Track-resistant sheath" flashcard correctly state ">69 kV transmission class, IEEE 1222 §4.3." Three-lesson inconsistency real. Fix: standardize to ">69 kV" with IEEE 1222 §4.3 citation in L4 and L7; note below-69 kV is prudent practice but not mandated. |
| 10 | B-7 | HIGH | wrong-reason | Final Exam | Q7 rationale (lines 141–148) | Rationale states ribbon "must be spliced as a complete row simultaneously to maintain the fiber-matrix registration required for downstream connectorization" — individual ribbon splicing is physically possible; mass-fusion is preferred for labor efficiency | VERIFIED | Confirmed at 99-final-exam.md lines 141–148: "[CORRECT]" answer B with rationale "ribbon cable requires mass-fusion splicing — the ribbon fiber matrix must be spliced as a complete row simultaneously to maintain the fiber-matrix registration required for downstream connectorization." L3 body text correctly states ribbon cannot be "efficiently" single-fiber-spliced and notes individual splicing destroys the efficiency advantage — it does not state individual splicing is physically impossible or damages downstream connectorization. The rationale embeds a false physical constraint. Fix: rewrite rationale to focus on labor efficiency (time reduction), consistent with L3. |
| 11 | B-8 | MEDIUM | draft-debris | L8 | Option C assessment (line 192) | Mid-sentence self-correction: "72 fibers exceeds the 116-fiber minimum calculated above... actually it does not: 72 < 116" | VERIFIED | Confirmed at 08-drop-distribution-feeder.md line 192: exact text as described. The correct conclusion is "72 < 116 — insufficient" but the false claim "72 exceeds 116" appears first. Fix: delete the false claim fragment, leave only "Fiber count: 72 < 116-fiber minimum — insufficient." |
| 12 | A-6 | MEDIUM | citation | L1 | Path A assessment (lines 200–203) | Path A recommends "10GBASE-LR transceivers" for a 48 km campus link; 10GBASE-LR = 10 km max; 48 km requires ER minimum (40 km) | VERIFIED | Confirmed at 01-smf-vs-mmf.md lines 200–203: "well within the power budget of standard 10G LR transceivers (loss budget: 12.6 dB per IEEE 802.3ae)." Pulse 1 at line 328 of the same lesson correctly distinguishes LR (10 km) from ER (40 km). The 12.6 dB budget figure is the ER budget, not LR. 48 km also marginally exceeds ER (40 km) max. Fix: correct "LR" → "ER"; add note that 48 km exceeds ER and may require optical amplification. |
| 13 | B-9 | LOW | plausibility | L1 | Body text OS2 definition (line 65) | OS2 described as conforming to "G.652.D and/or G.657.A1" — G.657.A1 is bend-insensitive SMF variant, not a universal OS2 designation | VERIFIED-DOWNGRADE-CONFIRMED | Confirmed at 01-smf-vs-mmf.md line 65: "OS2 fiber conforms to ITU-T G.652.D (standard SMF) and/or G.657.A1 (macro-bend insensitive), the latter relevant for aerial routes." Key Terms block (line 123–124) correctly defines "OS2: Conforms to ITU-T G.652.D." Body text parenthetical acknowledges G.657.A1 is specifically for aerial routes. Peer-review downgrade to LOW confirmed — clarity fix warranted but not a hard factual error in context. |
| 14 | B-10 | LOW | completeness | L1 | OM4 fiber reach table (lines 73–81) | Table shows "100G reach: 100 m" for OM4 without specifying standard; 100GBASE-SR4 = 100 m correct; SR10 = 150 m not shown | VERIFIED-DOWNGRADE-CONFIRMED | Confirmed at 01-smf-vs-mmf.md lines 73–81. Table shows "100 Gbps reach: 100 m" for OM4. 100GBASE-SR4 (dominant 100G parallel-optic standard) reaches 100 m per ANSI/TIA-492AAAD. 100GBASE-SR10 reaches 150 m but is a legacy/declining standard. Peer-review downgrade to LOW confirmed — SR4 value is correct for current-generation equipment; SR10 omission is a completeness gap, not a field-error-causing plausibility trap. |
| 15 | A-7 / B-7 | LOW | pedagogy | Final Exam | Q7 (separate layer from #10) | Even after B-7 fix, distractor D ("eliminates need for fusion splicing in the field") may be a stronger correct answer than B ("faster connectorization") | VERIFIED | Confirmed as valid LOW pedagogical note. Q7 [CORRECT] answer B rationale is "faster connectorization" while distractor D says "eliminates need for fusion splicing in the field." Post-B-7 fix (rewrite rationale to labor efficiency), the distinction between B and D becomes more important to address. Fix: after B-7 HIGH fix, reassess whether B or D is the cleaner correct answer; if B retained, add rationale text that explicitly distinguishes it from D. |
| 16 | B-11 | LOW | draft-debris | Final Exam | Q13 Answer A (line 227) | Draft self-correction: "the fiber OD of 1.0 mm is greater than — wait, it is greater than the microduct OD" | VERIFIED | Confirmed at 99-final-exam.md line 227: "the fiber OD of 1.0 mm is greater than — wait, it is greater than the microduct OD." The [CORRECT] answer for Q13 is clean and correct. This error is in a distractor (Answer A) and reads as unresolved draft narration. Fix: rewrite Answer A as a clean, plausible distractor. |
| 17 | B-12 | LOW | vendor-claim | L3 | Mass-fusion body text (line ~99) | "60–80°C" matrix stripper temperature presented as universal — is a Fujikura/Fitel range; other manufacturers vary | VERIFIED | Confirmed framing is accurate — a specific temperature range is stated for matrix stripping without manufacturer qualification. Fix: add parenthetical noting "typical range for Fujikura/Fitel tools; consult manufacturer documentation." |
| 18 | B-13 | LOW | plausibility | L8 | "Express" tier reference in Option C assessment | L8 uses "express feeder" terminology not found in BICSI OSP-DRD 3-tier hierarchy; not labeled as non-standard | VERIFIED | Confirmed. L8 Option C assessment (line ~192 area) references an "express feeder" concept informally. The BICSI 4× feeder, 3× distribution, 2× drop hierarchy is correctly stated throughout. "Express feeder" as a terminology choice without a "(non-standard extension)" label creates a plausibility trap for learners citing BICSI. Fix: add "(non-standard design extension — not part of BICSI OSP-DRD hierarchy)" per B-13 suggestion. |

---

## Rejected Findings

None. All 18 peer-review findings confirmed as real. Zero false-positives identified in independent red-team review.

---

## Negative-Finding Spot-Checks

The following locations were confirmed as clean by auditors and independently re-verified:

1. **L3 mass-fusion math (Auditor A confirmed clean):** Verified at 03-ribbon-cable-mass-fusion.md. Efficiency rationale and splice loss specs (<0.1 dB typical, 0.3 dB max) are internally consistent. No issues found.

2. **L11 NEC 770.113 citations (Auditor B confirmed clean):** Verified at 11-compliance-nesc-nec-tia-bicsi.md. All Article 770 references use "770.113" correctly throughout — 10+ occurrences checked. Clean. This confirms B-5's cross-lesson scope: L7 is the only lesson using the obsolete 770.48(A) article number.

3. **L9 SC/LC/FC body text (Auditor B confirmed clean):** Verified at 09-connector-termination.md lines 47–95. SC return loss ≥50 dB (UPC) and ≥60 dB (APC) correctly stated at line 54. LC identical at line 67. APC physics, polish angle (8°), and green housing identification all correct. Clean.

4. **Final Exam Q13 [CORRECT] answer (Auditor A confirmed clean):** Verified at 99-final-exam.md lines 225–234. The [CORRECT] answer (the ABFU OD exceeds the microduct bore and cannot fit) is technically correct — 8.5 mm OD > 5.5 mm ID is unambiguous. The distractor (Answer A) contains the B-11 draft debris, but the correct answer itself is clean.

5. **L1 Key Terms OS2 definition (vs. body text conflation in B-9):** Verified at 01-smf-vs-mmf.md line 123–124. Key Terms block reads "OS2: Conforms to ITU-T G.652.D." Clean and correct. The B-9 LOW finding is isolated to the body text line 65 only.

6. **L4 burial depth table (checked for completeness of B-4 context):** Verified at 04-armored-aerial-direct-bury.md lines 74–81. Table shows 24-inch general minimum, 36-inch under roads, 48-inch under railroads. No residential-drop exception anywhere in L4. This confirms B-4's finding that L10's 18-inch residential exception is an isolated error with no standard basis.

7. **Final Exam Q17 math (Auditor A confirmed clean):** Verified at 99-final-exam.md lines 281–291. Q17 step-by-step (960 homes ÷ 32 = 30; × 4 = 120; + 6 SCADA = 126; next standard = 144-fiber) is arithmetically correct. Clean.

---

## Adjacent Observations (Outside Canonical — Not Formal Findings)

These are observations made during red-team reading that are not errors in the canonical sense but may warrant future improvement. Per hard rules, not added to the canonical list.

1. **L7 uses "NEC Article 770.1" in the first paragraph (line 40)** when citing the Article's general purpose. This is technically a citation to the scope provision, not an error, but it is the one citation in L7 that does not use the obsolete 770.48(A) — so the B-5 fix agent should be careful to update only the 770.48(A) occurrences, not this one.

2. **Final Exam Q1 rationale (line 60)** references "10GBASE-ER transceiver budget (12.6 dB per IEEE 802.3ae)" for a 22 km span. This is distinct from A-1's L1 Q1 error (which is in the lesson quiz, not the final exam). The final exam Q1 correctly names ER and its 12.6 dB budget for 22 km — confirming the final exam Q1 is clean while L1 Q1 is wrong. This is context for the fix agent: the 12.6 dB budget figure itself is correct for ER; the L1 Q1 error is specifically the wrong arithmetic (8 dB vs. 16 dB) AND the wrong transceiver name (LR vs. ER).

3. **L12 case study references RUS Bulletin 1753F-601 throughout.** Auditor B noted in coverage observations that 1753F-630 supersedes 1753F-601 for aerial/direct-buried fiber. This is a real gap — not a content error in what is written, but a missing update to a superseded reference. Not a canonical finding per pipeline rules, but flagged for future curriculum review.

---

## Fix-Agent Dispatch Readiness

### CRITICAL-tier (1 commit, ship first)
Fix items #1, #2, #3. These are the highest-consequence errors: real-world safety (frost line), exam integrity (return loss contradiction), and math error.

**#1 (B-1, L12 frost-line depth):** Fix agent MUST:
- Update `12-case-studies.md` Decision Point 3 line 102: change "30 inches minimum" to "42 inches minimum" (36-inch frost line + 6-inch code margin per B-1 fix suggestion).
- Confirm no other reference to the 30-inch depth exists in L12 case study narrative, common pitfalls, or cable specification summary.
- Check if any final exam questions reference the Case Study A burial depth — grep for "30 inch" or "30-inch" in 99-final-exam.md.

**#2 (A-3/B-2, Final Exam Q11 UPC return loss):** Fix agent MUST:
- Update `99-final-exam.md` Q11 rationale: change "~35 dB for UPC" to "≥50 dB for UPC."
- Confirm Q11 question stem (lines 197–200) does not contain the 35 dB figure — only the rationale does.

**#3 (A-1, L1 Q1 math):** Fix agent MUST:
- Update `01-smf-vs-mmf.md` Q1 rationale line 241: change "~8 dB span loss" to "~16 dB span loss."
- Update the same rationale to reflect that 16 dB exceeds the LR budget (12.6 dB) — meaning 10GBASE-LR cannot cover 40 km; the correct transceiver is 10GBASE-ER. Update any LR reference in the rationale to ER.
- Note: the 12.6 dB budget figure itself is correct for ER — do not change it. Change only the span-loss arithmetic and transceiver name.

### HIGH-tier (1 commit)
Fix items #4–#10.

**#4 (B-3, L9 MTP acronym):** Fix agent MUST:
- Update `09-connector-termination.md` Key Terms line 190–191: change "Multi-Tenancy Push-On" to "Multi-fiber Termination Push-on."
- Search for "Multi-Tenancy" across all 13 content files and the final exam — grep for "Multi-Tenancy" to confirm no other occurrence.
- Check if any quiz rationale in 99-final-exam.md references the MTP expansion — update if found.

**#5 (A-4, L9 Q3 marker):** Fix agent MUST:
- Update `09-connector-termination.md` Q3: move [CORRECT] marker from MPO-12 answer to MPO-16 answer.
- Confirm the rationale text already describes MPO-16 (16 fibers, QSFP-DD 400G SR8) — it does; only the marker needs to move.

**#6 (A-2, L10 Q6 math):** Fix agent MUST:
- Update `10-cable-selection-by-environment.md` Q6 Answer C label: change "4,015 m" to "4,058 m" (or "4,060 m" rounded).
- Delete the designer note explaining 4,015 m (it has no valid derivation).
- Update the rationale to state the correct step-by-step calculation yielding 4,058 m.

**#7 (B-4, L10 burial depth table):** Fix agent MUST:
- Update `10-cable-selection-by-environment.md` line 94 FTTH drop row: change "minimum depth 18 in. for residential drops" to "minimum depth 24 in. (610 mm)."
- Add a note: "Some municipalities permit 18 in. for conduit-enclosed residential drops; AHJ governs."

**#8 (B-5, L7 NEC article number):** Fix agent MUST:
- Update `07-sheath-fire-ratings.md`: replace all occurrences of "770.48(A)" with "770.113."
- There are 7+ occurrences — use a comprehensive search, not line-by-line editing.
- Exception: do NOT change "NEC Article 770.1" at line 40 (scope provision citation — this is correct).
- Optionally add "(formerly 770.48 in pre-2011 editions)" parenthetical on first occurrence.

**#9 (B-6/A-5, tracking-resistant threshold):** Fix agent MUST:
- Update `04-armored-aerial-direct-bury.md` line 107: change "0–69 kV range" wording so it does not imply tracking resistance is specified for all distribution voltages. Suggested: "The pole line already carries electrical distribution (0–69 kV range) — tracking-resistant sheath is prudent above 15 kV and mandated above 69 kV per IEEE 1222 §4.3."
- Update `07-sheath-fire-ratings.md` L7 Q2 rationale: add "tracking-resistant sheath is required above 69 kV (transmission class) per IEEE 1222 §4.3; below 69 kV is prudent practice but not mandated."
- L10 body text and Key Terms are already correct — do not change them.

**#10 (B-7, Final Exam Q7 wrong-reason):** Fix agent MUST:
- Update `99-final-exam.md` Q7 rationale: remove the "must be spliced as a complete row simultaneously to maintain the fiber-matrix registration required for downstream connectorization" language.
- Replace with rationale focused on labor efficiency: "Mass-fusion splicing reduces splice time by approximately 12× compared to single-fiber splicing of the same ribbon count; a 432-fiber splice requires hours with mass-fusion vs. days with single-fiber methods. Ribbon structure is preserved for the mass-fusion operation; it can be physically separated for individual splicing, but this destroys the efficiency advantage."
- After this fix, revisit #15 (A-7): confirm whether [CORRECT] answer B ("faster connectorization") or D ("eliminates need for fusion splicing in the field") is more precise. If B is retained, the rationale must explicitly explain why B is preferred over D.

### MED-tier (1 commit)
Fix items #11, #12.

**#11 (B-8, L8 Option C draft debris):** Delete fragment "72 fibers exceeds the 116-fiber minimum calculated above... actually it does not:" — leave only the correct conclusion "72 < 116-fiber minimum — insufficient."

**#12 (A-6, L1 Path A transceiver citation):** Update `01-smf-vs-mmf.md` Path A assessment lines 200–203: replace "standard 10G LR transceivers" with "10GBASE-ER transceivers (40 km, 12.6 dB budget per IEEE 802.3ae)." Add note that 48 km marginally exceeds ER budget and may require engineered optical amplification or ZR optics.

### LOW-tier (1 commit or deferral)
Fix items #13–#18.

- **#13 (B-9):** Rephrase OS2 definition in L1 body text: "OS2 conforms to ITU-T G.652.D. Bend-insensitive single-mode variants (G.657.A2, G.657.B3) are backward-compatible with OS2 infrastructure but are distinct subtypes."
- **#14 (B-10):** Add "100G standard" column note to L1 OM4 reach table showing "SR4: 100 m / SR10: 150 m."
- **#15 (A-7):** After B-7 HIGH fix, assess Q7 B vs. D distractor. If B retained, strengthen rationale to distinguish it from D explicitly.
- **#16 (B-11):** Rewrite Final Exam Q13 Answer A as a clean plausible distractor without the self-correction fragment.
- **#17 (B-12):** Add manufacturer qualification to L3 matrix stripper temperature range: "(typical range for Fujikura/Fitel tools; consult manufacturer documentation)."
- **#18 (B-13):** Add "(non-standard design extension — not part of BICSI OSP-DRD hierarchy)" to L8 "express feeder" reference.

---

## Final Disposition Summary

- **CRITICAL: 3** (B-1, A-3/B-2, A-1)
- **HIGH: 7** (B-3, A-4, A-2, B-4, B-5, B-6/A-5, B-7)
- **MEDIUM: 2** (B-8, A-6)
- **LOW: 6** (B-9, B-10, A-7, B-11, B-12, B-13)
- **Total canonical: 18**
- **Rejected (false-positives): 0**
- **Peer-review downgrades confirmed: 2** (B-9 MED→LOW, B-10 MED→LOW)

=== CABLE SELECTION CANONICAL END ===
