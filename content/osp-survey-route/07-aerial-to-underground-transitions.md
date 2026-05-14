---
title: "Lesson 3.7: Aerial-to-Underground Transitions — Riser Design and Attachment Hardware"
duration_min: 20
topic: osp-survey-route
order: 7
bicsi_alignment:
  - "OSP-DRD Ch. 6.3: Aerial construction — transitions and terminations"
sources:
  - "NESC (National Electrical Safety Code) C2-2023, Rules 235G, 352, 354"
  - "BICSI OSP-DRD Manual, Ch. 6.3"
  - "ANSI/TIA-758-C §6.1, §6.4 (transition construction requirements)"
  - "RUS Bulletin 1751F-630 §6 (service entrance and transition construction)"
---

# Aerial-to-Underground Transitions — Riser Design and Attachment Hardware

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify each component of a standard aerial-to-underground riser assembly and state its function
- State the minimum height above grade for the riser conduit on an exposed pole face per ANSI/TIA-758-C and NESC Rule 354
- Explain the drip loop geometry requirement and identify what failure mode it prevents
- Describe the grounding and bonding requirement for metallic cable armor at a transition point under NESC Rule 352
- Determine when a cable splice at the aerial-to-underground transition is appropriate versus when continuous cable through the transition is preferred

---

## Reading Content

### The Transition as the Highest-Risk Point in the Plant

The aerial-to-underground transition is the location where the cable descends from a pole attachment down the pole face and enters the underground conduit. This transition concentrates several failure-mode risks that do not exist at mid-span or in the continuous underground segment:

- **UV exposure:** The cable and conduit on the pole face are exposed to full sunlight. Ordinary direct-bury cable sheathing and Schedule 40 PVC are not UV-stabilized; both degrade over years of direct solar exposure.
- **Vehicle impact:** The conduit on the lower pole face is within reach of vehicles maneuvering near the pole, agricultural equipment passing in the ROW, and maintenance vehicles. The lower 8 feet of a pole face in a rural ROW is a high-impact-risk zone.
- **Water ingress:** Rain and snowmelt flowing down the pole face and down the cable can enter the conduit at the top of the riser if the entry geometry is not correct, creating water accumulation around the cable in the conduit.
- **Inadequate strain relief:** If the aerial cable span tension is transmitted to the conduit or splice hardware below the transition point — rather than being absorbed by the cable clamp and bracket — the conduit can be pulled free or the underground cable can experience excessive tensile load.
- **Grounding discontinuity:** If a cable with metallic armor transitions from aerial to underground without a proper bonding and grounding connection at the pole, the metallic armor creates a path for ground fault current or lightning-induced surge, creating a fire and safety risk.

A correctly designed and installed riser assembly addresses every one of these failure modes. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.1; RUS Bulletin 1751F-630 §6]

### The Riser Assembly: Component by Component

A standard aerial-to-underground riser assembly consists of the following components in sequence from pole attachment downward:

**1. Pole Attachment Bracket**
A galvanized steel bracket bolted to the pole at the communication space attachment height. The bracket provides the mounting point for the cable clamp (also called a dead-end clamp or strain relief clamp) that terminates the aerial span at the transition pole. The bracket must be sized for the cable's rated tensile strength; at a transition pole, the full cable span tension acts on this bracket as a dead-end load. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

**2. Cable Clamp / Strain Relief Clamp**
The cable clamp grips the cable at the attachment bracket and absorbs the aerial span tension, preventing that tension from being transmitted to the riser conduit or underground cable below. The clamp must be rated for the cable's maximum tensile load. For ADSS cable, the clamp grips the cable sheath; for lashed cable, the clamp is placed on the messenger strand. The clamp creates the critical separation between the aerial (tension-bearing) portion of the cable and the underground (slack) portion. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

**3. Drip Loop**
The cable exits the clamp and loops downward toward the riser conduit entry. The drip loop is a downward bend in the cable that creates a low point below the conduit entry point — ensuring that water flowing down the cable surface runs off the low point of the loop rather than entering the conduit. ANSI/TIA-758-C and BICSI OSP-DRD require that the drip loop low point be at least 12 inches below the top of the riser conduit entry, so that water cannot travel horizontally from the loop into the conduit. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

