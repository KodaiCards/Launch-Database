# Phase 11 (Cleanup per CLEANUP_CANDIDATES.md) — Post-Fix Verification (Independent Closure)

**Date:** 2026-05-20
**Branch read:** `main` HEAD
**Agent role:** READ-ONLY post-fix verification — produces closure document only
**Write-path constraints acknowledged:** only `audit-output/cleanup-phase11/POST_FIX_VERIFICATION_2026-05-20.md` written.

**Source documents read:**
- `CLEANUP_CANDIDATES.md` — original scope (17 flagged items, 9 delete/archive candidates)
- `audit-output/wave-cleanup/FIX_REPORT_9A_DOCS.md` — doc deletions
- `audit-output/wave-cleanup/FIX_REPORT_9B_CODE.md` — async fs, batch DELETE, _fieldMarkupRate sweep
- `audit-output/wave-cleanup/FIX_REPORT_9C_A11Y.md` — VETRO contrast + ddrop ARIA
- `audit-output/launch-db-queue-state-2026-05-20.md` — gap identification

---

## Executive Summary

Phase 11 cleanup is split into 3 sub-phases (9A docs, 9B code, 9C a11y), each verified independently below. All code changes are confirmed on current main HEAD. The CLEANUP_CANDIDATES.md investigation items (migration 0023 slot, stale hardcoded URLs, duplicate schema block) are resolved — in each case the concern turned out to be a false alarm at current HEAD.

**Overall verdict: GREEN** — all Phase 11 fixes confirmed present; no regressions detected; one structural note (CLEANUP_CANDIDATES.md item §4 schema duplicate) is resolved at current HEAD.

---

## Sub-phase 9A — Planning Doc Deletions

**Source:** `audit-output/wave-cleanup/FIX_REPORT_9A_DOCS.md`

### Items DELETED (confirmed absent at HEAD)

| File | Status | Evidence |
|---|---|---|
| `ADMIN_FIXES_PLAN.md` | **VERIFIED DELETED** | `ls ADMIN_FIXES_PLAN.md` → "No such file or directory" |
| `SPLICE_COMPETITIVE_RESEARCH.md` | **VERIFIED DELETED** | `ls SPLICE_COMPETITIVE_RESEARCH.md` → "No such file or directory" |
| `BUILD_PLAN.md` | **VERIFIED DELETED** | `ls BUILD_PLAN.md` → "No such file or directory" |
| `HANDOFF_NEXT_PM.md` | **VERIFIED DELETED** | `ls HANDOFF_NEXT_PM.md` → "No such file or directory" |

### Items KEPT (confirmed present with live references)

| File | Status | Evidence |
|---|---|---|
| `PROJECT_NORTH_STAR.md` | **VERIFIED KEPT** | File exists; `routes/projects.js:329` references it: `// hours. The Path B post-Path-B note in PROJECT_NORTH_STAR §6.B` |
| `PORTAL_LAUNCHER_PLAN.md` | **VERIFIED KEPT** | File exists; referenced by CLAUDE.md body text |
| `SPLICE_MATRIX_SUGGESTIONS.md` | **VERIFIED KEPT** | File exists; referenced by `SPLICE_BUILD_PLAN.md` |

### Verdict: VERIFIED

All 4 delete candidates are gone. All 3 kept docs exist and have confirmed live references. Grep methodology in FIX_REPORT_9A_DOCS.md (searching code/HTML/SQL/md files for each filename) was sound — no orphaned doc deletions.

---

## Sub-phase 9B — Code LOWs (L-1, L-4, L-5 from Wave 3 BE-Perf)

**Source:** `audit-output/wave-cleanup/FIX_REPORT_9B_CODE.md`

### L-5 — `_fieldMarkupRate` Map TTL sweep

**Verified by reading:** `routes/splice.js:182-193`

```js
const _fieldMarkupRate = new Map(); // ip → array<timestamp ms>
const FIELD_MARKUP_LIMIT = 30;
const FIELD_MARKUP_WINDOW_MS = 60 * 1000;
// Periodic sweep so the Map doesn't grow unbounded for IPs that stop calling.
// Mirrors the _hydrateRate sweep pattern below. unref() so it doesn't
// prevent process exit in tests.
setInterval(() => {
  const cutoff = Date.now() - FIELD_MARKUP_WINDOW_MS;
  for (const [ip, arr] of _fieldMarkupRate) {
    if (!arr.some(t => t > cutoff)) _fieldMarkupRate.delete(ip);
  }
}, 5 * 60 * 1000).unref();
```

