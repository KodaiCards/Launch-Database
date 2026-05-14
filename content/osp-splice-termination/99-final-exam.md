---
title: "Topic 2 Final Exam: OSP Splice & Termination Practice"
duration_min: 45
topic: splice-termination
order: 99
exam: true
pass_threshold: 70
total_questions: 25
moodle_import: true
randomization: question_bank_shuffle
sources_covered:
  - All lessons 2.1 through 2.12
  - All standards referenced in lessons 2.1–2.12
notes: >
  Questions are randomized from the bank at Moodle import time.
  Each question includes a per-question source citation for post-exam review.
  Pass threshold: 70% (18 of 25 questions correct).
  Calculation questions require exact or within-tolerance numeric answer; 
  plausible-misderivation distractors are provided.
---

# Topic 2 Final Exam: OSP Splice & Termination Practice

**Instructions:** Select the single best answer for each question. Calculation questions require you to derive the answer — round to one decimal place unless stated otherwise. Pass score: 70% (18 of 25).

---

## Questions

---

### L2.1 — Cleaving Fundamentals

**Q1.** What is the maximum acceptable cleave angle for a single-fiber OS2 SMF core before fusion splicing, per standard field splicer acceptance criteria?

- A) ≤ 0.5° **[CORRECT]**
- B) ≤ 1.0°
- C) ≤ 2.0°
- D) ≤ 0.1°

*Source: BICSI OSP-DRD Manual, Ch. 7.3; Fujikura CT-series Cleaver Operation Guide*

*Rationale:*
- **A — Correct.** ≤ 0.5° is the standard acceptance criterion for single-fiber SMF cleave angle before fusion splicing. Angles above 0.5° produce end-face misalignment at the splice zone, increasing core offset and estimated splice loss. [BICSI OSP-DRD Manual, Ch. 7.3; Fujikura CT-series Guide]
- **B — Incorrect.** ≤ 1.0° is the acceptance criterion for mass-fusion ribbon cleaving, where the larger fiber count and simultaneous cleave geometry permit a slightly relaxed angle spec. For single-fiber SMF, the tighter ≤ 0.5° applies. [BICSI OSP-DRD Manual, Ch. 7.3]
- **C — Incorrect.** 2.0° would represent a significantly defective cleave. Most modern precision cleavers achieve ≤ 0.3° routinely; a 2.0° cleave would show visible hackle or lip on inspection and should be re-cleaved. [Fujikura CT-series Guide]
- **D — Incorrect.** ≤ 0.1° is below the practical measurement floor of most field cleave angle inspection systems; it is not the standard specification. [BICSI OSP-DRD Manual, Ch. 7.3]

---

**Q2.** A cleaver inspection shows a fiber end-face with a "lip" defect — the end-face has a raised edge on one side. What is the most likely cause?

- A) Excessive blade tension — the blade tension setting is too high for the fiber diameter
- B) Insufficient blade tension — the blade does not fully cut through the fiber, leaving an uncut ledge **[CORRECT]**
- C) Blade rotation counter has exceeded the recommended replacement interval
- D) The fiber was not properly seated in the holder, causing the fiber to rotate during the cleave

*Source: BICSI OSP-DRD Manual, Ch. 7.3; Fujikura CT-series Cleaver Operation Guide*

*Rationale:*
- **B — Correct.** A "lip" defect is caused by insufficient blade tension — the blade scores but does not complete the propagating fracture cleanly across the full fiber diameter. The uncut portion creates a raised ledge (lip) at one edge of the end-face. Correct action: increase blade tension per the manufacturer's specification for the fiber type being cleaved. [BICSI OSP-DRD Manual, Ch. 7.3; Fujikura CT-series Guide]
- **A, C, D — Incorrect** as explained: excessive tension causes a different defect pattern (mist or hackle); blade wear typically produces hackle or rough surfaces; holder misalignment causes angled cleaves or fiber fractures, not the specific raised-edge lip pattern. [Fujikura CT-series Guide]

---

### L2.2 — Fusion Splicing I

**Q3.** A 30 km OS2 SMF route has 6 splice closures. Cable attenuation spec is ≤ 0.4 dB/km. The project requires ≤ 0.10 dB/splice (BICSI default). Transceivers have a 14.4 dB loss budget (40GBASE-LR4, IEEE 802.3ba). Assume no connectors at each end (feeder-to-feeder fusion spliced directly at OLT and FDH). What is the total calculated link loss and does the link close?

- A) 12.6 dB total; the link closes with 1.8 dB margin **[CORRECT]**
- B) 12.6 dB total; the link does not close — 12.6 dB exceeds the 14.4 dB budget
- C) 13.2 dB total; the link does not close
- D) 12.0 dB total; the link closes with 2.4 dB margin

*Source: BICSI OSP-DRD Manual, Ch. 7.4; IEEE 802.3ba; Corning OSP Splicing Guide*

*Rationale:*
- **A — Correct.** Cable: 30 × 0.4 = **12.0 dB**. Splices: 6 × 0.10 = **0.6 dB**. Total: 12.0 + 0.6 = **12.6 dB**. Budget: 14.4 dB. 12.6 < 14.4 → link closes with 14.4 − 12.6 = **1.8 dB margin**. [BICSI OSP-DRD Manual, Ch. 7.4; IEEE 802.3ba]
- **B — Incorrect.** 12.6 dB is correct but the conclusion is wrong: 12.6 dB is less than the 14.4 dB budget, so the link passes. [IEEE 802.3ba]
- **C — Incorrect.** 13.2 dB: 30 × 0.4 = 12.0 + 6 × 0.20 = 1.2 → 13.2 dB uses the wrong per-splice loss (0.20 vs. 0.10). [BICSI OSP-DRD Manual, Ch. 7.4]
- **D — Incorrect.** 12.0 dB omits the splice loss contribution entirely. [BICSI OSP-DRD Manual, Ch. 7.4]

