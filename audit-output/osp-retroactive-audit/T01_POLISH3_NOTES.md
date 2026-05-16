# T01 Polish-3 Notes
Agent: Polish-3 role  
SHA: d7161ad  
Files modified: L01.osp-vs-isp.jsx, L02.parts-of-a-pole.jsx

## Write-path constraints acknowledged
Only L01, L02, and this notes file were touched. No other files modified.

## W-2 — vocab_introduced DAG + Flashcard fixes

### L01 changes
- Added `RUS` and `BICSI` to `vocab_introduced` array in meta export
- Added Flashcard entries for both:
  - RUS: "Rural Utilities Service — a USDA agency that funds rural telecom infrastructure and publishes the engineering bulletins (1751F-series) that govern how RUS-funded OSP is designed and built."
  - BICSI: "Building Industry Consulting Service International — the professional association that publishes OSP and ISP design standards and administers certifications like RCDD and OSP Designer (CFOS/CFOT are FOA credentials, not BICSI)."
  - Both definitions pulled VERBATIM from L01 Foundations acronym table

### L02 changes
- Added `NESC` to `vocab_introduced` array in meta export
- Added Flashcard entry for NESC:
  - "National Electrical Safety Code — IEEE-published code (adopted by most states) that sets vertical clearance, loading, and attachment rules for overhead utility lines including fiber."
  - Definition pulled VERBATIM from L02 Foundations acronym table

## X-1 — L01 Advanced Part 32 "Poles" account number

### Primary-source verification
Source: Multiple FCC USOA / CFR Part 32 references via web search

**47 CFR §32.2411 = Poles** — confirmed.
- Web search result: "poles account is part of the broader cable and wire facilities category under §32.2410, and relates to the accounting requirements for telecommunications plant assets. There is also a corresponding expense account at §32.6411 for Poles expense."
- Secondary search: "The accounting provides data for each major type of cable construction (i.e., aerial, buried, and underground)... also provides separate accounts for the major types of outside plant structures (i.e., poles and underground conduit)."
- §32.2421 = Aerial cable; §32.2422 = Underground cable; §32.2423 = Buried cable (also confirmed)

**L01 Advanced tier is CORRECT**: "Account 2411 is 'Poles'" matches primary source.

**No change applied to L01** — L01 is already correct.

**T04.L07 bug note**: T04.L07 says "Poles = §32.2420" — §32.2420 appears to be the parent "Cable and wire facilities" account, not Poles. T04's own audit wave will catch and fix this per instructions.

## X-2 — L02 Q3 NESC climbing space citation

### Primary-source verification
Sources: Multiple NESC industry references (OJUA, IEEE interpretations, joint-use compliance guides)

**NESC §236 = Climbing Space** — confirmed by multiple independent sources:
- OJUA trifold explicitly titled "NESC 236 CLIMBING SPACE"
- IEEE C2 interpretation IR563 references "Section 236" for climbing space
- Multiple joint-use compliance guides consistently cite Rule 236 for climbing space requirements

**NESC §238 = Clearances Between Facilities on Same Structure** (communication and supply vertical clearances):
- RT-X described it as "working clearances from energized equipment" — this is partially incorrect. §238 is about vertical clearances between communication and supply FACILITIES on the same structure, including streetlight hardware, drip loops, and similar. Not the same as climbing space geometry.
- Bottom line: §238 does NOT govern climbing space. §236 does.

### Fix applied
BEFORE: `citation: 'NESC C2-2023 §§23, 238.'`  
AFTER: `citation: 'NESC C2-2023 §§23, 236.'`

The Q3 question content ("climbing space" description) is correct — only the section number changed.

## Neighborhood scan — no unscoped items found
- L01 Advanced: surrounding ±20 lines show Part 32 account references are internally consistent. Account 2421/2422/2423 (cables) and 2411 (Poles) and 2441 (Conduit) are all accurate per primary source.
- L02 Q3 area: Other citations in L02 (§§23, 235 in Advanced tier; Rule 232/Table 232-1 in Q2) are not touched and appear correctly scoped.

## Vite build
✓ 131 modules, built in 6.00s, no errors.

## git log
```
d7161ad T01 Polish-3: vocab_introduced DAG + Flashcard gaps + NESC §238→§236 citation fix
```

## git diff --stat
```
osp-training/src/lessons/T01/L01.osp-vs-isp.jsx      | 4 ++++
osp-training/src/lessons/T01/L02.parts-of-a-pole.jsx | 4 +++-
2 files changed, 7 insertions(+), 1 deletion(-) 
```

=== T01 POLISH-3 NOTES END ===
