---
title: "Lesson 2.12: Acceptance Testing and As-Built Documentation"
duration_min: 25
topic: splice-termination
order: 12
bicsi_alignment:
  - "OSP-DRD 9: Acceptance testing for outside plant fiber — test methods and documentation"
  - "OSP-DRD 10: As-built documentation requirements for OSP infrastructure"
sources:
  - "IEC 61300-3-35 (fiber optic connector end-face geometry and inspection — pass/fail criteria)"
  - "ANSI/TIA-568.3-D Sections 6.5–6.6 (optical fiber cabling components — connector and link acceptance)"
  - "ANSI/TIA-526-7 / OFSTP-7 (optical power loss measurement — SM fiber)"
  - "ANSI/TIA-758-C Section 9 (outside plant cable infrastructure — acceptance testing requirements)"
  - "BICSI OSP-DRD Manual, Ch. 9–10"
  - "Verizon/AT&T OSP Construction Practices (publicly available excerpts)"
---

# Acceptance Testing and As-Built Documentation

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- List the components of a complete OSP acceptance test package
- Apply the IEC 61300-3-35 end-face inspection zone criteria to make pass/fail decisions on connector end-faces
- State the insertion loss acceptance threshold for installed single-mode fiber links per ANSI/TIA-568.3-D
- Describe the required content and format of an OTDR trace archive for acceptance submission
- Identify the additional documentation requirements for government (RUS-funded) or regulated OSP projects beyond standard BICSI practice
- Walk through a compliance audit scenario and identify what documentation is missing or out of specification

---

## Reading Content

### What Acceptance Testing Is For

Acceptance testing closes the gap between installation and handoff. Before a fiber cable plant changes hands — from the contractor to the owner, or from the field crew to the network operations team — it must be demonstrated to meet the performance standards the project was designed to satisfy. Acceptance testing is the evidence that demonstration [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-758-C §9].

Three categories of evidence are required:

1. **End-face condition** — every connectorized termination meets the cleanliness and physical integrity requirements of IEC 61300-3-35
2. **Optical performance** — every event (splice, connector) meets its per-event loss threshold; the end-to-end link loss is within the design budget
3. **Documentation completeness** — the as-built record captures everything needed to operate, troubleshoot, and re-enter the plant after handoff

A project that fails any one of these three categories cannot be accepted. Acceptance testing is not a formality — it is the mechanism that verifies the installation team's work before responsibility transfers to the owner.

### Component 1: End-Face Inspection (IEC 61300-3-35)

Every connectorized fiber end-face — at connectors, at splice pigtail terminations, and at adapters — must be inspected before any mating and before acceptance sign-off. The governing standard is IEC 61300-3-35, which defines four concentric inspection zones and the maximum allowable scratch/particle defect in each zone [IEC 61300-3-35; BICSI OSP-DRD Manual, Ch. 9]:

**The four inspection zones (for single-mode PC/UPC/APC connectors):**

| Zone | Radius range | Defect criteria (single-mode) |
|---|---|---|
| Zone A (core) | 0 to 25 µm from center | No scratches > 0 µm (i.e., no visible scratches at all in the core zone); no particles |
| Zone B (cladding) | 25 µm to 125 µm | Scratches ≤ 5 µm wide; up to 5 scratches ≤ 5 µm; particles: none > 10 µm |
| Zone C (adhesive / epoxy) | 125 µm to 250 µm | Scratches, pits, and particles allowed (this zone does not affect optical performance) |
| Zone D (contact / ferrule edge) | 250 µm to 2000 µm | No chipping, cracks, or particles that extend into Zone C |

*Sources: [IEC 61300-3-35 §5; BICSI OSP-DRD Manual, Ch. 9]*

**Pass/fail rule:** A connector end-face fails inspection if any defect in Zone A exceeds the zone criteria (any visible scratch in the core zone = automatic fail), or if Zone B defects exceed the scratch count or size limits. A failed end-face must be cleaned and re-inspected — if cleaning does not resolve the defect, the connector must be replaced.

**Common field inspection failures and causes:**

