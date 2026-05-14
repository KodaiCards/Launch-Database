---
title: "Lesson 2: Cable Construction Basics — Loose-Tube vs Tight-Buffer"
duration_min: 25
topic: cable-selection
order: 2
bicsi_alignment:
  - "OSP-DRD 5.2: Optical cable construction types"
  - "OSP-DRD 5.4: Cable selection for outside plant environments"
sources:
  - "ANSI/TIA-568.3-D §6.4"
  - "ANSI/TIA-758-C §5.3 and §5.4"
  - "ANSI/TIA-472AAAB (loose-tube OSP fiber spec)"
  - "IEC 60794-1-1 (optical fiber cable — generic specification)"
  - "IEC 60794-3 (optical fiber cables for duct, conduit, and direct-buried installation)"
  - "BICSI OSP-DRD Manual, Ch. 5 §5.3 and Ch. 6 §6.2"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 3"
  - "CommScope Cabling Systems Reference Manual Ch. 5"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4"
---

# Cable Construction Basics — Loose-Tube vs Tight-Buffer

## In Plain English

A fiber optic cable is basically a bundle of hair-thin glass strands wrapped in layers of protective material — think of it like a garden hose protecting water pipes inside it. The glass carries the light signal; everything around it exists to keep that glass safe for 20–30 years outdoors. There are two completely different ways engineers design the protective layers around the glass, and the choice between them determines whether a cable belongs underground in your yard or inside a building's walls. This lesson explains both designs, why they exist, and when to use each one.

---

## Quick Acronym Reference

Every term below is defined fully the first time it appears in the reading. This list is here so you can flip back quickly.

| Acronym / Term | What it stands for | Plain-English gloss |
|---|---|---|
| **OSP** | Outside Plant | Everything outdoors — cables buried in the ground, strung on poles, or pulled through underground pipes |
| **OD** | Outer Diameter | The width of something measured across the outside |
| **µm** | Micrometer (micron) | One millionth of a meter — a human hair is about 70 µm wide |
| **GRP** | Glass-Reinforced Plastic | A fiberglass rod — light, strong, doesn't conduct electricity |
| **CSM** | Central Strength Member | The backbone rod running down the center of a cable |
| **ANSI/TIA-758-C** | American National Standards Institute / Telecommunications Industry Association standard 758 revision C | The rulebook that governs how outdoor fiber cables must be built |
| **ANSI/TIA-568.3-D** | TIA standard 568.3 revision D | The rulebook for indoor (premises) fiber cables |
| **ANSI/TIA-598-D** | TIA standard 598 revision D | The color-code rulebook for fiber cables |
| **IEC** | International Electrotechnical Commission | An international standards body |
| **NEC** | National Electrical Code | The U.S. code governing electrical and fiber installations inside buildings |
| **OFNR** | Optical Fiber Nonconductive Riser | An indoor cable rating — safe for running between floors of a building |
| **OFNP** | Optical Fiber Nonconductive Plenum | The strictest indoor cable rating — safe for air-handling spaces above ceilings |
| **ODF** | Optical Distribution Frame | A rack or cabinet where fiber cables terminate and connect to other cables or equipment |
| **AHJ** | Authority Having Jurisdiction | The local official or inspector who enforces building codes |

---

## Reading Content

### The Cable as a System

Think of a fiber optic cable the way you'd think of a well-armored garden hose. The water flowing through is the light signal. The hose walls are the cable's protective layers. Your job is to pick a hose that survives wherever it gets installed — buried under a road, hanging on a telephone pole, or running through office walls.

An optical fiber cable protects hair-thin glass strands — each one roughly the diameter of a human hair — through decades of outdoor exposure: burial forces, frost heave (the ground pushing up as it freezes), flooding, rodent attacks, and UV radiation from the sun. Two fundamentally different construction approaches have emerged to solve this problem: **loose-tube** and **tight-buffer**. Picking the right one is one of the first and most important decisions in outside plant engineering.

