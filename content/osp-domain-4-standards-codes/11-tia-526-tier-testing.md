---
title: "Lesson 4.11: ANSI/TIA-526 — Tier 1 vs. Tier 2 Testing"
slug: l4-11-tia-526-tier-testing
duration_min: 25
topic: osp-domain-4-standards-codes
order: 11
bicsi_alignment:
  - "OSP-DRD Ch. 9.1: Tier 1 and Tier 2 optical testing standards and methodology"
sources:
  - "ANSI/TIA-526-14 [confirm edition before publication] — SM OLTS (optical loss test set)"
  - "ANSI/TIA-526-7 — MM OLTS + OTDR methodology"
  - "ANSI/TIA-455 FOTP series (fiber optic test procedures); FOTP-61 = OTDR test method (TIA-455-61)"
  - "IEC 61300-3-4 (attenuation measurement by backscatter — OTDR method)"
  - "BICSI OSP-DRD Manual, Ch. 9.1"
  - "RUS Bulletin 1751F-630 §9 (acceptance testing requirements)"
---

# ANSI/TIA-526 — Tier 1 vs. Tier 2 Testing

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the difference between Tier 1 (insertion loss / OLTS) and Tier 2 (OTDR-based) testing and identify what each tier measures
- Apply the tier selection criteria (plant length, splice count, project type, and RUS vs. non-RUS funding) to choose the correct tier for a given project
- Identify the governing standard for each tier — TIA-526-14 [confirm edition] for SM OLTS, TIA-526-7 for MM OLTS, and TIA-455-61 (FOTP-61) as the parent OTDR test procedure
- Explain why TIA-455-61 (FOTP-61) and IEC 61300-3-4 serve complementary but distinct roles in OSP OTDR testing

---

## Reading Content

### The Two-Tier Testing Framework

The TIA-526 series defines two levels of fiber optic cable plant testing, commonly called **Tier 1** and **Tier 2**. The distinction is fundamental: Tier 1 measures whether the installed cable plant passes the optical loss budget; Tier 2 goes further, characterizing each event (splice, connector, span) along the length of the fiber with spatial precision.

Both tiers are **standard structure and tier criteria** topics. The actual execution of each test — equipment calibration, launch cable requirements, bidirectional averaging, trace interpretation — is T2 material (see T2 L2.10/L2.11 cross-reference). This lesson covers what each tier measures, what standard governs it, and how to choose between them. [BICSI OSP-DRD Manual, Ch. 9.1]

### Tier 1: Insertion Loss (OLTS)

**What it measures:** End-to-end optical power loss across the cable plant, from one end to the other, using an **Optical Loss Test Set (OLTS)**. The OLTS injects a known optical power level at one end and measures the received power at the far end; the difference is the total insertion loss (IL) for that fiber in dB.

**What it does not measure:** Tier 1 does not tell you *where* a problem is along the cable. A total loss of 4.5 dB could mean one bad splice (3 dB) and one bad connector (1.5 dB), or it could mean 4.5 dB spread across many small events. Tier 1 is pass/fail against the link loss budget — it confirms the cable plant is usable, not where it is good or bad. [BICSI OSP-DRD Manual, Ch. 9.1]

**Governing standard for SM (single-mode):** ANSI/TIA-526-14 [confirm edition before publication]. Note: this placeholder applies throughout this lesson. As of this authoring, TIA-526-14 is the current SM OLTS standard; the exact edition suffix (-A, -B, or -C) is unconfirmed and is subject to revision. Do NOT use this lesson to cite a specific suffix until confirmed; perform a global update when the edition is verified. [ANSI/TIA-526-14 (confirm edition); T2 L2.11 cross-reference]

**Governing standard for MM (multi-mode):** ANSI/TIA-526-7. Covers OLTS testing of multi-mode fiber cable plants with proper launch conditions (mandrel wrap or encircled flux source). [ANSI/TIA-526-7]

**Tier 1 is sufficient when:**
- The cable plant is a short, simple link (e.g., campus backbone, data-center horizontal, short intra-building run)
- No splices — only connectors
- Pass/fail against the loss budget is the only required deliverable
- The project does not require splice-level documentation for RUS or other regulatory close-out

