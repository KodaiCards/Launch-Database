# Migration History

Complete chronological reference for every database migration file in the repository. Organized by domain and includes idempotency notes, environmental dependencies, and deprecation markers.

**Last updated:** 2026-05-28  
**Migration count:** 55 files (0001–0054, plus README.md)  
**Idempotency rule:** All migrations use `IF NOT EXISTS` / `IF NOT` / `ON CONFLICT` patterns and are safe to re-run on an existing database.

---

## Quick Reference

- **Total migrations:** 55
- **Typical application order:** numeric (0001 → 0054)
- **Fresh database:** Run migrations in numeric order without skips
- **Production deployment:** Always backup before migration; test on staging first
- **CI enforcement:** `npm run schema:sync` validates schema.sql against migrations + pg_dump

---

## Domain Organization

### Splice Matrix (0001–0028)

The standalone fiber splice planning tool. Minimal foreign keys to the main projects/billing schema.

#### Core Schema & Foundation (0001–0011)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0001** `splice_schema.sql` | `splice_projects`, `splice_locations`, `splice_cables`, `splice_buffer_tubes`, `splice_fibers`, `splice_closures`, `splice_closure_instances`, `splice_trays`, `splice_splices`, `splice_ribbon_mass_fusion_groups` | Standalone OSP fiber splice planning — no FK to projects/contracts. Projects, locations (splice points/CO/FDH/terminal), cables, buffer tubes, fibers, closures, trays, splices, ribbon groups. Designer attribution via soft link to `staff(id)`. | Phase 1 |
| **0007** `splice_strand_state.sql` | `splice_fibers` (ALTER) | Three-lane ring-cut model: express/spliced/reserved states for each strand at each location. Replaces boolean `is_cut` with enum. | Phase 2A |
| **0008** `splice_strand_metadata.sql` | `splice_fibers` (ALTER) | Strand-level circuit naming — nullable `circuit_name` column so designers can label "strand 17 = Customer ABC". | Phase 2A |
| **0010** `splice_templates.sql` | `splice_closure_templates`, `splice_template_versions`, `splice_closure_template_uses` | Closure templates for 80/20 rule (144→144 straight-through). Project clone from template. Template versioning. | Phase 2B |
| **0011** `splice_versions.sql` | `splice_project_versions`, `splice_location_versions`, `splice_cable_versions`, `splice_fiber_versions`, `splice_splice_versions` | Version snapshots for diff PDF / redline review. Each table stores before/after snapshots. | Phase 2B |

#### Field Markup & Geometry (0012–0015)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0012** `splice_field_markup.sql` | `splice_closure_public_tokens`, `splice_closure_field_markup`, `splice_splice_field_markup`, `splice_fiber_field_markup` | No-login splicer field markup via QR codes on printed documents. Public tokens for field access without login. Markup stored as JSON audit trail. | Phase 2B |
| **0013** `splice_geography.sql` | `splice_locations` (ALTER), `splice_cables` (ALTER) | Geographic coordinates — point for locations, polyline for cables. Both NULLABLE (existing projects predate coordinates). Indexes on geometry columns. | Phase 3A |
| **0015** `splice_splitters.sql` | `splice_splitters` | Passive optical splitters (fanout N) inside closures. Input fiber routed through splitter serves N outputs. FTTH design pattern. | Phase 2C |

#### Design Imports & Custom Layers (0014, 0016, 0027–0028)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0014** `splice_design_imports.sql` | `splice_design_imports`, `splice_design_import_rows` | Submit-and-review ingest of KMZ/DXF design files. Multiple AutoCAD designers submit files; master designer reviews diff and approves per-row. Source format tracked (kmz/dxf/dwg_sync). | Phase 3C |
| **0016** `splice_csv_paste.sql` | (no schema change) | CSV/Excel paste import support — documents that source_format supports 'csv' without schema modification. | Phase 2C |
| **0027** `splice_custom_layers.sql` | `splice_custom_layers` | Per-project custom layer definitions for Visible Features tree. Layer name + color + icon. | Phase 5D |
| **0028** `splice_custom_features.sql` | `splice_custom_features` | Custom layer feature storage (geometry + attributes). Idempotent creation (was forward-declared in 0027). | Phase 5H |

