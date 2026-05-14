---
title: "Lesson 11: Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI"
duration_min: 25
topic: cable-selection
order: 11
bicsi_alignment:
  - "OSP-DRD 5.6: Compliance requirements for outside plant cabling"
  - "OSP-DRD 6.3: Regulatory and standards compliance for OSP installations"
  - "OSP-DRD 7.1: Documentation and as-built records"
sources:
  - "ANSI/TIA-758-C §3, §5.2, §6.1–6.5, and §7"
  - "NESC (National Electrical Safety Code) C2-2023, Rules 230, 232, 250–251, 352, 354"
  - "NEC (NFPA 70) Article 770, Article 800 (for copper reference)"
  - "ANSI/TIA-526-7 (OTDR testing for multimode fiber plant)"
  - "ANSI/TIA-568.3-D §11 (field testing of optical fiber cabling)"
  - "BICSI OSP-DRD Manual, Ch. 5–8"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 7"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §6"
  - "IEEE 1222 (all-dielectric self-supporting aerial fiber optic cable)"
---

# Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the four primary regulatory and standards bodies governing OSP fiber optic installations and describe the specific scope of each
- Apply NESC bonding and grounding requirements to metallic-armored cable installations at splice closures, building entries, and aerial attachment points
- Cite the applicable NEC Article 770 fire-rating requirements for optical fiber cable in riser, plenum, and general indoor spaces
- Apply ANSI/TIA-758-C labeling, documentation, and testing requirements to a completed OSP installation
- Identify the BICSI OSP-DRD documentation deliverables required at project closeout

---

## Reading Content

### The Compliance Landscape

Four regulatory and standards bodies govern OSP fiber optic installations in the United States. Each has a distinct scope and legal standing; they complement rather than duplicate each other. Compliance with all four is required for a code-compliant, insurable, and professionally defensible installation.

| Body | Primary document | Scope |
|---|---|---|
| NESC | C2-2023 National Electrical Safety Code | Safety of electrical supply and communication lines on public property; aerial clearances; underground installation safety; worker protection |
| NEC (NFPA 70) | National Electrical Code, current edition | Electrical safety inside buildings; fire ratings for indoor cable; Article 770 specific to optical fiber |
| ANSI/TIA | ANSI/TIA-758-C | Engineering standards for OSP telecommunications infrastructure; cable specifications, installation limits, documentation, testing |
| BICSI | OSP-DRD Manual | Best-practice design guidelines; exam-body reference for BICSI OSP Design credentials; supplements ANSI/TIA-758-C with design methodology |

NESC and NEC are safety codes enforced by authorities having jurisdiction (AHJ) — local building departments, utility commissions, OSHA. ANSI/TIA-758-C and BICSI OSP-DRD are standards and guidelines; compliance is required by contracts, utility regulations, and RUS loan conditions (which typically cite TIA-758-C specifically).

### NESC: Aerial Clearances and Grounding

The National Electrical Safety Code governs all work on public rights-of-way, utility pole lines, and utility-owned underground infrastructure. Its primary fiber-relevant provisions:

**NESC Rule 230 — Loading of aerial conductors:**
All aerial cable and messenger wire must be designed to survive the ice, wind, and combined ice-plus-wind loads of the applicable NESC loading district (light, medium, heavy, or extreme wind). ADSS cable must be rated by the manufacturer for span length, sag, and tension within the district's design parameters [NESC C2-2023, Rule 230].

**NESC Rule 232 — Clearances of wires from ground and other objects:**
Establishes minimum sag-to-clearance margins at maximum ice load for aerial cable crossing roads, railways, navigable waterways, and other circuits. At road crossings, the cable must clear the road surface by at least **18 feet (5.5 m)** in the heavy loading district; lesser clearances apply in lighter districts and for non-traffic crossings [NESC C2-2023, Rule 232]. Engineering design must verify sag calculations meet these minimums — specifying ADSS cable for a long span without verifying clearance at maximum ice load is a design error.

**NESC Rules 250 and 251 — Overhead line design:**
Specify load cases (light: 0.00 in. ice + 9 psf wind; medium: 0.25 in. ice + 4 psf wind; heavy: 0.50 in. ice + 4 psf wind) and safety factors for conductor and hardware strength. All messenger wire, ADSS cable, and attachment hardware must comply [NESC C2-2023, Rules 250–251].

**NESC Rules 352 and 354 — Underground installations:**
Rule 354 applies to underground optical fiber cable: it requires adequate mechanical protection (conduit, burial depth), appropriate markings, and bonding of metallic elements. Rule 352 requires that metallic cable armor be grounded at intervals not exceeding **3 miles (4.8 km)** for cables of general construction, and at every splice closure and building entry for practical field installations [NESC C2-2023, Rules 352, 354].

**NESC bonding and grounding requirements for metallic armor:**
Any cable with metallic armor (CST or wire armor) must be bonded to a ground electrode at:
1. Each splice closure
2. Each building entry point (BET or conduit entry)
3. Each aerial-to-underground transition (riser base)
4. Cable ends where accessible

