/**
 * Module 9 — OSP Construction flashcard deck.
 *
 * 7 cards covering the key field-vs-textbook numbers for HDD, burial depth,
 * conduit fill, pull tension, slack loops, locate-before-dig, and as-built
 * reconciliation.
 *
 * Sources documented in docs/research-logs/module09-osp-construction.md.
 * Verification tags match the editorial posture in Module09_OSPConstruction.jsx:
 *   VERIFIED-public-source / VERIFIED-via-secondary-source / UNVERIFIED-needs-paid-doc.
 */

export const MODULE09_FLASHCARDS = [
  {
    id: 'm9-burial-depth',
    front: 'Burial depth for direct-buried OSP fiber — what number, and does it vary?',
    back: [
      'RUS 1751F-635 / OCC 206-4 general guidance: 36 in (91 cm). [VERIFIED-public-source]',
      'NEC 830.47 absolute floor: 18 in (network-powered broadband). [VERIFIED-via-secondary-source — NEC paywalled]',
      'State DOT ROW: 42–48 in typical (CalTrans ~42 in within highway ROW; FDOT per 18202 trench profile). [VERIFIED-public-source secondary]',
      'AHJ overrides every textbook number. Look up the permit before setting blade depth.',
    ].join(' | '),
    tags: ['M9', 'burial', 'AHJ', 'field-vs-book'],
  },
  {
    id: 'm9-install-methods',
    front: 'Three primary underground OSP installation methods — and which soil wins each?',
    back: [
      'HDD (horizontal directional drilling): crossings under roads, rivers, paved areas; surface restoration prohibited.',
      'Open trenching: any soil; highest restoration cost; used when conduit count is too high for plowing or existing infrastructure must be bridged.',
      'Vibratory plowing: long rural runs in cooperative soil (clay, sandy loam, black dirt); fails in rock, shale, or high water table.',
      'Cost ranking shifts with soil — FBA/Cartesian 2025 report: plowing ~$11.88/ft, trenching ~$19.00/ft rural median, but ranking reversed in 2023 report. Price the inputs, not the method.',
    ].join(' | '),
    tags: ['M9', 'HDD', 'trenching', 'plowing', 'cost'],
  },
  {
    id: 'm9-pull-tension',
    front: 'Maximum pull tension for typical OSP loose-tube fiber cable — book vs. field reality?',
    back: [
      'Book / datasheet: 600 lbf (2,670 N) for typical OSP loose-tube — Corning SRP-005-011, OCC 206-2, ICC reference. ALWAYS verify per the specific cable datasheet. [VERIFIED-public-source]',
      'HDD pullback field reality: tension at the drill rig ≠ tension at the cable. Bore-path friction, mud weight, and curvature add load.',
      'Safety device: calibrated breakaway swivel set to the LOWEST-rated sub-duct in the bundle.',
      'Engineering check: use PPI MAB HDD Tensile Loads equations for long or curved bores. [VERIFIED-public-source]',
    ].join(' | '),
    tags: ['M9', 'pull-tension', 'HDD', 'field-vs-book'],
  },
  {
    id: 'm9-conduit-fill',
    front: 'Conduit fill limits — book number vs. microduct jetting reality?',
    back: [
      'Book (NEC Chapter 9 Table 1, 3+ conductors): 40% maximum. [VERIFIED-via-secondary-source — NEC paywalled]',
      'BICSI/TIA telecom innerduct convention: 25% initial / 40% maximum. [VERIFIED-via-secondary-source — BICSI paywalled]',
      'Microduct jetting field reality: 50–70%+ by cross-section is routine. The 40% rule was written for pull installation; jetting eliminates the friction constraint.',
      'Exam answer: 40% (NEC) or 25%/40% (BICSI). Job answer: depends on installation method.',
    ].join(' | '),
    tags: ['M9', 'conduit-fill', 'microduct', 'field-vs-book'],
  },
  {
    id: 'm9-innerduct-color',
    front: 'What does APWA orange mean for underground telecom — and does it prescribe innerduct color?',
    back: [
      'APWA orange = telecommunications and CATV surface marking (locate paint, flags, warning tape). This is normative. [VERIFIED-public-source — CGA Marking Standards Manual v10]',
      'Innerduct color: orange is the common contractor convention for the primary telecom sub-duct, with green/blue/red/yellow/black for additional sub-ducts.',
      'No verified national normative standard for innerduct color sequence exists. RUS 1751F-643 may specify a sequence — UNVERIFIED-needs-paid-doc.',
      'Teach orange as APWA surface marker (normative); teach sub-duct color convention as supplementary and carrier/contractor-specific.',
    ].join(' | '),
    tags: ['M9', 'innerduct', 'APWA', 'color-code', 'verify'],
  },
  {
    id: 'm9-slack-loops',
    front: 'Slack loop lengths at access points — common contract bands?',
    back: [
      'Intermediate handhole (no planned splice): 50 ft — enough for splice-trailer reach if a future mid-span splice is needed.',
      'Designated splice point: 100 ft — allows cable to reach trailer above grade with working length remaining.',
      'Building entrance handhole: 100–150 ft — for demarcation, interior routing, and future re-termination.',
      'Aerial-to-buried transition: 25–50 ft.',
      'Source: OFS IP-009, Cabling Installation & Maintenance. [VERIFIED-public-source for the bands] The CONTRACT specifies the binding number — these are common bands, not a normative standard.',
    ].join(' | '),
    tags: ['M9', 'slack', 'handhole', 'splicing', 'field-vs-book'],
  },
  {
    id: 'm9-asbuilt-gap',
    front: 'As-built vs. as-designed reconciliation — what are the most common failure modes?',
    back: [
      'HDD bore depth on locator log ≠ actual bore depth. Steering-tool readings are interpolated; rod deviates in hard soil.',
      'Splice points moved 25–50 ft to avoid obstacles; GIS shows wrong location.',
      'Vault sizes downsized to fit road-cut permit; future cable count exceeds capacity.',
      'OTDR trace archive not submitted with as-built — no optical baseline for future fault comparison (links to Module 8).',
      'Workflow to teach: design in GIS → field redlines → reconcile within 30 days → freeze record drawing → retain as-designed for change-order traceability. Tools: 3-GIS, VETRO FiberMap, IQGeo, ESRI ARCFM.',
    ].join(' | '),
    tags: ['M9', 'as-built', 'GIS', 'HDD', 'field-vs-book'],
  },
];

/** Convenience re-export so the module-level deck filter in flashcards.js
 *  can import and spread this array. */
export default MODULE09_FLASHCARDS;
