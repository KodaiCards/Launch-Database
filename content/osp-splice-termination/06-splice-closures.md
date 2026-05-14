---
title: "Lesson 2.6: Splice Closures — Dome vs. In-Line, Environmental Ratings, Sealing"
duration_min: 25
topic: splice-termination
order: 6
bicsi_alignment:
  - "OSP-DRD 8: Splice enclosures — types, environmental ratings, and installation"
  - "OSP-DRD 7.3: Splice protection and closure selection"
sources:
  - "Corning Cable Systems SCF/SCB Dome Closure Installation Guide (public edition)"
  - "CommScope FOSC-400/450 Splice Closure Technical Manual"
  - "AFL OSP Splice Closure Design Guide"
  - "BICSI OSP-DRD Manual, Ch. 8"
  - "IEC 60068-2-14 (thermal shock — environmental testing for outdoor-rated enclosures)"
  - "ANSI/TIA-758-C Section 7 (outside plant cable infrastructure — splice closure requirements)"
  - "TE Connectivity / Tyco FIST Closure Installation Guide (public edition)"
---

# Splice Closures: Dome vs. In-Line, Environmental Ratings, Sealing

## Learning Objectives

Upon completing this lesson, the learner will be able to:

- Distinguish between dome (cylindrical) and in-line (butt) splice closure architectures and state the deployment environment where each is preferred
- Define IP68 and explain its significance for buried splice closures
- Compare gel-seal and heat-shrink cable port sealing methods, including re-entrability and installation time trade-offs
- Size a closure correctly for a given fiber count and cable count, including re-entry frequency considerations
- Identify the environmental performance factors (UV resistance, temperature range, crush resistance) that distinguish aerial from buried closure ratings

---

## Reading Content

### The Closure's Job

A splice closure exists to do one thing: protect the optical splice from the environment for the design life of the outside plant — typically 20–40 years in buried infrastructure, 15–25 years in aerial plant. Everything about closure selection — architecture, sealing method, environmental rating, size — is evaluated against that requirement. A closure that fails to seal allows moisture ingress, which raises insertion loss at fusion and mechanical splices through water-film formation on the fiber end-face, and ultimately destroys the fiber through stress corrosion if water contacts bare glass near the splice zone [BICSI OSP-DRD Manual, Ch. 8; ANSI/TIA-758-C §7].

Three deployment environments drive the primary specification choices:
- **Buried** — in conduit or direct-buried; subject to groundwater, hydrostatic pressure, temperature cycling between approximately −20°C and +60°C, and soil load
- **Aerial** — lashed to strand or figure-8 self-support; subject to UV, wind-induced vibration, precipitation, temperature cycling between −40°C and +70°C or more in high-altitude and continental climates
- **Pedestal/vault** — above-grade enclosure or buried vault with limited access; subject to periodic flooding, debris, and human-factor damage on re-entry

### Dome Closures

A dome closure (also called a cylindrical or re-enterable dome) is the most common splice closure type in both buried and aerial applications. The defining feature of its architecture is a cylindrical barrel with a domed or flat end-cap and a base plate where the cables enter [Corning SCF/SCB Guide, §1; CommScope FOSC-400 Manual, §1.2]:

**Construction.** The barrel and end-cap are typically high-density polyethylene (HDPE) or UV-stabilized polycarbonate. The base plate is a rigid polymer body with cable port holes sized for the cable diameters being accommodated. The organizer tray stack (splice trays, fiber management guides) mounts inside the barrel on a central post or bracket anchored to the base plate. The barrel slides over the organizer assembly and seals against the base plate via a compression gasket (gel block or elastomeric O-ring), or through a gel-filled sealing system where the gel flows around cable jackets to fill void space on the base plate surface.

**Cable entry and count.** Dome closures accommodate cables entering from one end only — the base plate. This is the defining geometric difference from an in-line closure. Common base plates accommodate 2–6 cable ports; larger dome closures designed for feeder splice applications (Corning SCB-series, CommScope FOSC-450-series) accommodate up to 12 cable ports [Corning SCF/SCB Guide, §3.1; ANSI/TIA-758-C §7.2].

**Fiber count.** Dome closures scale by the number of tray positions inside the barrel. Typical capacities: 48–576 splices, depending on barrel size and tray type. Ribbon splice trays occupy more vertical space per tray than single-fiber trays; actual capacity in ribbon configurations may be 25–40% lower than the rated single-fiber maximum [CommScope FOSC-400 Manual, §2.1].

