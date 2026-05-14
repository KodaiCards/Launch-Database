---
title: "Lesson 2.10: OTDR Testing — Forward + Reverse Pass, Bidirectional Averaging, Dead Zones"
duration_min: 30
topic: splice-termination
order: 10
bicsi_alignment:
  - "OSP-DRD 9: Test methods for OSP fiber — OTDR measurement and acceptance"
  - "OSP-DRD 9.1: OTDR operating principles and trace interpretation"
  - "OSP-DRD 9.2: Bidirectional testing and acceptance thresholds"
sources:
  - "ANSI/TIA-455-61 / FOTP-61 (OTDR measurement of optical fibers)"
  - "ANSI/TIA-526-7 / OFSTP-7 (measurement of optical power loss of installed single-mode fiber cable plants)"
  - "IEC 61300-3-4 (attenuation measurement by backscatter — OTDR method)"
  - "EXFO OTDR Application Note AN-014: OTDR Basics (public edition)"
  - "Viavi Solutions OSP Field Testing Application Note (public edition)"
  - "BICSI OSP-DRD Manual, Ch. 9"
  - "Fujikuru / EXFO OTDR Toolset Reference Materials"
---

# OTDR Testing: Forward + Reverse Pass, Bidirectional Averaging, Dead Zones

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the operating principle of an OTDR and explain how Rayleigh backscatter and Fresnel reflection produce the events visible on an OTDR trace
- Define launch dead zone and event dead zone and explain why a launch cable (test lead) is mandatory
- Distinguish connector events from splice events on an OTDR trace by their visual signatures
- Explain why a single-direction OTDR measurement produces a directionally biased splice loss reading and describe the bidirectional averaging procedure that eliminates this bias
- Apply the bidirectional averaging formula to derive the unbiased splice loss from forward and reverse OTDR measurements
- State the per-event OTDR acceptance thresholds for connectors and splices per BICSI OSP-DRD and ANSI/TIA-526-7

---

## Reading Content

### OTDR Operating Principle

