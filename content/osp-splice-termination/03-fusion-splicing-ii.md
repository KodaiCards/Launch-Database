---
title: "Lesson 2.3: Fusion Splicing II — Automated Splice Estimation, QA Criteria, and Re-splicing"
duration_min: 25
topic: splice-termination
order: 3
bicsi_alignment:
  - "OSP-DRD 7.4: Fusion splicing — QA, re-splice criteria, and protection sleeve application"
  - "OSP-DRD 7.1: Splice acceptance and as-built documentation"
sources:
  - "IEC 61300-3-4 (attenuation measurement — backscatter method)"
  - "Fujikura FSM-series Fusion Splicer Operation Manual (public training edition)"
  - "Sumitomo Type-82C Field Fusion Splicer Operation Guide"
  - "BICSI OSP-DRD Manual, Ch. 7.4"
  - "AT&T OSP Construction Practices (publicly available subset)"
  - "Corning Cable Systems OSP Splicing Procedures Guide, Rev. 3"
---

# Fusion Splicing II: Automated Splice Estimation, QA Criteria, and Re-splicing

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Explain how a fusion splicer's automated image processor generates an estimated splice loss value and identify the geometric parameters it measures
- Apply a three-tier QA decision tree (accept / re-arc / re-splice) to a given splicer screen readout
- Describe re-arc capability — what it corrects, what it does not, and when it must not be used
- Execute the correct splice protection sleeve application procedure, including cooling time and holder selection
- State the BICSI-default and project-spec tight acceptance thresholds and explain how to determine which governs a given project

---

## Reading Content

### How the Splicer Computes Estimated Loss

Every modern fusion splicer integrates an automated splice estimation algorithm that evaluates the completed splice immediately after the main arc cycle. The estimation runs without operator intervention and produces a loss value displayed on screen within seconds of arc completion. Understanding how this estimate is generated — and its limits — prevents both over-reliance and misinterpretation [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1].

**What the image processor measures:** After the arc, the splicer's CCD cameras capture an image of the splice zone from two orthogonal axes. The image processor analyzes this image for four geometric parameters:

1. **Core offset.** The lateral displacement between the two fiber core centers in the splice zone. Even after PAS alignment, a small residual offset (typically <0.5 µm) may remain. The offset contribution to estimated loss is computed from the Gaussian mode field overlap integral: loss ≈ (offset / MFD)² × 4.34 dB, approximated linearly for small offsets [Fujikura FSM-series Manual, §5.1].

2. **Core deformation.** The degree to which the arc heated the fiber core unevenly, producing an elliptical or irregular cross-section. Severe deformation (visible as a distorted core image) increases mode field mismatch loss.

3. **Bubble presence.** A bubble in the splice zone appears as a bright or dark circular inclusion on the core axis. Bubbles form from trapped gas or volatile contamination on the fiber surface that vaporizes during the arc. A core-axis bubble is grounds for automatic splice rejection by the splicer; an off-axis bubble may produce a marginal estimated loss value.

4. **End-face angle (cleave residual).** The residual angular deviation of the cleaved end-faces, measured before the arc fires. Both Fujikura and Sumitomo splicers incorporate cleave angle measurement as part of the pre-splice inspection, and the estimated loss model includes cleave angle contribution [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1].

**What the image processor cannot measure:** The arc heating cycle changes the glass's refractive index profile in the splice zone — diffusion of dopants (germanium, fluorine) across the original core/cladding boundary. This "chemical diffusion" component of splice loss is invisible to the camera. It produces the systematic difference between estimated and OTDR-measured loss, particularly notable on fibers with steep refractive index profiles (high-delta fibers, non-zero DSF) [BICSI OSP-DRD Manual, Ch. 7.4; AT&T OSP Construction Practices §7.2].

### Acceptance Thresholds: Three Tiers

Project specifications set the governing acceptance criterion; the technician applies it to every splice. Three tiers are encountered in OSP work:

| Tier | Estimated loss threshold | OTDR-measured threshold | Applicable standard or source |
|---|---|---|---|
| BICSI default (OSP backbone, RUS, construction) | ≤ 0.10 dB | ≤ 0.10 dB per splice (bidirectional average) | BICSI OSP-DRD Manual, Ch. 7.4 |
| AT&T / Verizon carrier-class (feeder and backbone) | ≤ 0.05 dB | ≤ 0.07 dB (bidirectional avg, from OTDR) | AT&T OSP Construction Practices §7.2 |
| Project-tight (metro DWDM, long-haul backbone) | ≤ 0.05 dB | ≤ 0.05 dB (OTDR-measured) | Project specification (varies) |

*Sources: [BICSI OSP-DRD Manual, Ch. 7.4; AT&T OSP Construction Practices §7.2]*

In the absence of a project-specific specification, BICSI default applies. For government-funded (RUS / USDA) rural broadband projects, the BICSI default is typically the floor; state-level program offices sometimes impose tighter thresholds on trunk routes.

When two thresholds conflict (e.g., a project spec says ≤0.05 dB but the splicer screen shows an estimate of 0.07 dB), the project specification governs and the splice must be re-evaluated by OTDR. The estimated loss is not a substitute for OTDR measurement when operating near or above the acceptance threshold [BICSI OSP-DRD Manual, Ch. 7.4].

### The QA Decision Tree: Accept / Re-Arc / Re-Splice

After each splice cycle, the technician follows a systematic decision tree. The governing logic is: address the root cause at the lowest-cost intervention first; escalate only when the lower intervention cannot resolve it [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §5.2].

```
SPLICE COMPLETE
    │
    ▼
[Splicer auto-inspection] ────────────────────────────────────
    │                                                          │
Cleave error detected                                  No cleave error
(angle > threshold, bubble on axis)                          │
    │                                                          ▼
Splicer auto-rejects                              Estimated loss displayed
    │                                                          │
Re-cleave both fibers                              ┌───────────┴──────────┐
and repeat                                         │                       │
                                             Loss ≤ threshold        Loss > threshold
                                             (e.g., ≤ 0.10 dB)      (e.g., > 0.10 dB)
                                                   │                       │
                                             ACCEPT                  RE-ARC eligible?
                                             Apply sleeve             ┌─────┴───────┐
                                                                   Yes              No
                                                                     │              │
                                                             Estimated loss    Core offset visible
                                                             marginally         OR bubble OR
                                                             high (0.10–0.20)   bad end-face:
                                                                     │          RE-SPLICE
                                                              FIRE RE-ARC
                                                                     │
                                                              Re-estimate
                                                              ┌──────┴──────┐
                                                           Improved      Not improved
                                                              │              │
                                                           ACCEPT         RE-SPLICE
```

**Accept:** Estimated loss is at or below the project acceptance threshold, no splicer-detected defects. Apply splice protection sleeve immediately; proceed to next splice.

**Re-arc:** Fire the arc a second time on an already-fused splice. Re-arc supplies additional heat to the splice zone, allowing further diffusion to reduce residual stress and slightly reduce loss in some cases. Re-arc is effective when the splice zone looks geometrically good but estimated loss is above threshold — the typical working guidance for where re-arc tends to be beneficial is 0.10–0.20 dB, but this is not a hard ceiling. A geometrically clean splice above 0.20 dB may still be re-arced at the technician's discretion; however, if loss is substantially elevated (e.g., >0.30 dB) without any identifiable geometric defect, dopant diffusion or sub-surface contamination is the more likely root cause and re-splice is the better first action. **Re-arc is not effective and must not be used when:** (a) there is visible core offset or bubble in the splice zone (re-arc will not correct geometric misalignment); (b) the end-face shows a defect (re-arc adds energy without repositioning the fiber); (c) the splice has already received one re-arc (repeated re-arcs anneal the glass further, increasing splice zone fragility) [Fujikura FSM-series Manual, §5.3; Sumitomo Type-82C Guide, §4.2; BICSI OSP-DRD Manual, Ch. 7.4].

