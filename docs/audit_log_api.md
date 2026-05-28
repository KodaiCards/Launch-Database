# Audit Log API Reference

The audit log is a tamper-resistant system-wide compliance record for government project tracking. Every material operation (create, update, delete, generate invoice, etc.) is recorded with actor, timestamp, entity reference, before/after state, source, IP, and user-agent.

**Schema:** `migration 0046_audit_log.sql`, `migration 0048_audit_retention.sql`

**Key principles:**
- **Immutable at write:** rows are never deleted (DROP TABLE ... DELETE trigger prevents removal via Wave 51 hardening)
- **PII redacted at read:** sensitive fields (passwords, tokens, SSNs, credit cards, etc.) are replaced with `[REDACTED]` before leaving the API
- **Malleable for compliance:** admin can edit before_data / after_data / meta fields via PUT endpoint to correct erroneous logs or mark sensitive corrections (Wave 51 enhancement per Carter 2026-05-28 directive)
- **Soft-archive retention:** rows older than `hot_retention_days` are marked `archived_at` (not deleted); survives 7-year RUS retention window

**Access:** admin-only (requireAdmin middleware). All endpoints require `POST /admin/auth` session.

---

## Endpoints

### GET /api/admin/audit-log

Paginated list of audit log entries with optional filters. PII is redacted at read-time.

**Query parameters:**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `limit` | int | 50 | Max results per page (capped at 200) |
| `offset` | int | 0 | Pagination offset |
| `actor_user_id` | uuid | — | Filter by actor user ID (exact match) |
| `action` | text | — | Filter by action type (exact match, e.g., "user.create") |
| `entity_type` | text | — | Filter by entity type (exact match, e.g., "project") |
| `entity_id` | text | — | Filter by entity ID (exact match) |
| `from` | ISO 8601 date | — | Rows where `at >= from` |
| `to` | ISO 8601 date | — | Rows where `at <= to` |
| `search` | text | — | Case-insensitive ILIKE across action, entity_type, actor_username |

**Response:** 200 OK

```json
{
  "rows": [
    {
      "id": 12345,
      "at": "2026-05-28T14:23:45Z",
      "actor_user_id": "550e8400-e29b-41d4-a716-446655440000",
      "actor_username": "alice@example.com",
      "actor_type": "user",
      "action": "project.create",
      "entity_type": "project",
      "entity_id": "proj-12345",
      "before_data": null,
      "after_data": {
        "id": "proj-12345",
        "name": "RUS OSP Design Phase 2",
        "client_id": "cli-01",
        "is_rollup": false
      },
      "source": "api",
      "ip": "192.0.2.145",
      "user_agent": "Mozilla/5.0...",
      "meta": {
        "reason": "Authorized by Carter T."
      }
    },
    ...
  ],
  "total": 4321,
  "limit": 50,
  "offset": 0
}
```

**Special header:** `X-Audit-Redacted: true` indicates PII redaction was applied.

**Example requests:**

```bash
# All project operations in May 2026
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log?entity_type=project&from=2026-05-01&to=2026-05-31'

# Actions by a specific user
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log?actor_user_id=550e8400-e29b-41d4-a716-446655440000&limit=100'

# Search for invoice generation runs
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log?search=invoice'
```

**Error responses:**

- `400` — Invalid limit or offset
- `401` — Unauthorized (not logged in as admin)
- `500` — Server error (logged to console)

---

### GET /api/admin/audit-log/:id

Fetch a single audit log entry by ID. Full JSONB data is returned; PII is redacted.

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Audit log entry ID |

**Response:** 200 OK

```json
{
  "id": 12345,
  "at": "2026-05-28T14:23:45Z",
  "actor_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "actor_username": "alice@example.com",
  "actor_type": "user",
  "action": "project.create",
  "entity_type": "project",
  "entity_id": "proj-12345",
  "before_data": null,
  "after_data": { ... },
  "source": "api",
  "ip": "192.0.2.145",
  "user_agent": "Mozilla/5.0...",
  "meta": { ... }
}
```

**Response header:** `X-Audit-Redacted: true`

**Error responses:**

- `400` — Invalid ID format (not a valid integer)
- `404` — Entry not found
- `401` — Unauthorized
- `500` — Server error

---

### PUT /api/admin/audit-log/:id

Update an audit log entry (Wave 51 enhancement). Allows admin to correct erroneous logs, redact newly-discovered sensitive values, or add compliance notes.

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Audit log entry ID |

