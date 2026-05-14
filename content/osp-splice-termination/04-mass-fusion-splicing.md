---
title: "Lesson 2.4: Mass-Fusion Splicing — Ribbon Prep, Holder Alignment, and Cycle Times"
duration_min: 25
topic: splice-termination
order: 4
bicsi_alignment:
  - "OSP-DRD 7.4: Mass-fusion splicing — ribbon fiber handling, equipment operation, and acceptance criteria"
  - "OSP-DRD 7.1: Splice preparation for multi-fiber ribbon cable"
sources:
  - "Fujikura FSM-60R / FSM-70R / FSM-90R Ribbon Fusion Splicer Operation Manual (public training edition)"
  - "Sumitomo Type-71M+ Ribbon Fusion Splicer Operation Guide"
  - "BICSI OSP-DRD Manual, Ch. 7.4"
  - "Corning Cable Systems OSP Splicing Procedures Guide, Rev. 3"
  - "CommScope OSP Termination and Splicing Reference Guide"
---

# Mass-Fusion Splicing: Ribbon Prep, Holder Alignment, and Cycle Times

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the structure of ribbon fiber and explain how matrix removal chemistry differs for UV-cured and thermal-cure ribbon matrices
- Execute the ribbon preparation sequence — strip, clean, cleave, load — in the correct order with correct techniques
- Set holder alignment correctly for 12-fiber and 24-fiber ribbon in both left/right and top/bottom axes
- State the typical per-fiber splice loss range for mass-fusion work and explain why it is higher than single-fiber fusion loss
- Calculate crew cycle time for a high-fiber-count closure using mass-fusion cycle time vs. single-fiber splicing time

---

## Reading Content

### What Is Ribbon Fiber, and Why Does It Exist

Ribbon fiber is a multi-fiber construction in which 12 or 24 individual OS2 SMF (or MMF) fibers are bonded side by side in a flat, parallel array using an ultraviolet-cured or thermally cured acrylate matrix. The ribbon structure serves a single purpose: enabling simultaneous splicing of all fibers in the array with one arc cycle, rather than splicing each fiber individually [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §3.6].

In high-fiber-count OSP cable (144, 288, 432, 864 fibers), ribbon cable is the standard construction because it makes mass-fusion splicing economically viable at scale. A 288-fiber cable contains 24 ribbon units, each 12-fibers wide. A crew splicing each fiber individually with a single-fiber splicer at 3 minutes per fiber would require 288 × 3 = 864 minutes (14.4 hours) to complete a single 288-fiber closure. With a 12-fiber mass-fusion splicer at approximately 8–10 minutes per ribbon (including prep, splice, and sleeve), the same 24 ribbons × 10 minutes = 240 minutes (4 hours). The time savings on large-count closures are not marginal — they are the difference between one-day and multi-day closure work [Fujikura FSM-60R Manual, §1.1; Corning OSP Splicing Guide, §3.6].

### Ribbon Fiber Identification

Before stripping, the technician must correctly identify ribbon polarity and position within the cable. In a standard ribbon cable:

**Fiber color within a ribbon:** Fibers within a 12-fiber ribbon are identified by a 12-color sequence per ANSI/TIA-598-D: Blue (1), Orange (2), Green (3), Brown (4), Slate (5), White (6), Red (7), Black (8), Yellow (9), Violet (10), Rose (11), Aqua (12). The position labeled "fiber 1" on the ribbon is identified by: the ribbon edge nearest the blue fiber, a sequential number printed on the ribbon jacket (on some cable types), or a visible edge marker.

**Ribbon identification within a tube:** In a multi-tube ribbon cable, buffer tubes are color-coded using the same 12-color sequence. Within each tube, ribbons are stacked (Position 1 through N from bottom to top). Ribbon position within the stack may be marked with a printed number or identified by counting from the outermost position.

**Critical requirement:** Fiber mapping must be consistent across both sides of the splice — fiber 1 on the A-side must be connected to fiber 1 on the B-side. Mass-fusion splicers splice the entire ribbon array simultaneously; a reversed ribbon (fiber 12 mated to fiber 1) will produce 12 failed or reversed optical paths [BICSI OSP-DRD Manual, Ch. 7.4; CommScope OSP Splicing Reference, §3.1].

### Ribbon Matrix Removal

The bonding matrix that holds ribbon fibers in their flat array must be removed before the fibers can be individually stripped and cleaved. Two matrix types are encountered in OSP ribbon cable:

