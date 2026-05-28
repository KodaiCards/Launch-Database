# Wave 94 — Photos Security Audit

**Write-path constraints acknowledged: only `audit-output/wave-94-photos-security/AUDIT.md` written.**

**Scope:** `routes/project_photos.js`, `public/photos/` (PWA, scanner, service worker), `public/js/admin_project_photos.js`, `migrations/0052_project_photos.sql`

---

## FINDINGS

---

### HIGH-1 — Extension not validated; attacker can write arbitrary-extension files to disk

**Framing:** #1 (File upload validation)
**File:Line:** `routes/project_photos.js:79-84`
**Snippet:**
```js
const ext = path.extname(req.file.originalname).toLowerCase() || '.jpg';
const sanitizedName = req.file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
const photoId = crypto.randomUUID();
const storageKey = `project-photos/${project_id}/${photoId}${ext}`;
```
**Attack path:** multer's `fileFilter` checks `file.mimetype`, which is the `Content-Type` sub-header sent by the client — not a magic-byte inspection of the file content. An attacker sends a multipart request with `Content-Type: image/jpeg` for the file part, but the actual file body is PHP, JavaScript, or HTML code. The `originalname` can be `shell.php`, making `ext = '.php'`. multer passes the MIME check, the handler writes the buffer to disk at `UUID.php`. If a misconfigured reverse proxy or a later direct-serve pathway ever executes or serves that file, code execution or stored XSS results. Even without execution, `.html` files in the uploads directory served to admins are stored-XSS vectors.
**Fix shape:** Add an allowlist check on `ext` immediately after extracting it:
```js
const ALLOWED_EXTS = new Set(['.jpg', '.jpeg', '.png', '.heic', '.heif', '.webp']);
if (!ALLOWED_EXTS.has(ext)) {
  return res.status(400).json({ error: 'File extension not permitted' });
}
```
Additionally, add a magic-byte check for at least JPEG (`FFD8FF`), PNG (`89504E47`), and WebP (`52494646…57454250`) headers using `req.file.buffer.slice(0, 12)`.
**Confidence:** HIGH

---

### HIGH-2 — Stored XSS via unescaped `caption` in PWA photo-card innerHTML

**Framing:** #3 (IDOR / information disclosure)
**File:Line:** `public/photos/photos.js:288-294`
**Snippet:**
```js
card.innerHTML = `
  <img src="/api/project-photos/${photo.id}/download" alt="${photo.filename}" class="photo-card__img">
  <div class="photo-card__info">
    ${photo.caption ? `<div>${photo.caption}</div>` : ''}
    <div style="font-size: 0.7rem; opacity: 0.8;">${photo.uploader_name || 'Unknown'}</div>
  </div>
`;
```
**Attack path:** `caption` is stored verbatim in the DB (no server-side sanitization at `routes/project_photos.js:113`). When the "Recent Photos" tab renders, unescaped `caption` from the API is injected directly into `innerHTML`. A malicious user uploads a photo with `caption = '<img src=x onerror=alert(document.cookie)>'`. Any other authenticated user who views the same project's recent photos in the PWA triggers the XSS. `uploader_name` from the JOIN on `users.name` is similarly unescaped and could be a secondary vector.
**Note:** `admin_project_photos.js` (admin panel view) correctly uses `esc()` from `admin.html`'s global scope. The PWA (`photos.js`) has no `esc()` helper and does not escape any dynamic values.
**Fix shape:** Add an `esc()` helper in `photos.js` and apply it to `photo.caption`, `photo.filename`, and `photo.uploader_name` before inserting into `innerHTML`. Alternatively, build the card using `document.createElement` + `.textContent` setters.
**Confidence:** HIGH

---

### HIGH-3 — Scanner uploads always fail silently: wrong multipart field name + wrong GPS field names

