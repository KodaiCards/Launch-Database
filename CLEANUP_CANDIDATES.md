# CLEANUP_CANDIDATES.md — survey only, NO DELETIONS

> Generated 2026-05-09 alongside the CLAUDE.md merge. Lists files that look unused, redundant, or out-of-place. **Nothing deleted in this commit.** Each candidate carries a recommended action; the audit pipeline must approve before any removal. The original 8 planning docs at root are deliberately preserved through the audit window.

---

## 1. Redundant planning docs

After the merge into `CLAUDE.md`, these originals are the highest-confidence delete candidates **once the audit pipeline approves**. Don't delete during the audit window — other auditors are running with their own clones referencing the docs by name.

| Path | Size | Why a candidate | Confidence | Recommended action |
|---|---|---|---|---|
| `PROJECT_NORTH_STAR.md` | 50 KB | Fully synthesized into CLAUDE.md §1, §3, §6, §7, §8 (gotchas), §10. Some content (Path B live-verification log) preserved verbatim under §5 / §11. | high (after audit) | archive to `docs/archive/2026-05-09/` |
| `BUILD_PLAN.md` | 40 KB | Per-feature-batch plan; §0.5 status entries fully captured in CLAUDE.md §5. Track 1.3 + 1.4 retained in CLAUDE.md §7. | high (after audit) | archive |
| `ADMIN_FIXES_PLAN.md` | 7.7 KB | All 8 issues + commits captured in CLAUDE.md §10. Post-fix "things NOT to touch" preserved. | high (after audit) | archive |
| `HANDOFF_NEXT_PM.md` | 23 KB | Ledger snapshot + working agreement + immediate next steps captured in CLAUDE.md §6, §7, §13. The session-pattern PM-rotation pattern is preserved. | medium (after audit) | archive — the manager working agreement may be useful as standalone if PM rotation continues |
| `PORTAL_LAUNCHER_PLAN.md` | 28 KB | Phases 1+2 commit log + permission matrix + UX persistence + SSE catalogue captured in CLAUDE.md §9. Future Phase 3 client portals retained. | high (after audit) | archive |
| `SPLICE_BUILD_PLAN.md` | 51 KB | All shipped phases (1 → 5.H) summarized in CLAUDE.md §8. Migration slot accounting + RESUME-HERE marker preserved. | medium (after audit) | archive — but consider keeping a slimmer `SPLICE_ROADMAP.md` for phase 6+ planning if owner decides to continue splice work |
| `SPLICE_COMPETITIVE_RESEARCH.md` | 1 KB | Stub document — only contains product list, no actual research. The real competitive content lives in `research/01_*.md` … `research/08_*.md`. | high | delete or fold the product list into `research/00_index.md` |
| `SPLICE_MATRIX_SUGGESTIONS.md` | 33 KB | Audit punch-list from 2026-05-07; most §3 critical bugs + §4 UX gaps shipped in Phases 5.E/F/G/H. The remaining unaddressed items captured in CLAUDE.md §7 and §8. | medium (after audit) | archive — preserve as a historical audit reference |

**Note**: README.md is NOT a candidate. Railway deploy steps still load-bearing for owner.

---

## 2. Orphan source files

Verified via `grep -rln "require.*<filename>"` across `*.js` files. Every Node module is referenced; no orphans.

| Path | Size | Status |
|---|---|---|
| `server.js` | ~50 KB | entry point — referenced by `package.json` start script |
| `auth.js` | ~34 KB | required by `server.js`, `routes/admin.js`, `routes/ai.js`, `automation.js` |
| `automation.js` | ~50 KB | required by `server.js` |
| `db.js` | ~11 KB | required by `server.js`, `auth.js` |
| `db_migrations.js` | ~4 KB | required by `server.js` |
| `portal_module.js` | ~49 KB | required by `server.js`, `routes/admin.js`, `routes/ai.js`, `automation.js` |
| `timeclock_module.js` | ~39 KB | required by `server.js`, `routes/_sse.js` |
| `invoice_generator.js` | ~55 KB | required by `server.js`, `routes/billing.js`, `routes/invoices.js` |
| `invoice_template_engine.js` | ~27 KB | required by `routes/invoice_templates.js` |
| `routes/*.js` | varies | every file is required by `server.js` or another routes module |
| `playwright.config.js` | ~2 KB | referenced by `npm run test:browser` |
| `public/js/*.js` | varies | all 27 modules referenced from `<script src="…">` in `public/admin.html` (or portal HTMLs) |

