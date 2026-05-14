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

## In Plain English

After you've spliced a fiber and coiled everything neatly in the tray, someone still has to ask: *does light actually get from one end to the other, and how much of it is being lost along the way?*

That's what this lesson is about. The simplest version of fiber testing — **PMLS testing** (Power Meter and Light Source) — is exactly what it sounds like: you shine light in one end and measure how much comes out the other end. The difference tells you the loss. Think of it like testing a hose for leaks: you turn the water on at one end with a known pressure, measure the pressure at the far end, and the drop tells you how much the hose is leaking.

The important math here involves two units that sound similar but are completely different: **dBm** (the actual power level of the light at a point in the fiber — like the water pressure at a specific spot in the pipe) and **dB** (the *difference* in power between two points — like the pressure *drop* across the pipe). Mixing them up is the single most common mistake in fiber testing.

This lesson also covers **Tier 1 vs. Tier 2** testing — the difference between a basic pass/fail light-level test (Tier 1) and the full professional test required for government contracts and backbone fiber (Tier 2, which also uses an OTDR). And it covers the critical **reference method** — how you calibrate the meter before you start measuring, and why the wrong calibration method makes all your numbers wrong.

---

## Acronym Glossary

Every abbreviation in this lesson, defined up front.

| Acronym | Stands For | What It Means in Plain English |
|---|---|---|
| **PMLS** | Power Meter and Light Source | The two-instrument combo used for basic fiber loss testing — a calibrated flashlight on one end, a calibrated light sensor on the other |
| **dBm** | Decibels referenced to 1 milliwatt | A unit for expressing *how bright* the light is at a specific point — an absolute level, not a comparison. Like saying the water pressure is 60 PSI. |
| **dB** | Decibel (ratio, no reference) | A unit for expressing *how much* the light level dropped between two points — a comparison, not an absolute level. Like saying the pressure dropped 15 PSI between inlet and outlet. |
| **IL** | Insertion Loss | The amount of light lost as it travels through a fiber span — expressed in dB. Lower is better. The thing PMLS testing measures. |
| **OTDR** | Optical Time-Domain Reflectometer | A test instrument that fires light pulses and reads reflections to map losses along the fiber, like a sonar. Covered in Lesson 2.10. Required for Tier 2 testing. |
| **SMF** | Single-Mode Fiber | Fiber with a very narrow core (~9 µm) used for long-distance OSP runs |
| **OS2** | Optical Single-mode 2 | The standard single-mode fiber type for OSP backbone and feeder runs |
| **MMF** | Multi-Mode Fiber | Fiber with a wider core used for shorter runs — data centers, buildings |
| **RUS** | Rural Utilities Service | USDA agency that funds rural broadband construction and sets documentation requirements |
| **OSP** | Outside Plant | Any fiber infrastructure installed outdoors |
| **OSP-DRD** | Outside Plant Design Reference and Design Manual | BICSI's master reference for fiber installation, testing, and documentation |
| **BICSI** | Building Industry Consulting Service International | The organization that publishes OSP installation standards |
| **ANSI** | American National Standards Institute | US standards body |
| **TIA** | Telecommunications Industry Association | Publishes US fiber testing standards (TIA-526-7, TIA-526-14B, etc.) |
| **FDT** | Fiber Distribution Terminal | The outdoor cabinet where feeder fiber connects to drop cables |
| **NID** | Network Interface Device | The box on the outside of a building where the drop cable terminates |
| **IDF** | Intermediate Distribution Frame | A network equipment cabinet, usually inside a building, that connects horizontal and backbone cabling |
| **CWDM** | Coarse Wavelength Division Multiplexing | A technique for sending multiple data channels on one fiber using different wavelengths (colors) of light |
| **GPON** | Gigabit Passive Optical Network | The fiber access technology used for most FTTH deployments — uses 1490 nm downstream and 1310 nm upstream |
| **nm** | Nanometer | A unit of wavelength. 1 nm = one billionth of a meter. OSP fiber testing uses 1310 nm and 1550 nm wavelengths — two specific "colors" of near-infrared light invisible to the human eye. |

---

## Reading Content

### The Simplest Test in Fiber Optics — And the Easiest to Screw Up

PMLS testing measures one thing: how much light gets from one end of the fiber to the other. A calibrated light source on one end injects optical power at a known wavelength and level. A power meter at the far end measures how much arrives. The ratio of output power to received power, expressed in dB, is the insertion loss.

PMLS testing is faster than OTDR testing, requires a technician at each end of the link (one at each end, usually communicating by phone), and provides an end-to-end pass/fail number. What it does NOT provide: any information about where the loss is occurring. If your fiber fails PMLS, you know you have a loss problem — but you don't know if it's a dirty connector at position 12, a bad splice at kilometer 4, or a kink in the cable somewhere in between. That's what OTDR is for.

