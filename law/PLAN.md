# PLAN — the spine (sequence + spec index)
> ✔ **RATIFIED** — Carter, 2026-07-02 (canon walkthrough sign-off).
> Law. The authoritative order of work. Detail lives in `specs/` (one doc per system, DRAFT→RATIFIED→BUILT); this page only says WHAT and WHEN. Where old docs (ROADMAP / PRODUCT_PLAN / IMPLEMENTATION_PLAN) disagree with a ratified spec, the spec wins.

## The two pillars (unchanged, founder-validated)
1. **Job Board** — service areas with jobs as line items; per-team pipelines; the management daily-driver.
2. **The Map** — construction/inspection side; arrives from an external collaborator, integrate-as-delivered. **Placeholder until delivered; plan internals when details arrive.** Project management + billing proceed map-independent (Carter 2026-07-02).

## Track 1 — TRAINING (top priority now; rolling release)
| # | Work | Spec | State |
|---|---|---|---|
| 1.1 | **Live-5 made fully operational** (leak strip → readability retrofit per PRODUCT_BAR §1 → premerge green → playthrough) | specs/training-fix.md | ▶ FIRST MISSION |
| 1.2 | Next wave through the gate: T09 → T05 → T06, under the new bar from authoring | specs/training-content.md | queued |
| 1.3 | Remaining topics, Basics→Advanced DAG order, rolling release; T20 RUS/Federal pulled earlier (RUS-aware) | 〃 | queued |
| 1.4 | I11 training dashboard (scores prominent, per-lesson timing, >45min flag) | specs/training-dashboard.md | after 1.2 |
| — | Certs (T21/T22/C04/C05): **DEFERRED until after the entire main project rollout** (Carter) | — | parked |

## Track 2 — PLATFORM (opens alongside Track 1; usage-conscious)
| # | Work | Spec | State |
|---|---|---|---|
| 2.1 | UI/interaction pass on the ops cluster: Settings layout, unused-tab kill list `*`, visible-organization fixes (PRODUCT_BAR §2) | specs/ui-pass.md | ▶ with 1.1 |
| 2.2 | Legacy cleanup: delete legacy inspection/permits routes; audit-page zombie check; kill AI assistant + setting-requests (pre-authorized) | specs/cutover.md | queued |
| 2.3 | **Keystone cutover completion** — verify R10–R13 UI, close gaps, redirect admin.html, archive legacy data (nothing else migrates unless a MIGRATE row proves need `*`) | 〃 | queued |
| 2.4 | **Events + nudges** — manual events w/ custom field + per-event "remind in X days"; stale-job nudges default **14 days** | 〃 (section) | rides 2.3 |
| 2.5 | System F capabilities (early, approved): grants + requireCapability + admin UI | specs/roles-capabilities.md | queued |
| 2.6 | **System D hours** — manual-entry-first UX; three attribution targets (job / **area-WO** / overhead); 1099 mobile app = **one flow: clock-in + daily card** (I-1); Workforce CSV import (sample `*`); confirm loop + anomalies | specs/hours.md | after 2.3 |
| 2.7 | **System A billing** — job types + rate catalog + per-instance codes + submissions (samples + RUS code list `*`); per-client formats configurable (D015) | specs/billing.md | after 2.6 |
| 2.8 | System B projections (backend largely built; UI + pace slider) | specs/projections.md | after 2.7 |
| 2.9 | System E cockpit — per-person cost rate w/ universal preset (locked); utilization = **profitability metric for hybrid roles**, not peer ranking; thresholds `*` | specs/cockpit.md | after 2.6/2.7 |
| 2.10 | **County-universal pass** — county as the first grouping level everywhere (schema + UX) `*`(design session) | specs/county.md | slot at 2.3 or after — Partner raises |
| 2.11 | Interim **full-screen map preview** (big, easy view of the early map, data linked to ops projects) `*`(scope small) | specs/map-preview.md | when Carter calls it |
| 2.12 | Diagnostics logger (kept per Carter): clickstream + JS errors, toggle + purge | specs/diagnostics.md | fits with 2.3 |

## Later (post-map-delivery / post-core)
Map integration + BOM/draw + production tracker + daily cards + report-out → splice-as-map-layer (+ printable diagrams) → KMZ folder-sync → real-time consolidation → global search → materials auto-populate → mobile/PWA wrap. RUS-specific items pass the **RUS-sunset review** (every phase boundary: justify against remaining RUS runway or cut).

## Standing inputs (`*` call-ups — see specs/CALLUPS.md)
Workforce CSV sample → 2.6 · submission samples ×3 + RUS code list → 2.7 · cockpit thresholds → 2.9 · unused-tab kill list → 2.1 · county design session → 2.10 · map internals → map delivery.
