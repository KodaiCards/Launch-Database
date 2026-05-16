# OSP Training Research — Trusted Sources Allowlist

> Locked 2026-05-16. Every research agent dispatched for OSP-RW.4/.5/.6/.7 topic briefs MUST cite from this allowlist with section/clause numbers. RT verifies every citation exists + matches the claim. Hallucinations of section numbers will be caught.

## Primary anchors (RUS / RUS-program)

- **RUS Bulletin 1751F-630** — Aerial Plant Engineering Design + Construction
- **RUS Bulletin 1751F-635** — Buried Plant Engineering Design + Construction
- **RUS Bulletin 1751F-810** — Electrical Protection of Communication Facilities
- **RUS Bulletin 1724E-150** — Design Guide for Rural Electric Distribution Lines (aerial plant design, pole loading, construction standards; public USDA PDF at rural.eda.gov / energy.nih.gov). Primary use: pole loading design commentary, NESC loading district values, aerial span engineering. URL: https://www.rd.usda.gov/files/1724e-150.pdf
- **RUS Bulletin 1751F-815** — Bonding & Grounding (verify current state — may be incorporated into 810 or separate)
- **RUS Bulletin 1738** — Electric Borrowers Program (NOT the distance-learning bulletin — that's 7 CFR Part 1703)
- **7 CFR Part 1755** — RUS Telecommunications Standards
- **7 CFR Part 1740** — Distance Learning + Telemedicine Grant (separate from 1738)

## NESC (National Electrical Safety Code)

- **NESC C2-2023** (current edition; mark `[confirm edition]` for clauses not directly verifiable without paywalled access)
- Sections most relevant to OSP:
  - **Section 09** — Grounding methods for electric supply and communication systems
  - **Section 23** — Clearance (vertical / horizontal / over roadways)
  - **Section 24** — Strength requirements (pole loading, sag, tension)
  - **Section 25** — Loading districts (Light/Medium/Heavy/Extreme Wind)
  - **Section 27** — Line construction requirements for energized conductors
  - **Rule 232** — Vertical clearances of conductors above ground/rail/water
  - **Rule 235** — Clearance between conductors of different circuits / utilities

## BICSI

- **BICSI Outside Plant Design Reference Manual (OSPDR)** — primary OSP design reference; cite chapter + section
- **BICSI Telecommunications Distribution Methods Manual (TDMM) 15th Edition** — for RCDD-prep topics (chapter + section)
- **BICSI Information Transport Systems Installation Methods Manual (ITSIMM)** — for cabling installation specifics
- **BICSI OSP Designer Candidate Handbook** — exam blueprint for C01

## FOA (Fiber Optic Association)

- **FOA Reference Guide to Fiber Optics** (Hayes, current edition) — general fiber engineering practice
- **FOA Online Reference Guide** (foa.org/tech/ref/index.html) — public, current
- **FOA Certification standards** for CFOS/CFOT/CFOS-O/CFOS-T (foa.org/cert/)

## TIA / ANSI

- **TIA-568.3-D** — Optical Fiber Cabling Components Standard (OM1-OM5, OS1-OS2; includes §6 interconnect vs. cross-connect, jacket color table). Scope: T19 (interconnect/cross-connect distinction at CO patch panel); T03.L05b (OM1–OM5 jacket color convention — book vs. field OM3/OM4 aqua/magenta divergence)
- **TIA-598-C** — Optical Fiber Cable Color Coding
- **TIA-606-D** — Administration Standard for Telecommunications Infrastructure
- **TIA-607-D** — Generic Telecommunications Bonding and Grounding for Customer Premises (§4 definitions: TBB/TGB/TMGB/PBB/SBB; §7 GES tie-in; §8 TBB conductor sizing; §9 TMGB placement; §10 TGB). Scope: T19.L06 (headend grounding vocabulary — TGB, TBB, TMGB, IBT-entry); T14.L05 (full TIA-607 grounding-chain design). Paywalled — TIA. [allowlist-pending-confirmation — paywalled; confirm edition is TIA-607-D current as of 2026] `[verify — TIA updates on ~5-year cycle]`
- **TIA-758-C** — Customer-Owned Outside Plant Telecommunications Infrastructure
- **TIA-942-C** — Telecommunications Infrastructure Standard for Data Centers (§5 architecture — MER/TR/EDA spaces; §6 infrastructure/cabling; Rated 1–4 redundancy tiers). Scope: T19 (CO/headend = MER-equivalent; redundancy tier awareness for feeder diversity design decisions). Paywalled. [allowlist-pending-confirmation — paywalled; confirm current edition]
- **TIA-526-14B** — Optical Power Loss Measurements of Installed Multimode Fiber Cable Plant
- **TIA-526-7A** — Optical Power Loss Measurements of Installed Single-Mode Fiber Cable Plant
- **TIA-492AAAC** — Detail Specification for 50µm OM3 multimode fiber
- **TIA-492AAAA** — Detail Specification for 62.5µm OM1 multimode fiber. Scope: T03.L05b (OM1 cable product context — max 33 m at 10GbE, legacy grade, do not specify for new 10G+ work). Paywalled — TIA. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as TIA standard, paywalled — 2026-05-16]`
- **TIA-492AAAB** — Detail Specification for 50µm OM2 multimode fiber. Scope: T02.L08 (OM1/OM2 Flashcard patch); T03.L05b (OM2 cable product context — max 82 m at 10GbE, legacy grade, same orange jacket as OM1 = field hazard). Paywalled — TIA. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as TIA standard, paywalled — 2026-05-16]`
- **TIA-492AAAD** — Detail Specification for 50µm OM4 multimode fiber (EMB = 4700 MHz·km, max 400 m at 10GbE). Scope: T02.L08 (already informally cited; formally added here); T03.L05b (OM4 cable product context). Paywalled — TIA. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as TIA standard, paywalled — 2026-05-16]`
- **TIA-492AAAE** — Detail Specification for 50µm OM5 (wideband multimode) fiber (EMB = 28000 MHz·km @ 953 nm; SWDM4 design; lime green jacket). Scope: T02.L08 (already informally cited; formally added here); T03.L05b (OM5 cable product context). Paywalled — TIA. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as TIA standard, paywalled — 2026-05-16]`

