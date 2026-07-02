# T03 (Cable Selection) assessment pools — independent red-team report

> Red-teamer: C2 (Sonnet-5 builder). Author = C1 (author ≠ RT, per the gate). Scope: full T03 —
> all eleven lesson pools `T03-L01.json` … `T03-L11.json` **plus** `T03-final.json` (24Q topic
> final), red-teamed against `content/training/assessment-pools/_research/T03.md`. 112 questions
> total.

## Structural check (automated) — PASS

- **Banned types:** zero `fill-in-blank` or any type outside `mc`/`drag-match` across all 112
  questions.
- **`answerIndex` bounds / `drag-match` correctMap:** all valid, no orphan/missing mappings.
- **No duplicate question ids.**
- **Floors:** every lesson pool has 8 questions, `drawCount: 4`, `passThreshold: 70`. Final has
  24 questions, `drawCount: 15`, `passThreshold: 80`. Matches the launch dial.

## Arithmetic re-derivation — PASS

T03 has less math than T02 but still carries real calculations (ice-load, sag scaling, attenuation
planning, tolerance-window arithmetic). Independently re-derived each:

- Ice load: w_ice = 1.244 × 0.50 × (0.71+0.50) = 1.244 × 0.50 × 1.21 ≈ **0.752 lb/ft** ✓
  (`T03-L09-Q2`) — correctly hedges the K constant as UNVERIFIED-EXACT across NESC editions.
- Sag ∝ L²: doubling span (150→300 ft) → **4× sag**, verified both directions (`T03-L09-Q4/Q6`,
  `T03-final-Q13`).
- Attenuation planning: 0.25 + 0.04 = **0.29 dB/km** (spec-max + aging factor) ✓ (`T03-L11-Q1`,
  `T03-final-Q10`).
- Tolerance windows: 250±15 → 235–265 µm, 242 µm conforms ✓ (`T03-L10-Q5`). 9.2±0.4 (8.8–9.6) is
  fully inside 9.2±0.5 (8.7–9.7) ✓ (`T03-L11-Q2`).
- Fiber-count math: 48 units × 2 fibers = **96 raw fibers** ✓ (`T03-L08-Q4`, `T03-final-Q20`).

No arithmetic errors found.

## UNVERIFIED-EXACT hedge check (CEO's specific ask re: the 2 flagged items) — PASS

Both items the CEO flagged from `T03.md` are correctly hedged in the pool, not asserted as fact:

- **ADSS EDS/RTS percentage** (`T03-L04-Q2`): explanation explicitly states "the exact percentage
  range cited across vendor sources varies (this session found different figures... e.g. 16-25% vs
  20-25%) — always confirm against the specific cable manufacturer's current technical bulletin
  rather than a memorized number." The question tests the qualitative relationship (higher EDS/RTS
  → more vibration-fatigue risk → dampers more likely), not the disputed number itself. **Correctly
  hedged.**
- **ICEA S-87-640 tensile rating** (`T03-L10-Q2`, echoed `T03-L10-Q8`): citation field explicitly
  states "exact figure sourced from secondary/vendor technical literature this session, not
  independently confirmed against the paywalled primary standard text; treat as UNVERIFIED-EXACT."
  **Correctly hedged**, consistent with T01's identical treatment of an ICEA-derived figure.

## Reused T01/T02 citation consistency (CEO's other specific ask) — PASS

Cross-checked every reused fact against its origin:

- **G.652.D MFD/attenuation, G.657 A1/A2/B3 bend radii (10/7.5/5 mm):** identical figures used
  throughout T03 as verified in T01/T02 — no drift.
- **OS1/OS2 mapping:** `T03-final-Q16` explicitly reuses the T01-verified mapping (OS1=A/B,
  OS2=C/D) and — notably — turns the cross-lesson inconsistency itself into a teaching point about
  why independent citation-checking matters, rather than just quietly reusing the correct number.
  Good practice.
