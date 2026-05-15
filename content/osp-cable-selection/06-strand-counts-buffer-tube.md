---
title: "Lesson 6: Strand Counts & Buffer-Tube Allocation"
duration_min: 25
topic: cable-selection
order: 6
bicsi_alignment:
  - "OSP-DRD 5.2: Optical cable construction types"
  - "OSP-DRD 5.3: Fiber type selection criteria"
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
sources:
  - "ANSI/TIA-758-C §5.3 and §5.4"
  - "ANSI/TIA-598-D (fiber optic cable color coding)"
  - "ANSI/TIA-568.3-D §6.3 and §6.4"
  - "IEC 60794-1-1 (optical fiber cable — generic specification)"
  - "IEC 60794-3 (optical fiber cables for duct, conduit, and direct-buried installation)"
  - "BICSI OSP-DRD Manual, Ch. 5 §5.3–5.5"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 3"
  - "CommScope Cabling Systems Reference Manual Ch. 5"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §2–3"
---

# Strand Counts & Buffer-Tube Allocation

## In Plain English

When you order a fiber cable, one of the first decisions is: how many glass strands does it need to contain? The answer is not "however many circuits I need right now." It's "however many circuits I need right now, multiplied by enough to cover growth for the next 20–30 years" — because digging up the ground or stringing new pole cable is enormously expensive compared to buying a cable with extra fibers in it from the start. This lesson explains how to calculate a fiber count, how cables organize those fibers into color-coded bundles you can actually identify in the field, and what those mystery solid rods are that sometimes appear when you open a cable cross-section.

---

## Quick Acronym Reference

| Acronym / Term | What it stands for | Plain-English gloss |
|---|---|---|
| **OSP** | Outside Plant | Outdoor cable infrastructure |
| **FPT** | Fibers Per Tube | How many individual glass strands are in one buffer tube |
| **CSM** | Central Strength Member | The backbone rod at the center of the cable |
| **GRP** | Glass-Reinforced Plastic | A fiberglass rod — light, stiff, non-conductive |
| **ANSI/TIA-598-D** | TIA standard 598 revision D | The color-code rulebook that standardizes how fiber cables are color-coded |
| **ANSI/TIA-758-C** | TIA standard 758 revision C | The outdoor fiber cable rulebook |
| **BICSI** | Building Industry Consulting Service International | A professional association that publishes the OSP-DRD design manual |
| **OSP-DRD** | Outside Plant Design Reference — Design | BICSI's main reference manual for outdoor fiber network design |
| **Dark fiber** | (not an acronym) | Installed fiber strands that carry no active signal — spare capacity waiting to be used |
| **OD** | Outer Diameter | The width of something measured across the outside |

---

## Reading Content

### Why Strand Count Is a Design Decision, Not Just a Demand Match

Here's a principle that surprises a lot of people new to OSP design: **you never specify a cable to match exactly what you need today.**

Think of it like putting in a water main under a street. The pipe is expensive to install, but the pipe itself — the material — is cheap compared to the labor, equipment, and road repairs involved. So when you're digging, you put in a bigger pipe than you need today, because the cost difference between a 6-inch pipe and a 12-inch pipe is tiny compared to what it costs to dig the street up again in five years when demand grows.

