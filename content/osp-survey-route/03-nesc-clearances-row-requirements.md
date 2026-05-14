---
title: "Lesson 3.3: NESC Clearances and Right-of-Way Requirements"
duration_min: 25
topic: osp-survey-route
order: 3
bicsi_alignment:
  - "OSP-DRD Ch. 3.3: Route design — clearance requirements"
  - "OSP-DRD Ch. 6.3: Aerial construction clearances"
sources:
  - "NESC (National Electrical Safety Code) C2-2023, Rules 232, 234, 238"
  - "BICSI OSP-DRD Manual, Ch. 3.3 and Ch. 6.3"
  - "RUS Bulletin 1751F-630 §4 (ROW and easement requirements)"
  - "AASHTO Utility Accommodation Policy Manual (public)"
---

# NESC Clearances and Right-of-Way Requirements

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the minimum vertical clearances required by NESC C2-2023 for communication lines over roads, railroad tracks, and navigable waterways
- Apply the midspan clearance calculation to verify NESC compliance given attachment height, span length, and sag
- Distinguish between fee-simple ROW, utility easement, and joint-use agreement, and explain the construction access rights each provides
- Describe how local AHJ requirements interact with NESC minimums

---

## Reading Content

### NESC Clearances: The Governing Floor

The National Electrical Safety Code (NESC, published as ANSI C2) is the baseline standard governing the design, installation, and maintenance of electric supply and communication lines in the United States. For aerial OSP fiber cable, the NESC establishes minimum vertical and horizontal clearances that every route design must satisfy as an absolute floor — not a target, not a typical value, a minimum below which no compliant installation can fall.

The NESC is developed by the Institute of Electrical and Electronics Engineers (IEEE) and adopted by reference in most state public utility commission rules. State regulations may exceed NESC minimums; they cannot reduce them. The authority having jurisdiction (AHJ) — typically the state PUC, the local utility commission, or the railroad — determines which set of clearance requirements governs when state rules differ from NESC. [NESC C2-2023 Introduction; BICSI OSP-DRD Manual, Ch. 3.3]

Critical design principle: NESC clearances are measured at the **worst-case sag condition** — the maximum sag that occurs under full ice load and maximum temperature conditions for the applicable NESC loading district. A cable that clears 16 feet at stringing temperature may sag to 13 feet under heavy ice load if the sag was not correctly designed. Lesson 3.4 covers sag-tension design in detail; the clearance rules in this lesson are the targets that sag-tension design must satisfy.

### NESC Rule 232 — Vertical Clearances Above Ground

NESC Rule 232 and Table 232-1 establish minimum vertical clearances for communication conductors (which includes fiber optic cable) above ground and above objects below the line. Key values for communication lines (not supply conductors):

| Crossing type | NESC minimum clearance (communication conductors) |
|---|---|
| Over roads, streets, and alleys accessible to vehicles | **15.5 ft (4.72 m)** |
| Over driveways and parking areas | 15.5 ft (same as roads) |
| Over land not normally accessible to vehicles | 12.0 ft (3.66 m) |
| Over railroad tracks (rails as reference) | **26.5 ft (8.08 m)** for communication conductors |
| Over roofs of buildings | 8.0 ft, or as needed for safe access |

*Source: NESC C2-2023, Rule 232, Table 232-1.*

The 15.5 ft minimum over roads is the most frequently encountered clearance constraint in rural OSP design. It represents the height of a fully loaded agricultural vehicle with equipment raised, and it is non-negotiable at every road crossing and every span adjacent to a road where a vehicle could travel beneath the cable. Some state DOTs and local AHJs require 16 ft or more on arterial routes; confirm the local requirement against the NESC minimum.

The 26.5 ft railroad clearance is the minimum for communication conductors; supply conductors crossing railroads have higher minimums. Railroads typically specify clearance requirements in their permit applications that meet or exceed NESC minimums.

### NESC Rule 234 — Clearances Over Waterways