**Request body:** (all fields optional; only provided fields are updated)

```json
{
  "before_data": { ... },
  "after_data": { ... },
  "meta": { ... },
  "action": "project.update",
  "entity_type": "project",
  "entity_id": "proj-12345",
  "actor_username": "alice@example.com",
  "source": "admin_ui",
  "ip": "192.0.2.100",
  "user_agent": "Mozilla/5.0..."
}
```

**Allowed fields:**
- `before_data` (jsonb)
- `after_data` (jsonb)
- `meta` (jsonb)
- `action` (text)
- `entity_type` (text)
- `entity_id` (text)
- `actor_username` (text)
- `source` (text)
- `ip` (text)
- `user_agent` (text)

**Note:** `id`, `at`, `actor_user_id`, `actor_type` are immutable.

**Response:** 200 OK (returns the updated row with PII redacted)

```json
{
  "id": 12345,
  "at": "2026-05-28T14:23:45Z",
  "actor_user_id": "550e8400-e29b-41d4-a716-446655440000",
  "actor_username": "alice@example.com",
  "actor_type": "user",
  "action": "project.update",
  "entity_type": "project",
  "entity_id": "proj-12345",
  "before_data": { ... },
  "after_data": { ... },
  "source": "admin_ui",
  "ip": "192.0.2.100",
  "user_agent": "Mozilla/5.0...",
  "meta": { "compliance_note": "Corrected SSN redaction" }
}
```

**Side effect:** The edit operation itself is logged as an `audit.edit` action, creating a new row to document who edited the log and when.

**Error responses:**

- `400` — Invalid ID format or no updatable fields provided
- `404` — Entry not found
- `401` — Unauthorized
- `500` — Server error

**Example:** Correct an erroneous before_data entry and add a compliance note:

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "before_data": { "status": "draft" },
    "meta": { "correction_reason": "Before data was incorrect; corrected by Carter per directive" }
  }' \
  'https://app.example.com/api/admin/audit-log/12345'
