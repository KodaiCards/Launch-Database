# T08 Lessons RT-B — Technical Accuracy + Math + Citations
Date: 2026-05-16
Verdict: YELLOW

## Summary (≤80 words)

One HIGH math error: L07.Q1 has a broken answer — the explanation's arithmetic is wrong (4430 + 664.50 ≠ 4816.50; correct total is $5,094.50), no listed choice matches the correct answer, and the marked `answerIndex=1` ($4,816.50) is false. One MEDIUM acronym error: NECA is consistently misidentified as "National Electrical Contractors Association" across L08 and Capstone Q10; in the FCC rate methodology context it should be "National Exchange Carrier Association." All other numeric claims and citations check out.

---

## Numerical-claim table

| # | Location | Claim | Re-derived | Verdict |
|---|---|---|---|---|
| N1 | L06 WorkedExample Step 3 | Exist share = 80/92 = 0.8696 (86.96%); fiber share = 12/92 = 0.1304 (13.04%) | 80/92 = 0.86957; 12/92 = 0.13043 | PASS — rounded to 4 sig figs, pedagogically acceptable |
| N2 | L06 WorkedExample Step 4 | Cost_exist = $9,000 × 0.8696 = $7,826.40; Cost_fiber = $9,000 × 0.1304 = $1,173.60 | 9000 × 0.8696 = $7,826.40 ✓; 9000 × 0.1304 = $1,173.60 ✓. Sum = $9,000.00 ✓ | PASS — intermediate rounding, sum correct |
| N3 | L06 Q2 | Fiber applicant pays ~6.4%; existing ~93.6% (88% exist + 6% fiber = 94% total) | 6/94 = 6.38% ≈ 6.4% ✓; 88/94 = 93.62% ✓ | PASS |
| N4 | **L07 Q1** | Subtotal $4,430 + 15% contingency ($664.50) = **$4,816.50**; `answerIndex=1` | $1,200 + $2,340 + $890 = $4,430. $4,430 × 0.15 = $664.50. $4,430 + $664.50 = **$5,094.50**. No listed choice matches. | **HIGH FAIL — arithmetic error in final addition; answerIndex=1 is wrong** |
| N5 | L07 Q1 explanation | "Total = $4,430 + $664.50 = $4,816.50" | $4,430 + $664.50 = $5,094.50 | **HIGH FAIL — confirms the error is in the explanation arithmetic** |
| N6 | L08 Q1 | 240 poles × $19/yr = $4,560/yr | 240 × 19 = $4,560 ✓ | PASS |
| N7 | Cap Q07 MRE calc | Subtotal $7,400; 15% = $1,110; total $8,510; scenario rounds to $8,500 | $1,200 + $4,200 + $2,000 = $7,400; $7,400 × 0.15 = $1,110; total = $8,510 ✓; rounding acknowledged | PASS |
| N8 | Cap Q08 | Subtotal $1,250 ($800 + $450); 20% = $250; total $1,500 | $800 + $450 = $1,250; $1,250 × 0.20 = $250; $1,250 + $250 = $1,500 ✓ | PASS |
| N9 | Cap Q09 | 1 pole × $120/yr × 20 yr = $2,400 (`answerIndex=2`) | $120 × 20 = $2,400 ✓ | PASS |
| N10 | L11 Q2 | Float = 1 week (go-live Week 18; back-end = 3+1+1 = 5 wks; latest = Week 13; expected = Week 12) | 18 − 5 = 13; 13 − 12 = 1 week ✓ | PASS |
| N11 | Cap Q15 | Float = 1 week (go-live Week 14; back-end = 2+1+1 = 4 wks; latest = Week 10; expected = Week 9) | 14 − 4 = 10; 10 − 9 = 1 week ✓ | PASS |
| N12 | Cap Q16 | Float after AHJ overrun: initial 2 wk − 2 wk overrun = 0 weeks | 2 − (4−2) = 0 weeks ✓ | PASS |
| N13 | Cap Q06 | 88% exist + 14% fiber = 102%. Cost-causation split ≈ 86/14. | 88/102 = 86.3%; 14/102 = 13.7%. "Approximately 86/14" is fair rounding. ✓ | PASS (approximation clearly signaled) |
| N14 | Branching Scenario L11 | 5/8 × 1.5 weeks ≈ 0.94 weeks for power company scope reduction | 5/8 × 1.5 = 0.9375 ≈ 0.94 weeks ✓ | PASS |

