# Express Route Index

Complete catalog of all API routes, portal endpoints, and file-serving routes. Organized by domain with auth gates, file locations, and brief descriptions.

---

## Auth & Session Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/auth/me` | requireAuth() | server.js | Current user info (extend with training state) |
| GET | `/api/me/portals` | requireAuth() | server.js:303 | User's accessible portals + roles |
| POST | `/api/admin/impersonate/:userId` | requireAdmin | routes/impersonation.js:21 | Admin impersonate another user |
| POST | `/api/admin/end-impersonation` | none | routes/impersonation.js:75 | End impersonation session |
| GET | `/client/login/:rawToken` | none | routes/client_portal_v2.js:46 | Token-based client login |
| POST | `/client/logout` | requireClientAuthMW | routes/client_portal_v2.js:83 | Client logout |
| GET | `/api/client/me` | requireClientAuthMW | routes/client_portal_v2.js:102 | Current client user identity |

---

## Projects & Hierarchy Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/projects` | requireAuth() | routes/projects.js:49 | List projects (filters: client, rollup, type, EC) |
| GET | `/api/projects/:id` | requireAuth() | routes/projects.js:182 | Get single project detail |
| POST | `/api/projects` | requireAuth() + requireProjectCreate | routes/projects.js:210 | Create new project (leaf or rollup) |
| PUT | `/api/projects/:id` | requireAuth() + requireProjectCreate | routes/projects.js:454 | Update project (name, dates, billing, etc.) |
| DELETE | `/api/projects/:id` | requireAdmin | routes/projects.js:678 | Delete single project (leaf only) |
| POST | `/api/projects/:id/recalc-hours` | requireAuth() | routes/projects.js:716 | Recalculate hours rollup for project tree |
| POST | `/api/projects/recalc-all` | requireAdmin | routes/projects.js:730 | Recalculate hours across all projects |
| DELETE | `/api/projects/:id/with-hours` | requireAdmin | routes/projects.js:766 | Delete project + all hours entries |
| POST | `/api/projects/resolve-or-create` | requireAuth() + requireProjectCreate | routes/projects.js:835 | Find/create project via EC or SA labels |
| DELETE | `/api/projects/:id/with-tree` | requireAdmin | routes/projects.js:1164 | Delete project tree (rollups + children) |
| GET | `/api/projects/:id/monthly-hours-breakdown` | requireAuth() | routes/projects.js:1270 | Ongoing project monthly hours by period |
| POST | `/api/projects/:id/generate-monthly-invoice` | requireManagerOrAdmin | routes/projects.js:1296 | Generate monthly invoice for ongoing project |
| POST | `/api/projects/:id/unbill` | requireManagerOrAdmin | routes/project_billing.js:20 | Reverse billing on project |
| PUT | `/api/projects/:id/mark-billed` | requireManagerOrAdmin | routes/project_billing.js:33 | Mark project billed (after invoice generated) |
| POST | `/api/projects/:id/bill-and-clone` | requireManagerOrAdmin | routes/project_billing.js:49 | Bill project + create next-month clone |
| GET | `/api/projects/:id/detail` | requireAuth() | routes/project_detail.js:23 | Full project detail (all nested data) |

---

## Engineering Contracts (EC) & Service Areas Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/contracts` | requireAuth() | routes/contracts.js:16 | List all engineering contracts |
| POST | `/api/contracts` | requireAdmin | routes/contracts.js:47 | Create new EC |
| PUT | `/api/contracts/:id` | requireAdmin | routes/contracts.js:65 | Update EC (scope, program, dates) |
| DELETE | `/api/contracts/:id` | requireAdmin | routes/contracts.js:101 | Delete EC |
| GET | `/api/clients/:client_id/service-areas` | requireAuth() | routes/clients.js:89 | List SAs for client (EC + no-EC hybrid) |

---

