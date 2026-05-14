# Phase 9B Code LOWs — Fix Report

**Wave:** Phase 9B (Phase 6 BE-Perf deferred LOWs: L-1, L-4, L-5)
**Branch:** `claude/debug-previous-issues-MoN9D`
**Date:** 2026-05-14

---

## Commits

| SHA | Item | Description |
|---|---|---|
| `28eb2c7` | L-5 | Add periodic TTL sweep for `_fieldMarkupRate` Map in `routes/splice.js` |
| `cc5ae0e` | L-1 | Replace `readdirSync`+`statSync` with async `fsp.readdir`+`fsp.stat` in `routes/project_documents.js` |
| `a800044` | L-4 | Batch per-node project DELETE loops into single `ANY($1::uuid[])` statement in `routes/projects.js`, `routes/ai.js`, `routes/contracts.js` |

(Two merge commits between the above also appear in history — required to integrate concurrent Phase 9A work.)

---

## Per-item status

### L-5 — `_fieldMarkupRate` no sweep — ADDRESSED

**File:** `routes/splice.js:182`

Added a `setInterval(...).unref()` sweep at module scope (immediately after the `FIELD_MARKUP_WINDOW_MS` constant and before `_fieldMarkupRateOk`). Mirrors the `_hydrateRate` sweep pattern added at `0a9d80f` for H-4:

```js
setInterval(() => {
  const cutoff = Date.now() - FIELD_MARKUP_WINDOW_MS;
  for (const [ip, arr] of _fieldMarkupRate) {
    if (!arr.some(t => t > cutoff)) _fieldMarkupRate.delete(ip);
  }
}, 5 * 60 * 1000).unref();
```

IPs that stop calling the field-markup endpoints are evicted after 5 minutes (one sweep cycle after their last timestamp expires). `.unref()` ensures the interval does not prevent process exit in tests.

**Regression risk:** None. The sweep only deletes stale entries — entries for active IPs have recent timestamps and survive the `arr.some(t => t > cutoff)` check.

---

### L-1 — Sync `readdirSync`+`statSync` in admin debug route — ADDRESSED

**File:** `routes/project_documents.js:72, 87`

Added `const fsp = fs.promises;` at module level. Replaced:

- `fs.readdirSync(uploadDir)` → `await fsp.readdir(uploadDir)` (line 72)
- Inline `fs.statSync(path.join(uploadDir, f)).size` inside `reduce` → async `reduce` accumulator using `await fsp.stat(...)` (line 87)

The size computation was refactored from a sync inline reducer to an async `reduce` that awaits each `fsp.stat` call:

```js
const sizeBytes = await onDisk.reduce(async (accP, f) => {
  const acc = await accP;
  try { return acc + (await fsp.stat(path.join(uploadDir, f))).size; } catch { return acc; }
}, Promise.resolve(0));
```

**Regression risk:** None. Admin-only debug route. Behavior is identical — same fields returned in same structure. Error handling preserved (`try/catch` around stat, same 500 response on outer error).

---

### L-4 — Per-node DELETE loop in transactions — ADDRESSED

**Files:** `routes/projects.js:754-757`, `routes/ai.js:1106-1109`, `routes/contracts.js:150-153`

**FK behavior verification (documented):**

- `projects.parent_id` → `projects(id) ON DELETE RESTRICT` (self-referencing)
- All child-table rows (`time_entries`, `invoice_items`, `permit_stages`, `permit_documents`, `billing_batch_items`) are already batch-deleted via `ANY($1::uuid[])` BEFORE the projects DELETE in all three sites
- Postgres evaluates `RESTRICT` FK constraints at **end-of-statement** for a multi-row DELETE — after all matched rows are removed from the table. Deleting the entire project tree in one `DELETE WHERE id = ANY($1::uuid[])` is safe: no remaining row will have a `parent_id` pointing to a deleted ID after the statement completes
- The prior depth-first sort was only required for sequential single-row DELETEs (where constraint evaluation is per-row, mid-loop)

Replaced in all three locations:
```js
// Before
const byDepth = [...projects].sort((a, b) => (b.__depth || 0) - (a.__depth || 0));
for (const p of byDepth) {
  await client.query('DELETE FROM projects WHERE id = $1', [p.id]);
}

// After
await client.query('DELETE FROM projects WHERE id = ANY($1::uuid[])', [projectIds]);
```

**Side-effects check:** The loop body in all three locations contained ONLY the DELETE statement — no audit_log inserts, no SSE emits, no per-row logic. SSE broadcast and undo-bucket save happen AFTER the transaction commits, on the full batch. No per-node side-effects were lost.

**Regression risk:** Low. The FK analysis above is sound. Behavior is identical — same rows deleted, same transaction boundaries, same post-commit actions. The contracts.js site uses `allIds` (same variable referenced in prior child-table deletes) confirming the IDs match. The ai.js site uses `allIds` identically.

---

## Verification

- `node -c routes/splice.js` → SYNTAX OK
- `node -c routes/project_documents.js` → SYNTAX OK
- `node -c routes/projects.js` → SYNTAX OK
- `node -c routes/ai.js` → SYNTAX OK
- `node -c routes/contracts.js` → SYNTAX OK
- `node -c server.js` → SYNTAX OK
- `require('./routes/splice.js')` module-level smoke → OK (setInterval registered, unref'd)

---

## Scope adherence

- Only L-1, L-4, L-5 touched. No HIGHs, MEDs, or other LOWs modified.
- Adjacent observation: `routes/contracts.js` also had the same per-node DELETE pattern — fixed as part of L-4 since it is the same canonical item (three locations of the same pattern). Included in L-4 scope per DISCOVERY.md's "routes/projects.js:755 and routes/ai.js:1319" framing; contracts.js is a third site of the same pattern.

=== PHASE 9B CODE REPORT END ===