- **Zone A scratch:** most often caused by mating with a dirty adapter (an adapter that was not cleaned before accepting the connector). The contamination on the adapter's ceramic alignment sleeve scores the connector end-face. Prevention: clean the adapter before every mating.
- **Zone A particle (fiber tip contamination):** caused by not wiping the end-face with a one-click cleaner before mating after transport; dust cap was not reinstalled during transit.
- **Zone B chip at the cladding edge:** usually caused by mechanical impact — the connector was dropped or struck against the adapter frame at an angle. A chipped cladding edge in Zone D is informational; a chip that extends into Zone C or B is a failure.

**Inspection equipment:** Use a fiber inspection probe with ≥ 200× magnification and a calibrated video image (EXFO FIP-400B, Viavi P5000i, Fluke FI-7000) for documentation-grade inspection. Handheld pocket scopes are acceptable for field cleaning verification but do not produce the image files required for formal acceptance documentation.

### Component 2: Optical Performance Verification

The optical performance section of acceptance testing has three distinct verification steps [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7; ANSI/TIA-758-C §9]:

**Step A: Per-event splice loss verification (OTDR, bidirectional).**
Every fusion splice on every fiber must have a bidirectional OTDR average ≤ the project's per-splice acceptance threshold (BICSI default: ≤ 0.10 dB; project spec may be tighter). Each splice is identified in the OTDR event table by its distance from the launch end and its loss reading (forward, reverse, bidirectional average). Splices that fail must be re-spliced and re-tested before the route can be accepted [BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §5].

**Step B: Per-event connector loss verification (OTDR).**
Every hardened OSP connector mated pair must have a bidirectional OTDR average ≤ 0.50 dB per IEC 61753-1 and ANSI/TIA-758-C §6.5. Every inside-plant SC/LC connector ≤ 0.75 dB per ANSI/TIA-568.3-D §6.5 [ANSI/TIA-758-C §6.5; IEC 61753-1; ANSI/TIA-568.3-D §6.5].

**Step C: End-to-end insertion loss verification (PMLS, Tier 1 or Tier 2).**
The total link insertion loss measured by Method B PMLS at 1310 nm and 1550 nm (for OS2 SMF per ANSI/TIA-526-7) must be ≤ the project's calculated link loss budget. The budget is calculated as:

```
IL_max = (length_km × attenuation_dB/km) 
       + (splice_count × IL_splice_max) 
       + (connector_count × IL_connector_max)
```

If the PMLS result exceeds IL_max, the link fails end-to-end acceptance. The OTDR trace should already identify which event(s) are contributing excess loss [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9].

**Acceptance test wavelengths for OS2 SMF:**
- 1310 nm (primary — matches most transceiver operating wavelength)
- 1550 nm (required — detects macrobend-induced loss invisible at 1310 nm)

Both wavelengths must pass. A link that passes at 1310 nm but fails at 1550 nm is a failed link [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9].

### Component 3: Closure and Environmental Inspection

Before burying, vaulting, or completing the final aerial attachment of each splice closure, a physical inspection of the closure must be documented [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-758-C §9]:

- All cable port seals correctly installed (gel compression complete or heat-shrink applied and cooled)
- All unused cable ports sealed with blank plugs
- Closure body correctly assembled and latched/bolted (no open seam)
- Tray stack secured and no loose fibers outside the tray radius guides
- Closure exterior label intact with closure ID, fiber count, and installation date
- GPS coordinates or GPS-derived stake map recorded for buried closures

### Component 4: As-Built Documentation Package

The as-built documentation package is the permanent record of the installed cable plant. It is delivered to the project owner at project close-out and is used for all future operation, maintenance, and re-entry planning. The minimum contents per BICSI OSP-DRD Manual, Ch. 10 and ANSI/TIA-758-C §9 are [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]:

**1. Route map and cable schedule.**
A marked map (GIS, CAD, or photographic with GPS coordinates) showing:
- Cable route with measured distances between landmarks
- All splice closure locations (GPS coordinates + depth for buried closures)
- All FDT and FDH locations with port maps
- All aerial attachment/lashing strand locations
- Cable type, fiber count, and color code (per TIA-598 or manufacturer's code)

**2. Fiber count and color assignment record.**
A spreadsheet or table documenting every fiber in every cable segment:
- Buffer tube number and color (or ribbon position for ribbon cable)
- Fiber number and color within the tube
- Splice closure connections: which fiber from which tube/ribbon on each cable splices to which fiber on the next cable
- Connector assignments at each FDT/FDH port

**3. OTDR trace archive (.sor files).**
One .sor file per fiber per direction per wavelength. For a 24-fiber cable tested bidirectionally at 1310 nm and 1550 nm: 24 fibers × 2 directions × 2 wavelengths = 96 .sor files per route segment. Files named by a consistent convention: [site_ID]_[fiber_ID]_[direction]_[wavelength].sor. Trace files must include all event data, cursor positions, and the test configuration parameters embedded in the .sor header [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9].

**4. Splice loss log.**
A tabular record of every splice on every fiber, derived from the OTDR event tables:
- Closure ID and GPS coordinates
- Splice event distance (km from test end)
- Forward OTDR reading (dB)
- Reverse OTDR reading (dB)
- Bidirectional average (dB)
- Pass/Fail notation (vs. project threshold)

**5. Insertion loss test records (PMLS).**
Per ANSI/TIA-526-7 Method B, one record per fiber per wavelength:
- Test date and time
- Technician name
- Test equipment: make, model, serial number, and calibration expiry date
- Reference method used (Method B)
- Reference power level (dBm) recorded at the start of the session
- Measured insertion loss (dB)
- Pass/Fail (vs. calculated link budget)

**6. End-face inspection images.**
Digital images from the fiber inspection probe for every connectorized end-face:
- Before cleaning (as-found condition)
- After cleaning (as-accepted condition)
- Pass/Fail notation per IEC 61300-3-35 zone criteria
- Images named by convention: [site_ID]_[port_ID]_[pre/post-clean].jpg

**7. Test equipment calibration records.**
For every instrument used in acceptance testing:
- Make, model, serial number
- Last calibration date
- Calibration expiry date (typically annual for PMLS and OTDR instruments)
- Calibration service provider (NIST-traceable preferred)

Chain-of-custody: the project owner must be able to verify that all test instruments were within their calibration interval at the time of acceptance testing. Calibration records are typically provided as copies of the calibration certificates.

### Additional Requirements for Government / RUS-Funded Projects

Projects funded by the USDA Rural Utilities Service (RUS) or other federal infrastructure programs carry additional documentation requirements beyond the BICSI OSP-DRD minimum [BICSI OSP-DRD Manual, Ch. 9–10; ANSI/TIA-758-C §9; Verizon/AT&T OSP Practices]:

**Test data delivery to the owner.** All OTDR trace files (.sor), PMLS records, and splice logs must be delivered to the project owner in digital form (USB drive, secure FTP, or project management system) at project close-out. The owner — not the contractor — holds the permanent record. The contractor retains a copy but the owner receives the authoritative set.

**NIST-traceable calibration.** RUS projects typically require NIST-traceable calibration certificates for all test instruments, not just manufacturer-issued calibration certificates. NIST-traceable means the calibration was performed against a standard with a documented chain of traceability to NIST (National Institute of Standards and Technology) reference standards.

**Chain-of-custody forms.** Some RUS contracts require chain-of-custody documentation for test records, confirming that the technician who performed the test, the equipment serial numbers, and the date/time of each test are certified by signature. This creates an audit trail that satisfies federal infrastructure inspection requirements.

**Right-of-way compliance records.** RUS-funded OSP projects typically include easement and right-of-way records as part of the as-built package — cable route GPS coordinates must align with the permitted easement boundaries.

### Acceptance Checklist Summary

| Item | Governing standard | Pass criterion |
|---|---|---|
| End-face inspection | IEC 61300-3-35 | No Zone A defects; Zone B ≤ 5 scratches ≤ 5 µm |
| Fusion splice loss (per event) | IEC 61300-3-4 §5; BICSI OSP-DRD Ch. 9 | Bidirectional avg ≤ 0.10 dB (or project spec) |
| Hardened OSP connector loss | ANSI/TIA-758-C §6.5; IEC 61753-1 | ≤ 0.50 dB per mated pair |
| End-to-end insertion loss | ANSI/TIA-526-7 §6 | ≤ calculated link budget at 1310 nm and 1550 nm |
| Closure sealing inspection | ANSI/TIA-758-C §9 | All ports sealed; no open seams |
| OTDR trace archive | BICSI OSP-DRD Ch. 10 | .sor files for all fibers × directions × wavelengths |
| Splice loss log | BICSI OSP-DRD Ch. 10 | Bidirectional averages tabulated, all events |
| PMLS test records | ANSI/TIA-526-7; BICSI OSP-DRD Ch. 10 | Method B, both wavelengths, calibrated equipment |
| End-face inspection images | BICSI OSP-DRD Ch. 10; IEC 61300-3-35 | Pre/post-clean images, all connectorized terminations |
| Calibration certificates | BICSI OSP-DRD Ch. 10 | Within calibration interval at test date |

---

## Key Terms (Flashcard Candidates)

**IEC 61300-3-35 (fiber end-face inspection standard)**
The IEC standard defining pass/fail criteria for fiber optic connector end-face inspection. Divides the end-face into four zones (A: core, B: cladding, C: adhesive, D: contact edge) and specifies maximum allowable defect size and count per zone. Zone A (the core region, radius 0–25 µm) has zero tolerance for visible scratches. Used for acceptance inspection of all connectorized terminations. [IEC 61300-3-35]

**Zone A (IEC 61300-3-35)**
The inner core inspection zone, radius 0 to 25 µm from the fiber center. Any visible scratch or particle in Zone A is a mandatory fail for single-mode connectors — no scratches of any size are permitted because they directly intersect the optical waveguide and degrade insertion loss and return loss. [IEC 61300-3-35 §5]

**Acceptance test package**
The complete documentation deliverable from an OSP contractor to the project owner at project close-out. Minimum contents per BICSI OSP-DRD Ch. 10: route map/cable schedule, fiber count/color record, OTDR trace archive (.sor files), splice loss log, PMLS insertion loss test records, end-face inspection images, and test equipment calibration certificates. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

**.sor file**
The Bellcore/Telcordia GR-196 standard binary format for OTDR trace data storage. Contains the full waveform, event list, instrument parameters, and calibration data. Required format for OTDR trace submission in OSP acceptance test packages; supported by all major OTDR brands (EXFO, Viavi, Fluke/NetScout). [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

**NIST-traceable calibration**
An instrument calibration performed using reference standards with a documented traceability chain to the National Institute of Standards and Technology (NIST). Required on RUS-funded and other federal infrastructure projects for all OTDR and PMLS test instruments. Provides auditable assurance that measured values are accurate against national reference standards. [BICSI OSP-DRD Manual, Ch. 9; Verizon/AT&T OSP Practices]

**Splice loss log**
The tabular acceptance record listing every fusion splice on every fiber: closure ID, distance from test end, forward OTDR reading, reverse OTDR reading, bidirectional average, and pass/fail notation vs. project threshold. Delivered to the project owner as part of the acceptance test package. [BICSI OSP-DRD Manual, Ch. 10]

**Calibration interval**
The maximum elapsed time between required re-calibrations for a test instrument. Typically one year for OTDR and PMLS instruments. Acceptance testing performed with an instrument outside its calibration interval is invalid — test data from out-of-calibration instruments is rejected on regulated contracts. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

**End-face inspection image**
A photographic or digital image of a fiber connector end-face captured by a fiber inspection probe (≥ 200× magnification) during acceptance testing. Taken before and after cleaning; labeled with port ID and pass/fail status per IEC 61300-3-35. Required in the acceptance documentation package for all connectorized terminations. [BICSI OSP-DRD Manual, Ch. 10; IEC 61300-3-35]

---

## Interactive: Scenario — Compliance Audit Walkthrough

### Scenario

A contractor has just completed a 12 km OS2 SMF OSP feeder cable installation for a RUS-funded rural broadband project. The contractor has submitted an acceptance test package. You are the project engineer performing the compliance audit before acceptance sign-off.

The submitted package contains:
- Route map with GPS coordinates for 2 of the 3 splice closures (one closure location is missing)
- OTDR trace files: 24 .sor files for all 24 fibers in the forward direction only (no reverse direction files)
- Splice loss log with forward-direction readings only (no bidirectional averages)
- PMLS test records for 1310 nm only (no 1550 nm records)
- End-face inspection images for 16 of 24 connectorized terminations at the FDH
- Test equipment list with OTDR serial number and calibration date from 14 months ago; PMLS calibration certificate is dated 8 months ago

**Task:** Identify every deficiency in this package.

---

**Deficiency 1: Missing splice closure GPS coordinates.**
One of three splice closure locations is not documented in the route map. Per BICSI OSP-DRD Ch. 10, all infrastructure elements must be located in the as-built documentation. Future maintenance and re-entry cannot proceed without knowing the closure location. **Action required:** Contractor must provide GPS coordinates for the missing closure before acceptance sign-off. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

**Deficiency 2: OTDR traces — forward direction only.**
The .sor files cover only the A→B direction. Per IEC 61300-3-4 §5 and ANSI/TIA-455-61, bidirectional OTDR testing (forward + reverse) is required for OSP backbone acceptance on a BICSI OSP-DRD project. The reverse-direction .sor files are missing. **Action required:** Contractor must run reverse-direction OTDR tests, generate reverse .sor files, calculate bidirectional averages for all splices, and submit the complete bidirectional archive. [IEC 61300-3-4 §5; ANSI/TIA-455-61 §5; BICSI OSP-DRD Manual, Ch. 9]

**Deficiency 3: Splice loss log — no bidirectional averages.**
The splice loss log contains only forward-direction readings. As a direct consequence of Deficiency 2, the bidirectional averages cannot be calculated. No splice can be formally accepted until the bidirectional average is calculated and compared to the ≤ 0.10 dB threshold. **Action required:** Resubmit splice loss log with bidirectional averages after reverse OTDR tests are completed. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]

**Deficiency 4: PMLS records — 1310 nm only.**
ANSI/TIA-526-7 requires OS2 SMF to be tested at both 1310 nm and 1550 nm. The 1550 nm test is not optional — it detects macrobend-induced loss that 1310 nm does not. **Action required:** Contractor must run PMLS tests at 1550 nm (both directions, Method B reference), record results, and submit 1550 nm insertion loss records. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]