Both designs share the same outer layers: a central backbone rod, one or more fiber-carrying elements, optional filler pieces to keep the cable round, optional armor, and an outer jacket. What's different is the relationship between the glass fiber and the material directly surrounding it.

---

### Loose-Tube Construction

**The analogy:** Imagine putting a spaghetti noodle inside a drinking straw. The noodle can slide around inside the straw — it doesn't touch the walls unless you bend the straw sharply. Now imagine squeezing the straw from the outside. The noodle stays safe because the straw deforms before the noodle does. That's loose-tube construction.

In loose-tube cable, individual fibers (or ribbons of fibers) sit inside **buffer tubes** — hollow plastic cylinders typically 2.5 to 3.0 mm across (about the diameter of a thick spaghetti noodle). The fiber has plenty of room inside the tube: the tube's inner width is much larger than the 250 µm (micrometer) fiber, leaving an air gap or gel-filled space around the fiber. For reference, 250 µm is about one-quarter of a millimeter — barely visible to the naked eye.

This gap is the design's genius. When the cable gets squeezed, bent, or pulled — by soil pressure, frost heave, or cable-pulling equipment — the cable assembly absorbs those forces before the fiber does. The fiber floats freely inside the tube, shielded from the stress. That mechanical separation between the fiber and the outside world is why loose-tube construction is the standard for all outdoor (OSP) cable: direct burial, conduit, and aerial pole-line installations [BICSI OSP-DRD Manual, Ch. 5.3].

**Buffer tube fill — gel vs. dry water-blocking:**

Water getting into a fiber cable is a slow killer. Ice crystals damage fiber, and water wicking through the tube causes long-term signal loss. Loose-tube cables address this in one of two ways:

- **Gel-filled tubes:** The inside of each buffer tube is flooded with a thick, sticky gel (think petroleum jelly). The gel physically blocks liquid water from traveling through the tube along the fiber. This is the traditional approach for direct-burial and conduit cable in wet environments. The downside: at every splice point, technicians have to wipe all the gel off each fiber with solvent-soaked lint-free wipes before they can cleave (cut) and fuse the fiber. Skipping the cleanup causes splice failures and dirty equipment. [Corning OSP Reference, §3.2]
- **Dry water-blocking tubes:** A newer approach replaces the gel with water-swellable yarn or powder inside the tube. When water touches it, the material puffs up and seals the tube — like a foam plug blocking a hole. No gel to clean up at splice time. ANSI/TIA-758-C §5.3.2 accepts both approaches for outdoor cable. Dry cables are increasingly popular on new builds for faster splicing; gel-filled cable is still common in existing plants. [ANSI/TIA-758-C §5.3.2; AFL OSP Cable Design Guide, §2.4]

**Tube count and fiber capacity:**

Standard loose-tube OSP cables stack buffer tubes around a **central strength member (CSM)** — either a dielectric glass-reinforced plastic (GRP) rod (like a fiberglass arrow shaft — strong, non-conductive) or a steel wire in armored versions [IEC 60794-3, §4.1]. The tubes wind helically around this backbone in a controlled spiral, which lets the cable flex and stretch slightly without the spiral tightening around the fibers.

Common configurations:
- **6-tube cable:** 6 buffer tubes × 12 fibers per tube = **72 fibers total**
- **12-tube cable:** 12 tubes × 12 fibers per tube = **144 fibers total**
- **High-density:** up to 432 fibers packed into a cable roughly 1 to 1.25 inches across, using tubes loaded with 12-fiber ribbons [ANSI/TIA-758-C §5.4; Corning OSP Reference, §3.3]

Buffer tubes are color-coded using a standard 12-color sequence per ANSI/TIA-598-D so any technician in the country can identify which tube is which. The fibers inside each tube are also color-coded the same way. A fiber's "address" in the cable is: **tube color + fiber color**. For example, "Brown tube, Yellow fiber" identifies one specific glass strand out of 144. This is covered in depth in Lesson 6.

---

### Tight-Buffer Construction

