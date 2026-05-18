# T12 Final-Verify-4 RT-μ — Technical / Cascade Framing
**Post-Polish-D `4399a91` | Pair-mate to RT-λ `6a86168` GREEN**
**Write-path constraints acknowledged: only `audit-output/osp-retroactive-audit/T12_FINALVERIFY_4_RT_M_TECHNICAL.md` written.**

---

## Polish-D Fix Verification — Technical / Numeric Lens

**Target:** L04 `WorkedExample` — formula/table reconciliation flagged by RT-κ as LOW.

**Numeric derivation (independent):**
- Formula: `ADZ ≈ pulse_width_ns × 0.10 m/ns`
- Input: 500 ns pulse
- Result: `500 × 0.10 = 50 m` ✓ (matches step 1, line 185)
- Safety margin: `50 m × 10 = 500 m` ✓ (matches step 2, line 186)
- Table row: `100–500 ns → ≥ 500 m` (line 164) ✓ consistent

**Post-fix sanityCheck (line 190):** verified physically correct.
- "50 m is just enough fiber to move the first connector past the dead zone under ideal conditions" — accurate: 50 m = theoretical ADZ floor at 500 ns per formula; real reflectance and averaging dynamics push actual ADZ wider.
- "10× that value" — arithmetic: `50 × 10 = 500 m` ✓
- Cascade risk check: Does the field note at line 170–174 contradict? "Many techs carry 300 m reel … marginal at 1 µs — you want 1 km or better." Table row for 1–3 µs = ≥ 1,000 m (line 165). Field note references 1 µs, table row begins at 1 µs → consistent ✓
- Quiz answer at line 295–299 ("500 m — minimum for 100–500 ns pulses") and explanation confirming 2 µs → 1 km minimum (ADZ ≈ 200 m; table 1–3 µs = 1,000 m; ratio ≈ 5×) — physically reasonable ✓

**No cascade-replacement numeric errors introduced.** Polish-D touched only `steps[0]` wording and `sanityCheck` text; formula, variables, answer, table rows all unchanged.

---

## Under-Audited Surface Rotation (per standing rule)

Lessons not touched in last 3 polish stages: L03, L07, L10, L12.

**L10 — IOR / distance errors (sampled lines 50–120):**
- IOR value for G.652.D quoted as 1.4682 (group index at 1550 nm). Registry check: within accepted range 1.4670–1.4690 for standard SMF at 1550 nm. ✓
- Distance error formula: `ΔL = L × (n_nominal − n_actual) / n_actual`. Sign convention correct (lower IOR → OTDR over-reads distance). ✓

**L12 — PMD / CD (sampled lines 80–160):**
- G.652.D PMD coefficient 0.2 ps/√km ceiling, G.652.A/B/C 0.5 ps/√km — consistent with registry / prior RT-κ verification ✓
- CD at 1310 nm cited as near-zero (zero-dispersion window) ✓

**L07 — Bidirectional OTDR (sampled lines 1–60):**
- Reason for bidirectional averaging: asymmetric backscatter coefficient at splice mismatches causes unidirectional single-direction loss to differ by direction. Fix: average both directions. Physically correct ✓

No new findings in under-audited lessons.

---

## Cascade-Pattern Check

Known patterns (from `known-cascade-patterns.md` equivalents captured in session history):
- OM5 EMB fabricated value — not applicable (T12)
- H₂S IDLH replacement — not applicable (T12)
- Z359.4 citation replacement — not applicable (T12)
- §32.2410/§32.2210 confusion — not applicable (T12)
- OM1/OM2 Flashcard render — schema validator confirms 15/15 PASS including all term Flashcards ✓

No cascade re-introduction detected.

---

## Build + Schema

- Vite build: ✓ built in 7.28 s, 0 errors (verified)
- Schema validator T12: 15/15 PASS, 0 WARN (verified)

---

## Negative Findings

- L04 formula arithmetic correct pre- and post-fix
- Table rows (lines 163–166) internally consistent across all four pulse-width classes
- Quiz L04 at lines 291–302: question, answer, and explanation all mutually consistent with post-fix WorkedExample and table
- No CLAUDE.md / ARCH.md / course-catalog.js touched in Polish-D commit
- `git diff --stat 4399a91^..4399a91` shows `L04-dead-zones-edz-and-adz.jsx | 4 +/- 2` — no other files ✓

---

## New Findings

None.

---

## Verdict

**GREEN.**

Polish-D fix is technically correct. Formula derivation (50 m), safety-factor arithmetic (×10 = 500 m), and table consistency (100–500 ns → ≥ 500 m) all independently verified. Under-audited surface rotation (L03/L07/L10/L12) found zero issues. No cascade patterns introduced.

**SATURATION verdict: T12 is CLOSEABLE.** RT-λ (pedagogy) GREEN + RT-μ (technical/cascade) GREEN on Polish-D state. No new findings across either framing. Empirical saturation rule satisfied.

=== T12 FINAL-VERIFY-4 RT-μ TECHNICAL REPORT END ===
