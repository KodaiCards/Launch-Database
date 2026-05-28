# Wave 100 — Independent Security Re-Review: Client Portal Write Surface
# Waves 49, 49b, 66 (documents + approvals + workspace files)
# Auditor: READ-ONLY pass, wave-100-client-write-review branch
# Date: 2026-05-28

## Scope

Files audited:
- `routes/client_portal_v2.js` (full — 836 lines)
- `routes/_client_auth.js` (full — 83 lines)
- `server.js` relevant sections (multer config, route wiring, ~lines 1-50, 795-815)
- `tests/client_portal_v2.test.js` (structure scan for test coverage gaps)

Wave 45 baseline fixes reviewed (MED-1 opaque login 401, MED-2 UUID guards, MED-3 explicit column list).

---

## Findings

| # | Severity | Category | File | Lines | Issue | Fix Shape |
|---|---|---|---|---|---|---|
| 1 | HIGH | Dead route / upload broken | `routes/client_portal_v2.js` + `server.js` | 593-599, 605-702, server.js:806 | `POST /api/client/documents` is dead code. The real upload handler lives inside `installClientDocumentUpload(uploadMW)`, which is **never called from server.js**. The registered route (line 593) calls `next()` and falls through to 404. The `module.exports.installClientDocumentUpload` assignment at line 705 runs *inside* the exported function, making it accessible post-call, but server.js never invokes it. Result: every client document upload returns 404. | In `server.js` after line 806, add: `const cpv2 = require('./routes/client_portal_v2'); if (cpv2.installClientDocumentUpload) cpv2.installClientDocumentUpload(upload);` — or restructure so multer is passed into the routes function directly and the double-registration pattern is removed. |
| 2 | HIGH | MIME type spoofing / no magic-byte check | `routes/client_portal_v2.js` | 614-627 | The MIME allowlist at line 622 checks `req.file.mimetype`, which multer derives from the **client-supplied `Content-Type` header** — not file magic bytes. An attacker can upload a PHP/JS/HTML shell by setting `Content-Type: application/pdf`. The stored file gets a UUID-prefixed name with the original extension (line 659-662), so a file named `shell.php` with Content-Type: application/pdf would be stored as `<uuid>.php`. If the upload directory is ever web-accessible, this is RCE. If it isn't, it's still a stored malicious file that could be served to other users. Fix: add magic-byte inspection (e.g. `file-type` npm package) OR enforce that `req.file.originalname`'s extension matches the MIME allowlist. | Use `file-type` to verify magic bytes after multer writes to disk. Reject if magic bytes don't match the MIME-allowed set. |
| 3 | MED | storage_key leaked in upload response | `routes/client_portal_v2.js` | 676, 691 | The `RETURNING` clause on the upload INSERT includes `storage_key` (a filesystem path like `client-docs/<org_id>/<uuid>.pdf`). This value is returned to the client in the 201 response (`rows[0]`). The storage_key is an opaque internal filesystem path and should not be exposed. The list endpoint (line 528-539) correctly omits it; the upload response does not. | Remove `storage_key` from the `RETURNING` clause, or strip it before `res.status(201).json({ document: rows[0] })`. |
| 4 | MED | Zero audit logging on all write operations | `routes/client_portal_v2.js` | entire file | `routes/_audit.js` exports `logAudit` and it is used on invoices, projects, photos, DWG sync, folder workspace. The entire client portal v2 has **no logAudit calls on any write path**: token consume (login), logout, document upload, approval response, org create (admin), user create (admin), token generate (admin), token revoke (admin), approval create (admin). For a surface handling government contract approval workflows, lack of audit trail is a compliance gap. | Import `{ logAudit }` from `./_audit` and add fire-and-forget calls on: login (token consume), logout, approval response, and the admin token generate/revoke paths at minimum. |
| 5 | MED | Content-Disposition header injection in document download | `routes/client_portal_v2.js` | 577 | Document download sets `Content-Disposition: attachment; filename="${doc.filename}"` without stripping double-quotes from the filename. A filename stored as `evil"; filename="clean.pdf` would produce a malformed header. Compare: workspace file download at line 262 correctly applies `.replace(/"/g, '')`. The document download does not. | Apply `.replace(/"/g, '')` to `doc.filename` before embedding in the header. |
| 6 | MED | Path base inconsistency in workspace file download (no traversal guard) | `routes/client_portal_v2.js` | 251-253 | The workspace file download endpoint uses `UPLOAD_DIR = process.env.UPLOAD_DIR \|\| './uploads'` (a **relative** path, resolved from `process.cwd()`). The document download endpoint (line 569) correctly uses `path.join(__dirname, '..', 'uploads')` and has an explicit traversal guard (`filePath.startsWith(uploadDir)`). The workspace download has neither the `__dirname`-anchored base nor the traversal guard. In practice `storage_key` comes from the DB and is not user-controlled, but if a DB row were ever inserted with a crafted `storage_key`, there is no guard. Inconsistency also means the two endpoints resolve to different on-disk directories when `UPLOAD_DIR` is not set. | Add a `path.resolve`-based traversal guard to the workspace file download, mirroring the pattern in the document download handler. Use `path.join(__dirname, '..', 'uploads')` as the fallback (not `'./uploads'`). |
| 7 | LOW | Differential 401 messages in requireClientAuth middleware | `routes/_client_auth.js` | 49-54 | Wave 45 MED-1 added opaque `DENY_MSG` to the **login** (token consume) endpoint to prevent token-state enumeration. However, `requireClientAuth` middleware (lines 49-54) returns distinct messages: `'invalid token'`, `'token revoked'`, `'token expired'`, `'user inactive'`, `'organization inactive'`. These are returned on every authenticated API call when the token is in a non-valid state. In practice, the token value is a 32-byte random secret — an attacker cannot enumerate arbitrary tokens to probe state. However, the inconsistency with the login hardening is worth noting. | Low priority. Optionally collapse all 401 paths in requireClientAuth to a single `'authentication required'` message, consistent with W45-MED-1 intent. |
| 8 | LOW | statusFilter has no allowlist in approvals list endpoint | `routes/client_portal_v2.js` | 711-718 | `GET /api/client/approvals` accepts `?status=` query param without a whitelist. The value is injected as a parameterized value (`$2`), so there is no SQL injection risk. However, arbitrary strings are passed to the DB query, which simply returns zero rows for invalid values. No error is returned. Optionally add validation: `['pending', 'responded', 'all'].includes(statusFilter)`. | LOW fix: add an explicit status allowlist and return 400 for unrecognized values. |
| 9 | LOW | Internal staff usernames exposed to clients via workspace files endpoint | `routes/client_portal_v2.js` | 211-213 | The workspace folder files query includes `(SELECT username FROM users WHERE id = wfile.uploaded_by) AS uploaded_by_name`. This returns internal staff usernames to client portal users for files in public folders. This may be intentional (client sees who uploaded) but is worth confirming. `username` is an internal identity — consider `display_name` or omit if not needed. | Confirm intent. If not needed, remove from SELECT list. |