Understanding when each tier is required — and how to execute the PMLS test correctly — is essential for OSP acceptance testing. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §1]

### The dBm vs. dB Distinction — The Most Common Mistake in Fiber Testing

Before covering the test procedures, we need to get this unit confusion sorted out, because it's the single most common source of errors in PMLS testing. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §4]

**Think of a water pipe analogy:**
- The water pressure at any specific point in the pipe (e.g., 60 PSI at the input) = **dBm** (an absolute level at a specific point)
- The pressure drop from input to output (e.g., 15 PSI lost along the way) = **dB** (a difference between two points)

You can't say "there is 60 PSI of loss in this pipe." That doesn't make sense — 60 PSI is the inlet pressure, not the loss. The loss is how much less you have at the outlet compared to the inlet.

Same with fiber:
- **dBm = absolute optical power at a specific point.** What is the actual light level here, right now? A typical PMLS light source outputs something in the range of −5 dBm to −10 dBm. Your power meter displays the received power in dBm.
- **dB = ratio between two power levels.** How much less power arrived than was sent? This is what insertion loss is.

**The dBm formula — for reference (you don't need to memorize this, but it helps to understand it):**

> **What it calculates:** Converts a physical power in milliwatts (mW) into the dBm scale.
>
> **Why this scale exists:** dBm makes large and small numbers manageable. Fiber light levels span a factor of 100,000 or more from source to receiver — that's clunky to work with in raw watts. The dBm log scale compresses the range into numbers between about −60 and +10.

$$\text{Power (dBm)} = 10 \times \log_{10}\left[\frac{P\text{ (mW)}}{1\text{ mW}}\right]$$

**Every variable defined:**
- **Power (dBm)** = the result: the power expressed in decibels referenced to 1 milliwatt
- **P (mW)** = the actual physical power in milliwatts
- **1 mW** = the reference level (1 milliwatt = 0 dBm by definition)
- **log₁₀** = the base-10 logarithm (the "log" button on a calculator)
- **10 ×** = a scaling factor that converts the log result into decibels

**Quick worked examples:**

| P (mW) | Calculation | P (dBm) | Plain English |
|---|---|---|---|
| 1 mW | 10 × log(1/1) = 10 × 0 | **0 dBm** | Reference level |
| 0.5 mW | 10 × log(0.5/1) = 10 × (−0.301) | **−3 dBm** | Half power = −3 dB drop |
| 0.001 mW (1 µW) | 10 × log(0.001/1) = 10 × (−3) | **−30 dBm** | One-thousandth of a milliwatt |

**Sanity check:** Every time you cut the power in half, you lose 3 dB. Every time you divide by 10, you lose 10 dB. 0 dBm = 1 mW. −10 dBm = 0.1 mW. −20 dBm = 0.01 mW. −30 dBm = 0.001 mW. This pattern is the key to reading fiber power meters.

**The insertion loss formula — this is the one you USE every day:**

> **What it calculates:** How much signal was lost between the input and the output of the fiber span.
>
> **Why it matters:** This is the test result. If insertion loss is below the project's acceptance threshold, the fiber passes. Above it, investigate and fix.

$$\text{IL (dB)} = P_\text{in}\text{(dBm)} - P_\text{out}\text{(dBm)}$$

**Every variable defined:**
- **IL (dB)** = the insertion loss, expressed in decibels (positive number means loss — output is lower than input)
- **P_in (dBm)** = the reference power level — what the source sent (or what you measured during the reference calibration step)
- **P_out (dBm)** = what the meter reads at the far end of the fiber
- The subtraction works because of log math: log(A/B) = log(A) − log(B)

**Worked example — correct calculation:**

A light source outputs −7.0 dBm. The power meter at the far end reads −14.5 dBm after reference calibration (more on what "reference calibration" means below).

Step 1 — Identify P_in and P_out:
- P_in = −7.0 dBm (the reference level — what the source sent)
- P_out = −14.5 dBm (what the meter reads at the far end)

Step 2 — Apply the formula:
$$\text{IL} = P_\text{in} - P_\text{out} = -7.0 - (-14.5) = -7.0 + 14.5 = \mathbf{7.5 \text{ dB}}$$

**Sanity check:** The fiber link loses 7.5 dB — meaning the light arriving at the far end has about 1/5th the power of what was sent. (7.5 dB ≈ 5.6× reduction in power.) For a typical 5–10 km OSP route with a budget of 10–15 dB, a 7.5 dB measured loss would likely pass. For a short 1 km drop, 7.5 dB would probably fail — that's a lot of loss for 1 km.

**The incorrect reading that causes failures:**

Someone who doesn't understand the dBm vs. dB distinction reads the meter showing −14.5 dBm and writes down "insertion loss = 14.5 dB." That's wrong — they've recorded the absolute received power level (in dBm) as if it were the loss. The actual loss is 7.5 dB. If the acceptance threshold is 8 dB, the "14.5 dB" reading would falsely fail a link that's actually fine. This error happens constantly in the field. [ANSI/TIA-526-7 §4; BICSI OSP-DRD Manual, Ch. 9]

### Test Tiers: Tier 1 vs. Tier 2

Think of Tier 1 and Tier 2 like the difference between a home electrical inspection and a full commercial building inspection. Tier 1 tells you whether the lights turn on (pass/fail end-to-end). Tier 2 tells you the condition of every circuit and where every wire runs (full audit). [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §1]

**Tier 1 — Insertion loss only (PMLS):**
- **Equipment:** calibrated optical power meter + matched light source
- **What you measure:** end-to-end insertion loss in dB
- **What you DON'T get:** any information about where the loss occurs
- **Standards:** ANSI/TIA-526-7 for OS2 SMF; ANSI/TIA-526-14B for MMF
- **Wavelengths:** 1310 nm AND 1550 nm for OS2 SMF (both required)
- **When it's the right choice:** inside-plant cabling, FTTH drop activation, any project where the spec only requires insertion loss documentation

**Tier 2 — OTDR + Insertion loss (PMLS + OTDR):**
- **Equipment:** OTDR (for spatial event analysis, covered in Lesson 2.10) + PMLS (for end-to-end verification)
- **What you measure:** per-event splice and connector loss (from OTDR) AND end-to-end link loss (from PMLS)
- **What you get extra:** location of every loss event along the route; individual splice quality scores; ability to find and locate faults
- **When it's required:** all OSP backbone and feeder cable plants; government/RUS projects; any project specification that explicitly requires Tier 2
- **Why Tier 1 alone isn't enough for backbone:** you can't tell if one splice is terrible while others are perfect — the total might pass while an individual splice that will degrade faster than expected is hidden inside a number that averages out fine

**Quick decision table:**

| Application | Tier | Standard/Authority |
|---|---|---|
| Inside-plant horizontal cabling | Tier 1 minimum | ANSI/TIA-568.3-D §6.6 |
| Inside-plant backbone | Tier 1 minimum; Tier 2 recommended | ANSI/TIA-568.3-D §6.6 |
| OSP distribution plant (FDT to NID) | Tier 1 typically sufficient | BICSI OSP-DRD Manual, Ch. 9 |
| OSP backbone / feeder cable | **Tier 2 required** | BICSI OSP-DRD Manual, Ch. 9 |
| RUS / government infrastructure | **Tier 2 required** | BICSI OSP-DRD Manual, Ch. 9; project specs |
| BICSI certification compliance | **Tier 2 required** | BICSI OSP-DRD Manual, Ch. 9 |

*Sources: [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §1]*

### Reference Methods — The Calibration Step That Changes Everything

Before measuring insertion loss, you have to calibrate the system. The calibration tells the power meter what "zero loss" looks like — what power level means "nothing was lost." Once you have that baseline, everything lower is measured as loss.

But here's the critical decision: **what connections do you include in the calibration, and what connections do you leave for the actual measurement?** ANSI/TIA-526-7 defines three ways to do this (Method A, B, and C), and the choice changes your results by as much as ~0.6 dB. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]

Imagine you're measuring the water pressure drop across a pipe segment. You need to account for the fittings at each end. Do you measure the pressure WITH the end fittings included, or do you zero out the end fittings in the calibration so they don't show up in your result? That choice is exactly the Method A/B/C decision for fiber.

**Method A — One-jumper reference (single-jumper):**

Calibration setup: Connect source → launch jumper → meter. Record that power level as reference.
Then: Disconnect the launch jumper from the meter, insert the fiber under test + a receive jumper, and re-connect to the meter.
Result: The measured loss includes the two end-connections of the fiber under test AND the receive jumper. This overstates the fiber's own loss by including extra connector loss.

**Method B — Two-jumper reference (THE STANDARD for OSP field testing):**

Calibration setup: Connect source → launch jumper → [adapter] → reference jumper → meter. Record that power level as reference.
Then: Remove the reference jumper and replace it with the fiber under test + receive jumper.
Result: The measured loss includes exactly the two end connections of the installed link — the connection at the launch end of the fiber and the connection at the receive end. The reference jumper's two connections are zeroed out. **This is what the project owner actually wants to know: how much loss is in the installed fiber path, including its end connectors.**

This is the required method for OSP acceptance testing per ANSI/TIA-526-7 §5.2 and BICSI OSP-DRD. [ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]

**Method C — Three-jumper reference:**

Calibration setup: Connect source → jumper 1 → adapter 1 → middle jumper → adapter 2 → jumper 3 → meter. Record as reference.
Then: Remove the middle jumper, insert fiber under test.
Result: Both end connectors of the fiber under test are zeroed out in the calibration. You're only measuring the cable body and internal splices — not the end connectors. This understates total link loss by approximately one connector pair (~0.6 dB).

**Why the method matters — worked example:**

Suppose a fiber link has two end connectors each contributing 0.3 dB, plus 1.2 dB of cable attenuation and splice loss:

| Reference method | What's in the measurement | Reported IL |
|---|---|---|
| Method B (two-jumper) | Cable + splices + both end connectors | ~1.8 dB |
| Method C (three-jumper) | Cable + splices only (no end connectors) | ~1.2 dB |

**Sanity check:** If the project's acceptance threshold is 1.5 dB, Method B (correct) correctly fails this link at 1.8 dB. Method C (wrong) incorrectly passes it at 1.2 dB. A link with a bad end connector could silently pass acceptance testing if Method C is used when Method B was required. Always confirm the reference method with the project specification before beginning tests, and always document which method was used. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]

### Step-by-Step: Two-Jumper Reference Procedure (ANSI/TIA-526-7 Method B)

This is the procedure you'll use for OSP backbone acceptance testing. Walk through it once per test session, per wavelength. [ANSI/TIA-526-7 §5.2; Viavi OSP Testing Note; Fluke FI-7000 Guide]

**Equipment you need:**
- Calibrated light source (LS) — set to 1310 nm first, then repeat at 1550 nm
- Calibrated optical power meter (OPM)
- Launch jumper: SC/APC or LC/APC, OS2, ≥ 1 m
- Reference jumper: same connector type, ≥ 1 m (only used for the calibration step — not connected to the fiber under test)
- Receive jumper: same connector type, ≥ 1 m (connects the far end of the fiber to the meter)

**The reference (calibration) step — do once per wavelength per test session:**

1. **Inspect and clean every connector end-face** before anything touches anything. One-click cleaner or IPA wipe. Every connection. This is not optional — a dirty reference jumper gives you a wrong baseline.

2. **Connect:** Source → [launch jumper] → [mating adapter] → [reference jumper] → meter.
   (This is the "two-jumper" path: launch jumper + reference jumper, connected through one adapter.)

3. **Warm up the source.** Wait 5–15 minutes. DO NOT record the reference until the source stabilizes — laser sources have warm-up drift. Most professional meters (Fluke FI-7000, EXFO FLS) show a "stable" indicator; wait for it. Rushing this step gives you a reference that's off by 0.2–0.5 dB.

4. **Record the meter reading.** This is P_ref — your "zero loss" baseline in dBm.

5. **Press "Zero" or "Set Reference" on the OPM.** The meter now displays loss relative to P_ref. Any lower reading = that much insertion loss.

**The measurement step — repeat for each fiber:**

1. Disconnect the reference jumper at the adapter between launch and reference.
2. Connect: [launch jumper adapter] → [fiber under test (one end)] → [fiber under test (other end)] → [receive jumper] → OPM.
3. The meter now displays: P_ref − P_fiber = insertion loss in dB.
4. Record the displayed dB value at 1310 nm.
5. Switch both source and meter to 1550 nm, repeat the reference step, repeat the measurement.

**The rule you cannot skip:** If the source is moved, the source cable is disconnected and reconnected, or the source is power-cycled during the session — **repeat the reference step before measuring again.** Any re-mating of the source connection can change the optical coupling efficiency and shift P_ref by up to 0.4 dB. A stale reference makes every downstream measurement wrong. [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide]

### Acceptance Thresholds for PMLS Test Results

The measured end-to-end insertion loss must be ≤ the calculated link loss budget for the specific route [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]:

$$\text{Maximum allowed IL} = (\text{length} \times \text{cable attenuation/km}) + (N_\text{splices} \times \text{max splice IL}) + (N_\text{connectors} \times \text{max connector IL})$$

**Every variable defined:**
- **length** = total cable length of the route, in km
- **cable attenuation/km** = how much loss per kilometer for this fiber type. For OS2 SMF at 1310 nm: ≤ 0.4 dB/km per ANSI/TIA-568.3-D. (This is the specification maximum — quality cable typically runs 0.32–0.35 dB/km.)
- **N_splices** = number of fusion splices in the route
- **max splice IL** = maximum allowed loss per splice. BICSI default: ≤ 0.10 dB per splice
- **N_connectors** = number of mated connector pairs in the route (each plug-in-adapter-plug pair counts as one)
- **max connector IL** = maximum allowed loss per connector pair. Hardened OSP: ≤ 0.50 dB per pair

**Worked example for a 5 km route with 3 splice closures and 2 connectorized ends:**
$$\text{Max IL} = (5 \times 0.4) + (3 \times 0.10) + (2 \times 0.50) = 2.0 + 0.3 + 1.0 = \mathbf{3.3 \text{ dB}}$$

Sanity check: If the PMLS test returns 2.8 dB — passes (2.8 < 3.3). If it returns 3.6 dB — fails (3.6 > 3.3 = there's something wrong somewhere in the route, need OTDR to find it).

If the PMLS-measured IL exceeds the calculated budget, don't just re-test hoping the number improves — investigate with the OTDR to find where the extra loss is coming from before re-testing.

### Four Common PMLS Measurement Errors

Knowing what goes wrong prevents the mistakes. [BICSI OSP-DRD Manual, Ch. 9; Viavi OSP Testing Note; Fluke FI-7000 Guide]

**Error 1: Dirty reference jumper end-face.**
A contaminated reference jumper connector introduces loss in the calibration step. The meter zeros against a baseline that's already degraded. When the clean fiber under test is substituted, the meter shows less loss than actually exists in the reference path — but more importantly, the baseline P_ref is wrong. Clean every end-face before the reference step. Inspect reference jumpers every 25–30 mating cycles and replace if the core zone shows scratches.

**Error 2: Wrong reference method.**
If the technician uses Method C when Method B is required, the reported loss is ~0.6 dB lower than the true link loss. Links near the acceptance threshold falsely pass. Always confirm the method with the project spec before starting. Document the method used in the test record — it's a required field.

**Error 3: Reference jumper degradation mid-session.**
Reference jumpers get mated and demated repeatedly. After 20+ cycles in the field, the polished end-face can develop micro-scratches. A jumper that was clean at 8 AM may be marginal by noon. If your results start drifting unexpectedly — inspect the reference jumper end-face. Replace if it fails IEC 61300-3-35 core zone criteria.

**Error 4: Source output drift — not re-referenced.**
PMLS sources drift during warm-up (first 10–15 minutes after power-on) and can shift slightly whenever the source cable is disconnected and re-mated. If the reference is set before the source stabilizes, P_ref is wrong — all measurements are offset by the warm-up drift amount. Solution: (a) always wait for the source stabilization indicator, (b) repeat the reference step any time the source is disturbed. [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide]

---

## Key Terms (Flashcard Candidates)

**dBm**
A unit of absolute optical power referenced to 1 milliwatt: Power (dBm) = 10 × log₁₀[P(mW)/1 mW]. *In plain English: the "pressure gauge" reading at a specific point in the fiber — tells you how bright the light is there, not how much was lost.* Never confused with insertion loss, which is in dB (a ratio). [ANSI/TIA-526-7 §4]

**dB (in fiber testing)**
A dimensionless unit expressing the ratio of two optical power levels: Loss (dB) = P_in(dBm) − P_out(dBm). *In plain English: the "pressure drop" across the fiber span — how much light power was lost between input and output.* Insertion loss is always expressed in dB. [ANSI/TIA-526-7 §4]

**Tier 1 testing**
PMLS-only insertion loss test per ANSI/TIA-526-7. Measures end-to-end link loss in dB; no spatial (per-event) information. *In plain English: the lights-on / lights-off test — tells you if the fiber passes total loss, but not where any problems are.* Minimum required for all installed fiber plants; insufficient alone for OSP backbone. [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9]

**Tier 2 testing**
Combined OTDR (per-event, bidirectional) + PMLS (end-to-end IL) test. *In plain English: the full inspection — individual splice and connector scores plus total loss verification.* Required for OSP backbone, feeder cable, and all government/RUS projects. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-568.3-D §6.6]

**Reference level (PMLS)**
The optical power reading established by connecting the calibrated source through a known reference configuration directly to the meter, then zeroing the meter. *In plain English: telling the meter "this is what zero loss looks like" before you start measuring.* Method A/B/C determines which connections are included or excluded from this baseline. [ANSI/TIA-526-7 §5]

**Two-jumper reference (Method B)**
The standard ANSI/TIA-526-7 reference method for OSP field testing. Source → launch jumper → adapter → reference jumper → meter is calibrated as reference; reference jumper then removed and replaced by fiber under test + receive jumper. *In plain English: the "fair test" calibration that includes both end connectors of the installed link in the measurement — which is what the project owner actually needs to know.* Required by BICSI OSP-DRD for acceptance testing. [ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]

**ANSI/TIA-526-7 (OFSTP-7)**
The ANSI/TIA standard for measuring insertion loss on installed single-mode fiber cable plants. Defines Tier 1 PMLS test procedure, Methods A/B/C reference procedures, test wavelengths (1310 nm AND 1550 nm for OS2 SMF), and the acceptance limit framework. *In plain English: the rulebook for how to correctly run a fiber loss test on SM fiber.* [ANSI/TIA-526-7]

**ANSI/TIA-526-14B (OFSTP-14)**
The equivalent standard for multimode fiber (MMF) cable plant insertion loss measurement. Uses 850 nm and 1300 nm test wavelengths. *Same Method A/B/C framework as TIA-526-7.* Not the primary standard for OS2 SMF OSP work, but required on projects with legacy MMF segments. [ANSI/TIA-526-14B]

---

## Interactive: Scenario — Select Test Tier and Reference Method

### Scenario

Your company has three active projects. For each, select (a) the required test tier and (b) the correct reference method, with justification.

---

**Project 1:** A 6 km buried OS2 SMF feeder cable with 3 splice closures connecting a central office to a FDH. The project is a RUS-funded rural broadband expansion. The project spec states: "Optical fiber cable plants shall be tested per BICSI OSP-DRD Manual, Chapter 9 and ANSI/TIA-526-7."

**Answer:**
- **Test tier: Tier 2** — BICSI OSP-DRD requires Tier 2 (OTDR + PMLS) for OSP backbone/feeder. RUS-funded projects follow BICSI OSP-DRD requirements. Tier 1 alone is insufficient.
- **Reference method: Method B (two-jumper)** — ANSI/TIA-526-7 and BICSI OSP-DRD specify Method B as the standard for OSP acceptance testing submissions.
[BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §5.2]

---

**Project 2:** New tenant premises cabling — 48 OS2 SMF horizontal runs, each ≤ 90 m, from IDF to workstation outlets. The project spec references ANSI/TIA-568.3-D.

**Answer:**
- **Test tier: Tier 1** — Inside-plant horizontal cabling per ANSI/TIA-568.3-D §6.6 requires Tier 1 minimum. Tier 2 not required.
- **Reference method: Method B (two-jumper)** — Method B is the standard regardless of tier. Unless the spec explicitly permits Method A or C, Method B is the default.
[ANSI/TIA-568.3-D §6.6; ANSI/TIA-526-7 §5.2]

---

**Project 3:** FTTH drop cable activation — connecting a 150 m pre-connectorized OS2 SMF drop from the FDT port to a subscriber NID. Single field tech performing the activation.

**Answer:**
- **Test tier: Tier 1** — A 150 m drop with two hardened connectors is Tier 1. OTDR dead zones at this distance make Tier 2 impractical, and most FTTH project specs only require insertion loss verification at drop activation.
- **Reference method: Method B (two-jumper)** — For any documented PMLS test, Method B is the standard.
[ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]

---

## Multiple-Choice Quiz

---

**Q1.** A technician sets the PMLS reference using Method C (three-jumper reference) instead of the project-required Method B (two-jumper reference). Assuming each connector contributes 0.3 dB of insertion loss, by how much will the measured insertion loss be understated compared to a Method B measurement?

- A) 0 dB — reference methods A, B, and C produce identical results for calibrated equipment
- B) Approximately 0.3 dB — one connector pair is excluded from the measured loss
- C) Approximately 0.6 dB — two connector pairs are excluded from the measured loss **[CORRECT]**
- D) The measured loss will be overstated, not understated, because Method C uses more reference jumpers