## Jobs Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/jobs` | requireAuth(['admin','design_manager','permitting_manager','design_engineer','permitting_engineer']) | routes/jobs.js:27 | List jobs (cached, 3-tier precedence: job_assignments → ec_job_visibility → legacy) |
| GET | `/api/jobs/:id` | requireAuth(['admin','design_manager','permitting_manager','design_engineer','permitting_engineer']) | routes/jobs.js:156 | Get single job detail |
| GET | `/api/_debug/jobs` | requireAdmin | routes/jobs.js:169 | Debug: all jobs including visibility flags |
| POST | `/api/jobs` | requireAdmin | routes/jobs.js:193 | Create job |
| PUT | `/api/jobs/:id` | requireAdmin | routes/jobs.js:252 | Update job (name, rate, status) |
| POST | `/api/jobs/:id/reset-override` | requireAdmin | routes/jobs.js:341 | Clear manual job-assignment override |
| PUT | `/api/jobs/:id/propagate-rate` | requireAdmin | routes/jobs.js:360 | Propagate rate change downstream to projects |
| DELETE | `/api/jobs/:id` | requireAdmin | routes/jobs.js:382 | Delete job |
| GET | `/api/jobs/:id/assignments` | requireAdmin | routes/jobs.js:403 | List manual job-assignments for this job |
| POST | `/api/jobs/:id/assignments` | requireAdmin | routes/jobs.js:427 | Create manual job-assignment (override) |
| DELETE | `/api/job-assignments/:id` | requireAdmin | routes/jobs.js:456 | Delete manual job-assignment |

---

## Design Pipeline Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/design` | requireAuth(['admin','design_manager','design_engineer']) | routes/design_pipeline.js:16 | Get design pipeline view (state, stage progress) |
| PUT | `/api/projects/:id/ongoing` | requireAuth(['admin','design_manager','permitting_manager']) | routes/design_pipeline.js:36 | Toggle ongoing project flag |
| PUT | `/api/design/:projectId/advance` | requireAuth(['admin','design_manager','design_engineer']) | routes/design_pipeline.js:53 | Advance design pipeline stage |
| PUT | `/api/design/:projectId/regress` | requireAuth(['admin','design_manager','design_engineer']) | routes/design_pipeline.js:98 | Regress design pipeline stage |

---

## Permitting & Potential Permits Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/permits` | requireAuth(['admin','permitting_manager','permitting_engineer']) | routes/permits.js:20 | Get permitting pipeline view |
| PUT | `/api/permits/:projectId/advance` | requireAuth(['admin','permitting_manager','permitting_engineer']) | routes/permits.js:47 | Advance permit stage |
| PUT | `/api/permits/:projectId/regress` | requireAuth(['admin','permitting_manager','permitting_engineer']) | routes/permits.js:85 | Regress permit stage |
| POST | `/api/permits/:projectId/documents` | requireAuth(['admin','permitting_manager','permitting_engineer']) | routes/permits.js:120 | Upload permit document |
| GET | `/api/potential-permits` | requireAuth() | routes/potential_permits.js:20 | List potential permits (opportunities) |
| POST | `/api/potential-permits` | requireAuth(['admin','design_manager','design_engineer','permitting_manager','permitting_engineer']) | routes/potential_permits.js:35 | Create potential permit |
| PUT | `/api/potential-permits/:id` | requireAuth(['admin','permitting_manager']) | routes/potential_permits.js:68 | Update potential permit |
| DELETE | `/api/potential-permits/:id` | requireAuth(['admin','permitting_manager']) | routes/potential_permits.js:85 | Delete potential permit |

---

## Inspection Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/inspection` | requireAuth(['admin','design_manager','permitting_manager']) | routes/inspection.js:47 | Get inspection pipeline view |

---

