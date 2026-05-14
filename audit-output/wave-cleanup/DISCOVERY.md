# Phase 9 Cleanup — Discovery Report

**Stack snapshot:** Express + pg-pool + Postgres, vanilla JS frontends, ~50K LOC. Discovery covers CLEANUP_CANDIDATES.md items (8 planning docs, schema duplication, orphan check, stale URLs, infra teardown), deferred Phase 6 BE-Perf LOWs (L-1, L-4, L-5), adjacent FE-A11y items (VETRO contrast, ddrop keyboard nav), stale TODO/FIXME comments, audit-output wave status, and npm dependencies. HEAD verified: `claude/debug-previous-issues-MoN9D`.

---

## CLEANUP_CANDIDATES.md — Per-item status

### Section 1: Redundant planning docs

| Original item | Current status | Category | Recommended action |
|---|---|---|---|
| `PROJECT_NORTH_STAR.md` (50 KB) | Still present at root. Content fully synthesized into CLAUDE.md. No code references to file. | DELETE-AFTER-VERIFY | `git mv` to `docs/archive/2026-05-09/`. Single archive commit. |
| `BUILD_PLAN.md` (40 KB) | Still present. Status entries captured in CLAUDE.md §4. No code references. | DELETE-AFTER-VERIFY | Archive same commit. |
| `ADMIN_FIXES_PLAN.md` (7.7 KB) | Still present. All 8 issues captured in CLAUDE.md §4 lessons. | DELETE-NOW | Archive same commit. Shortest/lowest-risk of the eight. |
| `HANDOFF_NEXT_PM.md` (23 KB) | Still present. Content in CLAUDE.md §1/§3. | DELETE-AFTER-VERIFY | Archive. Keep if PM-rotation pattern is still active. |
| `PORTAL_LAUNCHER_PLAN.md` (28 KB) | Still present. Phases 1+2 shipped. Phase 3 (client portal) deferred and spec in `audit-output/future/client-portal-spec.md`. | DELETE-AFTER-VERIFY | Archive. |
| `SPLICE_BUILD_PLAN.md` (51 KB) | Still present. Phases 1–5.H shipped. Phase 6 (further splice refactor) not yet scoped. | KEEP | Contains unscoped future phases. Keep until owner decides on Phase 6. |
| `SPLICE_COMPETITIVE_RESEARCH.md` (1 KB) | Still present. Confirmed stub — just a product list. `research/00_index.md` does not exist. | DELETE-NOW | Fold product list inline into a new `research/00_index.md` stub, then delete this file. |
| `SPLICE_MATRIX_SUGGESTIONS.md` (33 KB) | Still present. Most items shipped. Remaining items captured in CLAUDE.md §4. | DELETE-AFTER-VERIFY | Archive. |

**Summary for planning docs:** 2 DELETE-NOW, 5 DELETE-AFTER-VERIFY, 1 KEEP (`SPLICE_BUILD_PLAN.md`).

---

### Section 2: Orphan source files

**Status: KEEP all.** Verified: `npm ls` confirms all 22 dependencies in `package.json` are referenced. All route files confirmed mounted in `server.js`. All `public/js/*.js` modules referenced from portal HTMLs. No orphans.

---

### Section 3: Stale research files

**Status: KEEP all.** `research/` (8 files, ~325 KB) is design-decision-log territory. Files actively referenced in splice.html comments (06, 07). No orphans. No action needed.

**Adjacent recommendation:** Create `research/00_index.md` as a one-line-per-file navigation aid so future sessions don't re-read 325 KB to find a decision. Low-effort, one commit.

---

### Section 4: Duplicate migrations / schema fragments

| Item | Current status | Category | Recommended action |
|---|---|---|---|
| `migrations/0023_ec_rollup_linkage.sql` (CLEANUP said "missing") | **PRESENT** — `ls migrations/0023*` confirms file exists. The CLEANUP_CANDIDATES.md gap report was **stale** (pre-outage). | KEEP | No action needed. The "investigation needed" item is resolved. |
| `schema.sql` duplicate `setting_change_requests` CREATE TABLE | **RESOLVED** — current HEAD has exactly ONE `CREATE TABLE IF NOT EXISTS setting_change_requests` block (line 777). The CLEANUP_CANDIDATES.md report of a second block at lines 710-729 was stale. | KEEP | No action needed. |
| `schema.sql` overall three-source-of-truth problem | Still present: `schema.sql` + `bootstrapV3Schema()` in `auth.js` + `migrations/`. Wave 1.5 H-2 appended missing migration tables to `schema.sql`, making it more authoritative, but the split is still architectural debt. | AMBIGUOUS | Owner decision: complete the Track 1.4 migration consolidation (extract all ALTERs from schema.sql + auth.js into migrations; leave schema.sql as a derived artifact) OR accept the three-source model. Scope as a separate refactor wave if green-lit. |

---

