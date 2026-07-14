# PLAN — the spine (sequence + spec index)
> ✔ **RATIFIED** — Carter, 2026-07-02 (canon walkthrough sign-off).
> Law. The authoritative order of work. Detail lives in `specs/` (one doc per system, DRAFT→RATIFIED→BUILT); this page only says WHAT and WHEN. Where old docs (ROADMAP / PRODUCT_PLAN / IMPLEMENTATION_PLAN) disagree with a ratified spec, the spec wins.

## The two pillars (unchanged, founder-validated)
1. **Job Board** — service areas with jobs as line items; per-team pipelines; the management daily-driver.
2. **The Map** — construction/inspection side; arrives from an external collaborator, integrate-as-delivered. **Placeholder until delivered; plan internals when details arrive.** Project management + billing proceed map-independent (Carter 2026-07-02).

## Track 1 — TRAINING (top priority now; rolling release)
| # | Work | Spec | State |
|---|---|---|---|
| 1.1 | **Live-5 made fully operational** (leak strip → readability retrofit per PRODUCT_BAR §1 → premerge green → playthrough) | specs/training-fix.md | ▶ IN PROGRESS — WO-1 + shared + WO-2 T02/T04 merged (lint 197→134); WO-2 T01/T03/T18 escalated (hedge conflict), WO-4 in flight |
| 1.2 | Next wave through the gate: T09 → T05 → T06, under the new bar from authoring | specs/training-content.md | queued |
| 1.3 | **ALL remaining OSP topics — the full new-bar treatment, none exempt (Carter 2026-07-04):** T07 Staking · T08 Make-Ready · T10 Construction · T11 Splicing · T12 Testing · T13 Inspection · T14 Grounding · T15 Restoration · T16 As-Built/GIS · T17 Estimation · T19 Headend · T20 RUS (pulled RUS-aware). Authored ones get the same retrofit the live-5 got (verbiage, readability, tool/interaction quality, PRODUCT_BAR); unauthored ones are written under the bar from word one. Basics→Advanced, rolling flips. | 〃 | **RATIFIED 2026-07-13** (clean-slate delete + HARD cutover — Carter: all legacy data is test data) |
| 1.4 | I11 training dashboard (scores prominent, per-lesson timing, >45min flag) | specs/training-dashboard.md | after 1.2 |
| 1.5 | **Completion certificate + public verify** — approved visual draft (navy/logo-blue, Rudy Douglas · Director); issue/list/revoke + `/verify` lookup page; v2 = auto-issue + PDF via Puppeteer | specs/certificates.md | **RATIFIED 2026-07-13** — small package, decompose after live-5 clears |
| — | Certs (T21/T22/C04/C05): **STAGE-4 TIER (Carter 2026-07-04)** — after the entire main rollout; sequenced with/after the ISP track (cert content presumes ISP is learned first) | — | stage 4 |