## Splice Matrix Routes (6800+ lines)

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/splice/matrix/:token` | public-token | routes/splice.js:100 | Field-crew view (QR-on-PDF link) |
| GET | `/splice/view/:token` | public-token | routes/splice.js:180 | Field-crew view (legacy) |
| GET | `/api/splice/projects` | requireAuth() | routes/splice.js:220 | List splice projects (user can access) |
| POST | `/api/splice/projects` | requireAuth() | routes/splice.js:270 | Create splice project |
| GET | `/api/splice/projects/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:450 | Get splice project detail + tree |
| PUT | `/api/splice/projects/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:710 | Update splice project (name, notes) |
| POST | `/api/splice/projects/:id/clone` | requireAuth() + requireSpliceAccess | routes/splice.js:890 | Clone splice project + all closures |
| DELETE | `/api/splice/projects/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:1000 | Delete splice project + tree |
| GET | `/api/splice/projects/:id/template` | requireAuth() + requireSpliceAccess | routes/splice.js:1040 | Get template for new closure in project |
| GET | `/api/splice/closures/:id` | requireAuth() | routes/splice.js:1120 | Get closure detail + fiber tree |
| POST | `/api/splice/closures` | requireAuth() | routes/splice.js:1270 | Create closure in project |
| PUT | `/api/splice/closures/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:1450 | Update closure |
| DELETE | `/api/splice/closures/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:1630 | Delete closure |
| GET | `/api/splice/fibers/:id` | requireAuth() | routes/splice.js:1720 | Get fiber detail |
| POST | `/api/splice/fibers` | requireAuth() | routes/splice.js:1850 | Create fiber (pair in closure) |
| PUT | `/api/splice/fibers/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:2000 | Update fiber |
| DELETE | `/api/splice/fibers/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:2100 | Delete fiber |
| POST | `/api/splice/splices` | requireAuth() | routes/splice.js:2200 | Create splice (join) in closure |
| PUT | `/api/splice/splices/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:2350 | Update splice (loss, type, notes) |
| DELETE | `/api/splice/splices/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:2450 | Delete splice |
| GET | `/api/splice/markups/:id` | requireAuth() | routes/splice.js:2550 | Get markup (annotation overlay) |
| POST | `/api/splice/markups` | requireAuth() | routes/splice.js:2670 | Create markup on closure diagram |
| PUT | `/api/splice/markups/:id` | requireAuth() + requireSpliceAccess | routes/splice.js:2780 | Update markup |
| GET | `/api/splice/markups/:id/image` | requireAuth() | routes/splice.js:3154 | Get markup image artifact |
| DELETE | `/api/splice/markups/:id` | requireAuth() | routes/splice.js:3170 | Delete markup |
| POST | `/api/splice/projects/:id/loss-records` | requireAuth() + requireSpliceAccess | routes/splice.js:3376 | Create loss-record (test data) |
| GET | `/api/splice/projects/:id/loss-records` | requireAuth() + requireSpliceAccess | routes/splice.js:3402 | List loss-records for project |
| PUT | `/api/splice/loss-records/:id/bind` | requireAuth() | routes/splice.js:3420 | Bind loss-record to splice |
| DELETE | `/api/splice/loss-records/:id` | requireAuth() | routes/splice.js:3445 | Delete loss-record |
| POST | `/splice/field/:token/loss-records` | public-token | routes/splice.js:3458 | Field-crew submit test data (QR form) |
| GET | `/api/splice/closure-models` | requireAuth() | routes/splice.js:3492 | List closure templates/models |
| GET | `/api/splice/projects/:id/search` | requireAuth() + requireSpliceAccess | routes/splice.js:3505 | Search fibers/closures in project |
| GET | `/api/splice/search` | requireAuth() | routes/splice.js:3552 | Global search across all projects |
| GET | `/api/splice/projects/:id/events` | requireAuth() + requireSpliceAccess | routes/splice.js:3624 | SSE live-update stream for project |
| GET | `/api/splice/projects/:id/export-html` | requireAuth() + requireSpliceAccess | routes/splice.js:3704 | Export splice matrix as HTML |
| GET | `/api/splice/projects/:id/export-pdf` | requireAuth() + requireSpliceAccess | routes/splice.js:3714 | Export splice matrix as PDF (Puppeteer) |
| GET | `/api/splice/projects/:id/export-kmz` | requireAuth() + requireSpliceAccess | routes/splice.js:3841 | Export splice locations as KMZ (GIS) |
| POST | `/api/splice/projects/:id/imports` | requireAuth() + requireSpliceAccess | routes/splice.js:3907 | Import splice data (CSV/JSON) |
| GET | `/api/splice/projects/:id/imports` | requireAuth() + requireSpliceAccess | routes/splice.js:3972 | List pending imports |
| GET | `/api/splice/imports/:id` | requireAuth() | routes/splice.js:3988 | Get import detail + change preview |
| POST | `/api/splice/imports/:id/changes/:cid/decision` | requireAuth() | routes/splice.js:4008 | Accept/reject individual import change |
| POST | `/api/splice/imports/:id/apply` | requireAuth() | routes/splice.js:4030 | Apply all import changes |
| DELETE | `/api/splice/imports/:id` | requireAuth() | routes/splice.js:4119 | Delete (discard) import |
| POST | `/api/splice/projects/:id/import-paste` | requireAuth() + requireSpliceAccess | routes/splice.js:4158 | Paste + import splice data inline |
| GET | `/api/splice/fibers/:id/path` | requireAuth() | routes/splice.js:4252 | Get fiber's full path (closure chain) |
| POST | `/api/splice/closures/:id/splitters` | requireAuth() | routes/splice.js:4297 | Add splitter to closure |
| GET | `/api/splice/projects/:id/splitters` | requireAuth() | routes/splice.js:4355 | List splitters in project |
| PUT | `/api/splice/splitters/:id` | requireAuth() | routes/splice.js:4381 | Update splitter (outputs, channels) |
| DELETE | `/api/splice/splitters/:id` | requireAuth() | routes/splice.js:4475 | Delete splitter |
| PUT | `/api/splice/splitter-outputs/:id` | requireAuth() | routes/splice.js:4494 | Update splitter output (fiber binding) |

