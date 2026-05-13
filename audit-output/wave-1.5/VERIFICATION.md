# Wave 1.5 Remainder — Verification Red-Team

**Stack snapshot:** Express + pg-pool + Puppeteer + JWT/cookie auth. 14 canonical items spanning Puppeteer SSRF, auth-bypass no-op fallbacks, schema drift, JWT issuer gap, SSE TOCTOU, and error-message leaks. Verification performed against HEAD `1479b74` (post-CRIT-fix-agent + M-4 fix). Three auditor disagreements resolved; two new HIGH findings surfaced.

---

## Disagreement Resolutions (highest-information outputs)

### C-4: Schema parent_id RESTRICT→CASCADE override — OVERSTATED (was CRITICAL)

**Verdict: OVERSTATED (not CRITICAL). Not exploitable on fresh DB.**

PostgreSQL `ALTER TABLE ... ADD COLUMN IF NOT EXISTS` is a **complete no-op** when the column already exists — including the `REFERENCES ... ON DELETE CASCADE` FK clause. PostgreSQL docs: a notice is issued and the statement is ignored.

- `schema.sql:81` (CREATE TABLE): `parent_id UUID REFERENCES projects(id) ON DELETE RESTRICT` — **applied**
- `schema.sql:266` (ALTER, now removed at `dae8491`): `ADD COLUMN IF NOT EXISTS parent_id ... ON DELETE CASCADE` — **silently skipped on fresh DB**

RESTRICT was always winning on fresh deploys. The real threat is existing databases that ran the ALTER before the CREATE TABLE had `parent_id` — those got CASCADE. Fix-agent correctly removed the contradictory ALTER (schema hygiene) and added migration `0034` to correct existing DB instances that have CASCADE in place.

### H-4: actorOf body-actor forgery — OVERSTATED (was HIGH)

**Verdict: B is correct. Not exploitable in production.**

`portal_module.js:409-410` throws hard at initialization if `authHelpers.requireAuth` is missing:
```js
if (!authHelpers || !authHelpers.requireAuth || !authHelpers.requireAdmin) {
  throw new Error('installPortalExtensions: authHelpers { requireAuth, requireAdmin } is required');
}
```
Every `actorOf` call site in `portal_module.js` is wrapped in `requireAuth()`. The `req.body?.proposed_by` fallback never fires when `req.user` is present. `actorOf` is not used in `potential_permits.js` or `inspection.js` (confirmed by grep — no matches).

Severity: **LOW** (defense-in-depth only). Fix correctly applied at `f7695b1` (fallback removed).

### M-2: Splice Puppeteer SSRF — FALSE-POSITIVE

**Verdict: C is correct. No external URL injection surface in splice HTML.**

Verified by reading `routes/splice.js` lines 3635–3664 and `_renderSpliceHtml` (lines 4601–4685):

All `<img src>` values in splice HTML are server-generated `data:` URLs:
- `qrDataUrl`: `data:image/png;base64,...` from `qrcode.toDataURL()` — never an external URL
- `mapImageDataUrl`: `data:image/...;base64,...` fetched server-side by `_fetchMapboxStaticDataUrl()` before Puppeteer runs

All user strings (`location.name`, cable names, closure labels, project name) pass through `_esc()` which HTML-encodes `&`, `<`, `>`, `"`. CSS is 100% inline — `routes/splice.js:4991` comment: "embedded inline so the PDF renders correctly without an external stylesheet." No `<link>`, no `@font-face`, no `@import`.

The `setRequestInterception` guards added to splice Puppeteer sites by the CRIT fix-agent are valid defense-in-depth but address no real attack vector in current code.

---

## Per-Canonical-Item Verification Table

