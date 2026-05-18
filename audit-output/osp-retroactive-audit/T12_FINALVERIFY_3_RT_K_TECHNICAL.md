# T12 Final-Verify-3 RT-κ — Technical / Math / Cascade Framing
**Commit verified:** `f244932` (Polish-C), pair-mate to RT-ι `f576b50` (GREEN)
**Write-path constraints acknowledged:** only `audit-output/osp-retroactive-audit/T12_FINALVERIFY_3_RT_K_TECHNICAL.md` written.

---

## Polish-C Fix Technical Verification

### Fix T-1: L12 ZDW range 1302–1322 → 1300–1324 nm
**VERIFIED — math/citation correct.** ITU-T G.652.D Table 1 specifies ZDW range 1300–1324 nm. L12 key_terms definition and body Advanced section both show "1300–1324 nm (per ITU-T G.652.D Table 1)." Internal consistency: ZDW in L12 Flashcard `CD` definition reads "1300–1324 nm (per ITU-T G.652.D Table 1)" — matches the fix target. No residual 1302–1322 string in L12.

### Fix T-2: L13 splice term in formula and WorkedExample
**VERIFIED — arithmetic correct, formula internally consistent.**
WorkedExample: `8 × 0.3 = 2.40 dB`. Checked: 8 × 0.3 = 2.40 ✓. Total: 3.00 + 4.80 + 2.40 = 10.20 dB ✓ (connector + fiber + splice). Blockquote formula `+ (n_splices × 0.3 dB)` present. Three-term model now complete; RT-ι verified pedagogical framing; no new technical concern introduced.

### Fix T-3: L04 EDZ/ADZ narrow-pulse sub-range qualifier
**VERIFIED — values technically defensible.** Narrow-pulse 5–30 ns sub-range stated as 0.5–2 m EDZ / 3–8 m ADZ; full-range parenthetical 1–5 m / 3–10 m. The full-range values match key_terms definitions. The narrow-pulse 0.5–2 m EDZ lower bound is consistent with EXFO AN296 (5 ns pulse → EDZ ≈ 0.5 m). No arithmetic; qualification is purely descriptive — technically sound.

---

## Independent Technical Sampling (under-audited lessons — different from RT-ι)

**L12 PMD WorkedExample arithmetic:**
- `PMD_total = 0.2 × √80 = 0.2 × 8.944 = 1.789 ps` → lesson shows "1.79 ps" ✓ (rounded correctly)
- System limit: "1/10 × 100 ps = 10 ps" ✓ (10 Gbps bit period = 100 ps; 1/10 tolerance rule)
- Sanity check: "(10 ÷ 0.2)² = 2,500 km" ✓ (algebra verified: PMD_total = limit when L = (limit/coeff)² = (10/0.2)² = 2,500 km)
- G.652A 80 km check: "0.5 × 8.944 = 4.47 ps" ✓

**L13 fiber attenuation claim (G.652.D spec max):**
- "≤ 0.40 dB/km @ 1310 nm and 0.30 dB/km @ 1550 nm" — verified against ITU-T G.652.D spec maximums. Correct. The note that typical measured values are 0.32–0.36 / 0.18–0.22 is accurate field context.

**L04 launch cable length formula (WorkedExample):**
- Formula: `ADZ ≈ pulse_width_ns × 0.10 m/ns` — this is a conservative upper bound.
- Table shows 500 ns → ≥500 m (500 × 0.10 = 50 m minimum, table uses 500 m — table is field-practice conservative, not a derived minimum from the formula). Minor framing inconsistency: formula gives 50 m for 500 ns, but table says ≥500 m. The table is empirically correct (500 ns OTDRs are used for campus/access spans where 500 m launch reels are standard practice); the formula derivation would yield a much shorter value. This is NOT an error — it's a conservative table — but the prose should make clear the table values exceed the formula's minimum. Flagged as LOW.

---

## Cascade-Pattern Check

Known cascade patterns from `known-cascade-patterns.md` relevant to T12:
- G.652.D PMD ≠ 0.5 ps/√km (that's G.652A/C): L12 correctly shows 0.2 ps/√km for G.652.D ✓
- TIA-455-124A edition marker `[confirm edition]` present ✓ — consistent with policy
- ZDW 1302–1322 cascade: corrected to 1300–1324 in Polish-C ✓

No cascade pattern recurrence detected.

---

## Negative Findings (checked + confirmed clean)

- Vite build: ✓ 7.14 s, zero errors
- Schema validator: 15/15 PASS
- L12 PMD coefficient: 0.2 ps/√km (G.652.D) throughout, 0.5 ps/√km only for G.652A/B/C ✓
- L13 RUS 1753F-401 §5 splice threshold 0.30 dB/splice: consistent with T04 citations ✓
- L04 key_terms EDZ/ADZ full-range values (1–5 m / 3–10 m) match body text post Polish-C ✓

---

## New Findings

**LOW — L04 WorkedExample formula vs. table inconsistency (framing note).**
- Formula yields `500 ns × 0.10 m/ns = 50 m`, but table lists ≥500 m for 500 ns pulses (campus/access class). The table value is empirically correct field practice; the formula is a theoretical ADZ minimum. Prose does not bridge this gap for the learner — a reader deriving the answer from the formula would get 50 m and be confused why the table says 500 m. Suggest adding one sentence: "Note: the table values reflect standard field practice (minimum reel sizes carried by test crews) and are intentionally conservative — they significantly exceed the formula's theoretical ADZ minimum." Non-blocking; purely instructional clarity.

---

## Verdict

**GREEN**

All 3 Polish-C fixes arithmetically correct and technically sound. PMD, CD, EDZ/ADZ, and acceptance-threshold math independently verified. One new LOW (launch cable formula vs. table framing) — instructional clarity only, not a factual error.

**SATURATION verdict:** RT-ι (pedagogy) GREEN + RT-κ (technical) GREEN on Polish-C state. One new LOW is cosmetic; no factual or arithmetic errors remain. T12 **SATURATED** — recommend close.

=== T12 FINAL-VERIFY-3 RT-K TECHNICAL REPORT END ===