---

## Negative Findings (Checked and Clean)

| Area | Check | Verdict |
|---|---|---|
| IDOR on `GET /api/client/projects/:id` | WHERE p.id=$1 AND ec.client_org_id=$2 | CLEAN |
| IDOR on `GET /api/client/projects` | WHERE ec.client_org_id=$1 | CLEAN |
| IDOR on document list | WHERE client_org_id=$1 | CLEAN |
| IDOR on document download | WHERE id=$1 AND client_org_id=$2 | CLEAN |
| IDOR on workspace files list | Scope check via EC FK chain before query | CLEAN |
| IDOR on workspace file download | JOIN chain enforces ec.client_org_id=$2 + share_mode='public' | CLEAN |
| Approval cross-org response | WHERE id=$1 AND client_org_id=$2 | CLEAN |
| Approval double-respond | Status check: 409 if not 'pending' | CLEAN |
| Token replay after logout | Logout sets revoked_at; requireClientAuth checks revoked_at per request | CLEAN |
| Token hash storage | SHA-256 of 32-byte random value; raw never stored | CLEAN |
| UUID injection on path params | isValidUUID() guard on all :id/:uid/:tid/:file_id params | CLEAN |
| Admin endpoints accessible to clients | All /api/admin/* use requireAuth(['admin']); client cookie has no access | CLEAN |
| project_id scope in document upload | IF project_id provided: verified via EC FK chain against orgId | CLEAN |
| document_id scope in admin approval create | Checked against client_org_id=$2 | CLEAN |
| share_mode enforcement on workspace folders | WHERE wf.share_mode='public' on both list and download | CLEAN |
| password_hash / sensitive columns in responses | No users table columns exposed in client responses | CLEAN |
| token_hash in responses | Never returned; only id, created_at, expires_at, revoked_at returned in admin token list | CLEAN |
| Cookie settings | httpOnly:true, sameSite:'lax', secure in production | CLEAN |
| W45-MED-3 explicit column list on admin user query | RETURNING column list confirmed explicit (no cu.*) | CLEAN |

---

## Coverage Gaps (Not Tested in test suite)

1. MIME type spoofing (finding #2) — no test for mismatched Content-Type vs file content
2. storage_key in upload response (finding #3) — no assertion that storage_key is absent
3. logAudit presence (finding #4) — no test verifying audit log rows created
4. Content-Disposition injection (finding #5) — no test with quote-bearing filenames
5. installClientDocumentUpload never called (finding #1) — the test file's `insertDocument` helper bypasses the route entirely (inserts directly into DB), masking that POST /api/client/documents returns 404 in production

---

## Priority Order

1. **Finding #1 (HIGH)** — Dead upload route. All client uploads fail silently with 404. Ship fix before portal goes live.
2. **Finding #2 (HIGH)** — MIME spoofing. File type allowlist is client-bypassed. Ship before portal accepts uploads.
3. **Finding #4 (MED)** — No audit logging. Government contract approvals without audit trail is a compliance gap.
4. **Finding #3 (MED)** — storage_key leak. One-line RETURNING clause fix.
5. **Finding #5 (MED)** — Content-Disposition injection. One-line `.replace(/"/g, '')` fix.
6. **Finding #6 (MED)** — Workspace download path inconsistency + missing traversal guard.
7. **Findings #7-9 (LOW)** — Deferred to polish wave.

=== WAVE 100 CLIENT WRITE REVIEW REPORT END ===
