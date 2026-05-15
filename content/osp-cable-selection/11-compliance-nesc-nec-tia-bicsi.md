---
title: "Lesson 11: Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI"
duration_min: 25
topic: cable-selection
order: 11
bicsi_alignment:
  - "OSP-DRD 5.6: Compliance requirements for outside plant cabling"
  - "OSP-DRD 6.3: Regulatory and standards compliance for OSP installations"
  - "OSP-DRD 7.1: Documentation and as-built records"
sources:
  - "ANSI/TIA-758-C §3, §5.2, §6.1–6.5, and §7"
  - "NESC (National Electrical Safety Code) C2-2023, Rules 230, 232, 250–251, 352, 354"
  - "NEC (NFPA 70) Article 770, Article 800 (for copper reference)"
  - "ANSI/TIA-526-7 (OTDR testing for multimode fiber plant)"
  - "ANSI/TIA-568.3-D §11 (field testing of optical fiber cabling)"
  - "BICSI OSP-DRD Manual, Ch. 5–8"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed. Ch. 7"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4 §6"
  - "IEEE 1222 (all-dielectric self-supporting aerial fiber optic cable)"
---

# Compliance — NESC, NEC, ANSI/TIA-758-C, BICSI

## In Plain English

When you install fiber cable in the outside world — strung on poles, buried in the ground, going into buildings — there are rules you have to follow. This lesson is about those rules.

Think of it like building a house. You need to follow the building code for how the structure is framed, the electrical code for how the wiring is done, and your contractor's standard specifications for the materials to use. Miss any one of them and you fail inspection, void your insurance, or get a stop-work order.

Fiber cable has its own version of that stack:

1. **NESC** — the "power utility" safety code. Tells you how high the cable must hang over a road, how to protect against lightning, and how to connect metallic cable armor to the ground.
2. **NEC** — the "inside buildings" safety code. Tells you what type of cable you're allowed to run through ceilings, walls, and ductwork, and how far you can bring outdoor cable inside before it becomes a fire hazard.
3. **TIA-758-C** — the engineer's rulebook. Tells you how deep to bury cable, how much slack to leave at each splice point, and what tests to run when the job is done.
4. **BICSI OSP-DRD** — the designer's checklist. Tells you what drawings and records to produce before you start digging and again when the job is complete.

If you follow all four of these, your installation is "code-compliant, insurable, and professionally defensible" — meaning inspectors won't shut you down, your insurance covers problems, and your paperwork holds up if anyone questions the work later.

---

## Acronym Mini-Glossary

Every acronym used in this lesson, expanded AND explained in plain terms:

- **OSP** — Outside Plant. Everything outside the walls of a building: poles, buried conduit, direct-buried cable, aerial spans. Contrast with ISP (Inside Plant), which is the cabling inside buildings.
- **NESC** — National Electrical Safety Code. The federal safety code (published by IEEE, adopted by OSHA and state utility commissions) that governs all work on utility poles, power lines, and communication lines in public rights-of-way. Think of it as the "rules of the road" for utility linemen.
- **NEC** — National Electrical Code. The safety code (published by NFPA as NFPA 70) that governs all electrical wiring inside buildings in the United States. Local building codes almost universally adopt the NEC. Contains Article 770 specifically for fiber optic cables.
- **NFPA** — National Fire Protection Association. The organization that writes and publishes the NEC (NFPA 70) and many other fire safety standards.
- **AHJ** — Authority Having Jurisdiction. The government official or body who enforces the safety codes in a given area. Usually the local building department for NEC, and the state utility commission or OSHA for NESC. What the AHJ says goes — even if they're stricter than the written code.
- **ANSI** — American National Standards Institute. The U.S. national body that formally approves standards like TIA's. When you see "ANSI/TIA," it means TIA wrote it and ANSI endorsed it as a national standard.
- **TIA** — Telecommunications Industry Association. Publishes ANSI/TIA-758-C (the OSP engineering standard) and ANSI/TIA-568.3-D (the testing standard for fiber cabling).
- **TIA-758-C** — The specific TIA standard for Outside Plant Telecommunications Infrastructure. The "engineering rulebook" for OSP installations. Covers cable specs, burial depths, slack loops, labeling, and documentation.
- **BICSI** — Building Industry Consulting Service International. A professional association that publishes the OSP Design Reference (OSP-DRD), runs the RCDD and OSP certifications, and sets best-practice design guidelines.
- **OSP-DRD** — Outside Plant Design Reference. BICSI's design manual for OSP fiber networks. Not a legal safety code — it's a professional reference and best-practice guide, but RUS contracts and BICSI certification exams require following it.
- **ADSS** — All-Dielectric Self-Supporting. A type of aerial fiber cable that has no metal at all — no steel messenger wire, no metallic armor. It hangs from poles using its own non-metallic strength members. Because there's nothing metal to conduct electricity, it doesn't need to be grounded. See Lesson 4 for more on ADSS.
- **CST** — Corrugated Steel Tape. A metallic armor layer wrapped around a cable to protect it from rodents and mechanical damage when buried. Because it's metal, it DOES need to be grounded to prevent electric shock and lightning damage. See Lesson 4.
- **BET** — Building Entry Terminal. A sealed enclosure mounted at the point where a fiber cable enters a building. Provides the weatherproof seal where the outdoor cable ends and the indoor cable begins, and the mechanical transition between OSP sheath and indoor cable jacket. (Cross-reference: Lesson 7 introduced BET in the context of the NEC 50-foot rule.)
- **OFNR** — Optical Fiber Nonconductive Riser. An indoor-rated fiber cable jacket that passes the UL 1666 riser burn test — meaning it won't spread fire up a vertical shaft between floors. The "N" means non-conductive (no metal), "R" means rated for risers. Required in vertical runs between floors.
- **OFNP** — Optical Fiber Nonconductive Plenum. An indoor-rated fiber cable jacket that passes the stricter UL 910 plenum burn test — meaning it produces minimal smoke even if it catches fire. Required in air-handling plenum spaces (any space used for HVAC return air, typically above a drop ceiling). OFNP is the highest indoor rating and can substitute for OFNR anywhere.
- **OFN** — Optical Fiber Nonconductive (general). The lowest indoor fire-rating for fiber cable — suitable only for horizontal runs in general spaces, not risers or plenum. Not commonly used; most designers go straight to OFNR or OFNP.
- **PE** — Polyethylene. The black UV-resistant plastic used for outdoor OSP cable jackets. Tough, waterproof, and UV-stable for decades outdoors. Not fire-rated for indoor use. (Cross-reference: covered in Lesson 7 — sheath types.)
- **AWG** — American Wire Gauge. The U.S. measurement system for wire diameter. Counter-intuitively, bigger AWG numbers = thinner wire. 6 AWG copper wire is about 4 mm diameter — the minimum size for grounding metallic cable armor.
- **OTDR** — Optical Time-Domain Reflectometer. A test instrument that sends a laser pulse down the fiber and measures backscattered light to locate and measure splices, bends, breaks, and connectors — all without disconnecting the cable. Think of it like an ultrasound for fiber: you send a pulse in, and the echo pattern tells you what's happening along the entire length. Testing at 1310 nm AND 1550 nm is required for OSP fiber (explained in detail in the body).
- **OLTS** — Optical Loss Test Set. A calibrated light source + power meter used to measure the total signal loss from one end of a fiber link to the other. Where the OTDR tells you WHERE every loss happens, the OLTS tells you the TOTAL. Both tests are required for a complete acceptance test.
- **nm** — Nanometers. A unit of length used to describe light wavelength. 1 nanometer = 0.000000001 meters (one billionth of a meter). Fiber networks transmit at specific wavelengths: 1310 nm and 1550 nm for single-mode OSP cable, and 850 nm and 1300 nm for multimode.
- **OS2** — Optical Standard 2. The specific fiber type required for all OSP single-mode cable per TIA-758-C. Low-loss, tight-tolerance single-mode glass fiber conforming to ITU-T G.652.D. (Cross-reference: introduced in Lesson 1.)
- **SMF** — Single-Mode Fiber. Fiber with a very small core (8–10 µm) that carries one light mode at a time, enabling very long distances and high bandwidth. All OSP backbone and feeder fiber is SMF. (Cross-reference: Lesson 1.)
- **OSHA** — Occupational Safety and Health Administration. The federal agency that enforces worker safety regulations, including NESC compliance for utility workers.
- **RUS** — Rural Utilities Service. The USDA agency that provides loan funding for rural telecom infrastructure. RUS loan conditions require compliance with ANSI/TIA-758-C. If you're doing RUS-funded work — like Carter's PSC contracts — TIA-758-C compliance is a contractual requirement, not just a best practice.
- **ROW** — Right of Way. The legal strip of land along a road, railway, or easement where utility poles and buried cables are permitted to run.
- **RTL** — Rated Tensile Load. The maximum pulling force (in pounds or kilonewtons) that a cable is rated to withstand during installation — for example, when being pulled through a conduit. Exceeding RTL can stretch or break the fiber inside.
- **RSL** — Rated Sidewall Load. The maximum lateral pressure (in pounds per foot) that a cable can handle when it bends around a conduit bend or inside a curved duct without crushing the fiber. Exceeding RSL can cause macro-bends or crush the buffer tubes.
- **GPS** — Global Positioning System. Used in OSP documentation to record the exact location of buried cable runs, splice closures, and FDHs so that field crews can find them again years later.
- **FDH** — Fiber Distribution Hub. A large outdoor enclosure where feeder cable fibers are cross-connected to distribution cables. (Cross-reference: Lessons 8 and 9.)
- **FDT** — Fiber Distribution Terminal. A smaller outdoor enclosure closer to the customer. (Cross-reference: Lessons 8 and 9.)
- **NOC** — Network Operations Center. The central building or room where a telecom operator's engineers monitor and manage the network.
- **HVAC** — Heating, Ventilation, and Air Conditioning. Relevant in NEC Article 770 because plenum cable ratings apply to spaces used as HVAC return-air pathways.
- **dB** — Decibel. The unit for measuring signal loss (insertion loss) and backreflection (return loss) in fiber. (Cross-reference: introduced in Lesson 1.)
- **VFL** — Visual Fault Locator. A hand-held red-laser tester used to visually locate physical damage, tight bends, and broken connectors in a short fiber run. The red light leaks out visibly at the problem point. Not a precision instrument — more of a "sanity check" tool before pulling out the OTDR.

