---
title: "Cable Selection — Topic Final Exam"
duration_min: 45
topic: cable-selection
order: 99
type: final-exam
pass_threshold_pct: 70
question_count: 25
bicsi_alignment:
  - "OSP-DRD 5.1–5.6: Full Cable Selection domain"
  - "OSP-DRD 6.1–6.3: OSP installation methods and compliance"
  - "OSP-DRD 7.1: Documentation and as-built records"
sources:
  - "ANSI/TIA-758-C (multiple sections)"
  - "ANSI/TIA-568.3-D (multiple sections)"
  - "ANSI/TIA-472AAAB, ANSI/TIA-492AAAC/D/E"
  - "ANSI/TIA-526-7"
  - "ITU-T G.652.D, G.657"
  - "IEC 60793-2-10, IEC 60794-1-2, IEC 60794-3"
  - "IEEE 802.3ae"
  - "IEEE 1222"
  - "NESC C2-2023 (multiple rules)"
  - "NEC Article 770"
  - "BICSI OSP-DRD Manual (multiple chapters)"
  - "Corning OSP Fiber Optic Reference Guide, 8th ed."
  - "CommScope Cabling Systems Reference Manual"
  - "AFL Telecommunications OSP Cable Design Guide, Rev. 4"
  - "USDA RUS Bulletin 1753F-601"
notes:
  - "Randomization of question order occurs at Moodle import time. This file is the canonical question bank."
  - "Randomization of answer option order (A/B/C/D) also occurs at Moodle import. The [CORRECT] marker identifies the correct answer regardless of displayed order."
  - "Pass threshold: 18 of 25 questions correct (72%) — rounding to 70% pass minimum."
  - "Known issues: L6 Q6 imagery math — verify at import. L3 Q3 drag-drop labels — verify at import."
  - "Source citations appear in rationale blocks. These are informational at display time; Moodle does not display rationale during the exam, only on review."
---

# Cable Selection — Topic Final Exam

**Instructions:** This exam covers all 12 lessons of the OSP Cable Selection topic. Select the single best answer for each question. A score of 18/25 (70%) or higher is required to pass and receive credit for the Cable Selection topic.

Randomization of question and answer order is applied at Moodle import. The question bank below presents questions in lesson-number order for authoring and review purposes.

---

## Question Bank

---

### From Lesson 1 — Single-Mode vs. Multi-Mode Fiber

**Q1.** An OSP project requires a fiber backbone from a central office to a remote hub site, 22 km apart. The design must support 10 Gbps today and have an upgrade path to 100 Gbps without fiber replacement. Which fiber type is the correct specification?

- A) OM5 wideband multi-mode fiber — the highest-grade multi-mode, maximizing future upgrade path
- B) OS2 single-mode fiber **[CORRECT]**
- C) OM4 laser-optimized multi-mode fiber with SWDM transceivers
- D) OS1 indoor single-mode fiber with extended-range transceivers

*Source: [ITU-T G.652.D; ANSI/TIA-758-C §5.2; ANSI/TIA-568.3-D §6.3.2.2]*

*Rationale:* OS2 SMF is the only fiber type suitable for a 22 km OSP backbone span. Modal dispersion limits OM4 to 550 m at 10G and OM5 to the same ceiling — neither approaches 22 km at any data rate. OS1 is an indoor-grade fiber with a relaxed attenuation spec (≤1.0 dB/km) that would accumulate ~22 dB of span loss at 22 km — exceeding any standard transceiver budget. OS2 at 1550 nm achieves ≤0.4 dB/km; at 22 km, span loss is ~8.8 dB, within 10GBASE-ER transceiver budget (12.6 dB per IEEE 802.3ae). Future upgrade to 100G uses 100GBASE-LR4 transceivers on the same OS2 fiber plant. [ANSI/TIA-758-C §5.2; ITU-T G.652.D §4; IEEE 802.3ae]

---

**Q2.** What is the primary bandwidth-limiting mechanism in multi-mode optical fiber, and which structural feature of laser-optimized MMF partially mitigates it?

- A) Chromatic dispersion; step-index core profile
- B) Polarization mode dispersion; tight-buffer coating
- C) Modal dispersion; graded-index core profile **[CORRECT]**
- D) Stimulated Brillouin scattering; core diameter reduction

*Source: [BICSI OSP-DRD Manual, Ch. 5.2; ANSI/TIA-492AAAD §6]*

*Rationale:* Modal dispersion — caused by multiple propagation modes traveling different path lengths and arriving at the receiver at different times — is the bandwidth-limiting mechanism in MMF. The graded-index core profile (refractive index decreasing parabolically from center to cladding boundary) partially compensates by slowing high-order modes and speeding low-order modes, extending reach compared to step-index MMF. Chromatic dispersion is the SMF bandwidth limit; polarization mode dispersion affects long-haul SMF; SBS is a nonlinear SMF effect at high power. [BICSI OSP-DRD Manual, Ch. 5.2; ANSI/TIA-492AAAD §6]

---

### From Lesson 2 — SMF Grades: OS1 vs. OS2

**Q3.** An engineer specifies OS1 fiber for a 15-km aerial OSP feeder route between two hub sites. A reviewer flags this as an error. What is the correct objection?