**The analogy:** Now instead of a spaghetti noodle in a drinking straw, imagine coating the noodle in a thick layer of rubber right up against the noodle — no gap. The rubber moves with the noodle. That's tight-buffer construction.

In tight-buffer cable, each fiber gets a **secondary buffer coating** — a plastic material applied directly over the fiber's existing 250 µm primary coating, building the fiber up to a standardized **900 µm outer diameter** (that's 0.9 mm — about the width of a pin) [ANSI/TIA-568.3-D §6.4.2]. There is no gap or gel between the fiber and this buffer; the buffer is physically bonded to the fiber.

This direct contact is both tight-buffer's strength and its weakness:

**Strength — direct connectorization:** Because the buffer hugs the fiber at a standard 900 µm diameter, standard connectors (SC, LC, ST — the plug-like ends you push into equipment) grip the buffer directly. No special hardware needed. With loose-tube cable, the fiber is only 250 µm — too skinny for standard connectors. You'd need to add a furcation kit (a small tube that builds the fiber back up to 900 µm) before you can put a connector on it. Tight-buffer skips that step. [CommScope Reference Manual, Ch. 5.2]

**Weakness — mechanical sensitivity:** Because the buffer is glued to the fiber, any force applied to the cable transmits directly into the glass. Burial forces, frost heave, conduit-pull friction — all of it goes straight to the fiber. Over time this causes **microbends** (tiny kinks that scatter light and increase signal loss) and eventually fiber fracture. Tight-buffer cable is also not gel-filled — it has no water-blocking at the individual fiber level. [BICSI OSP-DRD Manual, Ch. 5.3.3]

**Where tight-buffer belongs:**
- Indoor riser runs between floors of a building
- Premises cabling inside offices and data centers
- Short outdoor-to-indoor transition segments where direct connectorization matters

ANSI/TIA-568.3-D §6.4 specifies tight-buffer for premises (indoor) cable. ANSI/TIA-758-C §5.2 specifies loose-tube for outdoor (OSP) distribution and feeder cable. These are the governing rulebooks — follow them and you won't go wrong.

---

### Breakout Cable: A Special Version of Tight-Buffer

Breakout cable (also called fanout cable) takes the tight-buffer concept further: each 900 µm tight-buffer fiber gets its own individual mini-jacket with strength fibers wrapped around it, forming a "cable within a cable." Cut the outer jacket and you have several independently jacketed sub-cables — each ready to connect directly without any extra hardware [AFL OSP Cable Design Guide, §3.1].

Breakout cable is heavy, expensive per fiber, and is only used for:
- Short indoor runs where each fiber goes to a separate piece of active equipment
- Small fiber counts (2–12 fibers) in equipment rooms

Breakout cable is **never** specified for outdoor cable routes. It cannot survive burial, long conduit pulls, or outdoor UV exposure.

---

### Selecting Between Designs: Decision Framework

| Criterion | Loose-Tube | Tight-Buffer | Breakout |
|---|---|---|---|
| OSP backbone / feeder | **Required** [ANSI/TIA-758-C §5.2] | Not permitted | Not permitted |
| Direct burial | **Required** | Not appropriate | Not appropriate |
| Conduit pull (long haul) | **Required** | Not appropriate | Not appropriate |
| Aerial (on poles) | **Required** | Not appropriate | Not appropriate |
| Indoor riser (OFNR) | Not typical | **Standard** [ANSI/TIA-568.3-D §6.4] | Acceptable |
| Indoor plenum (OFNP) | Not typical | **Standard** | Acceptable |
| Direct connectorization at the cable end | Needs furcation kit first | **Native 900 µm** | **Native per sub-unit** |
| Splicing at splice closures (standard field practice) | **Standard** | Less common | Rarely spliced |