---

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Identify the four primary regulatory and standards bodies governing OSP fiber optic installations and describe the specific scope of each
- Apply NESC bonding and grounding requirements to metallic-armored cable installations at splice closures, building entries, and aerial attachment points
- Cite the applicable NEC Article 770 fire-rating requirements for optical fiber cable in riser, plenum, and general indoor spaces
- Apply ANSI/TIA-758-C labeling, documentation, and testing requirements to a completed OSP installation
- Identify the BICSI OSP-DRD documentation deliverables required at project closeout

---

## Reading Content

### The Compliance Landscape

Four regulatory and standards bodies govern OSP fiber optic installations in the United States. Each has a distinct scope and legal standing; they complement rather than duplicate each other. Compliance with all four is required for a code-compliant, insurable, and professionally defensible installation.

| Body | Primary document | Scope |
|---|---|---|
| NESC | C2-2023 National Electrical Safety Code | Safety of electrical supply and communication lines on public property; aerial clearances; underground installation safety; worker protection |
| NEC (NFPA 70) | National Electrical Code, current edition | Electrical safety inside buildings; fire ratings for indoor cable; Article 770 specific to optical fiber |
| ANSI/TIA | ANSI/TIA-758-C | Engineering standards for OSP telecommunications infrastructure; cable specifications, installation limits, documentation, testing |
| BICSI | OSP-DRD Manual | Best-practice design guidelines; exam-body reference for BICSI OSP Design credentials; supplements ANSI/TIA-758-C with design methodology |

NESC and NEC are safety codes enforced by authorities having jurisdiction (AHJ) — local building departments, utility commissions, OSHA. ANSI/TIA-758-C and BICSI OSP-DRD are standards and guidelines; compliance is required by contracts, utility regulations, and RUS loan conditions (which typically cite TIA-758-C specifically).

**Easy way to remember the difference:** NESC and NEC can get your job shut down by an inspector. TIA-758-C and BICSI OSP-DRD can get your contract canceled by your client. Both matter.

### NESC: Aerial Clearances and Grounding

The NESC governs all work on public rights-of-way, utility pole lines, and utility-owned underground infrastructure. Think of it as the rulebook written specifically for the people hanging and burying cable along public roads. Here are the key fiber-relevant provisions:

**NESC Rule 230 — How much load can aerial cable handle?**

"Loading" in this context means ice plus wind. In winter, ice builds up on aerial cable. In storms, wind pushes on it. The NESC divides the country into "loading districts" — zones defined by how bad the ice and wind conditions typically get. Every aerial cable and messenger wire must be designed to survive those worst-case conditions.

All aerial cable and messenger wire must be designed to survive the ice, wind, and combined ice-plus-wind loads of the applicable NESC loading district (light, medium, heavy, or extreme wind). ADSS cable must be rated by the manufacturer for span length, sag, and tension within the district's design parameters [NESC C2-2023, Rule 230].

**NESC Rule 232 — Clearances of wires from ground and other objects**

If a cable sags too much under ice load and droops down to where a truck can hit it, that's a code violation and a hazard. Rule 232 sets the minimum height the cable must clear over roads, railways, and waterways — even under maximum ice load when sag is at its worst.