The bonding conductor must be a minimum of **6 AWG copper** (or equivalent) run to a ground rod meeting the resistance-to-ground requirement of the local utility or AHJ [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]. Failure to bond metallic armor creates shock hazard for splicing crews and a lightning-discharge path through the splice closure to the fiber — the most common cause of lightning-induced cable plant damage.

Fully dielectric cable (ADSS, dielectric-armored cable, flat all-dielectric drop) requires **no bonding or grounding** — there is no metallic conductor to ground. This is a significant operational advantage on routes with high lightning exposure [ANSI/TIA-758-C §5.6.2; IEEE 1222].

### NEC Article 770 — Optical Fiber Cables in Buildings

NEC Article 770 governs the installation of optical fiber cable inside buildings. Its fire-rating hierarchy is the most testable provision for OSP designers, because every OSP-to-building transition requires compliance with Article 770.

**NEC 770.113 — Listing requirements:**
Optical fiber cable used inside buildings must be listed for the space in which it is installed. OSP-rated (outdoor PE jacket) cable is **not listed** for indoor use and cannot substitute for a listed indoor cable except for the first 50 feet from the point of building entry [NEC Article 770.113].

**NEC 770.113 — 50-foot interior limit:**
OSP cable may penetrate a building and extend a maximum of **50 feet (15 m)** inside the structure, measured from the point of entry (exterior wall penetration). Beyond 50 feet, a listed indoor cable (OFNR or OFNP) must continue to the termination point. The transition from OSP to indoor cable is typically made at a Building Entry Terminal (BET) [NEC Article 770.113].

**NEC 770 fire-rating hierarchy (OSP to most restrictive):**

| Designation | Space permitted | Governing test | Substitute for |
|---|---|---|---|
| OSP / outdoor | Outside buildings, ≤ 50 ft inside | — | — |
| OFN / OFNG (general) | General horizontal runs, not riser/plenum | UL 1581 VW-1 | Lower ratings |
| OFNR (riser) | Vertical runs in riser shafts | UL 1666 riser | OFN/OFNG |
| OFNP (plenum) | Air-handling plenum spaces | UL 910 plenum | All lower ratings |

*Source: [NEC Article 770.113; ANSI/TIA-758-C §5.2]*

The substitution rule: a higher-listed cable may always substitute for a lower-listed requirement. OFNP is the universal substitute — it may be installed anywhere OFNR or OFN is required. OFNR may not substitute for OFNP in plenum spaces.

**Conduit exception:** A non-listed cable (including OSP cable) may be installed in a metallic conduit or intermediate metallic conduit (IMC) inside a building without the 50-foot limit, *if* the conduit is continuous from the point of entry to the point of termination and is listed for the space type. This is the raceway exception under NEC 770.113(A)(1). It is less common in practice because metallic conduit adds cost; the BET-to-OFNR approach is more economical for most building entries [NEC Article 770.113(A)(1)].

### ANSI/TIA-758-C — Cable Specifications, Installation, and Documentation

ANSI/TIA-758-C is the primary engineering standard for OSP telecommunications infrastructure. Its compliance provisions span cable specification, installation limits, testing, and documentation.

**Section 5 — Cable specifications by environment:**
Covered in Lessons 4, 7, 8, and 10. Key specification cite points for compliance purposes:
- §5.2: OS2 SMF required for all OSP backbone and feeder cable
- §5.3: Loose-tube construction with gel-fill or dry water-block for all OSP environments
- §5.6: CST armor required for direct-bury cable in native soil
- §5.6.2: Dielectric armor option for installations near electrical infrastructure
- §5.6.3: ADSS specifications for aerial on energized lines
- §5.7: Drop cable specifications by installation method

**Section 6 — Installation limits:**
- §6.2: RTL (rated tensile load) and RSL (rated sidewall load) limits for conduit installation
- §6.3: Minimum burial depths by crossing type (24 in. general soil, 36 in. under roads)
- §6.4: Minimum slack loop at each splice closure: **10 meters (33 feet)**; cable end slack at FDH/FDT: **minimum 3 meters**

**Section 7 — Documentation requirements:**
ANSI/TIA-758-C §7 requires that every completed OSP installation deliver an as-built documentation package including [ANSI/TIA-758-C §7]:
1. **Route drawings:** GPS-referenced or survey-referenced maps showing cable centerline, all splice closure locations, all FDH/FDT locations, conduit runs, buried cable, and aerial attachment points
2. **Burial depth records:** Depth measurements at minimum every 500 feet (152 m) on direct-bury routes, plus at every road crossing, to confirm compliance with §6.3 minimums
3. **Splice loss records:** OTDR test results for each fiber through each splice closure, documenting splice loss in dB
4. **Cable reel records:** Cable reel number, manufacturer, fiber count, and length for each reel installed
5. **Bonding and grounding records:** Location, ground rod depth, and measured resistance-to-ground at each grounding point for metallic-armor installations