- A) OS1 is an indoor-grade fiber with attenuation ≤1.0 dB/km at 1310 nm; at 15 km this accumulates 15 dB of span loss — beyond the budget of standard long-reach transceivers; OS2 is the correct OSP specification **[CORRECT]**
- B) OS1 does not conform to ITU-T G.657 bend-insensitive specification required for all aerial routes
- C) OS1 is not available in strand counts above 24 fibers, which is insufficient for a hub-to-hub feeder
- D) OS1 is not compatible with ADSS cable construction required for aerial installations

*Source: [ANSI/TIA-568.3-D Table 4, §6.3.2.2; ANSI/TIA-758-C §5.2]*

*Rationale:* OS1 has an attenuation spec of ≤1.0 dB/km at 1310/1550 nm — designed for indoor short-reach applications. At 15 km: maximum span loss = 15 dB, exceeding the 12.6 dB budget of 10GBASE-LR transceivers (IEEE 802.3ae). OS2 (≤0.4 dB/km) produces ≤6 dB at 15 km — well within budget. OS2 is the mandatory specification for all OSP feeder and backbone cable per ANSI/TIA-758-C §5.2. The G.657 bend specification is relevant but secondary; OS2 per G.652.D is the primary requirement. [ANSI/TIA-568.3-D Table 4; ANSI/TIA-758-C §5.2; IEEE 802.3ae]

---

### From Lesson 3 — MMF Grades: OM1 through OM5

**Q4.** An OM4 cable is installed in a data-center east-west link at 40 Gbps. The measured link length is 165 meters. Will this link operate within OM4's specifications?

- A) Yes — OM4 supports 40G to 550 meters
- B) No — OM4 supports 40G to a maximum of 150 meters; 165 meters exceeds the specification **[CORRECT]**
- C) Yes — OM4 supports 40G to 300 meters using SWDM transceivers
- D) No — OM4 does not support 40G at any distance; OM5 or OS2 is required

*Source: [ANSI/TIA-492AAAD §8; ANSI/TIA-568.3-D Table 5]*

*Rationale:* OM4 supports 40GBASE-SR4 (40G over parallel optics, 850 nm VCSEL) to a maximum channel length of **150 meters** per ANSI/TIA-492AAAD §8. A 165-meter link exceeds this limit by 15 meters — the link will not operate reliably at 40G. OM4 supports 10G to 550 meters, which is a separate specification. SWDM transceivers at 40G require OM5, not OM4, and still don't extend 40G reach beyond 150 meters. OS2 SMF with 40GBASE-LR4 is the correct specification for any 40G link over 150 meters. [ANSI/TIA-492AAAD §8]

---

### From Lesson 4 — Loose-Tube Cable Construction

**Q5.** A 144-fiber feeder cable uses a 12-tube construction with 12 fibers per tube (12-FPT). An OTDR trace shows a splice event at 4.2 km with a 0.3 dB loss — above the project's 0.1 dB per-splice specification. What is the most likely cause, and what corrective action should be taken?

- A) The fiber is OS1 — upgrading to OS2 will reduce splice loss inherently
- B) The tube assignment was misread; the correct fiber is in tube 7, not tube 6 — trace the correct tube
- C) The splice was made without proper cleaver calibration or fiber end-face preparation; the splice must be re-executed **[CORRECT]**
- D) The 0.3 dB loss is within the acceptable range for a 144-fiber cable — the 0.1 dB spec applies only to drop cable

*Source: [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.2; Corning OSP Reference, Ch. 7.3]*

*Rationale:* A 0.3 dB fusion splice loss exceeds the typical project specification of ≤0.1 dB and the practical achievable performance of a properly calibrated fusion splicer (≤0.05 dB typical for skilled technicians on OS2 fiber). The most likely cause is poor end-face preparation (dirty or angled cleave), a mis-aligned cleave, or a fiber contamination on the splice surfaces. The corrective action is to reopen the splice tray, re-cleave both fiber ends, re-clean the fiber, and re-execute the fusion splice with the splicer's loss estimate confirmation before the arc fires. The 0.1 dB specification applies to all feeder splices — the fiber count of the cable does not change the per-splice acceptance criterion. [ANSI/TIA-758-C §7; BICSI OSP-DRD Manual, Ch. 7.3]

---

### From Lesson 5 — Tight-Buffer and Breakout Cable

**Q6.** A contractor proposes using tight-buffer breakout cable for an outdoor direct-bury run of 80 feet from a building entry pedestal to a splice closure in a handhole. What is the primary reason this specification is incorrect?

- A) Tight-buffer cable does not support OS2 fiber
- B) Tight-buffer cable lacks the tube-level water-blocking and mechanical protection required for direct-bury outdoor environments **[CORRECT]**
- C) Tight-buffer cable cannot be fusion-spliced to loose-tube OS2 cable
- D) Tight-buffer cable exceeds the conduit fill ratio for the handhole conduit entry

*Source: [ANSI/TIA-758-C §5.2; BICSI OSP-DRD Manual, Ch. 5.3.3]*

*Rationale:* Tight-buffer cable is designed for indoor premises cabling. It lacks gel-fill tube-level water-blocking, OSP-rated PE sheath chemistry, and the mechanical protection required for any outdoor installation. Exposing tight-buffer cable to direct-bury soil moisture leads to water ingress in the buffer coating, capillary migration along the fiber, and accelerated hydrogen darkening and microbend loss within months. ANSI/TIA-758-C §5.2 and BICSI OSP-DRD Manual Ch. 5.3.3 explicitly specify loose-tube OS2 construction for all OSP applications. Tight-buffer cable can be spliced to OS2 (same 125 µm cladding) but should not be used in the outdoor environment regardless. [ANSI/TIA-758-C §5.2; BICSI OSP-DRD Manual, Ch. 5.3.3]