### Tier 2: OTDR (Optical Time-Domain Reflectometer)

**What it measures:** The spatial distribution of optical loss along the fiber — every connector, every splice, every anomaly, plotted as loss vs. distance. An OTDR injects a pulse and measures the returning backscatter signal over time; since the propagation speed in glass is known, time maps to distance. The result is a trace showing the exact location and loss contribution of every event. [ANSI/TIA-455-61 (FOTP-61); IEC 61300-3-4; BICSI OSP-DRD Manual, Ch. 9.1]

**What it provides beyond Tier 1:**
- Locate the position of every splice, connector, and bend event to within a few meters
- Measure per-splice and per-connector loss individually
- Detect breaks, high-loss events, and reflective anomalies not visible from end-to-end loss
- Provide documentary evidence (trace files) for splice records, as-built documentation, and warranty

**Parent test procedure — FOTP-61:** The underlying OTDR measurement methodology is defined by TIA-455-61 (also known as FOTP-61 — Fiber Optic Test Procedure 61). This is the parent procedure for OTDR testing within the TIA-455 FOTP series. TIA-526-14 [confirm edition] and TIA-526-7 incorporate FOTP-61 by reference for their OTDR provisions — when an OTDR-based test is required under TIA-526-14 or TIA-526-7, FOTP-61 is the governing measurement procedure. [ANSI/TIA-455-61; BICSI OSP-DRD Manual, Ch. 9.1]

**IEC 61300-3-4 role:** IEC 61300-3-4 covers attenuation measurement by the OTDR backscatter method, providing the international standard framework parallel to FOTP-61. IEC 61300-3-4 and FOTP-61 are complementary, not redundant: projects with international specifications or vendor equipment certified to IEC standards may reference IEC 61300-3-4; North American TIA-compliant cable plant testing uses FOTP-61. Cross-validation between FOTP-61 and IEC 61300-3-4 results is possible but requires awareness that test conditions (pulse width, averaging, launch conditions) must match. Do not assume IEC 61300-3-4 certification of an OTDR means the results are identical to a FOTP-61 test under all conditions. [IEC 61300-3-4; ANSI/TIA-455-61]

### Tier Selection Criteria

The following decision tree guides tier selection. Apply the most demanding criterion that applies:

**Tier 2 is required when:**
1. **Splice count > 0** on the cable plant being tested — every splice must be individually characterized by OTDR to confirm it meets the per-splice loss limit (typically ≤ 0.1 dB for fusion splices on RUS projects per 1751F-630 §9)
2. **Plant length > campus scale** — for OSP backbone plants (>1 km), OTDR characterization is standard practice regardless of splice count
3. **RUS-funded project** — RUS Bulletin 1751F-630 §9 requires OTDR traces as part of the close-out documentation package; Tier 1 alone does not satisfy the RUS close-out requirement
4. **Fault isolation is required** — if the cable plant must demonstrate event-level performance (warranty documentation, dispute resolution, or future maintenance)

**Tier 1 is sufficient when:**
- Short, connector-only links (patch cords, cross-connects, short building-to-building runs under ~500 m with no splices)
- No regulatory close-out requirement for splice-level documentation
- Campus OM3/OM4 horizontal cabling under TIA-568.3-D where the only required deliverable is pass/fail against the link loss budget

### Worked Decision-Tree Example: Three Project Types

**Scenario A — Campus OM3 horizontal link:**
- Route: 80 m, 2 connectors, no splices, OM3 multi-mode
- Governing standard: ANSI/TIA-526-7 (multi-mode OLTS)
- Tier selection: **Tier 1** — short campus link, no splices, no RUS funding, pass/fail loss budget only
- Rationale: OTDR at 80 m on OM3 provides limited spatial resolution; Tier 1 OLTS under TIA-526-7 is the correct and sufficient test