Establishes minimum sag-to-clearance margins at maximum ice load for aerial cable crossing roads, railways, navigable waterways, and other circuits. At road crossings, the cable must clear the road surface by at least **18 feet (5.5 m)** in the heavy loading district; lesser clearances apply in lighter districts and for non-traffic crossings [NESC C2-2023, Rule 232]. Engineering design must verify sag calculations meet these minimums — specifying ADSS cable for a long span without verifying clearance at maximum ice load is a design error.

**NESC Rules 250 and 251 — The specific numbers for ice and wind**

These rules define the actual design loads for each district:
- Light district: 0.00 inches of ice + 9 pounds per square foot of wind
- Medium district: 0.25 inches of ice + 4 psf wind
- Heavy district: 0.50 inches of ice + 4 psf wind

All messenger wire, ADSS cable, and attachment hardware must comply with the appropriate district's load numbers [NESC C2-2023, Rules 250–251].

Macon, Georgia — where Launch Fiber Services is based — falls in the **Light** loading district per NESC. Projects near the Gulf Coast may have an Extreme Wind overlay applied on top of the base district.

**NESC Rules 352 and 354 — Underground installations**

Rule 354 applies to underground optical fiber cable: it requires adequate mechanical protection (conduit, burial depth), appropriate markings, and bonding of metallic elements. Rule 352 requires that metallic cable armor be grounded at intervals not exceeding **3 miles (4.8 km)** for cables of general construction, and at every splice closure and building entry for practical field installations [NESC C2-2023, Rules 352, 354].

**NESC bonding and grounding requirements for metallic armor**

"Bonding" means connecting the metallic armor of a cable to a grounding rod driven into the earth. Why? Two reasons:

1. **Lightning protection.** When lightning strikes a nearby pole or hits the ground nearby, the electromagnetic pulse can induce a high-voltage spike in any nearby metal — including cable armor. If that armor isn't grounded, the spike travels along the cable until it finds the first metal it can jump through — which is usually a splice closure or equipment port. A grounded armor gives the lightning spike a direct low-resistance path straight to earth, bypassing the sensitive electronics.

2. **Shock hazard.** If a power line falls on a cable with ungrounded metal armor, the metal becomes energized at line voltage — potentially lethal for anyone touching the cable or opening a splice closure.

Any cable with metallic armor (CST or wire armor) must be bonded to a ground electrode at:
1. Each splice closure
2. Each building entry point (BET or conduit entry)
3. Each aerial-to-underground transition (riser base)
4. Cable ends where accessible

The bonding conductor must be a minimum of **6 AWG copper** (or equivalent) run to a ground rod meeting the resistance-to-ground requirement of the local utility or AHJ [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]. Failure to bond metallic armor creates shock hazard for splicing crews and a lightning-discharge path through the splice closure to the fiber — the most common cause of lightning-induced cable plant damage.

Fully dielectric cable (ADSS, dielectric-armored cable, flat all-dielectric drop) requires **no bonding or grounding** — there is no metallic conductor to ground. This is a significant operational advantage on routes with high lightning exposure [ANSI/TIA-758-C §5.6.2; IEEE 1222].

### NEC Article 770 — Optical Fiber Cables in Buildings

NEC Article 770 governs the installation of optical fiber cable inside buildings. Here's the key insight: **outdoor cable and indoor cable are held to completely different fire-safety standards.** The black PE jacket on outdoor cable is tough and waterproof, but it burns and produces thick black smoke. If that smoke gets into an HVAC system, it can spread toxic fumes throughout a building in minutes. That's why you can't just run outdoor cable anywhere you want inside a building.

**NEC 770.113 — Listing requirements**

Optical fiber cable used inside buildings must be listed for the space in which it is installed. OSP-rated (outdoor PE jacket) cable is **not listed** for indoor use and cannot substitute for a listed indoor cable except for the first 50 feet from the point of building entry [NEC Article 770.113].

**NEC 770.113 — 50-foot interior limit (the rule Carter needs to know)**

Think of the 50-foot rule as a "contamination zone" for outdoor cable inside a building. Outdoor PE cable is allowed to penetrate the wall and run up to 50 feet inside to reach a transition point. At that point, you must hand off to a rated indoor cable. Beyond 50 feet, outdoor cable is flat-out prohibited.

OSP cable may penetrate a building and extend a maximum of **50 feet (15 m)** inside the structure, measured from the point of entry (exterior wall penetration). Beyond 50 feet, a listed indoor cable (OFNR or OFNP) must continue to the termination point. The transition from OSP to indoor cable is typically made at a Building Entry Terminal (BET) [NEC Article 770.113].

(Cross-reference: Lesson 7 — Sheath and Fire Ratings — introduced the 50-foot rule and the BET in the context of sheath selection. This lesson applies it in the compliance context.)

**NEC 770 fire-rating hierarchy (OSP to most restrictive)**

Think of the ratings like a ladder — each rung is a stricter test. A higher-rated cable can always substitute for a lower-rated one, but never the reverse. OFNP is the top of the ladder and can go anywhere; OFNR is the middle; OFN is the bottom.

| Designation | Space permitted | Governing test | Substitute for |
|---|---|---|---|
| OSP / outdoor | Outside buildings, ≤ 50 ft inside | — | — |
| OFN / OFNG (general) | General horizontal runs, not riser/plenum | UL 1581 VW-1 | Lower ratings |
| OFNR (riser) | Vertical runs in riser shafts | UL 1666 riser | OFN/OFNG |
| OFNP (plenum) | Air-handling plenum spaces | UL 910 plenum | All lower ratings |

*Source: [NEC Article 770.113; ANSI/TIA-758-C §5.2]*

The substitution rule: a higher-listed cable may always substitute for a lower-listed requirement. OFNP is the universal substitute — it may be installed anywhere OFNR or OFN is required. OFNR may not substitute for OFNP in plenum spaces.

**Conduit exception:** A non-listed cable (including OSP cable) may be installed in a metallic conduit or intermediate metallic conduit (IMC) inside a building without the 50-foot limit, *if* the conduit is continuous from the point of entry to the point of termination and is listed for the space type. This is the raceway exception under NEC 770.113(A)(1). It is less common in practice because metallic conduit adds cost; the BET-to-OFNR approach is more economical for most building entries [NEC Article 770.113(A)(1)].

### ANSI/TIA-758-C — Cable Specifications, Installation, and Documentation

ANSI/TIA-758-C is the primary engineering standard for OSP telecommunications infrastructure. Think of it as the construction specifications that your contract is built on — it tells the engineer exactly what "good" looks like for cable specs, installation work, and project documentation.

**Section 5 — Cable specifications by environment**