```

---

### DELETE /api/admin/audit-log/:id

Hard delete an audit log entry (Wave 51, admin-only). The deletion is itself logged as an `audit.delete` action.

**Path parameters:**

| Param | Type | Description |
|-------|------|-------------|
| `id` | integer | Audit log entry ID to delete |

**Response:** 200 OK

```json
{
  "ok": true,
  "id": 12345
}
```

**Side effect:** A new audit log entry is created with action=`audit.delete`, entity_type=`audit_log`, entity_id=`<deleted-id>`, and meta contains the deleted row's action / entity_type / entity_id for compliance trail.

**Error responses:**

- `400` — Invalid ID format
- `404` — Entry not found
- `401` — Unauthorized
- `500` — Server error

---

### GET /api/admin/audit-log/retention/status

Query retention policy configuration and current archive state.

**Response:** 200 OK

```json
{
  "hot_retention_days": 730,
  "total_retention_days": 2557,
  "last_archive_run_at": "2026-05-21T08:00:00Z",
  "last_archive_row_count": 1523,
  "hot_row_count": 45678,
  "archived_row_count": 98234
}
```

**Field explanations:**

| Field | Meaning |
|-------|---------|
| `hot_retention_days` | Rows older than this many days are eligible for archival (soft-archive, marked with `archived_at`) |
| `total_retention_days` | RUS/USDA 7-year compliance window (2557 days ≈ 7 years) |
| `last_archive_run_at` | When the last archive operation executed |
| `last_archive_row_count` | How many rows were archived in the last run |
| `hot_row_count` | Current count of rows with `archived_at IS NULL` (active, searchable) |
| `archived_row_count` | Current count of rows with `archived_at IS NOT NULL` (soft-archived, retained for compliance) |

**Error responses:**

- `401` — Unauthorized
- `500` — Server error

---

### POST /api/admin/audit-log/retention/archive-now

Manually trigger an archival run. Moves rows older than `hot_retention_days` to archived state (marks `archived_at` timestamp). Does not delete rows.

**Request body:** empty (or omitted)

**Response:** 200 OK

```json
{
  "rows_archived": 1523,
  "cutoff_at": "2025-11-26T00:00:00Z"
}
```

**Field explanations:**

| Field | Meaning |
|-------|---------|
| `rows_archived` | Count of rows moved from hot to archived state in this run |
| `cutoff_at` | Effective cutoff date (rows older than this were archived) |

**Side effect:** A new audit log entry is created with action=`audit.archive_run`, entity_type=`audit_log`, and meta contains `{rows_archived, cutoff_at, trigger: 'manual'}`.

**Error responses:**

- `401` — Unauthorized
- `500` — Server error (e.g., Postgres connection failure)

---

## Schema Reference

### audit_log table

```sql
CREATE TABLE public.audit_log (
    id                bigserial PRIMARY KEY,
    at                timestamptz NOT NULL DEFAULT now(),
    actor_user_id     uuid,
    actor_username    text,
    actor_type        text NOT NULL DEFAULT 'user',
    action            text NOT NULL,
    entity_type       text NOT NULL,
    entity_id         text,
    before_data       jsonb,
    after_data        jsonb,
    source            text,
    ip                text,
    user_agent        text,
    meta              jsonb,
    archived_at       timestamptz,  -- soft-archive marker (Wave 48)
    CONSTRAINT audit_log_actor_user_id_fkey FOREIGN KEY (actor_user_id) REFERENCES users(id) ON DELETE SET NULL
);
```

**Indexes:** (optimized for admin queries)

- `idx_audit_log_at` — ORDER BY at DESC (for timeline queries)
- `idx_audit_log_actor` — (actor_user_id, at DESC) (for user activity reports)
- `idx_audit_log_entity` — (entity_type, entity_id, at DESC) (for entity change history)
- `idx_audit_log_action` — (action, at DESC) (for action-type filtering)
- `idx_audit_log_hot` — PARTIAL: `(at DESC) WHERE archived_at IS NULL` (fast "hot" queries)
- `idx_audit_log_archived` — PARTIAL: `(archived_at)` (archive maintenance)

**Columns:**

| Column | Type | Description |
|--------|------|-------------|
| `id` | bigserial | Unique log entry ID |
| `at` | timestamptz | Timestamp of the operation (not editable; immutable) |
| `actor_user_id` | uuid | User who performed the action (nullable; set to null if user deleted) |
| `actor_username` | text | Username/email snapshot at log time (editable for compliance corrections) |
| `actor_type` | text | Type of actor: 'user' (default), 'api', 'system' (immutable) |
| `action` | text | Action type (e.g., 'project.create', 'invoice.generate'); editable |
| `entity_type` | text | Resource type being changed (e.g., 'project', 'invoice'); editable |
| `entity_id` | text | ID of the resource; editable |
| `before_data` | jsonb | State before the operation; editable for corrections |
| `after_data` | jsonb | State after the operation; editable for corrections |
| `source` | text | Where the operation came from: 'api', 'admin_ui', 'system', 'batch_job'; editable |
| `ip` | text | Client IP address; editable for privacy corrections |
| `user_agent` | text | Browser/client user-agent header; editable for privacy |
| `meta` | jsonb | Arbitrary additional context (operation reason, metadata); editable |
| `archived_at` | timestamptz | Timestamp when the row was archived; set by retention scheduler |

**Immutable columns:** `id`, `at`, `actor_type`

**Editable columns (PUT):** all others

---

### audit_retention_config table

```sql
CREATE TABLE public.audit_retention_config (
    id                    integer PRIMARY KEY,  -- always 1 (singleton)
    hot_retention_days    integer NOT NULL DEFAULT 730,
    total_retention_days  integer NOT NULL DEFAULT 2557,
    last_archive_run_at   timestamptz,
    last_archive_row_count integer,
    updated_at            timestamptz NOT NULL DEFAULT now(),
    CONSTRAINT audit_retention_config_id_check CHECK ((id = 1))
);
```

**Purpose:** tracks retention policy and archive operation history. Single row (id=1) by design.

**Default thresholds:**
- `hot_retention_days = 730` — keep last 2 years in hot (searchable) state
- `total_retention_days = 2557` — keep total of ~7 years (RUS/USDA compliance window)

---

## Helper Functions

### logAudit(pool, opts)

Synchronously log an audit event. Called by every API endpoint and background job that modifies state.

**Location:** `routes/_audit.js`

**Usage:**

```javascript
const { logAudit } = require('./_audit');

