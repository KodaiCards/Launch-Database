# Wave 156 — Security Audit: routes/dwg_sync.js (v1) + routes/dwg_two_way_sync.js (v2)

**Write-path constraints acknowledged:** only `audit-output/wave-156-dwg-sync-audit/REPORT.md` written.

**Audit date:** 2026-05-29  
**Framings applied:** IDOR, path traversal, upload validation, permission gates, race conditions, audit log, ETag bypass, stream leaks, cross-project leakage, storage coupling  

---

## VERDICT SUMMARY

| File | Verdict | HIGH | MED | LOW |
|---|---|---|---|---|
| routes/dwg_sync.js (v1) | YELLOW | 1 | 2 | 2 |
| routes/dwg_two_way_sync.js (v2) | RED | 3 | 3 | 2 |
| Combined | **RED** | **4** | **5** | **4** |

---

## PART 1 — routes/dwg_sync.js (v1)

### VERIFIED CLEAN

**F1 Path traversal on file serve (GET /files/:docId):**
Verified by reading: `routes/dwg_sync.js:161-165`
```js
const resolved = path.resolve(uploadDir, doc.file_path);
const uploadRoot = path.resolve(uploadDir) + path.sep;
if (!resolved.startsWith(uploadRoot) && resolved !== path.resolve(uploadDir)) {
  return res.status(400).json({ error: 'Invalid file path' });
}
```
file_path comes from DB (permit_documents), not from user input at request time. The Wave 85 F1 pattern is correctly applied. CLEAN.

**F2 SQL injection:** All queries use parameterized $1/$2 bindings. DWG_EXT_SQL is a literal constant. CLEAN.

**F3 ETag bypass of auth re-check:** requireAuth(DWG_ROLES) middleware runs before the 304 ETag check. Auth is re-validated on every request even when returning 304. CLEAN.

**F4 Stream resource leaks:** res.sendFile() is used (not createReadStream). Express manages pipe lifecycle. CLEAN.

**F5 State scoping (GET /state, POST /state):** Both bind to req.user.id. No user can read/write another user's sync state. CLEAN.

**F6 requireAuth(DWG_ROLES) role check:** Customer and construction roles excluded. CLEAN.

---

### FINDINGS — v1

#### HIGH-1: No project membership check — any DWG-role user can enumerate all projects' files
**Severity: HIGH | Category: IDOR / Cross-project leakage**
Verified by reading: `routes/dwg_sync.js:84-92`
```js
const { rows } = await pool.query(`
  SELECT id, file_name, file_path, file_size, sha256, created_at AS updated_at
  FROM permit_documents
  WHERE project_id = $1
    AND ${DWG_EXT_SQL.replace(/d\./g, '')}
  ORDER BY id
`, [projectId]);
```
GET /projects/:id/manifest accepts any :id from an authenticated DWG-role user. No check that the calling user belongs to or is assigned to the project. Any design_engineer can request the manifest for any project ID they can enumerate. GET /projects listing (line 47-66) returns ALL projects with DWG files company-wide. Same gap applies to GET /files/:docId (line 146-155): any authenticated DWG-role user can download any file by guessing doc IDs.

**Impact:** A permitting_engineer assigned to Project A can download all DWG files for Projects B, C, etc. For a multi-client government-contract firm, this is a cross-client data leakage risk.

**Fix shape:** Add project membership scoping to manifest + file queries. Verify intended access model with Carter first (role-based may be intentional for internal-staff-only firm).

---

#### MED-1: No audit logging for file downloads
**Severity: MED | Category: Audit log instrumentation**
Verified by reading: `routes/dwg_sync.js:1-249` — no logAudit import, no audit calls anywhere. Every DWG file download via GET /files/:docId, every manifest fetch, every project listing is unlogged. v2 correctly calls logAudit for push/promote/reject.

**Fix shape:** Import logAudit from ./_audit; call with action: 'dwg.download', entity_type: 'permit_documents', entity_id: doc.id in the file serve handler.

---

#### MED-2: POST /state accepts arbitrary project_id without existence check
**Severity: MED | Category: Data integrity**
Verified by reading: `routes/dwg_sync.js:229-241`
```js
if (!project_id) return res.status(400).json({ error: 'project_id required' });
```
project_id only checked for presence, not validated as a real UUID or confirmed to exist. If FK constraint on project_dwg_sync_state.project_id exists in migration 0044, the DB rejects it with an unhandled PG error that surfaces as 500 instead of a clean 404.

**Fix shape:** Add SELECT id FROM projects WHERE id = $1 check before the upsert.

---

