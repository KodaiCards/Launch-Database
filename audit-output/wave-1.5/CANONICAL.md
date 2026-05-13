# Wave 1.5 Remainder — Canonical Fix List

> Built from Auditor A (broad, 7 findings) + Auditor B (adversarial, 8 findings) + Auditor C (high-precision, 5 + 4 FPs rejected).
> 14 deduplicated items. HIGH-STAKES wave per CLAUDE.md.

---

## Scope summary

Security + data-integrity audit: Puppeteer SSRF, no-op auth bypasses, body-actor forgery, schema drift, JWT issuer, SSE TOCTOU, error.message leaks. Files: `invoice_template_engine.js`, `routes/invoice_templates.js`, `auth.js`, `portal_module.js`, `server.js`, `routes/splice.js`, `routes/potential_permits.js`, `routes/inspection.js`, `routes/pricing.js`, `routes/jobs.js`, `schema.sql`, `migrations/*`.

---

## CRITICAL (4 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **C-1** | A-1 + B-3 + C-1 (3/3 auditors) | `invoice_template_engine.js:467-500` + `routes/invoice_templates.js:455-472` | **Puppeteer SSRF.** `POST /api/invoices/render-pdf-from-html` (manager/admin-gated) passes caller-controlled HTML to `renderHtmlToPdf` → `page.setContent(html, {waitUntil:'load'})` with NO `setRequestInterception`, no `sanitizeTemplateHtml`. `<img src="http://169.254.169.254/latest/meta-data/iam/...">` exfiltrates Railway IMDS. `--no-sandbox` flag removes network isolation. | **2-part:** (a) Call `sanitizeTemplateHtml(html)` inside `renderHtmlToPdf` BEFORE `setContent`. (b) Add `await page.setRequestInterception(true)` + `page.on('request', req => { if (req.url().startsWith('data:')) return req.continue(); else req.abort(); })` to block all non-data URLs. Apply to all 3 Puppeteer render sites (engine + 2 in splice.js). |
| **C-2** | A-3 + B-1 + C-2 (3/3 auditors) | `routes/potential_permits.js:16` + `server.js:633` | **Auth bypass — potential_permits.** `server.js:633` passes `{}` (empty mw object). `requireAuth = (mw && mw.requireAuth) \|\| (() => (req,res,next) => next())` falls through to no-op stub. All 4 endpoints (GET/POST/PUT/DELETE) unauthenticated. POST/PUT also throw `TypeError: Cannot read properties of undefined` because the body-actor fix reads `req.user.full_name`. | Change `server.js:633` to `require('./routes/potential_permits')(app, pool, { requireAuth })`. |
| **C-3** | A-3 + B-2 (2/3 auditors) | `routes/inspection.js:45` + `server.js:642` | **Auth bypass — inspection.** Same pattern as C-2. `server.js:642` passes `{}` — RUS hourly data endpoint (`GET /api/inspection`) falls through despite having `requireAuth(['admin',...])` on the route declaration. Stub fires at bind time because `mw.requireAuth` is undefined. | Change `server.js:642` to pass `{ requireAuth }`. |
| **C-4** | A-2 (1/3 — needs verification) | `schema.sql:75-81 vs :266` | **Schema parent_id RESTRICT→CASCADE override.** Line 81 declares `parent_id UUID REFERENCES projects(id) ON DELETE RESTRICT` (with comment explaining CASCADE danger). Line 266 ALTER overrides to `ON DELETE CASCADE`. On fresh DB the ALTER wins → deleting a rollup wipes ALL descendants + their time_entries (**billing history loss**). | Remove the `ALTER TABLE projects ADD COLUMN IF NOT EXISTS parent_id ... ON DELETE CASCADE` block at line 266. The column already exists from line 81's CREATE TABLE; the ALTER is contradictory not additive. |

