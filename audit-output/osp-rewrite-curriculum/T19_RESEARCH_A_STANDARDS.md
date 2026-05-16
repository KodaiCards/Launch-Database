# T19 Research Agent A — Standards / Citations Framing
# Scope: (A) T19 "Headend / CO + Rack-Side Hardware Basics", (B) T02 long-haul awareness addition, (C) T03 OM1–OM5 addition

**Date:** 2026-05-16  
**Role:** READ-ONLY research. No lesson files, ARCH.md, CLAUDE.md, course-catalog.js, schema.sql, or server.js modified.  
**Method:** Existing authored lessons surveyed, allowlist cross-checked, standards scoped per Carter's scope-expansion directive.

---

## Pre-Research Finding: OM1–OM5 Coverage Already Exists in T02.L08

Before scoping the OM1–OM5 addition for T03, note that `T02.L08` (Single-Mode vs. Multimode — Choosing) already introduces OM1–OM5 in full with:
- A complete OM1/OM2/OM3/OM4/OM5 table (core diameter, bandwidth, max reach at 10GbE, jacket color)
- `vocabulary_introduced` array listing OM1–OM5 explicitly
- Flashcard deck covering OS2, OM3, OM4, OM5, laser-optimized MMF
- Citations: TIA-492AAAD (OM4), TIA-492AAAE (OM5) `[confirm current editions]`; IEEE 802.3 for reach values

**Implication for addition (C):** The ARCH.md prerequisite DAG places T03 (Cable Selection) AFTER T02 (Fiber Physics). T03 authors can assume OM1–OM5 vocab from T02.L08. The T03 addition should NOT re-introduce OM1–OM5 definitions — it should ADD cable-product context: which OM grade ships in which OSP-relevant form factor, where multimode cable is actually procured for inside-plant-to-OSP transition zones, and the cable standards that govern OM-grade cable (IEC 60793-2-10, TIA-492 series). See Section 4 below for the exhaustive TIA-492 citation map.

---

## Section 1: Authoritative Standards by Scope Area

### A. T19 — Headend / CO + Rack-Side Hardware Basics