**Scenario B — Rural RUS SM backbone, 22 km, 14 splices:**
- Route: 22 km OS2 single-mode, 14 fusion splices, 2 connectors at each end
- Governing standard: ANSI/TIA-526-14 [confirm edition] (SM OLTS); ANSI/TIA-455-61 FOTP-61 (OTDR)
- Tier selection: **Tier 2** — splice count > 0 (14 splices require individual OTDR characterization), plant length > campus scale (22 km is a full OSP backbone), and RUS-funded (1751F-630 §9 OTDR close-out required)
- Rationale: All three Tier 2 triggers are present. OTDR bidirectional traces (forward + reverse pass, then average per FOTP-61) for all 14 splices; Tier 1 OLTS end-to-end for the total loss budget. Both tiers are used together on a backbone plant — Tier 1 confirms total budget; Tier 2 characterizes each event.

**Scenario C — MDU (multi-dwelling unit) riser SM link:**
- Route: 350 m OS2 single-mode, 1 connector at the cable-to-pigtail junction, no fusion splices
- Governing standard: ANSI/TIA-526-14 [confirm edition] (SM OLTS)
- Tier selection: **Tier 1** — short link, no fusion splices, no RUS funding, connector performance verified by IL/RL measurement per TIA-568.3-D Table 5

### Summary: Tier vs. Standard Matrix

| Test | Tier | Governing standard | Fiber type |
|---|---|---|---|
| Optical loss (end-to-end IL) | 1 | TIA-526-14 [confirm edition] | SM |
| Optical loss (end-to-end IL) | 1 | TIA-526-7 | MM |
| OTDR characterization | 2 | TIA-455-61 (FOTP-61) + TIA-526-14 | SM |
| OTDR characterization | 2 | TIA-455-61 (FOTP-61) + TIA-526-7 | MM |
| IEC OTDR alternative | 2 | IEC 61300-3-4 | Both |

### Edition Placeholder Note

Throughout this lesson, "ANSI/TIA-526-14 [confirm edition before publication]" is used in place of a suffix (-B or -C or other). This placeholder is intentional per the authoring brief (Default #1). Before publishing this lesson in Moodle, the edition must be confirmed and replaced globally. T2 L2.11 uses "TIA-526-14" without a suffix — the update should be applied to both lessons simultaneously to prevent cross-topic citation drift. [T4 Brief, Default #1]

---

## Key Terms (Flashcard Candidates)

**Tier 1 testing**
Optical loss test using an OLTS (optical loss test set). Measures end-to-end insertion loss only — pass/fail against the link loss budget. Does not characterize individual events. Governing standard: TIA-526-14 [confirm edition] (SM); TIA-526-7 (MM). Sufficient for short connector-only links; required as a component of every cable plant acceptance regardless of tier. [BICSI OSP-DRD Manual, Ch. 9.1]

**Tier 2 testing**
OTDR-based testing that characterizes individual splice, connector, and anomaly events along the cable by spatial position and loss contribution. Required when splice count > 0, plant length > campus scale, or RUS close-out documentation is required. Parent test procedure: TIA-455-61 (FOTP-61). [BICSI OSP-DRD Manual, Ch. 9.1; ANSI/TIA-455-61]

**ANSI/TIA-526-14 [confirm edition]**
The governing standard for SM (single-mode) OLTS testing under the TIA-526 series. Covers test method, launch conditions, bidirectional averaging requirements, and acceptance thresholds for SM cable plants. Edition suffix unconfirmed — use placeholder until verified. [ANSI/TIA-526-14; T4 Brief Default #1]

**ANSI/TIA-526-7**
The governing standard for MM (multi-mode) OLTS and OTDR testing. Covers both Tier 1 and Tier 2 methodology for multi-mode cable plants. Uses encircled flux launch conditions for laser-optimized OM3/OM4/OM5 cable. [ANSI/TIA-526-7]

**FOTP-61 (TIA-455-61)**
Fiber Optic Test Procedure 61: the parent OTDR measurement procedure within the TIA-455 FOTP series. Referenced by both TIA-526-14 [confirm edition] and TIA-526-7 for OTDR-based testing. Defines pulse width selection, launch cable requirements, averaging, and event analysis. Prevents conflation with TIA-526-14 (the acceptance standard) vs. TIA-455-61 (the measurement procedure). [ANSI/TIA-455-61]

**IEC 61300-3-4**
International standard for attenuation measurement by the OTDR backscatter method. The IEC parallel to FOTP-61. Cited for cross-validation of OTDR equipment certified to IEC standards; not interchangeable with FOTP-61 without confirming matching test conditions. [IEC 61300-3-4]

**OLTS (optical loss test set)**
Test instrument used for Tier 1 testing. Consists of a stable optical light source (calibrated power output) and an optical power meter (calibrated power measurement). Reports end-to-end insertion loss in dB. Mandrel wrap or encircled flux source required for MM testing to control launch condition. [ANSI/TIA-526-14; ANSI/TIA-526-7]

---

## Interactive: Scenario — Tier Selection for Three Project Types

**[image:tier-selection-decision-tree.svg]**

*Image description for SVG illustrator:*

A three-branch decision tree diagram. The trunk question: "Does the cable plant have splices, span > campus scale, or RUS funding?" Left branch (YES → Tier 2): lists three triggers with checkboxes. Right branch (NO → Tier 1): lists three conditions.

Each branch ends in a project-type card:

- Tier 2 card: "Rural RUS SM backbone — 22 km, 14 splices → TIA-526-14 [confirm edition] + FOTP-61"
- Tier 1 card (short): "Campus OM3 horizontal — 80 m, no splices → TIA-526-7"
- Tier 1 card (MDU): "MDU riser SM — 350 m, no splices → TIA-526-14 [confirm edition]"

**Learning mechanic:** Learner reads three project descriptions and drags each to the correct Tier 1 or Tier 2 branch.

---

## Multiple-Choice Quiz

---

**Q1.** A rural OSP backbone consists of 22 km of OS2 single-mode cable with 14 fusion splices and RUS funding. Which tier of testing is required, and what standard governs the OTDR characterization?

- A) Tier 1 only; TIA-526-14 [confirm edition] OLTS end-to-end
- B) Tier 2 required; OTDR characterization per ANSI/TIA-455-61 (FOTP-61), incorporating TIA-526-14 [confirm edition] acceptance thresholds **[CORRECT]**
- C) Tier 2 required; IEC 61300-3-4 governs on RUS-funded projects
- D) Tier 1 required; TIA-526-7 governs all SM cable plants

