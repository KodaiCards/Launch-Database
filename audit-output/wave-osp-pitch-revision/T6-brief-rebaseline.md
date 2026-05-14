# OSP Topic 6 — Grounding, Bonding & Lightning Protection: Re-Baselined Authoring Brief

**Re-baseline date:** 2026-05-14
**Based on:** BRIEF_FRAMING_A.md (commit `0a104ec`) · BRIEF_FRAMING_B.md (commit `97f9eab`) · BRIEF_VERIFIER_A_CONVERGENCE.md (commit `307b947`) · BRIEF_VERIFIER_B_GAPS.md (commit `25f614f`) · DISCOVERY.md
**Changes applied:** Pitch directive (Carter 2026-05-14) · L6.9 reframe (Carter "None" voltage decision) · L6.5 cathodic scope expansion · L6.10 test log ownership · T3 L3.12 follow-up cross-ref · Verifier B gap resolutions
**Purpose:** Hand this file to the T6 authoring pair. They should NOT need any other input to begin lesson authoring.

---

## AUDIENCE PROFILE (LOCKED — DO NOT DEVIATE)

Carter's verbatim directive, 2026-05-14:

> "I dont know these terms or this math. Make it for dummies, revise everything to make it stupid simple"

**Target reader:** Carter + crew. Field-experienced — knows how to pull cable, climb a pole, splice fiber, use test equipment. Has ZERO formal engineering training. Has ZERO familiarity with BICSI / NEC / NESC / RUS / TIA / OSHA vocabulary as written in the standards documents.

**What this means for every lesson:**

1. **Every acronym defined on first use in every lesson.** Even "NEC," "NESC," "RUS," "OSHA." Don't assume they know. Re-define on first use within each lesson — readers may not read sequentially.
2. **Every concept gets a plain-English analogy BEFORE the technical definition.** (Example: "Grounding is like the drain on a sink — it gives stray electricity a safe path to flow away into the earth instead of building up on the cable.")
3. **Every formula gets:** (a) plain-English description of what it calculates and why it matters BEFORE the formula; (b) every variable defined with units; (c) every algebra step shown — no skipped intermediates; (d) a worked numerical example with each substitution shown; (e) a sanity-check sentence ("8.69 ft of sag means the cable hangs almost 9 feet below the attachment points at midspan").
4. **Worked examples preferred over abstract theory.** One concrete scenario beats three paragraphs of principles.
5. **Tables + diagrams + step-by-step checklists > prose.** Write detailed text descriptions that could be turned into diagrams if actual diagrams can't be rendered.
6. **Cross-references to prior lessons when a term re-appears.** ("Remember from T2 L2.6, the messenger is the steel wire the cable hangs from…")
7. **Quality bar does NOT drop.** Citations stay rigorous, math stays correct. Just unpacked for someone who has never seen this material.

---

## LESSON LIST (LOCKED — 10 LESSONS)

Verified 10/10 convergence by both framing agents and both verifiers. Do not change this list.

| # | Title | Duration | Intensity |
|---|---|---|---|
| 6.1 | Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both | 25 min | STANDARD |
| 6.2 | Regulatory Framework: NEC Art. 250, NESC Rules 92–99, and IEEE 1100 | 25 min | STANDARD |
| 6.3 | Pole Grounding: Downleads, Ground Rods, and MGN Bonding | 30 min | HIGH |
| 6.4 | Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement | 25 min | HIGH |
| 6.5 | Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, and Soil Resistivity | 30 min | HIGH |
| 6.6 | Building Entry Grounding: NEC Art. 770/800, Primary Protectors, IBT, and Duct Seal | 25 min | HIGH |
| 6.7 | Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Bonding to Utility GES, and Multi-Ground Prohibition | 20 min | STANDARD |
| 6.8 | Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination | 25 min | HIGH |
| 6.9 | Stray Voltage and AC Induction Hazards: Detection, De-Energization, and PPG Procedures | 25 min | HIGH |
| 6.10 | Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria | 30 min | HIGH |

**Total: ~255 min (~4.25 hrs). 7 HIGH / 3 STANDARD.**

Note: L6.5 bumped from 25 to 30 min to absorb cathodic protection scope addition (per Carter 2026-05-14). L6.9 may clock shorter than 25 min after the reframe — reallocate freed time to L6.5 or L6.10 at authoring discretion.

---

## PER-LESSON DETAIL

---

### L6.1 — Bonding vs. Grounding: Definitions, Distinctions, and Why Fiber Needs Both

**One-line objective:** Learner can explain in plain English what bonding and grounding each do and why both matter on a fiber cable run — even though fiber itself carries no electricity.

**Pitch notes:**

**a. Plain-English framing:**
The whole topic starts with a puzzle: fiber carries light, not electricity — so why do we spend a whole topic on electrical grounding? Answer: the *metal parts* of a fiber system (the steel messenger wire, the aluminum or steel cable armor, the metal closure body, the FDH cabinet) do carry electricity — specifically, they pick up stray charge from nearby power lines, lightning, and static buildup. That charge has to go somewhere. If you don't give it a safe path to earth, it arcs through equipment or through the person touching the cable. That's what this topic is about.

- **Bonding** = connecting metal parts together so they're all at the same voltage. Like connecting two water tanks with a pipe so the water level is the same in both — no flow between them.
- **Grounding** = connecting the bonded system to the earth itself. Like opening a drain on one of those tanks — gives the charge a path to flow safely away.
- Both together = the charge can't build up and can't arc through you.

**b. Acronyms that must be unpacked on first use:**
- **NEC** = National Electrical Code. The rulebook for electrical wiring in buildings, written by the National Fire Protection Association (NFPA). Published every three years.
- **NESC** = National Electrical Safety Code. The rulebook for utility-side infrastructure — power lines, poles, underground conduit in the road right-of-way. Different document from NEC, different authority.
- **GES** = Grounding Electrode System. The complete set of buried metal components (rods, rings, plates) that connects the electrical system to the earth.
- **EGC** = Equipment Grounding Conductor. The wire that connects metal equipment housings back to the GES so they stay at earth potential.
- **IBT** = Intersystem Bonding Termination. A listed (certified) connector block where all service protectors (phone, cable, power) bond to the same grounding point.
- **ADSS** = All-Dielectric Self-Supporting cable. Fiber cable with no metal at all — no armor, no messenger. ADSS floats on the strand but is electrically inert. Still accumulates capacitive charge near power conductors.
- **BICSI** = Building Industry Consulting Service International. The industry association that writes the OSP Design Reference (OSP-DR) — the textbook this curriculum is based on.

**c. Concepts needing real-world analogies:**
- GES = the earth drain. Everything bonds to a common point; that point drains to earth.
- Bonding jumper = the extension cord that equalizes voltage between two metal objects.
- ADSS capacitive charge = like a plastic balloon picking up static electricity near a wool sweater. No metal, but the charge still accumulates.

**d. Formulas:** None in this lesson. Qualitative only.

**e. Cross-refs to prior topics:**
- T2: messenger strand (the steel wire the cable hangs from)
- T3: closure hardware (the splice case body is metallic on armored cables)
- T4 L4.7: "In T4 L4.7 we saw the NEC Art. 250 code pointer for the first time. This lesson gives those terms their plain-English meaning."

**Worked example anchor:** ADSS cable on a joint-use pole with a distribution primary overhead. Walk through: (a) what parts accumulate charge, (b) what parts need bonding, (c) what parts need grounding, (d) what needs neither. Answer: messenger = bond + ground; armor = bond + ground; ADSS jacket = neither metallic bond nor ground required, but capacitive charge hazard still exists — PPG pre-work still applies (owned by L6.9).

**Quiz shape:** 2 questions — (1) NEC Art. 100 term identification; (2) classify a list of OSP components as bond-only / ground / neither.

---

### L6.2 — Regulatory Framework: NEC Art. 250, NESC Rules 92–99, and IEEE 1100

