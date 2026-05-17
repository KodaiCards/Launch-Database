# T02 Polish-G Verification Log — L04 Macrobend Formula Fix

**Date:** 2026-05-17
**Commit:** 5b7abc5d9a922e8c0280ba7685c0e1b3e65dd521
**File touched:** osp-training/src/lessons/T02/L04.macrobend-and-microbend.jsx ONLY
**Vite build:** PASS (✓ built in 6.21s)

---

## 1. PRIMARY-SOURCE VERIFICATION LOG

### Finding under review
RT-ν flagged L04 line 112: formula written as `exp(−C / R)` (division).
Correct form per Gloge (1972) and Marcuse (1976): `exp(−C × R)` (multiplication).

**Why it matters — physics:**
- `exp(−C / R)`: as R decreases (tighter bend), C/R → large, exponent → very negative → loss drops. WRONG.
- `exp(−C × R)`: as R decreases (tighter bend), C×R → small, exponent less negative → loss climbs. CORRECT.

### Source 1 — Gloge (1972) Applied Optics 11, 2506-2513
"Bending Loss in Multimode Fibers with Graded and Ungraded Core Index"
URL: https://opg.optica.org/ao/abstract.cfm?URI=ao-11-11-2506

Search result extract: "a semi-empirical model expresses this relationship as: L_R = η₁ exp(−η₂ · R),
where η₁ and η₂ are wavelength-dependent fitting parameters."

Confirm: multiplication form. As R increases, −η₂·R becomes more negative → loss L_R decreases. ✓

### Source 2 — Marcuse (1976) JOSA 66, 216
"Curvature loss formula for optical fibers"
URL: https://opg.optica.org/josa/abstract.cfm?uri=josa-66-3-216
URL: https://www.semanticscholar.org/paper/Curvature-loss-formula-for-optical-fibers-Marcuse/61d5e274c031ca1578a5abb69345179707a93bfe

Search result extract: "A bending loss formula that varies as φ³ and depends on R by a factor of
the form e^(−αR)/R was developed for leaking wave conditions."

Confirm: exponential is e^(−αR) — α multiplies R. Division by R is in a separate prefactor,
not in the exponent. The dominant exponential dependence is −αR (multiplication). ✓

### Source 3 — Literature survey (multiple papers)
URL (search result): https://www.ijstre.com/Publish/072016/826491091.pdf
URL: https://opg.optica.org/ao/abstract.cfm?uri=ao-49-12-2220

Search result verbatim: "As the radius of curvature decreases, the loss increases exponentially
until at a certain critical radius the curvature loss becomes observable. More specifically,
reducing the radius of the bend will increase the attenuation."

Also: "L_total = α·e^(βθ − γr) where L is total light loss in dB, θ is total angle about
which fiber is bent, r is radius of curvature, α, β, γ are constants."
(−γr in the exponent = multiplication; larger r → more negative → less loss ✓)

### Conclusion
All three independent source families confirm: macrobend loss ∝ exp(−C × R).
Division form exp(−C / R) is physically inverted and pedagogically wrong.

---

## 2. BEFORE → AFTER

**BEFORE (line 112, wrong):**
```
exp(−C / R) where R is bend radius.
```

**AFTER (lines 112–119, corrected and expanded):**
```
exp(−C × R) where R is bend radius and C is a wavelength- and fiber-dependent
coefficient (units of 1/length). The form exp(−C × R) captures the key
physics: as bend radius R decreases (tighter bend), the exponent becomes
less negative and loss climbs exponentially. As R increases (gentler
bend), the exponent grows more negative and loss drops rapidly — which is why
straightening a tight coil restores signal almost instantly.
```

---

## 3. GIT LOG

```
5b7abc5 T02.L04: fix macrobend formula from exp(-C/R) to exp(-C*R) per Gloge/Marcuse
30c6db7 T02 Final Verify 6 RT-ν (pedagogy+cascade-sweep): YELLOW — MED formula bug exp(-C/R) vs exp(-C*R) in L04 line 112; all other content clean, Polish-F verified, build clean
```

## 4. GIT DIFF --STAT

```
osp-training/src/lessons/T02/L04.macrobend-and-microbend.jsx | 8 +++++++-
1 file changed, 7 insertions(+), 1 deletion(-
```

Only L04 touched. ✓

---

## 5. VITE BUILD

```
✓ built in 6.21s
```

---

## 6. WORKED-EXAMPLE ARITHMETIC

No WorkedExample component with numerical substitution for the macrobend formula exists in L04.
The formula appears in prose only (one occurrence). No numerical re-derivation required.

---

## 7. NEIGHBORHOOD SCAN

Scanned L04 for:
- Other `exp` formula representations: NONE (only the one now-fixed prose instance)
- WorkedExample components referencing macrobend formula: NONE
- Quiz questions referencing the formula numerically: NONE
- Plot or table rendering bend-loss vs R: NONE (mandrel test TABLE only — uses empirical dB values, not formula)

Surrounding prose at line 272 states "Loss increases rapidly as the bend radius decreases below
the minimum specification" — CONSISTENT with the corrected formula. No further changes needed.

Items noted but OUT OF SCOPE (not applied):
- None. L04 is internally consistent post-fix.

=== T02 POLISH-G NOTES END ===
