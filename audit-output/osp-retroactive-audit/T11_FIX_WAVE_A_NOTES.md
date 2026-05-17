# T11 Fix Wave A — Closeout Notes

**SHA:** `11c0eba`  
**Date:** 2026-05-17  
**Canonical from:** RT-α `5a226d6` + RT-β `4158b6e`

## Status: COMPLETE

All 8 canonical findings applied. Schema validator 15/15 PASS. Vite build clean. dag-registry rebuilt. Pushed to main.

## Findings applied

| ID | Severity | Status | Notes |
|----|----------|--------|-------|
| MED-1 (F1) | MED | FIXED | Flashcard renders added: L04 +6, L06 +3, L09 +3, L10 +2, L11 +1, L12 +2 net |
| MED-2 (F2) | MED | FIXED | L13/L14 Flashcard API: term/definition → deckId/cards array |
| MED-3 (F3) | MED | FIXED | L13/L14/L15 vocabulary_assumed: plain strings → {term, source_lesson_id} objects |
| MED-4 (F-β1) | MED | FIXED | L05 G.657.A2 MFD 8.4→8.6µm, w₂ 4.2→4.3, IL 0.036→0.020 dB per ITU-T G.657 Table 5 |
| LOW-1 (F4) | LOW | FIXED | DAG duplicates removed: dome closure L09, splice tray L11, rollable ribbon L07, APC/UPC L12 |
| LOW-2 (F5) | LOW | FIXED | L04/L05 DAG pointers: G.652.D T02.L05→T02.L01, G.657 T02.L05→T02.L04 |
| LOW-3 (F6) | LOW | FIXED | L15 capstone: 30-card review Flashcard deck added |
| LOW-4 (F-β2) | LOW | FIXED | L12 APC RL: "≥60 dB" → "≥60 dB (field-acceptable); ≥65 dB (reference-grade)" |

## Cascading fixes (beyond canonical scope — required for DAG consistency)

LOW-1 moved dome closure out of T11.L09 vocabulary_introduced, but T11.L10 and T11.L11's vocabulary_assumed still pointed to T11.L09 for dome closure and splice case respectively. These cascaded broken pointers were corrected:

- L10: `dome closure` T11.L09 → T01.L04
- L11: `splice case` T11.L09 → T01.L04 (splice case is owned by T01.L04 per dag-registry)
- L11: Removed duplicate `splice tray` entry from vocabulary_assumed
- L15: `splice tray` T11.L11 → T01.L04, `dome closure` T11.L09 → T01.L04

## Cascade-pattern §14e scan result

Scan for `<Flashcard term=` in T11/*.jsx returned zero results — no other files using the deprecated API.

## Remaining BROKEN items in dag-registry (pre-existing, not introduced by Fix Wave A)

T11.L03/L04/L12 → "attenuation dB/km" claimed T02.L02 (should be T02.L02 or T02.L03 — pre-existing)
T11.L05 → "MFD" claimed T02.L03 (should be T02.L01 — pre-existing)
T11.L08 → "splice loss acceptance threshold" claimed T11.L03 — pre-existing
T11.L09 → conduit/manhole/pedestal/aerial lashing claimed T10.L01/T10.L04 — pre-existing
T11.L10 → cable jacket types/gel-filled claimed T03.L01 — pre-existing
T11.L14 → insertion loss claimed T11.L12, IPA hazmat awareness claimed T18.L04 — pre-existing
These are scope-out items for this wave; surface for future T11 retroactive audit pass.

## Verification

- Flashcard.jsx API confirmed: `export default function Flashcard({ deckId, cards })` — correct API used throughout
- dag-registry.json regenerated: `generated_at: 2026-05-17T22:32:37Z`, 164 lessons
- Schema validator: 15/15 PASS, 0 warnings
- Vite build: ✓ built in 6.92s, 131+ modules

=== T11 FIX WAVE A CLOSEOUT END ===