Fiber is the same. A cable installed once is expected to carry traffic for 20–30 years [BICSI OSP-DRD Manual, Ch. 5.5]. The cost difference between a 24-fiber cable and a 48-fiber cable is small compared to the cost of opening a trench, running new conduit, or erecting new aerial strand a second time. Every OSP strand-count decision has to balance three things: **present circuit demand**, **growth headroom** (extra fibers sitting dark and unused now, but ready), and **cable size constraints** (how big a conduit you're pulling into, how much weight a pole attachment can handle).

ANSI/TIA-758-C §5.5 recommends specifying at least **twice the active fiber count** as total installed fiber on any new route. In practice, experienced designers often go 3–4 times the current count on feeder routes where bandwidth demand compounds quickly. [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]

---

### Buffer Tube Architecture: How Fibers Are Organized Inside the Cable

A standard OSP loose-tube cable organizes fibers into **buffer tubes** — hollow plastic cylinders about 2.5–3.0 mm across (roughly the diameter of a thin pencil lead, but hollow) — stranded in a spiral around a central backbone rod called the **CSM (Central Strength Member)**. Each tube holds a fixed number of fibers — most commonly 12, though 6-fiber and 24-fiber tubes also exist. [IEC 60794-3, §4.1; Corning OSP Reference, §3.3]

**The math is simple:**

Total fiber count = number of tubes × fibers per tube (FPT)

Let's work through it:
- A **6-tube cable at 12 FPT**: 6 × 12 = **72 fibers total**
- A **12-tube cable at 12 FPT**: 12 × 12 = **144 fibers total**
- A **12-tube ribbon cable** (each tube holds 12 ribbons of 12 fibers each): 12 × 12 × 12 = **1,728 fibers** in a cable not much bigger than a garden hose, using high-density ribbon stacking [ANSI/TIA-758-C §5.4; Corning OSP Reference, §3.3]

**What the CSM (Central Strength Member) does:**

The CSM is the backbone rod down the center of the cable. In fully non-metallic (all-dielectric) designs it's a GRP rod — a fiberglass stick. In armored designs it's sometimes a steel wire. The CSM does one thing: it prevents the cable from kinking or buckling during installation. It carries no fiber, no signal — it's purely structural. [IEC 60794-3, §4.1]

**Why the tubes spiral (lay length):**

Buffer tubes wind in a controlled helix around the CSM rather than running straight. That controlled spiral — called the **lay length** (the distance along the cable axis in which a tube completes one full revolution) — serves two purposes: it lets the cable flex and stretch slightly without the spiral tightening on the fibers, and it distributes bending stress evenly among all tubes when the cable curves. If the tubes ran straight, the tube on the outside of any bend would get stretched while the tube on the inside got compressed — the spiral distributes that evenly instead. [ANSI/TIA-758-C §5.3; IEC 60794-3, §4.2]

---

### Color Coding: ANSI/TIA-598-D — How You Find One Fiber Among Hundreds

Imagine opening a splice closure on a 144-fiber cable. You need to find one specific fiber to splice. With 144 strands of glass that all look identical, you need a system that lets you zero in on the right one without guessing. ANSI/TIA-598-D provides that system: a standardized 12-color sequence applied to both the buffer tube jackets and the individual fiber coatings within each tube. [ANSI/TIA-598-D, §4]

**Standard 12-color sequence (in order):**

| Position | Color |
|---|---|
| 1 | Blue |
| 2 | Orange |
| 3 | Green |
| 4 | Brown |
| 5 | Slate |
| 6 | White |
| 7 | Red |
| 8 | Black |
| 9 | Yellow |
| 10 | Violet |
| 11 | Rose |
| 12 | Aqua |

*Source: [ANSI/TIA-598-D, Table 2]*

The same sequence applies at **two levels**: the tube level (the tube's color tells you its position in the cable cross-section) and the fiber level (the fiber's buffer color tells you its position within its tube). Together, those two colors form a two-part address that uniquely identifies any fiber in a cable of up to 144 fibers.

**Example:** "Brown tube / Yellow fiber" means: the buffer tube at position 4 (Brown = position 4 in the sequence) → fiber at position 9 within that tube (Yellow = position 9). That's one specific glass strand out of 144. This two-part address is what every splice map, as-built drawing, and OTDR trace label is based on. [BICSI OSP-DRD Manual, Ch. 5.3; AFL OSP Cable Design Guide, §3.1]

---

### Cables With More Than 144 Fibers

The 12-tube × 12-fiber system addresses up to 144 fibers cleanly. Beyond 144, the color sequence would repeat (you can't have two "blue" tubes in the same cable without confusion). ANSI/TIA-598-D solves this with two additional layers:

**Binder groups:** Tubes are wrapped in small groups of 12 using a colored binder yarn or stripe. The binder color identifies the group; the tube color identifies position within the group; the fiber color identifies position within the tube. Now the full fiber address is three parts: **binder color + tube color + fiber color**. A 24-tube cable has 2 binder groups of 12 tubes each. [ANSI/TIA-598-D, §5]

**Unit stranding:** For very high fiber counts (288, 432, 864, and above), multiple tube bundles — each a full 12-tube / 144-fiber unit — are assembled around the CSM and wrapped with color-coded binder tapes. This scales the cable's capacity into the hundreds or thousands of fibers while keeping the identification system unambiguous at every level. [Corning OSP Reference, §3.4; CommScope Reference Manual, Ch. 5.3]

---

### Filler Tubes: Why There Are Solid Rods Where Tubes Should Be

When a cable is designed to hold 12 tubes but you only need 72 fibers right now (6 tubes' worth), the manufacturer fills the empty tube positions with **filler tubes** — solid or hollow plastic rods the same size as the buffer tubes. These rods carry no fiber and serve no optical purpose. Their job is purely physical: keeping the cable's cross-section round and preventing the outer jacket from collapsing inward into the empty tube slots, which would press on the active fiber tubes and cause microbend loss. [AFL OSP Cable Design Guide, §2.3; IEC 60794-3, §4.1]

**Filler tubes are completely normal.** They are a design feature, not a defect. A cable with filler tubes is a cable with spare capacity — the filler positions can be replaced with active fiber tubes on a future build-out. When you document a cable at installation, note which positions are fillers and exclude them from fiber-count totals.

---

### Strand Count Rules of Thumb

| Route type | Minimum design multiple | Rationale |
|---|---|---|
| Feeder (backbone, central office to aggregation node) | 4× active count | Feeder replacement is extremely expensive; bandwidth demand compounds fast |
| Distribution (node to FDT or closure) | 3× active count | Moderate replacement cost; branching topology multiplies risk |
| Drop (FDT to individual premise) | 2× active count | Short route, single-customer impact, lower replacement cost |
| Express (long-haul between exchanges) | 6× active count | Replacement is nearly impossible without service disruption; shared by many circuits |

*Source: [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]*

**One thing people consistently forget in fiber count calculations:** repair loop slack. Every splice closure along a route requires a minimum of **10 meters** of extra cable coiled up inside or around the closure — reserved slack for future re-splicing after damage. On a feeder route with 10 splice closures, that's 100 meters of extra cable consumed by slack alone (the equivalent of the fiber in a 100-meter cable section). Always add this to your cable order length. [ANSI/TIA-758-C §6.4]

---

## Key Terms (Flashcard Candidates)

**Buffer tube**
The hollow plastic cylinder in a loose-tube OSP cable that houses 6, 12, or 24 fibers (or 12 ribbon stacks). About 2.5–3.0 mm across. The tube is much wider than the fibers inside, creating a slip fit that mechanically separates the fiber from external cable stress. Color-coded per ANSI/TIA-598-D. [IEC 60794-3, §4.1]

**Central strength member (CSM)**
The backbone rod at the cable's center — a GRP (fiberglass) rod in all-dielectric cables or a steel wire in armored designs — that prevents kinking and buckling during installation. Carries no fiber. [IEC 60794-3, §4.1]

**Lay length**
The distance along the cable axis in which one buffer tube completes one full spiral revolution around the CSM. The controlled spiral lets the cable flex without tightening the tubes against the fibers, and distributes bending stress evenly among all tubes. [IEC 60794-3, §4.2; ANSI/TIA-758-C §5.3]

**ANSI/TIA-598-D color sequence**
The 12-position standard color code (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua) applied to buffer tube jackets and fiber coatings within each tube. Enables a two-part fiber address (tube color + fiber color) for cables up to 144 fibers. [ANSI/TIA-598-D, Table 2]

**Binder group**
A subset of up to 12 buffer tubes wrapped together with a colored binder yarn, extending the TIA-598-D color address system beyond 12 tubes. The binder color identifies which group of 12 tubes you're in; tube color identifies position within the group; fiber color identifies position within the tube. [ANSI/TIA-598-D, §5]

**Filler tube**
A solid or hollow plastic rod placed in a buffer tube position that carries no fiber. Keeps the cable's cross-section round and prevents the jacket from collapsing into vacant tube slots when a cable is ordered at less than full fiber capacity. Normal design feature — not a defect. [IEC 60794-3, §4.1; AFL OSP Cable Design Guide, §2.3]

**FPT (Fibers Per Tube)**
The number of individual fiber strands in a single buffer tube. Standard: 6, 12, or 24 FPT for stranded fiber; 12 ribbons × 12 fibers = 144 FPT for ribbon-loaded tubes. Multiply FPT × tube count to get total fiber count. [ANSI/TIA-758-C §5.4]

**Dark fiber**
Installed fiber strands that carry no active signal — available for future circuit activation or as immediate repair spares. Best practice: maintain dark reserves of at least 2× the active count on feeder routes. [BICSI OSP-DRD Manual, Ch. 5.5]

**Unit stranding**
High-fiber-count cable architecture where multiple tube bundles (each a complete 12-tube / 144-fiber group) are assembled around the CSM and wrapped with color-coded binder tapes. Scales total fiber count to 288, 432, 864+. [Corning OSP Reference, §3.4]

**Repair loop slack**
Extra cable coiled at each splice closure to allow future re-splicing after cable damage. ANSI/TIA-758-C §6.4 requires a minimum of 10 meters at each splice location. Must be included in cable order length calculations — often forgotten. [ANSI/TIA-758-C §6.4]

---

## Interactive: Drag-and-Drop — Decode the Cable Cross-Section

**[image:buffer-tube-allocation-diagram.svg]**

*Image description for SVG illustrator:*

A circular cable cross-section diagram, rendered from the outside inward:

- Outermost ring: outer PE sheath (grey)
- Next ring inward: optional armor layer (corrugated hatching), labeled "CST armor (where specified)"
- Helically arranged circles (buffer tubes), 12 positions around the central strength member. Each tube circle is filled with one of the 12 TIA-598-D colors (blue, orange, green, brown, slate, white, red, black, yellow, violet, rose, aqua) and labeled with its position number (1–12)
- Inside each buffer tube circle: 12 small dots representing individual fibers, arranged in a ring and color-coded per TIA-598-D sequence
- Center circle: the CSM (grey rod), labeled "Central Strength Member (GRP)"
- Below the cross-section: a "Fiber Address" decoder showing two dropdown selectors — "Tube Color" and "Fiber Color" — that together produce a fiber position (e.g., "Brown tube / Yellow fiber = Tube 4, Fiber 9")

Label targets for the drag-and-drop activity:
1. Outer PE sheath → position on outermost ring
2. CST armor → position on armor ring
3. Buffer tube (blue) → position on tube #1 circle
4. Buffer tube (aqua) → position on tube #12 circle
5. Individual fiber (blue) → position on fiber #1 within any tube
6. Central Strength Member → center circle
7. Filler tube → one tube position shown as solid (unfilled) cylinder, to be labeled

**Drag-and-drop mechanic:** Learner drags 7 label cards to correct diagram regions. Correct placement highlights green; incorrect highlights red with a one-sentence rationale.

---

## Multiple-Choice Quiz

---

**Q1.** An OSP engineer is specifying a feeder cable between a central office and a remote fiber distribution hub serving 18 active circuits today. Applying the BICSI OSP-DRD recommended design multiple for feeder routes, what is the minimum total fiber count the cable should carry?

- A) 18 fibers — match present demand exactly
- B) 36 fibers — 2× active count **[WRONG]**
- C) 72 fibers — 4× active count **[CORRECT]**
- D) 144 fibers — default to the maximum standard tube count