---

### From Lesson 6 — Ribbon Cable and Mass-Fusion Splicing

**Q7.** A high-fiber-count feeder (432-fiber ribbon cable) requires mid-route splicing at a splice closure. The splicing crew proposes using a single-fiber fusion splicer for all 432 splices. What is the primary operational reason this approach is problematic?

- A) Single-fiber fusion splicers cannot achieve the ≤0.1 dB splice loss required for 432-fiber ribbon cable
- B) Mass-fusion splicing reduces splice time by approximately 12× compared to single-fiber splicing — a 432-fiber splice takes hours with mass fusion vs. days with single-fiber methods, making single-fiber splicing operationally impractical for high-fiber-count ribbon feeder work **[CORRECT]**
- C) Single-fiber fusion splicers cannot accept the larger outer diameter of ribbon cable buffer tubes
- D) Single-fiber fusion splicing eliminates the need for fusion splicing in the field entirely

*Source: [BICSI OSP-DRD Manual, Ch. 5.4; Corning OSP Reference, Ch. 4.2]*

*Rationale:* Mass-fusion splicing is preferred for ribbon cable because of the **labor efficiency advantage** — a 12-fiber mass-fusion splicer splices an entire ribbon row in a single arc operation (~15–30 seconds per ribbon), compared to 12 separate single-fiber splices at ~3–5 minutes each. For a 432-fiber cable (36 ribbons), mass fusion takes approximately 9–18 minutes of arc time; single-fiber methods take approximately 3–6 hours. The efficiency gap compounds over a feeder project with dozens of splice closures. Single-fiber splicing of ribbon cable is physically possible — the ribbon matrix can be separated into individual fibers — but it destroys the efficiency advantage of ribbon construction and is not operationally viable for high-fiber-count feeder work. Answer D ("eliminates need for fusion splicing in the field") is incorrect: ribbon cable still requires fusion splicing. The distinction is that mass fusion, not single-fiber splicing, is the correct method for ribbon cable. [BICSI OSP-DRD Manual, Ch. 5.4; Corning OSP Reference, Ch. 4.2]

---

### From Lesson 7 — Sheath Options: PE, FR/OFNR/OFNP, and Armored

**Q8.** A cable route transitions from outdoor conduit to a building plenum and then to a telecommunications room. Which sheath type is required for the plenum segment?

- A) OSP-rated PE — the conduit provides fire protection
- B) OFNR (riser-rated) — riser-rated cable may be used in any indoor space
- C) OFNP (plenum-rated) **[CORRECT]**
- D) No special rating is required if the cable is in a conduit within the plenum

*Source: [NEC Article 770.113; ANSI/TIA-758-C §5.2]*

*Rationale:* Air-handling plenum spaces require **OFNP (plenum-rated)** cable, which passes the UL 910 flame and smoke test. OFNR (riser-rated, UL 1666) may not be substituted in plenum spaces — it is a less restrictive fire rating. OSP cable is not permitted in plenum spaces under any circumstances. The conduit exception under NEC 770.113(A)(1) allows non-listed cable in metallic conduit without the 50-foot limit, but in a plenum space the conduit itself must be metallic and continuous; standard PVC conduit in a plenum is not code-compliant in many jurisdictions without additional fire-rating provisions. OFNP is the universally safe specification for plenum cable runs. [NEC Article 770.113]

---

### From Lesson 8 — Drop / Distribution / Feeder Hierarchy

**Q9.** A distribution route must serve 128 homes through 32:1 passive splitters at FDT pedestals. Using the BICSI distribution design multiple, what is the minimum fiber count for the distribution cable, and what standard cable configuration covers it?

- A) 4 active fibers × 3 = 12 fibers; 12-fiber standard cable **[CORRECT]**
- B) 128 fibers — one fiber per home
- C) 4 active fibers × 4 = 16 fibers; 24-fiber standard cable
- D) 4 active fibers × 3 = 12 fibers; but a 24-fiber cable is required for OSP conduit routes

*Source: [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]*

*Rationale:* 128 homes ÷ 32 (splitter) = **4 active feeder/distribution fibers**. BICSI 3× distribution design multiple: 4 × 3 = **12 fibers minimum**. The 12-fiber cable is a standard configuration (1-tube × 12-FPT or 2-tube × 6-FPT) that exactly meets the minimum and serves as the correct answer. No additional cable size increase is required when the calculated minimum exactly matches a standard configuration. Applying the feeder 4× multiple (Answer C) misapplies the distribution design multiple. One fiber per home (Answer B) ignores the passive splitting architecture entirely. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.4]

---

**Q10.** What is the function of a Fiber Distribution Hub (FDH), and at which tier boundary is it located in the OSP hierarchy?

- A) An FDH is a splice closure for cable-to-cable jointing within the feeder tier
- B) An FDH is the passive network element at the feeder-to-distribution boundary, where feeder cables terminate and distribution cables originate **[CORRECT]**
- C) An FDH is the network element at the distribution-to-drop boundary where passive splitters are installed
- D) An FDH is a powered active equipment cabinet that amplifies optical signals at mid-feeder points

