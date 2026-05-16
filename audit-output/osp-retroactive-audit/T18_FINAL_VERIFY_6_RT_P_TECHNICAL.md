# T18 FINAL-VERIFY-6 RT-P — Technical + Math/Physics + Primary-Source Verification

**Constraints acknowledged: I have NOT written to any lesson file, NOT created or modified any *_CANONICAL.md, NOT written to CLAUDE.md / ARCH.md / course-catalog.js / SLEEP_SNAPSHOT.md / HANDOFF.md / pending-dispatches.md / public/training/. Write-path allowlist: this report file ONLY.**

**Framing:** Senior OSP engineer + safety officer + occupational health specialist. Technical accuracy / math / physics / primary-source verification / independent gap-research lens. HEAD SHA reviewed: `edd7ce2`.

---

## 1. Polish-6 Four-Fix Technical Re-Verification

### Fix 1 — LFL/LEL equivalence note (L03:102)

**Verified:** L03 acronym table LEL row now includes: "(LEL is also called LFL — Lower Flammable Limit — in NFPA documents and some standards literature; the values are identical.)"

**Technical accuracy:** CORRECT. NFPA 54 (National Fuel Gas Code) uses LFL terminology; 29 CFR 1910.146 uses LEL. Values are numerically identical by definition — LFL and LEL are two names for the same physical threshold. No technical objection.

### Fix 2 — 1910.146(c)(8) multi-employer callout (L03:273–280)

**Verified:** Callout at L03:273: "Multi-employer worksites (29 CFR 1910.146(c)(8))..."

**Technical citation concern — LOW:** 29 CFR 1910.146(c)(8) covers the **alternative procedures provision** — the conditions under which a permit-required confined space can be reclassified as non-permit when the only hazard is atmospheric and that hazard is eliminated by forced ventilation. Multi-employer contractor coordination is specifically covered at **29 CFR 1910.146(d)(11)** and **Appendix E to 1910.146** (Multi-employer coordination). The substantive content of the callout (host/contractor coordination, sharing hazard info, rescue responsibilities) is CORRECT — the behavior described matches OSHA's multi-employer requirements. The citation subsection is technically imprecise. This is a LOW citation issue; the lesson teaches the right practice. The operative fix would be to cite 1910.146(d)(11) (contractor coordination during permit program) rather than (c)(8) (alternative procedures reclassification). Not safety-directional — the protective message is intact.

### Fix 3 — 'Severe incident' key_terms + vocabulary_introduced in L09

**Verified:** L09:22 adds 'severe incident' to vocabulary_introduced; L09:46–49 adds matching key_terms entry. Definition: "A work-related fatality, in-patient hospitalization, amputation, or loss of an eye — each requiring direct notification to OSHA within strict timeframes under 29 CFR 1904.39." This matches 29 CFR 1904.39(a)(1)–(a)(3) verbatim in substance. **CORRECT.**

### Fix 4 — Pellistor reversibility rewrite (L03:338–350)

**Verified at L03:338–340:** "H₂S concentrations above 10 ppm can inhibit catalytic bead (pellistor) LEL sensors — typically reversibly at field-relevant concentrations."

**Technical accuracy:** CORRECT per sensor chemistry. SGX Sensortech Application Note 6 and Honeywell Midas sensor documentation confirm: at sub-100 ppm H₂S concentrations typical of telecom manholes, catalytic inhibition is usually reversible with fresh-air recovery. At high concentrations or prolonged exposure, permanent deactivation can occur. The lesson's "typically reversibly at field-relevant concentrations" + "at higher concentrations or prolonged exposure, recovery may be incomplete" accurately maps the sensor behavior. The bump-test/replace guidance retained. **TECHNICALLY SOUND.**

---

## 2. Safety-Value Primary-Source Verification Table