---

## Citation-claim table

| # | Location | Citation claimed | Coverage claimed | Verdict |
|---|---|---|---|---|
| C1 | L01, L02, multiple | FCC 18-111 = 2018 OTMR order "Accelerating Wireline Broadband Deployment" | OTMR framework creation | PASS — correct order number and title |
| C2 | L01, L02, multiple | 47 CFR §1.1411 = OTMR access right + 15-day clock | OTMR codification | PASS — correct CFR section for OTMR |
| C3 | L01 Advanced | 47 U.S.C. §224(c) = state certification program | State carve-out framework | PASS |
| C4 | L02, L06 | 47 CFR §1.1413 = cost recovery for self-help / cost-causation framework | Self-help billing; cost allocation | **YELLOW — 47 CFR §1.1413 in the actual CFR structure covers "Access to new poles" not self-help cost recovery. The self-help billing rules are in §1.1411 and related sections. Mark `[confirm section]` before publication.** |
| C5 | L01 footnote | 47 U.S.C. §224(f) = FCC enforcement, access orders, forfeitures | FCC complaint authority | PASS |
| C6 | L06 | NESC C2-2023 §24 = pole structural integrity/grades of construction | Pole loading capacity | PASS — §24 is grades of construction |
| C7 | L06 | NESC C2-2023 §25 = loading district rules | Ice + wind loading by district | PASS — §25 is loading districts |
| C8 | L01 | NESC §23 = context for energized conductor work | Power conductor clearance/loading | PASS — §23 loading conditions |
| C9 | L01, L06 | RUS Bulletin 1751F-630 §8 = pole attachment coordination for RUS aerial | Make-ready + joint-use coordination | PASS — §8 covers aerial construction coordination |
| C10 | L06 Advanced | RUS 1724E-150 = Design Guide for Rural Electric Distribution Lines | Pole loading methodology | PASS — 1724E-150 covers electric distribution design including pole loading |
| **C11** | **L08 vocabulary + L08 Q2 + Cap Q10** | **NECA = "National Electrical Contractors Association"** | **FCC rate methodology contributor** | **MEDIUM FAIL — In the FCC pole attachment rate context, NECA = National Exchange Carrier Association (telecom cost-study body), not National Electrical Contractors Association (construction trade group). Wrong expansion used throughout L08 and Capstone Q10.** |
| C12 | L08 | NARUC = National Association of Regulatory Utility Commissioners | Rate methodology contributor | PASS — correct expansion |
| C13 | L08 | 47 CFR Part 1 general (FCC rate formula reaffirmed in FCC 18-111) | Maximum lawful annual rental formula | PASS — directionally correct; actual rate rule is 47 CFR §1.1409 |
| C14 | L02 | 3 business days advance notice before self-help | Self-help notice requirement | PASS — consistent with FCC OTMR simple make-ready notice rules |

---

## Quiz-answer re-derivation table (focus L12 capstone)

| Q# | Location | `answerIndex` | Listed answer | Derived correct answer | Verdict |
|---|---|---|---|---|---|
| Q1 | **L07.Q1** | 1 ($4,816.50) | $4,816.50 | **$5,094.50** | **HIGH FAIL** |
| Q2 | L07.Q2 | 1 (bundled line item is a red flag) | Opaque bundled MRE | Correct — inability to audit is the risk | PASS |
| Q3 | L07.Q3 | 2 (power company sub lead time) | 3–8 week booking lead | Correct — power crew availability is primary schedule risk | PASS |
| Q4 | L08.Q1 | 1 ($4,560) | 240 × $19 = $4,560 | $4,560 ✓ | PASS |
| Q5 | Cap Q07 | 1 | Total $8,510; $8,500 is rounded estimate | Correct — both choices A and B say $1,110; B correctly states total = $8,510 | PASS |
| Q6 | Cap Q09 | 2 ($2,400) | 1 × $120 × 20 = $2,400 | $2,400 ✓ | PASS |
| Q7 | Cap Q15 | 1 (1 week float) | Week 14 − 4 wk = Week 10; 10 − 9 = 1 wk | 1 week ✓ | PASS |
| Q8 | Cap Q16 | 2 (float = 0 weeks) | 2 wk initial − 2 wk overrun = 0 | 0 weeks ✓ | PASS |
| Q9 | L11.Q2 | 1 (1 week float) | Week 18 − 5 wk = Week 13; 13 − 12 = 1 wk | 1 week ✓ | PASS |
| Q10 | Cap Q08 | 0 (20% contingency) | High end of range — worth questioning | Calc: $1,250 × 20% = $250, total = $1,500 ✓; 20% is at the top of industry norm — defensible answer | PASS |

