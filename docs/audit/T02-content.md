# T02 content audit — Fiber Physics assessment pools (112Q)

> Auditor working report (third content audit, second D026 self-pick). Graded vs Opus baseline + `T01-content.md`/`T18-content.md`, same rigor. Detail here; thread carries a short summary + pointer (D018).
> Scope: `content/training/assessment-pools/T02-L01..L11.json` + `T02-final.json` (112Q) + `_research/T02.md` + `_research/T02-redteam.md`, CEO branch `claude/ceo-fresh-instance-boot-u2zw28` @ AUDIT-READY commit `3c280f0`. Author = C1, red-team = C2 (clean pass, no fix cycle). Method: own structural re-check + engine-loader run, independent hand-derivation of every physics calculation (not trusting C2's re-derivation either — did my own), WebSearch spot-checks on the standards citations, and — continuing the practice from the T18 audit — independently grepped the lesson JSX prose rather than trusting "flag, don't fix" claims at face value. Last updated 2026-07-02.

## Headline

**T02 clears the gate — the cleanest structural/citation pass of the three topics audited so far, matching C2's "zero gate misses" verdict.** But my own JSX-prose check found something neither C1 nor C2 caught: **the OS1/OS2 cross-lesson inconsistency they correctly flagged for T02 is not a two-lesson problem, it's a three-way problem** — T01's own lesson JSX (not just T02's) independently states the same fact wrong, in a *third, different* incorrect form. Not a pool defect (both topics' pool questions are correct), but the "flag, don't fix the prose" scope needs to be widened before any prose cleanup pass, or it'll fix T02's wrong sentence and leave T01's differently-wrong sentence untouched.

---

## 1. Pool set — independent structural re-check (own tooling)

- **112 questions** — 11×8 lesson pools + 24 topic-final, matching the readme dial exactly.
- **Zero banned types, zero bad `answerIndex`, zero malformed `correctMap`.**
- **Real engine loader**: all 32 pools now present (10 T01 + 10 T18 + 12 T02) load with zero errors — three topics coexist cleanly.
- **Engine test suite**: still 10/10, no regression.

## 2. Independent arithmetic re-derivation (own calculation, not trusting C2's)

T02 is physics/math-heavy — this is the highest-value place to independently re-derive rather than read-and-trust. Recomputed every figure C2's red-team cited, by hand, from scratch:

| Calculation | My result | Pool claim | Match |
|---|---|---|---|
| 6 dB → power ratio | 10^(-0.6) = 0.2512 (~25%) | 25% | ✅ |
| −17 dBm → mW | 10^(-1.7) = 0.01995 mW (~20 µW) | ~20 µW | ✅ |
| Link budget: +3 − (−24) | 27 | 27 | ✅ |
| Link budget: +5 − (−22) | 27 | 27 | ✅ |
| Link budget: +3 − (−25) | 28 | 28 | ✅ |
| Worked example: fiber 25km×0.25 + splices 8×0.15 + connectors 6×0.30 + margin 3.00 | 6.25+1.20+1.80+3.00 = 12.25; headroom 27−12.25 | 12.25 total, 14.75 headroom | ✅ |
| Chromatic dispersion: 17×0.1×100 | 170 ps | 170 ps, correctly exceeds 100 ps bit period at 10 Gb/s | ✅ |
| DGD at 150 km: 0.8×√150 | 9.798 ps | 9.80 ps | ✅ |
| DGD at 300 km: 0.8×√300 | 13.856 ps (√2× the 150 km value, not 2×) | 13.86 ps, correctly illustrates √L scaling | ✅ |
| 40 Gb/s bit period: 1/(40×10⁹) | 25 ps | 25 ps | ✅ |
| Bidirectional OTDR average: (−0.2+0.4)/2 | 0.1 dB | 0.1 dB | ✅ |

**Every figure I independently recomputed matches exactly** — zero divergence from C2's re-derivation, and I didn't just re-run their numbers, I redid the math from the raw inputs each time.

## 3. Citation spot-checks (WebSearch, standards facts)

Spot-checked the highest-stakes non-arithmetic citations: ITU-T G.652.D attenuation limits (≤0.4 dB/km 1310–1625nm, ≤0.3 dB/km @ 1550nm), G.652 chromatic dispersion (~17 ps/(nm·km) @ 1550nm), and 7 CFR 1755.902's RUS fiber performance spec scope. All corroborate C1's `T02.md` table — no divergence found. Given the strength of C2's own independent re-derivation (their report shows real per-item work, not a rubber-stamp), and that my own arithmetic check (§2) already came back 100% clean, I did not exhaustively re-search every citation the way I did for T01/T18's regulatory content — T02 leans on physics/math (self-verifying) far more than contested regulatory text, which is a real difference in risk profile worth noting rather than applying uniform search-everything effort regardless of where the risk actually sits.

## 4. OS1/OS2 cross-lesson check — CEO's specific ask, PASS on the pools, but found a THIRD wrong instance in the prose

The CEO specifically asked C2 to verify T02-L08-Q3/T02-final-Q14 correctly use the T01-verified mapping (OS1 = G.652.A/B, OS2 = G.652.C/D) rather than repeating T02's own lesson JSX claim ("OS1 = G.652.B/C"). I confirmed this independently — **both pool questions are correct** and transparently cite the correction rather than silently overriding it.

**But I went one step further and grepped both topics' lesson JSX directly (not just the one file C1/C2's log names), and found the inconsistency is worse than logged:**