Covered in Lessons 4, 7, 8, and 10. Key specification cite points for compliance purposes:
- §5.2: OS2 SMF required for all OSP backbone and feeder cable
- §5.3: Loose-tube construction with gel-fill or dry water-block for all OSP environments
- §5.6: CST armor required for direct-bury cable in native soil
- §5.6.2: Dielectric armor option for installations near electrical infrastructure
- §5.6.3: ADSS specifications for aerial on energized lines
- §5.7: Drop cable specifications by installation method

**Section 6 — Installation limits**

These are measurable requirements that a field crew and inspector can verify:
- **§6.2:** RTL (rated tensile load) and RSL (rated sidewall load) limits for conduit installation — don't pull harder on the cable than it's rated for, and don't bend it around corners tighter than it can handle.
- **§6.3:** Minimum burial depths by crossing type (24 in. general soil, 36 in. under roads) — bury it deep enough that a backhoe won't hit it by accident.
- **§6.4:** Minimum slack loop at each splice closure: **10 meters (33 feet)**; cable end slack at FDH/FDT: **minimum 3 meters** — always leave a safety margin of extra cable coiled at each splice point for future repairs.

**Why the 10-meter slack loop matters — a plain-English explanation:**

Imagine your cable gets cut by a backhoe right next to a splice closure. You need to repair it. That means:
1. Pull cable out of the ground on both sides of the cut.
2. Cut back past the damaged section to clean fiber.
3. Set up a new splice closure.
4. Re-splice everything.

If there's only 2 meters of slack coiled at the closure, you might not have enough cable to reach the new splice point after cutting back past the damage. You'd have to trench a whole new section and pull in new cable — a much bigger, more expensive job. The 10-meter slack loop is insurance. It gives you enough working room to fix the most common cut-and-repair scenario without ordering new cable.

**Section 7 — Documentation requirements**

A job isn't done when the cable is buried — it's done when the paperwork is done. ANSI/TIA-758-C §7 requires that every completed OSP installation deliver an as-built documentation package including [ANSI/TIA-758-C §7]:
1. **Route drawings:** GPS-referenced or survey-referenced maps showing cable centerline, all splice closure locations, all FDH/FDT locations, conduit runs, buried cable, and aerial attachment points
2. **Burial depth records:** Depth measurements at minimum every 500 feet (152 m) on direct-bury routes, plus at every road crossing, to confirm compliance with §6.3 minimums
3. **Splice loss records:** OTDR test results for each fiber through each splice closure, documenting splice loss in dB
4. **Cable reel records:** Cable reel number, manufacturer, fiber count, and length for each reel installed
5. **Bonding and grounding records:** Location, ground rod depth, and measured resistance-to-ground at each grounding point for metallic-armor installations

**Section 6.5 — Cable identification and labeling**

Every splice closure, BET, FDH, FDT, and building entry must have a durable tag on the cable showing at minimum: cable type, fiber count, installation date, and the cable owner's identifier. Splice closures must also identify the incoming and outgoing cable IDs and what's inside the closure (splice count, tray configuration) [ANSI/TIA-758-C §6.5].

This matters years later when someone needs to trace a circuit or find a closure in the field. If there's no tag, the next crew has to guess — and guessing on a live fiber network is expensive.

### BICSI OSP-DRD — Design Documentation Requirements

While TIA-758-C covers what you do DURING and AFTER construction, BICSI OSP-DRD Chapter 8 covers what you produce BEFORE construction starts. A professional fiber installation isn't just execution — it's planned on paper first.

**Pre-construction design deliverables (BICSI OSP-DRD Ch. 8)**

1. **Route survey report:** Field survey results documenting right-of-way, existing utilities, crossing locations, soil type, frost line depth, and documented hazards (rock ledge, high-groundwater areas, areas of known rodent activity)
2. **Cable schedule:** Complete specification for each cable segment — cable type, fiber count, construction, reel size, installation method
3. **Fiber assignment table:** Which fibers in which cable segments are assigned to which circuits (active) vs. reserved as dark fiber (future) — think of this as the "seating chart" for every strand of glass in the network
4. **Optical power budget calculation:** Per IEEE 802.3 or applicable transceiver specification, documenting that the total link loss (fiber attenuation + splice losses + connector losses + bend losses) is within the transceiver's loss budget for every active circuit
5. **Splice closure placement plan:** Location, type (inline vs. branch), and splice count for each closure; linked to the route drawing

**Testing requirements at project closeout (BICSI OSP-DRD Ch. 7; ANSI/TIA-526-7)**

When construction is done, you test every fiber. Not because you distrust the crew, but because problems happen — a splice that looks clean sometimes isn't, a buried cable sometimes takes an accidental sharp bend. Testing before closing up the splice closures and backfilling the trenches lets you fix problems cheaply. Testing after the customer is already relying on the link is a much bigger emergency.

Required tests:
- **OTDR trace:** Each fiber in each cable segment, tested from both ends, at a minimum of two wavelengths (1310 nm and 1550 nm for OS2 feeder and distribution cable). OTDR traces must document each splice event, reflective event, and the end-of-fiber reflection.
- **Optical loss test (OLTS / insertion loss):** Each installed link, tested per ANSI/TIA-568.3-D §11 using a calibrated light source and power meter. Pass/fail criterion: total link insertion loss ≤ calculated loss budget
- **Visual fault locator (VFL) inspection:** Each splice closure opened and each connector inspected for physical damage or contamination before final documentation

**OTDR wavelength requirements — why you need both 1310 nm AND 1550 nm**

Here's the key concept: fiber loses light differently at different wavelengths. A tight bend in the cable doesn't look the same at 1310 nm as it does at 1550 nm.

Think of it like looking at a small crack under two different lights. Regular white light might not show it. UV light makes it glow. Testing at both wavelengths is the optical equivalent of checking under both lights.

ANSI/TIA-526-7 and BICSI OSP-DRD Manual specify that OS2 OSP fiber should be tested at both **1310 nm and 1550 nm** [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]. The 1310 nm trace identifies splice loss, connector loss, and macro-bend events efficiently (higher OTDR sensitivity at 1310 nm for some OTDRs). The 1550 nm trace is more sensitive to **macro-bend loss events** — bend losses are higher at longer wavelengths, making the 1550 nm trace the definitive test for bend-induced loss in direct-bury and conduit routes [BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.1].

**What is macro-bend loss?** When fiber is bent too tightly — like a kinked garden hose for water flow — light "leaks" out of the fiber core at the bend. The tighter the bend, the more light leaks. This is called macro-bend loss. It's dangerous because:
- It's invisible at 1310 nm on a 1550 nm-sensitive event (easy to miss without dual-wavelength testing)
- It gets worse over time if the bend stays sharp (ice, soil movement, or vibration worsens it)
- It tells you a cable is stressed — which means it's also at risk of breaking later

The 1550 nm test is specifically required because it's the wavelength that makes bend events visible. A 0.4 dB loss event at 1550 nm at a location with no splice is almost always a tight bend in the cable — and must be dug up and relieved before the project is closed out.

