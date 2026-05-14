---
title: "Lesson 7: Sheath Options & Fire Ratings (PE / OSP / FR / Armored)"
duration_min: 25
topic: cable-selection
order: 7
bicsi_alignment:
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
  - "OSP-DRD 5.6: Armored and self-supporting cable designs"
  - "OSP-DRD 7.1: Cable installation — OSP to premises transition"
sources:
  - "ANSI/TIA-758-C §5.2 and §5.6"
  - "ANSI/TIA-568.3-D §6.4"
  - "NEC (National Electrical Code) Article 770 (2023 edition)"
  - "NESC (National Electrical Safety Code) C2-2023, Rule 352"
  - "IEC 60794-1-2 (optical fiber cable — detail specification tests)"
  - "UL 1666 (riser flame test standard)"
  - "UL 910 (plenum flame and smoke test standard)"
  - "BICSI OSP-DRD Manual, Ch. 5 §5.6 and Ch. 7 §7.1"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 5"
  - "CommScope Cabling Systems Reference Manual Ch. 7"
---

# Sheath Options & Fire Ratings (PE / OSP / FR / Armored)

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the four primary OSP sheath material types and state the deployment environment each is designed for
- Interpret NEC Article 770 fire rating designations (OFN/OFC, OFNR/OFCR, OFNP/OFCP) and select the correct rating for a given installation context
- Apply the OSP-to-premises transition rule and identify the maximum penetration distance for unlisted OSP cable inside a building
- Distinguish between sheath material requirements for direct-bury, aerial, conduit, and indoor-riser applications

---

## Reading Content

### The Sheath's Job

The cable sheath is the final engineered barrier between the optical fiber assembly and the deployment environment. It must simultaneously perform several functions that can be in direct tension with each other: block moisture penetration (critical for OSP), resist UV degradation (aerial and exposed installations), withstand soil-chemistry attack (direct-bury), survive installation pulling forces without tearing, and — when cable enters a building — limit flame propagation and smoke production in compliance with NEC Article 770 [ANSI/TIA-758-C §5.2; NEC Article 770.1].

No single sheath material meets all these requirements equally well. The cable designer selects a sheath formulation matched to the dominant threat in the deployment environment, and the OSP engineer specifies the resulting cable type for the route. Understanding this selection logic is the foundation for reading cable data sheets and writing correct specifications.

### Polyethylene (PE): The OSP Standard

**Polyethylene (PE)** — specifically medium-density polyethylene (MDPE) or high-density polyethylene (HDPE) — is the standard outer sheath material for outdoor OSP cable [ANSI/TIA-758-C §5.2; IEC 60794-3, §4.3]. PE's outdoor performance profile is the reason it dominates OSP applications:

- **Moisture resistance:** PE is highly hydrophobic. Water does not penetrate the bulk material; it can only migrate through mechanical damage or end-cap failures. This makes PE the default sheath for direct-bury, conduit, and aerial OSP applications where multi-decade exposure to rain, groundwater, and condensation is expected [Corning OSP Reference, §5.1].
- **UV resistance:** Carbon-black compounding (standard for outdoor-grade PE) absorbs UV radiation that would otherwise degrade unstabilized polymer. A typical OSP cable with a UV-stabilized black PE sheath has a rated outdoor service life of 20–30 years [IEC 60794-1-2, §F.5; AFL OSP Cable Design Guide, §5.1].
- **Chemical resistance:** PE resists the soil acids, alkalis, and salt compounds encountered in agricultural, roadside, and coastal OSP deployments better than most alternative sheath polymers.
- **Installation toughness:** HDPE offers higher tensile and impact strength than MDPE, making it the preferred choice for armored direct-bury designs where the sheath experiences installation abuse [ANSI/TIA-758-C §5.6; CommScope Reference Manual, Ch. 7.1].

**Critical limitation: PE is not flame-retardant.** When ignited, PE burns freely and propagates flame. NEC Article 770 prohibits unlisted PE-jacketed OSP cable inside buildings beyond a 50-foot (15-meter) transition allowance [NEC Article 770.48(A)]. The OSP-to-premises transition is discussed below.

**MDPE vs. HDPE: practical distinction**

