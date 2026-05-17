# T14 Polish-E Notes

**Commit:** `d4aa8e7`
**Date:** 2026-05-17
**Source:** RT-ζ `d122f3d`

## Fixes applied

### MED — L12 Q10 arithmetic (L12.capstone-quiz.jsx:219)

- **Before:** `Variation of ±0.1 Ω on an 18 Ω reading = ±0.6%`
- **After:** `Variation of ±0.2 Ω on an 18 Ω reading = ±1.1%`
- **Math:** readings 18.0, 18.1, 18.2 Ω → max deviation = 18.2 − 18.0 = 0.2 Ω; 0.2/18 = 1.11%
- **Consistency:** L06 Q3 uses same scenario with 17.8/18.2 readings (0.2 Ω / 1.1%) — now matches
- **Conclusion unchanged:** ±1.1% is still well within the ±2% IEEE 81 validation threshold

### LOW — L05 IBT+GES removed from key_terms (L05.ibt-and-ges.jsx:22-32)

- **Removed:** IBT and GES entries from `key_terms` array (lines 23-32, 11 lines deleted)
- **Retained:** IBT and GES in `vocabulary_assumed` pointing to T01.L08 (correct canonical introducer)
- **Flashcard impact:** L05 renders Flashcards via `meta.key_terms.map(...)` — IBT/GES cards no longer render (correct; T01.L08 owns those cards)
- **Remaining key_terms in L05:** PBB, SBB, bonding conductor (all genuinely introduced here)

## Validator result

```
T14: 12/12 PASS, 0 FAIL, 0 WARN
```

## Build result

Vite build clean (`✓ built in 6.39s`), zero errors.

=== T14 POLISH-E NOTES END ===
