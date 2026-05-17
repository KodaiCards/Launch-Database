# T03 Audit R-5 — Standards-Citation Precision / Paywalled-Source-Skeptical

> Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T03_AUDIT_R5_STANDARDS_PRECISION.md` written.

---

## 1. Registry Consultations

Checked `audit-output/citation-registry.md` before any primary-source lookup:

- ITU-T G.652/G.655/G.657 → registry entries present (2026-05-17, T02 retroactive audit). Used directly.
- TIA-526 → registry entry present: `[confirm edition]` status (P3 polish item). Consistent with T03 usage.
- NEC Article 770, §770.110 → registry entries present (2026-05-16, T06 audit). Used directly.
- ICEA S-87-640 → NOT in registry. T03 is first subject to audit this citation. New entries added in §8 below.
- GR-20-CORE / GR-409-CORE → NOT in registry. Not cited anywhere in T03 (confirmed below).
- ICEA S-104-696 → NOT in registry. Not cited anywhere in T03 (confirmed below).
- TIA-492AAAA-E → registry entries present (T02 audit). Not cited in T03.
- TIA-598 → NOT in registry. Cited in T03 as TIA-598-D. New entry added.
- 7 CFR 1755.902 → NOT in registry. Cited extensively in T03.L10/L11. New entry added.
- RUS 1753F-201 → NOT in registry. New entry added.

---

## 2. Standards-Citation Precision Table

| Citation | Appears In | T03 Claim | Precision Verdict | Notes |
|---|---|---|---|---|
| ITU-T G.652.D | L05, L08, multiple | "Standard SMF, 8.8–9.6 µm MFD @ 1310 nm" | **PASS** | Registry confirmed. No edition year required (ITU-T G.652 is backward-compatible across revisions for this spec range). |
| ITU-T G.657.A1 | L05, L08, L09, L12 | "Minimum bend radius 10 mm" | **PASS** | Registry confirmed G.657 2024 edition. Lesson cites `[verify 2024 edition consolidation]` appropriately. |
| ITU-T G.657.A2 | L05, L08, L09, L12 | "Minimum bend radius 7.5 mm; B2 absorbed into A2 in 2024" | **PASS** | Registry confirmed. [verify] marker present. |
| ITU-T G.657.B3 | L05, L08 | "5 mm minimum; NOT guaranteed splice-compatible with G.652.D" | **PASS** | Registry confirmed. |
| ITU-T G.655 | All T03 | **ABSENT** | **HIGH GAP** | Already in R-1/R-2/R-3 canonical as HIGH-1. Confirmed by registry. |
| ITU-T G.656 | All T03 | **ABSENT** | **HIGH GAP** | Same as G.655. Already in canonical. |
| ICEA S-87-640 | L01, L03, L06, L07, L10, L11, L12 | "OSP fiber cable standard — construction, armor, tensile ratings" | **PASS (scope); WARN (edition)** | Full title is "Optical Fiber Outside Plant Communications Cable." Correct scope taught. **No edition year cited anywhere in T03.** L03 line 237 acknowledges "2016/2023 editions (paywalled)" and uses 2006 archive.org edition for armor thickness. L10 line 276 says "confirm the edition year." Tensile ratings (2,670 N / 1,330 N) carry `[confirm current edition]` marker on the 1,330 N figure. **Concern:** 2,670 N standard tier cited WITHOUT `[confirm edition]` marker in L10 body (line 188-189); only the 1,330 N lower tier carries the marker. If the 2023 edition revised tensile tiers, the standard-tier value is unguarded. |
| ICEA S-104-696 | All T03 | **ABSENT** | INFO | S-104-696 is the ICEA standard for duct cable. Not cited in T03. R-1 canonical MED noted S-87-640 vocab gap (intro lesson); S-104-696 absence is a separate gap that may be appropriate (T03 is cable selection, not duct-spec). Not a new finding. |
| Telcordia GR-20-CORE | All T03 | **ABSENT** | **MED GAP** | Already in R-1/R-2/R-3 canonical as LOW-3. GR-20 governs OSP fiber cable reliability/screening. Its absence means RUS-financed project learners don't know what GR-20 is. Confirmed LOW per R-4 reconciliation. |
| Telcordia GR-409-CORE | All T03 | **ABSENT** | INFO | GR-409 covers cabinet/terminal enclosures — T03 is cable selection, not terminal hardware. Absence is appropriate scope. No new finding. |
| NEC Article 770 | L02, L03, L06, L07, L12 | "Optical Fiber Cables and Raceways" | **PASS** | Registry confirmed. Lesson scope (listing types, fire ratings, substitution hierarchy) accurately taught. |
| NEC §770.48(A) | L02, L12 | "50-ft rule for unlisted OSP cable entering buildings" | **WARN — section number imprecision** | See §3 below for full analysis. L02 correctly caveats as paywalled with `[confirm]` marker. L12 capstone cites §770.48(A) without independent confirmation caveat (line 193). **Inconsistency with L12 line 207 which cites §770.154 for substitution hierarchy from the SAME NEC 2023.** |
| NEC §770.154 | L12 capstone | "Substitution hierarchy — OFNP can substitute for OFNR" | **WARN — no [confirm] marker** | In NEC 2023, §770.154 covers "Listing and Labeling of Optical Fiber Cables" — this IS where the substitution hierarchy table lives. Likely correct. But no caveat on the section number in L12, inconsistent with L02's careful caveating. LOW issue. |
| NEC §770.179(B) | L03, L07 | "Lists permitted armor configurations for indoor riser cables" | **WARN — title imprecision** | NEC 2023 §770.179 covers "Type Designations" for optical fiber cable types (OFNP, OFNR, etc.). §770.179(B) specifically governs cable "Marking" requirements, NOT armor configurations per se. The practical effect (CST-armored cables UL-listed to pass UL 1666 riser test can be used in risers) is correct, but the cited section governs MARKING/TYPE-DESIGNATION, not the armor rule itself. The correct section for permitted armor in riser cables is NEC §770.113 (Installation of Optical Fiber Cables and Electrical Conductors) + the UL 1666 test standard. Lesson correctly notes it's paywalled and references product documentation (OCC D-Series) as the practical verification. |
| NEC §770.26 / §770.48 | L02 | "Spread of fire" and "unlisted cable entry" | **PASS (with caveat)** | L02 appropriately uses `[confirm against NEC NFPA 70-2023 §770.48(A)]`. The 50-ft limit is widely cited in NEC commentary and secondary sources. |
| UL 1666 | L02, L07 | "Vertical flame propagation test for OFNR" | **PASS** | This is a standard product test; widely confirmed in manufacturer UL listings. |
| UL 910 / NFPA 262 | L02 | "Steiner tunnel test for OFNP" | **PASS** | Widely confirmed. UL 910 and NFPA 262 are distinct tests with similar scope; T03 correctly cites both. |
| TIA-598-D | L01 | "12-color coding scheme for buffer tubes and ribbon" | **WARN — edition suffix** | T03 cites "TIA-598-D." TIA-598 uses letter suffixes (A, B, C, D) for editions. Current edition as of 2024 is TIA-598-D (published 2014; superseded TIA-598-C). Citation appears current but no edition year anchor. No `[confirm edition]` marker despite it being a paywalled TIA document. LOW issue. |
| 7 CFR 1755.902 | L10, L11, L08 | "MFD 9.2 µm ± 0.5 µm at 1310 nm; coating OD 250 ± 15 µm; 12-color coding" | **PASS (public eCFR verified)** | 7 CFR §1755.902 is publicly accessible on eCFR.gov. T03 correctly cites "via eCFR." Actual section title is "RUS specification for fiber optic aerial and buried plant fiber optic cable." The three specific requirements taught (MFD tolerance, coating OD, color coding) are independently verifiable from public eCFR text. Values consistent with widely-cited secondary sources. |
| RUS 1753F-201 | L10, L12 | "Acceptance Tests and Measurements for Telecommunications Plant" | **PASS** | Title is correct per USDA rd.usda.gov bulletin index. L12 capstone adds "(PC-4)" designation which is the bulletin form number — accurate per RUS index. |
| RUS 1751F-630 | L04, L08 | "Aerial construction methods" | **PASS** | Standard reference for RUS aerial OSP. No section-specific citation precision issues. |

---

## 3. NEC Section Number — Deeper Analysis

**Critical inconsistency identified (new R-5 finding):**

L12 capstone line 193 cites `NEC §770.48(A)` for the 100 ft riser run requiring OFNR. Line 207 then cites `NEC §770.154` for the OFNP-substitutes-for-OFNR hierarchy. **These two section references appear in the SAME answer block and refer to the SAME NEC article but different section numbers** — without making clear they're different sections for different rules.

Additionally:
- L02 consistently uses `§770.48(A)` for the unlisted-cable 50-ft limit AND the OFNR substitution notes.
- L07 uses `§770.179(B)` for the armor/riser listing rule.
- L12 uses `§770.48(A)` AND `§770.154` in adjacent sentences.

**Verdict:** The NEC section numbers in T03 are internally inconsistent across lessons and appear to conflate the unlisted-cable entry rule (§770.48 in NEC 2017) with the cable-type substitution hierarchy (§770.154 in NEC 2020/2023). The individual lesson caveats (L02: "paywalled… confirm") are correctly applied at the lesson level, but the inconsistency across lessons means a reader who cross-references L02 and L12 will encounter conflicting section numbers.

**This is a LOW finding (new to R-5):** the practical content (50-ft rule, OFNR/OFNP hierarchy) is correct. The section numbers need `[confirm edition]` markers on the two un-marked instances (L12:193, L12:207). Not a correctness error in the field guidance.

---

## 4. Edition Currency Sweep

| Standard | T03 Edition Cited | Currency Assessment |
|---|---|---|
| ITU-T G.657 | "2024 edition" with `[verify consolidation]` marker | CURRENT — 2024 edition noted; marker appropriate |
| ICEA S-87-640 | No edition year | UNGUARDED for standard-tier 2,670 N tensile value (lower-tier 1,330 N correctly marked `[confirm edition]`) |
| TIA-598-D | "TIA-598-D" (letter suffix implies current edition) | PLAUSIBLE — TIA-598-D is 2014 edition. No explicit year citation. Should carry `[confirm edition]` as paywalled TIA doc. |
| NEC 2023 | References "NEC NFPA 70-2023" explicitly in L02 | CURRENT — year anchor present in L02 prose. L12 lacks year anchor. |
| 7 CFR 1755.902 | "via eCFR" | CURRENT — eCFR is the current-edition public source. Correct citation approach. |
| RUS 1753F-201 | No date | ACCEPTED — RUS bulletins don't use date-based edition numbering; bulletin number IS the edition identifier |

---

## 5. R-1..R-4 Reconciliation (AGREE/DISAGREE)

| Finding | R-5 Verdict |
|---|---|
| HIGH-1: G.655/G.656 absent | **AGREE** — confirmed absent across all 12 lessons. Registry confirms these are real ITU-T specs with distinct cable applications. |
| MED-1/NF-2: L05 250µm unit error | **AGREE** — 250 µm = 0.25 mm, not 2.5 mm. The fix shape in R-4 (separate fiber-level vs cable-level bend radius calculation) is correct. |
| MED-2: L02 NEC pointer T01.L09→T01.L08 | **AGREE** — DAG pointer targets wrong lesson. |
| MED-3: L03 §770.179(B) before L07 introduction | **AGREE** — prerequisite invariant violated. New R-5 observation: this is compounded by the §770.179(B) scope being imprecisely taught (see §2 above). Fix should clarify both the ordering AND the scope of what §770.179(B) actually governs. |
| MED-6: 11/12 missing learning_objectives | **AGREE** — validator confirms 11 FAIL. |
| NF-1: TIA-598 color code never taught | **AGREE** — absent from all 12 lessons confirmed. The citation "TIA-598-D" appears as a source reference in L01 but the CONTENT (12-color sequence) is never taught. A learner who has completed T03 cannot complete a cable spec. |
| LOW-1: TIA-526 edition | **AGREE** — registry status is `[confirm edition]` for T03 uses. Consistent. |
| LOW-3: GR-20 absent L10 | **AGREE** — confirmed absent from L10 and all T03. |
| LOW-5: L04 missing lashing-wire + RTS Flashcards | **AGREE** — validator WARN confirmed; L04 has 6 key_terms, 4 cards; `lashing wire` and `RTS` have no flashcard. |
| LOW-6: L09 missing wind pressure Flashcard | **AGREE** — validator WARN confirmed; L09 has 5 key_terms, 4 cards; `wind pressure` has no flashcard. |

---

## 6. New Findings (R-5 only)

| # | Sev | Category | File | Lines | Issue | Fix Shape |
|---|---|---|---|---|---|---|
| R5-1 | LOW | Citation precision | L10 | 188-189 | ICEA S-87-640 standard-tier tensile value 2,670 N (600 lbf) cited without `[confirm edition]` marker. Only the lower-tier 1,330 N value is guarded. If the 2023 edition revised this value, the unguarded standard-tier cite propagates an unverified number. | Add `[confirm against ICEA S-87-640 current edition]` to the 2,670 N / 600 lbf statement in both L10 body (line 188) and L11 line 223 (where same value appears unguarded). |
| R5-2 | LOW | Citation inconsistency | L12 | 193, 207 | Capstone cites §770.48(A) and §770.154 in adjacent answer sentences without `[confirm edition]` markers or explanatory text. Inconsistent with L02's careful caveating of §770.48 as paywalled. | Add `[confirm NEC 2023 edition — section numbers restructured between 2017 and 2023]` after both §770.48(A) and §770.154 references in L12. |
| R5-3 | LOW | Title precision | L07 | 129, 300 | §770.179(B) described as "lists the permitted armor configurations for indoor fiber optic cable in building riser shafts." Actual §770.179(B) covers cable TYPE DESIGNATIONS/MARKING, not armor configurations specifically. The armor allowance for UL-1666-listed cables in risers is a UL listing outcome, not a §770.179(B) requirement per se. | Rephrase: "Cables carrying a §770.179(B) OFNR listing have passed the UL 1666 riser flame test regardless of whether they contain metallic armor." Remove the "lists permitted armor configurations" framing which mischaracterizes the section scope. Add paywalled `[confirm NEC 2023 §770.179(B)]` marker. |
| R5-4 | LOW | Edition currency | L01 | 125, 158 | TIA-598-D cited as source for 12-color scheme but no edition year anchor and no `[confirm edition]` marker. TIA-598-D is a paywalled document (TIA 2014). | Add `[confirm TIA-598 current edition]` in the two L01 source attributions citing TIA-598-D. |

---

## 7. Confirmed Clean

- **7 CFR 1755.902 content (MFD 9.2 µm ± 0.5 µm, coating OD 250 ± 15 µm, 12-color coding):** eCFR publicly accessible; values consistent across lesson and external secondary sources. No new issue.
- **RUS 1753F-201 title:** "Acceptance Tests and Measurements for Telecommunications Plant (PC-4)" — correct per USDA RD bulletin index.
- **GR-20 and GR-409:** absent (GR-20 is known gap per canonical; GR-409 absence is appropriate scope for T03).
- **ICEA S-104-696:** absent — appropriate for T03 scope (cable selection, not duct spec).
- **UL 1666 / NFPA 262:** correct test names and correct association to OFNR/OFNP ratings.
- **TIA-598-D 12-color sequence claimed (BL/OR/GR/BR/SL/WH/RD/BK/YL/VT/RS/AQ):** L01 lists color sequence in the "color following the 12-color scheme from TIA-598-D" section — this 12-color EIA/TIA sequence is industry-standard and consistent with independent secondary sources.
- **ITU-T G.657 subcategory specifications (10 mm / 7.5 mm / 5 mm bend radii):** registry confirmed; lessons apply `[verify 2024 edition consolidation]` markers consistently.
- **ICEA S-87-640 scope (OSP fiber cable construction, armor, jacket, tensile, temperature range −40/+70°C):** scope description accurate per paywalled standard's publicly-visible scope statement and vendor conformance letters.

## 8. Cascade-Pattern Observations

- **ICEA tensile value asymmetry (new in R-5):** L10 marks the lower-tier 1,330 N value `[confirm current edition]` but leaves the standard-tier 2,670 N UNGUARDED. Classic "I guarded the uncertainty I was aware of, missed the adjacent identical uncertainty." Same pattern as T18 H₂S IDLH where one value was corrected while a similar nearby value escaped. Fix shape: guard both tiers symmetrically.
- **NEC section-number inconsistency across lessons (new in R-5):** The NEC 2017→2020→2023 restructuring moved section numbers for Article 770. Lessons authored independently used different NEC editions as their reference base, producing internally inconsistent citations. No lesson teaches the wrong CONTENT — the inconsistency is section-number-only. Fix: add [confirm edition] markers; a dedicated fix-agent pass should harmonize to NEC 2023 section numbers across all T03 NEC citations.
- **No new HIGH findings.** R-5 found ONLY LOW citation-precision issues. The HIGH-1 gap (G.655/G.656) is pre-existing canonical.

## 9. Vite Build

`cd osp-training && npm run build` — **PASS.** Built in 15.94s. Zero errors. 131 modules transformed.

---

## 10. Saturation Verdict

**R-5 found ONLY LOW findings** (4 new LOWs: ICEA tensile unguarded, NEC section inconsistency in L12, §770.179(B) title imprecision, TIA-598-D no edition marker).

No new HIGH or MED findings were identified in R-5 that weren't already in R-1..R-4 canonical.

**Assessment:** The R-1..R-4 canonical covers 1 HIGH + 10+ MED. R-5 adds only LOW citation-precision items. Per the saturation rule (continue until next agent finds only rediscoveries OR zero new finds), R-5 meets the "only LOWs remain" threshold that prior topics have used to declare MED/HIGH saturation.

**Recommendation:** Proceed to Fix Wave A on the confirmed HIGH + MED canonical. Fold R-5 LOWs into the polish stage (they are safe to defer past Fix Wave A since they are citation marker issues, not content errors). R-6 is not warranted for citation-precision specifically — no remaining MED citation issues unresolved. If Fix Wave A introduces new issues, the standard post-fix RT pair will catch them.

---

*Entries to add to citation-registry.md (for orchestrator to commit):*

- `ICEA S-87-640` | "Optical Fiber Outside Plant Communications Cable" | https://www.icea.net | `[confirm edition]` | R-5 (this report) | Paywalled. 2016/2023 editions active. 2006 edition publicly accessible via archive.org. Tensile tiers: standard 2,670 N (600 lbf) `[confirm]`, lower 1,330 N `[confirm]`. Temperature −40/+70°C.
- `TIA-598-D` | "Optical Fiber Cable Color Coding" | https://tiaonline.org | `[confirm edition]` | R-5 (this report) | Paywalled TIA document. Current edition is TIA-598-D (2014). 12-color sequence (BL/OR/GR/BR/SL/WH/RD/BK/YL/VT/RS/AQ) is industry-standard; widely cited in secondary sources.
- `7 CFR §1755.902` | "RUS specification for fiber optic aerial and buried plant fiber optic cable" | https://www.ecfr.gov/current/title-7/chapter-XVII/part-1755 | 2026-05-17 | R-5 (this report) | Publicly accessible on eCFR. MFD 9.2 µm ± 0.5 µm @ 1310 nm; coating OD 250 ± 15 µm; 12-color coding — all three values verified in T03.L10.
- `RUS 1753F-201` | "Acceptance Tests and Measurements for Telecommunications Plant" | https://www.rd.usda.gov/programs-services/electric-utilities/telecom-programs/bulletins | 2026-05-17 | R-5 (this report) | Per-lot and post-installation acceptance testing bulletin for RUS projects (PC-4). Title confirmed via USDA RD bulletin index.

=== T03 AUDIT R5 STANDARDS PRECISION END ===
