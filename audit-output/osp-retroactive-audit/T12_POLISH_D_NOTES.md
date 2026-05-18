# T12 Polish-D Notes

**Wave:** T12 Polish-D  
**Date:** 2026-05-18  
**Scope:** Single LOW from RT-κ `9a73bf0`

## Fix applied

**L04 `WorkedExample` sanityCheck — formula vs table reconciliation**

- **Issue:** WorkedExample formula yields ~50 m for 500 ns pulse; table shows ≥500 m for same pulse class. No explanation of the gap.
- **Fix:** Extended `sanityCheck` to explicitly state: 50 m = theoretical ADZ minimum (just clears the dead zone under ideal conditions); ≥500 m = 10× safety margin baked into field practice, providing headroom for connector reflectance variation, multiple averaging passes, dynamic range, and dirty/misaligned launch connectors. Also clarified step 1 wording: "theoretical minimum — just clears the ADZ".
- **Both values remain correct** — different purposes (floor vs field standard).
- **Commit:** `4399a91`
- **Files changed:** `osp-training/src/lessons/T12/L04-dead-zones-edz-and-adz.jsx` (+2 / -2)

## Verification

- Vite build: ✓ built in 7.12s, 0 errors
- T12 lessons: 15/15 (L01–L15)
- No other files modified

=== T12 POLISH-D NOTES END ===