| Property | MDPE | HDPE |
|---|---|---|
| Density | 0.926–0.940 g/cm³ | 0.941–0.965 g/cm³ |
| Stiffness | Moderate | Higher — stiffer cable |
| Crush resistance | Standard | Higher — preferred for armored direct-bury |
| Cold temperature flexibility | More flexible | Less flexible in extreme cold |
| Typical application | Conduit, aerial | Direct-bury, armored |

*Source: [AFL OSP Cable Design Guide, §5.1; IEC 60794-1-2]*

### OSP-Rated Sheath Compounds

Some manufacturers produce hybrid sheath compounds described as "OSP-rated" or "outdoor/indoor dual-rated" that add flame retardant additives to a polyolefin base while maintaining sufficient moisture resistance for outdoor runs. These compounds aim to reduce transition complexity by allowing the same cable to be used for a short outdoor run terminating inside a building in a riser or plenum environment [ANSI/TIA-568.3-D §6.4.3].

In practice, dual-rated cables must carry the appropriate NEC Article 770 listing (OFNR, OFNP, OFCR, or OFCP) to be used in the indoor environment without the 50-foot transition allowance. The "OSP-rated" marketing designation alone is not a substitute for NEC listing — the listing must appear on the cable jacket as a printed mark and in the UL Product Spec database [NEC Article 770.48(A); BICSI OSP-DRD Manual, Ch. 7.1].

### Flame-Retardant (FR) and NEC Article 770 Ratings

When an optical fiber cable enters a building — even briefly, to connect an outside plant run to indoor equipment — it enters NEC Article 770 jurisdiction. The NEC classifies indoor optical fiber cables by two attributes: **conductive vs. non-conductive** and **flame spread rating** [NEC Article 770.179].

**Conductive vs. Non-Conductive:**
- **OFC** (Optical Fiber Conductive) — cable contains metallic elements (steel armor, metallic strength members, metallic vapor barrier). Must be grounded per NEC Article 770.100 if run inside a building.
- **OFN** (Optical Fiber Non-Conductive) — fully dielectric cable; no metallic elements. Does not require grounding; preferred for in-building runs where grounding adds complexity. [NEC Article 770.179(A) and (B)]

**Flame spread ratings (indoor use):**

| NEC Designation | Full Name | Test Standard | Application |
|---|---|---|---|
| **OFNP / OFCP** | Plenum-rated, non-conductive / conductive | UL 910 (Steiner tunnel) | Supply air plenums, return air spaces, raised-floor data center environments |
| **OFNR / OFCR** | Riser-rated, non-conductive / conductive | UL 1666 (vertical flame) | Vertical shafts, between floors, general vertical riser applications |
| **OFN / OFC** | General-purpose (non-conductive / conductive) | UL 1581 (VW-1 flame) | Horizontal runs within a floor; not permitted in riser or plenum |

*Source: [NEC Article 770.179; UL 910; UL 1666]*

**Substitution hierarchy:** The NEC permits higher-rated cable to substitute for lower-rated cable in a given application (OFNP can substitute anywhere; OFNR can substitute for OFN but not OFNP). Lower-rated cable cannot substitute for higher-rated in a more demanding environment [NEC Article 770.179(C)].

### The OSP-to-Premises Transition Rule

OSP cable (PE sheath, unlisted) is permitted to enter a building under NEC Article 770.48(A) **only if the length inside the building does not exceed 50 feet (15 meters) AND the cable terminates in a listed splicing enclosure, distribution panel, or connector housing that confines the unlisted cable end within an approved termination point.** Beyond 50 feet, the run must transition to a listed indoor cable (OFNR or OFNP as applicable) at the building entry point [NEC Article 770.48(A)].

Practical implementation: most OSP runs terminate at a **building entrance terminal (BET)** or **outside plant transition closure** at the building exterior wall or just inside the wall penetration. Listed indoor cable fanouts from the BET to the equipment room. This keeps the PE-jacketed OSP cable entirely outside (or within the 50-foot transition allowance) while ensuring all in-building runs meet the applicable NEC flame rating [BICSI OSP-DRD Manual, Ch. 7.1; ANSI/TIA-758-C §6.5].

### Sheath and Armor Combinations

In practice, OSP cable sheaths are often combined with armor layers for mechanical protection, and the combined system determines both the electrical and fire-rating classification:

| Cable construction | Conductive? | OSP outdoor use | Indoor NEC rating |
|---|---|---|---|
| Loose-tube, GRP CSM, PE sheath (no armor) | No (OFN-type) | Direct-bury/conduit/aerial | Unlisted — 50-ft transition only |
| Loose-tube, steel CSM, PE sheath | Yes (OFC-type) | Conduit/aerial | Unlisted — 50-ft transition only |
| Loose-tube, CST armor, PE sheath | Yes (OFC-type) | Direct-bury (primary) | Unlisted — 50-ft transition only; bond at entry |
| Dielectric armor (GRP/fiberglass), PE sheath | No (OFN-type) | Direct-bury near electrical | Unlisted — 50-ft transition only |
| ADSS (aramid/GRP, dual-layer MDPE) | No (OFN-type) | Aerial (energized lines) | Unlisted — 50-ft transition only |
| Listed indoor/outdoor cable (OFNR, OFNP) | Depends on design | Short outdoor runs only | Listed — full indoor use |

*Source: [NEC Article 770.179; ANSI/TIA-758-C §5.6; BICSI OSP-DRD Manual, Ch. 7.1]*

### UV Exposure and Aerial Sheath Considerations

Aerial cable experiences UV exposure that buried and conduit-installed cable does not. PE sheath with carbon-black UV stabilizer (the standard for black-jacketed OSP cable) provides adequate UV resistance for multi-decade aerial service life [IEC 60794-1-2, §F.5]. Unjacketed or non-UV-stabilized cable degrades rapidly in outdoor UV: chalking, cracking, and embrittlement begin within 2–3 years of exposure [Corning OSP Reference, §5.2].

ADSS cables use a dual-layer sheath specifically for UV/tracking resistance. The **tracking resistance** requirement is unique to ADSS on energized electric utility lines: dry-band arcing (partial discharge from differential voltage across contaminated sheath sections) causes progressive sheath erosion. ADSS sheath compounds for high-voltage line installations are specified for **tracking resistance** per IEEE 1222 §5.3 in addition to standard UV resistance [IEEE 1222 §5.3; ANSI/TIA-758-C §5.6.3].

### Sheath Material Selection Summary

| Environment | Recommended sheath | Key requirements |
|---|---|---|
| Direct-bury (standard) | Black MDPE/HDPE + CST armor | Moisture, soil chemistry, rodent |
| Conduit (wet/outdoor) | Black MDPE, no armor needed | Moisture, UV (at exposed ends) |
| Aerial, standard pole line | Black MDPE | UV, temperature cycling |
| Aerial, energized utility line (ADSS) | Dual-layer MDPE, tracking-resistant | UV, dry-band arcing, tracking resistance |
| OSP-to-premises transition (<50 ft) | Black PE, terminate in listed BET | 50-ft NEC rule; bond metallic elements |
| In-building riser | OFNR (listed) | UL 1666 riser flame test |
| In-building plenum | OFNP (listed) | UL 910 Steiner tunnel test |

*Source: [ANSI/TIA-758-C §5.2, §5.6; NEC Article 770; IEEE 1222 §5.3]*

---

## Key Terms (Flashcard Candidates)

**Polyethylene (PE) sheath**
The standard OSP cable outer jacket material — medium-density (MDPE) or high-density (HDPE) polyethylene — compounded with carbon-black UV stabilizer for outdoor durability. Provides excellent moisture resistance and soil chemistry resistance. Not flame-retardant; NEC Article 770 limits unlisted PE-jacketed cable to a 50-foot building penetration. [ANSI/TIA-758-C §5.2]

**OFNP (Optical Fiber Non-Conductive Plenum)**
The highest NEC Article 770 flame rating for indoor optical fiber cable. Tested per UL 910 Steiner tunnel test for both flame spread and smoke density. Required in air-handling spaces (supply air plenums, raised-floor data centers). Fully dielectric. [NEC Article 770.179(A); UL 910]

**OFNR (Optical Fiber Non-Conductive Riser)**
NEC Article 770 rating for indoor optical fiber cable suitable for vertical riser applications. Tested per UL 1666 vertical flame test. Permitted in riser shafts and between floors. May substitute for general-purpose OFN but not for OFNP in plenum applications. Fully dielectric. [NEC Article 770.179(A); UL 1666]

**OFN (Optical Fiber Non-Conductive, general-purpose)**
The base indoor NEC Article 770 rating. Tested per UL 1581 VW-1 vertical flame test. Permitted for horizontal runs within a single floor. Not permitted in riser shafts or plenum spaces. [NEC Article 770.179(A); UL 1581]