### The Compliance Checklist: Nine Items for Project Closeout

The following checklist synthesizes the compliance requirements of all four bodies into a project closeout verification list. If all nine items are checked off, the installation is defensible.

| # | Item | Standard |
|---|---|---|
| 1 | All aerial spans satisfy NESC clearance minimums at maximum ice load | NESC C2-2023, Rule 232 |
| 2 | Aerial cable/messenger rated for applicable NESC loading district | NESC C2-2023, Rules 250–251 |
| 3 | All metallic armor bonded and grounded at each closure, BET, transition | NESC C2-2023, Rule 352; TIA-758-C §6.4 |
| 4 | Ground rod resistance measured and recorded at each grounding point | NESC C2-2023, Rule 352 |
| 5 | OSP cable does not extend > 50 ft inside any building without OFNR/OFNP transition | NEC Article 770.113 |
| 6 | Indoor cable rated for installed space (OFNR in risers, OFNP in plenum spaces) | NEC Article 770.113 |
| 7 | Direct-bury cable burial depth verified and recorded at ≤ 500 ft intervals | ANSI/TIA-758-C §6.3, §7 |
| 8 | 10 m slack coil present at each splice closure; 3 m at each FDH/FDT | ANSI/TIA-758-C §6.4 |
| 9 | OTDR traces and OLTS tests completed at 1310 nm and 1550 nm for all fibers | ANSI/TIA-526-7; BICSI OSP-DRD Ch. 7 |

*Source: Synthesized from [NESC C2-2023; NEC Article 770; ANSI/TIA-758-C; BICSI OSP-DRD Manual]*

---

## Key Terms (Flashcard Candidates)

**NESC (National Electrical Safety Code) C2**
The national safety code governing electrical supply and communication lines on public property — poles, rights-of-way, and utility underground infrastructure. Enforced by local authorities having jurisdiction (AHJ). Key OSP provisions: aerial clearances (Rules 232, 250–251), underground installation (Rule 354), metallic armor grounding (Rule 352). [NESC C2-2023]

**NEC Article 770**
The National Electrical Code article governing optical fiber cable installations inside buildings. Establishes fire-rating requirements (OFNR, OFNP), the 50-foot interior limit for OSP-rated cable, and listing requirements for all indoor optical fiber cable. [NEC Article 770]

**AHJ (Authority Having Jurisdiction)**
The governmental body or official empowered to enforce safety codes — typically the local building department, utility commission, or OSHA regional office. AHJ may impose requirements more stringent than code minimums; the most stringent applicable requirement governs. [NESC C2-2023 §1; NEC §90.4]

**NESC loading district**
Geographic classification in NESC C2-2023 assigning design radial ice thickness and wind pressure for aerial line engineering. Three primary districts: light (0.00 in. ice, 9 psf wind), medium (0.25 in. ice, 4 psf wind), heavy (0.50 in. ice, 4 psf wind). Plus extreme wind zone for coastal areas. All aerial cable, messenger, and hardware must be rated for the applicable district. Macon, GA = Light district. [NESC C2-2023, Rules 250–251]

**Bonding conductor**
The copper wire (minimum 6 AWG) connecting metallic cable armor to a ground electrode (ground rod). Required at each splice closure, BET, and cable end for CST-armored or wire-armored cable. The bonding conductor ensures metallic armor potential equalizes with ground, preventing shock hazard and lightning-induced discharge through splice hardware. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]

**OTDR (Optical Time-Domain Reflectometer)**
Test instrument that launches a timed optical pulse into the fiber and measures the backscattered return signal as a function of time (converted to distance). Identifies splice events, connector reflections, macro-bends, cable breaks, and fiber end-point reflections. Required test method for OSP acceptance testing. Two-wavelength testing (1310 nm and 1550 nm) is required for OS2 cable. [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]

**OLTS (Optical Loss Test Set)**
A calibrated light source and optical power meter used to measure total insertion loss of a fiber link from end to end. Complementary to OTDR: OTDR identifies the location and magnitude of individual events; OLTS provides the total link loss figure for comparison to the power budget. [ANSI/TIA-568.3-D §11; BICSI OSP-DRD Manual, Ch. 7.2]

**Optical power budget**
The maximum total insertion loss (fiber + splices + connectors + bend losses) that an active circuit can tolerate and still meet the receiver's minimum sensitivity specification. Calculated from the transceiver datasheet. Every installed link's OLTS-measured insertion loss must be ≤ the optical power budget. [BICSI OSP-DRD Manual, Ch. 7.1; IEEE 802.3]

**Slack loop**
A coiled reserve of cable left at each splice closure location, providing extra length for future re-splicing, repair after cable damage, and closure repositioning. ANSI/TIA-758-C §6.4 requires a minimum of **10 meters** at each splice closure and 3 meters at FDH/FDT termination points. Think of it as the spare cable that lets you fix a cut without ordering new material. [ANSI/TIA-758-C §6.4]

**Fiber assignment table**
A project documentation deliverable mapping each fiber in each cable segment to its circuit assignment (active) or reserve status (dark). Required by BICSI OSP-DRD Manual Ch. 8 as a pre-construction deliverable. Updated in as-built form at project closeout. Essential for future network changes and repair dispatch. [BICSI OSP-DRD Manual, Ch. 8]

**Macro-bend loss**
Optical loss induced by a cable bend radius tighter than the fiber's rated minimum bend radius. Picture a kinked garden hose — the kink blocks water flow; a tight cable bend "leaks" light out of the fiber core. Macro-bend loss is wavelength-dependent — higher at longer wavelengths — making the 1550 nm OTDR trace more sensitive to bend events than the 1310 nm trace. OS2 fiber conforming to ITU-T G.657.A1 has enhanced macro-bend tolerance compared to standard G.652.D. [ITU-T G.657 §5.2; Corning OSP Reference, Ch. 7.1]

---

## Interactive: Scenario — Compliance Audit Walkthrough

### Scenario

A project team has completed a 6.2-mile OSP FTTH feeder installation. The route is: 1.8 miles aerially on a 7.2 kV distribution pole line → 0.5-mile aerial-to-underground transition zone and conduit crossing under a county road → 3.9 miles direct-bury through agricultural land → building entry into the network operations center (NOC). The installation uses ADSS cable on the aerial segment and 144-fiber loose-tube OS2 with CST armor on the direct-bury segment.

A compliance auditor presents five findings. For each finding, select the correct disposition:

**Finding 1:** The ADSS aerial segment has no bonding conductors at the pole attachment points.

Choices:
- A) Finding is valid — ADSS cables require bonding at every pole
- B) Finding is not valid — ADSS is fully dielectric; no bonding or grounding is required **[CORRECT]**
- C) Finding is valid — bonding is required only at road crossings