**Section 6.5 — Cable identification and labeling:**
ANSI/TIA-758-C §6.5 requires that all OSP cables be identified at each splice closure, BET, FDH, FDT, and building entry with a durable marker tag or cable label stating at minimum: cable type, fiber count, installation date, and the cable owner's identifier. Splice closures must bear a label identifying the incoming and outgoing cable IDs and the splice closure contents (splice count, tray configuration) [ANSI/TIA-758-C §6.5].

### BICSI OSP-DRD — Design Documentation Requirements

BICSI OSP-DRD Manual Chapter 8 establishes the design deliverable set for a completed OSP project. These deliverables go beyond the as-built documentation required by TIA-758-C §7 to include design-phase documentation that must be completed before construction begins.

**Pre-construction design deliverables (BICSI OSP-DRD Ch. 8):**
1. **Route survey report:** Field survey results documenting right-of-way, existing utilities, crossing locations, soil type, frost line depth, and documented hazards (rock ledge, high-groundwater areas, areas of known rodent activity)
2. **Cable schedule:** Complete specification for each cable segment — cable type, fiber count, construction, reel size, installation method
3. **Fiber assignment table:** Which fibers in which cable segments are assigned to which circuits (active) vs. reserved as dark fiber (future)
4. **Optical power budget calculation:** Per IEEE 802.3 or applicable transceiver specification, documenting that the total link loss (fiber attenuation + splice losses + connector losses + bend losses) is within the transceiver's loss budget for every active circuit
5. **Splice closure placement plan:** Location, type (inline vs. branch), and splice count for each closure; linked to the route drawing

**Testing requirements at project closeout (BICSI OSP-DRD Ch. 7; ANSI/TIA-526-7):**
- **OTDR trace:** Each fiber in each cable segment, tested from both ends, at a minimum of two wavelengths (1310 nm and 1550 nm for OS2 feeder and distribution cable). OTDR traces must document each splice event, reflective event, and the end-of-fiber reflection
- **Optical loss test (OLTS / insertion loss):** Each installed link, tested per ANSI/TIA-568.3-D §11 using a calibrated light source and power meter. Pass/fail criterion: total link insertion loss ≤ calculated loss budget
- **Visual fault locator (VFL) inspection:** Each splice closure opened and each connector inspected for physical damage or contamination before final documentation

**OTDR wavelength requirements for OS2 OSP cable:**
ANSI/TIA-526-7 and BICSI OSP-DRD Manual specify that OS2 OSP fiber should be tested at both **1310 nm and 1550 nm** [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]. The 1310 nm trace identifies splice loss, connector loss, and macro-bend events efficiently (higher OTDR sensitivity at 1310 nm for some OTDRs). The 1550 nm trace is more sensitive to macro-bend loss events — bend losses are higher at longer wavelengths, making the 1550 nm trace the definitive test for bend-induced loss in direct-bury and conduit routes [BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.1].

### The Compliance Checklist: Nine Items for Project Closeout

The following checklist synthesizes the compliance requirements of all four bodies into a project closeout verification list:

| # | Item | Standard |
|---|---|---|
| 1 | All aerial spans satisfy NESC clearance minimums at maximum ice load | NESC C2-2023, Rule 232 |
| 2 | Aerial cable/messenger rated for applicable NESC loading district | NESC C2-2023, Rules 250–251 |
| 3 | All metallic armor bonded and grounded at each closure, BET, transition | NESC C2-2023, Rule 352; TIA-758-C §6.4 |
| 4 | Ground rod resistance measured and recorded at each grounding point | NESC C2-2023, Rule 352 |
| 5 | OSP cable does not extend > 50 ft inside any building without OFNR/OFNP transition | NEC Article 770.113 |
| 6 | Indoor cable rated for installed space (OFNR in risers, OFNP in plenum spaces) | NEC Article 770.113 |
| 7 | Direct-bury cable burial depth verified and recorded at ≤ 500 ft intervals | ANSI/TIA-758-C §6.3, §7 |
| 8 | 10 m slack coil present at each splice closure; 3 m at each FDH/FDT | ANSI/TIA-758-C §6.4 |
| 9 | OTDR traces and OLTS tests completed at 1310 nm and 1550 nm for all fibers | ANSI/TIA-526-7; BICSI OSP-DRD Ch. 7 |

*Source: Synthesized from [NESC C2-2023; NEC Article 770; ANSI/TIA-758-C; BICSI OSP-DRD Manual]*

---

## Key Terms (Flashcard Candidates)

**NESC (National Electrical Safety Code) C2**
The national safety code governing electrical supply and communication lines on public property — poles, rights-of-way, and utility underground infrastructure. Enforced by local authorities having jurisdiction (AHJ). Key OSP provisions: aerial clearances (Rules 232, 250–251), underground installation (Rule 354), metallic armor grounding (Rule 352). [NESC C2-2023]