An OTDR (Optical Time-Domain Reflectometer) is a one-ended test instrument that injects a series of short optical pulses into the fiber under test and measures the light that returns toward the instrument as a function of elapsed time. Because the speed of light in glass is known (approximately 2.0 × 10⁸ m/s for typical silica fiber, calculated from the fiber's group index of refraction), elapsed time maps directly to distance along the fiber. The instrument converts the returning power versus time waveform into a returning power versus distance display — the OTDR trace [EXFO OTDR Application Note AN-014, §1; ANSI/TIA-455-61 §4; BICSI OSP-DRD Manual, Ch. 9].

Two physical mechanisms generate the returning light:

**Rayleigh backscatter.** As an optical pulse propagates through the fiber, a small fraction of the light scatters in all directions at each point along the fiber due to microscopic refractive-index fluctuations (Rayleigh scattering — the same mechanism that makes the sky blue). The fraction that scatters back toward the OTDR is called backscatter. Rayleigh backscatter is present continuously along the entire fiber length and decreases exponentially with distance as the pulse attenuates. On the OTDR trace, this appears as a smooth descending slope — the **backscatter level**. The slope of this line is the fiber's attenuation coefficient (dB/km); a steeper slope means higher attenuation [EXFO AN-014, §1.1; BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §4].

**Fresnel reflection.** At any abrupt change in refractive index along the fiber path — a connector end-face, a mechanical splice air gap, a fiber break, or the end of the fiber — a fraction of the light reflects directly back toward the OTDR (Fresnel reflection). Fresnel reflections appear on the trace as sharp spikes above the backscatter floor. The magnitude of the reflection depends on the index discontinuity: an open connector end-face in air produces a large Fresnel reflection (return loss ≈ 14 dB); an angled-polish (APC) connector end-face produces a much smaller reflection (return loss ≥ 55 dB) because the 8° angle redirects most of the reflected light away from the fiber core [EXFO AN-014, §1.2; BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §4].

### Dead Zones: Why a Launch Cable Is Not Optional

The most commonly misunderstood OTDR limitation in OSP field testing is the dead zone — the distance from a reflection event within which the OTDR cannot resolve subsequent events [BICSI OSP-DRD Manual, Ch. 9; EXFO AN-014, §2; ANSI/TIA-455-61 §5.4].

Two dead zones must be understood:

**Launch dead zone (also: connector dead zone).** After the large Fresnel reflection from the OTDR's own output connector, the OTDR receiver is saturated (overloaded) for a period of time. During this saturation period — which corresponds to a physical distance in the fiber — no event can be detected. For a typical OTDR with a standard pulse width setting:

- Launch dead zone = the distance over which the OTDR cannot detect any event immediately after the launch connector reflection
- Typical range: **0 to 10 m**, depending on pulse width and OTDR design
[EXFO AN-014, §2.1; ANSI/TIA-455-61 §5.4]

**Event dead zone.** After any reflection event (not just the launch connector), there is a shorter period during which the OTDR can detect that an event has occurred but cannot accurately measure its loss. The OTDR trace has not recovered enough to separate the current event from a closely following event.

- Event dead zone = the minimum separation between two events at which both events can be individually resolved
- Typical range: **0.5 m to 5 m**, depending on pulse width
- Critical implication: **splices within the event dead zone of a connector will not be individually resolved**
[EXFO AN-014, §2.2; ANSI/TIA-455-61 §5.4]

**The mandatory launch cable (test lead).** A launch cable is a length of the same fiber type as the fiber under test, typically 50–500 m long, connected between the OTDR output port and the first connector of the fiber under test. Its purpose is to move the dead zone of the OTDR's launch connector physically away from the fiber under test. Events on the fiber under test begin beyond the launch cable length — outside the launch dead zone — so the OTDR can resolve the first event (typically the first connector of the installed cable plant) accurately [BICSI OSP-DRD Manual, Ch. 9; EXFO AN-014, §2.3; ANSI/TIA-526-7 §5.2].

**The receive cable.** A receive cable (tail cable) of the same length as the launch cable is recommended at the far end of the fiber under test. Its purpose: ensure that the final connector of the fiber under test is visible to the OTDR — i.e., the far-end connector's Fresnel reflection and any events near it are resolved clearly rather than appearing in the ambiguous receive-end region where the OTDR trace ends. Without a receive cable, the last 50–500 m of the fiber under test may contain unresolved events [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §5.2].

**Dead zone values for different pulse widths.** The OTDR operator selects the pulse width for each test:

| Pulse width | Approx. event dead zone | Range (dynamic range) | Best use |
|---|---|---|---|
| 3 ns (very short) | ~0.3 m | Low (~20 dB) | Short links, dense event spacing |
| 30 ns | ~3 m | Medium (~30 dB) | Standard OSP splice testing |
| 300 ns | ~30 m | High (~40 dB) | Long-haul feeder, fewer events |
| 3000 ns | ~300 m | Very high (~50 dB) | Very long spans, coarse measurement |

*Sources: [EXFO AN-014, §2.4; ANSI/TIA-455-61 §5.4; Viavi OSP Testing Note]*

Shorter pulse width → better distance resolution (smaller dead zones) but less dynamic range (can't see as far into the fiber). Longer pulse width → greater dynamic range (can test longer routes) but larger dead zones (may miss closely-spaced events). On a typical OSP splice acceptance test, 30 ns or 100 ns pulse width is common for intra-splice-closure resolution.

### Reading an OTDR Trace: Event Types and Signatures

A complete OTDR trace for an installed cable segment looks like a staircase descending from upper left to lower right. Each step represents a loss event [BICSI OSP-DRD Manual, Ch. 9; EXFO AN-014, §3]:

**Connector event.** A connector creates both a Fresnel reflection (sharp spike) and a loss step (the trace drops at the spike location). The spike is clearly visible above the backscatter floor. Both the insertion loss (height of the step) and return loss (height of the spike above the backscatter level) can be read from the trace. Typical connectors: sharp spike, step ≤ 0.5 dB.

**Fusion splice event.** A fusion splice typically creates a very small loss step with no Fresnel reflection spike (the continuous glass structure of a good fusion splice has no index discontinuity large enough to produce a detectable Fresnel reflection). On the trace: a very small step or barely visible inflection in the backscatter slope, with no spike. Typical acceptance: loss step ≤ 0.1 dB (BICSI default). Note: a bad fusion splice (large void, discontinuity) may produce a small Fresnel reflection — if you see a spike at a splice location, the splice has a physical defect.

**Fiber break (catastrophic reflection).** A fiber end, break, or open connector in air produces the largest Fresnel reflection (maximum spike) followed by a noise floor — no further backscatter after the event. This is the trace signature for a fiber break or an open end: maximum spike, trace drops to noise floor immediately after the event.

**Fiber bend / macrobend event.** A macrobend (fiber bent beyond minimum bend radius) appears as a loss step with no Fresnel reflection spike — similar to a splice event. Distinguishable from a splice by location: macrobend events occur at predictable mechanical stress points (corners, tight conduit bends, exit from a splice tray) rather than at planned splice locations. High bending loss at 1625 nm relative to 1310 nm is a diagnostic signature for macrobend-induced loss.

**Trace anomaly — "gainer" (negative splice loss).** When reading a splice loss from one direction, the OTDR may sometimes show an apparent gain at a splice event — the trace appears to step up slightly rather than down. This is a measurement artifact, not actual optical gain. It occurs when the fiber geometry (core diameter or NA) changes across the splice, affecting the backscatter coefficient. The splice has real insertion loss, but the backscatter level after the splice is higher than before, making the trace appear to gain. **This is the primary reason bidirectional averaging is mandatory** — the bidirectional average cancels the backscatter artifact. A single-direction OTDR reading of a splice near a fiber type change is unreliable [BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §5; EXFO AN-014, §4].

### Bidirectional OTDR Testing: Why and How

A single OTDR measurement from one end of the fiber (forward direction) does not give an unbiased estimate of splice insertion loss. The reason is the backscatter coefficient asymmetry described above: even in a single fiber type, microscopic variations in the fiber along its length mean that the backscatter slope before and after a splice is not identical in both the forward and reverse direction.

The standard OSP acceptance protocol requires **bidirectional OTDR measurement** per IEC 61300-3-4 §5 and ANSI/TIA-455-61 §5:

1. **Forward pass:** Test from End A to End B. Record the loss reading at each event from the forward direction (A→B). Call this loss_AB for a given splice.
2. **Reverse pass:** Move the OTDR to End B. Test from End B to End A. Record the loss reading at each event from the reverse direction (B→A). For the same splice, this reading is loss_BA.
3. **Bidirectional average:** The true (unbiased) splice loss is the arithmetic mean:

```
loss_true = (loss_AB + loss_BA) / 2
```

**Worked example:**

A splice at kilometer 12.4 on a 38 km route reads as follows:
- Forward (A→B): loss_AB = 0.08 dB
- Reverse (B→A): loss_BA = 0.12 dB (backscatter asymmetry pushes this reading higher)
- Bidirectional average: (0.08 + 0.12) / 2 = **0.10 dB**

Acceptance threshold: ≤ 0.10 dB (BICSI default). This splice is right at the limit — it passes. Using only the forward reading (0.08 dB) would also pass. Using only the reverse reading (0.12 dB) would fail. The bidirectional average is the only unbiased estimate; neither single-direction reading should be used as the acceptance datum [IEC 61300-3-4 §5; ANSI/TIA-455-61 §5; BICSI OSP-DRD Manual, Ch. 9].

**Second worked example — "gainer" case:**

A splice at kilometer 8.1 where the fiber reel changed (slight core diameter variation):
- Forward (A→B): loss_AB = −0.02 dB (apparent gainer — trace steps up slightly)
- Reverse (B→A): loss_BA = 0.09 dB
- Bidirectional average: (−0.02 + 0.09) / 2 = **0.035 dB**

The negative forward reading is the backscatter artifact. The true splice loss (0.035 dB) is below threshold — the splice passes. If only the forward reading were recorded, the technician might incorrectly record it as a measurement error or, worse, incorrectly pass the splice without recognizing the artifact. Bidirectional averaging resolves the ambiguity [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9].

**Important:** Some modern OTDR units and analysis software (EXFO FastReporter, Viavi SmartClass Fiber, Fluke Networks OptiFiber Pro) perform bidirectional test coordination between two instruments simultaneously via link to automate the A→B and B→A measurements and calculate bidirectional averages automatically. This is the preferred field workflow for acceptance testing on projects with many splices per route [EXFO AN-014, §5; Viavi OSP Testing Note].

### OTDR Acceptance Thresholds

Per BICSI OSP-DRD Manual, Ch. 9 and ANSI/TIA-526-7, the OSP OTDR acceptance thresholds for OS2 SMF are:

| Event type | Maximum loss (per event, bidirectional average) | Standard |
|---|---|---|
| Fusion splice | ≤ 0.10 dB | BICSI OSP-DRD Ch. 9; IEC 61300-3-4 §5 |
| Hardened OSP connector | ≤ 0.50 dB | ANSI/TIA-758-C §6.5; IEC 61753-1 |
| Inside-plant SC/LC connector | ≤ 0.75 dB | ANSI/TIA-568.3-D §6.5 |
| End-to-end link loss | Per project specification (≤ calculated link budget) | ANSI/TIA-526-7; BICSI OSP-DRD Ch. 9 |

Note: project specifications on RUS-funded or government infrastructure projects may impose tighter thresholds (e.g., ≤ 0.05 dB per fusion splice). Always verify acceptance criteria against the project specification document — the BICSI defaults are minimums, not targets [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7 §6].

### OTDR Trace Archive: .SOR Format

Every OTDR trace collected during acceptance testing must be saved in the **.SOR (Bellcore Standard Optical time-domain Reflectometer) format**, the industry-standard binary format for OTDR trace data defined by Telcordia (now Ericsson) GR-196. Most modern OTDRs save traces natively in .sor format (EXFO, Viavi, Fujikura OTDR tools). The .sor file contains the full trace waveform, instrument calibration data, event list, and test configuration parameters. .sor files are the accepted format for submitting OTDR test documentation to project owners and regulatory bodies on infrastructure projects [BICSI OSP-DRD Manual, Ch. 9–10; ANSI/TIA-758-C §9; EXFO AN-014, §6].

---

## Key Terms (Flashcard Candidates)

**Rayleigh backscatter**
The continuous backward-scattered fraction of a propagating optical pulse produced by microscopic refractive-index fluctuations in the fiber. Appears as the gradually descending slope of an OTDR trace; the slope's gradient equals the fiber's attenuation coefficient in dB/km. [EXFO AN-014, §1.1; IEC 61300-3-4 §4; BICSI OSP-DRD Manual, Ch. 9]

**Fresnel reflection**
A sharp, localized backward reflection produced at any abrupt refractive-index discontinuity in the fiber path (connector end-face, break, fiber end). Appears as a sharp spike on the OTDR trace above the backscatter floor. Magnitude inversely related to the quality of the physical contact: open end-face produces the largest reflection; APC polished end-face produces the smallest. [EXFO AN-014, §1.2; BICSI OSP-DRD Manual, Ch. 9]

**Launch dead zone**
The distance from the OTDR launch port within which the OTDR receiver is saturated by the launch connector's Fresnel reflection and cannot detect subsequent events. A launch cable (test lead) must be at least as long as the launch dead zone to ensure the first field connector is visible. [ANSI/TIA-455-61 §5.4; EXFO AN-014, §2.1]

**Event dead zone**
The minimum separation between two adjacent events at which both can be individually resolved on an OTDR trace. Shorter than the launch dead zone; typically 0.5–5 m depending on pulse width. Governs the minimum required separation between consecutive connectors or splices for independent loss measurement. [ANSI/TIA-455-61 §5.4; EXFO AN-014, §2.2]

**Launch cable (test lead)**
A fiber jumper, typically 50–500 m of the same fiber type as the fiber under test, connected between the OTDR output and the first connector of the cable plant. Moves the launch dead zone away from the test section, enabling accurate measurement of the first event (first connector) of the installed plant. Mandatory for OSP OTDR acceptance testing. [ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]

**Bidirectional OTDR test**
An OTDR measurement protocol in which the fiber under test is measured from both ends (forward and reverse), and the per-event loss readings from both passes are arithmetically averaged. Required to eliminate directional backscatter artifacts (including "gainer" readings) and produce an unbiased splice loss estimate per IEC 61300-3-4 §5 and ANSI/TIA-455-61. [IEC 61300-3-4 §5; ANSI/TIA-455-61 §5; BICSI OSP-DRD Manual, Ch. 9]

**Bidirectional average (formula)**
loss_true = (loss_AB + loss_BA) / 2. The arithmetic mean of the forward (A→B) and reverse (B→A) OTDR loss readings at a given splice event. The only unbiased estimate of splice insertion loss from OTDR measurements. [IEC 61300-3-4 §5]

**"Gainer" (negative splice loss reading)**
An OTDR trace artifact where a splice event appears to produce a small optical gain (negative loss reading) from one direction. Caused by a backscatter coefficient step at the splice (typically a slight change in fiber core diameter or NA across the splice, or a difference in fiber lots). Not a real gain — the splice has real insertion loss. The bidirectional average corrects for this artifact. [IEC 61300-3-4 §5; EXFO AN-014, §4; BICSI OSP-DRD Manual, Ch. 9]

**.SOR format**
The Bellcore/Telcordia GR-196 standard binary file format for OTDR trace data. Contains the full waveform, event list, instrument calibration, and test parameters. Required format for OTDR trace submission in acceptance test documentation packages for OSP infrastructure projects. [BICSI OSP-DRD Manual, Ch. 9–10; ANSI/TIA-758-C §9]

---

## Interactive: Scenario — Read an OTDR Trace and Locate the Fault

### Scenario

You are testing a 15 km OS2 SMF feeder cable. The route has three planned splice closures at km 4.2, km 8.7, and km 13.1, plus connectors at each end (at the OLT and the FDH). You run a forward-direction OTDR test from the OLT end using a 100 m launch cable. The instrument is set to 100 ns pulse width.

The OTDR trace shows the following events (all distances measured from the OTDR, including the 100 m launch cable — subtract 0.1 km from each reading to get actual cable distance):

| Event # | Distance from OTDR | Trace signature | Forward (A→B) loss reading |
|---|---|---|---|
| 1 | 0.1 km | Spike + step | 0.31 dB |
| 2 | 4.3 km | Small step, no spike | 0.07 dB |
| 3 | 8.8 km | Small step, no spike | 0.04 dB |
| 4 | 12.2 km | Spike + step | 0.44 dB |
| 5 | 13.2 km | Spike + very large spike, then noise floor | — |

---

**Step 1 — Identify each event type:**

| Event # | Actual cable distance | Event type | Reasoning |
|---|---|---|---|
| 1 | 0.0 km (OLT end) | Connector | Spike + step → connector Fresnel reflection + insertion loss |
| 2 | 4.2 km | Fusion splice | Small step, no spike → expected splice closure at km 4.2 |
| 3 | 8.7 km | Fusion splice | Small step, no spike → expected splice closure at km 8.7 |
| 4 | 12.1 km | **Unexpected connector or break** | Spike + step at a location that does not correspond to any planned splice (expected splice at 13.1, not 12.1) |
| 5 | 13.1 km | Fiber break or open end | Large Fresnel reflection followed immediately by noise floor — end of fiber |

**Step 2 — Diagnosis:**

Event 4 at km 12.1 is anomalous — it is a reflective event (spike present) at a location that is not a planned splice closure. This is consistent with one of:
- A damaged connector or hardened connector installed at an unplanned location
- A fiber break with a clean cleave face (producing a Fresnel reflection) at km 12.1

Event 5 at km 13.1 matches the expected splice closure location but shows a maximum Fresnel reflection and immediate noise floor — no backscatter beyond this point. This is the signature of a **fiber break (open end)** at the splice closure location at km 13.1, not a normal splice.

**Conclusion:** The fiber is broken at km 13.1 (at or near the planned third splice closure). The anomalous event at km 12.1 may indicate a damaged cable section or unplanned connector installed in the field before the break. **The planned splice at km 13.1 was never completed or the fiber was cut during installation.**

**Step 3 — What additional measurement is required before documenting the fault?**

A reverse-direction test from the FDH end is required to confirm the fault location from the opposite direction (bidirectional testing). This will:
1. Confirm whether the km 12.1 event and km 13.1 break are visible from the FDH end and verify distances.
2. Provide the reverse loss readings for events 2 and 3 (the two completed splices) so bidirectional averages can be calculated for acceptance documentation.

**Step 4 — Bidirectional average for Event 2 (km 4.2 splice):**

After running the reverse test, the reverse (B→A) reading for Event 2 is 0.09 dB.

Forward: 0.07 dB. Reverse: 0.09 dB.
Bidirectional average: (0.07 + 0.09) / 2 = **0.08 dB** → passes ≤ 0.10 dB threshold.

**Step 5 — Bidirectional average for Event 3 (km 8.7 splice):**

Reverse (B→A) reading for Event 3 is 0.05 dB.

Forward: 0.04 dB. Reverse: 0.05 dB.
Bidirectional average: (0.04 + 0.05) / 2 = **0.045 dB** → passes ≤ 0.10 dB threshold.

[BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §5; ANSI/TIA-455-61 §5; EXFO AN-014]

---

## Multiple-Choice Quiz

---

**Q1.** What physical mechanism produces the continuously descending slope of an OTDR trace between reflective events?

- A) Fresnel reflections from distributed microscopic bubbles in the fiber
- B) Rayleigh backscatter — the continuous backward-scattered fraction of the optical pulse due to microscopic refractive-index fluctuations **[CORRECT]**
- C) Absorption losses from hydroxyl (OH) ions in the fiber core
- D) Chromatic dispersion spreading the pulse as it travels down the fiber

