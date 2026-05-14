---
title: "Lesson 2: Cable Construction Basics — Loose-Tube vs Tight-Buffer"
duration_min: 25
topic: cable-selection
order: 2
bicsi_alignment:
  - "OSP-DRD 5.2: Optical cable construction types"
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
sources:
  - "ANSI/TIA-568.3-D §6.4"
  - "ANSI/TIA-758-C §5.3 and §5.4"
  - "ANSI/TIA-472AAAB (loose-tube OSP fiber spec)"
  - "IEC 60794-1-1 (optical fiber cable — generic specification)"
  - "IEC 60794-3 (optical fiber cables for duct, conduit, and direct-buried installation)"
  - "BICSI OSP-DRD Manual, Ch. 5 §5.3 and Ch. 6 §6.2"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 3"
  - "CommScope Cabling Systems Reference Manual Ch. 5"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4"
---

# Cable Construction Basics — Loose-Tube vs Tight-Buffer

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Describe the structural components of loose-tube and tight-buffer cable designs and explain the function of each layer
- Select the appropriate construction type for a given OSP deployment environment (direct-bury, conduit, aerial, indoor riser)
- Interpret a cable cross-section label and identify fiber count, tube count, buffer diameter, and sheath material
- Explain how water-blocking methods differ between loose-tube and tight-buffer designs and their relevance to OSP moisture management

---

## Reading Content

### The Cable as a System

An optical fiber cable is not simply glass wrapped in plastic. It is an engineered mechanical system that must protect hair-thin glass strands — each roughly the diameter of a human hair — through decades of outdoor exposure including burial forces, frost heave, flooding, rodent attack, and UV degradation. Two fundamental construction philosophies have emerged to solve this protection problem: **loose-tube** and **tight-buffer**. Understanding which design is appropriate for a given environment is one of the foundational cable-selection decisions in OSP engineering.

Both designs share the same outer architecture: a central strength member, one or more fiber-carrying elements, filler elements to maintain geometry, optional armor, and a sheath. What differs is the relationship between the glass fiber and the buffer material that immediately surrounds it.

### Loose-Tube Construction

In loose-tube cable, individual fibers (or ribbons of fibers) are housed inside **buffer tubes** — hollow thermoplastic cylinders typically 2.5 to 3.0 mm in outer diameter. The fiber has significantly more room inside the tube than it occupies: the tube inner diameter is substantially larger than the 250 µm fiber, leaving an **air gap** or gel fill space around the fiber [Corning OSP Reference, §3.1].

This gap is the design's key engineering feature. When the cable is subjected to external mechanical stress — tension, compression, bending — the cable assembly deforms before the fiber does. The fiber is free to move slightly within the tube, avoiding the stress entirely. This mechanical decoupling is why loose-tube construction dominates OSP applications: it provides superior protection against the forces of direct burial, conduit pulling, and thermal expansion/contraction [BICSI OSP-DRD Manual, Ch. 5.3].

**Buffer tube fill — gel vs. dry water-blocking:**

- **Gel-filled tubes:** The interior of each buffer tube is flooded with a thixotropic filling compound (often called flooding compound or tube gel). The gel blocks liquid water migration along the fiber axis — critical for OSP installations where the cable end may be submerged or exposed to hydrostatic pressure. Gel-filled cables are the historical standard for OSP, particularly direct-bury and conduit installations in wet environments. Disadvantage: gel creates significant cleanup time at splicing — technicians must clean each fiber with lint-free wipes and solvent before cleaving. [Corning OSP Reference, §3.2]
- **Dry water-blocking tubes:** Newer designs replace gel with water-swellable yarn or powder inside the tube. When exposed to moisture, the swellable material expands, blocking water migration without the cleanup burden of gel. ANSI/TIA-758-C §5.3.2 accepts both gel-filled and dry water-blocking designs for OSP applications. Dry cables are increasingly preferred on new installations for splicing efficiency, while gel remains prevalent in existing plant. [ANSI/TIA-758-C §5.3.2; AFL OSP Cable Design Guide, §2.4]

**Tube count and fiber capacity:**

Standard OSP loose-tube cables organize buffer tubes around a **central strength member (CSM)** — typically a dielectric glass-reinforced plastic (GRP) rod or, in armored designs, a steel central wire [IEC 60794-3, §4.1]. Tubes are stranded helically around the CSM with a controlled lay length that accommodates thermal expansion and contraction without stressing the fibers.

