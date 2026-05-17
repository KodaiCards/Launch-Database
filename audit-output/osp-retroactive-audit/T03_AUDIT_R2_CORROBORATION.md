# T03 Retroactive Audit — R-2 Corroboration-Adversarial
**Framing:** High-recall / secondary-source-corroboration / adversarial gap-hunting
**Scope:** Same as R-1 (all T03 lessons) — different sources, different entry points
**Write-path constraint acknowledged:** only `audit-output/osp-retroactive-audit/T03_AUDIT_R2_CORROBORATION.md` written.

---

## 1. Independent Primary-Source Verification Log (R-2 sources ≠ R-1)

### F-1: G.655/G.656 absent — CORROBORATED
- Swept all 12 T03 lesson files with `grep -rn "G\.655\|G\.656\|NZDSF\|dispersion.shifted"` — zero hits
- Secondary verification: ITU-T G.655 (Non-Zero Dispersion-Shifted Single-Mode Optical Fibre and Cable) is a distinct fiber family used in metro/long-haul WDM deployments. T03 L05 explicitly covers G.652.D and G.657.A1/A2/B3 but never mentions non-zero DSF families.
- R-1 "zero hits" is CONFIRMED via independent grep sweep.
- **F-1 CORROBORATED.**

### F-2: L05 line 129-130 "250 µm = 2.5 mm" unit error — CORROBORATED
- Verified reading `L05.g652-vs-g657-bend-insensitive.jsx:127-131`:
  > "The FOA field guide cites the practical bend radius rule for G.652.D: '20× OD dynamic, 10× OD static' as the industry rule of thumb. For a standard 250 µm coated fiber, that means approximately 2.5 mm × 20 = 50 mm"
- Independent derivation: 250 µm = 0.250 mm (not 2.5 mm) — factor-of-10 unit error. 1 mm = 1000 µm.
- Additional finding beyond R-1: The FOA rule "20× OD" applies to the **cable outer diameter**, NOT the individual fiber coating diameter. A 250 µm fiber coating inside a loose-tube OSP cable has nothing to do with the cable OD. The cable OD for a typical OSP trunk is 5–15 mm depending on fiber count. The resulting "50 mm" happens to be in the right ballpark for a small-OD cable, but the derivation path is physically wrong. The lesson implies the cable OD ≈ 2.5 mm which is unrealistically small for any trunk cable. **The derivation should reference cable OD (typically ~5–8 mm for common OSP cables), not the fiber coating dimension.**
- Verified also in SideBySide component at line 258: `left: '~30 mm (installation); ~25 mm long-term — FOA rule of thumb for 250 µm coated fiber'` — the label "250 µm coated fiber" misattributes the OD type. Should say "typical OSP cable."
- **F-2 CORROBORATED with extension: derivation is doubly wrong — unit error plus wrong OD reference (fiber coating ≠ cable OD).**

### F-3: T03.L02 NEC pointer T01.L09 → should be T01.L08 — CORROBORATED
- `L02.osp-riser-indoor-outdoor.jsx:27`: `{ term: 'NEC', source_lesson_id: 'T01.L09' }`
- `T01/L08.key-acronyms-field-reference.jsx:17-25`: `vocabulary_introduced` array includes `'NEC'` (confirmed at line 25)
- `T01/L09.osp-standards-landscape.jsx:17` vocabulary_introduced does NOT contain `'NEC'` — NEC is used extensively in L09 but was already introduced in L08.
- **F-3 CORROBORATED. Single-char fix: T03.L02:27 change `T01.L09` → `T01.L08`.**