| Value | Lesson location | Stated in lesson | Primary source | Verdict |
|---|---|---|---|---|
| H₂S IDLH = 100 ppm | L03:170 (table) | "at 100 ppm = NIOSH IDLH" | NIOSH NPGD0337 (cdc.gov/niosh/npg/npgd0337.html, revised 1994): IDLH = 100 ppm | ✓ CORRECT |
| H₂S IDLH = 100 ppm | L03:306–307 (prose bold) | "NIOSH IDLH for H₂S is **100 ppm**" | Same NIOSH primary source | ✓ CORRECT |
| H₂S IDLH = 100 ppm | L03:308 (olfactory fatigue) | "At the IDLH (100 ppm)..." | Same NIOSH primary source | ✓ CORRECT |
| H₂S IDLH = 100 ppm | L03:367 (footer citation) | "100 ppm IDLH" with NIOSH URL | Same NIOSH primary source | ✓ CORRECT |
| H₂S 50 ppm scenario use | L03:295 | "H₂S at 50 ppm today" | Field scenario example only — NOT presented as IDLH | ✓ CORRECT (50 ppm as field scenario ≠ IDLH claim) |
| H₂S GI ceiling = 20 ppm | L03:355 | "20 ppm ceiling" | 29 CFR 1910.1000 Table Z-2: ceiling = 20 ppm | ✓ CORRECT |
| H₂S 10-min peak = 50 ppm | L03:356 | "50 ppm 10-minute peak" | 29 CFR 1910.1000 Table Z-2: 10-min max peak = 50 ppm | ✓ CORRECT |
| H₂S construction PEL = 10 ppm TWA | L03:354 | "10 ppm TWA" | 29 CFR 1926.55: 10 ppm ceiling (note: Z-1 table, historically cited as TWA — technically ceiling in standard, minor framing) | ✓ ACCEPTABLE — industry commonly describes as PEL/TWA; not clinically wrong |
| Methane lighter than air → TOP | L03:320–321 | "LIGHTER than air and accumulates at the TOP" | CH₄ molecular weight = 16.04 g/mol vs air 28.97 g/mol. Lighter-than-air: CORRECT | ✓ CORRECT |
| CO₂ heavier than air → BOTTOM | L03:319–320 | "heavier than air and accumulates at the BOTTOM" | CO₂ MW = 44.01 g/mol vs air 28.97. Heavier: CORRECT | ✓ CORRECT |
| Nitrogen near-neutral | L03:321–322 | "Nitrogen is near-neutral but can displace oxygen throughout the space" | N₂ MW = 28.01 g/mol vs air 28.97. Density ratio ≈ 0.967 — essentially neutral. "Near-neutral" accurate | ✓ CORRECT |
| O₂-deficient below 19.5% | L03:151, L03:49 | "19.5% – 23.5%" safe range | 29 CFR 1910.146(b): below 19.5% = oxygen-deficient | ✓ CORRECT |
| O₂-enriched above 23.5% | L03:151 | "23.5%" upper limit | 29 CFR 1910.146(b): above 23.5% = oxygen-enriched | ✓ CORRECT |
| LEL action threshold = 10% | L03:157–159 | "<10% LEL safe; >10% LEL: exit" | 29 CFR 1910.146 practice + ANSI/ASSE Z117.1: 10% LEL action threshold | ✓ CORRECT |
| CO NIOSH IDLH = 1,200 ppm | L03:164 | "NIOSH IDLH = 1,200 ppm" | NIOSH NPGD0105 CO entry: IDLH = 1,200 ppm | ✓ CORRECT |
| Anchor strength ≥ 5,000 lbf | L04:275 | "at least 5,000 lbf per worker attached" | 29 CFR 1910.140(c)(13): anchor must support 5,000 lbs per attached worker | ✓ CORRECT |
| Max arrest force ≤ 1,800 lbf | L04:35, L04:203 | "no more than 1,800 lbf" | 29 CFR 1910.140(d)(3)(ii): PFAS shall limit max arrest force to 1,800 lbf | ✓ CORRECT |
| Free-fall max 6 ft (lanyard) | L04 (SRL comparison) | "6-foot lanyard" free-fall | 29 CFR 1910.140(d)(3)(i): total fall distance limited; industry standard = 6 ft max for standard lanyards | ✓ CORRECT |

**All primary safety values VERIFIED against primary sources. Zero incorrect values found.**

