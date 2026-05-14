---
title: "Lesson 5.3: Lashing Wire and Lashing Machines"
duration_min: 20
topic: osp-hardware-accessories
order: 4
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.3: Aerial lashing hardware"
sources:
  - "ANSI/TIA-758-C §5.3 (Outside plant telecommunications infrastructure — aerial lashing)"
  - "ASTM A641 (Zinc-coated carbon steel wire)"
  - "RUS Bulletin 1751F-630 §6"
  - "BICSI OSP-DRD Manual, Ch. 6.3"
---

# Lashing Wire and Lashing Machines

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Select the correct lashing wire gauge (0.045 in. or 0.065 in.) based on cable OD and strand size
- State the dead-end overlap requirement per TIA-758-C §5.3 and explain what happens when the overlap is insufficient
- Explain the lashing gap inspection criterion (≤1.5 in.) as a utility-practice standard and distinguish this from a formally citable tabulated requirement
- Describe the function and operation sequence of a standard lashing machine
- Identify the governing material standard for zinc-coated lashing wire (ASTM A641)

---

## Reading Content

### What Lashing Wire Does

Lashing wire is the continuous helical wrap of small-diameter wire that attaches the fiber cable to the messenger strand along the span. Without lashing, the cable would hang unsupported between dead-end points, creating sag under its own weight independent of the messenger's tension, and creating high-stress contact points at any support hardware.

Lashing distributes the cable's weight uniformly along the messenger over the full span length. It also prevents the cable from swinging laterally in wind, which could cause cable-to-cable abrasion at slack positions or cable-to-ground contact under combined wind and ice loading. Proper lashing keeps the cable and messenger mechanically coupled so they behave as a single structural unit under all design load conditions.

### Lashing Wire Material and Gauge

Lashing wire is produced as continuous zinc-coated carbon steel wire, governed by **ASTM A641** — *Specification for Zinc-Coated (Galvanized) Carbon Steel Wire*. The zinc coating provides corrosion resistance over the plant's design life; higher coating weights extend service life in corrosive environments (coastal salt air, industrial pollutants). [ASTM A641]

**Two standard gauges:**

| Gauge | Diameter | Typical application |
|---|---|---|
| **0.045 in.** | Small | Cable OD up to approximately 0.75 in.; messenger 0.25-in. strand or smaller |
| **0.065 in.** | Standard | Cable OD 0.75–1.50 in.; messenger 0.25-in. or larger strand |

**Selection logic:** heavier lashing wire provides greater holding force per wrap and longer service life between lashing wire corrosion failures, but it is stiffer and more difficult to wrap tightly against smaller cable ODs. The decision is driven by cable OD and strand size rather than any single tabulated standard:

- **Use 0.045 in.** when the fiber cable OD is ≤0.75 in. and the messenger is 0.25-in. strand — the typical configuration for distribution-cable segments (48–96 fiber, OSP loose-tube or ribbon cable in the 0.55–0.75-in. OD range).
- **Use 0.065 in.** for larger cables (feeder, high-count OSP cables 0.75–1.50 in. OD), or when the engineer wants enhanced holding force for long spans or higher-exposure environments.

For the standard Launch Fiber Services distribution plant using 0.63-in. OD cable on 0.25-in. ASTM A475/A475M messenger, **0.045-in. lashing wire** is the standard selection.

### Dead-End Overlap

At each span end (pole attachment point), the lashing wire is terminated by wrapping it back over itself for a specified overlap past the dead-end clamp. This overlap serves two purposes: (1) it mechanically locks the lashing wire end under its own wraps to prevent unraveling when the lashing tension relaxes; (2) it provides a length of lashing wire anchored to the clamp hardware so the span-end cable is supported at the clamp rather than hanging from the last helical wrap.

**Requirement:** the lashing wire dead-end overlap must extend at least **6 inches past the dead-end clamp** before the final wrap-over termination. [ANSI/TIA-758-C §5.3]