**Re-entrability.** Dome closures are designed for re-entry — the barrel can be removed by pressing on the base plate release tabs (or by cutting the re-entry ring on pre-sealed variants), giving access to the tray stack without disturbing the cable entry seals. This makes dome closures the preferred choice for applications where future fiber adds, re-routes, or splice work is anticipated [BICSI OSP-DRD Manual, Ch. 8; Corning SCF/SCB Guide, §5].

**Preferred environments:** Buried in conduit, buried direct, pedestal/vault, small aerial applications.

#### Dome Closure Re-Entry Procedure

Re-entry is the single largest cause of new fiber damage in existing outside plant. A poorly sequenced re-entry can break fibers at the tray entry anchor point, dislodge splice protection sleeves, and compromise port seals that were intact at initial installation. The following ordered procedure must be followed every time a dome closure is opened on existing plant [BICSI OSP-DRD Manual, Ch. 8; IEC 61753-1; Corning SCF/SCB Guide, §5]:

> **⚠ CAUTION — PRESSURIZED CLOSURES:** Some buried feeder dome closures in Tier 1 carrier plant are nitrogen-pressurized for continuous integrity monitoring. This lesson covers non-pressurized closures only. Before beginning any re-entry, verify with network operations whether the closure is on a pressurized monitoring circuit. **A pressurized closure must have its pressure released per the manufacturer's depressurization protocol before the barrel is opened — never open a pressurized closure as if it were a standard dome.** Venting a pressurized closure without controlled release can force gel or debris into the fiber path and risk cable tension damage [BICSI OSP-DRD Manual, Ch. 8].

1. **Site safety and lockout/tagout.** Notify the network operations center before opening any closure on live traffic. Place traffic cones and follow dig-safe / confined-space protocols as required. Confirm the closure is correctly identified (cable route ID, splice location tag) before breaking any seal. If the closure is associated with a pressurized monitoring system, complete the depressurization lockout per step 0 above before proceeding.

2. **Cable tension relief.** Before removing the barrel, verify that all cables entering the closure have adequate slack in the vault or conduit — at minimum 0.3 m of loose cable at the base plate. If a cable is under tension (tight against the port entry), relieve the tension at the nearest slack point before opening the closure. Opening the barrel while cables are under tension causes the tray stack to shift toward the cable entry side, shearing fibers at the tray anchor slots.

3. **Gasket and port seal inspection.** Before disturbing the tray stack, inspect the base plate gasket and all port seals while the barrel is first removed. Note any visible moisture ingress, gel migration out of port seals, or cracked blank plugs. Photograph the as-found condition. Seals showing ingress signs must be replaced before re-closing — do not defer seal repairs to a later visit.

4. **Port re-sealing confirmation (pre-work).** For gel-seal closures, verify that all cable port gel blocks are still compliant (gel filling the full annular space, no voids). For heat-shrink-sealed ports, verify no shrink-tube lifting or cracking. If any port seal requires replacement, stage the new materials before disturbing the tray stack — replacing a port seal after re-splicing work is complete adds unnecessary re-entry risk.

5. **Tray stack work.** Perform splicing, fiber adds, or re-routes with the minimum disturbance to fibers not involved in the work. Replace all splice protection sleeves in their indexed holder slots. Verify all fiber loops are seated in their retention clips before closing the tray cover.

6. **Re-test seal before closing.** Before sliding the barrel back onto the base plate, compress the gasket by hand and verify it is fully seated in its groove with no gaps. Torque port compression nuts or gel-block clamps to the manufacturer's specified torque value (typically 2–4 N·m for gel-block clamps). Install a new blank plug in any port that was accessed. Do not re-use blank plugs removed during the re-entry.

7. **Post-re-entry OTDR verification.** Perform an OTDR sweep on all fibers that were in the closure (not only the fibers that received work) before backfilling or re-lashing. Compare trace against the pre-re-entry baseline. Any fiber showing increased loss at the re-entry closure location must be investigated before the closure is resealed permanently. Document the post-re-entry trace in the as-built record [BICSI OSP-DRD Manual, Ch. 8; IEC 61753-1].

### In-Line (Butt) Closures

An in-line closure (also called a butt closure or through closure) has a different geometry: cables enter from both ends of the closure body, passing through the organizer in a linear path. The closure body is typically a split-shell design — two half-shells (or a base and lid) that are bolted or clamped together around the splice organizer and cable entries [CommScope FOSC Manual, §1.3; TE Connectivity FIST Guide, §1.1].

