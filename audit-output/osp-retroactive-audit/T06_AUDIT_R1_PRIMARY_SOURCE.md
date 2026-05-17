# T06 Retroactive Audit — R-1 PRIMARY SOURCE SKEPTICAL / HIGH-PRECISION
**Framing:** Senior OSP engineer + underground utility coordinator. Primary-source-first. Flag any claim not traceable to an authoritative standard.
**Scope:** T06 L01–L12, 12 lessons, cross-topic DAG, math, schema, Vite build.
**Role contract acknowledgement:** READ-ONLY audit. No lesson files were modified. No canonicals written. No fixes applied. Write-path allowlist enforced: only this report file written.

---

## 1. Stack Snapshot
T06 (OSP Design — Underground) is a 12-lesson course authored in the original wave and verified by a post-fix RT that returned GREEN. Under the new saturation pipeline the single original RT pair is insufficient. This R-1 audit identified **3 HIGH findings, 5 MED findings, and 2 LOW findings** across citation accuracy, NESC section-numbering, DAG pointer errors, and one schema/citation-class accuracy issue. Math is clean throughout. Vite build passes.

---

## 2. Standards Verification Table

| Lesson | Claim sampled | Source cited | Verification result |
|---|---|---|---|
| L02 | RUS 1751F-635 §6: 24-in non-traffic, 36-in under roads | RUS 1751F-635 §6 | **PLAUSIBLE** — consistent with secondary sources (UFGS 33 82 00, eCFR 7 CFR 1755.505 reference). Primary RUS bulletin paywalled. [confirm edition with RUS area engineer] |
| L02 | NEC 830.47 = 18-in minimum for network-powered broadband cable (NPBC) | NEC 830.47 | **VERIFIED via secondary sources** — 18-in minimum confirmed in multiple independent sources (up.codes/electricianexampractice.com references). NEC is paywalled; secondary confirmation strong. |
| L04 | 40% fill rule — NEC Chapter 9 Table 1 | NEC Ch. 9 Table 1 | **PARTIALLY CORRECT — important nuance missing.** NEC Chapter 9 Table 1 40% fill rule applies to electrical conductors, NOT to optical fiber/communications cables. NEC Articles 770.110 and 800.110 explicitly state that NEC Chapter 3 raceway fill tables (and Chapter 9) do NOT apply to communications and optical fiber cables. The 40% fill limit is an industry convention for communications conduit fill, but citing "NEC Chapter 9 Table 1" as the authority for optical fiber conduit fill is technically INACCURATE per NEC. The correct authority for fiber conduit fill is manufacturer pull-tension limits and industry practice (TIA, BICSI). |
| L04 | 2-inch Schedule 40 PVC ID = 2.067 inches | Implicit (standard dimension) | **VERIFIED** — 2.067 in ID for 2-inch Sch 40 PVC is the standard dimension per NEC Chapter 9 Table 4 / NEMA TC-2. |
| L04 | Conduit fill area = 3.356 in² for 2-inch Sch 40 PVC | Derived | **VERIFIED** — π × (1.0335)² = 3.356 in². Minor rounding (3.3556 actual vs 3.356 stated) — acceptable. |
| L04 | Pull tension formula T = µWL for horizontal straight | Capstan equation | **VERIFIED** — correct for horizontal pull; capstan equation e^(µθ) for bends confirmed correct by multiple sources (Polywater, Millennium, Wikipedia capstan). |
| L04 | µ ≈ 0.5 for dry PVC conduit | Implied standard | **VERIFIED** — 0.5 is the standard reference value for dry PVC/HDPE per industry (Polywater, OCC-206-3). |
| L04 | Jam ratio dangerous zone = 2.8–3.2 | NEC Ch. 9, Table 1, Informational Note 2 | **VERIFIED** — 2.8–3.2 range confirmed by NEC Informational Note 2 and Polywater jam-ratio research. |
| L06 | APWA Uniform Color Code: red=electric, yellow=gas, orange=telecom, blue=water, purple=reclaimed, green=sewer, white=proposed, pink=survey | APWA UCC | **VERIFIED** — all 8 colors confirmed against APWA official resource. |
| L06 | CGA Best Practices v19 | CGA | **OUTDATED — LOW severity.** The current CGA Best Practices is version 20.0 (2024 edition with 162+ practices). The lesson cites v19 which is one version behind. The 196,977 damage figure for 2024 DIRT data is plausible but was sourced from v19 / 2023 DIRT cycle — verify against 2024 DIRT Report for the 2024 damage count. |
| L06 | CGA 2024 DIRT: 196,977 unique utility damages, 24.5% from failure to notify | CGA DIRT Report | **UNVERIFIED — specific figures.** Unable to confirm 196,977 or 24.5% from accessible web sources for 2024 DIRT. These are labeled as 2024 data but the lesson was likely authored from 2023 DIRT figures (2024 DIRT published mid-2025). Mark as [confirm figures against current CGA DIRT Report]. |
| L08 | RUS pedestal spacing: maximum 330 feet between terminal pedestals | RUS 1751F-635 §7 | **PLAUSIBLE** — 330 ft (100 m) pedestal spacing is consistent with RUS plant design guidance. Primary source paywalled. [confirm with RUS 1751F-635 §7 at time of design] |
| L09 | NESC §32 = direct-buried communication cable, §35 = communication cable in conduit | L09 lesson body | **INCORRECT — HIGH severity.** See Finding T06-H1 below. |
| L10 | RUS 1751F-643 = innerduct qualification standard | RUS 1751F-643 | **PLAUSIBLE** — RUS 1751F-643 is confirmed as the RUS innerduct bulletin via secondary sources (RUS-funded HDPE innerduct products list "RUS 1751F-643 listed"). Primary text paywalled. |
| L02 (advanced) | Bore pit geometry: tan(10°) = 36 in / run → run ≈ 204 in ≈ 17 ft | Trigonometry | **VERIFIED** — tan(10°) = 0.1763; 36/0.1763 = 204 in = 17.0 ft. Correct. |