*Rationale:*
- **A — Incorrect.** Fresnel reflections produce discrete spikes at specific locations (connector end-faces, breaks). They are not distributed along the fiber and do not produce the continuous slope. Microscopic bubbles would also produce Fresnel spikes, not the smooth exponential decay of the backscatter slope. [EXFO AN-014, §1.2]
- **B — Correct.** Rayleigh backscatter is produced continuously at every point along the fiber where the forward-traveling pulse exists. The fraction of each pulse that scatters back toward the OTDR forms the continuous descending slope. The slope gradient is the fiber's attenuation coefficient — a steeper slope indicates higher attenuation per kilometer. [EXFO AN-014, §1.1; IEC 61300-3-4 §4; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** OH-ion absorption (water peak absorption) causes elevated attenuation at specific wavelengths (notably 1383 nm for legacy fiber) and appears as a higher-than-expected slope over the entire fiber, not as discrete events or a continuous mechanism distinct from the attenuation the OTDR measures. Absorption is captured in the total attenuation coefficient measured by the slope — it is not a separate mechanism that explains the slope. [IEC 61300-3-4 §4]
- **D — Incorrect.** Chromatic dispersion is a pulse-broadening mechanism that affects the resolution of the returning pulse, not its amplitude. Dispersion does not cause a descending amplitude slope on the OTDR trace; the amplitude slope is caused by backscatter attenuation. [EXFO AN-014, §1]