NESC Rule 234 governs clearance of aerial lines over navigable and non-navigable waterways. For communication conductors:

- **Over navigable waterways** (where federal navigation regulations apply): clearance is determined by the water surface at high water; contact the US Army Corps of Engineers (USACE) for the regulated high-water elevation and the applicable span clearance for the specific waterway. For most OSP crossing spans on small navigable waterways, NESC Rule 234 requires clearance above the high-water mark sufficient to allow safe navigation — typically the "clearance of existing bridges" standard for the waterway as defined by the USACE.
- **Over non-navigable bodies of water:** 15 ft (4.57 m) minimum above the water surface at the highest water level.
- **Over marshes, swamps, and areas inaccessible to traffic:** 12 ft minimum.

*Source: NESC C2-2023, Rule 234.*

The navigable-water classification is not intuitive — a small river that looks non-navigable may be federally designated as navigable based on historical navigation or federal jurisdiction. When a route crosses a waterway, confirm navigability status with the USACE before applying the simpler non-navigable standard. [BICSI OSP-DRD Manual, Ch. 6.3]

### NESC Rule 238 — Horizontal Clearances from Other Lines and Structures

NESC Rule 238 governs horizontal clearance of communication conductors from supply conductors (electric lines) and from structures. Key rules:

- **Horizontal separation from supply conductors:** Communication conductors on joint-use poles must be installed in the designated communication space below the supply conductors. The minimum horizontal separation depends on the supply voltage:
  - 0–8.7 kV: 12 in. (305 mm) minimum horizontal clearance
  - 8.7 kV–50 kV: 24 in. (610 mm) minimum
  - Greater than 50 kV: clearance per NESC Table 238-1

- **Communication space position on joint-use poles:** Communication conductors occupy the lowest tier of the utility space, below all supply conductors, above the minimum ground clearance requirement. The NESC "communication space" begins at 8 ft above ground for pedestrian-only areas and at 15.5 ft for vehicle-accessible areas. [NESC C2-2023, Rule 238; BICSI OSP-DRD Manual, Ch. 6.3]

These horizontal clearances are critical for joint-use pole attachment design — a fiber cable attached at the wrong height on a joint-use pole can violate NESC Rule 238 by being too close to the supply conductors in the horizontal plane.

### Midspan Clearance Calculation

Verifying NESC clearance at midspan requires combining three measurements:
1. **Attachment height** — the height of the cable attachment point (pole clamp) above the ground at the pole
2. **Sag** — the vertical distance the cable drops below the attachment point height at the midpoint of the span
3. **Ground elevation change** — if the ground profile under the span is not level, the clearance at midspan must account for the elevation of the ground at the midspan location

The clearance formula for a level-ground span:

**Midspan clearance = Attachment height − Sag**

Where:
- Attachment height is measured from the ground at the pole to the cable attachment
- Sag is the midspan vertical drop from the attachment height chord line (the straight line between the two attachment points)

For a span where the two attachment heights differ (a sloped terrain span), the chord-line method applies: sag is measured from the chord, not from each attachment point independently. Lesson 3.4 covers the catenary sag-tension calculation in full.

**Worked example:**

A communication cable is attached at 28 ft on each pole at the ends of a 250-ft span over a rural road. Under heavy NESC loading district ice load at 0°F, the sag is calculated at 9.5 ft (from manufacturer sag-tension table). Is NESC Rule 232 clearance satisfied?

- Midspan clearance = 28 ft − 9.5 ft = **18.5 ft**
- NESC minimum over roads = 15.5 ft
- 18.5 ft > 15.5 ft → **clearance satisfied** under heavy ice load

If the same span were redesigned with 25-ft attachment height:
- Midspan clearance = 25 ft − 9.5 ft = **15.5 ft**
- 15.5 ft = NESC minimum → passes, but with zero margin