| # | Status | Verdict | Evidence |
|---|--------|---------|----------|
| **C-1** | VERIFIED | CRITICAL — correct | `invoice_template_engine.js:467-500`: no `setRequestInterception`, no `sanitizeTemplateHtml` before `setContent`. `routes/invoice_templates.js:462`: raw `req.body.html` passed directly. `--no-sandbox` at line 475. Fixed at `f7695b1`. |
| **C-2** | VERIFIED | CRITICAL — correct | `server.js:633` was `{}`. `potential_permits.js:16`: fallback fires. All 4 endpoints unauthenticated. Fixed at `880436f`. |
| **C-3** | VERIFIED | CRITICAL — correct | `server.js:642` was `{}`. `inspection.js:45`: no-op fallback. Fixed at `880436f`. |
| **C-4** | OVERSTATED | Downgrade CRITICAL→LOW | Postgres `ADD COLUMN IF NOT EXISTS` no-op when column exists. Fresh DB: RESTRICT wins. Existing DBs: CASCADE may be in place; `0034` migration corrects them. Fixed at `dae8491` + `1479b74`. |
| **H-1** | VERIFIED | HIGH — correct | `server.js:535`: `{ requireManagerOrAdmin }` without `requireAuth`. `pricing.js:38`: no-op fallback. `GET /api/pricing` returns billing rates + billing codes + job names unauthenticated. **NOT YET FIXED.** |
| **H-2** | VERIFIED | HIGH — correct | `grep "splice_public_tokens\|ec_service_areas\|job_assignments" schema.sql` → 0 results. Migrations 0012, 0031, 0032 confirmed. Fresh deploy via schema.sql alone breaks splice auth + job-assignment + EC WO# logic. **NOT YET FIXED.** |
| **H-3** | OVERSTATED | Downgrade HIGH→LOW | `auth.js:133-158`: `bootstrapAuthSchema()` creates users table + adds all 4 columns at server startup (`server.js:1193`). A fresh deploy always gets these columns. Schema inconsistency is real but not a security gap — the server self-heals on boot. **Low-priority cleanup, not a fix.** |
| **H-4** | OVERSTATED | Downgrade HIGH→LOW | See disagreement resolution above. Fixed at `f7695b1` as defense-in-depth. |
| **H-5** | VERIFIED | HIGH — correct | `portal_module.js:837`: `permit_manager` from `req.body`. `portal_module.js:961`: written to `permit_stages.updated_by` — `[rows[0].id, 'potential', permit_manager \|\| null]`. Any authenticated user can spoof audit attribution. **NOT YET FIXED.** |
| **M-1** | VERIFIED + UPGRADED | Upgrade MEDIUM→HIGH — active bug, not future risk | `server.js:525` passes `{ requireAdmin, requireManagerOrAdmin }` without `requireAuth`. `jobs.js:27`: `requireAuth(['admin',…])` fires the no-op fallback. `GET /api/jobs` and `GET /api/jobs/:id` are **currently unauthenticated**. Comment on jobs.js:26 says "Wave 1.5 [UNGATED]" — the fix was intended but never completed in server.js. **NOT YET FIXED.** |
| **M-2** | FALSE-POSITIVE | No fix needed | See disagreement resolution above. Defense-in-depth guards added anyway at `66ddb51`. |
| **M-3** | VERIFIED + SCOPE UNDERSTATED | MEDIUM — correct, fix scope is 19 instances not 2 | `grep "e\.message" portal_module.js` → 19 matches at lines 441, 455, 492, 507, 617, 632, 643, 652, 673, 683, 692, 706, 739, 796, 825, 977, 1028, 1069, 1070. Fix-agent must replace all 19 with `'Internal server error'` + server-side `console.error`. **NOT YET FIXED.** |
| **M-4** | VERIFIED | MEDIUM — correct | `routes/splice.js:3524-3527` (pre-fix): `catch (dbErr) { console.error(...) }` — logged and fell through. Revoked session survived 25s ticks during DB degradation. Fixed at `1479b74`: `consecutiveDbErrors` counter; tolerates 1 tick, fails-closed on 2. Fix is correct. |
| **M-5** | VERIFIED | MEDIUM — correct | `auth.js:236` (pre-fix): no issuer in `signToken`/`verifyToken`. Cross-valid tokens between deployments sharing `JWT_SECRET`. Fixed at `f7695b1`: `JWT_ISSUER` env var, both sign and verify now use `issuer: JWT_ISSUER`. Correct. |

---

## Regression-Impact Analysis

