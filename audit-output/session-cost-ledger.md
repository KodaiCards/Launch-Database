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