---

### L2.3 — Fusion Splicing II

**Q4.** A fusion splicer displays an estimated splice loss of 0.22 dB on an OS2 SMF splice. The BICSI default acceptance threshold is ≤ 0.10 dB. The technician re-arcs the splice and the estimated loss drops to 0.09 dB. The re-arc succeeded. What is the next required action before the closure can be closed?

- A) The splice is accepted at 0.09 dB estimated — no further action required
- B) OTDR-verify the re-arced splice with a bidirectional measurement before closing the closure **[CORRECT]**
- C) Re-splice the fiber — re-arcing is not permitted under BICSI OSP-DRD protocol
- D) Record the 0.09 dB estimated loss as the measured loss in the acceptance documentation

*Source: BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5; Fujikura FSM-series Manual*

*Rationale:*
- **B — Correct.** Estimated splice loss is a geometric proxy, not a confirmed optical measurement. After a re-arc that reduces estimated loss to within threshold, the splice must still be verified by bidirectional OTDR measurement before the closure is closed, because the OTDR confirms actual optical loss rather than the splicer's image-based estimate. [BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5]
- **A — Incorrect.** Estimated loss does not satisfy the OTDR-measurement requirement for formal acceptance documentation. [BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** Re-arcing is a legitimate QA step when the initial splice is within the re-arc capability window; BICSI permits it. [Fujikura FSM-series Manual]
- **D — Incorrect.** As per Lesson 2.2: estimated loss ≠ measured optical loss and cannot be recorded as measured loss in acceptance documentation. [IEC 61300-3-4 §5]

---

### L2.4 — Mass-Fusion Splicing

**Q5.** What is the typical per-fiber splice loss range for mass-fusion ribbon splicing, and why is it higher than single-fiber PAS splicing?

- A) 0.02–0.05 dB — mass-fusion and single-fiber PAS achieve the same loss range because both use active alignment
- B) 0.05–0.15 dB — simultaneous splicing of 12–24 fibers introduces more arc parameter variability per fiber than single-fiber splicing **[CORRECT]**
- C) 0.20–0.50 dB — mass-fusion splicing is the least precise method, suitable only for temporary installations
- D) 0.01–0.03 dB — mass-fusion achieves lower per-fiber loss than single-fiber splicing due to uniform arc delivery across all fibers

*Source: BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-60R/70R/90R Ribbon Splicer Manual*

*Rationale:*
- **B — Correct.** Mass-fusion splicing typically achieves 0.05–0.15 dB per fiber, higher than the 0.02–0.05 dB achievable with single-fiber PAS splicing. The cause: in a 12-fiber simultaneous arc, the arc must heat all 12 fibers uniformly, but each fiber's exact position in the holder and minor ribbon preparation variations introduce per-fiber alignment error. The simultaneous arc is optimized for the array average, not each individual fiber. The trade-off (slightly higher average loss, dramatically higher throughput for high-fiber-count cable) makes mass-fusion the standard for 144F+ OSP installations. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-60R/70R Manual]

---

### L2.5 — Mechanical Splicing

**Q6.** A field crew's fusion splicer fails during an emergency aerial drop restoration. The only available alternative is a Fibrlok-style mechanical splice. The project specification states the maximum per-splice loss for all splices on this segment is ≤ 0.10 dB. Which action is most appropriate?

- A) Install the mechanical splice and accept the higher loss — emergency conditions override the specification
- B) Install the mechanical splice and test it; if it exceeds 0.10 dB, document it as an emergency installation and plan a fusion re-splice **[CORRECT]**
- C) Install the mechanical splice at any loss — mechanical splices are only used in non-critical temporary applications
- D) Delay the restoration until a fusion splicer can be obtained — mechanical splicing is prohibited on OSP routes

*Source: BICSI OSP-DRD Manual, Ch. 7.3; 3M/Fibrlok Mechanical Splice Installation Guide*

*Rationale:*
- **B — Correct.** The correct approach for an emergency mechanical splice on a route with a ≤ 0.10 dB specification is: install the mechanical splice to restore service, test it with OTDR, document the as-found condition (including any out-of-spec loss), and plan a fusion re-splice during the next scheduled maintenance window. Mechanical splices typically achieve 0.3–0.5 dB — above the 0.10 dB specification — so they are emergency-only installations, not permanent acceptance items. [BICSI OSP-DRD Manual, Ch. 7.3; 3M/Fibrlok Guide]
- **A — Incorrect.** Emergency conditions do not automatically override project specifications; they create a documented exception that must be tracked and resolved. [BICSI OSP-DRD Manual, Ch. 7.3]
- **C — Incorrect.** Mechanical splices can be used in critical applications as emergency repairs, but their higher loss and temperature sensitivity make them unsuitable as permanent backbone splices on routes with tight loss budgets. [BICSI OSP-DRD Manual, Ch. 7.3]
- **D — Incorrect.** BICSI permits mechanical splicing as a field expedient; it is not universally prohibited. Project specs may restrict it on high-performance segments, but in emergency service restoration the mechanical splice is the appropriate tool. [BICSI OSP-DRD Manual, Ch. 7.3]

---

### L2.6 — Splice Closures

**Q7.** Which combination of closure architecture and sealing method is most appropriate for a buried feeder splice closure that will never require re-entry, located in an area with soil temperature reaching +62°C in summer?

- A) Dome closure + gel-seal ports
- B) In-line closure + gel-seal ports
- C) Dome closure + heat-shrink end-caps **[CORRECT]**
- D) In-line closure + open ports (no sealant required for permanent installations)