Good design practice: maintain at least 2 ft of margin above the NESC minimum clearance at maximum ice load to account for measurement error, future span adjustments, and minor pole settlement. [NESC C2-2023, Rule 232; BICSI OSP-DRD Manual, Ch. 6.3]

### Right-of-Way: Types and Construction Rights

**Fee-simple ROW:** The route holder owns the land surface in the ROW corridor outright — full property ownership, not an easement. Public roads typically occupy fee-simple ROW owned by the government agency. Within a public road ROW, construction access is governed by the utility accommodation permit, not by property negotiation. [RUS Bulletin 1751F-630 §4]

**Utility easement:** A recorded right to use a defined strip of private property for a specific utility purpose (telecommunications, electric, pipeline). The property owner retains ownership; the easement holder has the right to construct, maintain, and operate the utility within the easement strip. An easement does not grant the right to install a different type of utility or expand beyond the easement strip without a new agreement. An OSP fiber cable requires a telecommunications easement — an electric easement does not automatically cover fiber cable. For RUS-financed projects, easements must use RUS-approved form language per RUS Bulletin 1751F-630 §4; state-law generic forms are insufficient for RUS loan package review. [RUS Bulletin 1751F-630 §4]

**Joint-use (co-location) agreement:** An agreement between two utilities allowing one utility's infrastructure to use the other's pole, conduit, or ROW. Joint-use poles are the most common application: an electric utility owns the pole, and a telecom utility attaches fiber cable under a joint-use agreement that specifies attachment height, loading contribution, and maintenance responsibility. Joint-use attachment positions must comply with NESC Rule 238. [NESC C2-2023, Rule 238; BICSI OSP-DRD Manual, Ch. 3.3]

Before a new joint-use attachment can be made, the pole owner performs a make-ready analysis to determine whether the existing pole can structurally carry the additional load. Make-ready costs for any required hardware relocations or pole reinforcements are typically borne by the attaching party and generally range from $500 to $2,000 per pole, though complex rearrangements can exceed this. NESC Rule 261 requires a pole loading analysis before any new attachment that changes the load distribution; if the existing pole cannot support the added load within its class rating, it must be replaced — again at the attaching party's expense. In addition to make-ready costs, annual FCC pole attachment fees apply on poles owned by investor-owned utilities subject to FCC jurisdiction; these are calculated per the FCC formula and typically run approximately $10 to $20 per pole per year. Budget planning for joint-use routes must account for both the up-front make-ready cost and the ongoing attachment fee obligation. [NESC C2-2023, Rules 238, 261; BICSI OSP-DRD Manual, Ch. 3.3]

**Permitted ROW vs. owned ROW:**

| Type | Route holder's rights | Construction access |
|---|---|---|
| Fee-simple (government road ROW) | None — utility is a permitted guest in government ROW | By utility accommodation permit from DOT/county |
| Utility easement | Perpetual right to use easement strip for specified utility | By easement terms; may require landowner notification |
| Joint-use agreement | Right to attach to host utility's infrastructure | By joint-use agreement terms; host utility may have approval rights |
| Permitted attachment on private property | Temporary permit; must be renewed | By permit terms |

The OSP designer must confirm the ROW/easement status of every segment of the proposed route during desk research and reconcile it with the construction access rights actually available before field survey. [RUS Bulletin 1751F-630 §4; AASHTO Utility Accommodation Policy Manual]

### AHJ Requirements and the NESC Relationship

NESC clearances are minimums. State PUC rules, railroad engineering standards, DOT utility accommodation requirements, and municipal ordinances may all specify clearances higher than the NESC minimum for specific crossing types. When designing an OSP route:

1. Identify the NESC minimum for each crossing type
2. Identify any state or AHJ requirement applicable to that crossing
3. Design to the **more stringent** of the two

Common AHJ exceedances:
- State DOTs on Interstate or NHS routes: 16.0 ft minimum (vs. 15.5 ft NESC)
- Railroads (Class I): 22.5–27.5 ft depending on carrier standards; check each carrier's current permit application requirements
- Municipal ordinances in urban areas: may require 16–18 ft over all vehicle-accessible areas

