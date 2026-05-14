---
title: "Lesson 4.2a: NESC Part 2 — Clearances"
duration_min: 25
topic: osp-domain-4-standards-codes
order: 2
bicsi_alignment:
  - "OSP-DRD Ch. 2.2: NESC Part 2 overhead line requirements"
  - "OSP-DRD Ch. 6.3: Aerial construction design"
sources:
  - "NESC C2-2023, Rules 230–238, Tables 232-1, 234-1"
  - "BICSI OSP-DRD Manual, Ch. 2.2, 6.3"
  - "RUS Bulletin 1751F-630, §4"
---

# NESC Part 2 — Clearances

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the scope conditions under which NESC Part 2 Rules 230–231 apply to a communication conductor
- Look up the correct row in NESC Table 232-1 for a given crossing type and voltage class, and extract the minimum midspan clearance value
- Execute the 6-step midspan clearance calculation for a proposed span
- Identify the Rule 232 exception for spans ≤ 50 ft over non-vehicle-accessible land
- State what Rule 238 governs and why it constrains communication cable attachment height on joint-use poles

> **Cross-Reference:** Sag derivation from first principles is covered in T3 L3.4 (Aerial Route Design). This lesson provides the NESC code-structure basis for the clearance target used in that derivation — do not re-derive here. Rule numbers and table citations in this lesson are the code authority for the clearance values T3 L3.4 applies.

---

## Reading Content

### Rules 230–231: When Part 2 Applies

NESC Part 2 Rules 230 and 231 establish the foundational scope of the overhead-line safety requirements. Rule 230 states the general loading requirements for aerial conductors. Rule 231 specifies that Part 2 applies to:

- Supply conductors (electric) and their supporting structures
- Communication conductors and equipment
- The associated supporting structures, including joint-use poles

**The key applicability scope:** Part 2 applies when a communication conductor is installed on a structure that also carries supply conductors (joint-use), or on a utility-owned structure in a utility ROW, or on any structure governed by a utility's operational jurisdiction. [NESC C2-2023, Rules 230–231]

Private-easement campus OSP that does not attach to any utility pole or structure is outside Part 2 scope — TIA-758-C governs. The moment a cable attaches to a joint-use pole, Part 2 rules apply to the full aerial run associated with that structure. See L4.1 conflict-resolution framework for the applicability trigger.

### Rule 232: Vertical Clearances from Ground

NESC Rule 232 establishes the minimum vertical clearance from the ground (or other surface below) that communication conductors must maintain at their lowest point — which occurs at **maximum sag**, which occurs under the design loading condition for the applicable NESC loading district (Part 2, Rules 250–252).

**NESC Table 232-1** is the clearance lookup table. It is organized by:
- **Crossing type / surface below** (rows): roads open to commercial traffic, trackways, water surfaces, land not normally accessible to vehicles, etc.
- **Voltage class of supply conductors on the same structure** (columns): 0–750 V, 751 V–22 kV, etc.

For communication conductors on joint-use poles with distribution-class supply (750 V–22 kV), the Table 232-1 clearance over roads open to commercial traffic is **15.5 ft** for the 0–750 V supply class row (the communication conductors themselves carry negligible voltage; the clearance is governed by the road-crossing type, not the communication cable voltage). [NESC C2-2023, Rule 232, Table 232-1]

> **Conflict-Resolution callout:** If TIA-758-C also applies (private easement segment with joint-use pole), check TIA-758-C §6.2 for its clearance requirement over roads. Apply more-restrictive per L4.1 Rule 1.

**Key clearance values from NESC C2-2023 Table 232-1 (communication conductors):**

| Crossing type | Minimum clearance (communication conductors, ≤750 V supply) |
|---|---|
| Roads open to commercial traffic (major) | 15.5 ft |
| Roads open to commercial traffic (minor) | 15.5 ft |
| Driveways and private roads | 15.5 ft |
| Trackways (railroad main track) | 22.0 ft (see also Table 234-1 for railroad clearances) |
| Water surfaces — used for sailboating | 18.0 ft |
| Water surfaces — not used for sailboating | 15.0 ft |
| Land not normally accessible to vehicles | 12.0 ft |
| Spaces and ways for pedestrian use only | 10.0 ft |

*Values are for NESC C2-2023. Confirm the applicable edition with the AHJ before final design. Values may differ in prior editions.*

**The 50-ft Exception (Rule 232):**
Over land not normally accessible to vehicles, Rule 232 provides an exception: for spans of **50 ft or less**, the required clearance is reduced to **10.0 ft** rather than 12.0 ft. This exception applies only to the non-vehicle-accessible category. Over roads, no such exception exists — 15.5 ft applies regardless of span length. [NESC C2-2023, Rule 232]