---

## Invoicing & Billing Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/invoices` | requireManagerOrAdmin | routes/invoices.js:22 | List invoices |
| POST | `/api/invoices/generate-pdf` | requireManagerOrAdmin | routes/invoices.js:56 | Generate single invoice PDF |
| POST | `/api/invoices/preview-makeup` | requireManagerOrAdmin | routes/invoices.js:103 | Preview makeup/adjustment invoice |
| POST | `/api/invoices/generate-pdf-from-projects` | requireManagerOrAdmin | routes/invoices.js:121 | Batch generate invoices from projects |
| GET | `/api/invoices/generate-pdf/preview-data` | requireManagerOrAdmin | routes/invoices.js:164 | Preview invoice data before render |
| DELETE | `/api/invoices/:id` | requireManagerOrAdmin | routes/invoices.js:189 | Delete invoice record |
| GET | `/api/invoice-templates` | requireManagerOrAdmin | routes/invoice_templates.js:116 | List invoice templates |
| GET | `/api/invoice-templates/:id` | requireManagerOrAdmin | routes/invoice_templates.js:138 | Get template detail |
| POST | `/api/invoice-templates` | requireManagerOrAdmin + upload | routes/invoice_templates.js:160 | Upload new template |
| PUT | `/api/invoice-templates/:id` | requireManagerOrAdmin | routes/invoice_templates.js:235 | Update template (name, program scope) |
| POST | `/api/invoice-templates/:id/regenerate` | requireManagerOrAdmin | routes/invoice_templates.js:258 | Regenerate template from source PDF |
| DELETE | `/api/invoice-templates/:id` | requireManagerOrAdmin | routes/invoice_templates.js:289 | Delete template |
| GET | `/api/invoice-templates/:id/reference` | requireManagerOrAdmin | routes/invoice_templates.js:307 | Get template reference (placeholders doc) |
| POST | `/api/invoices/preview-template` | requireManagerOrAdmin | routes/invoice_templates.js:351 | Preview template render |
| POST | `/api/invoices/preview-from-projects` | requireManagerOrAdmin | routes/invoice_templates.js:404 | Preview invoice from project data |
| POST | `/api/invoices/render-pdf-from-html` | requireManagerOrAdmin | routes/invoice_templates.js:467 | Render PDF from HTML (internal) |
| POST | `/api/billing/bill-multiple` | requireManagerOrAdmin | routes/billing.js:33 | Batch bill multiple projects |
| GET | `/api/billing/batches` | requireManagerOrAdmin | routes/billing.js:250 | List billing batches (queued, completed) |
| GET | `/api/billing/batches/:id` | requireManagerOrAdmin | routes/billing.js:273 | Get batch detail + status |
| POST | `/api/billing/batches` | requireManagerOrAdmin | routes/billing.js:308 | Create new billing batch |
| DELETE | `/api/billing/batches/:id` | requireManagerOrAdmin | routes/billing.js:372 | Delete batch |
| POST | `/api/billing/batches/:id/confirm` | requireManagerOrAdmin | routes/billing.js:390 | Confirm + commit batch |
| GET | `/api/billing/report` | requireManagerOrAdmin | routes/billing.js:523 | Get billing report (summary) |

---

## Revenue & Reports Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/revenue/monthly-summary` | requireManagerOrAdmin | routes/revenue.js:20 | Monthly revenue rollup |
| GET | `/api/revenue/by-client` | requireManagerOrAdmin | routes/revenue.js:86 | Revenue breakdown by client |
| GET | `/api/revenue/details` | requireManagerOrAdmin | routes/revenue.js:175 | Detailed revenue (line items) |
| GET | `/api/revenue/hours-utilization` | requireManagerOrAdmin | routes/revenue.js:241 | Hours utilization (billable/admin/unbilled) |
| GET | `/api/revenue/projected-total` | requireManagerOrAdmin | routes/revenue.js:287 | Year-to-date + projected revenue |
| GET | `/api/revenue/unbilled` | requireManagerOrAdmin | routes/revenue.js:397 | Unbilled hours + project inventory |
| GET | `/api/reports/hours` | requireAuth(['admin','design_manager','permitting_manager']) | routes/reports.js:20 | Hours report (by staff, project, period) |
| GET | `/api/reports/billing` | requireAuth(['admin','design_manager','permitting_manager']) | routes/reports.js:50 | Billing report (status, aging) |