The difference between NESC minimum and AHJ requirement may seem small — 0.5 ft over a road — but failing to meet the AHJ requirement in a permit application can result in permit rejection and forced redesign of attachment heights after construction drawings are complete. Confirm AHJ requirements before finalizing attachment heights. [BICSI OSP-DRD Manual, Ch. 3.3; AASHTO Utility Accommodation Policy Manual]

---

## Key Terms (Flashcard Candidates)

**NESC C2-2023 Rule 232**
Establishes minimum vertical clearances of communication conductors above the ground and objects below. Key values: 15.5 ft over roads and vehicle-accessible areas; 26.5 ft over railroad tracks; 12 ft over land not normally accessible to vehicles. Clearances measured at maximum sag under full ice load for the applicable NESC loading district. [NESC C2-2023, Rule 232]

**NESC C2-2023 Rule 234**
Establishes clearances of aerial conductors over waterways. Navigable waterways: clearance determined by USACE high-water standard for the specific waterway. Non-navigable water: 15 ft minimum above the water surface at highest water level. [NESC C2-2023, Rule 234]

**NESC C2-2023 Rule 238**
Governs horizontal clearances between communication conductors and supply conductors on joint-use poles, and the positional hierarchy of utility space on poles. Communication conductors occupy the lowest tier of the utility space, below supply conductors. Minimum horizontal separation from supply conductors: 12 in. at 0–8.7 kV, 24 in. at 8.7–50 kV. [NESC C2-2023, Rule 238]

**Midspan clearance**
The vertical distance between the lowest point of a cable at midspan (at maximum sag under design ice load) and the ground or object below. Calculated as attachment height minus sag for a level-ground span. Must meet or exceed the NESC Rule 232 minimum for the crossing type. [NESC C2-2023, Rule 232; BICSI OSP-DRD Manual, Ch. 6.3]

**Authority having jurisdiction (AHJ)**
The regulatory body with enforcement authority over a given construction activity — state PUC, county highway department, railroad company, or USACE, depending on the crossing type. AHJ requirements may exceed NESC minimums; design must meet the more stringent of the two. [BICSI OSP-DRD Manual, Ch. 3.3]

**Fee-simple ROW**
Outright government ownership of the land in a road or utility corridor. Utility construction in fee-simple ROW requires a utility accommodation permit from the ROW owner, not a private easement negotiation. [RUS Bulletin 1751F-630 §4]

**Utility easement**
A recorded right to use a strip of private property for a specified utility purpose. The property owner retains title; the easement holder has construction and maintenance access within the easement strip. Fiber cable requires a telecommunications easement — electric or pipeline easements do not automatically cover fiber. [RUS Bulletin 1751F-630 §4]

**Joint-use (co-location) agreement**
An agreement between utilities permitting attachment of one utility's infrastructure to another's poles, conduit, or ROW. Joint-use pole attachments must comply with NESC Rule 238 communication-space position and horizontal clearance requirements. Before attachment, a make-ready analysis is required per NESC Rule 261; make-ready costs ($500–$2,000/pole typical) and annual FCC attachment fees (~$10–$20/pole/yr) are borne by the attaching party and must be budgeted before the route is committed. [NESC C2-2023, Rules 238, 261]

**Communication space**
The designated vertical zone on a joint-use utility pole where communication conductors (telephone, cable TV, fiber) must be installed per NESC. Below supply conductors, above minimum ground clearance. Position and separation distances governed by NESC Rule 238. [NESC C2-2023, Rule 238]

---

## Interactive: Drag-and-Drop — Match NESC Rule to Crossing Scenario

**[image:nesc-clearance-matching.svg]**

*Image description for SVG illustrator:*

A two-column layout. Left column: five clearance rule cards labeled A through E. Right column: five crossing scenario descriptions labeled 1 through 5.