`setInterval` sweeps every 5 minutes, evicting IPs whose last timestamp is older than `FIELD_MARKUP_WINDOW_MS` (1 minute). `.unref()` prevents blocking test exit. Pattern mirrors the `_hydrateRate` sweep at line 217.

**Verdict: VERIFIED.** Map no longer grows unbounded for IPs that stop calling the field-markup endpoints.

---

### L-1 — Sync fs in admin debug route

**Verified by reading:** `routes/project_documents.js:73, 86`

```js
const onDisk = await fsp.readdir(uploadDir);
```
```js
try { return acc + (await fsp.stat(path.join(uploadDir, f))).size; } catch { return acc; }
```

`fsp = fs.promises` — async variants used. `readdirSync` and `statSync` are absent from this file.

**Verified:** confirmed no `readdirSync` or `statSync` calls remain in `routes/project_documents.js`:

```
grep -n "readdirSync\|statSync" routes/project_documents.js
```
→ zero hits

**Verdict: VERIFIED.** Blocking sync fs calls replaced with async equivalents. Event loop no longer blocked during directory scan in admin debug route.

---

### L-4 — Per-node DELETE loop in transactions

**Three locations verified:**

**`routes/projects.js:929`:**
```js
await client.query('DELETE FROM projects WHERE id = ANY($1::uuid[])', [projectIds]);
```

**`routes/ai.js:1108`:**
```js
await pool.query('DELETE FROM projects WHERE id = ANY($1::uuid[])', [allIds]);
```

**`routes/contracts.js:152`:**
```js
await client.query('DELETE FROM projects WHERE id = ANY($1::uuid[])', [allIds]);
```

All three locations use single-statement batch DELETE with `ANY($1::uuid[])`. The per-node sort+loop pattern is gone from all three.

**FK safety note (from FIX_REPORT_9B_CODE.md):** Postgres evaluates `ON DELETE RESTRICT` at end-of-statement for a multi-row DELETE — the entire tree is removed atomically, so no remaining row references a deleted parent when the constraint check fires. Correct per Postgres docs.

**Verdict: VERIFIED.** All three DELETE loops replaced with batch statements. No N+1 deletion overhead on project trees. No FK constraint violations possible (end-of-statement evaluation).

---

## Sub-phase 9C — FE-A11y (VETRO contrast + ddrop ARIA)

**Source:** `audit-output/wave-cleanup/FIX_REPORT_9C_A11Y.md`

### VETRO text-secondary contrast

**Verified by reading:** `public/splice.html:43`

```css
  --vetro-text-secondary:#4B5563;
```

Light-mode value is `#4B5563` (not the original `#6B7280`).

**Verified dark mode unchanged:** `public/splice.html:136`
```css
  --vetro-text-secondary:#B8BFC9;
```

Dark mode retains `#B8BFC9`.

**Contrast verification (from FIX_REPORT_9C_A11Y.md, independently confirmable):**
- `#4B5563` on `#FFFFFF`: 7.56:1 (WCAG AA and AAA pass)
- `#4B5563` on `#F0F2F5`: 6.74:1 (WCAG AA pass)
- `#4B5563` on `#FAFAFA`: 7.24:1 (WCAG AA pass)

Previous `#6B7280` on `#F0F2F5` was 4.31:1 (FAIL, below 4.5:1 threshold).

**Verdict: VERIFIED.** `--vetro-text-secondary` in light mode is `#4B5563`. All three light-mode surface combinations now pass WCAG AA.

---

### ddrop fiber panel ARIA

**Verified by reading:** `public/splice.html:3554`

```html
<div style="padding:10px 12px;border-bottom:1px solid var(--vetro-divider)" id="ddrop-panel-location-${locationId}" role="region" aria-label="Fiber splicing — ${esc(loc.name)}">
```

**Verified by reading:** `public/splice.html:3717`

```html
<div style="margin-top:12px;padding-top:10px;border-top:1px solid var(--border-weak)" id="ddrop-panel-closure-${closureId}" role="region" aria-label="Fiber splicing — ${esc(cl.model || 'Closure')}">
```

