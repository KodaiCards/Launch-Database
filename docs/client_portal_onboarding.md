# Client Portal Onboarding Runbook

## Overview

The Launch-Database client portal (`/client`) allows external clients (like PSC) to view their own projects, manage documents, and interact with service records.

Before clients can access the portal, an admin must:
1. Create a **client organization** (represents the company)
2. Create **client users** (individuals from that company)
3. Generate **magic-link tokens** (one-time login credentials)
4. Link **engineering contracts** to the organization (so clients see their projects)

This document describes two approaches: the recommended **CLI script** (fast, automated) and the manual **admin UI** (slower, step-by-step).

---

## Before You Start

Gather the following information:

- **Organization name** — e.g., "PSC" or "Pacific Solutions Consulting"
- **Short name** (optional) — slug for URLs/displays; e.g., "psc"
- **Theme color** (optional) — hex code for portal accent color; default is `#1B5FA0` (dark blue)
- **Logo URL** (optional) — path to logo image or full URL
- **Client users** — list of people who need access:
  - Email address
  - Full name
  - Which user is the primary contact (usually the first; default if not specified)
- **Engineering contracts** — which ECs this org owns:
  - Filter by program (e.g., all `rus` contracts), OR
  - Filter by client_id (Launch DB internal), OR
  - Specify exact EC IDs
  - Default: no ECs are auto-linked; you specify them explicitly

---

## Onboarding via CLI (Recommended)

### 1. Gather information

```bash
# Example for PSC:
ORG_NAME="PSC"
ORG_SHORT="psc"
THEME="#1B5FA0"
USERS=(
  "carter@psc.com:Carter Trantham:primary"
  "ops@psc.com:Ops Team"
)
EC_PROGRAM="rus"  # Link all RUS contracts to PSC
```

### 2. Run the onboarding script

```bash
node scripts/onboard_client.js \
  --name "PSC" \
  --short-name "psc" \
  --theme-color "#1B5FA0" \
  --user "carter@psc.com:Carter Trantham:primary" \
  --user "ops@psc.com:Ops Team" \
  --link-ec-program "rus"
```

**Options:**
- `--name <string>` (required) — Organization display name
- `--user <email:name[:primary]>` (required, repeatable) — Client users
- `--short-name <string>` (optional) — Short slug
- `--theme-color <hex>` (optional) — Portal theme color (default: `#1B5FA0`)
- `--logo-url <url>` (optional) — Logo URL or path
- `--link-ec-program <program>` (optional) — Link ECs by program (`rus`, `bau`, `gfr`, `other`)
- `--link-ec-client-id <uuid>` (optional) — Further filter ECs by Launch DB client_id
- `--link-ec-id <uuid>` (repeatable) — Link specific ECs by ID
- `--token-expires-days <n>` (optional) — Token validity window (default: 365 days)
- `--output-format json|markdown` (optional) — Output format (default: markdown)
- `--dry-run` (optional) — Preview changes without writing to DB
- `--help` — Show usage

### 3. Script output

The script prints a **markdown table** with magic-link URLs:

```
## Client Onboarding Complete: PSC

**Org ID:** 550e8400-e29b-41d4-a716-446655440000
**Status:** active
**Theme:** #1B5FA0
**ECs Linked:** 5

### Magic Links (share securely — these expire 2027-05-27):

- Carter Trantham <carter@psc.com> (primary): http://localhost:8787/client/login/ABCDEfg...
- Ops Team <ops@psc.com>: http://localhost:8787/client/login/XYZ123...

**WARNING:** Tokens shown above are unrecoverable. If lost, revoke + regenerate via the admin UI at /admin.
```

### 4. Share magic links

Send each user their magic-link URL securely (e.g., via encrypted email, encrypted chat, etc.). Links are single-use and expire after 365 days (configurable).

---

## Onboarding via Admin UI (Manual)

### Step 1: Create the organization

1. Open the Launch-Database admin dashboard at `/admin`
2. Navigate to **Settings → Client Organizations** (or similar)
3. Click **Create Organization**
4. Fill in:
   - **Name:** "PSC" or full name
   - **Short Name:** "psc" (optional)
   - **Theme Color:** "#1B5FA0" (optional)
   - **Logo URL:** (optional)
5. Click **Create**
6. Note the **Organization ID** (UUID) for the next steps

### Step 2: Create client users

1. Open the org you just created (click its name)
2. Click **Add User**
3. For each client user, fill in:
   - **Email:** user's email address
   - **Name:** user's full name
   - **Primary Contact:** toggle ON for the main contact (only one per org)
4. Click **Create User**
5. Repeat for each user

### Step 3: Generate tokens

1. In the org detail view, for each user:
   - Click **Generate Token** (or similar button)
   - The system displays the magic-link URL **once only**
   - Copy the URL and send it to the user securely
   - The token is hashed in the database; the raw link is never stored
