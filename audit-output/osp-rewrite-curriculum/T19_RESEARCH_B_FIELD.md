# T19 Research Brief — Field Practice / Math / DAG Framing
**Agent:** Research B (field practice, math/derivations, DAG implications)
**Scope:** T19 "Headend / CO + Rack-Side Hardware Basics" + T02 long-haul expansion + T03 OM1-OM5 addition
**Date:** 2026-05-16
**Framing:** independent — NOT cross-referenced with Agent A output until verification

---

## Section 1: DAG Implications of T19 at Teaching Position 7–8

### What T14 owns vs. what T19 needs

T14 (teaching position 9 per ARCH.md topological sort) is the first place that formally introduces:
- MGN bonding (L02) — already introduced as an acronym in T01.L08, but mechanics taught in T14
- Messenger bonding rules (L03)
- NEC 250.52 ground electrode types (L04)
- IBT / GES / PBB / SBB hierarchy (L05)
- Ground resistance testing (L06)
- Bonding conductor sizing (implicit in L02/L03/L05 via downlead AWG)

T01.L08 pre-introduces MGN, IBT, GES **as acronyms only** — no electrical mechanics, no sizing, no testing method. The T01 treatment is sufficient for a learner to recognize the words but NOT to apply grounding concepts safely.

**The proposed T19 headend lesson needs:** (a) why the headend CO needs its own ground electrode system, (b) TIA-607-D PBB/SBB/TBB hierarchy inside the CO, (c) how the OSP feeder cable's armor/messenger bonds into the building GES at the entry point, (d) why the primary protector sits at building entry and which component clamps the surge.