---

## Clients & Staff Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/clients` | requireAuth() | routes/clients.js:22 | List clients |
| POST | `/api/clients` | requireAdmin | routes/clients.js:38 | Create client |
| PUT | `/api/clients/:id` | requireAdmin | routes/clients.js:54 | Update client (name, contact) |
| DELETE | `/api/clients/:id` | requireAdmin | routes/clients.js:132 | Delete client |
| GET | `/api/staff` | requireAuth() | routes/staff.js:23 | List staff (current user + visible) |
| GET | `/api/staff/all` | requireAdmin | routes/staff.js:35 | List all staff (admin view) |
| POST | `/api/staff` | requireAdmin | routes/staff.js:46 | Create staff user |
| PUT | `/api/staff/:id` | requireAdmin | routes/staff.js:70 | Update staff (name, role, availability) |
| DELETE | `/api/staff/:id` | requireAdmin | routes/staff.js:113 | Delete staff |
| POST | `/api/admin/staff-with-user` | requireAdmin | routes/admin.js:1312 | Create staff + linked user simultaneously |

---

## Time Entries Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/time-entries` | requireAuth() | routes/time_entries.js:22 | List time entries (user's or manager view) |
| POST | `/api/time-entries` | requireAuth() | routes/time_entries.js:118 | Create time entry (clock-in + out) |
| POST | `/api/time-entries/bulk` | requireAuth() | routes/time_entries.js:200 | Bulk create time entries (import) |
| PUT | `/api/time-entries/:id` | requireAuth() | routes/time_entries.js:262 | Update time entry (hours, notes) |
| DELETE | `/api/time-entries/:id` | requireAuth() | routes/time_entries.js:340 | Delete time entry |
| DELETE | `/api/time-entries/by-staff/:staffId` | requireAuth(['admin','design_manager','permitting_manager']) | routes/time_entries.js:412 | Bulk delete staff's time entries |

---

## Hours CSV Import Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| POST | `/api/hours/csv-validate` | requireAdmin + upload | routes/hours_csv.js:249 | Validate hours CSV (preview matching) |
| POST | `/api/hours/csv-edit-row` | requireAdmin | routes/hours_csv.js:828 | Edit single CSV row before commit |
| POST | `/api/hours/csv-commit` | requireAdmin | routes/hours_csv.js:879 | Apply all CSV rows to DB |
| POST | `/api/hours/csv-queue-unmatched` | requireAdmin | routes/hours_csv.js:1162 | Queue unmatched rows for manual review |
| GET | `/api/csv-review-queue` | requireAdmin | routes/hours_csv.js:1197 | Get manual-match review queue |
| POST | `/api/csv-review-queue/:id/match` | requireAdmin | routes/hours_csv.js:1232 | Manually match + confirm queued row |
| POST | `/api/csv-review-queue/:id/discard` | requireAdmin | routes/hours_csv.js:1308 | Discard queued row |
| GET | `/api/csv-review-queue/pending-count` | requireAdmin | routes/hours_csv.js:1327 | Count pending manual-match items |

---

## Training Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/training/progress` | requireAuth() | routes/training.js:23 | Get current user's lesson progress |
| POST | `/api/training/progress` | requireAuth() | routes/training.js:58 | Record lesson completion + quiz score |
| POST | `/api/training/cert-attempt` | requireAuth() | routes/training.js:143 | Submit cert mock-exam attempt |
| GET | `/api/training/cert-attempts` | requireAuth() | routes/training.js:200 | List user's past cert attempts |
| POST | `/api/training/capstone-attempt` | requireAuth() | routes/training.js:221 | Submit topic capstone quiz |
| GET | `/api/training/admin/progress-overview` | requireAuth() | routes/training.js:265 | Admin: employee progress overview |

---