2. If a token is lost, you must revoke the old one and generate a new one

### Step 4: Link engineering contracts

1. In the org detail view, look for **Linked Engineering Contracts**
2. Select which ECs this organization owns:
   - By program (e.g., "all RUS contracts")
   - By specific Contract ID
   - By Launch DB client_id
3. Click **Link**
4. Confirm the count of ECs to be linked
5. The orgs's users now see these projects in their portal

---

## Engineering Contract Linking

When you link ECs to a client org, those ECs' projects become visible in the client portal.

### Methods

1. **By program:** All ECs with `program = 'rus'` (or `bau`, `gfr`, `other`) are linked
2. **By client_id:** All ECs owned by a specific Launch DB client_id are linked
3. **By exact EC ID:** Specific ECs (repeatable via CLI `--link-ec-id`)

### Example linking scenarios

**Scenario 1: Link all PSC RUS contracts**
```bash
node scripts/onboard_client.js \
  --name "PSC" \
  --user "carter@psc.com:Carter" \
  --link-ec-program "rus"
```

**Scenario 2: Link RUS contracts ONLY for PSC's internal client_id**
```bash
# First, find PSC's Launch DB client_id (e.g., 550e8400-e29b-41d4-a716...)
# Then:

node scripts/onboard_client.js \
  --name "PSC" \
  --user "carter@psc.com:Carter" \
  --link-ec-program "rus" \
  --link-ec-client-id "550e8400-e29b-41d4-a716-446655440000"
```

**Scenario 3: Link specific ECs**
```bash
node scripts/onboard_client.js \
  --name "PSC" \
  --user "carter@psc.com:Carter" \
  --link-ec-id "ec-id-1" \
  --link-ec-id "ec-id-2" \
  --link-ec-id "ec-id-3"
```

---

## Token Management

### Token lifecycle

- **Generated:** Admin creates a token for a client user
- **Raw value shown once:** The 32-byte base64url string is displayed immediately; never stored
- **Hashed in DB:** SHA256 hash is stored in `client_tokens` table
- **Expires:** By default, 365 days from creation (configurable)
- **Revocation:** Can be manually revoked at any time via admin UI

### Sharing tokens securely

- **DO:** Send via encrypted email, secure password manager, encrypted chat, or in-person
- **DON'T:** Commit tokens to version control, store in plaintext files, email over unencrypted channels
- **DON'T:** Log raw tokens in application logs or error messages

### Revoking / regenerating

If a token is compromised or lost:
1. Open the org in the admin UI
2. Find the user
3. Click **Revoke Token** on the old token
4. Click **Generate Token** to create a new one
5. Share the new link with the user

---

## Troubleshooting

### "duplicate key value violates unique constraint"

**Cause:** An email already exists in this org's user list.

**Fix:** Check that you're not creating duplicate users. If you need to add users to an existing org, use the admin UI to find the org and add them individually.

### "org not found"

**Cause:** The organization ID is invalid or doesn't exist.

**Fix:** Ensure the org was created successfully. Check the ID in the admin UI.

### "client_org_id not found in engineering_contracts"

**Cause:** You specified an EC ID that doesn't exist or is malformed.

**Fix:** Double-check EC IDs. Query the DB if needed:
```sql
SELECT id, name, program FROM engineering_contracts LIMIT 10;
```

### "token not found" when client tries to log in

**Cause:** Token has expired, been revoked, or the link is incorrect.

**Fix:** Generate a new token and send the fresh magic-link URL to the client.

### Magic link expires too quickly

**Cause:** Token was generated with a short `--token-expires-days` value.

**Fix:** Generate a new token with a longer expiry:
```bash
node scripts/onboard_client.js \
  --token-expires-days 730  # 2 years
```

---

## Security Notes

- **Magic links are passwords:** Treat them like passwords — share securely, never store in plaintext, revoke if exposed
- **Single-use at login:** The token is consumed when the user first logs in; subsequent access uses the `client_session` cookie
- **Token hash-only:** The database never stores the raw token, only its SHA256 hash
- **HTTPS required in production:** Ensure your deployment uses HTTPS; magic links should never travel over plain HTTP
- **Expiration is advisory:** Even if a token expires, it can still be used until the database explicitly revokes it. The `expires_at` column is checked at login time

---

## Support

If onboarding fails or you encounter issues:
1. Check the logs: `tail -f logs/application.log`
2. Verify database connectivity: `psql $DATABASE_URL -c "SELECT 1;"`
3. Ensure the `scripts/onboard_client.js` file exists and is executable: `node -c scripts/onboard_client.js`
4. Try `--dry-run` to preview changes: `node scripts/onboard_client.js ... --dry-run`
