---
title: "NEC Article 250 — Grounding Code Basis for OSP Entry Points"
duration_min: 20
topic: osp-domain-4-standards-codes
order: 8
bicsi_alignment: "BICSI OSP-DRD Ch. 3.1"
sources:
  - "NFPA 70-2023 (NEC) Article 250"
  - "NFPA 70-2023 (NEC) 250.52, 250.94"
  - "BICSI OSP-DRD Ch. 3.1"
  - "1751F-630 §6.3"
---

# NEC Article 250 — Grounding Code Basis for OSP Entry Points

## Learning Objectives

By the end of this lesson you will be able to:

1. Explain why OSP cable entering a building triggers NEC Article 250 grounding requirements.
2. Identify the NEC section (250.94) that requires an intersystem bonding termination (IBT) and state its location requirement.
3. List the primary grounding electrode types recognized by NEC 250.52, and identify which type is typically encountered at commercial OSP entry points.
4. Interpret a riser detail drawing to locate an IBT omission and specify the corrective action with code citation.
5. State where the detailed installation practice for grounding electrode systems is covered in this training program (Topic 6), and why this lesson stops at the code-pointer level.

---

## Reading Content

### Why OSP Triggers NEC Article 250

OSP cable enters a building carrying electrical potential: lightning-induced voltages, power-line induction from parallel utility runs, and (for metallic cables) ground potential differences between remote points and the building electrical system. These potentials must be controlled at the building entry to protect equipment and personnel. The mechanism for controlling them is a bonded grounding system, and **NEC Article 250** is the code that establishes the requirements for that system.

Art. 250 is a Chapter 2 article. As noted in L4.6, NEC Art. 800.3 establishes that Chapters 1–7 do not govern communications circuits **unless** specifically referenced by Art. 800. NEC 800.100(B) explicitly requires the communications protector grounding conductor to terminate at one of the points listed in that section — and the intersystem bonding termination (IBT) described there is itself **required by Art. 250.94**. This is the link: Art. 800 brings Art. 250 in by reference, making 250.94 directly applicable at every OSP cable entry point.

This is a code-citation lesson. Grounding electrode installation — conductor sizing, burial depth, connection methods, electrode spacing — is **Topic 6** material. This lesson establishes what the code requires and where; Topic 6 covers how to install it.

---

### NEC 250.94 — Intersystem Bonding Termination (IBT)

**NEC 250.94** requires that service equipment for buildings with interior wiring systems include a means for connecting intersystem bonding conductors. This means is the **intersystem bonding termination (IBT)**.

Key requirements from NEC 250.94 (NFPA 70-2023):

| Requirement | Detail |
|---|---|
| **Where required** | At the service equipment of every building that has an interior wiring system |
| **Location** | External to the service equipment enclosure, or at an accessible location (such as at a meter base or on the exterior of the service panel) |
| **Device** | Must be a listed intersystem bonding termination device or bar |
| **Connections supported** | Must provide a minimum of three terminals for intersystem bonding conductors (communications, CATV, network, antenna, etc.) |
| **Accessibility** | Must be accessible to workers from communications utilities without requiring access to the electrical enclosure itself |

The IBT is the hub of intersystem bonding. When a telephone company technician installs the demarcation protector, they run their 14 AWG grounding conductor to the IBT — not into the electrical panel. When a cable TV installer grounds a coaxial protector, same destination. When an OSP fiber or copper entry is made, the communications protector ground from Art. 800.93 or the bonding conductor from Art. 770.100 terminates at the IBT. All of these intersystem conductors bond to the same single point, which is itself bonded to the building's grounding electrode system.

**Why the IBT location matters:** the IBT must be accessible to communications workers who may not be electrical contractors and who should not open electrical panels. Placing the IBT external to the service enclosure — or in the meter base location — satisfies this requirement. A riser detail that shows the communications protector ground conductor disappearing into the electrical panel is a drawing that should prompt a question: is the termination point inside the panel accessible to the communications crew?

---

### NEC 250.52 — Grounding Electrode Types

