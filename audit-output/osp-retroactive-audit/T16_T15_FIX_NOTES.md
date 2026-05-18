# T16/T15 Surgical Fix Notes — 2026-05-18

## FIX-1 Applied — T16.L08 §32.2682 → §32.2441 (VERIFIED)

**File:** `osp-training/src/lessons/T16/L08-part-32-plant-accounting-as-built.jsx` line 225

**Before:** `<td>Component of §32.2682</td>`  
**After:** `<td>Component of §32.2441</td>`

**Primary-source verification:** 47 CFR §32.2682 = "Large PBX equipment" (operator switching) — completely wrong for splice trays. §32.2441 = "Conduit Systems" — correct. Splice closures are already booked under §32.2441 in the same table (line 216). Splice trays, as components of closures, inherit the same parent account. Fix aligns with the rest of the lesson's own accounting table.

---

## FIX-2 Assessment — T15 slack_factor key_term (NOT APPLIED — no actual mismatch)

**Task claim:** "key_term says route = cable × 0.97; body uses ÷ 1.03"

**Actual state (checked line by line):**
- `T15/L02` key_term line 56: uses `5,000 × 0.97 = 4,850 ft` — multiply form
- `T15/L02` body line 155: uses `11,803 × 0.97 = 11,449 m` — same multiply form
- `T15/L03` body line 120: uses `6,240 × (1 − 0.012)` — same multiply form
- `T15/L10` capstone line 215: uses `14,200 × 0.988` — same multiply form

Both key_term and body consistently use `× (1 − sf)`. No mismatch found. The ÷ 1.03 form differs mathematically from × 0.97 (gives 4854 vs 4850 for sf=3%) — changing to ÷ 1.03 would INTRODUCE an inconsistency. Fix NOT applied.

Note: `slack_factor` key_term is in **T15/L02**, not T15/L05 as the canonical claimed. The canonical's stated location was wrong; the content itself has no bug.

---

## FIX-3 Applied — T15.L05 NIOSH "ceiling" → "REL (8-hr TWA)" (VERIFIED)

**File:** `osp-training/src/lessons/T15/L05-splice-trailer-setup.jsx` line 80

**Before:** `...disperses to below the NIOSH 35 ppm ceiling exposure limit.`  
**After:** `...disperses to below the NIOSH 35 ppm REL (8-hr TWA).`

**Primary-source verification:** NIOSH NPG NPGD0105 (Carbon Monoxide):
- REL = 35 ppm (TWA, 10-hr workday / 40-hr workweek ceiling per NPG)
- STEL/Ceiling = 200 ppm (NIOSH short-term ceiling per NPG)
- IDLH = 1,200 ppm (already correctly stated in the same file at line 78)

The 35 ppm value is the NIOSH REL (time-weighted average), not a ceiling limit. Calling it a "ceiling exposure limit" is the same class of error that caused the H₂S IDLH/STEL confusion in T18. Fixed to "35 ppm REL (8-hr TWA)".

---

## Vite Build
✓ Clean build — 6.31s, no errors
