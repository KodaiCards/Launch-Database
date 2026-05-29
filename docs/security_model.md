# Security Model — Launch Database

**Document:** Consolidated security overview of the Launch Fiber Database platform  
**Scope:** Express backend + frontend (vanilla JS PWAs) + Electron desktop app + client portal  
**Audience:** Operators, developers, auditors  
**Last updated:** 2026-05-28

---

## Table of Contents

1. [Authentication & Session Management](#authentication--session-management)
2. [Authorization & Access Control](#authorization--access-control)
3. [Injection & Query Safety](#injection--query-safety)
4. [File Upload & Storage](#file-upload--storage)
5. [Audit Logging & Compliance](#audit-logging--compliance)
6. [XSS & Content Security](#xss--content-security)
7. [CSRF & Cross-Origin Protection](#csrf--cross-origin-protection)
8. [Rate Limiting](#rate-limiting)
9. [Electron Desktop App](#electron-desktop-app)
10. [Known Limitations](#known-limitations)

---

## Authentication & Session Management

### Employee Sessions (lfs_session cookie)

- **Cookie format:** HTTP-only, secure-in-production, SameSite=lax, 7-day expiry
- **Mechanism:** JWT embedded in httpOnly cookie. Payload includes `user_id`, `role`, `name`, `iat`
- **Token invalidation:** `tokens_invalid_after` column on `users` table; bumped on password change + logout
- **Login credentials:** Timing-safe comparison (`crypto.timingSafeEqual`) on app password, with length pre-check
- **Rate limiting on login:** 10 attempts per IP / 15-min window + 5 attempts per username / 15-min window
- **Password requirements:** Enforced at form level (8+ characters); no server-side requirements documented

### Client Portal Sessions (lfs_client_session cookie)

- **Authentication:** Magic-link token flow (32-byte cryptographic random) or token-based
- **Token storage:** SHA-256 hashed in database; raw token never stored
- **Token expiry:** Explicit `expires_at` timestamp validated per request
- **Revocation:** `revoked_at` timestamp checked on every request
- **Cross-organization isolation:** Client can only access data scoped to their `client_org_id`

### Splice Contractor Public Token Flow

- **Access model:** One-time public token (UUID) issued per project, valid for in-field markup
- **Token validation:** Resolved from DB before serving field or view portal
- **Scope:** Read/write access limited to assigned project only
- **No authentication required:** Public token is the credential

### Rate Limiting Context

- **Mechanism:** In-memory bucket map, reset on process restart
- **Limitation:** Single-process only; ineffective behind load balancer if > 1 instance
- **Current deployment:** Single Railway instance, acceptable for now
- **Future scaling:** Move to Redis-backed or Postgres-backed counter table

---

## Authorization & Access Control

### Core Roles

| Role | Scope | Privileges |
|---|---|---|
| **admin** | All data + system | Full access to all routes, admin-only endpoints, user management, audit log editing |
| **manager** | RUS projects + team hours | Billing, invoice creation/void, crew hour management, approval workflows, project assignment |
| **designer** | Splice + design portals | Project design, splice matrix, PDF export, locked-project co-editing |
| **permitter** | Permit pipeline | Permit lifecycle, make-ready assignments, design handoff coordination |
| **inspector** | Inspection closure | RUS inspection entries, NESC compliance verification |
| **customer** | Limited API read | Token-based, scoped to `/api/customer/*` and `/api/auth/*` only; no write access to any operational data |

### Authorization Middleware Patterns

```javascript
requireAuth()           // Validates JWT in cookie; returns 401 if missing/invalid
requireAdmin()          // requireAuth + role === 'admin'; returns 403 otherwise
requireManagerOrAdmin() // requireAuth + role in ['manager', 'admin']; returns 403 otherwise
requireSpliceAccess()   // Validates req.user can edit the project (owns project or has design role)
requireClientAuth()     // Validates lfs_client_session token, checks expiry + revoked_at
```

### IDOR (Insecure Direct Object Reference) Scope Guards

- **Project ownership:** Most project-scoped endpoints verify `WHERE project_id=$1 AND EXISTS (SELECT 1 FROM job_assignments ja WHERE ja.project_id=$1 AND ja.user_id=$2)`
- **Client organization isolation:** Client portal routes use `WHERE client_org_id=$1 AND client_org_id=$2` on both SELECT and state-change queries
- **Workspace folder sharing:** Folder access checked via `share_mode` + FK chain to `workspace_folder_shares` table for specific-user shares
- **Audit log access:** Limited to admin role only (historical exception: managers on invoices for their own work)

### Query Scope by Table

| Table | Access pattern | Scope |
|---|---|---|
| `projects` | WHERE project_id + FK ownership | Role-based (designer/permitter) + job assignment check |
| `workspace_folders` | WHERE folder_id + `getEffectivePermission()` | User home + inherited shares + public folder traversal |
| `splice_*` | WHERE project_id + `requireSpliceAccess()` | Design role + lock held check |
| `invoice_*` | WHERE manager can see only own team | Manager role + team membership; admin sees all |
| `time_entries` | WHERE user_id + project_id + role | Employee sees own hours; manager sees team; admin sees all |
| `audit_log` | READ-ONLY, admin only | Full history; no client, customer, or contractor visibility |
| `clients`, `users` | admin-only, except auth endpoints | /api/auth/me returns self only |

---

## Injection & Query Safety

### SQL Injection Defense

- **Parameterized queries throughout:** Every pool.query() uses `$1, $2, ...` placeholders
- **No string concatenation into SQL:** No bypasses found in broad audit
- **CTE / write_sql guards (AI assistant only):** Blocking patterns for DDL, CTE-prefixed DML, and high-value tables
  - Blocked operations: DROP, TRUNCATE, ALTER TABLE, CREATE TABLE, GRANT, REVOKE
  - Blocked tables: `users`, `clients`, `contracts`, `engineering_contracts`
  - Limitations (known gaps): General-purpose tables (projects, time_entries) can be updated/deleted via CTE if approved by admin; CTE-DML on non-high-value tables may bypass guards in some cases
- **Query timeout:** AI chat queries run with `SET TRANSACTION READ ONLY` and explicit timeout handling

### Prompt Injection Defense (AI Assistant)

- **User-supplied content wrapped:** Messages bracketed with `[user-supplied]...[/user-supplied]` markers
- **Context isolation:** Database context wrapped in `<|db_context|>` delimiters with explicit DATA-only instruction
- **Token filtering:** ChatML role headers (`system:`, `assistant:`, `user:`) stripped from user input
- **Regex-based patterns:** `_INJECTION_TOKEN_RE` and `_INJECTION_PHRASE_RE` catch common override phrases
- **Residual risk:** Base64-encoded injection and Unicode homoglyph substitution bypass regex but are low-risk given admin-only surface

---

## File Upload & Storage

### Upload Validation

| Surface | Max size | Validation | Issues |
|---|---|---|---|
| **Workspace files** | 50 MB (Puppeteer path) | Multer `fileSize` limit; no magic-byte check | No extension blocklist; arbitrary extensions written to disk |
| **Project photos** | 20 MB | Multer `fileSize` limit; MIME allowlist (jpg/png/heic/heif/webp) | **HIGH:** MIME client-supplied; no magic-byte verification; any ext written (e.g., .php) |
| **Design import (SVG)** | 25 MB | Multer memory limit; minimal validation | **MED:** SVG inline-served (can contain `<script>`); should force attachment |
| **Client documents** | Unknown | MIME allowlist (pdf/doc/docx/xls/xlsx) | **HIGH:** Same MIME-spoofing issue as photos |
| **CSV imports** | 50 MB | Multer streaming to temp file; line count check | Safe; content validation per row |

### Storage Path Management

- **Storage key format:** Absolute path computed at upload time, stored in DB
- **Download handler reads:** `storage_key` from DB verbatim, passed to `fs.readFile()`
- **Path traversal defense:** Some endpoints use `path.resolve() + startsWith()` guard; **others lack it** (workspace file download, purge-old handler)
- **Containment status:** Inconsistent across surfaces; **HIGH-risk endpoints lack bounds check**
- **Recommendation:** Add mandatory `path.resolve(key).startsWith(path.resolve(UPLOAD_DIR) + path.sep)` before every filesystem operation

### Soft-Delete Handling

- **Trashed files filter:** Queries for active files should include `AND deleted_at IS NULL`
- **Status quo:** Some endpoints omit the filter (workspace download, projects list), allowing stale-permission access to trashed content
- **Recommendation:** Audit every file-access query for `deleted_at` guard; add where absent

---

## Audit Logging & Compliance

### Audit Trail Coverage

- **Logged operations:** 22+ INSERT sites across invoices, projects, approvals, AI chat, workspace, DWG, photos
- **Audit fields per entry:** `actor_id` (user), `action` (verb + entity), `entity_type`, `entity_id`, `details` (JSONB), `ip_address`, `created_at`
- **Access control:** READ-ONLY to admin; no employee self-audit
- **Retention:** 730-day hot retention; soft-archived after (archival mechanism pending)
- **Edit/delete capability:** Admin can edit/delete audit rows (per 2026-05-28 directive)
- **RUS compliance:** 7-year legal retention requirement satisfied via archive + hot copies

### Coverage Gaps (High-Value Operations Unlogged)

- **Billing operations:** `routes/billing.js` has **zero audit logging** for invoice creation, void, batch operations
- **Client portal approvals:** Document approvals not logged
- **Workspace operations:** Some file/folder operations missing logAudit calls
- **Recommendation:** Systematic sweep to ensure all state-changing endpoints call `logAudit`

---

## XSS & Content Security

### Defense Mechanisms

- **Stored XSS via user input:** `esc()` helper used in admin pages to escape HTML entities
- **Rich content (Markdown, HTML):** Not supported; all user input treated as plaintext
- **Client-side rendering:** Most portals (workspace, photos, timeclock) render JSON directly to DOM via `.textContent` (safe); exceptions:
  - **Photos PWA:** `caption` field injected via `innerHTML` without escaping — **HIGH XSS risk**
  - **Workspace (admin):** Uses `esc()` — safe
- **Inline scripts:** Global `pageRequiresAuth()` function; no hardcoded secrets in HTML; PORTAL_MODE injected via JSON.stringify (safe)
- **Electron renderer:** contextIsolation=true, nodeIntegration=false; preload uses contextBridge for IPC

### Missing Headers (server.js)

- **Not present:** `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Strict-Transport-Security`
- **Impact:** Browser MIME sniffing on uploaded SVG/HTML possible; clickjacking vector on admin portal
- **Recommendation:** Add global middleware setting these headers

---

## CSRF & Cross-Origin Protection

### CSRF Defense

- **Mechanism:** Origin/Referer header validation on all non-GET/HEAD/OPTIONS requests
- **Configuration:** Middleware at `server.js:90-131`
- **Exception pattern:** Bearer token (API calls from same-origin SPA) bypasses Referer check
- **Login endpoint:** Separate CSRF check at lines 94-112; rejects unknown origins with 403

### CORS Configuration

- **Wildcard disabled:** Dynamic origin callback (lines 66-78)
- **Allowed origins list:** Whitelist in env var or hardcoded
- **Credentials:** `credentials: true` with dynamic origin correctly implemented
- **Methods:** Standard GET/POST/PUT/DELETE allowed; no custom verbs

---

## Rate Limiting

### Current Implementation

- **Mechanism:** In-memory Map (`_rlBuckets`) with sliding-window counter
- **Login limits:** 10 per IP / 15-min, 5 per username / 15-min
- **AI chat:** 20 requests / 5-min per user (rate-limited via auth.js)
- **File upload:** Per-user rate limit on workspace; photo/document uploads subject to multer size limit only
- **Limitations:**
  - Process-local only (reset on restart)
  - Ineffective behind load balancer (each instance has independent counter)
  - No hard token-cost cap on AI iterations (max 15 iterations × 8K tokens = potential for high spend)

---

## Electron Desktop App

### Security Posture: YELLOW (3 HIGH, 4 MED findings)

### Configuration (Mostly Sound)

- ✅ `contextIsolation: true`
- ✅ `nodeIntegration: false`
- ✅ `enableRemoteModule: false`
- ✅ Preload using contextBridge (9 IPC channels, properly enumerated)
- ⚠️ `sandbox: false` (not explicitly enabled; default for loadFile in Electron 33)

### Critical Vulnerabilities

| Issue | Severity | Description |
|---|---|---|
| Arbitrary server URL accepted from user input | HIGH | User can supply malicious server URL → credentials + data flow to attacker. No URL validation. |
| Session cookie plaintext in electron-store | HIGH | No encryption on stored session cookie; accessible to any OS process running as same user. `safeStorage` not used. |
| Path traversal in sync pull (server-controlled paths) | HIGH | Server-supplied `relativePath` values written to filesystem without canonicalization; can escape sync root. |

### Secondary Issues (MEDIUM)

- `shell.openExternal` called with stored server URL without scheme validation
- No navigation guards (will-navigate / setWindowOpenHandler); renderer could navigate to external URLs
- IPC listener registered repeatedly on every page load, leaking listeners
- `require('electron')` in renderer (preload bridge incomplete)

### Missing Features

- **Auto-update:** No `electron-updater`; v0.1.0 will never self-update
- **Code signing:** SmartScreen warns on install; supply-chain risk if distributed via informal channels
- **Symlink traversal:** `scanLocalFolder` follows symlinks without bounds checking

---

## Known Limitations

### Single-Tenant Architecture

- **Scope:** No client org isolation at deployment level; all employees in one app share infrastructure
- **Implication:** Cross-tenant bugs would affect all users simultaneously
- **Mitigation:** All data access routes are org-scoped; no data actually bleeds across clients via API

### In-Memory State

- **Rate limiter:** Reset on process restart; no persistence
- **AI approvals:** In-memory `_pendingApprovals` Map; lost on crash before approval consumed
- **Session store:** `electron-store` defaults to plaintext; no encryption by default

### No MFA

- No multi-factor authentication for admin accounts
- Login limited to password + rate limiting

### No Code Signing on Electron App

- NSIS installer unsigned; SmartScreen warns; auto-update impossible without signing

### Unencrypted Browser Storage

- Offline queue in PWA stores photos as base64 in IndexedDB
- No TTL/clear-on-logout; persistent across sessions
- Session mismatch possible: User A queues upload, User B logs in on same device, User A's queue drains as User B

---

## Recommendations for Future Work

### Immediate (Critical)

1. **Photos PWA XSS:** Escape `caption` and `uploader_name` before innerHTML insertion
2. **Client document upload:** Add magic-byte verification (MIME spoofing fix)
3. **Storage path traversal:** Mandatory `path.resolve() + startsWith()` guard on all fs.* calls
4. **Electron arbitrary server URL:** Validate server input against allowlist or hardcode for production
5. **Electron session plaintext:** Use `safeStorage` to encrypt stored session cookie
6. **Electron path traversal:** Add `path.resolve().startsWith()` guard on sync pull

### High (Compliance)

7. **Audit logging completeness:** Sweep all state-change endpoints; ensure `logAudit` called on billing, client portal approvals, workspace operations
8. **SVG inline serve:** Force `Content-Disposition: attachment` on SVG downloads

### Medium (Defense-in-Depth)

9. **Security headers:** Add global middleware for X-Content-Type-Options, X-Frame-Options, HSTS
10. **Content-Disposition injection:** Sanitize filenames before embedding in headers
11. **AI write_sql guards:** Close CTE-DML and UPDATE/DELETE-without-WHERE bypass vectors
12. **Workspace file download:** Add explicit traversal guard, consistent with document endpoint

### Low (Future Scale)

13. **Rate limiter persistence:** Move to Redis or Postgres for multi-instance deployments
14. **MFA:** Consider TOTP or similar for admin accounts
15. **Code signing:** Obtain certificate for Electron app installer (prerequisite for auto-update)

---

## Compliance Notes

### RUS Program (Government Contracts)

- **Audit trail:** 7-year retention requirement addressed via hot + archival
- **PII handling:** Staff names stored; customer details in projects; no explicit PII redaction at query layer (admin sees full data by design)
- **Approval workflows:** Document approvals (in client portal) currently unlogged — compliance gap

### Data Retention

- **Soft-delete pattern:** Rows remain in DB indefinitely; no auto-purge
- **Archive:** Audit log archival mechanism documented but implementation pending
- **Backups:** Not in scope of this document; assume Railway standard retention

---

## Incident Response & Secrets Rotation

### Secrets Inventory

- **APP_PASSWORD:** Admin login credential (stored hashed in users.password_hash)
- **DATABASE_URL:** Postgres connection string (env var)
- **JWT_SECRET:** Session signing key (env var)
- **Anthropic API key:** AI chat token (env var)
- **Mapbox token:** Static map generation (env var)
- **OAuth2 creds (legacy):** Moodle bridge, deprecated post-OSP-Merge

### Rotation Procedure

- **APP_PASSWORD:** Hash new password, INSERT into users table
- **JWT_SECRET:** Invalidate all sessions via `tokens_invalid_after` bump on all users; rolling restart of Railway instances
- **Database/API keys:** Env var update + Railway redeploy

---

**Document end. For security findings, see `/audit-output/wave-{85,94,98,99,100,102,103,104}-*` audit reports.**