*Rationale:*
- **A — Incorrect.** This project triggers all three Tier 2 criteria: splice count > 0 (14 fusion splices must be individually characterized), plant length > campus scale (22 km), and RUS funding (1751F-630 §9 requires OTDR traces in the close-out package). Tier 1 OLTS alone does not satisfy any of these requirements for event-level documentation. [BICSI OSP-DRD Manual, Ch. 9.1; RUS Bulletin 1751F-630 §9]
- **B — Correct.** Tier 2 (OTDR) is required on all three criteria. The OTDR measurement procedure is ANSI/TIA-455-61 (FOTP-61); the acceptance thresholds for SM cable plants are in ANSI/TIA-526-14 [confirm edition]. On RUS-funded OSP backbone plants, OTDR bidirectional traces for all splices are required for the close-out documentation package per RUS Bulletin 1751F-630 §9. Tier 1 OLTS is also performed as part of the complete acceptance process (end-to-end budget confirmation), but Tier 2 is the additional required component. [ANSI/TIA-455-61; ANSI/TIA-526-14; RUS Bulletin 1751F-630 §9; BICSI OSP-DRD Manual, Ch. 9.1]
- **C — Incorrect.** IEC 61300-3-4 is not the governing standard for RUS-funded OSP testing in the North American TIA-compliant context. RUS Bulletin 1751F-630 §9 references TIA-526-14 [confirm edition] for SM cable plant acceptance; IEC 61300-3-4 is relevant for international projects or IEC-certified equipment cross-validation, not as the primary RUS close-out standard. [RUS Bulletin 1751F-630 §9; ANSI/TIA-526-14]
- **D — Incorrect.** TIA-526-7 governs multi-mode (MM) cable plant testing, not single-mode (SM). OS2 single-mode cable is governed by TIA-526-14 [confirm edition]. Tier 1 alone is also insufficient given the splice count, plant length, and RUS funding. [ANSI/TIA-526-7; ANSI/TIA-526-14]