The grounding electrode system to which the IBT ultimately bonds is made up of one or more **grounding electrodes**. NEC 250.52 lists the recognized types. For OSP entry contexts, the relevant electrodes are:

| Electrode Type | NEC 250.52 Reference | Typical OSP Relevance |
|---|---|---|
| **Metal underground water pipe** | 250.52(A)(1) | Common at commercial buildings — a metallic water main within 5 ft of building entry is a recognized electrode; also a permitted direct termination point under Art. 800.100 |
| **Metal frame of the building (structural steel)** | 250.52(A)(2) | Commercial/industrial buildings with steel frames; structure itself is the electrode |
| **Concrete-encased electrode (Ufer ground)** | 250.52(A)(3) | Steel rebar ≥ 20 ft encased in concrete foundation footing; highly effective, commonly required for new construction |
| **Ground ring** | 250.52(A)(4) | Bare copper conductor ≥ 20 ft encircling the building, buried ≥ 2.5 ft; used where soil conditions favor it |
| **Rod and pipe electrodes** | 250.52(A)(5) | Ground rods (8 ft minimum for copper-clad steel, galvanized steel); the most commonly installed supplemental electrode when other types are unavailable |
| **Plate electrodes** | 250.52(A)(7) | Buried metal plates; less common for commercial OSP entry |

For typical commercial OSP installations, the Ufer ground (concrete-encased electrode) is the preferred and often code-required electrode for new buildings. The IBT bonds to the grounding electrode conductor (GEC) that connects to this electrode. For retrofit situations on older buildings, existing ground rods or the metallic water pipe are the most commonly found electrodes.

**OSP designer's practical take:** you do not need to select or specify the grounding electrode type — that is the electrical contractor's scope, governed by NEC 250.52's hierarchy and the local AHJ's requirements. Your role as an OSP designer is to confirm that:

1. An IBT exists at the service equipment location, and
2. Your protector's grounding conductor (14 AWG minimum per Art. 800.93) terminates at that IBT.

If the riser detail does not show an IBT, flag it. Cite 250.94 as the omission. Refer the electrical scope to the AHJ. Topic 6 covers installation practice beyond this code-pointer level.

---

### The IBT in the OSP Entry Detail

The typical OSP cable building entry detail — whether for a copper telco cable or a fiber entry via metallic messenger — should show five elements in the Art. 250 / Art. 800 compliance check:

1. **Entry conduit or sleeve** — properly sealed (duct seal or equivalent).
2. **Protector** — listed, located as close as practicable to entry.
3. **Protector grounding conductor** — minimum 14 AWG copper, green or bare (Art. 800.93).
4. **IBT** — present at or near service equipment, accessible, listed, minimum 3 terminals (Art. 250.94).
5. **Grounding conductor path** — conductor from protector goes to IBT without ambiguity; IBT bonded to building grounding electrode system.

Any detail missing item 4 is non-compliant with 250.94. Any detail where item 3 terminates at an un-identified or inaccessible point is suspect.

**Optical fiber exception:** for all-dielectric self-supporting (ADSS) optical fiber with no conductive elements, there is no metallic path carrying surge energy, so an Art. 800 protector is not required. The grounding requirement at the building entry is instead governed by Art. 770 — specifically whether the cable transitions to conductive or nonconductive in-building fiber and whether any metallic messenger needs to be bonded. That scope is covered in L4.5. The IBT is still the right landing point for any Art. 770 bonding conductors.

---

### Scope Boundary — Topic 6

This lesson deliberately stops at the code-pointer level. The following are **Topic 6** (Grounding and Bonding for OSP) topics — do not confuse them with the code-basis content taught here:

- Grounding electrode conductor (GEC) sizing (NEC Table 250.66)
- Electrode installation: burial depth for ground rods, rod spacing, concrete-encased electrode rebar requirements
- Bonding conductor sizing for intersystem conductors
- Soil resistivity measurement and electrode performance
- RUS bulletin 1751F-630 §6.3 grounding requirements for rural utility plant
- Measured ground resistance targets (NEC does not specify a resistance target; NESC Rule 097 and IEEE 81 do — see Topic 6)