**Why in-line for conduit applications.** When fiber cables are pulled through conduit and the splice closure must also fit inside the conduit (or be installed in a hand-hole with limited clearance in the cable path's axial direction), the in-line closure's narrow profile along the cable axis is a critical advantage. A dome closure's base-plate geometry requires the cables to make a 90° bend from the cable path to the downward-entering base plate port — acceptable in a large vault, unacceptable in a tight hand-hole where cable bending radius is already at minimum. An in-line closure maintains the cable path in a straight line through the closure, avoiding the bend [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC Manual, §1.3].

**Sealing complexity.** In-line closures have two cable entry ends rather than one; both ends must be sealed. Heat-shrink end-caps or mechanical end-seals with compression nuts are the typical cable port options. Re-entry requires removing the end caps and breaking the port seals on both ends if the closure has a through-cable (continuity cable passing through the closure) in addition to the drop or feeder ports [AFL Closure Design Guide, §2.2].

**Fiber count.** In-line closures are generally rated for lower maximum fiber counts than large dome closures — typically 24–288 splices — due to the narrower interior volume. High-fiber-count infrastructure requiring 432F+ splice capacity at a single location typically uses dome closures [BICSI OSP-DRD Manual, Ch. 8].

**Preferred environments:** Conduit pull-through applications, hand-holes with axial clearance constraints, aerial mid-span splice locations where a streamlined profile reduces wind loading.

### Environmental Ratings

#### IP68 for Buried Closures

The IEC 60529 Ingress Protection (IP) rating system defines two digits: the first for solid particle ingress protection, the second for liquid ingress protection. **IP68** means:
- **6** — Dust-tight; no ingress of dust particles
- **8** — Protection against the effects of continuous immersion in water, at conditions specified by the manufacturer (typically 1.0–3.0 m depth for 24–72 hours) [BICSI OSP-DRD Manual, Ch. 8; Corning SCF/SCB Guide, §1.2; ANSI/TIA-758-C §7.3]

IP68 is the minimum requirement for buried OSP splice closures in most carrier specifications. Buried closures in areas with high groundwater tables or frequent flooding events may be tested at greater depth or longer duration than the standard IP68 manufacturer spec — always verify the project specification's IP rating requirement against the closure manufacturer's published immersion depth and duration data [ANSI/TIA-758-C §7.3; CommScope FOSC-400 Manual, §1.4].

Note that IP68 addresses water ingress only under static pressure. Dynamic pressure events (water hammer during conduit flushing, hydrostatic surge in flooded vaults) are tested separately under IEC 60068-2-14 thermal shock and related environmental test regimes. A closure rated IP68 for static immersion may fail a conduit-flush water-jet event if the port seals are not correctly installed [IEC 60068-2-14; CommScope FOSC Manual, §1.4].

#### Aerial Closure Ratings

Aerial closures face different primary stressors than buried closures [AFL Closure Design Guide, §3.1; BICSI OSP-DRD Manual, Ch. 8]:

**UV resistance.** Aerial closures must be fabricated from UV-stabilized polymer (UV-stabilized HDPE, UV-stabilized polycarbonate, or UV-resistant HDPE with carbon black filler). An unstabilized polymer aerial closure degrades in 3–5 years of direct sun exposure, becoming brittle and cracking — compromising the seal. UV stabilization rating must match the expected solar exposure of the installation region; high-altitude and low-latitude installations have higher UV flux.

**Temperature range.** Aerial closures experience wider temperature swings than buried closures — a black-jacketed aerial closure in direct summer sun can reach +60–70°C on the exterior surface while the interior fiber experiences +50°C. Winter temperatures in northern climates push interior temperatures to −30°C or lower. The closure must maintain its seal integrity (gasket elasticity, gel viscosity) across this full range. Most aerial closures are rated for −40°C to +70°C [CommScope FOSC Manual, §1.4; AFL Closure Design Guide, §3.1].

**Wind-induced vibration (aeolian vibration).** Aerial closures mounted on lashed cable are subject to aeolian (wind-induced) vibration. The closure's weight and its attachment method to the messenger strand must not amplify vibration at frequencies that could disturb the splice organizer or loosen cable port clamps. Heavy, asymmetrically mounted closures can act as resonant mass dampers or, conversely, amplify vibration. Mounting hardware must match the closure manufacturer's specified clamp-to-strand interface [BICSI OSP-DRD Manual, Ch. 8; AFL Closure Design Guide, §3.2].

**Crush resistance.** Buried closures in direct-bury applications must resist soil overburden and equipment overrun (backhoe teeth, compaction roller). ANSI/TIA-758-C §7.1 specifies minimum crush resistance for direct-bury closures; typical minimum is 400 N/cm crush load resistance. Conduit-installed closures receive partial crush protection from the conduit and have relaxed body crush requirements.

### Gel-Seal vs. Heat-Shrink Cable Port Sealing

At every cable entry point on a splice closure, the annular gap between the cable jacket and the closure port hole must be sealed. Two dominant field sealing methods exist: **gel-seal (gel block)** and **heat-shrink end-cap** [Corning SCF/SCB Guide, §4; CommScope FOSC Manual, §4; AFL Closure Design Guide, §4].

#### Gel-Seal (Re-Enterable)

A gel-seal closure uses a conformable polymer gel block (or gel-filled base plate) that flows under compression to fill the irregular annular space between the cable jacket and the port body. The gel maintains its seal under repeated temperature cycling without cracking (unlike cured silicone or epoxy). The primary advantage is **re-entrability**: the gel seal can be re-entered by pulling the cable through the gel block and re-compressing the closure; no heat tools are required, and the gel re-seals around the re-entered cable.

- **Re-entry time:** 15–30 minutes per cable port for a gel-seal closure (no heat drying cycle; just re-compress and re-close) [Corning SCF/SCB Guide, §5.1]
- **Temperature range:** gel seals are typically rated −40°C to +70°C [AFL Closure Design Guide, §4.1]
- **Preferred for:** high-reentry-frequency locations (FDH ports, distribution closure splice access points); locations where heat tools are restricted (confined spaces, elevated aerial work)

#### Heat-Shrink End-Cap

A heat-shrink cable port applies a heat-activated adhesive-lined shrink tube over the cable jacket at the closure port entry. When heat is applied (heat gun or torch), the tube shrinks to grip the cable jacket and the internal adhesive liner flows around the cable, filling the annular space with a cured adhesive seal [CommScope FOSC Manual, §4.2; AFL Closure Design Guide, §4.2].

- **Installation time:** 5–10 minutes per cable port (shrink application + cool-down) vs. longer for gel (assembly and compression)
- **Re-entry difficulty:** High — heat-shrink seals are not re-enterable without cutting the shrink tube and re-installing a new one. Re-entry requires new heat-shrink material, a heat tool, and a cool-down period before the closure can be re-closed.
- **Environmental durability:** Heat-shrink adhesive seals are effective long-term barriers in buried applications; the cured adhesive is not subject to gel migration at elevated temperatures.
- **Preferred for:** Buried closures in high-temperature environments where gel migration is a concern; low-reentry locations (backbone splice vaults, final termination points)

| Attribute | Gel-seal | Heat-shrink |
|---|---|---|
| Re-entrability | High — gel re-seals after re-entry | Low — shrink tube must be cut and replaced |
| Installation time | 10–20 min (assembly + compression) | 5–10 min (heat + cool-down) |
| Field tool required | None (compression tool) | Heat gun or torch |
| Temperature range | −40°C to +70°C typical | −40°C to +85°C typical |
| Long-term gel migration risk | Present at sustained >60°C | None (cured adhesive) |

*Sources: [Corning SCF/SCB Guide, §4–5; CommScope FOSC Manual, §4; AFL Closure Design Guide, §4]*

### Sizing a Closure for Fiber Count and Re-Entry Frequency

Closure selection requires three inputs: the cable count at the splice location, the fiber count per cable, and the anticipated re-entry frequency [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC-400 Manual, §2.1].

**Cable count drives port sizing.** Count the total number of cable entries: feeder cables (through or terminated), distribution drop cables, and any stub cables for future capacity. Select a base plate with sufficient port count for all cables plus at least one spare port (sealed with a blank plug) for future cable additions.

**Fiber count drives tray capacity.** Total fiber count = sum of all fibers across all cables entering the closure. Divide by the tray capacity (typically 12 or 24 splices per tray) and select a closure body with enough tray positions. For ribbon cable, note that ribbon splice trays are physically larger per splice than single-fiber trays; a closure rated at 144 single-fiber splices may only accommodate 72–96 ribbon splices in the same tray stack height [CommScope FOSC-400 Manual, §2.1; BICSI OSP-DRD Manual, Ch. 8].

**Re-entry frequency drives sealing method.** If the splice location will be accessed more than once over the plant lifetime (FDH ports, distribution points where new drops will be added), select gel-seal ports for all cables requiring future re-entry. Backbone feeder cables that will never be re-entered at this location may use heat-shrink ports for long-term seal integrity [BICSI OSP-DRD Manual, Ch. 8; Corning SCF/SCB Guide, §4].

---

## Key Terms (Flashcard Candidates)

**Dome closure**
A cylindrical splice closure with a barrel body and base plate where all cables enter from one end. Re-enterable design; barrel slides off the tray stack for access. Preferred for buried conduit, direct-bury, pedestal, and vault applications. Scales to 576+ splices in large-body variants. [BICSI OSP-DRD Manual, Ch. 8; Corning SCF/SCB Guide, §1]

**In-line closure**
A splice closure with a split-shell body where cables enter from both ends along the cable axis. Narrow axial profile makes it suitable for conduit pull-through and hand-hole applications where a dome's cable bend geometry would violate minimum bend radius. Typically limited to 24–288 splices. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC Manual, §1.3]

**IP68**
IEC 60529 rating for splice closures: dust-tight (6) and protected against continuous water immersion at manufacturer-specified depth and duration (8). Minimum requirement for buried OSP splice closures in most carrier specifications. [BICSI OSP-DRD Manual, Ch. 8; ANSI/TIA-758-C §7.3]

**Gel-seal (gel block)**
A cable port sealing method using a conformable polymer gel that flows under compression to fill the annular gap between cable jacket and port body. Re-enterable without heat tools; gel re-seals around re-entered cables. Subject to gel migration at sustained temperatures above +60°C. [Corning SCF/SCB Guide, §4; AFL Closure Design Guide, §4.1]

**Heat-shrink end-cap**
A cable port sealing method using an adhesive-lined heat-activated shrink tube applied over the cable jacket at the closure port entry. Faster installation than gel-seal; not re-enterable without cutting and replacing. Cured adhesive is not subject to gel migration. [CommScope FOSC Manual, §4.2; AFL Closure Design Guide, §4.2]

**Re-entrability**
The ability to open a splice closure and gain access to the splice organizer without destroying the cable port seals or requiring new sealing materials. Gel-seal closures are re-enterable; heat-shrink-sealed closures require cutting and replacing the port seal on re-entry. [BICSI OSP-DRD Manual, Ch. 8; Corning SCF/SCB Guide, §5]

**Aeolian vibration**
Wind-induced vibration of aerial cable plant at frequencies determined by wind speed and cable diameter. Aerial splice closures must be designed to resist amplifying aeolian vibration at the splice organizer, which could disturb fiber routing and raise microbend-induced attenuation. [BICSI OSP-DRD Manual, Ch. 8; AFL Closure Design Guide, §3.2]

**Cable port (closure)**
A defined entry point in a splice closure base plate or end-cap, sized for a specific cable outer diameter (or diameter range). Each port must be sealed after cable installation; spare ports are sealed with blank plugs. The total port count on the base plate limits the number of cables that can enter the closure. [BICSI OSP-DRD Manual, Ch. 8; ANSI/TIA-758-C §7.2]

---

## Interactive: Drag-and-Drop — Match Closure Type to Deployment Environment

**Drag-and-drop mechanic:** Six environment cards are presented on one side; three closure/sealing-method cards are on the other side. The learner drags each environment card to the correct closure/sealing-method card. Multiple environment cards may map to the same closure/sealing method.

**Closure/sealing-method cards:**
- **Card A: Dome closure + gel-seal ports**
- **Card B: In-line closure + heat-shrink end-caps**
- **Card C: Dome closure + heat-shrink ports**

**Environment cards:**
1. Buried backbone feeder conduit, low re-entry expected (final splice location)
2. Aerial mid-span, linear cable path, space-constrained messenger attachment
3. FDH vault — buried, high re-entry frequency for future fiber additions
4. Direct-bury (no conduit), rural feeder route, extreme soil temperature swings expected
5. Hand-hole conduit, tight axial cable clearance, single access event expected
6. Pedestal-mounted distribution closure, moderate re-entry frequency

**Correct matches:**
1. → **C** (Dome + heat-shrink) — Buried backbone, low re-entry: dome is the standard buried form; heat-shrink for long-term seal in permanent installation. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC Manual, §4]
2. → **B** (In-line + heat-shrink) — Aerial mid-span, linear path: in-line's narrow profile maintains cable line without bending; heat-shrink is standard for aerial port sealing. [BICSI OSP-DRD Manual, Ch. 8; AFL Closure Design Guide, §2.2]
3. → **A** (Dome + gel-seal) — FDH vault, high re-entry: dome is the correct architecture; gel-seal allows fast re-entry without heat tools. [Corning SCF/SCB Guide, §4–5; BICSI OSP-DRD Manual, Ch. 8]
4. → **C** (Dome + heat-shrink) — Direct-bury extreme temperature: dome for buried; heat-shrink preferred in high-temperature direct-bury where gel migration is a risk. [AFL Closure Design Guide, §4.2; BICSI OSP-DRD Manual, Ch. 8]
5. → **B** (In-line + heat-shrink) — Hand-hole axial constraint, single access: in-line for conduit axial clearance; heat-shrink for long-term seal in an access-once location. [CommScope FOSC Manual, §1.3; §4.2]
6. → **A** (Dome + gel-seal) — Pedestal, moderate re-entry: dome architecture; gel-seal for re-entrability at distribution points where drops will be added. [BICSI OSP-DRD Manual, Ch. 8]