Clearance rule cards:
- A: "Rule 232 — 15.5 ft minimum over vehicle-accessible roads"
- B: "Rule 232 — 26.5 ft minimum over railroad tracks"
- C: "Rule 234 — Clearance above high-water mark; contact USACE for navigable-water standard"
- D: "Rule 238 — Communication conductors below supply conductors in communication space; 12 in. min. horizontal at 0–8.7 kV"
- E: "Rule 232 — 12.0 ft minimum over land not normally accessible to vehicles"

Crossing scenarios:
1. Aerial fiber cable crossing a county gravel road, measured at maximum ice-load sag
2. ADSS cable on a joint-use pole shared with a 7.2 kV distribution line; cable attached 18 in. below the lowest supply conductor
3. Communication cable spanning over a federally designated navigable river; clearance to be verified at high-water stage
4. Aerial cable spanning a cornfield between two pole positions with no road, path, or water underneath
5. Communication cable crossing an active Class I freight railroad mainline

**Correct matches:** A→1, D→2, C→3, E→4, B→5

**Drag-and-drop mechanic:** Learner drags each rule card to the crossing scenario it governs. Correct placement highlights green with a one-sentence rationale; incorrect highlights red with the correct rule and a one-sentence explanation.

---

## Multiple-Choice Quiz

---

**Q1.** An aerial fiber cable is attached at 30 ft on each end pole of a 300-ft span over a two-lane state highway. The sag-tension table shows a maximum sag of 12.8 ft under heavy ice load at 0°F. Does this span satisfy NESC Rule 232?

- A) No — the minimum clearance over state highways is 18 ft, not 15.5 ft
- B) Yes — midspan clearance is 17.2 ft, which exceeds the 15.5 ft NESC Rule 232 minimum **[CORRECT]**
- C) No — midspan clearance is 12.8 ft, which is below the 15.5 ft minimum
- D) Yes — attachment height of 30 ft satisfies NESC regardless of sag

*Rationale:*
- **A — Incorrect.** NESC Rule 232, Table 232-1 sets the minimum for communication conductors over roads at **15.5 ft** — not 18 ft. Some state DOTs require 16 ft on certain highway categories, but the NESC minimum is 15.5 ft. [NESC C2-2023, Rule 232]
- **B — Correct.** Midspan clearance = attachment height − sag = 30 ft − 12.8 ft = **17.2 ft**. The NESC Rule 232 minimum for communication conductors over vehicle-accessible roads is 15.5 ft. 17.2 ft exceeds the minimum by 1.7 ft, so the span is compliant. The clearance is measured under maximum ice-load sag, which is the correct condition per NESC. [NESC C2-2023, Rule 232; BICSI OSP-DRD Manual, Ch. 6.3]
- **C — Incorrect.** 12.8 ft is the sag value, not the clearance. Clearance is the attachment height (30 ft) minus the sag (12.8 ft) = 17.2 ft. Sag and clearance are different quantities; confusing them is a common design error. [NESC C2-2023, Rule 232]
- **D — Incorrect.** Attachment height alone does not determine clearance. A 30-ft attachment with a 17-ft sag under ice load would give only 13 ft of clearance — below NESC minimum. Clearance is a function of attachment height AND sag under worst-case loading. [NESC C2-2023, Rule 232]

---

**Q2.** A fiber cable on a joint-use pole is to be attached 16 inches horizontally from the lowest supply conductor on the pole. The supply conductor operates at 7.2 kV. Is this attachment compliant with NESC Rule 238?

- A) Yes — 16 inches exceeds the 12-inch minimum for conductors up to 8.7 kV **[CORRECT]**
- B) No — the minimum horizontal clearance is 24 inches for all distribution voltages
- C) Yes — NESC Rule 238 only applies to supply conductors above 15 kV
- D) No — communication conductors must be at least 36 inches from supply conductors on joint-use poles