---

**Q2.** A 20 m launch cable is used for an OTDR test. The launch dead zone for the OTDR at the selected pulse width is 15 m. What is the consequence?

- A) No consequence — any launch cable longer than zero prevents dead zone masking
- B) The first connector of the installed cable plant is within the launch dead zone and cannot be accurately measured **[CORRECT]**
- C) The launch cable itself will be lost in the dead zone and the OTDR will start measuring from the far end of the launch cable
- D) The 20 m launch cable is sufficient because the dead zone only extends to the far end of the launch cable

*Rationale:*
- **A — Incorrect.** The launch cable must be longer than the launch dead zone to place the first event (first connector of the cable plant) outside the saturated region. A 20 m launch cable places the first field connector at 20 m; if the dead zone extends 15 m, the first connector is only 5 m outside the dead zone — barely resolvable and within the event dead zone for most pulse width settings. A 20 m cable is insufficient for most field OTDR setups. [ANSI/TIA-455-61 §5.4; EXFO AN-014, §2.3]
- **B — Correct.** If the launch cable (20 m) is barely longer than the launch dead zone (15 m), the first field connector of the installed cable plant is at 20 m — within or very near the dead zone. The OTDR may not fully recover from the launch connector's Fresnel reflection before reaching the first field connector, resulting in an inaccurate or missing loss reading for that connector. For OSP acceptance testing, launch cables are typically 50–200 m to ensure adequate margin beyond the launch dead zone. [ANSI/TIA-455-61 §5.4; ANSI/TIA-526-7 §5.2; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** The launch cable does not "disappear" in the dead zone. The dead zone is a measurement limitation — the OTDR physically cannot detect events within that distance window. The launch cable's far end (the first field connector) is what the dead zone may hide; the backscatter slope of the launch cable may partially appear in the trace if the launch cable extends beyond the dead zone, but the loss at the first connector may be inaccurate if it's too close to the launch connector. [EXFO AN-014, §2.1]
- **D — Incorrect.** This misunderstands the dead zone concept. The dead zone is a fixed distance from the launch connector reflection; it does not extend "to the far end of the launch cable" — it extends a fixed physical distance regardless of launch cable length. The requirement is that the launch cable be longer than the dead zone, not equal to it. [ANSI/TIA-455-61 §5.4]