*Rationale:*
- **A — Incorrect.** Specifying only the active count leaves zero spare capacity for growth, repair loops, or new circuit additions. BICSI OSP-DRD Manual Ch. 5.5 explicitly warns against feeder routes specified at active-circuit parity — the cost to re-open a feeder route dwarfs the cable savings. [BICSI OSP-DRD Manual, Ch. 5.5]
- **B — Incorrect.** 2× is the minimum design multiple for **drop** routes (the short cable from the distribution terminal to a single customer's building), where replacement is relatively easy. Feeder routes aggregate traffic from many customers and are expensive to upgrade — BICSI recommends 4× for feeder routes. [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]
- **C — Correct.** 18 active circuits × 4 (BICSI feeder multiple) = 72 fibers minimum. A 72-fiber cable (6-tube / 12-FPT) is a standard catalog configuration. The 54 extra dark fibers cost very little now; replacing a feeder route later costs a fortune. [BICSI OSP-DRD Manual, Ch. 5.5; AFL OSP Cable Design Guide, §2.1]
- **D — Incorrect.** Defaulting to 144 fibers without a demand calculation isn't engineering — it's a guess. 144 fibers might be right on a high-growth feeder, but it should be the result of a documented calculation, not a default. [ANSI/TIA-758-C §5.5]

---

**Q2.** A splice technician is working on a 12-tube OSP cable and needs to locate fiber 9 in tube 7. Using the ANSI/TIA-598-D color sequence, what colors should the technician look for?

- A) Tube: Violet / Fiber: Red
- B) Tube: Red / Fiber: Yellow **[CORRECT]**
- C) Tube: Yellow / Fiber: Red
- D) Tube: Red / Fiber: Violet

