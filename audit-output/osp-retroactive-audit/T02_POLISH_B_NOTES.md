# T02 Polish-B Fix Notes

SHA: 6ab4bb8b5b023757232817c69945b0573f277730

## Fix 1 — key_terms OM5 definition (line 23)
BEFORE: "Max reach ~400 m (supports SWDM4 for 100G over one MMF pair)"
AFTER:  "Rate-specific reach: 10GbE up to ~400 m, 25GbE up to ~200 m, 100GbE SWDM4 up to ~150 m (per IEEE 802.3bs)"

## Fix 2 — Flashcard T02-L08-fc-om5 back text (line 124)
BEFORE: "Achieves 100G over a single MMF pair at up to ~400 m."
AFTER:  "Rate-specific reach: 10GbE up to ~400 m, 25GbE up to ~200 m, 100GbE SWDM4 up to ~150 m (per IEEE 802.3bs)."

## Untouched (correct as-is)
- Reach table OM5 cell: "400 m (supports SWDM4)" — correct for 10GbE column header
- SideBySide row: "OM5 SWDM4 for 100G at ≤150 m" — correct per IEEE 802.3bs

## Vite build: ✓ 6.22s clean