**One-line objective:** Learner can identify which rulebook (NEC or NESC) governs each segment of a fiber route and explain where the handoff point is.

**Pitch notes:**

**a. Plain-English framing:**
There are two different rulebooks for grounding, and they divide the world by location. Think of it like city limits:
- **NESC** is in charge outside the city (the utility side) — poles, aerial runs along the road, underground conduit in the right-of-way, anything owned or controlled by the power company.
- **NEC** is in charge inside the city (the premises side) — from the building's service entrance inward, anything on private property.
- **IEEE 1100** (the "Emerald Book") is a recommended-practice guide that helps you apply both. It's not a law, but it's what engineers use when the NEC and NESC don't quite line up for telecom scenarios.

The handoff point between NESC and NEC is the building service entrance — specifically the primary protector (L6.6 owns the detail on what a protector is). NESC governs the plant up to the protector; NEC governs from the protector inward.

**b. Acronyms that must be unpacked:**
- **IEEE** = Institute of Electrical and Electronics Engineers. Publishes technical standards and recommended practices. IEEE 1100 (Emerald Book) is their grounding guide for telecom.
- **TIA** = Telecommunications Industry Association. Publishes TIA-607-C, which covers bonding and grounding for customer-owned outside plant.
- **NESC Rules 92–99** = the specific rule numbers in the NESC that cover bonding, grounding, and electrical protection for utility communication infrastructure.

**c. Concepts needing analogies:**
- NESC vs. NEC boundary = city limits. NESC is county sheriff (utility ROW); NEC is city police (building interior). The primary protector is the city limits sign.
- IEEE 1100 = the unofficial translator when the two rulebooks contradict each other.

**d. Formulas:** None. Code-body selection is procedural, not mathematical.

**e. Cross-refs to prior topics:**
- T4 L4.7 introduced the NEC/NESC boundary at the code-pointer level. This lesson is where it gets taught in full.
- T4 L4.6 introduced the NEC Art. 800 structure. L6.6 will build on that for building-entry practice.

**Worked example anchor:** 3-segment route — (a) aerial run on co-op joint-use poles along a county road (NESC governs); (b) cable crossing private easement between road and building (TIA-607-C / NEC Art. 250 governs from the easement boundary); (c) building entry and protector (NEC §770.93 governs). Learner identifies the controlling standard for each segment.

**Interactive:** Drag-and-drop — match 5 described route segments to their governing standard. This is the core daily-job skill for this lesson.

**Quiz shape:** 2 questions — (1) NESC/NEC boundary: which standard governs a joint-use aerial run? (2) Scenario: 3-segment route — which code body governs each segment?

---

### L6.3 — Pole Grounding: Downleads, Ground Rods, and MGN Bonding

**One-line objective:** Learner can specify — from scratch — a complete, code-compliant ground assembly for a joint-use pole, including conductor size, rod spec, and MGN bond requirement.

**Pitch notes:**

**a. Plain-English framing:**
Every pole with fiber on it needs a ground. That ground is a system, not just a rod in the dirt. The four parts:
1. **Bond clamp at the messenger** — clamps onto the steel messenger wire at the top of the pole. This is where the charge path starts.
2. **Downlead wire** — a copper wire that carries charge from the messenger clamp down the pole to the ground rod. Runs inside PVC conduit from the ground up to 8 feet (to protect it from damage). Think of it as the electrical drainpipe.
3. **Ground rod** — a copper-clad steel rod driven into the earth. This is where charge actually exits into the soil. Standard spec: 5/8 inch diameter, 8 feet long (NEC §250.52(A)(5)).
4. **MGN bond** — on joint-use poles where fiber shares the pole with power lines, the messenger gets bonded to the power company's neutral wire (the MGN — Multi-Grounded Neutral). This is the equalizer that keeps the messenger at the same voltage as the power neutral — preventing arcing between the two.

In Macon GA red-clay soil (~100 Ω·m resistivity), one rod usually gets you under 25 Ω. Sandy soil is harder — may need two rods. Rock is the worst — needs special solutions (covered in L6.5).

**b. Acronyms to unpack:**
- **MGN** = Multi-Grounded Neutral. The neutral wire on a power distribution line that is grounded at every pole. The power company uses it as the return path for their system. Your messenger bonds to it to stay at the same voltage.
- **AWG** = American Wire Gauge. The measurement system for wire thickness. Confusingly, bigger numbers = thinner wire. #6 AWG is about the diameter of a pencil lead. #2 AWG is thicker, used in high-fault-current environments.
- **Ω** = Ohm. The unit for electrical resistance. Think of it like friction in a pipe — higher resistance = harder for current to flow. For grounding, lower resistance = better earth connection = faster fault clearing.
- **NESC Rule 96** = the specific NESC rule that says how to install the downlead (wire size, conduit protection height).
- **NESC Rule 96F** = the specific NESC rule that requires the fiber messenger to be bonded to the MGN on joint-use poles.

**c. Concepts needing analogies:**
- Ground rod = the drain at the bottom of a sink. Without it, charge pools up. With it, charge flows safely away.
- MGN bond = connecting your drainpipe to the utility's bigger drainpipe. Everything drains to the same place, so no pressure difference builds up between the two systems.
- Supplemental rod = adding a second drain when the first one is slow (high-resistance soil).
- Rod spacing = you need the two drains far enough apart that they each reach separate soil — rods within one rod-length of each other are reaching the same soil and don't add much resistance reduction.

**d. Formulas:**
- No resistance calculation formula in this lesson. The 25 Ω acceptance threshold (NEC §250.56) is the decision rule — measure the rod, if it reads over 25 Ω, add a supplemental rod at least 8 feet (one rod-length) away.
- Supplemental rod derivation: if soil resistivity is known (in Ω·m), the Dwight formula gives an estimate of single-rod resistance: R ≈ (ρ / 2πL) × (ln(4L/d) − 1). Authors: unpack this formula with every variable defined and a worked example using the Macon red-clay value (ρ ≈ 100 Ω·m, L = 8 ft = 2.44 m, d = 5/8 in = 0.016 m). Show each step. Result should come out near 20–22 Ω for red clay, confirming one rod usually works. This is the "why does one rod usually work in Georgia red clay?" explanation.

**e. Cross-refs to prior topics:**
- **T5 L5.1 deferral closure (REQUIRED opener):** "In T5 L5.1, we covered strand selection and hardware — and we explicitly deferred strand bonding and MGN bonding to this lesson. This is where it lives."
- T4 L4.7: NEC §250.52 was introduced as a code pointer — this lesson teaches it in practice.

**Worked example anchor:** Macon GA joint-use pole, co-op distribution, red-clay soil. Specify: (1) bond clamp at messenger; (2) #6 AWG Cu downlead, PVC-protected from grade to 8 ft (NESC Rule 96); (3) 5/8-in. × 8-ft Cu-clad rod (NEC §250.52(A)(5)); (4) test resistance — if > 25 Ω, add supplemental rod ≥ 8 ft away; (5) MGN bond — bond messenger to co-op neutral using listed bond clamp (NESC Rule 96F).

**Quiz shape:** 2 questions — (1) recall: minimum downlead conductor size per NESC Rule 96; (2) applied: joint-use pole measured 28 Ω after single rod — what is the full remediation and MGN bond specification?

---

### L6.4 — Aerial Closure and Messenger Grounding: Armor Bond Straps and Arrestor Placement

**One-line objective:** Learner can identify every point on an aerial fiber route that requires a bond strap or arrestor, and correctly distinguish armored cable requirements from ADSS requirements.

**Pitch notes:**

**a. Plain-English framing:**
There are two things you're protecting against on an aerial run: (1) charge that builds up on the armor between poles and has nowhere to go, and (2) lightning that travels down the conductor when the cable transitions from aerial to underground. Two different hardware solutions:
- **Bond strap at every splice closure** — the armor is a long metal tube running pole to pole. If you only bond it at the end poles, the middle section is floating (disconnected from earth). Every closure is a place where you re-connect the armor to the pole ground. NESC Rule 96F requires this.
- **Arrestor at every aerial-to-underground transition** — when the cable dips underground, lightning that was riding on the aerial section hits the transition point. The arrestor gives it a path to earth rather than letting it ride the cable into the underground section and destroy equipment.