*Source: BICSI OSP-DRD Manual, Ch. 8; AFL Closure Design Guide; CommScope FOSC Manual*

*Rationale:*
- **C — Correct.** Dome is the standard architecture for buried direct or conduit applications. Heat-shrink end-caps are preferred over gel-seal in high-temperature buried environments (+62°C exceeds the gel migration risk threshold of ~+60°C) where the closure will not be re-entered — the cured adhesive in heat-shrink ports does not migrate, and the absence of future re-entries removes the main disadvantage of heat-shrink (non-re-entrability). [AFL Closure Design Guide, §4.2; BICSI OSP-DRD Manual, Ch. 8]
- **A — Incorrect.** Gel-seal at +62°C risks gel migration (gel viscosity drops and gel migrates away from the port sealing zone over years). Not recommended for high-temperature permanent installations. [AFL Closure Design Guide, §4.1]
- **B — Incorrect.** In-line closures are preferred for conduit with axial clearance constraints; a standard buried direct closure does not have that constraint. [BICSI OSP-DRD Manual, Ch. 8]
- **D — Incorrect.** Open (unsealed) ports on any buried closure are unacceptable — they allow water and debris ingress to the fiber organizer. [ANSI/TIA-758-C §7.2]

---

### L2.7 — Splice Trays and Buffer-Tube Management

**Q8.** Inside a splice closure, a fiber is routed with a bend radius of 15 mm from a buffer tube break-out to the splice tray. What is the problem?

- A) No problem — 15 mm is within the acceptable range for OS2 SMF in a closure environment
- B) 15 mm violates the minimum bend radius specification; the splice tray radius requirement for single-fiber OSP fiber is ≥ 30 mm **[CORRECT]**
- C) 15 mm is too large — OS2 SMF requires a tight bend of ≤ 10 mm inside closures for proper fiber management
- D) The bend radius standard inside closures is ≥ 50 mm; 15 mm is severely below specification

*Source: BICSI OSP-DRD Manual, Ch. 8.2; ANSI/TIA-758-C §7.2*

*Rationale:*
- **B — Correct.** The minimum bend radius for single-fiber OS2 SMF inside splice closures is ≥ 30 mm per BICSI OSP-DRD and ANSI/TIA-758-C §7.2. A 15 mm bend radius is well below this threshold and will produce microbend-induced attenuation. Modern high-bend-tolerance fibers (ITU-T G.657.A/B) have relaxed long-term bend radius specs, but the 30 mm minimum inside closure tray systems remains standard practice for standard OS2 fiber. [BICSI OSP-DRD Manual, Ch. 8.2; ANSI/TIA-758-C §7.2]

---

### L2.8 — Termination Methods

**Q9.** A field crew must terminate 48 fibers at an outdoor FDH with no fusion splicer on site and a 3-hour deadline. Which termination method is most practical?

- A) Factory-polished pigtails + fusion splice — lowest loss, always preferred for OSP
- B) Field-installable connectors (e.g., Corning UniCam cleave-and-crimp) — no splicer required, meets the time constraint **[CORRECT]**
- C) Mechanical splices — cheaper and faster than field connectors for high fiber counts
- D) Leave fiber tails unterminated and schedule a fusion splicer return visit — quality over deadline

*Source: BICSI OSP-DRD Manual, Ch. 7; ANSI/TIA-568.3-D §6.5; Corning UniCam Installation Guide*

*Rationale:*
- **B — Correct.** Field-installable cleave-and-crimp connectors (UniCam, 3M Hot Melt variants) require no fusion splicer, can be installed at approximately 5–10 minutes per connector by a trained technician, and achieve acceptable insertion loss (typically 0.3–0.5 dB) for FTTH and campus distribution applications. For 48 fibers in 3 hours with no splicer, this is the only viable approach. [Corning UniCam Guide; BICSI OSP-DRD Manual, Ch. 7; ANSI/TIA-568.3-D §6.5]
- **A — Incorrect.** Factory-polished pigtails + fusion splice achieves the lowest loss and is the preferred permanent method — but it requires a fusion splicer on site, which the scenario excludes. [BICSI OSP-DRD Manual, Ch. 7]
- **C — Incorrect.** Mechanical splices terminate spliced fiber-to-fiber — they are not connectors and cannot be used to terminate fibers onto a connector panel. [BICSI OSP-DRD Manual, Ch. 7.3]
- **D — Incorrect.** The scenario implies the installation must be activated; leaving fibers unterminated fails the operational requirement. [BICSI OSP-DRD Manual, Ch. 7]

---

### L2.9 — Hardened OSP Connectors

**Q10.** Which hardened OSP connector family uses a threaded hex-nut mating mechanism and provides approximately 2× the port density of SC-body connectors in the same FDT panel footprint?

- A) Corning OptiTap (SC-APC)
- B) CommScope LC-APC HOC (High-Density Outdoor Connector) **[CORRECT]**
- C) AFL QWIK-FLO SC-APC with auto dust-cap carrier
- D) Standard SC-APC with weatherproof boot

*Source: CommScope HOC Technical Brief; BICSI OSP-DRD Manual, Ch. 7.5; IEC 61753-1*

*Rationale:*
- **B — Correct.** CommScope's LC-APC HOC uses a threaded hex-nut collar for mating and achieves 2× SC port density by using LC duplex adapters — two fiber terminations in the footprint of one SC adapter. Designed for metropolitan FTTH high-density FDT applications. [CommScope HOC Technical Brief, §2.1–2.2]
- **A — Incorrect.** OptiTap uses a bayonet pull-to-lock ring (not threaded) and is SC-form-factor (same density as standard SC). [Corning OptiTap Training Guide, §2.1]
- **C — Incorrect.** AFL QWIK-FLO is SC-form-factor and focuses on auto dust-cap retention; it does not double port density. [AFL Installation Guide]
- **D — Incorrect.** A standard SC-APC with weatherproof boot is not a hardened connector family — it lacks the IP68 sealing mechanism, captive dust cap, and positive-retention mating of dedicated hardened connectors. [BICSI OSP-DRD Manual, Ch. 7.5]