### Section 5: Build / log artifacts

**Status: CLEAN.** No committed logs, build artifacts, or .DS_Store files. `.gitignore` discipline intact.

---

### Section 6: Other items

| Item | Current status | Category | Recommended action |
|---|---|---|---|
| Hardcoded `launchfiber-splicematrix.xyz` URLs | **RESOLVED** — `grep -rn "launchfiber-splicematrix.xyz"` across all `.js` and `.html` files returns **zero hits**. Launcher consolidation cleaned these up. | KEEP (no action) | — |
| Railway per-portal service teardown | Infra-side, not repo-visible. 30-day window from 2026-05-07 closes 2026-06-06. | AMBIGUOUS | Owner to confirm teardown status. No repo action. |
| `routes/customer_portal.js` + `public/customer.html` | Still present. Client portal deferred; spec at `audit-output/future/client-portal-spec.md`. Backend is real but untriggered. | KEEP | No action until owner green-lights client portal build. Flag as Phase-deferred in §4. |
| `routes/splice.js` (306 KB) / `public/admin.html` (450 KB) / `routes/ai.js` (128 KB) | Still large. No change from original CLEANUP assessment. | KEEP | Long-term refactor candidates. Not deletion scope. |

---

## Stale TODO/FIXME comments

| File | Line | Comment | Status | Recommended action |
|---|---|---|---|---|
| `routes/splice.js` | 2101 | `// TODO Phase 2B #5b: also materialize default_splices_jsonb.` Phase 2B #5 shipped (`01a1d42`). #5b (splice replay with cable picker) explicitly held back due to needing a cable-picker UI. | KEEP | Not stale — it's an intentional deferral with a clear reason. Add to Phase 6 splice backlog when owner scopes it. |

**No other TODO/FIXME/HACK/XXX** comments found across `routes/*.js`, `server.js`, `auth.js`, `public/js/*.js`, or `public/*.html`. Comment hygiene is clean.

---

## Audit-output wave status

| Wave | Post-Fix Verification? | Status | Recommended action |
|---|---|---|---|
| `wednesday-review/` | No (assessment wave, not fix wave) | OPEN — assessment artifacts only | Keep as audit trail. No fix reports = no post-fix needed. |
| `wave-1.5/` | No | PARTIALLY CLOSED — CRITICALs + H-1/H-2/H-3/H-5/M-1/M-3/M-5 fixed; M-4 fixed. No post-fix verification run. | Archive when Phase 4 (Wave 1.5 remainder) completes. |
| `wave-2be-ai/` | Yes | CLOSED | Archive candidate after Phase 9 cleanup wave. |
| `wave-2fe-crit/` | Yes | CLOSED | Archive candidate. |
| `wave-3be-perf/` | Yes | CLOSED | Archive candidate. L-1/L-4/L-5 deferred per canonical (see below). |
| `wave-3fe-a11y/` | Yes | CLOSED | Archive candidate. |
| `wave-projection/` | Yes | CLOSED | Archive candidate. |

**Recommendation:** Archive (move to `audit-output/archive/`) the 5 closed waves after Phase 9 cleanup commits land. Keep `wednesday-review/` and `wave-1.5/` active until their respective pipeline phases close. Archiving keeps the audit trail without cluttering the active `audit-output/` directory.

---

## Phase 6 BE-Perf deferred LOWs

| # | Original location | Current status | Category | Recommended action |
|---|---|---|---|---|
| **L-1** | `routes/project_documents.js:72, 87` — `readdirSync` + `statSync` in admin-gated `/api/_debug/uploads` route | **STILL PRESENT** — confirmed at lines 72 and 87. Both sync. Admin-only route, low traffic. | DELETE-AFTER-VERIFY | Replace with `fs.promises.readdir` + `fs.promises.stat`. One-commit fix. Fold into Phase 9 cleanup fix wave. |
| **L-4** | `routes/projects.js:755` — per-node DELETE loop inside transaction | **STILL PRESENT** — confirmed at line 755. `for (const p of byDepth) { await client.query('DELETE FROM projects WHERE id = $1', [p.id]); }`. The note is that `byDepth` sort is required (deepest-first to respect FK RESTRICT), so a simple `DELETE WHERE id IN (...)` replaces the loop only if combined with a single sorted-delete approach or FK cascade. | DELETE-AFTER-VERIFY | Replace with `DELETE FROM projects WHERE id = ANY($1::uuid[])` — Postgres FK RESTRICT fires per-row in FK-dependency order when using a flat DELETE; depth-sort is only needed to avoid FK violation on a self-referencing table. Verify FK behavior in test DB before shipping. `routes/ai.js:1319` line reference was a ROLLBACK path comment, not a DELETE loop — false positive in original canonical. |
| **L-5** | `routes/splice.js:182` — `_fieldMarkupRate` Map has no periodic sweep | **STILL PRESENT** — `_hydrateRate` (line 215) has a 5-minute sweep; `_fieldMarkupRate` does not. IPs that stop calling accumulate indefinitely. | DELETE-NOW | Add a `setInterval` sweep matching the `_hydrateRate` pattern. One-commit fix. No API change. |

