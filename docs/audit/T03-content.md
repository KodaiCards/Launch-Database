# T03 content audit — Cable Selection assessment pools (112Q)

> Auditor working report (fourth content audit, third D026 self-pick). Graded vs Opus baseline + `T01-content.md`/`T18-content.md`/`T02-content.md`, same rigor. Detail here; thread carries a short summary + pointer (D018).
> Scope: `content/training/assessment-pools/T03-L01..L11.json` + `T03-final.json` (112Q) + `_research/T03.md` + `_research/T03-redteam.md`, CEO branch `claude/ceo-fresh-instance-boot-u2zw28` @ AUDIT-READY commit `d6844aa7`. Author = C1, red-team = C2 (1 fix cycle: `T03-L05-Q8`/`T03-final-Q6` 30mm hedge + `T03-L03-Q6` NEC 770.179 citation backfill, both re-verified PASS). Method: real engine-loader run (not just reading the JSON), cross-check of every `citation` field in the pool against `_research/T03.md`'s log table (independent of the red-team's own completeness check), and — continuing the T18/T02 practice — independently grepped the T03 lesson JSX prose rather than trusting "flag, don't fix" claims at face value. Last updated 2026-07-02.

## Headline

**T03 does NOT clear the gate cleanly.** Two real findings, one of them new-in-kind (not a repeat of the O48/OS1-OS2 pattern):

1. **HIGH — internal self-contradiction in graded content (T03-L05 lesson prose).** The lesson's Advanced section asserts G.652.D's "minimum installation bend radius" is **~240 mm (9.5 in.)** for a typical 12 mm cable — directly contradicting the **~30 mm** figure used everywhere else in the *same lesson file* (5+ places) and in **two graded pool answer keys** (`T03-L05-Q8`, `T03-final-Q6`). The 240 mm figure is itself uncited and unlogged.
2. **MEDIUM — the D027 "log every citation" gate was only partially applied to T03.** The red-team's completeness check caught 2 gaps (both fixed). My own citation-by-citation cross-check found the pool actually uses **~9 more distinct citation sources with zero matching row in `_research/T03.md`** — FOA Reference Guide, TIA-598-D, UL 910/NFPA 262, general NEC Art. 770 (beyond 770.48(A)/770.179), CommScope ADSS-vs-Lashed docs, RUS Bulletin 1751F-630, ITU-T G.655, ITU-T G.656, and the outsideplantcabling.com/fibereast.com pairing. None of these are factually wrong on inspection (see §3), so this isn't a correctness blocker — but it means the gate rule Planning just blessed as D027 ("proven, misses 2→1→0") is not actually zero-miss on T03 the way T02 was; the red-team's check is narrower than a full diff against the log.

Everything else — structure, dial, arithmetic-adjacent figures, reused T01/T02 citations, drag-match/answer-key soundness — is clean.

---

## 1. Pool set — independent structural re-check (own tooling, real loader)