**Deficiency 5: End-face inspection images — 8 of 24 FDH terminations missing.**
16 of 24 connectorized FDH terminations have end-face inspection images; 8 are absent. Per BICSI OSP-DRD Ch. 10, all connectorized terminations require end-face inspection images (pre- and post-clean). The 8 un-inspected ports cannot be accepted. **Action required:** Inspect remaining 8 terminations, clean if necessary, capture pre/post-clean images, document pass/fail per IEC 61300-3-35. [IEC 61300-3-35; BICSI OSP-DRD Manual, Ch. 10]

**Deficiency 6: OTDR calibration expired.**
The OTDR calibration date is 14 months ago. The standard calibration interval for OTDR instruments is 12 months. The OTDR was out of calibration at the time of testing — the test data is invalid per the contract requirement (RUS projects require NIST-traceable calibration within the calibration interval). **Action required:** Have the OTDR recalibrated by a NIST-traceable service; re-run all OTDR tests with the calibrated instrument; resubmit all trace files and splice logs. This is the most consequential deficiency — all OTDR test data must be retested, not just recalibrated. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

**Summary:** 6 deficiencies identified. The acceptance package cannot be approved until all 6 are corrected and resubmitted. The out-of-calibration OTDR (Deficiency 6) requires full retesting — it does not merely require a recalibration of the instrument; all data collected with the out-of-calibration instrument is voided.

