---
title: "Lesson 4.5: NEC Article 770 — Optical Fiber In-Building"
duration_min: 25
topic: osp-domain-4-standards-codes
order: 6
bicsi_alignment:
  - "OSP-DRD Ch. 2.5: NEC optical fiber cable requirements"
sources:
  - "NFPA 70 (NEC) Article 770 (2023 edition)"
  - "NEC 770.113 — listing and marking requirements"
  - "NEC 770.24 — mechanical protection and firestop"
  - "BICSI OSP-DRD Manual, Ch. 2.5"
---

# NEC Article 770 — Optical Fiber In-Building

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Recite the NEC Article 770 cable type designations (OFN, OFNR, OFNP, OFC, OFCR, OFCP) and the application hierarchy each occupies
- Explain why the outdoor PE-jacketed OSP cable cannot be routed more than 50 ft inside a building without transitioning to a listed indoor cable type
- Apply the 770.113 listing and substitution hierarchy to specify the correct cable type for riser and horizontal segments
- State the firestop requirement of NEC 770.24 and where it applies
- Assign the correct NEC 770 cable type to each segment of a route transitioning from aerial OSP through building entry, vertical riser, and horizontal office run

> **AHJ Edition Caveat:** NEC is revised on a 3-year cycle. The values in this lesson cite NEC 2023 (NFPA 70-2023). The adopted edition in a given jurisdiction may be 2020, 2017, or earlier. Confirm with the AHJ before finalizing cable specifications on drawings. See L4.1 for state-adoption lag framework.

> **Cross-Reference:** NEC Article 770 cable types were introduced in T1 L1.7. This lesson extends that introduction with the full fire-rating classification system under 770.113, the 50-ft exception, and the firestop requirement of 770.24.

---

## Reading Content

### NEC Article 770: Scope and Boundary

NEC Article 770 governs the installation of optical fiber cables and raceways in **buildings** — from the point of building entry inward. The article's scope begins at the point where an OSP cable transitions into the building structure, which is also the point at which NESC jurisdiction ends and NEC jurisdiction begins. [NFPA 70-2023, Art. 770.1]

**Scope boundary:** NESC governs the aerial or underground OSP plant up to the building wall (or the building entry point as defined by the AHJ). NEC Article 770 governs from the building entry point inward through the riser, horizontal distribution, and equipment-room wiring.

The key practical question Article 770 answers for OSP designers: *What cable type must be installed at each segment inside the building?* Article 770's fire-rating classification system is the answer.

---

### 770.113 — Listing and the Cable Type Hierarchy

NEC 770.113 requires that optical fiber cables installed in buildings be **listed** and **marked** for their intended use. The listing categories are organized by the fire-hazard classification of the space where the cable is installed:

**Two parallel hierarchies — conductive vs. nonconductive:**
- **N series (nonconductive):** No electrically conductive members. OSP fiber cable with a dielectric strength member (aramid yarn, fiberglass) is nonconductive. Most OSP ADSS and all-dielectric loose-tube cables are nonconductive.
- **C series (conductive):** Contains electrically conductive members (metallic armor, metallic strength member, or metallic moisture barrier). Armored OSP cable with a steel armor layer is conductive. Conductive cable has additional installation restrictions (must be grounded, cannot be installed in ducts or plenums without specific listing).

**Listing categories by space and fire rating:**

| Category | Space application | Fire rating requirement | Substitution allowed by |
|---|---|---|---|
| **OFN** | General purpose — indoor, non-riser, non-plenum | Listed for general use | OFNR, OFNP |
| **OFNR** | Riser — vertical shafts, elevator shafts, floor-penetrating runs | Listed for riser use (flame does not propagate up the vertical run) | OFNP |
| **OFNP** | Plenum — air-handling ducts and spaces used for environmental air movement | Listed for plenum use (low-smoke, low-flame spread, for air-handling spaces) | None (highest rating) |
| **OFC** | General purpose — conductive version | Same as OFN but with conductive members | OFCR, OFCP |
| **OFCR** | Riser — conductive version | Same as OFNR but with conductive members | OFCP |
| **OFCP** | Plenum — conductive version (least common; armored plenum-rated cable) | Same as OFNP but with conductive members | None (highest rating) |

**Substitution hierarchy:** A higher-rated cable can always substitute for a lower-rated cable in the same conductor-type family (N or C). It cannot substitute across N/C families. [NFPA 70-2023, Art. 770.113]

