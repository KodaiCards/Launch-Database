# T12 Polish-B Notes

**Wave:** T12 Polish-B  
**Date:** 2026-05-18  
**Canonical source:** RT-ε `ba1112b` + RT-ζ `162afed`  
**Write-path:** `osp-training/src/lessons/T12/L04*.jsx`, `L09*.jsx`, `audit-output/citation-registry.md`

---

## Items Applied

### MED Z-1 — L04 ghost distance formula (FIXED)

**Location:** `T12/L04-dead-zones-edz-and-adz.jsx` — "Ghost distance formula" section

**Before:**
```
Ghost distance = 2 × (distance from OTDR port to primary reflector) × N, where N = 1, 2, 3...
```
This formula gives Ghost 1 = 2×120 = 240 m (correct), Ghost 2 = 2×120×2 = 480 m (WRONG — example correctly showed 360 m).

**After:**
```
Ghost distance = (n + 1) × D, where D = distance to primary reflector, n = 1, 2, 3...
  1st ghost (n=1): 2D   = 240 m
  2nd ghost (n=2): 3D   = 360 m
  3rd ghost (n=3): 4D   = 480 m
```

Example updated to explicitly label Ghost 3 = 480 m, making the sequence unambiguous.

**Physics verification:** The mechanism — light reflecting off Connector A → back to OTDR port connector → forward again → off Connector A → back to OTDR — adds 2 one-way traversals per round-trip. Each successive ghost requires one more round-trip. So:
- 1st ghost = 1 original traversal + 1 extra round-trip = 2D ✓
- 2nd ghost = 1 original + 2 extra round-trips = 3D ✓
- nth ghost = (n+1)D ✓

L05 cross-confirmed: uses "2×, 3×, etc." language (lines 74–75) — consistent with the corrected formula.

---

### LOW E-1 — L09 G.652.D cable-vs-fiber bend radius distinction (FIXED)

**Location:** `T12/L09-macrobend-detection-dual-wavelength.jsx` — "Minimum bend radius rules" table

**Problem:** The table showed `30 mm (3 cm) — 20× cable diameter rule for 1.6 mm fiber` under "short-term installation" for G.652.D. This conflates:
- IEC 60793-2-50 bare-fiber mandrel spec: 30 mm short-term
- OSP cable assembly spec: 20× OD = 20 × 12–16 mm = 240–320 mm

**Fix:** Added footnotes ¹ and ² to table column headers and G.652.D row:
- ¹ Clarifies G.657 variant values are bare-fiber per ITU-T G.657
- ² Explicitly distinguishes G.652.D bare-fiber (30 mm / 40 mm) from OSP cable assembly (20× OD = 240–320 mm), directs readers to cable spec sheet

The existing field note (lines 158–162 pre-fix) was preserved and retained — it reinforces the distinction.

---

### LOW E-2 — GR-196-CORE registry gap (FIXED)

**Location:** `audit-output/citation-registry.md` — "Other Standards" section

Added GR-196-CORE (Telcordia/Ericsson OTDR Generic Requirements). Cross-verified accuracy via EXFO AN194, VIAVI OTDR Reference Guide, FOA field documentation — all cite GR-196-CORE as the defining document for EDZ/ADZ spec methodology (0.5 dB recovery criterion). Citation is accurate. Registry entry added with verification notes.

---

## Neighborhood Scan Results

**Checked:** All other T12 lessons for bare-fiber / cable bend-radius conflation and ghost formula patterns.

- **Bend radius:** Only L09 contains a bend radius table. No other T12 lessons have the conflation issue.
- **Ghost formula:** L05 uses "2×, 3×, etc." phrasing consistent with corrected L04 formula — no fix needed.
- **No same-pattern bugs found in adjacent lessons.**

---

## Build + Validation

- Vite build: ✓ clean (`built in 7.11s`, zero errors)
- Schema validator T12: 15/15 PASS, 0 FAIL, 0 WARN

=== T12 POLISH-B NOTES END ===