- Ran the actual `routes/_assessment_pools.js` loader (not a hand-parse) against all 12 T03 pool files. **Zero throws** — confirms structurally: no banned types, all `answerIndex` in range, all `drag-match` needs a `correctMap`, no duplicate ids within each pool, dial correct on every pool (11×8/draw4/pass70 lessons + 24/draw15/pass80 final = 112Q, matches the red-team's count).
- `node --test tests/assessment_engine.test.js` → **10/10 pass**, no regression.

## 2. HIGH finding — T03-L05 bend-radius self-contradiction

`osp-training/src/lessons/T03/L05.g652-vs-g657-bend-insensitive.jsx`:

- Lines 84, 113, 228, 372(partially — see below), 479: multiple places state or imply **G.652.D minimum bend radius ≈ 30 mm**. This is also the figure the pool's fix-pass hedged to (per `T03.md`'s fix-pass log and `T03-redteam.md`'s re-check) and is the basis for the correct-answer logic in **`T03-L05-Q8`** and **`T03-final-Q6`**.
- Line 372 (Advanced/"Going Deeper" section), verbatim: *"Standard G.652.D has a minimum installation bend radius of roughly **240 mm (9.5 inches)** for a typical 12 mm OSP cable."*

240 mm and 30 mm are an 8× discrepancy for the same fiber type in the same lesson file. There is a plausible technical reconciliation — L11 of the same topic (`L11.cable-spec-reading-datasheet.jsx:433`) explains cables carry *two different* bend-radius numbers: a looser "installation" figure (often expressed as a cable-OD multiplier, e.g. ~20×OD, which for a 12 mm cable is exactly 240 mm) versus a tighter fiber-spec "long-term" figure. If that's what line 372 means, it's conflating two different kinds of "minimum bend radius" (OD-multiplier field-installation rule vs. the ITU-T fiber-level spec number used everywhere else and in the graded questions) without ever saying so — no cross-reference to L11's distinction, no hedge, no qualifier. A learner reading L05 top-to-bottom hits a flat, unexplained contradiction on the exact number two graded questions test them on. And the 240 mm figure itself carries **no citation** and **no `_research/T03.md` row** — it's an uncited, unreconciled assertion in graded-adjacent lesson content.

**Not a pool/answer-key bug** (both graded questions correctly use ~30 mm, hedged appropriately per the fix-pass) — this is a **lesson-prose defect**, same class as the T01 O48 findings and the T01-L08 OS1/OS2 cross-topic miss I found in the T02 audit: something neither C1's research pass nor C2's red-team caught because both were scoped to the pool JSON, not the lesson JSX. Recommend folding into the next prose-fix pass (alongside T02-L08 OS1 and T04-L07 32.2230, both already tracked) — either delete/qualify line 372's 240 mm claim or explicitly cross-reference L11's installation-vs-long-term distinction so it doesn't read as contradicting the graded 30 mm figure.

## 3. MEDIUM finding — D027 citation-log completeness gap

I extracted every `citation` field across all 112 T03 pool questions (49 questions carry one) and diffed the distinct sources against `_research/T03.md`'s log table + fix-pass rows. The log covers 11 sources + 2 fix-pass items. Not covered by any log row, but present in `citation` fields:

| Citation string in pool | Used in | Verified? |
|---|---|---|
| FOA Reference Guide to OSP design | `T03-L01-Q1`, `T03-L08-Q1/Q8`, `T03-L11-Q1` | Not independently re-checked this pass; content is generic industry-guide framing, not a specific disputed figure — low risk |
| TIA-598-D | `T03-L01-Q2/Q4` | Same — generic fiber-color/ID-scheme standard reference, content matches well-established industry practice |
| NEC Art. 770 (general) + UL 910/NFPA 262 | `T03-L02-Q1/Q8`, `T03-L03-Q1`, `T03-L07-Q2` | UL 910/NFPA 262 are the correct plenum-cable flame-test standards (well-established, matches domain knowledge); general Art. 770 framing checks out |
| ICEA S-87-640 "armor options" (distinct from the log's tensile/temp rows) | `T03-L03-Q4`, `T03-L07-Q1`, `T03-final-Q4` | Content (armor-type tradeoffs) matches domain knowledge, not independently re-verified against primary text |
| CommScope ADSS vs. Lashed Fiber technical documentation | `T03-L04-Q1/Q4/Q8`, `T03-L07-Q3`, `T03-final-Q5/Q14` | Content is a qualitative engineering tradeoff (bonding, fiber count, span), not a disputed number — checked out on inspection |
| RUS Bulletin 1751F-630 | `T03-L04-Q4`, `T03-final-Q14` | **Checked specifically** given T01's inc5 was about this exact bulletin being misapplied — here it's cited only as generic background alongside the CommScope comparison, not asserting a specific bulletin provision; no misapplication found |
| ITU-T G.655, ITU-T G.656 | `T03-L05-Q2/Q6/Q7`, `T03-final-Q7` | Content (NZ-DSF / wideband use-case framing) matches domain knowledge, not independently re-verified this pass |
| outsideplantcabling.com / fibereast.com | `T03-L08-Q2` | Marked "verified via 2+ independent sources" inline in the citation field itself, just never promoted to a `T03.md` row |

None of these produced a factual error on inspection — this is a **process/gate-completeness finding, not a content-accuracy finding**. But it matters because Planning just blessed D027 on the strength of "misses 2→1→0 across T01→T18→T02," and the red-team's own completeness check (which is narrower — it flags *uncited* claims, not *cited-but-unlogged* ones) only caught 2 of the ~9 gaps here. Recommend the gate checklist explicitly require a mechanical diff (every distinct `citation` string ↔ a log row), not just a read-through, so this stops depending on catching it by eye each topic.

## 4. Reused-citation consistency (T01/T02 cross-checks)

- **OS1/OS2 → G.652 mapping** (`T03-final-Q16`): correctly reuses the T01-verified mapping (OS1=A/B, OS2=C/D) and traces to `T01.md` — confirmed `T01.md` line 47 is the actual origin of the ISO/IEC 11801 verification (not a phantom citation). Correct.
- **G.652.D MFD/attenuation, G.657 A1/A2/B3 bend radii (10/7.5/5 mm)**: consistent with T01/T02 figures throughout the pool. No drift found.

## 5. Fix-pass re-verification (the 3 items C2's re-check claims fixed)

Independently re-read the current pool state (not trusting the redteam log's "PASS" claim):

- `T03-L05-Q8` / `T03-final-Q6`: both now carry a `citation` field explicitly hedging the ~30 mm figure as industry-convention, matching the T01-L04-Q7 precedent. `answerIndex` unchanged. **Confirmed fixed** — but see §2, the pool-level fix doesn't reach the lesson-prose 240 mm contradiction.
- `T03-L03-Q6`: citation backfilled to NEC (NFPA 70) §770.179. **Confirmed present** in the current pool JSON and matches the claimed fix.

## 6. Verdict

**Do not treat T03 as a clean AUDIT PASS pending Planning's call on the two findings above.** Neither finding touches the answer-key integrity of the pool itself — both are contained (lesson prose only, and a paperwork/process gap respectively) — so this is not a "wrong grade" blocker, but the HIGH item is a real, graded-adjacent accuracy defect a learner will hit directly, in the same style as the O48 batch already queued for T01/T02/T04. Recommend folding the T03-L05:372 fix into that same prose-cleanup pass, and tightening the citation-log-completeness check (mechanical diff, not read-through) before the next topic's gate.