**The OSP-to-indoor handoff:** A direct-burial or conduit cable entering a building typically stops at a termination panel or **ODF (Optical Distribution Frame)** near the building entry point. From there, an indoor tight-buffer cable takes over. You cannot run a gel-filled outdoor cable through a building's interior — outdoor jacket materials are not tested to the fire-rating standards required indoors. NEC Article 770 requires indoor fiber cable to carry an OFNR or OFNP flame rating; outdoor OSP cables don't have those ratings [NEC Article 770.49; ANSI/TIA-758-C §1.2]. More on this in Lesson 6 (sheath fire ratings).

---

## Key Terms (Flashcard Candidates)

**Loose-tube construction**
OSP cable design where fibers sit inside hollow buffer tubes that are much wider than the fibers, leaving room for the fiber to shift under mechanical stress without touching the tube walls. Gel-filled or dry water-blocking. Required for direct-burial, conduit, and aerial outdoor routes. [ANSI/TIA-758-C §5.3]

**Tight-buffer construction**
Indoor cable design where a secondary plastic coating is applied directly onto each fiber, building it from 250 µm to 900 µm in diameter. No gap between fiber and buffer; they move together under stress. Standard for indoor riser and plenum cabling; never used for outdoor burial or long conduit runs. [ANSI/TIA-568.3-D §6.4]

**Buffer tube**
The hollow plastic cylinder in a loose-tube cable that houses one or more fibers (or ribbons). Typically 2.5–3.0 mm across. Color-coded per ANSI/TIA-598-D. [IEC 60794-3, §4.1]

**Central strength member (CSM)**
The backbone rod at the center of a loose-tube cable — usually a fiberglass (GRP) rod or steel wire — that prevents the cable from kinking or buckling during installation. Carries no fiber signal. [IEC 60794-3, §4.1]

**Flooding compound / tube gel**
Thick gel inside loose-tube buffer tubes that blocks water from traveling along the fiber. Requires solvent cleaning before splicing. [Corning OSP Reference, §3.2]

**Dry water-blocking**
An alternative to gel: water-swellable yarn or powder inside buffer tubes that expands on contact with moisture to seal the tube. Accepted by ANSI/TIA-758-C §5.3.2; eliminates gel cleanup at splice points. [AFL OSP Cable Design Guide, §2.4]

**Breakout cable (fanout cable)**
A tight-buffer variant where each fiber gets its own individual sub-jacket and strength fibers. Allows direct connection without any extra hardware. Not for outdoor use. [AFL OSP Cable Design Guide, §3.1]

**Furcation kit (fan-out kit)**
A hardware assembly that adds a 900 µm tube around each individual fiber from a loose-tube cable, building them up so standard connectors can grip them. Required whenever you want to put connectors on the ends of a loose-tube cable. [CommScope Reference Manual, Ch. 5.3]

**Aramid yarn (Kevlar)**
High-strength synthetic fibers (the same material in bulletproof vests) used as strength members in tight-buffer and breakout cables. Provides strain relief — the connector's crimp ring grabs the aramid yarn so pulling force never reaches the glass fiber. [ANSI/TIA-568.3-D §6.4.2]

**Water-swellable tape / yarn**
A material in the outer layers of some cable designs (loose-tube or tight-buffer OSP versions) that expands when wet, blocking water from seeping lengthwise through the gap between buffer tubes. [ANSI/TIA-758-C §5.3.3]

---

## Interactive: Drag-and-Drop — Label the Cross-Section

**[image:loose-tube-vs-tight-buffer-cross-section.svg]**

*Image description for SVG illustrator:*

Two side-by-side cable cross-section diagrams, drawn to consistent scale.

**Left diagram — Loose-Tube OSP Cable (12-fiber, 6-tube, gel-filled):**
- Outermost ring (black/grey): PE sheath — label: **Polyethylene (PE) sheath**
- Next ring inward (grey hatched): armor layer (corrugated steel tape or dielectric) — label: **Armor layer (optional)**
- Next element: water-swellable tape wrap — label: **Water-swellable tape**
- 6 colored circles arranged around the central member, each ~3 mm OD: buffer tubes, color-coded — label: **Buffer tubes (6× color-coded)**
- Fill material between tubes: flooding compound fill — label: **Flooding compound**
- Central element (solid rod): central strength member — label: **Central strength member (GRP)**
- Inside one buffer tube (zoomed inset): 2 fibers floating in gel — label: **Fibers in gel (250 µm each)**