### Rule 234: Railroad Crossings

Rail crossings have their own clearance table, NESC Table 234-1, because the vertical clearance requirement depends on whether the rail line is electrified and the voltage of the electrification. For unelectrified railroads (typical short-line carriers in rural Georgia), communication conductors must clear the top of the rail by **22.0 ft** minimum under NESC C2-2023 Table 234-1. This is significantly higher than the road-crossing value because of the potential for tall equipment (grain cars, intermodal containers) and the catastrophic consequences of contact. [NESC C2-2023, Rule 234, Table 234-1]

### Rule 238: Communication Space on Joint-Use Poles

Rule 238 defines the **communication space** — the designated vertical zone on a joint-use pole where communication conductors must be attached, below all supply conductors and above the minimum NESC ground clearance.

The communication space top is governed by the horizontal clearance requirement from the nearest supply conductor above. Specifically, communication conductors must maintain vertical separation from supply conductors of **40 in. (3.33 ft)** minimum for supply at 750 V or below, and **48 in. (4.0 ft)** minimum for supply at 751 V–8.7 kV (distribution class). [NESC C2-2023, Rule 238]

**Why this constrains attachment height:** On a joint-use pole where the lowest supply conductor is at, say, 27 ft above grade, the maximum communication attachment height is 27 − 4.0 ft = **23.0 ft** (for distribution-class supply at 751 V–8.7 kV). This caps the attachment height available for the communication cable, directly limiting the span length achievable while maintaining the Rule 232 road-crossing clearance. See T3 L3.4 for the sag-tension arithmetic that links these constraints.

---

### Worked Example: 6-Step Midspan Clearance Calculation

**Scenario:** An aerial communication cable is proposed for a 175-ft span over a road open to commercial traffic. Attachment height at both poles is 30 ft above grade. Final sag (per manufacturer sag-tension table, NESC Light loading district) is 3.8 ft.

**Step 1 — Identify crossing type and look up Table 232-1 row.**
Crossing type: road open to commercial traffic. Supply voltage on joint-use poles: distribution class (750 V–22 kV). Table 232-1 row: "Roads open to commercial traffic." [NESC C2-2023, Table 232-1]

**Step 2 — Extract minimum clearance from Table 232-1.**
From Table 232-1, communication conductors over roads open to commercial traffic: **15.5 ft**. [NESC C2-2023, Table 232-1]

**Step 3 — Confirm final sag is used (not initial sag).**
Sag value = 3.8 ft. This is the final sag from the manufacturer's sag-tension table (accounts for creep). Using final sag is mandatory — NESC clearance must be maintained throughout the cable's service life. [NESC C2-2023, Rule 232; see T3 L3.4]

**Step 4 — Calculate midspan cable height at maximum sag.**
Midspan cable height = Attachment height − Sag = 30 ft − 3.8 ft = **26.2 ft**

**Step 5 — Calculate clearance margin.**
Clearance = Midspan cable height − 0 ft (ground reference) = **26.2 ft**
Required clearance (from Step 2): 15.5 ft
Margin = 26.2 ft − 15.5 ft = **10.7 ft**

**Step 6 — State compliance determination and note.**
The proposed 175-ft span with 30-ft attachment height and 3.8 ft final sag provides **26.2 ft midspan clearance** over the road. Required minimum is **15.5 ft** (NESC C2-2023 Table 232-1, roads open to commercial traffic, communication conductors). The span satisfies NESC Rule 232 with **10.7 ft of margin** — generous clearance that indicates this span could be extended before clearance becomes the binding constraint.

*Note: The margin of 10.7 ft signals that attachment height (30 ft) or the cable's low sag (3.8 ft at 175 ft) — or both — are well within capacity for this crossing. In practice, the engineer would also check the pole loading analysis (NESC Rule 261) and the communication space geometry (Rule 238) before extending span lengths.* [NESC C2-2023, Rules 232, 238, 261; BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630, §4]

---

## Key Terms (Flashcard Candidates)

**NESC Rule 230**
General loading requirements for aerial conductors under NESC Part 2. Establishes that aerial communication lines must be designed to withstand the design ice and wind loads of the applicable NESC loading district (Part 2, Rules 250–252). Foundation rule for the Part 2 engineering requirements.

**NESC Rule 231**
Scope rule for NESC Part 2. Specifies applicability to supply and communication conductors and their supporting structures on utility ROW and joint-use facilities. The trigger rule that makes Part 2 clearances and loading requirements binding on a joint-use communication cable installation.

**NESC Rule 232 / Table 232-1**
Vertical clearance requirements for overhead lines from ground, water, and other surfaces. Table 232-1 organizes minimum clearance by crossing type (road, railroad, water, land) and voltage class. Key value: 15.5 ft over roads open to commercial traffic for communication conductors. [NESC C2-2023]

