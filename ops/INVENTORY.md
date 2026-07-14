# Software Inventory — the whole platform, meshed with current state

> Owned by Planning. The live map of everything Launch Fiber's software **is and will be**, tagged by status, with dependencies + open questions. Doubles as the feature-state tracker. **The Auditor's 2026-07-01 baseline (`docs/audit/assignment-1.md`) independently verified the documented picture matches the code.** ⚠ **STALENESS NOTE (2026-07-01): rows below predate the WP-A/C/D wave + the assessment engine.** The **assessment engine is now MERGED** (2026-07-01, inc1-3, Auditor-verified all-6-pass — detail in `codebase/11-training.md`; deploying to prod, gated/hidden until content ships). The training-content-accuracy row + the broader WP-A/C/D wave rows still get a progressive status refresh at each subsequent merge (D019: docs-in-merge-commit is a hard exit criterion). Last updated 2026-07-01 (engine merge).

**Legend:** ✅ built+live (per docs) · 🟡 partial (some built, real gaps) · 📋 planned (specced, not built) · ❓ fuzzy (needs decisions/discovery)

---

## 0. Foundation / infra
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Express + vanilla JS + Postgres on Railway, auto-deploy on push to `main` | ✅ | Healthy pipeline | — |
| Auth (JWT + `lfs_session` cookie, roles, middleware) | ✅ | Roles: admin, design/permitting managers + engineers, contractor, customer, trainee | Capability-grant layer is System F (📋) |
| Keystone data model — `service_areas` + `service_area_jobs` + `time_entries` (migration 0064) | ✅ | Service Area = unit of work, jobs = line items | — |
| Migrations / schema | ✅ | **Migrations DO auto-run on deploy** (`node server.js` → `start()` → `runMigrations()`; corrected 2026-06-29, O13). 82 migrations; `schema.sql` synced at 0079+ | — |
| CI (GitHub Actions) | ⛔ DEAD (permanent) | **Carter 2026-07-01: GitHub Actions billing will NEVER be fixed.** CI never runs (smoke/schema-sync/Playwright all skipped). **Verification is permanently local/manual: `npm test` + a live-preview pass locally before every merge — there is no CI safety net.** | O43 (closed) |

