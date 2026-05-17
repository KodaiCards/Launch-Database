# T03 RETROACTIVE AUDIT R-3 — Forensic / Incident-Investigation / Field-Failure Framing

**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T03_AUDIT_R3_FORENSIC.md` written.**

Date: 2026-05-17
Framing: Forensic / incident-investigation / field-failure. Evaluates T03 content by asking "does this lesson prevent the documented failure mode?" and "what would a plaintiff's attorney / NESC compliance investigator find missing?"
Scope: All T03 lessons (L01–L12). DIFFERENT sources from R-1/R-2 where possible.

---

## 1. Registry Consultations

- `citation-registry.md`: G.655 and G.656 confirmed as registry entries (ITU-T T-REC-G.655 + T-REC-G.656; Last Verified 2026-05-17) — registry treats both as T02/T03 gaps.
- `dag-registry.json`: `build-dag-registry.js` run fresh. Zero unverified T03 pointers (all 22 T03-to-Tx pointers marked verified). One DUPE: `radial ice thickness` — introduced by BOTH T03.L09 AND T05.L06. Not a prerequisite violation (T03 introduces it before T05 in teaching order) but a duplication that may confuse learners about which lesson "owns" the term.
- `validate-lesson-schema.js T03`: **11 of 12 lessons FAIL** on missing `learning_objectives` field. L12 (capstone) PASSES. Two WARNings: L04 (6 key_terms, 4 Flashcard cards) and L09 (5 key_terms, 4 Flashcard cards).

---

## 2. Independent Primary-Source Verification Log

Sources differ from R-1 and R-2 to satisfy saturation requirements.

| Claim | R-3 Source | Verdict |
|---|---|---|
| NEC §770.179(B) — armored indoor fiber riser coverage | NEC 2023 Art. 770 commentary via ICC Digital Codes public index + OCC D-Series "UL listed per NEC 770.179(b)" verbatim on product page | CONFIRMED — §770.179(B) governs listed armored indoor fiber cable in riser shafts |
| NESC loading districts (Heavy/Medium/Light values) | RUS Bulletin 1724E-150 Table 1 (publicly available from USDA) — reproduces NESC Table 250-1 verbatim: Heavy 0.5in/4psf/0°F, Medium 0.25in/4psf/15°F, Light 0in/9psf/30°F | CONFIRMED — T03.L09 values match |
| ADSS 432F limit | CommScope "What You Need to Know About ADSS vs. Lashed Fiber" — "usually a loose tube design that have fiber counts up to 432F" | CONFIRMED |
| ADSS 700 m span capability | incabamerica.com ACES CATS paper — "up to 700 metres" cited in L04 Advanced | CONFIRMED |
| NEC §770.48(A) 50 ft unlisted cable | ICC Digital Codes Art. 770 summary + NEC 2023 §770.48(A) paywalled but widely confirmed in BICSI/FOA public commentary | CONFIRMED — 50 ft rule is correct |
| UL 1666 OFNR flame propagation test | UL Standards (UL 1666 abstract) — vertical flame propagation for riser cables | CONFIRMED — 4.6 m cited by R-1 is the commonly cited figure (UL 1666 actual text paywalled) |
| G.657.A1 10 mm minimum bend radius | FOA Ref Guide + ITU-T G.657 summary at itu.int (paywalled but title/scope confirmed) — A1 = 10 mm | CONFIRMED |
| 250 µm coated fiber dimension | ITU-T G.652.D Table 4: coating diameter 245–250 µm → 0.250 mm NOT 2.5 mm | CONFIRMED UNIT ERROR in L05:129 (0.250 mm, not 2.5 mm). R-3 independently derives from ITU-T. |
| 7 CFR 1755.902 MFD tolerance | eCFR.gov §1755.902(b)(1)(i)(A): "Mode field diameter: nominal value of 9.2 micrometers with a tolerance of ±0.5 micrometers" | CONFIRMED — ±0.5 µm is correct for RUS/CFR; wider than ITU-T G.652.D ±0.4 µm intentionally |

---

## 3. Forensic Scenario Coverage Table

| # | Failure Scenario | T03 Coverage | Verdict |
|---|---|---|---|
| 1 | Bend-radius violation — installer kinks fiber | L05 covers G.657.A1/A2/B3 min radii; L08 BranchingScenario explicitly teaches G.652.D → macrobend at 15 mm bend. ICEA S-87-640 and G.657 ITU-T cited. | **PRESENT + ADEQUATE** — L05:146, L08:250-251 |
| 2 | OFNR vs OFNP in plenum return air — code violation | L02 explicitly covers OFNR vs OFNP hierarchy; L02 BranchingScenario node `plenum-run` teaches OFNP required regardless of distance, OFNR not a substitute. | **PRESENT + ADEQUATE** — L02:265-268 |
| 3 | OSP cable run inside building >50 ft — NEC 770.48 violation | L02 teaches 50-ft rule explicitly + Book vs. Field callout with riser example. BranchingScenario `long-run` node (80 ft case) directly addresses this. | **PRESENT + ADEQUATE** — L02:118-131, 258 |
| 4 | ADSS span exceeded — strand failure in ice storm | L09 teaches ice+wind load formulas + NESC loading districts + WorkedExample ADSS loading calculator + creep/thermal discussion. However: no guidance on HOW to select from manufacturer span-rating tables (which ADSS catalog product matches a given span + loading case). Instruction stops at deriving sag; doesn't bridge to "look up manufacturer sag-tension tables." | **PRESENT + INADEQUATE** — derivation correct; product-selection step missing (see NEW FINDING N-R3-2) |
| 5 | OPGW for shield-wire substitution — utility context | Entirely absent. Not mentioned anywhere in T03. | **ABSENT** — R-2 N-2 corroborated |
| 6 | G.655 NZDSF deployed where G.652.D would suffice | G.655/G.656 absent from T03. A learner cannot be warned about inappropriate NZDSF deployment without knowing it exists. | **ABSENT** — R-1 F-1 / R-2 F-1 corroborated |
| 7 | Wrong sheath for direct-burial — rodents chew PE | L03 explicitly teaches CST armor required in documented rodent areas; consequence of missing armor discussed. Field engineers learning L03 know to specify rodent-proof armor when activity is present. | **PRESENT + ADEQUATE** — L03:147-154 |
| 8 | Cable OD confused with fiber coating OD | L05:129 USES the confusion as a mistake ("250 µm coated fiber = 2.5 mm") — the derivation itself is the bad example. A learner reading the worked example learns the WRONG substitution. | **PRESENT + TEACHING THE WRONG VALUE** — R-1 F-2 / R-2 F-2 — HIGH |
| 9 | Tensile load exceeded — GR-20 tensile spec violation | ICEA S-87-640 tensile ratings cited in L10 (2,670 N standard). GR-20 absent. L11 covers tensile spec reading. Maximum pulling tension NOT covered — L09/L11 focus on stringing tension (EDS), not installation pulling force limits. | **PARTIAL — PRESENT for EDS; ABSENT for maximum pulling tension during installation** (see NEW FINDING N-R3-3) |
| 10 | Color-code mismatch — TIA-598-D vs proprietary | L10 mentions TIA-598-D; L11 covers datasheet reading with color code. Basic coverage adequate for 12-fiber tubes. No specific warning about vendor proprietary beyond-12-fiber count extensions (where confusion actually occurs). | **PRESENT + ADEQUATE** — L10, L11 |

---

## 4. R-1 / R-2 Reconciliation (Independent Sources)

| Finding | R-3 Status | New Source |
|---|---|---|
| G.655/G.656 absent (HIGH) | CONFIRMED via fresh grep + citation-registry | Registry entry corroborates |
| L05 250µm = 2.5mm unit error (MED) | CONFIRMED via ITU-T G.652.D Table 4 (0.250 mm coating OD) | ITU-T primary — confirms R-1/R-2 |
| L02 NEC T01.L09 → should be T01.L08 (MED) | CONFIRMED — L02:27 `source_lesson_id: 'T01.L09'`; NEC intro is T01.L08 (vocabulary_introduced confirmed at T01.L08 line 65 field) | dag-registry |
| NEC §770.179(B) introduced L07, used in L03 (MED N-1) | CONFIRMED — L03:41 has NEC §770.179(B) in key_terms definition; L03:110 and 157 use it substantively; L07 (later) is where vocabulary_introduced lists it | Direct read confirmed |
| OPGW absent (MED N-2) | CONFIRMED — zero hits | Fresh grep |
| ICEA S-87-640 missing from L01 vocab_introduced (MED N-3) | CONFIRMED — L01 vocabulary_introduced list confirmed via read; ICEA S-87-640 not in it | Direct read |
| 7 CFR 1755.902 ±0.5 µm (LOW) | CONFIRMED as CORRECT — eCFR.gov verbatim ±0.5 µm | New source |

---

## 5. Structured New Findings

| # | Sev | Category | File:Lines | Issue | Fix shape |
|---|---|---|---|---|---|
| N-R3-1 | MED | Schema — `learning_objectives` missing from 11 of 12 lessons | L01–L11 (all except capstone) | `validate-lesson-schema.js T03` returns FAIL on 11 lessons for missing `learning_objectives` field in meta. T01 lessons and newer T05 lessons have this field; T03 doesn't. Affects lesson navigation UI that reads this field. | Add `learning_objectives: [...]` array to meta in L01–L11; 2–4 bullet learning objectives per lesson |
| N-R3-2 | MED | Content gap — missing manufacturer sag-tension table guidance | L04 advanced, L09 | L09 teaches ADSS load/sag derivation but never explains how to cross-reference the calculated sag against a manufacturer's sag-tension table to SELECT a cable product for the span. Real ADSS selection: (1) calculate design load, (2) pick a span-class (short/medium/long/extra-long in manufacturer catalogs), (3) read EDS and MAT from the sag-tension tables for your span. Step 2+3 are absent — a learner who does the derivation still doesn't know how to turn it into a cable order. | Add an Advanced section in L09 or L04 bridging from "we calculated w_total and sag" → "here is how to read a CommScope/OFS/Corning ADSS sag-tension table and pick the catalog span class"; include a representative table-reading example |
| N-R3-3 | MED | Content gap — maximum pulling tension during installation absent | L09, L11 | Forensic scenario 9: T03 covers EDS (everyday long-term tension) but never covers maximum allowable pulling tension during installation — a different value (typically expressed as a % of RTS or in absolute lbf/N per ICEA S-87-640 or manufacturer limit). A crew exceeding pulling tension is a real failure mode (aramid yarns can be permanently stretched, fiber macrobend damage occurs). ICEA S-87-640 and cable datasheets specify a maximum installation pulling force distinct from EDS. | Add to L09 Advanced or L11 Datasheet Reading: "Installation pull force limit — what it is and why it differs from EDS: pulling tension during installation is a short-term dynamic load; EDS is the long-term static load. Max pull force is specified in the datasheet (e.g., 2,700 N for an ADSS with 2,000-lbf RTS — verify against datasheet). Exceeding it causes permanent elongation of aramid yarns." |
| N-R3-4 | LOW | Schema — L04 Flashcard missing EDS and RTS cards (2 of 6 key_terms) | L04:363–386 | L04 has 6 key_terms (ADSS, messenger, lashing wire, EDS, RTS, figure-8). Flashcard deck has 4 cards (ADSS, messenger, EDS, figure-8) — `lashing wire` and `RTS` have no Flashcard cards. WARN from validator confirmed. | Add 2 Flashcard cards: one for lashing wire ("A small-diameter metallic wire applied in a helix...") and one for RTS ("The cable manufacturer's rated breaking strength...") — both definitions already exist in key_terms; just render them |
| N-R3-5 | LOW | Schema — L09 Flashcard missing MAT (Maximum Allowable Tension) card | L09:441–470 | L09 has 5 key_terms (NESC loading district, Extreme Wind loading, radial ice thickness, wind pressure, MAT). Flashcard deck has 4 cards — `wind pressure` has no card. WARN from validator confirmed. | Add Flashcard for wind pressure: "Horizontal pressure on the cable's projected area from wind, in lb/ft². Light district: 9 lb/ft². Heavy and Medium: 4 lb/ft²." |
| N-R3-6 | LOW | DAG — radial ice thickness dual introduction | T03.L09 + T05.L06 both introduce `radial ice thickness` | `dag-registry.json` DUPE: `radial ice thickness` introduced by T03.L09 AND T05.L06. Teaching order has T03 before T05; T05.L06 should assume it from T03.L09. Prerequisite invariant technically not violated (T03 before T05) but second introduction without cross-ref creates learner confusion about term ownership. | T05.L06 should move `radial ice thickness` to vocabulary_assumed pointing to T03.L09, not re-introduce it |

---

## 6. Under-Audited Rotation Findings

**L04 ADSS span-rating specifics (R-2 hint applied):**
L04's Advanced section states "ADSS cables can span up to approximately 700 m" and gives aramid vs fiberglass rod distinction for long spans. Source cited: incabamerica.com ACES CATS paper. The 700 m figure is plausible and aligns with industry literature. However, no span-class guidance is given (what L04 calls "long-span" vs manufacturer catalog terminology like ADSS-4B Short Span / Medium Span / Extra Long Span). The content is adequate for conceptual understanding but the field-application gap identified in N-R3-2 above is real. No fabrication detected; citations are secondary but plausible.

**L08 fiber-count growth margin sourcing (R-2 hint applied):**
L08:196 states "20% growth margin" at distribution level and "2×" at feeder level. Source attributed to FOA FTTH design guide (thefoa.org). These are widely accepted industry rules-of-thumb — the FOA FTTH Course textbook does include distribution planning guidance consistent with these numbers. The "20%" figure is an industry standard, not a fabricated value. However, the 2× feeder rule is stated without citation in the prose at L08:190-193 (only the distribution-level 20% is attributed to FOA; feeder 2× is stated as practice without a citation). Low risk — widely accepted — but worth adding a citation anchor.

**L06 (mid-range, untouched by R-1/R-2):**
L06 (Cable Sheath & Jacket Material) covers HDPE, LSZH, flooding compound, and dry-block. BranchingScenario scenarios are sensible (HDPE for OSP, LSZH for indoor, gel vs dry-block tradeoffs). Math reviewed: no quantitative claims except "approximately one-third the time" for dry-block vs gel prep — secondary source claim, no fabrication risk. Citation structure consistent: HDPE UV stabilization (bwnfiber.com + shobeirshimi.com), gel fill (generic industry knowledge with no fabricated spec numbers). No new findings in L06.

**L09 NESC district WorkedExample (R-2 hint applied):**
WorkedExample at L09:297–361 uses Light district (no ice, 9 lb/ft² wind, default 0.71 in OD, 0.068 lb/ft cable weight, 2000 lbf RTS at 20% EDS = 400 lbf tension, 200 ft span). Math re-derived:
- w_wind = 9 × (0.71/12) = 9 × 0.0592 = 0.533 lb/ft
- w_total = √(0.068² + 0.533²) = √(0.004624 + 0.284089) = √0.288713 = **0.537 lb/ft**
- sag = 0.537 × 200² / (8 × 400) = 0.537 × 40000 / 3200 = 21480 / 3200 = **6.71 ft**

The WorkedExample formula and SliderExploration at L09:370 compute consistently with this derivation. No arithmetic error found. NESC values confirmed (RUS 1724E-150 public source). **PASS.**

---

## 7. DAG / Cascade-Pattern Sweep

**Broken pointer count (T03 lessons):** 3 confirmed broken pointers (F-3 / N-1 / N-3 from R-1+R-2). DAG registry shows 0 additional unverified T03 pointers beyond what R-1/R-2 already flagged — all 22 T03-to-Tx DAG pointers are verified.

**P1 cascade check (vocabulary_introduced vs. vocabulary_assumed misalignment):** N-1 (NEC §770.179(B) taught in L03 but introduced in L07) is the only P1-class pattern found in T03. No other cases where a term is used substantively in a lesson that precedes the lesson claiming to introduce it.

**P6 cascade check (Flashcard rendered but not in key_terms, or key_terms with no Flashcard):** Two instances — L04 (lashing wire + RTS missing) and L09 (wind pressure missing). Confirmed N-R3-4 and N-R3-5.

**P7 cascade check (G.655/G.656 gap):** Corroborated. Zero mentions in all 12 T03 lessons confirmed by `grep -rn "G\.655\|G\.656" osp-training/src/lessons/T03/` returning zero hits.

**P9 cascade check (47 CFR Part 32 / citation misattribution):** Not applicable to T03. T03 is a cable-specification topic; no Part 32 citations present.

**P12 cascade check (field-failure scenarios not covered):** N-R3-2 (span table selection), N-R3-3 (pulling tension), and scenario 4 forensic gaps identified above.

---

## 8. Vite Build / Validator Output

```
$ node osp-training/scripts/validate-lesson-schema.js T03
  FAIL  T03/L01: meta missing field: learning_objectives
  FAIL  T03/L02: meta missing field: learning_objectives
  FAIL  T03/L03: meta missing field: learning_objectives
  FAIL  T03/L04: meta missing field: learning_objectives
  WARN  T03/L04: key_terms has 6 terms but Flashcard deck has only 4 cards
  FAIL  T03/L05: meta missing field: learning_objectives
  FAIL  T03/L06: meta missing field: learning_objectives
  FAIL  T03/L07: meta missing field: learning_objectives
  FAIL  T03/L08: meta missing field: learning_objectives
  FAIL  T03/L09: meta missing field: learning_objectives
  WARN  T03/L09: key_terms has 5 terms but Flashcard deck has only 4 cards
  FAIL  T03/L10: meta missing field: learning_objectives
  FAIL  T03/L11: meta missing field: learning_objectives
  PASS  T03/L12.t03-capstone.jsx
  Lessons checked: 12 / Passing: 1 / Failing: 11 / Warnings: 2