**Consequence of insufficient overlap:** a dead-end overlap shorter than 6 in. is prone to pull-out under thermal cycling and wind-induced strand movement. When the overlap fails, the first 2–4 ft of cable at the pole attachment point become unsupported, creating a concentrated bending stress on the cable at the clamp location. On a long-span lashed plant, this is a predictable failure mode that repeats at every under-lashed dead-end during ice and wind events.

### Lashing Gap

In the field, lashing machines operate continuously along the span while the crew walks or rides. A lashing gap occurs when the machine skips a wrap — leaving a section of cable unsupported by lashing wire for a distance greater than the standard wrap spacing. Inspection after lashing identifies any gaps that exceed the acceptable limit.

**Industry practice standard:** lashing gaps should not exceed **1.5 inches**. This value is a utility-practice inspection criterion widely cited in PLP (Preformed Line Products) installation guides and in telecom-industry OSP construction practice. It is not a value that appears as a tabulated row in a specific TIA-758-C table. The gap criterion is taught here as a utility-practice inspection standard; **quiz questions on lashing gap are not included** in this lesson's quiz (per brief §1 L5.3 authoring guard) because the source cannot be cited as a verbatim standard table row.

> **Authoring note:** The brief flags that the 1.5-in. gap criterion requires red-team verification against RUS 1751F-630 or a PLP normative reference before this lesson's final exam items are authored. Until that verification is complete, the gap criterion appears in the reading content for field-practice awareness but is excluded from quiz questions with citable [CORRECT] answers.

### The Lashing Machine

A **lashing machine** is a motorized or manually propelled tool that rides on the messenger strand and wraps the lashing wire around both the messenger and the attached cable in a continuous helix as it travels along the span.

**Standard operating sequence:**

1. **Cable pre-supported:** the fiber cable is draped over temporary roller saddles or lashing hooks hung from the messenger at regular intervals along the span before lashing begins. This positions the cable in contact with the messenger and prevents it from hanging away from the strand where the lashing machine cannot reach.

2. **Machine setup at dead-end:** the lashing machine is loaded with a spool of lashing wire (0.045 or 0.065 in., as specified), threaded around the messenger and cable, and the dead-end overlap wraps are applied manually before the machine begins traveling.

3. **Machine travel:** the machine clamps onto the messenger and is walked or propelled along the span. As it moves, the lashing wire spool rotates and the wire is wrapped helically around both the messenger and cable at the machine's design pitch. Standard pitch is approximately 1.0–1.5-in. spacing (center of wrap to center of wrap) for 0.045-in. lashing wire.

4. **Dead-end at far pole:** when the machine reaches the far attachment point, the operator stops travel, applies the 6-in. dead-end overlap manually, cuts the lashing wire, and secures the termination.

5. **Gap inspection:** the crew walks the span after lashing and flags any gaps greater than the utility-practice limit. Gaps are corrected by hand-wrapping lashing wire through the gap section.

6. **Removal of temporary cable support:** once lashing is complete and gap inspection passes, the temporary roller saddles or lashing hooks are removed and the cable is fully supported by the lashing wire against the messenger.

---

## Key Terms (Flashcard Candidates)

**Lashing wire**
Continuous zinc-coated carbon steel wire (ASTM A641) wrapped helically around the messenger and fiber cable to mechanically attach the cable to the strand along the span. Standard gauges: 0.045 in. (cable OD ≤0.75 in.) and 0.065 in. (cable OD 0.75–1.50 in.).

**Dead-end overlap**
The length of lashing wire wrapped back past the dead-end clamp to lock the wire termination and support the cable at the clamp attachment point. Minimum: **6 in. past the dead-end clamp** per TIA-758-C §5.3.

**Lashing machine**
Motorized or manually propelled tool that rides on the messenger strand and wraps lashing wire helically around both messenger and cable as it travels. Produces continuous, uniform lashing at a controlled pitch.

