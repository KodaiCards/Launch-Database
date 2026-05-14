---
title: "Lesson 5.4: Cable Hangers, J-Hooks, and Spacers"
duration_min: 20
topic: osp-hardware-accessories
order: 5
bicsi_alignment:
  - "BICSI OSP-DRD Ch. 6.3: Aerial strand hangers"
  - "BICSI OSP-DRD Ch. 6.4: Interior cable support"
sources:
  - "NFPA 70 (NEC) §800.24 (Interior cable support — communications cables)"
  - "ANSI/TIA-758-C §5.3 (OSP aerial lashing hardware)"
  - "ANSI/TIA-568.0-D §4 (Generic telecommunications cabling — cable support)"
  - "BICSI OSP-DRD Manual, Ch. 6.3–6.4"
---

# Cable Hangers, J-Hooks, and Spacers

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- State the maximum J-hook spacing on interior riser installations per NEC §800.24 and explain what this spacing prevents
- Distinguish between three support hardware types: J-hooks (interior riser), conduit hangers (conduit bundles), and aerial strand hangers (short aerial segments)
- Select the correct support hardware type for a given installation context (interior riser, conduit bundle, short aerial segment)
- Size a conduit strut for a bundled cable application based on combined cable weight per foot
- Identify the NEC code section that governs interior communications cable support spacing

---

## Reading Content

### Three Distinct Cable Support Contexts

Cable hangers and J-hooks are often used as interchangeable terms in field conversation, but they describe different hardware for different installation contexts. Misapplying the hardware type — using an aerial strand hanger inside a building, or using a J-hook on an exterior aerial span — produces an installation that either violates code or fails mechanically within the first winter. Understanding the three contexts and their correct hardware resolves the confusion.

**Context 1 — Interior riser (J-hook):** The fiber cable runs vertically inside a building between floors, attached at regular intervals to the building structure (stud, concrete, or steel column). No messenger strand; the cable's own jacket and, for armored cables, its armor carry the supported weight back to each attachment point. Code: NEC Article 800.

**Context 2 — Conduit bundle (conduit hanger or strut):** Multiple conduits or cables run in parallel horizontally or vertically through a building or in an exterior underground-to-aerial transition. Each conduit or bundle is supported by a beam clamp, strut channel, or trapeze hanger attached to the building structure. Code: NEC Article 300 for conduit support; NEC Article 800 for communications cables in bundles.

**Context 3 — Short aerial segment (aerial strand hanger / suspension bracket):** A cable spans a short aerial distance between two building attachment points or between a building and a pole — but is too short or impractical to justify full messenger-and-lashing construction. The cable is supported by clamp-type hangers attached to the building's exterior structure at one or both ends. This is the hardware overlap zone between full aerial construction (T5 L5.1–L5.3 scope) and building entry (NEC Article 800 scope).

---

### J-Hooks: Interior Riser Support

A **J-hook** (also called a cable hook or hammer hook) is a simple steel bracket with a curved hook profile that cradles one or more cables in an interior installation. The hook is attached to the building structure (stud, beam, concrete with a toggle bolt, or steel column) and the cable is laid into the hook without being tied or lashed — it rests under gravity.

**NEC §800.24 spacing requirement:** Interior communications cables installed in vertical risers must be supported at intervals not exceeding **36 inches** (3 feet). [NEC §800.24]

**Why 36 inches:** Without support, a riser cable hanging from its connection at the top floor would accumulate its own weight below the top attachment. Over multiple floors of unsupported run, the cable's weight would be concentrated at a single point — the top attachment — and the jacket, strength members, or internal fibers would be stressed beyond their rated vertical rise specification. The 36-in. maximum support interval distributes the cable's self-weight across multiple attachment points so that no single point carries more than 36 in. worth of cable weight. This is especially critical for high-fiber-count distribution cables where the jacket is the primary load-bearing element in riser runs.

**NEC §800.24 citation note:** This requirement is fully citable as a verbatim NEC code requirement. Quiz questions on J-hook spacing can carry [CORRECT] answers with NEC §800.24 citation.

**Load considerations for J-hook sizing:** J-hooks are rated by the combined cable weight they can hold — typically 25–50 lb per hook for standard telecom J-hooks. For high-fill riser bundles (multiple cables in the same hook), sum the cable weights per foot × 36-in. tributary length and verify the hook's rated load is not exceeded.

---

### Conduit Hangers and Struts

When multiple cables or conduits run in a conduit bundle — a parallel grouping of conduit or cable managed together for support and routing purposes — individual J-hooks are impractical. Instead, conduit bundles are supported with:

- **Beam clamps + threaded rod + channel strut:** the most common commercial approach. The strut (Unistrut or equivalent) spans between two threaded rods hanging from beam clamps or ceiling anchors. Conduits or cables rest in saddles or clamps along the strut.
- **Trapeze hanger:** a horizontal strut suspended by rods from above, sized to span the bundle width and carry the combined weight of all conduits and cables in the bundle.

**Strut sizing for bundled cable weight:** calculate the total cable bundle weight per foot (sum of all cable unit weights × number of cables). Multiply by the tributary length between support points. Verify the strut's allowable uniform distributed load (UDL) from the manufacturer's load table exceeds the calculated load.

**Example:** 8 cables at 0.38 lb/ft each, on a 5-ft span between trapeze hangers:
- Total weight = 8 × 0.38 × 5 = 15.2 lb per hanger location
- Select strut rated for ≥ 15.2 lb at 5-ft span (virtually any standard 1-5/8 in. Unistrut at this loading — confirm from manufacturer span/load tables)

---

### Aerial Strand Hangers: Short Aerial Segments

For a short aerial cable span between two structures — a parking lot crossing, a building-to-outbuilding link under 150 ft, or a cable loop over a loading dock — full lashed messenger construction is often excessive. The alternative is an **aerial strand hanger (suspension bracket)**: a clamp-type bracket that attaches to the building's exterior wall or fascia and cradles the cable (or a short messenger section) at each end of the aerial segment.

**Distinguishing from interior J-hooks:** aerial strand hangers are weather-rated (stainless steel or galvanized hardware), designed for cyclic mechanical loading from wind and thermal expansion, and typically larger and heavier than interior J-hooks. They are not NEC §800.24 hardware — they are exterior hardware subject to NESC Rules 238 and 261 for clearance and structural load, respectively, when installed on utility structures.

**When aerial strand hanger vs. full messenger construction:** use aerial strand hangers when:
- Span ≤ ~150 ft (above this, sag from cable dead weight alone at even moderate tension can violate clearance)
- No ice loading district applies (light-district routes only; Medium or Heavy district requires full strand analysis)
- Building attachment structures are confirmed adequate for the cable tension load

For any span where sag-tension analysis is required (see L5.2b), full messenger-and-lashing construction (L5.1–L5.3) is the correct approach, not a strand hanger.

---

## Key Terms (Flashcard Candidates)

**J-hook**
Interior cable support hardware: a steel bracket with a curved hook profile that cradles communications cables on interior riser or horizontal runs. No attachment to cable required — cable rests in hook under gravity. Maximum spacing: 36 in. per NEC §800.24. Load-rated for the total cable weight supported between hooks.

**NEC §800.24**
NEC section governing support of interior communications cables (Article 800 covers outside plant communications cables entering buildings). Maximum vertical riser support spacing: **36 inches**. Violation risks concentrating cable self-weight at a single attachment point, stressing the cable beyond its rated vertical rise specification.

**Conduit strut (Unistrut / channel strut)**
Horizontal structural channel used to support conduit bundles or cable trays across a span between vertical supports. Sized from manufacturer span/load tables for the combined weight of all cables in the bundle over the tributary length.

**Trapeze hanger**
A horizontal strut suspended from threaded rods, used to support multiple conduits or cables in a bundle. Common in commercial telecom room conduit installations.

**Aerial strand hanger**
Weather-rated exterior clamp bracket that supports a cable or short messenger segment at the building attachment point for short aerial crossings. Appropriate for spans ≤ ~150 ft in NESC Light district. Not a substitute for full messenger-and-lashing construction on spans requiring sag-tension analysis.

**Conduit bundle**
A grouped assembly of multiple conduits or cables managed together for support, routing, and identification purposes. Supported by strut hangers or trapeze hardware rather than individual J-hooks.

---

## Interactive: Drag-and-Drop — Support Hardware by Context

**[image:support-hardware-context-diagram.svg]**

*Three installation contexts shown: (1) interior cable riser in a multi-story building, (2) horizontal conduit bundle below a cable tray in a telecom room, (3) short aerial cable crossing between two buildings.*

*Hardware label cards: J-hook, conduit strut, trapeze hanger, aerial strand hanger, beam clamp.*

**Drag-and-drop to match hardware to context:**

1. Interior riser (vertical, multi-floor cable run) → **J-hook** (max 36-in. spacing, NEC §800.24)
2. Conduit bundle below cable tray → **Beam clamp + threaded rod + conduit strut** or **trapeze hanger**
3. Short aerial building-to-building crossing → **Aerial strand hanger**

*Correct placement: green highlight + citation. Incorrect: red highlight with one-line explanation.*

---

## Quiz — Cable Hangers, J-Hooks, and Spacers (5 Questions)

---

**Q1.** Per NEC §800.24, what is the maximum vertical support spacing for interior communications cables in a building riser?

