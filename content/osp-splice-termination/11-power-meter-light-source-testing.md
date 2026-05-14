---
title: "Lesson 2.11: Power Meter and Light Source Testing — Tier 1 vs. Tier 2"
duration_min: 20
topic: splice-termination
order: 11
bicsi_alignment:
  - "OSP-DRD 9: Test methods for OSP fiber — insertion loss measurement and test tiers"
  - "OSP-DRD 9.1: Optical power measurement and reference conditions"
sources:
  - "ANSI/TIA-526-7 / OFSTP-7 (measurement of optical power loss of installed single-mode fiber cable plants)"
  - "ANSI/TIA-526-14B / OFSTP-14 (optical power loss measurements of installed multimode fiber cable plants)"
  - "ANSI/TIA-568.3-D (optical fiber cabling components — connector and cable performance)"
  - "Fluke Networks FI-7000 FiberInspector Ultra User Guide (public edition)"
  - "Viavi Solutions OSP Field Testing Application Note (public edition)"
  - "BICSI OSP-DRD Manual, Ch. 9"
---

# Power Meter and Light Source Testing: Tier 1 vs. Tier 2

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Explain the operating principle of optical power meter / light source (PMLS) insertion loss testing
- Distinguish Tier 1 (insertion loss only) from Tier 2 (OTDR + insertion loss) testing and state when each is required
- Identify the three reference methods defined in ANSI/TIA-526-7 and explain how the choice of reference method affects the measured insertion loss by up to one connector loss value
- Perform the two-jumper reference procedure step by step
- Explain the dBm vs. dB distinction and apply it in an insertion loss calculation
- Identify the four most common measurement errors in PMLS testing

---

## Reading Content

### The Simplest Test in Fiber Optics — And the Easiest to Screw Up

Optical power meter / light source (PMLS) testing measures one thing: how much light gets from one end of the fiber to the other. The instrument is simple — a calibrated light source injects optical power at a known wavelength and level; a power meter at the far end measures how much arrives. The ratio of output power to received power, expressed in dB, is the insertion loss.

PMLS testing is faster than OTDR testing, requires a technician at each end of the link, and provides an end-to-end pass/fail number — but no spatial information about where any loss is occurring. Used alone (Tier 1), it cannot locate a fault. Used alongside OTDR (Tier 2), the PMLS result verifies the total link loss while the OTDR locates individual events. Understanding when each tier is required — and how to execute the test correctly — is essential for OSP acceptance testing.

### The dBm vs. dB Distinction: The #1 Newbie Mistake

Before covering test procedures, let's be precise about units, because confusing them is the most common source of PMLS measurement errors [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §4]:

**dBm** is a unit of **absolute optical power** referenced to 1 milliwatt (mW):

```
Power (dBm) = 10 × log₁₀[Power (mW) / 1 mW]
```

Examples:
- 1 mW = 0 dBm
- 0.5 mW = −3 dBm (half power, 3 dB reduction)
- 0.001 mW (1 µW) = −30 dBm
- Light source output: typically −5 dBm to −10 dBm (depending on the source type and wavelength)
- Minimum detectable power for a typical PMLS meter: approximately −50 dBm to −60 dBm

**dB** is a unit of **relative power ratio** — a dimensionless comparison of two power levels:

```
Loss (dB) = 10 × log₁₀[P_in / P_out]    (positive value when P_in > P_out)
           = P_in (dBm) − P_out (dBm)
```

**The critical rule:** Insertion loss is always expressed in **dB** (a ratio), never in **dBm** (an absolute level). You cannot compare dBm values across tests directly — only the dB difference is the actual loss.

**Worked example — correct vs. incorrect:**

A light source outputs −7.0 dBm. The power meter at the far end reads −14.5 dBm after a reference calibration (more on this below).

**Correct:** Insertion loss = −7.0 − (−14.5) = **7.5 dB** ← this is the link insertion loss.
**Incorrect:** "The meter reads −14.5 dBm, which is 14.5 dB of loss." ← WRONG. −14.5 dBm is an absolute power level, not a loss. The loss is the difference from the reference level.

