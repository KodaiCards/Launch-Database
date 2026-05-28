# Client Portal API Reference

> `routes/client_portal_v2.js` + `routes/_client_auth.js` — token-based client authentication and project document access.

## Overview

The Client Portal v2 provides a token-based authentication surface for external clients (PSC, etc.) to view projects, download workspace files, and approve documents. Each client is an `organization` with multiple `users`, each user can generate login `tokens` with optional expiration.

**Production URL:** `/client/` (SPA) + `/api/client/*` and `/api/admin/*` endpoints

---

## Authentication Model

### Token Lifecycle

1. **Admin generates a token** → `POST /api/admin/client-orgs/:id/users/:uid/tokens`
2. **Raw token returned once** (never stored in plaintext)
3. **Client clicks login link** → `GET /client/login/:rawToken`
4. **Token is hashed** (PBKDF2 or bcrypt), validated against DB, session cookie set
5. **Caller is redirected** to `/client/` with httpOnly cookie
6. **Cookie travels** on all `/api/client/*` requests (same-origin, `sameSite: lax`)
7. **Logout** → `POST /client/logout` revokes token + clears cookie

### Security Properties

- **Opaque login errors** (W45-MED-1): all 401 paths return identical "This login link is invalid or no longer active" to prevent token-state enumeration (existence / revoked / expired / inactive)
- **No plaintext storage:** raw token hashed before DB insert; only hash stored
- **Cookie flags:** `httpOnly=true`, `sameSite=lax`, `secure=true` (production), `path=/`
- **Token revocation:** Setting `revoked_at = NOW()` invalidates even before expiry
- **Org + user status checks:** Token must belong to `active` org and `active` user

---

## Client-Facing Endpoints

### POST /client/login/:rawToken

Consume a login token and set session cookie.

```
GET /client/login/eyJhbGc...
```

**Path Parameters:**
- `rawToken`: Raw token string from invitation email/link

**Workflow:**
1. Hash the raw token
2. Query DB: `SELECT ct.*, cu.status, co.status WHERE token_hash = hash`
3. Validate: not revoked, not expired, user active, org active
4. Set `CLIENT_SESSION_COOKIE` (httpOnly, sameSite=lax)
5. Redirect to `/client/`

**Response:**
- 302: Redirect to `/client/` (success)
- 401: Invalid/revoked/expired/inactive token (opaque message)
- 500: Database error

**Example:**
```bash
curl -L "http://localhost/client/login/eyJhbGc..."
# Sets cookie, follows redirect to /client/
```

---

### POST /client/logout

Revoke session token and clear cookie.

```
POST /client/logout
Content-Type: application/json
```

**Request:** (empty body)

**Workflow:**
1. Extract raw token from `CLIENT_SESSION_COOKIE`
2. Hash it
3. `UPDATE client_tokens SET revoked_at = NOW() WHERE token_hash = hash`
4. Clear cookie
5. Redirect or return 200

**Response:**
```json
{ "ok": true }
```

**Auth:** `requireClientAuth` (must have valid session cookie)

**Errors:**
- 500: Database error

**Note:** Clearing cookie + revoking token provides defense-in-depth (cookie invalidated both client-side and server-side).

---

### GET /api/client/me

Fetch authenticated client user + organization identity.

```
GET /api/client/me
```

**Response:**
```json
{
  "client_user": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@psc.com",
    "org_id": "uuid",
    "is_primary": true,
    "status": "active",
    "created_at": "2026-05-28T10:00:00Z"
  },
  "client_org": {
    "id": "uuid",
    "name": "PSC Engineering",
    "status": "active",
    "created_at": "2026-05-20T10:00:00Z"
  }
}
```

**Auth:** `requireClientAuth` (session cookie required)

**Errors:**
- 401: No valid session
- 500: Database error

---

### GET /api/client/projects

List leaf projects visible to the authenticated client's organization.

```
GET /api/client/projects
```

**Response:**
```json
{
  "projects": [
    {
      "id": "uuid",
      "name": "RUS-2026-Q1 Design",
      "service_area_name": "Macon County",
      "program": "rus",
      "status": "active",
      "created_at": "2026-05-20T10:00:00Z",
      "engineering_contract_id": "uuid",
      "contract_id": "uuid"
    },
    {
      "id": "uuid",
      "name": "RUS-2026-Q1 Splicing",
      "service_area_name": "Macon County",
      "program": "rus",
      "status": "active",
      "created_at": "2026-05-20T10:05:00Z",
      "engineering_contract_id": "uuid",
      "contract_id": "uuid"
    }
  ]
}
```