## ITU-T

- **G.652D** — Standard SMF (most common for OSP)
- **G.655** — Non-Zero Dispersion-Shifted SMF (NZ-DSF). Scope: carrier DWDM backbone fiber where chromatic dispersion is partially canceled by the shifted zero-dispersion wavelength; relevant to T02.L08 (G.655 paragraph — context for why carrier networks use this vs. G.652.D) and T02.L07b (long-haul awareness). [allowlist-pending-confirmation — paywalled ITU-T; confirm current edition]
- **G.657** — Bend-Insensitive SMF (2016 edition)
- **G.984.x** — GPON family
- **G.987.x** — XG-PON
- **G.989.x** — NG-PON2
- **ITU-T G.694.1** — Spectral grids for WDM applications: DWDM frequency grid. Defines DWDM channel center frequencies (anchored at 193.1 THz / 1552.52 nm) and channel spacing (100 GHz / 50 GHz / 12.5 GHz flexible). C-band: ~1530–1565 nm; L-band: ~1565–1625 nm. Scope: T02.L07b (long-haul awareness — DWDM channel grid concept; why feeder design must consider DWDM if CO terminates on carrier long-haul). Paywalled — ITU-T; secondary via Cisco WDM Design Guide, Corning DWDM white papers. [allowlist-pending-confirmation — paywalled; confirm current edition; use secondary public sources for OSP-awareness teaching] `[verified as ITU-T standard, paywalled — 2026-05-16]`
- **ITU-T G.671** — Transmission characteristics of optical components and subsystems (WDM multiplexers, demultiplexers, OADMs, optical amplifiers). Defines insertion loss, passband, and isolation specs for WDM passive components. Scope: T02.L07b (mux/demux concept — what a DWDM mux does to channels, insertion loss per channel). Paywalled — ITU-T. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as ITU-T standard, paywalled — 2026-05-16]`
- **ITU-T G.698.2** — Amplified multichannel dense WDM applications with optical amplifiers at network nodes (defines optical interface specs for 10G/40G/100G coherent DWDM systems). Scope: T02.L07b (coherent optics awareness — 100G+ per channel on G.652.D fiber). Paywalled — ITU-T. For OSP-awareness teaching, primary cite should be FOA Reference Guide (public) with G.698.2 cited by name as the standard with `[paywalled — confirm edition]`. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as ITU-T standard, paywalled — 2026-05-16]`

## IEC