await logAudit(pool, {
  req,                         // Express request object
  action: 'project.create',    // operation type
  entity_type: 'project',      // resource type
  entity_id: project.id,       // resource ID
  before: null,                // state before (null if create)
  after: project,              // state after (the full object)
  source: 'api',               // where the op came from
  meta: {                       // optional metadata
    reason: 'User created via design portal',
    approval_id: 'apr-123'
  },
  actor_type: 'user'           // default: 'user' (can override for 'system', 'api')
});
```

**Options signature:**

```typescript
{
  req: Express.Request,                    // used to extract user, IP, user-agent
  action: string,                          // required; format "entity.verb"
  entity_type: string,                     // required
  entity_id: string | number | uuid,       // coerced to string
  before?: object | null,                  // defaults to null
  after?: object | null,                   // defaults to null
  source?: string,                         // defaults to 'api'
  meta?: object | null,                    // defaults to null
  actor_type?: string                      // defaults to 'user'
}
```

**Behavior:**

- Extracts user, IP, user-agent from the request
- Coerces entity_id to string
- Serializes before/after/meta as JSONB
- Inserts a new row into audit_log
- Errors are caught and console.error'd (never break the operation)

**Returns:** `Promise<void>` (fire-and-forget; errors don't propagate)

**Example in context:**

```javascript
// In routes/projects.js POST create handler
const project = await createProjectInDb(pool, req.body);
await logAudit(pool, {
  req,
  action: 'project.create',
  entity_type: 'project',
  entity_id: project.id,
  after: project,
  source: 'api',
  meta: { reason: req.body.reason }
});
res.status(201).json(project);
```

---

### redactPII(obj)

Deep clone an object and redact sensitive keys. Used automatically by all audit_log API endpoints before returning data to the client.

**Location:** `routes/_audit.js`

**Usage:**

```javascript
const { redactPII } = require('./_audit');

const original = {
  name: 'Alice',
  email: 'alice@example.com',
  password: 'super-secret-123',
  ssn: '123-45-6789',
  bank_account: '9876543210',
  meta: {
    api_key: 'sk_live_xyz123',
    notes: 'High-value client'
  }
};

const redacted = redactPII(original);
// Result:
// {
//   name: 'Alice',                    // retained
//   email: 'alice@example.com',       // retained (operational)
//   password: '[REDACTED]',           // redacted
//   ssn: '[REDACTED]',                // redacted
//   bank_account: '[REDACTED]',       // redacted
//   meta: {
//     api_key: '[REDACTED]',          // redacted (recursive)
//     notes: 'High-value client'      // retained
//   }
// }
```

**Sensitive key patterns (22 total, case-insensitive substring match):**

- **Passwords:** `password`, `password_hash`, `passwordhash`, `hash`
- **Tokens/Keys:** `token`, `raw_token`, `rawtoken`, `api_key`, `apikey`, `secret`, `private_key`, `privatekey`
- **Identity:** `ssn`, `social_security`, `socialsecurity`, `tax_id`, `taxid`, `ein`
- **Financial:** `credit_card`, `creditcard`, `card_number`, `cardnumber`, `cvv`, `bank_account`, `bankaccount`, `routing_number`, `routingnumber`
- **Personal:** `dob`, `date_of_birth`, `dateofbirth`

**Retained (not redacted):**

- Names, usernames, emails, phone numbers (operational fields)
- Addresses, locations
- IP addresses, user-agents
- Project names, entity descriptions

**Behavior:**

- Recursively walks objects and arrays
- Returns `null` / `undefined` unchanged
- Primitives (string, number, boolean) returned as-is unless key is sensitive
- Arrays are mapped over element-by-element

**Returns:** cloned object with sensitive keys replaced by `[REDACTED]` string

---

### archiveOldAuditRows(pool, options = {})

Soft-archive old audit log rows by setting `archived_at` timestamp. Rows are never deleted; they're marked as archived and excluded from default queries.

**Location:** `routes/_audit.js`

**Usage:**

```javascript
const { archiveOldAuditRows } = require('./_audit');

// Use config defaults
const result1 = await archiveOldAuditRows(pool);