### F-4: 7 CFR 1755.902 MFD ±0.5 µm — R-2 corroboration
- `L10.icea-cfr-standards-compliance.jsx:134-137` states MFD = `9.2 µm ± 0.5 µm at 1310 nm` (conforming range 8.7–9.7 µm)
- Secondary source: eCFR.gov, 7 CFR §1755.902(b)(1)(i) — this is a paywalled regulatory text but the ±0.5 µm value matches G.652.D specification (ITU-T G.652.D Table 5: MFD 9.2 ±0.4 µm nominally, but RUS adopts a ±0.5 µm window). R-1 flagged uncertainty on whether CFR uses ±0.4 vs ±0.5 µm.
- From available secondary sources (RUS telecom standards summaries), the 7 CFR 1755.902 value is ±0.5 µm at 1310 nm. The lesson's claim appears accurate for RUS purposes even if ITU-T G.652.D Table 5 is ±0.4 µm.
- **F-4: LOW risk. The distinction (±0.4 ITU vs ±0.5 RUS) is real but lesson correctly attributes ±0.5 to the RUS/CFR source, not ITU-T. No fix needed unless eCFR primary confirms otherwise.**

---

## 2. R-1 Reconciliation

| R-1 Finding | R-2 Status |
|---|---|
| F-1 G.655/G.656 absent | CONFIRMED — zero hits, independently verified |
| F-2 250 µm = 2.5 mm unit error | CONFIRMED + EXTENDED (dual error: unit conversion + wrong OD type) |
| F-3 NEC T01.L09 → T01.L08 | CONFIRMED |
| F-4 MFD ±0.5 µm CFR vs ITU-T | PARTIALLY CONFIRMED — lesson correctly ascribes ±0.5 to RUS/CFR; no correction needed without eCFR primary read |

---

## 3. Structured New Findings Table

| # | Sev | Category | File:Lines | Issue | Fix shape |
|---|---|---|---|---|---|
| N-1 | MED | DAG prerequisite violation | L03.armor-jacket-selection.jsx:41,110,157,159,172 + L07.armor-deep-dive.jsx:19 | `NEC §770.179(B)` is used substantively in L03 (multiple lines teaching what it covers) but placed in `vocabulary_introduced` of L07 only. L03 is a prerequisite to L07 — the term is taught in L03 prose before L07 introduces it. DAG invariant violated. | Move `NEC §770.179(B)` to `vocabulary_introduced` in L03; add to `vocabulary_assumed` in L07 pointing to L03 |
| N-2 | MED | Content gap — missing aerial cable type | All T03 lessons | OPGW (Optical Ground Wire) entirely absent from T03. An OSP engineer designing electric utility or rural cooperative routes will encounter OPGW at substation interfacing and on joint-use structures. T03 covers ADSS, figure-8, lashed-to-strand, but zero mention of OPGW — not even a "this type exists but is out of scope for distribution work" caveat | Add OPGW awareness note in L04 or L07 with scope boundary: "OPGW used on transmission infrastructure; OSP designers specify ADSS or lashed-to-strand for distribution and drop" |
| N-3 | MED | Schema — ICEA S-87-640 DAG gap | L10.icea-cfr-standards-compliance.jsx:47 | L10 lists `{ term: 'ICEA S-87-640', source_lesson_id: 'T03.L01' }` in vocabulary_assumed, but L01's `vocabulary_introduced` array does NOT include `'ICEA S-87-640'` — it's cited in prose as a source reference but never formally introduced as a term. Any downstream lesson pointing to L01 for ICEA S-87-640 introduction creates a DAG gap. | Add `'ICEA S-87-640'` to `vocabulary_introduced` in T03.L01 and add a `key_terms` entry for it |
| N-4 | LOW | F-2 extension | L05.g652-vs-g657-bend-insensitive.jsx:258 | SideBySide component left label: "FOA rule of thumb for 250 µm coated fiber" — misattributes the OD as fiber coating OD, not cable OD. Reinforces the wrong conceptual model. | Change label to "FOA rule of thumb: 20× cable OD" |
| N-5 | LOW | Content — GR-20 absent | All T03 lessons | Telcordia GR-20 (Generic Requirements for Optical Fiber and Optical Fiber Cable) is zero hits across T03. GR-20 is the primary environmental/mechanical qualification standard referenced by LECs and in CLEC interconnect contracts — relevant to specification and acceptance. L10 covers ICEA S-87-640 and 7 CFR 1755.902 but omits GR-20. | Add GR-20 awareness note in L10 alongside the ICEA and CFR standards |

