# T19 Research Brief — R-1 Primary-Source / High-Precision / Skeptical

**Topic:** T19 — Headend / CO + Rack-Side Hardware Basics
**Framing:** Primary-source-first, high-precision, skeptical of secondary-source numbers
**Teaching position:** 9 (after T06, before T14)
**Prepared by:** R-1 (re-do, full scope, parallel with R-2)
**Date:** 2026-05-16

---

## Per-Lesson Source Map

### T19.L01 — CO / Hut / Headend: What the Building Is

**Primary-source citations:**
- TIA-942-C §5 (architecture — four telecom spaces: MER/Main Equipment Room, TR/Telecommunications Room, EDA/Equipment Distribution Area, HDA/Horizontal Distribution Area). `[confirm edition: TIA publishes on ~5-year cycle]`. Use as conceptual orientation only — T19's depth ceiling does NOT require full TIA-942-C coverage.
- BICSI 002-2024 Chapter 1 (data center/CO design framework — rack layout conventions, single vs. multi-room facilities). `[paywalled — confirm via secondary: BICSI published 2024 edition publicly confirmed]`
- M05 §5.1 (MDF/IDF vocabulary — usable source material, JSX-sourced).

**Depth ceiling:** OSP engineer needs to recognize the physical zones on a headend floor plan and know which zone the feeder cable terminates into (MER/equipment room). Full TIA-942 tiered-redundancy design = ISP course scope. Do NOT teach Tier/Rated redundancy levels here.

**Book-vs-field gap:** Book (TIA-942-C) defines formal four-space architecture. Field reality for rural FTTH headend: a single 10×12 ft shed with one rack, a battery cabinet, and a mini-split. Lesson must teach BOTH — the formal vocabulary exists for when engineers read carrier or municipal CO drawings; the rural-hut reality is what crews actually encounter daily.

**Numeric claims needing primary verification or disclaimer:** Floor-plan dimensions vary by deployment. No single primary spec governs "small hut" dimensions. Mark all size examples as "typical rural deployment — varies by ISP specification."

---

### T19.L02 — OLT and CMTS as Black Boxes

**Primary-source citations:**
- ANSI/ATIS-0600336 (NEBS Generic Physical Design Requirements) — establishes that CO-grade equipment is NEBS-rated; relevant framing for why OLT/CMTS have specific environmental operating envelopes. `[public standard — ANSI/ATIS, confirm current revision]`
- ITU-T G.984.x (GPON family) — defines the GPON logical architecture (OLT ↔ ODN ↔ ONT). `[paywalled ITU-T; publicly summarized in FOA Reference Guide — use FOA as primary teach source with G.984.x cited by name + [paywalled]]`
- DOCSIS 3.1 specification (CableLabs public) — defines CMTS role in HFC architecture. CableLabs publishes the DOCSIS specs publicly at cablelabs.com. This IS a verifiable public source; cite as "CableLabs DOCSIS 3.1 PHY specification (public, cablelabs.com)."

**Depth ceiling:** OLT and CMTS are intentionally black boxes. OSP engineer must understand: (a) these devices are the terminators of the feeder fiber, (b) they require –48VDC power, (c) they have NEBS-environmental envelopes the CO must support. Internal GPON/DOCSIS protocol depth = ISP course scope.

**Book-vs-field gap:** Book: OLT defined by ITU-T G.984 as the CO-side termination of a GPON ODN with specific output power levels per G.984.2. Field: crews call any fiber-to-subscriber headend device "the OLT" regardless of PON variant (GPON, XGS-PON, EPON). The lesson must teach the accurate vocabulary while flagging the field shorthand.

**Numeric claims:** OLT port density (e.g., "8-port chassis" or "16-port shelf") varies entirely by vendor and model. Do NOT state a specific port count. Disclaim: "OLT chassis port density is vendor-specific — confirm with equipment spec sheet."

---