Common configurations:
- 6-tube cable: 6 buffer tubes × 12 fibers/tube = 72 fibers standard
- 12-tube cable: 12 tubes × 12 fibers/tube = 144 fibers (with filler tubes to maintain round geometry below full capacity)
- High-density: up to 432 fibers in a standard 1.0–1.25 inch OD sheath using 12-fiber or 24-fiber ribbonized tubes [ANSI/TIA-758-C §5.4; Corning OSP Reference, §3.3]

Buffer tubes are color-coded per ANSI/TIA-598-D for identification. In a 12-tube cable, the tube color sequence follows the standard TIA fiber color code (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua). Fiber strands within each tube are similarly color-coded, enabling individual fiber identification through the combination of tube color + fiber color [ANSI/TIA-598-D, Table 2].

### Tight-Buffer Construction

In tight-buffer cable, each fiber is coated with a **secondary buffer material** — typically a proprietary thermoplastic — applied directly over the 250 µm primary coating, building the fiber up to a standardized **900 µm outer diameter** [ANSI/TIA-568.3-D §6.4.2]. There is no air gap or gel fill space between the glass and the buffer: the buffer is in direct mechanical contact with the fiber.

This intimate contact is both the design's strength and its limitation. Because the buffer is bonded to the fiber, it provides:

- **Individual fiber protection** — each strand can be handled, routed, and terminated without a buffer tube enclosing it. Tight-buffer cable can be broken out to individual connectorized fibers at the cable end without a breakout kit or furcation hardware.
- **Direct connectorization** — standard SC, LC, and ST connectors are designed for 900 µm tight-buffer fiber. The connector's crimp barrel grips the 900 µm buffer directly, providing strain relief. Loose-tube fiber at 250 µm requires a furcation kit or fan-out tube to reach 900 µm before connectorization. [CommScope Reference Manual, Ch. 5.2]

The trade-off is mechanical sensitivity. Because the buffer is in contact with the fiber, external stresses applied to the cable transmit more directly to the glass. Tight-buffer cables are consequently:

- **Not appropriate for direct burial or long conduit pulls** — burial forces and conduit friction transmit stress directly to fibers [BICSI OSP-DRD Manual, Ch. 5.3.3]
- **Sensitive to thermal expansion** — temperature swings cause the buffer compound to expand/contract; in long outdoor runs, this induces microbend stress at buffer/fiber interfaces, increasing attenuation
- **Not gel-filled** — tight-buffer cables have no gel fill by design; water blocking (if any) is provided by the sheath and an overall water-swellable wrap, not at the individual fiber level [ANSI/TIA-568.3-D §6.4.2]

Tight-buffer construction is the correct choice for **indoor riser and plenum applications**, **premises cabling**, and short outdoor-to-indoor transition segments where direct connectorization without breakout hardware is operationally important. ANSI/TIA-568.3-D §6.4 specifies tight-buffer construction for premises optical fiber cable; ANSI/TIA-758-C §5.2 specifies loose-tube construction for OSP distribution and feeder cable.

### Breakout Cable: Tight-Buffer with Strength Members

Breakout cable (also called fanout cable) is a variant of tight-buffer design where each 900 µm tight-buffer fiber is individually surrounded by its own sub-unit jacket and strength fiber package (typically aramid yarn). The result is a cable that contains multiple individually-jacketed sub-units bundled inside an outer jacket — resembling a cluster of small cables inside one larger cable [AFL OSP Cable Design Guide, §3.1].

Breakout cable directly connectorizes at each sub-unit without breakout hardware. It is heavy, expensive per fiber, and appropriate for:
- Equipment room patch runs where each fiber terminates at a separate piece of active equipment
- Short indoor riser segments serving a small fiber count (2–12 fibers)
- Installations where installation-time labor savings from eliminating breakout hardware offset the higher cable cost

Breakout cable is never specified for OSP routes. Its weight, cost per fiber, and mechanical sensitivity preclude outdoor use [BICSI OSP-DRD Manual, Ch. 5.3.4].

### Selecting Between Designs: Decision Framework