**Filtering:**
- Only returns `is_rollup = false` (leaf projects)
- Only returns projects linked to an `engineering_contract` whose `client_org_id` matches the caller's org
- Ordered by contract name, then project name

**Auth:** `requireClientAuth` (session cookie required)

**Errors:**
- 401: No valid session
- 500: Database error

---

### GET /api/client/projects/:id

Fetch a single project by ID if it belongs to the client's organization.

```
GET /api/client/projects/550e8400-e29b-41d4-a716-446655440000
```

**Path Parameters:**
- `id` (UUID): Project ID

**Validation:**
- UUID format check (returns 400 if invalid, preventing DB syntax error)
- IDOR check: project's EC must belong to caller's client_org_id

**Response:**
```json
{
  "project": {
    "id": "uuid",
    "name": "RUS-2026-Q1 Design",
    "service_area_name": "Macon County",
    "program": "rus",
    "status": "active",
    "created_at": "2026-05-20T10:00:00Z",
    "engineering_contract_id": "uuid",
    "contract_id": "uuid"
  }
}
```

**Auth:** `requireClientAuth` (session cookie required)

**Errors:**
- 400: Invalid UUID format
- 401: No valid session
- 404: Project not found or doesn't belong to client's org
- 500: Database error

---

### GET /api/client/projects/:project_id/workspace-files

List public workspace folders + files attached to a project.

```
GET /api/client/projects/550e8400-e29b-41d4-a716-446655440000/workspace-files
```

**Path Parameters:**
- `project_id` (UUID): Project ID

**Validation:**
- UUID format check
- IDOR check: project must belong to caller's client_org_id via EC chain

**Response:**
```json
{
  "folders": [
    {
      "id": "uuid",
      "name": "Design Drawings",
      "share_mode": "public",
      "created_at": "2026-05-24T10:00:00Z",
      "file_count": 3,
      "files": [
        {
          "id": "uuid",
          "filename": "site_survey.pdf",
          "mime_type": "application/pdf",
          "size_bytes": 2048000,
          "uploaded_at": "2026-05-25T14:30:00Z",
          "uploaded_by_name": "Alice"
        },
        {
          "id": "uuid",
          "filename": "as_built.dwg",
          "mime_type": "application/x-dwg",
          "size_bytes": 1024000,
          "uploaded_at": "2026-05-25T14:35:00Z",
          "uploaded_by_name": "Alice"
        }
      ]
    }
  ]
}
```

**Filtering:**
- Only returns folders with `share_mode = public`
- Only lists files (limited to 20 per folder, ordered by `uploaded_at DESC`)
- Active files only (`deleted_at IS NULL`)

**Auth:** `requireClientAuth` (session cookie required)

**Errors:**
- 400: Invalid UUID format
- 401: No valid session
- 404: Project not found or doesn't belong to client's org
- 500: Database error

---

### GET /api/client/workspace-files/:file_id/download

Download a workspace file.

```
GET /api/client/workspace-files/550e8400-e29b-41d4-a716-446655440000/download
```

**Path Parameters:**
- `file_id` (UUID): File ID

**Validation:**
- UUID format check
- IDOR scope: file's folder must be `public`, attached to a project owned by caller's client_org

**Workflow:**
1. `SELECT wfile.* FROM workspace_files wfile JOIN workspace_folders wf JOIN projects p JOIN engineering_contracts ec WHERE wfile.id = $1 AND wf.share_mode = 'public' AND ec.client_org_id = $2`
2. If no match: return 404 (IDOR safe)
3. Check file exists on disk
4. Stream with correct MIME type + attachment header

**Response:** Binary file stream with `Content-Type` and `Content-Disposition: attachment; filename="..."`

**Auth:** `requireClientAuth` (session cookie required)

**Errors:**
- 400: Invalid UUID format
- 401: No valid session
- 404: File not found or no read access (same response to prevent enumeration)
- 500: Disk I/O error

**Example:**
```bash
curl -H "Cookie: lfs_session=..." \
  http://localhost/api/client/workspace-files/550e8400-e29b-41d4-a716-446655440000/download \
  -o site_survey.pdf
```

---

## Admin-Only Endpoints

All admin endpoints require `requireAuth(['admin'])` (internal Launch-DB authentication, not client auth).

### GET /api/admin/client-orgs

List all client organizations with metadata.

```
GET /api/admin/client-orgs
```

**Response:**
```json
{
  "organizations": [
    {
      "id": "uuid",
      "name": "PSC Engineering",
      "status": "active",
      "created_at": "2026-05-20T10:00:00Z",
      "user_count": 3,
      "active_token_count": 2,
      "primary_user_name": "Sarah Johnson",
      "primary_user_email": "sarah@psc.com"
    }
  ]
}
```