*Rationale:*
- **A — Incorrect.** The three reference methods produce different measured insertion loss values because they calibrate out different numbers of connector connections. The choice of reference method is not arbitrary — each includes or excludes different connectors from the measurement. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** 0.3 dB (one connector pair) would be the difference if Method C excluded only one end connector relative to Method B. In fact, Method C excludes both FUT end connectors — the connector at the launch end AND the connector at the receive end are both zeroed into the three-jumper reference. The delta is two connector pairs, not one. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]
- **C — Correct.** Method C zeroes out both end connectors of the fiber under test by including them in the reference path. Method B zeroes out only the reference jumper connections, leaving both FUT end connectors in the measured loss. The difference is two connector pairs × 0.3 dB = **0.6 dB**. This is confirmed by the lesson reference table (Method B ~1.8 dB, Method C ~1.2 dB on the same link). Using Method C when Method B is required understates link loss by ~0.6 dB — links near the budget limit may falsely appear to pass. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** Method C produces lower measured insertion loss, not higher. By calibrating out both FUT end connectors, Method C understates total link loss relative to Method B. [ANSI/TIA-526-7 §5]

---

**Q2.** A light source outputs −6 dBm. After setting a two-jumper Method B reference and inserting the fiber under test, the power meter reads −15.3 dBm. What is the insertion loss of the fiber link?