**Why this matters:** If a technician records the raw meter reading (in dBm) rather than the calculated dB difference from reference, the loss value will be wrong by the source output power offset. On a properly calibrated PMLS system, the meter displays insertion loss in dB directly — but understanding what the instrument is actually computing prevents errors when calibrating or when using a non-auto-zeroing meter [ANSI/TIA-526-7 §4; BICSI OSP-DRD Manual, Ch. 9].

### Test Tiers: Tier 1 and Tier 2

ANSI/TIA-568.3-D and BICSI OSP-DRD define two testing tiers for installed fiber cable plants [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §1]:

**Tier 1 — Insertion loss only (PMLS):**
- Test equipment: calibrated optical power meter + matched light source
- Measurement: end-to-end insertion loss in dB
- Spatial information: none — only total link loss is measured
- Reference standard: ANSI/TIA-526-7 (OS1/OS2 SMF) or ANSI/TIA-526-14B (MMF)
- Wavelength: test at 1310 nm and 1550 nm for OS2 SMF (both wavelengths specified in ANSI/TIA-526-7)
- Required for: all installed fiber cable plants as minimum acceptance documentation
- Adequate for: inside-plant premises cabling, FTTH drop qualification at the subscriber level, any project where the specification requires only insertion loss documentation

**Tier 2 — OTDR + Insertion loss (PMLS + OTDR):**
- Test equipment: OTDR (for spatial event analysis) + PMLS (for total link verification)
- Measurement: per-event splice and connector loss, end-to-end link loss
- Spatial information: location of every event along the route
- Required for: all OSP backbone and feeder cable plants per BICSI OSP-DRD; government/RUS infrastructure projects; any specification that explicitly requires Tier 2
- Necessary because: Tier 1 cannot verify individual splice quality, cannot locate faults, and cannot validate the splice loss against the route's link budget event-by-event

**Which tier is required?**

| Application | Tier | Standard/Authority |
|---|---|---|
| Inside-plant horizontal cabling | Tier 1 minimum | ANSI/TIA-568.3-D §6.6 |
| Inside-plant backbone | Tier 1 minimum; Tier 2 recommended | ANSI/TIA-568.3-D §6.6 |
| OSP distribution plant (FDT to NID) | Tier 1 typically sufficient for drop-level | BICSI OSP-DRD Manual, Ch. 9 |
| OSP backbone / feeder cable | **Tier 2 required** | BICSI OSP-DRD Manual, Ch. 9 |
| RUS / government infrastructure | **Tier 2 required** | BICSI OSP-DRD Manual, Ch. 9; project specs |
| BICSI certification compliance | **Tier 2 required** | BICSI OSP-DRD Manual, Ch. 9 |

*Sources: [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §1]*

### Reference Methods: The Critical Calibration Step

Before measuring insertion loss, the PMLS system must be calibrated by establishing a reference power level. The reference procedure defines what the "zero loss" baseline is — any power reduction relative to the reference is recorded as insertion loss. ANSI/TIA-526-7 defines three reference methods, and the choice of method directly affects the measured insertion loss [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]:

**Method A — One-jumper reference (also: single-jumper or direct reference):**

Setup: Connect the launch jumper from the source to the meter adapter directly. The meter reading with this connection is set as the reference (0 dB baseline). The launch jumper's connector at the meter end is the reference point. After setting the reference, the fiber under test is inserted between the launch jumper and a separate receive jumper going into the meter.

Result: The measured insertion loss **includes** the loss of both the far-end launch-jumper-to-fiber connector and the far-end receive-jumper-to-meter connector. This method overstates the fiber loss by approximately one extra connector pair loss.

**Method B — Two-jumper reference:**

Setup: Connect a launch jumper from source to an adapter, then a short reference jumper through the adapter to the meter. Record the meter reading as the reference. After setting the reference, remove the reference jumper and insert the fiber under test between the launch jumper's free end and a receive jumper going to the meter.

