# Wave 3 BE-Perf MED Fix Report

**Wave:** Wave 3 BE-Perf — MED tier (Phase 6)
**Branch:** claude/debug-previous-issues-MoN9D
**Agent:** Fix-Agent MED (Phase 6)
**Date:** 2026-05-13

---

## Summary

4 of 5 MED canonical items addressed (M-5 deferred — already shipped by Phase 5 Fix-Agent B at commit `830a014`).

| Item | Status | SHA | Notes |
|---|---|---|---|
| M-1 | ADDRESSED | `2fc2f9a` | `routes/ai.js` — 2× readFileSync → await fs.promises.readFile |
| M-2 | ADDRESSED | `70127a7` | `routes/hours_csv.js` — readFileSync + 2× unlinkSync → async |
| M-3 | ADDRESSED | `d789392` | `routes/invoice_templates.js` — readFileSync + 5× unlinkSync → async |
| M-4 | ADDRESSED | `2e582c0` | `routes/hours_csv.js` — XLSX concurrency semaphore added |
| M-5 | DEFERRED | (prior `830a014`) | LRU eviction at 1000 entries already shipped in Phase 5 |

---

## Per-item detail

### M-1 — Sync readFileSync in routes/ai.js

**File:** `routes/ai.js`
**Canonical location:** Lines 2286, 2297 (post-Phase-5 shift to 2286/2297)

Two `fs.readFileSync(req.file.path, 'utf8')` calls inside the `async POST /api/ai/upload` handler:
- CSV/TSV branch (reading temp file before passing to XLSX.read)
- Text/other branch (reading raw content into uploadStore)

Both replaced with `await fs.promises.readFile(req.file.path, 'utf8')`. No other changes. The file already used `fs.promises.unlink` in adjacent lines — pattern consistent.

**Verification:** `node -c routes/ai.js` → SYNTAX OK. No callers changed.

---

### M-2 — Sync fs ops in routes/hours_csv.js

**File:** `routes/hours_csv.js`
**Canonical location:** Lines 231, 236, 240

Three sync calls inside `async POST /api/hours/csv-validate`:
- `fs.readFileSync(req.file.path, 'utf8')` (CSV/TSV branch) → `await fs.promises.readFile(...)`
- `fs.unlinkSync(req.file.path)` (unsupported-type early return) → `await fs.promises.unlink(...)`
- `fs.unlinkSync(req.file.path)` (post-parse cleanup) → `await fs.promises.unlink(...)`

**Verification:** `node -c routes/hours_csv.js` → SYNTAX OK.

---

### M-3 — Sync fs ops in routes/invoice_templates.js

**File:** `routes/invoice_templates.js`
**Canonical location:** Lines 88 (readFileSync) + 163, 168, 185, 228, 290 (unlinkSync ×5)

Added `const fsp = fs.promises;` alias at module top (line 26). Then replaced:

| Original location | Call | Replacement |
|---|---|---|
| `runAnalysisAndPersist()` | `fs.readFileSync(pdfPath)` | `await fsp.readFile(pdfPath)` |
| POST create — missing job_id/client_id guard | `fs.unlinkSync(req.file.path)` | `await fsp.unlink(req.file.path)` |
| POST create — magic-byte gate | `fs.unlinkSync(req.file.path)` | `await fsp.unlink(req.file.path)` |
| POST create — archive old PDF | `fs.unlinkSync(existing[0].reference_pdf_path)` | `await fsp.unlink(...)` |
| POST create — catch block | `fs.unlinkSync(req.file.path)` | `await fsp.unlink(req.file.path)` |
| DELETE — post-delete cleanup | `fs.unlinkSync(rows[0].reference_pdf_path)` | `await fsp.unlink(...)` |

All callers (`runAnalysisAndPersist`, POST handler, DELETE handler) are already async. `existsSync` calls (lines 265, 318) are boot-time / sync-safe guards — left as-is per canonical scope.

**Verification:** `node -c routes/invoice_templates.js` → SYNTAX OK. `grep unlinkSync\|readFileSync routes/invoice_templates.js` → no output.

---

### M-4 — XLSX sync parse concurrency cap

**File:** `routes/hours_csv.js`
**Canonical:** Add semaphore of 2 around XLSX.readFile block

Added `withUploadSlot(fn)` semaphore at module top (lines 26–52) with:
- `UPLOAD_CONCURRENCY_MAX = 2`
- `_activeUploads` counter
- `_uploadQueue` drain array
- `Promise.resolve().then(fn).then(resolve, reject).finally(decrement + drain)` pattern

**Semaphore unlock trace:**
- **Success path:** fn resolves → `.then(resolve)` → `.finally()` decrements + drains. ✓
- **Error / parse failure:** fn rejects → `.then(_, reject)` → `.finally()` still fires. ✓
- **Unsupported-type early path:** `unlink` inside slot, throw `UNSUPPORTED_FILE_TYPE` → slot rejects → `.finally()` fires → outer catch intercepts by error code and returns 400. File is already deleted; the post-slot `await unlink` at line 277 is never reached. ✓

Also converted the remaining `fs.unlinkSync` in the validate catch block (line 708 original) to `await fs.promises.unlink` — leftover from M-2 scope that was in a different code branch.

**Verification:** `node -c routes/hours_csv.js` → SYNTAX OK. `grep unlinkSync\|readFileSync routes/hours_csv.js` → no output.

---

### M-5 — DEFERRED (already addressed)

Per canonical and Phase 5 post-fix verification: `_pendingApprovals` LRU eviction (max 1000 entries) was shipped by Phase 5 Fix-Agent B at commit `830a014`. Size cap is in place. No further action needed.

---

## Boot smoke

`node server.js` was not run (no local DB). Syntax checks passed on all 3 changed files:

```
node -c routes/ai.js          → ok
node -c routes/hours_csv.js   → ok
node -c routes/invoice_templates.js → ok
```

All changes are inside async route handlers — no new module-level sync calls introduced.

---

## Adjacent observations (no commits)

- `routes/hours_csv.js` line 670: `fs.existsSync(req.file.path)` guard before cleanup — this is on the `/api/hours/csv-commit` route's catch block (different route). LOW risk, out of scope for this wave.
- `routes/invoice_templates.js` lines 265, 318: `fs.existsSync` calls in regenerate + download routes — sync but boot-path-adjacent disk checks. Out of scope per canonical (existsSync is explicitly allowed).

=== WAVE 3 BE-PERF MED FIX REPORT END ===