---

**Q3.** A fusion splice at km 7.3 reads +0.02 dB (a small apparent gain) from the forward direction (A→B) and 0.08 dB from the reverse direction (B→A). What is the bidirectional average splice loss, and does this splice pass the BICSI ≤0.10 dB acceptance threshold?

- A) Bidirectional average = 0.08 dB; passes (only the reverse direction is valid when the forward shows a gainer)
- B) Bidirectional average = 0.03 dB; passes (average of 0.02 and 0.04 — the gainer is rounded to 0.04)
- C) Bidirectional average = 0.03 dB; passes (arithmetic mean of +0.02 and 0.08) **[CORRECT — see rationale for exact value]**
- D) The splice fails because a gainer reading in the forward direction indicates a physical defect that makes OTDR measurement invalid

*[Note: The correct bidirectional average is (0.02 + 0.08) / 2 = 0.05 dB — see rationale. Answer C is correct but the stated value (0.03 dB) contains an arithmetic error in the option text. The correct answer is C-intent: the average of forward and reverse, which equals 0.05 dB.]*

Let me restate the options precisely:

- A) The gainer reading is invalid; use only the reverse direction reading: **0.08 dB** — passes
- B) Bidirectional average = **0.05 dB** — passes ≤ 0.10 dB threshold **[CORRECT]**
- C) Bidirectional average = **0.06 dB** — passes ≤ 0.10 dB threshold
- D) The splice fails — a gainer in one direction automatically triggers re-splice