*Rationale:*
- **A — Incorrect.** Position 10 in TIA-598-D is Violet, not position 7. Position 9 in the sequence is Yellow, not Red. Neither color matches the tube-7 / fiber-9 address. [ANSI/TIA-598-D, Table 2]
- **B — Correct.** The TIA-598-D sequence: 1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, **7-Red**, 8-Black, **9-Yellow**, 10-Violet, 11-Rose, 12-Aqua. Tube 7 = **Red**; Fiber 9 = **Yellow**. The target fiber is the yellow-coated strand inside the red buffer tube. [ANSI/TIA-598-D, Table 2]
- **C — Incorrect.** This reverses the tube and fiber colors. Yellow is position 9 — that's the fiber color, not the tube color for tube 7. [ANSI/TIA-598-D, Table 2]
- **D — Incorrect.** Tube 7 = Red (correct), but Fiber 9 = Yellow, not Violet. Violet is position 10 — that would be fiber 10 inside tube 7. [ANSI/TIA-598-D, Table 2]

---

**Q3.** During an as-built survey, a technician opens a 144-fiber cable cross-section and counts 12 tube positions but only 6 contain fiber. The other 6 positions contain solid plastic rods with no fiber. What are these rods, and do they indicate a cable defect?

- A) They are damaged buffer tubes that lost their fibers during installation — the cable is defective
- B) They are filler tubes; this is completely normal for a cable designed at maximum capacity but ordered at half capacity **[CORRECT]**
- C) They are dielectric armor rods — the cable was designed for direct burial but the wrong version was installed
- D) They are CSM segments that migrated from the center — the cable's strength member has failed

