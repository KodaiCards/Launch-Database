# Launch-DB Phase Queue State Assessment

**Date:** 2026-05-20
**Branch:** `agent/launch-db-phase-assessment`
**Scope:** READ-ONLY audit of Launch-DB Phases 1-11 (CLAUDE.md §4 queue)
**Special coverage:** Picker swarm commits (B1 timeclock, B2a design, B2b permitting, Phase C rollup leak, D3 SA endpoint, Phase A resolve-or-create)

---

## Per-Phase Verdict Table

| # | Title | Verdict | Key Evidence |
|---|---|---|---|
| 1 | Wave 1.7 Demo-blocker cleanup | **DONE** | Wave 1.7 commits live only on old `claude/debug-previous-issues-MoN9D` branch. Equivalent fixes confirmed on main via intervening waves: FE-Crit M-6 (confirmDialog), FE-Crit H-3 (try/catch), FE-A11y (SSE wiring), OSP-RW SPA (training navigation). Timeclock `leaves_only` surgical fix (`3d66c69` on dev) is superseded by B1 full cascade (`fd3d914` on main). Admin Clients tab hide confirmed `admin.html:666`. CI-green check no longer blocking — wave's intent fully absorbed. |
| 2 | Projection wave (Path B) | **DONE** | `audit-output/wave-projection/POST_FIX_VERIFICATION.md` — all 25 canonical items (H-1..H-8, ARC-1..ARC-3, M-1..M-6, L-1..L-4, BE-1, BE-3, FE-1..FE-5) ADDRESSED. Formal closure document exists. |
| 3 | Wave 2 FE-Crit remainder | **DONE** | `audit-output/wave-2fe-crit/POST_FIX_VERIFICATION.md` — all 18 canonical items (H-1..H-8, M-1..M-6, L-1..L-3, NF-1) ADDRESSED. Formal closure document exists. |
| 4 | Wave 1.5 remainder | **PARTIALLY_DONE** | All canonical items fixed across fix reports: CRIT items via `0cedaed` (hand-applied by orchestrator); HIGH items via `e639e98` (9 routes + requireAuth), `eefd72b` (H-2 schema.sql append), `fc6998c` (H-3 users table); M-1 jobs.js via `FIX_REPORT_M1.md` at `server.js:525`; M-3 e.message leaks via portal_module.js sweep; NF-1/NF-2 (project_detail + budgets unauthenticated) caught and fixed in H-1 broad sweep. **GAP: no `POST_FIX_VERIFICATION.md` exists for Wave 1.5.** Items confirmed fixed by code inspection (server.js:543/621/637/533 requireAuth present; portal_module.js actorOf + sanitized errors; schema.sql H-2/H-3 tables present), but formal post-fix closure document is missing. |
| 5 | Wave 2 BE-AI remainder | **DONE** | `audit-output/wave-2be-ai/POST_FIX_VERIFICATION.md` — all 12 canonical items + 2 residual bypass gaps ADDRESSED. Formal closure document exists. |
| 6 | Wave 3 BE-Perf remainder | **DONE** | `audit-output/wave-3be-perf/POST_FIX_VERIFICATION.md` — H-1..H-4, M-1..M-5 ADDRESSED. LOWs L-1..L-5 explicitly deferred per canonical; L-1, L-4, L-5 subsequently absorbed into Phase 11 cleanup. Formal closure document exists. |
| 7 | Wave 3 FE-A11y remainder | **DONE** | `audit-output/wave-3fe-a11y/POST_FIX_VERIFICATION.md` — all 18 canonical items (H-1..H-8, M-1..M-8, L-1..L-2) ADDRESSED. Formal closure document exists. |
| 8 | UI-A Polish | **DONE** | `audit-output/wave-ui-a-polish/POST_FIX_VERIFICATION.md` — all 3 items VERIFIED CORRECT: training back-link (fixed header, z-index 9999, body padding-top), dark-mode logo inversion (6 portals), square tile layout (9/9 requirements pass). Formal closure document exists. |
| 9 | Design Picker D1/D2/D3 | **DONE + EXCEEDED SCOPE** | `1473499` fixed all 3 original bugs: D1 `clientId` declared at `design.html:924`, D2 `project_type=` param aligned, D3 rollup leak suppressed. Subsequently EXCEEDED: Phase C (`826b4b4`) added server-side `?leaves_only` opt-in param immunizing all callers; Phase B2a (`e9d4738`) + B2b (`ee4e0bf`) implemented full 4-tier cascade pickers in design.html and permitting.html. Audit files: `audit-output/wave-cleanup/FIX_REPORT_9*` confirm sub-phases. |
| 10 | Timeclock picker P2-A/B/C | **DONE** | Full 4-tier cascade (Client→Program→SA→Job) implemented in `fd3d914`. All Carter-locked requirements met: sessionStorage stickiness (`_ssGet`/`_ssSet`/`_ssDel` with `lf_tc_{prefix}_{field}` key convention), no auto-create (`POST /api/projects/resolve-or-create` is SELECT-only, returns 422 on miss per `routes/projects.js:732`), completed projects hidden from clock-in. Supporting endpoints: `GET /api/clients/:client_id/service-areas` at `routes/clients.js:89`, `POST /api/projects/resolve-or-create` at `routes/projects.js:732`. Shared `public/js/project_picker.js` with `_looksLikeLeaf()` guard. |
| 11 | Cleanup per CLEANUP_CANDIDATES.md | **PARTIALLY_DONE** | Phase 9A docs: `FIX_REPORT_9A_DOCS.md` — BUILD_PLAN.md, HANDOFF_NEXT_PM.md, ADMIN_FIXES_PLAN.md, SPLICE_COMPETITIVE_RESEARCH.md deleted; PROJECT_NORTH_STAR.md/PORTAL_LAUNCHER_PLAN.md/SPLICE_MATRIX_SUGGESTIONS.md kept with code references. Phase 9B code: `FIX_REPORT_9B_CODE.md` — `_fieldMarkupRate` sweep (`28eb2c7`), async readdir/stat (`cc5ae0e`), batch DELETE (`a800044`). Phase 9C a11y: `FIX_REPORT_9C_A11Y.md` — VETRO contrast bumped `#6B7280`→`#4B5563` (7.56:1 on white), ddrop panel ARIA added. **GAP: no post-fix RT verification exists for any Phase 11 sub-phase (9A, 9B, or 9C).** All work was done by fix agents without independent read-only verification. |