**OFC / OFCR / OFCP (Optical Fiber Conductive)**
NEC Article 770 designations for optical fiber cables containing metallic elements (steel armor, metallic CSM, metallic vapor barrier). Conductive variants of OFN/OFNR/OFNP respectively. Metallic elements must be grounded per NEC Article 770.100 when run inside a building. [NEC Article 770.179(B)]

**Building entrance terminal (BET)**
A listed splice enclosure or distribution panel installed at the OSP/premises boundary — typically at the building exterior wall — where OSP cable terminates and listed indoor cable connects. Permits PE-jacketed OSP cable to enter the building within the NEC 50-foot transition allowance without requiring a listed cable run for the full indoor distance. [BICSI OSP-DRD Manual, Ch. 7.1; NEC Article 770.48(A)]

**Tracking resistance**
A sheath material property required for ADSS cable installed on energized electric utility pole lines. Tracking refers to progressive sheath surface erosion caused by dry-band arcing — partial discharges that occur across contaminated sheath sections in the differential voltage field near energized conductors. ADSS sheath compounds for high-voltage applications are specified for tracking resistance per IEEE 1222 §5.3. [IEEE 1222 §5.3]

**NEC Article 770 50-foot transition rule**
NEC Article 770.48(A) provision allowing unlisted OSP cable (PE-jacketed, not flame-rated) to penetrate a building by up to 50 feet (15 meters), provided the cable terminates in an approved enclosure. Beyond 50 feet, listed indoor cable (OFNR or OFNP) is required for the indoor portion. [NEC Article 770.48(A)]

**Carbon-black UV stabilizer**
The UV absorption compound blended into black polyethylene sheath material that prevents UV photodegradation of the polymer matrix during outdoor aerial and exposed installation service. A cable with UV-stabilized black PE sheath has a rated outdoor service life of 20–30 years. Non-stabilized or light-colored PE degrades measurably within 2–3 years of UV exposure. [IEC 60794-1-2, §F.5]

**NEC substitution hierarchy (Article 770)**
The permitted cable substitution rules: OFNP (plenum-rated) may be used in any application requiring OFNR or OFN; OFNR (riser-rated) may substitute for OFN but not OFNP. Lower-rated cable may never substitute for a higher-rated cable in a more demanding environment. [NEC Article 770.179(C)]

---

## Interactive: Drag-and-Drop — Match Environment to Sheath Code

**[image:sheath-environment-matching.svg]**

*Image description for SVG illustrator:*

A two-column layout. Left column: eight deployment context cards (labeled A–H). Right column: six sheath/rating codes (labeled 1–6) including OFNP, OFNR, OFN, PE (unlisted, with 50-ft note), PE + CST armor, ADSS dual-layer tracking-resistant.

Deployment context cards:
- A: Raised-floor data center air plenum, cable runs above the floor tile
- B: 800-foot direct-bury agricultural route with documented gopher activity
- C: Vertical riser shaft between floors 3 and 12 of an office building
- D: 30-foot run from building exterior wall penetration to a listed patch panel inside the MDF room
- E: Horizontal tray run within a single floor of a campus building (no plenum or riser)
- F: ADSS span on a 13.2 kV rural electric cooperative distribution line
- G: Conduit run in a wet underground vault, no indoor exposure
- H: Building entrance terminal to riser transition, cable continues 4 floors up in a vertical shaft

**Correct matches:** A→OFNP, B→PE+CST, C→OFNR, D→PE unlisted (50-ft rule), E→OFN, F→ADSS dual-layer tracking-resistant, G→PE (unlisted, no building entry), H→OFNR

**Drag-and-drop mechanic:** Learner drags each deployment context card to the correct sheath/rating code. Correct placement highlights green; incorrect highlights red with a one-sentence rationale citing the applicable NEC article or ANSI/TIA standard.

---

## Multiple-Choice Quiz

---

**Q1.** A fiber cable is being run from an OSP conduit vault, through a building entrance conduit, and 75 feet inside the building to a distribution panel in the main equipment room. Which cable type must be used for the 75-foot indoor segment?

- A) Standard PE-jacketed OSP cable — the 50-foot transition rule covers this run
- B) OFNR-listed cable for the full 75-foot indoor run **[CORRECT]**
- C) OFNP-listed cable — all equipment room runs require plenum rating
- D) Unlisted PE cable is permitted for any run that terminates in a distribution panel