*Rationale:*
- **A — Incorrect.** Buffer tubes do not lose their fibers in normal installation — fibers sit in gel or water-swellable material and do not migrate out of the tube. Solid rods are a deliberate design feature. [AFL OSP Cable Design Guide, §2.3]
- **B — Correct.** Filler tubes are thermoplastic rods placed in tube positions where no fiber is needed in the current build-out. Their only job is to keep the cable round and prevent the outer jacket from collapsing into the empty slots, which would press on the active fiber tubes and cause microbend loss. A 12-tube cable with 6 active tubes and 6 fillers is a normal, standard product — document the filler positions in the as-built records and move on. [IEC 60794-3, §4.1; AFL OSP Cable Design Guide, §2.3]
- **C — Incorrect.** Dielectric armor is fiberglass tape applied at the sheath level — it wraps around the entire tube bundle, not as individual rods occupying tube ring positions. [ANSI/TIA-758-C §5.6.2]
- **D — Incorrect.** The CSM is a single element at the geometric center — it doesn't fragment into the tube ring positions. The solid rods in tube positions are a routine, benign feature. [IEC 60794-3, §4.1]

---

**Q4.** A cable manufacturer's data sheet shows: "288F / 24T / 12F per tube / unit stranding." How many binder groups does this cable have, and how many fibers per binder group?

- A) 1 binder group / 288 fibers per group
- B) 2 binder groups / 144 fibers per group **[CORRECT]**
- C) 4 binder groups / 72 fibers per group
- D) 24 binder groups / 12 fibers per group