| Location | Claim | Correct? |
|---|---|---|
| `T02-L08.smf-vs-mmf-choosing.jsx:227` (live prose) | "OS1 — specified in ITU-T G.652.B/C" | ❌ Wrong (should be A/B) — **this is the one C1/C2 already flagged.** |
| `T01-L08.key-acronyms-field-reference.jsx:117` (live prose) | "OS1 maps to G.652.A/B/C" | ❌ **Also wrong** (should be A/B only — folding C into OS1 is the exact error the T01 pool's own `T01-L08-Q7` fix-pass corrected back in inc4, but the correction was never carried back into this lesson's own acronym-table prose). **Neither C1's T02.md nor C2's T02-redteam.md checked this file** — they compared T02's prose against T01's *pool* question (which is correct), not against T01's own *lesson* prose (which independently has a different wrong version of the same fact). |
| `T01-L08-Q7` (pool, already verified in my T01 audit) | "OS2 = G.652.C or D; OS1 = G.652.A/B" | ✅ Correct |
| `T02-L08-Q3` / `T02-final-Q14` (pool) | Uses the correct A/B vs C/D mapping | ✅ Correct |

**Net: two different lesson files carry two different wrong statements of the same fact in live prose, and both topics' pool questions independently landed on the correct answer without either surfacing that the *other* topic's lesson prose has its own version of the same error.** This isn't a new content-accuracy risk (the correct fact is well-established, verified three separate times across this and the T01 audit), but it's a real gap in the "flag, don't fix" tracking: a future prose-cleanup pass that only fixes what `T02.md` names (T02-L08's line) will leave T01-L08's independently-wrong line untouched, because no one's log currently names it.

**Recommend:** treat this as a 3rd O48-family item — route `T01-L08.key-acronyms-field-reference.jsx:117` to the same inc5-style prose-fix queue as the T01 JSX citations, alongside T02-L08's line. Both should get the same corrected text: "OS1 = ITU-T G.652.A/B (≤1.0 dB/km); OS2 = ITU-T G.652.C/D (≤0.4 dB/km)."

## 5. Gate integrity + pedagogy

- **Author ≠ RT:** confirmed via commit provenance (`integrate(inc7/C1)` → `integrate(inc7/C2)` clean pass, no fix-cycle commits needed — first topic to clear on the first red-team pass).
- **Citation-logging convention:** independently confirms the CEO's "log every citation upfront" process fix — read the full `T02.md` table plus a sample of ~15 uncited questions myself; every uncited one is genuinely self-verifying arithmetic or general physics reasoning, not a specific unlogged fact. Matches C2's "zero gate misses" claim.
- **Pedagogy spot-check:** read samples from L01 (TIR/Snell's law), L06 (link budget), L09 (PMD) directly — technically sound, unambiguous, well-scoped distractors.
- **SPA wiring:** not exhaustively re-verified this pass (already confirmed the pattern twice for T01/T18; no reason to expect T02 differs, and the `assessmentId` convention is enforced by the same `PooledAssessment` component all three topics share) — spot-checked 2 of 11 lesson files, both wired correctly.

## Verdict

**T02 (112Q): CLEARS THE GATE — cleanest of the three topics, zero pool-level findings, matches C2's PASS independently** (own arithmetic re-derivation, not just re-reading theirs, came back 100% clean). **One process finding**: the OS1/OS2 cross-lesson inconsistency the CEO asked C2 to check is real and correctly handled *in the pools*, but the underlying prose problem is bigger than tracked — a second wrong-in-a-different-way instance lives in `T01-L08`'s own lesson file, un-flagged by either topic's research log. Recommend folding `T01-L08.key-acronyms-field-reference.jsx:117` into the same prose-fix batch as the T02-L08 line and the O48 T01-prose items already queued.
