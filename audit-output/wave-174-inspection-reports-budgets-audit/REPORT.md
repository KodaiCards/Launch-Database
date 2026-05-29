# Wave 174 Security Audit — routes/inspection.js + routes/reports.js + routes/budgets.js

**Framing:** adversarial — determined authenticated insider (manager or engineer role) trying to exfiltrate cross-client financial data, corrupt budget figures, or bypass audit trails.

**Stack snapshot:** Three route modules extracted from server.js. All gated by role-based `requireAuth` middleware injected at mount. None import `logAudit` — all mutations are unaudited. No IDOR guards on `:id` params. inspection.js and reports.js are read-only aggregates. budgets.js is the only money-touching write surface. All use parameterized queries; zero raw SQL string concatenation.

## Findings

### F1 HIGH — No audit log on money mutations (budgets.js)
Lines 106–155, 227–288. POST/PUT/DELETE on budgets + budget_codes have zero audit trail. No logAudit anywhere in the file. RUS-contract-grade government financial data with no record of who changed what. Fix: import `_audit.logAudit`; fire-and-forget call in each mutation after DB write, capturing before/after.

### F2 HIGH — IDOR on budget :id routes (budgets.js)
Lines 43, 132, 147, 159, 249, 273. GET /summary, PUT, DELETE, GET /by-area, PUT/DELETE budget-codes all execute on req.params.id without ownership check. Any requireManagerOrAdmin user can modify any budget by UUID. Fix: pre-flight ownership SELECT or scope WHERE clause.

### F3 HIGH — GET /api/budgets/:id/by-area leaks all concentrators + cross-client revenue (budgets.js)
Lines 161–208. Concentrators query runs `WHERE c.active = true` with no FK to budget's engineering_contract_id. total_spent aggregates revenue from ALL projects at ALL concentrators system-wide. Only requireAuth (any role). Fix: join through budgets → engineering_contracts → concentrators; elevate to requireManagerOrAdmin.

### F4 MED — GET /api/budgets — customer role can enumerate (budgets.js:13–41)
No-arg requireAuth(). Any role including customer can query budgets for any project_id/engineering_contract_id. Fix: elevate to requireManagerOrAdmin + scope.

### F5 MED — GET /api/budget-codes returns ALL codes cross-budget (budgets.js:212–224)
Without ?budget_id, every code for every budget. Fix: elevate + scope.

### F6 MED — PUT silent 200 with undefined body on non-existent ID (budgets.js:132, 249)
res.json(undefined) = 200 OK empty. Fix: rowCount check → 404.

### F7 MED — No non-negative validation on total_amount / allocated_amount (budgets.js:119, 230)
Schema has no CHECK >= 0. Fix: server-side validation + migration.

### F8 MED — reports.js month/year params not validated (reports.js:22, 52)
?month=abc → 500 PG cast failure. Fix: parseInt + range check.

### F9 LOW — No LIMIT on inspection/reports queries (inspection.js:89; reports.js:56)
Insider DoS risk. Fix: LIMIT 5000 or pagination.

### F10 LOW — Auth middleware silent no-op fallback (inspection.js:45, reports.js:18, budgets.js:9)
Pattern `(mw && mw.requireAuth) || (() => (req,res,next)=>next())` — silent bypass if missing. Fix: throw at boot.

### F11 (cross-scope) — dwg_two_way_sync.js wrong logAudit signature (3 sites, lines 219, 379, 430)
Calls `logAudit({pool, user_id, action, ...})` — destructure fails silently, all DWG push/promote/sync audit events DROPPED. Same Wave 86 silent-no-op pattern. Fix: `logAudit(pool, {req, action, ...})`.

## Verified Clean

- SQL injection: all parameterized; statusFilter allowlist-validated
- Auth wiring in production: server.js:732, 745, 791 correct
- Error response leakage: 13 catch blocks log e.message to console only; 500 responses opaque
- monthYear regex validated `/^\d{4}-\d{2}$/` at inspection.js:56
- Recursive CTE depth guard < 10 at inspection.js:175, 312
- inspection.js PII: staff names NOT in response; staff_id UUIDs only in intermediate CTEs

## Coverage Gaps

- automation.js / dateInBusinessTz helper not audited
- Frontend CSRF / token exposure not traced
- budget_scope_exactly_one CHECK constraint not verified

## Aggregate

- inspection.js: GREEN (0 HIGH, 0 MED, 1 LOW)
- reports.js: YELLOW (0 HIGH, 1 MED, 1 LOW)
- budgets.js: RED (3 HIGH, 4 MED, 0 LOW)
- Cross-scope (dwg_two_way_sync.js): 1 HIGH (silent-no-op signature bug)

**Verdict: RED — 4 HIGH, 5 MED, 2 LOW**
