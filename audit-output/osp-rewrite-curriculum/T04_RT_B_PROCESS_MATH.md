# T04 Research Brief RT-B — Process + Math Re-derivation

**Agent:** RT-B (Math Re-derivation + Process Check)
**Date:** 2026-05-16
**Source:** T04_RESEARCH_BRIEF.md at commit `7a3051e`; T04_RT_A_CITATIONS.md at `438a7df`
**Framing:** Complementary to RT-A — math re-derivation + paywalled-source process check + full DAG invariant deep-dive. Does NOT duplicate RT-A citation verification.

---

## Verdict (≤80 words)

YELLOW. RT-A's three MEDIUM findings confirmed. One NEW MEDIUM finding: L03 BranchingScenario teaches the wrong 811 start-date (Thursday call → Monday start; correct is Tuesday per CGA Best Practices "not including notification day" rule). One NEW LOW: GSD worked example rounds 0.825 to 0.82 rather than 0.83 (truncation artifact, correct answer visible in mm). Route scoring errors confirmed identical to RT-A. T03 DAG dependency gap quantified at 4 specific missing terms. No HIGH findings; no hallucinated documents.

---

## Math re-derivation (every numerical claim)

| Claim | Brief's value | RT-B independent calc | Match? |
|---|---|---|---|
| L06 GSD: (13.2mm × 50,000mm) / (20mm × 4,000px) | 8.25 mm/pixel | 660,000 / 80,000 = **8.25 mm/pixel** | YES |
| L06 GSD in cm | 0.82 cm/pixel | 8.25 mm ÷ 10 = **0.825 cm/pixel** | MINOR: 0.825 rounds to 0.83, brief says 0.82 (truncation not rounding) |
| L06 Expected accuracy (2× GSD) | ~1.6 cm | 2 × 0.825 = **1.65 cm ≈ 1.6 cm** | YES (acceptable rounding) |
| L05 Case 1 (pass): 18 ft − 15 ft clearance vs. 4-inch min | 36 inches >> 4 in | 3 ft × 12 = **36 inches** | YES |
| L05 Case 2 (fail): 15 ft − 14.9 ft clearance vs. 4-inch min | 1.2 inches | 0.1 ft × 12 = **1.2 inches** | YES |
| L10 scenario: 15.5 ft − 15.2 ft clearance | 3.6 inches | 0.3 ft × 12 = **3.6 inches** | YES |
| L09 Route A weighted score | 7.65 | (0.30×9)+(0.25×8)+(0.25×8)+(0.20×6) = **7.90** | **ERROR — brief wrong** |
| L09 Route B weighted score | 5.80 | (0.30×6)+(0.25×5)+(0.25×4)+(0.20×9) = **5.85** | **ERROR — brief wrong** |
| L06 RTK GNSS horizontal accuracy | ±1–3 cm | 8 mm + 1 ppm at 5 km baseline = 13 mm ≈ 1.3 cm; Emlid RS2 spec: 7 mm + 1 ppm = 12 mm at 5 km | YES — within stated range |
| L06 RTK GNSS vertical accuracy | ±1.5–3 cm | Emlid RS2: 14 mm + 1 ppm = 19 mm at 5 km ≈ 1.9 cm | YES — within stated range |
| L03 811 timing: Thursday call → Monday start | Monday | CGA Best Practices: 2 full business days NOT including notification day → Thursday = notification; Day 1 = Friday; Day 2 = Monday → start = **Tuesday** | **ERROR — scenario teaches wrong date** |
| L09 Aerial cost/ft | $6.49/ft | Cartesian/FBA study (2022): $6.49/ft × 5,280 = $34,267/mi — consistent with industry range | YES (cite as 2022 data) |
| L09 Underground cost/ft | $16.25/ft | Same study: $16.25/ft × 5,280 = $85,800/mi — 2.5× aerial, consistent with industry ratio | YES (cite as 2022 data) |

---

## Process check per paywalled claim (3)