[BICSI OSP-DRD Manual, Ch. 9–10; IEC 61300-3-35; IEC 61300-3-4 §5; ANSI/TIA-526-7 §3; ANSI/TIA-758-C §9; ANSI/TIA-455-61 §5]

---

## Multiple-Choice Quiz

---

**Q1.** During end-face inspection of an SC-APC connector using IEC 61300-3-35 criteria, the inspection scope image shows a single scratch 3 µm wide that passes through the center of the Zone A area (0–25 µm from center). What is the correct action?

- A) Accept — a single scratch less than 5 µm is within the Zone B criteria; Zone A allows small scratches
- B) Clean the end-face with a one-click cleaner and re-inspect; if the scratch persists, replace the connector **[CORRECT]**
- C) Accept — Zone A accepts scratches ≤ 5 µm and this scratch is 3 µm
- D) Document the scratch and note it as acceptable because APC connectors are more tolerant of Zone A defects than UPC connectors

*Rationale:*
- **A — Incorrect.** The ≤ 5 µm width criterion applies to Zone B (25–125 µm from center), not Zone A. Zone A (the core region, 0–25 µm) has zero tolerance for visible scratches of any width for single-mode connectors. A 3 µm scratch through the Zone A core area is a mandatory failure. [IEC 61300-3-35 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Correct.** A scratch in Zone A is a mandatory failure requiring cleaning and re-inspection. Cleaning is the first step — some Zone A "scratches" on the inspection image are actually particles or cleaning residue that can be removed. If the scratch persists after cleaning, the connector must be replaced, as mechanical scratches through the core zone cannot be cleaned away and will degrade insertion loss and return loss at every subsequent mating. [IEC 61300-3-35 §5; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** This confuses Zone A and Zone B criteria. Zone A is the core zone (0–25 µm) with zero scratch tolerance. Zone B (25–125 µm from center) allows up to 5 scratches ≤ 5 µm wide. A scratch in Zone A is a fail regardless of its width, even if sub-micron. [IEC 61300-3-35 §5]
- **D — Incorrect.** IEC 61300-3-35 Zone A criteria apply equally to SC-APC and SC-UPC connectors. The APC designation (8° polish angle) affects return loss performance but does not change the end-face inspection zone pass/fail criteria. A Zone A scratch fails regardless of connector type. [IEC 61300-3-35 §5]

---

**Q2.** A 22 km OS2 SMF backbone route has 4 splice closures and 2 hardened connector pairs (at the FDH and OLT ends). Calculate the maximum allowable end-to-end insertion loss per ANSI/TIA-526-7 using BICSI-default acceptance values (0.4 dB/km cable max; 0.10 dB/splice; 0.50 dB/hardened connector).

- A) 10.8 dB
- B) 10.2 dB **[CORRECT]**
- C) 11.4 dB
- D) 8.8 dB

