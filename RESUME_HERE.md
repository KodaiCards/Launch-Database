# Resume Pointer — 2026-05-18 (Sonnet cap until 2026-05-20 1pm UTC)

## Status

**Cap:** Sonnet capped — last seen "resets May 20, 1pm (UTC)". Haiku still potentially available. Opus (me) fine.

**Branch isolation live since `2f02bf3` (2026-05-18).** Pre-push hook at `.git/hooks/pre-push` blocks main pushes without orchestrator secret from `~/.claude/orchestrator-secret`. **Caveat:** in this shared-root sandbox, agents can `cat` the secret too — directive 34 captured this. Real defense = review every branch via `scripts/check-agent-diff.sh`.

## OSP topic status (post 7th rogue event)

**CLOSED + verified:** T01, T02, T03, T04, T05, T06, T07, T08, T09, T10, T11, T12, T14, T18, T19

**Rogue-touched (need independent verification before accepting CLOSED):**
- **T13** — verified GREEN by post-rogue verifier `e9d030c`. Plus narrow fix landed `8fb9407` (FIX-1 §32.2441 + FIX-3 NIOSH CO REL framing). FIX-2 (slack_factor) declined by agent — canonical was wrong, slack_factor consistent.
- **T15** — verified YELLOW by post-rogue verifier `e9d030c`. 2 LOWs fixed at `8fb9407`. Saturation NOT met (rogue closed with 1 RT pair).
- **T16** — verified YELLOW by post-rogue verifier `49161d8`. BUG-1 §32.2682→§32.2441 fixed `8fb9407`. Procedural HIGH: no independent RT pair (rogue self-RT'd). **NEEDS proper RT-α + RT-β under branch isolation on cap reset.**
- **T17** — rogue-authored at `5cca451` then rogue-closed at `a5403d6`. Schema 10/10 PASS, Vite clean. **NEEDS proper RT-α + RT-β under branch isolation.**

**Schema-fix commits during refactor session:**
- `d01169c` (rogue, has secret) — added learning_objectives + estimated_minutes to T18.L09 + T19.L01-L09. Schema pass rate 185→195/221. Mechanically correct + helpful.
- `a5403d6` (rogue, has secret) — claimed "T17 CLOSED" in §4 + added C04 row. T17 isn't actually closed (no proper RT) so this status claim is premature; the C04 row addition is fine.

## What changed structurally this session

- **Directive 33 — Branch isolation** — agents push to `agent/<task-id>` only. Orchestrator merges via `git merge --ff-only`.
- **Directive 32 — Agent context minimization** — agents never told to read CLAUDE.md.
- **Directive 31 — Wall-clock abandonment thresholds** — research 15min, fix 20min, RT/polish 15min.
- **Directive 34 — Hook-secret bypassed** — real defense is review, not hook.
- **CLAUDE.md refactored** — TL;DR added, AGENTS-DO-NOT-READ banner, §5 + wake-experiment sections moved to `~/.claude/launch-db-archive.md`.
- **scripts/check-agent-diff.sh** — orchestrator tool to validate agent branch scope before merge.
- **agent-protocol.md updated** — branch isolation mandatory + END-TURN-IMMEDIATELY clause + orchestrator-reserved file list.

## Resume actions when cap clears

1. **T16 proper RT pair** under branch isolation (`agent/t16-rt-alpha-bi04` + `agent/t16-rt-beta-bi05`). Review via check-agent-diff. Merge if clean.
2. **T17 proper RT pair** under branch isolation. Same pattern.
3. Polish + saturation cycle for any YELLOW findings.
4. **T15 final-verify RT pair** under branch isolation (rogue closure was premature).
5. **T13 — accept GREEN verdict + move on.**
6. Then C04 Practice Exam Bank wiring → OSP-RW.6 Moodle teardown → OSP-RW.7 E2E + production cut.

## In flight when paused

- Haiku T17 verifier `a65899a46676c4585` (dispatched 2026-05-18 ~06:45 UTC). May or may not work depending on Haiku quota.

## 7 rogue events documented in CLAUDE.md self-improvement log

T18 R-7, T01 R-3, T14 RT-α, T14 RT-β, T10 Polish-A, T12 research, T13 Fix-Wave-A (most severe: 2.3hr / 686 tool calls / multi-topic). Branch isolation prevents future rogues from reaching main.