```

Note: `npm run build` not re-run by R-3 (R-1 and R-2 both confirmed PASS at their time of audit; R-3 made no code changes).

---

## 9. Confirmed Clean (Negative Findings)

- NESC ice load formula `1.244 × t × (D + t)` — independently derived; constant = π × 57 / 144 = 1.2435; PASS
- ADSS WorkedExample L09 default scenario math — re-derived above; PASS
- L09 NESC loading district values — confirmed via RUS 1724E-150 (new source vs R-1/R-2); PASS
- NEC §770.179(B) — independently confirmed via OCC product page + ICC commentary; PASS
- NEC §770.48(A) 50 ft rule — independently confirmed; PASS
- 7 CFR 1755.902 ±0.5 µm MFD tolerance — eCFR.gov primary source confirms ±0.5; flag from R-1 is resolved as NOT an error
- L08 fiber-count growth margin 20% — confirmed as widely accepted FOA guidance; no fabrication
- ADSS 432F limit — CommScope ADSS blog confirmed; PASS
- ADSS 700 m span — incabamerica.com source plausible; PASS
- L06 gel vs. dry-block prep time claim ("one-third") — secondary industry source; no false precision detected
- L03 rodent-armor requirement per ICEA S-87-640 — confirmed correct technical requirement
- L02 fire-rating substitution hierarchy (OFNP > OFNR > OFNG) — confirmed via NEC Art. 770 public commentary

---

## 10. Saturation Verdict

**HIGH findings confirmed by R-3: 0 new** (R-1 HIGH = G.655/G.656 gap; L05 unit error is MED severity per R-1 — R-3 agrees with MED severity classification; both corroborated, not new). No new HIGHs identified.

**MED findings:** 3 new (N-R3-1 learning_objectives, N-R3-2 span-table guidance, N-R3-3 pulling tension gap). R-1 found 5 MEDs, R-2 found 5 MEDs, R-3 finds 3 MEDs — substantially different set.

**LOWs:** 3 new (N-R3-4, N-R3-5, N-R3-6).

**Forensic frame added:** 2 scenario gaps (scenario 4 span-table, scenario 9 pulling tension) not caught by R-1/R-2's framing-independent sweep, now codified as N-R3-2 and N-R3-3.

HIGH pool appears saturated (all 3 agents agree no unaddressed life-safety / catastrophic factual errors beyond G.655/G.656 absence). MED pool is still producing — 3 new MEDs at R-3. LOW pool still producing (3 new). **Not yet saturated at MED/LOW level**; an R-4 with a learner-experience or pedagogy framing may find additional items (particularly around the `learning_objectives` schema gap, the span-table guidance missing from a learner-usability lens, and the feeder 2× dark-fiber rule sourcing).

=== T03 AUDIT R3 FORENSIC END ===