| Fix | Risk | Verdict |
|-----|------|---------|
| `setRequestInterception` on invoice Puppeteer | Breaks CSS/font/image loads in invoice templates | **LOW.** Invoice templates use inline CSS. Allow `data:` + `about:blank`; block external. Existing approach is correct. |
| `setRequestInterception` on splice Puppeteer (defense-in-depth) | Same | **SAFE.** Splice HTML is fully inline. No external loads needed. |
| Remove C-4 schema.sql line 266 ALTER | Existing DBs already have CASCADE | **SAFE.** Removing from schema.sql is no-op for existing DBs. Migration 0034 corrects those. |
| Add `requireAuth` to `server.js:633, :642, :535` | Legitimate unauthenticated callers? | **SAFE.** All callers are authenticated frontend pages (`inspection_tab.js:194`, `permitting.html:1412`). No webhooks, no health checks, no public paths. |
| Remove `req.body?.proposed_by` from `actorOf` | Frontend sends `proposed_by` in body | **SAFE.** `actorOf` uses `req.user.username` when present. Fallback never fires. Frontend's body field is ignored today and post-fix. |
| M-4 SSE fail-closed on 2 consecutive DB errors | Client SSE disconnect during transient DB blip | **ACCEPTABLE.** One tick tolerated; reconnect re-runs authMiddleware. Correct tradeoff between availability and security. |

---

## New Findings (not in canonical — surface for next wave)

| # | Sev | File | Issue | Fix shape |
|---|-----|------|-------|-----------|
| **NF-1** | HIGH | `routes/project_detail.js:21-23` + `server.js:613` | `GET /api/projects/:id/detail` is unauthenticated. Returns project name, client name, contract, time entries, permit stages, billing rate — significant sensitive data leak. `server.js:613` passes `{}`, `project_detail.js:21` falls to no-op stub. | Add `requireAuth` to `server.js:613` opts object. |
| **NF-2** | HIGH | `routes/budgets.js:11-13` + `server.js:629` | `GET /api/budgets`, `GET /api/budgets/:id/summary`, `GET /api/budgets/:id/by-area`, `GET /api/budget-codes` all unauthenticated. `server.js:629` passes `{ requireManagerOrAdmin }` without `requireAuth`. `budgets.js:11` falls to no-op for `requireAuth`. Budget/financial data publicly readable. | Add `requireAuth` to `server.js:629` opts object. |

---

## Post-Fix Summary (items addressed before this report)

| Item | SHA | Fix correctness |
|------|-----|-----------------|
| C-1 `sanitizeTemplateHtml` + `setRequestInterception` in engine | f7695b1 | Correct. Belt-and-braces: sanitize then intercept. |
| C-1 splice PDF sites `setRequestInterception` (defense-in-depth) | 66ddb51 | Correct (though M-2 is a false-positive). |
| C-2 potential_permits `requireAuth` | 880436f | Correct. |
| C-3 inspection `requireAuth` | 880436f | Correct. |
| C-4 schema.sql contradictory ALTER removed | dae8491 | Correct. |
| C-4 migration 0034 to fix existing DB CASCADE→RESTRICT | 1479b74 | Correct. Idempotent, no-ops if already RESTRICT. |
| H-4 actorOf fallback removed | f7695b1 | Correct. |
| M-4 SSE fail-closed on 2 consecutive DB errors | 1479b74 | Correct. Tolerates 1 tick, terminates on 2. |
| M-5 JWT issuer claim | f7695b1 | Correct. `JWT_ISSUER` env var, sign+verify both updated. |

**Still open:** H-1, H-2, H-3 (low priority), H-5, M-1 (upgraded to HIGH), M-3 (19 instances), NF-1, NF-2.

---

## Coverage Gaps

Fully verified: all 14 canonical items, 3 disagreements, regression impacts, post-fix verification of 9 items, 2 new HIGH findings. **Not reached:** Full scan of `routes/splice.js` CRUD operations (lines 1100–3480) for additional no-op fallback instances beyond the scoped items. `routes/ai.js` (out of Wave 1.5 scope). Migration 0025–0033 deeper logic audit.

=== WAVE 1.5 VERIFICATION END ===