The drip loop must also not violate the cable's minimum bend radius. An overly tight drip loop can permanently deform the fiber structure of the cable. The loop radius must equal or exceed the cable manufacturer's minimum installation bend radius (typically 20× the cable OD for ADSS cable).

**4. Riser Conduit**
The conduit that runs along the pole face from the drip loop entry to grade and then underground. Riser conduit requirements:

- **Material:** Schedule 80 PVC or Rigid Galvanized Steel (RGS). Schedule 40 PVC is not acceptable for the above-grade riser section due to insufficient impact resistance. RGS is required by some utilities and railroad permits for the exposed pole-face segment.
- **Height:** The riser conduit must extend from the underground conduit entry point upward to at least **8 feet above finished grade** on the pole face. This places the conduit top above the impact zone of vehicles and agricultural equipment and above the reach of casual tampering. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.1]
- **Attachment:** The riser conduit is secured to the pole face with galvanized steel conduit clamps at intervals not exceeding 48 inches (4 feet), providing support against transverse loads and preventing the conduit from separating from the pole under impact.

**5. Conduit Weatherhead / Top Cap**
At the top of the riser conduit (where the cable enters from the drip loop), a weatherhead fitting or conduit cap prevents rain, birds, insects, and debris from entering the conduit at the top opening. The cap is installed after the cable is routed through; it must seal around the cable OD to exclude water. [BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630 §6]

**6. Ground Bond at Transition**
NESC Rule 352 requires that the metallic armor (CST, corrugated steel tape; or steel armor strands) of any armored cable be bonded to the pole ground at the transition point. The bond wire is typically No. 6 AWG solid copper, clamped to the armor at the transition bracket and connected to the pole's ground rod system. This bond ensures that lightning-induced current or any fault current on the armor is conducted to ground at the pole rather than being carried into the underground plant. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.3]

For all-dielectric (non-metallic armor) cable, a ground bond is not required for the cable armor, but the transition bracket and any metallic conduit fittings must still be bonded to the pole ground system.

### Continuous Cable vs. Splice at Transition

The question of whether to splice the cable at the transition pole or run continuous cable through the transition from aerial to underground affects both construction cost and long-term reliability.

