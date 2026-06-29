# Competitor / similar-company research → feature ideas (grounded in OUR build)

> Owned by Planning. Carter (2026-06-29 overnight): *"researching similar companies and our work would help u with ideas."* Run after the codebase marathon (so ideas are grounded in what we actually have — see `codebase/00-SYNTHESIS.md`). Feature ideas land in `ideas.md` (I-series, marked RESEARCH-SOURCED). Last updated 2026-06-29.

## Status
- **Web search RATE-LIMITED until ~1:40pm ET (2026-06-29)** — live competitor research paused; resume after reset. (Didn't burn wakes retrying.)
- **Domain 1 (OSP/fiber GIS + PM tools) is ALREADY heavily researched** — see the existing `research/` dir (8 files, ~280KB, May 2026): OZMap/Vetro, GIS platforms, legacy AutoCAD, newer/others, adjacent, UI patterns, Vetro visual-match + deep-dive. **Don't duplicate — mine it instead.** This file connects that prior research to the June build map.

## Existing `research/` ↔ our build findings (the bridge nobody had drawn yet)
The May research predates the keystone build + my map. Cross-referenced:
| Existing research | Maps to our finding | So the idea is… |
|---|---|---|
| `01_ozmap_vetro.md`, `07/08_vetro_*` (Vetro FiberMap deep-dive) | **I6** map/projection engine BUILT@POC + **O27** map-KV-vs-relational | Vetro is the closest analog to our map pillar. When productionizing (O27), borrow Vetro's data model (relational features/spans, designations) + render patterns. The pricing/estimate side we already match (computeEstimate + cost_catalog). |
| `02_gis_platforms.md` (IQGeo/3-GIS/etc) | I6 / map rendering deferred | In-app map rendering + KMZ sync (the deferred piece) — these show the rendering bar. |
| `03_legacy_autocad.md` | DWG sync (chunk 13) + desktop (chunk 19) | Our DWG offline-sync + 2GB DWG docs already address the AutoCAD interop the legacy tools lean on. |
| `06_ui_patterns.md` | design system (chunk 15 AppShell) + operations cluster | UI patterns to lift into the cluster pages (deep-UI pass) + the stranded settings rebuild (O30). |
| `05_adjacent.md` | I1 scheduling / cockpit + portals | Adjacent-tool features (dispatch, client portals) — cross-ref I1 + O25 portal consolidation. |

## Research domains still to run (when web resumes) — PRIORITIZED by our gaps
1. **⭐ Field daily-report / inspection tools** (utility/telecom/construction) → grounds **I9 / O21** (the RUS daily-paperwork GAP — our ONLY confirmed greenfield; highest value; field-first/mobile per `feature_mobile_app`). Look for: structured daily logs, photo+GPS capture (we have geotagged photos, chunk 13), e-sign, offline capture, RUS Form 740-style staking notes, weather/crew/quantity fields, PDF export. *(Domains 3–5 below are LOWER value — we already have billing/timeclock/job-board; treat as incremental polish, not builds.)*
2. Construction/government progress-billing (AIA / RUS) → polish for our billing_keystone ledger (we have earned−billed; compare schedule-of-values UX).
3. Field-crew time tracking → compare to our timeclock (chunk 09); informs the O22/O23 hours-policy decision.
4. Job-board / dispatch / scheduling → grounds **I1** (we have a keystone job-board; add the time/scheduling dimension).

## Method (per wake, when web is up)
ONE domain → 2–4 targeted searches → fetch 1–3 best → extract concrete features we lack/could improve → cross-ref the chunk/finding → append to `ideas.md` (RESEARCH-SOURCED + competitor named) + notes here. Cost-smart, ≤2 agents, concrete (tables/endpoints/UI) not generic.

## Note to Carter
The marathon (the big deliverable) is done — `codebase/00-SYNTHESIS.md` is the read. This research is the lower-priority interleave; when you're back, the highest-value next step is your call (act on the synthesis findings, the deep-UI/live user-test pass O1, or this research). I'm holding (not burning tokens) while web is rate-limited.