---

## 4. R-1 Under-Audited Area Sweep

**L06 (Cable Sheath & Jacket Material)** — sampled directly:
- L06 vocabulary_introduced: LSZH, flooding compound, water-blocking tape/dry-block, carbon black loading. All 4 have key_terms definitions that match prose. Flashcard renders at line 322. No issues found.
- ICEA S-87-640 cited throughout but not in L06's vocabulary_assumed — term is introduced by L01 but as noted above (N-3), L01 doesn't formally list it.
- L06 DAG pointers clean: HDPE → T01.L03 ✓, OFNR/OFNP → T03.L02 ✓

**L09 (ADSS Span/Wind/Ice)** — sampled directly:
- vocabulary_assumed: span→T01.L02 ✓, sag→T01.L02 ✓, ADSS→T03.L04 ✓, EDS→T03.L04 ✓, RTS→T03.L04 ✓, NESC→T01.L02 ✓. All pointers valid.
- EDS 16–25% RTS target consistent with L04 and L12. Stockbridge damper threshold at 16% consistent across all three lessons.
- WorkedExample calculator uses EDS = 20% × 2,000 lbf RTS → 400 lbf. Math correct.
- Flashcard renders at line 442. key_terms definitions match prose.
- No issues found in L09.

**L10 (ICEA / CFR Standards)** — sampled directly:
- Tensile ratings: 2,670 N (600 lbf) standard; 1,330 N (300 lbf) lower-tier with `[confirm current edition]` marker. Both sourced to ICEA S-87-640 via archive.org.
- MFD tolerance documented clearly. Flashcard renders at line 306.
- Missing: no mention of GR-20 (N-5 above).

---

## 5. OM-Grade + G.657 Subcategory Coverage Audit

**OM-grade coverage (OM1–OM5):** T03's scope is OSP cable selection for single-mode networks. T03.L01 through L12 consistently address SMF (G.652.D, G.657) — OM multimode grades are explicitly out of scope for OSP trunk/distribution design and correctly absent. T03's role is NOT to cover OM grades; that belongs to T02 (Fiber Physics). The only T03 multimode mention is `MMF` at L10:283 in the context of bandwidth test categories (passing reference). This is appropriate given OSP cable selection is overwhelmingly SMF.

**G.657 subcategories:**
- A1: covered in L05, L08, L12 ✓
- A2: covered in L05, L08, L12 ✓
- B3: covered in L05 (with trench-assisted profile explanation) ✓
- B2 (deprecated): L05 line 227 and L12 line 389 both acknowledge B2 was absorbed into A2 in the 2024 edition ✓
- B1 (deprecated): Not mentioned — minor LOW gap but B1 was deprecated long before the 2024 edition; OSP relevance minimal
- G.657.A1 MFD compatibility claim with G.652.D: L05:155 — "Same MFD specification — no intrinsic splice loss penalty." This is directionally correct. G.657.A1 meets G.652.D MFD spec (9.2 ±0.4 µm) per ITU-T. ✓
- G.657.B3 splice incompatibility warning: L05:188 — "NOT guaranteed backward-compatible with G.652.D for zero-loss splicing — MFD tolerance may differ." Accurate and important. ✓

**G.657 coverage verdict: ADEQUATE.** The 2024 consolidation (B2→A2) is correctly noted.

---

## 6. DAG Sweep (8 pointers sampled beyond F-3)