*Rationale:*
- **A — Incorrect.** NEC Article 770.48(A) limits unlisted OSP cable inside a building to a maximum of **50 feet (15 meters)**. This run is 75 feet — 25 feet beyond the limit. The unlisted OSP cable must transition to listed indoor cable at or before the 50-foot mark. [NEC Article 770.48(A)]
- **B — Correct.** For the 75-foot indoor run to the equipment room, listed cable is required beyond the 50-foot transition allowance. Since the route passes through a vertical riser or a general building space (not an air-handling plenum), OFNR (riser-rated) is the minimum required designation. OFNR is tested per UL 1666 for vertical flame propagation. [NEC Article 770.48(A); NEC Article 770.179(A); UL 1666]
- **C — Incorrect.** OFNP (plenum-rated) is required only for runs in air-handling spaces — supply air plenums, return air plenums, and spaces used for air circulation. A main equipment room is not typically an air-handling plenum unless specifically designed as such. Requiring OFNP across the board would be over-specification. The correct minimum for a riser or general building run is OFNR. [NEC Article 770.179(A)]
- **D — Incorrect.** The 50-foot transition exception does not apply universally to cable runs that terminate in listed enclosures — it applies to the length of cable, not the type of termination. Even if the distribution panel is listed, the cable itself cannot exceed 50 feet inside the building if it is unlisted. [NEC Article 770.48(A)]

---

**Q2.** An OSP engineer is specifying cable for a 200-foot aerial span on a 7.2 kV distribution line. The engineer selects standard loose-tube cable with GRP central strength member and black PE sheath. What is wrong with this specification?

- A) Nothing — GRP central strength member and PE sheath are appropriate for aerial OSP
- B) The cable must have a steel CSM for adequate catenary strength on a 200-foot span
- C) The cable is fully dielectric but lacks tracking-resistant sheath compound required for energized utility lines **[CORRECT]**
- D) Aerial cable on distribution lines must use OFNR-listed sheath compound

*Rationale:*
- **A — Incorrect.** While GRP CSM and PE sheath are appropriate for many aerial applications, a 7.2 kV energized distribution line introduces an additional sheath requirement: tracking resistance. Standard black PE sheath is not specified for dry-band tracking resistance on high-voltage lines. [IEEE 1222 §5.3]
- **B — Incorrect.** ADSS cable on energized utility lines must be **fully dielectric** — a steel CSM is prohibited because it creates a metallic conductor on the energized line requiring bonding and grounding. GRP (fiberglass rod) or other dielectric CSM designs are correct. [IEEE 1222; ANSI/TIA-758-C §5.6.3]
- **C — Correct.** On a 7.2 kV energized line, ADSS cable must be specified with a **tracking-resistant sheath compound** per IEEE 1222 §5.3. Standard black PE provides UV resistance but is not formulated to resist dry-band arcing — partial discharges that erode the sheath surface over time when voltage differentials exist along the cable. Without tracking resistance, the PE sheath degrades progressively in the arc-exposed sections, eventually exposing the fiber core. [IEEE 1222 §5.3; ANSI/TIA-758-C §5.6.3]
- **D — Incorrect.** OFNR is an NEC Article 770 indoor cable designation. It is entirely inapplicable to outdoor aerial cable on a utility line — there is no NEC Article 770 flame-rating requirement for cable remaining outdoors on a utility pole. [NEC Article 770.179; ANSI/TIA-758-C §5.2]

---

**Q3.** A building owner wants to run fiber from the basement MDF room through a vertical riser shaft to the 8th floor IT closet, then through the plenum ceiling space to patch panels at each workstation cluster. What is the minimum NEC rating required for each segment?

- A) Riser segment: OFNR; Plenum segment: OFNR (same cable throughout)
- B) Riser segment: OFNR; Plenum segment: OFNP **[CORRECT]**
- C) Riser segment: OFNP; Plenum segment: OFNP (use highest rating throughout)
- D) Riser segment: OFN; Plenum segment: OFNR (standard upgrade for plenum)

