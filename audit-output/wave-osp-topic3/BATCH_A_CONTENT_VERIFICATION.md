# OSP Topic 3 Batch A — Content Verification Report

**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14
**Scope:** Lessons 3.1–3.4 (Pre-Survey Desk Research, Field Survey Methodology, NESC Clearances + ROW, Aerial Route Design)
**Verifier:** Content Verification Red-Team

---

## Stack Snapshot

Four lessons covering OSP survey and aerial route design. Lessons 3.1–3.3 are largely text + scenario + quiz; L3.4 carries the heaviest math load (sag-tension parabolic formula, worked examples, vector resultant). One confirmed math/tagging error found in L3.4 Q2: the `[CORRECT]` tag is applied to a wrong answer option (5.1 ft), and the correct value (6.125 ft) is absent from the option set entirely. Everything else in the math chain verified independently. RUS coverage strong across all four lessons.

---

## Findings Table

| # | Severity | Category | File | Line Range | Snippet | Issue | Fix Shape | Confidence |
|---|---|---|---|---|---|---|---|---|
| 1 | HIGH | Math / Answer Tagging | `04-aerial-route-design.md` | L279–289 | `- B) 5.1 ft **[CORRECT]**` / rationale: `= 6.125 ft ≈ 6.1 ft. The closest answer option to 6.1 ft is 5.1 ft` | `[CORRECT]` tag is on 5.1 ft but formula gives 6.125 ft; correct value is not in the option set at all | Reconstruct all four distractors using w=0.180, L=350, H=450; correct answer = 6.1 ft (6.125 ft); remove platform build note from published lesson | HIGH |
| 2 | MEDIUM | Rationale Coherence | `04-aerial-route-design.md` | L284–285 | `≈ 6.1 ft ÷ 2.5... Let the correct derivation show the error:` | Option A rationale starts the correct formula calculation then appends `÷ 2.5` which is unexplained and nonsensical; text breaks off mid-sentence | Remove the garbled `÷ 2.5` fragment; complete the rationale explaining WHY 2.4 ft is wrong (it comes from a formula error, state what the error is) | HIGH |
| 3 | MEDIUM | Internal Consistency | `04-aerial-route-design.md` | L86, L101 | `EDS ≤ 20–25% RTS` (body) vs. `EDS at 59°F: 18% RTS` (worked example) | Body text states IEEE 1222 recommends EDS 20–25% RTS; worked example uses 18% EDS which falls below the stated lower bound of the recommendation — inconsistent and potentially confusing to learners applying the example | Change worked example EDS to 20% (H = 20% × 2800 = 560 lb) OR add a parenthetical note in the worked example clarifying that 18% is a conservative design choice below the typical recommendation range | MEDIUM |
| 4 | LOW | Platform Build Note Exposure | `04-aerial-route-design.md` | L289 | `*(Platform build note: reconstruct all four answer options...)*` | Platform build note (item #1 above) is still present in lesson source; should not appear in published lesson content | Remove after option set is reconstructed | HIGH |

---

## Negative Findings — Lessons Checked Clean

**L3.1 Pre-Survey Desk Research:**
- Q1–Q4 answer logic verified: NWI flagging (Q1), parcel GIS accuracy ±5–50 ft (Q2), 811 mandatory regardless of atlas (Q3), dielectric armor for corrosive soil (Q4) — all rationales internally consistent.
- Pulse 1 and Pulse 2 expected answers verified against lesson body.
- Citation plausibility: ANSI/TIA-758-C §5.6.2 for armor selection plausible; BICSI OSP-DRD Ch. 3 for GIS accuracy plausible; FHWA for 811 requirement plausible.
- No CAD/GIS platform canonization (platform-neutral, appropriate for this lesson type).
- RUS Bulletin 1751F-630 §2 cited correctly for pre-construction planning mandate.

**L3.2 Field Survey Methodology:**
- Station notation Q1: 23+45 = 2,345 ft, 12 ft left — correct interpretation.
- Reconnaissance vs. design survey scenario: logic and priority set verified as internally consistent.
- Q2 (811 gas marking), Q3 (drainage ditch) rationales verified correct.
- Pulse 2 (utility at 31+20, 5 ft RT, 36 in depth vs. atlas 30 in): characterization as potential conflict requiring depth investigation is reasonable and appropriately conservative for training.
- APWA Uniform Color Code for 811 markings (body text and flashcard) matches standard.
- RUS Bulletin 1751F-630 §3 cited correctly for field survey requirements.

**L3.3 NESC Clearances + ROW:**
- Q1 math: 30 − 12.8 = 17.2 ft vs. 15.5 ft minimum — VERIFIED CORRECT.
- Q2 (7.2 kV joint-use, 16 in clearance): 7.2 kV < 8.7 kV → 12 in minimum applies; 16 in > 12 in — VERIFIED COMPLIANT.
- Q3 (navigable waterway): NESC Rule 234 / USACE standard — correctly identified.
- Q4 (1987 electric easement vs. telecom fiber): analysis and correct answer verified consistent with RUS Bulletin 1751F-630 §4.
- Drag-and-drop matching: A→1, D→2, C→3, E→4, B→5 — all five pairs verified correct against NESC rules in body text.
- Pulse 1 (non-level span chord method): (29+27)/2 = 28 ft chord; 28 − 10.3 = 17.7 ft > 15.5 ft — VERIFIED CORRECT.
- Pulse 2 (easement vs. joint-use): distinction and NESC Rule 238 citation verified consistent with body text.
- Non-navigable water clearance: 15 ft = 4.57 m — conversion correct.
- Fee-simple ROW / utility easement / joint-use agreement distinctions verified internally consistent.

**L3.4 Aerial Route Design (math verified except Q2):**
- Worked example L_max: √(8 × 504 × 12.5 / 0.292) = √172,603 ≈ 415 ft — VERIFIED CORRECT.
- Worked example table step: 28 − 11.8 = 16.2 ft clearance — VERIFIED CORRECT.
- Pulse 2: S_max = 14.5 ft; √(8 × 500 × 14.5 / 0.25) = √232,000 ≈ 481 ft — VERIFIED CORRECT (exactly as BATCH_A_REPORT sample question states).
- Scenario: S_max = 9.5 ft; 350 ft span sag 9.4 ft < 9.5 ft → passes; clearance = 15.6 ft, margin = 0.1 ft — VERIFIED CORRECT; recommendation to use 300 ft for margin is sound engineering practice.
- Q3 vector resultant: √(380² + 380²) = √288,800 = 537 lb at 90° corner — VERIFIED CORRECT.
- Q4: 26 − 13.8 = 12.2 ft; 12.0 ft minimum over non-vehicle-accessible land per Rule 232 Table 232-1 — VERIFIED CORRECT.
- Q5 (tension vs. sag relationship): S = wL²/(8H) formula; inverse relationship to H — VERIFIED CORRECT.
- Q1 (final vs. initial sag): creep rationale consistent with IEEE 1222 §5.2 discussion in body.
- NESC loading district table (Light/Medium/Heavy ice and wind values) internally consistent with worked example.
- Guy wire requirements (dead-end back-guy, corner bisector-guy) consistent with pole loading body text.
- NESC Grade C construction for communication conductors — consistent with body text and citation.
- RUS 1715E-110 for joint-use pole loading — plausible citation.
- Cross-reference to L3.3 for communication space and Rule 238 — consistent.

**Cross-lesson consistency (L3.1–3.4):**
- Midspan clearance formula used identically in L3.3 and L3.4.
- NESC 15.5 ft road minimum and 12.0 ft non-vehicle minimum consistent across L3.3 and L3.4.
- 811 notification treatment consistent between L3.1 and L3.2.
- Forward cross-references (L3.3→L3.4 for sag-tension; L3.4→L3.3 for communication space) are consistent.
- No contradictions found across all four lessons.

**CAD/GIS neutrality:** All four lessons are platform-neutral — neither AutoCAD/Civil 3D nor ArcGIS is canonized or excluded. GIS is referenced generically. Appropriate for survey/methodology lessons.

**RUS appropriateness:** Strong coverage in all four lessons (1751F-630 §2, §3, §4; 1715E-110). User office is RUS-heavy; these lessons are well-suited.

---

## Coverage Gaps

- **NESC standard text not available:** Cannot verify that specific Rule 232/234/238 table values (15.5 ft, 26.5 ft railroad, 12 in/24 in horizontal clearances) exactly match NESC C2-2023 text. Values are internally consistent and consistent with known industry practice, but direct standard-text confirmation is outside scope per prompt instructions.
- **BICSI OSP-DRD chapter/section numbers** not independently verifiable without the manual. Citations are structurally plausible.
- **RUS Bulletin section numbers** (1751F-630 §2, §3, §4; 1715E-110) cited consistently; section assignments (§2=pre-construction, §3=field survey, §4=ROW) are plausible but not verified against document text.
- **L3.2 Q2 distractor D** cites ANSI/TIA-758-C §6.3 for burial depth minimums in a wrong-answer rationale — plausibility not verified, but cited only to correct a distractor, not as a primary source.

=== TOPIC 3 BATCH A CONTENT VERIFICATION END ===