#### Additional Splice Features (0017–0022, 0024–0026)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0017** `splice_cable_states.sql` | `splice_cable_states` | Per-cable-at-location slack/service-loop modeling. One row per (cable, location) pair for UPSERT idempotency. | Phase 2C |
| **0018** `splice_location_types.sql` | `splice_locations` (ALTER) | Extend location type enum: add handholes, manholes, poles, pedestals, vaults, co_secondary, dan (distributed antenna network). | Phase 2C |
| **0019** `splice_cable_types.sql` | `splice_cables` (ALTER) | Extend fiber_count enum (6, 36, 72, 216, 576, 1152, 1728, 3456) + tube_size options. | Phase 2C |
| **0020** `splice_project_public_tokens.sql` | `splice_project_public_tokens` | Read-only public tokens at PROJECT level (sibling to closure-level tokens). Replaces KMZ-by-email stakeholder loop. | Phase 4.1 |
| **0021** `splice_comments.sql` | `splice_comments` | Threaded comments anchored to closures/splices (GitHub PR pattern). Parent/child threading. Resolution tracking. | Phase 4.5 |
| **0022** `splice_templates_public.sql` | `splice_closure_templates` (ALTER) | Closure-template public library — published_at IS NOT NULL = visible across all accounts. Use counter for "popular templates" ranking. | Phase 4.6 |
| **0024** `splice_trayless.sql` | `splice_splices` (ALTER) | Allow splices outside a tray — add closure_id + location_id anchor columns; relax tray_id NOT NULL; CHECK ensures every splice has ≥1 anchor. | Phase 5B |
| **0025** `splice_field_loss_records.sql` | `splice_fusion_splice_field_records` | Fusion-splicer field loss records from Fujikura Splice+ (or equivalent). GPS + loss measurement. Binds to planned splice by proximity + metadata. | Phase 4.7 |
| **0026** `splice_cable_category.sql` | `splice_cables` (ALTER) | Cable category column (unclassified/feeder/distribution/etc.) drives per-layer styling + Visible Features tree. | Phase 5D |

---

### Main Operations Platform (0002–0006, 0009, 0023, 0029–0034, 0036–0043)

Refactors, job assignments, billing, audit, and project rollup management.

#### Program & Contract Refactoring (0002–0006, 0009)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0002** `engineering_contract_program.sql` | `engineering_contracts` (ALTER) | Path B refactor: add `program` enum (rus/non_rus/other) to engineering_contracts. RUS is a contract-level designation, not client-level. | N/A |
| **0003** `drop_clients_is_rus.sql` | `clients` (ALTER) | Drop `is_rus` column from clients — consolidate source of truth to engineering_contracts.program. | N/A |
| **0004** `drop_project_types_table.sql` | `project_types` (DROP), `projects` (ALTER) | Drop parallel `project_types` table. Collapse program classification to engineering_contracts.program enum. Backfill projects.program_scope via contract. | Phase 3B |
| **0005** `rus_pricing_seed_program.sql` | `billing_codes` (INSERT/UPSERT) | Re-seed RUS pricing entries keyed on `program` (text enum) instead of dropped `project_type_id` FK. Ensures fresh DBs have RUS defaults. | Phase 3B |
| **0006** `jobs_program_scope.sql` | `jobs` (ALTER, DROP) | Replace for_psc_client/for_generic_client booleans with `program_scope` enum (rus/non_rus/shared). Cleanly segregates job dropdowns per program. | N/A |
| **0009** `rename_inspection_team_to_construction.sql` | `jobs` (ALTER), job_assignments (UPDATE) | Rename team 'inspection' → 'construction'. Updates enum in jobs.team and existing rows. | 2026-05-06 |