**NEC Article 770**
The National Electrical Code article governing optical fiber cable installations inside buildings. Establishes fire-rating requirements (OFNR, OFNP), the 50-foot interior limit for OSP-rated cable, and listing requirements for all indoor optical fiber cable. [NEC Article 770]

**AHJ (Authority Having Jurisdiction)**
The governmental body or official empowered to enforce safety codes — typically the local building department, utility commission, or OSHA regional office. AHJ may impose requirements more stringent than code minimums; the most stringent applicable requirement governs. [NESC C2-2023 §1; NEC §90.4]

**NESC loading district**
Geographic classification in NESC C2-2023 assigning design radial ice thickness and wind pressure for aerial line engineering. Three primary districts: light (0.00 in. ice, 9 psf wind), medium (0.25 in. ice, 4 psf wind), heavy (0.50 in. ice, 4 psf wind). Plus extreme wind zone for coastal areas. All aerial cable, messenger, and hardware must be rated for the applicable district. [NESC C2-2023, Rules 250–251]

**Bonding conductor**
The copper wire (minimum 6 AWG) connecting metallic cable armor to a ground electrode (ground rod). Required at each splice closure, BET, and cable end for CST-armored or wire-armored cable. The bonding conductor ensures metallic armor potential equalizes with ground, preventing shock hazard and lightning-induced discharge through splice hardware. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]

**OTDR (Optical Time-Domain Reflectometer)**
Test instrument that launches a timed optical pulse into the fiber and measures the backscattered return signal as a function of time (converted to distance). Identifies splice events, connector reflections, macro-bends, cable breaks, and fiber end-point reflections. Required test method for OSP acceptance testing. Two-wavelength testing (1310 nm and 1550 nm) is required for OS2 cable. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]

**OLTS (Optical Loss Test Set)**
A calibrated light source and optical power meter used to measure total insertion loss of a fiber link from end to end. Complementary to OTDR: OTDR identifies the location and magnitude of individual events; OLTS provides the total link loss figure for comparison to the power budget. [ANSI/TIA-568.3-D §11; BICSI OSP-DRD Manual, Ch. 7.2]

**Optical power budget**
The maximum total insertion loss (fiber + splices + connectors + bend losses) that an active circuit can tolerate and still meet the receiver's minimum sensitivity specification. Calculated from the transceiver datasheet. Every installed link's OLTS-measured insertion loss must be ≤ the optical power budget. [BICSI OSP-DRD Manual, Ch. 7.1; IEEE 802.3]

**Slack loop**
A coiled reserve of cable left at each splice closure location, providing extra length for future re-splicing, repair after cable damage, and closure repositioning. ANSI/TIA-758-C §6.4 requires a minimum of **10 meters** at each splice closure and 3 meters at FDH/FDT termination points. [ANSI/TIA-758-C §6.4]

**Fiber assignment table**
A project documentation deliverable mapping each fiber in each cable segment to its circuit assignment (active) or reserve status (dark). Required by BICSI OSP-DRD Manual Ch. 8 as a pre-construction deliverable. Updated in as-built form at project closeout. Essential for future network changes and repair dispatch. [BICSI OSP-DRD Manual, Ch. 8]

**Macro-bend loss**
Optical loss induced by a cable bend radius tighter than the fiber's rated minimum bend radius. Macro-bend loss is wavelength-dependent — higher at longer wavelengths — making the 1550 nm OTDR trace more sensitive to bend events than the 1310 nm trace. OS2 fiber conforming to ITU-T G.657.A1 has enhanced macro-bend tolerance compared to standard G.652.D. [ITU-T G.657 §5.2; Corning OSP Reference, Ch. 7.1]

---

## Interactive: Scenario — Compliance Audit Walkthrough

### Scenario

A project team has completed a 6.2-mile OSP FTTH feeder installation. The route is: 1.8 miles aerially on a 7.2 kV distribution pole line → 0.5-mile aerial-to-underground transition zone and conduit crossing under a county road → 3.9 miles direct-bury through agricultural land → building entry into the network operations center (NOC). The installation uses ADSS cable on the aerial segment and 144-fiber loose-tube OS2 with CST armor on the direct-bury segment.

A compliance auditor presents five findings. For each finding, select the correct disposition:

**Finding 1:** The ADSS aerial segment has no bonding conductors at the pole attachment points.

Choices:
- A) Finding is valid — ADSS cables require bonding at every pole
- B) Finding is not valid — ADSS is fully dielectric; no bonding or grounding is required **[CORRECT]**
- C) Finding is valid — bonding is required only at road crossings

*Rationale:* ADSS cable is fully non-metallic. It has no steel messenger, no metallic armor, and no metallic element requiring bonding. NESC Rules 352 and 354 apply to metallic conductors and metallic cable sheaths. A fully dielectric cable has no grounding requirement at pole attachment points [NESC C2-2023, Rule 352; ANSI/TIA-758-C §5.6.3; IEEE 1222]. **Finding not valid.**

---