---

**Q2.** A 80-meter campus OM3 multi-mode horizontal link between two buildings has two connectors and no splices. Which tier and standard apply?

- A) Tier 2; TIA-526-7 with OTDR characterization required for all connector events
- B) Tier 1; TIA-526-7 OLTS — short campus link, no splices, no regulatory close-out requirement **[CORRECT]**
- C) Tier 1; TIA-526-14 [confirm edition] — SM standard applies to all horizontal links
- D) Tier 2; FOTP-61 OTDR required for any link with connectors

*Rationale:*
- **A — Incorrect.** Tier 2 is not required here — none of the three Tier 2 triggers are present: no splices (0), plant length is well within campus scale (80 m), and no RUS funding or regulatory close-out requirement. Performing an OTDR on an 80 m OM3 link is also technically marginal — the OTDR dead zone may be longer than the link itself at practical pulse widths. [BICSI OSP-DRD Manual, Ch. 9.1]
- **B — Correct.** **Tier 1; TIA-526-7.** This is a short (80 m) multi-mode (OM3) campus horizontal link with no splices and no regulatory close-out requirement. None of the three Tier 2 triggers apply: splice count = 0, length < campus scale threshold, no RUS funding. ANSI/TIA-526-7 governs OLTS testing of multi-mode cable plants. The test verifies end-to-end insertion loss against the link loss budget — the only required deliverable. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 9.1]
- **C — Incorrect.** TIA-526-14 [confirm edition] governs single-mode (SM) cable plants. OM3 is a multi-mode fiber; TIA-526-7 governs. Applying TIA-526-14 to multi-mode testing is a standard mismatch. [ANSI/TIA-526-14; ANSI/TIA-526-7]
- **D — Incorrect.** Connectors alone do not trigger Tier 2. Tier 2 is triggered by splices (which require spatial characterization by OTDR), long plant lengths, or regulatory close-out requirements — not by the presence of connectors. Connector loss is adequately measured by Tier 1 OLTS. [BICSI OSP-DRD Manual, Ch. 9.1]

---

**Q3.** What is the relationship between ANSI/TIA-455-61 (FOTP-61) and ANSI/TIA-526-14 [confirm edition]?

- A) TIA-455-61 superseded TIA-526-14; only TIA-455-61 applies to SM OTDR testing
- B) TIA-526-14 is the SM acceptance standard (pass/fail thresholds); TIA-455-61 (FOTP-61) is the parent OTDR measurement procedure referenced by TIA-526-14 for OTDR testing **[CORRECT]**
- C) TIA-455-61 governs MM testing; TIA-526-14 governs SM testing; they have no shared scope
- D) Both standards are interchangeable; either can be cited for SM OTDR acceptance testing

*Rationale:*
- **A — Incorrect.** TIA-455-61 did not supersede TIA-526-14 — they serve different functions within the TIA test standard framework. TIA-455-61 is the test procedure; TIA-526-14 is the acceptance standard that incorporates TIA-455-61 by reference. Both remain active, each serving its role. [ANSI/TIA-455-61; ANSI/TIA-526-14]
- **B — Correct.** ANSI/TIA-526-14 [confirm edition] is the **SM cable plant acceptance standard** — it defines what the cable plant must achieve (loss budget, per-event limits) and what testing is required. ANSI/TIA-455-61 (FOTP-61) is the **parent OTDR measurement procedure** — it defines how the OTDR test is conducted (pulse width selection, launch cable, averaging). TIA-526-14 incorporates FOTP-61 by reference for its OTDR provisions: when TIA-526-14 requires an OTDR test, FOTP-61 specifies the measurement methodology. Conflating the two (calling FOTP-61 the "acceptance standard") or citing TIA-526-14 as the "OTDR measurement procedure" are both errors. [ANSI/TIA-455-61; ANSI/TIA-526-14; BICSI OSP-DRD Manual, Ch. 9.1]
- **C — Incorrect.** TIA-455-61 is the parent OTDR procedure for both SM and MM testing — it is not restricted to MM. TIA-526-7 (not TIA-455-61) is the MM acceptance standard, and it also incorporates TIA-455-61 by reference. The shared scope between TIA-455-61 and both TIA-526-14 and TIA-526-7 is exactly why FOTP-61 must be cited distinctly as the measurement procedure, not conflated with either acceptance standard. [ANSI/TIA-455-61; ANSI/TIA-526-7; ANSI/TIA-526-14]
- **D — Incorrect.** The two standards are not interchangeable — they serve distinct roles. Citing FOTP-61 where TIA-526-14 is required (for acceptance thresholds) would leave the project without a defined pass/fail standard; citing TIA-526-14 alone for the OTDR test method would reference an acceptance document rather than the measurement procedure. Both must be cited when Tier 2 testing is required. [ANSI/TIA-455-61; ANSI/TIA-526-14]