## DWG CAD Sync Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/dwg-sync/v2/manifest` | requireAuth() | routes/dwg_two_way_sync.js:29 | Get file manifest (versions, checksums) |
| POST | `/api/dwg-sync/v2/push` | requireAuth() + upload | routes/dwg_two_way_sync.js:66 | Upload CAD file (staging) |
| GET | `/api/dwg-sync/v2/staging` | requireAuth() | routes/dwg_two_way_sync.js:151 | List staged files awaiting promotion |
| POST | `/api/dwg-sync/v2/promote/:staging_id` | requireManagerOrAdmin | routes/dwg_two_way_sync.js:191 | Promote staged file to canonical |
| POST | `/api/dwg-sync/v2/reject/:staging_id` | requireManagerOrAdmin | routes/dwg_two_way_sync.js:311 | Reject staged file |
| GET | `/api/dwg-sync/v2/download/:canonical_file_id` | requireAuth() | routes/dwg_two_way_sync.js:355 | Download canonical CAD file |
| GET | `/api/dwg-sync/projects` | requireAuth() | routes/dwg_sync.js:43 | List projects for CAD sync |
| GET | `/api/dwg-sync/projects/:id/manifest` | requireAuth() | routes/dwg_sync.js:80 | Get project's CAD file manifest |
| GET | `/api/dwg-sync/files/:docId` | requireAuth() | routes/dwg_sync.js:146 | Get CAD file metadata |
| GET | `/api/dwg-sync/state` | requireAuth() | routes/dwg_sync.js:205 | Get CAD sync connection state |
| POST | `/api/dwg-sync/state` | requireAuth() | routes/dwg_sync.js:226 | Update CAD sync state (e.g., reconnect) |

---

## Project Documents Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| POST | `/api/projects/:projectId/documents` | requireAuth() | routes/project_documents.js:21 | Upload project document |
| GET | `/api/projects/:projectId/documents` | requireAuth() | routes/project_documents.js:39 | List project documents |
| DELETE | `/api/projects/documents/:docId` | requireAuth() | routes/project_documents.js:52 | Delete project document |
| GET | `/api/_debug/uploads` | requireAdmin | routes/project_documents.js:71 | Debug: list all uploads |

---

## Project Photos Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| POST | `/api/project-photos` | requireAuth + upload | routes/project_photos.js:52 | Upload project photo |
| GET | `/api/project-photos` | requireAuth | routes/project_photos.js:132 | List project photos (with metadata) |
| GET | `/api/project-photos/:id/download` | requireAuth | routes/project_photos.js:169 | Download photo artifact |
| DELETE | `/api/project-photos/:id` | requireAuth | routes/project_photos.js:205 | Delete photo |

---

## Audit Log Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/admin/audit-log` | requireAdmin | routes/audit_log.js:35 | List audit log entries (filters by resource, action, date) |
| GET | `/api/admin/audit-log/:id` | requireAdmin | routes/audit_log.js:128 | Get single audit entry detail |
| GET | `/api/admin/audit-log/retention/status` | requireAdmin | routes/audit_log.js:164 | Get audit retention policy status |
| POST | `/api/admin/audit-log/retention/archive-now` | requireAdmin | routes/audit_log.js:205 | Archive old audit logs (per retention policy) |
| PUT | `/api/admin/audit-log/:id` | requireAdmin | routes/audit_log.js:235 | Update audit entry (e.g., add notes) |
| DELETE | `/api/admin/audit-log/:id` | requireAdmin | routes/audit_log.js:311 | Delete audit entry (retention cleanup) |

---

## Pricing Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/pricing` | requireAuth() | routes/pricing.js:40 | List pricing models (by job, client, program) |
| GET | `/api/pricing/lookup` | requireAuth() | routes/pricing.js:58 | Lookup rate for job |
| POST | `/api/pricing` | requireManagerOrAdmin | routes/pricing.js:81 | Create pricing rule |
| PUT | `/api/pricing/:id` | requireManagerOrAdmin | routes/pricing.js:102 | Update pricing rule |
| DELETE | `/api/pricing/:id` | requireManagerOrAdmin | routes/pricing.js:128 | Delete pricing rule |
| GET | `/api/pricing/gaps` | requireAuth(['admin','design_manager','permitting_manager']) | routes/pricing.js:144 | Find jobs without pricing |

---