**UV-cured acrylate matrix (standard).** The most common ribbon matrix type in current production. UV-cured acrylate has lower adhesion to the individual fiber coatings than thermal-cure types and can typically be removed with standard ribbon strippers (mechanical tools with precision-sized slot jaws matched to 12F or 24F ribbon width). The matrix peels off in sections; the technician strips from the end toward the center, removing 30–40 mm of matrix to expose individual fiber coatings for subsequent individual stripping and cleaning [Fujikura FSM-60R Manual, §3.2; Corning OSP Splicing Guide, §3.6].

**UV-cure rollable ribbon (intermittent bond).** The current dominant ribbon construction in high-fiber-count OSP cable — now standard in most 144F+ trunk cable produced since approximately 2018. Individual fibers are bonded at intervals rather than along the full ribbon length; between bond points, the ribbon can be "rolled" into a round cross-section for tighter tube-fill ratios, enabling higher fiber counts in the same conduit or duct space. At splice points, the ribbon must be fully "unrolled" to its flat form before stripping — a partially unrolled ribbon fed into a ribbon stripper produces uneven tension across the bonded intervals, commonly causing hackle and lip failures that are incorrectly diagnosed as cleaver problems. **For thermal-cure and some rollable ribbon constructions, unbond or unroll the ribbon using the manufacturer-specified thermal or solvent technique before cleaving — do not force a still-bonded rollable ribbon through a mechanical stripper.** Matrix removal follows the standard UV-cured ribbon procedure after the ribbon is fully flat.

**Thermal-cure / low-shrink matrix.** Older ribbon cable and some specialty constructions use a thermally cured resin matrix with higher adhesion to the fiber coatings. Standard mechanical ribbon strippers may not cleanly remove this matrix without risk of fiber damage. **Chemical matrix removal** using a qualified ribbon matrix removal solvent (manufacturer-specified; typically methylene chloride-based solvent or a newer aqueous flux) is required. The ribbon end is soaked in the solvent for 60–90 seconds; the matrix softens and is wiped off with a lint-free wipe. Wear appropriate chemical-resistant gloves and work in ventilated conditions [Corning OSP Splicing Guide, §3.6; CommScope OSP Splicing Reference, §3.2].

After matrix removal, the exposed fiber coating sections (250 µm primary coating on each fiber) are stripped with standard thermal or mechanical fiber strippers in the same procedure as single-fiber work: strip to bare glass (125 µm cladding), clean with IPA on lint-free wipes.

### The Ribbon Preparation Sequence

The complete ribbon preparation sequence, in order, is as follows [Fujikura FSM-60R Manual, §3.1–3.5; BICSI OSP-DRD Manual, Ch. 7.4]:

1. **Strip matrix** — remove the ribbon bonding matrix to expose individual fiber coatings (UV-cure: mechanical stripper; thermal-cure: chemical solvent).
2. **Strip fiber coatings** — remove the 250 µm primary acrylate coating from each fiber in the ribbon using a thermal or mechanical fiber stripper, exposing bare 125 µm cladding.
3. **Clean** — wipe each fiber with IPA on a lint-free wipe; clean from the stripped end toward the coating boundary (never wipe back over the coating onto the bare glass). Allow to dry completely — no solvent residue.
4. **Cleave** — place the cleaned ribbon in the ribbon cleaver's holder with all fibers correctly loaded (fibers 1–12 in correct position order); close the holder; execute the cleave cycle. The ribbon cleaver simultaneously scores and fractures all fibers to produce a flat, co-planar ribbon end-face array.
5. **Load into splicer** — transfer the cleaved ribbon, without touching the bare glass, directly from the cleaver holder to the splicer's ribbon v-groove holder. Do not set down the cleaved ribbon on any surface between the cleaver and the splicer — contamination from a benchtop surface transfers immediately to the bare glass.

**Sequence is mandatory in this order.** Stripping coatings before removing matrix is impossible (the matrix holds the fibers in position for the stripper slot to work). Cleaving before cleaning produces contaminated end-faces. Loading before cleaving is mechanically impossible. Any deviation from sequence produces increased cleave failures, contamination inclusions, or broken fibers [Fujikura FSM-60R Manual, §3.1].

### Holder Alignment: Left/Right and Top/Bottom

Correct holder alignment is the most operator-dependent step in mass-fusion splicing. The splicer's image processor performs PAS-equivalent alignment on all fibers simultaneously, but the mechanical alignment of the ribbon in its holder determines the operating range within which the splicer's motorized stages can correct residual offset [Fujikura FSM-60R Manual, §4.1; Sumitomo Type-71M+ Guide, §3.2].