---

**Q11.** The insertion loss acceptance limit for hardened OSP connectors under IEC 61753-1 performance standard B (field/outdoor conditions) is:

- A) ≤ 0.10 dB per mated pair
- B) ≤ 0.30 dB per mated pair
- C) ≤ 0.50 dB per mated pair **[CORRECT]**
- D) ≤ 0.75 dB per mated pair

*Source: IEC 61753-1; ANSI/TIA-758-C §6.5*

*Rationale:*
- **C — Correct.** IEC 61753-1 performance standard B specifies ≤ 0.50 dB per mated pair for hardened outdoor connectors. This limit accounts for field mating variability (dirt, humidity, mechanical alignment tolerances) under outdoor deployment conditions. [IEC 61753-1; ANSI/TIA-758-C §6.5]
- **A — Incorrect.** ≤ 0.10 dB is the BICSI default per-splice loss for fusion splices — not the connector acceptance limit. [BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** ≤ 0.30 dB is the typical measured loss for a clean, well-made hardened connector in good field condition — but it is not the acceptance limit. Links testing at 0.30–0.50 dB are within specification. [IEC 61753-1]
- **D — Incorrect.** ≤ 0.75 dB is the inside-plant connector acceptance limit per ANSI/TIA-568.3-D §6.5 — applied to campus LC/SC connectors, not hardened OSP connectors. [ANSI/TIA-568.3-D §6.5]

---

### L2.10 — OTDR Testing

**Q12.** What physical mechanism produces the sharp spikes visible at connector locations on an OTDR trace?

- A) Rayleigh backscatter — scattering increases at index discontinuities
- B) Fresnel reflection — abrupt change in refractive index at the connector end-face causes a fraction of the light to reflect directly back toward the OTDR **[CORRECT]**
- C) Mode field dispersion — the connector's ferrule geometry disperses the optical mode
- D) Splice loss discontinuity — the trace algorithm marks all loss events with a spike marker

*Source: EXFO OTDR Application Note AN-014; BICSI OSP-DRD Manual, Ch. 9; IEC 61300-3-4*

*Rationale:*
- **B — Correct.** Fresnel reflection occurs at any abrupt refractive index change — a connector end-face (glass to air to glass interface) is the most common source. The reflected fraction travels back toward the OTDR and appears as a sharp spike above the backscatter floor. The magnitude of the spike is related to the index step: APC polished end-faces (8° angle) produce much smaller Fresnel reflections than flat-polished (UPC/PC) end-faces because the angle redirects most reflected light away from the return fiber axis. [EXFO AN-014, §1.2; IEC 61300-3-4 §4]

---

**Q13.** A splice at km 11.6 reads −0.04 dB forward (A→B) and +0.16 dB reverse (B→A). What is the bidirectional average, and does this splice pass the BICSI ≤ 0.10 dB threshold?

- A) Average = 0.06 dB; passes
- B) Average = 0.10 dB; passes (right at the threshold)
- C) Average = 0.06 dB; fails — negative readings automatically invalidate the splice
- D) Average = 0.10 dB; fails — the reverse reading of 0.16 dB exceeds the threshold regardless of average **[see correct below]**

Revised correct option:
- A) Bidirectional average = 0.06 dB; passes ≤ 0.10 dB **[CORRECT]**
- B) Bidirectional average = 0.10 dB; right at threshold — passes
- C) The −0.04 dB forward reading voids the test; re-test required
- D) Bidirectional average = 0.12 dB; fails

*Source: IEC 61300-3-4 §5; ANSI/TIA-455-61 §5; BICSI OSP-DRD Manual, Ch. 9*

*Rationale:*
- **A — Correct.** Bidirectional average: (−0.04 + 0.16) / 2 = 0.12 / 2 = **0.06 dB**. 0.06 dB < 0.10 dB → the splice **passes**. The −0.04 dB "gainer" in the forward direction is a backscatter asymmetry artifact; it is used as-is in the arithmetic mean per IEC 61300-3-4 §5. [IEC 61300-3-4 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** 0.10 dB would require both readings to average to exactly 0.10: e.g., 0.04 and 0.16. But (−0.04 + 0.16)/2 = 0.12/2 = 0.06, not 0.10. [IEC 61300-3-4 §5]
- **C — Incorrect.** Negative readings (gainers) do not void the test. They are artifacts of backscatter coefficient differences and are correctly handled by including the signed value in the average formula. [IEC 61300-3-4 §5; EXFO AN-014, §4]
- **D — Incorrect.** 0.12 dB would result only if the forward reading were +0.08, not −0.04. [IEC 61300-3-4 §5]

---

**Q14.** Why is a launch cable (test lead) mandatory for OTDR acceptance testing of an installed cable plant? Select the most complete answer.

- A) The launch cable eliminates Rayleigh backscatter near the OTDR launch port, improving accuracy for the full fiber length
- B) The launch cable moves the OTDR's own launch connector dead zone away from the first connector of the installed plant, ensuring that connector can be accurately measured **[CORRECT]**
- C) The launch cable increases the OTDR's dynamic range, allowing longer fiber lengths to be tested
- D) The launch cable prevents Fresnel reflections from the first installed connector from saturating the OTDR

*Source: ANSI/TIA-526-7 §5.2; ANSI/TIA-455-61 §5.4; BICSI OSP-DRD Manual, Ch. 9; EXFO AN-014*

