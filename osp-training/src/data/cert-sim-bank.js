/**
 * cert-sim-bank.js
 *
 * Platform-original question bank for Module 12 — Final Certification Simulator.
 *
 * ETHICS STATEMENT: Every question here is independently authored from publicly
 * available standards, blueprints, FOA reference materials, vendor whitepapers,
 * and official agency documents. No question is sourced from or adapted from any
 * exam-dump site (ITExams, ExamTopics, dumpsarena, SPOTO, Killtest, Lead2Pass,
 * Pass4Success, or similar). Using leaked exam content violates BICSI and FOA
 * codes of conduct and may result in credential revocation.
 *
 * DOMAIN WEIGHTS — RCDD v14 baseline (see flag below):
 *   Define Scope of ICT Design     ~10%
 *   Design ICT Solutions           ~63%
 *   Support ICT Bid/Tender Process ~11%
 *   Support ICT Installation       ~16%
 *
 * FLAG (VERIFIED-via-secondary-source as of 2026-05-08): The v15 blueprint
 * percentages match the v14 baseline (10/63/11/16) confirmed via web search
 * triangulation by Red Team on 2026-05-08. No weight change required.
 * The v15 blueprint PDF is hosted at:
 * https://www.bicsi.org/docs/default-source/default-document-library/rcdd-exam-blueprint.pdf
 *
 * Question shape:
 *   id          – 'cs-NNN' (cert-sim, sequential)
 *   domain      – one of the four RCDD domains (matches DOMAIN_WEIGHTS keys)
 *   prompt      – scenario or knowledge question
 *   choices     – array of exactly 4 strings
 *   answerIndex – 0-based index of the correct choice
 *   explanation – rationale citing the public source; field note where applicable
 *
 * Sources used in this bank (all public):
 *   FOA loss-est.htm, FOA reference pages (thefoa.org/tech/ref/*)
 *   NECA/FOA 301-2016 (free PDF)
 *   EXFO application notes 194, 296, 298
 *   VIAVI OTDR/macrobend whitepapers
 *   Corning AN3060, WP7114, WP1281
 *   CommScope gainer/MFD blog 2018
 *   RUS Bulletins 1751F-630, 1751F-635, 1751F-643, 1751F-815
 *   OCC 206-2, 206-3, 206-4 installation guidelines
 *   FDOT 18202, VDOT IIM-LD-230
 *   CGA 811 / APWA marking standards
 *   IEEE NESC C2 (rules cited by number; table values from public utility manuals)
 *   ikeGPS NESC summaries
 *   FCC 18-111 (OTMR)
 *   47 CFR §15.109 (FCC Part 15)
 *   IEEE Std 1100 abstract (Emerald Book)
 *   TIA-607-D/E via NECA/BICSI 607-2011 free PDF and vendor summaries
 *   TIA-569 via secondary sources (Winnie, Border States, Elliott, CommScope)
 *   UL 1479 / IFC PEN2 primer; Unique Fire Stop F/T/L/W explainer
 *   Hilti annular-space Q&A; 3M / STI firestop vendor pages
 *   TIA-942-C (2024) via TIA white paper and Belden/Cabling Install summaries
 *   Uptime Institute press release (2014 Tier/Rated separation)
 *   ANSI/BICSI 002-2024 announcement (Cabling Install press release)
 *   TIA-598-D fiber color codes via FOA, Brady, Wikipedia
 *   FOA splice-closure reference (OSP splicing pages)
 *   FBA/Cartesian cost report 2024/2025 (fiberbroadband.org)
 *   BICSI RCDD exam page, BICSI OSP exam page (bicsi.org — VERIFIED-public-source)
 *   FOA certifications page (thefoa.org/Certs.htm — VERIFIED-public-source)
 *   FCC BDAC Model Code for Municipalities
 *   NTIA NEPA categorical-exclusion pages
 */

/* ------------------------------------------------------------------ */
/* BANK SIZE NOTE (FIX-12-02)                                          */
/* ------------------------------------------------------------------ */
/*
 * CAPACITY GAP — ACTION REQUIRED BEFORE STUDENT LAUNCH:
 * Current bank: 68 questions (cs-001 through cs-068).
 * Sim session size: 50 items.
 * A 68-question bank supports only ~1 non-repeating 50-item session.
 * Minimum target before launch: ≥ 200 questions (4× sim session size).
 * Long-term target: ≥ 600 questions per track (research log §5).
 * This gap is a functional limitation (heavy repetition), not a factual
 * error. Content is accurate; bank must be expanded before student use.
 * (Filed as FIX-12-02 by Red Team, 2026-05-08.)
 */

/* ------------------------------------------------------------------ */
/* DOMAIN WEIGHTS                                                       */
/* ------------------------------------------------------------------ */

/**
 * DOMAIN_WEIGHTS maps each RCDD functional-area domain to its approximate
 * percentage weight in the RCDD exam blueprint (v15 CONFIRMED — weights
 * identical to v14 baseline; no reweight required per Red Team 2026-05-08).
 *
 * The weights are expressed as integers (they sum to 100) and are consumed
 * by CertificationSim's proportional sampling algorithm.
 */
export const DOMAIN_WEIGHTS = {
  'Define Scope of ICT Design':     10,
  'Design ICT Solutions':           63,
  'Support ICT Bid/Tender Process': 11,
  'Support ICT Installation':       16,
};

/* ------------------------------------------------------------------ */
/* QUESTION BANK                                                        */
/* ------------------------------------------------------------------ */