*Rationale:*
- **A — Incorrect.** 10.8 dB does not match the BICSI-default formula. Check: 22 × 0.4 = 8.8; 4 × 0.10 = 0.4; 2 × 0.50 = 1.0 → total 10.2 dB, not 10.8 dB. [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]
- **B — Correct.** IL_max = (length × att_coeff) + (splice_count × IL_splice_max) + (connector_pairs × IL_conn_max) = (22 × 0.4) + (4 × 0.10) + (2 × 0.50) = **8.8 + 0.4 + 1.0 = 10.2 dB**. [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** 11.4 dB would require higher per-km attenuation or more connectors than specified. With BICSI defaults: 8.8 + 0.4 + 1.0 = 10.2, not 11.4. [ANSI/TIA-526-7 §6]
- **D — Incorrect.** 8.8 dB is the cable-only loss. Omitting the splice and connector contributions (0.4 + 1.0 = 1.4 dB) understates the total IL_max. [ANSI/TIA-526-7 §6]

---

**Q3.** An OSP contractor submits acceptance test records showing PMLS insertion loss results for 1310 nm only. The project specification states "Test in accordance with ANSI/TIA-526-7." What is missing and why does it matter?

- A) Nothing is missing — ANSI/TIA-526-7 specifies 1310 nm as the primary test wavelength for OS2 SMF
- B) The 1550 nm test results are missing; 1550 nm is required by ANSI/TIA-526-7 for OS2 SMF and detects macrobend-induced loss that may not be visible at 1310 nm **[CORRECT]**
- C) The 1383 nm (water peak) test results are missing; ANSI/TIA-526-7 requires three-wavelength testing for OS2 SMF
- D) The 850 nm test results are missing; multimode test wavelengths are required alongside single-mode wavelengths per ANSI/TIA-526-7

*Rationale:*
- **A — Incorrect.** ANSI/TIA-526-7 specifies both 1310 nm and 1550 nm as required test wavelengths for OS2 SMF cable plants. The 1310 nm test is not the only required wavelength — both must be completed and documented. [ANSI/TIA-526-7 §3]
- **B — Correct.** ANSI/TIA-526-7 requires OS2 SMF cable plant acceptance testing at both 1310 nm and 1550 nm. The 1550 nm test is operationally critical because macrobend-induced attenuation scales strongly with wavelength — a tight cable bend that produces minimal extra loss at 1310 nm may produce significant excess loss at 1550 nm. Since operational FTTH, long-haul Ethernet, and CWDM/DWDM traffic often uses 1550 nm window wavelengths, a cable that passes at 1310 nm but fails at 1550 nm would degrade live traffic. The 1550 nm result is not optional. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** ANSI/TIA-526-7 does not require 1383 nm testing for standard OS2 SMF acceptance. The 1383 nm water peak is specified in ITU-T G.652.D fiber specification (for low-water-peak fiber qualification) but is not a required PMLS acceptance test wavelength in TIA-526-7. [ANSI/TIA-526-7 §3; ITU-T G.652.D]
- **D — Incorrect.** ANSI/TIA-526-7 covers single-mode fiber; multimode fiber testing (850 nm and 1300 nm) is governed by ANSI/TIA-526-14B. Multimode wavelengths are never required on an OS2 SMF acceptance test. [ANSI/TIA-526-7; ANSI/TIA-526-14B]