- A) 24 in.
- B) 36 in. **[CORRECT]**
- C) 48 in.
- D) 60 in.

*Rationale:*
- **A — Incorrect.** 24 in. is more restrictive than the NEC §800.24 requirement. While a shorter spacing is not a code violation, 24 in. is not the NEC maximum and would over-specify the installation.
- **B — Correct.** NEC §800.24 requires interior communications cables in vertical risers to be supported at intervals not exceeding **36 inches (3 feet)**. This spacing distributes the cable's self-weight across multiple attachment points so no single point is loaded with more than 3 ft of cable weight. [NEC §800.24]
- **C — Incorrect.** 48-in. spacing exceeds the NEC §800.24 maximum of 36 in. A 48-in. spacing would result in the cable being unsupported across a 4-ft length, concentrating weight at each support point above the code-allowable loading.
- **D — Incorrect.** 60-in. spacing is 5 ft between supports — significantly beyond the NEC §800.24 maximum. This spacing would exceed the rated vertical rise capacity of most OSP distribution cable jackets.

---

**Q2.** Which of the following installation contexts requires aerial strand hanger hardware rather than interior J-hooks?

- A) A 96-fiber OSP cable running from the second floor to the fourth floor of a building on a riser conduit
- B) A 72-fiber distribution cable crossing a 100-ft parking lot between two buildings on an exterior aerial segment **[CORRECT]**
- C) A cable bundle in a horizontal tray inside a telecom equipment room
- D) A vertical feeder cable in an interior conduit from basement to penthouse equipment room

*Rationale:*
- **A — Incorrect.** An interior riser cable on conduit inside a building is an interior installation governed by NEC Article 800. J-hooks or conduit strut hardware is appropriate; aerial strand hangers are exterior weather-rated hardware not designed for or needed in this context.
- **B — Correct.** A 100-ft exterior aerial cable crossing between two buildings is a **short aerial segment** — the correct hardware is an **aerial strand hanger** mounted on each building's exterior structure. Aerial strand hangers are weather-rated, designed for cyclic wind and thermal loading, and appropriate for short spans where full messenger-and-lashing construction is not required. Interior J-hooks are not weather-rated and are not designed for aerial tension loading. [BICSI OSP-DRD Ch. 6.3]
- **C — Incorrect.** A horizontal cable tray is an interior installation. Cable trays use tray-specific hardware and channel clamps, not aerial strand hangers or J-hooks (though J-hooks may support individual cables leaving the tray).
- **D — Incorrect.** An interior conduit riser from basement to penthouse is an interior NEC Article 800 installation. The conduit carries the cable; the conduit itself is supported by conduit clamps at the code-required intervals. J-hooks are not applicable inside a conduit; aerial strand hangers are not applicable inside a building.

---

**Q3.** A telecom contractor is installing a conduit bundle of 6 conduits (each weighing 0.45 lb/ft including cable fill) on a trapeze hanger. The trapeze hangers are spaced 5 ft apart. What is the minimum load rating required for each trapeze hanger assembly?

- A) 2.7 lb
- B) 6.75 lb
- C) 13.5 lb **[CORRECT]**
- D) 27.0 lb

*Rationale:*
- **A — Incorrect.** 2.7 lb corresponds to the weight of a single conduit at 5 ft × 0.45 lb/ft = 2.25 lb — close to 2.7 lb but neither calculates the full bundle load nor accounts for all 6 conduits.
- **B — Incorrect.** 6.75 lb = 0.45 lb/ft × 5 ft × 3 conduits — half the conduit count. The calculation must include all 6 conduits.
- **C — Correct.** Total bundle weight per hanger = 6 conduits × 0.45 lb/ft × 5 ft tributary length = **13.5 lb**. Each trapeze hanger must be rated for at least 13.5 lb. Select strut and rod hardware from the manufacturer's span/load table confirming rated capacity ≥ 13.5 lb at 5-ft span spacing.
- **D — Incorrect.** 27.0 lb = 13.5 lb × 2 — double the correct result. This would correspond to a 10-ft hanger spacing with the same bundle, or 6 conduits at 0.90 lb/ft — neither of which matches the problem.

---

**Q4.** Which NEC article and section is the specific citation authority for the 36-inch maximum vertical support spacing for interior communications cables?

- A) NEC Article 300 (General Wiring Methods)
- B) NEC Article 770 (Optical Fiber Cables and Raceways)
- C) NEC §800.24 (Interior Communications Cables — support) **[CORRECT]**
- D) NEC Article 250 (Grounding and Bonding)

