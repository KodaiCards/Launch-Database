# Wave 1.5 CRITICAL Fix Report

> Fix-agent: Wave 1.5-A (CRITICAL tier, items C-1..C-4)
> Branch: `claude/debug-previous-issues-MoN9D`
> Date: 2026-05-13

---

## Summary

All 4 CRITICAL items addressed. Server boots clean. Syntax check passed on all modified .js files.

---

## Per-item status

| # | Item | Status | Commit SHA | Notes |
|---|---|---|---|---|
| C-1 | Puppeteer SSRF — renderHtmlToPdf (invoice_template_engine.js) | **ADDRESSED** | `f7695b1` | Added `sanitizeTemplateHtml(html)` call BEFORE `setContent` + `setRequestInterception(true)` blocking all non-data:/about:blank requests |
| C-1 | Puppeteer SSRF — splice.js diff-PDF site (~line 2630) | **ADDRESSED** | `66ddb51` | Added `setRequestInterception(true)` + request handler aborting non-data: requests |
| C-1 | Puppeteer SSRF — splice.js export-PDF site (~line 3650) | **ADDRESSED** | `66ddb51` | Same pattern as diff-PDF site |
| C-2 | Auth bypass — potential_permits | **ADDRESSED** | `880436f` | `server.js:633` `{}` → `{ requireAuth }` |
| C-3 | Auth bypass — inspection | **ADDRESSED** | `880436f` | `server.js:642` `{}` → `{ requireAuth }` |
| C-4 | Schema parent_id CASCADE override | **ADDRESSED** | `dae8491` | Removed contradictory ALTER (see verification result below) |

---

## C-4 Verification Result

**Question:** Does `ALTER TABLE projects ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES projects(id) ON DELETE CASCADE` actually override the FK action on an existing column?

**Postgres behavior confirmed:** `ADD COLUMN IF NOT EXISTS` is a complete no-op when the column already exists — it does NOT apply a new FK constraint. On a fresh deploy (schema.sql used as the bootstrap), the CREATE TABLE at line 81 wins with `ON DELETE RESTRICT`. The ALTER at line 266 was silently skipped.

**However — the threat IS real for a different reason:** the section header says "MIGRATIONS (safe to re-run)" — meaning this block was originally added to support EXISTING databases that pre-dated the parent_id column. Those databases received parent_id with CASCADE from the ALTER, not RESTRICT from the CREATE TABLE (which hadn't been updated yet at the time). Those databases still have CASCADE in production.

**Fix applied:** Removed the ALTER entirely and added a detailed comment explaining:
- Fresh deploys: unaffected (CREATE TABLE RESTRICT was already winning)
- Existing databases: need a separate corrective migration to switch CASCADE → RESTRICT (out of scope for this wave)
- The comment in schema.sql documents exactly what that migration needs to do

**Risk note:** Any existing database that ran the old ALTER before the CREATE TABLE was updated to RESTRICT has `ON DELETE CASCADE` in place. This means deleting a rollup parent on those databases will silently cascade. A follow-up migration wave is recommended to correct the FK action on those instances.

---

## Verification checks

- `node -c invoice_template_engine.js` → SYNTAX OK
- `node -c routes/splice.js` → SYNTAX OK
- `node -c server.js` → SYNTAX OK
- Boot smoke (`node server.js` with fake DB env, 5s timeout) → BOOT OK (no crash, no `ReferenceError`, no boot-time exception)

---

## Adjacent observations (no scope creep — listed for next wave)

- `routes/invoice_templates.js:465`: the route-level 500 handler still returns `e.message` directly: `res.status(500).json({ error: 'PDF render failed: ' + e.message })`. This leaks Puppeteer/Chrome error messages. Matches M-3 pattern; address in M-tier fix wave.
- The `sanitizeTemplateHtml` function in `invoice_template_engine.js` is a deny-list scrubber, not a true allow-list sanitizer. It strips `<script>`, `<iframe>`, `on*` handlers, and `javascript:` URIs, but does NOT block `http://` or `https://` URLs in `<img src>` or `<link href>` — the `setRequestInterception` guard above is what actually prevents those requests. The two defenses are complementary and both are now in place.

=== WAVE 1.5 CRIT FIX REPORT END ===