*Rationale:*
- **A — Correct.** NESC Rule 238 requires a minimum horizontal clearance of **12 inches (305 mm)** between communication conductors and supply conductors operating at 0–8.7 kV. A 7.2 kV supply conductor falls within this range. The proposed attachment at 16 inches horizontal clearance exceeds the 12-inch minimum and is NESC-compliant. [NESC C2-2023, Rule 238]
- **B — Incorrect.** The 24-inch minimum applies to supply voltages in the **8.7 kV to 50 kV** range, not to 7.2 kV distribution. At 7.2 kV (which is below 8.7 kV), the NESC minimum is 12 inches. [NESC C2-2023, Rule 238]
- **C — Incorrect.** NESC Rule 238 applies to all supply voltages, including distribution voltages below 15 kV. There is no voltage threshold below which horizontal clearance requirements are waived. [NESC C2-2023, Rule 238]
- **D — Incorrect.** A 36-inch minimum is not in NESC Rule 238 for the 7.2 kV range. The 12-inch minimum for 0–8.7 kV is the NESC requirement; some utilities specify larger clearances in their joint-use agreements (which would govern over the NESC minimum), but 36 inches is not a NESC requirement at this voltage. [NESC C2-2023, Rule 238]

---

**Q3.** An OSP designer is planning a fiber route that will cross a river. Desk research shows the river is listed in USACE records as federally navigable. What governs the minimum clearance for the aerial span over the river?

- A) NESC Rule 232 — 15.5 ft above the ordinary high-water mark
- B) NESC Rule 234 — navigable waterway standard; USACE determines the applicable high-water elevation and required clearance for this specific waterway **[CORRECT]**
- C) NESC Rule 238 — horizontal clearance rules apply to all waterway crossings
- D) No minimum — aerial fiber cable over water is not regulated by NESC

*Rationale:*
- **A — Incorrect.** NESC Rule 232 governs clearances over land and roads. Waterway crossings are governed by NESC Rule 234, which has its own clearance framework and distinguishes between navigable and non-navigable waterways. [NESC C2-2023, Rule 234]
- **B — Correct.** NESC Rule 234 governs aerial conductors over waterways. For federally navigable waterways, the clearance is not a fixed NESC table value — it is determined by the USACE based on the regulated high-water elevation for that specific waterway and the navigation clearance standards applicable there. The designer must contact the USACE to confirm the governing clearance for the span. This is in addition to any federal navigation permit requirements (Section 10 review). [NESC C2-2023, Rule 234; BICSI OSP-DRD Manual, Ch. 6.3]
- **C — Incorrect.** NESC Rule 238 governs horizontal clearances between conductors on poles (joint-use attachment), not clearances over waterways. [NESC C2-2023, Rule 238]
- **D — Incorrect.** Aerial fiber cable over navigable waterways is regulated by both NESC Rule 234 (clearance) and USACE permitting requirements (Section 10 for navigable waters). Neither requirement is optional. [NESC C2-2023, Rule 234]

---

**Q4.** A utility easement was originally recorded in 1987 for an electric distribution line along a rural section road. A telecom company wants to route a fiber cable through the same corridor using the recorded easement. What must the telecom company verify before beginning construction?

- A) Nothing — a recorded utility easement covers all utility types by definition
- B) The easement language specifies the type of utility covered; a 1987 electric easement almost certainly does not cover telecommunications fiber and a new telecommunications easement will be required **[CORRECT]**
- C) The easement expired in 2007 at the 20-year standard utility easement term
- D) Only RUS-funded projects require a separate telecommunications easement; commercial projects can use any existing recorded easement