- A) 15.3 dB
- B) 6.0 dB
- C) 9.3 dB **[CORRECT]**
- D) −15.3 dB

*Rationale:*
- **A — Incorrect.** 15.3 dB would be the answer only if the reference level were 0 dBm (= 1 mW). The source output is −6 dBm, not 0 dBm. Recording the absolute dBm reading as a dB loss value is the classic dBm vs. dB confusion error. The meter reading of −15.3 dBm is an absolute power level, not an insertion loss. [ANSI/TIA-526-7 §4; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** 6.0 dB would only be the result if the far-end reading were −12 dBm (source − 6 dB = −6 − 6 = −12 dBm). The actual reading is −15.3 dBm, which is 9.3 dB below the source. [ANSI/TIA-526-7 §4]
- **C — Correct.** IL (dB) = P_in(dBm) − P_out(dBm) = −6.0 − (−15.3) = −6.0 + 15.3 = **9.3 dB**. This is the correct insertion loss calculation: the difference between the source output (reference) and the received power, expressed as a positive dB value. [ANSI/TIA-526-7 §4–5; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** −15.3 dB is a negative loss value — there is no such thing as negative insertion loss in a passive fiber link (that would mean the fiber amplified the signal, which is impossible without active components). The negative sign belongs to the dBm value (absolute power below 0 dBm), not to the loss ratio. [ANSI/TIA-526-7 §4]

---

**Q3.** An OSP backbone feeder test result shows a PMLS end-to-end insertion loss within the calculated link budget, but the OTDR trace reveals one fusion splice with a bidirectional average of 0.14 dB. What is the correct acceptance decision, and what action is required?

- A) Accept — the end-to-end PMLS result passed the link budget; individual splice loss is only informational in Tier 2 testing
- B) Reject the splice — individual splice events must each pass their per-event threshold; 0.14 dB exceeds the ≤ 0.10 dB BICSI default; re-splice required **[CORRECT]**
- C) Accept — the OTDR reading of 0.14 dB is within the hardened connector acceptance limit of ≤ 0.50 dB
- D) Accept if the PMLS reading is ≤ the link budget; the per-splice threshold applies only to Tier 1 testing