*Rationale:* ADSS cable is fully non-metallic. It has no steel messenger, no metallic armor, and no metallic element requiring bonding. NESC Rules 352 and 354 apply to metallic conductors and metallic cable sheaths. A fully dielectric cable has no grounding requirement at pole attachment points [NESC C2-2023, Rule 352; ANSI/TIA-758-C §5.6.3; IEEE 1222]. **Finding not valid.**

---

**Finding 2:** The CST-armored direct-bury cable has bonding conductors at four splice closures on the 3.9-mile direct-bury segment, but not at the aerial-to-underground transition riser base where the cable transitions from ADSS to the CST-armored cable.

Choices:
- A) Finding is not valid — bonding is only required at splice closures
- B) Finding is valid — the transition point is an accessible point where metallic armor begins; it must be bonded to ground **[CORRECT]**
- C) Finding is valid — the transition point must be bonded, and additionally the splice closure count (4) is insufficient; bonding must occur every 500 feet

*Rationale:* NESC Rule 352 and ANSI/TIA-758-C §6.4 require metallic armor bonding at all accessible points: splice closures, BETs, cable ends, and any point where the armor begins or ends — including the aerial-to-underground transition where the ADSS cable (no armor) is joined to the CST-armored direct-bury cable. The transition riser base is the point where metallic armor first appears in the route and must be bonded. The 3.9-mile direct-bury segment with 4 splice closures does not violate the NESC interval provision (bonding at each closure is the practical implementation). **Finding valid.** [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]

---

**Finding 3:** The building entry into the NOC has OSP cable extending 65 feet from the building penetration to the main termination panel. No BET or indoor cable transition was installed.

Choices:
- A) Finding is not valid — OSP cable may run up to 100 feet inside a building in a telecommunications room
- B) Finding is valid — NEC 770.113 limits OSP cable to 50 feet inside a building; a BET and OFNR transition are required for the remaining 15 feet **[CORRECT]**
- C) Finding is not valid — OSP cable in a non-plenum telecommunications room is exempt from the 50-foot limit

*Rationale:* NEC Article 770.113 allows OSP-rated cable to extend a maximum of **50 feet** from the point of building entry without an indoor cable transition, regardless of the space type. 65 feet exceeds this limit by 15 feet. A BET must be installed at or before the 50-foot point, and an OFNR-rated (or OFNP-rated if any portion is in a plenum space) cable must continue to the termination panel. The "telecommunications room" classification is not an exemption from NEC 770.113. **Finding valid.** [NEC Article 770.113]

---

**Finding 4:** The as-built documentation package includes OTDR traces at 1310 nm for all 144 fibers through all splice closures, but no 1550 nm traces.

Choices:
- A) Finding is not valid — 1310 nm OTDR is the only required wavelength for OS2 feeder cable
- B) Finding is valid — both 1310 nm and 1550 nm OTDR testing are required for OS2 OSP acceptance testing **[CORRECT]**
- C) Finding is not valid — OTDR testing is optional; OLTS insertion loss testing is the only required acceptance test

*Rationale:* ANSI/TIA-526-7 and BICSI OSP-DRD Manual Chapter 7 require OTDR testing of OS2 OSP fiber at **both 1310 nm and 1550 nm**. The 1550 nm trace is specifically required because macro-bend loss events — buried cable bent tighter than minimum bend radius during installation — produce significantly more measurable loss at 1550 nm than at 1310 nm. Omitting the 1550 nm trace means macro-bend events in the installed plant may be undetected. Both wavelengths are required for project acceptance. **Finding valid.** [ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7.2]

---

**Finding 5:** Burial depth records show the direct-bury segment was measured every 800 feet along the route; measurements at the county road crossing show 34 inches of burial depth.

Choices:
- A) Finding is not valid — 34 inches exceeds the 24-inch minimum for direct-bury cable
- B) Finding has two issues: measurement interval exceeds the 500-foot maximum, and 34-inch depth at the road crossing does not meet the 36-inch minimum for cable under roadways **[CORRECT]**
- C) Finding is partially valid — the measurement interval is incorrect; the 34-inch depth at the road crossing is acceptable

*Rationale:* Two independent issues. (1) ANSI/TIA-758-C §7 requires burial depth documentation at intervals not exceeding **500 feet**; every-800-foot documentation misses measurements in between and does not satisfy the documentation requirement. (2) ANSI/TIA-758-C §6.3 requires a minimum burial depth of **36 inches (914 mm)** under roads, streets, and highways. The 34-inch measurement at the county road crossing is 2 inches below the minimum and must be remediated — either by deepening the cable at the crossing or by installing a protective casing to make up the insufficient cover. **Finding valid on both counts.** [ANSI/TIA-758-C §6.3, §7]

---

## Multiple-Choice Quiz

---

**Q1.** An OSP cable with CST armor is installed in a direct-bury route. At a splice closure on the route, the 6 AWG bonding conductor connects the armor to a ground rod driven 8 feet into the soil, with a measured resistance of 24 ohms. The local AHJ requires ≤ 25 ohms. Is this grounding installation compliant?

- A) No — NEC requires resistance-to-ground ≤ 5 ohms for all telecommunications cable grounding
- B) Yes — the measured resistance of 24 ohms is below the AHJ's 25-ohm requirement; the installation is compliant **[CORRECT]**
- C) No — NESC requires a minimum of two ground rods for any telecommunications cable grounding point
- D) Yes — but the bonding conductor must be upgraded to 4 AWG per NESC Rule 352

*Rationale:*
- **A — Incorrect.** The 5-ohm standard is associated with certain power utility grounding requirements (NEC Article 250) and is sometimes cited for specific telecommunications facilities. It is not a universal requirement for OSP cable armor grounding. The AHJ-specified limit governs for this installation. [NESC C2-2023, Rule 352; NEC §250.53]
- **B — Correct.** The AHJ requires ≤ 25 ohms resistance-to-ground. The measured resistance (24 ohms) is below this limit. Compliance is determined against the most stringent applicable requirement — here the AHJ limit — and the installation meets it. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]
- **C — Incorrect.** NESC does not categorically require two ground rods for telecommunications cable armor bonding. Multiple ground rods are required if the single-rod resistance exceeds the applicable limit; this installation meets the AHJ's single-rod limit. [NESC C2-2023, Rule 352]
- **D — Incorrect.** The minimum bonding conductor size for telecommunications armor grounding per NESC Rule 352 and ANSI/TIA-758-C §6.4 is **6 AWG copper**. Upgrading to 4 AWG is not required and not indicated by the measured resistance. [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4]

---

**Q2.** A building's HVAC system uses a ceiling plenum return-air design on the second floor. OSP fiber from an outside plant cable enters the building at the first-floor mechanical room and must route to a second-floor communications room through the ceiling plenum on floor one. Which cable ratings are required for the two interior segments?