| Claim | Source 1 | Source 2 | RT-B convergence | Verdict |
|---|---|---|---|---|
| NESC Rule 235H1 — 12-inch messenger spacing | OJUA Joint Inspection Best Practices v1.2 (ojua.org — publicly accessible at `ojua.org/wp-content/uploads/2017/02/`) which explicitly cites and quotes "NESC Rule 235H1 specifies that spacing between messengers supporting communication cables should not be less than 12 inches except by agreement" | Multiple pole attachment guidelines (FirstEnergy OTMR guide, CenterPoint Energy pole attach guide) independently confirm 12-inch minimum spacing between comm messengers | PASSES CONVERGENCE — reasoning chain is sound. OJUA document is real, public, and contains the exact rule text. No training-data slip risk — the 12-inch figure is confirmed by multiple independent non-paywalled documents. Caveat preserved. | PASSES |
| NESC Rule 235H2 — 4-inch surface-to-surface clearance between comm conductors | OJUA Joint Inspection Best Practices v1.2 (same document) — explicitly cites "clearance of 4 inches (surface-to-surface measurement) between conductors, cables, and communication equipment" per Rule 235H2 | Multiple secondary pole-attachment references confirm 4-inch minimum comm-to-comm clearance anywhere in span | PASSES CONVERGENCE — same document analysis as H1. Process is sound. No hallucination risk. Caveat preserved. | PASSES |
| CGA Best Practices — 2 full business days advance notice + 30-day mark validity | CGA FAQ + nrcga.org FAQ (nrcga.org is free, account-free) confirm 2 full business days + 30 days | State 811 programs (Colorado, Utah, multiple states) confirm same values across ≥3 independent sources | PASSES CONVERGENCE — values confirmed. However: process check identifies a **REASONING APPLICATION ERROR** in the BranchingScenario (see new MEDIUM finding below). The underlying standard (2 full business days, NOT including notification day) is correct; the applied scenario is wrong. | PASSES with caveat |

---

## DAG invariant deep-dive

| T04 lesson | Vocabulary assumed | T03 dependency? | Status |
|---|---|---|---|
| L01 (route survey) | OSP, span, attachment, FDH, strand map, project lifecycle | T01 only | ALL AVAILABLE: T01.L01 (OSP, span, attachment, FDH), T01.L07 (strand map), T01.L05 (lifecycle) — CLEAN |
| L02 (desktop research) | RUS, FCC, NESC, TIA, project lifecycle, ICEA (as acronym), NEPA, ESA, NHPA | T01 only | ALL AVAILABLE: T01.L01 (RUS), T01.L09 (FCC, ICEA, NFPA), T01.L08 (NEPA, ESA, NHPA) — CLEAN |
| L03 (811/One-Call) | OSP, project lifecycle, LOTO, PPE, OSHA 1910.268, MUTCD | T01 + T18 | T01.L08 has LOTO, PPE, MUTCD in `vocabulary_introduced`. **OSHA 1910.268 specifically NOT in T01 or any authored lesson** — T18 not yet authored. DAG BLOCKER for the OSHA 1910.268 reference specifically. |
| L04 (field data capture) | OSP, span, sag, midspan, messenger, FDH, NAP, MUTCD, LOTO, PPE | T01 + T18 | T01 covers OSP, span, sag, attachment, FDH, NAP, LOTO, PPE, MUTCD. Messenger: T03.L04 `vocabulary_introduced` — **AVAILABLE** (T03.L04 now authored). CLEAN for messenger. Same T18/OSHA 1910.268 gap as L03. |
| L05 (pole audit) | pole parts, attachment, NESC (as standards body), ANSI O5.1, messenger | T01 + T03 | T01.L02 (pole parts, NESC), T01.L08 (ANSI from acronym context), T03.L04 (messenger/ADSS). **ANSI O5.1 concept confirmed in T01.L02 content** (pole class stamp). CLEAN. |
| L06 (drone/LiDAR) | OSP, span, attachment, pole, aerial vs. underground, GPS coordinate | T01 only | ALL AVAILABLE from T01. **LiDAR** is in T01.L08 `vocabulary_introduced`. GIS in T01.L08. CLEAN. |
| L07 (GIS landbase) | OSP, FCC Part 32 plant accounts (2411/2421/2441), strand map, GPS coordinate | T01 + T04 internal | T01.L01 introduces FCC Part 32 accounts. T01.L07 introduces strand map. **G.652.D and G.657.A1 are NOT from T01 — they are T02 terms** (T02.L01 and T02.L04). Brief's DAG boundary list incorrectly attributes them to T01. Since T02 precedes T04, no teaching violation — just a mis-attribution that could confuse the author. |
| L08 (ROW research) | OSP, project lifecycle, RUS, FCC Part 32 | T01 only | ALL AVAILABLE from T01. CLEAN. |
| L09 (route alternatives + handoff) | aerial vs. underground distinction, project lifecycle, RUS | T01 only | ALL AVAILABLE. RUS Form 740c and 740g elimination are specific T04 content introduced here. CLEAN. |
| L10 (capstone quiz) | All T04 lessons L01–L09 | T04 internal | Depends on T03.L04 (messenger, EDS, RTS, ADSS all confirmed available). **811 timing scenario in Q4 uses the WRONG Monday start** — would teach wrong answer in capstone. |