**Finding 2:** The CST-armored direct-bury cable has bonding conductors at four splice closures on the 3.9-mile direct-bury segment, but not at the aerial-to-underground transition riser base where the cable transitions from ADSS to the CST-armored cable.

Choices:
- A) Finding is not valid — bonding is only required at splice closures
- B) Finding is valid — the transition point is an accessible point where metallic armor begins; it must be bonded to ground **[CORRECT]**
- C) Finding is valid — the transition point must be bonded, and additionally the splice closure count (4) is insufficient; bonding must occur every 500 feet

*Rationale:* NESC Rule 352 and ANSI/TIA-758-C §6.4 require metallic armor bonding at all accessible points: splice closures, BETs, cable ends, and any point where the armor begins or ends — including the aerial-to-underground transition where the ADSS cable (no armor) is joined to the CST-armored direct-bury cable. The transition riser base is the point where metallic armor first appears in the route and must be bonded. The 3.9-mile direct-bury segment with 4 splice closures does not violate the NESC interval provision (bonding at each closure is the practical implementation). **Finding valid.** [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]

---

**Finding 3:** The building entry into the NOC has OSP cable extending 65 feet from the building penetration to the main termination panel. No BET or indoor cable transition was installed.

Choices:
- A) Finding is not valid — OSP cable may run up to 100 feet inside a building in a telecommunications room
- B) Finding is valid — NEC 770.113 limits OSP cable to 50 feet inside a building; a BET and OFNR transition are required for the remaining 15 feet **[CORRECT]**
- C) Finding is not valid — OSP cable in a non-plenum telecommunications room is exempt from the 50-foot limit

*Rationale:* NEC Article 770.113 allows OSP-rated cable to extend a maximum of **50 feet** from the point of building entry without an indoor cable transition, regardless of the space type. 65 feet exceeds this limit by 15 feet. A BET must be installed at or before the 50-foot point, and an OFNR-rated (or OFNP-rated if any portion is in a plenum space) cable must continue to the termination panel. The "telecommunications room" classification is not an exemption from NEC 770.113. **Finding valid.** [NEC Article 770.113]

---

**Finding 4:** The as-built documentation package includes OTDR traces at 1310 nm for all 144 fibers through all splice closures, but no 1550 nm traces.

Choices:
- A) Finding is not valid — 1310 nm OTDR is the only required wavelength for OS2 feeder cable
- B) Finding is valid — both 1310 nm and 1550 nm OTDR testing are required for OS2 OSP acceptance testing **[CORRECT]**
- C) Finding is not valid — OTDR testing is optional; OLTS insertion loss testing is the only required acceptance test

*Rationale:* ANSI/TIA-526-7 and BICSI OSP-DRD Manual Chapter 7 require OTDR testing of OS2 OSP fiber at **both 1310 nm and 1550 nm**. The 1550 nm trace is specifically required because macro-bend loss events — buried cable bent tighter than minimum bend radius during installation — produce significantly more measurable loss at 1550 nm than at 1310 nm. Omitting the 1550 nm trace means macro-bend events in the installed plant may be undetected. Both wavelengths are required for project acceptance. **Finding valid.** [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]

---

**Finding 5:** Burial depth records show the direct-bury segment was measured every 800 feet along the route; measurements at the county road crossing show 34 inches of burial depth.

Choices:
- A) Finding is not valid — 34 inches exceeds the 24-inch minimum for direct-bury cable
- B) Finding has two issues: measurement interval exceeds the 500-foot maximum, and 34-inch depth at the road crossing does not meet the 36-inch minimum for cable under roadways **[CORRECT]**
- C) Finding is partially valid — the measurement interval is incorrect; the 34-inch depth at the road crossing is acceptable

*Rationale:* Two independent issues. (1) ANSI/TIA-758-C §7 requires burial depth documentation at intervals not exceeding **500 feet**; every-800-foot documentation misses measurements in between and does not satisfy the documentation requirement. (2) ANSI/TIA-758-C §6.3 requires a minimum burial depth of **36 inches (914 mm)** under roads, streets, and highways. The 34-inch measurement at the county road crossing is 2 inches below the minimum and must be remediated — either by deepening the cable at the crossing or by installing a protective casing to make up the insufficient cover. **Finding valid on both counts.** [ANSI/TIA-758-C §6.3, §7]

---

## Multiple-Choice Quiz

---

**Q1.** An OSP cable with CST armor is installed in a direct-bury route. At a splice closure on the route, the 6 AWG bonding conductor connects the armor to a ground rod driven 8 feet into the soil, with a measured resistance of 24 ohms. The local AHJ requires ≤ 25 ohms. Is this grounding installation compliant?

- A) No — NEC requires resistance-to-ground ≤ 5 ohms for all telecommunications cable grounding
- B) Yes — the measured resistance of 24 ohms is below the AHJ's 25-ohm requirement; the installation is compliant **[CORRECT]**
- C) No — NESC requires a minimum of two ground rods for any telecommunications cable grounding point
- D) Yes — but the bonding conductor must be upgraded to 4 AWG per NESC Rule 352