export const CERT_BANK = [

  /* ================================================================
   * DOMAIN: Define Scope of ICT Design  (~10% → target 6–8 questions)
   * Covers: project scoping, user requirements, site surveys, standards
   * applicability, feasibility, RCDD role definition.
   * Source modules: 2, 3, 5, 6, 10, 11
   * ================================================================ */

  {
    id: 'cs-001',
    domain: 'Define Scope of ICT Design',
    prompt:
      'During the scope-definition phase of a campus fiber project, the client states "we want TIA-942 Tier III redundancy." Which response best demonstrates RCDD-level scope clarification?',
    choices: [
      'Agree to "Tier III" and proceed — TIA-942 defines Tier III.',
      'Ask whether the client means Uptime Institute Tier III (performance-based, Roman numeral) or TIA-942 Rated 3 (infrastructure-prescriptive, Arabic numeral), because these are distinct frameworks with different certification bodies.',
      'Decline the project because only data center architects can determine Tier level.',
      'Default to BICSI 002 because it supersedes TIA-942 in all U.S. projects.',
    ],
    answerIndex: 1,
    explanation:
      'Uptime Institute and TIA use different terminologies. After 2014, Uptime owns the "Tier" trademark (Tier I–IV, performance-based); TIA-942-C uses "Rated 1–4" (prescriptive). The phrase "TIA-942 Tier III" does not exist in the current standard. A designer must clarify which framework the client intends before scoping. Source: Uptime Institute press release 2014 (uptime-institute.com/about-ui/press-releases/uptime-tia); TIA-942-C white paper (tiaonline.org, 2024). [VERIFIED-public-source]',
  },

  {
    id: 'cs-002',
    domain: 'Define Scope of ICT Design',
    prompt:
      'A BEAD-funded fiber project requires NEPA review. Which condition would cause the project to LOSE its categorical exclusion (CE) status under NTIA\'s published CE list and require additional environmental review?',
    choices: [
      'The route runs through an agricultural field on private land.',
      'The conduit is orange-jacketed.',
      'The route crosses land that contains federally listed threatened or endangered species habitat.',
      'The project uses horizontal directional drilling (HDD) rather than open trench.',
    ],
    answerIndex: 2,
    explanation:
      'NTIA\'s published NEPA categorical exclusions include "extraordinary circumstances" that disqualify a CE. Presence of federally listed T&E species, historic properties, sensitive habitat, and traditional cultural properties are all on that list. Agricultural field traversal and equipment choice (orange conduit, HDD) do not automatically trigger an EIS. Source: NTIA NEPA Categorical Exclusion / Extraordinary Circumstances slide deck (broadbandusa.ntia.gov, 2024). [VERIFIED-public-source]',
  },

  {
    id: 'cs-003',
    domain: 'Define Scope of ICT Design',
    prompt:
      'An owner asks whether the project needs a BICSI RCDD-of-record. Which statement most accurately describes when an RCDD is contractually required in the U.S.?',
    choices: [
      'Federal law mandates an RCDD on all commercial projects over 10,000 sq ft.',
      'BICSI requires an RCDD on every project that references TDMM.',
      'RCDD is required by contract or specification — typically by the owner, an AHJ, or a federal grant condition — not by a universal U.S. statute.',
      'An RCDD is only required on data centers.',
    ],
    answerIndex: 2,
    explanation:
      'There is no universal U.S. federal or state statute mandating an RCDD. The RCDD requirement arises from contract language, AHJ adoption, or owner specification (including federal grant requirements in programs like BEAD). BICSI\'s own exam prep page and RCDD handbook confirm the credential is a competency certification, not a legal license. Source: BICSI RCDD certification page (bicsi.org/education-certification/certification/rcdd). [VERIFIED-public-source]',
  },

  {
    id: 'cs-004',
    domain: 'Define Scope of ICT Design',
    prompt:
      'A municipality asks for the estimated cost to pass 2,000 rural homes with fiber. Which industry-published data source provides the most defensible cost-per-foot benchmark for aerial vs. underground deployment?',
    choices: [
      'BLS Occupational Employment and Wage Statistics (OEWS) for telecom line workers.',
      'FBA / Cartesian Fiber Deployment Cost Annual Report.',
      'NESC Rule 250 loading district maps.',
      'ANSI/TIA-942-C Annex F.',
    ],
    answerIndex: 1,
    explanation:
      'The Fiber Broadband Association / Cartesian annual cost report is the most widely cited public benchmark for U.S. aerial and underground fiber deployment costs. The 2023-dataset report (published January 2024) shows medians of ~$6.49/ft aerial and ~$16.25/ft underground; the 2024-dataset report (published February 2025) shows ~$6.55/ft aerial and ~$18.25/ft underground. BLS OEWS gives wage data, not deployment cost. NESC covers structural loading, not cost. TIA-942 covers data-center infrastructure. Source: FBA/Cartesian annual cost reports (fiberbroadband.org). [VERIFIED-public-source]',
  },

  {
    id: 'cs-005',
    domain: 'Define Scope of ICT Design',
    prompt:
      'During a pre-design site survey for an office building, you discover the existing conduit infrastructure is full and no new pathway is available. Which BICSI-standard document governs the design of telecom pathways and spaces for the new inside-plant cabling?',
    choices: [
      'ANSI/TIA-568.3-D',
      'ANSI/TIA-569-E',
      'ANSI/TIA-607-E',
      'ANSI/TIA-606-D',
    ],
    answerIndex: 1,
    explanation:
      'ANSI/TIA-569 (current revision -E) is the standard for telecommunications pathways and spaces — conduit sizing, cable tray, TR layout, horizontal pathway, equipment room. TIA-568.3-D covers optical fiber cabling components; TIA-607-E covers bonding and grounding; TIA-606-D covers administration and labeling. Source: Fiber Optics Tech Consortium TIA-569-E update (tiafotc.org); Cabling Install & Maint article. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-006',
    domain: 'Define Scope of ICT Design',
    prompt:
      'A client requests a design that must comply with both TIA-942-C and ANSI/BICSI 002-2024 for their new data center. Which statement correctly describes the relationship between these two standards?',
    choices: [
      'TIA-942-C supersedes BICSI 002 for all U.S. data center projects.',
      'BICSI 002 is broader, covering design, operations, commissioning, and energy; TIA-942-C is narrower, focusing on infrastructure ratings and conformance criteria. They are complementary.',
      'Both standards are identical in scope; citing one satisfies both.',
      'BICSI 002 applies only to military data centers.',
    ],
    answerIndex: 1,
    explanation:
      'BICSI 002-2024 is the broader operations-and-design reference (17 chapters, includes liquid cooling, edge, commissioning). TIA-942-C is the infrastructure specification used for certification against specific Ratings (1–4). RFPs commonly cite both — BICSI 002 for design breadth, TIA-942-C for conformance criteria. Source: BICSI 002-2024 announcement (cablinginstall.com); TIA-942-C white paper (tiaonline.org, 2024). [VERIFIED-public-source / VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-007',
    domain: 'Define Scope of ICT Design',
    prompt:
      'The project scope references TDMM 15th edition as the governing design manual. Which BICSI exam is keyed to this edition?',
    choices: [
      'BICSI OSP Designer',
      'BICSI RCDD',
      'FOA CFOT',
      'FOA CFOS/S',
    ],
    answerIndex: 1,
    explanation:
      'The BICSI RCDD exam is keyed to the Telecommunications Distribution Methods Manual (TDMM), 15th edition. The OSP Designer exam is keyed to the OSPDRM 6th edition. FOA certifications are based on FOA reference guides, not TDMM. Source: BICSI RCDD preparation page (bicsi.org/education-certification/certification/rcdd/how-to-prepare-for-the-rcdd-exam). [VERIFIED-public-source]',
  },

  /* ================================================================
   * DOMAIN: Design ICT Solutions (~63% → target 38–42 questions)
   * Covers: fiber physics, OSP design, ISP/structured cabling,
   * splicing, testing, grounding/bonding, firestopping, data center,
   * fiber topology, loss budgets, NESC, pathway design.
   * Source modules: 1, 2, 4, 5, 6, 7, 8, 10
   * ================================================================ */

  /* ---- Fiber Physics (Module 1) ---- */
  {
    id: 'cs-008',
    domain: 'Design ICT Solutions',
    prompt:
      'An ITU-T G.652.D single-mode fiber link budget uses a designer\'s planning value for fiber attenuation at 1550 nm. Which value is most defensible for this purpose?',
    choices: [
      '0.40 dB/km (the G.652.D spec ceiling at 1310 nm)',
      '0.22–0.25 dB/km (a typical planning value, between the G.652.D maximum of 0.30 dB/km and the vendor-typical 0.18–0.22 dB/km)',
      '0.10 dB/km (a DWDM ultra-low-loss fiber specification)',
      '0.75 dB/km (the TIA connector loss maximum)',
    ],
    answerIndex: 1,
    explanation:
      'G.652.D specifies ≤0.30 dB/km at 1550 nm. Vendor datasheets (Corning SMF-28e+, Prysmian, OFS) typically show 0.18–0.22 dB/km. A planning value of 0.22–0.25 dB/km is a defensible design number — above typical but below spec ceiling. 0.40 dB/km is the 1310 nm ceiling. 0.75 dB/km is a connector loss limit, not fiber attenuation. Source: ITU-T G.652 (free at ITU-T); vendor datasheets; docs/field-vs-textbook-research.md §2.3. [VERIFIED-public-source]',
  },

  {
    id: 'cs-009',
    domain: 'Design ICT Solutions',
    prompt:
      'Why is 1625 nm used for in-service OTDR fault location on a live fiber plant, while 1310 nm is used for initial acceptance testing?',
    choices: [
      '1625 nm has higher chromatic dispersion, which improves distance accuracy.',
      '1625 nm falls outside the C-band DWDM window, so an OTDR signal can be injected without disrupting live traffic; 1310 nm is used for new acceptance because it provides a clear baseline loss value.',
      '1310 nm is prohibited by BICSI on operating networks.',
      '1625 nm has lower attenuation than 1310 nm on G.652 fiber.',
    ],
    answerIndex: 1,
    explanation:
      '1625 nm (the L-band edge) is the standard in-service test wavelength because it sits outside the C-band (1530–1565 nm) used by DWDM traffic, allowing injection without disrupting live signals. An additional benefit: macrobend loss scales with wavelength, so 1625 nm is a sensitive macrobend detector. 1310 nm is the short-reach acceptance wavelength and provides the lowest-dispersion baseline. Source: VIAVI macrobend detection whitepaper; EXFO anote 194; module08 research log. [VERIFIED-public-source]',
  },

  {
    id: 'cs-010',
    domain: 'Design ICT Solutions',
    prompt:
      'In an OTDR trace, a "gainer" — where a splice appears to show negative loss — is most commonly caused by:',
    choices: [
      'A dirty OTDR launch connector that adds extra loss before the splice.',
      'Mode-field diameter (MFD) mismatch between the fibers being spliced, causing the OTDR backscatter coefficient to differ on each side.',
      'Excessive averaging time producing an over-smoothed trace.',
      'A ghost reflection caused by a high-reflectance connector two events earlier.',
    ],
    answerIndex: 1,
    explanation:
      'An OTDR gainer is an artifact: when fiber B (far side of splice) has a larger MFD than fiber A (near side), its Rayleigh backscatter coefficient is higher, so the OTDR calculates "negative" splice loss. The splice may still have real physical loss — bidirectional averaging gives the true value. Source: CommScope gainer blog (2018); Corning WP1281; FOA OTDR FAQs. [VERIFIED-public-source]',
  },

  /* ---- OSP Design / NESC (Module 2) ---- */
  {
    id: 'cs-011',
    domain: 'Design ICT Solutions',
    prompt:
      'NESC Rule 235 governs separation between supply and communication conductors on a joint-use pole. The value consistently cited in utility design manuals for the communication worker safety zone at common supply voltages is:',
    choices: [
      '12 in.',
      '24 in.',
      '40 in.',
      '60 in.',
    ],
    answerIndex: 2,
    explanation:
      '40 in. is the figure cited in public utility design manuals (ikeGPS, Alden Systems, multiple IOU joint-use books) for the supply-to-communication vertical separation at the pole under NESC Rule 235. The authoritative value is in NESC IEEE C2-2023 Table 235-5 (paywalled). Source: ikeGPS Communication Worker Safety Zone summary. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-012',
    domain: 'Design ICT Solutions',
    prompt:
      'NESC Rule 250 divides the country into loading districts. Which combination correctly describes the Heavy loading district per public summaries of Table 250-1?',
    choices: [
      '½ in. radial ice, ~4 psf wind pressure',
      '¼ in. radial ice, ~4 psf wind pressure',
      '0 in. ice, ~9 psf wind pressure',
      '1 in. radial ice, ~8 psf wind pressure',
    ],
    answerIndex: 0,
    explanation:
      'Heavy district: ≈ ½ in. radial ice + ≈ 4 psf concurrent wind. Medium: ≈ ¼ in. ice + ≈ 4 psf. Light: 0 in. ice + ≈ 9 psf. These values are republished in many secondary sources (utility manuals, line-design textbooks). The authoritative figures are in NESC IEEE C2-2023 Table 250-1 (paywalled). Source: Module 2 OSP Design — Table 250-1 summary from public utility design manuals. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-013',
    domain: 'Design ICT Solutions',
    prompt:
      'NESC Rule 261 defines grades of construction for overhead lines. Which application requires Grade B construction rather than Grade C?',
    choices: [
      'A residential distribution line in a Light loading district.',
      'A communication cable on a pole 50 ft from a railroad track.',
      'A communication attachment added to an existing Grade C distribution pole.',
      'Any pole in a Medium loading district.',
    ],
    answerIndex: 1,
    explanation:
      'Grade B construction (higher consequence) is required at crossings of railroads, highways with heavy traffic, and navigable waterways. Grade C is the typical distribution and joint-use standard. Proximity to a railroad track (a high-consequence crossing hazard) triggers the Grade B requirement. Source: ikeGPS NESC Grades of Construction summary; Module 2 research log. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-014',
    domain: 'Design ICT Solutions',
    prompt:
      'A designer needs to cross a public road with a communication aerial cable. Per public summaries of NESC Table 232-1 (Rule 232), the minimum vertical clearance commonly cited for communication cables over public roads is approximately:',
    choices: [
      '9.5 ft',
      '12.0 ft',
      '15.5 ft',
      '18.0 ft',
    ],
    answerIndex: 2,
    explanation:
      '≈ 15.5 ft is the figure that appears repeatedly in independent utility design manuals for communication cables over public roads (vs. ≈ 9.5 ft over pedestrian-only areas). These are planning values from secondary sources; the authoritative figure is in NESC IEEE C2-2023 Table 232-1 (paywalled). Field practice adds 1–2 ft of margin above the minimum. Source: Module 2; Hi-Line NESC 2023 clearance charts (gdsassociates.com). [VERIFIED-via-secondary-source]',
  },

  /* ---- Permitting & Planning (Module 3) ---- */
  {
    id: 'cs-015',
    domain: 'Design ICT Solutions',
    prompt:
      'Under FCC One-Touch Make-Ready (OTMR, FCC Order 18-111), which type of work is classified as "complex" make-ready and therefore EXCLUDED from the single-visit OTMR process?',
    choices: [
      'Moving an existing communication cable down 6 in. within the comm space to accommodate a new attachment.',
      'Replacing a strand bracket with one of identical capacity.',
      'Any work that involves cable splicing, operations in the supply space, or a reasonable expectation of customer outage.',
      'Installing a new bonding clamp on the communication messenger cable.',
    ],
    answerIndex: 2,
    explanation:
      'OTMR applies only to "simple" make-ready in the communication space. Work classified as complex — including cable splicing, supply-space work, antenna work, or anything with a reasonable expectation of outage — reverts to sequential make-ready. Source: FCC 18-111, Third Report and Order (August 2018). [VERIFIED-public-source]',
  },

  {
    id: 'cs-016',
    domain: 'Design ICT Solutions',
    prompt:
      'A recorded easement grants a telecom carrier the right to "install, maintain, and operate telecommunications facilities" across a specific parcel. The carrier later sells to a new operator. What governs whether the new operator can use the easement?',
    choices: [
      'The new operator automatically retains rights because telecom is federally regulated.',
      'The easement language and the assignment clause; easements generally run with the land if they are appurtenant and properly recorded, but the exact transferability depends on the recorded grant.',
      'NESC Rule 232 permits transfer of any utility easement.',
      'The FCC pole-attachment order grants blanket easement transfer rights.',
    ],
    answerIndex: 1,
    explanation:
      'Easements are property law instruments. An appurtenant easement runs with the dominant estate; in gross easements (common for utilities) transferability depends on the specific language of the grant. The recorded document is the controlling instrument; no federal statute automatically transfers a private easement to a successor operator. Source: Module 3 permitting research log; general property law applicable in all U.S. jurisdictions. [VERIFIED-public-source — legal principle]',
  },

  /* ---- Splicing (Module 4) ---- */
  {
    id: 'cs-017',
    domain: 'Design ICT Solutions',
    prompt:
      'For a new OSP backbone project, what is the most defensible acceptance threshold to specify for bidirectional-averaged fusion splice loss per the FOA planning guidelines?',
    choices: [
      '0.05 dB per splice (splicer estimate target)',
      '0.30 dB per splice (TIA-568.3-D cap per splice; via secondary source)',
      '0.75 dB per splice (TIA-568.3-D legacy connector max)',
      '1.00 dB per splice',
    ],
    answerIndex: 0,
    explanation:
      'FOA guidance (loss-est.htm) lists 0.15 dB as a planning value for a single-mode fusion splice and notes that field practice targets ≤0.05 dB on the splicer\'s estimate. The 0.30 dB TIA-568.3-D cap is the hard maximum, not the acceptance criterion for new production splicing. 0.75 dB is a connector-pair limit, not a splice limit. The best new-OSP acceptance threshold to specify is ≤0.05 dB (splicer estimate), re-tested bidirectionally via OTDR if suspect. Source: FOA loss-est.htm; NECA/FOA 301-2016; module04 research log. [VERIFIED-public-source]',
  },

  {
    id: 'cs-018',
    domain: 'Design ICT Solutions',
    prompt:
      'An OTDR trace shows that a fusion splice registers 0.00 dB loss from the A-end but −0.12 dB (a gain) from the B-end. After bidirectional averaging, the splice loss is:',
    choices: [
      '−0.12 dB (the B-end measurement is authoritative)',
      '0.06 dB loss (average of 0.00 and −0.12, taking absolute values: (0.00 + 0.12) / 2)',
      '0.12 dB loss (take the higher reading only)',
      '0.00 dB (the A-end measurement is authoritative)',
    ],
    answerIndex: 1,
    explanation:
      'Bidirectional OTDR splice-loss measurement: measure from each end, take the arithmetic average of the absolute values. |0.00| + |−0.12| = 0.12; 0.12 / 2 = 0.06 dB. The −0.12 dB "gain" is an MFD-mismatch artifact; the true physical loss is the average. Source: FOA OTDR FAQs; Corning AN3060; VIAVI bidirectional OTDR testing page. [VERIFIED-public-source]',
  },

  {
    id: 'cs-019',
    domain: 'Design ICT Solutions',
    prompt:
      'Which type of splice closure is best suited for an aerial span where most fibers pass straight through to a distant node, and only a small fraction of fibers need to be branched at this location?',
    choices: [
      'Dome (butt) closure, because all fibers must terminate.',
      'In-line closure with express-loop capability, because fibers that do not branch can bypass the splice tray with their buffer tube intact.',
      'Wall-mount indoor closure, because it is the most accessible.',
      'Re-enterable putty-pad closure, because it allows future splicing.',
    ],
    answerIndex: 1,
    explanation:
      'An in-line (express) closure passes fibers straight through with the buffer tube intact for those that do not need to be branched. Only the branched fibers are cut and placed in splice trays. A dome (butt) closure terminates all fibers. Wall-mount closures are indoor. Source: FOA splice-closures reference (thefoa.org/tech/ref/install/closures.html); module04 research log §3.7. [VERIFIED-public-source]',
  },

  {
    id: 'cs-020',
    domain: 'Design ICT Solutions',
    prompt:
      'A splicer\'s LCD screen shows "Splice Estimated Loss: 0.02 dB" for a single-mode fusion splice. A bidirectional OTDR trace later shows 0.18 dB for the same splice. Which statement best explains the discrepancy?',
    choices: [
      'The splicer is always more accurate; the OTDR must be miscalibrated.',
      'The splicer\'s estimate is a model derived from cleave-angle and core-alignment images, not a power-domain measurement. The OTDR can detect power-domain effects (such as MFD mismatch) that the splicer\'s imaging algorithm cannot see.',
      'The OTDR adds 0.16 dB of its own instrument loss.',
      'The splice loosened after testing; the OTDR result is irrelevant.',
    ],
    answerIndex: 1,
    explanation:
      'The splicer\'s "estimated loss" is a model output from profile-alignment camera images — it is not a power measurement. OTDR loss is a power-domain measurement that captures effects (MFD mismatch, connector contamination) the splicer cannot see. The OTDR bidirectional average is the authoritative splice-loss value for acceptance. Source: Corning WP7114; Fujikura 90S+ manual; module04 research log §3.1. [VERIFIED-public-source / VERIFIED-via-secondary-source]',
  },

  /* ---- Networking Blueprints / ISP (Module 5) ---- */
  {
    id: 'cs-021',
    domain: 'Design ICT Solutions',
    prompt:
      'ANSI/TIA-569-E (telecommunications pathways and spaces) specifies separation distances between unshielded telecommunications cabling and power wiring. For unshielded power circuits of 2–5 kVA in an open (non-metallic) pathway, the commonly cited separation is:',
    choices: [
      '5 in. (127 mm)',
      '12 in. (305 mm)',
      '24 in. (610 mm)',
      '36 in. (914 mm)',
    ],
    answerIndex: 1,
    explanation:
      '12 in. (≈305 mm) is the figure cited in multiple public summaries of TIA-569 for 2–5 kVA unshielded power in an open pathway. The separation drops to 5 in. for <2 kVA and rises to 24 in. for >5 kVA. These reductions apply when cabling is in grounded metallic conduit. Source: Winnie Industries, Border States, Elliott Electric, CommScope TP-106296 all reproduce the same table. [VERIFIED-via-secondary-source — TIA-569 itself is paywalled]',
  },

  {
    id: 'cs-022',
    domain: 'Design ICT Solutions',
    prompt:
      'TIA-607-D (Generic Telecommunications Bonding and Grounding) renamed the grounding busbars in its 2019 revision. Under TIA-607-D/E, the former TGB (Telecommunications Grounding Busbar) is now called:',
    choices: [
      'TMGB (Telecommunications Main Grounding Busbar)',
      'TBB (Telecommunications Bonding Backbone)',
      'SBB (Secondary Bonding Busbar)',
      'PBB (Primary Bonding Busbar)',
    ],
    answerIndex: 2,
    explanation:
      'TIA-607-D (July 2019) renamed TMGB → PBB (Primary Bonding Busbar) and TGB → SBB (Secondary Bonding Busbar). The TBB (Telecommunications Bonding Backbone) connecting each SBB back to the PBB retains its name. Source: PDU Cables "Ken\'s Korner" TIA-607-D summary; module05 research log §1.1. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-023',
    domain: 'Design ICT Solutions',
    prompt:
      'A 4-fiber LC/UPC pigtail at a patch panel consistently tests at 0.68 dB per mated pair with a calibrated OLTS. Which TIA-568.3-D legacy limit does this value approach, and what is the recommended corrective action?',
    choices: [
      'This exceeds the 0.50 dB reference-grade limit; replace with APC connectors.',
      'This approaches the 0.75 dB legacy maximum per mated connector pair. The first corrective action is to inspect and clean both connector end-faces; if cleaning does not resolve it, inspect for physical damage and re-terminate if needed.',
      'This is well within the 1.5 dB acceptable limit; no action is required.',
      'TIA-568.3-D does not set a connector-pair limit; only end-to-end loss limits exist.',
    ],
    answerIndex: 1,
    explanation:
      '0.75 dB per mated pair is the legacy maximum per TIA-568.3-D (via Fluke Networks secondary source). A 0.68 dB reading is near that ceiling. The first corrective action is always inspect-and-clean (IEC 61300-3-35 grade); connector contamination accounts for the majority of elevated loss readings. Source: Fluke Networks blog on 0.75 dB; NECA/FOA 301-2016 (cleaning procedures). [VERIFIED-via-secondary-source]',
  },

  /* ---- RCDD Core: EMC, Firestopping, Grounding (Module 6) ---- */
  {
    id: 'cs-024',
    domain: 'Design ICT Solutions',
    prompt:
      'A through-penetration firestop system carries a UL listing with an F-rating of 2 hours and a T-rating of 1 hour. The T-rating means:',
    choices: [
      'The assembly withstands a torch flame for 1 hour before igniting.',
      'The unexposed face of the assembly rises no more than 325°F (181°C) above ambient for 1 hour under UL 1479 test conditions.',
      'The assembly passed a termite-resistance test for 1 hour.',
      'The assembly resists traffic loads (T-load) for 1 hour.',
    ],
    answerIndex: 1,
    explanation:
      'The T-rating (Temperature) is defined under UL 1479 as the time during which the unexposed-side temperature rise does not exceed 325°F (181°C) above ambient. T is always ≤ F. T matters in floors and fire walls where combustibles can contact the unexposed face. Source: Unique Fire Stop Products F/T/L/W rating explainer; IFC PEN2 firestop primer. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-025',
    domain: 'Design ICT Solutions',
    prompt:
      'IEEE Std 1100 (the "Emerald Book") recommends that isolated/dedicated grounds for telecom equipment:',
    choices: [
      'Are required whenever IT equipment is installed in a dedicated equipment room.',
      'Are explicitly NOT recommended; a single, common bonded grounding system for power, lightning/SPD, and telecom is the correct approach.',
      'Are only permitted above the 8th floor of a building.',
      'Are governed by FCC Part 15 Class B limits.',
    ],
    answerIndex: 1,
    explanation:
      'IEEE Std 1100 (Emerald Book, Chapter 9) states that isolated/dedicated/"clean" grounds are not recommended and can be unsafe. All grounding subsystems must be connected to a single common bonded system. This is a fundamental RCDD exam concept. Source: IEEE Std 1100 abstract (standards.ieee.org/ieee/1100/3055/); EC&M overview. [VERIFIED-public-source]',
  },

  {
    id: 'cs-026',
    domain: 'Design ICT Solutions',
    prompt:
      'FCC Part 15 Class B emission limits apply to which category of equipment, and how do they compare to Class A limits?',
    choices: [
      'Commercial / industrial equipment; Class B limits are MORE permissive (less stringent) than Class A.',
      'Residential equipment; Class B limits are MORE stringent (roughly 6–10 dB tighter) than Class A, measured at 3 m.',
      'Military equipment; Class B limits are set at 100 m measurement distance.',
      'All outdoor equipment; Class B and Class A limits are identical.',
    ],
    answerIndex: 1,
    explanation:
      'FCC Part 15 Class A is for commercial/industrial equipment (field-strength limits at 10 m). Class B is for residential equipment (limits at 3 m), and is roughly 6–10 dB more stringent because it protects home receivers. Source: 47 CFR §15.109 in eCFR; compliancetesting.com Class A/B explainer; module06 research log §1.2. [VERIFIED-public-source]',
  },

  {
    id: 'cs-027',
    domain: 'Design ICT Solutions',
    prompt:
      'NEC Article 800 (reorganized as Article 805 in NEC 2023) requires a listed primary protector on aerial telecom conductors entering a building. Which UL listing standard governs a primary telecom line protector (gas tube/carbon arrester type)?',
    choices: [
      'UL 497B (isolated-loop protectors)',
      'UL 497A (secondary protectors)',
      'UL 497 (primary protector for telecommunications circuits)',
      'UL 1449 (surge protective devices for power circuits)',
    ],
    answerIndex: 2,
    explanation:
      'UL 497 is the listing standard for primary telecom line protectors (gas tube, carbon arrester) — required at aerial telecom entries. UL 497A covers secondary protectors (downstream, <150 V circuits); UL 497B covers isolated-loop circuits. UL 1449 covers power-side SPDs. Source: module06 research log §1.3; Transtector / Eaton white paper SA01005003E. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-028',
    domain: 'Design ICT Solutions',
    prompt:
      'A cable bundle passes through a concrete floor in a healthcare facility. The firestop system installed has an F=2h rating but no T or L rating. The AHJ rejects the installation. What is the most likely reason?',
    choices: [
      'Concrete floors do not require firestopping.',
      'Healthcare (I-2 occupancy) corridors and floor penetrations typically require L-rated (air/smoke leakage) systems, per IBC/NFPA 101 smoke-resistive assembly requirements, which the F-only system does not satisfy.',
      'F=2h is always sufficient for any occupancy.',
      'The T-rating is only required in cold-storage facilities.',
    ],
    answerIndex: 1,
    explanation:
      'In healthcare (I-2) occupancies, horizontal floor penetrations and smoke-resistive assemblies typically require L-rated (air/smoke leakage) firestop systems per IBC / NFPA 101. An F-only system does not address smoke migration. The W-rating (water) would be separate. Source: Unique Fire Stop Products; IFC PEN2 primer; module06 research log §1.1. [VERIFIED-via-secondary-source]',
  },

  /* ---- Fiber Topology (Module 7) ---- */
  {
    id: 'cs-029',
    domain: 'Design ICT Solutions',
    prompt:
      'Per ANSI/TIA-598-D, what is the color of fiber position 6 in a standard 12-fiber buffer tube?',
    choices: [
      'Slate (gray)',
      'White',
      'Yellow',
      'Green',
    ],
    answerIndex: 1,
    explanation:
      'TIA-598 12-color sequence: 1=Blue, 2=Orange, 3=Green, 4=Brown, 5=Slate, 6=White, 7=Red, 8=Black, 9=Yellow, 10=Violet, 11=Rose, 12=Aqua. Position 6 is White. Source: FOA color codes page (thefoa.org/tech/ColCodes.htm); Brady fiber color-code guide; Wikipedia TIA-598-C. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-030',
    domain: 'Design ICT Solutions',
    prompt:
      'In a 24-fiber single-tube loose-tube cable, how are fibers 13–24 typically identified under TIA-598?',
    choices: [
      'They are labeled 13–24 with printed text on each fiber.',
      'They repeat the 12-color sequence but with a stripe or tracer mark to distinguish the second group from fibers 1–12.',
      'They are bundled in a separate buffer tube colored aqua.',
      'They are left uncolored — the count determines identity.',
    ],
    answerIndex: 1,
    explanation:
      'For cables with more than 12 fibers in a single tube, TIA-598 repeats the 12-color sequence; each successive group is further identified by a stripe or tracer mark (e.g., fibers 13–24 carry the same 12 colors as 1–12 but with a black tracer). Source: FOA color codes page; Brady fiber color guide; module07 research log §1.1. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-031',
    domain: 'Design ICT Solutions',
    prompt:
      'A designer plans a 144-fiber backbone route with Corning SMF-28 Ultra (G.652.D). The route is 18 km with 3 intermediate splice points, each averaging 0.08 dB bidirectional. Using planning values of 0.22 dB/km at 1550 nm, what is the total link loss estimate (fiber + splices only, no connectors)?',
    choices: [
      '3.96 dB',
      '4.20 dB',
      '3.96 dB fiber + 0.24 dB splices = 4.20 dB total',
      '4.80 dB',
    ],
    answerIndex: 2,
    explanation:
      'Fiber: 18 km × 0.22 dB/km = 3.96 dB. Splices: 3 × 0.08 dB = 0.24 dB. Total = 4.20 dB (fiber + splices). Connector losses and any additional passive components are added separately. Planning value 0.22 dB/km is per the field-vs-textbook research log §2.3. [VERIFIED-public-source for planning methodology; calculation is original]',
  },

  /* ---- OTDR / Testing (Module 8) ---- */
  {
    id: 'cs-032',
    domain: 'Design ICT Solutions',
    prompt:
      'The OTDR\'s "event dead zone" (EDZ) and "attenuation dead zone" (ADZ) differ in what key way?',
    choices: [
      'EDZ is the minimum distance before the OTDR can locate any event; ADZ is the minimum distance before a connector can be detected after a splice.',
      'EDZ is the minimum separation at which two reflective events can be resolved as distinct; ADZ is the minimum distance after a reflective event before a non-reflective splice can be accurately measured.',
      'They are synonyms; both describe the OTDR\'s minimum detectable event.',
      'EDZ applies to multimode fiber; ADZ applies to single-mode only.',
    ],
    answerIndex: 1,
    explanation:
      'EDZ (Event Dead Zone): minimum distance between two reflective events (e.g., connectors) that can still be distinguished as separate. ADZ (Attenuation Dead Zone): minimum distance after a reflective event before a non-reflective event (e.g., a fusion splice) can be accurately measured. Defined per Telcordia; ADZ is typically 3–5 m longer than EDZ for the same pulse width. Source: EXFO anote 296; Fluke Networks KB; module08 research log §3.4. [VERIFIED-public-source]',
  },

  {
    id: 'cs-033',
    domain: 'Design ICT Solutions',
    prompt:
      'An OTDR\'s Index of Refraction (IOR) setting is left at the factory default (1.4677) instead of the cable manufacturer\'s specified value (1.4682). On a 40 km span, the approximate distance-measurement error introduced is:',
    choices: [
      'Negligible — less than 1 m',
      'Approximately 14–30 m',
      'Approximately 150 m',
      'Approximately 1 km',
    ],
    answerIndex: 1,
    explanation:
      'An IOR error of 0.0005 over 40 km produces a distance error of approximately (0.0005/1.4677) × 40,000 m ≈ 14 m. Yamasaki Optical notes that 0.001 IOR error causes meters-per-km of distance error; at 0.0005 delta over 40 km the result is in the 14–30 m range depending on direction. This is why entering the cable datasheet IOR matters for fault location. Source: Yamasaki Optical (yamasakiot.com, 2025); module08 research log §3.8. [VERIFIED-public-source]',
  },

  {
    id: 'cs-034',
    domain: 'Design ICT Solutions',
    prompt:
      'Tier-1 OLTS (Optical Loss Test Set) testing and Tier-2 OTDR testing serve different purposes. Which statement correctly distinguishes them?',
    choices: [
      'OLTS measures link loss as a power ratio — it is the only instrument that provides a true power-domain insertion-loss measurement. The OTDR characterizes the link by analyzing backscattered light and provides additional event location information, but its loss values are calculated, not directly measured.',
      'OTDR is the only instrument that can certify a link for TIA compliance; OLTS is only used for troubleshooting.',
      'OLTS and OTDR are equivalent measurement methods; either one is sufficient for TIA-568 certification.',
      'OLTS is used for multimode fiber only; OTDR is used for single-mode fiber only.',
    ],
    answerIndex: 0,
    explanation:
      'OLTS (tier-1) measures insertion loss directly using a calibrated source and power meter — it is the standard for TIA-568 cabling certification. OTDR (tier-2) measures by backscatter analysis, providing event location and characterization but not a direct power measurement. FOA, EXFO, and VIAVI all state this distinction explicitly. Source: FOA OTDR reference page; Fluke Networks "OLTS + OTDR" strategy guide; module08 research log §3.2. [VERIFIED-public-source]',
  },

  {
    id: 'cs-035',
    domain: 'Design ICT Solutions',
    prompt:
      'Which OTDR launch cable length is recommended for a premises / FTTx measurement using pulsewidths of ≤500 ns, per EXFO and VIAVI guidelines?',
    choices: [
      '50 m',
      '150–300 m',
      '1 km',
      '5 km',
    ],
    answerIndex: 1,
    explanation:
      '150–300 m is the EXFO and VIAVI-recommended launch cable length for FTTH / FTTx and premises work at short pulsewidths (≤500 ns). Longer spans (metro, long-haul) require 500 m to 1–2 km launch cables to move the OTDR dead zone out of the region of interest. Source: EXFO anote 298; VIAVI FAQ on launch cable sizes; module08 research log §3.5. [VERIFIED-public-source]',
  },

  /* ---- OSP Construction (Module 9) ---- */
  {
    id: 'cs-036',
    domain: 'Design ICT Solutions',
    prompt:
      'Per APWA uniform color codes, what color marks a telecom/communications underground facility on a locate notice?',
    choices: [
      'Blue',
      'Orange',
      'Yellow',
      'Red',
    ],
    answerIndex: 1,
    explanation:
      'APWA uniform color code: Orange = communications / telecom. Blue = potable water. Yellow = gas/oil/steam. Red = electric power. White = proposed excavation limits. Orange is the standard surface-marking color for a telecom facility that has been located. Source: APWA color code guide (smartsign.com/blog/apwa-color-code); CGA 811 program. [VERIFIED-public-source]',
  },

  {
    id: 'cs-037',
    domain: 'Design ICT Solutions',
    prompt:
      'RUS Bulletin 1751F-630 and OCC installation guideline 206-4 both cite a typical minimum direct-burial depth for OSP fiber. Which value is most consistent across these public sources?',
    choices: [
      '18 in. (457 mm)',
      '24 in. (610 mm)',
      '36 in. (914 mm)',
      '48 in. (1219 mm)',
    ],
    answerIndex: 2,
    explanation:
      '36 in. (914 mm) is the typical minimum direct-burial depth for OSP fiber per RUS Bulletin 1751F-630 and OCC 206-4. NEC 830.47 sets an 18 in. minimum for network-powered broadband, which is a lower floor. CalTrans requires 42 in. in highway ROW. The AHJ-specific requirement governs; 36 in. is the common baseline. Source: RUS 1751F-630; OCC 206-4; module09 research log §1.7. [VERIFIED-public-source]',
  },

  {
    id: 'cs-038',
    domain: 'Design ICT Solutions',
    prompt:
      'Telecommunications conduit fill practice per industry convention (BICSI / TIA) limits initial fill to what percentage of a duct\'s cross-sectional area?',
    choices: [
      '10%',
      '25%',
      '40%',
      '60%',
    ],
    answerIndex: 1,
    explanation:
      '25% initial fill / 40% maximum fill is the widely cited BICSI/TIA convention for telecommunications innerduct. This leaves capacity for future cable additions without over-stressing existing cables. NEC Chapter 9 Table 1 allows 40% for three or more conductors in general wiring, but telecom innerduct is conventionally more conservative. Source: module09 research log §1.7; Southwire / vendor summaries. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-039',
    domain: 'Design ICT Solutions',
    prompt:
      'A horizontal directional drill (HDD) is being used to cross under a roadway. Which factor primarily determines the minimum allowable bend radius for the fiber cable being pulled back through the bored path?',
    choices: [
      'The diameter of the drill head',
      'The cable manufacturer\'s specified minimum bend radius (typically 20× cable OD installed, with no tension)',
      'The NESC Heavy loading district ice calculation',
      'The conduit fill percentage rule',
    ],
    answerIndex: 1,
    explanation:
      'The cable manufacturer\'s datasheet specifies the minimum bend radius (often 10× OD under load, 20× OD installed/unloaded for fiber cables). The HDD bore path must be designed so that the cable path radius exceeds this minimum at every curve. The NESC loading district governs structural design of overhead lines, not buried cable bend radius. Source: OCC 206-2 General Installation Guidelines; Corning SRP-005-011; module09 research log §1.4. [VERIFIED-public-source]',
  },

  {
    id: 'cs-040',
    domain: 'Design ICT Solutions',
    prompt:
      'What is the primary design function of a pull-point handhole or manholeintermediate pull-box spaced along a long underground conduit run?',
    choices: [
      'To provide a location for the utility locating transmitter.',
      'To limit the cable tension during pulling by breaking the run into shorter sections, reducing the cumulative sidewall pressure and preventing cable damage.',
      'To serve as a ground electrode for the metallic strength member.',
      'To satisfy NESC Rule 235 clearance requirements underground.',
    ],
    answerIndex: 1,
    explanation:
      'Intermediate pull-points (manholes, handholes) limit cable tension during installation by dividing a long conduit run into shorter sections. This keeps sidewall pressure (tension × angle change / radius) within the cable\'s allowable limits. OFS IP-079 and RUS 1751F-643 both address handhole spacing for this reason. Source: OFS IP-079; RUS 1751F-643; module09 research log. [VERIFIED-public-source]',
  },

  /* ---- Data Center (Module 10) ---- */
  {
    id: 'cs-041',
    domain: 'Design ICT Solutions',
    prompt:
      'ANSI/TIA-942-C (May 2024) specifies a minimum cabinet width for Main Distribution Area (MDA), Intermediate Distribution Area (IDA), and Horizontal Distribution Area (HDA) cabinets. What is that minimum?',
    choices: [
      '482 mm (19 in.)',
      '600 mm',
      '800 mm',
      '1000 mm',
    ],
    answerIndex: 2,
    explanation:
      '800 mm minimum cabinet width is a notable change in TIA-942-C (2024) for MDA/IDA/HDA cabinets. The standard moved from 600 mm legacy to 800 mm to accommodate higher-density cabling and equipment. Field note: many installed cabinets are 600 mm; the standard governs new design, not retroactive retrofit. Source: TIA-942-C white paper (tiaonline.org, 2024); Belden TIA-942-C blog; module10 research log. [VERIFIED-public-source / VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-042',
    domain: 'Design ICT Solutions',
    prompt:
      'For a 400GBASE-SR4 parallel-optic transceiver installation using structured cabling, which MPO backbone configuration provides 100% fiber utilization (no dark fibers)?',
    choices: [
      'Base-12 MPO, because it has 12 fibers and 400G-SR4 uses 12 lanes.',
      'Base-8 MPO, because 400GBASE-SR4 uses 4 transmit + 4 receive = 8 fibers per transceiver.',
      'Duplex LC, because 400G can run on a single pair with coherent optics.',
      'Base-24 MPO, because 400G requires 24 wavelengths.',
    ],
    answerIndex: 1,
    explanation:
      '400GBASE-SR4 uses 4 transmit lanes and 4 receive lanes = 8 fibers total. Base-8 MPO provides exactly 8 fibers, yielding 100% utilization. Base-12 MPO would leave 4 fibers dark in a 400G parallel-optic application. Source: module10 research log §1 (MPO/MTP section); vendor whitepapers from Corning, CommScope, FS. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-043',
    domain: 'Design ICT Solutions',
    prompt:
      'A sales engineer refers to a data center as "Tier III" in an RFP response citing TIA-942. Which correction is most accurate?',
    choices: [
      'No correction needed — TIA-942 uses Tier III terminology.',
      '"Tier III" is Uptime Institute\'s terminology (Roman numerals, performance-based). TIA-942-C uses "Rated 3" (Arabic numeral, prescriptive infrastructure). The phrase "TIA-942 Tier III" does not exist in the current standard.',
      '"Tier III" is correct in TIA-942; only the number changes between revisions.',
      'Only BICSI 002 uses the Rated terminology; TIA uses Tier.',
    ],
    answerIndex: 1,
    explanation:
      'Since Uptime Institute and TIA formally separated in 2014, Uptime owns "Tier" (I–IV, performance-based) and TIA-942 uses "Rated" (1–4, prescriptive). RFPs and vendor decks often conflate them, but an RCDD must distinguish them precisely. Source: Uptime Institute press release (uptimeinstitute.com, 2014); TIA-942-C white paper. [VERIFIED-public-source]',
  },

  {
    id: 'cs-044',
    domain: 'Design ICT Solutions',
    prompt:
      'ASHRAE TC 9.9 data center thermal guidelines define equipment intake air temperature classes. The A1 class (for most enterprise servers) has a recommended operating inlet temperature range of approximately:',
    choices: [
      '0°C to 10°C (32°F to 50°F)',
      '15°C to 32°C (59°F to 90°F)',
      '5°C to 45°C (41°F to 113°F)',
      '40°C to 60°C (104°F to 140°F)',
    ],
    answerIndex: 1,
    explanation:
      'ASHRAE TC 9.9 A1 class equipment has a recommended inlet air temperature range of approximately 15–32°C (59–90°F). Newer classes (A4) extend this to ~45°C. These ranges drive hot-aisle/cold-aisle set-points and containment design. Source: module10 research log §1 (ASHRAE TC 9.9 section); CKY engineering summary of ASHRAE TC 9.9. [VERIFIED-via-secondary-source]',
  },

  /* ---- Additional Design Depth ---- */
  {
    id: 'cs-045',
    domain: 'Design ICT Solutions',
    prompt:
      'A jacket color of "aqua" on a premises fiber cable indicates which fiber type per TIA-598?',
    choices: [
      'OS1 single-mode',
      'OM1 multimode (62.5/125)',
      'OM3 or OM4 laser-optimized 50/125 multimode',
      'OM5 wideband multimode',
    ],
    answerIndex: 2,
    explanation:
      'TIA-598 jacket color conventions: Yellow = single-mode (OS1/OS2). Orange = 62.5/125 OM1 or 50/125 OM2. Aqua = laser-optimized 50/125 (OM3, OM4). Lime green = OM5. Source: FOA color codes page; Brady fiber color-code guide; module07 research log §1.1. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-046',
    domain: 'Design ICT Solutions',
    prompt:
      'A macrobend on an OSP single-mode fiber cable is best detected using which OTDR test method?',
    choices: [
      'Single-wavelength OTDR at 1310 nm only.',
      'A dual-wavelength OTDR test at 1310 + 1550 nm (or 1550 + 1625 nm), where a macrobend shows as excess loss at the longer wavelength compared to the shorter.',
      'An OLTS power-meter measurement at 1625 nm only.',
      'A visual fault locator (VFL) at 650 nm, which shows macrobends as red spots.',
    ],
    answerIndex: 1,
    explanation:
      'Macrobend loss scales with wavelength — longer wavelengths are more sensitive to bending. A macrobend signature appears as extra loss at the longer wavelength compared to the shorter at the same physical location. The heuristic trigger used by VIAVI and others is >0.2 dB differential between the two test wavelengths. A VFL at 650 nm can visually show tight bends but is not a quantitative measurement. Source: VIAVI macrobend detection whitepaper; module08 research log §3.6. [VERIFIED-public-source]',
  },

  {
    id: 'cs-047',
    domain: 'Design ICT Solutions',
    prompt:
      'The FOA recommends arc-testing a fusion splicer before beginning a shift. Under what additional circumstances should an arc test be performed during the workday?',
    choices: [
      'Only when a splice shows 0.00 dB (a result that is suspiciously good).',
      'After electrode replacement, after more than 100 splices, and after any significant change in altitude, humidity, or temperature.',
      'Only at the start of a new cable reel.',
      'Arc testing is only required if the splicer is more than 5 years old.',
    ],
    answerIndex: 1,
    explanation:
      'FOA (via Fiber U and the Worldwide Tech Talk archives, Jim Hayes) recommends: pre-shift arc test + retest after electrode replacement, after >100 splices, and after any environmental change (altitude, humidity, temperature shift >10°C). Arc energy changes with air density and electrode wear; a drift in arc power degrades splice quality before the splicer starts reporting failures. Source: module04 research log §5.8; FOA Fiber U. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-048',
    domain: 'Design ICT Solutions',
    prompt:
      'Which statement correctly describes the TBB (Telecommunications Bonding Backbone) per ANSI/TIA-607-D/E?',
    choices: [
      'The TBB is the main busbar located in the building entrance facility.',
      'The TBB is the conductor that connects each Secondary Bonding Busbar (SBB, formerly TGB) back to the Primary Bonding Busbar (PBB, formerly TMGB) in the main EF.',
      'The TBB is a horizontal bonding conductor between adjacent server racks.',
      'The TBB is required only in buildings taller than 10 stories.',
    ],
    answerIndex: 1,
    explanation:
      'The TBB interconnects each SBB (per-TR busbar, formerly TGB) to the building-level PBB (formerly TMGB). TIA-607-D allows TBB sizing at 2 kcmil per linear foot up to a 750 kcmil maximum, replacing the older 3/0 AWG cap. Source: TIA-607-D/E summaries; NECA/BICSI 607-2011 free PDF; module06 research log §1.2. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-049',
    domain: 'Design ICT Solutions',
    prompt:
      'An armored OSP fiber cable with a metallic strength member enters a building. Per NEC Chapter 8 / Article 800 (Article 805 in NEC 2023), what must happen at the building entrance?',
    choices: [
      'The fiber strands must be connected to a listed primary protector.',
      'The metallic strength member of the armored cable must be bonded to the primary protector ground at the building entrance; the fiber strands themselves do not require a primary protector.',
      'The cable must be spliced to an indoor-rated cable within 50 ft of the entrance.',
      'Nothing — NEC Chapter 8 does not apply to fiber cables.',
    ],
    answerIndex: 1,
    explanation:
      'Fiber strands carry no electrical current and do not require a primary protector. However, the metallic strength member (armor, central metallic member) of an OSP cable entering a building must be bonded/grounded at the entrance to protect against induced voltages. This is a common RCDD exam distinction. Source: module06 research log §1.3 (NEC Article 800/805); NEC Chapter 8 (paid; principle cited via Mike Holt forum and module06 log). [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-050',
    domain: 'Design ICT Solutions',
    prompt:
      'A 12-fiber mass-fusion splicer is used on a 144-fiber ribbon cable. Which statement correctly describes core alignment vs. cladding alignment in this context?',
    choices: [
      'Ribbon splicers always use core alignment because each fiber is individually servoed.',
      'Ribbon mass-fusion splicers use cladding alignment by mechanical necessity — independent core-by-core servoing of 12 fibers simultaneously is not practical in current production equipment.',
      'Cladding alignment is only for multimode fiber; ribbon SMF always uses core alignment.',
      'Mass fusion splicers use laser-based core alignment that achieves ≤0.01 dB average loss.',
    ],
    answerIndex: 1,
    explanation:
      'Mass (ribbon) fusion splicers align on the outer 125 µm cladding — individually servo-ing 12 cores independently is not mechanically feasible in current ribbon equipment. Per ITU-T L.400 family (via Huber+Suhner and STL Tech), average splice loss on ribbon cables is ≤0.10 dB with outliers up to 0.15–0.20 dB. Source: module04 research log §3.5; Corning AEN 171; STL Tech ribbon-splicing whitepaper. [VERIFIED-via-secondary-source]',
  },

  /* ================================================================
   * DOMAIN: Support ICT Bid/Tender Process (~11% → target 7–8 questions)
   * Covers: RFP/RFI/RFQ, specifications, contract types, bid review,
   * standards compliance language, cost estimation, submittal review.
   * Source modules: 3, 11
   * ================================================================ */

  {
    id: 'cs-051',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'A fiber-deployment contract is structured as a Guaranteed Maximum Price (GMP). Which statement correctly describes the contractor\'s financial risk profile under a GMP compared to a lump-sum contract?',
    choices: [
      'GMP and lump-sum are identical in risk allocation.',
      'Under GMP, the owner shares in cost savings if the project comes in under the cap; the contractor bears costs above the guaranteed maximum (with limited exceptions for owner-directed changes). Under a pure lump-sum, the contractor bears all cost risk regardless of savings or overruns.',
      'GMP means the contractor is reimbursed for all actual costs plus a fee, with no ceiling.',
      'A lump-sum contract places all financial risk on the owner.',
    ],
    answerIndex: 1,
    explanation:
      'GMP: contractor bears overrun risk above the cap; owner and contractor often share in savings below the cap. Lump-sum: contractor assumes full cost risk; owner\'s cost exposure is fixed at contract price. Time-and-Materials (T&M): all cost risk is on the owner. Module 11 covers contract types in the context of fiber deployment bidding. Source: module11 research log; standard construction contract principles (AIA, EJCDC). [VERIFIED-public-source — contract law principles]',
  },

  {
    id: 'cs-052',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'When reviewing a bid for an FTTH project, which cost component is most commonly underestimated by bidders unfamiliar with aerial plant?',
    choices: [
      'Fiber cable material cost',
      'Make-ready (pole transfer, replacement, and violation remediation) cost',
      'OTDR testing labor',
      'Splicing consumables',
    ],
    answerIndex: 1,
    explanation:
      'Make-ready is the most commonly underestimated aerial cost. Per-pole make-ready can range from $40–$120 for simple work up to $500–$5,000 when reinforcement, transfers, or pole replacement are required. The NC Broadband Matters 2021 "Real Cost of Fiber" report specifically documents make-ready as a major budget variable. Source: module11 research log; NC Broadband Matters report; FBA/Cartesian cost reports. [VERIFIED-public-source]',
  },

  {
    id: 'cs-053',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'A tender specification for a BEAD-funded project references "BICSI RCDD-of-record" for design services. What does this terminology require from a responding bidder?',
    choices: [
      'The bidder must employ at least one person who has passed the RCDD written exam but may not yet be credentialed.',
      'The bidder must name a specific individual who holds a current, active BICSI RCDD credential and who will be responsible for the ICT design documents.',
      'The RCDD must personally perform all site surveys.',
      '"RCDD-of-record" is only required on government projects over $10M.',
    ],
    answerIndex: 1,
    explanation:
      '"RCDD-of-record" requires a named, credentialed individual (active BICSI RCDD) to be responsible for and seal/sign the ICT design documents. The RCDD credential is earned after passing the BICSI exam and meeting experience requirements; it is not satisfied by a pending or lapsed credential. Source: BICSI RCDD certification page (bicsi.org); module12 cert-sim research log. [VERIFIED-public-source]',
  },

  {
    id: 'cs-054',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'During the bid-review phase, a contractor\'s submittal for an aerial OSP project lists TIA-758-B as the governing standard but the project specification requires TIA-758-C. Which is the appropriate designer response?',
    choices: [
      'Accept the submittal because TIA-758-B and -C are identical.',
      'Issue a Request for Information (RFI) clarifying whether the contractor will comply with TIA-758-C and require a revised submittal citing the current revision.',
      'Approve the submittal with a minor note; older editions are always acceptable.',
      'Reject the bid outright without issuing an RFI.',
    ],
    answerIndex: 1,
    explanation:
      'When a submittal cites a superseded standard revision, the designer must not silently accept it. The correct process is to issue an RFI or non-conformance comment requiring the contractor to confirm compliance with the specified current revision (TIA-758-C) and revise the submittal accordingly. Source: general design-review practice consistent with BICSI TDMM and RCDD prep guides (framed as scenario; principles are standard contract administration). [VERIFIED-public-source — principles]',
  },

  {
    id: 'cs-055',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'A fiber deployment project\'s cost per foot comes in significantly higher than the FBA/Cartesian national median. Which factor is the MOST likely explanation in a rural Midwestern location?',
    choices: [
      'Rural locations always have cheaper labor.',
      'Longer average span lengths between poles reduce cost.',
      'Lower subscriber density means higher cost-per-home-passed, which increases cost per foot because the overhead (mobilization, permitting, engineering) is amortized over fewer revenue units per linear foot.',
      'Rural areas have less NESC compliance oversight.',
    ],
    answerIndex: 2,
    explanation:
      'FBA/Cartesian data shows rural cost per home passed of $3,000–$6,000 vs. urban $700–$1,500. In sparse rural areas, lower subscriber density per route mile means overhead costs are spread over fewer revenue-generating connections, driving up cost per foot and per home. Source: FBA/Cartesian annual cost reports (2023-dataset and 2024-dataset); module11 research log §1. [VERIFIED-public-source]',
  },

  {
    id: 'cs-056',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'A project specification requires that all outdoor fiber closures be listed to Telcordia GR-771. A vendor submits a closure that carries only an IP68 rating. Which is the correct designer position?',
    choices: [
      'IP68 equals GR-771; accept the submittal.',
      'IP68 is an IEC/NEMA ingress-protection rating for dust and water; it is not equivalent to GR-771, which includes temperature cycling, vibration, and additional environmental tests. Request the GR-771 test report.',
      'GR-771 is only for indoor closures; accept IP68 for outdoor.',
      'Accept the submittal because GR-771 is optional for non-telecom applications.',
    ],
    answerIndex: 1,
    explanation:
      'GR-771 (Telcordia/ATIS) specifies qualification testing for outside-plant fiber closures, including temperature cycling, moisture, vibration, and UV exposure tests beyond what IP68 covers. IP68 addresses only dust/water intrusion at static pressure. A submitter must provide GR-771 test reports to satisfy that specification. Source: module04 research log §4.5 (Telcordia GR-771 reference); general procurement principles. [VERIFIED-via-secondary-source — GR-771 is paywalled; the contrast with IP68 is standard practice]',
  },

  {
    id: 'cs-057',
    domain: 'Support ICT Bid/Tender Process',
    prompt:
      'On a T&M (Time and Materials) fiber project, labor constitutes approximately what percentage of total deployed cost, per the FBA/Cartesian report?',
    choices: [
      'Approximately 20–30%',
      'Approximately 40–50%',
      'Approximately 60–80%',
      'Approximately 90%+',
    ],
    answerIndex: 2,
    explanation:
      'FBA/Cartesian and multiple other sources consistently report that labor constitutes approximately 60–80% of total deployed fiber cost in the U.S. This is why cost-per-foot varies so dramatically by region — local labor market rates dominate the budget. Source: FBA/Cartesian 2024 report; module11 research log §1. [VERIFIED-via-secondary-source]',
  },

  /* ================================================================
   * DOMAIN: Support ICT Installation (~16% → target 10–11 questions)
   * Covers: construction oversight, inspection, testing acceptance,
   * commissioning, as-built documentation, safety (811, dig-safe),
   * OTMR compliance, FOA CFOS installation roles, site supervision.
   * Source modules: 2, 3, 4, 8, 9, 11
   * ================================================================ */

  {
    id: 'cs-058',
    domain: 'Support ICT Installation',
    prompt:
      'A contractor is ready to install conduit in a public ROW. Which call must be made at least two working days (federal standard; some states require more) before any excavation begins?',
    choices: [
      'The BICSI inspection hotline',
      '811 (the national "Call Before You Dig" one-call number, managed by the Common Ground Alliance)',
      '911 (emergency services)',
      'The local fiber co. splice center',
    ],
    answerIndex: 1,
    explanation:
      '811 is the federally designated one-call number for "Call Before You Dig," administered by state one-call programs affiliated with the Common Ground Alliance (CGA). All excavators are legally required to call 811 before digging. Source: CGA 811 program page (commongroundalliance.com/811); module09 research log §1.5. [VERIFIED-public-source]',
  },

  {
    id: 'cs-059',
    domain: 'Support ICT Installation',
    prompt:
      'During a fiber installation inspection, you observe that a cable pulling crew is not tracking pulling tension. The cable is being pulled through a 4-inch conduit with a 90° bend. What risk does this create?',
    choices: [
      'No risk — fiber cables have unlimited tensile strength.',
      'Exceeding the cable\'s maximum installation tension (commonly ~600 lbf / 2670 N for OSP cables; cable-specific) and the maximum allowable sidewall pressure (tension × bend angle / radius) can cause fiber breaks, coating damage, or microbend-induced attenuation increases.',
      'The NESC loading district classification changes.',
      'The 811 locate tickets expire during the pull.',
    ],
    answerIndex: 1,
    explanation:
      'OSP cable maximum installation tension is cable-specific, but Corning SRP-005-011 and OCC 206-2 cite a typical limit of ~600 lbf (2670 N). Sidewall pressure at bends is calculated as T × sin(θ) / r; exceeding it causes jacket damage, fiber breaks, or microbends. Both pulling tension and sidewall pressure must be monitored during installation. Source: Corning SRP-005-011; OCC 206-2; module09 research log §1.7. [VERIFIED-public-source]',
  },

  {
    id: 'cs-060',
    domain: 'Support ICT Installation',
    prompt:
      'A field crew completes a splicing job and submits OTDR traces as the acceptance deliverable. The project spec also required OLTS insertion-loss measurements. The crew argues "the OTDR shows all splices are good — OLTS is redundant." Which response is correct?',
    choices: [
      'The crew is correct; OTDR shows all relevant losses.',
      'OLTS insertion-loss measurement (tier-1) is the only instrument that provides a direct power-domain measurement of link loss. OTDR (tier-2) calculates loss from backscatter and is not a substitute for OLTS when the spec requires it. Both tests are required.',
      'OLTS is only required on multimode fiber.',
      'The OTDR trace can be post-processed to generate an OLTS equivalent.',
    ],
    answerIndex: 1,
    explanation:
      'OLTS tier-1 is the direct power measurement required by TIA-568 for cabling certification. OTDR is a backscatter-based characterization tool — it provides event location and estimated losses but is not a power-meter measurement. They measure different things; the spec requiring both is correct, and neither substitutes for the other. Source: FOA OTDR reference page; Fluke "OLTS + OTDR" guide; module08 research log §3.2. [VERIFIED-public-source]',
  },

  {
    id: 'cs-061',
    domain: 'Support ICT Installation',
    prompt:
      'During aerial fiber installation, the crew chief reports that the sag on a 200 ft span exceeds the design sag table value. Which is the most appropriate first action for the designer/inspector?',
    choices: [
      'Accept the deviation because sag tolerance is ±24 in. by default.',
      'Check the actual cable tension against the sag-tension relationship for the span length, loading district, and installation temperature; over-sag typically indicates under-tension, which may violate the NESC clearance requirement by reducing the wire height at mid-span.',
      'Order the strand replaced immediately.',
      'Record the deviation in the as-built drawings and move on.',
    ],
    answerIndex: 1,
    explanation:
      'Sag and tension are directly related: excess sag means the cable is under-tensioned, which reduces the installed height at mid-span. If mid-span height drops below the NESC Rule 232 minimum clearance over the road/pedestrian/rail area, the installation is non-compliant and must be corrected before the span is loaded with cable. Source: Module 2 NESC clearances; NESC Rule 232 (clearance dependent on sag); ikeGPS NESC clearance summary. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-062',
    domain: 'Support ICT Installation',
    prompt:
      'As-built (record) drawings for a fiber OSP project should include which items per standard industry practice?',
    choices: [
      'Only the splice locations and fiber counts.',
      'Cable routes (with GPS/GIS coordinates or surveyed centerline), conduit sizes and depths, splice locations, fiber assignments, handhole/manhole IDs, reel numbers, and OTDR/OLTS test results indexed to each span.',
      'Only the contractor\'s invoice and schedule.',
      'A narrative description of the route; drawings are not required for underground plant.',
    ],
    answerIndex: 1,
    explanation:
      'Complete as-built documentation for OSP fiber includes route coordinates/GIS, conduit details, splice closure locations and contents, fiber continuity assignments, handhole/manhole IDs, cable reel serial numbers (for warranty tracking), and test results (OTDR traces and OLTS loss reports) indexed to each span. This is the standard deliverable required by municipalities, carriers, and BEAD grant programs. Source: Module 7 fiber topology / documentation module; standard OSP project closeout requirements (VDOT, FDOT, RUS). [VERIFIED-public-source — principle]',
  },

  {
    id: 'cs-063',
    domain: 'Support ICT Installation',
    prompt:
      'A cable-blowing unit (pressure-assisted installation) is being used to install microduct fiber. The crew reports the cable has stopped advancing at approximately 60% of the designed span. Which is the most common cause?',
    choices: [
      'The fiber\'s IOR setting was incorrect on the blowing computer.',
      'An obstruction or collapsed section in the microduct, or a bend radius violation creating excessive friction; verify the duct path and re-inspect the section where resistance increased.',
      'The compressor exceeds the cable\'s rated installation temperature.',
      'The fill calculation was performed with the wrong cable OD.',
    ],
    answerIndex: 1,
    explanation:
      'Mid-span stoppage during cable blowing is most commonly caused by a duct obstruction, a collapsed microduct section, or a bend radius violation creating excessive drag. The corrective action is to verify the duct path (re-mandrel, inspect, camera the duct) before any additional force is applied. Source: OCC 206-3 conduit guidelines; module09 research log §1.4 (cable-blowing and conduit installation). [VERIFIED-public-source — principles]',
  },

  {
    id: 'cs-064',
    domain: 'Support ICT Installation',
    prompt:
      'A subcontractor performing a firestopping installation deviates from the UL-listed system by increasing the annular space between the cable bundle and the sleeve from 0.5 in. (listed) to 1.1 in. (as-built). Under IBC requirements, which statement is correct?',
    choices: [
      'The larger annular space provides more sealant, so it is more fire-resistant.',
      'The installation no longer matches the listed system. The installer must either (a) obtain a written engineering judgment (EJ) from the firestop manufacturer confirming the modified assembly meets performance intent, or (b) correct the opening to match the listed system. An unlisted assembly that "looks like" a listed one is not code-compliant.',
      'A 10% deviation from listed parameters is always acceptable without documentation.',
      'Only the F-rating matters; annular space is not part of the listing.',
    ],
    answerIndex: 1,
    explanation:
      'UL-listed firestop systems are tested as-assembled. Any deviation — including annular space — voids the listing. IBC requires compliance with the listed system or a written engineering judgment (EJ) from the manufacturer. AHJs vary in their acceptance of EJs. Source: IFC PEN2 firestop primer; Hilti annular-space Q&A; module06 research log §3.1. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-065',
    domain: 'Support ICT Installation',
    prompt:
      'After a fiber restoration event (a dig-in), what is the minimum set of documentation an OSP contractor should deliver to the asset owner?',
    choices: [
      'A verbal confirmation that the fiber is lit.',
      'As-built sketch of the repair location with GPS coordinates, splice-case ID, fiber count repaired, OTDR traces before and after repair (bidirectional), and reel number/batch of new cable used.',
      'The contractor\'s warranty certificate only.',
      'An email noting the repair date and technician name.',
    ],
    answerIndex: 1,
    explanation:
      'Restoration documentation must be sufficient to update the GIS/fiber-management system. Minimum: GPS-referenced location, splice-case documentation, fiber count, bidirectional OTDR traces, and cable reel traceability. This allows future troubleshooting and supports warranty claims. Source: Module 7 documentation module; module09 construction log; standard utility restoration documentation requirements. [VERIFIED-public-source — principles]',
  },

  {
    id: 'cs-066',
    domain: 'Support ICT Installation',
    prompt:
      'FOA CFOS/S (Certified Fiber Optic Specialist in Splicing) requires both a written exam and a practical component. Which statement correctly describes the practical requirement?',
    choices: [
      'The practical is optional for candidates with 5 or more years of experience.',
      'The practical component is administered by an FOA-approved instructor or school and includes hands-on splicing demonstrations; a passing written-exam score is necessary but not sufficient — the practical must also be passed.',
      'The practical is only required for CFOS/O (Outside Plant specialty), not CFOS/S.',
      'The practical component was eliminated after 2020.',
    ],
    answerIndex: 1,
    explanation:
      'FOA CFOS/S requires a written exam (closed-book, 70% pass) AND a hands-on practical component when taken through an FOA-approved school. A passing written score is necessary but not sufficient — the practical must be satisfied separately. The platform\'s cert-sim covers the written component only; students must schedule the practical through an approved FOA school. Source: FOA certifications page (thefoa.org/Certs.htm); FOA-approved trainer pages; module12 research log §1. [VERIFIED-via-secondary-source]',
  },

  {
    id: 'cs-067',
    domain: 'Support ICT Installation',
    prompt:
      'When inspecting a direct-buried fiber cable installed without conduit in a road shoulder, you note the burial depth is 26 in. (660 mm). The project specification requires 36 in. (914 mm) in accordance with RUS 1751F-630. Which action is correct?',
    choices: [
      'Accept the installation because 26 in. meets the NEC 830.47 minimum of 18 in.',
      'Issue a non-conformance and require the contractor to expose and re-bury to 36 in. in accordance with the project specification, or obtain a written deviation approval from the owner / engineer of record.',
      'Accept the installation if it is within a vegetated area.',
      'Issue a field instruction reducing the spec to 24 in.',
    ],
    answerIndex: 1,
    explanation:
      '26 in. meets the NEC 830.47 minimum (18 in.) but does not meet the project specification\'s 36 in. requirement. A project specification can be more stringent than the code minimum; the designer must enforce the specification or formally authorize a deviation through the change-order or engineering-deviation process. Source: module09 research log §1.7; RUS 1751F-630; general construction administration principles. [VERIFIED-public-source]',
  },

  {
    id: 'cs-068',
    domain: 'Support ICT Installation',
    prompt:
      'During commissioning of a GPON FTTx network, a subscriber\'s ONT shows a receive power of −28 dBm against a link budget ceiling of −27 dBm (class B+ budget). The installer checks the splice and connector losses and they all pass individual acceptance criteria. What is the most likely undetected issue?',
    choices: [
      'The OLT is too far from the splitter.',
      'There is an accumulation of small losses — multiple connectors each at or near their maximum, extra fiber length, and/or a bend somewhere in the drop — that individually pass but together exceed the budget.',
      'The GPON protocol is incompatible with the ONT.',
      'The fiber attenuation was measured at 1310 nm instead of 1490 nm.',
    ],
    answerIndex: 1,
    explanation:
      'Link budgets are cumulative: individually acceptable losses that all sit near the top of their allowable range can sum past the system budget. This is why a link budget is calculated end-to-end and why design margin exists. The fix is a systematic loss audit: measure each component and sum them; identify the highest-loss component for remediation. Source: FOA link-budget principles (foa.org/tech/lossbudg.htm); Module 1 fiber physics; module04 connector/splice loss sections. [VERIFIED-public-source]',
  },

]; // end CERT_BANK

// Verify bank size at module load (development guard, stripped in production build)
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') {
  const expected = Object.keys(DOMAIN_WEIGHTS);
  const found = [...new Set(CERT_BANK.map(q => q.domain))];
  const missing = expected.filter(d => !found.includes(d));
  if (missing.length) console.warn('[cert-sim-bank] Missing domains:', missing);
  console.log(`[cert-sim-bank] ${CERT_BANK.length} questions loaded across ${found.length} domains.`);
}