*Source: [BICSI OSP-DRD Manual, Ch. 4.1; ANSI/TIA-758-C §4.2]*

*Rationale:* The **FDH (Fiber Distribution Hub)** marks the **feeder-to-distribution boundary**. Feeder cables from the hub site or central office terminate at the FDH; distribution cables originate from the FDH and run toward customer clusters. The FDH may house passive splitters in PON architectures where splitting occurs at the feeder level. The FDT (Fiber Distribution Terminal) marks the distribution-to-drop boundary and is where splitters are most commonly located in fiber-deep PON deployments. The FDH is a passive element — it has no active electronics. [BICSI OSP-DRD Manual, Ch. 4.1; ANSI/TIA-758-C §4.2]

---

### From Lesson 9 — Connector and Field-Termination Options

**Q11.** A 40-fiber distribution cable is terminated at an FDT pedestal using SC/APC connectors. A field technician proposes swapping the SC/APC connectors for SC/UPC connectors to use available inventory. What is the primary technical objection?

- A) SC/UPC connectors are not compatible with single-mode fiber
- B) SC/UPC and SC/APC connectors produce different back-reflection characteristics — APC connectors have ~60 dB return loss vs. ≥50 dB for UPC; mixing connector types on an APC-specified link will degrade return loss and may cause laser instability in high-power or DWDM systems **[CORRECT]**
- C) SC/UPC connectors have a larger physical footprint than SC/APC and will not fit the FDT pedestal hardware
- D) SC/UPC connectors require a different fusion splice angle (8 degrees) compared to SC/APC connectors (0 degrees)

*Source: [BICSI OSP-DRD Manual, Ch. 7.3; Corning OSP Reference, Ch. 8.2; ANSI/TIA-568.3-D §10]*

*Rationale:* SC/APC connectors use an 8-degree angled end-face that redirects back-reflection away from the fiber core, achieving **~60 dB return loss (optical return loss, ORL)**. SC/UPC connectors use a flat end-face and achieve **≥50 dB ORL** per ANSI/TIA-568.3-D §6.6.1 — substantially better than a damaged or dirty connector (~35 dB), but still 10 dB below APC. An APC-specified link using UPC connectors at the FDT will have degraded back-reflection performance. In PON downstream systems using distributed feedback (DFB) lasers (common in GPON OLT transmitters), back-reflection above a threshold induces laser frequency chirp and power instability. APC connectors are specified in PON architectures for this reason. Substituting UPC for APC violates the specification. The splice angle confusion (Answer D) is reversed — UPC connectors use a 0-degree end-face; APC connectors use an 8-degree end-face. [BICSI OSP-DRD Manual, Ch. 7.3; ANSI/TIA-568.3-D §6.6.1]

---

### From Lesson 10 — Environment-Driven Cable Selection

**Q12.** A 3.5-mile direct-bury feeder cable route passes through a zone with documented pocket gopher activity. The route also passes within 50 feet of a 138 kV transmission line right-of-way for approximately 0.3 miles. Which combination of cable specifications correctly addresses both requirements?

- A) CST-armored loose-tube OS2 for the entire 3.5-mile route
- B) CST-armored loose-tube OS2 for the 3.2-mile non-electrical-hazard segment; dielectric-armored loose-tube OS2 for the 0.3-mile segment near the transmission line **[CORRECT]**
- C) Unarmored loose-tube OS2 with an inner duct for the entire route — inner duct provides equivalent rodent protection
- D) Wire-armored (round wire) loose-tube OS2 for the entire route — wire armor is required whenever rodent pressure and electrical hazards coexist

*Source: [ANSI/TIA-758-C §5.6, §5.6.2; AFL OSP Cable Design Guide, §5.2]*

*Rationale:* The route has two distinct threat profiles. For the 3.2-mile segment with rodent pressure but no electrical proximity hazard: **CST armor** is the correct specification — steel armor deters sustained rodent gnawing and provides crush resistance per ANSI/TIA-758-C §5.6. For the 0.3-mile segment within 50 feet of a 138 kV transmission line ROW: **dielectric armor** (fiberglass) is required — CST armor is a metallic conductor that creates a ground-fault hazard from induced currents and step-potential risk near high-voltage infrastructure. ANSI/TIA-758-C §5.6.2 specifically covers dielectric armor for installations near electrical infrastructure. Unarmored cable with inner duct (Answer C) does not address rodent pressure — inner duct is gnawable and does not provide the mechanical deterrence of steel armor. Wire armor (Answer D) is metallic and has the same electrical proximity hazard as CST armor. [ANSI/TIA-758-C §5.6, §5.6.2; AFL OSP Cable Design Guide, §5.2]

---

**Q13.** An ABFU (air-blown fiber unit) with an 8.5 mm outer diameter is being specified for a 7/5.5 mm HDPE microduct (7 mm OD, 5.5 mm ID). Should this ABFU be installed in this microduct?

- A) Yes — the ABFU OD (8.5 mm) is less than the microduct OD (7 mm)... wait, it is greater than the microduct OD — the ABFU cannot physically fit in the microduct **[CORRECT]**
- B) Yes — compressed air pressure of sufficient magnitude can force any ABFU through any microduct
- C) No — ABFUs with OD greater than 7.2 mm require a 10/8 mm microduct minimum
- D) No — ABFU installation is not permitted in HDPE microduct; PVC microduct is required