**Aggregates:**
- `user_count`: Total client_users in org
- `active_token_count`: Tokens that are not revoked and not expired
- `primary_user_*`: Contact for the org (marked `is_primary = true`)

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 403: Not an admin
- 500: Database error

---

### POST /api/admin/client-orgs

Create a new client organization.

```
POST /api/admin/client-orgs
Content-Type: application/json

{
  "name": "ABC Construction",
  "status": "active"
}
```

**Required:** `name`

**Response:**
```json
{
  "id": "uuid",
  "name": "ABC Construction",
  "status": "active",
  "created_at": "2026-05-28T10:00:00Z"
}
```

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 400: Missing `name`
- 500: Database error

---

### GET /api/admin/client-orgs/:id

Fetch organization detail + associated users + tokens.

```
GET /api/admin/client-orgs/550e8400-e29b-41d4-a716-446655440000
```

**Path Parameters:**
- `id` (UUID): Organization ID

**Response:**
```json
{
  "org": {
    "id": "uuid",
    "name": "PSC Engineering",
    "status": "active",
    "created_at": "2026-05-20T10:00:00Z"
  },
  "users": [
    {
      "id": "uuid",
      "name": "Sarah Johnson",
      "email": "sarah@psc.com",
      "is_primary": true,
      "status": "active",
      "created_at": "2026-05-20T10:00:00Z"
    },
    {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@psc.com",
      "is_primary": false,
      "status": "active",
      "created_at": "2026-05-21T10:00:00Z"
    }
  ],
  "tokens": [
    {
      "id": "uuid",
      "client_user_id": "uuid",
      "user_name": "Sarah Johnson",
      "created_at": "2026-05-25T10:00:00Z",
      "expires_at": "2026-06-25T10:00:00Z",
      "revoked_at": null
    }
  ]
}
```

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 404: Organization not found
- 500: Database error

---

### PUT /api/admin/client-orgs/:id

Update organization metadata (name, status).

```
PUT /api/admin/client-orgs/550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json

{
  "name": "PSC Engineering & Consulting",
  "status": "active|inactive"
}
```

**Response:**
```json
{
  "id": "uuid",
  "name": "PSC Engineering & Consulting",
  "status": "active",
  "updated_at": "2026-05-28T11:00:00Z"
}
```

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 404: Organization not found
- 500: Database error

---

### POST /api/admin/client-orgs/:id/users

Create a client user in an organization.

```
POST /api/admin/client-orgs/550e8400-e29b-41d4-a716-446655440000/users
Content-Type: application/json

{
  "name": "Jane Smith",
  "email": "jane@psc.com",
  "is_primary": false,
  "status": "active"
}
```

**Required:** `name`, `email`

**Response:**
```json
{
  "id": "uuid",
  "name": "Jane Smith",
  "email": "jane@psc.com",
  "org_id": "uuid",
  "is_primary": false,
  "status": "active",
  "created_at": "2026-05-28T10:00:00Z"
}
```

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 400: Missing `name` or `email`
- 404: Organization not found
- 500: Database error

---

### POST /api/admin/client-orgs/:id/users/:uid/tokens

Generate a login token for a client user.

```
POST /api/admin/client-orgs/550e8400-e29b-41d4-a716-446655440000/users/550e8400-e29b-41d4-a716-446655440001/tokens
Content-Type: application/json

{
  "expires_at": "2026-06-28T23:59:59Z"  // optional; null = no expiry
}
```

**Response:**
```json
{
  "id": "uuid",
  "raw_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2026-06-28T23:59:59Z",
  "created_at": "2026-05-28T10:00:00Z"
}
```

**CRITICAL:** `raw_token` is shown ONLY once. Client must copy it immediately. Admin cannot retrieve it later.

**Workflow:**
1. Generate cryptographically random token
2. Hash token (PBKDF2 or bcrypt)
3. Insert DB row with hash, not raw
4. Return raw token in response (one-time display)

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 404: Organization or user not found
- 500: Database error

**Example:** Send user a link like `http://localhost/client/login/eyJhbGc...` (contains raw_token).

---

### POST /api/admin/client-tokens/:tid/revoke

Revoke a specific token (before expiry).

```
POST /api/admin/client-tokens/550e8400-e29b-41d4-a716-446655440000/revoke
Content-Type: application/json
{}
```

**Path Parameters:**
- `tid` (UUID): Token ID

**Response:**
```json
{ "revoked_at": "2026-05-28T11:00:00Z" }
```

**Workflow:**
1. `UPDATE client_tokens SET revoked_at = NOW() WHERE id = $1`
2. Any ongoing session using the token's hash will fail on next request