**Re-splice:** Pull the completed splice apart, re-strip the fiber if sufficient length allows, re-clean, re-cleave both ends, and attempt a new splice. Re-splice is required when: (a) the splicer auto-rejects due to cleave error or bubble; (b) re-arc does not improve the estimated loss to below threshold; (c) visible geometric defects are present (core offset, deformation). Re-splice consumes fiber length — 15–25 mm per attempt — and the technician must confirm sufficient slack coil remains before proceeding. **Minimum re-splice threshold:** After sleeve removal, each fiber end must have at least 50–60 mm of prepared length remaining (approximately 20 mm additional bare fiber beyond what the sleeve occupied on each side, plus re-strip and re-cleave margin). If either fiber end falls below this threshold, re-splice at the current location is not possible and the closure must be repositioned to expose additional slack [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.5].

### Splice Protection Sleeve Application

Immediately after an accepted splice, the bare glass in the splice zone must be protected before the closure is loaded. Splice protection sleeves (heat-shrink reinforcement sleeves) are the standard field protection method for single-fiber fusion splices [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1].

**Sleeve anatomy:** A splice protection sleeve consists of an outer heat-shrink polymer tube, an inner stainless steel strength rod (or ceramic rod), and optional inner hot-melt adhesive liner. When heated, the outer tube shrinks to grip the fiber coating on both sides of the splice zone; the steel rod provides bend resistance across the splice to prevent over-bending during closure loading.

**Application procedure:**
1. Thread the sleeve onto the fiber before cleaving one end (sleeve must be pre-loaded — once the splice is made, both fiber ends are joined and the sleeve cannot be added without re-splicing).
2. Center the sleeve over the splice zone, with equal fiber coating extending on each side.
3. Place the sleeved splice in the splicer's heat oven (integrated into all field fusion splicers; the oven is sized for standard splice protection sleeves).
4. Activate the heat cycle per the splicer's program. The cycle time is typically 30–60 seconds for standard 40 mm or 60 mm sleeves.
5. After the cycle, remove the sleeve from the oven and allow it to cool on the cooling shelf (integrated tray on most splicers) until the adhesive has set — typically 30–60 seconds of cooling time before placing in the splice tray.

**Do not place a sleeve in the closure tray before it has cooled.** A still-hot sleeve in a curved tray can induce a bend set in the glass during cooling, potentially causing micro-crack initiation at the splice zone or elevated loss from bend-induced attenuation [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1].

**Sleeve length selection:** Standard single-fiber sleeves are 40 mm (for use with standard splicers) or 60 mm (for longer bare fiber sections or when the 40 mm sleeve is too short to cover the stripped zone). Ribbon splices use dedicated ribbon protection sleeves — wider, stiffer, with a multi-fiber strength element. Do not use a single-fiber sleeve on a mass-fusion ribbon splice.

### Environmental Factors Affecting Estimation Accuracy

The splicer's estimation algorithm is calibrated for nominal conditions (standard temperature and humidity, calibrated electrodes, standard fiber type). Deviations from nominal conditions affect estimation accuracy:

**Electrode wear.** As tungsten electrodes erode over thousands of arc cycles, the arc geometry changes — the arc becomes slightly asymmetric and less focused. This causes the arc to heat fibers unevenly, producing slight deformations that the image processor interprets as higher estimated loss. Both Fujikura and Sumitomo splicers include electrode calibration/ARC CHECK routines that should be run daily (or whenever arc quality degrades). Some Fujikura models include automatic electrode wear compensation that adjusts arc current without operator intervention [Fujikura FSM-series Manual, §4.4; Sumitomo Type-82C Guide, §3.5].

**Temperature extremes.** Below freezing, glass becomes less plastic during fusion — the same arc energy softens the glass less effectively, sometimes requiring the operator to switch to a cold-weather splice program (higher arc current or longer duration). Above 40°C (104°F), the opposite effect applies. Most field splicers include temperature-compensated splice programs for both extremes [Fujikura FSM-series Manual, §4.3].

**Fiber contamination post-cleave.** Any finger contact, oil from a skin surface, gel residue not fully removed during stripping, or moisture condensation on the fiber after cleaning produces an inclusion in the splice zone. The image processor may not detect a sub-surface contamination inclusion; the resulting splice may pass estimated loss screening while having elevated OTDR-measured loss or long-term reliability issues. Clean twice with IPA, let dry, and do not re-contact the cleaned surface before loading the cleaver [Corning OSP Splicing Guide, §3.3; BICSI OSP-DRD Manual, Ch. 7.3].