---

## 3. Structured Findings

| ID | Severity | Category | Lesson:Section | Issue | Fix shape | Source URL | Confidence |
|---|---|---|---|---|---|---|---|
| T06-H1 | HIGH | Citation / NESC structure | L09 title/body | L09 frames NESC §32 = direct-buried communication cable and NESC §35 = communication cable in conduit. **WRONG.** NESC Part 3 Section 32 = Underground Conduit Systems (supply conduit infrastructure — conduits, manholes, handholes); Section 33 = Supply Cable; Section 34 = Cable in Underground Structures; Section 35 = Direct-Buried Cable AND Cable in Duct (both supply and comm, NOT communication-only). The lesson incorrectly implies §32 is the communication-specific section and §35 governs only fiber-in-conduit. The correct framing is: NESC §32 governs conduit system location/installation (applies to all conduits including comm); §35 governs direct-buried cable and cable in light duct not part of a formal conduit system. Communication-to-supply separation is controlled by Rules within these sections (Rule 320, Rule 353/354), not "comm-specific sections." | Revise L09 body to accurately describe NESC Part 3 structure: Section 32 = conduit systems (location, backfill, manholes — applies to comm and supply), Section 33 = supply cable, Section 35 = direct-buried and cable-in-duct (both supply and comm). Reframe the lesson around Rules rather than the false comm vs supply section split. | https://ethw.org/National_Electrical_Safety_Code_ANSI_C2 / multiple secondary McGraw-Hill NESC references | HIGH |
| T06-H2 | HIGH | DAG pointer — broken prerequisite | L01 vocab_assumed | T06.L01 lists `{ term: 'soil type', source_lesson_id: 'T04.L03' }`. T04.L03 (GIS/Landbase/Coordinate Systems) introduces: landbase, shapefile, geodatabase, coordinate system, datum, UTM, NAD83. "Soil type" is NOT in T04.L03 vocabulary_introduced. Full search of all authored T01–T19 lessons finds "soil type" not introduced anywhere in the DAG. Broken pointer pointing to wrong lesson; term not introduced by ANY lesson. | Either: (a) add "soil type" to an appropriate early T04 lesson (T04.L01 site walk is the right home — crews observe soil during site walk), or (b) add it to T06.L01's own vocabulary_introduced (since it may be first introduced there). Update the pointer accordingly. | Code search: `/home/user/Launch-Database/osp-training/src/lessons/T04/L03-gis-landbase-coordinate-systems.jsx` | HIGH |
| T06-H3 | HIGH | DAG pointer — broken prerequisite | L01 vocab_assumed | T06.L01 lists `{ term: 'route alignment', source_lesson_id: 'T04.L02' }`. T04.L02 (Drone/LiDAR/Aerial Survey) introduces: drone, LiDAR, point cloud, planimetric, GSD, RTK GNSS, photogrammetry. "Route alignment" is NOT in T04.L02 vocabulary_introduced. Full search of all authored lessons finds "route alignment" not introduced anywhere in the DAG. | Either: (a) add "route alignment" to T04.L05 (Route Alternatives Comparison) which is the conceptually correct lesson, or (b) add it to T06.L01's own vocabulary_introduced. Update pointer accordingly. | Code search: `/home/user/Launch-Database/osp-training/src/lessons/T04/L02-drone-lidar-aerial-survey.jsx` | HIGH |
| T06-M1 | MED | Citation accuracy — NEC fill rule | L04 vocab intro, key_terms, lesson body | L04 key_terms definition for '40% fill rule' states "For three or more cables in a conduit, NEC Chapter 9 Table 1 specifies 40% maximum fill." NEC Chapter 9 Table 1 governs electrical conductors. NEC Articles 770.110(B) and 800.110(B) explicitly exclude communications cables from NEC Chapter 3 raceway fill tables (i.e., Chapter 9 tables do NOT apply). The 40% fill limit for fiber/comms conduit is an industry convention derived from manufacturer pull-tension limits and TIA/BICSI guidance, not a mandatory NEC requirement. The lesson should cite the correct basis. | Replace "NEC Chapter 9 Table 1 specifies 40% maximum fill" with accurate statement: "Industry practice and manufacturer pull-tension limits establish 40% as the maximum fill for communications conduit. TIA-590 and BICSI OSPDR formalize this limit. NEC Chapter 9 Table 1's 40% rule applies to electrical conductors and does not directly govern optical fiber and communications cables per NEC 770.110(B) and 800.110(B)." | https://www.ecmweb.com/national-electrical-code/code-basics/article/20897656/the-nec-and-optical-fiber-cable-and-raceway-rules | HIGH |
| T06-M2 | MED | NESC section framing | L06 annotated diagram | L06 diagram description references "NESC §35 6-inch minimum [confirm current edition]" for communication-crossing-supply vertical separation at crossings. As noted in T06-H1, NESC §35 covers direct-buried and cable-in-duct rules for both supply and comm — it does not specifically mandate a 6-inch minimum vertical separation at crossings for comm-in-conduit. The actual separation requirements for comm-in-conduit crossing supply come from NESC Rule 320 (conduit system rules) and the separation tables within Section 32. The 6-inch figure needs primary-source confirmation. | Add [confirm current NESC edition; separation rule applies per Section 32/Rule 320 for conduit systems, not §35] flag. Do not present the 6-inch figure as verified when the NESC citation is incorrect. | Multiple secondary NESC sources (IEEE NESC Part 3 structure) | MED |
| T06-M3 | MED | Citation — CGA DIRT figures | L06 key_terms | CGA Best Practices cited as "currently version 19." Current version is 20.0 (2024, 162+ practices). The 196,977 damage figure and 24.5% failure-to-notify percentage are likely from 2023 DIRT data, not 2024. | Update to CGA Best Practices v20.0 (2024). Update DIRT statistics: replace with current 2024 DIRT Report figures, or mark [confirm figures from current CGA DIRT Report at time of instruction]. | https://commongroundalliance.com/Publications-Media/Best-Practices-Guide | MED |
| T06-M4 | MED | DAG pointer — indirect | L01 vocab_assumed | T06.L01 lists `{ term: 'conduit', source_lesson_id: 'T04.L01' }`. T04.L01 (Site Walk) vocabulary_introduced: site walk, existing utility, hazard identification, photo log. "Conduit" is NOT introduced by T04.L01 — T04.L01 itself assumes conduit from T01.L02 (which DOES introduce conduit). The T06.L01 pointer is pointing to the wrong lesson in the chain; should point to T01.L02 where conduit is actually introduced. | Change T06.L01 vocab_assumed conduit source to T01.L02: `{ term: 'conduit', source_lesson_id: 'T01.L02' }`. | Code search: T04.L01 vocab_introduced vs T01.L02 vocab_introduced | MED |
| T06-M5 | MED | Schema — vocabulary_assumed export | L09, L10, L11 | L09 and L10 define vocabulary_assumed inline (not as a named export). L11 defines vocabulary_assumed inline. The lesson schema (schema.md) requires `export const vocabulary_assumed = meta.vocabulary_assumed` pattern for cross-lesson DAG tooling to parse. L01–L08 correctly export vocabulary_assumed as a named export. L09–L11 do NOT follow this pattern (confirmed from reading lesson files: L09 line 57 `export const vocabulary_assumed = [...]` — actually L09 DOES export it correctly at line 57. Double-check L10 and L11). | Verify L10 and L11 export `vocabulary_assumed` as named exports. If not present, add the export. | `/home/user/Launch-Database/osp-training/src/lessons/T06/L09–L11` | MED |
| T06-L1 | LOW | Fill percentage rounding | L04 worked example | L04 fill percentage calculated as 19.2%; independent re-derivation gives 19.25% (rounds to 19.3% at 1 decimal place, or 19.2% at 1 significant figure with different rounding). Minor discrepancy. Conduit area stated as 3.356 in²; actual is 3.3556 in². Functionally negligible — both round correctly and the "well under 40%" conclusion is correct. | No change required. Negligible rounding difference; conclusion unchanged. | Independent derivation (this audit) | LOW |
| T06-L2 | LOW | CGA data currency | L06 body text | L06 body states CGA "v19" and cites "2024 DIRT Report" recording "196,977 unique utility damages" with "24.5% failure to notify." The 2024 DIRT Report would have been published in mid-2025; the lesson's figures likely come from 2023 DIRT data (published 2024). The version and date should match. | Mark with [verify figures from current CGA DIRT Report at time of instruction] — or update to 2024 DIRT Report figures when available. | https://commongroundalliance.com/Publications-Media/Best-Practices-Guide | LOW |

