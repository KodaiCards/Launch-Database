# Project Photos API Reference

**Endpoint Base:** `/api/project-photos`

**Authentication:** All endpoints require `requireAuth()` middleware (session cookie or Bearer token).

**Storage:** Files stored on disk at `./uploads/project-photos/{project_id}/{photoId}{ext}`, with metadata in PostgreSQL table `project_photos`.

---

## Endpoints

### POST /api/project-photos — Upload Photo

**Description:** Upload a single photo to a project with optional GPS coordinates and caption.

**Method:** `POST`

**Authentication:** Required (`requireAuth()`)

**Content-Type:** `multipart/form-data`

**Request Body:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `photo` | File (binary) | YES | Image file. Max 20 MB. Allowed MIME types: `image/jpeg`, `image/png`, `image/heic`, `image/heif`, `image/webp` |
| `project_id` | UUID string | YES | Target project ID. Must be a valid project in the system. |
| `caption` | string | NO | Human-readable photo description (e.g., "Damage at splice point 3"). Max length: 255 characters (recommended). |
| `taken_at` | ISO 8601 timestamp | NO | When the photo was taken (e.g., `2026-05-28T14:30:00Z`). Defaults to server time if omitted. |
| `gps_lat` | float | NO | Latitude (WGS84, decimal degrees). E.g., `33.748995`. Required if `gps_lon` and `gps_accuracy_m` are provided. |
| `gps_lon` | float | NO | Longitude (WGS84, decimal degrees). E.g., `-84.387985`. Required if `gps_lat` is provided. |
| `gps_accuracy_m` | float | NO | GPS accuracy estimate in meters (e.g., `±15.0`). Usually comes from `Geolocation.getCurrentPosition()`. |

**Response (201 Created):**

```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "project_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  "uploaded_by": "user-uuid-here",
  "filename": "photo_20260528_143000.jpg",
  "mime_type": "image/jpeg",
  "size_bytes": 2457600,
  "caption": "Damage at splice point 3",
  "taken_at": "2026-05-28T14:30:00Z",
  "uploaded_at": "2026-05-28T14:35:22.123Z",
  "gps_lat": 33.748995,
  "gps_lon": -84.387985,
  "gps_accuracy_m": 15.0,
  "status": "active"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | `No photo file provided` | `photo` field missing from form data |
| 400 | `project_id required` | `project_id` field missing from form data |
| 400 | `MIME type {mime} not allowed` | File MIME type not in allowed list (jpeg, png, heic, heif, webp) |
| 401 | `Not authenticated` | `req.user.id` is null (auth middleware failed) |
| 404 | `Project not found` | Project with given `project_id` doesn't exist |
| 500 | `Internal server error` | Filesystem write error or database error |

**curl Example:**

```bash
curl -X POST http://localhost:3000/api/project-photos \
  -H "Cookie: lfs_session=..." \
  -F "project_id=f47ac10b-58cc-4372-a567-0e02b2c3d479" \
  -F "caption=Damage at splice point 3" \
  -F "taken_at=2026-05-28T14:30:00Z" \
  -F "gps_lat=33.748995" \
  -F "gps_lon=-84.387985" \
  -F "gps_accuracy_m=15.0" \
  -F "photo=@/path/to/photo.jpg"
```

**Audit Trail:**

Every successful upload logs an audit record with action `project_photo.upload` and the full photo metadata.

---

### GET /api/project-photos — List Photos for Project

**Description:** Fetch all active photos for a project with pagination.

**Method:** `GET`

**Authentication:** Required (`requireAuth()`)

**Query Parameters:**

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `project_id` | UUID string | YES | — | Project to fetch photos for. If omitted, returns 400 error. |
| `limit` | integer | NO | 50 | Max rows per page. Capped at 200. |
| `offset` | integer | NO | 0 | Pagination offset. Must be ≥0. |

**Response (200 OK):**

```json
{
  "rows": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "project_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "uploaded_by": "user-uuid-1",
      "filename": "photo_20260528_143000.jpg",
      "mime_type": "image/jpeg",
      "size_bytes": 2457600,
      "caption": "Damage at splice point 3",
      "taken_at": "2026-05-28T14:30:00Z",
      "uploaded_at": "2026-05-28T14:35:22.123Z",
      "gps_lat": 33.748995,
      "gps_lon": -84.387985,
      "gps_accuracy_m": 15.0,
      "status": "active",
      "uploader_name": "John Smith"
    },
    {
      "id": "650e8400-e29b-41d4-a716-446655440001",
      "project_id": "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      "uploaded_by": "user-uuid-2",
      "filename": "photo_20260528_150000.jpg",
      "mime_type": "image/jpeg",
      "size_bytes": 3120480,
      "caption": null,
      "taken_at": "2026-05-28T15:00:00Z",
      "uploaded_at": "2026-05-28T15:05:11.456Z",
      "gps_lat": 33.749120,
      "gps_lon": -84.388100,
      "gps_accuracy_m": 12.0,
      "status": "active",
      "uploader_name": "Jane Doe"
    }
  ],
  "total": 42,
  "limit": 50,
  "offset": 0
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | `project_id query param required` | `project_id` query param missing |
| 500 | `Internal server error` | Database query error |

