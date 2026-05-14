---
title: "Lesson 6: Strand Counts & Buffer-Tube Allocation"
duration_min: 25
topic: cable-selection
order: 6
bicsi_alignment:
  - "OSP-DRD 5.2: Optical cable construction types"
  - "OSP-DRD 5.3: Fiber type selection criteria"
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
sources:
  - "ANSI/TIA-758-C §5.3 and §5.4"
  - "ANSI/TIA-598-D (fiber optic cable color coding)"
  - "ANSI/TIA-568.3-D §6.3 and §6.4"
  - "IEC 60794-1-1 (optical fiber cable — generic specification)"
  - "IEC 60794-3 (optical fiber cables for duct, conduit, and direct-buried installation)"
  - "BICSI OSP-DRD Manual, Ch. 5 §5.3–5.5"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 3"
  - "CommScope Cabling Systems Reference Manual Ch. 5"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §2–3"
---

# Strand Counts & Buffer-Tube Allocation

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Determine the fiber count required for a given OSP route by applying a demand-plus-dark-spare calculation
- Read a cable manufacturer's part number or cross-section diagram and state the tube count, fibers-per-tube, and total fiber capacity
- Apply the ANSI/TIA-598-D color sequence to identify a specific fiber strand by tube color and fiber color within that tube
- Explain how filler tubes, binder groups, and unit stranding affect high-fiber-count cable selection

---

## Reading Content

### Why Strand Count Is a Design Decision

Selecting a cable fiber count is not simply a matter of matching today's circuit demand. A fiber cable is installed once and expected to serve for 20–30 years [BICSI OSP-DRD Manual, Ch. 5.5]. The cost difference between a 24-fiber cable and a 48-fiber cable on the same route is small compared to the cost of opening a trench, pulling conduit, or erecting aerial strand a second time. Every OSP strand-count decision must therefore balance three competing factors: present circuit demand, growth headroom (dark fiber reserve), and cable diameter constraints in shared conduit or bundle attachments.

ANSI/TIA-758-C §5.5 recommends specifying no less than **twice the active fiber count** as total installed fiber on any new OSP route, with additional headroom for repair loops (slack coils at splice points) that consume fiber budget. In practice, experienced OSP designers frequently specify 3–4× the currently activated count, particularly on feeder routes serving aggregation nodes where bandwidth demand compounds rapidly [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1].

### Buffer Tube Architecture: The Building Block

Standard OSP loose-tube cable organizes fibers into discrete **buffer tubes** stranded helically around a central strength member. Each buffer tube is a thermoplastic cylinder typically 2.5–3.0 mm in outer diameter, housing a fixed number of fibers — most commonly 12 fibers per tube, though 6-fiber, 24-fiber, and ribbon-loaded (12-ribbon) tubes are also produced [IEC 60794-3, §4.1; Corning OSP Reference, §3.3].

The fundamental relationship is:

```
Total fiber count = tubes × fibers per tube
```

A standard 12-tube / 12-fiber-per-tube cable carries 144 fibers. A 6-tube / 12-fiber-per-tube cable carries 72 fibers. High-fiber-count designs stack additional tubes or use ribbon-loaded tubes that pack 12 ribbons of 12 fibers each (144 fibers per tube) into a cable that remains under 1.25 inches in outer diameter [ANSI/TIA-758-C §5.4; Corning OSP Reference, §3.3].

**Central strength member (CSM):**

At the geometric center of the cable is the CSM — a dielectric glass-reinforced plastic (GRP) rod in all-dielectric designs, or a steel wire in armored designs. The CSM provides the cable with anti-buckling resistance during pulling operations and acts as the attachment point for the cable grips and swivels used during conduit installation. It carries no fiber and contributes no signal-carrying capacity; it exists entirely to protect the tubes stranded around it [IEC 60794-3, §4.1].

**Tube stranding and lay length:**