---

## Multiple-Choice Quiz

---

**Q1.** An in-line splice closure is preferred over a dome closure in a hand-hole conduit application because:

- A) In-line closures have a higher IP rating than dome closures in buried applications
- B) The in-line closure maintains the cable in a straight axial path, avoiding the cable bend required by a dome closure's base-plate entry geometry **[CORRECT]**
- C) In-line closures accommodate more fiber splices per unit volume than dome closures
- D) In-line closures use gel-seal ports exclusively, which perform better in flooded hand-holes

*Rationale:*
- **A — Incorrect.** IP rating is determined by the specific closure model's design and seal quality, not by the architectural type (dome vs. in-line). Both dome and in-line closures are available in IP68-rated variants for buried applications. [ANSI/TIA-758-C §7.3; BICSI OSP-DRD Manual, Ch. 8]
- **B — Correct.** A dome closure requires cables to enter from one end only (the base plate), which typically means the feeder and distribution cables must make a bend from their axial cable path down to the base plate entry ports. In a tight hand-hole where minimum cable bend radius is already at the limit, this geometry is problematic. The in-line closure allows cables to enter from both ends, maintaining a straight-line cable path through the closure body, which is ideal for conduit pull-through and axially constrained installations. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC Manual, §1.3]
- **C — Incorrect.** In-line closures are typically smaller-capacity than large dome closures — 24–288 splices vs. up to 576+ for large dome variants. For high-fiber-count applications, the dome closure is the higher-capacity choice. [CommScope FOSC-400 Manual, §2.1; BICSI OSP-DRD Manual, Ch. 8]
- **D — Incorrect.** In-line closures are available with both gel-seal and heat-shrink port options; they do not use gel-seal exclusively. Port sealing method is specified independently of the closure architecture. [AFL Closure Design Guide, §4; CommScope FOSC Manual, §4]