- A) OFNR for the first-floor segment (mechanical room to plenum entry); OFNR for the plenum segment — riser-rated cable is allowed in plenum spaces
- B) OFNR for the first-floor segment (mechanical room to plenum entry); OFNP for the plenum segment **[CORRECT]**
- C) OFNP for all interior cable — OFNP is required whenever cable passes through any indoor space
- D) OSP cable can continue through both segments if enclosed in metallic conduit throughout

*Rationale:*
- **A — Incorrect.** OFNR (riser-rated) cable may **not** be substituted for OFNP (plenum-rated) in air-handling plenum spaces. OFNP passes the more restrictive UL 910 flame and smoke test; OFNR passes only UL 1666. A fire in the plenum that ignites OFNR cable produces smoke that is distributed to the entire building through the HVAC system. NEC Article 770.113 explicitly prohibits OFNR in plenum spaces. [NEC Article 770.113]
- **B — Correct.** The first-floor segment (mechanical room to the plenum space boundary, a non-plenum general space) requires **OFNR** (riser-rated) as the minimum listing for a vertical or horizontal run outside plenum and riser paths. The segment running through the ceiling plenum requires **OFNP** (plenum-rated). OFNP may substitute for OFNR anywhere, but OFNR cannot substitute for OFNP. [NEC Article 770.113]
- **C — Incorrect.** OFNP is not required for all indoor cable — it is required specifically in air-handling plenum spaces. Applying OFNP throughout the installation is over-specification that increases cost without regulatory benefit (though not a code violation). [NEC Article 770.113]
- **D — Incorrect.** The metallic conduit exception under NEC 770.113(A)(1) permits non-listed cable (including OSP cable) to run inside metallic conduit without the 50-foot interior limit, provided the conduit is continuous. However, this exception applies to the building-entry cable transitioning to indoor termination — the OSP cable itself is the cable being conduit-enclosed. The scenario implies fiber from the OSP cable is being extended through the plenum, not the OSP cable itself. If the OSP cable is inside continuous metallic conduit through the plenum, the conduit exception applies; if only the fiber or an indoor cable is routed in the plenum, OFNP is required. In most practical building-entry scenarios, the BET-to-OFNP approach is used rather than continuous metallic conduit through the plenum. [NEC Article 770.113(A)(1)]

---

**Q3.** During OTDR testing of a newly installed 4.8-km OS2 direct-bury feeder, the 1310 nm trace shows clean splice events (0.05–0.08 dB each) and a clean end-of-fiber reflection. The 1550 nm trace shows an anomalous 0.4 dB event at 2.1 km. No splice is located at 2.1 km. What does this finding most likely indicate?

- A) The 1550 nm OTDR calibration is incorrect — re-zero the instrument and repeat
- B) A macro-bend event — the cable is bent tighter than the minimum bend radius at 2.1 km, and the higher sensitivity of the 1550 nm trace detects the loss event **[CORRECT]**
- C) A water-ingress event — water in the buffer tube at 2.1 km increases attenuation at 1550 nm
- D) A fiber break at 2.1 km — the 0.4 dB event represents a partial fiber fracture

*Rationale:*
- **A — Incorrect.** An anomalous event at a specific location (2.1 km) on one wavelength but not another is not a calibration error — calibration errors affect the entire trace uniformly, not a single discrete location. [ANSI/TIA-526-7 §5]
- **B — Correct.** Macro-bend loss is wavelength-dependent: loss at 1550 nm for a given bend radius is significantly higher than at 1310 nm. A 0.4 dB event at 2.1 km visible at 1550 nm but absent at 1310 nm is the classic signature of a **macro-bend** — the cable is bent tighter than its minimum bend radius at that location. This occurs in direct-bury cable where a rock ledge, root, or conduit bend forces the cable into a tight radius. The 1550 nm trace is specifically required for OSP acceptance because it reveals these events that are invisible or nearly invisible on the 1310 nm trace. Remediation: excavate at 2.1 km, identify and relieve the source of the tight bend, re-test [BICSI OSP-DRD Manual, Ch. 7.2; ANSI/TIA-758-C §6.2; Corning OSP Reference, Ch. 7.1].
- **C — Incorrect.** Water ingress that causes hydrogen darkening would typically appear as an elevated attenuation slope across the affected fiber length, not as a discrete 0.4 dB event at a single point. Hydrogen darkening is also more pronounced at 1383 nm (the water-peak wavelength) than at 1550 nm for G.652 fiber. A discrete event at a single point strongly suggests a bend, not water. [Corning OSP Reference, Ch. 7.2]
- **D — Incorrect.** A partial fiber fracture (internal crack) typically appears as a reflective event (spike up from the noise floor) on the OTDR trace, not simply as a non-reflective loss event. A complete fiber break appears as a flat return-noise floor with no end reflection beyond the break. The description of a 0.4 dB loss event without reflective signature is more consistent with bend loss than fracture. [ANSI/TIA-526-7 §5; BICSI OSP-DRD Manual, Ch. 7.2]

---

**Q4.** ANSI/TIA-758-C §6.4 requires a minimum slack loop of 10 meters at each splice closure. A field crew installed slack loops of approximately 6 meters at three closures on a completed route, citing limited space in the underground handhole. What is the practical consequence of insufficient slack, and what is the correct disposition?

- A) The 6-meter loops are acceptable — 10 meters is a guideline, not a mandatory minimum; AHJ discretion governs
- B) The 6-meter loops must be remediated — insufficient slack prevents future re-splicing and may leave the plant unable to recover from a cut within the closure zone **[CORRECT]**
- C) The 6-meter loops are acceptable if the route includes additional dark fibers as backup capacity
- D) The 6-meter loops must be remediated only if the OTDR trace shows elevated splice loss at those closures

*Rationale:*
- **A — Incorrect.** ANSI/TIA-758-C §6.4 states the slack loop minimum as a specification requirement, not a guideline. Contracts citing TIA-758-C (including all RUS-funded projects) make compliance with §6.4 a contractual obligation. [ANSI/TIA-758-C §6.4]
- **B — Correct.** The 10-meter slack loop minimum exists because cable repairs and re-splicing after damage require that the cable be extracted from the handhole, cut back past the damage, re-stripped, and re-spliced — consuming slack. A closure zone cut requires: (1) pulling cable from the ground on both sides of the damage point, (2) cutting back past the damaged section, (3) installing a new splice closure in a temporary location, and (4) re-splicing. With only 6 meters of available slack, a cut even 2–3 meters from the closure can leave insufficient cable to reach the new splice point. The 10-meter minimum is a practical engineering requirement for field repair feasibility, not a comfort margin. Remediation: excavate, pull additional cable through from the nearest pull point or drum reserve, and achieve the 10-meter slack before backfilling. [ANSI/TIA-758-C §6.4; BICSI OSP-DRD Manual, Ch. 6.4]
- **C — Incorrect.** Dark fiber reserve addresses capacity redundancy, not mechanical repair capability. A cable cut affects all fibers — active and dark — simultaneously. Dark fiber reserves do not provide the physical slack needed for repair splicing. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §6.4]
- **D — Incorrect.** OTDR splice loss and slack loop adequacy are independent parameters. Clean splice loss at a closure does not indicate the slack loop meets the TIA-758-C §6.4 minimum. Slack loop compliance is a mechanical measurement — 10 meters of cable present in the closure — not an optical measurement. [ANSI/TIA-758-C §6.4]

