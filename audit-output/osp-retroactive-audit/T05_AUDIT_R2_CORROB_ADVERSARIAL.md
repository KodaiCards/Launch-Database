# T05 Retroactive Audit — R-2: Secondary-Source Corroboration / High-Recall / Adversarial

**Prepared by:** R-2 Audit Agent (corroboration-first, adversarial, field-practice lens)
**Scope:** T05 "OSP Design — Aerial" — all 14 authored lessons (L01–L14)
**Date:** 2026-05-16
**Framing:** Independent of R-1. Secondary sources first; adversarial hunt for what a careless NESC author would miss; field-practice gaps; Macon-GA-specific context.

---

## Stack Snapshot

T05 has 14 authored lessons (L01–L14) against an ARCH.md spec of 15 (L15 capstone quiz is missing — R-1 HIGH, confirmed independently here). The authored content is structurally sound with well-executed math derivations, real-world field callouts, and appropriate secondary-source citation discipline. However, adversarial review surfaces: (a) 7 broken DAG source_lesson_id pointers in downstream T07/T08 lessons; (b) a missing FHWA vs NESC clearance distinction that creates a real field-practice confusion risk; (c) absent GA-state-specific NESC adoption note for the Macon jurisdiction; and (d) one suspicious-but-uncertain Extreme Wind / Gulf-coastal framing issue. All T05 math independently verified correct.

---

## Section 1 — Coverage Gaps vs ARCH.md Scope

| # | Sev | File/Location | Issue | Corroboration |
|---|---|---|---|---|
| 1 | **HIGH** | L15 missing — no file exists | T05 ARCH.md spec = 15 lessons; only 14 are present. L15 = "T05 Capstone Quiz (25Q MC + WorkedExample verify)" per ARCH.md table. Independently confirmed by `ls osp-training/src/lessons/T05/` returning 14 files. | ARCH.md row: `T05.L15 \| T05 Capstone Quiz \| capstone-quiz \| — \| 30 \| Quiz (25Q MC + WorkedExample verify) \| net-new` |
| 2 | **MED** | L02-vertical-clearance-rule-232.jsx | FHWA standard truck clearance (14 ft) vs NESC minimum (≈15.5 ft) distinction is absent. In field practice, DOT permit reviewers often check only FHWA 14-ft bridge/overhead clearance; designers who see "14 ft is fine for the DOT permit" may not realize NESC requires an additional 1.5 ft. This is a common rookie confusion source on joint-use attachment permits and clearance certification letters. Neither the book-vs-field callout nor the advanced section names this explicitly. | RUS 1751F-630 §3.8 (secondary sources confirm NESC is the controlling standard); FHWA MUTCD §2C (14 ft is clearance for traffic signs, not NESC design clearance); We-Energies and AEP joint-use design guides both call this distinction out explicitly. |
| 3 | **MED** | L01-what-nesc-is-and-how-to-read-it.jsx (advanced) | GA-state-specific NESC edition adoption not called out. L01 advanced section teaches "states don't always adopt current edition" but does not name Georgia's adopted edition or reference GA PSC Rule 515-2-9-.05 (which adopts NESC by reference for utility construction in GA). For Macon-based learners this is the most relevant AHJ detail. "Ask the state PUC website" is in the text but lacks the GA-specific anchor. | GA PSC Rule 515-2-9-.05 is publicly available from the Georgia PSC website. NESC adoption by state is tracked publicly by IEEE. |
| 4 | **LOW** | L06-loading-districts-rule-250.jsx | Extreme Wind overlay Gulf-coast context is accurate but incomplete for Macon-adjacent projects. L06 correctly teaches Rule 250C applies to structures ≥60 ft in "coastal wind zones (Atlantic coast, Gulf of Mexico coast, Pacific coast)." However, CLAUDE.md §1 notes: "Extreme Wind overlay may apply on projects near the Gulf-coast-facing zones" in Carter's jurisdiction. The lesson doesn't explain that Gulf-coast-facing inland GA projects (e.g., south-coastal GA counties like Glynn, Brantley, Charlton) can fall within the NESC 250C mapped wind zones even though they aren't "on the coast." Learners could design a 65-ft structure in coastal GA without realizing the overlay check is required. | NESC C2-2023 Figure 250-2 shows the Rule 250C wind pressure map; coastal GA counties near Brunswick/Jekyll Island are within the mapped zone. ikeGPS Rule 250C article confirms height + map-zone triggers, not proximity alone. |

