/**
 * Module 6 — RCDD Prep: Building ICT Systems
 * Flashcard bank: 8 cards covering firestopping, EMC, separation,
 * grounding/bonding, surge, and primary protection.
 *
 * Sources documented in docs/research-logs/module06-rcdd-core.md.
 * Tags per docs/field-vs-textbook-research.md:
 *   VERIFIED-public-source     — primary public doc (eCFR, IEEE SA abstract, UL public summary)
 *   VERIFIED-via-secondary-source — confirmed across ≥ 2 independent secondary sources
 *   UNVERIFIED-needs-paid-doc  — value appears in multiple secondaries but exact standard text is paywalled
 */

export const MODULE06_FLASHCARDS = [
  {
    id: 'm6-frating',
    front: 'UL 1479 F / T / L / W ratings — what does each measure?',
    back: [
      'F (Flame): hours resisting flame passage through the barrier.',
      'T (Temperature): hours the unexposed-side temp rise stays ≤ 325 °F (181 °C) above ambient. T ≤ F always.',
      'L (Leakage): cfm of air/smoke leakage at ambient and 400 °F. Required for smoke-resistive assemblies (e.g., I-2 healthcare).',
      'W (Water): withstands 3-ft water column 72 hrs + fire/hose test. Floor slabs, exterior walls.',
      'Source: VERIFIED-via-secondary-source — IFC PEN2 primer; Unique Fire Stop Products.',
    ].join(' | '),
    tags: ['M6', 'firestopping', 'UL1479'],
  },
  {
    id: 'm6-ul-system-number',
    front: 'UL through-penetration firestop system number: what does the first letter mean? Give examples.',
    back: [
      'W = wall (fire-resistive wall assembly).',
      'F = floor only.',
      'C = floor or wall (most versatile; widely specified for cable bundles).',
      'Example: W-L-3025 = wall / L-series cable assembly / gypsum barrier.',
      'Example: C-AJ-1xxx = floor or wall / cable penetration through concrete.',
      'Full second/third-letter legend: UNVERIFIED-needs-paid-doc (UL Fire Resistance Dir., paywalled).',
      'Free lookup: productiq.ulprospector.com (filter by barrier + penetrant).',
    ].join(' | '),
    tags: ['M6', 'firestopping', 'UL-system-number'],
  },
  {
    id: 'm6-ej',
    front: 'What is an Engineering Judgment (EJ) in firestopping, and when is it needed?',
    back: [
      'EJ = a written document from the firestop manufacturer\'s technical service stating that a field deviation (wrong annular space, different mineral wool density, extra cable row) is at least as effective as the tested listed assembly.',
      'Needed when: as-built conditions don\'t match the listed system\'s parameters.',
      'Key facts: EJ is NOT a UL listing. AHJ acceptance varies. Never substitute EJ for designing to the listing from the start.',
      'Source: VERIFIED-via-secondary-source — Hilti Engineering Ask; module06-rcdd-core log §3.',
    ].join(' | '),
    tags: ['M6', 'firestopping', 'EJ', 'field-vs-book'],
  },
  {
    id: 'm6-fcc-pt15',
    front: 'FCC Part 15 Class A vs. Class B — key differences?',
    back: [
      'Class A: commercial / industrial equipment (not for residential use). Test distance: 10 m.',
      'Class B: residential equipment. Test distance: 3 m. Limits ≈ 6–10 dB MORE stringent than Class A.',
      'Both are unintentional-radiator limits under 47 CFR §15.109.',
      'Source: VERIFIED-public-source — 47 CFR §15.109 (eCFR, public law); cross-confirmed Compliance Testing Inc.',
    ].join(' | '),
    tags: ['M6', 'EMC', 'FCC-Part-15'],
  },
  {
    id: 'm6-tia569-sep',
    front: 'TIA-569 power/telecom separation table — three breakpoints for open, unshielded pathway?',
    back: [
      '< 2 kVA unshielded power → 5 in. (127 mm).',
      '2–5 kVA unshielded power → 12 in. (305 mm).',
      '> 5 kVA unshielded power → 24 in. (610 mm).',
      'Halve the distance when telecom is in a grounded metallic conduit.',
      'Zero separation when BOTH are in separate grounded metallic conduits.',
      'Source: VERIFIED-via-secondary-source — Winnie Industries; Border States; Elliott Electric; CommScope TP-106296. Exact TIA-569-E text: UNVERIFIED-needs-paid-doc.',
    ].join(' | '),
    tags: ['M6', 'separation', 'TIA-569', 'field-vs-book'],
  },
  {
    id: 'm6-tia607-hierarchy',
    front: 'TIA-607 grounding hierarchy: TMGB / TBB / TGB — roles and TBB sizing rule?',
    back: [
      'TMGB (Telecom Main Grounding Busbar): one per building, in EF/MDF. Bonded to building GES.',
      'TBB (Telecom Bonding Backbone): runs TMGB → each TGB. Sizing: 2 kcmil per linear foot of length, max 750 kcmil (TIA-607-D).',
      'TGB (Telecom Grounding Busbar): one per TR. Local bonding for equipment, shields, SPDs.',
      'Example: 100-ft TBB = 200 kcmil ≈ 4/0 AWG. Most short runs fall below 6 AWG minimum → 6 AWG minimum governs.',
      'Source: VERIFIED-via-secondary-source — NECA/BICSI 607-2011 free PDF; EC&M grounding guidelines.',
    ].join(' | '),
    tags: ['M6', 'grounding', 'TIA-607', 'TMGB', 'TBB', 'TGB'],
  },
  {
    id: 'm6-isolated-ground-myth',
    front: 'Isolated "clean" ground for telecom/IT — what does IEEE 1100 say, and why is it dangerous?',
    back: [
      'IEEE 1100 (Emerald Book) Chapter 9: ALL grounding subsystems (power, SPD, telecom) must connect to a SINGLE, COMMON bonded GES. Isolated grounds are NOT recommended.',
      'Danger: a separate unbonded electrode creates a ground potential difference between the telecom system and the rest of the building — drives damaging surge current through equipment ports.',
      'Legitimate alternative: single-point grounded reference plane (SPGRP) — but it MUST bond back to the building GES.',
      'Source: VERIFIED-public-source — IEEE 1100 abstract (IEEE SA); EC&M Emerald Book overview. TIA-607 reinforces.',
    ].join(' | '),
    tags: ['M6', 'grounding', 'IEEE-1100', 'misconception', 'field-vs-book'],
  },
  {
    id: 'm6-ul497-fiber',
    front: 'UL 497 / 497A / 497B — what each covers, and does fiber need a primary protector?',
    back: [
      'UL 497: listed PRIMARY protector — aerial/exposed buried telco entry, per NEC Art. 800/805. Gas-tube / carbon-block arrester.',
      'UL 497A: SECONDARY protector — downstream of UL 497, circuits < 150 V rms to ground.',
      'UL 497B: ISOLATED-LOOP protector — isolated-loop (current-loop) circuits.',
      'Fiber: optical fiber carries NO power → no primary protector needed on the glass.',
      'BUT: metallic strength member of an armored OSP fiber cable MUST be bonded to the GES (or primary protector ground) at the EF.',
      'Source: VERIFIED-via-secondary-source — Eaton white paper SA01005003E; Transtector product lit. Exact UL 497 requirements: UNVERIFIED-needs-paid-doc (paywalled).',
    ].join(' | '),
    tags: ['M6', 'surge', 'UL497', 'primary-protection', 'fiber', 'misconception'],
  },
];