*Rationale:*
- **A — Incorrect.** In Tier 2 testing, both the end-to-end PMLS result AND each per-event OTDR result must pass independently. Passing the end-to-end budget while failing a per-event threshold is not acceptable — the project owner receives OTDR traces with individual event readings, and individual failures are documented and subject to remedy. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §6]
- **B — Correct.** The per-event OTDR acceptance threshold for fusion splices is ≤ 0.10 dB (BICSI OSP-DRD default). A bidirectional average of 0.14 dB exceeds this threshold. The splice must be re-spliced, verified by bidirectional OTDR at ≤ 0.10 dB, and the test record updated. The fact that the end-to-end PMLS passed does not waive the per-event splice threshold — a splice that passes total budget today may degrade and push the route out of spec as other components age. [BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §5]
- **C — Incorrect.** 0.14 dB is a fusion splice reading. The ≤ 0.50 dB limit applies to hardened outdoor connectors per IEC 61753-1 — not to fusion splices. Applying the wrong threshold to the wrong component type would allow a failing splice to pass by using an unrelated standard. [IEC 61753-1; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** Per-splice OTDR thresholds apply specifically in Tier 2 testing — Tier 2 is defined by measuring and documenting per-event loss in addition to end-to-end loss. The claim that per-splice thresholds apply only to Tier 1 is backwards. Tier 1 does not include OTDR and cannot measure per-splice loss at all. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-568.3-D §6.6]