*Rationale:*
- **A — Incorrect.** One binder group of 24 tubes would mean all 24 tubes share the same group — but the TIA-598-D color sequence only distinguishes 12 positions. With 24 tubes in one group, tube colors would repeat and identification would be ambiguous. [ANSI/TIA-598-D, §5]
- **B — Correct.** 24 tubes ÷ 12 tubes per binder group = **2 binder groups**. Each group has 12 tubes × 12 fibers per tube = **144 fibers**. The two groups are distinguished by their binder yarn colors, and within each group the standard TIA-598-D sequence identifies each tube and fiber. Complete fiber address in this cable: binder group color + tube color + fiber color. [ANSI/TIA-598-D, §5; Corning OSP Reference, §3.4]
- **C — Incorrect.** 4 binder groups of 6 tubes each is not standard. TIA-598-D is built around 12-tube groups. [ANSI/TIA-598-D, §5]
- **D — Incorrect.** 24 binder groups of 1 tube each defeats the purpose of binder groups (they exist to identify bundles, not individual tubes). This is not a real cable architecture. [ANSI/TIA-598-D, §5]

---

**Q5.** An OSP route has 10 splice locations. ANSI/TIA-758-C requires 10 meters of slack at each. The route distance is exactly the length of one cable drum. What minimum extra cable length must the engineer add to the order to cover all repair loop requirements?

- A) 50 meters
- B) 100 meters **[CORRECT]**
- C) 150 meters
- D) No minimum is specified — slack is left to installer discretion

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C §6.4 specifies 10 meters per splice location, not 5 meters. Five meters is not enough to support re-splicing after damage — you need to trim back damaged fiber and re-enter the splice tray, which consumes length from the slack coil. [ANSI/TIA-758-C §6.4]
- **B — Correct.** 10 splice locations × 10 meters per location = **100 meters** of additional cable needed just for repair loop slack coils. This is the equivalent of the fiber in a full 100-meter cable section, and it's the figure that most preliminary designs fail to include. Add it to the route distance when placing the cable order. [ANSI/TIA-758-C §6.4]
- **C — Incorrect.** 150 meters implies 15 meters per splice, which exceeds the ANSI/TIA-758-C §6.4 minimum of 10 meters. Extra slack is not a violation, but 150 meters is not the minimum the question asks for. [ANSI/TIA-758-C §6.4]
- **D — Incorrect.** ANSI/TIA-758-C §6.4 establishes a specific minimum. Leaving it to installer discretion produces inconsistent slack coils, some of which will be too short to allow future re-splicing. [ANSI/TIA-758-C §6.4]

---

**Q6.** A 432-fiber OSP feeder cable uses 36 buffer tubes arranged in three binder groups of 12 tubes each. A splice map indicates the target fiber is in "Binder 2 / Tube Aqua / Fiber Green." What is the absolute fiber number in the cable?

- A) Fiber 135
- B) Fiber 267
- C) Fiber 279 **[CORRECT]**
- D) Fiber 291

*Rationale:*

Let's work through this step by step using the TIA-598-D color positions:

**Step 1 — Identify the color positions:**
- Aqua = position **12** in the TIA-598-D sequence (blue/orange/green/brown/slate/white/red/black/yellow/violet/rose/**aqua**)
- Green = position **3** in the TIA-598-D sequence

**Step 2 — Calculate the Binder 1 offset:**
- Each binder group = 12 tubes × 12 fibers per tube = 144 fibers
- Binder 1 covers absolute fibers **1 through 144**
- So Binder 2 starts at absolute fiber **145**

**Step 3 — Calculate how many fibers come before Tube Aqua within Binder 2:**
- Tube Aqua is position 12 in the color sequence
- Tubes 1 through 11 come before it: 11 tubes × 12 fibers per tube = **132 fibers**

**Step 4 — Add Fiber Green's position within Tube Aqua:**
- Fiber Green = position 3
- So Fiber Green is the **3rd fiber** in Tube Aqua

**Step 5 — Add it all up:**
- 144 (all of Binder 1) + 132 (tubes 1–11 of Binder 2) + 3 (Fiber Green) = **279**

The answer is **absolute fiber 279**.

[ANSI/TIA-598-D, Table 2; ANSI/TIA-598-D, §5; BICSI OSP-DRD Manual, Ch. 5.3]

- **A — Incorrect.** 135 = (12−1)×12 + 3 = 132 + 3. This is the position within Binder 2 only — it forgets to add the 144 fibers from Binder 1. The question asks for the **absolute** number in the full 432-fiber cable. [ANSI/TIA-598-D, §5]
- **B — Incorrect.** 267 comes from incorrectly counting Binder 1 as 132 fibers (11×12) instead of the correct 144 (12×12). Binder 1 has all 12 tubes × 12 fibers = 144, not 11 tubes' worth. [ANSI/TIA-598-D, §5]
- **C — Correct.** 144 + (11×12) + 3 = 144 + 132 + 3 = **279**. [ANSI/TIA-598-D, Table 2; ANSI/TIA-598-D, §5]
- **D — Incorrect.** 291 = 144 + (12×12) + 3 = 144 + 144 + 3. This overcounts by using all 12 tubes of Binder 2 as the offset for Tube Aqua, instead of the 11 **preceding** tubes. The offset should be tubes before Tube Aqua (positions 1–11 = 11 tubes), not all 12 tubes. [ANSI/TIA-598-D, §5]

---

## Final Check

Answer these before moving on to Lesson 7 (Sheath Options & Fire Ratings).

**Pulse 1.** State the ANSI/TIA-598-D colors for tube 5 and fiber 11 in a standard 12-tube / 12-fiber-per-tube OSP cable.

*Expected answer:* Tube 5 = **Slate** (position 5 in the TIA-598-D sequence: blue, orange, green, brown, **slate**, white, red, black, yellow, violet, rose, aqua). Fiber 11 = **Rose** (position 11). Complete fiber address: Slate tube / Rose fiber. [ANSI/TIA-598-D, Table 2]

**Pulse 2.** A route requires a 288-fiber feeder cable. The cable has 24 buffer tubes with 12 fibers each. How many binder groups are required, and what does a complete fiber address look like?

*Expected answer:* 24 tubes ÷ 12 tubes per binder group = **2 binder groups** required. A complete fiber address needs three parts: (1) **binder group color** — tells you which group of 12 tubes you're in, (2) **tube color** — tells you which of the 12 tubes in that group, (3) **fiber color** — tells you which of the 12 fibers in that tube. Example: "Blue binder / Orange tube / Green fiber" uniquely identifies one glass strand in the 288-fiber cable. [ANSI/TIA-598-D, §5]

**Pulse 3.** Why do OSP designers specify 3–4× the current active fiber count on feeder routes rather than just matching demand?

*Expected answer:* Three reasons: (1) **Replacement cost** — opening a feeder route (trenching, conduit, aerial strand) costs orders of magnitude more than the cable itself. Extra fibers now cost almost nothing relative to a future dig-up. (2) **Compounding bandwidth demand** — feeder routes carry aggregated traffic from many downstream customers; demand grows rapidly and unpredictably. (3) **Repair loop slack** — ANSI/TIA-758-C §6.4 requires 10 meters of slack at each splice point; on a multi-splice feeder, that slack consumes real fiber budget. Dark fiber reserves absorb repair and re-routing needs without service impact. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5 and §6.4]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Buffer tube / FPT (fibers per tube)** → Lesson 2 (loose-tube construction), Lesson 7 (sheath options — tube count affects cable outer diameter and sheath wall thickness), Lesson 10 (environment selection — high-FPT ribbon tube cables for high-density feeder routes)
- **ANSI/TIA-598-D color sequence** → Lesson 3 (ribbon cable uses the same 12-color base sequence for ribbon identification), Lesson 2 (tube color-coding first introduced there)
- **Binder group / unit stranding** → Lesson 10 (environment selection — unit-stranded cables for backbone feeder applications)
- **Filler tube** → Lesson 7 (sheath options — cable OD with filler tubes is the same as at full fiber count; sheath sizing assumes full tube count)
- **Dark fiber / repair loop slack** → Lesson 10 (demand calculations), Lesson 12 (compliance — as-built documentation must record dark fiber positions and splice-point slack lengths)
- **Central Strength Member (CSM)** → Lesson 7 (sheath options — CSM material interacts with armor type), Lesson 4 (armored variants — steel CSM vs. GRP CSM)