## HIGH (5 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **H-1** | C-3 (1/3) | `routes/pricing.js:38-40` + `server.js:535` | **Auth bypass — pricing.** Server passes `{ requireManagerOrAdmin }` without `requireAuth`. `GET /api/pricing` returns billing rates + billing codes + job names UNAUTHENTICATED — a competitive-intel data leak even though not destructive. | Add `requireAuth` to `server.js:535` opts object. |
| **H-2** | B-5 (1/3) | `schema.sql` (missing tables) + `migrations/0012, 0021, 0031, 0032, 0033` | **Schema drift — fresh-deploy missing tables.** `schema.sql` lacks: `splice_public_tokens`, `splice_field_markups` (0012), `splice_comments` (0021), `ec_service_areas`, `ec_work_orders` (0031), `job_assignments` (0032), `0033` trigger. Fresh Railway deploy via schema.sql alone skips these → splice public-token auth + job-assignment + EC WO# logic silently break; null reads in auth checks. | Append DDL for migrations 0012, 0021, 0031, 0032, 0033 to `schema.sql`. (Or — better long-term — eliminate schema.sql and make migrations the single source of truth.) For this wave, just append. |
| **H-3** | C-4 (1/3) | `schema.sql` users table + `auth.js:155-158` | **Schema drift — missing users columns on fresh deploy.** 4 columns exist only in `auth.js` inline DDL: `tokens_invalid_after`, `theme`, `extra_teams`, `dashboard_layout`. Fresh DB from schema.sql → these missing → `authMiddleware:266` silently fails to revoke sessions (the entire logout-invalidation security mechanism breaks on fresh deploys). | Add the 4 columns to the `users` CREATE TABLE in `schema.sql`. |
| **H-4** | A-4 (1/3 — DISAGREEMENT) | `portal_module.js:416` | **Body-actor forgery — actorOf.** `actorOf = req => (req.user && (req.user.username \|\| req.user.id)) \|\| req.body?.proposed_by \|\| null`. A flags HIGH; B disagrees ("only fires when req.user is falsy — meaning requireAuth already passed"); C didn't flag. **Verification must resolve:** is there any path where `actorOf` is called with `req.user` falsy AND `requireAuth` was bypassed (e.g., via C-2/C-3)? If yes → real vulnerability; if no → harden anyway as defense-in-depth. | Remove the `req.body?.proposed_by` fallback. `actorOf` returns null when `req.user` is absent. If callers need a "system actor" string for unauthenticated paths, use a hardcoded `'system'` not body-controlled input. |
| **H-5** | C-5 (1/3) | `portal_module.js:837, 961` | **Body-actor forgery — permit_manager.** `req.body.permit_manager` is destructured then written to `permit_stages.updated_by`. Any authenticated user can spoof audit attribution. Not an access-control bypass but corrupts audit trail on a government-tracked system. | Source `updated_by` from `req.user.username` (matches `permits.js:52` pattern). Reject or ignore `req.body.permit_manager`. |

## MEDIUM (5 items)