Result: The measured insertion loss includes the connection at the launch end of the fiber under test and the connection at the receive end — the two connections that are actually part of the installed link. The reference jumper's two connections are zeroed out. **This is the most commonly used reference method for field acceptance testing** because it most closely represents the actual loss of the connectorized fiber link [ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9].

**Method C — Three-jumper reference:**

Setup: Connect source jumper → adapter 1 → middle jumper → adapter 2 → meter. Record as reference. Insert fiber under test in place of the middle jumper.

Result: Measured insertion loss **excludes** both end connectors of the fiber under test — only the fiber body and internal splices contribute to the measured loss. The end connectors are calibrated out by the reference. This understates total link loss compared to what the system actually sees at end-to-end.

**How reference method affects measured loss:**

For a fiber link with two end connectors each contributing 0.3 dB, plus 1.2 dB of internal splice and cable loss:

| Reference method | What's included in measured IL | Reported IL |
|---|---|---|
| Method A (one-jumper) | All internal + far-end connector × 2 | ~1.8 dB |
| Method B (two-jumper) | All internal + both end connectors | ~1.8 dB |
| Method C (three-jumper) | Internal only (cable + splices) | ~1.2 dB |

*Note: Methods A and B produce similar results in this example because both include the far-end connector pair. The key distinction between methods is which connections are zeroed in the reference step. On a specific link, the difference can be up to 0.5 dB between Method B and Method C. Always document which reference method was used in the test record* [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9].

**BICSI OSP-DRD and ANSI/TIA-526-7 requirement: Method B is the standard reference method for OSP field acceptance testing.** The two-jumper reference is required for all submissions to project owners [ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9].

### Step-by-Step: Two-Jumper Reference Procedure (ANSI/TIA-526-7 Method B)

This procedure applies to a single-mode fiber OS2 link tested at 1310 nm and 1550 nm with a matched PMLS pair. Use EXFO, Viavi, or Fluke PMLS equipment set to the correct wavelength and test standard [ANSI/TIA-526-7 §5.2; Viavi OSP Testing Note; Fluke FI-7000 Guide]:

**Equipment:**
- Calibrated light source (LS) — set to 1310 nm (then repeat at 1550 nm)
- Calibrated optical power meter (OPM)
- Launch jumper: SC/APC or LC/APC, OS2, same fiber type as the cable plant, ≥ 1 m
- Reference jumper: same type, ≥ 1 m (used only for the reference step)
- Receive jumper: same type, ≥ 1 m

**Reference step (do this once per wavelength per test session):**
1. Inspect and clean all connector end-faces (one-click cleaner or IPA + wipe).
2. Connect: LS → [launch jumper] → [mating adapter] → [reference jumper] → OPM.
3. Allow source to stabilize (typically 30–60 seconds from power-on).
4. Record the OPM reading as the reference power (in dBm). This is P_ref.
5. Press "Zero" or "Set Reference" on the OPM — subsequent readings will display loss in dB relative to P_ref.

**Measurement step (repeat for each fiber in the cable plant):**
1. Disconnect the reference jumper at the adapter between launch and reference.
2. Insert the fiber under test between the launch jumper adapter and a receive jumper that connects to the OPM.
3. The OPM now displays: (P_ref − P_fiber) = insertion loss in dB.
4. Record the insertion loss (in dB) at 1310 nm.
5. Switch source and meter to 1550 nm; repeat reference step; repeat measurement.

**Important:** If the source is moved or power-cycled during the test session, repeat the reference step. Temperature changes at the source or source output drift can shift P_ref by 0.2–0.5 dB if not recalibrated [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide].

### Acceptance Thresholds for PMLS Test Results

Per ANSI/TIA-526-7 and BICSI OSP-DRD, the end-to-end insertion loss measured by the PMLS method must be ≤ the calculated link loss budget for the specific route [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]:

```
Maximum allowed IL = (cable length × attenuation coefficient) + 
                     (number of splices × max splice IL) + 
                     (number of connectors × max connector IL)
```