*Rationale:*
- **A — Incorrect.** The 5-ohm standard is associated with certain power utility grounding requirements (NEC Article 250) and is sometimes cited for specific telecommunications facilities. It is not a universal requirement for OSP cable armor grounding. The AHJ-specified limit governs for this installation. [NESC C2-2023, Rule 352; NEC §250.53]
- **B — Correct.** The AHJ requires ≤ 25 ohms resistance-to-ground. The measured resistance (24 ohms) is below this limit. Compliance is determined against the most stringent applicable requirement — here the AHJ limit — and the installation meets it. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]
- **C — Incorrect.** NESC does not categorically require two ground rods for telecommunications cable armor bonding. Multiple ground rods are required if the single-rod resistance exceeds the applicable limit; this installation meets the AHJ's single-rod limit. [NESC C2-2023, Rule 352]
- **D — Incorrect.** The minimum bonding conductor size for telecommunications armor grounding per NESC Rule 352 and ANSI/TIA-758-C §6.4 is **6 AWG copper**. Upgrading to 4 AWG is not required and not indicated by the measured resistance. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]

---

**Q2.** A building's HVAC system uses a ceiling plenum return-air design on the second floor. OSP fiber from an outside plant cable enters the building at the first-floor mechanical room and must route to a second-floor communications room through the ceiling plenum on floor one. Which cable ratings are required for the two interior segments?

- A) OFNR for the first-floor segment (mechanical room to plenum entry); OFNR for the plenum segment — riser-rated cable is allowed in plenum spaces
- B) OFNR for the first-floor segment (mechanical room to plenum entry); OFNP for the plenum segment **[CORRECT]**
- C) OFNP for all interior cable — OFNP is required whenever cable passes through any indoor space
- D) OSP cable can continue through both segments if enclosed in metallic conduit throughout

*Rationale:*
- **A — Incorrect.** OFNR (riser-rated) cable may **not** be substituted for OFNP (plenum-rated) in air-handling plenum spaces. OFNP passes the more restrictive UL 910 flame and smoke test; OFNR passes only UL 1666. A fire in the plenum that ignites OFNR cable produces smoke that is distributed to the entire building through the HVAC system. NEC Article 770.113 explicitly prohibits OFNR in plenum spaces. [NEC Article 770.113]
- **B — Correct.** The first-floor segment (mechanical room to the plenum space boundary, a non-plenum general space) requires **OFNR** (riser-rated) as the minimum listing for a vertical or horizontal run outside plenum and riser paths. The segment running through the ceiling plenum requires **OFNP** (plenum-rated). OFNP may substitute for OFNR anywhere, but OFNR cannot substitute for OFNP. [NEC Article 770.113]
- **C — Incorrect.** OFNP is not required for all indoor cable — it is required specifically in air-handling plenum spaces. Applying OFNP throughout the installation is over-specification that increases cost without regulatory benefit (though not a code violation). [NEC Article 770.113]
- **D — Incorrect.** The metallic conduit exception under NEC 770.113(A)(1) permits non-listed cable (including OSP cable) to run inside metallic conduit without the 50-foot interior limit, provided the conduit is continuous. However, this exception applies to the building-entry cable transitioning to indoor termination — the OSP cable itself is the cable being conduit-enclosed. The scenario implies fiber from the OSP cable is being extended through the plenum, not the OSP cable itself. If the OSP cable is inside continuous metallic conduit through the plenum, the conduit exception applies; if only the fiber or an indoor cable is routed in the plenum, OFNP is required. In most practical building-entry scenarios, the BET-to-OFNP approach is used rather than continuous metallic conduit through the plenum. [NEC Article 770.113(A)(1)]

---

**Q3.** During OTDR testing of a newly installed 4.8-km OS2 direct-bury feeder, the 1310 nm trace shows clean splice events (0.05–0.08 dB each) and a clean end-of-fiber reflection. The 1550 nm trace shows an anomalous 0.4 dB event at 2.1 km. No splice is located at 2.1 km. What does this finding most likely indicate?

- A) The 1550 nm OTDR calibration is incorrect — re-zero the instrument and repeat
- B) A macro-bend event — the cable is bent tighter than the minimum bend radius at 2.1 km, and the higher sensitivity of the 1550 nm trace detects the loss event **[CORRECT]**
- C) A water-ingress event — water in the buffer tube at 2.1 km increases attenuation at 1550 nm
- D) A fiber break at 2.1 km — the 0.4 dB event represents a partial fiber fracture