---

**Q4.** A technician sets the Method B reference, then unplugs and re-plugs the source cable at the source output to move the instrument to a different part of the building. The next fiber measurement shows a loss 0.4 dB lower than expected. What is the most likely cause?

- A) The receive jumper was damaged when the source was moved
- B) The source output level changed when the cable was unplugged and re-plugged, causing the reference to no longer reflect the current source output power **[CORRECT]**
- C) The fiber under test has lower insertion loss than expected because it was cleaned before testing
- D) The power meter battery voltage dropped, causing the meter to under-read power

*Rationale:*
- **A — Incorrect.** A damaged receive jumper would cause loss readings to be higher (more loss), not lower. And the receive jumper at the meter end would not be disturbed by moving the source. [Fluke FI-7000 Guide; ANSI/TIA-526-7 §5.2]
- **B — Correct.** When the source cable was unplugged and re-plugged, the optical connection between the source and launch jumper re-mated at a slightly different angle, changing the launch coupling efficiency. The actual source power entering the launch jumper changed. The stored P_ref no longer reflects the current source output — it's now ~0.4 dB higher than the actual current launch power. Every subsequent measurement appears 0.4 dB lower than reality (less loss than actually present). Correct action: repeat the reference step before continuing. [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** Cleaning a fiber before testing produces accurate results — that's the correct preparation. Cleaning doesn't cause systematically low readings across all fibers tested. [BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** Modern PMLS meters display a low-battery warning; they don't silently under-read due to low battery voltage. A 0.4 dB uniform offset across all readings is consistent with a stale reference baseline, not a battery issue. [Fluke FI-7000 Guide]

