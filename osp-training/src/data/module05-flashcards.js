/**
 * Module 5 — Networking Blueprints (ISP) flashcard deck.
 *
 * 8 cards covering the exam-weight topics:
 *   MDF/IDF translation, 90/100 m rule, busbar rename, busbar specs,
 *   TIA-606-D class model, backbone distances, TR sizing, and grounding topology.
 *
 * Sources documented in docs/research-logs/module05-networking-blueprints-isp.md.
 * UNVERIFIED items are tagged; do not promote to "verified" without Red Team sign-off.
 */

export const MODULE05_FLASHCARDS = [
  {
    id: 'm5-spaces-translation',
    front: 'Translate: MDF → ? and IDF → ? in TIA-568.1 / TIA-569 formal vocabulary.',
    back: 'MDF → Equipment Room (ER). IDF → Telecommunications Room (TR). "MDF" and "IDF" are field/IT vocabulary; TIA does not use them as formal terms. The exam expects ER and TR; the job expects MDF and IDF.',
    tags: ['M5', 'spaces', 'field-vs-book'],
  },
  {
    id: 'm5-90-100m',
    front: 'Horizontal cabling: what are the 90 m and 100 m limits, and what fills the gap?',
    back: '90 m = permanent link (TR patch panel → wall outlet, fixed cable). 100 m = total channel. Gap = 5 m work-area cord + 5 m equipment-room cord. Both limits are TIA-568 conformance rules, not physics cliffs. [VERIFIED-via-secondary-source — Anixter, FOA]',
    tags: ['M5', 'horizontal', 'distances'],
  },
  {
    id: 'm5-pbb-sbb-rename',
    front: 'TIA-607-D (July 2019) renamed the two telecom busbars. Old names → new names?',
    back: 'TMGB (Telecommunications Main Grounding Busbar) → PBB (Primary Bonding Busbar) — in the ER/MDF, one per building.\nTGB (Telecommunications Grounding Busbar) → SBB (Secondary Bonding Busbar) — in each TR/IDF.\nField drawings still say TMGB/TGB in 2026. Exam uses PBB/SBB. [VERIFIED-via-secondary-source]',
    tags: ['M5', 'grounding', 'TIA-607', 'field-vs-book'],
  },
  {
    id: 'm5-busbar-dims',
    front: 'Minimum dimensions for PBB (TMGB) and SBB (TGB)?',
    back: 'PBB (TMGB): ≥ 6.3 mm thick × 100 mm wide (¼ in. × 4 in.), copper, non-anodized, predrilled.\nSBB (TGB): ≥ 6.3 mm thick × 50 mm wide (¼ in. × 2 in.), copper, non-anodized, predrilled.\nElectrochemical-potential limit to busbar: < 300 mV (exam favorite). [VERIFIED-via-secondary-source — NECA/BICSI 607-2011]',
    tags: ['M5', 'grounding', 'busbar', 'TIA-607'],
  },
  {
    id: 'm5-606-classes',
    front: 'TIA-606-D defines four administration classes. What scope does each cover?',
    back: 'Class 1: single room, no backbone (small office).\nClass 2: one building, multiple TRs with backbone (typical commercial).\nClass 3: multi-building campus.\nClass 4: multi-site enterprise / external connections.\nThe standard mandates consistency and traceability, not a specific label format. [VERIFIED-via-secondary-source]',
    tags: ['M5', 'administration', 'TIA-606'],
  },
  {
    id: 'm5-backbone-fiber',
    front: 'Backbone fiber distance limits: OM3, OM4, and OS1/OS2 under TIA-568.1?',
    back: 'OM3: ≤ 300 m (10GBASE-SR). OM4: ≤ 550 m (10GBASE-SR). OM5: ≤ 300 m (wideband/SWDM). OS1/OS2 (single-mode): ≤ 3,000 m within cabling scope — application (10GBASE-LR, etc.) governs in practice. Note: active application limit is usually the binding constraint for single-mode. [VERIFIED-via-secondary-source — Anixter, FOA, IEEE 802.3]',
    tags: ['M5', 'backbone', 'distances', 'fiber'],
  },
  {
    id: 'm5-tr-sizing',
    front: 'TR sizing rule of thumb by floor area served (TIA-569 / BICSI TDMM)?',
    back: '≤ 5,000 sq ft → 10 ft × 8 ft minimum.\n5,001–8,000 sq ft → 10 ft × 9 ft.\n8,001–10,000 sq ft → 10 ft × 11 ft.\n> 10,000 sq ft or run > 295 ft → add a second TR.\nDoor: min 910 mm (36 in.) wide × 2,000 mm (80 in.) tall. Ceiling: min 2,440 mm (8 ft).\n⚠ UNVERIFIED-needs-paid-doc — confirm against BICSI TDMM 15th Ed. (paid).',
    tags: ['M5', 'TR', 'sizing', 'TIA-569', 'verify'],
  },
  {
    id: 'm5-tbb-sizing',
    front: 'Telecommunications Bonding Backbone (TBB) conductor — minimum AWG and the sizing caveat?',
    back: '6 AWG copper is the minimum (per NECA/BICSI 607-2011, free PDF). TIA-607-D contains an AWG-by-length table — conductor must be upsized as backbone length increases. The exact table is ⚠ UNVERIFIED-needs-paid-doc (TIA-607-D, paywalled). Field practice: size up one gauge from the table minimum; most institutions spec 4 AWG or 2 AWG regardless.',
    tags: ['M5', 'grounding', 'TBB', 'conductor', 'verify'],
  },
];

/**
 * Re-export merged into the platform-wide ALL_FLASHCARDS array.
 * Usage in ToolsPage or a study-mode component:
 *
 *   import { MODULE05_FLASHCARDS } from '../data/module05-flashcards.js';
 *   // or merge into ALL_FLASHCARDS in flashcards.js
 */