// Override hot_retention_days
const result2 = await archiveOldAuditRows(pool, { hot_retention_days: 180 });
```

**Options:**

```typescript
{
  hot_retention_days?: number  // override config; defaults to audit_retention_config row
}
```

**Behavior:**

1. Reads current `hot_retention_days` from `audit_retention_config` (or uses options override)
2. Calculates cutoff date: `now() - hot_retention_days`
3. Updates all rows where `archived_at IS NULL AND at < cutoff` to set `archived_at = now()` (transactional)
4. Updates `audit_retention_config` with `last_archive_run_at` and `last_archive_row_count`
5. Logs the archive operation as an `audit.archive_run` action
6. Logs to console: `[audit-retention] archived 1523 rows older than 730 days (cutoff: 2025-11-26T...)`

**Returns:**

```typescript
{
  rows_archived: number,    // count of rows transitioned to archived state
  cutoff_at: Date          // effective cutoff date
}
```

**Error handling:** Errors are re-thrown (caller decides whether to fail gracefully); always logged to console first.

**Example in context (scheduled job):**

```javascript
// In server.js or a background worker
const schedule = require('node-schedule');
schedule.scheduleJob('0 2 * * *', async () => {
  // Run archive job at 2 AM daily
  try {
    const result = await archiveOldAuditRows(pool);
    console.log(`Archived ${result.rows_archived} rows`);
  } catch (e) {
    console.error('Archive failed:', e.message);
    // decide whether to retry, page on-call, etc.
  }
});
```

---

## Action Types

Exhaustive list of action types currently logged in the codebase (as of 2026-05-28):

**Audit operations:**
- `audit.archive_run` — manual or scheduled archival run
- `audit.edit` — admin edited an audit_log row
- `audit.delete` — admin deleted an audit_log row

**Project/Entity operations:**
- `project.create`, `project.update`, `project.delete`
- `dwg.push` — design watermark push
- `dwg.promote` — design watermark promotion
- `dwg.reject` — design watermark rejection

**Document operations:**
- `project_photo.upload`
- `project_photo.delete`
- `workspace.file_upload`
- `workspace.file_restore`
- `workspace.folder_create`
- `workspace.folder_update`
- `workspace.trash`
- `workspace.purge`, `workspace.purge_old` — cleanup
- `workspace.share_grant`, `workspace.share_revoke` — access control

**Permitting/Invoice operations:**
- `create`, `created`, `update`, `updated`, `delete`, `deleted` — generic CRUD (legacy; newer code uses namespaced actions)
- `execute` — operation execution (e.g., invoice generation)
- `void` — reversal (e.g., invoice void)
- `generate` — content generation (e.g., invoice PDF)
- `grant`, `revoke` — permissions

**Format convention:** entity type + verb (e.g., `project.create`, `invoice.generate`). Legacy actions use verb only (`create`, `update`, `delete`).

---

## Compliance Notes

**RUS/USDA 7-year retention:**

The default `total_retention_days = 2557` (~7 years) aligns with RUS Bulletin 1751F-630 audit trail requirements for government project engineering records. Rows older than `hot_retention_days` (2 years, default 730 days) are soft-archived but retained indefinitely.

**PII at read:** Sensitive data (passwords, tokens, SSNs, credit cards) is redacted at read-time BEFORE rows leave the API. The database stores the full data (required for before/after reconstruction), but no redacted field ever surfaces to the client unless the row is edited by admin.

**Malleable logs:** Wave 51 enhancement allows admin to edit before_data, after_data, and meta fields post-hoc. This serves two purposes:
1. Correct erroneous logs (e.g., a failed operation that was logged incorrectly)
2. Redact newly-discovered sensitive values (e.g., a vendor API key exposed in a before_data field)

Every edit is itself logged as an `audit.edit` action for compliance trail.

**Immutable actor/timestamp:** `actor_type` and `at` cannot be edited, ensuring the log's audit trail itself is auditable.

---

## Examples

### Query all invoices generated in a date range

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log?action=invoice.generate&from=2026-05-01&to=2026-05-31&limit=100'
```

### Find all operations by a user

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log?actor_user_id=550e8400-e29b-41d4-a716-446655440000&limit=50'
```

### Retrieve a specific audit entry and its redacted PII

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log/12345'
```

### Correct an erroneous before_data entry

```bash
curl -X PUT -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "before_data": { "status": "draft", "name": "Corrected Project Name" },
    "meta": { "correction_reason": "Erroneous status logged; corrected per RUS audit" }
  }' \
  'https://app.example.com/api/admin/audit-log/12345'
```

### Check retention status

```bash
curl -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log/retention/status'
```

### Trigger manual archive

```bash
curl -X POST -H "Authorization: Bearer $TOKEN" \
  'https://app.example.com/api/admin/audit-log/retention/archive-now'
```

---

## See Also

- `migration 0046_audit_log.sql` — initial schema
- `migration 0048_audit_retention.sql` — retention config
- Wave 51 hardening notes (routes/audit_log.js commit history)
- RUS Bulletin 1751F-630 § Audit Trail Requirements