**Left/right alignment (lateral position):** The ribbon must be centered in the holder so that fiber 1 (edge) is aligned with the holder's reference stop. On 12-fiber ribbon holders for Fujikura FSM-60R/70R/90R series, the holder has a left-edge stop and a right-edge guide; the ribbon is seated against the left-edge stop with the ribbon lying flat in the v-groove channel. If the ribbon is loaded off-center (fiber 1 is 1–2 fiber positions away from the edge stop), the splicer's stage range will be insufficient to correct the offset and the splice will be auto-rejected with a "fiber out of range" error.

**Top/bottom alignment (height position):** The ribbon must lie flat in the v-groove without any fibers lifting out of their groove channels. In a 12-fiber ribbon, the fiber cross-section is approximately 1.75 mm wide × 0.25 mm tall. If the ribbon buckles or any fiber rides up out of its groove, the splicer will detect the height inconsistency and display an alignment error. The ribbon holder's top clamp applies controlled downward pressure to hold the ribbon flat; verify the clamp is fully seated before proceeding.

**Ribbon curl.** Ribbon fiber removed from a tightly wound reel sometimes retains a "curl set" — a natural tendency to curve in one axis. A curled ribbon that is not straightened before loading can spring up in the holder and prevent flat seating. Before loading, lightly roll the ribbon between clean fingertips to break the curl set, or run the ribbon through the straightener fixture if provided with the cleaver [Fujikura FSM-60R Manual, §3.3; Sumitomo Type-71M+ Guide, §3.1].

### Arc Parameters for Ribbon Splicing

Mass-fusion splicers use different arc parameter sets from single-fiber splicers. Key differences [Fujikura FSM-60R Manual, §4.2; Sumitomo Type-71M+ Guide, §3.3]:

**Wider electrode gap.** The arc must span the full ribbon width (approximately 2.0 mm for a 12-fiber ribbon vs. the electrode geometry for a single 125 µm fiber). The electrode spacing is wider to achieve uniform heating across the ribbon, but this also means the arc is less focused and produces a slightly broader heat-affected zone per fiber.

**Higher arc energy (duration and/or current).** More glass mass (12 or 24 fibers simultaneously) requires more total arc energy to bring all fibers to softening temperature in the same arc cycle. The outer fibers of the ribbon (fibers 1 and 12, or 1 and 24) receive slightly different arc energy than the center fibers due to electrode proximity variation — this is the primary reason ribbon splice loss per fiber is typically higher than single-fiber splice loss.

**Temperature gradient effect.** The center fibers of a 12-fiber ribbon are slightly hotter during the arc (closer to the arc center) than the edge fibers. This gradient is managed by the splicer manufacturer's arc profile but cannot be entirely eliminated. Edge fibers (positions 1 and 12 in a 12-fiber ribbon) typically show slightly higher estimated splice loss than center fibers in the same arc cycle — this is normal and expected, not an operator error [Fujikura FSM-60R Manual, §4.2; Sumitomo Type-71M+ Guide, §3.3; BICSI OSP-DRD Manual, Ch. 7.4].

### Splice Loss for Mass-Fusion: Why It's Higher Than Single-Fiber

Mass-fusion splice loss per fiber is typically in the range of **0.05–0.15 dB per fiber** (estimated), compared to **0.02–0.05 dB per fiber** for a well-executed single-fiber PAS splice. Three factors explain this difference [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-60R Manual, §4.3; Corning OSP Splicing Guide, §3.6]:

1. **Geometric alignment tolerance.** The ribbon holder aligns all fibers simultaneously in their v-groove positions. The splicer's PAS imaging covers all fibers, but the per-fiber stage correction is a compromise — the stage moves to minimize average core offset across all 12 fibers, not the optimal position for each individual fiber. Single-fiber splicing allows the stage to optimize for one fiber pair.

2. **Arc uniformity across ribbon width.** The electrode geometry produces more uniform heating for fibers near the arc center than for edge fibers. Single-fiber splicing positions one fiber at the arc center and achieves maximum uniformity.

3. **Ribbon matrix residue.** Even after mechanical or chemical matrix removal and IPA cleaning, trace matrix residue between adjacent fibers is more common in ribbon work than in single-fiber work. Sub-detectable contamination increases scatter loss in the splice zone.

**When the trade-off favors mass-fusion anyway:** Despite higher per-fiber splice loss, mass-fusion is preferred for high-fiber-count (144F+) closures because: (a) cycle time savings are significant (see below); (b) the BICSI ≤0.10 dB acceptance threshold is still achievable for most ribbon splices; (c) ribbon splice loss, while higher per fiber, is still well within the loss budget of standard OSP feeder routes [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §3.6].

### Cycle Times and Crew Productivity

Mass-fusion cycle time per ribbon (12 fibers) on a well-organized crew:

| Task | Approximate time |
|---|---|
| Matrix removal (UV-cure, mechanical stripper) | 45–90 seconds per ribbon end |
| Fiber coating strip (12 fibers, thermal stripper) | 90–120 seconds per ribbon end |
| IPA clean and dry | 30–60 seconds per ribbon end |
| Ribbon cleave | 20–30 seconds per ribbon end |
| Load in splicer + run splice cycle | 60–90 seconds |
| Inspect estimated loss, re-arc if needed | 30–60 seconds |
| Apply ribbon protection sleeve + heat | 60–90 seconds |
| Cooling and load in tray | 45–60 seconds |
| **Total per ribbon (2 ends + 1 splice + 1 sleeve)** | **~8–12 minutes** |

*Sources: [Fujikura FSM-60R Manual, §4.3; Sumitomo Type-71M+ Guide, §3.4; Corning OSP Splicing Guide, §3.6]*

**Comparison: single-fiber splicing of the same fiber count**

For a 12-fiber ribbon = 12 individual single-fiber splices:
- Strip + clean + cleave per fiber: 2–3 minutes
- Load + splice + inspect: 1–2 minutes
- Sleeve + cool + tray: 1 minute
- Total per fiber: ~4–5 minutes
- Total for 12 fibers: **~48–60 minutes**

Mass-fusion completes the same 12 fibers in **8–12 minutes** — a **4–5× cycle time reduction**. On a 288-fiber closure (24 ribbons):

| Method | Approximate total splice time |
|---|---|
| Mass-fusion (12F ribbon) | 24 ribbons × 10 min = **240 min (4 hr)** |
| Single-fiber splicing | 288 fibers × 4.5 min = **1,296 min (21.6 hr)** |

*Sources: [Fujikura FSM-60R Manual, §4.3; BICSI OSP-DRD Manual, Ch. 7.4]*

This comparison illustrates why mass-fusion is not optional on high-fiber-count infrastructure — it is the only economically viable method for completing 288F+ closures within a single work shift.

---

## Key Terms (Flashcard Candidates)

**Ribbon fiber**
A multi-fiber construction in which 12 or 24 individual fibers are bonded side-by-side in a flat array using UV-cured or thermal-cure acrylate matrix. Enables simultaneous mass-fusion splicing of all fibers in one arc cycle. Standard construction for high-fiber-count OSP cable (144F+). [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §3.6]

**Ribbon matrix**
The acrylate bonding material holding ribbon fibers in their flat array. Must be removed before individual fiber stripping and cleaving. Two types: UV-cured (mechanical removal) and thermal-cure (chemical solvent removal). [Fujikura FSM-60R Manual, §3.2; Corning OSP Splicing Guide, §3.6]

**UV-cured ribbon matrix**
The standard ribbon bonding matrix in modern OSP ribbon cable. Removed mechanically with a precision ribbon stripper; does not require chemical solvent. Lower adhesion to individual fiber coatings than thermal-cure matrix. [Fujikura FSM-60R Manual, §3.2]

**Thermal-cure matrix**
A ribbon bonding matrix with higher adhesion to fiber coatings, requiring chemical solvent removal (manufacturer-specified; typically methylene chloride or aqueous flux). Encountered in older ribbon cable and some specialty constructions. Chemical removal requires ventilation and appropriate PPE. [Corning OSP Splicing Guide, §3.6; CommScope OSP Splicing Reference, §3.2]

**Ribbon cleaver**
A precision cleaver with a wide holder slot accommodating 12 or 24 fiber ribbons simultaneously. Executes a single cleave cycle that scores and fractures all fibers in the ribbon to produce a co-planar end-face array. Cleave angle acceptance: ≤1.0° per fiber. [Fujikura FSM-60R Manual, §3.4; BICSI OSP-DRD Manual, Ch. 7.4]

**Holder alignment (mass-fusion)**
The positioning of the ribbon in the splicer's v-groove holder in both the lateral (left/right, fiber 1 at edge stop) and vertical (top/bottom, ribbon lying flat, no fiber lifting out of groove) axes. Mechanical alignment determines whether the splicer's PAS stage correction range can achieve adequate core offset minimization across all fibers. [Fujikura FSM-60R Manual, §4.1; Sumitomo Type-71M+ Guide, §3.2]

**Temperature gradient effect**
The differential arc heating across the ribbon width during a mass-fusion splice — center fibers receive slightly more heat than edge fibers due to electrode proximity variation. Edge fibers (positions 1 and 12 in a 12-fiber ribbon) typically show slightly higher estimated splice loss. Normal and expected; not operator error. [Fujikura FSM-60R Manual, §4.2]