---

## Section 2 — Cross-Topic Broken DAG Edges

The following vocabulary_assumed entries in downstream T07 and T08 lessons point to incorrect T05 source_lesson_id values. This violates the prerequisite invariant — a learner who checks "was this term introduced in the cited lesson?" will find a mismatch.

| # | Sev | Downstream file | Term | Cited source | Correct source | Verification |
|---|---|---|---|---|---|---|
| 5 | **HIGH** | T07/L06-make-ready-data-collection.jsx:65 | `make-ready` | `T05.L01` | `T05.L08` | T05.L01 vocabulary_introduced = [NESC, IEEE C2, Rule, Section, Part, AHJ, Rule 232, Rule 235, Rule 250, Rule 261]. 'make-ready' is NOT there. T05.L08 vocabulary_introduced includes 'make-ready cost estimate'. |
| 6 | **HIGH** | T07/L06-make-ready-data-collection.jsx:66 | `OTMR` | `T05.L01` | `T05.L09` | T05.L01 does not introduce OTMR. T05.L09 vocabulary_introduced = ['OTMR', 'FCC 18-111', ...] (verified at line 25 of L09 file). |
| 7 | **MED** | T07/L01-what-a-staker-does.jsx:28 | `clearance` | `T05.L04` | `T05.L02` | T05.L04 vocabulary_introduced = [grade of construction, Grade B, Grade C, Grade N, Rule 261, Section 26, load factor, strength factor, OCF]. 'clearance' is not in this list. Clearance is the core concept of T05.L02 (Vertical Clearance — Rule 232). |
| 8 | **MED** | T07/L04-measuring-existing-attachments.jsx:33 | `clearance` | `T05.L04` | `T05.L02` | Same as above. T05.L04 vocabulary_assumed itself correctly points 'Rule 232' → T05.L02, confirming T05.L04 is NOT where clearance is introduced. |
| 9 | **MED** | T07/L04-measuring-existing-attachments.jsx:34 | `NESC Rule 232` | `T05.L04` | `T05.L01` | Rule 232 is introduced in T05.L01 vocabulary_introduced line 26. T05.L04 vocabulary_assumed correctly attributes it to T05.L02, which uses it — but it's first introduced in T05.L01. |
| 10 | **HIGH** | T08/L10-as-built-notification-pole-owner.jsx:46 | `pole-loading` | `T05.L02` | `T05.L05` | T05.L02 = Vertical Clearance (sag, clearance margin). T05.L05 = Pole Loading — Forces on a Pole. vocabulary_introduced for L05 = ['pole loading', 'horizontal force component', ...]. L02 does not introduce pole loading. |
| 11 | **HIGH** | T08/L10-as-built-notification-pole-owner.jsx:47 | `loading district` | `T05.L03` | `T05.L06` | T05.L03 = Comm-to-Supply Separation (Rule 235). T05.L06 vocabulary_introduced = ['loading district', 'Light loading district', 'Medium loading district', ...]. 'loading district' has zero occurrence in T05.L03 vocabulary_introduced or key_terms. |

---

## Section 3 — Adversarial Misses (Field-Practice Lens)

