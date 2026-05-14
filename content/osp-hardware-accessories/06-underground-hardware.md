---
title: "Lesson 5.6: Underground Hardware — Handholes, Manholes, Pull Boxes, and Cable Racks"
duration_min: 30
topic: osp-hardware-accessories
order: 7
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.1: Underground telecommunications infrastructure"
  - "BICSI OSP-DRD Ch. 6.2: Handhole and manhole hardware"
sources:
  - "ANSI/SCTE 77 (Specification for Underground Enclosure Integrity)"
  - "AASHTO LRFD Bridge Design Specifications (H20/H25 vehicle load reference)"
  - "ANSI/TIA-758-C §6.2 (OSP underground infrastructure)"
  - "NEC Chapter 9 (Pull and junction box sizing — cross-ref T3 L3.5)"
  - "RUS Bulletin 1751F-635 §3"
  - "OSHA 1910.146 (Permit-required confined spaces — code pointer)"
  - "BICSI OSP-DRD Manual, Ch. 6.1–6.2"
---

# Underground Hardware — Handholes, Manholes, Pull Boxes, and Cable Racks

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the primary citation standard for telecom handhole and manhole load classification (ANSI/SCTE 77) and distinguish SCTE 77 class designations from AASHTO H-load terminology
- Select the correct ANSI/SCTE 77 class for a given installation environment (pedestrian, driveway, residential street, highway shoulder)
- Describe the complete BOM for a 4-conduit handhole installation including structure class, conduit transition fittings, and duct plugs
- Identify the OSHA 1910.146 code pointer for confined-space entry at manholes and state which topic owns the field procedure
- Apply the NEC Chapter 9 pull-box sizing cross-reference without re-deriving the 8×/6× formulas owned by T3 L3.5

> **Cross-reference:** Pull-box conduit fill sizing (8× and 6× conduit OD formulas) is established in T3 L3.5. Do not re-derive those formulas here — reference T3 L3.5 as authoritative. This lesson adds: structure class selection, conduit-transition fittings, and duct plugs as the BOM elements T3 does not cover.

> **OSHA 1910.146 pointer:** manhole entries are confined-space entries under OSHA 29 CFR 1910.146 (Permit-Required Confined Spaces). Full confined-space entry procedures are T9 scope. This lesson places a code-pointer only — do not teach the OSHA procedure here.

---

## Reading Content

### Why Load Classification Is the First Decision

Underground enclosures — handholes, manholes, and pull boxes — must survive the loading environment they are installed in for 20–40 years without structural failure. A handhole lid that fractures under a delivery truck's tire does not just damage the lid: it creates a fall hazard at the surface, exposes the cable plant to vehicle damage, and may damage cables in the structure below.

The load classification decision must be made before structure dimensions, lid type, or cover grade are selected. Once the loading environment is established, the ANSI/SCTE 77 class designation drives all other structural choices.

### ANSI/SCTE 77 — The Primary Telecom Citation

**ANSI/SCTE 77** — *Specification for Underground Enclosure Integrity* — is the American National Standard developed by the Society of Cable Telecommunications Engineers (SCTE) that defines load testing requirements for telecommunications underground enclosures. It is the primary citation standard for telecom handhole and manhole structural specification.

ANSI/SCTE 77 defines enclosure classes by their minimum load capacity, expressed in thousands of pounds (kilopounds, or kips). The class number corresponds to the rated load in kilonewtons under the SCTE 77 test protocol — but for field specification, the class is commonly stated as "ANSI/SCTE 77 Class X" where X is the class designation.

**Key ANSI/SCTE 77 classes and their typical deployment environments:**