**Auth:** `requireAuth(['admin'])`

**Errors:**
- 404: Token not found
- 500: Database error

---

## Security Model

### IDOR Prevention

All client endpoints validate that the requested project/file belongs to `req.client_org.id`:

```sql
JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
WHERE ec.client_org_id = $1  -- req.client_org.id
```

If the project doesn't belong to the authenticated client's org, a 404 is returned (not 403, to prevent enumeration).

### UUID Validation (W45-MED-2)

All path parameters expecting UUIDs are validated before hitting the DB:
```javascript
if (!isValidUUID(req.params.id)) return res.status(400).json({ error: 'invalid project id' });
```

Prevents PostgreSQL syntax errors (500) from malformed UUIDs; returns 400 instead.

### Token State Enumeration Defense (W45-MED-1)

Login failures return identical opaque message:
```
"This login link is invalid or no longer active."
```

Covers all fail cases (doesn't exist, revoked, expired, user inactive, org inactive). Attacker cannot infer state.

### File Download IDOR

The workspace-files download query chains through folder → project → EC → org:

```sql
SELECT wfile.* FROM workspace_files wfile
JOIN workspace_folders wf ON wf.id = wfile.folder_id
JOIN projects p ON p.id = wf.project_id
JOIN engineering_contracts ec ON ec.id = p.engineering_contract_id
WHERE wfile.id = $1 AND wf.share_mode = 'public' AND ec.client_org_id = $2
```

If ANY link breaks (file belongs to different org, folder is not public, project doesn't exist), 404 is returned without distinguishing why.

---

## Audit Logging

Client portal mutations are logged via `logAudit()` (internal admin action logging):

| Action | Entity Type | Details |
|---|---|---|
| `client_portal.token_created` | `client_token` | user_id, expires_at |
| `client_portal.token_revoked` | `client_token` | token_id |
| `client_portal.user_created` | `client_user` | email, is_primary |
| `client_portal.org_created` | `client_organization` | name, status |

---

## Database Schema (Summary)

| Table | Columns |
|---|---|
| `client_organizations` | id, name, status, created_at, updated_at |
| `client_users` | id, org_id, name, email, is_primary, status, created_at, updated_at |
| `client_tokens` | id, client_user_id, token_hash, expires_at, revoked_at, created_at |

---

## Examples

### Admin creates a new client organization + user + token
```bash
# 1. Create org
curl -X POST \
  -H "Cookie: lfs_session=..." \
  -H "Content-Type: application/json" \
  -d '{"name": "ABC Construction", "status": "active"}' \
  http://localhost/api/admin/client-orgs

# Response:
# { "id": "org-uuid", ... }

# 2. Create user in org
curl -X POST \
  -H "Cookie: lfs_session=..." \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@abc.com", "is_primary": true, "status": "active"}' \
  http://localhost/api/admin/client-orgs/org-uuid/users

# Response:
# { "id": "user-uuid", ... }

# 3. Generate token
curl -X POST \
  -H "Cookie: lfs_session=..." \
  -H "Content-Type: application/json" \
  -d '{"expires_at": "2026-06-28T23:59:59Z"}' \
  http://localhost/api/admin/client-orgs/org-uuid/users/user-uuid/tokens

# Response:
# { "raw_token": "eyJhbGc...", "expires_at": "2026-06-28T23:59:59Z" }

# 4. Send login link to John
# http://localhost/client/login/eyJhbGc...
```

### Client logs in + browses projects + downloads file
```bash
# 1. Click login link (browser auto-follows)
curl -L -c cookies.txt \
  http://localhost/client/login/eyJhbGc...

# 2. Fetch authenticated user + org info
curl -H "Cookie: lfs_session=..." \
  http://localhost/api/client/me

# 3. List projects
curl -H "Cookie: lfs_session=..." \
  http://localhost/api/client/projects

# 4. Get project detail
curl -H "Cookie: lfs_session=..." \
  http://localhost/api/client/projects/proj-uuid

# 5. List workspace files
curl -H "Cookie: lfs_session=..." \
  http://localhost/api/client/projects/proj-uuid/workspace-files

# 6. Download a file
curl -H "Cookie: lfs_session=..." \
  http://localhost/api/client/workspace-files/file-uuid/download \
  -o site_survey.pdf

# 7. Logout
curl -X POST \
  -H "Cookie: lfs_session=..." \
  http://localhost/api/client/logout
```

---

## Version History

- **Wave 45:** Client Portal v2 foundation (E2 milestone)
  - Token-based auth with hash storage (W45-MED-1: opaque login errors, W45-MED-2: UUID validation)
  - Admin org/user/token management
  - Client project list + workspace file download with IDOR prevention
