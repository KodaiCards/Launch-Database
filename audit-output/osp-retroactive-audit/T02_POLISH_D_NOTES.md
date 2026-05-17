# T02 Polish-D Notes — OM5 EMB @ 850 nm Correction

**Wave:** T02 Polish-D  
**Triggered by:** RT-θ finding `20ee327`  
**Fix commit:** `11a98b5`  
**Date:** 2026-05-17

---

## Primary-Source Verification Log

Before any edits were applied, OM5 EMB values were verified against ≥3 independent authoritative sources:

### Source 1 — TIA FOTC (Fiber Optic Technology Consortium) — TIA-492AAAE Standards Update
- URL: https://www.tiafotc.org/tia-standards-update/tia-492aaae/ (403 in agent env; content captured via WebSearch)
- Finding: "The effective modal bandwidth (EMB) for this new fiber is specified at the lower and upper wavelengths: **4700 MHz·km at 850 nm** and **2470 MHz·km at 953 nm**."
- Corroborates RT-θ claim.

### Source 2 — Multiple cable-industry and standards bodies (WebSearch aggregate)
- Sources citing TIA-492AAAE: Belden, Fluke Networks, Beyondtech, Opelink, mpdigest.com
- Consensus verbatim: "The EMB of both OM4 and OM5 at 850nm is specified to be **4700 MHz*km** whereas the EMB at 953nm is specified to be a minimum of **2470 MHz*km** for only OM5 cables."
- Backward-compat design confirmed: "The minimum EMB of wideband multimode fiber at 850nm is specified as the same value as for OM4 (4700MHz/km) to guarantee backward compatibility."

### Source 3 — IEEE 802.3 public documents (parsons_100GSR_01_0120.pdf) + secondary corroboration
- URL: https://www.ieee802.org/3/100GSR/public/Jan20/parsons_100GSR_01_0120.pdf (referenced in WebSearch)
- Independently confirms OM5 at 4700 MHz·km @ 850 nm / 2470 MHz·km @ 953 nm alignment with TIA-492AAAE in IEEE 802.3 working group submissions.

### Verdict on RT-θ claim
**CONFIRMED.** RT-θ's claim is correct:
- OM5 @ 850 nm = **4,700 MHz·km** (same as OM4 — intentional backward-compat design)
- OM5 @ 953 nm = **2,470 MHz·km** (new, unique to OM5)
- Lesson's prior "28,000 MHz·km" = **fabricated** — not found in any primary source
- The "28,000" figure appears to be an erroneous aggregate SWDM bandwidth figure, not the per-wavelength EMB spec

Proceeded to apply fixes.

---

## Fixes Applied

### Fix 1 — key_terms OM5 definition (line 23)
**BEFORE:**
```
'Multimode fiber grade: 50 µm laser-optimized core. EMB = 28000 MHz·km @ 850 nm (primary spec per TIA-492AAAE); also rated 2470 MHz·km @ 953 nm for SWDM4...'
```
**AFTER:**
```
'Multimode fiber grade: 50 µm laser-optimized core. EMB = 4,700 MHz·km @ 850 nm (identical to OM4 — intentional backward-compat design per TIA-492AAAE) + 2,470 MHz·km @ 953 nm (new spec unique to OM5, enabling SWDM4 short-wavelength WDM)...'
```
**Source:** TIA-492AAAE per TIA FOTC + multi-source industry corroboration.

### Fix 2 — Flashcard back text OM5 (line 124)
**BEFORE:**
```
'...EMB = 28000 MHz·km @ 850 nm (primary spec per TIA-492AAAE); also rated 2470 MHz·km @ 953 nm for SWDM4...'
```
**AFTER:**
```
'...EMB = 4,700 MHz·km @ 850 nm (same as OM4 — backward-compat by design per TIA-492AAAE) + 2,470 MHz·km @ 953 nm (new OM5-only spec enabling SWDM4)...'
```
**Source:** Same as Fix 1.

### Fix 3 — OM grade table OM5 row (lines 188–194)
**BEFORE:**
```
28000 MHz·km @ 850 nm; 2470 MHz·km @ 953 nm (SWDM4)
Per TIA-492AAAE: primary EMB spec is 28000 MHz·km at 850 nm. The 953 nm EMB (2470 MHz·km) enables SWDM4...
```
**AFTER:**
```
4,700 MHz·km @ 850 nm (same as OM4); 2,470 MHz·km @ 953 nm (SWDM4)
Per TIA-492AAAE: OM5 intentionally keeps the 850 nm EMB identical to OM4 (4,700 MHz·km) for backward compatibility. OM5's differentiator is the added 953 nm EMB spec (2,470 MHz·km), which enables SWDM4...
```
**Source:** Same as Fix 1.

---

## Git Log
```
11a98b5 T02.L08 Polish-D: correct OM5 EMB @ 850 nm (28000→4700 MHz·km) per TIA-492AAAE
20ee327 [prior commit — RT-θ trigger]
```

## Diff Stat
```
osp-training/src/lessons/T02/L08.smf-vs-mmf-choosing.jsx | 6 insertions(+), 5 deletions(-)
```
Only L08 modified. No other files touched.

## Vite Build
`✓ built in 6.37s` — clean, all modules resolved.

## Neighborhood Scan
- Grep for "28000" or "28,000" across all lesson files: **zero results** — no residual fabricated values elsewhere in the curriculum.
- Prose framing at lines 282–298 (laser-optimized / VCSEL advanced section): no mention of 28,000 there — no additional fix needed.
- Reach values (400 m @ 10GbE, 150 m SWDM4) left untouched — those are verified correct per IEEE 802.3by and SWDM MSA.

---

## Process Note — H₂S IDLH Cascade Discipline Applied
Per the T18 H₂S IDLH cascade lesson (agent applied 100→50 ppm without independent primary-source verification; took 5 RT rounds to catch), independent primary-source lookup was completed BEFORE any edit was applied. RT-θ's claim was not trusted blindly — 3 independent sources confirmed before proceeding.

=== T02 POLISH-D NOTES END ===