*Rationale:*
- **A — Incorrect.** OFNR is not permitted in plenum air-handling spaces. The riser rating (UL 1666 vertical flame) is less stringent than the plenum rating (UL 910 Steiner tunnel), which also limits smoke density. OFNR cable in a plenum environment is a code violation. [NEC Article 770.179(A); UL 910]
- **B — Correct.** The riser shaft requires **OFNR** minimum (riser-rated, UL 1666 vertical flame test). The plenum ceiling space — which circulates supply or return air — requires **OFNP** (plenum-rated, UL 910 Steiner tunnel for both flame spread and smoke density). Two cable types are required for the two segments unless OFNP is used throughout (which is permitted under the substitution hierarchy). [NEC Article 770.179(A) and (C); UL 1666; UL 910]
- **C — Incorrect.** Running OFNP throughout is permitted (OFNP may substitute for OFNR per the substitution hierarchy) but is not the minimum required — only the plenum segment strictly requires OFNP. The answer to "minimum required" is B, not C. Using OFNP throughout is a valid design choice that simplifies cable management at the cost of higher material cost. [NEC Article 770.179(C)]
- **D — Incorrect.** OFN (general-purpose, UL 1581 VW-1) is not permitted in riser shafts — riser applications require OFNR or better. OFN is rated only for horizontal runs within a single floor. [NEC Article 770.179(A)]

---

**Q4.** A tight-buffer cable is labeled "OFNP / OFC" on the jacket. What does the "OFC" designation indicate, and what grounding requirement does it trigger inside the building?

- A) OFC indicates the cable contains optical fiber — it is a redundant designation and has no grounding implication
- B) OFC indicates the cable contains metallic elements; metallic elements must be grounded per NEC Article 770.100 **[CORRECT]**
- C) OFC indicates the cable is plenum-rated; the "C" stands for "ceiling" installation approval
- D) OFC indicates the cable is outdoor-rated; grounding is required at the building entry only

*Rationale:*
- **A — Incorrect.** OFC stands for "Optical Fiber Conductive" — the "C" specifically indicates that the cable contains metallic elements (steel armor, metallic strength member, or metallic vapor barrier). It is not a redundant designation; it triggers specific grounding requirements. [NEC Article 770.179(B)]
- **B — Correct.** "OFC" in the NEC Article 770 classification system designates that the cable contains metallic elements — typically a steel armor layer, metallic central strength member, or metallic vapor barrier. NEC Article 770.100 requires that these metallic elements be bonded to an electrical ground at the building entrance and at listed grounding blocks within the building. The OFNP designation still means the cable meets the UL 910 plenum flame/smoke test. [NEC Article 770.179(B); NEC Article 770.100]
- **C — Incorrect.** OFC's "C" stands for "Conductive" — the presence of metallic elements in the cable design. "Ceiling" is not an NEC cable classification. The plenum rating in this cable is conveyed by the "OFNP" designation (P = Plenum). [NEC Article 770.179(B)]
- **D — Incorrect.** OFC is not an outdoor rating — outdoor cable sheaths are governed by ANSI/TIA-758-C and IEC 60794 standards, not NEC Article 770. The OFC designation and the grounding requirement apply to the metallic elements within the cable wherever the cable is installed inside the building, not only at the building entry. [NEC Article 770.179(B); NEC Article 770.100]

---

**Q5.** MDPE and HDPE are both used as OSP cable sheath materials. What is the primary reason HDPE is specified for armored direct-bury cable over MDPE?

- A) HDPE is more resistant to UV radiation than MDPE and is required for aerial applications
- B) HDPE has higher density and greater crush resistance, making it more suitable for the mechanical stress of direct burial under armor **[CORRECT]**
- C) HDPE is less expensive per unit length than MDPE and is specified to reduce cable cost
- D) HDPE is the only polyethylene compound approved for use with corrugated steel tape armor by ANSI/TIA-758-C