If you find yourself wanting to know "how deep does the ground rod go?" or "what size is the GEC?" — those are correct questions to ask, and Topic 6 has the answers. This lesson's job is to give you the NEC sections to cite when you are reviewing a detail drawing and need to flag a grounding omission.

---

## Key Terms

> **NEC 250.94 — Intersystem Bonding Termination (IBT):** Code section requiring listed IBT device at every service equipment location with interior wiring; minimum 3 terminals; must be accessible to communications workers without opening the electrical panel.

> **NEC 250.52 — Grounding Electrode Types:** Section listing the recognized grounding electrodes (water pipe, structural steel, concrete-encased, ground ring, rod/pipe, plate). Establishes what qualifies as an electrode for the building grounding system.

> **Intersystem Bonding Termination (IBT):** Listed device that provides a common bonding point for communications, CATV, network, and other intersystem conductors — bonded to the building grounding electrode system via the grounding electrode conductor.

> **Grounding Electrode Conductor (GEC):** The conductor connecting the grounding electrode to the electrical service equipment. The IBT bonds to the GEC or to the grounding electrode system it feeds.

> **Concrete-Encased Electrode (Ufer Ground):** Grounding electrode per NEC 250.52(A)(3) — steel reinforcing bar(s) ≥ 20 ft long encased in concrete at the building foundation; one of the most effective electrode types due to moisture retention and large contact surface.

> **Ground Rod:** Supplemental grounding electrode per NEC 250.52(A)(5) — typically 8-ft copper-clad steel or galvanized steel driven into the earth; common retrofit choice when Ufer or structural electrodes are unavailable.

> **Applicability trigger (Art. 250 in OSP context):** NEC 800.100(B) references Art. 250.94 IBT as the preferred termination for communications protector grounding conductors, making Art. 250 applicable by cross-reference even though Art. 800.3 excludes Chapters 1–7 by default.

---

## Scenario Exercise — Riser Detail Drawing Review

You are reviewing permit drawings for a three-story office building. The OSP design shows a 24-pair copper cable entering at grade through a 1-in. EMT sleeve, with a listed protector on the interior wall at the entry point. A 14 AWG bare copper conductor runs from the protector ground lug upward to the second floor, where it terminates at a ground bar mounted on the electrical room wall — the ground bar is labeled "Telephone Ground Bar."

The electrical room on the second floor houses the service panel. The IBT is not shown on any drawing.

**Question:** Identify all Art. 250 and Art. 800 compliance issues with this detail. Specify the corrective action with code citations.

*Work through it before reading the answer below.*

---

**Answer:**

**Issue 1 — IBT not provided (NEC 250.94).**
NEC 250.94 requires a listed intersystem bonding termination device at the service equipment of every building with an interior wiring system. An unlisted "Telephone Ground Bar" does not satisfy this requirement. The IBT must be a listed device with a minimum of three terminals, external to or accessible without opening the service panel.

**Corrective action:** Install a listed IBT at or near the service equipment location on the second floor, external to the panel enclosure or in an accessible meter base location. The IBT must be listed per UL 467 or equivalent.

**Issue 2 — Grounding conductor termination at unlisted "Telephone Ground Bar" does not satisfy Art. 800.100 termination options.**
The 14 AWG copper conductor from the protector must terminate at one of the permitted points in NEC 800.100: the IBT (preferred), the grounding electrode conductor, grounded interior metallic water piping within 5 ft of entry, or accessible means external to the electrical service. A generic telephone ground bar that is not an IBT and not identified as one of these permitted points is not a compliant termination.

**Corrective action:** Reroute the 14 AWG conductor from the protector to the IBT once installed per Issue 1 above. Update drawing to show IBT with minimum 3 terminals and the protector grounding conductor landing on one terminal.