## 1. PILLAR 1 — Job Board / Operations cluster (management side)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Operations cluster pages (dashboard/service-areas/pipeline/billing/money/hours/clients/area/job-board/invoices/people/audit/settings) | ✅ | Intended admin-dashboard replacement | Launcher tile name TBD |
| Service-area + jobs write-path (CRUD, routes, materials, finalize, cost rollups, `/workspace`) | ✅ | Built + dev-tested | — |
| Client / EC create-edit in cluster | 🟡 | Backend shipped; UI fanned to workers — verify | — |
| Per-team status pipelines (permitting, design), optimistic + undo, no pop-ups | 🟡 | Pipelines defined; legacy pop-up pipeline still around | — |
| **Cutover: retire legacy `admin.html` rollup tree → cluster** | 🟡 | **Step-1 dead-items MERGED 2026-07-14 (#70, `11d28f02`):** AI assistant + audit-log viewer + dead billing report deleted (~5,700 lines) + server.js unwired (boot-safe). Steps 2–7 (O20 port, invoice consolidation, cluster UI gap-close, legacy-data delete, hard redirect) remain; setting-requests/permits/inspection.js retire there (#71). | Migrate legacy project data or archive read-only? |
| Stale-job nudges ("permit submitted >30d", "approved not billed") | 📋 | — | — |

## 2. PILLAR 2 — The Map (construction / inspection side)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Standalone map tool (`fiber_route_manager_v33.html`) — draw spans/structures/conduit, BOM tally, CSV export, status lifecycle, cost-catalog POC | ✅ (standalone) | Real working Leaflet tool — extend, don't rebuild | Final map version pending Carter's boss |
| Embed map as authed Operations → Map tab (full-screen, toggleable layers) | 📋 | System C step 1 | — |
| BOM export to Excel (`Unit = qty`, their format) | 📋 | Fast early win | Confirm their exact format |
| Per-CC unit cost catalog from Excel masters | 🟡 | POC exists | — |
| Production tracker (reproduce the Coda doc): unit→route→SA→CC rollups, expected vs current, % complete, over/behind flags | 📋 | — | — |
| Completion marking (office: map asBuilt + per-route count table for no-geometry "drops") | 📋 | — | — |
| Daily inspection cards (RUS only) + attachments (signed sheet, asbuilt/redline, photos) | 📋 | Signed sheet = the agreement record | — |
| Report-out (one click → client / prime / construction) | 📋 | — | — |

## 3. Money — Billing (A), Projections (B), Cockpit (E)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| **System A — Billing per job** (method/timing/rate catalog, multi-code split, submission packaging) | 🟡 | `billing_keystone` ledger + spec exist; full per-job billing + submission not built | Needs Carter's real submission samples (RUS inspection, RUS design, non-RUS permitting) + RUS code list |
| **System B — Projections** (aggregation by timing bucket: now / during-construction / at-closeout, tunable pace) | 🟡 | `routes/projections.js` + design exist; contract-allocation engine deferred until map lands | — |
| **System E — Director cockpit + early warning** (profitability rev − hrs×$45, fixed-fee + RUS-cap risk lenses, utilization, alerts) | 📋 | `app_settings` for thresholds planned | Confirm alert thresholds |
| Legacy invoice generator + AI-vision template | 🟡→scrap | Replace AI template with a simple configurable one | Per-client template fields TBD |
| Cost model: **$45/hr loaded, director-only** | ✅ (decided) | One internal number, no payroll dependency | — |

## 4. System D — Hours capture (the linchpin)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Engineers (W2) log hours per job daily, in-tool | 🟡 | `time_entries` exists; daily-log widget 📋 | — |
| 1099 inspectors — dead-simple mobile clock app (kills texting) | 📋 | Contractor-timeclock work is the base | — |
| W2 inspection hours via Workforce CSV import | 📋 | — | **Does Workforce export CSV?** |
| Confidence layer (no orphan hours, weekly confirm loop, anomaly flags, audit trail) | 📋 | Feeds A/B/E | — |
| **L-014 quarter-hour snap — ALL write paths** | ✅ | **CLOSED platform-wide 2026-07-03.** #59 (`9f662301`): timeclock clock-out/switch via `sessionEntryHours`. #60 (`88068156`): `service_areas.js` SA-job hours (billing money-path — VO money-lens PASS) + `ai.js` log_time_entries, both via shared `snapHoursToQuarter`. VO fresh class-grep confirms no raw-hours write remains. | — |

## 5. System F — Roles & access (assignment-driven + capability grants)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Role-aware operations rail (admin-only links, fail-closed) | ✅ | Seam exists | — |
| `user_capabilities` grants (cockpit / all_hours / manage_billing / manage_users / all_projects / production_compiler) + `requireCapability` | 📋 | — | — |
| Assignment-driven everyday views (inspector↔engineer flip needs no relabel) | 📋 | — | — |
| **Unified staff management** (one concept: person + perms + team designations; admin create/edit/delete) | 🟡 | Carter: no user/staff split. **Backend already exists** (auth.js full user CRUD incl. `DELETE /api/users/:id`; `users.staff_id` links login↔staff) — CEO triage Correction B. Gap = a **unified People UI** + combined "add person", not plumbing. Unified layer (no table-merge). | — |

## 6. System G — Splice (a map layer)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Standalone splice matrix tile | 🟡 (half-built) | **Retire** — fold into the map | — |
| Per-closure splice matrix on the map + printable PDF splice diagrams | 📋 | Paper stays paper | — |

## 7. Training (current trigger event — fully under Planning)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| OSP/ISP training SPA (`osp-training/` → `public/training/`), competency-gated completion (≥70%/competency, no manual button) | ✅ (infra) | — | — |
| Self-signup (`trainee`), training-only lockdown, admin per-person progress + drill-down | ✅ | — | — |
| Per-staff content visibility (track→subject→lesson, presets + overrides, migration 0079) | ✅ | **Better model:** status-driven default role (see only completed/verified), expand from there — vs current manual per-user | Retarget to content-status defaults? |
| **Curriculum content accuracy** (T01–T22 + C04/C05) | 🟡 | **⭐ LAUNCH SET LIVE 2026-07-02: T01/T18/T02/T03/T04 merged + flipped on `launchfiber.app`** (assessment engine live; per-lesson pools + topic-final; capstones retired D031; every Q gated: author≠RT + Auditor content-audit + D027 log-every-cite + D033 fresh-grep + D028 render-test — all 54 lessons render clean). Rest (T09/T05/T06…T22, C04/C05) authored or WIP but **HIDDEN/unpublished**. R18 authored-from-memory quarantine STILL STANDING for any ungated content. | next: continue the DAG (T09→T05→…) through the gate; flip as each clears |
| **training-fix (live-5) — WO-1 + WO-2·shared + WO-2 T02/T04 MERGED (2026-07-03→04)** | 🟡 | Registrar merged #46 (WO-2 shared-infra: `ReferencesBlock` + `course-catalog.js` rename) + #47 (WO-1 leak-strip; VO-verified SHA `63de4640` only). **2026-07-04: merged WO-2 #52 (T02, `4cbc5b7a`) + #54 (T04, `863e28f6`) + WO-4 #49 (settings §2.1 + wording, `a477ebd9` — resolves deviation #58)** — clean merges on main (VO vo1 re-verify PASS; #52/#54 also cross-foreman f1 PASS; #49 cross-foreman covered by VO live §2 playthrough per GATES §2); #47 hedge-strip preserved (0 hedges post-merge); dist clean-rebuilt (`144fa8f4`, entry `index-JeSY7JZA.js`). **#50 (T01)/#51 (T18)/#53 (T03) MERGED 2026-07-12** (`b15823bd`/`fd18ccd4`/`faa1b56c`; verified rebased tips `8ca697e`/`668fe15`/`1692881`) — the #65 escalation resolved via Partner Option-A (f2 rebase → f1 cross-foreman PASS + vo1 PASS on each tip → Registrar rolling merge; citation survival mechanically confirmed, 0 conflict markers, 0 hedges). #55 (T02/L08 OS1↔G.652 accuracy) rode along (`c888a0a2`, cherry-pick `9b2c5895`). #65 CLOSED. | **WO-3 premerge #48 MERGED** (`aff2eec2`). Lint on main now exit 1, **11 findings (197→134→34→11): all `visible-id` in POOL JSONs (T02/T04-final etc.)→#56-class + #63 out-of-scope residual** (unpublished pools). **#57/#61/#63 MERGED 2026-07-13** (`b09cf84d` #57 engine shuffle + `e5f1a9e4` #61 T03 strip; #63 verified no-op): gameability 22→0 (per-attempt MC shuffle, seed=attemptId+questionId, no schema change; vo1 26,409-assertion round-trip + Registrar-reran assessment_engine.test.js 18/18) and internal-note 1→0. Assets rebuilt `bf824a8b`. Republish flip is Carter's; **all prod-facing steps DEFERRED — Railway new deploys down (Carter 2026-07-12, ~few days)**. **✅ post-deploy live smoke DONE 2026-07-05 (real Registrar, PASS)** — #49 settings verified live (cards side-by-side §2.1; 4-skin picker, no legacy toggle → #58 resolved; 0 console errors), T01 live-5 lesson+assessment render clean (0 errors, 0 leaks, readable dark-theme MC); live-5 pools grep-clean of authoring notes. #64 (match-question native-select contrast) **MERGED 2026-07-12** as a Registrar urgent-hotfix (re-cut clean from the discarded/off-limits-polluted duplicate `133fae9b` → CSS-only `index.css`: `:root{color-scheme:dark}` + styled `select option`; merge `ed1ab6e1`, asset rebuild `084fcd27`, bundle `index-lv7JuvIQ.css`). In-browser computed-style verified (option list slate-200-on-ospnavy, washout gone). **VO vo1 PASS** (independent, incl. in-browser real-Chromium render lens on the identical +16 `index.css`). **Only the PROD live-smoke remains DEFERRED — Railway new deploys down (Carter 2026-07-12, ~few days); prod still serves `index-2UshaxHq.css`.** #64 stays OPEN until deploy resumes → live-smoke → close. `npm test` env gap RESOLVED by **L-015** (sanctioned disposable local-PG regression harness, fresh per run). |
| Interactive components + broken-tool repair | 🟡 | Some tools reported broken; component health check needed | — |
| Add-staff path (so completion tracking is usable) | 🟡/❓ | See System F | — |

## 8. Portals (client-facing)
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Customer portal (`customer.html` + `routes/customer_portal.js`) — read-only, client_visible-gated, **no internal $** | ✅ | Hardest-watched surface for $-leaks | Contact email confirm |
| Client portal v2 + onboarding | 🟡 | — | — |
| Client project view: engineering + construction billable $ + progress (never margin) | 📋 | Two lenses, same units (client=billable, director=cost) | — |

## 9. Files / KMZ / Materials / Photos
| Area | Status | Notes / gaps | Open Qs |
|---|---|---|---|
| Photos PWA / project photos | ✅ | Needs `service_area_id` + `client_visible` for per-SA linkage | — |
| Folder workspace / DWG sync / two-way sync | 🟡 | — | — |
| KMZ folder auto-sync (watched folder, versioning, in-app view) | 📋 | Likely needs the desktop app | Merge semantics: latest-wins vs feature-merge? |
| Materials / BOM auto-populate from map | 📋 | Hooks baked in schema; full feature ties to map | CSV column shape, re-sync behavior |
| Desktop/Electron app (field/offline) | 🟡 | Exists; peripheral | Investment level? |

## 10. Cross-cutting (later)
| Area | Status | Notes |
|---|---|---|
| Real-time / SSE consolidation (splice + map + lists) | 📋 | Phase 8 |
| Global search / command palette | 📋 | Phase 9 |
| Full data export ("download everything") | 📋 | — |
| Mobile / PWA wrap | 📋 | Keep screens responsive now |

---

## Build sequence (current dependency-aware order, from the plans)
1. Finish training (trigger) 2. Phase D legacy cleanup 3. Keystone cutover 4. System D hours 5. System A billing 6. System C map+production 7. System B projections 8. System E cockpit 9. System F roles 10. System G splice 11. Later: real-time, search, KMZ, mobile.

## Biggest open questions for Carter (blockers)
- Real submission samples (RUS inspection / RUS design / non-RUS permitting) + RUS code list → defines billing.
- Does Workforce export CSV? → defines hours import.
- Final map version timing.
- Cockpit alert thresholds.
- Legacy project data at cutover: migrate or archive read-only?
- Add-staff: self-signup only, or admin provisioning too?

---

## Deferred & revisit ledger (Registrar-maintained — nothing gets forgotten)
> Every item consciously deferred/optional/parked, its durable home, and what un-defers it. Registrar reconciles this each turn as work progresses (Carter 2026-07-14: "keep foremen fed; don't forget anything that needs a revisit"). When a trigger fires, decompose/act; when an item ships, strike its row.

| Deferred item | Durable home | Revisit trigger |
|---|---|---|
| **#72 SPA full-accent unification** (adopt each skin's accent vs the chosen canvas-only/keep-amber) — OPTIONAL, not-owed | `specs/ui-pass.md` "Deferred" + #72 | ONLY if Carter raises it |
| **Cutover: delete `setting-requests` / permits routes / `inspection.js`** (load-bearing on live surfaces now) | `specs/cutover.md` step-1 done-when ("not done while any remains") + #71 ruling | cutover **steps 5–7** (die with their cluster replacements) |
| **#64 prod live-smoke** (merged; washout fix banked) | open #64 | Railway deploys resume |
| **#67 cert `LFS-OSP-2026-0001` → issue to Carter FIRST + logged-out live-smoke + VO lockstep probe** | open #67 | VO probe clears **and** deploys resume |
| **#63 residual: 3 CHECK-1 authoring-note strings in UNPUBLISHED pools** | #63 closed comment | when those topics come through the gate |
| **Safari/WebKit native-control chrome** (cert `/verify` + training; option-(a) is Chromium-scoped) | #64 comment | if Safari/iOS users matter → `specs/ideas/` |
| **Republish flip of live-5 + WO-2 retrofit** (Carter-only) | INVENTORY §7 row | Carter green-light after deploys resume |
| **#74 System F Settings page** (needs #73's catalog + grant API) | open #74 | #73 merges |
| **Cutover steps 2–7** (O20 port · invoice consolidation · parallel-structure reconcile · cluster UI gap-close · legacy data delete · hard redirect) | `specs/cutover.md` + PLAN 2.3 | as step-1 (#70) lands / Carter waves |
| **Dependency-blocked Track-2 specs**: hours 2.6 · billing 2.7 · projections 2.8 · cockpit 2.9 · county 2.10 · events 2.4 · diagnostics 2.12 (all RATIFIED) | PLAN §Track-2 | after **2.3 keystone cutover** |
| **Desktop D1/D2 (2.13) · mini-jobs M1/M2 (2.15) · mobile PWA (2.14)** | PLAN + specs | wave-2 start / desktop D2 |
| **Training wave-2 (T09→T05→T06, 1.2)** — **DECOMPOSED 2026-07-14 (Partner ruling): #78 salvage + #79 T09, NOT gated on #66.** Queues AHEAD of #77 for the next free foreman; System F in-flight (#73–#76) lands first. vo1 rules #66 separately. Then T05/T06 + wave-3 (all remaining OSP, 1.3). | #78/#79 + PLAN §Track-1 | T05/T06 after T09; wave-3 rolling as crews free |
| **specs/certificates.md ↔ code**: "main authoritative over spec snippets" declared | `specs/certificates.md` header | on any future cert rebuild — read code, not stale snippet |
| **System F hours-override owner NOTIFICATION display** (change-log is v1 compliance; the in-app notify is deferred) | #75 + this ledger | rides **2.4** (Events + nudges) when built |
| **#70 admin.html excision — prod render playthrough** (the ~452-line AI/audit UI removal; highest-risk edit; vo1 verified in preview, prod smoke not yet) | closed #70 | Railway deploys resume |
| **"Assign manager" People UI (set `users.manager_id`)** — `hours.edit_subordinates` (direct-reports scope, #75) is correct-but-DORMANT until manager_id is populated; no backfill source exists | #75 ruling + this ledger | a People-management surface sets manager_id (small add; not blocking #75) |
| **UI-pass 2.1 theme** — training-admin (#69) + SPA canvas-only (#72) MERGED (`29a9ad12`); nav-consolidation slice still rides the cutover wave | PLAN 2.1 + cutover | nav slice: with cutover steps 2–3 |
| **Rudy Douglas (Director) grants** — account = `Douglas` (`b346f865`). **L-016 (`6caa8094`): NOT seeded** — the Registrar migration ships tables + admin-bootstrap only; **Carter creates a "Director" bundle + assigns Rudy ON THE PAGE post-#74** (cockpit.view+hours.view_all+projects.view_all, not billing). | #73 correction (L-016) | Carter sets it on the page after #74 (Settings) + #76 (bundles) merge |
| **Role-default grants + invoice-gate policy** (which role keeps which key; managers + `money.manage_billing`) — L-016: editable rows, never baked; **decision = PARTNER** (with Carter), not Registrar/Carter-ad-hoc | #75/#77 corrections | Partner ratifies role-default rows → applied as editable data |
| **Custom roles = grant bundles** — now SPECCED (roles-capabilities §5.5, `4b759b53`) + decomposed: backend **#76** (role_bundles/keys/assignment + CRUD API + resolver union, behind #73), UI folds into **#74** (Settings page). Self-serve new permission KEYS remains deliberately OUT (feature-born). | #76 + #74 | ships with #76→#74 |