*Rationale:*
- **B — Correct.** The OTDR's own output connector produces a large Fresnel reflection that saturates the receiver for a short distance (launch dead zone). Any installed plant connector within that dead zone cannot be measured. The launch cable extends the test section beyond the dead zone, placing the first installed connector at a safe distance where the OTDR has fully recovered. [ANSI/TIA-526-7 §5.2; EXFO AN-014, §2.3]
- **A — Incorrect.** Rayleigh backscatter is not eliminated by the launch cable — it is present throughout the entire fiber. The launch cable doesn't "eliminate" anything; it provides distance from the receiver saturation zone. [EXFO AN-014, §2]
- **C — Incorrect.** Dynamic range is determined by the OTDR's pulse power and receiver sensitivity — it is not improved by adding a launch cable. The launch cable adds actual loss (the launch cable attenuation) to the test section, which marginally reduces the available dynamic range for testing the rest of the link. [ANSI/TIA-455-61 §5.4]
- **D — Incorrect.** The launch cable does not prevent Fresnel reflections from the first installed connector — that reflection will still appear in the trace (and should be measured for connector loss). The launch cable's purpose is to place that connector's reflection far enough away from the OTDR receiver that the receiver is no longer saturated when the reflection arrives. [EXFO AN-014, §2.1]

---

### L2.11 — Power Meter / Light Source Testing

**Q15.** A light source outputs −8 dBm. After Method B reference calibration and insertion of the fiber under test, the power meter reads −19.4 dBm. What is the insertion loss of the link?

- A) 19.4 dB
- B) 8.0 dB
- C) 11.4 dB **[CORRECT]**
- D) 27.4 dB

*Source: ANSI/TIA-526-7 §4–5*

*Rationale:*
- **C — Correct.** IL = P_in(dBm) − P_out(dBm) = −8.0 − (−19.4) = −8.0 + 19.4 = **11.4 dB**. [ANSI/TIA-526-7 §4]
- **A — Incorrect.** 19.4 dB is the raw meter reading in dBm — not the insertion loss. This is the classic dBm-vs-dB confusion error. The loss is the difference from the reference (source output), not the absolute power level. [ANSI/TIA-526-7 §4]
- **B — Incorrect.** 8.0 dB would require the meter to read −16 dBm (−8 − 8 = −16). The actual meter reading is −19.4 dBm; using only the source output value as the loss ignores the actual received power reading. [ANSI/TIA-526-7 §4]
- **D — Incorrect.** 27.4 dB = −8 + (−19.4) — this adds the values instead of subtracting them. The correct formula is P_in − P_out, not P_in + P_out. [ANSI/TIA-526-7 §4]

---

**Q16.** A project specification requires BICSI OSP-DRD compliance testing for a 20 km OS2 SMF backbone feeder. Which test tier is required and what is the required test standard for the insertion loss component?

- A) Tier 1 only; ANSI/TIA-526-14B (multimode insertion loss standard)
- B) Tier 2; ANSI/TIA-526-7 (SM fiber insertion loss) plus ANSI/TIA-455-61 (OTDR) **[CORRECT]**
- C) Tier 1 only; ANSI/TIA-526-7
- D) Tier 2; ANSI/TIA-568.3-D §6.6 only

*Source: BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7; ANSI/TIA-455-61*

*Rationale:*
- **B — Correct.** BICSI OSP-DRD requires Tier 2 testing for OSP backbone and feeder cables. Tier 2 = OTDR (per ANSI/TIA-455-61 / FOTP-61 for bidirectional splice loss) + PMLS insertion loss (per ANSI/TIA-526-7 / OFSTP-7 for SM fiber, Method B reference). Both components are required. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-7; ANSI/TIA-455-61]
- **A — Incorrect.** Tier 1 alone is insufficient for OSP backbone. ANSI/TIA-526-14B covers multimode fiber — not applicable to OS2 SMF. [BICSI OSP-DRD Manual, Ch. 9; ANSI/TIA-526-14B]
- **C — Incorrect.** Tier 1 alone is insufficient for backbone. [BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** ANSI/TIA-568.3-D §6.6 governs inside-plant cabling component standards — it references the test tiers but is not the governing standard for OSP backbone insertion loss measurement. [ANSI/TIA-568.3-D §6.6]

---

**Q17.** A PMLS test session uses Method A (one-jumper reference) instead of the project-required Method B (two-jumper reference). If each connector contributes 0.35 dB, how does the measured insertion loss compare to a Method B measurement on the same link?

- A) Method A measures approximately 0.35 dB more loss than Method B **[CORRECT]**
- B) Method A and Method B produce identical results for calibrated PMLS equipment
- C) Method A measures approximately 0.35 dB less loss than Method B
- D) Method A measures approximately 0.70 dB less loss than Method B

*Source: ANSI/TIA-526-7 §5*