**50-ft exception (Rule 232)**
Over land not normally accessible to vehicles, spans ≤ 50 ft may use a reduced clearance of 10.0 ft (versus 12.0 ft for longer spans). Applies only to non-vehicle-accessible land crossings — not roads, driveways, or trackways.

**NESC Rule 234 / Table 234-1**
Railroad crossing clearances. More stringent than road-crossing clearances due to tall rolling stock and electrification hazards. Unelectrified railroad: 22.0 ft minimum clearance above top of rail for communication conductors. [NESC C2-2023]

**NESC Rule 238**
Communication space on joint-use poles. Defines the vertical zone (below supply conductors, above NESC minimum ground clearance) where communication conductors must attach. Separation from supply: 40 in. for supply ≤ 750 V; 48 in. for supply 751 V–8.7 kV. This constrains the attachment height available to the communication cable.

**Final sag**
The sag value accounting for creep elongation of cable strength members over the design service life. NESC clearances must be maintained at final sag, not only at initial installed sag. The relevant column in manufacturer sag-tension tables for clearance verification. [IEEE 1222 §5.2; see T3 L3.4]

**Midspan clearance**
The vertical distance between the lowest point of the cable at maximum sag and the ground (or surface) below. Calculated as: Attachment height − Final sag = Midspan cable height; Midspan clearance = Midspan cable height − surface elevation. Must meet or exceed the applicable Table 232-1 value.

**Communication space**
The vertical zone on a joint-use pole reserved for communication conductors. Bounded below by NESC minimum ground clearance and above by the required separation from the nearest supply conductor. Attachment height for communication cable = top of communication space. [NESC C2-2023, Rule 238]

---

## Interactive: Drag-and-Drop — Clearance Arrows on Aerial Cross-Section

**Activity description for Moodle implementation:**

The learner is shown an aerial cross-section diagram of a joint-use pole and cable. Five measurement arrows are shown unlabeled. The learner drags the correct label from a sidebar to each arrow position.

| Arrow position | Correct label |
|---|---|
| Ground to lowest point of cable at maximum sag | Midspan clearance |
| Pole attachment point to ground | Attachment height |
| Highest point of catenary arc minus lowest point | Sag |
| Lowest supply conductor to communication conductor attachment | Communication space separation (Rule 238) |
| Ground to road surface (same grade in this example: 0 ft) | Ground reference |

*Note for SVG illustrator: Draw a utility pole on the left, attachment height labeled at 28 ft. Cable sags down toward midspan (visible arc). A road passes under the midspan. The lowest supply conductor is at 30 ft (above the communication attachment at 26 ft). Arrows point to each measurement interval.*

---

## Multiple-Choice Quiz

---

**Q1.** A communication cable on joint-use utility poles crosses a road open to commercial traffic. The designer looks up NESC C2-2023 Table 232-1. Which row and column correctly identifies the minimum clearance for this crossing?

A) Row: "Land not normally accessible to vehicles"; Column: communication conductor voltage class (0 V); Clearance: 12.0 ft

B) Row: "Roads open to commercial traffic"; Column: supply conductor voltage class on joint-use pole (750 V–22 kV); Clearance: 15.5 ft **[CORRECT]**

C) Row: "Roads open to commercial traffic"; Column: communication conductor voltage class; Clearance: 10.0 ft

D) Row: "Trackways"; Column: supply conductor voltage class; Clearance: 22.0 ft

*Rationale:*
- **A — Incorrect.** The row must match the crossing type — a road open to commercial traffic, not non-vehicle-accessible land. Using the wrong row produces the wrong clearance value (12.0 ft vs. the required 15.5 ft), which would result in a non-compliant design. [NESC C2-2023, Table 232-1]
- **B — Correct.** Table 232-1 row selection is based on the type of surface below the conductor. "Roads open to commercial traffic" is the correct row for a public road crossing. The column represents the supply conductor voltage class on the shared pole structure — for distribution-class supply, the 750 V–22 kV column applies. Minimum clearance: **15.5 ft**. The communication conductor's own voltage (essentially 0 V) is not what drives the column selection — the supply conductor voltage on the joint-use structure governs. [NESC C2-2023, Rule 232, Table 232-1]
- **C — Incorrect.** 10.0 ft is the clearance over pedestrian-only spaces, not roads open to commercial traffic. 10.0 ft would be lethal clearance on a road where commercial trucks operate. [NESC C2-2023, Table 232-1]
- **D — Incorrect.** The "Trackways" row and 22.0 ft clearance apply to railroad crossings, governed by Rule 234 and Table 234-1 — not to road crossings. Using railroad clearance values on a road crossing would be over-designed but would use the wrong code provision. [NESC C2-2023, Rule 234, Table 234-1]