---

## Key Terms (Flashcard Candidates)

**Automated splice estimation**
The image-processor function in a fusion splicer that measures geometric parameters of the completed splice zone (core offset, deformation, bubble, cleave residual) and computes an estimated loss value. Displayed on screen within seconds of arc completion. Not equivalent to OTDR-measured optical loss; used as a field QA screening tool. [Fujikura FSM-series Manual, §5.1]

**Core deformation**
A splice zone defect in which the arc heating produces an elliptical or distorted core cross-section, visible on the splicer's inspection image. Increases mode field mismatch loss beyond the level predicted by core offset alone. [Fujikura FSM-series Manual, §5.1]

**Bubble**
A gas or vaporized-contamination inclusion in the splice zone, visible as a bright or dark circular feature on the splicer's image. A bubble on the core axis is grounds for automatic splice rejection. Off-axis bubbles produce marginally elevated estimated loss and may require re-splice depending on the loss magnitude. [Fujikura FSM-series Manual, §5.1; Sumitomo Type-82C Guide, §4.1]

**Re-arc**
A second arc cycle applied to an already-fused splice to supply additional heat, allowing further glass diffusion that can marginally reduce residual stress and slightly lower estimated loss. Effective only for marginally elevated loss on geometrically good splices; ineffective and contraindicated for splices with visible core offset, bubbles, or defects. Limited to one re-arc per splice. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Re-splice**
The process of separating a completed (or failed) fusion splice, re-stripping the fiber (if sufficient length allows), re-cleaning, re-cleaving both ends, and performing a new splice cycle. Required when splicer auto-rejects, when re-arc fails to bring loss to threshold, or when visible geometric defects are present. Consumes 15–25 mm of fiber per attempt. [BICSI OSP-DRD Manual, Ch. 7.4]

**Splice protection sleeve**
A heat-shrink reinforcement sleeve placed over the bare splice zone after a successful fusion splice. Consists of an outer heat-shrink tube, inner steel or ceramic strength rod, and optional adhesive liner. Applied in the splicer's integrated heat oven. Must cool before placement in splice tray. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

**Electrode wear compensation**
Splicer function that adjusts arc current to compensate for tungsten electrode erosion. Implemented as an automatic loop (Fujikura FSM-series) or as a manual ARC CHECK calibration cycle (Sumitomo Type-82C) run at the start of each work session. [Fujikura FSM-series Manual, §4.4; Sumitomo Type-82C Guide, §3.5]

**BICSI default acceptance threshold**
≤0.10 dB estimated (or OTDR-measured bidirectional average) per splice for OS2 SMF fusion splices, per BICSI OSP-DRD Manual, Ch. 7.4. The floor specification for OSP construction and RUS-program projects in the absence of a tighter project-specific criterion.

**Dopant diffusion**
The migration of refractive-index-modifying dopants (germanium, fluorine) across the core/cladding boundary in the heat-affected zone of a fusion splice. Produces refractive index profile changes that are invisible to the splicer's camera, explaining the systematic difference between estimated and OTDR-measured splice loss. [AT&T OSP Construction Practices §7.2; BICSI OSP-DRD Manual, Ch. 7.4]

---

## Interactive: Scenario — QA Decision Tree Walkthrough

### Scenario

A field technician is splicing OS2 SMF in a buried closure on a RUS-funded rural broadband feeder route. The project specification requires ≤0.10 dB per splice (BICSI default). After completing Splice 7 in the closure, the splicer screen shows the following:

- Estimated splice loss: **0.18 dB**
- Cleave angle reading: **0.3° / 0.4°** (both fibers within ≤0.5° acceptance)
- Splicer image: core positions appear aligned; no visible bubble; slight brightness asymmetry at the splice zone suggesting minor electrode asymmetry

Walk through the accept / re-arc / re-splice decision for this splice.