---

**Q2.** A buried splice closure is described as IP68 rated at 3 m / 72 hours. What does this mean in practice?

- A) The closure is tested to resist crush loads of 3 m of soil overburden for 72 hours without deforming
- B) The closure can resist ingress of dust and can withstand continuous water immersion at 3 m depth for 72 hours under the manufacturer's specified test conditions **[CORRECT]**
- C) The closure is rated for installation depths of 3 m maximum, with a 72-hour installation window before sealing is required
- D) The closure can sustain a flow rate of 3 m/second across the port seals for 72 hours without leakage

*Rationale:*
- **A — Incorrect.** Crush resistance is a mechanical specification typically expressed in N/cm or as a soil cover depth rating (e.g., "suitable for direct burial under 600 mm of cover"). It is tested separately from IP ratings and is not part of the IP68 definition. [ANSI/TIA-758-C §7.1; BICSI OSP-DRD Manual, Ch. 8]
- **B — Correct.** The IP68 designation from IEC 60529 means: first digit 6 = dust-tight; second digit 8 = protection against continuous immersion in water at conditions specified by the manufacturer (in this case, 3 m depth for 72 hours). After 72 hours at 3 m depth, the closure must show no ingress of water that would damage the enclosed components. [ANSI/TIA-758-C §7.3; BICSI OSP-DRD Manual, Ch. 8; Corning SCF/SCB Guide, §1.2]
- **C — Incorrect.** IP ratings have no relationship to installation depth limits (which are governed by OSP cable burial depth standards, not closure ratings) or to installation time windows. The 3 m and 72 hours in IP68 specifications refer to the standardized test conditions, not operational constraints. [IEC 60529; BICSI OSP-DRD Manual, Ch. 8]
- **D — Incorrect.** IP68 addresses static water immersion, not flow velocity or dynamic pressure. Water hammer and high-velocity water jet resistance are tested by other methods (e.g., IP65 for water jet resistance, which requires a separate first-digit-5 or second-digit-4–6 classification). [IEC 60529; BICSI OSP-DRD Manual, Ch. 8]