**Right diagram — Tight-Buffer Indoor Cable (6-fiber):**
- Outermost ring (orange): outer jacket (PVC or LSZH) — label: **Outer jacket (PVC/LSZH)**
- Inner bundling element: ripcord and inner sheath wrap — label: **Ripcord**
- 6 circles (tight-buffer fiber), each ~900 µm: buffered fibers, color-coded — label: **Tight-buffer fibers (900 µm each)**
- Each fiber surrounded by aramid yarn strands (dotted halo): — label: **Aramid strength yarn**
- Small central element (GRP or steel): central member — label: **Central member**

**Label cards (drag targets):**
Left diagram: PE sheath, Armor layer, Water-swellable tape, Buffer tubes, Flooding compound, Central strength member (GRP), Fibers in gel (250 µm)
Right diagram: Outer jacket, Ripcord, Tight-buffer fibers (900 µm), Aramid strength yarn, Central member

---

## Multiple-Choice Quiz

---

**Q1.** Which cable construction type is specified by ANSI/TIA-758-C for OSP feeder and distribution cable?

- A) Tight-buffer, 900 µm per fiber
- B) Breakout cable with individual sub-unit jackets
- C) Loose-tube with gel-filled or dry water-blocking buffer tubes **[CORRECT]**
- D) Tight-buffer with overall water-swellable sheath wrap

*Rationale:*
- **A — Incorrect.** Tight-buffer is the indoor cable standard, governed by ANSI/TIA-568.3-D §6.4. It cannot handle burial forces or provide tube-level water blocking, so it fails in outdoor environments before the fiber count even matters. [ANSI/TIA-568.3-D §6.4; ANSI/TIA-758-C §5.2]
- **B — Incorrect.** Breakout cable is a specialized indoor product for short equipment-room runs. It is not designed for outdoor routes and lacks both water-blocking and burial protection. [AFL OSP Cable Design Guide, §3.1]
- **C — Correct.** ANSI/TIA-758-C §5.3 specifies loose-tube construction for outdoor fiber cable, with gel-filled or dry water-blocking buffer tubes. Only loose-tube construction gives the fiber the mechanical separation and water protection it needs to survive buried or aerial for 30+ years. [ANSI/TIA-758-C §5.2, §5.3]
- **D — Incorrect.** A water-swellable sheath wrap is one layer in some cable designs, but it is not the defining feature and does not replace tube-level water blocking. Tight-buffer cable with a swellable wrap is still tight-buffer — it still transmits burial stress directly to the fiber and still has no gel in the tubes. [ANSI/TIA-758-C §5.3.3]

---

**Q2.** A technician opens a splice closure on a direct-burial OSP cable and finds individual fibers coated with thick gel. What does this indicate, and what is the required step before cutting (cleaving) the fiber?

- A) The cable is tight-buffer; no special preparation is needed
- B) The cable is gel-filled loose-tube; fibers must be cleaned with lint-free wipes and isopropyl solvent before cleaving **[CORRECT]**
- C) The cable is armored; the gel is a corrosion inhibitor, not a water block
- D) The cable is a breakout design; sub-unit jackets must be removed first

*Rationale:*
- **A — Incorrect.** Tight-buffer cables have no gel at all — the buffer is a solid plastic coating bonded directly to the fiber. Gel immediately identifies a loose-tube design. [Corning OSP Reference, §3.1]
- **B — Correct.** Gel-filled loose-tube cable floods every buffer tube with thick filling compound. Any residual gel on the fiber surface causes cleave failures (the blade slips on gel-coated glass), elevated splice loss (contamination at the fiber face), and splicer contamination. Proper technique: wipe from the buffer tube outward toward the cleave point using a lint-free wipe moistened with 99% isopropyl alcohol, two or three strokes in one direction. [Corning OSP Reference, §3.2; BICSI OSP-DRD Manual, Ch. 7.2]
- **C — Incorrect.** Armor corrosion protection comes from the armor material itself and from flooding compound between armor and sheath — not from gel inside the buffer tubes. Tube gel is purely for water-blocking. [IEC 60794-3, §4.2]
- **D — Incorrect.** Breakout cable sub-units have individual plastic jackets — they do not use gel. Breakout cable almost never appears in OSP direct-burial applications. [AFL OSP Cable Design Guide, §3.1]