*Rationale:*
- **A — Incorrect.** The OTDR standard does not permit discarding one direction's reading and using only the other. Even when a gainer appears in one direction, the correct protocol per IEC 61300-3-4 §5 is to calculate the bidirectional arithmetic mean using the actual signed reading, including the positive (gainer) value. Selectively discarding results violates the test methodology and would produce an overstated loss value. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Correct.** Bidirectional average: (+0.02 + 0.08) / 2 = **0.05 dB**. Note that the positive (+0.02) forward gainer reading is used as-is in the average formula — the gainer reading reflects the backscatter asymmetry, and the averaging procedure accounts for it. 0.05 dB < 0.10 dB → the splice **passes** the BICSI acceptance threshold. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** 0.06 dB is an incorrect calculation. The arithmetic mean of +0.02 and 0.08 = 0.10/2 = 0.05, not 0.06. Always verify the arithmetic in OTDR bidirectional calculations. [IEC 61300-3-4 §5]
- **D — Incorrect.** A gainer reading does not indicate a physical defect requiring re-splice. Gainers are OTDR backscatter artifacts caused by fiber lot variations or core geometry differences across the splice. The splice is physically sound; the bidirectional average reveals the true (low) insertion loss. If the bidirectional average exceeds the acceptance threshold, then re-splice may be warranted — but the trigger is the average, not the direction of any single reading. [IEC 61300-3-4 §5; EXFO AN-014, §4; BICSI OSP-DRD Manual, Ch. 9]