**Framing:** #8 (Doc scanner client-side processing)
**File:Line:** `public/photos/scanner.js:413, 420-422`
**Snippet:**
```js
formData.append('file', blob, `scan-${Date.now()}.jpg`);  // line 413
// ...
formData.append('latitude', state.gpsData.latitude);       // line 420
formData.append('longitude', state.gpsData.longitude);     // line 421
formData.append('gps_accuracy', state.gpsData.accuracy);   // line 422
```
**Expected by API (`routes/project_photos.js:52`):**
```js
upload.single('photo')   // multer looks for field name 'photo', not 'file'
const { gps_lat, gps_lon, gps_accuracy_m } = req.body;
```
**Attack path / impact:** Every scanner upload returns HTTP 400 `"No photo file provided"` because multer finds no `photo` field. The scanner is completely non-functional. GPS data would additionally be silently dropped even if the field name were fixed. This is a HIGH-severity defect on a feature that is actively presented in the UI as a workflow entry point.
**Fix shape:** Change `formData.append('file', ...)` → `formData.append('photo', ...)`. Change GPS field names to `gps_lat`, `gps_lon`, `gps_accuracy_m`.
**Confidence:** HIGH (verified by reading both files)

---

### MED-1 — IDOR: no project-ownership check on list or download endpoints

**Framing:** #3 (IDOR)
**File:Line:** `routes/project_photos.js:132-166` (list), `routes/project_photos.js:169-202` (download)
**Snippet (list):**
```js
app.get('/api/project-photos', requireAuth, async (req, res) => {
  const { project_id } = req.query;
  // ... no check that project_id belongs to caller's visibility scope
  const { rows } = await pool.query(`
    SELECT ... FROM project_photos pp WHERE pp.project_id=$1 AND pp.status=$2
  `, [project_id, 'active', limit, offset]);
```
**Snippet (download):**
```js
const { rows } = await pool.query(
  'SELECT id, mime_type, storage_key FROM project_photos WHERE id=$1',
  [photoId]  // no project-ownership join, no status filter
);
```
**Attack path:** Any authenticated employee can enumerate photos from any project by cycling `project_id` values (all projects are UUID v4, but UUIDs for projects in this system are discoverable from other APIs). The download endpoint additionally has no `status='active'` filter — so a soft-archived photo remains downloadable indefinitely by any auth'd user who knows or guesses its UUID. The upload endpoint (`POST`) also lacks a project-ownership check: a code:comment at line 64-66 explicitly acknowledges this with "Simple approach: any logged-in user can upload to any project."
**Fix shape:** For list and download, add a join or sub-select verifying the requesting user has a `job_assignments` or `ec_job_visibility` row for the project (or that user.role = 'admin'). For the download endpoint, add `AND status = 'active'` to the query. For upload, same project-visibility check.
**Confidence:** HIGH for the behavior; MED for the severity — this is an internal tool where all users may already have broad project visibility, but it's still an unintended horizontal data access surface.

---

### MED-2 — Offline queue stores full-resolution photo as base64 in IndexedDB without session binding

**Framing:** #9 (Offline queue)
**File:Line:** `public/photos/photos.js:241-248`, `public/photos/photos.js:385-416`
**Snippet:**
```js
const photoData = {
  projectId: state.selectedProjectId,
  caption: captionInput.value,
  gps: state.gpsCoordinates,           // GPS coordinates of field worker
  timestamp: Date.now(),
  photoBase64: await fileToBase64(state.currentPhoto)  // full image as data-URL
};
queueOfflineUpload(photoData);
```
**Attack path:** (a) Data persistence leak: GPS coordinates and full photo (possibly including sensitive as-built drawings, infrastructure locations, splice case internals) are stored in `IndexedDB['LaunchFiberPhotos']['queue']`. IndexedDB is persistent storage — data survives browser close, device sleep, and app restart. There is no session expiry, TTL, or clear-on-logout logic. If a field worker uses a shared device (kiosk tablet, shop phone), the next user can open DevTools → Application → IndexedDB and read all queued photos + GPS.