---

**Q4.** Why is the TIA-526-14 edition placeholder "[confirm edition before publication]" used in this lesson, and what action must be taken before publishing?

- A) The placeholder indicates TIA-526-14 has been withdrawn; a replacement standard must be identified
- B) The edition suffix is unconfirmed; the lesson author intentionally avoided pinning -14-B or -14-C to prevent cross-topic citation drift until the current edition is verified and updated simultaneously with T2 L2.11 **[CORRECT]**
- C) The placeholder is a copyright restriction; the actual edition cannot be cited in training materials without a license
- D) TIA-526-14 has no edition suffix; the placeholder is unnecessary

*Rationale:*
- **A — Incorrect.** TIA-526-14 is not withdrawn — it is an active standard. The placeholder is about edition currency (which suffix is current), not standard withdrawal. [ANSI/TIA-526-14; T4 Brief Default #1]
- **B — Correct.** Per T4 Brief Default #1: both authoring framings cited TIA-526-14-B, but CANONICAL_BRIEF_B flagged that TIA-526-14-C may be current as of late 2023. Pinning an unconfirmed suffix creates cross-topic citation drift — particularly with T2 L2.11 which uses "TIA-526-14" without a suffix. The deliberate placeholder allows a single global search-replace to update both lessons simultaneously once the edition is confirmed by the user or publisher. Before publication: (1) confirm the current TIA-526-14 edition with TIA's published standards catalog, (2) search-replace "[confirm edition before publication]" in both L4.11 and T2 L2.11. [T4 Brief, Default #1]
- **C — Incorrect.** No copyright restriction prevents citing a TIA standard edition in training materials. The placeholder exists for accuracy and cross-topic consistency, not legal restriction. [T4 Brief Default #1]
- **D — Incorrect.** TIA-526-14 does have edition suffixes (e.g., -A, -B, -C) that track the revision history of the standard. The previous edition was TIA-526-14-B; a subsequent revision may carry a -C suffix. The specific suffix matters for accurate citation. [ANSI/TIA-526-14; T4 Brief Default #1]

---

**Q5.** A 350-meter OS2 SM MDU riser link has one connector junction and no fusion splices. It is not RUS-funded. Which tier applies and why?

- A) Tier 2 required — all SM links require OTDR characterization per TIA-526-14 [confirm edition]
- B) Tier 1 sufficient — no splices, sub-campus length, no regulatory close-out requirement **[CORRECT]**
- C) Tier 2 required — any SM cable requires FOTP-61 regardless of splice count
- D) Tier 1 required — TIA-526-7 (MM standard) applies to all riser links

