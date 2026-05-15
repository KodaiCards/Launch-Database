# T18 Lessons RT-B — Technical Accuracy Framing

**Verifier:** RT-B Technical Accuracy  
**Scope:** T18 L01–L10 (10 lesson files + capstone)  
**Branch:** main  
**Date:** 2026-05-15

---

## Verdict

**YELLOW** — 2 findings (1 LOW-MEDIUM, 1 LOW). Core technical content is accurate: all quiz answers independently verified correct, MAD lesson passes the critical check, OSHA citation structure is sound, LOTO sequence matches 1910.147(d), confined space gap correctly stated. Two imprecisions identified — one citation attribution (L03 LEL threshold) and one formula approximation caveat that may need reinforcement. No fabricated section numbers detected across spot-check. No cross-lesson contradictions.

---

## Per-Lesson Grade Matrix

| Lesson | Title | Citation Grade | Quiz Grade | Numerical Grade | Overall |
|--------|-------|---------------|-----------|----------------|---------|
| L01 | Hazard Awareness & Risk Hierarchy | A | A | A | **PASS** |
| L02 | Lockout/Tagout (LOTO) | A | A | A | **PASS** |
| L03 | Confined Space Entry | B+ | A | A | **PASS w/ note** |
| L04 | Fall Protection — Poles & Aerial Lifts | A | A | A | **PASS** |
| L05 | PPE — Hands, Head, Eyes, Feet | A | A | A | **PASS** |
| L06 | Traffic Control & Flagging | A | A | B+ | **PASS w/ note** |
| L07 | Working Near Energized Conductors | A | A | A | **PASS** |
| L08 | Hazardous Materials in OSP Work | A | A | A | **PASS** |
| L09 | Incident Reporting & OSHA 300 | A | A | A | **PASS** |
| L10 | T18 Capstone Quiz | A | A | A | **PASS** |

---

## Citation Spot-Check Table (10 Random Samples)

| # | Lesson | Citation | Claimed Topic | Status |
|---|--------|----------|--------------|--------|
| 1 | L01 | 29 CFR 1910.268 (Subpart R) | Primary telecom field safety standard | VERIFIED — Subpart R covers telecommunications operations |
| 2 | L01 | OSH Act §5(a)(1) | General Duty Clause | VERIFIED — General Duty Clause location confirmed |
| 3 | L02 | 1910.147(d)(1)–(d)(6) | LOTO 6-step sequence | VERIFIED — sequence matches standard's procedures |
| 4 | L02 | 1910.147(f)(3) | Group lockout/tagout | VERIFIED — each authorized employee applies own lock |
| 5 | L03 | 1910.268(o)(2) | Atmospheric testing for telecom manholes | VERIFIED — telecom-specific confined space entry |
| 6 | L04 | 1910.268(g)(1) | >4 ft fall protection trigger on poles | VERIFIED — general industry standard (vs. construction 6 ft) |
| 7 | L04 | 1910.67(c)(2)(v) | Aerial lift PFAS attached to boom/basket | VERIFIED — attachment point requirement confirmed |
| 8 | L07 | 1910.269(l)(2) + Appendix B | MAD via OSHA Calculator (post-2014) | VERIFIED — 2014 rule replaced static table with per-voltage formula |
| 9 | L08 | 29 CFR 1910.1053 | Crystalline silica PEL = 50 µg/m³ TWA | VERIFIED — 2016 rule; correctly distinguishes from old 100 µg/m³ |
| 10 | L09 | 1904.39 | Severe incident reporting timelines | VERIFIED — fatality 8 hr; hospitalization/amputation/eye loss 24 hr |

**Primary-source web verification:** All OSHA.gov, eCFR, and law.cornell.edu URLs returned HTTP 403 Forbidden during WebFetch attempts. Verification conducted via: (a) T18_RESEARCH_BRIEF.md pre-verification table (Citations C1–C18); (b) independent regulatory subject-matter analysis. Where the brief marked "VERIFIED" against primary source, lessons citing the same section are corroborated.

---

## Quiz Answer Re-Derivation Results

### Per-Lesson Quizzes (representative sample — all independently re-derived)

