/**
 * Module 7 — Fiber Topology & Matrix flashcard deck
 *
 * 8 cards covering:
 *   - TIA-598 12-color sequence (full, VERIFIED)
 *   - Jacket color codes by fiber type (VERIFIED)
 *   - Connector boot colors (VERIFIED)
 *   - Splice matrix fundamentals
 *   - Fiber pathing / "where does fiber 73 go?"
 *   - Topology engine vs. Excel/Visio stack
 *   - Platform canonical CSV schema (editorial default, not a standard)
 *   - Industry tools quick reference
 *
 * Sources documented in docs/research-logs/module07-fiber-topology.md.
 * VERIFIED = cross-confirmed via FOA, Brady, Broadband Library, Wikipedia.
 * UNVERIFIED items (Synchronoss Spatial Suite, ARAMIS ownership) are flagged.
 */

export const MODULE07_FLASHCARDS = [
  {
    id: 'm7-tia598-sequence',
    front: 'Recite the TIA-598 12-color fiber sequence, positions 1–12.',
    back: [
      '1  Blue',
      '2  Orange',
      '3  Green',
      '4  Brown',
      '5  Slate  (field: "gray")',
      '6  White',
      '7  Red',
      '8  Black',
      '9  Yellow',
      '10 Violet',
      '11 Rose   (field: "pink")',
      '12 Aqua',
      '',
      'Mnemonic: "Big Orange Gorillas Build Strong Walls — Red Bricks Yellow Violet-Rose Architecture"',
      'Status: VERIFIED via FOA, Brady, Broadband Library, Wikipedia (TIA-598-C).',
    ].join('\n'),
    tags: ['M7', 'TIA-598', 'color-code'],
  },
  {
    id: 'm7-jacket-colors',
    front: 'What cable jacket color does TIA-598 assign to OS2, OM3/OM4, and OM5?',
    back: [
      'OS1 / OS2 (single-mode):       Yellow',
      'OM1 (62.5/125 µm multimode):   Orange',
      'OM2 (50/125 µm multimode):     Orange',
      'OM3 / OM4 (laser-optimized MM): Aqua',
      'OM5 (wideband multimode):      Lime green ("ericalime")',
      '',
      'Status: VERIFIED via Corning + CommScope product catalogs and Wikipedia TIA-598 article.',
    ].join('\n'),
    tags: ['M7', 'TIA-598', 'jacket-color', 'fiber-type'],
  },
  {
    id: 'm7-connector-boot-colors',
    front: 'Connector boot/housing colors: what does blue vs. green vs. aqua vs. beige mean?',
    back: [
      'Beige:      OM1 multimode (62.5/125 µm, legacy)',
      'Black:      OM2 multimode (50/125 µm, pre-laser-optimized)',
      'Aqua:       OM3 / OM4 multimode (matches jacket color)',
      'Lime green: OM5 multimode (matches jacket color)',
      'Blue:       Single-mode UPC (ultra-physical contact)',
      'Green:      Single-mode APC (angled physical contact)',
      '',
      'CRITICAL: NEVER mate a green (APC) connector to a blue (UPC) connector.',
      'The angled ferrule will be damaged and back-reflection spikes.',
      '',
      'Status: VERIFIED via FOA and Brady references.',
    ].join('\n'),
    tags: ['M7', 'connector', 'APC', 'UPC', 'color-code'],
  },
  {
    id: 'm7-fiber73',
    front: 'How do you find "fiber 73" in a 144F 12-tube loose-tube cable?',
    back: [
      'Step 1 — Math: 73 ÷ 12 = 6 full tubes (72 fibers), remainder 1.',
      'Step 2 — Tube: the 7th tube = Red (TIA-598 position 7).',
      'Step 3 — Fiber: position 1 within that tube = Blue (TIA-598 position 1).',
      'Address: Tube 7 (Red) / Fiber 1 (Blue).',
      '',
      'Then, for each downstream splice closure:',
      '  • Find the splice sheet row for that tube + fiber position.',
      '  • Read the peer cable ID, peer tube color, peer fiber position.',
      '  • Repeat until you reach an active port or a dead end.',
      '  • Sanity-check: OTDR distance should match the splice sheet hop distance.',
      '',
      'Field note: "fiber 73" alone is not a complete address. Splicers often',
      'restart numbering at splice trays. The splice sheet is the translation table.',
    ].join('\n'),
    tags: ['M7', 'fiber-pathing', 'splice-sheet', 'field-workflow'],
  },
  {
    id: 'm7-splice-matrix',
    front: 'What is a splice matrix, and what standard governs its layout?',
    back: [
      'A splice matrix (aka splice sheet / splice schedule) maps every fiber',
      'in one cable to the fiber it is joined to at a given splice point.',
      'It is the primary signed-off record of the physical plant — more',
      'authoritative than the GIS map or the Visio diagram.',
      '',
      'Standard governing layout: NONE. There is no ANSI/TIA standard',
      'prescribing the format. Common layouts:',
      '  • Row-per-fiber (dominant Excel format)',
      '  • Two-cable side-by-side (straight-through splices)',
      '  • Splice-closure cassette layout (mirrors hardware tray order)',
      '',
      'Platform canonical CSV columns (editorial default, not a standard):',
      '  cable_id, tube_color, fiber_position, fiber_color,',
      '  splice_point_id, splice_position,',
      '  peer_cable_id, peer_tube_color, peer_fiber_position,',
      '  peer_fiber_color, loss_db, notes',
      '',
      'Source: Splice.me blog (origins-of-fiber-optic-splice-sheets-part-1).',
    ].join('\n'),
    tags: ['M7', 'splice-matrix', 'documentation'],
  },
  {
    id: 'm7-topology-engine-vs-excel',
    front: 'Textbook vs. field: what is the "system of record" for fiber topology in most small-to-mid ISPs?',
    back: [
      'Textbook (RCDD / OSP study guides):',
      '  "Design and operate in a fiber management system (TMS)."',
      '',
      'Field reality (documented in trade press and community forums):',
      '  Most small-to-mid ISPs maintain THREE parallel sources of truth:',
      '    1. The GIS / topology engine — usually the most out of date.',
      '    2. The as-built Excel — kept by the splicer who did the work.',
      '    3. The Visio splice diagram — drawn for close-out, never updated.',
      '',
      'The "16 north / 6 south Excel files" example (Splice.me blog):',
      '  A real mid-size ISP with 16 Excel files in a "north" folder and',
      '  6 in "south," each file = one fiber cluster, each tab = one splice.',
      '  This is a working network, not a cautionary tale.',
      '',
      'Teaching implication: reconciling these three sources is the real skill.',
      'The topology engine does not eliminate the Excel; it has to replace it',
      'by proving it is easier to maintain.',
    ].join('\n'),
    tags: ['M7', 'topology-engine', 'Excel', 'field-vs-book'],
  },
  {
    id: 'm7-vendor-tools-tiers',
    front: 'Which fiber topology tools are common at small contractors, mid-size ISPs, and Tier-1 carriers?',
    back: [
      'Small contractors / small ISPs:',
      '  Excel + Visio + Bluebeam (the de facto stack)',
      '  Splice.me (purpose-built splice diagrams; free trial)',
      '',
      'Mid-size ISPs / munis / co-ops:',
      '  VETRO FiberMap (cloud GIS; strong in this tier)',
      '  netTerrain OSP (Graphical Networks; DCIM-adjacent)',
      '  OZmap (Brazilian-origin; growing globally)',
      '',
      'Large / Tier-1 carriers and incumbents:',
      '  IQGeo Network Manager (geospatial digital twin; expensive)',
      '  3-GIS (copper + fiber lifecycle; incumbents)',
      '  Bentley OpenComms Designer (CAD-based; cable MSO + utility)',
      '',
      '⚠ UNVERIFIED (product lines in flux as of 2026):',
      '  Synchronoss Spatial Suite — ownership chain unclear; confirm',
      '  before citing in any procurement document.',
      '  ARAMIS — current ownership unconfirmed; may be part of Render Networks.',
    ].join('\n'),
    tags: ['M7', 'tools', 'VETRO', '3-GIS', 'IQGeo', 'Bentley', 'field-vs-book'],
  },
  {
    id: 'm7-multigroup-tracer',
    front: 'For a 24-fiber single-tube cable, how does TIA-598 handle fibers 13–24?',
    back: [
      'The same 12 colors repeat for fibers 13–24, but each fiber in the',
      'second group carries a TRACER STRIPE to distinguish it from the',
      'first group.',
      '',
      'Example (Corning standard):',
      '  Fiber 13 = Blue with black tracer stripe',
      '  Fiber 14 = Orange with black tracer stripe',
      '  ...continuing through...',
      '  Fiber 24 = Aqua with black tracer stripe',
      '',
      'For multi-tube cable: buffer tubes 13–24 follow the same repeat +',
      'tracer convention for the tubes themselves.',
      '',
      '⚠ Tracer color is NOT standardized with the same authority as the',
      'base sequence. Corning uses black stripe; other vendors use red or',
      'yellow tracers.',
      '',
      'Exam answer: "second group uses the same 12 colors with a tracer."',
      'Field answer: "read the vendor cable legend printed on the sheath."',
      '',
      'Status: VERIFIED via FOA, Brady, Wikipedia for the repeat-with-tracer',
      'convention; tracer color variability confirmed via vendor specs.',
    ].join('\n'),
    tags: ['M7', 'TIA-598', 'multi-tube', 'tracer', 'color-code'],
  },
];

/**
 * Convenience re-export so the module can be merged into the cross-module
 * ALL_FLASHCARDS bank in src/data/flashcards.js if desired.
 */
export default MODULE07_FLASHCARDS;