| ANSI/SCTE 77 Class | Minimum Load Rating | Typical Environment |
|---|---|---|
| Class 1 | 2 kN (~450 lb) | Light pedestrian (sidewalks, planter areas, no vehicle access) |
| Class 5 | 22 kN (~5,000 lb) | Light vehicle (private driveways, parking lots with light vehicles) |
| Class 15 | 67 kN (~15,000 lb) | Standard residential street, light commercial traffic |
| Class 22.5 | 100 kN (~22,500 lb) | Highway shoulder and road crossing (equivalent to AASHTO H20 vehicle) |
| Class 36 | 160 kN (~36,000 lb) | Heavy highway crossing (equivalent to AASHTO H25 vehicle) |
| Class 50 | 222 kN (~50,000 lb) | Heavy industrial or port access roads |

*[ANSI/SCTE 77, Section 5 — load test classes; consult current SCTE 77 edition for exact values]*

> **Critical: "Tier 22" is NOT an ANSI/SCTE 77 citation.** "Tier 22" is a vendor shorthand used informally in some product catalogs (referring to 22,000-lb capacity). It does not appear in ANSI/SCTE 77 or AASHTO LRFD as a formal designation. Do not use "Tier 22" in specifications, drawings, or quiz [CORRECT] answers. The correct citation is "ANSI/SCTE 77 Class 22.5" for highway shoulder applications where the AASHTO H20 vehicle load governs.

### AASHTO H-Load Cross-Reference

When a handhole or manhole installation crosses a public highway, the Authority Having Jurisdiction (AHJ) — typically the state DOT or municipality — may require compliance with AASHTO H-load designations as a permit condition or for structural engineering documentation.

**AASHTO H-load terminology:**
- **H20 load** = a standard two-axle highway design truck with a maximum 20-ton (40,000 lb) gross vehicle weight (GVW), generating a maximum 16,000-lb rear axle load per wheel line. Used as the design vehicle for most secondary highway structures.
- **H25 load** = the same truck configuration at 25 tons GVW (50,000 lb), generating 20,000-lb per axle line. Used for primary interstate and heavy-freight routes.

**Mapping to ANSI/SCTE 77:**
- AASHTO H20 → **ANSI/SCTE 77 Class 22.5** (22,500 lb capacity, equivalent to H20 wheel line load with appropriate load distribution factor)
- AASHTO H25 → **ANSI/SCTE 77 Class 36** (36,000 lb capacity, equivalent to H25 wheel line load)

When a DOT permit requires AASHTO H20 compliance, specify **ANSI/SCTE 77 Class 22.5** on the engineering drawing — this is the telecom-industry standard equivalent. If the DOT requires AASHTO structural engineering certification (PE-stamped), consult AASHTO LRFD Bridge Design Specifications for the formal documentation. The SCTE 77 class is the product selection standard; AASHTO is the vehicle load reference used to establish the design event.

---

### Handhole, Manhole, and Pull-Box Distinctions

**Handhole:** A below-grade enclosure with a lid flush or near-flush with the surface, sized for hand-access only — technicians reach in from above but do not enter the structure. Standard for cable splice access, cable routing changes, and conduit junction points in distribution cable plant. Maximum inside depth varies by product line; handholes accessible only by hand reach (no entry) are typically 18–24 in. deep.

**Manhole:** A below-grade enclosure sized for worker entry. Per OSHA 1910.146, any enclosed space with a restricted means of entry or exit that is not designed for continuous occupancy is a confined space. **All manhole entries are confined-space entries.** Full confined-space entry procedures (permit, atmospheric testing, standby person, retrieval equipment) are T9 scope. This lesson notes the code pointer; do not perform manhole entries without following the T9 OSHA 1910.146 procedure. [OSHA 29 CFR 1910.146]

**Pull box:** An enclosure at a conduit-bend point or at maximum conduit fill-section intervals, used to access cables for pulling operations and to allow bending the conduit route without making the cable path impossible to pull. NEC Chapter 9 governs pull-box sizing — the 8× and 6× conduit OD rules are established in T3 L3.5 and are not re-derived here.

---

### Handhole Sizing for a 4-Conduit Bank

The interior dimensions of a handhole must accommodate:
1. **Conduit entry ports** on all sides where conduits enter
2. **Cable racking** — cable loop storage, slack coils, and splice closure mounting
3. **Working clearance** — enough interior space for a technician's hands and the tools needed to access the cable