| # | Source convergence | File:line | Issue | Fix shape |
|---|---|---|---|---|
| **M-1** | B-4 (1/3) | `routes/jobs.js:24` + `server.js:525` | **Ticking time-bomb — jobs.js missing requireAuth in mw.** Currently jobs.js uses `requireAdmin` only, so not exploitable today. But if any future route adds `requireAuth(...)` instead of `requireAdmin`, it silently no-ops. | Add `requireAuth` to the mw passed at `server.js:525`. While there, audit all 18+ route files using the `\|\| () => next()` fallback pattern and confirm each gets `requireAuth`. |
| **M-2** | A-6 (1/3 — DISAGREEMENT) | `routes/splice.js:3643-3664` + `:2578-2643` | **Splice Puppeteer SSRF.** A flags `page.setContent` with user-influenced HTML + no `setRequestInterception`. B agrees (smaller surface but `waitUntil:'load'` still resolves external resources). C rejects (says fully inline HTML, no external load). **Verification must check:** does the splice HTML template embed any user-controlled URL-bearing fields (e.g., `<img src="..">` whose src comes from a DB-stored field)? | Add `setRequestInterception(true)` + non-data URL block to both splice Puppeteer launch sites. Sanitize user-string fields with the same `sanitizeTemplateHtml`. |
| **M-3** | A-7 (1/3) | `portal_module.js:977, 1028` | **Error.message leak.** `res.status(500).json({ error: e.message })` returns raw Postgres error to authenticated portal users — leaks column/table/constraint names + SQL fragments. | Replace `e.message` with `'Internal server error'`. Log the real error server-side with `console.error('[portal:projects:create]', e)`. |
| **M-4** | B-6 (1/3) | `routes/splice.js:3524-3527` | **SSE TOCTOU on DB error.** Heartbeat re-validates `tokens_invalid_after` each 25s tick — but on DB error the catch logs and falls through, keeping the channel alive. Revoked session can persist 25s+ during DB degradation. | On DB error in the heartbeat: terminate the SSE channel (conservative) OR count consecutive DB-error ticks and terminate after N=2. Don't silently fall through on security checks. |
| **M-5** | A-5 (HIGH) + B-7 (LOW) + C FP-1 (REJECTED — DISSENSUS) | `auth.js:232-248` | **JWT missing `iss` claim.** A flags as HIGH, B as LOW, C rejects as FP. Conservative reading: defense-in-depth, not exploitable today, but `JWT_AUDIENCE='lfs'` default means staging/prod tokens are cross-valid if `JWT_SECRET` is shared. | Add `issuer: process.env.JWT_ISSUER \|\| 'lfs-auth'` to both `signToken` and `verifyToken`. Drive `JWT_AUDIENCE` per-environment via env var (existing). Low-effort, high-defense-depth. |

## False-positives + negative findings (per C)

- JWT `iss` missing isn't itself an exploit — audience pinning + shared secret is the cross-service guard. Listed above as M-5 anyway because the fix is cheap.
- `project_types.js` no-op requireAuth — endpoint returns hardcoded enum, no sensitive data; benign.
- `permit_stages` CASCADE on delete — admin-gated; intentional behavior.
- Splice catch blocks — all return generic messages, no `e.message` leakage; clean.
- SSE iat re-validation (splice + _sse) — correctly implemented.
- JWT audience pinning + algorithm fixing — clean.

## Verification tier guide

**Convergence-3 (all 3 auditors agree — quick spot-check):**
- C-1 Puppeteer SSRF render-pdf-from-html → 2-min spot-check
- C-2 potential_permits auth bypass → 1-min spot-check

**Convergence-2 (need brief verify):**
- C-3 inspection.js auth bypass

**Convergence-1 + DISAGREEMENT (full verify):**
- C-4 schema parent_id override — open schema.sql:75 vs :266, confirm contradictory ALTER
- H-4 actorOf body-actor — resolve A vs B disagreement: trace all callers, confirm whether req.user can be falsy when actorOf is called
- M-2 splice Puppeteer SSRF — resolve A vs C disagreement: read the splice HTML template, find any user-controlled src/href/url fields

**Convergence-1 (full verify):**
- H-1, H-2, H-3, H-5, M-1, M-3, M-4, M-5

## Acceptance criteria for fix-agents

1. All 14 items addressed OR deferred with reason.
2. `node server.js` boots clean with `node -c <changed-file>` syntax check pre-commit.
3. `npm test` continues to pass 155/155.
4. Playwright `tests/browser/psc_rus_tab.spec.js` continues to pass (already restored at `81f2491`).
5. CRITICAL items take priority over HIGH and below. Suggested split:
   - **Fix-agent A**: CRITICALs C-1, C-2, C-3, C-4 (4 items)
   - **Fix-agent B**: HIGHs H-1, H-2, H-3, H-5 (4 items — H-4 deferred pending verification resolution)
   - **Fix-agent C**: MEDIUMs M-1..M-5 (5 items)
6. Per-commit pull-rebase + push (agent-protocol rule).

=== WAVE 1.5 CANONICAL END ===