## Client Portal Routes (v2)

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/client/projects` | requireClientAuthMW | routes/client_portal_v2.js:109 | List projects visible to client |
| GET | `/api/client/projects/:id` | requireClientAuthMW | routes/client_portal_v2.js:139 | Get project detail (client view) |
| GET | `/api/client/projects/:project_id/workspace-files` | requireClientAuthMW | routes/client_portal_v2.js:174 | List workspace files for project |
| GET | `/api/client/workspace-files/:file_id/download` | requireClientAuthMW | routes/client_portal_v2.js:229 | Download workspace file |
| GET | `/api/client/documents` | requireClientAuthMW | routes/client_portal_v2.js:510 | List client portal documents |
| GET | `/api/client/documents/:id/download` | requireClientAuthMW | routes/client_portal_v2.js:553 | Download client document |
| POST | `/api/client/documents` | requireClientAuthMW | routes/client_portal_v2.js:593 | Upload client document |
| GET | `/api/client/approvals` | requireClientAuthMW | routes/client_portal_v2.js:708 | List pending approvals (for client to respond) |
| POST | `/api/client/approvals/:id/respond` | requireClientAuthMW | routes/client_portal_v2.js:737 | Client approve/reject request |

---

## Admin Client Portal Management Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/admin/client-orgs` | requireAuth(['admin']) | routes/client_portal_v2.js:275 | List client organizations |
| POST | `/api/admin/client-orgs` | requireAuth(['admin']) | routes/client_portal_v2.js:311 | Create client organization |
| GET | `/api/admin/client-orgs/:id` | requireAuth(['admin']) | routes/client_portal_v2.js:328 | Get org detail |
| PUT | `/api/admin/client-orgs/:id` | requireAuth(['admin']) | routes/client_portal_v2.js:377 | Update org |
| POST | `/api/admin/client-orgs/:id/users` | requireAuth(['admin']) | routes/client_portal_v2.js:412 | Add user to org |
| POST | `/api/admin/client-orgs/:id/users/:uid/tokens` | requireAuth(['admin']) | routes/client_portal_v2.js:444 | Generate token for org user |
| POST | `/api/admin/client-tokens/:tid/revoke` | requireAuth(['admin']) | routes/client_portal_v2.js:488 | Revoke client token |
| POST | `/api/admin/client-orgs/:id/approvals` | requireAuth(['admin']) | routes/client_portal_v2.js:777 | Create approval request for org |
| GET | `/api/admin/client-progress` | requireAdmin | routes/customer_portal.js:254 | Client progress overview (admin) |
| GET | `/api/customer-clients/:user_id` | requireAdmin | routes/customer_portal.js:334 | List clients for customer user |
| POST | `/api/customer-clients` | requireAdmin | routes/customer_portal.js:350 | Assign customer to client |
| DELETE | `/api/customer-clients/:user_id/:client_id` | requireAdmin | routes/customer_portal.js:375 | Remove customer from client |

---

## Portal Access Control Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/portal-access/capabilities` | requireAdmin | routes/portal_access.js:29 | List available portal capabilities (checkboxes) |
| GET | `/api/portal-access` | requireAdmin | routes/portal_access.js:46 | Get per-staff portal access matrix |
| POST | `/api/users/:userId/portal-access/:portalKey` | requireAdmin | routes/portal_access.js:94 | Grant portal access to staff |
| DELETE | `/api/users/:userId/portal-access/:portalKey` | requireAdmin | routes/portal_access.js:124 | Revoke portal access |

---

## AI Assistant Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| POST | `/api/ai/upload` | requireAdmin + upload | routes/ai.js:2294 | Upload file for AI analysis |
| GET | `/api/ai/upload/:id` | requireAdmin | routes/ai.js:2370 | Get upload status |
| POST | `/api/ai/chat` | requireAdmin | routes/ai.js:2409 | Chat with AI (multi-turn conversation) |

---

## Dashboard & Navigation Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/dashboard/active-list` | requireAuth(['admin','design_manager','permitting_manager']) | routes/dashboard.js:72 | Active projects list (for dashboard) |
| GET | `/api/dashboard` | requireAuth(['admin','design_manager','permitting_manager']) | routes/dashboard.js:94 | Dashboard summary data |

---