---

**Q5.** A project specification requires Tier 2 testing at 1310 nm only for a 10 km OS2 SMF backbone run. Your testing supervisor tells you to skip the 1550 nm test to save time. What is the risk of this shortcut?

- A) No risk — ANSI/TIA-526-7 only requires testing at 1310 nm for OS2 SMF
- B) Minor risk — 1550 nm loss is almost always lower than 1310 nm for OS2 SMF, so 1310 nm is the conservative test
- C) Significant risk — ANSI/TIA-526-7 requires both 1310 nm and 1550 nm for OS2 SMF; skipping 1550 nm may miss macrobend-induced attenuation that is invisible at 1310 nm **[CORRECT]**
- D) No risk — 1550 nm testing is only required for Tier 1; Tier 2 uses OTDR at 1310 nm only

*Rationale:*
- **A — Incorrect.** ANSI/TIA-526-7 specifies test wavelengths for OS2 SMF as **both 1310 nm and 1550 nm**. A test covering only 1310 nm does not satisfy ANSI/TIA-526-7 requirements. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]
- **B — Partially correct but misleading.** OS2 SMF typically has lower absolute attenuation at 1550 nm under ideal conditions. However, 1310 nm is NOT always conservative — the two wavelengths test for different failure modes. Macrobend loss is the critical one. [ANSI/TIA-526-7 §3]
- **C — Correct.** Both 1310 nm and 1550 nm are required for OS2 SMF per ANSI/TIA-526-7. The critical reason: macrobend-induced loss is strongly wavelength-dependent. A cable section with a tight bend (violating minimum bend radius) may show nearly normal loss at 1310 nm while showing measurable elevated loss at 1550 nm — the problem is invisible at 1310 nm. If the link carries 1550 nm traffic (GPON downstream at 1490 nm, CWDM, RF overlay), a bend that "passed" 1310 nm testing will still degrade operational performance. Both wavelengths are mandatory. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9; Viavi OSP Testing Note]
- **D — Incorrect.** The dual-wavelength requirement applies to both Tier 1 and Tier 2 for OS2 SMF. OTDR testing in Tier 2 is also routinely run at both wavelengths to detect wavelength-dependent losses. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]

