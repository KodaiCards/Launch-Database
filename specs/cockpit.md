# SPEC — Director cockpit + early warning + admin leaderboard (PLAN 2.9, System E)

> ✔ **RATIFIED** — Carter, 2026-07-13 (succession-sprint batch). Threshold defaults (settings, not code): **fixed-fee alert at 80% of fee consumed · RUS-cap alert at 85% of contract cap · utilization display-only, no alert.**

## Scope
- **Profitability lenses** (`cockpit.view`-gated): per job / SA / contract — revenue vs cost using per-person cost rates (universal preset + per-person override, director-only visibility; L-003).
- **Early warning:** fixed-fee jobs turning unprofitable (cost at 80% of fee → flag; configurable), RUS budget-cap risk (85% → flag), stale-money flags (done-not-billed rides the billing-status glance).
- **Utilization** = profitability metric for hybrid roles, display-only, NEVER peer-visible (standing framing).
- **Admin leaderboard** (Carter 2026-07-13 amendment): production per hour + actual-vs-billed, cut per discipline, sortable table, descriptive-not-gamified, `cockpit.view`-gated, never peer-visible; the checkoff/time feed stays unannounced to the crew (Goodhart).
- Data sources: job_time_segments + mini-job checkoffs (2.15) + billing rows (2.7). Sequenced after 2.6/2.7 for that reason.

## Done-when
- A fixed-fee job crossing 80% shows flagged in the cockpit within a day; thresholds editable in settings; leaderboard ranks only within discipline; no cockpit surface reachable without the permission (wire-checked); no cost-rate data in any non-cockpit response.