#### TIA-607-D — Generic Telecommunications Bonding and Grounding for Customer Premises
**Allowlist entry:** TIA-607-D  
**Relevant clauses:**
- **§4 (Definitions)** — defines TBB (Telecommunications Bonding Backbone), TGB (Telecommunications Grounding Busbar), TMGB (Telecommunications Main Grounding Busbar), PBB (Primary Bonding Busbar), SBB (Secondary Bonding Busbar), bonding conductor for telecommunications (BCT). These are the vocabulary T19 must introduce for the headend-side bonding surface.
- **§7 (Grounding electrode system)** — defines the GES tie-in between the building's power-ground electrode and the TMGB at the point of entry. This is the **OSP/ISP grounding boundary**: OSP's MGN bonded messenger terminates at the building entry primary protector → primary protector bonds to IBT → IBT bonds to TMGB or GES → TIA-607 takes over inside the building.
- **§8 (Telecommunications bonding backbone)** — TBB conductor sizing (minimum #6 AWG Cu per TIA-607-D Table 8-1, scaling with backbone length), and the requirement to bond every TGB back to the TMGB. Relevant for FDH → CO backbone layout.
- **§9 (Telecommunications main grounding busbar, TMGB)** — placement at the main telecom equipment room (MER); minimum size; bonding to the building's grounding electrode system.
- **§10 (Telecommunications grounding busbar, TGB)** — placement in each telecommunications room (TR); connects to TMGB via TBB.

**OSP-engineer depth ceiling:** OSP engineer needs to know WHERE the OSP grounding system terminates (at the building entry TMGB/IBT), what connects to what at that point, and the vocabulary (TMGB, TGB, TBB) so they can converse with the ISP inside-plant team. They do NOT need to design the full TIA-607 bonding system interior to the building — that is the ISP/RCDD scope. Depth ceiling: identify the handoff point and know the 3 main TIA-607 components by name and function.

**Citation gap:** TIA-607-D is paywalled. The allowlist includes it. Secondary path: T14.L05 (IBT and GES) already introduces IBT/PBB/SBB at the OSP boundary level using public NEC Art. 250 and secondary BICSI references. T19 can extend from T14's IBT framing into TIA-607's TMGB/TGB/TBB without requiring direct access to the full TIA-607-D text. Mark `[confirm edition — TIA-607-D is current as of research date, TIA releases updates on ~5-year cycle]`.

#### TIA-568.3-D — Optical Fiber Cabling Components Standard
**Allowlist entry:** TIA-568.3-D  
**Relevant clauses:**
- **§5 (Connecting hardware)** — patch panel specifications, LC/SC/MPO connector performance requirements. Relevant for T19 patch panel and LIU content.
- **§6 (Cabling topologies)** — interconnect vs. cross-connect distinction (this is one of Carter's explicit T19 scope items). Interconnect = direct connection between active equipment; cross-connect = connection via patch cords through a passive cross-connect field.
- **Annex D (optical performance for structured cabling systems)** — loss budgets for horizontal and backbone structured cabling. OSP engineer needs the cross-connect concept, not the full annex detail.

**OSP-engineer depth ceiling:** Understand interconnect vs. cross-connect as architectural choices at the FDH/CO patch face. Know what a patch panel (LIU) is, how it differs from a cross-connect frame, and why you care about connection density at the handoff point. Do NOT require TIA-568 structured-cabling full design — that is RCDD scope (C01).

#### TIA-942-C — Telecommunications Infrastructure Standard for Data Centers
**Allowlist entry:** TIA-942-C (listed for C02 cert prep, but relevant to T19 at awareness level)  
**Relevant clauses:**
- **§5 (Architecture)** — defines four telecom spaces: MEET (Main Equipment Entry for Telecommunications), MER (Main Equipment Room), TR (Telecommunications Room), EDA (Equipment Distribution Area). For T19: CO/hut layout maps to MER-equivalent; understanding these spaces helps OSP engineers navigate a headend facility.
- **§6 (Infrastructure and cabling)** — backbone cabling between MER and TR, horizontal from TR to EDA. Not OSP scope, but vocabulary overlap with what OSP engineers encounter at the patch point.
- **Rated 1–4 / Uptime Tier I–IV** — awareness level only for T19. The CO redundancy level (generator, UPS, dual feeds) that OSP engineers need to be aware of for handoff quality.

**OSP-engineer depth ceiling:** Awareness only. Know that CO/headend is structured as MER → TR → equipment spaces. Know that rated/tiered redundancy affects uptime and therefore feeder diversity design decisions. Do NOT teach TIA-942 rated design requirements — that is C02/C03 cert scope.

#### ANSI/ATIS-0600336 — Network Equipment-Building System (NEBS) Generic Physical Design Requirements
**Allowlist entry:** ANSI/ATIS-0600336  
**Relevant clauses:**
- **GR-1089-CORE (EMC)** and **GR-63-CORE (Physical protection)** are the two Telcordia/ATIS documents that together constitute NEBS. NEBS specifies rack-mounting, power, EMI, and environmental requirements for CO-grade equipment.
- **–48VDC power plant requirements** — NEBS equipment is designed for –48VDC nominal (–48 V negative ground, return at 0 V "battery return" rail). T19 must explain WHY –48VDC: (a) historical telecom standard for DC power in COs, (b) negative-ground convention means chassis is at –48 V relative to ground-referenced battery return, (c) reduces electrolytic corrosion on copper conductors.
- **Rack dimensions** — EIA/IEC 60297 19-inch rack standard (ANSI/EIA-310-D `[confirm edition]`); NEBS rack requirements align with this.

**OSP-engineer depth ceiling:** Know that NEBS-rated equipment = CO-grade; know the –48VDC power convention and WHY (historical telecom, corrosion avoidance, battery backup integration); know that OLTs and CMTS are NEBS-rated black boxes. Do NOT teach NEBS equipment design — that is ISP/CO-engineer scope.

**Citation note:** GR-63-CORE and GR-1089-CORE are Telcordia/ATIS publications, paywalled. For T19 authoring, cite as "GR-63-CORE (NEBS physical protection requirements) `[paywalled — confirm with ISP engineer at handoff]`" and use ANSI/ATIS-0600336 as the allowlist anchor.

#### NFPA 75 / NFPA 76 — Fire Protection of IT Equipment / Telecommunications Facilities
**NOT on the current allowlist.** Relevant to T19 CO/hut fire suppression awareness content.  
**Proposed addition to allowlist:** NFPA 75 (Standard for the Fire Protection of Information Technology Equipment) and NFPA 76 (Standard for the Fire Protection of Telecommunications Facilities). Both are NFPA-published, widely cited, and publicly indexed.  
**Why needed:** T19 scope includes "HVAC/fire suppression awareness." Without NFPA 75/76, there is no authoritative source for CO fire suppression system types (clean-agent, pre-action sprinkler, FM-200 vs. Novec 1230 awareness). The allowlist currently has NFPA 70 (NEC) and NFPA 70E — adding NFPA 75/76 is a logical extension for CO-facility content.  
**Mark as:** `[proposed allowlist addition — NFPA 75 and NFPA 76]`

#### IEEE 1100 (Emerald Book) — Powering and Grounding Sensitive Electronic Equipment
**Allowlist entry:** IEEE 1100 (listed under IEEE section)  
**Relevant clauses:**
- **Chapter 4 (System grounding)** — single-point vs. multipoint grounding; why sensitive telecom equipment (OLTs, routers) uses single-point grounding referenced to the TMGB/building GES.
- **Chapter 5 (Bonding)** — bonding conductor routing, prohibition on creating ground loops.
- **Chapter 8 (Power quality and conditioning)** — UPS topology awareness; why CO equipment uses battery plant instead of UPS-on-AC.

**OSP-engineer depth ceiling:** Understand that CO equipment is single-point grounded to the building GES and why (avoids ground loops that cause equipment damage and data errors). This ties the OSP grounding boundary (MGN → IBT → TMGB) to the equipment protection rationale. Do NOT require IEEE 1100 full design detail.

#### RUS Bulletin 1751F-810 — Electrical Protection of Communication Facilities
**Allowlist entry:** RUS 1751F-810  
**Relevant clauses (for T19 headend-to-OSP grounding context):**
- **§3 (Grounding practices for communications facilities)** — bonding at building entry, primary protector placement, bonding of cable sheath and messenger at building entry point. This is the RUS-specific version of the OSP/ISP boundary grounding.
- **§4 (Surge protection)** — primary protectors on aerial cable entering a CO or hut. Critical for T19: every aerial fiber route entering a headend needs a primary protector (surge arrester) at the aerial-to-underground transition AND at the building entry.

**OSP-engineer depth ceiling:** Know that RUS 1751F-810 governs bonding and surge protection for RUS-funded communication facilities — applies to the OSP side of the headend entry. The ISP/CO-engineer applies TIA-607 interior to the building; the OSP engineer applies 1751F-810 at the OSP entry interface.

---

### B. T02 Addition — Long-Haul Awareness (Coherent Optics, Mux/Demux, DWDM)

#### ITU-T G.694.1 — Spectral Grids for WDM Applications: DWDM Frequency Grid
**NOT on current allowlist.** Primary reference for DWDM channel spacing.  
**Proposed allowlist addition:** ITU-T G.694.1 (current: 2020 edition with 12.5 GHz and flexible grid extensions).  
**Key content:** Defines the standard DWDM channel center frequencies anchored at 193.1 THz (1552.52 nm), with 100 GHz (0.8 nm) and 50 GHz (0.4 nm) nominal channel spacing. C-band approximately 1530–1565 nm; L-band 1565–1625 nm.  
**Depth ceiling for T02 addition:** OSP engineer learns that DWDM systems put many "channels" (data streams) on one fiber pair using ultra-precise wavelengths. The ITU grid is the "rulebook" for what wavelengths are allowed. For feeder design, this means a single fiber pair can carry many ISP tenants' data streams — understanding this changes how OSP engineers think about fiber-count decisions on feeder routes.

#### ITU-T G.671 — Transmission Characteristics of Optical Components and Subsystems
**NOT on current allowlist.** Relevant for mux/demux and transponder context.  
**Proposed allowlist addition:** ITU-T G.671.  
**Key content:** Defines insertion loss, isolation, passband, and polarization-dependent loss specs for WDM multiplexers, demultiplexers, OADMs (optical add-drop multiplexers), and optical amplifiers. T02 addition needs this for the "mux/demux" vocabulary — what a mux does (combines channels) and what performance parameters matter (insertion loss per channel; isolation between channels).  
**Depth ceiling:** OSP engineer learns what a DWDM mux and demux are (black boxes that combine/separate wavelengths at each end of a long-haul span) and that insertion loss from these devices is part of the feeder link budget. They do NOT need to design DWDM systems.

#### ITU-T G.652.D — Standard SMF
**On allowlist.** The G.652.D fiber is the substrate for long-haul coherent systems. T02's existing content already covers G.652.D attenuation and dispersion. The long-haul addition should note:
- **Chromatic dispersion at 1550 nm ≈ 17 ps/(nm·km)** (already in T02.L03) — this becomes a design-limiting parameter at 100G+ bit rates without dispersion compensation.
- **PMD coefficient ≤ 0.2 ps/√km** (already in T02.L03) — limits reach on polarization-sensitive coherent systems.

#### Coherent Optics Standards
**ITU-T G.698.x series** (G.698.1 — amplified multichannel WDM applications with single-channel OTMs; G.698.2 — amplified multichannel DWDM applications with OTUs):  
**NOT on current allowlist.** These define the optical interface specs for 10G/40G/100G coherent DWDM systems.  
**Proposed allowlist addition:** ITU-T G.698.1 and G.698.2 `[confirm current editions]`.  
**Depth ceiling:** T02 addition needs only conceptual coherent optics: coherent transceivers (vs. direct-detect) use a local oscillator laser to decode phase and polarization information, enabling 100G+ per channel over thousands of kilometers. OSP engineers don't design these — they design the FIBER that carries them.  
**OIF (Optical Internetworking Forum) coherent specifications:** OIF-100G-DWDM-MR-02.0 (100G coherent DWDM multi-rate specification) — industry consortium spec that aligns with ITU-T G.698.2. Not on allowlist; mark as `[OIF spec — verify if needed for author depth, or defer to ITU-T G.698.2 alone]`.

**Citation gap warning:** Coherent optics standards (G.698.x, OIF specs) are highly paywalled and technically dense. For T02 addition at the OSP-awareness level, the citation risk is LOW — the claim is "coherent systems exist and use phase modulation to achieve 100G+ per wavelength on standard G.652.D fiber." This claim is verifiable from public sources (Cisco, Corning, FOA Reference Guide). The author does NOT need section-level cite from G.698.x for an awareness-level lesson. Recommend: cite as "ITU-T G.698.2 `[paywalled — confirm edition]`" with FOA Reference Guide as the public secondary source for the conceptual framing.

---

### C. T03 Addition — OM1–OM5 Multimode Cable Products

#### IEC 60793-2-10 — Optical Fibres — Product Specifications — Multimode Fibres
**NOT on current allowlist.**  
**Proposed allowlist addition:** IEC 60793-2-10 `[confirm current edition]`.  
**Relevance:** The IEC classification scheme for multimode fiber grades (OM1 through OM5 are IEC designations; TIA adopted them and calls them the same). IEC 60793-2-10 defines the fiber itself (core/cladding geometry, bandwidth, attenuation). TIA-492 series translates this into cable product specifications.

#### TIA-492 Series — Multimode Fiber Product Specifications

| Spec | Grade | Core | OFL BW @ 850 nm | EMB @ 850 nm | Status |
|---|---|---|---|---|---|
| TIA-492AAAA | OM1 | 62.5 µm | 200 MHz·km | N/A (LED era) | Allowlist has TIA-492AAAA as listed; `[confirm edition]` |
| TIA-492AAAB | OM2 | 50 µm | 500 MHz·km | N/A | NOT on allowlist — **proposed addition** |
| TIA-492AAAC | OM3 | 50 µm | 1500 MHz·km | 2000 MHz·km | **On allowlist** (TIA-492AAAC) |
| TIA-492AAAD | OM4 | 50 µm | 3500 MHz·km | 4700 MHz·km | NOT on allowlist — **proposed addition** (T02.L08 already cites it) |
| TIA-492AAAE | OM5 | 50 µm | 3500 MHz·km @ 850 nm | 28000 MHz·km @ 953 nm | NOT on allowlist — **proposed addition** |

**Depth ceiling for each grade:**

- **OM1 (TIA-492AAAA):** 62.5 µm core, 200 MHz·km OFL bandwidth, max 33 m at 10GbE per IEEE 802.3. **Legacy.** OSP engineer needs to know: do not specify for any new 10G+ installation. May encounter in older campus buildings. Patch cord jacket: orange.

- **OM2 (TIA-492AAAB):** 50 µm core, 500 MHz·km, max 82 m at 10GbE. **Legacy.** Same "do not specify for new work" guidance. Orange jacket (same as OM1 — field hazard). `[confirm edition — TIA-492AAAB, paywalled]`

- **OM3 (TIA-492AAAC):** 50 µm laser-optimized core, EMB = 2000 MHz·km, max 300 m at 10GbE. **Current minimum for new 10G installations.** Aqua jacket. T02.L08 already introduces this; T03 adds the cable-product angle: which jacket/armor combinations are available in OM3, and where OSP engineers encounter OM3 (inside-plant cabling from FDH patch to the ISP equipment rack — typically < 300 m inside the CO building).

- **OM4 (TIA-492AAAD):** 50 µm laser-optimized, EMB = 4700 MHz·km, max 400 m at 10GbE. **Current standard for data center / CO backbone.** Aqua jacket (occasionally magenta in some regions — cite TIA-568.3-D jacket color convention). T02.L08 covers this; T03 adds where OM4 appears in OSP-adjacent spaces.

- **OM5 (TIA-492AAAE):** 50 µm laser-optimized, 28000 MHz·km @ 953 nm (SWDM4 design), lime green jacket. **Current for next-gen data center 100G/400G over MMF.** OSP engineers rarely specify this — it is a CO-internal cable product — but may see it on a T19-type handoff.

#### IEEE 802.3 — Ethernet
**On allowlist.** The reach values (33 m / 82 m / 300 m / 400 m) for OM1–OM5 at 1GbE/10GbE/40GbE/100GbE come from IEEE 802.3 clause annexes (e.g., 802.3ae for 10GbE, 802.3bm for 40GbE/100GbE MMF). Cite as "IEEE 802.3 `[confirm applicable clause — varies by data rate]`".

#### TIA-568.3-D — Jacket Color Convention
**On allowlist.** Table in TIA-568.3-D defines:
- OM1/OM2: orange
- OM3/OM4: aqua
- OM5: lime green (wideband multimode)
- OS1/OS2: yellow
**Citation gap:** Field practice diverges — some regions use magenta for OM4 to distinguish from OM3 (same aqua color). This is a "book vs. field" teaching moment. The book (TIA-568.3-D) says aqua for both OM3 and OM4; field practice in some regions introduced magenta for OM4 before TIA standardized. Lesson should note: "when you see magenta patch cords, they are almost certainly OM4."

---

## Section 2: Depth Ceiling Summary per Standard

| Standard | T19 depth | T02 depth | T03 depth |
|---|---|---|---|
| TIA-607-D | Know TMGB/TGB/TBB names + OSP boundary location. NOT full interior design. | N/A | N/A |
| TIA-942-C | Awareness: CO spaces (MER, TR) and redundancy tiers. NOT rated design. | N/A | N/A |
| NEBS (GR-63/GR-1089, ANSI/ATIS-0600336) | Know –48VDC convention and why. Black-box awareness of OLT/CMTS as NEBS devices. | N/A | N/A |
| IEEE 1100 | Single-point ground rationale for CO equipment. NOT full power-conditioning design. | N/A | N/A |
| RUS 1751F-810 | OSP entry bonding + primary protector at building entry. Boundary claim. | N/A | N/A |
| TIA-568.3-D | Interconnect vs. cross-connect + patch panel concept. | N/A | Jacket color table for OM1–OM5. |
| ITU-T G.694.1 | N/A | DWDM channel grid: 100 GHz / 50 GHz spacing. Conceptual awareness. | N/A |
| ITU-T G.671 | N/A | Mux/demux concept: what it does to channels + insertion loss idea. | N/A |
| ITU-T G.698.2 | N/A | Coherent optics exist; phase modulation; 100G+ per wavelength. Awareness. | N/A |
| TIA-492AAAA–AAAE | N/A | N/A | Full per-grade cite for OM1–OM5 cable product specs. |
| IEEE 802.3 | N/A | N/A | Reach values per OM grade at each Ethernet speed. |
| IEC 60793-2-10 | N/A | N/A | IEC fiber classification anchor for OM1–OM5 grades. |
| NFPA 75/76 | Fire suppression awareness: clean-agent vs. sprinkler in CO. | N/A | N/A |

---

## Section 3: Citation Gaps and Field-vs-Book Divergences

### Gap 1 — No single public source defines the OSP/ISP grounding boundary
The handoff point (OSP messenger bonds to IBT, IBT bonds to TMGB per TIA-607, TMGB bonds to building GES per NEC Art. 250) is described across THREE standards that are paywalled individually:
- NEC Art. 250.94 (IBT requirement) — public via NFPA.org limited access
- TIA-607-D §7 (TMGB/GES tie-in) — paywalled
- RUS 1751F-810 §3 (OSP entry bonding) — public USDA PDF

**Resolution:** Use RUS 1751F-810 §3 as the primary public cite for the OSP side; cite NEC Art. 250.94 for the IBT requirement (eCFR-accessible); reference TIA-607-D by name with `[confirm edition]` marker. T14.L05 already introduces IBT with these same sources — T19 should cross-reference T14.L05 rather than re-derive.

### Gap 2 — NFPA 75/76 not on allowlist
CO fire suppression awareness has NO allowlist anchor. Must add NFPA 75 and NFPA 76 to proceed. Without them, the "HVAC/fire suppression awareness" scope item in T19 has no citable source. Fire suppression types (FM-200, Novec 1230, pre-action sprinkler) are vendor-documented but not authoritatively described for CO use cases without NFPA 75/76.

### Gap 3 — DWDM grid standards (ITU-T G.694.1, G.671, G.698.x) not on allowlist
Long-haul addition for T02 has no allowlist anchors for DWDM and coherent optics. ITU-T recommendations are paywalled but widely cited via secondary paths (Cisco technical documents, Corning white papers). For an OSP-awareness lesson, FOA Reference Guide (public) describes coherent optics and DWDM conceptually — this may be sufficient as the primary cite, with ITU-T G.694.1 cited by name with `[paywalled — confirm edition]` markers.

### Gap 4 — TIA-492AAAB (OM2) and TIA-492AAAD (OM4) and TIA-492AAAE (OM5) not on allowlist
T02.L08 already cites TIA-492AAAD and TIA-492AAAE informally. Adding these to the allowlist formalizes what's already in an authored lesson.

### Gap 5 — IEC 60793-2-10 not on allowlist
The IEC multimode classification anchor is absent. The allowlist has IEC 61300-3-35 (end-face quality) and IEC 61753-1 (performance) but not the fiber-grade classification standard. Low risk for T03 content since the OM1–OM5 grades are commonly cited via TIA-492 series, but IEC 60793-2-10 should be added for completeness.

### Book vs. Field Divergence — –48VDC Power Plant
**Book (NEBS/ANSI/ATIS-0600336):** CO equipment runs on –48VDC from a battery plant (rectifiers + batteries). The "plant" provides 48 volts with the positive terminal grounded and the negative terminal at –48V.  
**Field reality:** Many smaller CO huts and headend buildings use dual-conversion UPS on 120/240VAC instead of a full –48VDC battery plant. OSP engineers in rural deployments will encounter both. The lesson must distinguish: full CO (battery plant, –48VDC, NEBS equipment) vs. hut/cabinet (UPS-on-AC, commercial-grade OLT on AC power). The –48VDC convention is the "book" standard; AC-powered equipment in a locked hut is common field practice for rural FTTH headends.

### Book vs. Field Divergence — Interconnect vs. Cross-Connect
**Book (TIA-568.3-D §6):** Cross-connect uses a passive cross-connect field with patch cords; interconnect connects active equipment directly to the horizontal cable.  
**Field reality:** In CO headend spaces, "cross-connect" means the patch panel / LIU array where OSP fibers terminate and ISP equipment connects. Field crews call this the "patch point" or "the panel" regardless of whether it technically meets TIA-568 cross-connect definitions. T19 should teach the TIA vocabulary AND the field shorthand.

---

## Section 4: Proposed Allowlist Additions

The following sources were found necessary for T19/(B)/(C) content and are NOT currently on the allowlist. Each entry has a proposed format for the orchestrator to add:

1. **ITU-T G.694.1** — Spectral grids for WDM applications: DWDM frequency grid. `[paywalled — ITU-T; secondary via Cisco WDM Design Guide, Corning DWDM white papers]`. Scope: T02 long-haul addition (DWDM channel grid, C-band definition).

2. **ITU-T G.671** — Transmission characteristics of optical components and subsystems (WDM mux/demux). `[paywalled — ITU-T]`. Scope: T02 long-haul addition (mux/demux concept, insertion loss).

3. **ITU-T G.698.2** — Amplified multichannel dense WDM applications. `[paywalled — ITU-T; confirm edition]`. Scope: T02 long-haul addition (coherent optics awareness).

4. **IEC 60793-2-10** — Optical fibres — multimode fiber product specifications. `[paywalled — IEC; confirm current edition]`. Scope: T03 OM1–OM5 addition (fiber grade classification).

5. **TIA-492AAAB** — Detail specification for 50 µm OM2 multimode fiber. `[paywalled — TIA; confirm edition]`. Scope: T03 OM2 citation.

6. **TIA-492AAAD** — Detail specification for 50 µm OM4 multimode fiber. `[paywalled — TIA; confirm edition]`. Scope: T03 OM4 citation (already informally cited in T02.L08).

7. **TIA-492AAAE** — Detail specification for 50 µm OM5 (wideband) multimode fiber. `[paywalled — TIA; confirm edition]`. Scope: T03 OM5 citation (already informally cited in T02.L08).

8. **NFPA 75** — Standard for the Fire Protection of Information Technology Equipment. `[paywalled — NFPA; confirm edition]`. Scope: T19 CO/hut fire suppression awareness.

9. **NFPA 76** — Standard for the Fire Protection of Telecommunications Facilities. `[paywalled — NFPA; confirm edition]`. Scope: T19 CO/hut fire suppression awareness.

---

## Section 5: TIA-607 Grounding Boundary — Exact Clause Finding

**The most important citation for T19 is the OSP↔ISP grounding handoff.** Here is the chain of standards that defines it:

1. **NEC NFPA 70-2023 Art. 250.94** — "Intersystem Bonding Termination." Requires that the grounding electrode system include a means for intersystem bonding (IBT) accessible for connection of additional systems (cable, telephone, radio). The IBT is the physical point where OSP cable-sheath/messenger bonding connects to the building GES. Citable from allowlist as "NEC NFPA 70-2023 Art. 250.94."

2. **TIA-607-D §7 (GES tie-in) and §9 (TMGB placement)** — The TMGB is bonded to the building GES at the main entrance facility (MEF) or main equipment room (MER). The TMGB is the ISP-side anchor. The OSP engineer bonds the incoming cable sheath to the IBT (NEC); the IBT connects to the TMGB (TIA-607); the TMGB connects to the GES (both NEC and TIA-607). Cite TIA-607-D §7 and §9 with `[confirm edition — TIA-607-D]`.

3. **RUS 1751F-810 §3** — RUS-specific requirement for bonding cable sheath and messenger at the point of building entry for RUS-funded telecom facilities. Public USDA PDF. Use as the RUS-program primary cite for the OSP entry bonding requirement.

**Teaching formulation for T19 (book-then-field):** "Book: the OSP engineer terminates their responsibility at the building entry IBT (NEC Art. 250.94). Bond the cable sheath, messenger, and armor to the IBT. The ISP/inside-plant team takes over from the IBT through TIA-607's TMGB→TGB chain. Field: in rural headend huts, the IBT and TMGB are often the same bus bar on the wall — a single copper bar bonded to the building ground rod. You hand off a bonded conductor and walk out. The RCDD or CO engineer handles what happens after."

---

=== T19 RESEARCH A — STANDARDS END ===