Buffer tubes are stranded helically around the CSM with a controlled **lay length** — the linear distance in which one tube completes one full revolution around the CSM axis. A controlled lay length serves two functions: it accommodates thermal expansion and contraction along the cable axis without stressing fibers (the helical path shortens and lengthens in response to axial strain), and it distributes bending stress among all tubes equally rather than concentrating it on a single tube when the cable curves [ANSI/TIA-758-C §5.3; IEC 60794-3, §4.2].

### Color Coding: ANSI/TIA-598-D

Unambiguous fiber identification at the splice tray or patch panel is critical for operations. With 144 or 432 fibers in a cable, visual identification requires a systematic color sequence applied consistently throughout the OSP industry. ANSI/TIA-598-D establishes the standard 12-color sequence used for both buffer tube colors and fiber colors within each tube [ANSI/TIA-598-D, §4].

**Standard 12-color sequence (in order):**

| Position | Color |
|---|---|
| 1 | Blue |
| 2 | Orange |
| 3 | Green |
| 4 | Brown |
| 5 | Slate |
| 6 | White |
| 7 | Red |
| 8 | Black |
| 9 | Yellow |
| 10 | Violet |
| 11 | Rose |
| 12 | Aqua |

*Source: [ANSI/TIA-598-D, Table 2]*

The same sequence applies at two levels: **tube identification** (the tube color identifies its position in the cable cross-section) and **fiber identification** (the fiber buffer color identifies its position within its tube). A fiber identified as "tube 4, fiber 9" is in the brown buffer tube, and it carries a yellow-colored buffer within that tube.

**Identifying a fiber in the field:** Tube color + fiber color form a two-part address that uniquely identifies any fiber in a cable with up to 144 fibers (12 tubes × 12 fibers). This address is the basis for splice maps, as-built records, and OTDR trace labeling [BICSI OSP-DRD Manual, Ch. 5.3; AFL OSP Cable Design Guide, §3.1].

### Cables With More Than 144 Fibers

The 12-tube × 12-fiber matrix accommodates up to 144 fibers without any ambiguity in the two-part color address. Beyond 144 fibers, the color sequence must be extended. ANSI/TIA-598-D addresses this through two mechanisms:

**Color rings (binders):** For cables with more than 12 tubes, tubes are grouped into **binder groups** of 12. Each binder group is wrapped with a colored binder yarn or stripe that identifies the group. A cable with 24 tubes would have two binder groups (tubes 1–12 and tubes 13–24), each identifiable by its binder color. The complete fiber address becomes: binder group color + tube color + fiber color [ANSI/TIA-598-D, §5].

**Unit stranding:** High-fiber-count cables (288, 432, 864 fibers and above) frequently use a **unit** or **super-unit** stranding architecture. Multiple tube bundles — each carrying 72 or 144 fibers — are stranded around the CSM and wrapped with color-coded binder tapes. This allows the cable's fiber count to scale into the hundreds and thousands while preserving an unambiguous color-coded identification scheme throughout [Corning OSP Reference, §3.4; CommScope Reference Manual, Ch. 5.3].

### Filler Tubes: Maintaining Geometry

When a cable is designed for a maximum fiber count (e.g., 12 tubes) but ordered at a lower initial count (e.g., 72 fibers = 6 active tubes), the remaining tube positions are occupied by **filler tubes** — solid or hollow thermoplastic rods of the same outer diameter as buffer tubes. Filler tubes perform no optical function; they maintain the cable's round cross-section and prevent the outer sheath from collapsing into vacant tube positions during installation, which would induce microbend stress on the active fibers [AFL OSP Cable Design Guide, §2.3; IEC 60794-3, §4.1].

Filler tubes are a normal and expected feature of cable designs. On installation records, they should be documented as "filler" and excluded from fiber-count totals. The presence of filler tubes does not indicate a defective cable — it indicates a cable designed with reserve capacity for future fiber activation.

### Strand Count Rules of Thumb

| Route type | Minimum design multiple | Rationale |
|---|---|---|
| Feeder (backbone, central office to aggregation node) | 4× active count | Feeder replacement is extremely costly; bandwidth compounding is rapid |
| Distribution (node to FDT or closure) | 3× active count | Moderate replacement cost; branching topology multiplies risk |
| Drop (FDT to premise) | 2× active count | Short route, single-customer impact, lower replacement cost |
| Express (long-haul between exchanges) | 6× active count | Replacement nearly impossible without service disruption; shared by many services |