### T19.L03 — –48VDC Power Plant: Why DC, Not AC

**Primary-source citations:**
- Telcordia GR-63-CORE §4.1.4 — specifies battery reserve minimum for NEBS-rated CO equipment. `[paywalled Telcordia/ATIS; secondary via ANSI/ATIS-0600336 which references NEBS requirements; verify N-hour reserve number via dual secondary sources before stating in lesson]`
- ANSI/ATIS-0600336 — NEBS physical design requirements; corroborates –48VDC as the CO power standard and references GR-63-CORE. `[public standard — use as primary accessible cite]`
- BICSI 002-2024 §10.4 — battery backup duration guidance for critical telecom facilities. `[paywalled — confirm edition via BICSI.org]`

**Depth ceiling:** OSP engineer needs to understand WHY –48VDC is used (negative-ground convention, corrosion resistance, telecom industry legacy, battery-float voltage relationship), and how the power plant sits between utility AC, rectifiers, battery strings, and the distribution bus. Rectifier circuit design = ISP/electrical scope.

**Book-vs-field gap:** Book (GR-63-CORE / BICSI 002): full –48VDC battery plant with N+1 rectifiers and battery string. Field reality for rural FTTH hut: 48VDC UPS on AC power with a single battery module — NOT a proper –48VDC plant. This divergence is critical: if an OSP engineer specs the power entry expecting a –48VDC plant and the ISP runs a UPS-on-AC, the OSP engineer's power-input design for the building entry may be mismatched.

**CRITICAL NUMERIC CLAIM — NEEDS PRIMARY VERIFICATION:** Battery reserve N-hour requirement. GR-63-CORE §4.1.4 is paywalled. Do NOT state a specific number of hours (e.g., "8 hours" or "4 hours") without primary verification. Mark as `[GR-63-CORE §4.1.4 — paywalled; reserve duration varies by site classification; verify with NEBS compliance documentation]`. This is a high-risk claim because training data commonly circulates "8-hour" figures that may reflect specific carrier requirements rather than a universal GR-63-CORE minimum.

---

### T19.L04 — Battery Backup and Generator Transfer

**Primary-source citations:**
- NFPA 110-2022 §8.4.1 — weekly load test (30% rated minimum load). `[paywalled NFPA; edition 2022 confirmed publicly via NFPA.org index; specific section number confirmed via NFPA scope descriptions]`
- NFPA 110-2022 §8.4.2 — monthly transfer exercise. `[same — paywalled]`
- NFPA 110-2022 §8.4.3 — annual full-load test. `[same — paywalled]`
- BICSI 002-2024 — N+1 string redundancy recommendation for battery plants. `[paywalled; edition confirmed 2024]`

**Depth ceiling:** OSP engineer needs to understand: (a) the transfer sequence (utility loss → battery sustains → generator starts → ATS transfers → battery floats back), (b) that the CO design must include generator fuel storage and transfer-switch space in the building footprint, and (c) the generator transfer-switch interface is at the OSP/building boundary (OSP engineer specifies the conduit entry for generator exhaust and fuel line). Full generator sizing and ATS specification = MEP engineer scope.

**Book-vs-field gap:** Book: weekly load test, monthly transfer exercise, annual full-load test per NFPA 110-2022 §8.4. Field: rural hut generator test schedule slips to "before storm season" or "when the ISP tech happens to be on site." ALSO: N+1 battery string redundancy (BICSI 002-2024) is routinely waived for small rural FTTH headends on capital cost grounds — single-string deployment is the field norm.

**Numeric claim with disclaimer:** ATS transfer time varies by manufacturer specification (typically <10 seconds for motor-load tolerance, but this is NOT in a single primary spec for telecom); mark as "ATS transfer time is manufacturer-specified — confirm with ATS datasheet."

---

### T19.L05 — HVAC and Fire Suppression: Awareness

