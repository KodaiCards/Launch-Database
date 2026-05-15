# Claude Max 5x — Usage Cap Research

## Stack snapshot (≤80 words)

Claude Max 5x ($100/mo) has **two independent limit layers**: a 5-hour rolling window and a weekly rolling window (added August 2025). Anthropic never publishes token counts; caps are framed as "usage hours." Community consensus on the 5-hour token figure (~88K tokens) is a multiply of an unverified Pro baseline. The real-time measurement situation is better than expected: an undocumented OAuth endpoint exists and returns exact utilization percentages. Confidence: medium-high on weekly hours (Anthropic-sourced via TechCrunch), low on raw token counts.

---

## Best-known cap (with sources)

### 5-hour rolling window

Anthropic officially describes this limit only as "5x Pro usage" — no published token count. Community-derived estimates (cited by multiple third-party blogs but not independently verified by Anthropic):

- **Pro baseline**: ~44,000 tokens per 5-hour window (unverified community estimate)
- **Max 5x ($100/mo)**: ~88,000 tokens per 5-hour window (community estimate = 5× Pro)
- **Max 20x ($200/mo)**: ~220,000 tokens per 5-hour window (community estimate = 5× Max 5x)

**Important caveat**: Anthropic explicitly states limits vary with model choice, conversation length, attachments, and current demand. These token numbers are not hard floors — they are approximations that degrade significantly with Opus usage, large files, tool calls, or high-demand periods.

As of ~March–May 2026, Anthropic doubled the 5-hour rate limits for Pro, Max, and Team plans (original announcement via claudefa.st and confirmed by Appwrite/XDA). The doubling did NOT increase weekly limits.

### Weekly rolling window (added August 28, 2025)

Anthropic provided **official approximate ranges** (via TechCrunch, July 28 2025):

| Plan | Weekly Sonnet 4 | Weekly Opus 4 |
|---|---|---|
| Pro ($20/mo) | 40–80 hours | N/A stated |
| Max 5x ($100/mo) | **140–280 hours** | **15–35 hours** |
| Max 20x ($200/mo) | 240–480 hours | 24–40 hours |

These are "usage hours" — a proxy for compute time, not raw token counts. There is no official token-count translation. The weekly window is a 7-day rolling window (not calendar-week reset). Two separate weekly buckets exist: `seven_day` (overall) and model-specific `seven_day_opus` / `seven_day_sonnet`.

**Sources**:
- TechCrunch (July 28, 2025): https://techcrunch.com/2025/07/28/anthropic-unveils-new-rate-limits-to-curb-claude-code-power-users/
- Anthropic Help Center (usage/length limits): https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work
- Anthropic Help Center (extra usage): https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans
- IntuitionLabs community summary: https://intuitionlabs.ai/articles/claude-max-plan-pricing-usage-limits
- Faros.ai engineering guide: https://www.faros.ai/blog/claude-code-token-limits

---

## 5-hour window mechanics (with sources)

**What it is**: A rolling window — not a fixed hourly reset. The 5-hour clock starts from the **first message of the session**, not at a clock boundary.

**What gets counted**: Tokens weighted by model. Opus consumption drains the budget ~4–10× faster than Sonnet for equivalent output because Anthropic weights usage by compute cost, not raw token count. The limit is measured in compute-weighted "usage units," not raw tokens. This is why the cap behaves unpredictably — a single long Opus turn can consume a disproportionate share.

