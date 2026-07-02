# T02 (Fiber Physics) assessment pools — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder). Author = C1 (author ≠ RT, per the gate). Scope: full T02 —
> all eleven lesson pools `T02-L01.json` … `T02-L11.json` **plus** `T02-final.json` (24Q topic
> final), red-teamed against `content/training/assessment-pools/_research/T02.md` (C1's research
> log). 112 questions total. This is C1's first pass under the post-T01/T18 process fix: log every
> citation used upfront, not just uncertain ones — one of this red-team's jobs is checking whether
> that fix actually produced a cleaner pass.

## Structural check (automated) — PASS

- **Banned types:** zero `fill-in-blank` or any type outside `mc`/`drag-match` across all 112
  questions.
- **`answerIndex` bounds:** valid on every `mc` question.
- **`drag-match` correctMap:** every key set matches `targets`, every value is a valid `items` id.
- **No duplicate question ids.**
- **Floors:** every lesson pool has 8 questions, `drawCount: 4`, `passThreshold: 70`,
  `kind: "lesson"`. `T02-final.json` has 24 questions, `drawCount: 15`, `passThreshold: 80`,
  `kind: "topic_final"` — matches the launch dial.

## Arithmetic re-derivation (T02 is physics-heavy — this is the main correctness surface)

Independently re-derived every numeric calculation in the pools by hand rather than trusting the
stated answer, since this course leans on math more than any regulatory citation:

- **dB/power-ratio conversions:** 6 dB → 25% power (10^-0.6 ≈ 0.25) ✓ (`T02-L05-Q1`,
  `T02-final-Q8`). -17 dBm → ~20 µW (10^-1.7 mW ≈ 0.02 mW) ✓ (`T02-L05-Q4`). 10 dB → exactly 1/10
  ✓ (`T02-L05-Q8`).
- **Link budget subtraction:** +3-(-24)=27 ✓, +5-(-22)=27 ✓, +3-(-25)=28 ✓ (`T02-L05-Q2/Q7`,
  `T02-L06-Q3`). Worked example (Tx=+5, Rx=-22, fiber 25km×0.25=6.25, splices 8×0.15=1.20,
  connectors 6×0.30=1.80, margin 3.00 → total 12.25, headroom 27−12.25=**14.75 dB**) ✓ — checked
  independently and consistent everywhere it recurs (`T02-L06-Q1/Q4/Q7`, `T02-final-Q9`).
- **Chromatic dispersion:** ΔT = D×Δλ×L = 17×0.1×100 = **170 ps** ✓, correctly flagged as
  exceeding the 100 ps (10 Gb/s) bit period (`T02-L03-Q3/Q8`, `T02-final-Q3`).
- **PMD/DGD:** DGD_rms = 0.8×√150 = 0.8×12.247 = **9.80 ps** ✓ (`T02-L09-Q2`, `T02-final-Q16`).
  DGD at 300 km = 0.8×√300 = 13.86 ps ≈ 9.8×√2 (1.41×, not 2×) ✓ — correctly illustrates sqrt(L)
  scaling, not linear (`T02-L09-Q6`). 40 Gb/s bit period = 1/(40×10⁹) = **25 ps** ✓
  (`T02-L09-Q3/Q5`).
- **Bidirectional OTDR averaging:** (-0.2 + 0.4)/2 = **0.1 dB** ✓ (`T02-L10-Q2/Q7`).

Every calculation checked out. No arithmetic errors found anywhere in the 112 questions.

## The OS1/OS2 cross-lesson content-accuracy check (specific CEO ask) — PASS

`T02-L08-Q3` and `T02-final-Q14` both correctly use the T01-verified mapping (OS1 = G.652.A/B,
OS2 = G.652.C/D) rather than the T02 lesson JSX's own inline claim of "OS1 = G.652.B/C." Both
questions explicitly state in their `citation` field that this corrects/differs from the lesson's
own prose and point to the T01/T02 research logs — the flag-don't-fix discipline the CEO's
dispatch specified is followed correctly. Matches my own domain knowledge of the ISO/IEC 11801
category mapping. **Confirmed: the pool is right, and the correction is transparently logged
rather than silently substituted.**

## Answer-key / ambiguity / leading-stem check — PASS

Read every question stem, choice set, and explanation. No double-correct answers, no ambiguous
stems, no leading language. Physics reasoning throughout is technically sound and consistent with
my own domain knowledge (TIR/Snell's law, modal vs. chromatic vs. polarization-mode dispersion,
macrobend-vs-microbend OTDR signatures, WDM channel spacing and laser-stability tradeoffs, MFD
mismatch loss on mixed fiber-type splices).

## Citation completeness — light, self-hedged gaps only (no genuine gate misses)

Roughly 70 of 112 questions carry no `citation` field. This is expected and appropriate for a
physics-heavy topic: the research log states upfront that self-verifying arithmetic (dB math,
link-budget subtraction, DGD calculations) and general conceptual physics reasoning (why TIR
happens, what modal dispersion is, why dB is additive) are treated as self-evident rather than
citation-requiring — the same tier T01/T18 used for general professional knowledge. Read every
uncited question individually; none of them assert a specific external fact/number that should
have needed sourcing and didn't.

**The "log every citation upfront" process fix visibly worked.** Unlike T01 (2 zero-citation
gate misses) and T18 (1 zero-citation gate miss + 9 unlogged-but-cited paper-trail gaps), T02 has
**zero** questions that assert a specific external fact with no citation and no log coverage.

Two trivially light items worth noting, neither rising to a "fix before flip" bar:

- **`T02-L07-Q1`/`Q6`** cite ITU-T G.984 (GPON wavelength plan) — G.984 doesn't have its own row
  in `T02.md` (it was verified in `T01.md`'s context, for a different specific claim — splitter
  insertion loss, not the downstream/upstream wavelength-plan fact T02 uses it for). The
  downstream=1490/upstream=1310 wavelength-plan fact is standard, well-known GPON knowledge I can
  independently corroborate — not flagged as a correctness concern, just noting the citation
  wasn't run through T02's own verification pass.
- **`T02-L11-Q8`, `T02-final-Q23`** cite IEC 61300-3-35 (connector end-face inspection) — not in
  `T02.md`'s table, but both instances **self-hedge in their own citation field** ("edition not
  independently pinned down... UNVERIFIED-EXACT for the specific revision"), which is the correct
  behavior for an unconfirmed specific — no separate log row needed since the question itself
  doesn't over-assert.

## UNVERIFIED-EXACT hedge check — PASS

`T02-L02-Q6` (TIA-568.3-D connector loss, no pinned edition) and the two IEC 61300-3-35 instances
above correctly hedge rather than assert an unconfirmed specific as settled fact. No question in
any of the 12 pools asserts an UNVERIFIED-EXACT item as fact.

## Verdict

**PASS — cleanest pass of the three topics red-teamed so far.** 112 of 112 questions are sound:
correct arithmetic (independently re-derived), correct physics reasoning, no ambiguity, no banned
types, structurally valid, properly cited where citation applies, and correctly hedged where a
specific detail couldn't be pinned down. The cross-lesson OS1/OS2 content-accuracy check the CEO
specifically asked about is confirmed correct and transparently flagged, not silently patched.

**Recommendation:** no fixes required. T02 is **AUDIT-READY** as authored. The two light citation
items noted above (G.984 reuse, IEC 61300-3-35 self-hedged) are optional polish, not gate blockers
— flagging them for completeness, not requesting a fix-and-re-RT cycle. Worth carrying forward:
the "log every citation upfront" instruction from the T01/T18 fix passes measurably worked here —
recommend keeping it as standard practice for future topic authoring.