**Ribbon protection sleeve**
A splice protection sleeve for mass-fusion ribbon splices — wider and stiffer than single-fiber sleeves, with a multi-fiber steel or ceramic strength element. Applied in the splicer's heat oven after an accepted splice. Not interchangeable with single-fiber protection sleeves. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §5.2]

**Mass-fusion splice loss**
Typical per-fiber splice loss range for mass-fusion ribbon splicing: **0.05–0.15 dB per fiber** (estimated), compared to 0.02–0.05 dB for single-fiber PAS fusion work. Higher due to arc uniformity variation across ribbon width, geometric alignment trade-off, and trace matrix residue. [BICSI OSP-DRD Manual, Ch. 7.4; Fujikura FSM-60R Manual, §4.3]

**Ribbon polarity**
The fiber-by-fiber mapping relationship between the A-side and B-side of a ribbon splice. Fiber 1 on the A-side must mate with fiber 1 on the B-side; a reversed ribbon produces 12 failed or misrouted optical paths. Verified by ribbon identification (color sequence + edge stop alignment) before loading. [BICSI OSP-DRD Manual, Ch. 7.4; CommScope OSP Splicing Reference, §3.1]

---

## Interactive: Drag-and-Drop — Ribbon Prep Sequence

**Drag-and-drop mechanic:** Six step cards are presented out of order. The learner drags them into the correct sequence. Each card has a title and a one-line description.

**Cards (out of order as presented to learner):**

- **Cleave** — Place the cleaned ribbon in the ribbon cleaver holder in polarity order; execute cleave cycle for co-planar end-face array.
- **Load into splicer** — Transfer the cleaved ribbon directly to the splicer's ribbon v-groove holder without setting it down; verify fiber 1 is at the edge stop.
- **Strip matrix** — Remove the ribbon bonding matrix (mechanical for UV-cure; chemical solvent for thermal-cure) to expose individual fiber coatings over 30–40 mm.
- **Clean** — Wipe each fiber with IPA on a lint-free wipe from stripped end toward coating; allow to dry completely.
- **Strip fiber coatings** — Remove 250 µm acrylate coating from each individual fiber using a thermal or mechanical fiber stripper to expose bare 125 µm cladding.
- **Splice + inspect** — Run the mass-fusion arc cycle; inspect estimated per-fiber loss; apply accept / re-arc / re-splice decision tree.

**Correct sequence:**

1. Strip matrix
2. Strip fiber coatings
3. Clean
4. Cleave
5. Load into splicer
6. Splice + inspect

**Feedback on each position:**
- Strip matrix → Correct. Matrix must come off first; with matrix intact, individual fiber coatings cannot be accessed by the fiber stripper slot.
- Strip fiber coatings → Correct. Individual 250 µm coatings are stripped after matrix removal.
- Clean → Correct. IPA cleaning follows stripping to remove coating debris and any trace contamination before cleaving.
- Cleave → Correct. Cleaving on cleaned bare glass produces the co-planar end-face; cleaving before cleaning produces contaminated end-faces.
- Load into splicer → Correct. Immediate transfer post-cleave minimizes contamination from ambient air and prevents edge chip on cleaved end-faces.
- Splice + inspect → Correct. Arc cycle runs after loading; accept/re-arc/re-splice decision follows estimated loss display.

---

## Multiple-Choice Quiz

---

**Q1.** A field technician is preparing to splice a 288-fiber ribbon cable at a buried splice closure. The cable uses thermal-cure ribbon matrix. Which matrix removal method is appropriate?

- A) Standard mechanical ribbon stripper with precision-sized jaw slot
- B) Chemical solvent soak (manufacturer-specified; typically methylene chloride or aqueous flux) with lint-free wipe **[CORRECT]**
- C) Heat gun application to soften the matrix, then peel off with a fingernail
- D) Ultrasonic cleaner bath — the vibrational energy separates the matrix from the individual fibers