> **Substitution summary (nonconductive family):**
> OFNP (plenum) can be used anywhere OFN or OFNR is required.
> OFNR (riser) can be used anywhere OFN is required, but NOT in plenum.
> OFN (general) cannot be used in risers or plenums.

**The critical design rule:** You must specify the cable type that matches the space it will travel through — using the minimum listed category for that space, or a higher-rated substitute. Using OFN in a riser is a code violation. Using OFNR in a plenum is a code violation.

---

### 770.24 — Mechanical Protection and Firestop

**NEC 770.24** requires that where optical fiber cables pass through openings in fire-rated walls, floors, and ceilings, the openings must be **firestopped** using an approved method and materials to maintain the fire-resistance rating of the penetrated assembly. [NFPA 70-2023, Art. 770.24]

**Firestop materials and approval:** Firestop systems must be listed and installed per the manufacturer's instructions. Common systems include intumescent putty, firestop caulk, and listed firestop pillows. The firestop must be installed at every cable penetration through a rated fire assembly — not just at the building entry.

**Mechanical protection (770.24 scope):** The article also requires that cables be mechanically protected where subject to physical damage — such as in exposed locations below 7 ft (2.1 m) from the floor or in areas subject to vehicular traffic.

**AHJ inspection point:** Firestop compliance is one of the most frequently cited NEC violations in building inspections involving communications cable. The OSP designer who specifies a route through rated assemblies must note the firestop requirement explicitly in the specification; it is not assumed.

---

### The 50-ft Unlisted PE Exception

OSP fiber cables are typically jacketed with **polyethylene (PE)** — a thermoplastic material selected for its moisture resistance and weatherability. PE jackets are not listed for indoor use; they do not meet the fire-rating requirements of NEC 770.113 for general indoor use.

**NEC 770.154(a) Exception 1** (commonly called the "50-ft unlisted cable exception") permits unlisted outside plant cable to enter a building and extend up to **50 ft from the point of building entry** without transitioning to a listed cable type, provided:
- The cable is in a raceway (conduit) for the full 50-ft extent, OR
- It enters a fire-resistant vault, closet, or room at the point of entry

Beyond 50 ft from the building entry point, the cable must be:
- Transitioned to a listed cable type (at a splice point, optical distribution frame, or patch panel), OR
- The PE-jacketed OSP cable must not continue further into the building

**Design practice:** The 50-ft exception is not a design goal — it is a code accommodation for the physical reality that OSP cable pulls from the outside in often arrive at inside-the-building termination panels. Good practice terminates the OSP cable at the building entry point (Optical Network Interface box, DEMARC, or building entry terminal) and begins listed cable from there. Relying on the 50-ft exception as a design strategy (pulling OSP cable deep into the building) is a code compliance risk if the pull point is more than 50 ft from entry. [NFPA 70-2023, Art. 770.154(a) Exception 1]

---

### Worked Example: RUS Aerial Route to Horizontal Office Run

**Route description:**
A PSC RUS aerial ADSS cable arrives at a customer building. The route transitions from the OSP plant through the building wall, vertically through a riser shaft to the second floor, then horizontally through a suspended ceiling above open offices to a patch panel in an equipment closet.

**Segment-by-segment cable type specification:**

**Segment 1 — Aerial OSP run (outside the building)**
- Cable: ADSS, all-dielectric, PE jacket — not listed for indoor use
- NEC Article 770: not yet applicable (NESC governs outside the building)
- Specification: ADSS conforming to RUS Bulletin 1751F-630 §4 and IEEE Std 1222

**Segment 2 — Building entry (at the wall)**
- Transition point: building entry wall penetration
- Requirements: (a) 770.24 firestop at the wall penetration (if fire-rated wall); (b) begin the 50-ft unlisted cable clock if the ADSS PE-jacketed cable continues inside
- Best practice: terminate ADSS at a building entry terminal or DEMARC within 50 ft; splice to listed cable here

**Segment 3 — Vertical riser shaft (building entry to second floor)**
- Space type: riser shaft (vertical penetration through floors) — a listed riser space under NEC 770.113
- Required cable type: **OFNR (riser-rated, nonconductive)** at minimum
- May substitute: OFNP (if available from same patch point and plenum cable is preferred for consistency)
- May NOT use: OFN (general — riser fire-rating not met)
- Citation: NEC 770.113; [NFPA 70-2023, Art. 770.113]
- Firestop required: Yes — at each floor penetration the riser cable passes through (770.24)