Using the standard parameters:
- OS2 SMF at 1310 nm: ≤ 0.4 dB/km cable attenuation (ANSI/TIA-568.3-D specification maximum)
- Fusion splice: ≤ 0.10 dB/splice (BICSI default)
- Hardened OSP connector: ≤ 0.50 dB/mated pair (IEC 61753-1)

If the PMLS-measured IL exceeds the calculated budget, investigate the cause using the OTDR before re-testing.

### Four Common PMLS Measurement Errors

Understanding where PMLS testing goes wrong prevents rework [BICSI OSP-DRD Manual, Ch. 9; Viavi OSP Testing Note; Fluke FI-7000 Guide]:

**Error 1: Dirty reference jumper end-face.**
A contaminated reference jumper connector introduces loss in the reference step. When the reference jumper is then replaced by the fiber under test, the meter over-reads the fiber's actual loss by the amount of contamination loss that was in the reference connection. Always clean all connector end-faces before and after setting the reference.

**Error 2: Wrong reference method.**
If the technician sets the reference with three jumpers (Method C) but the project specification requires two-jumper reference (Method B), the reported loss is lower than the true link loss by approximately one connector pair. On a site where all results "passed" with Method C, the actual link loss may be above specification. Always confirm the reference method with the project specification before beginning tests.

**Error 3: Reference jumper degradation during the test session.**
Reference jumpers are frequently connected and disconnected. A reference jumper that was clean at the start of the session can develop end-face scratches after 20+ mating cycles. If the reference jumper degrades during the session, all subsequent measurements from that reference baseline are incorrect. Inspect reference jumpers after every 25–30 mating cycles and replace if end-face inspection shows scratches in the core contact zone per IEC 61300-3-35 criteria.

**Error 4: Source output drift (not re-referenced).**
PMLS sources can drift in output power, especially in the first 10–15 minutes after power-on (warm-up drift). If the reference is set before the source stabilizes, the reference power P_ref is incorrect. Allow ≥ 60 seconds of warm-up; use sources with stabilization LEDs (Fluke FI-7000, EXFO FLS series) that indicate when the source output is stable before setting the reference [Fluke FI-7000 Guide; ANSI/TIA-526-7 §5.2].

---

## Key Terms (Flashcard Candidates)

**dBm**
A unit of absolute optical power referenced to 1 milliwatt: Power (dBm) = 10 × log₁₀[P(mW)/1 mW]. Used to express the actual power level at a point in the fiber (source output, received power). Never confused with insertion loss, which is expressed in dB (a dimensionless ratio). [ANSI/TIA-526-7 §4]

**dB (in fiber testing context)**
A dimensionless unit expressing the ratio of two optical power levels: Loss (dB) = 10 × log₁₀[P_in/P_out] = P_in(dBm) − P_out(dBm). Insertion loss is always expressed in dB, not dBm. [ANSI/TIA-526-7 §4]

**Tier 1 testing**
PMLS-only insertion loss test per ANSI/TIA-526-7. Measures end-to-end link loss in dB; provides no spatial (per-event) information. Minimum required test for all installed fiber cable plants. Adequate for inside-plant and drop-level applications; insufficient for OSP backbone acceptance. [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9]

**Tier 2 testing**
Combined OTDR (per-event, bidirectional) + PMLS (end-to-end IL) test. Required for OSP backbone, feeder cable, and government/RUS infrastructure projects. Provides both spatial event location and end-to-end loss verification. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-568.3-D §6.6]

**Reference level (PMLS)**
The optical power reading established by connecting the calibrated source through a known reference configuration directly to the meter, then zeroing the meter. All subsequent loss readings are measured relative to this baseline. The reference procedure (Method A, B, or C per ANSI/TIA-526-7) determines which connections are included in or excluded from the measured loss. [ANSI/TIA-526-7 §5]

**Two-jumper reference (Method B)**
The standard ANSI/TIA-526-7 reference method for OSP field testing. Source → launch jumper → adapter → reference jumper → meter is calibrated as reference. The reference jumper is then removed and replaced by the fiber under test + receive jumper. Measured IL includes both end connectors of the installed link. Required by BICSI OSP-DRD for acceptance test submission. [ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]