### T03 dependency gap quantification

The brief's T04 vocabulary boundary claims these T03 terms as prerequisites:

| Term | T03 source lesson (per brief) | In authored T03? | Status |
|---|---|---|---|
| loose-tube | T03.L01 | YES — in `vocabulary_introduced` | AVAILABLE |
| ribbon | T03.L01 | YES — in `vocabulary_introduced` | AVAILABLE |
| ADSS | T03.L04 | YES — in `vocabulary_introduced` | AVAILABLE |
| messenger (steel strand) | T03.L04 | YES — in `vocabulary_introduced` as 'messenger' | AVAILABLE |
| EDS | T03.L04 | YES — as 'EDS (everyday stress)' | AVAILABLE |
| RTS | T03.L04 | YES — as 'RTS (rated tensile strength)' | AVAILABLE |
| RUS-listed | T03 (L05–L12, not yet authored) | NO — not in T03.L01–L04 `vocabulary_introduced` | **MISSING** |
| ICEA S-87-640 | T03 (referenced in L01 prose, but not in `vocabulary_introduced`) | Partial — acronym 'ICEA' in T01.L09 vocab; full standard as named entity NOT formally introduced in `vocabulary_introduced` array | **FORMALLY MISSING** — ICEA acronym available, but S-87-640 as a standard name is not introduced |
| bend radius | T03 (L05 per Research Brief — not yet authored) | NO — not in T03.L01–L04 | **MISSING** |
| pulling tension | T03 (L04/L05 per Research Brief — L04 has EDS/RTS but not pulling tension as standalone) | NO — 'pulling tension' not in T03.L04 `vocabulary_introduced` | **MISSING** |

**Recommendation:** T04 authoring must wait until T03 L05+ is authored (covers bend radius, pulling tension, RUS-listed in its curriculum spec), OR T04 authors introduce those 4 terms locally in the T04 lessons that first use them. The former is cleaner DAG-wise; the latter is an acceptable alternative if T03 L05+ is on a parallel track.

**OSHA 1910.268 gap (separate):** T04.L03 and L04 both reference OSHA 1910.268 as a T18 prerequisite. T18 is not yet authored. LOTO, PPE, MUTCD ARE available from T01.L08. OSHA 1910.268 (the telecom-specific worker safety standard) is NOT in any authored lesson. Options: (a) T04 introduces OSHA 1910.268 locally in L03 with a brief definition, or (b) T04 authoring waits for T18.

---

## RT-A cross-check (end-only)

**RT-A Finding M1 — Route A=7.90 (not 7.65), Route B=5.85 (not 5.80):** CONFIRMED. RT-B independently re-derived identical values using same weight×score matrix.

**RT-A Finding M2 — NAD27→NAD83 shift "≥200 m" wrong for lower 48:** CONFIRMED. USGS authoritative source states 10–100 m in contiguous 48 states; over 200 m only in Alaska.

**RT-A Finding M3 — T03 terms assumed but T03 not fully authored:** CONFIRMED AND EXTENDED. RT-B verified: EDS, RTS, ADSS, messenger ARE now in authored T03.L04. But RUS-listed, bend radius, pulling tension are MISSING from authored T03 lessons (T03 only has L01–L04 of 12 planned). ICEA S-87-640 is formally missing from `vocabulary_introduced` arrays. See DAG table above.

**Agreement: 3/3 RT-A MEDIUM findings confirmed.**

---

## Findings (severity-ranked)

### MEDIUM — New finding not in RT-A