*Source: [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]*

Repair loop slack (minimum 10 meters per splice location, per ANSI/TIA-758-C §6.4) consumes fiber budget and is often overlooked in initial count calculations. On a feeder route with 10 splice locations, minimum slack alone consumes 100 meters of cable, equivalent to the fiber in a 100-meter section at every count.

---

## Key Terms (Flashcard Candidates)

**Buffer tube**
Hollow thermoplastic cylinder, typically 2.5–3.0 mm OD, housing 6, 12, or 24 fibers (or 12 ribbon stacks) inside a loose-tube OSP cable. The tube inner diameter is substantially larger than the fiber diameter, creating a slip fit that mechanically decouples fiber from external cable stress. [IEC 60794-3, §4.1]

**Central strength member (CSM)**
The axial structural element at the cable core — a dielectric GRP rod in all-dielectric cables or a steel wire in armored designs — that provides anti-buckling resistance during installation and prevents cable kinking under pulling tension. Carries no fiber. [IEC 60794-3, §4.1]

**Lay length**
The linear distance along the cable axis in which one buffer tube completes one full helical revolution around the CSM. Controlled lay length accommodates axial thermal expansion without stressing fibers and distributes bending stress uniformly among all tubes. [IEC 60794-3, §4.2; ANSI/TIA-758-C §5.3]

**ANSI/TIA-598-D color sequence**
The 12-position standard color code (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua) applied to buffer tube jackets and fiber buffers within each tube. Enables unambiguous two-part fiber addressing (tube color + fiber color) for cables up to 144 fibers. [ANSI/TIA-598-D, Table 2]

**Binder group**
A subset of buffer tubes wrapped with a colored binder yarn to extend the TIA-598-D color address beyond 12 tubes. Each binder group contains up to 12 tubes; the binder color identifies the group number, and tube color identifies position within the group. [ANSI/TIA-598-D, §5]

**Filler tube**
A solid or hollow thermoplastic rod placed in a buffer tube position that carries no fiber. Maintains cable geometry and prevents sheath collapse into vacant tube slots when a cable is ordered at less than maximum fiber count. Not an optical or signal-carrying element. [IEC 60794-3, §4.1; AFL OSP Cable Design Guide, §2.3]

**Fibers per tube (FPT)**
The number of individual fiber strands housed in a single buffer tube. Standard configurations: 6, 12, or 24 FPT for stranded fiber; 12 ribbons × 12 fibers = 144 FPT for ribbon-loaded tubes. FPT × tube count = total fiber count. [ANSI/TIA-758-C §5.4]

**Dark fiber**
Installed fiber strands that carry no active signal — available as reserve capacity for future circuit activation or as immediate repair paths. Industry practice recommends dark-fiber reserves of at least 2× the active count on feeder routes. [BICSI OSP-DRD Manual, Ch. 5.5]

**Unit stranding**
High-fiber-count cable architecture where multiple buffer tube bundles (each a complete 12-tube / 144-fiber group) are assembled around the CSM and wrapped with color-coded binder tapes. Scales fiber count to 288, 432, 864, and beyond while maintaining an unambiguous identification system. [Corning OSP Reference, §3.4]

**Repair loop slack**
The reserved cable length coiled at each splice closure to accommodate future re-splicing after damage or re-routing. ANSI/TIA-758-C §6.4 requires a minimum of 10 meters of slack at each splice location; the slack is coiled on a closure-mounted storage spool. [ANSI/TIA-758-C §6.4]

---

## Interactive: Drag-and-Drop — Decode the Cable Cross-Section

**[image:buffer-tube-allocation-diagram.svg]**

*Image description for SVG illustrator:*

A circular cable cross-section diagram, rendered from the outside inward:

- Outermost ring: outer PE sheath (grey)
- Next ring inward: optional armor layer (corrugated hatching), labeled "CST armor (where specified)"
- Helically arranged circles (buffer tubes), 12 positions around the central strength member. Each tube circle is filled with one of the 12 TIA-598-D colors (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua) and labeled with its position number (1–12)
- Inside each buffer tube circle: 12 small dots representing individual fibers, also arranged in a ring and color-coded per TIA-598-D sequence
- Center circle: the CSM (grey rod), labeled "Central Strength Member (GRP)"
- Below the cross-section: a "Fiber Address" decoder showing two dropdown selectors — "Tube Color" and "Fiber Color" — that together produce a fiber position (e.g., "Brown tube / Yellow fiber = Tube 4, Fiber 9")

Label targets for the drag-and-drop activity:
1. Outer PE sheath → position on outermost ring
2. CST armor → position on armor ring
3. Buffer tube (blue) → position on tube #1 circle
4. Buffer tube (aqua) → position on tube #12 circle
5. Individual fiber (blue) → position on fiber #1 within any tube
6. Central Strength Member → center circle
7. Filler tube → one tube position shown as solid (unfilled) cylinder, to be labeled

**Drag-and-drop mechanic:** Learner drags 7 label cards to correct diagram regions. Correct placement highlights green; incorrect highlights red with a one-sentence rationale.

---

## Multiple-Choice Quiz

---

**Q1.** An OSP engineer is specifying a feeder cable between a central office and a remote fiber distribution hub serving 18 active circuits today. Applying the BICSI OSP-DRD recommended design multiple for feeder routes, what is the minimum total fiber count the cable should carry?

- A) 18 fibers — match present demand exactly
- B) 36 fibers — 2× active count **[WRONG]**
- C) 72 fibers — 4× active count **[CORRECT]**
- D) 144 fibers — default to the maximum standard tube count

*Rationale:*
- **A — Incorrect.** Specifying only the active count leaves zero headroom for growth, repair loops, or circuit additions. BICSI OSP-DRD Manual Ch. 5.5 explicitly warns against specifying feeder cable at active-circuit parity — the replacement cost of a feeder route makes zero headroom economically indefensible. [BICSI OSP-DRD Manual, Ch. 5.5]
- **B — Incorrect.** 2× active count is the minimum design multiple recommended for drop (premise) routes, where single-customer impact and short route length make replacement more feasible. Feeder routes serve aggregation nodes where bandwidth demand compounds across many downstream customers — BICSI recommends 4× for feeder. [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]
- **C — Correct.** 18 active circuits × 4 = 72 fibers. BICSI OSP-DRD Manual Ch. 5.5 and AFL OSP Cable Design Guide §2.1 both recommend a minimum of 4× the active fiber count on feeder routes. The additional dark fiber costs a fraction of a future trench-and-replace operation. A 72-fiber cable (6-tube / 12-FPT) is a standard catalog configuration. [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]
- **D — Incorrect.** Defaulting to 144 fibers (12-tube / 12-FPT maximum standard) without a demand calculation is not a design methodology — it is a guess. While 144 fibers may ultimately be the right answer on a high-growth feeder, specifying it for 18 active circuits requires a documented growth justification, not automatic selection of maximum capacity. [ANSI/TIA-758-C §5.5]

---

**Q2.** A splice technician is working on a 12-tube OSP cable and needs to locate fiber 9 in tube 7. Using the ANSI/TIA-598-D color sequence, what colors should the technician look for?

- A) Tube: Violet / Fiber: Red
- B) Tube: Red / Fiber: Yellow **[CORRECT]**
- C) Tube: Yellow / Fiber: Red
- D) Tube: Red / Fiber: Violet