**Recommended action**: keep all. None orphan.

---

## 3. Stale research / experiments

`research/` contains the competitive corpus for the splice tool. Eight markdown files totaling ~325 KB. Each has been referenced from `SPLICE_BUILD_PLAN.md`, `SPLICE_MATRIX_SUGGESTIONS.md`, or `public/splice.html` (as comments).

| Path | Size | Why a candidate | Confidence | Recommended action |
|---|---|---|---|---|
| `research/01_ozmap_vetro.md` | 30 KB | Phase 4 (competitive-research-driven roadmap) shipped fully. Tier 1-3 of the §1 OZmap/VETRO findings landed (4.1-4.7). Future splice phases unlikely to re-mine this corpus. | low | keep — useful as a historical decision trail for "why did we build X like Y?" |
| `research/02_gis_platforms.md` | 35 KB | same | low | keep |
| `research/03_legacy_autocad.md` | 34 KB | DXF/KMZ workflow shipped (Phase 3D). DWG via OdaFileConverter explicitly skipped. | low | keep |
| `research/04_newer_others.md` | 22 KB | same | low | keep |
| `research/05_adjacent.md` | 35 KB | same | low | keep |
| `research/06_ui_patterns.md` | 38 KB | UI patterns shipped through Phase 5.A-5.H. Sections referenced from in-code comments. | low | keep — actively cited |
| `research/07_vetro_visual_match.md` | 48 KB | VETRO visual match shipped (Phase 5.C). Referenced from `public/splice.html` comments. | low | keep — actively cited |
| `research/08_vetro_deep_dive.md` | 78 KB | Deepest VETRO research shard. Likely fed Phase 5.D-5.H polish. | low | keep |

**Recommended action**: keep the entire `research/` directory. It's effectively design-decision-log territory. If anything, add a `research/00_index.md` summarizing each file's bottom-line recommendations so future Claudes don't re-read 325 KB to find a single answer.

---

## 4. Duplicate migrations / schema fragments

| Path | Size | Why a candidate | Confidence | Recommended action |
|---|---|---|---|---|
| `migrations/0023_*.sql` | — | **Slot 0023 is missing** from the migrations directory. Numbering jumps from 0022 to 0024. | n/a | investigate — was 0023 renamed during phase 4-5 churn, or is it actually missing? Confirm via `git log --all -- migrations/0023*` |
| `schema.sql` (lines 710-729 + 796-816) | n/a | **Duplicate `CREATE TABLE IF NOT EXISTS setting_change_requests`** — same table created twice in the same file. The second CREATE has comments explaining "Setting change requests (the propose-and-approve queue)" suggesting it's the intended canonical block; the first is bare. PostgreSQL's `IF NOT EXISTS` makes this idempotent so it doesn't break, but it's a maintenance trap (which one is canonical?). | high | consolidate to one block in a future cleanup commit. Don't touch in this audit pass. |
| `schema.sql` overall | 58 KB | Per CLAUDE.md §12, schema.sql + `bootstrapV3Schema()` in `server.js` + `migrations/` are three sources of schema truth. Track 1.4 was scoped to consolidate but the migration is half-done. Schema.sql still runs every boot and can resurrect dropped objects (Path B audit found this exact bug). | medium | NOT a deletion candidate — it's currently load-bearing. Recommended longer-term action: complete Track 1.4 by extracting all idempotent ALTERs from schema.sql + bootstrapV3Schema into individual `migrations/NNNN_*.sql` files, then leave schema.sql empty or remove it. Track separately as a refactor task. |

---

## 5. Build / log artifacts

`.gitignore` already covers: `node_modules/`, `npm-debug.log*`, `.env*`, `uploads/`, `.DS_Store`, `Thumbs.db`, `*.swp`, `.vscode/`, `.idea/`, `~$*`, `*.docx`, `.claude/*` (with `!.claude/agents/` re-include), `package-lock.json`, `playwright-report/`, `test-results/`.

Verified via `find . -type f \( -name "*.log" -o -name ".DS_Store" -o -name "*.swp" -o -name "Thumbs.db" \)`: **no committed build/log artifacts found**.

Verified `package-lock.json` / `playwright-report/` / `test-results/` / `dist/` / `build/`: **none committed**.

**Recommended action**: none. `.gitignore` discipline is good.

---

## 6. Other