*Rationale:*
- **A — Incorrect.** Standard mechanical ribbon strippers are designed for UV-cured acrylate matrix, which has lower adhesion to fiber coatings. Thermal-cure matrix has higher adhesion; forcing a mechanical stripper on thermal-cure matrix risks fiber damage (broken or cracked 125 µm cladding) or incomplete matrix removal leaving adhesive residue on the coatings. [Corning OSP Splicing Guide, §3.6; CommScope OSP Splicing Reference, §3.2]
- **B — Correct.** Thermal-cure ribbon matrix is removed with a manufacturer-specified chemical solvent — typically methylene chloride-based or newer aqueous flux variants. The ribbon end is soaked for 60–90 seconds; the matrix softens and is wiped off with a lint-free wipe. Chemical-resistant gloves and ventilation are required. [Corning OSP Splicing Guide, §3.6; CommScope OSP Splicing Reference, §3.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** Heat gun application is not a specified matrix removal method for any ribbon type. Uncontrolled heat from a heat gun can damage the fiber coatings, crack the glass, or warp the ribbon geometry. This is not an approved field procedure. [Corning OSP Splicing Guide, §3.6]
- **D — Incorrect.** Ultrasonic cleaners are used in connector end-face cleaning for some laboratory applications, not for ribbon matrix removal in field splicing. No splicer manufacturer or industry standard specifies ultrasonic cleaning for ribbon matrix removal. [Fujikura FSM-60R Manual, §3.2]

---

**Q2.** After loading a 12-fiber ribbon into a mass-fusion splicer, the splicer displays a "FIBER OUT OF RANGE" error and rejects the ribbon before the arc fires. What is the most likely cause?

- A) The ribbon cleave angle exceeded the ≤1.0° acceptance threshold on one or more fibers
- B) The ribbon is not seated correctly in the holder — fiber 1 is not aligned with the holder's edge stop, shifting the ribbon laterally beyond the splicer's stage correction range **[CORRECT]**
- C) The ribbon's matrix was not fully removed, causing the splicer's image processor to fail to detect the fiber cores
- D) The splicer is using a single-fiber splice program instead of the 12-fiber ribbon program

*Rationale:*
- **A — Incorrect.** A cleave angle error would produce a "CLEAVE ERROR" or similar message, not a "FIBER OUT OF RANGE" error. A cleave angle error is detected by the pre-arc inspection of the end-face geometry, not by the stage position system. [Fujikura FSM-60R Manual, §4.1]
- **B — Correct.** A "FIBER OUT OF RANGE" error indicates the splicer's imaging system cannot find the fiber cores within the motorized stage correction range. The most common cause is a laterally misaligned ribbon — fiber 1 not seated against the edge stop — placing some fibers outside the splicer's field of view or beyond the range of the motorized stage correction. Re-seat the ribbon with fiber 1 at the edge stop. [Fujikura FSM-60R Manual, §4.1; Sumitomo Type-71M+ Guide, §3.2]
- **C — Incorrect.** Residual matrix between fibers in the ribbon array would be detected as a contamination issue or elevated estimated loss, not as a "fiber out of range" error. The splicer's image processor detects fiber positions within the v-groove, not matrix presence on the fiber surface. [Fujikura FSM-60R Manual, §4.1]
- **D — Incorrect.** Using a single-fiber program on a ribbon splicer would typically produce an arc mismatch or unsupported program error — the arc geometry of a ribbon splicer is different from a single-fiber splicer and programs are not interchangeable. But the specific "FIBER OUT OF RANGE" error is a stage/alignment issue, not a program selection issue. [Fujikura FSM-60R Manual, §4.2]

---

**Q3.** After splicing a 12-fiber ribbon, the splicer displays per-fiber estimated splice losses. Fibers at positions 1 and 12 (the edge fibers) show 0.10 dB and 0.09 dB respectively; fibers at positions 5–8 (center) show 0.04–0.06 dB. The project specification is ≤0.10 dB. What is the correct interpretation and action?

- A) Accept fibers 5–8; re-arc fibers 1 and 12 — edge fibers showing higher loss than center fibers indicates improper holder seating
- B) Reject the entire ribbon and re-splice — all fibers in a mass-fusion splice must show consistent estimated loss
- C) Accept all 12 fibers — the estimated losses are all within the ≤0.10 dB project threshold; the center-to-edge gradient is expected behavior from the arc temperature profile **[CORRECT]**
- D) Accept fibers at positions 5–8; accept fibers 1 and 12 only if re-arc reduces them below 0.08 dB