**ADSS exception (important):** ADSS cable has no metallic armor. Nothing to bond. Bond straps are not required on ADSS. BUT — ADSS outer jacket still accumulates capacitive charge near power conductors, so PPG pre-work (L6.9) still applies before touching an ADSS cable on a joint-use pole. The difference: you don't bond it, but you still treat it like it could be energized until tested.

**b. Acronyms to unpack:**
- **ADSS** = All-Dielectric Self-Supporting cable. Already defined in L6.1 — cross-reference. No metal. No bond strap needed.
- **Arrestor** (also spelled arrester) = a device that acts like a pressure relief valve for electricity. When a voltage spike (from lightning) arrives, the arrestor clamps it and dumps the energy to ground rather than letting it pass through to equipment.
- **A/UG transition** = Aerial-to-Underground transition. Where the cable leaves the pole and goes into conduit underground. Every one of these is an arrestor location.

**c. Concepts needing analogies:**
- Floating armor between closures = like a car battery disconnected from both the car and the charger — it accumulates voltage with nowhere to go. When you touch it, you become the path.
- Arrestor at A/UG transition = like a pressure relief valve on a boiler. When pressure (voltage) spikes, the valve opens and vents safely. Without it, the spike travels into the building and destroys the boiler (equipment).

**d. Formulas:** None. Placement rules are procedural.

**e. Cross-refs:**
- **T5 L5.1 deferral closure (REQUIRED opener):** "T5 L5.1 covered strand selection and hardware but explicitly deferred strand bonding and armor bond requirements to this lesson."
- L6.3: pole ground assembly — the bond strap at each closure connects to the pole ground that L6.3 specified.
- L6.8: arrestors are introduced here at the placement level; L6.8 covers arrestor types and coordination.

**Worked example anchor:** As-built photo log shows a mid-route splice closure on armored aerial cable with no armor bond strap. Flag: violation of NESC Rule 96F. Consequence: the armor section between the prior closure and this one is floating — charge can build to hundreds of volts and arc through the closure body when opened for maintenance. Fix: add armor bond strap at this closure and verify bond straps at all other closures on the route.

**Interactive:** Drag-and-drop — label a splice-closure assembly: bond strap, arrestor at A/UG transition, downlead to pole ground.

**Quiz shape:** 2 questions — (1) recall: when is an armor bond strap NOT required at an aerial splice closure? (ADSS); (2) applied: mark every required arrestor location on a 3-segment mixed aerial/UG route schematic.

---

### L6.5 — Underground Pedestal and Cabinet Grounding: Ground Rods, Perimeter Ground, Soil Resistivity, and Cathodic Protection Isolation

**One-line objective:** Learner can design a complete underground grounding system for a pedestal or FDH cabinet, select the right electrode configuration for the soil conditions, and identify when cathodic protection isolation is required.

**Pitch notes:**

**a. Plain-English framing:**
Underground cabinets (pedestals, FDH enclosures, splice vaults) need their own ground system — they can't rely on the nearest pole ground. The basics are the same as the pole: copper-clad rod, downlead, connect to cabinet ground lug. But there are three complications:
1. **Soil varies a lot** — red clay is actually good for grounding (low resistivity). Sandy soil and rock are much harder.
2. **Active telecom facilities have a tighter threshold** — if the cabinet has electronics in it (FDH with active hardware), Telcordia GR-1275 requires ≤ 5 Ω, not just the NEC's ≤ 25 Ω. One rod might not get you there.
3. **Buried metallic conduit near gas or water lines has a cathodic protection complication** — the gas/water company runs DC current through their pipes to prevent corrosion. If your metallic conduit touches that system, you corrupt the protection and accelerate corrosion on your conduit. Isolation fittings are required.

**b. Acronyms to unpack:**
- **FDH** = Fiber Distribution Hub. The cabinet that terminates the distribution cables and connects to the drop cables serving individual customers. Covered in T5 L5.9.
- **GR-1275** = Telcordia (formerly Bellcore) Generic Requirements document 1275. The industry standard for electrical protection in telecom buildings and cabinets. Sets the 5 Ω acceptance threshold for active telecom facilities.
- **Ω·m** = Ohm-meter. The unit for soil resistivity. It measures how hard it is for current to flow through a cubic meter of that soil. Lower = better for grounding. Red clay in Georgia ≈ 100 Ω·m. Dry sand ≈ 1,000 Ω·m.
- **CHEMROD** = A chemically-enhanced ground rod filled with conductive compound that leaches into the surrounding soil to lower resistance. Used in high-resistivity soils where standard rods can't reach threshold.
- **Bentonite** = A natural clay material used as backfill around ground rods in high-resistivity soil. It absorbs moisture and lowers contact resistance.
- **Ufer ground** = A grounding electrode made by embedding bare copper wire or rebar in a concrete foundation. Named after Herb Ufer who developed it. NEC §250.52(A)(3) — requires bare copper conductor ≥ 20 ft × ≥ 4 AWG, or rebar of equivalent length.
- **NACE SP0169** = Standard Practice 0169 from NACE International (now AMPP — the corrosion engineering association). Governs external corrosion control on buried metallic piping. Requires isolation from stray DC sources.
- **Dielectric fitting / dielectric union** = A non-conductive coupling that interrupts the electrical path between two metallic pipe sections. Blocks DC current from flowing between your conduit system and a cathodically-protected gas or water line.

**c. Concepts needing analogies:**
- Soil resistivity = the difference between a wet sponge and dry sand when you try to push current through them. Red clay holds moisture well → easy path for current → low resistance. Dry sand doesn't hold moisture → poor path → high resistance.
- GR-1275's 5 Ω threshold vs. NEC's 25 Ω = NEC sets the minimum safety floor (like a building code minimum). GR-1275 sets the performance standard for active equipment (like a hospital standard for backup power — exceeds the minimum because the consequences of failure are worse).
- Cathodic protection = a corrosion-prevention system that works by making the pipe the "protected" electrode in a slow-motion battery. Your metallic conduit parallel to the pipe can corrupt this by providing an unintended current path — essentially shorting out the corrosion protection.
- Dielectric fitting = an electrical break in the pipe joint, like a rubber gasket between two metal flanges that blocks current from flowing through.

**d. Formulas:**
- **Dwight formula** (single rod resistance estimate): R ≈ (ρ / 2πL) × (ln(4L/d) − 1). Walk through with Macon red-clay example (ρ = 100 Ω·m, L = 2.44 m, d = 0.016 m). Show every step. Result ≈ 20–22 Ω → passes NEC 25 Ω threshold; needs to be confirmed by field measurement.
- **For FDH (5 Ω threshold):** explain that red-clay single rod ≈ 20 Ω does NOT meet GR-1275. Two rods in parallel, spaced ≥ 1 rod-length (8 ft) apart, give approximately R/2 ≈ 10 Ω — still not 5 Ω. Add perimeter ring or CHEMROD. Walk through the logic step by step.
- **Perimeter ground ring:** buried bare #2 AWG copper, encircling the cabinet at 18–24 in. depth (NEC §250.52(A)(4)). Not a formula — a specification. But explain why: a ring electrode has much larger contact area with soil than a rod, dramatically reducing resistance.

**e. Cross-refs:**
- T5 L5.8 / L5.9: pedestal and FDH hardware. "T5 L5.9 deferred FDH housing grounding to T6 L6.7 (for bonding to utility GES). This lesson covers the electrode system (rod, ring, soil remediation) for a cabinet that stands alone on a customer pad site."
- L6.10: "You'll verify this installation using the 3-pole fall-of-potential test in L6.10."
- L6.7: "If your FDH is mounted on a co-op pole or adjacent to a utility structure, bonding to the utility GES (not a separate rod) is the rule — that's L6.7."