| Path | Size | Why a candidate | Confidence | Recommended action |
|---|---|---|---|---|
| `routes/splice.js` | 306 KB | Largest single file in the repo. Not a deletion candidate — it's the splice subsystem's whole API surface. But the size resists refactoring and creates merge-conflict risk during parallel work. | n/a (not for deletion) | longer-term: split along subsystem boundaries (locations, cables, closures, splices, imports, validation, PDF). Track as a refactor task. |
| `public/admin.html` | 450 KB | ~10000-line SPA. Same comment as splice.js — not deletion territory, but a pre-build-step parse cost on every page load. | n/a | longer-term: code-split via the existing `public/js/*.js` extraction pattern; consider lazy-loading tab modules. |
| `routes/ai.js` | 128 KB | Large AI handler. Has been progressively extracted from `server.js`; further splitting (tool definitions vs executor vs approval gate vs system prompt) is possible. | n/a | longer-term refactor candidate. |
| `routes/customer_portal.js` | 17 KB | Backend for the customer portal which has been "Under Construction" placeholder since 2026-05. If owner doesn't green-light the customer portal soon, this is dead code accumulating drift. | low | keep until owner decides. Flag as "deferred" in the next planning doc. |
| `public/customer.html` | 23 KB | Same — placeholder UI pointing at deferred backend. | low | keep |
| `public/admin.html` rendered "Under Construction" Clients tab | n/a | `loadClientProgress()` dispatch is commented out per BUILD_PLAN §0.5. The supporting code lives but the surface is invisible. | low | keep |
| Old per-portal Railway services (admin, splice, design, permitting, timeclock — separate URLs like `launchfiber-splicematrix.xyz`) | infra | PORTAL_LAUNCHER_PLAN's 30-day teardown window from 2026-05-07 closes around 2026-06-06. If still running past that, it's spend on QR-code link compatibility. | medium | infra-side, not repo. Confirm with owner whether teardown happened. |
| Hardcoded `launchfiber-splicematrix.xyz` references | unknown | PROJECT_NORTH_STAR §6.B mentions hardcoded references in `public/design.html` (nav-tab) and `public/index.html` (now `public/admin.html`, Portals dropdown). Phase 1 launcher consolidation should have search-and-replaced these. | unknown | search the codebase for `launchfiber-splicematrix.xyz` and confirm zero hits. If hits remain, that's a stale-link bug. |
| `migrations/README.md` | 2 KB | Migration authoring rules. Referenced from PROJECT_NORTH_STAR §9. | n/a | keep |
| `.claude/agents/project-tracking.md` | 10 KB | Team-shared subagent persona, version-controlled per `.gitignore` re-include. Per HANDOFF_NEXT_PM, used by the manager pattern for non-splice admin work. | n/a | keep |
| `nixpacks.toml` + `railway.json` | small | Railway deploy config. Active. | n/a | keep |
| `playwright.config.js` | 2 KB | Browser test config. Active. | n/a | keep |

---

## Summary

| Category | Candidates | Highest-confidence deletes |
|---|---|---|
| 1. Redundant planning docs (post-merge) | 8 | 6 (after audit window) |
| 2. Orphan source files | 0 | 0 |
| 3. Stale research / experiments | 0 (all referenced) | 0 |
| 4. Duplicate migrations / schema fragments | 2 schema-level | 1 (duplicate `setting_change_requests` block in schema.sql) |
| 5. Build / log artifacts | 0 | 0 |
| 6. Other | 7 flagged | 0 deletes; several refactor candidates |

**Total candidates**: 17 items flagged. **Recommended deletions in this commit**: 0 (the merge instructions explicitly forbid deletion until the audit pipeline approves).

**Pre-approval delete list (when audit clears)**:

1. `PROJECT_NORTH_STAR.md` → archive
2. `BUILD_PLAN.md` → archive
3. `ADMIN_FIXES_PLAN.md` → archive
4. `HANDOFF_NEXT_PM.md` → archive
5. `PORTAL_LAUNCHER_PLAN.md` → archive
6. `SPLICE_BUILD_PLAN.md` → archive
7. `SPLICE_COMPETITIVE_RESEARCH.md` → delete (stub) or fold into `research/00_index.md`
8. `SPLICE_MATRIX_SUGGESTIONS.md` → archive
9. Consolidate the duplicate `setting_change_requests` CREATE TABLE in `schema.sql` (separate cleanup commit, not docs-only)

**Investigation needed**:

- `migrations/0023_*.sql` slot — is it deliberately missing or was a file lost?
- Any hardcoded `launchfiber-splicematrix.xyz` URLs surviving the launcher consolidation?
- Per-portal Railway service teardown status (infra-side).