**Continuous cable through the transition (preferred where feasible):**
If the aerial cable type and the underground cable type are the same (same OD, same fiber count), and if the span geometry allows the cable to be routed continuously from the aerial run through the riser and into the underground conduit, a continuous cable installation is strongly preferred. No splice means one fewer potential failure point, no splice closure maintenance requirement, and no optical insertion loss from the splice. Most modern ADSS cable construction is also suitable for underground installation (provided it meets the applicable underground burial rating). [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

**Splice at transition (required when):**
A splice at the transition is necessary when:
- The aerial and underground cable are different types (e.g., ADSS aerial to armored direct-bury underground, or different fiber counts)
- The routing geometry requires a mechanical junction to manage slack (a very long aerial span approaching the transition leaves insufficient slack for a smooth transition to underground without a splice point at the pole)
- The route design calls for a fiber count change at the transition (e.g., 144-fiber aerial trunking to 48-fiber underground distribution)

When a splice at the transition is required, the splice closure is mounted on the pole at the communication space height — not at grade level — so that the closure is accessible from a bucket truck without entering a confined space. The closure is a weatherproof outdoor-rated enclosure appropriate for aerial mounting (not a pedestal or handhole closure type). [BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630 §6]

### Guy Wire Requirement at Transition Poles

An aerial-to-underground transition pole is always a **dead-end pole** — the aerial run terminates here, and the full cable span tension acts longitudinally on the pole. NESC Rule 261 requires back guying at all dead-end poles. The transition pole must have a back-guy wire installed in the direction away from the aerial cable run, connected to a down-guy anchor, to resist the full cable tension. Lesson 3.4 covers the back-guy force calculation. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

In some configurations, an H-frame structure (two poles connected by crossarm) is used at the transition point to provide the required structural strength without a buried anchor — useful in rocky terrain where anchors cannot be driven. The H-frame design requires a full pole loading analysis to confirm structural adequacy. [RUS Bulletin 1751F-630 §6]

---

## Key Terms (Flashcard Candidates)

**Pole attachment bracket**
Galvanized steel bracket bolted to the pole at the communication space attachment height; provides the mounting point for the dead-end clamp at an aerial-to-underground transition. Sized for the rated tensile strength of the cable being terminated. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

**Cable clamp / dead-end clamp / strain relief clamp**
The fitting that grips the aerial cable at the transition bracket, absorbing span tension so that it cannot be transmitted to the riser conduit or underground cable below. Must be rated for the cable's maximum tensile load. Separate designs for ADSS (sheath grip) and lashed cable (messenger grip). [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

**Drip loop**
A downward cable bend at the riser conduit entry that creates a low point below the conduit entry to shed water from the cable surface away from the conduit opening. Minimum 12 in. below the conduit top. Drip loop radius must not violate the cable's minimum installation bend radius. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

**Riser conduit minimum height (8 ft above grade)**
The requirement that the exposed riser conduit on the pole face extend from the underground entry to at least 8 feet above finished grade, providing impact protection from vehicles and equipment and tamper resistance. Material: Schedule 80 PVC or RGS. [NESC C2-2023, Rule 354; ANSI/TIA-758-C §6.1]

**Weatherhead / top cap**
A fitting at the top of the riser conduit that seals the conduit opening around the cable OD, excluding water, birds, insects, and debris from entering the conduit at the top. Required at all riser conduit entries. [BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630 §6]

**Ground bond at transition (NESC Rule 352)**
The requirement to bond the metallic armor of any armored aerial cable to the pole's grounding system at the transition point, using No. 6 AWG solid copper bonding wire. Ensures lightning and fault current on the armor is conducted to ground at the pole rather than traveling into the underground plant. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.3]

**Dead-end pole / back guying at transition**
The aerial-to-underground transition pole is always a dead-end for the aerial span; the full cable tension acts longitudinally. NESC Rule 261 requires a back-guy wire in the direction away from the cable run to resist this tension. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

---

## Interactive: Drag-and-Drop — Label the Riser Assembly

*(In the course platform, the learner drags component labels onto an illustrated riser assembly diagram. Shown here as a labeled component list.)*

From top to bottom on the pole face:

1. **Pole attachment bracket** — bolted to pole at communication space height; mounting base for cable clamp
2. **Dead-end clamp** — grips cable at bracket; absorbs aerial span tension
3. **Drip loop** — downward cable bend, low point ≥ 12 in. below conduit top; sheds water away from conduit entry
4. **Weatherhead / top cap** — seals conduit top opening around cable OD
5. **Riser conduit (Schedule 80 PVC or RGS)** — runs from weatherhead downward along pole face to grade; attached with conduit clamps at ≤ 48-in. intervals; extends to ≥ 8 ft above grade
6. **Ground bond wire (No. 6 AWG copper)** — from cable armor to pole ground rod system; required for metallic armor per NESC Rule 352
7. **Conduit entry to underground** — where riser conduit transitions to buried conduit; may require a sweep fitting if a direction change is needed

---

## Multiple-Choice Quiz

---

**Q1.** A transition pole is being designed where a 48-fiber ADSS aerial cable (0.55-in. OD) descends to an underground conduit route. The aerial span on one side is 350 ft. An inspector reviewing the design notes that the drip loop at the riser conduit top is 8 inches below the weatherhead entry, not the specified 12 inches. What failure mode does this inadequate drip loop geometry create?

- A) The cable's bending stress exceeds its rated minimum bend radius, creating potential fiber damage
- B) Water flowing down the cable surface can flow horizontally into the conduit opening rather than dripping off the loop low point, allowing water accumulation in the riser conduit **[CORRECT]**
- C) The drip loop height affects the strain relief load on the dead-end clamp; 8 inches is insufficient to absorb the full 350-ft span tension
- D) An 8-inch drip loop clearance is acceptable for cable OD ≤ 0.60 in.; the 12-inch requirement only applies to cable OD > 0.60 in.