---

**Decision step 1 — Is the estimated loss within the project acceptance threshold?**

No. 0.18 dB exceeds the ≤0.10 dB project threshold. Action required.

**Decision step 2 — Is re-arc appropriate?**

Evaluate re-arc eligibility:
- Cleave angles (0.3° / 0.4°) are within the ≤0.5° single-fiber acceptance limit ✓
- No visible core offset on splicer image ✓
- No bubble visible on core axis ✓
- Estimated loss is in the 0.10–0.20 dB range (marginally elevated, not catastrophically failed) ✓
- This is the first arc on this splice (no previous re-arc applied) ✓

All eligibility criteria for re-arc are met. **Fire re-arc.** [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Decision step 3 — Re-arc result: estimated loss improves to 0.07 dB**

0.07 dB < 0.10 dB acceptance threshold. No visible defects on re-inspection. **Accept the splice.** Apply protection sleeve immediately. [BICSI OSP-DRD Manual, Ch. 7.4]

---

**Alternate branch — Re-arc does not improve loss (result: 0.16 dB)**

If re-arc had returned 0.16 dB:
- Re-arc did not reduce loss to threshold.
- Re-arc has now been used once on this splice (additional re-arcs are contraindicated).
- Core is visually aligned; no geometric defect explains the persistent loss.
- Root cause is most likely dopant diffusion or sub-surface contamination invisible to the image processor.

**Action: Re-splice.** Pull the splice, confirm remaining fiber length (must allow for re-stripping and re-cleaving — minimum 20 mm additional from each fiber side after sleeve removal). Re-clean and re-cleave. If the fiber is too short to re-splice at this location, the closure must be repositioned to expose additional slack. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.5]

---

**Alternate branch — Bubble visible on core axis**

If the post-arc image had shown a bubble on the core axis: the splicer should auto-reject. If the operator is working with an older splicer that does not auto-reject, or if the bubble appears on re-arc image inspection: **Re-splice immediately.** Re-arc cannot remove a bubble; additional heat will not vaporize or migrate a glass-trapped gas inclusion. A core-axis bubble produces an optical path obstruction and will result in measured splice loss far exceeding any acceptance threshold. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4]

---

## Multiple-Choice Quiz

---

**Q1.** A splicer displays an estimated splice loss of 0.14 dB on OS2 SMF with no visible core offset, no bubble, and a cleave angle of 0.4°. The project specification is ≤0.10 dB. The technician considers firing a re-arc. Which statement best describes whether re-arc is appropriate?

- A) Re-arc is not appropriate — the cleave angle of 0.4° is the root cause, and the fibers must be re-cleaved
- B) Re-arc is appropriate — the splice is geometrically good and the loss is marginally elevated without visible defects **[CORRECT]**
- C) Re-arc is not appropriate — re-arc is only permitted when estimated loss exceeds 0.20 dB
- D) Re-arc is appropriate — it should always be attempted before re-splicing, regardless of loss level or visible defects

*Rationale:*
- **A — Incorrect.** A cleave angle of 0.4° is within the ≤0.5° acceptance threshold for single-fiber fusion — this is not an out-of-spec cleave. The cleave angle is not the root cause of the elevated loss. Re-cleaving is not warranted based on a compliant cleave angle. [IEC 61300-3-35 §4.1; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Correct.** Re-arc is appropriate when: the estimated loss is marginally elevated (0.10–0.20 dB range); the cleave angle is within spec; there is no visible core offset or bubble in the splice zone; and this is the first arc attempt. All four conditions are met. Re-arc supplies additional heat to allow further glass diffusion, which can reduce residual stress-related loss in geometrically good splices. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** There is no ">0.20 dB" minimum threshold for re-arc eligibility. Re-arc is appropriate for any marginally elevated loss on a geometrically good splice where it meets the eligibility criteria — the 0.10–0.20 dB range is a typical working guidance for when re-arc is useful, not a hard trigger threshold. [Fujikura FSM-series Manual, §5.3]
- **D — Incorrect.** Re-arc is contraindicated when visible defects are present (core offset, bubble, deformation). Applying re-arc to a splice with a core-axis bubble, for example, does not remove the bubble and further anneals the glass, potentially worsening splice zone integrity. Re-arc is not a universal first step before re-splice. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

---

**Q2.** Immediately after a re-arc, the splicer displays an estimated splice loss of 0.08 dB — below the project's ≤0.10 dB threshold. The technician removes the splice from the holder and immediately places it in the splice tray. The protection sleeve has been heated but the technician skips the cooling step to save time. What risk does this introduce?

- A) No risk — the acceptance threshold has been met and the sleeve is heated correctly
- B) The sleeve's heat-shrink bond may fail without cooling, causing the sleeve to slide off the splice zone in service
- C) The still-hot sleeve in the curved splice tray can induce a bend set in the glass during cooling, risking micro-crack initiation or elevated bend loss **[CORRECT]**
- D) Skipping cooling only affects sleeve cosmetics (appearance); it has no impact on optical performance

