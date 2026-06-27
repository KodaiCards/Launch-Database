# Launch Fiber — Product Plan (canonical, refined)

> **Read order:** `CLAUDE.md` → `HANDOFF.md` → **this file** → `ROADMAP.md` (phase mechanics) → `docs/map_requirements.md`.
> This is the **refined, founder-validated plan** from a long working discussion with Carter on **2026-06-26**. It reflects the *actual business* (a ~12-person firm) and supersedes the broad "platform" framing where they conflict. `ROADMAP.md` still holds the phase mechanics; this doc holds the *why*, the priorities, and the design decisions. **Keep it current** — it exists so context survives compaction / a CEO handoff.

---

## 1. The business reality (what actually shapes the product)
- **~12 people:** 3–4 doing engineering at a time, the rest inspectors, plus a couple of **1099 inspectors**. **Roles are fluid** — inspectors shift to engineers when construction pauses.
- **Clients:** mostly **PSC** — one large **RUS** government project spanning **5 construction contracts** (`515-x`). Other clients are non-RUS, mostly **permitting**. Future could bring more.
- **Work split:** outside PSC = permitting; PSC = **inspection** (longer, pays more), though we also designed + permitted the build. We are **engineering-only** — we inspect/observe construction, we don't build.
- **Money is offsite.** A separate team handles payroll/accounting/AR. We **don't touch payroll**. We **submit projects + 1099 hours** to their invoicing team. This software does **not** replace that.
- **Field prefers paper**, not tech. Splice/field docs must **print**.
- **ACAD stays.** Engineers design in ACAD; we do **not** replace it.
- **Existing tools to absorb:** time = QuickBooks **Workforce** (W2 inspection/construction hours; Carter moves them manually today); 1099s **text** their hours; production tracking = a **Coda** doc the director built; splice = **Excel** (painful).

## 2. Vision
A **daily-driver** tool that makes production, project management, and organization easier — a **supplementary** tool most employees barely have to think about. Two pillars carry it:
- **Pillar 1 — the Project/Job Board** (management side).
- **Pillar 2 — the Map** (construction/inspection side).
Everything else hangs off those two. "Big-corp feel" = **polish + reliability on the few right things**, not feature breadth. Design lens (always): fewer clicks, minimal/techy, **auto-populate anything derivable** (if X then Y, with override), **no confirmation pop-ups** (optimistic + undo), money math server-side, clients never see internal margin.

## 3. Data spine (keystone — already built)
```
Client
 ├─ Engineering Contract (RUS only)         ← EC present ⟺ program = RUS
 │   └─ Construction Contract (5 for PSC: 515-x)
 │        └─ Service Area / Concentrator    ← the unit of work
 │             └─ Route
 │                  └─ Jobs (line items: discipline · employee · rate · hours · $ · status · dates)
 └─ Service Area (non-RUS) → Jobs           ← no EC, directly under client
```
**Core rules:**
- **All designs track BOM/materials. Only RUS gets inspection** (inspection is a job we do only on the PSC RUS build).
- **RUS carries a bigger, expandable job catalog** than non-RUS — e.g. Inspection, **Resident Engineer**, documentation/close-out, multi-code Design, permitting. Jobs are team-scoped and admin-expandable.

## 4. Pillar 1 — Project/Job Board (management side)
**Solves the #1 daily pain: "we constantly forget what permits and design jobs we have."**
- Finish the **keystone cutover** so the operations cluster *is* the tool; retire the legacy `admin.html` rollup tree.
- Per-team **status pipelines** (permitting, design), one-click/optimistic, **no pop-ups + undo bar**.
- **Stale-job nudges** (e.g. "permit submitted >30d, no response"; "design approved, not yet billed").

## 5. Pillar 2 — The Map (construction/inspection side)
**The map IS the construction side — authoring + completion + export + splice, all in one surface.**

**Current state (verified in `docs/map_requirements.md`, tool = `public/map/fiber_route_manager_v33.html`):** a real, working Leaflet OSP tool — engineers **draw spans/structures/conduit** (snapping, follow-path, split), it **tallies a BOM** (counts by type+status, footage, miles) and **exports CSV**, has a status lifecycle (proposed→permitted→underConstruction→**asBuilt**→active), a DB-backed storage adapter, and a **proven cost-catalog POC** (uploads the Excel unit list, prices units). So construction side = **extend + integrate, not build from scratch.**

