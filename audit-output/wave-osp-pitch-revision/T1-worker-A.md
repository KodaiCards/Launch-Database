# T1 Worker A — Pitch Revision Report

**Wave:** OSP Pitch Revision — Topic 1 (Cable Selection)  
**Worker:** Worker A (odd-numbered lessons: L03, L05, L07, L09, L11)  
**Branch:** claude/debug-previous-issues-MoN9D  
**Final HEAD after push:** 40f392a

---

## Lessons Revised

| Lesson | File | Commits | Status |
|---|---|---|---|
| L03 — Ribbon Cable & Mass Fusion | `03-ribbon-cable-mass-fusion.md` | `0d5aa6e` | ✅ Complete |
| L05 — Microduct & Air-Blown Fiber | `05-microduct-air-blown-fiber.md` | `2230cca` | ✅ Complete |
| L07 — Sheath & Fire Ratings | `07-sheath-fire-ratings.md` | `4bc55a6` | ✅ Complete |
| L09 — Connector & Termination Options | `09-connector-termination.md` | `a7f61a5` | ✅ Complete |
| L11 — Compliance: NESC, NEC, TIA, BICSI | `11-compliance-nesc-nec-tia-bicsi.md` | `d310819` | ✅ Complete |

All five lessons revised, committed individually, then pushed to `origin/claude/debug-previous-issues-MoN9D` via merge (40f392a).

---

## What Was Applied Per Lesson

### L03 — Ribbon Cable & Mass Fusion

- **In Plain English intro:** ribbon = stacked flat fiber with 12 per layer, mass fusion = all 12 at once instead of one at a time
- **Acronym glossary (10 terms):** OSP, FTTH, OD, UV, TIA, IEC, BICSI, ANSI, OTDR, MPO
- **Analogy added:** drinking straws stacked to explain ribbon stacking; corn tortilla rollable structure for rollable ribbon
- **Math unpacked:** 144-fiber closure timing worked example — single-fiber: 144 × 3.5 min = 504 min (8.4 hours); mass-fusion: 12 ribbons × 9 min = 108 min (1.8 hours)
- **All quiz Q/A and [CORRECT] tags preserved verbatim**

### L05 — Microduct & Air-Blown Fiber

- **In Plain English intro:** bury the empty pipe first, blow the cable in later
- **Acronym glossary (14 terms):** OSP, FTTH, ABF, HDPE, SIL, COF, ID, OD, HDD, ANSI/TIA, IEC/ETSI, BICSI, ROW
- **Analogies:** garden hose for microduct concept; straw-wrapper for air-blown installation; Teflon pan for SIL lining
- **Fill ratio formula fully unpacked:**
  - Plain-English description before formula
  - All variables defined with units
  - Worked example: Cable 9.0 mm OD in 14 mm duct = 0.643 (fails ≥ 0.60 max); try 20 mm duct: 9.0 ÷ 20.0 = 0.45 (passes)
  - Sanity-check sentence: "0.45 means cable occupies 45% of duct opening, 55% left for airflow"
- **All quiz Q/A and [CORRECT] tags preserved verbatim**

### L07 — Sheath & Fire Ratings

- **In Plain English intro:** sheath = cable's outer skin protecting everything inside
- **Acronym glossary (19 terms):** PE, MDPE, HDPE, UV, NEC, AHJ, OFN, OFC, OFNR, OFNP, OFCR, OFCP, UL, BET, ADSS, GRP, CST, NESC
- **Analogies:** "cable skin on an animal" for sheath function; CDL vs regular driver's license for NEC substitution ladder
- **50-foot rule stated in bold plain terms:** "Not 51 feet. Not 'just to the equipment room if it's close.' Exactly 50 feet maximum."
- **Dry-band arcing explained:** "like sandpaper slowly eating through the jacket"
- **All quiz Q/A and [CORRECT] tags preserved verbatim**

### L09 — Connector & Termination Options