**NEW-M1 — L03 BranchingScenario 811 timing is wrong: Monday start should be Tuesday**

The brief's BranchingScenario says: *"call on Thursday = marks by end of Friday = legal to start Monday."*

CGA Best Practices Section 3: *"At least two (2) full business days (not including the date of notification) before beginning excavation."*

Applying the rule:
- Thursday = notification day (not counted)
- Day 1 = Friday
- Day 2 = Monday
- Legal start = **Tuesday** (after 2 full business days have elapsed)

The brief's scenario compresses this to one business day (Friday only) + weekend = Monday start, which is wrong by one business day. A learner who applies this scenario on a real project will start a day early and be in violation.

**Note:** The quiz question answer ("2 full business days") is correct. Only the applied scenario is wrong.

**Fix:** Change scenario to either (a) *"call on Wednesday → marks by Thursday → legal to start Monday"* (call 2 business days before start), or (b) *"call Thursday → legal to start Tuesday morning"*. Also affects the L10 capstone question #3 (mentions when to call 811 — confirm the scenario there matches the corrected timing).

### MEDIUM — RT-A confirmed

**Confirmed-M1 — L09 Route Scoring Matrix: Route A=7.65→7.90, Route B=5.80→5.85**
See RT-A report M1. Full derivation confirmed by RT-B.

**Confirmed-M2 — L07 NAD datum shift: "≥200 m for most of U.S." → "10–100 m in contiguous U.S."**
See RT-A report M2. Author must fix the stated figure and keep the `[verify for project state]` caveat.

**Confirmed-M3 — DAG: T03 not fully authored; 4 T04-assumed terms missing**
RUS-listed, ICEA S-87-640 (as formally introduced term), bend radius, pulling tension are NOT in T03.L01–L04 `vocabulary_introduced`. T04 authoring must sequence after T03 completes OR introduce these terms locally.

### LOW

**L1 — GSD: 0.825 cm rounds to 0.83, brief says 0.82 (truncation artifact)**
The mm value (8.25 mm/pixel) is correct. The cm conversion is truncated to 0.82 rather than rounded to 0.83. Minor — learner following the mm-first calculation gets the right answer. Fix: say "0.825 cm/pixel (≈ 0.83 cm)" or just leave it in mm throughout.

**L2 — L07 brief DAG boundary mis-attributes G.652.D and G.657.A1 to T01**
These are T02 terms (T02.L01 and T02.L04 respectively). T02 precedes T04, so no teaching violation, but the brief's vocabulary table header is wrong. Author prompt should source these to T02.

**L3 — OSNR: claimed as "From T02" but absent from T02 vocabulary_introduced**
Confirmed by RT-A. OSNR does not appear in any T02 `vocabulary_introduced` array. If T04 lesson content does not actually use OSNR, low impact. If it does, T04 must introduce it or T02 must be patched.

**L4 — OSHA 1910.268 not in any authored lesson**
T04.L03/L04 reference OSHA 1910.268 as a T18 prerequisite. T18 not yet authored. T01.L08 has LOTO/PPE/MUTCD but not OSHA 1910.268 specifically. Options: introduce locally in T04.L03 or wait for T18. Low urgency — the broader safety concepts are available; the specific standard number needs a home.

**L5 — Cost figures: vintage note missing**
$6.49/ft aerial and $16.25/ft underground from Cartesian/FBA 2022 study. Author should add "[2022 Cartesian/FBA data; costs vary significantly by region and year]" inline caveat.

---

## Verdict: YELLOW

RT-A's three MEDIUM findings confirmed. One new MEDIUM finding added (L03 811 timing scenario). Four LOW findings: minor GSD rounding, two DAG attribution errors, one missing vintage note. No HIGH findings. No hallucinated documents or fabricated regulatory citations.

GREEN requires: (1) L09 route scores corrected to 7.90/5.85; (2) L07 datum shift fixed to "10–100 m in contiguous U.S."; (3) T03 L05+ authored (or T04 introduces 4 missing terms locally); (4) L03 BranchingScenario timing corrected to Tuesday start (or Wednesday call for Monday start); (5) L10 capstone Q3 811 scenario confirmed consistent with fix.

=== T04 RT-B PROCESS + MATH END ===