*Rationale:*
- **A — Incorrect.** The center-to-edge loss gradient is not caused by improper holder seating — it is caused by the inherent electrode proximity variation in the mass-fusion arc. Re-arcing edge fibers to address a normal, expected arc uniformity gradient is not appropriate; fibers 1 and 12 meet the ≤0.10 dB acceptance threshold. Re-arc is reserved for estimated losses above threshold, not for splices that pass. [Fujikura FSM-60R Manual, §4.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Incorrect.** Mass-fusion splices do not require all fibers to show identical estimated loss. A center-to-edge gradient of 0.04–0.10 dB within a single ribbon is expected and documented behavior of mass-fusion arc uniformity profiles. Rejecting all 12 fibers when all meet the acceptance threshold wastes fiber and time. [Fujikura FSM-60R Manual, §4.2; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Correct.** All 12 fibers are ≤0.10 dB — within the project acceptance threshold. The center-to-edge loss gradient (center fibers: 0.04–0.06 dB; edge fibers: 0.09–0.10 dB) is normal, expected behavior caused by the arc temperature gradient across the ribbon width. Edge fibers are farther from the arc center and receive slightly less uniform heat. This behavior is documented in both Fujikura and Sumitomo ribbon splicer operation manuals. Accept all 12 fibers and apply the ribbon protection sleeve. [Fujikura FSM-60R Manual, §4.2; Sumitomo Type-71M+ Guide, §3.3; BICSI OSP-DRD Manual, Ch. 7.4]
- **D — Incorrect.** There is no 0.08 dB intermediate threshold requirement for edge fibers. The governing specification is ≤0.10 dB; fibers 1 and 12 at 0.09 dB and 0.10 dB meet this threshold. Creating an undocumented sub-threshold from field judgment is not appropriate QA practice. [BICSI OSP-DRD Manual, Ch. 7.4]

---

**Q4.** A crew is completing a 432-fiber ribbon cable closure using 12-fiber mass-fusion splicing. How many ribbon splice cycles are required to complete the closure, and what is the approximate total splice time if the crew averages 10 minutes per ribbon?

- A) 18 ribbon cycles; 180 minutes (3 hours)
- B) 36 ribbon cycles; 360 minutes (6 hours) **[CORRECT]**
- C) 72 ribbon cycles; 720 minutes (12 hours)
- D) 432 ribbon cycles; 4,320 minutes (72 hours)

*Rationale:*
- **A — Incorrect.** 432 ÷ 12 = 36 ribbon cycles, not 18. 18 cycles × 12 fibers = 216 fibers — less than half the 432-fiber total. 18 cycles may be confused with the tube count if the cable has 18 tubes of 24-fiber ribbon; but 24-fiber ribbon requires fewer cycles still (432 ÷ 24 = 18 cycles × 10 min = 180 min — option A may reflect this, but the question specifies 12-fiber mass-fusion). [Fujikura FSM-60R Manual, §4.3; BICSI OSP-DRD Manual, Ch. 7.4]
- **B — Correct.** 432 fibers ÷ 12 fibers per ribbon = **36 ribbon splice cycles**. At 10 minutes per ribbon: 36 × 10 = **360 minutes (6 hours)**. This is the standard calculation for mass-fusion closure planning on a 432-fiber cable using 12-fiber ribbon splicer. [Fujikura FSM-60R Manual, §4.3; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** 72 cycles would imply 72 × 12 = 864 fibers — twice the 432-fiber closure total. This overcounts the splice cycles by 2×. [Fujikura FSM-60R Manual, §4.3]
- **D — Incorrect.** 432 cycles would imply single-fiber splicing (one cycle per fiber), not mass-fusion. The premise of the question is 12-fiber mass-fusion — each cycle splices 12 fibers simultaneously. [Fujikura FSM-60R Manual, §4.3]

---

**Q5.** Which of the following best explains why mass-fusion ribbon splicing produces higher per-fiber splice loss than single-fiber PAS fusion splicing under the same conditions?

- A) Ribbon fiber has a smaller mode field diameter than single-fiber OS2, increasing sensitivity to core offset
- B) The arc temperature gradient across the ribbon width and the geometric alignment compromise for all fibers simultaneously prevents the per-fiber optimization achievable in single-fiber splicing **[CORRECT]**
- C) Ribbon fiber is inherently lower quality than single-fiber OS2 — the matrix bonding process degrades the core geometry during cable manufacturing
- D) Mass-fusion splicers use cladding alignment rather than PAS alignment, explaining the higher core offset per fiber

*Rationale:*
- **A — Incorrect.** Ribbon fiber uses the same OS2 SMF as single-fiber cable — the mode field diameter (approximately 9.2 µm at 1310 nm per ITU-T G.652.D) is identical. The mass-fusion loss difference is not attributable to fiber MFD difference. [ITU-T G.652.D §3.2; Fujikura FSM-60R Manual, §4.3]
- **B — Correct.** Two factors combine: (1) the arc temperature gradient across the ribbon width means edge fibers receive less uniform heat than center fibers, producing slightly more deformation and higher loss at edge positions; (2) the splicer's PAS imaging and stage correction must find a compromise position that minimizes average core offset across all 12 fiber pairs simultaneously — it cannot individually optimize each fiber pair as a single-fiber splicer does. These two constraints together produce the 0.05–0.15 dB typical mass-fusion range vs. 0.02–0.05 dB for single-fiber PAS. [Fujikura FSM-60R Manual, §4.2–4.3; BICSI OSP-DRD Manual, Ch. 7.4]
- **C — Incorrect.** Ribbon fiber's core geometry meets the same ITU-T G.652.D specifications as single-fiber OS2. The matrix bonding process operates at temperatures well below the glass softening point and does not alter core geometry. Ribbon fiber is not inherently inferior in fiber quality. [BICSI OSP-DRD Manual, Ch. 7.4; Corning OSP Splicing Guide, §3.6]
- **D — Incorrect.** Modern mass-fusion splicers (Fujikura FSM-60R/70R/90R; Sumitomo Type-71M+) use profile alignment system (PAS) technology, not cladding alignment. The loss difference is not explained by alignment technology selection — both single-fiber and mass-fusion current-generation splicers use PAS. [Fujikura FSM-60R Manual, §4.1; Sumitomo Type-71M+ Guide, §3.1]