(b) Session mismatch: `drainOfflineQueue()` fires on the `online` event (line 121), which can trigger at any time — including after a different user has logged in on the same device. The drain submits the queued upload with `credentials: 'include'` using the **current session**, so User B's session is used to upload User A's queued photo to User A's `projectId`. The photo appears in the project attributed to User B.
**Fix shape:** (a) Add `store.clear()` on logout (auth-change event or `/api/auth/logout` response intercept). (b) Store the user ID with each queue item and skip items where `item.userId !== state.user.id` in `drainOfflineQueue()`.
**Confidence:** MED (shared-device scenario is plausible for field crew PWA)

---

### MED-3 — Schema constraint contradiction: `uploaded_by NOT NULL` + `ON DELETE SET NULL`

**Framing:** #6 (Soft-delete semantics / data integrity)
**File:Line:** `migrations/0052_project_photos.sql:9`
**Snippet:**
```sql
uploaded_by uuid NOT NULL REFERENCES users(id) ON DELETE SET NULL,
```
**Attack path:** `NOT NULL` and `ON DELETE SET NULL` are mutually exclusive. When Postgres attempts to cascade a user deletion and execute `SET NULL` on `uploaded_by`, it will raise `ERROR: null value in column "uploaded_by" of relation "project_photos" violates not-null constraint`. This means **any attempt to delete a user who has ever uploaded a photo will hard-fail**, locking that user account in the system permanently until an admin manually works around it at the DB level.
**Fix shape:** Either (a) drop the `NOT NULL` constraint on `uploaded_by` (the `ON DELETE SET NULL` semantics are correct — photos should survive user deletion), or (b) change to `ON DELETE RESTRICT` and handle user deletion via a cascade-archive step in the application layer.
**Confidence:** HIGH (definitive Postgres behavior)

---

### MED-4 — GPS coordinates exposed to all project-visible users without explicit opt-out at read time