---

**Q4.** The acceptance test package for a RUS-funded project includes an OTDR with calibration dated 14 months prior to the test date. The instrument has an annual (12-month) calibration interval per the manufacturer. What is the required action?

- A) Accept the data — calibration is within a 24-month grandfathering period common to federal infrastructure projects
- B) Recalibrate the OTDR and resubmit the calibration certificate; the existing test data is still valid because the instrument was only 2 months past calibration
- C) The OTDR must be recalibrated; all acceptance test data collected with the out-of-calibration instrument is invalid and the OTDR tests must be repeated with a calibrated instrument **[CORRECT]**
- D) Request a waiver from the project owner; minor calibration overruns are standard practice in OSP field testing

*Rationale:*
- **A — Incorrect.** There is no 24-month grandfathering period in RUS infrastructure acceptance testing. The calibration interval is the governing limit; data collected outside the interval is voided. Federal projects typically require NIST-traceable calibration, making compliance with the specified interval stricter, not more flexible. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]
- **B — Incorrect.** Recalibrating the instrument after the fact does not validate data collected while it was out of calibration. There is no mechanism in ANSI/TIA-758-C or BICSI OSP-DRD to retroactively validate test data from an out-of-calibration instrument. The test must be repeated. [BICSI OSP-DRD Manual, Ch. 10]
- **C — Correct.** Test data collected with an out-of-calibration instrument is invalid per ANSI/TIA-758-C §9 and BICSI OSP-DRD Ch. 10. Recalibrating the OTDR establishes the instrument is accurate going forward — but it does not certify that it was accurate when the tests were run. The only remedy is to recalibrate the instrument and repeat all OTDR tests (both directions, both wavelengths) before resubmitting the acceptance test package. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]
- **D — Incorrect.** A waiver from the project owner does not change the physical reality that test data from an out-of-calibration instrument may not accurately reflect the actual link performance. On a RUS-funded project, the project owner is accountable for delivering accurate test records to the federal agency; accepting a waiver for out-of-calibration data would expose the project owner to audit liability. In practice, such waivers are not granted on regulated infrastructure projects. [BICSI OSP-DRD Manual, Ch. 10]

---

**Q5.** The as-built documentation package is missing the fiber color assignment record — the document linking each fiber number in the cable to its splice closure connections and FDT/FDH port assignment. Why is this document critical beyond the initial project handoff?

- A) It is not critical after handoff — the OTDR traces identify fiber positions by distance, which is sufficient for re-entry
- B) Without it, maintenance technicians cannot identify which fiber in a closure corresponds to which subscriber or circuit, making fault isolation and future splicing extremely difficult **[CORRECT]**
- C) It is required for regulatory compliance only; operational teams typically maintain their own internal fiber records
- D) It only matters for ribbon fiber cables; for single-fiber cable, color identification is unnecessary

*Rationale:*
- **A — Incorrect.** OTDR traces identify events by distance from the test end — they do not provide circuit-level assignment. A distance-based event at km 8.7 tells you there is a splice at that location; it does not tell you which subscriber circuit runs on that fiber, which port at the FDH it terminates on, or what service it carries. Without the fiber color assignment record, an operations technician at the closure has no reliable way to connect fiber identity to circuit identity. [BICSI OSP-DRD Manual, Ch. 10]
- **B — Correct.** The fiber color assignment record is the operational translation layer between physical fibers and logical circuits. When a fiber break occurs, the maintenance crew needs to know: which cable contains the break, which buffer tube, which fiber number, what color — and from that, which subscriber or which OLT port is affected. Without this document, fault isolation requires tracing every fiber manually using a visual fault locator, which may take hours in a high-fiber-count cable. For ongoing add/drop splicing (connecting new drop fibers to the feeder), the splicer must know exactly which fibers in the closure map to which feeder and distribution ports — without the color record, every splice job requires re-testing the entire closure to re-discover the mapping. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]
- **C — Incorrect.** The fiber color assignment record is required in the as-built documentation package delivered to the project owner — it is not optional for regulatory compliance. Internal records maintained by the operations team supplement, not replace, the contractor-delivered as-built package. The owner's OSS/BSS systems need the fiber-to-circuit mapping to provision and manage services. [BICSI OSP-DRD Manual, Ch. 10]
- **D — Incorrect.** Color coding applies to both single-fiber buffer tube cables and ribbon fiber cables. In single-fiber cables, the buffer tube color and the fiber color within the tube together identify each fiber; in ribbon cables, the ribbon number and fiber position within the ribbon provide the same identification. The fiber color record is necessary for both cable types. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