## Track 2 — PLATFORM (opens alongside Track 1; usage-conscious)
| # | Work | Spec | State |
|---|---|---|---|
| 2.1 | UI/interaction pass on the ops cluster: Settings layout, unused-tab kill list `*`, visible-organization fixes (PRODUCT_BAR §2) + **theme ENGINE/PICKER** (replaces light/dark; recovered decision — seed: specs/ideas/theme-picker.md, call-up *13) | specs/ui-pass.md | **RATIFIED 2026-07-13** (rail 16→9; dark-only unify) — nav rides cutover; theme-unify parallel-safe |
| 2.2 | Legacy cleanup: delete legacy inspection/permits routes; audit-page zombie check; kill AI assistant + setting-requests (pre-authorized) | specs/cutover.md | **RATIFIED 2026-07-13** (kill list confirmed) |
| 2.3 | **Keystone cutover completion** — verify R10–R13 UI, close gaps, redirect admin.html, archive legacy data (nothing else migrates unless a MIGRATE row proves need `*`) | 〃 | queued |
| 2.4 | **Events + nudges** — manual events w/ custom field + per-event "remind in X days"; stale-job nudges default **14 days** | 〃 (section) | **RATIFIED 2026-07-13** (in-app only; title+note+date+remind) — rides 2.3 |
| 2.5 | System F capabilities (early, approved): grants + requireCapability + admin UI | specs/roles-capabilities.md | **RATIFIED 2026-07-13** (Carter admin; Rudy cockpit/all-hours/all-projects, no billing) |
| 2.6 | **System D hours** — manual-entry-first UX; three attribution targets (job / **area-WO** / overhead); 1099 mobile app = **one flow: clock-in + daily card** (I-1); Workforce CSV import (sample `*`); confirm loop + anomalies | specs/hours.md | after 2.3 |
| 2.7 | **System A billing** — job types + rate catalog + per-instance codes + submissions (samples + RUS code list `*`); per-client formats configurable (D015) | specs/billing.md | **RATIFIED 2026-07-13** (two archetypes decoded from real samples; manual-pick RUS codes; xlsx-first export; rate-fallback rescue included) — after 2.6 |
| 2.8 | System B projections (backend largely built; UI + pace slider) | specs/projections.md | **RATIFIED 2026-07-13** (page + PDF owner report) — after 2.7 |
| 2.9 | System E cockpit — per-person cost rate w/ universal preset (locked); utilization = **profitability metric for hybrid roles**, never PEER-VISIBLE ranking; **admin/director-only production leaderboard OK (Carter 2026-07-13)** — per-discipline, rate-based, descriptive-not-gamified, capabilities-gated; thresholds `*` | specs/cockpit.md | **RATIFIED 2026-07-13** (defaults 80/85; utilization display-only) — after 2.6/2.7 |
| 2.10 | **County-universal pass** — county as the first grouping level everywhere (schema + UX) `*`(design session) | specs/county.md | **RATIFIED 2026-07-13** (REQUIRED going forward + backfill) — slot at 2.3 |
| 2.11 | Interim **full-screen map preview** (big, easy view of the early map, data linked to ops projects) `*`(scope small) | specs/map-preview.md | when Carter calls it |
| 2.12 | Diagnostics logger (kept per Carter): clickstream + JS errors, toggle + purge | specs/cutover.md §2.12 | **RATIFIED 2026-07-13** (off-default, 30d) — fits with 2.3 |
| 2.13 | **Desktop app** (resurrect `desktop/` Electron scaffold) — identity: **watched-folder local-file ingest → DB** (Workforce CSV, documents/photos first; KMZ + daily sheets when map/paperwork land). Sync model (Carter 2026-07-13): **real-time while connected; offline = capture queue + read-only cache, syncs on reconnect; money edits online-only** (offline replica of money data rejected — conflict risk vs hard rule 8) | specs/desktop-app.md | **RATIFIED 2026-07-13** (v1 = sync agent, files-only, object storage, unsigned installer; mini-jobs = *22) — decompose D1→D2 behind #67 + wave-2 |
| 2.15 | **Mini-jobs: employee job board + checklists + per-job clock** — self-claim board (county-first), template checklists (admin UI), one-active-clock time segments + day-end draft-confirm, anti-gaming flags; revealed with desktop D2 | specs/mini-jobs.md | **RATIFIED 2026-07-13** — M1→M2 AFTER wave-2 start (Carter priority call) |
| 2.14 | **Mobile PWA — THE WHOLE-WORKFORCE APP (Carter 2026-07-13: 1099s included, reduced perms, scoped job visibility)** — worker: board→clock→checkoffs→daily card + offline punches; admin tabs: approve hours · billing glance · nudges · board-read | specs/mobile-app.md | **RATIFIED 2026-07-13** — builds as mini-jobs M2 lands; daily card joins at 2.6 |

## Later (post-map-delivery / post-core)
Map integration + BOM/draw + production tracker + daily cards + report-out → splice-as-map-layer (+ printable diagrams) → **THE ISP TRACK (Carter 2026-07-04): the entire ISP curriculum built to OSP depth or deeper (ISP is the more complex subject; likely MORE content than OSP) — the natural continuation of the training doc and the prerequisite for its cert track; specifics deferred to a Carter+Partner scoping session when its build approaches (call-up *17)** → cert-prep topics → KMZ folder-sync (rides the 2.13 desktop app) → real-time consolidation → global search → materials auto-populate. (Mobile/PWA wrap moved up: now 2.14.) RUS-specific items pass the **RUS-sunset review** (every phase boundary: justify against remaining RUS runway or cut).

## Standing inputs (`*` call-ups — see specs/CALLUPS.md)
Workforce CSV sample → 2.6 · submission samples ×3 + RUS code list → 2.7 · cockpit thresholds → 2.9 · unused-tab kill list → 2.1 · county design session → 2.10 · map internals → map delivery · desktop-app spec session → 2.13 · mobile tab-list session → 2.14.