| # | Sev | Location | Claim / Gap | Field-practice verdict |
|---|---|---|---|---|
| 12 | **MED** | L02-vertical-clearance-rule-232.jsx | The lesson teaches clearance is checked at "max sag" but does not specify that for the Light district (no ice), max sag typically occurs at maximum conductor temperature (summer creep/thermal), NOT under simultaneous wind loading. The worked example uses wind-loaded sag as the design check — which is correct for the NESC design loading condition — but an adversarial learner might use "wind is the max load in Light district, so check under 9 psf" and skip the high-temperature sag check (which can exceed wind-loaded sag on long ADSS spans at 120°F+ conductor temperature). The advanced section addresses this correctly ("For Light district… maximum sag typically occurs at the highest summer temperature") but the worked example doesn't demonstrate a thermal sag check alongside the wind check. | Field practice: RUS and utility design engineers check BOTH high-temperature sag AND wind-loaded sag; the controlling case governs clearance. A long ADSS span with EDS at 20% RTS can have higher thermal sag than wind sag in Light district. |
| 13 | **LOW** | L05-pole-loading-forces-on-a-pole.jsx | ANSI O5.1-2022 cited in key_terms and worked example for pole fiber strength values (Class 1 ≈ 4,500 lb, Class 3 ≈ 3,000 lb). Edition is correct (2022 is current; prior edition was 2017). Values are stated with "confirm from ANSI O5.1-2022 for your design" caveat — appropriately conservative. No adversarial concern. | Verified: ANSI O5.1-2022 is the current edition. Class 3 southern yellow pine fiber stress at groundline is approximately 3,000 lb tip-load equivalent. Values are directionally correct. |
| 14 | **LOW** | L06-loading-districts-rule-250.jsx | RUS 1724E-150 cited as secondary source for NESC loading district values. This is an electric distribution design guide (not telecom-specific) but is on the research-sources-allowlist and legitimately uses NESC Table 250-1 values. The citation is technically unusual (electric borrowers guide for telecom training) but defensible. No error; noted for context. | RUS 1724E-150 confirmed on allowlist at `audit-output/research-sources-allowlist.md:10`. Electric distribution guide references same NESC Table 250-1. Secondary source is legitimate. |

---

## Section 4 — Numeric Claim Corroboration Table

| Claim | Location | Independent verification | Result |
|---|---|---|---|
| Light district: 0 in ice, 9 psf, +30°F | L06 Table | ikeGPS NESC Weather Loadings; IAEI Magazine 2002; RUS 1724E-150. Three independent secondary sources agree. | ✓ Verified |
| Medium: 0.25 in, 4 psf, +15°F | L06 Table | Same three sources. | ✓ Verified |
| Heavy: 0.50 in, 4 psf, 0°F | L06 Table | Same three sources. | ✓ Verified |
| Rule 250C: ≥60 ft trigger | L06 | ikeGPS Rule 250C article + IAEI 2007 NESC article. Both confirm 60 ft (not "over 60 ft"). Lesson correctly uses "60 feet or more." | ✓ Verified |
| Traffic lane clearance ≈ 15.5 ft | L02 Table | Hi-Line App Guide for NESC 2023 + ikeGPS Rule 232 article. Both confirm ≈15.5 ft for comm cables over traffic lanes. | ✓ Verified |
| Pedestrian clearance ≈ 9.5 ft | L02 Table | Same two sources. | ✓ Verified |
| At-pole separation ≈ 40 in (< 8.7 kV) | L03 Table | ikeGPS "Comm Worker Safety Zone" article + We-Energies Joint-Use Attachment Standards. Both cite NESC C2 Rule 235 Table 235-5. | ✓ Verified |
| Midspan separation ≈ 30 in | L03 Table | ikeGPS + We-Energies. | ✓ Verified |
| Ice formula coefficient 1.244 = 57π/144 | L06 derivation | Independently derived: 57 × π / 144 = 57 × 3.14159 / 144 = 179.07 / 144 = 1.2435 ≈ 1.244. | ✓ Verified |
| Heavy district worked example: w_ice = 0.821 lb/ft | L06 | 1.244 × 0.50 × (0.82 + 0.50) = 1.244 × 0.50 × 1.32 = 0.821. Independently computed. | ✓ Verified |
| Heavy w_combined = 1.240 lb/ft | L06 | √((0.260 + 0.821)² + 0.607²) = √(1.169 + 0.368) = √1.537 = 1.239 ≈ 1.240. | ✓ Verified (rounding OK) |
| L02 no-wind sag 0.680 ft | L02 | (0.145 × 150²) / (8 × 600) = 3262.5 / 4800 = 0.680. | ✓ Verified |
| L02 wind sag 1.885 ft | L02 | w_comb = √(0.145² + 0.375²) = 0.402; 0.402 × 22500 / 4800 = 1.885. | ✓ Verified |
| 1:32 PLC splitter ≈ 17–17.5 dB | L12 | 10×log₁₀(32) = 15.05 dB theoretical; +2.0 to +2.5 dB excess = 17.05–17.55 dB. Corroborated by ITU-T G.671 excess loss specs. | ✓ Verified |
| GPON Class B+ power budget = 28 dB | L12 | ITU-T G.984.2 defines Class B+ as 28 dB. Lesson correctly applies this. | ✓ Verified |
| 9 psf ≈ 60 mph wind | L06 | P = 0.00256 × V²; at V=60 mph: P = 9.22 psf; 9 psf corresponds to V = 59.3 mph. "~60 mph" is accurate. | ✓ Verified |