**Segment 4 — Horizontal run in suspended ceiling above open offices**
- Space type: The suspended ceiling above open offices — if the ceiling space is used as return air plenum (i.e., HVAC return air flows through the ceiling space), this is a **plenum space** under NEC 770.113 and full plenum-rated cable is required
- Required cable type: **OFNP (plenum-rated, nonconductive)** if the ceiling is a plenum; OFNR is acceptable if the ceiling is NOT used as a return air plenum
- Determination: the designer must confirm with the mechanical engineer or building drawings whether the ceiling space is a return-air plenum. If in doubt, specify OFNP to ensure compliance regardless of plenum status.
- May NOT use: OFN or OFNR in a confirmed plenum space
- Citation: NEC 770.113; [NFPA 70-2023, Art. 770.113]

**Segment 5 — Equipment closet patch panel**
- Space type: enclosed equipment room (not riser, not plenum)
- Required cable type: **OFN (general purpose, nonconductive)** minimum — or the riser/plenum cable continues through from the previous segment
- Citation: NEC 770.113; [NFPA 70-2023, Art. 770.113]

**Summary — cable type at each transition:**

| Segment | Space type | Cable type specified | NEC citation |
|---|---|---|---|
| Aerial OSP | Outdoor | ADSS (not NEC-listed) | Not NEC Art. 770 — NESC applies |
| Building entry | Entry point | Transition or 50-ft exception applies | 770.154(a) Exception 1 |
| Riser shaft | Riser | **OFNR** (nonconductive, riser-rated) | 770.113 |
| Suspended ceiling (plenum) | Plenum | **OFNP** (nonconductive, plenum-rated) | 770.113 |
| Equipment closet | General | OFN (or continue riser/plenum cable) | 770.113 |

[NFPA 70-2023, Art. 770.113, 770.154(a); BICSI OSP-DRD Manual, Ch. 2.5]

---

## Key Terms (Flashcard Candidates)

**OFN / OFNR / OFNP**
NEC 770.113 listing categories for nonconductive optical fiber cable. OFN = general purpose (lowest fire rating, no riser or plenum). OFNR = riser-rated (can span vertical shafts without flame propagating upward). OFNP = plenum-rated (low-smoke, low-flame-spread for air-handling spaces — highest fire rating). Substitution: OFNP > OFNR > OFN. [NFPA 70-2023, Art. 770.113]

**OFC / OFCR / OFCP**
Conductive equivalents of OFN/OFNR/OFNP — same fire-rating hierarchy, for cables with electrically conductive members (metallic armor, metallic strength member). Must be grounded; additional installation restrictions apply. Cannot substitute for N-series or vice versa. [NFPA 70-2023, Art. 770.113]

**NEC 770.113 (listing requirement)**
The NEC requirement that all optical fiber cables installed in buildings be listed and marked for their intended use. The listing must match the fire-hazard classification of the space (general, riser, or plenum). Using a lower-rated cable in a higher-hazard space is a code violation. [NFPA 70-2023, Art. 770.113]

**NEC 770.24 (firestop)**
The NEC requirement that openings in fire-rated assemblies (walls, floors, ceilings) penetrated by optical fiber cables be firestopped using listed systems, installed per manufacturer instructions, to maintain the fire-resistance rating of the assembly. Required at every penetration through a rated assembly, not only at building entry. [NFPA 70-2023, Art. 770.24]

**50-ft unlisted PE exception (770.154(a) Exception 1)**
Allows an unlisted (PE-jacketed OSP) cable to extend up to 50 ft into a building from the building entry point, in a raceway, without transitioning to a listed cable type. Beyond 50 ft, a listed cable type is required. Good practice: terminate OSP cable at or near building entry; do not rely on the exception for deep interior runs. [NFPA 70-2023, Art. 770.154(a)]

**Plenum space**
A building space used for environmental air movement — specifically, a ceiling or floor cavity used as return air for HVAC. Cable in plenum spaces must be OFNP (or OFCP for conductive) — lowest smoke and flame-spread rating. Identification of plenum status requires mechanical engineer or building drawing review. [NFPA 70-2023, Art. 770.113]

**Riser space**
A vertical shaft or opening that passes through two or more floors, used for routing vertical cable runs. Cable in riser spaces must be OFNR minimum (or OFNP, which can substitute). OFN cannot be used in a riser. Firestop required at each floor penetration. [NFPA 70-2023, Art. 770.113; Art. 770.24]