*Rationale:*
- **A — Incorrect.** The acceptance threshold is met, but the protection sleeve application process has not been correctly completed. Skipping the cooling step is a procedure error that introduces a specific mechanical risk. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **B — Incorrect.** A properly heated sleeve that shrinks around the fiber and cools will maintain its grip. The concern is not sleeve bond failure — it is the behavior of the glass while the sleeve is still hot and the fiber is forced into a tray bend radius. [Corning OSP Splicing Guide, §5.1]
- **C — Correct.** If the splice protection sleeve is still hot (and the hot-melt adhesive liner is still fluid) when the spliced fiber is placed in the tray, the fiber can be forced into a small-radius bend by the tray geometry while the glass is still slightly compliant from residual heat. As the sleeve cools in that bent position, it sets a permanent bend at the splice zone — creating a micro-stress concentration that can cause micro-crack initiation over time or elevated bend-loss. The cooling step allows the sleeve to solidify in a straight, unstressed position before the fiber is bent to tray radius. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **D — Incorrect.** Sleeve appearance is not the concern — structural integrity of the glass at the splice zone is. This is not a cosmetic procedure step. [Corning OSP Splicing Guide, §5.1]

---

**Q3.** A technician splices two OS2 fibers and the splicer auto-rejects, displaying "BUBBLE ON AXIS." The technician fires a re-arc to attempt to remove the bubble. After re-arc, the bubble is still visible. What should the technician do?

- A) Fire a second re-arc — repeated re-arcs at increasing energy will eventually vaporize the bubble
- B) Accept the splice if estimated loss is below the project threshold, despite the visible bubble
- C) Re-splice — a core-axis bubble cannot be removed by re-arc and requires a new splice cycle **[CORRECT]**
- D) Apply the protection sleeve and proceed — the bubble will anneal out of the splice zone in service under thermal cycling

*Rationale:*
- **A — Incorrect.** A gas or vaporized-contamination bubble in the glass matrix cannot be removed by re-arcing. Additional heat does not eliminate the bubble — it may cause the bubble to migrate slightly or merge with micro-voids, but it will not produce a clear splice zone. Repeated re-arcs on a splice with a core-axis bubble progressively anneal and weaken the splice zone glass without resolving the defect. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** A core-axis bubble is a structural defect in the splice zone, not merely an elevated loss reading. The splicer auto-rejected this splice for a reason. Even if the estimated loss appears acceptable on re-arc (the bubble might be slightly off-axis post-re-arc), the bubble represents a long-term reliability risk — bubbles introduce stress concentrations that can propagate to fracture under thermal cycling or mechanical loading. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Correct.** A core-axis bubble requires re-splice. The bubble formed from a gas or vaporized contamination inclusion during arc fusion — re-arc does not remove it. The technician must pull the splice, identify the contamination source (inadequate pre-cleave cleaning, gel residue, moisture), re-clean thoroughly, re-cleave, and re-splice. [Fujikura FSM-series Manual, §5.2; BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §4.5]
- **D — Incorrect.** Bubbles in fused silica glass do not "anneal out" under service temperatures. Optical fiber service temperatures (−40°C to +70°C typical for OSP) are far below the glass softening point (approximately 1900°C for silica). The bubble will remain structurally unchanged throughout the service life of the cable plant. [Fujikura FSM-series Manual, §5.2]