**Conduit count determines minimum handhole plan dimensions.** For a 4-conduit bank (four 2-in. IPS conduits entering one side):

- Conduit OD (2-in. IPS): 2.375 in. each
- Center-to-center spacing (standard): 4 in. (allows for conduit-entry fittings and wall clearance)
- Required entry face width: 4 × 4 in. spacing = ~18–20 in. minimum interior width on the conduit-entry face

Standard commercial handholes for a 4-conduit bank are commonly specified at **24 × 36 × 18 in. (inside dimension)** — wide enough for 4-conduit entry, long enough for cable loop storage, and deep enough for a splice closure cradle or cable rack on the interior walls.

> **Pull-box sizing math (NEC Chapter 9):** the 8× and 6× conduit OD formulas (minimum box length = 8 × largest conduit OD for straight pulls; 6× for angular pulls) are taught in T3 L3.5. Reference T3 L3.5 for the sizing calculation on any handhole that also functions as a pull box. The structure class (ANSI/SCTE 77) is T5 scope; the conduit fill math is T3 scope.

---

### Conduit Transition Fittings and Duct Plugs

A complete handhole BOM includes the structural enclosure and the hardware at each conduit entry:

**Conduit transition fittings:** at each conduit entry into the handhole wall, a conduit coupling or bell-end fitting adapts the conduit to the handhole knockout opening. The fitting type depends on the conduit material (Schedule 40 PVC, HDPE, or Schedule 80 PVC) and the handhole's knockout geometry. Fittings must be watertight — any ground water infiltration through conduit entry fittings is a long-term cable plant reliability issue.

**Duct plugs:** for conduits not yet occupied by cable, duct plugs are inserted into the open conduit end inside the handhole. Duct plugs serve three purposes:
1. **Prevent rodent entry:** rodents entering a conduit system from a handhole can travel to cable splice closures and damage cable.
2. **Prevent water backflow:** groundwater entering an occupied handhole can travel through open conduits to the handhole at the other end of the run.
3. **Maintain pull-line integrity:** duct plugs keep pull lines (mule tape) or pre-installed pull lines clean and protected until cable is pulled.

Duct plugs must be sized to the conduit ID (not OD) and must be removable without tools for future cable placement operations.

---

### Cable Racks Inside Handholes

After cable is placed through the conduit system, slack cable and splice closures are stored inside the handhole on **cable racks** — horizontal brackets mounted to the handhole interior walls. Cable racks:
- Hold splice closures in the cradle hardware
- Store cable slack coils (minimum bend radius maintained — 10× cable OD for OS2 SMF)
- Keep conduit-entry cable loops from occupying the working clearance area

Cable rack vertical positions are set during handhole installation before backfill, since access to the interior walls is easiest before the structure is buried.

---

## Key Terms (Flashcard Candidates)

**ANSI/SCTE 77**
Primary telecom industry standard for underground enclosure structural integrity and load classification. Defines enclosure classes (1, 5, 15, 22.5, 36, 50, 90) by minimum load capacity in kilonewtons. Class designation is the correct citation format — do not substitute "Tier 22" or informal vendor terminology. [ANSI/SCTE 77]

**ANSI/SCTE 77 Class 22.5**
Rated for 100 kN (~22,500 lb) — the telecom-industry equivalent for AASHTO H20 vehicle loading at highway-shoulder installations. The correct [CORRECT]-answer phrasing for highway shoulder handhole specification.

**ANSI/SCTE 77 Class 36**
Rated for 160 kN (~36,000 lb) — the telecom-industry equivalent for AASHTO H25 vehicle loading at heavy highway crossings and primary freight routes.

**AASHTO H20 / H25**
AASHTO design vehicle standards: H20 (20-ton GVW, 16,000-lb rear axle per wheel line); H25 (25-ton GVW, 20,000-lb rear axle per wheel line). Used as the vehicle load reference for highway-crossing permit documentation. Map to ANSI/SCTE 77 Class 22.5 and Class 36 respectively for telecom enclosure specification.