| Criterion | Loose-Tube | Tight-Buffer | Breakout |
|---|---|---|---|
| OSP backbone / feeder | **Required** [ANSI/TIA-758-C §5.2] | Not permitted | Not permitted |
| Direct bury | **Required** | Not appropriate | Not appropriate |
| Conduit pull (long haul) | **Required** | Not appropriate | Not appropriate |
| Aerial (lashed or ADSS) | **Required** | Not appropriate | Not appropriate |
| Indoor riser (OFNR) | Not typical | **Standard** [ANSI/TIA-568.3-D §6.4] | Acceptable |
| Indoor plenum (OFNP) | Not typical | **Standard** | Acceptable |
| OSP-to-indoor transition | Loose-tube to transition point | Tight-buffer from transition point | — |
| Direct connectorization at cable end | Requires furcation kit | **Native 900 µm** | **Native per sub-unit** |
| Splicing at splice closure | **Standard practice** | Requires 250→900 µm note | Rarely spliced |

**The OSP-to-indoor transition** is a common design challenge. A direct-bury or conduit-routed loose-tube cable entering a building typically terminates at an optical distribution frame (ODF) or splice enclosure at the building entry point. From there, indoor cable (tight-buffer) takes over. Attempting to run a gel-filled loose-tube cable through a building's riser risers violates NEC Article 770 requirements for indoor optical fiber cable flame ratings — OSP sheath materials are not typically rated for indoor use unless specifically marked OFNR or OFNP [NEC Article 770.49; ANSI/TIA-758-C §1.2]. See Lesson 6 for sheath rating details.

---

## Key Terms (Flashcard Candidates)

**Loose-tube construction**
OSP cable design in which fibers are housed inside hollow buffer tubes significantly larger than the fiber diameter, allowing the fiber to move freely within the tube under mechanical stress. Gel-filled or dry water-blocking. Standard for direct-bury, conduit, and aerial OSP routes. [ANSI/TIA-758-C §5.3]

**Tight-buffer construction**
Premises cable design in which a secondary buffer material is applied directly over the 250 µm fiber coating, building it to 900 µm OD. No air gap; fiber and buffer move together under stress. Standard for indoor riser and plenum cabling; not appropriate for OSP use. [ANSI/TIA-568.3-D §6.4]

**Buffer tube**
The hollow thermoplastic cylinder in loose-tube cable that houses one or more fibers (or ribbons). Typically 2.5–3.0 mm OD. Color-coded per ANSI/TIA-598-D for tube identification. [IEC 60794-3, §4.1]

**Central strength member (CSM)**
The structural backbone of a loose-tube cable — typically a dielectric glass-reinforced plastic (GRP) rod or steel wire — around which buffer tubes are stranded. Provides tensile and compressive load-bearing capacity. [IEC 60794-3, §4.1]

**Flooding compound / tube gel**
Thixotropic filling compound occupying the free space inside loose-tube buffer tubes. Blocks water migration along the fiber axis in wet OSP environments. Requires solvent cleaning before splicing. [Corning OSP Reference, §3.2]

**Dry water-blocking**
Alternative to gel fill: water-swellable yarn or powder inside buffer tubes that expands on contact with moisture. Accepted by ANSI/TIA-758-C §5.3.2; eliminates gel cleanup at splice points. [AFL OSP Cable Design Guide, §2.4]

**Breakout cable (fanout cable)**
Tight-buffer variant in which each 900 µm fiber is individually enclosed in a sub-unit jacket with aramid strength members. Enables direct connectorization per sub-unit. Not appropriate for OSP routes due to weight, cost, and mechanical sensitivity. [AFL OSP Cable Design Guide, §3.1]

**Furcation kit (fan-out kit)**
Hardware assembly that transitions a loose-tube cable's 250 µm bare fibers to individual 900 µm tubes, enabling connectorization. Required at the cable termination end when using loose-tube cable. Eliminates the need for breakout cable in OSP applications. [CommScope Reference Manual, Ch. 5.3]

**Aramid yarn (Kevlar)**
High-tensile-strength synthetic fiber used as a strength member in tight-buffer and breakout cables. Encases the buffered fiber and is captured by the connector crimp barrel, providing strain relief. [ANSI/TIA-568.3-D §6.4.2]

**Water-swellable tape / yarn**
An outer sheath or sub-sheath component in both loose-tube and tight-buffer OSP designs that expands radially when wetted, blocking longitudinal water migration through the interstices between buffer tubes. [ANSI/TIA-758-C §5.3.3]