- **ICEA S-87-640 scope, 7 CFR 1755.902 general scope:** consistent framing with T01/T02 wherever
  reused (armor options, tensile rating, MFD default, cable construction).

No inconsistencies found between T03's reuse and the T01/T02 originals.

## Citation completeness — 1 genuine gap, 1 minor secondary note

- **`T03-L05-Q8`** asserts a specific unverified fact with **zero citation and zero log coverage**:
  "G.652.D's standard minimum installation bend radius is around 30 mm." This number is presented
  as the correct answer's basis and reused as a wrong-choice detail in `T03-final-Q6` ("G.652.D
  (30mm)"). Neither the pool citation field nor `T03.md` sources this figure — it's the same
  R18-pattern gate miss found once each in T01, T18, and now here (T02 was clean of this specific
  failure mode). The figure itself is a widely-cited industry number I can corroborate from general
  domain knowledge, but that's exactly the gate's point: it needs a source, not memory.
  **Recommend:** source against a vendor/FOA-style reference (the same class of source already used
  for T02's bend-radius citations) or hedge as an approximate industry figure, matching the pattern
  used elsewhere in this same lesson.
- **`T03-L03-Q6`** cites a specific NEC subsection ("NEC 770.179(B)") for interlocked armor's fire
  listing, but only inside the explanation prose (no formal `citation` field) and not logged in
  `T03.md`. Lower severity than the L05 item — it's phrased with "e.g." (illustrative, not asserted
  as confirmed), but still worth a log row or removing the specific subsection number if it wasn't
  independently verified.

Everything else — the roughly 60 uncited questions — is general OSP-engineering reasoning
(tradeoff explanations, definitional questions, "why does X follow from Y" reasoning) at the same
exemption tier established in T01/T02/T18, read individually to confirm none assert an unverified
specific.

## Answer-key / ambiguity / leading-stem check — PASS

Read every question stem, choice set, and explanation. No double-correct answers, no ambiguous
stems, no leading language. Materials-science and mechanical reasoning (CST vs. CAT corrosion
tradeoffs, armor bonding requirements, fire-rating substitution hierarchy, loose-tube vs.
tight-buffer vs. ribbon tradeoffs) is technically sound and consistent with my own domain
knowledge.

## Verdict

**FINDINGS — not a clean PASS, not BLOCKED, but very close.** 111 of 112 questions are sound.
One question (`T03-L05-Q8`) asserts a specific unverified number with zero citation and zero log
coverage — the recurring R18-pattern failure mode, now seen once each in T01/T18/T03. One minor
secondary item (`T03-L03-Q6`'s unlogged NEC subsection in explanation prose) is lower-severity but
worth a quick fix or log backfill. Both of the CEO's specific verification asks — the 2 hedged
UNVERIFIED-EXACT items, and reused-citation consistency across T01/T02/T03 — check out clean.

**Recommendation:** fix `T03-L05-Q8` (source the 30mm figure or hedge it, matching the lesson's
own established pattern) and either log or soften the `T03-L03-Q6` NEC subsection reference.
Everything else clears the gate as-is.

---

## Re-check — 2026-07-02

C1's fix is on the CEO branch. Re-verified the 3 flagged items:

- **`T03-L05-Q8`** — now hedged as an industry-convention ~30mm figure (not pinned to a single
  ITU-T G.652.D clause), consistent with the same hedge pattern used for T01's bend-radius
  questions. Citation field explicitly flags it as unverified-exact. `answerIndex` unchanged.
- **`T03-final-Q6`** — the aligned distractor now reflects the same ~30mm industry-convention
  framing for G.652.D, consistent with L05-Q8. `answerIndex` unchanged.
- **`T03-L03-Q6`** — citation backfilled to NEC (NFPA 70) Section 770.179 (optical fiber cable
  type markings/listing requirements). Resolves the previously-unlogged NEC subsection reference.

**Verdict: PASS.** All 3 items resolve; no regressions found in the surrounding pool content.
Full T03 set (112Q) is gate-clean → AUDIT-READY.