*Rationale:*
- **A — Incorrect.** Both MDPE and HDPE are formulated with carbon-black UV stabilizer for outdoor use. UV resistance is not the distinguishing factor between the two grades. MDPE's moderate UV resistance is adequate for aerial applications; HDPE is not preferentially specified for aerial over MDPE based on UV performance. [IEC 60794-1-2, §F.5]
- **B — Correct.** HDPE (density 0.941–0.965 g/cm³) is stiffer and has higher tensile and impact strength than MDPE (density 0.926–0.940 g/cm³). For armored direct-bury cable, the outer sheath must resist abrasion during trench installation, stone contact during backfill compaction, and sustained soil overburden pressure. HDPE's greater stiffness and crush resistance make it the preferred sheath for the more mechanically demanding direct-bury environment. [AFL OSP Cable Design Guide, §5.1; ANSI/TIA-758-C §5.6]
- **C — Incorrect.** HDPE is not necessarily less expensive than MDPE — the cost per unit length of sheath compound is not the basis for the HDPE specification in armored cable. The specification is driven by mechanical performance requirements, not cost reduction. [AFL OSP Cable Design Guide, §5.1]
- **D — Incorrect.** ANSI/TIA-758-C does not prohibit MDPE sheath with CST armor — both MDPE and HDPE are acceptable with corrugated tape armor. The preference for HDPE in the most demanding direct-bury applications is a design best-practice driven by mechanical performance data, not a hard prohibition in the standard. [ANSI/TIA-758-C §5.6]

---

## Final Check

Answer before proceeding to Lesson 8 (Drop / Distribution / Feeder Hierarchy).

**Pulse 1.** State the maximum indoor penetration distance for unlisted PE-jacketed OSP cable under NEC Article 770, and describe the correct transition hardware.

*Expected answer:* **50 feet (15 meters)** is the maximum indoor run for unlisted PE-jacketed OSP cable under NEC Article 770.48(A). The correct transition hardware is a **listed building entrance terminal (BET)** or outside-plant transition closure, installed at the building exterior wall or just inside the penetration. Listed indoor cable (OFNR for riser, OFNP for plenum) connects from the BET to indoor equipment. If metallic elements are present in the OSP cable, they must be bonded to a ground electrode at the BET per NEC Article 770.100. [NEC Article 770.48(A); NEC Article 770.100; BICSI OSP-DRD Manual, Ch. 7.1]

**Pulse 2.** Rank the three NEC Article 770 flame ratings (OFN, OFNR, OFNP) from least to most stringent, and state the test standard for each.

*Expected answer (least to most stringent):*
1. **OFN** — General-purpose; tested per UL 1581 VW-1 vertical flame; horizontal runs within a floor only
2. **OFNR** — Riser-rated; tested per UL 1666 vertical flame; riser shafts and between floors
3. **OFNP** — Plenum-rated; tested per UL 910 Steiner tunnel (flame spread + smoke density); air-handling spaces
Higher-rated cable may substitute for lower-rated in any application; lower-rated may never substitute upward. [NEC Article 770.179; UL 910; UL 1666; UL 1581]

**Pulse 3.** What is dry-band arcing, and which cable property is required to resist it?

*Expected answer:* Dry-band arcing is a form of partial discharge that occurs on ADSS cable installed near energized utility conductors. When the cable sheath surface becomes contaminated (salt, pollution, bird droppings) and then partially dries, voltage differentials across the dry and wet zones cause arc discharges that progressively erode the sheath material. Over time, unresisted tracking can expose the fiber core and cause cable failure. The required cable property is **tracking resistance** — a sheath compound formulated to resist progressive surface erosion from repetitive arc events. Tracking-resistant sheath compounds for high-voltage ADSS applications are specified per IEEE 1222 §5.3. [IEEE 1222 §5.3; ANSI/TIA-758-C §5.6.3]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **PE / MDPE / HDPE sheath** → Lesson 4 (armored/aerial variants — PE sheath on all direct-bury designs), Lesson 6 (strand counts — sheath OD is a function of tube count and sheath wall thickness), Lesson 10 (cable selection by environment — sheath selection table by environment)
- **OFNP / OFNR / OFN ratings** → Lesson 10 (cable selection — OSP-to-premises transitions), Lesson 12 (compliance checklist — NEC Article 770 listing verification is a compliance checklist item)
- **Building entrance terminal (BET)** → Lesson 10 (environment-driven selection — BET as the OSP/premises demarcation), Lesson 12 (compliance checklist — BET grounding and bonding documentation)
- **OFC / grounding requirement** → Lesson 12 (compliance — NESC bonding at building entry for metallic-element cables), Lesson 4 (armored variants — CST armor grounding)
- **Tracking resistance (ADSS)** → Lesson 4 (armored/aerial — ADSS cable design for energized utility lines), Lesson 12 (compliance — IEEE 1222 compliance verification for ADSS installations)
- **NEC 50-foot transition rule** → Lesson 12 (compliance checklist — building entry compliance is an explicit ANSI/TIA-758-C §6.5 and NEC Article 770 checklist item)