*Rationale:*
- **A — Incorrect.** TIA-526-14 [confirm edition] does not require Tier 2 OTDR for all SM links — the tier is selected based on project characteristics, not fiber type. Tier 2 is triggered by splice count > 0, plant length > campus scale, or regulatory close-out requirements. None of these triggers are present here. [ANSI/TIA-526-14; BICSI OSP-DRD Manual, Ch. 9.1]
- **B — Correct.** **Tier 1 is sufficient.** Applying the three-trigger framework: (1) splice count = 0 (one connector junction only — no fusion splices); (2) length 350 m is within campus scale; (3) no RUS funding, no regulatory close-out requirement. All three Tier 2 triggers are absent. Tier 1 OLTS per TIA-526-14 [confirm edition] provides end-to-end IL confirmation against the link loss budget — the only required deliverable for this link. [ANSI/TIA-526-14; BICSI OSP-DRD Manual, Ch. 9.1]
- **C — Incorrect.** FOTP-61 (TIA-455-61) is the OTDR test procedure for Tier 2 testing — it does not mandate OTDR on every SM cable plant regardless of tier selection criteria. Applying FOTP-61 to a short connector-only riser link is unnecessary and produces results (spatial events at <350 m) that may fall within OTDR dead zones, making the test results less reliable than Tier 1 OLTS for this application. [ANSI/TIA-455-61; BICSI OSP-DRD Manual, Ch. 9.1]
- **D — Incorrect.** TIA-526-7 governs multi-mode (MM) cable plant testing. OS2 is single-mode; TIA-526-14 [confirm edition] governs SM OLTS testing. TIA-526-7 has no applicability to a single-mode riser link. [ANSI/TIA-526-7; ANSI/TIA-526-14]

---

## Final Check: Pulse Questions Before Lesson 4.12

**Pulse 1.** A 6 km OS2 SM cable plant has 8 fusion splices and is funded by a private carrier (non-RUS). Which tier is required, which standards govern, and why?

*Expected answer:* **Tier 2 is required.** Two of the three Tier 2 triggers are present: (1) splice count > 0 — 8 fusion splices require individual OTDR characterization to confirm per-splice loss meets the budget; (2) plant length 6 km exceeds campus scale. (RUS funding is not present, but the other two triggers are independently sufficient.) Governing standards: ANSI/TIA-526-14 [confirm edition] for SM OLTS acceptance thresholds; ANSI/TIA-455-61 (FOTP-61) for OTDR measurement procedure. Tier 1 OLTS is also performed for end-to-end budget confirmation; Tier 2 OTDR provides the splice-level documentation. [ANSI/TIA-526-14; ANSI/TIA-455-61; BICSI OSP-DRD Manual, Ch. 9.1]

**Pulse 2.** A technician asks if IEC 61300-3-4 OTDR results can be substituted for FOTP-61 results on a TIA-526-14 compliant cable plant. What is the correct answer?

*Expected answer:* Not without careful cross-validation. FOTP-61 (TIA-455-61) is the parent OTDR procedure referenced by TIA-526-14 [confirm edition]; IEC 61300-3-4 is the international parallel standard. They use similar backscatter measurement principles but may differ in test conditions (pulse width selection, launch cable requirements, averaging parameters). IEC 61300-3-4 results from an OTDR test conducted under IEC conditions are not automatically equivalent to FOTP-61 results — the test conditions must match for the comparison to be valid. A project specified under TIA-526-14 should cite FOTP-61 as the measurement procedure; IEC 61300-3-4 may serve as supporting documentation for equipment certification but does not replace FOTP-61 compliance verification. [ANSI/TIA-455-61; IEC 61300-3-4; ANSI/TIA-526-14]

---

## Glossary Cross-References

- **TIA-526-14 [confirm edition] / TIA-526-7** → T2 L2.10 (OTDR testing — execution); T2 L2.11 (power meter and light source testing — OLTS execution per TIA-526-7/TIA-526-14); update edition simultaneously in T2 L2.11 when confirmed
- **FOTP-61 (TIA-455-61)** → T2 L2.10 (OTDR testing — the test procedure; this lesson establishes the standard basis, T2 executes it)
- **IEC 61300-3-4** → L4.12 (IEC Standards — IEC 61300-3-4 covered in context of IEC datasheet literacy; cross-validation principle introduced here applies there)
- **Tier 1 / Tier 2 selection** → L4.8 (TIA-758-C §9 — acceptance testing requirements cite Tier 1/Tier 2 methodology); L4.14 (RUS Bulletins — 1751F-630 §9 close-out requires Tier 2 OTDR)
- **RUS close-out documentation** → L4.14 (RUS Bulletins — OTDR trace requirements as part of Form 219 close-out package)
- **Edition placeholder** → T2 L2.11 (TIA-526-14 without suffix — must be updated simultaneously; T4 Brief Default #1)
