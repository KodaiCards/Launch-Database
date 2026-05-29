# Admin Surfaces Catalog

Complete reference of all admin-facing surfaces in Launch Database: URLs, launcher tiles, authorization, descriptions, and feature inventory.

---

## Launcher Tiles (Main Navigation)

All tiles are accessed from `/launcher.html` (after login). Authorization gating per role + portal-override grants. Audience split: 'employee' (internal staff) vs 'client' (external customers).

### 1. Admin Portal
- **URL:** `/admin.html`
- **Tile:** Admin Portal
- **Icon:** `gauge`
- **Audience:** employee only
- **Authorization:** `user.role === 'admin'`
- **Description:** Full administration: projects, clients, billing, staff, and system settings.
- **Primary Use:** Dashboard, project lifecycle, revenue tracking, all configuration.

### 2. Splice Matrix
- **URL:** `/splice.html`
- **Tile:** Splice Matrix
- **Icon:** `plug`
- **Audience:** employee
- **Authorization:** `canAccessPortal(user, 'splice') || user.role === 'admin'`
- **Description:** OSP fiber splice planning, closure management, and PDF field-document export.
- **Primary Use:** Splice planning, closure inventory, field PDF generation.

### 3. Design Portal
- **URL:** `/design.html`
- **Tile:** Design Portal
- **Icon:** `compass-drafting`
- **Audience:** employee
- **Authorization:** `canAccessPortal(user, 'design')`
- **Description:** Design pipeline: projects, hours tracking, permit submittals, and revenue.
- **Primary Use:** Fiber design, link budget, project progression, hours entry.

### 4. Permitting Portal
- **URL:** `/permitting.html`
- **Tile:** Permitting Portal
- **Icon:** `file-signature`
- **Audience:** employee
- **Authorization:** `canAccessPortal(user, 'permitting')`
- **Description:** Permit staging, document management, and permitting financials.
- **Primary Use:** Permit applications, form submission, document staging.

### 5. Time Clock
- **URL:** `/timeclock.html`
- **Tile:** Time Clock
- **Icon:** `clock`
- **Audience:** employee
- **Authorization:** `user.role !== 'customer'`
- **Description:** Clock in/out, view your hours, and manage time entries.
- **Primary Use:** Staff time entry, daily hours logging, time-off tracking.

### 6. Launch Training
- **URL:** `/training/` (Vite SPA served from `/public/training/`)
- **Tile:** Launch Training
- **Icon:** `graduation-cap`
- **Audience:** employee
- **Authorization:** `user.role !== 'customer'`
- **Description:** OSP design training modules, references, and practice exercises.
- **Primary Use:** Curriculum learning, certification exam prep, field reference.

### 7. Customer Portal
- **URL:** `/customer.html`
- **Tile:** Customer Portal
- **Icon:** `user`
- **Audience:** client
- **Authorization:** `user.role === 'customer'`
- **Description:** View your projects, progress updates, and invoices.
- **Primary Use:** Customer project visibility (read-only).

### 8. Client Portal (v2)
- **URL:** `/client-portal`
- **Tile:** Client Portal
- **Icon:** `handshake`
- **Audience:** employee
- **Authorization:** `user.role === 'admin'` (default); per-user override grants via `user_portal_access` table
- **Description:** Client-facing portal preview.
- **Primary Use:** Org/token management for external client access. Admin preview.

### 9. Offline DWG Sync
- **URL:** `/offline-sync`
- **Tile:** Offline DWG Sync
- **Icon:** `cloud-arrow-down`
- **Audience:** employee
- **Authorization:** `['admin', 'design_manager', 'design_engineer', 'permitting_manager', 'permitting_engineer'].includes(user.role)`
- **Description:** Sync DWG files to your laptop for offline AutoCAD use.
- **Primary Use:** Offline design file management.

### 10. Workspace
- **URL:** `/workspace/` (standalone file explorer)
- **Tile:** Workspace
- **Icon:** `folder-tree`
- **Audience:** employee
- **Authorization:** `['admin', 'design_manager', 'permitting_manager'].includes(user.role)`
- **Description:** Browse all employee workspaces, manage files and folders, and share documents.
- **Primary Use:** Org file storage, team document sharing.

---

## Admin Portal Main Tabs (`/admin.html`)

### Tab: Dashboard
- **ID:** `tab-dashboard` / `view-dashboard`
- **Icon:** `chart-line`
- **Sections:**
  - Active Projects stat card (click to see which projects count)
  - YTD Revenue stat card
  - RUS Project bucket (collapsed/expandable, shows aerial/underground breakdown, pdf-generate modal)
  - "Needs Attention" project list
- **Actions:** New Project button, Dashboard customize toggle, RUS bucket PDF generation
- **Data:** Real-time project stats, revenue totals, make-ready alerts.