---

## Final Check

Answer these questions before advancing to Lesson 2.12 (Acceptance Testing and As-Built Documentation).

**Pulse 1.** In one sentence each, distinguish Tier 1 from Tier 2 testing. For each, state one scenario where it is the minimum required tier.

*Expected answer:* **Tier 1** — PMLS insertion loss only; measures end-to-end loss but provides no spatial (per-event) data; minimum required for all installed fiber plants including inside-plant horizontal cabling. **Tier 2** — OTDR (bidirectional, per-event) plus PMLS (end-to-end); required for OSP backbone, feeder cables, and all government/RUS projects per BICSI OSP-DRD. [ANSI/TIA-568.3-D §6.6; BICSI OSP-DRD Manual, Ch. 9]

**Pulse 2.** A source outputs −5 dBm. After Method B reference calibration and insertion of the fiber under test, the meter reads −17.8 dBm. What is the insertion loss?

*Expected answer:*
$$\text{IL} = P_\text{in} - P_\text{out} = -5.0 - (-17.8) = -5.0 + 17.8 = \mathbf{12.8 \text{ dB}}$$

Sanity check: 12.8 dB means the received power is about 1/19th of what was sent — roughly 5% of the original signal is reaching the far end. For a route longer than 15–20 km with multiple splices and connectors, this might be expected. For a short 2 km route, it would indicate a serious problem. [ANSI/TIA-526-7 §4]

**Pulse 3.** Why must the reference step be repeated after moving or reconnecting the light source during a PMLS test session?

*Expected answer:* Any interruption of the optical connection between the source and launch jumper (re-mating, cable disconnection, moving the source) can change the actual optical power coupled into the launch jumper. The source output entering the fiber is no longer the same as when the reference was set. If the reference is not re-established, all subsequent loss readings are offset from the true fiber loss by the amount the source coupling changed. Re-setting the reference recalibrates the zero baseline to the current source output level. [ANSI/TIA-526-7 §5.2; Fluke FI-7000 Guide]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Tier 1 / Tier 2 testing** → Lesson 2.12 (Acceptance Testing — the acceptance documentation package specifies the tier(s) completed; Tier 2 documentation includes both OTDR and PMLS records)
- **ANSI/TIA-526-7** → Lesson 2.10 (OTDR Testing — same standard governs the OTDR indirect insertion loss measurement method used in Tier 2); Lesson 2.12 (Acceptance Testing — required standard reference in as-built documentation)
- **dBm / dB distinction** → Lesson 2.12 (Acceptance Testing — test records must correctly report IL in dB, not record dBm readings as loss values)
- **Method B reference** → Lesson 2.12 (Acceptance Testing — reference method must be documented in the acceptance test package)
- **Insertion loss acceptance threshold** → Lesson 2.2 (Fusion Splicing I — link budget uses these thresholds); Lesson 2.9 (Hardened Connectors — IEC 61753-1 connector loss limit); Lesson 2.10 (OTDR Testing — per-event thresholds from OTDR align with the total budget checked by PMLS)
