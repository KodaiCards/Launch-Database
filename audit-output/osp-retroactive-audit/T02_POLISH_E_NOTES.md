# T02 Polish-E Notes

**Commit:** `04ef902`
**Scope:** T02.L08 — SWDM MSA 25GbE 200m qualifier removal
**Triggered by:** RT-κ (`406838e`) LOW finding

## Bug

Polish-C wrote `25GbE up to ~100 m (per IEEE 802.3by; 200 m achievable via SWDM MSA)` at two
loci in L08:
- Line 23: `key_terms` OM5 definition
- Line 124: Flashcard `T02-L08-fc-om5` back text

The qualifier "; 200 m achievable via SWDM MSA" is wrong. SWDM MSA = 4×25G wavelengths = 100G
aggregate system at up to 150 m on OM5 per the SWDM Consortium MSA. It is NOT a 25G
single-channel 200 m spec. The 200 m figure traces to eSWDM4 extended-reach demonstrations,
not standard SWDM MSA.

## Fix applied

Both loci changed identically:

BEFORE: `25GbE up to ~100 m (per IEEE 802.3by; 200 m achievable via SWDM MSA)`
AFTER:  `25GbE up to ~100 m (per IEEE 802.3by)`

IEEE 802.3by 100 m reach retained. 100GbE SWDM4 150 m (per SWDM MSA) unchanged — that
reference is correct.

## Vite build: PASS (5.68s, 0 errors)
## key_terms ↔ Flashcard consistency: maintained (identical strings at both loci)
