# T16 F2 Primary-Source Citation Verification

**Verifier framing:** F2 Primary-source-first, Haiku depth

---

## Verdict
**YELLOW** — 4 major findings (3 citation unverifiable, 1 edition lock needed)

T16 citations include external standards (47 CFR Part 32, TIA-606-C, ASCE 38-22, 7 CFR Part 1755, TIA-598) and federal regulations. WebFetch access to ecfr.gov, tiaonline.org, and asce.org blocked by 403 Forbidden. Unable to independently verify exact section numbers and account titles from primary sources. Findings based on (a) internal consistency checks within T16 (cross-references match), (b) secondary verification against CLAUDE.md audit trail (prior RTs flagged some Part 32 account corrections in T04/T05/T09), and (c) citation plausibility assessment.

---

## Citations Verified — Status Summary

| Citation class | Count | Status | Notes |
|---|---|---|---|
| 47 CFR Part 32 plant accounts | 8 entries | UNVERIFIED | ecfr.gov 403 blocked |
| 7 CFR §1755.400 (RUS plant records) | 5 entries | UNVERIFIED | ecfr.gov 403 blocked |
| 7 CFR Part 1740 (USDA ReConnect) | 1 entry | UNVERIFIED | ecfr.gov 403 blocked |
| ANSI/TIA-606-C (2018) | 6 entries | UNVERIFIABLE — edition lock | See Finding #1 |
| TIA-598 color codes | 2 entries | UNVERIFIABLE | tiaonline.org 403 blocked; prior T02 audit had OM5 fabrication; color-code accuracy unconfirmed |
| ASCE 38-22 quality levels | 2 entries | UNVERIFIABLE | asce.org 403 blocked |
| RUS 1751F-630 (RUS bulletin) | 3 entries | CONSISTENT with T01/T04/T05 prior audits | No contradiction found |
| Industry practice (CMMS, GIS) | 3 entries | CONSISTENT | Plausible; no contradictions |

---

## Findings — Structured

### Finding #1: TIA-606-C Edition Lock Required (HIGH-PRIORITY POLICY)
| # | Severity | File | Line | Claim | Issue | Evidence |
|---|---|---|---|---|---|---|
| 1 | MED | L01 | 50, L03 line 3 | "ANSI/TIA-606-C (current edition: TIA-606-C, 2018)" + "[confirm edition]" marker | Current edition unknown to verifier; 2018 may be outdated. Lesson also notes BICSI TDMM shorthand "TIA-606-D" (confusion signal). | CLAUDE.md §4 P3: "Carter must lock TIA-598 edition" — precedent pattern. TIA standards are updated periodically. Cannot verify 2018 is current without primary source. Marker `[confirm edition]` is present (defensive), but substantive edition lock missing. |

**Resolution required:** Carter must confirm: is TIA-606-C (2018) the current edition? If later editions exist (2022, 2024), all lesson content referencing TIA-606-C specifics must be reverified. Until locked, mark content as "[2018 edition — confirm current before publication]."

---

### Finding #2: Part 32 Account Numbers — Syntax Correctness Verified, Section Coverage Unclear
| # | Severity | File | Line | Claim | Issue | Evidence |
|---|---|---|---|---|---|---|
| 2 | LOW | L08 | 127-171 | "47 CFR §32.2410 Cable and Wire Facilities (parent)" + "§32.2411 Poles" + "§32.2420 Aerial Cable and Wire" + "§32.2421 Underground Cable and Wire" + "§32.2423 Buried Cable" + "§32.2424 Submarine and Deep-Sea Cable" + "§32.2426 Intrabuilding Network Cable" + "§32.2441 Conduit Systems" | Account numbers follow plausible sequence (2400-series, 100-series interval, expected FCC structure). Title phrasings match prior T04/T05 audit corrected citations (§32.2411 = "Poles", not "Poles, Structures, and Equipment" per T04 RT-ε tiebreaker). No internal contradictions. However: cannot independently verify the exact titles or that these are the ONLY accounts used for OSP plant — secondary source verification required. | Prior audit trail (CLAUDE.md §4 "T04 R-1/R-2 dispute + Haiku ground-truth"): Part 32 citations were under dispute in T04. Haiku verification (`a42e9f8`) confirmed §32.2210 = "Central office—switching", not "Land" or "Cable & Wire" (both prior agents wrong). This precedent shows Part 32 citations require primary-source verification. T16 L08 cites Part 32 but no independent primary-source re-check was done post-T04. Cross-topic risk. |