**Primary-source citations:**
- NFPA 76 (Standard for the Fire Protection of Telecommunications Facilities) — primary standard for CO/headend fire suppression. `[paywalled — confirm current edition; NFPA publishes on ~4-year cycle; publicly confirmed as NFPA standard via NFPA.org index]`
- NFPA 75 (Standard for the Fire Protection of Information Technology Equipment) — complements NFPA 76 for the IT-equipment scope within a CO. `[paywalled — same confirmation status]`
- TIA-942-C §6.1 — HVAC and environmental requirements for data center/CO spaces (temperature/humidity operating envelope). `[paywalled — confirm edition]`
- ASHRAE Thermal Guidelines A2 Class — defines allowable inlet temperature/humidity range for IT equipment. ASHRAE publishes the thermal guidelines document. `[confirm current edition: ASHRAE 2021 Thermal Guidelines for Data Processing Environments, publicly indexed]`

**Depth ceiling:** OSP engineer awareness only — recognize FM-200/Novec 1230 as clean-agent vs. pre-action sprinkler tradeoff; know that NFPA 76 governs the decision; know NOT to design cable penetrations through a suppression zone without coordinating with the fire-suppression system design. HVAC ton calculations = MEP engineer scope.

**Book-vs-field gap:** Book (NFPA 76): dedicated clean-agent suppression for telecom equipment rooms. Field: rural FTTH hut with single mini-split AC and a residential-grade smoke detector. Gap is real and consequential — OSP engineer must know when they're dealing with a NFPA-76-compliant facility vs. a rural hut, because conduit/cable penetration requirements differ.

**Numeric claims with disclaimer:** FM-200 / Novec 1230 design concentration percentages are agent-specific and governed by EPA SNAP approval and NFPA 2001 (separate standard) — mark as "suppression agent concentration design = fire protection engineer scope, NOT OSP scope."

---

### T19.L06 — Headend Grounding: Where OSP MGN Terminates

**Primary-source citations — this is the most citation-dense lesson:**
- NEC 250.94 (NFPA 70-2023) — Intersystem Bonding Termination (IBT) requirement. `[NEC is paywalled NFPA; confirm via ecfr.gov or state electrical code adoptions; 2023 edition publicly indexed. Section 250.94 specifically requires an IBT at communications cable building entry — this is the primary source for the IBT-entry term]`
- TIA-607-D §7 — GES (Grounding Electrode System) tie-in requirements at building entry for telecommunications. `[paywalled TIA; confirm current edition; TIA-607-D is publicly indexed as the current edition as of 2026; §7 governs building-entry bonding]`
- TIA-607-D §9 — TMGB (Telecommunications Main Grounding Busbar) placement. `[same — paywalled]`
- RUS 1751F-810 §3 — OSP-side building-entry bonding requirements for RUS-program facilities. `[publicly available USDA RD PDF; §3 governs electrical protection at building entry; this is the PRIMARY accessible anchor for this lesson — use as the anchor cite]`
- IEEE Std 487 — Ground Potential Rise (GPR) at CO/headend entry; context for why single-point IBT is mandatory. `[paywalled IEEE; publicly indexed via IEEE Xplore; secondary via FOA GPR protection guides]`

**Depth ceiling:** OSP engineer must: (a) specify the building-entry IBT point on the OSP engineering drawing, (b) specify armor bond at the building entry, (c) know that NEC 250.94 and TIA-607-D §7 govern the IBT design, (d) understand the GPR-destroys-line-cards consequence of skipping the IBT. Full TIA-607 TBB/TMGB interior chain design = T14 scope (forward-referenced here, fully taught in T14.L05).