---

## Final Check

Answer these three questions before advancing to Lesson 2.5 (Mechanical Splicing).

**Pulse 1.** State the correct ribbon preparation sequence in order and identify the consequence of reversing steps 2 and 3 (fiber stripping and cleaning).

*Expected answer:* Correct sequence: (1) Strip matrix → (2) Strip fiber coatings → (3) Clean with IPA → (4) Cleave → (5) Load into splicer → (6) Splice + inspect. If steps 2 and 3 are reversed (cleaning before stripping): the IPA cleaning removes contamination from the still-coated fiber surfaces, but the coating-stripping process then re-contaminates the bare glass with coating debris. The fiber would need to be re-cleaned after stripping — making the pre-strip cleaning step irrelevant and requiring an additional cleaning step. The practical risk is that a technician who cleans before stripping may neglect the post-strip cleaning and load a contaminated fiber into the cleaver. [Fujikura FSM-60R Manual, §3.1; BICSI OSP-DRD Manual, Ch. 7.4]

**Pulse 2.** Explain the temperature gradient effect in mass-fusion splicing and identify which fiber positions in a 12-fiber ribbon are most affected.

*Expected answer:* The mass-fusion arc electrodes are positioned to span the full 12-fiber ribbon width, producing an arc that is more intense near the center of the ribbon and slightly less uniform at the edges. Fibers at positions 1 and 12 (the edge positions) receive slightly less heat than fibers at positions 5–8 (the center positions). This differential heating produces slightly more residual stress and slightly higher estimated splice loss at edge positions — a loss gradient of approximately 0.03–0.06 dB center vs. 0.07–0.12 dB edge is typical. This behavior is normal and documented; it is not caused by operator error unless edge losses exceed the project acceptance threshold. [Fujikura FSM-60R Manual, §4.2; Sumitomo Type-71M+ Guide, §3.3; BICSI OSP-DRD Manual, Ch. 7.4]

**Pulse 3.** A 576-fiber ribbon cable closure is being planned. The crew will use 12-fiber mass-fusion splicing and averages 9 minutes per ribbon. How many ribbon cycles are required and what is the estimated total splice time?

*Expected answer:* 576 fibers ÷ 12 fibers per ribbon = **48 ribbon cycles**. 48 cycles × 9 minutes per cycle = **432 minutes (7.2 hours)**. For comparison: 576 fibers at 4.5 minutes per fiber (single-fiber) = 2,592 minutes (43.2 hours) — mass-fusion completes the closure approximately 6× faster. [Fujikura FSM-60R Manual, §4.3; BICSI OSP-DRD Manual, Ch. 7.4]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Ribbon fiber / ribbon matrix** → Lesson 2.7 (Splice Trays — ribbon fiber requires ribbon-specific tray slots with wider radius guides; buffer tube breakout from a ribbon cable to individual tray positions is a different process from loose-tube fiber management)
- **Ribbon polarity** → Lesson 2.12 (Acceptance Testing — fiber identification and polarity verification is a required step in the as-built fiber mapping documentation)
- **Mass-fusion splice loss (0.05–0.15 dB)** → Lesson 2.10 (OTDR Testing — OTDR events at mass-fusion ribbon splices may show higher per-fiber loss than single-fiber splices; bidirectional averaging is especially important for ribbon splice verification because edge-fiber directional asymmetry can be larger)
- **Ribbon protection sleeve** → Lesson 2.7 (Splice Trays — ribbon sleeves occupy wider tray positions than single-fiber sleeves; tray capacity per closure must account for this)
- **Cycle time calculations** → Lesson 2.12 (Acceptance Testing — as-built documentation includes splice log with timestamps; cycle time records support project schedule verification and productivity benchmarking for future closures)
- **Temperature gradient effect** → referenced in Lesson 2.3 back-reference on arc uniformity; forward: Lesson 2.10 (OTDR trace reading — a mass-fusion closure may show multiple adjacent splice events with slightly varying loss; technician should recognize this as ribbon splice behavior, not a separate failure event per fiber)