*Rationale:*
- **A — Incorrect.** Position 10 in the TIA-598-D sequence is Violet (not position 7). Position 9 in the sequence is Yellow (not Red). Neither color matches the tube-7 / fiber-9 address. [ANSI/TIA-598-D, Table 2]
- **B — Correct.** The TIA-598-D color sequence is: 1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, **7-Red**, 8-Black, **9-Yellow**, 10-Violet, 11-Rose, 12-Aqua. Tube 7 = Red; Fiber 9 = Yellow. The target fiber has a Red buffer tube with a Yellow-buffered fiber inside it. [ANSI/TIA-598-D, Table 2]
- **C — Incorrect.** Tube 7 = Red and Fiber 9 = Yellow per TIA-598-D. Option C reverses the tube and fiber colors. Yellow is position 9 in the sequence, which is the fiber color — not the tube color in this case. [ANSI/TIA-598-D, Table 2]
- **D — Incorrect.** Tube 7 = Red (correct), but Fiber 9 = Yellow, not Violet. Violet is position 10 in the sequence — it would be fiber 10 within tube 7, not fiber 9. [ANSI/TIA-598-D, Table 2]

---

**Q3.** During an as-built survey, a technician opens a 144-fiber cable cross-section and counts 12 tube positions but only 6 tubes that contain fiber. The other 6 positions contain solid rods with no visible fiber. What are these rods, and do they indicate a cable defect?

- A) They are damaged buffer tubes that lost their fibers during installation — the cable is defective
- B) They are filler tubes; this is normal and expected for a cable designed at maximum capacity but ordered at half capacity **[CORRECT]**
- C) They are dielectric armor rods — the cable was designed for direct burial but the wrong version was installed
- D) They are CSM segments that migrated from the center — the cable's strength member has failed

*Rationale:*
- **A — Incorrect.** Buffer tubes do not lose fibers in normal installation — fibers are housed in gel or dry water-blocking compound inside the tube and do not migrate out. Solid rods are not damaged tubes; they are a deliberate design feature. [AFL OSP Cable Design Guide, §2.3]
- **B — Correct.** Filler tubes are thermoplastic rods placed in buffer tube positions where no fiber is required in the current build-out. They maintain the cable's round cross-section and prevent the sheath from collapsing into the vacant positions, which would induce microbend stress on the active fiber tubes. A 12-tube cable ordered with 6 active tubes and 6 fillers is a standard product, not a defect. The as-built record should document the filler positions. [IEC 60794-3, §4.1; AFL OSP Cable Design Guide, §2.3]
- **C — Incorrect.** Dielectric armor is fiberglass tape or woven wrap applied at the cable sheath level — it wraps around the entire tube assembly and does not appear as individual rods in the buffer-tube ring positions. [ANSI/TIA-758-C §5.6.2]
- **D — Incorrect.** The CSM is a single element at the geometric center of the cable — it does not fragment or migrate into the tube-ring positions. The presence of solid rods in tube positions has a completely different, benign explanation. [IEC 60794-3, §4.1]

---

**Q4.** A cable manufacturer's data sheet shows: "288F / 24T / 12F per tube / unit stranding." How many binder groups does this cable have, and how many fibers per binder group?

- A) 1 binder group / 288 fibers per group
- B) 2 binder groups / 144 fibers per group **[CORRECT]**
- C) 4 binder groups / 72 fibers per group
- D) 24 binder groups / 12 fibers per group

*Rationale:*
- **A — Incorrect.** A single binder group would imply all 24 tubes are in one group — the TIA-598-D color sequence only distinguishes 12 positions. With 24 tubes in one group, tube colors would repeat, making identification ambiguous. [ANSI/TIA-598-D, §5]
- **B — Correct.** 24 tubes ÷ 12 tubes per binder group = **2 binder groups**. Each binder group contains 12 tubes × 12 fibers per tube = **144 fibers**. The two groups are distinguished by binder yarn color, and within each group, tube and fiber colors follow the standard TIA-598-D 12-position sequence. A complete fiber address in this cable is: Binder group color + Tube color + Fiber color. [ANSI/TIA-598-D, §5; Corning OSP Reference, §3.4]
- **C — Incorrect.** 4 binder groups of 6 tubes each would be a non-standard grouping inconsistent with the TIA-598-D 12-position color sequence, which is designed around 12-tube groups. The standard groups 12 tubes per binder. [ANSI/TIA-598-D, §5]
- **D — Incorrect.** 24 binder groups of 1 tube each is not how binder grouping works — the entire purpose of a binder is to identify a bundle of multiple tubes. Individual tubes are already identified by their own color; a binder group of one tube provides no additional identification value and is not a standard cable architecture. [ANSI/TIA-598-D, §5]