**Framing:** #5 (Information disclosure)
**File:Line:** `routes/project_photos.js:151-160`
**Snippet:**
```js
SELECT pp.id, pp.project_id, pp.uploaded_by, pp.filename, pp.mime_type,
       pp.size_bytes, pp.caption, pp.taken_at, pp.uploaded_at,
       pp.gps_lat, pp.gps_lon, pp.gps_accuracy_m, pp.status,
       u.name as uploader_name
FROM project_photos pp LEFT JOIN users u ON u.id = pp.uploaded_by
WHERE pp.project_id=$1 AND pp.status=$2
```
**Context:** GPS coordinates are returned to every caller of `GET /api/project-photos`. On an internal tool for a company with known offices/job sites, precise GPS coordinates of where individual crew members were standing when they uploaded photos enables fine-grained employee location tracking. Admin users viewing the lightbox in `admin_project_photos.js` see coordinates displayed in the footer. This is intentional for construction documentation, but: (a) there is no `gps_visible` toggle or redaction for lower-privilege users, and (b) the upload endpoint captures GPS even when the crew member did not explicitly opt in (the user toggles GPS in the UI, but the server doesn't reject uploads with GPS from clients that send it unconditionally). This is LOW-risk for an internal ops tool but worth flagging given the employee-location implication.
**Fix shape:** Acceptable as-is for an internal ops tool where all users are employees; flag as a policy decision for Carter. If the tool ever gets client-visible surfaces, GPS should be opt-in at the display layer.
**Confidence:** MED (intentional feature, privacy implication)

---

### MED-5 — `requireAuth` fallback is a silent open-gate if `mw` is ever passed as falsy

**Framing:** #4 (Authorization bypass)
**File:Line:** `routes/project_photos.js:21-22`
**Snippet:**
```js
const requireAuth = (mw && mw.requireAuth) || ((req, res, next) => next());
const requireAdmin = (mw && mw.requireAdmin) || ((req, res, next) => next());
```
**Context:** In production, `server.js:741` passes `{ requireAuth, requireAdmin }` correctly so the fallback never fires. However, the fallback `(req, res, next) => next()` is a no-op pass-through that silently bypasses all auth if `mw` is ever null/undefined. The pattern is repeated in other route files. If a future refactor, test harness, or copy-paste causes this module to be invoked without a valid `mw` object, all four photo endpoints become unauthenticated.
**Fix shape:** Replace the fallback with a hard fail: `if (!mw || !mw.requireAuth) throw new Error('requireAuth middleware required')`. Alternatively, use destructuring with defaults that throw.
**Confidence:** HIGH for the code smell; LOW for actual exploitability in current production

---

### LOW-1 — Archived photos remain downloadable via `/api/project-photos/:id/download`

**Framing:** #6 (Soft-delete semantics)
**File:Line:** `routes/project_photos.js:179-181`
**Snippet:**
```js
const { rows } = await pool.query(
  'SELECT id, mime_type, storage_key FROM project_photos WHERE id=$1',
  [photoId]
);
```
**Issue:** The download query has no `AND status = 'active'` filter. A photo soft-archived by a user remains downloadable by any authenticated user who knows or guesses the UUID (16 bytes of entropy — infeasible to brute-force, but not protected against enumeration if IDs are leaked).
**Fix shape:** Add `AND status = 'active'` to the download query.
**Confidence:** HIGH

---

### LOW-2 — No disk purge for archived photos; storage grows unbounded

**Framing:** #6 (Soft-delete semantics)
**File:Line:** `routes/project_photos.js:237-241` (DELETE handler)
**Issue:** The DELETE endpoint performs a DB soft-archive (`status='archived'`) but does not call `fs.unlinkSync()` or schedule a disk removal. There is no background job, cron, or admin endpoint to purge archived photos from disk. Photos accumulate permanently in `UPLOAD_DIR`.
**Fix shape:** Either (a) unlink the file immediately on archive, or (b) add an admin endpoint `POST /api/admin/purge-archived-photos` that batch-unlinks files where `status='archived'` and records a deletion audit log entry.
**Confidence:** HIGH

---

### LOW-3 — No SRI on vendored opencv.min.js and jscanify.min.js; vendor README documents no checksums

**Framing:** #8 (Doc scanner MITM)
**File:Line:** `public/photos/scanner.html:120-122`, `public/photos/vendor/README.md`
**Snippet:**
```html
<script async src="vendor/opencv.min.js" onload="onOpenCvReady();"></script>
<script src="vendor/jscanify.min.js"></script>
```
**Issue:** Vendor files are served from the same origin as the app (not CDN), so SRI hashes on the `<script>` tags themselves don't add meaningful protection against a compromised repo deployment. However, the vendor README explicitly notes "Checksums (SHA256) of vendored files should be documented here for security verification" and then documents nothing. If the files are replaced (supply-chain compromise, developer error, repo injection), there is no detection mechanism. Since these run opencv.js (full WASM binary, ~10MB) with direct canvas pixel access, a compromised opencv.min.js has full read/write access to the captured image before upload.
**Fix shape:** Document SHA256 checksums of the exact versions used in `vendor/README.md`. Add a build-time checksum verification step (`sha256sum -c`). This is low-severity because the attack requires write access to the repo, but the README explicitly calls for remediation.
**Confidence:** MED

---

### LOW-4 — File size cap is 20MB but prompt/docs say 50MB; cap not communicated to client

**Framing:** #1 (File upload validation)
**File:Line:** `routes/project_photos.js:27`
**Snippet:**
```js
limits: { fileSize: 20 * 1024 * 1024 },
```
**Issue:** The dispatch prompt specifies the expected cap as 50MB; the actual enforced limit is 20MB. Multer returns a `MulterError: File too large` which is swallowed by the generic `serverError()` handler (line 40-46) and surfaced as `500 Internal Server Error` rather than a `413 Payload Too Large`. Users uploading high-resolution HEIC photos from modern iPhones (common in field documentation) routinely produce 15-25MB files; the 20MB cap will silently fail for some of those.
**Fix shape:** (a) Decide and document the intended cap. (b) Add a `MulterError` catch branch to return `413` with a human-readable message: `res.status(413).json({ error: 'File too large. Maximum 20 MB.' })`.
**Confidence:** HIGH

---

## VERIFIED CLEAN

The following items were explicitly checked and confirmed to not be issues:

1. **Storage path traversal (framing #2):** `storageKey` is constructed from `project_id` (UUID, Postgres-validated), `crypto.randomUUID()` output, and `path.extname()` which never returns path separators. No user-controlled component can traverse outside `UPLOAD_DIR`. The download handler reads `storage_key` from DB (not from request), so no request-time traversal is possible.

2. **PWA route auth gate (framing #4):** `server.js:496` wraps `/photos/` with `requireAuth()` before the `express.static` handler. The `express.static` only fires after auth is confirmed. Scanner page is served from the same static directory under the same gate.

3. **Service worker API caching (framing #7):** `sw.js:57-73` correctly routes all `/api/` requests via `network-first` with no caching of API responses. A stale service worker cache cannot cause a stale state to be uploaded as fresh — the actual fetch to `/api/project-photos` always goes to the network.

4. **SQL injection:** All four endpoints use parameterized queries (`$1, $2...`). `project_id`, `photo_id`, `limit`, `offset` are all bound parameters.

5. **XSS in admin lightbox:** `admin_project_photos.js` correctly uses `esc()` (available in `admin.html` global scope) for `caption`, `uploaderName`, `caption` in the onclick handler, and in `alt` attribute. `title.textContent = caption` (line 202) is also safe.

6. **UUID format validation:** Both the download and DELETE endpoints validate `photoId` against `/^[0-9a-f-]{36}$/i` before hitting the DB.

7. **requireAuth is passed in production:** `server.js:741` passes `{ requireAuth, requireAdmin }`, so the dangerous fallback (MED-5) does not fire in production. The fallback is a latent risk, not an active one.

8. **SW vendor cache integrity at load time:** Vendor files are served from the same origin as the application. They are cached by the SW, but the service worker itself runs in the same origin trust context, so same-origin vendor file replacement is not meaningfully different from any other JS on the page.

9. **Multer memory storage DoS cap:** The 20MB `fileSize` limit enforced by multer prevents unbounded RAM usage from a single oversized upload.

10. **Upload MIME allowlist scope:** `['image/jpeg', 'image/png', 'image/heic', 'image/heif', 'image/webp']` is correct for the intended use case. SVG is correctly excluded (SVG can contain `<script>` tags).

---

## COVERAGE GAPS

1. **`public/photos/photos.css` and `public/photos/scanner.css`** — not audited. CSS injection via `caption` into `style=` attributes is theoretically possible but `photos.js` does not use `style=` with DB values.

2. **Multer error handling edge cases** — did not verify the exact HTTP response shape when multer rejects a file (MIME mismatch or size exceeded). The `serverError` function may leak `MulterError` detail. Confidence: the MIME error is surfaced (line 42-44 explicitly passes MIME errors through), but size errors produce 500.

3. **`/api/auth/me` response shape** — audited as a consumer (PWA reads it) but the auth module itself was not in scope for this wave.

4. **IndexedDB access controls** — browser-level origin isolation was assumed correct; did not verify sub-domain sharing or WebView-specific IndexedDB access in the deployed environment.

5. **Railway/Docker file-execution config** — did not verify whether the deployment environment could execute `.php` or `.html` files from `UPLOAD_DIR`. HIGH-1's severity depends on this; treated as HIGH conservatively.

---

## VERDICT: **RED**

| Severity | Count |
|---|---|
| HIGH | 3 |
| MED | 5 |
| LOW | 4 |
| Total | 12 |

**Blocking issues (must fix before this feature is used in production for sensitive government project documentation):**
- HIGH-1: Extension allowlist + magic-byte check
- HIGH-2: Stored XSS via caption in PWA innerHTML
- HIGH-3: Scanner uploads broken (wrong field name)

**Important but not blocking for internal field crew use:**
- MED-1: IDOR on list/download/upload
- MED-2: Offline queue session mismatch + persistent sensitive data
- MED-3: Schema NOT NULL / ON DELETE SET NULL contradiction (will fail on user delete)
- MED-4: GPS exposure policy decision
- MED-5: requireAuth fallback silent open-gate

=== WAVE 94 PHOTOS SECURITY AUDIT REPORT END ===