## Admin Utilities Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| POST | `/api/_admin/migrate-nesting` | requireAdmin | routes/admin.js:51 | Migrate project nesting (Wave 9+) |
| GET | `/api/_admin/orphan-files` | requireAdmin | routes/admin.js:146 | Find orphaned uploads |
| POST | `/api/_admin/adopt-orphan` | requireAdmin | routes/admin.js:188 | Assign orphan upload to project |
| POST | `/api/_admin/adopt-orphans-bulk` | requireAdmin | routes/admin.js:248 | Bulk adopt orphans |
| GET | `/api/_admin/hours-backfill-preview` | requireAdmin | routes/admin.js:305 | Preview hours import reconciliation |
| POST | `/api/_admin/hours-backfill` | requireAdmin | routes/admin.js:355 | Apply hours backfill |
| POST | `/api/_admin/prune-orphan-files` | requireAdmin | routes/admin.js:396 | Delete orphaned uploads |
| GET | `/api/_admin/db-sizes` | requireAdmin | routes/admin.js:431 | Get DB table sizes |
| POST | `/api/_admin/audit-cleanup` | requireAdmin | routes/admin.js:480 | Cleanup audit log per retention |
| GET | `/api/_admin/rus-hours-debug` | requireAdmin | routes/admin.js:529 | RUS hours reconciliation debug |
| GET | `/api/_admin/import-trace` | requireAdmin | routes/admin.js:737 | Trace hours import history |
| POST | `/api/_admin/reattribute-rollup-hours` | requireAdmin | routes/admin.js:787 | Fix hours attribution to rollup |
| GET | `/api/_admin/import-trace/:batch_id` | requireAdmin | routes/admin.js:954 | Get specific import batch trace |
| GET | `/api/_admin/disk-stats` | none | routes/admin.js:1082 | Disk usage stats |
| POST | `/api/_admin/uploads-cleanup` | none | routes/admin.js:1186 | Cleanup old uploads |
| POST | `/api/admin/diag/wave14-cleanup` | requireAdmin | server.js:827 | Wave 14 diagnostic cleanup |
| GET | `/api/admin/diag/rollup-state` | requireAdmin | server.js:909 | Rollup state debug view |

---

## Miscellaneous Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/api/project-types` | requireAuth() | routes/project_types.js:31 | List project types (deprecated, returns empty) |
| POST | `/api/project-types` | gone | routes/project_types.js:42 | Deprecated endpoint |
| PUT | `/api/project-types/:id` | gone | routes/project_types.js:43 | Deprecated endpoint |
| DELETE | `/api/project-types/:id` | gone | routes/project_types.js:44 | Deprecated endpoint |
| GET | `/api/concentrators` | requireAuth() | routes/concentrators.js:15 | List network concentrators |
| POST | `/api/concentrators` | requireAdmin | routes/concentrators.js:30 | Create concentrator |
| POST | `/api/admin/recent-activity` | requireAdmin | routes/recent_activity.js:12 | Get recent activity log |
| POST | `/api/undo/:token` | requireAuth() | routes/undo.js:24 | Undo operation via token |
| GET | `/api/config/mapbox` | requireAuth() | server.js:938 | Get Mapbox API key (public) |

---

## File & Static Routes

| Method | URL | Auth Gate | File | Purpose |
|--------|-----|-----------|------|---------|
| GET | `/training/*` | requireAuth() | server.js:475 | OSP training SPA (Vite dist) |
| GET | `/photos/*` | requireAuth() | server.js:498 | Project photos directory |
| GET | `/workspace/*` | requireAuth() | server.js:505 | Client workspace files directory |
| GET | `/uploads/*` | none | server.js:1018 | Public uploads (no auth) |
| GET | `/sw-dwg-sync.js` | none | server.js:483 | Service worker for CAD sync |
| GET | `/permitting` | none | server.js:988 | Permitting portal HTML |
| GET | `/design` | none | server.js:989 | Design portal HTML |
| GET | `/client-portal` | requireAuth() | server.js:992 | Client portal HTML redirect |
| GET | `/offline-sync` | requireAuth() | server.js:996 | Offline sync worker HTML |
| GET | `/login` or `/login.html` | none | server.js:462 | Login page |
| GET | `/index.html` | none | server.js:1001 | Redirect to admin |
| GET | `/` (admin) | none | server.js:1027 | Admin portal (SPA HTML) |
| GET | `/` (employees) | none | server.js:1070 | Employee portal (SPA HTML) |
| GET | `/client/` or `/client/index.html` | none | server.js:1079 | Client portal HTML |
| GET | `*` (catch-all) | none | server.js:1083 | SPA 404 fallback (admin/employee) |

---

## Summary

**Total Routes:** ~358 endpoints across 30+ route files

**By Domain:**
- Splice matrix: ~85 routes (single largest subsystem)
- Projects/hierarchy: ~17 routes
- Invoicing/billing: ~18 routes
- Admin utilities: ~14 routes
- Training: 6 routes
- Time entries: 6 routes
- DWG CAD sync: 11 routes
- Permitting: 8 routes
- Client portal v2: ~20 routes
- Reports/revenue: 8 routes
- Auth: 7 routes
- Other: ~15 routes

**Most Restricted:** `/api/_admin/*` + `/api/admin/*` (requireAdmin only)

**Least Restricted:** `/uploads/*`, `/login`, `/client/`, static files (public)

**Most Complex:** `/api/splice/*` subsystem (splicing matrix, closures, fibers, imports)