**curl Example:**

```bash
curl -X GET "http://localhost:3000/api/project-photos?project_id=f47ac10b-58cc-4372-a567-0e02b2c3d479&limit=50&offset=0" \
  -H "Cookie: lfs_session=..."
```

**Notes:**

- Only returns photos with `status='active'` (archived photos filtered out).
- Results ordered by `uploaded_at DESC` (newest first).
- The `uploader_name` field is joined from the `users` table; if uploader has been deleted, this will be `NULL`.

---

### GET /api/project-photos/:id/download — Download Photo

**Description:** Stream (download) the binary photo content by ID.

**Method:** `GET`

**Authentication:** Required (`requireAuth()`)

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Photo record ID (must be valid UUID format) |

**Response (200 OK):**

- **Content-Type:** Set to the stored MIME type (e.g., `image/jpeg`)
- **Content-Disposition:** `inline; filename="photo"` (forces browser display)
- **Body:** Binary file stream

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | `Invalid photo ID format` | `id` is not a valid UUID (doesn't match `^[0-9a-f-]{36}$`) |
| 404 | `Photo not found` | Photo record doesn't exist in database |
| 404 | `Photo file not found on disk` | Photo record exists but file is missing from filesystem |
| 500 | `Internal server error` | Database or filesystem error |

**curl Example:**

```bash
curl -X GET "http://localhost:3000/api/project-photos/550e8400-e29b-41d4-a716-446655440000/download" \
  -H "Cookie: lfs_session=..." \
  -o photo.jpg
```

**HTML Image Tag:**

```html
<img src="/api/project-photos/550e8400-e29b-41d4-a716-446655440000/download" alt="Project photo">
```

---

### DELETE /api/project-photos/:id — Archive Photo (Soft Delete)

**Description:** Soft-delete a photo by marking its status as `'archived'`. The file is NOT removed from disk.

**Method:** `DELETE`

**Authentication:** Required (`requireAuth()`)

**Authorization:**

- The photo's uploader (stored in `uploaded_by`) can delete their own photos.
- Admin users (role `'admin'`) can delete any photo.
- Other users receive a 403 Forbidden response.

**URL Parameters:**

| Parameter | Type | Description |
|-----------|------|-------------|
| `id` | UUID | Photo record ID |

**Response (200 OK):**

```json
{
  "success": true,
  "status": "archived"
}
```

**Error Responses:**

| Status | Error | Cause |
|--------|-------|-------|
| 400 | `Invalid photo ID format` | `id` is not a valid UUID |
| 401 | `Not authenticated` | `req.user.id` is null |
| 403 | `Not authorized to delete this photo` | User is neither the uploader nor an admin |
| 404 | `Photo not found` | Photo record doesn't exist |
| 500 | `Internal server error` | Database error |

**curl Example:**

```bash
curl -X DELETE "http://localhost:3000/api/project-photos/550e8400-e29b-41d4-a716-446655440000" \
  -H "Cookie: lfs_session=..."
```

**Audit Trail:**

Every successful archive logs an audit record with action `project_photo.delete`, including before/after data.

---

## Database Schema

**Table:** `project_photos` (migration `0052_project_photos.sql`)

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PRIMARY KEY | Photo record ID (generated server-side via `crypto.randomUUID()`) |
| `project_id` | UUID | FOREIGN KEY → `projects.id` | Parent project |
| `uploaded_by` | UUID | FOREIGN KEY → `users.id` | User who uploaded the photo |
| `filename` | string | NOT NULL | Sanitized original filename (unsafe chars replaced with `_`) |
| `mime_type` | string | NOT NULL | MIME type (e.g., `image/jpeg`) |
| `size_bytes` | integer | NOT NULL | File size in bytes |
| `storage_key` | string | NOT NULL, UNIQUE | Disk path relative to `./uploads/`, format: `project-photos/{project_id}/{photoId}{ext}` |
| `caption` | text | NULL | Optional user-provided description |
| `taken_at` | timestamp | NULL | When the photo was taken (ISO 8601) |
| `uploaded_at` | timestamp | DEFAULT CURRENT_TIMESTAMP | When the photo was uploaded (server time) |
| `gps_lat` | decimal(9,6) | NULL | Latitude (WGS84) |
| `gps_lon` | decimal(9,6) | NULL | Longitude (WGS84) |
| `gps_accuracy_m` | decimal(7,2) | NULL | GPS accuracy in meters |
| `status` | string | DEFAULT `'active'` | `'active'` or `'archived'` (soft delete marker) |
| `created_at` | timestamp | DEFAULT CURRENT_TIMESTAMP | Record creation time (same as `uploaded_at` in practice) |

---

## PWA (Progressive Web App) Implementation

The photo uploader is deployed as a PWA at `/photos/`, providing offline support, home-screen installation, and background sync.

### Installation Flow

1. **Manifest:** Browser reads `/photos/manifest.webmanifest` to enable "Install" or "Add to Home Screen" prompt.
2. **Service Worker:** User grants permission to cache assets and handle offline requests.
3. **Home-Screen App:** iOS/Android users can save the app as a standalone icon that launches in full-screen mode.

### Service Worker (sw.js)

**Cache Strategy:**

- **Static Assets:** Cache-first (serve from cache, fall back to network)
- **API Requests:** Network-first (attempt network, fall back to offline JSON 503 error)

**Cached Assets:**

- HTML/JS/CSS: `/photos/index.html`, `/photos/photos.js`, `/photos/photos.css`, etc.
- Vendor libraries: `/photos/vendor/opencv.min.js`, `/photos/vendor/jscanify.min.js`
- Icons: `/photos/icons/icon-192.svg`, `/photos/icons/icon-512.svg`

**Cache Name:** `launch-fiber-photos-v2` (updated when manifests changes)

**Offline Behavior:**

- If `/api/project-photos` fails due to network error, returns HTTP 503 JSON response: `{ "error": "Offline" }`
- Photos.js app queues uploads to IndexedDB and retries when online

### Offline Queue (IndexedDB)

**Database:** `LaunchFiberPhotos` (version 1)

**Store:** `queue`

**Structure:** Each queued photo is stored as:

```javascript
{
  projectId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
  caption: "Damage at splice point 3",
  gps: { lat: 33.748995, lon: -84.387985, accuracy: 15.0 },
  timestamp: 1748391022000,  // milliseconds since epoch
  photoBase64: "data:image/jpeg;base64,/9j/4AAQSkZJRg..."
}
```

**Retry Logic:**

1. App captures photos while offline, stores base64-encoded copies in IndexedDB queue.
2. When connection restores, `drainOfflineQueue()` converts base64 back to Blob and uploads via `/api/project-photos`.
3. Successfully uploaded items are removed from the queue; failures remain for retry.
4. Queue is persistent across page reloads.

### GPS Capture Flow

1. User checks the **GPS toggle** checkbox on the upload form.
2. App calls `navigator.geolocation.getCurrentPosition()` with `enableHighAccuracy: true` and 10-second timeout.
3. If granted, displays `✅ Location captured (±Xm accuracy)`.
4. If denied or timeout, displays `❌ Location denied or unavailable`.
5. GPS data (lat, lon, accuracy) sent with upload payload.

**Privacy Note:** GPS capture requires user permission in modern browsers. Users can deny permission or revoke it in browser settings.

### Manifest Fields (manifest.webmanifest)

| Field | Value | Purpose |
|-------|-------|---------|
| `name` | "Launch Fiber Photos" | Full app name (shown during install) |
| `short_name` | "LF Photos" | Home-screen icon label (max ~12 chars) |
| `start_url` | "/photos/" | URL to open when launched from home screen |
| `scope` | "/photos/" | URLs considered part of the app scope |
| `display` | "standalone" | Full-screen mode (hides browser UI) |
| `orientation` | "portrait" | Lock app to portrait orientation on mobile |
| `theme_color` | "#1B5FA0" | Browser chrome color (Launch blue) |
| `background_color` | "#0f1419" | Splash screen background (dark) |
| `categories` | ["productivity"] | App store categorization |
| `icons` | Array of SVG icons (192×192, 512×512) | Home-screen and splash icons |

---

## Photo Scanning & Document-Scanner Integration

**Current Status:** Placeholder for future feature.

**Vendor Libraries Cached (but not yet integrated):**

- `opencv.min.js` — Computer vision library for image processing
- `jscanify.min.js` — Document-edge detection and perspective correction

**Planned Flow:**

1. User opens `/photos/scanner.html` (within PWA scope).
2. Camera stream captured via `navigator.mediaDevices.getUserMedia()`.
3. jscanify detects document edges in real-time preview.
4. User taps "capture" to snap and auto-crop document.
5. Cropped image fed to `/photos/photos.js` for upload.

**Current Limitation:** No active integration; scanner.js and scanner.html exist as stubs with vendor libs pre-cached for future implementation.

---

## Storage Layout

**Directory Structure:**

```
./uploads/
└── project-photos/
    ├── {project_id_1}/
    │   ├── {photoId_1}.jpg
    │   ├── {photoId_2}.png
    │   └── {photoId_3}.webp
    ├── {project_id_2}/
    │   └── {photoId_4}.heic
    └── ...
```

**Storage Key Format:**

- Relative path: `project-photos/{project_id}/{photoId}{ext}`
- Extension preserved from upload (`.jpg`, `.png`, `.heic`, `.heif`, `.webp`)
- Example: `project-photos/f47ac10b-58cc-4372-a567-0e02b2c3d479/550e8400-e29b-41d4-a716-446655440000.jpg`

**File Retention:**

- Files stored indefinitely until manually archived.
- Soft-delete (status → `'archived'`) hides from UI but leaves file on disk.
- No automatic garbage collection; archived files are not removed.

**Environment Variable:**

- `UPLOAD_DIR` (default: `./uploads`) — Base directory for all uploads.

---

## Soft-Delete Semantics (Status Column)

**Status Values:**

| Value | Meaning | Visible in API |
|-------|---------|----------------|
| `'active'` | Published photo | YES (returned by GET endpoints) |
| `'archived'` | Deleted by user/admin | NO (filtered out of all queries) |

**Why Soft-Delete?**

- Preserves audit trail and GPS data for later discovery.
- Allows recovery if deletion was accidental (manual SQL update).
- Avoids data loss on cascade delete if project is removed.

**Archived Photos:**

- Not returned by `GET /api/project-photos?project_id=X` (WHERE clause filters `status='active'`).
- Still exist in database; can be queried manually if needed.
- Original file remains on disk.
- Audit log contains deletion timestamp and actor user ID.

---

## Error Handling & Validation

**Input Validation:**

- **File size:** Max 20 MB (Multer limit).
- **File type:** Only `image/jpeg`, `image/png`, `image/heic`, `image/heif`, `image/webp` accepted.
- **project_id:** Must be a valid UUID and must exist as a project.
- **UUID format:** All `id` path parameters validated as `[0-9a-f-]{36}` (36-char hex with hyphens).

**Error Message Sanitization:**

- MIME-type errors include the rejected type (e.g., `MIME type application/pdf not allowed`).
- Database/filesystem errors return generic `Internal server error` to prevent information leakage.

**Audit Logging:**

- Every POST (upload) and DELETE (archive) action logged to audit table.
- Action names: `project_photo.upload`, `project_photo.delete`.
- Includes actor (`actor_user_id`), entity (`entity_id`), and before/after data.

---

## Performance Notes

**File Streaming:**

- Downloads use `fs.createReadStream()` to avoid loading entire file into memory.
- Suitable for large photos (supports up to server's memory limits per browser request).

**Database Queries:**

- GET list endpoint uses `LIMIT` and `OFFSET` for pagination (max 200 rows).
- Uploader name joined from `users` table on every list call (no caching).
- No indexing on `status` column; consider adding for high-volume projects.

**Offline Queue:**

- IndexedDB query runs synchronously (blocking) at app startup.
- Offline uploads retry sequentially (not parallelized).
- Base64 encoding inflates queue size by ~33% (acceptable for field use).

---

## Example Integration

### React Component (photos.js wrapper)

```javascript
async function uploadPhoto(projectId, photoBlob, caption, gpsData) {
  const formData = new FormData();
  formData.append('project_id', projectId);
  formData.append('photo', photoBlob);
  formData.append('caption', caption);
  if (gpsData) {
    formData.append('gps_lat', gpsData.lat);
    formData.append('gps_lon', gpsData.lon);
    formData.append('gps_accuracy_m', gpsData.accuracy);
  }

  const res = await fetch('/api/project-photos', {
    method: 'POST',
    body: formData,
    credentials: 'include'
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error);
  }

  return res.json(); // Returns photo record
}

async function listPhotos(projectId, limit = 50, offset = 0) {
  const res = await fetch(
    `/api/project-photos?project_id=${projectId}&limit=${limit}&offset=${offset}`,
    { credentials: 'include' }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json(); // Returns { rows, total, limit, offset }
}
```

---

## Deployment Checklist

- [ ] Migration `0052_project_photos.sql` applied (creates `project_photos` table)
- [ ] `UPLOAD_DIR` environment variable set to writable directory
- [ ] Service worker registered in `/photos/index.html`: `navigator.serviceWorker.register('/photos/sw.js')`
- [ ] Manifest linked in HTML: `<link rel="manifest" href="/photos/manifest.webmanifest">`
- [ ] Vendor libs (opencv, jscanify) cached in SW (for future scanner feature)
- [ ] MIME-type whitelist tested (jpeg, png, heic, heif, webp)
- [ ] GPS permission prompt tested on iOS/Android
- [ ] Offline queue flow tested (disable network, upload, reconnect)
- [ ] Soft-delete semantics verified (archived photos hidden from UI but present in DB)
