# Client Portal — Future-Feature Spec

> **Status:** Design captured 2026-05-13. Build deferred (user: "future feature").
> Single source of truth for client portal scope. When build kicks off, start here.

---

## 1. User's answers (verbatim, 2026-05-13)

> "The client portal is separate, the login needs to be token based. I'll add a login for a client and that sets what they see when they enter the portal."
>
> "Project status and document drop mainly."
>
> "One shared client account per company with the possibility to add a manual additional client account."
>
> "Each portal should have the Launch Fiber logo and their company logo. I will attach the [logo] for Public Service. AKA PSC."
>
> "Approve sign commit upload is all okay."
>
> "Future feature."
>
> "I haven't found anything yet" (no reference tools).

## 2. Scope summary

- **Audience:** Client organizations (e.g. PSC = Public Service Company). Multiple client orgs over time, one entry per org at minimum.
- **Daily use:** Read project status + drop/pickup documents.
- **Privileged actions (allowed):** Approve, sign, commit, upload.
- **Auth:** Token-based. Orchestrator creates token per client account; client uses token URL to enter; system loads their scoped data.
- **Account model:** One primary account per company + optional additional accounts.
- **Branding:** Launch Fiber logo + per-client logo on every portal page.

## 3. How the system works today (baseline)

Existing portals all use email/password + JWT cookie session via `authMiddleware` (`auth.js`):
- Admin portal (`public/admin.html`)
- Permitting portal (`public/permitting.html`)
- Design portal (`public/design.html`)
- Splice portal (`public/splice.html`, with separate token-based contractor entry at `/splice/field/:token` and `/splice/view/:token`)

The existing token-based pattern is `routes/splice.js` — single-use OR persistent signed tokens per job. Contractor flow is the closest precedent for the client portal auth model, but contractor tokens are scoped to one job whereas client tokens need to be scoped to an organization.

**No `clients`, `client_organizations`, or `client_users` table exists today.** ECs have a `client` text field (e.g., `"PSC"`) which is informational, not relational. So this feature requires net-new schema.

**No PDF signing flow exists today.** Documents are stored as files (splice PDFs, deliverables) but signing is offline. Adding e-signature is a meaningful scope addition.

**No document drop / pickup surface exists today** in the way clients would expect. Splice contractors do upload field markup but that's per-job, not per-client.

## 4. Architecture sketch

### Data model (new tables)