- **IEC 61300-3-35** — Fibre optic interconnecting devices and passive components — End-face quality assessment
- **IEC 61753-1** — Performance standard for fibre optic interconnecting devices + passive components (mark `[confirm edition]`)
- **IEC 60793-2-10** — Optical fibres — Part 2-10: Product specifications — Sectional specification for category A1 (OM1–OM5 multimode fibres). Defines the IEC classification scheme for OM-grade multimode fiber (core/cladding geometry, bandwidth, attenuation). TIA-492 series adopts this classification. Scope: T03.L05b (OM-grade cable-product context at OSP↔ISP handoff — the IEC classification anchor for OM1–OM5). Paywalled — IEC. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as IEC standard, paywalled — 2026-05-16]`

## OSHA

- **29 CFR 1904** — Recording and Reporting Occupational Injuries and Illnesses (full subpart; contains 1904.7 recordable-incident definition, 1904.29–1904.32 OSHA 300/300A/301 forms, 1904.39 fatality/severe-injury reporting). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1904 [public eCFR]. Scope: T18 incident-reporting lesson (T18.L09); downstream topics covering construction QA documentation.
- **29 CFR 1910.28** — Duty to have fall protection — Walking-working surfaces (general industry). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-D/section-1910.28 [public eCFR]. Scope: T18.L04 fall-protection trigger height comparison (4-ft general industry vs. 6-ft construction); T07 (Staking) and T08 (Make-Ready) aerial-lift and pole-climbing lessons.
- **29 CFR 1910.67** — Vehicle-mounted elevating and rotating work platforms (aerial lifts / bucket trucks). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-F/section-1910.67 [public eCFR]. Scope: T18.L04 aerial-lift fall-protection requirement (body harness + lanyard attached to boom/basket per 1910.67(c)(2)(v)); T07 and T08 bucket-truck work lessons.
- **29 CFR 1910.132–1910.138** — PPE — General requirements through eye and face protection (Subpart I). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-I [public eCFR]. Scope: T18.L05 PPE hazard-assessment requirement (1910.132(d)(1)); employer responsibility to provide PPE at no cost; all downstream topics referencing PPE selection.
- **29 CFR 1910.136** — Foot protection. Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-I/section-1910.136 [public eCFR]. Scope: T18.L05 EH-rated boot requirement; references ASTM F2412/F2413 as the test/performance standard; T10 (Construction) foot-hazard callouts.
- **29 CFR 1910.137** — Electrical protective equipment (rubber insulating gloves and other insulating tools). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-I/section-1910.137 [public eCFR]. Scope: T18.L05 rubber insulating glove Class 00–4 voltage ratings; T18.L07 MAD/PPE discussion; T14 (Grounding) energized-work protective equipment.
- **29 CFR 1910.140** — Personal fall protection systems. Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-I/section-1910.140 [public eCFR]. Scope: T18.L04 harness, lanyard, and SRL system requirements for general industry; T07 (Staking) and T13 (Inspection) pole-top and aerial-lift fall protection.
- **29 CFR 1910.146** — Permit-required confined spaces. Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-J/section-1910.146 [public eCFR]. Scope: T18.L03 confined-space entry; 1910.146(b) definition of acceptable O₂ range (19.5%–23.5%); provides the backup standard when hazards cannot be controlled under 1910.268(o) for extreme-contamination manholes.
- **29 CFR 1910.147** — Lockout/tagout (LOTO)
- **29 CFR 1910.268** — Telecommunications (Subpart R). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-R/section-1910.268 [public eCFR]. Scope: Primary OSHA standard for all OSP field work; 1910.268(a) scope, (g)(1) fall protection at poles, (h)(8) ladder requirement, (o) manhole atmospheric testing and ventilation. Foundation of T18; referenced by T04, T07, T08, T10, T13, T14.
- **29 CFR 1910.269** — Electric power generation, transmission, and distribution (covers utility/contractor work near energized)
- **29 CFR 1910.333** — Selection and use of work practices
- **29 CFR 1910.1000** — Air contaminants — Table Z-1 permissible exposure limits (PELs). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-Z/section-1910.1000 [public eCFR]. Scope: T18.L08 hazardous materials; battery acid (sulfuric acid) PEL = 1 mg/m³ TWA per Table Z-1; general PEL reference for T10 (Construction) chemical-handling callouts.
- **29 CFR 1910.1053** — Respirable crystalline silica. Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-Z/section-1910.1053 [public eCFR]. Scope: T18.L08 silica dust from concrete/asphalt cutting; current PEL = 50 µg/m³ TWA (2016 rule — supersedes the former 100 µg/m³ pre-2016 PEL); T10 (Construction) road-cut and bore operations.
- **29 CFR 1910.1200** — Hazard Communication (HazCom 2012). Authority: OSHA. URL: https://www.ecfr.gov/current/title-29/subtitle-B/chapter-XVII/part-1910/subpart-Z/section-1910.1200 [public eCFR]. Scope: T18.L01 and T18.L08 SDS requirements; GHS-aligned 16-section SDS format; employer obligation to maintain SDS files accessible to all workers; T10 (Construction) chemical-handling training.
- **29 CFR 1926.1404-1442** — Cranes/derricks in construction
- **29 CFR 1926 Subpart V** — Power transmission and distribution

## Federal Statutes

- **OSH Act § 5(a)(1)** — Occupational Safety and Health Act of 1970, Section 5(a)(1): General Duty Clause. Authority: U.S. Congress / OSHA. URL: https://www.osha.gov/laws-regs/oshact/section5 (public OSHA.gov) or https://www.law.cornell.edu/uscode/text/29/654 (public Cornell LII). [public]. Scope: T18.L01 foundational employer obligation to provide a workplace free from recognized hazards; cited whenever a specific OSHA standard does not directly cover a known hazard (e.g., novel situations not enumerated in 1910.268).

## FHWA / Traffic Control

- **MUTCD 11th Edition (2023), Part 6** — Manual on Uniform Traffic Control Devices, Part 6: Temporary Traffic Control. Authority: FHWA (Federal Highway Administration). URL: https://mutcd.fhwa.dot.gov (public, free PDF) [public FHWA]. Scope: T18.L06 temporary traffic control zone requirements; Chapter 6A general TTC principles; Chapter 6E flagger control (STOP/SLOW paddle, flagger positioning); Table 6C-1 advance warning sign spacing; Class 2/3 hi-vis apparel references. T07 (Staking) and T10 (Construction) roadway-shoulder work zones.

## FCC / Pole Attachment

- **47 CFR Part 1.1401-1.1424** — Pole attachment rules
- **FCC 18-111** (One-Touch Make-Ready / OTMR Order)

## Federal Regulations / Telecom & RUS

- **47 CFR Part 32 — Uniform System of Accounts (USOA) for telecommunications companies.** Authority: FCC. URL: https://www.ecfr.gov/current/title-47/chapter-I/subchapter-B/part-32 [public eCFR — primary anchor, publicly available]. Citation rule: cite specific subsections (e.g., § 32.2210 for plant accounts — cable and wire; § 32.2420 for poles; § 32.2220 for land and land rights; § 32.27 for records retention). Scope: T04.L07 (plant-account coding + record retention for RUS borrowers); T09 (permitting cost allocation); any lesson covering survey cost recording, materials accounting, or RUS loan audit exposure.
- **RUS Form 740 — Contractor's Statement and Acknowledgment (Telecommunications).** Authority: USDA Rural Development / RUS. URL: https://www.rd.usda.gov/resources/forms [public domain — USDA RD forms repository]. Status: Standard RUS procurement form; used by contractors to acknowledge contract terms, certify compliance, and provide required contractor certifications for RUS-funded telecommunications construction projects. Citation rule: cite as "RUS Form 740" — cite specific fields or blocks if referencing a particular certification requirement. Scope: T04.L09 (RUS pre-engineering construction package — contractor certification documentation); T10 (Construction) contractor procurement on RUS projects; any lesson covering RUS-funded contractor engagement and pre-construction documentation.
- **RUS Form 307 — Telephone Loan Account (Construction and Operation Report).** Authority: USDA Rural Development / RUS. URL: https://www.rd.usda.gov/resources/forms [public domain — USDA RD forms repository]. Status: Standard RUS reporting form; used by RUS telecommunications borrowers to report construction progress and costs against the approved loan budget. Citation rule: cite as "RUS Form 307" for construction reporting obligations. Scope: T04.L09 (RUS pre-engineering construction package and loan-reporting requirements); T09 (permitting and project documentation for RUS-program closeout); any lesson covering RUS loan construction reporting obligations.

## Federal Regulations / Aviation

- **FAA 14 CFR Part 107 — Small Unmanned Aircraft Systems.** Authority: FAA (Federal Aviation Administration). URL: https://www.ecfr.gov/current/title-14/chapter-I/subchapter-F/part-107 [public eCFR — primary anchor, publicly available]. Status: Primary federal regulation governing commercial drone (UAS) operations in the United States. Citation rule: cite specific subsections (e.g., 107.31 visual line of sight; 107.41 controlled airspace authorization; 107.51 performance-based operational limitations; 107.23 reckless operation prohibition). Scope: T04.L02 (commercial drone survey operations — FAA authorization, airspace classification, LAANC process); T04.L10 (capstone quiz questions on airspace and authorization); any lesson referencing commercial UAS operations in OSP corridor survey.

## Geospatial / Standards Secondary

- **USGS National Geodetic Survey (NGS) — Coordinate Reference System documentation.** Authority: USGS / NOAA NGS. URL: https://www.ngs.noaa.gov [public domain, USGS/NOAA]. Primary on geodetic datums (NAD83, NAD27, NAVD88); horizontal and vertical datum definitions; state-plane coordinate system grids. Citation rule: cite by datum name and version (e.g., NAD83(2011) epoch 2010.0; NAVD88). Scope: T04.L03 (GIS landbase creation, coordinate-system choice, datum-mismatch detection); any lesson referencing survey control, benchmarks, or CRS declarations.
- **NOAA NGS CORS — Continuously Operating Reference Stations.** Authority: NOAA National Geodetic Survey. URL: https://www.ngs.noaa.gov/CORS/ [public domain, NOAA]. RTK accuracy specifications: sub-decimeter horizontal (typically 1–3 cm + 1 ppm baseline) when using a network-corrected CORS solution. Citation rule: cite as "NOAA NGS CORS technical documentation" + reference the RTK accuracy specification from the NGS CORS user guide (publicly available at the URL above). Scope: T04.L02 (RTK GNSS positional accuracy for pole and route-survey measurements); any lesson covering GPS/GNSS survey accuracy standards.
- **ISO/IEC 19005-1 — PDF/A Archival Format.** Authority: ISO (International Organization for Standardization) / IEC. URL: https://www.iso.org/standard/38920.html (paywalled standard; abstract publicly viewable). [paywalled — secondary citation required]. Secondary paths: Adobe and RUS borrower guidance documents reference PDF/A (ISO 19005-1) for archival submissions; FCC filing guidelines reference PDF/A for electronic filings. Status: International standard for long-term archival of electronic documents; embeds fonts, color profiles, and metadata; prohibits external references. Citation rule: cite as "ISO/IEC 19005-1 (PDF/A standard)" — do not hardcode revision letter without `[confirm edition]`. Scope: T04.L06 (archival deliverable format for RUS-program engineering submissions); any lesson referencing long-term document storage or regulatory submission format requirements.
- **OGC KML Standard 2.3 — Keyhole Markup Language.** Authority: Open Geospatial Consortium (OGC). URL: https://www.ogc.org/standards/kml [public — OGC open standard]. Status: Publicly available standard; defines the XML syntax for KML geographic data and the KMZ compressed format. Citation rule: cite as "OGC KML Standard 2.3" for format specification claims (e.g., compressed KMZ structure, placemark schema). Scope: T04.L06 (KMZ file format for field-crew and client presentation deliverables); T04.L10 (capstone quiz on deliverable format selection); any lesson covering GIS deliverable file formats.
- **ESRI Shapefile Technical Description — Shapefile Format Specification.** Authority: ESRI (Environmental Systems Research Institute). URL: https://support.esri.com/en/technical-article/000001272 [publicly available technical white paper — vendor-published]. Status: Vendor-published technical reference; defines the four-file shapefile structure (.shp geometry, .shx index, .dbf attributes, .prj coordinate system). Citation rule: cite as "ESRI Shapefile Technical Description" for format-component claims (.SHP/.SHX/.DBF/.PRJ requirement). Scope: T04.L06 (shapefile deliverable format and companion-file requirement); T04.L03 (shapefile as GIS layer format for landbase creation); any lesson covering OSP survey data handoff in shapefile format.
- **FGDC — Federal Geographic Data Committee Metadata Standards.** Authority: Federal Geographic Data Committee (FGDC), U.S. Government. URL: https://www.fgdc.gov/metadata [public domain — FGDC]. Status: Federal standard for geospatial metadata (FGDC-STD-001); required for federally funded geospatial data products including RUS-program surveys. Citation rule: cite as "FGDC Content Standard for Digital Geospatial Metadata (FGDC-STD-001)" for metadata field requirements. Scope: T04.L03 (coordinate-system documentation and metadata fields in GIS landbase deliverables); any lesson referencing federally compliant geospatial data documentation for RUS-program projects.

## USACE / Permitting

- **Nationwide Permit (NWP) 57** — Electric Utility Line + Telecommunications Activities (post-2021 reissuance; replaces former NWP 12 scope for telecom)
- **NWP 12** — Oil/Gas Pipelines ONLY (post-2021)
- **33 CFR Part 320-332** — Section 10 / Section 404 permit framework

## State / Federal Environmental

- **40 CFR Part 1500-1508** — NEPA implementing regulations
- **54 USC § 306108** (Section 106) — Historic preservation review
- **16 USC § 1531-1544** (Endangered Species Act) — ESA

## NEC / NFPA

- **NEC NFPA 70-2023** — National Electrical Code; cite article + section (e.g., NEC 250.52(A)(3) for Ufer electrode)
- **NFPA 70E** — Standard for Electrical Safety in the Workplace
- **NFPA 75** — Standard for the Fire Protection of Information Technology Equipment. Defines fire suppression system requirements and prevention measures for IT equipment rooms. Scope: T19.L05 (CO/hut fire suppression awareness — clean-agent vs. pre-action sprinkler selection for equipment rooms). Paywalled — NFPA. [allowlist-pending-confirmation — paywalled; confirm current edition (NFPA publishes editions on ~4-year cycle)] `[verified as NFPA standard — publicly indexed, paywalled — 2026-05-16]`
- **NFPA 76** — Standard for the Fire Protection of Telecommunications Facilities. Specifically governs CO/hut/headend fire suppression systems — clean-agent suppression types (FM-200/Novec 1230), pre-action sprinkler systems, suppression system zoning, and detection requirements for telecom equipment spaces. Scope: T19.L05 (CO fire suppression awareness — NFPA 76 is the primary standard for telecom facilities, directly applicable to headend/CO design). Paywalled — NFPA. [allowlist-pending-confirmation — paywalled; confirm current edition] `[verified as NFPA standard — publicly indexed, paywalled — 2026-05-16]`
- **NFPA 110** — Standard for Emergency and Standby Power Systems (2022 edition). §8.4: generator test schedule requirements — §8.4.1 weekly load test under load (30% rated minimum), §8.4.2 monthly transfer exercise, §8.4.3 annual full-load test. Scope: T19.L04 (battery backup and generator transfer — NFPA 110 generator test schedule as the book standard; book-vs-field divergence: real rural hut test schedules slip to "before storms"). [allowlist-pending-confirmation — paywalled; publicly indexed via NFPA.org] `[verified as NFPA standard, 2022 edition publicly confirmed — 2026-05-16]`

## ANSI / ICEA

- **ANSI O5.1** — Wood Poles — Specifications and Dimensions
- **ANSI/ISEA 107** [confirm edition] — High-Visibility Safety Apparel and Headwear. Authority: ANSI/ISEA. URL: https://safetyequipment.org (paywalled). [paywalled — secondary citation required]. Secondary paths: MUTCD Part 6 Chapter 6E (free FHWA PDF) references Class 2 minimum for daytime roadway work; OSHA outreach materials confirm Class 3 for nighttime/high-speed zones. Scope: T18.L05 and T18.L06 hi-vis vest class requirements; T10 (Construction) traffic-zone PPE; T07 (Staking) roadway-shoulder work.
- **ANSI/ISEA Z89.1-2014 (R2019)** — American National Standard for Industrial Head Protection. Authority: ANSI/ISEA. URL: https://safetyequipment.org (paywalled). [paywalled — secondary citation required]. Secondary paths: OSHA Safety and Health Information Bulletin (SHIB) on safety helmets (osha.gov) + OSHA 29 CFR 1910.268(b) PPE table both confirm Class E = 20,000V / Class G = 2,200V / Class C = no electrical protection. Scope: T18.L05 hard hat electrical-class selection for joint-use pole work; T07 (Staking) and T14 (Grounding) electrical-proximity PPE callouts.
- **ANSI Z87.1** [confirm edition] — Occupational and Educational Personal Eye and Face Protection Devices. Authority: ANSI/ISEA. URL: https://safetyequipment.org (paywalled). [paywalled — secondary citation required]. Secondary path: 29 CFR 1910.133 (public eCFR) references ANSI Z87.1 as the required standard for eye and face protection; OSHA 1910.268(b) PPE table confirms safety glasses required for climbing and overhead work. Scope: T18.L05 safety eyewear requirement for OSP field work; T07 (Staking), T08 (Make-Ready), T10 (Construction) overhead-hazard callouts.
- **ANSI Z359.11** [confirm edition] — Safety Requirements for Full Body Harnesses. Authority: ANSI/ASSE. URL: https://webstore.ansi.org (paywalled). [paywalled — secondary citation required]. Secondary paths: OSHA 29 CFR 1910.140(c)(1) (public eCFR) requires full-body harnesses for PFAS; OSHA fall protection eTool (osha.gov) describes harness specification requirements consistent with Z359.11. Scope: T18.L04 full-body harness vs. body-belt distinction for pole-top fall arrest; T07 (Staking) and T13 (Inspection) fall arrest system selection.
- **ANSI Z359.14** [confirm edition] — Safety Requirements for Self-Retracting Devices (SRDs). Authority: ANSI/ASSE. URL: https://webstore.ansi.org (paywalled). [paywalled — secondary citation required]. Secondary paths: OSHA 29 CFR 1910.140(c)(3) (public eCFR) addresses SRL/SRD performance requirements; OSHA fall protection eTool describes SRL function and deployment criteria. Scope: T18.L04 SRL selection and deployment for pole-top and aerial-lift work; T07 (Staking) 100%-tie-off policy implementation.
- **ICEA S-87-640** — Standard for Optical Fiber Outside Plant Communications Cable
- **ANSI/ATIS-0600336** — Network Equipment-Building System (NEBS) Generic Physical Design Requirements

## ASTM

- **ASTM D120** — Standard Specification for Rubber Insulating Gloves. Authority: ASTM International. URL: https://www.astm.org/d0120-14ae01.html (paywalled). [paywalled — secondary citation required]. Secondary paths: 29 CFR 1910.137 (ecfr.gov, primary OSHA reg) and OSHA eTool on Electric Power (osha.gov/etools/electric-power) both confirm Class 00–4 voltage ratings. Scope: T18.L05 PPG glove class–voltage mapping; T18.L07 MAD discussion; T14 (Grounding) energized-work hand protection.
- **ASTM F2412 / ASTM F2413** — Standard Test Methods and Standard Specification for Performance Requirements for Protective (Safety) Toe Cap Footwear (EH-rated boots). Authority: ASTM International. URL: https://www.astm.org (paywalled). [paywalled — secondary citation required]. Secondary path: 29 CFR 1910.136 (public eCFR) explicitly references ASTM F2412/F2413 as the required test/performance standard for foot protection. Scope: T18.L05 dielectric/EH-rated boot requirements; T10 (Construction) footing-hazard PPE callouts.

## IEEE

- **IEEE 81** — Measuring Earth Resistance, Earth Surface Potentials, and Earth Surface Conductivity
- **IEEE Std 142** — Grounding of Industrial and Commercial Power Systems
- **IEEE 802.3** — Ethernet (relevant for premise interface)
- **IEEE Std 487** — IEEE Recommended Practice for the Protection of Wire-Line Communication Facilities Serving Electric Supply Locations. Scope: Ground potential rise (GPR) at CO/headend entry — relevant to T19.L06 (primary protector design at building entry) and T14 (GPR protection coordination). Paywalled; secondary citations via IEEE Xplore abstracts + FOA GPR protection field guides. [allowlist-pending-confirmation — paywalled; confirm current edition at IEEE Xplore] `[verify via secondary: industry GPR protection guides]`

## NIOSH / CDC

- **NIOSH Hierarchy of Controls** — NIOSH (National Institute for Occupational Safety and Health), CDC. URL: https://www.cdc.gov/niosh/topics/hierarchy/ [public]. Authority: NIOSH/CDC. Scope: T18.L01 hierarchy of controls foundational model (Elimination → Substitution → Engineering → Administrative → PPE); referenced as the authoritative framework underlying OSHA's PPE-last approach; T07, T08, T10 hazard-control planning.

## Telcordia / ATIS (CO Equipment Standards)

- **Telcordia GR-63-CORE** — NEBS (Network Equipment-Building System) Physical Protection Requirements (equipment environmental specs: seismic, temperature, humidity, airborne contaminants; also covers battery plant and power distribution requirements for CO-grade equipment). Scope: T19.L03 (–48VDC power plant — NEBS as the standards framework requiring CO equipment to run on –48VDC; battery reserve minimum per GR-63-CORE §4.1.4); T19.L02 (OLT/CMTS as NEBS-rated black boxes). Paywalled — Telcordia/ATIS. Secondary: ANSI/ATIS-0600336 (public) references NEBS requirements; BICSI TDMM §10.4 discusses battery backup duration. [allowlist-pending-confirmation — paywalled; verify via secondary ANSI/ATIS-0600336 for public-accessible NEBS framing] `[verified as Telcordia/ATIS standard — 2026-05-16]`
- **Telcordia GR-1089-CORE** — NEBS Electromagnetic Compatibility and Electrical Safety Requirements for Telecommunications Network Equipment (EMC, ESD protection, grounding/bonding requirements for CO-grade equipment). Scope: T19 (EMC context for CO headend equipment — why equipment is grounded/bonded in a CO; complement to GR-63-CORE physical protection). Paywalled — Telcordia/ATIS. [allowlist-pending-confirmation — paywalled; verify via secondary ANSI/ATIS-0600336] `[verified as Telcordia/ATIS standard — 2026-05-16]`

## BICSI (Data Center / Facilities Design)

- **BICSI 002-2024** — Data Center Design and Implementation Best Practices (includes N+1 string redundancy recommendation for battery plants; HVAC redundancy guidance for critical telecom facilities; rack layout best practices). Scope: T19.L04 (battery backup — BICSI 002 N+1 string recommendation as the book standard; book-vs-field: N+1 is routinely waived for small rural FTTH headends on cost grounds); T19 generally (CO design best practices awareness). Paywalled — BICSI. [allowlist-pending-confirmation — paywalled; confirm current edition is 2024] `[verified as BICSI standard — 2026-05-16]`

## Standards Bodies / Other

- **AHJ (Authority Having Jurisdiction)** — state DOT, county/city, utility commission — mark as authoritative for jurisdiction-specific clearances
- **State PUC / DOT manuals** (cite specific state if used)

## Citation rules for research agents

1. **Mandatory format:** every factual claim with a number, threshold, or procedure MUST include `(Source: <doc> §<section>)` after the claim
2. **`[confirm edition]` marker** for any standard where the exact current edition isn't independently verifiable (TIA standards update frequently; NESC every 5 years)
3. **No citations not on this allowlist.** If a research agent finds a relevant source NOT on the list, flag it in the research brief's "proposed additions to allowlist" section — orchestrator reviews + adds.
4. **NO Wikipedia, blog posts, vendor marketing.** Vendor datasheets (Corning, OFS, CommScope, AFL, Belden, Panduit) are acceptable for product-specific technical specs ONLY (e.g., "Corning SMF-28 attenuation typically X dB/km"). Vendor opinion / best-practice posts are NOT.
5. **Field practice claims** (Book-vs-field divergence per Carter's training-voice rule) — cite the field practice with at least one industry-experienced source (e.g., RUS field operations manual, FOA reference guide field practice section, BICSI installation case studies, state DOT design manual). Field practice WITHOUT citation = flagged by RT.

## RT verification protocol

For each research brief:
1. RT-A pulls every citation, attempts to confirm it exists (WebSearch for the document + section)
2. RT-A reports VERIFIED / NOT-FOUND / WRONG-SECTION per citation
3. RT-B independently re-derives any math/threshold claims and verifies they match the cited source's value
4. RT-A + RT-B reports cross-checked by orchestrator
5. Findings: any HALLUCINATED citation → block author dispatch + redo research; any wrong section → flag for correction; minor inconsistencies → batch into author wave as known patches.

## Paywalled / inaccessible sources rule (added 2026-05-16, Carter)

Some primary sources are paywalled (NESC C2, BICSI OSPDR/TDMM, FOA full Reference Guide, ITU-T historical recommendations). When the citation can't be independently verified by hitting the source:

1. **Minimum 2 research agents** (not 1) for that topic — must independently derive the same number/threshold/procedure via DIFFERENT trusted-secondary sources (e.g., RUS Bulletin section that quotes the NESC clause + a state DOT design manual that re-states it). Convergence between independent paths is the verification.
2. **Both RTs run independent verification AND PROCESS CHECK.** Process check = "where did the researcher get this? Was the reasoning chain sound? Could a plausible-sounding-but-wrong number have slipped in from the agent's training data?" RT specifically traces the researcher's logic and flags any "feels right but unconfirmed" reasoning.
3. **If 2 research agents converge** AND both RTs verify the process is sound → claim is locked.
4. **If 2 research agents diverge** OR RT flags weak process → escalate: 3rd research agent, OR flag as `[paywalled — verify against NESC C2 §X.Y when accessible]` in the lesson body.
5. **If a number can't be verified at all** → omit from lesson OR mark "varies by jurisdiction / verify with AHJ" rather than guess.

The process-check is the anti-hallucination lever for paywalled content. Cross-source convergence + RT-of-reasoning catches "researcher's training data leaked into a citation that doesn't actually say that."

Goal: <1% margin of error per Carter's standard.