**Handhole**
Below-grade telecom enclosure with surface-flush lid; sized for hand access only (no worker entry). Used for cable routing, splicing, and conduit junctions in distribution cable plant.

**Manhole**
Below-grade telecom enclosure sized for worker entry. Confined space under OSHA 29 CFR 1910.146. Requires permit, atmospheric testing, standby person, and retrieval equipment per T9 procedures before entry.

**Duct plug**
Removable plug inserted into open conduit ends inside a handhole to prevent rodent entry, water backflow, and pull-line contamination. Sized to conduit ID; tool-free removal required.

**Cable rack**
Interior bracket mounted to handhole or manhole walls to support splice closures, slack cable coils, and cable loop storage. Maintains minimum bend radius (10× OD for OS2 SMF).

**OSHA 1910.146**
Federal OSHA standard for permit-required confined spaces. All manhole entries trigger 1910.146 compliance. Full procedure is T9 scope; this lesson places the code pointer only.

---

## Interactive: Drag-and-Drop — ANSI/SCTE 77 Class to Environment

**[image:handhole-environment-selection.svg]**

*Five installation environments shown; learner drags the correct ANSI/SCTE 77 class card to each environment:*

1. Sidewalk in a residential subdivision, pedestrian traffic only → **Class 1**
2. Private residential driveway, personal vehicles only → **Class 5**
3. Residential street, normal automobile traffic → **Class 15**
4. State highway shoulder (AASHTO H20 design vehicle) → **Class 22.5**
5. Interstate highway crossing (AASHTO H25 design vehicle) → **Class 36**

*Correct placement: green highlight + citation. Incorrect: red highlight + one-line explanation.*

---

## Interactive: Scenario — Handhole BOM for 4-Conduit Bank

**Scenario:** A fiber distribution route requires a handhole at a 4-conduit junction point. The handhole is installed in a private parking lot (light vehicles, no truck access). Conduits: four 2-in. IPS PVC Schedule 40. One conduit is currently occupied with cable; three are spare.

Build the handhole BOM:

| BOM Item | Specification |
|---|---|
| Enclosure structural class | ANSI/SCTE 77 **Class 5** (22 kN / ~5,000 lb — private parking lot, light vehicle) |
| Interior dimensions | Minimum 24 × 36 × 18 in. (inside) for 4-conduit entry width |
| Lid | Class 5 traffic-rated lid matching enclosure model |
| Conduit entry fittings | 4 × 2-in. IPS conduit couplings or bell-end fittings (watertight) |
| Duct plugs | 3 × 2-in. IPS duct plugs (for three spare conduits), tool-free removal |
| Cable rack | 1 × interior cable rack bracket (for cable loop storage on occupied conduit) |
| Labeling | Handhole ID per TIA-606-C and RUS 1751F-630 §9 (see L5.12) |

*System: presents each BOM row for learner to confirm or select; reveals rationale with citation after each confirmation.*

---

## Quiz — Underground Hardware (5 Questions)

---

**Q1.** A handhole is being installed on a state highway shoulder where the design vehicle is AASHTO H20. Which ANSI/SCTE 77 class is the correct specification?

- A) Class 5 (22 kN — private driveway)
- B) Class 15 (67 kN — residential street)
- C) Class 22.5 (100 kN — highway shoulder, AASHTO H20 equivalent) **[CORRECT]**
- D) Tier 22 (highway-rated)