---

## Interactive: Drag-and-Drop — Label the Cross-Section

**[image:loose-tube-vs-tight-buffer-cross-section.svg]**

*Image description for SVG illustrator:*

Two side-by-side cable cross-section diagrams, drawn to consistent scale.

**Left diagram — Loose-Tube OSP Cable (12-fiber, 6-tube, gel-filled):**
- Outermost ring (black/grey): PE sheath — label: **Polyethylene (PE) sheath**
- Next ring inward (grey hatched): armor layer (corrugated steel tape or dielectric) — label: **Armor layer (optional)**
- Next element: water-swellable tape wrap — label: **Water-swellable tape**
- 6 colored circles arranged around the central member, each ~3 mm OD: buffer tubes, color-coded — label: **Buffer tubes (6× color-coded)**
- Fill material between tubes: flooding compound fill — label: **Flooding compound**
- Central element (solid rod): central strength member — label: **Central strength member (GRP)**
- Inside one buffer tube (zoomed inset): 2 fibers floating in gel — label: **Fibers in gel (250 µm each)**

**Right diagram — Tight-Buffer Indoor Cable (6-fiber):**
- Outermost ring (orange): outer jacket (PVC or LSZH) — label: **Outer jacket (PVC/LSZH)**
- Inner bundling element: ripcord and inner sheath wrap — label: **Ripcord**
- 6 circles (tight-buffer fiber), each ~900 µm: buffered fibers, color-coded — label: **Tight-buffer fibers (900 µm each)**
- Each fiber surrounded by aramid yarn strands (dotted halo): — label: **Aramid strength yarn**
- Small central element (GRP or steel): central member — label: **Central member**

**Label cards (drag targets):**
Left diagram: PE sheath, Armor layer, Water-swellable tape, Buffer tubes, Flooding compound, Central strength member (GRP), Fibers in gel (250 µm)
Right diagram: Outer jacket, Ripcord, Tight-buffer fibers (900 µm), Aramid strength yarn, Central member

---

## Multiple-Choice Quiz

---

**Q1.** Which cable construction type is specified by ANSI/TIA-758-C for OSP feeder and distribution cable?

- A) Tight-buffer, 900 µm per fiber
- B) Breakout cable with individual sub-unit jackets
- C) Loose-tube with gel-filled or dry water-blocking buffer tubes **[CORRECT]**
- D) Tight-buffer with overall water-swellable sheath wrap

*Rationale:*
- **A — Incorrect.** Tight-buffer construction is specified for premises (indoor) cabling under ANSI/TIA-568.3-D §6.4. Its mechanical sensitivity to burial and conduit-pull forces and its lack of tube-level water blocking make it unsuitable for OSP routes. [ANSI/TIA-568.3-D §6.4; ANSI/TIA-758-C §5.2]
- **B — Incorrect.** Breakout cable is a subtype of tight-buffer design intended for short indoor runs requiring direct connectorization per sub-unit. It is not appropriate for OSP routes. [AFL OSP Cable Design Guide, §3.1]
- **C — Correct.** ANSI/TIA-758-C §5.3 specifies loose-tube construction for OSP fiber optic cable, with gel-filled or dry water-blocking buffer tubes acceptable. The standard requires that OSP cable provide mechanical protection from burial forces and moisture ingress at the tube level — requirements that loose-tube construction is specifically engineered to meet. [ANSI/TIA-758-C §5.2, §5.3]
- **D — Incorrect.** An overall water-swellable sheath wrap is a component of both loose-tube and tight-buffer OSP-rated cable designs, but it is not the defining construction characteristic. Tight-buffer with a water-swellable wrap is still tight-buffer — it still lacks tube-level water blocking and mechanical decoupling. [ANSI/TIA-758-C §5.3.3]

---

**Q2.** A technician opens a splice closure on a direct-bury OSP cable and finds individual fibers coated with thick gel. What does this indicate, and what is the required preparation step before cleaving?

- A) The cable is tight-buffer; no special preparation is needed
- B) The cable is gel-filled loose-tube; fibers must be cleaned with lint-free wipes and isopropyl solvent before cleaving **[CORRECT]**
- C) The cable is armored; the gel is a corrosion inhibitor, not a water block
- D) The cable is a breakout design; sub-unit jackets must be removed first