**ANSI/TIA-526-7 (OFSTP-7)**
ANSI/TIA standard for measurement of optical power loss of installed single-mode fiber cable plants. Defines the Tier 1 PMLS test procedure, the three reference methods (Methods A, B, C), test wavelengths (1310 nm and 1550 nm for OS2 SMF), and the acceptance limit framework. The primary governing standard for SM OSP cable plant insertion loss testing. [ANSI/TIA-526-7]

**ANSI/TIA-526-14B (OFSTP-14)**
ANSI/TIA standard equivalent to TIA-526-7 for multimode fiber cable plant insertion loss measurement. Uses 850 nm and 1300 nm test wavelengths; the same Method A/B/C reference procedure framework applies. Not the primary standard for OS2 SMF OSP work but required on projects with legacy MMF segments. [ANSI/TIA-526-14B]

---

## Interactive: Scenario — Select Test Tier and Reference Method

### Scenario

Your company has three active projects. For each, select (a) the required test tier and (b) the correct reference method, with justification.

---

**Project 1:** A 6 km buried OS2 SMF feeder cable with 3 splice closures connecting a central office to a FDH. The project is a RUS-funded rural broadband expansion. The project specification states: "Optical fiber cable plants shall be tested in accordance with BICSI OSP-DRD Manual, Chapter 9 and ANSI/TIA-526-7."

**Answer:**
- **Test tier: Tier 2** — BICSI OSP-DRD requires Tier 2 (OTDR + PMLS) for OSP backbone/feeder. RUS-funded projects follow BICSI OSP-DRD documentation requirements. Tier 1 alone is insufficient for backbone acceptance on this contract.
- **Reference method: Method B (two-jumper)** — ANSI/TIA-526-7 and BICSI OSP-DRD specify Method B as the standard for OSP acceptance testing submissions to project owners.
[BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §5.2]

---

**Project 2:** New tenant premises cabling in an office building — 48 OS2 SMF horizontal runs, each ≤ 90 m, from IDF to workstation outlets. The project specification references ANSI/TIA-568.3-D.

**Answer:**
- **Test tier: Tier 1** — For inside-plant horizontal cabling per ANSI/TIA-568.3-D §6.6, Tier 1 (insertion loss only) is the minimum required test. Tier 2 is not required for premises horizontal runs.
- **Reference method: Method B (two-jumper)** — Method B is the ANSI/TIA-526-7 standard reference method regardless of tier; unless the project spec explicitly permits Method A or C, Method B is the default.
[ANSI/TIA-568.3-D §6.6; ANSI/TIA-526-7 §5.2]

---

**Project 3:** FTTH drop cable activation — connecting a 150 m pre-connectorized OS2 SMF drop from the FDT port to a subscriber NID. Field tech is activating individually, not a crew test.

**Answer:**
- **Test tier: Tier 1** — A single 150 m drop with two hardened connectors is a Tier 1 scenario. The OTDR would provide no meaningful event spacing data at this short distance (below most OTDR dead zone margins), and the project specification for FTTH drops typically requires only continuity and insertion loss verification at activation.
- **Reference method: Method B (two-jumper)** — For any documented PMLS test, Method B is the standard reference. A simpler field-verification approach (visual fault locator for continuity; PMLS at the FDT adapter for IL) is acceptable where the specification allows.
[ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]

---

## Multiple-Choice Quiz

---

**Q1.** A technician sets the PMLS reference using Method C (three-jumper reference) instead of the project-required Method B (two-jumper reference). Assuming each connector contributes 0.3 dB of insertion loss, by how much will the measured insertion loss be understated compared to a Method B measurement?

- A) 0 dB — reference methods A, B, and C produce identical results for calibrated equipment
- B) Approximately 0.3 dB — one connector pair is excluded from the measured loss **[CORRECT]**
- C) Approximately 0.6 dB — two connector pairs are excluded from the measured loss
- D) The measured loss will be overstated, not understated, because Method C uses more reference jumpers