**CATHODIC PROTECTION SCOPE — CARTER-DIRECTED (2026-05-14):**
Add a dedicated subsection in L6.5 on cathodic protection isolation. Scope:
- Where it applies: buried metallic conduit running parallel to or crossing gas/water infrastructure that uses an impressed-current cathodic protection system.
- The hazard: your conduit provides an unintended current return path, draining the cathodic protection current and causing accelerated corrosion on both the gas/water line and your conduit.
- The fix: dielectric flanges or unions at each structural crossing and at the entry/exit of the parallel run. Cite NACE SP0169 §6.2 (isolation requirements).
- How to identify: the gas/water company's crossing permit application will note cathodic protection. If it does, specify isolation fittings in the design. Verify with the utility before trenching.
- This adds approximately 5–10 minutes of reading time to L6.5. Budget accordingly.

**Worked example anchor:** New FDH on a Macon GA concrete pad, red-clay soil. Step through: (1) select rod spec — 5/8-in. × 8-ft Cu-clad (NEC §250.52(A)(5)); (2) estimate resistance using Dwight — works out to ~21 Ω; passes NEC 25 Ω but fails GR-1275 5 Ω; (3) add supplemental rod at ≥ 8-ft spacing — two rods in parallel ≈ 10 Ω, still fails GR-1275; (4) add bentonite backfill around both rods → re-test; (5) if still > 5 Ω, add perimeter #2 AWG ring. Document for RUS close-out (test log in L6.10).

**Quiz shape:** 2 questions — (1) rod spec recall (NEC §250.52(A)(5)); (2) scenario: single-rod test returns 28 Ω at new FDH — apply both NEC §250.56 and GR-1275 thresholds, select remediation path.

---

### L6.6 — Building Entry Grounding: NEC Art. 770/800, Primary Protectors, IBT, and Duct Seal

**One-line objective:** Learner can review a building-entry detail, identify primary protector and IBT requirements, and cite the NEC section for every violation found.

**Pitch notes:**

**a. Plain-English framing:**
When a fiber cable enters a building, it crosses the NESC/NEC boundary. At that crossing, three things are required:
1. **Primary protector** — a device (think of it as a surge protector on steroids, listed under UL 497B) that catches voltage spikes from the outside plant before they enter the building. It's required by NEC §770.93.
2. **Bonding of the protector to the building's GES** — the protector must connect to the same grounding electrode that the power service uses. This is NEC §770.100. The whole point is equipotential bonding — everything grounds to the same earth point so there's no voltage difference between systems.
3. **IBT (Intersystem Bonding Termination)** — a listed connector block that ties all the service protectors (phone, cable, power, fiber) to the same bonding point. Required by NEC §250.94. Think of it as the junction box where all the "drains" meet before going to the same "sewer."

Plus a duct seal at the entrance conduit — prevents gas and pests from traveling up the conduit into the building.

**b. Acronyms to unpack:**
- **UL 497B** = Underwriters Laboratories listing standard for secondary protectors for communication circuits. A protector must carry this listing to satisfy NEC §770.93 — unlisted protectors are a code violation.
- **IBT** = Intersystem Bonding Termination. The listed termination block where all service protectors bond together and connect to the GES. NEC §250.94.
- **GEC** = Grounding Electrode Conductor. The wire running from the IBT/protector to the grounding electrode.
- **Equipotential bonding** = making sure all metal parts are at the same voltage. If the power service ground and the telecom protector ground are at different potentials, there's a voltage difference between them — that difference can drive current through your equipment (or through you) when you bridge the two systems.

**c. Concepts needing analogies:**
- Primary protector = the check valve at the property line. It lets signal through but not voltage spikes.
- IBT = the common drain header where all the individual drains (power, phone, cable, fiber) connect before going to the main drain. All at the same pressure = no backflow between systems.
- Equipotential bonding = leveling all the water tanks in a building to the same height. No flow between them because there's no height difference.

**d. Formulas:** None. NEC §800.93 specifies protector conductor sizing by table (based on circuit voltage and length) — cite the table, not a formula.

**e. Cross-refs:**
- **T4 L4.7 deferral closure (REQUIRED opener):** "In T4 L4.7, we covered NEC Art. 250 at the code-pointer level — we identified where the IBT goes and what electrode types exist. This lesson is where we actually install it."
- **T4 L4.6 deferral:** "T4 L4.6 introduced NEC Art. 800 structure and protector conductor sizing. This lesson builds the full installation practice on that foundation."
- L6.2: the NESC/NEC boundary concept — "The protector is the city limits sign we discussed in L6.2."

**Worked example anchor:** Building-entry detail drawing that is missing the primary protector bond to the GES. Walk through: (1) locate the protector (UL 497B listed — NEC §770.93); (2) trace the GEC — where does it terminate? (Should go to same electrode as power service — NEC §770.100); (3) is there an IBT? (NEC §250.94 required); (4) is the entrance conduit duct-sealed? Flag each violation, cite the specific NEC section, state the fix.

**Interactive:** Drag-and-drop — label a building-entry assembly: protector, GEC, IBT, duct seal, service entrance.

**Quiz shape:** 2 questions — (1) recall: what UL listing is required for a primary protector on OSP fiber metallic components? (UL 497B, NEC §770.93); (2) applied: permit drawing shows bond to Ufer slab without IBT — red-mark all NEC violations.

---

### L6.7 — Co-Located Equipment Bonding: NESC Rule 92, CO/FDH Bonding to Utility GES, and Multi-Ground Prohibition

**One-line objective:** Learner can specify the correct bonding configuration for an FDH or CO equipment cabinet co-located with utility infrastructure, and explain why adding an independent ground rod is prohibited.

**Pitch notes:**

**a. Plain-English framing:**
When your equipment lives on a utility pole or inside a facility that already has its own ground system, you do NOT add your own separate ground rod. You bond your equipment to the utility's existing GES. Here's why:

Imagine the utility's ground and your ground are like two water towers at different heights. If you bridge between them, water flows from the higher one to the lower one — in electrical terms, that's fault current flowing through your bonding conductor and your equipment. Parallel grounds at different potentials destroy equipment during a fault event.

The rule: NESC Rule 92 requires all metallic parts of a communication system on or adjacent to a utility structure to bond to that utility's GES — not maintain a separate independent ground.

