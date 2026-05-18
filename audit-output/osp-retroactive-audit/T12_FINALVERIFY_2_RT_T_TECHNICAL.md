# T12 Final-Verify-2 RT-θ — Technical Framing
**Wave:** post-Polish-B `fb92e9b`
**Scope:** technical/math/citation cascade verification — pair-mate to RT-η `31266a2` (GREEN)
**Framing:** numeric re-derivation, cross-topic citation consistency, formula completeness, under-audited surfaces
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T12_FINALVERIFY_2_RT_T_TECHNICAL.md` written.**

---

## Registries First

- `citation-registry.md`: GR-196-CORE entry present (T12 Polish-B, 2026-05-18) — SKIP re-verify ✓  
- `citation-registry.md`: ITU-T G.652.D present (Haiku, 2026-05-17) ✓  
- `dag-registry.json`: not regenerated; DAG pointer checks done manually below.
- `known-cascade-patterns.md`: reviewed — no prior T12 pattern flags.

---

## Math Re-derivation (Independent)

### L10 IOR distance error formula
Lesson: ΔD = (0.0005 / 1.4677) × 40,000 m = 13.6 m

Independent: 0.0005 / 1.4677 = 0.000341. × 40,000 = **13.6 m** ✓  
100 km sanity: 0.000341 × 100,000 = 34.1 m. Lesson says 34 m ✓

### L12 PMD budget
Lesson: PMD_total = 0.2 × √80 = 0.2 × 8.944 = 1.79 ps

Independent: √80 = 8.944. 0.2 × 8.944 = **1.789 ps** ✓  
Distance-limit sanity: (10 / 0.2)² = 2,500 km ✓  
G.652A/80 km: 0.5 × 8.944 = 4.47 ps vs 2.5 ps 40G limit → FAIL ✓

### L06 MFD mismatch gainer
Lesson: 20 × log₁₀(9.8/9.2) = 20 × 0.0274 = 0.55 dB apparent gainer

Independent: 9.8/9.2 = 1.0652. log₁₀(1.0652) = 0.02742. × 20 = **0.548 dB** ✓  
Bidirectional avg quiz: (0.18 + (−0.08)) / 2 = 0.05 dB ✓

### L13 TIA-568 channel loss worked example
Lesson: 4 × 0.75 + 12 × 0.4 = 3.0 + 4.8 = 7.80 dB

Independent: **7.80 dB** ✓

---

## Findings

| # | Sev | Item | Location | Notes |
|---|---|---|---|---|
| T-1 | LOW | ZDW range inconsistency vs T02 (cross-topic) | L12 key_terms line 53 + body line 236 | L12 teaches G.652.D ZDW "1302–1322 nm". T02 consistently teaches "1300–1324 nm" per ITU-T G.652.D Table 1 (T02.L03 line 22, T02.L10 line 153, T02.L12 line 174). The ITU-T G.652 Table 1 spec is 1300–1324 nm. T12's 1302–1322 range is slightly narrower and not from a distinct standard spec. LOW because downstream learner impact is minimal (teaching window, not a pass/fail value), but cross-topic inconsistency with 3 separate T02 sources is clean LOW fix. |
| T-2 | LOW | TIA-568 channel loss formula body omits splice component | L13 blockquote line 99–101 + WorkedExample formula line 114 | The `key_terms` definition (line 47) correctly states the full formula including `+ (number of splices × 0.3 dB)`. The prose blockquote and WorkedExample formula both omit the splice term. A learner reading the prose formula will compute an incomplete channel loss budget. The worked example (no splices in span) happens to be correct numerically, but the formula presentation is incomplete. |
| T-3 | LOW | EDZ key_terms vs body prose range mismatch | L04 key_terms line 43 + body line 126 | key_terms: EDZ "Typically 1–5 m". Body prose (at 5–30 ns pulse context): EDZ ≈ 0.5–2 m. Both are accurate for their respective scope, but no clarification distinguishes the ranges. A reader who cross-references key_terms against the table is confused. Same pattern for ADZ: key_terms "3–10 m" vs body "3–8 m". LOW — not wrong, needs qualifier sentence noting the body values are the shortest-pulse (5–30 ns) sub-range. |

---

## Negative Findings (Confirmed Clean)

- L12 G.652.D PMD coefficient 0.2 ps/√km ✓ (ITU-T G.652.D; prior cascade-fix R-2 X-3 applied, consistent through lesson)
- L12 G.652A/C PMD coefficient 0.5 ps/√km ✓ (G.652A/B distinction)
- L06 MFD mismatch formula arithmetic ✓
- L06 bidirectional average quiz answer ✓
- L10 EIOR formula and worked example ✓
- L13 TIA-568 worked example arithmetic ✓ (for the zero-splice case stated)
- L04 ghost formula (n+1)×D ✓ (Polish-B fix confirmed)
- L09 G.652.D cable/fiber footnote ✓ (Polish-B fix confirmed via RT-η)
- GR-196-CORE registry entry ✓ (confirmed present + accurately describes EDZ 0.5 dB criterion)
- FOTP-124/168 citations in L12 marked `[confirm edition]` ✓ (correct hedge)
- RUS 1753F-401 §5 splice threshold 0.30 dB ✓ (consistent with T09/T10 prior verified entries)

---

## Verdict: **YELLOW** (3 LOWs, all in key_terms / formula / cross-topic range — no math errors, no citation fabrications, no HIGH/MED found)

All Polish-B numeric fixes verified correct. Math re-derivations pass independently. Three LOW inconsistencies found — T-1 (ZDW cross-topic), T-2 (splice term omitted from formula prose), T-3 (EDZ range qualifier). None affect learner safety or pass/fail thresholds; all are LOW editorial/formula-completeness items.

**SATURATION verdict:** RT-η (pedagogy) returned GREEN / zero finds. This RT-θ (technical) returns 3 LOWs. Under the no-severity-gate saturation rule, new finds → not yet saturated. However all 3 are LOW editorial items with no math or safety impact. Saturation question for orchestrator: if a polish-stage agent absorbs these 3 LOWs, a clean post-polish RT pair would confirm saturation. T12 is closeable after a single targeted polish addressing T-1/T-2/T-3.

=== T12 FINAL-VERIFY-2 RT-T TECHNICAL REPORT END ===