*Source: [BICSI OSP-DRD Manual, Ch. 6.5]*

*Rationale:* The ABFU outer diameter (8.5 mm) is **larger than the microduct inner bore (5.5 mm)**. The ABFU physically cannot enter the microduct tube regardless of air pressure. The ABFU OD must be less than the microduct inner bore (not outer diameter) and should not exceed ~85% of the inner bore for adequate airflow clearance during blowing. For a 7/5.5 mm microduct (5.5 mm ID), the maximum ABFU OD is approximately 5.5 × 0.85 = 4.7 mm. An 8.5 mm ABFU is sized for a 10/8 mm microduct (8 mm ID × 0.85 = 6.8 mm max — still too large at 8.5 mm; this ABFU would require a microduct with ID ≥ ~10 mm). [BICSI OSP-DRD Manual, Ch. 6.5]

---

### From Lesson 11 — Compliance: NESC, NEC, ANSI/TIA-758-C, BICSI

**Q14.** Which NESC rule governs the required minimum clearance of aerial optical fiber cable above a public road crossing?

- A) NESC Rule 230 (loading of aerial conductors)
- B) NESC Rule 232 (clearances of wires from ground and other objects) **[CORRECT]**
- C) NESC Rule 352 (grounding of cable sheaths and armor)
- D) NESC Rule 354 (underground cable installation)

*Source: [NESC C2-2023, Rule 232]*

*Rationale:* NESC Rule 232 establishes the minimum vertical clearance of aerial wires, cables, and equipment above ground surfaces, roads, railways, navigable water, and other facilities. For a public road crossing, the minimum aerial clearance (to the lowest point of the cable sag at maximum design loading, per the applicable NESC loading district) is defined in NESC Rule 232 tables. Rule 230 governs loading calculations; Rule 352 governs grounding; Rule 354 governs underground cable. The clearance requirement — the physical gap between cable and road surface — is Rule 232. [NESC C2-2023, Rule 232]

---

**Q15.** A 72-fiber CST-armored feeder cable enters a 40-foot corridor in a network operations center from the building entry point to the equipment room. The bonding conductor from the CST armor at the building entry termination connects to a ground rod with a measured resistance of 18 ohms. The AHJ requires ≤ 25 ohms. The cable continues 40 feet to the equipment room without an indoor cable transition. Is the installation compliant?

- A) No — the 18-ohm resistance exceeds the NESC requirement
- B) Yes — both the grounding resistance and the indoor cable length are within applicable limits
- C) No — the 40-foot indoor run does not require remediation; the 18-ohm resistance exceeds NESC Rule 352 limits
- D) No — the 40-foot indoor run is within NEC 770.113's 50-foot limit, but the building entry transition must still include a BET and OFNR cable regardless of length **[CORRECT]**

*Source: [NEC Article 770.113; NESC C2-2023, Rule 352; ANSI/TIA-758-C §5.2]*

*Rationale:* Two parameters must be evaluated. (1) **Ground resistance:** 18 ohms is below the AHJ's 25-ohm limit — compliant. (2) **Indoor cable run:** 40 feet is within the NEC 770.113 maximum of 50 feet, so the OSP cable may extend to the equipment room without an OFNR transition. However, NEC 770.113 requires that OSP cable entering a building be terminated at a **BET** (or equivalent waterproof sealed transition hardware) at the building entry point to provide mechanical anchoring and water sealing at the penetration, even if the cable continues beyond without an indoor cable transition. Answer D correctly identifies that the BET is required at the building entry regardless of indoor run length. The 40-foot run without a separate OFNR cable is within the 50-foot exception, but the BET is not optional. [NEC Article 770.113; ANSI/TIA-758-C §5.2]

---

**Q16.** ANSI/TIA-758-C §6.4 requires a 10-meter slack loop at each splice closure. A contractor argues that 8-meter loops are acceptable because the route uses armor-protected cable that is unlikely to need re-splicing. How should this argument be evaluated?

- A) The argument is valid — armored cable reduces re-splice probability; 8-meter loops are an acceptable deviation for armored routes
- B) The argument is invalid — the 10-meter minimum is a code requirement under NESC and cannot be waived by the contractor **[CORRECT]**
- C) The argument is valid — the 10-meter requirement applies only to unarmored conduit cable
- D) The argument is invalid — the correct minimum is 15 meters for armored direct-bury routes; 8 meters is below the armored-route specification

*Source: [ANSI/TIA-758-C §6.4]*

*Rationale:* ANSI/TIA-758-C §6.4 specifies a **10-meter minimum slack loop at each splice closure** without distinction by cable type, armor status, or route environment. The 10-meter requirement is established to ensure that any cut within the closure's influence zone can be repaired — the cable must be extracted, cut back, and re-spliced, consuming slack. Whether the cable is armored or not does not reduce the physical repair slack needed; armor deters damage but does not make repair impossible when damage occurs. The contractor's argument conflates damage probability with repair logistics. Answer B correctly states that the 10-meter requirement is not waivable by the contractor for this reason. Note: ANSI/TIA-758-C is a standards document, not a safety code (that distinction belongs to NESC/NEC), but Answer B's characterization of the requirement as non-negotiable for a TIA-758-C compliant project is accurate in the context of contracts citing TIA-758-C (as all RUS projects must). [ANSI/TIA-758-C §6.4]