*Rationale:*
- **A — Incorrect.** Class 5 (22 kN / ~5,000 lb) is rated for light vehicle loading on private driveways. A state highway shoulder is subjected to AASHTO H20 vehicle loading — a 20-ton design truck — which exceeds Class 5 capacity by approximately 4.5×. A Class 5 structure on a highway shoulder is a structural failure risk.
- **B — Incorrect.** Class 15 (67 kN / ~15,000 lb) is appropriate for standard residential streets with normal automobile traffic. The AASHTO H20 design vehicle (40,000 lb GVW, 16,000 lb rear axle per wheel line) loads significantly exceed Class 15 capacity. Highway shoulder installations require the full H20-equivalent class.
- **C — Correct.** **ANSI/SCTE 77 Class 22.5** (100 kN / ~22,500 lb) is the telecom-industry standard enclosure class equivalent to the AASHTO H20 design vehicle load for highway-shoulder handhole installations. When AASHTO H20 compliance is required by the DOT permit, specify ANSI/SCTE 77 Class 22.5 on the engineering drawing. [ANSI/SCTE 77; AASHTO LRFD cross-ref]
- **D — Incorrect.** "Tier 22" is an informal vendor shorthand that does not appear in ANSI/SCTE 77 or AASHTO LRFD as a formal class designation. Using "Tier 22" in a specification or as a [CORRECT] quiz answer is incorrect because a procurement engineer checking ANSI/SCTE 77 or AASHTO will not find this term. The correct citation is **ANSI/SCTE 77 Class 22.5**. [ANSI/SCTE 77]

---

**Q2.** A manhole installation requires a worker to enter the structure to place cable racks. Which OSHA standard governs this entry, and which topic owns the full field procedure?

- A) OSHA 29 CFR 1910.147 (Lockout/Tagout); T8 owns the procedure
- B) OSHA 29 CFR 1910.146 (Permit-Required Confined Spaces); T9 owns the field procedure **[CORRECT]**
- C) OSHA 29 CFR 1926.502 (Fall protection); T5 owns the full entry procedure
- D) OSHA 29 CFR 1910.146 applies only to manholes with atmospheric hazards; standard manholes do not require a permit

*Rationale:*
- **A — Incorrect.** OSHA 29 CFR 1910.147 is the Lockout/Tagout (control of hazardous energy) standard — applicable to equipment de-energization, not confined space entry. Lockout/Tagout may be required in addition to 1910.146 if energized equipment is inside the manhole, but it is not the governing standard for the entry itself.
- **B — Correct.** OSHA 29 CFR 1910.146 — *Permit-Required Confined Spaces* — governs worker entry into any enclosed space with a restricted means of entry or exit that is not designed for continuous occupancy. All telecom manholes meet this definition. Full confined-space entry procedures (entry permit, atmospheric testing for O₂/combustible/toxic gases, standby person, retrieval system) are **T9 (field operations) scope**. This lesson places the code pointer only — do not perform manhole entries without the T9 OSHA 1910.146 procedure. [OSHA 29 CFR 1910.146]
- **C — Incorrect.** OSHA 29 CFR 1926.502 is the fall protection standard for construction sites — applicable to work at heights, not below-grade confined space entry. Fall protection may be required for workers at the manhole rim, but 1910.146 governs the entry itself.
- **D — Incorrect.** OSHA 1910.146 applies to all permit-required confined spaces — the standard does not require evidence of atmospheric hazard before triggering permit requirements. A manhole is presumed to be a permit-required confined space until a competent person confirms it does not meet the criteria. In practice, most telecom manholes are treated as permit-required because atmospheric hazards (O₂ deficiency, sewer gas migration, combustible gas accumulation) can develop even in manholes without fixed gas sources.

---

**Q3.** What is the primary function of duct plugs in a handhole with spare conduit ends?

- A) To permanently seal spare conduits that will never be used for future cable placement
- B) To prevent rodent entry, water backflow, and pull-line contamination in unoccupied conduits **[CORRECT]**
- C) To provide the structural support that prevents conduit collapse under surface loading
- D) To increase the ANSI/SCTE 77 load class of the handhole by reinforcing the conduit entries