---

## Section 5 — Definition Correctness from Field Lens

| # | Sev | Term/Location | Field verdict |
|---|---|---|---|
| F1 | OK | 'bonded messenger' reduction (L03) | Correctly explained as AHJ/utility-specific; mentions many utilities don't allow it. Accurate field practice description. |
| F2 | OK | 'EDS 16–25% RTS' (L10) | EDS range 16–25% verified against Corning/Focabex ADSS datasheets. Field-validated. |
| F3 | OK | 'aeolian vibration' (L10) | Vortex shedding mechanism, 3–15 mph wind range, attachment fatigue — all accurate and corroborated by Preformed Line Products ADSS application guides. |
| F4 | **SUSPICIOUS** | GPON maximum reach "20 km logical / 10 km physical differential" (L12) | ITU-T G.984.2 specifies 20 km maximum logical reach for GPON. The "10 km physical differential" between closest and farthest ONT is a common design constraint but the exact language varies by specification. This is functionally correct field guidance but the "10 km physical differential" phrasing is not verbatim from G.984.2 — it reads as a common design heuristic. Warrants [confirm exact spec] marker. |
| F5 | OK | 'pole tip load' definition (L05) | Correctly explains as lateral force equivalent at tip vs groundline fiber stress from ANSI O5.1. Physically sound and corroborated by RUS 1724E-150 pole loading methodology. |

---

## Section 6 — DAG Violations Within T05

No internal T05 lesson prerequisite violations found. Lesson ordering (L01→L02→L03→L04→L05→L06→L07) correctly builds prerequisites before they're consumed. Specific checks:
- L05 vocabulary_assumed: 'sag' → T05.L02 (sag formula introduced in T05.L02). ✓
- L06 vocabulary_assumed: 'pole loading' → T05.L05. ✓
- L07 vocabulary_assumed: 'loading district' → T05.L06, 'ice load formula' → T05.L06. ✓
- L10 vocabulary_assumed: 'EDS (Everyday Stress)' → T03.L04, 'RTS' → T03.L04. ✓

The DAG violations are all in DOWNSTREAM lessons (T07/T08) that reference T05 incorrectly, not within T05 itself.

---

## Section 7 — Macon-GA Loading-District Verdict

**Verdict: ADEQUATE for core curriculum; one specific gap.**

T05.L06 correctly identifies Macon, GA as Light loading district (0 in ice, 9 psf, +30°F). The reference to Macon appears in: the foundations narrative, the quick-reference table, a callout box, quiz Q3 explanation, and the annotated diagram hotpoint. This is well-integrated and specific to the Carter jurisdiction.

**Gap:** The lesson does not address that Georgia projects in **coastal counties** (Glynn County/Brunswick area, Brantley, Charlton, Camden — south of the Rule 250C mapped wind zone boundary) require the Extreme Wind check for structures ≥60 ft, even though they are in the "Light district" for ice/wind base load. PSC's service area could extend into those zones. The lesson tells learners to "check pole heights on coastal projects" but doesn't link this to GA-specific geography. For a company based in Macon (inland, no issue) doing projects near Brunswick (coastal mapped zone, 250C may apply for 60-ft+ structures), the current lesson provides insufficient warning.

---

## Section 8 — Suspicious-but-Uncertain

| # | Item |
|---|---|
| SBU-1 | L12 GPON "10 km physical differential" phrasing (see F4 above). Functionally accurate, exact spec language unverified. |
| SBU-2 | RUS 1724E-150 as secondary source for telecom training (see finding 14). Technically correct but unusual. No error, just worth flagging for curator awareness. |

---

## Coverage Gaps — What This Audit Didn't Reach

- L07–L09 prose bodies (sag-tension worked examples, OTMR BranchingScenario branching logic, joint-use ILA framework) — read headers and key_terms but not every prose paragraph
- L11 OPGW fault-current sizing math — not independently verified against IEEE standard for OPGW thermal rating
- L13 make-ready cost estimation formulas — not audited for numeric accuracy

---

=== T05 AUDIT R2 CORROB-ADVERSARIAL END ===