---

### From Lesson 12 — Case Studies

**Q17.** In a RUS-funded FTTH build serving 960 homes, the feeder cable must also carry 6 dedicated SCADA fibers for the co-op's electrical grid. With 32:1 splitters and the BICSI 4× feeder design multiple, what is the minimum total feeder fiber count, and what standard cable configuration meets it?

- A) 120 fibers minimum; 144-fiber standard cable **[CORRECT]**
- B) 120 fibers minimum; 96-fiber standard cable
- C) 30 fibers minimum × 4 = 120 fibers; but SCADA fibers are not included in the BICSI calculation, so 96-fiber cable suffices
- D) 960 fibers — one per home — plus 6 SCADA = 966 fibers; 1,152-fiber ribbon cable required

*Source: [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5; USDA RUS Bulletin 1753F-601]*

*Rationale:* Step 1 — Active FTTH fibers: 960 homes ÷ 32 (splitter) = 30 active FTTH fibers. Step 2 — BICSI 4× multiple: 30 × 4 = 120 FTTH fibers. Step 3 — Add SCADA: 120 + 6 = **126 fibers minimum total**. Step 4 — Standard cable: the next standard configuration above 126 is **144-fiber** (12-tube × 12-FPT or equivalent). 96-fiber (Answer B) is below the 126-fiber minimum. SCADA fibers are not excluded from the total cable fiber count — they are active fibers that must be accommodated in the cable specification. [BICSI OSP-DRD Manual, Ch. 5.5; ANSI/TIA-758-C §5.5]

---

**Q18.** During the storm-hardening retrofit in Case Study C, the ADSS cable is strung to a sag that produces an EDS of 28% RTS at the 15°C reference temperature. IEEE 1222 recommends ≤ 25% RTS. What action is required?

- A) No action — 28% EDS is within a 10% tolerance of the 25% limit
- B) The cable must be re-sagged (re-tensioned) to reduce EDS to ≤ 25% RTS to comply with IEEE 1222 and limit long-term fatigue damage **[CORRECT]**
- C) The cable must be replaced with a higher-rated ADSS cable capable of sustaining 28% EDS without fatigue
- D) The 28% EDS is acceptable in the NESC extreme-wind zone because wind-dominated loading requires higher stringing tension

*Source: [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]*

*Rationale:* IEEE 1222 §5.2 recommends EDS ≤ 20–25% RTS for ADSS cable. At 28% RTS, the cable is over-tensioned: (1) the fatigue margin against Aeolian vibration is reduced — at higher sustained tension, vibration amplitude increases and cumulative fatigue damage in the aramid strength members accumulates more rapidly over the service life; (2) the structural margin against peak ice/wind loading events is reduced. The correct action is **re-sagging the cable** — reducing tension at each span to achieve the target EDS per the manufacturer's sag-tension table at the stringing temperature. Re-sagging is a field adjustment (loosening the dead-ends at the anchor hardware), not a cable replacement. [IEEE 1222 §5.2; NESC C2-2023, Rule 230H]

---

**Q19.** A field audit of the subdivision transition project (Case Study B) confirms that the building entry cable has been installed without a drip loop before the wall penetration. What is the risk of omitting the drip loop, and what is the remediation?

- A) No risk — drip loops are cosmetic and not required by any applicable standard
- B) Without a drip loop, water running down the aerial/riser cable can follow the cable into the wall penetration and enter the building, potentially causing water damage to equipment and the cable entry; remediation is to create a service loop in the exposed exterior cable that dips below the entry penetration before entering the wall **[CORRECT]**
- C) The risk is a NESC clearance violation because the missing drip loop changes the cable's sag geometry
- D) Without a drip loop, the building's NEC Article 770.113 compliance is void — a drip loop is a code requirement for building entry

*Source: [BICSI OSP-DRD Manual, Ch. 6.3; ANSI/TIA-758-C §5.2]*

*Rationale:* A **drip loop** is a downward service loop in the cable at the building entry, positioned so that the cable descends below the entry penetration before turning upward into the wall. Water running down the cable from rain or dew accumulates at the lowest point of the loop and drips off rather than following the cable into the wall penetration. Without the drip loop, capillary action and gravity channel water directly into the penetration — causing water infiltration, condensation in the BET, and long-term moisture damage. BICSI OSP-DRD Manual Ch. 6.3 and ANSI/TIA-758-C §5.2 both specify drip loops at building entries. Remediation: coil a service loop of 12–18 inches in the exterior cable and secure it below the penetration elevation with a cable clamp before the wall entry. [BICSI OSP-DRD Manual, Ch. 6.3; ANSI/TIA-758-C §5.2]

---

**Q20.** In Case Study A (RUS FTTH), a county highway crossing uses directional bore to achieve 36-inch burial depth. After bore completion, the pull crew fails to install the cable within 48 hours and the bore collapses partially due to wet soil conditions. What is the correct sequence of actions?

- A) Attempt to pull the cable through the collapsed bore at higher tension — the cable's RTL of 2,700 N provides sufficient margin
- B) Stop the pull, assess the bore condition, re-bore if needed, and verify burial depth with a depth probe or locator before pulling the new cable **[CORRECT]**
- C) Install the cable through a shallow surface trench cut across the highway to avoid bore costs — the 24-inch minimum applies to highway crossings
- D) Skip the highway crossing; re-route the feeder to avoid the road using an aerial span at the crossing