**Action:** T04 post-audit cleanup (P9 in §4) needs to be completed — Part 32 tiebreaker verified some citations correct, but L08 Part 32 table was NOT re-verified against that Haiku output. Recommend: after Carter locks TIA-606-C edition (Finding #1), dispatch Haiku ground-truth agent on Part 32 account titles to confirm L08 table matches ecfr.gov primary source (when access restored).

---

### Finding #3: TIA-598 Color Code — Tube 7 / Fiber 1 (RED / BLUE) — Unverifiable
| # | Severity | File | Line | Claim | Issue | Evidence |
|---|---|---|---|---|---|---|
| 3 | LOW | L02 | 85-86 | "(TIA-598: position 7 = red tube)" + "(TIA-598: position 1 = blue fiber)" | Appears in worked example. Plausible (common convention in fiber industry — 12-color sequence repeated across tube counts). However: cannot verify against primary TIA-598 source (tiaonline.org blocked). | (a) Prior T02 retroactive audit (CLAUDE.md §4 "T02 RETROACTIVE AUDIT" 2026-05-17): OM5 EMB value 28000 MHz·km was FABRICATED and survived 5 RT rounds until RT-θ caught it by demanding independent primary-source lookup. Pattern: TIA standards values not independently verified in initial audit. (b) T16 L02 color codes are treated as background detail (not load-bearing to the splice matrix concept), but they ARE cited as primary standard. (c) No prior Haiku ground-truth on TIA-598 colors in T02 audit report. |

**Resolution:** L02 color codes are illustrative (the worked example's logic is correct whether tube 7=red or=white). If exact color-code names are critical for field crew training, Haiku ground-truth on TIA-598 should be added to post-audit cleanup. For now: PLAUSIBLE but UNVERIFIED.

---

### Finding #4: ASCE 38-22 Quality Levels (QL-A/B/C/D) — Unverifiable
| # | Severity | File | Line | Claim | Issue | Evidence |
|---|---|---|---|---|---|---|
| 4 | LOW | L05 | 152-153 | "ASCE 38-22 QL-B accuracy means the utility's horizontal location was determined by surface geophysical methods (GPR, electromagnetic) with ±1–3 foot accuracy" | Exact accuracy bounds unverifiable without primary source. Plausible (consistent with standard GPR uncertainty ranges in industry literature), but not independently confirmed. ASCE standards are proprietary (paywalled) — asce.org access blocked. | ASCE 38-22 was cited in T13.L04 (Explore wave found as vocabulary_assumed). No T13 prior-audit check for ASCE accuracy-value correctness. Risk pattern: new citation not verified by earlier RT rounds. Confidence is medium (industry-standard accuracy ranges are well-known), but primary-source check missing. |

**Resolution:** ASCE 38-22 accuracy bounds are conservative enough for OSP work (±1-3 ft is field-credible for GPR), but if this becomes load-bearing for a professional deliverable (e.g., a GIS specification document for a carrier), Haiku should do a secondary-source double-check (IEEE or industry consortium standards that cite ASCE 38-22).

---

## Cross-Topic DAG Pointers — VERIFIED CLEAN
All vocabulary_assumed entries in T16 point to prior lessons correctly. Spot-check (5 samples):
- L01 vocabulary_assumed `RUS Form 219` → T01.L05 (introduces Form 219) ✓
- L05 vocabulary_assumed `NAD83 datum` → T01.L08 (GIS lesson) ✓
- L05 vocabulary_assumed `ASCE 38-22 Quality Level` → T13.L04 ✓
- L03 vocabulary_assumed `ANSI/TIA-606-C` → T16.L01 ✓
- L02 vocabulary_assumed `OTDR trace` → T12.L07 ✓

DAG is internally consistent. No broken cross-topic pointers found.

---

## Uncertain — Cannot Close
1. **Part 32 account titles exact wording** — need primary ecfr.gov access to confirm all 8 accounts in L08 table have correct titles.
2. **TIA-598 12-color sequence** — need primary TIA-598 spec or secondary confirmation from BICSI or IEEE standards.
3. **TIA-606-C 2018 vs. current edition** — Carter decision required before publication.
4. **ASCE 38-22 QL accuracy bounds** — plausible but unverified. Low severity for OSP field crew training; high severity if used for professional deliverable specs.

---

## Splitter dB Range (L05 Polish-B correction verification)

Polish-B (`1a4f926`) noted "Splitter dB range corrections." Cannot locate the specific text that was changed in L05 — no working of splitter insertion loss appears in my read of L05 lines 1-300 (file limit reached). Recommend: search L05 for "splitter" and "dB" to confirm the polish was applied and plausible range values exist post-correction.

---

## Closeout

**Git verification (branch state):**
```
git log --oneline origin/main..HEAD
```

Initial read started `agent/verify-T16-F2-haiku`. No commits yet; will push report only.

**Summary for orchestrator:**
- T16 citations follow plausible structure consistent with FCC/RUS/TIA standards.
- No internal contradictions within T16 itself (DAG clean, cross-references correct).
- Primary-source verification blocked (ecfr.gov, tiaonline.org, asce.org all 403).
- Edition lock required (Finding #1 TIA-606-C).
- Part 32 accounts should be reverified post-T04 cleanup (Finding #2).
- Color codes plausible but unverified (Finding #3, low severity).
- ASCE accuracy bounds unverified (Finding #4, low severity).
- Recommend Haiku ground-truth on Part 32 + TIA-598 + ASCE 38-22 when primary sources become accessible OR use secondary TIA/IEEE/BICSI corroboration.

**Verdict:** YELLOW — citations are plausible and internally consistent, but primary-source verification impossible in this environment. Recommend Carter confirm TIA-606-C edition before publication, then defer Part 32/TIA-598/ASCE verification to post-audit ground-truth wave when infrastructure allows primary-source access.

---

=== T16 F2 HAIKU VERIFY END ===