---

**Q4.** A project specification for a government RUS-funded rural broadband route states splice loss ≤0.10 dB (BICSI default). A PAS fusion splicer consistently produces estimated losses of 0.03–0.06 dB per splice throughout the closure. The OTDR operator verifies these splices and reports all bidirectional average losses in the range 0.05–0.09 dB. What conclusion is most accurate?

- A) The splicer is out of calibration — estimated loss should match OTDR loss for a PAS splicer
- B) The OTDR measurements are incorrect — OTDR-measured loss typically equals estimated loss for high-quality PAS splices
- C) This is the expected relationship — estimated loss typically underestimates true optical loss, particularly for good-quality splices; all splices pass the ≤0.10 dB specification **[CORRECT]**
- D) The splices fail — OTDR-measured loss must not exceed estimated loss; splices where OTDR > estimated must be re-done

*Rationale:*
- **A — Incorrect.** The splicer is not out of calibration. Estimated loss systematically underestimates true optical loss because the image processor cannot measure dopant diffusion in the splice zone — a physical phenomenon invisible to the camera. The 0.03–0.06 dB estimates producing 0.05–0.09 dB OTDR measurements is entirely consistent with correct splicer operation. [Fujikura FSM-series Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** OTDR-measured and estimated losses are not expected to match. Estimated loss systematically underestimates, not equals, the optical loss for well-executed splices. The OTDR measurements in this scenario are consistent with the expected relationship, not indicative of error. [Fujikura FSM-series Manual, §5.1; IEC 61300-3-4 §5]
- **C — Correct.** Estimated loss from a PAS splicer systematically underestimates true optical loss because the image processor measures geometric parameters (core offset, deformation) but cannot see dopant diffusion in the splice zone. A splice showing 0.03–0.06 dB estimated frequently measures 0.05–0.09 dB by OTDR. All measurements reported (0.05–0.09 dB OTDR-measured) are below the ≤0.10 dB RUS/BICSI threshold — all splices pass. [Fujikura FSM-series Manual, §5.1; BICSI OSP-DRD Manual, Ch. 7.4; IEC 61300-3-4 §5]
- **D — Incorrect.** There is no requirement that OTDR-measured loss must not exceed estimated loss. Estimated loss is a proxy indicator, not a floor. OTDR > estimated is the normal expected relationship for well-executed splices. The acceptance criterion is whether OTDR-measured loss is within the project threshold, not whether it matches or is below the estimated value. [BICSI OSP-DRD Manual, Ch. 7.4]

---

**Q5.** A splice protection sleeve has been heated and removed from the splicer's oven. The oven cycle completed 15 seconds ago. The technician needs to place the sleeved fiber in the splice tray to complete the closure before an incoming weather front arrives. What should the technician do?

- A) Place the splice in the tray immediately — 15 seconds of cooling is sufficient for standard 40 mm sleeves
- B) Wait the full 30–60 second cooling period on the cooling shelf before placing in the tray **[CORRECT]**
- C) Cool the sleeve under cool water to accelerate cooling and immediately place in the tray
- D) The cooling step applies only to 60 mm sleeves; 40 mm sleeves can be placed in the tray immediately after oven removal

*Rationale:*
- **A — Incorrect.** 15 seconds is insufficient for the hot-melt adhesive liner to solidify and the outer heat-shrink tube to stabilize. The sleeve will still be thermally compliant 15 seconds after oven removal — placing it in a curved tray at this point imposes a bend radius on still-soft material, potentially setting a permanent bend at the splice zone. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **B — Correct.** The standard cooling period is **30–60 seconds** on the integrated cooling shelf before placing the sleeved splice in the tray. This allows the outer heat-shrink tube to fully contract and the inner adhesive liner to solidify, locking the splice zone geometry in a straight, unstressed position. The incoming weather front is not a justification for shortcutting this procedure step — a failed splice from a heat-set bend radius creates far more delay than 45 seconds of cooling time. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]
- **C — Incorrect.** Applying water to a heated splice protection sleeve and fiber assembly is not an approved cooling method. Thermal shock from rapid water cooling can induce micro-fractures in the splice zone glass. This method is not specified by any splicer manufacturer or industry standard. [Fujikura FSM-series Manual; Corning OSP Splicing Guide, §5.1]
- **D — Incorrect.** The cooling requirement applies to all standard splice protection sleeve sizes — 40 mm and 60 mm — and is not sleeve-size dependent. The physical mechanism (hot-melt adhesive solidification, heat-shrink stabilization) applies to both sleeve lengths. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

