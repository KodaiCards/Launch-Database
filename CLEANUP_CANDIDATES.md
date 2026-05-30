# CLEANUP_CANDIDATES.md — current state survey

> **Generated 2026-05-30** (Wave 225 refresh). Living doc reflecting current dead/likely-dead code, refactor candidates, and Carter-decision-blocked items. Original snapshot (2026-05-09) is preserved in git history.

---

## STATUS

- **Active cleanup candidates:** 6
- **Already actioned:** 9 (since 2026-05-09 baseline)
- **Deferred (needs Carter input):** 3
- **Total file size of repo:** ~25 KLOC top-level JS/HTML in scope

---

## ALREADY ACTIONED

| Candidate (2026-05-09) | Resolution | Commit / Notes |
|---|---|---|
| `BUILD_PLAN.md` | DELETED (Phase 9A) | `3ebeb23` 2026-05-14 |
| `HANDOFF_NEXT_PM.md` | DELETED (Phase 9A) | `3ebeb23` 2026-05-14 |
| `ADMIN_FIXES_PLAN.md` | DELETED (Phase 9A) | `ab96013` 2026-05-14 |
| `SPLICE_COMPETITIVE_RESEARCH.md` | DELETED (stub, no refs) | `ab96013` 2026-05-14 |
| Duplicate `setting_change_requests` block in `schema.sql` | RESOLVED — single CREATE block at line 473 only | verified via grep |
| Missing `migrations/0023_*.sql` slot | RESOLVED — `0023_ec_rollup_linkage.sql` exists | verified `ls migrations/` |
| Hardcoded `launchfiber-splicematrix.xyz` references | RESOLVED — zero hits in `public/` `routes/` `server.js` | grep clean |
| `research/00_index.md` recommendation | NOT CREATED — research dir intact, 8 files, ~325 KB | low priority |
| `.gitignore` build/log artifact hygiene | STILL CLEAN — zero `*.log` / `.DS_Store` / `dist/` / `build/` committed | unchanged |

---

## ACTIVE CANDIDATES

### A1. Stale planning docs (4 root-level — still preserved)

| Path | Size | Status | Risk | Reclaim | Recommended wave |
|---|---|---|---|---|---|
| `PROJECT_NORTH_STAR.md` | 51 KB | Referenced from inline comments in `routes/projects.js`, `routes/ai.js`, `routes/splice.js`, `migrations/0010_splice_templates.sql` per Phase 9A note | LOW (deletion would orphan comment refs) | 51 KB | Strip the inline comment refs first, then archive |
| `PORTAL_LAUNCHER_PLAN.md` | 28 KB | Referenced in CLAUDE.md §2 body | LOW | 28 KB | Archive after CLAUDE.md sweeps the §2 ref |
| `SPLICE_BUILD_PLAN.md` | 51 KB | Phases 1→5.H all shipped; still cited from `SPLICE_MATRIX_SUGGESTIONS.md` | LOW | 51 KB | Archive together with SPLICE_MATRIX_SUGGESTIONS.md |
| `SPLICE_MATRIX_SUGGESTIONS.md` | 33 KB | Audit punch-list from 2026-05-07, most items shipped | LOW | 33 KB | Archive as historical reference |

**Recommended wave:** "doc archive sweep" — move all 4 to `docs/archive/2026-05-30/` after a 1-commit cleanup of the inline-comment refs in the 4 source files. Total reclaim: ~163 KB tree weight (no runtime impact).

### A2. Largest single files (refactor candidates, NOT deletions)

| Path | Size | Lines | Why a candidate | Risk to refactor |
|---|---|---|---|---|
| `public/admin.html` | 565 KB | 9779 | Largest file in repo. SPA monolith. Pre-build parse cost on every load. | HIGH — touches every admin portal feature; needs incremental tab-extraction |
| `routes/splice.js` | 340 KB | 7314 | Largest backend route file. Whole splice API surface. | HIGH — needs subsystem split (locations / cables / closures / splices / imports / PDF) |
| `routes/ai.js` | 162 KB | 2825 | Large AI handler. Tool defs + executor + approval gate + system prompt all in one. | MED — splittable by concern with little risk |

**Recommended wave:** these are explicit refactor candidates, not cleanup. Each is its own multi-wave program. No immediate action.

### A3. Deferred surfaces (likely-dead unless owner activates)

| Path | Size | Status | Risk |
|---|---|---|---|
| `routes/customer_portal.js` | 17 KB | Backend wired but UI still "Under Construction" placeholder (line 145 of `public/customer.html`) | LOW — no users hit it; deletion frees 17 KB but loses 6+ months of pre-built scaffolding |
| `public/customer.html` | 24 KB | Placeholder UI; 434 lines | LOW |
| `loadClientProgress()` dispatch in `public/admin.html` | n/a | 3 hits; per old BUILD_PLAN §0.5 these were commented out; verify state | LOW |

**Recommended action:** keep all. Customer portal scope is queued behind Client Portal v1 (E1 shipped this session — see CLAUDE.md). Reassess after Client Portal lands in prod.

---

## DEFERRED (needs Carter input)

| # | Question | Blocks |
|---|---|---|
| D1 | Should `docs/archive/<date>/` be the canonical archive path for retired planning docs? Directory does not yet exist. | A1 archive sweep |
| D2 | Customer portal — keep `routes/customer_portal.js` + `public/customer.html` for future activation, or delete now that Client Portal v1 covers the use case? | A3 deferred surfaces |
| D3 | Are the per-portal Railway services (`launchfiber-splicematrix.xyz` etc.) still running? Repo refs are clean, but infra-side teardown status unknown. | infra spend |

---

## NOTES — pattern observations (2026-05-30)

- **Legacy/TODO marker hotspots** (low signal): `server.js` 3, `public/admin.html` 2, `routes/ai.js` 2, `routes/splice.js` 1, `routes/jobs.js` 1, `public/js/jobs_settings.js` 1, `public/design.html` 1. No file is choked with technical debt markers.
- **Migration count growth:** 0001 → 0061 (omitting 0059), now 60 migrations + README. Cadence ~2-3 per session this year. No duplicates, no gaps post-0023 resolution.
- **schema.sql discipline:** dropped from 58 KB → ~145 KB (3666 lines, regenerated via `npm run schema:sync` from migrations). Still load-bearing per CLAUDE.md §12 but no longer hand-authored.
- **`research/` directory:** 8 files, ~325 KB, all referenced from splice docs/comments. Treat as design-decision-log; keep indefinitely.
- **Build artifact hygiene:** `.gitignore` still good. Zero committed `.log` / `.DS_Store` / `dist/` / `build/` / `node_modules/`.
- **`public/training/` dist:** committed pre-built artifact per OSP-RW Strategy A. Not a cleanup candidate — it's the active production surface.

---

## Summary

Highest-leverage cleanup right now: **A1 doc archive sweep** (4 planning docs → `docs/archive/2026-05-30/` after stripping 4 inline comment refs). Zero runtime risk, ~163 KB tree-weight reduction, removes documentation drift hazard for next Claude.

Everything else is either refactor-class (A2 — own multi-wave program), gated on Carter decision (D1-D3), or already actioned.
