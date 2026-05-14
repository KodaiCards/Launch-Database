# Wave 1.5 — Auditor C (High-Precision Conservative)

**Framing:** High-precision conservative. Only findings confirmed exploitable / confirmed wrong in normal daily use. Pre-submit reject check per finding. False-positive register at end.

**Stack snapshot:** Express + vanilla JS + Postgres. `invoice_template_engine.js` uses Puppeteer for HTML→PDF with `page.setContent`. `routes/splice.js` (~6800 LOC) handles SSE, locking, PDF rendering. `auth.js` owns JWT lifecycle. `portal_module.js` is the shared project-creation route module. Multiple route files use a `requireAuth = (mw && mw.requireAuth) || (() => (req, res, next) => next())` pattern; several are wired via `server.js` without passing `requireAuth` in the options object.

---

## Confirmed Findings

| # | Sev | Cat | File | Line range | Snippet | Issue | Fix shape | Conf |
|---|---|---|---|---|---|---|---|---|
| C-1 | HIGH | SSRF | `invoice_template_engine.js` + `routes/invoice_templates.js` | engine:467-483, route:455-462 | `pdfBuf = await tplEngine.renderHtmlToPdf(html)` — `renderHtmlToPdf` calls `page.setContent(html, ...)` with no prior call to `sanitizeTemplateHtml` | `POST /api/invoices/render-pdf-from-html` (manager+admin) passes raw body HTML to Puppeteer. No sanitization, no `setRequestInterception`. Attacker with manager role injects `<img src="http://169.254.169.254/...">` → Chrome fetches it, leaking Railway metadata. | Call `sanitizeTemplateHtml(html)` inside `renderHtmlToPdf` before `setContent`, OR add `setRequestInterception` to block non-data URLs. | HIGH |
| C-2 | HIGH | AUTH-BYPASS | `routes/potential_permits.js` | 15-76, wired at `server.js:633` | `require('./routes/potential_permits')(app, pool, {})` → `requireAuth = (() => (req, res, next) => next())` | Server.js wires `potential_permits` with empty `{}` — no `requireAuth` in opts. All four endpoints (`GET`, `POST`, `PUT`, `DELETE`) are completely unauthenticated. POST/PUT pass `req.user.full_name` (Wave 1.5 body-actor fix) which throws a TypeError on unauthenticated requests (`Cannot read properties of undefined`), meaning the POST/PUT body-actor fix also crashes on the unauthenticated path. GET leaks all permit candidates publicly. | Add `requireAuth` to the `server.js:633` call: `require('./routes/potential_permits')(app, pool, { requireAuth })`. | HIGH |
| C-3 | MEDIUM | AUTH-BYPASS | `routes/pricing.js` | 38-40, wired at `server.js:535` | `require('./routes/pricing')(app, pool, { requireManagerOrAdmin })` → `requireAuth = (() => (req, res, next) => next())` | `GET /api/pricing` returns all pricing entries including billing rates, billing codes, and job names without authentication. `requireAuth` not passed in opts; falls through to no-op. | Add `requireAuth` to `server.js:535` opts object. | HIGH |
| C-4 | MEDIUM | SCHEMA-DRIFT | `auth.js` + `schema.sql` | auth.js:155-158, schema.sql:users table | `ALTER TABLE users ADD COLUMN IF NOT EXISTS tokens_invalid_after TIMESTAMPTZ` | Four `users` columns exist only in `auth.js` inline DDL and not in `schema.sql`: `tokens_invalid_after`, `theme`, `extra_teams`, `dashboard_layout`. A fresh DB restore from `schema.sql` alone produces a users table missing these columns; `authMiddleware` (line 266) queries `tokens_invalid_after` and will silently fail to revoke sessions. | Add these four columns to the `users` table definition in `schema.sql`. | HIGH |
| C-5 | LOW | DATA-INTEGRITY | `portal_module.js` | 837, 961 | `permit_manager` destructured from `req.body`, then written to `permit_stages.updated_by` | Any authenticated user creating a project can supply arbitrary `permit_manager` string in body, spoofing the audit attribution in `permit_stages`. This is not an access-control bypass — `updated_by` has no downstream role checks — but it corrupts the audit trail on a government-tracked system. | Source `updated_by` from `req.user.username` (same pattern used in `permits.js:52`). | MEDIUM |

---

## Confirmed Clean (Negative Findings)

- **Splice SSE JWT iat re-validation** (`routes/splice.js:3484-3528`): `sseTokenIatSec` captured at connect time; heartbeat re-queries DB for `tokens_invalid_after`; fires `session_invalid` event and ends connection correctly. Logic is sound.
- **JWT audience** (`auth.js:231-248`): `signToken` includes `audience: JWT_AUDIENCE`; `verifyToken` validates it with `algorithms: ['HS256']`. Audience pinning is present and correct.
- **JWT issuer**: No `iss` claim is set, but this is not a confirmed vulnerability — `iss` would only matter if tokens from an external issuer needed to be rejected, which is not the threat model here. JWT_SECRET isolation + audience pinning is the actual cross-service guard. (Registered below in false-positive register.)
- **Splice catch blocks**: Reviewed all 25+ catch blocks. All either (a) log + return generic 500 or (b) handle specific PG error codes (`23505`). No error message leakage of raw DB state. No security-relevant swallowed exceptions found.
- **`setRequestInterception` in splice.js PDF paths** (`routes/splice.js:2623-2630`, `3643-3650`): both use `page.setContent` (not `page.goto`), so no external navigation is possible from those paths. The SSRF vector does not apply to splice PDF rendering since it uses fully inline HTML. **Only** `invoice_template_engine.js` is the concern (C-1).

---

## False-Positive Register

| # | Candidate | Reason rejected |
|---|---|---|
| FP-1 | JWT missing `iss` claim | No threat model requires cross-issuer rejection. Audience pinning + shared secret is the guard. Not exploitable in this system. |
| FP-2 | `project_types.js` no-op requireAuth | GET returns only a hardcoded 4-row enum array (program names). No DB access, no sensitive data. Unauthed read of this endpoint is benign. |
| FP-3 | `ON DELETE CASCADE` on `permit_stages` → audit trail loss | `DELETE /api/projects/:id` requires `requireAdmin`. Admin deleting a project intentionally removing stages is expected behavior, not an exploit. Business rule contradiction not confirmed. |
| FP-4 | `sanitizeTemplateHtml` doesn't block `http://` in `<img src>` for AI-generated templates | The AI path (`generateInvoiceTemplate`) calls `sanitizeTemplateHtml` before returning HTML (line 276). This is only a gap for the `/render-pdf-from-html` endpoint (C-1 above), not the AI generation path. |

---

## Coverage Gaps

Read all 8 scoped items. Did not reach: `routes/splice.js` lines 1100–3480 (splice CRUD operations, field-token endpoints) — outside the 8 scoped items; would require a separate wave. Migration files 0025–0033 reviewed for schema drift only; deeper migration logic not audited.

=== WAVE 1.5 AUDITOR C REPORT END ===