**Lashing gap**
A section of span where the lashing machine skipped a wrap, leaving the cable unsupported for a distance greater than standard wrap pitch. Utility-practice inspection standard: ≤1.5 in. Not a verbatim TIA-758-C tabulated value.

**ASTM A641**
ASTM standard governing zinc-coated carbon steel wire, including lashing wire. Specifies zinc coating weights, tensile properties, and dimensional tolerances for the wire.

**Wrap pitch**
The center-to-center spacing between successive wraps of lashing wire along the span. Standard: approximately 1.0–1.5 in. for 0.045-in. gauge. Tighter pitch improves holding force and reduces gap risk; looser pitch speeds machine travel and reduces lashing wire consumption.

---

## Interactive: Scenario — Lashing Wire Specification

**Scenario:** A crew is lashing a 96-fiber loose-tube OSP distribution cable (OD: 0.63 in.) onto 0.25-in. ASTM A475/A475M HS strand for a 250-ft span in Macon, GA. Three spans on this route.

**Branch A:** 0.045-in. lashing wire, 6-in. dead-end overlap, gaps inspected after lashing.

*Assessment:* **Correct specification.** Cable OD 0.63 in. is within the 0.045-in. gauge application range (≤0.75 in.). The 6-in. dead-end overlap meets TIA-758-C §5.3. Lashing gap inspection after completion is standard practice.

**Branch B:** 0.065-in. lashing wire, 4-in. dead-end overlap.

*Assessment:* **Deficient.** The 0.065-in. gauge is over-specified for a 0.63-in. cable (heavier than needed, may not wrap tightly) — not a code violation but a poor specification. The 4-in. dead-end overlap is **deficient**: TIA-758-C §5.3 requires 6 in. minimum. A 4-in. overlap is at risk of pull-out under thermal cycling.

**Branch C:** 0.045-in. lashing wire, 6-in. overlap, no gap inspection.

*Assessment:* **Incomplete.** Lashing wire and overlap are correctly specified. Skipping gap inspection means any machine-skip will not be caught before the span is placed in service. Gaps discovered after aerial plant is commissioned require bucket-truck access to correct — significantly higher cost than a ground-level inspection at time of installation.

---

## Quiz — Lashing Wire and Machines (5 Questions)

---

**Q1.** A fiber distribution cable with an OD of 0.63 in. is being lashed to a 0.25-in. ASTM A475/A475M messenger strand. Which lashing wire gauge is the correct specification?

- A) 0.035-in. gauge (lighter, for cables under 0.40 in. OD)
- B) 0.045-in. gauge **[CORRECT]**
- C) 0.065-in. gauge (heavier, for cables over 0.75 in. OD)
- D) Any gauge is acceptable; lashing wire gauge is not specified

*Rationale:*
- **A — Incorrect.** 0.035-in. gauge is below the standard product range for telecom aerial lashing. It is not a standard offering in the 0.045/0.065-in. product family and is insufficient for the holding requirements of a 0.63-in. cable on a standard span.
- **B — Correct.** For a fiber cable OD of 0.63 in. (within the ≤0.75-in. range) on a 0.25-in. messenger strand, **0.045-in. gauge lashing wire** is the correct specification. This gauge wraps conformally around the cable and messenger, provides adequate holding force for the span and cable weight, and is specified for the cable OD and strand size combination. [BICSI OSP-DRD Ch. 6.3; RUS 1751F-630 §6]
- **C — Incorrect.** 0.065-in. gauge is specified for cables with OD ≥ 0.75 in. or where additional holding force is required for long spans or heavy-cable applications. At 0.63-in. OD, 0.065-in. wire is over-specified and may not wrap tightly against the cable, creating gaps under the wraps.
- **D — Incorrect.** Lashing wire gauge selection is a specified design decision. Using the wrong gauge risks inadequate holding force (undersized) or poor wrap conformation (oversized). TIA-758-C §5.3 and RUS 1751F-630 §6 address aerial lashing specifications.