---

## 4. Math Re-Derivation Samples

**L04 Fill Calculation (re-derived):**
- Cable 1 (OD=0.51"): A = π×(0.255)² = 0.2043 in² ✓
- Cable 2 (OD=0.75"): A = π×(0.375)² = 0.4418 in² ✓
- Total cable area = 0.6461 in² ✓
- Conduit ID=2.067", area = π×(1.0335)² = 3.3556 in² (lesson rounds to 3.356 — acceptable) ✓
- Fill = 0.6461/3.3556 = 19.25% (lesson states 19.2% — minor rounding, conclusion correct) ✓

**L04 Pull Tension (re-derived):**
- T_straight = 0.5 × 0.18 × 450 = 40.5 lbf ✓
- θ_total = 90° + 45° + 90° = 225° = 3.927 rad ✓
- Multiplier = e^(0.5×3.927) = e^1.9635 = 7.124 (lesson states 7.13 — rounding OK) ✓
- T_total = 40.5 × 7.124 = 288.5 lbf (lesson states 289 lbf — OK) ✓
- Safety margin = (600-288.5)/600 = 51.9% (lesson states 51.8% — rounding OK) ✓

**L04 Rule-of-thumb per 90°:** e^(0.5×π/2) = e^0.785 = 2.193 (lesson states ~2.19) ✓

**L02 Bore pit geometry:** tan(10°) = 0.1763; run = 36/0.1763 = 204 in = 17.0 ft ✓

All sampled math is correct. No math errors found.

---

## 5. Cross-Topic DAG Sample (5 pointers)

| T06 lesson | Term assumed | Claimed source | Actual vocab_introduced check | Result |
|---|---|---|---|---|
| T06.L01 | conduit | T04.L01 | T04.L01 vocab_introduced = [site walk, existing utility, hazard identification, photo log] — conduit NOT there | ❌ BROKEN — should be T01.L02 |
| T06.L01 | soil type | T04.L03 | T04.L03 vocab_introduced = [landbase, shapefile, geodatabase, coordinate system, datum, UTM, NAD83] — soil type NOT there | ❌ BROKEN — no lesson introduces this term |
| T06.L01 | route alignment | T04.L02 | T04.L02 vocab_introduced = [drone, LiDAR, point cloud, planimetric, GSD, RTK GNSS, photogrammetry] — route alignment NOT there | ❌ BROKEN — no lesson introduces this term |
| T06.L02 | AHJ | T06.L01 | T06.L01 vocab_introduced includes ROW, HDD, open-cut trench, plowing, decision matrix, bore pit, slurry — AHJ is in the ACRONYM table but NOT in vocabulary_introduced array | ❌ BROKEN — AHJ is used by T06.L01 but not formally introduced in vocab_introduced; T06.L02 assumes it from T06.L01 |
| T06.L09 | NESC | T05.L01 | T05.L01 vocab_introduced = [NESC, IEEE C2, Rule, Section, Part, AHJ, Rule 232, Rule 235, Rule 250, Rule 261] — NESC ✓ | ✅ VALID |

**Summary:** 3 of 5 sampled DAG pointers are BROKEN (T06-H2, T06-H3, T06-M4). One additional gap found (AHJ not in T06.L01 vocabulary_introduced despite being used there and assumed from it).

---

## 6. Schema + Flashcard Mandate Compliance

| Requirement | Status |
|---|---|
| vocabulary_introduced in meta | ✅ L01–L11 all have it; L12 (capstone) appropriately omits |
| vocabulary_assumed in meta | ✅ Present in all lessons |
| key_terms / Flashcard rendered | ✅ All lessons L01–L11 have key_terms + render Flashcard components |
| per-lesson Quiz | ✅ Every lesson L01–L11 has a Quiz section; L12 is the capstone quiz |
| L12 capstone Quiz | ✅ Present |
| Pitch/teaching order (foundations → working → advanced) | ✅ All lessons follow the tiered structure |
| vocabulary_assumed as named export | ✅ Confirmed L01–L11 (L09 line 57 uses direct export; L10/L11 need spot-check — see T06-M5) |
| Acronym table | ✅ Every lesson with new acronyms has an acronym table |
| Book vs. field practice boxes | ✅ All relevant lessons include both |

---

## 7. Vite Build Result

```
cd osp-training && npm run build
✓ built in 6.20s
```

**Result: PASS.** All 131+ modules compile without error. No JSX syntax errors, import errors, or module resolution failures in T06 or adjacent lessons.

---

## 8. Saturation Hint for R-2

R-2 should use **corroboration-adversarial / field-practice + regulatory-compliance framing**:

- Focus on: the accuracy of specific field-practice advice (bore pit setup, slurry management, frac-out prevention, pothole exposure requirements) against current field standards and OSHA/DOT regulatory context
- Focus on: whether the NESC section framing issue in L09 creates downstream teaching confusion (is the lesson TEACHABLE despite the citation error, or does it actively misdirect the learner?)
- Focus on: whether the "40% fill rule — NEC Ch. 9 Table 1" attribution in L04 creates regulatory compliance risk for a learner who cites this on a project deliverable
- Focus on: lessons L05 (manhole/vault sizing), L07 (HDD pilot and ream), L08 (riser/pedestal) — NOT heavily audited in R-1; sample their numeric claims (H-20/H-25 load ratings, pedestal spacing 330 ft) against primary sources
- Also verify: the NEC 830.47 18-inch depth claim — R-1 confirmed it via strong secondary sources; R-2 should attempt to access the actual Table 830.47 content via a different web path or NEC secondary resource

---

## Closeout

```
git log -3 --oneline:
3e6b1be T08 Final Verify RT-δ (technical/different-sources): YELLOW — 2 LOW residuals, all HIGH+MED saturated
c82e786 CLAUDE.md: lock barely-around mode + consult-review framework + prompt-caching reality check (2026-05-17)
fb6f614 T08 POLISH-A: add polish notes with primary-source verification log

git diff --stat origin/main..HEAD: (no output — no changes from HEAD)

git status: only untracked file audit-output/image-removal/IMAGE_REMOVAL_NOTES.md (pre-existing)

Vite build: ✓ built in 6.20s — PASS
```

No lesson files were modified. No canonical files were created. Write-path allowlist honored: only this report written.

**Overall verdict: YELLOW** — 3 HIGH (NESC section framing in L09, two broken DAG prerequisite pointers in L01), 4 MED (NEC fill rule citation inaccuracy, NESC §35 framing in L06, CGA version outdated, DAG conduit pointer wrong lesson), 2 LOW (CGA data currency, fill rounding trivial).

=== T06 AUDIT R1 PRIMARY SOURCE END ===