---

## Final Check

Answer these three questions before advancing to Lesson 2.4 (Mass-Fusion Splicing).

**Pulse 1.** State the three eligibility conditions that must be met before a re-arc is appropriate, and identify one condition that disqualifies re-arc as an option.

*Expected answer:* Re-arc is appropriate when: (1) estimated loss is marginally elevated (e.g., 0.10–0.20 dB) without visible geometric defects; (2) cleave angles are within spec; (3) this is the first arc on this splice (no previous re-arc applied). Re-arc is **disqualified** when any of the following are present: visible core offset, bubble on the core axis, core deformation, or a bad end-face. Re-arc cannot correct geometric defects — only re-splice can. [Fujikura FSM-series Manual, §5.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Pulse 2.** Why does a splicer's estimated splice loss typically underestimate the OTDR-measured optical loss, and what does this mean for field acceptance documentation?

*Expected answer:* Estimated loss is computed from geometric measurements (core offset, deformation, bubble, cleave residual) by the image processor. It cannot see **dopant diffusion** — the migration of refractive index-modifying dopants across the core/cladding boundary during arc heating — which changes the waveguide's optical properties in the splice zone. This dopant-diffusion component is invisible to the camera but contributes to actual optical loss. As a result, estimated loss systematically underestimates true optical loss. For acceptance documentation, **OTDR-measured bidirectional average splice loss** is the governing value — not the splicer's estimated loss display. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-series Manual, §5.1; IEC 61300-3-4 §5]

**Pulse 3.** A splice protection sleeve has been heated in the splicer oven and removed. Describe the two steps remaining before this fiber is ready for placement in the splice tray.

*Expected answer:* (1) **Place the sleeved fiber on the cooling shelf** (integrated into the splicer) for 30–60 seconds to allow the hot-melt adhesive to solidify and the outer heat-shrink tube to stabilize in a straight, unstressed geometry. (2) **Verify the sleeve has cooled** (the adhesive liner is no longer fluid; the sleeve is rigid and holds its shape) before placing the fiber in the tray at the tray's bend radius. Placing a still-hot sleeve in the curved tray can set a permanent bend at the splice zone during cooling. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.1]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Automated splice estimation** → Lesson 2.4 (Mass-Fusion — mass-fusion splicers use an analogous per-fiber estimation algorithm across the ribbon array)
- **Re-arc / re-splice** → foundational decision vocabulary for all fusion splice QA; referenced in Lesson 2.4 and Lesson 2.12 (Acceptance Testing — re-splice rate is a field productivity metric in as-built documentation)
- **Splice protection sleeve** → Lesson 2.4 (ribbon splices use dedicated ribbon protection sleeves — different product, same principle); Lesson 2.7 (Splice Trays — sleeves are placed in trays with minimum bend radius considerations)
- **BICSI default acceptance threshold (≤0.10 dB)** → Lesson 2.10 (OTDR Testing — per-splice event thresholds on the OTDR trace correlate to this acceptance value); Lesson 2.12 (Acceptance Testing — governing criterion for RUS / OSP construction projects)
- **Dopant diffusion** → Lesson 2.2 back-reference for why estimated ≠ measured; forward: Lesson 2.4 (ribbon splicing — dopant diffusion contributes to the per-fiber loss distribution across a mass-fusion array)
- **Electrode wear compensation** → Lesson 2.4 (ribbon splicers use the same electrode calibration requirement; Sumitomo ARC CHECK and Fujikura auto-compensation apply identically to ribbon splicer models)