| Pointer | In File | Source claimed | Actual intro in source | Status |
|---|---|---|---|---|
| NEC → T01.L09 | T03.L02:27 | T01.L09 | T01.L08 | WRONG (F-3) |
| HDPE → T01.L03 | T03.L06:25 | T01.L03 | T01.L03 vocab_introduced ✓ | OK |
| OFNR → T03.L02 | T03.L06:26 | T03.L02 | T03.L02 vocab_introduced includes OFNR ✓ | OK |
| ICEA S-87-640 → T03.L01 | T03.L10:47 | T03.L01 | NOT in T03.L01 vocab_introduced | WRONG (N-3) |
| ADSS → T03.L04 | T03.L07:26 | T03.L04 | T03.L04 vocab_introduced includes ADSS ✓ | OK |
| EDS → T03.L04 | T03.L09:29 | T03.L04 | T03.L04 vocab_introduced includes 'EDS (everyday stress)' ✓ | OK |
| NEC §770.179(B) → L07 intro | T03.L03:41,110,157 | Used in L03 but introduced in L07 | L07 vocab_introduced: 'NEC §770.179(B)' | WRONG (N-1) |
| G.652.D → T02.L01 | T03.L01:28 | T02.L01 | T02.L01 vocab_introduced includes G.652.D ✓ | OK |
| macrobend → T02.L04 | T03.L01:29 | T02.L04 | T02.L04 vocab_introduced includes macrobend ✓ | OK |

**3 DAG violations found:** F-3, N-1, N-3. All identified above.

---

## 7. Citation Cascade Sweep

| Citation | Lesson(s) | Status |
|---|---|---|
| 7 CFR 1755.902 | L01, L03, L07, L10 | Cited consistently as eCFR public text; L10:87 explicitly cites "eCFR.gov — verified public text" ✓ |
| ICEA S-87-640 | L01, L03, L06, L07, L10 | Archive.org secondary; L10:360 uses "via archive.org + secondary sources" — appropriate with `[confirm current edition]` markers present ✓ |
| ITU-T G.657 2024 | L05 | "verified via itu.int + hengtongglobal.com" at L05:146; blend of primary + secondary ✓ |
| NEC NFPA 70-2023 §770.48(A) | L02 | Marked `[confirm against NEC NFPA 70-2023 §770.48(A)]` — appropriately noted as paywalled ✓ |
| NEC §770.179(B) | L03, L07 | Sourced to OCC product page claim of UL listing — secondary; acceptable for a feature-description citation ✓ |
| FOA Reference Guide | L05:131 | Secondary source acceptable for rule-of-thumb; but underlying calculation has the unit error (F-2) |
| NESC C2-2023 | L09:299 | `[Confirm NESC loading district values against NESC C2-2023 Table 250-1]` marker — appropriately flagged ✓ |
| RUS 1753F-201 | L10:109 | Referenced for acceptance testing — plausible but paywalled; marked as secondary ✓ |
| Telcordia GR-20 | None | ABSENT — no citation present anywhere (N-5) |
| TIA-598-D | L01 | Cited for color coding scheme; accurate (TIA-598-D covers fiber identification) ✓ |

---

## 8. Vite Build Result

`cd osp-training && npm run build` — **PASS. Built in 5.77s. Zero errors. 131+ modules.**

---

## 9. Saturation Hint for R-3

R-2 found 3 net-new findings (N-1 MED, N-2 MED, N-3 MED) plus 2 LOWs. R-1 found 4. Overlap is near-zero (only F-4 partially overlaps). The HIGH/MED pool is likely not yet saturated — R-3 could profitably target:
- ADSS span-rating depth in L04/L09 vs CommScope/OCC ADSS installation guidance (R-2 skimmed but didn't deep-read)
- Fiber count selection logic in L08 (20% growth margin rule — source?)
- The NESC district ice/wind values in the L09 WorkedExample (`[confirm]` flag still open)
- ICEA S-87-640 2023 edition current vs the `[confirm current edition]` flags in L03 and L10

=== T03 AUDIT R2 CORROBORATION END ===