#### LOW-1: GET /projects listing leaks project names across all clients
**Severity: LOW | Category: Information disclosure**
Verified by reading: `routes/dwg_sync.js:47-66` — returns c.name AS client_name for every project with DWG files with no user-scoping filter. Same root cause as HIGH-1.

---

#### LOW-2: Lazy SHA-256 computation reads entire file into RAM
**Severity: LOW | Category: Resource exhaustion**
Verified by reading: `routes/dwg_sync.js:100-115, 172-179`
```js
const buf = await fsp.readFile(fullPath);
const hash = crypto.createHash('sha256').update(buf).digest('hex');
```
fsp.readFile loads entire file into Buffer. For 50MB+ DWG files this spikes heap. Concurrent first-requests for multiple large DWGs can exhaust Node heap.

**Fix shape:** Use fs.createReadStream piped to crypto.Hash.

---

## PART 2 — routes/dwg_two_way_sync.js (v2)

### VERIFIED CLEAN

**F7 UUID validation on path params:** isValidUUID() applied to all staging_id, canonical_file_id, project_id params. CLEAN.

**F8 Filename sanitization:** sanitizeFilename() rejects '..' and leading '/', strips non-allowlisted chars. CLEAN.

**F9 Path traversal in v2 download (storage_key from DB):** storage_key is server-written during push with UUID components and sanitized extension — cannot contain traversal sequences via current code paths. No containment check exists but storage_key content is safe (see LOW-3 for defense-in-depth gap).

**F10 Transaction integrity on promote:** BEGIN/COMMIT/ROLLBACK correctly wraps canonical snapshot + update + staging status change. FOR UPDATE on canonical lookup prevents concurrent duplicate canonical creation. CLEAN.

**F11 SQL injection:** All queries use parameterized bindings. CLEAN.

**F12 logAudit calls on state-changing endpoints:** push (line 134), promote (line 287), reject (line 338) all call logAudit. CLEAN.

---

### FINDINGS — v2

#### HIGH-2: promote and reject always return 403 — req.user.roles is undefined (broken redundant auth check)
**Severity: HIGH | Category: Broken functionality / Auth logic error**
Verified by reading: `routes/dwg_two_way_sync.js:196-198`
```js
const isManager = req.user && (req.user.roles?.includes('admin') || req.user.roles?.includes('manager'));
if (!isManager) {
  return res.status(403).json({ error: 'Admin/manager required' });
}
```
Also at line 155-160 (staging GET).

req.user is set by authMiddleware at auth.js:372 from a DB SELECT that returns `id, username, role, team, extra_teams, full_name, email, active, staff_id, tokens_invalid_after`. The column is `role` (singular string, e.g. 'admin'). `req.user.roles` is undefined in ALL cases.

With optional chaining: `undefined?.includes('admin')` → undefined → falsy. isManager is ALWAYS false. The `if (!isManager)` guard ALWAYS returns 403. Additionally, `'manager'` is not a valid role value — the actual values are 'design_manager' and 'permitting_manager'.

The outer requireManagerOrAdmin middleware (line 191) correctly gates the route and works. The inner check then unconditionally blocks everyone who passed. **Promote and reject are non-functional for all users including admins.** The entire v2 staging-to-canonical workflow is dead in production.

**Fix shape:** Remove the inner isManager check entirely (the middleware already enforces correct gating), OR replace with `req.user.role === 'admin' || req.user.role?.includes('manager')`. Apply same fix at line 156.

---

#### HIGH-3: v2 POST /push — MIME type check is client-controlled, no magic-byte verification
**Severity: HIGH | Category: Upload validation**
Verified by reading: `routes/dwg_two_way_sync.js:91-93`
```js
if (!ALLOWED_MIMES.includes(req.file.mimetype)) {
  fs.unlinkSync(req.file.path);
  return res.status(400).json({ error: `File type not allowed: ${req.file.mimetype}` });
}
```
req.file.mimetype is set by multer from the Content-Type field in the multipart body — 100% client-controlled. An attacker with any authenticated session can upload arbitrary content while declaring Content-Type: application/vnd.dwg. The MIME check is trivially bypassed.

The global multer instance (server.js:47) has no fileFilter. No server-side magic-byte verification exists anywhere in this pipeline. The Wave 94/106/143 pattern is absent.

sanitizeFilename() allows .php, .js, .html, .sh extensions (only restricts chars, not extensions).

**Attack path:** design_engineer uploads webshell.php with Content-Type: application/vnd.dwg. File passes check, lands at dwg-staging/<uid>/<pid>/<uuid>.php. After promotion, stored in dwg_canonical_files with .php extension. Download serves with attachment disposition so no browser execution. However, the file is on the Railway volume and its sha256 record poisons canonical integrity (compounded by HIGH-4).