---

**Q3.** A distribution splice closure at an FDH is expected to be re-entered four to six times over 15 years as new drops are added. Which sealing method is most appropriate for the cable ports carrying the distribution cables?

- A) Heat-shrink end-caps — they provide the most durable long-term seal
- B) Epoxy injection around each cable jacket — fully waterproof and permanent
- C) Gel-seal ports — re-enterable without heat tools, and the gel re-seals around re-entered cables **[CORRECT]**
- D) Open ports without sealing — distribution closures in pedestals do not require cable port sealing

*Rationale:*
- **A — Incorrect.** Heat-shrink ports are not re-enterable without cutting the shrink tube and replacing it with a new one. For a closure that will be re-entered four to six times, heat-shrink is operationally costly — each re-entry requires new material, a heat tool, and a cool-down period. For high-reentry locations, gel-seal is the appropriate choice. [CommScope FOSC Manual, §4.2; AFL Closure Design Guide, §4.2]
- **B — Incorrect.** Epoxy injection is not an approved field sealing method for splice closure cable ports. It would produce a permanent, non-re-enterable seal that would require cutting and re-installing the closure body on every access event. [BICSI OSP-DRD Manual, Ch. 8]
- **C — Correct.** Gel-seal ports are specifically designed for high-reentry-frequency applications. The gel is a conformable polymer that flows around cable jackets and re-seals after a cable is moved or a new drop is added. No heat tool is required; re-entry time per port is 15–30 minutes. For an FDH distribution closure with anticipated repeated re-entries, gel-seal is the standard specification. [Corning SCF/SCB Guide, §4–5; BICSI OSP-DRD Manual, Ch. 8]
- **D — Incorrect.** Distribution closures in pedestals and FDH vaults are absolutely required to have sealed cable ports. A pedestal or FDH vault is periodically subject to flooding, debris ingress, and moisture accumulation. Unsealed cable ports would allow water and contaminants to enter the closure body and reach the splice organizer. [BICSI OSP-DRD Manual, Ch. 8; ANSI/TIA-758-C §7.2]