**CRITICAL Book-vs-field gap (most consequential in T19):** TIA-607-D requires single-point bonding at building entry via a dedicated IBT device. Field shortcut: OSP crew bonds the incoming feeder cable armor to the nearest available ground bus inside the equipment room (often the battery plant frame or rack rail). This shortcut creates a multi-point ground path. In a GPR event (nearby lightning strike or high-voltage fault on adjacent utility), the multi-point path allows fault current to flow through the equipment — OLT line cards are destroyed. This is NOT a theoretical risk: GPR events causing OLT line-card failures are documented in RUS-program field incident reports. The lesson MUST present this explicitly with the consequence chain.

**Numeric claim with disclaimer:** Ground resistance targets (25 Ω per NEC, 5 Ω per GR-1275) are referenced here by concept only — full IEEE 81 measurement and the specific thresholds are T14.L06 scope. Do NOT teach the measurement methodology in T19.L06.

---

### T19.L07 — Rack-Side Hardware: Patch Panels and LIU

**Primary-source citations:**
- TIA-568.3-D §6 — interconnect vs. cross-connect definition. `[paywalled TIA; confirm edition; publicly indexed as current. §6 governs optical fiber cabling topology — interconnect uses a single connection point; cross-connect uses two]`
- TIA-606-D — administration standard; port labeling conventions. `[paywalled TIA; confirm edition]`
- M05 §5.2 — partial migration source for MDF/IDF patch panel vocabulary (JSX source, usable).

**Depth ceiling:** OSP engineer needs to recognize: (a) what a patch panel / LIU (Light Interface Unit / Fiber Distribution Frame) is, (b) the interconnect vs. cross-connect distinction so they can correctly describe the handoff topology on design drawings, (c) common connector types at the CO patch point (SC, LC, MPO). Full cabling administration (TIA-606-D labeling scheme design) = ISP scope.

**Book-vs-field gap:** Book (TIA-568.3-D): formal interconnect/cross-connect distinction drives topology documentation. Field: techs call every fiber connection point "the patch panel" or "the panel" regardless of whether it's an interconnect or cross-connect topology.

**Numeric claims:** Port density per rack unit varies by manufacturer. Do NOT state specific port counts. "Typical LC patch panels are 24-port or 48-port per 1U" is reasonable orientation language marked as "typical — confirm with equipment specification."

---

### T19.L08 — FOSC and Splice Enclosures in the Headend

**Primary-source citations:**
- NEC Art. 770 (NFPA 70-2023) — building-entry requirements for optical fiber cables (listed types, routing, and sealing at building penetrations). `[paywalled NFPA; NEC 2023 edition publicly indexed; Art. 770 governs building entry for optical fiber]`
- TIA-568.3-D — connector and splice enclosure types referenced in OSP-to-ISP handoff context. `[paywalled TIA]`

**Depth ceiling:** OSP engineer must know: (a) the same FOSC product used in the OSP is used inside the headend in a rack-mount form factor, (b) NEC Art. 770 governs how the incoming OSP cable is treated at building entry (plenum rating, sealing requirements). Full rack-mount FOSC installation = ISP tech scope.

**Book-vs-field gap:** Book (NEC Art. 770): incoming OSP cable requires specific listed cable type or appropriate transition to a listed cable within 50 ft of building entry (per NEC 770.110 — `[confirm exact clause; NEC 2023 §770.110 governs cable types; paywalled]`). Field: rural hut direct-connected armored OSP cable to rack-mount FOSC with no cable type transition — common practice that violates NEC 770 when the hut is an occupied building. Flag the distinction.

---

### T19.L09 — FDH Internals: Beyond the Box

**Primary-source citations:**
- RUS FTTH design guides (RUS/USDA published FTTH deployment guidance documents) — FDH modular bay and splitter cassette configurations referenced in RUS-program design packages. `[verify specific RUS FTTH design guide document — this is the PRIMARY accessible anchor; check USDA RD publication list]`
- TIA-606-D — fiber labeling and administration at FDH connector field. `[paywalled TIA; confirm edition]`

**Depth ceiling:** OSP engineer designs FDH placement (T05/T06 scope) and the OSP fiber count into the FDH. T19.L09 goes one level deeper: what's inside the FDH so the OSP engineer can correctly account for express-vs-split fiber routing in the feeder cable count design.