*Rationale:*
- **A — Correct.** Method A (one-jumper reference) zeroes only the source-side connection — the launch jumper is connected directly from the source to the meter, and that single connection is the reference baseline. When the fiber under test is then inserted, the far-end connector between the launch jumper and the fiber under test is NOT zeroed; it was not part of the Method A reference path. Method B uses a two-jumper reference that zeros out both end connectors of the reference jumper; when the fiber under test replaces the reference jumper, the two end connectors of the fiber under test are already zeroed by the reference step. Net result: Method A includes one extra connector pair in the measurement that Method B has already calibrated out — Method A **overstates** the loss by approximately one connector pair (~0.35 dB in this example) relative to Method B. This matches the lesson body (see "Reference Methods" section): Method A "overstates the fiber loss by approximately one extra connector pair loss." [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** The reference methods produce different measured loss values; they are not equivalent. [ANSI/TIA-526-7 §5]
- **C — Incorrect.** This reversal would mean Method A measures less than Method B — the opposite of the actual effect. Method A includes an extra connector pair that Method B has zeroed, so Method A measures more, not less. [ANSI/TIA-526-7 §5]
- **D — Incorrect.** 0.70 dB (two connector pairs) would occur only if two full extra connector-pair losses were included in Method A relative to Method B. The difference is one connector pair (~0.35 dB). [ANSI/TIA-526-7 §5]

---

### L2.12 — Acceptance Testing and As-Built Documentation

**Q18.** During IEC 61300-3-35 end-face inspection of an SC/UPC connector, the scope shows a clean core zone (Zone A), three scratches in Zone B each 4 µm wide, and a large chip at the ferrule edge in Zone D. What is the correct acceptance decision?

- A) Fail — the Zone D chip extends into Zone C and must be confirmed clean
- B) Pass — Zone A is clean; Zone B has three scratches ≤ 5 µm; Zone D chips are informational only unless they extend into Zone C **[CORRECT]**
- C) Fail — any scratch in Zone B is a mandatory failure regardless of size
- D) Pass — end-face defects in Zones B, C, and D do not affect optical performance

*Source: IEC 61300-3-35 §5; BICSI OSP-DRD Manual, Ch. 9*

*Rationale:*
- **B — Correct.** Zone A is clean — no fail. Zone B: three scratches × 4 µm width = within the Zone B criterion (≤ 5 scratches, ≤ 5 µm each) — pass. Zone D chip at the ferrule edge (>250 µm from center): informational; the question states it is in Zone D and does not specify it extends into Zone C. A Zone D chip that does not penetrate Zone C is acceptable per IEC 61300-3-35. This connector passes inspection. [IEC 61300-3-35 §5]
- **A — Incorrect.** The question specifies the chip is in Zone D only; the question does not state it extends into Zone C. If it did extend into Zone C, re-inspection would be needed. As stated, Zone D chip alone is informational. [IEC 61300-3-35 §5]
- **C — Incorrect.** Zone B allows scratches ≤ 5 µm wide (up to 5 scratches). Not any Zone B scratch is a fail — the size and count limits must be exceeded. [IEC 61300-3-35 §5]
- **D — Incorrect.** Zone B scratches can affect optical performance if large enough — they can cause index perturbation at the cladding edge, affecting mode coupling in some splice/connector configurations. Zone B limits exist precisely because they can affect performance. [IEC 61300-3-35 §5]

---

**Q19.** Which file format is required for OTDR trace data submission in an OSP acceptance test package?

- A) .CSV (comma-separated values) — universally readable by project owner accounting systems
- B) .PDF — renders OTDR waveform as a read-only image for archival
- C) .SOR — the Bellcore/Telcordia GR-196 standard binary OTDR trace format **[CORRECT]**
- D) .TXT — plain text event list exportable from all OTDR brands

*Source: BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9; EXFO AN-014*

*Rationale:*
- **C — Correct.** The .sor (Standard OTDR Record) format per Telcordia GR-196 is the required OTDR trace file format for OSP infrastructure acceptance packages. .sor files contain the full waveform data, event tables, cursor positions, and instrument calibration data — not just a screen image. Project owners and OSS/BSS systems can ingest .sor files directly for route documentation and future OTDR comparison measurements. [BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9]

---

**Q20.** A 25 km OS2 SMF route has 5 splice closures and 2 hardened connector pairs (at each end). Using BICSI default values (cable max 0.4 dB/km; splice max 0.10 dB; connector max 0.50 dB per pair), calculate the IL_max. A PMLS test measures 11.5 dB at 1310 nm. Does the link pass or fail end-to-end acceptance?

- A) IL_max = 11.5 dB; measured 11.5 dB — link FAILS
- B) IL_max = 11.5 dB; measured 11.5 dB — link passes (exactly at limit) **[CORRECT]**
- C) IL_max = 10.5 dB; measured 11.5 dB — link FAILS
- D) IL_max = 12.0 dB; measured 11.5 dB — link passes

*Source: ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9*

*Rationale:*
- **A — Incorrect.** IL_max = 11.5 dB is correct, but "FAILS" is the wrong conclusion. ANSI/TIA-526-7 acceptance uses a ≤ rule: measured IL must be ≤ IL_max. Since 11.5 dB ≤ 11.5 dB (exactly at limit), the link passes. [ANSI/TIA-526-7 §6]
- **B — Correct.** IL_max = (25 × 0.4) + (5 × 0.10) + (2 × 0.50) = 10.0 + 0.5 + 1.0 = **11.5 dB**. Measured IL = 11.5 dB. Per the ≤ acceptance rule: 11.5 ≤ 11.5 → the link **passes** end-to-end acceptance at 1310 nm (exactly at the calculated limit). Note: while the link passes, a margin of 0 dB is operationally tight; good practice is to review the OTDR traces for any event approaching its per-event threshold. [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]
- **C — Incorrect.** 10.5 dB: 25 × 0.4 = 10.0 + 5 × 0.10 = 0.5 + 0 connectors = 10.5 — omits the 2 connector pairs (1.0 dB). [ANSI/TIA-526-7 §6]
- **D — Incorrect.** 12.0 dB overstates the budget by 0.5 dB. The correct IL_max is 11.5 dB. [ANSI/TIA-526-7 §6]

---

### Multi-Lesson Calculation and Scenario Questions

**Q21.** (Multi-lesson: 2.2 + 2.10) A 24-fiber OS2 SMF feeder cable is OTDR-tested bidirectionally. For one fiber, the forward splice loss at km 7.2 reads 0.06 dB and the reverse reads 0.14 dB. The same fiber's PMLS end-to-end IL at 1310 nm is 5.8 dB; the IL_max calculated from the route parameters is 6.2 dB. Evaluate whether this fiber passes both per-event splice acceptance and end-to-end acceptance.