*Rationale:*
- **A — Incorrect.** The three reference methods produce different measured insertion loss values because they calibrate out different numbers of connector connections. The choice of reference method is not arbitrary — each method includes or excludes different connectors from the measurement, resulting in up to approximately 0.5 dB difference between methods. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Correct.** Method C zeros out both end connectors of the fiber under test by including them in the three-jumper reference configuration. Method B zeros out the reference jumper connections but leaves the fiber-under-test end connectors in the measurement. The difference between Method C and Method B is approximately one connector pair loss (~0.3 dB for connectors within specification). Using Method C when Method B is required causes the reported IL to be lower than the true link IL — a potentially serious error that allows links to appear to pass when they are actually at or above their loss budget limit. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** Method C zeros out the specific two connectors in the middle reference jumper position — not all four connectors in the path. The difference between Method C (zero end connectors included) and Method B (two end connectors included) is approximately one connector-pair loss per end, net one pair difference ≈ 0.3 dB. Two full connector pairs (0.6 dB) would be the difference between Method C and a method that included two complete extra connector pairs, which is not the case here. [ANSI/TIA-526-7 §5]
- **D — Incorrect.** Method C produces lower measured insertion loss, not higher. By calibrating out the test fiber's end connectors in the reference step, Method C understates the total link loss. Using more jumpers in the reference does not increase the measured loss — it excludes those jumper connections from the loss measurement. [ANSI/TIA-526-7 §5]

---

**Q2.** A light source outputs −6 dBm. After setting a two-jumper Method B reference and inserting the fiber under test, the power meter reads −15.3 dBm. What is the insertion loss of the fiber link?

- A) 15.3 dB
- B) 6.0 dB
- C) 9.3 dB **[CORRECT]**
- D) −15.3 dB

*Rationale:*
- **A — Incorrect.** 15.3 dB would be the answer only if the reference level were 0 dBm (0 mW = 1 mW loss). The source output is −6 dBm, not 0 dBm. Recording the absolute dBm reading as a dB loss value is the classic dBm vs. dB confusion error. The meter reading of −15.3 dBm is an absolute power level, not an insertion loss. [ANSI/TIA-526-7 §4; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** 6.0 dB would be the answer only if the meter reading were −12 dBm (source − 6 dB = −6 − 6 = −12 dBm). The actual meter reading is −15.3 dBm, not −12 dBm. A reading of 6.0 dB incorrectly omits the full loss calculation. [ANSI/TIA-526-7 §4]
- **C — Correct.** Insertion loss (dB) = P_in(dBm) − P_out(dBm) = −6.0 − (−15.3) = −6.0 + 15.3 = **9.3 dB**. This is the correct insertion loss calculation: the difference between the source output (used as reference) and the received power, expressed as a positive dB value. The reference power after Method B calibration = −6 dBm (source output minus the reference jumper connections, which are zeroed); the meter displays the difference automatically if referenced correctly. [ANSI/TIA-526-7 §4–5; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** −15.3 dB is a negative loss value — there is no such thing as negative insertion loss (that would imply the fiber amplifies the signal). The negative sign here reflects the absolute power level in dBm, not a loss ratio. The insertion loss is a positive value. [ANSI/TIA-526-7 §4]

---

**Q3.** An OSP backbone feeder test result shows a PMLS end-to-end insertion loss that is within the calculated link budget, but the OTDR trace reveals one fusion splice with a bidirectional average of 0.14 dB. What is the correct acceptance decision, and what action is required?

- A) Accept — the end-to-end PMLS result passed the link budget; individual splice loss is only informational in Tier 2 testing
- B) Reject the splice — individual splice events must each pass their per-event threshold; 0.14 dB exceeds the ≤ 0.10 dB BICSI default; re-splice required **[CORRECT]**
- C) Accept — the OTDR reading of 0.14 dB is within the hardened connector acceptance limit of ≤ 0.50 dB
- D) Accept if the PMLS reading is ≤ the link budget; the per-splice threshold applies only to Tier 1 testing