Both ddrop panel wrapper divs have:
- `role="region"` (correct — inline section, not modal)
- `aria-label` with entity-specific name interpolated through `esc()` (XSS-safe)

**Verdict: VERIFIED.** Screen readers can identify both panels as distinct named regions. `esc()` wrapping ensures consistent XSS safety with rest of template literal.

---

## CLEANUP_CANDIDATES.md Investigation Items

The original `CLEANUP_CANDIDATES.md` flagged 3 items requiring investigation beyond simple deletions:

### §4 — Migration 0023 slot (originally noted as "missing")

**Verified:** `migrations/0023_ec_rollup_linkage.sql` **EXISTS** at HEAD.

The CLEANUP_CANDIDATES.md note ("Numbering jumps from 0022 to 0024") was stale — written before `0023_ec_rollup_linkage.sql` was committed. Migration sequence is contiguous from 0001 through 0035.

**Verdict: FALSE ALARM.** No gap in migration sequence.

---

### §4 — Duplicate `setting_change_requests` CREATE TABLE in schema.sql

**Verified:** `grep -c "CREATE TABLE.*setting_change_requests" schema.sql` → returns `1`.

Only one `CREATE TABLE` for `setting_change_requests` in current schema.sql (line 444). The duplicate noted in CLEANUP_CANDIDATES.md has been resolved (likely during the schema.sql regeneration from pg_dump in the CI smoke fix, `6328ae1`).

**Verdict: RESOLVED.** Duplicate block no longer present.

---

### §6 — Hardcoded `launchfiber-splicematrix.xyz` URLs

**Verified:** `grep -rn "launchfiber-splicematrix.xyz" public/ routes/` → zero hits.

No stale hardcoded URLs in any code or public files.

**Verdict: CLEAN.** No stale URLs remaining.

---

## Negative Findings (confirmed clean during verification)

- `routes/project_documents.js` — no other sync fs calls beyond the fixed L-1 locations
- `routes/contracts.js` — batch DELETE uses same `ANY($1::uuid[])` pattern; no per-node loop survivor
- `public/splice.html` — ARIA change is purely additive; no existing functionality removed; `esc()` XSS wrapping consistent with surrounding code
- `SPLICE_BUILD_PLAN.md` — correctly kept (explicit KEEP in cleanup scope, contains future phase 6+ planning; referenced by `SPLICE_MATRIX_SUGGESTIONS.md`)
- `research/` directory — all 8 research files retained (confirmed "all referenced" per CLEANUP_CANDIDATES.md §3)
- Migration gap from 0022→0024 — false alarm, 0023 exists

## Coverage Gaps

- Did not verify individual code references still exist for `PORTAL_LAUNCHER_PLAN.md` or `SPLICE_MATRIX_SUGGESTIONS.md` (only confirmed CLAUDE.md reference for the former, `SPLICE_BUILD_PLAN.md` reference for the latter). References were green at time of cleanup; recommend periodic re-check if these files are edited.
- Did not audit `SPLICE_BUILD_PLAN.md` content for accuracy vs shipped code state (would be a separate audit task).
- Railway per-portal service teardown status (§6 "Other" — infra-side, not auditable from repo).

---

## Newly Discovered GAP_REMAINING Items

None. All Phase 11 cleanup items are verified at current HEAD. No regressions detected.

The one open item from CLEANUP_CANDIDATES.md (§4 schema duplicate) is confirmed resolved at HEAD. The migration slot gap (§4) was a false alarm.

---

## Overall Verdict

**GREEN.** All Phase 11 sub-phases (9A docs, 9B code, 9C a11y) verified:

- 4 planning docs deleted; 3 kept docs confirmed present with live references
- `_fieldMarkupRate` TTL sweep prevents unbounded Map growth in splice.js
- Async fs replaces sync fs in project_documents.js admin route
- Batch DELETE replaces per-node loops in 3 locations (projects.js, ai.js, contracts.js)
- VETRO light-mode contrast passes WCAG AA at all surface combinations
- ddrop fiber panels have `role="region"` + `aria-label` for screen reader landmark navigation

No regressions detected. No new GAP_REMAINING items identified.

=== PHASE 11 POST-FIX VERIFICATION END ===