Also in this lesson: the minimum bonding conductor size (#6 AWG per NESC Rule 96C) and when to upsize (#2 AWG in high-fault-current environments per IEEE 1100).

**b. Acronyms to unpack:**
- **CO** = Central Office. A telephone company building that houses switching equipment and connects customer lines to the network.
- **NESC Rule 92** = the NESC rule requiring communication systems co-located with utility infrastructure to bond to the utility's GES.
- **GES** = Grounding Electrode System. Already defined in L6.1 — cross-reference.
- **Multi-ground prohibition** = the rule against connecting your communication equipment to more than one independent ground electrode. Two grounds at different earth potentials = voltage between them = current through your equipment during faults.

**c. Concepts needing analogies:**
- Two separate ground rods = two water tanks at different heights, connected by your equipment. When the fault hits, the pressure difference drains through you.
- Bond to utility GES = plug into the utility's water system — already at the right level, no pressure difference.

**d. Formulas:** 
- Bonding conductor sizing per NEC Table 250.66: size is based on the service entrance conductor. For example: if the service entrance uses a 4/0 AWG conductor, Table 250.66 requires a minimum 2 AWG bonding conductor. Authors must walk through this table lookup with a concrete example, not just state "#6 AWG minimum."
- Also cite NESC Rule 96C minimum (#6 AWG) as the floor, and IEEE 1100 recommendation (#2 AWG) as the upgrade in high-fault environments. Explain the difference: NESC gives you the code minimum; IEEE 1100 gives you the engineering recommendation.

**e. Cross-refs:**
- **T5 L5.9 deferral closure (REQUIRED opener):** "In T5 L5.9, we covered FDH hardware — the housing, connectors, and splitter units. We explicitly deferred FDH housing grounding to this lesson. This is where it lives."
- L6.5: pedestal grounding (standalone cabinet) — "L6.5 covered standalone pedestal grounding with its own electrode system. This lesson covers what changes when the cabinet is on utility property: no separate electrode — bond to theirs."

**Worked example anchor:** Pole-mounted FDH, co-op distribution pole, co-op GES tests 8 Ω. Specify: (1) NESC Rule 92 requires bonding to the co-op GES — no independent rod; (2) minimum conductor: #6 AWG (NESC Rule 96C) — upsize to #2 AWG if co-op line is high-fault-current; (3) verify terminal resistance ≤ 5 Ω (Telcordia GR-1275 §4) — if co-op GES is 8 Ω, add remediation at co-op ground (coordinate with utility) or escalate; (4) document the bond configuration in the as-built grounding schedule.

**Quiz shape:** 2 questions — (1) recall: what NESC rule requires communication system conductive parts to bond to the adjacent utility GES? (Rule 92); (2) applied: FDH on co-op pole — specify bonding configuration, minimum conductor, and explain why an independent rod is prohibited.

---

### L6.8 — Lightning Protection: Surge Arresters, Ground Rings, and Protection Coordination

**One-line objective:** Learner can build an arrester placement schedule and ground ring spec for a mixed aerial/underground route in a high-lightning-activity area, and explain how the arrester type matches the protection scenario.

**Pitch notes:**

**a. Plain-English framing:**
Lightning protection is a coordination problem. A lightning bolt that hits near your aerial cable sends a voltage spike down the conductor. You need to stop that spike before it reaches equipment. The tools:
- **Gas-tube arrestor** — absorbs the initial strike. Like a sacrificial fuse. Handles the first big punch.
- **MOV arrestor** (Metal Oxide Varistor) — clamps the secondary surge. Handles what leaks through after the gas tube fires.
- **Combination unit** — gas tube + MOV in one device. Best protection for high-exposure sites.
- **Ground ring** — a buried copper ring around the facility. When lightning hits near the building, the earth potential rises in a cone shape (Ground Potential Rise or GPR). The ring limits how high the potential rises around the building by providing a low-resistance path. Reduces voltage stress on everything connected to the building ground.

Placement rules:
- One arrestor at every aerial-to-underground (A/UG) transition. No exceptions.
- One arrestor at every facility entry.
- On long aerial runs in high-lightning counties (> 60 thunderstorm days per year — check local Isokeraunic map), add arrestors at intervals ≤ 1 mile.

**b. Acronyms to unpack:**
- **VPL** = Voltage Protection Level. The maximum voltage an arrestor allows through during a strike. Must be less than or equal to the equipment's rated surge immunity. If your equipment is rated for 1,000V surges and your arrestor's VPL is 1,500V, the arrestor is useless.
- **GPR** = Ground Potential Rise. When lightning hits near a grounding electrode, the ground around it momentarily rises to a high voltage — like a ripple in a pond. Equipment and people at different distances from the strike point are at different voltages, causing dangerous current flow between them. The ground ring limits the GPR.
- **HKL zone** = High-Keraunic Level zone. An area with more than 60 thunderstorm days per year. Isokeraunic maps show this — Georgia is generally HKL.
- **NFPA 780** = National Fire Protection Association Standard 780. The US lightning protection code — governs air terminals (lightning rods), down conductors, bonding, and ground rings for US facilities.
- **IEC 62305** = International Electrotechnical Commission standard 62305. International lightning protection standard with four Lightning Protection Levels (LPL I–IV). Used for very high-exposure or international sites. NFPA 780 is primary for US rural OSP; IEC 62305 is supporting.
- **IEEE C62.41.2** = IEEE standard for VPL selection — helps you match arrestor VPL to equipment surge immunity rating.

**c. Concepts needing analogies:**
- Gas tube + MOV combination = two bouncers at a door. The first bouncer (gas tube) stops the big threats. The second bouncer (MOV) catches anything that got by the first.
- Ground ring = a moat around a castle. It intercepts the GPR "ripple" and keeps the potential inside the ring relatively flat, so there's no voltage difference between the building's metal parts.
- VPL = the "let-through" level. Like a water filter rated to remove particles above X microns — anything below gets through. Your equipment has to survive whatever gets through.

**d. Formulas:** No new formulas. VPL selection is a comparison (VPL ≤ equipment surge immunity rating) — walk through a concrete example: equipment rated at 1,000V, gas-tube VPL = 600V, MOV VPL = 800V → combination unit total let-through = 800V ≤ 1,000V → acceptable.

**e. Cross-refs:**
- L6.4: arrestors at A/UG transitions — introduced there as a placement rule. This lesson explains what they are and how to spec them.
- L6.3: pole ground — the arrestor grounds to the same pole ground assembly specified in L6.3.
- L6.5: ground ring at underground cabinet sites.

**Worked example anchor:** 3-mile aerial feeder in a Georgia county with 65 thunderstorm days/year. Build the protection plan: (1) arrestor at A/UG transition at each end (2 required); (2) additional arrestors at ≤ 1-mile intervals on the aerial segment (3-mile run → 2 intermediate arrestors at mile 1 and mile 2 = 4 total arrestors); (3) at both terminal facilities, add ground ring (buried bare Cu, 18–24 in. depth, encircling facility per NFPA 780 §4.13); (4) spec arrestor type: combination gas-tube + MOV, VPL ≤ equipment immunity rating.

**Quiz shape:** 2 questions — (1) recall: what arrestor type provides primary plus secondary protection in a single device? (Combination gas-tube + MOV); (2) applied: 3-mile aerial, HKL county — mark all required arrestor locations. Wrong-answer rationales must state the safety consequence.

---

### L6.9 — Stray Voltage and AC Induction Hazards: Detection, De-Energization, and PPG Procedures

**One-line objective:** Learner can execute the correct PPG pre-work sequence before touching messenger or armor on a joint-use pole, and explain how to detect and report stray voltage.

**CARTER REFRAME — LOCKED 2026-05-14:**

Carter's decision verbatim: **"None"** — the crew does NOT routinely encounter energized high-voltage (HV) joint-use infrastructure at the transmission voltage class.

**What is removed from the prior brief scope:**
- Rubber glove class selection table (OSHA 1910.269 approach-distance / voltage-class table)
- MAD (Minimum Approach Distance) table and worked problem
- "PPG/glove-class" scenario framing (the original brief had a 7.2 kV joint-use scenario requiring learners to select a glove class — that scenario is the wrong framing for this audience)

**What replaces it:**
The lesson reframes around what the crew actually does: **detecting stray voltage and following the PPG sequence before touching the cable.** The key skills are:
1. Knowing that metallic messenger and armor CAN carry dangerous induced voltage even on "just fiber" jobs.
2. Using a ground-rod tester (clamp-on ammeter or stray voltage meter) to detect induced voltage on the messenger before touching it.
3. Executing LOTO (Lockout/Tagout) when required — knowing who calls it and when.
4. Installing PPG (the ground jumper) correctly before hands contact cable — and leaving it in place until work is complete.
5. Recognizing when to stop and call for line de-energization through the utility.

**Pitch notes:**

**a. Plain-English framing:**
Here's the danger: the steel messenger on a joint-use pole runs parallel to the power line for hundreds of feet. That parallel run acts like a transformer. The power line is the primary winding; your messenger is the secondary. Even though nothing is physically connected, voltage is induced by the electromagnetic field. It can build to 40–100 volts or more (the DISCOVERY.md scenario referenced 48 VAC measured on a prior maintenance visit). That's enough to cause a serious shock.

The fix is simple but must be done in the right order:
1. **LOTO if required** — if you're working near the power lines, not just the cable, follow Lockout/Tagout per OSHA 1910.147. Know who calls it: your foreman or the utility contact. Don't touch the cable until LOTO is confirmed.
2. **Install PPG first, before your hands contact cable** — PPG (Personal Protective Grounding) means clamping a ground jumper from the messenger to the pole ground before touching anything. This drains any induced voltage to earth BEFORE you make contact.
3. **Test stray voltage** — use a stray voltage meter or clamp-on ammeter to verify the messenger reads near 0 volts after PPG is installed.
4. **Do the work.**
5. **Remove PPG after work is complete** — not before.

ADSS cable has no metallic messenger, but ADSS outer jacket still accumulates capacitive charge near power conductors. Test it the same way before touching it.

**b. Acronyms to unpack:**
- **PPG** = Personal Protective Grounding. A temporary ground jumper installed before hands contact a cable. Drains induced/accumulated voltage to earth.
- **LOTO** = Lockout/Tagout. A safety procedure (OSHA 1910.147) that physically locks the power source in the off position and tags it so no one can accidentally re-energize while someone is working on the circuit.
- **OSHA 1910.147** = OSHA's "Control of Hazardous Energy" standard. Covers LOTO procedures for all energy sources.
- **OSHA 1910.333** = OSHA's "Selection and Use of Work Practices" for electrical safety. Applies to working in proximity to energized conductors.
- **OSHA 1910.269** = OSHA's "Electric Power Generation, Transmission, and Distribution" standard. Covers line work near energized utility conductors. Reference only — full execution is T9's scope.
- **AC induction** = Alternating Current induction. The process by which the alternating magnetic field around a power conductor induces a voltage in a nearby parallel conductor (your messenger). No physical connection required — it works through the air.
- **IEEE 1048** = IEEE recommended practices for Protective Grounding of Power Lines (PPG equipment and procedures).
- **OSHA 1910.137** = OSHA standard governing rubber insulating equipment (gloves, sleeves, blankets). Covers voltage class ratings and dielectric test intervals for rubber protective equipment. Reference only — the crew's use of rubber gloves is governed by the utility's LOTO procedures, not by our lesson.

**c. Concepts needing analogies:**
- AC induction = a wireless charger. Your phone charges without touching the pad — the electromagnetic field transfers energy through the air. Same principle: the power line charges the messenger through the air.
- PPG = installing a lightning rod before you touch the storm-cloud wire. You give the charge a path to go before it goes through you.
- LOTO = putting a padlock on the circuit breaker so the power can't come back on while you're touching the wires. Mechanical guarantee, not just a verbal assurance.

**d. Formulas:** None. The stray voltage detection and PPG procedures are procedural, not mathematical. If authors want to explain why hundreds of volts can be induced, they can reference IEEE 367 (recommended practice for determining induced voltage on telecom conductors near power lines) as context — but no formula derivation required in this lesson.

**e. Cross-refs:**
- L6.1: why fiber OSP has electrical hazards even though fiber carries no current.
- L6.3: the pole ground that the PPG jumper connects to.
- T9: full field execution of PPG procedures. This lesson is the code-citation awareness level. T9 owns the hands-on procedure. "L6.9 teaches you why and what; T9 teaches you how."

**Worked example anchor (REFRAMED per Carter):** Pole record shows 48 VAC stray voltage on messenger from last maintenance visit. Crew is preparing to open a splice closure. Walk through the correct sequence:
1. Pull the pole record — note 48 VAC stray reading. This means PPG is mandatory.
2. LOTO check — is the utility line adjacent? If work requires proximity to the power conductors, contact utility for LOTO before proceeding.
3. Install PPG — clamp ground jumper from messenger to pole ground before any hands contact the cable. Both ends of the span should be grounded if possible.
4. Test stray voltage with meter after PPG installed — should read near 0. If not, PPG connection is bad or there is a second induction source.
5. Open closure and do the work.
6. Re-test before removing PPG.
7. Remove PPG after work complete.

**What the wrong answers look like in the quiz:** Touching the messenger before PPG is installed. Removing PPG during the work to have more slack. Assuming fiber cable means no electrical hazard.

**Quiz shape:** 2 questions — (1) recall: what does the crew install on the messenger BEFORE hands make contact? (PPG ground jumper); (2) applied: pole record shows 48 VAC stray — walk through the correct pre-work sequence in order. Wrong-answer rationales must state the safety consequence ("Incorrect — touching the messenger before PPG is installed exposes the installer to the accumulated induction voltage, which at 48 VAC is sufficient to cause a painful or incapacitating shock").

---

### L6.10 — Ground Resistance Testing and Acceptance: 3-Pole Fall-of-Potential, Clamp-On, and IEEE 81 Criteria

**One-line objective:** Learner can perform or direct a 3-pole fall-of-potential test, validate the 62% rule, determine whether the result passes the applicable threshold, and produce a RUS-ready test log.

**Pitch notes:**

**a. Plain-English framing:**
After you drive a ground rod, you need to measure how well it actually connects to earth. The standard method is the **3-pole fall-of-potential test** (IEEE 81 §9.3). Here's what it is in plain English:

You push current into the earth from your rod using an external current probe. You measure the voltage drop in the earth at various distances from the rod using a potential probe. The resistance of your rod is the voltage divided by the current (R = V/I — Ohm's Law). The trick: you have to place your probes far enough apart that you're measuring the rod's own resistance, not a shared resistance between the probes. That's the 62% rule.

**The 62% rule:** place the potential probe at 62% of the distance between the current rod and the test rod. Move the probe ±10% from that position. If the resistance reading changes less than 2%, you're in the "remote earth zone" — both probes are far enough apart. If the reading changes more than 2%, the probes are too close — move the current probe further out and retest.

Thresholds (three different numbers — which one applies depends on the facility):
- **≤ 25 Ω** — NEC §250.56 — minimum for any grounding electrode
- **≤ 5 Ω** — Telcordia GR-1275 §5 — required for active telecom facilities (FDH with electronics, CO)
- **≤ 1 Ω** — IEEE 80 §14.5 — required for substation-adjacent sites

The clamp-on method is a quick field check for systems that already have multiple ground rods. It measures the loop resistance of the whole GES. It is NOT valid as the primary acceptance test for a brand new single rod.

**b. Acronyms to unpack:**
- **IEEE 81** = IEEE Guide for Measuring Earth Resistivity, Ground Impedance, and Earth Surface Potentials. The standard that defines the 3-pole fall-of-potential test method.
- **Fall-of-potential** = the name for the test method. "Fall" because the earth potential "falls" (decreases) as you move away from the current injection point. You measure how it falls to determine resistance.
- **62% rule** = the positioning rule for the potential probe in a 3-pole test. Empirically derived — if the soil is uniform, the 62% position gives you the most accurate reading of just the test electrode's resistance, excluding the probe resistances.
- **Remote earth** = a point in the earth far enough from all electrodes that it is at true earth potential (0 volts). Your 62% probe must be in the remote earth zone for the test to be valid.

**c. Concepts needing analogies:**
- 3-pole fall-of-potential = measuring the friction in a single pipe section in a plumbing network. You inject flow (current) at one end and measure pressure drop (voltage) at the middle. Too close to the injection point and you're measuring the combined friction of multiple sections.
- 62% rule = finding the "sweet spot" in the plumbing analogy where you're measuring just the pipe section you care about. The ±10% probe move is the check that confirms you're at the sweet spot.
- Clamp-on test = measuring the total pressure drop in the whole plumbing system. Useful for checking the system overall but doesn't isolate a single rod's resistance.

**d. Formulas:**
- **Ohm's Law (R = V/I):** The tester outputs a known current and measures the voltage — the instrument calculates R automatically. But authors should show: if the tester injects 20 mA and measures 0.44 V at the 62% position → R = 0.44V / 0.020A = 22 Ω. Show the substitution.
- **62% probe distance calculation:** if current probe is at 40 ft (5 × 8-ft rod), then potential probe is at 0.62 × 40 = 24.8 ft ≈ 25 ft. Show this arithmetic explicitly.
- **62% rule validation:** if R at 50% = 18 Ω, R at 62% = 22 Ω, R at 75% = 28 Ω → ΔR = |28 − 18| = 10 Ω → 10/22 = 45% change → far exceeds 2% threshold → test is INVALID — move current probe further. Show every step.
- **Authoring guard on 2% threshold:** the 2% ΔR tolerance and 5× current probe distance rule must be cited from IEEE 81 §9.3 text before writing any [CORRECT] tag using these values. Do NOT state these values without section-level citation confirmation.

**e. Cross-refs:**
- L6.3: pole grounding installation — "L6.10 is where you verify what L6.3 specified."
- L6.5: FDH cabinet grounding — "The 5 Ω threshold introduced in L6.5 is what you're checking here."
- **T3 L3.12 cross-ref (see test log section below).**

**TEST LOG OWNERSHIP — CARTER-DIRECTED (2026-05-14):**

T6 L6.10 owns the RUS ground resistance test log template. T3 L3.12 (Close-Out Documentation) lists it in the close-out checklist with a cross-reference to L6.10. T3 L3.12 does NOT author the template — it points to L6.10.

**Test log template requirements for L6.10 authoring agent:**
The lesson must include a test log template artifact — not just describe it. Required fields:
- Date of test
- Structure ID / pole number / cabinet ID
- GPS coordinates of electrode (latitude, longitude)
- Test method (3-pole fall-of-potential or clamp-on)
- Instrument make, model, and serial number
- Instrument calibration date
- Current probe distance (ft)
- Potential probe distance at 62% (ft)
- Readings at 50%, 62%, 75% positions (Ω)
- 62% rule ΔR calculation and pass/fail
- Final accepted reading (Ω)
- Applicable threshold (NEC 25 Ω / GR-1275 5 Ω / IEEE 80 1 Ω)
- Pass / Fail / Remediation required
- Remediation action taken (if any)
- Post-remediation reading (Ω)
- Technician name and signature
- RUS Form 219 grounding section cross-reference

Present this as a completed example (filled in) for the Macon FDH worked example, not just as a blank form. Learners should see what a correct completed log looks like.

**T3 L3.12 follow-up (out of T6 brief scope — orchestrator action):** T3 L3.12 must be updated post-T6 authoring to include "Ground resistance test log — see T6 L6.10 for template" in its close-out documentation checklist. This is a retroactive T3 touch — queue it as a T3 trailer fix after T6 ships.

**Worked example anchor:** 3-pole test at new single-rod FDH. Readings: 50% = 18 Ω, 62% = 22 Ω, 75% = 28 Ω. Walk through: (1) 62% rule validation — INVALID (45% ΔR); (2) action: current probe was placed at 5× rod length = 40 ft — move to 10× = 80 ft and retest; (3) assume retest at 10× gives 50% = 19.5 Ω, 62% = 20 Ω, 75% = 20.6 Ω → ΔR = |20.6 − 19.5| / 20 = 5.5% — still > 2%, move to 15×; (4) at 15× the ΔR drops to 1.8% → valid; accepted reading = 20 Ω; (5) apply thresholds: 20 Ω passes NEC 25 Ω; 20 Ω FAILS GR-1275 5 Ω → remediation required; (6) complete test log with all fields.

**Quiz shape:** 2 questions — (1) recall: the clamp-on method (IEEE 81 §9.4) is valid as a primary acceptance test for a new single-rod installation — True or False? (False); (2) applied: 3-pole result returns 28 Ω at a new single-rod FDH — apply both NEC §250.56 and GR-1275 thresholds, specify remediation, and document for RUS close-out.

---

## SPECIAL SECTIONS

---

### L6.9 REFRAME SUMMARY (Carter 2026-05-14)

| Original scope (prior brief) | Reframed scope (Carter decision) |
|---|---|
| PPG + rubber glove class selection for 7.2 kV distribution primary | PPG installation + stray voltage detection sequence |
| MAD (Minimum Approach Distance) table worked problem | De-energization sequencing (LOTO per OSHA 1910.147) |
| Glove voltage class matching exercise | Stray voltage meter use before contact |
| Joint-use scenario requiring voltage-class selection | Worked example: 48 VAC stray reading → correct pre-work sequence |
| Lesson budget: 25 min (engineer-level depth on HV safety) | Lesson budget: likely 20–22 min (tighter scope); reallocate freed time to L6.5 cathodic or L6.10 test log template |

**What does NOT change in L6.9:**
- Title stays "Stray Voltage and AC Induction Hazards" (updated subtitle)
- OSHA 1910.147 LOTO awareness still in scope
- OSHA 1910.333 / 1910.269 brief reference still in scope (code pointers only)
- PPG procedure still the core deliverable
- IEEE 1048 still cited (PPG practices standard)
- T9 forward pointer still in scope: "This lesson is awareness + code citation. T9 owns field execution."

**What the wrong framing looks like (do NOT do this):** Writing a worked example that asks the learner to select rubber glove class for a 7.2 kV exposure. Carter's crew does not routinely encounter energized HV infrastructure at this voltage class. Teaching approach-distance math for a scenario the learner will never be in is at best wasted words, at worst confusing and dangerous (they might apply incomplete HV safety knowledge in a situation that requires a qualified electrical worker).

---

### L6.5 CATHODIC PROTECTION SCOPE (Carter 2026-05-14)

Add the following as a dedicated subsection in L6.5 (approximately 5–10 minutes of reading time):

**Title of subsection:** "Buried Conduit Near Gas and Water Lines: Cathodic Protection Isolation"

**Content outline:**
1. What cathodic protection is — one paragraph, plain English. (A DC current is run through buried metal pipes to prevent corrosion. Works like a slow-motion sacrificial anode. The pipe is kept at a slight negative voltage relative to the surrounding soil, so the soil doesn't corrode it.)
2. The hazard — your buried metallic conduit running parallel to a cathodically-protected gas or water line provides an unintended return path for that DC current. This drains the protection, accelerates corrosion on both systems, and can cause long-term structural failure of the gas line.
3. The fix — dielectric flanges or unions at structure crossings and at the entry/exit of parallel runs. These are non-conductive fittings that break the electrical path while maintaining a watertight mechanical connection.
4. How to identify the requirement — when you pull a crossing permit for a gas or water line, the permit application will note cathodic protection. If it does, specify dielectric isolation fittings in your design drawings.
5. Citation — NACE SP0169 §6.2 (isolation requirements for metallic structures crossing or paralleling cathodically protected pipelines). Note: NACE is now AMPP (Association for Materials Protection and Performance) — the standard number is unchanged.

**Pitch it as:** a story about a contractor who ran conduit parallel to a gas main for 200 feet, didn't install isolation fittings, and 5 years later the gas company found a pinhole leak at the parallel run section — corrosion accelerated by the stray DC. The investigation pointed to the missing dielectric isolation. Teaches why the rule exists, not just what the rule is.

---

### L6.10 TEST LOG OWNERSHIP (Carter 2026-05-14)

**T6 L6.10 owns the template.** This is the final assignment after both briefs raised the gap and Verifier B confirmed T3 L3.12 does not contain a ground resistance test log.

**T3 L3.12 follow-up (queue as trailer fix post-T6 authoring):** Add "Ground resistance test log — see T6 L6.10" to the T3 L3.12 close-out checklist. This is a retroactive one-line edit to T3 content — low risk, queue after T6 ships.

---

## CITATIONS AND STANDARDS TABLE

All citations below are locked unless marked AUTHORING-GUARD.

| Standard | Sections in scope | Lesson(s) | Status |
|---|---|---|---|
| NEC Art. 100 | Definitions: bonding, GES, EGC, bonding jumper | 6.1 | LOCKED |
| NEC Art. 250 Pts. I–II | §250.52(A)(3) Ufer; §250.52(A)(4) perimeter ring; §250.52(A)(5) rod spec; §250.56 supplemental rod + 25 Ω threshold; §250.66 conductor sizing; §250.94 IBT | 6.1–6.7 | LOCKED |
| NEC Art. 770 | §770.93 primary protector (UL 497B); §770.100 equipotential bond to GES | 6.6 | LOCKED |
| NEC Art. 800 | §800.93 conductor sizing; §800.100 grounding | 6.6 | LOCKED |
| NESC Rules | Rule 012 definitions; Rules 92, 96, 96C, 96F, 97, 441; Rule 230E | 6.1–6.9 | LOCKED |
| IEEE 1100 (Emerald Book) | §1.2 definitions; §1.3 scope; §8.3–8.6 installation practices | 6.1–6.8 | LOCKED |
| IEEE 81 | §9.3 3-pole fall-of-potential; §9.4 clamp-on method | 6.10 | AUTHORING-GUARD — verify 2% ΔR and 5× probe placement from actual IEEE 81 §9.3 text before writing [CORRECT] |
| IEEE 80 | §14 ground ring; §14.5 acceptance threshold (≤1 Ω substation) | 6.8, 6.10 | LOCKED |
| IEEE C62.41.2 | VPL selection for arrester coordination | 6.8 | LOCKED |
| IEEE 1048 | PPG practices for line work | 6.9 | LOCKED |
| IEEE 367 | Induced voltage on telecom conductors near power lines (supporting citation — explains physics in L6.9) | 6.9 | LOCKED (supporting only) |
| TIA-607-C | §4 system architecture; §5 conductor sizing for customer-owned OSP | 6.2, 6.7 | LOCKED |
| ANSI/TIA-758-C | §7.2–7.8 per lesson | 6.1–6.10 | LOCKED |
| NFPA 780 | §4.5 air terminals; §4.13 ground ring spec | 6.8 | LOCKED — NFPA 780 is PRIMARY for US rural OSP; IEC 62305 is supporting |
| IEC 62305 | §4 LPL I–IV (supporting for high-exposure sites) | 6.8 | LOCKED (supporting only) |
| UL 497B | Primary protector listing standard | 6.6 | LOCKED |
| OSHA 29 CFR 1910.147 | LOTO / Control of Hazardous Energy | 6.9 | LOCKED |
| OSHA 29 CFR 1910.333 | Selection and use of electrical safety work practices | 6.9 | LOCKED |
| OSHA 29 CFR 1910.269 | Electric power generation, transmission, distribution (brief ref only) | 6.9 | LOCKED |
| OSHA 29 CFR 1910.137 | Rubber insulating equipment (voltage class and dielectric test intervals) | 6.9 | LOCKED (supporting — crew glove selection governed by utility LOTO procedures) |
| Telcordia GR-1275 | §4 CO/FDH acceptance (≤5 Ω FDH, ≤1 Ω CO); §5 testing thresholds | 6.5, 6.7, 6.10 | LOCKED |
| NACE SP0169 | §6.2 isolation requirements for buried metallic structures crossing cathodically-protected pipelines | 6.5 | LOCKED |
| RUS 1751F-630 | §7 aerial grounding (rod spec, MGN bonding, downlead) | 6.3, 6.4 | LOCKED (confirmed in T4 and T5 briefs) |
| RUS 1751F-635 | §5 underground grounding | 6.5 | LOCKED (confirmed in T5 brief) |
| RUS 1751F-815 | §1–§8 (grounding bulletin) | All | AUTHORING-GUARD — see below |
| BICSI OSP-DRD | Ch. 8.1–8.8 per lesson | 6.1–6.10 | LOCKED |

---

## OPEN AUTHORING-TIME GUARDS

These are NOT user-decision items — Carter has already answered all user questions. These are verification tasks for the authoring agents before writing [CORRECT] tags or citing specific section numbers.

### Guard P1 — RUS 1751F-815 existence (CRITICAL)

Both framing agents and both verifiers flagged this. RUS Bulletin 1751F-815 is cited throughout the briefs as the primary RUS grounding bulletin, with section numbers (§1–§8) that are structurally plausible but NOT confirmed from an actual copy.

**Authoring agent action:** Before citing 1751F-815 in any lesson body or quiz, verify the bulletin exists and confirm the section map via USDA/RUS website or RUS bulletin index. If 1751F-815 does not exist as a discrete bulletin:
- **Fallback for aerial grounding:** RUS 1751F-630 §7 (locked, confirmed in T4 and T5)
- **Fallback for underground grounding:** RUS 1751F-635 §5 (locked, confirmed in T5)
- Do NOT write [CORRECT] referencing 1751F-815 §X without section verification.

### Guard P2 — IEEE 81 §9.3 numeric values

The 2% ΔR tolerance threshold for 62% rule validation and the 5× current probe distance rule are cited as IEEE 81 §9.3 values. Both are structurally plausible and widely cited in the industry, but:

**Authoring agent action:** Verify both values from actual IEEE 81 §9.3 text before writing [CORRECT] on any quiz question that uses these numbers. If the standard states the tolerance differently (e.g., as a qualitative criterion or a range), adapt the exam question framing accordingly.

### Guard P3 — ADSS armor bond exception

BRIEF_FRAMING_A noted the ADSS armor bond exemption as "pending BICSI OSP-DRD Ch. 8.2 confirmation." The exemption (ADSS = no armor bond required) is consistent with the technical reality (no metallic armor to bond) but should be confirmed from BICSI OSP-DRD Ch. 8.2 before writing it as a [CORRECT] tag in L6.4.

### Guard P4 — P5 internal acceptance threshold

Carter confirmed no custom internal threshold (defaults to NEC 25 Ω / GR-1275 5 Ω). No action required. Using the standard thresholds.

### Guard P5 — Cathodic protection lesson scope confirmation

Carter confirmed cathodic protection is IN SCOPE for L6.5 with NACE SP0169 isolation principles. Authors should cite NACE SP0169 §6.2. Note: NACE is now AMPP — the document number is unchanged; the organization name has changed. Either name is acceptable in citations but note the name change in the lesson.

---

## FINAL EXAM SHAPE

- **20 questions** — 2 per lesson × 10 lessons
- **Pass threshold:** 14/20 = 70% (math: 20 × 0.70 = 14.0 — clean)
- **Format:** A–D options; [CORRECT] tag inline; *Rationale:* italic block with per-option sub-bullets and 1-line rationale + citation; lesson-ordered in source; randomized at Moodle import
- **Per-lesson quiz:** 5 questions (T2/T5 baseline convention)
- **Safety questions** (L6.8 L6.9): wrong answers MUST state the safety consequence in the rationale block
- **YAML frontmatter per T5 convention:** title, duration_min, topic: osp-grounding-bonding-protection, order, bicsi_alignment, sources

---

## SECTION ORDER (INVARIANT — PER T5 CONVENTION)

1. Learning Objectives
2. Reading Content
3. Key Terms (Flashcard Candidates)
4. Interactive(s)
5. Final Check (2 pulse questions, full *Expected answer:*)
6. Glossary Cross-References

---

## DEFERRAL CLOSURES — REQUIRED OPENERS

Three lessons MUST open with an explicit deferral acknowledgment block. Authors: do not bury this in a footnote — put it in the first paragraph of the Reading Content section.

| Lesson | Required opener text |
|---|---|
| L6.3 | "In T5 L5.1, we covered strand hardware selection — and we explicitly deferred strand bonding and MGN bonding to this lesson. This is where it lives." |
| L6.6 | "In T4 L4.7, we stopped at the code-pointer level for NEC Art. 250 IBT and electrode types. In T4 L4.6, we covered the NEC Art. 800 structure. This lesson is where we put it all together in installation practice." |
| L6.7 | "In T5 L5.9, we covered FDH housing hardware — and explicitly deferred FDH housing grounding to this lesson. This is where it lives." |

---

*Word count: ~7,200 words. Authoring pair should use this document as the single source of truth for T6. No additional user input required before authoring begins.*

=== T6 BRIEF RE-BASELINE END ===