---

**Q5.** A BICSI OSP-DRD-compliant design documentation package must be submitted before construction begins. Which document maps each fiber in each cable segment to its intended circuit or dark-fiber reserve status?

- A) Route drawing
- B) Optical power budget calculation
- C) Fiber assignment table **[CORRECT]**
- D) Splice closure placement plan

*Rationale:*
- **A — Incorrect.** The route drawing shows the physical geography of the cable plant — route centerline, closure locations, conduit runs, aerial spans. It does not document fiber-level circuit assignments. [BICSI OSP-DRD Manual, Ch. 8]
- **B — Incorrect.** The optical power budget calculation documents the maximum insertion loss each active link can tolerate, compared to the transceiver loss budget. It is a link-level calculation, not a fiber assignment document. [BICSI OSP-DRD Manual, Ch. 7.1]
- **C — Correct.** The **fiber assignment table** maps each fiber strand in each cable segment to its circuit assignment (active — and which circuit), spare-assigned (reserved for a planned future circuit), or dark-unassigned status. It is a required pre-construction BICSI OSP-DRD design deliverable and is updated at project closeout as an as-built record. Without it, network operations staff cannot reliably identify which fibers to patch to which circuits after splicing, and future network changes cannot be managed without full re-testing [BICSI OSP-DRD Manual, Ch. 8].
- **D — Incorrect.** The splice closure placement plan documents the location, type, and splice count for each closure — a physical plant document, not a fiber-circuit mapping document. [BICSI OSP-DRD Manual, Ch. 8]

---

## Final Check

Answer before proceeding to Lesson 12 (Hands-On Case Studies).

**Pulse 1.** Name the four regulatory/standards bodies governing OSP fiber installations in the United States, state one primary fiber-relevant requirement from each, and identify which two are safety codes with AHJ enforcement authority.

*Expected answer:*
1. **NESC (C2-2023)** — requires metallic cable armor to be bonded and grounded at each splice closure, building entry, and cable end. **Safety code; AHJ enforcement.**
2. **NEC (NFPA 70) Article 770** — limits OSP cable to 50 feet inside a building and requires listed indoor cable (OFNR/OFNP) beyond that point. **Safety code; AHJ enforcement.**
3. **ANSI/TIA-758-C** — requires minimum 10-meter slack loop at each splice closure and OTDR testing at 1310 nm and 1550 nm for OSP fiber acceptance. Engineering standard; enforced by contract (not AHJ).
4. **BICSI OSP-DRD Manual** — requires a fiber assignment table as a pre-construction design deliverable. Best-practice guideline; enforced by contract and BICSI credentialing, not AHJ.

[NESC C2-2023; NEC Article 770; ANSI/TIA-758-C; BICSI OSP-DRD Manual, Ch. 8]

**Pulse 2.** A direct-bury CST-armored cable terminates at a BET at the base of a building. Describe the two compliance actions required at that point (one for the cable armor, one for the cable's indoor continuation).

*Expected answer:*
1. **Armor bonding:** The CST armor must be bonded to a ground electrode (ground rod, minimum 6 AWG copper bonding conductor) at the BET location. The BET is an accessible cable end and transition point — NESC Rule 352 and ANSI/TIA-758-C §6.4 require armor bonding at all such points. Ground rod resistance must be measured and documented [NESC C2-2023, Rule 352; ANSI/TIA-758-C §6.4].
2. **Indoor cable transition:** The OSP cable may enter the building and run a maximum of 50 feet to the BET location. At the BET, the OSP cable terminates and an **OFNR-rated** (or OFNP if the path includes a plenum space) indoor cable continues to the termination panel. The BET provides the waterproof sealed transition and the fire-rating demarcation [NEC Article 770.113; ANSI/TIA-758-C §5.2].

**Pulse 3.** An OTDR test at 1550 nm reveals a 0.6 dB non-reflective event at 3.4 km on a direct-bury feeder fiber. The same location on the 1310 nm trace shows only a 0.08 dB attenuation step. What is the most likely cause, and what action should the OSP technician take?

*Expected answer:* The wavelength-dependent loss signature — high loss at 1550 nm, low loss at 1310 nm at the same physical location — is the classic indicator of a **macro-bend event**. Bend loss is strongly wavelength-dependent: at a given bend radius, loss at 1550 nm is substantially higher than at 1310 nm. The likely cause is a soil anomaly (rock ledge, root mass, or frost heave pocket) forcing the buried cable into a tight bend radius below the minimum bend radius specification (typically ≥ 20× cable OD for long-term installation per ANSI/TIA-758-C §6.2). **Remediation:** (1) Mark the 3.4 km location on the GPS/survey route map. (2) Excavate the burial trench at that location to expose the cable. (3) Identify and remove or route around the source of the tight bend. (4) Re-bury the cable with adequate clearance from the obstruction. (5) Re-OTDR at 1550 nm to confirm the event has been resolved before project closeout. [BICSI OSP-DRD Manual, Ch. 7.2; ANSI/TIA-758-C §6.2; Corning OSP Reference, Ch. 7.1]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Cable Selection topic:

- **NESC loading district / Rules 250–251** → Lesson 4 (armored/aerial variants — NESC loading district first cited for ADSS span engineering), Lesson 10 (environment selection — NESC loading district governs aerial cable selection by geography)
- **NEC Article 770 / OFNR / OFNP / BET** → Lesson 10 (environment selection — OSP-to-inside transition section; BET and fire ratings first introduced there in Lesson 7)
- **OTDR / OLTS / optical power budget** → Lesson 12 (case studies — OTDR acceptance testing is documented in all three case study closeout deliverables)
- **Bonding conductor / ground rod / CST armor grounding** → Lesson 4 (armored/aerial variants — CST armor bonding requirement first introduced there), Lesson 10 (direct-bury environment — bonding requirement repeated in compliance context)
- **Slack loop / §6.4** → Lesson 8 (drop/distribution/feeder — slack loop calculation in feeder sizing example), Lesson 12 (case studies — slack loop is a line item in all three case study compliance checklists)
- **Fiber assignment table** → Lesson 12 (case studies — fiber assignment table completion is a closeout deliverable in all three scenarios)
- **Macro-bend loss** → Lesson 10 (environment selection — bend radius limits cited for conduit installation; macro-bend as the rationale for 1550 nm OTDR testing)