#### Project & Rollup Management (0023, 0036–0041)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0023** `ec_rollup_linkage.sql` | `projects` (ALTER) | Add direct `engineering_contract_id` FK on projects. Allows rollup folders (no contract_id) and leaves (with contract_id) both point to their umbrella EC. | N/A |
| **0036** `proj_sa_name_and_ec_sa_wo.sql` | `projects` (ALTER), `ec_service_areas` (ALTER) | Add nullable `service_area_name` (free-text SA for non-EC projects) + `work_order_number` on ec_service_areas. EC mode vs no-EC mode support. | Wave 1 Modal |
| **0037** `ec_job_visibility.sql` | `ec_job_visibility` | Tier-1 job-assignment precedence for EC: job_assignments → ec_job_visibility → legacy filter. Per-EC job whitelist controls clock-in cascade. | Wave 2A Modal |
| **0038** `csv_review_queue.sql` | `csv_review_queue` | CSV import tiered matching (Tier 1 WO#, Tier 2 client+SA+job, Tier 3 unmatched). Review queue for manual triage. | Wave 7 Modal |
| **0039** `reparent_legacy_projects.sql` | `projects` (UPDATE) | Idempotent migration 0039 reparents flat legacy projects under existing SA folders created by prior wave. Fixture for PSC RUS projects. | Wave 9 Modal |
| **0040** `ec_rollup_level.sql` | `projects` (ALTER) | Add EC rollup level between Client and SA. Migration creates EC folders + reparents existing SA folders. Hierarchical: Client > EC > SA > Job leaves. | Wave 10 Modal |
| **0041** `create_legacy_rollup_folders.sql` | `projects` (INSERT) | Create Client + SA rollup folders for legacy concentrator-based PSC RUS projects (fixes "still flat rollups" from Wave 9+10). | Wave 11 Modal |

#### Billing & Time Tracking (0029, 0033, 0043)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0029** `time_entries_billable.sql` | `time_entries` (ALTER) | Track billed/unbilled flag on time_entries. Timeclock CSV rows with "unbilled bucket" customer previously had nowhere to land. | N/A |
| **0033** `projected_revenue_footage_trigger.sql` | (TRIGGER creation) | Keep projected_revenue in sync for footage projects. When expected_revenue recomputes (footage edited, rate changed), projected_revenue follows via trigger. | N/A |
| **0043** `invoices_monthly_idempotency.sql` | `invoices` (ALTER, INDEX) | Add `billing_month` + `billing_year` columns + UNIQUE(project_id, billing_year, billing_month) for idempotent monthly invoice generation. | Wave 6 Modal |

#### Performance & Integrity (0030, 0034–0035, 0045)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0030** `perf_indexes.sql` | (INDEX creation only) | Wave 3 BE-Perf: 9 missing query-plan indexes. All CREATE INDEX IF NOT EXISTS, zero downtime, idempotent. | Wave 3 |
| **0034** `fix_parent_id_cascade_to_restrict.sql` | `projects` (ALTER FK) | Corrective FK update: change projects.parent_id ON DELETE CASCADE → ON DELETE RESTRICT. Prevents orphaning of leaf projects on rollup deletion. | N/A |
| **0035** `training_tables.sql` | `training_progress`, `training_cert_attempts`, `training_topic_capstone_attempts` | OSP-RW.2 schema: per-user lesson progress, cert mock exam attempts, per-topic capstone attempts. Three tables for training SPA. | OSP-RW.2 |
| **0045** `schema_integrity.sql` | (no direct table changes) | Safety migration: validates schema.sql structural consistency post-deployment. No destructive changes; pure verification. | Wave 11 |

#### Job Assignment & Portal (0032, 0042, 0047)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0032** `job_assignments.sql` | `job_assignments` | Manual job-assignment override of program_scope/for_*_client heuristic. Nullable columns (client_id, engineering_contract_id, team) allow scoping to any combination. Semantics: first match wins. | N/A |
| **0042** `user_portal_access.sql` | `user_portal_access` | Per-staff portal access matrix (Settings → Portal Access). Tracks which portals each user can access. Admin-controlled via checkbox grid. | Wave 12 Modal |
| **0047** `client_portal_v1.sql` | `client_organization_users`, `client_org_portal_settings` | Client Portal v1 schema — token-based auth per client_organization, project status + document drop, approvals. | Future Build |

---

### Audit & Logging (0046, 0048, 0050)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0046** `audit_log.sql` | `audit_log` | Immutable audit trail of all user mutations (INSERT/UPDATE/DELETE). Stores before/after state, user, timestamp, table, operation. 2B hard constraint: immutability enforced via trigger. | Wave 1.5 |
| **0048** `audit_log_retention.sql` | `audit_log_retention_settings` | Retention policy configuration — per-table TTL (e.g., 7 years for financials, 3 years for design changes). Cleanup trigger + scheduled job. | N/A |
| **0050** `audit_log_drop_immutability.sql` | `audit_log` (ALTER) | Corrective migration: remove immutability constraint (via trigger DROP). Discovered 2B constraint was too strict (prevented audit cleanup). Dropped after Wave 1.7 review. | N/A |

---

### Photos & Documents (0049, 0052, 0054)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0049** `client_documents_approvals.sql` | `client_document_bundles`, `client_documents`, `client_document_approvals`, `client_document_sign_events` | Client Portal document upload, approval workflow, signature events. Bundles group documents; approvals track who signed when. | Future Build |
| **0052** `project_photos.sql` | `project_photos`, `project_photo_sets` | Project photo attachment — field/construction/final state photos with optional geotags. Sets group related photos (e.g., "foundation before/after"). | Future Build |
| **0054** `workspace_trash.sql` | `workspace_trash`, `workspace_trash_items` | Workspace trash/soft-delete for projects/documents. Items flagged for deletion live in trash 30 days before permanent purge. | Future Build |

---

### Workspace & Folder Organization (0053)

| Migration | Tables | Purpose | Phase |
|-----------|--------|---------|-------|
| **0053** `folder_workspace.sql` | `workspaces`, `workspace_folders`, `workspace_folder_assignments`, `workspace_metadata` | Workspace container (sibling to client_organization). Folders inside workspaces organize projects/documents. Replaces flat project hierarchy. Supersedes migration 0051 (dwg_two_way_sync) as the authoritative folder/workspace model. | Future Build |

---

### Deprecated & Superseded

| Migration | Status | Reason | Replacement |
|-----------|--------|--------|-------------|
| **0051** `dwg_two_way_sync.sql` | **SUPERSEDED** | Two-way DWG file sync deemed out-of-scope when workspace/folder model (0053) locked in. Branch isolation + folder workspace replaced the sync requirement. | 0053 (folder_workspace.sql) |

---

## Reset Procedure for Fresh Database

To initialize a fresh database from migrations (typical for CI/testing):

```bash
# 1. Create database
createdb launch_database

# 2. Apply all migrations in order (the pg_migrate tool or manual psql)
psql launch_database < migrations/0001_splice_schema.sql
psql launch_database < migrations/0002_engineering_contract_program.sql
# ... (continue through 0054)

# 3. Validate schema matches schema.sql
npm run schema:sync

# 4. Seed default data (if any INSERT statements in migrations, they run as part of the migration)
# No separate seed step typically needed — all defaults are in the migrations.
```

---

## Required Environment Variables per Migration

| Variable | Migrations | Purpose |
|----------|-----------|---------|
| `DATABASE_URL` | All | Postgres connection string. Required for `npm run schema:sync` CI validation. |
| `UPLOAD_DIR` | 0052 (photos), 0049 (documents) | Directory path for project photos + client documents storage. Used by file-upload endpoints. |
| `S3_BUCKET` | Future | AWS S3 bucket name for document/photo storage (not yet implemented; placeholder for Phase 6). |
| `AUDIT_RETENTION_YEARS` | 0048 | TTL for audit_log retention — configurable per table (default 7 years for financials). |
| `WORKSPACE_TRASH_TTL_DAYS` | 0054 | Soft-delete trash retention before permanent purge (default 30 days). |
| `CLIENT_PORTAL_SECRET` | 0047 | JWT signing secret for client-portal token generation. |

---

## Idempotency Notes

### Universal Pattern

All migrations follow one of these idempotent patterns:

1. **CREATE TABLE/INDEX IF NOT EXISTS** — safe to re-run; no-op if table exists
2. **ALTER TABLE ... ADD COLUMN ... IF NOT EXISTS** — safe to re-run; no-op if column already present
3. **ON CONFLICT DO UPDATE** — safe on UPSERT; idempotent seed data
4. **Conditional TRIGGER creation** — wrapped in `CREATE OR REPLACE FUNCTION` + `DROP TRIGGER IF EXISTS`
5. **DROP IF EXISTS** — safe; idempotent cleanup migrations

### Exception: Migration 0023 (ec_rollup_linkage)

- Uses `%%` in RAISE NOTICE — original version had PostgreSQL `%` escaping bug
- Newer runs of this migration will fail if the column already exists (checked via IF NOT EXISTS)
- Fixed in later migration documentation to use single `%` for RAISE NOTICE placeholders

### Exception: Migration 0032 (job_assignments)

- Defines UNIQUE constraint via `CREATE UNIQUE INDEX` (not inline `UNIQUE (...)` table constraint)
- Reason: inline UNIQUE cannot use function calls; separate INDEX allows COALESCE/expressions
- Idempotent via `CREATE INDEX IF NOT EXISTS`

---

## Validation & Testing

### Pre-Migration

- Test on a **staging database clone** before production
- Backup production database: `pg_dump launch_database > backup.sql`
- Review migrations in order; check for potential conflicts with custom DDL

### Post-Migration

```bash
# 1. Verify schema matches expected state
npm run schema:sync

# 2. Smoke test — run application
npm start

# 3. Run test suite (includes schema integrity checks)
npm test

# 4. Monitor audit logs for unexpected errors during deployment
SELECT * FROM audit_log ORDER BY created_at DESC LIMIT 20;
```

### Known Issues

- **Migration 0032 (job_assignments):** First production deploy (2026-05-13) highlighted importance of separate CREATE UNIQUE INDEX statements for constraints with function calls. Do not use inline `UNIQUE (COALESCE(...))` syntax.
- **Migration 0023 (ec_rollup_linkage):** `%%` escaping in shell heredocs gets preserved literally in SQL. Use single `%` in RAISE NOTICE; let PostgreSQL handle escaping at runtime.
- **Migration 0034 (fix_parent_id_cascade):** Corrective — discovered too late that projects.parent_id ON DELETE CASCADE orphaned leaf projects. Moved to ON DELETE RESTRICT in production to block deletions that would leave leaves without a parent.
- **Migration 0045 (schema_integrity):** Safety check only — no structural changes, but validates post-deployment that schema.sql and current migrations are consistent.

---

## Migration Wave Assignment

Quick lookup table mapping migration to the product wave that introduced it:

| Migration | Wave | Status |
|-----------|------|--------|
| 0001–0022 | Splice Matrix Phases 1–4 | ✓ Shipped |
| 0023 | RUS-Fix | ✓ Shipped |
| 0024–0028 | Splice Phases 5 | ✓ Shipped |
| 0029–0035 | Launch-DB Wave 1–2 + OSP-RW.2 | ✓ Shipped |
| 0036–0043 | Proj-Modal Waves 1–12 | ✓ Shipped |
| 0044–0046, 0048 | Wave 3 + Audit | ✓ Shipped |
| 0047 | Client Portal v1 | ⏳ Future Build |
| 0049, 0052, 0054 | Future Build (Documents, Photos, Trash) | ⏳ Future Build |
| 0050 | Corrective (drop audit immutability) | ✓ Shipped |
| 0051 | DWG Two-Way Sync | ❌ Superseded (0053 workspace model) |
| 0053 | Workspace/Folder Organization | ⏳ Future Build |

---

## References

- **schema.sql** — Current authoritative schema state (generated via pg_dump, validated by `npm run schema:sync`)
- **migrations/README.md** — Supplemental migration notes
- **CLAUDE.md §4** — Running state and queue (wave assignments, blockers)
- **audit-output/agent-protocol.md** — Migration authoring guidelines for agents

---

*End of migration_history.md*