*Rationale:*
- **A — Incorrect.** The drip loop height (its vertical clearance below the conduit entry) is a water-shedding geometry requirement, not a bend radius requirement. Bend radius is controlled by the loop diameter, not its height below the conduit top. A loop with correct bend radius can still be positioned too high — creating the water-entry problem — and a loop positioned correctly in height can still have too tight a radius. These are separate requirements. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]
- **B — Correct.** The drip loop's purpose is to create a low point far enough below the conduit entry that water running down the cable surface runs off the low point before it reaches the horizontal plane of the conduit entry. With only 8 inches below the entry, the low point may still allow water to travel horizontally from the bottom of the loop up the cable to the conduit entry during wind-driven rain — particularly with conduit entry angles that are not perfectly vertical. The 12-inch minimum provides adequate margin against wind-driven water travel. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630 §6]
- **C — Incorrect.** Drip loop height has no effect on strain relief or span tension. The cable clamp (dead-end clamp) at the bracket absorbs span tension; the drip loop is the slack cable section below the clamp, which carries no span tension load. [ANSI/TIA-758-C §6.4; NESC C2-2023, Rule 261]
- **D — Incorrect.** The 12-inch drip loop clearance is a standard minimum from ANSI/TIA-758-C §6.4 and BICSI OSP-DRD that applies regardless of cable OD. There is no cable-size-dependent exception to this requirement in the applicable standards. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

---

**Q2.** An aerial-to-underground transition is being built on a joint-use pole. The cable is an armored OSP cable with a corrugated steel tape (CST) metallic armor layer. The contractor installs the riser assembly but does not bond the cable armor to the pole's ground rod system, arguing that the cable has a non-conductive polyethylene outer sheath and the armor is "enclosed and not exposed." Is this argument technically correct under NESC Rule 352?

- A) Yes — NESC Rule 352 bonding applies only to cables with exposed metallic armor, not to cables with PE outer sheaths enclosing the armor
- B) No — NESC Rule 352 requires bonding of metallic armor to the pole grounding system at transition points regardless of whether the armor is enclosed in the outer sheath **[CORRECT]**
- C) Yes — bonding is required only when the cable carries electrical current, and fiber optic cables are non-conductive
- D) No — but the bonding requirement applies only to the transition pole's metallic conduit fittings, not to the cable armor itself

*Rationale:*
- **A — Incorrect.** NESC Rule 352 addresses metallic components of communication cables — including armor — regardless of whether an outer sheath covers them. The outer PE sheath is not a barrier to lightning-induced surge current on the metallic armor; a sheath breach, a damaged end, or the armor's connection to a pole bracket can provide a path for surge current. The bond is required to ensure a controlled path to ground at the pole rather than allowing surge current to travel the armor into the underground plant. [NESC C2-2023, Rule 352]
- **B — Correct.** NESC Rule 352 requires that the metallic elements of communication cables — including cable sheaths, armor, and metallic strength members — be bonded and grounded where they terminate or transition at a grounded structure (such as a utility pole with a ground rod system). At an aerial-to-underground transition, the cable armor is accessible at the bracket and dead-end clamp. NESC Rule 352 requires a bonding connection from the armor to the pole ground at this point. The PE outer sheath does not excuse the bonding requirement. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.3]
- **C — Incorrect.** The metallic armor of a fiber optic cable does not carry signal current, but it is conductive and can carry lightning-induced surge current. The grounding requirement for communication cable metallic components exists because of the lightning and fault current risk, not because the cable transmits electrical power. [NESC C2-2023, Rule 352]
- **D — Incorrect.** NESC Rule 352 addresses the cable's metallic elements, not only the conduit fittings. Metallic conduit fittings are covered by a separate grounding requirement (NEC and NESC). Both the cable armor and metallic conduit must be grounded; they are not mutually exclusive requirements. [NESC C2-2023, Rule 352; BICSI OSP-DRD Manual, Ch. 6.3]

---

**Q3.** A route design includes a point where a 96-fiber aerial trunk cable (ADSS) transitions to underground for a 0.3-mile buried segment. The designer proposes running the cable continuously from the aerial span through the riser and into the underground conduit without splicing at the transition pole. The ADSS cable has a burial depth rating from the manufacturer. Is continuous cable through the transition appropriate, and why?

- A) No — aerial ADSS cable cannot be buried; a splice to an armored direct-bury cable is always required at the transition
- B) Yes — if the cable manufacturer rates the cable for underground burial and the aerial and underground fiber count are the same, continuous cable through the transition is preferred because it eliminates a splice point **[CORRECT]**
- C) No — a splice is required at every aerial-to-underground transition to allow future maintenance access to each segment independently
- D) Yes — but only for fiber counts of 48 or fewer; 96-fiber cables require a splice at all transitions for OTDR testing access