---

## Summary Statistics

| Verdict | Count | Phases |
|---|---|---|
| DONE | 8 | 1, 2, 3, 5, 6, 7, 8, 9, 10 |
| PARTIALLY_DONE | 2 | 4, 11 |
| STILL_NEEDED | 0 | — |
| OBSOLETED_BY | 0 | — |

Both PARTIALLY_DONE phases have all underlying code fixes confirmed present. The gaps are procedural (missing closure documents), not substantive (missing code fixes).

---

## Recommended Next 3 Phases (Priority Order)

### Priority 1 — Wave 1.5 POST_FIX_VERIFICATION (Phase 4 closure)

**Why first:** Wave 1.5 contains CRITICAL and HIGH security items (auth bypass via no-op requireAuth on 9 routes, schema drift on fresh deploy, Puppeteer SSRF, permit_manager audit forgery). These were the highest-severity items in the entire queue. All code fixes are confirmed on main, but no formal read-only verification document exists. A security wave without a closure document leaves the project without an audit trail for the most sensitive fixes.

**Action:** Dispatch a read-only post-fix verification agent (Sonnet, 2 framings) scoped to `audit-output/wave-1.5/POST_FIX_VERIFICATION.md`. Agent reads the existing canonical (`CANONICAL.md`) and three fix reports (`FIX_REPORT_CRIT.md`, `FIX_REPORT_HIGH.md`, `FIX_REPORT_M1.md`), then verifies each item against current `server.js`, `portal_module.js`, `schema.sql`, and affected route files. Cost estimate: ~150K Sonnet × 2 framings = ~300K.

**Verification targets (canonical items to re-confirm):**
- C-1: Puppeteer SSRF (navigation lock + allowlist)
- C-2/C-3: Auth bypass on inspection + potential_permits routes
- H-1: 9 routes now receiving requireAuth (pricing, clients, contracts, engineering_contracts, project_detail, budgets, concentrators, staff, reports)
- H-2: ec_service_areas, job_assignments, splice_closure_public_tokens in schema.sql
- H-3: users table with tokens_invalid_after, theme, extra_teams, dashboard_layout columns
- H-5: actorOf(req) for updated_by in portal_module.js
- M-1: jobs.js requireAuth at server.js:525
- M-3: e.message suppression (19+ locations in portal_module.js)
- NF-1/NF-2: project_detail + budgets unauthenticated (fixed in H-1 broad sweep)

---

