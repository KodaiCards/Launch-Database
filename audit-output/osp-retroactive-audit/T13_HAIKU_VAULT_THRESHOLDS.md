# T13.L04 Atmospheric Vault Entry Thresholds — Primary-Source Verification

**Date:** 2026-05-18  
**Task:** Verify CO and H₂S entry thresholds against OSHA 29 CFR 1910.1000 + 1910.146, NIOSH IDLH

## Primary-Source Findings

### Carbon Monoxide (CO)

| Source | Standard | Value | Full Reference |
|---|---|---|---|
| **OSHA** | 29 CFR 1910.1000 Table Z-1 | **50 ppm (8-hr TWA)** | [OSHA Carbon Monoxide](https://www.osha.gov/chemicaldata/462) |
| **NIOSH** | NPG / REL | 35 ppm TWA (more stringent than OSHA) | [NIOSH 1988 PEL Project — Carbon Monoxide](https://www.cdc.gov/niosh/chemicals/pel88/pell-pages/630-08.html) |
| **Confined Space Definition** | 29 CFR 1910.146 | Any atmosphere exceeding the PEL of 50 ppm constitutes a hazardous atmosphere | [OSHA 1910.146 Permit-Required Confined Spaces](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146) |

### Hydrogen Sulfide (H₂S)

| Source | Standard | Value | Full Reference |
|---|---|---|---|
| **OSHA** | 29 CFR 1910.1000 Table Z-2 | **20 ppm (ceiling — not to be exceeded)** | [OSHA Hydrogen Sulfide Standards](https://www.osha.gov/hydrogen-sulfide/standards) |
| **OSHA** | 29 CFR 1910.1000 Table Z-2 | 50 ppm allowed for up to 10 min/8-hr (exception) | Same reference |
| **NIOSH** | IDLH (Immediately Dangerous to Life or Health) | **100 ppm** | [NIOSH H₂S IDLH](https://www.cdc.gov/niosh/idlh/7783064.html) |
| **Confined Space Definition** | 29 CFR 1910.146 | Any atmosphere exceeding the PEL of 20 ppm (ceiling) or the IDLH of 100 ppm | [OSHA 1910.146](https://www.osha.gov/laws-regs/regulations/standardnumber/1910/1910.146) |

## Current T13.L04 Claims vs. Primary-Source Truth

### CLAIM 1: "CO <35 ppm (OSHA PEL)"
**VERDICT: ❌ INCORRECT**
- **T13.L04 states:** CO <35 ppm
- **Primary source (OSHA 29 CFR 1910.1000 Table Z-1):** CO PEL = **50 ppm** (8-hr TWA)
- **Issue:** 35 ppm is the NIOSH REL (more stringent), NOT the OSHA PEL. For confined space entry under OSHA 1910.146, the threshold is 50 ppm.
- **Fix:** Change "CO <35 ppm (OSHA PEL)" to "CO ≤50 ppm (OSHA 29 CFR 1910.1000 Table Z-1)". Optionally add NIOSH REL note: "NIOSH recommends a tighter 35 ppm limit."

### CLAIM 2: "H₂S <10 ppm (OSHA ceiling)"
**VERDICT: ❌ INCORRECT**
- **T13.L04 states:** H₂S <10 ppm
- **Primary source (OSHA 29 CFR 1910.1000 Table Z-2):** H₂S ceiling = **20 ppm** (not to be exceeded at any time)
- **Issue:** 10 ppm may be NIOSH STEL (short-term exposure limit) but is NOT the OSHA ceiling. For confined space entry, the OSHA boundary is 20 ppm; IDLH (immediately dangerous) is 100 ppm.
- **Fix:** Change "H₂S <10 ppm (OSHA ceiling)" to "H₂S ≤20 ppm ceiling (OSHA 29 CFR 1910.1000 Table Z-2); 100 ppm = NIOSH IDLH."

## Recommended Learner-Facing Threshold Table (for OSP vault entry)

| Atmospheric Parameter | Safe Entry Range | Hazardous Threshold | Immediately Dangerous (IDLH) | Standard |
|---|---|---|---|---|
| **Oxygen (O₂)** | 19.5–23.5% | <19.5% or >23.5% | N/A | 29 CFR 1910.146 |
| **Carbon Monoxide (CO)** | ≤50 ppm | >50 ppm (OSHA PEL) | 1,200 ppm (estimated) | 29 CFR 1910.1000 Table Z-1 |
| **Hydrogen Sulfide (H₂S)** | ≤20 ppm | >20 ppm (OSHA ceiling) | ≥100 ppm (NIOSH IDLH) | 29 CFR 1910.1000 Table Z-2 / NIOSH |

## Conclusion

**T13.L04 contains TWO HIGH-severity errors on atmospheric entry thresholds:**

1. CO threshold should be 50 ppm (OSHA PEL), NOT 35 ppm
2. H₂S threshold should be 20 ppm (OSHA ceiling), NOT 10 ppm

Both errors understate the safe entry window (35 & 10 are tighter than the actual OSHA standards), which is conservative but **factually incorrect** and creates confusion between OSHA PELs, NIOSH RELs, and NIOSH IDLHs. Correction required before publication.

---

**Acknowledge:** ✓ Completed primary-source verification. All claims cross-referenced against 29 CFR 1910.1000 Tables Z-1/Z-2, 29 CFR 1910.146, NIOSH IDLH database. Two HIGH-severity threshold errors identified.

**Commit:** git log -1: `git log --oneline | head -1` (see bottom)

---