- A) Per-event: fails (0.14 dB reverse exceeds ≤ 0.10 dB); end-to-end: passes
- B) Per-event: passes (bidirectional average = 0.10 dB, right at threshold); end-to-end: passes **[CORRECT]**
- C) Per-event: passes (use forward reading 0.06 dB only); end-to-end: passes
- D) Per-event: fails (bidirectional average = 0.10 dB exceeds threshold); end-to-end: fails

*Source: IEC 61300-3-4 §5; ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9*

*Rationale:*
- **B — Correct.** Bidirectional average: (0.06 + 0.14) / 2 = 0.20 / 2 = **0.10 dB**. The BICSI threshold is ≤ 0.10 dB — 0.10 dB is at the limit and passes (the criterion is "≤", not "<"). End-to-end: 5.8 dB < 6.2 dB → passes. This fiber passes both checks. [IEC 61300-3-4 §5; ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]
- **A — Incorrect.** The per-event acceptance uses the bidirectional average (0.10 dB), not the single-direction worst reading (0.14 dB). [IEC 61300-3-4 §5]
- **C — Incorrect.** Using only the forward reading is not the correct acceptance method; bidirectional average is required. [IEC 61300-3-4 §5]
- **D — Incorrect.** ≤ 0.10 dB means 0.10 dB passes (it is not strictly less than; it is less-than-or-equal). End-to-end 5.8 dB < 6.2 dB also passes. [BICSI OSP-DRD Manual, Ch. 9]

---

**Q22.** (Multi-lesson: 2.9 + 2.12) A contractor submits an OSP acceptance package for a FTTH distribution plant with OptiTap hardened connectors at every FDT port. The package includes OTDR traces for all backbone fibers but no end-face inspection images for the FDT adapter ports. The project engineer rejects the package. Why?

- A) The package is incorrectly rejected — end-face inspection images are optional for pre-connectorized hardened connector systems
- B) Hardened connector systems are exempt from IEC 61300-3-35 inspection requirements because they include captive dust caps
- C) End-face inspection images for all connectorized terminations, including FDT adapter ports, are required in the acceptance documentation package per BICSI OSP-DRD Ch. 10 and IEC 61300-3-35 **[CORRECT]**
- D) End-face inspection images are only required for inside-plant connectors; OSP hardened connectors are excepted per ANSI/TIA-758-C

*Source: IEC 61300-3-35; BICSI OSP-DRD Manual, Ch. 10; ANSI/TIA-758-C §9*

*Rationale:*
- **C — Correct.** IEC 61300-3-35 end-face inspection and BICSI OSP-DRD Ch. 10 require inspection images for all connectorized terminations. FDT adapter ports are connectorized terminations — they must be inspected before the first drop cable is mated, and pre/post-clean images must be captured and submitted. The captive dust cap on OptiTap protects the connector end-face during transport, but it does not certify the adapter port's cleanliness after months in a field enclosure. [IEC 61300-3-35; BICSI OSP-DRD Manual, Ch. 10]
- **A, B, D — Incorrect** for the reasons above. Hardened connectors are not exempt from end-face inspection requirements. [IEC 61300-3-35]

---

**Q23.** (Multi-lesson: 2.6 + 2.12) An OSP project's acceptance checklist includes "closure environmental rating verification." An aerial mid-span splice closure is submitted with an IP65 rating. The project specification requires IP68. The contractor argues IP65 is sufficient because the aerial closure will never be fully submerged. Is the contractor correct?

- A) Yes — aerial closures never require IP68 because they are exposed to rain, not submersion
- B) No — the project specification explicitly requires IP68; IP65 does not meet the contract requirement regardless of the installation environment **[CORRECT]**
- C) Yes — IP65 (dust-tight + water jet resistance) is the appropriate rating for aerial closures; IP68 (submersion) is only for buried applications
- D) No — aerial closures require a higher rating than IP68 due to UV exposure and wind-driven rain

*Source: ANSI/TIA-758-C §7.3; BICSI OSP-DRD Manual, Ch. 8; IEC 60529*

*Rationale:*
- **B — Correct.** The project specification is the contract document. If it requires IP68, the closure must be IP68. IP65 does not satisfy IP68. The contractor's argument that aerial closures will not be submerged does not override the specification — closures in some aerial environments (flood zones, areas where windblown water enters hardware) can experience hydrostatic stress. More importantly, the acceptance engineer's role is to verify compliance with the specification, not to re-engineer the specification based on field reasoning. [ANSI/TIA-758-C §7.3; BICSI OSP-DRD Manual, Ch. 8]
- **C — Incorrect.** While IP65 is commonly associated with aerial environments and IP68 with buried, both ratings are used in both environments. The project specification overrides generalizations about typical use. [IEC 60529]

---

**Q24.** (Multi-lesson: 2.11 + 2.12) An OSP contractor's PMLS test record shows insertion loss results for 1310 nm only on a 40-fiber OS2 SMF backbone route. The OTDR archive includes both 1310 nm and 1550 nm traces. The project specification requires ANSI/TIA-526-7 compliance. What is the deficiency?

- A) No deficiency — OTDR traces at 1550 nm satisfy the 1550 nm test requirement; PMLS at 1310 nm only is sufficient
- B) PMLS insertion loss testing at 1550 nm is also required by ANSI/TIA-526-7 for OS2 SMF; the 1550 nm PMLS records are missing from the package **[CORRECT]**
- C) No deficiency — ANSI/TIA-526-7 specifies only 1310 nm for SM fiber; 1550 nm is covered under ANSI/TIA-526-14B
- D) The deficiency is that OTDR traces at two wavelengths are unnecessary — only 1310 nm OTDR traces are required for acceptance