*Rationale:*
- **A — Incorrect.** In Tier 2 testing, both the end-to-end PMLS result AND each per-event OTDR result must pass independently. Passing the end-to-end budget while failing a per-event threshold is not an acceptable outcome — the project owner receives OTDR traces showing each event, and individual event failures are documented and subject to remedy. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §6]
- **B — Correct.** The per-event OTDR acceptance threshold for fusion splices is ≤ 0.10 dB (BICSI OSP-DRD default; IEC 61300-3-4 §5). A bidirectional average of 0.14 dB exceeds this threshold. The splice must be re-spliced, tested again with bidirectional OTDR to confirm the new reading is ≤ 0.10 dB, and the test record updated. The fact that the end-to-end PMLS result passed does not waive the per-event splice threshold. [BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §5]
- **C — Incorrect.** 0.14 dB is the fusion splice reading, not a hardened connector reading. The ≤ 0.50 dB limit applies to hardened outdoor connectors per IEC 61753-1, not to fusion splices. Applying the connector threshold to a splice reading is an error. [IEC 61753-1; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** Per-splice OTDR thresholds apply to Tier 2 testing specifically — Tier 2's defining characteristic is that it measures and documents per-event loss in addition to end-to-end loss. The claim that per-splice thresholds apply only to Tier 1 is backwards. Tier 1 does not include OTDR and cannot measure per-splice loss at all. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-568.3-D §6.6]

---

**Q4.** A technician sets the Method B reference, then unplugs and re-plugs the source cable at the source output to move the instrument to a different part of the building. The next fiber measurement shows a loss 0.4 dB lower than expected. What is the most likely cause?

- A) The receive jumper was damaged when the source was moved
- B) The source output level changed when the cable was unplugged and re-plugged, causing the reference to no longer reflect the current source output power **[CORRECT]**
- C) The fiber under test has lower insertion loss than expected because it was cleaned before testing
- D) The power meter battery voltage dropped, causing the meter to under-read power

*Rationale:*
- **A — Incorrect.** A damaged receive jumper would cause the loss reading to be higher (more loss through a damaged jumper), not lower. And the receive jumper typically remains connected at the meter end; it would not be disturbed by moving the source. [Fluke FI-7000 Guide; ANSI/TIA-526-7 §5.2]
- **B — Correct.** When the source cable was unplugged and re-plugged, the optical connection between the source and the launch jumper changed slightly — the connector may have re-mated at a slightly different angle, changing the launch efficiency and the actual source output power entering the launch jumper. This means the current P_ref is no longer the actual source output: the reference baseline is stale. The meter is now reporting loss relative to a P_ref that is ~0.4 dB higher than the current actual source output, making every measurement appear 0.4 dB lower than it should be. The correct action: repeat the reference step before continuing measurements. [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** Cleaning a fiber before testing should produce accurate results, not anomalously low readings. A clean end-face is the correct preparation, not a source of measurement error that shifts all readings uniformly lower. [BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** Modern PMLS power meters display a low-battery warning and do not silently under-read due to low battery voltage. A 0.4 dB uniform offset across all readings is more consistent with a reference drift issue than with a battery problem, which would typically cause display errors or instrument shutdown rather than calibrated readings offset by a specific amount. [Fluke FI-7000 Guide]

---

**Q5.** A project specification requires Tier 2 testing at 1310 nm only for a 10 km OS2 SMF backbone run. Your testing supervisor tells you to skip the 1550 nm test to save time. What is the risk of this shortcut?

- A) No risk — ANSI/TIA-526-7 only requires testing at 1310 nm for OS2 SMF
- B) Minor risk — 1550 nm loss is almost always lower than 1310 nm for OS2 SMF, so 1310 nm is the conservative test
- C) Significant risk — ANSI/TIA-526-7 requires both 1310 nm and 1550 nm for OS2 SMF; skipping 1550 nm may miss macrobend-induced attenuation that is invisible at 1310 nm **[CORRECT]**
- D) No risk — 1550 nm testing is only required for Tier 1; Tier 2 uses OTDR at 1310 nm only