**Conductive vs. nonconductive optical fiber cable (NEC)**
Conductive OFC cable contains metallic members and must be grounded and installed with additional restrictions (cannot enter ducts or plenums used for environmental air in some configurations). Nonconductive OFN cable contains only dielectric (non-metallic) members. Most ADSS and all-dielectric OSP cable is nonconductive. The N vs. C designation determines which substitution series applies. [NFPA 70-2023, Art. 770.113]

---

## Interactive: Drag-and-Drop — Assign Cable Type to Route Segment

**Activity description for Moodle implementation:**

The learner is shown a building cross-section diagram with five labeled segments (outdoor aerial → building entry → riser → plenum ceiling → equipment closet). A panel provides six cable type cards: [OFN], [OFNR], [OFNP], [OFC], [OFCR], [OFCP]. The learner drags the correct cable type (minimum required, nonconductive family) to each segment.

| Segment | Minimum cable type (nonconductive, correct answer) |
|---|---|
| Outdoor aerial OSP | ADSS (not an NEC type — student notes "NEC does not apply here") |
| Building entry — within 50 ft | ADSS (50-ft exception applies; raceway required) |
| Vertical riser shaft | OFNR |
| Suspended ceiling — confirmed return air plenum | OFNP |
| Equipment closet | OFN |

*Incorrect placement triggers explanation of why the selected cable type is insufficient or over-specified for the space.*

---

## Multiple-Choice Quiz

---

**Q1.** A fiber cable runs from a patch panel in an equipment closet up through a vertical shaft to a rooftop communications room, passing through four concrete floor slabs. Per NEC Article 770, which cable type is the minimum required for this vertical shaft run, and what is required at each floor penetration?

A) OFN (general purpose); firestop only at the top floor penetration

B) OFNR (riser-rated); firestop required at each floor penetration **[CORRECT]**

C) OFNP (plenum-rated); firestop required at each floor penetration

D) OFN (general purpose); no firestop required if the cable is in conduit

*Rationale:*
- **A — Incorrect.** OFN (general purpose) is the lowest fire rating and is NOT approved for use in vertical shafts (riser spaces) because it does not meet the flame-propagation resistance requirement for riser installations. Using OFN in a riser is a code violation. Additionally, firestop is required at every floor penetration, not only at the top. [NFPA 70-2023, Art. 770.113; Art. 770.24]
- **B — Correct.** NFPA 70-2023 Art. 770.113 requires riser-rated cable (OFNR minimum) in vertical shafts that pass through two or more floors. OFNR is listed for riser use, meaning the cable is tested to prevent flame from propagating upward along the vertical run. Art. 770.24 requires firestop at each floor penetration to maintain the fire-resistance rating of each floor assembly — not just the top or bottom. [NFPA 70-2023, Art. 770.113; Art. 770.24]
- **C — Incorrect.** OFNP (plenum) can substitute for OFNR in a riser (higher rating can always substitute downward), but it is not the minimum required. Requiring OFNP in a riser is over-specification (adds cost); the minimum is OFNR. The firestop requirement is correctly stated. [NFPA 70-2023, Art. 770.113]
- **D — Incorrect.** OFN in a riser is a code violation regardless of whether it is in conduit. Conduit does not upgrade the fire rating of the cable inside it — the cable listing must match the space. Additionally, firestop is required at every floor penetration; conduit presence does not eliminate the firestop requirement unless the conduit itself is a listed firestop assembly (which requires specific listing and installation documentation). [NFPA 70-2023, Art. 770.113; Art. 770.24]

---

**Q2.** An OSP fiber route arrives at a hospital building. The aerial ADSS cable enters through a conduit sleeve in the exterior wall and runs 45 ft to a splice case in the building entry room. From the splice case, fiber continues 80 ft through a suspended ceiling space that serves as the HVAC return air plenum, terminating at a patch panel in a communications equipment room. Which cable types are required for the two interior segments, and does the 50-ft exception apply?

A) Segment 1 (to splice case): OFNP required (no exception); Segment 2 (through plenum): OFNR acceptable

B) Segment 1 (to splice case): ADSS PE cable acceptable (50-ft exception applies, in conduit, 45 ft < 50 ft); Segment 2 (through plenum): **OFNP required** **[CORRECT]**

C) Segment 1 (to splice case): OFNR required (50-ft exception does not apply in a hospital); Segment 2 (through plenum): OFN acceptable in a conduit

D) Both segments: ADSS PE cable acceptable (50-ft exception applies to the entire route from building entry to the final patch panel)