| Lesson | Q# | Claimed Correct | Independent Derivation | Match? |
|--------|-----|----------------|----------------------|--------|
| L01 | Q1 | Elimination (index 2) | H₂S hazard → rescheduling = Elimination per NIOSH hierarchy | ✓ |
| L01 | Q2 | General Duty Clause (index 2) | OSH Act §5(a)(1) — yes, covers residual hazards | ✓ |
| L02 | Q1 | Each worker applies own lock (index 1) | 1910.147(f)(3) group LOTO = individual locks on hasp | ✓ |
| L02 | Q3 | NOT subject to LOTO (fiber splicing, separate room) | 1910.147(a)(1) scope: task-specific; splicing in adjacent room = not in scope | ✓ |
| L03 | Q1 | 1910.268(o) governs routine telecom manhole (index 1) | OSHA 1993 interpretation letter confirms supersession | ✓ |
| L03 | Q2 | LEL 18% → must ventilate (index 1) | 18% > 10% action threshold; lesson's practical guidance is safe | ✓ |
| L04 | Q1 | >4 feet triggers fall protection (index 2) | 1910.268(g)(1) — general industry standard confirmed | ✓ |
| L04 | Q2 | Gaff pullout + positioning strap only = NOT caught | Positioning system ≠ fall arrest; PFAS needed for arrest | ✓ |
| L05 | Q1 | 7,200V → Class 1 glove (index 2) | Class 1 = ≤7,500V; 7,200V falls within range | ✓ |
| L06 | Q1 | Class 2 hi-vis for daytime roadway (index 1) | ANSI/ISEA 107: Class 2 = daytime roadway minimum | ✓ |
| L07 | Q1 | 18 in at 14.4 kV = inside MAD → STOP (index 2) | MAD ≈ 2 ft at 14.4 kV; 18 in < 2 ft = violation | ✓ |
| L07 | Q2 | MAD = Appendix B + OSHA Calculator (index 1) | 1910.269(l)(2) + App B method confirmed | ✓ |
| L08 | Q2 | Silica PEL = 50 µg/m³ (index 1) | 29 CFR 1910.1053 (2016): 50 µg/m³ confirmed | ✓ |
| L09 | Q1 | Bandage = first aid = not recordable (index 1) | 1904.7(a) first-aid list; bandaging explicitly listed | ✓ |
| L09 | Q2 | Hospitalization = 24-hour report (index 1) | 1904.39: hospitalization = 24 hr confirmed | ✓ |

### Capstone L10 — All 22 MC + 2 Scenario Outcomes

**Result: ALL 22 MC ANSWERS VERIFIED CORRECT. Both scenario outcomes verified correct.**

Key independently re-derived answers:
- Q5 (hard hat Class E): Class E = 20,000V per ANSI Z89.1 → answer index 1 ✓
- Q7 (1910.268 vs 1910.269 applicability): 1910.269 applies to telecom on joint-use structures ✓
- Q11 (OSHA 300 posting period Feb 1–Apr 30): Correct per 1904.32 ✓
- Q14 (Class 2 glove max voltage): ≤17,000V per ASTM D120 ✓
- Q18 (taper formula L=W×S/60): Standard MUTCD formula for approach speeds >45 mph ✓
- Q22 (General Duty Clause): OSH Act §5(a)(1) ✓

Scenario 1 (manhole entry): Correct decision tree — TC setup → atmospheric test → LEL alarm = immediate exit. Correctly maps to L03 + L06 cross-lesson integration.

Scenario 2 (incident classification): Event 2 (Rx + restricted duty) = recordable + DART correctly derived from 1904.7; Event 4 (hospitalization) = 24-hr 1904.39 report correctly derived. ✓

---

## Findings

### FINDING 1 — LOW-MEDIUM
**Location:** L03, Confined Space Entry — atmospheric table + BranchingScenario attribution  
**Issue:** The lesson attributes the "10% LEL action threshold" to 29 CFR 1910.268(o)(2)(ii)(B). However, 1910.268(o)(2) requires ventilation when combustible gas "is present" (any level), not specifically above 10% LEL. The 10% action level originates from 1910.146 practice and ANSI/ASSE Z117.1. Attribution of the specific "10% LEL" threshold to 1910.268(o)(2)(ii)(B) is imprecise; the lesson's practical guidance (ventilate at any combustible reading; do not enter above 25% LEL) is safe and correct. The attribution in the BranchingScenario ("per 1910.268(o)(2)") could mislead learners who look up the cited section and don't find the specific percentage.  
**Fix shape:** Either (a) attribute the 10% threshold to ANSI/ASSE Z117.1 / industry practice rather than to 1910.268(o)(2)(ii)(B), or (b) rephrase as "industry action level" with the note that 1910.268(o)(2) requires ventilation when combustibles are detected at any level. Keep the safe practical guidance unchanged.