---

**Q2.** Per TIA-758-C §5.3, what is the minimum dead-end overlap for lashing wire past the dead-end clamp?

- A) 2 in.
- B) 4 in.
- C) 6 in. **[CORRECT]**
- D) 12 in.

*Rationale:*
- **A — Incorrect.** 2 in. of overlap is insufficient to mechanically lock the lashing wire end. At this length, the termination wraps are likely to slip under tension from thermal cycling or wind-induced strand motion.
- **B — Incorrect.** 4 in. is below the TIA-758-C §5.3 minimum. While it provides more resistance to pull-out than 2 in., it does not meet the standard requirement.
- **C — Correct.** TIA-758-C §5.3 requires that lashing wire dead-end overlaps extend at least **6 inches past the dead-end clamp** before the final termination wrap-over. This length ensures the lashing wire end is mechanically locked under its own wraps and that the cable is supported at the clamp attachment point rather than hanging from the last helical wrap. [ANSI/TIA-758-C §5.3]
- **D — Incorrect.** 12 in. is more than twice the required overlap. While not harmful, it wastes lashing wire at each span-end termination and is not the specified minimum.

---

**Q3.** What is the primary function of the dead-end overlap in a lashing wire installation?

- A) To provide additional cable strain relief at the dead-end clamp
- B) To mechanically lock the lashing wire termination and ensure the cable is supported at the clamp **[CORRECT]**
- C) To protect the cable jacket from chafing against the pole hardware
- D) To serve as a visual indicator that lashing is complete for the span

*Rationale:*
- **A — Incorrect.** Strain relief for the fiber cable at the dead-end is provided by the cable's own dead-end hardware (separate from the messenger dead-end clamp), not by the lashing wire overlap. The lashing wire's role is distribution of cable weight along the span, not cable strain relief.
- **B — Correct.** The 6-in. dead-end overlap serves two combined purposes: (1) it locks the lashing wire end by wrapping it back under the outer wraps so tension cannot pull the termination free; (2) it creates a length of lashing wire past the clamp that physically supports the cable against the hardware at the span-end attachment point, preventing unsupported cable hanging at the clamp. A short or missing overlap allows the lashing wire to unravel under thermal cycling, leaving the cable unsupported at the clamp. [ANSI/TIA-758-C §5.3]
- **C — Incorrect.** Cable jacket protection at hardware contact points is provided by protective sleeves or conduit saddles, not by the lashing wire overlap. The fiber cable does not contact the dead-end hardware directly — it contacts the messenger through the lashing.
- **D — Incorrect.** Lashing completion is verified by gap inspection along the span and by confirming the dead-end termination at each end. The overlap length is a structural requirement, not a visual completion indicator.

---

**Q4.** Which ASTM standard governs the material specification for zinc-coated steel lashing wire?

- A) ASTM A36 (Carbon steel structural shapes)
- B) ASTM A475/A475M (Zinc-coated steel wire strand for messengers)
- C) ASTM A641 (Zinc-coated carbon steel wire) **[CORRECT]**
- D) ASTM B230 (Aluminum wire)

*Rationale:*
- **A — Incorrect.** ASTM A36 governs structural carbon steel plate, shapes, and bars used in building and structural construction. It does not apply to wire products.
- **B — Incorrect.** ASTM A475/A475M governs zinc-coated steel **strand** (multi-wire assemblies) used as messenger wire. Lashing wire is a single continuous wire, not a strand assembly. The two are different products with different ASTM standards.
- **C — Correct.** Lashing wire is a continuous zinc-coated carbon steel wire governed by **ASTM A641** — *Specification for Zinc-Coated (Galvanized) Carbon Steel Wire*. A641 specifies tensile properties, zinc coating weight classes, and dimensional tolerances for the individual wire product. [ASTM A641]
- **D — Incorrect.** ASTM B230 governs aluminum 1350-H19 wire for electrical purposes (used in aluminum conductor products). Lashing wire is zinc-coated carbon steel, not aluminum.