---

**Q3.** What is the standard outer diameter of a tight-buffer fiber, and why does that number matter when you're putting connectors on the cable?

- A) 250 µm; this matches the primary coating diameter and fits standard LC ferrule bores
- B) 900 µm; this diameter is required for standard SC, LC, and ST connector crimp barrels **[CORRECT]**
- C) 125 µm; this is the glass cladding diameter, which fits all connector ferrule types
- D) 3.0 mm; this matches the buffer tube OD in loose-tube cable

*Rationale:*
- **A — Incorrect.** 250 µm is the primary coating — the first layer applied to the fiber right after it's drawn. This is the bare fiber inside a loose-tube buffer tube. Standard connectors are designed for 900 µm; a 250 µm fiber needs a furcation tube to reach that diameter before a connector can grab it. [ANSI/TIA-568.3-D §6.4.2]
- **B — Correct.** Tight-buffer construction adds a second plastic coating over the 250 µm primary coating, building the fiber up to exactly **900 µm** (0.9 mm). Standard SC, LC, ST, and FC connectors all use a crimp barrel sized for 900 µm — it grabs the buffer for strain relief, while the aramid yarn around it is captured under the crimp sleeve. This is why tight-buffer cable can be connectorized directly from the factory cut end, with no extra hardware. [ANSI/TIA-568.3-D §6.4.2; CommScope Reference Manual, Ch. 5.2]
- **C — Incorrect.** 125 µm is the cladding — the outer layer of the glass itself, common to all single-mode and multimode fibers. This dimension is relevant to fusion splicing (the splicer aligns the 125 µm glass cores), but you cannot grip bare glass with a connector without shattering it. [ITU-T G.652.D §3.1]
- **D — Incorrect.** 3.0 mm is the approximate outer diameter of a loose-tube buffer tube — the plastic cylinder that holds the fibers in an outdoor cable. It is not a fiber dimension. [IEC 60794-3, §4.1]

---

**Q4.** A fiber count of 144 is needed for a direct-burial route between two fiber distribution hubs (FDH — the big splice boxes where outdoor feeder cable terminates) 2.3 km apart. Which cable configuration is most appropriate?

- A) 144-fiber tight-buffer breakout cable, direct-buried
- B) 12-tube loose-tube cable, 12 fibers per tube, gel-filled, rated for direct burial **[CORRECT]**
- C) 144-fiber tight-buffer cable with PE sheath, direct-buried
- D) 72-fiber loose-tube cable, 6 tubes × 12 fibers, with a second cable in the same trench

*Rationale:*
- **A — Incorrect.** Breakout cable is tight-buffer. Burying tight-buffer cable transmits soil pressure and frost heave directly to the glass, and there is no tube-level water blocking — both fatal for a long-term direct-burial route. [BICSI OSP-DRD Manual, Ch. 5.3.3; ANSI/TIA-758-C §5.2]
- **B — Correct.** A 12-tube loose-tube cable at 12 fibers per tube (12 × 12 = 144 fibers) is the textbook answer for this scenario. Loose-tube keeps the fiber mechanically isolated; gel fill blocks groundwater; the PE outer jacket handles soil chemistry and UV. This is exactly what ANSI/TIA-758-C §5.3 specifies for this application. [ANSI/TIA-758-C §5.3; Corning OSP Reference, §3.3]
- **C — Incorrect.** "144-fiber tight-buffer with PE sheath" is not a real product category, and even if it were, tight-buffer construction still fails in burial environments for the same mechanical and water-blocking reasons. The sheath material does not fix the construction type. [ANSI/TIA-758-C §5.2]
- **D — Incorrect.** Two 72-fiber cables in the same trench costs more (two cable purchases, two pulls, two sets of cable ends to manage at each terminal), with no technical benefit. One 144-fiber cable does the job in a single pull. [BICSI OSP-DRD Manual, Ch. 6.2]