*Rationale:*
- **A — Incorrect.** Duct plugs are **removable** — they are not permanent seals. The defining characteristic of a correctly specified duct plug is tool-free removal to allow future cable placement. Permanently sealing a conduit abandons the infrastructure investment in that conduit for the plant's remaining design life.
- **B — Correct.** Duct plugs serve three active functions in unoccupied conduits: (1) **rodent exclusion** — preventing small animals from entering the conduit system and reaching cable splice closures; (2) **water backflow prevention** — blocking groundwater that infiltrates the handhole from flowing through open conduit ends to adjacent structures; (3) **pull-line protection** — keeping pre-installed mule tape or pull lines clean and free from debris until cable pulling operations begin. [BICSI OSP-DRD Ch. 6.2; RUS 1751F-635 §3]
- **C — Incorrect.** Conduit structural integrity under surface loading is determined by the conduit material (Schedule 40 or Schedule 80 PVC, HDPE) and burial depth — not by duct plugs. Duct plugs provide no structural contribution to the conduit's resistance to surface loading.
- **D — Incorrect.** ANSI/SCTE 77 class is determined by the enclosure structure (concrete, polymer, or cast iron lid rated for the specified load class), not by conduit entry fittings or duct plugs. Duct plugs do not affect the structural rating.

---

**Q4.** A handhole is installed in a private parking lot with light-vehicle access. Two years later, the property owner converts the parking lot to a loading dock with regular truck access. What remediation is required?

- A) No action; the original ANSI/SCTE 77 class is acceptable for any vehicle type
- B) Replace the handhole lid only; the structure below grade is adequate for truck loading
- C) The entire handhole structure (and lid) must be upgraded to the ANSI/SCTE 77 class appropriate for truck loading in the new environment **[CORRECT]**
- D) Install a steel plate over the existing handhole lid to distribute the truck load

*Rationale:*
- **A — Incorrect.** ANSI/SCTE 77 class selection is specific to the vehicle loading environment. A Class 5 handhole (private parking lot — ~5,000 lb) cannot withstand repeated truck axle loads, which can exceed 40,000 lb GVW under H20 conditions. Leaving a Class 5 structure in a truck-access area is a structural failure and safety hazard.
- **B — Incorrect.** The lid and the below-grade structural enclosure are both part of the ANSI/SCTE 77 classification. A Class 5 lid on a Class 5 concrete base — even with a heavier lid — does not produce a code-compliant Class 15 or Class 22.5 installation. The full structure must be replaced.
- **C — Correct.** Changing the loading environment from light-vehicle to truck access requires upgrading the entire handhole to the ANSI/SCTE 77 class appropriate for the new loading condition — at minimum Class 15 (67 kN / ~15,000 lb) for standard truck access, or Class 22.5 if heavy trucks or regular tractor-trailer access is anticipated. Both the enclosure body and the lid must meet the higher class rating. [ANSI/SCTE 77; BICSI OSP-DRD Ch. 6.2]
- **D — Incorrect.** A steel plate can distribute surface load across a larger area, reducing peak pressure on the lid — this is an emergency temporary measure at best. It does not certify the structure to a higher ANSI/SCTE 77 class. The load on the structure below the lid (the concrete walls and base) is not changed by the plate; a Class 5 concrete structure loaded with truck axle weight will still fail structurally regardless of lid distribution.

---

**Q5.** Which of the following correctly states the relationship between "Tier 22" and ANSI/SCTE 77 Class 22.5?

- A) They are identical designations from the same standard
- B) "Tier 22" is the AASHTO designation; Class 22.5 is the SCTE 77 designation for the same load rating
- C) "Tier 22" is an informal vendor shorthand; ANSI/SCTE 77 Class 22.5 is the correct formal citation **[CORRECT]**
- D) Class 22.5 is a higher load rating than Tier 22