---

**Q2.** Using the worked-example 6-step method: a 200-ft span over a private driveway has attachment height 28 ft and final sag 4.5 ft. The supply voltage on the joint-use poles is 4 kV. What is the midspan clearance, does it satisfy NESC Rule 232, and what is the margin?

A) Midspan clearance = 23.5 ft; NESC minimum = 12.0 ft; margin = 11.5 ft — compliant

B) Midspan clearance = 23.5 ft; NESC minimum = 15.5 ft; margin = 8.0 ft — compliant **[CORRECT]**

C) Midspan clearance = 23.5 ft; NESC minimum = 22.0 ft; margin = 1.5 ft — compliant but at railroad-crossing standard

D) Midspan clearance = 32.5 ft; NESC minimum = 15.5 ft; margin = 17.0 ft — compliant

*Rationale:*
- **A — Incorrect.** The midspan clearance arithmetic is correct (28 − 4.5 = 23.5 ft), but 12.0 ft is the minimum for land not normally accessible to vehicles — not for a private driveway. Private driveways appear in the "Driveways and private roads" row of Table 232-1, which carries a 15.5 ft minimum. Using the wrong row understates the NESC requirement. [NESC C2-2023, Table 232-1]
- **B — Correct.** Step-by-step: (1) Crossing type = private driveway → Table 232-1 row "Driveways and private roads." (2) Minimum clearance = **15.5 ft** (Table 232-1). (3) Final sag confirmed: 4.5 ft. (4) Midspan cable height = 28 − 4.5 = **23.5 ft**. (5) Clearance = 23.5 ft; margin = 23.5 − 15.5 = **8.0 ft**. (6) Compliant. Note: 4 kV is within the 750 V–22 kV column of Table 232-1; clearance value remains 15.5 ft for driveways. [NESC C2-2023, Rule 232, Table 232-1]
- **C — Incorrect.** 22.0 ft is the clearance requirement for railroad crossings (Rule 234, Table 234-1), not private driveways. A private driveway is not a trackway. [NESC C2-2023, Rules 232, 234]
- **D — Incorrect.** 32.5 ft is derived by adding the attachment height and the sag (28 + 4.5 = 32.5 ft) rather than subtracting sag from attachment height. Midspan cable height = attachment height − sag (the cable hangs down by the sag amount below the attachment point). [NESC C2-2023, Rule 232]

---

## Final Check: Pulse Questions

**Pulse 1.** State the minimum midspan clearance required by NESC C2-2023 Table 232-1 for a communication cable crossing a road open to commercial traffic, and explain which standard drives the column selection in the table.

*Expected answer:* NESC C2-2023 Table 232-1 requires **15.5 ft** minimum clearance over roads open to commercial traffic for communication conductors on joint-use poles with distribution-class supply. The column is selected based on the **supply conductor voltage class on the joint-use structure** (e.g., 750 V–22 kV for distribution class), not the communication conductor's own voltage. [NESC C2-2023, Rule 232, Table 232-1]

**Pulse 2.** A joint-use pole has its lowest supply conductor at 29 ft above grade. Supply voltage is 7.2 kV. What is the maximum attachment height for a communication cable per NESC Rule 238, and why does this matter for span-length design?

*Expected answer:* At 7.2 kV (751 V–8.7 kV range), NESC Rule 238 requires **48 in. (4.0 ft)** minimum vertical separation between the communication conductor and the supply conductor above it. Maximum communication attachment height = 29 ft − 4.0 ft = **25 ft**. This caps the attachment height available for clearance calculations: a lower attachment height reduces the maximum allowable sag before NESC road-crossing clearance is violated, which in turn limits the maximum span length. The designer must use 25 ft (not 29 ft) as the attachment height in the 6-step midspan clearance calculation. [NESC C2-2023, Rule 238; T3 L3.4]

---

## Glossary Cross-References

- **NESC Rule 232 / Table 232-1** → T3 L3.3 (midspan clearance calculation applies this table's values), T3 L3.4 (sag-tension design uses these as clearance targets)
- **NESC Rule 238 / communication space** → T3 L3.4 (communication space constrains attachment height in span-length design)
- **Final sag** → T3 L3.4 (creep-adjusted sag is the design sag for clearance verification), L4.2b (loading district shifts sag; clearance check uses final sag regardless)
- **More-restrictive-governs** → L4.1 (framework); applies here when TIA-758-C §6.2 clearance differs from NESC Table 232-1
- **Loading district** → L4.2b (Light, Medium, Heavy, Extreme Wind — determine the ice/wind load that produces the maximum sag used in the clearance check)
- **NESC Rule 261 (pole loading)** → T3 L3.4 (pole loading analysis required before extending span lengths beyond standard)