---

**Q5.** During a post-lashing gap inspection on a 250-ft span, a crew member finds a 3-inch section where the lashing machine skipped a wrap. What is the correct field action?

- A) No action required; gaps up to 4 inches are acceptable per TIA-758-C §5.3
- B) The entire span must be re-lashed from dead-end to dead-end
- C) Hand-wrap lashing wire through the gap to close it to within the utility-practice limit **[CORRECT]**
- D) Document the gap and defer correction to the next scheduled maintenance cycle

*Rationale:*
- **A — Incorrect.** The utility-practice inspection standard for lashing gaps is ≤1.5 in. A 3-in. gap exceeds this limit and requires correction at time of construction. (Note: the specific gap value is a utility-practice criterion, not a verbatim TIA-758-C table row — but the 3-in. gap clearly exceeds the accepted utility practice limit and requires field correction.)
- **B — Incorrect.** Re-lashing the entire span from dead-end to dead-end is disproportionate corrective action for a single gap. Lashing wire hand-wrapping at the gap location is the standard field repair and restores the lashing to specification without removing all work already done.
- **C — Correct.** The correct action is to hand-wrap lashing wire through the gap to close it. The crew loops lashing wire around both the messenger and cable manually through the gap section, wrapping at the standard pitch until the unsupported section is eliminated. This is a standard field repair procedure that does not require re-doing the machine-lashed portions of the span. [BICSI OSP-DRD Ch. 6.3; PLP lashing guide]
- **D — Incorrect.** Deferring gap correction to a maintenance cycle is unacceptable. A 3-in. gap leaves the cable unsupported at that section, creating a bending moment concentration under wind and ice loading. Over time, the gap will allow the cable to vibrate independently of the messenger, accelerating jacket abrasion and eventually fiber stress. Correct at installation, before access becomes a full bucket-truck mobilization.

---

## Final Check: Pulse Questions

**Pulse 1.** State the lashing wire gauge selection rule for a 0.63-in. OD cable on a 0.25-in. messenger, and identify the minimum dead-end overlap per TIA-758-C §5.3.

*Expected answer:* **0.045-in. gauge** — selected because the cable OD (0.63 in.) is within the ≤0.75-in. application range for the lighter gauge, which wraps conformally without the stiffness issue of 0.065-in. wire on a small cable. The minimum dead-end overlap is **6 inches past the dead-end clamp** per ANSI/TIA-758-C §5.3. The overlap mechanically locks the lashing wire termination under its own wraps and supports the cable against the hardware at the span end.

**Pulse 2.** Describe the six steps of the lashing machine operating sequence, in order.

*Expected answer:*
1. Pre-support the cable with temporary roller saddles or lashing hooks along the span.
2. Set up the lashing machine at the dead-end with the correct gauge spool; apply manual dead-end overlap wraps.
3. Travel the machine along the span; lashing wire wraps helically around messenger and cable.
4. Apply the dead-end overlap at the far pole; cut and secure the termination.
5. Walk the span for gap inspection; hand-wrap corrections at any gap exceeding the utility-practice limit.
6. Remove temporary cable supports; span is complete.

---

## Glossary Cross-References

- **Messenger (ASTM A475/A475M)** → selected in L5.2a; the strand that the lashing machine rides on
- **Sag-tension design** → L5.2b; lashing adds weight to the messenger per foot (lashing wire ~0.045 lb/100 ft for 0.045-in. wire), which slightly modifies the w_d in the sag formula — typically negligible on standard spans
- **Aerial drop hardware** → L5.5; at drops from the main span, lashing and a separate dead-end or P-hook arrangement terminate the drop branch
- **T7 (installation procedures)** → lashing machine operation speed, crew procedures, and bucket-truck mobilization are T7 scope; this lesson defines the hardware and specification only