**What is correct in this detail:**
- Protector is listed and located at the building entry — compliant with the "as close as practicable" requirement of NEC 800.93.
- Conductor size is 14 AWG bare copper — meets the minimum of NEC 800.93.
- EMT sleeve sealed at entry — compliant.

**Topic 6 cross-reference:** Once the IBT is installed, the electrical contractor must confirm the IBT is bonded to the building grounding electrode system per NEC 250. GEC sizing and electrode type are electrical scope — see Topic 6 for OSP designer's reference on those specifications.

---

## Quiz

**Q1.** Which NEC section requires a listed intersystem bonding termination (IBT) at the service equipment of a building with an interior wiring system?

A. NEC 250.52
B. NEC 250.94 [CORRECT]
C. NEC 800.93
D. NEC 800.100

*Rationale:*
- **A — Incorrect.** NEC 250.52 lists the types of recognized grounding electrodes (water pipe, structural steel, concrete-encased electrode, ground rod, etc.). It does not establish the IBT requirement.
- **B — Correct.** NEC 250.94 specifically requires a listed intersystem bonding termination at the service equipment of buildings with interior wiring systems. The IBT must have a minimum of three terminals and be accessible without opening the electrical panel. This is the code provision that requires the IBT to exist; Art. 800.100 then references it as the preferred termination point for communications protector grounds. (NFPA 70-2023, Art. 250.94)
- **C — Incorrect.** NEC 800.93 establishes the protector grounding conductor requirements — minimum 14 AWG copper, routed as close as practicable with as few bends as possible. It does not establish the IBT requirement.
- **D — Incorrect.** NEC 800.100 lists the permitted termination points for the communications protector grounding conductor, with the IBT as the preferred point. However, it is 250.94 that requires the IBT to be provided — 800.100 references 250.94, it does not create the IBT requirement itself.

---

**Q2.** A riser detail for a commercial building shows no intersystem bonding termination (IBT). The communications protector grounding conductor is shown terminating on a bare copper lug attached directly to a concrete-encased electrode (Ufer ground) in the basement, bypassing the service equipment entirely. How should this detail be evaluated?

A. Compliant — the concrete-encased electrode is a recognized grounding electrode under NEC 250.52(A)(3), so bonding to it directly is acceptable
B. Non-compliant — the grounding conductor must connect to the IBT; direct connection to a grounding electrode is not a permitted termination under NEC 800.100
C. Compliant — NEC 800.3 excludes Chapters 1–7 from communications circuits, so Art. 250 electrode requirements do not apply to this installation
D. Non-compliant — the concrete-encased electrode is only permitted for structural steel buildings; rod electrodes are required for commercial construction

*Rationale:*
- **A — Incorrect.** While the concrete-encased electrode is a recognized electrode type under NEC 250.52(A)(3), the communications protector grounding conductor is not permitted to terminate directly on a grounding electrode. NEC 800.100 specifies the permitted termination points: IBT, grounding electrode conductor, metallic water piping within 5 ft of entry, or accessible means external to service. Bonding directly to the electrode bypasses the service equipment bonding system and does not satisfy 800.100.
- **B — Correct.** NEC 800.100 lists four permitted termination points for the communications protector grounding conductor. Terminating directly on a grounding electrode is not one of them. The correct path is: protector grounding conductor → IBT (preferred) or one of the other 800.100 permitted points → IBT/GEC → grounding electrode system. The missing IBT is itself a 250.94 violation. Corrective action: install listed IBT at service equipment; reroute conductor to IBT. (NFPA 70-2023, Art. 800.100; 250.94)
- **C — Incorrect.** Art. 800.3 excludes Chapters 1–7 by default — but Art. 800.100 explicitly references NEC 250.94 as the preferred IBT termination, bringing Art. 250 in by cross-reference for this specific purpose. This is the applicability trigger described in the lesson. The exclusion in 800.3 does not eliminate 250.94's reach into this context.
- **D — Incorrect.** The concrete-encased electrode (Ufer ground) is not limited to structural steel buildings — it is a recognized electrode for any building with a concrete foundation and steel rebar ≥ 20 ft per NEC 250.52(A)(3). The evaluation issue here is the path of the grounding conductor, not the electrode type.