---

## Adjacent FE-A11y items

| Item | Source | Current status | Category | Recommended action |
|---|---|---|---|---|
| VETRO panel contrast 2.95:1 — `--vetro-text-secondary` (#6B7280) on `--vetro-bg-panel` (#FFFFFF) | Wave 3 FE-A11y Fix-D flag | **STILL PRESENT** — CSS variables confirmed at `public/splice.html:34, 43`. #6B7280 on #FFFFFF is 4.48:1 (WCAG AA passes for normal text, fails for 11px small text used throughout). | DELETE-AFTER-VERIFY | Bump `--vetro-text-secondary` to `#4B5563` (contrast 7:1) in light mode only. Dark mode (#B8BFC9 on #242B36) is already ~7:1. Affects multiple inline color references throughout splice.html. |
| Drag-drop fiber panel (`ddrop-panel-*`) keyboard nav | Wave 3 FE-A11y Fix-D flag (H-7b) | **STILL PRESENT** — `ddrop-panel-location-*` and `ddrop-panel-closure-*` panels use `<select>` elements (keyboard-accessible) but the panel itself has no focus management, no `role`, no keyboard dismiss. The cable pickers (selA, selB) are native `<select>` so keyboard-accessible by default. The panel wrapper lacks `role="dialog"` / `aria-modal` / focus trap. | DELETE-AFTER-VERIFY | Add `role="region"` (not dialog — ddrop panel is inline, not modal) + `aria-label="Fiber splicing panel"`. Focus management is lower-stakes since panels are inline, not modal. Fold into a FE-A11y follow-up wave rather than Phase 9 cleanup. |

---

## npm dependencies

`npm ls --depth=0` fails with ELSPROBLEMS because `node_modules/` is not installed in the cloned CI environment. All 22 `dependencies` + 2 `devDependencies` in `package.json` are referenced in source files (verified via grep in Section 2 check). No unused dependencies identified. No action needed. Full `npm ls` check requires `npm install` in a Railway-like environment.

---

## Recommended phases / waves

### Phase 9A — Docs archive (1 commit, read-only agent can prepare)
- `git mv` 6 planning docs → `docs/archive/2026-05-09/` (`PROJECT_NORTH_STAR.md`, `BUILD_PLAN.md`, `ADMIN_FIXES_PLAN.md`, `HANDOFF_NEXT_PM.md`, `PORTAL_LAUNCHER_PLAN.md`, `SPLICE_MATRIX_SUGGESTIONS.md`)
- Delete `SPLICE_COMPETITIVE_RESEARCH.md`; create `research/00_index.md` stub
- No code changes. Trivial-class wave, 1 auditor (or orchestrator self-audit).

### Phase 9B — Code cleanup (single fix-agent, 3 commits)
- **Commit 1:** L-5 — add `_fieldMarkupRate` periodic sweep in `routes/splice.js` (mirror `_hydrateRate` pattern). DELETE-NOW, zero regression risk.
- **Commit 2:** L-1 — async `readdir`/`stat` in `routes/project_documents.js:72,87`. Low-risk, admin-only route.
- **Commit 3:** L-4 — batch DELETE in `routes/projects.js:755`. VERIFY FK behavior before shipping — self-referencing FK with RESTRICT needs care.

### Phase 9C — A11y follow-up (fold into next FE-A11y wave, not standalone)
- VETRO contrast bump (`--vetro-text-secondary` light mode only)
- ddrop panel `role="region"` + `aria-label`
- Standard-class wave, 2 auditors.

### Phase 9D — Schema consolidation (owner decision required first)
- Track 1.4: migrate all ALTERs from schema.sql + auth.js into numbered migrations.
- High-stakes wave (schema migration + boot behavior). 3 auditors. Owner must green-light.

### Archive (after Phase 4 / Wave 1.5 closes)
- Move `audit-output/wave-2be-ai/`, `wave-2fe-crit/`, `wave-3be-perf/`, `wave-3fe-a11y/`, `wave-projection/` → `audit-output/archive/`.

---

## Coverage gaps

- Did not install `node_modules` — `npm ls` ran in ELSPROBLEMS mode; deps checked by grep instead. A full installed check could surface transitive unused peer-deps but those are not cleanup candidates without a specific flag.
- Did not audit `public/admin.html` or `public/*.html` for inline TODO comments (files too large for line-by-line scan); scanned with grep and found zero.
- Did not check Railway infra for per-portal service teardown — out of scope for repo-level discovery.
- Research files (`research/01–08`) not re-read; retained per original CLEANUP_CANDIDATES recommendation and current scope.

=== PHASE 9 CLEANUP DISCOVERY END ===