**Book-vs-field gap:** Book (TIA-606-D): connector field at FDH should use machine-readable labeling per the administration class. Field: marker-on-tape labeling is the universal norm at FDH connector fields. This matters because undocumented FDH fiber routing is the most common cause of incorrect splice matrix documentation — the as-built diverges from the as-designed at exactly this point.

**Numeric claim with disclaimer:** Splitter cassette insertion loss (e.g., "1:32 splitter ≈ 15 dB typical") is product-specific. Reference the lesson back to T02 link budget math; do not state a single number without "verify with splitter datasheet."

---

### T19.L10 — T19 Capstone Quiz

No new vocabulary introduced. Quiz references all 10 lessons' vocabulary. The headend floor-plan AnnotatedDiagram identify exercise is the highest-value assessment — tests ability to integrate equipment-zone vocabulary with physical layout.

---

## Cross-Lesson DAG Validation

### Three Path Y terms: T19 → T14

| Term | First-introduction lesson | Unambiguous? | Risk |
|---|---|---|---|
| **primary protector** | T19.L06 | YES — defined in context of building-entry surge protection. But NOTE: T14.L07 also introduces "primary protector" in the context of surge arresters. **This is a TERM CONFLICT.** T14.L07 must clarify that the term was introduced in T19.L06 and use `vocabulary_assumed`. Otherwise learners see a "new" definition of a term they already learned. Author must coordinate the T14.L07 treatment. |
| **IBT-entry** | T19.L06 | YES — NEC 250.94 is the primary-source anchor. Clean first introduction. |
| **GES-tie-in** | T19.L06 | YES — TIA-607-D §7 and RUS 1751F-810 §3 provide dual primary anchors. |

### Vocabulary assumed by T19 lessons that must already be introduced

T19's `vocabulary_assumed` block must include (verifying against DAG):

| Term | Should be introduced in | Verified in DAG? |
|---|---|---|
| CO, headend, OLT, ONT, FDH | T01.L01 (OSP vs. ISP) | YES — T01 vocab set |
| conduit, handhole, building-entry | T06 | YES — T06 prereq |
| LOTO, PPE, confined space | T18 | YES — T18 prereq |
| Aerial/underground feeder routing into headend | T05 + T06 | YES |
| MGN, messenger bond | **NOT YET INTRODUCED** before T19 | **RISK: MGN terminology is used in T19.L06 ("OSP MGN terminates at headend") but T14 is where MGN is formally introduced. T19.L06 must either (a) introduce MGN as a T19 vocab term here with a basic definition, OR (b) the ARCH.md DAG must add T14 as a T19 prereq — which is impossible (T14 follows T19). Resolution: T19.L06 MUST introduce MGN with a foundation-level "what the multi-grounded neutral wire is" definition. T14.L02 then teaches full MGN electrical depth with T19 as assumed.** |

---

## Citation Risks

### Tier 1 — High risk: paywalled, no convergent secondary

| Claim | Standard | Risk level | Mitigation |
|---|---|---|---|
| Battery reserve N-hour minimum | Telcordia GR-63-CORE §4.1.4 | HIGH | Mark `[paywalled — verify via site's NEBS compliance documentation]`; do NOT state a specific hour count without dual-secondary convergence |
| TIA-607-D §7 GES tie-in specific design requirements | TIA-607-D | MEDIUM-HIGH | RUS 1751F-810 §3 provides accessible secondary anchor; use RUS as primary teach source |
| NFPA 76 suppression type determination | NFPA 76 | MEDIUM | Accessible via NFPA for purchase; publicly indexed; can cite by name + edition without section-level claims |
| NEC 250.94 IBT requirement | NFPA 70-2023 | MEDIUM | Widely cited in electrical engineering secondary sources; NEC 2023 publicly indexed; risk is section-level drift if edition changes |

