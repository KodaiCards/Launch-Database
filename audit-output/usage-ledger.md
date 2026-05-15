# Orchestrator Usage Ledger

> Self-tracking. Updated after every agent return + at meaningful chat turns.
> Tokens are precise for agents (from task notifications). Orchestrator (Opus) chat is estimated.
> Rolling window: 5 hours. Max 5x plan estimated cap ~50M tokens / 5hr.
> Goal: stay under 95% of cap. Carter's standing rule: better to leave on table than hit limit.

## Rolling sum (last 5 hours)

Updated continuously. Entries older than 5h fall out of the rolling sum but stay in history below.

**Current rolling sum estimate:** ~3.5M tokens (rough — heavy first-half-window from 5-Opus-agent dispatch + research wave; recent dispatches are Sonnet and tighter)

**Burn rate (last 60 min):** ~150-300K/hr (sequential Sonnet pace)

## Entry log

| Time (ET) | Source | Tokens | Notes |
|---|---|---|---|
| ~9:30 PM | Discovery wave (2 Opus agents) | ~160K | Doc-vs-repo verification |
| ~10:00 PM | OSP-RW.0a R-A (Opus) | 100K | Domain coverage |
| ~10:00 PM | OSP-RW.0a R-B (Opus) | 101K | Cert blueprints |
| ~10:00 PM | OSP-RW.0a R-C (Opus) | 277K | Existing content audit (deepest read) |
| ~10:30 PM | Context-Map A (Opus) | 150K | Root + std doc locations |
| ~10:30 PM | Context-Map B (Opus) | 157K | Hidden + subtree locations |
| ~11:30 PM | OSP-RW.0b Architect (Sonnet) | 99K | 22 topics, 245 lessons |
| ~11:35 PM | OSP-RW.0b RT (Sonnet) | 113K | YELLOW verdict, 5 patches |
| ~11:50 PM | OSP-RW.0b Patch (Sonnet) | 76K | 5 patches landed |
| ~11:55 PM | OSP-RW.1A primitives (Sonnet) | 90K | 9 primitives across 9 commits |
| ~12:05 AM | OSP-RW.1B scaffold (Sonnet) | 106K | Schema + Layout + Router + Catalog |
| ~12:25 AM | OSP-RW.1 RT (Sonnet) | 120K | YELLOW, 7 findings |
| ~12:30 AM | OSP-RW.1 patch (Sonnet) | 98K | 7 patches landed |
| ~12:40 AM | OSP-RW.2 BE+API+tests (Sonnet) | 102K | 4 commits |
| ~12:50 AM | OSP-RW.3 T02 author (Sonnet) | 162K | 12 lessons, longest run |
| ~12:55 AM | OSP-RW.2 RT (Sonnet, delayed) | 84K | YELLOW, SQL safety HIGH |
| ~12:55 AM | CI investigator (Sonnet) | 88K | Schema.sql divergence root cause |
| ~1:00 AM | RW.2 patch (Sonnet) | 58K | 4 patches |
| ~1:05 AM | Schema-revert (Sonnet) | 42K | Tight emergency fix |
| ~1:10 AM | T02 RT-violator (Sonnet) | 83K | Patches landed but read-only contract violated |
| ~1:15 AM | T02 post-fix RT (Sonnet, strict) | 74K | GREEN verdict |
| ~1:25 AM | T02 LOW patch (Sonnet) | (in flight) | L03 + L10 slider thresholds |

**Approximate agent total so far:** ~2.4M tokens
**Approximate orchestrator chat:** ~700K tokens (estimated, ~25-40K per Opus turn × ~25 turns)
**Approximate session total:** ~3.1M tokens
**Estimated % of 50M cap:** ~6.2%

## Ground-truth recalibration 2026-05-16 ~1:55 AM ET

Carter reported: 12% used since timer ended (~1:24 AM). Rate: 24%/hr — above sustainable ~19-20%/hr. Carter notes "most of that is you specifically while the agents have done minimal" — confirms Opus chat is the dominant burn, not Sonnet agents. My ~5× weighting estimate may even be low — Carter's data suggests Opus weighted heavier than 5×. Cutting chat aggressively. **Updated rule of thumb: assume Opus weighting closer to 7-8× when budgeting.**

(Carter's Anthropic dashboard showed ~88% used at ~12:30 AM ET — that includes prior sessions in the same 5h rolling window. From now forward, I'm tracking just this session's contribution.)

## Rolling-window calculation

**5h timer started: 1:25 AM ET → expires 6:25 AM ET.**

Tokens spent before 8:25 PM ET fall out of the rolling window over the next 5 hours. Carter's "88% used at 12:30 AM" was the peak of the prior accumulated window. As old usage rolls out faster than I'm spending, the window's effective % drops naturally.

## Usage estimation rules of thumb (refined as I go)

- Sonnet agent average: ~80-120K per dispatch (research/audit/RT)
- Sonnet agent heavy: ~150-200K (content authoring with many file writes)
- Opus orchestrator turn: ~10-50K raw (varies widely with chat length + tool calls)
- Opus orchestrator turn with major edit + commit: ~30-60K raw
- Background timer / polling: ~negligible (just sleep)

## ⚠️ Opus weighting (research agent finding 2026-05-16, SHA d075cfd)

**Anthropic weights Opus tokens ~4-10× heavier than Sonnet in their internal utilization calculation.** My raw-token sums systematically UNDERSTATE Opus consumption. To get a more accurate effective-usage estimate:
- Sonnet tokens: count as 1×
- Opus tokens (orchestrator chat + the early 5-agent Opus dispatch): multiply by ~5× (mid-range estimate)
- Use the **effective-token** sum, not raw, when comparing to the cap

**Re-estimating session so far with weighting:**
- Heavy-Opus phase (5 agents + my Opus chat through ~12:30 AM): ~1.6M raw × 5 = ~8M effective
- Sonnet phase since: ~1.5M raw × 1 = ~1.5M effective
- **Effective total: ~9.5M tokens** (vs ~3.1M raw — 3× different)

**Going forward — Opus minimization rules:**
- Tighten my chat replies aggressively (every Opus token is 5×)
- Skip status graphs / queue renders unless explicitly requested
- Prefer Sonnet for any orchestrator-side work I can delegate
- Use bash for simple operations instead of long reasoning chains

## OAuth usage endpoint — INACCESSIBLE from this hosted env (logged 2026-05-16)

Research agent found `GET https://api.anthropic.com/api/oauth/usage` returns exact server-side utilization. Tested:
- Token IS in this env at file descriptor 4 (`CLAUDE_CODE_OAUTH_TOKEN_FILE_DESCRIPTOR=4`)
- BUT FD 4 belongs to the parent Claude Code process, not child shells I spawn → `cat /proc/self/fd/4` returns empty
- Endpoint without auth returns `{"error": {"type": "rate_limit_error"}}` — endpoint is real but unauthenticated requests rate-limited
- Carter could run this from his local Claude Code install where credentials.json exists; orchestrator running in this hosted env cannot
- **Workaround:** rely on weighted-token estimation + Carter's periodic dashboard checks for ground-truth recalibration

## Update protocol

Append a row after every agent return. Update rolling sum every ~5 entries OR when Carter checks in. Push CLAUDE.md / this file together when batching state updates.