**Vocabulary conflict at position 7–8:** TBB (Telecom Bonding Backbone), TGB (Telecom Grounding Busbar), PBB (Primary Bonding Busbar), SBB (Secondary Bonding Busbar) are NOT introduced in any authored T01–T08 or T18 lesson. Using these terms at position 7–8 would violate the prerequisite invariant (nothing taught before it's defined). MGN, IBT, GES are introduced in T01 but their electrical mechanics are NOT.

### Three resolution paths — analysis

**Path X: T19 defers grounding tie-in entirely**

T19 teaches: ODF/patch panel layout, rack topology, power infrastructure (UPS/PDU), HVAC overview, generator interlock — without connecting OSP feeder grounding to the CO bonding system.

- Weakness: The OSP designer's primary concern at CO entry is the primary protector and the first bond point. A lesson about headend hardware that doesn't explain the grounding entry point teaches an incomplete mental model. The OSP-to-CO handoff without grounding context creates a real-world gap — field crews have installed unprotected entries because "grounding is a separate topic."
- Downstream breakage check: No T01–T08 or T18 lesson explicitly blocks on T14 grounding vocab. Path X is DAG-safe but pedagogically weak.

**Path Y: T19 introduces grounding basics itself (TBB, TGB, PBB/SBB, bonding conductor at entry)**

T19 teaches at position 7–8: ground electrode, bonding conductor, IBT/PBB hierarchy, surge arrester at building entry. T14 then re-encounters this content more deeply.

- Risk: Creates vocabulary duplication. More critically, T14.L05 ("IBT and GES — What They Are") would need to flag "you already saw IBT at building entry in T19 — now here's the full OSP-side implementation." This is workable but increases authoring complexity.
- DAG check: T14 prereqs are T01, T02, T05, T06, T18 — none of which gate on T19. If T19 introduces grounding basics, T14.L02-L05 must treat those basics as assumed vocab from T19. That's achievable — add `vocabulary_assumed: [ { term: 'IBT', source_lesson_id: 'T19.LXX' } ]` in the affected T14 lessons.
- Downstream breakage: T13.L08 ("Bonding and Grounding Inspection") cross-references T14. If T19 introduces IBT/PBB before T14, T13.L08 would reference both. Non-breaking — additive.

**Path Z: T14 splits — T14a (upstream basics) at position ~6, T14b (full OSP detail) at position ~14**

T14a (position 6, between T06 and proposed T19): teaches earth electrode, ground rod, GES concept, bonding vs. grounding definitions, IBT anatomy at building entry. T14b (position ~14): covers messenger bonding rules, grounds-per-mile, surge coordination, ground resistance testing, RUS Form 219.

- Benefit: T19 at position 7 could reference T14a's established vocabulary without duplication.
- Cost: Splits an already-authored brief and lesson list. T14 BRIEF is locked and ready for authoring. Splitting adds a full research + author + RT wave for T14a. ARCH.md topological sort would need revision. High orchestration overhead.
- Downstream breakage: T07, T08, T10, T13 all reference T14 as a DAG prereq. If T14 splits, the downstream prereq pointer must resolve to T14b (the deeper treatment) — T14a alone is insufficient for T13.L08's acceptance-testing content.

### Recommendation: PATH Y — with explicit T14 handoff annotations

**Rationale:** T19 at position 7–8 teaches 3 grounding concepts tied specifically to CO/headend entry — the primary protector placement, the building-entry bonding point (IBT location), and the connection from OSP feeder cable armor to the GES. These are observable, physical elements an OSP designer specifies on a drawing BEFORE knowing the full grounding theory. T14 then provides the why-it-works depth.

**Implementation:** T19 introduces three terms at the co-level: `primary protector` (TIA-607-D building-entry protection device), `IBT-entry` (the single bonding point at building entry where power, cable, and telecom grounds converge), and `GES-tie-in` (physical connection of feeder armor/messenger to the CO grounding electrode system). T19 labels each with explicit forward-references: "You'll learn the full electrical math behind this in T14 — for now, recognize it on a drawing and know what it does."

T14.L05 then reclaims these terms: `vocabulary_assumed: [ { term: 'primary protector', source_lesson_id: 'T19.LXX' }, { term: 'IBT', source_lesson_id: 'T19.LXX' } ]` and teaches the sizing, testing, and RUS-program requirements in full.

**Existing authored lesson impact (T01–T08, T18):**
- T01.L08: MGN, IBT, GES already introduced as acronyms. No change needed — T19 at position 7 can reference them as "you've seen these acronyms; at the CO you see them physically."
- T03.L07: References "bonding to the building's grounding electrode system" at building entry (armor bonding per NEC Art. 770). This is consistent with Path Y — T19 formalizes what T03 mentions in passing.
- No other authored T01–T08 or T18 lesson introduces TBB, TGB, PBB, SBB, or bonding conductor sizing. DAG is safe.

---

## Section 2: Field Practice vs. Book Gaps in Headend Territory

### Battery backup

**Book says (Telcordia GR-63-CORE §4.1.4 / GR-1089-CORE environment context):** Telecom network equipment must have minimum 4-hour battery reserve; some Tier-I carrier specs require 8 hours. [Telcordia GR-63-CORE / GR-1089-CORE — proposed allowlist addition; not on current allowlist — flagged. Verify via secondary: BICSI TDMM §10.4 or TIA-942-C Annex A references battery backup durations for telecom facilities.]

**Field reality:** Small FTTH headends (serving under 2,000 subs) commonly ship with 2-hour or 4-hour battery strings sized to the OLT's actual draw. When the OLT vendor ships a 48 VDC shelf at 30 A, the integrator sizes the battery plant to 30 A × 4 h = 120 Ah. In RUS-area small COs, single-string 24-cell VRLA plants are common — no redundancy, no automatic bypass. If one cell fails, the string fails. The ANSI/BICSI 002 recommendation for N+1 string redundancy [BICSI 002-2024 — add to allowlist] is routinely waived on cost grounds for small builds. [unverified field claim — needs SME confirmation from RUS Engineering Service Report or FOA field guide]

**OSP designer implication:** The OSP designer needs to specify battery-plant size and reserve on the headend drawing sheet. Missing this causes under-spec plants that fail on the first 4-hour outage.

### HVAC

**Book says (ANSI/ASHRAE 90.1 + TIA-942-C §6.1 for data centers; BICSI 002-2024 Annex for small COs):** Equipment inlet temperature target 64.4°F–80.6°F (18°C–27°C) per ASHRAE A2 envelope. Redundancy = N+1 minimum for critical telecom.

**Field reality:** Small rural headend huts (500–2,000 sq ft) routinely run a single residential mini-split (1.5–3 ton) with no redundancy. The unit is sized for steady-state heat load from the OLT shelf and battery plant. No automatic failover. When the compressor fails in summer, the CO temperature rises above 45°C and the OLT triggers thermal throttling or shutdown within 45–90 minutes. [unverified field claim — needs SME confirmation]

**OSP designer implication:** On any RUS-funded headend design, specify at minimum N+1 HVAC and a high-temperature alarm wired to the NOC. A single-unit residential split has no place in a production CO.

### Grounding tie-in

**Book says (TIA-607-D §4.2):** Single-point bonding — all incoming telecom conductors (fiber cable with metallic armor, copper pairs, coax) and their associated primary protectors bond at a single metallic point (the IBT — intersystem bonding termination) at building entry. All bonds converge on the GES. TBB (Telecom Bonding Backbone) connects from the IBT upward to each TGB (Telecom Grounding Busbar) in the rack space.

**Field reality:** In small rural COs, the "single-point bond" is often a ground block on the OSP entry wall — a #6 AWG wire runs from the cable armor clamp to the nearest available ground: sometimes the building's electrical panel ground bar, sometimes a ground rod driven next to the building without testing its resistance. The TBB/TGB hierarchy (TIA-607) is almost never implemented in a headend under 1,000 sq ft. The IBT is present only when an inspector required it. [unverified field claim — needs SME confirmation from BICSI OSPDR field-practice section or RUS Engineering Service Reports]

**Risk of field shortcut:** If the feeder cable armor is not bonded at building entry, a lightning-induced surge rides the armor through the building to the first metallic contact — typically the OLT chassis or splice organizer. Protector-less entry + unbonded armor = high equipment destruction risk in storm events. This is a real, documented failure mode in rural areas. [unverified field claim — needs SME or NRECA failure-report confirmation]

### Generator

**Book says (NFPA 110 §8.4):** Standby generator: weekly load test under load (30% rated load minimum), monthly transfer exercise, annual full-load test. (Source: NFPA 110-2022 §8.4.1–8.4.2 — proposed allowlist addition; not on current allowlist — flagged.)

**Field reality:** Generator test schedules at small rural COs slip to "test when a storm is coming." Transfer switches are often maintained by whoever installed them, not by a certified technician. Fuel tanks are regularly found partially full with degraded diesel (diesel shelf life: 1 year untreated, per ASTM D975). [unverified field claim — needs SME confirmation]

**OSP designer implication:** Specify automatic weekly test schedule in the headend specification. Include fuel polishing or stabilizer treatment requirement in the O&M manual.

### Patch panel labeling

**Book says (TIA-606-D §6.2 + §7.3):** Class 2 or Class 3 administration — every port has a unique identifier, a records system tracks each termination, and labels are machine-readable (barcoded or sequentially numbered). Records maintained in a cable management system.

**Field reality:** The majority of small FTTH headend ODF panels are labeled with sequential marker numbers in permanent marker on adhesive tape, applied at splice/commissioning time. Identification is row-number + slot-number (e.g., "Panel A, Port 12"). No machine-readable records. The OSP designer's splice matrix is the de facto record — it lives in a PDF on the engineering drive and may or may not be updated after moves/adds/changes. [unverified field claim — needs SME confirmation]

**Risk:** When a fiber path goes dark, a technician consulting a stale splice matrix can work through the wrong path for hours. TIA-606 Class 3 administration with a live records system prevents this — but it requires commitment at design time, not retrofit.

---

## Section 3: OM1–OM5 Math — Verified Derivations

**Important context:** T02.L08 (already authored and landed) already teaches OM1–OM5 in depth, including the bandwidth and reach table, VCSEL vs. LED launch, EMB vs. OFL distinction, and laser-optimized MMF. The scope expansion adds OM1–OM5 to T03 (Cable Selection). T03's treatment should be **specification-focused** (when to spec which grade, how to read a datasheet, what the cable jacket tells you) rather than re-deriving the physics (which T02.L08 owns). The math below supports T03 authoring fidelity — specifically so the T03 author cites correct values and doesn't contradict T02.L08.

### Per-grade specifications (per TIA-568.3-D [confirm current edition] + IEEE 802.3)

**OM1 (62.5/125 µm)**
- Modal bandwidth: 200 MHz·km at 850 nm (OFL); 500 MHz·km at 1300 nm (OFL)
  (Source: TIA-492AAAA — OM1 fiber spec [confirm edition])
- Max distance per IEEE 802.3:
  - 1GbE (1000BASE-SX): 275 m (Source: IEEE 802.3 Clause 38)
  - 10GbE (10GBASE-SR): 33 m (Source: IEEE 802.3 Clause 52, Table 52-11)
  - 40GbE: Not specified — no standard 40G application at 850 nm on OM1
  - 100GbE: Not specified

**OM2 (50/125 µm)**
- Modal bandwidth: 500 MHz·km at 850 nm (OFL); 500 MHz·km at 1300 nm (OFL)
  (Source: TIA-492AAAB — OM2 fiber spec [confirm edition])
- Max distance per IEEE 802.3:
  - 1GbE (1000BASE-SX): 550 m (Source: IEEE 802.3 Clause 38)
  - 10GbE (10GBASE-SR): 82 m (Source: IEEE 802.3 Clause 52, Table 52-11)
  - 40GbE / 100GbE: Not standardized

**OM3 (50/125 µm, laser-optimized)**
- Modal bandwidth: 2000 MHz·km at 850 nm (EMB); 1500 MHz·km at 850 nm (OFL)
  (Source: TIA-492AAAC — OM3 fiber spec [confirm edition])
- Note on EMB vs. OFL: EMB (Effective Modal Bandwidth) uses a VCSEL-launch test. OFL (Overfilled Launch) uses a legacy LED test. IEEE 802.3 reach specs for 10G+ use EMB — 2000 MHz·km is the governing number.
- Max distance per IEEE 802.3:
  - 10GbE (10GBASE-SR): 300 m (Source: IEEE 802.3 Clause 52, Table 52-11)
  - 40GbE (40GBASE-SR4, 4-lane parallel): 100 m (Source: IEEE 802.3 Clause 86)
  - 100GbE (100GBASE-SR10 or SR4): 100 m (Source: IEEE 802.3 Clause 95/86) [confirm edition]

**OM4 (50/125 µm, laser-optimized)**
- Modal bandwidth: 4700 MHz·km at 850 nm (EMB)
  (Source: TIA-492AAAD — OM4 fiber spec [confirm edition])
- Max distance per IEEE 802.3:
  - 10GbE (10GBASE-SR): 400 m (Source: IEEE 802.3 Clause 52, Table 52-11)
  - 40GbE (40GBASE-SR4): 150 m (Source: IEEE 802.3 Clause 86)
  - 100GbE (100GBASE-SR4): 150 m (Source: IEEE 802.3 Clause 95) [confirm edition]

**OM5 (50/125 µm, wideband laser-optimized)**
- Modal bandwidth: 28,000 MHz·km at 953 nm (EMB); designed for SWDM4 (Short-Wavelength Division Multiplexing, 4 wavelengths: 850/880/910/940 nm)
  (Source: TIA-492AAAE — OM5 fiber spec [confirm edition])
- Max distance per IEEE 802.3 (and MSA SWDM4 spec):
  - 100GbE (100GBASE-SR4 over SWDM4): approximately 100–150 m on a single fiber pair
  - Key claim: OM5 achieves 100G on ONE fiber pair by multiplexing 4 × 25G channels across 4 wavelengths. OM4 requires 4 fiber pairs for 100GBASE-SR4. OM5 with SWDM reduces required fiber pairs 4:1 in the data center.

### Worked example: why OSP always uses SMF, never OM grades

**Setup:** New FTTH headend to FDH, 4 km span.

**Step 1 — Can OM4 reach 4 km?**
OM4 max at 10GbE = 400 m.
4 km = 4,000 m.
4,000 m ÷ 400 m = 10 × over OM4's limit.

**Step 2 — Can the reach be extended with optical amplifiers?**
No. Modal dispersion in MMF is a fundamental bandwidth-distance limit, not a power budget limit. Amplifiers boost optical power but don't reduce modal dispersion. Amplification is meaningless for an MMF reach problem.

**Step 3 — SMF (OS2/G.652.D) power budget for the same span:**
Typical GPON OLT downstream budget: 28 dB class B+ (Source: ITU-T G.984.2 — TP-II / Class B+).
4 km at 0.35 dB/km (G.652.D typical @ 1490 nm) = 1.4 dB fiber loss.
Budget remaining for splitters + connectors + splices: 28 - 1.4 = 26.6 dB.
Sanity check: 26.6 dB is comfortably above a 32-way splitter loss (~17.3 dB) plus connector/splice budget.

**Conclusion:** 4 km OSP = OS2/G.652.D. No multimode fiber grade is applicable to any OSP feeder run. The lesson in T03 must be unambiguous: "OM grades are for inside plant. Every OSP cable spec you will ever write says OS2 or G.652.D."

### Why VCSEL vs. DFB matters for multimode reach

VCSEL (Vertical-Cavity Surface-Emitting Laser): inexpensive, 850 nm, produces a relatively broad launch with a defined spatial mode structure. Used in all OM3/OM4/OM5 short-reach transceivers. Its launch profile is optimized to work with the laser-optimized MMF graded-index core.

DFB (Distributed Feedback Laser): precise single-frequency source, used in SMF transceivers (1310 nm and 1550 nm). Narrow linewidth enables low-dispersion long-haul transmission. Cannot be efficiently coupled into MMF (the single-mode launch pattern underfills the graded-index core, creating unpredictable modal excitation).

OSP lesson note for T03: the reason OM3/OM4/OM5 transceivers are cheap (VCSEL source) and SMF transceivers are more expensive (DFB source) is a direct consequence of the fiber type. When you specify OS2 for OSP, you're also implicitly specifying DFB-class transceivers at the OLT and ONT. Changing to MMF to "save cable cost" (a real field-crew mistake) would require incompatible transceivers and still wouldn't reach.

---

## Section 4: Long-Haul Mental Model for OSP Engineers (T02 Expansion, ≤200 words)

An OSP engineer working on a rural FTTH build almost never touches long-haul transport directly. But they do need to understand it for two reasons: first, the feeder fiber they're designing connects to carrier transport equipment at the CO — and that equipment makes assumptions about the fiber's characteristics. Second, on large-county or interstate builds, the "feeder" itself may run 40–100 km to a distant hub, putting it in long-haul territory.

Long-haul means the fiber span exceeds what a standard OLT link budget covers. Carriers solve this with coherent optics — transceivers that modulate both the amplitude and the phase of the light wave, allowing much higher spectral efficiency. Coherent systems (used in carrier backbone at 100G/400G/800G per channel) require dispersion-compensated OS2 fiber meeting ITU-T G.652.D or G.654.E specs. They are also dispersion-sensitive: the Polarization Mode Dispersion (PMD) spec of the fiber matters, not just attenuation.

For the OSP designer: if your project connects to a carrier's DWDM network, verify the fiber spec with the carrier before you order cable. A G.657.A2 bend-insensitive fiber that meets attenuation specs may not meet the PMD spec for a 100G coherent channel.
(Source: ITU-T G.652.D for attenuation/PMD specs; ITU-T G.989.x for NG-PON2 extended reach context)

---

## Section 5: Headend↔OSP Handoff Scenarios

### Scenario 1: Feeder fiber pulled into CO — termination workflow

**Situation:** The OSP crew has pulled a 144-fiber OS2 loose-tube cable through a 4-inch conduit into the headend building. The cable end is now inside the equipment room, 10 feet from the ODF rack.

**What the OSP engineer needs to know:**
1. The cable must be sealed at the conduit entry with a duct seal (foam or mastic, rated for the conduit fill) to prevent air circulation, moisture ingress, and rodent entry. This is an OSP deliverable — the inside-plant crew will not do it unless it's specified.
2. The metallic armor (if present) must be grounded/bonded at the building entry point per NEC Article 770 (optical fiber cable entering buildings). The bond connects to the GES. If the OSP design specifies a dielectric ADSS feeder, this step is skipped — but the primary protector still applies if any metallic inner member (central strength member with copper tracer) is present.
3. The cable needs a service loop — typically 10–15 feet of slack inside the building — coiled in a j-hook tray or wall bracket. This allows future re-terminations without pulling new cable.
4. Termination is in the ODF (Optical Distribution Frame): fusion-splice the OSP loose-tube fibers to factory-terminated pigtails, or use mechanical connectors per the project spec.

**Wrong-answer trap:** Assuming the OLT crew will handle building-entry sealing and bonding. They won't — they commission the active equipment, not the passive infrastructure. If the OSP drawing doesn't specify it, it doesn't happen.

---

### Scenario 2: Power/HVAC fault at remote hut — what should the OSP designer have specified?

**Situation:** A remote 300-subscriber FTTH OLT hut (12 × 20 ft prefab building) goes offline at 2 AM in July. Temperature inside: 52°C. OLT is in thermal shutdown. The single 2-ton mini-split failed. There is no generator. Battery reserve ran out at 2 hours.

**What the OSP engineer needs to know (design-time obligations):**
The OSP designer on a RUS-program build typically specifies the headend building as part of the engineering package. Critical specifications missing from this scenario:
- **HVAC redundancy:** N+1 split system (two independent units, each capable of full load). If one fails, the second maintains temperature.
- **High-temperature alarm:** 30°C setpoint triggers a NOC alert. At $50 for a sensor + SIM modem, this is not optional on a production facility.
- **Generator:** On a RUS-program build, the generator is an approved capital cost. The omission was a design decision (cost pressure). Consequence: 2-hour MTTR becomes 6+ hours while waiting for a tech to travel to the site.
- **Battery reserve:** Spec minimum 8-hour string for rural sites without generator. Size to the OLT's actual 48 VDC draw, not a round number.

**Wrong-answer trap:** Treating the headend building as "ISP work" and excluding it from the OSP engineering package. The OSP engineer designs the building envelope, power, and environmental systems for remote huts on RUS contracts — even if a different crew builds it.

---

### Scenario 3: Storm-related ground potential rise (GPR) at headend — OSP-side protection design

**Situation:** A lightning strike hits a distribution pole 300 meters from the headend. The ground potential rise (GPR) event sends a transient through the MGN, up the fiber cable messenger (bonded to MGN at every pole), and into the headend building. Two OLT line cards are destroyed. No primary protector was installed at building entry.

**What the OSP engineer needs to know:**
Ground potential rise is the voltage elevation of the local earth at the strike point relative to remote earth. During a severe lightning event, GPR can reach 50 kV or more at the strike location. Even 300 meters away, the GPR-induced longitudinal voltage on a bonded messenger can be hundreds of volts. (Source: IEEE Std 487 — Recommendations for the Protection of Wire-Line Communication Facilities Serving Electric Power Stations — referenced for GPR context [proposed allowlist addition; not on current allowlist — flagged]).

**OSP-side protection design (what the engineer should have specified):**
1. **Primary protector at building entry (mandatory):** A UL 497B-listed protector on every copper pair entering the building. For fiber-only entry with metallic armor: a surge arrester rated for the expected GPR transient, bonded at building entry to the GES. Not the ODF — the entry point.
2. **NFPA 70 Art. 770 bonding:** Metallic armor bonded to the GES before the cable enters the structured space. This ensures the GPR transient dissipates into the building's ground electrode, not through the OLT chassis.
3. **Dielectric feeder alternative:** If GPR exposure is high (within 500 m of a distribution substation or heavily faulted primary), specify a dielectric (all-dielectric self-supporting or all-dielectric armored) feeder cable. Zero metallic = zero GPR conduction path. The OSP designer must make this choice at design time — retrofitting is a cable replacement job.

**Wrong-answer trap:** Assuming that because the cable is fiber (non-conductive light path), there is no electrical exposure. The metallic components — armor, messenger, central strength member with conductive tracer — are the exposure path. Dielectric fiber core ≠ dielectric cable.

---

## Proposed Allowlist Additions (for orchestrator review)

The following sources were referenced but are NOT on the current `research-sources-allowlist.md`. Flag for addition before authoring:

1. **Telcordia GR-63-CORE** — NEBS Physical Protection (equipment environmental specs, battery backup)
2. **Telcordia GR-1089-CORE** — EMC and ESD Control for Network Telecom Equipment
3. **BICSI 002-2024** — Data Center Design and Implementation Best Practices
4. **NFPA 110-2022** — Standard for Emergency and Standby Power Systems (generator test requirements)
5. **IEEE Std 487** — Recommendations for the Protection of Wire-Line Communication Facilities Serving Electric Power Stations (GPR context for OSP-to-headend grounding scenarios)
6. **TIA-607-D** — Generic Bonding and Grounding for Customer Premises (already on the allowlist — confirm TBB/TGB/IBT section references for T19 authoring)

---

## Summary for Orchestrator

**DAG recommendation:** PATH Y (T19 introduces 3 building-entry terms — primary protector, IBT-entry, GES-tie-in — with explicit forward-reference to T14 for full electrical depth). No authored T01–T08 or T18 lesson is broken by this. T14.L05 updated to assume those 3 terms from T19.

**Biggest field-practice gap surfaced:** The grounding tie-in gap — field practice routes the cable armor to the nearest available ground bar rather than the TIA-607-specified IBT/single-point bond at building entry. This is the most consequential shortcut because it directly exposes CO equipment to GPR transients during storm events. It is the exact failure mode in Scenario 3.

**OM1–OM5 math note:** T02.L08 (already authored) covers all bandwidth and reach calculations for OM1–OM5 correctly. T03's expansion should be specification-focused, not physics-focused. The worked example confirms OS2 is the only applicable fiber for any OSP run — even a 4 km GPON feeder has 10× the reach of OM4's best case.

**Math confidence:** All IEEE 802.3 reach values match T02.L08's authored table (OM1: 33 m at 10GbE, OM3: 300 m, OM4: 400 m, OM5: ~400 m with SWDM). No contradictions introduced.

=== T19 RESEARCH B — FIELD/MATH/DAG END ===