```sql
-- migrations/00XX_client_portal.sql

CREATE TABLE client_organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                            -- e.g. "Public Service Company"
  short_name TEXT,                                -- e.g. "PSC"
  logo_url TEXT,                                  -- /img/clients/psc-logo.png
  theme_color TEXT,                               -- optional hex for theming
  status TEXT NOT NULL DEFAULT 'active',          -- 'active' | 'suspended' | 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES users(id)
);

CREATE TABLE client_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES client_organizations(id) ON DELETE CASCADE,
  email TEXT,                                     -- optional, for notifications + magic links
  name TEXT,                                      -- display name
  is_primary BOOLEAN NOT NULL DEFAULT FALSE,      -- one per org marked as primary
  role TEXT NOT NULL DEFAULT 'viewer',            -- 'viewer' | 'approver' | 'signer' | 'admin'
  status TEXT NOT NULL DEFAULT 'active',          -- 'active' | 'revoked'
  invited_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_user_id UUID NOT NULL REFERENCES client_users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL UNIQUE,                -- hashed, never store raw
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,                         -- NULL = long-lived; refresh on activity
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link engineering_contracts → client_organizations
ALTER TABLE engineering_contracts
  ADD COLUMN client_org_id UUID REFERENCES client_organizations(id);

-- Backfill: parse existing ec.client text → match to client_orgs after orgs are created.

CREATE TABLE client_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES client_organizations(id),
  project_id UUID REFERENCES projects(id),        -- optional scope
  ec_id UUID REFERENCES engineering_contracts(id),
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  doc_type TEXT NOT NULL,                         -- 'deliverable' | 'signed_permit' | 'approval' | 'rfi' | 'invoice' | 'other'
  direction TEXT NOT NULL,                        -- 'lf_to_client' (deliverable) | 'client_to_lf' (upload)
  uploaded_by_user UUID REFERENCES users(id),     -- internal user (if LF uploaded)
  uploaded_by_client UUID REFERENCES client_users(id), -- client user (if client uploaded)
  signed_at TIMESTAMPTZ,
  signed_by_client UUID REFERENCES client_users(id),
  approved_at TIMESTAMPTZ,
  approved_by_client UUID REFERENCES client_users(id),
  visibility TEXT NOT NULL DEFAULT 'client',      -- 'client' | 'internal_only'
  size_bytes INTEGER,
  content_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE client_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id UUID NOT NULL REFERENCES client_organizations(id),
  project_id UUID REFERENCES projects(id),
  document_id UUID REFERENCES client_documents(id),
  approval_type TEXT NOT NULL,                    -- 'invoice' | 'milestone' | 'scope_change' | 'commit'
  title TEXT NOT NULL,
  body TEXT,
  amount NUMERIC(12,2),                           -- for invoice/commit approvals
  status TEXT NOT NULL DEFAULT 'pending',         -- 'pending' | 'approved' | 'rejected' | 'expired'
  decision_by UUID REFERENCES client_users(id),
  decision_at TIMESTAMPTZ,
  decision_note TEXT,
  expires_at TIMESTAMPTZ,
  created_by_user UUID REFERENCES users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Auth model

Token issuance:
1. Admin creates a `client_organization` + primary `client_user` via Admin UI.
2. Admin clicks "Generate login link" — system creates a `client_tokens` row with a random 32-byte token; raw token is shown ONCE to admin to copy + send to client.
3. Token URL shape: `/client/login/<raw_token>` (or `?t=...` query param).
4. On token-URL hit: server hashes the raw token, looks up `client_tokens`, checks expiry + revocation, sets a `client_session` cookie (separate from internal `lfs_token` cookie), 302 to `/client/`.
5. Subsequent requests: `client_session` cookie validates against `client_tokens.token_hash` on every request via `requireClientAuth` middleware.

Additional users:
- Primary client user (or LF admin) can "Add team member" → enters email + name + role → system creates `client_users` row + new `client_tokens` row → shows the login link to copy.

Token rotation:
- Tokens can be revoked by LF admin OR by the primary client user.
- Optional: tokens auto-rotate every N days (cookie refresh + new DB row, old marked revoked on next hit).

### URL surface (all under `/client/*`)

```
GET  /client/login/:token          → consume token, set cookie, 302 to /client/
GET  /client/                      → dashboard (project status + pending actions)
GET  /client/projects              → project list (filtered by client_org_id)
GET  /client/projects/:id          → project detail (status, history, scoped docs)
GET  /client/documents             → document drop (list + filters)
GET  /client/documents/:id         → download document
POST /client/documents             → upload document (multipart)
POST /client/documents/:id/sign    → e-sign document (DocuSign or local PDF sig)
GET  /client/approvals             → pending approval list
POST /client/approvals/:id/decide  → approve/reject with note
GET  /client/account               → team members + tokens (primary only)
POST /client/account/users         → add team member (primary only)
POST /client/account/users/:id/revoke → revoke teammate (primary only)
POST /client/logout                → clear cookie
```

### Middleware

New `requireClientAuth(req, res, next)`:
- Reads `client_session` cookie
- Looks up `client_tokens` by hash
- Loads `client_users` + `client_organizations` row
- Checks status (active), revoked_at (null), expires_at (NULL or future)
- Sets `req.client_user` + `req.client_org` for downstream handlers
- IDOR guard: every query in client routes MUST filter by `req.client_org.id`

### Frontend

New SPA-style HTML at `public/client.html` + matching JS at `public/js/client/`. Mirror the Launch Fiber portal style:
- Top bar: Launch Fiber logo (left), client logo (right), current user + logout
- Side nav or tabs: Dashboard / Projects / Documents / Approvals / Account
- Client-themed accent color drawn from `client_organizations.theme_color`

## 5. Feature surface specs

### 5a. Project status

Per-project read-only view, scoped to the client_org's ECs. Show:
- Project name + status + pipeline stage
- % complete (derived from budget burn OR explicit milestones)
- Recent activity feed (status changes, milestones hit, docs delivered) — NOT raw time entries or internal comments
- Documents tied to this project (deliverables, signed permits)
- Pending approvals for this project

What to HIDE from clients (data leakage prevention):
- Billing rates
- Time_entries (raw)
- Internal comments / notes
- Other clients' projects (IDOR)
- Internal cost breakdowns

### 5b. Document drop

Two-way file exchange:
- **LF → Client (deliverables):** Internal user uploads via Admin UI → marked `direction='lf_to_client'`, `visibility='client'` → appears in client's Documents list. Client downloads.
- **Client → LF (uploads):** Client uploads via client portal → marked `direction='client_to_lf'` → appears in internal Documents tab on Admin UI + creates a notification for the responsible PM.

Storage:
- Files stored on disk (or S3 if/when scale demands) at `storage/client-docs/<org_id>/<doc_id>-<filename>`
- Server validates content_type + size limit (e.g., 50 MB cap) + virus scan if available
- Filenames sanitized (no path traversal)

### 5c. Approve / sign / commit / upload

- **Approve:** Client_approvals rows of `type='invoice'` or `type='milestone'`. Client sees pending list, opens detail, clicks Approve/Reject, optional note. Decision logged immutably (audit_logs entry).
- **Sign:** PDF signing on `client_documents`. Two implementation options:
  - **Local sig:** Generate signed PDF with embedded signer name + timestamp + cryptographic hash (no third-party). Sufficient for basic legal evidence; not the same as DocuSign.
  - **DocuSign integration:** Third-party. Higher trust but adds vendor cost + complexity.
  - **Recommendation:** local sig for v1; DocuSign as an optional enhancement.
- **Commit:** `client_approvals.type='commit'` — client commits to a scope or financial item. Same flow as approve but typically with `amount > 0` and more weight (could trigger downstream contract action).
- **Upload:** Covered in 5b.

## 6. Branding

- `public/img/launchfiber-logo.png` — already exists (Friday's `46f29e9`).
- `public/img/clients/` — new directory for per-client logos.
- `public/img/clients/psc-logo.png` — **TODO: user attached PSC logo to chat 2026-05-13; needs to be saved to this path before build. Image is blue P+S monogram (#1E88E5-ish blue) + "PUBLIC SERVICE" gray text, ~2.7:1 aspect ratio, same general size as Launch Fiber logo.**
- Each client_org row references its logo via `logo_url` column.
- Theme color column allows per-client accent color in the portal UI.

## 7. Security considerations

- **IDOR is the #1 surface.** Every query in `/client/*` routes MUST filter by `req.client_org.id`. Single missing filter = client A reads client B's data. Add an automated test that hits each client endpoint with a token for org A and asserts data for org B is unreachable.
- **Token leakage.** Tokens in URLs land in browser history + server access logs + referrer headers if any external link is clicked. Mitigations:
  - Token URL consumed once (302 to clean URL + cookie); raw token no longer in subsequent URLs
  - `Referrer-Policy: no-referrer` on `/client/*` routes
  - Audit log token_consume + token_login events
- **Document access control.** Cross-check document `org_id` against `req.client_org.id` on every download.
- **Rate limiting.** Per-token rate limit on login + per-org rate limit on uploads.
- **Action authorization.** Approve/sign/commit gated by `client_users.role` — `viewer` cannot approve, `signer` can, etc.
- **Audit trail.** Every client action logged to `audit_logs` with `actor_type='client_user'` + `actor_id=<client_user.id>`. Must be exportable for legal evidence.
- **Token rotation on suspect activity.** If a token is used from N distinct IPs in M minutes, force rotate.

## 8. Open questions for build kickoff

1. **E-sign legal strength.** Local-sig (timestamp + hash + signer name embedded in PDF) — is that legally adequate for the user's contract context, or do we need DocuSign / Adobe Sign?
2. **Document retention.** How long do client docs live? Forever? 7 years (typical engineering retention)? Per-doc retention?
3. **Notifications.** When a deliverable lands or an approval becomes pending, does the client get an email? Daily digest, or real-time?
4. **Mobile.** Do clients access from phones? If yes, the layout needs mobile-first; the existing admin/permitting portals are desktop-first.
5. **Audit export.** Do clients need to download their own audit log of their actions (for THEIR records), or is it internal-only?
6. **Invoicing surface.** Should the portal also let clients pay or just view invoices? If pay, payment processor required.
7. **Read-write split.** Some client users may be "view only" (e.g., a junior PM at PSC) vs "decision maker" (senior). Role enum (`viewer`/`approver`/`signer`/`admin`) sketched in section 4. Should all 4 roles exist or is it simpler (viewer vs full)?
8. **EC linkage.** A client_org has multiple ECs. Show ALL of them in their portal, or scope tokens to specific ECs?
9. **Project visibility default.** When a new project lands under a client's EC, does it auto-appear in their portal, or does an internal user have to mark it "client-visible"?
10. **Logo upload UI.** Does LF admin upload client logos (current sketch), or can the primary client user upload their own?

## 9. Pre-build checklist (what's needed before kick-off)

Before dispatching a build pipeline, finalize:

- [ ] Save PSC logo to `public/img/clients/psc-logo.png` (image already shared, just needs the file save)
- [ ] Answer the 10 open questions above OR explicitly defer some to v2
- [ ] Confirm the data model — adjust column names / types / FK shape if needed
- [ ] Decide e-sign approach (local vs DocuSign)
- [ ] Decide notification approach (email / digest / none for v1)
- [ ] Pick first client org for build (PSC = obvious choice, since logo is in hand)
- [ ] Inventory existing ECs flagged `client='PSC'` and how they'd map to a new `client_org_id`

## 10. Sequencing

This is a future feature, not part of the current 9-phase queue. When build kicks off, recommended pipeline:

1. **Discovery / data model finalization** (1 wave) — answer open questions, schema lockdown.
2. **Foundation wave** — migrations + auth middleware + token issuance + admin UI for client_org creation. No client-facing UI yet.
3. **Read-only client portal wave** — `/client/` dashboard + project status + document download. No uploads, no approvals.
4. **Write wave** — uploads + approve + sign + commit.
5. **Polish wave** — branding (theme color per client), mobile, notifications.
6. **Hardening wave** — IDOR test sweep, security audit, rate limiting.

Each wave gets the full audit / verification / fix / post-fix pipeline per CLAUDE.md §3.

**Rough effort estimate (pre-discovery):** 6-8 fix-agent dispatches across the 6 waves, plus 4-6 audit/verification rounds. Likely 2-3 weeks of orchestration at the current pace, but the discovery wave will sharpen this.

=== CLIENT PORTAL SPEC END ===