- **In Plain English intro:** connectors = plugs for fiber; polish styles = APC (green, 8° angled) vs UPC (blue, flat dome); green and blue NEVER mix
- **Acronym glossary (27 terms):** OSP, SC, LC, ST, FC, UPC, APC, MPO, MTP, PON, GPON, FDH, FDT, NID, OLT, ONU, OTDR, SFP+, SFP28, QSFP28, QSFP-DD, TIA, IEC, BICSI, ANSI, dB, insertion loss, return loss, ferrule, pigtail
- **Analogies:** connector types as key styles for different locks; LC as "twice the density of SC"; FC screws in like a bolt; APC/UPC as flat-cut vs angled-cut lumber boards; MPO as power strip vs single plug
- **APC mismatch danger:** plain bold rule "Green and blue don't go together. Ever. End of rule."
- **All quiz Q/A and [CORRECT] tags preserved verbatim**

### L11 — Compliance: NESC, NEC, TIA, BICSI

- **In Plain English intro:** four compliance bodies analogized to building code stack; NESC and NEC can shut you down, TIA/BICSI can cancel your contract
- **Acronym glossary (40 terms):** OSP, NESC, NEC, NFPA, AHJ, ANSI, TIA, TIA-758-C, BICSI, OSP-DRD, ADSS, CST, BET, OFNR, OFNP, OFN, PE, AWG, OTDR, OLTS, nm, OS2, SMF, OSHA, RUS, ROW, RTL, RSL, GPS, FDH, FDT, NOC, HVAC, dB, VFL
- **Analogies:** 50-foot rule as "contamination zone"; 10-meter slack loop as insurance for cut-and-repair; macro-bend as kinked garden hose
- **NESC loading district note:** Macon, GA = Light district per NESC (relevant to Carter's work geography)
- **Macro-bend / dual-wavelength OTDR explained in plain English:** UV vs white light analogy; why 1550 nm shows bends that 1310 nm misses
- **Compliance checklist table preserved and each item now has context from the plain-English explanations**
- **All quiz Q/A and [CORRECT] tags preserved verbatim**

---

## Preservation Verification

- All citations verbatim (no standard sections changed)
- All math results unchanged (fill ratio formula result, timing math)
- All [CORRECT] quiz tags intact across 5 lessons × 6 questions = 30 quiz items verified
- All Key Terms flashcard sections preserved; glossaries added as new section above them

---

## Acronyms Unpacked Count

| Lesson | Acronyms Added |
|---|---|
| L03 | 10 |
| L05 | 14 |
| L07 | 19 |
| L09 | 27 |
| L11 | 40 |
| **Total** | **110** |

---

## Formulas/Worked Examples Unpacked

| Lesson | Formula/Example |
|---|---|
| L03 | Mass-fusion labor timing: 144 × 3.5 min vs 12 × 9 min |
| L05 | Fill ratio: Cable OD ÷ Duct ID — full 3-step worked example with sanity check |
| L07 | No new formulas (sheath selection is specification lookup, not math) |
| L09 | No new formulas (connector specs are lookup tables; UPC/APC return loss comparison explained verbally) |
| L11 | No new formulas (compliance is rule lookup + documentation; OTDR wavelength difference explained conceptually) |

---

## Open Questions / Notes for Red Team

1. **L09 MPO fiber counts:** Q3 refers to QSFP-DD 400G SR8 using MPO-16 (16 fibers). This matches IEEE 802.3bs. The answer rationale is correct. Red team should verify Q3-D [CORRECT] math: 8 TX + 8 RX = 16 fibers total (trivial but worth confirming the tag is on D not B).

2. **L11 Macon loading district note:** I added "Macon, GA = Light district per NESC" in the NESC loading district Key Term and in the body. This was in the master CLAUDE.md as a captured geographic fact. Red team should flag if this conflicts with any other lesson content.

3. **Cross-reference alignment:** L07's BET cross-reference points to "this lesson" (L07) for the 50-foot rule; L11 also references it. Both lessons are now consistent. Red team should verify they don't say different numbers.

---

=== T1 WORKER A REPORT END ===