---

**Q5.** An OSP route has 10 splice locations and the engineer is calculating total fiber budget. What minimum slack length does ANSI/TIA-758-C require at each splice location, and what is the total slack consumption across this route?

- A) 5 meters per splice / 50 meters total
- B) 10 meters per splice / 100 meters total **[CORRECT]**
- C) 15 meters per splice / 150 meters total
- D) No minimum is specified — slack is left to installer discretion

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C §6.4 specifies a minimum of 10 meters of slack at each splice location, not 5 meters. Five meters is insufficient for the re-splicing operations that may be required after cable damage — re-splicing requires trimming back damaged fiber and re-entering the splice tray, which consumes fiber length from the slack coil. [ANSI/TIA-758-C §6.4]
- **B — Correct.** ANSI/TIA-758-C §6.4 requires a minimum of **10 meters** of cable slack coiled at each splice closure. Over 10 splice locations, this consumes a minimum of **100 meters** of cable length in slack coils alone — equivalent to the full fiber count in a 100-meter cable section. Strand count calculations must account for this slack consumption, which is often omitted in preliminary designs. [ANSI/TIA-758-C §6.4]
- **C — Incorrect.** 15 meters per splice is more than the ANSI/TIA-758-C minimum, which is 10 meters. While installing additional slack is not a code violation, the minimum specified is 10 meters. [ANSI/TIA-758-C §6.4]
- **D — Incorrect.** ANSI/TIA-758-C §6.4 establishes a specific minimum slack requirement. Leaving slack amount to installer discretion would result in inconsistent practices, with some closures installed with insufficient slack to support future re-splicing. The 10-meter minimum is a design and installation requirement, not a suggestion. [ANSI/TIA-758-C §6.4]

---

**Q6.** A 432-fiber OSP feeder cable uses 36 buffer tubes arranged in three binder groups of 12 tubes each. A splice map indicates the target fiber is in "Binder 2 / Tube Aqua / Fiber Green." What is the absolute fiber number in the cable?

- A) Fiber 135
- B) Fiber 267
- C) Fiber 279 **[CORRECT]**
- D) Fiber 291

*Rationale:*

Full derivation from ANSI/TIA-598-D Table 2 color positions and binder group addressing rules:

- **Aqua = position 12** in the TIA-598-D sequence (blue/orange/green/brown/slate/white/red/black/yellow/violet/rose/**aqua**).
- **Green = position 3** in the TIA-598-D sequence.
- Each binder group = 12 tubes × 12 fibers per tube = **144 fibers**.
- **Binder 1** covers absolute fibers 1–144.
- **Binder 2** starts at absolute fiber 145.
- Within Binder 2, Tube Aqua is tube position 12. Tubes 1–11 account for 11 × 12 = 132 fibers ahead of it.
- Fiber Green is fiber position 3 within Tube Aqua.
- **Absolute fiber number = 144 (Binder 1 offset) + 132 (tubes 1–11 of Binder 2) + 3 (Fiber Green) = 279.**

[ANSI/TIA-598-D, Table 2; ANSI/TIA-598-D, §5; BICSI OSP-DRD Manual, Ch. 5.3]

- **A — Incorrect.** 135 results from calculating the relative position within Binder 2 only — (12−1)×12 + 3 = 135 — without adding the Binder 1 offset of 144 fibers. The question asks for the **absolute** fiber number in the full 432-fiber cable, which requires adding all preceding fibers. [ANSI/TIA-598-D, §5]
- **B — Incorrect.** 267 results from miscounting Binder 1 as 132 fibers (11×12) instead of the correct 144 fibers (12×12), then adding the correct intra-binder offset: 132 + 132 + 3 = 267. Binder 1 contains all 12 tubes × 12 fibers = 144 fibers, not 11 tubes' worth. [ANSI/TIA-598-D, §5]
- **C — Correct.** 144 + (11×12) + 3 = 144 + 132 + 3 = **279**. Binder 1 contributes 144 fibers; tubes 1–11 of Binder 2 contribute 132 fibers; Fiber Green (position 3) in Tube Aqua (position 12) is the 3rd fiber in that tube. [ANSI/TIA-598-D, Table 2; ANSI/TIA-598-D, §5; BICSI OSP-DRD Manual, Ch. 5.3]
- **D — Incorrect.** 291 results from using 12×12 = 144 as the tube offset within Binder 2 instead of 11×12 = 132. The offset for Tube Aqua (position 12) is the count of the 11 **preceding** tubes, not all 12 tubes in the group: 144 + 144 + 3 = 291 overcounts by one tube's worth (12 fibers). [ANSI/TIA-598-D, §5]

---

## Final Check

Answer before proceeding to Lesson 7 (Sheath Options & Fire Ratings).

**Pulse 1.** State the ANSI/TIA-598-D colors for tube 5 and fiber 11 in a standard 12-tube / 12-fiber-per-tube OSP cable.

*Expected answer:* Tube 5 = **Slate** (position 5 in the TIA-598-D sequence). Fiber 11 = **Rose** (position 11). The complete fiber address is: Slate tube / Rose fiber. [ANSI/TIA-598-D, Table 2]

**Pulse 2.** A route requires a 288-fiber feeder cable. The cable has 24 buffer tubes with 12 fibers each. How many binder groups are required, and what does a complete fiber address look like for this cable?

*Expected answer:* 24 tubes ÷ 12 tubes per binder group = **2 binder groups**. A complete fiber address requires three components: Binder group color (identifies which group of 12 tubes) + Tube color (identifies which of the 12 tubes in that group) + Fiber color (identifies which of the 12 fibers in that tube). Example: "Blue binder / Orange tube / Green fiber" uniquely addresses one fiber in the cable. [ANSI/TIA-598-D, §5]

**Pulse 3.** Why do OSP designers specify 3–4× the current active fiber count on feeder routes rather than simply matching demand?

*Expected answer:* Three reasons: (1) **Replacement cost** — a feeder route between a central office and an aggregation node may require trenching, conduit pulling, and aerial strand — costs orders of magnitude higher than the cable itself. Installing spare fibers now costs nearly nothing relative to future trench-and-replace. (2) **Compounding bandwidth demand** — feeder routes carry aggregated traffic from many downstream customers; bandwidth demand compounds rapidly and unpredictably. (3) **Repair loops** — ANSI/TIA-758-C §6.4 requires 10 meters of slack at each splice point; on a multi-splice feeder, this slack consumes substantial fiber budget. Dark fiber reserves absorb repair and re-routing needs without service impact. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5 and §6.4]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Buffer tube / FPT (fibers per tube)** → Lesson 2 (cable construction — loose-tube design), Lesson 7 (sheath options — tube count affects cable OD and sheath wall thickness), Lesson 10 (cable selection by environment — high-FPT ribbon tube cables for high-density feeder routes)
- **ANSI/TIA-598-D color sequence** → Lesson 3 (ribbon cable — ribbon fiber color ID uses same 12-color base sequence), Lesson 2 (loose-tube construction — tube color-coding first introduced)
- **Binder group / unit stranding** → Lesson 10 (environment-driven cable selection — high-fiber-count unit-stranded cables for backbone feeder applications)
- **Filler tube** → Lesson 7 (sheath options — cable OD with filler tubes is the same as at full fiber count; sheath sizing assumes full tube count)
- **Dark fiber / repair loop slack** → Lesson 10 (cable selection by environment — demand calculations), Lesson 12 (compliance checklist — as-built documentation must record dark fiber positions and splice-point slack lengths)
- **Central Strength Member (CSM)** → Lesson 7 (sheath options — CSM material choice interacts with armor type), Lesson 4 (armored variants — steel CSM vs. GRP CSM in armored designs)