**Granularity**: Rolling per-minute internally (Anthropic uses a token-bucket algorithm for API rate limits; the same continuous-replenishment model applies to Claude Code's unified limit). It does NOT reset at a fixed clock interval — the utilization percentage drains over time and refills as the 5-hour window slides forward.

**Model separation**: There is NO per-model 5-hour cap. It's one shared `five_hour` bucket. However, there ARE separate weekly buckets per model (`seven_day_opus`, `seven_day_sonnet`).

**Peak-hour restrictions**: As of March–May 2026, Anthropic removed peak-hour restrictions for Pro and Max plans (previously 8am–8pm PT slots had reduced throughput).

**Sources**:
- Claude Code SDK issue #50518 (bucket names confirmed): https://github.com/anthropics/claude-code/issues/50518
- Anthropic rate limits docs (token-bucket algorithm): https://platform.claude.com/docs/en/api/rate-limits
- Doubling announcement: https://claudefa.st/blog/guide/development/higher-usage-limits
- XDA Developers coverage: https://www.xda-developers.com/anthropic-is-doubling-claude-codes-hourly-rate-limits-removing-peak-hours-andworking-with-spacex/

---

## Real-time usage measurement options

### Option 1: Undocumented OAuth endpoint (best available, UNOFFICIAL)

**Endpoint**: `GET https://api.anthropic.com/api/oauth/usage`

**Authentication**: Bearer token from `~/.claude/.credentials.json` → field `claudeAiOauth.accessToken`, plus header `anthropic-beta: oauth-2025-04-20`

**Response format**:
```json
{
  "five_hour": {
    "utilization": 37.0,
    "resets_at": "2026-02-08T04:59:59Z"
  },
  "seven_day": {
    "utilization": 26.0,
    "resets_at": "2026-02-12T14:59:59Z"
  }
}
```

Utilization is a percentage (0–100). Reset timestamps are ISO 8601. Multiple Claude Code windows share a cache of this at `~/.claude/usage-exact.json` (60-second TTL).

**Accuracy**: Returns exact server-side percentages — not estimated from local JSONL counts. This is the same data the Claude Code status bar displays. No ±15% error.

**Risk**: Undocumented. Could change without notice. Discovered by community reverse-engineering.

**Sources**:
- ohugonnot/claude-code-statusline (implementation): https://github.com/ohugonnot/claude-code-statusline
- jtbr GitHub gist (full guide with auth): https://gist.github.com/jtbr/4f99671d1cee06b44106456958caba8b
- Claude Usage menu bar app: https://bishojbk.github.io/claude-usage/

### Option 2: `anthropic-ratelimit-unified-*` response headers (official, per-request)

On every API call Claude Code makes to `api.anthropic.com/v1/messages`, Anthropic returns rate-limit headers. For Max/Pro subscribers using the OAuth (Claude.ai) route, these include unified utilization headers:

- `anthropic-ratelimit-unified-5h-utilization` — 5-hour window utilization (decimal 0.0–1.0)
- `anthropic-ratelimit-unified-7d-utilization` — weekly utilization
- `anthropic-ratelimit-unified-representative-claim` — which bucket is most constrained
- Reset timestamps per bucket

The SDK caches these internally (module-local cache in the Claude Code binary) and exposes them via the `statusLine` command in the TUI. **The problem**: in headless/SDK mode (how the orchestrator runs), these values are only surfaced when a bucket crosses a warning threshold — normal-operation calls don't expose the full utilization snapshot to the caller.

**GitHub issue #50518** proposes exposing full per-bucket snapshots to headless SDK consumers. As of May 2026, this is NOT yet implemented in the official SDK.

**Sources**:
- SDK issue #50518: https://github.com/anthropics/claude-code/issues/50518
- Rate limits docs (header list): https://platform.claude.com/docs/en/api/rate-limits
- openclaw issue #56047: https://github.com/openclaw/openclaw/issues/56047

### Option 3: Local JSONL parsing (self-tracked, no server contact)

Claude Code writes every session turn to `~/.claude/projects/<url-encoded-path>/sessions/<uuid>.jsonl`. Each assistant message contains:

```json
{
  "message": {
    "usage": {
      "input_tokens": ...,
      "output_tokens": ...,
      "cache_creation_input_tokens": ...,
      "cache_read_input_tokens": ...
    }
  }
}
```

This gives exact per-turn token counts. Tools like `ccusage` (https://github.com/ryoppippi/ccusage) and `Claude-Code-Usage-Monitor` (https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor) aggregate these to estimate session totals and burn rate.

**Accuracy problem**: Local token counts don't map cleanly to Anthropic's compute-weighted utilization. A session that consumed 80,000 raw tokens might show 40% or 90% utilization depending on model mix. The ±15% error the orchestrator currently experiences comes from exactly this gap.

### Option 4: `claude auth status --json` + `stats-cache.json`

`claude auth status --json` returns subscription type only — no usage numbers.

`~/.claude/stats-cache.json` stores client-side daily token totals — not server-side limit utilization. Not actionable for limit-awareness.

### Option 5: Official Usage & Cost Admin API (NOT applicable here)

`/v1/organizations/usage_report/messages` requires an Admin API key (org-level, not personal subscription). It provides historical data with ~5-minute delay, in configurable time buckets (1m minimum). This is for API customers with org accounts — not for Claude Code Max subscribers. Not useful for the orchestrator's self-tracking use case.

---

## Recommendations for orchestrator self-tracking

### 1. Poll the undocumented OAuth endpoint at session start and every 30 minutes

```bash
TOKEN=$(cat ~/.claude/.credentials.json | python3 -c "import sys,json; print(json.load(sys.stdin)['claudeAiOauth']['accessToken'])")
curl -s -H "Authorization: Bearer $TOKEN" \
     -H "anthropic-beta: oauth-2025-04-20" \
     https://api.anthropic.com/api/oauth/usage
```

This returns server-side exact percentages with reset timestamps. Cache result for 60 seconds (same TTL Claude Code itself uses). Poll at wave start, before major dispatches, and at any `rate_limit_event` notification. This eliminates the ±15% estimation error entirely.

**Caveat**: Bake in a fallback to local-JSONL estimation if the endpoint returns non-200, since it's undocumented and could change.

### 2. Parse `anthropic-ratelimit-unified-*` headers when available

When an agent reports a 429 or a rate-limit warning, the full header set is available in the response. Extract `utilization` from `anthropic-ratelimit-unified-5h-utilization` and the reset timestamp. This is the canonical signal — it's what triggered the limit.

For normal-operation, these headers won't contain utilization until threshold is crossed (per SDK issue #50518). So you can't rely on them proactively — but they're authoritative reactively.

### 3. Track compute-weighted burn rate, not raw tokens

Because Anthropic weights Opus ~4–10× heavier than Sonnet, a token-count model will systematically underestimate remaining capacity when using Opus. The orchestrator should track **model-weighted** consumption: weight each Opus turn at 5× its raw tokens when estimating against the cap, or rely entirely on method 1 (which reflects actual server-side weighted consumption).

### 4. Budget the weekly cap explicitly

Max 5x has 140–280 hours of Sonnet and 15–35 hours of Opus per week. At current Claude Code usage patterns (heavy agentic workloads), weekly limits hit before 5-hour limits for sustained daily work. The orchestrator should surface weekly utilization (the `seven_day` field from the OAuth endpoint) alongside session utilization, and throttle Opus-heavy waves when weekly Opus utilization exceeds 70%.

---

## Source URLs (full list)

| URL | Type | Date |
|---|---|---|
| https://support.claude.com/en/articles/11647753-how-do-usage-and-length-limits-work | Official (Anthropic Help Center) | Current |
| https://support.claude.com/en/articles/12429409-manage-extra-usage-for-paid-claude-plans | Official (Anthropic Help Center) | Current |
| https://support.claude.com/en/articles/11049741-what-is-the-max-plan | Official (Anthropic Help Center) | Current |
| https://support.claude.com/en/articles/11145838-use-claude-code-with-your-pro-or-max-plan | Official (Anthropic Help Center) | Current |
| https://platform.claude.com/docs/en/api/rate-limits | Official (Anthropic API Docs) | Current |
| https://platform.claude.com/docs/en/build-with-claude/usage-cost-api | Official (Anthropic API Docs) | Current |
| https://platform.claude.com/docs/en/build-with-claude/claude-code-analytics-api | Official (Anthropic API Docs) | Current |
| https://techcrunch.com/2025/07/28/anthropic-unveils-new-rate-limits-to-curb-claude-code-power-users/ | Press (TechCrunch) | July 28, 2025 |
| https://github.com/anthropics/claude-code/issues/44328 | GitHub (Feature request: claude usage cmd) | April 6, 2026 |
| https://github.com/anthropics/claude-code/issues/50518 | GitHub (SDK rate-limit header exposure) | 2026 |
| https://github.com/anthropics/claude-code/issues/9424 | GitHub (weekly limits complaint aggregation) | 2025 |
| https://github.com/anthropics/claude-code/issues/12829 | GitHub (rate-limit header bug) | 2025 |
| https://github.com/ohugonnot/claude-code-statusline | Community tool (OAuth endpoint impl) | 2025–2026 |
| https://gist.github.com/jtbr/4f99671d1cee06b44106456958caba8b | Community gist (auth + endpoint guide) | 2026 |
| https://github.com/Maciek-roboblog/Claude-Code-Usage-Monitor | Community tool (local JSONL monitor) | 2025–2026 |
| https://github.com/ryoppippi/ccusage | Community tool (JSONL aggregator) | 2025–2026 |
| https://bishojbk.github.io/claude-usage/ | Community tool (menu bar app) | 2026 |
| https://claudefa.st/blog/guide/development/higher-usage-limits | Unofficial blog (limit doubling coverage) | 2026 |
| https://intuitionlabs.ai/articles/claude-max-plan-pricing-usage-limits | Unofficial blog (plan comparison) | 2026 |
| https://www.faros.ai/blog/claude-code-token-limits | Unofficial blog (engineering leaders guide) | 2026 |
| https://tokenmix.ai/blog/complete-claude-limits-guide-2026-tokens-uploads-5-hour | Unofficial blog (2026 limits guide) | 2026 |
| https://www.truefoundry.com/blog/claude-code-limits-explained | Unofficial blog (limits explainer) | 2026 |
| https://www.theregister.com/2026/03/31/anthropic_claude_code_limits/ | Press (The Register) | March 31, 2026 |
| https://appwrite.io/blog/post/anthropic-doubles-claude-code-rate-limits | Unofficial blog (doubling coverage) | 2026 |
| https://www.xda-developers.com/anthropic-is-doubling-claude-codes-hourly-rate-limits-removing-peak-hours-andworking-with-spacex/ | Press (XDA Developers) | 2026 |
| https://www.sitepoint.com/claude-code-rate-limits-explained/ | Unofficial blog (rate limits guide) | 2026 |
| https://github.com/anthropics/claude-code/issues/33978 | GitHub (built-in analytics feature request) | 2026 |
| https://apidog.com/blog/weekly-rate-limits-claude-pro-max-guide/ | Unofficial blog (weekly limit guide) | 2025 |
| https://github.com/anthropics/claude-code/issues/41788 | GitHub (Max 20x rate exhaustion bug) | 2026 |

=== USAGE LIMITS RESEARCH END ===