### FINDING 2 — LOW
**Location:** L07, Working Near Energized Conductors — WorkedExample formula  
**Issue:** The simplified WorkedExample formula `Math.max(1.9, 1.9 + 0.022 * voltageKV)` is labeled as a "simplified linear interpolation for teaching purposes" with a direction to use the actual OSHA MAD Calculator. At 14.4 kV the formula yields ≈ 2.22 ft; the OSHA Calculator outputs are not perfectly linear, and the formula's accuracy varies by voltage range. The approximation is safe (it is slightly conservative vs. actual MAD at some ranges), but the caveat ("use the official OSHA calculator for actual field work") could be more prominently placed — it currently appears at the bottom of the WorkedExample. No safety violation because MAD ≈ 2.22 ft is greater than the actual ≈ 2 ft 1–2 in, erring on the side of caution.  
**Fix shape:** Move the "use the official OSHA MAD Calculator for all real field decisions" disclaimer to immediately after the formula display (before the user input), not just at the end of the example output.

---

## Negative Findings (Confirmed Clean)

- **MAD critical check:** L07 correctly uses the Appendix B / OSHA MAD Calculator approach. No static "1–15 kV = 2 ft 2 in" table found. PASSES the critical check per dispatch prompt.
- **LOTO sequence:** L02's 6-step sequence and re-energization order accurately match 1910.147(d) and (e). No steps inverted or omitted.
- **1910.268(o) vs. 1910.146 gap:** L03 correctly states 1910.268(o) supersedes 1910.146 for routine telecom manhole work per the 1993 OSHA interpretation letter; 1910.146 PRCS applies when hazard cannot be controlled under 1910.268(o)(2).
- **Silica PEL:** L08 correctly states 50 µg/m³ (2016 rule) and explicitly distinguishes from the old 100 µg/m³. Not a stale citation.
- **OSHA 300 reporting timelines:** L09 correctly states fatality = 8 hours, hospitalization/amputation/eye loss = 24 hours per 1904.39, and correctly notes the rule applies to ALL employers regardless of size.
- **≤10 employee exemption:** L09 correctly notes that small employers are exempt from routine 300 log-keeping but NOT from 1904.39 severe-incident reporting.
- **Glove class table (L05):** Class 00 through Class 4 voltage limits match ASTM D120 / 1910.137.
- **Fall protection trigger (L04):** >4 feet on poles per 1910.268(g)(1) correctly stated. Correctly distinguishes from construction's 6-foot trigger.
- **Aerial lift attachment (L04):** PFAS/travel restraint to boom or basket (not external structure) per 1910.67(c)(2)(v) correctly stated.
- **GHS 16-section SDS format (L01, L08):** HazCom 2012 (29 CFR 1910.1200) adoption of GHS correctly stated.
- **No cross-lesson contradictions detected** across all 10 lessons on shared topics (fall protection, LOTO scope, confined space entry, PPE selection).
- **No fabricated section numbers detected** in 10-citation spot-check.
- **Capstone MC:** All 22 questions independently re-derived. All correct.

---

## Coverage Gaps

- **Live primary-source web verification was not possible.** All eCFR, OSHA.gov, law.cornell.edu, and federalregister.gov URLs returned HTTP 403 Forbidden during WebFetch. Verification relied on: (a) T18_RESEARCH_BRIEF.md citation table (C1–C18, pre-verified against primary sources); (b) independent regulatory subject-matter analysis. This is a limitation of the verification method, not a gap in the lessons themselves.
- **Paywalled standards (ANSI Z89.1, ASTM D120, ASTM F2412/F2413, ANSI/ISEA 107):** Verified via ≥2 independent secondary sources consistent with research brief methodology. Direct primary-source text not accessible.
- **MUTCD Table 6C-1 advance warning spacing values (L06):** Approximate values (100–350 ft urban, ~500 ft rural, 1,000+ ft expressway) are directionally correct but could not be confirmed to the decimal against Table 6C-1 live. No contradicting evidence found.
- **OSHA 1993 interpretation letter (L03):** Existence confirmed via research brief citation. WebFetch 403 prevented live verification of full letter text.

---

=== T18 LESSON RT-B TECHNICAL END ===