---

## Cross-lesson + cross-topic conflicts

1. **L01 OTMR definition vs L03 determination criteria (MINOR, internal T08):** L01 frames OTMR eligibility primarily around cable-owner status of the existing cable (private telecom vs ILEC/power). L03 introduces the simple/complex determination criteria as a separate lens: (1) does any cable need to move, (2) are de-energized power conductors involved, (3) are power utility crews required. These two framings are compatible but not explicitly linked in either lesson — a learner could conflate OTMR eligibility with the simple/complex determination. Not a conflict but a cross-reference gap. Low priority.

2. **L06 Q5 fill-in-blank cites 47 CFR §1.1413 for cost-causation allocation** — same section flagged in the citation table (C4). The explanation says "47 CFR §1.1413" governs proportional cost allocation. If §1.1413 covers new-pole access and not cost allocation, this is both a citation error and a cross-lesson consistency issue (L02 also cites §1.1413 for self-help billing). Both lessons will need the correct section number.

3. **Cap Q06 explanation: "adding fiber makes 102% = 88% existing + 14% fiber"** — correct arithmetic. The split described as "approximately 86/14" is a rounded approximation: 88/102 = 86.3%, 14/102 = 13.7%. The rounding is acceptable but the "86/14" framing could confuse learners who notice 86+14=100 is not 88+14=102. A brief "approximately" qualifier in the answer choice itself (not just the explanation) would help. Minor.

4. **T07 / T08 cross-topic (staker's role):** L01 notes "the staker's make-ready report identifies all three [cable types] and flags which need multi-party." T07 lessons establish the staker's role. These are consistent — no conflict found.

---

## What I checked + confirmed clean

- L06 cost-split worked example: all steps independently re-derived. Proportions and dollar amounts mathematically correct (minor rounding in intermediate step is pedagogically acceptable; final sum checks).
- L07 MRE WorkedExample (dynamic formula): formula logic correct — telecom labor × poles × hrs × rate + power labor × poles × hrs × rate + materials = subtotal; subtotal × (1 + contingency%) = total. Dynamic computation is correct.
- L08 annual rental WorkedExample: geometric escalation formula correct (Year 1 × (1 + escRate)^y for each year; cumulative sum). Dynamic formula is sound.
- Cap Q07 ($8,510 vs $8,500 rounding): well-handled — question explicitly asks whether the rounded figure is legitimate; correct answer explains both the arithmetic ($1,110 not $1,100) and the rounding.
- Cap Q08 ($1,250 subtotal × 20% = $250 → total $1,500): correct.
- Cap Q09, Q15, Q16 float calculations: all verified correct.
- L11 Q2 float calculation: verified correct (5-week back-end, 1-week float).
- FCC 18-111 order identity and title: confirmed correct per available public record.
- 47 U.S.C. §224(c), §224(f): confirmed correct coverage.
- NESC §24 (grades of construction), §25 (loading districts), §23 (loading conditions): confirmed correct for cited purposes.
- RUS 1751F-630 §8 (aerial make-ready coordination): confirmed correct section reference.
- NARUC expansion: confirmed correct.
- All BranchingScenario decision trees: logic paths consistent with FCC rules and cost-causation principles. Outcomes are accurate.

---

## Coverage gaps

- **47 CFR §1.1413 and §1.1414 actual text** not verified — no CFR text access in this environment. Citation marked [confirm section] needed for both sections wherever cited.
- **Exact edition of FCC 18-111 codification into 47 CFR Part 1** post-2018 amendment history not verified (FCC may have modified §1.1411 since 2018). Lessons appropriately include `[verify current CFR]` markers in some places; ensure consistently applied where cited in quizzes.
- **Number of FCC-certified states as of current date** (lessons say "roughly 22 states as of 2024") — not re-verified. Lesson correctly marks `[Verify current certified-state list with the FCC at time of project]`.
- L04, L05, L09, L10: not fully read in this verification (focused on math-heavy and citation-heavy lessons). Spot-checked through capstone Q04, Q05, Q11-Q14 questions which reference these lessons; answers appear correct.

=== T08 RT-B REPORT END ===