---

## Final Check — Pulse Questions

**Pulse 1.** A new warehouse build has an OSP copper cable entry with a listed communications protector grounded with a 14 AWG conductor. The general contractor says, "The Ufer is in the foundation — just bond to that." Why is this instruction incorrect under the NEC, and what is the correct installation sequence?

*Expected answer:*
The instruction is incorrect because NEC 800.100 does not permit the communications protector grounding conductor to terminate directly on a grounding electrode. The permitted termination points are: (1) the IBT per NEC 250.94, (2) the grounding electrode conductor, (3) grounded metallic water piping within 5 ft of entry, or (4) accessible means external to service. Terminating on the Ufer electrode itself bypasses the service equipment bonding system and does not satisfy any of these permitted points.

The correct sequence is:

1. The electrical contractor installs a listed IBT at the service equipment per NEC 250.94, external to the panel enclosure, with minimum 3 terminals.
2. The electrical contractor bonds the IBT to the building's grounding electrode system (which includes the Ufer ground) via the grounding electrode conductor — this is electrical scope, governed by NEC 250 and Topic 6 practice.
3. The communications installer runs the 14 AWG protector grounding conductor from the protector ground lug to one terminal on the IBT.

The Ufer ground is properly in the system — just not as a direct termination for the protector conductor.

---

**Pulse 2.** You are reviewing a permit drawing for a fiber-optic entry using ADSS cable (all-dielectric, no metallic elements). A co-worker flags the drawing for a missing IBT and cites NEC 250.94. Is the co-worker correct that an IBT is required for this installation? Explain with code references.

*Expected answer:*
It depends on what is present at the entry point. For a fully all-dielectric ADSS cable with no metallic messenger, armor, or conductive elements, there is no metallic path carrying surge energy, so no Art. 800 protector or protector grounding conductor is required — and Art. 800.100's reference to Art. 250.94 is not triggered for the cable itself.

However, the IBT requirement under NEC 250.94 is **building-level**, not cable-specific. NEC 250.94 requires a listed IBT at the service equipment of every building with an interior wiring system — regardless of what type of communications entry is made. So even if this specific ADSS entry needs no protector, the IBT must be present at the service equipment for the building to satisfy 250.94. Any subsequent communications, CATV, or other intersystem conductor entry will need the IBT.

The co-worker is correct that the IBT is required — but the basis is the building-level 250.94 requirement, not the absence of an Art. 800 protector on this particular optical fiber entry. The detail should show the IBT; the ADSS entry itself may simply have no conductor landing on it for this cable.

For the optical fiber entry, the drawing should instead confirm Art. 770 compliance: firestop at rated penetrations (770.24), cable listing appropriate to the space (OFN/OFNR/OFNP as applicable per 770.113), and any metallic messenger bond if present. See L4.5 for the optical fiber building-entry compliance checklist.

---

## Glossary Cross-References

- **IBT and protector grounding conductor** — *See L4.6 (NEC Article 800 + Chapter 8)*: NEC 800.93 establishes the protector grounding conductor minimum size (14 AWG copper); 800.100 lists the permitted termination points with IBT as preferred; the present lesson (L4.7) establishes that the IBT is required at service equipment by 250.94.
- **Optical fiber entry grounding** — *See L4.5 (NEC Article 770 Optical Fiber In-Building)*: ADSS (all-dielectric) cable has no metallic surge path; Art. 770 bonding applies to metallic elements (messenger, armor) if present.
- **Grounding electrode installation practice** — *See Topic 6*: electrode burial depth, GEC sizing (NEC Table 250.66), rod spacing, measured resistance targets (NESC Rule 097, IEEE 81), RUS 1751F-630 §6.3 requirements.
- **RUS 1751F-630 §6.3** — Grounding requirements for RUS-funded aerial plant; specifies bonding practices at poles and building entries for RUS program work. See Topic 6 and L4.14 (RUS/USDA Bulletins).