---

**Q4.** A splice closure is being selected for a direct-bury rural backbone application in an area with extreme summer temperatures (soil temperature reaching +58°C in summer). The location is a permanent backbone splice that will not require re-entry. Which sealing method and primary thermal concern should drive the specification?

- A) Gel-seal ports; UV resistance is the primary concern in direct-bury applications
- B) Heat-shrink end-caps; gel migration at sustained elevated temperature is a risk in permanently sealed buried closures **[CORRECT]**
- C) Gel-seal ports; aeolian vibration resistance requires gel-seal over heat-shrink in rural environments
- D) Heat-shrink end-caps; heat-shrink seals provide higher IP68 ratings than gel-seal in high-temperature soils

*Rationale:*
- **A — Incorrect.** UV resistance is a primary concern for aerial and above-grade closures, not for direct-buried closures that receive no solar exposure. The thermal concern in a high-temperature direct-bury application is gel migration — gel viscosity decreases at sustained high temperatures and the gel can migrate away from the port sealing zone. [AFL Closure Design Guide, §4.1; BICSI OSP-DRD Manual, Ch. 8]
- **B — Correct.** Heat-shrink end-caps are preferred for permanently sealed buried closures in high-temperature environments because the cured adhesive in the heat-shrink liner is not subject to gel migration. The gel in gel-seal ports loses viscosity above +60°C and can migrate away from the cable port zone over years, compromising the seal. Since this location is a permanent backbone splice with no planned re-entry, heat-shrink's irreversibility is not a disadvantage. [AFL Closure Design Guide, §4.2; 3M Fibrlok II Guide, §1.2; BICSI OSP-DRD Manual, Ch. 8]
- **C — Incorrect.** Aeolian vibration is an aerial concern, not a buried direct-install concern. Buried cables and closures are not subject to aeolian vibration. And gel-seal vs. heat-shrink selection has nothing to do with vibration resistance. [BICSI OSP-DRD Manual, Ch. 8; AFL Closure Design Guide, §3.2]
- **D — Incorrect.** IP68 ratings are not differentiated by sealing method (gel vs. heat-shrink); both sealing types can achieve IP68 when correctly installed. The IP rating is a performance test result, not a property of the sealing material alone. [IEC 60529; BICSI OSP-DRD Manual, Ch. 8]

---

**Q5.** A project calls for a splice closure at a 72-fiber feeder-to-distribution junction point. The feeder cable has 72 fibers; six 12-fiber distribution cables connect at this location, plus one spare port is required. Each 12-fiber single-fiber tray holds 12 splices. How many splice trays are required for this closure?

- A) 6 trays
- B) 7 trays **[CORRECT]**
- C) 12 trays
- D) 3 trays