*Rationale:*
- **A — Incorrect.** The 50-ft exception (NEC 770.154(a) Exception 1) applies to the first segment: the ADSS PE cable is in a conduit sleeve and runs only 45 ft — within the 50-ft limit. OFNP is not required for this segment. For the second segment (plenum), OFNP is correct, but OFNR is NOT acceptable in a confirmed return-air plenum — only OFNP meets the plenum listing requirement. [NFPA 70-2023, Art. 770.113; Art. 770.154(a)]
- **B — Correct.** Segment 1: ADSS cable in a conduit running 45 ft from the building entry = within the 50-ft unlisted cable exception (770.154(a) Exception 1). The PE-jacketed ADSS cable is acceptable for the 45-ft conduit run. Segment 2: The suspended ceiling is an HVAC return air plenum. NEC 770.113 requires **OFNP (plenum-rated, nonconductive)** for any cable installed in a space used for environmental air movement. OFNR is NOT adequate in a plenum; only OFNP or OFCP qualifies. [NFPA 70-2023, Art. 770.113; Art. 770.154(a) Exception 1]
- **C — Incorrect.** There is no hospital exception to the 50-ft rule — the NEC does not differentiate by building occupancy type for this provision. More importantly, OFN in a confirmed plenum space is a code violation regardless of conduit — conduit does not upgrade a non-plenum-rated cable to plenum acceptable status. [NFPA 70-2023, Art. 770.113; Art. 770.154(a)]
- **D — Incorrect.** The 50-ft exception applies to the unlisted cable from the building entry point — it is measured from the building entry, not from any interior point. The 45 ft brings the cable to the splice case, where the exception ends. The cable cannot continue as ADSS PE beyond that 45-ft run into the plenum (which is already at 45 ft + additional distance = well past 50 ft from entry point before reaching the splice case). Even if the splice case were at the entry point, the plenum run (80 ft further) would require OFNP — unlisted PE cable is never acceptable in a plenum space, even within 50 ft of entry. [NFPA 70-2023, Art. 770.113; Art. 770.154(a)]

---

## Final Check: Pulse Questions

**Pulse 1.** List the three fire-rating levels in the NEC Article 770 nonconductive cable hierarchy from highest to lowest, name the space each applies to, and state the substitution rule.

*Expected answer:*
1. **OFNP** (Optical Fiber Nonconductive Plenum) — highest fire rating; required in air-handling plenums and ducts used for environmental air. Can substitute for OFNR or OFN anywhere.
2. **OFNR** (Optical Fiber Nonconductive Riser) — mid fire rating; required in vertical shafts and risers passing through two or more floors. Can substitute for OFN but NOT for OFNP in plenums.
3. **OFN** (Optical Fiber Nonconductive) — lowest fire rating; general purpose indoor use only. Cannot be used in riser or plenum spaces.
[NFPA 70-2023, Art. 770.113]

**Pulse 2.** State the 50-ft unlisted cable exception: what it permits, what condition must be met, and what happens at 50 ft.

*Expected answer:* NEC 770.154(a) Exception 1 permits unlisted (PE-jacketed OSP) cable to enter a building and continue up to **50 ft** from the building entry point, provided the cable is **enclosed in a raceway (conduit)** for the full interior run. Beyond 50 ft from the building entry point, the cable must be transitioned to a listed cable type (splice to OFN/OFNR/OFNP as applicable to the space). Good design practice: splice at or near the building entry, do not design to the 50-ft limit. [NFPA 70-2023, Art. 770.154(a) Exception 1]

---

## Glossary Cross-References

- **OFN/OFNR/OFNP taxonomy** → T1 L1.7 (fiber cable types introduced; Article 770 listing extended in this lesson)
- **NEC Art. 770 scope boundary** → L4.1 (NESC governs up to building entry; NEC takes over at entry point); L4.6 (Art. 800 cross-reference — Article 800 governs communications wiring in a parallel regulatory track to Article 770 for copper; some buildings have both)
- **Firestop (770.24)** → T5 L5.xx (building entry hardware — the physical seal products and their installation)
- **AHJ edition caveat** → L4.1 (framework); NEC 2023 edition cited here; AHJ may have adopted 2020 or 2017
- **Plenum vs. riser space** → T5 L5.xx (raceway selection for plenum vs. riser — conduit type also changes by space classification)
- **50-ft exception** → L4.6 (Art. 800 has a parallel provision for copper communications cable entering buildings — same 50-ft exception concept)