*Rationale:*
- **A — Incorrect.** NEC Article 300 governs wiring methods for electrical conductors (power). Communications cables in riser applications are governed by their applicable communications article (Article 800 for telephone/data/OSP cables entering buildings), not Article 300.
- **B — Incorrect.** NEC Article 770 governs optical fiber cables and raceways for the cable itself and its fire ratings. Article 770 does not specifically address the maximum support spacing for interior communications cable risers — that requirement is in Article 800.
- **C — Correct.** **NEC §800.24** is the specific code section governing support of interior communications cables, including the 36-inch maximum vertical riser support interval. Article 800 covers communications circuits, including outside plant cables that enter buildings. Section 800.24 specifically addresses cable support requirements. [NEC §800.24]
- **D — Incorrect.** NEC Article 250 addresses system grounding and bonding — not cable mechanical support. Article 250 is not a citation authority for riser support spacing.

---

**Q5.** An aerial strand hanger is being considered for a 200-ft building-to-building cable crossing in Macon, GA (NESC Light district). What factor most limits the application of aerial strand hangers at this span?

- A) Aerial strand hangers are not rated for ASTM A475/A475M messenger wire
- B) At 200 ft, midspan sag from cable dead weight alone may require formal sag-tension analysis and likely full messenger-and-lashing construction **[CORRECT]**
- C) NEC §800.24 prohibits aerial strand hangers on spans longer than 150 ft
- D) Aerial strand hangers cannot be used with fiber optic cable; only copper cable is permitted

*Rationale:*
- **A — Incorrect.** Aerial strand hangers are designed to attach to messenger wire or to building structures to support cable. The issue at 200 ft is not the hanger's compatibility with the messenger material — it is the sag and tension that develop in the cable over a long unsupported span.
- **B — Correct.** At 200 ft, cable dead weight alone produces significant midspan sag regardless of the attachment hardware type. For a 0.380 lb/ft cable at 200-ft span, even a modest sag-to-span ratio of 2% (4 ft of sag) produces meaningful horizontal tension at the attachment points. Verifying that the building attachment structure and the cable's rated tensile load are not exceeded at 200 ft requires the sag-tension analysis from L5.2b. When analysis shows tension approaching the cable's rated limit or the attachment's structural capacity, the appropriate solution is full messenger-and-lashing construction (distributing tension to a strand rather than directly into the cable's strength members). [IEEE Std 1222-2011 §5; BICSI OSP-DRD Ch. 6.3]
- **C — Incorrect.** NEC §800.24 governs interior communications cable support spacing — it does not address exterior aerial span limits. NEC does not specify a maximum span length for aerial strand hangers.
- **D — Incorrect.** Aerial strand hangers are routinely used with fiber optic cable. The fiber optic cable's rated vertical rise or tensile load limit may be the governing constraint at long spans, but the hardware type itself does not prohibit fiber optic cable.

---

## Final Check: Pulse Questions

**Pulse 1.** State the maximum support spacing for interior communications cable in a vertical riser and identify the governing NEC section. Explain what structural problem this spacing prevents.

*Expected answer:* Maximum riser support spacing: **36 inches**, per **NEC §800.24**. Without this spacing, a communications cable hanging in a vertical riser accumulates its self-weight below the top attachment point. Over multiple unsupported floors, the total cable weight concentrates at the top support, stressing the cable's jacket and strength members beyond their rated vertical rise specification. The 36-in. spacing distributes weight across multiple attachment points so no single hook carries more than 36 in. worth of cable weight.

**Pulse 2.** A short aerial cable crossing of 80 ft between two buildings in Macon, GA (Light district) is being designed. Which support hardware type is appropriate, and what is the key condition under which you would escalate to full messenger-and-lashing construction instead?

*Expected answer:* An **aerial strand hanger** is appropriate for an 80-ft crossing in the NESC Light district (no ice, modest wind). Escalate to full messenger-and-lashing construction if: (a) sag-tension analysis shows cable horizontal tension exceeds the cable's rated tensile load at the required clearance; (b) the span exceeds ~150 ft where sag becomes significant; (c) the loading district is Medium or Heavy, where ice accumulation drives tension well above Light-district levels; or (d) the attachment structure cannot be confirmed adequate for the calculated tension load.

---

## Glossary Cross-References

- **Messenger wire and lashing** → L5.2a, L5.2b, L5.3: the full aerial strand support system for main distribution spans
- **NESC Rules 238, 261** → L5.1: clearance and safety factor requirements apply to aerial strand hanger installations on utility structures just as they apply to full aerial construction
- **Aerial drop hardware** → L5.5: the hardware that brings the cable from the aerial strand (or main span) down to the building entry point
- **NEC Article 800** → governs interior communications cable entry, fire rating, and support spacing; cross-ref for indoor portions of routes where J-hook spacing applies