*Rationale:*
- **A — Incorrect.** ANSI/TIA-526-7 specifies test wavelengths for OS2 SMF as both 1310 nm and 1550 nm. A test that only covers 1310 nm does not satisfy ANSI/TIA-526-7 requirements for OS2 SMF cable plant acceptance. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]
- **B — Partially correct but misleading.** It is true that OS2 SMF typically has lower absolute attenuation at 1550 nm than at 1310 nm under ideal conditions. However, this does not mean 1310 nm is always conservative — the two wavelengths test for different failure modes. The risk captured by "C" is the operative concern. [ANSI/TIA-526-7 §3]
- **C — Correct.** Both 1310 nm and 1550 nm are required for OS2 SMF per ANSI/TIA-526-7. The critical reason: macrobend-induced loss is wavelength-dependent and is significantly higher at 1550 nm than at 1310 nm for a given bend radius. A cable section with a tight bend (exceeding minimum bend radius) may show nearly normal loss at 1310 nm while showing elevated loss at 1550 nm — the bend is invisible in the 1310 nm test. If the link will carry 1550 nm wavelength traffic (Ethernet long-haul, CWDM, GPON downstream at 1490 nm, RF overlay at 1550 nm), a bend that passes 1310 nm may still degrade the operational traffic wavelength. Testing both wavelengths is mandatory, not optional. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9; Viavi OSP Testing Note]
- **D — Incorrect.** The requirement to test both wavelengths applies to both Tier 1 and Tier 2 for OS2 SMF. OTDR testing in Tier 2 is also typically conducted at both wavelengths (1310 nm and 1550 nm) on modern OTDRs to detect wavelength-dependent losses such as macrobends. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]

---

## Final Check

Answer these questions before advancing to Lesson 2.12 (Acceptance Testing and As-Built Documentation).

**Pulse 1.** In one sentence each, distinguish Tier 1 from Tier 2 testing. For each, state one scenario where it is the minimum required tier.

*Expected answer:* **Tier 1** — PMLS insertion loss only; measures end-to-end loss but provides no spatial (per-event) data; required as minimum for all installed fiber cable plants including inside-plant horizontal cabling. **Tier 2** — OTDR (bidirectional, per-event) plus PMLS (end-to-end); required for OSP backbone, feeder cables, and all government/RUS infrastructure projects per BICSI OSP-DRD. [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9]

**Pulse 2.** A source outputs −5 dBm. After Method B reference calibration and insertion of the fiber under test, the meter reads −17.8 dBm. What is the insertion loss?

*Expected answer:* IL = −5.0 − (−17.8) = −5.0 + 17.8 = **12.8 dB**. [ANSI/TIA-526-7 §4]

**Pulse 3.** Why must the reference step be repeated after moving or reconnecting the light source during a PMLS test session?

*Expected answer:* Any interruption of the optical connection between the source and launch jumper (re-mating, moving the source) can change the actual power coupled into the launch jumper — the source output entering the fiber is no longer the same as when the reference was set. If the reference is not re-established, all subsequent loss readings are offset from the true fiber loss by the amount that the source coupling changed. The reference must be re-set to recalibrate the zero baseline to the current source output level. [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Tier 1 / Tier 2 testing** → Lesson 2.12 (Acceptance Testing — the acceptance documentation package specifies the tier(s) completed; Tier 2 documentation includes both OTDR and PMLS records)
- **ANSI/TIA-526-7** → Lesson 2.10 (OTDR Testing — same standard governs the OTDR indirect insertion loss measurement method used in Tier 2); Lesson 2.12 (Acceptance Testing — required test standard reference in as-built documentation)
- **dBm / dB distinction** → Lesson 2.12 (Acceptance Testing — test records must correctly report IL in dB, not record dBm readings as loss values)
- **Method B reference** → Lesson 2.12 (Acceptance Testing — reference method must be documented in the acceptance test package)
- **Insertion loss acceptance threshold** → Lesson 2.2 (Fusion Splicing I — link budget uses these thresholds); Lesson 2.9 (Hardened Connectors — IEC 61753-1 connector loss limit); Lesson 2.10 (OTDR Testing — per-event thresholds from OTDR align with the total budget checked by PMLS)