*Rationale:*
- **A — Incorrect.** An anomalous event at a specific location (2.1 km) on one wavelength but not another is not a calibration error — calibration errors affect the entire trace uniformly, not a single discrete location. [ANSI/TIA-526-7 §5]
- **B — Correct.** Macro-bend loss is wavelength-dependent: loss at 1550 nm for a given bend radius is significantly higher than at 1310 nm. A 0.4 dB event at 2.1 km visible at 1550 nm but absent at 1310 nm is the classic signature of a **macro-bend** — the cable is bent tighter than its minimum bend radius at that location. This occurs in direct-bury cable where a rock ledge, root, or conduit bend forces the cable into a tight radius. The 1550 nm trace is specifically required for OSP acceptance because it reveals these events that are invisible or nearly invisible on the 1310 nm trace. Remediation: excavate at 2.1 km, identify and relieve the source of the tight bend, re-test [BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.1; ITU-T G.657 §5.2].
- **C — Incorrect.** Water ingress that causes hydrogen darkening would typically appear as an elevated attenuation slope across the affected fiber length, not as a discrete 0.4 dB event at a single point. Hydrogen darkening is also more pronounced at 1383 nm (the water-peak wavelength) than at 1550 nm for G.652 fiber. A discrete event at a single point strongly suggests a bend, not water. [Corning OSP Reference, Ch. 7.2]
- **D — Incorrect.** A partial fiber fracture (internal crack) typically appears as a reflective event (spike up from the noise floor) on the OTDR trace, not simply as a non-reflective loss event. A complete fiber break appears as a flat return-noise floor with no end reflection beyond the break. The description of a 0.4 dB loss event without reflective signature is more consistent with bend loss than fracture. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 7.2]

---

**Q4.** ANSI/TIA-758-C §6.4 requires a minimum slack loop of 10 meters at each splice closure. A field crew installed slack loops of approximately 6 meters at three closures on a completed route, citing limited space in the underground handhole. What is the practical consequence of insufficient slack, and what is the correct disposition?

- A) The 6-meter loops are acceptable — 10 meters is a guideline, not a mandatory minimum; AHJ discretion governs
- B) The 6-meter loops must be remediated — insufficient slack prevents future re-splicing and may leave the plant unable to recover from a cut within the closure zone **[CORRECT]**
- C) The 6-meter loops are acceptable if the route includes additional dark fibers as backup capacity
- D) The 6-meter loops must be remediated only if the OTDR trace shows elevated splice loss at those closures

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C §6.4 states the slack loop minimum as a specification requirement, not a guideline. Contracts citing TIA-758-C (including all RUS-funded projects) make compliance with §6.4 a contractual obligation. [ANSI/TIA-758-C §6.4]
- **B — Correct.** The 10-meter slack loop minimum exists because cable repairs and re-splicing after damage require that the cable be extracted from the handhole, cut back past the damage, re-stripped, and re-spliced — consuming slack. A closure zone cut requires: (1) pulling cable from the ground on both sides of the damage point, (2) cutting back past the damaged section, (3) installing a new splice closure in a temporary location, and (4) re-splicing. With only 6 meters of available slack, a cut even 2–3 meters from the closure can leave insufficient cable to reach the new splice point. The 10-meter minimum is a practical engineering requirement for field repair feasibility, not a comfort margin. Remediation: excavate, pull additional cable through from the nearest pull point or drum reserve, and achieve the 10-meter slack before backfilling. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]
- **C — Incorrect.** Dark fiber reserve addresses capacity redundancy, not mechanical repair capability. A cable cut affects all fibers — active and dark — simultaneously. Dark fiber reserves do not provide the physical slack needed for repair splicing. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §6.4]
- **D — Incorrect.** OTDR splice loss and slack loop adequacy are independent parameters. Clean splice loss at a closure does not indicate the slack loop meets the TIA-758-C §6.4 minimum. Slack loop compliance is a mechanical measurement — 10 meters of cable present in the closure — not an optical measurement. [ANSI/TIA-758-C §6.4]

---

**Q5.** A BICSI OSP-DRD-compliant design documentation package must be submitted before construction begins. Which document maps each fiber in each cable segment to its intended circuit or dark-fiber reserve status?

- A) Route drawing
- B) Optical power budget calculation
- C) Fiber assignment table **[CORRECT]**
- D) Splice closure placement plan

*Rationale:*
- **A — Incorrect.** The route drawing shows the physical geography of the cable plant — route centerline, closure locations, conduit runs, aerial spans. It does not document fiber-level circuit assignments. [BICSI OSP-DRD Manual, Ch. 8]
- **B — Incorrect.** The optical power budget calculation documents the maximum insertion loss each active link can tolerate, compared to the transceiver loss budget. It is a link-level calculation, not a fiber assignment document. [BICSI OSP-DRD Manual, Ch. 7.1]
- **C — Correct.** The **fiber assignment table** maps each fiber strand in each cable segment to its circuit assignment (active — and which circuit), spare-assigned (reserved for a planned future circuit), or dark-unassigned status. It is a required pre-construction BICSI OSP-DRD design deliverable and is updated at project closeout as an as-built record. Without it, network operations staff cannot reliably identify which fibers to patch to which circuits after splicing, and future network changes cannot be managed without full re-testing [BICSI OSP-DRD Manual, Ch. 8].
- **D — Incorrect.** The splice closure placement plan documents the location, type, and splice count for each closure — a physical plant document, not a fiber-circuit mapping document. [BICSI OSP-DRD Manual, Ch. 8]