---

## Final Check

Answer these questions. Completion of this Final Check signifies readiness for the Topic 2 Final Exam.

**Pulse 1.** List the four inspection zones defined by IEC 61300-3-35 and state the defect acceptance criterion for Zone A (single-mode connectors).

*Expected answer:* Zone A (core, 0–25 µm from center): **no visible scratches of any size; no particles** — zero tolerance. Zone B (cladding, 25–125 µm): ≤ 5 scratches ≤ 5 µm wide; no particles > 10 µm. Zone C (adhesive, 125–250 µm): defects permitted (no optical impact). Zone D (contact/ferrule edge, 250–2000 µm): no chips or cracks extending into Zone C. [IEC 61300-3-35 §5; BICSI OSP-DRD Manual, Ch. 9]

**Pulse 2.** A 15 km OS2 SMF link with 3 splice closures and 1 hardened connector pair (one FDH connector) is tested at 1310 nm PMLS. The measured IL is 7.8 dB. Calculate the IL_max using BICSI defaults (0.4 dB/km cable; 0.10 dB/splice; 0.50 dB/connector pair) and state pass or fail.

*Expected answer:* IL_max = (15 × 0.4) + (3 × 0.10) + (1 × 0.50) = 6.0 + 0.3 + 0.5 = **6.8 dB**. Measured IL = 7.8 dB. 7.8 dB > 6.8 dB → **FAIL**. The link exceeds the calculated maximum insertion loss; OTDR review required to locate the excess-loss event before re-testing. [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]

**Pulse 3.** Name three additional documentation requirements for a RUS-funded OSP project beyond the standard BICSI OSP-DRD minimum as-built package.

*Expected answer:* Any three of: (1) NIST-traceable calibration certificates for all test instruments; (2) chain-of-custody forms certifying the technician, equipment serial numbers, and test dates for each record; (3) digital delivery of all OTDR .sor files and PMLS records directly to the project owner (not retained by contractor only); (4) right-of-way compliance records showing cable route GPS coordinates align with permitted easement boundaries. [BICSI OSP-DRD Manual, Ch. 9–10; ANSI/TIA-758-C §9; Verizon/AT&T OSP Practices]

---

## Glossary Cross-References

Terms introduced in this lesson span the full Splice & Termination topic and close the loop on concepts introduced in earlier lessons:

- **IEC 61300-3-35 / end-face inspection** → Lesson 2.9 (Hardened Connectors — pre-mating end-face inspection is mandatory before activating FDT ports); Lesson 2.8 (Termination Methods — end-face inspection closes every connectorization workflow)
- **Bidirectional OTDR average** → Lesson 2.10 (OTDR Testing — full bidirectional methodology and calculation); Lesson 2.2 (Fusion Splicing I — splice loss budget is verified by the OTDR bidirectional average)
- **ANSI/TIA-526-7 / Method B reference** → Lesson 2.11 (Power Meter Testing — reference methods and Tier 1/Tier 2 selection)
- **.sor file** → Lesson 2.10 (OTDR Testing — format and field of origin)
- **ANSI/TIA-758-C §9** → Lesson 2.6 (Splice Closures — closure environmental rating is an acceptance inspection item); Lesson 2.7 (Splice Trays — closure inspection includes tray stack verification)
- **Link loss budget** → Lesson 2.2 (Fusion Splicing I — the budget construction); Lesson 2.11 (Power Meter Testing — PMLS compares measured IL to this budget)
- **RUS documentation requirements** → cross-domain: CLAUDE.md project context (RUS-funded government contracts are a primary project type for this office)