---

**Q5.** An OSP cable enters a building through a conduit stub-up and terminates at an ODF (Optical Distribution Frame — a rack where outdoor cable meets indoor cable) in the building entry room. The remaining fiber run goes from the ODF up to a telecom closet on the fourth floor. What construction types are appropriate for each segment?

- A) Loose-tube for both segments
- B) Loose-tube from conduit entry to ODF; tight-buffer OFNR-rated from ODF to fourth floor **[CORRECT]**
- C) Tight-buffer from conduit entry to ODF; loose-tube from ODF to fourth floor
- D) Breakout cable for both segments

*Rationale:*
- **A — Incorrect.** Loose-tube OSP cable with an outdoor jacket cannot be run through a building's riser shaft — NEC Article 770.49 prohibits non-OFNR/OFNP cable in riser spaces because outdoor jacket materials spread fire vertically between floors. [NEC Article 770.49; ANSI/TIA-758-C §1.2]
- **B — Correct.** The outdoor segment (conduit to building entry ODF) uses loose-tube per ANSI/TIA-758-C §5.2 — it needs burial protection, water blocking, and outdoor jacket materials. The indoor segment (ODF to fourth-floor closet) is a building riser run and must use OFNR-rated tight-buffer cable per ANSI/TIA-568.3-D §6.4 and NEC Article 770.49. The ODF is the physical handoff point between the two construction types. [ANSI/TIA-758-C §5.2; NEC Article 770.49; ANSI/TIA-568.3-D §6.4]
- **C — Incorrect.** Tight-buffer at the conduit entry would expose indoor-rated construction to burial forces and water at the building entry — exactly what loose-tube is designed for. And loose-tube in the riser violates NEC fire rating requirements. Both segments have the wrong cable. [ANSI/TIA-758-C §5.2; NEC Article 770.49]
- **D — Incorrect.** Breakout cable is indoor-only, expensive per fiber, and not rated for the conduit/burial environment at building entry. Even for the indoor riser segment, standard tight-buffer is the more cost-effective choice when individual per-fiber connectorization at the cable end is not required. [AFL OSP Cable Design Guide, §3.1]

---

**Q6.** In a 12-tube loose-tube cable filled to capacity at 12 fibers per tube, how would a technician identify the third fiber in the seventh buffer tube?

- A) Count tubes from the center outward; fiber color coding is not standardized
- B) Tube 7 is red (per TIA-598-D 12-tube color sequence); fiber 3 within that tube is green **[CORRECT]**
- C) Tube 7 is violet; fiber 3 is green
- D) Buffer tube identification uses alphanumeric labeling, not color coding

*Rationale:*
- **A — Incorrect.** ANSI/TIA-598-D establishes a fully standardized 12-color sequence for both buffer tubes and individual fibers. "Count from center" is not a standard method. [ANSI/TIA-598-D, Table 2]
- **B — Correct.** The TIA-598-D 12-position color sequence is: 1-Blue, 2-Orange, 3-Green, 4-Brown, 5-Slate, 6-White, **7-Red**, 8-Black, **9-Yellow**, 10-Violet, 11-Rose, 12-Aqua. The same sequence applies to fibers within the tube: fiber 1-Blue, 2-Orange, **3-Green**. So tube 7 is **red** and fiber 3 inside it is **green**. [ANSI/TIA-598-D, Table 1 and Table 2]
- **C — Incorrect.** Violet is position 10 in the TIA-598-D sequence, not position 7. Position 7 is red. The fiber color (green for position 3) is correct, but the tube color is wrong — making the identification wrong. [ANSI/TIA-598-D, Table 2]
- **D — Incorrect.** Some high-fiber-count cables add printed alphanumeric markings on tubes as a supplement, but the primary standardized identification system is the TIA-598-D color code. [ANSI/TIA-598-D, §4]