*Source: ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9*

*Rationale:*
- **B — Correct.** ANSI/TIA-526-7 requires PMLS insertion loss testing at both 1310 nm and 1550 nm for OS2 SMF. Having OTDR traces at 1550 nm does not substitute for the PMLS IL measurement at 1550 nm — OTDR and PMLS are separate test methods (OTDR is an indirect IL method; PMLS is a direct IL method), and both are required under Tier 2. The 1550 nm PMLS records must be generated and submitted. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]
- **A — Incorrect.** OTDR traces at 1550 nm satisfy the OTDR component of Tier 2 at that wavelength, but they do not satisfy the PMLS component. [ANSI/TIA-526-7 §3]
- **C — Incorrect.** ANSI/TIA-526-7 explicitly specifies both 1310 nm and 1550 nm for single-mode fiber. ANSI/TIA-526-14B is for multimode fiber. [ANSI/TIA-526-7 §3]

---

**Q25.** (Standards integration: 2.10 + 2.11 + 2.12) A technician completes a Tier 2 acceptance test on an 18 km OS2 SMF backbone route. All bidirectional OTDR splice averages are ≤ 0.08 dB. The PMLS IL at 1310 nm is 9.1 dB; at 1550 nm is 10.3 dB. The IL_max calculated from route parameters (cable: 0.4 dB/km × 18 km = 7.2 dB; 4 splices × 0.10 dB = 0.4 dB; 2 connector pairs × 0.50 dB = 1.0 dB) = 8.6 dB. The splice records and equipment calibration are current. What is the correct acceptance decision?

- A) Pass — all individual splice events pass ≤ 0.08 dB; per-event compliance means the end-to-end link passes
- B) Pass — 1550 nm testing is not part of Tier 2 acceptance for OSP routes
- C) Fail — the 1550 nm PMLS result (10.3 dB) exceeds the IL_max of 8.6 dB; the route fails end-to-end acceptance at 1550 nm **[CORRECT]**
- D) Pass — the 1550 nm result is informational only; only 1310 nm governs acceptance under ANSI/TIA-526-7

*Source: ANSI/TIA-526-7 §3, §6; BICSI OSP-DRD Manual, Ch. 9*

*Rationale:*
- **A — Incorrect.** Per-event splice compliance does not substitute for end-to-end PMLS acceptance. The splice events all pass (≤ 0.08 dB bidirectional average), but the end-to-end PMLS result independently must also be ≤ IL_max. In Tier 2 testing, both per-event OTDR thresholds AND the end-to-end PMLS budget must be satisfied. Here, 9.1 dB > 8.6 dB at 1310 nm — the PMLS also fails at 1310 nm. [ANSI/TIA-526-7 §6; BICSI OSP-DRD Manual, Ch. 9]
- **B — Incorrect.** 1550 nm is a required test wavelength under ANSI/TIA-526-7 for Tier 2 OS2 SMF testing. [ANSI/TIA-526-7 §3]
- **C — Correct.** IL_max = 7.2 + 0.4 + 1.0 = **8.6 dB**. PMLS at 1310 nm = 9.1 dB > 8.6 dB → fails. PMLS at 1550 nm = 10.3 dB > 8.6 dB → fails. Both wavelengths must be ≤ IL_max to pass. In fact, this route fails at both wavelengths. The 1550 nm excess (10.3 − 8.6 = 1.7 dB over budget) suggests a macrobend-induced loss component more visible at 1550 nm — the OTDR 1550 nm traces should be reviewed for a wavelength-dependent loss event not visible in the splice events alone. [ANSI/TIA-526-7 §3, §6; BICSI OSP-DRD Manual, Ch. 9]
- **D — Incorrect.** Both wavelengths are acceptance criteria; 1550 nm is not informational only. [ANSI/TIA-526-7 §3; BICSI OSP-DRD Manual, Ch. 9]

---

## Exam Question Distribution Summary

| Lesson | Questions | Q# |
|---|---|---|
| 2.1 Cleaving Fundamentals | 2 | Q1, Q2 |
| 2.2 Fusion Splicing I | 1 + partial Q21 | Q3 |
| 2.3 Fusion Splicing II | 1 | Q4 |
| 2.4 Mass-Fusion Splicing | 1 | Q5 |
| 2.5 Mechanical Splicing | 1 | Q6 |
| 2.6 Splice Closures | 1 + partial Q23 | Q7 |
| 2.7 Splice Trays | 1 | Q8 |
| 2.8 Termination Methods | 1 | Q9 |
| 2.9 Hardened Connectors | 2 + partial Q22 | Q10, Q11 |
| 2.10 OTDR Testing | 3 + partial Q21, Q25 | Q12, Q13, Q14 |
| 2.11 Power Meter / Tier Testing | 3 + partial Q24, Q25 | Q15, Q16, Q17 |
| 2.12 Acceptance + As-Built | 3 + partial Q22, Q23, Q24 | Q18, Q19, Q20 |
| Multi-lesson integration | 5 | Q21–Q25 |
| **Total** | **25** | — |

**Question type breakdown:**
- Conceptual / recall: Q1, Q2, Q4, Q5, Q7, Q8, Q9, Q10, Q12, Q14, Q16, Q18, Q19, Q22, Q23
- Calculation: Q3, Q13, Q15, Q20, Q21, Q25 (6 questions)
- Standards / code: Q11, Q16, Q17, Q18, Q19, Q22, Q23, Q24 (8 questions)
- Scenario / applied: Q4, Q6, Q9, Q21, Q22, Q23, Q24, Q25

*Moodle import note: All questions are formatted for single-answer multiple-choice. Randomize question order and answer choice order at import time. Do not randomize the answer rationale section — retain with each question for instructor review mode.*
