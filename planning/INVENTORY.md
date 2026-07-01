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
| **Cutover: retire legacy `admin.html` rollup tree → cluster** | 📋 | The big unfinished move; decisions settled in `cutover_inventory.md` | Migrate legacy project data or archive read-only? |
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
| **Curriculum content accuracy** (T01–T22 + C04/C05) | 🔴 | R18 incident (authored from memory) QUARANTINED; standing gate = research-log + independent red-team per topic; ~13 topics lack any research foundation; live citation errors flagged | CEO triage 2026-06-28: the 6-agent audit never produced output; ~0 topics gated to bar → overhaul all per-topic via the gate in teaching order (lean, no upfront audit pass) |
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