*Rationale:*
- **A — Incorrect.** Tight-buffer cables do not use gel fill. The buffer material is a solid thermoplastic compound bonded directly to the fiber. Gel is the identifier of a loose-tube gel-filled design. [Corning OSP Reference, §3.1]
- **B — Correct.** Gel-filled loose-tube cable floods the buffer tube interior with thixotropic filling compound. Before a fiber can be cleaved, all gel must be removed from the fiber surface. Residual gel causes cleave failures (gel on the cleave blade), elevated splice loss (contamination at the fiber end face), and splicer chuck contamination. Standard practice: wipe the fiber from buffer tube to cleave point with a lint-free wipe wetted with 99% isopropyl alcohol, making two to three strokes toward the cleave point and never reversing. [Corning OSP Reference, §3.2; BICSI OSP-DRD Manual, Ch. 7.2]
- **C — Incorrect.** Armor corrosion protection is provided by the armor material itself (corrugated steel tape is often coated) and by the flooding compound between the armor and sheath — not by gel inside the buffer tubes. Gel inside tubes is exclusively a water-blocking measure. [IEC 60794-3, §4.2]
- **D — Incorrect.** Breakout cable sub-units have individual jackets — they do not contain gel. Breakout cables rarely appear in OSP direct-bury applications. [AFL OSP Cable Design Guide, §3.1]

---

**Q3.** What is the standard outer diameter of a tight-buffer fiber, and why is this dimension important for connectorization?

- A) 250 µm; this matches the primary coating diameter and fits standard LC ferrule bores
- B) 900 µm; this diameter is required for standard SC, LC, and ST connector crimp barrels **[CORRECT]**
- C) 125 µm; this is the cladding diameter, which fits all connector ferrule types
- D) 3.0 mm; this matches the buffer tube OD in loose-tube cable

*Rationale:*
- **A — Incorrect.** 250 µm is the primary buffer coating diameter — the immediate coating applied at fiber draw. This is the bare fiber diameter inside a loose-tube buffer tube. Standard connector crimp barrels are designed for 900 µm; a 250 µm fiber must be fitted with a furcation tube before connectorization. [ANSI/TIA-568.3-D §6.4.2]
- **B — Correct.** Tight-buffer construction builds the 250 µm coated fiber up to **900 µm OD** with a secondary thermoplastic coating. Standard SC, LC, ST, and FC connectors use a crimp barrel that grips the 900 µm buffer for strain relief; the fiber's aramid yarn (surrounding the 900 µm buffer in premises cable) is captured under the crimp sleeve. This dimensional standardization allows direct connectorization without furcation hardware. [ANSI/TIA-568.3-D §6.4.2; CommScope Reference Manual, Ch. 5.2]
- **C — Incorrect.** 125 µm is the cladding outer diameter — common to all fiber types (SMF and MMF). The cladding is bare glass; no connector can grip it directly without causing breakage. This dimension is relevant to fusion splicing (core/cladding alignment), not to connectorization. [ITU-T G.652.D §3.1]
- **D — Incorrect.** 3.0 mm is an approximate outer diameter for a loose-tube buffer tube — the tube that houses the fibers in OSP loose-tube cable. This is not a fiber dimension. [IEC 60794-3, §4.1]

---

**Q4.** A fiber count of 144 is needed for a direct-bury route between two fiber distribution hubs (FDH) 2.3 km apart. Which cable configuration is most appropriate?

- A) 144-fiber tight-buffer breakout cable, direct-buried
- B) 12-tube loose-tube cable, 12 fibers per tube, gel-filled, rated for direct burial **[CORRECT]**
- C) 144-fiber tight-buffer cable with PE sheath, direct-buried
- D) 72-fiber loose-tube cable, 6 tubes × 12 fibers, with a second cable in the same trench