*Rationale:*
- **A — Incorrect.** "Tier 22" does not appear in ANSI/SCTE 77 as a class designation. SCTE 77 uses numeric class designations (1, 5, 15, 22.5, 36, 50, 90). They are not identical designations from the same standard.
- **B — Incorrect.** AASHTO LRFD uses H-load designations (H15, H20, H25) — not "Tier" designations. "Tier 22" is not an AASHTO term. AASHTO LRFD does not reference telecom handhole enclosures directly; it defines the design vehicle loads used as inputs when specifying enclosures that must resist highway vehicle loading.
- **C — Correct.** "Tier 22" is an informal vendor shorthand — seen in some manufacturer product catalogs referring to approximately 22,000-lb capacity — but it does not appear in ANSI/SCTE 77 or AASHTO LRFD as a formal class designation. When a procurement engineer or permit reviewer checks ANSI/SCTE 77 for "Tier 22," they will not find it. The correct formal citation for a highway-shoulder handhole equivalent to AASHTO H20 vehicle loading is **ANSI/SCTE 77 Class 22.5**. [ANSI/SCTE 77; T5 Brief §3 D-L56]
- **D — Incorrect.** The load rating of 22,000 lb (informal "Tier 22") is approximately the same as ANSI/SCTE 77 Class 22.5 (~22,500 lb). They are not different load levels; the difference is one of terminology formality — vendor shorthand vs. the published standard class designation.

---

## Final Check: Pulse Questions

**Pulse 1.** A handhole is required at a state highway shoulder crossing where the permit authority specifies AASHTO H20 compliance. State the correct ANSI/SCTE 77 class, explain why "Tier 22" is not an acceptable specification term, and identify the AASHTO reference it corresponds to.

*Expected answer:* Specify **ANSI/SCTE 77 Class 22.5** — the telecom-industry standard class equivalent to AASHTO H20 vehicle loading (~22,500 lb / 100 kN). "Tier 22" is an informal vendor shorthand that does not appear in ANSI/SCTE 77 or AASHTO LRFD as a formal designation; a procurement engineer or DOT reviewer checking the standard will not find the term. The AASHTO H20 design vehicle is a two-axle truck with 20-ton (40,000 lb) GVW; ANSI/SCTE 77 Class 22.5 is the telecom enclosure class that provides equivalent structural resistance to that vehicle load. [ANSI/SCTE 77; AASHTO LRFD]

**Pulse 2.** Build the four-item BOM for a handhole at a 4-conduit junction point in a private parking lot, specifying structure class, conduit fittings, duct plugs, and cable rack. Identify which T5 lesson governs pull-box conduit sizing.

*Expected answer:*
1. **Enclosure:** ANSI/SCTE 77 **Class 5** (22 kN / ~5,000 lb — private parking lot, light vehicle loading); minimum 24 × 36 × 18 in. interior dimensions for 4-conduit entry
2. **Conduit entry fittings:** 4 × 2-in. IPS watertight conduit couplings or bell-end fittings at each conduit entry port
3. **Duct plugs:** one per spare conduit (3 × 2-in. IPS duct plugs for unoccupied conduits), tool-free removal
4. **Cable rack:** interior bracket for cable loop storage and splice closure cradle, set at installation before backfill
- **Pull-box conduit sizing (8× / 6× OD formulas):** **T3 L3.5** — do not re-derive here.

---

## Glossary Cross-References

- **Pull-box sizing (NEC Ch. 9 — 8×/6× OD formulas)** → T3 L3.5 is authoritative; cross-reference only
- **Conduit burial depth and cover** → T3 L3.5 and T3 L3.6; not re-taught here
- **OSHA 1910.146 confined-space procedures** → T9 (field operations); code pointer only in this lesson
- **FDH approach conduit (L5.9):** when sizing handholes at the approach conduit entry to an FDH, apply ANSI/SCTE 77 Class 5 (private property approach) or Class 22.5 (road shoulder) as the deployment location dictates; FDH port sizing math is in L5.9 using the correct subscriber × 1.20 formula
- **Labeling and identification** → TIA-606-C path ID and marker post intervals are L5.12 scope; handhole ID labeling is part of the L5.12 BOM
- **T6 L6.7** — FDH housing grounding; does not apply to handholes without active equipment