---

**Q4.** An OTDR trace shows a sharp spike at km 9.4 with no step (no loss) — the backscatter level before and after the spike is identical. What does this event most likely represent?

- A) A fusion splice with above-threshold loss
- B) A macrobend (tight bend in the cable) introducing localized attenuation
- C) A reflective event with no insertion loss — likely a connector with perfect polishing or a mechanical splice point with index-matching gel but no core misalignment **[CORRECT]**
- D) The end of the fiber — the noise floor begins immediately after this spike

*Rationale:*
- **A — Incorrect.** A fusion splice with elevated loss would appear as a loss step (the trace drops at the splice location). A fusion splice does not typically produce a sharp Fresnel reflection spike — if it does, the splice has a physical discontinuity (void or gap). The scenario describes a spike with no step. [EXFO AN-014, §3; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** A macrobend produces a loss step with no Fresnel reflection spike — it is the opposite signature. A bend introduces insertion loss (trace steps down) without producing an index discontinuity large enough to cause Fresnel reflection. The scenario describes a spike with no loss step. [EXFO AN-014, §3]
- **C — Correct.** A Fresnel reflection spike with no associated insertion loss step means: there is a refractive index discontinuity at that location (hence the spike — something is causing Fresnel reflection) but no net optical loss (the backscatter level before and after is the same). This is consistent with a connector or mechanical splice with good physical contact alignment but an end-face that still produces a small reflection. A fusion splice with true zero insertion loss could also appear this way in an ideal case. The key diagnostic: spike = reflection present; no step = no insertion loss. [EXFO AN-014, §3; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** The end of fiber (fiber break or open end) produces a spike followed by an immediate drop to the noise floor — no further backscatter slope after the spike. The scenario specifies that the backscatter level after the event continues at the same level as before — i.e., the trace continues. The end of fiber would terminate the trace. [EXFO AN-014, §3]

---

**Q5.** Three technicians are debating how to handle bidirectional OTDR test results for a splice that reads 0.06 dB forward (A→B) and 0.15 dB reverse (B→A). Technician 1 says use 0.06 dB (forward only — better result). Technician 2 says use 0.15 dB (reverse only — worse-case). Technician 3 says use the bidirectional average of 0.105 dB. Who is correct?

- A) Technician 1 — project specifications always allow using the better single-direction reading
- B) Technician 2 — worst-case testing is the conservative standard required by BICSI
- C) Technician 3 — the bidirectional average (0.105 dB) is the required method, and this splice fails the ≤ 0.10 dB BICSI threshold **[CORRECT]**
- D) None of the three — when the two readings differ by more than 0.08 dB, the splice must be re-done before any measurement is recorded