*Rationale:*
- **A — Incorrect.** Breakout cable is a tight-buffer design. Direct burial of tight-buffer or breakout cable is not appropriate — burial forces transmit mechanical stress directly to fibers, and the design lacks tube-level water blocking required for wet soil environments. [BICSI OSP-DRD Manual, Ch. 5.3.3; ANSI/TIA-758-C §5.2]
- **B — Correct.** A 12-tube loose-tube cable at 12 fibers per tube yields 144 fibers in a single cable rated for direct burial. The loose-tube design provides mechanical decoupling from burial forces and frost heave; gel fill blocks groundwater migration along the tube; the PE outer sheath provides UV and soil-chemical resistance. This is the standard OSP design for this application per ANSI/TIA-758-C §5.3. [ANSI/TIA-758-C §5.3; Corning OSP Reference, §3.3]
- **C — Incorrect.** Tight-buffer cable with a PE sheath is not a standard product category and would not provide tube-level water blocking or mechanical decoupling. The buffer construction type, not the sheath material, is the determinative factor for burial suitability. [ANSI/TIA-758-C §5.2]
- **D — Incorrect.** Two cables in the same trench doubles material and installation cost (two cable pulls, two cable ends to manage at each termination point) with no technical advantage. A single 144-fiber loose-tube cable achieves the same fiber count in one pull, one splice enclosure, and one trench. The 144-fiber single-cable option is technically and economically superior. [BICSI OSP-DRD Manual, Ch. 6.2]

---

**Q5.** An OSP cable enters a building through a conduit stub-up and terminates at an ODF in the building entry room. The remaining fiber runs from the ODF to a telecom closet on the fourth floor. What construction types are appropriate for each segment?

- A) Loose-tube for both segments
- B) Loose-tube from conduit entry to ODF; tight-buffer OFNR-rated from ODF to fourth floor **[CORRECT]**
- C) Tight-buffer from conduit entry to ODF; loose-tube from ODF to fourth floor
- D) Breakout cable for both segments

*Rationale:*
- **A — Incorrect.** Loose-tube cable with OSP sheath is not rated for indoor riser installations. NEC Article 770.49 prohibits non-OFNR/OFNP cable from building riser spaces except in conduit. An unrated OSP-sheathed loose-tube cable in a riser void poses a fire spread hazard. [NEC Article 770.49; ANSI/TIA-758-C §1.2]
- **B — Correct.** The OSP segment (conduit to building entry ODF) uses loose-tube construction per ANSI/TIA-758-C §5.2 — mechanical protection, water blocking, and OSP sheath materials are required here. The segment from ODF to the fourth-floor closet is an indoor riser run and requires OFNR-rated tight-buffer cable per ANSI/TIA-568.3-D §6.4 and NEC Article 770.49. The ODF serves as the physical and code transition point between construction types. [ANSI/TIA-758-C §5.2; NEC Article 770.49; ANSI/TIA-568.3-D §6.4]
- **C — Incorrect.** Tight-buffer cable from the conduit entry to the ODF would expose tight-buffer construction to the burial/conduit environment at the building entry, where water intrusion and pulling forces make loose-tube mandatory. And a loose-tube cable run up a riser violates NEC indoor fire rating requirements. [ANSI/TIA-758-C §5.2; NEC Article 770.49]
- **D — Incorrect.** Breakout cable is inappropriate for either segment. It is not rated for OSP environments and, while it can carry indoor fire ratings (OFNR, OFNP), its cost per fiber is significantly higher than tight-buffer for a riser run where direct per-fiber connectorization is not the design requirement. [AFL OSP Cable Design Guide, §3.1]

---

**Q6.** In a 12-tube loose-tube cable filled to capacity at 12 fibers per tube, how would a technician identify the third fiber in the seventh buffer tube?

- A) Count tubes from the center outward; fiber color coding is not standardized
- B) Tube 7 is red (per TIA-598-D 12-tube color sequence); fiber 3 within that tube is green **[CORRECT]**
- C) Tube 7 is violet; fiber 3 is green
- D) Buffer tube identification uses alphanumeric labeling, not color coding

*Rationale:*
- **A — Incorrect.** ANSI/TIA-598-D establishes a standardized color sequence for both buffer tubes and individual fibers. Counting from center outward is not a standard identification method; tubes are identified by color in the stranded sequence. [ANSI/TIA-598-D, Table 2]
- **B — Correct.** The ANSI/TIA-598-D 12-position color sequence is: 1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, 7-Red, 8-Black, 9-Yellow, 10-Violet, 11-Rose, 12-Aqua. Buffer tube 7 is **red**. The fiber color sequence within each tube follows the same standard: fiber 1-Blue, 2-Orange, 3-Green. Fiber 3 within the red tube is **green**. Designation: Red tube / Green fiber. [ANSI/TIA-598-D, Table 1 and Table 2]
- **C — Incorrect.** Violet is position 10 in the TIA-598-D sequence, not position 7. Position 7 is red. The fiber color (green for position 3) is correct in this option, but the tube color is wrong, making the identification incorrect. [ANSI/TIA-598-D, Table 2]
- **D — Incorrect.** While some high-fiber-count cables use printed alphanumeric markings on buffer tubes as a supplement, the primary standardized identification method for loose-tube cable is the ANSI/TIA-598-D color-code system. Alphanumeric markings are supplementary, not the primary identification mechanism. [ANSI/TIA-598-D, §4]

