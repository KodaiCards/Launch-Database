# Session Cost Ledger — append-only

> Token accounting per agent dispatch. Cheap to read, never rewritten — only appended.
> Each row: `[HH:MM TZ] <agent description> <model> <total_tokens> <duration_s> <SHA-if-pushed>`

---

## 2026-05-16 session

### Retroactive audit waves (this session)

T01 (audit + fix done earlier — token totals not retroactively recovered)
T04 (audit + fix done earlier — ~400-500K range)
T19 (audit + RT + fix done earlier — ~600K total)

### T05 retroactive — full pipeline tally

- R-1 primary-skeptical: Sonnet, 70K, audit
- R-2 corroboration-adversarial: Sonnet, 161K, audit
- R-3 alt-secondary triangulation: Sonnet, 130K, audit
- Build fix-agent: Sonnet, 157K, 13 canonical findings applied
- Post-fix RT (single combined, in hindsight wrong): Sonnet, 118K, caught 3 bugs
- Surgical patch wave 1: Sonnet, 83K, 3 fixes
- Post-patch RT-A pedagogy: Sonnet, 118K, 4 new bugs
- Post-patch RT-B technical: Sonnet, 162K, 1 severity upgrade + 2 LOWs
- Surgical patch wave 2: Sonnet, 157K, 5 fixes
- Polish patch: Sonnet, 127K, P8 + P4 + NB-2 + L10 prereq verification
- Final-verify RT-A pedagogy: Sonnet, 131K, 4 new LOWs
- Final-verify RT-B technical: Sonnet, 143K, 1 new LOW + 5 CONCUR
- Polish-2 patch: Sonnet, 125K, 5 fixes + 1 neighborhood-flagged
- T05 polish-3 + final-verify-2 RT pair: pending

**T05 running total: ~1.68M Sonnet** (~$5 if Sonnet is ~$3/M)

### T18 retroactive — audit phase

- R-1 primary-skeptical: Sonnet, 74K
- R-2 corroboration-adversarial: Sonnet, 166K, 3 HIGH (methane + nitrogen + H2S IDLH) + 4 MED
- R-3 alt-secondary triangulation: Sonnet, 133K, 1 new MED + 1 LOW; CONCUR all prior
- R-4 deep adversarial / incident-investigation: Sonnet, 139K, 1 new HIGH (LOTO entry-gate) + 2 MED
- R-5 training-program / CBA: Sonnet, 70K, 3 new MED + 2 LOW
- R-6 legal/liability / plaintiff's-counsel: Sonnet, 166K, 4 new MED + 2 LOW; HIGH pool saturated
- R-7 field-crew worker perspective: Sonnet, IN FLIGHT

**T18 audit running total: ~748K Sonnet** (R-7 pending)

### Orchestrator (Opus) overhead

Estimated several million Opus tokens from chat + file edits + tool calls across the session. Not precisely tracked. Carter flagged 17%/45min burn as slightly high at one mid-session check.

### Session total burn estimate

T05 (~1.68M) + T18 audit (~750K) + earlier T01/T04/T19 (~1.5M est) + Opus orchestrator (~2-3M est) = ~6M+ tokens this session.

---

## Append-only — newer entries below this line

### T18 continuation (2026-05-16 night, post-sleep-mode dispatches)

- R-7 field-crew worker perspective: Sonnet, **rogue scope** ~1.6M tokens / 27 min / 141 tool calls — audit + canonical + 7 fix commits (scope violation, work correct, accepted)
- Verify RT-C pedagogy: Sonnet, 147K, 28/30 VERIFIED + 4 new gaps (1 MED + 3 LOW), YELLOW
- Verify RT-D technical: Sonnet, 159K, 24 derivations clean + RT-C reconciliation (1 false positive caught), GREEN with 2 new LOWs
- Haiku Gap-2 ground-truth (PPE Flashcard exists?): Haiku, 81K, 9.8 sec — RT-D correct, RT-C false positive
- Polish stage 1: Sonnet, 98K, 4 items applied (Gap-1 + Gap-D1 + Gap-D2 + C-19)
- Final-verify RT-E pedagogy: Sonnet, 120K, GREEN with 3 new LOWs
- Final-verify RT-F technical: Sonnet, 149K, GREEN with 2 new LOWs + 3 RT-E CONCUR
- Polish stage 2: Sonnet, 112K, 5 LOWs applied (introduced Z359.4 citation regression — caught next round)
- Final-verify-2 RT-G pedagogy: Sonnet, 109K, YELLOW — caught Z359.4 regression
- Final-verify-2 RT-H technical: Sonnet, 132K, YELLOW — independently confirmed Z359.4 regression + verified 15/16 citations against primary sources

**T18 audit + RT + polish running total: ~2.75M Sonnet + ~80K Haiku** = ~2.83M for T18 alone (plus the rogue R-7 1.6M = ~4.43M true total for T18)

### T05 continuation (2026-05-16 night)

- Post-fix RT pair (RT-A pedagogy `fd7375b` + RT-B technical `4fb8db8`): Sonnet, ~280K, 4 new bugs + Q12 escalation
- Surgical patch wave 2: Sonnet, ~157K, 5 fixes
- Polish patch: Sonnet, ~127K, P8 + P4 + NB-2 + L10 prereq verification
- Final-verify RT-A: Sonnet, 131K, 4 new LOWs
- Final-verify RT-B: Sonnet, 143K, 1 new LOW + 5 CONCUR
- Polish-2 patch: Sonnet, 125K, 5 fixes + 1 neighborhood flag

**T05 running total: ~1.93M Sonnet** (polish-3 + final-verify-2 RT pair still pending)

### Session grand total (2026-05-16, evening + overnight)

- T18 retroactive: ~4.43M (incl rogue R-7 + 11 verification passes)
- T05 retroactive: ~1.93M
- T19 retroactive (earlier): ~600K
- T04 retroactive (earlier): ~500K
- T01 retroactive (earlier): ~400K
- Opus orchestrator (chat + file edits + tool calls): ~3-5M estimated
- Haiku ground-truth dispatches: ~150K total

**Total session burn estimate: ~11-13M tokens** (multi-cap-reset session)

### Notes on burn analysis

- T18 was disproportionately expensive (~4.4M) because:
  - 7-round audit phase (Carter's saturation rule applied to safety-critical topic)
  - Rogue R-7 agent that applied fixes during what should have been read-only audit (1.6M wasted on scope-violation)
  - 4 verification rounds (RT-C/D, RT-E/F, RT-G/H) post-fix to catch polish-introduced regressions (Z359.4)
- T05 (~1.93M) was reasonable for the scope (15 lessons + 3 cross-topic files + L15 capstone authoring + 13 canonical findings + multiple polish iterations)
- Saturation rule cost is amortized over real bugs caught: 4 HIGH safety bugs (methane×2, H2S IDLH, LOTO) + 1 polish-introduced regression (Z359.4) — all would have shipped under the old single-RT pipeline