*Rationale:*
- **A — Incorrect.** Some ADSS cable constructions are designed and rated for both aerial and underground installation. Where the manufacturer provides a burial depth rating, the cable can be run continuously from aerial through the riser and into the underground conduit. A splice to armored direct-bury cable is required only when the cable type must change (e.g., for soil corrosivity or mechanical protection reasons that the ADSS construction cannot meet). [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]
- **B — Correct.** When the cable is rated for both aerial and underground installation and the fiber count is the same in both segments, continuous cable through the transition is the preferred design. Every splice is a potential failure point, an insertion loss source, and a maintenance item; eliminating the splice at the transition improves reliability and reduces lifetime cost. The deciding factors are the cable's underground burial rating (from the manufacturer) and the absence of a reason to change cable type at the transition. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3; RUS Bulletin 1751F-630 §6]
- **C — Incorrect.** There is no standard requirement for a splice at every aerial-to-underground transition. Splice-at-transition is a design choice driven by technical need (cable type change, fiber count change, slack management), not a blanket rule. Continuous cable is preferred where technically feasible. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]
- **D — Incorrect.** There is no fiber-count threshold in ANSI/TIA-758-C, BICSI OSP-DRD, or NESC that requires splicing at a transition for cables above 48 fibers. OTDR testing is performed from the cable ends, not from mid-route splice points; a splice-free transition is not an OTDR obstacle. [ANSI/TIA-758-C §6.4]

---

## Final Check

Answer before proceeding to Lesson 3.8.

**Pulse 1.** List, in order from top to bottom on the pole face, the six components of a standard aerial-to-underground riser assembly and state the function of each.

*Expected answer:* (1) **Pole attachment bracket** — provides mounting base for the dead-end clamp at the communication space height. (2) **Dead-end clamp** — grips the cable at the bracket and absorbs the aerial span tension so that tension is not transmitted below. (3) **Drip loop** — downward cable bend with low point ≥ 12 in. below the conduit top; sheds water from the cable surface away from the conduit entry. (4) **Weatherhead / top cap** — seals the top opening of the riser conduit around the cable OD, excluding water, birds, and insects. (5) **Riser conduit (Schedule 80 PVC or RGS)** — protects the cable on the pole face from grade to ≥ 8 ft above grade; attached to pole with conduit clamps at ≤ 48-in. intervals. (6) **Ground bond wire** — No. 6 AWG copper from cable metallic armor to pole ground rod system; required by NESC Rule 352 for armored cable. [NESC C2-2023, Rules 352, 354; ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.3]

**Pulse 2.** Why is an aerial-to-underground transition pole always a dead-end pole for guying purposes, and what is the required guy wire direction?

*Expected answer:* At an aerial-to-underground transition, the aerial cable span terminates at the transition pole and the tension from that span is absorbed by the dead-end clamp and the pole attachment bracket. The full cable span tension acts longitudinally on the pole in the direction of the cable run — the same load as any dead-end termination. NESC Rule 261 requires back guying at all dead-end poles to resist this longitudinal tension. The back-guy wire is installed in the direction **opposite** to the aerial cable run (away from the cable, toward an anchor in the ground), resisting the tension vector that the cable applies to the pole. [NESC C2-2023, Rule 261; BICSI OSP-DRD Manual, Ch. 6.3]

---

## Glossary Cross-References

- **Dead-end pole / back guying** → Lesson 3.4 (aerial route design — dead-end and corner pole guying covered in pole loading analysis); Lesson 3.10 (construction drawings — guy wire detail appears on drawing set)
- **Ground bond / NESC Rule 352** → Lesson 3.3 (NESC clearances — Rule 238 governs horizontal separation from supply conductors; Rule 352 governs grounding)
- **Riser conduit (Schedule 80 / RGS)** → Lesson 3.5 (underground route design — Schedule 80 and RGS material selection); Lesson 3.8 (crossings — riser conduit also used at bore exit points above grade)
- **Drip loop** → Lesson 3.9 (splice point placement — a drip loop at a pole-mounted splice closure serves the same water-shedding function)
- **Continuous cable vs. splice at transition** → Lesson 3.9 (splice point placement — splice closure placement criteria); Topic 2 (splice and termination — mechanical splice and fusion splice quality standards apply if a transition splice is required)
- **Weatherhead / top cap** → Lesson 3.5 (underground route design — conduit end caps at stub-up points use the same weatherhead principle)