### Priority 2 — Phase 11 Post-Fix Verification (Cleanup closure)

**Why second:** Phase 11 cleanup touched code paths — async fs ops in routes, batch DELETE in projects.js, field markup rate sweep in splice.js — without any independent read-only verification. The VETRO contrast change affects visual accessibility for daily users. These are lower-severity than Wave 1.5 but still need the standard closure document per the mandatory pipeline.

**Action:** Dispatch a read-only post-fix verification agent (Sonnet, 2 framings) scoped to `audit-output/wave-cleanup/POST_FIX_VERIFICATION.md`. Agent reads `FIX_REPORT_9A_DOCS.md`, `FIX_REPORT_9B_CODE.md`, `FIX_REPORT_9C_A11Y.md`, then verifies each against current codebase. Cost estimate: ~120K Sonnet × 2 framings = ~240K.

**Verification targets:**
- 9A: Confirm deleted docs are gone; confirm kept docs still have live code references (PORTAL_LAUNCHER_PLAN.md, PROJECT_NORTH_STAR.md, SPLICE_MATRIX_SUGGESTIONS.md)
- 9B: `_fieldMarkupRate` no longer appears in splice.js; `readdir`/`stat` calls use async variants; batch DELETE uses `ANY($1::uuid[])` pattern at routes/projects.js:929
- 9C: VETRO `--vetro-text-secondary` CSS variable is `#4B5563`; ddrop panel has ARIA attributes; contrast ratio ≥ 4.5:1 confirmed

---

### Priority 3 — Side-Channel Branch Audit: `claude/splice-matrix-railway-setup-IIG3Q`

**Why third:** This branch has been sitting uncharacterized since the 2026-05-15 reality-reconciliation discovery. CLAUDE.md §4 notes it as "uncharacterized — read-only audit" and it has never been assessed. The splice subsystem is the largest single file in the codebase (~6800 lines per CLAUDE.md §2) and primary contractor-facing surface (QR-on-PDF → field markup flow). Any unreviewed commits to the splice matrix setup could represent either valuable improvements to merge or problematic changes to discard.

**Action:** Dispatch a read-only discovery agent scoped to `audit-output/side-channel-splice-matrix-IIGQ/DISCOVERY.md`. Agent runs `git log --oneline origin/claude/splice-matrix-railway-setup-IIG3Q` to characterize commits, `git diff main...origin/claude/splice-matrix-railway-setup-IIG3Q --stat` to see scope, then reads changed files at the diff level. Produces MERGE/SCRAP/PARTIAL recommendation per commit. Cost estimate: ~100K Sonnet.

---

## Notes on Phase 10 Cascade Implementation

The picker swarm commits changed the architecture more substantially than the original P2-A/B/C spec anticipated:

1. **`mountCascade()`** shared engine in timeclock.html handles all 4 tiers for both clock-in and switch-project modals.
2. **`project_picker.js`** (new shared file) provides `populateProjectPicker()` used by design.html, permitting.html, and timeclock.html.
3. **`resolve-or-create` is SELECT-ONLY** — returns `{project_id}` for existing leaves only, 422 on miss. No creation path. This is correct per Carter's Q3 lock ("no auto-create").
4. **F4 (from `audit-output/wave-timeclock-projects-picker/CANONICAL.md`):** The 12 "Inspection" labels are REAL leaf nodes (jobs named "Inspection" under different service areas), not rollup leaks. The `leaves_only=true` param correctly returns them all; the cascade picker disambiguates by showing Client → SA context so duplicately-named leaves are distinguishable.

---

## Evidence Methodology

All verdicts based on direct file reads of:
- `audit-output/wave-*/POST_FIX_VERIFICATION.md` (formal closure docs)
- `audit-output/wave-*/FIX_REPORT_*.md` (fix agent reports)
- `audit-output/wave-*/CANONICAL.md` (canonical finding lists)
- `audit-output/picker-cascade/CASCADE_UX.md` (cascade spec)
- `audit-output/wave-timeclock-projects-picker/CANONICAL.md` (timeclock canonical)
- `audit-output/wave-cleanup/DISCOVERY.md` + `FIX_REPORT_9*.md` (cleanup reports)
- Current main-branch code: `server.js`, `portal_module.js`, `schema.sql`, `routes/clients.js`, `routes/projects.js`, `public/timeclock.html`, `public/design.html`
- Git log on main for picker swarm commits

No code was modified during this audit.

=== LAUNCH-DB PHASE QUEUE STATE ASSESSMENT END ===