---

## Final Check

Answer before proceeding to Lesson 12 (Hands-On Case Studies).

**Pulse 1.** Name the four regulatory/standards bodies governing OSP fiber installations in the United States, state one primary fiber-relevant requirement from each, and identify which two are safety codes with AHJ enforcement authority.

*Expected answer:*
1. **NESC (C2-2023)** — requires metallic cable armor to be bonded and grounded at each splice closure, building entry, and cable end. **Safety code; AHJ enforcement.**
2. **NEC (NFPA 70) Article 770** — limits OSP cable to 50 feet inside a building and requires listed indoor cable (OFNR/OFNP) beyond that point. **Safety code; AHJ enforcement.**
3. **ANSI/TIA-758-C** — requires minimum 10-meter slack loop at each splice closure and OTDR testing at 1310 nm and 1550 nm for OSP fiber acceptance. Engineering standard; enforced by contract (not AHJ).
4. **BICSI OSP-DRD Manual** — requires a fiber assignment table as a pre-construction design deliverable. Best-practice guideline; enforced by contract and BICSI credentialing, not AHJ.

[NESC C2-2023; NEC Article 770; ANSI/TIA-758-C; BICSI OSP-DRD Manual, Ch. 8]

**Pulse 2.** A direct-bury CST-armored cable terminates at a BET at the base of a building. Describe the two compliance actions required at that point (one for the cable armor, one for the cable's indoor continuation).

*Expected answer:*
1. **Armor bonding:** The CST armor must be bonded to a ground electrode (ground rod, minimum 6 AWG copper bonding conductor) at the BET location. The BET is an accessible cable end and transition point — NESC Rule 352 and ANSI/TIA-758-C §6.4 require armor bonding at all such points. Ground rod resistance must be measured and documented [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4].
2. **Indoor cable transition:** The OSP cable may enter the building and run a maximum of 50 feet to the BET location. At the BET, the OSP cable terminates and an **OFNR-rated** (or OFNP if the path includes a plenum space) indoor cable continues to the termination panel. The BET provides the waterproof sealed transition and the fire-rating demarcation [NEC Article 770.113; ANSI/TIA-758-C §5.2].

**Pulse 3.** An OTDR test at 1550 nm reveals a 0.6 dB non-reflective event at 3.4 km on a direct-bury feeder fiber. The same location on the 1310 nm trace shows only a 0.08 dB attenuation step. What is the most likely cause, and what action should the OSP technician take?

*Expected answer:* The wavelength-dependent loss signature — high loss at 1550 nm, low loss at 1310 nm at the same physical location — is the classic indicator of a **macro-bend event**. Bend loss is strongly wavelength-dependent: at a given bend radius, loss at 1550 nm is substantially higher than at 1310 nm. The likely cause is a soil anomaly (rock ledge, root mass, or frost heave pocket) forcing the buried cable into a tight bend radius below the minimum bend radius specification (typically ≥ 20× cable OD for long-term installation per ANSI/TIA-758-C §6.2). **Remediation:** (1) Mark the 3.4 km location on the GPS/survey route map. (2) Excavate the burial trench at that location to expose the cable. (3) Identify and remove or route around the source of the tight bend. (4) Re-bury the cable with adequate clearance from the obstruction. (5) Re-OTDR at 1550 nm to confirm the event has been resolved before project closeout. [BICSI OSP-DRD Manual, Ch. 7.2; ANSI/TIA-758-C §6.2; Corning OSP Reference, Ch. 7.1]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **NESC loading district / Rules 250–251** → Lesson 4 (armored/aerial variants — NESC loading district first cited for ADSS span engineering), Lesson 10 (environment selection — NESC loading district governs aerial cable selection by geography)
- **NEC Article 770 / OFNR / OFNP / BET** → Lesson 10 (environment selection — OSP-to-inside transition section; BET and fire ratings first introduced there)
- **OTDR / OLTS / optical power budget** → Lesson 12 (case studies — OTDR acceptance testing is documented in all three case study closeout deliverables)
- **Bonding conductor / ground rod / CST armor grounding** → Lesson 4 (armored/aerial variants — CST armor bonding requirement first introduced there), Lesson 10 (direct-bury environment — bonding requirement repeated in compliance context)
- **Slack loop / §6.4** → Lesson 8 (drop/distribution/feeder — slack loop calculation in feeder sizing example), Lesson 12 (case studies — slack loop is a line item in all three case study compliance checklists)
- **Fiber assignment table** → Lesson 12 (case studies — fiber assignment table completion is a closeout deliverable in all three scenarios)
- **Macro-bend loss** → Lesson 10 (environment selection — bend radius limits cited for conduit installation; macro-bend as the rationale for 1550 nm OTDR testing)
