/**
 * Module 10 — Data Center Standards flashcard deck (6–8 cards)
 *
 * Editorial rules (per docs/research-logs/module10-data-center.md §5):
 *  - Every card distinguishes "Uptime Tier" (Roman numerals) from "TIA-942 Rated"
 *    (Arabic numerals) wherever both concepts appear.
 *  - Availability percentages labeled as historical Uptime white-paper figures,
 *    not current standard positions.
 *  - DCE 9000 and the TIA-942-C AI Addendum labeled forthcoming / not yet binding.
 *  - Clause-level claims from paywalled documents tagged UNVERIFIED.
 */

export const M10_FLASHCARDS = [
  {
    id: 'm10-tier-vs-rated',
    front: 'What is the key difference between Uptime Institute "Tier" and TIA-942 "Rated"?',
    back: [
      'Uptime Tier (I–IV, Roman numerals): performance-based; owned by Uptime Institute (trademark); assesses whether the facility can sustain a claimed resilience level in practice.',
      'TIA-942 Rated (1–4, Arabic numerals): prescriptive; defined in ANSI/TIA-942-C (May 2024); specifies infrastructure components, redundancy paths, and configurations.',
      'After 2014 Uptime and TIA operate entirely independent certification programs.',
      '"TIA-942 Tier III" does not exist — the phrase mixes the two systems.',
    ].join(' | '),
    tags: ['M10', 'tier-vs-rated', 'field-vs-book'],
  },
  {
    id: 'm10-avail-pct',
    front: 'Where do the "99.671 / 99.741 / 99.982 / 99.995%" Tier I–IV availability figures come from?',
    back: [
      'From a historical Uptime Institute white paper (1990s).',
      'The current Uptime Tier Standard does NOT publish single availability percentages.',
      'ANSI/TIA-942-C also does NOT publish a single SLA % per Rating.',
      'When these numbers appear in vendor slides, label them: "historical Uptime white-paper figures, not part of the current Tier Standard or TIA-942-C."',
    ].join(' | '),
    tags: ['M10', 'availability', 'verify', 'field-vs-book'],
  },
  {
    id: 'm10-tia942c-key-changes',
    front: 'Name three notable changes introduced in ANSI/TIA-942-C (May 2024).',
    back: [
      '(1) Minimum cabinet width in MDA/IDA/HDA raised to 800 mm (from 600 mm).',
      '(2) Single balanced twisted-pair (sBTP) now recognised for horizontal cabling.',
      '(3) Edge data center content folded in from TIA-942-B-1; expanded fiber connectivity guidance.',
      'Source: Belden, Data Center Frontier, Cabling Installation & Maintenance [VERIFIED-via-secondary-source]. Clause-level text paywalled.',
    ].join(' | '),
    tags: ['M10', 'TIA-942-C', 'cabinet'],
  },
  {
    id: 'm10-base8-vs-base12',
    front: 'Base-8 vs Base-12 MPO/MTP — when does each deliver 100% fiber utilization?',
    back: [
      'Base-8 (8-fiber ferrule): 100% utilization with 8-fiber parallel-optic transceivers (100GBASE-SR4, 400GBASE-DR4). Each link uses exactly one MPO.',
      'Base-12 (12-fiber ferrule): 100% utilization when breaking out to LC-duplex pairs (6 pairs per MPO). Good for legacy 10G/40G SFP+/QSFP+ plants.',
      'Base-12 with 8-fiber transceivers: 67% utilization (4 dark fibers per MPO).',
      '800GBASE-DR8 (16-fiber): Base-16 MPO or 2× Base-8 for full utilization.',
      'Green-field 100G+: default to Base-8. Brown-field with duplex legacy: Base-12 still earns its place.',
    ].join(' | '),
    tags: ['M10', 'MPO', 'Base-8', 'Base-12', 'high-density'],
  },
  {
    id: 'm10-hot-cold-aisle',
    front: 'What is the difference between hot-aisle/cold-aisle layout and containment?',
    back: [
      'Hot-aisle/cold-aisle (HACA): a rack-row orientation principle — front-to-front rows create cold aisles (supply), back-to-back rows create hot aisles (return). Reduces recirculation but does not eliminate bypass air mixing.',
      'Containment: physically enclosing the cold aisle (CAC) or hot aisle (HAC) to prevent bypass mixing. ASHRAE TC 9.9 identifies containment as the primary efficiency lever.',
      'Exam answer: HACA is the prerequisite layout; containment is the efficiency multiplier. Teach both together.',
    ].join(' | '),
    tags: ['M10', 'thermal', 'HACA', 'containment'],
  },
  {
    id: 'm10-bicsi-vs-tia942',
    front: 'How do ANSI/BICSI 002-2024 and ANSI/TIA-942-C complement each other in a U.S. data-center RFP?',
    back: [
      'BICSI 002-2024: broad design + operations + commissioning + energy document (~575 pages, 17 chapters). Covers site selection, lifecycle, liquid cooling, immersion. Does NOT define a Rated 1–4 certification path.',
      'TIA-942-C: narrower infrastructure specification (telecom, arch, elec, mech). Defines Rated 1–4 conformance criteria that third-party assessors certify against.',
      'Practitioner framing: BICSI 002 = process/breadth; TIA-942 = certifiable conformance criteria.',
      'When cited together in an RFP, they are not redundant — they address different scopes.',
    ].join(' | '),
    tags: ['M10', 'BICSI-002', 'TIA-942-C', 'standards-scope'],
  },
  {
    id: 'm10-dce9000-ai-addendum',
    front: 'What are DCE 9000 and the TIA-942-C AI Addendum, and what is their current status (May 2026)?',
    back: [
      'DCE 9000: TIA QuEST Forum Data Center Excellence quality management system standard (modelled on ISO 9001). Draft targeted Sept 2026; full publication 2027. NOT yet published — not yet binding.',
      'TIA-942-C AI Addendum: TIA TR-42.1 addendum addressing GPU-cluster density, liquid cooling, and very-high-speed cabling. Target publication mid-2027. NOT yet published — not yet binding.',
      'The brief\'s "2026 TIA Quality Standards" almost certainly refers to one or both of these.',
      'Both are forthcoming. Current compliance basis: ANSI/TIA-942-C (May 2024) only.',
    ].join(' | '),
    tags: ['M10', 'DCE-9000', 'AI-Addendum', 'forthcoming', 'verify'],
  },
  {
    id: 'm10-uptime-tier4-characteristics',
    front: 'What two properties distinguish Uptime Institute Tier IV from Tier III?',
    back: [
      'Tier III: concurrently maintainable (every component can be maintained without shutting down the IT load). A single fault on a standby path does NOT cause an outage.',
      'Tier IV adds: fault tolerance — a single fault on ANY path (active OR standby) does not interrupt the IT load. All power and cooling distribution is simultaneously active.',
      'Both Tier III and Tier IV are concurrently maintainable; only Tier IV is fault tolerant.',
      'TIA-942 parallel: Rated-3 ≈ concurrent maintainability; Rated-4 ≈ fault tolerance. The mapping is conceptual — the assessment criteria differ between the two programs.',
    ].join(' | '),
    tags: ['M10', 'Uptime', 'Tier-IV', 'fault-tolerance'],
  },
];

/**
 * Convenience re-export for integration with the cross-module ALL_FLASHCARDS bank.
 * Import into src/data/flashcards.js:
 *   import { M10_FLASHCARDS } from './module10-flashcards.js';
 *   export const ALL_FLASHCARDS = [...existing, ...M10_FLASHCARDS];
 */
export default M10_FLASHCARDS;