### Tab: Projects
- **ID:** `tab-projects` / `view-projects`
- **Icon:** `folder-open`
- **Features:**
  - Project tree (Client → Service Area → Job → Project leaves)
  - Search & filter by status / client / project type
  - Bulk actions: status change, bill selected
  - New project modal
  - Budget code management sidebar
- **Columns:** Project name, breadcrumb path (Client/Program/SA), status, type, team, actions.
- **Filters:** Status (active/on-hold/completed), client, project type. Saved to localStorage per session.

### Tab: Permitting
- **ID:** `tab-permitting` / `view-permitting`
- **Icon:** `file-signature`
- **Features:**
  - Permit pipeline view (list of all permits across all statuses)
  - New permit creation modal
- **Columns:** Permit name, project link, status, submission date, actions.

### Tab: Design
- **ID:** `tab-design` / `view-design`
- **Icon:** `drafting-compass`
- **Features:**
  - Design project list (design_pipeline records)
  - New project modal
- **Columns:** Project, team, status, hours tracked, design start date, actions.

### Tab: RUS (Inspection)
- **ID:** `tab-inspection` / `view-inspection`
- **Icon:** `helmet-safety`
- **Features:**
  - RUS inspection project list (PSC gov't billing focus)
  - Filters: inspection period, month, status
  - New RUS project modal
  - Budget bucket summary (estimated/actual costs)
- **Columns:** Project, RUS period, status, inspection date, team, hours, actions.
- **Note:** Special rendering for RUS per-period budgets; tied to form submission timelines.

### Tab: Potential Permits
- **ID:** `tab-potential-permits` / `view-potential-permits`
- **Icon:** `lightbulb`
- **Features:**
  - Speculative permit list (before formal submission to agencies)
  - New potential permit modal (captures basic details before full design)
- **Columns:** Permit name, location, status, last updated, actions.

### Tab: Hours
- **ID:** `tab-hours` / `view-hours`
- **Icon:** `clock` (regular)
- **Features:**
  - Time entry ledger (filterable by staff, project, period)
  - Filters: period, month, year, group-by (staff/project/job), staff, billable (Y/N)
  - Audit log drawer (time_entries change history)
  - Import modal (bulk CSV upload)
  - New time entry modal
  - Print-to-PDF button
- **Columns:** Date, staff, project, job, hours, rate, billable flag, notes.
- **Audit Log:** Timestamp, user, action (CREATE/UPDATE/DELETE), old/new values.

### Tab: Clients
- **ID:** `tab-clients` / `view-clients` (hidden by default)
- **Icon:** `handshake`
- **Features:** Client portal section (under construction in Wave 12+).
- **Status:** Visible in Settings only for now.

### Tab: Billing
- **ID:** `tab-billing` / `view-billing`
- **Icon:** `file-invoice-dollar`
- **Features:**
  - Invoice staging (unbilled time entries grouped by project)
  - Filters: billing year
  - Bill selected modal (merge into one invoice or separate invoices)
  - Print PDF modal (render invoice PDF before final billing)
  - Multi-select for bulk invoice actions
- **Columns:** Project, period, hours, rate, total, invoice# (if billed).

### Tab: Revenue
- **ID:** `tab-revenue` / `view-revenue`
- **Icon:** `dollar-sign`
- **Features:**
  - Revenue report (billed invoices by month/project)
  - Filters: year
  - Breakdown by project type, client, team
- **Columns:** Month, project, amount billed, invoice#, date.

---

## Admin Portal Settings Modal (`/admin.html#settings`)

Accessed via **Settings** button in top-right. Max-width 920px. Contains all configuration sections.

### 1. Jobs Management
- **Section Title:** Jobs (rate source for all projects)
- **Description:** Jobs are the single source of truth for rates. The default rate set on a job applies to every new project that uses it.
- **Fields per job:**
  - Job Name (e.g., "Surveyor")
  - Billing Code (e.g., "g-1-B-4")
  - Default Type (Hourly / Footage)
  - Default Rate ($/hr or $/ft)
  - Team scope (Both / Design only / Permitting only / Construction only)
  - Uses permit calc checkbox
  - Program Scope (RUS / Non-RUS / Shared)
- **Actions:** Add Job, edit rate, push rate to all existing projects.

### 2. Project Types
- **Section Title:** Project Types
- **Description:** Categorize projects (Residential, Commercial, Anchor Tenant, etc.).
- **Actions:** Add new type inline, delete existing type.

### 3. Clients
- **Section Title:** Clients
- **Description:** Manage customer organizations (PSC, municipal, private carriers, etc.).
- **Fields per client:**
  - Name (e.g., "PSC")
  - Notes (optional)
- **Note:** Program (RUS / BAU / GFR / Other) is set per engineering contract, not per client.
- **Actions:** Add Client, delete.

### 4. Engineering Contracts
- **Section Title:** Engineering Contracts (umbrella above billing contracts; budgets attach here)
- **Description:** Used when one big agreement (e.g., "RUS 217 Engineering Contract") spans multiple billing contracts and a single budget covers the whole thing.
- **Fields per EC:**
  - Contract name
  - Client (dropdown)
  - Program (RUS / BAU / GFR / Other)
  - Work order number (optional)
  - Budget (total estimated cost)
  - Service areas (nested list)
- **Service Areas (nested under EC):**
  - Name
  - Budget allocation
  - Work order number (if EC is RUS)
  - Job list with hours estimates
- **Actions:** Create EC, edit budget, add service area, attach jobs.

### 5. Audit Log
- **Section Title:** Audit Log
- **Description:** Government-grade compliance trail. View all user actions, project changes, invoice generations, and AI tool executions. Rows cannot be deleted.
- **Filters:**
  - User (dropdown)
  - From date (picker)
  - To date (picker)
- **Columns:** Timestamp, user, action (CREATE/UPDATE/DELETE on which table), resource_id, old_values, new_values, ip_address.
- **Detail Modal:** Click a row to see full old/new JSON diff.

### 6. Training Progress
- **Section Title:** Training Progress (Wave 43)
- **Icon:** `graduation-cap`
- **Description:** Track crew completion against the OSP training curriculum. View individual progress, certification exam attempts, and overall team metrics.
- **Action:** View Dashboard button (opens `window.TrainingAdmin`).
- **Data Source:** `training_progress` + `training_cert_attempts` tables (tracks per-user lesson completion, quiz scores, cert exam attempts).

### 7. Client Portal (v2)
- **Section Title:** Client Portal
- **Icon:** `building`
- **Description:** Manage client organizations, their portal users, and login tokens. Generate a login link to share with a client — the link is valid until revoked. Tokens are shown only once at creation.
- **Actions:** New Organization, create user, revoke token.
- **Fields per organization:**
  - Org name
  - Portal users (list of approved staff who can manage the client's account)
  - Tokens (one-time-view, revokable)
- **Data Source:** `client_organizations` + `client_portal_users` + `client_portal_tokens` tables.

### 8. Invoice Templates
- **Section Title:** Invoice Templates
- **Icon:** `file-invoice`
- **Description:** Upload a PDF sample of how an invoice should look for a given (Job, Client). The AI analyses the layout once and stores an HTML template; subsequent invoices fill in real data and render to PDF. You can edit the HTML or re-analyse any time.
- **Fields per template:**
  - Job (dropdown)
  - Client (dropdown)
  - PDF upload
  - Analysis status (Pending / Complete)
  - HTML template (editable)
- **Actions:** Upload Template, re-analyse, edit HTML, delete.
- **Data Source:** `invoice_templates` table (path, claude_analysis JSON, html_template).

### 9. Migration Tools
- **Section Title:** Migration Tools
- **Description:** One-time housekeeping for data created before recent system updates. Safe to run multiple times — both operations are idempotent.
- **Tools:**
  1. **Re-nest existing projects** — Projects created before auto-nesting was wired up sit flat at the root with no rollup folders. This walks every project and moves it under `Client → Service Area → Project Type → Team`. Already-nested projects are skipped. Empty rollup folders are left in place — delete them manually if you want.
  2. **Adopt orphan files** — Files on disk that have no matching `permit_documents` row. Click **Scan** to list them, then attach each to a specific project. (Or attach all at once to one project via Bulk.)
  3. **Backfill hours to user accounts** — Existing time entries are tagged with a staff name, not a user account. This links them to user accounts where the staff name matches a user's `full_name` (or `username`) exactly. Required so engineers see "their" hours when role-based filtering is on.
  4. **Prune orphan upload files** — Files left on disk after their owning project / invoice template was deleted. The scheduler runs this once a day for files older than 7 days; click **Preview** to see what's there now, then **Delete** to clear them sooner. Permanent — cannot be undone.

### 10. Approvals Modal
- **Section Title:** (separate modal, not in Settings, accessible via "Approvals" button in top-right)
- **Description:** Pending portal change requests (design pipeline status approvals) + change log.
- **Features:** Approve/reject pending changes, view who approved/rejected and when.

---

## Standalone Admin Pages

### 1. Offline DWG Sync (`/offline-sync`)
- **Purpose:** Download DWG files for offline AutoCAD use.
- **Auth:** `['admin', 'design_manager', 'design_engineer', 'permitting_manager', 'permitting_engineer']`
- **Features:** Filter by project, select DWG versions, download as ZIP.

### 2. Workspace (`/workspace/`)
- **Purpose:** File browser and document management for employee collaboration.
- **Auth:** `['admin', 'design_manager', 'permitting_manager']`
- **Features:**
  - Folder tree (hierarchy managed by admins)
  - Upload files (drag-drop or picker)
  - Share folders with teams
  - Search across all workspaces
  - Version history (if enabled)
- **Tech:** Standalone single-page app with `/api/workspace/*` backend routes.

### 3. Project Photos (`/photos/`)
- **Purpose:** Photo gallery + scanner UI for documenting site conditions.
- **Auth:** All roles (role-gated by project)
- **Features:**
  - Photo upload (camera, file picker, scanner)
  - Tag photos by project / location
  - Gallery view with filters
  - Album export
- **Sub-pages:**
  - `/photos/` — main gallery
  - `/photos/scanner.html` — dedicated mobile scanner page (auto-upload after each photo)

### 4. Client Portal (`/client-portal`)
- **Purpose:** Client-facing project and document interface (preview mode in admin, read-only for clients).
- **Auth:** Admin (default); per-user override grants via `user_portal_access` table.
- **Features:**
  - Client org view
  - Project list (client's projects only)
  - Document drop zone (for client to upload RFI responses, photos, etc.)
  - Invoice view (read-only)
  - Change request tracking
- **Tech:** Full SPA with `/api/client-portal/*` routes. Separate auth via token for external client access.

### 5. Workspace (`/workspace/`)
- **Description:** Shared document repository for team collaboration.
- **Auth:** `['admin', 'design_manager', 'permitting_manager']`
- **Tech:** Folder tree, upload/download, ACLs per folder.

---

## Project Detail Modal (launched from Projects tab or any project row)

Accessed by clicking a project name in the Projects tab or via "Edit" action.

### Modal Sub-sections:
1. **Basic Info** — Project name, client, service area, type, status.
2. **Files** — Permit documents, design files, RFIs (drag-drop upload).
3. **Photos** — Site photos, change-order documentation (integrated with `/photos/`).
4. **Hours** — Time entries assigned to this project (read-only summary or edit if permitted).
5. **Revenue** — Invoices issued against this project.
6. **Contacts** — Client contact info, permit issuer.
7. **Change Log** — Project status history (who changed it, when, to what).

---

## Key Features Summary

### Real-Time Collaboration
- SSE-based live updates (project changes reflected to all open admins instantly)
- Optimistic UI (changes apply locally before server confirmation)
- Undo bar (15-second window to revert accidental changes)

### Authorization Layers
- Role-based access (admin / manager / engineer / customer)
- Portal-mode override (per-user grants via `user_portal_access` table)
- Row-level security (staff sees only their own hours; admins see all)

### Data Integrity
- Audit log (all mutations timestamped + user-attributed)
- Foreign key constraints (e.g., can't delete client if projects reference it)
- Rollback safe (admin can manually correct audit log entries if needed)

### Offline Capability
- Offline DWG Sync (design files to laptop for offline CAD work)
- Workspace folder caching (future: offline sync for shared docs)

### Reporting
- Revenue reports (billed invoices by month, project, client)
- Hours rollup (staff utilization, billable vs. non-billable)
- RUS compliance (inspection schedules, budget tracking per period)
- Training dashboard (crew cert completion, exam pass rates)

---

## Wave History (Notable Additions)

- **Wave 1–3:** Admin portal core (projects, design, permitting, billing tabs).
- **Wave 6:** Ongoing project lifecycle (is_ongoing flag, monthly billing, invoice generation).
- **Wave 9–11:** Project modal rebuild (EC/SA hierarchy, project nesting, breadcrumbs).
- **Wave 12:** Per-staff portal access (user_portal_access table, Settings > Portal Access).
- **Wave 12:** Client Portal v1 (org/user/token management in Settings).
- **Wave 37:** Offline DWG Sync.
- **Wave 43:** Training Progress dashboard.
- **Wave 59:** Workspace file manager.

---

## Customization & Dark Mode

- **Dark Mode Toggle:** Moon icon in top-right. Applies to all surfaces via CSS variables (--primary, --surface-1, etc.).
- **Demo Mode:** Blur financial values (YTD Revenue, hourly rates, invoice totals) for customer presentations.
- **Dashboard Customize:** Show/hide stat cards and sections via toggle.
- **Filter Persistence:** User's last filter state (status, client, date range) saved to localStorage per tab.

---

## Security & Compliance

- **HTTPS Required:** All admin surfaces require SSL (enforced in production).
- **Audit Trail:** Every action logged (user, timestamp, resource, old/new values).
- **No Deletions:** Audit log rows cannot be deleted (immutable for compliance).
- **RUS/Government:** Invoice generation auditable (PDF generation logged, AI analysis results stored).
- **AI Tool Audit:** Claude API calls for invoice template analysis logged with usage + error details.