**Fix shape:** (a) Magic-byte check: read first 8 bytes from req.file.path after multer writes it, compare against DWG (AC10/AC12), PDF (%PDF), PNG (\x89PNG), JPEG (\xFF\xD8) signatures. Reject + unlink on mismatch. (b) Extension allowlist independent of MIME: ['.dwg', '.dxf', '.pdf', '.png', '.jpg', '.jpeg', '.kml'].

---

#### HIGH-4: v2 POST /push — client-provided sha256 stored verbatim without server verification
**Severity: HIGH | Category: Data integrity**
Verified by reading: `routes/dwg_two_way_sync.js:77-79, 128-130`
```js
if (!sha256 || !/^[a-f0-9]{64}$/.test(sha256)) {
  return res.status(400).json({ error: 'Invalid SHA256 hash' });
}
// ...
[req.user.id, project_id, safeName, req.file.size, sha256, storageKey]
```
sha256 from req.body is validated as hex format, then stored in dwg_staging and propagated to dwg_canonical_files on promote. Server NEVER hashes the uploaded file and compares.

An attacker can upload file A with the sha256 of a different file B. After promotion, dwg_canonical_files records file B's hash but stores file A's bytes on disk. Downstream integrity checks (compare downloaded file hash vs stored hash) will always fail for legitimate clients, causing perpetual re-downloads or sync corruption. The same mechanism could be used to poison the canonical content record by uploading a corrupted DWG while claiming a known-good hash.

**Fix shape:** After renameSync, compute server-side hash via crypto.createHash('sha256') streaming from fullPath. Compare against client-provided sha256. On mismatch: unlink fullPath, return 400 { error: 'sha256 mismatch' }. Store the server-computed hash, not the client's value.

---

#### MED-3: v2 POST /push — orphaned file on disk if DB insert throws after renameSync
**Severity: MED | Category: Resource leak**
Verified by reading: `routes/dwg_two_way_sync.js:115-148`
```js
fs.renameSync(req.file.path, fullPath);
// ... DB operations ...
} catch (err) {
  console.error('POST /push error:', err);
  res.status(500).json({ error: 'Internal server error' });
}
```
If any DB operation between renameSync (line 115) and the final res.json (line 143) throws, the catch block (line 144) does not attempt to unlink fullPath. File is orphaned on disk with no dwg_staging row referencing it. Under repeated DB errors, the staging volume accumulates unreferenced files.

**Fix shape:** Set a boolean flag after renameSync; in catch block: `if (fileRenamed) { try { fs.unlinkSync(fullPath); } catch (_) {} }`.

---

#### MED-4: v2 promote — no status guard on staging row (already-promoted/rejected files can be re-promoted)
**Severity: MED | Category: Business logic / Race**
Verified by reading: `routes/dwg_two_way_sync.js:205-214`
```js
const stagingResult = await pool.query(
  'SELECT id, user_id, project_id, filename, size_bytes, sha256, storage_key FROM dwg_staging WHERE id = $1',
  [staging_id]
);
```
No status check in SELECT or after fetching. A staging row that is already 'promoted', 'rejected', or 'superseded' can be re-promoted. Concurrent promotes of the same staging_id: both admins read the staging row, both enter their transactions, both snapshot + update canonical. The second creates a redundant version entry for no actual content change.

**Fix shape:** Change staging SELECT to `WHERE id = $1 AND status = 'pending' FOR UPDATE`. Return 409 Conflict if no row found.

---

#### MED-5: v2 download + v2 manifest — no project membership check (IDOR)
**Severity: MED | Category: IDOR**
Verified by reading: `routes/dwg_two_way_sync.js:364-368, 36-45`
```js
const fileResult = await pool.query(
  'SELECT id, filename, storage_key FROM dwg_canonical_files WHERE id = $1',
  [canonical_file_id]
);
```
Any authenticated user (any role, not restricted to DWG_ROLES) can download any canonical file by UUID. No project membership check. v2 manifest similarly has no user-scoping. Same root cause as HIGH-1.

**Fix shape:** Add project membership or role-scoping to both queries.

---

#### LOW-3: v2 download — missing path containment check (defense-in-depth gap)
**Severity: LOW | Category: Path traversal (latent)**
Verified by reading: `routes/dwg_two_way_sync.js:373`
```js
const fullPath = path.join(process.env.UPLOAD_DIR || './uploads', file.storage_key);
```
No path.resolve + startsWith(uploadRoot) containment check. storage_key is server-generated so currently safe, but missing the Wave 85 F1 guard that v1 (lines 161-164) and server.js (lines 533-538) both implement. Defense-in-depth gap.