---

## 3. Citation Verification

| Citation | Lesson | Stated description | Primary-source title check | Verdict |
|---|---|---|---|---|
| ANSI Z359.1 | L04:214 | "The Fall Protection Code — overarching PFAS system requirements" | ANSI Z359.1-2016: "Safety Requirements for Personal Fall Arrest Systems, Subsystems and Components" — commonly called "The Fall Protection Code" or the umbrella Z359 standard | ✓ CORRECT |
| ANSI Z359.11 | L04:216 | "Safety Requirements for Full Body Harnesses — performance, design, inspection, use, and maintenance" | ANSI Z359.11-2021: "Safety Requirements for Full Body Harnesses" — title is correct; scope covers design, performance, marking, inspection, care, maintenance, and use | ✓ CORRECT |
| ANSI Z359.11 | L10:267 | "body belt standard, referenced via OSHA eTool" | **INCORRECT DESCRIPTION — LOW.** Z359.11 = Full Body Harnesses standard. Body belt performance/use is addressed in ANSI Z359.3 (Positioning and Travel Restraint Systems). The quiz citation's parenthetical label is wrong — Z359.11 covers harnesses, NOT body belts. The lesson prose (L04) correctly describes Z359.11 as "Full Body Harnesses" at L04:216. Only the quiz citation parenthetical at L10:267 has the wrong label. Safety message of the quiz (positioning strap ≠ fall arrest) is unaffected; the wrong parenthetical could mislead advanced learners referencing the standard. |
| ASTM D120 §10.3 | L05:336, L05:514 | "6 months from the date of the last test" (re-test interval) | ASTM D120-14a §10.3: "Gloves shall be retested as specified in ASTM D 1051... at intervals not exceeding 6 months" — confirmed via OSHA 1910.137(b)(2)(ii) cross-reference | ✓ CORRECT |
| 29 CFR 1910.146(b) | L03:151 | "Acceptable oxygen range; oxygen-deficient below 19.5%" | 1910.146(b) Definitions: "Oxygen deficient atmosphere means an atmosphere that contains less than 19.5 percent oxygen by volume" | ✓ CORRECT |
| 29 CFR 1910.268(o)(2) | L03:177 | "Atmospheric testing for telecom manholes" | 1910.268(o)(2): "Before an employee enters a manhole or unvented vault..." requires atmospheric testing | ✓ CORRECT |
| 29 CFR 1910.147(d)(1)–(d)(6) | L02 | LOTO 6-step sequence | 1910.147(d) covers LOTO procedure in 6 steps — titles match: notification, identification, shutdown, isolation, lockout/tagout, release/verify | ✓ CORRECT |
| 29 CFR 1910.146(c)(8) | L03:273 | "multi-employer coordination" | **CITATION PRECISION ISSUE — LOW.** 1910.146(c)(8) = alternative procedures for non-permit spaces with controlled atmospheric hazards. Multi-employer coordination = 1910.146(d)(11) + Appendix E. The content taught is correct; the subsection cited is the wrong one for this purpose. |
| Z359.4 | All T18 files | Absent | Confirmed ABSENT across all 10 T18 lesson files via `grep -rn Z359\.4` | ✓ ABSENT AS REQUIRED |

---

## 4. Vite Build Result

```
cd osp-training && npm run build
```

**RESULT: ✓ CLEAN BUILD — 4.91 seconds**

`L03-confined-space-entry-D7vfigcr.js` (35.62 kB) present in output. All 10 T18 lessons chunked correctly. Zero import errors, zero syntax failures.

---

## 5. RT-O Gap-O1 Reconciliation

RT-O flagged one LOW informational item: L03:152 "Below 16% = IDLH" is a pedagogically loose shorthand (NIOSH defines IDLHs for chemicals, not for oxygen-deficiency levels as such; 16% is a physiological severity threshold, not a formally defined IDLH value). Independent technical assessment: AGREE with RT-O's classification as LOW informational. The sentence is consistent with how OSHA's own confined space training materials frame the 16% threshold as "immediately dangerous." The correct statement would be "Below 16% O₂ — immediately dangerous physiological threshold, cognitive and physical impairment likely." The current shorthand is protective in direction; no worker would make an incorrect safety decision from this framing. Concur with RT-O's no-fix recommendation given saturation state.