*Rationale:*
- **A — Incorrect.** Six trays × 12 splices/tray = 72 splices — correct total splice count. However, the question specifies 72 splices (one splice per fiber for all 72 feeder fibers split across six 12-fiber distribution cables). Six trays exactly fills the capacity with no reserve. Standard practice adds at least one spare tray position for future fiber adds or re-splices. Six trays meets but does not exceed the minimum — seven is the correct professional specification. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC-400 Manual, §2.1]
- **B — Correct.** 72 fibers total ÷ 12 splices per tray = 6 trays minimum. With one spare tray for future fiber adds or re-splice work: **7 trays total**. Specifying a closure with exactly the minimum tray count leaves no margin for additional splices if a future drop is added or a re-splice is required. BICSI OSP-DRD practice recommends at least one spare tray capacity at distribution splice locations. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC-400 Manual, §2.1]
- **C — Incorrect.** 12 trays × 12 splices/tray = 144 splice capacity — twice the required fiber count. While over-specifying is not catastrophically wrong, it selects a closure that is significantly oversized for the installation, increasing material and installation cost without purpose. [CommScope FOSC-400 Manual, §2.1]
- **D — Incorrect.** 3 trays × 12 splices/tray = 36 splices — exactly half the required 72 fiber count. Three trays is insufficient to accommodate all 72 fibers. [BICSI OSP-DRD Manual, Ch. 8]

---

## Final Check

Answer these three questions before advancing to Lesson 2.7 (Splice Trays and Buffer-Tube Management).

**Pulse 1.** State one deployment environment where a dome closure is preferred and one where an in-line closure is preferred. Explain the reason for each.

*Expected answer:* **Dome closure preferred:** buried conduit or vault applications where re-entry is anticipated — the dome's single-end cable entry allows all cables to be organized on one base plate, and the removable barrel provides access to the tray stack without disturbing the cable seals. **In-line closure preferred:** conduit pull-through in hand-holes with tight axial clearance — the in-line closure's dual-end entry maintains the cable in a straight-line axial path, avoiding the cable bend that a dome closure's base-plate geometry would require at a location where minimum cable bend radius is already at the limit. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC Manual, §1.3; Corning SCF/SCB Guide, §1]

**Pulse 2.** Compare gel-seal and heat-shrink cable port sealing methods on three attributes: re-entrability, installation time, and long-term thermal performance.

*Expected answer:* **Gel-seal:** Re-entrable (gel re-seals after re-entry, no heat tools needed); installation time is moderate (10–20 minutes for compression assembly); thermal performance concern at sustained >+60°C — gel migration can compromise the seal over years in hot buried environments. **Heat-shrink:** Not re-enterable without cutting and replacing; installation time is faster per port (5–10 minutes with heat gun); long-term thermal performance is superior because the cured adhesive liner is not subject to gel migration. Gel-seal is preferred for high-reentry locations; heat-shrink is preferred for permanent, inaccessible, or hot-environment buried installations. [Corning SCF/SCB Guide, §4–5; CommScope FOSC Manual, §4.2; AFL Closure Design Guide, §4]

**Pulse 3.** A 144-fiber ribbon closure is planned using ribbon splice trays that each hold 24 splices. The installation is a permanent buried backbone location with no planned re-entry. How many trays are needed, and which sealing method should be specified?

*Expected answer:* 144 splices ÷ 24 splices per ribbon tray = 6 trays minimum. Adding one spare tray = **7 trays total** recommended. Sealing method: **heat-shrink end-caps** — the installation is permanent backbone (low/no re-entry frequency) and buried (eliminating UV concerns). Heat-shrink is preferred for permanent buried closures because the cured adhesive avoids the gel migration risk present in gel-seal systems under sustained soil temperatures. [BICSI OSP-DRD Manual, Ch. 8; CommScope FOSC-400 Manual, §2.1; AFL Closure Design Guide, §4.2]

---

## Glossary Cross-References

Terms introduced in this lesson used across the Splice & Termination topic:

- **Dome closure** → Lesson 2.7 (Splice Trays — dome closure tray stacks are the primary context for splice tray management; tray organization and buffer tube routing are specific to the dome closure's internal geometry)
- **IP68** → Lesson 2.12 (Acceptance Testing — closure environmental rating verification is part of the post-installation inspection checklist)
- **Gel-seal / re-entrability** → Lesson 2.8 (Termination Methods — FDH and FDT connectorization points are typically co-located with gel-seal splice closures for re-entry)
- **Heat-shrink** → Lesson 2.5 (Mechanical Splicing — heat-shrink protection sleeves for fusion splices use the same shrink-on-heat principle as heat-shrink cable port seals; different application, same material physics)
- **Cable port / port count** → Lesson 2.7 (Splice Trays — port count and tray count sizing are related steps in the same closure selection process)
- **IEC 60068-2-14** → Lesson 2.12 (Acceptance Testing — thermal cycling testing of closures is referenced in project acceptance specifications)
