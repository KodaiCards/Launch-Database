# T04 Research Brief RT-A — Citation Verification

**Agent:** RT-A (Citation Verification)
**Date:** 2026-05-16
**Source:** T04_RESEARCH_BRIEF.md at commit `7a3051e`
**Framing:** Standards citation + regulatory verifier — every factual claim with a number, threshold, or procedure independently traced to its source.

---

## Verdict (≤80 words)

YELLOW with two bugs. The brief is structurally sound — no hallucinated documents. Key citations (FCC/811, OJUA/NESC 235H1/H2, Federal Register 740g, 47 CFR 32.2000, NTIA ESA guide, GSD formula, RTK accuracy) all independently verified. Two arithmetic errors in L09 route scoring matrix: Route A scores 7.90 not 7.65; Route B scores 5.85 not 5.80. One minor discrepancy: CGA 2007 launch site was "National Mall" (brief) but primary sources say Capitol building *on* the National Mall — same venue, acceptable phrasing. Two DAG gaps require author attention before dispatch.

---

## Citation re-verification (table)

| Brief claim | Cited source | Section | RT-A status | Notes |
|---|---|---|---|---|
| FCC designated 811 on March 10, 2005 | FCC order + Colorado 811 history | FCC designation order | VERIFIED | FCC.gov document and multiple secondaries confirm exactly "March 10, 2005" |
| 811 national launch May 1, 2007, National Mall | CGA 811 campaign + call811.com | CGA history | VERIFIED with caveat | Sources say Capitol building *on* the National Mall — brief says "National Mall" which is acceptable; no material error |
| 71 regional one-call centers before 811 | Colorado 811 history | colorado811.org | VERIFIED | Wikipedia and multiple sources confirm "71 regional" figure. (One CGA 2007 press release said "62 one-call centers" — discrepancy appears to be a different count method; Colorado 811 history's "71" matches Wikipedia and is the standard citation.) |
| Pipeline Safety Improvement Act of 2002 mandated abbreviated one-call number | Colorado 811 history; PHMSA; Congress.gov | P.L. 107-355 | VERIFIED via ≥3 sources | Act signed Dec 17, 2002; FCC petition filed Aug 2003; FCC order March 2005 |
| Minimum 2 full business days notice in most states | nrcga.org FAQ; CGA Best Practices; state 811 programs | nrcga.org FAQ | VERIFIED | Multiple state programs and CGA materials confirm 2 business days as the standard minimum |
| Locate marks valid 30 calendar days in most states | nrcga.org FAQ | nrcga.org FAQ | VERIFIED | Confirmed in NRCGA FAQ and multiple state programs; brief's caveat ("some states 28 or 25 days") is correct |
| NESC Rule 235H1: messenger spacing ≥12 inches except by agreement | OJUA Joint Inspection Best Practices (ojua.org PDF) | OJUA v1.2 2017 | VERIFIED | OJUA document is publicly accessible at ojua.org. WebSearch confirms document exists and NESC Rule 235H1 = 12-inch messenger spacing requirement confirmed via OJUA content. Mark `[paywalled — verify against NESC C2-2023 Rule 235H1]` preserved. |
| NESC Rule 235H2: clearance between comm conductors ≥4 inches except by agreement | OJUA Joint Inspection Best Practices | OJUA v1.2 2017 | VERIFIED | Same document as above. WebSearch confirms 4-inch surface-to-surface clearance per NESC Rule 235H2. Mark `[paywalled — verify against NESC C2-2023 Rule 235H2]` preserved. |
| RUS Form 740g eliminated as duplicative of CWP | Federal Register Nov. 30, 2022 | FR Doc. 2022-25554 | VERIFIED | federalregister.gov document confirmed: "Form 740g is no longer being required because it duplicates information provided in the CWP or CWP Amendment and on the RUS Form 740c" |
| RUS Form 740c: OSP cost estimates per USDA guide | USDA telecom application guide | rd.usda.gov | VERIFIED | USDA rd.usda.gov Form 740c PDF publicly accessible; application guide claim confirmed |
| 47 CFR §32.2000: property records must preserve identity, vintage, location, original cost | eCFR + law.cornell.edu | 47 CFR §32.2000 | VERIFIED | eCFR and Cornell LII both confirmed. Exact language: "preserves the following detailed information: the identity, vintage, location and original cost of units of property" — matches brief's paraphrase |
| GSD formula: GSD = (sensor width × altitude) / (focal length × image width) | DJI Enterprise; Propeller Aero; Pix4D | Multiple public sources | VERIFIED | Formula independently confirmed via DJI Enterprise, Propeller Aero, Pix4D, and JOUAV. Standard photogrammetry formula. |
| GSD worked example arithmetic (L06): 13.2mm × 50,000mm / 20mm / 4000 = 8.25 mm/pixel ≈ 0.82 cm/pixel | Independent re-derivation | — | VERIFIED CORRECT | Arithmetic confirmed: (13.2 × 50,000) / (20 × 4,000) = 660,000 / 80,000 = 8.25 mm/pixel = 0.825 cm/pixel ≈ 0.82 cm/pixel. 2× GSD accuracy = 1.65 cm ≈ 1.6 cm as stated. |
| RTK GNSS: ±1–3 cm horizontal, ±1.5–3 cm vertical typical | PointOneNav; rtkdata.com; emlid.com | Multiple public sources | VERIFIED | Survey-grade RTK accuracy: 1–2 cm horizontal well-confirmed; vertical ~15 mm (1.5 cm) confirmed via ArduSimple, Bench Mark. Brief's "1.5–3 cm vertical" is within the range reported across sources. |
| NAD27→NAD83 shift: 10–300 m depending on location; brief says "≥200 m for most of U.S." with caveat | USGS datum FAQ | USGS FAQ | PARTIALLY VERIFIED — caveat required | USGS confirms shift is 10–100 m in the conterminous 48 states; 200 m+ is Alaska/Hawaii. Brief's claim "≥200 m for most of U.S." is technically WRONG for the lower 48 (where OSP work occurs). The USGS says 10–100 m for conterminous U.S. Brief does carry a `[verify shift magnitude for specific project state]` caveat, which partially mitigates. Author must fix the claim: "typically 10–100 m in the contiguous U.S.; can exceed 200 m in Alaska and Hawaii." |
| NTIA ESA Guide 2026: IPaC covers USFWS only, not NMFS | NTIA Guide to Streamlined ESA Compliance (Jan/Feb 2026) | broadbandusa.ntia.gov | VERIFIED | Document exists publicly at broadbandusa.ntia.gov. Quote confirmed: "IPaC is only used for USFWS listed species and does not cover species under the jurisdiction of NMFS" |
| FCC 5-year pole attachment audit requirement | FCC pole attachment rules (search result summary) | 47 CFR 1.14xx | PROVISIONAL — needs CFR section | Brief correctly flags this as provisional. WebSearch found industry confirmation ("FCC requires attachment counting audits once every five years") but the exact CFR subsection was not confirmed in public search results. `[confirm via 47 CFR 1.14xx]` flag is appropriate. Do NOT use without confirmed CFR section. |
| Route A score 7.65; Route B score 5.80 (L09 scoring matrix) | Independent re-derivation | — | **ARITHMETIC ERROR** | See Math Errors section below. Route A = 7.90; Route B = 5.85. The winner (Route A) is correct but the stated numbers are wrong. |
| Aerial cost ~$6.49/ft; underground ~$16.25/ft | Module02_OSPDesign.jsx Cartesian/FBA source | Cartesian/Fierce Network | VERIFIED via brief attribution | Brief attributes to Module02 verified source (Cartesian/FBA study). Acceptable cross-reference. |

---

## Paywalled-claim secondary-source convergence check (3)

| Claim | Source 1 | Source 2 | RT-A independent verdict |
|---|---|---|---|
| NESC C2-2023 Rule 235H1 — 12-inch messenger spacing | OJUA Joint Inspection Best Practices v1.2 (ojua.org — publicly accessible PDF) | WebSearch independently confirmed: "NESC Rule 235H1 specifies that spacing between messengers supporting communication cables should not be less than 12 inches except by agreement" via multiple pole attachment references | PASSES CONVERGENCE. Both sources agree on the 12-inch value. OJUA document verified as real and publicly accessible. Paywalled caveat properly preserved in brief. |
| NESC C2-2023 Rule 235H2 — 4-inch surface-to-surface clearance between comm conductors | OJUA Joint Inspection Best Practices v1.2 (ojua.org) | WebSearch confirms: "clearance of 4 inches (surface-to-surface measurement) between conductors, cables, and communication equipment" per OJUA citing NESC Rule 235H2 | PASSES CONVERGENCE. Both sources agree on 4-inch value. Paywalled caveat properly preserved. |
| CGA Best Practices — 2-day advance notice + 30-day mark validity | CGA FAQ + nrcga.org FAQ (accounts-gated CGA; nrcga.org is free) | State 811 programs (Colorado, Utah, multiple state portals) confirmed 2-day minimum; Colorado 811 history confirms 30-day standard. ≥3 independent state sources cited in brief. | PASSES CONVERGENCE. The 2-day and 30-day values are universally confirmed across state programs. Brief's paywalled-claim treatment is appropriate. |

---

## Independent re-research on flagged items (6)

**1. FCC 811 designation date (2005 vs. 2007):**
The brief correctly distinguishes the two events. FCC *designated* 811 on **March 10, 2005** (FCC N-11 order). The national *awareness campaign launch* was **May 1, 2007** on the National Mall. Brief is accurate. L03 quiz question B ("2005" for FCC designation) is correct. VERDICT: CONFIRMED.

**2. NESC Rule 235H1 messenger spacing = 12 inches:**
OJUA Joint Inspection Best Practices document confirmed at ojua.org/wp-content/uploads/2017/02/. WebSearch directly returned the document and confirmed the 12-inch value. VERDICT: CONFIRMED via OJUA secondary source.

**3. NESC Rule 235H2 comm conductor clearance = 4 inches:**
Same OJUA document. WebSearch confirmed 4-inch surface-to-surface clearance. VERDICT: CONFIRMED via OJUA secondary source.

**4. NAD27→NAD83 shift magnitude:**
USGS FAQ (primary authoritative source — usgs.gov/faqs/how-large-north-american-datum-1927-nad-27-nad-83-shift): "Within the conterminous 48 states, the NAD 27 to NAD 83 shift is in the range of **10–100 ground meters**. Shifts ... over 200 meters in Alaska, and over 400 meters in Hawaii." Brief states "≥200 m" for most of U.S. — this is WRONG for the lower 48 where OSP work occurs. The `[verify for project state]` caveat partially covers this but the stated figure still misleads. VERDICT: MEDIUM FINDING — fix required.

**5. FCC pole attachment audit every 5 years:**
WebSearch confirmed the industry standard that FCC requires 5-year counting audits, but the exact CFR subsection was not confirmed. A 2024 FCC order revised 47 CFR 1.1411, and 1.1411(c)(4) now covers cyclical inspection sharing requirements. The "5-year" frequency may be in the FCC 18-111 (OTMR Order) or a pre-2024 provision. VERDICT: PROVISIONAL — brief correctly flagged this as `[confirm via 47 CFR 1.14xx]`. OK to proceed with flag; do not harden the cite without CFR section number.

**6. GSD formula (L06 worked example):**
Formula GSD = (sensor width × altitude) / (focal length × image width) independently confirmed via DJI Enterprise, Propeller Aero, Pix4D, Inertial Labs. Worked example arithmetic re-derived: 8.25 mm/pixel = 0.825 cm/pixel ≈ 0.82 cm/pixel — CORRECT. Accuracy estimate (2× GSD ≈ 1.6 cm) CORRECT. VERDICT: CONFIRMED. Math is sound.

---

## Math Errors Found

**L09 Route scoring matrix — two arithmetic errors:**

The brief's worked scoring matrix uses correct criteria weights (30/25/25/20%) and correct raw scores but produces wrong weighted totals:

| | Constructability (30%) | Permitting (25%) | Cost (25%) | Reliability (20%) | Brief's total | Correct total |
|---|---|---|---|---|---|---|
| Route A | 9 | 8 | 8 | 6 | **7.65** | **7.90** |
| Route B | 6 | 5 | 4 | 9 | **5.80** | **5.85** |

Correct computation Route A: (0.30×9) + (0.25×8) + (0.25×8) + (0.20×6) = 2.70 + 2.00 + 2.00 + 1.20 = **7.90**
Correct computation Route B: (0.30×6) + (0.25×5) + (0.25×4) + (0.20×9) = 1.80 + 1.25 + 1.00 + 1.80 = **5.85**

The winner recommendation (Route A) is correct. The margin is correct in direction. But the stated numbers (7.65 and 5.80) don't match the inputs. Author must use 7.90 and 5.85.

**Severity: MEDIUM** — appears in a worked example that students calculate step by step; wrong numbers will cause learner confusion when they check the math.

---

## DAG cross-check

| T04 lesson | "Assumed from T01/T02" claim | Verified against latest T01/T02 vocabulary_introduced? |
|---|---|---|
| L01 (route survey) | OSP, span, attachment, FDH, strand map | VERIFIED — all in T01 vocabulary_introduced: OSP (L01), span (L02), attachment (L02), FDH (L07), strand map (L07) |
| L02 (desktop research) | RUS, FCC, project lifecycle, standards landscape | PARTIALLY VERIFIED — RUS: T01 L08 lists `vocabulary_assumed: [{term: 'RUS', source_lesson_id: 'T01.L01'}]` meaning RUS is first-introduced in T01.L01 content even though not in L01's `vocabulary_introduced` array. FCC is in T01.L09 `vocabulary_introduced`. NESC is in T01.L08 `vocabulary_introduced`. BICSI similar pattern to RUS (introduced in L01 content; L08 lists it in `vocabulary_assumed`). No blocker — these terms are in T01. |
| L03 (811) | OSHA 1910.268, LOTO | **DAG GAP — T18 NOT AUTHORED YET.** T04 brief claims T18 vocabulary (LOTO, PPG glove class, MAD/MAB, MUTCD, OSHA 1910.268, traffic control, atmospheric testing) as available prerequisites. T18 directory does not exist (`/osp-training/src/lessons/T18/` absent). T01.L08 does introduce LOTO, PPE, MUTCD, NEPA as acronyms (confirmed in T01 vocabulary_introduced). OSHA 1910.268 is not in T01 vocabulary. Author note: T04 may reference OSHA 1910.268 only via T01.L09 standards landscape or must wait for T18. Flag for authoring team. |
| L04–L06 (field, pole audit, drone) | sheath, buffer tube, armor, ripcord, messenger | VERIFIED — all in T01.L03 vocabulary_introduced |
| L05 (pole audit) | NESC (as standards body) | VERIFIED — NESC in T01.L08 vocabulary_introduced |
| L05 | ANSI O5.1 | VERIFIED — brief attributes to T01.L02 background and T01 Research Brief; T01.L02 introduces 'pole class' and references ANSI O5.1 in lesson content |
| L07 (GIS) | "FCC Part 32 plant accounts" (aerial=2411, underground=2421, buried=2441) | VERIFIED via brief's own T01 cross-ref — T01 L01 content references 47 CFR Part 32 plant accounts; T01 Research Brief confirms as VERIFIED citation |
| L07 | G.652.D, G.657.A1 | **DAG ATTRIBUTION ERROR — medium.** Brief lists G.652.D and G.657.A1 under "From T01" vocabulary. They are NOT in T01 `vocabulary_introduced`. They ARE in T02: G.652.D in T02.L01 vocabulary_introduced; G.657 (and G.657.A1 discussed) in T02.L04 vocabulary_introduced. Brief's DAG section correctly lists "G.652.D, G.657.A1" under "From T02" — so the sentence "From T01: ... G.652.D, G.657.A1" in the DAG Position section is WRONG. Fortunately T02 DAG position precedes T04, so there is no teaching violation — just a mis-attribution in the brief. Flag for author prompt clarity. |
| L03–L09 (all) | OSNR (claimed from T02) | **NOT IN T02 vocabulary_introduced.** OSNR does not appear in any T02 `vocabulary_introduced` array. It also does not appear as a defined term in T02 content. Brief lists OSNR under "From T02." OSNR is not currently introduced by any authored lesson. If T04 lessons teach to OSNR, they need to introduce it or T02 must be patched. LOW impact (T04 brief uses OSNR only in the DAG vocabulary section, not in actual lesson content). |
| All | T03 terms: loose-tube, ribbon, ADSS, messenger (steel strand), RUS-listed, ICEA S-87-640, bend radius, pulling tension, EDS, RTS | **DAG GAP — T03 ONLY PARTIALLY AUTHORED.** T03 directory contains only L01 (loose-tube, tight-buffered, ribbon, rollable ribbon). ADSS, messenger, RUS-listed, ICEA S-87-640, bend radius, pulling tension, EDS, RTS are NOT yet in T03 vocabulary_introduced. These terms would be undefined if T04 authors use them. T03 authoring must complete before T04 authoring begins, or T04 must avoid these terms. |

---

## Allowlist additions verification (4)

| Proposed source | Authoritative? | Use case | RT-A recommendation |
|---|---|---|---|
| CGA Best Practices Guide (commongroundalliance.com) | YES — the industry-standard damage prevention guide; widely cited by all U.S. state 811 programs | 811 excavation notice requirements, locate mark validity periods | RECOMMEND ADD to allowlist under new "Damage Prevention / 811" section |
| OJUA Joint Inspection Best Practices v1.2 2017 (ojua.org) | YES — Oregon Joint Utility Association; publicly accessible PDF at ojua.org; explicitly cites and quotes NESC Rule 235H1 and H2 verbatim | Secondary source for paywalled NESC §235 pole zone and clearance requirements | RECOMMEND ADD as secondary source for NESC §235 under NESC section |
| NTIA Guide to Streamlined ESA Compliance for Broadband Deployments (2026) | YES — official NTIA/USDC publication at broadbandusa.ntia.gov; updated Jan/Feb 2026; primary federal guidance for broadband ESA compliance | IPaC usage, no-effect determinations, USFWS/NMFS distinction, T04 L02 | RECOMMEND ADD under "State / Federal Environmental" section |
| Katapult Engineering technical blog (katapultengineering.com/blog) | ACCEPTABLE as secondary OSP practice source — well-known industry engineering firm; content verified as technically accurate and consistent with other OSP sources; not vendor marketing, it's engineering methodology documentation | Pole audit methodology, photogrammetric measurement accuracy, LiDAR pros/cons for OSP | RECOMMEND ADD under new "OSP Field Practice Secondary Sources" section with caveat: "acceptable for field methodology facts; not authoritative for standards/regulatory claims" |

---

## Findings (severity-ranked)

### MEDIUM

**M1 — L09 Route Scoring Matrix arithmetic errors (two)**
Route A: brief states 7.65, correct is 7.90. Route B: brief states 5.80, correct is 5.85.
Re-derive: (0.30×9)+(0.25×8)+(0.25×8)+(0.20×6) = 7.90; (0.30×6)+(0.25×5)+(0.25×4)+(0.20×9) = 5.85.
Author must fix both numbers in the lesson body. The recommendation (Route A wins) is directionally correct.

**M2 — L07 NAD27→NAD83 shift magnitude incorrect for lower 48**
Brief says "≥200 m for most of U.S." USGS FAQs (authoritative source): "Within the conterminous 48 states, the shift is in the range of 10–100 ground meters. Shifts over 200 meters in Alaska." OSP work is primarily in the lower 48. Fix: "typically 10–100 m in the contiguous U.S.; can exceed 200 m in Alaska and over 400 m in Hawaii (USGS)."

**M3 — DAG: T03 terms assumed but T03 not fully authored**
T04 brief's vocabulary boundary claims ADSS, ICEA S-87-640, bend radius, pulling tension, EDS, RTS from T03. Only T03.L01 exists (introduces: loose-tube, tight-buffered, ribbon, rollable ribbon). T03 must be fully authored before T04 authoring begins, OR T04 authors must list these terms as introduced-in-T04 if T03 won't cover them before T04 dispatches.

### LOW

**L1 — L03: 62 vs. 71 one-call centers discrepancy**
One CGA press release source cited in the search cited "62 one-call centers" at the 2007 launch; Colorado 811 history (and Wikipedia) say "71 regional services." Brief uses 71 (from Colorado 811). The two counts likely differ by methodology (some centers served multiple states). 71 is the more widely cited number and is defensible. Author should note "approximately 71" to allow for the documented variation.

**L2 — G.652.D/G.657.A1 mis-attributed to T01 in DAG boundary list**
Brief's vocabulary list header says "From T01: ... G.652.D, G.657.A1." These are T02 terms (T02.L01 and T02.L04). T02 precedes T04 in the DAG, so no teaching violation occurs. Author prompt should source these correctly as T02 to avoid confusion.

**L3 — OSNR listed as "From T02" but not in T02 vocabulary_introduced**
OSNR does not appear in any T02 lesson's vocabulary_introduced array. T04 should not assume OSNR without citing where it's introduced. If T04 lessons don't actually use OSNR, this is a non-issue. Brief DAG section lists it but lesson content does not reference it — LOW impact.

**L4 — T18 dependency: OSHA 1910.268 not in any authored lesson**
T04.L03 prerequisites include "OSHA 1910.268" from T18. T18 is not yet authored. T01.L08 introduces OSHA, LOTO, PPE as acronyms. The full OSHA 1910.268 telecom worker safety standard is not formally introduced in any authored lesson. Brief lists it as T18 dependency. Author must confirm T18 will precede T04 in build order before dispatching T04.

**L5 — FCC 5-year pole audit requirement: CFR section not pinned**
Brief correctly flags this as `[confirm via 47 CFR 1.14xx]`. Confirmed the practice exists industry-wide; CFR subpart not independently verified. Provisional flag appropriate. Do not harden to a specific section without verification.

---

## Verdict: YELLOW

Two MEDIUM findings (arithmetic errors in L09; NAD datum claim wrong for lower 48) block GREEN. Neither is a hallucinated citation; both are correctible with specific fixes. No HIGH findings (no hallucinated documents, no fabricated regulatory citations). GREEN requires: (1) L09 route scores corrected to 7.90/5.85; (2) L07 datum shift fixed to "10–100 m in lower 48"; (3) T03 authoring confirmed complete or T04 vocabulary boundary adjusted; (4) author aware that OSHA 1910.268 requires T18 or local introduction.

=== T04 RT-A CITATION VERIFICATION END ===