**Fix shape:** Apply Wave 85 F1 pattern: resolved = path.resolve(UPLOAD_DIR, storage_key); if (!resolved.startsWith(path.resolve(UPLOAD_DIR) + path.sep)) return 400.

---

#### LOW-4: v2 requireAuth fallback is direct middleware, not factory — would crash if mw missing
**Severity: LOW (latent, never fires in prod) | Category: Defensive coding**
Verified by reading: `routes/dwg_two_way_sync.js:7`
```js
const requireAuth = (mw && mw.requireAuth) || ((req, res, next) => next());
```
v1 correctly uses `|| (() => (req, res, next) => next())` (factory). v2 uses a direct middleware. When called as requireAuth() throughout the file: if mw.requireAuth is absent, this invokes the middleware immediately with no args, causing `TypeError: next is not a function`. Does not fire in prod since server.js passes mw.requireAuth.

**Fix shape:** Match v1: `|| (() => (req, res, next) => next())`.

---

## DUAL-ROUTE ARCHITECTURE ASSESSMENT

v1 (read-only pull) and v2 (two-way push/promote) target different tables and workflows. v2 provides a valuable staging-review capability that v1 lacks.

**Current state:** v2 is NON-FUNCTIONAL in production due to HIGH-2. No admin can promote. The entire upload-to-canonical workflow is dead.

**Recommendation:**
1. Fix HIGH-2 first (remove the broken isManager inner check — 1 line deletion). This unblocks the workflow.
2. Fix HIGH-3 + HIGH-4 before allowing any real DWG uploads through v2 (magic-byte check + server-side sha256 verification).
3. Do NOT drop v2. The staging review workflow has high value for government-contract QA.
4. Near-term mitigation if HIGH-3/HIGH-4 cannot be addressed immediately: gate POST /push behind requireManagerOrAdmin so only managers can push (removing the non-manager threat actor). This is not a correct long-term fix but limits the attack surface.

---

## AGGREGATE FINDINGS TABLE

| # | Sev | File | Category | Line(s) | Issue |
|---|---|---|---|---|---|
| 1 | HIGH | dwg_sync.js | IDOR | 84-92, 146-155 | No project membership check on manifest + file download |
| 2 | HIGH | dwg_two_way_sync.js | Broken auth | 196-198 | req.user.roles undefined — promote/reject always 403 |
| 3 | HIGH | dwg_two_way_sync.js | Upload validation | 91-93 | MIME check client-controlled, no magic-byte verification |
| 4 | HIGH | dwg_two_way_sync.js | Data integrity | 77-130 | sha256 from client stored verbatim, never server-verified |
| 5 | MED | dwg_sync.js | Audit log | (none) | No audit logging for file downloads in v1 |
| 6 | MED | dwg_sync.js | Data integrity | 229-241 | POST /state accepts arbitrary project_id without existence check |
| 7 | MED | dwg_two_way_sync.js | Resource leak | 115-148 | Orphaned file on disk if DB insert throws post-renameSync |
| 8 | MED | dwg_two_way_sync.js | Business logic | 205-214 | No status guard on promote — can re-promote non-pending rows |
| 9 | MED | dwg_two_way_sync.js | IDOR | 364-368, 36-45 | No project membership check on v2 download + manifest |
| 10 | LOW | dwg_sync.js | Info disclosure | 47-66 | Projects listing exposes all client names to all DWG-role users |
| 11 | LOW | dwg_sync.js | Resource | 100-115, 172-179 | Lazy SHA-256 reads entire file into RAM instead of streaming |
| 12 | LOW | dwg_two_way_sync.js | Path traversal | 373 | Missing path containment check on v2 download (defense-in-depth) |
| 13 | LOW | dwg_two_way_sync.js | Defensive coding | 7 | requireAuth fallback is direct middleware, not factory |

**Total: 4 HIGH, 5 MED, 4 LOW**

---

## COVERAGE GAPS

- Did not read routes/_audit.js to verify logAudit signature.
- Did not read migration 0044_dwg_offline_sync.sql — cannot confirm FK constraint on project_dwg_sync_state.project_id. If FK exists, MED-2 is partially mitigated at DB level.
- No frontend audit — v2 has no UI per Wave 52 notes.
- tests/dwg_two_way_sync.test.js exists (429 lines) with mock DB; does NOT catch HIGH-2 (promote always-403 bug) because tests mock the full middleware stack and use req.user.roles (array) from testAdmin which doesn't reflect real auth.js user shape.
- Storage backend: both routes use process.env.UPLOAD_DIR. No S3 SDK present. Future S3 migration would require storage_key refactoring.

=== WAVE-156 DWG SYNC SECURITY AUDIT REPORT END ===