**The flow:**
- **Engineers draw units on the map** → that *is* the expected BOM. (They also design in ACAD; our map is the simpler unit-tracking surface.)
- **BOM exports to Excel (`Unit = qty`)** — CSV export already exists; align to their format. *(Fast early win.)*
- **Unit cost catalog from their Excel master files** → per-CC pricing → expected/current cost.
- **Office lady marks features "Construction completed"** on the map (geometry units) + a **per-route count table** for no-geometry units (e.g. **drops** — a new category with no drawing that must still roll up). → current totals.
- **Rollups reproduce the Coda tracker** as views: unit → route → SA → CC → client; expected vs current, cost, % complete, **over/behind flags**.
- **Inspection layer (RUS only):** daily cards (**6–12/day**, per inspector/crew) — date, concentrator, WO#, route, road, **grid**, units+qty, inspector, **attachments (signed sheet + asbuilt/red-line + photos)**. The **signed sheet is the agreement record** (inspector + construction crew signatures).
- **Report-out:** one click to send the package to **client, prime, construction.**
- **Linkage:** map Plan ↔ service area; `jobRef` ↔ service_area_job picker.

**Fluidity is make-or-break** (it's why Coda works): units/categories/routes are **data, not code**. Units = catalog rows (admin/engineer-defined, inspectors only pick); drawn features tag to a unit code and self-tally (length→footage, point→count); **count-only units (drops) roll up without geometry**. New unit/category = a catalog row, no migration.

**Embed:** mount the map **authed as the Operations → Map tab**, full-screen capable, **one map with toggleable layers**. **Retire the separate (half-built) splice tile** — splice becomes a map layer.

## 6. Splice (a map layer, phased)
- The standalone splice matrix was never finished. **Fold splicing into the map.**
- Model: click a **closure/splice point** → its **splice matrix/diagram** → **print PDF splice diagrams for the splice techs** (paper stays paper).
- **Don't be ACAD** — the map is view/markup/data-attach/splice, not CAD authoring.
- Phasing: (a) better drawing/markup viewport → (b) data attached to features → (c) per-closure splice matrix → (d) **printable splice diagrams**.

## 7. Hours & cost capture (the linchpin — must be trustworthy)
Carter: *"keeping track of employee hours per job is so so important and needs refinement for confidence."* Everything (cost, margin, billing, projections, early-warning) is downstream of this.
- **Engineers (W2):** log hours per job, **daily, in-tool**.
- **1099 inspectors:** their own **dead-simple mobile clock-in app** (kills the texting).
- **W2 inspection/construction hours:** from **Workforce** (manual today) → **Workforce CSV import** to kill the manual move *(confirm Workforce exports CSV)*.
- **Confidence layer:** no orphan hours (every hour → a job or an explicit overhead bucket), low-friction capture, a **weekly confirm loop**, anomaly flags (hours on a not-started job; billable hours but no status movement; erratic weeks), **audit trail**, single source of truth.
- **Cost model: $45/hr loaded × hours.** One internal number, **director-only**, no payroll dependency. (Carter's stated full-cost average.)

## 8. Billing — submission packaging + the timing/codes model (NOT accounting)
We don't do AR/aging/payroll (offsite). We **assemble what each job needs and hand it off.**
- Job $ → SA total → **submission package** per (client, discipline, program), in the **exact format the offsite invoicing team needs**. *(Need one real sample each: RUS inspection, RUS design, non-RUS permitting.)*
- **"Ready to submit / submitted"** states.

**The hard part — RUS timing, varying rates, multi-code, projections (Carter asked how I'd handle it):** model billing **per job**, never globally. Each job carries:
1. **Billing method** — fixed | hourly | milestone.
2. **Recognition timing** — **front-loaded** (bill on delivery/approval: permitting, design), **continuous** (bill as worked: Inspection, Resident Engineer — hourly), **back-loaded** (bill on completion: documentation/close-out).
3. **Rate** — stored **per job/contract** (auto-filled from a rate catalog, overridable); rates vary with no global rule.
4. **Code allocation** — one job → **many RUS job codes**, **billable total unchanged**. Coding is a **reporting overlay** (submission breaks out by code), not a change to economics. (Handles "Design split into multiple codes, same billable.")

## 9. Projections (the answer to "no set rule")
**Projection is an aggregation of per-job expectations, not one formula:**
- **Front-loaded** jobs → remaining undelivered fixed fees (recognized at delivered/approved/issued status).
- **Continuous** (hourly) jobs → driven by the **map**: remaining scope (miles/units) × rate, paced by recent burn. Inherently a **range** → show it with a **tunable pace assumption**, not false precision.
- **Back-loaded** jobs → close-out fees recognized at completion.
- **Partner view = expected revenue by timing**: "$X billable now / $Y across remaining construction / $Z at close-out." Stays **live** (derived from job status + map scope), not hand-maintained.

Design notes already on file: `docs/projections_design.md`, `docs/budgets_design.md`, `docs/billing_keystone_design.md`. The **contract-allocation engine** (per-mile hourly allocation + per-CC unit catalog) is intentionally **deferred until the map integration lands** (its inputs come from the map); interim inputs are manual.

## 10. Director cockpit (internal — admin/director only)
The system that tells you **first** when a project is going underwater or someone isn't producing (the offsite team can't — they don't know the low-level data).
- **Profitability** per job/project = billable revenue − hours×$45.
- **Two risk lenses:** **fixed-fee** cost creeping toward the fee; **RUS hourly** projected billings hitting the **contract cap before scope is done**.
- **Billing projections** for the partners (§9).
- **Early-warning alerts:** fixed-fee cost past ~80% of fee; RUS pace vs cap; **employee utilization/throughput, peer-relative** (no absolute target).
- **Client project view (separate surface):** engineering + construction **billable** $ + progress — **never internal margin/cost.** Same units, two lenses (client = contract/billable; director = cost/margin).

## 11. Roles & access
- **Assignment-driven views** — your everyday surface follows your **assignments**, so the inspector↔engineer flip needs no relabeling.
- **Variable admin access** = a base role + **per-person capability grants** (see cost/profitability, see all hours, manage billing, manage users, all-projects vs assigned-only). Extends the existing **portal-access override** pattern.
- **Director** = its own tier (cockpit access). **Office lady** = production-compiler surface (map completion + daily cards + report-out). Most staff = a minimal supplementary view.
- Foundation already started: the operations rail is role-aware (`app_nav.js`, admin-only links revealed via `/api/auth/me`, fail-closed).

## 12. Training (current detour — top priority until done)
OSP/ISP training app (`osp-training/` → `public/training/`): live, **competency-gated** completion (≥70% or interactive, server-enforced; no manual button), admin per-person progress + drill-down, self-signup (`trainee`), training-only lockdown, request-additional-access flow. **C2** is finishing the curriculum (254 lessons / 24 subjects: research → author → red-team, zero hallucinations, richer interactivity, accurate SVG diagrams). It's the onboarding tool for the 12. Detail: `docs/training_launch_design.md`.

## 13. Explicitly NOT building
Full accounting / AR / payroll (offsite) · ACAD replacement · field-tech splice tablets (paper stays) · big-corp bloat (RFIs, scheduling gantt, document control) unless a real pain demands it.

## 14. Integrations posture
QuickBooks / Workforce = **import-only, deferred**; hours model stays **source-agnostic** (`person, job, hours, date, billable`). The one near-term import worth doing is **Workforce CSV** (kills Carter's manual hours move). ACAD: not integrated/replaced — engineers redraw units in our map (simpler); **BOM exports out to Excel**.

## 15. Finalized sequence
1. **Finish training pivot** (C2 curriculum) — *in progress*.
2. **Phase D cleanup** — delete legacy inspection/permits routes (pre-authorized).
3. **Keystone cutover** — job board becomes the tool; retire legacy admin.
4. **Hours capture you trust** — engineer daily log + 1099 app + Workforce import + confidence layer.
5. **Map as Operations tab** — embed authed, full-screen, layers; engineers draw → BOM export; Excel cost catalog.
6. **Production tracker** — office completion marking + rollups + drops count-table; daily cards + report-out (RUS).
7. **Billing submission** packaging (methods, timing, rates, multi-code).
8. **Director cockpit** — profitability, projections, early-warning.
9. **Splice-on-map** (phased) + printable splice diagrams + drawing-viewport polish.
10. **Full permissions pass** — assignment-driven views + capability grants.
11. **Later:** real-time consolidation, global search polish, KMZ folder-sync, mobile/PWA.

## 16. Open items / inputs needed from Carter
- One real **sample of each submission** (RUS inspection, RUS design, non-RUS permitting) — defines the billing-submission format.
- Does **Workforce export CSV**? (enables the import).
- Final map version (dependent on his boss) — but the working version is enough to start integrating.
- Confirm alert thresholds when we reach the cockpit (fixed-fee %, RUS pace, utilization).

---
*Cross-refs: `ROADMAP.md` (phase mechanics + locked decisions), `docs/map_requirements.md` (map spec + delivered-tool diagnosis), `docs/projections_design.md`, `docs/budgets_design.md`, `docs/billing_keystone_design.md`, `docs/cutover_inventory.md`, `docs/training_launch_design.md`, memory `feature_service_area_routes_materials_map` / `project_map_requirements_spec`.*