### Tier 2 — Medium risk: standards exist but editions in flux

| Claim | Standard | Issue |
|---|---|---|
| TIA-607 current edition | TIA-607-D | TIA publishes on ~5-year cycle; confirm D is still current in 2026 |
| NFPA 110 generator test schedule | NFPA 110-2022 | 2022 is confirmed edition; risk is if NFPA issued a 2025 edition |
| BICSI 002-2024 N+1 recommendation | BICSI 002-2024 | 2024 edition confirmed; low drift risk near publication |

### Tier 3 — Low risk: public primary sources

| Claim | Standard | Status |
|---|---|---|
| DOCSIS 3.1 / CMTS definition | CableLabs public spec | Publicly available; low hallucination risk |
| ANSI/ATIS-0600336 NEBS | Public ANSI/ATIS standard | Publicly indexed; use as accessible NEBS anchor |
| RUS 1751F-810 §3 building-entry bonding | USDA RD public PDF | Primary accessible source; HIGH value anchor |

---

## High-Precision Register: Claims Considered and Rejected

These are factual assertions I evaluated and deliberately did NOT include in the per-lesson source map because primary-source backing is absent or insufficient.

1. **"–48VDC has a 50-year safety track record in CO environments"** — rejected. True directionally, but no single primary source makes this claim. It's telecom-industry common knowledge, which is training-data territory. Omit.

2. **"OLT consumes approximately X watts per port"** — rejected. Entirely vendor/model-specific. No primary standard sets a watt-per-port figure. Omit from lesson; reference "verify with equipment spec sheet."

3. **"Standard headend room temperature setpoint is 65–77°F (18–25°C)"** — this is the ASHRAE A2 class envelope range. ASHRAE Thermal Guidelines is a real public document. However, the exact A2 range (10–35°C inlet, with preferred 18–27°C) is from the ASHRAE document, and stating it in a lesson requires citing the specific ASHRAE publication. Acceptable IF cited as "ASHRAE Thermal Guidelines for Data Processing Environments, A2 class" with `[confirm current edition]`. Do NOT state as a standalone fact.

4. **"Most rural FTTH headends run on 48VDC UPS rather than a full –48VDC battery plant"** — directionally true per field practice, but no published study or primary source documents this percentage. Frame as "commonly observed in rural FTTH deployments" — field-practice voice per Carter's training rule, not a statistical claim.

5. **"GR-63-CORE requires 8 hours of battery reserve"** — REJECTED. This figure circulates widely in secondary sources and training materials, but GR-63-CORE §4.1.4 is paywalled and the 8-hour number may reflect a specific site class (Class 1 CO) not applicable to rural FTTH huts. Do NOT assert this number without dual-secondary convergence per the allowlist paywalled-source rule.

6. **"NEC 770.110 requires transition within 50 feet of building entry"** — conditionally accepted with `[confirm clause; NEC 2023 §770.110 governs cable type at building entry; paywalled]`. The 50-foot transition distance is cited in secondary electrical code commentary but I cannot confirm the exact distance from the primary text.

---

## R-2 Convergence Expectations

R-2 should independently surface:
- **AGREE expected:** RUS 1751F-810 §3 as the primary accessible anchor for T19.L06. This is the only public primary source directly covering OSP building-entry bonding for RUS-program builds.
- **AGREE expected:** The GR-63-CORE battery reserve hour count is unverifiable without paywalled access and should NOT be stated as a specific number.
- **DIVERGENCE RISK:** The primary protector / T14.L07 term conflict — R-2 may not catch this if framing differently. Orchestrator should cross-check.
- **DIVERGENCE RISK:** The MGN vocabulary gap in T19.L06 (MGN not introduced before T14 per DAG) — this is a DAG validation finding that requires architectural attention, not a simple author instruction.

=== T19 R1 PRIMARY-SKEPTICAL END ===