---

## Final Check

Answer these before moving on to Lesson 3 (Ribbon Cable & Mass-Fusion Splicing).

**Pulse 1.** Name the two functions of the gel filling inside a loose-tube buffer tube and describe how "dry water-blocking" achieves the same result.

*Expected answer:* Gel fill does two things: (1) **blocks water from traveling along the fiber inside the tube** — the gel is thick enough that water cannot push through it to reach the fiber; and (2) **cushions the fiber** — the gel fills the empty space around the fiber so the fiber cannot bang against the tube wall when the cable vibrates or bends. Dry water-blocking replaces gel with a water-swellable material (yarn or powder) that puffs up on contact with water, physically sealing the tube interior. The swellable material handles water-blocking but provides less cushioning — which is why gel-filled cable is still preferred in very wet or cold climates. [Corning OSP Reference, §3.2; AFL OSP Cable Design Guide, §2.4; ANSI/TIA-758-C §5.3.2]

**Pulse 2.** Explain why a tight-buffer cable cannot be direct-buried without causing long-term performance problems.

*Expected answer:* Tight-buffer cable has no gap between the fiber and its coating — they're bonded together. When you bury this cable, soil pressure, frost heave (the ground shifting as it freezes and thaws), and road traffic vibration all pass straight through the cable jacket into the buffer coating and then directly into the glass. Over time this creates **microbends** — tiny kinks in the fiber path that scatter light and increase signal loss (attenuation). In severe cases the fiber fractures. On top of that, tight-buffer cables have no gel or water-swellable material inside — any moisture that gets past the jacket reaches the fiber directly, causing hydrogen darkening and hydroxyl absorption that permanently increases loss at 1383 nm. Loose-tube construction prevents both failure modes. [BICSI OSP-DRD Manual, Ch. 5.3.3; ANSI/TIA-758-C §5.2]

**Pulse 3.** What NEC article governs indoor optical fiber cable, and what is the consequence of installing an OSP-jacketed loose-tube cable in a building riser without conduit?

*Expected answer:* NEC Article 770 governs fiber optic cable inside buildings. Article 770.49 says riser spaces (the vertical shafts that carry cable between floors) require OFNR-rated or higher cable. An outdoor OSP cable jacket is not tested or listed to OFNR flame-spread standards — if a fire breaks out and this cable is running through the riser without conduit, its jacket can catch and carry the fire vertically from floor to floor. The local inspector (AHJ — Authority Having Jurisdiction) would require the cable to be removed and replaced with listed indoor cable, or enclosed in approved conduit. [NEC Article 770.49; ANSI/TIA-758-C §1.2]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **Loose-tube construction** → Lesson 3 (ribbon fiber runs inside loose-tube ribbon cable), Lesson 4 (armored variants of loose-tube), Lesson 5 (microduct — a specialized loose-tube variant)
- **Tight-buffer construction** → Lesson 6 (sheath fire ratings apply to tight-buffer indoor cables), Lesson 8 (drop cables — tight-buffer used in some short indoor/outdoor hybrid drops)
- **Buffer tube color coding** → Lesson 3 (ribbon cable uses a modified color system for ribbons inside a tube)
- **Flooding compound / gel** → Lesson 3 (ribbon cable tubes also use gel; same cleanup at mass-fusion splicing)
- **NEC Article 770** → Lesson 6 (sheath ratings — OFNR, OFNP, OFNG designations explained in full)
- **Furcation kit** → Lesson 9 (connector selection — MPO/MTP breakout assemblies are a specialized furcation product)
- **Central strength member** → Lesson 4 (armored cable — armor adds a second load-bearing layer around the CSM)
- **Water-swellable tape** → Lesson 4 (armored aerial and direct-burial variants use both water-swellable tape and armor for layered protection)
