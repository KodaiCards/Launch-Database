# T02 Polish-C Notes — 3 Surgical IEEE Citation/Value Corrections

**SHA:** `3e78fcbb29e3ad0cbc6e9467a0c0aace1652de22`
**File changed:** `osp-training/src/lessons/T02/L08.smf-vs-mmf-choosing.jsx`
**Vite build:** CLEAN (5.99s)

---

## Fix Z-1 — 100GbE SWDM4 citation: IEEE 802.3bs → SWDM MSA

**Lines:** 23 (key_terms) and 124 (Flashcard)

**BEFORE:**
```
100GbE SWDM4 up to ~150 m (per IEEE 802.3bs)
```

**AFTER:**
```
100GbE SWDM4 up to ~150 m (per SWDM MSA)
```

**Primary-source verification:**
- IEEE 802.3bs = 200G/400G Ethernet (confirmed: https://standards.ieee.org/ieee/802.3bs/6748/)
- IEEE 802.3cm = 100GBASE-SR4 (parallel 8-fiber multimode) + 40GBASE-ER4 (SMF), NOT SWDM4
- 100G SWDM4 at 150m on OM5 is defined by the SWDM Alliance MSA (confirmed: https://pdf4pro.com/view/100g-swdm4-msa-technical-specifications-18af22.html)
- SWDM MSA specifies 100G-SWDM4 at 2–150m on OM5 with 4 wavelengths (850/880/910/940nm)

---

## Fix Z-2 — 25GbE OM5 reach: 200m → 100m (per IEEE 802.3by; SWDM MSA qualified)

**Lines:** 23 (key_terms) and 124 (Flashcard)

**BEFORE:**
```
25GbE up to ~200 m
```

**AFTER:**
```
25GbE up to ~100 m (per IEEE 802.3by; 200 m achievable via SWDM MSA)
```

**Primary-source verification:**
- IEEE 802.3by (25GBASE-SR) specifies 100m reach on OM4/OM5 at 25G (confirmed: https://standards.ieee.org/ieee/802.3by/6024/)
- 200m value is a SWDM MSA extension, not in the 802.3by spec
- TIA FOTC 25GBASE-SR overview confirms 70m OM3 / 100m OM4/OM5 (https://www.tiafotc.org/ieee-802-3-ethernet-standards-update/multimode-standards-update/25gbase-sr/)

---

## Fix Z-3 — Comparison table: "OM4 at 40GbE" → "OM4 at 10GbE"

**Line:** 94 (SMF vs. MMF comparison table, "Max practical reach" row)

**BEFORE:**
```
Tens to ~400 m (OM4 at 40GbE)
```

**AFTER:**
```
Tens to ~400 m (OM4 at 10GbE)
```

**Primary-source verification:**
- OM4 at 10GbE reach = 400m (per IEEE 802.3, consistent with table)
- IEEE 802.3ba 40GBASE-SR4 on OM4 = 150m (confirmed: https://www.tiafotc.org/ieee-802-3-ethernet-standards-update/multimode-standards-update/40gbase-sr4/)
- 400m is OM4's 10GbE limit, not its 40GbE limit; the parenthetical label was wrong

---

## Neighborhood scan (±20 lines from each fix)

- Line 23 neighborhood (key_terms block): No additional citation errors found in other key_term definitions.
- Line 94 neighborhood (comparison table): Table correctly shows "Tens to hundreds of km" for SMF. OM4 row in the multimode grade table (line 183) correctly shows "400 m" in the "Max reach: 10GbE" column — consistent with Z-3 fix.
- Line 124 neighborhood (Flashcard block): No additional citation errors found in surrounding Flashcard entries.

---

## Write-path compliance

Only `osp-training/src/lessons/T02/L08.smf-vs-mmf-choosing.jsx` and this notes file were written. No other lesson files touched.