---

## Final Check

Answer before proceeding to Lesson 3 (Ribbon Cable & Mass-Fusion Splicing).

**Pulse 1.** Name the two functions of the gel filling inside a loose-tube buffer tube and describe how "dry water-blocking" achieves the same result.

*Expected answer:* Gel fill serves as (1) a **longitudinal water block** — the compound's thixotropic viscosity prevents liquid water from migrating along the fiber axis inside the tube; and (2) a **cushioning medium** — the gel fills the free space around the fiber, preventing the fiber from contacting the tube wall under vibration or bending, further decoupling the fiber from mechanical forces. Dry water-blocking achieves the longitudinal water-block function via water-swellable yarn or powder that expands radially when wetted, physically sealing the tube interior. The cushioning function is partially provided by the swellable material before activation. [Corning OSP Reference, §3.2; AFL OSP Cable Design Guide, §2.4; ANSI/TIA-758-C §5.3.2]

**Pulse 2.** Explain why a tight-buffer cable cannot be direct-buried without causing long-term performance degradation.

*Expected answer:* In tight-buffer construction, the secondary buffer material is in direct mechanical contact with the glass fiber. Burial forces — soil compaction, frost heave, road traffic vibration, groundwater hydraulic pressure — are transmitted through the cable sheath and directly into the buffer compound, which in turn stresses the fiber. Over time this induces **microbend losses** (attenuation increases from microscopic deformations in the fiber path) and, in severe cases, fiber fracture. Additionally, tight-buffer cables lack tube-level water blocking; moisture that penetrates the sheath reaches fibers directly, causing hydrogen darkening and hydroxyl absorption at the 1383 nm water peak over years of exposure. Loose-tube construction prevents both mechanisms. [BICSI OSP-DRD Manual, Ch. 5.3.3; ANSI/TIA-758-C §5.2]

**Pulse 3.** What NEC article governs indoor optical fiber cable, and what is the consequence of installing an OSP-sheathed loose-tube cable in a building riser without conduit?

*Expected answer:* NEC Article 770 governs optical fiber cable installation in buildings. Article 770.49 specifies the required flame rating for each space type: riser spaces require OFNR (Optical Fiber Nonconductive Riser) or higher-rated cable. An OSP-sheathed cable is not tested or listed to OFNR or OFNP flame spread criteria; if installed in a riser space without enclosure in conduit, it violates the code because the cable sheath can propagate flame vertically between floors in a fire event. The Authority Having Jurisdiction (AHJ) would require remediation. [NEC Article 770.49; ANSI/TIA-758-C §1.2]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Loose-tube construction** → foundational term for Lesson 3 (ribbon fiber, which travels inside loose-tube ribbon cable), Lesson 4 (armored variants), Lesson 5 (microduct — uses a variant of loose-tube technology)
- **Tight-buffer construction** → forward reference to Lesson 6 (sheath options — indoor flame ratings apply to tight-buffer designs) and Lesson 8 (drop vs. distribution vs. feeder — tight-buffer is the terminal distribution architecture)
- **Buffer tube color coding** → Lesson 3 (ribbon cable uses a modified color-code system for ribbons within a tube)
- **Flooding compound / gel** → Lesson 3 (ribbon cable tubes: same gel fill; same cleanup requirement before mass-fusion splicing)
- **NEC Article 770** → Lesson 6 (sheath rating compliance — OFNR, OFNP, OFNG designations)
- **Furcation kit** → Lesson 9 (connector selection — MPO/MTP breakout assemblies are a specialized furcation product)
- **Central strength member** → Lesson 4 (armored cable — CSM is retained; armor adds a second load path)
- **Water-swellable tape** → Lesson 4 (armored aerial and direct-bury variants use both water-swellable tape and armor for redundant protection)
