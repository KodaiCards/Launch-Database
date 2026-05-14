# Hotfix B2 + B3 — write_sql INSERT block + UPDATE alias bypass

**Branch:** `claude/debug-previous-issues-MoN9D`
**File patched:** `routes/ai.js` (write_sql case, lines ~1936–1963)
**Date:** 2026-05-13

---

## Fixes applied

### B2 — INSERT INTO high-value tables (was unblocked)

Added `highRiskInsertPattern = /^insert\s+into\s+(users|engineering_contracts|clients|contracts)\b/i` block immediately after the UPDATE guard. Mirrors the existing DELETE + UPDATE guards. Without this, `INSERT INTO users (username, password_hash, role) VALUES (...)` passed every prior check (no semicolons, no DDL match, no DELETE/UPDATE match) and executed — landing a plaintext password_hash and bypassing `create_user`'s bcrypt.

### B3 — UPDATE alias bypass via FROM clause

The prior UPDATE regex `/^update\s+(engineering_contracts|users|...) \b/i` matched only the first token after UPDATE. PostgreSQL alias syntax `UPDATE u SET password_hash='x' FROM users u WHERE u.id=1` puts alias `u` as the first token, so the regex returned false and the query executed.

Fix: two-layer guard.
- Layer 1: original `highRiskUpdatePattern` (fast path for common `UPDATE tablename` form).
- Layer 2: `isUpdateStatement && highRiskUpdateTableAnywhere.test(probe)` — if the statement starts with `UPDATE` AND any high-value table name appears anywhere in the probe string, block. This catches alias, CTE, and FROM-clause references.

---

## 6-string verification results

| # | Input | Expected | Result |
|---|---|---|---|
| 1 | `INSERT INTO users (username,password_hash) VALUES (...)` | BLOCK | **BLOCK:INSERT** ✓ |
| 2 | `UPDATE u SET password_hash='x' FROM users u WHERE u.id=1` | BLOCK | **BLOCK:UPDATE** ✓ |
| 3 | `UPDATE users SET full_name='x'` | BLOCK | **BLOCK:UPDATE** ✓ |
| 4 | `DELETE FROM users WHERE id=1` | BLOCK | **BLOCK:DELETE** ✓ |
| 5 | `SELECT id, username FROM users` | ALLOW | **ALLOW** ✓ |
| 6 | `INSERT INTO projects (name, status) VALUES ($1, $2)` | ALLOW | **ALLOW** ✓ |

All 6 pass. Verified via Node.js regex test against the exact probe-stripping + guard logic as written in `routes/ai.js`.

---

## Notes

- The over-broad block on Layer 2 is intentional. `write_sql` is admin/approval-gated and the dedicated-endpoints policy means no legitimate `UPDATE` statement should reference these four tables via the AI tool anyway. False-positive risk is negligible.
- `SELECT ... FROM users` is unaffected — the `isUpdateStatement` gate ensures the full-probe scan only fires on UPDATE statements.
- No other guards were changed. Scope: B2 + B3 only.

=== HOTFIX B2 B3 REPORT END ===