*Source: [ANSI/TIA-758-C §6.2, §6.3; BICSI OSP-DRD Manual, Ch. 6.2]*

*Rationale:* Pulling a cable through a partially collapsed bore at elevated tension risks cable damage (exceeding RTL if the bore cross-section has narrowed and friction increases sharply) and fiber damage through excessive sidewall pressure at constriction points. The correct actions are: (1) **stop the pull** as soon as obstruction is detected; (2) assess bore condition with a bore camera or pull measurement; (3) **re-bore** the crossing if the bore is obstructed; (4) verify the re-bore achieves the required **36-inch burial depth** at the road crossing per ANSI/TIA-758-C §6.3 before pulling the cable; (5) document burial depth at the crossing in the as-built record. Cutting a surface trench across the highway (Answer C) requires highway authority permits and road restoration — far more expensive and disruptive than re-boring, and the 24-inch minimum does not apply to highway crossings (36 inches is required). Aerial re-routing is an extreme measure inappropriate for a minor bore obstruction. [ANSI/TIA-758-C §6.2, §6.3; BICSI OSP-DRD Manual, Ch. 6.2]

---

### Cross-Topic Integration Questions

**Q21.** A project manager reviews a completed 8-mile OSP feeder installation and finds the as-built package is missing: (1) OTDR traces at 1550 nm, and (2) burial depth records for a 0.5-mile section where the contractor's field crew left the job site without completing documentation. Before the project can be closed out, what must be done?

- A) Estimate the missing burial depth from the contractor's boring machine logs; the 1550 nm OTDR can be waived for routes under 10 miles
- B) Complete the 1550 nm OTDR testing from both ends on all fibers; measure and document burial depths on the undocumented section at ≤ 500-foot intervals **[CORRECT]**
- C) Obtain a signed contractor affidavit certifying burial depth compliance for the undocumented section; add the affidavit to the package in lieu of measurements
- D) Close the project; the 1310 nm OTDR traces and the documented sections meet the majority of TIA-758-C §7 requirements

*Source: [ANSI/TIA-758-C §7; ANSI/TIA-526-7; BICSI OSP-DRD Manual, Ch. 7]*

*Rationale:* ANSI/TIA-758-C §7 establishes project documentation as a specification requirement, not a target. (1) **1550 nm OTDR traces** are required alongside 1310 nm for OS2 cable per ANSI/TIA-526-7 and BICSI OSP-DRD Manual Ch. 7; the traces cannot be waived for short routes. The OTDR must be conducted. (2) **Burial depth records** must cover the full route at ≤ 500-foot intervals per TIA-758-C §7. A contractor affidavit is not a measurement and does not satisfy the specification — the measurement must be made. Excavating test pits at ≤ 500-foot intervals on the 0.5-mile undocumented section and recording depth with a surveyor's tape is the required remediation. Closing the project with incomplete documentation exposes the project owner to warranty and compliance claims if future cable damage occurs. [ANSI/TIA-758-C §7; ANSI/TIA-526-7]

---

**Q22.** A 288-fiber CST-armored feeder cable is being replaced with a 576-fiber ribbon cable on a 12-mile conduit route. The transition closures at each end will connect the old 288-fiber cable to the new 576-fiber ribbon cable. What splice method is required at the transition closures, and what is the maximum acceptable splice loss per fiber pair?

- A) Individual fusion splicing (288 fusion splices per closure); maximum 0.1 dB per splice
- B) Mass-fusion splicing (ribbon rows, 12 fibers at a time); maximum 0.1 dB per splice **[CORRECT]**
- C) Mass-fusion splicing for the ribbon cable side; mechanical splicing for the old 288-fiber cable side; maximum 0.2 dB per splice
- D) The old 288-fiber cable must be converted to ribbon format before splicing; no transition from loose-tube to ribbon is possible at a splice closure

*Source: [BICSI OSP-DRD Manual, Ch. 5.4, Ch. 7.3; ANSI/TIA-758-C §7]*

*Rationale:* Ribbon cable is spliced using **mass-fusion splicers** that splice 12 (or more) fibers simultaneously per ribbon row. At a transition closure between a 288-fiber ribbon cable (new) and a 288-fiber loose-tube cable (old), the ribbon cable side uses mass-fusion splicing (24 rows × 12 fibers = 288 splices in 24 mass-fusion operations). The loose-tube side fibers are individually inserted into the mass-fusion splicer's V-groove array aligned to the ribbon fiber positions — this is a standard mass-fusion transition technique; it does not require converting the loose-tube cable to ribbon format. Maximum acceptable splice loss is **≤ 0.1 dB per fiber pair**, the same specification that applies to all OS2 OSP fusion splices. The splice loss specification does not vary by splice method (mass vs. individual fusion); both methods achieve ≤ 0.1 dB when properly executed. [BICSI OSP-DRD Manual, Ch. 5.4, Ch. 7.3; ANSI/TIA-758-C §7]

---

**Q23.** An OSP engineer is designing a 6-mile feeder route that begins at a hub site in a NESC heavy loading district (0.50 in. radial ice, 4 psf wind). For the first 2 miles, the route is aerial on dedicated fiber poles with no electrical circuits. For the remaining 4 miles, it transitions to direct-bury through rural farmland with documented mole activity. Which integrated cable specification correctly addresses all environmental requirements?