*Rationale:*
- **A — Incorrect.** Using the better (lower) single-direction reading as the acceptance datum violates IEC 61300-3-4 §5 and ANSI/TIA-455-61. Single-direction readings are biased by backscatter asymmetry; the forward-only reading of 0.06 dB may understate the true insertion loss. Using the lower reading would allow failing splices to pass. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** Using the worse-case (higher) single-direction reading as the acceptance datum also violates the test standard. The reverse-only 0.15 dB reading is biased in the opposite direction; it overstates the true insertion loss and would reject splices that are actually within specification. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]
- **C — Correct.** The bidirectional average: (0.06 + 0.15) / 2 = **0.105 dB** is the required acceptance datum per IEC 61300-3-4 §5, ANSI/TIA-455-61, and BICSI OSP-DRD Ch. 9. 0.105 dB > 0.10 dB → this splice **fails** the BICSI ≤ 0.10 dB acceptance threshold and must be re-spliced. The forward reading alone (0.06 dB) would have incorrectly passed this splice — demonstrating why bidirectional testing is mandatory rather than optional. [IEC 61300-3-4 §5; ANSI/TIA-455-61 §5; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** There is no rule requiring re-splice when two OTDR direction readings differ by more than a specified delta. A large forward/reverse difference (as here: 0.09 dB spread) is caused by backscatter asymmetry and is a measurement property of the fiber, not evidence of a physical splice defect. The bidirectional average is calculated and compared to the threshold — if it passes, the splice is accepted regardless of the spread. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]

---

## Final Check

Answer these questions before advancing to Lesson 2.11 (Power Meter / Light Source Testing).

**Pulse 1.** Explain in plain terms why a launch cable is required for OTDR testing and what would go wrong without one.

*Expected answer:* Without a launch cable, the OTDR's own output connector produces a large Fresnel reflection that saturates the receiver for a short distance (the launch dead zone). Any connector or splice that lies within that dead zone distance cannot be resolved — its insertion loss would be masked. The launch cable pushes the first installed-plant connector outside the dead zone, ensuring the OTDR has fully recovered before it reaches the first event to measure. [ANSI/TIA-526-7 §5.2; EXFO AN-014, §2.3; BICSI OSP-DRD Manual, Ch. 9]

**Pulse 2.** A splice reads −0.03 dB (forward) and +0.11 dB (reverse). Calculate the bidirectional average and state whether this splice passes or fails BICSI's ≤ 0.10 dB threshold.

*Expected answer:* Bidirectional average = (−0.03 + 0.11) / 2 = 0.08 / 2 = **0.04 dB**. 0.04 dB < 0.10 dB → the splice **passes**. The −0.03 dB "gainer" in the forward direction is a backscatter artifact; the bidirectional average reveals the true insertion loss is well within specification. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]

**Pulse 3.** What is the governing acceptance threshold for fusion splices and for hardened OSP connectors during OTDR acceptance testing? Which standard specifies each?

*Expected answer:* **Fusion splice:** ≤ 0.10 dB bidirectional average per BICSI OSP-DRD Ch. 9 and IEC 61300-3-4 §5. **Hardened OSP connectors:** ≤ 0.50 dB per ANSI/TIA-758-C §6.5 and IEC 61753-1 performance standard B. Note that project specifications on regulated contracts may impose tighter limits — always verify against the project-specific acceptance criteria. [BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4 §5; ANSI/TIA-758-C §6.5; IEC 61753-1]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Bidirectional average** → Lesson 2.12 (Acceptance Testing — bidirectional OTDR average is the required datum for splice loss documentation in acceptance test packages)
- **OTDR / .SOR format** → Lesson 2.12 (Acceptance Testing — .sor trace files are required deliverables in the as-built documentation package)
- **Launch dead zone / event dead zone** → Lesson 2.12 (Acceptance Testing — proper test setup, including launch cable specification, is an acceptance checklist item)
- **Fusion splice acceptance threshold (≤ 0.10 dB)** → Lesson 2.2 (Fusion Splicing I — splice loss budget uses this threshold for link budget calculation); Lesson 2.3 (Fusion Splicing II — re-splice decision uses estimated loss as a proxy for this OTDR threshold)
- **Hardened connector acceptance threshold (≤ 0.50 dB)** → Lesson 2.9 (Hardened OSP Connectors — IEC 61753-1 field condition limit); Lesson 2.12 (Acceptance Testing — connector IL is a separate acceptance line item from splice IL)
- **IEC 61300-3-4** → Lesson 2.2 (Fusion Splicing I — splice loss measurement method); Lesson 2.12 (Acceptance Testing — test standard reference)
- **ANSI/TIA-526-7** → Lesson 2.11 (Power Meter / Light Source Testing — the same standard governs both OTDR indirect IL measurement and direct PMLS IL measurement)