*Rationale:*
- **A — Incorrect.** Utility easements are recorded for specific utility purposes. An electric distribution easement grants the right to install, operate, and maintain electric distribution infrastructure — it does not automatically grant rights to install telecommunications fiber. The easement language governs what is covered; most 1987 electric easements do not mention telecommunications. [RUS Bulletin 1751F-630 §4]
- **B — Correct.** Utility easements are purpose-specific. A 1987 electric distribution easement covers electric infrastructure. Installing a fiber cable in that corridor without a telecommunications easement is trespass on the underlying property, regardless of the existing electric easement. A new telecommunications easement must be negotiated and recorded. In some cases, if the electric utility has a broad "communications" or "public utility" easement, it may cover fiber — but this must be confirmed through a title search of the easement language, not assumed. [RUS Bulletin 1751F-630 §4; BICSI OSP-DRD Manual, Ch. 3.3]
- **C — Incorrect.** Utility easements are typically perpetual — they run with the land and do not expire. A 1987 easement is still legally valid and enforceable unless specifically released by the property owner. [RUS Bulletin 1751F-630 §4]
- **D — Incorrect.** The requirement for a telecommunications easement applies to all fiber installations on private property, regardless of funding source. RUS-funded projects have additional easement documentation requirements for loan/grant compliance, but the underlying legal requirement for a telecommunications easement is independent of RUS funding. [RUS Bulletin 1751F-630 §4]

---

## Final Check

Answer before proceeding to Lesson 3.4.

**Pulse 1.** A cable is attached at 29 ft on Pole A and 27 ft on Pole B at the ends of a 280-ft span over a county road. The sag-tension table shows 10.3 ft of sag under maximum ice load. Is NESC Rule 232 clearance satisfied, and how is midspan clearance calculated for a non-level span?

*Expected answer:* For a non-level span, sag is measured from the chord — the straight line connecting the two attachment points. The chord height at midspan = (29 + 27)/2 = 28 ft. Midspan clearance = chord height − sag = 28 ft − 10.3 ft = **17.7 ft**. NESC Rule 232 minimum over roads = 15.5 ft. 17.7 ft > 15.5 ft → clearance is satisfied. Note: this chord-midpoint method is an approximation appropriate for most engineering applications; a precise calculation uses the catenary equation with the actual elevation difference between the two attachment points. [NESC C2-2023, Rule 232; BICSI OSP-DRD Manual, Ch. 6.3]

**Pulse 2.** What is the difference between a utility easement and a joint-use agreement, and what NESC rule governs attachment position on a joint-use pole?

*Expected answer:* A utility easement is a recorded real-property right to use a strip of private land for a specified utility purpose — it grants construction access across the land. A joint-use agreement is a contract between two utilities allowing one to attach its infrastructure to the other's existing pole, conduit, or ROW — it governs the use of the host utility's infrastructure, not the underlying land. A fiber cable on a jointly used pole requires both a joint-use agreement (with the pole owner) AND an easement or ROW right (for the land the pole sits on). NESC Rule 238 governs joint-use pole attachment position: communication conductors must be in the designated communication space below supply conductors, with minimum horizontal separations of 12 in. (0–8.7 kV supply) and 24 in. (8.7–50 kV supply). [NESC C2-2023, Rule 238; RUS Bulletin 1751F-630 §4]

---

## Glossary Cross-References

- **NESC Rule 232 clearances** → Lesson 3.4 (aerial route design — sag-tension design must satisfy Rule 232 at maximum ice load); Lesson 3.8 (crossings — road and rail clearances directly govern crossing span design)
- **NESC Rule 234 (waterway clearances)** → Lesson 3.8 (crossings — water crossings are designed against Rule 234); Lesson 3.11 (permitting — navigable waterway crossings trigger USACE Section 10 review)
- **NESC Rule 238 (joint-use)** → Lesson 3.4 (aerial route design — joint-use pole attachment position affects available attachment height for clearance calculations)
- **Midspan clearance calculation** → Lesson 3.4 (aerial route design — worked span-length example uses midspan clearance as the design constraint)
- **Utility easement / joint-use agreement** → Lesson 3.11 (permitting — ROW type determines permit class required for construction access)
- **AHJ requirements** → Lesson 3.8 (crossings — railroad AHJ often requires clearances above NESC minimum); Lesson 3.11 (permitting — AHJ determines which permits apply)
