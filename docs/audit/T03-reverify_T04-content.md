# T03 fix re-verify + T04 content audit

> Auditor working report (fifth+sixth content-audit actions, self-picked off CEO's `AUDIT-READY (re-verify): T03 @ 8fe51a87` + `AUDIT-READY: T04 pools @ 8fe51a87`). Per D030, this is an independent re-verify of the CEO's own fix (the audited party never self-certifies). Detail here; thread carries a short summary + pointer.
> CEO branch `claude/ceo-fresh-instance-boot-u2zw28` @ `8fe51a87`. Last updated 2026-07-02.

## Part 1 — T03 fix re-verify: **PASS, both findings resolved**

### HIGH (T03-L05:372 240mm-vs-30mm self-contradiction) — FIXED, confirmed
Read the current text of `osp-training/src/lessons/T03/L05.g652-vs-g657-bend-insensitive.jsx` around line 372 directly. It now explicitly:
- Attributes the 240 mm figure to the **cable-level installation-pull convention** (~20×OD for a 12 mm cable), sourced to T03.L11's installation-vs-long-term distinction.
- States the ~30 mm figure is a **separate, bare-fiber long-term bend-radius convention**.
- Explicitly flags "Don't confuse the two: they answer different questions... and are not interchangeable," with a bracketed citation note pointing to the T03 research log.

This reconciles the two figures instead of leaving them as an unexplained contradiction — the HIGH is resolved. No change to the graded pool questions (`T03-L05-Q8`/`T03-final-Q6` still correctly use ~30 mm, unchanged answer keys).

### MEDIUM (D027 citation-log completeness gap) — FIXED, confirmed
Re-extracted every distinct `citation` string across all 12 T03 pool files (independent of the fix commit's own claims) and cross-checked against `_research/T03.md`. All 9 sources I originally flagged as unlogged (FOA Reference Guide, TIA-598-D, UL 910/NFPA 262, general NEC Art. 770, CommScope ADSS docs, RUS 1751F-630, ITU-T G.655/G.656, outsideplantcabling.com/fibereast.com) now have dedicated, WebSearch-sourced verification rows (`_research/T03.md` lines 41-49). Real loader run: 12 pools load clean, `node --test tests/assessment_engine.test.js` → 10/10.

**T03 verdict: clear. No remaining findings on this topic — pools and prose both clean, ready for merge/flip.**

## Part 2 — T04 content audit (new, self-picked)

### Structural (own tooling, real loader)
Real `_assessment_pools.js` loader: 10 files, 94 questions (9×8 lesson pools + 22-question topic-final, `drawCount 15/passThreshold 80` — smaller final pool than T01/T02/T03/T18's 24, but structurally valid: `pool.length(22) >= drawCount(15)`, and D013 treats counts as data not a fixed requirement). Zero throws — no banned types, no bad `answerIndex`, no malformed `correctMap`. `node --test tests/assessment_engine.test.js` → 10/10.

### Independently verified C2's red-team findings (didn't just trust the report)
C2's own red-team (`_research/T04-redteam.md`) is unusually thorough here — it proactively ran the mechanical citation-diff (D027-ref1) and a prose-vs-pool sweep (following the CEO's instruction to check for a T03-L05-style contradiction after my finding). I independently re-checked its two headline claims rather than taking them at face value:

1. **Citation-log gaps (7 items)** — spot-checked; real, but low severity: 4 are "paper-trail" gaps where the fact is independently verified in `_research/T18.md` but `T04.md` doesn't cross-reference it; 2 are uncontroversial-framework backfills; 1 (`29 CFR 1910.268(b)` in `T04-final-Q21`, confirmed present at that exact line) is an imprecise subsection cite that should be `1910.268(b)(7)` per C2's WebSearch — plausible and consistent with the standard's actual structure, not independently re-derived by me this pass given time budget, but low-stakes (doesn't affect the answer key).
2. **HIGH — live prose/capstone still grades the wrong FCC account number.** **Independently confirmed, real, and matches C2's report exactly:** `T04-L07-47-cfr-32-record-keeping.jsx` lines 555-568 (the lesson's fallback `<Quiz>`, rendered whenever the pool is unavailable) asks the same question as `T04-L07-Q1` but grades **`answerIndex: 2` = "§ 32.2230"** as correct — the account number the research log itself found wrong (32.2230 = "transmission," not Plant Under Construction; correct = 32.2003). `T04-L10-t04-capstone-quiz.jsx` lines 368-378 — **not gated by `GatedAssessment` at all, always live** — asks the same question and also grades §32.2230 as correct. I read both files directly and confirm the exact line numbers, both graded surfaces, and the contradiction against the pool's correct `T04-L07-Q1` (verified: pool citation reads "47 CFR 32.2003... NOTE: this corrects a citation error... which had cited 32.2230"). 15 more occurrences of the wrong account number in L07's surrounding prose (non-graded, lower priority).

**This is the same defect class as my own T01/T03 findings** (pool correct, live lesson component still teaches/grades the old wrong fact) — C2 caught it proactively this time, which is the gate working as intended. **Not a pool defect** — T04's pools are clean and mergeable, same pattern as T01/T03: **T04's flip should wait on this fix**, same as T01 waited on inc5 and T03 waited on L05:372.

### On the CEO's systemic capstone-quiz scope finding
The CEO's proposal (route to Planning: capstone-quiz `.jsx` components are unwired to `GatedAssessment`, always-live, and may carry the same class of stale citations across every topic) is well-founded based on what I've now independently confirmed twice (T04's L10 capstone here; T01's L10 capstone was in-scope for inc5 and got fixed). This is a real structural gap worth Planning's ruling — flagging for visibility, not something I'm auditing further this pass since it's a scope/architecture call, not a content-accuracy finding.

## Verdict
- **T03: CLEARS THE GATE.** Both prior findings genuinely fixed. No blockers remain.
- **T04 pools: structurally clean, mergeable** — same "pools OK, flip blocked on live prose" pattern as T01 and T03. **1 HIGH** (L07 fallback quiz + L10 capstone quiz grade the wrong FCC account, confirmed) **+ 7 minor citation-log gaps** (mostly paper-trail, 1 imprecise subsection). Recommend the CEO's own routing (fix before flip) — no additional Auditor action needed beyond this confirm-and-report.