- A) ADSS on energized pole lines for miles 1–2; CST-armored loose-tube OS2 for miles 3–6, both rated for NESC heavy district
- B) Lashed aerial (loose-tube OS2 + galvanized steel messenger, NESC heavy district rated) for miles 1–2; CST-armored loose-tube OS2, gel-fill for miles 3–6; minimum burial depth 24 in. on miles 3–6 **[CORRECT]**
- C) ADSS for miles 1–2; dielectric-armored loose-tube OS2 for miles 3–6 — dielectric armor deters moles
- D) Lashed aerial for miles 1–2; unarmored loose-tube OS2 in Schedule 40 PVC conduit for miles 3–6 — conduit prevents mole access

*Source: [IEEE 1222; NESC C2-2023, Rules 235, 250–251; ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2]*

*Rationale:* **Miles 1–2 (aerial, dedicated fiber poles, no electrical):** ADSS is not required here — the poles carry no energized circuits, eliminating ADSS's primary reason for selection. **Lashed aerial** (loose-tube OS2 lashed to a galvanized steel messenger) is fully appropriate on a dedicated fiber pole line and is often less expensive than ADSS on short aerial segments. The messenger must be rated per NESC Table 235-5 for the heavy loading district. ADSS (Answer A) is over-specified for a non-energized pole line — not wrong, but not required. **Miles 3–6 (direct-bury, documented mole activity):** CST armor provides effective mechanical deterrence against mole gnawing — steel is the standard solution per AFL OSP Cable Design Guide §5.2 and ANSI/TIA-758-C §5.6. Dielectric armor (Answer C) provides no meaningful deterrence to burrowing moles — dielectric armor is specified for electrical hazard proximity, not rodent deterrence. Conduit and unarmored cable (Answer D) uses PVC conduit gnawable by moles in sustained attack. Minimum burial depth: 24 inches in agricultural farmland per ANSI/TIA-758-C §6.3. [NESC C2-2023, Rule 235; ANSI/TIA-758-C §5.6; AFL OSP Cable Design Guide, §5.2]

---

**Q24.** A fiber distribution terminal (FDT) is located 280 meters from the FDH on a distribution cable route. A field crew is installing slack loops at the FDT location. The ANSI/TIA-758-C §6.4 requirement for cable slack at an FDT termination (not a splice closure) is 3 meters. The crew has left 1.5 meters of cable. What must be done?

- A) 1.5 meters is acceptable — the 3-meter requirement applies only to splice closures, not FDT terminations
- B) Pull additional cable from the distribution route to achieve a minimum 3-meter slack at the FDT termination **[CORRECT]**
- C) 1.5 meters is acceptable for an FDT — the 3-meter requirement is for FDH locations only
- D) The 3-meter requirement can be waived if the FDT is within 300 meters of the FDH

*Source: [ANSI/TIA-758-C §6.4]*

*Rationale:* ANSI/TIA-758-C §6.4 requires a minimum of **3 meters of cable slack at FDH and FDT termination points**. The 3-meter requirement at FDTs provides working length for re-termination of the distribution cable if the connector or splice tray must be repositioned within the FDT enclosure, or if the FDT must be relocated slightly within its mounting footprint. 1.5 meters is below the 3-meter minimum. The crew must pull additional cable from the distribution route slack coil (or from the nearest accessible pull point) to achieve the required 3-meter minimum. The requirement is not limited to splice closures (which have a higher 10-meter minimum) or FDH locations; it applies to FDT termination points as explicitly stated in §6.4. [ANSI/TIA-758-C §6.4]

---

**Q25.** A BICSI OSP-DRD candidate is reviewing a design package for completeness before construction begins. The package contains: a route drawing, a cable schedule, an optical power budget calculation, and a splice closure placement plan. Which required pre-construction deliverable is missing?

- A) Burial depth measurement records — these must be completed before construction
- B) OTDR test traces — pre-construction fiber testing is required before installation
- C) Fiber assignment table — mapping each fiber to its circuit or dark-fiber reserve status **[CORRECT]**
- D) The package is complete — all four required BICSI OSP-DRD pre-construction deliverables are present

*Source: [BICSI OSP-DRD Manual, Ch. 8]*

*Rationale:* BICSI OSP-DRD Manual Chapter 8 defines the required pre-construction design deliverable set. The five core deliverables are: (1) route drawing, (2) cable schedule, (3) **fiber assignment table**, (4) optical power budget calculation, and (5) splice closure placement plan. The **fiber assignment table** — mapping each fiber in each cable segment to its intended circuit assignment or dark-fiber reserve status — is absent from the described package. Burial depth records (Answer A) are an as-built (post-construction) deliverable, not a pre-construction deliverable. OTDR traces (Answer B) are a post-installation acceptance test deliverable. The package as described is missing the fiber assignment table; Answer D is incorrect. [BICSI OSP-DRD Manual, Ch. 8]

---

*=== CABLE SELECTION TOPIC FINAL EXAM — QUESTION BANK END ===*

*Pass threshold: 18 of 25 correct (72%, rounded to 70% minimum).*
*Total questions: 25.*
*Randomization: applied at Moodle import — question order and answer option order are randomized for each learner attempt.*
*Review mode: rationale text is displayed during review after exam submission; rationale is not displayed during the exam attempt.*