---

## 6. Independent Gap Research — Technical Framing

Approached from a different angle than RT-O (pedagogy/coverage): focused on physics accuracy, regulatory value accuracy, and standards cross-reference coherence.

**No NEW HIGH or MED findings.**

**LOW findings:**

**LOW-P1 — L10:267 Z359.11 citation parenthetical label wrong ("body belt standard").**
Z359.11 = Full Body Harnesses. Body belt standard = Z359.3. The quiz citation parenthetical misidentifies Z359.11's scope. Safety message of quiz is intact (positioning strap ≠ fall arrest); only the parenthetical label is wrong. Advanced learners who look up "ANSI Z359.11 body belt standard" will not find it. Fix: change to "ANSI Z359.11 (Full Body Harnesses)" at L10:267.

**LOW-P2 — L03:273 1910.146(c)(8) citation precision (also identified in Fix-2 verification above).**
Multi-employer coordination content is correct; the cited subsection (c)(8) is the wrong one (covers alternative-procedure reclassification). Correct cite: 1910.146(d)(11) + Appendix E. Low impact — the safety message (coordinate before entry, share hazard info, agree on rescue) is correct. Fix: update citation parenthetical to "29 CFR 1910.146(d)(11) + Appendix E."

**These two LOWs are the only technical gap-research findings from an independent pass. Both are citation precision issues with correct underlying safety content.**

---

## 7. Regression Check — All Prior HIGHs Intact

| High safety fix | Location | Status |
|---|---|---|
| Methane LIGHTER than air → TOP | L03:320–321 | ✓ INTACT |
| Nitrogen near-neutral | L03:321 | ✓ INTACT |
| H₂S IDLH = 100 ppm (all 4 occurrences) | L03:170, 306, 308, 367 | ✓ ALL 4 INTACT |
| LOTO verify-zero-energy entry gate (Step 5→6 sequence) | L02:148–157, 371–378 | ✓ INTACT |
| Z359.4 absent | All 10 T18 files | ✓ ABSENT |
| Z359.1 "The Fall Protection Code" | L04:214 | ✓ INTACT |
| Z359.11 "Full Body Harnesses" | L04:216 | ✓ INTACT (L10 quiz label is LOW — different location) |

**ZERO HIGH regressions. All 4 prior HIGH safety bugs are correctly fixed and intact.**

---

## 8. Final Verdict

**VERDICT: GREEN (with 2 LOW citation precision items noted)**

**Summary of findings:**

| Severity | Count | Description |
|---|---|---|
| HIGH | 0 | — |
| MED | 0 | — |
| LOW-P1 | 1 | L10:267 ANSI Z359.11 parenthetical label wrong ("body belt standard" → should be "Full Body Harnesses") |
| LOW-P2 | 1 | L03:273 1910.146(c)(8) citation for multi-employer (should be (d)(11) + Appendix E) |

Both LOWs have correct safety content — the protective messages are intact. Neither creates a directional risk for learners. Both are citation precision issues only.

**Polish-6 fixes: ALL 4 TECHNICALLY VERIFIED CORRECT.**
**Safety values: ALL VERIFIED AGAINST PRIMARY SOURCES.**
**Citations (Z359.1, Z359.11 in L04, ASTM D120, 1910.146(b), 1910.268(o)(2), 1910.147): VERIFIED CORRECT.**
**Vite build: CLEAN.**
**4 prior HIGH safety bugs: ALL INTACT.**
**Z359.4: ABSENT from all 10 T18 files.**

**T18 ready to close?** YES. The two LOW findings are citation parenthetical precision issues with no safety directional impact. From the technical/math/physics primary-source verification lens, T18 is empirically saturated. This is round 6; the two LOW citation precision issues are informational and do not warrant another fix+verify cycle. T18 is COMPLETE.

=== T18 FINAL-VERIFY-6 RT P TECHNICAL END ===
